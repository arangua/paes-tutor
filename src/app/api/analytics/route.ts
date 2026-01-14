import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import { generateAdvancedAnalytics } from '@/lib/analytics'
import { safeToISODate } from '@/app/api/notes/versions/validation-utils'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('GET', '/api/analytics')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // ✅ Enterprise: Usar caché con circuit breaker para analytics
      const analytics = await getCached(
        cacheKeys.studentAnalytics(studentId),
        async () => {
          // ✅ Enterprise: Obtener intentos con circuit breaker
          const attempts = await circuitBreakers.database.execute(
            async () => {
              return await prisma.attempt.findMany({
                where: {
                  studentId,
                  estado: 'completado',
                },
                take: 100, // Límite para análisis de tendencias
                select: {
                  id: true,
                  porcentaje: true,
                  createdAt: true,
                  exam: {
                    select: {
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
                orderBy: { createdAt: 'desc' },
              })
            },
            async () => {
              logger.warn({ studentId }, 'Circuit breaker activado para findAttempts, retornando array vacío')
              return []
            }
          )

          // ✅ Enterprise: Obtener métricas con circuit breaker
          const metrics = await circuitBreakers.database.execute(
            async () => {
              return await prisma.performanceMetric.findMany({
                where: { studentId },
                select: {
                  topicId: true,
                  porcentaje: true,
                  totalPreguntas: true,
                  correctas: true,
                  topic: {
                    select: {
                      nombre: true,
                      subject: {
                        select: {
                          nombre: true,
                        },
                      },
                    },
                  },
                },
              })
            },
            async () => {
              logger.warn({ studentId }, 'Circuit breaker activado para findMetrics, retornando array vacío')
              return []
            }
          )

          // Convertir a formato esperado (ya está optimizado con select)
          const formattedAttempts = attempts
            .filter(a => a && a.exam && a.exam.subject)
            .map(a => {
              let createdAtISO = ''
              try {
                const safeCreatedAt = a.createdAt instanceof Date && !Number.isNaN(a.createdAt.getTime())
                  ? a.createdAt
                  : a.createdAt
                    ? new Date(a.createdAt)
                    : new Date()
                createdAtISO = safeToISODate(safeCreatedAt)
              } catch {
                createdAtISO = safeToISODate(new Date())
              }

              return {
                id: a.id || '',
                porcentaje: Number.isFinite(a.porcentaje) && a.porcentaje >= 0 && a.porcentaje <= 100
                  ? a.porcentaje
                  : 0,
                createdAt: createdAtISO,
                exam: {
                  titulo: typeof a.exam?.titulo === 'string' ? a.exam.titulo : '',
                  subject: {
                    nombre: typeof a.exam?.subject?.nombre === 'string' ? a.exam.subject.nombre : '',
                    codigo: typeof a.exam?.subject?.codigo === 'string' ? a.exam.subject.codigo : '',
                  },
                },
              }
            })

          const formattedMetrics = metrics
            .filter(m => m.topic && m.topic.subject)
            .map(m => ({
              topicId: m.topicId,
              topicName: m.topic?.nombre || '',
              subjectName: m.topic?.subject?.nombre || '',
              porcentaje: m.porcentaje,
              totalPreguntas: m.totalPreguntas,
              correctas: m.correctas,
            }))

          // Generar análisis avanzado
          return generateAdvancedAnalytics(formattedAttempts, formattedMetrics)
        },
        TIME_CONSTANTS.ANALYTICS_CACHE_TTL_MS
      )

      return NextResponse.json(analytics)
    } catch (error) {
      return handleApiError(error, 'Error al obtener estadísticas avanzadas', {
        path: '/api/analytics',
      })
    }
  })
}
