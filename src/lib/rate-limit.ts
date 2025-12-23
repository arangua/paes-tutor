// Constantes de rate limiting
const MAX_RATE_LIMIT_ENTRIES = 10000 // Limitar tamaño del store
const GENERAL_RATE_LIMIT_COUNT = 10
const GENERAL_RATE_LIMIT_WINDOW_MS = 10000 // 10 segundos
const AUTH_RATE_LIMIT_COUNT = 5
const AUTH_RATE_LIMIT_WINDOW_MS = 60000 // 1 minuto
const READ_RATE_LIMIT_COUNT = 30
const READ_RATE_LIMIT_WINDOW_MS = 10000 // 10 segundos
const WRITE_RATE_LIMIT_COUNT = 3
const WRITE_RATE_LIMIT_WINDOW_MS = 300000 // 5 minutos

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

// Rate limiters específicos por endpoint
export const apiRateLimit = {
  // Rate limit general para APIs
  general: async (identifier: string) => {
    if (isProduction && hasUpstash) {
      const upstash = await loadUpstash()
      if (upstash) {
        const redis = new upstash.Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        const limiter = new upstash.Ratelimit({
          redis,
          limiter: upstash.Ratelimit.slidingWindow(10, '10 s'),
          analytics: true,
        })
        return await limiter.limit(identifier)
      }
    }
    // Fallback a memoria
    return await memoryRateLimiter.limit(identifier, GENERAL_RATE_LIMIT_COUNT, GENERAL_RATE_LIMIT_WINDOW_MS)
  },

  // Rate limit más estricto para autenticación
  auth: async (identifier: string) => {
    if (isProduction && hasUpstash) {
      const upstash = await loadUpstash()
      if (upstash) {
        const redis = new upstash.Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        const authLimiter = new upstash.Ratelimit({
          redis,
          limiter: upstash.Ratelimit.slidingWindow(5, '1 m'),
          analytics: true,
        })
        return await authLimiter.limit(identifier)
      }
    }
    // Fallback a memoria
    return await memoryRateLimiter.limit(identifier, 5, 60000)
  },

  // Rate limit para operaciones de escritura (POST, PUT, DELETE)
  write: async (identifier: string) => {
    if (isProduction && hasUpstash) {
      const upstash = await loadUpstash()
      if (upstash) {
        const redis = new upstash.Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        const writeLimiter = new upstash.Ratelimit({
          redis,
          limiter: upstash.Ratelimit.slidingWindow(20, '1 m'),
          analytics: true,
        })
        return await writeLimiter.limit(identifier)
      }
    }
    // Fallback a memoria
    return await memoryRateLimiter.limit(identifier, 20, 60000)
  },

  // Rate limit para operaciones de lectura (GET)
  read: async (identifier: string) => {
    if (isProduction && hasUpstash) {
      const upstash = await loadUpstash()
      if (upstash) {
        const redis = new upstash.Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        const readLimiter = new upstash.Ratelimit({
          redis,
          limiter: upstash.Ratelimit.slidingWindow(READ_RATE_LIMIT_COUNT, '10 s'),
          analytics: true,
        })
        return await readLimiter.limit(identifier)
      }
    }
    // Fallback a memoria
    return await memoryRateLimiter.limit(identifier, READ_RATE_LIMIT_COUNT, READ_RATE_LIMIT_WINDOW_MS)
  },

  // Rate limit estricto para endpoints sensibles (cambio de contraseña, etc.)
  sensitive: async (identifier: string) => {
    if (isProduction && hasUpstash) {
      const upstash = await loadUpstash()
      if (upstash) {
        const redis = new upstash.Redis({
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!,
        })
        const sensitiveLimiter = new upstash.Ratelimit({
          redis,
          limiter: upstash.Ratelimit.slidingWindow(WRITE_RATE_LIMIT_COUNT, '5 m'),
          analytics: true,
        })
        return await sensitiveLimiter.limit(identifier)
      }
    }
    // Fallback a memoria
    return await memoryRateLimiter.limit(identifier, WRITE_RATE_LIMIT_COUNT, WRITE_RATE_LIMIT_WINDOW_MS)
  },
}
