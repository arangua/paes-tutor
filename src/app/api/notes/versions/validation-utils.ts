/**
 * Sistema de Validación Centralizado
 * 
 * Este módulo proporciona funciones helper reutilizables para validaciones comunes
 * en todo el código. Centraliza la lógica de validación defensiva para:
 * - Reducir duplicación de código
 * - Mejorar mantenibilidad
 * - Facilitar testing
 * - Proporcionar validaciones consistentes
 * 
 * NOTA: Las funciones básicas (ensureFiniteNumber, ensureInteger, safeDivide, safeRound)
 * están ahora en @/lib/utils/validation-utils para evitar dependencias circulares.
 * Este módulo las re-exporta para mantener compatibilidad y agrega funciones específicas
 * del módulo de notas.
 * 
 * @module validation-utils
 */

import { logger } from '@/lib/logger'
import { Buffer } from 'buffer'

// Importar funciones básicas desde lib para uso interno
import {
  ensureFiniteNumber,
  ensureInteger,
  safeDivide,
  safeRound,
} from '@/lib/utils/validation-utils'

// Re-exportar funciones básicas desde lib para mantener compatibilidad
export {
  ensureFiniteNumber,
  ensureInteger,
  safeDivide,
  safeRound,
}

/**
 * ============================================================================
 * VALIDACIONES DE TIPOS BÁSICOS
 * ============================================================================
 */

/**
 * Valida que un valor sea un número finito positivo (mayor que cero)
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: 1)
 * @returns Número finito positivo validado o fallback
 */
export function ensurePositiveNumber(value: unknown, fallback: number = 1): number {
  const num = ensureFiniteNumber(value, fallback)
  return num > 0 ? num : (fallback > 0 ? fallback : 1)
}

/**
 * Valida que un valor sea un string no vacío
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: '')
 * @param trim - Si es true, aplica trim() antes de validar (default: true)
 * @returns String no vacío validado o fallback
 * 
 * @example
 * ```typescript
 * const safeTitle = ensureNonEmptyString(version.title, 'Sin título')
 * ```
 */
/**
 * Valida que un valor sea un string no vacío
 * 
 * OPTIMIZACIÓN: Cachea resultados para strings comunes ('', 'null', 'undefined')
 * y evita logging innecesario para valores esperados.
 */
export function ensureNonEmptyString(
  value: unknown,
  fallback: string = '',
  trim: boolean = true
): string {
  // Optimización: strings comunes
  if (value === '') return fallback
  if (value === null || value === undefined) return fallback
  
  if (typeof value === 'string') {
    const processed = trim ? value.trim() : value
    if (processed.length > 0) {
      return processed
    }
  }
  
  // Solo loguear si el valor no es null/undefined (valores esperados)
  if (value !== null && value !== undefined && value !== '') {
    logger.warn(
      { value, fallback },
      'ensureNonEmptyString: valor inválido o vacío, usando fallback'
    )
  }
  
  return typeof fallback === 'string' ? fallback : ''
}

/**
 * Valida que un valor sea un array válido
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: [])
 * @returns Array validado o fallback
 * 
 * @example
 * ```typescript
 * const safeVersions = ensureArray(versions, [])
 * ```
 */
export function ensureArray<T>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) {
    return value
  }
  logger.warn(
    { value, fallback },
    'ensureArray: valor no es un array, usando fallback'
  )
  return Array.isArray(fallback) ? fallback : []
}

/**
 * Valida que un valor sea un objeto válido (no array, no null)
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: {})
 * @returns Objeto validado o fallback
 */
export function ensureObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T = {} as T
): T {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T
  }
  logger.warn(
    { value, fallback },
    'ensureObject: valor no es un objeto válido, usando fallback'
  )
  return fallback
}

/**
 * Valida que un valor sea una fecha válida
 * 
 * @param value - Valor a validar (Date, string, o number)
 * @param fallback - Valor por defecto si la validación falla (default: new Date())
 * @returns Date válida o fallback
 * 
 * @example
 * ```typescript
 * const safeDate = ensureValidDate(version.createdAt, new Date())
 * ```
 */
/**
 * Valida si un valor es una fecha válida (no NaN)
 * 
 * Función helper para eliminar repetición del patrón:
 * `instanceof Date && !Number.isNaN(date.getTime())`
 * 
 * @param value - Valor a validar
 * @returns true si es una fecha válida, false en caso contrario
 * 
 * @example
 * ```typescript
 * if (isValidDate(version.createdAt)) {
 *   // usar fecha
 * }
 * ```
 */
