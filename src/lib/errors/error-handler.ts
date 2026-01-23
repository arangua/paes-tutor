/**
 * Error Handler Enterprise
 * 
 * Punto único de traducción error → HTTP
 * 
 * Reglas:
 * - Errores tipados (clases, no strings)
 * - Un punto de traducción
 * - Contrato de error estable
 * - No leaks de stack/implementación al cliente
 * - Errores de contrato NO llegan al dominio
 */

import { NextResponse } from 'next/server'
import { logger } from '../logger'
import {
  AppError,
  SystemError,
  ErrorCategory,
} from './error-types'

/**
 * Maneja errores de forma enterprise
 * 
 * Traduce cualquier error a:
 * 1. NextResponse (para cliente)
 * 2. Log estructurado (para observabilidad)
 * 
 * @param error - Error a manejar (unknown)
 * @param context - Contexto adicional para logging
 * @returns NextResponse con error formateado
 */
export function handleError(
  error: unknown,
  context?: Record<string, unknown>
): NextResponse {
  // Si ya es un AppError, usar directamente
  if (error instanceof AppError) {
    return handleAppError(error, context)
  }

  // Si es un Error estándar, convertir a SystemError
  if (error instanceof Error) {
    const systemError = new SystemError(
      'Internal server error',
      error,
      'UNKNOWN_ERROR',
      context
    )
    return handleAppError(systemError, context)
  }

  // Si es algo desconocido, convertir a SystemError
  const systemError = new SystemError(
    'Internal server error',
    undefined,
    'UNKNOWN_ERROR',
    { ...context, rawError: String(error) }
  )
  return handleAppError(systemError, context)
}

/**
 * Maneja un AppError específico
 * 
 * Proceso:
 * 1. Log estructurado (observabilidad)
 * 2. Traducción a NextResponse (cliente)
 */
function handleAppError(
  error: AppError,
  context?: Record<string, unknown>
): NextResponse {
  // Log estructurado para observabilidad
  const observable = error.toObservable()
  const logData = {
    ...observable.error,
    ...context,
  }

  // Log según categoría
  switch (error.category) {
    case 'contract':
      // Errores de contrato: warn (son esperados, no críticos)
      logger.warn(logData, `Contract error: ${error.message}`)
      break

    case 'domain':
      // Errores de dominio: warn (lógica de negocio, no críticos)
      logger.warn(logData, `Domain error: ${error.message}`)
      break

    case 'system':
      // Errores de sistema: error (críticos, requieren atención)
      logger.error(logData, `System error: ${error.message}`)
      break
  }

  // Traducción a NextResponse
  return error.toResponse()
}

/**
 * Wrapper para handlers de API Routes
 * 
 * Captura errores y los maneja de forma enterprise
 * 
 * @param handler - Función async que retorna NextResponse
 * @param context - Contexto adicional para logging
 * @returns NextResponse (siempre, nunca lanza)
 */
export async function withErrorHandler(
  handler: () => Promise<NextResponse>,
  context?: Record<string, unknown>
): Promise<NextResponse> {
  try {
    return await handler()
  } catch (error) {
    return handleError(error, context)
  }
}

/**
 * Verifica si un error es de una categoría específica
 */
export function isErrorCategory(
  error: unknown,
  category: ErrorCategory
): boolean {
  return error instanceof AppError && error.category === category
}

/**
 * Verifica si un error es de contrato
 */
export function isContractError(error: unknown): boolean {
  return isErrorCategory(error, 'contract')
}

/**
 * Verifica si un error es de dominio
 */
export function isDomainError(error: unknown): boolean {
  return isErrorCategory(error, 'domain')
}

/**
 * Verifica si un error es de sistema
 */
export function isSystemError(error: unknown): boolean {
  return isErrorCategory(error, 'system')
}
