import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { z } from 'zod'
import { compareVersions } from '@/lib/utils/text-diff'
import { decompressVersionContent } from '@/lib/utils/version-content'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { safeToISOString } from '../validation-utils'

const compareVersionsSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionId1: cuidValidator('ID de versión 1 inválido'),
  versionId2: cuidValidator('ID de versión 2 inválido'),
})

const compareVersionsQuerySchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionId1: cuidValidator('ID de versión 1 inválido'),
  versionId2: cuidValidator('ID de versión 2 inválido'),
})

/**
 * GET: Comparar dos versiones de una nota (usando query parameters)
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
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

        const { searchParams } = new URL(request.url)
        const queryParams = Object.fromEntries(searchParams.entries())
        const validation = compareVersionsQuerySchema.safeParse(queryParams)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Parámetros inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionId1, versionId2 } = validation.data

        // Auditar acceso
        auditSensitiveOperation('version.compare.queried', enrichedContext, {
          metadata: { noteId, versionId1, versionId2 },
        })

        // Reutilizar lógica interna
        const result = await compareVersionsInternal(noteId, versionId1, versionId2, dbUser.student.id)
        return addTracingHeaders(addCorsHeaders(result), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.compare.queried', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'compare', {
          customMessage: 'Error al comparar versiones',
        })
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

/**
 * Función interna para comparar versiones (reutilizable)
 * 
 * @param noteId - ID de la nota
 * @param versionId1 - ID de la primera versión a comparar
 * @param versionId2 - ID de la segunda versión a comparar
 * @param studentId - ID del estudiante (para validación de acceso)
 * @returns NextResponse con la comparación de versiones
 */
async function compareVersionsInternal(
  noteId: string,
  versionId1: string,
  versionId2: string,
  studentId: string
): Promise<NextResponse> {
  // Verificar que la nota pertenece al estudiante
  const note = await prisma.studyNote.findFirst({
    where: {
      id: noteId,
      studentId,
    },
  })

  if (!note) {
    return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
  }

  // Obtener las dos versiones a comparar
  let version1: { title: string; content: string; tags: string | null }
  let version2: { title: string; content: string; tags: string | null }

  // Si versionId1 es el ID de la nota actual, usar la nota actual
  if (versionId1 === noteId) {
    version1 = {
      title: note.title,
      content: note.content,
      tags: note.tags,
    }
  } else {
    const v1 = await prisma.studyNoteVersion.findFirst({
      where: {
        id: versionId1,
        noteId: note.id,
      },
    })
    if (!v1) {
      return NextResponse.json({ error: 'Versión 1 no encontrada' }, { status: 404 })
    }
    // Descomprimir si está comprimida
    const isCompressed1 = (v1 as { isCompressed?: boolean }).isCompressed || false
    const content1 = await decompressVersionContent(v1.content, isCompressed1, 'versions/compare')
    version1 = {
      title: v1.title,
      content: content1,
      tags: v1.tags,
    }
  }

  // Si versionId2 es el ID de la nota actual, usar la nota actual
  if (versionId2 === noteId) {
    version2 = {
      title: note.title,
      content: note.content,
      tags: note.tags,
    }
  } else {
    const v2 = await prisma.studyNoteVersion.findFirst({
      where: {
        id: versionId2,
        noteId: note.id,
      },
    })
    if (!v2) {
      return NextResponse.json({ error: 'Versión 2 no encontrada' }, { status: 404 })
    }
    // Descomprimir si está comprimida
    const isCompressed2 = (v2 as { isCompressed?: boolean }).isCompressed || false
    const content2 = await decompressVersionContent(v2.content, isCompressed2, 'versions/compare')
    version2 = {
      title: v2.title,
      content: content2,
      tags: v2.tags,
    }
  }

  // Obtener metadatos adicionales de las versiones
  const v1Metadata = versionId1 === noteId
    ? { id: noteId, name: null, createdAt: note.updatedAt, isImportant: false }
    : await prisma.studyNoteVersion.findFirst({
        where: { id: versionId1, noteId: note.id },
        select: { id: true, name: true, createdAt: true, isImportant: true },
      })
  
  const v2Metadata = versionId2 === noteId
    ? { id: noteId, name: null, createdAt: note.updatedAt, isImportant: false }
    : await prisma.studyNoteVersion.findFirst({
        where: { id: versionId2, noteId: note.id },
        select: { id: true, name: true, createdAt: true, isImportant: true },
      })

  // Comparar las versiones
  const diff = compareVersions(version1, version2)

  const v1CreatedAtISO = safeToISOString(v1Metadata?.createdAt ?? note.updatedAt)
  const v2CreatedAtISO = safeToISOString(v2Metadata?.createdAt ?? note.updatedAt)

  return NextResponse.json({
    diff,
    version1: {
      id: versionId1,
      ...version1,
      name: v1Metadata?.name || null,
      createdAt: v1CreatedAtISO,
      isImportant: v1Metadata?.isImportant || false,
    },
    version2: {
      id: versionId2,
      ...version2,
      name: v2Metadata?.name || null,
      createdAt: v2CreatedAtISO,
      isImportant: v2Metadata?.isImportant || false,
    },
  })
}

/**
 * POST: Comparar dos versiones de una nota
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

        const body = await request.json()
        const validation = compareVersionsSchema.safeParse(body)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionId1, versionId2 } = validation.data

        // Auditar acceso
        auditSensitiveOperation('version.compare.queried', enrichedContext, {
          metadata: { noteId, versionId1, versionId2 },
        })

        // Reutilizar lógica interna
        const result = await compareVersionsInternal(noteId, versionId1, versionId2, dbUser.student.id)
        return addTracingHeaders(addCorsHeaders(result), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.compare.queried', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'compare', {
          customMessage: 'Error al comparar versiones',
        })
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