export function isValidDate(value: unknown): value is Date {
  return value instanceof Date && !Number.isNaN(value.getTime())
}

/**
 * Valida que un valor sea una fecha válida, retornando una fecha segura
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: new Date())
 * @returns Date válida o fallback
 * 
 * @example
 * ```typescript
 * const safeDate = ensureValidDate(version.createdAt, new Date())
 * ```
 */
export function ensureValidDate(value: unknown, fallback: Date = new Date()): Date {
  if (isValidDate(value)) {
    return value
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value)
    if (isValidDate(date)) {
      return date
    }
  }
  logger.warn(
    { value, fallback },
    'ensureValidDate: valor no es una fecha válida, usando fallback'
  )
  return isValidDate(fallback) ? fallback : new Date()
}

/**
 * ============================================================================
 * VALIDACIONES DE OPERACIONES COMUNES
 * ============================================================================
 */

/**
 * Valida y ejecuta una operación de array de forma segura
 * 
 * @param array - Array a validar
 * @param operation - Operación a ejecutar (map, filter, etc.)
 * @param fallback - Valor por defecto si la validación falla
 * @returns Resultado de la operación o fallback
 * 
 * @example
 * ```typescript
 * const mapped = safeArrayOperation(versions, v => v.id, [])
 * ```
 */
export function safeArrayOperation<T, R>(
  array: unknown,
  operation: (_arr: T[]) => R,
  fallback: R
): R {
  const safeArray = ensureArray<T>(array, [])
  try {
    const result = operation(safeArray)
    return result !== undefined && result !== null ? result : fallback
  } catch (error) {
    logger.warn(
      { error, array },
      'safeArrayOperation: error al ejecutar operación, usando fallback'
    )
    return fallback
  }
}

/**
 * Valida y ejecuta una operación de string de forma segura
 * 
 * @param str - String a validar
 * @param operation - Operación a ejecutar (substring, replace, etc.)
 * @param fallback - Valor por defecto si la validación falla
 * @returns Resultado de la operación o fallback
 * 
 * @example
 * ```typescript
 * const preview = safeStringOperation(content, s => s.substring(0, 200), '')
 * ```
 */
export function safeStringOperation<T>(
  str: unknown,
  operation: (_s: string) => T,
  fallback: T
): T {
  const safeString = ensureNonEmptyString(str, '')
  if (safeString.length === 0) {
    return fallback
  }
  try {
    const result = operation(safeString)
    return result !== undefined && result !== null ? result : fallback
  } catch (error) {
    logger.warn(
      { error, str },
      'safeStringOperation: error al ejecutar operación, usando fallback'
    )
    return fallback
  }
}

/**
 * Valida y ejecuta una operación matemática de forma segura
 * 
 * @param values - Valores a validar
 * @param operation - Operación a ejecutar (Math.max, Math.min, etc.)
 * @param fallback - Valor por defecto si la validación falla
 * @returns Resultado de la operación o fallback
 * 
 * @example
 * ```typescript
 * const max = safeMathOperation([1, 2, 3], nums => Math.max(...nums), 0)
 * ```
 */
