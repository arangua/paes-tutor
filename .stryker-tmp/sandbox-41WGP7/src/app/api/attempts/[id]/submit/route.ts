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
import { getCurrentStudentId } from '@/lib/get-session';
import { handleApiError } from '@/lib/api-helpers';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { invalidateCachePattern } from '@/lib/cache';
import { determineChallengeWinner } from '@/lib/challenge-helpers';
import { TRANSACTION_TIMEOUT_LONG, CHALLENGE_STATUS } from '@/lib/challenge-constants';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("7054") ? "" : (stryCov_9fa48("7054"), 'nodejs');
export async function POST(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("7055")) {
    {}
  } else {
    stryCov_9fa48("7055");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("7056")) {
        {}
      } else {
        stryCov_9fa48("7056");
        try {
          if (stryMutAct_9fa48("7057")) {
            {}
          } else {
            stryCov_9fa48("7057");
            const {
              id
            } = await params;
            logApiRequest(stryMutAct_9fa48("7058") ? "" : (stryCov_9fa48("7058"), 'POST'), stryMutAct_9fa48("7059") ? `` : (stryCov_9fa48("7059"), `/api/attempts/${id}/submit`));

            // Validar formato del ID (cuid)
            if (stryMutAct_9fa48("7062") ? !id && !/^c[a-z0-9]{24}$/.test(id) : stryMutAct_9fa48("7061") ? false : stryMutAct_9fa48("7060") ? true : (stryCov_9fa48("7060", "7061", "7062"), (stryMutAct_9fa48("7063") ? id : (stryCov_9fa48("7063"), !id)) || (stryMutAct_9fa48("7064") ? /^c[a-z0-9]{24}$/.test(id) : (stryCov_9fa48("7064"), !(stryMutAct_9fa48("7068") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("7067") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("7066") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("7065") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("7065", "7066", "7067", "7068"), /^c[a-z0-9]{24}$/)).test(id))))) {
              if (stryMutAct_9fa48("7069")) {
                {}
              } else {
                stryCov_9fa48("7069");
                return NextResponse.json(stryMutAct_9fa48("7070") ? {} : (stryCov_9fa48("7070"), {
                  error: stryMutAct_9fa48("7071") ? "" : (stryCov_9fa48("7071"), 'ID de intento inválido')
                }), stryMutAct_9fa48("7072") ? {} : (stryCov_9fa48("7072"), {
                  status: 400
                }));
              }
            }
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("7075") ? false : stryMutAct_9fa48("7074") ? true : stryMutAct_9fa48("7073") ? studentId : (stryCov_9fa48("7073", "7074", "7075"), !studentId)) {
              if (stryMutAct_9fa48("7076")) {
                {}
              } else {
                stryCov_9fa48("7076");
                return NextResponse.json(stryMutAct_9fa48("7077") ? {} : (stryCov_9fa48("7077"), {
                  error: stryMutAct_9fa48("7078") ? "" : (stryCov_9fa48("7078"), 'No autorizado')
                }), stryMutAct_9fa48("7079") ? {} : (stryCov_9fa48("7079"), {
                  status: 401
                }));
              }
            }

            // Verificar que el intento existe y pertenece al estudiante
            // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
            const attempt = await prisma.attempt.findUnique(stryMutAct_9fa48("7080") ? {} : (stryCov_9fa48("7080"), {
              where: stryMutAct_9fa48("7081") ? {} : (stryCov_9fa48("7081"), {
                id
              }),
              select: stryMutAct_9fa48("7082") ? {} : (stryCov_9fa48("7082"), {
                id: stryMutAct_9fa48("7083") ? false : (stryCov_9fa48("7083"), true),
                studentId: stryMutAct_9fa48("7084") ? false : (stryCov_9fa48("7084"), true),
                estado: stryMutAct_9fa48("7085") ? false : (stryCov_9fa48("7085"), true),
                startedAt: stryMutAct_9fa48("7086") ? false : (stryCov_9fa48("7086"), true),
                totalPreguntas: stryMutAct_9fa48("7087") ? false : (stryCov_9fa48("7087"), true),
                proceso: stryMutAct_9fa48("7088") ? false : (stryCov_9fa48("7088"), true),
                tipoAplicacion: stryMutAct_9fa48("7089") ? false : (stryCov_9fa48("7089"), true),
                forma: stryMutAct_9fa48("7090") ? false : (stryCov_9fa48("7090"), true),
                exam: stryMutAct_9fa48("7091") ? {} : (stryCov_9fa48("7091"), {
                  select: stryMutAct_9fa48("7092") ? {} : (stryCov_9fa48("7092"), {
                    id: stryMutAct_9fa48("7093") ? false : (stryCov_9fa48("7093"), true),
                    subject: stryMutAct_9fa48("7094") ? {} : (stryCov_9fa48("7094"), {
                      select: stryMutAct_9fa48("7095") ? {} : (stryCov_9fa48("7095"), {
                        id: stryMutAct_9fa48("7096") ? false : (stryCov_9fa48("7096"), true),
                        codigo: stryMutAct_9fa48("7097") ? false : (stryCov_9fa48("7097"), true),
                        nombre: stryMutAct_9fa48("7098") ? false : (stryCov_9fa48("7098"), true)
                      })
                    })
                  })
                }),
                answers: stryMutAct_9fa48("7099") ? {} : (stryCov_9fa48("7099"), {
                  select: stryMutAct_9fa48("7100") ? {} : (stryCov_9fa48("7100"), {
                    id: stryMutAct_9fa48("7101") ? false : (stryCov_9fa48("7101"), true),
                    esCorrecta: stryMutAct_9fa48("7102") ? false : (stryCov_9fa48("7102"), true),
                    omitida: stryMutAct_9fa48("7103") ? false : (stryCov_9fa48("7103"), true),
                    question: stryMutAct_9fa48("7104") ? {} : (stryCov_9fa48("7104"), {
                      select: stryMutAct_9fa48("7105") ? {} : (stryCov_9fa48("7105"), {
                        id: stryMutAct_9fa48("7106") ? false : (stryCov_9fa48("7106"), true),
                        topicId: stryMutAct_9fa48("7107") ? false : (stryCov_9fa48("7107"), true)
                      })
                    })
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("7110") ? false : stryMutAct_9fa48("7109") ? true : stryMutAct_9fa48("7108") ? attempt : (stryCov_9fa48("7108", "7109", "7110"), !attempt)) {
              if (stryMutAct_9fa48("7111")) {
                {}
              } else {
                stryCov_9fa48("7111");
                return NextResponse.json(stryMutAct_9fa48("7112") ? {} : (stryCov_9fa48("7112"), {
                  error: stryMutAct_9fa48("7113") ? "" : (stryCov_9fa48("7113"), 'Intento no encontrado')
                }), stryMutAct_9fa48("7114") ? {} : (stryCov_9fa48("7114"), {
                  status: 404
                }));
              }
            }
            if (stryMutAct_9fa48("7117") ? attempt.studentId === studentId : stryMutAct_9fa48("7116") ? false : stryMutAct_9fa48("7115") ? true : (stryCov_9fa48("7115", "7116", "7117"), attempt.studentId !== studentId)) {
              if (stryMutAct_9fa48("7118")) {
                {}
              } else {
                stryCov_9fa48("7118");
                return NextResponse.json(stryMutAct_9fa48("7119") ? {} : (stryCov_9fa48("7119"), {
                  error: stryMutAct_9fa48("7120") ? "" : (stryCov_9fa48("7120"), 'No autorizado')
                }), stryMutAct_9fa48("7121") ? {} : (stryCov_9fa48("7121"), {
                  status: 403
                }));
              }
            }
            if (stryMutAct_9fa48("7124") ? attempt.estado !== 'completado' : stryMutAct_9fa48("7123") ? false : stryMutAct_9fa48("7122") ? true : (stryCov_9fa48("7122", "7123", "7124"), attempt.estado === (stryMutAct_9fa48("7125") ? "" : (stryCov_9fa48("7125"), 'completado')))) {
              if (stryMutAct_9fa48("7126")) {
                {}
              } else {
                stryCov_9fa48("7126");
                return NextResponse.json(stryMutAct_9fa48("7127") ? {} : (stryCov_9fa48("7127"), {
                  error: stryMutAct_9fa48("7128") ? "" : (stryCov_9fa48("7128"), 'El intento ya está completado')
                }), stryMutAct_9fa48("7129") ? {} : (stryCov_9fa48("7129"), {
                  status: 400
                }));
              }
            }
            if (stryMutAct_9fa48("7132") ? attempt.estado !== 'cancelado' : stryMutAct_9fa48("7131") ? false : stryMutAct_9fa48("7130") ? true : (stryCov_9fa48("7130", "7131", "7132"), attempt.estado === (stryMutAct_9fa48("7133") ? "" : (stryCov_9fa48("7133"), 'cancelado')))) {
              if (stryMutAct_9fa48("7134")) {
                {}
              } else {
                stryCov_9fa48("7134");
                return NextResponse.json(stryMutAct_9fa48("7135") ? {} : (stryCov_9fa48("7135"), {
                  error: stryMutAct_9fa48("7136") ? "" : (stryCov_9fa48("7136"), 'No se puede completar un intento cancelado')
                }), stryMutAct_9fa48("7137") ? {} : (stryCov_9fa48("7137"), {
                  status: 400
                }));
              }
            }

            // Calcular estadísticas finales
            const correctas = stryMutAct_9fa48("7138") ? attempt.answers.length : (stryCov_9fa48("7138"), attempt.answers.filter(stryMutAct_9fa48("7139") ? () => undefined : (stryCov_9fa48("7139"), a => stryMutAct_9fa48("7142") ? a.esCorrecta !== true : stryMutAct_9fa48("7141") ? false : stryMutAct_9fa48("7140") ? true : (stryCov_9fa48("7140", "7141", "7142"), a.esCorrecta === (stryMutAct_9fa48("7143") ? false : (stryCov_9fa48("7143"), true))))).length);
            const incorrectas = stryMutAct_9fa48("7144") ? attempt.answers.length : (stryCov_9fa48("7144"), attempt.answers.filter(stryMutAct_9fa48("7145") ? () => undefined : (stryCov_9fa48("7145"), a => stryMutAct_9fa48("7148") ? a.esCorrecta === false || !a.omitida : stryMutAct_9fa48("7147") ? false : stryMutAct_9fa48("7146") ? true : (stryCov_9fa48("7146", "7147", "7148"), (stryMutAct_9fa48("7150") ? a.esCorrecta !== false : stryMutAct_9fa48("7149") ? true : (stryCov_9fa48("7149", "7150"), a.esCorrecta === (stryMutAct_9fa48("7151") ? true : (stryCov_9fa48("7151"), false)))) && (stryMutAct_9fa48("7152") ? a.omitida : (stryCov_9fa48("7152"), !a.omitida))))).length);
            const omitidas = stryMutAct_9fa48("7153") ? attempt.answers.length : (stryCov_9fa48("7153"), attempt.answers.filter(stryMutAct_9fa48("7154") ? () => undefined : (stryCov_9fa48("7154"), a => stryMutAct_9fa48("7157") ? a.omitida !== true : stryMutAct_9fa48("7156") ? false : stryMutAct_9fa48("7155") ? true : (stryCov_9fa48("7155", "7156", "7157"), a.omitida === (stryMutAct_9fa48("7158") ? false : (stryCov_9fa48("7158"), true))))).length);
            const total = stryMutAct_9fa48("7161") ? attempt.totalPreguntas && 0 : stryMutAct_9fa48("7160") ? false : stryMutAct_9fa48("7159") ? true : (stryCov_9fa48("7159", "7160", "7161"), attempt.totalPreguntas || 0);
            const porcentaje = (stryMutAct_9fa48("7165") ? total <= 0 : stryMutAct_9fa48("7164") ? total >= 0 : stryMutAct_9fa48("7163") ? false : stryMutAct_9fa48("7162") ? true : (stryCov_9fa48("7162", "7163", "7164", "7165"), total > 0)) ? stryMutAct_9fa48("7166") ? correctas / total / 100 : (stryCov_9fa48("7166"), (stryMutAct_9fa48("7167") ? correctas * total : (stryCov_9fa48("7167"), correctas / total)) * 100) : 0;

            // Calcular duración
            const finishedAt = new Date();
            let duracionSegundos: number | null = null;
            if (stryMutAct_9fa48("7169") ? false : stryMutAct_9fa48("7168") ? true : (stryCov_9fa48("7168", "7169"), attempt.startedAt)) {
              if (stryMutAct_9fa48("7170")) {
                {}
              } else {
                stryCov_9fa48("7170");
                duracionSegundos = Math.floor(stryMutAct_9fa48("7171") ? (finishedAt.getTime() - attempt.startedAt.getTime()) * 1000 : (stryCov_9fa48("7171"), (stryMutAct_9fa48("7172") ? finishedAt.getTime() + attempt.startedAt.getTime() : (stryCov_9fa48("7172"), finishedAt.getTime() - attempt.startedAt.getTime())) / 1000));

                // VALIDACIÓN: Verificar que la duración sea razonable
                if (stryMutAct_9fa48("7176") ? duracionSegundos >= 0 : stryMutAct_9fa48("7175") ? duracionSegundos <= 0 : stryMutAct_9fa48("7174") ? false : stryMutAct_9fa48("7173") ? true : (stryCov_9fa48("7173", "7174", "7175", "7176"), duracionSegundos < 0)) {
                  if (stryMutAct_9fa48("7177")) {
                    {}
                  } else {
                    stryCov_9fa48("7177");
                    // Log warning pero continuar (podría ser un problema de sincronización de tiempo)
                    const {
                      logger
                    } = await import(stryMutAct_9fa48("7178") ? "" : (stryCov_9fa48("7178"), '@/lib/logger'));
                    logger.warn(stryMutAct_9fa48("7179") ? {} : (stryCov_9fa48("7179"), {
                      attemptId: id,
                      duracionSegundos,
                      startedAt: attempt.startedAt,
                      finishedAt
                    }), stryMutAct_9fa48("7180") ? "" : (stryCov_9fa48("7180"), 'Duración negativa detectada al finalizar examen'));
                    // Ajustar a 0 para evitar problemas
                    duracionSegundos = 0;
                  }
                }

                // Validar que no exceda un límite razonable (24 horas)
                const MAX_DURATION = stryMutAct_9fa48("7181") ? 24 * 60 / 60 : (stryCov_9fa48("7181"), (stryMutAct_9fa48("7182") ? 24 / 60 : (stryCov_9fa48("7182"), 24 * 60)) * 60); // 24 horas en segundos
                if (stryMutAct_9fa48("7186") ? duracionSegundos <= MAX_DURATION : stryMutAct_9fa48("7185") ? duracionSegundos >= MAX_DURATION : stryMutAct_9fa48("7184") ? false : stryMutAct_9fa48("7183") ? true : (stryCov_9fa48("7183", "7184", "7185", "7186"), duracionSegundos > MAX_DURATION)) {
                  if (stryMutAct_9fa48("7187")) {
                    {}
                  } else {
                    stryCov_9fa48("7187");
                    return NextResponse.json(stryMutAct_9fa48("7188") ? {} : (stryCov_9fa48("7188"), {
                      error: stryMutAct_9fa48("7189") ? "" : (stryCov_9fa48("7189"), 'Duración inválida'),
                      details: stryMutAct_9fa48("7190") ? `` : (stryCov_9fa48("7190"), `La duración del examen (${Math.floor(stryMutAct_9fa48("7191") ? duracionSegundos * 60 : (stryCov_9fa48("7191"), duracionSegundos / 60))} minutos) excede el límite máximo de 24 horas. Por favor, contacta al administrador.`)
                    }), stryMutAct_9fa48("7192") ? {} : (stryCov_9fa48("7192"), {
                      status: 400
                    }));
                  }
                }
              }
            }

            // Calcular puntaje PAES si es posible
            let puntajePaes: number | null = null;
            let puntajeEstimado = stryMutAct_9fa48("7193") ? true : (stryCov_9fa48("7193"), false);
            if (stryMutAct_9fa48("7196") ? attempt.proceso && attempt.tipoAplicacion || attempt.forma : stryMutAct_9fa48("7195") ? false : stryMutAct_9fa48("7194") ? true : (stryCov_9fa48("7194", "7195", "7196"), (stryMutAct_9fa48("7198") ? attempt.proceso || attempt.tipoAplicacion : stryMutAct_9fa48("7197") ? true : (stryCov_9fa48("7197", "7198"), attempt.proceso && attempt.tipoAplicacion)) && attempt.forma)) {
              if (stryMutAct_9fa48("7199")) {
                {}
              } else {
                stryCov_9fa48("7199");
                const scoreTable = await prisma.scoreTable.findFirst(stryMutAct_9fa48("7200") ? {} : (stryCov_9fa48("7200"), {
                  where: stryMutAct_9fa48("7201") ? {} : (stryCov_9fa48("7201"), {
                    subjectCodigo: attempt.exam.subject.codigo,
                    proceso: attempt.proceso,
                    tipoAplicacion: attempt.tipoAplicacion,
                    forma: attempt.forma,
                    correctas: correctas
                  })
                }));
                if (stryMutAct_9fa48("7203") ? false : stryMutAct_9fa48("7202") ? true : (stryCov_9fa48("7202", "7203"), scoreTable)) {
                  if (stryMutAct_9fa48("7204")) {
                    {}
                  } else {
                    stryCov_9fa48("7204");
                    puntajePaes = scoreTable.puntajePaes;
                  }
                } else {
                  if (stryMutAct_9fa48("7205")) {
                    {}
                  } else {
                    stryCov_9fa48("7205");
                    // Si no hay tabla exacta, buscar la más cercana
                    const closestScore = await prisma.scoreTable.findFirst(stryMutAct_9fa48("7206") ? {} : (stryCov_9fa48("7206"), {
                      where: stryMutAct_9fa48("7207") ? {} : (stryCov_9fa48("7207"), {
                        subjectCodigo: attempt.exam.subject.codigo,
                        proceso: attempt.proceso,
                        tipoAplicacion: attempt.tipoAplicacion,
                        forma: attempt.forma,
                        correctas: stryMutAct_9fa48("7208") ? {} : (stryCov_9fa48("7208"), {
                          lte: correctas
                        })
                      }),
                      orderBy: stryMutAct_9fa48("7209") ? {} : (stryCov_9fa48("7209"), {
                        correctas: stryMutAct_9fa48("7210") ? "" : (stryCov_9fa48("7210"), 'desc')
                      })
                    }));
                    if (stryMutAct_9fa48("7212") ? false : stryMutAct_9fa48("7211") ? true : (stryCov_9fa48("7211", "7212"), closestScore)) {
                      if (stryMutAct_9fa48("7213")) {
                        {}
                      } else {
                        stryCov_9fa48("7213");
                        puntajePaes = closestScore.puntajePaes;
                        puntajeEstimado = stryMutAct_9fa48("7214") ? false : (stryCov_9fa48("7214"), true);
                      }
                    }
                  }
                }
              }
            }

            // Usar transacción para garantizar consistencia entre intento y métricas
            const updatedAttempt = await prisma.$transaction(async tx => {
              if (stryMutAct_9fa48("7215")) {
                {}
              } else {
                stryCov_9fa48("7215");
                // Actualizar el intento como completado
                // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
                const attempt = await tx.attempt.update(stryMutAct_9fa48("7216") ? {} : (stryCov_9fa48("7216"), {
                  where: stryMutAct_9fa48("7217") ? {} : (stryCov_9fa48("7217"), {
                    id
                  }),
                  data: stryMutAct_9fa48("7218") ? {} : (stryCov_9fa48("7218"), {
                    estado: stryMutAct_9fa48("7219") ? "" : (stryCov_9fa48("7219"), 'completado'),
                    finishedAt,
                    duracionSegundos,
                    correctas,
                    incorrectas,
                    omitidas,
                    porcentaje,
                    puntajePaes,
                    puntajeEstimado
                  }),
                  select: stryMutAct_9fa48("7220") ? {} : (stryCov_9fa48("7220"), {
                    id: stryMutAct_9fa48("7221") ? false : (stryCov_9fa48("7221"), true),
                    estado: stryMutAct_9fa48("7222") ? false : (stryCov_9fa48("7222"), true),
                    porcentaje: stryMutAct_9fa48("7223") ? false : (stryCov_9fa48("7223"), true),
                    correctas: stryMutAct_9fa48("7224") ? false : (stryCov_9fa48("7224"), true),
                    incorrectas: stryMutAct_9fa48("7225") ? false : (stryCov_9fa48("7225"), true),
                    omitidas: stryMutAct_9fa48("7226") ? false : (stryCov_9fa48("7226"), true),
                    puntajePaes: stryMutAct_9fa48("7227") ? false : (stryCov_9fa48("7227"), true),
                    puntajeEstimado: stryMutAct_9fa48("7228") ? false : (stryCov_9fa48("7228"), true),
                    finishedAt: stryMutAct_9fa48("7229") ? false : (stryCov_9fa48("7229"), true),
                    duracionSegundos: stryMutAct_9fa48("7230") ? false : (stryCov_9fa48("7230"), true),
                    exam: stryMutAct_9fa48("7231") ? {} : (stryCov_9fa48("7231"), {
                      select: stryMutAct_9fa48("7232") ? {} : (stryCov_9fa48("7232"), {
                        id: stryMutAct_9fa48("7233") ? false : (stryCov_9fa48("7233"), true),
                        titulo: stryMutAct_9fa48("7234") ? false : (stryCov_9fa48("7234"), true),
                        subject: stryMutAct_9fa48("7235") ? {} : (stryCov_9fa48("7235"), {
                          select: stryMutAct_9fa48("7236") ? {} : (stryCov_9fa48("7236"), {
                            id: stryMutAct_9fa48("7237") ? false : (stryCov_9fa48("7237"), true),
                            nombre: stryMutAct_9fa48("7238") ? false : (stryCov_9fa48("7238"), true),
                            codigo: stryMutAct_9fa48("7239") ? false : (stryCov_9fa48("7239"), true)
                          })
                        })
                      })
                    }),
                    answers: stryMutAct_9fa48("7240") ? {} : (stryCov_9fa48("7240"), {
                      select: stryMutAct_9fa48("7241") ? {} : (stryCov_9fa48("7241"), {
                        id: stryMutAct_9fa48("7242") ? false : (stryCov_9fa48("7242"), true),
                        esCorrecta: stryMutAct_9fa48("7243") ? false : (stryCov_9fa48("7243"), true),
                        omitida: stryMutAct_9fa48("7244") ? false : (stryCov_9fa48("7244"), true),
                        question: stryMutAct_9fa48("7245") ? {} : (stryCov_9fa48("7245"), {
                          select: stryMutAct_9fa48("7246") ? {} : (stryCov_9fa48("7246"), {
                            id: stryMutAct_9fa48("7247") ? false : (stryCov_9fa48("7247"), true),
                            topicId: stryMutAct_9fa48("7248") ? false : (stryCov_9fa48("7248"), true),
                            options: stryMutAct_9fa48("7249") ? {} : (stryCov_9fa48("7249"), {
                              select: stryMutAct_9fa48("7250") ? {} : (stryCov_9fa48("7250"), {
                                id: stryMutAct_9fa48("7251") ? false : (stryCov_9fa48("7251"), true),
                                texto: stryMutAct_9fa48("7252") ? false : (stryCov_9fa48("7252"), true),
                                esCorrecta: stryMutAct_9fa48("7253") ? false : (stryCov_9fa48("7253"), true)
                              })
                            })
                          })
                        }),
                        optionSelected: stryMutAct_9fa48("7254") ? {} : (stryCov_9fa48("7254"), {
                          select: stryMutAct_9fa48("7255") ? {} : (stryCov_9fa48("7255"), {
                            id: stryMutAct_9fa48("7256") ? false : (stryCov_9fa48("7256"), true),
                            texto: stryMutAct_9fa48("7257") ? false : (stryCov_9fa48("7257"), true),
                            esCorrecta: stryMutAct_9fa48("7258") ? false : (stryCov_9fa48("7258"), true)
                          })
                        })
                      })
                    })
                  })
                }));

                // Actualizar métricas de rendimiento por tema
                // Agrupar respuestas por tema
                const metricsByTopic = new Map<string, {
                  total: number;
                  correctas: number;
                }>();
                for (const answer of attempt.answers) {
                  if (stryMutAct_9fa48("7259")) {
                    {}
                  } else {
                    stryCov_9fa48("7259");
                    const topicId = answer.question.topicId;
                    if (stryMutAct_9fa48("7262") ? false : stryMutAct_9fa48("7261") ? true : stryMutAct_9fa48("7260") ? topicId : (stryCov_9fa48("7260", "7261", "7262"), !topicId)) continue;
                    if (stryMutAct_9fa48("7265") ? false : stryMutAct_9fa48("7264") ? true : stryMutAct_9fa48("7263") ? metricsByTopic.has(topicId) : (stryCov_9fa48("7263", "7264", "7265"), !metricsByTopic.has(topicId))) {
                      if (stryMutAct_9fa48("7266")) {
                        {}
                      } else {
                        stryCov_9fa48("7266");
                        metricsByTopic.set(topicId, stryMutAct_9fa48("7267") ? {} : (stryCov_9fa48("7267"), {
                          total: 0,
                          correctas: 0
                        }));
                      }
                    }
                    const metric = metricsByTopic.get(topicId)!;
                    stryMutAct_9fa48("7268") ? metric.total-- : (stryCov_9fa48("7268"), metric.total++);
                    if (stryMutAct_9fa48("7271") ? answer.esCorrecta !== true : stryMutAct_9fa48("7270") ? false : stryMutAct_9fa48("7269") ? true : (stryCov_9fa48("7269", "7270", "7271"), answer.esCorrecta === (stryMutAct_9fa48("7272") ? false : (stryCov_9fa48("7272"), true)))) {
                      if (stryMutAct_9fa48("7273")) {
                        {}
                      } else {
                        stryCov_9fa48("7273");
                        stryMutAct_9fa48("7274") ? metric.correctas-- : (stryCov_9fa48("7274"), metric.correctas++);
                      }
                    }
                  }
                }

                // OPTIMIZACIÓN: Obtener todas las métricas existentes en una sola query (evita N+1)
                const topicIds = Array.from(metricsByTopic.keys());
                const existingMetrics = (stryMutAct_9fa48("7278") ? topicIds.length <= 0 : stryMutAct_9fa48("7277") ? topicIds.length >= 0 : stryMutAct_9fa48("7276") ? false : stryMutAct_9fa48("7275") ? true : (stryCov_9fa48("7275", "7276", "7277", "7278"), topicIds.length > 0)) ? await tx.performanceMetric.findMany(stryMutAct_9fa48("7279") ? {} : (stryCov_9fa48("7279"), {
                  where: stryMutAct_9fa48("7280") ? {} : (stryCov_9fa48("7280"), {
                    studentId,
                    topicId: stryMutAct_9fa48("7281") ? {} : (stryCov_9fa48("7281"), {
                      in: topicIds
                    })
                  })
                })) : stryMutAct_9fa48("7282") ? ["Stryker was here"] : (stryCov_9fa48("7282"), []);

                // Crear Map para acceso rápido O(1)
                const existingMetricsMap = new Map(existingMetrics.map(stryMutAct_9fa48("7283") ? () => undefined : (stryCov_9fa48("7283"), m => stryMutAct_9fa48("7284") ? [] : (stryCov_9fa48("7284"), [m.topicId, m]))));

                // Actualizar o crear métricas usando Promise.all para paralelizar
                const metricUpdates = Array.from(metricsByTopic.entries()).map(async ([topicId, metric]) => {
                  if (stryMutAct_9fa48("7285")) {
                    {}
                  } else {
                    stryCov_9fa48("7285");
                    const existingMetric = existingMetricsMap.get(topicId);

                    // Calcular totales acumulados
                    const totalAcumulado = stryMutAct_9fa48("7286") ? (existingMetric?.totalPreguntas || 0) - metric.total : (stryCov_9fa48("7286"), (stryMutAct_9fa48("7289") ? existingMetric?.totalPreguntas && 0 : stryMutAct_9fa48("7288") ? false : stryMutAct_9fa48("7287") ? true : (stryCov_9fa48("7287", "7288", "7289"), (stryMutAct_9fa48("7290") ? existingMetric.totalPreguntas : (stryCov_9fa48("7290"), existingMetric?.totalPreguntas)) || 0)) + metric.total);
                    const correctasAcumuladas = stryMutAct_9fa48("7291") ? (existingMetric?.correctas || 0) - metric.correctas : (stryCov_9fa48("7291"), (stryMutAct_9fa48("7294") ? existingMetric?.correctas && 0 : stryMutAct_9fa48("7293") ? false : stryMutAct_9fa48("7292") ? true : (stryCov_9fa48("7292", "7293", "7294"), (stryMutAct_9fa48("7295") ? existingMetric.correctas : (stryCov_9fa48("7295"), existingMetric?.correctas)) || 0)) + metric.correctas);
                    const porcentajeMetric = (stryMutAct_9fa48("7299") ? totalAcumulado <= 0 : stryMutAct_9fa48("7298") ? totalAcumulado >= 0 : stryMutAct_9fa48("7297") ? false : stryMutAct_9fa48("7296") ? true : (stryCov_9fa48("7296", "7297", "7298", "7299"), totalAcumulado > 0)) ? stryMutAct_9fa48("7300") ? correctasAcumuladas / totalAcumulado / 100 : (stryCov_9fa48("7300"), (stryMutAct_9fa48("7301") ? correctasAcumuladas * totalAcumulado : (stryCov_9fa48("7301"), correctasAcumuladas / totalAcumulado)) * 100) : 0;
                    const nivel = (stryMutAct_9fa48("7305") ? porcentajeMetric < 70 : stryMutAct_9fa48("7304") ? porcentajeMetric > 70 : stryMutAct_9fa48("7303") ? false : stryMutAct_9fa48("7302") ? true : (stryCov_9fa48("7302", "7303", "7304", "7305"), porcentajeMetric >= 70)) ? stryMutAct_9fa48("7306") ? "" : (stryCov_9fa48("7306"), 'alto') : (stryMutAct_9fa48("7310") ? porcentajeMetric < 50 : stryMutAct_9fa48("7309") ? porcentajeMetric > 50 : stryMutAct_9fa48("7308") ? false : stryMutAct_9fa48("7307") ? true : (stryCov_9fa48("7307", "7308", "7309", "7310"), porcentajeMetric >= 50)) ? stryMutAct_9fa48("7311") ? "" : (stryCov_9fa48("7311"), 'medio') : stryMutAct_9fa48("7312") ? "" : (stryCov_9fa48("7312"), 'bajo');
                    return tx.performanceMetric.upsert(stryMutAct_9fa48("7313") ? {} : (stryCov_9fa48("7313"), {
                      where: stryMutAct_9fa48("7314") ? {} : (stryCov_9fa48("7314"), {
                        studentId_topicId: stryMutAct_9fa48("7315") ? {} : (stryCov_9fa48("7315"), {
                          studentId,
                          topicId
                        })
                      }),
                      update: stryMutAct_9fa48("7316") ? {} : (stryCov_9fa48("7316"), {
                        totalPreguntas: stryMutAct_9fa48("7317") ? {} : (stryCov_9fa48("7317"), {
                          increment: metric.total
                        }),
                        correctas: stryMutAct_9fa48("7318") ? {} : (stryCov_9fa48("7318"), {
                          increment: metric.correctas
                        }),
                        porcentaje: porcentajeMetric,
                        nivel
                      }),
                      create: stryMutAct_9fa48("7319") ? {} : (stryCov_9fa48("7319"), {
                        studentId,
                        topicId,
                        totalPreguntas: metric.total,
                        correctas: metric.correctas,
                        porcentaje: porcentajeMetric,
                        nivel
                      })
                    }));
                  }
                });

                // Ejecutar todas las actualizaciones en paralelo dentro de la transacción
                await Promise.all(metricUpdates);
                return attempt;
              }
            });

            // Invalidar caché de intentos y métricas del estudiante
            await invalidateCachePattern(stryMutAct_9fa48("7320") ? `` : (stryCov_9fa48("7320"), `student:${studentId}:attempts:*`));
            await invalidateCachePattern(stryMutAct_9fa48("7321") ? `` : (stryCov_9fa48("7321"), `student:${studentId}:metrics:*`));

            // Verificar si hay desafíos activos para este examen y completarlos
            try {
              if (stryMutAct_9fa48("7322")) {
                {}
              } else {
                stryCov_9fa48("7322");
                // Usar transacción para actualizar desafíos de forma atómica
                // Esto previene condiciones de carrera cuando ambos completan simultáneamente
                // Obtener desafíos activos DENTRO de la transacción para evitar race conditions
                await prisma.$transaction(async tx => {
                  if (stryMutAct_9fa48("7323")) {
                    {}
                  } else {
                    stryCov_9fa48("7323");
                    // Obtener desafíos activos dentro de la transacción para tener datos frescos
                    const activeChallenges = await tx.challenge.findMany(stryMutAct_9fa48("7324") ? {} : (stryCov_9fa48("7324"), {
                      where: stryMutAct_9fa48("7325") ? {} : (stryCov_9fa48("7325"), {
                        examId: attempt.exam.id,
                        status: CHALLENGE_STATUS.ACCEPTED,
                        OR: stryMutAct_9fa48("7326") ? [] : (stryCov_9fa48("7326"), [stryMutAct_9fa48("7327") ? {} : (stryCov_9fa48("7327"), {
                          challengerId: studentId
                        }), stryMutAct_9fa48("7328") ? {} : (stryCov_9fa48("7328"), {
                          challengedId: studentId
                        })])
                      })
                    }));
                    for (const challenge of activeChallenges) {
                      if (stryMutAct_9fa48("7329")) {
                        {}
                      } else {
                        stryCov_9fa48("7329");
                        const isChallenger = stryMutAct_9fa48("7332") ? challenge.challengerId !== studentId : stryMutAct_9fa48("7331") ? false : stryMutAct_9fa48("7330") ? true : (stryCov_9fa48("7330", "7331", "7332"), challenge.challengerId === studentId);
                        const isChallenged = stryMutAct_9fa48("7335") ? challenge.challengedId !== studentId : stryMutAct_9fa48("7334") ? false : stryMutAct_9fa48("7333") ? true : (stryCov_9fa48("7333", "7334", "7335"), challenge.challengedId === studentId);
                        if (stryMutAct_9fa48("7338") ? isChallenger || !challenge.challengerAttemptId : stryMutAct_9fa48("7337") ? false : stryMutAct_9fa48("7336") ? true : (stryCov_9fa48("7336", "7337", "7338"), isChallenger && (stryMutAct_9fa48("7339") ? challenge.challengerAttemptId : (stryCov_9fa48("7339"), !challenge.challengerAttemptId)))) {
                          if (stryMutAct_9fa48("7340")) {
                            {}
                          } else {
                            stryCov_9fa48("7340");
                            // El desafiador completó su intento - actualizar el desafío
                            const updatedChallenge = await tx.challenge.update(stryMutAct_9fa48("7341") ? {} : (stryCov_9fa48("7341"), {
                              where: stryMutAct_9fa48("7342") ? {} : (stryCov_9fa48("7342"), {
                                id: challenge.id
                              }),
                              data: stryMutAct_9fa48("7343") ? {} : (stryCov_9fa48("7343"), {
                                challengerAttemptId: id
                              }),
                              select: stryMutAct_9fa48("7344") ? {} : (stryCov_9fa48("7344"), {
                                challengerAttemptId: stryMutAct_9fa48("7345") ? false : (stryCov_9fa48("7345"), true),
                                challengedAttemptId: stryMutAct_9fa48("7346") ? false : (stryCov_9fa48("7346"), true),
                                challengerId: stryMutAct_9fa48("7347") ? false : (stryCov_9fa48("7347"), true),
                                challengedId: stryMutAct_9fa48("7348") ? false : (stryCov_9fa48("7348"), true)
                              })
                            }));

                            // Si el desafiado también completó, determinar ganador
                            if (stryMutAct_9fa48("7350") ? false : stryMutAct_9fa48("7349") ? true : (stryCov_9fa48("7349", "7350"), updatedChallenge.challengedAttemptId)) {
                              if (stryMutAct_9fa48("7351")) {
                                {}
                              } else {
                                stryCov_9fa48("7351");
                                const challengedAttempt = await tx.attempt.findUnique(stryMutAct_9fa48("7352") ? {} : (stryCov_9fa48("7352"), {
                                  where: stryMutAct_9fa48("7353") ? {} : (stryCov_9fa48("7353"), {
                                    id: updatedChallenge.challengedAttemptId
                                  }),
                                  select: stryMutAct_9fa48("7354") ? {} : (stryCov_9fa48("7354"), {
                                    porcentaje: stryMutAct_9fa48("7355") ? false : (stryCov_9fa48("7355"), true)
                                  })
                                }));
                                if (stryMutAct_9fa48("7357") ? false : stryMutAct_9fa48("7356") ? true : (stryCov_9fa48("7356", "7357"), challengedAttempt)) {
                                  if (stryMutAct_9fa48("7358")) {
                                    {}
                                  } else {
                                    stryCov_9fa48("7358");
                                    const winnerId = determineChallengeWinner(updatedAttempt, challengedAttempt, studentId, updatedChallenge.challengedId);
                                    await tx.challenge.update(stryMutAct_9fa48("7359") ? {} : (stryCov_9fa48("7359"), {
                                      where: stryMutAct_9fa48("7360") ? {} : (stryCov_9fa48("7360"), {
                                        id: challenge.id
                                      }),
                                      data: stryMutAct_9fa48("7361") ? {} : (stryCov_9fa48("7361"), {
                                        status: CHALLENGE_STATUS.COMPLETED,
                                        winnerId,
                                        completedAt: new Date()
                                      })
                                    }));
                                  }
                                }
                              }
                            }
                          }
                        } else if (stryMutAct_9fa48("7364") ? isChallenged || !challenge.challengedAttemptId : stryMutAct_9fa48("7363") ? false : stryMutAct_9fa48("7362") ? true : (stryCov_9fa48("7362", "7363", "7364"), isChallenged && (stryMutAct_9fa48("7365") ? challenge.challengedAttemptId : (stryCov_9fa48("7365"), !challenge.challengedAttemptId)))) {
                          if (stryMutAct_9fa48("7366")) {
                            {}
                          } else {
                            stryCov_9fa48("7366");
                            // El desafiado completó su intento - actualizar el desafío
                            const updatedChallenge = await tx.challenge.update(stryMutAct_9fa48("7367") ? {} : (stryCov_9fa48("7367"), {
                              where: stryMutAct_9fa48("7368") ? {} : (stryCov_9fa48("7368"), {
                                id: challenge.id
                              }),
                              data: stryMutAct_9fa48("7369") ? {} : (stryCov_9fa48("7369"), {
                                challengedAttemptId: id
                              }),
                              select: stryMutAct_9fa48("7370") ? {} : (stryCov_9fa48("7370"), {
                                challengerAttemptId: stryMutAct_9fa48("7371") ? false : (stryCov_9fa48("7371"), true),
                                challengedAttemptId: stryMutAct_9fa48("7372") ? false : (stryCov_9fa48("7372"), true),
                                challengerId: stryMutAct_9fa48("7373") ? false : (stryCov_9fa48("7373"), true),
                                challengedId: stryMutAct_9fa48("7374") ? false : (stryCov_9fa48("7374"), true)
                              })
                            }));

                            // Si el desafiador también completó, determinar ganador
                            if (stryMutAct_9fa48("7376") ? false : stryMutAct_9fa48("7375") ? true : (stryCov_9fa48("7375", "7376"), updatedChallenge.challengerAttemptId)) {
                              if (stryMutAct_9fa48("7377")) {
                                {}
                              } else {
                                stryCov_9fa48("7377");
                                const challengerAttempt = await tx.attempt.findUnique(stryMutAct_9fa48("7378") ? {} : (stryCov_9fa48("7378"), {
                                  where: stryMutAct_9fa48("7379") ? {} : (stryCov_9fa48("7379"), {
                                    id: updatedChallenge.challengerAttemptId
                                  }),
                                  select: stryMutAct_9fa48("7380") ? {} : (stryCov_9fa48("7380"), {
                                    porcentaje: stryMutAct_9fa48("7381") ? false : (stryCov_9fa48("7381"), true)
                                  })
                                }));
                                if (stryMutAct_9fa48("7383") ? false : stryMutAct_9fa48("7382") ? true : (stryCov_9fa48("7382", "7383"), challengerAttempt)) {
                                  if (stryMutAct_9fa48("7384")) {
                                    {}
                                  } else {
                                    stryCov_9fa48("7384");
                                    const winnerId = determineChallengeWinner(challengerAttempt, updatedAttempt, updatedChallenge.challengerId, studentId);
                                    await tx.challenge.update(stryMutAct_9fa48("7385") ? {} : (stryCov_9fa48("7385"), {
                                      where: stryMutAct_9fa48("7386") ? {} : (stryCov_9fa48("7386"), {
                                        id: challenge.id
                                      }),
                                      data: stryMutAct_9fa48("7387") ? {} : (stryCov_9fa48("7387"), {
                                        status: CHALLENGE_STATUS.COMPLETED,
                                        winnerId,
                                        completedAt: new Date()
                                      })
                                    }));
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }, stryMutAct_9fa48("7388") ? {} : (stryCov_9fa48("7388"), {
                  timeout: TRANSACTION_TIMEOUT_LONG
                }));
              }
            } catch (challengeError) {
              if (stryMutAct_9fa48("7389")) {
                {}
              } else {
                stryCov_9fa48("7389");
                // No fallar el submit si hay error con desafíos
                const {
                  logger
                } = await import(stryMutAct_9fa48("7390") ? "" : (stryCov_9fa48("7390"), '@/lib/logger'));
                logger.error(stryMutAct_9fa48("7391") ? {} : (stryCov_9fa48("7391"), {
                  attemptId: id,
                  error: challengeError instanceof Error ? challengeError.message : String(challengeError)
                }), stryMutAct_9fa48("7392") ? "" : (stryCov_9fa48("7392"), 'Error al actualizar desafíos después de completar examen'));
              }
            }
            return NextResponse.json(updatedAttempt);
          }
        } catch (error) {
          if (stryMutAct_9fa48("7393")) {
            {}
          } else {
            stryCov_9fa48("7393");
            return handleApiError(error, stryMutAct_9fa48("7394") ? "" : (stryCov_9fa48("7394"), 'Error al finalizar intento'), stryMutAct_9fa48("7395") ? {} : (stryCov_9fa48("7395"), {
              path: stryMutAct_9fa48("7396") ? `` : (stryCov_9fa48("7396"), `/api/attempts/${await params.then(stryMutAct_9fa48("7397") ? () => undefined : (stryCov_9fa48("7397"), p => p.id))}/submit`)
            }));
          }
        }
      }
    });
  }
}