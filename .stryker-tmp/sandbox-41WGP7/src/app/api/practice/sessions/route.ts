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
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("9295") ? "" : (stryCov_9fa48("9295"), 'nodejs');
const createSessionSchema = z.object(stryMutAct_9fa48("9296") ? {} : (stryCov_9fa48("9296"), {
  topicId: stryMutAct_9fa48("9297") ? z.string().max(1) : (stryCov_9fa48("9297"), z.string().min(1)),
  answers: z.array(z.object(stryMutAct_9fa48("9298") ? {} : (stryCov_9fa48("9298"), {
    questionId: z.string(),
    optionSelectedId: z.string().optional(),
    omitida: z.boolean().optional(),
    tiempoSegundos: z.number().optional()
  })))
}));
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("9299")) {
    {}
  } else {
    stryCov_9fa48("9299");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9300")) {
        {}
      } else {
        stryCov_9fa48("9300");
        try {
          if (stryMutAct_9fa48("9301")) {
            {}
          } else {
            stryCov_9fa48("9301");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9304") ? false : stryMutAct_9fa48("9303") ? true : stryMutAct_9fa48("9302") ? dbUser?.email : (stryCov_9fa48("9302", "9303", "9304"), !(stryMutAct_9fa48("9305") ? dbUser.email : (stryCov_9fa48("9305"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9306")) {
                {}
              } else {
                stryCov_9fa48("9306");
                return NextResponse.json(stryMutAct_9fa48("9307") ? {} : (stryCov_9fa48("9307"), {
                  error: stryMutAct_9fa48("9308") ? "" : (stryCov_9fa48("9308"), 'No autorizado')
                }), stryMutAct_9fa48("9309") ? {} : (stryCov_9fa48("9309"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9312") ? false : stryMutAct_9fa48("9311") ? true : stryMutAct_9fa48("9310") ? dbUser.student : (stryCov_9fa48("9310", "9311", "9312"), !dbUser.student)) {
              if (stryMutAct_9fa48("9313")) {
                {}
              } else {
                stryCov_9fa48("9313");
                return NextResponse.json(stryMutAct_9fa48("9314") ? {} : (stryCov_9fa48("9314"), {
                  error: stryMutAct_9fa48("9315") ? "" : (stryCov_9fa48("9315"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9316") ? {} : (stryCov_9fa48("9316"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const validation = createSessionSchema.safeParse(body);
            if (stryMutAct_9fa48("9319") ? false : stryMutAct_9fa48("9318") ? true : stryMutAct_9fa48("9317") ? validation.success : (stryCov_9fa48("9317", "9318", "9319"), !validation.success)) {
              if (stryMutAct_9fa48("9320")) {
                {}
              } else {
                stryCov_9fa48("9320");
                return NextResponse.json(stryMutAct_9fa48("9321") ? {} : (stryCov_9fa48("9321"), {
                  error: stryMutAct_9fa48("9322") ? "" : (stryCov_9fa48("9322"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("9323") ? {} : (stryCov_9fa48("9323"), {
                  status: 400
                }));
              }
            }
            const {
              topicId,
              answers
            } = validation.data;

            // Verificar que el tema existe
            const topic = await prisma.topic.findUnique(stryMutAct_9fa48("9324") ? {} : (stryCov_9fa48("9324"), {
              where: stryMutAct_9fa48("9325") ? {} : (stryCov_9fa48("9325"), {
                id: topicId
              })
            }));
            if (stryMutAct_9fa48("9328") ? false : stryMutAct_9fa48("9327") ? true : stryMutAct_9fa48("9326") ? topic : (stryCov_9fa48("9326", "9327", "9328"), !topic)) {
              if (stryMutAct_9fa48("9329")) {
                {}
              } else {
                stryCov_9fa48("9329");
                return NextResponse.json(stryMutAct_9fa48("9330") ? {} : (stryCov_9fa48("9330"), {
                  error: stryMutAct_9fa48("9331") ? "" : (stryCov_9fa48("9331"), 'Tema no encontrado')
                }), stryMutAct_9fa48("9332") ? {} : (stryCov_9fa48("9332"), {
                  status: 404
                }));
              }
            }

            // Calcular estadísticas
            let correctas = 0;
            let incorrectas = 0;
            let omitidas = 0;
            const totalPreguntas = answers.length;

            // Obtener todas las preguntas y sus respuestas correctas
            const questionIds = answers.map(stryMutAct_9fa48("9333") ? () => undefined : (stryCov_9fa48("9333"), a => a.questionId));
            const questions = await prisma.question.findMany(stryMutAct_9fa48("9334") ? {} : (stryCov_9fa48("9334"), {
              where: stryMutAct_9fa48("9335") ? {} : (stryCov_9fa48("9335"), {
                id: stryMutAct_9fa48("9336") ? {} : (stryCov_9fa48("9336"), {
                  in: questionIds
                })
              }),
              include: stryMutAct_9fa48("9337") ? {} : (stryCov_9fa48("9337"), {
                options: stryMutAct_9fa48("9338") ? {} : (stryCov_9fa48("9338"), {
                  where: stryMutAct_9fa48("9339") ? {} : (stryCov_9fa48("9339"), {
                    esCorrecta: stryMutAct_9fa48("9340") ? false : (stryCov_9fa48("9340"), true)
                  })
                })
              })
            }));
            const correctAnswersMap = new Map(questions.map(stryMutAct_9fa48("9341") ? () => undefined : (stryCov_9fa48("9341"), q => stryMutAct_9fa48("9342") ? [] : (stryCov_9fa48("9342"), [q.id, stryMutAct_9fa48("9343") ? q.options[0].id : (stryCov_9fa48("9343"), q.options[0]?.id)]))));

            // Procesar respuestas
            const practiceAnswers = answers.map(answer => {
              if (stryMutAct_9fa48("9344")) {
                {}
              } else {
                stryCov_9fa48("9344");
                const correctOptionId = correctAnswersMap.get(answer.questionId);
                const isCorrect = stryMutAct_9fa48("9347") ? answer.optionSelectedId === correctOptionId || !answer.omitida : stryMutAct_9fa48("9346") ? false : stryMutAct_9fa48("9345") ? true : (stryCov_9fa48("9345", "9346", "9347"), (stryMutAct_9fa48("9349") ? answer.optionSelectedId !== correctOptionId : stryMutAct_9fa48("9348") ? true : (stryCov_9fa48("9348", "9349"), answer.optionSelectedId === correctOptionId)) && (stryMutAct_9fa48("9350") ? answer.omitida : (stryCov_9fa48("9350"), !answer.omitida)));
                const isOmitted = stryMutAct_9fa48("9353") ? answer.omitida && !answer.optionSelectedId : stryMutAct_9fa48("9352") ? false : stryMutAct_9fa48("9351") ? true : (stryCov_9fa48("9351", "9352", "9353"), answer.omitida || (stryMutAct_9fa48("9354") ? answer.optionSelectedId : (stryCov_9fa48("9354"), !answer.optionSelectedId)));
                if (stryMutAct_9fa48("9356") ? false : stryMutAct_9fa48("9355") ? true : (stryCov_9fa48("9355", "9356"), isOmitted)) {
                  if (stryMutAct_9fa48("9357")) {
                    {}
                  } else {
                    stryCov_9fa48("9357");
                    stryMutAct_9fa48("9358") ? omitidas-- : (stryCov_9fa48("9358"), omitidas++);
                  }
                } else if (stryMutAct_9fa48("9360") ? false : stryMutAct_9fa48("9359") ? true : (stryCov_9fa48("9359", "9360"), isCorrect)) {
                  if (stryMutAct_9fa48("9361")) {
                    {}
                  } else {
                    stryCov_9fa48("9361");
                    stryMutAct_9fa48("9362") ? correctas-- : (stryCov_9fa48("9362"), correctas++);
                  }
                } else {
                  if (stryMutAct_9fa48("9363")) {
                    {}
                  } else {
                    stryCov_9fa48("9363");
                    stryMutAct_9fa48("9364") ? incorrectas-- : (stryCov_9fa48("9364"), incorrectas++);
                  }
                }
                return stryMutAct_9fa48("9365") ? {} : (stryCov_9fa48("9365"), {
                  questionId: answer.questionId,
                  optionSelectedId: stryMutAct_9fa48("9368") ? answer.optionSelectedId && null : stryMutAct_9fa48("9367") ? false : stryMutAct_9fa48("9366") ? true : (stryCov_9fa48("9366", "9367", "9368"), answer.optionSelectedId || null),
                  esCorrecta: isCorrect,
                  omitida: isOmitted,
                  tiempoSegundos: stryMutAct_9fa48("9371") ? answer.tiempoSegundos && null : stryMutAct_9fa48("9370") ? false : stryMutAct_9fa48("9369") ? true : (stryCov_9fa48("9369", "9370", "9371"), answer.tiempoSegundos || null)
                });
              }
            });
            const porcentaje = (stryMutAct_9fa48("9375") ? totalPreguntas <= 0 : stryMutAct_9fa48("9374") ? totalPreguntas >= 0 : stryMutAct_9fa48("9373") ? false : stryMutAct_9fa48("9372") ? true : (stryCov_9fa48("9372", "9373", "9374", "9375"), totalPreguntas > 0)) ? stryMutAct_9fa48("9376") ? correctas / totalPreguntas / 100 : (stryCov_9fa48("9376"), (stryMutAct_9fa48("9377") ? correctas * totalPreguntas : (stryCov_9fa48("9377"), correctas / totalPreguntas)) * 100) : 0;

            // Calcular duración total
            const duracionSegundos = answers.reduce(stryMutAct_9fa48("9378") ? () => undefined : (stryCov_9fa48("9378"), (sum, a) => stryMutAct_9fa48("9379") ? sum - (a.tiempoSegundos || 0) : (stryCov_9fa48("9379"), sum + (stryMutAct_9fa48("9382") ? a.tiempoSegundos && 0 : stryMutAct_9fa48("9381") ? false : stryMutAct_9fa48("9380") ? true : (stryCov_9fa48("9380", "9381", "9382"), a.tiempoSegundos || 0)))), 0);

            // Crear sesión de práctica
            const practiceSession = await prisma.practiceSession.create(stryMutAct_9fa48("9383") ? {} : (stryCov_9fa48("9383"), {
              data: stryMutAct_9fa48("9384") ? {} : (stryCov_9fa48("9384"), {
                studentId: dbUser.student.id,
                topicId,
                totalPreguntas,
                correctas,
                incorrectas,
                omitidas,
                porcentaje,
                duracionSegundos,
                finishedAt: new Date(),
                answers: stryMutAct_9fa48("9385") ? {} : (stryCov_9fa48("9385"), {
                  create: practiceAnswers
                })
              }),
              include: stryMutAct_9fa48("9386") ? {} : (stryCov_9fa48("9386"), {
                topic: stryMutAct_9fa48("9387") ? {} : (stryCov_9fa48("9387"), {
                  select: stryMutAct_9fa48("9388") ? {} : (stryCov_9fa48("9388"), {
                    nombre: stryMutAct_9fa48("9389") ? false : (stryCov_9fa48("9389"), true),
                    ejeTematico: stryMutAct_9fa48("9390") ? false : (stryCov_9fa48("9390"), true)
                  })
                })
              })
            }));

            // Actualizar métricas de rendimiento
            await updatePerformanceMetrics(dbUser.student.id, topicId, correctas, totalPreguntas);
            return NextResponse.json(stryMutAct_9fa48("9391") ? {} : (stryCov_9fa48("9391"), {
              session: practiceSession
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9392")) {
            {}
          } else {
            stryCov_9fa48("9392");
            logger.error(stryMutAct_9fa48("9393") ? {} : (stryCov_9fa48("9393"), {
              type: stryMutAct_9fa48("9394") ? "" : (stryCov_9fa48("9394"), 'practice_session_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("9395") ? "" : (stryCov_9fa48("9395"), 'Error al crear sesión de práctica'));
            return NextResponse.json(stryMutAct_9fa48("9396") ? {} : (stryCov_9fa48("9396"), {
              error: stryMutAct_9fa48("9397") ? "" : (stryCov_9fa48("9397"), 'Error al guardar sesión de práctica')
            }), stryMutAct_9fa48("9398") ? {} : (stryCov_9fa48("9398"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
async function updatePerformanceMetrics(studentId: string, topicId: string, correctas: number, totalPreguntas: number) {
  if (stryMutAct_9fa48("9399")) {
    {}
  } else {
    stryCov_9fa48("9399");
    try {
      if (stryMutAct_9fa48("9400")) {
        {}
      } else {
        stryCov_9fa48("9400");
        const existingMetric = await prisma.performanceMetric.findUnique(stryMutAct_9fa48("9401") ? {} : (stryCov_9fa48("9401"), {
          where: stryMutAct_9fa48("9402") ? {} : (stryCov_9fa48("9402"), {
            studentId_topicId: stryMutAct_9fa48("9403") ? {} : (stryCov_9fa48("9403"), {
              studentId,
              topicId
            })
          })
        }));
        const newCorrectas = stryMutAct_9fa48("9404") ? (existingMetric?.correctas || 0) - correctas : (stryCov_9fa48("9404"), (stryMutAct_9fa48("9407") ? existingMetric?.correctas && 0 : stryMutAct_9fa48("9406") ? false : stryMutAct_9fa48("9405") ? true : (stryCov_9fa48("9405", "9406", "9407"), (stryMutAct_9fa48("9408") ? existingMetric.correctas : (stryCov_9fa48("9408"), existingMetric?.correctas)) || 0)) + correctas);
        const newTotal = stryMutAct_9fa48("9409") ? (existingMetric?.totalPreguntas || 0) - totalPreguntas : (stryCov_9fa48("9409"), (stryMutAct_9fa48("9412") ? existingMetric?.totalPreguntas && 0 : stryMutAct_9fa48("9411") ? false : stryMutAct_9fa48("9410") ? true : (stryCov_9fa48("9410", "9411", "9412"), (stryMutAct_9fa48("9413") ? existingMetric.totalPreguntas : (stryCov_9fa48("9413"), existingMetric?.totalPreguntas)) || 0)) + totalPreguntas);
        const newPorcentaje = stryMutAct_9fa48("9414") ? newCorrectas / newTotal / 100 : (stryCov_9fa48("9414"), (stryMutAct_9fa48("9415") ? newCorrectas * newTotal : (stryCov_9fa48("9415"), newCorrectas / newTotal)) * 100);
        if (stryMutAct_9fa48("9417") ? false : stryMutAct_9fa48("9416") ? true : (stryCov_9fa48("9416", "9417"), existingMetric)) {
          if (stryMutAct_9fa48("9418")) {
            {}
          } else {
            stryCov_9fa48("9418");
            await prisma.performanceMetric.update(stryMutAct_9fa48("9419") ? {} : (stryCov_9fa48("9419"), {
              where: stryMutAct_9fa48("9420") ? {} : (stryCov_9fa48("9420"), {
                id: existingMetric.id
              }),
              data: stryMutAct_9fa48("9421") ? {} : (stryCov_9fa48("9421"), {
                totalPreguntas: newTotal,
                correctas: newCorrectas,
                porcentaje: newPorcentaje,
                nivel: getNivel(newPorcentaje),
                tendencia: calculateTendency(existingMetric.porcentaje, newPorcentaje)
              })
            }));
          }
        } else {
          if (stryMutAct_9fa48("9422")) {
            {}
          } else {
            stryCov_9fa48("9422");
            await prisma.performanceMetric.create(stryMutAct_9fa48("9423") ? {} : (stryCov_9fa48("9423"), {
              data: stryMutAct_9fa48("9424") ? {} : (stryCov_9fa48("9424"), {
                studentId,
                topicId,
                totalPreguntas: newTotal,
                correctas: newCorrectas,
                porcentaje: newPorcentaje,
                nivel: getNivel(newPorcentaje)
              })
            }));
          }
        }
      }
    } catch (error) {
      if (stryMutAct_9fa48("9425")) {
        {}
      } else {
        stryCov_9fa48("9425");
        logger.error(stryMutAct_9fa48("9426") ? {} : (stryCov_9fa48("9426"), {
          type: stryMutAct_9fa48("9427") ? "" : (stryCov_9fa48("9427"), 'update_metrics_error'),
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }), stryMutAct_9fa48("9428") ? "" : (stryCov_9fa48("9428"), 'Error al actualizar métricas'));
        // No fallar la creación de la sesión si falla la actualización de métricas
      }
    }
  }
}
function getNivel(porcentaje: number): string {
  if (stryMutAct_9fa48("9429")) {
    {}
  } else {
    stryCov_9fa48("9429");
    if (stryMutAct_9fa48("9433") ? porcentaje < 80 : stryMutAct_9fa48("9432") ? porcentaje > 80 : stryMutAct_9fa48("9431") ? false : stryMutAct_9fa48("9430") ? true : (stryCov_9fa48("9430", "9431", "9432", "9433"), porcentaje >= 80)) return stryMutAct_9fa48("9434") ? "" : (stryCov_9fa48("9434"), 'avanzado');
    if (stryMutAct_9fa48("9438") ? porcentaje < 60 : stryMutAct_9fa48("9437") ? porcentaje > 60 : stryMutAct_9fa48("9436") ? false : stryMutAct_9fa48("9435") ? true : (stryCov_9fa48("9435", "9436", "9437", "9438"), porcentaje >= 60)) return stryMutAct_9fa48("9439") ? "" : (stryCov_9fa48("9439"), 'intermedio');
    return stryMutAct_9fa48("9440") ? "" : (stryCov_9fa48("9440"), 'básico');
  }
}
function calculateTendency(oldPorcentaje: number, newPorcentaje: number): string {
  if (stryMutAct_9fa48("9441")) {
    {}
  } else {
    stryCov_9fa48("9441");
    const diff = stryMutAct_9fa48("9442") ? newPorcentaje + oldPorcentaje : (stryCov_9fa48("9442"), newPorcentaje - oldPorcentaje);
    if (stryMutAct_9fa48("9446") ? diff <= 5 : stryMutAct_9fa48("9445") ? diff >= 5 : stryMutAct_9fa48("9444") ? false : stryMutAct_9fa48("9443") ? true : (stryCov_9fa48("9443", "9444", "9445", "9446"), diff > 5)) return stryMutAct_9fa48("9447") ? "" : (stryCov_9fa48("9447"), 'mejorando');
    if (stryMutAct_9fa48("9451") ? diff >= -5 : stryMutAct_9fa48("9450") ? diff <= -5 : stryMutAct_9fa48("9449") ? false : stryMutAct_9fa48("9448") ? true : (stryCov_9fa48("9448", "9449", "9450", "9451"), diff < (stryMutAct_9fa48("9452") ? +5 : (stryCov_9fa48("9452"), -5)))) return stryMutAct_9fa48("9453") ? "" : (stryCov_9fa48("9453"), 'empeorando');
    return stryMutAct_9fa48("9454") ? "" : (stryCov_9fa48("9454"), 'estable');
  }
}