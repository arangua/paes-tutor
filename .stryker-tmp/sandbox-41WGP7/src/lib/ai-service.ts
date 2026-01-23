/**
 * Servicio Unificado de IA
 *
 * Permite usar ChatGPT (OpenAI), Claude (Anthropic) o Gemini (Google)
 * con API keys configuradas por usuario o globalmente
 */
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
import Anthropic from '@anthropic-ai/sdk';
import { logger } from './logger';
// Nota: OpenAI y Gemini SDK se pueden agregar después si es necesario
// import OpenAI from 'openai'
// import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIService = 'openai' | 'anthropic' | 'gemini';
export interface AIConfig {
  service: AIService;
  apiKey: string;
  model?: string;
}
export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}
export interface AIResponse {
  content: string;
  service: AIService;
  model: string;
  tokensUsed?: number;
}

/**
 * Obtiene la configuración de IA desde base de datos del usuario o variables de entorno
 */
export async function getAIConfig(userId?: string, preferredService?: AIService): Promise<AIConfig | null> {
  if (stryMutAct_9fa48("22427")) {
    {}
  } else {
    stryCov_9fa48("22427");
    // Prioridad:
    // 1. Configuración del usuario (si userId está disponible)
    // 2. Variables de entorno globales
    // 3. Servicio preferido si está disponible

    const services: AIService[] = stryMutAct_9fa48("22428") ? [] : (stryCov_9fa48("22428"), [stryMutAct_9fa48("22429") ? "" : (stryCov_9fa48("22429"), 'anthropic'), stryMutAct_9fa48("22430") ? "" : (stryCov_9fa48("22430"), 'openai'), stryMutAct_9fa48("22431") ? "" : (stryCov_9fa48("22431"), 'gemini')]);

    // Si hay userId, buscar configuración del usuario
    let userConfig: {
      openaiApiKey?: string | null;
      anthropicApiKey?: string | null;
      geminiApiKey?: string | null;
      preferredAIService?: string | null;
    } | null = null;
    if (stryMutAct_9fa48("22433") ? false : stryMutAct_9fa48("22432") ? true : (stryCov_9fa48("22432", "22433"), userId)) {
      if (stryMutAct_9fa48("22434")) {
        {}
      } else {
        stryCov_9fa48("22434");
        try {
          if (stryMutAct_9fa48("22435")) {
            {}
          } else {
            stryCov_9fa48("22435");
            const {
              prisma
            } = await import(stryMutAct_9fa48("22436") ? "" : (stryCov_9fa48("22436"), '@/lib/prisma'));
            const {
              decrypt
            } = await import(stryMutAct_9fa48("22437") ? "" : (stryCov_9fa48("22437"), '@/lib/encryption'));
            const user = await prisma.user.findUnique(stryMutAct_9fa48("22438") ? {} : (stryCov_9fa48("22438"), {
              where: stryMutAct_9fa48("22439") ? {} : (stryCov_9fa48("22439"), {
                id: userId
              }),
              select: stryMutAct_9fa48("22440") ? {} : (stryCov_9fa48("22440"), {
                openaiApiKey: stryMutAct_9fa48("22441") ? false : (stryCov_9fa48("22441"), true),
                anthropicApiKey: stryMutAct_9fa48("22442") ? false : (stryCov_9fa48("22442"), true),
                geminiApiKey: stryMutAct_9fa48("22443") ? false : (stryCov_9fa48("22443"), true),
                preferredAIService: stryMutAct_9fa48("22444") ? false : (stryCov_9fa48("22444"), true)
              })
            }));
            if (stryMutAct_9fa48("22446") ? false : stryMutAct_9fa48("22445") ? true : (stryCov_9fa48("22445", "22446"), user)) {
              if (stryMutAct_9fa48("22447")) {
                {}
              } else {
                stryCov_9fa48("22447");
                // Desencriptar cada API key de forma segura
                let openaiApiKey: string | null = null;
                let anthropicApiKey: string | null = null;
                let geminiApiKey: string | null = null;
                if (stryMutAct_9fa48("22449") ? false : stryMutAct_9fa48("22448") ? true : (stryCov_9fa48("22448", "22449"), user.openaiApiKey)) {
                  if (stryMutAct_9fa48("22450")) {
                    {}
                  } else {
                    stryCov_9fa48("22450");
                    try {
                      if (stryMutAct_9fa48("22451")) {
                        {}
                      } else {
                        stryCov_9fa48("22451");
                        openaiApiKey = decrypt(user.openaiApiKey);
                      }
                    } catch (error) {
                      if (stryMutAct_9fa48("22452")) {
                        {}
                      } else {
                        stryCov_9fa48("22452");
                        logger.warn(stryMutAct_9fa48("22453") ? {} : (stryCov_9fa48("22453"), {
                          error: error instanceof Error ? error.message : String(error),
                          userId,
                          keyType: stryMutAct_9fa48("22454") ? "" : (stryCov_9fa48("22454"), 'openai')
                        }), stryMutAct_9fa48("22455") ? "" : (stryCov_9fa48("22455"), 'No se pudo desencriptar OpenAI API key del usuario'));
                      }
                    }
                  }
                }
                if (stryMutAct_9fa48("22457") ? false : stryMutAct_9fa48("22456") ? true : (stryCov_9fa48("22456", "22457"), user.anthropicApiKey)) {
                  if (stryMutAct_9fa48("22458")) {
                    {}
                  } else {
                    stryCov_9fa48("22458");
                    try {
                      if (stryMutAct_9fa48("22459")) {
                        {}
                      } else {
                        stryCov_9fa48("22459");
                        anthropicApiKey = decrypt(user.anthropicApiKey);
                      }
                    } catch (error) {
                      if (stryMutAct_9fa48("22460")) {
                        {}
                      } else {
                        stryCov_9fa48("22460");
                        logger.warn(stryMutAct_9fa48("22461") ? {} : (stryCov_9fa48("22461"), {
                          error: error instanceof Error ? error.message : String(error),
                          userId,
                          keyType: stryMutAct_9fa48("22462") ? "" : (stryCov_9fa48("22462"), 'anthropic')
                        }), stryMutAct_9fa48("22463") ? "" : (stryCov_9fa48("22463"), 'No se pudo desencriptar Anthropic API key del usuario'));
                      }
                    }
                  }
                }
                if (stryMutAct_9fa48("22465") ? false : stryMutAct_9fa48("22464") ? true : (stryCov_9fa48("22464", "22465"), user.geminiApiKey)) {
                  if (stryMutAct_9fa48("22466")) {
                    {}
                  } else {
                    stryCov_9fa48("22466");
                    try {
                      if (stryMutAct_9fa48("22467")) {
                        {}
                      } else {
                        stryCov_9fa48("22467");
                        geminiApiKey = decrypt(user.geminiApiKey);
                      }
                    } catch (error) {
                      if (stryMutAct_9fa48("22468")) {
                        {}
                      } else {
                        stryCov_9fa48("22468");
                        logger.warn(stryMutAct_9fa48("22469") ? {} : (stryCov_9fa48("22469"), {
                          error: error instanceof Error ? error.message : String(error),
                          userId,
                          keyType: stryMutAct_9fa48("22470") ? "" : (stryCov_9fa48("22470"), 'gemini')
                        }), stryMutAct_9fa48("22471") ? "" : (stryCov_9fa48("22471"), 'No se pudo desencriptar Gemini API key del usuario'));
                      }
                    }
                  }
                }
                userConfig = stryMutAct_9fa48("22472") ? {} : (stryCov_9fa48("22472"), {
                  openaiApiKey,
                  anthropicApiKey,
                  geminiApiKey,
                  preferredAIService: user.preferredAIService
                });
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("22473")) {
            {}
          } else {
            stryCov_9fa48("22473");
            // Si falla, continuar con variables de entorno
            logger.error(stryMutAct_9fa48("22474") ? {} : (stryCov_9fa48("22474"), {
              error: error instanceof Error ? error.message : String(error),
              userId
            }), stryMutAct_9fa48("22475") ? "" : (stryCov_9fa48("22475"), 'Error al obtener configuración de usuario'));
          }
        }
      }
    }

    // Determinar orden de servicios
    const userPreferredService = userConfig?.preferredAIService as AIService | undefined;
    const finalPreferredService = stryMutAct_9fa48("22478") ? preferredService && userPreferredService : stryMutAct_9fa48("22477") ? false : stryMutAct_9fa48("22476") ? true : (stryCov_9fa48("22476", "22477", "22478"), preferredService || userPreferredService);
    const serviceOrder = finalPreferredService ? stryMutAct_9fa48("22479") ? [] : (stryCov_9fa48("22479"), [finalPreferredService, ...(stryMutAct_9fa48("22480") ? services : (stryCov_9fa48("22480"), services.filter(stryMutAct_9fa48("22481") ? () => undefined : (stryCov_9fa48("22481"), s => stryMutAct_9fa48("22484") ? s === finalPreferredService : stryMutAct_9fa48("22483") ? false : stryMutAct_9fa48("22482") ? true : (stryCov_9fa48("22482", "22483", "22484"), s !== finalPreferredService)))))]) : services;

    // Intentar cada servicio en orden
    for (const service of serviceOrder) {
      if (stryMutAct_9fa48("22485")) {
        {}
      } else {
        stryCov_9fa48("22485");
        let apiKey: string | undefined;

        // Primero intentar con configuración del usuario
        if (stryMutAct_9fa48("22487") ? false : stryMutAct_9fa48("22486") ? true : (stryCov_9fa48("22486", "22487"), userConfig)) {
          if (stryMutAct_9fa48("22488")) {
            {}
          } else {
            stryCov_9fa48("22488");
            switch (service) {
              case stryMutAct_9fa48("22490") ? "" : (stryCov_9fa48("22490"), 'anthropic'):
                if (stryMutAct_9fa48("22489")) {} else {
                  stryCov_9fa48("22489");
                  apiKey = stryMutAct_9fa48("22493") ? userConfig.anthropicApiKey && undefined : stryMutAct_9fa48("22492") ? false : stryMutAct_9fa48("22491") ? true : (stryCov_9fa48("22491", "22492", "22493"), userConfig.anthropicApiKey || undefined);
                  break;
                }
              case stryMutAct_9fa48("22495") ? "" : (stryCov_9fa48("22495"), 'openai'):
                if (stryMutAct_9fa48("22494")) {} else {
                  stryCov_9fa48("22494");
                  apiKey = stryMutAct_9fa48("22498") ? userConfig.openaiApiKey && undefined : stryMutAct_9fa48("22497") ? false : stryMutAct_9fa48("22496") ? true : (stryCov_9fa48("22496", "22497", "22498"), userConfig.openaiApiKey || undefined);
                  break;
                }
              case stryMutAct_9fa48("22500") ? "" : (stryCov_9fa48("22500"), 'gemini'):
                if (stryMutAct_9fa48("22499")) {} else {
                  stryCov_9fa48("22499");
                  apiKey = stryMutAct_9fa48("22503") ? userConfig.geminiApiKey && undefined : stryMutAct_9fa48("22502") ? false : stryMutAct_9fa48("22501") ? true : (stryCov_9fa48("22501", "22502", "22503"), userConfig.geminiApiKey || undefined);
                  break;
                }
            }
          }
        }

        // Si no hay configuración de usuario, usar variables de entorno
        if (stryMutAct_9fa48("22506") ? false : stryMutAct_9fa48("22505") ? true : stryMutAct_9fa48("22504") ? apiKey : (stryCov_9fa48("22504", "22505", "22506"), !apiKey)) {
          if (stryMutAct_9fa48("22507")) {
            {}
          } else {
            stryCov_9fa48("22507");
            switch (service) {
              case stryMutAct_9fa48("22509") ? "" : (stryCov_9fa48("22509"), 'anthropic'):
                if (stryMutAct_9fa48("22508")) {} else {
                  stryCov_9fa48("22508");
                  apiKey = process.env.ANTHROPIC_API_KEY;
                  break;
                }
              case stryMutAct_9fa48("22511") ? "" : (stryCov_9fa48("22511"), 'openai'):
                if (stryMutAct_9fa48("22510")) {} else {
                  stryCov_9fa48("22510");
                  apiKey = process.env.OPENAI_API_KEY;
                  break;
                }
              case stryMutAct_9fa48("22513") ? "" : (stryCov_9fa48("22513"), 'gemini'):
                if (stryMutAct_9fa48("22512")) {} else {
                  stryCov_9fa48("22512");
                  apiKey = process.env.GEMINI_API_KEY;
                  break;
                }
            }
          }
        }
        if (stryMutAct_9fa48("22515") ? false : stryMutAct_9fa48("22514") ? true : (stryCov_9fa48("22514", "22515"), apiKey)) {
          if (stryMutAct_9fa48("22516")) {
            {}
          } else {
            stryCov_9fa48("22516");
            return stryMutAct_9fa48("22517") ? {} : (stryCov_9fa48("22517"), {
              service,
              apiKey,
              model: getDefaultModel(service)
            });
          }
        }
      }
    }
    return null;
  }
}
function getDefaultModel(service: AIService): string {
  if (stryMutAct_9fa48("22518")) {
    {}
  } else {
    stryCov_9fa48("22518");
    switch (service) {
      case stryMutAct_9fa48("22520") ? "" : (stryCov_9fa48("22520"), 'anthropic'):
        if (stryMutAct_9fa48("22519")) {} else {
          stryCov_9fa48("22519");
          return stryMutAct_9fa48("22521") ? "" : (stryCov_9fa48("22521"), 'claude-3-5-sonnet-20241022');
        }
      case stryMutAct_9fa48("22523") ? "" : (stryCov_9fa48("22523"), 'openai'):
        if (stryMutAct_9fa48("22522")) {} else {
          stryCov_9fa48("22522");
          return stryMutAct_9fa48("22524") ? "" : (stryCov_9fa48("22524"), 'gpt-4o');
        }
      case stryMutAct_9fa48("22526") ? "" : (stryCov_9fa48("22526"), 'gemini'):
        if (stryMutAct_9fa48("22525")) {} else {
          stryCov_9fa48("22525");
          return stryMutAct_9fa48("22527") ? "" : (stryCov_9fa48("22527"), 'gemini-pro');
        }
      default:
        if (stryMutAct_9fa48("22528")) {} else {
          stryCov_9fa48("22528");
          return stryMutAct_9fa48("22529") ? "" : (stryCov_9fa48("22529"), 'claude-3-5-sonnet-20241022');
        }
    }
  }
}

/**
 * Envía un mensaje a un servicio de IA
 */
export async function sendAIMessage(messages: AIMessage[], config?: AIConfig, userId?: string): Promise<AIResponse> {
  if (stryMutAct_9fa48("22530")) {
    {}
  } else {
    stryCov_9fa48("22530");
    const aiConfig = stryMutAct_9fa48("22533") ? config && (await getAIConfig(userId)) : stryMutAct_9fa48("22532") ? false : stryMutAct_9fa48("22531") ? true : (stryCov_9fa48("22531", "22532", "22533"), config || (await getAIConfig(userId)));
    if (stryMutAct_9fa48("22536") ? false : stryMutAct_9fa48("22535") ? true : stryMutAct_9fa48("22534") ? aiConfig : (stryCov_9fa48("22534", "22535", "22536"), !aiConfig)) {
      if (stryMutAct_9fa48("22537")) {
        {}
      } else {
        stryCov_9fa48("22537");
        throw new Error((stryMutAct_9fa48("22538") ? "" : (stryCov_9fa48("22538"), 'No hay configuración de IA disponible. ')) + (stryMutAct_9fa48("22539") ? "" : (stryCov_9fa48("22539"), 'Configura al menos una API key en las variables de entorno o en tu perfil.')));
      }
    }
    switch (aiConfig.service) {
      case stryMutAct_9fa48("22541") ? "" : (stryCov_9fa48("22541"), 'anthropic'):
        if (stryMutAct_9fa48("22540")) {} else {
          stryCov_9fa48("22540");
          return await sendToClaude(messages, aiConfig);
        }
      case stryMutAct_9fa48("22543") ? "" : (stryCov_9fa48("22543"), 'openai'):
        if (stryMutAct_9fa48("22542")) {} else {
          stryCov_9fa48("22542");
          return await sendToOpenAI(messages, aiConfig);
        }
      case stryMutAct_9fa48("22545") ? "" : (stryCov_9fa48("22545"), 'gemini'):
        if (stryMutAct_9fa48("22544")) {} else {
          stryCov_9fa48("22544");
          return await sendToGemini(messages, aiConfig);
        }
      default:
        if (stryMutAct_9fa48("22546")) {} else {
          stryCov_9fa48("22546");
          throw new Error(stryMutAct_9fa48("22547") ? `` : (stryCov_9fa48("22547"), `Servicio de IA no soportado: ${aiConfig.service}`));
        }
    }
  }
}
async function sendToClaude(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
  if (stryMutAct_9fa48("22548")) {
    {}
  } else {
    stryCov_9fa48("22548");
    const anthropic = new Anthropic(stryMutAct_9fa48("22549") ? {} : (stryCov_9fa48("22549"), {
      apiKey: config.apiKey
    }));

    // Convertir mensajes al formato de Claude
    const systemMessage = messages.find(stryMutAct_9fa48("22550") ? () => undefined : (stryCov_9fa48("22550"), m => stryMutAct_9fa48("22553") ? m.role !== 'system' : stryMutAct_9fa48("22552") ? false : stryMutAct_9fa48("22551") ? true : (stryCov_9fa48("22551", "22552", "22553"), m.role === (stryMutAct_9fa48("22554") ? "" : (stryCov_9fa48("22554"), 'system')))));
    const conversationMessages = messages.filter(m => m.role !== 'system').map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content
    })) as Array<{
      role: 'user' | 'assistant';
      content: string;
    }>;
    const response = await anthropic.messages.create(stryMutAct_9fa48("22555") ? {} : (stryCov_9fa48("22555"), {
      model: stryMutAct_9fa48("22558") ? config.model && 'claude-3-5-sonnet-20241022' : stryMutAct_9fa48("22557") ? false : stryMutAct_9fa48("22556") ? true : (stryCov_9fa48("22556", "22557", "22558"), config.model || (stryMutAct_9fa48("22559") ? "" : (stryCov_9fa48("22559"), 'claude-3-5-sonnet-20241022'))),
      max_tokens: 4096,
      system: stryMutAct_9fa48("22560") ? systemMessage.content : (stryCov_9fa48("22560"), systemMessage?.content),
      messages: conversationMessages
    }));
    const content = response.content[0];
    if (stryMutAct_9fa48("22563") ? content.type === 'text' : stryMutAct_9fa48("22562") ? false : stryMutAct_9fa48("22561") ? true : (stryCov_9fa48("22561", "22562", "22563"), content.type !== (stryMutAct_9fa48("22564") ? "" : (stryCov_9fa48("22564"), 'text')))) {
      if (stryMutAct_9fa48("22565")) {
        {}
      } else {
        stryCov_9fa48("22565");
        throw new Error(stryMutAct_9fa48("22566") ? "" : (stryCov_9fa48("22566"), 'Respuesta de Claude no es texto'));
      }
    }
    return stryMutAct_9fa48("22567") ? {} : (stryCov_9fa48("22567"), {
      content: content.text,
      service: stryMutAct_9fa48("22568") ? "" : (stryCov_9fa48("22568"), 'anthropic'),
      model: response.model,
      tokensUsed: (stryMutAct_9fa48("22571") ? response.usage?.input_tokens || response.usage?.output_tokens : stryMutAct_9fa48("22570") ? false : stryMutAct_9fa48("22569") ? true : (stryCov_9fa48("22569", "22570", "22571"), (stryMutAct_9fa48("22572") ? response.usage.input_tokens : (stryCov_9fa48("22572"), response.usage?.input_tokens)) && (stryMutAct_9fa48("22573") ? response.usage.output_tokens : (stryCov_9fa48("22573"), response.usage?.output_tokens)))) ? stryMutAct_9fa48("22574") ? response.usage.input_tokens - response.usage.output_tokens : (stryCov_9fa48("22574"), response.usage.input_tokens + response.usage.output_tokens) : undefined
    });
  }
}
async function sendToOpenAI(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
  if (stryMutAct_9fa48("22575")) {
    {}
  } else {
    stryCov_9fa48("22575");
    // Necesitarías instalar: npm install openai
    // Por ahora, lanzamos error si no está disponible
    try {
      if (stryMutAct_9fa48("22576")) {
        {}
      } else {
        stryCov_9fa48("22576");
        // Intentar importar dinámicamente
        const {
          default: OpenAI
        } = await import(stryMutAct_9fa48("22577") ? "" : (stryCov_9fa48("22577"), 'openai'));
        const openai = new OpenAI(stryMutAct_9fa48("22578") ? {} : (stryCov_9fa48("22578"), {
          apiKey: config.apiKey
        }));
        const response = await openai.chat.completions.create(stryMutAct_9fa48("22579") ? {} : (stryCov_9fa48("22579"), {
          model: stryMutAct_9fa48("22582") ? config.model && 'gpt-4o' : stryMutAct_9fa48("22581") ? false : stryMutAct_9fa48("22580") ? true : (stryCov_9fa48("22580", "22581", "22582"), config.model || (stryMutAct_9fa48("22583") ? "" : (stryCov_9fa48("22583"), 'gpt-4o'))),
          messages: messages.map(stryMutAct_9fa48("22584") ? () => undefined : (stryCov_9fa48("22584"), m => stryMutAct_9fa48("22585") ? {} : (stryCov_9fa48("22585"), {
            role: m.role,
            content: m.content
          }))),
          max_tokens: 4096
        }));
        return stryMutAct_9fa48("22586") ? {} : (stryCov_9fa48("22586"), {
          content: stryMutAct_9fa48("22589") ? response.choices[0].message.content && '' : stryMutAct_9fa48("22588") ? false : stryMutAct_9fa48("22587") ? true : (stryCov_9fa48("22587", "22588", "22589"), response.choices[0].message.content || (stryMutAct_9fa48("22590") ? "Stryker was here!" : (stryCov_9fa48("22590"), ''))),
          service: stryMutAct_9fa48("22591") ? "" : (stryCov_9fa48("22591"), 'openai'),
          model: response.model,
          tokensUsed: stryMutAct_9fa48("22592") ? response.usage.total_tokens : (stryCov_9fa48("22592"), response.usage?.total_tokens)
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("22593")) {
        {}
      } else {
        stryCov_9fa48("22593");
        if (stryMutAct_9fa48("22596") ? error instanceof Error || error.message.includes('Cannot find module') : stryMutAct_9fa48("22595") ? false : stryMutAct_9fa48("22594") ? true : (stryCov_9fa48("22594", "22595", "22596"), error instanceof Error && error.message.includes(stryMutAct_9fa48("22597") ? "" : (stryCov_9fa48("22597"), 'Cannot find module')))) {
          if (stryMutAct_9fa48("22598")) {
            {}
          } else {
            stryCov_9fa48("22598");
            throw new Error((stryMutAct_9fa48("22599") ? "" : (stryCov_9fa48("22599"), 'OpenAI SDK no está instalado. ')) + (stryMutAct_9fa48("22600") ? "" : (stryCov_9fa48("22600"), 'Instala con: npm install openai')));
          }
        }
        throw error;
      }
    }
  }
}
async function sendToGemini(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
  if (stryMutAct_9fa48("22601")) {
    {}
  } else {
    stryCov_9fa48("22601");
    // Necesitarías instalar: npm install @google/generative-ai
    try {
      if (stryMutAct_9fa48("22602")) {
        {}
      } else {
        stryCov_9fa48("22602");
        // Intentar importar dinámicamente
        const {
          GoogleGenerativeAI
        } = await import(stryMutAct_9fa48("22603") ? "" : (stryCov_9fa48("22603"), '@google/generative-ai'));
        const genAI = new GoogleGenerativeAI(config.apiKey);
        const model = genAI.getGenerativeModel(stryMutAct_9fa48("22604") ? {} : (stryCov_9fa48("22604"), {
          model: stryMutAct_9fa48("22607") ? config.model && 'gemini-pro' : stryMutAct_9fa48("22606") ? false : stryMutAct_9fa48("22605") ? true : (stryCov_9fa48("22605", "22606", "22607"), config.model || (stryMutAct_9fa48("22608") ? "" : (stryCov_9fa48("22608"), 'gemini-pro')))
        }));
        const prompt = messages.map(stryMutAct_9fa48("22609") ? () => undefined : (stryCov_9fa48("22609"), m => stryMutAct_9fa48("22610") ? `` : (stryCov_9fa48("22610"), `${m.role}: ${m.content}`))).join(stryMutAct_9fa48("22611") ? "" : (stryCov_9fa48("22611"), '\n'));
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        return stryMutAct_9fa48("22612") ? {} : (stryCov_9fa48("22612"), {
          content: text,
          service: stryMutAct_9fa48("22613") ? "" : (stryCov_9fa48("22613"), 'gemini'),
          model: stryMutAct_9fa48("22616") ? config.model && 'gemini-pro' : stryMutAct_9fa48("22615") ? false : stryMutAct_9fa48("22614") ? true : (stryCov_9fa48("22614", "22615", "22616"), config.model || (stryMutAct_9fa48("22617") ? "" : (stryCov_9fa48("22617"), 'gemini-pro')))
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("22618")) {
        {}
      } else {
        stryCov_9fa48("22618");
        if (stryMutAct_9fa48("22621") ? error instanceof Error || error.message.includes('Cannot find module') : stryMutAct_9fa48("22620") ? false : stryMutAct_9fa48("22619") ? true : (stryCov_9fa48("22619", "22620", "22621"), error instanceof Error && error.message.includes(stryMutAct_9fa48("22622") ? "" : (stryCov_9fa48("22622"), 'Cannot find module')))) {
          if (stryMutAct_9fa48("22623")) {
            {}
          } else {
            stryCov_9fa48("22623");
            throw new Error((stryMutAct_9fa48("22624") ? "" : (stryCov_9fa48("22624"), 'Gemini SDK no está instalado. ')) + (stryMutAct_9fa48("22625") ? "" : (stryCov_9fa48("22625"), 'Instala con: npm install @google/generative-ai')));
          }
        }
        throw error;
      }
    }
  }
}

/**
 * Genera explicaciones de respuestas usando IA
 */
export async function generateExplanation(question: string, correctAnswer: string, studentAnswer?: string, topic?: string, config?: AIConfig, userId?: string): Promise<string> {
  if (stryMutAct_9fa48("22626")) {
    {}
  } else {
    stryCov_9fa48("22626");
    const systemPrompt = stryMutAct_9fa48("22627") ? `` : (stryCov_9fa48("22627"), `Eres un tutor experto en preparación para la PAES. 
Tu objetivo es ayudar a los estudiantes a entender por qué una respuesta es correcta o incorrecta.
Sé claro, conciso y pedagógico.`);
    const userPrompt = stryMutAct_9fa48("22628") ? `` : (stryCov_9fa48("22628"), `Pregunta: ${question}

Respuesta correcta: ${correctAnswer}
${studentAnswer ? stryMutAct_9fa48("22629") ? `` : (stryCov_9fa48("22629"), `Respuesta del estudiante: ${studentAnswer}`) : stryMutAct_9fa48("22630") ? "Stryker was here!" : (stryCov_9fa48("22630"), '')}
${topic ? stryMutAct_9fa48("22631") ? `` : (stryCov_9fa48("22631"), `Tema: ${topic}`) : stryMutAct_9fa48("22632") ? "Stryker was here!" : (stryCov_9fa48("22632"), '')}

${studentAnswer ? stryMutAct_9fa48("22633") ? `` : (stryCov_9fa48("22633"), `Explica por qué la respuesta correcta es ${correctAnswer} y por qué la respuesta del estudiante (${studentAnswer}) es incorrecta.`) : stryMutAct_9fa48("22634") ? `` : (stryCov_9fa48("22634"), `Explica por qué la respuesta correcta es ${correctAnswer}.`)}`);
    const response = await sendAIMessage(stryMutAct_9fa48("22635") ? [] : (stryCov_9fa48("22635"), [stryMutAct_9fa48("22636") ? {} : (stryCov_9fa48("22636"), {
      role: stryMutAct_9fa48("22637") ? "" : (stryCov_9fa48("22637"), 'system'),
      content: systemPrompt
    }), stryMutAct_9fa48("22638") ? {} : (stryCov_9fa48("22638"), {
      role: stryMutAct_9fa48("22639") ? "" : (stryCov_9fa48("22639"), 'user'),
      content: userPrompt
    })]), config, userId);
    return response.content;
  }
}

/**
 * Genera recomendaciones de estudio usando IA
 */
export async function generateStudyRecommendations(weaknesses: Array<{
  topic: string;
  percentage: number;
}>, strengths: Array<{
  topic: string;
  percentage: number;
}>, config?: AIConfig, userId?: string): Promise<string> {
  if (stryMutAct_9fa48("22640")) {
    {}
  } else {
    stryCov_9fa48("22640");
    const systemPrompt = stryMutAct_9fa48("22641") ? `` : (stryCov_9fa48("22641"), `Eres un tutor experto en preparación para la PAES.
Genera recomendaciones de estudio personalizadas basadas en las fortalezas y debilidades del estudiante.`);
    const userPrompt = stryMutAct_9fa48("22642") ? `` : (stryCov_9fa48("22642"), `Fortalezas del estudiante (temas con buen rendimiento):
${strengths.map(stryMutAct_9fa48("22643") ? () => undefined : (stryCov_9fa48("22643"), s => stryMutAct_9fa48("22644") ? `` : (stryCov_9fa48("22644"), `- ${s.topic}: ${s.percentage}%`))).join(stryMutAct_9fa48("22645") ? "" : (stryCov_9fa48("22645"), '\n'))}

Debilidades del estudiante (temas que necesitan refuerzo):
${weaknesses.map(stryMutAct_9fa48("22646") ? () => undefined : (stryCov_9fa48("22646"), w => stryMutAct_9fa48("22647") ? `` : (stryCov_9fa48("22647"), `- ${w.topic}: ${w.percentage}%`))).join(stryMutAct_9fa48("22648") ? "" : (stryCov_9fa48("22648"), '\n'))}

Genera recomendaciones específicas y accionables para mejorar en los temas débiles.`);
    const response = await sendAIMessage(stryMutAct_9fa48("22649") ? [] : (stryCov_9fa48("22649"), [stryMutAct_9fa48("22650") ? {} : (stryCov_9fa48("22650"), {
      role: stryMutAct_9fa48("22651") ? "" : (stryCov_9fa48("22651"), 'system'),
      content: systemPrompt
    }), stryMutAct_9fa48("22652") ? {} : (stryCov_9fa48("22652"), {
      role: stryMutAct_9fa48("22653") ? "" : (stryCov_9fa48("22653"), 'user'),
      content: userPrompt
    })]), config, userId);
    return response.content;
  }
}