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
  status: 'healthy' | 'degraded' | 'unhealthy'
  timestamp: string
  uptime: number
  checks: {
    database: 'ok' | 'degraded' | 'error'
    memory?: {
      used: number
      total: number
      percentage: number
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
function getMemoryInfo(): { used: number; total: number; percentage: number } | undefined {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()
    const total = usage.heapTotal
    const used = usage.heapUsed
    const percentage = total > 0 ? (used / total) * 100 : 0

    return {
      used: Math.round(used / 1024 / 1024), // MB
      total: Math.round(total / 1024 / 1024), // MB
      percentage: Math.round(percentage * 100) / 100,
    }
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
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy'
    if (dbStatus === 'error') {
      status = 'unhealthy'
    } else if (dbStatus === 'degraded' || (memory && memory.percentage > 90)) {
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

    const statusCode = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503

    logger.info(
      {
        status,
        dbStatus,
        memory: memory?.percentage,
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

