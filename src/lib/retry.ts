/**
 * Retry Logic con Exponential Backoff
 * 
 * Implementa retry logic con exponential backoff para operaciones que pueden fallar
 * temporalmente (red, base de datos, servicios externos).
 */

import { logger } from './logger'

function cryptoRandomFloat(): number {
  const cryptoObj = globalThis.crypto
  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    // Fallback determinista: evita sonarjs/pseudo-random (no usar Math.random)
    return 0.5
  }
  const buf = new Uint32Array(1)
  cryptoObj.getRandomValues(buf)
  return buf[0] / 0xffffffff
}

export interface RetryOptions {
  /** Número máximo de intentos (incluyendo el primero) */
  maxAttempts?: number
  /** Tiempo inicial de espera en ms */
  initialDelay?: number
  /** Factor de multiplicación para el delay (exponential backoff) */
  backoffFactor?: number
  /** Tiempo máximo de espera entre intentos en ms */
  maxDelay?: number
  /** Función para determinar si un error es retryable */
  isRetryable?: (error: Error) => boolean
  /** Jitter aleatorio para evitar thundering herd */
  jitter?: boolean
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'isRetryable'>> & { isRetryable: (error: Error) => boolean } = {
  maxAttempts: 3,
  initialDelay: 100,
  backoffFactor: 2,
  maxDelay: 5000,
  jitter: true,
  isRetryable: (error: Error) => {
    // Por defecto, retry en errores de red o timeout
    const message = error.message.toLowerCase()
    return (
      message.includes('timeout') ||
      message.includes('network') ||
      message.includes('econnreset') ||
      message.includes('econnrefused') ||
      message.includes('etimedout')
    )
  },
}

/**
 * Calcular delay con exponential backoff y jitter opcional
 */
function calculateDelay(attempt: number, options: Required<Omit<RetryOptions, 'isRetryable'>> & { isRetryable: (error: Error) => boolean }): number {
  const exponentialDelay = options.initialDelay * Math.pow(options.backoffFactor, attempt - 1)
  const delay = Math.min(exponentialDelay, options.maxDelay)

  if (options.jitter) {
    // Agregar jitter aleatorio (±20%)
    const jitterAmount = delay * 0.2
    const jitter = (cryptoRandomFloat() * 2 - 1) * jitterAmount
    return Math.max(0, delay + jitter)
  }

  return delay
}

/**
 * Ejecutar una operación con retry logic
 * 
 * @param operation Función async que puede fallar
 * @param options Opciones de retry
 * @returns Resultado de la operación
 * @throws El último error si todos los intentos fallan
 * 
 * @example
 * ```typescript
 * const result = await retry(
 *   async () => await fetch('https://api.example.com/data'),
 *   { maxAttempts: 5, initialDelay: 200 }
 * )
 * ```
 */
export async function retry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options }
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
    try {
      const result = await operation()
      
      if (attempt > 1) {
        logger.info(
          { attempt, totalAttempts: config.maxAttempts },
          'Operation succeeded after retry'
        )
      }

      return result
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))

      // Verificar si el error es retryable
      if (!config.isRetryable(lastError)) {
        logger.warn(
          { attempt, error: lastError.message },
          'Error is not retryable, aborting'
        )
        throw lastError
      }

      // Si es el último intento, lanzar el error
      if (attempt === config.maxAttempts) {
        logger.error(
          { attempt, totalAttempts: config.maxAttempts, error: lastError.message },
          'All retry attempts exhausted'
        )
        throw lastError
      }

      // Calcular delay y esperar antes del siguiente intento
      const delay = calculateDelay(attempt, config)
      logger.warn(
        { attempt, totalAttempts: config.maxAttempts, delay, error: lastError.message },
        'Operation failed, retrying'
      )

      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  // Esto no debería ejecutarse, pero TypeScript lo requiere
  throw lastError || new Error('Retry failed for unknown reason')
}

/**
 * Wrapper para operaciones de base de datos con retry
 */
export async function retryDatabase<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return retry(operation, {
    maxAttempts: 3,
    initialDelay: 100,
    backoffFactor: 2,
    maxDelay: 2000,
    isRetryable: (error: Error) => {
      const message = error.message.toLowerCase()
      return (
        message.includes('timeout') ||
        message.includes('connection') ||
        message.includes('prisma') ||
        message.includes('database')
      )
    },
    ...options,
  })
}

/**
 * Wrapper para operaciones de red con retry
 */
export async function retryNetwork<T>(
  operation: () => Promise<T>,
  options?: RetryOptions
): Promise<T> {
  return retry(operation, {
    maxAttempts: 5,
    initialDelay: 200,
    backoffFactor: 2,
    maxDelay: 5000,
    isRetryable: (error: Error) => {
      const message = error.message.toLowerCase()
      return (
        message.includes('timeout') ||
        message.includes('network') ||
        message.includes('fetch') ||
        message.includes('econnreset') ||
        message.includes('econnrefused')
      )
    },
    ...options,
  })
}