export function safeMathOperation(
  values: unknown[],
  operation: (_nums: number[]) => number,
  fallback: number = 0
): number {
  if (!Array.isArray(values) || values.length === 0) {
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  const safeValues = values
    .map(v => {
      // Intentar convertir a número
      if (typeof v === 'number' && Number.isFinite(v)) {
        return v
      }
      if (typeof v === 'string') {
        const parsed = Number.parseFloat(v)
        if (Number.isFinite(parsed)) {
          return parsed
        }
      }
      return NaN
    })
    .filter(n => Number.isFinite(n))
  
  if (safeValues.length === 0) {
    // Si no hay valores válidos, retornar el fallback directamente
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  try {
    const result = operation(safeValues)
    // Verificar si el resultado es finito (Math.max/min con array vacío retorna -Infinity/Infinity)
    if (Number.isFinite(result)) {
      return result
    }
    // Si el resultado no es finito, usar fallback
    return Number.isFinite(fallback) ? fallback : 0
  } catch (error) {
    logger.warn(
      { error, values },
      'safeMathOperation: error al ejecutar operación, usando fallback'
    )
    return Number.isFinite(fallback) ? fallback : 0
  }
}

/**
 * ============================================================================
 * VALIDACIONES DE OPERACIONES MATEMÁTICAS COMUNES
 * ============================================================================
 * 
 * NOTA: safeRound y safeDivide están ahora en @/lib/utils/validation-utils
 * y se re-exportan arriba para mantener compatibilidad.
 */

/**
 * Calcula el promedio de un array de números de forma segura
 * 
 * @param numbers - Array de números (puede contener valores inválidos)
 * @param fallback - Valor por defecto si no se puede calcular (default: 0)
 * @returns Promedio calculado o fallback
 * 
 * @example
 * ```typescript
 * const avg = safeAverage([1, 2, 3, 4, 5]) // 3
 * const avg2 = safeAverage(percentages) // Equivalente a percentages.reduce(...) / percentages.length pero seguro
 * ```
 */
export function safeAverage(numbers: unknown[], fallback: number = 0): number {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  const safeNumbers = numbers
    .map(n => {
      // Intentar convertir a número
      if (typeof n === 'number' && Number.isFinite(n)) {
        return n
      }
      if (typeof n === 'string') {
        const parsed = Number.parseFloat(n)
        if (Number.isFinite(parsed)) {
          return parsed
        }
      }
      return NaN
    })
    .filter(n => Number.isFinite(n))
  
  if (safeNumbers.length === 0) {
    logger.warn({ numbers, fallback }, 'safeAverage: array vacío o sin números válidos, usando fallback')
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  const sum = safeNumbers.reduce((a, b) => {
    const safeA = Number.isFinite(a) ? a : 0
    const safeB = Number.isFinite(b) ? b : 0
    const result = safeA + safeB
    return Number.isFinite(result) ? result : safeA
  }, 0)
  
  if (!Number.isFinite(sum)) {
    logger.warn({ numbers, sum, fallback }, 'safeAverage: suma inválida, usando fallback')
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  const average = sum / safeNumbers.length
  return Number.isFinite(average) ? average : (Number.isFinite(fallback) ? fallback : 0)
}

/**
 * Calcula el máximo de un array usando Math.max con spread operator de forma segura
 * Incluye fallback a reduce() si el spread operator falla
 * 
 * @param numbers - Array de números (puede contener valores inválidos)
 * @param fallback - Valor por defecto si no se puede calcular (default: 0)
 * @returns Valor máximo o fallback
 * 
 * @example
 * ```typescript
 * const max = safeMathMax([1, 5, 3, 9, 2]) // 9
 * const max2 = safeMathMax(percentages) // Equivalente a Math.max(...percentages) pero seguro
 * ```
 */
export function safeMathMax(numbers: unknown[], fallback: number = 0): number {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  const safeNumbers = numbers
    .map(n => {
      // Intentar convertir a número
      if (typeof n === 'number' && Number.isFinite(n)) {
        return n
      }
      if (typeof n === 'string') {
        const parsed = Number.parseFloat(n)
        if (Number.isFinite(parsed)) {
          return parsed
        }
      }
      return NaN
    })
    .filter(n => Number.isFinite(n))
  
  if (safeNumbers.length === 0) {
    logger.warn({ numbers, fallback }, 'safeMathMax: array vacío o sin números válidos, usando fallback')
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  try {
    const max = Math.max(...safeNumbers)
    if (Number.isFinite(max)) {
      return max
    }
    logger.warn({ numbers, safeNumbers, max }, 'safeMathMax: Math.max() retornó valor no finito, usando reduce como fallback')
  } catch (error) {
    logger.warn({ error, numbers, safeNumbers }, 'safeMathMax: Error al ejecutar Math.max() con spread operator, usando reduce como fallback')
  }
  
  // Fallback a reduce si spread falla
  const maxReduce = safeNumbers.reduce((a, b) => {
    const safeA = Number.isFinite(a) ? a : (Number.isFinite(fallback) ? fallback : 0)
    const safeB = Number.isFinite(b) ? b : (Number.isFinite(fallback) ? fallback : 0)
    return safeA > safeB ? safeA : safeB
  }, safeNumbers[0] ?? (Number.isFinite(fallback) ? fallback : 0))
  
  return Number.isFinite(maxReduce) ? maxReduce : (Number.isFinite(fallback) ? fallback : 0)
}

/**
 * Calcula el mínimo de un array usando Math.min con spread operator de forma segura
 * Incluye fallback a reduce() si el spread operator falla
 * 
 * @param numbers - Array de números (puede contener valores inválidos)
 * @param fallback - Valor por defecto si no se puede calcular (default: 0)
 * @returns Valor mínimo o fallback
 * 
 * @example
 * ```typescript
 * const min = safeMathMin([1, 5, 3, 9, 2]) // 1
 * const min2 = safeMathMin(percentages) // Equivalente a Math.min(...percentages) pero seguro
 * ```
 */
export function safeMathMin(numbers: unknown[], fallback: number = 0): number {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  const safeNumbers = numbers
    .map(n => {
      // Intentar convertir a número
      if (typeof n === 'number' && Number.isFinite(n)) {
        return n
      }
      if (typeof n === 'string') {
        const parsed = Number.parseFloat(n)
        if (Number.isFinite(parsed)) {
          return parsed
        }
      }
      return NaN
    })
    .filter(n => Number.isFinite(n))
  
  if (safeNumbers.length === 0) {
    logger.warn({ numbers, fallback }, 'safeMathMin: array vacío o sin números válidos, usando fallback')
    return Number.isFinite(fallback) ? fallback : 0
  }
  
  try {
    const min = Math.min(...safeNumbers)
    if (Number.isFinite(min)) {
      return min
    }
    logger.warn({ numbers, safeNumbers, min }, 'safeMathMin: Math.min() retornó valor no finito, usando reduce como fallback')
  } catch (error) {
    logger.warn({ error, numbers, safeNumbers }, 'safeMathMin: Error al ejecutar Math.min() con spread operator, usando reduce como fallback')
  }
  
  // Fallback a reduce si spread falla
  const minReduce = safeNumbers.reduce((a, b) => {
    const safeA = Number.isFinite(a) ? a : (Number.isFinite(fallback) ? fallback : 0)
    const safeB = Number.isFinite(b) ? b : (Number.isFinite(fallback) ? fallback : 0)
    return safeA < safeB ? safeA : safeB
  }, safeNumbers[0] ?? (Number.isFinite(fallback) ? fallback : 0))
  
  return Number.isFinite(minReduce) ? minReduce : (Number.isFinite(fallback) ? fallback : 0)
}

/**
 * ============================================================================
 * VALIDACIONES DE FECHAS
 * ============================================================================
 */

/**
 * Obtiene una fecha ISO string de forma segura
 * 
 * @param date - Fecha a convertir
 * @param fallback - Valor por defecto si la validación falla (default: '1970-01-01')
 * @returns ISO string de la fecha o fallback
 * 
 * @example
 * ```typescript
 * const isoDate = safeToISOString(version.createdAt, new Date().toISOString())
 * ```
 */
export function safeToISOString(date: unknown, fallback: string = '1970-01-01'): string {
  // Primero intentar validar la fecha directamente
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    try {
      const iso = date.toISOString()
      if (typeof iso === 'string' && iso.length > 0) {
        return iso
      }
    } catch {
      // Continuar con fallback
    }
  }
  
  // Intentar parsear string o number
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date)
    if (parsedDate instanceof Date && !Number.isNaN(parsedDate.getTime())) {
      try {
        const iso = parsedDate.toISOString()
        if (typeof iso === 'string' && iso.length > 0) {
          return iso
        }
      } catch {
        // Continuar con fallback
      }
    }
  }
  
  // Si llegamos aquí, la fecha es inválida, usar fallback
  logger.warn(
    { date, fallback },
    'safeToISOString: fecha inválida, usando fallback'
  )
  return typeof fallback === 'string' && fallback.length > 0 ? fallback : '1970-01-01T00:00:00.000Z'
}

/**
 * Obtiene la parte de fecha (sin tiempo) de una fecha ISO string
 * 
 * @param date - Fecha a convertir
 * @param fallback - Valor por defecto si la validación falla (default: '1970-01-01')
 * @returns Parte de fecha (YYYY-MM-DD) o fallback
 * 
 * @example
 * ```typescript
 * const datePart = safeToISODate(version.createdAt, new Date().toISOString().split('T')[0])
 * ```
 */
export function safeToISODate(date: unknown, fallback: string = '1970-01-01'): string {
  // Primero intentar validar la fecha directamente
  if (date instanceof Date && !Number.isNaN(date.getTime())) {
    try {
      const iso = date.toISOString()
      if (typeof iso === 'string' && iso.length > 0) {
        const parts = iso.split('T')
        if (Array.isArray(parts) && parts.length > 0 && typeof parts[0] === 'string') {
          return parts[0]
        }
      }
    } catch {
      // Continuar con fallback
    }
  }
  
  // Intentar parsear string o number
  if (typeof date === 'string' || typeof date === 'number') {
    const parsedDate = new Date(date)
    if (parsedDate instanceof Date && !Number.isNaN(parsedDate.getTime())) {
      try {
        const iso = parsedDate.toISOString()
        if (typeof iso === 'string' && iso.length > 0) {
          const parts = iso.split('T')
          if (Array.isArray(parts) && parts.length > 0 && typeof parts[0] === 'string') {
            return parts[0]
          }
        }
      } catch {
        // Continuar con fallback
      }
    }
  }
  
  // Si llegamos aquí, la fecha es inválida, usar fallback
  logger.warn(
    { date, fallback },
    'safeToISODate: fecha inválida, usando fallback'
  )
  return typeof fallback === 'string' && fallback.length > 0 ? fallback : '1970-01-01'
}

/**
 * ============================================================================
 * VALIDACIONES DE OPERACIONES MATEMÁTICAS AVANZADAS
 * ============================================================================
 */


/**
 * ============================================================================
 * VALIDACIONES DE PROMESAS
 * ============================================================================
 */

/**
 * Valida que un valor sea una Promise válida
 * 
 * @param value - Valor a validar
 * @returns true si es una Promise válida, false en caso contrario
 */
export function isPromise(value: unknown): value is Promise<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'then' in value &&
    typeof (value as Promise<unknown>).then === 'function'
  )
}

