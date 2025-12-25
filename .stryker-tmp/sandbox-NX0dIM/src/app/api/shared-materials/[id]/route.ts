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
export const runtime = stryMutAct_9fa48("10757") ? "" : (stryCov_9fa48("10757"), 'nodejs');

/**
 * PATCH: Marcar un material compartido como visto
 */
export async function PATCH(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("10758")) {
    {}
  } else {
    stryCov_9fa48("10758");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10759")) {
        {}
      } else {
        stryCov_9fa48("10759");
        try {
          if (stryMutAct_9fa48("10760")) {
            {}
          } else {
            stryCov_9fa48("10760");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10763") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10762") ? false : stryMutAct_9fa48("10761") ? true : (stryCov_9fa48("10761", "10762", "10763"), (stryMutAct_9fa48("10764") ? dbUser?.email : (stryCov_9fa48("10764"), !(stryMutAct_9fa48("10765") ? dbUser.email : (stryCov_9fa48("10765"), dbUser?.email)))) || (stryMutAct_9fa48("10766") ? dbUser.student : (stryCov_9fa48("10766"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10767")) {
                {}
              } else {
                stryCov_9fa48("10767");
                return NextResponse.json(stryMutAct_9fa48("10768") ? {} : (stryCov_9fa48("10768"), {
                  error: stryMutAct_9fa48("10769") ? "" : (stryCov_9fa48("10769"), 'No autorizado')
                }), stryMutAct_9fa48("10770") ? {} : (stryCov_9fa48("10770"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;

            // Verificar que el material compartido existe y pertenece al usuario
            const sharedMaterial = await prisma.sharedMaterial.findUnique(stryMutAct_9fa48("10771") ? {} : (stryCov_9fa48("10771"), {
              where: stryMutAct_9fa48("10772") ? {} : (stryCov_9fa48("10772"), {
                id
              }),
              include: stryMutAct_9fa48("10773") ? {} : (stryCov_9fa48("10773"), {
                material: stryMutAct_9fa48("10774") ? false : (stryCov_9fa48("10774"), true)
              })
            }));
            if (stryMutAct_9fa48("10777") ? false : stryMutAct_9fa48("10776") ? true : stryMutAct_9fa48("10775") ? sharedMaterial : (stryCov_9fa48("10775", "10776", "10777"), !sharedMaterial)) {
              if (stryMutAct_9fa48("10778")) {
                {}
              } else {
                stryCov_9fa48("10778");
                return NextResponse.json(stryMutAct_9fa48("10779") ? {} : (stryCov_9fa48("10779"), {
                  error: stryMutAct_9fa48("10780") ? "" : (stryCov_9fa48("10780"), 'Material compartido no encontrado')
                }), stryMutAct_9fa48("10781") ? {} : (stryCov_9fa48("10781"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("10784") ? sharedMaterial.sharedWithId === dbUser.student.id : stryMutAct_9fa48("10783") ? false : stryMutAct_9fa48("10782") ? true : (stryCov_9fa48("10782", "10783", "10784"), sharedMaterial.sharedWithId !== dbUser.student.id)) {
              if (stryMutAct_9fa48("10785")) {
                {}
              } else {
                stryCov_9fa48("10785");
                return NextResponse.json(stryMutAct_9fa48("10786") ? {} : (stryCov_9fa48("10786"), {
                  error: stryMutAct_9fa48("10787") ? "" : (stryCov_9fa48("10787"), 'No tienes permiso para esta acción')
                }), stryMutAct_9fa48("10788") ? {} : (stryCov_9fa48("10788"), {
                  status: 403
                }));
              }
            }

            // Marcar como visto
            const updated = await prisma.sharedMaterial.update(stryMutAct_9fa48("10789") ? {} : (stryCov_9fa48("10789"), {
              where: stryMutAct_9fa48("10790") ? {} : (stryCov_9fa48("10790"), {
                id
              }),
              data: stryMutAct_9fa48("10791") ? {} : (stryCov_9fa48("10791"), {
                viewed: stryMutAct_9fa48("10792") ? false : (stryCov_9fa48("10792"), true),
                viewedAt: new Date()
              }),
              include: stryMutAct_9fa48("10793") ? {} : (stryCov_9fa48("10793"), {
                material: stryMutAct_9fa48("10794") ? {} : (stryCov_9fa48("10794"), {
                  include: stryMutAct_9fa48("10795") ? {} : (stryCov_9fa48("10795"), {
                    subject: stryMutAct_9fa48("10796") ? {} : (stryCov_9fa48("10796"), {
                      select: stryMutAct_9fa48("10797") ? {} : (stryCov_9fa48("10797"), {
                        id: stryMutAct_9fa48("10798") ? false : (stryCov_9fa48("10798"), true),
                        nombre: stryMutAct_9fa48("10799") ? false : (stryCov_9fa48("10799"), true),
                        codigo: stryMutAct_9fa48("10800") ? false : (stryCov_9fa48("10800"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("10801") ? {} : (stryCov_9fa48("10801"), {
                      select: stryMutAct_9fa48("10802") ? {} : (stryCov_9fa48("10802"), {
                        id: stryMutAct_9fa48("10803") ? false : (stryCov_9fa48("10803"), true),
                        nombre: stryMutAct_9fa48("10804") ? false : (stryCov_9fa48("10804"), true),
                        ejeTematico: stryMutAct_9fa48("10805") ? false : (stryCov_9fa48("10805"), true)
                      })
                    })
                  })
                }),
                sharedBy: stryMutAct_9fa48("10806") ? {} : (stryCov_9fa48("10806"), {
                  select: stryMutAct_9fa48("10807") ? {} : (stryCov_9fa48("10807"), {
                    id: stryMutAct_9fa48("10808") ? false : (stryCov_9fa48("10808"), true),
                    nombre: stryMutAct_9fa48("10809") ? false : (stryCov_9fa48("10809"), true)
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10810") ? {} : (stryCov_9fa48("10810"), {
              sharedMaterial: updated
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10811")) {
            {}
          } else {
            stryCov_9fa48("10811");
            logger.error(stryMutAct_9fa48("10812") ? {} : (stryCov_9fa48("10812"), {
              type: stryMutAct_9fa48("10813") ? "" : (stryCov_9fa48("10813"), 'shared_materials_patch_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10814") ? "" : (stryCov_9fa48("10814"), 'Error al marcar material como visto'));
            return NextResponse.json(stryMutAct_9fa48("10815") ? {} : (stryCov_9fa48("10815"), {
              error: stryMutAct_9fa48("10816") ? "" : (stryCov_9fa48("10816"), 'Error al marcar material como visto')
            }), stryMutAct_9fa48("10817") ? {} : (stryCov_9fa48("10817"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * DELETE: Dejar de compartir un material
 */
export async function DELETE(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("10818")) {
    {}
  } else {
    stryCov_9fa48("10818");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10819")) {
        {}
      } else {
        stryCov_9fa48("10819");
        try {
          if (stryMutAct_9fa48("10820")) {
            {}
          } else {
            stryCov_9fa48("10820");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10823") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10822") ? false : stryMutAct_9fa48("10821") ? true : (stryCov_9fa48("10821", "10822", "10823"), (stryMutAct_9fa48("10824") ? dbUser?.email : (stryCov_9fa48("10824"), !(stryMutAct_9fa48("10825") ? dbUser.email : (stryCov_9fa48("10825"), dbUser?.email)))) || (stryMutAct_9fa48("10826") ? dbUser.student : (stryCov_9fa48("10826"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10827")) {
                {}
              } else {
                stryCov_9fa48("10827");
                return NextResponse.json(stryMutAct_9fa48("10828") ? {} : (stryCov_9fa48("10828"), {
                  error: stryMutAct_9fa48("10829") ? "" : (stryCov_9fa48("10829"), 'No autorizado')
                }), stryMutAct_9fa48("10830") ? {} : (stryCov_9fa48("10830"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;

            // Verificar que el material compartido existe y fue compartido por el usuario
            const sharedMaterial = await prisma.sharedMaterial.findUnique(stryMutAct_9fa48("10831") ? {} : (stryCov_9fa48("10831"), {
              where: stryMutAct_9fa48("10832") ? {} : (stryCov_9fa48("10832"), {
                id
              })
            }));
            if (stryMutAct_9fa48("10835") ? false : stryMutAct_9fa48("10834") ? true : stryMutAct_9fa48("10833") ? sharedMaterial : (stryCov_9fa48("10833", "10834", "10835"), !sharedMaterial)) {
              if (stryMutAct_9fa48("10836")) {
                {}
              } else {
                stryCov_9fa48("10836");
                return NextResponse.json(stryMutAct_9fa48("10837") ? {} : (stryCov_9fa48("10837"), {
                  error: stryMutAct_9fa48("10838") ? "" : (stryCov_9fa48("10838"), 'Material compartido no encontrado')
                }), stryMutAct_9fa48("10839") ? {} : (stryCov_9fa48("10839"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("10842") ? sharedMaterial.sharedById === dbUser.student.id : stryMutAct_9fa48("10841") ? false : stryMutAct_9fa48("10840") ? true : (stryCov_9fa48("10840", "10841", "10842"), sharedMaterial.sharedById !== dbUser.student.id)) {
              if (stryMutAct_9fa48("10843")) {
                {}
              } else {
                stryCov_9fa48("10843");
                return NextResponse.json(stryMutAct_9fa48("10844") ? {} : (stryCov_9fa48("10844"), {
                  error: stryMutAct_9fa48("10845") ? "" : (stryCov_9fa48("10845"), 'Solo puedes eliminar materiales que compartiste')
                }), stryMutAct_9fa48("10846") ? {} : (stryCov_9fa48("10846"), {
                  status: 403
                }));
              }
            }

            // Eliminar el compartido
            await prisma.sharedMaterial.delete(stryMutAct_9fa48("10847") ? {} : (stryCov_9fa48("10847"), {
              where: stryMutAct_9fa48("10848") ? {} : (stryCov_9fa48("10848"), {
                id
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10849") ? {} : (stryCov_9fa48("10849"), {
              message: stryMutAct_9fa48("10850") ? "" : (stryCov_9fa48("10850"), 'Material dejó de compartirse')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10851")) {
            {}
          } else {
            stryCov_9fa48("10851");
            logger.error(stryMutAct_9fa48("10852") ? {} : (stryCov_9fa48("10852"), {
              type: stryMutAct_9fa48("10853") ? "" : (stryCov_9fa48("10853"), 'shared_materials_delete_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10854") ? "" : (stryCov_9fa48("10854"), 'Error al dejar de compartir material'));
            return NextResponse.json(stryMutAct_9fa48("10855") ? {} : (stryCov_9fa48("10855"), {
              error: stryMutAct_9fa48("10856") ? "" : (stryCov_9fa48("10856"), 'Error al dejar de compartir material')
            }), stryMutAct_9fa48("10857") ? {} : (stryCov_9fa48("10857"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}