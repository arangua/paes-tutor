import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { generateAdvancedAnalytics } from '@/lib/analytics'

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

      // Usar caché para analytics (cambian poco)
      const analytics = await getCached(
        cacheKeys.studentAnalytics(studentId),
        async () => {
          // Obtener todos los intentos completados del estudiante
          // Optimizar usando select en lugar de include
          // Limitar a últimos 100 intentos para performance
          const attempts = await prisma.attempt.findMany({
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

          // Obtener métricas del estudiante
          // Optimizar usando select en lugar de include
          const metrics = await prisma.performanceMetric.findMany({
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

          // Convertir a formato esperado (ya está optimizado con select)
          const formattedAttempts = attempts.map(a => ({
            id: a.id,
            porcentaje: a.porcentaje,
            createdAt: a.createdAt.toISOString(),
            exam: {
              titulo: a.exam.titulo,
              subject: {
                nombre: a.exam.subject.nombre,
                codigo: a.exam.subject.codigo,
              },
            },
          }))

          const formattedMetrics = metrics.map(m => ({
            topicId: m.topicId,
            topicName: m.topic.nombre,
            subjectName: m.topic.subject.nombre,
            porcentaje: m.porcentaje,
            totalPreguntas: m.totalPreguntas,
            correctas: m.correctas,
          }))

          // Generar análisis avanzado
          return generateAdvancedAnalytics(formattedAttempts, formattedMetrics)
        },
        5 * 60 * 1000 // Cache por 5 minutos
      )

      return NextResponse.json(analytics)
    } catch (error) {
      return handleApiError(error, 'Error al obtener estadísticas avanzadas', {
        path: '/api/analytics',
      })
    }
  })
}
