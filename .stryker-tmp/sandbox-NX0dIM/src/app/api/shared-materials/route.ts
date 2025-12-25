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
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("10579") ? "" : (stryCov_9fa48("10579"), 'nodejs');
const shareMaterialSchema = z.object(stryMutAct_9fa48("10580") ? {} : (stryCov_9fa48("10580"), {
  materialId: stryMutAct_9fa48("10581") ? z.string().max(1) : (stryCov_9fa48("10581"), z.string().min(1)),
  message: z.string().optional()
}));

/**
 * GET: Obtener materiales compartidos con el usuario actual
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10582")) {
    {}
  } else {
    stryCov_9fa48("10582");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10583")) {
        {}
      } else {
        stryCov_9fa48("10583");
        try {
          if (stryMutAct_9fa48("10584")) {
            {}
          } else {
            stryCov_9fa48("10584");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10587") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10586") ? false : stryMutAct_9fa48("10585") ? true : (stryCov_9fa48("10585", "10586", "10587"), (stryMutAct_9fa48("10588") ? dbUser?.email : (stryCov_9fa48("10588"), !(stryMutAct_9fa48("10589") ? dbUser.email : (stryCov_9fa48("10589"), dbUser?.email)))) || (stryMutAct_9fa48("10590") ? dbUser.student : (stryCov_9fa48("10590"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10591")) {
                {}
              } else {
                stryCov_9fa48("10591");
                return NextResponse.json(stryMutAct_9fa48("10592") ? {} : (stryCov_9fa48("10592"), {
                  error: stryMutAct_9fa48("10593") ? "" : (stryCov_9fa48("10593"), 'No autorizado')
                }), stryMutAct_9fa48("10594") ? {} : (stryCov_9fa48("10594"), {
                  status: 401
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const type = stryMutAct_9fa48("10597") ? searchParams.get('type') && 'received' : stryMutAct_9fa48("10596") ? false : stryMutAct_9fa48("10595") ? true : (stryCov_9fa48("10595", "10596", "10597"), searchParams.get(stryMutAct_9fa48("10598") ? "" : (stryCov_9fa48("10598"), 'type')) || (stryMutAct_9fa48("10599") ? "" : (stryCov_9fa48("10599"), 'received'))); // 'received' | 'sent'

            if (stryMutAct_9fa48("10602") ? type !== 'received' : stryMutAct_9fa48("10601") ? false : stryMutAct_9fa48("10600") ? true : (stryCov_9fa48("10600", "10601", "10602"), type === (stryMutAct_9fa48("10603") ? "" : (stryCov_9fa48("10603"), 'received')))) {
              if (stryMutAct_9fa48("10604")) {
                {}
              } else {
                stryCov_9fa48("10604");
                // Materiales compartidos CON el usuario actual
                const sharedMaterials = await prisma.sharedMaterial.findMany(stryMutAct_9fa48("10605") ? {} : (stryCov_9fa48("10605"), {
                  where: stryMutAct_9fa48("10606") ? {} : (stryCov_9fa48("10606"), {
                    sharedWithId: dbUser.student.id
                  }),
                  include: stryMutAct_9fa48("10607") ? {} : (stryCov_9fa48("10607"), {
                    material: stryMutAct_9fa48("10608") ? {} : (stryCov_9fa48("10608"), {
                      include: stryMutAct_9fa48("10609") ? {} : (stryCov_9fa48("10609"), {
                        subject: stryMutAct_9fa48("10610") ? {} : (stryCov_9fa48("10610"), {
                          select: stryMutAct_9fa48("10611") ? {} : (stryCov_9fa48("10611"), {
                            id: stryMutAct_9fa48("10612") ? false : (stryCov_9fa48("10612"), true),
                            nombre: stryMutAct_9fa48("10613") ? false : (stryCov_9fa48("10613"), true),
                            codigo: stryMutAct_9fa48("10614") ? false : (stryCov_9fa48("10614"), true)
                          })
                        }),
                        topic: stryMutAct_9fa48("10615") ? {} : (stryCov_9fa48("10615"), {
                          select: stryMutAct_9fa48("10616") ? {} : (stryCov_9fa48("10616"), {
                            id: stryMutAct_9fa48("10617") ? false : (stryCov_9fa48("10617"), true),
                            nombre: stryMutAct_9fa48("10618") ? false : (stryCov_9fa48("10618"), true),
                            ejeTematico: stryMutAct_9fa48("10619") ? false : (stryCov_9fa48("10619"), true)
                          })
                        })
                      })
                    }),
                    sharedBy: stryMutAct_9fa48("10620") ? {} : (stryCov_9fa48("10620"), {
                      select: stryMutAct_9fa48("10621") ? {} : (stryCov_9fa48("10621"), {
                        id: stryMutAct_9fa48("10622") ? false : (stryCov_9fa48("10622"), true),
                        nombre: stryMutAct_9fa48("10623") ? false : (stryCov_9fa48("10623"), true),
                        user: stryMutAct_9fa48("10624") ? {} : (stryCov_9fa48("10624"), {
                          select: stryMutAct_9fa48("10625") ? {} : (stryCov_9fa48("10625"), {
                            email: stryMutAct_9fa48("10626") ? false : (stryCov_9fa48("10626"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("10627") ? {} : (stryCov_9fa48("10627"), {
                    createdAt: stryMutAct_9fa48("10628") ? "" : (stryCov_9fa48("10628"), 'desc')
                  })
                }));
                return NextResponse.json(stryMutAct_9fa48("10629") ? {} : (stryCov_9fa48("10629"), {
                  sharedMaterials
                }));
              }
            } else {
              if (stryMutAct_9fa48("10630")) {
                {}
              } else {
                stryCov_9fa48("10630");
                // Materiales compartidos POR el usuario actual
                const sharedMaterials = await prisma.sharedMaterial.findMany(stryMutAct_9fa48("10631") ? {} : (stryCov_9fa48("10631"), {
                  where: stryMutAct_9fa48("10632") ? {} : (stryCov_9fa48("10632"), {
                    sharedById: dbUser.student.id
                  }),
                  include: stryMutAct_9fa48("10633") ? {} : (stryCov_9fa48("10633"), {
                    material: stryMutAct_9fa48("10634") ? {} : (stryCov_9fa48("10634"), {
                      include: stryMutAct_9fa48("10635") ? {} : (stryCov_9fa48("10635"), {
                        subject: stryMutAct_9fa48("10636") ? {} : (stryCov_9fa48("10636"), {
                          select: stryMutAct_9fa48("10637") ? {} : (stryCov_9fa48("10637"), {
                            id: stryMutAct_9fa48("10638") ? false : (stryCov_9fa48("10638"), true),
                            nombre: stryMutAct_9fa48("10639") ? false : (stryCov_9fa48("10639"), true),
                            codigo: stryMutAct_9fa48("10640") ? false : (stryCov_9fa48("10640"), true)
                          })
                        }),
                        topic: stryMutAct_9fa48("10641") ? {} : (stryCov_9fa48("10641"), {
                          select: stryMutAct_9fa48("10642") ? {} : (stryCov_9fa48("10642"), {
                            id: stryMutAct_9fa48("10643") ? false : (stryCov_9fa48("10643"), true),
                            nombre: stryMutAct_9fa48("10644") ? false : (stryCov_9fa48("10644"), true),
                            ejeTematico: stryMutAct_9fa48("10645") ? false : (stryCov_9fa48("10645"), true)
                          })
                        })
                      })
                    }),
                    sharedWith: stryMutAct_9fa48("10646") ? {} : (stryCov_9fa48("10646"), {
                      select: stryMutAct_9fa48("10647") ? {} : (stryCov_9fa48("10647"), {
                        id: stryMutAct_9fa48("10648") ? false : (stryCov_9fa48("10648"), true),
                        nombre: stryMutAct_9fa48("10649") ? false : (stryCov_9fa48("10649"), true),
                        user: stryMutAct_9fa48("10650") ? {} : (stryCov_9fa48("10650"), {
                          select: stryMutAct_9fa48("10651") ? {} : (stryCov_9fa48("10651"), {
                            email: stryMutAct_9fa48("10652") ? false : (stryCov_9fa48("10652"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("10653") ? {} : (stryCov_9fa48("10653"), {
                    createdAt: stryMutAct_9fa48("10654") ? "" : (stryCov_9fa48("10654"), 'desc')
                  })
                }));
                return NextResponse.json(stryMutAct_9fa48("10655") ? {} : (stryCov_9fa48("10655"), {
                  sharedMaterials
                }));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("10656")) {
            {}
          } else {
            stryCov_9fa48("10656");
            logger.error(stryMutAct_9fa48("10657") ? {} : (stryCov_9fa48("10657"), {
              type: stryMutAct_9fa48("10658") ? "" : (stryCov_9fa48("10658"), 'shared_materials_get_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10659") ? "" : (stryCov_9fa48("10659"), 'Error al obtener materiales compartidos'));
            return NextResponse.json(stryMutAct_9fa48("10660") ? {} : (stryCov_9fa48("10660"), {
              error: stryMutAct_9fa48("10661") ? "" : (stryCov_9fa48("10661"), 'Error al obtener materiales compartidos')
            }), stryMutAct_9fa48("10662") ? {} : (stryCov_9fa48("10662"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * POST: Compartir un material con el otro estudiante
 */
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("10663")) {
    {}
  } else {
    stryCov_9fa48("10663");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10664")) {
        {}
      } else {
        stryCov_9fa48("10664");
        try {
          if (stryMutAct_9fa48("10665")) {
            {}
          } else {
            stryCov_9fa48("10665");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10668") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10667") ? false : stryMutAct_9fa48("10666") ? true : (stryCov_9fa48("10666", "10667", "10668"), (stryMutAct_9fa48("10669") ? dbUser?.email : (stryCov_9fa48("10669"), !(stryMutAct_9fa48("10670") ? dbUser.email : (stryCov_9fa48("10670"), dbUser?.email)))) || (stryMutAct_9fa48("10671") ? dbUser.student : (stryCov_9fa48("10671"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10672")) {
                {}
              } else {
                stryCov_9fa48("10672");
                return NextResponse.json(stryMutAct_9fa48("10673") ? {} : (stryCov_9fa48("10673"), {
                  error: stryMutAct_9fa48("10674") ? "" : (stryCov_9fa48("10674"), 'No autorizado')
                }), stryMutAct_9fa48("10675") ? {} : (stryCov_9fa48("10675"), {
                  status: 401
                }));
              }
            }
            const body = await request.json();
            const validation = shareMaterialSchema.safeParse(body);
            if (stryMutAct_9fa48("10678") ? false : stryMutAct_9fa48("10677") ? true : stryMutAct_9fa48("10676") ? validation.success : (stryCov_9fa48("10676", "10677", "10678"), !validation.success)) {
              if (stryMutAct_9fa48("10679")) {
                {}
              } else {
                stryCov_9fa48("10679");
                return NextResponse.json(stryMutAct_9fa48("10680") ? {} : (stryCov_9fa48("10680"), {
                  error: stryMutAct_9fa48("10681") ? "" : (stryCov_9fa48("10681"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("10682") ? {} : (stryCov_9fa48("10682"), {
                  status: 400
                }));
              }
            }
            const {
              materialId,
              message
            } = validation.data;

            // Verificar que el material existe
            const material = await prisma.studyMaterial.findUnique(stryMutAct_9fa48("10683") ? {} : (stryCov_9fa48("10683"), {
              where: stryMutAct_9fa48("10684") ? {} : (stryCov_9fa48("10684"), {
                id: materialId
              })
            }));
            if (stryMutAct_9fa48("10687") ? false : stryMutAct_9fa48("10686") ? true : stryMutAct_9fa48("10685") ? material : (stryCov_9fa48("10685", "10686", "10687"), !material)) {
              if (stryMutAct_9fa48("10688")) {
                {}
              } else {
                stryCov_9fa48("10688");
                return NextResponse.json(stryMutAct_9fa48("10689") ? {} : (stryCov_9fa48("10689"), {
                  error: stryMutAct_9fa48("10690") ? "" : (stryCov_9fa48("10690"), 'Material no encontrado')
                }), stryMutAct_9fa48("10691") ? {} : (stryCov_9fa48("10691"), {
                  status: 404
                }));
              }
            }

            // Obtener todos los estudiantes para encontrar el otro
            const allStudents = await prisma.student.findMany(stryMutAct_9fa48("10692") ? {} : (stryCov_9fa48("10692"), {
              select: stryMutAct_9fa48("10693") ? {} : (stryCov_9fa48("10693"), {
                id: stryMutAct_9fa48("10694") ? false : (stryCov_9fa48("10694"), true)
              }),
              orderBy: stryMutAct_9fa48("10695") ? {} : (stryCov_9fa48("10695"), {
                createdAt: stryMutAct_9fa48("10696") ? "" : (stryCov_9fa48("10696"), 'asc')
              })
            }));
            if (stryMutAct_9fa48("10700") ? allStudents.length >= 2 : stryMutAct_9fa48("10699") ? allStudents.length <= 2 : stryMutAct_9fa48("10698") ? false : stryMutAct_9fa48("10697") ? true : (stryCov_9fa48("10697", "10698", "10699", "10700"), allStudents.length < 2)) {
              if (stryMutAct_9fa48("10701")) {
                {}
              } else {
                stryCov_9fa48("10701");
                return NextResponse.json(stryMutAct_9fa48("10702") ? {} : (stryCov_9fa48("10702"), {
                  error: stryMutAct_9fa48("10703") ? "" : (stryCov_9fa48("10703"), 'Se necesitan al menos 2 estudiantes para compartir')
                }), stryMutAct_9fa48("10704") ? {} : (stryCov_9fa48("10704"), {
                  status: 400
                }));
              }
            }

            // Encontrar el otro estudiante (el que no es el actual)
            const otherStudent = allStudents.find(stryMutAct_9fa48("10705") ? () => undefined : (stryCov_9fa48("10705"), s => stryMutAct_9fa48("10708") ? s.id === dbUser.student.id : stryMutAct_9fa48("10707") ? false : stryMutAct_9fa48("10706") ? true : (stryCov_9fa48("10706", "10707", "10708"), s.id !== dbUser.student.id)));
            if (stryMutAct_9fa48("10711") ? false : stryMutAct_9fa48("10710") ? true : stryMutAct_9fa48("10709") ? otherStudent : (stryCov_9fa48("10709", "10710", "10711"), !otherStudent)) {
              if (stryMutAct_9fa48("10712")) {
                {}
              } else {
                stryCov_9fa48("10712");
                return NextResponse.json(stryMutAct_9fa48("10713") ? {} : (stryCov_9fa48("10713"), {
                  error: stryMutAct_9fa48("10714") ? "" : (stryCov_9fa48("10714"), 'No se encontró el otro estudiante para compartir')
                }), stryMutAct_9fa48("10715") ? {} : (stryCov_9fa48("10715"), {
                  status: 404
                }));
              }
            }

            // Verificar si ya está compartido
            const existing = await prisma.sharedMaterial.findUnique(stryMutAct_9fa48("10716") ? {} : (stryCov_9fa48("10716"), {
              where: stryMutAct_9fa48("10717") ? {} : (stryCov_9fa48("10717"), {
                materialId_sharedById_sharedWithId: stryMutAct_9fa48("10718") ? {} : (stryCov_9fa48("10718"), {
                  materialId,
                  sharedById: dbUser.student.id,
                  sharedWithId: otherStudent.id
                })
              })
            }));
            if (stryMutAct_9fa48("10720") ? false : stryMutAct_9fa48("10719") ? true : (stryCov_9fa48("10719", "10720"), existing)) {
              if (stryMutAct_9fa48("10721")) {
                {}
              } else {
                stryCov_9fa48("10721");
                return NextResponse.json(stryMutAct_9fa48("10722") ? {} : (stryCov_9fa48("10722"), {
                  error: stryMutAct_9fa48("10723") ? "" : (stryCov_9fa48("10723"), 'Este material ya fue compartido con el otro estudiante')
                }), stryMutAct_9fa48("10724") ? {} : (stryCov_9fa48("10724"), {
                  status: 409
                }));
              }
            }

            // Compartir el material
            const sharedMaterial = await prisma.sharedMaterial.create(stryMutAct_9fa48("10725") ? {} : (stryCov_9fa48("10725"), {
              data: stryMutAct_9fa48("10726") ? {} : (stryCov_9fa48("10726"), {
                materialId,
                sharedById: dbUser.student.id,
                sharedWithId: otherStudent.id,
                message: stryMutAct_9fa48("10729") ? message && null : stryMutAct_9fa48("10728") ? false : stryMutAct_9fa48("10727") ? true : (stryCov_9fa48("10727", "10728", "10729"), message || null)
              }),
              include: stryMutAct_9fa48("10730") ? {} : (stryCov_9fa48("10730"), {
                material: stryMutAct_9fa48("10731") ? {} : (stryCov_9fa48("10731"), {
                  include: stryMutAct_9fa48("10732") ? {} : (stryCov_9fa48("10732"), {
                    subject: stryMutAct_9fa48("10733") ? {} : (stryCov_9fa48("10733"), {
                      select: stryMutAct_9fa48("10734") ? {} : (stryCov_9fa48("10734"), {
                        id: stryMutAct_9fa48("10735") ? false : (stryCov_9fa48("10735"), true),
                        nombre: stryMutAct_9fa48("10736") ? false : (stryCov_9fa48("10736"), true),
                        codigo: stryMutAct_9fa48("10737") ? false : (stryCov_9fa48("10737"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("10738") ? {} : (stryCov_9fa48("10738"), {
                      select: stryMutAct_9fa48("10739") ? {} : (stryCov_9fa48("10739"), {
                        id: stryMutAct_9fa48("10740") ? false : (stryCov_9fa48("10740"), true),
                        nombre: stryMutAct_9fa48("10741") ? false : (stryCov_9fa48("10741"), true),
                        ejeTematico: stryMutAct_9fa48("10742") ? false : (stryCov_9fa48("10742"), true)
                      })
                    })
                  })
                }),
                sharedWith: stryMutAct_9fa48("10743") ? {} : (stryCov_9fa48("10743"), {
                  select: stryMutAct_9fa48("10744") ? {} : (stryCov_9fa48("10744"), {
                    id: stryMutAct_9fa48("10745") ? false : (stryCov_9fa48("10745"), true),
                    nombre: stryMutAct_9fa48("10746") ? false : (stryCov_9fa48("10746"), true)
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10747") ? {} : (stryCov_9fa48("10747"), {
              sharedMaterial,
              message: stryMutAct_9fa48("10748") ? "" : (stryCov_9fa48("10748"), 'Material compartido exitosamente')
            }), stryMutAct_9fa48("10749") ? {} : (stryCov_9fa48("10749"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10750")) {
            {}
          } else {
            stryCov_9fa48("10750");
            logger.error(stryMutAct_9fa48("10751") ? {} : (stryCov_9fa48("10751"), {
              type: stryMutAct_9fa48("10752") ? "" : (stryCov_9fa48("10752"), 'shared_materials_post_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10753") ? "" : (stryCov_9fa48("10753"), 'Error al compartir material'));
            return NextResponse.json(stryMutAct_9fa48("10754") ? {} : (stryCov_9fa48("10754"), {
              error: stryMutAct_9fa48("10755") ? "" : (stryCov_9fa48("10755"), 'Error al compartir material')
            }), stryMutAct_9fa48("10756") ? {} : (stryCov_9fa48("10756"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}