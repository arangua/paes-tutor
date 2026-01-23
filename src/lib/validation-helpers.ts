/**
 * Helpers de validación reutilizables para frontend y backend
 */

import { isValidCuid, isValidEmail, isValidLength, sanitizeAndValidate } from './security'

/**
 * Valida un ID de tipo CUID desde parámetros de URL
 * @param id - ID a validar
 * @returns true si es válido, false si no
 */
export function validateIdParam(id: string | string[] | undefined): id is string {
  if (!id || Array.isArray(id)) {
    return false
  }
  return isValidCuid(id)
}

/**
 * Valida y sanitiza un email
 * @param email - Email a validar
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validateEmail(email: string | null | undefined): {
  isValid: boolean
  sanitized: string
  error?: string
} {
  if (!email) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Email es requerido',
    }
  }

  const sanitized = email.trim().toLowerCase()

  if (!isValidEmail(sanitized)) {
    return {
      isValid: false,
      sanitized,
      error: 'Email inválido',
    }
  }

  return {
    isValid: true,
    sanitized,
  }
}

/**
 * Valida y sanitiza una contraseña
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima (default: 8)
 * @param maxLength - Longitud máxima (default: 128)
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validatePassword(
  password: string | null | undefined,
  minLength: number = 8,
  maxLength: number = 128
): {
  isValid: boolean
  sanitized: string
  error?: string
} {
  if (!password) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Contraseña es requerida',
    }
  }

  if (!isValidLength(password, minLength, maxLength)) {
    return {
      isValid: false,
      sanitized: password,
      error: `La contraseña debe tener entre ${minLength} y ${maxLength} caracteres`,
    }
  }

  // Validar que tenga al menos una letra y un número
  const hasLetter = /[a-zA-Z]/.test(password)
  const hasNumber = /\d/.test(password)

  if (!hasLetter || !hasNumber) {
    return {
      isValid: false,
      sanitized: password,
      error: 'La contraseña debe contener al menos una letra y un número',
    }
  }

  return {
    isValid: true,
    sanitized: password,
  }
}

/**
 * Valida una URL
 * @param url - URL a validar
 * @param allowedProtocols - Protocolos permitidos (default: ['http', 'https'])
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validateUrl(
  url: string | null | undefined,
  allowedProtocols: string[] = ['http', 'https']
): {
  isValid: boolean
  sanitized: string
  error?: string
} {
  if (!url) {
    return {
      isValid: false,
      sanitized: '',
      error: 'URL es requerida',
    }
  }

  const sanitized = url.trim()

  try {
    const urlObj = new URL(sanitized)
    const protocol = urlObj.protocol.replace(':', '')

    if (!allowedProtocols.includes(protocol)) {
      return {
        isValid: false,
        sanitized,
        error: `Protocolo no permitido. Solo se permiten: ${allowedProtocols.join(', ')}`,
      }
    }

    // Validar que no sea localhost en producción (si es necesario)
    // Solo validar en servidor (process.env no está disponible en cliente)
    if (
      typeof process !== 'undefined' &&
      process.env.NODE_ENV === 'production' &&
      urlObj.hostname === 'localhost'
    ) {
      return {
        isValid: false,
        sanitized,
        error: 'URLs de localhost no están permitidas en producción',
      }
    }

    return {
      isValid: true,
      sanitized,
    }
  } catch {
    return {
      isValid: false,
      sanitized,
      error: 'URL inválida',
    }
  }
}

/**
 * Valida un archivo
 * @param file - Archivo a validar
 * @param options - Opciones de validación
 * @returns Objeto con isValid y error opcional
 */
export function validateFile(
  file: File | null | undefined,
  options: {
    maxSize?: number // en bytes
    allowedTypes?: string[]
    allowedExtensions?: string[]
  } = {}
): {
  isValid: boolean
  error?: string
} {
  if (!file) {
    return {
      isValid: false,
      error: 'Archivo es requerido',
    }
  }

  const { maxSize = 10 * 1024 * 1024, allowedTypes = [], allowedExtensions = [] } = options

  // Validar tamaño
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2)
    return {
      isValid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB} MB`,
    }
  }

  // Validar tipo MIME
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(', ')}`,
    }
  }

  // Validar extensión
  if (allowedExtensions.length > 0) {
    const fileName = file.name.toLowerCase()
    const hasValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext.toLowerCase()))

    if (!hasValidExtension) {
      return {
        isValid: false,
        error: `Extensión no permitida. Extensiones permitidas: ${allowedExtensions.join(', ')}`,
      }
    }
  }

  return {
    isValid: true,
  }
}

/**
 * Valida un año
 * @param year - Año a validar (string o number)
 * @param minYear - Año mínimo (default: 2000)
 * @param maxYear - Año máximo (default: 2100)
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validateYear(
  year: string | number | null | undefined,
  minYear: number = 2000,
  maxYear: number = 2100
): {
  isValid: boolean
  sanitized: number | null
  error?: string
} {
  if (year === null || year === undefined) {
    return {
      isValid: false,
      sanitized: null,
      error: 'Año es requerido',
    }
  }

  const yearNum = typeof year === 'string' ? Number.parseInt(year, 10) : year

  if (Number.isNaN(yearNum)) {
    return {
      isValid: false,
      sanitized: null,
      error: 'Año debe ser un número',
    }
  }

  if (yearNum < minYear || yearNum > maxYear) {
    return {
      isValid: false,
      sanitized: yearNum,
      error: `Año debe estar entre ${minYear} y ${maxYear}`,
    }
  }

  return {
    isValid: true,
    sanitized: yearNum,
  }
}

/**
 * Valida un string genérico con opciones
 * @param input - String a validar
 * @param options - Opciones de validación
 * @returns Resultado de sanitizeAndValidate
 */
export function validateString(
  input: string | null | undefined,
  options: {
    minLength?: number
    maxLength?: number
    allowEmpty?: boolean
    checkDangerous?: boolean
    required?: boolean
  } = {}
): {
  isValid: boolean
  sanitized: string
  error?: string
} {
  const { required = false, ...restOptions } = options

  if (required && !input) {
    return {
      isValid: false,
      sanitized: '',
      error: 'Campo requerido',
    }
  }

  return sanitizeAndValidate(input, restOptions)
}
