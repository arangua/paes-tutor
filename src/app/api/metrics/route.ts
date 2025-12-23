import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, handleApiError } from '@/lib/api-helpers'
import { metricsQuerySchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('GET', '/api/metrics')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
      })

      if (!student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      // Validar query parameters
      const validation = validateQuery(request, metricsQuerySchema)
      if (!validation.success) {
        return validation.error
      }

      const { subjectId, topicId } = validation.data

      // Obtener métricas agrupadas por asignatura
      const metrics = await prisma.performanceMetric.findMany({
        where: {
          studentId: student.id,
          ...(topicId && { topicId }),
          ...(subjectId && {
            topic: {
              subjectId,
            },
          }),
        },
        include: {
          topic: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: { porcentaje: 'desc' },
      })

      // Agrupar por asignatura
      interface SubjectMetric {
        codigo: string
        nombre: string
        totalPreguntas: number
        correctas: number
        temas: Array<{
          nombre: string
          porcentaje: number
          nivel: string | null
        }>
      }

      const metricsBySubject = metrics.reduce(
        (acc, metric) => {
          const subjectCode = metric.topic.subject.codigo
          if (!acc[subjectCode]) {
            acc[subjectCode] = {
              codigo: subjectCode,
              nombre: metric.topic.subject.nombre,
              totalPreguntas: 0,
              correctas: 0,
              temas: [],
            }
          }
          acc[subjectCode].totalPreguntas += metric.totalPreguntas
          acc[subjectCode].correctas += metric.correctas
          acc[subjectCode].temas.push({
            nombre: metric.topic.nombre,
            porcentaje: metric.porcentaje,
            nivel: metric.nivel,
          })
          return acc
        },
        {} as Record<string, SubjectMetric>
      )

      // Calcular porcentaje promedio por asignatura
      const result = Object.values(metricsBySubject).map(subject => ({
        ...subject,
        porcentaje:
          subject.totalPreguntas > 0 ? (subject.correctas / subject.totalPreguntas) * 100 : 0,
      }))

      return NextResponse.json(result)
    } catch (error) {
      return handleApiError(error, 'Error al obtener métricas', {
        path: '/api/metrics',
      })
    }
  })
}
