/**
 * Helpers de validación reutilizables para frontend y backend
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
import { isValidCuid, isValidEmail, isValidLength, sanitizeAndValidate } from './security';

/**
 * Valida un ID de tipo CUID desde parámetros de URL
 * @param id - ID a validar
 * @returns true si es válido, false si no
 */
export function validateIdParam(id: string | string[] | undefined): id is string {
  if (stryMutAct_9fa48("26329")) {
    {}
  } else {
    stryCov_9fa48("26329");
    if (stryMutAct_9fa48("26332") ? !id && Array.isArray(id) : stryMutAct_9fa48("26331") ? false : stryMutAct_9fa48("26330") ? true : (stryCov_9fa48("26330", "26331", "26332"), (stryMutAct_9fa48("26333") ? id : (stryCov_9fa48("26333"), !id)) || Array.isArray(id))) {
      if (stryMutAct_9fa48("26334")) {
        {}
      } else {
        stryCov_9fa48("26334");
        return stryMutAct_9fa48("26335") ? true : (stryCov_9fa48("26335"), false);
      }
    }
    return isValidCuid(id);
  }
}

/**
 * Valida y sanitiza un email
 * @param email - Email a validar
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validateEmail(email: string | null | undefined): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (stryMutAct_9fa48("26336")) {
    {}
  } else {
    stryCov_9fa48("26336");
    if (stryMutAct_9fa48("26339") ? false : stryMutAct_9fa48("26338") ? true : stryMutAct_9fa48("26337") ? email : (stryCov_9fa48("26337", "26338", "26339"), !email)) {
      if (stryMutAct_9fa48("26340")) {
        {}
      } else {
        stryCov_9fa48("26340");
        return stryMutAct_9fa48("26341") ? {} : (stryCov_9fa48("26341"), {
          isValid: stryMutAct_9fa48("26342") ? true : (stryCov_9fa48("26342"), false),
          sanitized: stryMutAct_9fa48("26343") ? "Stryker was here!" : (stryCov_9fa48("26343"), ''),
          error: stryMutAct_9fa48("26344") ? "" : (stryCov_9fa48("26344"), 'Email es requerido')
        });
      }
    }
    const sanitized = stryMutAct_9fa48("26346") ? email.toLowerCase() : stryMutAct_9fa48("26345") ? email.trim().toUpperCase() : (stryCov_9fa48("26345", "26346"), email.trim().toLowerCase());
    if (stryMutAct_9fa48("26349") ? false : stryMutAct_9fa48("26348") ? true : stryMutAct_9fa48("26347") ? isValidEmail(sanitized) : (stryCov_9fa48("26347", "26348", "26349"), !isValidEmail(sanitized))) {
      if (stryMutAct_9fa48("26350")) {
        {}
      } else {
        stryCov_9fa48("26350");
        return stryMutAct_9fa48("26351") ? {} : (stryCov_9fa48("26351"), {
          isValid: stryMutAct_9fa48("26352") ? true : (stryCov_9fa48("26352"), false),
          sanitized,
          error: stryMutAct_9fa48("26353") ? "" : (stryCov_9fa48("26353"), 'Email inválido')
        });
      }
    }
    return stryMutAct_9fa48("26354") ? {} : (stryCov_9fa48("26354"), {
      isValid: stryMutAct_9fa48("26355") ? false : (stryCov_9fa48("26355"), true),
      sanitized
    });
  }
}

/**
 * Valida y sanitiza una contraseña
 * @param password - Contraseña a validar
 * @param minLength - Longitud mínima (default: 8)
 * @param maxLength - Longitud máxima (default: 128)
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validatePassword(password: string | null | undefined, minLength: number = 8, maxLength: number = 128): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (stryMutAct_9fa48("26356")) {
    {}
  } else {
    stryCov_9fa48("26356");
    if (stryMutAct_9fa48("26359") ? false : stryMutAct_9fa48("26358") ? true : stryMutAct_9fa48("26357") ? password : (stryCov_9fa48("26357", "26358", "26359"), !password)) {
      if (stryMutAct_9fa48("26360")) {
        {}
      } else {
        stryCov_9fa48("26360");
        return stryMutAct_9fa48("26361") ? {} : (stryCov_9fa48("26361"), {
          isValid: stryMutAct_9fa48("26362") ? true : (stryCov_9fa48("26362"), false),
          sanitized: stryMutAct_9fa48("26363") ? "Stryker was here!" : (stryCov_9fa48("26363"), ''),
          error: stryMutAct_9fa48("26364") ? "" : (stryCov_9fa48("26364"), 'Contraseña es requerida')
        });
      }
    }
    if (stryMutAct_9fa48("26367") ? false : stryMutAct_9fa48("26366") ? true : stryMutAct_9fa48("26365") ? isValidLength(password, minLength, maxLength) : (stryCov_9fa48("26365", "26366", "26367"), !isValidLength(password, minLength, maxLength))) {
      if (stryMutAct_9fa48("26368")) {
        {}
      } else {
        stryCov_9fa48("26368");
        return stryMutAct_9fa48("26369") ? {} : (stryCov_9fa48("26369"), {
          isValid: stryMutAct_9fa48("26370") ? true : (stryCov_9fa48("26370"), false),
          sanitized: password,
          error: stryMutAct_9fa48("26371") ? `` : (stryCov_9fa48("26371"), `La contraseña debe tener entre ${minLength} y ${maxLength} caracteres`)
        });
      }
    }

    // Validar que tenga al menos una letra y un número
    const hasLetter = (stryMutAct_9fa48("26372") ? /[^a-zA-Z]/ : (stryCov_9fa48("26372"), /[a-zA-Z]/)).test(password);
    const hasNumber = (stryMutAct_9fa48("26373") ? /\D/ : (stryCov_9fa48("26373"), /\d/)).test(password);
    if (stryMutAct_9fa48("26376") ? !hasLetter && !hasNumber : stryMutAct_9fa48("26375") ? false : stryMutAct_9fa48("26374") ? true : (stryCov_9fa48("26374", "26375", "26376"), (stryMutAct_9fa48("26377") ? hasLetter : (stryCov_9fa48("26377"), !hasLetter)) || (stryMutAct_9fa48("26378") ? hasNumber : (stryCov_9fa48("26378"), !hasNumber)))) {
      if (stryMutAct_9fa48("26379")) {
        {}
      } else {
        stryCov_9fa48("26379");
        return stryMutAct_9fa48("26380") ? {} : (stryCov_9fa48("26380"), {
          isValid: stryMutAct_9fa48("26381") ? true : (stryCov_9fa48("26381"), false),
          sanitized: password,
          error: stryMutAct_9fa48("26382") ? "" : (stryCov_9fa48("26382"), 'La contraseña debe contener al menos una letra y un número')
        });
      }
    }
    return stryMutAct_9fa48("26383") ? {} : (stryCov_9fa48("26383"), {
      isValid: stryMutAct_9fa48("26384") ? false : (stryCov_9fa48("26384"), true),
      sanitized: password
    });
  }
}

/**
 * Valida una URL
 * @param url - URL a validar
 * @param allowedProtocols - Protocolos permitidos (default: ['http', 'https'])
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validateUrl(url: string | null | undefined, allowedProtocols: string[] = stryMutAct_9fa48("26385") ? [] : (stryCov_9fa48("26385"), [stryMutAct_9fa48("26386") ? "" : (stryCov_9fa48("26386"), 'http'), stryMutAct_9fa48("26387") ? "" : (stryCov_9fa48("26387"), 'https')])): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (stryMutAct_9fa48("26388")) {
    {}
  } else {
    stryCov_9fa48("26388");
    if (stryMutAct_9fa48("26391") ? false : stryMutAct_9fa48("26390") ? true : stryMutAct_9fa48("26389") ? url : (stryCov_9fa48("26389", "26390", "26391"), !url)) {
      if (stryMutAct_9fa48("26392")) {
        {}
      } else {
        stryCov_9fa48("26392");
        return stryMutAct_9fa48("26393") ? {} : (stryCov_9fa48("26393"), {
          isValid: stryMutAct_9fa48("26394") ? true : (stryCov_9fa48("26394"), false),
          sanitized: stryMutAct_9fa48("26395") ? "Stryker was here!" : (stryCov_9fa48("26395"), ''),
          error: stryMutAct_9fa48("26396") ? "" : (stryCov_9fa48("26396"), 'URL es requerida')
        });
      }
    }
    const sanitized = stryMutAct_9fa48("26397") ? url : (stryCov_9fa48("26397"), url.trim());
    try {
      if (stryMutAct_9fa48("26398")) {
        {}
      } else {
        stryCov_9fa48("26398");
        const urlObj = new URL(sanitized);
        const protocol = urlObj.protocol.replace(stryMutAct_9fa48("26399") ? "" : (stryCov_9fa48("26399"), ':'), stryMutAct_9fa48("26400") ? "Stryker was here!" : (stryCov_9fa48("26400"), ''));
        if (stryMutAct_9fa48("26403") ? false : stryMutAct_9fa48("26402") ? true : stryMutAct_9fa48("26401") ? allowedProtocols.includes(protocol) : (stryCov_9fa48("26401", "26402", "26403"), !allowedProtocols.includes(protocol))) {
          if (stryMutAct_9fa48("26404")) {
            {}
          } else {
            stryCov_9fa48("26404");
            return stryMutAct_9fa48("26405") ? {} : (stryCov_9fa48("26405"), {
              isValid: stryMutAct_9fa48("26406") ? true : (stryCov_9fa48("26406"), false),
              sanitized,
              error: stryMutAct_9fa48("26407") ? `` : (stryCov_9fa48("26407"), `Protocolo no permitido. Solo se permiten: ${allowedProtocols.join(stryMutAct_9fa48("26408") ? "" : (stryCov_9fa48("26408"), ', '))}`)
            });
          }
        }

        // Validar que no sea localhost en producción (si es necesario)
        // Solo validar en servidor (process.env no está disponible en cliente)
        if (stryMutAct_9fa48("26411") ? typeof process !== 'undefined' && process.env.NODE_ENV === 'production' || urlObj.hostname === 'localhost' : stryMutAct_9fa48("26410") ? false : stryMutAct_9fa48("26409") ? true : (stryCov_9fa48("26409", "26410", "26411"), (stryMutAct_9fa48("26413") ? typeof process !== 'undefined' || process.env.NODE_ENV === 'production' : stryMutAct_9fa48("26412") ? true : (stryCov_9fa48("26412", "26413"), (stryMutAct_9fa48("26415") ? typeof process === 'undefined' : stryMutAct_9fa48("26414") ? true : (stryCov_9fa48("26414", "26415"), typeof process !== (stryMutAct_9fa48("26416") ? "" : (stryCov_9fa48("26416"), 'undefined')))) && (stryMutAct_9fa48("26418") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("26417") ? true : (stryCov_9fa48("26417", "26418"), process.env.NODE_ENV === (stryMutAct_9fa48("26419") ? "" : (stryCov_9fa48("26419"), 'production')))))) && (stryMutAct_9fa48("26421") ? urlObj.hostname !== 'localhost' : stryMutAct_9fa48("26420") ? true : (stryCov_9fa48("26420", "26421"), urlObj.hostname === (stryMutAct_9fa48("26422") ? "" : (stryCov_9fa48("26422"), 'localhost')))))) {
          if (stryMutAct_9fa48("26423")) {
            {}
          } else {
            stryCov_9fa48("26423");
            return stryMutAct_9fa48("26424") ? {} : (stryCov_9fa48("26424"), {
              isValid: stryMutAct_9fa48("26425") ? true : (stryCov_9fa48("26425"), false),
              sanitized,
              error: stryMutAct_9fa48("26426") ? "" : (stryCov_9fa48("26426"), 'URLs de localhost no están permitidas en producción')
            });
          }
        }
        return stryMutAct_9fa48("26427") ? {} : (stryCov_9fa48("26427"), {
          isValid: stryMutAct_9fa48("26428") ? false : (stryCov_9fa48("26428"), true),
          sanitized
        });
      }
    } catch {
      if (stryMutAct_9fa48("26429")) {
        {}
      } else {
        stryCov_9fa48("26429");
        return stryMutAct_9fa48("26430") ? {} : (stryCov_9fa48("26430"), {
          isValid: stryMutAct_9fa48("26431") ? true : (stryCov_9fa48("26431"), false),
          sanitized,
          error: stryMutAct_9fa48("26432") ? "" : (stryCov_9fa48("26432"), 'URL inválida')
        });
      }
    }
  }
}

/**
 * Valida un archivo
 * @param file - Archivo a validar
 * @param options - Opciones de validación
 * @returns Objeto con isValid y error opcional
 */
