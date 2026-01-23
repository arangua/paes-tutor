import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
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
      const sortedAnswers = [...incorrectAnswers]
        .filter(answer => answer.attempt && answer.attempt.startedAt)
        .sort((a, b) => {
          const timeA = a.attempt?.startedAt ? a.attempt.startedAt.getTime() : 0
          const timeB = b.attempt?.startedAt ? b.attempt.startedAt.getTime() : 0
          return timeB - timeA
        })

      sortedAnswers.forEach(answer => {
        if (!answer.question || !answer.attempt || !answer.attempt.startedAt) {
          return // Saltar respuestas inválidas
        }
        const questionId = answer.question.id
        if (!questionMap.has(questionId)) {
          questionMap.set(questionId, {
            question: answer.question,
            timesFailed: 0,
            lastFailed: answer.attempt.startedAt,
          })
        }
        const data = questionMap.get(questionId)
        if (data && answer.attempt && answer.attempt.startedAt) {
          data.timesFailed++
          const startedAtTime = answer.attempt.startedAt instanceof Date && !Number.isNaN(answer.attempt.startedAt.getTime())
            ? answer.attempt.startedAt.getTime()
            : 0
          const lastFailedTime = data.lastFailed instanceof Date && !Number.isNaN(data.lastFailed.getTime())
            ? data.lastFailed.getTime()
            : 0
          if (startedAtTime > lastFailedTime) {
            data.lastFailed = answer.attempt.startedAt
          }
        }
      })

      // Convertir a array, ordenar por veces fallada y fecha, luego aleatorizar
      const sortedArray = Array.from(questionMap.values())
        .filter(item => item && item.question && Number.isFinite(item.timesFailed))
        .sort((a, b) => {
          // Validar que a y b sean objetos válidos
          if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
            return 0
          }
          // Priorizar preguntas falladas más veces
          const safeATimes = Number.isFinite(a.timesFailed) && a.timesFailed >= 0 ? a.timesFailed : 0
          const safeBTimes = Number.isFinite(b.timesFailed) && b.timesFailed >= 0 ? b.timesFailed : 0
          if (safeBTimes !== safeATimes) {
            return safeBTimes - safeATimes
          }
          // Si tienen el mismo número de fallos, priorizar las más recientes
          const timeA = a.lastFailed instanceof Date && !Number.isNaN(a.lastFailed.getTime())
            ? a.lastFailed.getTime()
            : 0
          const timeB = b.lastFailed instanceof Date && !Number.isNaN(b.lastFailed.getTime())
            ? b.lastFailed.getTime()
            : 0
          const diff = timeB - timeA
          return Number.isFinite(diff) ? diff : 0
        })
      
      // CORRECCIÓN: Validar que sortedArray sea un array válido antes de usar slice() y sort()
      let questionsArray: typeof sortedArray
      try {
        // Validar que sortedArray sea un array válido antes de usar slice()
        if (!Array.isArray(sortedArray)) {
          logger.warn({ sortedArray }, 'review/quick: sortedArray no es un array válido antes de slice(), usando array vacío')
          questionsArray = []
        } else {
          const sliced = sortedArray.slice(0, validLimit)
          // Validar que slice() retorne un array válido
          if (!Array.isArray(sliced)) {
            logger.warn({ sortedArray, validLimit, sliced }, 'review/quick: slice() retornó resultado inválido, usando sortedArray original')
            questionsArray = sortedArray
          } else {
            try {
              const randomized = sliced.sort(() => {
                const random = Math.random()
                return Number.isFinite(random) ? random - 0.5 : 0
              })
              // Validar que sort() retorne un array válido
              questionsArray = Array.isArray(randomized) ? randomized : sliced
            } catch (sortError) {
              logger.warn({ error: sortError, sliced }, 'review/quick: Error al ejecutar sort() para aleatorizar, usando sliced original')
              questionsArray = sliced
            }
          }
        }
      } catch (error) {
        logger.warn({ error, sortedArray, validLimit }, 'review/quick: Error al procesar sortedArray, usando array vacío')
        questionsArray = []
      }

      // CORRECCIÓN: Validar que questionsArray sea un array válido y que item.question exista antes de mapear
      const questions = (() => {
        if (!Array.isArray(questionsArray)) {
          logger.warn({ questionsArray }, 'review/quick: questionsArray no es un array válido, retornando array vacío')
          return []
        }
        try {
          const mapped = questionsArray
            .filter(item => item && typeof item === 'object' && item.question && typeof item.question === 'object')
            .map(item => item.question)
          // Validar que mapped sea un array válido
          if (!Array.isArray(mapped)) {
            logger.warn({ questionsArray, mapped }, 'review/quick: map() retornó resultado inválido, retornando array vacío')
            return []
          }
          return mapped
        } catch (error) {
          logger.warn({ error, questionsArray }, 'review/quick: Error al ejecutar map() en questionsArray, retornando array vacío')
          return []
        }
      })()

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
