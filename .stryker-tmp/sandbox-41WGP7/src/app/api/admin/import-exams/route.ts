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
import { validateBody } from '@/lib/api-helpers';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import axios from 'axios';
export const runtime = stryMutAct_9fa48("3565") ? "" : (stryCov_9fa48("3565"), 'nodejs');

// Importación de pdf-parse v2
// La versión 2 usa una clase PDFParse en lugar de una función directa
const {
  PDFParse
} = require('pdf-parse');

// Schema de validación
const examImportSchema = z.object(stryMutAct_9fa48("3566") ? {} : (stryCov_9fa48("3566"), {
  pdfUrl: z.string().url().optional(),
  pdfFile: z.custom<File>(stryMutAct_9fa48("3567") ? () => undefined : (stryCov_9fa48("3567"), val => val instanceof File)).optional(),
  // File object from FormData
  inputType: z.enum(stryMutAct_9fa48("3568") ? [] : (stryCov_9fa48("3568"), [stryMutAct_9fa48("3569") ? "" : (stryCov_9fa48("3569"), 'url'), stryMutAct_9fa48("3570") ? "" : (stryCov_9fa48("3570"), 'file')])),
  subjectName: stryMutAct_9fa48("3571") ? z.string().max(1) : (stryCov_9fa48("3571"), z.string().min(1)),
  examTitle: stryMutAct_9fa48("3572") ? z.string().max(1) : (stryCov_9fa48("3572"), z.string().min(1)),
  examType: z.string(),
  year: z.string()
})).refine(data => {
  if (stryMutAct_9fa48("3573")) {
    {}
  } else {
    stryCov_9fa48("3573");
    // Debe tener URL o archivo según el tipo
    if (stryMutAct_9fa48("3576") ? data.inputType !== 'url' : stryMutAct_9fa48("3575") ? false : stryMutAct_9fa48("3574") ? true : (stryCov_9fa48("3574", "3575", "3576"), data.inputType === (stryMutAct_9fa48("3577") ? "" : (stryCov_9fa48("3577"), 'url')))) {
      if (stryMutAct_9fa48("3578")) {
        {}
      } else {
        stryCov_9fa48("3578");
        return stryMutAct_9fa48("3579") ? !data.pdfUrl : (stryCov_9fa48("3579"), !(stryMutAct_9fa48("3580") ? data.pdfUrl : (stryCov_9fa48("3580"), !data.pdfUrl)));
      }
    } else {
      if (stryMutAct_9fa48("3581")) {
        {}
      } else {
        stryCov_9fa48("3581");
        return stryMutAct_9fa48("3582") ? !data.pdfFile : (stryCov_9fa48("3582"), !(stryMutAct_9fa48("3583") ? data.pdfFile : (stryCov_9fa48("3583"), !data.pdfFile)));
      }
    }
  }
}, stryMutAct_9fa48("3584") ? {} : (stryCov_9fa48("3584"), {
  message: stryMutAct_9fa48("3585") ? "" : (stryCov_9fa48("3585"), 'Debe proporcionar URL o archivo según el tipo seleccionado')
}));
const importExamsSchema = z.object(stryMutAct_9fa48("3586") ? {} : (stryCov_9fa48("3586"), {
  exams: stryMutAct_9fa48("3587") ? z.array(examImportSchema).max(1) : (stryCov_9fa48("3587"), z.array(examImportSchema).min(1))
}));

// Mapeo de asignaturas
const SUBJECT_MAPPING: Record<string, string> = stryMutAct_9fa48("3588") ? {} : (stryCov_9fa48("3588"), {
  'Competencia Lectora': stryMutAct_9fa48("3589") ? "" : (stryCov_9fa48("3589"), 'LECTORA'),
  'Matemática M1': stryMutAct_9fa48("3590") ? "" : (stryCov_9fa48("3590"), 'M1'),
  'Matemática M2': stryMutAct_9fa48("3591") ? "" : (stryCov_9fa48("3591"), 'M2'),
  'Ciencias - Biología': stryMutAct_9fa48("3592") ? "" : (stryCov_9fa48("3592"), 'BIO'),
  'Ciencias - Física': stryMutAct_9fa48("3593") ? "" : (stryCov_9fa48("3593"), 'FIS'),
  'Ciencias - Química': stryMutAct_9fa48("3594") ? "" : (stryCov_9fa48("3594"), 'QUI'),
  'Historia y Ciencias Sociales': stryMutAct_9fa48("3595") ? "" : (stryCov_9fa48("3595"), 'HIST')
});

// Directorios
const PDFS_DIR = path.join(process.cwd(), stryMutAct_9fa48("3596") ? "" : (stryCov_9fa48("3596"), 'data'), stryMutAct_9fa48("3597") ? "" : (stryCov_9fa48("3597"), 'pdfs'));
async function ensureDirectories() {
  if (stryMutAct_9fa48("3598")) {
    {}
  } else {
    stryCov_9fa48("3598");
    await fs.mkdir(PDFS_DIR, stryMutAct_9fa48("3599") ? {} : (stryCov_9fa48("3599"), {
      recursive: stryMutAct_9fa48("3600") ? false : (stryCov_9fa48("3600"), true)
    }));
  }
}

/**
 * Descarga un archivo desde una URL usando método tolerante con headers mal formateados
 * El servidor de DEMRE envía headers HTTP mal formateados, así que usamos módulos nativos
 * con manejo de errores que permite continuar incluso con errores de parsing
 */
async function downloadFile(url: string, dest: string): Promise<void> {
  if (stryMutAct_9fa48("3601")) {
    {}
  } else {
    stryCov_9fa48("3601");
    // Usar directamente el método alternativo que es más tolerante
    // ya que sabemos que DEMRE tiene problemas con headers
    return downloadFileAlternative(url, dest);
  }
}

/**
 * Método alternativo usando módulos nativos con manejo de errores mejorado
 * Intenta leer los datos incluso si hay errores de parsing de headers
 * Usa un enfoque más permisivo que ignora errores de parsing si hay datos
 */
