// Logger compatible con Edge Runtime
// pino-pretty NO se importa en tiempo de módulo para evitar problemas con fs

// Definir tipos para el logger
interface LoggerInstance {
  info: (obj: Record<string, unknown>, msg?: string) => void
  error: (obj: Record<string, unknown>, msg?: string) => void
  debug: (obj: Record<string, unknown>, msg?: string) => void
  warn: (obj: Record<string, unknown>, msg?: string) => void
}

type LoggerProxy = LoggerInstance & {
  [key: string]: unknown
}

let loggerInstance: LoggerInstance | null = null

function getLogger(): LoggerInstance {
  if (loggerInstance) {
    return loggerInstance
  }

  // Detectar si estamos en el cliente (browser) o Edge Runtime
  const isBrowser = typeof window !== 'undefined'
  const isEdgeRuntime =
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge') ||
    (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis)

  if (isBrowser || isEdgeRuntime) {
    // Logger simple para Browser/Edge Runtime (sin pino)
    loggerInstance = {
      info: (obj: Record<string, unknown>, msg?: string) => {
        if (isBrowser) {
          console.warn('[INFO]', msg || '', obj)
        } else {
          console.warn(JSON.stringify({ level: 'info', ...obj, msg: msg || '' }))
        }
      },
      error: (obj: Record<string, unknown>, msg?: string) => {
        if (isBrowser) {
          console.error('[ERROR]', msg || '', obj)
        } else {
          console.error(JSON.stringify({ level: 'error', ...obj, msg: msg || '' }))
        }
      },
      debug: (obj: Record<string, unknown>, msg?: string) => {
        if (isBrowser) {
          console.warn('[DEBUG]', msg || '', obj)
        } else {
          console.warn(JSON.stringify({ level: 'debug', ...obj, msg: msg || '' }))
        }
      },
      warn: (obj: Record<string, unknown>, msg?: string) => {
        if (isBrowser) {
          console.warn('[WARN]', msg || '', obj)
        } else {
          console.warn(JSON.stringify({ level: 'warn', ...obj, msg: msg || '' }))
        }
      },
    }
    return loggerInstance
  }

  // Solo importar pino en Node.js runtime (no en browser ni edge)
  // Verificar que estamos en Node.js
  if (typeof process === 'undefined' || !process.versions?.node) {
    // Fallback a logger simple si no estamos en Node.js
    loggerInstance = {
      info: (obj: Record<string, unknown>, msg?: string) => {
        console.warn('[INFO]', msg || '', obj)
      },
      error: (obj: Record<string, unknown>, msg?: string) => {
        console.error('[ERROR]', msg || '', obj)
      },
      debug: (obj: Record<string, unknown>, msg?: string) => {
        console.warn('[DEBUG]', msg || '', obj)
      },
      warn: (obj: Record<string, unknown>, msg?: string) => {
        console.warn('[WARN]', msg || '', obj)
      },
    }
    return loggerInstance
  }

  // Solo importar pino en Node.js runtime
  // Nota: require() es necesario aquí porque pino no soporta dynamic import en tiempo de ejecución
  const pinoModule = require('pino') as { default?: typeof import('pino'); [key: string]: unknown }
  const pino = (pinoModule.default || pinoModule) as typeof import('pino')
  const isDevelopment = process.env.NODE_ENV === 'development'

  // Crear logger sin transport inicialmente
  loggerInstance = pino({
    level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
    base: {
      env: process.env.NODE_ENV || 'development',
      service: 'paes-tutor',
    },
  }) as LoggerInstance

  // Solo agregar pino-pretty en desarrollo y si está disponible
  if (isDevelopment) {
    try {
      // Cargar pino-pretty dinámicamente solo cuando se necesite (solo en desarrollo)
      // require() es necesario porque dynamic import no funciona en este contexto de inicialización
      // @ts-expect-error - pino-pretty es una dependencia opcional
      require('pino-pretty')
      loggerInstance = pino({
        level: 'debug',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
          },
        },
        base: {
          env: 'development',
          service: 'paes-tutor',
        },
      }) as LoggerInstance
    } catch {
      // Si pino-pretty no está disponible, usar logger básico
      // loggerInstance ya está configurado arriba
    }
  }

  return loggerInstance
}

export const logger = new Proxy({} as LoggerProxy, {
  get(_target, prop) {
    const instance = getLogger()
    return (instance as unknown as Record<string, unknown>)[prop as string]
  },
})

// Helpers para logging estructurado
export const logApiRequest = (method: string, path: string, userId?: string) => {
  logger.info(
    {
      type: 'api_request',
      method,
      path,
      userId,
    },
    `${method} ${path}`
  )
}

export const logApiError = (error: Error, context?: Record<string, unknown>) => {
  logger.error(
    {
      type: 'api_error',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
      ...context,
    },
    'API Error'
  )
}

export const logDatabaseQuery = (operation: string, model: string, duration?: number) => {
  logger.debug(
    {
      type: 'database_query',
      operation,
      model,
      duration,
    },
    `DB ${operation} ${model}`
  )
}

export const logAuthEvent = (event: string, userId?: string, success: boolean = true) => {
  logger.info(
    {
      type: 'auth_event',
      event,
      userId,
      success,
    },
    `Auth: ${event}`
  )
}
