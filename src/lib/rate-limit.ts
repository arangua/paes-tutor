import {
  TIME_CONSTANTS,
  LIMIT_CONSTANTS,
  RATE_LIMIT_CONSTANTS,
} from './constants'

// Constantes de rate limiting
const MAX_RATE_LIMIT_ENTRIES = LIMIT_CONSTANTS.MAX_RATE_LIMIT_ENTRIES
// En desarrollo, límites más permisivos
const isDev = process.env.NODE_ENV !== 'production'
const GENERAL_RATE_LIMIT_COUNT = isDev
  ? RATE_LIMIT_CONSTANTS.GENERAL_COUNT_DEV
  : RATE_LIMIT_CONSTANTS.GENERAL_COUNT_PROD
const GENERAL_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.GENERAL_RATE_LIMIT_WINDOW_MS
const AUTH_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.AUTH_COUNT
const AUTH_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.AUTH_RATE_LIMIT_WINDOW_MS
const READ_RATE_LIMIT_COUNT = isDev
  ? RATE_LIMIT_CONSTANTS.READ_COUNT_DEV
  : RATE_LIMIT_CONSTANTS.READ_COUNT_PROD
const READ_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.READ_RATE_LIMIT_WINDOW_MS
const WRITE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.WRITE_COUNT
const WRITE_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.WRITE_RATE_LIMIT_WINDOW_MS
const SENSITIVE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.SENSITIVE_COUNT
const SENSITIVE_RATE_LIMIT_WINDOW_MS =
  TIME_CONSTANTS.SENSITIVE_RATE_LIMIT_WINDOW_MS
const CHALLENGE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.CHALLENGE_COUNT
const CHALLENGE_RATE_LIMIT_WINDOW_MS =
  TIME_CONSTANTS.CHALLENGE_RATE_LIMIT_WINDOW_MS
const EXPENSIVE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.EXPENSIVE_COUNT
const EXPENSIVE_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.EXPENSIVE_RATE_LIMIT_WINDOW_MS

// Rate limiter en memoria para desarrollo
class MemoryRateLimit {
  private store: Map<string, { count: number; resetAt: number }> = new Map()
  private readonly MAX_ENTRIES = MAX_RATE_LIMIT_ENTRIES

  async limit(identifier: string, limit: number, window: number) {
    // Limpiar entradas expiradas periódicamente
    if (this.store.size > this.MAX_ENTRIES) {
      this.cleanup()
    }

    const now = Date.now()
    const key = identifier
    const record = this.store.get(key)

    if (!record || record.resetAt < now) {
      this.store.set(key, { count: 1, resetAt: now + window })
      return { success: true, limit, remaining: limit - 1, reset: now + window }
    }

    if (record.count >= limit) {
      return { success: false, limit, remaining: 0, reset: record.resetAt }
    }

    record.count++
    this.store.set(key, record)
    return { success: true, limit, remaining: limit - record.count, reset: record.resetAt }
  }

  private cleanup() {
    const now = Date.now()
    const keysToDelete: string[] = []
    this.store.forEach((record, key) => {
      if (now > record.resetAt) {
        keysToDelete.push(key)
      }
    })
    keysToDelete.forEach(key => this.store.delete(key))
  }
}

// Lazy loading de Upstash para evitar importar en tiempo de módulo
type RatelimitType = typeof import('@upstash/ratelimit').Ratelimit
type RedisType = typeof import('@upstash/redis').Redis

let upstashRatelimit: RatelimitType | null = null
let upstashRedis: RedisType | null = null

