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
import { generateAdvancedAnalytics } from '@/lib/analytics';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("6241") ? "" : (stryCov_9fa48("6241"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("6242")) {
    {}
  } else {
    stryCov_9fa48("6242");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6243")) {
        {}
      } else {
        stryCov_9fa48("6243");
        try {
          if (stryMutAct_9fa48("6244")) {
            {}
          } else {
            stryCov_9fa48("6244");
            logApiRequest(stryMutAct_9fa48("6245") ? "" : (stryCov_9fa48("6245"), 'GET'), stryMutAct_9fa48("6246") ? "" : (stryCov_9fa48("6246"), '/api/analytics'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("6249") ? false : stryMutAct_9fa48("6248") ? true : stryMutAct_9fa48("6247") ? studentId : (stryCov_9fa48("6247", "6248", "6249"), !studentId)) {
              if (stryMutAct_9fa48("6250")) {
                {}
              } else {
                stryCov_9fa48("6250");
                return NextResponse.json(stryMutAct_9fa48("6251") ? {} : (stryCov_9fa48("6251"), {
                  error: stryMutAct_9fa48("6252") ? "" : (stryCov_9fa48("6252"), 'No autorizado')
                }), stryMutAct_9fa48("6253") ? {} : (stryCov_9fa48("6253"), {
                  status: 401
                }));
              }
            }

            // Usar caché para analytics (cambian poco)
            const analytics = await getCached(cacheKeys.studentAnalytics(studentId), async () => {
              if (stryMutAct_9fa48("6254")) {
                {}
              } else {
                stryCov_9fa48("6254");
                // Obtener todos los intentos completados del estudiante
                // Optimizar usando select en lugar de include
                // Limitar a últimos 100 intentos para performance
                const attempts = await prisma.attempt.findMany(stryMutAct_9fa48("6255") ? {} : (stryCov_9fa48("6255"), {
                  where: stryMutAct_9fa48("6256") ? {} : (stryCov_9fa48("6256"), {
                    studentId,
                    estado: stryMutAct_9fa48("6257") ? "" : (stryCov_9fa48("6257"), 'completado')
                  }),
                  take: 100,
                  // Límite para análisis de tendencias
                  select: stryMutAct_9fa48("6258") ? {} : (stryCov_9fa48("6258"), {
                    id: stryMutAct_9fa48("6259") ? false : (stryCov_9fa48("6259"), true),
                    porcentaje: stryMutAct_9fa48("6260") ? false : (stryCov_9fa48("6260"), true),
                    createdAt: stryMutAct_9fa48("6261") ? false : (stryCov_9fa48("6261"), true),
                    exam: stryMutAct_9fa48("6262") ? {} : (stryCov_9fa48("6262"), {
                      select: stryMutAct_9fa48("6263") ? {} : (stryCov_9fa48("6263"), {
                        titulo: stryMutAct_9fa48("6264") ? false : (stryCov_9fa48("6264"), true),
                        subject: stryMutAct_9fa48("6265") ? {} : (stryCov_9fa48("6265"), {
                          select: stryMutAct_9fa48("6266") ? {} : (stryCov_9fa48("6266"), {
                            nombre: stryMutAct_9fa48("6267") ? false : (stryCov_9fa48("6267"), true),
                            codigo: stryMutAct_9fa48("6268") ? false : (stryCov_9fa48("6268"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("6269") ? {} : (stryCov_9fa48("6269"), {
                    createdAt: stryMutAct_9fa48("6270") ? "" : (stryCov_9fa48("6270"), 'desc')
                  })
                }));

                // Obtener métricas del estudiante
                // Optimizar usando select en lugar de include
                const metrics = await prisma.performanceMetric.findMany(stryMutAct_9fa48("6271") ? {} : (stryCov_9fa48("6271"), {
                  where: stryMutAct_9fa48("6272") ? {} : (stryCov_9fa48("6272"), {
                    studentId
                  }),
                  select: stryMutAct_9fa48("6273") ? {} : (stryCov_9fa48("6273"), {
                    topicId: stryMutAct_9fa48("6274") ? false : (stryCov_9fa48("6274"), true),
                    porcentaje: stryMutAct_9fa48("6275") ? false : (stryCov_9fa48("6275"), true),
                    totalPreguntas: stryMutAct_9fa48("6276") ? false : (stryCov_9fa48("6276"), true),
                    correctas: stryMutAct_9fa48("6277") ? false : (stryCov_9fa48("6277"), true),
                    topic: stryMutAct_9fa48("6278") ? {} : (stryCov_9fa48("6278"), {
                      select: stryMutAct_9fa48("6279") ? {} : (stryCov_9fa48("6279"), {
                        nombre: stryMutAct_9fa48("6280") ? false : (stryCov_9fa48("6280"), true),
                        subject: stryMutAct_9fa48("6281") ? {} : (stryCov_9fa48("6281"), {
                          select: stryMutAct_9fa48("6282") ? {} : (stryCov_9fa48("6282"), {
                            nombre: stryMutAct_9fa48("6283") ? false : (stryCov_9fa48("6283"), true)
                          })
                        })
                      })
                    })
                  })
                }));

                // Convertir a formato esperado (ya está optimizado con select)
                const formattedAttempts = attempts.map(stryMutAct_9fa48("6284") ? () => undefined : (stryCov_9fa48("6284"), a => stryMutAct_9fa48("6285") ? {} : (stryCov_9fa48("6285"), {
                  id: a.id,
                  porcentaje: a.porcentaje,
                  createdAt: a.createdAt.toISOString(),
                  exam: stryMutAct_9fa48("6286") ? {} : (stryCov_9fa48("6286"), {
                    titulo: a.exam.titulo,
                    subject: stryMutAct_9fa48("6287") ? {} : (stryCov_9fa48("6287"), {
                      nombre: a.exam.subject.nombre,
                      codigo: a.exam.subject.codigo
                    })
                  })
                })));
                const formattedMetrics = metrics.map(stryMutAct_9fa48("6288") ? () => undefined : (stryCov_9fa48("6288"), m => stryMutAct_9fa48("6289") ? {} : (stryCov_9fa48("6289"), {
                  topicId: m.topicId,
                  topicName: m.topic.nombre,
                  subjectName: m.topic.subject.nombre,
                  porcentaje: m.porcentaje,
                  totalPreguntas: m.totalPreguntas,
                  correctas: m.correctas
                })));

                // Generar análisis avanzado
                return generateAdvancedAnalytics(formattedAttempts, formattedMetrics);
              }
            }, stryMutAct_9fa48("6290") ? 5 * 60 / 1000 // Cache por 5 minutos
            : (stryCov_9fa48("6290"), (stryMutAct_9fa48("6291") ? 5 / 60 : (stryCov_9fa48("6291"), 5 * 60)) * 1000) // Cache por 5 minutos
            );
            return NextResponse.json(analytics);
          }
        } catch (error) {
          if (stryMutAct_9fa48("6292")) {
            {}
          } else {
            stryCov_9fa48("6292");
            return handleApiError(error, stryMutAct_9fa48("6293") ? "" : (stryCov_9fa48("6293"), 'Error al obtener estadísticas avanzadas'), stryMutAct_9fa48("6294") ? {} : (stryCov_9fa48("6294"), {
              path: stryMutAct_9fa48("6295") ? "" : (stryCov_9fa48("6295"), '/api/analytics')
            }));
          }
        }
      }
    });
  }
}