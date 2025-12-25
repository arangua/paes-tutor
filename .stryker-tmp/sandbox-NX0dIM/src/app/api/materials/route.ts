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
import { validateQuery, handleApiError } from '@/lib/api-helpers';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { logApiRequest } from '@/lib/logger';
import { getCached, cacheKeys } from '@/lib/cache';
import { z } from 'zod';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("8570") ? "" : (stryCov_9fa48("8570"), 'nodejs');
import { materialsQuerySchema } from '@/lib/validations';
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("8571")) {
    {}
  } else {
    stryCov_9fa48("8571");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8572")) {
        {}
      } else {
        stryCov_9fa48("8572");
        try {
          if (stryMutAct_9fa48("8573")) {
            {}
          } else {
            stryCov_9fa48("8573");
            logApiRequest(stryMutAct_9fa48("8574") ? "" : (stryCov_9fa48("8574"), 'GET'), stryMutAct_9fa48("8575") ? "" : (stryCov_9fa48("8575"), '/api/materials'));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("8578") ? false : stryMutAct_9fa48("8577") ? true : stryMutAct_9fa48("8576") ? studentId : (stryCov_9fa48("8576", "8577", "8578"), !studentId)) {
              if (stryMutAct_9fa48("8579")) {
                {}
              } else {
                stryCov_9fa48("8579");
                return NextResponse.json(stryMutAct_9fa48("8580") ? {} : (stryCov_9fa48("8580"), {
                  error: stryMutAct_9fa48("8581") ? "" : (stryCov_9fa48("8581"), 'No autorizado')
                }), stryMutAct_9fa48("8582") ? {} : (stryCov_9fa48("8582"), {
                  status: 401
                }));
              }
            }

            // Validar query parameters
            const validation = validateQuery(request, materialsQuerySchema);
            if (stryMutAct_9fa48("8585") ? false : stryMutAct_9fa48("8584") ? true : stryMutAct_9fa48("8583") ? validation.success : (stryCov_9fa48("8583", "8584", "8585"), !validation.success)) {
              if (stryMutAct_9fa48("8586")) {
                {}
              } else {
                stryCov_9fa48("8586");
                return validation.error;
              }
            }
            const {
              subjectId,
              topicId,
              tipo,
              limit,
              offset
            } = validation.data;

            // Construir where clause una sola vez para evitar duplicación
            const whereClause = stryMutAct_9fa48("8587") ? {} : (stryCov_9fa48("8587"), {
              ...(stryMutAct_9fa48("8590") ? subjectId || {
                subjectId
              } : stryMutAct_9fa48("8589") ? false : stryMutAct_9fa48("8588") ? true : (stryCov_9fa48("8588", "8589", "8590"), subjectId && (stryMutAct_9fa48("8591") ? {} : (stryCov_9fa48("8591"), {
                subjectId
              })))),
              ...(stryMutAct_9fa48("8594") ? topicId || {
                topicId
              } : stryMutAct_9fa48("8593") ? false : stryMutAct_9fa48("8592") ? true : (stryCov_9fa48("8592", "8593", "8594"), topicId && (stryMutAct_9fa48("8595") ? {} : (stryCov_9fa48("8595"), {
                topicId
              })))),
              ...(stryMutAct_9fa48("8598") ? tipo || {
                tipo
              } : stryMutAct_9fa48("8597") ? false : stryMutAct_9fa48("8596") ? true : (stryCov_9fa48("8596", "8597", "8598"), tipo && (stryMutAct_9fa48("8599") ? {} : (stryCov_9fa48("8599"), {
                tipo
              }))))
            });

            // Constantes para tiempos de caché
            const MATERIALS_CACHE_TTL_MS = stryMutAct_9fa48("8600") ? 10 * 60 / 1000 : (stryCov_9fa48("8600"), (stryMutAct_9fa48("8601") ? 10 / 60 : (stryCov_9fa48("8601"), 10 * 60)) * 1000); // 10 minutos

            // Usar caché para queries frecuentes
            const cacheKey = cacheKeys.materials(subjectId, topicId, tipo, limit, offset);
            const materials = await getCached(cacheKey, async () => {
              if (stryMutAct_9fa48("8602")) {
                {}
              } else {
                stryCov_9fa48("8602");
                // Búsqueda mejorada basada en malla curricular chilena
                // Prioriza materiales por relevancia: tema específico > asignatura > eje temático
                const materials = await prisma.studyMaterial.findMany(stryMutAct_9fa48("8603") ? {} : (stryCov_9fa48("8603"), {
                  where: whereClause,
                  select: stryMutAct_9fa48("8604") ? {} : (stryCov_9fa48("8604"), {
                    id: stryMutAct_9fa48("8605") ? false : (stryCov_9fa48("8605"), true),
                    titulo: stryMutAct_9fa48("8606") ? false : (stryCov_9fa48("8606"), true),
                    contenido: stryMutAct_9fa48("8607") ? false : (stryCov_9fa48("8607"), true),
                    fuente: stryMutAct_9fa48("8608") ? false : (stryCov_9fa48("8608"), true),
                    tipo: stryMutAct_9fa48("8609") ? false : (stryCov_9fa48("8609"), true),
                    createdAt: stryMutAct_9fa48("8610") ? false : (stryCov_9fa48("8610"), true),
                    subject: stryMutAct_9fa48("8611") ? {} : (stryCov_9fa48("8611"), {
                      select: stryMutAct_9fa48("8612") ? {} : (stryCov_9fa48("8612"), {
                        id: stryMutAct_9fa48("8613") ? false : (stryCov_9fa48("8613"), true),
                        nombre: stryMutAct_9fa48("8614") ? false : (stryCov_9fa48("8614"), true),
                        codigo: stryMutAct_9fa48("8615") ? false : (stryCov_9fa48("8615"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("8616") ? {} : (stryCov_9fa48("8616"), {
                      select: stryMutAct_9fa48("8617") ? {} : (stryCov_9fa48("8617"), {
                        id: stryMutAct_9fa48("8618") ? false : (stryCov_9fa48("8618"), true),
                        nombre: stryMutAct_9fa48("8619") ? false : (stryCov_9fa48("8619"), true),
                        ejeTematico: stryMutAct_9fa48("8620") ? false : (stryCov_9fa48("8620"), true)
                      })
                    })
                  }),
                  skip: offset,
                  take: limit,
                  orderBy: stryMutAct_9fa48("8621") ? [] : (stryCov_9fa48("8621"), [// Priorizar materiales con tema específico
                  // Nota: Prisma ordena nulls al final por defecto en orden descendente
                  stryMutAct_9fa48("8622") ? {} : (stryCov_9fa48("8622"), {
                    topicId: stryMutAct_9fa48("8623") ? "" : (stryCov_9fa48("8623"), 'desc')
                  }), // Luego por fecha (más recientes primero)
                  stryMutAct_9fa48("8624") ? {} : (stryCov_9fa48("8624"), {
                    createdAt: stryMutAct_9fa48("8625") ? "" : (stryCov_9fa48("8625"), 'desc')
                  })])
                }));

                // Ordenar por relevancia según malla curricular
                // Materiales con tema específico primero, luego por asignatura
                return stryMutAct_9fa48("8626") ? materials : (stryCov_9fa48("8626"), materials.sort((a, b) => {
                  if (stryMutAct_9fa48("8627")) {
                    {}
                  } else {
                    stryCov_9fa48("8627");
                    // Si ambos tienen tema, ordenar por fecha (más recientes primero)
                    if (stryMutAct_9fa48("8630") ? a.topic || b.topic : stryMutAct_9fa48("8629") ? false : stryMutAct_9fa48("8628") ? true : (stryCov_9fa48("8628", "8629", "8630"), a.topic && b.topic)) {
                      if (stryMutAct_9fa48("8631")) {
                        {}
                      } else {
                        stryCov_9fa48("8631");
                        return stryMutAct_9fa48("8632") ? new Date(b.createdAt).getTime() + new Date(a.createdAt).getTime() : (stryCov_9fa48("8632"), new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                      }
                    }
                    // Materiales con tema primero
                    if (stryMutAct_9fa48("8635") ? a.topic || !b.topic : stryMutAct_9fa48("8634") ? false : stryMutAct_9fa48("8633") ? true : (stryCov_9fa48("8633", "8634", "8635"), a.topic && (stryMutAct_9fa48("8636") ? b.topic : (stryCov_9fa48("8636"), !b.topic)))) return stryMutAct_9fa48("8637") ? +1 : (stryCov_9fa48("8637"), -1);
                    if (stryMutAct_9fa48("8640") ? !a.topic || b.topic : stryMutAct_9fa48("8639") ? false : stryMutAct_9fa48("8638") ? true : (stryCov_9fa48("8638", "8639", "8640"), (stryMutAct_9fa48("8641") ? a.topic : (stryCov_9fa48("8641"), !a.topic)) && b.topic)) return 1;
                    // Si ninguno tiene tema, ordenar por fecha
                    return stryMutAct_9fa48("8642") ? new Date(b.createdAt).getTime() + new Date(a.createdAt).getTime() : (stryCov_9fa48("8642"), new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                  }
                }));
              }
            }, MATERIALS_CACHE_TTL_MS);

            // Obtener total para paginación
            const total = await getCached(stryMutAct_9fa48("8643") ? `` : (stryCov_9fa48("8643"), `${cacheKey}:total`), async () => {
              if (stryMutAct_9fa48("8644")) {
                {}
              } else {
                stryCov_9fa48("8644");
                return await prisma.studyMaterial.count(stryMutAct_9fa48("8645") ? {} : (stryCov_9fa48("8645"), {
                  where: whereClause
                }));
              }
            }, MATERIALS_CACHE_TTL_MS);
            return NextResponse.json(stryMutAct_9fa48("8646") ? {} : (stryCov_9fa48("8646"), {
              materials,
              pagination: stryMutAct_9fa48("8647") ? {} : (stryCov_9fa48("8647"), {
                total,
                limit,
                offset,
                hasMore: stryMutAct_9fa48("8651") ? offset + limit >= total : stryMutAct_9fa48("8650") ? offset + limit <= total : stryMutAct_9fa48("8649") ? false : stryMutAct_9fa48("8648") ? true : (stryCov_9fa48("8648", "8649", "8650", "8651"), (stryMutAct_9fa48("8652") ? offset - limit : (stryCov_9fa48("8652"), offset + limit)) < total)
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8653")) {
            {}
          } else {
            stryCov_9fa48("8653");
            return handleApiError(error, stryMutAct_9fa48("8654") ? "" : (stryCov_9fa48("8654"), 'Error al obtener materiales'), stryMutAct_9fa48("8655") ? {} : (stryCov_9fa48("8655"), {
              path: stryMutAct_9fa48("8656") ? "" : (stryCov_9fa48("8656"), '/api/materials')
            }));
          }
        }
      }
    });
  }
}