/**
 * Configuración centralizada para el endpoint de versiones
 * Facilita el mantenimiento y ajuste de parámetros
 * 
 * @example
 * ```typescript
 * // Usar configuración de timeouts
 * import { TRANSACTION_TIMEOUTS } from './config'
 * 
 * const timeout = TRANSACTION_TIMEOUTS.RESTORE // 10000ms
 * 
 * // Usar umbrales de performance
 * import { PERFORMANCE_THRESHOLDS } from './config'
 * 
 * if (duration > PERFORMANCE_THRESHOLDS.CRITICAL) {
 *   // Manejar operación lenta
 * }
 * 
 * // Habilitar validación estricta en desarrollo
 * // En .env.local o variables de entorno:
 * STRICT_RESPONSE_VALIDATION=true
 * ```
 */

/**
 * Timeouts para operaciones de base de datos (en milisegundos)
 */
export const TRANSACTION_TIMEOUTS = {
  /** Timeout para transacciones de restauración (10 segundos) */
  RESTORE: 10000,
  /** Timeout para transacciones de actualización (5 segundos) */
  UPDATE: 5000,
  /** Timeout para transacciones de eliminación (8 segundos) */
  DELETE: 8000,
  /** Timeout para queries de lectura (3 segundos) */
  QUERY: 3000,
} as const

/**
 * Umbrales de performance para alertas (en milisegundos)
 */
export const PERFORMANCE_THRESHOLDS = {
  /** Alerta si una operación tarda más de este tiempo */
  WARNING: 2000,
  /** Alerta crítica si una operación tarda más de este tiempo */
  CRITICAL: 5000,
  /** Alerta si la autenticación tarda más de este tiempo */
  AUTH_WARNING: 500,
  /** Alerta si una query tarda más de este tiempo */
  QUERY_WARNING: 1000,
  /** Alerta si una métrica personalizada tarda más de este tiempo */
  CUSTOM_METRIC_WARNING: 1000,
} as const

/**
 * Configuración de reintentos para webhooks
 */
export const WEBHOOK_RETRY_CONFIG = {
  /** Número máximo de reintentos */
  MAX_ATTEMPTS: 5,
  /** Tiempo base para backoff exponencial (en milisegundos) */
  BASE_DELAY: 60000, // 1 minuto
  /** Tiempo máximo entre reintentos (en milisegundos) */
  MAX_DELAY: 3600000, // 1 hora
} as const

/**
 * Configuración de caché
 */
export const CACHE_CONFIG = {
  /** TTL del caché de versiones (en milisegundos) */
  VERSIONS_TTL: 5 * 60 * 1000, // 5 minutos
  /** Tiempo de gracia para invalidación (en milisegundos) */
  INVALIDATION_GRACE_PERIOD: 1000, // 1 segundo
  /** Tiempo máximo de caché en segundos para respuestas HTTP */
  MAX_AGE_SECONDS: 300, // 5 minutos
} as const

/**
 * Configuración de límites de tamaño
 */
export const SIZE_LIMITS = {
  /** Tamaño máximo de contenido de versión (en bytes) */
  MAX_CONTENT_SIZE: 10 * 1024 * 1024, // 10 MB
  /** Tamaño máximo de payload de request (en bytes) */
  MAX_PAYLOAD_SIZE: 11 * 1024 * 1024, // 11 MB (ligeramente mayor que contenido)
  /** Tamaño máximo de título (en caracteres) */
  MAX_TITLE_LENGTH: 200,
  /** Tamaño máximo de nombre de versión (en caracteres) */
  MAX_VERSION_NAME_LENGTH: 100,
} as const

/**
 * Obtiene el límite de requests según el entorno
 */
function getRateLimit(productionLimit: number, developmentLimit: number): number {
  return process.env.NODE_ENV === 'production' ? productionLimit : developmentLimit
}

/**
 * Configuración de rate limiting por operación
 */
