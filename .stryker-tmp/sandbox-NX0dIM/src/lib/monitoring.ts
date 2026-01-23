/**
 * Sistema de monitoreo de errores
 * Preparado para integración con Sentry, Datadog, o servicios similares
 * Compatible con cliente y servidor
 */
// @ts-nocheck


// Logger solo disponible en servidor (Node.js)
// Usamos una función helper para cargar el logger solo cuando sea necesario
// Esta función solo se ejecuta en el servidor (Next.js lo detecta por typeof window)
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
function getLogger() {
  if (stryMutAct_9fa48("25184")) {
    {}
  } else {
    stryCov_9fa48("25184");
    // Solo intentar cargar logger en servidor
    if (stryMutAct_9fa48("25187") ? typeof window === 'undefined' : stryMutAct_9fa48("25186") ? false : stryMutAct_9fa48("25185") ? true : (stryCov_9fa48("25185", "25186", "25187"), typeof window !== (stryMutAct_9fa48("25188") ? "" : (stryCov_9fa48("25188"), 'undefined')))) {
      if (stryMutAct_9fa48("25189")) {
        {}
      } else {
        stryCov_9fa48("25189");
        return null;
      }
    }

    // Esta parte solo se ejecuta en servidor, Next.js no la empaquetará para el cliente
    // gracias a la verificación de typeof window arriba
    try {
      if (stryMutAct_9fa48("25190")) {
        {}
      } else {
        stryCov_9fa48("25190");
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        // require() es necesario aquí porque logger solo está disponible en servidor
        // y necesitamos cargarlo condicionalmente sin afectar el bundle del cliente
        //  - logger solo disponible en servidor
        const loggerModule = require('./logger');
        return loggerModule.logger;
      }
    } catch {
      if (stryMutAct_9fa48("25191")) {
        {}
      } else {
        stryCov_9fa48("25191");
        // Logger no disponible, retornar null para usar console como fallback
        return null;
      }
    }
  }
}
interface ErrorContext {
  userId?: string;
  path?: string;
  userAgent?: string;
  timestamp?: string;
  [key: string]: unknown;
}
class MonitoringService {
  private enabled: boolean;
  private service: 'sentry' | 'console' | 'none';
  constructor() {
    if (stryMutAct_9fa48("25192")) {
      {}
    } else {
      stryCov_9fa48("25192");
      // Determinar qué servicio usar basado en variables de entorno
      this.enabled = stryMutAct_9fa48("25195") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("25194") ? false : stryMutAct_9fa48("25193") ? true : (stryCov_9fa48("25193", "25194", "25195"), process.env.NODE_ENV === (stryMutAct_9fa48("25196") ? "" : (stryCov_9fa48("25196"), 'production')));
      this.service = stryMutAct_9fa48("25199") ? process.env.MONITORING_SERVICE as 'sentry' | 'console' | 'none' && 'console' : stryMutAct_9fa48("25198") ? false : stryMutAct_9fa48("25197") ? true : (stryCov_9fa48("25197", "25198", "25199"), process.env.MONITORING_SERVICE as 'sentry' | 'console' | 'none' || (stryMutAct_9fa48("25200") ? "" : (stryCov_9fa48("25200"), 'console')));
    }
  }

