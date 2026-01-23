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
import { getCurrentUser } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { prisma } from '@/lib/prisma';
import { generateExamWithAI, type ExamGenerationParams } from '@/lib/exam-generator';
import { z } from 'zod';
import { validateBody } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';
import { isAdmin } from '@/lib/check-admin';
export const runtime = stryMutAct_9fa48("2929") ? "" : (stryCov_9fa48("2929"), 'nodejs');
const generateExamSchema = z.object(stryMutAct_9fa48("2930") ? {} : (stryCov_9fa48("2930"), {
  subjectId: stryMutAct_9fa48("2931") ? z.string().max(1, 'La asignatura es requerida') : (stryCov_9fa48("2931"), z.string().min(1, stryMutAct_9fa48("2932") ? "" : (stryCov_9fa48("2932"), 'La asignatura es requerida'))),
  topicIds: z.array(z.string()).optional(),
  numQuestions: stryMutAct_9fa48("2934") ? z.number().max(5).max(80, 'El número de preguntas debe estar entre 5 y 80') : stryMutAct_9fa48("2933") ? z.number().min(5).min(80, 'El número de preguntas debe estar entre 5 y 80') : (stryCov_9fa48("2933", "2934"), z.number().min(5).max(80, stryMutAct_9fa48("2935") ? "" : (stryCov_9fa48("2935"), 'El número de preguntas debe estar entre 5 y 80'))),
  difficulty: z.enum(stryMutAct_9fa48("2936") ? [] : (stryCov_9fa48("2936"), [stryMutAct_9fa48("2937") ? "" : (stryCov_9fa48("2937"), 'baja'), stryMutAct_9fa48("2938") ? "" : (stryCov_9fa48("2938"), 'media'), stryMutAct_9fa48("2939") ? "" : (stryCov_9fa48("2939"), 'alta'), stryMutAct_9fa48("2940") ? "" : (stryCov_9fa48("2940"), 'mixta')])).optional().default(stryMutAct_9fa48("2941") ? "" : (stryCov_9fa48("2941"), 'mixta')),
  tipo: z.enum(stryMutAct_9fa48("2942") ? [] : (stryCov_9fa48("2942"), [stryMutAct_9fa48("2943") ? "" : (stryCov_9fa48("2943"), 'objetiva'), stryMutAct_9fa48("2944") ? "" : (stryCov_9fa48("2944"), 'desarrollo'), stryMutAct_9fa48("2945") ? "" : (stryCov_9fa48("2945"), 'mixta')])).optional().default(stryMutAct_9fa48("2946") ? "" : (stryCov_9fa48("2946"), 'objetiva')),
  includeAnswerKey: z.boolean().optional().default(stryMutAct_9fa48("2947") ? false : (stryCov_9fa48("2947"), true)),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  tiempoLimiteMin: z.number().optional(),
  fuente: z.string().optional()
}));
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("2948")) {
    {}
  } else {
    stryCov_9fa48("2948");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("2949")) {
        {}
      } else {
        stryCov_9fa48("2949");
        try {
          if (stryMutAct_9fa48("2950")) {
            {}
          } else {
            stryCov_9fa48("2950");
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("2953") ? false : stryMutAct_9fa48("2952") ? true : stryMutAct_9fa48("2951") ? user : (stryCov_9fa48("2951", "2952", "2953"), !user)) {
              if (stryMutAct_9fa48("2954")) {
                {}
              } else {
                stryCov_9fa48("2954");
                return NextResponse.json(stryMutAct_9fa48("2955") ? {} : (stryCov_9fa48("2955"), {
                  error: stryMutAct_9fa48("2956") ? "" : (stryCov_9fa48("2956"), 'No autorizado')
                }), stryMutAct_9fa48("2957") ? {} : (stryCov_9fa48("2957"), {
                  status: 401
                }));
              }
            }

            // Verificar que el usuario sea admin
            const userIsAdmin = await isAdmin();
            if (stryMutAct_9fa48("2960") ? false : stryMutAct_9fa48("2959") ? true : stryMutAct_9fa48("2958") ? userIsAdmin : (stryCov_9fa48("2958", "2959", "2960"), !userIsAdmin)) {
              if (stryMutAct_9fa48("2961")) {
                {}
              } else {
                stryCov_9fa48("2961");
                logger.warn(stryMutAct_9fa48("2962") ? {} : (stryCov_9fa48("2962"), {
                  userId: user.id,
                  email: user.email
                }), stryMutAct_9fa48("2963") ? "" : (stryCov_9fa48("2963"), 'Intento de generar examen sin permisos de admin'));
                return NextResponse.json(stryMutAct_9fa48("2964") ? {} : (stryCov_9fa48("2964"), {
                  error: stryMutAct_9fa48("2965") ? "" : (stryCov_9fa48("2965"), 'No tienes permisos para generar exámenes. Se requieren permisos de administrador.')
                }), stryMutAct_9fa48("2966") ? {} : (stryCov_9fa48("2966"), {
                  status: 403
                }));
              }
            }
            const validation = await validateBody(request, generateExamSchema);
            if (stryMutAct_9fa48("2969") ? false : stryMutAct_9fa48("2968") ? true : stryMutAct_9fa48("2967") ? validation.success : (stryCov_9fa48("2967", "2968", "2969"), !validation.success)) {
              if (stryMutAct_9fa48("2970")) {
                {}
              } else {
                stryCov_9fa48("2970");
                return validation.error;
              }
            }
            const {
              subjectId,
              topicIds,
              numQuestions,
              difficulty,
              tipo,
              includeAnswerKey,
              titulo,
              descripcion,
              tiempoLimiteMin,
              fuente
            } = validation.data;

            // Verificar que la asignatura existe
            const subject = await prisma.subject.findUnique(stryMutAct_9fa48("2971") ? {} : (stryCov_9fa48("2971"), {
              where: stryMutAct_9fa48("2972") ? {} : (stryCov_9fa48("2972"), {
                id: subjectId
              })
            }));
            if (stryMutAct_9fa48("2975") ? false : stryMutAct_9fa48("2974") ? true : stryMutAct_9fa48("2973") ? subject : (stryCov_9fa48("2973", "2974", "2975"), !subject)) {
              if (stryMutAct_9fa48("2976")) {
                {}
              } else {
                stryCov_9fa48("2976");
                return NextResponse.json(stryMutAct_9fa48("2977") ? {} : (stryCov_9fa48("2977"), {
                  error: stryMutAct_9fa48("2978") ? "" : (stryCov_9fa48("2978"), 'Asignatura no encontrada')
                }), stryMutAct_9fa48("2979") ? {} : (stryCov_9fa48("2979"), {
                  status: 404
                }));
              }
            }

            // Verificar que hay temas disponibles
            const topicsCount = await prisma.topic.count(stryMutAct_9fa48("2980") ? {} : (stryCov_9fa48("2980"), {
              where: stryMutAct_9fa48("2981") ? {} : (stryCov_9fa48("2981"), {
                subjectId,
                ...((stryMutAct_9fa48("2984") ? topicIds && Array.isArray(topicIds) || topicIds.length > 0 : stryMutAct_9fa48("2983") ? false : stryMutAct_9fa48("2982") ? true : (stryCov_9fa48("2982", "2983", "2984"), (stryMutAct_9fa48("2986") ? topicIds || Array.isArray(topicIds) : stryMutAct_9fa48("2985") ? true : (stryCov_9fa48("2985", "2986"), topicIds && Array.isArray(topicIds))) && (stryMutAct_9fa48("2989") ? topicIds.length <= 0 : stryMutAct_9fa48("2988") ? topicIds.length >= 0 : stryMutAct_9fa48("2987") ? true : (stryCov_9fa48("2987", "2988", "2989"), topicIds.length > 0)))) ? stryMutAct_9fa48("2990") ? {} : (stryCov_9fa48("2990"), {
                  id: stryMutAct_9fa48("2991") ? {} : (stryCov_9fa48("2991"), {
                    in: topicIds
                  })
                }) : {})
              })
            }));
            if (stryMutAct_9fa48("2994") ? topicsCount !== 0 : stryMutAct_9fa48("2993") ? false : stryMutAct_9fa48("2992") ? true : (stryCov_9fa48("2992", "2993", "2994"), topicsCount === 0)) {
              if (stryMutAct_9fa48("2995")) {
                {}
              } else {
                stryCov_9fa48("2995");
                return NextResponse.json(stryMutAct_9fa48("2996") ? {} : (stryCov_9fa48("2996"), {
                  error: stryMutAct_9fa48("2997") ? "" : (stryCov_9fa48("2997"), 'No se encontraron temas para la asignatura seleccionada')
                }), stryMutAct_9fa48("2998") ? {} : (stryCov_9fa48("2998"), {
                  status: 404
                }));
              }
            }

            // Generar examen con IA
            const generatedExam = await generateExamWithAI(stryMutAct_9fa48("2999") ? {} : (stryCov_9fa48("2999"), {
              subjectId,
              topicIds,
              numQuestions,
              difficulty,
              tipo,
              userId: user.id,
              includeAnswerKey
            }));

            // Guardar examen en la base de datos
            const exam = await prisma.$transaction(async tx => {
              if (stryMutAct_9fa48("3000")) {
                {}
              } else {
                stryCov_9fa48("3000");
                // Crear examen
                const newExam = await tx.exam.create(stryMutAct_9fa48("3001") ? {} : (stryCov_9fa48("3001"), {
                  data: stryMutAct_9fa48("3002") ? {} : (stryCov_9fa48("3002"), {
                    subjectId,
                    titulo: stryMutAct_9fa48("3005") ? titulo && generatedExam.titulo : stryMutAct_9fa48("3004") ? false : stryMutAct_9fa48("3003") ? true : (stryCov_9fa48("3003", "3004", "3005"), titulo || generatedExam.titulo),
                    descripcion: stryMutAct_9fa48("3008") ? descripcion && generatedExam.descripcion : stryMutAct_9fa48("3007") ? false : stryMutAct_9fa48("3006") ? true : (stryCov_9fa48("3006", "3007", "3008"), descripcion || generatedExam.descripcion),
                    tipo: (stryMutAct_9fa48("3011") ? tipo !== 'objetiva' : stryMutAct_9fa48("3010") ? false : stryMutAct_9fa48("3009") ? true : (stryCov_9fa48("3009", "3010", "3011"), tipo === (stryMutAct_9fa48("3012") ? "" : (stryCov_9fa48("3012"), 'objetiva')))) ? stryMutAct_9fa48("3013") ? "" : (stryCov_9fa48("3013"), 'objetiva') : (stryMutAct_9fa48("3016") ? tipo !== 'desarrollo' : stryMutAct_9fa48("3015") ? false : stryMutAct_9fa48("3014") ? true : (stryCov_9fa48("3014", "3015", "3016"), tipo === (stryMutAct_9fa48("3017") ? "" : (stryCov_9fa48("3017"), 'desarrollo')))) ? stryMutAct_9fa48("3018") ? "" : (stryCov_9fa48("3018"), 'desarrollo') : stryMutAct_9fa48("3019") ? "" : (stryCov_9fa48("3019"), 'mixta'),
                    tiempoLimiteMin: stryMutAct_9fa48("3022") ? tiempoLimiteMin && Math.ceil(numQuestions * 1.5) : stryMutAct_9fa48("3021") ? false : stryMutAct_9fa48("3020") ? true : (stryCov_9fa48("3020", "3021", "3022"), tiempoLimiteMin || Math.ceil(stryMutAct_9fa48("3023") ? numQuestions / 1.5 : (stryCov_9fa48("3023"), numQuestions * 1.5))),
                    // 1.5 min por pregunta por defecto
                    totalPreguntas: generatedExam.questions.length,
                    fuente: stryMutAct_9fa48("3026") ? fuente && 'Generado con IA' : stryMutAct_9fa48("3025") ? false : stryMutAct_9fa48("3024") ? true : (stryCov_9fa48("3024", "3025", "3026"), fuente || (stryMutAct_9fa48("3027") ? "" : (stryCov_9fa48("3027"), 'Generado con IA')))
                  })
                }));

                // Crear preguntas y opciones
                const createdQuestions = stryMutAct_9fa48("3028") ? ["Stryker was here"] : (stryCov_9fa48("3028"), []);
                for (let i = 0; stryMutAct_9fa48("3031") ? i >= generatedExam.questions.length : stryMutAct_9fa48("3030") ? i <= generatedExam.questions.length : stryMutAct_9fa48("3029") ? false : (stryCov_9fa48("3029", "3030", "3031"), i < generatedExam.questions.length); stryMutAct_9fa48("3032") ? i-- : (stryCov_9fa48("3032"), i++)) {
                  if (stryMutAct_9fa48("3033")) {
                    {}
                  } else {
                    stryCov_9fa48("3033");
                    const q = generatedExam.questions[i];

                    // Buscar o crear tema si no está asociado
                    let topicId = q.topicId;
                    if (stryMutAct_9fa48("3036") ? !topicId || q.ejeTematico : stryMutAct_9fa48("3035") ? false : stryMutAct_9fa48("3034") ? true : (stryCov_9fa48("3034", "3035", "3036"), (stryMutAct_9fa48("3037") ? topicId : (stryCov_9fa48("3037"), !topicId)) && q.ejeTematico)) {
                      if (stryMutAct_9fa48("3038")) {
                        {}
                      } else {
                        stryCov_9fa48("3038");
                        // Buscar tema por eje temático
                        const matchingTopic = await tx.topic.findFirst(stryMutAct_9fa48("3039") ? {} : (stryCov_9fa48("3039"), {
                          where: stryMutAct_9fa48("3040") ? {} : (stryCov_9fa48("3040"), {
                            subjectId,
                            ejeTematico: stryMutAct_9fa48("3041") ? {} : (stryCov_9fa48("3041"), {
                              contains: q.ejeTematico,
                              mode: stryMutAct_9fa48("3042") ? "" : (stryCov_9fa48("3042"), 'insensitive')
                            })
                          })
                        }));
                        if (stryMutAct_9fa48("3044") ? false : stryMutAct_9fa48("3043") ? true : (stryCov_9fa48("3043", "3044"), matchingTopic)) {
                          if (stryMutAct_9fa48("3045")) {
                            {}
                          } else {
                            stryCov_9fa48("3045");
                            topicId = matchingTopic.id;
                          }
                        } else {
                          if (stryMutAct_9fa48("3046")) {
                            {}
                          } else {
                            stryCov_9fa48("3046");
                            // Si no se encuentra, usar el primer tema disponible
                            const firstTopic = await tx.topic.findFirst(stryMutAct_9fa48("3047") ? {} : (stryCov_9fa48("3047"), {
                              where: stryMutAct_9fa48("3048") ? {} : (stryCov_9fa48("3048"), {
                                subjectId
                              })
                            }));
                            if (stryMutAct_9fa48("3050") ? false : stryMutAct_9fa48("3049") ? true : (stryCov_9fa48("3049", "3050"), firstTopic)) {
                              if (stryMutAct_9fa48("3051")) {
                                {}
                              } else {
                                stryCov_9fa48("3051");
                                topicId = firstTopic.id;
                              }
                            }
                          }
                        }
                      }
                    }

                    // Determinar el tipo de pregunta individual
                    // Si el examen es mixta, cada pregunta puede ser objetiva o desarrollo
                    const questionType = (stryMutAct_9fa48("3054") ? q.opciones || q.opciones.length > 0 : stryMutAct_9fa48("3053") ? false : stryMutAct_9fa48("3052") ? true : (stryCov_9fa48("3052", "3053", "3054"), q.opciones && (stryMutAct_9fa48("3057") ? q.opciones.length <= 0 : stryMutAct_9fa48("3056") ? q.opciones.length >= 0 : stryMutAct_9fa48("3055") ? true : (stryCov_9fa48("3055", "3056", "3057"), q.opciones.length > 0)))) ? stryMutAct_9fa48("3058") ? "" : (stryCov_9fa48("3058"), 'objetiva') : stryMutAct_9fa48("3059") ? "" : (stryCov_9fa48("3059"), 'desarrollo');
                    const finalQuestionType = (stryMutAct_9fa48("3062") ? tipo !== 'mixta' : stryMutAct_9fa48("3061") ? false : stryMutAct_9fa48("3060") ? true : (stryCov_9fa48("3060", "3061", "3062"), tipo === (stryMutAct_9fa48("3063") ? "" : (stryCov_9fa48("3063"), 'mixta')))) ? questionType : (stryMutAct_9fa48("3066") ? tipo !== 'objetiva' : stryMutAct_9fa48("3065") ? false : stryMutAct_9fa48("3064") ? true : (stryCov_9fa48("3064", "3065", "3066"), tipo === (stryMutAct_9fa48("3067") ? "" : (stryCov_9fa48("3067"), 'objetiva')))) ? stryMutAct_9fa48("3068") ? "" : (stryCov_9fa48("3068"), 'objetiva') : stryMutAct_9fa48("3069") ? "" : (stryCov_9fa48("3069"), 'desarrollo');
                    const question = await tx.question.create(stryMutAct_9fa48("3070") ? {} : (stryCov_9fa48("3070"), {
                      data: stryMutAct_9fa48("3071") ? {} : (stryCov_9fa48("3071"), {
                        subjectId,
                        topicId: stryMutAct_9fa48("3074") ? topicId && null : stryMutAct_9fa48("3073") ? false : stryMutAct_9fa48("3072") ? true : (stryCov_9fa48("3072", "3073", "3074"), topicId || null),
                        enunciado: q.enunciado,
                        dificultad: q.dificultad,
                        explicacion: q.explicacion,
                        fuente: stryMutAct_9fa48("3077") ? fuente && 'Generado con IA' : stryMutAct_9fa48("3076") ? false : stryMutAct_9fa48("3075") ? true : (stryCov_9fa48("3075", "3076", "3077"), fuente || (stryMutAct_9fa48("3078") ? "" : (stryCov_9fa48("3078"), 'Generado con IA'))),
                        tipo: finalQuestionType,
                        // Solo crear opciones si la pregunta es objetiva y tiene opciones
                        ...((stryMutAct_9fa48("3081") ? finalQuestionType === 'objetiva' && q.opciones || q.opciones.length > 0 : stryMutAct_9fa48("3080") ? false : stryMutAct_9fa48("3079") ? true : (stryCov_9fa48("3079", "3080", "3081"), (stryMutAct_9fa48("3083") ? finalQuestionType === 'objetiva' || q.opciones : stryMutAct_9fa48("3082") ? true : (stryCov_9fa48("3082", "3083"), (stryMutAct_9fa48("3085") ? finalQuestionType !== 'objetiva' : stryMutAct_9fa48("3084") ? true : (stryCov_9fa48("3084", "3085"), finalQuestionType === (stryMutAct_9fa48("3086") ? "" : (stryCov_9fa48("3086"), 'objetiva')))) && q.opciones)) && (stryMutAct_9fa48("3089") ? q.opciones.length <= 0 : stryMutAct_9fa48("3088") ? q.opciones.length >= 0 : stryMutAct_9fa48("3087") ? true : (stryCov_9fa48("3087", "3088", "3089"), q.opciones.length > 0)))) ? stryMutAct_9fa48("3090") ? {} : (stryCov_9fa48("3090"), {
                          options: stryMutAct_9fa48("3091") ? {} : (stryCov_9fa48("3091"), {
                            create: q.opciones.map(stryMutAct_9fa48("3092") ? () => undefined : (stryCov_9fa48("3092"), opt => stryMutAct_9fa48("3093") ? {} : (stryCov_9fa48("3093"), {
                              letra: opt.letra,
                              texto: opt.texto,
                              esCorrecta: opt.esCorrecta
                            })))
                          })
                        }) : {})
                      })
                    }));
                    createdQuestions.push(question);

                    // Asociar pregunta al examen
                    await tx.examQuestion.create(stryMutAct_9fa48("3094") ? {} : (stryCov_9fa48("3094"), {
                      data: stryMutAct_9fa48("3095") ? {} : (stryCov_9fa48("3095"), {
                        examId: newExam.id,
                        questionId: question.id,
                        orden: stryMutAct_9fa48("3096") ? i - 1 : (stryCov_9fa48("3096"), i + 1)
                      })
                    }));
                  }
                }
                return stryMutAct_9fa48("3097") ? {} : (stryCov_9fa48("3097"), {
                  exam: newExam,
                  questions: createdQuestions
                });
              }
            });
            logger.info(stryMutAct_9fa48("3098") ? {} : (stryCov_9fa48("3098"), {
              examId: exam.exam.id,
              subjectId: exam.exam.subjectId,
              totalPreguntas: generatedExam.questions.length,
              tipo,
              difficulty,
              userId: user.id
            }), stryMutAct_9fa48("3099") ? `` : (stryCov_9fa48("3099"), `Examen generado exitosamente con ${generatedExam.questions.length} preguntas`));
            return NextResponse.json(stryMutAct_9fa48("3100") ? {} : (stryCov_9fa48("3100"), {
              success: stryMutAct_9fa48("3101") ? false : (stryCov_9fa48("3101"), true),
              message: stryMutAct_9fa48("3102") ? `` : (stryCov_9fa48("3102"), `Examen generado exitosamente con ${generatedExam.questions.length} preguntas`),
              exam: stryMutAct_9fa48("3103") ? {} : (stryCov_9fa48("3103"), {
                id: exam.exam.id,
                titulo: exam.exam.titulo,
                totalPreguntas: exam.exam.totalPreguntas,
                subjectId: exam.exam.subjectId
              }),
              answerKey: generatedExam.answerKey,
              questionsGenerated: generatedExam.questions.length
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3104")) {
            {}
          } else {
            stryCov_9fa48("3104");
            logger.error(stryMutAct_9fa48("3105") ? {} : (stryCov_9fa48("3105"), {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              userId: stryMutAct_9fa48("3106") ? user.id : (stryCov_9fa48("3106"), user?.id),
              subjectId: validation.success ? validation.data.subjectId : undefined
            }), stryMutAct_9fa48("3107") ? "" : (stryCov_9fa48("3107"), 'Error al generar examen'));
            if (stryMutAct_9fa48("3109") ? false : stryMutAct_9fa48("3108") ? true : (stryCov_9fa48("3108", "3109"), error instanceof Error)) {
              if (stryMutAct_9fa48("3110")) {
                {}
              } else {
                stryCov_9fa48("3110");
                // Errores específicos de IA
                if (stryMutAct_9fa48("3112") ? false : stryMutAct_9fa48("3111") ? true : (stryCov_9fa48("3111", "3112"), error.message.includes(stryMutAct_9fa48("3113") ? "" : (stryCov_9fa48("3113"), 'No hay configuración de IA')))) {
                  if (stryMutAct_9fa48("3114")) {
                    {}
                  } else {
                    stryCov_9fa48("3114");
                    return NextResponse.json(stryMutAct_9fa48("3115") ? {} : (stryCov_9fa48("3115"), {
                      error: stryMutAct_9fa48("3116") ? "" : (stryCov_9fa48("3116"), 'No hay configuración de IA disponible. Por favor, configura tus API keys en tu perfil.')
                    }), stryMutAct_9fa48("3117") ? {} : (stryCov_9fa48("3117"), {
                      status: 400
                    }));
                  }
                }
                if (stryMutAct_9fa48("3119") ? false : stryMutAct_9fa48("3118") ? true : (stryCov_9fa48("3118", "3119"), error.message.includes(stryMutAct_9fa48("3120") ? "" : (stryCov_9fa48("3120"), 'formato válido')))) {
                  if (stryMutAct_9fa48("3121")) {
                    {}
                  } else {
                    stryCov_9fa48("3121");
                    return NextResponse.json(stryMutAct_9fa48("3122") ? {} : (stryCov_9fa48("3122"), {
                      error: stryMutAct_9fa48("3123") ? "" : (stryCov_9fa48("3123"), 'La IA no generó un formato válido. Intenta nuevamente o ajusta los parámetros.')
                    }), stryMutAct_9fa48("3124") ? {} : (stryCov_9fa48("3124"), {
                      status: 500
                    }));
                  }
                }
              }
            }
            return NextResponse.json(stryMutAct_9fa48("3125") ? {} : (stryCov_9fa48("3125"), {
              error: stryMutAct_9fa48("3126") ? "" : (stryCov_9fa48("3126"), 'Error al generar examen. Intenta nuevamente.')
            }), stryMutAct_9fa48("3127") ? {} : (stryCov_9fa48("3127"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}