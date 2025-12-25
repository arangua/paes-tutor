import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, handleApiError } from '@/lib/api-helpers'
import { examQuerySchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'

// Constantes para tiempos de caché
const EXAMS_CACHE_TTL_MS = TIME_CONSTANTS.EXAMS_CACHE_TTL_MS

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
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

      // Usar caché para queries frecuentes (exámenes no cambian frecuentemente)
      const cacheKey = cacheKeys.exams(subjectId, tipo, limit, offset)
      const exams = await getCached(
        cacheKey,
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
        EXAMS_CACHE_TTL_MS
      )

      // Obtener total para paginación
      const total = await getCached(
        `${cacheKey}:total`,
        async () => {
          return await prisma.exam.count({
            where: whereClause,
          })
        },
        EXAMS_CACHE_TTL_MS
      )

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
      return handleApiError(error, 'Error al obtener exámenes', {
        path: '/api/exams',
      })
    }
  })
}
