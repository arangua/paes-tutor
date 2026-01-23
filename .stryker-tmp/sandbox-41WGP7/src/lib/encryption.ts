/**
 * Utilidades de encriptación para datos sensibles
 *
 * Usa AES-256 para encriptación robusta de API keys y datos sensibles
 * Requiere ENCRYPTION_KEY en variables de entorno (mínimo 32 caracteres)
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
import CryptoJS from 'crypto-js';
import { logger } from './logger';
import { VALIDATION_CONSTANTS } from './constants';

// Validar que la clave de encriptación esté configurada
let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (stryMutAct_9fa48("23470") ? false : stryMutAct_9fa48("23469") ? true : stryMutAct_9fa48("23468") ? ENCRYPTION_KEY : (stryCov_9fa48("23468", "23469", "23470"), !ENCRYPTION_KEY)) {
  if (stryMutAct_9fa48("23471")) {
    {}
  } else {
    stryCov_9fa48("23471");
    if (stryMutAct_9fa48("23474") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("23473") ? false : stryMutAct_9fa48("23472") ? true : (stryCov_9fa48("23472", "23473", "23474"), process.env.NODE_ENV === (stryMutAct_9fa48("23475") ? "" : (stryCov_9fa48("23475"), 'production')))) {
      if (stryMutAct_9fa48("23476")) {
        {}
      } else {
        stryCov_9fa48("23476");
        throw new Error(stryMutAct_9fa48("23477") ? "" : (stryCov_9fa48("23477"), 'ENCRYPTION_KEY debe estar definido en producción. Configura esta variable de entorno antes de desplegar.'));
      }
    }
    // En desarrollo, usar una clave temporal pero advertir
    logger.warn(stryMutAct_9fa48("23478") ? {} : (stryCov_9fa48("23478"), {
      type: stryMutAct_9fa48("23479") ? "" : (stryCov_9fa48("23479"), 'security'),
      event: stryMutAct_9fa48("23480") ? "" : (stryCov_9fa48("23480"), 'encryption_key_missing')
    }), stryMutAct_9fa48("23481") ? "" : (stryCov_9fa48("23481"), '⚠️ ENCRYPTION_KEY no está definido. Usando clave temporal para desarrollo. Configura ENCRYPTION_KEY en .env.local'));
    ENCRYPTION_KEY = (stryMutAct_9fa48("23482") ? "" : (stryCov_9fa48("23482"), 'dev-temp-key-')) + Date.now();
  }
} else {
  if (stryMutAct_9fa48("23483")) {
    {}
  } else {
    stryCov_9fa48("23483");
    // Validar longitud mínima recomendada (32 caracteres para AES-256)
    const MIN_RECOMMENDED_LENGTH = VALIDATION_CONSTANTS.MIN_RECOMMENDED_ENCRYPTION_KEY_LENGTH;
    if (stryMutAct_9fa48("23487") ? ENCRYPTION_KEY.length >= MIN_RECOMMENDED_LENGTH : stryMutAct_9fa48("23486") ? ENCRYPTION_KEY.length <= MIN_RECOMMENDED_LENGTH : stryMutAct_9fa48("23485") ? false : stryMutAct_9fa48("23484") ? true : (stryCov_9fa48("23484", "23485", "23486", "23487"), ENCRYPTION_KEY.length < MIN_RECOMMENDED_LENGTH)) {
      if (stryMutAct_9fa48("23488")) {
        {}
      } else {
        stryCov_9fa48("23488");
        logger.warn(stryMutAct_9fa48("23489") ? {} : (stryCov_9fa48("23489"), {
          type: stryMutAct_9fa48("23490") ? "" : (stryCov_9fa48("23490"), 'security'),
          event: stryMutAct_9fa48("23491") ? "" : (stryCov_9fa48("23491"), 'encryption_key_short'),
          keyLength: ENCRYPTION_KEY.length,
          recommendedLength: MIN_RECOMMENDED_LENGTH
        }), stryMutAct_9fa48("23492") ? `` : (stryCov_9fa48("23492"), `⚠️ ENCRYPTION_KEY es corta (${ENCRYPTION_KEY.length} caracteres). Se recomienda al menos ${MIN_RECOMMENDED_LENGTH} caracteres para mayor seguridad.`));
      }
    }

    // En producción, validar que no sea la clave por defecto
    if (stryMutAct_9fa48("23495") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("23494") ? false : stryMutAct_9fa48("23493") ? true : (stryCov_9fa48("23493", "23494", "23495"), process.env.NODE_ENV === (stryMutAct_9fa48("23496") ? "" : (stryCov_9fa48("23496"), 'production')))) {
      if (stryMutAct_9fa48("23497")) {
        {}
      } else {
        stryCov_9fa48("23497");
        const DEFAULT_KEY_PATTERN = stryMutAct_9fa48("23498") ? /(dev-|test-|default-|temp-)/i : (stryCov_9fa48("23498"), /^(dev-|test-|default-|temp-)/i);
        if (stryMutAct_9fa48("23500") ? false : stryMutAct_9fa48("23499") ? true : (stryCov_9fa48("23499", "23500"), DEFAULT_KEY_PATTERN.test(ENCRYPTION_KEY))) {
          if (stryMutAct_9fa48("23501")) {
            {}
          } else {
            stryCov_9fa48("23501");
            throw new Error(stryMutAct_9fa48("23502") ? "" : (stryCov_9fa48("23502"), 'ENCRYPTION_KEY no puede usar un prefijo de desarrollo/test en producción. Configura una clave segura.'));
          }
        }
      }
    }
  }
}

/**
 * Genera una clave derivada desde la clave de encriptación
 * Usa PBKDF2 para derivar una clave de 256 bits
 */
