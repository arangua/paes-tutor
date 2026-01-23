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
export const runtime = stryMutAct_9fa48("10320") ? "" : (stryCov_9fa48("10320"), 'nodejs');
const shareExamSchema = z.object(stryMutAct_9fa48("10321") ? {} : (stryCov_9fa48("10321"), {
  examId: stryMutAct_9fa48("10322") ? z.string().max(1) : (stryCov_9fa48("10322"), z.string().min(1)),
  message: z.string().optional()
}));

/**
 * GET: Obtener exámenes compartidos con el usuario actual
 */
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10323")) {
    {}
  } else {
    stryCov_9fa48("10323");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10324")) {
        {}
      } else {
        stryCov_9fa48("10324");
        try {
          if (stryMutAct_9fa48("10325")) {
            {}
          } else {
            stryCov_9fa48("10325");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10328") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10327") ? false : stryMutAct_9fa48("10326") ? true : (stryCov_9fa48("10326", "10327", "10328"), (stryMutAct_9fa48("10329") ? dbUser?.email : (stryCov_9fa48("10329"), !(stryMutAct_9fa48("10330") ? dbUser.email : (stryCov_9fa48("10330"), dbUser?.email)))) || (stryMutAct_9fa48("10331") ? dbUser.student : (stryCov_9fa48("10331"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10332")) {
                {}
              } else {
                stryCov_9fa48("10332");
                return NextResponse.json(stryMutAct_9fa48("10333") ? {} : (stryCov_9fa48("10333"), {
                  error: stryMutAct_9fa48("10334") ? "" : (stryCov_9fa48("10334"), 'No autorizado')
                }), stryMutAct_9fa48("10335") ? {} : (stryCov_9fa48("10335"), {
                  status: 401
                }));
              }
            }
            const {
              searchParams
            } = new URL(request.url);
            const type = stryMutAct_9fa48("10338") ? searchParams.get('type') && 'received' : stryMutAct_9fa48("10337") ? false : stryMutAct_9fa48("10336") ? true : (stryCov_9fa48("10336", "10337", "10338"), searchParams.get(stryMutAct_9fa48("10339") ? "" : (stryCov_9fa48("10339"), 'type')) || (stryMutAct_9fa48("10340") ? "" : (stryCov_9fa48("10340"), 'received'))); // 'received' | 'sent'

            if (stryMutAct_9fa48("10343") ? type !== 'received' : stryMutAct_9fa48("10342") ? false : stryMutAct_9fa48("10341") ? true : (stryCov_9fa48("10341", "10342", "10343"), type === (stryMutAct_9fa48("10344") ? "" : (stryCov_9fa48("10344"), 'received')))) {
              if (stryMutAct_9fa48("10345")) {
                {}
              } else {
                stryCov_9fa48("10345");
                // Exámenes compartidos CON el usuario actual
                const sharedExams = await prisma.sharedExam.findMany(stryMutAct_9fa48("10346") ? {} : (stryCov_9fa48("10346"), {
                  where: stryMutAct_9fa48("10347") ? {} : (stryCov_9fa48("10347"), {
                    sharedWithId: dbUser.student.id
                  }),
                  include: stryMutAct_9fa48("10348") ? {} : (stryCov_9fa48("10348"), {
                    exam: stryMutAct_9fa48("10349") ? {} : (stryCov_9fa48("10349"), {
                      include: stryMutAct_9fa48("10350") ? {} : (stryCov_9fa48("10350"), {
                        subject: stryMutAct_9fa48("10351") ? {} : (stryCov_9fa48("10351"), {
                          select: stryMutAct_9fa48("10352") ? {} : (stryCov_9fa48("10352"), {
                            id: stryMutAct_9fa48("10353") ? false : (stryCov_9fa48("10353"), true),
                            nombre: stryMutAct_9fa48("10354") ? false : (stryCov_9fa48("10354"), true),
                            codigo: stryMutAct_9fa48("10355") ? false : (stryCov_9fa48("10355"), true)
                          })
                        })
                      })
                    }),
                    sharedBy: stryMutAct_9fa48("10356") ? {} : (stryCov_9fa48("10356"), {
                      select: stryMutAct_9fa48("10357") ? {} : (stryCov_9fa48("10357"), {
                        id: stryMutAct_9fa48("10358") ? false : (stryCov_9fa48("10358"), true),
                        nombre: stryMutAct_9fa48("10359") ? false : (stryCov_9fa48("10359"), true),
                        user: stryMutAct_9fa48("10360") ? {} : (stryCov_9fa48("10360"), {
                          select: stryMutAct_9fa48("10361") ? {} : (stryCov_9fa48("10361"), {
                            email: stryMutAct_9fa48("10362") ? false : (stryCov_9fa48("10362"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("10363") ? {} : (stryCov_9fa48("10363"), {
                    createdAt: stryMutAct_9fa48("10364") ? "" : (stryCov_9fa48("10364"), 'desc')
                  })
                }));
                return NextResponse.json(stryMutAct_9fa48("10365") ? {} : (stryCov_9fa48("10365"), {
                  sharedExams
                }));
              }
            } else {
              if (stryMutAct_9fa48("10366")) {
                {}
              } else {
                stryCov_9fa48("10366");
                // Exámenes compartidos POR el usuario actual
                const sharedExams = await prisma.sharedExam.findMany(stryMutAct_9fa48("10367") ? {} : (stryCov_9fa48("10367"), {
                  where: stryMutAct_9fa48("10368") ? {} : (stryCov_9fa48("10368"), {
                    sharedById: dbUser.student.id
                  }),
                  include: stryMutAct_9fa48("10369") ? {} : (stryCov_9fa48("10369"), {
                    exam: stryMutAct_9fa48("10370") ? {} : (stryCov_9fa48("10370"), {
                      include: stryMutAct_9fa48("10371") ? {} : (stryCov_9fa48("10371"), {
                        subject: stryMutAct_9fa48("10372") ? {} : (stryCov_9fa48("10372"), {
                          select: stryMutAct_9fa48("10373") ? {} : (stryCov_9fa48("10373"), {
                            id: stryMutAct_9fa48("10374") ? false : (stryCov_9fa48("10374"), true),
                            nombre: stryMutAct_9fa48("10375") ? false : (stryCov_9fa48("10375"), true),
                            codigo: stryMutAct_9fa48("10376") ? false : (stryCov_9fa48("10376"), true)
                          })
                        })
                      })
                    }),
                    sharedWith: stryMutAct_9fa48("10377") ? {} : (stryCov_9fa48("10377"), {
                      select: stryMutAct_9fa48("10378") ? {} : (stryCov_9fa48("10378"), {
                        id: stryMutAct_9fa48("10379") ? false : (stryCov_9fa48("10379"), true),
                        nombre: stryMutAct_9fa48("10380") ? false : (stryCov_9fa48("10380"), true),
                        user: stryMutAct_9fa48("10381") ? {} : (stryCov_9fa48("10381"), {
                          select: stryMutAct_9fa48("10382") ? {} : (stryCov_9fa48("10382"), {
                            email: stryMutAct_9fa48("10383") ? false : (stryCov_9fa48("10383"), true)
                          })
                        })
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("10384") ? {} : (stryCov_9fa48("10384"), {
                    createdAt: stryMutAct_9fa48("10385") ? "" : (stryCov_9fa48("10385"), 'desc')
                  })
                }));
                return NextResponse.json(stryMutAct_9fa48("10386") ? {} : (stryCov_9fa48("10386"), {
                  sharedExams
                }));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("10387")) {
            {}
          } else {
            stryCov_9fa48("10387");
            logger.error(stryMutAct_9fa48("10388") ? {} : (stryCov_9fa48("10388"), {
              type: stryMutAct_9fa48("10389") ? "" : (stryCov_9fa48("10389"), 'shared_exams_get_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10390") ? "" : (stryCov_9fa48("10390"), 'Error al obtener exámenes compartidos'));
            return NextResponse.json(stryMutAct_9fa48("10391") ? {} : (stryCov_9fa48("10391"), {
              error: stryMutAct_9fa48("10392") ? "" : (stryCov_9fa48("10392"), 'Error al obtener exámenes compartidos')
            }), stryMutAct_9fa48("10393") ? {} : (stryCov_9fa48("10393"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}

/**
 * POST: Compartir un examen con el otro estudiante
 */
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("10394")) {
    {}
  } else {
    stryCov_9fa48("10394");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10395")) {
        {}
      } else {
        stryCov_9fa48("10395");
        try {
          if (stryMutAct_9fa48("10396")) {
            {}
          } else {
            stryCov_9fa48("10396");
            const dbUser = await getAuthenticatedUserWithStudent();
            if (stryMutAct_9fa48("10399") ? !dbUser?.email && !dbUser.student : stryMutAct_9fa48("10398") ? false : stryMutAct_9fa48("10397") ? true : (stryCov_9fa48("10397", "10398", "10399"), (stryMutAct_9fa48("10400") ? dbUser?.email : (stryCov_9fa48("10400"), !(stryMutAct_9fa48("10401") ? dbUser.email : (stryCov_9fa48("10401"), dbUser?.email)))) || (stryMutAct_9fa48("10402") ? dbUser.student : (stryCov_9fa48("10402"), !dbUser.student)))) {
              if (stryMutAct_9fa48("10403")) {
                {}
              } else {
                stryCov_9fa48("10403");
                return NextResponse.json(stryMutAct_9fa48("10404") ? {} : (stryCov_9fa48("10404"), {
                  error: stryMutAct_9fa48("10405") ? "" : (stryCov_9fa48("10405"), 'No autorizado')
                }), stryMutAct_9fa48("10406") ? {} : (stryCov_9fa48("10406"), {
                  status: 401
                }));
              }
            }
            const body = await request.json();
            const validation = shareExamSchema.safeParse(body);
            if (stryMutAct_9fa48("10409") ? false : stryMutAct_9fa48("10408") ? true : stryMutAct_9fa48("10407") ? validation.success : (stryCov_9fa48("10407", "10408", "10409"), !validation.success)) {
              if (stryMutAct_9fa48("10410")) {
                {}
              } else {
                stryCov_9fa48("10410");
                return NextResponse.json(stryMutAct_9fa48("10411") ? {} : (stryCov_9fa48("10411"), {
                  error: stryMutAct_9fa48("10412") ? "" : (stryCov_9fa48("10412"), 'Datos inválidos'),
                  details: validation.error.errors
                }), stryMutAct_9fa48("10413") ? {} : (stryCov_9fa48("10413"), {
                  status: 400
                }));
              }
            }
            const {
              examId,
              message
            } = validation.data;

            // Verificar que el examen existe
            const exam = await prisma.exam.findUnique(stryMutAct_9fa48("10414") ? {} : (stryCov_9fa48("10414"), {
              where: stryMutAct_9fa48("10415") ? {} : (stryCov_9fa48("10415"), {
                id: examId
              })
            }));
            if (stryMutAct_9fa48("10418") ? false : stryMutAct_9fa48("10417") ? true : stryMutAct_9fa48("10416") ? exam : (stryCov_9fa48("10416", "10417", "10418"), !exam)) {
              if (stryMutAct_9fa48("10419")) {
                {}
              } else {
                stryCov_9fa48("10419");
                return NextResponse.json(stryMutAct_9fa48("10420") ? {} : (stryCov_9fa48("10420"), {
                  error: stryMutAct_9fa48("10421") ? "" : (stryCov_9fa48("10421"), 'Examen no encontrado')
                }), stryMutAct_9fa48("10422") ? {} : (stryCov_9fa48("10422"), {
                  status: 404
                }));
              }
            }

            // Obtener todos los estudiantes para encontrar el otro
            const allStudents = await prisma.student.findMany(stryMutAct_9fa48("10423") ? {} : (stryCov_9fa48("10423"), {
              select: stryMutAct_9fa48("10424") ? {} : (stryCov_9fa48("10424"), {
                id: stryMutAct_9fa48("10425") ? false : (stryCov_9fa48("10425"), true)
              }),
              orderBy: stryMutAct_9fa48("10426") ? {} : (stryCov_9fa48("10426"), {
                createdAt: stryMutAct_9fa48("10427") ? "" : (stryCov_9fa48("10427"), 'asc')
              })
            }));
            if (stryMutAct_9fa48("10431") ? allStudents.length >= 2 : stryMutAct_9fa48("10430") ? allStudents.length <= 2 : stryMutAct_9fa48("10429") ? false : stryMutAct_9fa48("10428") ? true : (stryCov_9fa48("10428", "10429", "10430", "10431"), allStudents.length < 2)) {
              if (stryMutAct_9fa48("10432")) {
                {}
              } else {
                stryCov_9fa48("10432");
                return NextResponse.json(stryMutAct_9fa48("10433") ? {} : (stryCov_9fa48("10433"), {
                  error: stryMutAct_9fa48("10434") ? "" : (stryCov_9fa48("10434"), 'Se necesitan al menos 2 estudiantes para compartir')
                }), stryMutAct_9fa48("10435") ? {} : (stryCov_9fa48("10435"), {
                  status: 400
                }));
              }
            }

            // Encontrar el otro estudiante (el que no es el actual)
            const otherStudent = allStudents.find(stryMutAct_9fa48("10436") ? () => undefined : (stryCov_9fa48("10436"), s => stryMutAct_9fa48("10439") ? s.id === dbUser.student.id : stryMutAct_9fa48("10438") ? false : stryMutAct_9fa48("10437") ? true : (stryCov_9fa48("10437", "10438", "10439"), s.id !== dbUser.student.id)));
            if (stryMutAct_9fa48("10442") ? false : stryMutAct_9fa48("10441") ? true : stryMutAct_9fa48("10440") ? otherStudent : (stryCov_9fa48("10440", "10441", "10442"), !otherStudent)) {
              if (stryMutAct_9fa48("10443")) {
                {}
              } else {
                stryCov_9fa48("10443");
                return NextResponse.json(stryMutAct_9fa48("10444") ? {} : (stryCov_9fa48("10444"), {
                  error: stryMutAct_9fa48("10445") ? "" : (stryCov_9fa48("10445"), 'No se encontró el otro estudiante para compartir')
                }), stryMutAct_9fa48("10446") ? {} : (stryCov_9fa48("10446"), {
                  status: 404
                }));
              }
            }

            // Verificar si ya está compartido
            const existing = await prisma.sharedExam.findUnique(stryMutAct_9fa48("10447") ? {} : (stryCov_9fa48("10447"), {
              where: stryMutAct_9fa48("10448") ? {} : (stryCov_9fa48("10448"), {
                examId_sharedById_sharedWithId: stryMutAct_9fa48("10449") ? {} : (stryCov_9fa48("10449"), {
                  examId,
                  sharedById: dbUser.student.id,
                  sharedWithId: otherStudent.id
                })
              })
            }));
            if (stryMutAct_9fa48("10451") ? false : stryMutAct_9fa48("10450") ? true : (stryCov_9fa48("10450", "10451"), existing)) {
              if (stryMutAct_9fa48("10452")) {
                {}
              } else {
                stryCov_9fa48("10452");
                return NextResponse.json(stryMutAct_9fa48("10453") ? {} : (stryCov_9fa48("10453"), {
                  error: stryMutAct_9fa48("10454") ? "" : (stryCov_9fa48("10454"), 'Este examen ya fue compartido con el otro estudiante')
                }), stryMutAct_9fa48("10455") ? {} : (stryCov_9fa48("10455"), {
                  status: 409
                }));
              }
            }

            // Compartir el examen
            const sharedExam = await prisma.sharedExam.create(stryMutAct_9fa48("10456") ? {} : (stryCov_9fa48("10456"), {
              data: stryMutAct_9fa48("10457") ? {} : (stryCov_9fa48("10457"), {
                examId,
                sharedById: dbUser.student.id,
                sharedWithId: otherStudent.id,
                message: stryMutAct_9fa48("10460") ? message && null : stryMutAct_9fa48("10459") ? false : stryMutAct_9fa48("10458") ? true : (stryCov_9fa48("10458", "10459", "10460"), message || null)
              }),
              include: stryMutAct_9fa48("10461") ? {} : (stryCov_9fa48("10461"), {
                exam: stryMutAct_9fa48("10462") ? {} : (stryCov_9fa48("10462"), {
                  include: stryMutAct_9fa48("10463") ? {} : (stryCov_9fa48("10463"), {
                    subject: stryMutAct_9fa48("10464") ? {} : (stryCov_9fa48("10464"), {
                      select: stryMutAct_9fa48("10465") ? {} : (stryCov_9fa48("10465"), {
                        id: stryMutAct_9fa48("10466") ? false : (stryCov_9fa48("10466"), true),
                        nombre: stryMutAct_9fa48("10467") ? false : (stryCov_9fa48("10467"), true),
                        codigo: stryMutAct_9fa48("10468") ? false : (stryCov_9fa48("10468"), true)
                      })
                    })
                  })
                }),
                sharedWith: stryMutAct_9fa48("10469") ? {} : (stryCov_9fa48("10469"), {
                  select: stryMutAct_9fa48("10470") ? {} : (stryCov_9fa48("10470"), {
                    id: stryMutAct_9fa48("10471") ? false : (stryCov_9fa48("10471"), true),
                    nombre: stryMutAct_9fa48("10472") ? false : (stryCov_9fa48("10472"), true)
                  })
                })
              })
            }));
            return NextResponse.json(stryMutAct_9fa48("10473") ? {} : (stryCov_9fa48("10473"), {
              sharedExam,
              message: stryMutAct_9fa48("10474") ? "" : (stryCov_9fa48("10474"), 'Examen compartido exitosamente')
            }), stryMutAct_9fa48("10475") ? {} : (stryCov_9fa48("10475"), {
              status: 201
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("10476")) {
            {}
          } else {
            stryCov_9fa48("10476");
            logger.error(stryMutAct_9fa48("10477") ? {} : (stryCov_9fa48("10477"), {
              type: stryMutAct_9fa48("10478") ? "" : (stryCov_9fa48("10478"), 'shared_exams_post_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined
            }), stryMutAct_9fa48("10479") ? "" : (stryCov_9fa48("10479"), 'Error al compartir examen'));
            return NextResponse.json(stryMutAct_9fa48("10480") ? {} : (stryCov_9fa48("10480"), {
              error: stryMutAct_9fa48("10481") ? "" : (stryCov_9fa48("10481"), 'Error al compartir examen')
            }), stryMutAct_9fa48("10482") ? {} : (stryCov_9fa48("10482"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}