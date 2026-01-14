import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withVersionRateLimit } from '../rate-limit'
import { withRequestTimeout } from '../timeout-handler'
import { logger } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { z } from 'zod'
import { cuidValidator } from '@/lib/utils/version-validators'
import { withAuthContext } from '../helpers'
import { handleEndpointError } from '../error-handlers'
import { createRequestContext, getOrCreateRequestId } from '../request-context'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { auditSensitiveOperation } from '../audit'
import { parseRequestBody } from '../helpers'

const shareVersionSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionId: cuidValidator('ID de versión inválido'),
  message: z.string().max(500).optional(),
})

/**
 * POST: Compartir una versión específica de una nota
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

        const validation = shareVersionSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionId, message } = validation.data

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

        // Verificar que la versión existe (puede ser la actual o una histórica)
        if (versionId !== noteId) {
          const version = await prisma.studyNoteVersion.findFirst({
            where: {
              id: versionId,
              noteId: note.id,
            },
          })

          if (!version) {
            const response = NextResponse.json({ error: 'Versión no encontrada' }, { status: 404 })
            return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
          }
        }

      // Obtener todos los estudiantes para encontrar el otro
      const allStudents = await prisma.student.findMany({
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      })

        if (allStudents.length < 2) {
          const response = NextResponse.json(
            { error: 'Se necesitan al menos 2 estudiantes para compartir' },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Encontrar el otro estudiante (el que no es el actual)
        const otherStudent = allStudents.find(s => s.id !== dbUser.student.id)
        if (!otherStudent) {
          const response = NextResponse.json(
            { error: 'No se encontró el otro estudiante para compartir' },
            { status: 404 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Verificar si ya está compartida esta versión
        const existing = await prisma.sharedNoteVersion.findFirst({
          where: {
            noteId,
            versionId,
            sharedById: dbUser.student.id,
            sharedWithId: otherStudent.id,
          },
        })

        if (existing) {
          const response = NextResponse.json(
            { error: 'Esta versión ya fue compartida con el otro estudiante' },
            { status: 409 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

      // Compartir la versión
      const sharedVersion = await prisma.sharedNoteVersion.create({
        data: {
          noteId,
          versionId,
          sharedById: dbUser.student.id,
          sharedWithId: otherStudent.id,
          message: message || null,
        },
        include: {
          note: {
            select: {
              id: true,
              title: true,
            },
          },
          sharedWith: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      })

      // Crear notificación para el estudiante que recibe
      try {
        await createNotification({
          studentId: otherStudent.id,
          type: 'shared',
          title: 'Nueva versión de nota compartida',
          message: `${dbUser.student.nombre || 'Un estudiante'} ha compartido una versión de la nota "${note.title}" contigo`,
          relatedId: noteId,
          relatedType: 'material',
          actionUrl: `/shared-notes`,
        })
      } catch (notifError) {
        // No fallar si la notificación falla
        logger.error({ error: notifError }, 'Error al crear notificación de versión compartida')
      }

        // Auditar operación
        auditSensitiveOperation('version.shared', enrichedContext, {
          metadata: { noteId, versionId, sharedWithId: otherStudent.id },
        })

        const response = NextResponse.json(
          {
            message: 'Versión compartida correctamente',
            sharedVersion,
          },
          { status: 201 }
        )
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.shared', context, {
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

/**
 * GET: Obtener versiones compartidas con el usuario actual
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
        const type = searchParams.get('type') || 'received' // 'received' | 'sent'

        let sharedVersions
        if (type === 'received') {
          // Versiones compartidas CON el usuario actual
          sharedVersions = await prisma.sharedNoteVersion.findMany({
            where: {
              sharedWithId: dbUser.student.id,
            },
            include: {
              note: {
                select: {
                  id: true,
                  title: true,
                },
              },
              sharedBy: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 50,
          })
        } else {
          // Versiones compartidas POR el usuario actual
          sharedVersions = await prisma.sharedNoteVersion.findMany({
            where: {
              sharedById: dbUser.student.id,
            },
            include: {
              note: {
                select: {
                  id: true,
                  title: true,
                },
              },
              sharedWith: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            take: 50,
          })
        }

        // Auditar acceso
        auditSensitiveOperation('version.shared.queried', enrichedContext, {
          metadata: { type, sharedVersionsCount: sharedVersions.length },
        })

        const response = NextResponse.json({
          sharedVersions,
          total: sharedVersions.length,
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.shared.queried', context, {
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

