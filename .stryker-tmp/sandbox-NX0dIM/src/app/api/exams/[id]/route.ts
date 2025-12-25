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
import { handleApiError } from '@/lib/api-helpers';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { getCached, cacheKeys } from '@/lib/cache';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("8288") ? "" : (stryCov_9fa48("8288"), 'nodejs');
export async function GET(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("8289")) {
    {}
  } else {
    stryCov_9fa48("8289");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8290")) {
        {}
      } else {
        stryCov_9fa48("8290");
        try {
          if (stryMutAct_9fa48("8291")) {
            {}
          } else {
            stryCov_9fa48("8291");
            const {
              id
            } = await params;
            logApiRequest(stryMutAct_9fa48("8292") ? "" : (stryCov_9fa48("8292"), 'GET'), stryMutAct_9fa48("8293") ? `` : (stryCov_9fa48("8293"), `/api/exams/${id}`));

            // Validar autenticación
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("8296") ? false : stryMutAct_9fa48("8295") ? true : stryMutAct_9fa48("8294") ? studentId : (stryCov_9fa48("8294", "8295", "8296"), !studentId)) {
              if (stryMutAct_9fa48("8297")) {
                {}
              } else {
                stryCov_9fa48("8297");
                return NextResponse.json(stryMutAct_9fa48("8298") ? {} : (stryCov_9fa48("8298"), {
                  error: stryMutAct_9fa48("8299") ? "" : (stryCov_9fa48("8299"), 'No autorizado')
                }), stryMutAct_9fa48("8300") ? {} : (stryCov_9fa48("8300"), {
                  status: 401
                }));
              }
            }

            // Validar formato del ID (cuid)
            if (stryMutAct_9fa48("8303") ? !id && !/^c[a-z0-9]{24}$/.test(id) : stryMutAct_9fa48("8302") ? false : stryMutAct_9fa48("8301") ? true : (stryCov_9fa48("8301", "8302", "8303"), (stryMutAct_9fa48("8304") ? id : (stryCov_9fa48("8304"), !id)) || (stryMutAct_9fa48("8305") ? /^c[a-z0-9]{24}$/.test(id) : (stryCov_9fa48("8305"), !(stryMutAct_9fa48("8309") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("8308") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("8307") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("8306") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("8306", "8307", "8308", "8309"), /^c[a-z0-9]{24}$/)).test(id))))) {
              if (stryMutAct_9fa48("8310")) {
                {}
              } else {
                stryCov_9fa48("8310");
                return NextResponse.json(stryMutAct_9fa48("8311") ? {} : (stryCov_9fa48("8311"), {
                  error: stryMutAct_9fa48("8312") ? "" : (stryCov_9fa48("8312"), 'ID de examen inválido')
                }), stryMutAct_9fa48("8313") ? {} : (stryCov_9fa48("8313"), {
                  status: 400
                }));
              }
            }

            // Usar caché para examen individual (exámenes no cambian frecuentemente)
            const exam = await getCached(cacheKeys.exam(id), async () => {
              if (stryMutAct_9fa48("8314")) {
                {}
              } else {
                stryCov_9fa48("8314");
                return await prisma.exam.findUnique(stryMutAct_9fa48("8315") ? {} : (stryCov_9fa48("8315"), {
                  where: stryMutAct_9fa48("8316") ? {} : (stryCov_9fa48("8316"), {
                    id
                  }),
                  include: stryMutAct_9fa48("8317") ? {} : (stryCov_9fa48("8317"), {
                    subject: stryMutAct_9fa48("8318") ? false : (stryCov_9fa48("8318"), true),
                    questions: stryMutAct_9fa48("8319") ? {} : (stryCov_9fa48("8319"), {
                      include: stryMutAct_9fa48("8320") ? {} : (stryCov_9fa48("8320"), {
                        question: stryMutAct_9fa48("8321") ? {} : (stryCov_9fa48("8321"), {
                          include: stryMutAct_9fa48("8322") ? {} : (stryCov_9fa48("8322"), {
                            options: stryMutAct_9fa48("8323") ? false : (stryCov_9fa48("8323"), true)
                          })
                        })
                      }),
                      orderBy: stryMutAct_9fa48("8324") ? {} : (stryCov_9fa48("8324"), {
                        orden: stryMutAct_9fa48("8325") ? "" : (stryCov_9fa48("8325"), 'asc')
                      })
                    })
                  })
                }));
              }
            }, stryMutAct_9fa48("8326") ? 10 * 60 / 1000 // Cache por 10 minutos
            : (stryCov_9fa48("8326"), (stryMutAct_9fa48("8327") ? 10 / 60 : (stryCov_9fa48("8327"), 10 * 60)) * 1000) // Cache por 10 minutos
            );
            if (stryMutAct_9fa48("8330") ? false : stryMutAct_9fa48("8329") ? true : stryMutAct_9fa48("8328") ? exam : (stryCov_9fa48("8328", "8329", "8330"), !exam)) {
              if (stryMutAct_9fa48("8331")) {
                {}
              } else {
                stryCov_9fa48("8331");
                return NextResponse.json(stryMutAct_9fa48("8332") ? {} : (stryCov_9fa48("8332"), {
                  error: stryMutAct_9fa48("8333") ? "" : (stryCov_9fa48("8333"), 'Examen no encontrado')
                }), stryMutAct_9fa48("8334") ? {} : (stryCov_9fa48("8334"), {
                  status: 404
                }));
              }
            }
            return NextResponse.json(exam);
          }
        } catch (error) {
          if (stryMutAct_9fa48("8335")) {
            {}
          } else {
            stryCov_9fa48("8335");
            return handleApiError(error, stryMutAct_9fa48("8336") ? "" : (stryCov_9fa48("8336"), 'Error al obtener examen'), stryMutAct_9fa48("8337") ? {} : (stryCov_9fa48("8337"), {
              path: stryMutAct_9fa48("8338") ? `` : (stryCov_9fa48("8338"), `/api/exams/${await params.then(stryMutAct_9fa48("8339") ? () => undefined : (stryCov_9fa48("8339"), p => p.id))}`)
            }));
          }
        }
      }
    });
  }
}