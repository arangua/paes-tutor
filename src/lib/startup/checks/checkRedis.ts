/**
 * Check de Conectividad a Redis (Upstash)
 * 
 * Regla Enterprise:
 * Si Redis está configurado pero no disponible, la app NO debe arrancar.
 * 
 * Características:
 * - Solo se ejecuta si Redis está configurado
 * - Ping simple y rápido
 * - Timeout explícito (3 segundos)
 * - Error tipado (SystemError)
 * - Sin side effects
 */

import { env } from '@/lib/env/env'
import { SystemError } from '@/lib/errors/error-types'

/**
 * Timeout para el check de Redis (3 segundos)
 */
const REDIS_CHECK_TIMEOUT_MS = 3000

/**
 * Verifica que Redis esté disponible (si está configurado)
 * 
 * @throws {SystemError} Si Redis está configurado pero no disponible
 */
export async function checkRedis(): Promise<void> {
  // Si Redis no está configurado, skip el check
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return
  }

  try {
    // Lazy import de Upstash para evitar importar en tiempo de módulo
    const { Redis } = await import('@upstash/redis')

    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })

    // Usar Promise.race para timeout explícito
    const pingPromise = redis.ping()
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Redis check timeout'))
      }, REDIS_CHECK_TIMEOUT_MS)
    })

    await Promise.race([pingPromise, timeoutPromise])
  } catch (error) {
    const originalError = error instanceof Error ? error : new Error(String(error))
    
    throw new SystemError(
      'Redis enabled but not reachable at startup',
      originalError,
      'REDIS_STARTUP_FAILURE',
      {
        timeout: REDIS_CHECK_TIMEOUT_MS,
        hasUrl: !!env.UPSTASH_REDIS_REST_URL,
        hasToken: !!env.UPSTASH_REDIS_REST_TOKEN,
        timestamp: new Date().toISOString(),
      }
    )
  }
}
