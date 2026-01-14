import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'
import { TIME_CONSTANTS } from '@/lib/constants'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'
import { measurePerformance, trackMetric, trackError } from '@/lib/monitoring'

// Especificar Node.js runtime (necesario para Prisma y otras dependencias)
export const runtime = 'nodejs'

// Función auxiliar para obtener los datos del estudiante
async function getStudentData(studentId: string) {
  return await prisma.student.findUnique({
    where: { id: studentId },
    select: {
      id: true,
      nombre: true,
      createdAt: true,
      attempts: {
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          estado: true,
          porcentaje: true,
          correctas: true,
          totalPreguntas: true,
          puntajePaes: true,
          createdAt: true,
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
        },
      },
      metrics: {
        select: {
          id: true,
          porcentaje: true,
          totalPreguntas: true,
          correctas: true,
          nivel: true,
          topic: {
            select: {
              id: true,
              nombre: true,
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
      },
    },
  })
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    // ✅ Enterprise: Medir performance de la operación completa
    return await measurePerformance('api.student.get', async () => {
      try {
        logApiRequest('GET', '/api/student')
        // Obtener sesión usando getSession que maneja correctamente el contexto
        const session = await getSession()

      // Si no hay sesión, retornar 401
      if (!session?.user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Obtener studentId directamente de la sesión
      const studentId = session.user.studentId

      // Si hay studentId, intentar obtener el estudiante
      if (studentId) {
        // ✅ Enterprise: Obtener estudiante con circuit breaker
        let student = await getCached(
          cacheKeys.student(studentId),
          async () => {
            return await circuitBreakers.database.execute(
              async () => {
                return await getStudentData(studentId)
              },
              async () => {
                logger.warn({ studentId }, 'Circuit breaker activado para getStudentData, retornando null')
                return null
              }
            )
          },
          TIME_CONSTANTS.STUDENT_CACHE_TTL_MS
        )

        // Si no se encuentra el estudiante, intentar obtenerlo desde el usuario
        // Esto puede ocurrir si hay una inconsistencia entre la sesión y la base de datos
        if (!student) {
          if (session.user.email) {
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
              // ✅ Enterprise: Obtener el estudiante correcto desde el usuario con circuit breaker
              student = await circuitBreakers.database.execute(
                async () => {
                  return await getStudentData(user.student.id)
                },
                async () => {
                  logger.warn({ studentId: user.student.id }, 'Circuit breaker activado para getStudentData (fallback), retornando null')
                  return null
                }
              )
            }
          }
        }

        // Si encontramos el estudiante, retornarlo
        if (student) {
          // ✅ Enterprise: Trackear métrica de éxito
          trackMetric('api.student.get.success', 1, { hasStudent: 'true' })
          return NextResponse.json(student)
        }
      }

      // Si no hay studentId o no se encontró el estudiante, retornar información del usuario
      // Esto es útil para usuarios que aún no tienen un perfil de estudiante creado
      trackMetric('api.student.get.success', 1, { hasStudent: 'false' })
      return NextResponse.json({
        id: session.user.id || null,
        nombre: session.user.name || null,
        email: session.user.email || null,
        // Indicar que no hay perfil de estudiante
        isStudent: false,
      })
    } catch (error) {
      // ✅ Enterprise: Trackear error
      trackError(error instanceof Error ? error : new Error(String(error)), { path: '/api/student' }, 'high')
      return handleApiError(error, 'Error al obtener datos del estudiante', {
        path: '/api/student',
      })
    }
    })
  })
}
