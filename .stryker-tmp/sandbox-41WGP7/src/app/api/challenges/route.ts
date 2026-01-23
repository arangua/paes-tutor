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
import { cancelExpiredChallenges } from '@/lib/challenge-timeout';
import { TRANSACTION_TIMEOUT_SHORT, CHALLENGE_STATUS } from '@/lib/challenge-constants';
import { getChallengeInclude } from '@/lib/challenge-helpers';
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("7653") ? "" : (stryCov_9fa48("7653"), 'nodejs');
const createChallengeSchema = z.object(stryMutAct_9fa48("7654") ? {} : (stryCov_9fa48("7654"), {
  examId: z.string().cuid().optional(),
  message: stryMutAct_9fa48("7655") ? z.string().min(500).optional() : (stryCov_9fa48("7655"), z.string().max(500).optional()),
  // Limitar longitud del mensaje
  deadline: z.string().datetime().optional() // ISO date string validado
}));

/**
 * GET: Obtener desafíos del usuario actual
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("7656")) {
    {}
  } else {
    stryCov_9fa48("7656");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7657")) {
        {}
      } else {
        stryCov_9fa48("7657");
        try {
          if (stryMutAct_9fa48("7658")) {
            {}
          } else {
            stryCov_9fa48("7658");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7661") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("7660") ? false : stryMutAct_9fa48("7659") ? true : (stryCov_9fa48("7659", "7660", "7661"), (stryMutAct_9fa48("7662") ? dbUser?.email : (stryCov_9fa48("7662"), !(stryMutAct_9fa48("7663") ? dbUser.email : (stryCov_9fa48("7663"), dbUser?.email)))) || (stryMutAct_9fa48("7664") ? dbUser.student : (stryCov_9fa48("7664"), !dbUser.student)))) {
              if (stryMutAct_9fa48("7665")) {
                {}
              } else {
                stryCov_9fa48("7665");
                return NextResponse.json(stryMutAct_9fa48("7666") ? {} : (stryCov_9fa48("7666"), {
                  error: stryMutAct_9fa48("7667") ? "" : (stryCov_9fa48("7667"), 'No autorizado')
                }), stryMutAct_9fa48("7668") ? {} : (stryCov_9fa48("7668"), {
                  status: 401
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const type = stryMutAct_9fa48("7671") ? searchParams.get('type') && 'all' : stryMutAct_9fa48("7670") ? false : stryMutAct_9fa48("7669") ? true : (stryCov_9fa48("7669", "7670", "7671"), searchParams.get(stryMutAct_9fa48("7672") ? "" : (stryCov_9fa48("7672"), 'type')) || (stryMutAct_9fa48("7673") ? "" : (stryCov_9fa48("7673"), 'all'))); // 'all' | 'sent' | 'received' | 'active'
            const status = searchParams.get(stryMutAct_9fa48("7674") ? "" : (stryCov_9fa48("7674"), 'status')); // Filtrar por estado específico

            const where: {
              OR?: Array<{
                challengerId: string;
              } | {
                challengedId: string;
              }>;
              challengerId?: string;
              challengedId?: string;
              status?: string | {
                in: string[];
              };
            } = {};
            if (stryMutAct_9fa48("7677") ? type !== 'sent' : stryMutAct_9fa48("7676") ? false : stryMutAct_9fa48("7675") ? true : (stryCov_9fa48("7675", "7676", "7677"), type === (stryMutAct_9fa48("7678") ? "" : (stryCov_9fa48("7678"), 'sent')))) {
              if (stryMutAct_9fa48("7679")) {
                {}
              } else {
                stryCov_9fa48("7679");
                where.challengerId = dbUser.student.id;
                if (stryMutAct_9fa48("7681") ? false : stryMutAct_9fa48("7680") ? true : (stryCov_9fa48("7680", "7681"), status)) {
                  if (stryMutAct_9fa48("7682")) {
                    {}
                  } else {
                    stryCov_9fa48("7682");
                    where.status = status;
                  }
                }
              }
            } else if (stryMutAct_9fa48("7685") ? type !== 'received' : stryMutAct_9fa48("7684") ? false : stryMutAct_9fa48("7683") ? true : (stryCov_9fa48("7683", "7684", "7685"), type === (stryMutAct_9fa48("7686") ? "" : (stryCov_9fa48("7686"), 'received')))) {
              if (stryMutAct_9fa48("7687")) {
                {}
              } else {
                stryCov_9fa48("7687");
                where.challengedId = dbUser.student.id;
                if (stryMutAct_9fa48("7689") ? false : stryMutAct_9fa48("7688") ? true : (stryCov_9fa48("7688", "7689"), status)) {
                  if (stryMutAct_9fa48("7690")) {
                    {}
                  } else {
                    stryCov_9fa48("7690");
                    where.status = status;
                  }
                }
              }
            } else if (stryMutAct_9fa48("7693") ? type !== 'active' : stryMutAct_9fa48("7692") ? false : stryMutAct_9fa48("7691") ? true : (stryCov_9fa48("7691", "7692", "7693"), type === (stryMutAct_9fa48("7694") ? "" : (stryCov_9fa48("7694"), 'active')))) {
              if (stryMutAct_9fa48("7695")) {
                {}
              } else {
                stryCov_9fa48("7695");
                where.OR = stryMutAct_9fa48("7696") ? [] : (stryCov_9fa48("7696"), [stryMutAct_9fa48("7697") ? {} : (stryCov_9fa48("7697"), {
                  challengerId: dbUser.student.id
                }), stryMutAct_9fa48("7698") ? {} : (stryCov_9fa48("7698"), {
                  challengedId: dbUser.student.id
                })]);
                // Para 'active', siempre filtrar por pending o accepted, a menos que se especifique otro status
                if (stryMutAct_9fa48("7700") ? false : stryMutAct_9fa48("7699") ? true : (stryCov_9fa48("7699", "7700"), status)) {
                  if (stryMutAct_9fa48("7701")) {
                    {}
                  } else {
                    stryCov_9fa48("7701");
                    where.status = status;
                  }
                } else {
                  if (stryMutAct_9fa48("7702")) {
                    {}
                  } else {
                    stryCov_9fa48("7702");
                    where.status = stryMutAct_9fa48("7703") ? {} : (stryCov_9fa48("7703"), {
                      in: stryMutAct_9fa48("7704") ? [] : (stryCov_9fa48("7704"), [CHALLENGE_STATUS.PENDING, CHALLENGE_STATUS.ACCEPTED])
                    });
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("7705")) {
                {}
              } else {
                stryCov_9fa48("7705");
                // all
                where.OR = stryMutAct_9fa48("7706") ? [] : (stryCov_9fa48("7706"), [stryMutAct_9fa48("7707") ? {} : (stryCov_9fa48("7707"), {
                  challengerId: dbUser.student.id
                }), stryMutAct_9fa48("7708") ? {} : (stryCov_9fa48("7708"), {
                  challengedId: dbUser.student.id
                })]);
                if (stryMutAct_9fa48("7710") ? false : stryMutAct_9fa48("7709") ? true : (stryCov_9fa48("7709", "7710"), status)) {
                  if (stryMutAct_9fa48("7711")) {
                    {}
                  } else {
                    stryCov_9fa48("7711");
                    where.status = status;
                  }
                }
              }
            }
            const challenges = await prisma.challenge.findMany(stryMutAct_9fa48("7712") ? {} : (stryCov_9fa48("7712"), {
              where,
              include: stryMutAct_9fa48("7713") ? {} : (stryCov_9fa48("7713"), {
                ...getChallengeInclude(),
                challenger: stryMutAct_9fa48("7714") ? {} : (stryCov_9fa48("7714"), {
                  select: stryMutAct_9fa48("7715") ? {} : (stryCov_9fa48("7715"), {
                    id: stryMutAct_9fa48("7716") ? false : (stryCov_9fa48("7716"), true),
                    nombre: stryMutAct_9fa48("7717") ? false : (stryCov_9fa48("7717"), true),
                    user: stryMutAct_9fa48("7718") ? {} : (stryCov_9fa48("7718"), {
                      select: stryMutAct_9fa48("7719") ? {} : (stryCov_9fa48("7719"), {
                        email: stryMutAct_9fa48("7720") ? false : (stryCov_9fa48("7720"), true)
                      })
                    })
                  })
                }),
                challenged: stryMutAct_9fa48("7721") ? {} : (stryCov_9fa48("7721"), {
                  select: stryMutAct_9fa48("7722") ? {} : (stryCov_9fa48("7722"), {
                    id: stryMutAct_9fa48("7723") ? false : (stryCov_9fa48("7723"), true),
                    nombre: stryMutAct_9fa48("7724") ? false : (stryCov_9fa48("7724"), true),
                    user: stryMutAct_9fa48("7725") ? {} : (stryCov_9fa48("7725"), {
                      select: stryMutAct_9fa48("7726") ? {} : (stryCov_9fa48("7726"), {
                        email: stryMutAct_9fa48("7727") ? false : (stryCov_9fa48("7727"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("7728") ? {} : (stryCov_9fa48("7728"), {
                createdAt: stryMutAct_9fa48("7729") ? "" : (stryCov_9fa48("7729"), 'desc')
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("7730") ? {} : (stryCov_9fa48("7730"), {
              challenges
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7731")) {
            {}
          } else {
            stryCov_9fa48("7731");
            logger.error(stryMutAct_9fa48("7732") ? {} : (stryCov_9fa48("7732"), {
              type: stryMutAct_9fa48("7733") ? "" : (stryCov_9fa48("7733"), 'challenges_get_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("7734") ? "" : (stryCov_9fa48("7734"), 'Error al obtener desafíos'));
            return NextResponse.json(stryMutAct_9fa48("7735") ? {} : (stryCov_9fa48("7735"), {
              error: stryMutAct_9fa48("7736") ? "" : (stryCov_9fa48("7736"), 'Error al obtener desafíos')
            }), stryMutAct_9fa48("7737") ? {} : (stryCov_9fa48("7737"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * POST: Crear un nuevo desafío
 */
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("7738")) {
    {}
  } else {
    stryCov_9fa48("7738");
    // Usar rate limit más estricto para crear desafíos (5 por hora)
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7739")) {
        {}
      } else {
        stryCov_9fa48("7739");
        try {
          if (stryMutAct_9fa48("7740")) {
            {}
          } else {
            stryCov_9fa48("7740");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7743") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("7742") ? false : stryMutAct_9fa48("7741") ? true : (stryCov_9fa48("7741", "7742", "7743"), (stryMutAct_9fa48("7744") ? dbUser?.email : (stryCov_9fa48("7744"), !(stryMutAct_9fa48("7745") ? dbUser.email : (stryCov_9fa48("7745"), dbUser?.email)))) || (stryMutAct_9fa48("7746") ? dbUser.student : (stryCov_9fa48("7746"), !dbUser.student)))) {
              if (stryMutAct_9fa48("7747")) {
                {}
              } else {
                stryCov_9fa48("7747");
                return NextResponse.json(stryMutAct_9fa48("7748") ? {} : (stryCov_9fa48("7748"), {
                  error: stryMutAct_9fa48("7749") ? "" : (stryCov_9fa48("7749"), 'No autorizado')
                }), stryMutAct_9fa48("7750") ? {} : (stryCov_9fa48("7750"), {
                  status: 401
                }));
              }
            }
            const body = await request.json();
            const validation = createChallengeSchema.safeParse(body);
            if (stryMutAct_9fa48("7753") ? false : stryMutAct_9fa48("7752") ? true : stryMutAct_9fa48("7751") ? validation.success : (stryCov_9fa48("7751", "7752", "7753"), !validation.success)) {
              if (stryMutAct_9fa48("7754")) {
                {}
              } else {
                stryCov_9fa48("7754");
                return NextResponse.json(stryMutAct_9fa48("7755") ? {} : (stryCov_9fa48("7755"), {
                  error: stryMutAct_9fa48("7756") ? "" : (stryCov_9fa48("7756"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("7757") ? {} : (stryCov_9fa48("7757"), {
                  status: 400
                }));
              }
            }
            const {
              examId,
              message,
              deadline
            } = validation.data;

            // Si hay examId, verificar que el examen existe
            if (stryMutAct_9fa48("7759") ? false : stryMutAct_9fa48("7758") ? true : (stryCov_9fa48("7758", "7759"), examId)) {
              if (stryMutAct_9fa48("7760")) {
                {}
              } else {
                stryCov_9fa48("7760");
                const exam = await prisma.exam.findUnique(stryMutAct_9fa48("7761") ? {} : (stryCov_9fa48("7761"), {
                  where: stryMutAct_9fa48("7762") ? {} : (stryCov_9fa48("7762"), {
                    id: examId
                  })
                }));
                if (stryMutAct_9fa48("7765") ? false : stryMutAct_9fa48("7764") ? true : stryMutAct_9fa48("7763") ? exam : (stryCov_9fa48("7763", "7764", "7765"), !exam)) {
                  if (stryMutAct_9fa48("7766")) {
                    {}
                  } else {
                    stryCov_9fa48("7766");
                    return NextResponse.json(stryMutAct_9fa48("7767") ? {} : (stryCov_9fa48("7767"), {
                      error: stryMutAct_9fa48("7768") ? "" : (stryCov_9fa48("7768"), 'Examen no encontrado')
                    }), stryMutAct_9fa48("7769") ? {} : (stryCov_9fa48("7769"), {
                      status: 404
                    }));
                  }
                }
              }
            }

            // Obtener todos los estudiantes para encontrar el otro
            const allStudents = await prisma.student.findMany(stryMutAct_9fa48("7770") ? {} : (stryCov_9fa48("7770"), {
              select: stryMutAct_9fa48("7771") ? {} : (stryCov_9fa48("7771"), {
                id: stryMutAct_9fa48("7772") ? false : (stryCov_9fa48("7772"), true)
              }),
              orderBy: stryMutAct_9fa48("7773") ? {} : (stryCov_9fa48("7773"), {
                createdAt: stryMutAct_9fa48("7774") ? "" : (stryCov_9fa48("7774"), 'asc')
              })
            }));
            if (stryMutAct_9fa48("7778") ? allStudents.length >= 2 : stryMutAct_9fa48("7777") ? allStudents.length <= 2 : stryMutAct_9fa48("7776") ? false : stryMutAct_9fa48("7775") ? true : (stryCov_9fa48("7775", "7776", "7777", "7778"), allStudents.length < 2)) {
              if (stryMutAct_9fa48("7779")) {
                {}
              } else {
                stryCov_9fa48("7779");
                return NextResponse.json(stryMutAct_9fa48("7780") ? {} : (stryCov_9fa48("7780"), {
                  error: stryMutAct_9fa48("7781") ? "" : (stryCov_9fa48("7781"), 'Se necesitan al menos 2 estudiantes para crear un desafío')
                }), stryMutAct_9fa48("7782") ? {} : (stryCov_9fa48("7782"), {
                  status: 400
                }));
              }
            }

            // Encontrar el otro estudiante (el que no es el actual)
            const otherStudent = allStudents.find(stryMutAct_9fa48("7783") ? () => undefined : (stryCov_9fa48("7783"), s => stryMutAct_9fa48("7786") ? s.id === dbUser.student.id : stryMutAct_9fa48("7785") ? false : stryMutAct_9fa48("7784") ? true : (stryCov_9fa48("7784", "7785", "7786"), s.id !== dbUser.student.id)));
            if (stryMutAct_9fa48("7789") ? false : stryMutAct_9fa48("7788") ? true : stryMutAct_9fa48("7787") ? otherStudent : (stryCov_9fa48("7787", "7788", "7789"), !otherStudent)) {
              if (stryMutAct_9fa48("7790")) {
                {}
              } else {
                stryCov_9fa48("7790");
                return NextResponse.json(stryMutAct_9fa48("7791") ? {} : (stryCov_9fa48("7791"), {
                  error: stryMutAct_9fa48("7792") ? "" : (stryCov_9fa48("7792"), 'No se encontró el otro estudiante para desafiar')
                }), stryMutAct_9fa48("7793") ? {} : (stryCov_9fa48("7793"), {
                  status: 404
                }));
              }
            }

            // Crear el desafío usando transacción para prevenir race conditions
            // Si dos usuarios intentan crear desafíos simultáneamente, solo uno tendrá éxito
            const challenge = await prisma.$transaction(async tx => {
              if (stryMutAct_9fa48("7794")) {
                {}
              } else {
                stryCov_9fa48("7794");
                // Verificar si ya existe un desafío activo para el mismo examen (dentro de la transacción)
                if (stryMutAct_9fa48("7796") ? false : stryMutAct_9fa48("7795") ? true : (stryCov_9fa48("7795", "7796"), examId)) {
                  if (stryMutAct_9fa48("7797")) {
                    {}
                  } else {
                    stryCov_9fa48("7797");
                    const existingChallenge = await tx.challenge.findFirst(stryMutAct_9fa48("7798") ? {} : (stryCov_9fa48("7798"), {
                      where: stryMutAct_9fa48("7799") ? {} : (stryCov_9fa48("7799"), {
                        examId,
                        challengerId: dbUser.student.id,
                        challengedId: otherStudent.id,
                        status: stryMutAct_9fa48("7800") ? {} : (stryCov_9fa48("7800"), {
                          in: stryMutAct_9fa48("7801") ? [] : (stryCov_9fa48("7801"), [CHALLENGE_STATUS.PENDING, CHALLENGE_STATUS.ACCEPTED])
                        })
                      })
                    }));
                    if (stryMutAct_9fa48("7803") ? false : stryMutAct_9fa48("7802") ? true : (stryCov_9fa48("7802", "7803"), existingChallenge)) {
                      if (stryMutAct_9fa48("7804")) {
                        {}
                      } else {
                        stryCov_9fa48("7804");
                        throw new Error(stryMutAct_9fa48("7805") ? "" : (stryCov_9fa48("7805"), 'Ya existe un desafío activo para este examen'));
                      }
                    }
                  }
                }

                // Crear el desafío
                return await tx.challenge.create(stryMutAct_9fa48("7806") ? {} : (stryCov_9fa48("7806"), {
                  data: stryMutAct_9fa48("7807") ? {} : (stryCov_9fa48("7807"), {
                    examId: stryMutAct_9fa48("7810") ? examId && null : stryMutAct_9fa48("7809") ? false : stryMutAct_9fa48("7808") ? true : (stryCov_9fa48("7808", "7809", "7810"), examId || null),
                    challengerId: dbUser.student.id,
                    challengedId: otherStudent.id,
                    message: stryMutAct_9fa48("7813") ? message && null : stryMutAct_9fa48("7812") ? false : stryMutAct_9fa48("7811") ? true : (stryCov_9fa48("7811", "7812", "7813"), message || null),
                    deadline: deadline ? new Date(deadline) : null,
                    status: CHALLENGE_STATUS.PENDING
                  }),
                  include: stryMutAct_9fa48("7814") ? {} : (stryCov_9fa48("7814"), {
                    exam: stryMutAct_9fa48("7815") ? {} : (stryCov_9fa48("7815"), {
                      include: stryMutAct_9fa48("7816") ? {} : (stryCov_9fa48("7816"), {
                        subject: stryMutAct_9fa48("7817") ? {} : (stryCov_9fa48("7817"), {
                          select: stryMutAct_9fa48("7818") ? {} : (stryCov_9fa48("7818"), {
                            id: stryMutAct_9fa48("7819") ? false : (stryCov_9fa48("7819"), true),
                            nombre: stryMutAct_9fa48("7820") ? false : (stryCov_9fa48("7820"), true),
                            codigo: stryMutAct_9fa48("7821") ? false : (stryCov_9fa48("7821"), true)
                          })
                        })
                      })
                    }),
                    challenger: stryMutAct_9fa48("7822") ? {} : (stryCov_9fa48("7822"), {
                      select: stryMutAct_9fa48("7823") ? {} : (stryCov_9fa48("7823"), {
                        id: stryMutAct_9fa48("7824") ? false : (stryCov_9fa48("7824"), true),
                        nombre: stryMutAct_9fa48("7825") ? false : (stryCov_9fa48("7825"), true)
                      })
                    }),
                    challenged: stryMutAct_9fa48("7826") ? {} : (stryCov_9fa48("7826"), {
                      select: stryMutAct_9fa48("7827") ? {} : (stryCov_9fa48("7827"), {
                        id: stryMutAct_9fa48("7828") ? false : (stryCov_9fa48("7828"), true),
                        nombre: stryMutAct_9fa48("7829") ? false : (stryCov_9fa48("7829"), true)
                      })
                    })
                  })
                }));
              }
            }, stryMutAct_9fa48("7830") ? {} : (stryCov_9fa48("7830"), {
              timeout: TRANSACTION_TIMEOUT_SHORT
            }));

            // Limpiar desafíos expirados en background (no bloquear la respuesta)
            cancelExpiredChallenges().catch(error => {
              if (stryMutAct_9fa48("7831")) {
                {}
              } else {
                stryCov_9fa48("7831");
                logger.error(stryMutAct_9fa48("7832") ? {} : (stryCov_9fa48("7832"), {
                  type: stryMutAct_9fa48("7833") ? "" : (stryCov_9fa48("7833"), 'challenge_cleanup_background_error'),
                  error: error instanceof Error ? error.message : String(error)
                }), stryMutAct_9fa48("7834") ? "" : (stryCov_9fa48("7834"), 'Error en limpieza de fondo de desafíos expirados'));
              }
            });
            return NextResponse.json(stryMutAct_9fa48("7835") ? {} : (stryCov_9fa48("7835"), {
              challenge,
              message: stryMutAct_9fa48("7836") ? "" : (stryCov_9fa48("7836"), 'Desafío creado exitosamente')
            }), stryMutAct_9fa48("7837") ? {} : (stryCov_9fa48("7837"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7838")) {
            {}
          } else {
            stryCov_9fa48("7838");
            // Si es un error de desafío existente, retornar 409
            if (stryMutAct_9fa48("7841") ? error instanceof Error || error.message === 'Ya existe un desafío activo para este examen' : stryMutAct_9fa48("7840") ? false : stryMutAct_9fa48("7839") ? true : (stryCov_9fa48("7839", "7840", "7841"), error instanceof Error && (stryMutAct_9fa48("7843") ? error.message !== 'Ya existe un desafío activo para este examen' : stryMutAct_9fa48("7842") ? true : (stryCov_9fa48("7842", "7843"), error.message === (stryMutAct_9fa48("7844") ? "" : (stryCov_9fa48("7844"), 'Ya existe un desafío activo para este examen')))))) {
              if (stryMutAct_9fa48("7845")) {
                {}
              } else {
                stryCov_9fa48("7845");
                return NextResponse.json(stryMutAct_9fa48("7846") ? {} : (stryCov_9fa48("7846"), {
                  error: stryMutAct_9fa48("7847") ? "" : (stryCov_9fa48("7847"), 'Ya existe un desafío activo para este examen')
                }), stryMutAct_9fa48("7848") ? {} : (stryCov_9fa48("7848"), {
                  status: 409
                }));
              }
            }
            logger.error(stryMutAct_9fa48("7849") ? {} : (stryCov_9fa48("7849"), {
              type: stryMutAct_9fa48("7850") ? "" : (stryCov_9fa48("7850"), 'challenges_post_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("7851") ? "" : (stryCov_9fa48("7851"), 'Error al crear desafío'));
            return NextResponse.json(stryMutAct_9fa48("7852") ? {} : (stryCov_9fa48("7852"), {
              error: stryMutAct_9fa48("7853") ? "" : (stryCov_9fa48("7853"), 'Error al crear desafío')
            }), stryMutAct_9fa48("7854") ? {} : (stryCov_9fa48("7854"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("7855") ? "" : (stryCov_9fa48("7855"), 'challenge') // Tipo de rate limit estricto para desafíos
    );
  }
}