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
import { logger } from '@/lib/logger';
import * as cheerio from 'cheerio';
import axios from 'axios';
import https from 'https';
import http from 'http';
export const runtime = stryMutAct_9fa48("2602") ? "" : (stryCov_9fa48("2602"), 'nodejs');
interface PDFLink {
  url: string;
  title: string;
  subject?: string;
  year?: string;
}

/**
 * Obtiene el contenido HTML de una URL usando axios con configuración muy permisiva
 * Intenta manejar headers mal formateados del servidor de DEMRE
 */
async function fetchHTML(url: string): Promise<string> {
  if (stryMutAct_9fa48("2603")) {
    {}
  } else {
    stryCov_9fa48("2603");
    try {
      if (stryMutAct_9fa48("2604")) {
        {}
      } else {
        stryCov_9fa48("2604");
        // Usar axios con configuración muy permisiva para manejar headers mal formateados
        const response = await axios.get(url, stryMutAct_9fa48("2605") ? {} : (stryCov_9fa48("2605"), {
          headers: stryMutAct_9fa48("2606") ? {} : (stryCov_9fa48("2606"), {
            'User-Agent': stryMutAct_9fa48("2607") ? "" : (stryCov_9fa48("2607"), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
            Accept: stryMutAct_9fa48("2608") ? "" : (stryCov_9fa48("2608"), 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
            'Accept-Language': stryMutAct_9fa48("2609") ? "" : (stryCov_9fa48("2609"), 'es-ES,es;q=0.9,en;q=0.8')
          }),
          timeout: 20000,
          maxRedirects: 5,
          validateStatus: stryMutAct_9fa48("2610") ? () => undefined : (stryCov_9fa48("2610"), status => stryMutAct_9fa48("2613") ? status >= 200 || status < 400 : stryMutAct_9fa48("2612") ? false : stryMutAct_9fa48("2611") ? true : (stryCov_9fa48("2611", "2612", "2613"), (stryMutAct_9fa48("2616") ? status < 200 : stryMutAct_9fa48("2615") ? status > 200 : stryMutAct_9fa48("2614") ? true : (stryCov_9fa48("2614", "2615", "2616"), status >= 200)) && (stryMutAct_9fa48("2619") ? status >= 400 : stryMutAct_9fa48("2618") ? status <= 400 : stryMutAct_9fa48("2617") ? true : (stryCov_9fa48("2617", "2618", "2619"), status < 400)))),
          // Usar arraybuffer y convertir manualmente para evitar problemas de encoding
          responseType: stryMutAct_9fa48("2620") ? "" : (stryCov_9fa48("2620"), 'arraybuffer'),
          // Configurar para ser más tolerante con errores
          transformResponse: stryMutAct_9fa48("2621") ? [] : (stryCov_9fa48("2621"), [stryMutAct_9fa48("2622") ? () => undefined : (stryCov_9fa48("2622"), data => data)]) // No transformar, manejar manualmente
        }));

        // Convertir el buffer a string
        const buffer = Buffer.from(response.data);
        let html: string;

        // Intentar diferentes encodings
        try {
          if (stryMutAct_9fa48("2623")) {
            {}
          } else {
            stryCov_9fa48("2623");
            html = buffer.toString(stryMutAct_9fa48("2624") ? "" : (stryCov_9fa48("2624"), 'utf-8'));
          }
        } catch {
          if (stryMutAct_9fa48("2625")) {
            {}
          } else {
            stryCov_9fa48("2625");
            try {
              if (stryMutAct_9fa48("2626")) {
                {}
              } else {
                stryCov_9fa48("2626");
                html = buffer.toString(stryMutAct_9fa48("2627") ? "" : (stryCov_9fa48("2627"), 'latin1'));
              }
            } catch {
              if (stryMutAct_9fa48("2628")) {
                {}
              } else {
                stryCov_9fa48("2628");
                html = buffer.toString(stryMutAct_9fa48("2629") ? "" : (stryCov_9fa48("2629"), 'binary'));
              }
            }
          }
        }
        if (stryMutAct_9fa48("2632") ? !html && html.length === 0 : stryMutAct_9fa48("2631") ? false : stryMutAct_9fa48("2630") ? true : (stryCov_9fa48("2630", "2631", "2632"), (stryMutAct_9fa48("2633") ? html : (stryCov_9fa48("2633"), !html)) || (stryMutAct_9fa48("2635") ? html.length !== 0 : stryMutAct_9fa48("2634") ? false : (stryCov_9fa48("2634", "2635"), html.length === 0)))) {
          if (stryMutAct_9fa48("2636")) {
            {}
          } else {
            stryCov_9fa48("2636");
            throw new Error(stryMutAct_9fa48("2637") ? "" : (stryCov_9fa48("2637"), 'No se recibieron datos de la página'));
          }
        }
        return html;
      }
    } catch (error) {
      if (stryMutAct_9fa48("2638")) {
        {}
      } else {
        stryCov_9fa48("2638");
        if (stryMutAct_9fa48("2640") ? false : stryMutAct_9fa48("2639") ? true : (stryCov_9fa48("2639", "2640"), axios.isAxiosError(error))) {
          if (stryMutAct_9fa48("2641")) {
            {}
          } else {
            stryCov_9fa48("2641");
            // Si axios falla por parsing de headers, intentar con método alternativo
            if (stryMutAct_9fa48("2644") ? error.message.includes('Parse Error') && error.message.includes('CR after header') : stryMutAct_9fa48("2643") ? false : stryMutAct_9fa48("2642") ? true : (stryCov_9fa48("2642", "2643", "2644"), error.message.includes(stryMutAct_9fa48("2645") ? "" : (stryCov_9fa48("2645"), 'Parse Error')) || error.message.includes(stryMutAct_9fa48("2646") ? "" : (stryCov_9fa48("2646"), 'CR after header')))) {
              if (stryMutAct_9fa48("2647")) {
                {}
              } else {
                stryCov_9fa48("2647");
                logger.warn(stryMutAct_9fa48("2648") ? {} : (stryCov_9fa48("2648"), {
                  type: stryMutAct_9fa48("2649") ? "" : (stryCov_9fa48("2649"), 'fetch_html_fallback'),
                  url,
                  error: error.message,
                  reason: stryMutAct_9fa48("2650") ? "" : (stryCov_9fa48("2650"), 'headers_mal_formateados')
                }), stryMutAct_9fa48("2651") ? "" : (stryCov_9fa48("2651"), 'Axios falló por headers mal formateados, intentando método alternativo...'));
                return fetchHTMLAlternative(url);
              }
            }
            if (stryMutAct_9fa48("2654") ? error.code === 'ECONNABORTED' && error.message.includes('timeout') : stryMutAct_9fa48("2653") ? false : stryMutAct_9fa48("2652") ? true : (stryCov_9fa48("2652", "2653", "2654"), (stryMutAct_9fa48("2656") ? error.code !== 'ECONNABORTED' : stryMutAct_9fa48("2655") ? false : (stryCov_9fa48("2655", "2656"), error.code === (stryMutAct_9fa48("2657") ? "" : (stryCov_9fa48("2657"), 'ECONNABORTED')))) || error.message.includes(stryMutAct_9fa48("2658") ? "" : (stryCov_9fa48("2658"), 'timeout')))) {
              if (stryMutAct_9fa48("2659")) {
                {}
              } else {
                stryCov_9fa48("2659");
                throw new Error(stryMutAct_9fa48("2660") ? "" : (stryCov_9fa48("2660"), 'La petición tardó demasiado'));
              }
            }
            if (stryMutAct_9fa48("2663") ? error.code === 'ENOTFOUND' && error.code === 'ECONNREFUSED' : stryMutAct_9fa48("2662") ? false : stryMutAct_9fa48("2661") ? true : (stryCov_9fa48("2661", "2662", "2663"), (stryMutAct_9fa48("2665") ? error.code !== 'ENOTFOUND' : stryMutAct_9fa48("2664") ? false : (stryCov_9fa48("2664", "2665"), error.code === (stryMutAct_9fa48("2666") ? "" : (stryCov_9fa48("2666"), 'ENOTFOUND')))) || (stryMutAct_9fa48("2668") ? error.code !== 'ECONNREFUSED' : stryMutAct_9fa48("2667") ? false : (stryCov_9fa48("2667", "2668"), error.code === (stryMutAct_9fa48("2669") ? "" : (stryCov_9fa48("2669"), 'ECONNREFUSED')))))) {
              if (stryMutAct_9fa48("2670")) {
                {}
              } else {
                stryCov_9fa48("2670");
                throw new Error(stryMutAct_9fa48("2671") ? "" : (stryCov_9fa48("2671"), 'No se pudo conectar al servidor'));
              }
            }
            if (stryMutAct_9fa48("2673") ? false : stryMutAct_9fa48("2672") ? true : (stryCov_9fa48("2672", "2673"), error.response)) {
              if (stryMutAct_9fa48("2674")) {
                {}
              } else {
                stryCov_9fa48("2674");
                throw new Error(stryMutAct_9fa48("2675") ? `` : (stryCov_9fa48("2675"), `Error HTTP ${error.response.status}: ${error.response.statusText}`));
              }
            }
            throw new Error(stryMutAct_9fa48("2676") ? `` : (stryCov_9fa48("2676"), `Error de red: ${error.message}`));
          }
        }
        if (stryMutAct_9fa48("2678") ? false : stryMutAct_9fa48("2677") ? true : (stryCov_9fa48("2677", "2678"), error instanceof Error)) {
          if (stryMutAct_9fa48("2679")) {
            {}
          } else {
            stryCov_9fa48("2679");
            throw error;
          }
        }
        throw new Error(stryMutAct_9fa48("2680") ? "" : (stryCov_9fa48("2680"), 'Error desconocido al obtener la página'));
      }
    }
  }
}

/**
 * Método alternativo usando módulos nativos con manejo de errores más permisivo
 */
async function fetchHTMLAlternative(url: string): Promise<string> {
  if (stryMutAct_9fa48("2681")) {
    {}
  } else {
    stryCov_9fa48("2681");
    return new Promise((resolve, reject) => {
      if (stryMutAct_9fa48("2682")) {
        {}
      } else {
        stryCov_9fa48("2682");
        const https = require('https');
        const http = require('http');
        const urlObj = new URL(url);
        const protocol = (stryMutAct_9fa48("2685") ? urlObj.protocol !== 'https:' : stryMutAct_9fa48("2684") ? false : stryMutAct_9fa48("2683") ? true : (stryCov_9fa48("2683", "2684", "2685"), urlObj.protocol === (stryMutAct_9fa48("2686") ? "" : (stryCov_9fa48("2686"), 'https:')))) ? https : http;
        const options: https.RequestOptions = stryMutAct_9fa48("2687") ? {} : (stryCov_9fa48("2687"), {
          hostname: urlObj.hostname,
          port: urlObj.port ? parseInt(urlObj.port, 10) : (stryMutAct_9fa48("2690") ? urlObj.protocol !== 'https:' : stryMutAct_9fa48("2689") ? false : stryMutAct_9fa48("2688") ? true : (stryCov_9fa48("2688", "2689", "2690"), urlObj.protocol === (stryMutAct_9fa48("2691") ? "" : (stryCov_9fa48("2691"), 'https:')))) ? 443 : 80,
          path: stryMutAct_9fa48("2692") ? urlObj.pathname - urlObj.search : (stryCov_9fa48("2692"), urlObj.pathname + urlObj.search),
          method: stryMutAct_9fa48("2693") ? "" : (stryCov_9fa48("2693"), 'GET'),
          headers: stryMutAct_9fa48("2694") ? {} : (stryCov_9fa48("2694"), {
            'User-Agent': stryMutAct_9fa48("2695") ? "" : (stryCov_9fa48("2695"), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'),
            Accept: stryMutAct_9fa48("2696") ? "" : (stryCov_9fa48("2696"), 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'),
            'Accept-Language': stryMutAct_9fa48("2697") ? "" : (stryCov_9fa48("2697"), 'es-ES,es;q=0.9,en;q=0.8')
          }),
          timeout: 20000,
          // Deshabilitar validación estricta de certificados (solo para desarrollo)
          rejectUnauthorized: stryMutAct_9fa48("2698") ? true : (stryCov_9fa48("2698"), false)
        });
        let responseData = Buffer.alloc(0);
        let headersReceived = stryMutAct_9fa48("2699") ? true : (stryCov_9fa48("2699"), false);
        const req = protocol.request(options, (res: http.IncomingMessage) => {
          if (stryMutAct_9fa48("2700")) {
            {}
          } else {
            stryCov_9fa48("2700");
            headersReceived = stryMutAct_9fa48("2701") ? false : (stryCov_9fa48("2701"), true);
            if (stryMutAct_9fa48("2704") ? (!res.statusCode || res.statusCode < 200) && res.statusCode >= 400 : stryMutAct_9fa48("2703") ? false : stryMutAct_9fa48("2702") ? true : (stryCov_9fa48("2702", "2703", "2704"), (stryMutAct_9fa48("2706") ? !res.statusCode && res.statusCode < 200 : stryMutAct_9fa48("2705") ? false : (stryCov_9fa48("2705", "2706"), (stryMutAct_9fa48("2707") ? res.statusCode : (stryCov_9fa48("2707"), !res.statusCode)) || (stryMutAct_9fa48("2710") ? res.statusCode >= 200 : stryMutAct_9fa48("2709") ? res.statusCode <= 200 : stryMutAct_9fa48("2708") ? false : (stryCov_9fa48("2708", "2709", "2710"), res.statusCode < 200)))) || (stryMutAct_9fa48("2713") ? res.statusCode < 400 : stryMutAct_9fa48("2712") ? res.statusCode > 400 : stryMutAct_9fa48("2711") ? false : (stryCov_9fa48("2711", "2712", "2713"), res.statusCode >= 400)))) {
              if (stryMutAct_9fa48("2714")) {
                {}
              } else {
                stryCov_9fa48("2714");
                reject(new Error(stryMutAct_9fa48("2715") ? `` : (stryCov_9fa48("2715"), `Error HTTP: ${stryMutAct_9fa48("2718") ? res.statusCode && 'unknown' : stryMutAct_9fa48("2717") ? false : stryMutAct_9fa48("2716") ? true : (stryCov_9fa48("2716", "2717", "2718"), res.statusCode || (stryMutAct_9fa48("2719") ? "" : (stryCov_9fa48("2719"), 'unknown')))}`)));
                return;
              }
            }
            res.on(stryMutAct_9fa48("2720") ? "" : (stryCov_9fa48("2720"), 'data'), (chunk: Buffer) => {
              if (stryMutAct_9fa48("2721")) {
                {}
              } else {
                stryCov_9fa48("2721");
                responseData = Buffer.concat(stryMutAct_9fa48("2722") ? [] : (stryCov_9fa48("2722"), [responseData, chunk]));
              }
            });
            res.on(stryMutAct_9fa48("2723") ? "" : (stryCov_9fa48("2723"), 'end'), () => {
              if (stryMutAct_9fa48("2724")) {
                {}
              } else {
                stryCov_9fa48("2724");
                try {
                  if (stryMutAct_9fa48("2725")) {
                    {}
                  } else {
                    stryCov_9fa48("2725");
                    let html: string;
                    try {
                      if (stryMutAct_9fa48("2726")) {
                        {}
                      } else {
                        stryCov_9fa48("2726");
                        html = responseData.toString(stryMutAct_9fa48("2727") ? "" : (stryCov_9fa48("2727"), 'utf-8'));
                      }
                    } catch {
                      if (stryMutAct_9fa48("2728")) {
                        {}
                      } else {
                        stryCov_9fa48("2728");
                        html = responseData.toString(stryMutAct_9fa48("2729") ? "" : (stryCov_9fa48("2729"), 'latin1'));
                      }
                    }
                    if (stryMutAct_9fa48("2732") ? !html && html.length === 0 : stryMutAct_9fa48("2731") ? false : stryMutAct_9fa48("2730") ? true : (stryCov_9fa48("2730", "2731", "2732"), (stryMutAct_9fa48("2733") ? html : (stryCov_9fa48("2733"), !html)) || (stryMutAct_9fa48("2735") ? html.length !== 0 : stryMutAct_9fa48("2734") ? false : (stryCov_9fa48("2734", "2735"), html.length === 0)))) {
                      if (stryMutAct_9fa48("2736")) {
                        {}
                      } else {
                        stryCov_9fa48("2736");
                        reject(new Error(stryMutAct_9fa48("2737") ? "" : (stryCov_9fa48("2737"), 'No se recibieron datos de la página')));
                        return;
                      }
                    }
                    resolve(html);
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("2738")) {
                    {}
                  } else {
                    stryCov_9fa48("2738");
                    reject(error instanceof Error ? error : new Error(stryMutAct_9fa48("2739") ? "" : (stryCov_9fa48("2739"), 'Error al procesar respuesta')));
                  }
                }
              }
            });
          }
        });
        req.on(stryMutAct_9fa48("2740") ? "" : (stryCov_9fa48("2740"), 'error'), (error: Error) => {
          if (stryMutAct_9fa48("2741")) {
            {}
          } else {
            stryCov_9fa48("2741");
            // Si el error es de parsing pero ya recibimos headers, intentar usar los datos
            if (stryMutAct_9fa48("2744") ? headersReceived || error.message.includes('Parse Error') || error.message.includes('CR after header') : stryMutAct_9fa48("2743") ? false : stryMutAct_9fa48("2742") ? true : (stryCov_9fa48("2742", "2743", "2744"), headersReceived && (stryMutAct_9fa48("2746") ? error.message.includes('Parse Error') && error.message.includes('CR after header') : stryMutAct_9fa48("2745") ? true : (stryCov_9fa48("2745", "2746"), error.message.includes(stryMutAct_9fa48("2747") ? "" : (stryCov_9fa48("2747"), 'Parse Error')) || error.message.includes(stryMutAct_9fa48("2748") ? "" : (stryCov_9fa48("2748"), 'CR after header')))))) {
              if (stryMutAct_9fa48("2749")) {
                {}
              } else {
                stryCov_9fa48("2749");
                if (stryMutAct_9fa48("2753") ? responseData.length <= 0 : stryMutAct_9fa48("2752") ? responseData.length >= 0 : stryMutAct_9fa48("2751") ? false : stryMutAct_9fa48("2750") ? true : (stryCov_9fa48("2750", "2751", "2752", "2753"), responseData.length > 0)) {
                  if (stryMutAct_9fa48("2754")) {
                    {}
                  } else {
                    stryCov_9fa48("2754");
                    try {
                      if (stryMutAct_9fa48("2755")) {
                        {}
                      } else {
                        stryCov_9fa48("2755");
                        const html = stryMutAct_9fa48("2758") ? responseData.toString('utf-8') && responseData.toString('latin1') : stryMutAct_9fa48("2757") ? false : stryMutAct_9fa48("2756") ? true : (stryCov_9fa48("2756", "2757", "2758"), responseData.toString(stryMutAct_9fa48("2759") ? "" : (stryCov_9fa48("2759"), 'utf-8')) || responseData.toString(stryMutAct_9fa48("2760") ? "" : (stryCov_9fa48("2760"), 'latin1')));
                        if (stryMutAct_9fa48("2763") ? html || html.length > 0 : stryMutAct_9fa48("2762") ? false : stryMutAct_9fa48("2761") ? true : (stryCov_9fa48("2761", "2762", "2763"), html && (stryMutAct_9fa48("2766") ? html.length <= 0 : stryMutAct_9fa48("2765") ? html.length >= 0 : stryMutAct_9fa48("2764") ? true : (stryCov_9fa48("2764", "2765", "2766"), html.length > 0)))) {
                          if (stryMutAct_9fa48("2767")) {
                            {}
                          } else {
                            stryCov_9fa48("2767");
                            resolve(html);
                            return;
                          }
                        }
                      }
                    } catch {
                      // Si falla, rechazar con el error original
                    }
                  }
                }
              }
            }
            reject(error);
          }
        });
        req.on(stryMutAct_9fa48("2768") ? "" : (stryCov_9fa48("2768"), 'timeout'), () => {
          if (stryMutAct_9fa48("2769")) {
            {}
          } else {
            stryCov_9fa48("2769");
            req.destroy();
            reject(new Error(stryMutAct_9fa48("2770") ? "" : (stryCov_9fa48("2770"), 'La petición tardó demasiado')));
          }
        });
        req.end();
      }
    });
  }
}

/**
 * Extrae enlaces a PDFs desde una página de DEMRE
 */
async function extractPDFLinksFromPage(url: string): Promise<PDFLink[]> {
  if (stryMutAct_9fa48("2771")) {
    {}
  } else {
    stryCov_9fa48("2771");
    try {
      if (stryMutAct_9fa48("2772")) {
        {}
      } else {
        stryCov_9fa48("2772");
        // Usar módulos nativos de Node.js para mayor tolerancia con headers mal formateados
        const html = await fetchHTML(url);
        const $ = cheerio.load(html);
        const pdfLinks: PDFLink[] = stryMutAct_9fa48("2773") ? ["Stryker was here"] : (stryCov_9fa48("2773"), []);

        // Buscar todos los enlaces que apuntan a PDFs
        $(stryMutAct_9fa48("2774") ? "" : (stryCov_9fa48("2774"), 'a[href$=".pdf"], a[href*=".pdf"]')).each((_, element) => {
          if (stryMutAct_9fa48("2775")) {
            {}
          } else {
            stryCov_9fa48("2775");
            const href = $(element).attr(stryMutAct_9fa48("2776") ? "" : (stryCov_9fa48("2776"), 'href'));
            const text = stryMutAct_9fa48("2779") ? ($(element).text().trim() || $(element).attr('title')) && '' : stryMutAct_9fa48("2778") ? false : stryMutAct_9fa48("2777") ? true : (stryCov_9fa48("2777", "2778", "2779"), (stryMutAct_9fa48("2781") ? $(element).text().trim() && $(element).attr('title') : stryMutAct_9fa48("2780") ? false : (stryCov_9fa48("2780", "2781"), (stryMutAct_9fa48("2782") ? $(element).text() : (stryCov_9fa48("2782"), $(element).text().trim())) || $(element).attr(stryMutAct_9fa48("2783") ? "" : (stryCov_9fa48("2783"), 'title')))) || (stryMutAct_9fa48("2784") ? "Stryker was here!" : (stryCov_9fa48("2784"), '')));
            if (stryMutAct_9fa48("2786") ? false : stryMutAct_9fa48("2785") ? true : (stryCov_9fa48("2785", "2786"), href)) {
              if (stryMutAct_9fa48("2787")) {
                {}
              } else {
                stryCov_9fa48("2787");
                // Convertir URL relativa a absoluta si es necesario
                let absoluteUrl: string;
                try {
                  if (stryMutAct_9fa48("2788")) {
                    {}
                  } else {
                    stryCov_9fa48("2788");
                    absoluteUrl = (stryMutAct_9fa48("2789") ? href.endsWith('http') : (stryCov_9fa48("2789"), href.startsWith(stryMutAct_9fa48("2790") ? "" : (stryCov_9fa48("2790"), 'http')))) ? href : new URL(href, url).toString();
                  }
                } catch {
                  if (stryMutAct_9fa48("2791")) {
                    {}
                  } else {
                    stryCov_9fa48("2791");
                    // Si falla la conversión, usar la URL original
                    absoluteUrl = href;
                  }
                }

                // Intentar extraer información del texto del enlace
                const title = stryMutAct_9fa48("2794") ? (text || href.split('/').pop()) && 'PDF' : stryMutAct_9fa48("2793") ? false : stryMutAct_9fa48("2792") ? true : (stryCov_9fa48("2792", "2793", "2794"), (stryMutAct_9fa48("2796") ? text && href.split('/').pop() : stryMutAct_9fa48("2795") ? false : (stryCov_9fa48("2795", "2796"), text || href.split(stryMutAct_9fa48("2797") ? "" : (stryCov_9fa48("2797"), '/')).pop())) || (stryMutAct_9fa48("2798") ? "" : (stryCov_9fa48("2798"), 'PDF')));
                pdfLinks.push(stryMutAct_9fa48("2799") ? {} : (stryCov_9fa48("2799"), {
                  url: absoluteUrl,
                  title,
                  subject: extractSubjectFromText(title),
                  year: extractYearFromText(title)
                }));
              }
            }
          }
        });
        return pdfLinks;
      }
    } catch (error) {
      if (stryMutAct_9fa48("2800")) {
        {}
      } else {
        stryCov_9fa48("2800");
        // Mejorar mensajes de error
        if (stryMutAct_9fa48("2802") ? false : stryMutAct_9fa48("2801") ? true : (stryCov_9fa48("2801", "2802"), error instanceof Error)) {
          if (stryMutAct_9fa48("2803")) {
            {}
          } else {
            stryCov_9fa48("2803");
            if (stryMutAct_9fa48("2806") ? error.message.includes('timeout') && error.message.includes('tardó demasiado') : stryMutAct_9fa48("2805") ? false : stryMutAct_9fa48("2804") ? true : (stryCov_9fa48("2804", "2805", "2806"), error.message.includes(stryMutAct_9fa48("2807") ? "" : (stryCov_9fa48("2807"), 'timeout')) || error.message.includes(stryMutAct_9fa48("2808") ? "" : (stryCov_9fa48("2808"), 'tardó demasiado')))) {
              if (stryMutAct_9fa48("2809")) {
                {}
              } else {
                stryCov_9fa48("2809");
                throw new Error(stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), 'La petición tardó demasiado. Verifica tu conexión a internet o intenta más tarde.'));
              }
            }
            if (stryMutAct_9fa48("2813") ? (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) && error.message.includes('No se pudo conectar') : stryMutAct_9fa48("2812") ? false : stryMutAct_9fa48("2811") ? true : (stryCov_9fa48("2811", "2812", "2813"), (stryMutAct_9fa48("2815") ? error.message.includes('ENOTFOUND') && error.message.includes('ECONNREFUSED') : stryMutAct_9fa48("2814") ? false : (stryCov_9fa48("2814", "2815"), error.message.includes(stryMutAct_9fa48("2816") ? "" : (stryCov_9fa48("2816"), 'ENOTFOUND')) || error.message.includes(stryMutAct_9fa48("2817") ? "" : (stryCov_9fa48("2817"), 'ECONNREFUSED')))) || error.message.includes(stryMutAct_9fa48("2818") ? "" : (stryCov_9fa48("2818"), 'No se pudo conectar')))) {
              if (stryMutAct_9fa48("2819")) {
                {}
              } else {
                stryCov_9fa48("2819");
                throw new Error(stryMutAct_9fa48("2820") ? "" : (stryCov_9fa48("2820"), 'No se pudo conectar al servidor. Verifica tu conexión a internet.'));
              }
            }
            if (stryMutAct_9fa48("2822") ? false : stryMutAct_9fa48("2821") ? true : (stryCov_9fa48("2821", "2822"), error.message.includes(stryMutAct_9fa48("2823") ? "" : (stryCov_9fa48("2823"), 'Error HTTP')))) {
              if (stryMutAct_9fa48("2824")) {
                {}
              } else {
                stryCov_9fa48("2824");
                throw new Error(stryMutAct_9fa48("2825") ? `` : (stryCov_9fa48("2825"), `Error al acceder a la página: ${error.message}`));
              }
            }
            throw new Error(stryMutAct_9fa48("2826") ? `` : (stryCov_9fa48("2826"), `Error al obtener PDFs: ${error.message}`));
          }
        }
        throw new Error(stryMutAct_9fa48("2827") ? "" : (stryCov_9fa48("2827"), 'Error desconocido al obtener PDFs'));
      }
    }
  }
}

/**
 * Intenta extraer el nombre de la asignatura del texto
 */
function extractSubjectFromText(text: string): string | undefined {
  if (stryMutAct_9fa48("2828")) {
    {}
  } else {
    stryCov_9fa48("2828");
    const textLower = stryMutAct_9fa48("2829") ? text.toUpperCase() : (stryCov_9fa48("2829"), text.toLowerCase());
    const subjectPatterns: Record<string, string> = stryMutAct_9fa48("2830") ? {} : (stryCov_9fa48("2830"), {
      lector: stryMutAct_9fa48("2831") ? "" : (stryCov_9fa48("2831"), 'Competencia Lectora'),
      lectora: stryMutAct_9fa48("2832") ? "" : (stryCov_9fa48("2832"), 'Competencia Lectora'),
      'matemática m1': stryMutAct_9fa48("2833") ? "" : (stryCov_9fa48("2833"), 'Matemática M1'),
      'matemática 1': stryMutAct_9fa48("2834") ? "" : (stryCov_9fa48("2834"), 'Matemática M1'),
      m1: stryMutAct_9fa48("2835") ? "" : (stryCov_9fa48("2835"), 'Matemática M1'),
      'matemática m2': stryMutAct_9fa48("2836") ? "" : (stryCov_9fa48("2836"), 'Matemática M2'),
      'matemática 2': stryMutAct_9fa48("2837") ? "" : (stryCov_9fa48("2837"), 'Matemática M2'),
      m2: stryMutAct_9fa48("2838") ? "" : (stryCov_9fa48("2838"), 'Matemática M2'),
      biología: stryMutAct_9fa48("2839") ? "" : (stryCov_9fa48("2839"), 'Ciencias - Biología'),
      biologia: stryMutAct_9fa48("2840") ? "" : (stryCov_9fa48("2840"), 'Ciencias - Biología'),
      física: stryMutAct_9fa48("2841") ? "" : (stryCov_9fa48("2841"), 'Ciencias - Física'),
      fisica: stryMutAct_9fa48("2842") ? "" : (stryCov_9fa48("2842"), 'Ciencias - Física'),
      química: stryMutAct_9fa48("2843") ? "" : (stryCov_9fa48("2843"), 'Ciencias - Química'),
      quimica: stryMutAct_9fa48("2844") ? "" : (stryCov_9fa48("2844"), 'Ciencias - Química'),
      historia: stryMutAct_9fa48("2845") ? "" : (stryCov_9fa48("2845"), 'Historia y Ciencias Sociales')
    });
    for (const [pattern, subject] of Object.entries(subjectPatterns)) {
      if (stryMutAct_9fa48("2846")) {
        {}
      } else {
        stryCov_9fa48("2846");
        if (stryMutAct_9fa48("2848") ? false : stryMutAct_9fa48("2847") ? true : (stryCov_9fa48("2847", "2848"), textLower.includes(pattern))) {
          if (stryMutAct_9fa48("2849")) {
            {}
          } else {
            stryCov_9fa48("2849");
            return subject;
          }
        }
      }
    }
    return undefined;
  }
}

/**
 * Intenta extraer el año del texto
 */
function extractYearFromText(text: string): string | undefined {
  if (stryMutAct_9fa48("2850")) {
    {}
  } else {
    stryCov_9fa48("2850");
    const yearMatch = text.match(stryMutAct_9fa48("2852") ? /\b(20\D{2})\b/ : stryMutAct_9fa48("2851") ? /\b(20\d)\b/ : (stryCov_9fa48("2851", "2852"), /\b(20\d{2})\b/));
    return yearMatch ? yearMatch[1] : undefined;
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("2853")) {
    {}
  } else {
    stryCov_9fa48("2853");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("2854")) {
        {}
      } else {
        stryCov_9fa48("2854");
        let url: string | undefined;
        try {
          if (stryMutAct_9fa48("2855")) {
            {}
          } else {
            stryCov_9fa48("2855");
            // Verificar autenticación
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("2858") ? false : stryMutAct_9fa48("2857") ? true : stryMutAct_9fa48("2856") ? user : (stryCov_9fa48("2856", "2857", "2858"), !user)) {
              if (stryMutAct_9fa48("2859")) {
                {}
              } else {
                stryCov_9fa48("2859");
                return NextResponse.json(stryMutAct_9fa48("2860") ? {} : (stryCov_9fa48("2860"), {
                  error: stryMutAct_9fa48("2861") ? "" : (stryCov_9fa48("2861"), 'No autorizado')
                }), stryMutAct_9fa48("2862") ? {} : (stryCov_9fa48("2862"), {
                  status: 401
                }));
              }
            }
            const body = await request.json();
            url = body.url;
            if (stryMutAct_9fa48("2865") ? !url && typeof url !== 'string' : stryMutAct_9fa48("2864") ? false : stryMutAct_9fa48("2863") ? true : (stryCov_9fa48("2863", "2864", "2865"), (stryMutAct_9fa48("2866") ? url : (stryCov_9fa48("2866"), !url)) || (stryMutAct_9fa48("2868") ? typeof url === 'string' : stryMutAct_9fa48("2867") ? false : (stryCov_9fa48("2867", "2868"), typeof url !== (stryMutAct_9fa48("2869") ? "" : (stryCov_9fa48("2869"), 'string')))))) {
              if (stryMutAct_9fa48("2870")) {
                {}
              } else {
                stryCov_9fa48("2870");
                return NextResponse.json(stryMutAct_9fa48("2871") ? {} : (stryCov_9fa48("2871"), {
                  error: stryMutAct_9fa48("2872") ? "" : (stryCov_9fa48("2872"), 'URL requerida')
                }), stryMutAct_9fa48("2873") ? {} : (stryCov_9fa48("2873"), {
                  status: 400
                }));
              }
            }

            // Validar que sea una URL válida y de DEMRE
            let urlObj: URL;
            try {
              if (stryMutAct_9fa48("2874")) {
                {}
              } else {
                stryCov_9fa48("2874");
                urlObj = new URL(url);
              }
            } catch {
              if (stryMutAct_9fa48("2875")) {
                {}
              } else {
                stryCov_9fa48("2875");
                return NextResponse.json(stryMutAct_9fa48("2876") ? {} : (stryCov_9fa48("2876"), {
                  error: stryMutAct_9fa48("2877") ? "" : (stryCov_9fa48("2877"), 'URL inválida')
                }), stryMutAct_9fa48("2878") ? {} : (stryCov_9fa48("2878"), {
                  status: 400
                }));
              }
            }

            // Validar que el hostname sea de DEMRE (prevenir SSRF)
            const hostname = stryMutAct_9fa48("2879") ? urlObj.hostname.toUpperCase() : (stryCov_9fa48("2879"), urlObj.hostname.toLowerCase());
            if (stryMutAct_9fa48("2882") ? hostname !== 'demre.cl' || !hostname.endsWith('.demre.cl') : stryMutAct_9fa48("2881") ? false : stryMutAct_9fa48("2880") ? true : (stryCov_9fa48("2880", "2881", "2882"), (stryMutAct_9fa48("2884") ? hostname === 'demre.cl' : stryMutAct_9fa48("2883") ? true : (stryCov_9fa48("2883", "2884"), hostname !== (stryMutAct_9fa48("2885") ? "" : (stryCov_9fa48("2885"), 'demre.cl')))) && (stryMutAct_9fa48("2886") ? hostname.endsWith('.demre.cl') : (stryCov_9fa48("2886"), !(stryMutAct_9fa48("2887") ? hostname.startsWith('.demre.cl') : (stryCov_9fa48("2887"), hostname.endsWith(stryMutAct_9fa48("2888") ? "" : (stryCov_9fa48("2888"), '.demre.cl')))))))) {
              if (stryMutAct_9fa48("2889")) {
                {}
              } else {
                stryCov_9fa48("2889");
                return NextResponse.json(stryMutAct_9fa48("2890") ? {} : (stryCov_9fa48("2890"), {
                  error: stryMutAct_9fa48("2891") ? "" : (stryCov_9fa48("2891"), 'La URL debe ser del sitio oficial de DEMRE (demre.cl)')
                }), stryMutAct_9fa48("2892") ? {} : (stryCov_9fa48("2892"), {
                  status: 400
                }));
              }
            }

            // Solo permitir HTTP y HTTPS
            if (stryMutAct_9fa48("2895") ? urlObj.protocol !== 'http:' || urlObj.protocol !== 'https:' : stryMutAct_9fa48("2894") ? false : stryMutAct_9fa48("2893") ? true : (stryCov_9fa48("2893", "2894", "2895"), (stryMutAct_9fa48("2897") ? urlObj.protocol === 'http:' : stryMutAct_9fa48("2896") ? true : (stryCov_9fa48("2896", "2897"), urlObj.protocol !== (stryMutAct_9fa48("2898") ? "" : (stryCov_9fa48("2898"), 'http:')))) && (stryMutAct_9fa48("2900") ? urlObj.protocol === 'https:' : stryMutAct_9fa48("2899") ? true : (stryCov_9fa48("2899", "2900"), urlObj.protocol !== (stryMutAct_9fa48("2901") ? "" : (stryCov_9fa48("2901"), 'https:')))))) {
              if (stryMutAct_9fa48("2902")) {
                {}
              } else {
                stryCov_9fa48("2902");
                return NextResponse.json(stryMutAct_9fa48("2903") ? {} : (stryCov_9fa48("2903"), {
                  error: stryMutAct_9fa48("2904") ? "" : (stryCov_9fa48("2904"), 'Solo se permiten URLs HTTP/HTTPS')
                }), stryMutAct_9fa48("2905") ? {} : (stryCov_9fa48("2905"), {
                  status: 400
                }));
              }
            }

            // Extraer enlaces a PDFs
            const pdfLinks = await extractPDFLinksFromPage(url);
            return NextResponse.json(stryMutAct_9fa48("2906") ? {} : (stryCov_9fa48("2906"), {
              success: stryMutAct_9fa48("2907") ? false : (stryCov_9fa48("2907"), true),
              pdfs: pdfLinks,
              count: pdfLinks.length
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("2908")) {
            {}
          } else {
            stryCov_9fa48("2908");
            // Log del error para debugging
            logger.error(stryMutAct_9fa48("2909") ? {} : (stryCov_9fa48("2909"), {
              type: stryMutAct_9fa48("2910") ? "" : (stryCov_9fa48("2910"), 'fetch_demre_pdfs_error'),
              error: error instanceof Error ? error.message : String(error),
              stack: error instanceof Error ? error.stack : undefined,
              url: stryMutAct_9fa48("2913") ? url && 'unknown' : stryMutAct_9fa48("2912") ? false : stryMutAct_9fa48("2911") ? true : (stryCov_9fa48("2911", "2912", "2913"), url || (stryMutAct_9fa48("2914") ? "" : (stryCov_9fa48("2914"), 'unknown')))
            }), stryMutAct_9fa48("2915") ? "" : (stryCov_9fa48("2915"), 'Error en fetch-demre-pdfs'));

            // Proporcionar mensaje de error más detallado
            let errorMessage = stryMutAct_9fa48("2916") ? "" : (stryCov_9fa48("2916"), 'Error desconocido');
            if (stryMutAct_9fa48("2918") ? false : stryMutAct_9fa48("2917") ? true : (stryCov_9fa48("2917", "2918"), error instanceof Error)) {
              if (stryMutAct_9fa48("2919")) {
                {}
              } else {
                stryCov_9fa48("2919");
                errorMessage = error.message;
              }
            } else if (stryMutAct_9fa48("2922") ? typeof error !== 'string' : stryMutAct_9fa48("2921") ? false : stryMutAct_9fa48("2920") ? true : (stryCov_9fa48("2920", "2921", "2922"), typeof error === (stryMutAct_9fa48("2923") ? "" : (stryCov_9fa48("2923"), 'string')))) {
              if (stryMutAct_9fa48("2924")) {
                {}
              } else {
                stryCov_9fa48("2924");
                errorMessage = error;
              }
            }
            return NextResponse.json(stryMutAct_9fa48("2925") ? {} : (stryCov_9fa48("2925"), {
              error: stryMutAct_9fa48("2926") ? "" : (stryCov_9fa48("2926"), 'Error al obtener PDFs'),
              details: errorMessage
            }), stryMutAct_9fa48("2927") ? {} : (stryCov_9fa48("2927"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("2928") ? "" : (stryCov_9fa48("2928"), 'read'));
  }
}