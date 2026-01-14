import { NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { safeToISOString } from './validation-utils'

/**
 * Códigos de error más específicos para mejor debugging
 */
export type ErrorCode = 
  | 'PRISMA_UNIQUE_CONSTRAINT'
  | 'PRISMA_FOREIGN_KEY'
  | 'PRISMA_NOT_FOUND'
  | 'PRISMA_GENERIC'
  | 'VALIDATION_ZOD'
  | 'VALIDATION_CUSTOM'
  | 'JSON_PARSE'
  | 'DATABASE_TIMEOUT'
  | 'DATABASE_CONNECTION'
  | 'DATABASE_QUERY'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR'
  | 'CONTENT_TOO_LARGE'
  | 'PAYLOAD_TOO_LARGE'
  | 'RATE_LIMIT_EXCEEDED'

/**
 * Identifica el tipo de error y retorna información estructurada
 * Con códigos de error más específicos para mejor debugging
 */
export function identifyError(error: unknown): {
  type: 'prisma' | 'validation' | 'json' | 'database' | 'network' | 'unknown'
  code: ErrorCode
  message: string
  statusCode: number
  details?: unknown
} {
  if (!(error instanceof Error)) {
    return {
      type: 'unknown',
      code: 'UNKNOWN_ERROR',
      message: String(error || 'Unknown error'),
      statusCode: 500,
    }
  }

  // CORRECCIÓN: Validar que error.message no sea null/undefined antes de usar toLowerCase()
  const safeErrorMessage = error.message && typeof error.message === 'string'
    ? error.message
    : 'Unknown error'
  const errorMessage = safeErrorMessage.toLowerCase()

  // Errores de Prisma - usar instanceof para detección más robusta
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasPrismaError = error instanceof Prisma.PrismaClientKnownRequestError ||
    error instanceof Prisma.PrismaClientValidationError ||
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    (typeof errorMessage === 'string' && errorMessage.includes('prisma'))
  
  if (hasPrismaError) {
    // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
    const hasUniqueConstraint = typeof errorMessage === 'string' &&
      (errorMessage.includes('unique constraint') || errorMessage.includes('duplicate'))
    
    if (hasUniqueConstraint) {
      return {
        type: 'prisma',
        code: 'PRISMA_UNIQUE_CONSTRAINT',
        message: 'Ya existe un registro con estos datos',
        statusCode: 409,
        details: error.message,
      }
    }
    // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
    const hasForeignKeyError = typeof errorMessage === 'string' &&
      (errorMessage.includes('foreign key') || errorMessage.includes('constraint'))
    
    if (hasForeignKeyError) {
      return {
        type: 'prisma',
        code: 'PRISMA_FOREIGN_KEY',
        message: 'No se puede realizar la operación debido a restricciones de integridad',
        statusCode: 400,
        details: error.message,
      }
    }
    
    // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
    const hasNotFoundError = typeof errorMessage === 'string' &&
      (errorMessage.includes('record to update not found') || errorMessage.includes('not found'))
    
    if (hasNotFoundError) {
      return {
        type: 'prisma',
        code: 'PRISMA_NOT_FOUND',
        message: 'El recurso solicitado no existe',
        statusCode: 404,
        details: error.message,
      }
    }
    return {
      type: 'prisma',
      code: 'PRISMA_GENERIC',
      message: 'Error en la base de datos',
      statusCode: 500,
      details: error.message,
    }
  }

  // Errores de validación (Zod) - usar instanceof para detección más robusta
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasValidationError = error instanceof ZodError ||
    (typeof errorMessage === 'string' && errorMessage.includes('validation'))
  
  if (hasValidationError) {
    return {
      type: 'validation',
      code: 'VALIDATION_ZOD',
      message: 'Los datos proporcionados son inválidos',
      statusCode: 400,
      details: error.message,
    }
  }

  // Errores de parsing JSON
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasJsonError = typeof errorMessage === 'string' &&
    (errorMessage.includes('json') || errorMessage.includes('parse') || errorMessage.includes('unexpected token'))
  
  if (hasJsonError) {
    return {
      type: 'json',
      code: 'JSON_PARSE',
      message: 'El formato JSON de la solicitud es inválido',
      statusCode: 400,
      details: error.message,
    }
  }

  // Errores de tamaño de contenido
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasContentTooLargeError = typeof errorMessage === 'string' &&
    (errorMessage.includes('content too large') || errorMessage.includes('excede el tamaño'))
  
  if (hasContentTooLargeError) {
    return {
      type: 'validation',
      code: 'CONTENT_TOO_LARGE',
      message: error.message,
      statusCode: 413,
      details: error.message,
    }
  }

  // Errores de tamaño de payload
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasPayloadTooLargeError = typeof errorMessage === 'string' &&
    (errorMessage.includes('payload too large') || errorMessage.includes('payload excede'))
  
  if (hasPayloadTooLargeError) {
    return {
      type: 'validation',
      code: 'PAYLOAD_TOO_LARGE',
      message: error.message,
      statusCode: 413,
      details: error.message,
    }
  }

  // Errores de base de datos (timeout, connection, etc.)
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasTimeoutError = typeof errorMessage === 'string' && errorMessage.includes('timeout')
  
  if (hasTimeoutError) {
    return {
      type: 'database',
      code: 'DATABASE_TIMEOUT',
      message: 'La operación tardó demasiado',
      statusCode: 504,
      details: error.message,
    }
  }

  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasConnectionError = typeof errorMessage === 'string' &&
    (errorMessage.includes('connection') || errorMessage.includes('econnrefused'))
  
  if (hasConnectionError) {
    return {
      type: 'database',
      code: 'DATABASE_CONNECTION',
      message: 'Error de conexión con la base de datos',
      statusCode: 503,
      details: error.message,
    }
  }

  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasDatabaseError = typeof errorMessage === 'string' &&
    (errorMessage.includes('database') || errorMessage.includes('query'))
  
  if (hasDatabaseError) {
    return {
      type: 'database',
      code: 'DATABASE_QUERY',
      message: 'Error en la consulta a la base de datos',
      statusCode: 500,
      details: error.message,
    }
  }

  // Errores de red
  // CORRECCIÓN: Validar que errorMessage sea un string válido antes de usar includes()
  const hasNetworkError = typeof errorMessage === 'string' &&
    (errorMessage.includes('network') || errorMessage.includes('fetch'))
  
  if (hasNetworkError) {
    return {
      type: 'network',
      code: 'NETWORK_ERROR',
      message: 'Error de conexión de red',
      statusCode: 503,
      details: error.message,
    }
  }

  // Error desconocido
  return {
    type: 'unknown',
    code: 'UNKNOWN_ERROR',
    message: 'Ocurrió un error inesperado',
    statusCode: 500,
    details: error.message,
  }
}

/**
 * Tipos específicos de errores para mejor manejo
 */
export type ErrorType = 'prisma' | 'validation' | 'json' | 'database' | 'network' | 'unknown'

export interface ErrorInfo {
  type: ErrorType
  message: string
  statusCode: number
  details?: unknown
  isRetryable?: boolean
}

/**
 * Opciones para manejo de errores personalizado
 */
export interface HandleEndpointErrorOptions {
  /** Mensaje de error personalizado (sobrescribe el mensaje por defecto) */
  customMessage?: string
  /** Código de estado HTTP personalizado (opcional, solo si se proporciona) */
  customStatusCode?: number
}

/**
 * Maneja errores de endpoints de forma estandarizada
 * Con tipos más específicos y mejor logging
 * 
 * @param error - Error a manejar
 * @param context - Contexto del error (ej: 'GET', 'POST', 'export-diff')
 * @param options - Opciones para personalizar el manejo del error
 */
export function handleEndpointError(
  error: unknown, 
  context: string,
  options?: HandleEndpointErrorOptions
): NextResponse {
  // CORRECCIÓN: Validar que context sea un string válido
  const safeContext = typeof context === 'string' && context.length > 0
    ? context
    : 'unknown'
  
  const errorInfo = identifyError(error)
  const errorStack = error instanceof Error ? error.stack : undefined
  const errorName = error instanceof Error ? error.name : 'UnknownError'
  
  // Usar mensaje personalizado si se proporciona
  const finalMessage = options?.customMessage ?? errorInfo.message
  const finalStatusCode = options?.customStatusCode ?? errorInfo.statusCode
  
  // Determinar si el error es recuperable
  const isRetryable = errorInfo.type === 'database' || errorInfo.type === 'network'
  
  try {
    // DECISIÓN DE DISEÑO: Usa safeToISOString del sistema de validación centralizado
    // para obtener un timestamp ISO de forma segura
    const timestamp = safeToISOString(new Date())
    
    logger.error(
      {
        errorType: errorInfo.type,
        errorCode: errorInfo.code,
        errorName,
        error: finalMessage,
        originalError: errorInfo.message,
        details: errorInfo.details,
        stack: errorStack,
        context: `notes/versions/${safeContext}`,
        isRetryable,
        timestamp,
        customMessage: options?.customMessage,
      },
      `Error en ${safeContext}: ${errorInfo.type} [${errorInfo.code}]`
    )
  } catch (loggingError) {
    // Si falla el logging, continuar con el manejo del error
    logger.warn(
      { error: loggingError, originalError: error },
      'Error al loguear error de endpoint'
    )
  }

  // En producción, no exponer detalles sensibles
  const shouldExposeDetails = process.env.NODE_ENV === 'development'
  
  return NextResponse.json(
    { 
      error: finalMessage,
      code: errorInfo.code,
      ...(shouldExposeDetails && { 
        details: errorInfo.details,
        type: errorInfo.type,
        isRetryable,
      }),
    },
    { status: finalStatusCode }
  )
}

