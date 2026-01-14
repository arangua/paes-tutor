/**
 * Enterprise Performance Testing Helpers
 * 
 * Utilidades avanzadas para testing de performance incluyendo
 * benchmarks, load testing, y análisis de métricas.
 * 
 * @module performance-helpers
 * @version 3.0.0
 * @enterprise
 */

// ============================================
// TIPOS Y CONFIGURACIONES
// ============================================

export interface PerformanceBenchmark {
  name: string
  duration: number
  iterations: number
  averageDuration: number
  minDuration: number
  maxDuration: number
  p50: number
  p95: number
  p99: number
}

export interface LoadTestConfig {
  concurrency: number
  iterations: number
  rampUp?: number
  timeout?: number
}

export interface LoadTestResult {
  totalRequests: number
  successful: number
  failed: number
  averageResponseTime: number
  minResponseTime: number
  maxResponseTime: number
  p50: number
  p95: number
  p99: number
  throughput: number
  errors: Array<{ error: string; count: number }>
}

// ============================================
// BENCHMARK RUNNER
// ============================================

/**
 * Ejecuta un benchmark de performance
 */
export async function benchmark(
  name: string,
  fn: () => Promise<void> | void,
  iterations: number = 100
): Promise<PerformanceBenchmark> {
  const durations: number[] = []

  // Warmup
  for (let i = 0; i < Math.min(10, iterations); i++) {
    await fn()
  }

  // Actual benchmark
  for (let i = 0; i < iterations; i++) {
    const start = performance.now()
    await fn()
    const end = performance.now()
    durations.push(end - start)
  }

  // Calcular estadísticas
  durations.sort((a, b) => a - b)
  const sum = durations.reduce((a, b) => a + b, 0)
  const average = sum / durations.length
  const min = durations[0] ?? 0
  const max = durations[durations.length - 1] ?? 0
  const p50 = durations[Math.floor(durations.length * 0.5)] ?? 0
  const p95 = durations[Math.floor(durations.length * 0.95)] ?? 0
  const p99 = durations[Math.floor(durations.length * 0.99)] ?? 0

  return {
    name,
    duration: sum,
    iterations,
    averageDuration: average,
    minDuration: min,
    maxDuration: max,
    p50,
    p95,
    p99,
  }
}

// ============================================
// LOAD TEST RUNNER
// ============================================

/**
 * Ejecuta un load test
 */
export async function loadTest(
  fn: () => Promise<Response>,
  config: LoadTestConfig
): Promise<LoadTestResult> {
  const { concurrency, iterations, timeout = 30000 } = config
  const responseTimes: number[] = []
  const errors: Map<string, number> = new Map()
  let successful = 0
  let failed = 0

  // Función para ejecutar una iteración
  const runIteration = async (): Promise<void> => {
    try {
      const start = performance.now()
      const response = await Promise.race([
        fn(),
        new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), timeout)
        ),
      ])
      const end = performance.now()

      if (response.ok) {
        successful++
        responseTimes.push(end - start)
      } else {
        failed++
        const errorKey = `HTTP ${response.status}`
        errors.set(errorKey, (errors.get(errorKey) || 0) + 1)
      }
    } catch (error) {
      failed++
      const errorKey = error instanceof Error ? error.message : String(error)
      errors.set(errorKey, (errors.get(errorKey) || 0) + 1)
    }
  }

  // Ejecutar con concurrencia
  const batches = Math.ceil(iterations / concurrency)
  for (let batch = 0; batch < batches; batch++) {
    const batchSize = Math.min(concurrency, iterations - batch * concurrency)
    await Promise.all(
      Array.from({ length: batchSize }, () => runIteration())
    )
  }

  // Calcular estadísticas
  responseTimes.sort((a, b) => a - b)
  const total = successful + failed
  const sum = responseTimes.reduce((a, b) => a + b, 0)
  const average = responseTimes.length > 0 ? sum / responseTimes.length : 0
  const min = responseTimes[0] || 0
  const max = responseTimes[responseTimes.length - 1] || 0
  const p50 = responseTimes[Math.floor(responseTimes.length * 0.5)] || 0
  const p95 = responseTimes[Math.floor(responseTimes.length * 0.95)] || 0
  const p99 = responseTimes[Math.floor(responseTimes.length * 0.99)] || 0
  const throughput = (successful / (sum / 1000)) || 0

  return {
    totalRequests: total,
    successful,
    failed,
    averageResponseTime: average,
    minResponseTime: min,
    maxResponseTime: max,
    p50,
    p95,
    p99,
    throughput,
    errors: Array.from(errors.entries()).map(([error, count]) => ({
      error,
      count,
    })),
  }
}

// ============================================
// MEMORY PROFILING
// ============================================

/**
 * Perfila el uso de memoria
 */
export function profileMemory(): {
  heapUsed: number
  heapTotal: number
  external: number
  rss: number
} {
  if (typeof process !== 'undefined' && process.memoryUsage) {
    const usage = process.memoryUsage()
    return {
      heapUsed: usage.heapUsed,
      heapTotal: usage.heapTotal,
      external: usage.external,
      rss: usage.rss,
    }
  }

  // Fallback para entornos sin process.memoryUsage
  return {
    heapUsed: 0,
    heapTotal: 0,
    external: 0,
    rss: 0,
  }
}

/**
 * Compara el uso de memoria antes y después
 */
export function compareMemory(
  before: ReturnType<typeof profileMemory>,
  after: ReturnType<typeof profileMemory>
): {
  heapUsedDiff: number
  heapTotalDiff: number
  externalDiff: number
  rssDiff: number
} {
  return {
    heapUsedDiff: after.heapUsed - before.heapUsed,
    heapTotalDiff: after.heapTotal - before.heapTotal,
    externalDiff: after.external - before.external,
    rssDiff: after.rss - before.rss,
  }
}

// ============================================
// PERFORMANCE ASSERTIONS
// ============================================

/**
 * Assert que una operación toma menos de X ms
 */
export function assertPerformance(
  duration: number,
  maxDuration: number,
  message?: string
): void {
  if (duration > maxDuration) {
    throw new Error(
      message || `Performance assertion failed: ${duration}ms > ${maxDuration}ms`
    )
  }
}

/**
 * Assert que el throughput es mayor a X req/s
 */
export function assertThroughput(
  throughput: number,
  minThroughput: number,
  message?: string
): void {
  if (throughput < minThroughput) {
    throw new Error(
      message || `Throughput assertion failed: ${throughput} req/s < ${minThroughput} req/s`
    )
  }
}

