/**
 * Monitoring y APM Básico
 * 
 * Sistema básico de Application Performance Monitoring (APM)
 * para tracking de métricas, errores y performance.
 */

import { logger } from './logger'

export interface MetricData {
  name: string
  value: number
  tags?: Record<string, string>
  timestamp?: Date
}

export interface ErrorData {
  error: Error
  context?: Record<string, any>
  severity?: 'low' | 'medium' | 'high' | 'critical'
}

export interface PerformanceData {
  operation: string
  duration: number
  metadata?: Record<string, any>
}

/**
 * Clase para tracking de métricas
 */
export class MetricsTracker {
  private metrics: MetricData[] = []
  private readonly maxMetrics = 1000 // Límite para evitar memory leaks

  /**
   * Registrar una métrica
   */
  track(metric: MetricData): void {
    this.metrics.push({
      ...metric,
      timestamp: metric.timestamp || new Date(),
    })

    // Limpiar métricas antiguas si excedemos el límite
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics)
    }

    // Log estructurado para integración con herramientas APM
    logger.info(
      {
        type: 'metric',
        metric: metric.name,
        value: metric.value,
        tags: metric.tags,
        timestamp: metric.timestamp || new Date().toISOString(),
      },
      `Metric: ${metric.name} = ${metric.value}`
    )
  }

  /**
   * Obtener métricas recientes
   */
  getMetrics(limit: number = 100): MetricData[] {
    return this.metrics.slice(-limit)
  }

  /**
   * Limpiar métricas
   */
  clear(): void {
    this.metrics = []
  }
}

/**
 * Clase para tracking de errores
 */
export class ErrorTracker {
  private errors: ErrorData[] = []
  private readonly maxErrors = 500

  /**
   * Registrar un error
   */
  track(error: ErrorData): void {
    this.errors.push({
      ...error,
      severity: error.severity || 'medium',
    })

    // Limpiar errores antiguos
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors)
    }

    // Log estructurado según severidad
    const logLevel = error.severity === 'critical' || error.severity === 'high' ? 'error' : 'warn'
    // eslint-disable-next-line security/detect-object-injection
    logger[logLevel]( // key validated via union ('error' | 'warn')
      {
        type: 'error',
        error: {
          name: error.error.name,
          message: error.error.message,
          stack: error.error.stack,
        },
        context: error.context,
        severity: error.severity,
        timestamp: new Date().toISOString(),
      },
      `Error tracked: ${error.error.message}`
    )
  }

  /**
   * Obtener errores recientes
   */
  getErrors(limit: number = 50): ErrorData[] {
    return this.errors.slice(-limit)
  }

  /**
   * Limpiar errores
   */
  clear(): void {
    this.errors = []
  }
}

/**
 * Clase para tracking de performance
 */
export class PerformanceTracker {
  private performance: PerformanceData[] = []
  private readonly maxPerformance = 500

  /**
   * Registrar una operación de performance
   */
  track(perf: PerformanceData): void {
    this.performance.push(perf)

    // Limpiar datos antiguos
    if (this.performance.length > this.maxPerformance) {
      this.performance = this.performance.slice(-this.maxPerformance)
    }

    // Log estructurado
    logger.info(
      {
        type: 'performance',
        operation: perf.operation,
        duration: perf.duration,
        metadata: perf.metadata,
        timestamp: new Date().toISOString(),
      },
      `Performance: ${perf.operation} took ${perf.duration}ms`
    )
  }

  /**
   * Medir tiempo de ejecución de una operación
   */
  async measure<T>(operation: string, fn: () => Promise<T>, metadata?: Record<string, any>): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      const duration = Date.now() - start
      this.track({ operation, duration, metadata })
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.track({
        operation,
        duration,
        metadata: { ...metadata, error: error instanceof Error ? error.message : String(error) },
      })
      throw error
    }
  }

  /**
   * Obtener datos de performance recientes
   */
  getPerformance(limit: number = 50): PerformanceData[] {
    return this.performance.slice(-limit)
  }

  /**
   * Limpiar datos de performance
   */
  clear(): void {
    this.performance = []
  }
}

/**
 * Instancias globales (singleton pattern)
 */
export const metricsTracker = new MetricsTracker()
export const errorTracker = new ErrorTracker()
export const performanceTracker = new PerformanceTracker()

/**
 * Helper para medir tiempo de operaciones
 */
export async function measurePerformance<T>(
  operation: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  return performanceTracker.measure(operation, fn, metadata)
}

/**
 * Helper para trackear métricas
 */
export function trackMetric(name: string, value: number, tags?: Record<string, string>): void {
  metricsTracker.track({ name, value, tags })
}

/**
 * Helper para trackear errores
 */
export function trackError(error: Error, context?: Record<string, any>, severity?: ErrorData['severity']): void {
  errorTracker.track({ error, context, severity })
}

/**
 * Alias de trackError para compatibilidad con código existente
 * @deprecated Usar trackError en su lugar. Este alias se mantiene por compatibilidad hacia atrás.
 */
export function captureError(error: Error, context?: Record<string, any>, severity?: ErrorData['severity']): void {
  trackError(error, context, severity)
}
