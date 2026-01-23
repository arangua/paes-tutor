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
import { NextRequest, NextResponse } from 'next/server';
import { ZodError, ZodSchema } from 'zod';
import { logger, logApiError } from './logger';
import { sanitizeString, containsDangerousPatterns, sanitizeObject } from './security';
import { logSecurityEvent, getClientIp, detectSuspiciousActivity } from './security-logger';

/**
 * Valida los parámetros de la query string
 */
export function validateQuery<T>(request: NextRequest, schema: ZodSchema<T>): {
  success: true;
  data: T;
} | {
  success: false;
  error: NextResponse;
} {
  if (stryMutAct_9fa48("22927")) {
    {}
  } else {
    stryCov_9fa48("22927");
    try {
      if (stryMutAct_9fa48("22928")) {
        {}
      } else {
        stryCov_9fa48("22928");
        const searchParams = request.nextUrl.searchParams;
        const params = Object.fromEntries(searchParams.entries());

        // Sanitizar valores de string en params
        const sanitizedParams: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(params)) {
          if (stryMutAct_9fa48("22929")) {
            {}
          } else {
            stryCov_9fa48("22929");
            if (stryMutAct_9fa48("22932") ? typeof value !== 'string' : stryMutAct_9fa48("22931") ? false : stryMutAct_9fa48("22930") ? true : (stryCov_9fa48("22930", "22931", "22932"), typeof value === (stryMutAct_9fa48("22933") ? "" : (stryCov_9fa48("22933"), 'string')))) {
              if (stryMutAct_9fa48("22934")) {
                {}
              } else {
                stryCov_9fa48("22934");
                sanitizedParams[key] = sanitizeString(value);

                // Detectar patrones peligrosos
                if (stryMutAct_9fa48("22936") ? false : stryMutAct_9fa48("22935") ? true : (stryCov_9fa48("22935", "22936"), containsDangerousPatterns(value))) {
                  if (stryMutAct_9fa48("22937")) {
                    {}
                  } else {
                    stryCov_9fa48("22937");
                    const ip = getClientIp(request);
                    logSecurityEvent(stryMutAct_9fa48("22938") ? {} : (stryCov_9fa48("22938"), {
                      type: stryMutAct_9fa48("22939") ? "" : (stryCov_9fa48("22939"), 'suspicious_activity'),
                      ip,
                      path: request.nextUrl.pathname,
                      details: stryMutAct_9fa48("22940") ? {} : (stryCov_9fa48("22940"), {
                        key,
                        value: stryMutAct_9fa48("22941") ? value : (stryCov_9fa48("22941"), value.substring(0, 100))
                      }),
                      severity: stryMutAct_9fa48("22942") ? "" : (stryCov_9fa48("22942"), 'high')
                    }));
                    return stryMutAct_9fa48("22943") ? {} : (stryCov_9fa48("22943"), {
                      success: stryMutAct_9fa48("22944") ? true : (stryCov_9fa48("22944"), false),
                      error: NextResponse.json(stryMutAct_9fa48("22945") ? {} : (stryCov_9fa48("22945"), {
                        error: stryMutAct_9fa48("22946") ? "" : (stryCov_9fa48("22946"), 'Parámetros inválidos detectados')
                      }), stryMutAct_9fa48("22947") ? {} : (stryCov_9fa48("22947"), {
                        status: 400
                      }))
                    });
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("22948")) {
                {}
              } else {
                stryCov_9fa48("22948");
                sanitizedParams[key] = value;
              }
            }
          }
        }
        const data = schema.parse(sanitizedParams);
        return stryMutAct_9fa48("22949") ? {} : (stryCov_9fa48("22949"), {
          success: stryMutAct_9fa48("22950") ? false : (stryCov_9fa48("22950"), true),
          data
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("22951")) {
        {}
      } else {
        stryCov_9fa48("22951");
        if (stryMutAct_9fa48("22953") ? false : stryMutAct_9fa48("22952") ? true : (stryCov_9fa48("22952", "22953"), error instanceof ZodError)) {
          if (stryMutAct_9fa48("22954")) {
            {}
          } else {
            stryCov_9fa48("22954");
            return stryMutAct_9fa48("22955") ? {} : (stryCov_9fa48("22955"), {
              success: stryMutAct_9fa48("22956") ? true : (stryCov_9fa48("22956"), false),
              error: NextResponse.json(stryMutAct_9fa48("22957") ? {} : (stryCov_9fa48("22957"), {
                error: stryMutAct_9fa48("22958") ? "" : (stryCov_9fa48("22958"), 'Parámetros inválidos'),
                details: error.issues
              }), stryMutAct_9fa48("22959") ? {} : (stryCov_9fa48("22959"), {
                status: 400
              }))
            });
          }
        }
        return stryMutAct_9fa48("22960") ? {} : (stryCov_9fa48("22960"), {
          success: stryMutAct_9fa48("22961") ? true : (stryCov_9fa48("22961"), false),
          error: NextResponse.json(stryMutAct_9fa48("22962") ? {} : (stryCov_9fa48("22962"), {
            error: stryMutAct_9fa48("22963") ? "" : (stryCov_9fa48("22963"), 'Error de validación')
          }), stryMutAct_9fa48("22964") ? {} : (stryCov_9fa48("22964"), {
            status: 400
          }))
        });
      }
    }
  }
}

/**
 * Valida el body de la request
 */
export async function validateBody<T>(request: NextRequest, schema: ZodSchema<T>): Promise<{
  success: true;
  data: T;
} | {
  success: false;
  error: NextResponse;
}> {
  if (stryMutAct_9fa48("22965")) {
    {}
  } else {
    stryCov_9fa48("22965");
    try {
      if (stryMutAct_9fa48("22966")) {
        {}
      } else {
        stryCov_9fa48("22966");
        let body;
        try {
          if (stryMutAct_9fa48("22967")) {
            {}
          } else {
            stryCov_9fa48("22967");
            body = await request.json();
          }
        } catch (parseError) {
          if (stryMutAct_9fa48("22968")) {
            {}
          } else {
            stryCov_9fa48("22968");
            const ip = getClientIp(request);
            logSecurityEvent(stryMutAct_9fa48("22969") ? {} : (stryCov_9fa48("22969"), {
              type: stryMutAct_9fa48("22970") ? "" : (stryCov_9fa48("22970"), 'invalid_input'),
              ip,
              path: request.nextUrl.pathname,
              details: stryMutAct_9fa48("22971") ? {} : (stryCov_9fa48("22971"), {
                error: stryMutAct_9fa48("22972") ? "" : (stryCov_9fa48("22972"), 'JSON inválido')
              }),
              severity: stryMutAct_9fa48("22973") ? "" : (stryCov_9fa48("22973"), 'medium')
            }));
            return stryMutAct_9fa48("22974") ? {} : (stryCov_9fa48("22974"), {
              success: stryMutAct_9fa48("22975") ? true : (stryCov_9fa48("22975"), false),
              error: NextResponse.json(stryMutAct_9fa48("22976") ? {} : (stryCov_9fa48("22976"), {
                error: stryMutAct_9fa48("22977") ? "" : (stryCov_9fa48("22977"), 'Body inválido o no es JSON válido')
              }), stryMutAct_9fa48("22978") ? {} : (stryCov_9fa48("22978"), {
                status: 400
              }))
            });
          }
        }

        // Sanitizar body si contiene strings
        if (stryMutAct_9fa48("22981") ? typeof body === 'object' || body !== null : stryMutAct_9fa48("22980") ? false : stryMutAct_9fa48("22979") ? true : (stryCov_9fa48("22979", "22980", "22981"), (stryMutAct_9fa48("22983") ? typeof body !== 'object' : stryMutAct_9fa48("22982") ? true : (stryCov_9fa48("22982", "22983"), typeof body === (stryMutAct_9fa48("22984") ? "" : (stryCov_9fa48("22984"), 'object')))) && (stryMutAct_9fa48("22986") ? body === null : stryMutAct_9fa48("22985") ? true : (stryCov_9fa48("22985", "22986"), body !== null)))) {
          if (stryMutAct_9fa48("22987")) {
            {}
          } else {
            stryCov_9fa48("22987");
            const sanitizedBody = sanitizeObject(body as Record<string, unknown>);

            // Detectar actividad sospechosa
            const ip = getClientIp(request);
            if (stryMutAct_9fa48("22989") ? false : stryMutAct_9fa48("22988") ? true : (stryCov_9fa48("22988", "22989"), detectSuspiciousActivity(ip, request.nextUrl.pathname, sanitizedBody))) {
              if (stryMutAct_9fa48("22990")) {
                {}
              } else {
                stryCov_9fa48("22990");
                logSecurityEvent(stryMutAct_9fa48("22991") ? {} : (stryCov_9fa48("22991"), {
                  type: stryMutAct_9fa48("22992") ? "" : (stryCov_9fa48("22992"), 'suspicious_activity'),
                  ip,
                  path: request.nextUrl.pathname,
                  details: stryMutAct_9fa48("22993") ? {} : (stryCov_9fa48("22993"), {
                    body: stryMutAct_9fa48("22994") ? JSON.stringify(sanitizedBody) : (stryCov_9fa48("22994"), JSON.stringify(sanitizedBody).substring(0, 200))
                  }),
                  severity: stryMutAct_9fa48("22995") ? "" : (stryCov_9fa48("22995"), 'high')
                }));
              }
            }
            body = sanitizedBody;
          }
        }
        const data = schema.parse(body);
        return stryMutAct_9fa48("22996") ? {} : (stryCov_9fa48("22996"), {
          success: stryMutAct_9fa48("22997") ? false : (stryCov_9fa48("22997"), true),
          data
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("22998")) {
        {}
      } else {
        stryCov_9fa48("22998");
        if (stryMutAct_9fa48("23000") ? false : stryMutAct_9fa48("22999") ? true : (stryCov_9fa48("22999", "23000"), error instanceof ZodError)) {
          if (stryMutAct_9fa48("23001")) {
            {}
          } else {
            stryCov_9fa48("23001");
            return stryMutAct_9fa48("23002") ? {} : (stryCov_9fa48("23002"), {
              success: stryMutAct_9fa48("23003") ? true : (stryCov_9fa48("23003"), false),
              error: NextResponse.json(stryMutAct_9fa48("23004") ? {} : (stryCov_9fa48("23004"), {
                error: stryMutAct_9fa48("23005") ? "" : (stryCov_9fa48("23005"), 'Datos inválidos'),
                details: error.issues
              }), stryMutAct_9fa48("23006") ? {} : (stryCov_9fa48("23006"), {
                status: 400
              }))
            });
          }
        }
        return stryMutAct_9fa48("23007") ? {} : (stryCov_9fa48("23007"), {
          success: stryMutAct_9fa48("23008") ? true : (stryCov_9fa48("23008"), false),
          error: NextResponse.json(stryMutAct_9fa48("23009") ? {} : (stryCov_9fa48("23009"), {
            error: stryMutAct_9fa48("23010") ? "" : (stryCov_9fa48("23010"), 'Error de validación')
          }), stryMutAct_9fa48("23011") ? {} : (stryCov_9fa48("23011"), {
            status: 400
          }))
        });
      }
    }
  }
}

/**
 * Parsea JSON de forma segura con logging estructurado
 * Útil para manejar errores de parsing JSON en respuestas de API
 * Funciona tanto en cliente como en servidor
 * 
 * @example
 * const errorData = await safeJsonParse<{ error?: string }>(res, {
 *   path: '/api/user',
 *   operation: 'actualizar usuario',
 * })
 */
export async function safeJsonParse<T = Record<string, unknown>>(response: Response, context?: {
  path?: string;
  operation?: string;
}): Promise<T> {
  if (stryMutAct_9fa48("23012")) {
    {}
  } else {
    stryCov_9fa48("23012");
    try {
      if (stryMutAct_9fa48("23013")) {
        {}
      } else {
        stryCov_9fa48("23013");
        return await response.json();
      }
    } catch (error) {
      if (stryMutAct_9fa48("23014")) {
        {}
      } else {
        stryCov_9fa48("23014");
        // Usar logger estructurado si está disponible (servidor), sino console.warn (cliente)
        const errorMessage = error instanceof Error ? error.message : String(error);
        const logData = stryMutAct_9fa48("23015") ? {} : (stryCov_9fa48("23015"), {
          type: stryMutAct_9fa48("23016") ? "" : (stryCov_9fa48("23016"), 'json_parse_error'),
          path: stryMutAct_9fa48("23017") ? context.path : (stryCov_9fa48("23017"), context?.path),
          operation: stryMutAct_9fa48("23018") ? context.operation : (stryCov_9fa48("23018"), context?.operation),
          error: errorMessage,
          status: response.status,
          statusText: response.statusText
        });

        // Intentar usar logger estructurado (solo en servidor)
        try {
          if (stryMutAct_9fa48("23019")) {
            {}
          } else {
            stryCov_9fa48("23019");
            if (stryMutAct_9fa48("23022") ? typeof window !== 'undefined' : stryMutAct_9fa48("23021") ? false : stryMutAct_9fa48("23020") ? true : (stryCov_9fa48("23020", "23021", "23022"), typeof window === (stryMutAct_9fa48("23023") ? "" : (stryCov_9fa48("23023"), 'undefined')))) {
              if (stryMutAct_9fa48("23024")) {
                {}
              } else {
                stryCov_9fa48("23024");
                logger.warn(logData, stryMutAct_9fa48("23025") ? "" : (stryCov_9fa48("23025"), 'Error al parsear JSON de respuesta'));
              }
            } else {
              if (stryMutAct_9fa48("23026")) {
                {}
              } else {
                stryCov_9fa48("23026");
                // En cliente, usar console.warn solo en desarrollo
                if (stryMutAct_9fa48("23029") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("23028") ? false : stryMutAct_9fa48("23027") ? true : (stryCov_9fa48("23027", "23028", "23029"), process.env.NODE_ENV === (stryMutAct_9fa48("23030") ? "" : (stryCov_9fa48("23030"), 'development')))) {
                  if (stryMutAct_9fa48("23031")) {
                    {}
                  } else {
                    stryCov_9fa48("23031");
                    console.warn(stryMutAct_9fa48("23032") ? "" : (stryCov_9fa48("23032"), 'Error al parsear JSON de respuesta:'), logData);
                  }
                }
              }
            }
          }
        } catch {
          if (stryMutAct_9fa48("23033")) {
            {}
          } else {
            stryCov_9fa48("23033");
            // Si logger falla, usar console como fallback
            if (stryMutAct_9fa48("23036") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("23035") ? false : stryMutAct_9fa48("23034") ? true : (stryCov_9fa48("23034", "23035", "23036"), process.env.NODE_ENV === (stryMutAct_9fa48("23037") ? "" : (stryCov_9fa48("23037"), 'development')))) {
              if (stryMutAct_9fa48("23038")) {
                {}
              } else {
                stryCov_9fa48("23038");
                console.warn(stryMutAct_9fa48("23039") ? "" : (stryCov_9fa48("23039"), 'Error al parsear JSON de respuesta:'), errorMessage, context);
              }
            }
          }
        }
        return {} as T;
      }
    }
  }
}

/**
 * Maneja errores de forma consistente
 */
export function handleApiError(error: unknown, defaultMessage: string = stryMutAct_9fa48("23040") ? "" : (stryCov_9fa48("23040"), 'Error interno del servidor'), context?: Record<string, unknown>) {
  if (stryMutAct_9fa48("23041")) {
    {}
  } else {
    stryCov_9fa48("23041");
    if (stryMutAct_9fa48("23043") ? false : stryMutAct_9fa48("23042") ? true : (stryCov_9fa48("23042", "23043"), error instanceof Error)) {
      if (stryMutAct_9fa48("23044")) {
        {}
      } else {
        stryCov_9fa48("23044");
        logApiError(error, context);
        return NextResponse.json(stryMutAct_9fa48("23045") ? {} : (stryCov_9fa48("23045"), {
          error: stryMutAct_9fa48("23048") ? error.message && defaultMessage : stryMutAct_9fa48("23047") ? false : stryMutAct_9fa48("23046") ? true : (stryCov_9fa48("23046", "23047", "23048"), error.message || defaultMessage)
        }), stryMutAct_9fa48("23049") ? {} : (stryCov_9fa48("23049"), {
          status: 500
        }));
      }
    }
    logApiError(new Error(String(error)), context);
    return NextResponse.json(stryMutAct_9fa48("23050") ? {} : (stryCov_9fa48("23050"), {
      error: defaultMessage
    }), stryMutAct_9fa48("23051") ? {} : (stryCov_9fa48("23051"), {
      status: 500
    }));
  }
}