/**
 * Integración del historial de errores con el sistema de errores estructurado
 * Agrega automáticamente errores al historial cuando se muestran al usuario
 */

import type { ErrorMessage } from './error-messages'
import type { UserError } from '@/hooks/useErrorHistory'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'

/**
 * Convierte un ErrorMessage a UserError para el historial
 */
export function errorMessageToUserError(
  error: ErrorMessage,
  path?: string,
  context?: Record<string, unknown>
): UserError {
  const uuid = globalThis.crypto?.randomUUID?.()
  const idSuffix = uuid ? uuid : String(Date.now())
  return {
    id: `${error.code}-${Date.now()}-${idSuffix}`,
    timestamp: safeToISOString(new Date()),
    code: error.code,
    title: error.title,
    description: error.description,
    solution: error.solution,
    severity: error.severity,
    category: error.category,
    path: path || (typeof window !== 'undefined' ? window.location.pathname : undefined),
    context,
    resolved: false,
  }
}

/**
 * Función helper para agregar error al historial desde el cliente
 * Esta función debe ser llamada desde componentes del cliente
 */
export function addErrorToHistory(error: ErrorMessage, path?: string, context?: Record<string, unknown>) {
  if (typeof window === 'undefined') return

  try {
    const userError = errorMessageToUserError(error, path, context)
    const historyKey = 'paes-tutor-error-history'
    const existing = localStorage.getItem(historyKey)
    const history: UserError[] = existing ? JSON.parse(existing) : []

    // Evitar duplicados recientes (mismo código en los últimos 5 minutos)
    const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
    const recentDuplicate = history.find(
      e =>
        e.code === userError.code &&
        new Date(e.timestamp).getTime() > fiveMinutesAgo &&
        e.path === userError.path
    )

    if (!recentDuplicate) {
      const updated = [userError, ...history].slice(0, 100) // Mantener solo los últimos 100
      localStorage.setItem(historyKey, JSON.stringify(updated))
    }
  } catch {
    // Ignorar errores de localStorage
  }
}

