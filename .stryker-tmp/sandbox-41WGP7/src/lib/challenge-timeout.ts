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
import { prisma } from './prisma';
import { logger } from './logger';
import { CHALLENGE_TIMEOUT_DAYS, CHALLENGE_EXPIRING_WARNING_DAYS } from './challenge-constants';

/**
 * Cancela automáticamente desafíos pendientes que han expirado
 * Esta función debe ser llamada periódicamente (ej: cron job o al iniciar la app)
 */
export async function cancelExpiredChallenges() {
  if (stryMutAct_9fa48("23335")) {
    {}
  } else {
    stryCov_9fa48("23335");
    try {
      if (stryMutAct_9fa48("23336")) {
        {}
      } else {
        stryCov_9fa48("23336");
        const expirationDate = new Date();
        stryMutAct_9fa48("23337") ? expirationDate.setTime(expirationDate.getDate() - CHALLENGE_TIMEOUT_DAYS) : (stryCov_9fa48("23337"), expirationDate.setDate(stryMutAct_9fa48("23338") ? expirationDate.getDate() + CHALLENGE_TIMEOUT_DAYS : (stryCov_9fa48("23338"), expirationDate.getDate() - CHALLENGE_TIMEOUT_DAYS)));
        const expiredChallenges = await prisma.challenge.findMany(stryMutAct_9fa48("23339") ? {} : (stryCov_9fa48("23339"), {
          where: stryMutAct_9fa48("23340") ? {} : (stryCov_9fa48("23340"), {
            status: stryMutAct_9fa48("23341") ? "" : (stryCov_9fa48("23341"), 'pending'),
            createdAt: stryMutAct_9fa48("23342") ? {} : (stryCov_9fa48("23342"), {
              lt: expirationDate
            })
          }),
          select: stryMutAct_9fa48("23343") ? {} : (stryCov_9fa48("23343"), {
            id: stryMutAct_9fa48("23344") ? false : (stryCov_9fa48("23344"), true),
            challengerId: stryMutAct_9fa48("23345") ? false : (stryCov_9fa48("23345"), true),
            challengedId: stryMutAct_9fa48("23346") ? false : (stryCov_9fa48("23346"), true),
            createdAt: stryMutAct_9fa48("23347") ? false : (stryCov_9fa48("23347"), true)
          })
        }));
        if (stryMutAct_9fa48("23350") ? expiredChallenges.length !== 0 : stryMutAct_9fa48("23349") ? false : stryMutAct_9fa48("23348") ? true : (stryCov_9fa48("23348", "23349", "23350"), expiredChallenges.length === 0)) {
          if (stryMutAct_9fa48("23351")) {
            {}
          } else {
            stryCov_9fa48("23351");
            return stryMutAct_9fa48("23352") ? {} : (stryCov_9fa48("23352"), {
              cancelled: 0
            });
          }
        }

        // Actualizar todos los desafíos expirados
        const result = await prisma.challenge.updateMany(stryMutAct_9fa48("23353") ? {} : (stryCov_9fa48("23353"), {
          where: stryMutAct_9fa48("23354") ? {} : (stryCov_9fa48("23354"), {
            id: stryMutAct_9fa48("23355") ? {} : (stryCov_9fa48("23355"), {
              in: expiredChallenges.map(stryMutAct_9fa48("23356") ? () => undefined : (stryCov_9fa48("23356"), c => c.id))
            })
          }),
          data: stryMutAct_9fa48("23357") ? {} : (stryCov_9fa48("23357"), {
            status: stryMutAct_9fa48("23358") ? "" : (stryCov_9fa48("23358"), 'cancelled')
          })
        }));
        logger.info(stryMutAct_9fa48("23359") ? {} : (stryCov_9fa48("23359"), {
          type: stryMutAct_9fa48("23360") ? "" : (stryCov_9fa48("23360"), 'challenge_timeout'),
          cancelled: result.count,
          challenges: expiredChallenges.map(stryMutAct_9fa48("23361") ? () => undefined : (stryCov_9fa48("23361"), c => c.id)),
          metrics: stryMutAct_9fa48("23362") ? {} : (stryCov_9fa48("23362"), {
            totalExpired: expiredChallenges.length,
            successfullyCancelled: result.count,
            challengerIds: stryMutAct_9fa48("23363") ? [] : (stryCov_9fa48("23363"), [...new Set(expiredChallenges.map(stryMutAct_9fa48("23364") ? () => undefined : (stryCov_9fa48("23364"), c => c.challengerId)))]),
            challengedIds: stryMutAct_9fa48("23365") ? [] : (stryCov_9fa48("23365"), [...new Set(expiredChallenges.map(stryMutAct_9fa48("23366") ? () => undefined : (stryCov_9fa48("23366"), c => c.challengedId)))])
          })
        }), stryMutAct_9fa48("23367") ? `` : (stryCov_9fa48("23367"), `Se cancelaron ${result.count} desafíos expirados`));
        return stryMutAct_9fa48("23368") ? {} : (stryCov_9fa48("23368"), {
          cancelled: result.count,
          challengeIds: expiredChallenges.map(stryMutAct_9fa48("23369") ? () => undefined : (stryCov_9fa48("23369"), c => c.id))
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("23370")) {
        {}
      } else {
        stryCov_9fa48("23370");
        logger.error(stryMutAct_9fa48("23371") ? {} : (stryCov_9fa48("23371"), {
          type: stryMutAct_9fa48("23372") ? "" : (stryCov_9fa48("23372"), 'challenge_timeout_error'),
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined
        }), stryMutAct_9fa48("23373") ? "" : (stryCov_9fa48("23373"), 'Error al cancelar desafíos expirados'));
        return stryMutAct_9fa48("23374") ? {} : (stryCov_9fa48("23374"), {
          cancelled: 0,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
  }
}

/**
 * Verifica si un desafío está próximo a expirar (dentro de 2 días)
 */
export async function getChallengesExpiringSoon() {
  if (stryMutAct_9fa48("23375")) {
    {}
  } else {
    stryCov_9fa48("23375");
    try {
      if (stryMutAct_9fa48("23376")) {
        {}
      } else {
        stryCov_9fa48("23376");
        const expirationDate = new Date();
        stryMutAct_9fa48("23377") ? expirationDate.setTime(expirationDate.getDate() - CHALLENGE_TIMEOUT_DAYS) : (stryCov_9fa48("23377"), expirationDate.setDate(stryMutAct_9fa48("23378") ? expirationDate.getDate() + CHALLENGE_TIMEOUT_DAYS : (stryCov_9fa48("23378"), expirationDate.getDate() - CHALLENGE_TIMEOUT_DAYS))); // Fecha de expiración

        const warningThreshold = new Date();
        stryMutAct_9fa48("23379") ? warningThreshold.setTime(warningThreshold.getDate() - (CHALLENGE_TIMEOUT_DAYS - CHALLENGE_EXPIRING_WARNING_DAYS)) : (stryCov_9fa48("23379"), warningThreshold.setDate(stryMutAct_9fa48("23380") ? warningThreshold.getDate() + (CHALLENGE_TIMEOUT_DAYS - CHALLENGE_EXPIRING_WARNING_DAYS) : (stryCov_9fa48("23380"), warningThreshold.getDate() - (stryMutAct_9fa48("23381") ? CHALLENGE_TIMEOUT_DAYS + CHALLENGE_EXPIRING_WARNING_DAYS : (stryCov_9fa48("23381"), CHALLENGE_TIMEOUT_DAYS - CHALLENGE_EXPIRING_WARNING_DAYS))))); // 2 días antes de expirar

        const expiringSoon = await prisma.challenge.findMany(stryMutAct_9fa48("23382") ? {} : (stryCov_9fa48("23382"), {
          where: stryMutAct_9fa48("23383") ? {} : (stryCov_9fa48("23383"), {
            status: stryMutAct_9fa48("23384") ? "" : (stryCov_9fa48("23384"), 'pending'),
            createdAt: stryMutAct_9fa48("23385") ? {} : (stryCov_9fa48("23385"), {
              gte: warningThreshold,
              // Creados hace 5 días o más (2 días antes de expirar)
              lt: expirationDate // Pero aún no expirados
            })
          }),
          include: stryMutAct_9fa48("23386") ? {} : (stryCov_9fa48("23386"), {
            challenger: stryMutAct_9fa48("23387") ? {} : (stryCov_9fa48("23387"), {
              select: stryMutAct_9fa48("23388") ? {} : (stryCov_9fa48("23388"), {
                id: stryMutAct_9fa48("23389") ? false : (stryCov_9fa48("23389"), true),
                nombre: stryMutAct_9fa48("23390") ? false : (stryCov_9fa48("23390"), true)
              })
            }),
            challenged: stryMutAct_9fa48("23391") ? {} : (stryCov_9fa48("23391"), {
              select: stryMutAct_9fa48("23392") ? {} : (stryCov_9fa48("23392"), {
                id: stryMutAct_9fa48("23393") ? false : (stryCov_9fa48("23393"), true),
                nombre: stryMutAct_9fa48("23394") ? false : (stryCov_9fa48("23394"), true)
              })
            }),
            exam: stryMutAct_9fa48("23395") ? {} : (stryCov_9fa48("23395"), {
              select: stryMutAct_9fa48("23396") ? {} : (stryCov_9fa48("23396"), {
                id: stryMutAct_9fa48("23397") ? false : (stryCov_9fa48("23397"), true),
                titulo: stryMutAct_9fa48("23398") ? false : (stryCov_9fa48("23398"), true)
              })
            })
          })
        }));
        return expiringSoon;
      }
    } catch (error) {
      if (stryMutAct_9fa48("23399")) {
        {}
      } else {
        stryCov_9fa48("23399");
        logger.error(stryMutAct_9fa48("23400") ? {} : (stryCov_9fa48("23400"), {
          type: stryMutAct_9fa48("23401") ? "" : (stryCov_9fa48("23401"), 'challenge_expiring_soon_error'),
          error: error instanceof Error ? error.message : String(error)
        }), stryMutAct_9fa48("23402") ? "" : (stryCov_9fa48("23402"), 'Error al obtener desafíos próximos a expirar'));
        return stryMutAct_9fa48("23403") ? ["Stryker was here"] : (stryCov_9fa48("23403"), []);
      }
    }
  }
}