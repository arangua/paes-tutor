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
import { prisma } from '@/lib/prisma';
import fs from 'fs/promises';
import path from 'path';
export const runtime = stryMutAct_9fa48("3128") ? "" : (stryCov_9fa48("3128"), 'nodejs');

// Importación de pdf-parse v2
const {
  PDFParse
} = require('pdf-parse');

// Schema de validación
const answerKeyImportSchema = z.object(stryMutAct_9fa48("3129") ? {} : (stryCov_9fa48("3129"), {
  pdfFile: z.custom<File>(stryMutAct_9fa48("3130") ? () => undefined : (stryCov_9fa48("3130"), val => val instanceof File)),
  // File object from FormData
  subjectName: stryMutAct_9fa48("3131") ? z.string().max(1) : (stryCov_9fa48("3131"), z.string().min(1)),
  year: stryMutAct_9fa48("3132") ? z.string().max(1) : (stryCov_9fa48("3132"), z.string().min(1)),
  examId: z.string().optional() // Opcional: si se proporciona, se usa directamente
}));

// Mapeo de asignaturas
const SUBJECT_MAPPING: Record<string, string> = stryMutAct_9fa48("3133") ? {} : (stryCov_9fa48("3133"), {
  'Competencia Lectora': stryMutAct_9fa48("3134") ? "" : (stryCov_9fa48("3134"), 'LECTORA'),
  'Matemática M1': stryMutAct_9fa48("3135") ? "" : (stryCov_9fa48("3135"), 'M1'),
  'Matemática M2': stryMutAct_9fa48("3136") ? "" : (stryCov_9fa48("3136"), 'M2'),
  'Ciencias - Biología': stryMutAct_9fa48("3137") ? "" : (stryCov_9fa48("3137"), 'BIO'),
  'Ciencias - Física': stryMutAct_9fa48("3138") ? "" : (stryCov_9fa48("3138"), 'FIS'),
  'Ciencias - Química': stryMutAct_9fa48("3139") ? "" : (stryCov_9fa48("3139"), 'QUI'),
  'Historia y Ciencias Sociales': stryMutAct_9fa48("3140") ? "" : (stryCov_9fa48("3140"), 'HIST')
});

// Directorios
const PDFS_DIR = path.join(process.cwd(), stryMutAct_9fa48("3141") ? "" : (stryCov_9fa48("3141"), 'data'), stryMutAct_9fa48("3142") ? "" : (stryCov_9fa48("3142"), 'pdfs'));
async function ensureDirectories() {
  if (stryMutAct_9fa48("3143")) {
    {}
  } else {
    stryCov_9fa48("3143");
    await fs.mkdir(PDFS_DIR, stryMutAct_9fa48("3144") ? {} : (stryCov_9fa48("3144"), {
      recursive: stryMutAct_9fa48("3145") ? false : (stryCov_9fa48("3145"), true)
    }));
  }
}
async function extractTextFromPDF(pdfPath: string): Promise<string> {
  if (stryMutAct_9fa48("3146")) {
    {}
  } else {
    stryCov_9fa48("3146");
    let dataBuffer: Buffer;
    try {
      if (stryMutAct_9fa48("3147")) {
        {}
      } else {
        stryCov_9fa48("3147");
        dataBuffer = await fs.readFile(pdfPath);
      }
    } catch (error) {
      if (stryMutAct_9fa48("3148")) {
        {}
      } else {
        stryCov_9fa48("3148");
        throw new Error(stryMutAct_9fa48("3149") ? `` : (stryCov_9fa48("3149"), `Error al leer el archivo PDF: ${error instanceof Error ? error.message : stryMutAct_9fa48("3150") ? "" : (stryCov_9fa48("3150"), 'Error desconocido')}`));
      }
    }

    // Validar que el archivo no esté vacío
    if (stryMutAct_9fa48("3153") ? dataBuffer.length !== 0 : stryMutAct_9fa48("3152") ? false : stryMutAct_9fa48("3151") ? true : (stryCov_9fa48("3151", "3152", "3153"), dataBuffer.length === 0)) {
      if (stryMutAct_9fa48("3154")) {
        {}
      } else {
        stryCov_9fa48("3154");
        throw new Error(stryMutAct_9fa48("3155") ? "" : (stryCov_9fa48("3155"), 'El archivo PDF está vacío'));
      }
    }

    // Validar que el archivo comience con el header PDF (mínima validación)
    const pdfHeader = dataBuffer.subarray(0, 4).toString();
    if (stryMutAct_9fa48("3158") ? pdfHeader === '%PDF' : stryMutAct_9fa48("3157") ? false : stryMutAct_9fa48("3156") ? true : (stryCov_9fa48("3156", "3157", "3158"), pdfHeader !== (stryMutAct_9fa48("3159") ? "" : (stryCov_9fa48("3159"), '%PDF')))) {
      if (stryMutAct_9fa48("3160")) {
        {}
      } else {
        stryCov_9fa48("3160");
        throw new Error(stryMutAct_9fa48("3161") ? "" : (stryCov_9fa48("3161"), 'El archivo no parece ser un PDF válido (no contiene el header PDF)'));
      }
    }
    try {
      if (stryMutAct_9fa48("3162")) {
        {}
      } else {
        stryCov_9fa48("3162");
        const parser = new PDFParse(stryMutAct_9fa48("3163") ? {} : (stryCov_9fa48("3163"), {
          data: dataBuffer
        }));
        await parser.load();
        const result = await parser.getText();

        // Validar que se extrajo texto
        if (stryMutAct_9fa48("3166") ? (!result || !result.text) && result.text.trim().length === 0 : stryMutAct_9fa48("3165") ? false : stryMutAct_9fa48("3164") ? true : (stryCov_9fa48("3164", "3165", "3166"), (stryMutAct_9fa48("3168") ? !result && !result.text : stryMutAct_9fa48("3167") ? false : (stryCov_9fa48("3167", "3168"), (stryMutAct_9fa48("3169") ? result : (stryCov_9fa48("3169"), !result)) || (stryMutAct_9fa48("3170") ? result.text : (stryCov_9fa48("3170"), !result.text)))) || (stryMutAct_9fa48("3172") ? result.text.trim().length !== 0 : stryMutAct_9fa48("3171") ? false : (stryCov_9fa48("3171", "3172"), (stryMutAct_9fa48("3173") ? result.text.length : (stryCov_9fa48("3173"), result.text.trim().length)) === 0)))) {
          if (stryMutAct_9fa48("3174")) {
            {}
          } else {
            stryCov_9fa48("3174");
            throw new Error(stryMutAct_9fa48("3175") ? "" : (stryCov_9fa48("3175"), 'El PDF no contiene texto extraíble. Puede ser un PDF escaneado o protegido.'));
          }
        }
        return result.text;
      }
    } catch (error) {
      if (stryMutAct_9fa48("3176")) {
        {}
      } else {
        stryCov_9fa48("3176");
        if (stryMutAct_9fa48("3179") ? error instanceof Error || error.message.includes('no contiene texto') : stryMutAct_9fa48("3178") ? false : stryMutAct_9fa48("3177") ? true : (stryCov_9fa48("3177", "3178", "3179"), error instanceof Error && error.message.includes(stryMutAct_9fa48("3180") ? "" : (stryCov_9fa48("3180"), 'no contiene texto')))) {
          if (stryMutAct_9fa48("3181")) {
            {}
          } else {
            stryCov_9fa48("3181");
            throw error;
          }
        }
        throw new Error(stryMutAct_9fa48("3182") ? `` : (stryCov_9fa48("3182"), `Error al parsear PDF: ${error instanceof Error ? error.message : stryMutAct_9fa48("3183") ? "" : (stryCov_9fa48("3183"), 'Error desconocido')}`));
      }
    }
  }
}

