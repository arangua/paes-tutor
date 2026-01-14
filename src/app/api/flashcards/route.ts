import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { calculateSM2, responseToQuality } from '@/lib/spaced-repetition'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const createFlashcardSchema = z.object({
  questionId: z.string().optional(),
  front: z.string().min(1),
  back: z.string().min(1),
})

const reviewFlashcardSchema = z.object({
  flashcardId: z.string().min(1),
  isCorrect: z.boolean(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
})

const getFlashcardsQuerySchema = z.object({
  dueOnly: z
    .enum(['true', 'false'])
    .optional()
    .transform(val => val === 'true'),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(100).optional()),
  flashcardId: z.string().cuid().optional(),
})

const _flashcardIdQuerySchema = z.object({
  flashcardId: z.string().cuid().min(1),
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
      const queryValidation = getFlashcardsQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { dueOnly, limit, flashcardId } = queryValidation.data

      const where: {
        studentId: string
        nextReview?: { lte: Date }
        id?: string
      } = {
        studentId: dbUser.student.id,
      }

      if (dueOnly) {
        where.nextReview = {
          lte: new Date(),
        }
      }

      if (flashcardId) {
        where.id = flashcardId
      }

      const flashcards = await prisma.flashcard.findMany({
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
        },
        orderBy: dueOnly ? { nextReview: 'asc' } : { createdAt: 'desc' },
        take: limit,
      })

      // Obtener estadísticas adicionales
      const now = new Date()
      const dueCount = flashcards.filter(f => new Date(f.nextReview) <= now).length
      const totalCount = await prisma.flashcard.count({
        where: {
          studentId: dbUser.student.id,
        },
      })

      return NextResponse.json({
        flashcards,
        stats: {
          total: totalCount,
          due: dueCount,
        },
      })
    } catch (error) {
      logger.error({ error, context: 'flashcards/GET' }, 'Error al obtener flashcards')
      return NextResponse.json({ error: 'Error al obtener flashcards' }, { status: 500 })
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
      const validation = createFlashcardSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { questionId, front, back } = validation.data

      // Si hay questionId, verificar que existe
      if (questionId) {
        const question = await prisma.question.findUnique({
          where: { id: questionId },
        })
        if (!question) {
          return NextResponse.json({ error: 'Pregunta no encontrada' }, { status: 404 })
        }
      }

      const flashcard = await prisma.flashcard.create({
        data: {
          studentId: dbUser.student.id,
          questionId: questionId || null,
          front,
          back,
          difficulty: 2.5,
          easeFactor: 2.5,
          interval: 1,
          lastReview: new Date(),
          nextReview: new Date(), // Disponible inmediatamente
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
        },
      })

      return NextResponse.json(
        {
          flashcard,
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error({ error, context: 'flashcards/POST' }, 'Error al crear flashcard')
      return NextResponse.json({ error: 'Error al crear flashcard' }, { status: 500 })
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

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const body = await request.json()
      const validation = reviewFlashcardSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { flashcardId, isCorrect, difficulty = 'medium' } = validation.data

      // Obtener flashcard
      const flashcard = await prisma.flashcard.findFirst({
        where: {
          id: flashcardId,
          studentId: dbUser.student.id,
        },
      })

      if (!flashcard) {
        return NextResponse.json({ error: 'Flashcard no encontrada' }, { status: 404 })
      }

      // Calcular nuevo intervalo usando SM-2
      const quality = responseToQuality(isCorrect, difficulty)
      const sm2Result = calculateSM2({
        quality,
        easeFactor: flashcard.easeFactor,
        interval: flashcard.interval,
        reviewCount: flashcard.reviewCount,
      })

      // Actualizar flashcard
      const updated = await prisma.flashcard.update({
        where: { id: flashcardId },
        data: {
          difficulty: sm2Result.easeFactor, // Actualizar difficulty con easeFactor
          easeFactor: sm2Result.easeFactor,
          interval: sm2Result.interval,
          reviewCount: sm2Result.reviewCount,
          lastReview: new Date(),
          nextReview: sm2Result.nextReview,
        },
      })

      return NextResponse.json({
        flashcard: updated,
      })
    } catch (error) {
      logger.error({ error, context: 'flashcards/PUT' }, 'Error al actualizar flashcard')
      return NextResponse.json({ error: 'Error al actualizar flashcard' }, { status: 500 })
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
      const flashcardId = searchParams.get('flashcardId')

      if (!flashcardId) {
        return NextResponse.json({ error: 'ID de flashcard requerido' }, { status: 400 })
      }

      const flashcard = await prisma.flashcard.findFirst({
        where: {
          id: flashcardId,
          studentId: dbUser.student.id,
        },
      })

      if (!flashcard) {
        return NextResponse.json({ error: 'Flashcard no encontrada' }, { status: 404 })
      }

      await prisma.flashcard.delete({
        where: { id: flashcardId },
      })

      return NextResponse.json({
        message: 'Flashcard eliminada correctamente',
      })
    } catch (error) {
      logger.error({ error, context: 'flashcards/DELETE' }, 'Error al eliminar flashcard')
      return NextResponse.json({ error: 'Error al eliminar flashcard' }, { status: 500 })
    }
  })
}
