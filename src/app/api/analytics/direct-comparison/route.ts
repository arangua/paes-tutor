import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { safeMathMax, safeMathMin, safeAverage, safeDivide } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

/**
 * API para comparación directa entre los 2 usuarios del sistema
 * Compara el usuario actual con el otro usuario (hijo y novia)
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
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
        logger.warn({ allStudents }, 'analytics/direct-comparison: allStudents no es un array válido')
        return NextResponse.json({
          message: 'Error al obtener estudiantes',
          comparison: null,
        })
      }
      
      const safeAllStudentsLength = Number.isFinite(allStudents.length) ? allStudents.length : 0
      if (safeAllStudentsLength < 2) {
        return NextResponse.json({
          message: 'Se necesitan al menos 2 estudiantes para comparar',
          comparison: null,
        })
      }

      // Encontrar el otro estudiante (el que no es el actual)
      // CORRECCIÓN: Validar que allStudents sea un array válido y que s.id y currentStudentId existan antes de comparar
      const otherStudent = (() => {
        if (!Array.isArray(allStudents)) {
          return null
        }
        const safeCurrentStudentId = currentStudentId && typeof currentStudentId === 'string' ? currentStudentId : null
        if (!safeCurrentStudentId) {
          logger.warn({ currentStudentId }, 'analytics/direct-comparison: currentStudentId no es válido')
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
          logger.warn({ error, allStudents }, 'analytics/direct-comparison: Error al ejecutar find() en allStudents')
          return null
        }
      })()
      if (!otherStudent) {
        return NextResponse.json({
          message: 'No se encontró el otro estudiante para comparar',
          comparison: null,
        })
      }

      // Obtener intentos completados de ambos estudiantes
      const [currentAttempts, otherAttempts] = await Promise.all([
        prisma.attempt.findMany({
          where: {
            studentId: currentStudentId,
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
                    codigo: true,
                    nombre: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
        prisma.attempt.findMany({
          where: {
            studentId: otherStudent.id,
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
                    codigo: true,
                    nombre: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        }),
      ])

      // Calcular estadísticas generales
      const calculateStats = (attempts: typeof currentAttempts) => {
        if (attempts.length === 0) {
          return {
            totalAttempts: 0,
            averagePercentage: 0,
            bestPercentage: 0,
            worstPercentage: 0,
            averagePaesScore: null,
            bestPaesScore: null,
            totalCorrect: 0,
            totalQuestions: 0,
            recentTrend: 'stable' as const,
          }
        }

        // CORRECCIÓN: Validar que attempts sea un array válido antes de usar map()
        const safeAttempts = Array.isArray(attempts) ? attempts : []
        const percentages = safeAttempts
          .filter(a => a && typeof a === 'object' && Number.isFinite(a.porcentaje) && a.porcentaje >= 0 && a.porcentaje <= 100)
          .map(a => a.porcentaje)
        const paesScores = safeAttempts
          .map(a => a?.puntajePaes)
          .filter((p): p is number => p !== null && Number.isFinite(p) && p >= 0)

        // Calcular tendencia reciente (últimos 5 vs anteriores)
        // CORRECCIÓN: Validar que safeAttempts sea un array válido antes de usar slice()
        const safeRecent = Array.isArray(safeAttempts) && safeAttempts.length > 0
          ? safeAttempts.slice(0, 5).filter(a => a && typeof a === 'object' && Number.isFinite(a.porcentaje))
          : []
        const safeOlder = Array.isArray(safeAttempts) && safeAttempts.length > 5
          ? safeAttempts.slice(5, 10).filter(a => a && typeof a === 'object' && Number.isFinite(a.porcentaje))
          : []
        let recentTrend: 'improving' | 'declining' | 'stable' = 'stable'
        if (safeRecent.length > 0 && safeOlder.length > 0) {
          const recentAvg = safeAverage(safeRecent.map(a => a.porcentaje), 0)
          const olderAvg = safeAverage(safeOlder.map(a => a.porcentaje), 0)
          
          const diff = Number.isFinite(recentAvg) && Number.isFinite(olderAvg) ? recentAvg - olderAvg : 0
          if (Number.isFinite(diff)) {
            if (diff > 2) recentTrend = 'improving'
            else if (diff < -2) recentTrend = 'declining'
          }
        }

        const averagePercentage = safeAverage(percentages, 0)
        
        let bestPercentage = 0
        let worstPercentage = 0
        if (Array.isArray(percentages) && percentages.length > 0) {
          try {
            const max = safeMathMax(percentages)
            bestPercentage = Number.isFinite(max) ? max : 0
          } catch (error) {
            logger.warn({ error, percentages }, 'direct-comparison: Error al ejecutar Math.max() con spread operator en calculateStats, usando reduce como fallback')
            const maxReduce = percentages.reduce((a, b) => {
              const safeA = Number.isFinite(a) ? a : 0
              const safeB = Number.isFinite(b) ? b : 0
              return safeA > safeB ? safeA : safeB
            }, 0)
            bestPercentage = Number.isFinite(maxReduce) ? maxReduce : 0
          }
          
          try {
            const min = safeMathMin(percentages)
            worstPercentage = Number.isFinite(min) ? min : 0
          } catch (error) {
            logger.warn({ error, percentages }, 'direct-comparison: Error al ejecutar Math.min() con spread operator en calculateStats, usando reduce como fallback')
            const minReduce = percentages.reduce((a, b) => {
              const safeA = Number.isFinite(a) ? a : 100
              const safeB = Number.isFinite(b) ? b : 100
              return safeA < safeB ? safeA : safeB
            }, 100)
            worstPercentage = Number.isFinite(minReduce) ? minReduce : 0
          }
        }
        
        const safePaesScoresLength = Array.isArray(paesScores) && Number.isFinite(paesScores.length) && paesScores.length >= 0
          ? paesScores.length
          : 0
        // ✅ Enterprise: Calcular promedio usando funciones seguras
        const averagePaesScore = safePaesScoresLength > 0
          ? (() => {
              const sum = paesScores.reduce((a, b) => {
                const safeA = Number.isFinite(a) ? a : 0
                const safeB = Number.isFinite(b) ? b : 0
                const result = safeA + safeB
                return Number.isFinite(result) ? result : safeA
              }, 0)
              return Number.isFinite(sum) && safePaesScoresLength > 0 ? safeDivide(sum, safePaesScoresLength, null) : null
            })()
          : null
        
        let bestPaesScore: number | null = null
        if (Array.isArray(paesScores) && paesScores.length > 0) {
          try {
            const max = safeMathMax(paesScores)
            bestPaesScore = Number.isFinite(max) ? max : null
          } catch (error) {
            logger.warn({ error, paesScores }, 'direct-comparison: Error al ejecutar Math.max() con spread operator en calculateStats para paesScores, usando reduce como fallback')
            const maxReduce = paesScores.reduce((a, b) => {
              const safeA = Number.isFinite(a) ? a : 0
              const safeB = Number.isFinite(b) ? b : 0
              return safeA > safeB ? safeA : safeB
            }, 0)
            bestPaesScore = Number.isFinite(maxReduce) ? maxReduce : null
          }
        }
        
        // CORRECCIÓN: Validar que a.correctas y a.totalPreguntas sean números finitos antes de reducir
        const totalCorrect = safeAttempts.reduce((sum, a) => {
          const safeSum = Number.isFinite(sum) ? sum : 0
          const safeCorrectas = a && typeof a === 'object' && Number.isFinite(a.correctas) && a.correctas >= 0 ? a.correctas : 0
          const result = safeSum + safeCorrectas
          return Number.isFinite(result) ? result : safeSum
        }, 0)
        
        const totalQuestions = safeAttempts.reduce((sum, a) => {
          const safeSum = Number.isFinite(sum) ? sum : 0
          const safeTotalPreguntas = a && typeof a === 'object' && Number.isFinite(a.totalPreguntas) && a.totalPreguntas >= 0 ? a.totalPreguntas : 0
          const result = safeSum + safeTotalPreguntas
          return Number.isFinite(result) ? result : safeSum
        }, 0)
        
        // CORRECCIÓN: Validar que safeAttempts.length sea un número finito
        const safeTotalAttempts = Array.isArray(safeAttempts) && Number.isFinite(safeAttempts.length) && safeAttempts.length >= 0
          ? safeAttempts.length
          : 0

        return {
          totalAttempts: safeTotalAttempts,
          averagePercentage: Number.isFinite(averagePercentage) ? averagePercentage : 0,
          bestPercentage: Number.isFinite(bestPercentage) ? bestPercentage : 0,
          worstPercentage: Number.isFinite(worstPercentage) ? worstPercentage : 0,
          averagePaesScore: averagePaesScore !== null && Number.isFinite(averagePaesScore) ? averagePaesScore : null,
          bestPaesScore,
          totalCorrect: Number.isFinite(totalCorrect) && totalCorrect >= 0 ? totalCorrect : 0,
          totalQuestions: Number.isFinite(totalQuestions) && totalQuestions >= 0 ? totalQuestions : 0,
          recentTrend,
        }
      }

      const currentStats = calculateStats(currentAttempts)
      const otherStats = calculateStats(otherAttempts)

      // Calcular estadísticas por asignatura
      const calculateSubjectStats = (attempts: typeof currentAttempts) => {
        const bySubject = new Map<
          string,
          {
            subjectCode: string
            subjectName: string
            attempts: typeof attempts
          }
        >()

        attempts
          .filter(attempt => attempt.exam && attempt.exam.subject)
          .forEach(attempt => {
            const code = attempt.exam?.subject?.codigo || ''
            if (!code) return
            
            if (!bySubject.has(code)) {
              bySubject.set(code, {
                subjectCode: code,
                subjectName: attempt.exam?.subject?.nombre || '',
                attempts: [],
              })
            }
            const subjectGroup = bySubject.get(code)
            if (subjectGroup && Array.isArray(subjectGroup.attempts)) {
              subjectGroup.attempts.push(attempt)
            }
          })

        return Array.from(bySubject.values())
          .filter(subject => subject && subject.attempts && Array.isArray(subject.attempts))
          .map(subject => {
            const safeAttempts = Array.isArray(subject.attempts) ? subject.attempts : []
            const percentages = safeAttempts
              .map(a => {
                const safePorcentaje = Number.isFinite(a?.porcentaje) && a.porcentaje >= 0 && a.porcentaje <= 100
                  ? a.porcentaje
                  : 0
                return safePorcentaje
              })
              .filter(p => Number.isFinite(p))
            const paesScores = safeAttempts
              .map(a => a?.puntajePaes)
              .filter((p): p is number => p !== null && Number.isFinite(p) && p >= 0)

            // ✅ Enterprise: Calcular promedio usando funciones seguras
            const averagePercentage = percentages.length > 0
              ? (() => {
                  const sum = percentages.reduce((a, b) => {
                    const safeA = Number.isFinite(a) ? a : 0
                    const safeB = Number.isFinite(b) ? b : 0
                    const result = safeA + safeB
                    return Number.isFinite(result) ? result : 0
                  }, 0)
                  return Number.isFinite(sum) && percentages.length > 0 ? safeDivide(sum, percentages.length, 0) : 0
                })()
              : 0

            const bestPercentage = percentages.length > 0
              ? (() => {
                  try {
                    const validPercentages = percentages.filter(p => Number.isFinite(p) && p >= 0 && p <= 100)
                    if (!Array.isArray(validPercentages) || validPercentages.length === 0) return 0
                    // CORRECCIÓN: Validar que el array tenga elementos antes de usar spread operator con Math.max()
                    if (validPercentages.length > 0) {
                      try {
                        const max = safeMathMax(validPercentages)
                        return Number.isFinite(max) ? max : 0
                      } catch (maxError) {
                        logger.warn({ error: maxError, validPercentages }, 'direct-comparison: Error al ejecutar Math.max() con spread operator, usando reduce como fallback')
                        // Fallback: usar reduce si Math.max con spread falla
                        const maxReduce = validPercentages.reduce((a, b) => {
                          const safeA = Number.isFinite(a) ? a : 0
                          const safeB = Number.isFinite(b) ? b : 0
                          return safeA > safeB ? safeA : safeB
                        }, 0)
                        return Number.isFinite(maxReduce) ? maxReduce : 0
                      }
                    }
                    return 0
                  } catch {
                    return 0
                  }
                })()
              : 0

            const averagePaesScore = paesScores.length > 0
              ? (() => {
                  const sum = paesScores.reduce((a, b) => {
                    const safeA = Number.isFinite(a) ? a : 0
                    const safeB = Number.isFinite(b) ? b : 0
                    const result = safeA + safeB
                    return Number.isFinite(result) ? result : 0
                  }, 0)
                  return Number.isFinite(sum) && paesScores.length > 0 ? sum / paesScores.length : null
                })()
              : null

            return {
              subjectCode: subject.subjectCode || '',
              subjectName: subject.subjectName || '',
              totalAttempts: Number.isFinite(safeAttempts.length) ? safeAttempts.length : 0,
              averagePercentage: Number.isFinite(averagePercentage) ? averagePercentage : 0,
              bestPercentage: Number.isFinite(bestPercentage) ? bestPercentage : 0,
              averagePaesScore: averagePaesScore !== null && Number.isFinite(averagePaesScore) ? averagePaesScore : null,
            }
          })
      }

      const currentSubjectStats = calculateSubjectStats(currentAttempts)
      const otherSubjectStats = calculateSubjectStats(otherAttempts)

      // Encontrar exámenes comunes (mismo examen realizado por ambos)
      const currentExamIds = new Set(
        currentAttempts
          .filter(a => a && a.exam && a.exam.id && typeof a.exam.id === 'string')
          .map(a => {
            const examId = a.exam?.id
            return typeof examId === 'string' ? examId : ''
          })
          .filter(id => id.length > 0)
      )
      const otherExamIds = new Set(
        otherAttempts
          .filter(a => a && a.exam && a.exam.id && typeof a.exam.id === 'string')
          .map(a => {
            const examId = a.exam?.id
            return typeof examId === 'string' ? examId : ''
          })
          .filter(id => id.length > 0)
      )
      const commonExamIds = Array.from(currentExamIds).filter(id => otherExamIds.has(id))

      const commonExams = commonExamIds
        .map(examId => {
          const currentAttempt = currentAttempts.find(a => a.exam?.id === examId)
          const otherAttempt = otherAttempts.find(a => a.exam?.id === examId)
          if (!currentAttempt || !otherAttempt) return null

          return {
            examId,
            examTitle: currentAttempt.exam?.titulo || '',
            subject: currentAttempt.exam?.subject || null,
            current: {
              porcentaje: currentAttempt.porcentaje,
              puntajePaes: currentAttempt.puntajePaes,
              correctas: currentAttempt.correctas,
              totalPreguntas: currentAttempt.totalPreguntas,
              createdAt: currentAttempt.createdAt,
            },
            other: {
              porcentaje: otherAttempt.porcentaje,
              puntajePaes: otherAttempt.puntajePaes,
              correctas: otherAttempt.correctas,
              totalPreguntas: otherAttempt.totalPreguntas,
              createdAt: otherAttempt.createdAt,
            },
            winner: (() => {
              // CORRECCIÓN: Validar que currentAttempt.porcentaje y otherAttempt.porcentaje sean números finitos antes de comparar
              const safeCurrent = Number.isFinite(currentAttempt.porcentaje) ? currentAttempt.porcentaje : 0
              const safeOther = Number.isFinite(otherAttempt.porcentaje) ? otherAttempt.porcentaje : 0
              if (safeCurrent > safeOther) return 'current'
              if (safeCurrent < safeOther) return 'other'
              return 'tie'
            })(),
          }
        })
        .filter((e): e is NonNullable<typeof e> => e !== null)

      return NextResponse.json({
        current: {
          student: {
            id: dbUser.student.id,
            nombre: dbUser.student.nombre,
            email: dbUser.email,
          },
          stats: currentStats,
          subjectStats: currentSubjectStats,
        },
        other: {
          student: {
            id: otherStudent.id,
            nombre: otherStudent.nombre,
            email: otherStudent.user?.email || null,
          },
          stats: otherStats,
          subjectStats: otherSubjectStats,
        },
        commonExams,
        summary: {
          currentWins: Array.isArray(commonExams)
            ? commonExams.filter(e => e && e.winner === 'current').length
            : 0,
          otherWins: Array.isArray(commonExams)
            ? commonExams.filter(e => e && e.winner === 'other').length
            : 0,
          ties: Array.isArray(commonExams)
            ? commonExams.filter(e => e && e.winner === 'tie').length
            : 0,
          averageDifference: (() => {
            const safeCurrent = Number.isFinite(currentStats?.averagePercentage)
              ? currentStats.averagePercentage
              : 0
            const safeOther = Number.isFinite(otherStats?.averagePercentage)
              ? otherStats.averagePercentage
              : 0
            const diff = safeCurrent - safeOther
            return Number.isFinite(diff) ? diff : 0
          })(),
        },
      })
    } catch (error) {
      logger.error(
        {
          type: 'analytics_direct_comparison_error', // guard:allow-secret
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al calcular comparación directa'
      )
      return NextResponse.json({ error: 'Error al calcular comparación' }, { status: 500 })
    }
  })
}