/**
 * Detecta las respuestas correctas desde el texto del PDF del clavijero
 * Busca patrones comunes como "1-A", "1. A", "Respuestas: 1-A, 2-B..."
 * @param text Texto completo del PDF
 * @returns Mapa de número de pregunta -> letra de respuesta correcta
 */
function detectCorrectAnswers(text: string): Map<number, string> {
  if (stryMutAct_9fa48("3184")) {
    {}
  } else {
    stryCov_9fa48("3184");
    const answerMap = new Map<number, string>();

    // Normalizar el texto
    const normalizedText = stryMutAct_9fa48("3185") ? text.replace(/\r\n/g, '\n').replace(/\r/g, '\n').toLowerCase() : (stryCov_9fa48("3185"), text.replace(/\r\n/g, stryMutAct_9fa48("3186") ? "" : (stryCov_9fa48("3186"), '\n')).replace(/\r/g, stryMutAct_9fa48("3187") ? "" : (stryCov_9fa48("3187"), '\n')).toUpperCase());

    // Buscar sección de respuestas (típicamente al final del documento)
    const answerSectionPatterns = stryMutAct_9fa48("3188") ? [] : (stryCov_9fa48("3188"), [stryMutAct_9fa48("3200") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3199") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3198") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3197") ? /RESPUESTAS?[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3196") ? /RESPUESTAS?[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3195") ? /RESPUESTAS?[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3194") ? /RESPUESTAS?[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3193") ? /RESPUESTAS?[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3192") ? /RESPUESTAS?[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3191") ? /RESPUESTAS?[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3190") ? /RESPUESTAS?[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3189") ? /RESPUESTAS[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3189", "3190", "3191", "3192", "3193", "3194", "3195", "3196", "3197", "3198", "3199", "3200"), /RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i), stryMutAct_9fa48("3216") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3215") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3214") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3213") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3212") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3211") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3210") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3209") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3208") ? /CLAVE\s+DE\s+RESPUESTAS?[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3207") ? /CLAVE\s+DE\s+RESPUESTAS?[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3206") ? /CLAVE\s+DE\s+RESPUESTAS?[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3205") ? /CLAVE\s+DE\s+RESPUESTAS[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3204") ? /CLAVE\s+DE\S+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3203") ? /CLAVE\s+DE\sRESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3202") ? /CLAVE\S+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3201") ? /CLAVE\sDE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3201", "3202", "3203", "3204", "3205", "3206", "3207", "3208", "3209", "3210", "3211", "3212", "3213", "3214", "3215", "3216"), /CLAVE\s+DE\s+RESPUESTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i), stryMutAct_9fa48("3231") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3230") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3229") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3228") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3227") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3226") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3225") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3224") ? /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3223") ? /RESPUESTAS?\s+CORRECTAS?[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3222") ? /RESPUESTAS?\s+CORRECTAS?[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3221") ? /RESPUESTAS?\s+CORRECTAS?[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3220") ? /RESPUESTAS?\s+CORRECTAS[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3219") ? /RESPUESTAS?\S+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3218") ? /RESPUESTAS?\sCORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3217") ? /RESPUESTAS\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3217", "3218", "3219", "3220", "3221", "3222", "3223", "3224", "3225", "3226", "3227", "3228", "3229", "3230", "3231"), /RESPUESTAS?\s+CORRECTAS?[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i), stryMutAct_9fa48("3242") ? /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[^A-Z]{3,}|$)/i : stryMutAct_9fa48("3241") ? /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]|$)/i : stryMutAct_9fa48("3240") ? /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,})/i : stryMutAct_9fa48("3239") ? /CLAVE[:\s]+([\s\S]+?)(?!\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3238") ? /CLAVE[:\s]+([\s\s]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3237") ? /CLAVE[:\s]+([\S\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3236") ? /CLAVE[:\s]+([^\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3235") ? /CLAVE[:\s]+([\s\S])(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3234") ? /CLAVE[:\S]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3233") ? /CLAVE[^:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : stryMutAct_9fa48("3232") ? /CLAVE[:\s]([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i : (stryCov_9fa48("3232", "3233", "3234", "3235", "3236", "3237", "3238", "3239", "3240", "3241", "3242"), /CLAVE[:\s]+([\s\S]+?)(?=\n\n|\n[A-Z]{3,}|$)/i)]);
    let answerSection = stryMutAct_9fa48("3243") ? "Stryker was here!" : (stryCov_9fa48("3243"), '');
    for (const pattern of answerSectionPatterns) {
      if (stryMutAct_9fa48("3244")) {
        {}
      } else {
        stryCov_9fa48("3244");
        const match = normalizedText.match(pattern);
        if (stryMutAct_9fa48("3247") ? match || match[1] : stryMutAct_9fa48("3246") ? false : stryMutAct_9fa48("3245") ? true : (stryCov_9fa48("3245", "3246", "3247"), match && match[1])) {
          if (stryMutAct_9fa48("3248")) {
            {}
          } else {
            stryCov_9fa48("3248");
            answerSection = match[1];
            break;
          }
        }
      }
    }

    // Si no se encuentra una sección específica, buscar en el último 30% del texto
    if (stryMutAct_9fa48("3251") ? false : stryMutAct_9fa48("3250") ? true : stryMutAct_9fa48("3249") ? answerSection : (stryCov_9fa48("3249", "3250", "3251"), !answerSection)) {
      if (stryMutAct_9fa48("3252")) {
        {}
      } else {
        stryCov_9fa48("3252");
        const textLength = normalizedText.length;
        const lastSection = stryMutAct_9fa48("3253") ? normalizedText : (stryCov_9fa48("3253"), normalizedText.substring(Math.floor(stryMutAct_9fa48("3254") ? textLength / 0.7 : (stryCov_9fa48("3254"), textLength * 0.7))));
        answerSection = lastSection;
      }
    }

    // Múltiples patrones para detectar respuestas
    const answerPatterns = stryMutAct_9fa48("3255") ? [] : (stryCov_9fa48("3255"), [// Formato: "1-A", "1-A,", "1-A ", "1 - A"
    stryMutAct_9fa48("3261") ? /(\d+)[\s\-\.\)]+([^A-E])/g : stryMutAct_9fa48("3260") ? /(\d+)[\S\-\.\)]+([A-E])/g : stryMutAct_9fa48("3259") ? /(\d+)[^\s\-\.\)]+([A-E])/g : stryMutAct_9fa48("3258") ? /(\d+)[\s\-\.\)]([A-E])/g : stryMutAct_9fa48("3257") ? /(\D+)[\s\-\.\)]+([A-E])/g : stryMutAct_9fa48("3256") ? /(\d)[\s\-\.\)]+([A-E])/g : (stryCov_9fa48("3256", "3257", "3258", "3259", "3260", "3261"), /(\d+)[\s\-\.\)]+([A-E])/g), // Formato: "1. A", "1) A"
    stryMutAct_9fa48("3267") ? /(\d+)[\.\)]\s*([^A-E])/g : stryMutAct_9fa48("3266") ? /(\d+)[\.\)]\S*([A-E])/g : stryMutAct_9fa48("3265") ? /(\d+)[\.\)]\s([A-E])/g : stryMutAct_9fa48("3264") ? /(\d+)[^\.\)]\s*([A-E])/g : stryMutAct_9fa48("3263") ? /(\D+)[\.\)]\s*([A-E])/g : stryMutAct_9fa48("3262") ? /(\d)[\.\)]\s*([A-E])/g : (stryCov_9fa48("3262", "3263", "3264", "3265", "3266", "3267"), /(\d+)[\.\)]\s*([A-E])/g), // Formato: "1 A" (con espacio)
    stryMutAct_9fa48("3275") ? /(\d+)\s+([A-E])(?=\S|,|$)/g : stryMutAct_9fa48("3274") ? /(\d+)\s+([A-E])(?=\s|,)/g : stryMutAct_9fa48("3273") ? /(\d+)\s+([A-E])(?!\s|,|$)/g : stryMutAct_9fa48("3272") ? /(\d+)\s+([^A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3271") ? /(\d+)\S+([A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3270") ? /(\d+)\s([A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3269") ? /(\D+)\s+([A-E])(?=\s|,|$)/g : stryMutAct_9fa48("3268") ? /(\d)\s+([A-E])(?=\s|,|$)/g : (stryCov_9fa48("3268", "3269", "3270", "3271", "3272", "3273", "3274", "3275"), /(\d+)\s+([A-E])(?=\s|,|$)/g), // Formato en lista: "1) A", "2) B"
    stryMutAct_9fa48("3281") ? /^(\d+)\)\s*([^A-E])/gm : stryMutAct_9fa48("3280") ? /^(\d+)\)\S*([A-E])/gm : stryMutAct_9fa48("3279") ? /^(\d+)\)\s([A-E])/gm : stryMutAct_9fa48("3278") ? /^(\D+)\)\s*([A-E])/gm : stryMutAct_9fa48("3277") ? /^(\d)\)\s*([A-E])/gm : stryMutAct_9fa48("3276") ? /(\d+)\)\s*([A-E])/gm : (stryCov_9fa48("3276", "3277", "3278", "3279", "3280", "3281"), /^(\d+)\)\s*([A-E])/gm)]);
    for (const pattern of answerPatterns) {
      if (stryMutAct_9fa48("3282")) {
        {}
      } else {
        stryCov_9fa48("3282");
        const matches = Array.from(answerSection.matchAll(pattern));
        for (const match of matches) {
          if (stryMutAct_9fa48("3283")) {
            {}
          } else {
            stryCov_9fa48("3283");
            const questionNum = parseInt(match[1], 10);
            const answerLetter = stryMutAct_9fa48("3284") ? match[2].toLowerCase() : (stryCov_9fa48("3284"), match[2].toUpperCase());

            // Validar que la letra esté en el rango A-E
            // Aumentar límite a 150 para exámenes más largos
            if (stryMutAct_9fa48("3287") ? questionNum > 0 && questionNum <= 150 || /^[A-E]$/.test(answerLetter) : stryMutAct_9fa48("3286") ? false : stryMutAct_9fa48("3285") ? true : (stryCov_9fa48("3285", "3286", "3287"), (stryMutAct_9fa48("3289") ? questionNum > 0 || questionNum <= 150 : stryMutAct_9fa48("3288") ? true : (stryCov_9fa48("3288", "3289"), (stryMutAct_9fa48("3292") ? questionNum <= 0 : stryMutAct_9fa48("3291") ? questionNum >= 0 : stryMutAct_9fa48("3290") ? true : (stryCov_9fa48("3290", "3291", "3292"), questionNum > 0)) && (stryMutAct_9fa48("3295") ? questionNum > 150 : stryMutAct_9fa48("3294") ? questionNum < 150 : stryMutAct_9fa48("3293") ? true : (stryCov_9fa48("3293", "3294", "3295"), questionNum <= 150)))) && (stryMutAct_9fa48("3298") ? /^[^A-E]$/ : stryMutAct_9fa48("3297") ? /^[A-E]/ : stryMutAct_9fa48("3296") ? /[A-E]$/ : (stryCov_9fa48("3296", "3297", "3298"), /^[A-E]$/)).test(answerLetter))) {
              if (stryMutAct_9fa48("3299")) {
                {}
              } else {
                stryCov_9fa48("3299");
                // Si ya existe una respuesta para esta pregunta, mantener la primera encontrada
                if (stryMutAct_9fa48("3302") ? false : stryMutAct_9fa48("3301") ? true : stryMutAct_9fa48("3300") ? answerMap.has(questionNum) : (stryCov_9fa48("3300", "3301", "3302"), !answerMap.has(questionNum))) {
                  if (stryMutAct_9fa48("3303")) {
                    {}
                  } else {
                    stryCov_9fa48("3303");
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
async function importAnswerKey(data: z.infer<typeof answerKeyImportSchema>) {
  if (stryMutAct_9fa48("3304")) {
    {}
  } else {
    stryCov_9fa48("3304");
    const {
      pdfFile,
      subjectName,
      year,
      examId
    } = data;
    let pdfPath: string | null = null;
    try {
      if (stryMutAct_9fa48("3305")) {
        {}
      } else {
        stryCov_9fa48("3305");
        // Obtener código de asignatura
        const subjectCode = SUBJECT_MAPPING[subjectName];
        if (stryMutAct_9fa48("3308") ? false : stryMutAct_9fa48("3307") ? true : stryMutAct_9fa48("3306") ? subjectCode : (stryCov_9fa48("3306", "3307", "3308"), !subjectCode)) {
          if (stryMutAct_9fa48("3309")) {
            {}
          } else {
            stryCov_9fa48("3309");
            throw new Error(stryMutAct_9fa48("3310") ? `` : (stryCov_9fa48("3310"), `Asignatura no encontrada: ${subjectName}`));
          }
        }

        // Obtener asignatura de la BD
        const subject = await prisma.subject.findUnique(stryMutAct_9fa48("3311") ? {} : (stryCov_9fa48("3311"), {
          where: stryMutAct_9fa48("3312") ? {} : (stryCov_9fa48("3312"), {
            codigo: subjectCode
          })
        }));
        if (stryMutAct_9fa48("3315") ? false : stryMutAct_9fa48("3314") ? true : stryMutAct_9fa48("3313") ? subject : (stryCov_9fa48("3313", "3314", "3315"), !subject)) {
          if (stryMutAct_9fa48("3316")) {
            {}
          } else {
            stryCov_9fa48("3316");
            throw new Error(stryMutAct_9fa48("3317") ? `` : (stryCov_9fa48("3317"), `Asignatura ${subjectCode} no existe en la base de datos`));
          }
        }

        // Buscar el examen correspondiente
        let exam;
        if (stryMutAct_9fa48("3319") ? false : stryMutAct_9fa48("3318") ? true : (stryCov_9fa48("3318", "3319"), examId)) {
          if (stryMutAct_9fa48("3320")) {
            {}
          } else {
            stryCov_9fa48("3320");
            // Si se proporciona examId, usarlo directamente
            exam = await prisma.exam.findUnique(stryMutAct_9fa48("3321") ? {} : (stryCov_9fa48("3321"), {
              where: stryMutAct_9fa48("3322") ? {} : (stryCov_9fa48("3322"), {
                id: examId
              }),
              include: stryMutAct_9fa48("3323") ? {} : (stryCov_9fa48("3323"), {
                questions: stryMutAct_9fa48("3324") ? {} : (stryCov_9fa48("3324"), {
                  include: stryMutAct_9fa48("3325") ? {} : (stryCov_9fa48("3325"), {
                    question: stryMutAct_9fa48("3326") ? {} : (stryCov_9fa48("3326"), {
                      include: stryMutAct_9fa48("3327") ? {} : (stryCov_9fa48("3327"), {
                        options: stryMutAct_9fa48("3328") ? false : (stryCov_9fa48("3328"), true)
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("3329") ? {} : (stryCov_9fa48("3329"), {
                    orden: stryMutAct_9fa48("3330") ? "" : (stryCov_9fa48("3330"), 'asc')
                  })
                })
              })
            }));
            if (stryMutAct_9fa48("3333") ? false : stryMutAct_9fa48("3332") ? true : stryMutAct_9fa48("3331") ? exam : (stryCov_9fa48("3331", "3332", "3333"), !exam)) {
              if (stryMutAct_9fa48("3334")) {
                {}
              } else {
                stryCov_9fa48("3334");
                throw new Error(stryMutAct_9fa48("3335") ? `` : (stryCov_9fa48("3335"), `Examen con ID ${examId} no encontrado`));
              }
            }
            if (stryMutAct_9fa48("3338") ? exam.subjectId === subject.id : stryMutAct_9fa48("3337") ? false : stryMutAct_9fa48("3336") ? true : (stryCov_9fa48("3336", "3337", "3338"), exam.subjectId !== subject.id)) {
              if (stryMutAct_9fa48("3339")) {
                {}
              } else {
                stryCov_9fa48("3339");
                throw new Error(stryMutAct_9fa48("3340") ? `` : (stryCov_9fa48("3340"), `El examen no corresponde a la asignatura ${subjectName}`));
              }
            }
          }
        } else {
          if (stryMutAct_9fa48("3341")) {
            {}
          } else {
            stryCov_9fa48("3341");
            // Buscar automáticamente por año y asignatura
            // Buscar en fuente (formato: "DEMRE 2026") y también en título/descripción
            const exams = await prisma.exam.findMany(stryMutAct_9fa48("3342") ? {} : (stryCov_9fa48("3342"), {
              where: stryMutAct_9fa48("3343") ? {} : (stryCov_9fa48("3343"), {
                subjectId: subject.id,
                OR: stryMutAct_9fa48("3344") ? [] : (stryCov_9fa48("3344"), [stryMutAct_9fa48("3345") ? {} : (stryCov_9fa48("3345"), {
                  fuente: stryMutAct_9fa48("3346") ? {} : (stryCov_9fa48("3346"), {
                    contains: year
                  })
                }), stryMutAct_9fa48("3347") ? {} : (stryCov_9fa48("3347"), {
                  titulo: stryMutAct_9fa48("3348") ? {} : (stryCov_9fa48("3348"), {
                    contains: year
                  })
                }), stryMutAct_9fa48("3349") ? {} : (stryCov_9fa48("3349"), {
                  descripcion: stryMutAct_9fa48("3350") ? {} : (stryCov_9fa48("3350"), {
                    contains: year
                  })
                })])
              }),
              include: stryMutAct_9fa48("3351") ? {} : (stryCov_9fa48("3351"), {
                questions: stryMutAct_9fa48("3352") ? {} : (stryCov_9fa48("3352"), {
                  include: stryMutAct_9fa48("3353") ? {} : (stryCov_9fa48("3353"), {
                    question: stryMutAct_9fa48("3354") ? {} : (stryCov_9fa48("3354"), {
                      include: stryMutAct_9fa48("3355") ? {} : (stryCov_9fa48("3355"), {
                        options: stryMutAct_9fa48("3356") ? false : (stryCov_9fa48("3356"), true)
                      })
                    })
                  }),
                  orderBy: stryMutAct_9fa48("3357") ? {} : (stryCov_9fa48("3357"), {
                    orden: stryMutAct_9fa48("3358") ? "" : (stryCov_9fa48("3358"), 'asc')
                  })
                })
              }),
              orderBy: stryMutAct_9fa48("3359") ? {} : (stryCov_9fa48("3359"), {
                createdAt: stryMutAct_9fa48("3360") ? "" : (stryCov_9fa48("3360"), 'desc')
              })
            }));
            if (stryMutAct_9fa48("3363") ? exams.length !== 0 : stryMutAct_9fa48("3362") ? false : stryMutAct_9fa48("3361") ? true : (stryCov_9fa48("3361", "3362", "3363"), exams.length === 0)) {
              if (stryMutAct_9fa48("3364")) {
                {}
              } else {
                stryCov_9fa48("3364");
                throw new Error((stryMutAct_9fa48("3365") ? `` : (stryCov_9fa48("3365"), `No se encontró ningún examen de ${subjectName} del año ${year}. `)) + (stryMutAct_9fa48("3366") ? `` : (stryCov_9fa48("3366"), `Por favor, importa el examen primero o selecciona el examen manualmente.`)));
              }
            }
            if (stryMutAct_9fa48("3370") ? exams.length <= 1 : stryMutAct_9fa48("3369") ? exams.length >= 1 : stryMutAct_9fa48("3368") ? false : stryMutAct_9fa48("3367") ? true : (stryCov_9fa48("3367", "3368", "3369", "3370"), exams.length > 1)) {
              if (stryMutAct_9fa48("3371")) {
                {}
              } else {
                stryCov_9fa48("3371");
                throw new Error((stryMutAct_9fa48("3372") ? `` : (stryCov_9fa48("3372"), `Se encontraron múltiples exámenes de ${subjectName} del año ${year}. `)) + (stryMutAct_9fa48("3373") ? `` : (stryCov_9fa48("3373"), `Por favor, especifica el ID del examen o importa el clavijero desde la página de importación.`)));
              }
            }
            exam = exams[0];
          }
        }

        // Validar que el examen tenga preguntas
        if (stryMutAct_9fa48("3376") ? !exam.questions && exam.questions.length === 0 : stryMutAct_9fa48("3375") ? false : stryMutAct_9fa48("3374") ? true : (stryCov_9fa48("3374", "3375", "3376"), (stryMutAct_9fa48("3377") ? exam.questions : (stryCov_9fa48("3377"), !exam.questions)) || (stryMutAct_9fa48("3379") ? exam.questions.length !== 0 : stryMutAct_9fa48("3378") ? false : (stryCov_9fa48("3378", "3379"), exam.questions.length === 0)))) {
          if (stryMutAct_9fa48("3380")) {
            {}
          } else {
            stryCov_9fa48("3380");
            throw new Error(stryMutAct_9fa48("3381") ? "" : (stryCov_9fa48("3381"), 'El examen no tiene preguntas asociadas'));
          }
        }

        // Guardar PDF del clavijero
        await ensureDirectories();
        const pdfFileName = stryMutAct_9fa48("3382") ? `` : (stryCov_9fa48("3382"), `answer_key_${subjectCode}_${year}_${Date.now()}.pdf`);
        pdfPath = path.join(PDFS_DIR, pdfFileName);

        // Validar tipo de archivo (MIME type puede ser falsificado, pero es primera línea de defensa)
        if (stryMutAct_9fa48("3385") ? pdfFile.type || pdfFile.type !== 'application/pdf' : stryMutAct_9fa48("3384") ? false : stryMutAct_9fa48("3383") ? true : (stryCov_9fa48("3383", "3384", "3385"), pdfFile.type && (stryMutAct_9fa48("3387") ? pdfFile.type === 'application/pdf' : stryMutAct_9fa48("3386") ? true : (stryCov_9fa48("3386", "3387"), pdfFile.type !== (stryMutAct_9fa48("3388") ? "" : (stryCov_9fa48("3388"), 'application/pdf')))))) {
          if (stryMutAct_9fa48("3389")) {
            {}
          } else {
            stryCov_9fa48("3389");
            throw new Error(stryMutAct_9fa48("3390") ? "" : (stryCov_9fa48("3390"), 'El archivo debe ser un PDF válido (tipo MIME: application/pdf)'));
          }
        }

        // Validar extensión
        const fileName = stryMutAct_9fa48("3391") ? pdfFile.name.toUpperCase() : (stryCov_9fa48("3391"), pdfFile.name.toLowerCase());
        if (stryMutAct_9fa48("3394") ? false : stryMutAct_9fa48("3393") ? true : stryMutAct_9fa48("3392") ? fileName.endsWith('.pdf') : (stryCov_9fa48("3392", "3393", "3394"), !(stryMutAct_9fa48("3395") ? fileName.startsWith('.pdf') : (stryCov_9fa48("3395"), fileName.endsWith(stryMutAct_9fa48("3396") ? "" : (stryCov_9fa48("3396"), '.pdf')))))) {
          if (stryMutAct_9fa48("3397")) {
            {}
          } else {
            stryCov_9fa48("3397");
            throw new Error(stryMutAct_9fa48("3398") ? "" : (stryCov_9fa48("3398"), 'El archivo debe tener extensión .pdf'));
          }
        }

        // Validar tamaño (máximo 50 MB)
        const MAX_FILE_SIZE = stryMutAct_9fa48("3399") ? 50 * 1024 / 1024 : (stryCov_9fa48("3399"), (stryMutAct_9fa48("3400") ? 50 / 1024 : (stryCov_9fa48("3400"), 50 * 1024)) * 1024); // 50 MB
        if (stryMutAct_9fa48("3404") ? pdfFile.size <= MAX_FILE_SIZE : stryMutAct_9fa48("3403") ? pdfFile.size >= MAX_FILE_SIZE : stryMutAct_9fa48("3402") ? false : stryMutAct_9fa48("3401") ? true : (stryCov_9fa48("3401", "3402", "3403", "3404"), pdfFile.size > MAX_FILE_SIZE)) {
          if (stryMutAct_9fa48("3405")) {
            {}
          } else {
            stryCov_9fa48("3405");
            throw new Error(stryMutAct_9fa48("3406") ? `` : (stryCov_9fa48("3406"), `El archivo es demasiado grande. Tamaño máximo: ${stryMutAct_9fa48("3407") ? MAX_FILE_SIZE / 1024 * 1024 : (stryCov_9fa48("3407"), (stryMutAct_9fa48("3408") ? MAX_FILE_SIZE * 1024 : (stryCov_9fa48("3408"), MAX_FILE_SIZE / 1024)) / 1024)} MB. Tamaño actual: ${(stryMutAct_9fa48("3409") ? pdfFile.size / 1024 * 1024 : (stryCov_9fa48("3409"), (stryMutAct_9fa48("3410") ? pdfFile.size * 1024 : (stryCov_9fa48("3410"), pdfFile.size / 1024)) / 1024)).toFixed(2)} MB`));
          }
        }

        // Validar tamaño mínimo (un PDF válido debe tener al menos algunos bytes)
        const MIN_FILE_SIZE = 100; // 100 bytes mínimo
        if (stryMutAct_9fa48("3414") ? pdfFile.size >= MIN_FILE_SIZE : stryMutAct_9fa48("3413") ? pdfFile.size <= MIN_FILE_SIZE : stryMutAct_9fa48("3412") ? false : stryMutAct_9fa48("3411") ? true : (stryCov_9fa48("3411", "3412", "3413", "3414"), pdfFile.size < MIN_FILE_SIZE)) {
          if (stryMutAct_9fa48("3415")) {
            {}
          } else {
            stryCov_9fa48("3415");
            throw new Error(stryMutAct_9fa48("3416") ? "" : (stryCov_9fa48("3416"), 'El archivo es demasiado pequeño para ser un PDF válido'));
          }
        }

        // Guardar archivo
        const arrayBuffer = await pdfFile.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        await fs.writeFile(pdfPath, buffer);

        // Extraer texto del PDF
        const text = await extractTextFromPDF(pdfPath);

        // Detectar respuestas correctas
        const correctAnswers = detectCorrectAnswers(text);
        if (stryMutAct_9fa48("3419") ? correctAnswers.size !== 0 : stryMutAct_9fa48("3418") ? false : stryMutAct_9fa48("3417") ? true : (stryCov_9fa48("3417", "3418", "3419"), correctAnswers.size === 0)) {
          if (stryMutAct_9fa48("3420")) {
            {}
          } else {
            stryCov_9fa48("3420");
            throw new Error((stryMutAct_9fa48("3421") ? "" : (stryCov_9fa48("3421"), 'No se pudieron detectar respuestas correctas en el PDF del clavijero. ')) + (stryMutAct_9fa48("3422") ? "" : (stryCov_9fa48("3422"), 'Verifica que el formato sea correcto (ej: "1-A", "2-B", etc.)')));
          }
        }

        // Validar que se detectaron suficientes respuestas
        const totalQuestions = exam.questions.length;
        const detectedAnswers = correctAnswers.size;
        const coverage = stryMutAct_9fa48("3423") ? detectedAnswers / totalQuestions / 100 : (stryCov_9fa48("3423"), (stryMutAct_9fa48("3424") ? detectedAnswers * totalQuestions : (stryCov_9fa48("3424"), detectedAnswers / totalQuestions)) * 100);
        const {
          logger
        } = await import(stryMutAct_9fa48("3425") ? "" : (stryCov_9fa48("3425"), '@/lib/logger'));
        logger.info(stryMutAct_9fa48("3426") ? {} : (stryCov_9fa48("3426"), {
          detectedAnswers,
          totalQuestions,
          coverage: coverage.toFixed(1)
        }), stryMutAct_9fa48("3427") ? "" : (stryCov_9fa48("3427"), 'Respuestas detectadas en clavijero'));

        // Advertir si la cobertura es muy baja (menos del 50%)
        if (stryMutAct_9fa48("3431") ? coverage >= 50 : stryMutAct_9fa48("3430") ? coverage <= 50 : stryMutAct_9fa48("3429") ? false : stryMutAct_9fa48("3428") ? true : (stryCov_9fa48("3428", "3429", "3430", "3431"), coverage < 50)) {
          if (stryMutAct_9fa48("3432")) {
            {}
          } else {
            stryCov_9fa48("3432");
            logger.warn(stryMutAct_9fa48("3433") ? {} : (stryCov_9fa48("3433"), {
              detectedAnswers,
              totalQuestions
            }), stryMutAct_9fa48("3434") ? "" : (stryCov_9fa48("3434"), 'Clavijero podría estar incompleto'));
            // No lanzar error, pero advertir - puede que el clavijero tenga menos preguntas
          }
        }

        // Actualizar las opciones correctas en las preguntas
        let updatedCount = 0;
        let notFoundCount = 0;
        await prisma.$transaction(async tx => {
          if (stryMutAct_9fa48("3435")) {
            {}
          } else {
            stryCov_9fa48("3435");
            for (let i = 0; stryMutAct_9fa48("3438") ? i >= exam.questions.length : stryMutAct_9fa48("3437") ? i <= exam.questions.length : stryMutAct_9fa48("3436") ? false : (stryCov_9fa48("3436", "3437", "3438"), i < exam.questions.length); stryMutAct_9fa48("3439") ? i-- : (stryCov_9fa48("3439"), i++)) {
              if (stryMutAct_9fa48("3440")) {
                {}
              } else {
                stryCov_9fa48("3440");
                const examQuestion = exam.questions[i];
                const questionNumber = stryMutAct_9fa48("3441") ? i - 1 : (stryCov_9fa48("3441"), i + 1); // Número de pregunta (1-indexed)
                const correctAnswerLetter = correctAnswers.get(questionNumber);
                if (stryMutAct_9fa48("3444") ? false : stryMutAct_9fa48("3443") ? true : stryMutAct_9fa48("3442") ? correctAnswerLetter : (stryCov_9fa48("3442", "3443", "3444"), !correctAnswerLetter)) {
                  if (stryMutAct_9fa48("3445")) {
                    {}
                  } else {
                    stryCov_9fa48("3445");
                    stryMutAct_9fa48("3446") ? notFoundCount-- : (stryCov_9fa48("3446"), notFoundCount++);
                    continue;
                  }
                }
                const question = examQuestion.question;

                // Buscar la opción correcta por letra
                const correctOption = question.options.find(stryMutAct_9fa48("3447") ? () => undefined : (stryCov_9fa48("3447"), opt => stryMutAct_9fa48("3450") ? opt.letra.toUpperCase() !== correctAnswerLetter : stryMutAct_9fa48("3449") ? false : stryMutAct_9fa48("3448") ? true : (stryCov_9fa48("3448", "3449", "3450"), (stryMutAct_9fa48("3451") ? opt.letra.toLowerCase() : (stryCov_9fa48("3451"), opt.letra.toUpperCase())) === correctAnswerLetter)));
                if (stryMutAct_9fa48("3454") ? false : stryMutAct_9fa48("3453") ? true : stryMutAct_9fa48("3452") ? correctOption : (stryCov_9fa48("3452", "3453", "3454"), !correctOption)) {
                  if (stryMutAct_9fa48("3455")) {
                    {}
                  } else {
                    stryCov_9fa48("3455");
                    logger.warn(stryMutAct_9fa48("3456") ? {} : (stryCov_9fa48("3456"), {
                      correctAnswerLetter,
                      questionNumber
                    }), stryMutAct_9fa48("3457") ? "" : (stryCov_9fa48("3457"), 'No se encontró opción con letra en pregunta'));
                    stryMutAct_9fa48("3458") ? notFoundCount-- : (stryCov_9fa48("3458"), notFoundCount++);
                    continue;
                  }
                }

                // Validar que la pregunta tenga opciones
                if (stryMutAct_9fa48("3461") ? !question.options && question.options.length === 0 : stryMutAct_9fa48("3460") ? false : stryMutAct_9fa48("3459") ? true : (stryCov_9fa48("3459", "3460", "3461"), (stryMutAct_9fa48("3462") ? question.options : (stryCov_9fa48("3462"), !question.options)) || (stryMutAct_9fa48("3464") ? question.options.length !== 0 : stryMutAct_9fa48("3463") ? false : (stryCov_9fa48("3463", "3464"), question.options.length === 0)))) {
                  if (stryMutAct_9fa48("3465")) {
                    {}
                  } else {
                    stryCov_9fa48("3465");
                    logger.warn(stryMutAct_9fa48("3466") ? {} : (stryCov_9fa48("3466"), {
                      questionNumber
                    }), stryMutAct_9fa48("3467") ? "" : (stryCov_9fa48("3467"), 'Pregunta no tiene opciones'));
                    stryMutAct_9fa48("3468") ? notFoundCount-- : (stryCov_9fa48("3468"), notFoundCount++);
                    continue;
                  }
                }

                // Actualizar todas las opciones: marcar la correcta y desmarcar las demás
                // Solo actualizar si hay cambios para optimizar
                const needsUpdate = stryMutAct_9fa48("3469") ? question.options.every(opt => opt.id === correctOption.id && !opt.esCorrecta || opt.id !== correctOption.id && opt.esCorrecta) : (stryCov_9fa48("3469"), question.options.some(stryMutAct_9fa48("3470") ? () => undefined : (stryCov_9fa48("3470"), opt => stryMutAct_9fa48("3473") ? opt.id === correctOption.id && !opt.esCorrecta && opt.id !== correctOption.id && opt.esCorrecta : stryMutAct_9fa48("3472") ? false : stryMutAct_9fa48("3471") ? true : (stryCov_9fa48("3471", "3472", "3473"), (stryMutAct_9fa48("3475") ? opt.id === correctOption.id || !opt.esCorrecta : stryMutAct_9fa48("3474") ? false : (stryCov_9fa48("3474", "3475"), (stryMutAct_9fa48("3477") ? opt.id !== correctOption.id : stryMutAct_9fa48("3476") ? true : (stryCov_9fa48("3476", "3477"), opt.id === correctOption.id)) && (stryMutAct_9fa48("3478") ? opt.esCorrecta : (stryCov_9fa48("3478"), !opt.esCorrecta)))) || (stryMutAct_9fa48("3480") ? opt.id !== correctOption.id || opt.esCorrecta : stryMutAct_9fa48("3479") ? false : (stryCov_9fa48("3479", "3480"), (stryMutAct_9fa48("3482") ? opt.id === correctOption.id : stryMutAct_9fa48("3481") ? true : (stryCov_9fa48("3481", "3482"), opt.id !== correctOption.id)) && opt.esCorrecta))))));
                if (stryMutAct_9fa48("3484") ? false : stryMutAct_9fa48("3483") ? true : (stryCov_9fa48("3483", "3484"), needsUpdate)) {
                  if (stryMutAct_9fa48("3485")) {
                    {}
                  } else {
                    stryCov_9fa48("3485");
                    // Actualizar todas las opciones en paralelo
                    await Promise.all(question.options.map(async option => {
                      if (stryMutAct_9fa48("3486")) {
                        {}
                      } else {
                        stryCov_9fa48("3486");
                        await tx.questionOption.update(stryMutAct_9fa48("3487") ? {} : (stryCov_9fa48("3487"), {
                          where: stryMutAct_9fa48("3488") ? {} : (stryCov_9fa48("3488"), {
                            id: option.id
                          }),
                          data: stryMutAct_9fa48("3489") ? {} : (stryCov_9fa48("3489"), {
                            esCorrecta: stryMutAct_9fa48("3492") ? option.id !== correctOption.id : stryMutAct_9fa48("3491") ? false : stryMutAct_9fa48("3490") ? true : (stryCov_9fa48("3490", "3491", "3492"), option.id === correctOption.id)
                          })
                        }));
                      }
                    }));
                    stryMutAct_9fa48("3493") ? updatedCount-- : (stryCov_9fa48("3493"), updatedCount++);
                  }
                } else {
                  if (stryMutAct_9fa48("3494")) {
                    {}
                  } else {
                    stryCov_9fa48("3494");
                    // Si no necesita actualización pero la respuesta es correcta, contar como actualizada
                    // (ya estaba marcada correctamente)
                    stryMutAct_9fa48("3495") ? updatedCount-- : (stryCov_9fa48("3495"), updatedCount++);
                  }
                }
              }
            }
          }
        });

        // Limpiar PDF después de procesar
        if (stryMutAct_9fa48("3497") ? false : stryMutAct_9fa48("3496") ? true : (stryCov_9fa48("3496", "3497"), pdfPath)) {
          if (stryMutAct_9fa48("3498")) {
            {}
          } else {
            stryCov_9fa48("3498");
            await fs.unlink(pdfPath).catch(() => {
              // Ignorar errores al eliminar
            });
          }
        }
        return stryMutAct_9fa48("3499") ? {} : (stryCov_9fa48("3499"), {
          examId: exam.id,
          examTitle: exam.titulo,
          totalQuestions: exam.questions.length,
          answersDetected: correctAnswers.size,
          answersUpdated: updatedCount,
          answersNotFound: notFoundCount
        });
      }
    } catch (error) {
      if (stryMutAct_9fa48("3500")) {
        {}
      } else {
        stryCov_9fa48("3500");
        // Limpiar PDF en caso de error
        if (stryMutAct_9fa48("3502") ? false : stryMutAct_9fa48("3501") ? true : (stryCov_9fa48("3501", "3502"), pdfPath)) {
          if (stryMutAct_9fa48("3503")) {
            {}
          } else {
            stryCov_9fa48("3503");
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
  if (stryMutAct_9fa48("3504")) {
    {}
  } else {
    stryCov_9fa48("3504");
    return withRateLimit(request, async () => {
      if (stryMutAct_9fa48("3505")) {
        {}
      } else {
        stryCov_9fa48("3505");
        try {
          if (stryMutAct_9fa48("3506")) {
            {}
          } else {
            stryCov_9fa48("3506");
            // Verificar autenticación
            const user = await getCurrentUser();
            if (stryMutAct_9fa48("3509") ? false : stryMutAct_9fa48("3508") ? true : stryMutAct_9fa48("3507") ? user : (stryCov_9fa48("3507", "3508", "3509"), !user)) {
              if (stryMutAct_9fa48("3510")) {
                {}
              } else {
                stryCov_9fa48("3510");
                return NextResponse.json(stryMutAct_9fa48("3511") ? {} : (stryCov_9fa48("3511"), {
                  error: stryMutAct_9fa48("3512") ? "" : (stryCov_9fa48("3512"), 'No autorizado')
                }), stryMutAct_9fa48("3513") ? {} : (stryCov_9fa48("3513"), {
                  status: 401
                }));
              }
            }

            // Manejar FormData
            const formData = await request.formData();
            const pdfFile = formData.get('pdfFile') as File | null;
            const subjectName = formData.get('subjectName') as string | null;
            const year = formData.get('year') as string | null;
            const examId = formData.get('examId') as string | null;
            if (stryMutAct_9fa48("3516") ? false : stryMutAct_9fa48("3515") ? true : stryMutAct_9fa48("3514") ? pdfFile : (stryCov_9fa48("3514", "3515", "3516"), !pdfFile)) {
              if (stryMutAct_9fa48("3517")) {
                {}
              } else {
                stryCov_9fa48("3517");
                return NextResponse.json(stryMutAct_9fa48("3518") ? {} : (stryCov_9fa48("3518"), {
                  error: stryMutAct_9fa48("3519") ? "" : (stryCov_9fa48("3519"), 'Debe proporcionar un archivo PDF')
                }), stryMutAct_9fa48("3520") ? {} : (stryCov_9fa48("3520"), {
                  status: 400
                }));
              }
            }
            if (stryMutAct_9fa48("3523") ? false : stryMutAct_9fa48("3522") ? true : stryMutAct_9fa48("3521") ? subjectName : (stryCov_9fa48("3521", "3522", "3523"), !subjectName)) {
              if (stryMutAct_9fa48("3524")) {
                {}
              } else {
                stryCov_9fa48("3524");
                return NextResponse.json(stryMutAct_9fa48("3525") ? {} : (stryCov_9fa48("3525"), {
                  error: stryMutAct_9fa48("3526") ? "" : (stryCov_9fa48("3526"), 'Debe proporcionar la asignatura')
                }), stryMutAct_9fa48("3527") ? {} : (stryCov_9fa48("3527"), {
                  status: 400
                }));
              }
            }
            if (stryMutAct_9fa48("3530") ? false : stryMutAct_9fa48("3529") ? true : stryMutAct_9fa48("3528") ? year : (stryCov_9fa48("3528", "3529", "3530"), !year)) {
              if (stryMutAct_9fa48("3531")) {
                {}
              } else {
                stryCov_9fa48("3531");
                return NextResponse.json(stryMutAct_9fa48("3532") ? {} : (stryCov_9fa48("3532"), {
                  error: stryMutAct_9fa48("3533") ? "" : (stryCov_9fa48("3533"), 'Debe proporcionar el año')
                }), stryMutAct_9fa48("3534") ? {} : (stryCov_9fa48("3534"), {
                  status: 400
                }));
              }
            }

            // Validar con Zod
            const validation = answerKeyImportSchema.safeParse(stryMutAct_9fa48("3535") ? {} : (stryCov_9fa48("3535"), {
              pdfFile,
              subjectName,
              year,
              examId: stryMutAct_9fa48("3538") ? examId && undefined : stryMutAct_9fa48("3537") ? false : stryMutAct_9fa48("3536") ? true : (stryCov_9fa48("3536", "3537", "3538"), examId || undefined)
            }));
            if (stryMutAct_9fa48("3541") ? false : stryMutAct_9fa48("3540") ? true : stryMutAct_9fa48("3539") ? validation.success : (stryCov_9fa48("3539", "3540", "3541"), !validation.success)) {
              if (stryMutAct_9fa48("3542")) {
                {}
              } else {
                stryCov_9fa48("3542");
                return NextResponse.json(stryMutAct_9fa48("3543") ? {} : (stryCov_9fa48("3543"), {
                  error: stryMutAct_9fa48("3544") ? "" : (stryCov_9fa48("3544"), 'Datos inválidos'),
                  details: validation.error.issues
                }), stryMutAct_9fa48("3545") ? {} : (stryCov_9fa48("3545"), {
                  status: 400
                }));
              }
            }

            // Importar clavijero
            const result = await importAnswerKey(validation.data);
            return NextResponse.json(stryMutAct_9fa48("3546") ? {} : (stryCov_9fa48("3546"), {
              success: stryMutAct_9fa48("3547") ? false : (stryCov_9fa48("3547"), true),
              message: stryMutAct_9fa48("3548") ? `` : (stryCov_9fa48("3548"), `Clavijero importado exitosamente: ${result.answersUpdated} respuestas actualizadas`),
              details: (stryMutAct_9fa48("3549") ? `` : (stryCov_9fa48("3549"), `Examen: ${result.examTitle}\n`)) + (stryMutAct_9fa48("3550") ? `` : (stryCov_9fa48("3550"), `Total de preguntas: ${result.totalQuestions}\n`)) + (stryMutAct_9fa48("3551") ? `` : (stryCov_9fa48("3551"), `Respuestas detectadas en PDF: ${result.answersDetected}\n`)) + (stryMutAct_9fa48("3552") ? `` : (stryCov_9fa48("3552"), `Respuestas actualizadas: ${result.answersUpdated}\n`)) + ((stryMutAct_9fa48("3556") ? result.answersNotFound <= 0 : stryMutAct_9fa48("3555") ? result.answersNotFound >= 0 : stryMutAct_9fa48("3554") ? false : stryMutAct_9fa48("3553") ? true : (stryCov_9fa48("3553", "3554", "3555", "3556"), result.answersNotFound > 0)) ? stryMutAct_9fa48("3557") ? `` : (stryCov_9fa48("3557"), `⚠️ No se encontraron respuestas para ${result.answersNotFound} pregunta(s)`) : stryMutAct_9fa48("3558") ? "Stryker was here!" : (stryCov_9fa48("3558"), '')),
              examId: result.examId
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("3559")) {
            {}
          } else {
            stryCov_9fa48("3559");
            return NextResponse.json(stryMutAct_9fa48("3560") ? {} : (stryCov_9fa48("3560"), {
              error: stryMutAct_9fa48("3561") ? "" : (stryCov_9fa48("3561"), 'Error al importar clavijero'),
              details: error instanceof Error ? error.message : stryMutAct_9fa48("3562") ? "" : (stryCov_9fa48("3562"), 'Error desconocido')
            }), stryMutAct_9fa48("3563") ? {} : (stryCov_9fa48("3563"), {
              status: 500
            }));
          }
        }
      }
    }, stryMutAct_9fa48("3564") ? "" : (stryCov_9fa48("3564"), 'write'));
  }
}