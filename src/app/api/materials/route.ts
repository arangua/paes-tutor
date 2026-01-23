import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import { materialsQuerySchema } from '@/lib/validations'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('GET', '/api/materials')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar query parameters
      const validation = validateQuery(request, materialsQuerySchema)
      if (!validation.success) {
        return validation.error
      }

      const { subjectId, topicId, tipo, limit, offset } = validation.data

      // Construir where clause una sola vez para evitar duplicación
      const whereClause = {
        ...(subjectId && { subjectId }),
        ...(topicId && { topicId }),
        ...(tipo && { tipo }),
      }

      // Usar caché para queries frecuentes
      const cacheKey = cacheKeys.materials(subjectId, topicId, tipo, limit, offset)
      const materials = await getCached(
        cacheKey,
        async () => {
          // Búsqueda mejorada basada en malla curricular chilena
          // Prioriza materiales por relevancia: tema específico > asignatura > eje temático
          const materials = await prisma.studyMaterial.findMany({
            where: whereClause,
            select: {
              id: true,
              titulo: true,
              contenido: true,
              fuente: true,
              tipo: true,
              createdAt: true,
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
              topic: {
                select: {
                  id: true,
                  nombre: true,
                  ejeTematico: true,
                },
              },
            },
            skip: offset,
            take: limit,
            orderBy: [
              // Priorizar materiales con tema específico
              // Nota: Prisma ordena nulls al final por defecto en orden descendente
              { topicId: 'desc' },
              // Luego por fecha (más recientes primero)
              { createdAt: 'desc' },
            ],
          })

          // Ordenar por relevancia según malla curricular
          // Materiales con tema específico primero, luego por asignatura
          return materials
            .filter(m => m && typeof m === 'object')
            .sort((a, b) => {
              // Si ambos tienen tema, ordenar por fecha (más recientes primero)
              if (a.topic && b.topic) {
                const dateA = (() => {
                  if (!a.createdAt) return 0
                  try {
                    const date = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
                    if (date instanceof Date && !Number.isNaN(date.getTime())) {
                      const time = date.getTime()
                      return Number.isFinite(time) ? time : 0
                    }
                  } catch {
                    // Ignorar errores de fecha
                  }
                  return 0
                })()
                const dateB = (() => {
                  if (!b.createdAt) return 0
                  try {
                    const date = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
                    if (date instanceof Date && !Number.isNaN(date.getTime())) {
                      const time = date.getTime()
                      return Number.isFinite(time) ? time : 0
                    }
                  } catch {
                    // Ignorar errores de fecha
                  }
                  return 0
                })()
                const diff = dateB - dateA
                return Number.isFinite(diff) ? diff : 0
              }
              // Materiales con tema primero
              if (a.topic && !b.topic) return -1
              if (!a.topic && b.topic) return 1
              // Si ninguno tiene tema, ordenar por fecha
              const dateA = (() => {
                if (!a.createdAt) return 0
                try {
                  const date = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
                  if (date instanceof Date && !Number.isNaN(date.getTime())) {
                    const time = date.getTime()
                    return Number.isFinite(time) ? time : 0
                  }
                } catch {
                  // Ignorar errores de fecha
                }
                return 0
              })()
              const dateB = (() => {
                if (!b.createdAt) return 0
                try {
                  const date = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
                  if (date instanceof Date && !Number.isNaN(date.getTime())) {
                    const time = date.getTime()
                    return Number.isFinite(time) ? time : 0
                  }
                } catch {
                  // Ignorar errores de fecha
                }
                return 0
              })()
              const diff = dateB - dateA
              return Number.isFinite(diff) ? diff : 0
            })
        },
        TIME_CONSTANTS.MATERIALS_CACHE_TTL_MS
      )

      // Obtener total para paginación
      const total = await getCached(
        `${cacheKey}:total`,
        async () => {
          return await prisma.studyMaterial.count({
            where: whereClause,
          })
        },
        TIME_CONSTANTS.MATERIALS_CACHE_TTL_MS
      )

      return NextResponse.json({
        materials,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    } catch (error) {
      return handleApiError(error, 'Error al obtener materiales', {
        path: '/api/materials',
      })
    }
  })
}
