import { getCache, setCache, invalidateCachePattern } from '@/lib/cache'
import type { VersionsResponse } from '@/lib/types/versions'
import { CACHE_CONFIG, CACHE_METRICS_CONFIG } from './config'
import { logger } from '@/lib/logger'
import { trackVersionMetric } from './metrics-tracker'
import { safeRound, safeToISOString } from './validation-utils'

// TTL del caché desde configuración
const VERSION_CACHE_TTL_MS = CACHE_CONFIG.VERSIONS_TTL

// Métricas de caché en memoria (para hit rate)
let cacheMetrics = {
  hits: 0,
  misses: 0,
  sets: 0,
  invalidations: 0,
}

export interface VersionCacheFilters {
  search?: string
  isImportant?: boolean
  hasName?: boolean
  dateFrom?: Date
  dateTo?: Date
}

/**
 * Genera la clave de caché para versiones
 */
/**
 * Genera clave de caché para versiones
 * CORRECCIÓN: Valida que las fechas sean válidas antes de llamar toISOString()
 * y maneja errores de JSON.stringify (referencias circulares)
 */
export function getVersionCacheKey(
  noteId: string,
  cursor?: string,
  filters?: VersionCacheFilters
): string {
  let filterKey: string
  if (filters) {
    try {
      filterKey = JSON.stringify({
        search: filters.search,
        isImportant: filters.isImportant,
        hasName: filters.hasName,
        dateFrom: filters.dateFrom ? safeToISOString(filters.dateFrom) : undefined,
        dateTo: filters.dateTo ? safeToISOString(filters.dateTo) : undefined,
      })
    } catch (error) {
      // CORRECCIÓN: Manejar errores de JSON.stringify (referencias circulares, etc.)
      logger.warn(
        { error, filters, noteId, cursor },
        'Error al serializar filtros para clave de caché, usando clave genérica'
      )
      filterKey = 'error-serializing-filters'
    }
  } else {
    filterKey = 'no-filters'
  }
  return `versions:${noteId}:${cursor || 'initial'}:${filterKey}`
}

// isValidDate ahora se importa de validation-utils

/**
 * Obtiene versiones del caché si están disponibles y no han expirado
 * Trackea métricas de hit/miss si está habilitado
 */
export async function getCachedVersions(
  noteId: string,
  cursor?: string,
  filters?: VersionCacheFilters
): Promise<VersionsResponse | null> {
  const cacheKey = getVersionCacheKey(noteId, cursor, filters)
  try {
    const cached = await getCache(cacheKey)
    
    if (!cached) {
      if (CACHE_METRICS_CONFIG.ENABLED) {
        cacheMetrics.misses++
        trackVersionMetric('version.cache_miss', { noteId, cursor, hasFilters: !!filters })
      }
      return null
    }
    
    // Validar estructura básica del caché antes de retornar
    if (typeof cached !== 'object' || cached === null) {
      logger.warn(
        { noteId, cursor, cacheKey },
        'Datos de caché corruptos: no es un objeto, invalidando'
      )
      await invalidateVersionCache(noteId, 0)
      if (CACHE_METRICS_CONFIG.ENABLED) {
        cacheMetrics.misses++
      }
      return null
    }
    
    // Validar estructura mínima requerida
    if (!('versions' in cached) || !Array.isArray(cached.versions)) {
      logger.warn(
        { noteId, cursor, cacheKey },
        'Datos de caché corruptos: estructura inválida, invalidando'
      )
      await invalidateVersionCache(noteId, 0)
      if (CACHE_METRICS_CONFIG.ENABLED) {
        cacheMetrics.misses++
      }
      return null
    }
    
    // Trackear métricas de caché
    if (CACHE_METRICS_CONFIG.ENABLED) {
      cacheMetrics.hits++
      trackVersionMetric('version.cache_hit', { noteId, cursor, hasFilters: !!filters })
    }
    
    return cached as VersionsResponse
  } catch (error) {
    // Si falla el acceso al caché, no fallar la operación
    logger.warn(
      { error, noteId, cursor, cacheKey },
      'Error al acceder al caché, continuando sin caché'
    )
    if (CACHE_METRICS_CONFIG.ENABLED) {
      cacheMetrics.misses++
    }
    return null
  }
}

/**
 * Guarda versiones en el caché
 * Trackea métricas si está habilitado
 */
export async function setCachedVersions(
  noteId: string,
  cursor: string | undefined,
  data: VersionsResponse,
  filters?: VersionCacheFilters
): Promise<void> {
  try {
    // Validar datos antes de guardar
    if (!data || typeof data !== 'object' || !Array.isArray(data.versions)) {
      logger.warn(
        { noteId, cursor },
        'Intento de guardar datos inválidos en caché, omitiendo'
      )
      return
    }
    
    const cacheKey = getVersionCacheKey(noteId, cursor, filters)
    await setCache(cacheKey, data, VERSION_CACHE_TTL_MS)
    
    // Trackear métricas de caché
    if (CACHE_METRICS_CONFIG.ENABLED) {
      cacheMetrics.sets++
      // CORRECCIÓN: Validar que JSON.stringify no falle antes de usar length
      let dataSize = 0
      try {
        const jsonString = JSON.stringify(data)
        dataSize = typeof jsonString.length === 'number' && Number.isFinite(jsonString.length)
          ? jsonString.length
          : 0
      } catch {
        // Si falla JSON.stringify, usar 0 como tamaño
        dataSize = 0
      }
      
      // Validar que data.versions.length sea un número válido
      const versionCount = Array.isArray(data.versions) && Number.isFinite(data.versions.length)
        ? data.versions.length
        : 0
      
      trackVersionMetric('version.cache_set', { 
        noteId, 
        cursor, 
        hasFilters: !!filters,
        dataSizeBytes: dataSize,
        versionCount,
      })
    }
  } catch (error) {
    // No fallar si el caché falla, pero registrar el error
    logger.warn(
      { error, noteId, cursor },
      'Error al guardar en caché, continuando sin caché'
    )
  }
}

