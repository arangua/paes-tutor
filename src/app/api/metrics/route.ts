import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId, getSession } from '@/lib/get-session'
import { validateQuery, handleApiError } from '@/lib/api-helpers'
import { metricsQuerySchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'

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

      // ✅ Enterprise: Obtener estudiante con circuit breaker
      let student = await circuitBreakers.database.execute(
        async () => {
          return await prisma.student.findUnique({
            where: { id: studentId },
          })
        },
        async () => {
          logger.warn({ studentId }, 'Circuit breaker activado para findStudent, retornando null')
          return null
        }
      )

      // Si no se encuentra el estudiante, intentar obtenerlo desde el usuario
      // Esto puede ocurrir si hay una inconsistencia entre la sesión y la base de datos
      if (!student) {
        const session = await getSession()
        if (session?.user?.email) {
          const user = await circuitBreakers.database.execute(
            async () => {
              return await prisma.user.findUnique({
                where: { email: session.user.email },
                include: { student: true },
              })
            },
            async () => {
              logger.warn({ email: session.user.email }, 'Circuit breaker activado para findUser, retornando null')
              return null
            }
          )

          if (user?.student) {
            // Usar el estudiante correcto desde el usuario
            student = user.student
          }
        }
      }

      if (!student) {
        return NextResponse.json(
          {
            error: 'Estudiante no encontrado',
            message:
              'El estudiante asociado a tu cuenta no existe en la base de datos. Por favor, contacta al administrador.',
          },
          { status: 404 }
        )
      }

      // Validar query parameters
      const validation = validateQuery(request, metricsQuerySchema)
      if (!validation.success) {
        return validation.error
      }

      const { subjectId, topicId } = validation.data

      // ✅ Enterprise: Obtener métricas con circuit breaker
      const metrics = await circuitBreakers.database.execute(
        async () => {
          return await prisma.performanceMetric.findMany({
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
        },
        async () => {
          logger.warn({ studentId: student.id }, 'Circuit breaker activado para findMetrics, retornando array vacío')
          return []
        }
      )

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

      const metricsBySubject = metrics
        .filter(metric => metric.topic && metric.topic.subject)
        .reduce(
          (acc, metric) => {
            const subjectCode = metric.topic?.subject?.codigo || ''
            if (!acc[subjectCode]) {
              acc[subjectCode] = {
                codigo: subjectCode,
                nombre: metric.topic?.subject?.nombre || '',
                totalPreguntas: 0,
                correctas: 0,
                temas: [],
              }
            }
            // CORRECCIÓN: Validar que metric.totalPreguntas y metric.correctas sean números finitos antes de sumar
            const safeTotalPreguntas = Number.isFinite(metric.totalPreguntas) && metric.totalPreguntas >= 0
              ? metric.totalPreguntas
              : 0
            const safeCorrectas = Number.isFinite(metric.correctas) && metric.correctas >= 0
              ? metric.correctas
              : 0
            const newTotalPreguntas = (Number.isFinite(acc[subjectCode].totalPreguntas) ? acc[subjectCode].totalPreguntas : 0) + safeTotalPreguntas
            const newCorrectas = (Number.isFinite(acc[subjectCode].correctas) ? acc[subjectCode].correctas : 0) + safeCorrectas
            acc[subjectCode].totalPreguntas = Number.isFinite(newTotalPreguntas) && newTotalPreguntas >= 0 ? newTotalPreguntas : acc[subjectCode].totalPreguntas
            acc[subjectCode].correctas = Number.isFinite(newCorrectas) && newCorrectas >= 0 ? newCorrectas : acc[subjectCode].correctas
            acc[subjectCode].temas.push({
              nombre: metric.topic?.nombre || '',
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