function getDerivedKey(): string {
  if (stryMutAct_9fa48("23503")) {
    {}
  } else {
    stryCov_9fa48("23503");
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // ENCRYPTION_KEY siempre está definido aquí (validado arriba en el módulo)
    // El non-null assertion es seguro porque la validación ocurre al cargar el módulo
    const key = ENCRYPTION_KEY!;

    // Si la clave es muy corta, derivarla usando PBKDF2
    if (stryMutAct_9fa48("23507") ? key.length >= 32 : stryMutAct_9fa48("23506") ? key.length <= 32 : stryMutAct_9fa48("23505") ? false : stryMutAct_9fa48("23504") ? true : (stryCov_9fa48("23504", "23505", "23506", "23507"), key.length < 32)) {
      if (stryMutAct_9fa48("23508")) {
        {}
      } else {
        stryCov_9fa48("23508");
        return CryptoJS.PBKDF2(key, stryMutAct_9fa48("23509") ? "" : (stryCov_9fa48("23509"), 'paes-tutor-salt'), stryMutAct_9fa48("23510") ? {} : (stryCov_9fa48("23510"), {
          keySize: stryMutAct_9fa48("23511") ? 256 * 32 : (stryCov_9fa48("23511"), 256 / 32),
          iterations: 10000
        })).toString();
      }
    }
    // Si es suficientemente larga, usar directamente (truncar a 32 caracteres para AES-256)
    return stryMutAct_9fa48("23512") ? key : (stryCov_9fa48("23512"), key.substring(0, 32));
  }
}

/**
 * Encripta un texto usando AES-256
 * @param text - Texto a encriptar
 * @returns Texto encriptado en formato base64
 */
