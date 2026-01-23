/**
 * Health Checks - Punto de entrada
 * 
 * Exporta todos los checks de salud para uso externo.
 */

export { checkLiveness } from './liveness'
export { checkReadiness } from './readiness'
export type { LivenessResult, ReadinessResult, HealthStatus, CheckStatus } from './health.types'
