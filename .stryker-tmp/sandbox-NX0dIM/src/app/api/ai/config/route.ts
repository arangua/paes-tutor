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
import { z } from 'zod';
import { validateBody } from '@/lib/api-helpers';
export const runtime = stryMutAct_9fa48("5317") ? "" : (stryCov_9fa48("5317"), 'nodejs');
const configSchema = z.object(stryMutAct_9fa48("5318") ? {} : (stryCov_9fa48("5318"), {
  preferredService: z.enum(stryMutAct_9fa48("5319") ? [] : (stryCov_9fa48("5319"), [stryMutAct_9fa48("5320") ? "" : (stryCov_9fa48("5320"), 'openai'), stryMutAct_9fa48("5321") ? "" : (stryCov_9fa48("5321"), 'anthropic'), stryMutAct_9fa48("5322") ? "" : (stryCov_9fa48("5322"), 'gemini')])).optional()
  // Nota: Las API keys se almacenarían encriptadas en la base de datos
  // Por ahora, usamos variables de entorno por seguridad
}));
export async function GET(request: NextRequest) {
  if (stryMutAct_9fa48("5323")) {
    {}
  } else {
    stryCov_9fa48("5323");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5324")) {
        {}
      } else {
        stryCov_9fa48("5324");
        try {
          if (stryMutAct_9fa48("5325")) {
            {}
          } else {
            stryCov_9fa48("5325");
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("5328") ? false : stryMutAct_9fa48("5327") ? true : stryMutAct_9fa48("5326") ? user : (stryCov_9fa48("5326", "5327", "5328"), !user)) {
              if (stryMutAct_9fa48("5329")) {
                {}
              } else {
                stryCov_9fa48("5329");
                return NextResponse.json(stryMutAct_9fa48("5330") ? {} : (stryCov_9fa48("5330"), {
                  error: stryMutAct_9fa48("5331") ? "" : (stryCov_9fa48("5331"), 'No autorizado')
                }), stryMutAct_9fa48("5332") ? {} : (stryCov_9fa48("5332"), {
                  status: 401
                }));
              }
            }

            // Verificar qué servicios están disponibles
            const availableServices = stryMutAct_9fa48("5333") ? ["Stryker was here"] : (stryCov_9fa48("5333"), []);

            // Verificar configuración del usuario primero
            const {
              prisma
            } = await import(stryMutAct_9fa48("5334") ? "" : (stryCov_9fa48("5334"), '@/lib/prisma'));
            const {
              decrypt
            } = await import(stryMutAct_9fa48("5335") ? "" : (stryCov_9fa48("5335"), '@/lib/encryption'));
            const userConfig = await prisma.user.findUnique(stryMutAct_9fa48("5336") ? {} : (stryCov_9fa48("5336"), {
              where: stryMutAct_9fa48("5337") ? {} : (stryCov_9fa48("5337"), {
                id: user.id
              }),
              select: stryMutAct_9fa48("5338") ? {} : (stryCov_9fa48("5338"), {
                openaiApiKey: stryMutAct_9fa48("5339") ? false : (stryCov_9fa48("5339"), true),
                anthropicApiKey: stryMutAct_9fa48("5340") ? false : (stryCov_9fa48("5340"), true),
                geminiApiKey: stryMutAct_9fa48("5341") ? false : (stryCov_9fa48("5341"), true),
                preferredAIService: stryMutAct_9fa48("5342") ? false : (stryCov_9fa48("5342"), true)
              })
            }));

            // Verificar keys del usuario primero (tienen prioridad)
            const userServices: string[] = stryMutAct_9fa48("5343") ? ["Stryker was here"] : (stryCov_9fa48("5343"), []);
            if (stryMutAct_9fa48("5346") ? userConfig.anthropicApiKey : stryMutAct_9fa48("5345") ? false : stryMutAct_9fa48("5344") ? true : (stryCov_9fa48("5344", "5345", "5346"), userConfig?.anthropicApiKey)) {
              if (stryMutAct_9fa48("5347")) {
                {}
              } else {
                stryCov_9fa48("5347");
                try {
                  if (stryMutAct_9fa48("5348")) {
                    {}
                  } else {
                    stryCov_9fa48("5348");
                    const decrypted = decrypt(userConfig.anthropicApiKey);
                    if (stryMutAct_9fa48("5351") ? decrypted || decrypted.trim().length > 0 : stryMutAct_9fa48("5350") ? false : stryMutAct_9fa48("5349") ? true : (stryCov_9fa48("5349", "5350", "5351"), decrypted && (stryMutAct_9fa48("5354") ? decrypted.trim().length <= 0 : stryMutAct_9fa48("5353") ? decrypted.trim().length >= 0 : stryMutAct_9fa48("5352") ? true : (stryCov_9fa48("5352", "5353", "5354"), (stryMutAct_9fa48("5355") ? decrypted.length : (stryCov_9fa48("5355"), decrypted.trim().length)) > 0)))) {
                      if (stryMutAct_9fa48("5356")) {
                        {}
                      } else {
                        stryCov_9fa48("5356");
                        availableServices.push(stryMutAct_9fa48("5357") ? {} : (stryCov_9fa48("5357"), {
                          service: 'anthropic' as const,
                          name: stryMutAct_9fa48("5358") ? "" : (stryCov_9fa48("5358"), 'Claude (Anthropic)'),
                          configured: stryMutAct_9fa48("5359") ? false : (stryCov_9fa48("5359"), true),
                          source: stryMutAct_9fa48("5360") ? "" : (stryCov_9fa48("5360"), 'user')
                        }));
                        userServices.push(stryMutAct_9fa48("5361") ? "" : (stryCov_9fa48("5361"), 'anthropic'));
                      }
                    }
                  }
                } catch {
                  // Si falla la desencriptación, ignorar (key corrupta o inválida)
                }
              }
            }
            if (stryMutAct_9fa48("5364") ? userConfig.openaiApiKey : stryMutAct_9fa48("5363") ? false : stryMutAct_9fa48("5362") ? true : (stryCov_9fa48("5362", "5363", "5364"), userConfig?.openaiApiKey)) {
              if (stryMutAct_9fa48("5365")) {
                {}
              } else {
                stryCov_9fa48("5365");
                try {
                  if (stryMutAct_9fa48("5366")) {
                    {}
                  } else {
                    stryCov_9fa48("5366");
                    const decrypted = decrypt(userConfig.openaiApiKey);
                    if (stryMutAct_9fa48("5369") ? decrypted || decrypted.trim().length > 0 : stryMutAct_9fa48("5368") ? false : stryMutAct_9fa48("5367") ? true : (stryCov_9fa48("5367", "5368", "5369"), decrypted && (stryMutAct_9fa48("5372") ? decrypted.trim().length <= 0 : stryMutAct_9fa48("5371") ? decrypted.trim().length >= 0 : stryMutAct_9fa48("5370") ? true : (stryCov_9fa48("5370", "5371", "5372"), (stryMutAct_9fa48("5373") ? decrypted.length : (stryCov_9fa48("5373"), decrypted.trim().length)) > 0)))) {
                      if (stryMutAct_9fa48("5374")) {
                        {}
                      } else {
                        stryCov_9fa48("5374");
                        availableServices.push(stryMutAct_9fa48("5375") ? {} : (stryCov_9fa48("5375"), {
                          service: 'openai' as const,
                          name: stryMutAct_9fa48("5376") ? "" : (stryCov_9fa48("5376"), 'ChatGPT (OpenAI)'),
                          configured: stryMutAct_9fa48("5377") ? false : (stryCov_9fa48("5377"), true),
                          source: stryMutAct_9fa48("5378") ? "" : (stryCov_9fa48("5378"), 'user')
                        }));
                        userServices.push(stryMutAct_9fa48("5379") ? "" : (stryCov_9fa48("5379"), 'openai'));
                      }
                    }
                  }
                } catch {
                  // Si falla la desencriptación, ignorar
                }
              }
            }
            if (stryMutAct_9fa48("5382") ? userConfig.geminiApiKey : stryMutAct_9fa48("5381") ? false : stryMutAct_9fa48("5380") ? true : (stryCov_9fa48("5380", "5381", "5382"), userConfig?.geminiApiKey)) {
              if (stryMutAct_9fa48("5383")) {
                {}
              } else {
                stryCov_9fa48("5383");
                try {
                  if (stryMutAct_9fa48("5384")) {
                    {}
                  } else {
                    stryCov_9fa48("5384");
                    const decrypted = decrypt(userConfig.geminiApiKey);
                    if (stryMutAct_9fa48("5387") ? decrypted || decrypted.trim().length > 0 : stryMutAct_9fa48("5386") ? false : stryMutAct_9fa48("5385") ? true : (stryCov_9fa48("5385", "5386", "5387"), decrypted && (stryMutAct_9fa48("5390") ? decrypted.trim().length <= 0 : stryMutAct_9fa48("5389") ? decrypted.trim().length >= 0 : stryMutAct_9fa48("5388") ? true : (stryCov_9fa48("5388", "5389", "5390"), (stryMutAct_9fa48("5391") ? decrypted.length : (stryCov_9fa48("5391"), decrypted.trim().length)) > 0)))) {
                      if (stryMutAct_9fa48("5392")) {
                        {}
                      } else {
                        stryCov_9fa48("5392");
                        availableServices.push(stryMutAct_9fa48("5393") ? {} : (stryCov_9fa48("5393"), {
                          service: 'gemini' as const,
                          name: stryMutAct_9fa48("5394") ? "" : (stryCov_9fa48("5394"), 'Gemini (Google)'),
                          configured: stryMutAct_9fa48("5395") ? false : (stryCov_9fa48("5395"), true),
                          source: stryMutAct_9fa48("5396") ? "" : (stryCov_9fa48("5396"), 'user')
                        }));
                        userServices.push(stryMutAct_9fa48("5397") ? "" : (stryCov_9fa48("5397"), 'gemini'));
                      }
                    }
                  }
                } catch {
                  // Si falla la desencriptación, ignorar
                }
              }
            }

            // Verificar variables de entorno (solo si no hay keys del usuario para ese servicio)
            // Esto permite usar env como fallback si la key del usuario falla
            if (stryMutAct_9fa48("5400") ? !userServices.includes('anthropic') || process.env.ANTHROPIC_API_KEY : stryMutAct_9fa48("5399") ? false : stryMutAct_9fa48("5398") ? true : (stryCov_9fa48("5398", "5399", "5400"), (stryMutAct_9fa48("5401") ? userServices.includes('anthropic') : (stryCov_9fa48("5401"), !userServices.includes(stryMutAct_9fa48("5402") ? "" : (stryCov_9fa48("5402"), 'anthropic')))) && process.env.ANTHROPIC_API_KEY)) {
              if (stryMutAct_9fa48("5403")) {
                {}
              } else {
                stryCov_9fa48("5403");
                availableServices.push(stryMutAct_9fa48("5404") ? {} : (stryCov_9fa48("5404"), {
                  service: 'anthropic' as const,
                  name: stryMutAct_9fa48("5405") ? "" : (stryCov_9fa48("5405"), 'Claude (Anthropic)'),
                  configured: stryMutAct_9fa48("5406") ? false : (stryCov_9fa48("5406"), true),
                  source: stryMutAct_9fa48("5407") ? "" : (stryCov_9fa48("5407"), 'env')
                }));
              }
            }
            if (stryMutAct_9fa48("5410") ? !userServices.includes('openai') || process.env.OPENAI_API_KEY : stryMutAct_9fa48("5409") ? false : stryMutAct_9fa48("5408") ? true : (stryCov_9fa48("5408", "5409", "5410"), (stryMutAct_9fa48("5411") ? userServices.includes('openai') : (stryCov_9fa48("5411"), !userServices.includes(stryMutAct_9fa48("5412") ? "" : (stryCov_9fa48("5412"), 'openai')))) && process.env.OPENAI_API_KEY)) {
              if (stryMutAct_9fa48("5413")) {
                {}
              } else {
                stryCov_9fa48("5413");
                availableServices.push(stryMutAct_9fa48("5414") ? {} : (stryCov_9fa48("5414"), {
                  service: 'openai' as const,
                  name: stryMutAct_9fa48("5415") ? "" : (stryCov_9fa48("5415"), 'ChatGPT (OpenAI)'),
                  configured: stryMutAct_9fa48("5416") ? false : (stryCov_9fa48("5416"), true),
                  source: stryMutAct_9fa48("5417") ? "" : (stryCov_9fa48("5417"), 'env')
                }));
              }
            }
            if (stryMutAct_9fa48("5420") ? !userServices.includes('gemini') || process.env.GEMINI_API_KEY : stryMutAct_9fa48("5419") ? false : stryMutAct_9fa48("5418") ? true : (stryCov_9fa48("5418", "5419", "5420"), (stryMutAct_9fa48("5421") ? userServices.includes('gemini') : (stryCov_9fa48("5421"), !userServices.includes(stryMutAct_9fa48("5422") ? "" : (stryCov_9fa48("5422"), 'gemini')))) && process.env.GEMINI_API_KEY)) {
              if (stryMutAct_9fa48("5423")) {
                {}
              } else {
                stryCov_9fa48("5423");
                availableServices.push(stryMutAct_9fa48("5424") ? {} : (stryCov_9fa48("5424"), {
                  service: 'gemini' as const,
                  name: stryMutAct_9fa48("5425") ? "" : (stryCov_9fa48("5425"), 'Gemini (Google)'),
                  configured: stryMutAct_9fa48("5426") ? false : (stryCov_9fa48("5426"), true),
                  source: stryMutAct_9fa48("5427") ? "" : (stryCov_9fa48("5427"), 'env')
                }));
              }
            }
            return NextResponse.json(stryMutAct_9fa48("5428") ? {} : (stryCov_9fa48("5428"), {
              availableServices,
              defaultService: stryMutAct_9fa48("5431") ? availableServices[0]?.service && null : stryMutAct_9fa48("5430") ? false : stryMutAct_9fa48("5429") ? true : (stryCov_9fa48("5429", "5430", "5431"), (stryMutAct_9fa48("5432") ? availableServices[0].service : (stryCov_9fa48("5432"), availableServices[0]?.service)) || null),
              message: (stryMutAct_9fa48("5435") ? availableServices.length !== 0 : stryMutAct_9fa48("5434") ? false : stryMutAct_9fa48("5433") ? true : (stryCov_9fa48("5433", "5434", "5435"), availableServices.length === 0)) ? stryMutAct_9fa48("5436") ? "" : (stryCov_9fa48("5436"), 'No hay servicios de IA configurados. Configura al menos una API key en las variables de entorno (.env)') : stryMutAct_9fa48("5437") ? `` : (stryCov_9fa48("5437"), `${availableServices.length} servicio(s) disponible(s)`)
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5438")) {
            {}
          } else {
            stryCov_9fa48("5438");
            return NextResponse.json(stryMutAct_9fa48("5439") ? {} : (stryCov_9fa48("5439"), {
              error: stryMutAct_9fa48("5440") ? "" : (stryCov_9fa48("5440"), 'Error al obtener configuración de IA')
            }), stryMutAct_9fa48("5441") ? {} : (stryCov_9fa48("5441"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("5442")) {
    {}
  } else {
    stryCov_9fa48("5442");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5443")) {
        {}
      } else {
        stryCov_9fa48("5443");
        try {
          if (stryMutAct_9fa48("5444")) {
            {}
          } else {
            stryCov_9fa48("5444");
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("5447") ? false : stryMutAct_9fa48("5446") ? true : stryMutAct_9fa48("5445") ? user : (stryCov_9fa48("5445", "5446", "5447"), !user)) {
              if (stryMutAct_9fa48("5448")) {
                {}
              } else {
                stryCov_9fa48("5448");
                return NextResponse.json(stryMutAct_9fa48("5449") ? {} : (stryCov_9fa48("5449"), {
                  error: stryMutAct_9fa48("5450") ? "" : (stryCov_9fa48("5450"), 'No autorizado')
                }), stryMutAct_9fa48("5451") ? {} : (stryCov_9fa48("5451"), {
                  status: 401
                }));
              }
            }
            const validation = await validateBody(request, configSchema);
            if (stryMutAct_9fa48("5454") ? false : stryMutAct_9fa48("5453") ? true : stryMutAct_9fa48("5452") ? validation.success : (stryCov_9fa48("5452", "5453", "5454"), !validation.success)) {
              if (stryMutAct_9fa48("5455")) {
                {}
              } else {
                stryCov_9fa48("5455");
                return validation.error;
              }
            }
            const {
              preferredService
            } = validation.data;

            // Guardar preferencia del usuario en la base de datos
            if (stryMutAct_9fa48("5457") ? false : stryMutAct_9fa48("5456") ? true : (stryCov_9fa48("5456", "5457"), preferredService)) {
              if (stryMutAct_9fa48("5458")) {
                {}
              } else {
                stryCov_9fa48("5458");
                const {
                  prisma
                } = await import(stryMutAct_9fa48("5459") ? "" : (stryCov_9fa48("5459"), '@/lib/prisma'));
                await prisma.user.update(stryMutAct_9fa48("5460") ? {} : (stryCov_9fa48("5460"), {
                  where: stryMutAct_9fa48("5461") ? {} : (stryCov_9fa48("5461"), {
                    id: user.id
                  }),
                  data: stryMutAct_9fa48("5462") ? {} : (stryCov_9fa48("5462"), {
                    preferredAIService: preferredService
                  })
                }));
              }
            }
            return NextResponse.json(stryMutAct_9fa48("5463") ? {} : (stryCov_9fa48("5463"), {
              message: stryMutAct_9fa48("5464") ? "" : (stryCov_9fa48("5464"), 'Configuración actualizada'),
              preferredService
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5465")) {
            {}
          } else {
            stryCov_9fa48("5465");
            return NextResponse.json(stryMutAct_9fa48("5466") ? {} : (stryCov_9fa48("5466"), {
              error: stryMutAct_9fa48("5467") ? "" : (stryCov_9fa48("5467"), 'Error al actualizar configuración')
            }), stryMutAct_9fa48("5468") ? {} : (stryCov_9fa48("5468"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}