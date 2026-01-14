/**
 * Readiness Check
 * 
 * Regla Enterprise:
 * Verifica que el servicio puede recibir tráfico ahora.
 * 
 * Características:
 * - Verifica servicios críticos (DB, Redis)
 * - Timeouts cortos (no reintenta)
 * - Sin side effects
 * - Respuesta determinista
 */

import { ReadinessResult, CheckStatus, HealthStatus } from './health.types'
import { prisma } from '@/lib/prisma'
import { env } from '@/lib/env/env'

/**
 * Timeout para checks de servicios (2 segundos)
 */
const SERVICE_CHECK_TIMEOUT_MS = 2000

/**
 * Verifica conectividad a la base de datos
 * 
 * @returns 'ok' | 'down'
 */
async function checkDatabase(): Promise<CheckStatus> {
  try {
    const checkPromise = prisma.$queryRaw`SELECT 1 as check`
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Database check timeout'))
      }, SERVICE_CHECK_TIMEOUT_MS)
    })

    await Promise.race([checkPromise, timeoutPromise])
    return 'ok'
  } catch {
    return 'down'
  }
}

/**
 * Verifica conectividad a Redis (si está configurado)
 * 
 * @returns 'ok' | 'skipped' | 'down'
 */
async function checkRedis(): Promise<CheckStatus> {
  // Si Redis no está configurado, skip
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    return 'skipped'
  }

  try {
    // Lazy import de Upstash
    const { Redis } = await import('@upstash/redis')

    const redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    })

    const checkPromise = redis.ping()
    
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => {
        reject(new Error('Redis check timeout'))
      }, SERVICE_CHECK_TIMEOUT_MS)
    })

    await Promise.race([checkPromise, timeoutPromise])
    return 'ok'
  } catch {
    return 'down'
  }
}

/**
 * Verifica que el servicio está listo para recibir tráfico
 * 
 * ⚠️ Regla: Si un servicio crítico está 'down', el estado es 'degraded'.
 * 
 * @returns ReadinessResult con estado y checks individuales
 */
export async function checkReadiness(): Promise<ReadinessResult> {
  // Ejecutar checks en paralelo (más rápido)
  const [databaseStatus, redisStatus] = await Promise.all([
    checkDatabase(),
    checkRedis(),
  ])

  // Determinar estado general
  // Si DB está down, el servicio no está listo
  // Si Redis está down (y está configurado), el servicio está degradado
  let status: HealthStatus = 'ok'
  
  if (databaseStatus === 'down') {
    status = 'degraded'
  } else if (redisStatus === 'down') {
    // Redis es opcional, pero si está configurado y no responde, es degradación
    status = 'degraded'
  }

  return {
    status,
    checks: {
      database: databaseStatus,
      redis: redisStatus,
    },
    timestamp: new Date().toISOString(),
  }
}
