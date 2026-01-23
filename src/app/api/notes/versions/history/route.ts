import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { z } from 'zod'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'

const getHistoryQuerySchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
})

/**
 * GET: Obtener historial de restauraciones de una nota
 * 
 * @param request - NextRequest con query parameters:
 *   - noteId (string, requerido): ID de la nota
 * 
 * @returns NextResponse con historial de restauraciones
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

        const validation = getHistoryQuerySchema.safeParse(queryParams)
        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'ID de nota inválido', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId } = validation.data

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

        // Obtener historial de restauraciones
        const history = await prisma.versionRestoreHistory.findMany({
          where: { noteId: note.id },
          orderBy: { restoredAt: 'desc' },
          take: 50, // Últimas 50 restauraciones
        })

        // Auditar acceso
        auditSensitiveOperation('version.history.queried', enrichedContext, {
          metadata: { noteId, historyCount: history.length },
        })

        const response = NextResponse.json({
          history: history.map(h => ({
            id: h.id,
            restoredVersionId: h.restoredVersionId,
            restoredBy: h.restoredBy,
            restoredAt: h.restoredAt,
          })),
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.history.queried', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'GET')
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