export function encrypt(text: string): string {
  if (stryMutAct_9fa48("23513")) {
    {}
  } else {
    stryCov_9fa48("23513");
    if (stryMutAct_9fa48("23516") ? false : stryMutAct_9fa48("23515") ? true : stryMutAct_9fa48("23514") ? text : (stryCov_9fa48("23514", "23515", "23516"), !text)) return stryMutAct_9fa48("23517") ? "Stryker was here!" : (stryCov_9fa48("23517"), '');
    try {
      if (stryMutAct_9fa48("23518")) {
        {}
      } else {
        stryCov_9fa48("23518");
        const key = getDerivedKey();
        const encrypted = CryptoJS.AES.encrypt(text, key, stryMutAct_9fa48("23519") ? {} : (stryCov_9fa48("23519"), {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }));
        return encrypted.toString();
      }
    } catch (error) {
      if (stryMutAct_9fa48("23520")) {
        {}
      } else {
        stryCov_9fa48("23520");
        logger.error(stryMutAct_9fa48("23521") ? {} : (stryCov_9fa48("23521"), {
          type: stryMutAct_9fa48("23522") ? "" : (stryCov_9fa48("23522"), 'encryption'),
          event: stryMutAct_9fa48("23523") ? "" : (stryCov_9fa48("23523"), 'encrypt_error'),
          error: error instanceof Error ? error.message : String(error)
        }), stryMutAct_9fa48("23524") ? "" : (stryCov_9fa48("23524"), 'Error al encriptar datos sensibles'));
        throw new Error(stryMutAct_9fa48("23525") ? "" : (stryCov_9fa48("23525"), 'Error al encriptar datos sensibles'));
      }
    }
  }
}

/**
 * Desencripta un texto encriptado usando AES-256
 * @param encryptedText - Texto encriptado en formato base64
 * @returns Texto desencriptado
 * @throws Error si la desencriptación falla con ambos métodos (AES y legacy)
 */