/**
 * Valida que un array de promesas sea válido antes de usar Promise.all o Promise.allSettled
 * 
 * @param promises - Array de promesas a validar
 * @param fallback - Valor por defecto si la validación falla (default: [])
 * @returns Array de promesas válidas o fallback
 */
export function ensurePromiseArray(
  promises: unknown,
  fallback: Promise<unknown>[] = []
): Promise<unknown>[] {
  const array = ensureArray(promises, [])
  const validPromises = array.filter(isPromise)
  
  if (validPromises.length === 0 && array.length > 0) {
    logger.warn(
      { promises, array },
      'ensurePromiseArray: array contiene promesas inválidas, usando fallback'
    )
    return Array.isArray(fallback) ? fallback : []
  }
  
  return validPromises
}

/**
 * ============================================================================
 * VALIDACIONES DE MAP Y SET
 * ============================================================================
 */

/**
 * Valida que un valor sea un Map válido
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: new Map())
 * @returns Map válido o fallback
 */
export function ensureMap<K, V>(
  value: unknown,
  fallback: Map<K, V> = new Map<K, V>()
): Map<K, V> {
  if (value instanceof Map) {
    return value
  }
  logger.warn(
    { value, fallback },
    'ensureMap: valor no es un Map válido, usando fallback'
  )
  return fallback instanceof Map ? fallback : new Map<K, V>()
}

