// @ts-nocheck
// Logger compatible con Edge Runtime
// pino-pretty NO se importa en tiempo de módulo para evitar problemas con fs

// Definir tipos para el logger
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
interface LoggerInstance {
  info: (obj: Record<string, unknown>, msg?: string) => void;
  error: (obj: Record<string, unknown>, msg?: string) => void;
  debug: (obj: Record<string, unknown>, msg?: string) => void;
  warn: (obj: Record<string, unknown>, msg?: string) => void;
}
type LoggerProxy = LoggerInstance & {
  [key: string]: unknown;
};
let loggerInstance: LoggerInstance | null = null;
function getLogger(): LoggerInstance {
  if (stryMutAct_9fa48("25028")) {
    {}
  } else {
    stryCov_9fa48("25028");
    if (stryMutAct_9fa48("25030") ? false : stryMutAct_9fa48("25029") ? true : (stryCov_9fa48("25029", "25030"), loggerInstance)) {
      if (stryMutAct_9fa48("25031")) {
        {}
      } else {
        stryCov_9fa48("25031");
        return loggerInstance;
      }
    }

    // Detectar si estamos en el cliente (browser) o Edge Runtime
    const isBrowser = stryMutAct_9fa48("25034") ? typeof window === 'undefined' : stryMutAct_9fa48("25033") ? false : stryMutAct_9fa48("25032") ? true : (stryCov_9fa48("25032", "25033", "25034"), typeof window !== (stryMutAct_9fa48("25035") ? "" : (stryCov_9fa48("25035"), 'undefined')));
    const isEdgeRuntime = stryMutAct_9fa48("25038") ? typeof process !== 'undefined' && process.env.NEXT_RUNTIME === 'edge' && typeof globalThis !== 'undefined' && 'EdgeRuntime' in globalThis : stryMutAct_9fa48("25037") ? false : stryMutAct_9fa48("25036") ? true : (stryCov_9fa48("25036", "25037", "25038"), (stryMutAct_9fa48("25040") ? typeof process !== 'undefined' || process.env.NEXT_RUNTIME === 'edge' : stryMutAct_9fa48("25039") ? false : (stryCov_9fa48("25039", "25040"), (stryMutAct_9fa48("25042") ? typeof process === 'undefined' : stryMutAct_9fa48("25041") ? true : (stryCov_9fa48("25041", "25042"), typeof process !== (stryMutAct_9fa48("25043") ? "" : (stryCov_9fa48("25043"), 'undefined')))) && (stryMutAct_9fa48("25045") ? process.env.NEXT_RUNTIME !== 'edge' : stryMutAct_9fa48("25044") ? true : (stryCov_9fa48("25044", "25045"), process.env.NEXT_RUNTIME === (stryMutAct_9fa48("25046") ? "" : (stryCov_9fa48("25046"), 'edge')))))) || (stryMutAct_9fa48("25048") ? typeof globalThis !== 'undefined' || 'EdgeRuntime' in globalThis : stryMutAct_9fa48("25047") ? false : (stryCov_9fa48("25047", "25048"), (stryMutAct_9fa48("25050") ? typeof globalThis === 'undefined' : stryMutAct_9fa48("25049") ? true : (stryCov_9fa48("25049", "25050"), typeof globalThis !== (stryMutAct_9fa48("25051") ? "" : (stryCov_9fa48("25051"), 'undefined')))) && (stryMutAct_9fa48("25052") ? "" : (stryCov_9fa48("25052"), 'EdgeRuntime')) in globalThis)));
    if (stryMutAct_9fa48("25055") ? isBrowser && isEdgeRuntime : stryMutAct_9fa48("25054") ? false : stryMutAct_9fa48("25053") ? true : (stryCov_9fa48("25053", "25054", "25055"), isBrowser || isEdgeRuntime)) {
      if (stryMutAct_9fa48("25056")) {
        {}
      } else {
        stryCov_9fa48("25056");
        // Logger simple para Browser/Edge Runtime (sin pino)
        loggerInstance = stryMutAct_9fa48("25057") ? {} : (stryCov_9fa48("25057"), {
          info: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25058")) {
              {}
            } else {
              stryCov_9fa48("25058");
              if (stryMutAct_9fa48("25060") ? false : stryMutAct_9fa48("25059") ? true : (stryCov_9fa48("25059", "25060"), isBrowser)) {
                if (stryMutAct_9fa48("25061")) {
                  {}
                } else {
                  stryCov_9fa48("25061");
                  console.log(stryMutAct_9fa48("25062") ? "" : (stryCov_9fa48("25062"), '[INFO]'), stryMutAct_9fa48("25065") ? msg && '' : stryMutAct_9fa48("25064") ? false : stryMutAct_9fa48("25063") ? true : (stryCov_9fa48("25063", "25064", "25065"), msg || (stryMutAct_9fa48("25066") ? "Stryker was here!" : (stryCov_9fa48("25066"), ''))), obj);
                }
              } else {
                if (stryMutAct_9fa48("25067")) {
                  {}
                } else {
                  stryCov_9fa48("25067");
                  console.log(JSON.stringify(stryMutAct_9fa48("25068") ? {} : (stryCov_9fa48("25068"), {
                    level: stryMutAct_9fa48("25069") ? "" : (stryCov_9fa48("25069"), 'info'),
                    ...obj,
                    msg: stryMutAct_9fa48("25072") ? msg && '' : stryMutAct_9fa48("25071") ? false : stryMutAct_9fa48("25070") ? true : (stryCov_9fa48("25070", "25071", "25072"), msg || (stryMutAct_9fa48("25073") ? "Stryker was here!" : (stryCov_9fa48("25073"), '')))
                  })));
                }
              }
            }
          },
          error: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25074")) {
              {}
            } else {
              stryCov_9fa48("25074");
              if (stryMutAct_9fa48("25076") ? false : stryMutAct_9fa48("25075") ? true : (stryCov_9fa48("25075", "25076"), isBrowser)) {
                if (stryMutAct_9fa48("25077")) {
                  {}
                } else {
                  stryCov_9fa48("25077");
                  console.error(stryMutAct_9fa48("25078") ? "" : (stryCov_9fa48("25078"), '[ERROR]'), stryMutAct_9fa48("25081") ? msg && '' : stryMutAct_9fa48("25080") ? false : stryMutAct_9fa48("25079") ? true : (stryCov_9fa48("25079", "25080", "25081"), msg || (stryMutAct_9fa48("25082") ? "Stryker was here!" : (stryCov_9fa48("25082"), ''))), obj);
                }
              } else {
                if (stryMutAct_9fa48("25083")) {
                  {}
                } else {
                  stryCov_9fa48("25083");
                  console.error(JSON.stringify(stryMutAct_9fa48("25084") ? {} : (stryCov_9fa48("25084"), {
                    level: stryMutAct_9fa48("25085") ? "" : (stryCov_9fa48("25085"), 'error'),
                    ...obj,
                    msg: stryMutAct_9fa48("25088") ? msg && '' : stryMutAct_9fa48("25087") ? false : stryMutAct_9fa48("25086") ? true : (stryCov_9fa48("25086", "25087", "25088"), msg || (stryMutAct_9fa48("25089") ? "Stryker was here!" : (stryCov_9fa48("25089"), '')))
                  })));
                }
              }
            }
          },
          debug: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25090")) {
              {}
            } else {
              stryCov_9fa48("25090");
              if (stryMutAct_9fa48("25092") ? false : stryMutAct_9fa48("25091") ? true : (stryCov_9fa48("25091", "25092"), isBrowser)) {
                if (stryMutAct_9fa48("25093")) {
                  {}
                } else {
                  stryCov_9fa48("25093");
                  console.debug(stryMutAct_9fa48("25094") ? "" : (stryCov_9fa48("25094"), '[DEBUG]'), stryMutAct_9fa48("25097") ? msg && '' : stryMutAct_9fa48("25096") ? false : stryMutAct_9fa48("25095") ? true : (stryCov_9fa48("25095", "25096", "25097"), msg || (stryMutAct_9fa48("25098") ? "Stryker was here!" : (stryCov_9fa48("25098"), ''))), obj);
                }
              } else {
                if (stryMutAct_9fa48("25099")) {
                  {}
                } else {
                  stryCov_9fa48("25099");
                  console.debug(JSON.stringify(stryMutAct_9fa48("25100") ? {} : (stryCov_9fa48("25100"), {
                    level: stryMutAct_9fa48("25101") ? "" : (stryCov_9fa48("25101"), 'debug'),
                    ...obj,
                    msg: stryMutAct_9fa48("25104") ? msg && '' : stryMutAct_9fa48("25103") ? false : stryMutAct_9fa48("25102") ? true : (stryCov_9fa48("25102", "25103", "25104"), msg || (stryMutAct_9fa48("25105") ? "Stryker was here!" : (stryCov_9fa48("25105"), '')))
                  })));
                }
              }
            }
          },
          warn: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25106")) {
              {}
            } else {
              stryCov_9fa48("25106");
              if (stryMutAct_9fa48("25108") ? false : stryMutAct_9fa48("25107") ? true : (stryCov_9fa48("25107", "25108"), isBrowser)) {
                if (stryMutAct_9fa48("25109")) {
                  {}
                } else {
                  stryCov_9fa48("25109");
                  console.warn(stryMutAct_9fa48("25110") ? "" : (stryCov_9fa48("25110"), '[WARN]'), stryMutAct_9fa48("25113") ? msg && '' : stryMutAct_9fa48("25112") ? false : stryMutAct_9fa48("25111") ? true : (stryCov_9fa48("25111", "25112", "25113"), msg || (stryMutAct_9fa48("25114") ? "Stryker was here!" : (stryCov_9fa48("25114"), ''))), obj);
                }
              } else {
                if (stryMutAct_9fa48("25115")) {
                  {}
                } else {
                  stryCov_9fa48("25115");
                  console.warn(JSON.stringify(stryMutAct_9fa48("25116") ? {} : (stryCov_9fa48("25116"), {
                    level: stryMutAct_9fa48("25117") ? "" : (stryCov_9fa48("25117"), 'warn'),
                    ...obj,
                    msg: stryMutAct_9fa48("25120") ? msg && '' : stryMutAct_9fa48("25119") ? false : stryMutAct_9fa48("25118") ? true : (stryCov_9fa48("25118", "25119", "25120"), msg || (stryMutAct_9fa48("25121") ? "Stryker was here!" : (stryCov_9fa48("25121"), '')))
                  })));
                }
              }
            }
          }
        });
        return loggerInstance;
      }
    }

    // Solo importar pino en Node.js runtime (no en browser ni edge)
    // Verificar que estamos en Node.js
    if (stryMutAct_9fa48("25124") ? typeof process === 'undefined' && !process.versions?.node : stryMutAct_9fa48("25123") ? false : stryMutAct_9fa48("25122") ? true : (stryCov_9fa48("25122", "25123", "25124"), (stryMutAct_9fa48("25126") ? typeof process !== 'undefined' : stryMutAct_9fa48("25125") ? false : (stryCov_9fa48("25125", "25126"), typeof process === (stryMutAct_9fa48("25127") ? "" : (stryCov_9fa48("25127"), 'undefined')))) || (stryMutAct_9fa48("25128") ? process.versions?.node : (stryCov_9fa48("25128"), !(stryMutAct_9fa48("25129") ? process.versions.node : (stryCov_9fa48("25129"), process.versions?.node)))))) {
      if (stryMutAct_9fa48("25130")) {
        {}
      } else {
        stryCov_9fa48("25130");
        // Fallback a logger simple si no estamos en Node.js
        loggerInstance = stryMutAct_9fa48("25131") ? {} : (stryCov_9fa48("25131"), {
          info: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25132")) {
              {}
            } else {
              stryCov_9fa48("25132");
              console.log(stryMutAct_9fa48("25133") ? "" : (stryCov_9fa48("25133"), '[INFO]'), stryMutAct_9fa48("25136") ? msg && '' : stryMutAct_9fa48("25135") ? false : stryMutAct_9fa48("25134") ? true : (stryCov_9fa48("25134", "25135", "25136"), msg || (stryMutAct_9fa48("25137") ? "Stryker was here!" : (stryCov_9fa48("25137"), ''))), obj);
            }
          },
          error: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25138")) {
              {}
            } else {
              stryCov_9fa48("25138");
              console.error(stryMutAct_9fa48("25139") ? "" : (stryCov_9fa48("25139"), '[ERROR]'), stryMutAct_9fa48("25142") ? msg && '' : stryMutAct_9fa48("25141") ? false : stryMutAct_9fa48("25140") ? true : (stryCov_9fa48("25140", "25141", "25142"), msg || (stryMutAct_9fa48("25143") ? "Stryker was here!" : (stryCov_9fa48("25143"), ''))), obj);
            }
          },
          debug: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25144")) {
              {}
            } else {
              stryCov_9fa48("25144");
              console.debug(stryMutAct_9fa48("25145") ? "" : (stryCov_9fa48("25145"), '[DEBUG]'), stryMutAct_9fa48("25148") ? msg && '' : stryMutAct_9fa48("25147") ? false : stryMutAct_9fa48("25146") ? true : (stryCov_9fa48("25146", "25147", "25148"), msg || (stryMutAct_9fa48("25149") ? "Stryker was here!" : (stryCov_9fa48("25149"), ''))), obj);
            }
          },
          warn: (obj: Record<string, unknown>, msg?: string) => {
            if (stryMutAct_9fa48("25150")) {
              {}
            } else {
              stryCov_9fa48("25150");
              console.warn(stryMutAct_9fa48("25151") ? "" : (stryCov_9fa48("25151"), '[WARN]'), stryMutAct_9fa48("25154") ? msg && '' : stryMutAct_9fa48("25153") ? false : stryMutAct_9fa48("25152") ? true : (stryCov_9fa48("25152", "25153", "25154"), msg || (stryMutAct_9fa48("25155") ? "Stryker was here!" : (stryCov_9fa48("25155"), ''))), obj);
            }
          }
        });
        return loggerInstance;
      }
    }

    // Solo importar pino en Node.js runtime
    // Nota: require() es necesario aquí porque pino no soporta dynamic import en tiempo de ejecución
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pinoModule = require('pino') as {
      default?: typeof import('pino');
      [key: string]: unknown;
    };
    const pino = (pinoModule.default || pinoModule) as typeof import('pino');
    const isDevelopment = stryMutAct_9fa48("25158") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("25157") ? false : stryMutAct_9fa48("25156") ? true : (stryCov_9fa48("25156", "25157", "25158"), process.env.NODE_ENV === (stryMutAct_9fa48("25159") ? "" : (stryCov_9fa48("25159"), 'development')));

    // Crear logger sin transport inicialmente
    loggerInstance = pino({
      level: process.env.LOG_LEVEL || (isDevelopment ? 'debug' : 'info'),
      base: {
        env: process.env.NODE_ENV || 'development',
        service: 'paes-tutor'
      }
    }) as LoggerInstance;

    // Solo agregar pino-pretty en desarrollo y si está disponible
    if (stryMutAct_9fa48("25161") ? false : stryMutAct_9fa48("25160") ? true : (stryCov_9fa48("25160", "25161"), isDevelopment)) {
      if (stryMutAct_9fa48("25162")) {
        {}
      } else {
        stryCov_9fa48("25162");
        try {
          if (stryMutAct_9fa48("25163")) {
            {}
          } else {
            stryCov_9fa48("25163");
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            // Cargar pino-pretty dinámicamente solo cuando se necesite (solo en desarrollo)
            // require() es necesario porque dynamic import no funciona en este contexto de inicialización
            require('pino-pretty');
            loggerInstance = pino({
              level: 'debug',
              transport: {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'HH:MM:ss Z',
                  ignore: 'pid,hostname'
                }
              },
              base: {
                env: 'development',
                service: 'paes-tutor'
              }
            }) as LoggerInstance;
          }
        } catch {
          // Si pino-pretty no está disponible, usar logger básico
          // loggerInstance ya está configurado arriba
        }
      }
    }
    return loggerInstance;
  }
}
export const logger = new Proxy({} as LoggerProxy, stryMutAct_9fa48("25164") ? {} : (stryCov_9fa48("25164"), {
  get(_target, prop) {
    if (stryMutAct_9fa48("25165")) {
      {}
    } else {
      stryCov_9fa48("25165");
      const instance = getLogger();
      return (instance as unknown as Record<string, unknown>)[prop as string];
    }
  }
}));

