/**
 * Utilidades de encriptación para datos sensibles
 *
 * Usa AES-256 para encriptación robusta de API keys y datos sensibles
 * Requiere ENCRYPTION_KEY en variables de entorno (mínimo 32 caracteres)
 */

import CryptoJS from 'crypto-js'
import { logger } from './logger'

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
}

/**
 * Genera una clave derivada desde la clave de encriptación
 * Usa PBKDF2 para derivar una clave de 256 bits
 */
function getDerivedKey(): string {
  // ENCRYPTION_KEY siempre está definido aquí (validado arriba)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
      { type: 'encryption', event: 'encrypt_error', error: error instanceof Error ? error.message : String(error) },
      'Error al encriptar datos sensibles'
    )
    throw new Error('Error al encriptar datos sensibles')
  }
}

/**
 * Desencripta un texto encriptado usando AES-256
 * @param encryptedText - Texto encriptado en formato base64
 * @returns Texto desencriptado
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return ''

  try {
    // Intentar desencriptar con el nuevo método (AES)
    const key = getDerivedKey()
    const decrypted = CryptoJS.AES.decrypt(encryptedText, key, {
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    })
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8)

    // Si la desencriptación AES falla (texto vacío), intentar método antiguo (Base64)
    if (!decryptedText && encryptedText.length > 0) {
      return decryptLegacy(encryptedText)
    }

    return decryptedText
  } catch (error) {
    // Si falla, intentar método legacy para compatibilidad
    try {
      return decryptLegacy(encryptedText)
    } catch (legacyError) {
      logger.error(
        {
          type: 'encryption',
          event: 'decrypt_error',
          error: error instanceof Error ? error.message : String(error),
          legacyError: legacyError instanceof Error ? legacyError.message : String(legacyError),
        },
        'Error al desencriptar datos: ambos métodos (AES y legacy) fallaron'
      )
      throw new Error('No se pudo desencriptar el dato. Los métodos AES y legacy fallaron.')
    }
  }
}

/**
 * Método legacy de desencriptación (Base64) para compatibilidad con datos existentes
 * @deprecated Este método se mantiene solo para migración de datos existentes
 */
function decryptLegacy(encryptedText: string): string {
  try {
    const decoded = Buffer.from(encryptedText, 'base64').toString('utf-8')
    // Remover la clave del final (método antiguo)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (ENCRYPTION_KEY && decoded.endsWith(ENCRYPTION_KEY)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return decoded.slice(0, -ENCRYPTION_KEY.length)
    }
    // Intentar con clave por defecto antigua
    const oldDefaultKey = 'default-key-change-in-production'
    if (decoded.endsWith(oldDefaultKey)) {
      return decoded.slice(0, -oldDefaultKey.length)
    }
    return decoded
  } catch {
    return ''
  }
}

/**
 * Migra datos encriptados del método legacy (Base64) al nuevo método (AES)
 * Útil para actualizar datos existentes en la base de datos
 */
export function migrateEncryption(oldEncryptedText: string): string {
  if (!oldEncryptedText) return ''

  try {
    // Desencriptar con método legacy
    const decrypted = decryptLegacy(oldEncryptedText)
    if (decrypted) {
      // Re-encriptar con nuevo método
      return encrypt(decrypted)
    }
    return oldEncryptedText
  } catch {
    return oldEncryptedText
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
