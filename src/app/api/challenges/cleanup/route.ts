import { NextRequest, NextResponse } from 'next/server'
import { cancelExpiredChallenges } from '@/lib/challenge-timeout'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * POST: Limpiar desafíos expirados manualmente
 * Este endpoint puede ser llamado por un cron job o manualmente
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      // Verificar que es una llamada autorizada
      // Si CLEANUP_TOKEN está configurado, se requiere autenticación
      const expectedToken = process.env.CLEANUP_TOKEN
      if (expectedToken) {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || authHeader !== `Bearer ${expectedToken}`) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }
      }

      const result = await cancelExpiredChallenges()

      return NextResponse.json({
        success: true,
        cancelled: result.cancelled,
        message: `Se cancelaron ${result.cancelled} desafíos expirados`,
      })
    } catch (error) {
      logger.error(
        {
          type: 'challenge_cleanup_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al limpiar desafíos expirados'
      )
      return NextResponse.json({ error: 'Error al limpiar desafíos expirados' }, { status: 500 })
    }
  })
}
