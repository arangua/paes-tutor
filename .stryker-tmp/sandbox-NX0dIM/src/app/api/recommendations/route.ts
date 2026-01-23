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
import { withRateLimit, RateLimitType } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache';
import { generateRecommendations, type PerformanceMetric as MetricType } from '@/lib/recommendations';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("9455") ? "" : (stryCov_9fa48("9455"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("9456")) {
    {}
  } else {
    stryCov_9fa48("9456");
    // Usar 'read' para endpoints de lectura que se llaman frecuentemente desde el dashboard
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9457")) {
        {}
      } else {
        stryCov_9fa48("9457");
        try {
          if (stryMutAct_9fa48("9458")) {
            {}
          } else {
            stryCov_9fa48("9458");
            logApiRequest(stryMutAct_9fa48("9459") ? "" : (stryCov_9fa48("9459"), 'GET'), stryMutAct_9fa48("9460") ? "" : (stryCov_9fa48("9460"), '/api/recommendations'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("9463") ? false : stryMutAct_9fa48("9462") ? true : stryMutAct_9fa48("9461") ? studentId : (stryCov_9fa48("9461", "9462", "9463"), !studentId)) {
              if (stryMutAct_9fa48("9464")) {
                {}
              } else {
                stryCov_9fa48("9464");
                return NextResponse.json(stryMutAct_9fa48("9465") ? {} : (stryCov_9fa48("9465"), {
                  error: stryMutAct_9fa48("9466") ? "" : (stryCov_9fa48("9466"), 'No autorizado')
                }), stryMutAct_9fa48("9467") ? {} : (stryCov_9fa48("9467"), {
                  status: 401
                }));
              }
            }

            // Usar caché para recomendaciones (cambian poco)
            const recommendations = await getCached(cacheKeys.studentRecommendations(studentId), async () => {
              if (stryMutAct_9fa48("9468")) {
                {}
              } else {
                stryCov_9fa48("9468");
                // Obtener métricas del estudiante
                // Optimizar usando select en lugar de include
                const metrics = await prisma.performanceMetric.findMany(stryMutAct_9fa48("9469") ? {} : (stryCov_9fa48("9469"), {
                  where: stryMutAct_9fa48("9470") ? {} : (stryCov_9fa48("9470"), {
                    studentId
                  }),
                  select: stryMutAct_9fa48("9471") ? {} : (stryCov_9fa48("9471"), {
                    topicId: stryMutAct_9fa48("9472") ? false : (stryCov_9fa48("9472"), true),
                    porcentaje: stryMutAct_9fa48("9473") ? false : (stryCov_9fa48("9473"), true),
                    totalPreguntas: stryMutAct_9fa48("9474") ? false : (stryCov_9fa48("9474"), true),
                    correctas: stryMutAct_9fa48("9475") ? false : (stryCov_9fa48("9475"), true),
                    nivel: stryMutAct_9fa48("9476") ? false : (stryCov_9fa48("9476"), true),
                    topic: stryMutAct_9fa48("9477") ? {} : (stryCov_9fa48("9477"), {
                      select: stryMutAct_9fa48("9478") ? {} : (stryCov_9fa48("9478"), {
                        nombre: stryMutAct_9fa48("9479") ? false : (stryCov_9fa48("9479"), true),
                        subject: stryMutAct_9fa48("9480") ? {} : (stryCov_9fa48("9480"), {
                          select: stryMutAct_9fa48("9481") ? {} : (stryCov_9fa48("9481"), {
                            nombre: stryMutAct_9fa48("9482") ? false : (stryCov_9fa48("9482"), true),
                            codigo: stryMutAct_9fa48("9483") ? false : (stryCov_9fa48("9483"), true)
                          })
                        })
                      })
                    })
                  })
                }));

                // Convertir a formato esperado por el algoritmo
                const performanceMetrics: MetricType[] = metrics.map(stryMutAct_9fa48("9484") ? () => undefined : (stryCov_9fa48("9484"), m => stryMutAct_9fa48("9485") ? {} : (stryCov_9fa48("9485"), {
                  topicId: m.topicId,
                  topicName: m.topic.nombre,
                  subjectName: m.topic.subject.nombre,
                  subjectCode: m.topic.subject.codigo,
                  porcentaje: m.porcentaje,
                  totalPreguntas: m.totalPreguntas,
                  correctas: m.correctas,
                  nivel: m.nivel
                })));

                // Obtener exámenes disponibles
                // Optimizar usando select en lugar de include
                // Limitar a últimos 50 exámenes para performance
                const exams = await prisma.exam.findMany(stryMutAct_9fa48("9486") ? {} : (stryCov_9fa48("9486"), {
                  select: stryMutAct_9fa48("9487") ? {} : (stryCov_9fa48("9487"), {
                    id: stryMutAct_9fa48("9488") ? false : (stryCov_9fa48("9488"), true),
                    titulo: stryMutAct_9fa48("9489") ? false : (stryCov_9fa48("9489"), true),
                    subjectId: stryMutAct_9fa48("9490") ? false : (stryCov_9fa48("9490"), true),
                    subject: stryMutAct_9fa48("9491") ? {} : (stryCov_9fa48("9491"), {
                      select: stryMutAct_9fa48("9492") ? {} : (stryCov_9fa48("9492"), {
                        nombre: stryMutAct_9fa48("9493") ? false : (stryCov_9fa48("9493"), true),
                        codigo: stryMutAct_9fa48("9494") ? false : (stryCov_9fa48("9494"), true)
                      })
                    }),
                    questions: stryMutAct_9fa48("9495") ? {} : (stryCov_9fa48("9495"), {
                      select: stryMutAct_9fa48("9496") ? {} : (stryCov_9fa48("9496"), {
                        question: stryMutAct_9fa48("9497") ? {} : (stryCov_9fa48("9497"), {
                          select: stryMutAct_9fa48("9498") ? {} : (stryCov_9fa48("9498"), {
                            topicId: stryMutAct_9fa48("9499") ? false : (stryCov_9fa48("9499"), true)
                          })
                        })
                      })
                    })
                  }),
                  take: 50,
                  // Límite para recomendaciones
                  orderBy: stryMutAct_9fa48("9500") ? {} : (stryCov_9fa48("9500"), {
                    createdAt: stryMutAct_9fa48("9501") ? "" : (stryCov_9fa48("9501"), 'desc')
                  })
                }));

                // Convertir a formato esperado
                const availableExams = exams.map(stryMutAct_9fa48("9502") ? () => undefined : (stryCov_9fa48("9502"), exam => stryMutAct_9fa48("9503") ? {} : (stryCov_9fa48("9503"), {
                  id: exam.id,
                  titulo: exam.titulo,
                  subjectId: exam.subjectId,
                  subject: stryMutAct_9fa48("9504") ? {} : (stryCov_9fa48("9504"), {
                    nombre: exam.subject.nombre,
                    codigo: exam.subject.codigo
                  }),
                  questions: exam.questions.map(stryMutAct_9fa48("9505") ? () => undefined : (stryCov_9fa48("9505"), eq => stryMutAct_9fa48("9506") ? {} : (stryCov_9fa48("9506"), {
                    question: stryMutAct_9fa48("9507") ? {} : (stryCov_9fa48("9507"), {
                      topicId: eq.question.topicId
                    })
                  })))
                })));

                // Generar recomendaciones
                return generateRecommendations(performanceMetrics, availableExams);
              }
            }, stryMutAct_9fa48("9508") ? 5 * 60 / 1000 // Cache por 5 minutos
            : (stryCov_9fa48("9508"), (stryMutAct_9fa48("9509") ? 5 / 60 : (stryCov_9fa48("9509"), 5 * 60)) * 1000) // Cache por 5 minutos
            );
            return NextResponse.json(recommendations);
          }
        } catch (error) {
          if (stryMutAct_9fa48("9510")) {
            {}
          } else {
            stryCov_9fa48("9510");
            return handleApiError(error, stryMutAct_9fa48("9511") ? "" : (stryCov_9fa48("9511"), 'Error al obtener recomendaciones'), stryMutAct_9fa48("9512") ? {} : (stryCov_9fa48("9512"), {
              path: stryMutAct_9fa48("9513") ? "" : (stryCov_9fa48("9513"), '/api/recommendations')
            }));
          }
        }
      }
    }, stryMutAct_9fa48("9514") ? "" : (stryCov_9fa48("9514"), 'read'));
  }
}