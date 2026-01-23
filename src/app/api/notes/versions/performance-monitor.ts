/**
 * Sistema de monitoreo y alertas de performance
 * Centraliza el cálculo de métricas y genera alertas cuando se detectan problemas
 * 
 * @module performance-monitor
 * 
 * @example
 * ```typescript
 * // Uso básico en un handler
 * import { calculateEnhancedMetrics, sendPerformanceAlertsToMonitoring } from './performance-monitor'
 * 
 * async function handleRequest(request: NextRequest) {
 *   const startTime = Date.now()
 *   
 *   // ... operación ...
 *   const authDuration = Date.now() - authStartTime
 *   const queryDuration = Date.now() - queryStartTime
 *   
 *   // Calcular métricas mejoradas
 *   const metrics = calculateEnhancedMetrics(startTime, {
 *     authDuration,
 *     queryDuration,
 *   }, 'GET')
 *   
 *   // Enviar alertas críticas a sistemas de monitoreo
 *   if (metrics.severity === 'critical') {
 *     sendPerformanceAlertsToMonitoring(metrics.alerts, {
 *       requestId: 'req-123',
 *       operation: 'GET',
 *     })
 *   }
 *   
 *   // Log con métricas
 *   logger.info({ metrics }, 'Operación completada')
 * }
 * ```
 */

import { logger } from '@/lib/logger'
import { PERFORMANCE_THRESHOLDS } from './config'
import type { PerformanceMetrics } from './types'
import { getValidationMetrics } from './validation-utils'

/**
 * Verifica si el entorno es producción
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Niveles de severidad de alertas de performance
 */