export function decrypt(encryptedText: string): string {
  if (stryMutAct_9fa48("23526")) {
    {}
  } else {
    stryCov_9fa48("23526");
    if (stryMutAct_9fa48("23529") ? false : stryMutAct_9fa48("23528") ? true : stryMutAct_9fa48("23527") ? encryptedText : (stryCov_9fa48("23527", "23528", "23529"), !encryptedText)) {
      if (stryMutAct_9fa48("23530")) {
        {}
      } else {
        stryCov_9fa48("23530");
        throw new Error(stryMutAct_9fa48("23531") ? "" : (stryCov_9fa48("23531"), 'No se puede desencriptar: texto encriptado vacío'));
      }
    }
    let aesError: Error | null = null;
    try {
      if (stryMutAct_9fa48("23532")) {
        {}
      } else {
        stryCov_9fa48("23532");
        // Intentar desencriptar con el nuevo método (AES)
        const key = getDerivedKey();
        const decrypted = CryptoJS.AES.decrypt(encryptedText, key, stryMutAct_9fa48("23533") ? {} : (stryCov_9fa48("23533"), {
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }));
        const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);

        // Si la desencriptación AES fue exitosa y tiene contenido, retornar
        if (stryMutAct_9fa48("23536") ? decryptedText || decryptedText.trim().length > 0 : stryMutAct_9fa48("23535") ? false : stryMutAct_9fa48("23534") ? true : (stryCov_9fa48("23534", "23535", "23536"), decryptedText && (stryMutAct_9fa48("23539") ? decryptedText.trim().length <= 0 : stryMutAct_9fa48("23538") ? decryptedText.trim().length >= 0 : stryMutAct_9fa48("23537") ? true : (stryCov_9fa48("23537", "23538", "23539"), (stryMutAct_9fa48("23540") ? decryptedText.length : (stryCov_9fa48("23540"), decryptedText.trim().length)) > 0)))) {
          if (stryMutAct_9fa48("23541")) {
            {}
          } else {
            stryCov_9fa48("23541");
            return decryptedText;
          }
        }

        // Si la desencriptación AES falla (texto vacío), intentar método antiguo (Base64)
        // Esto puede pasar si el dato fue encriptado con el método legacy
        if (stryMutAct_9fa48("23545") ? encryptedText.length <= 0 : stryMutAct_9fa48("23544") ? encryptedText.length >= 0 : stryMutAct_9fa48("23543") ? false : stryMutAct_9fa48("23542") ? true : (stryCov_9fa48("23542", "23543", "23544", "23545"), encryptedText.length > 0)) {
          if (stryMutAct_9fa48("23546")) {
            {}
          } else {
            stryCov_9fa48("23546");
            logger.warn(stryMutAct_9fa48("23547") ? {} : (stryCov_9fa48("23547"), {
              type: stryMutAct_9fa48("23548") ? "" : (stryCov_9fa48("23548"), 'encryption'),
              event: stryMutAct_9fa48("23549") ? "" : (stryCov_9fa48("23549"), 'aes_decrypt_empty'),
              encryptedTextLength: encryptedText.length
            }), stryMutAct_9fa48("23550") ? "" : (stryCov_9fa48("23550"), 'Desencriptación AES retornó texto vacío, intentando método legacy'));
            return decryptLegacy(encryptedText);
          }
        }

        // Si llegamos aquí, el texto encriptado está vacío pero ya validamos arriba
        throw new Error(stryMutAct_9fa48("23551") ? "" : (stryCov_9fa48("23551"), 'Texto encriptado inválido: no se pudo desencriptar con AES'));
      }
    } catch (error) {
      if (stryMutAct_9fa48("23552")) {
        {}
      } else {
        stryCov_9fa48("23552");
        // Guardar el error de AES para logging
        aesError = error instanceof Error ? error : new Error(String(error));

        // Si falla AES, intentar método legacy para compatibilidad
        try {
          if (stryMutAct_9fa48("23553")) {
            {}
          } else {
            stryCov_9fa48("23553");
            logger.warn(stryMutAct_9fa48("23554") ? {} : (stryCov_9fa48("23554"), {
              type: stryMutAct_9fa48("23555") ? "" : (stryCov_9fa48("23555"), 'encryption'),
              event: stryMutAct_9fa48("23556") ? "" : (stryCov_9fa48("23556"), 'aes_decrypt_failed'),
              error: aesError.message,
              encryptedTextLength: encryptedText.length
            }), stryMutAct_9fa48("23557") ? "" : (stryCov_9fa48("23557"), 'Desencriptación AES falló, intentando método legacy'));
            return decryptLegacy(encryptedText);
          }
        } catch (legacyError) {
          if (stryMutAct_9fa48("23558")) {
            {}
          } else {
            stryCov_9fa48("23558");
            // Ambos métodos fallaron
            const legacyErrorMessage = legacyError instanceof Error ? legacyError.message : String(legacyError);
            logger.error(stryMutAct_9fa48("23559") ? {} : (stryCov_9fa48("23559"), {
              type: stryMutAct_9fa48("23560") ? "" : (stryCov_9fa48("23560"), 'encryption'),
              event: stryMutAct_9fa48("23561") ? "" : (stryCov_9fa48("23561"), 'decrypt_error'),
              aesError: aesError.message,
              legacyError: legacyErrorMessage,
              encryptedTextLength: encryptedText.length
            }), stryMutAct_9fa48("23562") ? "" : (stryCov_9fa48("23562"), 'Error al desencriptar datos: ambos métodos (AES y legacy) fallaron'));
            throw new Error(stryMutAct_9fa48("23563") ? `` : (stryCov_9fa48("23563"), `No se pudo desencriptar el dato. Método AES falló: ${aesError.message}. Método legacy falló: ${legacyErrorMessage}`));
          }
        }
      }
    }
  }
}

/**
 * Método legacy de desencriptación (Base64) para compatibilidad con datos existentes
 * @deprecated Este método se mantiene solo para migración de datos existentes
 * @throws Error si la desencriptación falla
 */
