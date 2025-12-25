import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit, RateLimitType } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache'
import {
  generateRecommendations,
  type PerformanceMetric as MetricType,
} from '@/lib/recommendations'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  // Usar 'read' para endpoints de lectura que se llaman frecuentemente desde el dashboard
  return withRateLimit(
    request,
    async () => {
      try {
        logApiRequest('GET', '/api/recommendations')
        const studentId = await getCurrentStudentId()

        if (!studentId) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // Usar caché para recomendaciones (cambian poco)
        const recommendations = await getCached(
          cacheKeys.studentRecommendations(studentId),
          async () => {
            // Obtener métricas del estudiante
            // Optimizar usando select en lugar de include
            const metrics = await prisma.performanceMetric.findMany({
              where: { studentId },
              select: {
                topicId: true,
                porcentaje: true,
                totalPreguntas: true,
                correctas: true,
                nivel: true,
                topic: {
                  select: {
                    nombre: true,
                    subject: {
                      select: {
                        nombre: true,
                        codigo: true,
                      },
                    },
                  },
                },
              },
            })

            // Convertir a formato esperado por el algoritmo
            const performanceMetrics: MetricType[] = metrics.map(m => ({
              topicId: m.topicId,
              topicName: m.topic.nombre,
              subjectName: m.topic.subject.nombre,
              subjectCode: m.topic.subject.codigo,
              porcentaje: m.porcentaje,
              totalPreguntas: m.totalPreguntas,
              correctas: m.correctas,
              nivel: m.nivel,
            }))

            // Obtener exámenes disponibles
            // Optimizar usando select en lugar de include
            // Limitar a últimos 50 exámenes para performance
            const exams = await prisma.exam.findMany({
              select: {
                id: true,
                titulo: true,
                subjectId: true,
                subject: {
                  select: {
                    nombre: true,
                    codigo: true,
                  },
                },
                questions: {
                  select: {
                    question: {
                      select: {
                        topicId: true,
                      },
                    },
                  },
                },
              },
              take: 50, // Límite para recomendaciones
              orderBy: { createdAt: 'desc' },
            })

            // Convertir a formato esperado
            const availableExams = exams.map(exam => ({
              id: exam.id,
              titulo: exam.titulo,
              subjectId: exam.subjectId,
              subject: {
                nombre: exam.subject.nombre,
                codigo: exam.subject.codigo,
              },
              questions: exam.questions.map(eq => ({
                question: {
                  topicId: eq.question.topicId,
                },
              })),
            }))

            // Generar recomendaciones
            return generateRecommendations(performanceMetrics, availableExams)
          },
          5 * 60 * 1000 // Cache por 5 minutos
        )

        return NextResponse.json(recommendations)
      } catch (error) {
        return handleApiError(error, 'Error al obtener recomendaciones', {
          path: '/api/recommendations',
        })
      }
    },
    'read'
  )
}
