/**
 * Circuit Breaker para prevenir cascading failures
 * Implementa el patrón Circuit Breaker para operaciones externas
 */

import { logger } from '@/lib/logger'

/**
 * Estados del circuit breaker
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN'

/**
 * Configuración del circuit breaker
 */
export interface CircuitBreakerConfig {
  /** Número de fallos antes de abrir el circuito */
  failureThreshold: number
  /** Tiempo en ms antes de intentar cerrar el circuito */
  timeout: number
  /** Tiempo en ms para considerar un timeout */
  requestTimeout: number
}

/**
 * Estado interno del circuit breaker
 */
interface CircuitBreakerState {
  state: CircuitState
  failures: number
  lastFailureTime: number | null
  successes: number
}

/**
 * Circuit Breaker para operaciones externas
 */
export class CircuitBreaker {
  private state: CircuitBreakerState
  private config: CircuitBreakerConfig
  private name: string

  constructor(
    name: string,
    config: Partial<CircuitBreakerConfig> = {}
  ) {
    this.name = name
    this.config = {
      failureThreshold: config.failureThreshold ?? 5,
      timeout: config.timeout ?? 60000, // 1 minuto
      requestTimeout: config.requestTimeout ?? 10000, // 10 segundos
    }
    this.state = {
      state: 'CLOSED',
      failures: 0,
      lastFailureTime: null,
      successes: 0,
    }
  }

  /**
   * Ejecuta una operación protegida por el circuit breaker
   * CORRECCIÓN: Valida que operation sea una función y que Date.now() retorne un valor válido
   */
  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    // CORRECCIÓN: Validar que operation sea una función
    if (typeof operation !== 'function') {
      // CORRECCIÓN: Validar que this.name sea un string válido antes de usar en template string
      const safeName = typeof this.name === 'string' && this.name.length > 0 ? this.name : 'unknown'
      const errorMessage = `Circuit breaker ${safeName}: operation must be a function`
      // CORRECCIÓN: Validar que errorMessage sea un string válido antes de crear Error
      if (typeof errorMessage === 'string' && errorMessage.length > 0) {
        const error = new Error(errorMessage)
        logger.error(
          { circuitBreaker: safeName, operation },
          'Circuit breaker recibió operation inválido'
        )
        throw error
      } else {
        // Fallback si el mensaje es inválido
        const error = new Error('Circuit breaker: operation must be a function')
        logger.error(
          { circuitBreaker: safeName, operation },
          'Circuit breaker recibió operation inválido'
        )
        throw error
      }
    }
    
    // Verificar estado del circuito
    if (this.state.state === 'OPEN') {
      const currentTime = Date.now()
      // Validar que currentTime sea un número finito
      const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : Date.now()
      const lastFailureTime = this.state.lastFailureTime
      const safeLastFailureTime = Number.isFinite(lastFailureTime ?? 0) ? (lastFailureTime ?? 0) : 0
      const timeSinceLastFailure = safeCurrentTime - safeLastFailureTime
      
      // CORRECCIÓN: Validar que timeSinceLastFailure y this.config.timeout sean números finitos antes de comparar
      const safeTimeSinceLastFailure = Number.isFinite(timeSinceLastFailure) && timeSinceLastFailure >= 0 ? timeSinceLastFailure : 0
      const safeTimeout = Number.isFinite(this.config.timeout) && this.config.timeout > 0 ? this.config.timeout : 60000
      
      if (safeTimeSinceLastFailure >= safeTimeout) {
        // Intentar cerrar el circuito (HALF_OPEN)
        this.state.state = 'HALF_OPEN'
        this.state.successes = 0
        logger.info(
          { circuitBreaker: this.name, state: 'HALF_OPEN' },
          'Circuit breaker entrando en estado HALF_OPEN'
        )
      } else {
        // Circuito abierto, usar fallback o lanzar error
        logger.warn(
          {
            circuitBreaker: this.name,
            state: 'OPEN',
            timeSinceLastFailure,
          },
          'Circuit breaker está abierto, usando fallback'
        )
        
        // CORRECCIÓN: Validar que fallback sea una función antes de llamarla
        if (fallback && typeof fallback === 'function') {
          try {
            return await fallback()
          } catch (fallbackError) {
            logger.error(
              { error: fallbackError, circuitBreaker: this.name },
              'Circuit breaker: fallback falló, lanzando error original'
            )
            // CORRECCIÓN: Validar que this.name sea un string válido antes de usar en template string
            const safeName = typeof this.name === 'string' && this.name.length > 0 ? this.name : 'unknown'
            const errorMessage = `Circuit breaker ${safeName} is OPEN and fallback failed`
            // CORRECCIÓN: Validar que errorMessage sea un string válido antes de crear Error
            if (typeof errorMessage === 'string' && errorMessage.length > 0) {
              throw new Error(errorMessage)
            } else {
              throw new Error('Circuit breaker is OPEN and fallback failed')
            }
          }
        }
        
        // CORRECCIÓN: Validar que this.name sea un string válido antes de usar en template string
        const safeName = typeof this.name === 'string' && this.name.length > 0 ? this.name : 'unknown'
        const errorMessage = `Circuit breaker ${safeName} is OPEN`
        // CORRECCIÓN: Validar que errorMessage sea un string válido antes de crear Error
        if (typeof errorMessage === 'string' && errorMessage.length > 0) {
          throw new Error(errorMessage)
        } else {
          throw new Error('Circuit breaker is OPEN')
        }
      }
    }