export function validateFile(file: File | null | undefined, options: {
  maxSize?: number; // en bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
} = {}): {
  isValid: boolean;
  error?: string;
} {
  if (stryMutAct_9fa48("26433")) {
    {}
  } else {
    stryCov_9fa48("26433");
    if (stryMutAct_9fa48("26436") ? false : stryMutAct_9fa48("26435") ? true : stryMutAct_9fa48("26434") ? file : (stryCov_9fa48("26434", "26435", "26436"), !file)) {
      if (stryMutAct_9fa48("26437")) {
        {}
      } else {
        stryCov_9fa48("26437");
        return stryMutAct_9fa48("26438") ? {} : (stryCov_9fa48("26438"), {
          isValid: stryMutAct_9fa48("26439") ? true : (stryCov_9fa48("26439"), false),
          error: stryMutAct_9fa48("26440") ? "" : (stryCov_9fa48("26440"), 'Archivo es requerido')
        });
      }
    }
    const {
      maxSize = stryMutAct_9fa48("26441") ? 10 * 1024 / 1024 : (stryCov_9fa48("26441"), (stryMutAct_9fa48("26442") ? 10 / 1024 : (stryCov_9fa48("26442"), 10 * 1024)) * 1024),
      allowedTypes = stryMutAct_9fa48("26443") ? ["Stryker was here"] : (stryCov_9fa48("26443"), []),
      allowedExtensions = stryMutAct_9fa48("26444") ? ["Stryker was here"] : (stryCov_9fa48("26444"), [])
    } = options;

    // Validar tamaño
    if (stryMutAct_9fa48("26448") ? file.size <= maxSize : stryMutAct_9fa48("26447") ? file.size >= maxSize : stryMutAct_9fa48("26446") ? false : stryMutAct_9fa48("26445") ? true : (stryCov_9fa48("26445", "26446", "26447", "26448"), file.size > maxSize)) {
      if (stryMutAct_9fa48("26449")) {
        {}
      } else {
        stryCov_9fa48("26449");
        const maxSizeMB = (stryMutAct_9fa48("26450") ? maxSize * (1024 * 1024) : (stryCov_9fa48("26450"), maxSize / (stryMutAct_9fa48("26451") ? 1024 / 1024 : (stryCov_9fa48("26451"), 1024 * 1024)))).toFixed(2);
        return stryMutAct_9fa48("26452") ? {} : (stryCov_9fa48("26452"), {
          isValid: stryMutAct_9fa48("26453") ? true : (stryCov_9fa48("26453"), false),
          error: stryMutAct_9fa48("26454") ? `` : (stryCov_9fa48("26454"), `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB} MB`)
        });
      }
    }

    // Validar tipo MIME
    if (stryMutAct_9fa48("26457") ? allowedTypes.length > 0 || !allowedTypes.includes(file.type) : stryMutAct_9fa48("26456") ? false : stryMutAct_9fa48("26455") ? true : (stryCov_9fa48("26455", "26456", "26457"), (stryMutAct_9fa48("26460") ? allowedTypes.length <= 0 : stryMutAct_9fa48("26459") ? allowedTypes.length >= 0 : stryMutAct_9fa48("26458") ? true : (stryCov_9fa48("26458", "26459", "26460"), allowedTypes.length > 0)) && (stryMutAct_9fa48("26461") ? allowedTypes.includes(file.type) : (stryCov_9fa48("26461"), !allowedTypes.includes(file.type))))) {
      if (stryMutAct_9fa48("26462")) {
        {}
      } else {
        stryCov_9fa48("26462");
        return stryMutAct_9fa48("26463") ? {} : (stryCov_9fa48("26463"), {
          isValid: stryMutAct_9fa48("26464") ? true : (stryCov_9fa48("26464"), false),
          error: stryMutAct_9fa48("26465") ? `` : (stryCov_9fa48("26465"), `Tipo de archivo no permitido. Tipos permitidos: ${allowedTypes.join(stryMutAct_9fa48("26466") ? "" : (stryCov_9fa48("26466"), ', '))}`)
        });
      }
    }

    // Validar extensión
    if (stryMutAct_9fa48("26470") ? allowedExtensions.length <= 0 : stryMutAct_9fa48("26469") ? allowedExtensions.length >= 0 : stryMutAct_9fa48("26468") ? false : stryMutAct_9fa48("26467") ? true : (stryCov_9fa48("26467", "26468", "26469", "26470"), allowedExtensions.length > 0)) {
      if (stryMutAct_9fa48("26471")) {
        {}
      } else {
        stryCov_9fa48("26471");
        const fileName = stryMutAct_9fa48("26472") ? file.name.toUpperCase() : (stryCov_9fa48("26472"), file.name.toLowerCase());
        const hasValidExtension = stryMutAct_9fa48("26473") ? allowedExtensions.every(ext => fileName.endsWith(ext.toLowerCase())) : (stryCov_9fa48("26473"), allowedExtensions.some(stryMutAct_9fa48("26474") ? () => undefined : (stryCov_9fa48("26474"), ext => stryMutAct_9fa48("26475") ? fileName.startsWith(ext.toLowerCase()) : (stryCov_9fa48("26475"), fileName.endsWith(stryMutAct_9fa48("26476") ? ext.toUpperCase() : (stryCov_9fa48("26476"), ext.toLowerCase()))))));
        if (stryMutAct_9fa48("26479") ? false : stryMutAct_9fa48("26478") ? true : stryMutAct_9fa48("26477") ? hasValidExtension : (stryCov_9fa48("26477", "26478", "26479"), !hasValidExtension)) {
          if (stryMutAct_9fa48("26480")) {
            {}
          } else {
            stryCov_9fa48("26480");
            return stryMutAct_9fa48("26481") ? {} : (stryCov_9fa48("26481"), {
              isValid: stryMutAct_9fa48("26482") ? true : (stryCov_9fa48("26482"), false),
              error: stryMutAct_9fa48("26483") ? `` : (stryCov_9fa48("26483"), `Extensión no permitida. Extensiones permitidas: ${allowedExtensions.join(stryMutAct_9fa48("26484") ? "" : (stryCov_9fa48("26484"), ', '))}`)
            });
          }
        }
      }
    }
    return stryMutAct_9fa48("26485") ? {} : (stryCov_9fa48("26485"), {
      isValid: stryMutAct_9fa48("26486") ? false : (stryCov_9fa48("26486"), true)
    });
  }
}

