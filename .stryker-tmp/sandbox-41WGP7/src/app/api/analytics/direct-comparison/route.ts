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
export const runtime = stryMutAct_9fa48("5675") ? "" : (stryCov_9fa48("5675"), 'nodejs');

/**
 * API para comparación directa entre los 2 usuarios del sistema
 * Compara el usuario actual con el otro usuario (hijo y novia)
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("5676")) {
    {}
  } else {
    stryCov_9fa48("5676");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5677")) {
        {}
      } else {
        stryCov_9fa48("5677");
        try {
          if (stryMutAct_9fa48("5678")) {
            {}
          } else {
            stryCov_9fa48("5678");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("5681") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("5680") ? false : stryMutAct_9fa48("5679") ? true : (stryCov_9fa48("5679", "5680", "5681"), (stryMutAct_9fa48("5682") ? dbUser?.email : (stryCov_9fa48("5682"), !(stryMutAct_9fa48("5683") ? dbUser.email : (stryCov_9fa48("5683"), dbUser?.email)))) || (stryMutAct_9fa48("5684") ? dbUser.student : (stryCov_9fa48("5684"), !dbUser.student)))) {
              if (stryMutAct_9fa48("5685")) {
                {}
              } else {
                stryCov_9fa48("5685");
                return NextResponse.json(stryMutAct_9fa48("5686") ? {} : (stryCov_9fa48("5686"), {
                  error: stryMutAct_9fa48("5687") ? "" : (stryCov_9fa48("5687"), 'No autorizado')
                }), stryMutAct_9fa48("5688") ? {} : (stryCov_9fa48("5688"), {
                  status: 401
                }));
              }
            }
            const currentStudentId = dbUser.student.id;

            // Obtener todos los estudiantes (solo deberían ser 2)
            const allStudents = await prisma.student.findMany(stryMutAct_9fa48("5689") ? {} : (stryCov_9fa48("5689"), {
              select: stryMutAct_9fa48("5690") ? {} : (stryCov_9fa48("5690"), {
                id: stryMutAct_9fa48("5691") ? false : (stryCov_9fa48("5691"), true),
                nombre: stryMutAct_9fa48("5692") ? false : (stryCov_9fa48("5692"), true),
                user: stryMutAct_9fa48("5693") ? {} : (stryCov_9fa48("5693"), {
                  select: stryMutAct_9fa48("5694") ? {} : (stryCov_9fa48("5694"), {
                    email: stryMutAct_9fa48("5695") ? false : (stryCov_9fa48("5695"), true),
                    name: stryMutAct_9fa48("5696") ? false : (stryCov_9fa48("5696"), true)
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("5697") ? {} : (stryCov_9fa48("5697"), {
                createdAt: stryMutAct_9fa48("5698") ? "" : (stryCov_9fa48("5698"), 'asc')
              })
            }));
            if (stryMutAct_9fa48("5702") ? allStudents.length >= 2 : stryMutAct_9fa48("5701") ? allStudents.length <= 2 : stryMutAct_9fa48("5700") ? false : stryMutAct_9fa48("5699") ? true : (stryCov_9fa48("5699", "5700", "5701", "5702"), allStudents.length < 2)) {
              if (stryMutAct_9fa48("5703")) {
                {}
              } else {
                stryCov_9fa48("5703");
                return NextResponse.json(stryMutAct_9fa48("5704") ? {} : (stryCov_9fa48("5704"), {
                  message: stryMutAct_9fa48("5705") ? "" : (stryCov_9fa48("5705"), 'Se necesitan al menos 2 estudiantes para comparar'),
                  comparison: null
                }));
              }
            }

            // Encontrar el otro estudiante (el que no es el actual)
            const otherStudent = allStudents.find(stryMutAct_9fa48("5706") ? () => undefined : (stryCov_9fa48("5706"), s => stryMutAct_9fa48("5709") ? s.id === currentStudentId : stryMutAct_9fa48("5708") ? false : stryMutAct_9fa48("5707") ? true : (stryCov_9fa48("5707", "5708", "5709"), s.id !== currentStudentId)));
            if (stryMutAct_9fa48("5712") ? false : stryMutAct_9fa48("5711") ? true : stryMutAct_9fa48("5710") ? otherStudent : (stryCov_9fa48("5710", "5711", "5712"), !otherStudent)) {
              if (stryMutAct_9fa48("5713")) {
                {}
              } else {
                stryCov_9fa48("5713");
                return NextResponse.json(stryMutAct_9fa48("5714") ? {} : (stryCov_9fa48("5714"), {
                  message: stryMutAct_9fa48("5715") ? "" : (stryCov_9fa48("5715"), 'No se encontró el otro estudiante para comparar'),
                  comparison: null
                }));
              }
            }

            // Obtener intentos completados de ambos estudiantes
            const [currentAttempts, otherAttempts] = await Promise.all(stryMutAct_9fa48("5716") ? [] : (stryCov_9fa48("5716"), [prisma.attempt.findMany(stryMutAct_9fa48("5717") ? {} : (stryCov_9fa48("5717"), {
              where: stryMutAct_9fa48("5718") ? {} : (stryCov_9fa48("5718"), {
                studentId: currentStudentId,
                estado: stryMutAct_9fa48("5719") ? "" : (stryCov_9fa48("5719"), 'completado')
              }),
              select: stryMutAct_9fa48("5720") ? {} : (stryCov_9fa48("5720"), {
                id: stryMutAct_9fa48("5721") ? false : (stryCov_9fa48("5721"), true),
                porcentaje: stryMutAct_9fa48("5722") ? false : (stryCov_9fa48("5722"), true),
                puntajePaes: stryMutAct_9fa48("5723") ? false : (stryCov_9fa48("5723"), true),
                correctas: stryMutAct_9fa48("5724") ? false : (stryCov_9fa48("5724"), true),
                totalPreguntas: stryMutAct_9fa48("5725") ? false : (stryCov_9fa48("5725"), true),
                createdAt: stryMutAct_9fa48("5726") ? false : (stryCov_9fa48("5726"), true),
                exam: stryMutAct_9fa48("5727") ? {} : (stryCov_9fa48("5727"), {
                  select: stryMutAct_9fa48("5728") ? {} : (stryCov_9fa48("5728"), {
                    id: stryMutAct_9fa48("5729") ? false : (stryCov_9fa48("5729"), true),
                    titulo: stryMutAct_9fa48("5730") ? false : (stryCov_9fa48("5730"), true),
                    subject: stryMutAct_9fa48("5731") ? {} : (stryCov_9fa48("5731"), {
                      select: stryMutAct_9fa48("5732") ? {} : (stryCov_9fa48("5732"), {
                        codigo: stryMutAct_9fa48("5733") ? false : (stryCov_9fa48("5733"), true),
                        nombre: stryMutAct_9fa48("5734") ? false : (stryCov_9fa48("5734"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("5735") ? {} : (stryCov_9fa48("5735"), {
                createdAt: stryMutAct_9fa48("5736") ? "" : (stryCov_9fa48("5736"), 'desc')
              })
            })), prisma.attempt.findMany(stryMutAct_9fa48("5737") ? {} : (stryCov_9fa48("5737"), {
              where: stryMutAct_9fa48("5738") ? {} : (stryCov_9fa48("5738"), {
                studentId: otherStudent.id,
                estado: stryMutAct_9fa48("5739") ? "" : (stryCov_9fa48("5739"), 'completado')
              }),
              select: stryMutAct_9fa48("5740") ? {} : (stryCov_9fa48("5740"), {
                id: stryMutAct_9fa48("5741") ? false : (stryCov_9fa48("5741"), true),
                porcentaje: stryMutAct_9fa48("5742") ? false : (stryCov_9fa48("5742"), true),
                puntajePaes: stryMutAct_9fa48("5743") ? false : (stryCov_9fa48("5743"), true),
                correctas: stryMutAct_9fa48("5744") ? false : (stryCov_9fa48("5744"), true),
                totalPreguntas: stryMutAct_9fa48("5745") ? false : (stryCov_9fa48("5745"), true),
                createdAt: stryMutAct_9fa48("5746") ? false : (stryCov_9fa48("5746"), true),
                exam: stryMutAct_9fa48("5747") ? {} : (stryCov_9fa48("5747"), {
                  select: stryMutAct_9fa48("5748") ? {} : (stryCov_9fa48("5748"), {
                    id: stryMutAct_9fa48("5749") ? false : (stryCov_9fa48("5749"), true),
                    titulo: stryMutAct_9fa48("5750") ? false : (stryCov_9fa48("5750"), true),
                    subject: stryMutAct_9fa48("5751") ? {} : (stryCov_9fa48("5751"), {
                      select: stryMutAct_9fa48("5752") ? {} : (stryCov_9fa48("5752"), {
                        codigo: stryMutAct_9fa48("5753") ? false : (stryCov_9fa48("5753"), true),
                        nombre: stryMutAct_9fa48("5754") ? false : (stryCov_9fa48("5754"), true)
                      })
                    })
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("5755") ? {} : (stryCov_9fa48("5755"), {
                createdAt: stryMutAct_9fa48("5756") ? "" : (stryCov_9fa48("5756"), 'desc')
              })
            }))]));

            // Calcular estadísticas generales
            const calculateStats = (attempts: typeof currentAttempts) => {
              if (stryMutAct_9fa48("5757")) {
                {}
              } else {
                stryCov_9fa48("5757");
                if (stryMutAct_9fa48("5760") ? attempts.length !== 0 : stryMutAct_9fa48("5759") ? false : stryMutAct_9fa48("5758") ? true : (stryCov_9fa48("5758", "5759", "5760"), attempts.length === 0)) {
                  if (stryMutAct_9fa48("5761")) {
                    {}
                  } else {
                    stryCov_9fa48("5761");
                    return stryMutAct_9fa48("5762") ? {} : (stryCov_9fa48("5762"), {
                      totalAttempts: 0,
                      averagePercentage: 0,
                      bestPercentage: 0,
                      worstPercentage: 0,
                      averagePaesScore: null,
                      bestPaesScore: null,
                      totalCorrect: 0,
                      totalQuestions: 0,
                      recentTrend: 'stable' as const
                    });
                  }
                }
                const percentages = attempts.map(stryMutAct_9fa48("5763") ? () => undefined : (stryCov_9fa48("5763"), a => a.porcentaje));
                const paesScores = stryMutAct_9fa48("5764") ? attempts.map(a => a.puntajePaes) : (stryCov_9fa48("5764"), attempts.map(stryMutAct_9fa48("5765") ? () => undefined : (stryCov_9fa48("5765"), a => a.puntajePaes)).filter(stryMutAct_9fa48("5766") ? () => undefined : (stryCov_9fa48("5766"), (p): p is number => stryMutAct_9fa48("5769") ? p === null : stryMutAct_9fa48("5768") ? false : stryMutAct_9fa48("5767") ? true : (stryCov_9fa48("5767", "5768", "5769"), p !== null))));

                // Calcular tendencia reciente (últimos 5 vs anteriores)
                const recent = stryMutAct_9fa48("5770") ? attempts : (stryCov_9fa48("5770"), attempts.slice(0, 5));
                const older = stryMutAct_9fa48("5771") ? attempts : (stryCov_9fa48("5771"), attempts.slice(5, 10));
                let recentTrend: 'improving' | 'declining' | 'stable' = stryMutAct_9fa48("5772") ? "" : (stryCov_9fa48("5772"), 'stable');
                if (stryMutAct_9fa48("5775") ? recent.length > 0 || older.length > 0 : stryMutAct_9fa48("5774") ? false : stryMutAct_9fa48("5773") ? true : (stryCov_9fa48("5773", "5774", "5775"), (stryMutAct_9fa48("5778") ? recent.length <= 0 : stryMutAct_9fa48("5777") ? recent.length >= 0 : stryMutAct_9fa48("5776") ? true : (stryCov_9fa48("5776", "5777", "5778"), recent.length > 0)) && (stryMutAct_9fa48("5781") ? older.length <= 0 : stryMutAct_9fa48("5780") ? older.length >= 0 : stryMutAct_9fa48("5779") ? true : (stryCov_9fa48("5779", "5780", "5781"), older.length > 0)))) {
                  if (stryMutAct_9fa48("5782")) {
                    {}
                  } else {
                    stryCov_9fa48("5782");
                    const recentAvg = stryMutAct_9fa48("5783") ? recent.reduce((sum, a) => sum + a.porcentaje, 0) * recent.length : (stryCov_9fa48("5783"), recent.reduce(stryMutAct_9fa48("5784") ? () => undefined : (stryCov_9fa48("5784"), (sum, a) => stryMutAct_9fa48("5785") ? sum - a.porcentaje : (stryCov_9fa48("5785"), sum + a.porcentaje)), 0) / recent.length);
                    const olderAvg = stryMutAct_9fa48("5786") ? older.reduce((sum, a) => sum + a.porcentaje, 0) * older.length : (stryCov_9fa48("5786"), older.reduce(stryMutAct_9fa48("5787") ? () => undefined : (stryCov_9fa48("5787"), (sum, a) => stryMutAct_9fa48("5788") ? sum - a.porcentaje : (stryCov_9fa48("5788"), sum + a.porcentaje)), 0) / older.length);
                    const diff = stryMutAct_9fa48("5789") ? recentAvg + olderAvg : (stryCov_9fa48("5789"), recentAvg - olderAvg);
                    if (stryMutAct_9fa48("5793") ? diff <= 2 : stryMutAct_9fa48("5792") ? diff >= 2 : stryMutAct_9fa48("5791") ? false : stryMutAct_9fa48("5790") ? true : (stryCov_9fa48("5790", "5791", "5792", "5793"), diff > 2)) recentTrend = stryMutAct_9fa48("5794") ? "" : (stryCov_9fa48("5794"), 'improving');else if (stryMutAct_9fa48("5798") ? diff >= -2 : stryMutAct_9fa48("5797") ? diff <= -2 : stryMutAct_9fa48("5796") ? false : stryMutAct_9fa48("5795") ? true : (stryCov_9fa48("5795", "5796", "5797", "5798"), diff < (stryMutAct_9fa48("5799") ? +2 : (stryCov_9fa48("5799"), -2)))) recentTrend = stryMutAct_9fa48("5800") ? "" : (stryCov_9fa48("5800"), 'declining');
                  }
                }
                return stryMutAct_9fa48("5801") ? {} : (stryCov_9fa48("5801"), {
                  totalAttempts: attempts.length,
                  averagePercentage: stryMutAct_9fa48("5802") ? percentages.reduce((a, b) => a + b, 0) * percentages.length : (stryCov_9fa48("5802"), percentages.reduce(stryMutAct_9fa48("5803") ? () => undefined : (stryCov_9fa48("5803"), (a, b) => stryMutAct_9fa48("5804") ? a - b : (stryCov_9fa48("5804"), a + b)), 0) / percentages.length),
                  bestPercentage: stryMutAct_9fa48("5805") ? Math.min(...percentages) : (stryCov_9fa48("5805"), Math.max(...percentages)),
                  worstPercentage: stryMutAct_9fa48("5806") ? Math.max(...percentages) : (stryCov_9fa48("5806"), Math.min(...percentages)),
                  averagePaesScore: (stryMutAct_9fa48("5810") ? paesScores.length <= 0 : stryMutAct_9fa48("5809") ? paesScores.length >= 0 : stryMutAct_9fa48("5808") ? false : stryMutAct_9fa48("5807") ? true : (stryCov_9fa48("5807", "5808", "5809", "5810"), paesScores.length > 0)) ? stryMutAct_9fa48("5811") ? paesScores.reduce((a, b) => a + b, 0) * paesScores.length : (stryCov_9fa48("5811"), paesScores.reduce(stryMutAct_9fa48("5812") ? () => undefined : (stryCov_9fa48("5812"), (a, b) => stryMutAct_9fa48("5813") ? a - b : (stryCov_9fa48("5813"), a + b)), 0) / paesScores.length) : null,
                  bestPaesScore: (stryMutAct_9fa48("5817") ? paesScores.length <= 0 : stryMutAct_9fa48("5816") ? paesScores.length >= 0 : stryMutAct_9fa48("5815") ? false : stryMutAct_9fa48("5814") ? true : (stryCov_9fa48("5814", "5815", "5816", "5817"), paesScores.length > 0)) ? stryMutAct_9fa48("5818") ? Math.min(...paesScores) : (stryCov_9fa48("5818"), Math.max(...paesScores)) : null,
                  totalCorrect: attempts.reduce(stryMutAct_9fa48("5819") ? () => undefined : (stryCov_9fa48("5819"), (sum, a) => stryMutAct_9fa48("5820") ? sum - a.correctas : (stryCov_9fa48("5820"), sum + a.correctas)), 0),
                  totalQuestions: attempts.reduce(stryMutAct_9fa48("5821") ? () => undefined : (stryCov_9fa48("5821"), (sum, a) => stryMutAct_9fa48("5822") ? sum - a.totalPreguntas : (stryCov_9fa48("5822"), sum + a.totalPreguntas)), 0),
                  recentTrend
                });
              }
            };
            const currentStats = calculateStats(currentAttempts);
            const otherStats = calculateStats(otherAttempts);

            // Calcular estadísticas por asignatura
            const calculateSubjectStats = (attempts: typeof currentAttempts) => {
              if (stryMutAct_9fa48("5823")) {
                {}
              } else {
                stryCov_9fa48("5823");
                const bySubject = new Map<string, {
                  subjectCode: string;
                  subjectName: string;
                  attempts: typeof attempts;
                }>();
                attempts.forEach(attempt => {
                  if (stryMutAct_9fa48("5824")) {
                    {}
                  } else {
                    stryCov_9fa48("5824");
                    const code = attempt.exam.subject.codigo;
                    if (stryMutAct_9fa48("5827") ? false : stryMutAct_9fa48("5826") ? true : stryMutAct_9fa48("5825") ? bySubject.has(code) : (stryCov_9fa48("5825", "5826", "5827"), !bySubject.has(code))) {
                      if (stryMutAct_9fa48("5828")) {
                        {}
                      } else {
                        stryCov_9fa48("5828");
                        bySubject.set(code, stryMutAct_9fa48("5829") ? {} : (stryCov_9fa48("5829"), {
                          subjectCode: code,
                          subjectName: attempt.exam.subject.nombre,
                          attempts: stryMutAct_9fa48("5830") ? ["Stryker was here"] : (stryCov_9fa48("5830"), [])
                        }));
                      }
                    }
                    bySubject.get(code)!.attempts.push(attempt);
                  }
                });
                return Array.from(bySubject.values()).map(subject => {
                  if (stryMutAct_9fa48("5831")) {
                    {}
                  } else {
                    stryCov_9fa48("5831");
                    const percentages = subject.attempts.map(stryMutAct_9fa48("5832") ? () => undefined : (stryCov_9fa48("5832"), a => a.porcentaje));
                    const paesScores = stryMutAct_9fa48("5833") ? subject.attempts.map(a => a.puntajePaes) : (stryCov_9fa48("5833"), subject.attempts.map(stryMutAct_9fa48("5834") ? () => undefined : (stryCov_9fa48("5834"), a => a.puntajePaes)).filter(stryMutAct_9fa48("5835") ? () => undefined : (stryCov_9fa48("5835"), (p): p is number => stryMutAct_9fa48("5838") ? p === null : stryMutAct_9fa48("5837") ? false : stryMutAct_9fa48("5836") ? true : (stryCov_9fa48("5836", "5837", "5838"), p !== null))));
                    return stryMutAct_9fa48("5839") ? {} : (stryCov_9fa48("5839"), {
                      subjectCode: subject.subjectCode,
                      subjectName: subject.subjectName,
                      totalAttempts: subject.attempts.length,
                      averagePercentage: stryMutAct_9fa48("5840") ? percentages.reduce((a, b) => a + b, 0) * percentages.length : (stryCov_9fa48("5840"), percentages.reduce(stryMutAct_9fa48("5841") ? () => undefined : (stryCov_9fa48("5841"), (a, b) => stryMutAct_9fa48("5842") ? a - b : (stryCov_9fa48("5842"), a + b)), 0) / percentages.length),
                      bestPercentage: stryMutAct_9fa48("5843") ? Math.min(...percentages) : (stryCov_9fa48("5843"), Math.max(...percentages)),
                      averagePaesScore: (stryMutAct_9fa48("5847") ? paesScores.length <= 0 : stryMutAct_9fa48("5846") ? paesScores.length >= 0 : stryMutAct_9fa48("5845") ? false : stryMutAct_9fa48("5844") ? true : (stryCov_9fa48("5844", "5845", "5846", "5847"), paesScores.length > 0)) ? stryMutAct_9fa48("5848") ? paesScores.reduce((a, b) => a + b, 0) * paesScores.length : (stryCov_9fa48("5848"), paesScores.reduce(stryMutAct_9fa48("5849") ? () => undefined : (stryCov_9fa48("5849"), (a, b) => stryMutAct_9fa48("5850") ? a - b : (stryCov_9fa48("5850"), a + b)), 0) / paesScores.length) : null
                    });
                  }
                });
              }
            };
            const currentSubjectStats = calculateSubjectStats(currentAttempts);
            const otherSubjectStats = calculateSubjectStats(otherAttempts);

            // Encontrar exámenes comunes (mismo examen realizado por ambos)
            const currentExamIds = new Set(currentAttempts.map(stryMutAct_9fa48("5851") ? () => undefined : (stryCov_9fa48("5851"), a => a.exam.id)));
            const otherExamIds = new Set(otherAttempts.map(stryMutAct_9fa48("5852") ? () => undefined : (stryCov_9fa48("5852"), a => a.exam.id)));
            const commonExamIds = stryMutAct_9fa48("5853") ? Array.from(currentExamIds) : (stryCov_9fa48("5853"), Array.from(currentExamIds).filter(stryMutAct_9fa48("5854") ? () => undefined : (stryCov_9fa48("5854"), id => otherExamIds.has(id))));
            const commonExams = stryMutAct_9fa48("5855") ? commonExamIds.map(examId => {
              const currentAttempt = currentAttempts.find(a => a.exam.id === examId);
              const otherAttempt = otherAttempts.find(a => a.exam.id === examId);
              if (!currentAttempt || !otherAttempt) return null;
              return {
                examId,
                examTitle: currentAttempt.exam.titulo,
                subject: currentAttempt.exam.subject,
                current: {
                  porcentaje: currentAttempt.porcentaje,
                  puntajePaes: currentAttempt.puntajePaes,
                  correctas: currentAttempt.correctas,
                  totalPreguntas: currentAttempt.totalPreguntas,
                  createdAt: currentAttempt.createdAt
                },
                other: {
                  porcentaje: otherAttempt.porcentaje,
                  puntajePaes: otherAttempt.puntajePaes,
                  correctas: otherAttempt.correctas,
                  totalPreguntas: otherAttempt.totalPreguntas,
                  createdAt: otherAttempt.createdAt
                },
                winner: currentAttempt.porcentaje > otherAttempt.porcentaje ? 'current' : currentAttempt.porcentaje < otherAttempt.porcentaje ? 'other' : 'tie'
              };
            }) : (stryCov_9fa48("5855"), commonExamIds.map(examId => {
              if (stryMutAct_9fa48("5856")) {
                {}
              } else {
                stryCov_9fa48("5856");
                const currentAttempt = currentAttempts.find(stryMutAct_9fa48("5857") ? () => undefined : (stryCov_9fa48("5857"), a => stryMutAct_9fa48("5860") ? a.exam.id !== examId : stryMutAct_9fa48("5859") ? false : stryMutAct_9fa48("5858") ? true : (stryCov_9fa48("5858", "5859", "5860"), a.exam.id === examId)));
                const otherAttempt = otherAttempts.find(stryMutAct_9fa48("5861") ? () => undefined : (stryCov_9fa48("5861"), a => stryMutAct_9fa48("5864") ? a.exam.id !== examId : stryMutAct_9fa48("5863") ? false : stryMutAct_9fa48("5862") ? true : (stryCov_9fa48("5862", "5863", "5864"), a.exam.id === examId)));
                if (stryMutAct_9fa48("5867") ? !currentAttempt && !otherAttempt : stryMutAct_9fa48("5866") ? false : stryMutAct_9fa48("5865") ? true : (stryCov_9fa48("5865", "5866", "5867"), (stryMutAct_9fa48("5868") ? currentAttempt : (stryCov_9fa48("5868"), !currentAttempt)) || (stryMutAct_9fa48("5869") ? otherAttempt : (stryCov_9fa48("5869"), !otherAttempt)))) return null;
                return stryMutAct_9fa48("5870") ? {} : (stryCov_9fa48("5870"), {
                  examId,
                  examTitle: currentAttempt.exam.titulo,
                  subject: currentAttempt.exam.subject,
                  current: stryMutAct_9fa48("5871") ? {} : (stryCov_9fa48("5871"), {
                    porcentaje: currentAttempt.porcentaje,
                    puntajePaes: currentAttempt.puntajePaes,
                    correctas: currentAttempt.correctas,
                    totalPreguntas: currentAttempt.totalPreguntas,
                    createdAt: currentAttempt.createdAt
                  }),
                  other: stryMutAct_9fa48("5872") ? {} : (stryCov_9fa48("5872"), {
                    porcentaje: otherAttempt.porcentaje,
                    puntajePaes: otherAttempt.puntajePaes,
                    correctas: otherAttempt.correctas,
                    totalPreguntas: otherAttempt.totalPreguntas,
                    createdAt: otherAttempt.createdAt
                  }),
                  winner: (stryMutAct_9fa48("5876") ? currentAttempt.porcentaje <= otherAttempt.porcentaje : stryMutAct_9fa48("5875") ? currentAttempt.porcentaje >= otherAttempt.porcentaje : stryMutAct_9fa48("5874") ? false : stryMutAct_9fa48("5873") ? true : (stryCov_9fa48("5873", "5874", "5875", "5876"), currentAttempt.porcentaje > otherAttempt.porcentaje)) ? stryMutAct_9fa48("5877") ? "" : (stryCov_9fa48("5877"), 'current') : (stryMutAct_9fa48("5881") ? currentAttempt.porcentaje >= otherAttempt.porcentaje : stryMutAct_9fa48("5880") ? currentAttempt.porcentaje <= otherAttempt.porcentaje : stryMutAct_9fa48("5879") ? false : stryMutAct_9fa48("5878") ? true : (stryCov_9fa48("5878", "5879", "5880", "5881"), currentAttempt.porcentaje < otherAttempt.porcentaje)) ? stryMutAct_9fa48("5882") ? "" : (stryCov_9fa48("5882"), 'other') : stryMutAct_9fa48("5883") ? "" : (stryCov_9fa48("5883"), 'tie')
                });
              }
            }).filter(stryMutAct_9fa48("5884") ? () => undefined : (stryCov_9fa48("5884"), (e): e is NonNullable<typeof e> => stryMutAct_9fa48("5887") ? e === null : stryMutAct_9fa48("5886") ? false : stryMutAct_9fa48("5885") ? true : (stryCov_9fa48("5885", "5886", "5887"), e !== null))));
            return NextResponse.json(stryMutAct_9fa48("5888") ? {} : (stryCov_9fa48("5888"), {
              current: stryMutAct_9fa48("5889") ? {} : (stryCov_9fa48("5889"), {
                student: stryMutAct_9fa48("5890") ? {} : (stryCov_9fa48("5890"), {
                  id: dbUser.student.id,
                  nombre: dbUser.student.nombre,
                  email: dbUser.email
                }),
                stats: currentStats,
                subjectStats: currentSubjectStats
              }),
              other: stryMutAct_9fa48("5891") ? {} : (stryCov_9fa48("5891"), {
                student: stryMutAct_9fa48("5892") ? {} : (stryCov_9fa48("5892"), {
                  id: otherStudent.id,
                  nombre: otherStudent.nombre,
                  email: stryMutAct_9fa48("5895") ? otherStudent.user?.email && null : stryMutAct_9fa48("5894") ? false : stryMutAct_9fa48("5893") ? true : (stryCov_9fa48("5893", "5894", "5895"), (stryMutAct_9fa48("5896") ? otherStudent.user.email : (stryCov_9fa48("5896"), otherStudent.user?.email)) || null)
                }),
                stats: otherStats,
                subjectStats: otherSubjectStats
              }),
              commonExams,
              summary: stryMutAct_9fa48("5897") ? {} : (stryCov_9fa48("5897"), {
                currentWins: stryMutAct_9fa48("5898") ? commonExams.length : (stryCov_9fa48("5898"), commonExams.filter(stryMutAct_9fa48("5899") ? () => undefined : (stryCov_9fa48("5899"), e => stryMutAct_9fa48("5902") ? e.winner !== 'current' : stryMutAct_9fa48("5901") ? false : stryMutAct_9fa48("5900") ? true : (stryCov_9fa48("5900", "5901", "5902"), e.winner === (stryMutAct_9fa48("5903") ? "" : (stryCov_9fa48("5903"), 'current'))))).length),
                otherWins: stryMutAct_9fa48("5904") ? commonExams.length : (stryCov_9fa48("5904"), commonExams.filter(stryMutAct_9fa48("5905") ? () => undefined : (stryCov_9fa48("5905"), e => stryMutAct_9fa48("5908") ? e.winner !== 'other' : stryMutAct_9fa48("5907") ? false : stryMutAct_9fa48("5906") ? true : (stryCov_9fa48("5906", "5907", "5908"), e.winner === (stryMutAct_9fa48("5909") ? "" : (stryCov_9fa48("5909"), 'other'))))).length),
                ties: stryMutAct_9fa48("5910") ? commonExams.length : (stryCov_9fa48("5910"), commonExams.filter(stryMutAct_9fa48("5911") ? () => undefined : (stryCov_9fa48("5911"), e => stryMutAct_9fa48("5914") ? e.winner !== 'tie' : stryMutAct_9fa48("5913") ? false : stryMutAct_9fa48("5912") ? true : (stryCov_9fa48("5912", "5913", "5914"), e.winner === (stryMutAct_9fa48("5915") ? "" : (stryCov_9fa48("5915"), 'tie'))))).length),
                averageDifference: stryMutAct_9fa48("5916") ? currentStats.averagePercentage + otherStats.averagePercentage : (stryCov_9fa48("5916"), currentStats.averagePercentage - otherStats.averagePercentage)
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5917")) {
            {}
          } else {
            stryCov_9fa48("5917");
            logger.error(stryMutAct_9fa48("5918") ? {} : (stryCov_9fa48("5918"), {
              type: stryMutAct_9fa48("5919") ? "" : (stryCov_9fa48("5919"), 'analytics_direct_comparison_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("5920") ? "" : (stryCov_9fa48("5920"), 'Error al calcular comparación directa'));
            return NextResponse.json(stryMutAct_9fa48("5921") ? {} : (stryCov_9fa48("5921"), {
              error: stryMutAct_9fa48("5922") ? "" : (stryCov_9fa48("5922"), 'Error al calcular comparación')
            }), stryMutAct_9fa48("5923") ? {} : (stryCov_9fa48("5923"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}