function downloadFileAlternative(url: string, dest: string): Promise<void> {
  if (stryMutAct_9fa48("3602")) {
    {}
  } else {
    stryCov_9fa48("3602");
    return new Promise((resolve, reject) => {
      if (stryMutAct_9fa48("3603")) {
        {}
      } else {
        stryCov_9fa48("3603");
        const urlObj = new URL(url);
        const protocol = (stryMutAct_9fa48("3606") ? urlObj.protocol !== 'https:' : stryMutAct_9fa48("3605") ? false : stryMutAct_9fa48("3604") ? true : (stryCov_9fa48("3604", "3605", "3606"), urlObj.protocol === (stryMutAct_9fa48("3607") ? "" : (stryCov_9fa48("3607"), 'https:')))) ? https : http;
        const file = fsSync.createWriteStream(dest);
        let dataReceived = stryMutAct_9fa48("3608") ? true : (stryCov_9fa48("3608"), false);
        let hasError = stryMutAct_9fa48("3609") ? true : (stryCov_9fa48("3609"), false);
        let responseStarted = stryMutAct_9fa48("3610") ? true : (stryCov_9fa48("3610"), false);
        const options: https.RequestOptions = stryMutAct_9fa48("3611") ? {} : (stryCov_9fa48("3611"), {
          hostname: urlObj.hostname,
          port: urlObj.port ? parseInt(urlObj.port, 10) : (stryMutAct_9fa48("3614") ? urlObj.protocol !== 'https:' : stryMutAct_9fa48("3613") ? false : stryMutAct_9fa48("3612") ? true : (stryCov_9fa48("3612", "3613", "3614"), urlObj.protocol === (stryMutAct_9fa48("3615") ? "" : (stryCov_9fa48("3615"), 'https:')))) ? 443 : 80,
          path: stryMutAct_9fa48("3616") ? urlObj.pathname - urlObj.search : (stryCov_9fa48("3616"), urlObj.pathname + urlObj.search),
          method: stryMutAct_9fa48("3617") ? "" : (stryCov_9fa48("3617"), 'GET'),
          headers: stryMutAct_9fa48("3618") ? {} : (stryCov_9fa48("3618"), {
            'User-Agent': stryMutAct_9fa48("3619") ? "" : (stryCov_9fa48("3619"), 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
          }),
          timeout: 30000,
          rejectUnauthorized: stryMutAct_9fa48("3622") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("3621") ? false : stryMutAct_9fa48("3620") ? true : (stryCov_9fa48("3620", "3621", "3622"), process.env.NODE_ENV === (stryMutAct_9fa48("3623") ? "" : (stryCov_9fa48("3623"), 'production'))) // Solo deshabilitar en desarrollo
        });
        const req = protocol.request(options);

        // Capturar errores de parsing pero intentar continuar
        req.on(stryMutAct_9fa48("3624") ? "" : (stryCov_9fa48("3624"), 'response'), (response: http.IncomingMessage) => {
          if (stryMutAct_9fa48("3625")) {
            {}
          } else {
            stryCov_9fa48("3625");
            responseStarted = stryMutAct_9fa48("3626") ? false : (stryCov_9fa48("3626"), true);

            // Manejar redirecciones
            if (stryMutAct_9fa48("3629") ? response.statusCode === 301 && response.statusCode === 302 : stryMutAct_9fa48("3628") ? false : stryMutAct_9fa48("3627") ? true : (stryCov_9fa48("3627", "3628", "3629"), (stryMutAct_9fa48("3631") ? response.statusCode !== 301 : stryMutAct_9fa48("3630") ? false : (stryCov_9fa48("3630", "3631"), response.statusCode === 301)) || (stryMutAct_9fa48("3633") ? response.statusCode !== 302 : stryMutAct_9fa48("3632") ? false : (stryCov_9fa48("3632", "3633"), response.statusCode === 302)))) {
              if (stryMutAct_9fa48("3634")) {
                {}
              } else {
                stryCov_9fa48("3634");
                const location = response.headers.location;
                if (stryMutAct_9fa48("3636") ? false : stryMutAct_9fa48("3635") ? true : (stryCov_9fa48("3635", "3636"), location)) {
                  if (stryMutAct_9fa48("3637")) {
                    {}
                  } else {
                    stryCov_9fa48("3637");
                    const redirectUrl = (stryMutAct_9fa48("3638") ? location.endsWith('http') : (stryCov_9fa48("3638"), location.startsWith(stryMutAct_9fa48("3639") ? "" : (stryCov_9fa48("3639"), 'http')))) ? location : new URL(location, url).toString();
                    file.close();
                    try {
                      if (stryMutAct_9fa48("3640")) {
                        {}
                      } else {
                        stryCov_9fa48("3640");
                        fsSync.unlinkSync(dest);
                      }
                    } catch {
                      // Ignorar errores al eliminar
                    }
                    return downloadFileAlternative(redirectUrl, dest).then(resolve).catch(reject);
                  }
                }
              }
            }
            if (stryMutAct_9fa48("3643") ? response.statusCode === 200 : stryMutAct_9fa48("3642") ? false : stryMutAct_9fa48("3641") ? true : (stryCov_9fa48("3641", "3642", "3643"), response.statusCode !== 200)) {
              if (stryMutAct_9fa48("3644")) {
                {}
              } else {
                stryCov_9fa48("3644");
                file.close();
                try {
                  if (stryMutAct_9fa48("3645")) {
                    {}
                  } else {
                    stryCov_9fa48("3645");
                    fsSync.unlinkSync(dest);
                  }
                } catch {
                  // Ignorar errores al eliminar
                }
                reject(new Error(stryMutAct_9fa48("3646") ? `` : (stryCov_9fa48("3646"), `Error descargando: ${response.statusCode}`)));
                return;
              }
            }

            // Pipe normal
            response.pipe(file);
            dataReceived = stryMutAct_9fa48("3647") ? false : (stryCov_9fa48("3647"), true);
            file.on(stryMutAct_9fa48("3648") ? "" : (stryCov_9fa48("3648"), 'finish'), () => {
              if (stryMutAct_9fa48("3649")) {
                {}
              } else {
                stryCov_9fa48("3649");
                file.close();
                resolve();
              }
            });
            file.on(stryMutAct_9fa48("3650") ? "" : (stryCov_9fa48("3650"), 'error'), err => {
              if (stryMutAct_9fa48("3651")) {
                {}
              } else {
                stryCov_9fa48("3651");
                hasError = stryMutAct_9fa48("3652") ? false : (stryCov_9fa48("3652"), true);
                try {
                  if (stryMutAct_9fa48("3653")) {
                    {}
                  } else {
                    stryCov_9fa48("3653");
                    fsSync.unlinkSync(dest);
                  }
                } catch {
                  // Ignorar errores al eliminar
                }
                reject(err);
              }
            });
            response.on(stryMutAct_9fa48("3654") ? "" : (stryCov_9fa48("3654"), 'end'), () => {
              if (stryMutAct_9fa48("3655")) {
                {}
              } else {
                stryCov_9fa48("3655");
                if (stryMutAct_9fa48("3658") ? false : stryMutAct_9fa48("3657") ? true : stryMutAct_9fa48("3656") ? hasError : (stryCov_9fa48("3656", "3657", "3658"), !hasError)) {
                  if (stryMutAct_9fa48("3659")) {
                    {}
                  } else {
                    stryCov_9fa48("3659");
                    file.close();
                    resolve();
                  }
                }
              }
            });
            response.on(stryMutAct_9fa48("3660") ? "" : (stryCov_9fa48("3660"), 'data'), () => {
              if (stryMutAct_9fa48("3661")) {
                {}
              } else {
                stryCov_9fa48("3661");
                dataReceived = stryMutAct_9fa48("3662") ? false : (stryCov_9fa48("3662"), true);
              }
            });
          }
        });

        // Manejar errores - si es error de parsing pero hay datos, verificar archivo
        req.on(stryMutAct_9fa48("3663") ? "" : (stryCov_9fa48("3663"), 'error'), (err: Error) => {
          if (stryMutAct_9fa48("3664")) {
            {}
          } else {
            stryCov_9fa48("3664");
            // Si es error de parsing, esperar un momento y verificar si se recibieron datos
            if (stryMutAct_9fa48("3667") ? err.message.includes('Parse Error') && err.message.includes('CR after header') : stryMutAct_9fa48("3666") ? false : stryMutAct_9fa48("3665") ? true : (stryCov_9fa48("3665", "3666", "3667"), err.message.includes(stryMutAct_9fa48("3668") ? "" : (stryCov_9fa48("3668"), 'Parse Error')) || err.message.includes(stryMutAct_9fa48("3669") ? "" : (stryCov_9fa48("3669"), 'CR after header')))) {
              if (stryMutAct_9fa48("3670")) {
                {}
              } else {
                stryCov_9fa48("3670");
                setTimeout(() => {
                  if (stryMutAct_9fa48("3671")) {
                    {}
                  } else {
                    stryCov_9fa48("3671");
                    try {
                      if (stryMutAct_9fa48("3672")) {
                        {}
                      } else {
                        stryCov_9fa48("3672");
                        const stats = fsSync.statSync(dest);
                        if (stryMutAct_9fa48("3676") ? stats.size <= 1000 : stryMutAct_9fa48("3675") ? stats.size >= 1000 : stryMutAct_9fa48("3674") ? false : stryMutAct_9fa48("3673") ? true : (stryCov_9fa48("3673", "3674", "3675", "3676"), stats.size > 1000)) {
                          if (stryMutAct_9fa48("3677")) {
                            {}
                          } else {
                            stryCov_9fa48("3677");
                            // Si tiene más de 1KB, probablemente está bien
                            file.close();
                            resolve();
                          }
                        } else if (stryMutAct_9fa48("3680") ? responseStarted || dataReceived : stryMutAct_9fa48("3679") ? false : stryMutAct_9fa48("3678") ? true : (stryCov_9fa48("3678", "3679", "3680"), responseStarted && dataReceived)) {
                          if (stryMutAct_9fa48("3681")) {
                            {}
                          } else {
                            stryCov_9fa48("3681");
                            // Si la respuesta había empezado y recibimos datos, considerar exitoso
                            file.close();
                            resolve();
                          }
                        } else {
                          if (stryMutAct_9fa48("3682")) {
                            {}
                          } else {
                            stryCov_9fa48("3682");
                            file.close();
                            try {
                              if (stryMutAct_9fa48("3683")) {
                                {}
                              } else {
                                stryCov_9fa48("3683");
                                fsSync.unlinkSync(dest);
                              }
                            } catch {
                              // Ignorar errores al eliminar
                            }
                            // Intentar con curl si está disponible, o rechazar
                            reject(new Error(stryMutAct_9fa48("3684") ? `` : (stryCov_9fa48("3684"), `Error al descargar PDF: El servidor de DEMRE tiene headers mal formateados. Intenta descargar el PDF manualmente y subirlo.`)));
                          }
                        }
                      }
                    } catch {
                      if (stryMutAct_9fa48("3685")) {
                        {}
                      } else {
                        stryCov_9fa48("3685");
                        file.close();
                        try {
                          if (stryMutAct_9fa48("3686")) {
                            {}
                          } else {
                            stryCov_9fa48("3686");
                            fsSync.unlinkSync(dest);
                          }
                        } catch {
                          // Ignorar errores al eliminar
                        }
                        reject(new Error(stryMutAct_9fa48("3687") ? `` : (stryCov_9fa48("3687"), `Error al descargar PDF: ${err.message}. Intenta descargar el PDF manualmente desde ${url}`)));
                      }
                    }
                  }
                }, 1000); // Esperar 1 segundo para que los datos se escriban
              }
            } else {
              if (stryMutAct_9fa48("3688")) {
                {}
              } else {
                stryCov_9fa48("3688");
                hasError = stryMutAct_9fa48("3689") ? false : (stryCov_9fa48("3689"), true);
                file.close();
                try {
                  if (stryMutAct_9fa48("3690")) {
                    {}
                  } else {
                    stryCov_9fa48("3690");
                    fsSync.unlinkSync(dest);
                  }
                } catch {
                  // Ignorar errores al eliminar
                }
                reject(err);
              }
            }
          }
        });
        req.on(stryMutAct_9fa48("3691") ? "" : (stryCov_9fa48("3691"), 'timeout'), () => {
          if (stryMutAct_9fa48("3692")) {
            {}
          } else {
            stryCov_9fa48("3692");
            req.destroy();
            hasError = stryMutAct_9fa48("3693") ? false : (stryCov_9fa48("3693"), true);
            file.close();
            try {
              if (stryMutAct_9fa48("3694")) {
                {}
              } else {
                stryCov_9fa48("3694");
                fsSync.unlinkSync(dest);
              }
            } catch {
              // Ignorar errores al eliminar
            }
            reject(new Error(stryMutAct_9fa48("3695") ? "" : (stryCov_9fa48("3695"), 'La descarga tardó demasiado')));
          }
        });
        req.end();
      }
    });
  }
}
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  if (stryMutAct_9fa48("3696")) {
    {}
  } else {
    stryCov_9fa48("3696");
    const dataBuffer = await fs.readFile(pdfPath);
    try {
      if (stryMutAct_9fa48("3697")) {
        {}
      } else {
        stryCov_9fa48("3697");
        // pdf-parse v2: usar la clase PDFParse
        const parser = new PDFParse(stryMutAct_9fa48("3698") ? {} : (stryCov_9fa48("3698"), {
          data: dataBuffer
        }));
        await parser.load();
        const result = await parser.getText();
        return result.text;
      }
    } catch (error) {
      if (stryMutAct_9fa48("3699")) {
        {}
      } else {
        stryCov_9fa48("3699");
        throw new Error(stryMutAct_9fa48("3700") ? `` : (stryCov_9fa48("3700"), `Error al parsear PDF: ${error instanceof Error ? error.message : stryMutAct_9fa48("3701") ? "" : (stryCov_9fa48("3701"), 'Error desconocido')}`));
      }
    }
  }
}

/**
 * Detecta las respuestas correctas desde el texto del PDF
 * Busca patrones comunes como "1-A", "1. A", "Respuestas: 1-A, 2-B..."
 * @param text Texto completo del PDF
 * @returns Mapa de número de pregunta -> letra de respuesta correcta
 */
