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
import { getCurrentStudentId } from '@/lib/get-session';
import { withRateLimit } from '@/lib/rate-limit-middleware';
import { sendAIMessage, generateExplanation, generateStudyRecommendations, type AIMessage, type AIService } from '@/lib/ai-service';
import { z } from 'zod';
import { validateBody } from '@/lib/api-helpers';
import { logger } from '@/lib/logger';
export const runtime = stryMutAct_9fa48("5221") ? "" : (stryCov_9fa48("5221"), 'nodejs');
const chatSchema = z.object(stryMutAct_9fa48("5222") ? {} : (stryCov_9fa48("5222"), {
  messages: z.array(z.object(stryMutAct_9fa48("5223") ? {} : (stryCov_9fa48("5223"), {
    role: z.enum(stryMutAct_9fa48("5224") ? [] : (stryCov_9fa48("5224"), [stryMutAct_9fa48("5225") ? "" : (stryCov_9fa48("5225"), 'user'), stryMutAct_9fa48("5226") ? "" : (stryCov_9fa48("5226"), 'assistant'), stryMutAct_9fa48("5227") ? "" : (stryCov_9fa48("5227"), 'system')])),
    content: z.string()
  }))),
  service: z.enum(stryMutAct_9fa48("5228") ? [] : (stryCov_9fa48("5228"), [stryMutAct_9fa48("5229") ? "" : (stryCov_9fa48("5229"), 'openai'), stryMutAct_9fa48("5230") ? "" : (stryCov_9fa48("5230"), 'anthropic'), stryMutAct_9fa48("5231") ? "" : (stryCov_9fa48("5231"), 'gemini')])).optional(),
  model: z.string().optional()
}));
const explanationSchema = z.object(stryMutAct_9fa48("5232") ? {} : (stryCov_9fa48("5232"), {
  question: z.string(),
  correctAnswer: z.string(),
  studentAnswer: z.string().optional(),
  topic: z.string().optional(),
  service: z.enum(stryMutAct_9fa48("5233") ? [] : (stryCov_9fa48("5233"), [stryMutAct_9fa48("5234") ? "" : (stryCov_9fa48("5234"), 'openai'), stryMutAct_9fa48("5235") ? "" : (stryCov_9fa48("5235"), 'anthropic'), stryMutAct_9fa48("5236") ? "" : (stryCov_9fa48("5236"), 'gemini')])).optional()
}));
const recommendationsSchema = z.object(stryMutAct_9fa48("5237") ? {} : (stryCov_9fa48("5237"), {
  weaknesses: z.array(z.object(stryMutAct_9fa48("5238") ? {} : (stryCov_9fa48("5238"), {
    topic: z.string(),
    percentage: z.number()
  }))),
  strengths: z.array(z.object(stryMutAct_9fa48("5239") ? {} : (stryCov_9fa48("5239"), {
    topic: z.string(),
    percentage: z.number()
  }))),
  service: z.enum(stryMutAct_9fa48("5240") ? [] : (stryCov_9fa48("5240"), [stryMutAct_9fa48("5241") ? "" : (stryCov_9fa48("5241"), 'openai'), stryMutAct_9fa48("5242") ? "" : (stryCov_9fa48("5242"), 'anthropic'), stryMutAct_9fa48("5243") ? "" : (stryCov_9fa48("5243"), 'gemini')])).optional()
}));
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("5244")) {
    {}
  } else {
    stryCov_9fa48("5244");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("5245")) {
        {}
      } else {
        stryCov_9fa48("5245");
        try {
          if (stryMutAct_9fa48("5246")) {
            {}
          } else {
            stryCov_9fa48("5246");
            const studentId = await getCurrentStudentId();
            if (stryMutAct_9fa48("5249") ? false : stryMutAct_9fa48("5248") ? true : stryMutAct_9fa48("5247") ? studentId : (stryCov_9fa48("5247", "5248", "5249"), !studentId)) {
              if (stryMutAct_9fa48("5250")) {
                {}
              } else {
                stryCov_9fa48("5250");
                return NextResponse.json(stryMutAct_9fa48("5251") ? {} : (stryCov_9fa48("5251"), {
                  error: stryMutAct_9fa48("5252") ? "" : (stryCov_9fa48("5252"), 'No autorizado')
                }), stryMutAct_9fa48("5253") ? {} : (stryCov_9fa48("5253"), {
                  status: 401
                }));
              }
            }
            const body = await request.json();
            const {
              type,
              ...data
            } = body;
            if (stryMutAct_9fa48("5256") ? type !== 'chat' : stryMutAct_9fa48("5255") ? false : stryMutAct_9fa48("5254") ? true : (stryCov_9fa48("5254", "5255", "5256"), type === (stryMutAct_9fa48("5257") ? "" : (stryCov_9fa48("5257"), 'chat')))) {
              if (stryMutAct_9fa48("5258")) {
                {}
              } else {
                stryCov_9fa48("5258");
                const validation = await validateBody(new NextRequest(request.url, stryMutAct_9fa48("5259") ? {} : (stryCov_9fa48("5259"), {
                  method: stryMutAct_9fa48("5260") ? "" : (stryCov_9fa48("5260"), 'POST'),
                  body: JSON.stringify(data),
                  headers: request.headers
                })), chatSchema);
                if (stryMutAct_9fa48("5263") ? false : stryMutAct_9fa48("5262") ? true : stryMutAct_9fa48("5261") ? validation.success : (stryCov_9fa48("5261", "5262", "5263"), !validation.success)) {
                  if (stryMutAct_9fa48("5264")) {
                    {}
                  } else {
                    stryCov_9fa48("5264");
                    return validation.error;
                  }
                }
                const {
                  messages,
                  service,
                  model
                } = validation.data;
                const response = await sendAIMessage(messages as AIMessage[], service ? stryMutAct_9fa48("5265") ? {} : (stryCov_9fa48("5265"), {
                  service: service as AIService,
                  apiKey: stryMutAct_9fa48("5266") ? "Stryker was here!" : (stryCov_9fa48("5266"), ''),
                  model
                }) : undefined, studentId);
                return NextResponse.json(response);
              }
            }
            if (stryMutAct_9fa48("5269") ? type !== 'explanation' : stryMutAct_9fa48("5268") ? false : stryMutAct_9fa48("5267") ? true : (stryCov_9fa48("5267", "5268", "5269"), type === (stryMutAct_9fa48("5270") ? "" : (stryCov_9fa48("5270"), 'explanation')))) {
              if (stryMutAct_9fa48("5271")) {
                {}
              } else {
                stryCov_9fa48("5271");
                const validation = await validateBody(new NextRequest(request.url, stryMutAct_9fa48("5272") ? {} : (stryCov_9fa48("5272"), {
                  method: stryMutAct_9fa48("5273") ? "" : (stryCov_9fa48("5273"), 'POST'),
                  body: JSON.stringify(data),
                  headers: request.headers
                })), explanationSchema);
                if (stryMutAct_9fa48("5276") ? false : stryMutAct_9fa48("5275") ? true : stryMutAct_9fa48("5274") ? validation.success : (stryCov_9fa48("5274", "5275", "5276"), !validation.success)) {
                  if (stryMutAct_9fa48("5277")) {
                    {}
                  } else {
                    stryCov_9fa48("5277");
                    return validation.error;
                  }
                }
                const {
                  question,
                  correctAnswer,
                  studentAnswer,
                  topic,
                  service
                } = validation.data;
                const explanation = await generateExplanation(question, correctAnswer, studentAnswer, topic, service ? stryMutAct_9fa48("5278") ? {} : (stryCov_9fa48("5278"), {
                  service: service as AIService,
                  apiKey: stryMutAct_9fa48("5279") ? "Stryker was here!" : (stryCov_9fa48("5279"), '')
                }) : undefined, studentId);
                return NextResponse.json(stryMutAct_9fa48("5280") ? {} : (stryCov_9fa48("5280"), {
                  explanation
                }));
              }
            }
            if (stryMutAct_9fa48("5283") ? type !== 'recommendations' : stryMutAct_9fa48("5282") ? false : stryMutAct_9fa48("5281") ? true : (stryCov_9fa48("5281", "5282", "5283"), type === (stryMutAct_9fa48("5284") ? "" : (stryCov_9fa48("5284"), 'recommendations')))) {
              if (stryMutAct_9fa48("5285")) {
                {}
              } else {
                stryCov_9fa48("5285");
                const validation = await validateBody(new NextRequest(request.url, stryMutAct_9fa48("5286") ? {} : (stryCov_9fa48("5286"), {
                  method: stryMutAct_9fa48("5287") ? "" : (stryCov_9fa48("5287"), 'POST'),
                  body: JSON.stringify(data),
                  headers: request.headers
                })), recommendationsSchema);
                if (stryMutAct_9fa48("5290") ? false : stryMutAct_9fa48("5289") ? true : stryMutAct_9fa48("5288") ? validation.success : (stryCov_9fa48("5288", "5289", "5290"), !validation.success)) {
                  if (stryMutAct_9fa48("5291")) {
                    {}
                  } else {
                    stryCov_9fa48("5291");
                    return validation.error;
                  }
                }
                const {
                  weaknesses,
                  strengths,
                  service
                } = validation.data;
                const recommendations = await generateStudyRecommendations(weaknesses, strengths, service ? stryMutAct_9fa48("5292") ? {} : (stryCov_9fa48("5292"), {
                  service: service as AIService,
                  apiKey: stryMutAct_9fa48("5293") ? "Stryker was here!" : (stryCov_9fa48("5293"), '')
                }) : undefined, studentId);
                return NextResponse.json(stryMutAct_9fa48("5294") ? {} : (stryCov_9fa48("5294"), {
                  recommendations
                }));
              }
            }
            return NextResponse.json(stryMutAct_9fa48("5295") ? {} : (stryCov_9fa48("5295"), {
              error: stryMutAct_9fa48("5296") ? "" : (stryCov_9fa48("5296"), 'Tipo de solicitud no válido. Use: chat, explanation, o recommendations')
            }), stryMutAct_9fa48("5297") ? {} : (stryCov_9fa48("5297"), {
              status: 400
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("5298")) {
            {}
          } else {
            stryCov_9fa48("5298");
            let requestType = stryMutAct_9fa48("5299") ? "" : (stryCov_9fa48("5299"), 'unknown');
            try {
              if (stryMutAct_9fa48("5300")) {
                {}
              } else {
                stryCov_9fa48("5300");
                const body = await request.json().catch(error => {
                  if (stryMutAct_9fa48("5301")) {
                    {}
                  } else {
                    stryCov_9fa48("5301");
                    // Log error de parsing JSON
                    logger.warn(stryMutAct_9fa48("5302") ? {} : (stryCov_9fa48("5302"), {
                      error: error instanceof Error ? error.message : String(error),
                      path: request.nextUrl.pathname
                    }), stryMutAct_9fa48("5303") ? "" : (stryCov_9fa48("5303"), 'Error al parsear JSON de body en API de IA'));
                    return {};
                  }
                });
                requestType = stryMutAct_9fa48("5306") ? body.type && 'unknown' : stryMutAct_9fa48("5305") ? false : stryMutAct_9fa48("5304") ? true : (stryCov_9fa48("5304", "5305", "5306"), body.type || (stryMutAct_9fa48("5307") ? "" : (stryCov_9fa48("5307"), 'unknown')));
              }
            } catch {
              // Ignorar error al leer body
            }
            logger.error(stryMutAct_9fa48("5308") ? {} : (stryCov_9fa48("5308"), {
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              studentId,
              type: requestType
            }), stryMutAct_9fa48("5309") ? "" : (stryCov_9fa48("5309"), 'Error en API de IA'));
            return NextResponse.json(stryMutAct_9fa48("5310") ? {} : (stryCov_9fa48("5310"), {
              error: error instanceof Error ? error.message : stryMutAct_9fa48("5311") ? "" : (stryCov_9fa48("5311"), 'Error al procesar solicitud de IA'),
              details: (stryMutAct_9fa48("5314") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("5313") ? false : stryMutAct_9fa48("5312") ? true : (stryCov_9fa48("5312", "5313", "5314"), process.env.NODE_ENV === (stryMutAct_9fa48("5315") ? "" : (stryCov_9fa48("5315"), 'development')))) ? error instanceof Error ? error.stack : String(error) : undefined
            }), stryMutAct_9fa48("5316") ? {} : (stryCov_9fa48("5316"), {
              status: 500
            }));
          }
        }
      }
    });
  }
}