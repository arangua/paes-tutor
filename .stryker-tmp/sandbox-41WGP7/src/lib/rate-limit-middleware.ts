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
import { apiRateLimit } from './rate-limit';
import { logger } from './logger';
export type RateLimitType = 'general' | 'auth' | 'read' | 'write' | 'sensitive' | 'challenge';
export async function withRateLimit(request: NextRequest, handler: () => Promise<NextResponse>, type: RateLimitType = stryMutAct_9fa48("25361") ? "" : (stryCov_9fa48("25361"), 'general')) {
  if (stryMutAct_9fa48("25362")) {
    {}
  } else {
    stryCov_9fa48("25362");
    // Obtener identificador (IP o userId)
    const forwarded = request.headers.get(stryMutAct_9fa48("25363") ? "" : (stryCov_9fa48("25363"), 'x-forwarded-for'));
    const ip = forwarded ? forwarded.split(stryMutAct_9fa48("25364") ? "" : (stryCov_9fa48("25364"), ','))[0] : stryMutAct_9fa48("25367") ? request.headers.get('x-real-ip') && 'unknown' : stryMutAct_9fa48("25366") ? false : stryMutAct_9fa48("25365") ? true : (stryCov_9fa48("25365", "25366", "25367"), request.headers.get(stryMutAct_9fa48("25368") ? "" : (stryCov_9fa48("25368"), 'x-real-ip')) || (stryMutAct_9fa48("25369") ? "" : (stryCov_9fa48("25369"), 'unknown')));

    // Intentar obtener userId de la sesión si está disponible (para rate limiting más preciso)
    let identifier = ip;
    try {
      if (stryMutAct_9fa48("25370")) {
        {}
      } else {
        stryCov_9fa48("25370");
        const {
          getCurrentUser
        } = await import(stryMutAct_9fa48("25371") ? "" : (stryCov_9fa48("25371"), './get-session'));
        const user = await getCurrentUser();
        if (stryMutAct_9fa48("25374") ? user.id : stryMutAct_9fa48("25373") ? false : stryMutAct_9fa48("25372") ? true : (stryCov_9fa48("25372", "25373", "25374"), user?.id)) {
          if (stryMutAct_9fa48("25375")) {
            {}
          } else {
            stryCov_9fa48("25375");
            identifier = stryMutAct_9fa48("25376") ? `` : (stryCov_9fa48("25376"), `user:${user.id}`);
          }
        }
      }
    } catch {
      // Si falla, usar IP como fallback
    }
    try {
      if (stryMutAct_9fa48("25377")) {
        {}
      } else {
        stryCov_9fa48("25377");
        let result;
        switch (type) {
          case stryMutAct_9fa48("25379") ? "" : (stryCov_9fa48("25379"), 'auth'):
            if (stryMutAct_9fa48("25378")) {} else {
              stryCov_9fa48("25378");
              result = await apiRateLimit.auth(identifier);
              break;
            }
          case stryMutAct_9fa48("25381") ? "" : (stryCov_9fa48("25381"), 'read'):
            if (stryMutAct_9fa48("25380")) {} else {
              stryCov_9fa48("25380");
              result = await apiRateLimit.read(identifier);
              break;
            }
          case stryMutAct_9fa48("25383") ? "" : (stryCov_9fa48("25383"), 'write'):
            if (stryMutAct_9fa48("25382")) {} else {
              stryCov_9fa48("25382");
              result = await apiRateLimit.write(identifier);
              break;
            }
          case stryMutAct_9fa48("25385") ? "" : (stryCov_9fa48("25385"), 'sensitive'):
            if (stryMutAct_9fa48("25384")) {} else {
              stryCov_9fa48("25384");
              result = await apiRateLimit.sensitive(identifier);
              break;
            }
          case stryMutAct_9fa48("25387") ? "" : (stryCov_9fa48("25387"), 'challenge'):
            if (stryMutAct_9fa48("25386")) {} else {
              stryCov_9fa48("25386");
              result = await apiRateLimit.challenge(identifier);
              break;
            }
          default:
            if (stryMutAct_9fa48("25388")) {} else {
              stryCov_9fa48("25388");
              result = await apiRateLimit.general(identifier);
            }
        }
        if (stryMutAct_9fa48("25391") ? false : stryMutAct_9fa48("25390") ? true : stryMutAct_9fa48("25389") ? result.success : (stryCov_9fa48("25389", "25390", "25391"), !result.success)) {
          if (stryMutAct_9fa48("25392")) {
            {}
          } else {
            stryCov_9fa48("25392");
            logger.warn(stryMutAct_9fa48("25393") ? {} : (stryCov_9fa48("25393"), {
              type: stryMutAct_9fa48("25394") ? "" : (stryCov_9fa48("25394"), 'rate_limit_exceeded'),
              identifier,
              path: request.nextUrl.pathname,
              limit: result.limit
            }), stryMutAct_9fa48("25395") ? "" : (stryCov_9fa48("25395"), 'Rate limit exceeded'));
            return NextResponse.json(stryMutAct_9fa48("25396") ? {} : (stryCov_9fa48("25396"), {
              error: stryMutAct_9fa48("25397") ? "" : (stryCov_9fa48("25397"), 'Demasiadas solicitudes. Por favor, intenta más tarde.'),
              retryAfter: Math.ceil(stryMutAct_9fa48("25398") ? (result.reset - Date.now()) * 1000 : (stryCov_9fa48("25398"), (stryMutAct_9fa48("25399") ? result.reset + Date.now() : (stryCov_9fa48("25399"), result.reset - Date.now())) / 1000))
            }), stryMutAct_9fa48("25400") ? {} : (stryCov_9fa48("25400"), {
              status: 429,
              headers: stryMutAct_9fa48("25401") ? {} : (stryCov_9fa48("25401"), {
                'Retry-After': String(Math.ceil(stryMutAct_9fa48("25402") ? (result.reset - Date.now()) * 1000 : (stryCov_9fa48("25402"), (stryMutAct_9fa48("25403") ? result.reset + Date.now() : (stryCov_9fa48("25403"), result.reset - Date.now())) / 1000))),
                'X-RateLimit-Limit': String(result.limit),
                'X-RateLimit-Remaining': String(result.remaining),
                'X-RateLimit-Reset': String(result.reset)
              })
            }));
          }
        }

        // Ejecutar el handler
        const response = await handler();

        // Agregar headers de rate limit
        response.headers.set(stryMutAct_9fa48("25404") ? "" : (stryCov_9fa48("25404"), 'X-RateLimit-Limit'), String(result.limit));
        response.headers.set(stryMutAct_9fa48("25405") ? "" : (stryCov_9fa48("25405"), 'X-RateLimit-Remaining'), String(result.remaining));
        response.headers.set(stryMutAct_9fa48("25406") ? "" : (stryCov_9fa48("25406"), 'X-RateLimit-Reset'), String(result.reset));
        return response;
      }
    } catch (error) {
      if (stryMutAct_9fa48("25407")) {
        {}
      } else {
        stryCov_9fa48("25407");
        logger.error(stryMutAct_9fa48("25408") ? {} : (stryCov_9fa48("25408"), {
          type: stryMutAct_9fa48("25409") ? "" : (stryCov_9fa48("25409"), 'rate_limit_error'),
          error: error instanceof Error ? error.message : String(error)
        }), stryMutAct_9fa48("25410") ? "" : (stryCov_9fa48("25410"), 'Rate limit error'));

        // En caso de error, permitir la request pero loguear
        return handler();
      }
    }
  }
}