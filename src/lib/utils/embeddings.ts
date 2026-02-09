import { logger } from '@/lib/logger'

/**
 * Genera un embedding usando OpenAI (si está disponible)
 * 
 * Esta función utiliza el modelo 'text-embedding-3-small' de OpenAI para generar
 * embeddings vectoriales de texto. Los embeddings pueden usarse para búsqueda semántica
 * y comparación de similitud entre textos.
 * 
 * @param text - Texto a convertir en embedding
 * @param apiKey - API key de OpenAI (opcional, puede usar OPENAI_API_KEY de env)
 * @returns Array de números representando el embedding, o null si falla
 * 
 * @example
 * ```typescript
 * const embedding = await generateEmbedding('Texto de ejemplo')
 * if (embedding) {
 *   console.log(`Embedding generado con ${embedding.length} dimensiones`)
 * }
 * ```
 */
export async function generateEmbedding(text: string, apiKey?: string): Promise<number[] | null> {
  try {
    // Intentar usar OpenAI para embeddings
    const OpenAI = await import('openai').catch(() => null)
    
    if (!OpenAI) {
      logger.warn('OpenAI SDK no está instalado. Instala con: npm install openai')
      return null
    }

    const apiKeyValue = apiKey || process.env.OPENAI_API_KEY
    if (!apiKeyValue) {
      logger.warn('OpenAI API key no configurada')
      return null
    }

    const openai = new OpenAI.OpenAI({
      apiKey: apiKeyValue,
    })

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Modelo más económico y rápido
      input: text,
    })

    const embedding = response.data[0]?.embedding
    if (!embedding) {
      logger.warn('No se pudo obtener el embedding de la respuesta')
      return null
    }

    return embedding
  } catch (error) {
    logger.error({ error }, 'Error al generar embedding con OpenAI')
    return null
  }
}

/**
 * Calcula similitud coseno entre dos vectores
 * 
 * La similitud coseno mide el ángulo entre dos vectores en un espacio multidimensional.
 * Retorna un valor entre -1 y 1, donde:
 * - 1: Vectores idénticos (mismo ángulo)
 * - 0: Vectores ortogonales (perpendiculares)
 * - -1: Vectores opuestos
 * 
 * @param vec1 - Primer vector (array de números)
 * @param vec2 - Segundo vector (array de números)
 * @returns Similitud coseno entre 0 y 1 (normalizado), o 0 si los vectores tienen dimensiones diferentes
 * 
 * @example
 * ```typescript
 * const similarity = cosineSimilarity([1, 2, 3], [1, 2, 3])
 * console.log(similarity) // 1.0 (vectores idénticos)
 * 
 * const similarity2 = cosineSimilarity([1, 0], [0, 1])
 * console.log(similarity2) // 0.0 (vectores ortogonales)
 * ```
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    logger.warn(
      {
        vec1Length: vec1.length,
        vec2Length: vec2.length,
      },
      'Vectores con dimensiones diferentes en cosineSimilarity'
    )
    return 0
  }

  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (let i = 0; i < vec1.length; i++) {
     
    const v1 = vec1[i] ?? 0 // index controlled by loop bounds
     
    const v2 = vec2[i] ?? 0 // index controlled by loop bounds
    dotProduct += v1 * v2
    norm1 += v1 * v1
    norm2 += v2 * v2
  }

  const denominator = Math.sqrt(norm1) * Math.sqrt(norm2)
  if (denominator === 0) {
    return 0
  }

  return dotProduct / denominator
}

/**
 * Normaliza un vector a longitud unitaria
 * 
 * Útil para preparar vectores antes de calcular similitud coseno,
 * ya que la similitud coseno es equivalente al producto punto de vectores normalizados.
 * 
 * @param vec - Vector a normalizar
 * @returns Vector normalizado (misma dirección, longitud 1)
 * 
 * @example
 * ```typescript
 * const normalized = normalizeVector([3, 4])
 * console.log(normalized) // [0.6, 0.8] (longitud = 1)
 * ```
 */
export function normalizeVector(vec: number[]): number[] {
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0))
  
  if (magnitude === 0) {
    return vec // Retornar vector original si es cero
  }
  
  return vec.map(val => val / magnitude)
}

