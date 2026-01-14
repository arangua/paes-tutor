/**
 * Utilidades de Medición de Performance
 * 
 * Regla Enterprise:
 * Métricas estables y repetibles para CI.
 * 
 * Características:
 * - Determinista
 * - Sin side effects
 * - CI-friendly
 */

import { PerformanceMetric, getBaselineThreshold, meetsBaseline } from './baseline'

/**
 * Resultado de una medición de performance
 */
export interface PerformanceMeasurement {
  metric: PerformanceMetric
  duration: number
  threshold: number
  meetsBaseline: boolean
  timestamp: string
}

/**
 * Mide el tiempo de ejecución de una operación
 * 
 * @param metric - Tipo de métrica
 * @param operation - Operación a medir
 * @returns Resultado de la medición
 * 
 * @example
 * ```typescript
 * const measurement = await measurePerformance('api_response', async () => {
 *   return await GET(request)
 * })
 * 
 * if (!measurement.meetsBaseline) {
 *   throw new Error(`Performance degraded: ${measurement.duration}ms > ${measurement.threshold}ms`)
 * }
 * ```
 */
export async function measurePerformance<T>(
  metric: PerformanceMetric,
  operation: () => Promise<T>
): Promise<{ result: T; measurement: PerformanceMeasurement }> {
  const threshold = getBaselineThreshold(metric)
  const startTime = performance.now()

  try {
    const result = await operation()
    const endTime = performance.now()
    const duration = endTime - startTime

    const measurement: PerformanceMeasurement = {
      metric,
      duration,
      threshold,
      meetsBaseline: meetsBaseline(metric, duration),
      timestamp: new Date().toISOString(),
    }

    return { result, measurement }
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime

    // Re-lanzar el error con información de performance
    throw new Error(
      `Performance measurement failed: ${error instanceof Error ? error.message : String(error)} (took ${duration}ms)`
    )
  }
}

/**
 * Mide el tiempo de ejecución de una operación síncrona
 * 
 * @param metric - Tipo de métrica
 * @param operation - Operación a medir
 * @returns Resultado de la medición
 */
export function measurePerformanceSync<T>(
  metric: PerformanceMetric,
  operation: () => T
): { result: T; measurement: PerformanceMeasurement } {
  const threshold = getBaselineThreshold(metric)
  const startTime = performance.now()

  try {
    const result = operation()
    const endTime = performance.now()
    const duration = endTime - startTime

    const measurement: PerformanceMeasurement = {
      metric,
      duration,
      threshold,
      meetsBaseline: meetsBaseline(metric, duration),
      timestamp: new Date().toISOString(),
    }

    return { result, measurement }
  } catch (error) {
    const endTime = performance.now()
    const duration = endTime - startTime

    throw new Error(
      `Performance measurement failed: ${error instanceof Error ? error.message : String(error)} (took ${duration}ms)`
    )
  }
}

/**
 * Mide múltiples operaciones en paralelo
 * 
 * @param operations - Array de operaciones a medir
 * @returns Array de resultados de medición
 */
export async function measurePerformanceBatch<T>(
  operations: Array<{ metric: PerformanceMetric; operation: () => Promise<T> }>
): Promise<Array<{ result: T; measurement: PerformanceMeasurement }>> {
  const measurements = await Promise.all(
    operations.map(({ metric, operation }) => measurePerformance(metric, operation))
  )

  return measurements
}
