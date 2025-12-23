import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { student: true },
      })

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      // Obtener todos los intentos completados de todos los estudiantes
      // Limitar a 10,000 intentos para evitar problemas de performance
      const allAttempts = await prisma.attempt.findMany({
        where: {
          estado: 'completado',
        },
        take: 10000,
        select: {
          id: true,
          studentId: true,
          porcentaje: true,
          puntajePaes: true,
          correctas: true,
          totalPreguntas: true,
          createdAt: true,
          exam: {
            select: {
              subjectId: true,
              subject: {
                select: {
                  codigo: true,
                  nombre: true,
                },
              },
            },
          },
        },
        orderBy: {
          porcentaje: 'desc',
        },
      })

      if (allAttempts.length === 0) {
        return NextResponse.json({
          message: 'No hay datos suficientes para comparación',
          userStats: null,
          overallStats: null,
          subjectStats: null,
        })
      }

      // Calcular estadísticas generales
      const percentages = allAttempts.map(a => a.porcentaje)
      const paesScores = allAttempts.map(a => a.puntajePaes).filter((p): p is number => p !== null)

      const overallStats = {
        totalAttempts: allAttempts.length,
        averagePercentage: percentages.reduce((a, b) => a + b, 0) / percentages.length,
        medianPercentage: calculateMedian(percentages),
        minPercentage: Math.min(...percentages),
        maxPercentage: Math.max(...percentages),
        averagePaesScore:
          paesScores.length > 0 ? paesScores.reduce((a, b) => a + b, 0) / paesScores.length : null,
        medianPaesScore: paesScores.length > 0 ? calculateMedian(paesScores) : null,
      }

      // Obtener intentos del usuario actual
      const userAttempts = allAttempts.filter(a => a.studentId === dbUser.student.id)

      if (userAttempts.length === 0) {
        return NextResponse.json({
          message: 'No tienes intentos completados',
          userStats: null,
          overallStats,
          subjectStats: null,
        })
      }

      // Calcular percentil del usuario
      const userAveragePercentage =
        userAttempts.reduce((sum, a) => sum + a.porcentaje, 0) / userAttempts.length
      const userBestPercentage = Math.max(...userAttempts.map(a => a.porcentaje))
      const userAveragePaes = userAttempts
        .map(a => a.puntajePaes)
        .filter((p): p is number => p !== null)
      const userAveragePaesScore =
        userAveragePaes.length > 0
          ? userAveragePaes.reduce((a, b) => a + b, 0) / userAveragePaes.length
          : null

      // Calcular percentil basado en porcentaje promedio
      const percentile = calculatePercentile(userAveragePercentage, percentages)
      const bestPercentile = calculatePercentile(userBestPercentage, percentages)

      // Calcular posición en ranking
      const sortedByAverage = [...allAttempts].reduce(
        (acc, attempt) => {
          if (!acc[attempt.studentId]) {
            acc[attempt.studentId] = []
          }
          acc[attempt.studentId].push(attempt.porcentaje)
          return acc
        },
        {} as Record<string, number[]>
      )

      const studentAverages = Object.entries(sortedByAverage)
        .map(([studentId, scores]) => ({
          studentId,
          average: scores.reduce((a, b) => a + b, 0) / scores.length,
          count: scores.length,
        }))
        .sort((a, b) => b.average - a.average)

      const userRank = studentAverages.findIndex(s => s.studentId === dbUser.student.id) + 1
      const totalStudents = studentAverages.length

      const userStats = {
        totalAttempts: userAttempts.length,
        averagePercentage: userAveragePercentage,
        bestPercentage: userBestPercentage,
        averagePaesScore: userAveragePaesScore,
        percentile,
        bestPercentile,
        rank: userRank,
        totalStudents,
        rankPercentage:
          totalStudents > 0 ? ((totalStudents - userRank + 1) / totalStudents) * 100 : 0,
      }

      // Calcular estadísticas por asignatura
      const subjectStats: Record<
        string,
        {
          subjectCode: string
          subjectName: string
          totalAttempts: number
          userAttempts: number
          userAverage: number
          overallAverage: number
          userPercentile: number
          userRank: number
          totalStudents: number
        }
      > = {}

      // Agrupar por asignatura
      const attemptsBySubject = new Map<string, typeof allAttempts>()
      allAttempts.forEach(attempt => {
        const subjectCode = attempt.exam.subject.codigo
        if (!attemptsBySubject.has(subjectCode)) {
          attemptsBySubject.set(subjectCode, [])
        }
        attemptsBySubject.get(subjectCode)!.push(attempt)
      })

      attemptsBySubject.forEach((attempts, subjectCode) => {
        const subjectName = attempts[0].exam.subject.nombre
        const userSubjectAttempts = attempts.filter(a => a.studentId === dbUser.student.id)

        if (userSubjectAttempts.length === 0) return

        const userSubjectAverage =
          userSubjectAttempts.reduce((sum, a) => sum + a.porcentaje, 0) / userSubjectAttempts.length
        const overallSubjectAverage =
          attempts.reduce((sum, a) => sum + a.porcentaje, 0) / attempts.length
        const subjectPercentages = attempts.map(a => a.porcentaje)
        const userSubjectPercentile = calculatePercentile(userSubjectAverage, subjectPercentages)

        // Calcular ranking por asignatura
        const subjectStudentAverages = Object.entries(
          attempts.reduce(
            (acc, attempt) => {
              if (!acc[attempt.studentId]) {
                acc[attempt.studentId] = []
              }
              acc[attempt.studentId].push(attempt.porcentaje)
              return acc
            },
            {} as Record<string, number[]>
          )
        )
          .map(([studentId, scores]) => ({
            studentId,
            average: scores.reduce((a, b) => a + b, 0) / scores.length,
          }))
          .sort((a, b) => b.average - a.average)

        const userSubjectRank =
          subjectStudentAverages.findIndex(s => s.studentId === dbUser.student.id) + 1
        const totalSubjectStudents = subjectStudentAverages.length

        subjectStats[subjectCode] = {
          subjectCode,
          subjectName,
          totalAttempts: attempts.length,
          userAttempts: userSubjectAttempts.length,
          userAverage: userSubjectAverage,
          overallAverage: overallSubjectAverage,
          userPercentile: userSubjectPercentile,
          userRank: userSubjectRank,
          totalStudents: totalSubjectStudents,
        }
      })

      return NextResponse.json({
        userStats,
        overallStats,
        subjectStats: Object.values(subjectStats),
      })
    } catch (error) {
      logger.error(
        {
          type: 'analytics_comparison_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al calcular comparación'
      )
      return NextResponse.json({ error: 'Error al calcular comparación' }, { status: 500 })
    }
  })
}

function calculatePercentile(value: number, array: number[]): number {
  const sorted = [...array].sort((a, b) => a - b)
  const index = sorted.findIndex(v => v >= value)
  if (index === -1) return 100
  return Math.round((index / sorted.length) * 100)
}

function calculateMedian(array: number[]): number {
  const sorted = [...array].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}
