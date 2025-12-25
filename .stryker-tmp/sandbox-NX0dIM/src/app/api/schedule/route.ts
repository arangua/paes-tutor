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
import { getCurrentUser, getAuthenticatedUserWithStudent } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { z } from 'zod';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("9609") ? "" : (stryCov_9fa48("9609"), 'nodejs');
const createScheduleSchema = z.object(stryMutAct_9fa48("9610") ? {} : (stryCov_9fa48("9610"), {
  title: stryMutAct_9fa48("9611") ? z.string().max(1) : (stryCov_9fa48("9611"), z.string().min(1)),
  description: z.string().optional(),
  scheduledAt: z.string().transform(stryMutAct_9fa48("9612") ? () => undefined : (stryCov_9fa48("9612"), str => new Date(str))),
  durationMinutes: stryMutAct_9fa48("9614") ? z.number().int().max(15).max(480).default(60) : stryMutAct_9fa48("9613") ? z.number().int().min(15).min(480).default(60) : (stryCov_9fa48("9613", "9614"), z.number().int().min(15).max(480).default(60)),
  type: z.enum(stryMutAct_9fa48("9615") ? [] : (stryCov_9fa48("9615"), [stryMutAct_9fa48("9616") ? "" : (stryCov_9fa48("9616"), 'exam'), stryMutAct_9fa48("9617") ? "" : (stryCov_9fa48("9617"), 'practice'), stryMutAct_9fa48("9618") ? "" : (stryCov_9fa48("9618"), 'review'), stryMutAct_9fa48("9619") ? "" : (stryCov_9fa48("9619"), 'flashcards'), stryMutAct_9fa48("9620") ? "" : (stryCov_9fa48("9620"), 'custom')])),
  topicId: z.string().optional(),
  examId: z.string().optional()
}));
const updateScheduleSchema = z.object(stryMutAct_9fa48("9621") ? {} : (stryCov_9fa48("9621"), {
  title: stryMutAct_9fa48("9622") ? z.string().max(1).optional() : (stryCov_9fa48("9622"), z.string().min(1).optional()),
  description: z.string().optional(),
  scheduledAt: z.string().optional().transform(stryMutAct_9fa48("9623") ? () => undefined : (stryCov_9fa48("9623"), str => str ? new Date(str) : undefined)),
  durationMinutes: stryMutAct_9fa48("9625") ? z.number().int().max(15).max(480).optional() : stryMutAct_9fa48("9624") ? z.number().int().min(15).min(480).optional() : (stryCov_9fa48("9624", "9625"), z.number().int().min(15).max(480).optional()),
  completed: z.boolean().optional()
}));
const getSchedulesQuerySchema = z.object(stryMutAct_9fa48("9626") ? {} : (stryCov_9fa48("9626"), {
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  completed: z.enum(stryMutAct_9fa48("9627") ? [] : (stryCov_9fa48("9627"), [stryMutAct_9fa48("9628") ? "" : (stryCov_9fa48("9628"), 'true'), stryMutAct_9fa48("9629") ? "" : (stryCov_9fa48("9629"), 'false')])).optional().transform(stryMutAct_9fa48("9630") ? () => undefined : (stryCov_9fa48("9630"), val => stryMutAct_9fa48("9633") ? val !== 'true' : stryMutAct_9fa48("9632") ? false : stryMutAct_9fa48("9631") ? true : (stryCov_9fa48("9631", "9632", "9633"), val === (stryMutAct_9fa48("9634") ? "" : (stryCov_9fa48("9634"), 'true')))))
}));
const scheduleIdQuerySchema = z.object(stryMutAct_9fa48("9635") ? {} : (stryCov_9fa48("9635"), {
  scheduleId: stryMutAct_9fa48("9636") ? z.string().cuid().max(1) : (stryCov_9fa48("9636"), z.string().cuid().min(1))
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("9637")) {
    {}
  } else {
    stryCov_9fa48("9637");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9638")) {
        {}
      } else {
        stryCov_9fa48("9638");
        try {
          if (stryMutAct_9fa48("9639")) {
            {}
          } else {
            stryCov_9fa48("9639");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9642") ? false : stryMutAct_9fa48("9641") ? true : stryMutAct_9fa48("9640") ? dbUser?.email : (stryCov_9fa48("9640", "9641", "9642"), !(stryMutAct_9fa48("9643") ? dbUser.email : (stryCov_9fa48("9643"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9644")) {
                {}
              } else {
                stryCov_9fa48("9644");
                return NextResponse.json(stryMutAct_9fa48("9645") ? {} : (stryCov_9fa48("9645"), {
                  error: stryMutAct_9fa48("9646") ? "" : (stryCov_9fa48("9646"), 'No autorizado')
                }), stryMutAct_9fa48("9647") ? {} : (stryCov_9fa48("9647"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9650") ? false : stryMutAct_9fa48("9649") ? true : stryMutAct_9fa48("9648") ? dbUser?.student : (stryCov_9fa48("9648", "9649", "9650"), !(stryMutAct_9fa48("9651") ? dbUser.student : (stryCov_9fa48("9651"), dbUser?.student)))) {
              if (stryMutAct_9fa48("9652")) {
                {}
              } else {
                stryCov_9fa48("9652");
                return NextResponse.json(stryMutAct_9fa48("9653") ? {} : (stryCov_9fa48("9653"), {
                  error: stryMutAct_9fa48("9654") ? "" : (stryCov_9fa48("9654"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9655") ? {} : (stryCov_9fa48("9655"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = getSchedulesQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("9658") ? false : stryMutAct_9fa48("9657") ? true : stryMutAct_9fa48("9656") ? queryValidation.success : (stryCov_9fa48("9656", "9657", "9658"), !queryValidation.success)) {
              if (stryMutAct_9fa48("9659")) {
                {}
              } else {
                stryCov_9fa48("9659");
                return NextResponse.json(stryMutAct_9fa48("9660") ? {} : (stryCov_9fa48("9660"), {
                  error: stryMutAct_9fa48("9661") ? "" : (stryCov_9fa48("9661"), 'Parámetros de consulta inválidos'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("9662") ? {} : (stryCov_9fa48("9662"), {
                  status: 400
                }));
              }
            }
            const {
              startDate,
              endDate,
              completed
            } = queryValidation.data;
            const where: {
              studentId: string;
              scheduledAt?: {
                gte?: Date;
                lte?: Date;
              };
              completed?: boolean;
            } = stryMutAct_9fa48("9663") ? {} : (stryCov_9fa48("9663"), {
              studentId: dbUser.student.id
            });
            if (stryMutAct_9fa48("9666") ? startDate && endDate : stryMutAct_9fa48("9665") ? false : stryMutAct_9fa48("9664") ? true : (stryCov_9fa48("9664", "9665", "9666"), startDate || endDate)) {
              if (stryMutAct_9fa48("9667")) {
                {}
              } else {
                stryCov_9fa48("9667");
                where.scheduledAt = {};
                if (stryMutAct_9fa48("9669") ? false : stryMutAct_9fa48("9668") ? true : (stryCov_9fa48("9668", "9669"), startDate)) {
                  if (stryMutAct_9fa48("9670")) {
                    {}
                  } else {
                    stryCov_9fa48("9670");
                    where.scheduledAt.gte = new Date(startDate);
                  }
                }
                if (stryMutAct_9fa48("9672") ? false : stryMutAct_9fa48("9671") ? true : (stryCov_9fa48("9671", "9672"), endDate)) {
                  if (stryMutAct_9fa48("9673")) {
                    {}
                  } else {
                    stryCov_9fa48("9673");
                    where.scheduledAt.lte = new Date(endDate);
                  }
                }
              }
            }
            if (stryMutAct_9fa48("9676") ? completed === undefined : stryMutAct_9fa48("9675") ? false : stryMutAct_9fa48("9674") ? true : (stryCov_9fa48("9674", "9675", "9676"), completed !== undefined)) {
              if (stryMutAct_9fa48("9677")) {
                {}
              } else {
                stryCov_9fa48("9677");
                where.completed = completed;
              }
            }
            const schedules = await prisma.studySchedule.findMany(stryMutAct_9fa48("9678") ? {} : (stryCov_9fa48("9678"), {
              where,
              include: stryMutAct_9fa48("9679") ? {} : (stryCov_9fa48("9679"), {
                topic: stryMutAct_9fa48("9680") ? {} : (stryCov_9fa48("9680"), {
                  include: stryMutAct_9fa48("9681") ? {} : (stryCov_9fa48("9681"), {
                    subject: stryMutAct_9fa48("9682") ? {} : (stryCov_9fa48("9682"), {
                      select: stryMutAct_9fa48("9683") ? {} : (stryCov_9fa48("9683"), {
                        nombre: stryMutAct_9fa48("9684") ? false : (stryCov_9fa48("9684"), true),
                        codigo: stryMutAct_9fa48("9685") ? false : (stryCov_9fa48("9685"), true)
                      })
                    })
                  })
                }),
                exam: stryMutAct_9fa48("9686") ? {} : (stryCov_9fa48("9686"), {
                  select: stryMutAct_9fa48("9687") ? {} : (stryCov_9fa48("9687"), {
                    id: stryMutAct_9fa48("9688") ? false : (stryCov_9fa48("9688"), true),
                    titulo: stryMutAct_9fa48("9689") ? false : (stryCov_9fa48("9689"), true),
                    subject: stryMutAct_9fa48("9690") ? {} : (stryCov_9fa48("9690"), {
                      select: stryMutAct_9fa48("9691") ? {} : (stryCov_9fa48("9691"), {
                        nombre: stryMutAct_9fa48("9692") ? false : (stryCov_9fa48("9692"), true),
                        codigo: stryMutAct_9fa48("9693") ? false : (stryCov_9fa48("9693"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("9694") ? {} : (stryCov_9fa48("9694"), {
                scheduledAt: stryMutAct_9fa48("9695") ? "" : (stryCov_9fa48("9695"), 'asc')
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9696") ? {} : (stryCov_9fa48("9696"), {
              schedules
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9697")) {
            {}
          } else {
            stryCov_9fa48("9697");
            logger.error(stryMutAct_9fa48("9698") ? {} : (stryCov_9fa48("9698"), {
              error,
              context: stryMutAct_9fa48("9699") ? "" : (stryCov_9fa48("9699"), 'schedule/GET')
            }), stryMutAct_9fa48("9700") ? "" : (stryCov_9fa48("9700"), 'Error al obtener calendario'));
            return NextResponse.json(stryMutAct_9fa48("9701") ? {} : (stryCov_9fa48("9701"), {
              error: stryMutAct_9fa48("9702") ? "" : (stryCov_9fa48("9702"), 'Error al obtener calendario')
            }), stryMutAct_9fa48("9703") ? {} : (stryCov_9fa48("9703"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("9704")) {
    {}
  } else {
    stryCov_9fa48("9704");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9705")) {
        {}
      } else {
        stryCov_9fa48("9705");
        try {
          if (stryMutAct_9fa48("9706")) {
            {}
          } else {
            stryCov_9fa48("9706");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9709") ? false : stryMutAct_9fa48("9708") ? true : stryMutAct_9fa48("9707") ? dbUser?.email : (stryCov_9fa48("9707", "9708", "9709"), !(stryMutAct_9fa48("9710") ? dbUser.email : (stryCov_9fa48("9710"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9711")) {
                {}
              } else {
                stryCov_9fa48("9711");
                return NextResponse.json(stryMutAct_9fa48("9712") ? {} : (stryCov_9fa48("9712"), {
                  error: stryMutAct_9fa48("9713") ? "" : (stryCov_9fa48("9713"), 'No autorizado')
                }), stryMutAct_9fa48("9714") ? {} : (stryCov_9fa48("9714"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9717") ? false : stryMutAct_9fa48("9716") ? true : stryMutAct_9fa48("9715") ? dbUser?.student : (stryCov_9fa48("9715", "9716", "9717"), !(stryMutAct_9fa48("9718") ? dbUser.student : (stryCov_9fa48("9718"), dbUser?.student)))) {
              if (stryMutAct_9fa48("9719")) {
                {}
              } else {
                stryCov_9fa48("9719");
                return NextResponse.json(stryMutAct_9fa48("9720") ? {} : (stryCov_9fa48("9720"), {
                  error: stryMutAct_9fa48("9721") ? "" : (stryCov_9fa48("9721"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9722") ? {} : (stryCov_9fa48("9722"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const validation = createScheduleSchema.safeParse(body);
            if (stryMutAct_9fa48("9725") ? false : stryMutAct_9fa48("9724") ? true : stryMutAct_9fa48("9723") ? validation.success : (stryCov_9fa48("9723", "9724", "9725"), !validation.success)) {
              if (stryMutAct_9fa48("9726")) {
                {}
              } else {
                stryCov_9fa48("9726");
                return NextResponse.json(stryMutAct_9fa48("9727") ? {} : (stryCov_9fa48("9727"), {
                  error: stryMutAct_9fa48("9728") ? "" : (stryCov_9fa48("9728"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("9729") ? {} : (stryCov_9fa48("9729"), {
                  status: 400
                }));
              }
            }
            const {
              topicId,
              examId,
              ...data
            } = validation.data;

            // Verificar que topicId o examId existe si se proporciona
            if (stryMutAct_9fa48("9731") ? false : stryMutAct_9fa48("9730") ? true : (stryCov_9fa48("9730", "9731"), topicId)) {
              if (stryMutAct_9fa48("9732")) {
                {}
              } else {
                stryCov_9fa48("9732");
                const topic = await prisma.topic.findUnique(stryMutAct_9fa48("9733") ? {} : (stryCov_9fa48("9733"), {
                  where: stryMutAct_9fa48("9734") ? {} : (stryCov_9fa48("9734"), {
                    id: topicId
                  })
                }));
                if (stryMutAct_9fa48("9737") ? false : stryMutAct_9fa48("9736") ? true : stryMutAct_9fa48("9735") ? topic : (stryCov_9fa48("9735", "9736", "9737"), !topic)) {
                  if (stryMutAct_9fa48("9738")) {
                    {}
                  } else {
                    stryCov_9fa48("9738");
                    return NextResponse.json(stryMutAct_9fa48("9739") ? {} : (stryCov_9fa48("9739"), {
                      error: stryMutAct_9fa48("9740") ? "" : (stryCov_9fa48("9740"), 'Tema no encontrado')
                    }), stryMutAct_9fa48("9741") ? {} : (stryCov_9fa48("9741"), {
                      status: 404
                    }));
                  }
                }
              }
            }
            if (stryMutAct_9fa48("9743") ? false : stryMutAct_9fa48("9742") ? true : (stryCov_9fa48("9742", "9743"), examId)) {
              if (stryMutAct_9fa48("9744")) {
                {}
              } else {
                stryCov_9fa48("9744");
                const exam = await prisma.exam.findUnique(stryMutAct_9fa48("9745") ? {} : (stryCov_9fa48("9745"), {
                  where: stryMutAct_9fa48("9746") ? {} : (stryCov_9fa48("9746"), {
                    id: examId
                  })
                }));
                if (stryMutAct_9fa48("9749") ? false : stryMutAct_9fa48("9748") ? true : stryMutAct_9fa48("9747") ? exam : (stryCov_9fa48("9747", "9748", "9749"), !exam)) {
                  if (stryMutAct_9fa48("9750")) {
                    {}
                  } else {
                    stryCov_9fa48("9750");
                    return NextResponse.json(stryMutAct_9fa48("9751") ? {} : (stryCov_9fa48("9751"), {
                      error: stryMutAct_9fa48("9752") ? "" : (stryCov_9fa48("9752"), 'Examen no encontrado')
                    }), stryMutAct_9fa48("9753") ? {} : (stryCov_9fa48("9753"), {
                      status: 404
                    }));
                  }
                }
              }
            }
            const schedule = await prisma.studySchedule.create(stryMutAct_9fa48("9754") ? {} : (stryCov_9fa48("9754"), {
              data: stryMutAct_9fa48("9755") ? {} : (stryCov_9fa48("9755"), {
                studentId: dbUser.student.id,
                topicId: stryMutAct_9fa48("9758") ? topicId && null : stryMutAct_9fa48("9757") ? false : stryMutAct_9fa48("9756") ? true : (stryCov_9fa48("9756", "9757", "9758"), topicId || null),
                examId: stryMutAct_9fa48("9761") ? examId && null : stryMutAct_9fa48("9760") ? false : stryMutAct_9fa48("9759") ? true : (stryCov_9fa48("9759", "9760", "9761"), examId || null),
                ...data
              }),
              include: stryMutAct_9fa48("9762") ? {} : (stryCov_9fa48("9762"), {
                topic: stryMutAct_9fa48("9763") ? {} : (stryCov_9fa48("9763"), {
                  include: stryMutAct_9fa48("9764") ? {} : (stryCov_9fa48("9764"), {
                    subject: stryMutAct_9fa48("9765") ? {} : (stryCov_9fa48("9765"), {
                      select: stryMutAct_9fa48("9766") ? {} : (stryCov_9fa48("9766"), {
                        nombre: stryMutAct_9fa48("9767") ? false : (stryCov_9fa48("9767"), true)
                      })
                    })
                  })
                }),
                exam: stryMutAct_9fa48("9768") ? {} : (stryCov_9fa48("9768"), {
                  select: stryMutAct_9fa48("9769") ? {} : (stryCov_9fa48("9769"), {
                    titulo: stryMutAct_9fa48("9770") ? false : (stryCov_9fa48("9770"), true),
                    subject: stryMutAct_9fa48("9771") ? {} : (stryCov_9fa48("9771"), {
                      select: stryMutAct_9fa48("9772") ? {} : (stryCov_9fa48("9772"), {
                        nombre: stryMutAct_9fa48("9773") ? false : (stryCov_9fa48("9773"), true)
                      })
                    })
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9774") ? {} : (stryCov_9fa48("9774"), {
              schedule
            }), stryMutAct_9fa48("9775") ? {} : (stryCov_9fa48("9775"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9776")) {
            {}
          } else {
            stryCov_9fa48("9776");
            logger.error(stryMutAct_9fa48("9777") ? {} : (stryCov_9fa48("9777"), {
              error,
              context: stryMutAct_9fa48("9778") ? "" : (stryCov_9fa48("9778"), 'schedule/POST')
            }), stryMutAct_9fa48("9779") ? "" : (stryCov_9fa48("9779"), 'Error al crear sesión de estudio'));
            return NextResponse.json(stryMutAct_9fa48("9780") ? {} : (stryCov_9fa48("9780"), {
              error: stryMutAct_9fa48("9781") ? "" : (stryCov_9fa48("9781"), 'Error al crear sesión de estudio')
            }), stryMutAct_9fa48("9782") ? {} : (stryCov_9fa48("9782"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function PUT(request: NextRequest) {
  if (stryMutAct_9fa48("9783")) {
    {}
  } else {
    stryCov_9fa48("9783");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9784")) {
        {}
      } else {
        stryCov_9fa48("9784");
        try {
          if (stryMutAct_9fa48("9785")) {
            {}
          } else {
            stryCov_9fa48("9785");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9788") ? false : stryMutAct_9fa48("9787") ? true : stryMutAct_9fa48("9786") ? dbUser?.email : (stryCov_9fa48("9786", "9787", "9788"), !(stryMutAct_9fa48("9789") ? dbUser.email : (stryCov_9fa48("9789"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9790")) {
                {}
              } else {
                stryCov_9fa48("9790");
                return NextResponse.json(stryMutAct_9fa48("9791") ? {} : (stryCov_9fa48("9791"), {
                  error: stryMutAct_9fa48("9792") ? "" : (stryCov_9fa48("9792"), 'No autorizado')
                }), stryMutAct_9fa48("9793") ? {} : (stryCov_9fa48("9793"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9796") ? false : stryMutAct_9fa48("9795") ? true : stryMutAct_9fa48("9794") ? dbUser?.student : (stryCov_9fa48("9794", "9795", "9796"), !(stryMutAct_9fa48("9797") ? dbUser.student : (stryCov_9fa48("9797"), dbUser?.student)))) {
              if (stryMutAct_9fa48("9798")) {
                {}
              } else {
                stryCov_9fa48("9798");
                return NextResponse.json(stryMutAct_9fa48("9799") ? {} : (stryCov_9fa48("9799"), {
                  error: stryMutAct_9fa48("9800") ? "" : (stryCov_9fa48("9800"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9801") ? {} : (stryCov_9fa48("9801"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = scheduleIdQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("9804") ? false : stryMutAct_9fa48("9803") ? true : stryMutAct_9fa48("9802") ? queryValidation.success : (stryCov_9fa48("9802", "9803", "9804"), !queryValidation.success)) {
              if (stryMutAct_9fa48("9805")) {
                {}
              } else {
                stryCov_9fa48("9805");
                return NextResponse.json(stryMutAct_9fa48("9806") ? {} : (stryCov_9fa48("9806"), {
                  error: stryMutAct_9fa48("9807") ? "" : (stryCov_9fa48("9807"), 'ID de sesión inválido'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("9808") ? {} : (stryCov_9fa48("9808"), {
                  status: 400
                }));
              }
            }
            const {
              scheduleId
            } = queryValidation.data;
            const body = await request.json();
            const validation = updateScheduleSchema.safeParse(body);
            if (stryMutAct_9fa48("9811") ? false : stryMutAct_9fa48("9810") ? true : stryMutAct_9fa48("9809") ? validation.success : (stryCov_9fa48("9809", "9810", "9811"), !validation.success)) {
              if (stryMutAct_9fa48("9812")) {
                {}
              } else {
                stryCov_9fa48("9812");
                return NextResponse.json(stryMutAct_9fa48("9813") ? {} : (stryCov_9fa48("9813"), {
                  error: stryMutAct_9fa48("9814") ? "" : (stryCov_9fa48("9814"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("9815") ? {} : (stryCov_9fa48("9815"), {
                  status: 400
                }));
              }
            }

            // Verificar que la sesión pertenece al estudiante
            const existingSchedule = await prisma.studySchedule.findFirst(stryMutAct_9fa48("9816") ? {} : (stryCov_9fa48("9816"), {
              where: stryMutAct_9fa48("9817") ? {} : (stryCov_9fa48("9817"), {
                id: scheduleId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("9820") ? false : stryMutAct_9fa48("9819") ? true : stryMutAct_9fa48("9818") ? existingSchedule : (stryCov_9fa48("9818", "9819", "9820"), !existingSchedule)) {
              if (stryMutAct_9fa48("9821")) {
                {}
              } else {
                stryCov_9fa48("9821");
                return NextResponse.json(stryMutAct_9fa48("9822") ? {} : (stryCov_9fa48("9822"), {
                  error: stryMutAct_9fa48("9823") ? "" : (stryCov_9fa48("9823"), 'Sesión no encontrada')
                }), stryMutAct_9fa48("9824") ? {} : (stryCov_9fa48("9824"), {
                  status: 404
                }));
              }
            }
            const updateData: {
              title?: string;
              description?: string;
              scheduledAt?: Date;
              durationMinutes?: number;
              completed?: boolean;
              completedAt?: Date | null;
            } = {};
            if (stryMutAct_9fa48("9826") ? false : stryMutAct_9fa48("9825") ? true : (stryCov_9fa48("9825", "9826"), validation.data.title)) updateData.title = validation.data.title;
            if (stryMutAct_9fa48("9829") ? validation.data.description === undefined : stryMutAct_9fa48("9828") ? false : stryMutAct_9fa48("9827") ? true : (stryCov_9fa48("9827", "9828", "9829"), validation.data.description !== undefined)) updateData.description = validation.data.description;
            if (stryMutAct_9fa48("9831") ? false : stryMutAct_9fa48("9830") ? true : (stryCov_9fa48("9830", "9831"), validation.data.scheduledAt)) updateData.scheduledAt = validation.data.scheduledAt;
            if (stryMutAct_9fa48("9833") ? false : stryMutAct_9fa48("9832") ? true : (stryCov_9fa48("9832", "9833"), validation.data.durationMinutes)) updateData.durationMinutes = validation.data.durationMinutes;
            if (stryMutAct_9fa48("9836") ? validation.data.completed === undefined : stryMutAct_9fa48("9835") ? false : stryMutAct_9fa48("9834") ? true : (stryCov_9fa48("9834", "9835", "9836"), validation.data.completed !== undefined)) {
              if (stryMutAct_9fa48("9837")) {
                {}
              } else {
                stryCov_9fa48("9837");
                updateData.completed = validation.data.completed;
                updateData.completedAt = validation.data.completed ? new Date() : null;
              }
            }
            const schedule = await prisma.studySchedule.update(stryMutAct_9fa48("9838") ? {} : (stryCov_9fa48("9838"), {
              where: stryMutAct_9fa48("9839") ? {} : (stryCov_9fa48("9839"), {
                id: scheduleId
              }),
              data: updateData,
              include: stryMutAct_9fa48("9840") ? {} : (stryCov_9fa48("9840"), {
                topic: stryMutAct_9fa48("9841") ? {} : (stryCov_9fa48("9841"), {
                  include: stryMutAct_9fa48("9842") ? {} : (stryCov_9fa48("9842"), {
                    subject: stryMutAct_9fa48("9843") ? {} : (stryCov_9fa48("9843"), {
                      select: stryMutAct_9fa48("9844") ? {} : (stryCov_9fa48("9844"), {
                        nombre: stryMutAct_9fa48("9845") ? false : (stryCov_9fa48("9845"), true)
                      })
                    })
                  })
                }),
                exam: stryMutAct_9fa48("9846") ? {} : (stryCov_9fa48("9846"), {
                  select: stryMutAct_9fa48("9847") ? {} : (stryCov_9fa48("9847"), {
                    titulo: stryMutAct_9fa48("9848") ? false : (stryCov_9fa48("9848"), true),
                    subject: stryMutAct_9fa48("9849") ? {} : (stryCov_9fa48("9849"), {
                      select: stryMutAct_9fa48("9850") ? {} : (stryCov_9fa48("9850"), {
                        nombre: stryMutAct_9fa48("9851") ? false : (stryCov_9fa48("9851"), true)
                      })
                    })
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9852") ? {} : (stryCov_9fa48("9852"), {
              schedule
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9853")) {
            {}
          } else {
            stryCov_9fa48("9853");
            logger.error(stryMutAct_9fa48("9854") ? {} : (stryCov_9fa48("9854"), {
              error,
              context: stryMutAct_9fa48("9855") ? "" : (stryCov_9fa48("9855"), 'schedule/PUT')
            }), stryMutAct_9fa48("9856") ? "" : (stryCov_9fa48("9856"), 'Error al actualizar sesión'));
            return NextResponse.json(stryMutAct_9fa48("9857") ? {} : (stryCov_9fa48("9857"), {
              error: stryMutAct_9fa48("9858") ? "" : (stryCov_9fa48("9858"), 'Error al actualizar sesión')
            }), stryMutAct_9fa48("9859") ? {} : (stryCov_9fa48("9859"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function DELETE(request: NextRequest) {
  if (stryMutAct_9fa48("9860")) {
    {}
  } else {
    stryCov_9fa48("9860");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9861")) {
        {}
      } else {
        stryCov_9fa48("9861");
        try {
          if (stryMutAct_9fa48("9862")) {
            {}
          } else {
            stryCov_9fa48("9862");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9865") ? false : stryMutAct_9fa48("9864") ? true : stryMutAct_9fa48("9863") ? dbUser?.email : (stryCov_9fa48("9863", "9864", "9865"), !(stryMutAct_9fa48("9866") ? dbUser.email : (stryCov_9fa48("9866"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9867")) {
                {}
              } else {
                stryCov_9fa48("9867");
                return NextResponse.json(stryMutAct_9fa48("9868") ? {} : (stryCov_9fa48("9868"), {
                  error: stryMutAct_9fa48("9869") ? "" : (stryCov_9fa48("9869"), 'No autorizado')
                }), stryMutAct_9fa48("9870") ? {} : (stryCov_9fa48("9870"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9873") ? false : stryMutAct_9fa48("9872") ? true : stryMutAct_9fa48("9871") ? dbUser?.student : (stryCov_9fa48("9871", "9872", "9873"), !(stryMutAct_9fa48("9874") ? dbUser.student : (stryCov_9fa48("9874"), dbUser?.student)))) {
              if (stryMutAct_9fa48("9875")) {
                {}
              } else {
                stryCov_9fa48("9875");
                return NextResponse.json(stryMutAct_9fa48("9876") ? {} : (stryCov_9fa48("9876"), {
                  error: stryMutAct_9fa48("9877") ? "" : (stryCov_9fa48("9877"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9878") ? {} : (stryCov_9fa48("9878"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = scheduleIdQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("9881") ? false : stryMutAct_9fa48("9880") ? true : stryMutAct_9fa48("9879") ? queryValidation.success : (stryCov_9fa48("9879", "9880", "9881"), !queryValidation.success)) {
              if (stryMutAct_9fa48("9882")) {
                {}
              } else {
                stryCov_9fa48("9882");
                return NextResponse.json(stryMutAct_9fa48("9883") ? {} : (stryCov_9fa48("9883"), {
                  error: stryMutAct_9fa48("9884") ? "" : (stryCov_9fa48("9884"), 'ID de sesión inválido'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("9885") ? {} : (stryCov_9fa48("9885"), {
                  status: 400
                }));
              }
            }
            const {
              scheduleId
            } = queryValidation.data;
            const schedule = await prisma.studySchedule.findFirst(stryMutAct_9fa48("9886") ? {} : (stryCov_9fa48("9886"), {
              where: stryMutAct_9fa48("9887") ? {} : (stryCov_9fa48("9887"), {
                id: scheduleId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("9890") ? false : stryMutAct_9fa48("9889") ? true : stryMutAct_9fa48("9888") ? schedule : (stryCov_9fa48("9888", "9889", "9890"), !schedule)) {
              if (stryMutAct_9fa48("9891")) {
                {}
              } else {
                stryCov_9fa48("9891");
                return NextResponse.json(stryMutAct_9fa48("9892") ? {} : (stryCov_9fa48("9892"), {
                  error: stryMutAct_9fa48("9893") ? "" : (stryCov_9fa48("9893"), 'Sesión no encontrada')
                }), stryMutAct_9fa48("9894") ? {} : (stryCov_9fa48("9894"), {
                  status: 404
                }));
              }
            }
            await prisma.studySchedule.delete(stryMutAct_9fa48("9895") ? {} : (stryCov_9fa48("9895"), {
              where: stryMutAct_9fa48("9896") ? {} : (stryCov_9fa48("9896"), {
                id: scheduleId
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("9897") ? {} : (stryCov_9fa48("9897"), {
              message: stryMutAct_9fa48("9898") ? "" : (stryCov_9fa48("9898"), 'Sesión eliminada correctamente')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9899")) {
            {}
          } else {
            stryCov_9fa48("9899");
            logger.error(stryMutAct_9fa48("9900") ? {} : (stryCov_9fa48("9900"), {
              error,
              context: stryMutAct_9fa48("9901") ? "" : (stryCov_9fa48("9901"), 'schedule/DELETE')
            }), stryMutAct_9fa48("9902") ? "" : (stryCov_9fa48("9902"), 'Error al eliminar sesión'));
            return NextResponse.json(stryMutAct_9fa48("9903") ? {} : (stryCov_9fa48("9903"), {
              error: stryMutAct_9fa48("9904") ? "" : (stryCov_9fa48("9904"), 'Error al eliminar sesión')
            }), stryMutAct_9fa48("9905") ? {} : (stryCov_9fa48("9905"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}