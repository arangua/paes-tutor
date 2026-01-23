/**
 * UX Baseline - Reglas y Umbrales
 * 
 * Regla Enterprise:
 * La UX técnica es parte del contrato del sistema.
 */

import { UX_BASELINE } from '../performance/baseline'

/**
 * Reglas de UX Técnica
 */
export const UX_RULES = {
  /**
   * Loading debe aparecer si la operación toma > 200ms
   */
  LOADING_THRESHOLD_MS: UX_BASELINE.LOADING_THRESHOLD_MS,

  /**
   * Feedback visual debe aparecer en < 100ms
   */
  FEEDBACK_DELAY_MS: UX_BASELINE.FEEDBACK_DELAY_MS,

  /**
   * Transiciones deben completarse en < 300ms
   */
  TRANSITION_MAX_TIME_MS: UX_BASELINE.TRANSITION_MAX_TIME_MS,
} as const

/**
 * Anti-patterns prohibidos en UX
 */
export const UX_ANTI_PATTERNS = {
  /**
   * ❌ Render condicional implícito (data && <Component />)
   * ✅ Usar UXBoundary
   */
  IMPLICIT_CONDITIONAL_RENDER: 'data && <Component />',

  /**
   * ❌ Pantalla en blanco
   * ✅ Siempre mostrar estado explícito
   */
  BLANK_SCREEN: 'Pantalla en blanco sin estado',

  /**
   * ❌ Spinner infinito
   * ✅ Timeout y error después de umbral
   */
  INFINITE_SPINNER: 'Spinner sin timeout',

  /**
   * ❌ Error genérico sin acción
   * ✅ Error tipado con acción de recuperación
   */
  GENERIC_ERROR_NO_ACTION: 'Error genérico sin acción',

  /**
   * ❌ Try/catch silencioso en UI
   * ✅ Siempre mostrar error al usuario
   */
  SILENT_CATCH: 'try/catch sin mostrar error',
} as const

/**
 * Verifica si un tiempo de loading cumple con el umbral
 */
export function shouldShowLoading(duration: number): boolean {
  return duration > UX_RULES.LOADING_THRESHOLD_MS
}

/**
 * Verifica si un tiempo de feedback cumple con el umbral
 */
export function meetsFeedbackBaseline(duration: number): boolean {
  return duration <= UX_RULES.FEEDBACK_DELAY_MS
}

/**
 * Verifica si un tiempo de transición cumple con el umbral
 */
export function meetsTransitionBaseline(duration: number): boolean {
  return duration <= UX_RULES.TRANSITION_MAX_TIME_MS
}
