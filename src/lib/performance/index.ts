/**
 * Performance - Punto de entrada
 * 
 * Exporta utilidades de performance y baseline.
 */

export {
  SERVER_BASELINE,
  CLIENT_BASELINE,
  UX_BASELINE,
  getBaselineThreshold,
  meetsBaseline,
  type PerformanceMetric,
} from './baseline'

export {
  measurePerformance,
  measurePerformanceSync,
  measurePerformanceBatch,
  type PerformanceMeasurement,
} from './measure'
