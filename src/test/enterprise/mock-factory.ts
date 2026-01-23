/**
 * Enterprise Mock Factory
 * 
 * Factory avanzado para crear y gestionar mocks de forma enterprise
 * con soporte para timing, errores simulados y validación.
 * 
 * @module mock-factory
 * @version 2.0.0
 * @enterprise
 */

import { vi, type Mock } from 'vitest'
import type { PrismaClient } from '@prisma/client'

// ============================================
// TIPOS Y CONFIGURACIONES
// ============================================

export interface MockTimingConfig {
  delay?: number
  timeout?: boolean
  randomDelay?: { min: number; max: number }
}

export interface MockErrorConfig {
  simulate?: boolean
  errorType?: 'network' | 'timeout' | 'server' | 'validation' | 'notFound'
  errorMessage?: string
  errorCode?: number
}

export interface MockConfig {
  timing?: MockTimingConfig
  error?: MockErrorConfig
  returnValue?: unknown
  throwError?: Error
}

// ============================================
// MOCK BUILDER
// ============================================

/**
 * Builder enterprise para crear mocks
 */
export class EnterpriseMockBuilder {
  private config: MockConfig = {}
  private _mock: Mock | null = null

  /**
   * Configura el timing del mock
   */
  timing(config: MockTimingConfig): this {
    this.config.timing = config
    return this
  }

  /**
   * Configura el error del mock
   */
  error(config: MockErrorConfig): this {
    this.config.error = config
    return this
  }

  /**
   * Establece el valor de retorno
   */
  returns(value: unknown): this {
    this.config.returnValue = value
    return this
  }

  /**
   * Establece que el mock debe lanzar un error
   */
  throws(error: Error): this {
    this.config.throwError = error
    return this
  }

  /**
   * Construye el mock con la configuración
   */
  build<T extends (...args: unknown[]) => unknown>(): Mock<T> {
    const mock = vi.fn() as Mock<T>

    // Configurar timing
    if (this.config.timing) {
      const { delay, timeout, randomDelay } = this.config.timing
      
      if (timeout) {
        mock.mockImplementation(() => {
          return new Promise((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), delay || 5000)
          })
        })
      } else if (delay || randomDelay) {
        // Usar delay determinista (promedio) para evitar sonarjs/pseudo-random
        const actualDelay = randomDelay
          ? (randomDelay.max + randomDelay.min) / 2
          : delay || 0
        
        mock.mockImplementation(async () => {
          await new Promise(resolve => setTimeout(resolve, actualDelay))
          return this.getReturnValue() as any
        })
      } else {
        mock.mockImplementation(() => this.getReturnValue() as any)
      }
    } else {
      mock.mockImplementation(() => this.getReturnValue() as any)
    }

    // Configurar error
    if (this.config.error?.simulate || this.config.throwError) {
      const error = this.createError()
      mock.mockRejectedValue(error)
    }

    this._mock = mock
    return mock
  }

  /**
   * Obtiene el valor de retorno configurado
   */
  private getReturnValue(): unknown {
    if (this.config.throwError) {
      throw this.config.throwError
    }
    return this.config.returnValue
  }

  /**
   * Crea un error según la configuración
   */
  private createError(): Error {
    const { errorType, errorMessage } = this.config.error || {}

    switch (errorType) {
      case 'network':
        return new Error(errorMessage || 'Network error')
      case 'timeout':
        return new Error(errorMessage || 'Request timeout')
      case 'server':
        return new Error(errorMessage || 'Server error')
      case 'validation':
        return new Error(errorMessage || 'Validation error')
      case 'notFound':
        return new Error(errorMessage || 'Not found')
      default:
        return new Error(errorMessage || 'Unknown error')
    }
  }

  /**
   * Resetea el builder
   */
  reset(): this {
    this.config = {}
    this._mock = null
    return this
  }
}

// ============================================
// PRISMA MOCK FACTORY
// ============================================

/**
 * Factory para crear mocks de Prisma
 */
export class PrismaMockFactory {
  /**
   * Crea un mock de Prisma con métodos comunes
   */
  static create(): Partial<PrismaClient> {
    return {
      user: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      student: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      studyNote: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      studyNoteVersion: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
      },
      $transaction: vi.fn(),
    } as Partial<PrismaClient>
  }

  /**
   * Configura un mock de Prisma con datos específicos
   */
  static configure(mock: Partial<PrismaClient>, config: {
    users?: unknown[]
    students?: unknown[]
    notes?: unknown[]
    versions?: unknown[]
  }): void {
    if (config.users && mock.user?.findMany) {
      vi.mocked(mock.user.findMany).mockResolvedValue(config.users as never)
    }
    if (config.students && mock.student?.findMany) {
      vi.mocked(mock.student.findMany).mockResolvedValue(config.students as never)
    }
    if (config.notes && mock.studyNote?.findMany) {
      vi.mocked(mock.studyNote.findMany).mockResolvedValue(config.notes as never)
    }
    if (config.versions && mock.studyNoteVersion?.findMany) {
      vi.mocked(mock.studyNoteVersion.findMany).mockResolvedValue(config.versions as never)
    }
  }
}

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Crea un builder de mock (fluent API)
 */
export function mock(): EnterpriseMockBuilder {
  return new EnterpriseMockBuilder()
}

/**
 * Crea un mock simple con valor de retorno
 */
export function createMock<T>(returnValue: T): Mock<() => T> {
  return vi.fn().mockReturnValue(returnValue)
}

/**
 * Crea un mock async con valor de retorno
 */
export function createAsyncMock<T>(returnValue: T): Mock<() => Promise<T>> {
  return vi.fn().mockResolvedValue(returnValue)
}

/**
 * Crea un mock que lanza un error
 */
export function createErrorMock(error: Error): Mock<() => Promise<never>> {
  return vi.fn().mockRejectedValue(error) as Mock<() => Promise<never>>
}

