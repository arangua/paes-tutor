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
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const topicId = searchParams.get('topicId')
      const limit = searchParams.get('limit')

      // Validar parámetros
      const validation = questionsQuerySchema.safeParse({ topicId, limit })
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { topicId: validTopicId, limit: validLimit } = validation.data

      // Verificar que el tema existe
      const topic = await prisma.topic.findUnique({
        where: { id: validTopicId },
        select: { id: true, nombre: true, subjectId: true },
      })

      if (!topic) {
        return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 })
      }

      // Obtener preguntas del tema (aleatorias)
      const questions = await prisma.question.findMany({
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
        take: validLimit || 20, // Por defecto 20 preguntas
        orderBy: {
          createdAt: 'desc', // Más recientes primero, luego se aleatorizan en el cliente si es necesario
        },
      })

      // Aleatorizar el orden de las preguntas
      const shuffledQuestions = questions.sort(() => Math.random() - 0.5)

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
