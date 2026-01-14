/**
 * Utilidades de encriptación para datos sensibles
 *
 * Usa AES-256 para encriptación robusta de API keys y datos sensibles
 * Requiere ENCRYPTION_KEY en variables de entorno (mínimo 32 caracteres)
 */

import CryptoJS from 'crypto-js'
import { logger } from './logger'
import { VALIDATION_CONSTANTS } from './constants'

// Validar que la clave de encriptación esté configurada
let ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

if (!ENCRYPTION_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'ENCRYPTION_KEY debe estar definido en producción. Configura esta variable de entorno antes de desplegar.'
    )
  }
  // En desarrollo, usar una clave temporal pero advertir
  logger.warn(
    { type: 'security', event: 'encryption_key_missing' },
    '⚠️ ENCRYPTION_KEY no está definido. Usando clave temporal para desarrollo. Configura ENCRYPTION_KEY en .env.local'
  )
  ENCRYPTION_KEY = 'dev-temp-key-' + Date.now()
  } else {
    // Validar longitud mínima recomendada (32 caracteres para AES-256)
    const MIN_RECOMMENDED_LENGTH = VALIDATION_CONSTANTS.MIN_RECOMMENDED_ENCRYPTION_KEY_LENGTH
    if (ENCRYPTION_KEY.length < MIN_RECOMMENDED_LENGTH) {
    logger.warn(
      {
        type: 'security',
        event: 'encryption_key_short',
        keyLength: ENCRYPTION_KEY.length,
        recommendedLength: MIN_RECOMMENDED_LENGTH,
      },
      `⚠️ ENCRYPTION_KEY es corta (${ENCRYPTION_KEY.length} caracteres). Se recomienda al menos ${MIN_RECOMMENDED_LENGTH} caracteres para mayor seguridad.`
    )
  }

  // En producción, validar que no sea la clave por defecto
  if (process.env.NODE_ENV === 'production') {
    const DEFAULT_KEY_PATTERN = /^(dev-|test-|default-|temp-)/i
    if (DEFAULT_KEY_PATTERN.test(ENCRYPTION_KEY)) {
      throw new Error(
        'ENCRYPTION_KEY no puede usar un prefijo de desarrollo/test en producción. Configura una clave segura.'
      )
    }
  }
}

/**
 * Genera una clave derivada desde la clave de encriptación
 * Usa PBKDF2 para derivar una clave de 256 bits
 */
function getDerivedKey(): string {
  // ENCRYPTION_KEY siempre está definido aquí (validado arriba en el módulo)
  // El non-null assertion es seguro porque la validación ocurre al cargar el módulo
   
  const key = ENCRYPTION_KEY!

  // Si la clave es muy corta, derivarla usando PBKDF2
  if (key.length < 32) {
    return CryptoJS.PBKDF2(key, 'paes-tutor-salt', {
      keySize: 256 / 32,
      iterations: 10000,
    }).toString()
  }
  // Si es suficientemente larga, usar directamente (truncar a 32 caracteres para AES-256)
  return key.substring(0, 32)
}

/**
 * Encripta un texto usando AES-256
 * @param text - Texto a encriptar
 * @returns Texto encriptado en formato base64
 */
