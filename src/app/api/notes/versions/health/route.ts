/**
 * Health Check endpoint para versiones
 * Proporciona información sobre el estado del servicio
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import { circuitBreakers } from '../circuit-breaker'
import { safeRound, safeToISOString } from '../validation-utils'

/**
 * GET: Health check del servicio de versiones
 */
export async function GET(_request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const health: {
    status: 'healthy' | 'degraded' | 'unhealthy'
    timestamp: string
    checks: Record<string, { status: 'ok' | 'error'; message?: string; duration?: number }>
    version: string
  } = {
    status: 'healthy',
    timestamp: safeToISOString(new Date()),
    checks: {},
    version: '1.0.0',
  }

  // Check de base de datos
  try {
    const dbStartTime = Date.now()
    await prisma.$queryRaw`SELECT 1`
    const dbDuration = Date.now() - dbStartTime
    health.checks.database = {
      status: 'ok',
      duration: dbDuration,
    }
  } catch (error) {
    health.status = 'unhealthy'
    health.checks.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }

  // Check de circuit breakers
  const circuitBreakerStates: Record<string, string> = {}
  let hasOpenCircuit = false
  
  for (const [name, breaker] of Object.entries(circuitBreakers)) {
    const state = breaker.getState()
    circuitBreakerStates[name] = state
    
    if (state === 'OPEN') {
      hasOpenCircuit = true
    }
  }

  health.checks.circuitBreakers = {
    status: hasOpenCircuit ? 'error' : 'ok',
    message: hasOpenCircuit
      ? `Some circuit breakers are OPEN: ${Object.entries(circuitBreakerStates)
          .filter(([_, state]) => state === 'OPEN')
          .map(([name]) => name)
          .join(', ')}`
      : 'All circuit breakers are CLOSED',
  }

  if (hasOpenCircuit && health.status === 'healthy') {
    health.status = 'degraded'
  }

  // Check de memoria
  const memoryUsage = process.memoryUsage()
  const memoryUsageMB = {
    rss: safeRound(memoryUsage.rss / 1024 / 1024, 0),
    heapTotal: safeRound(memoryUsage.heapTotal / 1024 / 1024, 0),
    heapUsed: safeRound(memoryUsage.heapUsed / 1024 / 1024, 0),
  }

  const memoryThreshold = 500 // MB
  const isMemoryHigh = memoryUsageMB.heapUsed > memoryThreshold

  health.checks.memory = {
    status: isMemoryHigh ? 'error' : 'ok',
    message: isMemoryHigh
      ? `High memory usage: ${memoryUsageMB.heapUsed}MB`
      : `Memory usage: ${memoryUsageMB.heapUsed}MB`,
  }

  if (isMemoryHigh && health.status === 'healthy') {
    health.status = 'degraded'
  }

  const totalDuration = Date.now() - startTime

  // Log health check
  logger.info(
    {
      status: health.status,
      duration: totalDuration,
      checks: health.checks,
    },
    'Health check ejecutado'
  )

  const statusCode = health.status === 'healthy' ? 200 : health.status === 'degraded' ? 200 : 503

  return NextResponse.json(health, {
    status: statusCode,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Response-Time': `${totalDuration}ms`,
    },
  })
}

