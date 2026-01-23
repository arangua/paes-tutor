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
import { CHALLENGE_EXPIRING_SOON_DAYS, CHALLENGE_STATUS, PERCENTAGE_MULTIPLIER } from '@/lib/challenge-constants';
export const runtime = stryMutAct_9fa48("8711") ? "" : (stryCov_9fa48("8711"), 'nodejs');

/**
 * GET: Obtener métricas de desafíos
 * Incluye estadísticas sobre desafíos expirados, activos, completados, etc.
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("8712")) {
    {}
  } else {
    stryCov_9fa48("8712");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8713")) {
        {}
      } else {
        stryCov_9fa48("8713");
        try {
          if (stryMutAct_9fa48("8714")) {
            {}
          } else {
            stryCov_9fa48("8714");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("8717") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("8716") ? false : stryMutAct_9fa48("8715") ? true : (stryCov_9fa48("8715", "8716", "8717"), (stryMutAct_9fa48("8718") ? dbUser?.email : (stryCov_9fa48("8718"), !(stryMutAct_9fa48("8719") ? dbUser.email : (stryCov_9fa48("8719"), dbUser?.email)))) || (stryMutAct_9fa48("8720") ? dbUser.student : (stryCov_9fa48("8720"), !dbUser.student)))) {
              if (stryMutAct_9fa48("8721")) {
                {}
              } else {
                stryCov_9fa48("8721");
                return NextResponse.json(stryMutAct_9fa48("8722") ? {} : (stryCov_9fa48("8722"), {
                  error: stryMutAct_9fa48("8723") ? "" : (stryCov_9fa48("8723"), 'No autorizado')
                }), stryMutAct_9fa48("8724") ? {} : (stryCov_9fa48("8724"), {
                  status: 401
                }));
              }
            }
            const studentId = dbUser.student.id;

            // Obtener todas las métricas en paralelo
            const [totalChallenges, activeChallenges, completedChallenges, pendingChallenges, expiredChallenges, userChallenges, userWins, userLosses, userTies] = await Promise.all(stryMutAct_9fa48("8725") ? [] : (stryCov_9fa48("8725"), [
            // Total de desafíos
            prisma.challenge.count(),
            // Desafíos activos (aceptados)
            prisma.challenge.count(stryMutAct_9fa48("8726") ? {} : (stryCov_9fa48("8726"), {
              where: stryMutAct_9fa48("8727") ? {} : (stryCov_9fa48("8727"), {
                status: CHALLENGE_STATUS.ACCEPTED
              })
            })),
            // Desafíos completados
            prisma.challenge.count(stryMutAct_9fa48("8728") ? {} : (stryCov_9fa48("8728"), {
              where: stryMutAct_9fa48("8729") ? {} : (stryCov_9fa48("8729"), {
                status: CHALLENGE_STATUS.COMPLETED
              })
            })),
            // Desafíos pendientes
            prisma.challenge.count(stryMutAct_9fa48("8730") ? {} : (stryCov_9fa48("8730"), {
              where: stryMutAct_9fa48("8731") ? {} : (stryCov_9fa48("8731"), {
                status: CHALLENGE_STATUS.PENDING
              })
            })),
            // Desafíos expirados/cancelados
            prisma.challenge.count(stryMutAct_9fa48("8732") ? {} : (stryCov_9fa48("8732"), {
              where: stryMutAct_9fa48("8733") ? {} : (stryCov_9fa48("8733"), {
                status: CHALLENGE_STATUS.CANCELLED
              })
            })),
            // Desafíos del usuario
            prisma.challenge.count(stryMutAct_9fa48("8734") ? {} : (stryCov_9fa48("8734"), {
              where: stryMutAct_9fa48("8735") ? {} : (stryCov_9fa48("8735"), {
                OR: stryMutAct_9fa48("8736") ? [] : (stryCov_9fa48("8736"), [stryMutAct_9fa48("8737") ? {} : (stryCov_9fa48("8737"), {
                  challengerId: studentId
                }), stryMutAct_9fa48("8738") ? {} : (stryCov_9fa48("8738"), {
                  challengedId: studentId
                })])
              })
            })),
            // Victorias del usuario
            prisma.challenge.count(stryMutAct_9fa48("8739") ? {} : (stryCov_9fa48("8739"), {
              where: stryMutAct_9fa48("8740") ? {} : (stryCov_9fa48("8740"), {
                winnerId: studentId,
                status: CHALLENGE_STATUS.COMPLETED
              })
            })),
            // Derrotas del usuario (completados donde no ganó)
            prisma.challenge.count(stryMutAct_9fa48("8741") ? {} : (stryCov_9fa48("8741"), {
              where: stryMutAct_9fa48("8742") ? {} : (stryCov_9fa48("8742"), {
                status: CHALLENGE_STATUS.COMPLETED,
                OR: stryMutAct_9fa48("8743") ? [] : (stryCov_9fa48("8743"), [stryMutAct_9fa48("8744") ? {} : (stryCov_9fa48("8744"), {
                  challengerId: studentId
                }), stryMutAct_9fa48("8745") ? {} : (stryCov_9fa48("8745"), {
                  challengedId: studentId
                })]),
                AND: stryMutAct_9fa48("8746") ? [] : (stryCov_9fa48("8746"), [stryMutAct_9fa48("8747") ? {} : (stryCov_9fa48("8747"), {
                  winnerId: stryMutAct_9fa48("8748") ? {} : (stryCov_9fa48("8748"), {
                    not: null
                  })
                }), stryMutAct_9fa48("8749") ? {} : (stryCov_9fa48("8749"), {
                  winnerId: stryMutAct_9fa48("8750") ? {} : (stryCov_9fa48("8750"), {
                    not: studentId
                  })
                })])
              })
            })),
            // Empates del usuario
            prisma.challenge.count(stryMutAct_9fa48("8751") ? {} : (stryCov_9fa48("8751"), {
              where: stryMutAct_9fa48("8752") ? {} : (stryCov_9fa48("8752"), {
                status: CHALLENGE_STATUS.COMPLETED,
                OR: stryMutAct_9fa48("8753") ? [] : (stryCov_9fa48("8753"), [stryMutAct_9fa48("8754") ? {} : (stryCov_9fa48("8754"), {
                  challengerId: studentId
                }), stryMutAct_9fa48("8755") ? {} : (stryCov_9fa48("8755"), {
                  challengedId: studentId
                })]),
                winnerId: null
              })
            }))]));

            // Calcular desafíos próximos a expirar
            const expirationThreshold = new Date();
            stryMutAct_9fa48("8756") ? expirationThreshold.setTime(expirationThreshold.getDate() - CHALLENGE_EXPIRING_SOON_DAYS) : (stryCov_9fa48("8756"), expirationThreshold.setDate(stryMutAct_9fa48("8757") ? expirationThreshold.getDate() + CHALLENGE_EXPIRING_SOON_DAYS : (stryCov_9fa48("8757"), expirationThreshold.getDate() - CHALLENGE_EXPIRING_SOON_DAYS)));
            const expiringSoon = await prisma.challenge.count(stryMutAct_9fa48("8758") ? {} : (stryCov_9fa48("8758"), {
              where: stryMutAct_9fa48("8759") ? {} : (stryCov_9fa48("8759"), {
                status: CHALLENGE_STATUS.PENDING,
                createdAt: stryMutAct_9fa48("8760") ? {} : (stryCov_9fa48("8760"), {
                  lt: expirationThreshold
                })
              })
            }));

            // Calcular tasa de aceptación
            const totalProcessed = stryMutAct_9fa48("8761") ? completedChallenges + activeChallenges + pendingChallenges - expiredChallenges : (stryCov_9fa48("8761"), (stryMutAct_9fa48("8762") ? completedChallenges + activeChallenges - pendingChallenges : (stryCov_9fa48("8762"), (stryMutAct_9fa48("8763") ? completedChallenges - activeChallenges : (stryCov_9fa48("8763"), completedChallenges + activeChallenges)) + pendingChallenges)) + expiredChallenges);
            const acceptanceRate = (stryMutAct_9fa48("8767") ? totalProcessed <= 0 : stryMutAct_9fa48("8766") ? totalProcessed >= 0 : stryMutAct_9fa48("8765") ? false : stryMutAct_9fa48("8764") ? true : (stryCov_9fa48("8764", "8765", "8766", "8767"), totalProcessed > 0)) ? stryMutAct_9fa48("8768") ? (completedChallenges + activeChallenges) / totalProcessed / PERCENTAGE_MULTIPLIER : (stryCov_9fa48("8768"), (stryMutAct_9fa48("8769") ? (completedChallenges + activeChallenges) * totalProcessed : (stryCov_9fa48("8769"), (stryMutAct_9fa48("8770") ? completedChallenges - activeChallenges : (stryCov_9fa48("8770"), completedChallenges + activeChallenges)) / totalProcessed)) * PERCENTAGE_MULTIPLIER) : 0;

            // Calcular win rate del usuario
            const userCompletedChallenges = stryMutAct_9fa48("8771") ? userWins + userLosses - userTies : (stryCov_9fa48("8771"), (stryMutAct_9fa48("8772") ? userWins - userLosses : (stryCov_9fa48("8772"), userWins + userLosses)) + userTies);
            const userWinRate = (stryMutAct_9fa48("8776") ? userCompletedChallenges <= 0 : stryMutAct_9fa48("8775") ? userCompletedChallenges >= 0 : stryMutAct_9fa48("8774") ? false : stryMutAct_9fa48("8773") ? true : (stryCov_9fa48("8773", "8774", "8775", "8776"), userCompletedChallenges > 0)) ? stryMutAct_9fa48("8777") ? userWins / userCompletedChallenges / PERCENTAGE_MULTIPLIER : (stryCov_9fa48("8777"), (stryMutAct_9fa48("8778") ? userWins * userCompletedChallenges : (stryCov_9fa48("8778"), userWins / userCompletedChallenges)) * PERCENTAGE_MULTIPLIER) : 0;
            const metrics = stryMutAct_9fa48("8779") ? {} : (stryCov_9fa48("8779"), {
              global: stryMutAct_9fa48("8780") ? {} : (stryCov_9fa48("8780"), {
                total: totalChallenges,
                active: activeChallenges,
                completed: completedChallenges,
                pending: pendingChallenges,
                expired: expiredChallenges,
                expiringSoon,
                acceptanceRate: stryMutAct_9fa48("8781") ? Math.round(acceptanceRate * 100) * 100 : (stryCov_9fa48("8781"), Math.round(stryMutAct_9fa48("8782") ? acceptanceRate / 100 : (stryCov_9fa48("8782"), acceptanceRate * 100)) / 100)
              }),
              user: stryMutAct_9fa48("8783") ? {} : (stryCov_9fa48("8783"), {
                total: userChallenges,
                wins: userWins,
                losses: userLosses,
                ties: userTies,
                winRate: stryMutAct_9fa48("8784") ? Math.round(userWinRate * 100) * 100 : (stryCov_9fa48("8784"), Math.round(stryMutAct_9fa48("8785") ? userWinRate / 100 : (stryCov_9fa48("8785"), userWinRate * 100)) / 100),
                completed: userCompletedChallenges
              }),
              timestamp: new Date().toISOString()
            });
            return NextResponse.json(stryMutAct_9fa48("8786") ? {} : (stryCov_9fa48("8786"), {
              metrics
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8787")) {
            {}
          } else {
            stryCov_9fa48("8787");
            logger.error(stryMutAct_9fa48("8788") ? {} : (stryCov_9fa48("8788"), {
              type: stryMutAct_9fa48("8789") ? "" : (stryCov_9fa48("8789"), 'challenge_metrics_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("8790") ? "" : (stryCov_9fa48("8790"), 'Error al obtener métricas de desafíos'));
            return NextResponse.json(stryMutAct_9fa48("8791") ? {} : (stryCov_9fa48("8791"), {
              error: stryMutAct_9fa48("8792") ? "" : (stryCov_9fa48("8792"), 'Error al obtener métricas')
            }), stryMutAct_9fa48("8793") ? {} : (stryCov_9fa48("8793"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}