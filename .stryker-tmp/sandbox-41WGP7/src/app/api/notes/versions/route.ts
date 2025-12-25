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
import { getAuthenticatedUserWithStudent } from '@/lib/get-session';
import { prisma } from '@/lib/prisma';
import { withRateLimit } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

/**
 * GET: Obtener versiones de una nota
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("9136")) {
    {}
  } else {
    stryCov_9fa48("9136");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9137")) {
        {}
      } else {
        stryCov_9fa48("9137");
        try {
          if (stryMutAct_9fa48("9138")) {
            {}
          } else {
            stryCov_9fa48("9138");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9141") ? false : stryMutAct_9fa48("9140") ? true : stryMutAct_9fa48("9139") ? dbUser?.email : (stryCov_9fa48("9139", "9140", "9141"), !(stryMutAct_9fa48("9142") ? dbUser.email : (stryCov_9fa48("9142"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9143")) {
                {}
              } else {
                stryCov_9fa48("9143");
                return NextResponse.json(stryMutAct_9fa48("9144") ? {} : (stryCov_9fa48("9144"), {
                  error: stryMutAct_9fa48("9145") ? "" : (stryCov_9fa48("9145"), 'No autorizado')
                }), stryMutAct_9fa48("9146") ? {} : (stryCov_9fa48("9146"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9149") ? false : stryMutAct_9fa48("9148") ? true : stryMutAct_9fa48("9147") ? dbUser.student : (stryCov_9fa48("9147", "9148", "9149"), !dbUser.student)) {
              if (stryMutAct_9fa48("9150")) {
                {}
              } else {
                stryCov_9fa48("9150");
                return NextResponse.json(stryMutAct_9fa48("9151") ? {} : (stryCov_9fa48("9151"), {
                  error: stryMutAct_9fa48("9152") ? "" : (stryCov_9fa48("9152"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9153") ? {} : (stryCov_9fa48("9153"), {
                  status: 404
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const noteId = searchParams.get(stryMutAct_9fa48("9154") ? "" : (stryCov_9fa48("9154"), 'noteId'));
            if (stryMutAct_9fa48("9157") ? false : stryMutAct_9fa48("9156") ? true : stryMutAct_9fa48("9155") ? noteId : (stryCov_9fa48("9155", "9156", "9157"), !noteId)) {
              if (stryMutAct_9fa48("9158")) {
                {}
              } else {
                stryCov_9fa48("9158");
                return NextResponse.json(stryMutAct_9fa48("9159") ? {} : (stryCov_9fa48("9159"), {
                  error: stryMutAct_9fa48("9160") ? "" : (stryCov_9fa48("9160"), 'ID de nota requerido')
                }), stryMutAct_9fa48("9161") ? {} : (stryCov_9fa48("9161"), {
                  status: 400
                }));
              }
            }

            // Verificar que la nota pertenece al estudiante
            const note = await prisma.studyNote.findFirst(stryMutAct_9fa48("9162") ? {} : (stryCov_9fa48("9162"), {
              where: stryMutAct_9fa48("9163") ? {} : (stryCov_9fa48("9163"), {
                id: noteId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("9166") ? false : stryMutAct_9fa48("9165") ? true : stryMutAct_9fa48("9164") ? note : (stryCov_9fa48("9164", "9165", "9166"), !note)) {
              if (stryMutAct_9fa48("9167")) {
                {}
              } else {
                stryCov_9fa48("9167");
                return NextResponse.json(stryMutAct_9fa48("9168") ? {} : (stryCov_9fa48("9168"), {
                  error: stryMutAct_9fa48("9169") ? "" : (stryCov_9fa48("9169"), 'Nota no encontrada')
                }), stryMutAct_9fa48("9170") ? {} : (stryCov_9fa48("9170"), {
                  status: 404
                }));
              }
            }

            // Obtener versiones (simulado - en producción usarías una tabla de versiones)
            // Por ahora, retornamos la nota actual como versión única
            // TODO: Implementar tabla de versiones en la base de datos
            const versions = stryMutAct_9fa48("9171") ? [] : (stryCov_9fa48("9171"), [stryMutAct_9fa48("9172") ? {} : (stryCov_9fa48("9172"), {
              id: note.id,
              title: note.title,
              content: note.content,
              tags: note.tags,
              createdAt: note.updatedAt,
              createdBy: dbUser.student.id
            })]);
            return NextResponse.json(stryMutAct_9fa48("9173") ? {} : (stryCov_9fa48("9173"), {
              versions,
              currentVersionId: note.id
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9174")) {
            {}
          } else {
            stryCov_9fa48("9174");
            logger.error(stryMutAct_9fa48("9175") ? {} : (stryCov_9fa48("9175"), {
              error,
              context: stryMutAct_9fa48("9176") ? "" : (stryCov_9fa48("9176"), 'notes/versions/GET')
            }), stryMutAct_9fa48("9177") ? "" : (stryCov_9fa48("9177"), 'Error al obtener versiones'));
            return NextResponse.json(stryMutAct_9fa48("9178") ? {} : (stryCov_9fa48("9178"), {
              error: stryMutAct_9fa48("9179") ? "" : (stryCov_9fa48("9179"), 'Error al obtener versiones')
            }), stryMutAct_9fa48("9180") ? {} : (stryCov_9fa48("9180"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * POST: Restaurar una versión de nota
 */
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("9181")) {
    {}
  } else {
    stryCov_9fa48("9181");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("9182")) {
        {}
      } else {
        stryCov_9fa48("9182");
        try {
          if (stryMutAct_9fa48("9183")) {
            {}
          } else {
            stryCov_9fa48("9183");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("9186") ? false : stryMutAct_9fa48("9185") ? true : stryMutAct_9fa48("9184") ? dbUser?.email : (stryCov_9fa48("9184", "9185", "9186"), !(stryMutAct_9fa48("9187") ? dbUser.email : (stryCov_9fa48("9187"), dbUser?.email)))) {
              if (stryMutAct_9fa48("9188")) {
                {}
              } else {
                stryCov_9fa48("9188");
                return NextResponse.json(stryMutAct_9fa48("9189") ? {} : (stryCov_9fa48("9189"), {
                  error: stryMutAct_9fa48("9190") ? "" : (stryCov_9fa48("9190"), 'No autorizado')
                }), stryMutAct_9fa48("9191") ? {} : (stryCov_9fa48("9191"), {
                  status: 401
                }));
              }
            }
            if (stryMutAct_9fa48("9194") ? false : stryMutAct_9fa48("9193") ? true : stryMutAct_9fa48("9192") ? dbUser.student : (stryCov_9fa48("9192", "9193", "9194"), !dbUser.student)) {
              if (stryMutAct_9fa48("9195")) {
                {}
              } else {
                stryCov_9fa48("9195");
                return NextResponse.json(stryMutAct_9fa48("9196") ? {} : (stryCov_9fa48("9196"), {
                  error: stryMutAct_9fa48("9197") ? "" : (stryCov_9fa48("9197"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("9198") ? {} : (stryCov_9fa48("9198"), {
                  status: 404
                }));
              }
            }
            const body = await request.json();
            const {
              noteId,
              versionId
            } = body;
            if (stryMutAct_9fa48("9201") ? !noteId && !versionId : stryMutAct_9fa48("9200") ? false : stryMutAct_9fa48("9199") ? true : (stryCov_9fa48("9199", "9200", "9201"), (stryMutAct_9fa48("9202") ? noteId : (stryCov_9fa48("9202"), !noteId)) || (stryMutAct_9fa48("9203") ? versionId : (stryCov_9fa48("9203"), !versionId)))) {
              if (stryMutAct_9fa48("9204")) {
                {}
              } else {
                stryCov_9fa48("9204");
                return NextResponse.json(stryMutAct_9fa48("9205") ? {} : (stryCov_9fa48("9205"), {
                  error: stryMutAct_9fa48("9206") ? "" : (stryCov_9fa48("9206"), 'ID de nota y versión requeridos')
                }), stryMutAct_9fa48("9207") ? {} : (stryCov_9fa48("9207"), {
                  status: 400
                }));
              }
            }

            // Verificar que la nota pertenece al estudiante
            const note = await prisma.studyNote.findFirst(stryMutAct_9fa48("9208") ? {} : (stryCov_9fa48("9208"), {
              where: stryMutAct_9fa48("9209") ? {} : (stryCov_9fa48("9209"), {
                id: noteId,
                studentId: dbUser.student.id
              })
            }));
            if (stryMutAct_9fa48("9212") ? false : stryMutAct_9fa48("9211") ? true : stryMutAct_9fa48("9210") ? note : (stryCov_9fa48("9210", "9211", "9212"), !note)) {
              if (stryMutAct_9fa48("9213")) {
                {}
              } else {
                stryCov_9fa48("9213");
                return NextResponse.json(stryMutAct_9fa48("9214") ? {} : (stryCov_9fa48("9214"), {
                  error: stryMutAct_9fa48("9215") ? "" : (stryCov_9fa48("9215"), 'Nota no encontrada')
                }), stryMutAct_9fa48("9216") ? {} : (stryCov_9fa48("9216"), {
                  status: 404
                }));
              }
            }

            // TODO: Implementar restauración de versiones cuando se tenga tabla de versiones
            // Por ahora, solo retornamos éxito
            // En producción, aquí crearías una nueva versión con el contenido actual
            // y luego restaurarías el contenido de la versión seleccionada

            return NextResponse.json(stryMutAct_9fa48("9217") ? {} : (stryCov_9fa48("9217"), {
              message: stryMutAct_9fa48("9218") ? "" : (stryCov_9fa48("9218"), 'Versión restaurada correctamente')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9219")) {
            {}
          } else {
            stryCov_9fa48("9219");
            logger.error(stryMutAct_9fa48("9220") ? {} : (stryCov_9fa48("9220"), {
              error,
              context: stryMutAct_9fa48("9221") ? "" : (stryCov_9fa48("9221"), 'notes/versions/POST')
            }), stryMutAct_9fa48("9222") ? "" : (stryCov_9fa48("9222"), 'Error al restaurar versión'));
            return NextResponse.json(stryMutAct_9fa48("9223") ? {} : (stryCov_9fa48("9223"), {
              error: stryMutAct_9fa48("9224") ? "" : (stryCov_9fa48("9224"), 'Error al restaurar versión')
            }), stryMutAct_9fa48("9225") ? {} : (stryCov_9fa48("9225"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}