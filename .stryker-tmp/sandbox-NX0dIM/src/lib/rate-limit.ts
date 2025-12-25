// @ts-nocheck
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
import { TIME_CONSTANTS, LIMIT_CONSTANTS, RATE_LIMIT_CONSTANTS } from './constants';

// Constantes de rate limiting
const MAX_RATE_LIMIT_ENTRIES = LIMIT_CONSTANTS.MAX_RATE_LIMIT_ENTRIES;
// En desarrollo, límites más permisivos
const isDev = stryMutAct_9fa48("25413") ? process.env.NODE_ENV === 'production' : stryMutAct_9fa48("25412") ? false : stryMutAct_9fa48("25411") ? true : (stryCov_9fa48("25411", "25412", "25413"), process.env.NODE_ENV !== (stryMutAct_9fa48("25414") ? "" : (stryCov_9fa48("25414"), 'production')));
const GENERAL_RATE_LIMIT_COUNT = isDev ? RATE_LIMIT_CONSTANTS.GENERAL_COUNT_DEV : RATE_LIMIT_CONSTANTS.GENERAL_COUNT_PROD;
const GENERAL_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.GENERAL_RATE_LIMIT_WINDOW_MS;
const AUTH_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.AUTH_COUNT;
const AUTH_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.AUTH_RATE_LIMIT_WINDOW_MS;
const READ_RATE_LIMIT_COUNT = isDev ? RATE_LIMIT_CONSTANTS.READ_COUNT_DEV : RATE_LIMIT_CONSTANTS.READ_COUNT_PROD;
const READ_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.READ_RATE_LIMIT_WINDOW_MS;
const WRITE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.WRITE_COUNT;
const WRITE_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.WRITE_RATE_LIMIT_WINDOW_MS;
const SENSITIVE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.SENSITIVE_COUNT;
const SENSITIVE_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.SENSITIVE_RATE_LIMIT_WINDOW_MS;
const CHALLENGE_RATE_LIMIT_COUNT = RATE_LIMIT_CONSTANTS.CHALLENGE_COUNT;
const CHALLENGE_RATE_LIMIT_WINDOW_MS = TIME_CONSTANTS.CHALLENGE_RATE_LIMIT_WINDOW_MS;