export const RATE_LIMIT_CONFIG = {
  /** Rate limit para GET (lectura) - más permisivo */
  GET: {
    windowMs: 10 * 1000, // 10 segundos
    maxRequests: getRateLimit(30, 200),
  },
  /** Rate limit para POST (restaurar) - más restrictivo */
  POST: {
    windowMs: 60 * 1000, // 1 minuto
    maxRequests: getRateLimit(10, 50),
  },
  /** Rate limit para PATCH (actualizar) - moderado */
  PATCH: {
    windowMs: 30 * 1000, // 30 segundos
    maxRequests: getRateLimit(20, 100),
  },
  /** Rate limit para DELETE - moderado */
  DELETE: {
    windowMs: 30 * 1000, // 30 segundos
    maxRequests: getRateLimit(15, 80),
  },
} as const

/**
 * Configuración de validación de restauraciones duplicadas
 * 
 * @example
 * ```typescript
 * import { RESTORE_VALIDATION } from './config'
 * 
 * // Verificar si una restauración es duplicada
 * const recentRestore = await prisma.versionRestoreHistory.findFirst({
 *   where: {
 *     restoredAt: {
 *       gte: new Date(Date.now() - RESTORE_VALIDATION.DUPLICATE_RESTORE_WINDOW_MS)
 *     }
 *   }
 * })
 * ```
 */
export const RESTORE_VALIDATION = {
  /** Ventana de tiempo para considerar una restauración como duplicada (en milisegundos) */
  DUPLICATE_RESTORE_WINDOW_MS: 5 * 60 * 1000, // 5 minutos
} as const

/**
 * Configuración de validación de respuestas
 * 
 * @example
 * ```typescript
 * import { RESPONSE_VALIDATION } from './config'
 * 
 * // Validar respuesta
 * const validation = validateResponse(schema, data)
 * if (!validation.valid && RESPONSE_VALIDATION.STRICT_IN_DEVELOPMENT) {
 *   throw new Error('Respuesta no válida')
 * }
 * 
 * // Para habilitar validación estricta, agregar a .env.local:
 * // STRICT_RESPONSE_VALIDATION=true
 * ```
 */
export const RESPONSE_VALIDATION = {
  /** Si es true, lanza error en desarrollo cuando la respuesta no cumple el schema */
  STRICT_IN_DEVELOPMENT: process.env.STRICT_RESPONSE_VALIDATION === 'true',
} as const

/**
 * Configuración de streaming de respuestas
 */
export const STREAMING_CONFIG = {
  /** Número mínimo de versiones para activar streaming */
  THRESHOLD: 100,
} as const

/**
 * Configuración de cálculos y formatos
 */
export const CALCULATION_CONFIG = {
  /** Milisegundos en un día (para cálculos de días desde actualización) */
  MS_PER_DAY: 1000 * 60 * 60 * 24,
  /** Precisión decimal para días desde actualización (1 decimal) */
  DAYS_PRECISION: 10,
} as const

/**
 * Configuración de reintentos para operaciones en background
 */
export const BACKGROUND_OPERATION_CONFIG = {
  /** Número máximo de reintentos para operaciones en background */
  MAX_RETRIES: 3,
  /** Tiempo base para backoff exponencial (en milisegundos) */
  BASE_DELAY_MS: 1000, // 1 segundo
  /** Factor de multiplicación para backoff exponencial */
  BACKOFF_MULTIPLIER: 2,
  /** Tiempo máximo entre reintentos (en milisegundos) */
  MAX_DELAY_MS: 10000, // 10 segundos
} as const

/**
 * Configuración de métricas de caché
 */
export const CACHE_METRICS_CONFIG = {
  /** Habilitar tracking de métricas de caché */
  ENABLED: true,
  /** Tamaño de ventana para calcular hit rate (en número de requests) */
  HIT_RATE_WINDOW: 100,
} as const

/**
 * Configuración de respuestas HTTP
 */
export const RESPONSE_CONFIG = {
  /** Configuración para respuestas de escritura (POST, PATCH, DELETE) */
  WRITE_RESPONSE: {
    /** No cachear respuestas de escritura */
    maxAge: 0,
    /** Comprimir respuestas de escritura */
    compress: true,
  },
  /** Configuración para respuestas de lectura (GET) */
  READ_RESPONSE: {
    /** Cachear respuestas de lectura */
    maxAge: CACHE_CONFIG.MAX_AGE_SECONDS,
    /** No comprimir por defecto (se hace automáticamente si es necesario) */
    compress: false,
  },
} as const