async function loadUpstash(): Promise<{ Ratelimit: RatelimitType; Redis: RedisType } | null> {
  if (upstashRatelimit && upstashRedis) {
    return { Ratelimit: upstashRatelimit, Redis: upstashRedis }
  }

  try {
    // Solo importar en Node.js runtime
    const isEdgeRuntime =
      (typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge') ||
      (typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis)

    if (isEdgeRuntime) {
      throw new Error('Upstash no disponible en Edge Runtime')
    }

    const { Ratelimit } = await import('@upstash/ratelimit')
    const { Redis } = await import('@upstash/redis')

    upstashRatelimit = Ratelimit
    upstashRedis = Redis

    return { Ratelimit, Redis }
  } catch {
    // Si falla, retornar null para usar memoria
    return null
  }
}

// Configurar rate limiter según el entorno
const isProduction = process.env.NODE_ENV === 'production'
const hasUpstash = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

// Rate limiter en memoria (siempre disponible)
const memoryRateLimiter = new MemoryRateLimit()

/**
 * Crea un rate limiter de Upstash con la configuración especificada
 * @param upstash - Módulos de Upstash cargados
 * @param count - Número de requests permitidos
 * @param window - Ventana de tiempo (ej: '10 s', '1 m', '5 m')
 * @returns Rate limiter configurado o null si falla
 */
function createUpstashLimiter(
  upstash: { Ratelimit: RatelimitType; Redis: RedisType },
  count: number,
  window: string
) {
  try {
    const redis = new upstash.Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
    return new upstash.Ratelimit({
      redis,
      limiter: upstash.Ratelimit.slidingWindow(count, window as any),
      analytics: true,
    })
  } catch {
    return null
  }
}

/**
 * Helper para crear rate limiters con fallback a memoria
 * @param identifier - Identificador único (IP o userId)
 * @param count - Número de requests permitidos
 * @param windowMs - Ventana de tiempo en milisegundos
 * @param windowString - Ventana de tiempo como string para Upstash (ej: '10 s')
 * @returns Resultado del rate limiting
 */
async function rateLimitWithFallback(
  identifier: string,
  count: number,
  windowMs: number,
  windowString: string
) {
  if (isProduction && hasUpstash) {
    const upstash = await loadUpstash()
    if (upstash) {
      const limiter = createUpstashLimiter(upstash, count, windowString)
      if (limiter) {
        return await limiter.limit(identifier)
      }
    }
  }
  // Fallback a memoria
  return await memoryRateLimiter.limit(identifier, count, windowMs)
}

// Rate limiters específicos por endpoint
export const apiRateLimit = {
  // Rate limit general para APIs
  general: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      GENERAL_RATE_LIMIT_COUNT,
      GENERAL_RATE_LIMIT_WINDOW_MS,
      '10 s'
    )
  },

  // Rate limit más estricto para autenticación
  auth: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      AUTH_RATE_LIMIT_COUNT,
      AUTH_RATE_LIMIT_WINDOW_MS,
      '1 m'
    )
  },

  // Rate limit para operaciones de escritura (POST, PUT, DELETE)
  write: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      WRITE_RATE_LIMIT_COUNT,
      WRITE_RATE_LIMIT_WINDOW_MS,
      '1 m'
    )
  },

  // Rate limit para operaciones de lectura (GET)
  read: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      READ_RATE_LIMIT_COUNT,
      READ_RATE_LIMIT_WINDOW_MS,
      '10 s'
    )
  },

  // Rate limit estricto para endpoints sensibles (cambio de contraseña, etc.)
  sensitive: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      SENSITIVE_RATE_LIMIT_COUNT,
      SENSITIVE_RATE_LIMIT_WINDOW_MS,
      '5 m'
    )
  },

  // Rate limit específico para crear desafíos (más estricto para evitar spam)
  challenge: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      CHALLENGE_RATE_LIMIT_COUNT,
      CHALLENGE_RATE_LIMIT_WINDOW_MS,
      '1 h'
    )
  },

  // Rate limit para operaciones costosas (comprimir, exportar en lote, etc.)
  expensive: async (identifier: string) => {
    return rateLimitWithFallback(
      identifier,
      EXPENSIVE_RATE_LIMIT_COUNT,
      EXPENSIVE_RATE_LIMIT_WINDOW_MS,
      '10 m'
    )
  },
}
