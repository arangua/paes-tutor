/**
 * Taxonomía de Errores Enterprise
 * 
 * Regla Enterprise:
 * Un error no clasificado es deuda técnica activa.
 * 
 * Separación estricta:
 * - Errores de contrato (validación de input)
 * - Errores de dominio (lógica de negocio)
 * - Errores de sistema (infraestructura)
 */

import { NextResponse } from 'next/server'
import { ZodError } from 'zod'

/**
 * Base class para todos los errores del sistema
 * 
 * Características:
 * - Tipado (clase, no string)
 * - Categorizable
 * - Traducible a HTTP
 * - Observable
 */
export abstract class AppError extends Error {
  abstract readonly category: ErrorCategory
  abstract readonly httpStatus: number
  abstract readonly code: string

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>
  ) {
    super(message)
    this.name = this.constructor.name
    // Mantener stack trace limpio
    Error.captureStackTrace?.(this, this.constructor)
  }

  /**
   * Convierte el error a NextResponse para retornar al cliente
   * 
   * Reglas:
   * - No leaks de stack/implementación
   * - Mensaje seguro para cliente
   * - Código de error para debugging
   */
  abstract toResponse(): NextResponse

  /**
   * Convierte el error a formato de observabilidad
   * 
   * Incluye información completa para logging/monitoring
   */
  toObservable(): Record<string, unknown> {
    return {
      error: {
        name: this.name,
        code: this.code,
        category: this.category,
        message: this.message,
        httpStatus: this.httpStatus,
        context: this.context,
        stack: process.env.NODE_ENV === 'development' ? this.stack : undefined,
      },
    }
  }
}

/**
 * Categorías de errores
 */
export type ErrorCategory = 'contract' | 'domain' | 'system'

/**
 * Errores de Contrato (validación de input)
 * 
 * Características:
 * - Ocurren en el borde HTTP
 * - Antes de la lógica de dominio
 * - Siempre 400 Bad Request
 * - NO llegan al dominio
 */
export class ContractError extends AppError {
  readonly category: ErrorCategory = 'contract'
  readonly httpStatus = 400
  readonly code: string

  constructor(
    message: string,
    public readonly zodError?: ZodError,
    code: string = 'INVALID_CONTRACT',
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.code = code
  }

  toResponse(): NextResponse {
    return NextResponse.json(
      {
        error: 'Invalid request contract',
        code: this.code,
        details: this.zodError
          ? this.zodError.issues.map((e) => ({
              path: e.path.join('.'),
              message: e.message,
              code: e.code,
            }))
          : undefined,
      },
      { status: this.httpStatus }
    )
  }
}

/**
 * Errores de Dominio (lógica de negocio)
 * 
 * Características:
 * - Ocurren en la lógica de negocio
 * - Después de validación de contrato
 * - Códigos HTTP según tipo (400, 404, 409, etc.)
 * - Mensajes específicos del dominio
 */
export class DomainError extends AppError {
  readonly category: ErrorCategory = 'domain'
  readonly httpStatus: number
  readonly code: string

  constructor(
    message: string,
    httpStatus: number = 400,
    code: string = 'DOMAIN_ERROR',
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.httpStatus = httpStatus
    this.code = code
  }

  toResponse(): NextResponse {
    return NextResponse.json(
      {
        error: this.message,
        code: this.code,
      },
      { status: this.httpStatus }
    )
  }
}

/**
 * Errores de Sistema (infraestructura)
 * 
 * Características:
 * - Ocurren en infraestructura (DB, servicios externos, etc.)
 * - Siempre 500 Internal Server Error
 * - Mensajes genéricos al cliente (no leaks)
 * - Detalles completos en logs
 */
export class SystemError extends AppError {
  readonly category: ErrorCategory = 'system'
  readonly httpStatus = 500
  readonly code: string

  constructor(
    message: string,
    public readonly originalError?: Error,
    code: string = 'SYSTEM_ERROR',
    context?: Record<string, unknown>
  ) {
    super(message, context)
    this.code = code
  }

  toResponse(): NextResponse {
    // ⛔ No leak de detalles al cliente
    return NextResponse.json(
      {
        error: 'Internal server error',
        code: this.code,
      },
      { status: this.httpStatus }
    )
  }

  toObservable(): Record<string, unknown> {
    return {
      ...super.toObservable(),
      error: {
        ...super.toObservable().error,
        originalError: this.originalError
          ? {
              name: this.originalError.name,
              message: this.originalError.message,
              stack: this.originalError.stack,
            }
          : undefined,
      },
    }
  }
}

/**
 * Errores específicos de dominio (helpers)
 */

export class NotFoundError extends DomainError {
  constructor(
    resource: string,
    identifier?: string,
    context?: Record<string, unknown>
  ) {
    super(
      identifier
        ? `${resource} with id "${identifier}" not found`
        : `${resource} not found`,
      404,
      'NOT_FOUND',
      { resource, identifier, ...context }
    )
  }
}

export class ConflictError extends DomainError {
  constructor(
    message: string,
    context?: Record<string, unknown>
  ) {
    super(message, 409, 'CONFLICT', context)
  }
}

export class UnauthorizedError extends DomainError {
  constructor(
    message: string = 'Unauthorized',
    context?: Record<string, unknown>
  ) {
    super(message, 401, 'UNAUTHORIZED', context)
  }
}

export class ForbiddenError extends DomainError {
  constructor(
    message: string = 'Forbidden',
    context?: Record<string, unknown>
  ) {
    super(message, 403, 'FORBIDDEN', context)
  }
}
