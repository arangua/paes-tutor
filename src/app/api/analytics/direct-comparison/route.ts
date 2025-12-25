import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

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

      if (allStudents.length < 2) {
        return NextResponse.json({
          message: 'Se necesitan al menos 2 estudiantes para comparar',
          comparison: null,
        })
      }

      // Encontrar el otro estudiante (el que no es el actual)
      const otherStudent = allStudents.find(s => s.id !== currentStudentId)
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

        const percentages = attempts.map(a => a.porcentaje)
        const paesScores = attempts.map(a => a.puntajePaes).filter((p): p is number => p !== null)

        // Calcular tendencia reciente (últimos 5 vs anteriores)
        const recent = attempts.slice(0, 5)
        const older = attempts.slice(5, 10)
        let recentTrend: 'improving' | 'declining' | 'stable' = 'stable'
        if (recent.length > 0 && older.length > 0) {
          const recentAvg = recent.reduce((sum, a) => sum + a.porcentaje, 0) / recent.length
          const olderAvg = older.reduce((sum, a) => sum + a.porcentaje, 0) / older.length
          const diff = recentAvg - olderAvg
          if (diff > 2) recentTrend = 'improving'
          else if (diff < -2) recentTrend = 'declining'
        }

        return {
          totalAttempts: attempts.length,
          averagePercentage: percentages.reduce((a, b) => a + b, 0) / percentages.length,
          bestPercentage: Math.max(...percentages),
          worstPercentage: Math.min(...percentages),
          averagePaesScore:
            paesScores.length > 0
              ? paesScores.reduce((a, b) => a + b, 0) / paesScores.length
              : null,
          bestPaesScore: paesScores.length > 0 ? Math.max(...paesScores) : null,
          totalCorrect: attempts.reduce((sum, a) => sum + a.correctas, 0),
          totalQuestions: attempts.reduce((sum, a) => sum + a.totalPreguntas, 0),
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

        attempts.forEach(attempt => {
          const code = attempt.exam.subject.codigo
          if (!bySubject.has(code)) {
            bySubject.set(code, {
              subjectCode: code,
              subjectName: attempt.exam.subject.nombre,
              attempts: [],
            })
          }
          bySubject.get(code)!.attempts.push(attempt)
        })

        return Array.from(bySubject.values()).map(subject => {
          const percentages = subject.attempts.map(a => a.porcentaje)
          const paesScores = subject.attempts
            .map(a => a.puntajePaes)
            .filter((p): p is number => p !== null)

          return {
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            totalAttempts: subject.attempts.length,
            averagePercentage: percentages.reduce((a, b) => a + b, 0) / percentages.length,
            bestPercentage: Math.max(...percentages),
            averagePaesScore:
              paesScores.length > 0
                ? paesScores.reduce((a, b) => a + b, 0) / paesScores.length
                : null,
          }
        })
      }

      const currentSubjectStats = calculateSubjectStats(currentAttempts)
      const otherSubjectStats = calculateSubjectStats(otherAttempts)

      // Encontrar exámenes comunes (mismo examen realizado por ambos)
      const currentExamIds = new Set(currentAttempts.map(a => a.exam.id))
      const otherExamIds = new Set(otherAttempts.map(a => a.exam.id))
      const commonExamIds = Array.from(currentExamIds).filter(id => otherExamIds.has(id))

      const commonExams = commonExamIds
        .map(examId => {
          const currentAttempt = currentAttempts.find(a => a.exam.id === examId)
          const otherAttempt = otherAttempts.find(a => a.exam.id === examId)
          if (!currentAttempt || !otherAttempt) return null

          return {
            examId,
            examTitle: currentAttempt.exam.titulo,
            subject: currentAttempt.exam.subject,
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
            winner:
              currentAttempt.porcentaje > otherAttempt.porcentaje
                ? 'current'
                : currentAttempt.porcentaje < otherAttempt.porcentaje
                  ? 'other'
                  : 'tie',
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
          currentWins: commonExams.filter(e => e.winner === 'current').length,
          otherWins: commonExams.filter(e => e.winner === 'other').length,
          ties: commonExams.filter(e => e.winner === 'tie').length,
          averageDifference: currentStats.averagePercentage - otherStats.averagePercentage,
        },
      })
    } catch (error) {
      logger.error(
        {
          type: 'analytics_direct_comparison_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al calcular comparación directa'
      )
      return NextResponse.json({ error: 'Error al calcular comparación' }, { status: 500 })
    }
  })
}
