import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const createScheduleSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  scheduledAt: z.string().transform(str => new Date(str)),
  durationMinutes: z.number().int().min(15).max(480).default(60),
  type: z.enum(['exam', 'practice', 'review', 'flashcards', 'custom']),
  topicId: z.string().optional(),
  examId: z.string().optional(),
})

const updateScheduleSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  scheduledAt: z
    .string()
    .optional()
    .transform(str => (str ? new Date(str) : undefined)),
  durationMinutes: z.number().int().min(15).max(480).optional(),
  completed: z.boolean().optional(),
})

const getSchedulesQuerySchema = z.object({
  startDate: z.datetime({ error: 'Invalid datetime' }).optional(),
  endDate: z.datetime({ error: 'Invalid datetime' }).optional(),
  completed: z
    .enum(['true', 'false'])
    .optional()
    .transform(val => val === 'true'),
})

const scheduleIdQuerySchema = z.object({
  scheduleId: z.cuid({ error: 'scheduleId debe ser un CUID válido' }).min(1),
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = getSchedulesQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { startDate, endDate, completed } = queryValidation.data

      const where: {
        studentId: string
        scheduledAt?: {
          gte?: Date
          lte?: Date
        }
        completed?: boolean
      } = {
        studentId: dbUser.student.id,
      }

      if (startDate || endDate) {
        where.scheduledAt = {}
        if (startDate) {
          where.scheduledAt.gte = new Date(startDate)
        }
        if (endDate) {
          where.scheduledAt.lte = new Date(endDate)
        }
      }

      if (completed !== undefined) {
        where.completed = completed
      }

      const schedules = await prisma.studySchedule.findMany({
        where,
        include: {
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
          exam: {
            select: {
              id: true,
              titulo: true,
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
          scheduledAt: 'asc',
        },
      })

      return NextResponse.json({
        schedules,
      })
    } catch (error) {
      logger.error({ error, context: 'schedule/GET' }, 'Error al obtener calendario')
      return NextResponse.json({ error: 'Error al obtener calendario' }, { status: 500 })
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

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const body = await request.json()
      const validation = createScheduleSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { topicId, examId, ...data } = validation.data

      // Verificar que topicId o examId existe si se proporciona
      if (topicId) {
        const topic = await prisma.topic.findUnique({
          where: { id: topicId },
        })
        if (!topic) {
          return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 })
        }
      }

      if (examId) {
        const exam = await prisma.exam.findUnique({
          where: { id: examId },
        })
        if (!exam) {
          return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
        }
      }

      const schedule = await prisma.studySchedule.create({
        data: {
          studentId: dbUser.student.id,
          topicId: topicId || null,
          examId: examId || null,
          ...data,
        },
        include: {
          topic: {
            include: {
              subject: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          exam: {
            select: {
              titulo: true,
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
          schedule,
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error({ error, context: 'schedule/POST' }, 'Error al crear sesión de estudio')
      return NextResponse.json({ error: 'Error al crear sesión de estudio' }, { status: 500 })
    }
  })
}

export async function PUT(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = scheduleIdQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'ID de sesión inválido', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { scheduleId } = queryValidation.data

      const body = await request.json()
      const validation = updateScheduleSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      // Verificar que la sesión pertenece al estudiante
      const existingSchedule = await prisma.studySchedule.findFirst({
        where: {
          id: scheduleId,
          studentId: dbUser.student.id,
        },
      })

      if (!existingSchedule) {
        return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
      }

      const updateData: {
        title?: string
        description?: string
        scheduledAt?: Date
        durationMinutes?: number
        completed?: boolean
        completedAt?: Date | null
      } = {}

      if (validation.data.title) updateData.title = validation.data.title
      if (validation.data.description !== undefined)
        updateData.description = validation.data.description
      if (validation.data.scheduledAt) updateData.scheduledAt = validation.data.scheduledAt
      if (validation.data.durationMinutes)
        updateData.durationMinutes = validation.data.durationMinutes
      if (validation.data.completed !== undefined) {
        updateData.completed = validation.data.completed
        updateData.completedAt = validation.data.completed ? new Date() : null
      }

      const schedule = await prisma.studySchedule.update({
        where: { id: scheduleId },
        data: updateData,
        include: {
          topic: {
            include: {
              subject: {
                select: {
                  nombre: true,
                },
              },
            },
          },
          exam: {
            select: {
              titulo: true,
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
        schedule,
      })
    } catch (error) {
      logger.error({ error, context: 'schedule/PUT' }, 'Error al actualizar sesión')
      return NextResponse.json({ error: 'Error al actualizar sesión' }, { status: 500 })
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

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const queryValidation = scheduleIdQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'ID de sesión inválido', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { scheduleId } = queryValidation.data

      const schedule = await prisma.studySchedule.findFirst({
        where: {
          id: scheduleId,
          studentId: dbUser.student.id,
        },
      })

      if (!schedule) {
        return NextResponse.json({ error: 'Sesión no encontrada' }, { status: 404 })
      }

      await prisma.studySchedule.delete({
        where: { id: scheduleId },
      })

      return NextResponse.json({
        message: 'Sesión eliminada correctamente',
      })
    } catch (error) {
      logger.error({ error, context: 'schedule/DELETE' }, 'Error al eliminar sesión')
      return NextResponse.json({ error: 'Error al eliminar sesión' }, { status: 500 })
    }
  })
}
