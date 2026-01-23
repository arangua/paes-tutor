/**
 * Check de Timeouts y Límites
 * 
 * Regla Enterprise:
 * Timeouts mal configurados causan degradación silenciosa.
 * Validar en startup, no en runtime.
 * 
 * Características:
 * - Validación de timeouts mínimos
 * - Validación de coherencia entre límites
 * - Error tipado (SystemError)
 * - Sin side effects (solo validación)
 */

import { SystemError } from '@/lib/errors/error-types'
import { TRANSACTION_TIMEOUTS } from '@/app/api/notes/versions/config'
import { TIME_CONSTANTS } from '@/lib/constants'

/**
 * Timeout mínimo aceptable para producción (1 segundo)
 */
const MIN_TIMEOUT_MS = 1000

/**
 * Verifica que los timeouts y límites estén correctamente configurados
 * 
 * @throws {SystemError} Si algún timeout es inválido
 */
export function checkTimeouts(): void {
  const errors: string[] = []

  // Validar timeouts de transacciones
  if (TRANSACTION_TIMEOUTS.RESTORE < MIN_TIMEOUT_MS) {
    errors.push(
      `TRANSACTION_TIMEOUTS.RESTORE (${TRANSACTION_TIMEOUTS.RESTORE}ms) es menor al mínimo requerido (${MIN_TIMEOUT_MS}ms)`
    )
  }

  if (TRANSACTION_TIMEOUTS.UPDATE < MIN_TIMEOUT_MS) {
    errors.push(
      `TRANSACTION_TIMEOUTS.UPDATE (${TRANSACTION_TIMEOUTS.UPDATE}ms) es menor al mínimo requerido (${MIN_TIMEOUT_MS}ms)`
    )
  }

  if (TRANSACTION_TIMEOUTS.DELETE < MIN_TIMEOUT_MS) {
    errors.push(
      `TRANSACTION_TIMEOUTS.DELETE (${TRANSACTION_TIMEOUTS.DELETE}ms) es menor al mínimo requerido (${MIN_TIMEOUT_MS}ms)`
    )
  }

  if (TRANSACTION_TIMEOUTS.QUERY < MIN_TIMEOUT_MS) {
    errors.push(
      `TRANSACTION_TIMEOUTS.QUERY (${TRANSACTION_TIMEOUTS.QUERY}ms) es menor al mínimo requerido (${MIN_TIMEOUT_MS}ms)`
    )
  }

  // Validar coherencia: RESTORE debe ser >= UPDATE y DELETE
  if (TRANSACTION_TIMEOUTS.RESTORE < TRANSACTION_TIMEOUTS.UPDATE) {
    errors.push(
      `TRANSACTION_TIMEOUTS.RESTORE (${TRANSACTION_TIMEOUTS.RESTORE}ms) debe ser >= UPDATE (${TRANSACTION_TIMEOUTS.UPDATE}ms)`
    )
  }

  if (TRANSACTION_TIMEOUTS.RESTORE < TRANSACTION_TIMEOUTS.DELETE) {
    errors.push(
      `TRANSACTION_TIMEOUTS.RESTORE (${TRANSACTION_TIMEOUTS.RESTORE}ms) debe ser >= DELETE (${TRANSACTION_TIMEOUTS.DELETE}ms)`
    )
  }

  // Validar timeouts de rate limiting (deben ser > 0)
  if (TIME_CONSTANTS.GENERAL_RATE_LIMIT_WINDOW_MS <= 0) {
    errors.push('TIME_CONSTANTS.GENERAL_RATE_LIMIT_WINDOW_MS debe ser > 0')
  }

  if (TIME_CONSTANTS.AUTH_RATE_LIMIT_WINDOW_MS <= 0) {
    errors.push('TIME_CONSTANTS.AUTH_RATE_LIMIT_WINDOW_MS debe ser > 0')
  }

  // Si hay errores, lanzar SystemError
  if (errors.length > 0) {
    throw new SystemError(
      `Invalid timeout configuration: ${errors.join('; ')}`,
      undefined,
      'INVALID_TIMEOUT_CONFIG',
      {
        errors,
        minTimeout: MIN_TIMEOUT_MS,
        timestamp: new Date().toISOString(),
      }
    )
  }
}
