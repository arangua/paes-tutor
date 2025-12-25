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
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("9515") ? "" : (stryCov_9fa48("9515"), 'nodejs');
const quickReviewQuerySchema = z.object(stryMutAct_9fa48("9516") ? {} : (stryCov_9fa48("9516"), {
  limit: z.string().optional().transform(stryMutAct_9fa48("9517") ? () => undefined : (stryCov_9fa48("9517"), val => val ? parseInt(val, 10) : undefined)).pipe(stryMutAct_9fa48("9519") ? z.number().int().max(1).max(50).optional() : stryMutAct_9fa48("9518") ? z.number().int().min(1).min(50).optional() : (stryCov_9fa48("9518", "9519"), z.number().int().min(1).max(50).optional()))
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("9520")) {
    {}
  } else {
    stryCov_9fa48("9520");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9521")) {
        {}
      } else {
        stryCov_9fa48("9521");
        try {
          if (stryMutAct_9fa48("9522")) {
            {}
          } else {
            stryCov_9fa48("9522");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9525") ? false : stryMutAct_9fa48("9524") ? true : stryMutAct_9fa48("9523") ? dbUser?.email : (stryCov_9fa48("9523", "9524", "9525"), !(stryMutAct_9fa48("9526") ? dbUser.email : (stryCov_9fa48("9526"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9527")) {
                {}
              } else {
                stryCov_9fa48("9527");
                return NextResponse.json(stryMutAct_9fa48("9528") ? {} : (stryCov_9fa48("9528"), {
                  error: stryMutAct_9fa48("9529") ? "" : (stryCov_9fa48("9529"), 'No autorizado')
                }), stryMutAct_9fa48("9530") ? {} : (stryCov_9fa48("9530"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9533") ? false : stryMutAct_9fa48("9532") ? true : stryMutAct_9fa48("9531") ? dbUser.student : (stryCov_9fa48("9531", "9532", "9533"), !dbUser.student)) {
              if (stryMutAct_9fa48("9534")) {
                {}
              } else {
                stryCov_9fa48("9534");
                return NextResponse.json(stryMutAct_9fa48("9535") ? {} : (stryCov_9fa48("9535"), {
                  error: stryMutAct_9fa48("9536") ? "" : (stryCov_9fa48("9536"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9537") ? {} : (stryCov_9fa48("9537"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const validation = quickReviewQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("9540") ? false : stryMutAct_9fa48("9539") ? true : stryMutAct_9fa48("9538") ? validation.success : (stryCov_9fa48("9538", "9539", "9540"), !validation.success)) {
              if (stryMutAct_9fa48("9541")) {
                {}
              } else {
                stryCov_9fa48("9541");
                return NextResponse.json(stryMutAct_9fa48("9542") ? {} : (stryCov_9fa48("9542"), {
                  error: stryMutAct_9fa48("9543") ? "" : (stryCov_9fa48("9543"), 'Parámetros de consulta inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("9544") ? {} : (stryCov_9fa48("9544"), {
                  status: 400
                }));
              }
            }
            const validLimit = stryMutAct_9fa48("9547") ? validation.data.limit && 10 : stryMutAct_9fa48("9546") ? false : stryMutAct_9fa48("9545") ? true : (stryCov_9fa48("9545", "9546", "9547"), validation.data.limit || 10); // Por defecto 10 preguntas

            // Obtener preguntas que el estudiante ha fallado anteriormente
            const incorrectAnswers = await prisma.attemptAnswer.findMany(stryMutAct_9fa48("9548") ? {} : (stryCov_9fa48("9548"), {
              where: stryMutAct_9fa48("9549") ? {} : (stryCov_9fa48("9549"), {
                attempt: stryMutAct_9fa48("9550") ? {} : (stryCov_9fa48("9550"), {
                  studentId: dbUser.student.id,
                  estado: stryMutAct_9fa48("9551") ? "" : (stryCov_9fa48("9551"), 'completado')
                }),
                esCorrecta: stryMutAct_9fa48("9552") ? true : (stryCov_9fa48("9552"), false),
                omitida: stryMutAct_9fa48("9553") ? true : (stryCov_9fa48("9553"), false)
              }),
              include: stryMutAct_9fa48("9554") ? {} : (stryCov_9fa48("9554"), {
                question: stryMutAct_9fa48("9555") ? {} : (stryCov_9fa48("9555"), {
                  include: stryMutAct_9fa48("9556") ? {} : (stryCov_9fa48("9556"), {
                    options: stryMutAct_9fa48("9557") ? {} : (stryCov_9fa48("9557"), {
                      orderBy: stryMutAct_9fa48("9558") ? {} : (stryCov_9fa48("9558"), {
                        letra: stryMutAct_9fa48("9559") ? "" : (stryCov_9fa48("9559"), 'asc')
                      })
                    }),
                    subject: stryMutAct_9fa48("9560") ? {} : (stryCov_9fa48("9560"), {
                      select: stryMutAct_9fa48("9561") ? {} : (stryCov_9fa48("9561"), {
                        nombre: stryMutAct_9fa48("9562") ? false : (stryCov_9fa48("9562"), true),
                        codigo: stryMutAct_9fa48("9563") ? false : (stryCov_9fa48("9563"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("9564") ? {} : (stryCov_9fa48("9564"), {
                      select: stryMutAct_9fa48("9565") ? {} : (stryCov_9fa48("9565"), {
                        nombre: stryMutAct_9fa48("9566") ? false : (stryCov_9fa48("9566"), true),
                        ejeTematico: stryMutAct_9fa48("9567") ? false : (stryCov_9fa48("9567"), true)
                      })
                    })
                  })
                }),
                attempt: stryMutAct_9fa48("9568") ? {} : (stryCov_9fa48("9568"), {
                  select: stryMutAct_9fa48("9569") ? {} : (stryCov_9fa48("9569"), {
                    startedAt: stryMutAct_9fa48("9570") ? false : (stryCov_9fa48("9570"), true)
                  })
                })
              }),
              take: stryMutAct_9fa48("9571") ? validLimit / 3 : (stryCov_9fa48("9571"), validLimit * 3) // Obtener más para luego aleatorizar y evitar duplicados
            }));

            // Agrupar por pregunta y contar veces fallada
            const questionMap = new Map<string, {
              question: (typeof incorrectAnswers)[0]['question'];
              timesFailed: number;
              lastFailed: Date;
            }>();

            // Ordenar por fecha de intento (más recientes primero)
            const sortedAnswers = stryMutAct_9fa48("9572") ? [...incorrectAnswers] : (stryCov_9fa48("9572"), (stryMutAct_9fa48("9573") ? [] : (stryCov_9fa48("9573"), [...incorrectAnswers])).sort(stryMutAct_9fa48("9574") ? () => undefined : (stryCov_9fa48("9574"), (a, b) => stryMutAct_9fa48("9575") ? b.attempt.startedAt.getTime() + a.attempt.startedAt.getTime() : (stryCov_9fa48("9575"), b.attempt.startedAt.getTime() - a.attempt.startedAt.getTime()))));
            sortedAnswers.forEach(answer => {
              if (stryMutAct_9fa48("9576")) {
                {}
              } else {
                stryCov_9fa48("9576");
                const questionId = answer.question.id;
                if (stryMutAct_9fa48("9579") ? false : stryMutAct_9fa48("9578") ? true : stryMutAct_9fa48("9577") ? questionMap.has(questionId) : (stryCov_9fa48("9577", "9578", "9579"), !questionMap.has(questionId))) {
                  if (stryMutAct_9fa48("9580")) {
                    {}
                  } else {
                    stryCov_9fa48("9580");
                    questionMap.set(questionId, stryMutAct_9fa48("9581") ? {} : (stryCov_9fa48("9581"), {
                      question: answer.question,
                      timesFailed: 0,
                      lastFailed: answer.attempt.startedAt
                    }));
                  }
                }
                const data = questionMap.get(questionId)!;
                stryMutAct_9fa48("9582") ? data.timesFailed-- : (stryCov_9fa48("9582"), data.timesFailed++);
                if (stryMutAct_9fa48("9586") ? answer.attempt.startedAt <= data.lastFailed : stryMutAct_9fa48("9585") ? answer.attempt.startedAt >= data.lastFailed : stryMutAct_9fa48("9584") ? false : stryMutAct_9fa48("9583") ? true : (stryCov_9fa48("9583", "9584", "9585", "9586"), answer.attempt.startedAt > data.lastFailed)) {
                  if (stryMutAct_9fa48("9587")) {
                    {}
                  } else {
                    stryCov_9fa48("9587");
                    data.lastFailed = answer.attempt.startedAt;
                  }
                }
              }
            });

            // Convertir a array, ordenar por veces fallada y fecha, luego aleatorizar
            const questionsArray = stryMutAct_9fa48("9590") ? Array.from(questionMap.values()).slice(0, validLimit) // Tomar solo el límite solicitado
            .sort(() => Math.random() - 0.5) : stryMutAct_9fa48("9589") ? Array.from(questionMap.values()).sort((a, b) => {
              // Priorizar preguntas falladas más veces
              if (b.timesFailed !== a.timesFailed) {
                return b.timesFailed - a.timesFailed;
              }
              // Si tienen el mismo número de fallos, priorizar las más recientes
              return b.lastFailed.getTime() - a.lastFailed.getTime();
            })
            // Tomar solo el límite solicitado
            .sort(() => Math.random() - 0.5) : stryMutAct_9fa48("9588") ? Array.from(questionMap.values()).sort((a, b) => {
              // Priorizar preguntas falladas más veces
              if (b.timesFailed !== a.timesFailed) {
                return b.timesFailed - a.timesFailed;
              }
              // Si tienen el mismo número de fallos, priorizar las más recientes
              return b.lastFailed.getTime() - a.lastFailed.getTime();
            }).slice(0, validLimit) // Tomar solo el límite solicitado
            : (stryCov_9fa48("9588", "9589", "9590"), Array.from(questionMap.values()).sort((a, b) => {
              if (stryMutAct_9fa48("9591")) {
                {}
              } else {
                stryCov_9fa48("9591");
                // Priorizar preguntas falladas más veces
                if (stryMutAct_9fa48("9594") ? b.timesFailed === a.timesFailed : stryMutAct_9fa48("9593") ? false : stryMutAct_9fa48("9592") ? true : (stryCov_9fa48("9592", "9593", "9594"), b.timesFailed !== a.timesFailed)) {
                  if (stryMutAct_9fa48("9595")) {
                    {}
                  } else {
                    stryCov_9fa48("9595");
                    return stryMutAct_9fa48("9596") ? b.timesFailed + a.timesFailed : (stryCov_9fa48("9596"), b.timesFailed - a.timesFailed);
                  }
                }
                // Si tienen el mismo número de fallos, priorizar las más recientes
                return stryMutAct_9fa48("9597") ? b.lastFailed.getTime() + a.lastFailed.getTime() : (stryCov_9fa48("9597"), b.lastFailed.getTime() - a.lastFailed.getTime());
              }
            }).slice(0, validLimit) // Tomar solo el límite solicitado
            .sort(stryMutAct_9fa48("9598") ? () => undefined : (stryCov_9fa48("9598"), () => stryMutAct_9fa48("9599") ? Math.random() + 0.5 : (stryCov_9fa48("9599"), Math.random() - 0.5)))); // Aleatorizar el orden final

            const questions = questionsArray.map(stryMutAct_9fa48("9600") ? () => undefined : (stryCov_9fa48("9600"), item => item.question));
            return NextResponse.json(stryMutAct_9fa48("9601") ? {} : (stryCov_9fa48("9601"), {
              questions,
              totalFailed: questionMap.size,
              selected: questions.length
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9602")) {
            {}
          } else {
            stryCov_9fa48("9602");
            logger.error(stryMutAct_9fa48("9603") ? {} : (stryCov_9fa48("9603"), {
              type: stryMutAct_9fa48("9604") ? "" : (stryCov_9fa48("9604"), 'quick_review_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("9605") ? "" : (stryCov_9fa48("9605"), 'Error al obtener preguntas para repaso rápido'));
            return NextResponse.json(stryMutAct_9fa48("9606") ? {} : (stryCov_9fa48("9606"), {
              error: stryMutAct_9fa48("9607") ? "" : (stryCov_9fa48("9607"), 'Error al obtener preguntas para repaso rápido')
            }), stryMutAct_9fa48("9608") ? {} : (stryCov_9fa48("9608"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}