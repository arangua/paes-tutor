import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const createBookmarkSchema = z.object({
  questionId: z.string().min(1),
  notes: z.string().optional(),
})

const getBookmarksQuerySchema = z.object({
  topicId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional(),
})

const deleteBookmarkQuerySchema = z.object({
  questionId: z.string().cuid().min(1),
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = getBookmarksQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { topicId, subjectId } = queryValidation.data

      const where: {
        studentId: string
        question?: {
          topicId?: string
          subjectId?: string
        }
      } = {
        studentId: dbUser.student.id,
      }

      if (topicId || subjectId) {
        where.question = {}
        if (topicId) {
          where.question.topicId = topicId
        }
        if (subjectId) {
          where.question.subjectId = subjectId
        }
      }

      const bookmarks = await prisma.bookmark.findMany({
        where,
        include: {
          question: {
            include: {
              options: {
                orderBy: { letra: 'asc' },
              },
              subject: {
                select: {
                  nombre: true,
                  codigo: true,
                },
              },
              topic: {
                select: {
                  nombre: true,
                  ejeTematico: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return NextResponse.json({
        bookmarks,
      })
    } catch (error) {
      logger.error({ error, context: 'bookmarks/GET' }, 'Error al obtener favoritos')
      return NextResponse.json({ error: 'Error al obtener favoritos' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const body = await request.json()
      const validation = createBookmarkSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { questionId, notes } = validation.data

      // Verificar que la pregunta existe
      const question = await prisma.question.findUnique({
        where: { id: questionId },
      })

      if (!question) {
        return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 })
      }

      // Verificar si ya existe el bookmark
      const existing = await prisma.bookmark.findUnique({
        where: {
          studentId_questionId: {
            studentId: dbUser.student.id,
            questionId,
          },
        },
      })

      if (existing) {
        return NextResponse.json({ error: 'La pregunta ya está en favoritos' }, { status: 409 })
      }

      const bookmark = await prisma.bookmark.create({
        data: {
          studentId: dbUser.student.id,
          questionId,
          notes: notes || null,
        },
        include: {
          question: {
            include: {
              subject: {
                select: {
                  nombre: true,
                  codigo: true,
                },
              },
              topic: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json(
        {
          bookmark,
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error({ error, context: 'bookmarks/POST' }, 'Error al crear favorito')
      return NextResponse.json({ error: 'Error al crear favorito' }, { status: 500 })
    }
  })
}

export async function DELETE(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = deleteBookmarkQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'ID de pregunta inválido', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { questionId } = queryValidation.data

      const bookmark = await prisma.bookmark.findUnique({
        where: {
          studentId_questionId: {
            studentId: dbUser.student.id,
            questionId,
          },
        },
      })

      if (!bookmark) {
        return NextResponse.json({ error: 'Favorito no encontrado' }, { status: 404 })
      }

      await prisma.bookmark.delete({
        where: { id: bookmark.id },
      })

      return NextResponse.json({
        message: 'Favorito eliminado correctamente',
      })
    } catch (error) {
      logger.error({ error, context: 'bookmarks/DELETE' }, 'Error al eliminar favorito')
      return NextResponse.json({ error: 'Error al eliminar favorito' }, { status: 500 })
    }
  })
}