// Rate limiter en memoria para desarrollo
class MemoryRateLimit {
  private store: Map<string, {
    count: number;
    resetAt: number;
  }> = new Map();
  private readonly MAX_ENTRIES = MAX_RATE_LIMIT_ENTRIES;
  async limit(identifier: string, limit: number, window: number) {
    if (stryMutAct_9fa48("25415")) {
      {}
    } else {
      stryCov_9fa48("25415");
      // Limpiar entradas expiradas periódicamente
      if (stryMutAct_9fa48("25419") ? this.store.size <= this.MAX_ENTRIES : stryMutAct_9fa48("25418") ? this.store.size >= this.MAX_ENTRIES : stryMutAct_9fa48("25417") ? false : stryMutAct_9fa48("25416") ? true : (stryCov_9fa48("25416", "25417", "25418", "25419"), this.store.size > this.MAX_ENTRIES)) {
        if (stryMutAct_9fa48("25420")) {
          {}
        } else {
          stryCov_9fa48("25420");
          this.cleanup();
        }
      }
      const now = Date.now();
      const key = identifier;
      const record = this.store.get(key);
      if (stryMutAct_9fa48("25423") ? !record && record.resetAt < now : stryMutAct_9fa48("25422") ? false : stryMutAct_9fa48("25421") ? true : (stryCov_9fa48("25421", "25422", "25423"), (stryMutAct_9fa48("25424") ? record : (stryCov_9fa48("25424"), !record)) || (stryMutAct_9fa48("25427") ? record.resetAt >= now : stryMutAct_9fa48("25426") ? record.resetAt <= now : stryMutAct_9fa48("25425") ? false : (stryCov_9fa48("25425", "25426", "25427"), record.resetAt < now)))) {
        if (stryMutAct_9fa48("25428")) {
          {}
        } else {
          stryCov_9fa48("25428");
          this.store.set(key, stryMutAct_9fa48("25429") ? {} : (stryCov_9fa48("25429"), {
            count: 1,
            resetAt: stryMutAct_9fa48("25430") ? now - window : (stryCov_9fa48("25430"), now + window)
          }));
          return stryMutAct_9fa48("25431") ? {} : (stryCov_9fa48("25431"), {
            success: stryMutAct_9fa48("25432") ? false : (stryCov_9fa48("25432"), true),
            limit,
            remaining: stryMutAct_9fa48("25433") ? limit + 1 : (stryCov_9fa48("25433"), limit - 1),
            reset: stryMutAct_9fa48("25434") ? now - window : (stryCov_9fa48("25434"), now + window)
          });
        }
      }
      if (stryMutAct_9fa48("25438") ? record.count < limit : stryMutAct_9fa48("25437") ? record.count > limit : stryMutAct_9fa48("25436") ? false : stryMutAct_9fa48("25435") ? true : (stryCov_9fa48("25435", "25436", "25437", "25438"), record.count >= limit)) {
        if (stryMutAct_9fa48("25439")) {
          {}
        } else {
          stryCov_9fa48("25439");
          return stryMutAct_9fa48("25440") ? {} : (stryCov_9fa48("25440"), {
            success: stryMutAct_9fa48("25441") ? true : (stryCov_9fa48("25441"), false),
            limit,
            remaining: 0,
            reset: record.resetAt
          });
        }
      }
      stryMutAct_9fa48("25442") ? record.count-- : (stryCov_9fa48("25442"), record.count++);
      this.store.set(key, record);
      return stryMutAct_9fa48("25443") ? {} : (stryCov_9fa48("25443"), {
        success: stryMutAct_9fa48("25444") ? false : (stryCov_9fa48("25444"), true),
        limit,
        remaining: stryMutAct_9fa48("25445") ? limit + record.count : (stryCov_9fa48("25445"), limit - record.count),
        reset: record.resetAt
      });
    }
  }
  private cleanup() {
    if (stryMutAct_9fa48("25446")) {
      {}
    } else {
      stryCov_9fa48("25446");
      const now = Date.now();
      const keysToDelete: string[] = stryMutAct_9fa48("25447") ? ["Stryker was here"] : (stryCov_9fa48("25447"), []);
      this.store.forEach((record, key) => {
        if (stryMutAct_9fa48("25448")) {
          {}
        } else {
          stryCov_9fa48("25448");
          if (stryMutAct_9fa48("25452") ? now <= record.resetAt : stryMutAct_9fa48("25451") ? now >= record.resetAt : stryMutAct_9fa48("25450") ? false : stryMutAct_9fa48("25449") ? true : (stryCov_9fa48("25449", "25450", "25451", "25452"), now > record.resetAt)) {
            if (stryMutAct_9fa48("25453")) {
              {}
            } else {
              stryCov_9fa48("25453");
              keysToDelete.push(key);
            }
          }
        }
      });
      keysToDelete.forEach(stryMutAct_9fa48("25454") ? () => undefined : (stryCov_9fa48("25454"), key => this.store.delete(key)));
    }
  }
}

