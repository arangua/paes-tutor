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
import { getChallengeInclude, determineChallengeWinner } from '@/lib/challenge-helpers';
import { CHALLENGE_STATUS } from '@/lib/challenge-constants';
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("7975") ? "" : (stryCov_9fa48("7975"), 'nodejs');
const updateChallengeSchema = z.object(stryMutAct_9fa48("7976") ? {} : (stryCov_9fa48("7976"), {
  status: z.enum(stryMutAct_9fa48("7977") ? [] : (stryCov_9fa48("7977"), [stryMutAct_9fa48("7978") ? "" : (stryCov_9fa48("7978"), 'accepted'), stryMutAct_9fa48("7979") ? "" : (stryCov_9fa48("7979"), 'declined'), stryMutAct_9fa48("7980") ? "" : (stryCov_9fa48("7980"), 'cancelled')])).optional(),
  challengedAttemptId: z.string().optional()
}));

/**
 * GET: Obtener un desafío específico
 */
export async function GET(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("7981")) {
    {}
  } else {
    stryCov_9fa48("7981");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7982")) {
        {}
      } else {
        stryCov_9fa48("7982");
        try {
          if (stryMutAct_9fa48("7983")) {
            {}
          } else {
            stryCov_9fa48("7983");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7986") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("7985") ? false : stryMutAct_9fa48("7984") ? true : (stryCov_9fa48("7984", "7985", "7986"), (stryMutAct_9fa48("7987") ? dbUser?.email : (stryCov_9fa48("7987"), !(stryMutAct_9fa48("7988") ? dbUser.email : (stryCov_9fa48("7988"), dbUser?.email)))) || (stryMutAct_9fa48("7989") ? dbUser.student : (stryCov_9fa48("7989"), !dbUser.student)))) {
              if (stryMutAct_9fa48("7990")) {
                {}
              } else {
                stryCov_9fa48("7990");
                return NextResponse.json(stryMutAct_9fa48("7991") ? {} : (stryCov_9fa48("7991"), {
                  error: stryMutAct_9fa48("7992") ? "" : (stryCov_9fa48("7992"), 'No autorizado')
                }), stryMutAct_9fa48("7993") ? {} : (stryCov_9fa48("7993"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;
            const challenge = await prisma.challenge.findUnique(stryMutAct_9fa48("7994") ? {} : (stryCov_9fa48("7994"), {
              where: stryMutAct_9fa48("7995") ? {} : (stryCov_9fa48("7995"), {
                id
              }),
              include: stryMutAct_9fa48("7996") ? {} : (stryCov_9fa48("7996"), {
                ...getChallengeInclude(),
                challenger: stryMutAct_9fa48("7997") ? {} : (stryCov_9fa48("7997"), {
                  select: stryMutAct_9fa48("7998") ? {} : (stryCov_9fa48("7998"), {
                    id: stryMutAct_9fa48("7999") ? false : (stryCov_9fa48("7999"), true),
                    nombre: stryMutAct_9fa48("8000") ? false : (stryCov_9fa48("8000"), true),
                    user: stryMutAct_9fa48("8001") ? {} : (stryCov_9fa48("8001"), {
                      select: stryMutAct_9fa48("8002") ? {} : (stryCov_9fa48("8002"), {
                        email: stryMutAct_9fa48("8003") ? false : (stryCov_9fa48("8003"), true)
                      })
                    })
                  })
                }),
                challenged: stryMutAct_9fa48("8004") ? {} : (stryCov_9fa48("8004"), {
                  select: stryMutAct_9fa48("8005") ? {} : (stryCov_9fa48("8005"), {
                    id: stryMutAct_9fa48("8006") ? false : (stryCov_9fa48("8006"), true),
                    nombre: stryMutAct_9fa48("8007") ? false : (stryCov_9fa48("8007"), true),
                    user: stryMutAct_9fa48("8008") ? {} : (stryCov_9fa48("8008"), {
                      select: stryMutAct_9fa48("8009") ? {} : (stryCov_9fa48("8009"), {
                        email: stryMutAct_9fa48("8010") ? false : (stryCov_9fa48("8010"), true)
                      })
                    })
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("8013") ? false : stryMutAct_9fa48("8012") ? true : stryMutAct_9fa48("8011") ? challenge : (stryCov_9fa48("8011", "8012", "8013"), !challenge)) {
              if (stryMutAct_9fa48("8014")) {
                {}
              } else {
                stryCov_9fa48("8014");
                return NextResponse.json(stryMutAct_9fa48("8015") ? {} : (stryCov_9fa48("8015"), {
                  error: stryMutAct_9fa48("8016") ? "" : (stryCov_9fa48("8016"), 'Desafío no encontrado')
                }), stryMutAct_9fa48("8017") ? {} : (stryCov_9fa48("8017"), {
                  status: 404
                }));
              }
            }

            // Verificar que el usuario es parte del desafío
            if (stryMutAct_9fa48("8020") ? challenge.challengerId !== dbUser.student.id || challenge.challengedId !== dbUser.student.id : stryMutAct_9fa48("8019") ? false : stryMutAct_9fa48("8018") ? true : (stryCov_9fa48("8018", "8019", "8020"), (stryMutAct_9fa48("8022") ? challenge.challengerId === dbUser.student.id : stryMutAct_9fa48("8021") ? true : (stryCov_9fa48("8021", "8022"), challenge.challengerId !== dbUser.student.id)) && (stryMutAct_9fa48("8024") ? challenge.challengedId === dbUser.student.id : stryMutAct_9fa48("8023") ? true : (stryCov_9fa48("8023", "8024"), challenge.challengedId !== dbUser.student.id)))) {
              if (stryMutAct_9fa48("8025")) {
                {}
              } else {
                stryCov_9fa48("8025");
                return NextResponse.json(stryMutAct_9fa48("8026") ? {} : (stryCov_9fa48("8026"), {
                  error: stryMutAct_9fa48("8027") ? "" : (stryCov_9fa48("8027"), 'No tienes permiso para ver este desafío')
                }), stryMutAct_9fa48("8028") ? {} : (stryCov_9fa48("8028"), {
                  status: 403
                }));
              }
            }
            return NextResponse.json(stryMutAct_9fa48("8029") ? {} : (stryCov_9fa48("8029"), {
              challenge
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8030")) {
            {}
          } else {
            stryCov_9fa48("8030");
            logger.error(stryMutAct_9fa48("8031") ? {} : (stryCov_9fa48("8031"), {
              type: stryMutAct_9fa48("8032") ? "" : (stryCov_9fa48("8032"), 'challenges_get_id_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("8033") ? "" : (stryCov_9fa48("8033"), 'Error al obtener desafío'));
            return NextResponse.json(stryMutAct_9fa48("8034") ? {} : (stryCov_9fa48("8034"), {
              error: stryMutAct_9fa48("8035") ? "" : (stryCov_9fa48("8035"), 'Error al obtener desafío')
            }), stryMutAct_9fa48("8036") ? {} : (stryCov_9fa48("8036"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * PATCH: Actualizar un desafío (aceptar, rechazar, completar)
 */
export async function PATCH(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("8037")) {
    {}
  } else {
    stryCov_9fa48("8037");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8038")) {
        {}
      } else {
        stryCov_9fa48("8038");
        try {
          if (stryMutAct_9fa48("8039")) {
            {}
          } else {
            stryCov_9fa48("8039");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8042") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("8041") ? false : stryMutAct_9fa48("8040") ? true : (stryCov_9fa48("8040", "8041", "8042"), (stryMutAct_9fa48("8043") ? dbUser?.email : (stryCov_9fa48("8043"), !(stryMutAct_9fa48("8044") ? dbUser.email : (stryCov_9fa48("8044"), dbUser?.email)))) || (stryMutAct_9fa48("8045") ? dbUser.student : (stryCov_9fa48("8045"), !dbUser.student)))) {
              if (stryMutAct_9fa48("8046")) {
                {}
              } else {
                stryCov_9fa48("8046");
                return NextResponse.json(stryMutAct_9fa48("8047") ? {} : (stryCov_9fa48("8047"), {
                  error: stryMutAct_9fa48("8048") ? "" : (stryCov_9fa48("8048"), 'No autorizado')
                }), stryMutAct_9fa48("8049") ? {} : (stryCov_9fa48("8049"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;
            const body = await request.json();
            const validation = updateChallengeSchema.safeParse(body);
            if (stryMutAct_9fa48("8052") ? false : stryMutAct_9fa48("8051") ? true : stryMutAct_9fa48("8050") ? validation.success : (stryCov_9fa48("8050", "8051", "8052"), !validation.success)) {
              if (stryMutAct_9fa48("8053")) {
                {}
              } else {
                stryCov_9fa48("8053");
                return NextResponse.json(stryMutAct_9fa48("8054") ? {} : (stryCov_9fa48("8054"), {
                  error: stryMutAct_9fa48("8055") ? "" : (stryCov_9fa48("8055"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("8056") ? {} : (stryCov_9fa48("8056"), {
                  status: 400
                }));
              }
            }
            const {
              status,
              challengedAttemptId
            } = validation.data;

            // Obtener el desafío
            const challenge = await prisma.challenge.findUnique(stryMutAct_9fa48("8057") ? {} : (stryCov_9fa48("8057"), {
              where: stryMutAct_9fa48("8058") ? {} : (stryCov_9fa48("8058"), {
                id
              }),
              include: stryMutAct_9fa48("8059") ? {} : (stryCov_9fa48("8059"), {
                exam: stryMutAct_9fa48("8060") ? false : (stryCov_9fa48("8060"), true)
              })
            }));
            if (stryMutAct_9fa48("8063") ? false : stryMutAct_9fa48("8062") ? true : stryMutAct_9fa48("8061") ? challenge : (stryCov_9fa48("8061", "8062", "8063"), !challenge)) {
              if (stryMutAct_9fa48("8064")) {
                {}
              } else {
                stryCov_9fa48("8064");
                return NextResponse.json(stryMutAct_9fa48("8065") ? {} : (stryCov_9fa48("8065"), {
                  error: stryMutAct_9fa48("8066") ? "" : (stryCov_9fa48("8066"), 'Desafío no encontrado')
                }), stryMutAct_9fa48("8067") ? {} : (stryCov_9fa48("8067"), {
                  status: 404
                }));
              }
            }

            // Verificar permisos según la acción
            if (stryMutAct_9fa48("8070") ? status === CHALLENGE_STATUS.ACCEPTED && status === CHALLENGE_STATUS.DECLINED : stryMutAct_9fa48("8069") ? false : stryMutAct_9fa48("8068") ? true : (stryCov_9fa48("8068", "8069", "8070"), (stryMutAct_9fa48("8072") ? status !== CHALLENGE_STATUS.ACCEPTED : stryMutAct_9fa48("8071") ? false : (stryCov_9fa48("8071", "8072"), status === CHALLENGE_STATUS.ACCEPTED)) || (stryMutAct_9fa48("8074") ? status !== CHALLENGE_STATUS.DECLINED : stryMutAct_9fa48("8073") ? false : (stryCov_9fa48("8073", "8074"), status === CHALLENGE_STATUS.DECLINED)))) {
              if (stryMutAct_9fa48("8075")) {
                {}
              } else {
                stryCov_9fa48("8075");
                // Solo el desafiado puede aceptar o rechazar
                if (stryMutAct_9fa48("8078") ? challenge.challengedId === dbUser.student.id : stryMutAct_9fa48("8077") ? false : stryMutAct_9fa48("8076") ? true : (stryCov_9fa48("8076", "8077", "8078"), challenge.challengedId !== dbUser.student.id)) {
                  if (stryMutAct_9fa48("8079")) {
                    {}
                  } else {
                    stryCov_9fa48("8079");
                    return NextResponse.json(stryMutAct_9fa48("8080") ? {} : (stryCov_9fa48("8080"), {
                      error: stryMutAct_9fa48("8081") ? "" : (stryCov_9fa48("8081"), 'Solo el estudiante desafiado puede aceptar o rechazar el desafío')
                    }), stryMutAct_9fa48("8082") ? {} : (stryCov_9fa48("8082"), {
                      status: 403
                    }));
                  }
                }
                if (stryMutAct_9fa48("8085") ? challenge.status === 'pending' : stryMutAct_9fa48("8084") ? false : stryMutAct_9fa48("8083") ? true : (stryCov_9fa48("8083", "8084", "8085"), challenge.status !== (stryMutAct_9fa48("8086") ? "" : (stryCov_9fa48("8086"), 'pending')))) {
                  if (stryMutAct_9fa48("8087")) {
                    {}
                  } else {
                    stryCov_9fa48("8087");
                    return NextResponse.json(stryMutAct_9fa48("8088") ? {} : (stryCov_9fa48("8088"), {
                      error: stryMutAct_9fa48("8089") ? "" : (stryCov_9fa48("8089"), 'Este desafío ya fue procesado')
                    }), stryMutAct_9fa48("8090") ? {} : (stryCov_9fa48("8090"), {
                      status: 400
                    }));
                  }
                }

                // Actualizar el desafío
                const updated = await prisma.challenge.update(stryMutAct_9fa48("8091") ? {} : (stryCov_9fa48("8091"), {
                  where: stryMutAct_9fa48("8092") ? {} : (stryCov_9fa48("8092"), {
                    id
                  }),
                  data: stryMutAct_9fa48("8093") ? {} : (stryCov_9fa48("8093"), {
                    status,
                    acceptedAt: (stryMutAct_9fa48("8096") ? status !== 'accepted' : stryMutAct_9fa48("8095") ? false : stryMutAct_9fa48("8094") ? true : (stryCov_9fa48("8094", "8095", "8096"), status === (stryMutAct_9fa48("8097") ? "" : (stryCov_9fa48("8097"), 'accepted')))) ? new Date() : null
                  }),
                  include: stryMutAct_9fa48("8098") ? {} : (stryCov_9fa48("8098"), {
                    exam: stryMutAct_9fa48("8099") ? {} : (stryCov_9fa48("8099"), {
                      include: stryMutAct_9fa48("8100") ? {} : (stryCov_9fa48("8100"), {
                        subject: stryMutAct_9fa48("8101") ? {} : (stryCov_9fa48("8101"), {
                          select: stryMutAct_9fa48("8102") ? {} : (stryCov_9fa48("8102"), {
                            id: stryMutAct_9fa48("8103") ? false : (stryCov_9fa48("8103"), true),
                            nombre: stryMutAct_9fa48("8104") ? false : (stryCov_9fa48("8104"), true),
                            codigo: stryMutAct_9fa48("8105") ? false : (stryCov_9fa48("8105"), true)
                          })
                        })
                      })
                    }),
                    challenger: stryMutAct_9fa48("8106") ? {} : (stryCov_9fa48("8106"), {
                      select: stryMutAct_9fa48("8107") ? {} : (stryCov_9fa48("8107"), {
                        id: stryMutAct_9fa48("8108") ? false : (stryCov_9fa48("8108"), true),
                        nombre: stryMutAct_9fa48("8109") ? false : (stryCov_9fa48("8109"), true)
                      })
                    }),
                    challenged: stryMutAct_9fa48("8110") ? {} : (stryCov_9fa48("8110"), {
                      select: stryMutAct_9fa48("8111") ? {} : (stryCov_9fa48("8111"), {
                        id: stryMutAct_9fa48("8112") ? false : (stryCov_9fa48("8112"), true),
                        nombre: stryMutAct_9fa48("8113") ? false : (stryCov_9fa48("8113"), true)
                      })
                    })
                  })
                }));
                return NextResponse.json(stryMutAct_9fa48("8114") ? {} : (stryCov_9fa48("8114"), {
                  challenge: updated
                }));
              }
            }
            if (stryMutAct_9fa48("8117") ? status !== CHALLENGE_STATUS.CANCELLED : stryMutAct_9fa48("8116") ? false : stryMutAct_9fa48("8115") ? true : (stryCov_9fa48("8115", "8116", "8117"), status === CHALLENGE_STATUS.CANCELLED)) {
              if (stryMutAct_9fa48("8118")) {
                {}
              } else {
                stryCov_9fa48("8118");
                // Solo el que desafió puede cancelar
                if (stryMutAct_9fa48("8121") ? challenge.challengerId === dbUser.student.id : stryMutAct_9fa48("8120") ? false : stryMutAct_9fa48("8119") ? true : (stryCov_9fa48("8119", "8120", "8121"), challenge.challengerId !== dbUser.student.id)) {
                  if (stryMutAct_9fa48("8122")) {
                    {}
                  } else {
                    stryCov_9fa48("8122");
                    return NextResponse.json(stryMutAct_9fa48("8123") ? {} : (stryCov_9fa48("8123"), {
                      error: stryMutAct_9fa48("8124") ? "" : (stryCov_9fa48("8124"), 'Solo quien creó el desafío puede cancelarlo')
                    }), stryMutAct_9fa48("8125") ? {} : (stryCov_9fa48("8125"), {
                      status: 403
                    }));
                  }
                }
                if (stryMutAct_9fa48("8128") ? challenge.status === CHALLENGE_STATUS.PENDING : stryMutAct_9fa48("8127") ? false : stryMutAct_9fa48("8126") ? true : (stryCov_9fa48("8126", "8127", "8128"), challenge.status !== CHALLENGE_STATUS.PENDING)) {
                  if (stryMutAct_9fa48("8129")) {
                    {}
                  } else {
                    stryCov_9fa48("8129");
                    return NextResponse.json(stryMutAct_9fa48("8130") ? {} : (stryCov_9fa48("8130"), {
                      error: stryMutAct_9fa48("8131") ? "" : (stryCov_9fa48("8131"), 'No se puede cancelar un desafío que ya fue procesado')
                    }), stryMutAct_9fa48("8132") ? {} : (stryCov_9fa48("8132"), {
                      status: 400
                    }));
                  }
                }
                const updated = await prisma.challenge.update(stryMutAct_9fa48("8133") ? {} : (stryCov_9fa48("8133"), {
                  where: stryMutAct_9fa48("8134") ? {} : (stryCov_9fa48("8134"), {
                    id
                  }),
                  data: stryMutAct_9fa48("8135") ? {} : (stryCov_9fa48("8135"), {
                    status: CHALLENGE_STATUS.CANCELLED
                  }),
                  include: stryMutAct_9fa48("8136") ? {} : (stryCov_9fa48("8136"), {
                    exam: stryMutAct_9fa48("8137") ? {} : (stryCov_9fa48("8137"), {
                      include: stryMutAct_9fa48("8138") ? {} : (stryCov_9fa48("8138"), {
                        subject: stryMutAct_9fa48("8139") ? {} : (stryCov_9fa48("8139"), {
                          select: stryMutAct_9fa48("8140") ? {} : (stryCov_9fa48("8140"), {
                            id: stryMutAct_9fa48("8141") ? false : (stryCov_9fa48("8141"), true),
                            nombre: stryMutAct_9fa48("8142") ? false : (stryCov_9fa48("8142"), true),
                            codigo: stryMutAct_9fa48("8143") ? false : (stryCov_9fa48("8143"), true)
                          })
                        })
                      })
                    }),
                    challenger: stryMutAct_9fa48("8144") ? {} : (stryCov_9fa48("8144"), {
                      select: stryMutAct_9fa48("8145") ? {} : (stryCov_9fa48("8145"), {
                        id: stryMutAct_9fa48("8146") ? false : (stryCov_9fa48("8146"), true),
                        nombre: stryMutAct_9fa48("8147") ? false : (stryCov_9fa48("8147"), true)
                      })
                    }),
                    challenged: stryMutAct_9fa48("8148") ? {} : (stryCov_9fa48("8148"), {
                      select: stryMutAct_9fa48("8149") ? {} : (stryCov_9fa48("8149"), {
                        id: stryMutAct_9fa48("8150") ? false : (stryCov_9fa48("8150"), true),
                        nombre: stryMutAct_9fa48("8151") ? false : (stryCov_9fa48("8151"), true)
                      })
                    })
                  })
                }));
                return NextResponse.json(stryMutAct_9fa48("8152") ? {} : (stryCov_9fa48("8152"), {
                  challenge: updated
                }));
              }
            }

            // Si se proporciona challengedAttemptId, significa que el desafiado completó el examen
            if (stryMutAct_9fa48("8154") ? false : stryMutAct_9fa48("8153") ? true : (stryCov_9fa48("8153", "8154"), challengedAttemptId)) {
              if (stryMutAct_9fa48("8155")) {
                {}
              } else {
                stryCov_9fa48("8155");
                if (stryMutAct_9fa48("8158") ? challenge.challengedId === dbUser.student.id : stryMutAct_9fa48("8157") ? false : stryMutAct_9fa48("8156") ? true : (stryCov_9fa48("8156", "8157", "8158"), challenge.challengedId !== dbUser.student.id)) {
                  if (stryMutAct_9fa48("8159")) {
                    {}
                  } else {
                    stryCov_9fa48("8159");
                    return NextResponse.json(stryMutAct_9fa48("8160") ? {} : (stryCov_9fa48("8160"), {
                      error: stryMutAct_9fa48("8161") ? "" : (stryCov_9fa48("8161"), 'Solo el estudiante desafiado puede completar el desafío')
                    }), stryMutAct_9fa48("8162") ? {} : (stryCov_9fa48("8162"), {
                      status: 403
                    }));
                  }
                }
                if (stryMutAct_9fa48("8165") ? challenge.status === CHALLENGE_STATUS.ACCEPTED : stryMutAct_9fa48("8164") ? false : stryMutAct_9fa48("8163") ? true : (stryCov_9fa48("8163", "8164", "8165"), challenge.status !== CHALLENGE_STATUS.ACCEPTED)) {
                  if (stryMutAct_9fa48("8166")) {
                    {}
                  } else {
                    stryCov_9fa48("8166");
                    return NextResponse.json(stryMutAct_9fa48("8167") ? {} : (stryCov_9fa48("8167"), {
                      error: stryMutAct_9fa48("8168") ? "" : (stryCov_9fa48("8168"), 'El desafío debe estar aceptado para completarlo')
                    }), stryMutAct_9fa48("8169") ? {} : (stryCov_9fa48("8169"), {
                      status: 400
                    }));
                  }
                }

                // Verificar que el intento existe y pertenece al examen correcto
                const attempt = await prisma.attempt.findUnique(stryMutAct_9fa48("8170") ? {} : (stryCov_9fa48("8170"), {
                  where: stryMutAct_9fa48("8171") ? {} : (stryCov_9fa48("8171"), {
                    id: challengedAttemptId
                  }),
                  include: stryMutAct_9fa48("8172") ? {} : (stryCov_9fa48("8172"), {
                    exam: stryMutAct_9fa48("8173") ? false : (stryCov_9fa48("8173"), true)
                  })
                }));
                if (stryMutAct_9fa48("8176") ? false : stryMutAct_9fa48("8175") ? true : stryMutAct_9fa48("8174") ? attempt : (stryCov_9fa48("8174", "8175", "8176"), !attempt)) {
                  if (stryMutAct_9fa48("8177")) {
                    {}
                  } else {
                    stryCov_9fa48("8177");
                    return NextResponse.json(stryMutAct_9fa48("8178") ? {} : (stryCov_9fa48("8178"), {
                      error: stryMutAct_9fa48("8179") ? "" : (stryCov_9fa48("8179"), 'Intento no encontrado')
                    }), stryMutAct_9fa48("8180") ? {} : (stryCov_9fa48("8180"), {
                      status: 404
                    }));
                  }
                }
                if (stryMutAct_9fa48("8183") ? attempt.studentId === dbUser.student.id : stryMutAct_9fa48("8182") ? false : stryMutAct_9fa48("8181") ? true : (stryCov_9fa48("8181", "8182", "8183"), attempt.studentId !== dbUser.student.id)) {
                  if (stryMutAct_9fa48("8184")) {
                    {}
                  } else {
                    stryCov_9fa48("8184");
                    return NextResponse.json(stryMutAct_9fa48("8185") ? {} : (stryCov_9fa48("8185"), {
                      error: stryMutAct_9fa48("8186") ? "" : (stryCov_9fa48("8186"), 'El intento no pertenece al estudiante desafiado')
                    }), stryMutAct_9fa48("8187") ? {} : (stryCov_9fa48("8187"), {
                      status: 403
                    }));
                  }
                }
                if (stryMutAct_9fa48("8190") ? challenge.examId || attempt.examId !== challenge.examId : stryMutAct_9fa48("8189") ? false : stryMutAct_9fa48("8188") ? true : (stryCov_9fa48("8188", "8189", "8190"), challenge.examId && (stryMutAct_9fa48("8192") ? attempt.examId === challenge.examId : stryMutAct_9fa48("8191") ? true : (stryCov_9fa48("8191", "8192"), attempt.examId !== challenge.examId)))) {
                  if (stryMutAct_9fa48("8193")) {
                    {}
                  } else {
                    stryCov_9fa48("8193");
                    return NextResponse.json(stryMutAct_9fa48("8194") ? {} : (stryCov_9fa48("8194"), {
                      error: stryMutAct_9fa48("8195") ? "" : (stryCov_9fa48("8195"), 'El intento no corresponde al examen del desafío')
                    }), stryMutAct_9fa48("8196") ? {} : (stryCov_9fa48("8196"), {
                      status: 400
                    }));
                  }
                }
                if (stryMutAct_9fa48("8199") ? attempt.estado === 'completado' : stryMutAct_9fa48("8198") ? false : stryMutAct_9fa48("8197") ? true : (stryCov_9fa48("8197", "8198", "8199"), attempt.estado !== (stryMutAct_9fa48("8200") ? "" : (stryCov_9fa48("8200"), 'completado')))) {
                  if (stryMutAct_9fa48("8201")) {
                    {}
                  } else {
                    stryCov_9fa48("8201");
                    return NextResponse.json(stryMutAct_9fa48("8202") ? {} : (stryCov_9fa48("8202"), {
                      error: stryMutAct_9fa48("8203") ? "" : (stryCov_9fa48("8203"), 'El intento debe estar completado')
                    }), stryMutAct_9fa48("8204") ? {} : (stryCov_9fa48("8204"), {
                      status: 400
                    }));
                  }
                }

                // Determinar el ganador comparando los resultados
                let winnerId: string | null = null;
                if (stryMutAct_9fa48("8206") ? false : stryMutAct_9fa48("8205") ? true : (stryCov_9fa48("8205", "8206"), challenge.challengerAttemptId)) {
                  if (stryMutAct_9fa48("8207")) {
                    {}
                  } else {
                    stryCov_9fa48("8207");
                    const challengerAttempt = await prisma.attempt.findUnique(stryMutAct_9fa48("8208") ? {} : (stryCov_9fa48("8208"), {
                      where: stryMutAct_9fa48("8209") ? {} : (stryCov_9fa48("8209"), {
                        id: challenge.challengerAttemptId
                      })
                    }));
                    if (stryMutAct_9fa48("8211") ? false : stryMutAct_9fa48("8210") ? true : (stryCov_9fa48("8210", "8211"), challengerAttempt)) {
                      if (stryMutAct_9fa48("8212")) {
                        {}
                      } else {
                        stryCov_9fa48("8212");
                        winnerId = determineChallengeWinner(challengerAttempt, attempt, challenge.challengerId, dbUser.student.id);
                      }
                    }
                  }
                }

                // Actualizar el desafío como completado
                const updated = await prisma.challenge.update(stryMutAct_9fa48("8213") ? {} : (stryCov_9fa48("8213"), {
                  where: stryMutAct_9fa48("8214") ? {} : (stryCov_9fa48("8214"), {
                    id
                  }),
                  data: stryMutAct_9fa48("8215") ? {} : (stryCov_9fa48("8215"), {
                    status: CHALLENGE_STATUS.COMPLETED,
                    challengedAttemptId,
                    winnerId,
                    completedAt: new Date()
                  }),
                  include: getChallengeInclude()
                }));
                return NextResponse.json(stryMutAct_9fa48("8216") ? {} : (stryCov_9fa48("8216"), {
                  challenge: updated
                }));
              }
            }
            return NextResponse.json(stryMutAct_9fa48("8217") ? {} : (stryCov_9fa48("8217"), {
              error: stryMutAct_9fa48("8218") ? "" : (stryCov_9fa48("8218"), 'Acción no válida')
            }), stryMutAct_9fa48("8219") ? {} : (stryCov_9fa48("8219"), {
              status: 400
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8220")) {
            {}
          } else {
            stryCov_9fa48("8220");
            logger.error(stryMutAct_9fa48("8221") ? {} : (stryCov_9fa48("8221"), {
              type: stryMutAct_9fa48("8222") ? "" : (stryCov_9fa48("8222"), 'challenges_patch_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("8223") ? "" : (stryCov_9fa48("8223"), 'Error al actualizar desafío'));
            return NextResponse.json(stryMutAct_9fa48("8224") ? {} : (stryCov_9fa48("8224"), {
              error: stryMutAct_9fa48("8225") ? "" : (stryCov_9fa48("8225"), 'Error al actualizar desafío')
            }), stryMutAct_9fa48("8226") ? {} : (stryCov_9fa48("8226"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}