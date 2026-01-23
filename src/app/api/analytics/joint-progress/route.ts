import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { safeMathMax, safeAverage, safeDivide } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

/**
 * API para obtener el progreso conjunto de ambos usuarios
 * Muestra estadísticas y últimos exámenes de ambos estudiantes
 */
export async function GET(request: NextRequest) {
  // Usar 'read' para endpoints de lectura que se llaman frecuentemente desde el dashboard
  return withRateLimit(
    request,
    async () => {
      try {
        const dbUser = await getAuthenticatedUserWithStudent()
        if (!dbUser?.email || !dbUser.student) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const currentStudentId = dbUser.student.id

        // Obtener todos los estudiantes (solo deberían ser 2)
        const allStudents = await prisma.student.findMany({
          select: {
            id: true,
            nombre: true,
            user: {
              select: {
                email: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        })

        // CORRECCIÓN: Validar que allStudents sea un array válido antes de acceder a length
        if (!Array.isArray(allStudents)) {
          logger.warn({ allStudents }, 'analytics/joint-progress: allStudents no es un array válido')
          return NextResponse.json({
            message: 'Error al obtener estudiantes',
            progress: null,
          })
        }
        
        const safeAllStudentsLength = Number.isFinite(allStudents.length) ? allStudents.length : 0
        if (safeAllStudentsLength < 2) {
          return NextResponse.json({
            message: 'Se necesitan al menos 2 estudiantes para mostrar progreso conjunto',
            progress: null,
          })
        }

        // Encontrar el otro estudiante
        // CORRECCIÓN: Validar que allStudents sea un array válido y que s.id y currentStudentId existan antes de comparar
        const otherStudent = (() => {
          if (!Array.isArray(allStudents)) {
            return null
          }
          const safeCurrentStudentId = currentStudentId && typeof currentStudentId === 'string' ? currentStudentId : null
          if (!safeCurrentStudentId) {
            logger.warn({ currentStudentId }, 'analytics/joint-progress: currentStudentId no es válido')
            return null
          }
          try {
            return allStudents.find(s => {
              if (!s || typeof s !== 'object') {
                return false
              }
              const safeSId = s.id && typeof s.id === 'string' ? s.id : null
              return safeSId !== null && safeSId !== safeCurrentStudentId
            }) || null
          } catch (error) {
            logger.warn({ error, allStudents }, 'analytics/joint-progress: Error al ejecutar find() en allStudents')
            return null
          }
        })()
        if (!otherStudent) {
          return NextResponse.json({
            message: 'No se encontró el otro estudiante',
            progress: null,
          })
        }

        // Función helper para obtener progreso de un estudiante
        const getStudentProgress = async (studentId: string) => {
          // Obtener intentos completados
          const attempts = await prisma.attempt.findMany({
            where: {
              studentId,
              estado: 'completado',
            },
            select: {
              id: true,
              porcentaje: true,
              puntajePaes: true,
              correctas: true,
              totalPreguntas: true,
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
            orderBy: { createdAt: 'desc' },
            take: 10, // Últimos 10 intentos
          })

          // Calcular estadísticas
          const totalAttempts = Array.isArray(attempts) ? attempts.length : 0
          const safeAttempts = Array.isArray(attempts) ? attempts.filter(a => a && typeof a === 'object') : []
          
          const averagePercentage = safeAverage(
            safeAttempts
              .map(a => a?.porcentaje)
              .filter(p => Number.isFinite(p) && p >= 0 && p <= 100),
            0
          )
          
          const bestPercentage =
            safeAttempts.length > 0
              ? (() => {
                  try {
                    const percentages = safeAttempts
                      .map(a => {
                        const safePorcentaje = Number.isFinite(a?.porcentaje) && a.porcentaje >= 0 && a.porcentaje <= 100
                          ? a.porcentaje
                          : 0
                        return safePorcentaje
                      })
                      .filter(p => Number.isFinite(p) && p >= 0 && p <= 100)
                    if (!Array.isArray(percentages) || percentages.length === 0) return 0
                    // CORRECCIÓN: Validar que el array tenga elementos antes de usar spread operator con Math.max()
                    try {
                      const max = safeMathMax(percentages)
                      return Number.isFinite(max) ? max : 0
                    } catch (maxError) {
                      logger.warn({ error: maxError, percentages }, 'joint-progress: Error al ejecutar Math.max() con spread operator, usando reduce como fallback')
                      // Fallback: usar reduce si Math.max con spread falla
                      const maxReduce = percentages.reduce((a, b) => {
                        const safeA = Number.isFinite(a) ? a : 0
                        const safeB = Number.isFinite(b) ? b : 0
                        return safeA > safeB ? safeA : safeB
                      }, 0)
                      return Number.isFinite(maxReduce) ? maxReduce : 0
                    }
                  } catch {
                    return 0
                  }
                })()
              : 0
          
          const paesScores = safeAttempts
            .map(a => a?.puntajePaes)
            .filter((p): p is number => p !== null && Number.isFinite(p) && p >= 0)
          
          const averagePaesScore =
            paesScores.length > 0
              ? (() => {
                  // ✅ Enterprise: Calcular promedio usando funciones seguras
                  const sum = paesScores.reduce((a, b) => {
                    const safeA = Number.isFinite(a) ? a : 0
                    const safeB = Number.isFinite(b) ? b : 0
                    const result = safeA + safeB
                    return Number.isFinite(result) ? result : safeA
                  }, 0)
                  return Number.isFinite(sum) && paesScores.length > 0 ? safeDivide(sum, paesScores.length, null) : null
                })()
              : null
          
          const bestPaesScore = paesScores.length > 0
            ? (() => {
                try {
                  // CORRECCIÓN: Validar que el array tenga elementos antes de usar spread operator con Math.max()
                  if (!Array.isArray(paesScores) || paesScores.length === 0) return null
                  try {
                    const max = safeMathMax(paesScores)
                    return Number.isFinite(max) ? max : null
                  } catch (maxError) {
                    logger.warn({ error: maxError, paesScores }, 'joint-progress: Error al ejecutar Math.max() con spread operator para paesScores, usando reduce como fallback')
                    // Fallback: usar reduce si Math.max con spread falla
                    const maxReduce = paesScores.reduce((a, b) => {
                      const safeA = Number.isFinite(a) ? a : 0
                      const safeB = Number.isFinite(b) ? b : 0
                      return safeA > safeB ? safeA : safeB
                    }, 0)
                    return Number.isFinite(maxReduce) ? maxReduce : null
                  }
                } catch {
                  return null
                }
              })()
            : null

          // Obtener métricas por tema
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
                      codigo: true,
                    },
                  },
                },
              },
            },
            orderBy: { porcentaje: 'desc' },
            take: 5, // Top 5 temas
          })

          // Filtrar métricas con topic y subject válidos
          const validMetrics = metrics.filter(m => m.topic && m.topic.subject)

          // Calcular tendencia reciente (últimos 5 vs anteriores)
          let trend: 'improving' | 'declining' | 'stable' = 'stable'
          if (safeAttempts.length >= 10) {
            const recent = safeAttempts.slice(0, 5).filter(a => a && typeof a === 'object')
            const older = safeAttempts.slice(5, 10).filter(a => a && typeof a === 'object')
            
            const recentAvg = recent.length > 0
              ? (() => {
                  const percentages = recent
                    .map(a => {
                      const safePorcentaje = Number.isFinite(a?.porcentaje) && a.porcentaje >= 0 && a.porcentaje <= 100
                        ? a.porcentaje
                        : 0
                      return safePorcentaje
                    })
                    .filter(p => Number.isFinite(p))
                  if (percentages.length === 0) return 0
                  // ✅ Enterprise: Calcular promedio usando funciones seguras
                  const sum = percentages.reduce((a, b) => {
                    const safeA = Number.isFinite(a) ? a : 0
                    const safeB = Number.isFinite(b) ? b : 0
                    const result = safeA + safeB
                    return Number.isFinite(result) ? result : safeA
                  }, 0)
                  return Number.isFinite(sum) && percentages.length > 0 ? safeDivide(sum, percentages.length, 0) : 0
                })()
              : 0
            
            const olderAvg = older.length > 0
              ? (() => {
                  const percentages = older
                    .map(a => {
                      const safePorcentaje = Number.isFinite(a?.porcentaje) && a.porcentaje >= 0 && a.porcentaje <= 100
                        ? a.porcentaje
                        : 0
                      return safePorcentaje
                    })
                    .filter(p => Number.isFinite(p))
                  if (percentages.length === 0) return 0
                  // ✅ Enterprise: Calcular promedio usando funciones seguras
                  const sum = percentages.reduce((a, b) => {
                    const safeA = Number.isFinite(a) ? a : 0
                    const safeB = Number.isFinite(b) ? b : 0
                    const result = safeA + safeB
                    return Number.isFinite(result) ? result : safeA
                  }, 0)
                  return Number.isFinite(sum) && percentages.length > 0 ? safeDivide(sum, percentages.length, 0) : 0
                })()
              : 0
            
            const diff = recentAvg - olderAvg
            const safeDiff = Number.isFinite(diff) ? diff : 0
            if (safeDiff > 2) trend = 'improving'
            else if (safeDiff < -2) trend = 'declining'
          }

          return {
            totalAttempts,
            averagePercentage,
            bestPercentage,
            averagePaesScore,
            bestPaesScore,
            recentAttempts: attempts.slice(0, 5), // Últimos 5 para mostrar
            topTopics: validMetrics,
            trend,
          }
        }

        // Obtener progreso de ambos estudiantes en paralelo
        const [currentProgress, otherProgress] = await Promise.all([
          getStudentProgress(currentStudentId),
          getStudentProgress(otherStudent.id),
        ])

        return NextResponse.json({
          current: {
            student: {
              id: dbUser.student.id,
              nombre: dbUser.student.nombre,
              email: dbUser.email,
            },
            progress: currentProgress,
          },
          other: {
            student: {
              id: otherStudent.id,
              nombre: otherStudent.nombre,
              email: otherStudent.user?.email || null,
            },
            progress: otherProgress,
          },
        })
      } catch (error) {
        logger.error(
          {
            type: 'analytics_joint_progress_error',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
          'Error al calcular progreso conjunto'
        )
        return NextResponse.json({ error: 'Error al calcular progreso conjunto' }, { status: 500 })
      }
    },
    'read'
  )
}
