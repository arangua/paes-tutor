/**
 * Streaming de respuestas para grandes volúmenes de datos
 * Útil para respuestas muy grandes que no caben en memoria
 */

import { NextResponse } from 'next/server'
import { Readable } from 'node:stream'
import { ensureArray, ensurePositiveNumber, ensureNonEmptyString } from './validation-utils'

/**
 * Crea una respuesta streaming para grandes volúmenes de datos
 * Útil cuando la respuesta es demasiado grande para cargar en memoria
 * CORRECCIÓN: Valida que data sea un array válido y chunkSize sea un número válido
 */
/**
 * Crea una respuesta streaming para grandes volúmenes de datos
 * 
 * DECISIÓN DE DISEÑO: Usa ensureArray, ensurePositiveNumber y ensureNonEmptyString
 * del sistema de validación centralizado para mantener consistencia.
 */
export function createStreamingResponse(
  data: unknown[],
  options?: {
    chunkSize?: number
    contentType?: string
  }
): NextResponse {
  // DECISIÓN DE DISEÑO: Usa ensureArray del sistema centralizado
  const safeData = ensureArray(data, [])
  if (safeData.length === 0) {
    return new NextResponse(JSON.stringify({ error: 'Data must be a non-empty array' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }
  
  // DECISIÓN DE DISEÑO: Usa ensurePositiveNumber del sistema centralizado
  const safeChunkSize = Math.max(1, Math.min(1000, ensurePositiveNumber(options?.chunkSize, 100)))
  
  // DECISIÓN DE DISEÑO: Usa ensureNonEmptyString del sistema centralizado
  const contentType = ensureNonEmptyString(options?.contentType, 'application/json')

  // Crear stream
  const stream = new Readable({
    objectMode: true,
    read() {
      // Este método será llamado cuando el stream necesite más datos
    },
  })

  // Procesar datos en chunks
  let index = 0
  const processChunk = () => {
    // Validar que index y data.length sean números válidos
    const safeIndex = Number.isFinite(index) ? index : 0
    const safeLength = Array.isArray(data) && Number.isFinite(data.length) ? data.length : 0
    
    if (safeIndex >= safeLength) {
      stream.push(null) // Fin del stream
      return
    }

    try {
      // CORRECCIÓN: Validar que data sea un array válido antes de usar slice()
      if (!Array.isArray(data)) {
        logger.error({ data, safeIndex }, 'createStreamingResponse: data no es un array válido antes de slice(), terminando stream')
        stream.push(null)
        return
      }
      
      // CORRECCIÓN: Validar que los índices sean válidos antes de usar slice()
      const safeStart = Number.isFinite(safeIndex) && safeIndex >= 0 ? safeIndex : 0
      const safeEnd = Number.isFinite(safeIndex + safeChunkSize) ? safeIndex + safeChunkSize : data.length
      
      let chunk: unknown[]
      try {
        chunk = data.slice(safeStart, safeEnd)
        // Validar que slice() retorne un array válido
        if (!Array.isArray(chunk)) {
          logger.warn(
            { data, safeStart, safeEnd, chunk },
            'createStreamingResponse: slice() retornó resultado inválido, saltando chunk'
          )
          index = safeEnd
          setImmediate(processChunk)
          return
        }
      } catch (sliceError) {
        logger.error(
          { error: sliceError, data, safeStart, safeEnd },
          'createStreamingResponse: Error al ejecutar slice(), terminando stream'
        )
        stream.push(null)
        return
      }
      
      let chunkJson: string
      try {
        chunkJson = JSON.stringify(chunk)
      } catch (error) {
        logger.error({ error, chunk, safeIndex }, 'createStreamingResponse: Error al serializar chunk a JSON, terminando stream')
        stream.push(null) // Terminar el stream si hay un error de serialización
        return
      }
      
      // Validar que chunkJson sea un string válido
      if (typeof chunkJson === 'string' && chunkJson.length > 0) {
        stream.push(chunkJson)
      } else {
        logger.warn({ chunk, chunkJson }, 'createStreamingResponse: JSON.stringify resultó en string vacío o inválido, saltando chunk')
      }
      index = safeEnd

      // Procesar siguiente chunk de forma asíncrona
      setImmediate(processChunk)
    } catch {
      // Si falla el procesamiento, terminar el stream
      stream.push(null)
    }
  }

  // Iniciar procesamiento
  processChunk()

  return new NextResponse(stream as unknown as BodyInit, {
    headers: {
      'Content-Type': contentType,
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
    },
  })
}

/**
 * Determina si una respuesta debe usar streaming
 * CORRECCIÓN: Valida que dataLength y threshold sean números válidos antes de comparar
 */
export function shouldUseStreaming(dataLength: number, threshold: number = 1000): boolean {
  // Validar que dataLength sea un número finito y no negativo
  const safeDataLength = Number.isFinite(dataLength) && dataLength >= 0 ? dataLength : 0
  
  // Validar que threshold sea un número finito y positivo
  const safeThreshold = Number.isFinite(threshold) && threshold > 0 ? threshold : 1000
  
  return safeDataLength > safeThreshold
}

