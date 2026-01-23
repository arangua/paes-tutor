import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import {
  CHALLENGE_EXPIRING_SOON_DAYS,
  CHALLENGE_STATUS,
  PERCENTAGE_MULTIPLIER,
} from '@/lib/challenge-constants'
import { safeRound, safeToISOString, safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

/**
 * GET: Obtener métricas de desafíos
 * Incluye estadísticas sobre desafíos expirados, activos, completados, etc.
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const studentId = dbUser.student.id

      // Obtener todas las métricas en paralelo
      const [
        totalChallenges,
        activeChallenges,
        completedChallenges,
        pendingChallenges,
        expiredChallenges,
        userChallenges,
        userWins,
        userLosses,
        userTies,
      ] = await Promise.all([
        // Total de desafíos
        prisma.challenge.count(),

        // Desafíos activos (aceptados)
        prisma.challenge.count({
          where: { status: CHALLENGE_STATUS.ACCEPTED },
        }),

        // Desafíos completados
        prisma.challenge.count({
          where: { status: CHALLENGE_STATUS.COMPLETED },
        }),

        // Desafíos pendientes
        prisma.challenge.count({
          where: { status: CHALLENGE_STATUS.PENDING },
        }),

        // Desafíos expirados/cancelados
        prisma.challenge.count({
          where: { status: CHALLENGE_STATUS.CANCELLED },
        }),

        // Desafíos del usuario
        prisma.challenge.count({
          where: {
            OR: [{ challengerId: studentId }, { challengedId: studentId }],
          },
        }),

        // Victorias del usuario
        prisma.challenge.count({
          where: {
            winnerId: studentId,
            status: CHALLENGE_STATUS.COMPLETED,
          },
        }),

        // Derrotas del usuario (completados donde no ganó)
        prisma.challenge.count({
          where: {
            status: CHALLENGE_STATUS.COMPLETED,
            OR: [{ challengerId: studentId }, { challengedId: studentId }],
            AND: [{ winnerId: { not: null } }, { winnerId: { not: studentId } }],
          },
        }),

        // Empates del usuario
        prisma.challenge.count({
          where: {
            status: CHALLENGE_STATUS.COMPLETED,
            OR: [{ challengerId: studentId }, { challengedId: studentId }],
            winnerId: null,
          },
        }),
      ])

      // Calcular desafíos próximos a expirar
      const expirationThreshold = new Date()
      expirationThreshold.setDate(expirationThreshold.getDate() - CHALLENGE_EXPIRING_SOON_DAYS)
      const expiringSoon = await prisma.challenge.count({
        where: {
          status: CHALLENGE_STATUS.PENDING,
          createdAt: {
            lt: expirationThreshold,
          },
        },
      })

      // ✅ Enterprise: Calcular tasa de aceptación usando funciones seguras
      const totalProcessed =
        completedChallenges + activeChallenges + pendingChallenges + expiredChallenges
      const safeTotalProcessed = ensureFiniteNumber(totalProcessed, 0)
      const safeAccepted = ensureFiniteNumber(completedChallenges + activeChallenges, 0)
      const acceptanceRate = safeTotalProcessed > 0
          ? safeDivide(safeAccepted, safeTotalProcessed, 0) * PERCENTAGE_MULTIPLIER
          : 0

      // ✅ Enterprise: Calcular win rate del usuario usando funciones seguras
      const userCompletedChallenges = userWins + userLosses + userTies
      const safeUserCompleted = ensureFiniteNumber(userCompletedChallenges, 0)
      const safeUserWins = ensureFiniteNumber(userWins, 0)
      const userWinRate = safeUserCompleted > 0
          ? safeDivide(safeUserWins, safeUserCompleted, 0) * PERCENTAGE_MULTIPLIER
          : 0

      const metrics = {
        global: {
          total: totalChallenges,
          active: activeChallenges,
          completed: completedChallenges,
          pending: pendingChallenges,
          expired: expiredChallenges,
          expiringSoon,
          acceptanceRate: safeRound(acceptanceRate, 2),
        },
        user: {
          total: userChallenges,
          wins: userWins,
          losses: userLosses,
          ties: userTies,
          winRate: safeRound(userWinRate, 2),
          completed: userCompletedChallenges,
        },
        timestamp: safeToISOString(new Date()),
      }

      return NextResponse.json({ metrics })
    } catch (error) {
      logger.error(
        {
          type: 'challenge_metrics_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener métricas de desafíos'
      )
      return NextResponse.json({ error: 'Error al obtener métricas' }, { status: 500 })
    }
  })
}
