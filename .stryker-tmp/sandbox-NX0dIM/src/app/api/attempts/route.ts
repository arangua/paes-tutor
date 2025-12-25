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
import { validateQuery, validateBody, handleApiError } from '@/lib/api-helpers';
import { attemptQuerySchema, createAttemptSchema } from '@/lib/validations';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache';
import { LIMIT_CONSTANTS, TIME_CONSTANTS, HTTP_STATUS } from '@/lib/constants';

// Constantes de validación y caché
const MAX_OFFSET = LIMIT_CONSTANTS.MAX_OFFSET;
const ATTEMPTS_CACHE_TTL_MS = TIME_CONSTANTS.ATTEMPTS_CACHE_TTL_MS;
const NEW_ATTEMPT_THRESHOLD_MS = TIME_CONSTANTS.NEW_ATTEMPT_THRESHOLD_MS;
const HTTP_CREATED = HTTP_STATUS.CREATED;
const HTTP_OK = HTTP_STATUS.OK;

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("6537") ? "" : (stryCov_9fa48("6537"), 'nodejs');
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("6538")) {
    {}
  } else {
    stryCov_9fa48("6538");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6539")) {
        {}
      } else {
        stryCov_9fa48("6539");
        try {
          if (stryMutAct_9fa48("6540")) {
            {}
          } else {
            stryCov_9fa48("6540");
            logApiRequest(stryMutAct_9fa48("6541") ? "" : (stryCov_9fa48("6541"), 'GET'), stryMutAct_9fa48("6542") ? "" : (stryCov_9fa48("6542"), '/api/attempts'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("6545") ? false : stryMutAct_9fa48("6544") ? true : stryMutAct_9fa48("6543") ? studentId : (stryCov_9fa48("6543", "6544", "6545"), !studentId)) {
              if (stryMutAct_9fa48("6546")) {
                {}
              } else {
                stryCov_9fa48("6546");
                return NextResponse.json(stryMutAct_9fa48("6547") ? {} : (stryCov_9fa48("6547"), {
                  error: stryMutAct_9fa48("6548") ? "" : (stryCov_9fa48("6548"), 'No autorizado')
                }), stryMutAct_9fa48("6549") ? {} : (stryCov_9fa48("6549"), {
                  status: 401
                }));
              }
            }
            const student = await prisma.student.findUnique(stryMutAct_9fa48("6550") ? {} : (stryCov_9fa48("6550"), {
              where: stryMutAct_9fa48("6551") ? {} : (stryCov_9fa48("6551"), {
                id: studentId
              })
            }));
            if (stryMutAct_9fa48("6554") ? false : stryMutAct_9fa48("6553") ? true : stryMutAct_9fa48("6552") ? student : (stryCov_9fa48("6552", "6553", "6554"), !student)) {
              if (stryMutAct_9fa48("6555")) {
                {}
              } else {
                stryCov_9fa48("6555");
                return NextResponse.json(stryMutAct_9fa48("6556") ? {} : (stryCov_9fa48("6556"), {
                  error: stryMutAct_9fa48("6557") ? "" : (stryCov_9fa48("6557"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("6558") ? {} : (stryCov_9fa48("6558"), {
                  status: 404
                }));
              }
            }

            // Validar query parameters
            const validation = validateQuery(request, attemptQuerySchema);
            if (stryMutAct_9fa48("6561") ? false : stryMutAct_9fa48("6560") ? true : stryMutAct_9fa48("6559") ? validation.success : (stryCov_9fa48("6559", "6560", "6561"), !validation.success)) {
              if (stryMutAct_9fa48("6562")) {
                {}
              } else {
                stryCov_9fa48("6562");
                return validation.error;
              }
            }
            const {
              limit,
              offset
            } = validation.data;

            // Validar límites razonables para prevenir queries costosas
            if (stryMutAct_9fa48("6566") ? offset <= MAX_OFFSET : stryMutAct_9fa48("6565") ? offset >= MAX_OFFSET : stryMutAct_9fa48("6564") ? false : stryMutAct_9fa48("6563") ? true : (stryCov_9fa48("6563", "6564", "6565", "6566"), offset > MAX_OFFSET)) {
              if (stryMutAct_9fa48("6567")) {
                {}
              } else {
                stryCov_9fa48("6567");
                return NextResponse.json(stryMutAct_9fa48("6568") ? {} : (stryCov_9fa48("6568"), {
                  error: stryMutAct_9fa48("6569") ? "" : (stryCov_9fa48("6569"), 'Offset demasiado grande'),
                  details: stryMutAct_9fa48("6570") ? `` : (stryCov_9fa48("6570"), `El offset máximo permitido es ${MAX_OFFSET}. Use paginación más pequeña.`)
                }), stryMutAct_9fa48("6571") ? {} : (stryCov_9fa48("6571"), {
                  status: 400
                }));
              }
            }

            // Usar caché para queries frecuentes
            const cacheKey = cacheKeys.studentAttempts(studentId, limit, offset);
            const attempts = await getCached(cacheKey, async () => {
              if (stryMutAct_9fa48("6572")) {
                {}
              } else {
                stryCov_9fa48("6572");
                // Optimizar query usando select en lugar de include
                return await prisma.attempt.findMany(stryMutAct_9fa48("6573") ? {} : (stryCov_9fa48("6573"), {
                  where: stryMutAct_9fa48("6574") ? {} : (stryCov_9fa48("6574"), {
                    studentId
                  }),
                  select: stryMutAct_9fa48("6575") ? {} : (stryCov_9fa48("6575"), {
                    id: stryMutAct_9fa48("6576") ? false : (stryCov_9fa48("6576"), true),
                    estado: stryMutAct_9fa48("6577") ? false : (stryCov_9fa48("6577"), true),
                    porcentaje: stryMutAct_9fa48("6578") ? false : (stryCov_9fa48("6578"), true),
                    correctas: stryMutAct_9fa48("6579") ? false : (stryCov_9fa48("6579"), true),
                    totalPreguntas: stryMutAct_9fa48("6580") ? false : (stryCov_9fa48("6580"), true),
                    puntajePaes: stryMutAct_9fa48("6581") ? false : (stryCov_9fa48("6581"), true),
                    createdAt: stryMutAct_9fa48("6582") ? false : (stryCov_9fa48("6582"), true),
                    exam: stryMutAct_9fa48("6583") ? {} : (stryCov_9fa48("6583"), {
                      select: stryMutAct_9fa48("6584") ? {} : (stryCov_9fa48("6584"), {
                        id: stryMutAct_9fa48("6585") ? false : (stryCov_9fa48("6585"), true),
                        titulo: stryMutAct_9fa48("6586") ? false : (stryCov_9fa48("6586"), true),
                        subject: stryMutAct_9fa48("6587") ? {} : (stryCov_9fa48("6587"), {
                          select: stryMutAct_9fa48("6588") ? {} : (stryCov_9fa48("6588"), {
                            id: stryMutAct_9fa48("6589") ? false : (stryCov_9fa48("6589"), true),
                            nombre: stryMutAct_9fa48("6590") ? false : (stryCov_9fa48("6590"), true),
                            codigo: stryMutAct_9fa48("6591") ? false : (stryCov_9fa48("6591"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("6592") ? {} : (stryCov_9fa48("6592"), {
                    createdAt: stryMutAct_9fa48("6593") ? "" : (stryCov_9fa48("6593"), 'desc')
                  }),
                  take: limit,
                  skip: offset
                }));
              }
            }, ATTEMPTS_CACHE_TTL_MS);

            // Obtener total para paginación
            const total = await getCached(stryMutAct_9fa48("6594") ? `` : (stryCov_9fa48("6594"), `${cacheKey}:total`), async () => {
              if (stryMutAct_9fa48("6595")) {
                {}
              } else {
                stryCov_9fa48("6595");
                return await prisma.attempt.count(stryMutAct_9fa48("6596") ? {} : (stryCov_9fa48("6596"), {
                  where: stryMutAct_9fa48("6597") ? {} : (stryCov_9fa48("6597"), {
                    studentId
                  })
                }));
              }
            }, ATTEMPTS_CACHE_TTL_MS);
            return NextResponse.json(stryMutAct_9fa48("6598") ? {} : (stryCov_9fa48("6598"), {
              attempts,
              pagination: stryMutAct_9fa48("6599") ? {} : (stryCov_9fa48("6599"), {
                total,
                limit,
                offset,
                hasMore: stryMutAct_9fa48("6603") ? offset + limit >= total : stryMutAct_9fa48("6602") ? offset + limit <= total : stryMutAct_9fa48("6601") ? false : stryMutAct_9fa48("6600") ? true : (stryCov_9fa48("6600", "6601", "6602", "6603"), (stryMutAct_9fa48("6604") ? offset - limit : (stryCov_9fa48("6604"), offset + limit)) < total)
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6605")) {
            {}
          } else {
            stryCov_9fa48("6605");
            return handleApiError(error, stryMutAct_9fa48("6606") ? "" : (stryCov_9fa48("6606"), 'Error al obtener intentos'), stryMutAct_9fa48("6607") ? {} : (stryCov_9fa48("6607"), {
              path: stryMutAct_9fa48("6608") ? "" : (stryCov_9fa48("6608"), '/api/attempts')
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("6609")) {
    {}
  } else {
    stryCov_9fa48("6609");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("6610")) {
        {}
      } else {
        stryCov_9fa48("6610");
        try {
          if (stryMutAct_9fa48("6611")) {
            {}
          } else {
            stryCov_9fa48("6611");
            logApiRequest(stryMutAct_9fa48("6612") ? "" : (stryCov_9fa48("6612"), 'POST'), stryMutAct_9fa48("6613") ? "" : (stryCov_9fa48("6613"), '/api/attempts'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("6616") ? false : stryMutAct_9fa48("6615") ? true : stryMutAct_9fa48("6614") ? studentId : (stryCov_9fa48("6614", "6615", "6616"), !studentId)) {
              if (stryMutAct_9fa48("6617")) {
                {}
              } else {
                stryCov_9fa48("6617");
                return NextResponse.json(stryMutAct_9fa48("6618") ? {} : (stryCov_9fa48("6618"), {
                  error: stryMutAct_9fa48("6619") ? "" : (stryCov_9fa48("6619"), 'No autorizado')
                }), stryMutAct_9fa48("6620") ? {} : (stryCov_9fa48("6620"), {
                  status: 401
                }));
              }
            }

            // Validar body
            const validation = await validateBody(request, createAttemptSchema);
            if (stryMutAct_9fa48("6623") ? false : stryMutAct_9fa48("6622") ? true : stryMutAct_9fa48("6621") ? validation.success : (stryCov_9fa48("6621", "6622", "6623"), !validation.success)) {
              if (stryMutAct_9fa48("6624")) {
                {}
              } else {
                stryCov_9fa48("6624");
                return validation.error;
              }
            }
            const {
              examId,
              proceso,
              tipoAplicacion,
              forma
            } = validation.data;

            // Verificar que el estudiante existe
            const student = await prisma.student.findUnique(stryMutAct_9fa48("6625") ? {} : (stryCov_9fa48("6625"), {
              where: stryMutAct_9fa48("6626") ? {} : (stryCov_9fa48("6626"), {
                id: studentId
              })
            }));
            if (stryMutAct_9fa48("6629") ? false : stryMutAct_9fa48("6628") ? true : stryMutAct_9fa48("6627") ? student : (stryCov_9fa48("6627", "6628", "6629"), !student)) {
              if (stryMutAct_9fa48("6630")) {
                {}
              } else {
                stryCov_9fa48("6630");
                return NextResponse.json(stryMutAct_9fa48("6631") ? {} : (stryCov_9fa48("6631"), {
                  error: stryMutAct_9fa48("6632") ? "" : (stryCov_9fa48("6632"), 'Estudiante no encontrado')
                }), stryMutAct_9fa48("6633") ? {} : (stryCov_9fa48("6633"), {
                  status: 404
                }));
              }
            }

            // Verificar que el examen existe y obtener información
            const exam = await prisma.exam.findUnique(stryMutAct_9fa48("6634") ? {} : (stryCov_9fa48("6634"), {
              where: stryMutAct_9fa48("6635") ? {} : (stryCov_9fa48("6635"), {
                id: examId
              }),
              include: stryMutAct_9fa48("6636") ? {} : (stryCov_9fa48("6636"), {
                questions: stryMutAct_9fa48("6637") ? {} : (stryCov_9fa48("6637"), {
                  include: stryMutAct_9fa48("6638") ? {} : (stryCov_9fa48("6638"), {
                    question: stryMutAct_9fa48("6639") ? false : (stryCov_9fa48("6639"), true)
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("6642") ? false : stryMutAct_9fa48("6641") ? true : stryMutAct_9fa48("6640") ? exam : (stryCov_9fa48("6640", "6641", "6642"), !exam)) {
              if (stryMutAct_9fa48("6643")) {
                {}
              } else {
                stryCov_9fa48("6643");
                return NextResponse.json(stryMutAct_9fa48("6644") ? {} : (stryCov_9fa48("6644"), {
                  error: stryMutAct_9fa48("6645") ? "" : (stryCov_9fa48("6645"), 'Examen no encontrado')
                }), stryMutAct_9fa48("6646") ? {} : (stryCov_9fa48("6646"), {
                  status: 404
                }));
              }
            }

            // Usar transacción para prevenir race condition en creación de intentos
            // Si dos requests llegan simultáneamente, solo uno creará el intento
            const attempt = await prisma.$transaction(async tx => {
              if (stryMutAct_9fa48("6647")) {
                {}
              } else {
                stryCov_9fa48("6647");
                // Verificar si ya existe un intento en progreso (dentro de la transacción)
                const existingAttempt = await tx.attempt.findFirst(stryMutAct_9fa48("6648") ? {} : (stryCov_9fa48("6648"), {
                  where: stryMutAct_9fa48("6649") ? {} : (stryCov_9fa48("6649"), {
                    studentId,
                    examId,
                    estado: stryMutAct_9fa48("6650") ? "" : (stryCov_9fa48("6650"), 'en_progreso')
                  }),
                  include: stryMutAct_9fa48("6651") ? {} : (stryCov_9fa48("6651"), {
                    exam: stryMutAct_9fa48("6652") ? {} : (stryCov_9fa48("6652"), {
                      include: stryMutAct_9fa48("6653") ? {} : (stryCov_9fa48("6653"), {
                        subject: stryMutAct_9fa48("6654") ? false : (stryCov_9fa48("6654"), true),
                        questions: stryMutAct_9fa48("6655") ? {} : (stryCov_9fa48("6655"), {
                          include: stryMutAct_9fa48("6656") ? {} : (stryCov_9fa48("6656"), {
                            question: stryMutAct_9fa48("6657") ? {} : (stryCov_9fa48("6657"), {
                              include: stryMutAct_9fa48("6658") ? {} : (stryCov_9fa48("6658"), {
                                options: stryMutAct_9fa48("6659") ? false : (stryCov_9fa48("6659"), true)
                              })
                            })
                          }),
                          orderBy: stryMutAct_9fa48("6660") ? {} : (stryCov_9fa48("6660"), {
                            orden: stryMutAct_9fa48("6661") ? "" : (stryCov_9fa48("6661"), 'asc')
                          })
                        })
                      })
                    })
                  })
                }));
                if (stryMutAct_9fa48("6663") ? false : stryMutAct_9fa48("6662") ? true : (stryCov_9fa48("6662", "6663"), existingAttempt)) {
                  if (stryMutAct_9fa48("6664")) {
                    {}
                  } else {
                    stryCov_9fa48("6664");
                    // Retornar el intento existente
                    return existingAttempt;
                  }
                }

                // Crear nuevo intento (atómico dentro de la transacción)
                return await tx.attempt.create(stryMutAct_9fa48("6665") ? {} : (stryCov_9fa48("6665"), {
                  data: stryMutAct_9fa48("6666") ? {} : (stryCov_9fa48("6666"), {
                    studentId,
                    examId,
                    proceso: stryMutAct_9fa48("6669") ? proceso && null : stryMutAct_9fa48("6668") ? false : stryMutAct_9fa48("6667") ? true : (stryCov_9fa48("6667", "6668", "6669"), proceso || null),
                    tipoAplicacion: stryMutAct_9fa48("6672") ? tipoAplicacion && null : stryMutAct_9fa48("6671") ? false : stryMutAct_9fa48("6670") ? true : (stryCov_9fa48("6670", "6671", "6672"), tipoAplicacion || null),
                    forma: stryMutAct_9fa48("6675") ? forma && null : stryMutAct_9fa48("6674") ? false : stryMutAct_9fa48("6673") ? true : (stryCov_9fa48("6673", "6674", "6675"), forma || null),
                    estado: stryMutAct_9fa48("6676") ? "" : (stryCov_9fa48("6676"), 'en_progreso'),
                    totalPreguntas: exam.totalPreguntas,
                    startedAt: new Date()
                  }),
                  include: stryMutAct_9fa48("6677") ? {} : (stryCov_9fa48("6677"), {
                    exam: stryMutAct_9fa48("6678") ? {} : (stryCov_9fa48("6678"), {
                      include: stryMutAct_9fa48("6679") ? {} : (stryCov_9fa48("6679"), {
                        subject: stryMutAct_9fa48("6680") ? false : (stryCov_9fa48("6680"), true),
                        questions: stryMutAct_9fa48("6681") ? {} : (stryCov_9fa48("6681"), {
                          include: stryMutAct_9fa48("6682") ? {} : (stryCov_9fa48("6682"), {
                            question: stryMutAct_9fa48("6683") ? {} : (stryCov_9fa48("6683"), {
                              include: stryMutAct_9fa48("6684") ? {} : (stryCov_9fa48("6684"), {
                                options: stryMutAct_9fa48("6685") ? false : (stryCov_9fa48("6685"), true)
                              })
                            })
                          }),
                          orderBy: stryMutAct_9fa48("6686") ? {} : (stryCov_9fa48("6686"), {
                            orden: stryMutAct_9fa48("6687") ? "" : (stryCov_9fa48("6687"), 'asc')
                          })
                        })
                      })
                    })
                  })
                }));
              }
            }, stryMutAct_9fa48("6688") ? {} : (stryCov_9fa48("6688"), {
              isolationLevel: stryMutAct_9fa48("6689") ? "" : (stryCov_9fa48("6689"), 'Serializable') // Máximo nivel de aislamiento para prevenir race conditions
            }));

            // Invalidar caché de intentos del estudiante para que aparezca el nuevo intento
            await invalidateCachePattern(stryMutAct_9fa48("6690") ? `` : (stryCov_9fa48("6690"), `student:${studentId}:attempts:*`));

            // Retornar el intento (existente o nuevo)
            const statusCode = (stryMutAct_9fa48("6693") ? attempt.startedAt || Math.abs(new Date().getTime() - new Date(attempt.startedAt).getTime()) < NEW_ATTEMPT_THRESHOLD_MS : stryMutAct_9fa48("6692") ? false : stryMutAct_9fa48("6691") ? true : (stryCov_9fa48("6691", "6692", "6693"), attempt.startedAt && (stryMutAct_9fa48("6696") ? Math.abs(new Date().getTime() - new Date(attempt.startedAt).getTime()) >= NEW_ATTEMPT_THRESHOLD_MS : stryMutAct_9fa48("6695") ? Math.abs(new Date().getTime() - new Date(attempt.startedAt).getTime()) <= NEW_ATTEMPT_THRESHOLD_MS : stryMutAct_9fa48("6694") ? true : (stryCov_9fa48("6694", "6695", "6696"), Math.abs(stryMutAct_9fa48("6697") ? new Date().getTime() + new Date(attempt.startedAt).getTime() : (stryCov_9fa48("6697"), new Date().getTime() - new Date(attempt.startedAt).getTime())) < NEW_ATTEMPT_THRESHOLD_MS)))) ? HTTP_CREATED // Nuevo intento (creado hace menos de 1 segundo)
            : HTTP_OK; // Intento existente

            return NextResponse.json(attempt, stryMutAct_9fa48("6698") ? {} : (stryCov_9fa48("6698"), {
              status: statusCode
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6699")) {
            {}
          } else {
            stryCov_9fa48("6699");
            return handleApiError(error, stryMutAct_9fa48("6700") ? "" : (stryCov_9fa48("6700"), 'Error al crear intento'), stryMutAct_9fa48("6701") ? {} : (stryCov_9fa48("6701"), {
              path: stryMutAct_9fa48("6702") ? "" : (stryCov_9fa48("6702"), '/api/attempts')
            }));
          }
        }
      }
    });
  }
}