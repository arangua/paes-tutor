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
import { calculateSM2, responseToQuality } from '@/lib/spaced-repetition';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("8340") ? "" : (stryCov_9fa48("8340"), 'nodejs');
const createFlashcardSchema = z.object(stryMutAct_9fa48("8341") ? {} : (stryCov_9fa48("8341"), {
  questionId: z.string().optional(),
  front: stryMutAct_9fa48("8342") ? z.string().max(1) : (stryCov_9fa48("8342"), z.string().min(1)),
  back: stryMutAct_9fa48("8343") ? z.string().max(1) : (stryCov_9fa48("8343"), z.string().min(1))
}));
const reviewFlashcardSchema = z.object(stryMutAct_9fa48("8344") ? {} : (stryCov_9fa48("8344"), {
  flashcardId: stryMutAct_9fa48("8345") ? z.string().max(1) : (stryCov_9fa48("8345"), z.string().min(1)),
  isCorrect: z.boolean(),
  difficulty: z.enum(stryMutAct_9fa48("8346") ? [] : (stryCov_9fa48("8346"), [stryMutAct_9fa48("8347") ? "" : (stryCov_9fa48("8347"), 'easy'), stryMutAct_9fa48("8348") ? "" : (stryCov_9fa48("8348"), 'medium'), stryMutAct_9fa48("8349") ? "" : (stryCov_9fa48("8349"), 'hard')])).optional()
}));
const getFlashcardsQuerySchema = z.object(stryMutAct_9fa48("8350") ? {} : (stryCov_9fa48("8350"), {
  dueOnly: z.enum(stryMutAct_9fa48("8351") ? [] : (stryCov_9fa48("8351"), [stryMutAct_9fa48("8352") ? "" : (stryCov_9fa48("8352"), 'true'), stryMutAct_9fa48("8353") ? "" : (stryCov_9fa48("8353"), 'false')])).optional().transform(stryMutAct_9fa48("8354") ? () => undefined : (stryCov_9fa48("8354"), val => stryMutAct_9fa48("8357") ? val !== 'true' : stryMutAct_9fa48("8356") ? false : stryMutAct_9fa48("8355") ? true : (stryCov_9fa48("8355", "8356", "8357"), val === (stryMutAct_9fa48("8358") ? "" : (stryCov_9fa48("8358"), 'true'))))),
  limit: z.string().optional().transform(stryMutAct_9fa48("8359") ? () => undefined : (stryCov_9fa48("8359"), val => val ? parseInt(val, 10) : undefined)).pipe(stryMutAct_9fa48("8361") ? z.number().int().max(1).max(100).optional() : stryMutAct_9fa48("8360") ? z.number().int().min(1).min(100).optional() : (stryCov_9fa48("8360", "8361"), z.number().int().min(1).max(100).optional())),
  flashcardId: z.string().cuid().optional()
}));
const flashcardIdQuerySchema = z.object(stryMutAct_9fa48("8362") ? {} : (stryCov_9fa48("8362"), {
  flashcardId: stryMutAct_9fa48("8363") ? z.string().cuid().max(1) : (stryCov_9fa48("8363"), z.string().cuid().min(1))
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("8364")) {
    {}
  } else {
    stryCov_9fa48("8364");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8365")) {
        {}
      } else {
        stryCov_9fa48("8365");
        try {
          if (stryMutAct_9fa48("8366")) {
            {}
          } else {
            stryCov_9fa48("8366");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8369") ? false : stryMutAct_9fa48("8368") ? true : stryMutAct_9fa48("8367") ? dbUser?.email : (stryCov_9fa48("8367", "8368", "8369"), !(stryMutAct_9fa48("8370") ? dbUser.email : (stryCov_9fa48("8370"), dbUser?.email)))) {
              if (stryMutAct_9fa48("8371")) {
                {}
              } else {
                stryCov_9fa48("8371");
                return NextResponse.json(stryMutAct_9fa48("8372") ? {} : (stryCov_9fa48("8372"), {
                  error: stryMutAct_9fa48("8373") ? "" : (stryCov_9fa48("8373"), 'No autorizado')
                }), stryMutAct_9fa48("8374") ? {} : (stryCov_9fa48("8374"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("8377") ? false : stryMutAct_9fa48("8376") ? true : stryMutAct_9fa48("8375") ? dbUser.student : (stryCov_9fa48("8375", "8376", "8377"), !dbUser.student)) {
              if (stryMutAct_9fa48("8378")) {
                {}
              } else {
                stryCov_9fa48("8378");
                return NextResponse.json(stryMutAct_9fa48("8379") ? {} : (stryCov_9fa48("8379"), {
                  error: stryMutAct_9fa48("8380") ? "" : (stryCov_9fa48("8380"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8381") ? {} : (stryCov_9fa48("8381"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = getFlashcardsQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("8384") ? false : stryMutAct_9fa48("8383") ? true : stryMutAct_9fa48("8382") ? queryValidation.success : (stryCov_9fa48("8382", "8383", "8384"), !queryValidation.success)) {
              if (stryMutAct_9fa48("8385")) {
                {}
              } else {
                stryCov_9fa48("8385");
                return NextResponse.json(stryMutAct_9fa48("8386") ? {} : (stryCov_9fa48("8386"), {
                  error: stryMutAct_9fa48("8387") ? "" : (stryCov_9fa48("8387"), 'Parámetros de consulta inválidos'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("8388") ? {} : (stryCov_9fa48("8388"), {
                  status: 400
                }));
              }
            }
            const {
              dueOnly,
              limit,
              flashcardId
            } = queryValidation.data;
            const where: {
              studentId: string;
              nextReview?: {
                lte: Date;
              };
              id?: string;
            } = stryMutAct_9fa48("8389") ? {} : (stryCov_9fa48("8389"), {
              studentId: dbUser.student.id
            });
            if (stryMutAct_9fa48("8391") ? false : stryMutAct_9fa48("8390") ? true : (stryCov_9fa48("8390", "8391"), dueOnly)) {
              if (stryMutAct_9fa48("8392")) {
                {}
              } else {
                stryCov_9fa48("8392");
                where.nextReview = stryMutAct_9fa48("8393") ? {} : (stryCov_9fa48("8393"), {
                  lte: new Date()
                });
              }
            }
            if (stryMutAct_9fa48("8395") ? false : stryMutAct_9fa48("8394") ? true : (stryCov_9fa48("8394", "8395"), flashcardId)) {
              if (stryMutAct_9fa48("8396")) {
                {}
              } else {
                stryCov_9fa48("8396");
                where.id = flashcardId;
              }
            }
            const flashcards = await prisma.flashcard.findMany(stryMutAct_9fa48("8397") ? {} : (stryCov_9fa48("8397"), {
              where,
              include: stryMutAct_9fa48("8398") ? {} : (stryCov_9fa48("8398"), {
                question: stryMutAct_9fa48("8399") ? {} : (stryCov_9fa48("8399"), {
                  include: stryMutAct_9fa48("8400") ? {} : (stryCov_9fa48("8400"), {
                    subject: stryMutAct_9fa48("8401") ? {} : (stryCov_9fa48("8401"), {
                      select: stryMutAct_9fa48("8402") ? {} : (stryCov_9fa48("8402"), {
                        nombre: stryMutAct_9fa48("8403") ? false : (stryCov_9fa48("8403"), true),
                        codigo: stryMutAct_9fa48("8404") ? false : (stryCov_9fa48("8404"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("8405") ? {} : (stryCov_9fa48("8405"), {
                      select: stryMutAct_9fa48("8406") ? {} : (stryCov_9fa48("8406"), {
                        nombre: stryMutAct_9fa48("8407") ? false : (stryCov_9fa48("8407"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: dueOnly ? stryMutAct_9fa48("8408") ? {} : (stryCov_9fa48("8408"), {
                nextReview: stryMutAct_9fa48("8409") ? "" : (stryCov_9fa48("8409"), 'asc')
              }) : stryMutAct_9fa48("8410") ? {} : (stryCov_9fa48("8410"), {
                createdAt: stryMutAct_9fa48("8411") ? "" : (stryCov_9fa48("8411"), 'desc')
              }),
              take: limit
            }));
            return NextResponse.json(stryMutAct_9fa48("8412") ? {} : (stryCov_9fa48("8412"), {
              flashcards
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8413")) {
            {}
          } else {
            stryCov_9fa48("8413");
            logger.error(stryMutAct_9fa48("8414") ? {} : (stryCov_9fa48("8414"), {
              error,
              context: stryMutAct_9fa48("8415") ? "" : (stryCov_9fa48("8415"), 'flashcards/GET')
            }), stryMutAct_9fa48("8416") ? "" : (stryCov_9fa48("8416"), 'Error al obtener flashcards'));
            return NextResponse.json(stryMutAct_9fa48("8417") ? {} : (stryCov_9fa48("8417"), {
              error: stryMutAct_9fa48("8418") ? "" : (stryCov_9fa48("8418"), 'Error al obtener flashcards')
            }), stryMutAct_9fa48("8419") ? {} : (stryCov_9fa48("8419"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("8420")) {
    {}
  } else {
    stryCov_9fa48("8420");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8421")) {
        {}
      } else {
        stryCov_9fa48("8421");
        try {
          if (stryMutAct_9fa48("8422")) {
            {}
          } else {
            stryCov_9fa48("8422");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8425") ? false : stryMutAct_9fa48("8424") ? true : stryMutAct_9fa48("8423") ? dbUser?.email : (stryCov_9fa48("8423", "8424", "8425"), !(stryMutAct_9fa48("8426") ? dbUser.email : (stryCov_9fa48("8426"), dbUser?.email)))) {
              if (stryMutAct_9fa48("8427")) {
                {}
              } else {
                stryCov_9fa48("8427");
                return NextResponse.json(stryMutAct_9fa48("8428") ? {} : (stryCov_9fa48("8428"), {
                  error: stryMutAct_9fa48("8429") ? "" : (stryCov_9fa48("8429"), 'No autorizado')
                }), stryMutAct_9fa48("8430") ? {} : (stryCov_9fa48("8430"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("8433") ? false : stryMutAct_9fa48("8432") ? true : stryMutAct_9fa48("8431") ? dbUser.student : (stryCov_9fa48("8431", "8432", "8433"), !dbUser.student)) {
              if (stryMutAct_9fa48("8434")) {
                {}
              } else {
                stryCov_9fa48("8434");
                return NextResponse.json(stryMutAct_9fa48("8435") ? {} : (stryCov_9fa48("8435"), {
                  error: stryMutAct_9fa48("8436") ? "" : (stryCov_9fa48("8436"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8437") ? {} : (stryCov_9fa48("8437"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const validation = createFlashcardSchema.safeParse(body);
            if (stryMutAct_9fa48("8440") ? false : stryMutAct_9fa48("8439") ? true : stryMutAct_9fa48("8438") ? validation.success : (stryCov_9fa48("8438", "8439", "8440"), !validation.success)) {
              if (stryMutAct_9fa48("8441")) {
                {}
              } else {
                stryCov_9fa48("8441");
                return NextResponse.json(stryMutAct_9fa48("8442") ? {} : (stryCov_9fa48("8442"), {
                  error: stryMutAct_9fa48("8443") ? "" : (stryCov_9fa48("8443"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("8444") ? {} : (stryCov_9fa48("8444"), {
                  status: 400
                }));
              }
            }
            const {
              questionId,
              front,
              back
            } = validation.data;

            // Si hay questionId, verificar que existe
            if (stryMutAct_9fa48("8446") ? false : stryMutAct_9fa48("8445") ? true : (stryCov_9fa48("8445", "8446"), questionId)) {
              if (stryMutAct_9fa48("8447")) {
                {}
              } else {
                stryCov_9fa48("8447");
                const question = await prisma.question.findUnique(stryMutAct_9fa48("8448") ? {} : (stryCov_9fa48("8448"), {
                  where: stryMutAct_9fa48("8449") ? {} : (stryCov_9fa48("8449"), {
                    id: questionId
                  })
                }));
                if (stryMutAct_9fa48("8452") ? false : stryMutAct_9fa48("8451") ? true : stryMutAct_9fa48("8450") ? question : (stryCov_9fa48("8450", "8451", "8452"), !question)) {
                  if (stryMutAct_9fa48("8453")) {
                    {}
                  } else {
                    stryCov_9fa48("8453");
                    return NextResponse.json(stryMutAct_9fa48("8454") ? {} : (stryCov_9fa48("8454"), {
                      error: stryMutAct_9fa48("8455") ? "" : (stryCov_9fa48("8455"), 'Pregunta no encontrada')
                    }), stryMutAct_9fa48("8456") ? {} : (stryCov_9fa48("8456"), {
                      status: 404
                    }));
                  }
                }
              }
            }
            const flashcard = await prisma.flashcard.create(stryMutAct_9fa48("8457") ? {} : (stryCov_9fa48("8457"), {
              data: stryMutAct_9fa48("8458") ? {} : (stryCov_9fa48("8458"), {
                studentId: dbUser.student.id,
                questionId: stryMutAct_9fa48("8461") ? questionId && null : stryMutAct_9fa48("8460") ? false : stryMutAct_9fa48("8459") ? true : (stryCov_9fa48("8459", "8460", "8461"), questionId || null),
                front,
                back,
                difficulty: 2.5,
                easeFactor: 2.5,
                interval: 1,
                lastReview: new Date(),
                nextReview: new Date() // Disponible inmediatamente
              }),
              include: stryMutAct_9fa48("8462") ? {} : (stryCov_9fa48("8462"), {
                question: stryMutAct_9fa48("8463") ? {} : (stryCov_9fa48("8463"), {
                  include: stryMutAct_9fa48("8464") ? {} : (stryCov_9fa48("8464"), {
                    subject: stryMutAct_9fa48("8465") ? {} : (stryCov_9fa48("8465"), {
                      select: stryMutAct_9fa48("8466") ? {} : (stryCov_9fa48("8466"), {
                        nombre: stryMutAct_9fa48("8467") ? false : (stryCov_9fa48("8467"), true)
                      })
                    })
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("8468") ? {} : (stryCov_9fa48("8468"), {
              flashcard
            }), stryMutAct_9fa48("8469") ? {} : (stryCov_9fa48("8469"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8470")) {
            {}
          } else {
            stryCov_9fa48("8470");
            logger.error(stryMutAct_9fa48("8471") ? {} : (stryCov_9fa48("8471"), {
              error,
              context: stryMutAct_9fa48("8472") ? "" : (stryCov_9fa48("8472"), 'flashcards/POST')
            }), stryMutAct_9fa48("8473") ? "" : (stryCov_9fa48("8473"), 'Error al crear flashcard'));
            return NextResponse.json(stryMutAct_9fa48("8474") ? {} : (stryCov_9fa48("8474"), {
              error: stryMutAct_9fa48("8475") ? "" : (stryCov_9fa48("8475"), 'Error al crear flashcard')
            }), stryMutAct_9fa48("8476") ? {} : (stryCov_9fa48("8476"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function PUT(request: NextRequest) {
  if (stryMutAct_9fa48("8477")) {
    {}
  } else {
    stryCov_9fa48("8477");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8478")) {
        {}
      } else {
        stryCov_9fa48("8478");
        try {
          if (stryMutAct_9fa48("8479")) {
            {}
          } else {
            stryCov_9fa48("8479");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8482") ? false : stryMutAct_9fa48("8481") ? true : stryMutAct_9fa48("8480") ? dbUser?.email : (stryCov_9fa48("8480", "8481", "8482"), !(stryMutAct_9fa48("8483") ? dbUser.email : (stryCov_9fa48("8483"), dbUser?.email)))) {
              if (stryMutAct_9fa48("8484")) {
                {}
              } else {
                stryCov_9fa48("8484");
                return NextResponse.json(stryMutAct_9fa48("8485") ? {} : (stryCov_9fa48("8485"), {
                  error: stryMutAct_9fa48("8486") ? "" : (stryCov_9fa48("8486"), 'No autorizado')
                }), stryMutAct_9fa48("8487") ? {} : (stryCov_9fa48("8487"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("8490") ? false : stryMutAct_9fa48("8489") ? true : stryMutAct_9fa48("8488") ? dbUser.student : (stryCov_9fa48("8488", "8489", "8490"), !dbUser.student)) {
              if (stryMutAct_9fa48("8491")) {
                {}
              } else {
                stryCov_9fa48("8491");
                return NextResponse.json(stryMutAct_9fa48("8492") ? {} : (stryCov_9fa48("8492"), {
                  error: stryMutAct_9fa48("8493") ? "" : (stryCov_9fa48("8493"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8494") ? {} : (stryCov_9fa48("8494"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const validation = reviewFlashcardSchema.safeParse(body);
            if (stryMutAct_9fa48("8497") ? false : stryMutAct_9fa48("8496") ? true : stryMutAct_9fa48("8495") ? validation.success : (stryCov_9fa48("8495", "8496", "8497"), !validation.success)) {
              if (stryMutAct_9fa48("8498")) {
                {}
              } else {
                stryCov_9fa48("8498");
                return NextResponse.json(stryMutAct_9fa48("8499") ? {} : (stryCov_9fa48("8499"), {
                  error: stryMutAct_9fa48("8500") ? "" : (stryCov_9fa48("8500"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("8501") ? {} : (stryCov_9fa48("8501"), {
                  status: 400
                }));
              }
            }
            const {
              flashcardId,
              isCorrect,
              difficulty = stryMutAct_9fa48("8502") ? "" : (stryCov_9fa48("8502"), 'medium')
            } = validation.data;

            // Obtener flashcard
            const flashcard = await prisma.flashcard.findFirst(stryMutAct_9fa48("8503") ? {} : (stryCov_9fa48("8503"), {
              where: stryMutAct_9fa48("8504") ? {} : (stryCov_9fa48("8504"), {
                id: flashcardId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("8507") ? false : stryMutAct_9fa48("8506") ? true : stryMutAct_9fa48("8505") ? flashcard : (stryCov_9fa48("8505", "8506", "8507"), !flashcard)) {
              if (stryMutAct_9fa48("8508")) {
                {}
              } else {
                stryCov_9fa48("8508");
                return NextResponse.json(stryMutAct_9fa48("8509") ? {} : (stryCov_9fa48("8509"), {
                  error: stryMutAct_9fa48("8510") ? "" : (stryCov_9fa48("8510"), 'Flashcard no encontrada')
                }), stryMutAct_9fa48("8511") ? {} : (stryCov_9fa48("8511"), {
                  status: 404
                }));
              }
            }

            // Calcular nuevo intervalo usando SM-2
            const quality = responseToQuality(isCorrect, difficulty);
            const sm2Result = calculateSM2(stryMutAct_9fa48("8512") ? {} : (stryCov_9fa48("8512"), {
              quality,
              easeFactor: flashcard.easeFactor,
              interval: flashcard.interval,
              reviewCount: flashcard.reviewCount
            }));

            // Actualizar flashcard
            const updated = await prisma.flashcard.update(stryMutAct_9fa48("8513") ? {} : (stryCov_9fa48("8513"), {
              where: stryMutAct_9fa48("8514") ? {} : (stryCov_9fa48("8514"), {
                id: flashcardId
              }),
              data: stryMutAct_9fa48("8515") ? {} : (stryCov_9fa48("8515"), {
                difficulty: sm2Result.easeFactor,
                // Actualizar difficulty con easeFactor
                easeFactor: sm2Result.easeFactor,
                interval: sm2Result.interval,
                reviewCount: sm2Result.reviewCount,
                lastReview: new Date(),
                nextReview: sm2Result.nextReview
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("8516") ? {} : (stryCov_9fa48("8516"), {
              flashcard: updated
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8517")) {
            {}
          } else {
            stryCov_9fa48("8517");
            logger.error(stryMutAct_9fa48("8518") ? {} : (stryCov_9fa48("8518"), {
              error,
              context: stryMutAct_9fa48("8519") ? "" : (stryCov_9fa48("8519"), 'flashcards/PUT')
            }), stryMutAct_9fa48("8520") ? "" : (stryCov_9fa48("8520"), 'Error al actualizar flashcard'));
            return NextResponse.json(stryMutAct_9fa48("8521") ? {} : (stryCov_9fa48("8521"), {
              error: stryMutAct_9fa48("8522") ? "" : (stryCov_9fa48("8522"), 'Error al actualizar flashcard')
            }), stryMutAct_9fa48("8523") ? {} : (stryCov_9fa48("8523"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function DELETE(request: NextRequest) {
  if (stryMutAct_9fa48("8524")) {
    {}
  } else {
    stryCov_9fa48("8524");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8525")) {
        {}
      } else {
        stryCov_9fa48("8525");
        try {
          if (stryMutAct_9fa48("8526")) {
            {}
          } else {
            stryCov_9fa48("8526");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8529") ? false : stryMutAct_9fa48("8528") ? true : stryMutAct_9fa48("8527") ? dbUser?.email : (stryCov_9fa48("8527", "8528", "8529"), !(stryMutAct_9fa48("8530") ? dbUser.email : (stryCov_9fa48("8530"), dbUser?.email)))) {
              if (stryMutAct_9fa48("8531")) {
                {}
              } else {
                stryCov_9fa48("8531");
                return NextResponse.json(stryMutAct_9fa48("8532") ? {} : (stryCov_9fa48("8532"), {
                  error: stryMutAct_9fa48("8533") ? "" : (stryCov_9fa48("8533"), 'No autorizado')
                }), stryMutAct_9fa48("8534") ? {} : (stryCov_9fa48("8534"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("8537") ? false : stryMutAct_9fa48("8536") ? true : stryMutAct_9fa48("8535") ? dbUser.student : (stryCov_9fa48("8535", "8536", "8537"), !dbUser.student)) {
              if (stryMutAct_9fa48("8538")) {
                {}
              } else {
                stryCov_9fa48("8538");
                return NextResponse.json(stryMutAct_9fa48("8539") ? {} : (stryCov_9fa48("8539"), {
                  error: stryMutAct_9fa48("8540") ? "" : (stryCov_9fa48("8540"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8541") ? {} : (stryCov_9fa48("8541"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const flashcardId = searchParams.get(stryMutAct_9fa48("8542") ? "" : (stryCov_9fa48("8542"), 'flashcardId'));
            if (stryMutAct_9fa48("8545") ? false : stryMutAct_9fa48("8544") ? true : stryMutAct_9fa48("8543") ? flashcardId : (stryCov_9fa48("8543", "8544", "8545"), !flashcardId)) {
              if (stryMutAct_9fa48("8546")) {
                {}
              } else {
                stryCov_9fa48("8546");
                return NextResponse.json(stryMutAct_9fa48("8547") ? {} : (stryCov_9fa48("8547"), {
                  error: stryMutAct_9fa48("8548") ? "" : (stryCov_9fa48("8548"), 'ID de flashcard requerido')
                }), stryMutAct_9fa48("8549") ? {} : (stryCov_9fa48("8549"), {
                  status: 400
                }));
              }
            }
            const flashcard = await prisma.flashcard.findFirst(stryMutAct_9fa48("8550") ? {} : (stryCov_9fa48("8550"), {
              where: stryMutAct_9fa48("8551") ? {} : (stryCov_9fa48("8551"), {
                id: flashcardId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("8554") ? false : stryMutAct_9fa48("8553") ? true : stryMutAct_9fa48("8552") ? flashcard : (stryCov_9fa48("8552", "8553", "8554"), !flashcard)) {
              if (stryMutAct_9fa48("8555")) {
                {}
              } else {
                stryCov_9fa48("8555");
                return NextResponse.json(stryMutAct_9fa48("8556") ? {} : (stryCov_9fa48("8556"), {
                  error: stryMutAct_9fa48("8557") ? "" : (stryCov_9fa48("8557"), 'Flashcard no encontrada')
                }), stryMutAct_9fa48("8558") ? {} : (stryCov_9fa48("8558"), {
                  status: 404
                }));
              }
            }
            await prisma.flashcard.delete(stryMutAct_9fa48("8559") ? {} : (stryCov_9fa48("8559"), {
              where: stryMutAct_9fa48("8560") ? {} : (stryCov_9fa48("8560"), {
                id: flashcardId
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("8561") ? {} : (stryCov_9fa48("8561"), {
              message: stryMutAct_9fa48("8562") ? "" : (stryCov_9fa48("8562"), 'Flashcard eliminada correctamente')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8563")) {
            {}
          } else {
            stryCov_9fa48("8563");
            logger.error(stryMutAct_9fa48("8564") ? {} : (stryCov_9fa48("8564"), {
              error,
              context: stryMutAct_9fa48("8565") ? "" : (stryCov_9fa48("8565"), 'flashcards/DELETE')
            }), stryMutAct_9fa48("8566") ? "" : (stryCov_9fa48("8566"), 'Error al eliminar flashcard'));
            return NextResponse.json(stryMutAct_9fa48("8567") ? {} : (stryCov_9fa48("8567"), {
              error: stryMutAct_9fa48("8568") ? "" : (stryCov_9fa48("8568"), 'Error al eliminar flashcard')
            }), stryMutAct_9fa48("8569") ? {} : (stryCov_9fa48("8569"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}