/**
 * Valida un año
 * @param year - Año a validar (string o number)
 * @param minYear - Año mínimo (default: 2000)
 * @param maxYear - Año máximo (default: 2100)
 * @returns Objeto con isValid, sanitized y error opcional
 */
export function validateYear(year: string | number | null | undefined, minYear: number = 2000, maxYear: number = 2100): {
  isValid: boolean;
  sanitized: number | null;
  error?: string;
} {
  if (stryMutAct_9fa48("26487")) {
    {}
  } else {
    stryCov_9fa48("26487");
    if (stryMutAct_9fa48("26490") ? year === null && year === undefined : stryMutAct_9fa48("26489") ? false : stryMutAct_9fa48("26488") ? true : (stryCov_9fa48("26488", "26489", "26490"), (stryMutAct_9fa48("26492") ? year !== null : stryMutAct_9fa48("26491") ? false : (stryCov_9fa48("26491", "26492"), year === null)) || (stryMutAct_9fa48("26494") ? year !== undefined : stryMutAct_9fa48("26493") ? false : (stryCov_9fa48("26493", "26494"), year === undefined)))) {
      if (stryMutAct_9fa48("26495")) {
        {}
      } else {
        stryCov_9fa48("26495");
        return stryMutAct_9fa48("26496") ? {} : (stryCov_9fa48("26496"), {
          isValid: stryMutAct_9fa48("26497") ? true : (stryCov_9fa48("26497"), false),
          sanitized: null,
          error: stryMutAct_9fa48("26498") ? "" : (stryCov_9fa48("26498"), 'Año es requerido')
        });
      }
    }
    const yearNum = (stryMutAct_9fa48("26501") ? typeof year !== 'string' : stryMutAct_9fa48("26500") ? false : stryMutAct_9fa48("26499") ? true : (stryCov_9fa48("26499", "26500", "26501"), typeof year === (stryMutAct_9fa48("26502") ? "" : (stryCov_9fa48("26502"), 'string')))) ? Number.parseInt(year, 10) : year;
    if (stryMutAct_9fa48("26504") ? false : stryMutAct_9fa48("26503") ? true : (stryCov_9fa48("26503", "26504"), Number.isNaN(yearNum))) {
      if (stryMutAct_9fa48("26505")) {
        {}
      } else {
        stryCov_9fa48("26505");
        return stryMutAct_9fa48("26506") ? {} : (stryCov_9fa48("26506"), {
          isValid: stryMutAct_9fa48("26507") ? true : (stryCov_9fa48("26507"), false),
          sanitized: null,
          error: stryMutAct_9fa48("26508") ? "" : (stryCov_9fa48("26508"), 'Año debe ser un número')
        });
      }
    }
    if (stryMutAct_9fa48("26511") ? yearNum < minYear && yearNum > maxYear : stryMutAct_9fa48("26510") ? false : stryMutAct_9fa48("26509") ? true : (stryCov_9fa48("26509", "26510", "26511"), (stryMutAct_9fa48("26514") ? yearNum >= minYear : stryMutAct_9fa48("26513") ? yearNum <= minYear : stryMutAct_9fa48("26512") ? false : (stryCov_9fa48("26512", "26513", "26514"), yearNum < minYear)) || (stryMutAct_9fa48("26517") ? yearNum <= maxYear : stryMutAct_9fa48("26516") ? yearNum >= maxYear : stryMutAct_9fa48("26515") ? false : (stryCov_9fa48("26515", "26516", "26517"), yearNum > maxYear)))) {
      if (stryMutAct_9fa48("26518")) {
        {}
      } else {
        stryCov_9fa48("26518");
        return stryMutAct_9fa48("26519") ? {} : (stryCov_9fa48("26519"), {
          isValid: stryMutAct_9fa48("26520") ? true : (stryCov_9fa48("26520"), false),
          sanitized: yearNum,
          error: stryMutAct_9fa48("26521") ? `` : (stryCov_9fa48("26521"), `Año debe estar entre ${minYear} y ${maxYear}`)
        });
      }
    }
    return stryMutAct_9fa48("26522") ? {} : (stryCov_9fa48("26522"), {
      isValid: stryMutAct_9fa48("26523") ? false : (stryCov_9fa48("26523"), true),
      sanitized: yearNum
    });
  }
}

