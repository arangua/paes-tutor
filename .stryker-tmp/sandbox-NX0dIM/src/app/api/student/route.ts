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

// Especificar Node.js runtime (necesario para Prisma y otras dependencias)
export const runtime = stryMutAct_9fa48("10858") ? "" : (stryCov_9fa48("10858"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10859")) {
    {}
  } else {
    stryCov_9fa48("10859");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10860")) {
        {}
      } else {
        stryCov_9fa48("10860");
        try {
          if (stryMutAct_9fa48("10861")) {
            {}
          } else {
            stryCov_9fa48("10861");
            logApiRequest(stryMutAct_9fa48("10862") ? "" : (stryCov_9fa48("10862"), 'GET'), stryMutAct_9fa48("10863") ? "" : (stryCov_9fa48("10863"), '/api/student'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("10866") ? false : stryMutAct_9fa48("10865") ? true : stryMutAct_9fa48("10864") ? studentId : (stryCov_9fa48("10864", "10865", "10866"), !studentId)) {
              if (stryMutAct_9fa48("10867")) {
                {}
              } else {
                stryCov_9fa48("10867");
                return NextResponse.json(stryMutAct_9fa48("10868") ? {} : (stryCov_9fa48("10868"), {
                  error: stryMutAct_9fa48("10869") ? "" : (stryCov_9fa48("10869"), 'No autorizado')
                }), stryMutAct_9fa48("10870") ? {} : (stryCov_9fa48("10870"), {
                  status: 401
                }));
              }
            }

            // Usar caché para queries frecuentes
            const student = await getCached(cacheKeys.student(studentId), async () => {
              if (stryMutAct_9fa48("10871")) {
                {}
              } else {
                stryCov_9fa48("10871");
                return await prisma.student.findUnique(stryMutAct_9fa48("10872") ? {} : (stryCov_9fa48("10872"), {
                  where: stryMutAct_9fa48("10873") ? {} : (stryCov_9fa48("10873"), {
                    id: studentId
                  }),
                  select: stryMutAct_9fa48("10874") ? {} : (stryCov_9fa48("10874"), {
                    id: stryMutAct_9fa48("10875") ? false : (stryCov_9fa48("10875"), true),
                    nombre: stryMutAct_9fa48("10876") ? false : (stryCov_9fa48("10876"), true),
                    createdAt: stryMutAct_9fa48("10877") ? false : (stryCov_9fa48("10877"), true),
                    attempts: stryMutAct_9fa48("10878") ? {} : (stryCov_9fa48("10878"), {
                      take: 5,
                      orderBy: stryMutAct_9fa48("10879") ? {} : (stryCov_9fa48("10879"), {
                        createdAt: stryMutAct_9fa48("10880") ? "" : (stryCov_9fa48("10880"), 'desc')
                      }),
                      select: stryMutAct_9fa48("10881") ? {} : (stryCov_9fa48("10881"), {
                        id: stryMutAct_9fa48("10882") ? false : (stryCov_9fa48("10882"), true),
                        estado: stryMutAct_9fa48("10883") ? false : (stryCov_9fa48("10883"), true),
                        porcentaje: stryMutAct_9fa48("10884") ? false : (stryCov_9fa48("10884"), true),
                        correctas: stryMutAct_9fa48("10885") ? false : (stryCov_9fa48("10885"), true),
                        totalPreguntas: stryMutAct_9fa48("10886") ? false : (stryCov_9fa48("10886"), true),
                        puntajePaes: stryMutAct_9fa48("10887") ? false : (stryCov_9fa48("10887"), true),
                        createdAt: stryMutAct_9fa48("10888") ? false : (stryCov_9fa48("10888"), true),
                        exam: stryMutAct_9fa48("10889") ? {} : (stryCov_9fa48("10889"), {
                          select: stryMutAct_9fa48("10890") ? {} : (stryCov_9fa48("10890"), {
                            id: stryMutAct_9fa48("10891") ? false : (stryCov_9fa48("10891"), true),
                            titulo: stryMutAct_9fa48("10892") ? false : (stryCov_9fa48("10892"), true),
                            subject: stryMutAct_9fa48("10893") ? {} : (stryCov_9fa48("10893"), {
                              select: stryMutAct_9fa48("10894") ? {} : (stryCov_9fa48("10894"), {
                                id: stryMutAct_9fa48("10895") ? false : (stryCov_9fa48("10895"), true),
                                nombre: stryMutAct_9fa48("10896") ? false : (stryCov_9fa48("10896"), true),
                                codigo: stryMutAct_9fa48("10897") ? false : (stryCov_9fa48("10897"), true)
                              })
                            })
                          })
                        })
                      })
                    }),
                    metrics: stryMutAct_9fa48("10898") ? {} : (stryCov_9fa48("10898"), {
                      select: stryMutAct_9fa48("10899") ? {} : (stryCov_9fa48("10899"), {
                        id: stryMutAct_9fa48("10900") ? false : (stryCov_9fa48("10900"), true),
                        porcentaje: stryMutAct_9fa48("10901") ? false : (stryCov_9fa48("10901"), true),
                        totalPreguntas: stryMutAct_9fa48("10902") ? false : (stryCov_9fa48("10902"), true),
                        correctas: stryMutAct_9fa48("10903") ? false : (stryCov_9fa48("10903"), true),
                        nivel: stryMutAct_9fa48("10904") ? false : (stryCov_9fa48("10904"), true),
                        topic: stryMutAct_9fa48("10905") ? {} : (stryCov_9fa48("10905"), {
                          select: stryMutAct_9fa48("10906") ? {} : (stryCov_9fa48("10906"), {
                            id: stryMutAct_9fa48("10907") ? false : (stryCov_9fa48("10907"), true),
                            nombre: stryMutAct_9fa48("10908") ? false : (stryCov_9fa48("10908"), true),
                            subject: stryMutAct_9fa48("10909") ? {} : (stryCov_9fa48("10909"), {
                              select: stryMutAct_9fa48("10910") ? {} : (stryCov_9fa48("10910"), {
                                id: stryMutAct_9fa48("10911") ? false : (stryCov_9fa48("10911"), true),
                                nombre: stryMutAct_9fa48("10912") ? false : (stryCov_9fa48("10912"), true),
                                codigo: stryMutAct_9fa48("10913") ? false : (stryCov_9fa48("10913"), true)
                              })
                            })
                          })
                        })
                      })
                    })
                  })
                }));
              }
            }, stryMutAct_9fa48("10914") ? 2 * 60 / 1000 // Cache por 2 minutos
            : (stryCov_9fa48("10914"), (stryMutAct_9fa48("10915") ? 2 / 60 : (stryCov_9fa48("10915"), 2 * 60)) * 1000) // Cache por 2 minutos
            );
            if (stryMutAct_9fa48("10918") ? false : stryMutAct_9fa48("10917") ? true : stryMutAct_9fa48("10916") ? student : (stryCov_9fa48("10916", "10917", "10918"), !student)) {
              if (stryMutAct_9fa48("10919")) {
                {}
              } else {
                stryCov_9fa48("10919");
                return NextResponse.json(stryMutAct_9fa48("10920") ? {} : (stryCov_9fa48("10920"), {
                  error: stryMutAct_9fa48("10921") ? "" : (stryCov_9fa48("10921"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("10922") ? {} : (stryCov_9fa48("10922"), {
                  status: 404
                }));
              }
            }
            return NextResponse.json(student);
          }
        } catch (error) {
          if (stryMutAct_9fa48("10923")) {
            {}
          } else {
            stryCov_9fa48("10923");
            return handleApiError(error, stryMutAct_9fa48("10924") ? "" : (stryCov_9fa48("10924"), 'Error al obtener datos del estudiante'), stryMutAct_9fa48("10925") ? {} : (stryCov_9fa48("10925"), {
              path: stryMutAct_9fa48("10926") ? "" : (stryCov_9fa48("10926"), '/api/student')
            }));
          }
        }
      }
    });
  }
}