import { gunzip } from 'node:zlib'
import { promisify } from 'node:util'
import { logger } from '@/lib/logger'

const gunzipAsync = promisify(gunzip)

/**
 * Tamaño máximo permitido para contenido comprimido (10MB en base64)
 * Esto previene ataques DoS por descompresión de archivos muy grandes
 */
const MAX_COMPRESSED_SIZE_BYTES = 10 * 1024 * 1024 // 10MB

/**
 * Descomprime el contenido de una versión si está comprimida
 * 
 * Esta función maneja la descompresión segura de contenido almacenado en formato gzip+base64.
 * Incluye validaciones de tamaño para prevenir ataques DoS.
 * 
 * @param content - Contenido que puede estar comprimido (base64) o sin comprimir
 * @param isCompressed - Indica si el contenido está comprimido
 * @param context - Contexto opcional para logging (ej: 'export', 'compare')
 * @returns Contenido descomprimido en formato UTF-8
 * 
 * @throws {Error} Si el contenido comprimido excede el tamaño máximo permitido
 * 
 * @example
 * ```typescript
 * const decompressed = await decompressVersionContent(
 *   'H4sIAAAAAAAAA...', 
 *   true,
 *   'export'
 * )
 * ```
 */
export async function decompressVersionContent(
  content: string,
  isCompressed: boolean,
  context?: string
): Promise<string> {
  if (!isCompressed) {
    return content
  }

  try {
    // Validar tamaño antes de descomprimir (prevenir DoS)
    const compressedBuffer = Buffer.from(content, 'base64')
    
    if (compressedBuffer.length > MAX_COMPRESSED_SIZE_BYTES) {
      const error = new Error(
        `Contenido comprimido excede el tamaño máximo permitido (${MAX_COMPRESSED_SIZE_BYTES / 1024 / 1024}MB)`
      )
      logger.error(
        {
          error,
          compressedSize: compressedBuffer.length,
          maxSize: MAX_COMPRESSED_SIZE_BYTES,
          context: context || 'unknown',
        },
        'Intento de descomprimir contenido demasiado grande'
      )
      throw error
    }

    const decompressedBuffer = await gunzipAsync(compressedBuffer)
    const decompressedContent = decompressedBuffer.toString('utf-8')

    // Log de éxito para monitoreo (solo si es grande)
    if (decompressedContent.length > 100000) {
      logger.info(
        {
          originalSize: compressedBuffer.length,
          decompressedSize: decompressedContent.length,
          compressionRatio: (compressedBuffer.length / decompressedContent.length * 100).toFixed(2) + '%',
          context: context || 'unknown',
        },
        'Contenido grande descomprimido exitosamente'
      )
    }

    return decompressedContent
  } catch (error) {
    // Si es un error de tamaño, re-lanzarlo
    if (error instanceof Error && error.message.includes('tamaño máximo')) {
      throw error
    }

    // Para otros errores, loguear y retornar contenido original como fallback
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        context: context || 'unknown',
      },
      'Error al descomprimir contenido de versión'
    )
    
    // Retornar contenido original como fallback (puede estar corrupto, pero mejor que nada)
    return content
  }
}

/**
 * Comprime contenido de versión usando gzip y codifica en base64
 * 
 * @param content - Contenido en formato UTF-8 a comprimir
 * @returns Contenido comprimido en formato base64
 * 
 * @example
 * ```typescript
 * const compressed = await compressVersionContent('Contenido largo...')
 * ```
 */
export async function compressVersionContent(content: string): Promise<string> {
  const { gzip } = await import('node:zlib')
  const { promisify } = await import('node:util')
  const gzipAsync = promisify(gzip)

  const buffer = Buffer.from(content, 'utf-8')
  const compressed = await gzipAsync(buffer)
  return compressed.toString('base64')
}