/**
 * Valida un string genérico con opciones
 * @param input - String a validar
 * @param options - Opciones de validación
 * @returns Resultado de sanitizeAndValidate
 */
export function validateString(input: string | null | undefined, options: {
  minLength?: number;
  maxLength?: number;
  allowEmpty?: boolean;
  checkDangerous?: boolean;
  required?: boolean;
} = {}): {
  isValid: boolean;
  sanitized: string;
  error?: string;
} {
  if (stryMutAct_9fa48("26524")) {
    {}
  } else {
    stryCov_9fa48("26524");
    const {
      required = stryMutAct_9fa48("26525") ? true : (stryCov_9fa48("26525"), false),
      ...restOptions
    } = options;
    if (stryMutAct_9fa48("26528") ? required || !input : stryMutAct_9fa48("26527") ? false : stryMutAct_9fa48("26526") ? true : (stryCov_9fa48("26526", "26527", "26528"), required && (stryMutAct_9fa48("26529") ? input : (stryCov_9fa48("26529"), !input)))) {
      if (stryMutAct_9fa48("26530")) {
        {}
      } else {
        stryCov_9fa48("26530");
        return stryMutAct_9fa48("26531") ? {} : (stryCov_9fa48("26531"), {
          isValid: stryMutAct_9fa48("26532") ? true : (stryCov_9fa48("26532"), false),
          sanitized: stryMutAct_9fa48("26533") ? "Stryker was here!" : (stryCov_9fa48("26533"), ''),
          error: stryMutAct_9fa48("26534") ? "" : (stryCov_9fa48("26534"), 'Campo requerido')
        });
      }
    }
    return sanitizeAndValidate(input, restOptions);
  }
}