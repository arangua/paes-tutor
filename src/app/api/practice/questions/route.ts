import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const questionsQuerySchema = z.object({
  topicId: z.string().min(1),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined)),
  difficulty: z.enum(['easy', 'medium', 'hard', 'mixed']).optional(),
  mode: z.enum(['easy', 'medium', 'hard', 'mixed']).optional(), // Alias para difficulty
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const topicId = searchParams.get('topicId') || undefined
      const limit = searchParams.get('limit') || undefined
      const difficulty = searchParams.get('difficulty') || searchParams.get('mode') || undefined

      // Validar parámetros
      const validation = questionsQuerySchema.safeParse({ topicId, limit, difficulty })
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const {
        topicId: validTopicId,
        limit: validLimit,
        difficulty: validDifficulty,
      } = validation.data

      // Verificar que el tema existe
      const topic = await prisma.topic.findUnique({
        where: { id: validTopicId },
        select: { id: true, nombre: true, subjectId: true },
      })

      if (!topic) {
        return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 })
      }

      // Construir filtro de dificultad
      const difficultyFilter: { dificultad?: { in: number[] } } = {}
      if (validDifficulty && validDifficulty !== 'mixed') {
        switch (validDifficulty) {
          case 'easy':
            difficultyFilter.dificultad = { in: [1, 2] } // Dificultad 1-2
            break
          case 'medium':
            difficultyFilter.dificultad = { in: [3, 4] } // Dificultad 3-4
            break
          case 'hard':
            difficultyFilter.dificultad = { in: [5] } // Dificultad 5
            break
        }
      }

      // Obtener preguntas del tema con filtro de dificultad
      const questions = await prisma.question.findMany({
        where: {
          topicId: validTopicId,
          ...difficultyFilter,
        },
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
        take: validLimit || 20, // Por defecto 20 preguntas
        orderBy: {
          createdAt: 'desc', // Más recientes primero, luego se aleatorizan en el cliente si es necesario
        },
      })

      // Si no hay suficientes preguntas con el filtro, obtener de todas las dificultades
      let finalQuestions = questions
      if (questions.length < (validLimit || 20) && validDifficulty && validDifficulty !== 'mixed') {
        const allQuestions = await prisma.question.findMany({
          where: {
            topicId: validTopicId,
          },
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
          take: validLimit || 20,
          orderBy: {
            createdAt: 'desc',
          },
        })
        finalQuestions = allQuestions
      }

      // Aleatorizar el orden de las preguntas
      const shuffledQuestions = finalQuestions.sort(() => Math.random() - 0.5)

      return NextResponse.json({
        questions: shuffledQuestions,
        topic: {
          id: topic.id,
          nombre: topic.nombre,
        },
      })
    } catch (error) {
      logger.error(
        {
          type: 'practice_questions_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener preguntas de práctica'
      )
      return NextResponse.json({ error: 'Error al obtener preguntas de práctica' }, { status: 500 })
    }
  })
}
