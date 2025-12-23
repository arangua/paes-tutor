import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const quickReviewQuerySchema = z.object({
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : undefined))
    .pipe(z.number().int().min(1).max(50).optional()),
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
      const validation = quickReviewQuerySchema.safeParse(queryParams)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const validLimit = validation.data.limit || 10 // Por defecto 10 preguntas

      // Obtener preguntas que el estudiante ha fallado anteriormente
      const incorrectAnswers = await prisma.attemptAnswer.findMany({
        where: {
          attempt: {
            studentId: dbUser.student.id,
            estado: 'completado',
          },
          esCorrecta: false,
          omitida: false,
        },
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
          attempt: {
            select: {
              startedAt: true,
            },
          },
        },
        take: validLimit * 3, // Obtener más para luego aleatorizar y evitar duplicados
      })

      // Agrupar por pregunta y contar veces fallada
      const questionMap = new Map<
        string,
        {
          question: (typeof incorrectAnswers)[0]['question']
          timesFailed: number
          lastFailed: Date
        }
      >()

      // Ordenar por fecha de intento (más recientes primero)
      const sortedAnswers = [...incorrectAnswers].sort(
        (a, b) => b.attempt.startedAt.getTime() - a.attempt.startedAt.getTime()
      )

      sortedAnswers.forEach(answer => {
        const questionId = answer.question.id
        if (!questionMap.has(questionId)) {
          questionMap.set(questionId, {
            question: answer.question,
            timesFailed: 0,
            lastFailed: answer.attempt.startedAt,
          })
        }
        const data = questionMap.get(questionId)!
        data.timesFailed++
        if (answer.attempt.startedAt > data.lastFailed) {
          data.lastFailed = answer.attempt.startedAt
        }
      })

      // Convertir a array, ordenar por veces fallada y fecha, luego aleatorizar
      const questionsArray = Array.from(questionMap.values())
        .sort((a, b) => {
          // Priorizar preguntas falladas más veces
          if (b.timesFailed !== a.timesFailed) {
            return b.timesFailed - a.timesFailed
          }
          // Si tienen el mismo número de fallos, priorizar las más recientes
          return b.lastFailed.getTime() - a.lastFailed.getTime()
        })
        .slice(0, validLimit) // Tomar solo el límite solicitado
        .sort(() => Math.random() - 0.5) // Aleatorizar el orden final

      const questions = questionsArray.map(item => item.question)

      return NextResponse.json({
        questions,
        totalFailed: questionMap.size,
        selected: questions.length,
      })
    } catch (error) {
      logger.error(
        {
          type: 'quick_review_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener preguntas para repaso rápido'
      )
      return NextResponse.json(
        { error: 'Error al obtener preguntas para repaso rápido' },
        { status: 500 }
      )
    }
  })
}