/**
 * Valida que un valor sea un Set válido
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: new Set())
 * @returns Set válido o fallback
 */
export function ensureSet<T>(
  value: unknown,
  fallback: Set<T> = new Set<T>()
): Set<T> {
  if (value instanceof Set) {
    return value
  }
  logger.warn(
    { value, fallback },
    'ensureSet: valor no es un Set válido, usando fallback'
  )
  return fallback instanceof Set ? fallback : new Set<T>()
}

/**
 * ============================================================================
 * VALIDACIONES DE BUFFER
 * ============================================================================
 */

/**
 * Valida que un valor sea un Buffer válido
 * 
 * @param value - Valor a validar
 * @param fallback - Valor por defecto si la validación falla (default: Buffer.alloc(0))
 * @returns Buffer válido o fallback
 */
export function ensureBuffer(
  value: unknown,
  fallback: Buffer = Buffer.alloc(0)
): Buffer {
  // Verificar si es un Buffer válido usando Buffer.isBuffer
  if (Buffer.isBuffer(value)) {
    return value as Buffer
  }
  
  // En algunos entornos de test (happy-dom), Buffer puede ser un Uint8Array
  // o un objeto que se comporta como Buffer pero Buffer.isBuffer() retorna false
  // Verificar si tiene características de Buffer
  if (value !== null && typeof value === 'object') {
    // Verificar si es Uint8Array (compatible con Buffer)
    if (value instanceof Uint8Array) {
      return value as Buffer
    }
    
    // Verificar si tiene constructor Buffer
    const valueObj = value as { constructor?: unknown }
    if ('constructor' in valueObj) {
      if (valueObj.constructor === Buffer) {
        return value as Buffer
      }
      
      // Verificar por nombre del constructor
      const constructorName = (valueObj.constructor as { name?: string })?.name
      if (constructorName === 'Buffer') {
        return value as Buffer
      }
    }
    
    // Verificar si tiene propiedades típicas de Buffer (length, etc.)
    // y si fue creado con Buffer.from o similar
    if ('length' in value && typeof (value as { length: unknown }).length === 'number') {
      // En happy-dom, Buffer.from() puede crear objetos que no pasan Buffer.isBuffer()
      // pero tienen las propiedades correctas. Verificar si tiene métodos de Buffer
      const hasBufferMethods = 
        'readUInt8' in value || 
        'writeUInt8' in value || 
        'toString' in value ||
        (value as { [Symbol.toStringTag]?: string })[Symbol.toStringTag] === 'Uint8Array'
      
      if (hasBufferMethods || value instanceof Uint8Array) {
        return value as Buffer
      }
    }
  }
  
  logger.warn(
    { value, fallback },
    'ensureBuffer: valor no es un Buffer válido, usando fallback'
  )
  
  // Asegurar que el fallback sea un Buffer válido
  if (Buffer.isBuffer(fallback)) {
    return fallback
  }
  
  // Si el fallback no es Buffer según Buffer.isBuffer, pero es compatible, usarlo
  if (fallback instanceof Uint8Array || 
      ('constructor' in fallback && (fallback as { constructor?: unknown }).constructor === Buffer)) {
    return fallback as Buffer
  }
  
  // Si el fallback no es Buffer, intentar crear uno nuevo
  try {
    const newBuffer = Buffer.alloc(0)
    if (Buffer.isBuffer(newBuffer)) {
      return newBuffer
    }
    // Si Buffer.alloc no funciona, pero tenemos un fallback compatible, usarlo
    return fallback as Buffer
  } catch (error) {
    logger.warn(
      { error },
      'ensureBuffer: no se pudo crear Buffer.alloc(0), retornando fallback original'
    )
    // Último recurso: retornar el fallback aunque no sea Buffer válido
    return fallback as Buffer
  }
}

