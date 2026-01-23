import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { invalidateCachePattern } from '@/lib/cache'
import { determineChallengeWinner } from '@/lib/challenge-helpers'
import { TRANSACTION_TIMEOUT_LONG, CHALLENGE_STATUS } from '@/lib/challenge-constants'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'
import { safeRound, safeDivide, ensureFiniteNumber, ensureInteger } from '@/app/api/notes/versions/validation-utils'

// Especificar Node.js runtime
export const runtime = 'nodejs'

/**
 * Validador para formato CUID
 */
const CUID_REGEX = /^c[a-z0-9]{24}$/

/**
 * Valida que un ID tenga formato CUID válido
 * 
 * @param id - ID a validar
 * @returns true si el ID es válido, false en caso contrario
 */
function isValidCuid(id: string | null | undefined): boolean {
  return Boolean(id && typeof id === 'string' && CUID_REGEX.test(id))
}

/**
 * Constantes para validación de duración
 */
const MAX_DURATION_SECONDS = 24 * 60 * 60 // 24 horas en segundos

/**
 * Tipos TypeScript para respuestas de la API
 */
interface SubmittedAttemptResponse {
  id: string
  estado: string
  porcentaje: number
  correctas: number
  incorrectas: number
  omitidas: number
  puntajePaes: number | null
  puntajeEstimado: boolean
  finishedAt: Date
  duracionSegundos: number | null
  exam: {
    id: string
    titulo: string
    subject: {
      id: string
      nombre: string
      codigo: string
    }
  }
  answers: Array<{
    id: string
    esCorrecta: boolean | null
    omitida: boolean
    question: {
      id: string
      topicId: string | null
      options: Array<{
        id: string
        texto: string
        esCorrecta: boolean
      }>
    }
    optionSelected: {
      id: string
      texto: string
      esCorrecta: boolean
    } | null
  }>
}