  /**
   * Captura y reporta un error
   */
  captureError(error: Error, context?: ErrorContext): void {
    if (stryMutAct_9fa48("25201")) {
      {}
    } else {
      stryCov_9fa48("25201");
      if (stryMutAct_9fa48("25204") ? !this.enabled || this.service === 'none' : stryMutAct_9fa48("25203") ? false : stryMutAct_9fa48("25202") ? true : (stryCov_9fa48("25202", "25203", "25204"), (stryMutAct_9fa48("25205") ? this.enabled : (stryCov_9fa48("25205"), !this.enabled)) && (stryMutAct_9fa48("25207") ? this.service !== 'none' : stryMutAct_9fa48("25206") ? true : (stryCov_9fa48("25206", "25207"), this.service === (stryMutAct_9fa48("25208") ? "" : (stryCov_9fa48("25208"), 'none')))))) return;
      const errorContext: ErrorContext = stryMutAct_9fa48("25209") ? {} : (stryCov_9fa48("25209"), {
        ...context,
        timestamp: new Date().toISOString(),
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      const serverLogger = getLogger();
      switch (this.service) {
        case stryMutAct_9fa48("25211") ? "" : (stryCov_9fa48("25211"), 'sentry'):
          if (stryMutAct_9fa48("25210")) {} else {
            stryCov_9fa48("25210");
            // Integración con Sentry (requiere @sentry/nextjs)
            // if (typeof window !== 'undefined' && window.Sentry) {
            //   window.Sentry.captureException(error, { contexts: { custom: errorContext } })
            // }
            if (stryMutAct_9fa48("25213") ? false : stryMutAct_9fa48("25212") ? true : (stryCov_9fa48("25212", "25213"), serverLogger)) {
              if (stryMutAct_9fa48("25214")) {
                {}
              } else {
                stryCov_9fa48("25214");
                serverLogger.error(stryMutAct_9fa48("25215") ? {} : (stryCov_9fa48("25215"), {
                  type: stryMutAct_9fa48("25216") ? "" : (stryCov_9fa48("25216"), 'monitoring'),
                  service: stryMutAct_9fa48("25217") ? "" : (stryCov_9fa48("25217"), 'sentry'),
                  ...errorContext
                }), stryMutAct_9fa48("25218") ? "" : (stryCov_9fa48("25218"), 'Error capturado por Sentry'));
              }
            } else {
              if (stryMutAct_9fa48("25219")) {
                {}
              } else {
                stryCov_9fa48("25219");
                // Fallback: usar console (funciona en cliente y servidor)
                console.error(stryMutAct_9fa48("25220") ? "" : (stryCov_9fa48("25220"), '[Sentry] Error capturado:'), error, errorContext);
              }
            }
            break;
          }
        case stryMutAct_9fa48("25221") ? "" : (stryCov_9fa48("25221"), 'console'):
        default:
          if (stryMutAct_9fa48("25222")) {} else {
            stryCov_9fa48("25222");
            if (stryMutAct_9fa48("25224") ? false : stryMutAct_9fa48("25223") ? true : (stryCov_9fa48("25223", "25224"), serverLogger)) {
              if (stryMutAct_9fa48("25225")) {
                {}
              } else {
                stryCov_9fa48("25225");
                serverLogger.error(stryMutAct_9fa48("25226") ? {} : (stryCov_9fa48("25226"), {
                  type: stryMutAct_9fa48("25227") ? "" : (stryCov_9fa48("25227"), 'monitoring'),
                  service: stryMutAct_9fa48("25228") ? "" : (stryCov_9fa48("25228"), 'console'),
                  ...errorContext
                }), stryMutAct_9fa48("25229") ? "" : (stryCov_9fa48("25229"), 'Error capturado por Monitoring'));
              }
            } else {
              if (stryMutAct_9fa48("25230")) {
                {}
              } else {
                stryCov_9fa48("25230");
                // Fallback: usar console (funciona en cliente y servidor)
                console.error(stryMutAct_9fa48("25231") ? "" : (stryCov_9fa48("25231"), '[Monitoring] Error capturado:'), error, errorContext);
              }
            }
            break;
          }
      }
    }
  }

  /**
   * Captura un mensaje de advertencia
   */
  captureWarning(message: string, context?: ErrorContext): void {
    if (stryMutAct_9fa48("25232")) {
      {}
    } else {
      stryCov_9fa48("25232");
      if (stryMutAct_9fa48("25235") ? !this.enabled || this.service === 'none' : stryMutAct_9fa48("25234") ? false : stryMutAct_9fa48("25233") ? true : (stryCov_9fa48("25233", "25234", "25235"), (stryMutAct_9fa48("25236") ? this.enabled : (stryCov_9fa48("25236"), !this.enabled)) && (stryMutAct_9fa48("25238") ? this.service !== 'none' : stryMutAct_9fa48("25237") ? true : (stryCov_9fa48("25237", "25238"), this.service === (stryMutAct_9fa48("25239") ? "" : (stryCov_9fa48("25239"), 'none')))))) return;
      const warningContext: ErrorContext = stryMutAct_9fa48("25240") ? {} : (stryCov_9fa48("25240"), {
        ...context,
        timestamp: new Date().toISOString(),
        message
      });
      const serverLogger = getLogger();
      switch (this.service) {
        case stryMutAct_9fa48("25242") ? "" : (stryCov_9fa48("25242"), 'sentry'):
          if (stryMutAct_9fa48("25241")) {} else {
            stryCov_9fa48("25241");
            // if (typeof window !== 'undefined' && window.Sentry) {
            //   window.Sentry.captureMessage(message, 'warning', { contexts: { custom: warningContext } })
            // }
            if (stryMutAct_9fa48("25244") ? false : stryMutAct_9fa48("25243") ? true : (stryCov_9fa48("25243", "25244"), serverLogger)) {
              if (stryMutAct_9fa48("25245")) {
                {}
              } else {
                stryCov_9fa48("25245");
                serverLogger.warn(stryMutAct_9fa48("25246") ? {} : (stryCov_9fa48("25246"), {
                  type: stryMutAct_9fa48("25247") ? "" : (stryCov_9fa48("25247"), 'monitoring'),
                  service: stryMutAct_9fa48("25248") ? "" : (stryCov_9fa48("25248"), 'sentry'),
                  ...warningContext
                }), message);
              }
            } else {
              if (stryMutAct_9fa48("25249")) {
                {}
              } else {
                stryCov_9fa48("25249");
                console.warn(stryMutAct_9fa48("25250") ? "" : (stryCov_9fa48("25250"), '[Sentry] Warning:'), message, warningContext);
              }
            }
            break;
          }
        case stryMutAct_9fa48("25251") ? "" : (stryCov_9fa48("25251"), 'console'):
        default:
          if (stryMutAct_9fa48("25252")) {} else {
            stryCov_9fa48("25252");
            if (stryMutAct_9fa48("25254") ? false : stryMutAct_9fa48("25253") ? true : (stryCov_9fa48("25253", "25254"), serverLogger)) {
              if (stryMutAct_9fa48("25255")) {
                {}
              } else {
                stryCov_9fa48("25255");
                serverLogger.warn(stryMutAct_9fa48("25256") ? {} : (stryCov_9fa48("25256"), {
                  type: stryMutAct_9fa48("25257") ? "" : (stryCov_9fa48("25257"), 'monitoring'),
                  service: stryMutAct_9fa48("25258") ? "" : (stryCov_9fa48("25258"), 'console'),
                  ...warningContext
                }), message);
              }
            } else {
              if (stryMutAct_9fa48("25259")) {
                {}
              } else {
                stryCov_9fa48("25259");
                console.warn(stryMutAct_9fa48("25260") ? "" : (stryCov_9fa48("25260"), '[Monitoring] Warning:'), message, warningContext);
              }
            }
            break;
          }
      }
    }
  }

  /**
   * Captura un evento personalizado
   */
  captureEvent(eventName: string, data?: Record<string, unknown>): void {
    if (stryMutAct_9fa48("25261")) {
      {}
    } else {
      stryCov_9fa48("25261");
      if (stryMutAct_9fa48("25264") ? !this.enabled || this.service === 'none' : stryMutAct_9fa48("25263") ? false : stryMutAct_9fa48("25262") ? true : (stryCov_9fa48("25262", "25263", "25264"), (stryMutAct_9fa48("25265") ? this.enabled : (stryCov_9fa48("25265"), !this.enabled)) && (stryMutAct_9fa48("25267") ? this.service !== 'none' : stryMutAct_9fa48("25266") ? true : (stryCov_9fa48("25266", "25267"), this.service === (stryMutAct_9fa48("25268") ? "" : (stryCov_9fa48("25268"), 'none')))))) return;
      const eventData = stryMutAct_9fa48("25269") ? {} : (stryCov_9fa48("25269"), {
        ...data,
        eventName,
        timestamp: new Date().toISOString()
      });
      const serverLogger = getLogger();
      switch (this.service) {
        case stryMutAct_9fa48("25271") ? "" : (stryCov_9fa48("25271"), 'sentry'):
          if (stryMutAct_9fa48("25270")) {} else {
            stryCov_9fa48("25270");
            // if (typeof window !== 'undefined' && window.Sentry) {
            //   window.Sentry.addBreadcrumb({ message: eventName, data: eventData, level: 'info' })
            // }
            if (stryMutAct_9fa48("25273") ? false : stryMutAct_9fa48("25272") ? true : (stryCov_9fa48("25272", "25273"), serverLogger)) {
              if (stryMutAct_9fa48("25274")) {
                {}
              } else {
                stryCov_9fa48("25274");
                serverLogger.info(stryMutAct_9fa48("25275") ? {} : (stryCov_9fa48("25275"), {
                  type: stryMutAct_9fa48("25276") ? "" : (stryCov_9fa48("25276"), 'monitoring'),
                  service: stryMutAct_9fa48("25277") ? "" : (stryCov_9fa48("25277"), 'sentry'),
                  event: eventName,
                  ...eventData
                }), stryMutAct_9fa48("25278") ? `` : (stryCov_9fa48("25278"), `Evento capturado: ${eventName}`));
              }
            } else {
              if (stryMutAct_9fa48("25279")) {
                {}
              } else {
                stryCov_9fa48("25279");
                console.log(stryMutAct_9fa48("25280") ? "" : (stryCov_9fa48("25280"), '[Sentry] Event:'), eventName, eventData);
              }
            }
            break;
          }
        case stryMutAct_9fa48("25281") ? "" : (stryCov_9fa48("25281"), 'console'):
        default:
          if (stryMutAct_9fa48("25282")) {} else {
            stryCov_9fa48("25282");
            if (stryMutAct_9fa48("25284") ? false : stryMutAct_9fa48("25283") ? true : (stryCov_9fa48("25283", "25284"), serverLogger)) {
              if (stryMutAct_9fa48("25285")) {
                {}
              } else {
                stryCov_9fa48("25285");
                serverLogger.info(stryMutAct_9fa48("25286") ? {} : (stryCov_9fa48("25286"), {
                  type: stryMutAct_9fa48("25287") ? "" : (stryCov_9fa48("25287"), 'monitoring'),
                  service: stryMutAct_9fa48("25288") ? "" : (stryCov_9fa48("25288"), 'console'),
                  event: eventName,
                  ...eventData
                }), stryMutAct_9fa48("25289") ? `` : (stryCov_9fa48("25289"), `Evento capturado: ${eventName}`));
              }
            } else {
              if (stryMutAct_9fa48("25290")) {
                {}
              } else {
                stryCov_9fa48("25290");
                console.log(stryMutAct_9fa48("25291") ? "" : (stryCov_9fa48("25291"), '[Monitoring] Event:'), eventName, eventData);
              }
            }
            break;
          }
      }
    }
  }

  /**
   * Configura el contexto del usuario para todos los eventos
   */
  setUserContext(userId: string, userData?: Record<string, unknown>): void {
    if (stryMutAct_9fa48("25292")) {
      {}
    } else {
      stryCov_9fa48("25292");
      // if (this.service === 'sentry' && typeof window !== 'undefined' && window.Sentry) {
      //   window.Sentry.setUser({ id: userId, ...userData })
      // }
      const serverLogger = getLogger();
      if (stryMutAct_9fa48("25294") ? false : stryMutAct_9fa48("25293") ? true : (stryCov_9fa48("25293", "25294"), serverLogger)) {
        if (stryMutAct_9fa48("25295")) {
          {}
        } else {
          stryCov_9fa48("25295");
          serverLogger.info(stryMutAct_9fa48("25296") ? {} : (stryCov_9fa48("25296"), {
            type: stryMutAct_9fa48("25297") ? "" : (stryCov_9fa48("25297"), 'monitoring'),
            event: stryMutAct_9fa48("25298") ? "" : (stryCov_9fa48("25298"), 'user_context_set'),
            userId,
            ...userData
          }), stryMutAct_9fa48("25299") ? "" : (stryCov_9fa48("25299"), 'Contexto de usuario configurado'));
        }
      } else {
        if (stryMutAct_9fa48("25300")) {
          {}
        } else {
          stryCov_9fa48("25300");
          console.log(stryMutAct_9fa48("25301") ? "" : (stryCov_9fa48("25301"), '[Monitoring] User context set:'), userId, userData);
        }
      }
    }
  }
}

// Singleton instance
export const monitoring = new MonitoringService();

/**
 * Helper para capturar errores de forma consistente
 */
export function captureError(error: Error | unknown, context?: ErrorContext): void {
  if (stryMutAct_9fa48("25302")) {
    {}
  } else {
    stryCov_9fa48("25302");
    if (stryMutAct_9fa48("25304") ? false : stryMutAct_9fa48("25303") ? true : (stryCov_9fa48("25303", "25304"), error instanceof Error)) {
      if (stryMutAct_9fa48("25305")) {
        {}
      } else {
        stryCov_9fa48("25305");
        monitoring.captureError(error, context);
      }
    } else {
      if (stryMutAct_9fa48("25306")) {
        {}
      } else {
        stryCov_9fa48("25306");
        monitoring.captureError(new Error(String(error)), context);
      }
    }
  }
}

/**
 * Helper para capturar errores de API
 */
export function captureApiError(error: Error | unknown, path: string, userId?: string): void {
  if (stryMutAct_9fa48("25307")) {
    {}
  } else {
    stryCov_9fa48("25307");
    captureError(error, stryMutAct_9fa48("25308") ? {} : (stryCov_9fa48("25308"), {
      type: stryMutAct_9fa48("25309") ? "" : (stryCov_9fa48("25309"), 'api_error'),
      path,
      userId
    }));
  }
}