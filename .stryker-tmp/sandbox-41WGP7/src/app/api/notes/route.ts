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
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("8859") ? "" : (stryCov_9fa48("8859"), 'nodejs');
const createNoteSchema = z.object(stryMutAct_9fa48("8860") ? {} : (stryCov_9fa48("8860"), {
  questionId: z.string().optional(),
  topicId: z.string().optional(),
  title: stryMutAct_9fa48("8861") ? z.string().max(1) : (stryCov_9fa48("8861"), z.string().min(1)),
  content: stryMutAct_9fa48("8862") ? z.string().max(1) : (stryCov_9fa48("8862"), z.string().min(1)),
  tags: z.string().optional()
}));
const updateNoteSchema = z.object(stryMutAct_9fa48("8863") ? {} : (stryCov_9fa48("8863"), {
  title: stryMutAct_9fa48("8864") ? z.string().max(1).optional() : (stryCov_9fa48("8864"), z.string().min(1).optional()),
  content: stryMutAct_9fa48("8865") ? z.string().max(1).optional() : (stryCov_9fa48("8865"), z.string().min(1).optional()),
  tags: z.string().optional()
}));
const getNotesQuerySchema = z.object(stryMutAct_9fa48("8866") ? {} : (stryCov_9fa48("8866"), {
  questionId: z.string().cuid().optional(),
  topicId: z.string().cuid().optional(),
  search: stryMutAct_9fa48("8868") ? z.string().max(1).max(200).optional() : stryMutAct_9fa48("8867") ? z.string().min(1).min(200).optional() : (stryCov_9fa48("8867", "8868"), z.string().min(1).max(200).optional())
}));
const noteIdQuerySchema = z.object(stryMutAct_9fa48("8869") ? {} : (stryCov_9fa48("8869"), {
  noteId: stryMutAct_9fa48("8870") ? z.string().cuid().max(1) : (stryCov_9fa48("8870"), z.string().cuid().min(1))
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("8871")) {
    {}
  } else {
    stryCov_9fa48("8871");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8872")) {
        {}
      } else {
        stryCov_9fa48("8872");
        try {
          if (stryMutAct_9fa48("8873")) {
            {}
          } else {
            stryCov_9fa48("8873");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8876") ? false : stryMutAct_9fa48("8875") ? true : stryMutAct_9fa48("8874") ? dbUser?.email : (stryCov_9fa48("8874", "8875", "8876"), !(stryMutAct_9fa48("8877") ? dbUser.email : (stryCov_9fa48("8877"), dbUser?.email)))) {
              if (stryMutAct_9fa48("8878")) {
                {}
              } else {
                stryCov_9fa48("8878");
                return NextResponse.json(stryMutAct_9fa48("8879") ? {} : (stryCov_9fa48("8879"), {
                  error: stryMutAct_9fa48("8880") ? "" : (stryCov_9fa48("8880"), 'No autorizado')
                }), stryMutAct_9fa48("8881") ? {} : (stryCov_9fa48("8881"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("8884") ? false : stryMutAct_9fa48("8883") ? true : stryMutAct_9fa48("8882") ? dbUser.student : (stryCov_9fa48("8882", "8883", "8884"), !dbUser.student)) {
              if (stryMutAct_9fa48("8885")) {
                {}
              } else {
                stryCov_9fa48("8885");
                return NextResponse.json(stryMutAct_9fa48("8886") ? {} : (stryCov_9fa48("8886"), {
                  error: stryMutAct_9fa48("8887") ? "" : (stryCov_9fa48("8887"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8888") ? {} : (stryCov_9fa48("8888"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = getNotesQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("8891") ? false : stryMutAct_9fa48("8890") ? true : stryMutAct_9fa48("8889") ? queryValidation.success : (stryCov_9fa48("8889", "8890", "8891"), !queryValidation.success)) {
              if (stryMutAct_9fa48("8892")) {
                {}
              } else {
                stryCov_9fa48("8892");
                return NextResponse.json(stryMutAct_9fa48("8893") ? {} : (stryCov_9fa48("8893"), {
                  error: stryMutAct_9fa48("8894") ? "" : (stryCov_9fa48("8894"), 'Parámetros de consulta inválidos'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("8895") ? {} : (stryCov_9fa48("8895"), {
                  status: 400
                }));
              }
            }
            const {
              questionId,
              topicId,
              search
            } = queryValidation.data;
            const where: {
              studentId: string;
              questionId?: string | null;
              topicId?: string | null;
              OR?: Array<{
                title?: {
                  contains: string;
                };
                content?: {
                  contains: string;
                };
              }>;
            } = stryMutAct_9fa48("8896") ? {} : (stryCov_9fa48("8896"), {
              studentId: dbUser.student.id
            });
            if (stryMutAct_9fa48("8898") ? false : stryMutAct_9fa48("8897") ? true : (stryCov_9fa48("8897", "8898"), questionId)) {
              if (stryMutAct_9fa48("8899")) {
                {}
              } else {
                stryCov_9fa48("8899");
                where.questionId = questionId;
              }
            }
            if (stryMutAct_9fa48("8901") ? false : stryMutAct_9fa48("8900") ? true : (stryCov_9fa48("8900", "8901"), topicId)) {
              if (stryMutAct_9fa48("8902")) {
                {}
              } else {
                stryCov_9fa48("8902");
                where.topicId = topicId;
              }
            }
            if (stryMutAct_9fa48("8904") ? false : stryMutAct_9fa48("8903") ? true : (stryCov_9fa48("8903", "8904"), search)) {
              if (stryMutAct_9fa48("8905")) {
                {}
              } else {
                stryCov_9fa48("8905");
                where.OR = stryMutAct_9fa48("8906") ? [] : (stryCov_9fa48("8906"), [stryMutAct_9fa48("8907") ? {} : (stryCov_9fa48("8907"), {
                  title: stryMutAct_9fa48("8908") ? {} : (stryCov_9fa48("8908"), {
                    contains: search
                  })
                }), stryMutAct_9fa48("8909") ? {} : (stryCov_9fa48("8909"), {
                  content: stryMutAct_9fa48("8910") ? {} : (stryCov_9fa48("8910"), {
                    contains: search
                  })
                })]);
              }
            }
            const notes = await prisma.studyNote.findMany(stryMutAct_9fa48("8911") ? {} : (stryCov_9fa48("8911"), {
              where,
              include: stryMutAct_9fa48("8912") ? {} : (stryCov_9fa48("8912"), {
                question: stryMutAct_9fa48("8913") ? {} : (stryCov_9fa48("8913"), {
                  include: stryMutAct_9fa48("8914") ? {} : (stryCov_9fa48("8914"), {
                    subject: stryMutAct_9fa48("8915") ? {} : (stryCov_9fa48("8915"), {
                      select: stryMutAct_9fa48("8916") ? {} : (stryCov_9fa48("8916"), {
                        nombre: stryMutAct_9fa48("8917") ? false : (stryCov_9fa48("8917"), true),
                        codigo: stryMutAct_9fa48("8918") ? false : (stryCov_9fa48("8918"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("8919") ? {} : (stryCov_9fa48("8919"), {
                      select: stryMutAct_9fa48("8920") ? {} : (stryCov_9fa48("8920"), {
                        nombre: stryMutAct_9fa48("8921") ? false : (stryCov_9fa48("8921"), true)
                      })
                    })
                  })
                }),
                topic: stryMutAct_9fa48("8922") ? {} : (stryCov_9fa48("8922"), {
                  include: stryMutAct_9fa48("8923") ? {} : (stryCov_9fa48("8923"), {
                    subject: stryMutAct_9fa48("8924") ? {} : (stryCov_9fa48("8924"), {
                      select: stryMutAct_9fa48("8925") ? {} : (stryCov_9fa48("8925"), {
                        nombre: stryMutAct_9fa48("8926") ? false : (stryCov_9fa48("8926"), true),
                        codigo: stryMutAct_9fa48("8927") ? false : (stryCov_9fa48("8927"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("8928") ? {} : (stryCov_9fa48("8928"), {
                updatedAt: stryMutAct_9fa48("8929") ? "" : (stryCov_9fa48("8929"), 'desc')
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("8930") ? {} : (stryCov_9fa48("8930"), {
              notes
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8931")) {
            {}
          } else {
            stryCov_9fa48("8931");
            logger.error(stryMutAct_9fa48("8932") ? {} : (stryCov_9fa48("8932"), {
              error,
              context: stryMutAct_9fa48("8933") ? "" : (stryCov_9fa48("8933"), 'notes/GET')
            }), stryMutAct_9fa48("8934") ? "" : (stryCov_9fa48("8934"), 'Error al obtener notas'));
            return NextResponse.json(stryMutAct_9fa48("8935") ? {} : (stryCov_9fa48("8935"), {
              error: stryMutAct_9fa48("8936") ? "" : (stryCov_9fa48("8936"), 'Error al obtener notas')
            }), stryMutAct_9fa48("8937") ? {} : (stryCov_9fa48("8937"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("8938")) {
    {}
  } else {
    stryCov_9fa48("8938");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8939")) {
        {}
      } else {
        stryCov_9fa48("8939");
        try {
          if (stryMutAct_9fa48("8940")) {
            {}
          } else {
            stryCov_9fa48("8940");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8943") ? false : stryMutAct_9fa48("8942") ? true : stryMutAct_9fa48("8941") ? dbUser?.email : (stryCov_9fa48("8941", "8942", "8943"), !(stryMutAct_9fa48("8944") ? dbUser.email : (stryCov_9fa48("8944"), dbUser?.email)))) {
              if (stryMutAct_9fa48("8945")) {
                {}
              } else {
                stryCov_9fa48("8945");
                return NextResponse.json(stryMutAct_9fa48("8946") ? {} : (stryCov_9fa48("8946"), {
                  error: stryMutAct_9fa48("8947") ? "" : (stryCov_9fa48("8947"), 'No autorizado')
                }), stryMutAct_9fa48("8948") ? {} : (stryCov_9fa48("8948"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("8951") ? false : stryMutAct_9fa48("8950") ? true : stryMutAct_9fa48("8949") ? dbUser.student : (stryCov_9fa48("8949", "8950", "8951"), !dbUser.student)) {
              if (stryMutAct_9fa48("8952")) {
                {}
              } else {
                stryCov_9fa48("8952");
                return NextResponse.json(stryMutAct_9fa48("8953") ? {} : (stryCov_9fa48("8953"), {
                  error: stryMutAct_9fa48("8954") ? "" : (stryCov_9fa48("8954"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("8955") ? {} : (stryCov_9fa48("8955"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const validation = createNoteSchema.safeParse(body);
            if (stryMutAct_9fa48("8958") ? false : stryMutAct_9fa48("8957") ? true : stryMutAct_9fa48("8956") ? validation.success : (stryCov_9fa48("8956", "8957", "8958"), !validation.success)) {
              if (stryMutAct_9fa48("8959")) {
                {}
              } else {
                stryCov_9fa48("8959");
                return NextResponse.json(stryMutAct_9fa48("8960") ? {} : (stryCov_9fa48("8960"), {
                  error: stryMutAct_9fa48("8961") ? "" : (stryCov_9fa48("8961"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("8962") ? {} : (stryCov_9fa48("8962"), {
                  status: 400
                }));
              }
            }
            const {
              questionId,
              topicId,
              title,
              content,
              tags
            } = validation.data;

            // Verificar que questionId o topicId existe si se proporciona
            if (stryMutAct_9fa48("8964") ? false : stryMutAct_9fa48("8963") ? true : (stryCov_9fa48("8963", "8964"), questionId)) {
              if (stryMutAct_9fa48("8965")) {
                {}
              } else {
                stryCov_9fa48("8965");
                const question = await prisma.question.findUnique(stryMutAct_9fa48("8966") ? {} : (stryCov_9fa48("8966"), {
                  where: stryMutAct_9fa48("8967") ? {} : (stryCov_9fa48("8967"), {
                    id: questionId
                  })
                }));
                if (stryMutAct_9fa48("8970") ? false : stryMutAct_9fa48("8969") ? true : stryMutAct_9fa48("8968") ? question : (stryCov_9fa48("8968", "8969", "8970"), !question)) {
                  if (stryMutAct_9fa48("8971")) {
                    {}
                  } else {
                    stryCov_9fa48("8971");
                    return NextResponse.json(stryMutAct_9fa48("8972") ? {} : (stryCov_9fa48("8972"), {
                      error: stryMutAct_9fa48("8973") ? "" : (stryCov_9fa48("8973"), 'Pregunta no encontrada')
                    }), stryMutAct_9fa48("8974") ? {} : (stryCov_9fa48("8974"), {
                      status: 404
                    }));
                  }
                }
              }
            }
            if (stryMutAct_9fa48("8976") ? false : stryMutAct_9fa48("8975") ? true : (stryCov_9fa48("8975", "8976"), topicId)) {
              if (stryMutAct_9fa48("8977")) {
                {}
              } else {
                stryCov_9fa48("8977");
                const topic = await prisma.topic.findUnique(stryMutAct_9fa48("8978") ? {} : (stryCov_9fa48("8978"), {
                  where: stryMutAct_9fa48("8979") ? {} : (stryCov_9fa48("8979"), {
                    id: topicId
                  })
                }));
                if (stryMutAct_9fa48("8982") ? false : stryMutAct_9fa48("8981") ? true : stryMutAct_9fa48("8980") ? topic : (stryCov_9fa48("8980", "8981", "8982"), !topic)) {
                  if (stryMutAct_9fa48("8983")) {
                    {}
                  } else {
                    stryCov_9fa48("8983");
                    return NextResponse.json(stryMutAct_9fa48("8984") ? {} : (stryCov_9fa48("8984"), {
                      error: stryMutAct_9fa48("8985") ? "" : (stryCov_9fa48("8985"), 'Tema no encontrado')
                    }), stryMutAct_9fa48("8986") ? {} : (stryCov_9fa48("8986"), {
                      status: 404
                    }));
                  }
                }
              }
            }
            const note = await prisma.studyNote.create(stryMutAct_9fa48("8987") ? {} : (stryCov_9fa48("8987"), {
              data: stryMutAct_9fa48("8988") ? {} : (stryCov_9fa48("8988"), {
                studentId: dbUser.student.id,
                questionId: stryMutAct_9fa48("8991") ? questionId && null : stryMutAct_9fa48("8990") ? false : stryMutAct_9fa48("8989") ? true : (stryCov_9fa48("8989", "8990", "8991"), questionId || null),
                topicId: stryMutAct_9fa48("8994") ? topicId && null : stryMutAct_9fa48("8993") ? false : stryMutAct_9fa48("8992") ? true : (stryCov_9fa48("8992", "8993", "8994"), topicId || null),
                title,
                content,
                tags: stryMutAct_9fa48("8997") ? tags && null : stryMutAct_9fa48("8996") ? false : stryMutAct_9fa48("8995") ? true : (stryCov_9fa48("8995", "8996", "8997"), tags || null)
              }),
              include: stryMutAct_9fa48("8998") ? {} : (stryCov_9fa48("8998"), {
                question: stryMutAct_9fa48("8999") ? {} : (stryCov_9fa48("8999"), {
                  include: stryMutAct_9fa48("9000") ? {} : (stryCov_9fa48("9000"), {
                    subject: stryMutAct_9fa48("9001") ? {} : (stryCov_9fa48("9001"), {
                      select: stryMutAct_9fa48("9002") ? {} : (stryCov_9fa48("9002"), {
                        nombre: stryMutAct_9fa48("9003") ? false : (stryCov_9fa48("9003"), true)
                      })
                    })
                  })
                }),
                topic: stryMutAct_9fa48("9004") ? {} : (stryCov_9fa48("9004"), {
                  include: stryMutAct_9fa48("9005") ? {} : (stryCov_9fa48("9005"), {
                    subject: stryMutAct_9fa48("9006") ? {} : (stryCov_9fa48("9006"), {
                      select: stryMutAct_9fa48("9007") ? {} : (stryCov_9fa48("9007"), {
                        nombre: stryMutAct_9fa48("9008") ? false : (stryCov_9fa48("9008"), true)
                      })
                    })
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9009") ? {} : (stryCov_9fa48("9009"), {
              note
            }), stryMutAct_9fa48("9010") ? {} : (stryCov_9fa48("9010"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9011")) {
            {}
          } else {
            stryCov_9fa48("9011");
            logger.error(stryMutAct_9fa48("9012") ? {} : (stryCov_9fa48("9012"), {
              error,
              context: stryMutAct_9fa48("9013") ? "" : (stryCov_9fa48("9013"), 'notes/POST')
            }), stryMutAct_9fa48("9014") ? "" : (stryCov_9fa48("9014"), 'Error al crear nota'));
            return NextResponse.json(stryMutAct_9fa48("9015") ? {} : (stryCov_9fa48("9015"), {
              error: stryMutAct_9fa48("9016") ? "" : (stryCov_9fa48("9016"), 'Error al crear nota')
            }), stryMutAct_9fa48("9017") ? {} : (stryCov_9fa48("9017"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function PUT(request: NextRequest) {
  if (stryMutAct_9fa48("9018")) {
    {}
  } else {
    stryCov_9fa48("9018");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9019")) {
        {}
      } else {
        stryCov_9fa48("9019");
        try {
          if (stryMutAct_9fa48("9020")) {
            {}
          } else {
            stryCov_9fa48("9020");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9023") ? false : stryMutAct_9fa48("9022") ? true : stryMutAct_9fa48("9021") ? dbUser?.email : (stryCov_9fa48("9021", "9022", "9023"), !(stryMutAct_9fa48("9024") ? dbUser.email : (stryCov_9fa48("9024"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9025")) {
                {}
              } else {
                stryCov_9fa48("9025");
                return NextResponse.json(stryMutAct_9fa48("9026") ? {} : (stryCov_9fa48("9026"), {
                  error: stryMutAct_9fa48("9027") ? "" : (stryCov_9fa48("9027"), 'No autorizado')
                }), stryMutAct_9fa48("9028") ? {} : (stryCov_9fa48("9028"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9031") ? false : stryMutAct_9fa48("9030") ? true : stryMutAct_9fa48("9029") ? dbUser.student : (stryCov_9fa48("9029", "9030", "9031"), !dbUser.student)) {
              if (stryMutAct_9fa48("9032")) {
                {}
              } else {
                stryCov_9fa48("9032");
                return NextResponse.json(stryMutAct_9fa48("9033") ? {} : (stryCov_9fa48("9033"), {
                  error: stryMutAct_9fa48("9034") ? "" : (stryCov_9fa48("9034"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9035") ? {} : (stryCov_9fa48("9035"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = noteIdQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("9038") ? false : stryMutAct_9fa48("9037") ? true : stryMutAct_9fa48("9036") ? queryValidation.success : (stryCov_9fa48("9036", "9037", "9038"), !queryValidation.success)) {
              if (stryMutAct_9fa48("9039")) {
                {}
              } else {
                stryCov_9fa48("9039");
                return NextResponse.json(stryMutAct_9fa48("9040") ? {} : (stryCov_9fa48("9040"), {
                  error: stryMutAct_9fa48("9041") ? "" : (stryCov_9fa48("9041"), 'ID de nota inválido'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("9042") ? {} : (stryCov_9fa48("9042"), {
                  status: 400
                }));
              }
            }
            const {
              noteId
            } = queryValidation.data;
            const body = await request.json();
            const validation = updateNoteSchema.safeParse(body);
            if (stryMutAct_9fa48("9045") ? false : stryMutAct_9fa48("9044") ? true : stryMutAct_9fa48("9043") ? validation.success : (stryCov_9fa48("9043", "9044", "9045"), !validation.success)) {
              if (stryMutAct_9fa48("9046")) {
                {}
              } else {
                stryCov_9fa48("9046");
                return NextResponse.json(stryMutAct_9fa48("9047") ? {} : (stryCov_9fa48("9047"), {
                  error: stryMutAct_9fa48("9048") ? "" : (stryCov_9fa48("9048"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("9049") ? {} : (stryCov_9fa48("9049"), {
                  status: 400
                }));
              }
            }

            // Verificar que la nota pertenece al estudiante
            const existingNote = await prisma.studyNote.findFirst(stryMutAct_9fa48("9050") ? {} : (stryCov_9fa48("9050"), {
              where: stryMutAct_9fa48("9051") ? {} : (stryCov_9fa48("9051"), {
                id: noteId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("9054") ? false : stryMutAct_9fa48("9053") ? true : stryMutAct_9fa48("9052") ? existingNote : (stryCov_9fa48("9052", "9053", "9054"), !existingNote)) {
              if (stryMutAct_9fa48("9055")) {
                {}
              } else {
                stryCov_9fa48("9055");
                return NextResponse.json(stryMutAct_9fa48("9056") ? {} : (stryCov_9fa48("9056"), {
                  error: stryMutAct_9fa48("9057") ? "" : (stryCov_9fa48("9057"), 'Nota no encontrada')
                }), stryMutAct_9fa48("9058") ? {} : (stryCov_9fa48("9058"), {
                  status: 404
                }));
              }
            }
            const updateData: {
              title?: string;
              content?: string;
              tags?: string | null;
            } = {};
            if (stryMutAct_9fa48("9060") ? false : stryMutAct_9fa48("9059") ? true : (stryCov_9fa48("9059", "9060"), validation.data.title)) updateData.title = validation.data.title;
            if (stryMutAct_9fa48("9062") ? false : stryMutAct_9fa48("9061") ? true : (stryCov_9fa48("9061", "9062"), validation.data.content)) updateData.content = validation.data.content;
            if (stryMutAct_9fa48("9065") ? validation.data.tags === undefined : stryMutAct_9fa48("9064") ? false : stryMutAct_9fa48("9063") ? true : (stryCov_9fa48("9063", "9064", "9065"), validation.data.tags !== undefined)) {
              if (stryMutAct_9fa48("9066")) {
                {}
              } else {
                stryCov_9fa48("9066");
                updateData.tags = stryMutAct_9fa48("9069") ? validation.data.tags && null : stryMutAct_9fa48("9068") ? false : stryMutAct_9fa48("9067") ? true : (stryCov_9fa48("9067", "9068", "9069"), validation.data.tags || null);
              }
            }
            const note = await prisma.studyNote.update(stryMutAct_9fa48("9070") ? {} : (stryCov_9fa48("9070"), {
              where: stryMutAct_9fa48("9071") ? {} : (stryCov_9fa48("9071"), {
                id: noteId
              }),
              data: updateData,
              include: stryMutAct_9fa48("9072") ? {} : (stryCov_9fa48("9072"), {
                question: stryMutAct_9fa48("9073") ? {} : (stryCov_9fa48("9073"), {
                  include: stryMutAct_9fa48("9074") ? {} : (stryCov_9fa48("9074"), {
                    subject: stryMutAct_9fa48("9075") ? {} : (stryCov_9fa48("9075"), {
                      select: stryMutAct_9fa48("9076") ? {} : (stryCov_9fa48("9076"), {
                        nombre: stryMutAct_9fa48("9077") ? false : (stryCov_9fa48("9077"), true)
                      })
                    })
                  })
                }),
                topic: stryMutAct_9fa48("9078") ? {} : (stryCov_9fa48("9078"), {
                  include: stryMutAct_9fa48("9079") ? {} : (stryCov_9fa48("9079"), {
                    subject: stryMutAct_9fa48("9080") ? {} : (stryCov_9fa48("9080"), {
                      select: stryMutAct_9fa48("9081") ? {} : (stryCov_9fa48("9081"), {
                        nombre: stryMutAct_9fa48("9082") ? false : (stryCov_9fa48("9082"), true)
                      })
                    })
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9083") ? {} : (stryCov_9fa48("9083"), {
              note
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9084")) {
            {}
          } else {
            stryCov_9fa48("9084");
            logger.error(stryMutAct_9fa48("9085") ? {} : (stryCov_9fa48("9085"), {
              error,
              context: stryMutAct_9fa48("9086") ? "" : (stryCov_9fa48("9086"), 'notes/PUT')
            }), stryMutAct_9fa48("9087") ? "" : (stryCov_9fa48("9087"), 'Error al actualizar nota'));
            return NextResponse.json(stryMutAct_9fa48("9088") ? {} : (stryCov_9fa48("9088"), {
              error: stryMutAct_9fa48("9089") ? "" : (stryCov_9fa48("9089"), 'Error al actualizar nota')
            }), stryMutAct_9fa48("9090") ? {} : (stryCov_9fa48("9090"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function DELETE(request: NextRequest) {
  if (stryMutAct_9fa48("9091")) {
    {}
  } else {
    stryCov_9fa48("9091");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9092")) {
        {}
      } else {
        stryCov_9fa48("9092");
        try {
          if (stryMutAct_9fa48("9093")) {
            {}
          } else {
            stryCov_9fa48("9093");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9096") ? false : stryMutAct_9fa48("9095") ? true : stryMutAct_9fa48("9094") ? dbUser?.email : (stryCov_9fa48("9094", "9095", "9096"), !(stryMutAct_9fa48("9097") ? dbUser.email : (stryCov_9fa48("9097"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9098")) {
                {}
              } else {
                stryCov_9fa48("9098");
                return NextResponse.json(stryMutAct_9fa48("9099") ? {} : (stryCov_9fa48("9099"), {
                  error: stryMutAct_9fa48("9100") ? "" : (stryCov_9fa48("9100"), 'No autorizado')
                }), stryMutAct_9fa48("9101") ? {} : (stryCov_9fa48("9101"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9104") ? false : stryMutAct_9fa48("9103") ? true : stryMutAct_9fa48("9102") ? dbUser.student : (stryCov_9fa48("9102", "9103", "9104"), !dbUser.student)) {
              if (stryMutAct_9fa48("9105")) {
                {}
              } else {
                stryCov_9fa48("9105");
                return NextResponse.json(stryMutAct_9fa48("9106") ? {} : (stryCov_9fa48("9106"), {
                  error: stryMutAct_9fa48("9107") ? "" : (stryCov_9fa48("9107"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9108") ? {} : (stryCov_9fa48("9108"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = noteIdQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("9111") ? false : stryMutAct_9fa48("9110") ? true : stryMutAct_9fa48("9109") ? queryValidation.success : (stryCov_9fa48("9109", "9110", "9111"), !queryValidation.success)) {
              if (stryMutAct_9fa48("9112")) {
                {}
              } else {
                stryCov_9fa48("9112");
                return NextResponse.json(stryMutAct_9fa48("9113") ? {} : (stryCov_9fa48("9113"), {
                  error: stryMutAct_9fa48("9114") ? "" : (stryCov_9fa48("9114"), 'ID de nota inválido'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("9115") ? {} : (stryCov_9fa48("9115"), {
                  status: 400
                }));
              }
            }
            const {
              noteId
            } = queryValidation.data;
            const note = await prisma.studyNote.findFirst(stryMutAct_9fa48("9116") ? {} : (stryCov_9fa48("9116"), {
              where: stryMutAct_9fa48("9117") ? {} : (stryCov_9fa48("9117"), {
                id: noteId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("9120") ? false : stryMutAct_9fa48("9119") ? true : stryMutAct_9fa48("9118") ? note : (stryCov_9fa48("9118", "9119", "9120"), !note)) {
              if (stryMutAct_9fa48("9121")) {
                {}
              } else {
                stryCov_9fa48("9121");
                return NextResponse.json(stryMutAct_9fa48("9122") ? {} : (stryCov_9fa48("9122"), {
                  error: stryMutAct_9fa48("9123") ? "" : (stryCov_9fa48("9123"), 'Nota no encontrada')
                }), stryMutAct_9fa48("9124") ? {} : (stryCov_9fa48("9124"), {
                  status: 404
                }));
              }
            }
            await prisma.studyNote.delete(stryMutAct_9fa48("9125") ? {} : (stryCov_9fa48("9125"), {
              where: stryMutAct_9fa48("9126") ? {} : (stryCov_9fa48("9126"), {
                id: noteId
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9127") ? {} : (stryCov_9fa48("9127"), {
              message: stryMutAct_9fa48("9128") ? "" : (stryCov_9fa48("9128"), 'Nota eliminada correctamente')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9129")) {
            {}
          } else {
            stryCov_9fa48("9129");
            logger.error(stryMutAct_9fa48("9130") ? {} : (stryCov_9fa48("9130"), {
              error,
              context: stryMutAct_9fa48("9131") ? "" : (stryCov_9fa48("9131"), 'notes/DELETE')
            }), stryMutAct_9fa48("9132") ? "" : (stryCov_9fa48("9132"), 'Error al eliminar nota'));
            return NextResponse.json(stryMutAct_9fa48("9133") ? {} : (stryCov_9fa48("9133"), {
              error: stryMutAct_9fa48("9134") ? "" : (stryCov_9fa48("9134"), 'Error al eliminar nota')
            }), stryMutAct_9fa48("9135") ? {} : (stryCov_9fa48("9135"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}