// Lazy loading de Upstash para evitar importar en tiempo de módulo
type RatelimitType = typeof import('@upstash/ratelimit').Ratelimit;
type RedisType = typeof import('@upstash/redis').Redis;
let upstashRatelimit: RatelimitType | null = null;
let upstashRedis: RedisType | null = null;
async function loadUpstash(): Promise<{
  Ratelimit: RatelimitType;
  Redis: RedisType;
} | null> {
  if (stryMutAct_9fa48("25455")) {
    {}
  } else {
    stryCov_9fa48("25455");
    if (stryMutAct_9fa48("25458") ? upstashRatelimit || upstashRedis : stryMutAct_9fa48("25457") ? false : stryMutAct_9fa48("25456") ? true : (stryCov_9fa48("25456", "25457", "25458"), upstashRatelimit && upstashRedis)) {
      if (stryMutAct_9fa48("25459")) {
        {}
      } else {
        stryCov_9fa48("25459");
        return stryMutAct_9fa48("25460") ? {} : (stryCov_9fa48("25460"), {
          Ratelimit: upstashRatelimit,
          Redis: upstashRedis
        });
      }
    }
    try {
      if (stryMutAct_9fa48("25461")) {
        {}
      } else {
        stryCov_9fa48("25461");
        // Solo importar en Node.js runtime
        const isEdgeRuntime = stryMutAct_9fa48("25464") ? typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge' && typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis : stryMutAct_9fa48("25463") ? false : stryMutAct_9fa48("25462") ? true : (stryCov_9fa48("25462", "25463", "25464"), (stryMutAct_9fa48("25466") ? typeof process !== 'undefined' || process.env.NEXT_RUNTIME === 'edge' : stryMutAct_9fa48("25465") ? false : (stryCov_9fa48("25465", "25466"), (stryMutAct_9fa48("25468") ? typeof process === 'undefined' : stryMutAct_9fa48("25467") ? true : (stryCov_9fa48("25467", "25468"), typeof process !== (stryMutAct_9fa48("25469") ? "" : (stryCov_9fa48("25469"), 'undefined')))) && (stryMutAct_9fa48("25471") ? process.env.NEXT_RUNTIME !== 'edge' : stryMutAct_9fa48("25470") ? true : (stryCov_9fa48("25470", "25471"), process.env.NEXT_RUNTIME === (stryMutAct_9fa48("25472") ? "" : (stryCov_9fa48("25472"), 'edge')))))) || (stryMutAct_9fa48("25474") ? typeof globalThis !== 'undefined' || 'EdgeRuntime' in globalThis : stryMutAct_9fa48("25473") ? false : (stryCov_9fa48("25473", "25474"), (stryMutAct_9fa48("25476") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("25475") ? true : (stryCov_9fa48("25475", "25476"), typeof globalThis !== (stryMutAct_9fa48("25477") ? "" : (stryCov_9fa48("25477"), 'undefined')))) && (stryMutAct_9fa48("25478") ? "" : (stryCov_9fa48("25478"), 'EdgeRuntime')) in globalThis)));
        if (stryMutAct_9fa48("25480") ? false : stryMutAct_9fa48("25479") ? true : (stryCov_9fa48("25479", "25480"), isEdgeRuntime)) {
          if (stryMutAct_9fa48("25481")) {
            {}
          } else {
            stryCov_9fa48("25481");
            throw new Error(stryMutAct_9fa48("25482") ? "" : (stryCov_9fa48("25482"), 'Upstash no disponible en Edge Runtime'));
          }
        }
        const {
          Ratelimit
        } = await import(stryMutAct_9fa48("25483") ? "" : (stryCov_9fa48("25483"), '@upstash/ratelimit'));
        const {
          Redis
        } = await import(stryMutAct_9fa48("25484") ? "" : (stryCov_9fa48("25484"), '@upstash/redis'));
        upstashRatelimit = Ratelimit;
        upstashRedis = Redis;
        return stryMutAct_9fa48("25485") ? {} : (stryCov_9fa48("25485"), {
          Ratelimit,
          Redis
        });
      }
    } catch {
      if (stryMutAct_9fa48("25486")) {
        {}
      } else {
        stryCov_9fa48("25486");
        // Si falla, retornar null para usar memoria
        return null;
      }
    }
  }
}