export function encrypt(text: string): string {
  if (!text) return ''

  try {
    const key = getDerivedKey()
    const encrypted = CryptoJS.AES.encrypt(text, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    return encrypted.toString()
  } catch (error) {
    logger.error(
      {
        type: 'encryption',
        event: 'encrypt_error',
        error: error instanceof Error ? error.message : String(error),
      },
      'Error al encriptar datos sensibles'
    )
    throw new Error('Error al encriptar datos sensibles')
  }
}

/**
 * Desencripta un texto encriptado usando AES-256
 * @param encryptedText - Texto encriptado en formato base64
 * @returns Texto desencriptado
 * @throws Error si la desencriptación falla con ambos métodos (AES y legacy)
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error('No se puede desencriptar: texto encriptado vacío')
  }

  let aesError: Error | null = null

  try {
    // Intentar desencriptar con el nuevo método (AES)
    const key = getDerivedKey()
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

    // Si la desencriptación AES fue exitosa y tiene contenido, retornar
    if (decryptedText && decryptedText.trim().length > 0) {
      return decryptedText
    }

    // Si la desencriptación AES falla (texto vacío), intentar método antiguo (Base64)
    // Esto puede pasar si el dato fue encriptado con el método legacy
    if (encryptedText.length > 0) {
      logger.warn(
        {
          type: 'encryption',
          event: 'aes_decrypt_empty',
          encryptedTextLength: encryptedText.length,
        },
        'Desencriptación AES retornó texto vacío, intentando método legacy'
      )
      return decryptLegacy(encryptedText)
    }

    // Si llegamos aquí, el texto encriptado está vacío pero ya validamos arriba
    throw new Error('Texto encriptado inválido: no se pudo desencriptar con AES')
  } catch (error) {
    // Guardar el error de AES para logging
    aesError = error instanceof Error ? error : new Error(String(error))

    // Si falla AES, intentar método legacy para compatibilidad
    try {
      logger.warn(
        {
          type: 'encryption',
          event: 'aes_decrypt_failed',
          error: aesError.message,
          encryptedTextLength: encryptedText.length,
        },
        'Desencriptación AES falló, intentando método legacy'
      )
      return decryptLegacy(encryptedText)
    } catch (legacyError) {
      // Ambos métodos fallaron
      const legacyErrorMessage =
        legacyError instanceof Error ? legacyError.message : String(legacyError)

      logger.error(
        {
          type: 'encryption',
          event: 'decrypt_error',
          aesError: aesError.message,
          legacyError: legacyErrorMessage,
          encryptedTextLength: encryptedText.length,
        },
        'Error al desencriptar datos: ambos métodos (AES y legacy) fallaron'
      )

      throw new Error(
        `No se pudo desencriptar el dato. Método AES falló: ${aesError.message}. Método legacy falló: ${legacyErrorMessage}`
      )
    }
  }
}

/**
 * Método legacy de desencriptación (Base64) para compatibilidad con datos existentes
 * @deprecated Este método se mantiene solo para migración de datos existentes
 * @throws Error si la desencriptación falla
 */
function decryptLegacy(encryptedText: string): string {
  if (!encryptedText) {
    throw new Error('No se puede desencriptar: texto encriptado vacío')
  }

  try {
    const decoded = Buffer.from(encryptedText, 'base64').toString('utf-8')

    if (!decoded) {
      throw new Error('No se pudo decodificar el texto encriptado desde base64')
    }

    // Remover la clave del final (método antiguo)
    // ENCRYPTION_KEY está validado al inicio del módulo, el non-null assertion es seguro
    if (ENCRYPTION_KEY && decoded.endsWith(ENCRYPTION_KEY)) {
      // ENCRYPTION_KEY ya fue validado en la condición if anterior
       
      const result = decoded.slice(0, -ENCRYPTION_KEY.length)
      if (!result) {
        throw new Error('El resultado de desencriptación legacy está vacío')
      }
      return result
    }

    // Intentar con clave por defecto antigua
    const oldDefaultKey = 'default-key-change-in-production' // guard:allow-secret
    if (decoded.endsWith(oldDefaultKey)) {
      const result = decoded.slice(0, -oldDefaultKey.length)
      if (!result) {
        throw new Error('El resultado de desencriptación legacy está vacío')
      }
      return result
    }

    // Si no tiene clave al final, retornar el texto decodificado directamente
    // pero validar que no esté vacío
    if (!decoded || decoded.trim().length === 0) {
      throw new Error('El texto decodificado está vacío o inválido')
    }

    return decoded
  } catch (error) {
    // Si es un error que ya lanzamos, re-lanzarlo
    if (error instanceof Error && error.message.includes('No se puede desencriptar')) {
      throw error
    }

    // Para otros errores, lanzar un error descriptivo
    logger.error(
      {
        type: 'encryption',
        event: 'decrypt_legacy_error',
        error: error instanceof Error ? error.message : String(error),
        encryptedTextLength: encryptedText.length,
      },
      'Error al desencriptar con método legacy'
    )
    throw new Error(
      `No se pudo desencriptar el dato con el método legacy: ${error instanceof Error ? error.message : 'Error desconocido'}`
    )
  }
}

/**
 * Migra datos encriptados del método legacy (Base64) al nuevo método (AES)
 * Útil para actualizar datos existentes en la base de datos
 * @throws Error si la migración falla
 */
export function migrateEncryption(oldEncryptedText: string): string {
  if (!oldEncryptedText) {
    throw new Error('No se puede migrar: texto encriptado vacío')
  }

  try {
    // Desencriptar con método legacy
    const decrypted = decryptLegacy(oldEncryptedText)

    if (!decrypted || decrypted.trim().length === 0) {
      throw new Error('El resultado de desencriptación legacy está vacío')
    }

    // Re-encriptar con nuevo método
    return encrypt(decrypted)
  } catch (error) {
    logger.error(
      {
        type: 'encryption',
        event: 'migrate_encryption_error',
        error: error instanceof Error ? error.message : String(error),
        encryptedTextLength: oldEncryptedText.length,
      },
      'Error al migrar encriptación de legacy a AES'
    )
    throw new Error(
      `No se pudo migrar la encriptación: ${error instanceof Error ? error.message : 'Error desconocido'}`
    )
  }
}

/**
 * Enmascara una API key para mostrar solo los últimos caracteres
 */
export function maskApiKey(key: string | null | undefined): string {
  if (!key) return ''
  if (key.length <= 8) return '••••••••'
  return '••••••••' + key.slice(-4)
}
