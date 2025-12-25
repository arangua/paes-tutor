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
import { cancelExpiredChallenges } from '@/lib/challenge-timeout';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("7624") ? "" : (stryCov_9fa48("7624"), 'nodejs');

/**
 * POST: Limpiar desafíos expirados manualmente
 * Este endpoint puede ser llamado por un cron job o manualmente
 */
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("7625")) {
    {}
  } else {
    stryCov_9fa48("7625");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7626")) {
        {}
      } else {
        stryCov_9fa48("7626");
        try {
          if (stryMutAct_9fa48("7627")) {
            {}
          } else {
            stryCov_9fa48("7627");
            // Verificar que es una llamada autorizada
            // Si CLEANUP_TOKEN está configurado, se requiere autenticación
            const expectedToken = process.env.CLEANUP_TOKEN;
            if (stryMutAct_9fa48("7629") ? false : stryMutAct_9fa48("7628") ? true : (stryCov_9fa48("7628", "7629"), expectedToken)) {
              if (stryMutAct_9fa48("7630")) {
                {}
              } else {
                stryCov_9fa48("7630");
                const authHeader = request.headers.get(stryMutAct_9fa48("7631") ? "" : (stryCov_9fa48("7631"), 'authorization'));
                if (stryMutAct_9fa48("7634") ? !authHeader && authHeader !== `Bearer ${expectedToken}` : stryMutAct_9fa48("7633") ? false : stryMutAct_9fa48("7632") ? true : (stryCov_9fa48("7632", "7633", "7634"), (stryMutAct_9fa48("7635") ? authHeader : (stryCov_9fa48("7635"), !authHeader)) || (stryMutAct_9fa48("7637") ? authHeader === `Bearer ${expectedToken}` : stryMutAct_9fa48("7636") ? false : (stryCov_9fa48("7636", "7637"), authHeader !== (stryMutAct_9fa48("7638") ? `` : (stryCov_9fa48("7638"), `Bearer ${expectedToken}`)))))) {
                  if (stryMutAct_9fa48("7639")) {
                    {}
                  } else {
                    stryCov_9fa48("7639");
                    return NextResponse.json(stryMutAct_9fa48("7640") ? {} : (stryCov_9fa48("7640"), {
                      error: stryMutAct_9fa48("7641") ? "" : (stryCov_9fa48("7641"), 'No autorizado')
                    }), stryMutAct_9fa48("7642") ? {} : (stryCov_9fa48("7642"), {
                      status: 401
                    }));
                  }
                }
              }
            }
            const result = await cancelExpiredChallenges();
            return NextResponse.json(stryMutAct_9fa48("7643") ? {} : (stryCov_9fa48("7643"), {
              success: stryMutAct_9fa48("7644") ? false : (stryCov_9fa48("7644"), true),
              cancelled: result.cancelled,
              message: stryMutAct_9fa48("7645") ? `` : (stryCov_9fa48("7645"), `Se cancelaron ${result.cancelled} desafíos expirados`)
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7646")) {
            {}
          } else {
            stryCov_9fa48("7646");
            logger.error(stryMutAct_9fa48("7647") ? {} : (stryCov_9fa48("7647"), {
              type: stryMutAct_9fa48("7648") ? "" : (stryCov_9fa48("7648"), 'challenge_cleanup_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("7649") ? "" : (stryCov_9fa48("7649"), 'Error al limpiar desafíos expirados'));
            return NextResponse.json(stryMutAct_9fa48("7650") ? {} : (stryCov_9fa48("7650"), {
              error: stryMutAct_9fa48("7651") ? "" : (stryCov_9fa48("7651"), 'Error al limpiar desafíos expirados')
            }), stryMutAct_9fa48("7652") ? {} : (stryCov_9fa48("7652"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}