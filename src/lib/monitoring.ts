/**
 * Sistema de monitoreo de errores
 * Preparado para integración con Sentry, Datadog, o servicios similares
 * Compatible con cliente y servidor
 */

// Logger solo disponible en servidor (Node.js)
// Usamos una función helper para cargar el logger solo cuando sea necesario
// Esta función solo se ejecuta en el servidor (Next.js lo detecta por typeof window)
function getLogger() {
  // Solo intentar cargar logger en servidor
  if (typeof window !== 'undefined') {
    return null
  }
  
  // Esta parte solo se ejecuta en servidor, Next.js no la empaquetará para el cliente
  // gracias a la verificación de typeof window arriba
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    // @ts-expect-error - logger solo disponible en servidor
    const loggerModule = require('./logger')
    return loggerModule.logger
  } catch {
    // Logger no disponible, retornar null para usar console como fallback
    return null
  }
}

interface ErrorContext {
  userId?: string
  path?: string
  userAgent?: string
  timestamp?: string
  [key: string]: unknown
}

class MonitoringService {
  private enabled: boolean
  private service: 'sentry' | 'console' | 'none'

  constructor() {
    // Determinar qué servicio usar basado en variables de entorno
    this.enabled = process.env.NODE_ENV === 'production'
    this.service = (process.env.MONITORING_SERVICE as 'sentry' | 'console' | 'none') || 'console'
  }

  /**
   * Captura y reporta un error
   */
  captureError(error: Error, context?: ErrorContext): void {
    if (!this.enabled && this.service === 'none') return

    const errorContext: ErrorContext = {
      ...context,
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      name: error.name,
    }

    const serverLogger = getLogger()
    
    switch (this.service) {
      case 'sentry':
        // Integración con Sentry (requiere @sentry/nextjs)
        // if (typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.captureException(error, { contexts: { custom: errorContext } })
        // }
        if (serverLogger) {
          serverLogger.error(
            { type: 'monitoring', service: 'sentry', ...errorContext },
            'Error capturado por Sentry'
          )
        } else {
          // Fallback: usar console (funciona en cliente y servidor)
          console.error('[Sentry] Error capturado:', error, errorContext)
        }
        break

      case 'console':
      default:
        if (serverLogger) {
          serverLogger.error(
            { type: 'monitoring', service: 'console', ...errorContext },
            'Error capturado por Monitoring'
          )
        } else {
          // Fallback: usar console (funciona en cliente y servidor)
          console.error('[Monitoring] Error capturado:', error, errorContext)
        }
        break
    }
  }

  /**
   * Captura un mensaje de advertencia
   */
  captureWarning(message: string, context?: ErrorContext): void {
    if (!this.enabled && this.service === 'none') return

    const warningContext: ErrorContext = {
      ...context,
      timestamp: new Date().toISOString(),
      message,
    }

    const serverLogger = getLogger()
    
    switch (this.service) {
      case 'sentry':
        // if (typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.captureMessage(message, 'warning', { contexts: { custom: warningContext } })
        // }
        if (serverLogger) {
          serverLogger.warn(
            { type: 'monitoring', service: 'sentry', ...warningContext },
            message
          )
        } else {
          console.warn('[Sentry] Warning:', message, warningContext)
        }
        break

      case 'console':
      default:
        if (serverLogger) {
          serverLogger.warn(
            { type: 'monitoring', service: 'console', ...warningContext },
            message
          )
        } else {
          console.warn('[Monitoring] Warning:', message, warningContext)
        }
        break
    }
  }

  /**
   * Captura un evento personalizado
   */
  captureEvent(eventName: string, data?: Record<string, unknown>): void {
    if (!this.enabled && this.service === 'none') return

    const eventData = {
      ...data,
      eventName,
      timestamp: new Date().toISOString(),
    }

    const serverLogger = getLogger()
    
    switch (this.service) {
      case 'sentry':
        // if (typeof window !== 'undefined' && window.Sentry) {
        //   window.Sentry.addBreadcrumb({ message: eventName, data: eventData, level: 'info' })
        // }
        if (serverLogger) {
          serverLogger.info(
            { type: 'monitoring', service: 'sentry', event: eventName, ...eventData },
            `Evento capturado: ${eventName}`
          )
        } else {
          console.log('[Sentry] Event:', eventName, eventData)
        }
        break

      case 'console':
      default:
        if (serverLogger) {
          serverLogger.info(
            { type: 'monitoring', service: 'console', event: eventName, ...eventData },
            `Evento capturado: ${eventName}`
          )
        } else {
          console.log('[Monitoring] Event:', eventName, eventData)
        }
        break
    }
  }

  /**
   * Configura el contexto del usuario para todos los eventos
   */
  setUserContext(userId: string, userData?: Record<string, unknown>): void {
    // if (this.service === 'sentry' && typeof window !== 'undefined' && window.Sentry) {
    //   window.Sentry.setUser({ id: userId, ...userData })
    // }
    const serverLogger = getLogger()
    if (serverLogger) {
      serverLogger.info(
        { type: 'monitoring', event: 'user_context_set', userId, ...userData },
        'Contexto de usuario configurado'
      )
    } else {
      console.log('[Monitoring] User context set:', userId, userData)
    }
  }
}

// Singleton instance
export const monitoring = new MonitoringService()

/**
 * Helper para capturar errores de forma consistente
 */
export function captureError(error: Error | unknown, context?: ErrorContext): void {
  if (error instanceof Error) {
    monitoring.captureError(error, context)
  } else {
    monitoring.captureError(new Error(String(error)), context)
  }
}

/**
 * Helper para capturar errores de API
 */
export function captureApiError(error: Error | unknown, path: string, userId?: string): void {
  captureError(error, {
    type: 'api_error',
    path,
    userId,
  })
}
