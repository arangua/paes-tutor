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
import { getCurrentUser } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';
export const runtime = stryMutAct_9fa48("2217") ? "" : (stryCov_9fa48("2217"), 'nodejs');

// Schema de validación
const cleanupSchema = z.object(stryMutAct_9fa48("2218") ? {} : (stryCov_9fa48("2218"), {
  deleteExams: z.boolean().default(stryMutAct_9fa48("2219") ? true : (stryCov_9fa48("2219"), false)),
  deleteTopics: z.boolean().default(stryMutAct_9fa48("2220") ? true : (stryCov_9fa48("2220"), false)),
  deleteQuestions: z.boolean().default(stryMutAct_9fa48("2221") ? true : (stryCov_9fa48("2221"), false)),
  deleteAttempts: z.boolean().default(stryMutAct_9fa48("2222") ? true : (stryCov_9fa48("2222"), false)),
  deleteTestUsers: z.boolean().default(stryMutAct_9fa48("2223") ? true : (stryCov_9fa48("2223"), false)),
  // Opciones adicionales
  onlyTestData: z.boolean().default(stryMutAct_9fa48("2224") ? false : (stryCov_9fa48("2224"), true)),
  // Solo eliminar datos marcados como test
  yearFilter: z.string().optional(),
  // Filtrar por año específico
  subjectFilter: z.string().optional() // Filtrar por asignatura específica
}));
interface CleanupResult {
  exams: {
    deleted: number;
    total: number;
  };
  topics: {
    deleted: number;
    total: number;
  };
  questions: {
    deleted: number;
    total: number;
  };
  attempts: {
    deleted: number;
    total: number;
  };
  users: {
    deleted: number;
    total: number;
  };
  errors: Array<{
    type: string;
    error: string;
  }>;
}

// Nota: Las funciones isTestExam e isTestUser fueron removidas porque
// la detección se hace directamente en las consultas de Prisma usando
// filtros con palabras clave, lo cual es más eficiente.

/**
 * Limpia datos de prueba de la base de datos
 */
