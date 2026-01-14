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
import { parseRequestBody } from '../helpers'

const createCommentSchema = z.object({
  noteId: cuidValidator('ID de nota inválido'),
  versionId: cuidValidator('ID de versión inválido'),
  comment: z.string().min(1).max(1000),
})

const updateCommentSchema = z.object({
  commentId: cuidValidator('ID de comentario inválido'),
  comment: z.string().min(1).max(1000),
})

/**
 * GET: Obtener comentarios de una versión
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
        const noteId = searchParams.get('noteId')
        const versionId = searchParams.get('versionId')

        if (!noteId || !versionId) {
          const response = NextResponse.json(
            { error: 'noteId y versionId son requeridos' },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

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

        // Obtener comentarios
        const comments = await prisma.versionComment.findMany({
          where: {
            noteId,
            versionId,
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 50,
        })

        // Auditar acceso
        auditSensitiveOperation('version.comments.queried', enrichedContext, {
          metadata: { noteId, versionId, commentsCount: comments.length },
        })

        const response = NextResponse.json({
          comments,
          total: comments.length,
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.comments.queried', context, {
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

/**
 * POST: Crear comentario en una versión
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

        const validation = createCommentSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { noteId, versionId, comment } = validation.data

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

        // Verificar que la versión existe
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

        // Crear comentario
        const newComment = await prisma.versionComment.create({
          data: {
            noteId,
            versionId,
            comment,
            createdBy: dbUser.student.id,
          },
        })

        // Auditar operación
        auditSensitiveOperation('version.comment.created', enrichedContext, {
          metadata: { noteId, versionId, commentId: newComment.id },
        })

        const response = NextResponse.json(
          {
            message: 'Comentario creado correctamente',
            comment: newComment,
          },
          { status: 201 }
        )
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.comment.created', context, {
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
 * PATCH: Actualizar comentario
 */
export async function PATCH(request: NextRequest): Promise<NextResponse> {
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
        const bodyResult = await parseRequestBody(request, 'PATCH')
        if (!bodyResult.success) {
          return addTracingHeaders(bodyResult.error, requestId, Date.now() - startTime)
        }

        const validation = updateCommentSchema.safeParse(bodyResult.data)

        if (!validation.success) {
          const response = NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.issues },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        const { commentId, comment } = validation.data

        // Verificar que el comentario existe y pertenece al estudiante
        const existingComment = await prisma.versionComment.findFirst({
          where: {
            id: commentId,
            createdBy: dbUser.student.id,
          },
        })

        if (!existingComment) {
          const response = NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Actualizar comentario
        const updatedComment = await prisma.versionComment.update({
          where: { id: commentId },
          data: { comment },
        })

        // Auditar operación
        auditSensitiveOperation('version.comment.updated', enrichedContext, {
          metadata: { commentId, noteId: existingComment.noteId, versionId: existingComment.versionId },
        })

        const response = NextResponse.json({
          message: 'Comentario actualizado correctamente',
          comment: updatedComment,
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.comment.updated', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'PATCH')
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

/**
 * DELETE: Eliminar comentario
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
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
        const commentId = searchParams.get('commentId')

        if (!commentId) {
          const response = NextResponse.json(
            { error: 'commentId es requerido' },
            { status: 400 }
          )
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Verificar que el comentario existe y pertenece al estudiante
        const existingComment = await prisma.versionComment.findFirst({
          where: {
            id: commentId,
            createdBy: dbUser.student.id,
          },
        })

        if (!existingComment) {
          const response = NextResponse.json({ error: 'Comentario no encontrado' }, { status: 404 })
          return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
        }

        // Eliminar comentario
        await prisma.versionComment.delete({
          where: { id: commentId },
        })

        // Auditar operación
        auditSensitiveOperation('version.comment.deleted', enrichedContext, {
          metadata: { commentId, noteId: existingComment.noteId, versionId: existingComment.versionId },
        })

        const response = NextResponse.json({
          message: 'Comentario eliminado correctamente',
        })
        
        return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
      } catch (error) {
        const errorRequestId = getOrCreateRequestId(request)
        const context = createRequestContext(request)
        
        // Auditar error antes de retornar
        auditSensitiveOperation('version.comment.deleted', context, {
          severity: 'error',
          outcome: 'failure',
          error: error instanceof Error ? error : new Error(String(error)),
        })
        
        const response = handleEndpointError(error, 'DELETE')
        return addTracingHeaders(response, errorRequestId, Date.now() - startTime)
      }
    })
  )
}

