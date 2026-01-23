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
export const runtime = stryMutAct_9fa48("6085") ? "" : (stryCov_9fa48("6085"), 'nodejs');

/**
 * API para obtener el progreso conjunto de ambos usuarios
 * Muestra estadísticas y últimos exámenes de ambos estudiantes
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("6086")) {
    {}
  } else {
    stryCov_9fa48("6086");
    // Usar 'read' para endpoints de lectura que se llaman frecuentemente desde el dashboard
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6087")) {
        {}
      } else {
        stryCov_9fa48("6087");
        try {
          if (stryMutAct_9fa48("6088")) {
            {}
          } else {
            stryCov_9fa48("6088");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("6091") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("6090") ? false : stryMutAct_9fa48("6089") ? true : (stryCov_9fa48("6089", "6090", "6091"), (stryMutAct_9fa48("6092") ? dbUser?.email : (stryCov_9fa48("6092"), !(stryMutAct_9fa48("6093") ? dbUser.email : (stryCov_9fa48("6093"), dbUser?.email)))) || (stryMutAct_9fa48("6094") ? dbUser.student : (stryCov_9fa48("6094"), !dbUser.student)))) {
              if (stryMutAct_9fa48("6095")) {
                {}
              } else {
                stryCov_9fa48("6095");
                return NextResponse.json(stryMutAct_9fa48("6096") ? {} : (stryCov_9fa48("6096"), {
                  error: stryMutAct_9fa48("6097") ? "" : (stryCov_9fa48("6097"), 'No autorizado')
                }), stryMutAct_9fa48("6098") ? {} : (stryCov_9fa48("6098"), {
                  status: 401
                }));
              }
            }
            const currentStudentId = dbUser.student.id;

            // Obtener todos los estudiantes (solo deberían ser 2)
            const allStudents = await prisma.student.findMany(stryMutAct_9fa48("6099") ? {} : (stryCov_9fa48("6099"), {
              select: stryMutAct_9fa48("6100") ? {} : (stryCov_9fa48("6100"), {
                id: stryMutAct_9fa48("6101") ? false : (stryCov_9fa48("6101"), true),
                nombre: stryMutAct_9fa48("6102") ? false : (stryCov_9fa48("6102"), true),
                user: stryMutAct_9fa48("6103") ? {} : (stryCov_9fa48("6103"), {
                  select: stryMutAct_9fa48("6104") ? {} : (stryCov_9fa48("6104"), {
                    email: stryMutAct_9fa48("6105") ? false : (stryCov_9fa48("6105"), true),
                    name: stryMutAct_9fa48("6106") ? false : (stryCov_9fa48("6106"), true)
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("6107") ? {} : (stryCov_9fa48("6107"), {
                createdAt: stryMutAct_9fa48("6108") ? "" : (stryCov_9fa48("6108"), 'asc')
              })
            }));
            if (stryMutAct_9fa48("6112") ? allStudents.length >= 2 : stryMutAct_9fa48("6111") ? allStudents.length <= 2 : stryMutAct_9fa48("6110") ? false : stryMutAct_9fa48("6109") ? true : (stryCov_9fa48("6109", "6110", "6111", "6112"), allStudents.length < 2)) {
              if (stryMutAct_9fa48("6113")) {
                {}
              } else {
                stryCov_9fa48("6113");
                return NextResponse.json(stryMutAct_9fa48("6114") ? {} : (stryCov_9fa48("6114"), {
                  message: stryMutAct_9fa48("6115") ? "" : (stryCov_9fa48("6115"), 'Se necesitan al menos 2 estudiantes para mostrar progreso conjunto'),
                  progress: null
                }));
              }
            }

            // Encontrar el otro estudiante
            const otherStudent = allStudents.find(stryMutAct_9fa48("6116") ? () => undefined : (stryCov_9fa48("6116"), s => stryMutAct_9fa48("6119") ? s.id === currentStudentId : stryMutAct_9fa48("6118") ? false : stryMutAct_9fa48("6117") ? true : (stryCov_9fa48("6117", "6118", "6119"), s.id !== currentStudentId)));
            if (stryMutAct_9fa48("6122") ? false : stryMutAct_9fa48("6121") ? true : stryMutAct_9fa48("6120") ? otherStudent : (stryCov_9fa48("6120", "6121", "6122"), !otherStudent)) {
              if (stryMutAct_9fa48("6123")) {
                {}
              } else {
                stryCov_9fa48("6123");
                return NextResponse.json(stryMutAct_9fa48("6124") ? {} : (stryCov_9fa48("6124"), {
                  message: stryMutAct_9fa48("6125") ? "" : (stryCov_9fa48("6125"), 'No se encontró el otro estudiante'),
                  progress: null
                }));
              }
            }

            // Función helper para obtener progreso de un estudiante
            const getStudentProgress = async (studentId: string) => {
              if (stryMutAct_9fa48("6126")) {
                {}
              } else {
                stryCov_9fa48("6126");
                // Obtener intentos completados
                const attempts = await prisma.attempt.findMany(stryMutAct_9fa48("6127") ? {} : (stryCov_9fa48("6127"), {
                  where: stryMutAct_9fa48("6128") ? {} : (stryCov_9fa48("6128"), {
                    studentId,
                    estado: stryMutAct_9fa48("6129") ? "" : (stryCov_9fa48("6129"), 'completado')
                  }),
                  select: stryMutAct_9fa48("6130") ? {} : (stryCov_9fa48("6130"), {
                    id: stryMutAct_9fa48("6131") ? false : (stryCov_9fa48("6131"), true),
                    porcentaje: stryMutAct_9fa48("6132") ? false : (stryCov_9fa48("6132"), true),
                    puntajePaes: stryMutAct_9fa48("6133") ? false : (stryCov_9fa48("6133"), true),
                    correctas: stryMutAct_9fa48("6134") ? false : (stryCov_9fa48("6134"), true),
                    totalPreguntas: stryMutAct_9fa48("6135") ? false : (stryCov_9fa48("6135"), true),
                    createdAt: stryMutAct_9fa48("6136") ? false : (stryCov_9fa48("6136"), true),
                    exam: stryMutAct_9fa48("6137") ? {} : (stryCov_9fa48("6137"), {
                      select: stryMutAct_9fa48("6138") ? {} : (stryCov_9fa48("6138"), {
                        id: stryMutAct_9fa48("6139") ? false : (stryCov_9fa48("6139"), true),
                        titulo: stryMutAct_9fa48("6140") ? false : (stryCov_9fa48("6140"), true),
                        subject: stryMutAct_9fa48("6141") ? {} : (stryCov_9fa48("6141"), {
                          select: stryMutAct_9fa48("6142") ? {} : (stryCov_9fa48("6142"), {
                            id: stryMutAct_9fa48("6143") ? false : (stryCov_9fa48("6143"), true),
                            nombre: stryMutAct_9fa48("6144") ? false : (stryCov_9fa48("6144"), true),
                            codigo: stryMutAct_9fa48("6145") ? false : (stryCov_9fa48("6145"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("6146") ? {} : (stryCov_9fa48("6146"), {
                    createdAt: stryMutAct_9fa48("6147") ? "" : (stryCov_9fa48("6147"), 'desc')
                  }),
                  take: 10 // Últimos 10 intentos
                }));

                // Calcular estadísticas
                const totalAttempts = attempts.length;
                const averagePercentage = (stryMutAct_9fa48("6151") ? totalAttempts <= 0 : stryMutAct_9fa48("6150") ? totalAttempts >= 0 : stryMutAct_9fa48("6149") ? false : stryMutAct_9fa48("6148") ? true : (stryCov_9fa48("6148", "6149", "6150", "6151"), totalAttempts > 0)) ? stryMutAct_9fa48("6152") ? attempts.reduce((sum, a) => sum + a.porcentaje, 0) * totalAttempts : (stryCov_9fa48("6152"), attempts.reduce(stryMutAct_9fa48("6153") ? () => undefined : (stryCov_9fa48("6153"), (sum, a) => stryMutAct_9fa48("6154") ? sum - a.porcentaje : (stryCov_9fa48("6154"), sum + a.porcentaje)), 0) / totalAttempts) : 0;
                const bestPercentage = (stryMutAct_9fa48("6158") ? totalAttempts <= 0 : stryMutAct_9fa48("6157") ? totalAttempts >= 0 : stryMutAct_9fa48("6156") ? false : stryMutAct_9fa48("6155") ? true : (stryCov_9fa48("6155", "6156", "6157", "6158"), totalAttempts > 0)) ? stryMutAct_9fa48("6159") ? Math.min(...attempts.map(a => a.porcentaje)) : (stryCov_9fa48("6159"), Math.max(...attempts.map(stryMutAct_9fa48("6160") ? () => undefined : (stryCov_9fa48("6160"), a => a.porcentaje)))) : 0;
                const paesScores = stryMutAct_9fa48("6161") ? attempts.map(a => a.puntajePaes) : (stryCov_9fa48("6161"), attempts.map(stryMutAct_9fa48("6162") ? () => undefined : (stryCov_9fa48("6162"), a => a.puntajePaes)).filter(stryMutAct_9fa48("6163") ? () => undefined : (stryCov_9fa48("6163"), (p): p is number => stryMutAct_9fa48("6166") ? p === null : stryMutAct_9fa48("6165") ? false : stryMutAct_9fa48("6164") ? true : (stryCov_9fa48("6164", "6165", "6166"), p !== null))));
                const averagePaesScore = (stryMutAct_9fa48("6170") ? paesScores.length <= 0 : stryMutAct_9fa48("6169") ? paesScores.length >= 0 : stryMutAct_9fa48("6168") ? false : stryMutAct_9fa48("6167") ? true : (stryCov_9fa48("6167", "6168", "6169", "6170"), paesScores.length > 0)) ? stryMutAct_9fa48("6171") ? paesScores.reduce((a, b) => a + b, 0) * paesScores.length : (stryCov_9fa48("6171"), paesScores.reduce(stryMutAct_9fa48("6172") ? () => undefined : (stryCov_9fa48("6172"), (a, b) => stryMutAct_9fa48("6173") ? a - b : (stryCov_9fa48("6173"), a + b)), 0) / paesScores.length) : null;
                const bestPaesScore = (stryMutAct_9fa48("6177") ? paesScores.length <= 0 : stryMutAct_9fa48("6176") ? paesScores.length >= 0 : stryMutAct_9fa48("6175") ? false : stryMutAct_9fa48("6174") ? true : (stryCov_9fa48("6174", "6175", "6176", "6177"), paesScores.length > 0)) ? stryMutAct_9fa48("6178") ? Math.min(...paesScores) : (stryCov_9fa48("6178"), Math.max(...paesScores)) : null;

                // Obtener métricas por tema
                const metrics = await prisma.performanceMetric.findMany(stryMutAct_9fa48("6179") ? {} : (stryCov_9fa48("6179"), {
                  where: stryMutAct_9fa48("6180") ? {} : (stryCov_9fa48("6180"), {
                    studentId
                  }),
                  select: stryMutAct_9fa48("6181") ? {} : (stryCov_9fa48("6181"), {
                    topicId: stryMutAct_9fa48("6182") ? false : (stryCov_9fa48("6182"), true),
                    porcentaje: stryMutAct_9fa48("6183") ? false : (stryCov_9fa48("6183"), true),
                    totalPreguntas: stryMutAct_9fa48("6184") ? false : (stryCov_9fa48("6184"), true),
                    correctas: stryMutAct_9fa48("6185") ? false : (stryCov_9fa48("6185"), true),
                    topic: stryMutAct_9fa48("6186") ? {} : (stryCov_9fa48("6186"), {
                      select: stryMutAct_9fa48("6187") ? {} : (stryCov_9fa48("6187"), {
                        nombre: stryMutAct_9fa48("6188") ? false : (stryCov_9fa48("6188"), true),
                        subject: stryMutAct_9fa48("6189") ? {} : (stryCov_9fa48("6189"), {
                          select: stryMutAct_9fa48("6190") ? {} : (stryCov_9fa48("6190"), {
                            nombre: stryMutAct_9fa48("6191") ? false : (stryCov_9fa48("6191"), true),
                            codigo: stryMutAct_9fa48("6192") ? false : (stryCov_9fa48("6192"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("6193") ? {} : (stryCov_9fa48("6193"), {
                    porcentaje: stryMutAct_9fa48("6194") ? "" : (stryCov_9fa48("6194"), 'desc')
                  }),
                  take: 5 // Top 5 temas
                }));

                // Calcular tendencia reciente (últimos 5 vs anteriores)
                let trend: 'improving' | 'declining' | 'stable' = stryMutAct_9fa48("6195") ? "" : (stryCov_9fa48("6195"), 'stable');
                if (stryMutAct_9fa48("6199") ? attempts.length < 10 : stryMutAct_9fa48("6198") ? attempts.length > 10 : stryMutAct_9fa48("6197") ? false : stryMutAct_9fa48("6196") ? true : (stryCov_9fa48("6196", "6197", "6198", "6199"), attempts.length >= 10)) {
                  if (stryMutAct_9fa48("6200")) {
                    {}
                  } else {
                    stryCov_9fa48("6200");
                    const recent = stryMutAct_9fa48("6201") ? attempts : (stryCov_9fa48("6201"), attempts.slice(0, 5));
                    const older = stryMutAct_9fa48("6202") ? attempts : (stryCov_9fa48("6202"), attempts.slice(5, 10));
                    const recentAvg = stryMutAct_9fa48("6203") ? recent.reduce((sum, a) => sum + a.porcentaje, 0) * recent.length : (stryCov_9fa48("6203"), recent.reduce(stryMutAct_9fa48("6204") ? () => undefined : (stryCov_9fa48("6204"), (sum, a) => stryMutAct_9fa48("6205") ? sum - a.porcentaje : (stryCov_9fa48("6205"), sum + a.porcentaje)), 0) / recent.length);
                    const olderAvg = stryMutAct_9fa48("6206") ? older.reduce((sum, a) => sum + a.porcentaje, 0) * older.length : (stryCov_9fa48("6206"), older.reduce(stryMutAct_9fa48("6207") ? () => undefined : (stryCov_9fa48("6207"), (sum, a) => stryMutAct_9fa48("6208") ? sum - a.porcentaje : (stryCov_9fa48("6208"), sum + a.porcentaje)), 0) / older.length);
                    const diff = stryMutAct_9fa48("6209") ? recentAvg + olderAvg : (stryCov_9fa48("6209"), recentAvg - olderAvg);
                    if (stryMutAct_9fa48("6213") ? diff <= 2 : stryMutAct_9fa48("6212") ? diff >= 2 : stryMutAct_9fa48("6211") ? false : stryMutAct_9fa48("6210") ? true : (stryCov_9fa48("6210", "6211", "6212", "6213"), diff > 2)) trend = stryMutAct_9fa48("6214") ? "" : (stryCov_9fa48("6214"), 'improving');else if (stryMutAct_9fa48("6218") ? diff >= -2 : stryMutAct_9fa48("6217") ? diff <= -2 : stryMutAct_9fa48("6216") ? false : stryMutAct_9fa48("6215") ? true : (stryCov_9fa48("6215", "6216", "6217", "6218"), diff < (stryMutAct_9fa48("6219") ? +2 : (stryCov_9fa48("6219"), -2)))) trend = stryMutAct_9fa48("6220") ? "" : (stryCov_9fa48("6220"), 'declining');
                  }
                }
                return stryMutAct_9fa48("6221") ? {} : (stryCov_9fa48("6221"), {
                  totalAttempts,
                  averagePercentage,
                  bestPercentage,
                  averagePaesScore,
                  bestPaesScore,
                  recentAttempts: stryMutAct_9fa48("6222") ? attempts : (stryCov_9fa48("6222"), attempts.slice(0, 5)),
                  // Últimos 5 para mostrar
                  topTopics: metrics,
                  trend
                });
              }
            };

            // Obtener progreso de ambos estudiantes en paralelo
            const [currentProgress, otherProgress] = await Promise.all(stryMutAct_9fa48("6223") ? [] : (stryCov_9fa48("6223"), [getStudentProgress(currentStudentId), getStudentProgress(otherStudent.id)]));
            return NextResponse.json(stryMutAct_9fa48("6224") ? {} : (stryCov_9fa48("6224"), {
              current: stryMutAct_9fa48("6225") ? {} : (stryCov_9fa48("6225"), {
                student: stryMutAct_9fa48("6226") ? {} : (stryCov_9fa48("6226"), {
                  id: dbUser.student.id,
                  nombre: dbUser.student.nombre,
                  email: dbUser.email
                }),
                progress: currentProgress
              }),
              other: stryMutAct_9fa48("6227") ? {} : (stryCov_9fa48("6227"), {
                student: stryMutAct_9fa48("6228") ? {} : (stryCov_9fa48("6228"), {
                  id: otherStudent.id,
                  nombre: otherStudent.nombre,
                  email: stryMutAct_9fa48("6231") ? otherStudent.user?.email && null : stryMutAct_9fa48("6230") ? false : stryMutAct_9fa48("6229") ? true : (stryCov_9fa48("6229", "6230", "6231"), (stryMutAct_9fa48("6232") ? otherStudent.user.email : (stryCov_9fa48("6232"), otherStudent.user?.email)) || null)
                }),
                progress: otherProgress
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6233")) {
            {}
          } else {
            stryCov_9fa48("6233");
            logger.error(stryMutAct_9fa48("6234") ? {} : (stryCov_9fa48("6234"), {
              type: stryMutAct_9fa48("6235") ? "" : (stryCov_9fa48("6235"), 'analytics_joint_progress_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("6236") ? "" : (stryCov_9fa48("6236"), 'Error al calcular progreso conjunto'));
            return NextResponse.json(stryMutAct_9fa48("6237") ? {} : (stryCov_9fa48("6237"), {
              error: stryMutAct_9fa48("6238") ? "" : (stryCov_9fa48("6238"), 'Error al calcular progreso conjunto')
            }), stryMutAct_9fa48("6239") ? {} : (stryCov_9fa48("6239"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("6240") ? "" : (stryCov_9fa48("6240"), 'read'));
  }
}