// Helpers para logging estructurado
export const logApiRequest = (method: string, path: string, userId?: string) => {
  if (stryMutAct_9fa48("25166")) {
    {}
  } else {
    stryCov_9fa48("25166");
    logger.info(stryMutAct_9fa48("25167") ? {} : (stryCov_9fa48("25167"), {
      type: stryMutAct_9fa48("25168") ? "" : (stryCov_9fa48("25168"), 'api_request'),
      method,
      path,
      userId
    }), stryMutAct_9fa48("25169") ? `` : (stryCov_9fa48("25169"), `${method} ${path}`));
  }
};
export const logApiError = (error: Error, context?: Record<string, unknown>) => {
  if (stryMutAct_9fa48("25170")) {
    {}
  } else {
    stryCov_9fa48("25170");
    logger.error(stryMutAct_9fa48("25171") ? {} : (stryCov_9fa48("25171"), {
      type: stryMutAct_9fa48("25172") ? "" : (stryCov_9fa48("25172"), 'api_error'),
      error: stryMutAct_9fa48("25173") ? {} : (stryCov_9fa48("25173"), {
        name: error.name,
        message: error.message,
        stack: error.stack
      }),
      ...context
    }), stryMutAct_9fa48("25174") ? "" : (stryCov_9fa48("25174"), 'API Error'));
  }
};
export const logDatabaseQuery = (operation: string, model: string, duration?: number) => {
  if (stryMutAct_9fa48("25175")) {
    {}
  } else {
    stryCov_9fa48("25175");
    logger.debug(stryMutAct_9fa48("25176") ? {} : (stryCov_9fa48("25176"), {
      type: stryMutAct_9fa48("25177") ? "" : (stryCov_9fa48("25177"), 'database_query'),
      operation,
      model,
      duration
    }), stryMutAct_9fa48("25178") ? `` : (stryCov_9fa48("25178"), `DB ${operation} ${model}`));
  }
};
export const logAuthEvent = (event: string, userId?: string, success: boolean = stryMutAct_9fa48("25179") ? false : (stryCov_9fa48("25179"), true)) => {
  if (stryMutAct_9fa48("25180")) {
    {}
  } else {
    stryCov_9fa48("25180");
    logger.info(stryMutAct_9fa48("25181") ? {} : (stryCov_9fa48("25181"), {
      type: stryMutAct_9fa48("25182") ? "" : (stryCov_9fa48("25182"), 'auth_event'),
      event,
      userId,
      success
    }), stryMutAct_9fa48("25183") ? `` : (stryCov_9fa48("25183"), `Auth: ${event}`));
  }
};