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
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
export const runtime = stryMutAct_9fa48("10948") ? "" : (stryCov_9fa48("10948"), 'nodejs');
const topicsQuerySchema = z.object(stryMutAct_9fa48("10949") ? {} : (stryCov_9fa48("10949"), {
  subjectId: z.string().optional()
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10950")) {
    {}
  } else {
    stryCov_9fa48("10950");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10951")) {
        {}
      } else {
        stryCov_9fa48("10951");
        try {
          if (stryMutAct_9fa48("10952")) {
            {}
          } else {
            stryCov_9fa48("10952");
            const {
              searchParams
            } = new URL(request.url);
            const subjectId = searchParams.get(stryMutAct_9fa48("10953") ? "" : (stryCov_9fa48("10953"), 'subjectId'));
            const where: Prisma.TopicWhereInput = {};
            if (stryMutAct_9fa48("10955") ? false : stryMutAct_9fa48("10954") ? true : (stryCov_9fa48("10954", "10955"), subjectId)) {
              if (stryMutAct_9fa48("10956")) {
                {}
              } else {
                stryCov_9fa48("10956");
                where.subjectId = subjectId;
              }
            }
            const topics = await prisma.topic.findMany(stryMutAct_9fa48("10957") ? {} : (stryCov_9fa48("10957"), {
              where,
              select: stryMutAct_9fa48("10958") ? {} : (stryCov_9fa48("10958"), {
                id: stryMutAct_9fa48("10959") ? false : (stryCov_9fa48("10959"), true),
                nombre: stryMutAct_9fa48("10960") ? false : (stryCov_9fa48("10960"), true),
                ejeTematico: stryMutAct_9fa48("10961") ? false : (stryCov_9fa48("10961"), true),
                descripcion: stryMutAct_9fa48("10962") ? false : (stryCov_9fa48("10962"), true),
                subjectId: stryMutAct_9fa48("10963") ? false : (stryCov_9fa48("10963"), true)
              }),
              orderBy: stryMutAct_9fa48("10964") ? [] : (stryCov_9fa48("10964"), [stryMutAct_9fa48("10965") ? {} : (stryCov_9fa48("10965"), {
                ejeTematico: stryMutAct_9fa48("10966") ? "" : (stryCov_9fa48("10966"), 'asc')
              }), stryMutAct_9fa48("10967") ? {} : (stryCov_9fa48("10967"), {
                nombre: stryMutAct_9fa48("10968") ? "" : (stryCov_9fa48("10968"), 'asc')
              })])
            }));
            return NextResponse.json(stryMutAct_9fa48("10969") ? {} : (stryCov_9fa48("10969"), {
              topics
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10970")) {
            {}
          } else {
            stryCov_9fa48("10970");
            logger.error(stryMutAct_9fa48("10971") ? {} : (stryCov_9fa48("10971"), {
              type: stryMutAct_9fa48("10972") ? "" : (stryCov_9fa48("10972"), 'api_error'),
              path: stryMutAct_9fa48("10973") ? "" : (stryCov_9fa48("10973"), '/api/topics'),
              error: error instanceof Error ? error.message : String(error)
            }), stryMutAct_9fa48("10974") ? "" : (stryCov_9fa48("10974"), 'Error al obtener temas'));
            return NextResponse.json(stryMutAct_9fa48("10975") ? {} : (stryCov_9fa48("10975"), {
              error: stryMutAct_9fa48("10976") ? "" : (stryCov_9fa48("10976"), 'Error al obtener temas')
            }), stryMutAct_9fa48("10977") ? {} : (stryCov_9fa48("10977"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}