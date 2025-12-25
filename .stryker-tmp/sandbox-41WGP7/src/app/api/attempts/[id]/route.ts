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
import { validateBody, handleApiError } from '@/lib/api-helpers';
import { updateAttemptSchema } from '@/lib/validations';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest, logger } from '@/lib/logger';
import { invalidateCachePattern } from '@/lib/cache';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("6703") ? "" : (stryCov_9fa48("6703"), 'nodejs');
export async function GET(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("6704")) {
    {}
  } else {
    stryCov_9fa48("6704");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6705")) {
        {}
      } else {
        stryCov_9fa48("6705");
        try {
          if (stryMutAct_9fa48("6706")) {
            {}
          } else {
            stryCov_9fa48("6706");
            const {
              id
            } = await params;
            logApiRequest(stryMutAct_9fa48("6707") ? "" : (stryCov_9fa48("6707"), 'GET'), stryMutAct_9fa48("6708") ? `` : (stryCov_9fa48("6708"), `/api/attempts/${id}`));

            // Validar formato del ID (cuid)
            if (stryMutAct_9fa48("6711") ? !id && !/^c[a-z0-9]{24}$/.test(id) : stryMutAct_9fa48("6710") ? false : stryMutAct_9fa48("6709") ? true : (stryCov_9fa48("6709", "6710", "6711"), (stryMutAct_9fa48("6712") ? id : (stryCov_9fa48("6712"), !id)) || (stryMutAct_9fa48("6713") ? /^c[a-z0-9]{24}$/.test(id) : (stryCov_9fa48("6713"), !(stryMutAct_9fa48("6717") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("6716") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("6715") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("6714") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("6714", "6715", "6716", "6717"), /^c[a-z0-9]{24}$/)).test(id))))) {
              if (stryMutAct_9fa48("6718")) {
                {}
              } else {
                stryCov_9fa48("6718");
                return NextResponse.json(stryMutAct_9fa48("6719") ? {} : (stryCov_9fa48("6719"), {
                  error: stryMutAct_9fa48("6720") ? "" : (stryCov_9fa48("6720"), 'ID de intento inválido')
                }), stryMutAct_9fa48("6721") ? {} : (stryCov_9fa48("6721"), {
                  status: 400
                }));
              }
            }
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("6724") ? false : stryMutAct_9fa48("6723") ? true : stryMutAct_9fa48("6722") ? studentId : (stryCov_9fa48("6722", "6723", "6724"), !studentId)) {
              if (stryMutAct_9fa48("6725")) {
                {}
              } else {
                stryCov_9fa48("6725");
                return NextResponse.json(stryMutAct_9fa48("6726") ? {} : (stryCov_9fa48("6726"), {
                  error: stryMutAct_9fa48("6727") ? "" : (stryCov_9fa48("6727"), 'No autorizado')
                }), stryMutAct_9fa48("6728") ? {} : (stryCov_9fa48("6728"), {
                  status: 401
                }));
              }
            }

            // Obtener intento con todas las relaciones
            const attempt = await prisma.attempt.findUnique(stryMutAct_9fa48("6729") ? {} : (stryCov_9fa48("6729"), {
              where: stryMutAct_9fa48("6730") ? {} : (stryCov_9fa48("6730"), {
                id
              }),
              include: stryMutAct_9fa48("6731") ? {} : (stryCov_9fa48("6731"), {
                exam: stryMutAct_9fa48("6732") ? {} : (stryCov_9fa48("6732"), {
                  include: stryMutAct_9fa48("6733") ? {} : (stryCov_9fa48("6733"), {
                    subject: stryMutAct_9fa48("6734") ? false : (stryCov_9fa48("6734"), true),
                    questions: stryMutAct_9fa48("6735") ? {} : (stryCov_9fa48("6735"), {
                      include: stryMutAct_9fa48("6736") ? {} : (stryCov_9fa48("6736"), {
                        question: stryMutAct_9fa48("6737") ? {} : (stryCov_9fa48("6737"), {
                          include: stryMutAct_9fa48("6738") ? {} : (stryCov_9fa48("6738"), {
                            options: stryMutAct_9fa48("6739") ? false : (stryCov_9fa48("6739"), true)
                          })
                        })
                      }),
                      orderBy: stryMutAct_9fa48("6740") ? {} : (stryCov_9fa48("6740"), {
                        orden: stryMutAct_9fa48("6741") ? "" : (stryCov_9fa48("6741"), 'asc')
                      })
                    })
                  })
                }),
                answers: stryMutAct_9fa48("6742") ? {} : (stryCov_9fa48("6742"), {
                  include: stryMutAct_9fa48("6743") ? {} : (stryCov_9fa48("6743"), {
                    question: stryMutAct_9fa48("6744") ? {} : (stryCov_9fa48("6744"), {
                      include: stryMutAct_9fa48("6745") ? {} : (stryCov_9fa48("6745"), {
                        options: stryMutAct_9fa48("6746") ? false : (stryCov_9fa48("6746"), true),
                        topic: stryMutAct_9fa48("6747") ? false : (stryCov_9fa48("6747"), true)
                      })
                    }),
                    optionSelected: stryMutAct_9fa48("6748") ? false : (stryCov_9fa48("6748"), true)
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("6751") ? false : stryMutAct_9fa48("6750") ? true : stryMutAct_9fa48("6749") ? attempt : (stryCov_9fa48("6749", "6750", "6751"), !attempt)) {
              if (stryMutAct_9fa48("6752")) {
                {}
              } else {
                stryCov_9fa48("6752");
                return NextResponse.json(stryMutAct_9fa48("6753") ? {} : (stryCov_9fa48("6753"), {
                  error: stryMutAct_9fa48("6754") ? "" : (stryCov_9fa48("6754"), 'Intento no encontrado')
                }), stryMutAct_9fa48("6755") ? {} : (stryCov_9fa48("6755"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("6758") ? attempt.studentId === studentId : stryMutAct_9fa48("6757") ? false : stryMutAct_9fa48("6756") ? true : (stryCov_9fa48("6756", "6757", "6758"), attempt.studentId !== studentId)) {
              if (stryMutAct_9fa48("6759")) {
                {}
              } else {
                stryCov_9fa48("6759");
                return NextResponse.json(stryMutAct_9fa48("6760") ? {} : (stryCov_9fa48("6760"), {
                  error: stryMutAct_9fa48("6761") ? "" : (stryCov_9fa48("6761"), 'No autorizado')
                }), stryMutAct_9fa48("6762") ? {} : (stryCov_9fa48("6762"), {
                  status: 403
                }));
              }
            }
            return NextResponse.json(attempt);
          }
        } catch (error) {
          if (stryMutAct_9fa48("6763")) {
            {}
          } else {
            stryCov_9fa48("6763");
            return handleApiError(error, stryMutAct_9fa48("6764") ? "" : (stryCov_9fa48("6764"), 'Error al obtener intento'), stryMutAct_9fa48("6765") ? {} : (stryCov_9fa48("6765"), {
              path: stryMutAct_9fa48("6766") ? `` : (stryCov_9fa48("6766"), `/api/attempts/${await params.then(stryMutAct_9fa48("6767") ? () => undefined : (stryCov_9fa48("6767"), p => p.id))}`)
            }));
          }
        }
      }
    });
  }
}
export async function PUT(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("6768")) {
    {}
  } else {
    stryCov_9fa48("6768");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6769")) {
        {}
      } else {
        stryCov_9fa48("6769");
        try {
          if (stryMutAct_9fa48("6770")) {
            {}
          } else {
            stryCov_9fa48("6770");
            const {
              id
            } = await params;
            logApiRequest(stryMutAct_9fa48("6771") ? "" : (stryCov_9fa48("6771"), 'PUT'), stryMutAct_9fa48("6772") ? `` : (stryCov_9fa48("6772"), `/api/attempts/${id}`));

            // Validar formato del ID (cuid)
            if (stryMutAct_9fa48("6775") ? !id && !/^c[a-z0-9]{24}$/.test(id) : stryMutAct_9fa48("6774") ? false : stryMutAct_9fa48("6773") ? true : (stryCov_9fa48("6773", "6774", "6775"), (stryMutAct_9fa48("6776") ? id : (stryCov_9fa48("6776"), !id)) || (stryMutAct_9fa48("6777") ? /^c[a-z0-9]{24}$/.test(id) : (stryCov_9fa48("6777"), !(stryMutAct_9fa48("6781") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("6780") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("6779") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("6778") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("6778", "6779", "6780", "6781"), /^c[a-z0-9]{24}$/)).test(id))))) {
              if (stryMutAct_9fa48("6782")) {
                {}
              } else {
                stryCov_9fa48("6782");
                return NextResponse.json(stryMutAct_9fa48("6783") ? {} : (stryCov_9fa48("6783"), {
                  error: stryMutAct_9fa48("6784") ? "" : (stryCov_9fa48("6784"), 'ID de intento inválido')
                }), stryMutAct_9fa48("6785") ? {} : (stryCov_9fa48("6785"), {
                  status: 400
                }));
              }
            }
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("6788") ? false : stryMutAct_9fa48("6787") ? true : stryMutAct_9fa48("6786") ? studentId : (stryCov_9fa48("6786", "6787", "6788"), !studentId)) {
              if (stryMutAct_9fa48("6789")) {
                {}
              } else {
                stryCov_9fa48("6789");
                return NextResponse.json(stryMutAct_9fa48("6790") ? {} : (stryCov_9fa48("6790"), {
                  error: stryMutAct_9fa48("6791") ? "" : (stryCov_9fa48("6791"), 'No autorizado')
                }), stryMutAct_9fa48("6792") ? {} : (stryCov_9fa48("6792"), {
                  status: 401
                }));
              }
            }

            // Validar body
            const validation = await validateBody(request, updateAttemptSchema);
            if (stryMutAct_9fa48("6795") ? false : stryMutAct_9fa48("6794") ? true : stryMutAct_9fa48("6793") ? validation.success : (stryCov_9fa48("6793", "6794", "6795"), !validation.success)) {
              if (stryMutAct_9fa48("6796")) {
                {}
              } else {
                stryCov_9fa48("6796");
                return validation.error;
              }
            }
            const {
              answers,
              estado
            } = validation.data;

            // Verificar que el intento existe y pertenece al estudiante
            const attempt = await prisma.attempt.findUnique(stryMutAct_9fa48("6797") ? {} : (stryCov_9fa48("6797"), {
              where: stryMutAct_9fa48("6798") ? {} : (stryCov_9fa48("6798"), {
                id
              }),
              include: stryMutAct_9fa48("6799") ? {} : (stryCov_9fa48("6799"), {
                exam: stryMutAct_9fa48("6800") ? {} : (stryCov_9fa48("6800"), {
                  include: stryMutAct_9fa48("6801") ? {} : (stryCov_9fa48("6801"), {
                    questions: stryMutAct_9fa48("6802") ? {} : (stryCov_9fa48("6802"), {
                      include: stryMutAct_9fa48("6803") ? {} : (stryCov_9fa48("6803"), {
                        question: stryMutAct_9fa48("6804") ? {} : (stryCov_9fa48("6804"), {
                          include: stryMutAct_9fa48("6805") ? {} : (stryCov_9fa48("6805"), {
                            options: stryMutAct_9fa48("6806") ? false : (stryCov_9fa48("6806"), true)
                          })
                        })
                      })
                    })
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("6809") ? false : stryMutAct_9fa48("6808") ? true : stryMutAct_9fa48("6807") ? attempt : (stryCov_9fa48("6807", "6808", "6809"), !attempt)) {
              if (stryMutAct_9fa48("6810")) {
                {}
              } else {
                stryCov_9fa48("6810");
                return NextResponse.json(stryMutAct_9fa48("6811") ? {} : (stryCov_9fa48("6811"), {
                  error: stryMutAct_9fa48("6812") ? "" : (stryCov_9fa48("6812"), 'Intento no encontrado')
                }), stryMutAct_9fa48("6813") ? {} : (stryCov_9fa48("6813"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("6816") ? attempt.studentId === studentId : stryMutAct_9fa48("6815") ? false : stryMutAct_9fa48("6814") ? true : (stryCov_9fa48("6814", "6815", "6816"), attempt.studentId !== studentId)) {
              if (stryMutAct_9fa48("6817")) {
                {}
              } else {
                stryCov_9fa48("6817");
                return NextResponse.json(stryMutAct_9fa48("6818") ? {} : (stryCov_9fa48("6818"), {
                  error: stryMutAct_9fa48("6819") ? "" : (stryCov_9fa48("6819"), 'No autorizado')
                }), stryMutAct_9fa48("6820") ? {} : (stryCov_9fa48("6820"), {
                  status: 403
                }));
              }
            }
            if (stryMutAct_9fa48("6823") ? attempt.estado !== 'completado' : stryMutAct_9fa48("6822") ? false : stryMutAct_9fa48("6821") ? true : (stryCov_9fa48("6821", "6822", "6823"), attempt.estado === (stryMutAct_9fa48("6824") ? "" : (stryCov_9fa48("6824"), 'completado')))) {
              if (stryMutAct_9fa48("6825")) {
                {}
              } else {
                stryCov_9fa48("6825");
                return NextResponse.json(stryMutAct_9fa48("6826") ? {} : (stryCov_9fa48("6826"), {
                  error: stryMutAct_9fa48("6827") ? "" : (stryCov_9fa48("6827"), 'El intento ya está completado')
                }), stryMutAct_9fa48("6828") ? {} : (stryCov_9fa48("6828"), {
                  status: 400
                }));
              }
            }

            // Actualizar respuestas si se proporcionan
            if (stryMutAct_9fa48("6831") ? answers || answers.length > 0 : stryMutAct_9fa48("6830") ? false : stryMutAct_9fa48("6829") ? true : (stryCov_9fa48("6829", "6830", "6831"), answers && (stryMutAct_9fa48("6834") ? answers.length <= 0 : stryMutAct_9fa48("6833") ? answers.length >= 0 : stryMutAct_9fa48("6832") ? true : (stryCov_9fa48("6832", "6833", "6834"), answers.length > 0)))) {
              if (stryMutAct_9fa48("6835")) {
                {}
              } else {
                stryCov_9fa48("6835");
                // VALIDACIÓN 1: Verificar que no haya respuestas duplicadas para la misma pregunta
                const questionIds = new Set<string>();
                const duplicates: string[] = stryMutAct_9fa48("6836") ? ["Stryker was here"] : (stryCov_9fa48("6836"), []);
                for (const answer of answers) {
                  if (stryMutAct_9fa48("6837")) {
                    {}
                  } else {
                    stryCov_9fa48("6837");
                    if (stryMutAct_9fa48("6839") ? false : stryMutAct_9fa48("6838") ? true : (stryCov_9fa48("6838", "6839"), questionIds.has(answer.questionId))) {
                      if (stryMutAct_9fa48("6840")) {
                        {}
                      } else {
                        stryCov_9fa48("6840");
                        duplicates.push(answer.questionId);
                      }
                    }
                    questionIds.add(answer.questionId);
                  }
                }
                if (stryMutAct_9fa48("6844") ? duplicates.length <= 0 : stryMutAct_9fa48("6843") ? duplicates.length >= 0 : stryMutAct_9fa48("6842") ? false : stryMutAct_9fa48("6841") ? true : (stryCov_9fa48("6841", "6842", "6843", "6844"), duplicates.length > 0)) {
                  if (stryMutAct_9fa48("6845")) {
                    {}
                  } else {
                    stryCov_9fa48("6845");
                    return NextResponse.json(stryMutAct_9fa48("6846") ? {} : (stryCov_9fa48("6846"), {
                      error: stryMutAct_9fa48("6847") ? "" : (stryCov_9fa48("6847"), 'Respuestas duplicadas detectadas'),
                      details: stryMutAct_9fa48("6848") ? `` : (stryCov_9fa48("6848"), `Las siguientes preguntas tienen múltiples respuestas: ${(stryMutAct_9fa48("6849") ? [] : (stryCov_9fa48("6849"), [...new Set(duplicates)])).join(stryMutAct_9fa48("6850") ? "" : (stryCov_9fa48("6850"), ', '))}`)
                    }), stryMutAct_9fa48("6851") ? {} : (stryCov_9fa48("6851"), {
                      status: 400
                    }));
                  }
                }

                // VALIDACIÓN 2: Verificar que el número de respuestas no exceda el total de preguntas
                if (stryMutAct_9fa48("6855") ? answers.length <= attempt.totalPreguntas : stryMutAct_9fa48("6854") ? answers.length >= attempt.totalPreguntas : stryMutAct_9fa48("6853") ? false : stryMutAct_9fa48("6852") ? true : (stryCov_9fa48("6852", "6853", "6854", "6855"), answers.length > attempt.totalPreguntas)) {
                  if (stryMutAct_9fa48("6856")) {
                    {}
                  } else {
                    stryCov_9fa48("6856");
                    return NextResponse.json(stryMutAct_9fa48("6857") ? {} : (stryCov_9fa48("6857"), {
                      error: stryMutAct_9fa48("6858") ? "" : (stryCov_9fa48("6858"), 'Número de respuestas excede el total de preguntas'),
                      details: stryMutAct_9fa48("6859") ? `` : (stryCov_9fa48("6859"), `Se enviaron ${answers.length} respuestas, pero el examen tiene ${attempt.totalPreguntas} preguntas`)
                    }), stryMutAct_9fa48("6860") ? {} : (stryCov_9fa48("6860"), {
                      status: 400
                    }));
                  }
                }

                // VALIDACIÓN 3: Verificar que todas las preguntas pertenezcan al examen
                const validQuestionIds = new Set(attempt.exam.questions.map(stryMutAct_9fa48("6861") ? () => undefined : (stryCov_9fa48("6861"), eq => eq.questionId)));
                const invalidQuestionIds: string[] = stryMutAct_9fa48("6862") ? ["Stryker was here"] : (stryCov_9fa48("6862"), []);
                for (const answer of answers) {
                  if (stryMutAct_9fa48("6863")) {
                    {}
                  } else {
                    stryCov_9fa48("6863");
                    if (stryMutAct_9fa48("6866") ? false : stryMutAct_9fa48("6865") ? true : stryMutAct_9fa48("6864") ? validQuestionIds.has(answer.questionId) : (stryCov_9fa48("6864", "6865", "6866"), !validQuestionIds.has(answer.questionId))) {
                      if (stryMutAct_9fa48("6867")) {
                        {}
                      } else {
                        stryCov_9fa48("6867");
                        invalidQuestionIds.push(answer.questionId);
                      }
                    }
                  }
                }
                if (stryMutAct_9fa48("6871") ? invalidQuestionIds.length <= 0 : stryMutAct_9fa48("6870") ? invalidQuestionIds.length >= 0 : stryMutAct_9fa48("6869") ? false : stryMutAct_9fa48("6868") ? true : (stryCov_9fa48("6868", "6869", "6870", "6871"), invalidQuestionIds.length > 0)) {
                  if (stryMutAct_9fa48("6872")) {
                    {}
                  } else {
                    stryCov_9fa48("6872");
                    return NextResponse.json(stryMutAct_9fa48("6873") ? {} : (stryCov_9fa48("6873"), {
                      error: stryMutAct_9fa48("6874") ? "" : (stryCov_9fa48("6874"), 'Preguntas inválidas detectadas'),
                      details: stryMutAct_9fa48("6875") ? `` : (stryCov_9fa48("6875"), `Las siguientes preguntas no pertenecen a este examen: ${invalidQuestionIds.join(stryMutAct_9fa48("6876") ? "" : (stryCov_9fa48("6876"), ', '))}`)
                    }), stryMutAct_9fa48("6877") ? {} : (stryCov_9fa48("6877"), {
                      status: 400
                    }));
                  }
                }

                // VALIDACIÓN 4: Verificar que las opciones pertenezcan a sus preguntas
                const invalidOptions: Array<{
                  questionId: string;
                  optionId: string;
                }> = stryMutAct_9fa48("6878") ? ["Stryker was here"] : (stryCov_9fa48("6878"), []);
                for (const answer of answers) {
                  if (stryMutAct_9fa48("6879")) {
                    {}
                  } else {
                    stryCov_9fa48("6879");
                    if (stryMutAct_9fa48("6881") ? false : stryMutAct_9fa48("6880") ? true : (stryCov_9fa48("6880", "6881"), answer.optionSelectedId)) {
                      if (stryMutAct_9fa48("6882")) {
                        {}
                      } else {
                        stryCov_9fa48("6882");
                        const examQuestion = attempt.exam.questions.find(stryMutAct_9fa48("6883") ? () => undefined : (stryCov_9fa48("6883"), eq => stryMutAct_9fa48("6886") ? eq.questionId !== answer.questionId : stryMutAct_9fa48("6885") ? false : stryMutAct_9fa48("6884") ? true : (stryCov_9fa48("6884", "6885", "6886"), eq.questionId === answer.questionId)));
                        if (stryMutAct_9fa48("6888") ? false : stryMutAct_9fa48("6887") ? true : (stryCov_9fa48("6887", "6888"), examQuestion)) {
                          if (stryMutAct_9fa48("6889")) {
                            {}
                          } else {
                            stryCov_9fa48("6889");
                            const optionExists = stryMutAct_9fa48("6890") ? examQuestion.question.options.every(opt => opt.id === answer.optionSelectedId) : (stryCov_9fa48("6890"), examQuestion.question.options.some(stryMutAct_9fa48("6891") ? () => undefined : (stryCov_9fa48("6891"), opt => stryMutAct_9fa48("6894") ? opt.id !== answer.optionSelectedId : stryMutAct_9fa48("6893") ? false : stryMutAct_9fa48("6892") ? true : (stryCov_9fa48("6892", "6893", "6894"), opt.id === answer.optionSelectedId))));
                            if (stryMutAct_9fa48("6897") ? false : stryMutAct_9fa48("6896") ? true : stryMutAct_9fa48("6895") ? optionExists : (stryCov_9fa48("6895", "6896", "6897"), !optionExists)) {
                              if (stryMutAct_9fa48("6898")) {
                                {}
                              } else {
                                stryCov_9fa48("6898");
                                invalidOptions.push(stryMutAct_9fa48("6899") ? {} : (stryCov_9fa48("6899"), {
                                  questionId: answer.questionId,
                                  optionId: answer.optionSelectedId
                                }));
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
                if (stryMutAct_9fa48("6903") ? invalidOptions.length <= 0 : stryMutAct_9fa48("6902") ? invalidOptions.length >= 0 : stryMutAct_9fa48("6901") ? false : stryMutAct_9fa48("6900") ? true : (stryCov_9fa48("6900", "6901", "6902", "6903"), invalidOptions.length > 0)) {
                  if (stryMutAct_9fa48("6904")) {
                    {}
                  } else {
                    stryCov_9fa48("6904");
                    return NextResponse.json(stryMutAct_9fa48("6905") ? {} : (stryCov_9fa48("6905"), {
                      error: stryMutAct_9fa48("6906") ? "" : (stryCov_9fa48("6906"), 'Opciones inválidas detectadas'),
                      details: stryMutAct_9fa48("6907") ? `` : (stryCov_9fa48("6907"), `Las siguientes opciones no pertenecen a sus preguntas: ${invalidOptions.map(stryMutAct_9fa48("6908") ? () => undefined : (stryCov_9fa48("6908"), io => stryMutAct_9fa48("6909") ? `` : (stryCov_9fa48("6909"), `Pregunta ${io.questionId} -> Opción ${io.optionId}`))).join(stryMutAct_9fa48("6910") ? "" : (stryCov_9fa48("6910"), ', '))}`)
                    }), stryMutAct_9fa48("6911") ? {} : (stryCov_9fa48("6911"), {
                      status: 400
                    }));
                  }
                }

                // Eliminar respuestas existentes para este intento
                await prisma.attemptAnswer.deleteMany(stryMutAct_9fa48("6912") ? {} : (stryCov_9fa48("6912"), {
                  where: stryMutAct_9fa48("6913") ? {} : (stryCov_9fa48("6913"), {
                    attemptId: id
                  })
                }));

                // Crear nuevas respuestas (ya validadas)
                const answersToCreate = answers.map(answer => {
                  if (stryMutAct_9fa48("6914")) {
                    {}
                  } else {
                    stryCov_9fa48("6914");
                    const examQuestion = attempt.exam.questions.find(stryMutAct_9fa48("6915") ? () => undefined : (stryCov_9fa48("6915"), eq => stryMutAct_9fa48("6918") ? eq.questionId !== answer.questionId : stryMutAct_9fa48("6917") ? false : stryMutAct_9fa48("6916") ? true : (stryCov_9fa48("6916", "6917", "6918"), eq.questionId === answer.questionId)))!;
                    const question = examQuestion.question;
                    const optionSelected = answer.optionSelectedId ? question.options.find(stryMutAct_9fa48("6919") ? () => undefined : (stryCov_9fa48("6919"), opt => stryMutAct_9fa48("6922") ? opt.id !== answer.optionSelectedId : stryMutAct_9fa48("6921") ? false : stryMutAct_9fa48("6920") ? true : (stryCov_9fa48("6920", "6921", "6922"), opt.id === answer.optionSelectedId))) : null;
                    const esCorrecta = optionSelected ? optionSelected.esCorrecta : stryMutAct_9fa48("6923") ? true : (stryCov_9fa48("6923"), false);
                    return stryMutAct_9fa48("6924") ? {} : (stryCov_9fa48("6924"), {
                      attemptId: id,
                      questionId: answer.questionId,
                      optionSelectedId: stryMutAct_9fa48("6927") ? answer.optionSelectedId && null : stryMutAct_9fa48("6926") ? false : stryMutAct_9fa48("6925") ? true : (stryCov_9fa48("6925", "6926", "6927"), answer.optionSelectedId || null),
                      esCorrecta: answer.omitida ? stryMutAct_9fa48("6928") ? true : (stryCov_9fa48("6928"), false) : esCorrecta,
                      omitida: stryMutAct_9fa48("6931") ? answer.omitida && false : stryMutAct_9fa48("6930") ? false : stryMutAct_9fa48("6929") ? true : (stryCov_9fa48("6929", "6930", "6931"), answer.omitida || (stryMutAct_9fa48("6932") ? true : (stryCov_9fa48("6932"), false)))
                    });
                  }
                });
                await prisma.attemptAnswer.createMany(stryMutAct_9fa48("6933") ? {} : (stryCov_9fa48("6933"), {
                  data: answersToCreate
                }));
              }
            }

            // Actualizar estado si se proporciona
            const updateData: {
              estado?: 'en_progreso' | 'completado' | 'cancelado';
              finishedAt?: Date;
              duracionSegundos?: number;
              correctas?: number;
              incorrectas?: number;
              omitidas?: number;
              porcentaje?: number;
            } = {};
            if (stryMutAct_9fa48("6935") ? false : stryMutAct_9fa48("6934") ? true : (stryCov_9fa48("6934", "6935"), estado)) {
              if (stryMutAct_9fa48("6936")) {
                {}
              } else {
                stryCov_9fa48("6936");
                // VALIDACIÓN: Verificar que la transición de estado sea válida
                const validTransitions: Record<string, string[]> = stryMutAct_9fa48("6937") ? {} : (stryCov_9fa48("6937"), {
                  en_progreso: stryMutAct_9fa48("6938") ? [] : (stryCov_9fa48("6938"), [stryMutAct_9fa48("6939") ? "" : (stryCov_9fa48("6939"), 'completado'), stryMutAct_9fa48("6940") ? "" : (stryCov_9fa48("6940"), 'cancelado')]),
                  completado: stryMutAct_9fa48("6941") ? ["Stryker was here"] : (stryCov_9fa48("6941"), []),
                  // No se puede cambiar de completado
                  cancelado: stryMutAct_9fa48("6942") ? ["Stryker was here"] : (stryCov_9fa48("6942"), []) // No se puede cambiar de cancelado
                });
                const allowedStates = stryMutAct_9fa48("6945") ? validTransitions[attempt.estado] && [] : stryMutAct_9fa48("6944") ? false : stryMutAct_9fa48("6943") ? true : (stryCov_9fa48("6943", "6944", "6945"), validTransitions[attempt.estado] || (stryMutAct_9fa48("6946") ? ["Stryker was here"] : (stryCov_9fa48("6946"), [])));
                if (stryMutAct_9fa48("6949") ? false : stryMutAct_9fa48("6948") ? true : stryMutAct_9fa48("6947") ? allowedStates.includes(estado) : (stryCov_9fa48("6947", "6948", "6949"), !allowedStates.includes(estado))) {
                  if (stryMutAct_9fa48("6950")) {
                    {}
                  } else {
                    stryCov_9fa48("6950");
                    return NextResponse.json(stryMutAct_9fa48("6951") ? {} : (stryCov_9fa48("6951"), {
                      error: stryMutAct_9fa48("6952") ? "" : (stryCov_9fa48("6952"), 'Transición de estado inválida'),
                      details: stryMutAct_9fa48("6953") ? `` : (stryCov_9fa48("6953"), `No se puede cambiar de '${attempt.estado}' a '${estado}'. Transiciones permitidas: ${(stryMutAct_9fa48("6957") ? allowedStates.length <= 0 : stryMutAct_9fa48("6956") ? allowedStates.length >= 0 : stryMutAct_9fa48("6955") ? false : stryMutAct_9fa48("6954") ? true : (stryCov_9fa48("6954", "6955", "6956", "6957"), allowedStates.length > 0)) ? allowedStates.join(stryMutAct_9fa48("6958") ? "" : (stryCov_9fa48("6958"), ', ')) : stryMutAct_9fa48("6959") ? "" : (stryCov_9fa48("6959"), 'ninguna')}`)
                    }), stryMutAct_9fa48("6960") ? {} : (stryCov_9fa48("6960"), {
                      status: 400
                    }));
                  }
                }
                updateData.estado = estado;
                if (stryMutAct_9fa48("6963") ? estado !== 'completado' : stryMutAct_9fa48("6962") ? false : stryMutAct_9fa48("6961") ? true : (stryCov_9fa48("6961", "6962", "6963"), estado === (stryMutAct_9fa48("6964") ? "" : (stryCov_9fa48("6964"), 'completado')))) {
                  if (stryMutAct_9fa48("6965")) {
                    {}
                  } else {
                    stryCov_9fa48("6965");
                    updateData.finishedAt = new Date();
                    // Calcular duración si startedAt existe
                    if (stryMutAct_9fa48("6967") ? false : stryMutAct_9fa48("6966") ? true : (stryCov_9fa48("6966", "6967"), attempt.startedAt)) {
                      if (stryMutAct_9fa48("6968")) {
                        {}
                      } else {
                        stryCov_9fa48("6968");
                        const duracionSegundos = Math.floor(stryMutAct_9fa48("6969") ? (new Date().getTime() - attempt.startedAt.getTime()) * 1000 : (stryCov_9fa48("6969"), (stryMutAct_9fa48("6970") ? new Date().getTime() + attempt.startedAt.getTime() : (stryCov_9fa48("6970"), new Date().getTime() - attempt.startedAt.getTime())) / 1000));
                        // Validar que la duración sea razonable (no negativa y no exceda 24 horas)
                        if (stryMutAct_9fa48("6974") ? duracionSegundos >= 0 : stryMutAct_9fa48("6973") ? duracionSegundos <= 0 : stryMutAct_9fa48("6972") ? false : stryMutAct_9fa48("6971") ? true : (stryCov_9fa48("6971", "6972", "6973", "6974"), duracionSegundos < 0)) {
                          if (stryMutAct_9fa48("6975")) {
                            {}
                          } else {
                            stryCov_9fa48("6975");
                            // Log warning pero continuar (podría ser un problema de sincronización de tiempo)
                            logger.warn(stryMutAct_9fa48("6976") ? {} : (stryCov_9fa48("6976"), {
                              type: stryMutAct_9fa48("6977") ? "" : (stryCov_9fa48("6977"), 'attempt_validation'),
                              attemptId: id,
                              duracionSegundos,
                              path: stryMutAct_9fa48("6978") ? "" : (stryCov_9fa48("6978"), '/api/attempts/[id]')
                            }), stryMutAct_9fa48("6979") ? `` : (stryCov_9fa48("6979"), `Duración negativa detectada para intento ${id}: ${duracionSegundos} segundos`));
                          }
                        }
                        const MAX_DURATION = stryMutAct_9fa48("6980") ? 24 * 60 / 60 : (stryCov_9fa48("6980"), (stryMutAct_9fa48("6981") ? 24 / 60 : (stryCov_9fa48("6981"), 24 * 60)) * 60); // 24 horas en segundos
                        if (stryMutAct_9fa48("6985") ? duracionSegundos <= MAX_DURATION : stryMutAct_9fa48("6984") ? duracionSegundos >= MAX_DURATION : stryMutAct_9fa48("6983") ? false : stryMutAct_9fa48("6982") ? true : (stryCov_9fa48("6982", "6983", "6984", "6985"), duracionSegundos > MAX_DURATION)) {
                          if (stryMutAct_9fa48("6986")) {
                            {}
                          } else {
                            stryCov_9fa48("6986");
                            return NextResponse.json(stryMutAct_9fa48("6987") ? {} : (stryCov_9fa48("6987"), {
                              error: stryMutAct_9fa48("6988") ? "" : (stryCov_9fa48("6988"), 'Duración inválida'),
                              details: stryMutAct_9fa48("6989") ? `` : (stryCov_9fa48("6989"), `La duración del examen (${Math.floor(stryMutAct_9fa48("6990") ? duracionSegundos * 60 : (stryCov_9fa48("6990"), duracionSegundos / 60))} minutos) excede el límite máximo de 24 horas`)
                            }), stryMutAct_9fa48("6991") ? {} : (stryCov_9fa48("6991"), {
                              status: 400
                            }));
                          }
                        }
                        updateData.duracionSegundos = duracionSegundos;
                      }
                    }
                  }
                }
              }
            }

            // Recalcular estadísticas si hay respuestas
            if (stryMutAct_9fa48("6994") ? answers || answers.length > 0 : stryMutAct_9fa48("6993") ? false : stryMutAct_9fa48("6992") ? true : (stryCov_9fa48("6992", "6993", "6994"), answers && (stryMutAct_9fa48("6997") ? answers.length <= 0 : stryMutAct_9fa48("6996") ? answers.length >= 0 : stryMutAct_9fa48("6995") ? true : (stryCov_9fa48("6995", "6996", "6997"), answers.length > 0)))) {
              if (stryMutAct_9fa48("6998")) {
                {}
              } else {
                stryCov_9fa48("6998");
                const attemptWithAnswers = await prisma.attempt.findUnique(stryMutAct_9fa48("6999") ? {} : (stryCov_9fa48("6999"), {
                  where: stryMutAct_9fa48("7000") ? {} : (stryCov_9fa48("7000"), {
                    id
                  }),
                  include: stryMutAct_9fa48("7001") ? {} : (stryCov_9fa48("7001"), {
                    answers: stryMutAct_9fa48("7002") ? false : (stryCov_9fa48("7002"), true)
                  })
                }));
                if (stryMutAct_9fa48("7004") ? false : stryMutAct_9fa48("7003") ? true : (stryCov_9fa48("7003", "7004"), attemptWithAnswers)) {
                  if (stryMutAct_9fa48("7005")) {
                    {}
                  } else {
                    stryCov_9fa48("7005");
                    const correctas = stryMutAct_9fa48("7006") ? attemptWithAnswers.answers.length : (stryCov_9fa48("7006"), attemptWithAnswers.answers.filter(stryMutAct_9fa48("7007") ? () => undefined : (stryCov_9fa48("7007"), a => stryMutAct_9fa48("7010") ? a.esCorrecta !== true : stryMutAct_9fa48("7009") ? false : stryMutAct_9fa48("7008") ? true : (stryCov_9fa48("7008", "7009", "7010"), a.esCorrecta === (stryMutAct_9fa48("7011") ? false : (stryCov_9fa48("7011"), true))))).length);
                    const incorrectas = stryMutAct_9fa48("7012") ? attemptWithAnswers.answers.length : (stryCov_9fa48("7012"), attemptWithAnswers.answers.filter(stryMutAct_9fa48("7013") ? () => undefined : (stryCov_9fa48("7013"), a => stryMutAct_9fa48("7016") ? a.esCorrecta === false || !a.omitida : stryMutAct_9fa48("7015") ? false : stryMutAct_9fa48("7014") ? true : (stryCov_9fa48("7014", "7015", "7016"), (stryMutAct_9fa48("7018") ? a.esCorrecta !== false : stryMutAct_9fa48("7017") ? true : (stryCov_9fa48("7017", "7018"), a.esCorrecta === (stryMutAct_9fa48("7019") ? true : (stryCov_9fa48("7019"), false)))) && (stryMutAct_9fa48("7020") ? a.omitida : (stryCov_9fa48("7020"), !a.omitida))))).length);
                    const omitidas = stryMutAct_9fa48("7021") ? attemptWithAnswers.answers.length : (stryCov_9fa48("7021"), attemptWithAnswers.answers.filter(stryMutAct_9fa48("7022") ? () => undefined : (stryCov_9fa48("7022"), a => stryMutAct_9fa48("7025") ? a.omitida !== true : stryMutAct_9fa48("7024") ? false : stryMutAct_9fa48("7023") ? true : (stryCov_9fa48("7023", "7024", "7025"), a.omitida === (stryMutAct_9fa48("7026") ? false : (stryCov_9fa48("7026"), true))))).length);
                    const total = stryMutAct_9fa48("7029") ? attemptWithAnswers.totalPreguntas && 0 : stryMutAct_9fa48("7028") ? false : stryMutAct_9fa48("7027") ? true : (stryCov_9fa48("7027", "7028", "7029"), attemptWithAnswers.totalPreguntas || 0);
                    const porcentaje = (stryMutAct_9fa48("7033") ? total <= 0 : stryMutAct_9fa48("7032") ? total >= 0 : stryMutAct_9fa48("7031") ? false : stryMutAct_9fa48("7030") ? true : (stryCov_9fa48("7030", "7031", "7032", "7033"), total > 0)) ? stryMutAct_9fa48("7034") ? correctas / total / 100 : (stryCov_9fa48("7034"), (stryMutAct_9fa48("7035") ? correctas * total : (stryCov_9fa48("7035"), correctas / total)) * 100) : 0;
                    updateData.correctas = correctas;
                    updateData.incorrectas = incorrectas;
                    updateData.omitidas = omitidas;
                    updateData.porcentaje = porcentaje;
                  }
                }
              }
            }

            // Actualizar el intento
            const updatedAttempt = await prisma.attempt.update(stryMutAct_9fa48("7036") ? {} : (stryCov_9fa48("7036"), {
              where: stryMutAct_9fa48("7037") ? {} : (stryCov_9fa48("7037"), {
                id
              }),
              data: updateData,
              include: stryMutAct_9fa48("7038") ? {} : (stryCov_9fa48("7038"), {
                exam: stryMutAct_9fa48("7039") ? {} : (stryCov_9fa48("7039"), {
                  include: stryMutAct_9fa48("7040") ? {} : (stryCov_9fa48("7040"), {
                    subject: stryMutAct_9fa48("7041") ? false : (stryCov_9fa48("7041"), true)
                  })
                }),
                answers: stryMutAct_9fa48("7042") ? {} : (stryCov_9fa48("7042"), {
                  include: stryMutAct_9fa48("7043") ? {} : (stryCov_9fa48("7043"), {
                    question: stryMutAct_9fa48("7044") ? {} : (stryCov_9fa48("7044"), {
                      include: stryMutAct_9fa48("7045") ? {} : (stryCov_9fa48("7045"), {
                        options: stryMutAct_9fa48("7046") ? false : (stryCov_9fa48("7046"), true)
                      })
                    }),
                    optionSelected: stryMutAct_9fa48("7047") ? false : (stryCov_9fa48("7047"), true)
                  })
                })
              })
            }));

            // Invalidar caché de intentos del estudiante para reflejar cambios
            await invalidateCachePattern(stryMutAct_9fa48("7048") ? `` : (stryCov_9fa48("7048"), `student:${studentId}:attempts:*`));
            return NextResponse.json(updatedAttempt);
          }
        } catch (error) {
          if (stryMutAct_9fa48("7049")) {
            {}
          } else {
            stryCov_9fa48("7049");
            return handleApiError(error, stryMutAct_9fa48("7050") ? "" : (stryCov_9fa48("7050"), 'Error al actualizar intento'), stryMutAct_9fa48("7051") ? {} : (stryCov_9fa48("7051"), {
              path: stryMutAct_9fa48("7052") ? `` : (stryCov_9fa48("7052"), `/api/attempts/${await params.then(stryMutAct_9fa48("7053") ? () => undefined : (stryCov_9fa48("7053"), p => p.id))}`)
            }));
          }
        }
      }
    });
  }
}