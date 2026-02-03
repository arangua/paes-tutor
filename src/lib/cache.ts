// Sistema de caché con soporte para memoria (desarrollo) y Redis (producción)
// Usa Upstash Redis cuando está disponible

import { TIME_CONSTANTS } from './constants'

// Constantes de tiempo de caché
const DEFAULT_CACHE_TTL_MS = TIME_CONSTANTS.DEFAULT_CACHE_TTL_MS
const CACHE_CLEANUP_INTERVAL_MS = TIME_CONSTANTS.CACHE_CLEANUP_INTERVAL_MS

interface CacheEntry<T> {
  data: T
  expiresAt: number
}

interface CacheAdapter {
  get<T>(key: string): Promise<T | null>
  set<T>(key: string, data: T, ttl?: number): Promise<void>
  delete(key: string): Promise<void>
  clear(): Promise<void>
}

class MemoryCacheAdapter implements CacheAdapter {
  private store: Map<string, CacheEntry<unknown>> = new Map()
  private defaultTTL: number = DEFAULT_CACHE_TTL_MS

  async get<T>(key: string): Promise<T | null> {
    const entry = this.store.get(key)

    if (!entry) {
      return null
    }

    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return null
    }

    return entry.data as T
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const expiresAt = Date.now() + (ttl || this.defaultTTL)
    this.store.set(key, { data, expiresAt })
  }

  async delete(key: string): Promise<void> {
    this.store.delete(key)
  }

  async clear(): Promise<void> {
    this.store.clear()
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.store.entries()) {
      if (now > entry.expiresAt) {
        this.store.delete(key)
      }
    }
  }
}

// Redis adapter usando Upstash Redis
class RedisCacheAdapter implements CacheAdapter {
  private client: Awaited<ReturnType<typeof import('@upstash/redis').Redis>>

  constructor(client: Awaited<ReturnType<typeof import('@upstash/redis').Redis>>) {
    this.client = client
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key)
      if (!data) return null
      return data as T
    } catch (error) {
      console.error('Error al obtener del caché Redis:', error)
      return null
    }
  }

  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, Math.floor(ttl / 1000), data)
      } else {
        await this.client.set(key, data)
      }
    } catch (error) {
      console.error('Error al guardar en caché Redis:', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key)
    } catch (error) {
      console.error('Error al eliminar del caché Redis:', error)
    }
  }

  async clear(): Promise<void> {
    // Upstash Redis no tiene flushdb en el plan gratuito
    // En su lugar, usamos un patrón de prefijo para invalidar
    console.warn('Redis clear() no está disponible en Upstash. Use invalidateCachePattern en su lugar.')
  }
}

// Seleccionar adapter basado en configuración
async function getCacheAdapter(): Promise<CacheAdapter> {
  // Si UPSTASH_REDIS_REST_URL y UPSTASH_REDIS_REST_TOKEN están configurados, usar Redis
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (redisUrl && redisToken) {
    try {
      const { Redis } = await import('@upstash/redis')
      const redis = new Redis({
        url: redisUrl,
        token: redisToken,
      })
      return new RedisCacheAdapter(redis)
    } catch (error) {
      console.error('Error al inicializar Redis, usando caché en memoria:', error)
      return new MemoryCacheAdapter()
    }
  }

  // Por defecto, usar memoria
  return new MemoryCacheAdapter()
}

// Inicializar caché de forma lazy
let cachePromise: Promise<CacheAdapter> | null = null
let cacheInstance: CacheAdapter | null = null

async function getCacheInstance(): Promise<CacheAdapter> {
  if (cacheInstance) {
    return cacheInstance
  }
  if (!cachePromise) {
    cachePromise = getCacheAdapter().then(adapter => {
      cacheInstance = adapter
      // Si es memoria, configurar cleanup periódico
      if (adapter instanceof MemoryCacheAdapter) {
        setupMemoryCacheCleanup(adapter)
      }
      return adapter
    })
  }
  return cachePromise
}

let memoryCacheCleanupInterval: NodeJS.Timeout | null = null

export function teardownMemoryCacheCleanup() {
  if (memoryCacheCleanupInterval) {
    clearInterval(memoryCacheCleanupInterval)
    memoryCacheCleanupInterval = null
  }
}

