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
import { metricsQuerySchema } from '@/lib/validations';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("8794") ? "" : (stryCov_9fa48("8794"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("8795")) {
    {}
  } else {
    stryCov_9fa48("8795");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8796")) {
        {}
      } else {
        stryCov_9fa48("8796");
        try {
          if (stryMutAct_9fa48("8797")) {
            {}
          } else {
            stryCov_9fa48("8797");
            logApiRequest(stryMutAct_9fa48("8798") ? "" : (stryCov_9fa48("8798"), 'GET'), stryMutAct_9fa48("8799") ? "" : (stryCov_9fa48("8799"), '/api/metrics'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("8802") ? false : stryMutAct_9fa48("8801") ? true : stryMutAct_9fa48("8800") ? studentId : (stryCov_9fa48("8800", "8801", "8802"), !studentId)) {
              if (stryMutAct_9fa48("8803")) {
                {}
              } else {
                stryCov_9fa48("8803");
                return NextResponse.json(stryMutAct_9fa48("8804") ? {} : (stryCov_9fa48("8804"), {
                  error: stryMutAct_9fa48("8805") ? "" : (stryCov_9fa48("8805"), 'No autorizado')
                }), stryMutAct_9fa48("8806") ? {} : (stryCov_9fa48("8806"), {
                  status: 401
                }));
              }
            }
            const student = await prisma.student.findUnique(stryMutAct_9fa48("8807") ? {} : (stryCov_9fa48("8807"), {
              where: stryMutAct_9fa48("8808") ? {} : (stryCov_9fa48("8808"), {
                id: studentId
              })
            }));
            if (stryMutAct_9fa48("8811") ? false : stryMutAct_9fa48("8810") ? true : stryMutAct_9fa48("8809") ? student : (stryCov_9fa48("8809", "8810", "8811"), !student)) {
              if (stryMutAct_9fa48("8812")) {
                {}
              } else {
                stryCov_9fa48("8812");
                return NextResponse.json(stryMutAct_9fa48("8813") ? {} : (stryCov_9fa48("8813"), {
                  error: stryMutAct_9fa48("8814") ? "" : (stryCov_9fa48("8814"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8815") ? {} : (stryCov_9fa48("8815"), {
                  status: 404
                }));
              }
            }

            // Validar query parameters
            const validation = validateQuery(request, metricsQuerySchema);
            if (stryMutAct_9fa48("8818") ? false : stryMutAct_9fa48("8817") ? true : stryMutAct_9fa48("8816") ? validation.success : (stryCov_9fa48("8816", "8817", "8818"), !validation.success)) {
              if (stryMutAct_9fa48("8819")) {
                {}
              } else {
                stryCov_9fa48("8819");
                return validation.error;
              }
            }
            const {
              subjectId,
              topicId
            } = validation.data;

            // Obtener métricas agrupadas por asignatura
            const metrics = await prisma.performanceMetric.findMany(stryMutAct_9fa48("8820") ? {} : (stryCov_9fa48("8820"), {
              where: stryMutAct_9fa48("8821") ? {} : (stryCov_9fa48("8821"), {
                studentId: student.id,
                ...(stryMutAct_9fa48("8824") ? topicId || {
                  topicId
                } : stryMutAct_9fa48("8823") ? false : stryMutAct_9fa48("8822") ? true : (stryCov_9fa48("8822", "8823", "8824"), topicId && (stryMutAct_9fa48("8825") ? {} : (stryCov_9fa48("8825"), {
                  topicId
                })))),
                ...(stryMutAct_9fa48("8828") ? subjectId || {
                  topic: {
                    subjectId
                  }
                } : stryMutAct_9fa48("8827") ? false : stryMutAct_9fa48("8826") ? true : (stryCov_9fa48("8826", "8827", "8828"), subjectId && (stryMutAct_9fa48("8829") ? {} : (stryCov_9fa48("8829"), {
                  topic: stryMutAct_9fa48("8830") ? {} : (stryCov_9fa48("8830"), {
                    subjectId
                  })
                }))))
              }),
              include: stryMutAct_9fa48("8831") ? {} : (stryCov_9fa48("8831"), {
                topic: stryMutAct_9fa48("8832") ? {} : (stryCov_9fa48("8832"), {
                  include: stryMutAct_9fa48("8833") ? {} : (stryCov_9fa48("8833"), {
                    subject: stryMutAct_9fa48("8834") ? false : (stryCov_9fa48("8834"), true)
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("8835") ? {} : (stryCov_9fa48("8835"), {
                porcentaje: stryMutAct_9fa48("8836") ? "" : (stryCov_9fa48("8836"), 'desc')
              })
            }));

            // Agrupar por asignatura
            interface SubjectMetric {
              codigo: string;
              nombre: string;
              totalPreguntas: number;
              correctas: number;
              temas: Array<{
                nombre: string;
                porcentaje: number;
                nivel: string | null;
              }>;
            }
            const metricsBySubject = metrics.reduce((acc, metric) => {
              if (stryMutAct_9fa48("8837")) {
                {}
              } else {
                stryCov_9fa48("8837");
                const subjectCode = metric.topic.subject.codigo;
                if (stryMutAct_9fa48("8840") ? false : stryMutAct_9fa48("8839") ? true : stryMutAct_9fa48("8838") ? acc[subjectCode] : (stryCov_9fa48("8838", "8839", "8840"), !acc[subjectCode])) {
                  if (stryMutAct_9fa48("8841")) {
                    {}
                  } else {
                    stryCov_9fa48("8841");
                    acc[subjectCode] = stryMutAct_9fa48("8842") ? {} : (stryCov_9fa48("8842"), {
                      codigo: subjectCode,
                      nombre: metric.topic.subject.nombre,
                      totalPreguntas: 0,
                      correctas: 0,
                      temas: stryMutAct_9fa48("8843") ? ["Stryker was here"] : (stryCov_9fa48("8843"), [])
                    });
                  }
                }
                stryMutAct_9fa48("8844") ? acc[subjectCode].totalPreguntas -= metric.totalPreguntas : (stryCov_9fa48("8844"), acc[subjectCode].totalPreguntas += metric.totalPreguntas);
                stryMutAct_9fa48("8845") ? acc[subjectCode].correctas -= metric.correctas : (stryCov_9fa48("8845"), acc[subjectCode].correctas += metric.correctas);
                acc[subjectCode].temas.push(stryMutAct_9fa48("8846") ? {} : (stryCov_9fa48("8846"), {
                  nombre: metric.topic.nombre,
                  porcentaje: metric.porcentaje,
                  nivel: metric.nivel
                }));
                return acc;
              }
            }, {} as Record<string, SubjectMetric>);

            // Calcular porcentaje promedio por asignatura
            const result = Object.values(metricsBySubject).map(stryMutAct_9fa48("8847") ? () => undefined : (stryCov_9fa48("8847"), subject => stryMutAct_9fa48("8848") ? {} : (stryCov_9fa48("8848"), {
              ...subject,
              porcentaje: (stryMutAct_9fa48("8852") ? subject.totalPreguntas <= 0 : stryMutAct_9fa48("8851") ? subject.totalPreguntas >= 0 : stryMutAct_9fa48("8850") ? false : stryMutAct_9fa48("8849") ? true : (stryCov_9fa48("8849", "8850", "8851", "8852"), subject.totalPreguntas > 0)) ? stryMutAct_9fa48("8853") ? subject.correctas / subject.totalPreguntas / 100 : (stryCov_9fa48("8853"), (stryMutAct_9fa48("8854") ? subject.correctas * subject.totalPreguntas : (stryCov_9fa48("8854"), subject.correctas / subject.totalPreguntas)) * 100) : 0
            })));
            return NextResponse.json(result);
          }
        } catch (error) {
          if (stryMutAct_9fa48("8855")) {
            {}
          } else {
            stryCov_9fa48("8855");
            return handleApiError(error, stryMutAct_9fa48("8856") ? "" : (stryCov_9fa48("8856"), 'Error al obtener métricas'), stryMutAct_9fa48("8857") ? {} : (stryCov_9fa48("8857"), {
              path: stryMutAct_9fa48("8858") ? "" : (stryCov_9fa48("8858"), '/api/metrics')
            }));
          }
        }
      }
    });
  }
}