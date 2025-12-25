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
export const runtime = stryMutAct_9fa48("10483") ? "" : (stryCov_9fa48("10483"), 'nodejs');

/**
 * PATCH: Marcar un examen compartido como visto
 */
export async function PATCH(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("10484")) {
    {}
  } else {
    stryCov_9fa48("10484");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10485")) {
        {}
      } else {
        stryCov_9fa48("10485");
        try {
          if (stryMutAct_9fa48("10486")) {
            {}
          } else {
            stryCov_9fa48("10486");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10489") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10488") ? false : stryMutAct_9fa48("10487") ? true : (stryCov_9fa48("10487", "10488", "10489"), (stryMutAct_9fa48("10490") ? dbUser?.email : (stryCov_9fa48("10490"), !(stryMutAct_9fa48("10491") ? dbUser.email : (stryCov_9fa48("10491"), dbUser?.email)))) || (stryMutAct_9fa48("10492") ? dbUser.student : (stryCov_9fa48("10492"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10493")) {
                {}
              } else {
                stryCov_9fa48("10493");
                return NextResponse.json(stryMutAct_9fa48("10494") ? {} : (stryCov_9fa48("10494"), {
                  error: stryMutAct_9fa48("10495") ? "" : (stryCov_9fa48("10495"), 'No autorizado')
                }), stryMutAct_9fa48("10496") ? {} : (stryCov_9fa48("10496"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;

            // Verificar que el examen compartido existe y pertenece al usuario
            const sharedExam = await prisma.sharedExam.findUnique(stryMutAct_9fa48("10497") ? {} : (stryCov_9fa48("10497"), {
              where: stryMutAct_9fa48("10498") ? {} : (stryCov_9fa48("10498"), {
                id
              }),
              include: stryMutAct_9fa48("10499") ? {} : (stryCov_9fa48("10499"), {
                exam: stryMutAct_9fa48("10500") ? false : (stryCov_9fa48("10500"), true)
              })
            }));
            if (stryMutAct_9fa48("10503") ? false : stryMutAct_9fa48("10502") ? true : stryMutAct_9fa48("10501") ? sharedExam : (stryCov_9fa48("10501", "10502", "10503"), !sharedExam)) {
              if (stryMutAct_9fa48("10504")) {
                {}
              } else {
                stryCov_9fa48("10504");
                return NextResponse.json(stryMutAct_9fa48("10505") ? {} : (stryCov_9fa48("10505"), {
                  error: stryMutAct_9fa48("10506") ? "" : (stryCov_9fa48("10506"), 'Examen compartido no encontrado')
                }), stryMutAct_9fa48("10507") ? {} : (stryCov_9fa48("10507"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("10510") ? sharedExam.sharedWithId === dbUser.student.id : stryMutAct_9fa48("10509") ? false : stryMutAct_9fa48("10508") ? true : (stryCov_9fa48("10508", "10509", "10510"), sharedExam.sharedWithId !== dbUser.student.id)) {
              if (stryMutAct_9fa48("10511")) {
                {}
              } else {
                stryCov_9fa48("10511");
                return NextResponse.json(stryMutAct_9fa48("10512") ? {} : (stryCov_9fa48("10512"), {
                  error: stryMutAct_9fa48("10513") ? "" : (stryCov_9fa48("10513"), 'No tienes permiso para esta acción')
                }), stryMutAct_9fa48("10514") ? {} : (stryCov_9fa48("10514"), {
                  status: 403
                }));
              }
            }

            // Marcar como visto
            const updated = await prisma.sharedExam.update(stryMutAct_9fa48("10515") ? {} : (stryCov_9fa48("10515"), {
              where: stryMutAct_9fa48("10516") ? {} : (stryCov_9fa48("10516"), {
                id
              }),
              data: stryMutAct_9fa48("10517") ? {} : (stryCov_9fa48("10517"), {
                viewed: stryMutAct_9fa48("10518") ? false : (stryCov_9fa48("10518"), true),
                viewedAt: new Date()
              }),
              include: stryMutAct_9fa48("10519") ? {} : (stryCov_9fa48("10519"), {
                exam: stryMutAct_9fa48("10520") ? {} : (stryCov_9fa48("10520"), {
                  include: stryMutAct_9fa48("10521") ? {} : (stryCov_9fa48("10521"), {
                    subject: stryMutAct_9fa48("10522") ? {} : (stryCov_9fa48("10522"), {
                      select: stryMutAct_9fa48("10523") ? {} : (stryCov_9fa48("10523"), {
                        id: stryMutAct_9fa48("10524") ? false : (stryCov_9fa48("10524"), true),
                        nombre: stryMutAct_9fa48("10525") ? false : (stryCov_9fa48("10525"), true),
                        codigo: stryMutAct_9fa48("10526") ? false : (stryCov_9fa48("10526"), true)
                      })
                    })
                  })
                }),
                sharedBy: stryMutAct_9fa48("10527") ? {} : (stryCov_9fa48("10527"), {
                  select: stryMutAct_9fa48("10528") ? {} : (stryCov_9fa48("10528"), {
                    id: stryMutAct_9fa48("10529") ? false : (stryCov_9fa48("10529"), true),
                    nombre: stryMutAct_9fa48("10530") ? false : (stryCov_9fa48("10530"), true)
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10531") ? {} : (stryCov_9fa48("10531"), {
              sharedExam: updated
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10532")) {
            {}
          } else {
            stryCov_9fa48("10532");
            logger.error(stryMutAct_9fa48("10533") ? {} : (stryCov_9fa48("10533"), {
              type: stryMutAct_9fa48("10534") ? "" : (stryCov_9fa48("10534"), 'shared_exams_patch_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10535") ? "" : (stryCov_9fa48("10535"), 'Error al marcar examen como visto'));
            return NextResponse.json(stryMutAct_9fa48("10536") ? {} : (stryCov_9fa48("10536"), {
              error: stryMutAct_9fa48("10537") ? "" : (stryCov_9fa48("10537"), 'Error al marcar examen como visto')
            }), stryMutAct_9fa48("10538") ? {} : (stryCov_9fa48("10538"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * DELETE: Dejar de compartir un examen
 */
export async function DELETE(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("10539")) {
    {}
  } else {
    stryCov_9fa48("10539");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10540")) {
        {}
      } else {
        stryCov_9fa48("10540");
        try {
          if (stryMutAct_9fa48("10541")) {
            {}
          } else {
            stryCov_9fa48("10541");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10544") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10543") ? false : stryMutAct_9fa48("10542") ? true : (stryCov_9fa48("10542", "10543", "10544"), (stryMutAct_9fa48("10545") ? dbUser?.email : (stryCov_9fa48("10545"), !(stryMutAct_9fa48("10546") ? dbUser.email : (stryCov_9fa48("10546"), dbUser?.email)))) || (stryMutAct_9fa48("10547") ? dbUser.student : (stryCov_9fa48("10547"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10548")) {
                {}
              } else {
                stryCov_9fa48("10548");
                return NextResponse.json(stryMutAct_9fa48("10549") ? {} : (stryCov_9fa48("10549"), {
                  error: stryMutAct_9fa48("10550") ? "" : (stryCov_9fa48("10550"), 'No autorizado')
                }), stryMutAct_9fa48("10551") ? {} : (stryCov_9fa48("10551"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;

            // Verificar que el examen compartido existe y fue compartido por el usuario
            const sharedExam = await prisma.sharedExam.findUnique(stryMutAct_9fa48("10552") ? {} : (stryCov_9fa48("10552"), {
              where: stryMutAct_9fa48("10553") ? {} : (stryCov_9fa48("10553"), {
                id
              })
            }));
            if (stryMutAct_9fa48("10556") ? false : stryMutAct_9fa48("10555") ? true : stryMutAct_9fa48("10554") ? sharedExam : (stryCov_9fa48("10554", "10555", "10556"), !sharedExam)) {
              if (stryMutAct_9fa48("10557")) {
                {}
              } else {
                stryCov_9fa48("10557");
                return NextResponse.json(stryMutAct_9fa48("10558") ? {} : (stryCov_9fa48("10558"), {
                  error: stryMutAct_9fa48("10559") ? "" : (stryCov_9fa48("10559"), 'Examen compartido no encontrado')
                }), stryMutAct_9fa48("10560") ? {} : (stryCov_9fa48("10560"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("10563") ? sharedExam.sharedById === dbUser.student.id : stryMutAct_9fa48("10562") ? false : stryMutAct_9fa48("10561") ? true : (stryCov_9fa48("10561", "10562", "10563"), sharedExam.sharedById !== dbUser.student.id)) {
              if (stryMutAct_9fa48("10564")) {
                {}
              } else {
                stryCov_9fa48("10564");
                return NextResponse.json(stryMutAct_9fa48("10565") ? {} : (stryCov_9fa48("10565"), {
                  error: stryMutAct_9fa48("10566") ? "" : (stryCov_9fa48("10566"), 'Solo puedes eliminar exámenes que compartiste')
                }), stryMutAct_9fa48("10567") ? {} : (stryCov_9fa48("10567"), {
                  status: 403
                }));
              }
            }

            // Eliminar el compartido
            await prisma.sharedExam.delete(stryMutAct_9fa48("10568") ? {} : (stryCov_9fa48("10568"), {
              where: stryMutAct_9fa48("10569") ? {} : (stryCov_9fa48("10569"), {
                id
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10570") ? {} : (stryCov_9fa48("10570"), {
              message: stryMutAct_9fa48("10571") ? "" : (stryCov_9fa48("10571"), 'Examen dejó de compartirse')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10572")) {
            {}
          } else {
            stryCov_9fa48("10572");
            logger.error(stryMutAct_9fa48("10573") ? {} : (stryCov_9fa48("10573"), {
              type: stryMutAct_9fa48("10574") ? "" : (stryCov_9fa48("10574"), 'shared_exams_delete_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10575") ? "" : (stryCov_9fa48("10575"), 'Error al dejar de compartir examen'));
            return NextResponse.json(stryMutAct_9fa48("10576") ? {} : (stryCov_9fa48("10576"), {
              error: stryMutAct_9fa48("10577") ? "" : (stryCov_9fa48("10577"), 'Error al dejar de compartir examen')
            }), stryMutAct_9fa48("10578") ? {} : (stryCov_9fa48("10578"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}