function setupMemoryCacheCleanup(cache: MemoryCacheAdapter) {
  // En tests/CI NO instalamos intervalos (dejan handles abiertos y cuelgan Vitest)
  if (process.env.NODE_ENV === 'test' || process.env.CI === 'true') return

  // Limpiar caché cada 10 minutos (solo en Node.js runtime)
  if (
    typeof setInterval !== 'undefined' &&
    typeof process !== 'undefined' &&
    process.env.NEXT_RUNTIME !== 'edge'
  ) {
    // Idempotente: evitar múltiples intervalos si se llama varias veces
    if (!memoryCacheCleanupInterval) {
      memoryCacheCleanupInterval = setInterval(() => {
        cache.cleanup()
      }, CACHE_CLEANUP_INTERVAL_MS)
    }

    // Limpiar en caso de que el proceso termine
    if (typeof process !== 'undefined' && process.on) {
      process.on('SIGTERM', () => {
        teardownMemoryCacheCleanup()
      })
      process.on('SIGINT', () => {
        teardownMemoryCacheCleanup()
      })
    }
  }
}

// Helpers para caché de queries
export const cacheKeys = {
  student: (studentId: string) => `student:${studentId}`,
  studentAttempts: (studentId: string, limit: number, offset: number) =>
    `student:${studentId}:attempts:${limit}:${offset}`,
  studentMetrics: (studentId: string, subjectId?: string, topicId?: string) =>
    `student:${studentId}:metrics:${subjectId || 'all'}:${topicId || 'all'}`,
  studentRecommendations: (studentId: string) => `student:${studentId}:recommendations`,
  studentAnalytics: (studentId: string) => `student:${studentId}:analytics`,
  exams: (subjectId?: string, tipo?: string, limit?: number, offset?: number) =>
    `exams:${subjectId || 'all'}:${tipo || 'all'}:${limit || 20}:${offset || 0}`,
  exam: (examId: string) => `exam:${examId}`,
  materials: (
    subjectId?: string,
    topicId?: string,
    tipo?: string,
    limit?: number,
    offset?: number
  ) =>
    `materials:${subjectId || 'all'}:${topicId || 'all'}:${tipo || 'all'}:${limit || 20}:${offset || 0}`,
  material: (materialId: string) => `material:${materialId}`,
}

export async function getCached<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cache = await getCacheInstance()
  const cached = await cache.get<T>(key)

  if (cached !== null) {
    return cached
  }

  const data = await fetcher()
  await cache.set(key, data, ttl)
  return data
}

export async function invalidateCache(_pattern: string): Promise<void> {
  const cache = await getCacheInstance()
  // En una implementación más sofisticada, usaríamos patrones
  // Por ahora, invalidamos manualmente
  await cache.clear()
}

export async function setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
  const cache = await getCacheInstance()
  await cache.set(key, data, ttl)
}

export async function getCache<T>(key: string): Promise<T | null> {
  const cache = await getCacheInstance()
  return await cache.get<T>(key)
}

export async function deleteCache(key: string): Promise<void> {
  const cache = await getCacheInstance()
  await cache.delete(key)
}

// Helper para invalidar por patrón (preparado para Redis)
export async function invalidateCachePattern(pattern: string): Promise<void> {
  const cache = await getCacheInstance()
  
  // Si es Redis, intentar usar SCAN para buscar patrones
  if (cache instanceof RedisCacheAdapter) {
    try {
      // Upstash Redis no soporta SCAN directamente en REST API
      // Por el momento, invalidar caché completo si hay wildcard
      if (pattern.includes('*')) {
        // En producción con Redis, considerar usar un prefijo para versiones
        // y eliminar todas las claves con ese prefijo
        console.warn('Invalidación por patrón con wildcard no está completamente soportada en Upstash Redis REST API')
      } else {
        await cache.delete(pattern)
      }
    } catch (error) {
      console.error('Error al invalidar patrón en Redis:', error)
    }
  } else {
    // Para memoria, invalidar caché completo si hay wildcard
    if (pattern.includes('*')) {
      await cache.clear()
    } else {
      await cache.delete(pattern)
    }
  }
}
