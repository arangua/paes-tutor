import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { decompressVersionContent } from '@/lib/utils/version-content'
import { cuidValidator } from '@/lib/utils/version-validators'
import { generateEmbedding, cosineSimilarity } from '@/lib/utils/embeddings'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { parseRequestBody } from '../helpers'
import { safeRound } from '../validation-utils'

const semanticSearchSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  query: z.string().min(1).max(500),
  limit: z.number().int().min(1).max(50).optional().default(20),
  threshold: z.number().min(0).max(1).optional().default(0.5), // Umbral de similitud mínima
})

/**
 * POST: Búsqueda semántica de versiones usando embeddings
 * 
 * Busca versiones por significado usando embeddings de IA.
 * Requiere API key de OpenAI configurada.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  return withVersionRateLimit(request, () =>
    withRequestTimeout(request, async () => {
      const startTime = Date.now()
      const requestId = getOrCreateRequestId(request)
      
      try {
        // Autenticación, contexto enriquecido y request ID
        const authContextResult = await withAuthContext(request, startTime)
        if (!authContextResult.success) {
          return addTracingHeaders(authContextResult.error, requestId, Date.now() - startTime)
        }

        const { user: dbUser, enrichedContext } = authContextResult.data

        // Parsear body JSON
        const bodyResult = await parseRequestBody(request, 'POST')
        if (!bodyResult.success) {
          return addTracingHeaders(bodyResult.error, requestId, Date.now() - startTime)
        }

        const validation = semanticSearchSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, query, limit, threshold } = validation.data

        // Verificar que la nota pertenece al estudiante
        const note = await prisma.studyNote.findFirst({
          where: {
            id: noteId,
            studentId: dbUser.student.id,
          },
        })

        if (!note) {
          const response = NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

      // Obtener API key del usuario o de variables de entorno
      let openaiApiKey: string | undefined
      
      try {
        const { getAIConfig } = await import('@/lib/ai-service')
        const aiConfig = await getAIConfig(dbUser.id, 'openai')
        if (aiConfig && aiConfig.apiKey) {
          openaiApiKey = aiConfig.apiKey
        } else {
          openaiApiKey = process.env.OPENAI_API_KEY
        }
      } catch (error) {
        logger.warn({ error }, 'Error al obtener API key de OpenAI')
        openaiApiKey = process.env.OPENAI_API_KEY
      }

      if (!openaiApiKey) {
        return NextResponse.json(
          { 
            error: 'API key de OpenAI no configurada',
            message: 'Configura OPENAI_API_KEY en variables de entorno o en tu perfil para usar búsqueda semántica'
          },
          { status: 400 }
        )
      }

      // Generar embedding de la búsqueda
      const queryEmbedding = await generateEmbedding(query, openaiApiKey)
      
      if (!queryEmbedding) {
        return NextResponse.json(
          { error: 'No se pudo generar embedding. Verifica tu API key de OpenAI.' },
          { status: 500 }
        )
      }

      // Obtener todas las versiones de la nota
      const versions = await prisma.studyNoteVersion.findMany({
        where: { noteId: note.id },
        orderBy: { createdAt: 'desc' },
        take: 100, // Limitar para no procesar demasiadas versiones
      })

      // Incluir versión actual
      const allVersions = [
        {
          id: note.id,
          title: note.title,
          content: note.content,
          tags: note.tags,
          name: null,
          createdAt: note.updatedAt,
          isCompressed: false,
        },
        ...versions.map(v => ({
          id: v.id,
          title: v.title,
          content: v.content,
          tags: v.tags,
          name: (v as { name?: string | null }).name || null,
          createdAt: v.createdAt,
          isCompressed: (v as { isCompressed?: boolean }).isCompressed || false,
        })),
      ]

      // Generar embeddings y calcular similitud para cada versión
      const versionScores = await Promise.all(
        allVersions.map(async (version) => {
          // Descomprimir si es necesario
          const content = version.isCompressed
            ? await decompressVersionContent(version.content, true, 'versions/semantic-search')
            : version.content

          // Crear texto combinado para embedding
          const versionText = `${version.title} ${content} ${version.tags || ''} ${version.name || ''}`.trim()

          // Generar embedding de la versión
          const versionEmbedding = await generateEmbedding(versionText, openaiApiKey)

          if (!versionEmbedding) {
            return { version, similarity: 0 }
          }

          // Calcular similitud coseno
          const similarity = cosineSimilarity(queryEmbedding, versionEmbedding)

          return { version: { ...version, content }, similarity }
        })
      )

      // Filtrar por umbral y ordenar por similitud
      const filteredAndSorted = versionScores
        .filter(item => item.similarity >= threshold)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, limit)
        .map(item => ({
          ...item.version,
          similarity: safeRound(item.similarity, 2), // Redondear a 2 decimales
        }))

        // Auditar acceso
        auditSensitiveOperation('version.semantic_search', enrichedContext, {
          metadata: { noteId, query, resultsCount: filteredAndSorted.length },
        })

        const response = NextResponse.json({
          query,
          results: filteredAndSorted,
          totalFound: filteredAndSorted.length,
          threshold,
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.semantic_search', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'POST')
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

