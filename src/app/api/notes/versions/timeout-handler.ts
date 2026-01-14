/**
 * Manejo de timeouts para requests
 * Previene que requests se cuelguen indefinidamente
 */

import { NextRequest, NextResponse } from 'next/server'
import { TRANSACTION_TIMEOUTS } from './config'
import { logger } from '@/lib/logger'

/**
 * Timeout por defecto para requests (30 segundos)
 */
const DEFAULT_REQUEST_TIMEOUT_MS = 30000

/**
 * Limpia un timeout de forma segura
 */
function clearTimeoutSafely(timeoutId: NodeJS.Timeout | null): void {
  if (timeoutId) {
    clearTimeout(timeoutId)
  }
}

/**
 * Obtiene contexto con fallback a 'unknown'
 */
function getContextWithFallback(context?: string): string {
  return context || 'unknown'
}

/**
 * Ejecuta una operación con timeout
 * CORRECCIÓN: Valida que operation sea una función y timeoutMs sea un número válido
 */
export async function withTimeout<T>(
  operation: () => Promise<T>,
  timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS,
  context?: string
): Promise<T> {
  // Validar que operation sea una función
  if (typeof operation !== 'function') {
    const error = new Error('Operation must be a function')
    logger.error(
      { operation, timeoutMs, context },
      'withTimeout recibió operation inválido'
    )
    throw error
  }
  
  // Validar que timeoutMs sea un número finito y positivo
  const safeTimeoutMs = Number.isFinite(timeoutMs) && timeoutMs > 0 
    ? timeoutMs 
    : DEFAULT_REQUEST_TIMEOUT_MS
  
  if (timeoutMs !== safeTimeoutMs) {
    logger.warn(
      { timeoutMs, safeTimeoutMs, context },
      'withTimeout recibió timeoutMs inválido, usando valor por defecto'
    )
  }
  
  let timeoutId: NodeJS.Timeout | null = null
  const contextWithFallback = getContextWithFallback(context)
  
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => {
      // CORRECCIÓN: Validar que safeTimeoutMs sea un número finito antes de usar en template string
      const safeTimeoutMsForMessage = Number.isFinite(safeTimeoutMs) && safeTimeoutMs >= 0 ? safeTimeoutMs : 0
      const errorMessage = `Operation timeout after ${safeTimeoutMsForMessage}ms`
      // CORRECCIÓN: Validar que errorMessage sea un string válido antes de crear Error
      if (typeof errorMessage === 'string' && errorMessage.length > 0) {
        const error = new Error(errorMessage)
        logger.error(
          { timeout: safeTimeoutMsForMessage, context: contextWithFallback },
          `Timeout en operación: ${contextWithFallback}`
        )
        reject(error)
      } else {
        // Fallback si el mensaje es inválido
        const error = new Error('Operation timeout')
        logger.error(
          { timeout: safeTimeoutMsForMessage, context: contextWithFallback },
          `Timeout en operación: ${contextWithFallback}`
        )
        reject(error)
      }
    }, safeTimeoutMs)
  })

  try {
    // CORRECCIÓN: Validar que operation() retorne una Promise válida antes de usar Promise.race()
    const operationPromise = operation()
    // Validar que operationPromise sea una Promise válida
    if (!operationPromise || typeof operationPromise.then !== 'function') {
      logger.error(
        { operationPromise, timeoutMs: safeTimeoutMs, context },
        'withTimeout: operation() no retornó una Promise válida'
      )
      clearTimeoutSafely(timeoutId)
      throw new Error('Operation did not return a valid Promise')
    }
    
    const result = await Promise.race([operationPromise, timeoutPromise])
    // Limpiar timeout si la operación completó primero
    clearTimeoutSafely(timeoutId)
    
    // Validar que result no sea undefined (aunque Promise.race puede retornar undefined en algunos casos)
    if (result === undefined) {
      logger.warn(
        { timeoutMs: safeTimeoutMs, context },
        'withTimeout: Promise.race() retornó undefined'
      )
    }
    
    return result
  } catch (error) {
    // Limpiar timeout en caso de error
    clearTimeoutSafely(timeoutId)
    throw error
  }
}

/**
 * Wrapper para handlers con timeout automático
 */
export function withRequestTimeout(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  _timeoutMs: number = DEFAULT_REQUEST_TIMEOUT_MS
): Promise<NextResponse> {
  const method = request.method
  const timeout = method === 'GET' 
    ? TRANSACTION_TIMEOUTS.QUERY 
    : method === 'POST'
    ? TRANSACTION_TIMEOUTS.RESTORE
    : method === 'PATCH'
    ? TRANSACTION_TIMEOUTS.UPDATE
    : TRANSACTION_TIMEOUTS.DELETE

  return withTimeout(
    handler,
    timeout,
    `notes/versions/${method}`
  ).catch((error) => {
    if (error instanceof Error && error.message.includes('timeout')) {
      logger.error(
        { method, timeout, path: request.nextUrl.pathname },
        'Request timeout'
      )
      return NextResponse.json(
        {
          error: 'La solicitud tardó demasiado tiempo',
          code: 'REQUEST_TIMEOUT',
        },
        { status: 504 } // Gateway Timeout
      )
    }
    throw error
  })
}

