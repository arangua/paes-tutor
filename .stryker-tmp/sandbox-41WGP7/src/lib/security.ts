/**
 * Utilidades de seguridad para sanitización y validación
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
import { logger } from './logger';
import { LIMIT_CONSTANTS } from './constants';

// Constantes de seguridad
const MAX_STRING_LENGTH = LIMIT_CONSTANTS.MAX_STRING_LENGTH;

/**
 * Sanitiza un string para prevenir XSS
 * Elimina caracteres peligrosos y normaliza el texto
 */
export function sanitizeString(input: string | null | undefined): string {
  if (stryMutAct_9fa48("25812")) {
    {}
  } else {
    stryCov_9fa48("25812");
    if (stryMutAct_9fa48("25815") ? !input && typeof input !== 'string' : stryMutAct_9fa48("25814") ? false : stryMutAct_9fa48("25813") ? true : (stryCov_9fa48("25813", "25814", "25815"), (stryMutAct_9fa48("25816") ? input : (stryCov_9fa48("25816"), !input)) || (stryMutAct_9fa48("25818") ? typeof input === 'string' : stryMutAct_9fa48("25817") ? false : (stryCov_9fa48("25817", "25818"), typeof input !== (stryMutAct_9fa48("25819") ? "" : (stryCov_9fa48("25819"), 'string')))))) {
      if (stryMutAct_9fa48("25820")) {
        {}
      } else {
        stryCov_9fa48("25820");
        return stryMutAct_9fa48("25821") ? "Stryker was here!" : (stryCov_9fa48("25821"), '');
      }
    }

    // Normalizar espacios en blanco
    let sanitized = stryMutAct_9fa48("25822") ? input : (stryCov_9fa48("25822"), input.trim());

    // Eliminar caracteres de control (excepto \n, \r, \t)
    sanitized = sanitized.replace(stryMutAct_9fa48("25823") ? /[^\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g : (stryCov_9fa48("25823"), /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g), stryMutAct_9fa48("25824") ? "Stryker was here!" : (stryCov_9fa48("25824"), ''));

    // Limitar longitud máxima (prevenir DoS)
    if (stryMutAct_9fa48("25828") ? sanitized.length <= MAX_STRING_LENGTH : stryMutAct_9fa48("25827") ? sanitized.length >= MAX_STRING_LENGTH : stryMutAct_9fa48("25826") ? false : stryMutAct_9fa48("25825") ? true : (stryCov_9fa48("25825", "25826", "25827", "25828"), sanitized.length > MAX_STRING_LENGTH)) {
      if (stryMutAct_9fa48("25829")) {
        {}
      } else {
        stryCov_9fa48("25829");
        // Solo loguear en servidor (evitar problemas con pino-pretty en cliente)
        if (stryMutAct_9fa48("25832") ? typeof window !== 'undefined' : stryMutAct_9fa48("25831") ? false : stryMutAct_9fa48("25830") ? true : (stryCov_9fa48("25830", "25831", "25832"), typeof window === (stryMutAct_9fa48("25833") ? "" : (stryCov_9fa48("25833"), 'undefined')))) {
          if (stryMutAct_9fa48("25834")) {
            {}
          } else {
            stryCov_9fa48("25834");
            logger.warn(stryMutAct_9fa48("25835") ? {} : (stryCov_9fa48("25835"), {
              type: stryMutAct_9fa48("25836") ? "" : (stryCov_9fa48("25836"), 'security'),
              event: stryMutAct_9fa48("25837") ? "" : (stryCov_9fa48("25837"), 'string_truncated'),
              originalLength: input.length,
              truncatedLength: MAX_STRING_LENGTH
            }), stryMutAct_9fa48("25838") ? "" : (stryCov_9fa48("25838"), 'String truncado por exceder MAX_STRING_LENGTH. Puede causar pérdida de datos.'));
          }
        }
        sanitized = stryMutAct_9fa48("25839") ? sanitized : (stryCov_9fa48("25839"), sanitized.substring(0, MAX_STRING_LENGTH));
      }
    }
    return sanitized;
  }
}

/**
 * Sanitiza un objeto recursivamente
 */
export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  if (stryMutAct_9fa48("25840")) {
    {}
  } else {
    stryCov_9fa48("25840");
    const sanitized = stryMutAct_9fa48("25841") ? {} : (stryCov_9fa48("25841"), {
      ...obj
    });
    for (const key in sanitized) {
      if (stryMutAct_9fa48("25842")) {
        {}
      } else {
        stryCov_9fa48("25842");
        if (stryMutAct_9fa48("25845") ? typeof sanitized[key] !== 'string' : stryMutAct_9fa48("25844") ? false : stryMutAct_9fa48("25843") ? true : (stryCov_9fa48("25843", "25844", "25845"), typeof sanitized[key] === (stryMutAct_9fa48("25846") ? "" : (stryCov_9fa48("25846"), 'string')))) {
          if (stryMutAct_9fa48("25847")) {
            {}
          } else {
            stryCov_9fa48("25847");
            sanitized[key] = sanitizeString(sanitized[key] as string) as T[Extract<keyof T, string>];
          }
        } else if (stryMutAct_9fa48("25850") ? typeof sanitized[key] === 'object' && sanitized[key] !== null || !Array.isArray(sanitized[key]) : stryMutAct_9fa48("25849") ? false : stryMutAct_9fa48("25848") ? true : (stryCov_9fa48("25848", "25849", "25850"), (stryMutAct_9fa48("25852") ? typeof sanitized[key] === 'object' || sanitized[key] !== null : stryMutAct_9fa48("25851") ? true : (stryCov_9fa48("25851", "25852"), (stryMutAct_9fa48("25854") ? typeof sanitized[key] !== 'object' : stryMutAct_9fa48("25853") ? true : (stryCov_9fa48("25853", "25854"), typeof sanitized[key] === (stryMutAct_9fa48("25855") ? "" : (stryCov_9fa48("25855"), 'object')))) && (stryMutAct_9fa48("25857") ? sanitized[key] === null : stryMutAct_9fa48("25856") ? true : (stryCov_9fa48("25856", "25857"), sanitized[key] !== null)))) && (stryMutAct_9fa48("25858") ? Array.isArray(sanitized[key]) : (stryCov_9fa48("25858"), !Array.isArray(sanitized[key]))))) {
          if (stryMutAct_9fa48("25859")) {
            {}
          } else {
            stryCov_9fa48("25859");
            sanitized[key] = sanitizeObject(sanitized[key] as Record<string, unknown>) as T[Extract<keyof T, string>];
          }
        } else if (stryMutAct_9fa48("25861") ? false : stryMutAct_9fa48("25860") ? true : (stryCov_9fa48("25860", "25861"), Array.isArray(sanitized[key]))) {
          if (stryMutAct_9fa48("25862")) {
            {}
          } else {
            stryCov_9fa48("25862");
            sanitized[key] = (sanitized[key] as unknown[]).map(item => {
              if (typeof item === 'string') {
                return sanitizeString(item);
              } else if (typeof item === 'object' && item !== null) {
                return sanitizeObject(item as Record<string, unknown>);
              }
              return item;
            }) as T[Extract<keyof T, string>];
          }
        }
      }
    }
    return sanitized;
  }
}

