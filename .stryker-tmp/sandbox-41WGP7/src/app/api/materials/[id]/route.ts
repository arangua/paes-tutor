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
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache';

// Especificar Node.js runtime
export const runtime = stryMutAct_9fa48("8657") ? "" : (stryCov_9fa48("8657"), 'nodejs');
export async function GET(request: NextRequest, {
  params
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  if (stryMutAct_9fa48("8658")) {
    {}
  } else {
    stryCov_9fa48("8658");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("8659")) {
        {}
      } else {
        stryCov_9fa48("8659");
        try {
          if (stryMutAct_9fa48("8660")) {
            {}
          } else {
            stryCov_9fa48("8660");
            const {
              id
            } = await params;
            logApiRequest(stryMutAct_9fa48("8661") ? "" : (stryCov_9fa48("8661"), 'GET'), stryMutAct_9fa48("8662") ? `` : (stryCov_9fa48("8662"), `/api/materials/${id}`));
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("8665") ? false : stryMutAct_9fa48("8664") ? true : stryMutAct_9fa48("8663") ? studentId : (stryCov_9fa48("8663", "8664", "8665"), !studentId)) {
              if (stryMutAct_9fa48("8666")) {
                {}
              } else {
                stryCov_9fa48("8666");
                return NextResponse.json(stryMutAct_9fa48("8667") ? {} : (stryCov_9fa48("8667"), {
                  error: stryMutAct_9fa48("8668") ? "" : (stryCov_9fa48("8668"), 'No autorizado')
                }), stryMutAct_9fa48("8669") ? {} : (stryCov_9fa48("8669"), {
                  status: 401
                }));
              }
            }

            // Validar formato del ID
            if (stryMutAct_9fa48("8672") ? !id && !/^c[a-z0-9]{24}$/.test(id) : stryMutAct_9fa48("8671") ? false : stryMutAct_9fa48("8670") ? true : (stryCov_9fa48("8670", "8671", "8672"), (stryMutAct_9fa48("8673") ? id : (stryCov_9fa48("8673"), !id)) || (stryMutAct_9fa48("8674") ? /^c[a-z0-9]{24}$/.test(id) : (stryCov_9fa48("8674"), !(stryMutAct_9fa48("8678") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("8677") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("8676") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("8675") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("8675", "8676", "8677", "8678"), /^c[a-z0-9]{24}$/)).test(id))))) {
              if (stryMutAct_9fa48("8679")) {
                {}
              } else {
                stryCov_9fa48("8679");
                return NextResponse.json(stryMutAct_9fa48("8680") ? {} : (stryCov_9fa48("8680"), {
                  error: stryMutAct_9fa48("8681") ? "" : (stryCov_9fa48("8681"), 'ID inválido')
                }), stryMutAct_9fa48("8682") ? {} : (stryCov_9fa48("8682"), {
                  status: 400
                }));
              }
            }

            // Usar caché
            const material = await getCached(cacheKeys.material(id), async () => {
              if (stryMutAct_9fa48("8683")) {
                {}
              } else {
                stryCov_9fa48("8683");
                return await prisma.studyMaterial.findUnique(stryMutAct_9fa48("8684") ? {} : (stryCov_9fa48("8684"), {
                  where: stryMutAct_9fa48("8685") ? {} : (stryCov_9fa48("8685"), {
                    id
                  }),
                  include: stryMutAct_9fa48("8686") ? {} : (stryCov_9fa48("8686"), {
                    subject: stryMutAct_9fa48("8687") ? {} : (stryCov_9fa48("8687"), {
                      select: stryMutAct_9fa48("8688") ? {} : (stryCov_9fa48("8688"), {
                        id: stryMutAct_9fa48("8689") ? false : (stryCov_9fa48("8689"), true),
                        nombre: stryMutAct_9fa48("8690") ? false : (stryCov_9fa48("8690"), true),
                        codigo: stryMutAct_9fa48("8691") ? false : (stryCov_9fa48("8691"), true)
                      })
                    }),
                    topic: stryMutAct_9fa48("8692") ? {} : (stryCov_9fa48("8692"), {
                      select: stryMutAct_9fa48("8693") ? {} : (stryCov_9fa48("8693"), {
                        id: stryMutAct_9fa48("8694") ? false : (stryCov_9fa48("8694"), true),
                        nombre: stryMutAct_9fa48("8695") ? false : (stryCov_9fa48("8695"), true),
                        ejeTematico: stryMutAct_9fa48("8696") ? false : (stryCov_9fa48("8696"), true),
                        descripcion: stryMutAct_9fa48("8697") ? false : (stryCov_9fa48("8697"), true)
                      })
                    })
                  })
                }));
              }
            }, stryMutAct_9fa48("8698") ? 10 * 60 / 1000 // Cache por 10 minutos
            : (stryCov_9fa48("8698"), (stryMutAct_9fa48("8699") ? 10 / 60 : (stryCov_9fa48("8699"), 10 * 60)) * 1000) // Cache por 10 minutos
            );
            if (stryMutAct_9fa48("8702") ? false : stryMutAct_9fa48("8701") ? true : stryMutAct_9fa48("8700") ? material : (stryCov_9fa48("8700", "8701", "8702"), !material)) {
              if (stryMutAct_9fa48("8703")) {
                {}
              } else {
                stryCov_9fa48("8703");
                return NextResponse.json(stryMutAct_9fa48("8704") ? {} : (stryCov_9fa48("8704"), {
                  error: stryMutAct_9fa48("8705") ? "" : (stryCov_9fa48("8705"), 'Material no encontrado')
                }), stryMutAct_9fa48("8706") ? {} : (stryCov_9fa48("8706"), {
                  status: 404
                }));
              }
            }
            return NextResponse.json(material);
          }
        } catch (error) {
          if (stryMutAct_9fa48("8707")) {
            {}
          } else {
            stryCov_9fa48("8707");
            return handleApiError(error, stryMutAct_9fa48("8708") ? "" : (stryCov_9fa48("8708"), 'Error al obtener material'), stryMutAct_9fa48("8709") ? {} : (stryCov_9fa48("8709"), {
              path: stryMutAct_9fa48("8710") ? `` : (stryCov_9fa48("8710"), `/api/materials/[id]`)
            }));
          }
        }
      }
    });
  }
}