/**
 * Invalida el caché para una nota específica
 * Exportada para uso en otros módulos
 * 
 * @param noteId - ID de la nota a invalidar
 * @param delay - Delay opcional antes de invalidar (útil para evitar race conditions)
 * @param filters - Filtros opcionales para invalidación granular (solo invalidar ciertos filtros)
 */
export async function invalidateVersionCache(
  noteId: string,
  delay: number = CACHE_CONFIG.INVALIDATION_GRACE_PERIOD,
  filters?: VersionCacheFilters
): Promise<void> {
  try {
    // CORRECCIÓN: Validar que delay sea un número finito y no negativo antes de usar setTimeout
    const safeDelay = Number.isFinite(delay) && delay >= 0 ? delay : 0
    
    // Pequeño delay para evitar race conditions en operaciones concurrentes
    if (safeDelay > 0) {
      await new Promise(resolve => setTimeout(resolve, safeDelay))
    }
    
    if (filters) {
      // Invalidación granular: solo invalidar la clave específica con estos filtros
      const cacheKey = getVersionCacheKey(noteId, undefined, filters)
      // CORRECCIÓN: Validar que cacheKey sea un string válido antes de usar replace()
      if (typeof cacheKey === 'string' && cacheKey.length > 0) {
        try {
          const pattern = cacheKey.replace(/:[^:]*$/, ':*')
          // Validar que pattern sea un string válido antes de usar
          if (typeof pattern === 'string' && pattern.length > 0) {
            await invalidateCachePattern(pattern)
          } else {
            logger.warn(
              { noteId, cacheKey, pattern },
              'invalidateVersionCache: pattern inválido después de replace, usando patrón genérico'
            )
            await invalidateCachePattern(`versions:${noteId}:*`)
          }
        } catch (error) {
          logger.warn(
            { error, noteId, cacheKey },
            'Error al aplicar replace en cacheKey, usando patrón genérico'
          )
          await invalidateCachePattern(`versions:${noteId}:*`)
        }
      } else {
        logger.warn(
          { noteId, cacheKey },
          'invalidateVersionCache: cacheKey inválido, usando patrón genérico'
        )
        await invalidateCachePattern(`versions:${noteId}:*`)
      }
      
      logger.debug(
        { noteId, delay, filters },
        'Caché de versiones invalidado (granular)'
      )
    } else {
      // Invalidar todas las claves que empiecen con el patrón de la nota
      await invalidateCachePattern(`versions:${noteId}:*`)
      
      logger.debug(
        { noteId, delay },
        'Caché de versiones invalidado (completo)'
      )
    }
    
    // Trackear métricas de invalidación
    if (CACHE_METRICS_CONFIG.ENABLED) {
      cacheMetrics.invalidations++
      // CORRECCIÓN: Validar que filters sea un objeto válido antes de usar Object.keys
      let filterKeys: string[] | undefined = undefined
      if (filters && typeof filters === 'object' && !Array.isArray(filters)) {
        try {
          const keys = Object.keys(filters)
          filterKeys = Array.isArray(keys)
            ? keys.filter(k => filters[k as keyof VersionCacheFilters])
            : undefined
        } catch {
          // Si falla Object.keys, usar undefined
          filterKeys = undefined
        }
      }
      
      trackVersionMetric('version.cache_invalidated', { 
        noteId, 
        granular: !!filters,
        filters: filterKeys,
      })
    }
  } catch (error) {
    // No fallar si la invalidación falla, pero registrar el error
    logger.warn(
      { error, noteId, context: 'invalidateVersionCache' },
      'Error al invalidar caché de versiones'
    )
  }
}

/**
 * Obtiene métricas de caché (hit rate, miss rate, etc.)
 */
export function getCacheMetrics(): {
  hits: number
  misses: number
  sets: number
  invalidations: number
  hitRate: number
  totalRequests: number
} {
  // CORRECCIÓN: Validar que cacheMetrics.hits y cacheMetrics.misses sean números válidos
  const safeHits = Number.isFinite(cacheMetrics.hits) && cacheMetrics.hits >= 0 ? cacheMetrics.hits : 0
  const safeMisses = Number.isFinite(cacheMetrics.misses) && cacheMetrics.misses >= 0 ? cacheMetrics.misses : 0
  
  const totalRequests = safeHits + safeMisses
  // CORRECCIÓN: Validar que totalRequests sea un número válido y que la división sea válida
  let hitRate = 0
  if (totalRequests > 0 && Number.isFinite(totalRequests)) {
    const ratio = safeHits / totalRequests
    // Usar safeRound para redondear ratio * 100 a 2 decimales de forma segura
    if (Number.isFinite(ratio) && ratio >= 0) {
      hitRate = safeRound(ratio * 100, 2)
    }
  }
  
  return {
    ...cacheMetrics,
    hitRate,
    totalRequests,
  }
}

/**
 * Resetea las métricas de caché (útil para testing o reset periódico)
 */
export function resetCacheMetrics(): void {
  cacheMetrics = {
    hits: 0,
    misses: 0,
    sets: 0,
    invalidations: 0,
  }
}