/**
 * Valida que un string no contenga patrones peligrosos
 */
export function containsDangerousPatterns(input: string): boolean {
  if (stryMutAct_9fa48("25863")) {
    {}
  } else {
    stryCov_9fa48("25863");
    if (stryMutAct_9fa48("25866") ? !input && typeof input !== 'string' : stryMutAct_9fa48("25865") ? false : stryMutAct_9fa48("25864") ? true : (stryCov_9fa48("25864", "25865", "25866"), (stryMutAct_9fa48("25867") ? input : (stryCov_9fa48("25867"), !input)) || (stryMutAct_9fa48("25869") ? typeof input === 'string' : stryMutAct_9fa48("25868") ? false : (stryCov_9fa48("25868", "25869"), typeof input !== (stryMutAct_9fa48("25870") ? "" : (stryCov_9fa48("25870"), 'string')))))) {
      if (stryMutAct_9fa48("25871")) {
        {}
      } else {
        stryCov_9fa48("25871");
        return stryMutAct_9fa48("25872") ? true : (stryCov_9fa48("25872"), false);
      }
    }

    // Patrones peligrosos comunes
    const dangerousPatterns = stryMutAct_9fa48("25873") ? [] : (stryCov_9fa48("25873"), [stryMutAct_9fa48("25881") ? /<script[\s\S]*?>[\s\s]*?<\/script>/gi : stryMutAct_9fa48("25880") ? /<script[\s\S]*?>[\S\S]*?<\/script>/gi : stryMutAct_9fa48("25879") ? /<script[\s\S]*?>[^\s\S]*?<\/script>/gi : stryMutAct_9fa48("25878") ? /<script[\s\S]*?>[\s\S]<\/script>/gi : stryMutAct_9fa48("25877") ? /<script[\s\s]*?>[\s\S]*?<\/script>/gi : stryMutAct_9fa48("25876") ? /<script[\S\S]*?>[\s\S]*?<\/script>/gi : stryMutAct_9fa48("25875") ? /<script[^\s\S]*?>[\s\S]*?<\/script>/gi : stryMutAct_9fa48("25874") ? /<script[\s\S]>[\s\S]*?<\/script>/gi : (stryCov_9fa48("25874", "25875", "25876", "25877", "25878", "25879", "25880", "25881"), /<script[\s\S]*?>[\s\S]*?<\/script>/gi), /javascript:/gi, stryMutAct_9fa48("25885") ? /on\w+\S*=/gi : stryMutAct_9fa48("25884") ? /on\w+\s=/gi : stryMutAct_9fa48("25883") ? /on\W+\s*=/gi : stryMutAct_9fa48("25882") ? /on\w\s*=/gi : (stryCov_9fa48("25882", "25883", "25884", "25885"), /on\w+\s*=/gi), // Event handlers como onclick=
    stryMutAct_9fa48("25889") ? /<iframe[\s\s]*?>/gi : stryMutAct_9fa48("25888") ? /<iframe[\S\S]*?>/gi : stryMutAct_9fa48("25887") ? /<iframe[^\s\S]*?>/gi : stryMutAct_9fa48("25886") ? /<iframe[\s\S]>/gi : (stryCov_9fa48("25886", "25887", "25888", "25889"), /<iframe[\s\S]*?>/gi), stryMutAct_9fa48("25893") ? /<object[\s\s]*?>/gi : stryMutAct_9fa48("25892") ? /<object[\S\S]*?>/gi : stryMutAct_9fa48("25891") ? /<object[^\s\S]*?>/gi : stryMutAct_9fa48("25890") ? /<object[\s\S]>/gi : (stryCov_9fa48("25890", "25891", "25892", "25893"), /<object[\s\S]*?>/gi), stryMutAct_9fa48("25897") ? /<embed[\s\s]*?>/gi : stryMutAct_9fa48("25896") ? /<embed[\S\S]*?>/gi : stryMutAct_9fa48("25895") ? /<embed[^\s\S]*?>/gi : stryMutAct_9fa48("25894") ? /<embed[\s\S]>/gi : (stryCov_9fa48("25894", "25895", "25896", "25897"), /<embed[\s\S]*?>/gi), /data:text\/html/gi, /vbscript:/gi, stryMutAct_9fa48("25899") ? /expression\S*\(/gi : stryMutAct_9fa48("25898") ? /expression\s\(/gi : (stryCov_9fa48("25898", "25899"), /expression\s*\(/gi) // CSS expressions
    ]);
    return stryMutAct_9fa48("25900") ? dangerousPatterns.every(pattern => pattern.test(input)) : (stryCov_9fa48("25900"), dangerousPatterns.some(stryMutAct_9fa48("25901") ? () => undefined : (stryCov_9fa48("25901"), pattern => pattern.test(input))));
  }
}

/**
 * Valida formato de ID cuid
 */
export function isValidCuid(id: string | null | undefined): boolean {
  if (stryMutAct_9fa48("25902")) {
    {}
  } else {
    stryCov_9fa48("25902");
    if (stryMutAct_9fa48("25905") ? !id && typeof id !== 'string' : stryMutAct_9fa48("25904") ? false : stryMutAct_9fa48("25903") ? true : (stryCov_9fa48("25903", "25904", "25905"), (stryMutAct_9fa48("25906") ? id : (stryCov_9fa48("25906"), !id)) || (stryMutAct_9fa48("25908") ? typeof id === 'string' : stryMutAct_9fa48("25907") ? false : (stryCov_9fa48("25907", "25908"), typeof id !== (stryMutAct_9fa48("25909") ? "" : (stryCov_9fa48("25909"), 'string')))))) {
      if (stryMutAct_9fa48("25910")) {
        {}
      } else {
        stryCov_9fa48("25910");
        return stryMutAct_9fa48("25911") ? true : (stryCov_9fa48("25911"), false);
      }
    }
    // Formato cuid: c + 24 caracteres alfanuméricos
    return (stryMutAct_9fa48("25915") ? /^c[^a-z0-9]{24}$/ : stryMutAct_9fa48("25914") ? /^c[a-z0-9]$/ : stryMutAct_9fa48("25913") ? /^c[a-z0-9]{24}/ : stryMutAct_9fa48("25912") ? /c[a-z0-9]{24}$/ : (stryCov_9fa48("25912", "25913", "25914", "25915"), /^c[a-z0-9]{24}$/)).test(id);
  }
}

/**
 * Valida formato de email
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (stryMutAct_9fa48("25916")) {
    {}
  } else {
    stryCov_9fa48("25916");
    if (stryMutAct_9fa48("25919") ? !email && typeof email !== 'string' : stryMutAct_9fa48("25918") ? false : stryMutAct_9fa48("25917") ? true : (stryCov_9fa48("25917", "25918", "25919"), (stryMutAct_9fa48("25920") ? email : (stryCov_9fa48("25920"), !email)) || (stryMutAct_9fa48("25922") ? typeof email === 'string' : stryMutAct_9fa48("25921") ? false : (stryCov_9fa48("25921", "25922"), typeof email !== (stryMutAct_9fa48("25923") ? "" : (stryCov_9fa48("25923"), 'string')))))) {
      if (stryMutAct_9fa48("25924")) {
        {}
      } else {
        stryCov_9fa48("25924");
        return stryMutAct_9fa48("25925") ? true : (stryCov_9fa48("25925"), false);
      }
    }
    // Validación básica de email
    const emailRegex = stryMutAct_9fa48("25936") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("25935") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("25934") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("25933") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("25932") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("25931") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("25930") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("25929") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("25928") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("25927") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("25926") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("25926", "25927", "25928", "25929", "25930", "25931", "25932", "25933", "25934", "25935", "25936"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    return stryMutAct_9fa48("25939") ? emailRegex.test(email) || email.length <= 255 : stryMutAct_9fa48("25938") ? false : stryMutAct_9fa48("25937") ? true : (stryCov_9fa48("25937", "25938", "25939"), emailRegex.test(email) && (stryMutAct_9fa48("25942") ? email.length > 255 : stryMutAct_9fa48("25941") ? email.length < 255 : stryMutAct_9fa48("25940") ? true : (stryCov_9fa48("25940", "25941", "25942"), email.length <= 255)));
  }
}

/**
 * Valida que un string tenga una longitud razonable
 */
export function isValidLength(input: string | null | undefined, min: number = 0, max: number = 1000): boolean {
  if (stryMutAct_9fa48("25943")) {
    {}
  } else {
    stryCov_9fa48("25943");
    if (stryMutAct_9fa48("25946") ? (input === null || input === undefined) && typeof input !== 'string' : stryMutAct_9fa48("25945") ? false : stryMutAct_9fa48("25944") ? true : (stryCov_9fa48("25944", "25945", "25946"), (stryMutAct_9fa48("25948") ? input === null && input === undefined : stryMutAct_9fa48("25947") ? false : (stryCov_9fa48("25947", "25948"), (stryMutAct_9fa48("25950") ? input !== null : stryMutAct_9fa48("25949") ? false : (stryCov_9fa48("25949", "25950"), input === null)) || (stryMutAct_9fa48("25952") ? input !== undefined : stryMutAct_9fa48("25951") ? false : (stryCov_9fa48("25951", "25952"), input === undefined)))) || (stryMutAct_9fa48("25954") ? typeof input === 'string' : stryMutAct_9fa48("25953") ? false : (stryCov_9fa48("25953", "25954"), typeof input !== (stryMutAct_9fa48("25955") ? "" : (stryCov_9fa48("25955"), 'string')))))) {
      if (stryMutAct_9fa48("25956")) {
        {}
      } else {
        stryCov_9fa48("25956");
        return stryMutAct_9fa48("25957") ? true : (stryCov_9fa48("25957"), false);
      }
    }
    // Permitir string vacío si min es 0
    return stryMutAct_9fa48("25960") ? input.length >= min || input.length <= max : stryMutAct_9fa48("25959") ? false : stryMutAct_9fa48("25958") ? true : (stryCov_9fa48("25958", "25959", "25960"), (stryMutAct_9fa48("25963") ? input.length < min : stryMutAct_9fa48("25962") ? input.length > min : stryMutAct_9fa48("25961") ? true : (stryCov_9fa48("25961", "25962", "25963"), input.length >= min)) && (stryMutAct_9fa48("25966") ? input.length > max : stryMutAct_9fa48("25965") ? input.length < max : stryMutAct_9fa48("25964") ? true : (stryCov_9fa48("25964", "25965", "25966"), input.length <= max)));
  }
}

/**
 * Sanitiza y valida un string de entrada
 */
export function sanitizeAndValidate(input: string | null | undefined, options: {
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  checkDangerous?: boolean;
} = {}): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (stryMutAct_9fa48("25967")) {
    {}
  } else {
    stryCov_9fa48("25967");
    const {
      minLength = 0,
      maxLength = 1000,
      allowEmpty = stryMutAct_9fa48("25968") ? true : (stryCov_9fa48("25968"), false),
      checkDangerous = stryMutAct_9fa48("25969") ? false : (stryCov_9fa48("25969"), true)
    } = options;

    // Validar que sea string
    if (stryMutAct_9fa48("25972") ? input === null && input === undefined : stryMutAct_9fa48("25971") ? false : stryMutAct_9fa48("25970") ? true : (stryCov_9fa48("25970", "25971", "25972"), (stryMutAct_9fa48("25974") ? input !== null : stryMutAct_9fa48("25973") ? false : (stryCov_9fa48("25973", "25974"), input === null)) || (stryMutAct_9fa48("25976") ? input !== undefined : stryMutAct_9fa48("25975") ? false : (stryCov_9fa48("25975", "25976"), input === undefined)))) {
      if (stryMutAct_9fa48("25977")) {
        {}
      } else {
        stryCov_9fa48("25977");
        return stryMutAct_9fa48("25978") ? {} : (stryCov_9fa48("25978"), {
          isValid: allowEmpty,
          sanitized: stryMutAct_9fa48("25979") ? "Stryker was here!" : (stryCov_9fa48("25979"), ''),
          error: allowEmpty ? undefined : stryMutAct_9fa48("25980") ? "" : (stryCov_9fa48("25980"), 'Campo requerido')
        });
      }
    }
    if (stryMutAct_9fa48("25983") ? typeof input === 'string' : stryMutAct_9fa48("25982") ? false : stryMutAct_9fa48("25981") ? true : (stryCov_9fa48("25981", "25982", "25983"), typeof input !== (stryMutAct_9fa48("25984") ? "" : (stryCov_9fa48("25984"), 'string')))) {
      if (stryMutAct_9fa48("25985")) {
        {}
      } else {
        stryCov_9fa48("25985");
        return stryMutAct_9fa48("25986") ? {} : (stryCov_9fa48("25986"), {
          isValid: stryMutAct_9fa48("25987") ? true : (stryCov_9fa48("25987"), false),
          sanitized: stryMutAct_9fa48("25988") ? "Stryker was here!" : (stryCov_9fa48("25988"), ''),
          error: stryMutAct_9fa48("25989") ? "" : (stryCov_9fa48("25989"), 'Tipo de dato inválido')
        });
      }
    }

    // Sanitizar
    const sanitized = sanitizeString(input);

    // Validar longitud
    if (stryMutAct_9fa48("25992") ? false : stryMutAct_9fa48("25991") ? true : stryMutAct_9fa48("25990") ? isValidLength(sanitized, minLength, maxLength) : (stryCov_9fa48("25990", "25991", "25992"), !isValidLength(sanitized, minLength, maxLength))) {
      if (stryMutAct_9fa48("25993")) {
        {}
      } else {
        stryCov_9fa48("25993");
        return stryMutAct_9fa48("25994") ? {} : (stryCov_9fa48("25994"), {
          isValid: stryMutAct_9fa48("25995") ? true : (stryCov_9fa48("25995"), false),
          sanitized,
          error: stryMutAct_9fa48("25996") ? `` : (stryCov_9fa48("25996"), `Longitud debe estar entre ${minLength} y ${maxLength} caracteres`)
        });
      }
    }

    // Validar que no esté vacío (si no se permite)
    if (stryMutAct_9fa48("25999") ? !allowEmpty || sanitized.length === 0 : stryMutAct_9fa48("25998") ? false : stryMutAct_9fa48("25997") ? true : (stryCov_9fa48("25997", "25998", "25999"), (stryMutAct_9fa48("26000") ? allowEmpty : (stryCov_9fa48("26000"), !allowEmpty)) && (stryMutAct_9fa48("26002") ? sanitized.length !== 0 : stryMutAct_9fa48("26001") ? true : (stryCov_9fa48("26001", "26002"), sanitized.length === 0)))) {
      if (stryMutAct_9fa48("26003")) {
        {}
      } else {
        stryCov_9fa48("26003");
        return stryMutAct_9fa48("26004") ? {} : (stryCov_9fa48("26004"), {
          isValid: stryMutAct_9fa48("26005") ? true : (stryCov_9fa48("26005"), false),
          sanitized: stryMutAct_9fa48("26006") ? "Stryker was here!" : (stryCov_9fa48("26006"), ''),
          error: stryMutAct_9fa48("26007") ? "" : (stryCov_9fa48("26007"), 'Campo no puede estar vacío')
        });
      }
    }

    // Verificar patrones peligrosos
    if (stryMutAct_9fa48("26010") ? checkDangerous || containsDangerousPatterns(sanitized) : stryMutAct_9fa48("26009") ? false : stryMutAct_9fa48("26008") ? true : (stryCov_9fa48("26008", "26009", "26010"), checkDangerous && containsDangerousPatterns(sanitized))) {
      if (stryMutAct_9fa48("26011")) {
        {}
      } else {
        stryCov_9fa48("26011");
        return stryMutAct_9fa48("26012") ? {} : (stryCov_9fa48("26012"), {
          isValid: stryMutAct_9fa48("26013") ? true : (stryCov_9fa48("26013"), false),
          sanitized,
          error: stryMutAct_9fa48("26014") ? "" : (stryCov_9fa48("26014"), 'Contenido no permitido detectado')
        });
      }
    }
    return stryMutAct_9fa48("26015") ? {} : (stryCov_9fa48("26015"), {
      isValid: stryMutAct_9fa48("26016") ? false : (stryCov_9fa48("26016"), true),
      sanitized
    });
  }
}