/**
 * Utilidades de seguridad para sanitización y validación
 */

import { logger } from './logger'
import { LIMIT_CONSTANTS } from './constants'

// Constantes de seguridad
const MAX_STRING_LENGTH = LIMIT_CONSTANTS.MAX_STRING_LENGTH

/**
 * Sanitiza un string para prevenir XSS
 * Elimina caracteres peligrosos y normaliza el texto
 */
export function sanitizeString(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') {
    return ''
  }

  // Normalizar espacios en blanco
  let sanitized = input.trim()

  // Eliminar caracteres de control (excepto \n, \r, \t)
  // eslint-disable-next-line no-control-regex
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')

  // Limitar longitud máxima (prevenir DoS)
  if (sanitized.length > MAX_STRING_LENGTH) {
    // Solo loguear en servidor (evitar problemas con pino-pretty en cliente)
    if (typeof window === 'undefined') {
      logger.warn(
        {
          type: 'security',
          event: 'string_truncated',
          originalLength: input.length,
          truncatedLength: MAX_STRING_LENGTH,
        },
        'String truncado por exceder MAX_STRING_LENGTH. Puede causar pérdida de datos.'
      )
    }
    sanitized = sanitized.substring(0, MAX_STRING_LENGTH)
  }

  return sanitized
}

/**
 * Sanitiza un objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj }

  for (const key in sanitized) {
    // eslint-disable-next-line security/detect-object-injection
    if (typeof sanitized[key] === 'string') { // key controlled by iterating over object properties
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = sanitizeString(sanitized[key] as string) as T[Extract<keyof T, string>] // key controlled by loop
    } else if (
      // eslint-disable-next-line security/detect-object-injection
      typeof sanitized[key] === 'object' && // key controlled by loop
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] !== null && // key controlled by loop
      // eslint-disable-next-line security/detect-object-injection
      !Array.isArray(sanitized[key]) // key controlled by loop
    ) {
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = sanitizeObject(sanitized[key] as Record<string, unknown>) as T[Extract<
        keyof T,
        string
      >] // key controlled by loop
    } else if (
      // eslint-disable-next-line security/detect-object-injection
      Array.isArray(sanitized[key]) // key controlled by loop
    ) {
      // eslint-disable-next-line security/detect-object-injection
      sanitized[key] = (sanitized[key] as unknown[]).map(item => { // key controlled by loop
        if (typeof item === 'string') {
          return sanitizeString(item)
        } else if (typeof item === 'object' && item !== null) {
          return sanitizeObject(item as Record<string, unknown>)
        }
        return item
      }) as T[Extract<keyof T, string>]
    }
  }

  return sanitized
}

/**
 * Valida que un string no contenga patrones peligrosos
 */
export function containsDangerousPatterns(input: string): boolean {
  if (!input || typeof input !== 'string') {
    return false
  }

  // Patrones peligrosos comunes
  const dangerousPatterns = [
    /<script[\s\S]*?>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // Event handlers como onclick=
    /<iframe[\s\S]*?>/gi,
    /<object[\s\S]*?>/gi,
    /<embed[\s\S]*?>/gi,
    /data:text\/html/gi,
    /vbscript:/gi,
    /expression\s*\(/gi, // CSS expressions
  ]

  return dangerousPatterns.some(pattern => pattern.test(input))
}

/**
 * Valida formato de ID cuid
 */
export function isValidCuid(id: string | null | undefined): boolean {
  if (!id || typeof id !== 'string') {
    return false
  }
  // Formato cuid: c + 24 caracteres alfanuméricos
  return /^c[a-z0-9]{24}$/.test(id)
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') {
    return false
  }
  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 255
}

/**
 * Valida que un string tenga una longitud razonable
 */
export function isValidLength(
  input: string | null | undefined,
  min: number = 0,
  max: number = 1000
): boolean {
  if (input === null || input === undefined || typeof input !== 'string') {
    return false
  }
  // Permitir string vacío si min es 0
  return input.length >= min && input.length <= max
}

/**
 * Sanitiza y valida un string de entrada
 */
export function sanitizeAndValidate(
  input: string | null | undefined,
  options: {
    minLength?: number
    maxLength?: number
    allowEmpty?: boolean
    checkDangerous?: boolean
  } = {}
): { isValid: boolean; sanitized: string; error?: string } {
  const { minLength = 0, maxLength = 1000, allowEmpty = false, checkDangerous = true } = options

  // Validar que sea string
  if (input === null || input === undefined) {
    return {
      isValid: allowEmpty,
      sanitized: '',
      error: allowEmpty ? undefined : 'Campo requerido',
    }
  }

  if (typeof input !== 'string') {
    return {
      isValid: false,
      sanitized: '',
      error: 'Tipo de dato inválido',
    }
  }

  // Sanitizar
  const sanitized = sanitizeString(input)

  // Validar longitud
  if (!isValidLength(sanitized, minLength, maxLength)) {
    return {
      isValid: false,
      sanitized,
      error: `Longitud debe estar entre ${minLength} y ${maxLength} caracteres`,
    }
  }

  // Validar que no esté vacío (si no se permite)
  if (!allowEmpty && sanitized.length === 0) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Campo no puede estar vacío',
    }
  }

  // Verificar patrones peligrosos
  if (checkDangerous && containsDangerousPatterns(sanitized)) {
    return {
      isValid: false,
      sanitized,
      error: 'Contenido no permitido detectado',
    }
  }

  return {
    isValid: true,
    sanitized,
  }
}