function decryptLegacy(encryptedText: string): string {
  if (stryMutAct_9fa48("23564")) {
    {}
  } else {
    stryCov_9fa48("23564");
    if (stryMutAct_9fa48("23567") ? false : stryMutAct_9fa48("23566") ? true : stryMutAct_9fa48("23565") ? encryptedText : (stryCov_9fa48("23565", "23566", "23567"), !encryptedText)) {
      if (stryMutAct_9fa48("23568")) {
        {}
      } else {
        stryCov_9fa48("23568");
        throw new Error(stryMutAct_9fa48("23569") ? "" : (stryCov_9fa48("23569"), 'No se puede desencriptar: texto encriptado vacío'));
      }
    }
    try {
      if (stryMutAct_9fa48("23570")) {
        {}
      } else {
        stryCov_9fa48("23570");
        const decoded = Buffer.from(encryptedText, stryMutAct_9fa48("23571") ? "" : (stryCov_9fa48("23571"), 'base64')).toString(stryMutAct_9fa48("23572") ? "" : (stryCov_9fa48("23572"), 'utf-8'));
        if (stryMutAct_9fa48("23575") ? false : stryMutAct_9fa48("23574") ? true : stryMutAct_9fa48("23573") ? decoded : (stryCov_9fa48("23573", "23574", "23575"), !decoded)) {
          if (stryMutAct_9fa48("23576")) {
            {}
          } else {
            stryCov_9fa48("23576");
            throw new Error(stryMutAct_9fa48("23577") ? "" : (stryCov_9fa48("23577"), 'No se pudo decodificar el texto encriptado desde base64'));
          }
        }

        // Remover la clave del final (método antiguo)
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        // ENCRYPTION_KEY está validado al inicio del módulo, el non-null assertion es seguro
        if (stryMutAct_9fa48("23580") ? ENCRYPTION_KEY || decoded.endsWith(ENCRYPTION_KEY) : stryMutAct_9fa48("23579") ? false : stryMutAct_9fa48("23578") ? true : (stryCov_9fa48("23578", "23579", "23580"), ENCRYPTION_KEY && (stryMutAct_9fa48("23581") ? decoded.startsWith(ENCRYPTION_KEY) : (stryCov_9fa48("23581"), decoded.endsWith(ENCRYPTION_KEY))))) {
          if (stryMutAct_9fa48("23582")) {
            {}
          } else {
            stryCov_9fa48("23582");
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            // ENCRYPTION_KEY ya fue validado en la condición if anterior
            const result = stryMutAct_9fa48("23583") ? decoded : (stryCov_9fa48("23583"), decoded.slice(0, stryMutAct_9fa48("23584") ? +ENCRYPTION_KEY.length : (stryCov_9fa48("23584"), -ENCRYPTION_KEY.length)));
            if (stryMutAct_9fa48("23587") ? false : stryMutAct_9fa48("23586") ? true : stryMutAct_9fa48("23585") ? result : (stryCov_9fa48("23585", "23586", "23587"), !result)) {
              if (stryMutAct_9fa48("23588")) {
                {}
              } else {
                stryCov_9fa48("23588");
                throw new Error(stryMutAct_9fa48("23589") ? "" : (stryCov_9fa48("23589"), 'El resultado de desencriptación legacy está vacío'));
              }
            }
            return result;
          }
        }

        // Intentar con clave por defecto antigua
        const oldDefaultKey = stryMutAct_9fa48("23590") ? "" : (stryCov_9fa48("23590"), 'default-key-change-in-production');
        if (stryMutAct_9fa48("23593") ? decoded.startsWith(oldDefaultKey) : stryMutAct_9fa48("23592") ? false : stryMutAct_9fa48("23591") ? true : (stryCov_9fa48("23591", "23592", "23593"), decoded.endsWith(oldDefaultKey))) {
          if (stryMutAct_9fa48("23594")) {
            {}
          } else {
            stryCov_9fa48("23594");
            const result = stryMutAct_9fa48("23595") ? decoded : (stryCov_9fa48("23595"), decoded.slice(0, stryMutAct_9fa48("23596") ? +oldDefaultKey.length : (stryCov_9fa48("23596"), -oldDefaultKey.length)));
            if (stryMutAct_9fa48("23599") ? false : stryMutAct_9fa48("23598") ? true : stryMutAct_9fa48("23597") ? result : (stryCov_9fa48("23597", "23598", "23599"), !result)) {
              if (stryMutAct_9fa48("23600")) {
                {}
              } else {
                stryCov_9fa48("23600");
                throw new Error(stryMutAct_9fa48("23601") ? "" : (stryCov_9fa48("23601"), 'El resultado de desencriptación legacy está vacío'));
              }
            }
            return result;
          }
        }

        // Si no tiene clave al final, retornar el texto decodificado directamente
        // pero validar que no esté vacío
        if (stryMutAct_9fa48("23604") ? !decoded && decoded.trim().length === 0 : stryMutAct_9fa48("23603") ? false : stryMutAct_9fa48("23602") ? true : (stryCov_9fa48("23602", "23603", "23604"), (stryMutAct_9fa48("23605") ? decoded : (stryCov_9fa48("23605"), !decoded)) || (stryMutAct_9fa48("23607") ? decoded.trim().length !== 0 : stryMutAct_9fa48("23606") ? false : (stryCov_9fa48("23606", "23607"), (stryMutAct_9fa48("23608") ? decoded.length : (stryCov_9fa48("23608"), decoded.trim().length)) === 0)))) {
          if (stryMutAct_9fa48("23609")) {
            {}
          } else {
            stryCov_9fa48("23609");
            throw new Error(stryMutAct_9fa48("23610") ? "" : (stryCov_9fa48("23610"), 'El texto decodificado está vacío o inválido'));
          }
        }
        return decoded;
      }
    } catch (error) {
      if (stryMutAct_9fa48("23611")) {
        {}
      } else {
        stryCov_9fa48("23611");
        // Si es un error que ya lanzamos, re-lanzarlo
        if (stryMutAct_9fa48("23614") ? error instanceof Error || error.message.includes('No se puede desencriptar') : stryMutAct_9fa48("23613") ? false : stryMutAct_9fa48("23612") ? true : (stryCov_9fa48("23612", "23613", "23614"), error instanceof Error && error.message.includes(stryMutAct_9fa48("23615") ? "" : (stryCov_9fa48("23615"), 'No se puede desencriptar')))) {
          if (stryMutAct_9fa48("23616")) {
            {}
          } else {
            stryCov_9fa48("23616");
            throw error;
          }
        }

        // Para otros errores, lanzar un error descriptivo
        logger.error(stryMutAct_9fa48("23617") ? {} : (stryCov_9fa48("23617"), {
          type: stryMutAct_9fa48("23618") ? "" : (stryCov_9fa48("23618"), 'encryption'),
          event: stryMutAct_9fa48("23619") ? "" : (stryCov_9fa48("23619"), 'decrypt_legacy_error'),
          error: error instanceof Error ? error.message : String(error),
          encryptedTextLength: encryptedText.length
        }), stryMutAct_9fa48("23620") ? "" : (stryCov_9fa48("23620"), 'Error al desencriptar con método legacy'));
        throw new Error(stryMutAct_9fa48("23621") ? `` : (stryCov_9fa48("23621"), `No se pudo desencriptar el dato con el método legacy: ${error instanceof Error ? error.message : stryMutAct_9fa48("23622") ? "" : (stryCov_9fa48("23622"), 'Error desconocido')}`));
      }
    }
  }
}

