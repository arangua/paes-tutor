/**
 * Endpoint para obtener métricas de validación
 * 
 * Proporciona acceso a métricas de performance del sistema de validación centralizado.
 * Útil para monitoreo, debugging y optimización.
 * 
 * @route GET /api/notes/versions/validation-metrics
 * @returns Métricas de validación incluyendo conteos y duraciones promedio
 */

import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getValidationMetrics, resetValidationMetrics } from '../validation-utils'
import { addTracingHeaders, addCorsHeaders } from '../response-helpers'
import { getOrCreateRequestId } from '../request-context'

/**
 * GET: Obtener métricas de validación
 * 
 * @param request - NextRequest
 * @returns NextResponse con métricas de validación
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const requestId = getOrCreateRequestId(request)
  
  try {
    const metrics = getValidationMetrics()
    
    // Calcular estadísticas adicionales
    const totalValidations = Object.values(metrics.counts).reduce(
      (sum, count) => sum + (typeof count === 'number' && Number.isFinite(count) ? count : 0),
      0
    )
    
    const totalDuration = Object.values(metrics.averageDurations).reduce(
      (sum, duration) => sum + (typeof duration === 'number' && Number.isFinite(duration) ? duration : 0),
      0
    )
    
    const averageDuration = totalValidations > 0 ? totalDuration / Object.keys(metrics.averageDurations).length : 0
    
    // Obtener las validaciones más frecuentes
    const topValidations = Object.entries(metrics.counts)
      .sort(([, a], [, b]) => {
        const safeA = typeof a === 'number' && Number.isFinite(a) ? a : 0
        const safeB = typeof b === 'number' && Number.isFinite(b) ? b : 0
        return safeB - safeA
      })
      .slice(0, 10)
      .map(([name, count]) => ({
        name,
        count: typeof count === 'number' && Number.isFinite(count) ? count : 0,
        averageDuration: typeof metrics.averageDurations[name] === 'number' && Number.isFinite(metrics.averageDurations[name])
          ? metrics.averageDurations[name]
          : 0,
      }))
    
    const response = NextResponse.json({
      success: true,
      metrics: {
        ...metrics,
        summary: {
          totalValidations,
          uniqueValidationTypes: Object.keys(metrics.counts).length,
          averageDuration,
          topValidations,
        },
      },
      timestamp: safeToISOString(new Date()),
    })
    
    return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
  } catch (error) {
    logger.error(
      { error, requestId },
      'Error al obtener métricas de validación'
    )
    
    const response = NextResponse.json(
      { error: 'Error al obtener métricas de validación' },
      { status: 500 }
    )
    return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
  }
}

/**
 * DELETE: Resetear métricas de validación
 * 
 * Útil para tests o reinicio de métricas en desarrollo.
 * 
 * @param request - NextRequest
 * @returns NextResponse confirmando el reset
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const requestId = getOrCreateRequestId(request)
  
  try {
    resetValidationMetrics()
    
    const response = NextResponse.json({
      success: true,
      message: 'Métricas de validación reseteadas',
      timestamp: safeToISOString(new Date()),
    })
    
    return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
  } catch (error) {
    logger.error(
      { error, requestId },
      'Error al resetear métricas de validación'
    )
    
    const response = NextResponse.json(
      { error: 'Error al resetear métricas de validación' },
      { status: 500 }
    )
    return addTracingHeaders(addCorsHeaders(response), requestId, Date.now() - startTime)
  }
}

