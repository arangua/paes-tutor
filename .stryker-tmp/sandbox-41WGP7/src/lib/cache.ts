// @ts-nocheck
// Sistema de caché con soporte para memoria (desarrollo) y Redis (producción)
// Preparado para migración fácil a Redis
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { TIME_CONSTANTS } from './constants';

// Constantes de tiempo de caché
const DEFAULT_CACHE_TTL_MS = TIME_CONSTANTS.DEFAULT_CACHE_TTL_MS;
const CACHE_CLEANUP_INTERVAL_MS = TIME_CONSTANTS.CACHE_CLEANUP_INTERVAL_MS;
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, data: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}
class MemoryCacheAdapter implements CacheAdapter {
  private store: Map<string, CacheEntry<unknown>> = new Map();
  private defaultTTL: number = DEFAULT_CACHE_TTL_MS;
  async get<T>(key: string): Promise<T | null> {
    if (stryMutAct_9fa48("23153")) {
      {}
    } else {
      stryCov_9fa48("23153");
      const entry = this.store.get(key);
      if (stryMutAct_9fa48("23156") ? false : stryMutAct_9fa48("23155") ? true : stryMutAct_9fa48("23154") ? entry : (stryCov_9fa48("23154", "23155", "23156"), !entry)) {
        if (stryMutAct_9fa48("23157")) {
          {}
        } else {
          stryCov_9fa48("23157");
          return null;
        }
      }
      if (stryMutAct_9fa48("23161") ? Date.now() <= entry.expiresAt : stryMutAct_9fa48("23160") ? Date.now() >= entry.expiresAt : stryMutAct_9fa48("23159") ? false : stryMutAct_9fa48("23158") ? true : (stryCov_9fa48("23158", "23159", "23160", "23161"), Date.now() > entry.expiresAt)) {
        if (stryMutAct_9fa48("23162")) {
          {}
        } else {
          stryCov_9fa48("23162");
          this.store.delete(key);
          return null;
        }
      }
      return entry.data as T;
    }
  }
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    if (stryMutAct_9fa48("23163")) {
      {}
    } else {
      stryCov_9fa48("23163");
      const expiresAt = stryMutAct_9fa48("23164") ? Date.now() - (ttl || this.defaultTTL) : (stryCov_9fa48("23164"), Date.now() + (stryMutAct_9fa48("23167") ? ttl && this.defaultTTL : stryMutAct_9fa48("23166") ? false : stryMutAct_9fa48("23165") ? true : (stryCov_9fa48("23165", "23166", "23167"), ttl || this.defaultTTL)));
      this.store.set(key, stryMutAct_9fa48("23168") ? {} : (stryCov_9fa48("23168"), {
        data,
        expiresAt
      }));
    }
  }
  async delete(key: string): Promise<void> {
    if (stryMutAct_9fa48("23169")) {
      {}
    } else {
      stryCov_9fa48("23169");
      this.store.delete(key);
    }
  }
  async clear(): Promise<void> {
    if (stryMutAct_9fa48("23170")) {
      {}
    } else {
      stryCov_9fa48("23170");
      this.store.clear();
    }
  }

  // Limpiar entradas expiradas
  cleanup(): void {
    if (stryMutAct_9fa48("23171")) {
      {}
    } else {
      stryCov_9fa48("23171");
      const now = Date.now();
      for (const [key, entry] of this.store.entries()) {
        if (stryMutAct_9fa48("23172")) {
          {}
        } else {
          stryCov_9fa48("23172");
          if (stryMutAct_9fa48("23176") ? now <= entry.expiresAt : stryMutAct_9fa48("23175") ? now >= entry.expiresAt : stryMutAct_9fa48("23174") ? false : stryMutAct_9fa48("23173") ? true : (stryCov_9fa48("23173", "23174", "23175", "23176"), now > entry.expiresAt)) {
            if (stryMutAct_9fa48("23177")) {
              {}
            } else {
              stryCov_9fa48("23177");
              this.store.delete(key);
            }
          }
        }
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
  if (stryMutAct_9fa48("23178")) {
    {}
  } else {
    stryCov_9fa48("23178");
    // En producción, si REDIS_URL está configurado, usar Redis
    // const redisUrl = process.env.REDIS_URL
    // if (redisUrl && process.env.NODE_ENV === 'production') {
    //   const redis = new Redis(redisUrl)
    //   return new RedisCacheAdapter(redis)
    // }

    // Por defecto, usar memoria
    return new MemoryCacheAdapter();
  }
}
const cache = getCacheAdapter();

// Si es memoria, configurar cleanup periódico
// NOTA: Este setInterval se ejecuta a nivel de módulo y no se limpia explícitamente
// Esto es intencional: el cleanup del caché debe ejecutarse mientras la aplicación esté corriendo
// En producción, considerar usar un sistema de tareas programadas (cron) o un worker thread
if (stryMutAct_9fa48("23180") ? false : stryMutAct_9fa48("23179") ? true : (stryCov_9fa48("23179", "23180"), cache instanceof MemoryCacheAdapter)) {
  if (stryMutAct_9fa48("23181")) {
    {}
  } else {
    stryCov_9fa48("23181");
    // Limpiar caché cada 10 minutos (solo en Node.js runtime)
    if (stryMutAct_9fa48("23184") ? typeof setInterval !== 'undefined' && typeof process !== 'undefined' || process.env.NEXT_RUNTIME !== 'edge' : stryMutAct_9fa48("23183") ? false : stryMutAct_9fa48("23182") ? true : (stryCov_9fa48("23182", "23183", "23184"), (stryMutAct_9fa48("23186") ? typeof setInterval !== 'undefined' || typeof process !== 'undefined' : stryMutAct_9fa48("23185") ? true : (stryCov_9fa48("23185", "23186"), (stryMutAct_9fa48("23188") ? typeof setInterval === 'undefined' : stryMutAct_9fa48("23187") ? true : (stryCov_9fa48("23187", "23188"), typeof setInterval !== (stryMutAct_9fa48("23189") ? "" : (stryCov_9fa48("23189"), 'undefined')))) && (stryMutAct_9fa48("23191") ? typeof process === 'undefined' : stryMutAct_9fa48("23190") ? true : (stryCov_9fa48("23190", "23191"), typeof process !== (stryMutAct_9fa48("23192") ? "" : (stryCov_9fa48("23192"), 'undefined')))))) && (stryMutAct_9fa48("23194") ? process.env.NEXT_RUNTIME === 'edge' : stryMutAct_9fa48("23193") ? true : (stryCov_9fa48("23193", "23194"), process.env.NEXT_RUNTIME !== (stryMutAct_9fa48("23195") ? "" : (stryCov_9fa48("23195"), 'edge')))))) {
      if (stryMutAct_9fa48("23196")) {
        {}
      } else {
        stryCov_9fa48("23196");
        // Guardar referencia al interval para poder limpiarlo si es necesario
        // En Next.js, esto se ejecuta una vez al cargar el módulo
        const cleanupInterval = setInterval(() => {
          if (stryMutAct_9fa48("23197")) {
            {}
          } else {
            stryCov_9fa48("23197");
            cache.cleanup();
          }
        }, CACHE_CLEANUP_INTERVAL_MS);

        // Limpiar en caso de que el proceso termine (opcional, pero buena práctica)
        if (stryMutAct_9fa48("23200") ? typeof process !== 'undefined' || process.on : stryMutAct_9fa48("23199") ? false : stryMutAct_9fa48("23198") ? true : (stryCov_9fa48("23198", "23199", "23200"), (stryMutAct_9fa48("23202") ? typeof process === 'undefined' : stryMutAct_9fa48("23201") ? true : (stryCov_9fa48("23201", "23202"), typeof process !== (stryMutAct_9fa48("23203") ? "" : (stryCov_9fa48("23203"), 'undefined')))) && process.on)) {
          if (stryMutAct_9fa48("23204")) {
            {}
          } else {
            stryCov_9fa48("23204");
            process.on(stryMutAct_9fa48("23205") ? "" : (stryCov_9fa48("23205"), 'SIGTERM'), () => {
              if (stryMutAct_9fa48("23206")) {
                {}
              } else {
                stryCov_9fa48("23206");
                clearInterval(cleanupInterval);
              }
            });
            process.on(stryMutAct_9fa48("23207") ? "" : (stryCov_9fa48("23207"), 'SIGINT'), () => {
              if (stryMutAct_9fa48("23208")) {
                {}
              } else {
                stryCov_9fa48("23208");
                clearInterval(cleanupInterval);
              }
            });
          }
        }
      }
    }
  }
}

// Helpers para caché de queries
export const cacheKeys = stryMutAct_9fa48("23209") ? {} : (stryCov_9fa48("23209"), {
  student: stryMutAct_9fa48("23210") ? () => undefined : (stryCov_9fa48("23210"), (studentId: string) => stryMutAct_9fa48("23211") ? `` : (stryCov_9fa48("23211"), `student:${studentId}`)),
  studentAttempts: stryMutAct_9fa48("23212") ? () => undefined : (stryCov_9fa48("23212"), (studentId: string, limit: number, offset: number) => stryMutAct_9fa48("23213") ? `` : (stryCov_9fa48("23213"), `student:${studentId}:attempts:${limit}:${offset}`)),
  studentMetrics: stryMutAct_9fa48("23214") ? () => undefined : (stryCov_9fa48("23214"), (studentId: string, subjectId?: string, topicId?: string) => stryMutAct_9fa48("23215") ? `` : (stryCov_9fa48("23215"), `student:${studentId}:metrics:${stryMutAct_9fa48("23218") ? subjectId && 'all' : stryMutAct_9fa48("23217") ? false : stryMutAct_9fa48("23216") ? true : (stryCov_9fa48("23216", "23217", "23218"), subjectId || (stryMutAct_9fa48("23219") ? "" : (stryCov_9fa48("23219"), 'all')))}:${stryMutAct_9fa48("23222") ? topicId && 'all' : stryMutAct_9fa48("23221") ? false : stryMutAct_9fa48("23220") ? true : (stryCov_9fa48("23220", "23221", "23222"), topicId || (stryMutAct_9fa48("23223") ? "" : (stryCov_9fa48("23223"), 'all')))}`)),
  studentRecommendations: stryMutAct_9fa48("23224") ? () => undefined : (stryCov_9fa48("23224"), (studentId: string) => stryMutAct_9fa48("23225") ? `` : (stryCov_9fa48("23225"), `student:${studentId}:recommendations`)),
  studentAnalytics: stryMutAct_9fa48("23226") ? () => undefined : (stryCov_9fa48("23226"), (studentId: string) => stryMutAct_9fa48("23227") ? `` : (stryCov_9fa48("23227"), `student:${studentId}:analytics`)),
  exams: stryMutAct_9fa48("23228") ? () => undefined : (stryCov_9fa48("23228"), (subjectId?: string, tipo?: string, limit?: number, offset?: number) => stryMutAct_9fa48("23229") ? `` : (stryCov_9fa48("23229"), `exams:${stryMutAct_9fa48("23232") ? subjectId && 'all' : stryMutAct_9fa48("23231") ? false : stryMutAct_9fa48("23230") ? true : (stryCov_9fa48("23230", "23231", "23232"), subjectId || (stryMutAct_9fa48("23233") ? "" : (stryCov_9fa48("23233"), 'all')))}:${stryMutAct_9fa48("23236") ? tipo && 'all' : stryMutAct_9fa48("23235") ? false : stryMutAct_9fa48("23234") ? true : (stryCov_9fa48("23234", "23235", "23236"), tipo || (stryMutAct_9fa48("23237") ? "" : (stryCov_9fa48("23237"), 'all')))}:${stryMutAct_9fa48("23240") ? limit && 20 : stryMutAct_9fa48("23239") ? false : stryMutAct_9fa48("23238") ? true : (stryCov_9fa48("23238", "23239", "23240"), limit || 20)}:${stryMutAct_9fa48("23243") ? offset && 0 : stryMutAct_9fa48("23242") ? false : stryMutAct_9fa48("23241") ? true : (stryCov_9fa48("23241", "23242", "23243"), offset || 0)}`)),
  exam: stryMutAct_9fa48("23244") ? () => undefined : (stryCov_9fa48("23244"), (examId: string) => stryMutAct_9fa48("23245") ? `` : (stryCov_9fa48("23245"), `exam:${examId}`)),
  materials: stryMutAct_9fa48("23246") ? () => undefined : (stryCov_9fa48("23246"), (subjectId?: string, topicId?: string, tipo?: string, limit?: number, offset?: number) => stryMutAct_9fa48("23247") ? `` : (stryCov_9fa48("23247"), `materials:${stryMutAct_9fa48("23250") ? subjectId && 'all' : stryMutAct_9fa48("23249") ? false : stryMutAct_9fa48("23248") ? true : (stryCov_9fa48("23248", "23249", "23250"), subjectId || (stryMutAct_9fa48("23251") ? "" : (stryCov_9fa48("23251"), 'all')))}:${stryMutAct_9fa48("23254") ? topicId && 'all' : stryMutAct_9fa48("23253") ? false : stryMutAct_9fa48("23252") ? true : (stryCov_9fa48("23252", "23253", "23254"), topicId || (stryMutAct_9fa48("23255") ? "" : (stryCov_9fa48("23255"), 'all')))}:${stryMutAct_9fa48("23258") ? tipo && 'all' : stryMutAct_9fa48("23257") ? false : stryMutAct_9fa48("23256") ? true : (stryCov_9fa48("23256", "23257", "23258"), tipo || (stryMutAct_9fa48("23259") ? "" : (stryCov_9fa48("23259"), 'all')))}:${stryMutAct_9fa48("23262") ? limit && 20 : stryMutAct_9fa48("23261") ? false : stryMutAct_9fa48("23260") ? true : (stryCov_9fa48("23260", "23261", "23262"), limit || 20)}:${stryMutAct_9fa48("23265") ? offset && 0 : stryMutAct_9fa48("23264") ? false : stryMutAct_9fa48("23263") ? true : (stryCov_9fa48("23263", "23264", "23265"), offset || 0)}`)),
  material: stryMutAct_9fa48("23266") ? () => undefined : (stryCov_9fa48("23266"), (materialId: string) => stryMutAct_9fa48("23267") ? `` : (stryCov_9fa48("23267"), `material:${materialId}`))
});
export async function getCached<T>(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
  if (stryMutAct_9fa48("23268")) {
    {}
  } else {
    stryCov_9fa48("23268");
    const cached = await cache.get<T>(key);
    if (stryMutAct_9fa48("23271") ? cached === null : stryMutAct_9fa48("23270") ? false : stryMutAct_9fa48("23269") ? true : (stryCov_9fa48("23269", "23270", "23271"), cached !== null)) {
      if (stryMutAct_9fa48("23272")) {
        {}
      } else {
        stryCov_9fa48("23272");
        return cached;
      }
    }
    const data = await fetcher();
    await cache.set(key, data, ttl);
    return data;
  }
}
export async function invalidateCache(pattern: string): Promise<void> {
  if (stryMutAct_9fa48("23273")) {
    {}
  } else {
    stryCov_9fa48("23273");
    // En una implementación más sofisticada, usaríamos patrones
    // Por ahora, invalidamos manualmente
    await cache.clear();
  }
}
export async function setCache<T>(key: string, data: T, ttl?: number): Promise<void> {
  if (stryMutAct_9fa48("23274")) {
    {}
  } else {
    stryCov_9fa48("23274");
    await cache.set(key, data, ttl);
  }
}
export async function getCache<T>(key: string): Promise<T | null> {
  if (stryMutAct_9fa48("23275")) {
    {}
  } else {
    stryCov_9fa48("23275");
    return await cache.get<T>(key);
  }
}
export async function deleteCache(key: string): Promise<void> {
  if (stryMutAct_9fa48("23276")) {
    {}
  } else {
    stryCov_9fa48("23276");
    await cache.delete(key);
  }
}

// Helper para invalidar por patrón (preparado para Redis)
export async function invalidateCachePattern(pattern: string): Promise<void> {
  if (stryMutAct_9fa48("23277")) {
    {}
  } else {
    stryCov_9fa48("23277");
    // En Redis: usar SCAN + DEL
    // Por ahora, invalidar todo si el patrón coincide con algún prefijo conocido
    if (stryMutAct_9fa48("23279") ? false : stryMutAct_9fa48("23278") ? true : (stryCov_9fa48("23278", "23279"), pattern.includes(stryMutAct_9fa48("23280") ? "" : (stryCov_9fa48("23280"), '*')))) {
      if (stryMutAct_9fa48("23281")) {
        {}
      } else {
        stryCov_9fa48("23281");
        // Invalidar todo si hay wildcard (implementación simple)
        await cache.clear();
      }
    } else {
      if (stryMutAct_9fa48("23282")) {
        {}
      } else {
        stryCov_9fa48("23282");
        // Invalidar clave específica
        await cache.delete(pattern);
      }
    }
  }
}