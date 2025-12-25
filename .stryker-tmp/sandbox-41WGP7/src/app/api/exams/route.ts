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
import { getCurrentStudentId } from '@/lib/get-session';
import { validateQuery, handleApiError } from '@/lib/api-helpers';
import { examQuerySchema } from '@/lib/validations';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { getCached, cacheKeys } from '@/lib/cache';
import { TIME_CONSTANTS } from '@/lib/constants';

// Constantes para tiempos de caché
const EXAMS_CACHE_TTL_MS = TIME_CONSTANTS.EXAMS_CACHE_TTL_MS;

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("8227") ? "" : (stryCov_9fa48("8227"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("8228")) {
    {}
  } else {
    stryCov_9fa48("8228");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8229")) {
        {}
      } else {
        stryCov_9fa48("8229");
        try {
          if (stryMutAct_9fa48("8230")) {
            {}
          } else {
            stryCov_9fa48("8230");
            logApiRequest(stryMutAct_9fa48("8231") ? "" : (stryCov_9fa48("8231"), 'GET'), stryMutAct_9fa48("8232") ? "" : (stryCov_9fa48("8232"), '/api/exams'));

            // Validar autenticación
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("8235") ? false : stryMutAct_9fa48("8234") ? true : stryMutAct_9fa48("8233") ? studentId : (stryCov_9fa48("8233", "8234", "8235"), !studentId)) {
              if (stryMutAct_9fa48("8236")) {
                {}
              } else {
                stryCov_9fa48("8236");
                return NextResponse.json(stryMutAct_9fa48("8237") ? {} : (stryCov_9fa48("8237"), {
                  error: stryMutAct_9fa48("8238") ? "" : (stryCov_9fa48("8238"), 'No autorizado')
                }), stryMutAct_9fa48("8239") ? {} : (stryCov_9fa48("8239"), {
                  status: 401
                }));
              }
            }

            // Validar query parameters
            const validation = validateQuery(request, examQuerySchema);
            if (stryMutAct_9fa48("8242") ? false : stryMutAct_9fa48("8241") ? true : stryMutAct_9fa48("8240") ? validation.success : (stryCov_9fa48("8240", "8241", "8242"), !validation.success)) {
              if (stryMutAct_9fa48("8243")) {
                {}
              } else {
                stryCov_9fa48("8243");
                return validation.error;
              }
            }
            const {
              subjectId,
              tipo,
              limit,
              offset
            } = validation.data;

            // Construir where clause una sola vez para evitar duplicación
            const whereClause = stryMutAct_9fa48("8244") ? {} : (stryCov_9fa48("8244"), {
              ...(stryMutAct_9fa48("8247") ? subjectId || {
                subjectId
              } : stryMutAct_9fa48("8246") ? false : stryMutAct_9fa48("8245") ? true : (stryCov_9fa48("8245", "8246", "8247"), subjectId && (stryMutAct_9fa48("8248") ? {} : (stryCov_9fa48("8248"), {
                subjectId
              })))),
              ...(stryMutAct_9fa48("8251") ? tipo || {
                tipo
              } : stryMutAct_9fa48("8250") ? false : stryMutAct_9fa48("8249") ? true : (stryCov_9fa48("8249", "8250", "8251"), tipo && (stryMutAct_9fa48("8252") ? {} : (stryCov_9fa48("8252"), {
                tipo
              }))))
            });

            // Usar caché para queries frecuentes (exámenes no cambian frecuentemente)
            const cacheKey = cacheKeys.exams(subjectId, tipo, limit, offset);
            const exams = await getCached(cacheKey, async () => {
              if (stryMutAct_9fa48("8253")) {
                {}
              } else {
                stryCov_9fa48("8253");
                // Optimizar query usando select en lugar de include
                return await prisma.exam.findMany(stryMutAct_9fa48("8254") ? {} : (stryCov_9fa48("8254"), {
                  where: whereClause,
                  select: stryMutAct_9fa48("8255") ? {} : (stryCov_9fa48("8255"), {
                    id: stryMutAct_9fa48("8256") ? false : (stryCov_9fa48("8256"), true),
                    titulo: stryMutAct_9fa48("8257") ? false : (stryCov_9fa48("8257"), true),
                    descripcion: stryMutAct_9fa48("8258") ? false : (stryCov_9fa48("8258"), true),
                    tipo: stryMutAct_9fa48("8259") ? false : (stryCov_9fa48("8259"), true),
                    tiempoLimiteMin: stryMutAct_9fa48("8260") ? false : (stryCov_9fa48("8260"), true),
                    totalPreguntas: stryMutAct_9fa48("8261") ? false : (stryCov_9fa48("8261"), true),
                    fuente: stryMutAct_9fa48("8262") ? false : (stryCov_9fa48("8262"), true),
                    createdAt: stryMutAct_9fa48("8263") ? false : (stryCov_9fa48("8263"), true),
                    subject: stryMutAct_9fa48("8264") ? {} : (stryCov_9fa48("8264"), {
                      select: stryMutAct_9fa48("8265") ? {} : (stryCov_9fa48("8265"), {
                        id: stryMutAct_9fa48("8266") ? false : (stryCov_9fa48("8266"), true),
                        nombre: stryMutAct_9fa48("8267") ? false : (stryCov_9fa48("8267"), true),
                        codigo: stryMutAct_9fa48("8268") ? false : (stryCov_9fa48("8268"), true)
                      })
                    }),
                    // Solo contar preguntas, no cargar todas
                    questions: stryMutAct_9fa48("8269") ? {} : (stryCov_9fa48("8269"), {
                      select: stryMutAct_9fa48("8270") ? {} : (stryCov_9fa48("8270"), {
                        id: stryMutAct_9fa48("8271") ? false : (stryCov_9fa48("8271"), true)
                      })
                    })
                  }),
                  skip: offset,
                  take: limit,
                  orderBy: stryMutAct_9fa48("8272") ? {} : (stryCov_9fa48("8272"), {
                    createdAt: stryMutAct_9fa48("8273") ? "" : (stryCov_9fa48("8273"), 'desc')
                  })
                }));
              }
            }, EXAMS_CACHE_TTL_MS);

            // Obtener total para paginación
            const total = await getCached(stryMutAct_9fa48("8274") ? `` : (stryCov_9fa48("8274"), `${cacheKey}:total`), async () => {
              if (stryMutAct_9fa48("8275")) {
                {}
              } else {
                stryCov_9fa48("8275");
                return await prisma.exam.count(stryMutAct_9fa48("8276") ? {} : (stryCov_9fa48("8276"), {
                  where: whereClause
                }));
              }
            }, EXAMS_CACHE_TTL_MS);
            return NextResponse.json(stryMutAct_9fa48("8277") ? {} : (stryCov_9fa48("8277"), {
              exams,
              pagination: stryMutAct_9fa48("8278") ? {} : (stryCov_9fa48("8278"), {
                total,
                limit,
                offset,
                hasMore: stryMutAct_9fa48("8282") ? offset + limit >= total : stryMutAct_9fa48("8281") ? offset + limit <= total : stryMutAct_9fa48("8280") ? false : stryMutAct_9fa48("8279") ? true : (stryCov_9fa48("8279", "8280", "8281", "8282"), (stryMutAct_9fa48("8283") ? offset - limit : (stryCov_9fa48("8283"), offset + limit)) < total)
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8284")) {
            {}
          } else {
            stryCov_9fa48("8284");
            return handleApiError(error, stryMutAct_9fa48("8285") ? "" : (stryCov_9fa48("8285"), 'Error al obtener exámenes'), stryMutAct_9fa48("8286") ? {} : (stryCov_9fa48("8286"), {
              path: stryMutAct_9fa48("8287") ? "" : (stryCov_9fa48("8287"), '/api/exams')
            }));
          }
        }
      }
    });
  }
}