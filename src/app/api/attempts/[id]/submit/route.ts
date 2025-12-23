import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { invalidateCachePattern } from '@/lib/cache'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      logApiRequest('POST', `/api/attempts/${id}/submit`)

      // Validar formato del ID (cuid)
      if (!id || !/^c[a-z0-9]{24}$/.test(id)) {
        return NextResponse.json({ error: 'ID de intento inválido' }, { status: 400 })
      }

      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Verificar que el intento existe y pertenece al estudiante
      // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
      const attempt = await prisma.attempt.findUnique({
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
      const correctas = attempt.answers.filter(a => a.esCorrecta === true).length
      const incorrectas = attempt.answers.filter(a => a.esCorrecta === false && !a.omitida).length
      const omitidas = attempt.answers.filter(a => a.omitida === true).length
      const total = attempt.totalPreguntas || 0
      const porcentaje = total > 0 ? (correctas / total) * 100 : 0

      // Calcular duración
      const finishedAt = new Date()
      let duracionSegundos: number | null = null

      if (attempt.startedAt) {
        duracionSegundos = Math.floor((finishedAt.getTime() - attempt.startedAt.getTime()) / 1000)

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
        const MAX_DURATION = 24 * 60 * 60 // 24 horas en segundos
        if (duracionSegundos > MAX_DURATION) {
          return NextResponse.json(
            {
              error: 'Duración inválida',
              details: `La duración del examen (${Math.floor(duracionSegundos / 60)} minutos) excede el límite máximo de 24 horas. Por favor, contacta al administrador.`,
            },
            { status: 400 }
          )
        }
      }

      // Calcular puntaje PAES si es posible
      let puntajePaes: number | null = null
      let puntajeEstimado = false

      if (attempt.proceso && attempt.tipoAplicacion && attempt.forma) {
        const scoreTable = await prisma.scoreTable.findFirst({
          where: {
            subjectCodigo: attempt.exam.subject.codigo,
            proceso: attempt.proceso,
            tipoAplicacion: attempt.tipoAplicacion,
            forma: attempt.forma,
            correctas: correctas,
          },
        })

        if (scoreTable) {
          puntajePaes = scoreTable.puntajePaes
        } else {
          // Si no hay tabla exacta, buscar la más cercana
          const closestScore = await prisma.scoreTable.findFirst({
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

          if (closestScore) {
            puntajePaes = closestScore.puntajePaes
            puntajeEstimado = true
          }
        }
      }

      // Usar transacción para garantizar consistencia entre intento y métricas
      const updatedAttempt = await prisma.$transaction(async tx => {
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

          const metric = metricsByTopic.get(topicId)!
          metric.total++
          if (answer.esCorrecta === true) {
            metric.correctas++
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
            const correctasAcumuladas = (existingMetric?.correctas || 0) + metric.correctas
            const porcentajeMetric =
              totalAcumulado > 0 ? (correctasAcumuladas / totalAcumulado) * 100 : 0
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

      // Invalidar caché de intentos y métricas del estudiante
      await invalidateCachePattern(`student:${studentId}:attempts:*`)
      await invalidateCachePattern(`student:${studentId}:metrics:*`)

      return NextResponse.json(updatedAttempt)
    } catch (error) {
      return handleApiError(error, 'Error al finalizar intento', {
        path: `/api/attempts/${await params.then(p => p.id)}/submit`,
      })
    }
  })
}
