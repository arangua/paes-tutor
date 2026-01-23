/**
 * Performance Baseline - Umbrales Aceptables
 * 
 * Regla Enterprise:
 * No se optimiza lo que no se mide, y no se protege lo que no tiene guard.
 * 
 * Características:
 * - Umbrales explícitos y medibles
 * - Separación server vs client
 * - Determinista y CI-friendly
 */

/**
 * Umbrales de Performance - Server (API/SSR)
 */
export const SERVER_BASELINE = {
  /**
   * Tiempo máximo de respuesta de API (ms)
   * 
   * Regla: APIs deben responder en < 500ms en condiciones normales
   */
  API_MAX_RESPONSE_TIME_MS: 500,

  /**
   * Tiempo máximo de respuesta de API crítica (ms)
   * 
   * Regla: APIs críticas (auth, health) deben responder en < 200ms
   */
  API_CRITICAL_MAX_RESPONSE_TIME_MS: 200,

  /**
   * Tiempo máximo de query a base de datos (ms)
   * 
   * Regla: Queries simples deben completarse en < 100ms
   */
  DB_QUERY_MAX_TIME_MS: 100,

  /**
   * Tiempo máximo de query compleja (ms)
   * 
   * Regla: Queries complejas (joins, agregaciones) pueden tomar hasta 500ms
   */
  DB_COMPLEX_QUERY_MAX_TIME_MS: 500,

  /**
   * Tiempo máximo de SSR (ms)
   * 
   * Regla: Server-side rendering debe completarse en < 1000ms
   */
  SSR_MAX_TIME_MS: 1000,
} as const

/**
 * Umbrales de Performance - Client (Render/Hydration)
 */
export const CLIENT_BASELINE = {
  /**
   * Tiempo máximo de First Contentful Paint (ms)
   * 
   * Regla: FCP debe ocurrir en < 1800ms
   */
  FCP_MAX_TIME_MS: 1800,

  /**
   * Tiempo máximo de Time to Interactive (ms)
   * 
   * Regla: TTI debe ocurrir en < 3800ms
   */
  TTI_MAX_TIME_MS: 3800,

  /**
   * Tiempo máximo de Hydration (ms)
   * 
   * Regla: Hydration debe completarse en < 500ms
   */
  HYDRATION_MAX_TIME_MS: 500,

  /**
   * Tiempo máximo de render inicial (ms)
   * 
   * Regla: Render inicial debe completarse en < 1000ms
   */
  INITIAL_RENDER_MAX_TIME_MS: 1000,
} as const

/**
 * Umbrales de Performance - UX Técnica
 */
export const UX_BASELINE = {
  /**
   * Tiempo máximo antes de mostrar loading (ms)
   * 
   * Regla: Loading debe aparecer si la operación toma > 200ms
   */
  LOADING_THRESHOLD_MS: 200,

  /**
   * Tiempo máximo de feedback visual (ms)
   * 
   * Regla: Feedback visual (toast, mensaje) debe aparecer en < 100ms
   */
  FEEDBACK_DELAY_MS: 100,

  /**
   * Tiempo máximo de transición (ms)
   * 
   * Regla: Transiciones deben completarse en < 300ms
   */
  TRANSITION_MAX_TIME_MS: 300,
} as const

/**
 * Tipo de métrica de performance
 */
export type PerformanceMetric = 
  | 'api_response'
  | 'api_critical'
  | 'db_query'
  | 'db_complex_query'
  | 'ssr'
  | 'fcp'
  | 'tti'
  | 'hydration'
  | 'initial_render'
  | 'loading'
  | 'feedback'
  | 'transition'

/**
 * Obtiene el umbral máximo para una métrica
 */
export function getBaselineThreshold(metric: PerformanceMetric): number {
  switch (metric) {
    case 'api_response':
      return SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS
    case 'api_critical':
      return SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS
    case 'db_query':
      return SERVER_BASELINE.DB_QUERY_MAX_TIME_MS
    case 'db_complex_query':
      return SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS
    case 'ssr':
      return SERVER_BASELINE.SSR_MAX_TIME_MS
    case 'fcp':
      return CLIENT_BASELINE.FCP_MAX_TIME_MS
    case 'tti':
      return CLIENT_BASELINE.TTI_MAX_TIME_MS
    case 'hydration':
      return CLIENT_BASELINE.HYDRATION_MAX_TIME_MS
    case 'initial_render':
      return CLIENT_BASELINE.INITIAL_RENDER_MAX_TIME_MS
    case 'loading':
      return UX_BASELINE.LOADING_THRESHOLD_MS
    case 'feedback':
      return UX_BASELINE.FEEDBACK_DELAY_MS
    case 'transition':
      return UX_BASELINE.TRANSITION_MAX_TIME_MS
    default:
      return Infinity
  }
}

/**
 * Verifica si una métrica cumple con el baseline
 */
export function meetsBaseline(metric: PerformanceMetric, actualTime: number): boolean {
  const threshold = getBaselineThreshold(metric)
  return actualTime <= threshold
}
