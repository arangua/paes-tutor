// Sistema de caché con soporte para memoria (desarrollo) y Redis (producción)
// Preparado para migración fácil a Redis

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

// Redis adapter (preparado para implementación futura)
// class RedisCacheAdapter implements CacheAdapter {
//   private client: Redis
//
//   constructor(client: Redis) {
//     this.client = client
//   }
//
//   async get<T>(key: string): Promise<T | null> {
//     const data = await this.client.get(key)
//     if (!data) return null
//     return JSON.parse(data) as T
//   }
//
//   async set<T>(key: string, data: T, ttl?: number): Promise<void> {
//     const serialized = JSON.stringify(data)
//     if (ttl) {
//       await this.client.setex(key, Math.floor(ttl / 1000), serialized)
//     } else {
//       await this.client.set(key, serialized)
//     }
//   }
//
//   async delete(key: string): Promise<void> {
//     await this.client.del(key)
//   }
//
//   async clear(): Promise<void> {
//     await this.client.flushdb()
//   }
// }

// Seleccionar adapter basado en configuración
function getCacheAdapter(): CacheAdapter {
  // En producción, si REDIS_URL está configurado, usar Redis
  // const redisUrl = process.env.REDIS_URL
  // if (redisUrl && process.env.NODE_ENV === 'production') {
  //   const redis = new Redis(redisUrl)
  //   return new RedisCacheAdapter(redis)
  // }

  // Por defecto, usar memoria
  return new MemoryCacheAdapter()
}

const cache = getCacheAdapter()

// Si es memoria, configurar cleanup periódico
// NOTA: Este setInterval se ejecuta a nivel de módulo y no se limpia explícitamente
// Esto es intencional: el cleanup del caché debe ejecutarse mientras la aplicación esté corriendo
// En producción, considerar usar un sistema de tareas programadas (cron) o un worker thread
if (cache instanceof MemoryCacheAdapter) {
  // Limpiar caché cada 10 minutos (solo en Node.js runtime)
  if (
    typeof setInterval !== 'undefined' &&
    typeof process !== 'undefined' &&
    process.env.NEXT_RUNTIME !== 'edge'
  ) {
    // Guardar referencia al interval para poder limpiarlo si es necesario
    // En Next.js, esto se ejecuta una vez al cargar el módulo
    const cleanupInterval = setInterval(() => {
      cache.cleanup()
    }, CACHE_CLEANUP_INTERVAL_MS)

    // Limpiar en caso de que el proceso termine (opcional, pero buena práctica)
    if (typeof process !== 'undefined' && process.on) {
      process.on('SIGTERM', () => {
        clearInterval(cleanupInterval)
      })
      process.on('SIGINT', () => {
        clearInterval(cleanupInterval)
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
  const cached = await cache.get<T>(key)

  if (cached !== null) {
    return cached
  }

  const data = await fetcher()
  await cache.set(key, data, ttl)
  return data
}

export async function invalidateCache(pattern: string): Promise<void> {
  // En una implementación más sofisticada, usaríamos patrones
  // Por ahora, invalidamos manualmente
  await cache.clear()
}

export async function setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
  await cache.set(key, data, ttl)
}

export async function getCache<T>(key: string): Promise<T | null> {
  return await cache.get<T>(key)
}

export async function deleteCache(key: string): Promise<void> {
  await cache.delete(key)
}

// Helper para invalidar por patrón (preparado para Redis)
export async function invalidateCachePattern(pattern: string): Promise<void> {
  // En Redis: usar SCAN + DEL
  // Por ahora, invalidar todo si el patrón coincide con algún prefijo conocido
  if (pattern.includes('*')) {
    // Invalidar todo si hay wildcard (implementación simple)
    await cache.clear()
  } else {
    // Invalidar clave específica
    await cache.delete(pattern)
  }
}