function detectCorrectAnswers(text: string): Map<number, string> {
  if (stryMutAct_9fa48("3702")) {
    {}
  } else {
    stryCov_9fa48("3702");
    const answerMap = new Map<number, string>();

    // Normalizar el texto
    const normalizedText = stryMutAct_9fa48("3703") ? text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toLowerCase() : (stryCov_9fa48("3703"), text.replace(/\r\n/g, stryMutAct_9fa48("3704") ? "" : (stryCov_9fa48("3704"), '\n')).replace(/\r/g, stryMutAct_9fa48("3705") ? "" : (stryCov_9fa48("3705"), '\n')).toUpperCase());

    // Buscar sección de respuestas (típicamente al final del documento)
    // Patrones comunes: "RESPUESTAS", "CLAVE DE RESPUESTAS", "RESPUESTAS CORRECTAS"
    const answerSectionPatterns = stryMutAct_9fa48("3706") ? [] : (stryCov_9fa48("3706"), [stryMutAct_9fa48("3718") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3717") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3716") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3715") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3714") ? /RESPUESTAS?[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3713") ? /RESPUESTAS?[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3712") ? /RESPUESTAS?[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3711") ? /RESPUESTAS?[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3710") ? /RESPUESTAS?[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3709") ? /RESPUESTAS?[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3708") ? /RESPUESTAS?[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3707") ? /RESPUESTAS[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3707", "3708", "3709", "3710", "3711", "3712", "3713", "3714", "3715", "3716", "3717", "3718"), /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i), stryMutAct_9fa48("3734") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3733") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3732") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3731") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3730") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3729") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3728") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3727") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3726") ? /CLAVE\s+DE\s+RESPUESTAS?[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3725") ? /CLAVE\s+DE\s+RESPUESTAS?[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3724") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3723") ? /CLAVE\s+DE\s+RESPUESTAS[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3722") ? /CLAVE\s+DE\S+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3721") ? /CLAVE\s+DE\sRESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3720") ? /CLAVE\S+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3719") ? /CLAVE\sDE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3719", "3720", "3721", "3722", "3723", "3724", "3725", "3726", "3727", "3728", "3729", "3730", "3731", "3732", "3733", "3734"), /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i), stryMutAct_9fa48("3749") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3748") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3747") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3746") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3745") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3744") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3743") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3742") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3741") ? /RESPUESTAS?\s+CORRECTAS?[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3740") ? /RESPUESTAS?\s+CORRECTAS?[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3739") ? /RESPUESTAS?\s+CORRECTAS?[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3738") ? /RESPUESTAS?\s+CORRECTAS[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3737") ? /RESPUESTAS?\S+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3736") ? /RESPUESTAS?\sCORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3735") ? /RESPUESTAS\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3735", "3736", "3737", "3738", "3739", "3740", "3741", "3742", "3743", "3744", "3745", "3746", "3747", "3748", "3749"), /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i)]);
    let answerSection = stryMutAct_9fa48("3750") ? "Stryker was here!" : (stryCov_9fa48("3750"), '');
    for (const pattern of answerSectionPatterns) {
      if (stryMutAct_9fa48("3751")) {
        {}
      } else {
        stryCov_9fa48("3751");
        const match = normalizedText.match(pattern);
        if (stryMutAct_9fa48("3754") ? match || match[1] : stryMutAct_9fa48("3753") ? false : stryMutAct_9fa48("3752") ? true : (stryCov_9fa48("3752", "3753", "3754"), match && match[1])) {
          if (stryMutAct_9fa48("3755")) {
            {}
          } else {
            stryCov_9fa48("3755");
            answerSection = match[1];
            break;
          }
        }
      }
    }

    // Si no se encuentra una sección específica, buscar en el último 30% del texto
    // (las respuestas suelen estar al final)
    if (stryMutAct_9fa48("3758") ? false : stryMutAct_9fa48("3757") ? true : stryMutAct_9fa48("3756") ? answerSection : (stryCov_9fa48("3756", "3757", "3758"), !answerSection)) {
      if (stryMutAct_9fa48("3759")) {
        {}
      } else {
        stryCov_9fa48("3759");
        const textLength = normalizedText.length;
        const lastSection = stryMutAct_9fa48("3760") ? normalizedText : (stryCov_9fa48("3760"), normalizedText.substring(Math.floor(stryMutAct_9fa48("3761") ? textLength / 0.7 : (stryCov_9fa48("3761"), textLength * 0.7))));
        answerSection = lastSection;
      }
    }

    // Múltiples patrones para detectar respuestas
    const answerPatterns = stryMutAct_9fa48("3762") ? [] : (stryCov_9fa48("3762"), [// Formato: "1-A", "1-A,", "1-A ", "1 - A"
    stryMutAct_9fa48("3768") ? /(\d+)[\s\-\.\)]+([^A-E])/g : stryMutAct_9fa48("3767") ? /(\d+)[\S\-\.\)]+([A-E])/g : stryMutAct_9fa48("3766") ? /(\d+)[^\s\-\.\)]+([A-E])/g : stryMutAct_9fa48("3765") ? /(\d+)[\s\-\.\)]([A-E])/g : stryMutAct_9fa48("3764") ? /(\D+)[\s\-\.\)]+([A-E])/g : stryMutAct_9fa48("3763") ? /(\d)[\s\-\.\)]+([A-E])/g : (stryCov_9fa48("3763", "3764", "3765", "3766", "3767", "3768"), /(\d+)[\s\-\.\)]+([A-E])/g), // Formato: "1. A", "1) A"
    stryMutAct_9fa48("3774") ? /(\d+)[\.\)]\s*([^A-E])/g : stryMutAct_9fa48("3773") ? /(\d+)[\.\)]\S*([A-E])/g : stryMutAct_9fa48("3772") ? /(\d+)[\.\)]\s([A-E])/g : stryMutAct_9fa48("3771") ? /(\d+)[^\.\)]\s*([A-E])/g : stryMutAct_9fa48("3770") ? /(\D+)[\.\)]\s*([A-E])/g : stryMutAct_9fa48("3769") ? /(\d)[\.\)]\s*([A-E])/g : (stryCov_9fa48("3769", "3770", "3771", "3772", "3773", "3774"), /(\d+)[\.\)]\s*([A-E])/g), // Formato: "1 A" (con espacio)
    stryMutAct_9fa48("3782") ? /(\d+)\s+([A-E])(?=\S|,|$)/g : stryMutAct_9fa48("3781") ? /(\d+)\s+([A-E])(?=\s|,)/g : stryMutAct_9fa48("3780") ? /(\d+)\s+([A-E])(?!\s|,|$)/g : stryMutAct_9fa48("3779") ? /(\d+)\s+([^A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3778") ? /(\d+)\S+([A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3777") ? /(\d+)\s([A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3776") ? /(\D+)\s+([A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3775") ? /(\d)\s+([A-E])(?=\s|,|$)/g : (stryCov_9fa48("3775", "3776", "3777", "3778", "3779", "3780", "3781", "3782"), /(\d+)\s+([A-E])(?=\s|,|$)/g), // Formato en lista: "1) A", "2) B"
    stryMutAct_9fa48("3788") ? /^(\d+)\)\s*([^A-E])/gm : stryMutAct_9fa48("3787") ? /^(\d+)\)\S*([A-E])/gm : stryMutAct_9fa48("3786") ? /^(\d+)\)\s([A-E])/gm : stryMutAct_9fa48("3785") ? /^(\D+)\)\s*([A-E])/gm : stryMutAct_9fa48("3784") ? /^(\d)\)\s*([A-E])/gm : stryMutAct_9fa48("3783") ? /(\d+)\)\s*([A-E])/gm : (stryCov_9fa48("3783", "3784", "3785", "3786", "3787", "3788"), /^(\d+)\)\s*([A-E])/gm)]);
    for (const pattern of answerPatterns) {
      if (stryMutAct_9fa48("3789")) {
        {}
      } else {
        stryCov_9fa48("3789");
        const matches = Array.from(answerSection.matchAll(pattern));
        for (const match of matches) {
          if (stryMutAct_9fa48("3790")) {
            {}
          } else {
            stryCov_9fa48("3790");
            const questionNum = parseInt(match[1], 10);
            const answerLetter = stryMutAct_9fa48("3791") ? match[2].toLowerCase() : (stryCov_9fa48("3791"), match[2].toUpperCase());

            // Validar que la letra esté en el rango A-E
            if (stryMutAct_9fa48("3794") ? questionNum > 0 && questionNum <= 100 || /^[A-E]$/.test(answerLetter) : stryMutAct_9fa48("3793") ? false : stryMutAct_9fa48("3792") ? true : (stryCov_9fa48("3792", "3793", "3794"), (stryMutAct_9fa48("3796") ? questionNum > 0 || questionNum <= 100 : stryMutAct_9fa48("3795") ? true : (stryCov_9fa48("3795", "3796"), (stryMutAct_9fa48("3799") ? questionNum <= 0 : stryMutAct_9fa48("3798") ? questionNum >= 0 : stryMutAct_9fa48("3797") ? true : (stryCov_9fa48("3797", "3798", "3799"), questionNum > 0)) && (stryMutAct_9fa48("3802") ? questionNum > 100 : stryMutAct_9fa48("3801") ? questionNum < 100 : stryMutAct_9fa48("3800") ? true : (stryCov_9fa48("3800", "3801", "3802"), questionNum <= 100)))) && (stryMutAct_9fa48("3805") ? /^[^A-E]$/ : stryMutAct_9fa48("3804") ? /^[A-E]/ : stryMutAct_9fa48("3803") ? /[A-E]$/ : (stryCov_9fa48("3803", "3804", "3805"), /^[A-E]$/)).test(answerLetter))) {
              if (stryMutAct_9fa48("3806")) {
                {}
              } else {
                stryCov_9fa48("3806");
                // Si ya existe una respuesta para esta pregunta, mantener la primera encontrada
                if (stryMutAct_9fa48("3809") ? false : stryMutAct_9fa48("3808") ? true : stryMutAct_9fa48("3807") ? answerMap.has(questionNum) : (stryCov_9fa48("3807", "3808", "3809"), !answerMap.has(questionNum))) {
                  if (stryMutAct_9fa48("3810")) {
                    {}
                  } else {
                    stryCov_9fa48("3810");
                    answerMap.set(questionNum, answerLetter);
                  }
                }
              }
            }
          }
        }
      }
    }
    return answerMap;
  }
}
function parseQuestionsFromText(text: string): Array<{
  enunciado: string;
  options: Array<{
    letra: string;
    texto: string;
    esCorrecta: boolean;
  }>;
  dificultad: number;
  explicacion: string;
  fuente: string;
}> {
  if (stryMutAct_9fa48("3811")) {
    {}
  } else {
    stryCov_9fa48("3811");
    const questions: Array<{
      enunciado: string;
      options: Array<{
        letra: string;
        texto: string;
        esCorrecta: boolean;
      }>;
      dificultad: number;
      explicacion: string;
      fuente: string;
    }> = stryMutAct_9fa48("3812") ? ["Stryker was here"] : (stryCov_9fa48("3812"), []);

    // Normalizar el texto: eliminar espacios múltiples y normalizar saltos de línea
    const normalizedText = text.replace(/\r\n/g, stryMutAct_9fa48("3813") ? "" : (stryCov_9fa48("3813"), '\n')).replace(/\r/g, stryMutAct_9fa48("3814") ? "" : (stryCov_9fa48("3814"), '\n')).replace(stryMutAct_9fa48("3815") ? /\n/g : (stryCov_9fa48("3815"), /\n{3,}/g), stryMutAct_9fa48("3816") ? "" : (stryCov_9fa48("3816"), '\n\n')).replace(stryMutAct_9fa48("3818") ? /[^ \t]+/g : stryMutAct_9fa48("3817") ? /[ \t]/g : (stryCov_9fa48("3817", "3818"), /[ \t]+/g), stryMutAct_9fa48("3819") ? "" : (stryCov_9fa48("3819"), ' '));

    // Múltiples patrones para encontrar preguntas (diferentes formatos posibles)
    const questionPatterns = stryMutAct_9fa48("3820") ? [] : (stryCov_9fa48("3820"), [// Formato estándar: "1. Pregunta..." (más flexible con espacios)
    stryMutAct_9fa48("3833") ? /(\d+)\.\s*([\s\S]+?)(?=\d+\.\S|$)/g : stryMutAct_9fa48("3832") ? /(\d+)\.\s*([\s\S]+?)(?=\D+\.\s|$)/g : stryMutAct_9fa48("3831") ? /(\d+)\.\s*([\s\S]+?)(?=\d\.\s|$)/g : stryMutAct_9fa48("3830") ? /(\d+)\.\s*([\s\S]+?)(?=\d+\.\s)/g : stryMutAct_9fa48("3829") ? /(\d+)\.\s*([\s\S]+?)(?!\d+\.\s|$)/g : stryMutAct_9fa48("3828") ? /(\d+)\.\s*([\s\s]+?)(?=\d+\.\s|$)/g : stryMutAct_9fa48("3827") ? /(\d+)\.\s*([\S\S]+?)(?=\d+\.\s|$)/g : stryMutAct_9fa48("3826") ? /(\d+)\.\s*([^\s\S]+?)(?=\d+\.\s|$)/g : stryMutAct_9fa48("3825") ? /(\d+)\.\s*([\s\S])(?=\d+\.\s|$)/g : stryMutAct_9fa48("3824") ? /(\d+)\.\S*([\s\S]+?)(?=\d+\.\s|$)/g : stryMutAct_9fa48("3823") ? /(\d+)\.\s([\s\S]+?)(?=\d+\.\s|$)/g : stryMutAct_9fa48("3822") ? /(\D+)\.\s*([\s\S]+?)(?=\d+\.\s|$)/g : stryMutAct_9fa48("3821") ? /(\d)\.\s*([\s\S]+?)(?=\d+\.\s|$)/g : (stryCov_9fa48("3821", "3822", "3823", "3824", "3825", "3826", "3827", "3828", "3829", "3830", "3831", "3832", "3833"), /(\d+)\.\s*([\s\S]+?)(?=\d+\.\s|$)/g), // Formato con paréntesis: "(1) Pregunta..."
    stryMutAct_9fa48("3846") ? /\((\d+)\)\s*([\s\S]+?)(?=\(\d+\)\S|$)/g : stryMutAct_9fa48("3845") ? /\((\d+)\)\s*([\s\S]+?)(?=\(\D+\)\s|$)/g : stryMutAct_9fa48("3844") ? /\((\d+)\)\s*([\s\S]+?)(?=\(\d\)\s|$)/g : stryMutAct_9fa48("3843") ? /\((\d+)\)\s*([\s\S]+?)(?=\(\d+\)\s)/g : stryMutAct_9fa48("3842") ? /\((\d+)\)\s*([\s\S]+?)(?!\(\d+\)\s|$)/g : stryMutAct_9fa48("3841") ? /\((\d+)\)\s*([\s\s]+?)(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3840") ? /\((\d+)\)\s*([\S\S]+?)(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3839") ? /\((\d+)\)\s*([^\s\S]+?)(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3838") ? /\((\d+)\)\s*([\s\S])(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3837") ? /\((\d+)\)\S*([\s\S]+?)(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3836") ? /\((\d+)\)\s([\s\S]+?)(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3835") ? /\((\D+)\)\s*([\s\S]+?)(?=\(\d+\)\s|$)/g : stryMutAct_9fa48("3834") ? /\((\d)\)\s*([\s\S]+?)(?=\(\d+\)\s|$)/g : (stryCov_9fa48("3834", "3835", "3836", "3837", "3838", "3839", "3840", "3841", "3842", "3843", "3844", "3845", "3846"), /\((\d+)\)\s*([\s\S]+?)(?=\(\d+\)\s|$)/g), // Formato sin punto: "1 Pregunta..." (con salto de línea opcional)
    stryMutAct_9fa48("3861") ? /^(\d+)\s+([\s\S]+?)(?=^\d+\S|$)/gm : stryMutAct_9fa48("3860") ? /^(\d+)\s+([\s\S]+?)(?=^\D+\s|$)/gm : stryMutAct_9fa48("3859") ? /^(\d+)\s+([\s\S]+?)(?=^\d\s|$)/gm : stryMutAct_9fa48("3858") ? /^(\d+)\s+([\s\S]+?)(?=\d+\s|$)/gm : stryMutAct_9fa48("3857") ? /^(\d+)\s+([\s\S]+?)(?=^\d+\s)/gm : stryMutAct_9fa48("3856") ? /^(\d+)\s+([\s\S]+?)(?!^\d+\s|$)/gm : stryMutAct_9fa48("3855") ? /^(\d+)\s+([\s\s]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3854") ? /^(\d+)\s+([\S\S]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3853") ? /^(\d+)\s+([^\s\S]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3852") ? /^(\d+)\s+([\s\S])(?=^\d+\s|$)/gm : stryMutAct_9fa48("3851") ? /^(\d+)\S+([\s\S]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3850") ? /^(\d+)\s([\s\S]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3849") ? /^(\D+)\s+([\s\S]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3848") ? /^(\d)\s+([\s\S]+?)(?=^\d+\s|$)/gm : stryMutAct_9fa48("3847") ? /(\d+)\s+([\s\S]+?)(?=^\d+\s|$)/gm : (stryCov_9fa48("3847", "3848", "3849", "3850", "3851", "3852", "3853", "3854", "3855", "3856", "3857", "3858", "3859", "3860", "3861"), /^(\d+)\s+([\s\S]+?)(?=^\d+\s|$)/gm), // Formato con guion: "1- Pregunta..."
    stryMutAct_9fa48("3874") ? /(\d+)-\s+([\s\S]+?)(?=\d+-\S|$)/g : stryMutAct_9fa48("3873") ? /(\d+)-\s+([\s\S]+?)(?=\D+-\s|$)/g : stryMutAct_9fa48("3872") ? /(\d+)-\s+([\s\S]+?)(?=\d-\s|$)/g : stryMutAct_9fa48("3871") ? /(\d+)-\s+([\s\S]+?)(?=\d+-\s)/g : stryMutAct_9fa48("3870") ? /(\d+)-\s+([\s\S]+?)(?!\d+-\s|$)/g : stryMutAct_9fa48("3869") ? /(\d+)-\s+([\s\s]+?)(?=\d+-\s|$)/g : stryMutAct_9fa48("3868") ? /(\d+)-\s+([\S\S]+?)(?=\d+-\s|$)/g : stryMutAct_9fa48("3867") ? /(\d+)-\s+([^\s\S]+?)(?=\d+-\s|$)/g : stryMutAct_9fa48("3866") ? /(\d+)-\s+([\s\S])(?=\d+-\s|$)/g : stryMutAct_9fa48("3865") ? /(\d+)-\S+([\s\S]+?)(?=\d+-\s|$)/g : stryMutAct_9fa48("3864") ? /(\d+)-\s([\s\S]+?)(?=\d+-\s|$)/g : stryMutAct_9fa48("3863") ? /(\D+)-\s+([\s\S]+?)(?=\d+-\s|$)/g : stryMutAct_9fa48("3862") ? /(\d)-\s+([\s\S]+?)(?=\d+-\s|$)/g : (stryCov_9fa48("3862", "3863", "3864", "3865", "3866", "3867", "3868", "3869", "3870", "3871", "3872", "3873", "3874"), /(\d+)-\s+([\s\S]+?)(?=\d+-\s|$)/g), // Formato con dos puntos: "1: Pregunta..."
    stryMutAct_9fa48("3887") ? /(\d+):\s+([\s\S]+?)(?=\d+:\S|$)/g : stryMutAct_9fa48("3886") ? /(\d+):\s+([\s\S]+?)(?=\D+:\s|$)/g : stryMutAct_9fa48("3885") ? /(\d+):\s+([\s\S]+?)(?=\d:\s|$)/g : stryMutAct_9fa48("3884") ? /(\d+):\s+([\s\S]+?)(?=\d+:\s)/g : stryMutAct_9fa48("3883") ? /(\d+):\s+([\s\S]+?)(?!\d+:\s|$)/g : stryMutAct_9fa48("3882") ? /(\d+):\s+([\s\s]+?)(?=\d+:\s|$)/g : stryMutAct_9fa48("3881") ? /(\d+):\s+([\S\S]+?)(?=\d+:\s|$)/g : stryMutAct_9fa48("3880") ? /(\d+):\s+([^\s\S]+?)(?=\d+:\s|$)/g : stryMutAct_9fa48("3879") ? /(\d+):\s+([\s\S])(?=\d+:\s|$)/g : stryMutAct_9fa48("3878") ? /(\d+):\S+([\s\S]+?)(?=\d+:\s|$)/g : stryMutAct_9fa48("3877") ? /(\d+):\s([\s\S]+?)(?=\d+:\s|$)/g : stryMutAct_9fa48("3876") ? /(\D+):\s+([\s\S]+?)(?=\d+:\s|$)/g : stryMutAct_9fa48("3875") ? /(\d):\s+([\s\S]+?)(?=\d+:\s|$)/g : (stryCov_9fa48("3875", "3876", "3877", "3878", "3879", "3880", "3881", "3882", "3883", "3884", "3885", "3886", "3887"), /(\d+):\s+([\s\S]+?)(?=\d+:\s|$)/g)]);
    let allMatches: Array<{
      number: string;
      text: string;
    }> = stryMutAct_9fa48("3888") ? ["Stryker was here"] : (stryCov_9fa48("3888"), []);
    for (const pattern of questionPatterns) {
      if (stryMutAct_9fa48("3889")) {
        {}
      } else {
        stryCov_9fa48("3889");
        const matches = Array.from(normalizedText.matchAll(pattern));
        for (const match of matches) {
          if (stryMutAct_9fa48("3890")) {
            {}
          } else {
            stryCov_9fa48("3890");
            const questionNumber = match[1];
            const questionText = stryMutAct_9fa48("3893") ? (match[2] || match[3]) && '' : stryMutAct_9fa48("3892") ? false : stryMutAct_9fa48("3891") ? true : (stryCov_9fa48("3891", "3892", "3893"), (stryMutAct_9fa48("3895") ? match[2] && match[3] : stryMutAct_9fa48("3894") ? false : (stryCov_9fa48("3894", "3895"), match[2] || match[3])) || (stryMutAct_9fa48("3896") ? "Stryker was here!" : (stryCov_9fa48("3896"), '')));
            if (stryMutAct_9fa48("3900") ? questionText.trim().length <= 20 : stryMutAct_9fa48("3899") ? questionText.trim().length >= 20 : stryMutAct_9fa48("3898") ? false : stryMutAct_9fa48("3897") ? true : (stryCov_9fa48("3897", "3898", "3899", "3900"), (stryMutAct_9fa48("3901") ? questionText.length : (stryCov_9fa48("3901"), questionText.trim().length)) > 20)) {
              if (stryMutAct_9fa48("3902")) {
                {}
              } else {
                stryCov_9fa48("3902");
                // Filtrar textos muy cortos
                allMatches.push(stryMutAct_9fa48("3903") ? {} : (stryCov_9fa48("3903"), {
                  number: questionNumber,
                  text: stryMutAct_9fa48("3904") ? questionText : (stryCov_9fa48("3904"), questionText.trim())
                }));
              }
            }
          }
        }
      }
    }

    // Eliminar duplicados (mismo número de pregunta)
    const uniqueMatches = Array.from(new Map(allMatches.map(stryMutAct_9fa48("3905") ? () => undefined : (stryCov_9fa48("3905"), m => stryMutAct_9fa48("3906") ? [] : (stryCov_9fa48("3906"), [m.number, m])))).values());

    // NOTA: Las respuestas correctas NO se detectan automáticamente al importar
    // El examen se importa sin respuestas correctas para que sean marcadas manualmente después
    // const correctAnswers = detectCorrectAnswers(text) // Deshabilitado intencionalmente

    // Múltiples patrones para encontrar opciones (diferentes formatos)
    const optionPatterns = stryMutAct_9fa48("3907") ? [] : (stryCov_9fa48("3907"), [// Formato estándar: "A) Opción..." (más flexible)
    stryMutAct_9fa48("3917") ? /([A-E])\)\s*([\s\S]+?)(?=[^A-E]\)|$)/g : stryMutAct_9fa48("3916") ? /([A-E])\)\s*([\s\S]+?)(?=[A-E]\))/g : stryMutAct_9fa48("3915") ? /([A-E])\)\s*([\s\S]+?)(?![A-E]\)|$)/g : stryMutAct_9fa48("3914") ? /([A-E])\)\s*([\s\s]+?)(?=[A-E]\)|$)/g : stryMutAct_9fa48("3913") ? /([A-E])\)\s*([\S\S]+?)(?=[A-E]\)|$)/g : stryMutAct_9fa48("3912") ? /([A-E])\)\s*([^\s\S]+?)(?=[A-E]\)|$)/g : stryMutAct_9fa48("3911") ? /([A-E])\)\s*([\s\S])(?=[A-E]\)|$)/g : stryMutAct_9fa48("3910") ? /([A-E])\)\S*([\s\S]+?)(?=[A-E]\)|$)/g : stryMutAct_9fa48("3909") ? /([A-E])\)\s([\s\S]+?)(?=[A-E]\)|$)/g : stryMutAct_9fa48("3908") ? /([^A-E])\)\s*([\s\S]+?)(?=[A-E]\)|$)/g : (stryCov_9fa48("3908", "3909", "3910", "3911", "3912", "3913", "3914", "3915", "3916", "3917"), /([A-E])\)\s*([\s\S]+?)(?=[A-E]\)|$)/g), // Formato con punto: "A. Opción..."
    stryMutAct_9fa48("3927") ? /([A-E])\.\s*([\s\S]+?)(?=[^A-E]\.|$)/g : stryMutAct_9fa48("3926") ? /([A-E])\.\s*([\s\S]+?)(?=[A-E]\.)/g : stryMutAct_9fa48("3925") ? /([A-E])\.\s*([\s\S]+?)(?![A-E]\.|$)/g : stryMutAct_9fa48("3924") ? /([A-E])\.\s*([\s\s]+?)(?=[A-E]\.|$)/g : stryMutAct_9fa48("3923") ? /([A-E])\.\s*([\S\S]+?)(?=[A-E]\.|$)/g : stryMutAct_9fa48("3922") ? /([A-E])\.\s*([^\s\S]+?)(?=[A-E]\.|$)/g : stryMutAct_9fa48("3921") ? /([A-E])\.\s*([\s\S])(?=[A-E]\.|$)/g : stryMutAct_9fa48("3920") ? /([A-E])\.\S*([\s\S]+?)(?=[A-E]\.|$)/g : stryMutAct_9fa48("3919") ? /([A-E])\.\s([\s\S]+?)(?=[A-E]\.|$)/g : stryMutAct_9fa48("3918") ? /([^A-E])\.\s*([\s\S]+?)(?=[A-E]\.|$)/g : (stryCov_9fa48("3918", "3919", "3920", "3921", "3922", "3923", "3924", "3925", "3926", "3927"), /([A-E])\.\s*([\s\S]+?)(?=[A-E]\.|$)/g), // Formato con guion: "A- Opción..."
    stryMutAct_9fa48("3937") ? /([A-E])-\s*([\s\S]+?)(?=[^A-E]-|$)/g : stryMutAct_9fa48("3936") ? /([A-E])-\s*([\s\S]+?)(?=[A-E]-)/g : stryMutAct_9fa48("3935") ? /([A-E])-\s*([\s\S]+?)(?![A-E]-|$)/g : stryMutAct_9fa48("3934") ? /([A-E])-\s*([\s\s]+?)(?=[A-E]-|$)/g : stryMutAct_9fa48("3933") ? /([A-E])-\s*([\S\S]+?)(?=[A-E]-|$)/g : stryMutAct_9fa48("3932") ? /([A-E])-\s*([^\s\S]+?)(?=[A-E]-|$)/g : stryMutAct_9fa48("3931") ? /([A-E])-\s*([\s\S])(?=[A-E]-|$)/g : stryMutAct_9fa48("3930") ? /([A-E])-\S*([\s\S]+?)(?=[A-E]-|$)/g : stryMutAct_9fa48("3929") ? /([A-E])-\s([\s\S]+?)(?=[A-E]-|$)/g : stryMutAct_9fa48("3928") ? /([^A-E])-\s*([\s\S]+?)(?=[A-E]-|$)/g : (stryCov_9fa48("3928", "3929", "3930", "3931", "3932", "3933", "3934", "3935", "3936", "3937"), /([A-E])-\s*([\s\S]+?)(?=[A-E]-|$)/g), // Formato con dos puntos: "A: Opción..."
    stryMutAct_9fa48("3947") ? /([A-E]):\s*([\s\S]+?)(?=[^A-E]:|$)/g : stryMutAct_9fa48("3946") ? /([A-E]):\s*([\s\S]+?)(?=[A-E]:)/g : stryMutAct_9fa48("3945") ? /([A-E]):\s*([\s\S]+?)(?![A-E]:|$)/g : stryMutAct_9fa48("3944") ? /([A-E]):\s*([\s\s]+?)(?=[A-E]:|$)/g : stryMutAct_9fa48("3943") ? /([A-E]):\s*([\S\S]+?)(?=[A-E]:|$)/g : stryMutAct_9fa48("3942") ? /([A-E]):\s*([^\s\S]+?)(?=[A-E]:|$)/g : stryMutAct_9fa48("3941") ? /([A-E]):\s*([\s\S])(?=[A-E]:|$)/g : stryMutAct_9fa48("3940") ? /([A-E]):\S*([\s\S]+?)(?=[A-E]:|$)/g : stryMutAct_9fa48("3939") ? /([A-E]):\s([\s\S]+?)(?=[A-E]:|$)/g : stryMutAct_9fa48("3938") ? /([^A-E]):\s*([\s\S]+?)(?=[A-E]:|$)/g : (stryCov_9fa48("3938", "3939", "3940", "3941", "3942", "3943", "3944", "3945", "3946", "3947"), /([A-E]):\s*([\s\S]+?)(?=[A-E]:|$)/g), // Formato con espacio: "A Opción..." (menos común, más estricto)
    stryMutAct_9fa48("3957") ? /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\S|$)/g : stryMutAct_9fa48("3956") ? /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[^A-E]\s|$)/g : stryMutAct_9fa48("3955") ? /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s)/g : stryMutAct_9fa48("3954") ? /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?![A-E]\s|$)/g : stryMutAct_9fa48("3953") ? /([A-E])\s+([A-ZÁÉÍÓÚÑ][A-E]{10,}?)(?=[A-E]\s|$)/g : stryMutAct_9fa48("3952") ? /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E])(?=[A-E]\s|$)/g : stryMutAct_9fa48("3951") ? /([A-E])\s+([^A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s|$)/g : stryMutAct_9fa48("3950") ? /([A-E])\S+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s|$)/g : stryMutAct_9fa48("3949") ? /([A-E])\s([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s|$)/g : stryMutAct_9fa48("3948") ? /([^A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s|$)/g : (stryCov_9fa48("3948", "3949", "3950", "3951", "3952", "3953", "3954", "3955", "3956", "3957"), /([A-E])\s+([A-ZÁÉÍÓÚÑ][^A-E]{10,}?)(?=[A-E]\s|$)/g)]);
    for (const match of uniqueMatches) {
      if (stryMutAct_9fa48("3958")) {
        {}
      } else {
        stryCov_9fa48("3958");
        const questionText = match.text;

        // Intentar cada patrón de opciones
        let optionMatches: Array<{
          letra: string;
          texto: string;
        }> = stryMutAct_9fa48("3959") ? ["Stryker was here"] : (stryCov_9fa48("3959"), []);
        for (const optionPattern of optionPatterns) {
          if (stryMutAct_9fa48("3960")) {
            {}
          } else {
            stryCov_9fa48("3960");
            const matches = Array.from(questionText.matchAll(optionPattern));
            if (stryMutAct_9fa48("3964") ? matches.length < 4 : stryMutAct_9fa48("3963") ? matches.length > 4 : stryMutAct_9fa48("3962") ? false : stryMutAct_9fa48("3961") ? true : (stryCov_9fa48("3961", "3962", "3963", "3964"), matches.length >= 4)) {
              if (stryMutAct_9fa48("3965")) {
                {}
              } else {
                stryCov_9fa48("3965");
                optionMatches = matches.map(stryMutAct_9fa48("3966") ? () => undefined : (stryCov_9fa48("3966"), opt => stryMutAct_9fa48("3967") ? {} : (stryCov_9fa48("3967"), {
                  letra: opt[1],
                  texto: stryMutAct_9fa48("3968") ? opt[2] : (stryCov_9fa48("3968"), opt[2].trim())
                })));
                break; // Usar el primer patrón que funcione
              }
            }
          }
        }
        if (stryMutAct_9fa48("3972") ? optionMatches.length < 4 : stryMutAct_9fa48("3971") ? optionMatches.length > 4 : stryMutAct_9fa48("3970") ? false : stryMutAct_9fa48("3969") ? true : (stryCov_9fa48("3969", "3970", "3971", "3972"), optionMatches.length >= 4)) {
          if (stryMutAct_9fa48("3973")) {
            {}
          } else {
            stryCov_9fa48("3973");
            // Extraer enunciado (todo antes de la primera opción)
            const firstOptionIndex = questionText.search(stryMutAct_9fa48("3976") ? /[A-E][\)\.\-\:\S]/ : stryMutAct_9fa48("3975") ? /[A-E][^\)\.\-\:\s]/ : stryMutAct_9fa48("3974") ? /[^A-E][\)\.\-\:\s]/ : (stryCov_9fa48("3974", "3975", "3976"), /[A-E][\)\.\-\:\s]/));
            const enunciado = (stryMutAct_9fa48("3980") ? firstOptionIndex <= 0 : stryMutAct_9fa48("3979") ? firstOptionIndex >= 0 : stryMutAct_9fa48("3978") ? false : stryMutAct_9fa48("3977") ? true : (stryCov_9fa48("3977", "3978", "3979", "3980"), firstOptionIndex > 0)) ? stryMutAct_9fa48("3982") ? questionText.trim() : stryMutAct_9fa48("3981") ? questionText.substring(0, firstOptionIndex) : (stryCov_9fa48("3981", "3982"), questionText.substring(0, firstOptionIndex).trim()) : stryMutAct_9fa48("3983") ? questionText.split(/[A-E][\)\.\-\:]/)[0] : (stryCov_9fa48("3983"), questionText.split(stryMutAct_9fa48("3985") ? /[A-E][^\)\.\-\:]/ : stryMutAct_9fa48("3984") ? /[^A-E][\)\.\-\:]/ : (stryCov_9fa48("3984", "3985"), /[A-E][\)\.\-\:]/))[0].trim());

            // Limpiar el enunciado de números de pregunta residuales
            const cleanEnunciado = stryMutAct_9fa48("3986") ? enunciado.replace(/^\d+[\.\)]\s*/, '').replace(/^\(?\d+\)?\s*/, '') : (stryCov_9fa48("3986"), enunciado.replace(stryMutAct_9fa48("3992") ? /^\d+[\.\)]\S*/ : stryMutAct_9fa48("3991") ? /^\d+[\.\)]\s/ : stryMutAct_9fa48("3990") ? /^\d+[^\.\)]\s*/ : stryMutAct_9fa48("3989") ? /^\D+[\.\)]\s*/ : stryMutAct_9fa48("3988") ? /^\d[\.\)]\s*/ : stryMutAct_9fa48("3987") ? /\d+[\.\)]\s*/ : (stryCov_9fa48("3987", "3988", "3989", "3990", "3991", "3992"), /^\d+[\.\)]\s*/), stryMutAct_9fa48("3993") ? "Stryker was here!" : (stryCov_9fa48("3993"), '')).replace(stryMutAct_9fa48("4000") ? /^\(?\d+\)?\S*/ : stryMutAct_9fa48("3999") ? /^\(?\d+\)?\s/ : stryMutAct_9fa48("3998") ? /^\(?\d+\)\s*/ : stryMutAct_9fa48("3997") ? /^\(?\D+\)?\s*/ : stryMutAct_9fa48("3996") ? /^\(?\d\)?\s*/ : stryMutAct_9fa48("3995") ? /^\(\d+\)?\s*/ : stryMutAct_9fa48("3994") ? /\(?\d+\)?\s*/ : (stryCov_9fa48("3994", "3995", "3996", "3997", "3998", "3999", "4000"), /^\(?\d+\)?\s*/), stryMutAct_9fa48("4001") ? "Stryker was here!" : (stryCov_9fa48("4001"), '')).trim());
            if (stryMutAct_9fa48("4005") ? cleanEnunciado.length <= 10 : stryMutAct_9fa48("4004") ? cleanEnunciado.length >= 10 : stryMutAct_9fa48("4003") ? false : stryMutAct_9fa48("4002") ? true : (stryCov_9fa48("4002", "4003", "4004", "4005"), cleanEnunciado.length > 10)) {
              if (stryMutAct_9fa48("4006")) {
                {}
              } else {
                stryCov_9fa48("4006");
                // Validar que el enunciado tenga sentido
                // IMPORTANTE: Todas las opciones se importan como incorrectas
                // Las respuestas correctas deben marcarse manualmente después de la importación
                const options = optionMatches.map(opt => {
                  if (stryMutAct_9fa48("4007")) {
                    {}
                  } else {
                    stryCov_9fa48("4007");
                    const esCorrecta = stryMutAct_9fa48("4008") ? true : (stryCov_9fa48("4008"), false); // Siempre false al importar

                    return stryMutAct_9fa48("4009") ? {} : (stryCov_9fa48("4009"), {
                      letra: opt.letra,
                      texto: stryMutAct_9fa48("4010") ? opt.texto.replace(/\s+/g, ' ') : (stryCov_9fa48("4010"), opt.texto.trim().replace(stryMutAct_9fa48("4012") ? /\S+/g : stryMutAct_9fa48("4011") ? /\s/g : (stryCov_9fa48("4011", "4012"), /\s+/g), stryMutAct_9fa48("4013") ? "" : (stryCov_9fa48("4013"), ' '))),
                      esCorrecta
                    });
                  }
                });

                // Validar que las opciones tengan contenido
                if (stryMutAct_9fa48("4016") ? options.some(opt => opt.texto.length > 3) : stryMutAct_9fa48("4015") ? false : stryMutAct_9fa48("4014") ? true : (stryCov_9fa48("4014", "4015", "4016"), options.every(stryMutAct_9fa48("4017") ? () => undefined : (stryCov_9fa48("4017"), opt => stryMutAct_9fa48("4021") ? opt.texto.length <= 3 : stryMutAct_9fa48("4020") ? opt.texto.length >= 3 : stryMutAct_9fa48("4019") ? false : stryMutAct_9fa48("4018") ? true : (stryCov_9fa48("4018", "4019", "4020", "4021"), opt.texto.length > 3))))) {
                  if (stryMutAct_9fa48("4022")) {
                    {}
                  } else {
                    stryCov_9fa48("4022");
                    questions.push(stryMutAct_9fa48("4023") ? {} : (stryCov_9fa48("4023"), {
                      enunciado: cleanEnunciado,
                      options,
                      dificultad: 2,
                      explicacion: stryMutAct_9fa48("4024") ? "" : (stryCov_9fa48("4024"), 'Respuesta correcta: Debe marcarse manualmente después de la importación'),
                      fuente: stryMutAct_9fa48("4025") ? `` : (stryCov_9fa48("4025"), `DEMRE PAES ${new Date().getFullYear()}`)
                    }));
                  }
                }
              }
            }
          }
        }
      }
    }
    return questions;
  }
}
async function mapQuestionToTopic(question: {
  enunciado: string;
}, subjectId: string, prismaClient: typeof prisma = prisma): Promise<string | null> {
  if (stryMutAct_9fa48("4026")) {
    {}
  } else {
    stryCov_9fa48("4026");
    const topics = await prismaClient.topic.findMany(stryMutAct_9fa48("4027") ? {} : (stryCov_9fa48("4027"), {
      where: stryMutAct_9fa48("4028") ? {} : (stryCov_9fa48("4028"), {
        subjectId
      })
    }));
    const enunciadoLower = stryMutAct_9fa48("4029") ? question.enunciado.toUpperCase() : (stryCov_9fa48("4029"), question.enunciado.toLowerCase());
    for (const topic of topics) {
      if (stryMutAct_9fa48("4030")) {
        {}
      } else {
        stryCov_9fa48("4030");
        const topicKeywords = stryMutAct_9fa48("4031") ? [] : (stryCov_9fa48("4031"), [stryMutAct_9fa48("4032") ? topic.nombre.toUpperCase() : (stryCov_9fa48("4032"), topic.nombre.toLowerCase()), stryMutAct_9fa48("4033") ? topic.ejeTematico.toUpperCase() : (stryCov_9fa48("4033"), topic.ejeTematico.toLowerCase()), ...(stryMutAct_9fa48("4036") ? topic.descripcion?.toLowerCase().split(' ') && [] : stryMutAct_9fa48("4035") ? false : stryMutAct_9fa48("4034") ? true : (stryCov_9fa48("4034", "4035", "4036"), (stryMutAct_9fa48("4038") ? topic.descripcion.toLowerCase().split(' ') : stryMutAct_9fa48("4037") ? topic.descripcion?.toUpperCase().split(' ') : (stryCov_9fa48("4037", "4038"), topic.descripcion?.toLowerCase().split(stryMutAct_9fa48("4039") ? "" : (stryCov_9fa48("4039"), ' ')))) || (stryMutAct_9fa48("4040") ? ["Stryker was here"] : (stryCov_9fa48("4040"), []))))]);
        for (const keyword of topicKeywords) {
          if (stryMutAct_9fa48("4041")) {
            {}
          } else {
            stryCov_9fa48("4041");
            if (stryMutAct_9fa48("4043") ? false : stryMutAct_9fa48("4042") ? true : (stryCov_9fa48("4042", "4043"), enunciadoLower.includes(keyword))) {
              if (stryMutAct_9fa48("4044")) {
                {}
              } else {
                stryCov_9fa48("4044");
                return topic.id;
              }
            }
          }
        }
      }
    }
    return (stryMutAct_9fa48("4048") ? topics.length <= 0 : stryMutAct_9fa48("4047") ? topics.length >= 0 : stryMutAct_9fa48("4046") ? false : stryMutAct_9fa48("4045") ? true : (stryCov_9fa48("4045", "4046", "4047", "4048"), topics.length > 0)) ? topics[0].id : null;
  }
}
async function importExam(examData: z.infer<typeof examImportSchema>) {
  if (stryMutAct_9fa48("4049")) {
    {}
  } else {
    stryCov_9fa48("4049");
    const {
      pdfUrl,
      pdfFile,
      inputType,
      subjectName,
      examTitle,
      examType,
      year
    } = examData;
    let pdfPath: string | null = null;
    try {
      if (stryMutAct_9fa48("4050")) {
        {}
      } else {
        stryCov_9fa48("4050");
        // Obtener código de asignatura
        const subjectCode = SUBJECT_MAPPING[subjectName];
        if (stryMutAct_9fa48("4053") ? false : stryMutAct_9fa48("4052") ? true : stryMutAct_9fa48("4051") ? subjectCode : (stryCov_9fa48("4051", "4052", "4053"), !subjectCode)) {
          if (stryMutAct_9fa48("4054")) {
            {}
          } else {
            stryCov_9fa48("4054");
            throw new Error(stryMutAct_9fa48("4055") ? `` : (stryCov_9fa48("4055"), `Asignatura no encontrada: ${subjectName}`));
          }
        }

        // Obtener asignatura de la BD
        const subject = await prisma.subject.findUnique(stryMutAct_9fa48("4056") ? {} : (stryCov_9fa48("4056"), {
          where: stryMutAct_9fa48("4057") ? {} : (stryCov_9fa48("4057"), {
            codigo: subjectCode
          })
        }));
        if (stryMutAct_9fa48("4060") ? false : stryMutAct_9fa48("4059") ? true : stryMutAct_9fa48("4058") ? subject : (stryCov_9fa48("4058", "4059", "4060"), !subject)) {
          if (stryMutAct_9fa48("4061")) {
            {}
          } else {
            stryCov_9fa48("4061");
            throw new Error(stryMutAct_9fa48("4062") ? `` : (stryCov_9fa48("4062"), `Asignatura ${subjectCode} no existe en la base de datos`));
          }
        }

        // Obtener PDF según el tipo de entrada
        await ensureDirectories();
        const pdfFileName = stryMutAct_9fa48("4063") ? `` : (stryCov_9fa48("4063"), `${subjectCode}_${year}_${Date.now()}.pdf`);
        pdfPath = path.join(PDFS_DIR, pdfFileName);
        if (stryMutAct_9fa48("4066") ? inputType === 'file' || pdfFile : stryMutAct_9fa48("4065") ? false : stryMutAct_9fa48("4064") ? true : (stryCov_9fa48("4064", "4065", "4066"), (stryMutAct_9fa48("4068") ? inputType !== 'file' : stryMutAct_9fa48("4067") ? true : (stryCov_9fa48("4067", "4068"), inputType === (stryMutAct_9fa48("4069") ? "" : (stryCov_9fa48("4069"), 'file')))) && pdfFile)) {
          if (stryMutAct_9fa48("4070")) {
            {}
          } else {
            stryCov_9fa48("4070");
            // Validar tipo de archivo
            if (stryMutAct_9fa48("4073") ? pdfFile.type === 'application/pdf' : stryMutAct_9fa48("4072") ? false : stryMutAct_9fa48("4071") ? true : (stryCov_9fa48("4071", "4072", "4073"), pdfFile.type !== (stryMutAct_9fa48("4074") ? "" : (stryCov_9fa48("4074"), 'application/pdf')))) {
              if (stryMutAct_9fa48("4075")) {
                {}
              } else {
                stryCov_9fa48("4075");
                throw new Error(stryMutAct_9fa48("4076") ? "" : (stryCov_9fa48("4076"), 'El archivo debe ser un PDF válido (tipo MIME: application/pdf)'));
              }
            }

            // Validar extensión
            const fileName = stryMutAct_9fa48("4077") ? pdfFile.name.toUpperCase() : (stryCov_9fa48("4077"), pdfFile.name.toLowerCase());
            if (stryMutAct_9fa48("4080") ? false : stryMutAct_9fa48("4079") ? true : stryMutAct_9fa48("4078") ? fileName.endsWith('.pdf') : (stryCov_9fa48("4078", "4079", "4080"), !(stryMutAct_9fa48("4081") ? fileName.startsWith('.pdf') : (stryCov_9fa48("4081"), fileName.endsWith(stryMutAct_9fa48("4082") ? "" : (stryCov_9fa48("4082"), '.pdf')))))) {
              if (stryMutAct_9fa48("4083")) {
                {}
              } else {
                stryCov_9fa48("4083");
                throw new Error(stryMutAct_9fa48("4084") ? "" : (stryCov_9fa48("4084"), 'El archivo debe tener extensión .pdf'));
              }
            }

            // Validar tamaño (máximo 50 MB)
            const MAX_FILE_SIZE = stryMutAct_9fa48("4085") ? 50 * 1024 / 1024 : (stryCov_9fa48("4085"), (stryMutAct_9fa48("4086") ? 50 / 1024 : (stryCov_9fa48("4086"), 50 * 1024)) * 1024); // 50 MB
            if (stryMutAct_9fa48("4090") ? pdfFile.size <= MAX_FILE_SIZE : stryMutAct_9fa48("4089") ? pdfFile.size >= MAX_FILE_SIZE : stryMutAct_9fa48("4088") ? false : stryMutAct_9fa48("4087") ? true : (stryCov_9fa48("4087", "4088", "4089", "4090"), pdfFile.size > MAX_FILE_SIZE)) {
              if (stryMutAct_9fa48("4091")) {
                {}
              } else {
                stryCov_9fa48("4091");
                throw new Error(stryMutAct_9fa48("4092") ? `` : (stryCov_9fa48("4092"), `El archivo es demasiado grande. Tamaño máximo: ${stryMutAct_9fa48("4093") ? MAX_FILE_SIZE / 1024 * 1024 : (stryCov_9fa48("4093"), (stryMutAct_9fa48("4094") ? MAX_FILE_SIZE * 1024 : (stryCov_9fa48("4094"), MAX_FILE_SIZE / 1024)) / 1024)} MB. Tamaño actual: ${(stryMutAct_9fa48("4095") ? pdfFile.size / 1024 * 1024 : (stryCov_9fa48("4095"), (stryMutAct_9fa48("4096") ? pdfFile.size * 1024 : (stryCov_9fa48("4096"), pdfFile.size / 1024)) / 1024)).toFixed(2)} MB`));
              }
            }

            // Guardar archivo subido
            const arrayBuffer = await pdfFile.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            await fs.writeFile(pdfPath, buffer);
          }
        } else if (stryMutAct_9fa48("4099") ? inputType === 'url' || pdfUrl : stryMutAct_9fa48("4098") ? false : stryMutAct_9fa48("4097") ? true : (stryCov_9fa48("4097", "4098", "4099"), (stryMutAct_9fa48("4101") ? inputType !== 'url' : stryMutAct_9fa48("4100") ? true : (stryCov_9fa48("4100", "4101"), inputType === (stryMutAct_9fa48("4102") ? "" : (stryCov_9fa48("4102"), 'url')))) && pdfUrl)) {
          if (stryMutAct_9fa48("4103")) {
            {}
          } else {
            stryCov_9fa48("4103");
            // Descargar desde URL
            try {
              if (stryMutAct_9fa48("4104")) {
                {}
              } else {
                stryCov_9fa48("4104");
                await downloadFile(pdfUrl, pdfPath);
              }
            } catch (downloadError) {
              if (stryMutAct_9fa48("4105")) {
                {}
              } else {
                stryCov_9fa48("4105");
                const errorMessage = downloadError instanceof Error ? downloadError.message : String(downloadError);

                // Si es error de parsing de headers, proporcionar mensaje más útil
                if (stryMutAct_9fa48("4108") ? errorMessage.includes('Parse Error') && errorMessage.includes('CR after header') : stryMutAct_9fa48("4107") ? false : stryMutAct_9fa48("4106") ? true : (stryCov_9fa48("4106", "4107", "4108"), errorMessage.includes(stryMutAct_9fa48("4109") ? "" : (stryCov_9fa48("4109"), 'Parse Error')) || errorMessage.includes(stryMutAct_9fa48("4110") ? "" : (stryCov_9fa48("4110"), 'CR after header')))) {
                  if (stryMutAct_9fa48("4111")) {
                    {}
                  } else {
                    stryCov_9fa48("4111");
                    throw new Error((stryMutAct_9fa48("4112") ? `` : (stryCov_9fa48("4112"), `No se pudo descargar el PDF debido a headers mal formateados del servidor de DEMRE.\n\n`)) + (stryMutAct_9fa48("4113") ? `` : (stryCov_9fa48("4113"), `Solución: Usa la opción "Archivo Local" para subir el PDF descargado manualmente.`)));
                  }
                }
                throw downloadError;
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("4114")) {
            {}
          } else {
            stryCov_9fa48("4114");
            throw new Error(stryMutAct_9fa48("4115") ? "" : (stryCov_9fa48("4115"), 'Debe proporcionar URL o archivo según el tipo seleccionado'));
          }
        }

        // Extraer texto
        const text = await extractTextFromPDF(pdfPath);

        // Log temporal para debugging (primeros 2000 caracteres)
        const {
          logger
        } = await import(stryMutAct_9fa48("4116") ? "" : (stryCov_9fa48("4116"), '@/lib/logger'));
        logger.debug(stryMutAct_9fa48("4117") ? {} : (stryCov_9fa48("4117"), {
          textPreview: stryMutAct_9fa48("4118") ? text : (stryCov_9fa48("4118"), text.substring(0, 2000)),
          textLength: text.length
        }), stryMutAct_9fa48("4119") ? "" : (stryCov_9fa48("4119"), 'Texto extraído del PDF'));

        // Parsear preguntas
        const parsedQuestions = parseQuestionsFromText(text);
        logger.info(stryMutAct_9fa48("4120") ? {} : (stryCov_9fa48("4120"), {
          questionCount: parsedQuestions.length,
          textLength: text.length
        }), stryMutAct_9fa48("4121") ? "" : (stryCov_9fa48("4121"), 'Preguntas parseadas del PDF'));
        if (stryMutAct_9fa48("4124") ? parsedQuestions.length === 0 || text.length > 100 : stryMutAct_9fa48("4123") ? false : stryMutAct_9fa48("4122") ? true : (stryCov_9fa48("4122", "4123", "4124"), (stryMutAct_9fa48("4126") ? parsedQuestions.length !== 0 : stryMutAct_9fa48("4125") ? true : (stryCov_9fa48("4125", "4126"), parsedQuestions.length === 0)) && (stryMutAct_9fa48("4129") ? text.length <= 100 : stryMutAct_9fa48("4128") ? text.length >= 100 : stryMutAct_9fa48("4127") ? true : (stryCov_9fa48("4127", "4128", "4129"), text.length > 100)))) {
          if (stryMutAct_9fa48("4130")) {
            {}
          } else {
            stryCov_9fa48("4130");
            // Intentar encontrar patrones alternativos en el texto
            logger.debug(stryMutAct_9fa48("4131") ? {} : (stryCov_9fa48("4131"), {
              textLength: text.length
            }), stryMutAct_9fa48("4132") ? "" : (stryCov_9fa48("4132"), 'Buscando patrones alternativos en el texto'));
            const hasNumbers = (stryMutAct_9fa48("4134") ? /\D+/ : stryMutAct_9fa48("4133") ? /\d/ : (stryCov_9fa48("4133", "4134"), /\d+/)).test(text);
            const hasLetters = (stryMutAct_9fa48("4135") ? /[^A-E]/ : (stryCov_9fa48("4135"), /[A-E]/)).test(text);
            const hasParentheses = (stryMutAct_9fa48("4136") ? /[^A-E]\)/ : (stryCov_9fa48("4136"), /[A-E]\)/)).test(text);
            const hasDots = (stryMutAct_9fa48("4137") ? /[^A-E]\./ : (stryCov_9fa48("4137"), /[A-E]\./)).test(text);
            logger.debug(stryMutAct_9fa48("4138") ? {} : (stryCov_9fa48("4138"), {
              hasNumbers,
              hasLetters,
              hasParentheses,
              hasDots
            }), stryMutAct_9fa48("4139") ? "" : (stryCov_9fa48("4139"), 'Patrones encontrados en el texto'));

            // Mostrar una muestra del texto para debugging
            const sampleStart = text.indexOf(stryMutAct_9fa48("4140") ? "" : (stryCov_9fa48("4140"), '1'));
            if (stryMutAct_9fa48("4144") ? sampleStart < 0 : stryMutAct_9fa48("4143") ? sampleStart > 0 : stryMutAct_9fa48("4142") ? false : stryMutAct_9fa48("4141") ? true : (stryCov_9fa48("4141", "4142", "4143", "4144"), sampleStart >= 0)) {
              if (stryMutAct_9fa48("4145")) {
                {}
              } else {
                stryCov_9fa48("4145");
                logger.debug(stryMutAct_9fa48("4146") ? {} : (stryCov_9fa48("4146"), {
                  sampleText: stryMutAct_9fa48("4147") ? text : (stryCov_9fa48("4147"), text.substring(sampleStart, stryMutAct_9fa48("4148") ? sampleStart - 500 : (stryCov_9fa48("4148"), sampleStart + 500))),
                  sampleStart
                }), stryMutAct_9fa48("4149") ? "" : (stryCov_9fa48("4149"), 'Muestra del texto desde primer "1"'));
              }
            }
          }
        }
        if (stryMutAct_9fa48("4152") ? parsedQuestions.length !== 0 : stryMutAct_9fa48("4151") ? false : stryMutAct_9fa48("4150") ? true : (stryCov_9fa48("4150", "4151", "4152"), parsedQuestions.length === 0)) {
          if (stryMutAct_9fa48("4153")) {
            {}
          } else {
            stryCov_9fa48("4153");
            // Preparar información de debugging
            const debugInfo: {
              textLength: number;
              hasNumbers?: boolean;
              hasLetters?: boolean;
              hasParentheses?: boolean;
              hasDots?: boolean;
              sampleText?: string;
              numberPatternMatches?: number;
              letterPatternMatches?: number;
              sampleAroundFirstNumber?: string;
            } = stryMutAct_9fa48("4154") ? {} : (stryCov_9fa48("4154"), {
              textLength: text.length,
              hasNumbers: (stryMutAct_9fa48("4156") ? /\D+/ : stryMutAct_9fa48("4155") ? /\d/ : (stryCov_9fa48("4155", "4156"), /\d+/)).test(text),
              hasLetters: (stryMutAct_9fa48("4157") ? /[^A-E]/ : (stryCov_9fa48("4157"), /[A-E]/)).test(text),
              hasParentheses: (stryMutAct_9fa48("4158") ? /[^A-E]\)/ : (stryCov_9fa48("4158"), /[A-E]\)/)).test(text),
              hasDots: (stryMutAct_9fa48("4159") ? /[^A-E]\./ : (stryCov_9fa48("4159"), /[A-E]\./)).test(text),
              sampleText: stryMutAct_9fa48("4160") ? text : (stryCov_9fa48("4160"), text.substring(0, 1000)) // Primeros 1000 caracteres
            });

            // Buscar cualquier patrón que pueda indicar preguntas
            const numberPattern = stryMutAct_9fa48("4164") ? /\d+[\.\)]\S/g : stryMutAct_9fa48("4163") ? /\d+[^\.\)]\s/g : stryMutAct_9fa48("4162") ? /\D+[\.\)]\s/g : stryMutAct_9fa48("4161") ? /\d[\.\)]\s/g : (stryCov_9fa48("4161", "4162", "4163", "4164"), /\d+[\.\)]\s/g);
            const letterPattern = stryMutAct_9fa48("4166") ? /[A-E][^\)\.\-\:]/g : stryMutAct_9fa48("4165") ? /[^A-E][\)\.\-\:]/g : (stryCov_9fa48("4165", "4166"), /[A-E][\)\.\-\:]/g);
            const numberMatches = stryMutAct_9fa48("4169") ? text.match(numberPattern)?.length && 0 : stryMutAct_9fa48("4168") ? false : stryMutAct_9fa48("4167") ? true : (stryCov_9fa48("4167", "4168", "4169"), (stryMutAct_9fa48("4170") ? text.match(numberPattern).length : (stryCov_9fa48("4170"), text.match(numberPattern)?.length)) || 0);
            const letterMatches = stryMutAct_9fa48("4173") ? text.match(letterPattern)?.length && 0 : stryMutAct_9fa48("4172") ? false : stryMutAct_9fa48("4171") ? true : (stryCov_9fa48("4171", "4172", "4173"), (stryMutAct_9fa48("4174") ? text.match(letterPattern).length : (stryCov_9fa48("4174"), text.match(letterPattern)?.length)) || 0);
            debugInfo.numberPatternMatches = numberMatches;
            debugInfo.letterPatternMatches = letterMatches;

            // Buscar muestra alrededor del primer número
            const firstNumberIndex = text.search(stryMutAct_9fa48("4177") ? /\d+[^\.\)]/ : stryMutAct_9fa48("4176") ? /\D+[\.\)]/ : stryMutAct_9fa48("4175") ? /\d[\.\)]/ : (stryCov_9fa48("4175", "4176", "4177"), /\d+[\.\)]/));
            if (stryMutAct_9fa48("4181") ? firstNumberIndex < 0 : stryMutAct_9fa48("4180") ? firstNumberIndex > 0 : stryMutAct_9fa48("4179") ? false : stryMutAct_9fa48("4178") ? true : (stryCov_9fa48("4178", "4179", "4180", "4181"), firstNumberIndex >= 0)) {
              if (stryMutAct_9fa48("4182")) {
                {}
              } else {
                stryCov_9fa48("4182");
                debugInfo.sampleAroundFirstNumber = stryMutAct_9fa48("4183") ? text : (stryCov_9fa48("4183"), text.substring(stryMutAct_9fa48("4184") ? Math.min(0, firstNumberIndex - 50) : (stryCov_9fa48("4184"), Math.max(0, stryMutAct_9fa48("4185") ? firstNumberIndex + 50 : (stryCov_9fa48("4185"), firstNumberIndex - 50))), stryMutAct_9fa48("4186") ? Math.max(text.length, firstNumberIndex + 500) : (stryCov_9fa48("4186"), Math.min(text.length, stryMutAct_9fa48("4187") ? firstNumberIndex - 500 : (stryCov_9fa48("4187"), firstNumberIndex + 500)))));
              }
            }
            logger.error(stryMutAct_9fa48("4188") ? {} : (stryCov_9fa48("4188"), {
              debugInfo
            }), stryMutAct_9fa48("4189") ? "" : (stryCov_9fa48("4189"), 'No se encontraron preguntas en el PDF'));
            throw new Error((stryMutAct_9fa48("4190") ? `` : (stryCov_9fa48("4190"), `No se encontraron preguntas en el PDF. `)) + (stryMutAct_9fa48("4191") ? `` : (stryCov_9fa48("4191"), `El formato puede ser diferente o el PDF puede estar protegido. `)) + (stryMutAct_9fa48("4192") ? `` : (stryCov_9fa48("4192"), `Texto extraído: ${text.length} caracteres. `)) + (stryMutAct_9fa48("4193") ? `` : (stryCov_9fa48("4193"), `Patrones encontrados: números=${numberMatches}, letras=${letterMatches}. `)) + (stryMutAct_9fa48("4194") ? `` : (stryCov_9fa48("4194"), `Revisa los logs del servidor para más detalles.`)));
          }
        }

        // Usar transacción para garantizar consistencia: todas las preguntas se crean o ninguna
        // Si falla la creación del examen, todas las preguntas se revierten
        const {
          exam,
          createdQuestions
        } = await prisma.$transaction(async tx => {
          if (stryMutAct_9fa48("4195")) {
            {}
          } else {
            stryCov_9fa48("4195");
            // Crear preguntas dentro de la transacción
            const questions = stryMutAct_9fa48("4196") ? ["Stryker was here"] : (stryCov_9fa48("4196"), []);
            for (const parsedQ of parsedQuestions) {
              if (stryMutAct_9fa48("4197")) {
                {}
              } else {
                stryCov_9fa48("4197");
                const topicId = await mapQuestionToTopic(parsedQ, subject.id, tx);
                const question = await tx.question.create(stryMutAct_9fa48("4198") ? {} : (stryCov_9fa48("4198"), {
                  data: stryMutAct_9fa48("4199") ? {} : (stryCov_9fa48("4199"), {
                    subjectId: subject.id,
                    topicId,
                    enunciado: parsedQ.enunciado,
                    dificultad: parsedQ.dificultad,
                    explicacion: parsedQ.explicacion,
                    fuente: parsedQ.fuente,
                    tipo: stryMutAct_9fa48("4200") ? "" : (stryCov_9fa48("4200"), 'multiple_choice'),
                    options: stryMutAct_9fa48("4201") ? {} : (stryCov_9fa48("4201"), {
                      create: parsedQ.options.map(stryMutAct_9fa48("4202") ? () => undefined : (stryCov_9fa48("4202"), opt => stryMutAct_9fa48("4203") ? {} : (stryCov_9fa48("4203"), {
                        letra: opt.letra,
                        texto: opt.texto,
                        esCorrecta: opt.esCorrecta
                      })))
                    })
                  })
                }));
                questions.push(question);
              }
            }

            // Crear examen con todas las preguntas (dentro de la misma transacción)
            const examResult = await tx.exam.create(stryMutAct_9fa48("4204") ? {} : (stryCov_9fa48("4204"), {
              data: stryMutAct_9fa48("4205") ? {} : (stryCov_9fa48("4205"), {
                subjectId: subject.id,
                titulo: examTitle,
                descripcion: stryMutAct_9fa48("4206") ? `` : (stryCov_9fa48("4206"), `Examen oficial PAES ${year} - ${subjectName}`),
                tipo: examType,
                tiempoLimiteMin: (stryMutAct_9fa48("4209") ? subjectCode !== 'LECTORA' : stryMutAct_9fa48("4208") ? false : stryMutAct_9fa48("4207") ? true : (stryCov_9fa48("4207", "4208", "4209"), subjectCode === (stryMutAct_9fa48("4210") ? "" : (stryCov_9fa48("4210"), 'LECTORA')))) ? 90 : (stryMutAct_9fa48("4213") ? subjectCode !== 'M1' : stryMutAct_9fa48("4212") ? false : stryMutAct_9fa48("4211") ? true : (stryCov_9fa48("4211", "4212", "4213"), subjectCode === (stryMutAct_9fa48("4214") ? "" : (stryCov_9fa48("4214"), 'M1')))) ? 135 : 120,
                totalPreguntas: questions.length,
                fuente: stryMutAct_9fa48("4215") ? `` : (stryCov_9fa48("4215"), `DEMRE ${year}`),
                questions: stryMutAct_9fa48("4216") ? {} : (stryCov_9fa48("4216"), {
                  create: questions.map(stryMutAct_9fa48("4217") ? () => undefined : (stryCov_9fa48("4217"), (q, index) => stryMutAct_9fa48("4218") ? {} : (stryCov_9fa48("4218"), {
                    questionId: q.id,
                    orden: stryMutAct_9fa48("4219") ? index - 1 : (stryCov_9fa48("4219"), index + 1)
                  })))
                })
              })
            }));
            return stryMutAct_9fa48("4220") ? {} : (stryCov_9fa48("4220"), {
              exam: examResult,
              createdQuestions: questions
            });
          }
        });

        // Limpiar PDF después de importar exitosamente
        if (stryMutAct_9fa48("4222") ? false : stryMutAct_9fa48("4221") ? true : (stryCov_9fa48("4221", "4222"), pdfPath)) {
          if (stryMutAct_9fa48("4223")) {
            {}
          } else {
            stryCov_9fa48("4223");
            await fs.unlink(pdfPath).catch(() => {
              // Ignorar errores al eliminar (puede que ya no exista)
            });
          }
        }
        return stryMutAct_9fa48("4224") ? {} : (stryCov_9fa48("4224"), {
          examId: exam.id,
          examTitle: exam.titulo,
          questionsCount: createdQuestions.length
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("4225")) {
        {}
      } else {
        stryCov_9fa48("4225");
        // Limpiar PDF en caso de error
        if (stryMutAct_9fa48("4227") ? false : stryMutAct_9fa48("4226") ? true : (stryCov_9fa48("4226", "4227"), pdfPath)) {
          if (stryMutAct_9fa48("4228")) {
            {}
          } else {
            stryCov_9fa48("4228");
            await fs.unlink(pdfPath).catch(() => {
              // Ignorar errores al eliminar
            });
          }
        }
        throw error;
      }
    }
  }
}
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("4229")) {
    {}
  } else {
    stryCov_9fa48("4229");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("4230")) {
        {}
      } else {
        stryCov_9fa48("4230");
        try {
          if (stryMutAct_9fa48("4231")) {
            {}
          } else {
            stryCov_9fa48("4231");
            // Verificar autenticación (solo usuarios autenticados pueden importar)
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("4234") ? false : stryMutAct_9fa48("4233") ? true : stryMutAct_9fa48("4232") ? user : (stryCov_9fa48("4232", "4233", "4234"), !user)) {
              if (stryMutAct_9fa48("4235")) {
                {}
              } else {
                stryCov_9fa48("4235");
                return NextResponse.json(stryMutAct_9fa48("4236") ? {} : (stryCov_9fa48("4236"), {
                  error: stryMutAct_9fa48("4237") ? "" : (stryCov_9fa48("4237"), 'No autorizado')
                }), stryMutAct_9fa48("4238") ? {} : (stryCov_9fa48("4238"), {
                  status: 401
                }));
              }
            }

            // Detectar si es FormData o JSON
            const contentType = stryMutAct_9fa48("4241") ? request.headers.get('content-type') && '' : stryMutAct_9fa48("4240") ? false : stryMutAct_9fa48("4239") ? true : (stryCov_9fa48("4239", "4240", "4241"), request.headers.get(stryMutAct_9fa48("4242") ? "" : (stryCov_9fa48("4242"), 'content-type')) || (stryMutAct_9fa48("4243") ? "Stryker was here!" : (stryCov_9fa48("4243"), '')));
            let exams: z.infer<typeof examImportSchema>[];
            if (stryMutAct_9fa48("4245") ? false : stryMutAct_9fa48("4244") ? true : (stryCov_9fa48("4244", "4245"), contentType.includes(stryMutAct_9fa48("4246") ? "" : (stryCov_9fa48("4246"), 'multipart/form-data')))) {
              if (stryMutAct_9fa48("4247")) {
                {}
              } else {
                stryCov_9fa48("4247");
                // Manejar FormData
                const formData = await request.formData();
                const examsArray: z.infer<typeof examImportSchema>[] = stryMutAct_9fa48("4248") ? ["Stryker was here"] : (stryCov_9fa48("4248"), []);

                // Extraer exámenes del FormData
                let index = 0;
                while (stryMutAct_9fa48("4249") ? false : (stryCov_9fa48("4249"), formData.has(stryMutAct_9fa48("4250") ? `` : (stryCov_9fa48("4250"), `exams[${index}][inputType]`)))) {
                  if (stryMutAct_9fa48("4251")) {
                    {}
                  } else {
                    stryCov_9fa48("4251");
                    const inputType = formData.get(`exams[${index}][inputType]`) as string;
                    const pdfFile = formData.get(`exams[${index}][pdfFile]`) as File | null;
                    const pdfUrl = formData.get(`exams[${index}][pdfUrl]`) as string | null;
                    examsArray.push(stryMutAct_9fa48("4252") ? {} : (stryCov_9fa48("4252"), {
                      inputType: inputType as 'url' | 'file',
                      pdfUrl: stryMutAct_9fa48("4255") ? pdfUrl && undefined : stryMutAct_9fa48("4254") ? false : stryMutAct_9fa48("4253") ? true : (stryCov_9fa48("4253", "4254", "4255"), pdfUrl || undefined),
                      pdfFile: stryMutAct_9fa48("4258") ? pdfFile && undefined : stryMutAct_9fa48("4257") ? false : stryMutAct_9fa48("4256") ? true : (stryCov_9fa48("4256", "4257", "4258"), pdfFile || undefined),
                      subjectName: formData.get(`exams[${index}][subjectName]`) as string,
                      examTitle: formData.get(`exams[${index}][examTitle]`) as string,
                      examType: formData.get(`exams[${index}][examType]`) as string,
                      year: formData.get(`exams[${index}][year]`) as string
                    }));
                    stryMutAct_9fa48("4259") ? index-- : (stryCov_9fa48("4259"), index++);
                  }
                }

                // Validar con Zod
                const validation = importExamsSchema.safeParse(stryMutAct_9fa48("4260") ? {} : (stryCov_9fa48("4260"), {
                  exams: examsArray
                }));
                if (stryMutAct_9fa48("4263") ? false : stryMutAct_9fa48("4262") ? true : stryMutAct_9fa48("4261") ? validation.success : (stryCov_9fa48("4261", "4262", "4263"), !validation.success)) {
                  if (stryMutAct_9fa48("4264")) {
                    {}
                  } else {
                    stryCov_9fa48("4264");
                    return NextResponse.json(stryMutAct_9fa48("4265") ? {} : (stryCov_9fa48("4265"), {
                      error: stryMutAct_9fa48("4266") ? "" : (stryCov_9fa48("4266"), 'Datos inválidos'),
                      details: validation.error.issues
                    }), stryMutAct_9fa48("4267") ? {} : (stryCov_9fa48("4267"), {
                      status: 400
                    }));
                  }
                }
                exams = validation.data.exams;
              }
            } else {
              if (stryMutAct_9fa48("4268")) {
                {}
              } else {
                stryCov_9fa48("4268");
                // Manejar JSON
                const validation = await validateBody(request, importExamsSchema);
                if (stryMutAct_9fa48("4271") ? false : stryMutAct_9fa48("4270") ? true : stryMutAct_9fa48("4269") ? validation.success : (stryCov_9fa48("4269", "4270", "4271"), !validation.success)) {
                  if (stryMutAct_9fa48("4272")) {
                    {}
                  } else {
                    stryCov_9fa48("4272");
                    return validation.error;
                  }
                }
                exams = validation.data.exams;
              }
            }

            // Importar cada examen
            const results = stryMutAct_9fa48("4273") ? ["Stryker was here"] : (stryCov_9fa48("4273"), []);
            for (const examData of exams) {
              if (stryMutAct_9fa48("4274")) {
                {}
              } else {
                stryCov_9fa48("4274");
                try {
                  if (stryMutAct_9fa48("4275")) {
                    {}
                  } else {
                    stryCov_9fa48("4275");
                    const result = await importExam(examData);
                    results.push(stryMutAct_9fa48("4276") ? {} : (stryCov_9fa48("4276"), {
                      success: stryMutAct_9fa48("4277") ? false : (stryCov_9fa48("4277"), true),
                      examTitle: result.examTitle,
                      message: stryMutAct_9fa48("4278") ? `` : (stryCov_9fa48("4278"), `Examen importado exitosamente: ${result.questionsCount} preguntas creadas`),
                      details: stryMutAct_9fa48("4279") ? `` : (stryCov_9fa48("4279"), `ID: ${result.examId}\n⚠️ IMPORTANTE: Las respuestas correctas deben marcarse manualmente. Por defecto, todas las opciones están marcadas como incorrectas.`)
                    }));
                  }
                } catch (error) {
                  if (stryMutAct_9fa48("4280")) {
                    {}
                  } else {
                    stryCov_9fa48("4280");
                    results.push(stryMutAct_9fa48("4281") ? {} : (stryCov_9fa48("4281"), {
                      success: stryMutAct_9fa48("4282") ? true : (stryCov_9fa48("4282"), false),
                      examTitle: stryMutAct_9fa48("4285") ? examData.examTitle && 'Examen desconocido' : stryMutAct_9fa48("4284") ? false : stryMutAct_9fa48("4283") ? true : (stryCov_9fa48("4283", "4284", "4285"), examData.examTitle || (stryMutAct_9fa48("4286") ? "" : (stryCov_9fa48("4286"), 'Examen desconocido'))),
                      message: error instanceof Error ? error.message : stryMutAct_9fa48("4287") ? "" : (stryCov_9fa48("4287"), 'Error desconocido')
                    }));
                  }
                }
              }
            }
            return NextResponse.json(stryMutAct_9fa48("4288") ? {} : (stryCov_9fa48("4288"), {
              success: stryMutAct_9fa48("4289") ? false : (stryCov_9fa48("4289"), true),
              results,
              total: exams.length,
              successful: stryMutAct_9fa48("4290") ? results.length : (stryCov_9fa48("4290"), results.filter(stryMutAct_9fa48("4291") ? () => undefined : (stryCov_9fa48("4291"), r => r.success)).length)
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("4292")) {
            {}
          } else {
            stryCov_9fa48("4292");
            return NextResponse.json(stryMutAct_9fa48("4293") ? {} : (stryCov_9fa48("4293"), {
              error: stryMutAct_9fa48("4294") ? "" : (stryCov_9fa48("4294"), 'Error al importar exámenes'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("4295") ? "" : (stryCov_9fa48("4295"), 'Error desconocido')
            }), stryMutAct_9fa48("4296") ? {} : (stryCov_9fa48("4296"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("4297") ? "" : (stryCov_9fa48("4297"), 'write'));
  }
}