import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { z } from 'zod'

// Especificar Node.js runtime
export const runtime = 'nodejs'

import { materialsQuerySchema } from '@/lib/validations'

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

      // Usar caché para queries frecuentes
      const cacheKey = cacheKeys.materials(subjectId, topicId, tipo, limit, offset)
      const materials = await getCached(
        cacheKey,
        async () => {
          // Búsqueda mejorada basada en malla curricular chilena
          // Prioriza materiales por relevancia: tema específico > asignatura > eje temático
          const materials = await prisma.studyMaterial.findMany({
            where: {
              ...(subjectId && { subjectId }),
              ...(topicId && { topicId }),
              ...(tipo && { tipo }),
            },
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
          return materials.sort((a, b) => {
            // Si ambos tienen tema, ordenar por fecha (más recientes primero)
            if (a.topic && b.topic) {
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            }
            // Materiales con tema primero
            if (a.topic && !b.topic) return -1
            if (!a.topic && b.topic) return 1
            // Si ninguno tiene tema, ordenar por fecha
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          })
        },
        10 * 60 * 1000 // Cache por 10 minutos
      )

      // Obtener total para paginación
      const total = await getCached(
        `${cacheKey}:total`,
        async () => {
          return await prisma.studyMaterial.count({
            where: {
              ...(subjectId && { subjectId }),
              ...(topicId && { topicId }),
              ...(tipo && { tipo }),
            },
          })
        },
        10 * 60 * 1000
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