/**
 * POST /api/attempts/[id]/submit
 * 
 * Finaliza un intento de examen, calcula resultados finales y actualiza métricas de rendimiento.
 * 
 * @param request - Request de Next.js
 * @param params - Parámetros de ruta con el ID del intento
 * @returns Intento completado con estadísticas finales y puntaje PAES
 * 
 * @example
 * ```typescript
 * POST /api/attempts/c123456789012345678901234/submit
 * ```
 * 
 * @throws {400} Si el ID es inválido, el intento ya está completado, o la duración es inválida
 * @throws {401} Si el usuario no está autenticado
 * @throws {403} Si el intento no pertenece al estudiante
 * @throws {404} Si el intento no existe
 * 
 * @remarks
 * - Calcula estadísticas finales (correctas, incorrectas, omitidas, porcentaje)
 * - Calcula puntaje PAES usando ScoreTable (exacto o estimado)
 * - Actualiza métricas de rendimiento por tema
 * - Marca intento como completado
 * - Calcula duración del examen
 * - Actualiza desafíos activos si aplica
 * - Usa transacciones para garantizar consistencia
 * - Invalida caché después de completar
 * 
 * @see {@link https://github.com/prisma/prisma/issues/11750} Prisma transaction timeout
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<SubmittedAttemptResponse | { error: string; details?: string }>> {
  return withRateLimit(request, async () => {
    const startTime = Date.now()
    let attemptId = 'unknown'
    
    try {
      const { id } = await params
      attemptId = id
      logApiRequest('POST', `/api/attempts/${id}/submit`)

      // Validar formato del ID (cuid)
      if (!isValidCuid(id)) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]/submit' },
          'Intento de finalización con ID inválido'
        )
        return NextResponse.json(
          { error: 'ID de intento inválido. Debe tener formato CUID válido.' },
          { status: 400 }
        )
      }

      const studentId = await getCurrentStudentId()

      if (!studentId) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]/submit' },
          'Intento de finalización sin autenticación'
        )
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // ✅ Enterprise: Verificar intento con circuit breaker
      // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
      const attempt = await circuitBreakers.database.execute(
        async () => {
          return await prisma.attempt.findUnique({
            where: { id },
            select: {
              id: true,
              studentId: true,
              estado: true,
              startedAt: true,
              totalPreguntas: true,
              proceso: true,
              tipoAplicacion: true,
              forma: true,
              exam: {
                select: {
                  id: true,
                  subject: {
                    select: {
                      id: true,
                      codigo: true,
                      nombre: true,
                    },
                  },
                },
              },
              answers: {
                select: {
                  id: true,
                  esCorrecta: true,
                  omitida: true,
                  question: {
                    select: {
                      id: true,
                      topicId: true,
                    },
                  },
                },
              },
            },
          })
        },
        async () => {
          logger.warn({ attemptId: id }, 'Circuit breaker activado para findAttempt (submit), retornando null')
          return null
        }
      )

      if (!attempt) {
        return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
      }

      if (attempt.studentId !== studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      if (attempt.estado === 'completado') {
        return NextResponse.json({ error: 'El intento ya está completado' }, { status: 400 })
      }

      if (attempt.estado === 'cancelado') {
        return NextResponse.json(
          { error: 'No se puede completar un intento cancelado' },
          { status: 400 }
        )
      }

      // Calcular estadísticas finales
      // CORRECCIÓN: Validar que attempt.answers sea un array válido antes de usar filter()
      // ✅ Enterprise: Validar y calcular estadísticas de forma segura
      const safeAnswers = Array.isArray(attempt.answers) ? attempt.answers : []
      const correctas = safeAnswers.filter(a => a && typeof a === 'object' && a.esCorrecta === true).length
      const incorrectas = safeAnswers.filter(a => a && typeof a === 'object' && a.esCorrecta === false && !a.omitida).length
      const omitidas = safeAnswers.filter(a => a && typeof a === 'object' && a.omitida === true).length
      const total = ensureFiniteNumber(attempt.totalPreguntas, 0)
      
      // ✅ Enterprise: Usar safeDivide para evitar división por cero
      const porcentaje = safeRound(safeDivide(correctas, total, 0) * 100, 2)

      // Calcular duración
      const finishedAt = new Date()
      let duracionSegundos: number | null = null

      if (attempt.startedAt) {
        // CORRECCIÓN: Validar que attempt.startedAt sea una fecha válida antes de usar getTime()
        const safeStartedAt = attempt.startedAt instanceof Date && !Number.isNaN(attempt.startedAt.getTime())
          ? attempt.startedAt
          : null
        if (safeStartedAt) {
          const startedTime = safeStartedAt.getTime()
          const finishedTime = finishedAt instanceof Date && !Number.isNaN(finishedAt.getTime())
            ? finishedAt.getTime()
            : Date.now()
          if (Number.isFinite(startedTime) && Number.isFinite(finishedTime)) {
            // ✅ Enterprise: Usar funciones seguras para cálculo de duración
            const diffMs = finishedTime - startedTime
            if (Number.isFinite(diffMs)) {
              duracionSegundos = ensureInteger(safeDivide(diffMs, 1000, 0), 0)
            } else {
              logger.warn(
                { startedTime, finishedTime, diffMs, attemptId: id },
                'attempts/submit: diffMs no es finito, usando 0'
              )
              duracionSegundos = 0
            }
          } else {
            logger.warn(
              { startedTime, finishedTime, attemptId: id },
              'attempts/submit: startedTime o finishedTime inválidos, usando 0'
            )
            duracionSegundos = 0
          }
        } else {
          logger.warn(
            { startedAt: attempt.startedAt, attemptId: id },
            'attempts/submit: startedAt inválido, usando 0'
          )
          duracionSegundos = 0
        }

        // VALIDACIÓN: Verificar que la duración sea razonable
        if (duracionSegundos < 0) {
          // Log warning pero continuar (podría ser un problema de sincronización de tiempo)
          const { logger } = await import('@/lib/logger')
          logger.warn(
            {
              attemptId: id,
              duracionSegundos,
              startedAt: attempt.startedAt,
              finishedAt,
            },
            'Duración negativa detectada al finalizar examen'
          )
          // Ajustar a 0 para evitar problemas
          duracionSegundos = 0
        }

        // Validar que no exceda un límite razonable (24 horas)
        if (duracionSegundos > MAX_DURATION_SECONDS) {
          logger.warn(
            {
              attemptId: id,
              duracionSegundos,
              maxDuration: MAX_DURATION_SECONDS,
            },
            'Intento de finalización con duración excesiva'
          )
          // ✅ Enterprise: Usar funciones seguras para cálculo de minutos
          const minutos = ensureInteger(safeDivide(duracionSegundos, 60, 0), 0)
          return NextResponse.json(
            {
              error: 'Duración inválida',
              details: `La duración del examen (${minutos} minutos) excede el límite máximo de 24 horas. Por favor, contacta al administrador.`,
            },
            { status: 400 }
          )
        }
      }

      // Calcular puntaje PAES si es posible
      let puntajePaes: number | null = null
      let puntajeEstimado = false

      // ✅ Enterprise: Buscar ScoreTable con circuit breaker
      if (attempt.proceso && attempt.tipoAplicacion && attempt.forma && attempt.exam?.subject?.codigo) {
        const scoreTable = await circuitBreakers.database.execute(
          async () => {
            return await prisma.scoreTable.findFirst({
              where: {
                subjectCodigo: attempt.exam.subject.codigo,
                proceso: attempt.proceso,
                tipoAplicacion: attempt.tipoAplicacion,
                forma: attempt.forma,
                correctas: correctas,
              },
            })
          },
          async () => null
        )

        if (scoreTable) {
          puntajePaes = scoreTable.puntajePaes
        } else {
          // Si no hay tabla exacta, buscar la más cercana
          const closestScore = await circuitBreakers.database.execute(
            async () => {
              return await prisma.scoreTable.findFirst({
                where: {
                  subjectCodigo: attempt.exam.subject.codigo,
                  proceso: attempt.proceso,
                  tipoAplicacion: attempt.tipoAplicacion,
                  forma: attempt.forma,
                  correctas: {
                    lte: correctas,
                  },
                },
                orderBy: {
                  correctas: 'desc',
                },
              })
            },
            async () => null
          )

          if (closestScore) {
            puntajePaes = closestScore.puntajePaes
            puntajeEstimado = true
          }
        }
      }

      // ✅ Enterprise: Usar transacción con circuit breaker para garantizar consistencia
      const updatedAttempt = await circuitBreakers.database.execute(
        async () => {
          return await prisma.$transaction(async tx => {
        // Actualizar el intento como completado
        // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
        const attempt = await tx.attempt.update({
          where: { id },
          data: {
            estado: 'completado',
            finishedAt,
            duracionSegundos,
            correctas,
            incorrectas,
            omitidas,
            porcentaje,
            puntajePaes,
            puntajeEstimado,
          },
          select: {
            id: true,
            estado: true,
            porcentaje: true,
            correctas: true,
            incorrectas: true,
            omitidas: true,
            puntajePaes: true,
            puntajeEstimado: true,
            finishedAt: true,
            duracionSegundos: true,
            exam: {
              select: {
                id: true,
                titulo: true,
                subject: {
                  select: {
                    id: true,
                    nombre: true,
                    codigo: true,
                  },
                },
              },
            },
            answers: {
              select: {
                id: true,
                esCorrecta: true,
                omitida: true,
                question: {
                  select: {
                    id: true,
                    topicId: true,
                    options: {
                      select: {
                        id: true,
                        texto: true,
                        esCorrecta: true,
                      },
                    },
                  },
                },
                optionSelected: {
                  select: {
                    id: true,
                    texto: true,
                    esCorrecta: true,
                  },
                },
              },
            },
          },
        })

        // Actualizar métricas de rendimiento por tema
        // Agrupar respuestas por tema
        const metricsByTopic = new Map<string, { total: number; correctas: number }>()

        for (const answer of attempt.answers) {
          const topicId = answer.question.topicId
          if (!topicId) continue

          if (!metricsByTopic.has(topicId)) {
            metricsByTopic.set(topicId, { total: 0, correctas: 0 })
          }

          const metric = metricsByTopic.get(topicId)
          if (metric) {
            metric.total++
            if (answer.esCorrecta === true) {
              metric.correctas++
            }
          }
        }

        // OPTIMIZACIÓN: Obtener todas las métricas existentes en una sola query (evita N+1)
        const topicIds = Array.from(metricsByTopic.keys())
        const existingMetrics =
          topicIds.length > 0
            ? await tx.performanceMetric.findMany({
                where: {
                  studentId,
                  topicId: { in: topicIds },
                },
              })
            : []

        // Crear Map para acceso rápido O(1)
        const existingMetricsMap = new Map(existingMetrics.map(m => [m.topicId, m]))

        // Actualizar o crear métricas usando Promise.all para paralelizar
        const metricUpdates = Array.from(metricsByTopic.entries()).map(
          async ([topicId, metric]) => {
            const existingMetric = existingMetricsMap.get(topicId)

            // Calcular totales acumulados
            const totalAcumulado = (existingMetric?.totalPreguntas || 0) + metric.total
            // ✅ Enterprise: Usar funciones seguras para cálculos de métricas
            const correctasAcumuladas = ensureFiniteNumber(existingMetric?.correctas, 0) + ensureFiniteNumber(metric.correctas, 0)
            const porcentajeMetric = safeRound(safeDivide(correctasAcumuladas, totalAcumulado, 0) * 100, 2)
            const nivel =
              porcentajeMetric >= 70 ? 'alto' : porcentajeMetric >= 50 ? 'medio' : 'bajo'

            return tx.performanceMetric.upsert({
              where: {
                studentId_topicId: {
                  studentId,
                  topicId,
                },
              },
              update: {
                totalPreguntas: {
                  increment: metric.total,
                },
                correctas: {
                  increment: metric.correctas,
                },
                porcentaje: porcentajeMetric,
                nivel,
              },
              create: {
                studentId,
                topicId,
                totalPreguntas: metric.total,
                correctas: metric.correctas,
                porcentaje: porcentajeMetric,
                nivel,
              },
            })
          }
        )

        // Ejecutar todas las actualizaciones en paralelo dentro de la transacción
        await Promise.all(metricUpdates)

          return attempt
        })
      },
      async () => {
        logger.error({ attemptId: id }, 'Circuit breaker activado para transaction (submit)')
        throw new Error('Error al finalizar intento: servicio temporalmente no disponible')
      }
    )

      // Invalidar caché de intentos y métricas del estudiante
      await invalidateCachePattern(`student:${studentId}:attempts:*`)
      await invalidateCachePattern(`student:${studentId}:metrics:*`)

      // Verificar si hay desafíos activos para este examen y completarlos
      try {
        // Usar transacción para actualizar desafíos de forma atómica
        // Esto previene condiciones de carrera cuando ambos completan simultáneamente
        // Obtener desafíos activos DENTRO de la transacción para evitar race conditions
        await prisma.$transaction(
          async tx => {
            // Obtener desafíos activos dentro de la transacción para tener datos frescos
            const activeChallenges = await tx.challenge.findMany({
              where: {
                examId: updatedAttempt.exam.id,
                status: CHALLENGE_STATUS.ACCEPTED,
                OR: [{ challengerId: studentId }, { challengedId: studentId }],
              },
            })

            for (const challenge of activeChallenges) {
              const isChallenger = challenge.challengerId === studentId
              const isChallenged = challenge.challengedId === studentId

              if (isChallenger && !challenge.challengerAttemptId) {
                // El desafiador completó su intento - actualizar el desafío
                const updatedChallenge = await tx.challenge.update({
                  where: { id: challenge.id },
                  data: { challengerAttemptId: id },
                  select: {
                    challengerAttemptId: true,
                    challengedAttemptId: true,
                    challengerId: true,
                    challengedId: true,
                  },
                })

                // Si el desafiado también completó, determinar ganador
                if (updatedChallenge.challengedAttemptId) {
                  const challengedAttempt = await tx.attempt.findUnique({
                    where: { id: updatedChallenge.challengedAttemptId },
                    select: { porcentaje: true },
                  })

                  if (challengedAttempt) {
                    const winnerId = determineChallengeWinner(
                      updatedAttempt,
                      challengedAttempt,
                      studentId,
                      updatedChallenge.challengedId
                    )

                    await tx.challenge.update({
                      where: { id: challenge.id },
                      data: {
                        status: CHALLENGE_STATUS.COMPLETED,
                        winnerId,
                        completedAt: new Date(),
                      },
                    })
                  }
                }
              } else if (isChallenged && !challenge.challengedAttemptId) {
                // El desafiado completó su intento - actualizar el desafío
                const updatedChallenge = await tx.challenge.update({
                  where: { id: challenge.id },
                  data: { challengedAttemptId: id },
                  select: {
                    challengerAttemptId: true,
                    challengedAttemptId: true,
                    challengerId: true,
                    challengedId: true,
                  },
                })

                // Si el desafiador también completó, determinar ganador
                if (updatedChallenge.challengerAttemptId) {
                  const challengerAttempt = await tx.attempt.findUnique({
                    where: { id: updatedChallenge.challengerAttemptId },
                    select: { porcentaje: true },
                  })

                  if (challengerAttempt) {
                    const winnerId = determineChallengeWinner(
                      challengerAttempt,
                      updatedAttempt,
                      updatedChallenge.challengerId,
                      studentId
                    )

                    await tx.challenge.update({
                      where: { id: challenge.id },
                      data: {
                        status: CHALLENGE_STATUS.COMPLETED,
                        winnerId,
                        completedAt: new Date(),
                      },
                    })
                  }
                }
              }
            }
          },
          {
            timeout: TRANSACTION_TIMEOUT_LONG,
          }
        )
      } catch (challengeError) {
        // No fallar el submit si hay error con desafíos
        const { logger } = await import('@/lib/logger')
        logger.error(
          {
            attemptId: id,
            error:
              challengeError instanceof Error ? challengeError.message : String(challengeError),
          },
          'Error al actualizar desafíos después de completar examen'
        )
      }

      const duration = Date.now() - startTime
      logger.info(
        {
          attemptId: id,
          studentId,
          porcentaje: updatedAttempt.porcentaje,
          correctas: updatedAttempt.correctas,
          puntajePaes: updatedAttempt.puntajePaes,
          duracionSegundos: updatedAttempt.duracionSegundos,
          duration,
          operation: 'submitAttempt',
        },
        'Intento finalizado exitosamente'
      )

      return NextResponse.json(updatedAttempt)
    } catch (error) {
      const duration = Date.now() - startTime
      try {
        const resolvedParams = await params
        attemptId = resolvedParams?.id || 'unknown'
      } catch (paramError) {
        logger.warn(
          { error: paramError, path: '/api/attempts/[id]/submit' },
          'Error al obtener params en catch de attempts/[id]/submit'
        )
      }
      
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          attemptId,
          duration,
          path: `/api/attempts/${attemptId}/submit`,
        },
        'Error al finalizar intento'
      )
      
      return handleApiError(error, 'Error al finalizar intento', {
        path: `/api/attempts/${attemptId}/submit`,
      })
    }
  })
}
