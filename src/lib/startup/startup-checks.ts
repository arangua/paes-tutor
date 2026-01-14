/**
 * Startup Checks Orquestador
 * 
 * Regla Enterprise:
 * Validar capacidad de operar, no solo configuración.
 * 
 * Características:
 * - Ejecución única (una vez al startup)
 * - Fail-fast (si falla, aborta startup)
 * - Sin side effects
 * - Checks aislados y testeables
 * 
 * Uso:
 * ```typescript
 * // En app/layout.tsx o bootstrap server
 * import { runStartupChecks } from '@/lib/startup/startup-checks'
 * 
 * // Ejecutar una vez al startup
 * await runStartupChecks()
 * ```
 */

import { checkDatabase } from './checks/checkDatabase'
import { checkRedis } from './checks/checkRedis'
import { checkTimeouts } from './checks/checkTimeouts'
import { logger } from '@/lib/logger'

/**
 * Ejecuta todos los checks de startup
 * 
 * ⛔ Regla: Si cualquier check falla, la app NO arranca
 * 
 * @throws {SystemError} Si algún check falla
 */
export async function runStartupChecks(): Promise<void> {
  logger.info('Running startup checks...')

  try {
    // 1. Check de timeouts (síncrono, rápido)
    checkTimeouts()
    logger.info('✓ Timeout checks passed')

    // 2. Check de base de datos (asíncrono)
    await checkDatabase()
    logger.info('✓ Database check passed')

    // 3. Check de Redis (asíncrono, condicional)
    await checkRedis()
    logger.info('✓ Redis check passed (or skipped)')

    logger.info('✅ All startup checks passed')
  } catch (error) {
    logger.error('❌ Startup checks failed', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Re-lanzar el error para que la app no arranque
    throw error
  }
}
