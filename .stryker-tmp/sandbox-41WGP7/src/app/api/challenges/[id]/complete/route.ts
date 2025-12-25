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
import { getChallengeInclude, determineChallengeWinner, validateChallengeAttempt } from '@/lib/challenge-helpers';
import { CHALLENGE_STATUS } from '@/lib/challenge-constants';
import { z } from 'zod';
export const runtime = stryMutAct_9fa48("7856") ? "" : (stryCov_9fa48("7856"), 'nodejs');
const completeChallengeSchema = z.object(stryMutAct_9fa48("7857") ? {} : (stryCov_9fa48("7857"), {
  challengerAttemptId: z.string().optional(),
  // Para cuando el desafiador completa primero
  challengedAttemptId: z.string().optional() // Para cuando el desafiado completa
}));

/**
 * POST: Completar un desafío (cuando ambos han realizado el examen)
 * Este endpoint se llama cuando cualquiera de los dos completa su intento
 */
export async function POST(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("7858")) {
    {}
  } else {
    stryCov_9fa48("7858");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7859")) {
        {}
      } else {
        stryCov_9fa48("7859");
        try {
          if (stryMutAct_9fa48("7860")) {
            {}
          } else {
            stryCov_9fa48("7860");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("7863") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("7862") ? false : stryMutAct_9fa48("7861") ? true : (stryCov_9fa48("7861", "7862", "7863"), (stryMutAct_9fa48("7864") ? dbUser?.email : (stryCov_9fa48("7864"), !(stryMutAct_9fa48("7865") ? dbUser.email : (stryCov_9fa48("7865"), dbUser?.email)))) || (stryMutAct_9fa48("7866") ? dbUser.student : (stryCov_9fa48("7866"), !dbUser.student)))) {
              if (stryMutAct_9fa48("7867")) {
                {}
              } else {
                stryCov_9fa48("7867");
                return NextResponse.json(stryMutAct_9fa48("7868") ? {} : (stryCov_9fa48("7868"), {
                  error: stryMutAct_9fa48("7869") ? "" : (stryCov_9fa48("7869"), 'No autorizado')
                }), stryMutAct_9fa48("7870") ? {} : (stryCov_9fa48("7870"), {
                  status: 401
                }));
              }
            }
            const {
              id
            } = await params;
            const body = await request.json();
            const validation = completeChallengeSchema.safeParse(body);
            if (stryMutAct_9fa48("7873") ? false : stryMutAct_9fa48("7872") ? true : stryMutAct_9fa48("7871") ? validation.success : (stryCov_9fa48("7871", "7872", "7873"), !validation.success)) {
              if (stryMutAct_9fa48("7874")) {
                {}
              } else {
                stryCov_9fa48("7874");
                return NextResponse.json(stryMutAct_9fa48("7875") ? {} : (stryCov_9fa48("7875"), {
                  error: stryMutAct_9fa48("7876") ? "" : (stryCov_9fa48("7876"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("7877") ? {} : (stryCov_9fa48("7877"), {
                  status: 400
                }));
              }
            }
            const {
              challengerAttemptId,
              challengedAttemptId
            } = validation.data;

            // Obtener el desafío
            const challenge = await prisma.challenge.findUnique(stryMutAct_9fa48("7878") ? {} : (stryCov_9fa48("7878"), {
              where: stryMutAct_9fa48("7879") ? {} : (stryCov_9fa48("7879"), {
                id
              }),
              include: stryMutAct_9fa48("7880") ? {} : (stryCov_9fa48("7880"), {
                exam: stryMutAct_9fa48("7881") ? false : (stryCov_9fa48("7881"), true)
              })
            }));
            if (stryMutAct_9fa48("7884") ? false : stryMutAct_9fa48("7883") ? true : stryMutAct_9fa48("7882") ? challenge : (stryCov_9fa48("7882", "7883", "7884"), !challenge)) {
              if (stryMutAct_9fa48("7885")) {
                {}
              } else {
                stryCov_9fa48("7885");
                return NextResponse.json(stryMutAct_9fa48("7886") ? {} : (stryCov_9fa48("7886"), {
                  error: stryMutAct_9fa48("7887") ? "" : (stryCov_9fa48("7887"), 'Desafío no encontrado')
                }), stryMutAct_9fa48("7888") ? {} : (stryCov_9fa48("7888"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("7891") ? challenge.status === CHALLENGE_STATUS.ACCEPTED : stryMutAct_9fa48("7890") ? false : stryMutAct_9fa48("7889") ? true : (stryCov_9fa48("7889", "7890", "7891"), challenge.status !== CHALLENGE_STATUS.ACCEPTED)) {
              if (stryMutAct_9fa48("7892")) {
                {}
              } else {
                stryCov_9fa48("7892");
                return NextResponse.json(stryMutAct_9fa48("7893") ? {} : (stryCov_9fa48("7893"), {
                  error: stryMutAct_9fa48("7894") ? "" : (stryCov_9fa48("7894"), 'El desafío debe estar aceptado para completarlo')
                }), stryMutAct_9fa48("7895") ? {} : (stryCov_9fa48("7895"), {
                  status: 400
                }));
              }
            }

            // Determinar qué intento se está agregando
            let updateData: {
              challengerAttemptId?: string;
              challengedAttemptId?: string;
              status?: string;
              winnerId?: string | null;
              completedAt?: Date;
            } = {};
            if (stryMutAct_9fa48("7897") ? false : stryMutAct_9fa48("7896") ? true : (stryCov_9fa48("7896", "7897"), challengerAttemptId)) {
              if (stryMutAct_9fa48("7898")) {
                {}
              } else {
                stryCov_9fa48("7898");
                // El desafiador completó su intento
                if (stryMutAct_9fa48("7901") ? challenge.challengerId === dbUser.student.id : stryMutAct_9fa48("7900") ? false : stryMutAct_9fa48("7899") ? true : (stryCov_9fa48("7899", "7900", "7901"), challenge.challengerId !== dbUser.student.id)) {
                  if (stryMutAct_9fa48("7902")) {
                    {}
                  } else {
                    stryCov_9fa48("7902");
                    return NextResponse.json(stryMutAct_9fa48("7903") ? {} : (stryCov_9fa48("7903"), {
                      error: stryMutAct_9fa48("7904") ? "" : (stryCov_9fa48("7904"), 'Solo el desafiador puede registrar su intento')
                    }), stryMutAct_9fa48("7905") ? {} : (stryCov_9fa48("7905"), {
                      status: 403
                    }));
                  }
                }

                // Verificar el intento
                const attempt = await prisma.attempt.findUnique(stryMutAct_9fa48("7906") ? {} : (stryCov_9fa48("7906"), {
                  where: stryMutAct_9fa48("7907") ? {} : (stryCov_9fa48("7907"), {
                    id: challengerAttemptId
                  })
                }));
                const validation = validateChallengeAttempt(attempt, challenge.challengerId, stryMutAct_9fa48("7910") ? challenge.examId && undefined : stryMutAct_9fa48("7909") ? false : stryMutAct_9fa48("7908") ? true : (stryCov_9fa48("7908", "7909", "7910"), challenge.examId || undefined));
                if (stryMutAct_9fa48("7913") ? false : stryMutAct_9fa48("7912") ? true : stryMutAct_9fa48("7911") ? validation.isValid : (stryCov_9fa48("7911", "7912", "7913"), !validation.isValid)) {
                  if (stryMutAct_9fa48("7914")) {
                    {}
                  } else {
                    stryCov_9fa48("7914");
                    return NextResponse.json(stryMutAct_9fa48("7915") ? {} : (stryCov_9fa48("7915"), {
                      error: validation.errorMessage
                    }), stryMutAct_9fa48("7916") ? {} : (stryCov_9fa48("7916"), {
                      status: 400
                    }));
                  }
                }
                updateData.challengerAttemptId = challengerAttemptId;
              }
            }
            if (stryMutAct_9fa48("7918") ? false : stryMutAct_9fa48("7917") ? true : (stryCov_9fa48("7917", "7918"), challengedAttemptId)) {
              if (stryMutAct_9fa48("7919")) {
                {}
              } else {
                stryCov_9fa48("7919");
                // El desafiado completó su intento
                if (stryMutAct_9fa48("7922") ? challenge.challengedId === dbUser.student.id : stryMutAct_9fa48("7921") ? false : stryMutAct_9fa48("7920") ? true : (stryCov_9fa48("7920", "7921", "7922"), challenge.challengedId !== dbUser.student.id)) {
                  if (stryMutAct_9fa48("7923")) {
                    {}
                  } else {
                    stryCov_9fa48("7923");
                    return NextResponse.json(stryMutAct_9fa48("7924") ? {} : (stryCov_9fa48("7924"), {
                      error: stryMutAct_9fa48("7925") ? "" : (stryCov_9fa48("7925"), 'Solo el desafiado puede registrar su intento')
                    }), stryMutAct_9fa48("7926") ? {} : (stryCov_9fa48("7926"), {
                      status: 403
                    }));
                  }
                }

                // Verificar el intento
                const attempt = await prisma.attempt.findUnique(stryMutAct_9fa48("7927") ? {} : (stryCov_9fa48("7927"), {
                  where: stryMutAct_9fa48("7928") ? {} : (stryCov_9fa48("7928"), {
                    id: challengedAttemptId
                  })
                }));
                const validation = validateChallengeAttempt(attempt, challenge.challengedId, stryMutAct_9fa48("7931") ? challenge.examId && undefined : stryMutAct_9fa48("7930") ? false : stryMutAct_9fa48("7929") ? true : (stryCov_9fa48("7929", "7930", "7931"), challenge.examId || undefined));
                if (stryMutAct_9fa48("7934") ? false : stryMutAct_9fa48("7933") ? true : stryMutAct_9fa48("7932") ? validation.isValid : (stryCov_9fa48("7932", "7933", "7934"), !validation.isValid)) {
                  if (stryMutAct_9fa48("7935")) {
                    {}
                  } else {
                    stryCov_9fa48("7935");
                    return NextResponse.json(stryMutAct_9fa48("7936") ? {} : (stryCov_9fa48("7936"), {
                      error: validation.errorMessage
                    }), stryMutAct_9fa48("7937") ? {} : (stryCov_9fa48("7937"), {
                      status: 400
                    }));
                  }
                }
                updateData.challengedAttemptId = challengedAttemptId;
              }
            }

            // Si ambos intentos están presentes, determinar el ganador y completar
            const currentChallenge = await prisma.challenge.findUnique(stryMutAct_9fa48("7938") ? {} : (stryCov_9fa48("7938"), {
              where: stryMutAct_9fa48("7939") ? {} : (stryCov_9fa48("7939"), {
                id
              }),
              include: stryMutAct_9fa48("7940") ? {} : (stryCov_9fa48("7940"), {
                challengerAttempt: stryMutAct_9fa48("7941") ? false : (stryCov_9fa48("7941"), true),
                challengedAttempt: stryMutAct_9fa48("7942") ? false : (stryCov_9fa48("7942"), true)
              })
            }));
            const willHaveChallengerAttempt = stryMutAct_9fa48("7945") ? challengerAttemptId && currentChallenge?.challengerAttemptId : stryMutAct_9fa48("7944") ? false : stryMutAct_9fa48("7943") ? true : (stryCov_9fa48("7943", "7944", "7945"), challengerAttemptId || (stryMutAct_9fa48("7946") ? currentChallenge.challengerAttemptId : (stryCov_9fa48("7946"), currentChallenge?.challengerAttemptId)));
            const willHaveChallengedAttempt = stryMutAct_9fa48("7949") ? challengedAttemptId && currentChallenge?.challengedAttemptId : stryMutAct_9fa48("7948") ? false : stryMutAct_9fa48("7947") ? true : (stryCov_9fa48("7947", "7948", "7949"), challengedAttemptId || (stryMutAct_9fa48("7950") ? currentChallenge.challengedAttemptId : (stryCov_9fa48("7950"), currentChallenge?.challengedAttemptId)));
            if (stryMutAct_9fa48("7953") ? willHaveChallengerAttempt || willHaveChallengedAttempt : stryMutAct_9fa48("7952") ? false : stryMutAct_9fa48("7951") ? true : (stryCov_9fa48("7951", "7952", "7953"), willHaveChallengerAttempt && willHaveChallengedAttempt)) {
              if (stryMutAct_9fa48("7954")) {
                {}
              } else {
                stryCov_9fa48("7954");
                // Ambos han completado, determinar ganador
                const challengerAttempt = challengerAttemptId ? await prisma.attempt.findUnique(stryMutAct_9fa48("7955") ? {} : (stryCov_9fa48("7955"), {
                  where: stryMutAct_9fa48("7956") ? {} : (stryCov_9fa48("7956"), {
                    id: challengerAttemptId
                  })
                })) : stryMutAct_9fa48("7957") ? currentChallenge.challengerAttempt : (stryCov_9fa48("7957"), currentChallenge?.challengerAttempt);
                const challengedAttempt = challengedAttemptId ? await prisma.attempt.findUnique(stryMutAct_9fa48("7958") ? {} : (stryCov_9fa48("7958"), {
                  where: stryMutAct_9fa48("7959") ? {} : (stryCov_9fa48("7959"), {
                    id: challengedAttemptId
                  })
                })) : stryMutAct_9fa48("7960") ? currentChallenge.challengedAttempt : (stryCov_9fa48("7960"), currentChallenge?.challengedAttempt);
                if (stryMutAct_9fa48("7963") ? challengerAttempt || challengedAttempt : stryMutAct_9fa48("7962") ? false : stryMutAct_9fa48("7961") ? true : (stryCov_9fa48("7961", "7962", "7963"), challengerAttempt && challengedAttempt)) {
                  if (stryMutAct_9fa48("7964")) {
                    {}
                  } else {
                    stryCov_9fa48("7964");
                    const winnerId = determineChallengeWinner(challengerAttempt, challengedAttempt, challenge.challengerId, challenge.challengedId);
                    updateData.status = CHALLENGE_STATUS.COMPLETED;
                    updateData.winnerId = winnerId;
                    updateData.completedAt = new Date();
                  }
                }
              }
            }

            // Actualizar el desafío
            const updated = await prisma.challenge.update(stryMutAct_9fa48("7965") ? {} : (stryCov_9fa48("7965"), {
              where: stryMutAct_9fa48("7966") ? {} : (stryCov_9fa48("7966"), {
                id
              }),
              data: updateData,
              include: getChallengeInclude()
            }));
            return NextResponse.json(stryMutAct_9fa48("7967") ? {} : (stryCov_9fa48("7967"), {
              challenge: updated
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("7968")) {
            {}
          } else {
            stryCov_9fa48("7968");
            logger.error(stryMutAct_9fa48("7969") ? {} : (stryCov_9fa48("7969"), {
              type: stryMutAct_9fa48("7970") ? "" : (stryCov_9fa48("7970"), 'challenges_complete_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("7971") ? "" : (stryCov_9fa48("7971"), 'Error al completar desafío'));
            return NextResponse.json(stryMutAct_9fa48("7972") ? {} : (stryCov_9fa48("7972"), {
              error: stryMutAct_9fa48("7973") ? "" : (stryCov_9fa48("7973"), 'Error al completar desafío')
            }), stryMutAct_9fa48("7974") ? {} : (stryCov_9fa48("7974"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}