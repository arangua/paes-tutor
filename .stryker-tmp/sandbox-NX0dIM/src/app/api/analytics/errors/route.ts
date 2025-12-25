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
import { getAuthenticatedUserWithStudent } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("5924") ? "" : (stryCov_9fa48("5924"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("5925")) {
    {}
  } else {
    stryCov_9fa48("5925");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5926")) {
        {}
      } else {
        stryCov_9fa48("5926");
        try {
          if (stryMutAct_9fa48("5927")) {
            {}
          } else {
            stryCov_9fa48("5927");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("5930") ? false : stryMutAct_9fa48("5929") ? true : stryMutAct_9fa48("5928") ? dbUser?.email : (stryCov_9fa48("5928", "5929", "5930"), !(stryMutAct_9fa48("5931") ? dbUser.email : (stryCov_9fa48("5931"), dbUser?.email)))) {
              if (stryMutAct_9fa48("5932")) {
                {}
              } else {
                stryCov_9fa48("5932");
                return NextResponse.json(stryMutAct_9fa48("5933") ? {} : (stryCov_9fa48("5933"), {
                  error: stryMutAct_9fa48("5934") ? "" : (stryCov_9fa48("5934"), 'No autorizado')
                }), stryMutAct_9fa48("5935") ? {} : (stryCov_9fa48("5935"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("5938") ? false : stryMutAct_9fa48("5937") ? true : stryMutAct_9fa48("5936") ? dbUser.student : (stryCov_9fa48("5936", "5937", "5938"), !dbUser.student)) {
              if (stryMutAct_9fa48("5939")) {
                {}
              } else {
                stryCov_9fa48("5939");
                return NextResponse.json(stryMutAct_9fa48("5940") ? {} : (stryCov_9fa48("5940"), {
                  error: stryMutAct_9fa48("5941") ? "" : (stryCov_9fa48("5941"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("5942") ? {} : (stryCov_9fa48("5942"), {
                  status: 404
                }));
              }
            }

            // Obtener todas las respuestas incorrectas del estudiante
            const incorrectAnswers = await prisma.attemptAnswer.findMany(stryMutAct_9fa48("5943") ? {} : (stryCov_9fa48("5943"), {
              where: stryMutAct_9fa48("5944") ? {} : (stryCov_9fa48("5944"), {
                attempt: stryMutAct_9fa48("5945") ? {} : (stryCov_9fa48("5945"), {
                  studentId: dbUser.student.id
                }),
                esCorrecta: stryMutAct_9fa48("5946") ? true : (stryCov_9fa48("5946"), false),
                omitida: stryMutAct_9fa48("5947") ? true : (stryCov_9fa48("5947"), false)
              }),
              include: stryMutAct_9fa48("5948") ? {} : (stryCov_9fa48("5948"), {
                attempt: stryMutAct_9fa48("5949") ? {} : (stryCov_9fa48("5949"), {
                  select: stryMutAct_9fa48("5950") ? {} : (stryCov_9fa48("5950"), {
                    id: stryMutAct_9fa48("5951") ? false : (stryCov_9fa48("5951"), true),
                    startedAt: stryMutAct_9fa48("5952") ? false : (stryCov_9fa48("5952"), true)
                  })
                }),
                question: stryMutAct_9fa48("5953") ? {} : (stryCov_9fa48("5953"), {
                  include: stryMutAct_9fa48("5954") ? {} : (stryCov_9fa48("5954"), {
                    topic: stryMutAct_9fa48("5955") ? {} : (stryCov_9fa48("5955"), {
                      select: stryMutAct_9fa48("5956") ? {} : (stryCov_9fa48("5956"), {
                        id: stryMutAct_9fa48("5957") ? false : (stryCov_9fa48("5957"), true),
                        nombre: stryMutAct_9fa48("5958") ? false : (stryCov_9fa48("5958"), true),
                        ejeTematico: stryMutAct_9fa48("5959") ? false : (stryCov_9fa48("5959"), true),
                        subjectId: stryMutAct_9fa48("5960") ? false : (stryCov_9fa48("5960"), true)
                      })
                    }),
                    subject: stryMutAct_9fa48("5961") ? {} : (stryCov_9fa48("5961"), {
                      select: stryMutAct_9fa48("5962") ? {} : (stryCov_9fa48("5962"), {
                        id: stryMutAct_9fa48("5963") ? false : (stryCov_9fa48("5963"), true),
                        nombre: stryMutAct_9fa48("5964") ? false : (stryCov_9fa48("5964"), true),
                        codigo: stryMutAct_9fa48("5965") ? false : (stryCov_9fa48("5965"), true)
                      })
                    })
                  })
                })
              })
            }));

            // Agrupar errores por tema
            const errorsByTopic = new Map<string, {
              topicId: string;
              topicName: string;
              ejeTematico: string;
              subjectId: string;
              subjectName: string;
              subjectCode: string;
              errorCount: number;
              questions: Array<{
                questionId: string;
                enunciado: string;
                vecesFallada: number;
              }>;
            }>();

            // Agrupar errores por pregunta
            const errorsByQuestion = new Map<string, {
              questionId: string;
              enunciado: string;
              topicId: string | null;
              topicName: string | null;
              subjectName: string;
              errorCount: number;
            }>();
            incorrectAnswers.forEach(answer => {
              if (stryMutAct_9fa48("5966")) {
                {}
              } else {
                stryCov_9fa48("5966");
                const question = answer.question;
                const topic = question.topic;
                const subject = question.subject;

                // Agrupar por tema
                if (stryMutAct_9fa48("5968") ? false : stryMutAct_9fa48("5967") ? true : (stryCov_9fa48("5967", "5968"), topic)) {
                  if (stryMutAct_9fa48("5969")) {
                    {}
                  } else {
                    stryCov_9fa48("5969");
                    const key = topic.id;
                    if (stryMutAct_9fa48("5972") ? false : stryMutAct_9fa48("5971") ? true : stryMutAct_9fa48("5970") ? errorsByTopic.has(key) : (stryCov_9fa48("5970", "5971", "5972"), !errorsByTopic.has(key))) {
                      if (stryMutAct_9fa48("5973")) {
                        {}
                      } else {
                        stryCov_9fa48("5973");
                        errorsByTopic.set(key, stryMutAct_9fa48("5974") ? {} : (stryCov_9fa48("5974"), {
                          topicId: topic.id,
                          topicName: topic.nombre,
                          ejeTematico: topic.ejeTematico,
                          subjectId: subject.id,
                          subjectName: subject.nombre,
                          subjectCode: subject.codigo,
                          errorCount: 0,
                          questions: stryMutAct_9fa48("5975") ? ["Stryker was here"] : (stryCov_9fa48("5975"), [])
                        }));
                      }
                    }
                    const topicData = errorsByTopic.get(key)!;
                    stryMutAct_9fa48("5976") ? topicData.errorCount-- : (stryCov_9fa48("5976"), topicData.errorCount++);

                    // Agregar pregunta al tema si no existe
                    const existingQuestion = topicData.questions.find(stryMutAct_9fa48("5977") ? () => undefined : (stryCov_9fa48("5977"), q => stryMutAct_9fa48("5980") ? q.questionId !== question.id : stryMutAct_9fa48("5979") ? false : stryMutAct_9fa48("5978") ? true : (stryCov_9fa48("5978", "5979", "5980"), q.questionId === question.id)));
                    if (stryMutAct_9fa48("5982") ? false : stryMutAct_9fa48("5981") ? true : (stryCov_9fa48("5981", "5982"), existingQuestion)) {
                      if (stryMutAct_9fa48("5983")) {
                        {}
                      } else {
                        stryCov_9fa48("5983");
                        stryMutAct_9fa48("5984") ? existingQuestion.vecesFallada-- : (stryCov_9fa48("5984"), existingQuestion.vecesFallada++);
                      }
                    } else {
                      if (stryMutAct_9fa48("5985")) {
                        {}
                      } else {
                        stryCov_9fa48("5985");
                        topicData.questions.push(stryMutAct_9fa48("5986") ? {} : (stryCov_9fa48("5986"), {
                          questionId: question.id,
                          enunciado: question.enunciado,
                          vecesFallada: 1
                        }));
                      }
                    }
                  }
                }

                // Agrupar por pregunta
                const questionKey = question.id;
                if (stryMutAct_9fa48("5989") ? false : stryMutAct_9fa48("5988") ? true : stryMutAct_9fa48("5987") ? errorsByQuestion.has(questionKey) : (stryCov_9fa48("5987", "5988", "5989"), !errorsByQuestion.has(questionKey))) {
                  if (stryMutAct_9fa48("5990")) {
                    {}
                  } else {
                    stryCov_9fa48("5990");
                    errorsByQuestion.set(questionKey, stryMutAct_9fa48("5991") ? {} : (stryCov_9fa48("5991"), {
                      questionId: question.id,
                      enunciado: question.enunciado,
                      topicId: stryMutAct_9fa48("5994") ? topic?.id && null : stryMutAct_9fa48("5993") ? false : stryMutAct_9fa48("5992") ? true : (stryCov_9fa48("5992", "5993", "5994"), (stryMutAct_9fa48("5995") ? topic.id : (stryCov_9fa48("5995"), topic?.id)) || null),
                      topicName: stryMutAct_9fa48("5998") ? topic?.nombre && null : stryMutAct_9fa48("5997") ? false : stryMutAct_9fa48("5996") ? true : (stryCov_9fa48("5996", "5997", "5998"), (stryMutAct_9fa48("5999") ? topic.nombre : (stryCov_9fa48("5999"), topic?.nombre)) || null),
                      subjectName: subject.nombre,
                      errorCount: 0
                    }));
                  }
                }
                const questionData = errorsByQuestion.get(questionKey)!;
                stryMutAct_9fa48("6000") ? questionData.errorCount-- : (stryCov_9fa48("6000"), questionData.errorCount++);
              }
            });

            // Convertir a arrays y ordenar
            const topicsArray = stryMutAct_9fa48("6001") ? Array.from(errorsByTopic.values()).map(topic => ({
              ...topic,
              questions: topic.questions.sort((a, b) => b.vecesFallada - a.vecesFallada)
            })) : (stryCov_9fa48("6001"), Array.from(errorsByTopic.values()).map(stryMutAct_9fa48("6002") ? () => undefined : (stryCov_9fa48("6002"), topic => stryMutAct_9fa48("6003") ? {} : (stryCov_9fa48("6003"), {
              ...topic,
              questions: stryMutAct_9fa48("6004") ? topic.questions : (stryCov_9fa48("6004"), topic.questions.sort(stryMutAct_9fa48("6005") ? () => undefined : (stryCov_9fa48("6005"), (a, b) => stryMutAct_9fa48("6006") ? b.vecesFallada + a.vecesFallada : (stryCov_9fa48("6006"), b.vecesFallada - a.vecesFallada))))
            }))).sort(stryMutAct_9fa48("6007") ? () => undefined : (stryCov_9fa48("6007"), (a, b) => stryMutAct_9fa48("6008") ? b.errorCount + a.errorCount : (stryCov_9fa48("6008"), b.errorCount - a.errorCount))));
            const questionsArray = stryMutAct_9fa48("6009") ? Array.from(errorsByQuestion.values()) : (stryCov_9fa48("6009"), Array.from(errorsByQuestion.values()).sort(stryMutAct_9fa48("6010") ? () => undefined : (stryCov_9fa48("6010"), (a, b) => stryMutAct_9fa48("6011") ? b.errorCount + a.errorCount : (stryCov_9fa48("6011"), b.errorCount - a.errorCount))));

            // Obtener top 10 errores más comunes
            const topErrors = stryMutAct_9fa48("6012") ? questionsArray : (stryCov_9fa48("6012"), questionsArray.slice(0, 10));

            // Calcular estadísticas por asignatura
            const errorsBySubject = new Map<string, {
              subjectId: string;
              subjectName: string;
              subjectCode: string;
              errorCount: number;
              topicCount: number;
            }>();
            topicsArray.forEach(topic => {
              if (stryMutAct_9fa48("6013")) {
                {}
              } else {
                stryCov_9fa48("6013");
                const key = topic.subjectId;
                if (stryMutAct_9fa48("6016") ? false : stryMutAct_9fa48("6015") ? true : stryMutAct_9fa48("6014") ? errorsBySubject.has(key) : (stryCov_9fa48("6014", "6015", "6016"), !errorsBySubject.has(key))) {
                  if (stryMutAct_9fa48("6017")) {
                    {}
                  } else {
                    stryCov_9fa48("6017");
                    errorsBySubject.set(key, stryMutAct_9fa48("6018") ? {} : (stryCov_9fa48("6018"), {
                      subjectId: topic.subjectId,
                      subjectName: topic.subjectName,
                      subjectCode: topic.subjectCode,
                      errorCount: 0,
                      topicCount: 0
                    }));
                  }
                }
                const subjectData = errorsBySubject.get(key)!;
                stryMutAct_9fa48("6019") ? subjectData.errorCount -= topic.errorCount : (stryCov_9fa48("6019"), subjectData.errorCount += topic.errorCount);
                stryMutAct_9fa48("6020") ? subjectData.topicCount-- : (stryCov_9fa48("6020"), subjectData.topicCount++);
              }
            });
            const subjectsArray = stryMutAct_9fa48("6021") ? Array.from(errorsBySubject.values()) : (stryCov_9fa48("6021"), Array.from(errorsBySubject.values()).sort(stryMutAct_9fa48("6022") ? () => undefined : (stryCov_9fa48("6022"), (a, b) => stryMutAct_9fa48("6023") ? b.errorCount + a.errorCount : (stryCov_9fa48("6023"), b.errorCount - a.errorCount))));

            // Calcular tendencia (comparar últimos 30 días con anteriores)
            const thirtyDaysAgo = new Date();
            stryMutAct_9fa48("6024") ? thirtyDaysAgo.setTime(thirtyDaysAgo.getDate() - 30) : (stryCov_9fa48("6024"), thirtyDaysAgo.setDate(stryMutAct_9fa48("6025") ? thirtyDaysAgo.getDate() + 30 : (stryCov_9fa48("6025"), thirtyDaysAgo.getDate() - 30)));
            const recentErrors = stryMutAct_9fa48("6026") ? incorrectAnswers.length : (stryCov_9fa48("6026"), incorrectAnswers.filter(stryMutAct_9fa48("6027") ? () => undefined : (stryCov_9fa48("6027"), a => stryMutAct_9fa48("6031") ? a.attempt.startedAt < thirtyDaysAgo : stryMutAct_9fa48("6030") ? a.attempt.startedAt > thirtyDaysAgo : stryMutAct_9fa48("6029") ? false : stryMutAct_9fa48("6028") ? true : (stryCov_9fa48("6028", "6029", "6030", "6031"), a.attempt.startedAt >= thirtyDaysAgo))).length);
            const olderErrors = stryMutAct_9fa48("6032") ? incorrectAnswers.length : (stryCov_9fa48("6032"), incorrectAnswers.filter(stryMutAct_9fa48("6033") ? () => undefined : (stryCov_9fa48("6033"), a => stryMutAct_9fa48("6037") ? a.attempt.startedAt >= thirtyDaysAgo : stryMutAct_9fa48("6036") ? a.attempt.startedAt <= thirtyDaysAgo : stryMutAct_9fa48("6035") ? false : stryMutAct_9fa48("6034") ? true : (stryCov_9fa48("6034", "6035", "6036", "6037"), a.attempt.startedAt < thirtyDaysAgo))).length);
            const totalAttempts = await prisma.attempt.count(stryMutAct_9fa48("6038") ? {} : (stryCov_9fa48("6038"), {
              where: stryMutAct_9fa48("6039") ? {} : (stryCov_9fa48("6039"), {
                studentId: dbUser.student.id,
                estado: stryMutAct_9fa48("6040") ? "" : (stryCov_9fa48("6040"), 'completado')
              })
            }));
            const recentAttempts = await prisma.attempt.count(stryMutAct_9fa48("6041") ? {} : (stryCov_9fa48("6041"), {
              where: stryMutAct_9fa48("6042") ? {} : (stryCov_9fa48("6042"), {
                studentId: dbUser.student.id,
                estado: stryMutAct_9fa48("6043") ? "" : (stryCov_9fa48("6043"), 'completado'),
                startedAt: stryMutAct_9fa48("6044") ? {} : (stryCov_9fa48("6044"), {
                  gte: thirtyDaysAgo
                })
              })
            }));
            const recentErrorRate = (stryMutAct_9fa48("6048") ? recentAttempts <= 0 : stryMutAct_9fa48("6047") ? recentAttempts >= 0 : stryMutAct_9fa48("6046") ? false : stryMutAct_9fa48("6045") ? true : (stryCov_9fa48("6045", "6046", "6047", "6048"), recentAttempts > 0)) ? stryMutAct_9fa48("6049") ? recentErrors / (recentAttempts * 20) / 100 // Asumiendo ~20 preguntas por examen
            : (stryCov_9fa48("6049"), (stryMutAct_9fa48("6050") ? recentErrors * (recentAttempts * 20) : (stryCov_9fa48("6050"), recentErrors / (stryMutAct_9fa48("6051") ? recentAttempts / 20 : (stryCov_9fa48("6051"), recentAttempts * 20)))) * 100) // Asumiendo ~20 preguntas por examen
            : 0;
            const olderErrorRate = (stryMutAct_9fa48("6055") ? totalAttempts - recentAttempts <= 0 : stryMutAct_9fa48("6054") ? totalAttempts - recentAttempts >= 0 : stryMutAct_9fa48("6053") ? false : stryMutAct_9fa48("6052") ? true : (stryCov_9fa48("6052", "6053", "6054", "6055"), (stryMutAct_9fa48("6056") ? totalAttempts + recentAttempts : (stryCov_9fa48("6056"), totalAttempts - recentAttempts)) > 0)) ? stryMutAct_9fa48("6057") ? olderErrors / ((totalAttempts - recentAttempts) * 20) / 100 : (stryCov_9fa48("6057"), (stryMutAct_9fa48("6058") ? olderErrors * ((totalAttempts - recentAttempts) * 20) : (stryCov_9fa48("6058"), olderErrors / (stryMutAct_9fa48("6059") ? (totalAttempts - recentAttempts) / 20 : (stryCov_9fa48("6059"), (stryMutAct_9fa48("6060") ? totalAttempts + recentAttempts : (stryCov_9fa48("6060"), totalAttempts - recentAttempts)) * 20)))) * 100) : 0;
            const trend = (stryMutAct_9fa48("6064") ? recentErrorRate >= olderErrorRate : stryMutAct_9fa48("6063") ? recentErrorRate <= olderErrorRate : stryMutAct_9fa48("6062") ? false : stryMutAct_9fa48("6061") ? true : (stryCov_9fa48("6061", "6062", "6063", "6064"), recentErrorRate < olderErrorRate)) ? stryMutAct_9fa48("6065") ? "" : (stryCov_9fa48("6065"), 'mejorando') : (stryMutAct_9fa48("6069") ? recentErrorRate <= olderErrorRate : stryMutAct_9fa48("6068") ? recentErrorRate >= olderErrorRate : stryMutAct_9fa48("6067") ? false : stryMutAct_9fa48("6066") ? true : (stryCov_9fa48("6066", "6067", "6068", "6069"), recentErrorRate > olderErrorRate)) ? stryMutAct_9fa48("6070") ? "" : (stryCov_9fa48("6070"), 'empeorando') : stryMutAct_9fa48("6071") ? "" : (stryCov_9fa48("6071"), 'estable');
            return NextResponse.json(stryMutAct_9fa48("6072") ? {} : (stryCov_9fa48("6072"), {
              summary: stryMutAct_9fa48("6073") ? {} : (stryCov_9fa48("6073"), {
                totalErrors: incorrectAnswers.length,
                uniqueQuestions: questionsArray.length,
                topicsAffected: topicsArray.length,
                trend,
                recentErrorRate: stryMutAct_9fa48("6074") ? Math.round(recentErrorRate * 10) * 10 : (stryCov_9fa48("6074"), Math.round(stryMutAct_9fa48("6075") ? recentErrorRate / 10 : (stryCov_9fa48("6075"), recentErrorRate * 10)) / 10),
                olderErrorRate: stryMutAct_9fa48("6076") ? Math.round(olderErrorRate * 10) * 10 : (stryCov_9fa48("6076"), Math.round(stryMutAct_9fa48("6077") ? olderErrorRate / 10 : (stryCov_9fa48("6077"), olderErrorRate * 10)) / 10)
              }),
              topErrors,
              errorsByTopic: topicsArray,
              errorsBySubject: subjectsArray
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6078")) {
            {}
          } else {
            stryCov_9fa48("6078");
            logger.error(stryMutAct_9fa48("6079") ? {} : (stryCov_9fa48("6079"), {
              type: stryMutAct_9fa48("6080") ? "" : (stryCov_9fa48("6080"), 'analytics_errors_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("6081") ? "" : (stryCov_9fa48("6081"), 'Error al obtener análisis de errores'));
            return NextResponse.json(stryMutAct_9fa48("6082") ? {} : (stryCov_9fa48("6082"), {
              error: stryMutAct_9fa48("6083") ? "" : (stryCov_9fa48("6083"), 'Error al obtener análisis de errores')
            }), stryMutAct_9fa48("6084") ? {} : (stryCov_9fa48("6084"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}