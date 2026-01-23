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
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("10927") ? "" : (stryCov_9fa48("10927"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10928")) {
    {}
  } else {
    stryCov_9fa48("10928");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10929")) {
        {}
      } else {
        stryCov_9fa48("10929");
        try {
          if (stryMutAct_9fa48("10930")) {
            {}
          } else {
            stryCov_9fa48("10930");
            const subjects = await prisma.subject.findMany(stryMutAct_9fa48("10931") ? {} : (stryCov_9fa48("10931"), {
              select: stryMutAct_9fa48("10932") ? {} : (stryCov_9fa48("10932"), {
                id: stryMutAct_9fa48("10933") ? false : (stryCov_9fa48("10933"), true),
                nombre: stryMutAct_9fa48("10934") ? false : (stryCov_9fa48("10934"), true),
                codigo: stryMutAct_9fa48("10935") ? false : (stryCov_9fa48("10935"), true),
                tipo: stryMutAct_9fa48("10936") ? false : (stryCov_9fa48("10936"), true)
              }),
              orderBy: stryMutAct_9fa48("10937") ? {} : (stryCov_9fa48("10937"), {
                nombre: stryMutAct_9fa48("10938") ? "" : (stryCov_9fa48("10938"), 'asc')
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10939") ? {} : (stryCov_9fa48("10939"), {
              subjects
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10940")) {
            {}
          } else {
            stryCov_9fa48("10940");
            logger.error(stryMutAct_9fa48("10941") ? {} : (stryCov_9fa48("10941"), {
              type: stryMutAct_9fa48("10942") ? "" : (stryCov_9fa48("10942"), 'api_error'),
              path: stryMutAct_9fa48("10943") ? "" : (stryCov_9fa48("10943"), '/api/subjects'),
              error: error instanceof Error ? error.message : String(error)
            }), stryMutAct_9fa48("10944") ? "" : (stryCov_9fa48("10944"), 'Error al obtener asignaturas'));
            return NextResponse.json(stryMutAct_9fa48("10945") ? {} : (stryCov_9fa48("10945"), {
              error: stryMutAct_9fa48("10946") ? "" : (stryCov_9fa48("10946"), 'Error al obtener asignaturas')
            }), stryMutAct_9fa48("10947") ? {} : (stryCov_9fa48("10947"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}