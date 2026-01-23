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
import { getCurrentUser } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logger } from '@/lib/logger';
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("9226") ? "" : (stryCov_9fa48("9226"), 'nodejs');
const questionsQuerySchema = z.object(stryMutAct_9fa48("9227") ? {} : (stryCov_9fa48("9227"), {
  topicId: stryMutAct_9fa48("9228") ? z.string().max(1) : (stryCov_9fa48("9228"), z.string().min(1)),
  limit: z.string().optional().transform(stryMutAct_9fa48("9229") ? () => undefined : (stryCov_9fa48("9229"), val => val ? parseInt(val, 10) : undefined))
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("9230")) {
    {}
  } else {
    stryCov_9fa48("9230");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9231")) {
        {}
      } else {
        stryCov_9fa48("9231");
        try {
          if (stryMutAct_9fa48("9232")) {
            {}
          } else {
            stryCov_9fa48("9232");
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("9235") ? false : stryMutAct_9fa48("9234") ? true : stryMutAct_9fa48("9233") ? user?.email : (stryCov_9fa48("9233", "9234", "9235"), !(stryMutAct_9fa48("9236") ? user.email : (stryCov_9fa48("9236"), user?.email)))) {
              if (stryMutAct_9fa48("9237")) {
                {}
              } else {
                stryCov_9fa48("9237");
                return NextResponse.json(stryMutAct_9fa48("9238") ? {} : (stryCov_9fa48("9238"), {
                  error: stryMutAct_9fa48("9239") ? "" : (stryCov_9fa48("9239"), 'No autorizado')
                }), stryMutAct_9fa48("9240") ? {} : (stryCov_9fa48("9240"), {
                  status: 401
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const topicId = searchParams.get(stryMutAct_9fa48("9241") ? "" : (stryCov_9fa48("9241"), 'topicId'));
            const limit = searchParams.get(stryMutAct_9fa48("9242") ? "" : (stryCov_9fa48("9242"), 'limit'));

            // Validar parámetros
            const validation = questionsQuerySchema.safeParse(stryMutAct_9fa48("9243") ? {} : (stryCov_9fa48("9243"), {
              topicId,
              limit
            }));
            if (stryMutAct_9fa48("9246") ? false : stryMutAct_9fa48("9245") ? true : stryMutAct_9fa48("9244") ? validation.success : (stryCov_9fa48("9244", "9245", "9246"), !validation.success)) {
              if (stryMutAct_9fa48("9247")) {
                {}
              } else {
                stryCov_9fa48("9247");
                return NextResponse.json(stryMutAct_9fa48("9248") ? {} : (stryCov_9fa48("9248"), {
                  error: stryMutAct_9fa48("9249") ? "" : (stryCov_9fa48("9249"), 'Parámetros inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("9250") ? {} : (stryCov_9fa48("9250"), {
                  status: 400
                }));
              }
            }
            const {
              topicId: validTopicId,
              limit: validLimit
            } = validation.data;

            // Verificar que el tema existe
            const topic = await prisma.topic.findUnique(stryMutAct_9fa48("9251") ? {} : (stryCov_9fa48("9251"), {
              where: stryMutAct_9fa48("9252") ? {} : (stryCov_9fa48("9252"), {
                id: validTopicId
              }),
              select: stryMutAct_9fa48("9253") ? {} : (stryCov_9fa48("9253"), {
                id: stryMutAct_9fa48("9254") ? false : (stryCov_9fa48("9254"), true),
                nombre: stryMutAct_9fa48("9255") ? false : (stryCov_9fa48("9255"), true),
                subjectId: stryMutAct_9fa48("9256") ? false : (stryCov_9fa48("9256"), true)
              })
            }));
            if (stryMutAct_9fa48("9259") ? false : stryMutAct_9fa48("9258") ? true : stryMutAct_9fa48("9257") ? topic : (stryCov_9fa48("9257", "9258", "9259"), !topic)) {
              if (stryMutAct_9fa48("9260")) {
                {}
              } else {
                stryCov_9fa48("9260");
                return NextResponse.json(stryMutAct_9fa48("9261") ? {} : (stryCov_9fa48("9261"), {
                  error: stryMutAct_9fa48("9262") ? "" : (stryCov_9fa48("9262"), 'Tema no encontrado')
                }), stryMutAct_9fa48("9263") ? {} : (stryCov_9fa48("9263"), {
                  status: 404
                }));
              }
            }

            // Obtener preguntas del tema (aleatorias)
            const questions = await prisma.question.findMany(stryMutAct_9fa48("9264") ? {} : (stryCov_9fa48("9264"), {
              where: stryMutAct_9fa48("9265") ? {} : (stryCov_9fa48("9265"), {
                topicId: validTopicId
              }),
              include: stryMutAct_9fa48("9266") ? {} : (stryCov_9fa48("9266"), {
                options: stryMutAct_9fa48("9267") ? {} : (stryCov_9fa48("9267"), {
                  orderBy: stryMutAct_9fa48("9268") ? {} : (stryCov_9fa48("9268"), {
                    letra: stryMutAct_9fa48("9269") ? "" : (stryCov_9fa48("9269"), 'asc')
                  })
                }),
                subject: stryMutAct_9fa48("9270") ? {} : (stryCov_9fa48("9270"), {
                  select: stryMutAct_9fa48("9271") ? {} : (stryCov_9fa48("9271"), {
                    nombre: stryMutAct_9fa48("9272") ? false : (stryCov_9fa48("9272"), true),
                    codigo: stryMutAct_9fa48("9273") ? false : (stryCov_9fa48("9273"), true)
                  })
                }),
                topic: stryMutAct_9fa48("9274") ? {} : (stryCov_9fa48("9274"), {
                  select: stryMutAct_9fa48("9275") ? {} : (stryCov_9fa48("9275"), {
                    nombre: stryMutAct_9fa48("9276") ? false : (stryCov_9fa48("9276"), true),
                    ejeTematico: stryMutAct_9fa48("9277") ? false : (stryCov_9fa48("9277"), true)
                  })
                })
              }),
              take: stryMutAct_9fa48("9280") ? validLimit && 20 : stryMutAct_9fa48("9279") ? false : stryMutAct_9fa48("9278") ? true : (stryCov_9fa48("9278", "9279", "9280"), validLimit || 20),
              // Por defecto 20 preguntas
              orderBy: stryMutAct_9fa48("9281") ? {} : (stryCov_9fa48("9281"), {
                createdAt: stryMutAct_9fa48("9282") ? "" : (stryCov_9fa48("9282"), 'desc') // Más recientes primero, luego se aleatorizan en el cliente si es necesario
              })
            }));

            // Aleatorizar el orden de las preguntas
            const shuffledQuestions = stryMutAct_9fa48("9283") ? questions : (stryCov_9fa48("9283"), questions.sort(stryMutAct_9fa48("9284") ? () => undefined : (stryCov_9fa48("9284"), () => stryMutAct_9fa48("9285") ? Math.random() + 0.5 : (stryCov_9fa48("9285"), Math.random() - 0.5))));
            return NextResponse.json(stryMutAct_9fa48("9286") ? {} : (stryCov_9fa48("9286"), {
              questions: shuffledQuestions,
              topic: stryMutAct_9fa48("9287") ? {} : (stryCov_9fa48("9287"), {
                id: topic.id,
                nombre: topic.nombre
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9288")) {
            {}
          } else {
            stryCov_9fa48("9288");
            logger.error(stryMutAct_9fa48("9289") ? {} : (stryCov_9fa48("9289"), {
              type: stryMutAct_9fa48("9290") ? "" : (stryCov_9fa48("9290"), 'practice_questions_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("9291") ? "" : (stryCov_9fa48("9291"), 'Error al obtener preguntas de práctica'));
            return NextResponse.json(stryMutAct_9fa48("9292") ? {} : (stryCov_9fa48("9292"), {
              error: stryMutAct_9fa48("9293") ? "" : (stryCov_9fa48("9293"), 'Error al obtener preguntas de práctica')
            }), stryMutAct_9fa48("9294") ? {} : (stryCov_9fa48("9294"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}