export enum PerformanceAlertLevel {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

/**
 * Tipo de alerta de performance
 */
export interface PerformanceAlert {
  level: PerformanceAlertLevel
  message: string
  metric: string
  value: number
  threshold: number
  context?: string
  timestamp: Date
}

/**
 * Métricas de performance calculadas con alertas
 */
export interface EnhancedPerformanceMetrics extends PerformanceMetrics {
  alerts: PerformanceAlert[]
  hasAlerts: boolean
  severity: PerformanceAlertLevel | null
}

/**
 * Determina la severidad máxima de las alertas
 */
function determineMaxSeverity(alerts: PerformanceAlert[]): PerformanceAlertLevel | null {
  // CORRECCIÓN: Validar que alerts sea un array válido antes de usar hasAlerts()
  if (!Array.isArray(alerts)) {
    logger.warn(
      { alerts },
      'determineMaxSeverity recibió alerts inválido (no es array), retornando null'
    )
    return null
  }
  
  if (!hasAlerts(alerts)) {
    return null
  }
  
  // CORRECCIÓN: Validar que alerts sea un array válido antes de usar some()
  try {
    const hasCritical = alerts.some(a => {
      // Validar que a sea un objeto válido con level
      return a && typeof a === 'object' && 'level' in a && a.level === PerformanceAlertLevel.CRITICAL
    })
    
    // Validar que some() retorne un booleano válido
    return typeof hasCritical === 'boolean' && hasCritical
      ? PerformanceAlertLevel.CRITICAL
      : PerformanceAlertLevel.WARNING
  } catch (error) {
    logger.warn(
      { error, alerts },
      'determineMaxSeverity: Error al ejecutar some(), retornando WARNING'
    )
    return PerformanceAlertLevel.WARNING
  }
}

/**
 * Determina si una métrica es una métrica de duración
 */
function isDurationMetric(key: string): boolean {
  return key === 'authDuration' || key === 'queryDuration' || key === 'totalDuration'
}

/**
 * Crea una alerta de performance
 */
function createPerformanceAlert(
  level: PerformanceAlertLevel,
  message: string,
  metric: string,
  value: number,
  threshold: number,
  context?: string
): PerformanceAlert {
  return {
    level,
    message,
    metric,
    value,
    threshold,
    context,
    timestamp: new Date(),
  }
}

/**
 * Verifica si hay alertas
 * CORRECCIÓN: Valida que alerts sea un array válido antes de acceder a .length
 */
function hasAlerts(alerts: PerformanceAlert[]): boolean {
  // CORRECCIÓN: Validar que alerts sea un array válido antes de acceder a .length
  if (!Array.isArray(alerts)) {
    logger.warn(
      { alerts },
      'hasAlerts recibió alerts inválido (no es array), retornando false'
    )
    return false
  }
  // CORRECCIÓN: Validar que alerts.length sea un número finito antes de comparar
  const safeLength = Number.isFinite(alerts.length) && alerts.length >= 0 ? alerts.length : 0
  return safeLength > 0
}

/**
 * Obtiene contexto con fallback a 'unknown'
 */
function getContextWithFallback(context?: string): string {
  return context || 'unknown'
}

/**
 * Filtra alertas por nivel
 * CORRECCIÓN: Valida que alerts sea un array válido antes de usar filter()
 */
function filterAlertsByLevel(
  alerts: PerformanceAlert[],
  level: PerformanceAlertLevel
): PerformanceAlert[] {
  // CORRECCIÓN: Validar que alerts sea un array válido antes de usar filter()
  if (!Array.isArray(alerts)) {
    logger.warn(
      { alerts, level },
      'filterAlertsByLevel recibió alerts inválido (no es array), retornando array vacío'
    )
    return []
  }
  
  try {
    const filtered = alerts.filter(a => {
      // CORRECCIÓN: Validar que a sea un objeto válido con level antes de comparar
      return a && typeof a === 'object' && 'level' in a && a.level === level
    })
    // Validar que filter() retorne un array válido
    if (!Array.isArray(filtered)) {
      logger.warn(
        { alerts, level, filtered },
        'filterAlertsByLevel: filter() retornó resultado inválido, retornando array vacío'
      )
      return []
    }
    return filtered
  } catch (error) {
    logger.warn(
      { error, alerts, level },
      'filterAlertsByLevel: Error al ejecutar filter(), retornando array vacío'
    )
    return []
  }
}

/**
 * Verifica si una métrica excede un umbral y agrega alerta si es necesario
 */
function checkMetricThreshold(
  alerts: PerformanceAlert[],
  metricValue: number | undefined,
  threshold: number,
  metricName: string,
  metricLabel: string,
  context?: string
): void {
  // CORRECCIÓN: Validar que alerts sea un array válido antes de usar push()
  if (!Array.isArray(alerts)) {
    logger.warn(
      { alerts, metricValue, threshold, metricName },
      'checkMetricThreshold recibió alerts inválido (no es array), omitiendo alerta'
    )
    return
  }
  
  // CORRECCIÓN: Validar que metricValue y threshold sean números finitos antes de comparar
  const safeMetricValue = Number.isFinite(metricValue) ? metricValue : undefined
  const safeThreshold = Number.isFinite(threshold) ? threshold : 0
  
  if (safeMetricValue && safeMetricValue > safeThreshold) {
    // CORRECCIÓN: Validar que metricValue y threshold sean números finitos antes de usar en template string
    const safeMetricValueForMessage = Number.isFinite(metricValue) ? metricValue : 0
    const safeThresholdForMessage = Number.isFinite(threshold) ? threshold : 0
    
    // CORRECCIÓN: Validar que metricLabel sea un string válido antes de usar en template string
    const safeMetricLabel = typeof metricLabel === 'string' && metricLabel.length > 0
      ? metricLabel
      : 'Métrica'
    
    try {
      const message = `${safeMetricLabel} tardó ${safeMetricValueForMessage}ms, excediendo umbral de ${safeThresholdForMessage}ms`
      // Validar que message sea un string válido
      if (typeof message === 'string' && message.length > 0) {
        alerts.push(createPerformanceAlert(
          PerformanceAlertLevel.WARNING,
          message,
          metricName,
          safeMetricValueForMessage,
          safeThresholdForMessage,
          context
        ))
      } else {
        logger.warn(
          { metricLabel, metricValue, threshold, message },
          'checkMetricThreshold: message inválido, omitiendo alerta'
        )
      }
    } catch (error) {
      logger.warn(
        { error, metricLabel, metricValue, threshold },
        'checkMetricThreshold: Error al crear mensaje de alerta, omitiendo alerta'
      )
    }
  }
}

/**
 * Verifica la duración total contra umbrales crítico y de advertencia
 */
function checkTotalDurationThreshold(
  alerts: PerformanceAlert[],
  totalDuration: number,
  context?: string
): void {
  // CORRECCIÓN: Validar que alerts sea un array válido antes de usar push()
  if (!Array.isArray(alerts)) {
    logger.warn(
      { alerts, totalDuration, context },
      'checkTotalDurationThreshold recibió alerts inválido (no es array), omitiendo alerta'
    )
    return
  }
  
  // CORRECCIÓN: Validar que totalDuration y umbrales sean números finitos antes de comparar
  const safeTotalDuration = Number.isFinite(totalDuration) && totalDuration >= 0 ? totalDuration : 0
  const safeCritical = Number.isFinite(PERFORMANCE_THRESHOLDS.CRITICAL) && PERFORMANCE_THRESHOLDS.CRITICAL > 0
    ? PERFORMANCE_THRESHOLDS.CRITICAL
    : Infinity
  const safeWarning = Number.isFinite(PERFORMANCE_THRESHOLDS.WARNING) && PERFORMANCE_THRESHOLDS.WARNING > 0
    ? PERFORMANCE_THRESHOLDS.WARNING
    : Infinity
  
  if (safeTotalDuration > safeCritical) {
    // CORRECCIÓN: Validar que totalDuration y PERFORMANCE_THRESHOLDS.CRITICAL sean números finitos antes de usar en template string
    const safeTotalDurationForMessage = Number.isFinite(totalDuration) ? totalDuration : 0
    const safeCriticalForMessage = Number.isFinite(PERFORMANCE_THRESHOLDS.CRITICAL) ? PERFORMANCE_THRESHOLDS.CRITICAL : 0
    
    try {
      const message = `Operación tardó ${safeTotalDurationForMessage}ms, excediendo umbral crítico de ${safeCriticalForMessage}ms`
      // Validar que message sea un string válido
      if (typeof message === 'string' && message.length > 0) {
        alerts.push(createPerformanceAlert(
          PerformanceAlertLevel.CRITICAL,
          message,
          'totalDuration',
          safeTotalDurationForMessage,
          safeCriticalForMessage,
          context
        ))
      } else {
        logger.warn(
          { totalDuration, critical: PERFORMANCE_THRESHOLDS.CRITICAL, message },
          'checkTotalDurationThreshold: message inválido para CRITICAL, omitiendo alerta'
        )
      }
    } catch (error) {
      logger.warn(
        { error, totalDuration, critical: PERFORMANCE_THRESHOLDS.CRITICAL },
        'checkTotalDurationThreshold: Error al crear mensaje de alerta CRITICAL, omitiendo alerta'
      )
    }
  } else if (safeTotalDuration > safeWarning) {
    // CORRECCIÓN: Validar que safeTotalDuration y safeWarning sean números finitos antes de usar en template string
    const safeTotalDurationForMessage = Number.isFinite(safeTotalDuration) ? safeTotalDuration : 0
    const safeWarningForMessage = Number.isFinite(safeWarning) ? safeWarning : 0
    
    try {
      const message = `Operación tardó ${safeTotalDurationForMessage}ms, excediendo umbral de advertencia de ${safeWarningForMessage}ms`
      // Validar que message sea un string válido
      if (typeof message === 'string' && message.length > 0) {
        alerts.push(createPerformanceAlert(
          PerformanceAlertLevel.WARNING,
          message,
          'totalDuration',
          safeTotalDurationForMessage,
          safeWarningForMessage,
          context
        ))
      } else {
        logger.warn(
          { safeTotalDuration, safeWarning, message },
          'checkTotalDurationThreshold: message inválido para WARNING, omitiendo alerta'
        )
      }
    } catch (error) {
      logger.warn(
        { error, safeTotalDuration, safeWarning },
        'checkTotalDurationThreshold: Error al crear mensaje de alerta WARNING, omitiendo alerta'
      )
    }
  }
}

/**
 * Calcula métricas de performance mejoradas con sistema de alertas
 * 
 * @param startTime - Tiempo de inicio de la operación (timestamp)
 * @param metrics - Métricas parciales (authDuration, queryDuration, etc.)
 * @param context - Contexto de la operación (GET, POST, etc.)
 * @returns Métricas mejoradas con alertas y severidad
 * 
 * @example
 * ```typescript
 * const startTime = Date.now()
 * // ... operación ...
 * const metrics = calculateEnhancedMetrics(startTime, {
 *   authDuration: 150,
 *   queryDuration: 1200,
 *   cacheDuration: 50
 * }, 'GET')
 * 
 * if (metrics.hasAlerts) {
 *   // Manejar alertas
 *   metrics.alerts.forEach(alert => {
 *     logger.warn(alert, `Alerta de performance: ${alert.message}`)
 *   })
 * }
 * ```
 */
export function calculateEnhancedMetrics(
  startTime: number,
  metrics: Record<string, number>,
  context?: string
): EnhancedPerformanceMetrics {
  // CORRECCIÓN: Validar que startTime sea un número finito antes de calcular duración
  if (!Number.isFinite(startTime)) {
    logger.warn(
      { startTime, context },
      'calculateEnhancedMetrics recibió startTime inválido, usando 0'
    )
    startTime = Date.now()
  }
  
  const currentTime = Date.now()
  // Validar que currentTime sea un número finito
  if (!Number.isFinite(currentTime)) {
    logger.warn(
      { startTime, currentTime, context },
      'calculateEnhancedMetrics: Date.now() retornó valor inválido, usando startTime'
    )
    return {
      totalDuration: 0,
      ...metrics,
      alerts: [],
      hasAlerts: false,
      severity: null,
    }
  }
  
  const totalDuration = currentTime - startTime
  // Validar que totalDuration sea un número finito y no negativo
  const safeTotalDuration = Number.isFinite(totalDuration) ? Math.max(0, totalDuration) : 0
  
  const alerts: PerformanceAlert[] = []

  // Verificar duración total
  checkTotalDurationThreshold(alerts, safeTotalDuration, context)

  // Verificar métricas específicas
  checkMetricThreshold(
    alerts,
    metrics.authDuration,
    PERFORMANCE_THRESHOLDS.AUTH_WARNING,
    'authDuration',
    'Autenticación',
    context
  )

  checkMetricThreshold(
    alerts,
    metrics.queryDuration,
    PERFORMANCE_THRESHOLDS.QUERY_WARNING,
    'queryDuration',
    'Query',
    context
  )

  // Verificar otras métricas personalizadas
  // CORRECCIÓN: Validar que metrics sea un objeto válido antes de usar Object.entries
  if (metrics && typeof metrics === 'object' && !Array.isArray(metrics)) {
    try {
      // CORRECCIÓN: Validar que Object.entries() retorne un array válido antes de usar forEach()
      const entries = Object.entries(metrics)
      if (!Array.isArray(entries)) {
        logger.warn(
          { metrics, context },
          'calculateEnhancedMetrics: Object.entries() retornó resultado inválido, omitiendo métricas personalizadas'
        )
      } else {
        entries.forEach(([key, value]) => {
          // CORRECCIÓN: Validar que key sea un string válido y value sea un número válido
          if (typeof key !== 'string' || key.length === 0) {
            logger.warn(
              { key, value },
              'calculateEnhancedMetrics: key inválido en métricas, omitiendo'
            )
            return
          }
          
          // Saltar métricas ya verificadas
          if (isDurationMetric(key)) {
            return
          }

          // CORRECCIÓN: Validar que value sea un número finito antes de usar checkMetricThreshold
          const safeValue = Number.isFinite(value) ? value : undefined

          // Si una métrica es mayor al umbral, generar alerta de advertencia
          checkMetricThreshold(
            alerts,
            safeValue,
            PERFORMANCE_THRESHOLDS.CUSTOM_METRIC_WARNING,
            key,
            (() => {
              // CORRECCIÓN: Validar que key sea un string válido antes de usar en template string
              const safeKey = typeof key === 'string' && key.length > 0 ? key : 'unknown'
              return `Métrica ${safeKey}`
            })(),
            context
          )
        })
      }
    } catch (error) {
      logger.warn(
        { error, metrics, context },
        'Error al procesar métricas personalizadas en calculateEnhancedMetrics'
      )
    }
  }

  // Determinar severidad máxima
  const severity = determineMaxSeverity(alerts)

  // Log alertas si existen
  if (hasAlerts(alerts)) {
    logPerformanceAlerts(alerts, { totalDuration: safeTotalDuration, ...metrics }, context)
  }

  return {
    totalDuration: safeTotalDuration,
    ...metrics,
    alerts,
    hasAlerts: hasAlerts(alerts),
    severity,
  }
}

/**
 * Registra alertas de performance en el logger
 */
function logPerformanceAlerts(
  alerts: PerformanceAlert[],
  metrics: Record<string, number>,
  context?: string
): void {
  const criticalAlerts = filterAlertsByLevel(alerts, PerformanceAlertLevel.CRITICAL)
  const warningAlerts = filterAlertsByLevel(alerts, PerformanceAlertLevel.WARNING)

  const contextWithFallback = getContextWithFallback(context)

  if (hasAlerts(criticalAlerts)) {
    logger.error(
      {
        alerts: criticalAlerts,
        metrics,
        context: contextWithFallback,
        severity: PerformanceAlertLevel.CRITICAL,
      },
      (() => {
        // CORRECCIÓN: Validar que criticalAlerts.length sea un número válido antes de usar en template string
        const safeLength = Array.isArray(criticalAlerts) && Number.isFinite(criticalAlerts.length) && criticalAlerts.length >= 0
          ? criticalAlerts.length
          : 0
        return `Alertas críticas de performance detectadas: ${safeLength}`
      })()
    )
  }

  if (hasAlerts(warningAlerts)) {
    logger.warn(
      {
        alerts: warningAlerts,
        metrics,
        context: contextWithFallback,
        severity: PerformanceAlertLevel.WARNING,
      },
      (() => {
        // CORRECCIÓN: Validar que warningAlerts.length sea un número válido antes de usar en template string
        const safeLength = Array.isArray(warningAlerts) && Number.isFinite(warningAlerts.length) && warningAlerts.length >= 0
          ? warningAlerts.length
          : 0
        return `Alertas de advertencia de performance detectadas: ${safeLength}`
      })()
    )
  }
}

/**
 * Convierte alertas de performance a formato de string para compatibilidad
 * CORRECCIÓN: Valida que alerts sea un array válido antes de usar map
 */
function formatAlertsAsStrings(alerts: PerformanceAlert[]): string[] {
  if (!Array.isArray(alerts)) {
    logger.warn(
      { alerts },
      'formatAlertsAsStrings recibió alerts inválido, retornando array vacío'
    )
    return []
  }
  
  return alerts.map(alert => {
    try {
      // CORRECCIÓN: Validar que alert.level sea un string válido antes de usar toUpperCase()
      let levelString: string
      if (alert?.level && typeof alert.level === 'string' && alert.level.length > 0) {
        try {
          const upperCased = alert.level.toUpperCase()
          levelString = typeof upperCased === 'string' && upperCased.length > 0 ? upperCased : 'UNKNOWN'
        } catch (error) {
          logger.warn({ error, level: alert.level }, 'Error al ejecutar toUpperCase() en level, usando UNKNOWN')
          levelString = 'UNKNOWN'
        }
      } else {
        levelString = 'UNKNOWN'
      }
      
      // Validar que alert.message sea un string válido
      const messageString = alert?.message && typeof alert.message === 'string' && alert.message.length > 0
        ? alert.message
        : 'Sin mensaje'
      
      return `${levelString}: ${messageString}`
    } catch (error) {
      logger.warn(
        { error, alert },
        'Error al formatear alerta, usando valor por defecto'
      )
      return 'UNKNOWN: Error al formatear alerta'
    }
  })
}

/**
 * Helper para crear métricas de performance de forma más simple
 * Mantiene compatibilidad con la función anterior pero usa el nuevo sistema
 * 
 * @deprecated Usar calculateEnhancedMetrics en su lugar para mejor funcionalidad
 */
export function createPerformanceMetrics(
  startTime: number,
  metrics: Record<string, number>,
  context?: string
): PerformanceMetrics & { alerts?: string[] } {
  const enhanced = calculateEnhancedMetrics(startTime, metrics, context)
  
  // Convertir alertas a formato de string para compatibilidad
  const alertStrings = formatAlertsAsStrings(enhanced.alerts)

  return {
    totalDuration: enhanced.totalDuration,
    ...metrics,
    ...(enhanced.hasAlerts && { alerts: alertStrings }),
  }
}

/**
 * Envía alertas de performance a sistemas de monitoreo externos
 * (ej: Sentry, DataDog, etc.)
 * 
 * @param alerts - Alertas de performance a enviar
 * @param metadata - Metadatos adicionales
 */
/**
 * Envía alertas de performance a sistemas de monitoreo externos
 * (ej: Sentry, DataDog, etc.)
 * 
 * DECISIÓN DE DISEÑO: Integrado con métricas de validación para proporcionar
 * una vista completa del sistema. Incluye métricas de validación en el contexto
 * de las alertas de performance.
 * 
 * @param alerts - Alertas de performance a enviar
 * @param metadata - Metadatos adicionales
 */
export function sendPerformanceAlertsToMonitoring(
  alerts: PerformanceAlert[],
  metadata?: Record<string, unknown>
): void {
  try {
    // Validar que alerts sea un array válido
    if (!Array.isArray(alerts) || !hasAlerts(alerts)) {
      return
    }

    // Obtener métricas de validación para contexto adicional
    // DECISIÓN DE DISEÑO: Incluir métricas de validación en alertas de performance
    // para identificar si validaciones están impactando el performance
    let validationMetrics
    try {
      validationMetrics = getValidationMetrics()
    } catch (error) {
      logger.warn(
        { error },
        'sendPerformanceAlertsToMonitoring: Error al obtener métricas de validación'
      )
      validationMetrics = { counts: {}, averageDurations: {} }
    }

    // Por ahora solo logueamos, pero aquí se podría integrar con:
    // - Sentry para tracking de errores
    // - DataDog para métricas
    // - PagerDuty para alertas críticas
    // - Slack/Discord para notificaciones

    const criticalAlerts = filterAlertsByLevel(alerts, PerformanceAlertLevel.CRITICAL)
    
    if (hasAlerts(criticalAlerts) && isProduction()) {
      // En producción, podríamos enviar a un sistema de alertas
      logger.error(
        {
          type: 'performance_alert',
          alerts: criticalAlerts,
          validationMetrics, // Incluir métricas de validación
          ...metadata,
        },
        'ALERTA CRÍTICA DE PERFORMANCE - Requiere atención inmediata'
      )
      
      // Aquí se podría integrar con servicios externos (Sentry, DataDog, etc.)
      // Si fallan, no deben interrumpir la operación principal
    }
    
    // Log métricas de validación si hay muchas validaciones ejecutándose
    const totalValidations = Object.values(validationMetrics.counts).reduce(
      (sum, count) => sum + (typeof count === 'number' && Number.isFinite(count) ? count : 0),
      0
    )
    if (totalValidations > 1000) {
      logger.warn(
        {
          type: 'validation_metrics_high',
          totalValidations,
          validationMetrics,
          ...metadata,
        },
        'Alto número de validaciones ejecutadas - revisar performance'
      )
    }
  } catch (error) {
    // No fallar si el monitoreo falla, pero registrar el error
    logger.warn(
      { error, alertsCount: alerts?.length, ...metadata },
      'Error al enviar alertas de performance a monitoreo'
    )
  }
}