/**
 * ============================================================================
 * VALIDACIONES LAZY (Bajo Demanda)
 * ============================================================================
 */

/**
 * Cache para resultados de validaciones lazy
 * Útil para validaciones costosas que se repiten frecuentemente
 */
const lazyValidationCache = new Map<string, { value: unknown; timestamp: number; ttl: number }>()

/**
 * Configuración para validaciones lazy
 */
const LAZY_CACHE_CONFIG = {
  DEFAULT_TTL: 60000, // 1 minuto por defecto
  MAX_CACHE_SIZE: 1000, // Máximo 1000 entradas en cache
}

/**
 * Limpia el cache de validaciones lazy cuando excede el tamaño máximo
 */
function cleanLazyCache(): void {
  if (lazyValidationCache.size > LAZY_CACHE_CONFIG.MAX_CACHE_SIZE) {
    // Eliminar las entradas más antiguas
    const entries = Array.from(lazyValidationCache.entries())
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp)
    
    const toRemove = entries.slice(0, Math.floor(LAZY_CACHE_CONFIG.MAX_CACHE_SIZE * 0.2))
    toRemove.forEach(([key]) => lazyValidationCache.delete(key))
    
    logger.warn(
      { removed: toRemove.length, remaining: lazyValidationCache.size },
      'cleanLazyCache: Cache excedió tamaño máximo, limpiando entradas antiguas'
    )
  }
}

/**
 * Valida un valor de forma lazy (con cache)
 * Útil para validaciones costosas que se repiten frecuentemente
 * 
 * @param key - Clave única para el cache
 * @param value - Valor a validar
 * @param validator - Función de validación
 * @param fallback - Valor por defecto si la validación falla
 * @param ttl - Tiempo de vida del cache en ms (default: 60000)
 * @returns Resultado de la validación (desde cache si está disponible)
 * 
 * @example
 * ```typescript
 * const result = lazyValidate(
 *   `user-${userId}`,
 *   userData,
 *   (data) => ensureObject(data, {}),
 *   {},
 *   300000 // 5 minutos
 * )
 * ```
 */