/**
 * Migra datos encriptados del método legacy (Base64) al nuevo método (AES)
 * Útil para actualizar datos existentes en la base de datos
 * @throws Error si la migración falla
 */
export function migrateEncryption(oldEncryptedText: string): string {
  if (stryMutAct_9fa48("23623")) {
    {}
  } else {
    stryCov_9fa48("23623");
    if (stryMutAct_9fa48("23626") ? false : stryMutAct_9fa48("23625") ? true : stryMutAct_9fa48("23624") ? oldEncryptedText : (stryCov_9fa48("23624", "23625", "23626"), !oldEncryptedText)) {
      if (stryMutAct_9fa48("23627")) {
        {}
      } else {
        stryCov_9fa48("23627");
        throw new Error(stryMutAct_9fa48("23628") ? "" : (stryCov_9fa48("23628"), 'No se puede migrar: texto encriptado vacío'));
      }
    }
    try {
      if (stryMutAct_9fa48("23629")) {
        {}
      } else {
        stryCov_9fa48("23629");
        // Desencriptar con método legacy
        const decrypted = decryptLegacy(oldEncryptedText);
        if (stryMutAct_9fa48("23632") ? !decrypted && decrypted.trim().length === 0 : stryMutAct_9fa48("23631") ? false : stryMutAct_9fa48("23630") ? true : (stryCov_9fa48("23630", "23631", "23632"), (stryMutAct_9fa48("23633") ? decrypted : (stryCov_9fa48("23633"), !decrypted)) || (stryMutAct_9fa48("23635") ? decrypted.trim().length !== 0 : stryMutAct_9fa48("23634") ? false : (stryCov_9fa48("23634", "23635"), (stryMutAct_9fa48("23636") ? decrypted.length : (stryCov_9fa48("23636"), decrypted.trim().length)) === 0)))) {
          if (stryMutAct_9fa48("23637")) {
            {}
          } else {
            stryCov_9fa48("23637");
            throw new Error(stryMutAct_9fa48("23638") ? "" : (stryCov_9fa48("23638"), 'El resultado de desencriptación legacy está vacío'));
          }
        }

        // Re-encriptar con nuevo método
        return encrypt(decrypted);
      }
    } catch (error) {
      if (stryMutAct_9fa48("23639")) {
        {}
      } else {
        stryCov_9fa48("23639");
        logger.error(stryMutAct_9fa48("23640") ? {} : (stryCov_9fa48("23640"), {
          type: stryMutAct_9fa48("23641") ? "" : (stryCov_9fa48("23641"), 'encryption'),
          event: stryMutAct_9fa48("23642") ? "" : (stryCov_9fa48("23642"), 'migrate_encryption_error'),
          error: error instanceof Error ? error.message : String(error),
          encryptedTextLength: oldEncryptedText.length
        }), stryMutAct_9fa48("23643") ? "" : (stryCov_9fa48("23643"), 'Error al migrar encriptación de legacy a AES'));
        throw new Error(stryMutAct_9fa48("23644") ? `` : (stryCov_9fa48("23644"), `No se pudo migrar la encriptación: ${error instanceof Error ? error.message : stryMutAct_9fa48("23645") ? "" : (stryCov_9fa48("23645"), 'Error desconocido')}`));
      }
    }
  }
}

