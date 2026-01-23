import { prisma } from './prisma'
import { logger } from './logger'
import { CHALLENGE_TIMEOUT_DAYS, CHALLENGE_EXPIRING_WARNING_DAYS } from './challenge-constants'

/**
 * Cancela automáticamente desafíos pendientes que han expirado
 * Esta función debe ser llamada periódicamente (ej: cron job o al iniciar la app)
 */
export async function cancelExpiredChallenges() {
  try {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() - CHALLENGE_TIMEOUT_DAYS)

    const expiredChallenges = await prisma.challenge.findMany({
      where: {
        status: 'pending',
        createdAt: {
          lt: expirationDate,
        },
      },
      select: {
        id: true,
        challengerId: true,
        challengedId: true,
        createdAt: true,
      },
    })

    if (expiredChallenges.length === 0) {
      return { cancelled: 0 }
    }

    // Actualizar todos los desafíos expirados
    const result = await prisma.challenge.updateMany({
      where: {
        id: {
          in: expiredChallenges.map(c => c.id),
        },
      },
      data: {
        status: 'cancelled',
      },
    })

    logger.info(
      {
        type: 'challenge_timeout',
        cancelled: result.count,
        challenges: expiredChallenges.map(c => c.id),
        metrics: {
          totalExpired: expiredChallenges.length,
          successfullyCancelled: result.count,
          challengerIds: [...new Set(expiredChallenges.map(c => c.challengerId))],
          challengedIds: [...new Set(expiredChallenges.map(c => c.challengedId))],
        },
      },
      `Se cancelaron ${result.count} desafíos expirados`
    )

    return { cancelled: result.count, challengeIds: expiredChallenges.map(c => c.id) }
  } catch (error) {
    logger.error(
      {
        type: 'challenge_timeout_error',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error al cancelar desafíos expirados'
    )
    return { cancelled: 0, error: error instanceof Error ? error.message : String(error) }
  }
}

/**
 * Verifica si un desafío está próximo a expirar (dentro de 2 días)
 */
export async function getChallengesExpiringSoon() {
  try {
    const expirationDate = new Date()
    expirationDate.setDate(expirationDate.getDate() - CHALLENGE_TIMEOUT_DAYS) // Fecha de expiración

    const warningThreshold = new Date()
    warningThreshold.setDate(
      warningThreshold.getDate() - (CHALLENGE_TIMEOUT_DAYS - CHALLENGE_EXPIRING_WARNING_DAYS)
    ) // 2 días antes de expirar

    const expiringSoon = await prisma.challenge.findMany({
      where: {
        status: 'pending',
        createdAt: {
          gte: warningThreshold, // Creados hace 5 días o más (2 días antes de expirar)
          lt: expirationDate, // Pero aún no expirados
        },
      },
      include: {
        challenger: {
          select: {
            id: true,
            nombre: true,
          },
        },
        challenged: {
          select: {
            id: true,
            nombre: true,
          },
        },
        exam: {
          select: {
            id: true,
            titulo: true,
          },
        },
      },
    })

    return expiringSoon
  } catch (error) {
    logger.error(
      {
        type: 'challenge_expiring_soon_error',
        error: error instanceof Error ? error.message : String(error),
      },
      'Error al obtener desafíos próximos a expirar'
    )
    return []
  }
}
