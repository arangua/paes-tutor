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
import { encrypt, decrypt, maskApiKey } from '@/lib/encryption';
import { z } from 'zod';
import { validateBody } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';
import type { Prisma } from '@prisma/client';
export const runtime = stryMutAct_9fa48("10978") ? "" : (stryCov_9fa48("10978"), 'nodejs');
const updateAIKeysSchema = z.object(stryMutAct_9fa48("10979") ? {} : (stryCov_9fa48("10979"), {
  openaiApiKey: z.string().optional().nullable(),
  anthropicApiKey: z.string().optional().nullable(),
  geminiApiKey: z.string().optional().nullable(),
  preferredAIService: z.enum(stryMutAct_9fa48("10980") ? [] : (stryCov_9fa48("10980"), [stryMutAct_9fa48("10981") ? "" : (stryCov_9fa48("10981"), 'openai'), stryMutAct_9fa48("10982") ? "" : (stryCov_9fa48("10982"), 'anthropic'), stryMutAct_9fa48("10983") ? "" : (stryCov_9fa48("10983"), 'gemini')])).optional().nullable()
  // Si se envía una cadena vacía, se elimina la key
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("10984")) {
    {}
  } else {
    stryCov_9fa48("10984");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("10985")) {
        {}
      } else {
        stryCov_9fa48("10985");
        try {
          if (stryMutAct_9fa48("10986")) {
            {}
          } else {
            stryCov_9fa48("10986");
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("10989") ? false : stryMutAct_9fa48("10988") ? true : stryMutAct_9fa48("10987") ? user : (stryCov_9fa48("10987", "10988", "10989"), !user)) {
              if (stryMutAct_9fa48("10990")) {
                {}
              } else {
                stryCov_9fa48("10990");
                return NextResponse.json(stryMutAct_9fa48("10991") ? {} : (stryCov_9fa48("10991"), {
                  error: stryMutAct_9fa48("10992") ? "" : (stryCov_9fa48("10992"), 'No autorizado')
                }), stryMutAct_9fa48("10993") ? {} : (stryCov_9fa48("10993"), {
                  status: 401
                }));
              }
            }
            const fullUser = await prisma.user.findUnique(stryMutAct_9fa48("10994") ? {} : (stryCov_9fa48("10994"), {
              where: stryMutAct_9fa48("10995") ? {} : (stryCov_9fa48("10995"), {
                id: user.id
              }),
              select: stryMutAct_9fa48("10996") ? {} : (stryCov_9fa48("10996"), {
                openaiApiKey: stryMutAct_9fa48("10997") ? false : (stryCov_9fa48("10997"), true),
                anthropicApiKey: stryMutAct_9fa48("10998") ? false : (stryCov_9fa48("10998"), true),
                geminiApiKey: stryMutAct_9fa48("10999") ? false : (stryCov_9fa48("10999"), true),
                preferredAIService: stryMutAct_9fa48("11000") ? false : (stryCov_9fa48("11000"), true)
              })
            }));
            if (stryMutAct_9fa48("11003") ? false : stryMutAct_9fa48("11002") ? true : stryMutAct_9fa48("11001") ? fullUser : (stryCov_9fa48("11001", "11002", "11003"), !fullUser)) {
              if (stryMutAct_9fa48("11004")) {
                {}
              } else {
                stryCov_9fa48("11004");
                return NextResponse.json(stryMutAct_9fa48("11005") ? {} : (stryCov_9fa48("11005"), {
                  error: stryMutAct_9fa48("11006") ? "" : (stryCov_9fa48("11006"), 'Usuario no encontrado')
                }), stryMutAct_9fa48("11007") ? {} : (stryCov_9fa48("11007"), {
                  status: 404
                }));
              }
            }

            // Retornar keys enmascaradas (solo últimos 4 caracteres)
            return NextResponse.json(stryMutAct_9fa48("11008") ? {} : (stryCov_9fa48("11008"), {
              openaiApiKey: maskApiKey(fullUser.openaiApiKey),
              anthropicApiKey: maskApiKey(fullUser.anthropicApiKey),
              geminiApiKey: maskApiKey(fullUser.geminiApiKey),
              preferredAIService: fullUser.preferredAIService,
              hasOpenAI: stryMutAct_9fa48("11009") ? !fullUser.openaiApiKey : (stryCov_9fa48("11009"), !(stryMutAct_9fa48("11010") ? fullUser.openaiApiKey : (stryCov_9fa48("11010"), !fullUser.openaiApiKey))),
              hasAnthropic: stryMutAct_9fa48("11011") ? !fullUser.anthropicApiKey : (stryCov_9fa48("11011"), !(stryMutAct_9fa48("11012") ? fullUser.anthropicApiKey : (stryCov_9fa48("11012"), !fullUser.anthropicApiKey))),
              hasGemini: stryMutAct_9fa48("11013") ? !fullUser.geminiApiKey : (stryCov_9fa48("11013"), !(stryMutAct_9fa48("11014") ? fullUser.geminiApiKey : (stryCov_9fa48("11014"), !fullUser.geminiApiKey)))
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("11015")) {
            {}
          } else {
            stryCov_9fa48("11015");
            logger.error(stryMutAct_9fa48("11016") ? {} : (stryCov_9fa48("11016"), {
              error: error instanceof Error ? error.message : String(error),
              userId: stryMutAct_9fa48("11017") ? user.id : (stryCov_9fa48("11017"), user?.id)
            }), stryMutAct_9fa48("11018") ? "" : (stryCov_9fa48("11018"), 'Error al obtener API keys'));
            return NextResponse.json(stryMutAct_9fa48("11019") ? {} : (stryCov_9fa48("11019"), {
              error: stryMutAct_9fa48("11020") ? "" : (stryCov_9fa48("11020"), 'Error al obtener configuración de IA')
            }), stryMutAct_9fa48("11021") ? {} : (stryCov_9fa48("11021"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("11022")) {
    {}
  } else {
    stryCov_9fa48("11022");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("11023")) {
        {}
      } else {
        stryCov_9fa48("11023");
        try {
          if (stryMutAct_9fa48("11024")) {
            {}
          } else {
            stryCov_9fa48("11024");
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("11027") ? false : stryMutAct_9fa48("11026") ? true : stryMutAct_9fa48("11025") ? user : (stryCov_9fa48("11025", "11026", "11027"), !user)) {
              if (stryMutAct_9fa48("11028")) {
                {}
              } else {
                stryCov_9fa48("11028");
                return NextResponse.json(stryMutAct_9fa48("11029") ? {} : (stryCov_9fa48("11029"), {
                  error: stryMutAct_9fa48("11030") ? "" : (stryCov_9fa48("11030"), 'No autorizado')
                }), stryMutAct_9fa48("11031") ? {} : (stryCov_9fa48("11031"), {
                  status: 401
                }));
              }
            }
            const validation = await validateBody(request, updateAIKeysSchema);
            if (stryMutAct_9fa48("11034") ? false : stryMutAct_9fa48("11033") ? true : stryMutAct_9fa48("11032") ? validation.success : (stryCov_9fa48("11032", "11033", "11034"), !validation.success)) {
              if (stryMutAct_9fa48("11035")) {
                {}
              } else {
                stryCov_9fa48("11035");
                return validation.error;
              }
            }
            const {
              openaiApiKey,
              anthropicApiKey,
              geminiApiKey,
              preferredAIService
            } = validation.data;

            // Preparar datos de actualización
            const updateData: Prisma.UserUpdateInput = {};

            // Solo actualizar si se proporciona un valor
            if (stryMutAct_9fa48("11038") ? openaiApiKey === undefined : stryMutAct_9fa48("11037") ? false : stryMutAct_9fa48("11036") ? true : (stryCov_9fa48("11036", "11037", "11038"), openaiApiKey !== undefined)) {
              if (stryMutAct_9fa48("11039")) {
                {}
              } else {
                stryCov_9fa48("11039");
                updateData.openaiApiKey = (stryMutAct_9fa48("11042") ? openaiApiKey || openaiApiKey.trim() : stryMutAct_9fa48("11041") ? false : stryMutAct_9fa48("11040") ? true : (stryCov_9fa48("11040", "11041", "11042"), openaiApiKey && (stryMutAct_9fa48("11043") ? openaiApiKey : (stryCov_9fa48("11043"), openaiApiKey.trim())))) ? encrypt(stryMutAct_9fa48("11044") ? openaiApiKey : (stryCov_9fa48("11044"), openaiApiKey.trim())) : null;
              }
            }
            if (stryMutAct_9fa48("11047") ? anthropicApiKey === undefined : stryMutAct_9fa48("11046") ? false : stryMutAct_9fa48("11045") ? true : (stryCov_9fa48("11045", "11046", "11047"), anthropicApiKey !== undefined)) {
              if (stryMutAct_9fa48("11048")) {
                {}
              } else {
                stryCov_9fa48("11048");
                updateData.anthropicApiKey = (stryMutAct_9fa48("11051") ? anthropicApiKey || anthropicApiKey.trim() : stryMutAct_9fa48("11050") ? false : stryMutAct_9fa48("11049") ? true : (stryCov_9fa48("11049", "11050", "11051"), anthropicApiKey && (stryMutAct_9fa48("11052") ? anthropicApiKey : (stryCov_9fa48("11052"), anthropicApiKey.trim())))) ? encrypt(stryMutAct_9fa48("11053") ? anthropicApiKey : (stryCov_9fa48("11053"), anthropicApiKey.trim())) : null;
              }
            }
            if (stryMutAct_9fa48("11056") ? geminiApiKey === undefined : stryMutAct_9fa48("11055") ? false : stryMutAct_9fa48("11054") ? true : (stryCov_9fa48("11054", "11055", "11056"), geminiApiKey !== undefined)) {
              if (stryMutAct_9fa48("11057")) {
                {}
              } else {
                stryCov_9fa48("11057");
                updateData.geminiApiKey = (stryMutAct_9fa48("11060") ? geminiApiKey || geminiApiKey.trim() : stryMutAct_9fa48("11059") ? false : stryMutAct_9fa48("11058") ? true : (stryCov_9fa48("11058", "11059", "11060"), geminiApiKey && (stryMutAct_9fa48("11061") ? geminiApiKey : (stryCov_9fa48("11061"), geminiApiKey.trim())))) ? encrypt(stryMutAct_9fa48("11062") ? geminiApiKey : (stryCov_9fa48("11062"), geminiApiKey.trim())) : null;
              }
            }
            if (stryMutAct_9fa48("11065") ? preferredAIService === undefined : stryMutAct_9fa48("11064") ? false : stryMutAct_9fa48("11063") ? true : (stryCov_9fa48("11063", "11064", "11065"), preferredAIService !== undefined)) {
              if (stryMutAct_9fa48("11066")) {
                {}
              } else {
                stryCov_9fa48("11066");
                updateData.preferredAIService = preferredAIService;
              }
            }

            // Actualizar usuario
            await prisma.user.update(stryMutAct_9fa48("11067") ? {} : (stryCov_9fa48("11067"), {
              where: stryMutAct_9fa48("11068") ? {} : (stryCov_9fa48("11068"), {
                id: user.id
              }),
              data: updateData
            }));
            return NextResponse.json(stryMutAct_9fa48("11069") ? {} : (stryCov_9fa48("11069"), {
              message: stryMutAct_9fa48("11070") ? "" : (stryCov_9fa48("11070"), 'API keys actualizadas correctamente'),
              // Retornar keys enmascaradas
              openaiApiKey: (stryMutAct_9fa48("11073") ? updateData.openaiApiKey === undefined : stryMutAct_9fa48("11072") ? false : stryMutAct_9fa48("11071") ? true : (stryCov_9fa48("11071", "11072", "11073"), updateData.openaiApiKey !== undefined)) ? maskApiKey(updateData.openaiApiKey) : undefined,
              anthropicApiKey: (stryMutAct_9fa48("11076") ? updateData.anthropicApiKey === undefined : stryMutAct_9fa48("11075") ? false : stryMutAct_9fa48("11074") ? true : (stryCov_9fa48("11074", "11075", "11076"), updateData.anthropicApiKey !== undefined)) ? maskApiKey(updateData.anthropicApiKey) : undefined,
              geminiApiKey: (stryMutAct_9fa48("11079") ? updateData.geminiApiKey === undefined : stryMutAct_9fa48("11078") ? false : stryMutAct_9fa48("11077") ? true : (stryCov_9fa48("11077", "11078", "11079"), updateData.geminiApiKey !== undefined)) ? maskApiKey(updateData.geminiApiKey) : undefined,
              preferredAIService: updateData.preferredAIService
            }));
            logger.info(stryMutAct_9fa48("11080") ? {} : (stryCov_9fa48("11080"), {
              userId: user.id,
              hasOpenAI: stryMutAct_9fa48("11081") ? !updateData.openaiApiKey : (stryCov_9fa48("11081"), !(stryMutAct_9fa48("11082") ? updateData.openaiApiKey : (stryCov_9fa48("11082"), !updateData.openaiApiKey))),
              hasAnthropic: stryMutAct_9fa48("11083") ? !updateData.anthropicApiKey : (stryCov_9fa48("11083"), !(stryMutAct_9fa48("11084") ? updateData.anthropicApiKey : (stryCov_9fa48("11084"), !updateData.anthropicApiKey))),
              hasGemini: stryMutAct_9fa48("11085") ? !updateData.geminiApiKey : (stryCov_9fa48("11085"), !(stryMutAct_9fa48("11086") ? updateData.geminiApiKey : (stryCov_9fa48("11086"), !updateData.geminiApiKey))),
              preferredService: updateData.preferredAIService
            }), stryMutAct_9fa48("11087") ? "" : (stryCov_9fa48("11087"), 'API keys actualizadas correctamente'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("11088")) {
            {}
          } else {
            stryCov_9fa48("11088");
            logger.error(stryMutAct_9fa48("11089") ? {} : (stryCov_9fa48("11089"), {
              error: error instanceof Error ? error.message : String(error),
              userId: stryMutAct_9fa48("11090") ? user.id : (stryCov_9fa48("11090"), user?.id)
            }), stryMutAct_9fa48("11091") ? "" : (stryCov_9fa48("11091"), 'Error al actualizar API keys'));
            return NextResponse.json(stryMutAct_9fa48("11092") ? {} : (stryCov_9fa48("11092"), {
              error: stryMutAct_9fa48("11093") ? "" : (stryCov_9fa48("11093"), 'Error al actualizar configuración de IA')
            }), stryMutAct_9fa48("11094") ? {} : (stryCov_9fa48("11094"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}