/**
 * Enmascara una API key para mostrar solo los últimos caracteres
 */
export function maskApiKey(key: string | null | undefined): string {
  if (stryMutAct_9fa48("23646")) {
    {}
  } else {
    stryCov_9fa48("23646");
    if (stryMutAct_9fa48("23649") ? false : stryMutAct_9fa48("23648") ? true : stryMutAct_9fa48("23647") ? key : (stryCov_9fa48("23647", "23648", "23649"), !key)) return stryMutAct_9fa48("23650") ? "Stryker was here!" : (stryCov_9fa48("23650"), '');
    if (stryMutAct_9fa48("23654") ? key.length > 8 : stryMutAct_9fa48("23653") ? key.length < 8 : stryMutAct_9fa48("23652") ? false : stryMutAct_9fa48("23651") ? true : (stryCov_9fa48("23651", "23652", "23653", "23654"), key.length <= 8)) return stryMutAct_9fa48("23655") ? "" : (stryCov_9fa48("23655"), '••••••••');
    return (stryMutAct_9fa48("23656") ? "" : (stryCov_9fa48("23656"), '••••••••')) + (stryMutAct_9fa48("23657") ? key : (stryCov_9fa48("23657"), key.slice(stryMutAct_9fa48("23658") ? +4 : (stryCov_9fa48("23658"), -4))));
  }
}