    try {
      // CORRECCIÓN: Validar que requestTimeout sea un número válido antes de usar setTimeout
      const safeRequestTimeout = Number.isFinite(this.config.requestTimeout) && this.config.requestTimeout > 0
        ? this.config.requestTimeout
        : 10000
      
      // Ejecutar operación con timeout
      // CORRECCIÓN: Validar que operation() retorne una Promise válida antes de usar Promise.race()
      try {
        const operationPromise = operation()
        // Validar que operationPromise sea una Promise válida
        if (!operationPromise || typeof operationPromise.then !== 'function') {
          logger.error(
            { circuitBreaker: this.name, operationPromise },
            'Circuit breaker: operation() no retornó una Promise válida'
          )
          throw new Error('Operation did not return a valid Promise')
        }
        
        const result = await Promise.race([
          operationPromise,
          new Promise<never>((_, reject) =>
            setTimeout(
              () => {
                // CORRECCIÓN: Validar que el mensaje de error sea un string válido
                const timeoutError = new Error('Operation timeout')
                reject(timeoutError)
              },
              safeRequestTimeout
            )
          ),
        ])
        
        // Validar que result no sea undefined (aunque Promise.race puede retornar undefined en algunos casos)
        if (result === undefined) {
          logger.warn(
            { circuitBreaker: this.name },
            'Circuit breaker: Promise.race() retornó undefined'
          )
        }
        
        // Operación exitosa
        this.onSuccess()
        return result
      } catch (raceError) {
        // Si hay un error en la creación de las promesas, propagarlo
        this.onFailure()
        throw raceError
      }
    } catch (error) {
      // Operación falló
      this.onFailure()
      
      // Si hay fallback, usarlo
      // CORRECCIÓN: Validar que fallback sea una función antes de llamarla
      if (fallback && typeof fallback === 'function') {
        try {
          logger.warn(
            { circuitBreaker: this.name, error },
            'Operación falló, usando fallback'
          )
          const fallbackResult = await fallback()
          // Validar que fallbackResult no sea undefined
          if (fallbackResult === undefined) {
            logger.warn(
              { circuitBreaker: this.name },
              'Circuit breaker: fallback() retornó undefined'
            )
          }
          return fallbackResult
        } catch (fallbackError) {
          logger.error(
            { error: fallbackError, circuitBreaker: this.name, originalError: error },
            'Circuit breaker: fallback falló, lanzando error original'
          )
          throw error // Lanzar el error original, no el del fallback
        }
      } else if (fallback) {
        logger.warn(
          { circuitBreaker: this.name, fallback, error },
          'Circuit breaker: fallback no es una función, lanzando error'
        )
      }
      
      throw error
    }
  }

  /**
   * Maneja un éxito
   */
  private onSuccess(): void {
    if (this.state.state === 'HALF_OPEN') {
      this.state.successes++
      
      // Si tenemos suficientes éxitos, cerrar el circuito
      if (this.state.successes >= 2) {
        this.state.state = 'CLOSED'
        this.state.failures = 0
        this.state.successes = 0
        logger.info(
          { circuitBreaker: this.name },
          'Circuit breaker cerrado después de éxitos'
        )
      }
    } else {
      // Resetear contador de fallos en CLOSED
      this.state.failures = 0
    }
  }

  /**
   * Maneja un fallo
   * CORRECCIÓN: Valida que Date.now() retorne un valor válido
   */
  private onFailure(): void {
    this.state.failures++
    const currentTime = Date.now()
    // Validar que currentTime sea un número finito
    this.state.lastFailureTime = Number.isFinite(currentTime) ? currentTime : Date.now()

    if (this.state.state === 'HALF_OPEN') {
      // Si falla en HALF_OPEN, volver a abrir
      this.state.state = 'OPEN'
      logger.warn(
        { circuitBreaker: this.name, failures: this.state.failures },
        'Circuit breaker abierto después de fallo en HALF_OPEN'
      )
    } else if (this.state.failures >= this.config.failureThreshold) {
      // Abrir el circuito
      this.state.state = 'OPEN'
      logger.error(
        {
          circuitBreaker: this.name,
          failures: this.state.failures,
          threshold: this.config.failureThreshold,
        },
        'Circuit breaker abierto por exceso de fallos'
      )
    }
  }

  /**
   * Obtiene el estado actual
   */
  getState(): CircuitState {
    return this.state.state
  }

  /**
   * Resetea el circuit breaker (útil para tests)
   */
  reset(): void {
    this.state = {
      state: 'CLOSED',
      failures: 0,
      lastFailureTime: null,
      successes: 0,
    }
  }
}

/**
 * Circuit breakers compartidos para diferentes operaciones
 */
export const circuitBreakers = {
  webhook: new CircuitBreaker('webhook', {
    failureThreshold: 5,
    timeout: 60000,
    requestTimeout: 10000,
  }),
  database: new CircuitBreaker('database', {
    failureThreshold: 10,
    timeout: 30000,
    requestTimeout: 5000,
  }),
  cache: new CircuitBreaker('cache', {
    failureThreshold: 10,
    timeout: 30000,
    requestTimeout: 2000,
  }),
}

