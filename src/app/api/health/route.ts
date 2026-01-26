/**
 * Health Check Endpoint
 * 
 * Proporciona información sobre el estado de salud de la aplicación.
 * Útil para monitoreo, load balancers y sistemas de orquestación.
 * 
 * @route GET /api/health
 */

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

interface HealthStatus {
  status: 'ok' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: 'ok' | 'degraded' | 'error'
    memory?: {
      rssMB: number
      heapUsedMB: number
      heapTotalMB: number
      status: 'ok' | 'high'
    }
  }
  version?: string
}

/**
 * Verificar salud de la base de datos
 */
async function checkDatabase(): Promise<'ok' | 'degraded' | 'error'> {
  try {
    const startTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const duration = Date.now() - startTime

    // Si la consulta toma más de 1 segundo, considerar degradado
    if (duration > 1000) {
      logger.warn({ duration }, 'Database check took too long')
      return 'degraded'
    }

    return 'ok'
  } catch (error) {
    logger.error({ error }, 'Database health check failed')
    return 'error'
  }
}

/**
 * Obtener información de memoria
 */
function getMemoryInfo():
  | { rssMB: number; heapUsedMB: number; heapTotalMB: number; status: 'ok' | 'high' }
  | undefined {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()

    const rssMB = Math.round(usage.rss / 1024 / 1024)
    const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024)
    const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024)

    const RSS_LIMIT_MB = 700
    const status: 'ok' | 'high' = rssMB > RSS_LIMIT_MB ? 'high' : 'ok'

    return { rssMB, heapUsedMB, heapTotalMB, status }
  }
  return undefined
}

/**
 * GET /api/health
 * 
 * Retorna el estado de salud de la aplicación
 */
export async function GET(): Promise<NextResponse<HealthStatus>> {
  const startTime = Date.now()
  const uptime = process.uptime()

  try {
    const dbStatus = await checkDatabase()
    const memory = getMemoryInfo()

    // Determinar estado general
    let status: 'ok' | 'degraded' | 'unhealthy' = 'ok'
    if (dbStatus === 'error') {
      status = 'unhealthy'
    } else if (dbStatus === 'degraded' || (memory && memory.status === 'high')) {
      status = 'degraded'
    }

    const healthStatus: HealthStatus = {
      status,
      timestamp: new Date().toISOString(),
      uptime: Math.round(uptime),
      checks: {
        database: dbStatus,
        ...(memory && { memory }),
      },
      version: process.env.npm_package_version || 'unknown',
    }

    const statusCode = status === 'ok' ? 200 : status === 'degraded' ? 200 : 503

    logger.info(
      {
        status,
        dbStatus,
        memory: memory?.status,
        duration: Date.now() - startTime,
      },
      'Health check completed'
    )

    return NextResponse.json(healthStatus, { status: statusCode })
  } catch (error) {
    logger.error({ error }, 'Health check failed')

    const healthStatus: HealthStatus = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: Math.round(process.uptime()),
      checks: {
        database: 'error',
      },
    }

    return NextResponse.json(healthStatus, { status: 503 })
  }
}

