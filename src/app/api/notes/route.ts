import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const createNoteSchema = z.object({
  questionId: z.string().optional(),
  topicId: z.string().optional(),
  title: z.string().min(1),
  content: z.string().min(1),
  tags: z.string().optional(),
})

const updateNoteSchema = z.object({
  title: z.string().min(1).optional(),
  content: z.string().min(1).optional(),
  tags: z.string().optional(),
})

const getNotesQuerySchema = z.object({
  questionId: z.string().cuid().optional(),
  topicId: z.string().cuid().optional(),
  search: z.string().min(1).max(200).optional(),
})

const noteIdQuerySchema = z.object({
  noteId: z.string().cuid().min(1),
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { student: true },
      })

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = getNotesQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { questionId, topicId, search } = queryValidation.data

      const where: {
        studentId: string
        questionId?: string | null
        topicId?: string | null
        OR?: Array<{
          title?: { contains: string }
          content?: { contains: string }
        }>
      } = {
        studentId: user.student.id,
      }

      if (questionId) {
        where.questionId = questionId
      }
      if (topicId) {
        where.topicId = topicId
      }
      if (search) {
        where.OR = [{ title: { contains: search } }, { content: { contains: search } }]
      }

      const notes = await prisma.studyNote.findMany({
        where,
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
          topic: {
            include: {
              subject: {
                select: {
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
        orderBy: {
          updatedAt: 'desc',
        },
      })

      return NextResponse.json({
        notes,
      })
    } catch (error) {
      logger.error({ error, context: 'notes/GET' }, 'Error al obtener notas')
      return NextResponse.json({ error: 'Error al obtener notas' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { student: true },
      })

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const body = await request.json()
      const validation = createNoteSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { questionId, topicId, title, content, tags } = validation.data

      // Verificar que questionId o topicId existe si se proporciona
      if (questionId) {
        const question = await prisma.question.findUnique({
          where: { id: questionId },
        })
        if (!question) {
          return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 })
        }
      }

      if (topicId) {
        const topic = await prisma.topic.findUnique({
          where: { id: topicId },
        })
        if (!topic) {
          return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 })
        }
      }

      const note = await prisma.studyNote.create({
        data: {
          studentId: dbUser.student.id,
          questionId: questionId || null,
          topicId: topicId || null,
          title,
          content,
          tags: tags || null,
        },
        include: {
          question: {
            include: {
              subject: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          topic: {
            include: {
              subject: {
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
          note,
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error({ error, context: 'notes/POST' }, 'Error al crear nota')
      return NextResponse.json({ error: 'Error al crear nota' }, { status: 500 })
    }
  })
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { student: true },
      })

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = noteIdQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'ID de nota inválido', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { noteId } = queryValidation.data

      const body = await request.json()
      const validation = updateNoteSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      // Verificar que la nota pertenece al estudiante
      const existingNote = await prisma.studyNote.findFirst({
        where: {
          id: noteId,
          studentId: user.student.id,
        },
      })

      if (!existingNote) {
        return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
      }

      const updateData: {
        title?: string
        content?: string
        tags?: string | null
      } = {}

      if (validation.data.title) updateData.title = validation.data.title
      if (validation.data.content) updateData.content = validation.data.content
      if (validation.data.tags !== undefined) {
        updateData.tags = validation.data.tags || null
      }

      const note = await prisma.studyNote.update({
        where: { id: noteId },
        data: updateData,
        include: {
          question: {
            include: {
              subject: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          topic: {
            include: {
              subject: {
                select: {
                  nombre: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json({
        note,
      })
    } catch (error) {
      logger.error({ error, context: 'notes/PUT' }, 'Error al actualizar nota')
      return NextResponse.json({ error: 'Error al actualizar nota' }, { status: 500 })
    }
  })
}

export async function DELETE(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { student: true },
      })

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = noteIdQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'ID de nota inválido', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { noteId } = queryValidation.data

      const note = await prisma.studyNote.findFirst({
        where: {
          id: noteId,
          studentId: user.student.id,
        },
      })

      if (!note) {
        return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
      }

      await prisma.studyNote.delete({
        where: { id: noteId },
      })

      return NextResponse.json({
        message: 'Nota eliminada correctamente',
      })
    } catch (error) {
      logger.error({ error, context: 'notes/DELETE' }, 'Error al eliminar nota')
      return NextResponse.json({ error: 'Error al eliminar nota' }, { status: 500 })
    }
  })
}
