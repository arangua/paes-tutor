import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, handleApiError } from '@/lib/api-helpers'
import { examQuerySchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'
import { measurePerformance, trackMetric } from '@/lib/monitoring'

// Constantes para tiempos de caché
const EXAMS_CACHE_TTL_MS = TIME_CONSTANTS.EXAMS_CACHE_TTL_MS

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    // ✅ Enterprise: Medir performance de la operación completa
    return await measurePerformance('api.exams.get', async () => {
      try {
        logApiRequest('GET', '/api/exams')

      // Validar autenticación
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar query parameters
      const validation = validateQuery(request, examQuerySchema)
      if (!validation.success) {
        return validation.error
      }

      const { subjectId, tipo, limit, offset } = validation.data

      // Construir where clause una sola vez para evitar duplicación
      const whereClause = {
        ...(subjectId && { subjectId }),
        ...(tipo && { tipo }),
      }

      // ✅ Enterprise: Usar caché con circuit breaker para queries frecuentes
      const cacheKey = cacheKeys.exams(subjectId, tipo, limit, offset)
      const exams = await getCached(
        cacheKey,
        async () => {
          return await circuitBreakers.database.execute(
            async () => {
              // Optimizar query usando select en lugar de include
              return await prisma.exam.findMany({
                where: whereClause,
                select: {
                  id: true,
                  titulo: true,
                  descripcion: true,
                  tipo: true,
                  tiempoLimiteMin: true,
                  totalPreguntas: true,
                  fuente: true,
                  createdAt: true,
                  subject: {
                    select: {
                      id: true,
                      nombre: true,
                      codigo: true,
                    },
                  },
                  // Solo contar preguntas, no cargar todas
                  questions: {
                    select: {
                      id: true,
                    },
                  },
                },
                skip: offset,
                take: limit,
                orderBy: { createdAt: 'desc' },
              })
            },
            async () => {
              logger.warn({ subjectId, tipo }, 'Circuit breaker activado para findExams, retornando array vacío')
              return []
            }
          )
        },
        EXAMS_CACHE_TTL_MS
      )

      // ✅ Enterprise: Obtener total para paginación con circuit breaker
      const total = await getCached(
        `${cacheKey}:total`,
        async () => {
          return await circuitBreakers.database.execute(
            async () => {
              return await prisma.exam.count({
                where: whereClause,
              })
            },
            async () => {
              logger.warn({ subjectId, tipo }, 'Circuit breaker activado para countExams, retornando 0')
              return 0
            }
          )
        },
        EXAMS_CACHE_TTL_MS
      )

      // ✅ Enterprise: Trackear métricas de éxito
      trackMetric('api.exams.get.success', 1, { count: exams.length.toString() })
      trackMetric('api.exams.get.count', exams.length)

      return NextResponse.json({
        exams,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    } catch (error) {
      // ✅ Enterprise: Trackear error
      const { trackError } = await import('@/lib/monitoring')
      trackError(error instanceof Error ? error : new Error(String(error)), { path: '/api/exams' }, 'high')
      return handleApiError(error, 'Error al obtener exámenes', {
        path: '/api/exams',
      })
    }
    })
  })
}