async function cleanupTestData(data: z.infer<typeof cleanupSchema>): Promise<CleanupResult> {
  if (stryMutAct_9fa48("2225")) {
    {}
  } else {
    stryCov_9fa48("2225");
    const result: CleanupResult = stryMutAct_9fa48("2226") ? {} : (stryCov_9fa48("2226"), {
      exams: stryMutAct_9fa48("2227") ? {} : (stryCov_9fa48("2227"), {
        deleted: 0,
        total: 0
      }),
      topics: stryMutAct_9fa48("2228") ? {} : (stryCov_9fa48("2228"), {
        deleted: 0,
        total: 0
      }),
      questions: stryMutAct_9fa48("2229") ? {} : (stryCov_9fa48("2229"), {
        deleted: 0,
        total: 0
      }),
      attempts: stryMutAct_9fa48("2230") ? {} : (stryCov_9fa48("2230"), {
        deleted: 0,
        total: 0
      }),
      users: stryMutAct_9fa48("2231") ? {} : (stryCov_9fa48("2231"), {
        deleted: 0,
        total: 0
      }),
      errors: stryMutAct_9fa48("2232") ? ["Stryker was here"] : (stryCov_9fa48("2232"), [])
    });
    try {
      if (stryMutAct_9fa48("2233")) {
        {}
      } else {
        stryCov_9fa48("2233");
        await prisma.$transaction(async tx => {
          if (stryMutAct_9fa48("2234")) {
            {}
          } else {
            stryCov_9fa48("2234");
            // 1. Eliminar intentos (attempts) primero (dependencias)
            if (stryMutAct_9fa48("2236") ? false : stryMutAct_9fa48("2235") ? true : (stryCov_9fa48("2235", "2236"), data.deleteAttempts)) {
              if (stryMutAct_9fa48("2237")) {
                {}
              } else {
                stryCov_9fa48("2237");
                try {
                  if (stryMutAct_9fa48("2238")) {
                    {}
                  } else {
                    stryCov_9fa48("2238");
                    let whereClause: Prisma.AttemptWhereInput = {};
                    if (stryMutAct_9fa48("2240") ? false : stryMutAct_9fa48("2239") ? true : (stryCov_9fa48("2239", "2240"), data.onlyTestData)) {
                      if (stryMutAct_9fa48("2241")) {
                        {}
                      } else {
                        stryCov_9fa48("2241");
                        // Buscar intentos de exámenes de prueba
                        const testExams = await tx.exam.findMany(stryMutAct_9fa48("2242") ? {} : (stryCov_9fa48("2242"), {
                          where: stryMutAct_9fa48("2243") ? {} : (stryCov_9fa48("2243"), {
                            OR: stryMutAct_9fa48("2244") ? [] : (stryCov_9fa48("2244"), [stryMutAct_9fa48("2245") ? {} : (stryCov_9fa48("2245"), {
                              tipo: stryMutAct_9fa48("2246") ? "" : (stryCov_9fa48("2246"), 'simulacro')
                            }), stryMutAct_9fa48("2247") ? {} : (stryCov_9fa48("2247"), {
                              titulo: stryMutAct_9fa48("2248") ? {} : (stryCov_9fa48("2248"), {
                                contains: stryMutAct_9fa48("2249") ? "" : (stryCov_9fa48("2249"), 'test'),
                                mode: stryMutAct_9fa48("2250") ? "" : (stryCov_9fa48("2250"), 'insensitive')
                              })
                            }), stryMutAct_9fa48("2251") ? {} : (stryCov_9fa48("2251"), {
                              titulo: stryMutAct_9fa48("2252") ? {} : (stryCov_9fa48("2252"), {
                                contains: stryMutAct_9fa48("2253") ? "" : (stryCov_9fa48("2253"), 'prueba'),
                                mode: stryMutAct_9fa48("2254") ? "" : (stryCov_9fa48("2254"), 'insensitive')
                              })
                            }), stryMutAct_9fa48("2255") ? {} : (stryCov_9fa48("2255"), {
                              titulo: stryMutAct_9fa48("2256") ? {} : (stryCov_9fa48("2256"), {
                                contains: stryMutAct_9fa48("2257") ? "" : (stryCov_9fa48("2257"), 'demo'),
                                mode: stryMutAct_9fa48("2258") ? "" : (stryCov_9fa48("2258"), 'insensitive')
                              })
                            }), stryMutAct_9fa48("2259") ? {} : (stryCov_9fa48("2259"), {
                              descripcion: stryMutAct_9fa48("2260") ? {} : (stryCov_9fa48("2260"), {
                                contains: stryMutAct_9fa48("2261") ? "" : (stryCov_9fa48("2261"), 'test'),
                                mode: stryMutAct_9fa48("2262") ? "" : (stryCov_9fa48("2262"), 'insensitive')
                              })
                            }), stryMutAct_9fa48("2263") ? {} : (stryCov_9fa48("2263"), {
                              descripcion: stryMutAct_9fa48("2264") ? {} : (stryCov_9fa48("2264"), {
                                contains: stryMutAct_9fa48("2265") ? "" : (stryCov_9fa48("2265"), 'prueba'),
                                mode: stryMutAct_9fa48("2266") ? "" : (stryCov_9fa48("2266"), 'insensitive')
                              })
                            })])
                          }),
                          select: stryMutAct_9fa48("2267") ? {} : (stryCov_9fa48("2267"), {
                            id: stryMutAct_9fa48("2268") ? false : (stryCov_9fa48("2268"), true)
                          })
                        }));
                        if (stryMutAct_9fa48("2272") ? testExams.length <= 0 : stryMutAct_9fa48("2271") ? testExams.length >= 0 : stryMutAct_9fa48("2270") ? false : stryMutAct_9fa48("2269") ? true : (stryCov_9fa48("2269", "2270", "2271", "2272"), testExams.length > 0)) {
                          if (stryMutAct_9fa48("2273")) {
                            {}
                          } else {
                            stryCov_9fa48("2273");
                            whereClause.examId = stryMutAct_9fa48("2274") ? {} : (stryCov_9fa48("2274"), {
                              in: testExams.map(stryMutAct_9fa48("2275") ? () => undefined : (stryCov_9fa48("2275"), e => e.id))
                            });
                          }
                        } else {
                          if (stryMutAct_9fa48("2276")) {
                            {}
                          } else {
                            stryCov_9fa48("2276");
                            // Si no hay exámenes de prueba, no hay intentos que eliminar
                            // Usar un ID que no existe para que la consulta no devuelva resultados
                            whereClause.id = stryMutAct_9fa48("2277") ? "" : (stryCov_9fa48("2277"), '00000000000000000000000');
                          }
                        }
                      }
                    }
                    if (stryMutAct_9fa48("2279") ? false : stryMutAct_9fa48("2278") ? true : (stryCov_9fa48("2278", "2279"), data.yearFilter)) {
                      if (stryMutAct_9fa48("2280")) {
                        {}
                      } else {
                        stryCov_9fa48("2280");
                        // Buscar exámenes del año especificado
                        const examsByYear = await tx.exam.findMany(stryMutAct_9fa48("2281") ? {} : (stryCov_9fa48("2281"), {
                          where: stryMutAct_9fa48("2282") ? {} : (stryCov_9fa48("2282"), {
                            fuente: stryMutAct_9fa48("2283") ? {} : (stryCov_9fa48("2283"), {
                              contains: data.yearFilter
                            })
                          }),
                          select: stryMutAct_9fa48("2284") ? {} : (stryCov_9fa48("2284"), {
                            id: stryMutAct_9fa48("2285") ? false : (stryCov_9fa48("2285"), true)
                          })
                        }));
                        if (stryMutAct_9fa48("2289") ? examsByYear.length <= 0 : stryMutAct_9fa48("2288") ? examsByYear.length >= 0 : stryMutAct_9fa48("2287") ? false : stryMutAct_9fa48("2286") ? true : (stryCov_9fa48("2286", "2287", "2288", "2289"), examsByYear.length > 0)) {
                          if (stryMutAct_9fa48("2290")) {
                            {}
                          } else {
                            stryCov_9fa48("2290");
                            // Combinar con el filtro existente de examId (intersección)
                            if (stryMutAct_9fa48("2293") ? whereClause.examId || whereClause.examId.in : stryMutAct_9fa48("2292") ? false : stryMutAct_9fa48("2291") ? true : (stryCov_9fa48("2291", "2292", "2293"), whereClause.examId && whereClause.examId.in)) {
                              if (stryMutAct_9fa48("2294")) {
                                {}
                              } else {
                                stryCov_9fa48("2294");
                                // Intersectar: solo intentos de exámenes de prueba Y del año especificado
                                const examIdsSet = new Set(examsByYear.map(stryMutAct_9fa48("2295") ? () => undefined : (stryCov_9fa48("2295"), e => e.id)));
                                const filteredIds = stryMutAct_9fa48("2296") ? whereClause.examId.in : (stryCov_9fa48("2296"), whereClause.examId.in.filter(stryMutAct_9fa48("2297") ? () => undefined : (stryCov_9fa48("2297"), (id: string) => examIdsSet.has(id))));
                                if (stryMutAct_9fa48("2301") ? filteredIds.length <= 0 : stryMutAct_9fa48("2300") ? filteredIds.length >= 0 : stryMutAct_9fa48("2299") ? false : stryMutAct_9fa48("2298") ? true : (stryCov_9fa48("2298", "2299", "2300", "2301"), filteredIds.length > 0)) {
                                  if (stryMutAct_9fa48("2302")) {
                                    {}
                                  } else {
                                    stryCov_9fa48("2302");
                                    whereClause.examId = stryMutAct_9fa48("2303") ? {} : (stryCov_9fa48("2303"), {
                                      in: filteredIds
                                    });
                                  }
                                } else {
                                  if (stryMutAct_9fa48("2304")) {
                                    {}
                                  } else {
                                    stryCov_9fa48("2304");
                                    // No hay intersección, no hay intentos que eliminar
                                    whereClause.id = stryMutAct_9fa48("2305") ? "" : (stryCov_9fa48("2305"), '00000000000000000000000');
                                  }
                                }
                              }
                            } else {
                              if (stryMutAct_9fa48("2306")) {
                                {}
                              } else {
                                stryCov_9fa48("2306");
                                // Si no había filtro previo, usar solo el filtro de año
                                whereClause.examId = stryMutAct_9fa48("2307") ? {} : (stryCov_9fa48("2307"), {
                                  in: examsByYear.map(stryMutAct_9fa48("2308") ? () => undefined : (stryCov_9fa48("2308"), e => e.id))
                                });
                              }
                            }
                          }
                        } else {
                          if (stryMutAct_9fa48("2309")) {
                            {}
                          } else {
                            stryCov_9fa48("2309");
                            // No hay exámenes del año especificado
                            whereClause.id = stryMutAct_9fa48("2310") ? "" : (stryCov_9fa48("2310"), '00000000000000000000000');
                          }
                        }
                      }
                    }
                    const count = await tx.attempt.count(stryMutAct_9fa48("2311") ? {} : (stryCov_9fa48("2311"), {
                      where: whereClause
                    }));
                    result.attempts.total = count;
                    if (stryMutAct_9fa48("2315") ? count <= 0 : stryMutAct_9fa48("2314") ? count >= 0 : stryMutAct_9fa48("2313") ? false : stryMutAct_9fa48("2312") ? true : (stryCov_9fa48("2312", "2313", "2314", "2315"), count > 0)) {
                      if (stryMutAct_9fa48("2316")) {
                        {}
                      } else {
                        stryCov_9fa48("2316");
                        await tx.attempt.deleteMany(stryMutAct_9fa48("2317") ? {} : (stryCov_9fa48("2317"), {
                          where: whereClause
                        }));
                        result.attempts.deleted = count;
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("2318")) {
                    {}
                  } else {
                    stryCov_9fa48("2318");
                    result.errors.push(stryMutAct_9fa48("2319") ? {} : (stryCov_9fa48("2319"), {
                      type: stryMutAct_9fa48("2320") ? "" : (stryCov_9fa48("2320"), 'attempts'),
                      error: error instanceof Error ? error.message : stryMutAct_9fa48("2321") ? "" : (stryCov_9fa48("2321"), 'Error desconocido')
                    }));
                  }
                }
              }
            }

            // 2. Eliminar exámenes
            if (stryMutAct_9fa48("2323") ? false : stryMutAct_9fa48("2322") ? true : (stryCov_9fa48("2322", "2323"), data.deleteExams)) {
              if (stryMutAct_9fa48("2324")) {
                {}
              } else {
                stryCov_9fa48("2324");
                try {
                  if (stryMutAct_9fa48("2325")) {
                    {}
                  } else {
                    stryCov_9fa48("2325");
                    let whereClause: Prisma.ExamWhereInput = {};
                    if (stryMutAct_9fa48("2327") ? false : stryMutAct_9fa48("2326") ? true : (stryCov_9fa48("2326", "2327"), data.onlyTestData)) {
                      if (stryMutAct_9fa48("2328")) {
                        {}
                      } else {
                        stryCov_9fa48("2328");
                        whereClause.OR = stryMutAct_9fa48("2329") ? [] : (stryCov_9fa48("2329"), [stryMutAct_9fa48("2330") ? {} : (stryCov_9fa48("2330"), {
                          tipo: stryMutAct_9fa48("2331") ? "" : (stryCov_9fa48("2331"), 'simulacro')
                        }), stryMutAct_9fa48("2332") ? {} : (stryCov_9fa48("2332"), {
                          titulo: stryMutAct_9fa48("2333") ? {} : (stryCov_9fa48("2333"), {
                            contains: stryMutAct_9fa48("2334") ? "" : (stryCov_9fa48("2334"), 'test'),
                            mode: stryMutAct_9fa48("2335") ? "" : (stryCov_9fa48("2335"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2336") ? {} : (stryCov_9fa48("2336"), {
                          titulo: stryMutAct_9fa48("2337") ? {} : (stryCov_9fa48("2337"), {
                            contains: stryMutAct_9fa48("2338") ? "" : (stryCov_9fa48("2338"), 'prueba'),
                            mode: stryMutAct_9fa48("2339") ? "" : (stryCov_9fa48("2339"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2340") ? {} : (stryCov_9fa48("2340"), {
                          titulo: stryMutAct_9fa48("2341") ? {} : (stryCov_9fa48("2341"), {
                            contains: stryMutAct_9fa48("2342") ? "" : (stryCov_9fa48("2342"), 'demo'),
                            mode: stryMutAct_9fa48("2343") ? "" : (stryCov_9fa48("2343"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2344") ? {} : (stryCov_9fa48("2344"), {
                          titulo: stryMutAct_9fa48("2345") ? {} : (stryCov_9fa48("2345"), {
                            contains: stryMutAct_9fa48("2346") ? "" : (stryCov_9fa48("2346"), 'ejemplo'),
                            mode: stryMutAct_9fa48("2347") ? "" : (stryCov_9fa48("2347"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2348") ? {} : (stryCov_9fa48("2348"), {
                          descripcion: stryMutAct_9fa48("2349") ? {} : (stryCov_9fa48("2349"), {
                            contains: stryMutAct_9fa48("2350") ? "" : (stryCov_9fa48("2350"), 'test'),
                            mode: stryMutAct_9fa48("2351") ? "" : (stryCov_9fa48("2351"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2352") ? {} : (stryCov_9fa48("2352"), {
                          descripcion: stryMutAct_9fa48("2353") ? {} : (stryCov_9fa48("2353"), {
                            contains: stryMutAct_9fa48("2354") ? "" : (stryCov_9fa48("2354"), 'prueba'),
                            mode: stryMutAct_9fa48("2355") ? "" : (stryCov_9fa48("2355"), 'insensitive')
                          })
                        })]);
                      }
                    }
                    if (stryMutAct_9fa48("2357") ? false : stryMutAct_9fa48("2356") ? true : (stryCov_9fa48("2356", "2357"), data.yearFilter)) {
                      if (stryMutAct_9fa48("2358")) {
                        {}
                      } else {
                        stryCov_9fa48("2358");
                        whereClause.fuente = stryMutAct_9fa48("2359") ? {} : (stryCov_9fa48("2359"), {
                          contains: data.yearFilter
                        });
                      }
                    }
                    if (stryMutAct_9fa48("2361") ? false : stryMutAct_9fa48("2360") ? true : (stryCov_9fa48("2360", "2361"), data.subjectFilter)) {
                      if (stryMutAct_9fa48("2362")) {
                        {}
                      } else {
                        stryCov_9fa48("2362");
                        const subject = await tx.subject.findUnique(stryMutAct_9fa48("2363") ? {} : (stryCov_9fa48("2363"), {
                          where: stryMutAct_9fa48("2364") ? {} : (stryCov_9fa48("2364"), {
                            codigo: data.subjectFilter
                          }),
                          select: stryMutAct_9fa48("2365") ? {} : (stryCov_9fa48("2365"), {
                            id: stryMutAct_9fa48("2366") ? false : (stryCov_9fa48("2366"), true)
                          })
                        }));
                        if (stryMutAct_9fa48("2368") ? false : stryMutAct_9fa48("2367") ? true : (stryCov_9fa48("2367", "2368"), subject)) {
                          if (stryMutAct_9fa48("2369")) {
                            {}
                          } else {
                            stryCov_9fa48("2369");
                            whereClause.subjectId = subject.id;
                          }
                        } else {
                          if (stryMutAct_9fa48("2370")) {
                            {}
                          } else {
                            stryCov_9fa48("2370");
                            // Si la asignatura no existe, no hay exámenes que eliminar
                            whereClause.id = stryMutAct_9fa48("2371") ? "" : (stryCov_9fa48("2371"), '00000000000000000000000');
                          }
                        }
                      }
                    }
                    const count = await tx.exam.count(stryMutAct_9fa48("2372") ? {} : (stryCov_9fa48("2372"), {
                      where: whereClause
                    }));
                    result.exams.total = count;
                    if (stryMutAct_9fa48("2376") ? count <= 0 : stryMutAct_9fa48("2375") ? count >= 0 : stryMutAct_9fa48("2374") ? false : stryMutAct_9fa48("2373") ? true : (stryCov_9fa48("2373", "2374", "2375", "2376"), count > 0)) {
                      if (stryMutAct_9fa48("2377")) {
                        {}
                      } else {
                        stryCov_9fa48("2377");
                        await tx.exam.deleteMany(stryMutAct_9fa48("2378") ? {} : (stryCov_9fa48("2378"), {
                          where: whereClause
                        }));
                        result.exams.deleted = count;
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("2379")) {
                    {}
                  } else {
                    stryCov_9fa48("2379");
                    result.errors.push(stryMutAct_9fa48("2380") ? {} : (stryCov_9fa48("2380"), {
                      type: stryMutAct_9fa48("2381") ? "" : (stryCov_9fa48("2381"), 'exams'),
                      error: error instanceof Error ? error.message : stryMutAct_9fa48("2382") ? "" : (stryCov_9fa48("2382"), 'Error desconocido')
                    }));
                  }
                }
              }
            }

            // 3. Eliminar preguntas
            if (stryMutAct_9fa48("2384") ? false : stryMutAct_9fa48("2383") ? true : (stryCov_9fa48("2383", "2384"), data.deleteQuestions)) {
              if (stryMutAct_9fa48("2385")) {
                {}
              } else {
                stryCov_9fa48("2385");
                try {
                  if (stryMutAct_9fa48("2386")) {
                    {}
                  } else {
                    stryCov_9fa48("2386");
                    let whereClause: Prisma.QuestionWhereInput = {};
                    if (stryMutAct_9fa48("2388") ? false : stryMutAct_9fa48("2387") ? true : (stryCov_9fa48("2387", "2388"), data.onlyTestData)) {
                      if (stryMutAct_9fa48("2389")) {
                        {}
                      } else {
                        stryCov_9fa48("2389");
                        whereClause.OR = stryMutAct_9fa48("2390") ? [] : (stryCov_9fa48("2390"), [stryMutAct_9fa48("2391") ? {} : (stryCov_9fa48("2391"), {
                          fuente: stryMutAct_9fa48("2392") ? {} : (stryCov_9fa48("2392"), {
                            contains: stryMutAct_9fa48("2393") ? "" : (stryCov_9fa48("2393"), 'test'),
                            mode: stryMutAct_9fa48("2394") ? "" : (stryCov_9fa48("2394"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2395") ? {} : (stryCov_9fa48("2395"), {
                          fuente: stryMutAct_9fa48("2396") ? {} : (stryCov_9fa48("2396"), {
                            contains: stryMutAct_9fa48("2397") ? "" : (stryCov_9fa48("2397"), 'prueba'),
                            mode: stryMutAct_9fa48("2398") ? "" : (stryCov_9fa48("2398"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2399") ? {} : (stryCov_9fa48("2399"), {
                          fuente: stryMutAct_9fa48("2400") ? {} : (stryCov_9fa48("2400"), {
                            contains: stryMutAct_9fa48("2401") ? "" : (stryCov_9fa48("2401"), 'demo'),
                            mode: stryMutAct_9fa48("2402") ? "" : (stryCov_9fa48("2402"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2403") ? {} : (stryCov_9fa48("2403"), {
                          fuente: stryMutAct_9fa48("2404") ? {} : (stryCov_9fa48("2404"), {
                            contains: stryMutAct_9fa48("2405") ? "" : (stryCov_9fa48("2405"), 'ejemplo'),
                            mode: stryMutAct_9fa48("2406") ? "" : (stryCov_9fa48("2406"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2407") ? {} : (stryCov_9fa48("2407"), {
                          enunciado: stryMutAct_9fa48("2408") ? {} : (stryCov_9fa48("2408"), {
                            contains: stryMutAct_9fa48("2409") ? "" : (stryCov_9fa48("2409"), 'test'),
                            mode: stryMutAct_9fa48("2410") ? "" : (stryCov_9fa48("2410"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2411") ? {} : (stryCov_9fa48("2411"), {
                          enunciado: stryMutAct_9fa48("2412") ? {} : (stryCov_9fa48("2412"), {
                            contains: stryMutAct_9fa48("2413") ? "" : (stryCov_9fa48("2413"), 'prueba'),
                            mode: stryMutAct_9fa48("2414") ? "" : (stryCov_9fa48("2414"), 'insensitive')
                          })
                        })]);
                      }
                    }
                    if (stryMutAct_9fa48("2416") ? false : stryMutAct_9fa48("2415") ? true : (stryCov_9fa48("2415", "2416"), data.subjectFilter)) {
                      if (stryMutAct_9fa48("2417")) {
                        {}
                      } else {
                        stryCov_9fa48("2417");
                        const subject = await tx.subject.findUnique(stryMutAct_9fa48("2418") ? {} : (stryCov_9fa48("2418"), {
                          where: stryMutAct_9fa48("2419") ? {} : (stryCov_9fa48("2419"), {
                            codigo: data.subjectFilter
                          }),
                          select: stryMutAct_9fa48("2420") ? {} : (stryCov_9fa48("2420"), {
                            id: stryMutAct_9fa48("2421") ? false : (stryCov_9fa48("2421"), true)
                          })
                        }));
                        if (stryMutAct_9fa48("2423") ? false : stryMutAct_9fa48("2422") ? true : (stryCov_9fa48("2422", "2423"), subject)) {
                          if (stryMutAct_9fa48("2424")) {
                            {}
                          } else {
                            stryCov_9fa48("2424");
                            whereClause.subjectId = subject.id;
                          }
                        } else {
                          if (stryMutAct_9fa48("2425")) {
                            {}
                          } else {
                            stryCov_9fa48("2425");
                            // Si la asignatura no existe, no hay preguntas que eliminar
                            whereClause.id = stryMutAct_9fa48("2426") ? "" : (stryCov_9fa48("2426"), '00000000000000000000000');
                          }
                        }
                      }
                    }
                    const count = await tx.question.count(stryMutAct_9fa48("2427") ? {} : (stryCov_9fa48("2427"), {
                      where: whereClause
                    }));
                    result.questions.total = count;
                    if (stryMutAct_9fa48("2431") ? count <= 0 : stryMutAct_9fa48("2430") ? count >= 0 : stryMutAct_9fa48("2429") ? false : stryMutAct_9fa48("2428") ? true : (stryCov_9fa48("2428", "2429", "2430", "2431"), count > 0)) {
                      if (stryMutAct_9fa48("2432")) {
                        {}
                      } else {
                        stryCov_9fa48("2432");
                        await tx.question.deleteMany(stryMutAct_9fa48("2433") ? {} : (stryCov_9fa48("2433"), {
                          where: whereClause
                        }));
                        result.questions.deleted = count;
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("2434")) {
                    {}
                  } else {
                    stryCov_9fa48("2434");
                    result.errors.push(stryMutAct_9fa48("2435") ? {} : (stryCov_9fa48("2435"), {
                      type: stryMutAct_9fa48("2436") ? "" : (stryCov_9fa48("2436"), 'questions'),
                      error: error instanceof Error ? error.message : stryMutAct_9fa48("2437") ? "" : (stryCov_9fa48("2437"), 'Error desconocido')
                    }));
                  }
                }
              }
            }

            // 4. Eliminar temas (topics)
            if (stryMutAct_9fa48("2439") ? false : stryMutAct_9fa48("2438") ? true : (stryCov_9fa48("2438", "2439"), data.deleteTopics)) {
              if (stryMutAct_9fa48("2440")) {
                {}
              } else {
                stryCov_9fa48("2440");
                try {
                  if (stryMutAct_9fa48("2441")) {
                    {}
                  } else {
                    stryCov_9fa48("2441");
                    let whereClause: Prisma.TopicWhereInput = {};
                    if (stryMutAct_9fa48("2443") ? false : stryMutAct_9fa48("2442") ? true : (stryCov_9fa48("2442", "2443"), data.onlyTestData)) {
                      if (stryMutAct_9fa48("2444")) {
                        {}
                      } else {
                        stryCov_9fa48("2444");
                        whereClause.OR = stryMutAct_9fa48("2445") ? [] : (stryCov_9fa48("2445"), [stryMutAct_9fa48("2446") ? {} : (stryCov_9fa48("2446"), {
                          nombre: stryMutAct_9fa48("2447") ? {} : (stryCov_9fa48("2447"), {
                            contains: stryMutAct_9fa48("2448") ? "" : (stryCov_9fa48("2448"), 'test'),
                            mode: stryMutAct_9fa48("2449") ? "" : (stryCov_9fa48("2449"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2450") ? {} : (stryCov_9fa48("2450"), {
                          nombre: stryMutAct_9fa48("2451") ? {} : (stryCov_9fa48("2451"), {
                            contains: stryMutAct_9fa48("2452") ? "" : (stryCov_9fa48("2452"), 'prueba'),
                            mode: stryMutAct_9fa48("2453") ? "" : (stryCov_9fa48("2453"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2454") ? {} : (stryCov_9fa48("2454"), {
                          nombre: stryMutAct_9fa48("2455") ? {} : (stryCov_9fa48("2455"), {
                            contains: stryMutAct_9fa48("2456") ? "" : (stryCov_9fa48("2456"), 'demo'),
                            mode: stryMutAct_9fa48("2457") ? "" : (stryCov_9fa48("2457"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2458") ? {} : (stryCov_9fa48("2458"), {
                          ejeTematico: stryMutAct_9fa48("2459") ? {} : (stryCov_9fa48("2459"), {
                            contains: stryMutAct_9fa48("2460") ? "" : (stryCov_9fa48("2460"), 'test'),
                            mode: stryMutAct_9fa48("2461") ? "" : (stryCov_9fa48("2461"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2462") ? {} : (stryCov_9fa48("2462"), {
                          ejeTematico: stryMutAct_9fa48("2463") ? {} : (stryCov_9fa48("2463"), {
                            contains: stryMutAct_9fa48("2464") ? "" : (stryCov_9fa48("2464"), 'prueba'),
                            mode: stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), 'insensitive')
                          })
                        })]);
                      }
                    }
                    if (stryMutAct_9fa48("2467") ? false : stryMutAct_9fa48("2466") ? true : (stryCov_9fa48("2466", "2467"), data.subjectFilter)) {
                      if (stryMutAct_9fa48("2468")) {
                        {}
                      } else {
                        stryCov_9fa48("2468");
                        const subject = await tx.subject.findUnique(stryMutAct_9fa48("2469") ? {} : (stryCov_9fa48("2469"), {
                          where: stryMutAct_9fa48("2470") ? {} : (stryCov_9fa48("2470"), {
                            codigo: data.subjectFilter
                          }),
                          select: stryMutAct_9fa48("2471") ? {} : (stryCov_9fa48("2471"), {
                            id: stryMutAct_9fa48("2472") ? false : (stryCov_9fa48("2472"), true)
                          })
                        }));
                        if (stryMutAct_9fa48("2474") ? false : stryMutAct_9fa48("2473") ? true : (stryCov_9fa48("2473", "2474"), subject)) {
                          if (stryMutAct_9fa48("2475")) {
                            {}
                          } else {
                            stryCov_9fa48("2475");
                            whereClause.subjectId = subject.id;
                          }
                        } else {
                          if (stryMutAct_9fa48("2476")) {
                            {}
                          } else {
                            stryCov_9fa48("2476");
                            // Si la asignatura no existe, no hay preguntas que eliminar
                            whereClause.id = stryMutAct_9fa48("2477") ? "" : (stryCov_9fa48("2477"), '00000000000000000000000');
                          }
                        }
                      }
                    }
                    const count = await tx.topic.count(stryMutAct_9fa48("2478") ? {} : (stryCov_9fa48("2478"), {
                      where: whereClause
                    }));
                    result.topics.total = count;
                    if (stryMutAct_9fa48("2482") ? count <= 0 : stryMutAct_9fa48("2481") ? count >= 0 : stryMutAct_9fa48("2480") ? false : stryMutAct_9fa48("2479") ? true : (stryCov_9fa48("2479", "2480", "2481", "2482"), count > 0)) {
                      if (stryMutAct_9fa48("2483")) {
                        {}
                      } else {
                        stryCov_9fa48("2483");
                        await tx.topic.deleteMany(stryMutAct_9fa48("2484") ? {} : (stryCov_9fa48("2484"), {
                          where: whereClause
                        }));
                        result.topics.deleted = count;
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("2485")) {
                    {}
                  } else {
                    stryCov_9fa48("2485");
                    result.errors.push(stryMutAct_9fa48("2486") ? {} : (stryCov_9fa48("2486"), {
                      type: stryMutAct_9fa48("2487") ? "" : (stryCov_9fa48("2487"), 'topics'),
                      error: error instanceof Error ? error.message : stryMutAct_9fa48("2488") ? "" : (stryCov_9fa48("2488"), 'Error desconocido')
                    }));
                  }
                }
              }
            }

            // 5. Eliminar usuarios de prueba (último, por dependencias)
            if (stryMutAct_9fa48("2490") ? false : stryMutAct_9fa48("2489") ? true : (stryCov_9fa48("2489", "2490"), data.deleteTestUsers)) {
              if (stryMutAct_9fa48("2491")) {
                {}
              } else {
                stryCov_9fa48("2491");
                try {
                  if (stryMutAct_9fa48("2492")) {
                    {}
                  } else {
                    stryCov_9fa48("2492");
                    let whereClause: Prisma.UserWhereInput = {};
                    if (stryMutAct_9fa48("2494") ? false : stryMutAct_9fa48("2493") ? true : (stryCov_9fa48("2493", "2494"), data.onlyTestData)) {
                      if (stryMutAct_9fa48("2495")) {
                        {}
                      } else {
                        stryCov_9fa48("2495");
                        whereClause.OR = stryMutAct_9fa48("2496") ? [] : (stryCov_9fa48("2496"), [stryMutAct_9fa48("2497") ? {} : (stryCov_9fa48("2497"), {
                          email: stryMutAct_9fa48("2498") ? {} : (stryCov_9fa48("2498"), {
                            contains: stryMutAct_9fa48("2499") ? "" : (stryCov_9fa48("2499"), 'test'),
                            mode: stryMutAct_9fa48("2500") ? "" : (stryCov_9fa48("2500"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2501") ? {} : (stryCov_9fa48("2501"), {
                          email: stryMutAct_9fa48("2502") ? {} : (stryCov_9fa48("2502"), {
                            contains: stryMutAct_9fa48("2503") ? "" : (stryCov_9fa48("2503"), 'demo'),
                            mode: stryMutAct_9fa48("2504") ? "" : (stryCov_9fa48("2504"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2505") ? {} : (stryCov_9fa48("2505"), {
                          email: stryMutAct_9fa48("2506") ? {} : (stryCov_9fa48("2506"), {
                            contains: stryMutAct_9fa48("2507") ? "" : (stryCov_9fa48("2507"), 'prueba'),
                            mode: stryMutAct_9fa48("2508") ? "" : (stryCov_9fa48("2508"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2509") ? {} : (stryCov_9fa48("2509"), {
                          email: stryMutAct_9fa48("2510") ? {} : (stryCov_9fa48("2510"), {
                            contains: stryMutAct_9fa48("2511") ? "" : (stryCov_9fa48("2511"), 'example'),
                            mode: stryMutAct_9fa48("2512") ? "" : (stryCov_9fa48("2512"), 'insensitive')
                          })
                        }), stryMutAct_9fa48("2513") ? {} : (stryCov_9fa48("2513"), {
                          email: stryMutAct_9fa48("2514") ? {} : (stryCov_9fa48("2514"), {
                            contains: stryMutAct_9fa48("2515") ? "" : (stryCov_9fa48("2515"), 'ficticio'),
                            mode: stryMutAct_9fa48("2516") ? "" : (stryCov_9fa48("2516"), 'insensitive')
                          })
                        })]);
                      }
                    }
                    const count = await tx.user.count(stryMutAct_9fa48("2517") ? {} : (stryCov_9fa48("2517"), {
                      where: whereClause
                    }));
                    result.users.total = count;
                    if (stryMutAct_9fa48("2521") ? count <= 0 : stryMutAct_9fa48("2520") ? count >= 0 : stryMutAct_9fa48("2519") ? false : stryMutAct_9fa48("2518") ? true : (stryCov_9fa48("2518", "2519", "2520", "2521"), count > 0)) {
                      if (stryMutAct_9fa48("2522")) {
                        {}
                      } else {
                        stryCov_9fa48("2522");
                        // Eliminar en cascada (las relaciones están configuradas)
                        await tx.user.deleteMany(stryMutAct_9fa48("2523") ? {} : (stryCov_9fa48("2523"), {
                          where: whereClause
                        }));
                        result.users.deleted = count;
                      }
                    }
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("2524")) {
                    {}
                  } else {
                    stryCov_9fa48("2524");
                    result.errors.push(stryMutAct_9fa48("2525") ? {} : (stryCov_9fa48("2525"), {
                      type: stryMutAct_9fa48("2526") ? "" : (stryCov_9fa48("2526"), 'users'),
                      error: error instanceof Error ? error.message : stryMutAct_9fa48("2527") ? "" : (stryCov_9fa48("2527"), 'Error desconocido')
                    }));
                  }
                }
              }
            }
          }
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("2528")) {
        {}
      } else {
        stryCov_9fa48("2528");
        result.errors.push(stryMutAct_9fa48("2529") ? {} : (stryCov_9fa48("2529"), {
          type: stryMutAct_9fa48("2530") ? "" : (stryCov_9fa48("2530"), 'transaction'),
          error: error instanceof Error ? error.message : stryMutAct_9fa48("2531") ? "" : (stryCov_9fa48("2531"), 'Error en la transacción')
        }));
      }
    }
    return result;
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("2532")) {
    {}
  } else {
    stryCov_9fa48("2532");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("2533")) {
        {}
      } else {
        stryCov_9fa48("2533");
        try {
          if (stryMutAct_9fa48("2534")) {
            {}
          } else {
            stryCov_9fa48("2534");
            // Verificar autenticación
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("2537") ? false : stryMutAct_9fa48("2536") ? true : stryMutAct_9fa48("2535") ? user : (stryCov_9fa48("2535", "2536", "2537"), !user)) {
              if (stryMutAct_9fa48("2538")) {
                {}
              } else {
                stryCov_9fa48("2538");
                return NextResponse.json(stryMutAct_9fa48("2539") ? {} : (stryCov_9fa48("2539"), {
                  error: stryMutAct_9fa48("2540") ? "" : (stryCov_9fa48("2540"), 'No autorizado')
                }), stryMutAct_9fa48("2541") ? {} : (stryCov_9fa48("2541"), {
                  status: 401
                }));
              }
            }

            // Parsear y validar datos
            const body = await request.json();
            const validation = cleanupSchema.safeParse(body);
            if (stryMutAct_9fa48("2544") ? false : stryMutAct_9fa48("2543") ? true : stryMutAct_9fa48("2542") ? validation.success : (stryCov_9fa48("2542", "2543", "2544"), !validation.success)) {
              if (stryMutAct_9fa48("2545")) {
                {}
              } else {
                stryCov_9fa48("2545");
                return NextResponse.json(stryMutAct_9fa48("2546") ? {} : (stryCov_9fa48("2546"), {
                  error: stryMutAct_9fa48("2547") ? "" : (stryCov_9fa48("2547"), 'Datos inválidos'),
                  details: validation.error.issues
                }), stryMutAct_9fa48("2548") ? {} : (stryCov_9fa48("2548"), {
                  status: 400
                }));
              }
            }

            // Verificar que al menos una opción esté seleccionada
            if (stryMutAct_9fa48("2551") ? !validation.data.deleteExams && !validation.data.deleteTopics && !validation.data.deleteQuestions && !validation.data.deleteAttempts || !validation.data.deleteTestUsers : stryMutAct_9fa48("2550") ? false : stryMutAct_9fa48("2549") ? true : (stryCov_9fa48("2549", "2550", "2551"), (stryMutAct_9fa48("2553") ? !validation.data.deleteExams && !validation.data.deleteTopics && !validation.data.deleteQuestions || !validation.data.deleteAttempts : stryMutAct_9fa48("2552") ? true : (stryCov_9fa48("2552", "2553"), (stryMutAct_9fa48("2555") ? !validation.data.deleteExams && !validation.data.deleteTopics || !validation.data.deleteQuestions : stryMutAct_9fa48("2554") ? true : (stryCov_9fa48("2554", "2555"), (stryMutAct_9fa48("2557") ? !validation.data.deleteExams || !validation.data.deleteTopics : stryMutAct_9fa48("2556") ? true : (stryCov_9fa48("2556", "2557"), (stryMutAct_9fa48("2558") ? validation.data.deleteExams : (stryCov_9fa48("2558"), !validation.data.deleteExams)) && (stryMutAct_9fa48("2559") ? validation.data.deleteTopics : (stryCov_9fa48("2559"), !validation.data.deleteTopics)))) && (stryMutAct_9fa48("2560") ? validation.data.deleteQuestions : (stryCov_9fa48("2560"), !validation.data.deleteQuestions)))) && (stryMutAct_9fa48("2561") ? validation.data.deleteAttempts : (stryCov_9fa48("2561"), !validation.data.deleteAttempts)))) && (stryMutAct_9fa48("2562") ? validation.data.deleteTestUsers : (stryCov_9fa48("2562"), !validation.data.deleteTestUsers)))) {
              if (stryMutAct_9fa48("2563")) {
                {}
              } else {
                stryCov_9fa48("2563");
                return NextResponse.json(stryMutAct_9fa48("2564") ? {} : (stryCov_9fa48("2564"), {
                  error: stryMutAct_9fa48("2565") ? "" : (stryCov_9fa48("2565"), 'Debe seleccionar al menos un tipo de dato para eliminar')
                }), stryMutAct_9fa48("2566") ? {} : (stryCov_9fa48("2566"), {
                  status: 400
                }));
              }
            }

            // Ejecutar limpieza
            const result = await cleanupTestData(validation.data);

            // Construir mensaje de respuesta
            const totalDeleted = stryMutAct_9fa48("2567") ? result.exams.deleted + result.topics.deleted + result.questions.deleted + result.attempts.deleted - result.users.deleted : (stryCov_9fa48("2567"), (stryMutAct_9fa48("2568") ? result.exams.deleted + result.topics.deleted + result.questions.deleted - result.attempts.deleted : (stryCov_9fa48("2568"), (stryMutAct_9fa48("2569") ? result.exams.deleted + result.topics.deleted - result.questions.deleted : (stryCov_9fa48("2569"), (stryMutAct_9fa48("2570") ? result.exams.deleted - result.topics.deleted : (stryCov_9fa48("2570"), result.exams.deleted + result.topics.deleted)) + result.questions.deleted)) + result.attempts.deleted)) + result.users.deleted);
            const message = (stryMutAct_9fa48("2574") ? totalDeleted <= 0 : stryMutAct_9fa48("2573") ? totalDeleted >= 0 : stryMutAct_9fa48("2572") ? false : stryMutAct_9fa48("2571") ? true : (stryCov_9fa48("2571", "2572", "2573", "2574"), totalDeleted > 0)) ? stryMutAct_9fa48("2575") ? `` : (stryCov_9fa48("2575"), `Limpieza completada: ${totalDeleted} registro(s) eliminado(s)`) : stryMutAct_9fa48("2576") ? "" : (stryCov_9fa48("2576"), 'No se encontraron datos para eliminar con los criterios especificados');
            const details = (stryMutAct_9fa48("2577") ? [] : (stryCov_9fa48("2577"), [stryMutAct_9fa48("2578") ? `` : (stryCov_9fa48("2578"), `Exámenes: ${result.exams.deleted} de ${result.exams.total} eliminados`), stryMutAct_9fa48("2579") ? `` : (stryCov_9fa48("2579"), `Temas: ${result.topics.deleted} de ${result.topics.total} eliminados`), stryMutAct_9fa48("2580") ? `` : (stryCov_9fa48("2580"), `Preguntas: ${result.questions.deleted} de ${result.questions.total} eliminadas`), stryMutAct_9fa48("2581") ? `` : (stryCov_9fa48("2581"), `Intentos: ${result.attempts.deleted} de ${result.attempts.total} eliminados`), stryMutAct_9fa48("2582") ? `` : (stryCov_9fa48("2582"), `Usuarios: ${result.users.deleted} de ${result.users.total} eliminados`)])).join(stryMutAct_9fa48("2583") ? "" : (stryCov_9fa48("2583"), '\n'));
            return NextResponse.json(stryMutAct_9fa48("2584") ? {} : (stryCov_9fa48("2584"), {
              success: stryMutAct_9fa48("2585") ? false : (stryCov_9fa48("2585"), true),
              message,
              details: stryMutAct_9fa48("2586") ? details - (result.errors.length > 0 ? `\n\nErrores (${result.errors.length}):\n${result.errors.map(e => `- ${e.type}: ${e.error}`).join('\n')}` : '') : (stryCov_9fa48("2586"), details + ((stryMutAct_9fa48("2590") ? result.errors.length <= 0 : stryMutAct_9fa48("2589") ? result.errors.length >= 0 : stryMutAct_9fa48("2588") ? false : stryMutAct_9fa48("2587") ? true : (stryCov_9fa48("2587", "2588", "2589", "2590"), result.errors.length > 0)) ? stryMutAct_9fa48("2591") ? `` : (stryCov_9fa48("2591"), `\n\nErrores (${result.errors.length}):\n${result.errors.map(stryMutAct_9fa48("2592") ? () => undefined : (stryCov_9fa48("2592"), e => stryMutAct_9fa48("2593") ? `` : (stryCov_9fa48("2593"), `- ${e.type}: ${e.error}`))).join(stryMutAct_9fa48("2594") ? "" : (stryCov_9fa48("2594"), '\n'))}`) : stryMutAct_9fa48("2595") ? "Stryker was here!" : (stryCov_9fa48("2595"), ''))),
              result
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2596")) {
            {}
          } else {
            stryCov_9fa48("2596");
            return NextResponse.json(stryMutAct_9fa48("2597") ? {} : (stryCov_9fa48("2597"), {
              error: stryMutAct_9fa48("2598") ? "" : (stryCov_9fa48("2598"), 'Error al limpiar datos'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("2599") ? "" : (stryCov_9fa48("2599"), 'Error desconocido')
            }), stryMutAct_9fa48("2600") ? {} : (stryCov_9fa48("2600"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("2601") ? "" : (stryCov_9fa48("2601"), 'write'));
  }
}