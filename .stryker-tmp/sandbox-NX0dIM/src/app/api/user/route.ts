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
import { getCurrentUser } from '@/lib/get-session';
import { handleApiError } from '@/lib/api-helpers';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { validateBody } from '@/lib/api-helpers';
import { z } from 'zod';
import { invalidateCachePattern } from '@/lib/cache';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("11179") ? "" : (stryCov_9fa48("11179"), 'nodejs');

// Schema de validación para actualizar usuario
const updateUserSchema = z.object(stryMutAct_9fa48("11180") ? {} : (stryCov_9fa48("11180"), {
  name: stryMutAct_9fa48("11182") ? z.string().max(1).max(100).optional() : stryMutAct_9fa48("11181") ? z.string().min(1).min(100).optional() : (stryCov_9fa48("11181", "11182"), z.string().min(1).max(100).optional()),
  email: z.string().email().optional()
})).refine(stryMutAct_9fa48("11183") ? () => undefined : (stryCov_9fa48("11183"), data => stryMutAct_9fa48("11186") ? data.name !== undefined && data.email !== undefined : stryMutAct_9fa48("11185") ? false : stryMutAct_9fa48("11184") ? true : (stryCov_9fa48("11184", "11185", "11186"), (stryMutAct_9fa48("11188") ? data.name === undefined : stryMutAct_9fa48("11187") ? false : (stryCov_9fa48("11187", "11188"), data.name !== undefined)) || (stryMutAct_9fa48("11190") ? data.email === undefined : stryMutAct_9fa48("11189") ? false : (stryCov_9fa48("11189", "11190"), data.email !== undefined)))), stryMutAct_9fa48("11191") ? {} : (stryCov_9fa48("11191"), {
  message: stryMutAct_9fa48("11192") ? "" : (stryCov_9fa48("11192"), 'Debe proporcionar al menos un campo para actualizar')
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("11193")) {
    {}
  } else {
    stryCov_9fa48("11193");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("11194")) {
        {}
      } else {
        stryCov_9fa48("11194");
        try {
          if (stryMutAct_9fa48("11195")) {
            {}
          } else {
            stryCov_9fa48("11195");
            logApiRequest(stryMutAct_9fa48("11196") ? "" : (stryCov_9fa48("11196"), 'GET'), stryMutAct_9fa48("11197") ? "" : (stryCov_9fa48("11197"), '/api/user'));
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("11200") ? false : stryMutAct_9fa48("11199") ? true : stryMutAct_9fa48("11198") ? user : (stryCov_9fa48("11198", "11199", "11200"), !user)) {
              if (stryMutAct_9fa48("11201")) {
                {}
              } else {
                stryCov_9fa48("11201");
                return NextResponse.json(stryMutAct_9fa48("11202") ? {} : (stryCov_9fa48("11202"), {
                  error: stryMutAct_9fa48("11203") ? "" : (stryCov_9fa48("11203"), 'No autorizado')
                }), stryMutAct_9fa48("11204") ? {} : (stryCov_9fa48("11204"), {
                  status: 401
                }));
              }
            }

            // Obtener usuario completo con estudiante
            // OPTIMIZACIÓN: Usar select en lugar de include para cargar solo datos necesarios
            const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("11205") ? {} : (stryCov_9fa48("11205"), {
              where: stryMutAct_9fa48("11206") ? {} : (stryCov_9fa48("11206"), {
                id: user.id
              }),
              select: stryMutAct_9fa48("11207") ? {} : (stryCov_9fa48("11207"), {
                id: stryMutAct_9fa48("11208") ? false : (stryCov_9fa48("11208"), true),
                name: stryMutAct_9fa48("11209") ? false : (stryCov_9fa48("11209"), true),
                email: stryMutAct_9fa48("11210") ? false : (stryCov_9fa48("11210"), true),
                emailVerified: stryMutAct_9fa48("11211") ? false : (stryCov_9fa48("11211"), true),
                image: stryMutAct_9fa48("11212") ? false : (stryCov_9fa48("11212"), true),
                createdAt: stryMutAct_9fa48("11213") ? false : (stryCov_9fa48("11213"), true),
                student: stryMutAct_9fa48("11214") ? {} : (stryCov_9fa48("11214"), {
                  select: stryMutAct_9fa48("11215") ? {} : (stryCov_9fa48("11215"), {
                    id: stryMutAct_9fa48("11216") ? false : (stryCov_9fa48("11216"), true),
                    nombre: stryMutAct_9fa48("11217") ? false : (stryCov_9fa48("11217"), true)
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("11220") ? false : stryMutAct_9fa48("11219") ? true : stryMutAct_9fa48("11218") ? fullUser : (stryCov_9fa48("11218", "11219", "11220"), !fullUser)) {
              if (stryMutAct_9fa48("11221")) {
                {}
              } else {
                stryCov_9fa48("11221");
                return NextResponse.json(stryMutAct_9fa48("11222") ? {} : (stryCov_9fa48("11222"), {
                  error: stryMutAct_9fa48("11223") ? "" : (stryCov_9fa48("11223"), 'Usuario no encontrado')
                }), stryMutAct_9fa48("11224") ? {} : (stryCov_9fa48("11224"), {
                  status: 404
                }));
              }
            }
            return NextResponse.json(fullUser);
          }
        } catch (error) {
          if (stryMutAct_9fa48("11225")) {
            {}
          } else {
            stryCov_9fa48("11225");
            return handleApiError(error, stryMutAct_9fa48("11226") ? "" : (stryCov_9fa48("11226"), 'Error al obtener información del usuario'), stryMutAct_9fa48("11227") ? {} : (stryCov_9fa48("11227"), {
              path: stryMutAct_9fa48("11228") ? "" : (stryCov_9fa48("11228"), '/api/user')
            }));
          }
        }
      }
    });
  }
}
export async function PUT(request: NextRequest) {
  if (stryMutAct_9fa48("11229")) {
    {}
  } else {
    stryCov_9fa48("11229");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("11230")) {
        {}
      } else {
        stryCov_9fa48("11230");
        try {
          if (stryMutAct_9fa48("11231")) {
            {}
          } else {
            stryCov_9fa48("11231");
            logApiRequest(stryMutAct_9fa48("11232") ? "" : (stryCov_9fa48("11232"), 'PUT'), stryMutAct_9fa48("11233") ? "" : (stryCov_9fa48("11233"), '/api/user'));
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("11236") ? false : stryMutAct_9fa48("11235") ? true : stryMutAct_9fa48("11234") ? user : (stryCov_9fa48("11234", "11235", "11236"), !user)) {
              if (stryMutAct_9fa48("11237")) {
                {}
              } else {
                stryCov_9fa48("11237");
                return NextResponse.json(stryMutAct_9fa48("11238") ? {} : (stryCov_9fa48("11238"), {
                  error: stryMutAct_9fa48("11239") ? "" : (stryCov_9fa48("11239"), 'No autorizado')
                }), stryMutAct_9fa48("11240") ? {} : (stryCov_9fa48("11240"), {
                  status: 401
                }));
              }
            }

            // Validar body
            const validation = await validateBody(request, updateUserSchema);
            if (stryMutAct_9fa48("11243") ? false : stryMutAct_9fa48("11242") ? true : stryMutAct_9fa48("11241") ? validation.success : (stryCov_9fa48("11241", "11242", "11243"), !validation.success)) {
              if (stryMutAct_9fa48("11244")) {
                {}
              } else {
                stryCov_9fa48("11244");
                return validation.error;
              }
            }
            const {
              name,
              email
            } = validation.data;

            // Verificar si el email ya está en uso por otro usuario
            if (stryMutAct_9fa48("11247") ? email || email !== user.email : stryMutAct_9fa48("11246") ? false : stryMutAct_9fa48("11245") ? true : (stryCov_9fa48("11245", "11246", "11247"), email && (stryMutAct_9fa48("11249") ? email === user.email : stryMutAct_9fa48("11248") ? true : (stryCov_9fa48("11248", "11249"), email !== user.email)))) {
              if (stryMutAct_9fa48("11250")) {
                {}
              } else {
                stryCov_9fa48("11250");
                const existingUser = await prisma.user.findUnique(stryMutAct_9fa48("11251") ? {} : (stryCov_9fa48("11251"), {
                  where: stryMutAct_9fa48("11252") ? {} : (stryCov_9fa48("11252"), {
                    email
                  })
                }));
                if (stryMutAct_9fa48("11255") ? existingUser || existingUser.id !== user.id : stryMutAct_9fa48("11254") ? false : stryMutAct_9fa48("11253") ? true : (stryCov_9fa48("11253", "11254", "11255"), existingUser && (stryMutAct_9fa48("11257") ? existingUser.id === user.id : stryMutAct_9fa48("11256") ? true : (stryCov_9fa48("11256", "11257"), existingUser.id !== user.id)))) {
                  if (stryMutAct_9fa48("11258")) {
                    {}
                  } else {
                    stryCov_9fa48("11258");
                    return NextResponse.json(stryMutAct_9fa48("11259") ? {} : (stryCov_9fa48("11259"), {
                      error: stryMutAct_9fa48("11260") ? "" : (stryCov_9fa48("11260"), 'Este email ya está en uso por otro usuario')
                    }), stryMutAct_9fa48("11261") ? {} : (stryCov_9fa48("11261"), {
                      status: 400
                    }));
                  }
                }
              }
            }

            // Usar transacción para garantizar consistencia entre usuario y estudiante
            const updatedUser = await prisma.$transaction(async tx => {
              if (stryMutAct_9fa48("11262")) {
                {}
              } else {
                stryCov_9fa48("11262");
                // Actualizar usuario
                const userResult = await tx.user.update(stryMutAct_9fa48("11263") ? {} : (stryCov_9fa48("11263"), {
                  where: stryMutAct_9fa48("11264") ? {} : (stryCov_9fa48("11264"), {
                    id: user.id
                  }),
                  data: stryMutAct_9fa48("11265") ? {} : (stryCov_9fa48("11265"), {
                    ...(stryMutAct_9fa48("11268") ? name !== undefined || {
                      name
                    } : stryMutAct_9fa48("11267") ? false : stryMutAct_9fa48("11266") ? true : (stryCov_9fa48("11266", "11267", "11268"), (stryMutAct_9fa48("11270") ? name === undefined : stryMutAct_9fa48("11269") ? true : (stryCov_9fa48("11269", "11270"), name !== undefined)) && (stryMutAct_9fa48("11271") ? {} : (stryCov_9fa48("11271"), {
                      name
                    })))),
                    ...(stryMutAct_9fa48("11274") ? email !== undefined || {
                      email,
                      emailVerified: null
                    } : stryMutAct_9fa48("11273") ? false : stryMutAct_9fa48("11272") ? true : (stryCov_9fa48("11272", "11273", "11274"), (stryMutAct_9fa48("11276") ? email === undefined : stryMutAct_9fa48("11275") ? true : (stryCov_9fa48("11275", "11276"), email !== undefined)) && (stryMutAct_9fa48("11277") ? {} : (stryCov_9fa48("11277"), {
                      email,
                      emailVerified: null
                    })))) // Reset email verification si cambia
                  }),
                  select: stryMutAct_9fa48("11278") ? {} : (stryCov_9fa48("11278"), {
                    id: stryMutAct_9fa48("11279") ? false : (stryCov_9fa48("11279"), true),
                    name: stryMutAct_9fa48("11280") ? false : (stryCov_9fa48("11280"), true),
                    email: stryMutAct_9fa48("11281") ? false : (stryCov_9fa48("11281"), true),
                    emailVerified: stryMutAct_9fa48("11282") ? false : (stryCov_9fa48("11282"), true),
                    image: stryMutAct_9fa48("11283") ? false : (stryCov_9fa48("11283"), true),
                    createdAt: stryMutAct_9fa48("11284") ? false : (stryCov_9fa48("11284"), true)
                  })
                }));

                // Si hay un estudiante asociado y se actualizó el nombre, actualizar también el estudiante
                if (stryMutAct_9fa48("11287") ? name === undefined : stryMutAct_9fa48("11286") ? false : stryMutAct_9fa48("11285") ? true : (stryCov_9fa48("11285", "11286", "11287"), name !== undefined)) {
                  if (stryMutAct_9fa48("11288")) {
                    {}
                  } else {
                    stryCov_9fa48("11288");
                    const student = await tx.student.findUnique(stryMutAct_9fa48("11289") ? {} : (stryCov_9fa48("11289"), {
                      where: stryMutAct_9fa48("11290") ? {} : (stryCov_9fa48("11290"), {
                        userId: user.id
                      })
                    }));
                    if (stryMutAct_9fa48("11292") ? false : stryMutAct_9fa48("11291") ? true : (stryCov_9fa48("11291", "11292"), student)) {
                      if (stryMutAct_9fa48("11293")) {
                        {}
                      } else {
                        stryCov_9fa48("11293");
                        await tx.student.update(stryMutAct_9fa48("11294") ? {} : (stryCov_9fa48("11294"), {
                          where: stryMutAct_9fa48("11295") ? {} : (stryCov_9fa48("11295"), {
                            id: student.id
                          }),
                          data: stryMutAct_9fa48("11296") ? {} : (stryCov_9fa48("11296"), {
                            nombre: name
                          })
                        }));
                      }
                    }
                  }
                }
                return userResult;
              }
            });

            // Invalidar cachés después de la transacción (fuera de la transacción para mejor performance)
            if (stryMutAct_9fa48("11299") ? name === undefined : stryMutAct_9fa48("11298") ? false : stryMutAct_9fa48("11297") ? true : (stryCov_9fa48("11297", "11298", "11299"), name !== undefined)) {
              if (stryMutAct_9fa48("11300")) {
                {}
              } else {
                stryCov_9fa48("11300");
                const student = await prisma.student.findUnique(stryMutAct_9fa48("11301") ? {} : (stryCov_9fa48("11301"), {
                  where: stryMutAct_9fa48("11302") ? {} : (stryCov_9fa48("11302"), {
                    userId: user.id
                  }),
                  select: stryMutAct_9fa48("11303") ? {} : (stryCov_9fa48("11303"), {
                    id: stryMutAct_9fa48("11304") ? false : (stryCov_9fa48("11304"), true)
                  })
                }));
                if (stryMutAct_9fa48("11306") ? false : stryMutAct_9fa48("11305") ? true : (stryCov_9fa48("11305", "11306"), student)) {
                  if (stryMutAct_9fa48("11307")) {
                    {}
                  } else {
                    stryCov_9fa48("11307");
                    await invalidateCachePattern(stryMutAct_9fa48("11308") ? `` : (stryCov_9fa48("11308"), `student:${student.id}:*`));
                  }
                }
              }
            }
            await invalidateCachePattern(stryMutAct_9fa48("11309") ? `` : (stryCov_9fa48("11309"), `user:${user.id}:*`));
            return NextResponse.json(updatedUser);
          }
        } catch (error) {
          if (stryMutAct_9fa48("11310")) {
            {}
          } else {
            stryCov_9fa48("11310");
            return handleApiError(error, stryMutAct_9fa48("11311") ? "" : (stryCov_9fa48("11311"), 'Error al actualizar información del usuario'), stryMutAct_9fa48("11312") ? {} : (stryCov_9fa48("11312"), {
              path: stryMutAct_9fa48("11313") ? "" : (stryCov_9fa48("11313"), '/api/user')
            }));
          }
        }
      }
    });
  }
}