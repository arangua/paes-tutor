/**
 * Utilidades de Validación Centralizadas
 * 
 * Funciones helper reutilizables para validaciones comunes en todo el código.
 * Estas funciones están en src/lib para que puedan ser usadas por cualquier módulo
 * sin violar la arquitectura (lib no debe depender de app/api).
 * 
 * @module validation-utils
 */

import { logger } from '@/lib/logger'

/**
 * Valida que un valor sea un número finito
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: 0)
 * @returns Número finito validado o fallback
 * 
 * @example
 * ```typescript
 * const safeCount = ensureFiniteNumber(userInput, 0)
 * ```
 */
export function ensureFiniteNumber(value: unknown, fallback: number = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = Number.parseFloat(value)
    if (Number.isFinite(parsed)) {
      return parsed
    }
  }
  logger.warn(
    { value, fallback },
    'ensureFiniteNumber: valor inválido, usando fallback'
  )
  return Number.isFinite(fallback) ? fallback : 0
}

/**
 * Valida que un valor sea un número entero finito
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: 0)
 * @returns Número entero validado o fallback
 */
export function ensureInteger(value: unknown, fallback: number = 0): number {
  const num = ensureFiniteNumber(value, fallback)
  return Number.isInteger(num) ? num : Math.floor(num)
}

/**
 * Redondea un número de forma segura
 * 
 * Maneja casos edge como valores no finitos, overflow, etc.
 * 
 * @param value - Valor a redondear
 * @param decimals - Número de decimales (default: 0)
 * @returns Número redondeado o 0 si hay error
 * 
 * @example
 * ```typescript
 * const rounded = safeRound(3.14159, 2) // 3.14
 * ```
 */
export function safeRound(value: number, decimals: number = 0): number {
  if (!Number.isFinite(value)) {
    logger.warn({ value, decimals }, 'safeRound: value no es finito, retornando 0')
    return 0
  }
  
  // Manejar Number.MAX_VALUE que puede causar overflow
  if (value >= Number.MAX_SAFE_INTEGER || value <= Number.MIN_SAFE_INTEGER) {
    // Si el valor es extremadamente grande, verificar si puede causar overflow
    if (value === Number.MAX_VALUE || value === -Number.MAX_VALUE || !Number.isFinite(value * 1)) {
      logger.warn({ value, decimals }, 'safeRound: value excede límites seguros, retornando 0')
      return 0
    }
  }
  
  if (!Number.isFinite(decimals) || decimals < 0 || !Number.isInteger(decimals)) {
    logger.warn({ value, decimals }, 'safeRound: decimals inválido, usando 0')
    decimals = 0
  }
  
  const factor = Math.pow(10, decimals)
  if (!Number.isFinite(factor) || factor <= 0) {
    logger.warn({ value, decimals, factor }, 'safeRound: factor inválido, retornando Math.round(value)')
    const rounded = Math.round(value)
    return Number.isFinite(rounded) ? rounded : 0
  }
  
  const multiplied = value * factor
  if (!Number.isFinite(multiplied)) {
    logger.warn({ value, factor, multiplied }, 'safeRound: multiplicación inválida, retornando Math.round(value)')
    const rounded = Math.round(value)
    return Number.isFinite(rounded) ? rounded : 0
  }
  
  const rounded = Math.round(multiplied)
  if (!Number.isFinite(rounded)) {
    logger.warn({ value, multiplied, rounded }, 'safeRound: Math.round() retornó valor inválido, retornando 0')
    return 0
  }
  
  const result = rounded / factor
  return Number.isFinite(result) ? result : 0
}

/**
 * Divide dos números de forma segura
 * 
 * Evita división por cero y maneja valores no finitos.
 * 
 * @param dividend - Dividendo
 * @param divisor - Divisor
 * @param fallback - Valor por defecto si hay error (default: 0)
 * @returns Resultado de la división o fallback
 * 
 * @example
 * ```typescript
 * const percentage = safeDivide(correctas, total, 0) * 100
 * const average = safeDivide(sum, count, 0)
 * ```
 */
export function safeDivide(
  dividend: unknown,
  divisor: unknown,
  fallback: number = 0
): number {
  // Validar que dividend sea un número finito válido
  let safeDividend: number
  if (typeof dividend === 'number' && Number.isFinite(dividend)) {
    safeDividend = dividend
  } else if (typeof dividend === 'string') {
    const parsed = Number.parseFloat(dividend)
    if (Number.isFinite(parsed)) {
      safeDividend = parsed
    } else {
      logger.warn(
        { dividend, divisor, fallback },
        'safeDivide: dividend inválido, usando fallback'
      )
      return Number.isFinite(fallback) ? fallback : 0
    }
  } else {
    // null, undefined, NaN, Infinity, etc.
    logger.warn(
      { dividend, divisor, fallback },
      'safeDivide: dividend inválido, usando fallback'
    )
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  // Validar que divisor sea un número finito válido
  let safeDivisor: number
  if (typeof divisor === 'number' && Number.isFinite(divisor)) {
    safeDivisor = divisor
  } else if (typeof divisor === 'string') {
    const parsed = Number.parseFloat(divisor)
    if (Number.isFinite(parsed)) {
      safeDivisor = parsed
    } else {
      logger.warn(
        { dividend: safeDividend, divisor, fallback },
        'safeDivide: divisor inválido, usando fallback'
      )
      return Number.isFinite(fallback) ? fallback : 0
    }
  } else {
    // null, undefined, NaN, Infinity, etc.
    logger.warn(
      { dividend: safeDividend, divisor, fallback },
      'safeDivide: divisor inválido, usando fallback'
    )
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  // Evitar división por cero
  if (safeDivisor === 0) {
    logger.warn(
      { dividend: safeDividend, divisor: safeDivisor, fallback },
      'safeDivide: división por cero detectada, usando fallback'
    )
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  // Realizar división
  const result = safeDividend / safeDivisor
  
  // Validar que el resultado sea finito
  if (!Number.isFinite(result)) {
    logger.warn(
      { dividend: safeDividend, divisor: safeDivisor, result, fallback },
      'safeDivide: resultado no finito, usando fallback'
    )
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  return result
}