// Configurar rate limiter según el entorno
const isProduction = stryMutAct_9fa48("25489") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("25488") ? false : stryMutAct_9fa48("25487") ? true : (stryCov_9fa48("25487", "25488", "25489"), process.env.NODE_ENV === (stryMutAct_9fa48("25490") ? "" : (stryCov_9fa48("25490"), 'production')));
const hasUpstash = stryMutAct_9fa48("25493") ? process.env.UPSTASH_REDIS_REST_URL || process.env.UPSTASH_REDIS_REST_TOKEN : stryMutAct_9fa48("25492") ? false : stryMutAct_9fa48("25491") ? true : (stryCov_9fa48("25491", "25492", "25493"), process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

// Rate limiter en memoria (siempre disponible)
const memoryRateLimiter = new MemoryRateLimit();

/**
 * Crea un rate limiter de Upstash con la configuración especificada
 * @param upstash - Módulos de Upstash cargados
 * @param count - Número de requests permitidos
 * @param window - Ventana de tiempo (ej: '10 s', '1 m', '5 m')
 * @returns Rate limiter configurado o null si falla
 */
function createUpstashLimiter(upstash: {
  Ratelimit: RatelimitType;
  Redis: RedisType;
}, count: number, window: string) {
  if (stryMutAct_9fa48("25494")) {
    {}
  } else {
    stryCov_9fa48("25494");
    try {
      if (stryMutAct_9fa48("25495")) {
        {}
      } else {
        stryCov_9fa48("25495");
        const redis = new upstash.Redis(stryMutAct_9fa48("25496") ? {} : (stryCov_9fa48("25496"), {
          url: process.env.UPSTASH_REDIS_REST_URL!,
          token: process.env.UPSTASH_REDIS_REST_TOKEN!
        }));
        return new upstash.Ratelimit(stryMutAct_9fa48("25497") ? {} : (stryCov_9fa48("25497"), {
          redis,
          limiter: upstash.Ratelimit.slidingWindow(count, window),
          analytics: stryMutAct_9fa48("25498") ? false : (stryCov_9fa48("25498"), true)
        }));
      }
    } catch {
      if (stryMutAct_9fa48("25499")) {
        {}
      } else {
        stryCov_9fa48("25499");
        return null;
      }
    }
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
async function rateLimitWithFallback(identifier: string, count: number, windowMs: number, windowString: string) {
  if (stryMutAct_9fa48("25500")) {
    {}
  } else {
    stryCov_9fa48("25500");
    if (stryMutAct_9fa48("25503") ? isProduction || hasUpstash : stryMutAct_9fa48("25502") ? false : stryMutAct_9fa48("25501") ? true : (stryCov_9fa48("25501", "25502", "25503"), isProduction && hasUpstash)) {
      if (stryMutAct_9fa48("25504")) {
        {}
      } else {
        stryCov_9fa48("25504");
        const upstash = await loadUpstash();
        if (stryMutAct_9fa48("25506") ? false : stryMutAct_9fa48("25505") ? true : (stryCov_9fa48("25505", "25506"), upstash)) {
          if (stryMutAct_9fa48("25507")) {
            {}
          } else {
            stryCov_9fa48("25507");
            const limiter = createUpstashLimiter(upstash, count, windowString);
            if (stryMutAct_9fa48("25509") ? false : stryMutAct_9fa48("25508") ? true : (stryCov_9fa48("25508", "25509"), limiter)) {
              if (stryMutAct_9fa48("25510")) {
                {}
              } else {
                stryCov_9fa48("25510");
                return await limiter.limit(identifier);
              }
            }
          }
        }
      }
    }
    // Fallback a memoria
    return await memoryRateLimiter.limit(identifier, count, windowMs);
  }
}

// Rate limiters específicos por endpoint
export const apiRateLimit = stryMutAct_9fa48("25511") ? {} : (stryCov_9fa48("25511"), {
  // Rate limit general para APIs
  general: async (identifier: string) => {
    if (stryMutAct_9fa48("25512")) {
      {}
    } else {
      stryCov_9fa48("25512");
      return rateLimitWithFallback(identifier, GENERAL_RATE_LIMIT_COUNT, GENERAL_RATE_LIMIT_WINDOW_MS, stryMutAct_9fa48("25513") ? "" : (stryCov_9fa48("25513"), '10 s'));
    }
  },
  // Rate limit más estricto para autenticación
  auth: async (identifier: string) => {
    if (stryMutAct_9fa48("25514")) {
      {}
    } else {
      stryCov_9fa48("25514");
      return rateLimitWithFallback(identifier, AUTH_RATE_LIMIT_COUNT, AUTH_RATE_LIMIT_WINDOW_MS, stryMutAct_9fa48("25515") ? "" : (stryCov_9fa48("25515"), '1 m'));
    }
  },
  // Rate limit para operaciones de escritura (POST, PUT, DELETE)
  write: async (identifier: string) => {
    if (stryMutAct_9fa48("25516")) {
      {}
    } else {
      stryCov_9fa48("25516");
      return rateLimitWithFallback(identifier, WRITE_RATE_LIMIT_COUNT, WRITE_RATE_LIMIT_WINDOW_MS, stryMutAct_9fa48("25517") ? "" : (stryCov_9fa48("25517"), '1 m'));
    }
  },
  // Rate limit para operaciones de lectura (GET)
  read: async (identifier: string) => {
    if (stryMutAct_9fa48("25518")) {
      {}
    } else {
      stryCov_9fa48("25518");
      return rateLimitWithFallback(identifier, READ_RATE_LIMIT_COUNT, READ_RATE_LIMIT_WINDOW_MS, stryMutAct_9fa48("25519") ? "" : (stryCov_9fa48("25519"), '10 s'));
    }
  },
  // Rate limit estricto para endpoints sensibles (cambio de contraseña, etc.)
  sensitive: async (identifier: string) => {
    if (stryMutAct_9fa48("25520")) {
      {}
    } else {
      stryCov_9fa48("25520");
      return rateLimitWithFallback(identifier, SENSITIVE_RATE_LIMIT_COUNT, SENSITIVE_RATE_LIMIT_WINDOW_MS, stryMutAct_9fa48("25521") ? "" : (stryCov_9fa48("25521"), '5 m'));
    }
  },
  // Rate limit específico para crear desafíos (más estricto para evitar spam)
  challenge: async (identifier: string) => {
    if (stryMutAct_9fa48("25522")) {
      {}
    } else {
      stryCov_9fa48("25522");
      return rateLimitWithFallback(identifier, CHALLENGE_RATE_LIMIT_COUNT, CHALLENGE_RATE_LIMIT_WINDOW_MS, stryMutAct_9fa48("25523") ? "" : (stryCov_9fa48("25523"), '1 h'));
    }
  }
});