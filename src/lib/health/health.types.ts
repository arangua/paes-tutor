/**
 * Tipos de Health Checks
 * 
 * Regla Enterprise:
 * Contrato estable y determinista para monitoreo.
 */

/**
 * Estado de un check individual
 */
export type CheckStatus = 'ok' | 'down' | 'skipped'

/**
 * Estado general de salud
 */
export type HealthStatus = 'ok' | 'degraded'

/**
 * Resultado de liveness check
 * 
 * Semántica: ¿Está vivo el proceso?
 */
export interface LivenessResult {
  status: 'ok'
  timestamp: string
}

/**
 * Resultado de readiness check
 * 
 * Semántica: ¿Puede recibir tráfico ahora?
 */
export interface ReadinessResult {
  status: HealthStatus
  checks: {
    database: CheckStatus
    redis: CheckStatus
  }
  timestamp: string
}