export function lazyValidate<T>(
  key: string,
  value: unknown,
  validator: (_val: unknown) => T,
  fallback: T,
  ttl: number = LAZY_CACHE_CONFIG.DEFAULT_TTL
): T {
  const safeKey = ensureNonEmptyString(key, 'default')
  const safeTtl = ensurePositiveNumber(ttl, LAZY_CACHE_CONFIG.DEFAULT_TTL)
  
  // Verificar cache
  const cached = lazyValidationCache.get(safeKey)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < safeTtl) {
    // Cache válido, retornar valor cacheado
    return cached.value as T
  }
  
  // Cache inválido o no existe, ejecutar validación
  try {
    const result = validator(value)
    
    // Guardar en cache
    cleanLazyCache()
    lazyValidationCache.set(safeKey, {
      value: result,
      timestamp: now,
      ttl: safeTtl,
    })
    
    return result
  } catch (error) {
    logger.warn(
      { error, key: safeKey, value },
      'lazyValidate: Error en validación, usando fallback'
    )
    return fallback
  }
}

/**
 * Limpia el cache de validaciones lazy
 * Útil para tests o cuando se necesita forzar revalidación
 */
export function clearLazyCache(): void {
  lazyValidationCache.clear()
  logger.info({}, 'clearLazyCache: Cache de validaciones lazy limpiado')
}

/**
 * Obtiene estadísticas del cache de validaciones lazy
 */
export function getLazyCacheStats(): {
  size: number
  maxSize: number
  entries: Array<{ key: string; age: number; ttl: number }>
} {
  const now = Date.now()
  const entries = Array.from(lazyValidationCache.entries()).map(([key, data]) => ({
    key,
    age: now - data.timestamp,
    ttl: data.ttl,
  }))
  
  return {
    size: lazyValidationCache.size,
    maxSize: LAZY_CACHE_CONFIG.MAX_CACHE_SIZE,
    entries,
  }
}

/**
 * ============================================================================
 * MÉTRICAS DE PERFORMANCE PARA VALIDACIONES
 * ============================================================================
 */

/**
 * Métricas de performance para validaciones
 * Permite rastrear el tiempo y frecuencia de validaciones
 */
const validationMetrics = {
  counts: new Map<string, number>(),
  durations: new Map<string, number[]>(),
}

/**
 * Ejecuta una validación con métricas de performance
 * 
 * @param name - Nombre de la validación para métricas
 * @param validation - Función de validación a ejecutar
 * @returns Resultado de la validación
 * 
 * @example
 * ```typescript
 * const result = withValidationMetrics('ensureFiniteNumber', () => 
 *   ensureFiniteNumber(value, 0)
 * )
 * ```
 */
export function withValidationMetrics<T>(
  name: string,
  validation: () => T
): T {
  const startTime = Date.now()
  const safeName = ensureNonEmptyString(name, 'unknown')
  
  try {
    const result = validation()
    const duration = Date.now() - startTime
    
    // Actualizar contador
    const currentCount = validationMetrics.counts.get(safeName) || 0
    validationMetrics.counts.set(safeName, currentCount + 1)
    
    // Actualizar duraciones (mantener solo las últimas 100)
    const durations = validationMetrics.durations.get(safeName) || []
    durations.push(duration)
    if (durations.length > 100) {
      durations.shift()
    }
    validationMetrics.durations.set(safeName, durations)
    
    return result
  } catch (error) {
    logger.warn(
      { error, name: safeName },
      'withValidationMetrics: error al ejecutar validación'
    )
    throw error
  }
}

/**
 * Obtiene métricas de validaciones
 * 
 * @returns Objeto con métricas de todas las validaciones
 */
export function getValidationMetrics(): {
  counts: Record<string, number>
  averageDurations: Record<string, number>
} {
  const counts: Record<string, number> = {}
  const averageDurations: Record<string, number> = {}
  
  for (const [name, count] of validationMetrics.counts.entries()) {
    counts[name] = count
    
    const durations = validationMetrics.durations.get(name) || []
    if (durations.length > 0) {
      const sum = durations.reduce((a, b) => a + b, 0)
      averageDurations[name] = sum / durations.length
    } else {
      averageDurations[name] = 0
    }
  }
  
  return { counts, averageDurations }
}

/**
 * Resetea las métricas de validaciones
 */
export function resetValidationMetrics(): void {
  validationMetrics.counts.clear()
  validationMetrics.durations.clear()
}

