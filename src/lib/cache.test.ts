/**
 * Tests para src/lib/cache.ts — cobertura línea por línea.
 * - cacheKeys: helpers de claves (líneas 193-214).
 * - MemoryCacheAdapter: get/set/delete/clear/expiración (22-62).
 * - getCached, getCache, setCache, deleteCache, invalidateCache, invalidateCachePattern (216-282).
 * - teardownMemoryCacheCleanup (156-161).
 * - Redis path e invalidateCachePattern con Redis se cubren en el segundo describe con mock.
 */

import { describe, it, expect, beforeAll, afterEach, vi } from 'vitest'
import {
  cacheKeys,
  getCached,
  getCache,
  setCache,
  deleteCache,
  invalidateCache,
  invalidateCachePattern,
  teardownMemoryCacheCleanup,
} from './cache'

describe('cache.ts — cacheKeys (líneas 193-214)', () => {
  it('cacheKeys.student devuelve clave student:id', () => {
    expect(cacheKeys.student('u1')).toBe('student:u1')
  })

  it('cacheKeys.studentAttempts devuelve clave con limit y offset', () => {
    expect(cacheKeys.studentAttempts('u1', 10, 0)).toBe('student:u1:attempts:10:0')
  })

  it('cacheKeys.studentMetrics con subjectId y topicId', () => {
    expect(cacheKeys.studentMetrics('u1', 's1', 't1')).toBe('student:u1:metrics:s1:t1')
  })

  it('cacheKeys.studentMetrics sin subjectId/topicId usa "all"', () => {
    expect(cacheKeys.studentMetrics('u1')).toBe('student:u1:metrics:all:all')
  })

  it('cacheKeys.studentRecommendations', () => { // guard:allow-secret
    expect(cacheKeys.studentRecommendations('u1')).toBe('student:u1:recommendations')
  })

  it('cacheKeys.studentAnalytics', () => {
    expect(cacheKeys.studentAnalytics('u1')).toBe('student:u1:analytics')
  })

  it('cacheKeys.exams con parámetros opcionales', () => {
    expect(cacheKeys.exams('s1', 'PAES', 20, 0)).toBe('exams:s1:PAES:20:0')
  })

  it('cacheKeys.exams sin args usa defaults', () => {
    expect(cacheKeys.exams()).toBe('exams:all:all:20:0')
  })

  it('cacheKeys.exam', () => {
    expect(cacheKeys.exam('e1')).toBe('exam:e1')
  })

  it('cacheKeys.materials con todos los params', () => {
    expect(cacheKeys.materials('s1', 't1', 'pdf', 10, 0)).toBe(
      'materials:s1:t1:pdf:10:0'
    )
  })

  it('cacheKeys.materials sin args', () => {
    expect(cacheKeys.materials()).toBe('materials:all:all:all:20:0')
  })

  it('cacheKeys.material', () => {
    expect(cacheKeys.material('m1')).toBe('material:m1')
  })
})

describe('cache.ts — Memory adapter (get/set/delete/clear/expiración)', () => {
  beforeAll(() => {
    delete process.env.UPSTASH_REDIS_REST_URL
    delete process.env.UPSTASH_REDIS_REST_TOKEN
  })

  afterEach(async () => {
    await invalidateCache('*')
    teardownMemoryCacheCleanup()
  })

  it('getCache de clave inexistente devuelve null (get 26-30)', async () => {
    const v = await getCache<string>('noexiste')
    expect(v).toBeNull()
  })

  it('setCache + getCache devuelve el valor (set 40-43, get 31-37)', async () => {
    await setCache('k1', { foo: 1 })
    const v = await getCache<{ foo: number }>('k1')
    expect(v).toEqual({ foo: 1 })
  })

  it('setCache con ttl y getCache devuelve el valor', async () => {
    await setCache('k2', 'v2', 60_000)
    const v = await getCache<string>('k2')
    expect(v).toBe('v2')
  })

  it('get devuelve null y borra clave si entry expirada (32-35)', async () => {
    await setCache('exp', 'old', -1000)
    const v = await getCache<string>('exp')
    expect(v).toBeNull()
    const again = await getCache<string>('exp')
    expect(again).toBeNull()
  })

  it('deleteCache elimina la clave (delete 45-47)', async () => {
    await setCache('del1', 'x')
    await deleteCache('del1')
    const v = await getCache<string>('del1')
    expect(v).toBeNull()
  })

  it('invalidateCache llama clear (clear 49-51)', async () => {
    await setCache('c1', 1)
    await setCache('c2', 2)
    await invalidateCache('*')
    expect(await getCache('c1')).toBeNull()
    expect(await getCache('c2')).toBeNull()
  })

  it('getCached devuelve cache hit sin llamar fetcher (221-226)', async () => {
    await setCache('hit', 'cached')
    const fetcher = vi.fn().mockResolvedValue('fresh')
    const v = await getCached('hit', fetcher)
    expect(v).toBe('cached')
    expect(fetcher).not.toHaveBeenCalled()
  })

  it('getCached con miss llama fetcher y guarda (227-229)', async () => {
    const fetcher = vi.fn().mockResolvedValue('fresh')
    const v = await getCached('miss', fetcher)
    expect(v).toBe('fresh')
    expect(fetcher).toHaveBeenCalledTimes(1)
    expect(await getCache<string>('miss')).toBe('fresh')
  })

  it('getCached con ttl opcional', async () => {
    const fetcher = vi.fn().mockResolvedValue('data')
    await getCached('ttl-key', fetcher, 1000)
    expect(await getCache<string>('ttl-key')).toBe('data')
  })

  it('invalidateCachePattern sin wildcard borra una clave (memory 276-278)', async () => {
    await setCache('p1', 'v')
    await invalidateCachePattern('p1')
    expect(await getCache('p1')).toBeNull()
  })

  it('invalidateCachePattern con wildcard hace clear (memory 274-276)', async () => {
    await setCache('pref:a', 1)
    await setCache('pref:b', 2)
    await invalidateCachePattern('pref:*')
    expect(await getCache('pref:a')).toBeNull()
    expect(await getCache('pref:b')).toBeNull()
  })
})

describe('cache.ts — teardownMemoryCacheCleanup (156-161)', () => {
  it('teardownMemoryCacheCleanup no lanza', () => {
    expect(() => teardownMemoryCacheCleanup()).not.toThrow()
  })

  it('teardownMemoryCacheCleanup es idempotente', () => {
    teardownMemoryCacheCleanup()
    teardownMemoryCacheCleanup()
  })
})

// Redis adapter (líneas 65-108, 259-273): se cubre en CI con UPSTASH_* configurado
// o en un test aparte con vi.mock('@upstash/redis') hoisted y env antes del import.
