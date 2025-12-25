import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

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

        if (allStudents.length < 2) {
          return NextResponse.json({
            message: 'Se necesitan al menos 2 estudiantes para mostrar progreso conjunto',
            progress: null,
          })
        }

        // Encontrar el otro estudiante
        const otherStudent = allStudents.find(s => s.id !== currentStudentId)
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
          const totalAttempts = attempts.length
          const averagePercentage =
            totalAttempts > 0
              ? attempts.reduce((sum, a) => sum + a.porcentaje, 0) / totalAttempts
              : 0
          const bestPercentage =
            totalAttempts > 0 ? Math.max(...attempts.map(a => a.porcentaje)) : 0
          const paesScores = attempts.map(a => a.puntajePaes).filter((p): p is number => p !== null)
          const averagePaesScore =
            paesScores.length > 0 ? paesScores.reduce((a, b) => a + b, 0) / paesScores.length : null
          const bestPaesScore = paesScores.length > 0 ? Math.max(...paesScores) : null

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

          // Calcular tendencia reciente (últimos 5 vs anteriores)
          let trend: 'improving' | 'declining' | 'stable' = 'stable'
          if (attempts.length >= 10) {
            const recent = attempts.slice(0, 5)
            const older = attempts.slice(5, 10)
            const recentAvg = recent.reduce((sum, a) => sum + a.porcentaje, 0) / recent.length
            const olderAvg = older.reduce((sum, a) => sum + a.porcentaje, 0) / older.length
            const diff = recentAvg - olderAvg
            if (diff > 2) trend = 'improving'
            else if (diff < -2) trend = 'declining'
          }

          return {
            totalAttempts,
            averagePercentage,
            bestPercentage,
            averagePaesScore,
            bestPaesScore,
            recentAttempts: attempts.slice(0, 5), // Últimos 5 para mostrar
            topTopics: metrics,
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
