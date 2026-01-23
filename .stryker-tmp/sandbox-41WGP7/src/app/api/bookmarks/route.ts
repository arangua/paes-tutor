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
export const runtime = stryMutAct_9fa48("7444") ? "" : (stryCov_9fa48("7444"), 'nodejs');
const createBookmarkSchema = z.object(stryMutAct_9fa48("7445") ? {} : (stryCov_9fa48("7445"), {
  questionId: stryMutAct_9fa48("7446") ? z.string().max(1) : (stryCov_9fa48("7446"), z.string().min(1)),
  notes: z.string().optional()
}));
const getBookmarksQuerySchema = z.object(stryMutAct_9fa48("7447") ? {} : (stryCov_9fa48("7447"), {
  topicId: z.string().cuid().optional(),
  subjectId: z.string().cuid().optional()
}));
const deleteBookmarkQuerySchema = z.object(stryMutAct_9fa48("7448") ? {} : (stryCov_9fa48("7448"), {
  questionId: stryMutAct_9fa48("7449") ? z.string().cuid().max(1) : (stryCov_9fa48("7449"), z.string().cuid().min(1))
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("7450")) {
    {}
  } else {
    stryCov_9fa48("7450");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7451")) {
        {}
      } else {
        stryCov_9fa48("7451");
        try {
          if (stryMutAct_9fa48("7452")) {
            {}
          } else {
            stryCov_9fa48("7452");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7455") ? false : stryMutAct_9fa48("7454") ? true : stryMutAct_9fa48("7453") ? dbUser?.email : (stryCov_9fa48("7453", "7454", "7455"), !(stryMutAct_9fa48("7456") ? dbUser.email : (stryCov_9fa48("7456"), dbUser?.email)))) {
              if (stryMutAct_9fa48("7457")) {
                {}
              } else {
                stryCov_9fa48("7457");
                return NextResponse.json(stryMutAct_9fa48("7458") ? {} : (stryCov_9fa48("7458"), {
                  error: stryMutAct_9fa48("7459") ? "" : (stryCov_9fa48("7459"), 'No autorizado')
                }), stryMutAct_9fa48("7460") ? {} : (stryCov_9fa48("7460"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("7463") ? false : stryMutAct_9fa48("7462") ? true : stryMutAct_9fa48("7461") ? dbUser.student : (stryCov_9fa48("7461", "7462", "7463"), !dbUser.student)) {
              if (stryMutAct_9fa48("7464")) {
                {}
              } else {
                stryCov_9fa48("7464");
                return NextResponse.json(stryMutAct_9fa48("7465") ? {} : (stryCov_9fa48("7465"), {
                  error: stryMutAct_9fa48("7466") ? "" : (stryCov_9fa48("7466"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("7467") ? {} : (stryCov_9fa48("7467"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = getBookmarksQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("7470") ? false : stryMutAct_9fa48("7469") ? true : stryMutAct_9fa48("7468") ? queryValidation.success : (stryCov_9fa48("7468", "7469", "7470"), !queryValidation.success)) {
              if (stryMutAct_9fa48("7471")) {
                {}
              } else {
                stryCov_9fa48("7471");
                return NextResponse.json(stryMutAct_9fa48("7472") ? {} : (stryCov_9fa48("7472"), {
                  error: stryMutAct_9fa48("7473") ? "" : (stryCov_9fa48("7473"), 'Parámetros de consulta inválidos'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("7474") ? {} : (stryCov_9fa48("7474"), {
                  status: 400
                }));
              }
            }
            const {
              topicId,
              subjectId
            } = queryValidation.data;
            const where: {
              studentId: string;
              question?: {
                topicId?: string;
                subjectId?: string;
              };
            } = stryMutAct_9fa48("7475") ? {} : (stryCov_9fa48("7475"), {
              studentId: dbUser.student.id
            });
            if (stryMutAct_9fa48("7478") ? topicId && subjectId : stryMutAct_9fa48("7477") ? false : stryMutAct_9fa48("7476") ? true : (stryCov_9fa48("7476", "7477", "7478"), topicId || subjectId)) {
              if (stryMutAct_9fa48("7479")) {
                {}
              } else {
                stryCov_9fa48("7479");
                where.question = {};
                if (stryMutAct_9fa48("7481") ? false : stryMutAct_9fa48("7480") ? true : (stryCov_9fa48("7480", "7481"), topicId)) {
                  if (stryMutAct_9fa48("7482")) {
                    {}
                  } else {
                    stryCov_9fa48("7482");
                    where.question.topicId = topicId;
                  }
                }
                if (stryMutAct_9fa48("7484") ? false : stryMutAct_9fa48("7483") ? true : (stryCov_9fa48("7483", "7484"), subjectId)) {
                  if (stryMutAct_9fa48("7485")) {
                    {}
                  } else {
                    stryCov_9fa48("7485");
                    where.question.subjectId = subjectId;
                  }
                }
              }
            }
            const bookmarks = await prisma.bookmark.findMany(stryMutAct_9fa48("7486") ? {} : (stryCov_9fa48("7486"), {
              where,
              include: stryMutAct_9fa48("7487") ? {} : (stryCov_9fa48("7487"), {
                question: stryMutAct_9fa48("7488") ? {} : (stryCov_9fa48("7488"), {
                  include: stryMutAct_9fa48("7489") ? {} : (stryCov_9fa48("7489"), {
                    options: stryMutAct_9fa48("7490") ? {} : (stryCov_9fa48("7490"), {
                      orderBy: stryMutAct_9fa48("7491") ? {} : (stryCov_9fa48("7491"), {
                        letra: stryMutAct_9fa48("7492") ? "" : (stryCov_9fa48("7492"), 'asc')
                      })
                    }),
                    subject: stryMutAct_9fa48("7493") ? {} : (stryCov_9fa48("7493"), {
                      select: stryMutAct_9fa48("7494") ? {} : (stryCov_9fa48("7494"), {
                        nombre: stryMutAct_9fa48("7495") ? false : (stryCov_9fa48("7495"), true),
                        codigo: stryMutAct_9fa48("7496") ? false : (stryCov_9fa48("7496"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("7497") ? {} : (stryCov_9fa48("7497"), {
                      select: stryMutAct_9fa48("7498") ? {} : (stryCov_9fa48("7498"), {
                        nombre: stryMutAct_9fa48("7499") ? false : (stryCov_9fa48("7499"), true),
                        ejeTematico: stryMutAct_9fa48("7500") ? false : (stryCov_9fa48("7500"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("7501") ? {} : (stryCov_9fa48("7501"), {
                createdAt: stryMutAct_9fa48("7502") ? "" : (stryCov_9fa48("7502"), 'desc')
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("7503") ? {} : (stryCov_9fa48("7503"), {
              bookmarks
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7504")) {
            {}
          } else {
            stryCov_9fa48("7504");
            logger.error(stryMutAct_9fa48("7505") ? {} : (stryCov_9fa48("7505"), {
              error,
              context: stryMutAct_9fa48("7506") ? "" : (stryCov_9fa48("7506"), 'bookmarks/GET')
            }), stryMutAct_9fa48("7507") ? "" : (stryCov_9fa48("7507"), 'Error al obtener favoritos'));
            return NextResponse.json(stryMutAct_9fa48("7508") ? {} : (stryCov_9fa48("7508"), {
              error: stryMutAct_9fa48("7509") ? "" : (stryCov_9fa48("7509"), 'Error al obtener favoritos')
            }), stryMutAct_9fa48("7510") ? {} : (stryCov_9fa48("7510"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("7511")) {
    {}
  } else {
    stryCov_9fa48("7511");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7512")) {
        {}
      } else {
        stryCov_9fa48("7512");
        try {
          if (stryMutAct_9fa48("7513")) {
            {}
          } else {
            stryCov_9fa48("7513");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7516") ? false : stryMutAct_9fa48("7515") ? true : stryMutAct_9fa48("7514") ? dbUser?.email : (stryCov_9fa48("7514", "7515", "7516"), !(stryMutAct_9fa48("7517") ? dbUser.email : (stryCov_9fa48("7517"), dbUser?.email)))) {
              if (stryMutAct_9fa48("7518")) {
                {}
              } else {
                stryCov_9fa48("7518");
                return NextResponse.json(stryMutAct_9fa48("7519") ? {} : (stryCov_9fa48("7519"), {
                  error: stryMutAct_9fa48("7520") ? "" : (stryCov_9fa48("7520"), 'No autorizado')
                }), stryMutAct_9fa48("7521") ? {} : (stryCov_9fa48("7521"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("7524") ? false : stryMutAct_9fa48("7523") ? true : stryMutAct_9fa48("7522") ? dbUser.student : (stryCov_9fa48("7522", "7523", "7524"), !dbUser.student)) {
              if (stryMutAct_9fa48("7525")) {
                {}
              } else {
                stryCov_9fa48("7525");
                return NextResponse.json(stryMutAct_9fa48("7526") ? {} : (stryCov_9fa48("7526"), {
                  error: stryMutAct_9fa48("7527") ? "" : (stryCov_9fa48("7527"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("7528") ? {} : (stryCov_9fa48("7528"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const validation = createBookmarkSchema.safeParse(body);
            if (stryMutAct_9fa48("7531") ? false : stryMutAct_9fa48("7530") ? true : stryMutAct_9fa48("7529") ? validation.success : (stryCov_9fa48("7529", "7530", "7531"), !validation.success)) {
              if (stryMutAct_9fa48("7532")) {
                {}
              } else {
                stryCov_9fa48("7532");
                return NextResponse.json(stryMutAct_9fa48("7533") ? {} : (stryCov_9fa48("7533"), {
                  error: stryMutAct_9fa48("7534") ? "" : (stryCov_9fa48("7534"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("7535") ? {} : (stryCov_9fa48("7535"), {
                  status: 400
                }));
              }
            }
            const {
              questionId,
              notes
            } = validation.data;

            // Verificar que la pregunta existe
            const question = await prisma.question.findUnique(stryMutAct_9fa48("7536") ? {} : (stryCov_9fa48("7536"), {
              where: stryMutAct_9fa48("7537") ? {} : (stryCov_9fa48("7537"), {
                id: questionId
              })
            }));
            if (stryMutAct_9fa48("7540") ? false : stryMutAct_9fa48("7539") ? true : stryMutAct_9fa48("7538") ? question : (stryCov_9fa48("7538", "7539", "7540"), !question)) {
              if (stryMutAct_9fa48("7541")) {
                {}
              } else {
                stryCov_9fa48("7541");
                return NextResponse.json(stryMutAct_9fa48("7542") ? {} : (stryCov_9fa48("7542"), {
                  error: stryMutAct_9fa48("7543") ? "" : (stryCov_9fa48("7543"), 'Pregunta no encontrada')
                }), stryMutAct_9fa48("7544") ? {} : (stryCov_9fa48("7544"), {
                  status: 404
                }));
              }
            }

            // Verificar si ya existe el bookmark
            const existing = await prisma.bookmark.findUnique(stryMutAct_9fa48("7545") ? {} : (stryCov_9fa48("7545"), {
              where: stryMutAct_9fa48("7546") ? {} : (stryCov_9fa48("7546"), {
                studentId_questionId: stryMutAct_9fa48("7547") ? {} : (stryCov_9fa48("7547"), {
                  studentId: dbUser.student.id,
                  questionId
                })
              })
            }));
            if (stryMutAct_9fa48("7549") ? false : stryMutAct_9fa48("7548") ? true : (stryCov_9fa48("7548", "7549"), existing)) {
              if (stryMutAct_9fa48("7550")) {
                {}
              } else {
                stryCov_9fa48("7550");
                return NextResponse.json(stryMutAct_9fa48("7551") ? {} : (stryCov_9fa48("7551"), {
                  error: stryMutAct_9fa48("7552") ? "" : (stryCov_9fa48("7552"), 'La pregunta ya está en favoritos')
                }), stryMutAct_9fa48("7553") ? {} : (stryCov_9fa48("7553"), {
                  status: 409
                }));
              }
            }
            const bookmark = await prisma.bookmark.create(stryMutAct_9fa48("7554") ? {} : (stryCov_9fa48("7554"), {
              data: stryMutAct_9fa48("7555") ? {} : (stryCov_9fa48("7555"), {
                studentId: dbUser.student.id,
                questionId,
                notes: stryMutAct_9fa48("7558") ? notes && null : stryMutAct_9fa48("7557") ? false : stryMutAct_9fa48("7556") ? true : (stryCov_9fa48("7556", "7557", "7558"), notes || null)
              }),
              include: stryMutAct_9fa48("7559") ? {} : (stryCov_9fa48("7559"), {
                question: stryMutAct_9fa48("7560") ? {} : (stryCov_9fa48("7560"), {
                  include: stryMutAct_9fa48("7561") ? {} : (stryCov_9fa48("7561"), {
                    subject: stryMutAct_9fa48("7562") ? {} : (stryCov_9fa48("7562"), {
                      select: stryMutAct_9fa48("7563") ? {} : (stryCov_9fa48("7563"), {
                        nombre: stryMutAct_9fa48("7564") ? false : (stryCov_9fa48("7564"), true),
                        codigo: stryMutAct_9fa48("7565") ? false : (stryCov_9fa48("7565"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("7566") ? {} : (stryCov_9fa48("7566"), {
                      select: stryMutAct_9fa48("7567") ? {} : (stryCov_9fa48("7567"), {
                        nombre: stryMutAct_9fa48("7568") ? false : (stryCov_9fa48("7568"), true)
                      })
                    })
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("7569") ? {} : (stryCov_9fa48("7569"), {
              bookmark
            }), stryMutAct_9fa48("7570") ? {} : (stryCov_9fa48("7570"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7571")) {
            {}
          } else {
            stryCov_9fa48("7571");
            logger.error(stryMutAct_9fa48("7572") ? {} : (stryCov_9fa48("7572"), {
              error,
              context: stryMutAct_9fa48("7573") ? "" : (stryCov_9fa48("7573"), 'bookmarks/POST')
            }), stryMutAct_9fa48("7574") ? "" : (stryCov_9fa48("7574"), 'Error al crear favorito'));
            return NextResponse.json(stryMutAct_9fa48("7575") ? {} : (stryCov_9fa48("7575"), {
              error: stryMutAct_9fa48("7576") ? "" : (stryCov_9fa48("7576"), 'Error al crear favorito')
            }), stryMutAct_9fa48("7577") ? {} : (stryCov_9fa48("7577"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function DELETE(request: NextRequest) {
  if (stryMutAct_9fa48("7578")) {
    {}
  } else {
    stryCov_9fa48("7578");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7579")) {
        {}
      } else {
        stryCov_9fa48("7579");
        try {
          if (stryMutAct_9fa48("7580")) {
            {}
          } else {
            stryCov_9fa48("7580");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7583") ? false : stryMutAct_9fa48("7582") ? true : stryMutAct_9fa48("7581") ? dbUser?.email : (stryCov_9fa48("7581", "7582", "7583"), !(stryMutAct_9fa48("7584") ? dbUser.email : (stryCov_9fa48("7584"), dbUser?.email)))) {
              if (stryMutAct_9fa48("7585")) {
                {}
              } else {
                stryCov_9fa48("7585");
                return NextResponse.json(stryMutAct_9fa48("7586") ? {} : (stryCov_9fa48("7586"), {
                  error: stryMutAct_9fa48("7587") ? "" : (stryCov_9fa48("7587"), 'No autorizado')
                }), stryMutAct_9fa48("7588") ? {} : (stryCov_9fa48("7588"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("7591") ? false : stryMutAct_9fa48("7590") ? true : stryMutAct_9fa48("7589") ? dbUser.student : (stryCov_9fa48("7589", "7590", "7591"), !dbUser.student)) {
              if (stryMutAct_9fa48("7592")) {
                {}
              } else {
                stryCov_9fa48("7592");
                return NextResponse.json(stryMutAct_9fa48("7593") ? {} : (stryCov_9fa48("7593"), {
                  error: stryMutAct_9fa48("7594") ? "" : (stryCov_9fa48("7594"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("7595") ? {} : (stryCov_9fa48("7595"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const queryParams = Object.fromEntries(searchParams.entries());

            // Validar query parameters
            const queryValidation = deleteBookmarkQuerySchema.safeParse(queryParams);
            if (stryMutAct_9fa48("7598") ? false : stryMutAct_9fa48("7597") ? true : stryMutAct_9fa48("7596") ? queryValidation.success : (stryCov_9fa48("7596", "7597", "7598"), !queryValidation.success)) {
              if (stryMutAct_9fa48("7599")) {
                {}
              } else {
                stryCov_9fa48("7599");
                return NextResponse.json(stryMutAct_9fa48("7600") ? {} : (stryCov_9fa48("7600"), {
                  error: stryMutAct_9fa48("7601") ? "" : (stryCov_9fa48("7601"), 'ID de pregunta inválido'),
                  details: queryValidation.error.errors
                }), stryMutAct_9fa48("7602") ? {} : (stryCov_9fa48("7602"), {
                  status: 400
                }));
              }
            }
            const {
              questionId
            } = queryValidation.data;
            const bookmark = await prisma.bookmark.findUnique(stryMutAct_9fa48("7603") ? {} : (stryCov_9fa48("7603"), {
              where: stryMutAct_9fa48("7604") ? {} : (stryCov_9fa48("7604"), {
                studentId_questionId: stryMutAct_9fa48("7605") ? {} : (stryCov_9fa48("7605"), {
                  studentId: dbUser.student.id,
                  questionId
                })
              })
            }));
            if (stryMutAct_9fa48("7608") ? false : stryMutAct_9fa48("7607") ? true : stryMutAct_9fa48("7606") ? bookmark : (stryCov_9fa48("7606", "7607", "7608"), !bookmark)) {
              if (stryMutAct_9fa48("7609")) {
                {}
              } else {
                stryCov_9fa48("7609");
                return NextResponse.json(stryMutAct_9fa48("7610") ? {} : (stryCov_9fa48("7610"), {
                  error: stryMutAct_9fa48("7611") ? "" : (stryCov_9fa48("7611"), 'Favorito no encontrado')
                }), stryMutAct_9fa48("7612") ? {} : (stryCov_9fa48("7612"), {
                  status: 404
                }));
              }
            }
            await prisma.bookmark.delete(stryMutAct_9fa48("7613") ? {} : (stryCov_9fa48("7613"), {
              where: stryMutAct_9fa48("7614") ? {} : (stryCov_9fa48("7614"), {
                id: bookmark.id
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("7615") ? {} : (stryCov_9fa48("7615"), {
              message: stryMutAct_9fa48("7616") ? "" : (stryCov_9fa48("7616"), 'Favorito eliminado correctamente')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7617")) {
            {}
          } else {
            stryCov_9fa48("7617");
            logger.error(stryMutAct_9fa48("7618") ? {} : (stryCov_9fa48("7618"), {
              error,
              context: stryMutAct_9fa48("7619") ? "" : (stryCov_9fa48("7619"), 'bookmarks/DELETE')
            }), stryMutAct_9fa48("7620") ? "" : (stryCov_9fa48("7620"), 'Error al eliminar favorito'));
            return NextResponse.json(stryMutAct_9fa48("7621") ? {} : (stryCov_9fa48("7621"), {
              error: stryMutAct_9fa48("7622") ? "" : (stryCov_9fa48("7622"), 'Error al eliminar favorito')
            }), stryMutAct_9fa48("7623") ? {} : (stryCov_9fa48("7623"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}