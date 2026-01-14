import { decompressVersionContent } from '@/lib/utils/version-content'
import { logger } from '@/lib/logger'
import type {
  VersionWithMetadata,
  NoteBasic,
  VersionStatistics,
  PaginationInfo,
  VersionsResponse,
  StudyNoteVersion,
} from '@/lib/types/versions'
import { ensureArray, ensureNonEmptyString } from './validation-utils'

/**
 * Tamaño de lote para procesamiento optimizado
 */
const BATCH_SIZE = 10

/**
 * Verifica si un array está vacío
 * 
 * DECISIÓN DE DISEÑO: Usa ensureArray del sistema de validación centralizado
 */
function isEmptyArray<T>(array: T[] | null | undefined): boolean {
  const safeArray = ensureArray(array, [])
  return safeArray.length === 0
}

/**
 * Obtiene título con fallback a string vacío
 * 
 * DECISIÓN DE DISEÑO: Usa ensureNonEmptyString del sistema de validación centralizado
 */
function getTitleWithEmptyFallback(title: string | null | undefined): string {
  return ensureNonEmptyString(title, '')
}

/**
 * Mapea metadatos básicos de versión con valores por defecto
 * CORRECCIÓN: Valida que version no sea null/undefined antes de acceder a propiedades
 */
function mapVersionMetadata(
  version: { id: string; title?: string | null; name?: string | null; color?: string | null; isImportant?: boolean | null; isCompressed?: boolean | null; tags?: string | null; createdAt: Date; createdBy: string }
): {
  id: string
  title: string
  name: string | null
  color: string | null
  isImportant: boolean
  isCompressed: boolean
  tags: string | null
  createdAt: Date
  createdBy: string
} {
  // Validar que version no sea null/undefined
  if (!version || typeof version !== 'object') {
    logger.warn(
      { version },
      'mapVersionMetadata recibió version inválido, usando valores por defecto'
    )
    // Retornar valores por defecto seguros
    return {
      id: 'unknown',
      title: '',
      name: null,
      color: null,
      isImportant: false,
      isCompressed: false,
      tags: null,
      createdAt: new Date(),
      createdBy: 'unknown',
    }
  }
  
  // Validar que createdAt sea una fecha válida
  // CORRECCIÓN: Validar que new Date() retorne una fecha válida
  let safeCreatedAt: Date
  if (version.createdAt instanceof Date && !Number.isNaN(version.createdAt.getTime())) {
    safeCreatedAt = version.createdAt
  } else {
    const fallbackDate = new Date()
    // Validar que fallbackDate sea una fecha válida
    if (fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())) {
      safeCreatedAt = fallbackDate
    } else {
      logger.warn(
        { version, createdAt: version.createdAt },
        'mapVersionMetadata: new Date() retornó fecha inválida, usando fecha por defecto'
      )
      safeCreatedAt = new Date(0) // Usar epoch como último recurso
    }
  }
  
  return {
    id: version.id || 'unknown',
    title: getTitleWithEmptyFallback(version.title),
    name: version.name ?? null,
    color: version.color ?? null,
    isImportant: version.isImportant ?? false,
    isCompressed: version.isCompressed ?? false,
    tags: version.tags ?? null,
    createdAt: safeCreatedAt,
    createdBy: version.createdBy || 'unknown',
  }
}

/**
 * Mapea versiones sin descomprimir contenido (solo metadatos)
 * CORRECCIÓN: Valida que versions no sea null/undefined antes de usar map
 */
function mapVersionsWithoutContent(versions: StudyNoteVersion[]): VersionWithMetadata[] {
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions },
      'mapVersionsWithoutContent recibió versions inválido, retornando array vacío'
    )
    return []
  }
  // CORRECCIÓN: Validar que versions sea un array válido antes de usar map()
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions },
      'mapVersionsWithoutContent recibió versions inválido (no es array), retornando array vacío'
    )
    return []
  }
  
  try {
    const mapped = versions.map((v) => {
      // Validar que v sea un objeto válido antes de usar mapVersionMetadata
      if (!v || typeof v !== 'object') {
        logger.warn(
          { v },
          'mapVersionsWithoutContent: versión inválida, usando valores por defecto'
        )
        return {
          ...mapVersionMetadata({
            id: 'unknown',
            title: '',
            name: null,
            color: null,
            isImportant: false,
            isCompressed: false,
            tags: null,
            createdAt: new Date(),
            createdBy: 'unknown',
          }),
          content: undefined,
        }
      }
      return {
        ...mapVersionMetadata(v),
        content: undefined,
      }
    })
    
    // Validar que mapped sea un array válido
    if (!Array.isArray(mapped)) {
      logger.warn(
        { versions, mapped },
        'mapVersionsWithoutContent: map() retornó resultado inválido, retornando array vacío'
      )
      return []
    }
    
    return mapped
  } catch (error) {
    logger.warn(
      { error, versions },
      'mapVersionsWithoutContent: Error al ejecutar map(), retornando array vacío'
    )
    return []
  }
}

/**
 * Procesa resultados de Promise.allSettled, incluyendo solo los exitosos
 * CORRECCIÓN: Valida que results no sea null/undefined antes de iterar
 */
function processSettledResults<T>(results: PromiseSettledResult<T>[]): T[] {
  // CORRECCIÓN: Validar que results sea un array válido antes de usar for...of
  if (!Array.isArray(results)) {
    logger.warn(
      { results },
      'processSettledResults recibió results inválido, retornando array vacío'
    )
    return []
  }
  
  const processed: T[] = []
  for (const result of results) {
    // CORRECCIÓN: Validar que result sea un objeto válido antes de acceder a status
    if (result && typeof result === 'object' && 'status' in result) {
      if (result.status === 'fulfilled' && 'value' in result) {
        // CORRECCIÓN: Validar que processed sea un array válido antes de usar push()
        if (Array.isArray(processed)) {
          processed.push(result.value as T)
        } else {
          logger.warn(
            { processed, result },
            'processSettledResults: processed no es un array válido, omitiendo valor'
          )
        }
      } else if (result.status === 'rejected' && 'reason' in result) {
        logger.error(
          { error: result.reason },
          'Error al procesar una versión, omitiendo'
        )
      }
    } else {
      logger.warn(
        { result },
        'processSettledResults: result inválido, omitiendo'
      )
    }
  }
  return processed
}

/**
 * Procesa versiones en lotes para grandes volúmenes
 * CORRECCIÓN: Valida que versions y batchSize sean válidos antes de usar slice
 */
async function processVersionsInBatches(
  versions: StudyNoteVersion[],
  batchSize: number
): Promise<VersionWithMetadata[]> {
  // Validar que versions sea un array válido
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions, batchSize },
      'processVersionsInBatches recibió versions inválido, retornando array vacío'
    )
    return []
  }
  
  // Validar que batchSize sea un número finito y positivo
  if (!Number.isFinite(batchSize) || batchSize <= 0) {
    logger.warn(
      { versions: versions.length, batchSize },
      'processVersionsInBatches recibió batchSize inválido, usando valor por defecto'
    )
    batchSize = BATCH_SIZE
  }
  
  // CORRECCIÓN: Validar que versions sea un array válido y batchSize sea un número válido
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions, batchSize },
      'processVersionsInBatches recibió versions inválido (no es array), retornando array vacío'
    )
    return []
  }
  
  const safeBatchSize = Number.isFinite(batchSize) && batchSize > 0 ? batchSize : 10
  
  const results: VersionWithMetadata[] = []
  
  // CORRECCIÓN: Validar que versions.length sea un número válido antes de usar en for loop
  const safeVersionsLength = Number.isFinite(versions.length) ? versions.length : 0
  
  // CORRECCIÓN: Validar que safeBatchSize sea un número finito y positivo antes de usar en for loop
  const safeIncrement = Number.isFinite(safeBatchSize) && safeBatchSize > 0 ? safeBatchSize : 10
  for (let i = 0; i < safeVersionsLength; i += safeIncrement) {
    // CORRECCIÓN: Validar que i sea un número válido antes de usar slice()
    const safeI = Number.isFinite(i) && i >= 0 ? i : 0
    const safeEnd = Number.isFinite(safeI + safeBatchSize) ? safeI + safeBatchSize : safeVersionsLength
    
    // CORRECCIÓN: Validar que versions sea un array válido antes de usar slice()
    if (!Array.isArray(versions)) {
      logger.warn(
        { versions, safeI, safeEnd },
        'processVersionsInBatches: versions no es un array válido antes de slice(), saltando batch'
      )
      continue
    }
    
    // CORRECCIÓN: Validar que los índices sean válidos antes de usar slice()
    const safeStart = Number.isFinite(safeI) && safeI >= 0 ? safeI : 0
    const safeEndIndex = Number.isFinite(safeEnd) && safeEnd >= safeStart ? safeEnd : versions.length
    
    let batch: StudyNoteVersion[]
    try {
      batch = versions.slice(safeStart, safeEndIndex)
      // Validar que slice() retorne un array válido
      if (!Array.isArray(batch)) {
        logger.warn(
          { versions, safeStart, safeEndIndex, batch },
          'processVersionsInBatches: slice() retornó resultado inválido, saltando batch'
        )
        continue
      }
    } catch (error) {
      logger.warn(
        { error, versions, safeStart, safeEndIndex },
        'processVersionsInBatches: Error al ejecutar slice(), saltando batch'
      )
      continue
    }
    
    // CORRECCIÓN: Validar que batch sea un array válido antes de usar map()
    if (!Array.isArray(batch) || batch.length === 0) {
      continue // Saltar si el batch está vacío o es inválido
    }
    
    const batchResults = await Promise.allSettled(
      batch.map(processSingleVersion)
    )
    
    // CORRECCIÓN: Validar que batchResults sea un array válido antes de procesar
    if (!Array.isArray(batchResults)) {
      logger.warn(
        { batch, batchIndex: i / safeBatchSize },
        'processVersionsInBatches: Promise.allSettled retornó resultado inválido, saltando batch'
      )
      continue
    }
    
    const processedBatch = processSettledResults(batchResults)
    // CORRECCIÓN: Validar que results sea un array válido y processedBatch sea un array válido antes de usar push()
    if (Array.isArray(results) && Array.isArray(processedBatch)) {
      try {
        // CORRECCIÓN: Validar que processedBatch tenga elementos válidos antes de usar spread operator
        const validBatch = processedBatch.filter(item => item !== null && item !== undefined)
        if (Array.isArray(validBatch) && validBatch.length > 0) {
          results.push(...validBatch)
        } else if (Array.isArray(processedBatch) && processedBatch.length > 0) {
          // Si el filtro eliminó todos los elementos pero processedBatch tiene elementos, usar processedBatch original
          results.push(...processedBatch)
        }
      } catch (error) {
        logger.warn(
          { error, results, processedBatch },
          'processVersionsInBatches: Error al ejecutar push() con spread operator, intentando push individual'
        )
        // Intentar push individual como fallback
        if (Array.isArray(processedBatch)) {
          for (const item of processedBatch) {
            if (item !== null && item !== undefined) {
              try {
                results.push(item)
              } catch (pushError) {
                logger.warn({ pushError, item }, 'Error al hacer push individual, omitiendo item')
              }
            }
          }
        }
      }
    } else {
      logger.warn(
        { results, processedBatch, batchIndex: i / safeBatchSize },
        'processVersionsInBatches: results o processedBatch no son arrays válidos, omitiendo batch'
      )
    }
  }
  
  return results
}

/**
 * Procesa versiones en paralelo para volúmenes pequeños
 * CORRECCIÓN: Valida que versions sea un array válido antes de usar map
 */
async function processVersionsInParallel(
  versions: StudyNoteVersion[]
): Promise<VersionWithMetadata[]> {
  // Validar que versions sea un array válido
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions },
      'processVersionsInParallel recibió versions inválido, retornando array vacío'
    )
    return []
  }
  
  const results = await Promise.allSettled(
    versions.map(processSingleVersion)
  )
  
  return processSettledResults(results)
}

/**
 * Obtiene el contenido de una versión, descomprimiendo si es necesario
 * CORRECCIÓN: Valida que version no sea null/undefined antes de acceder a propiedades
 */
async function getVersionContent(
  version: StudyNoteVersion,
  isCompressed: boolean
): Promise<string> {
  // Validar que version no sea null/undefined
  if (!version || typeof version !== 'object') {
    logger.warn(
      { version, isCompressed },
      'getVersionContent recibió version inválido, usando string vacío'
    )
    return ''
  }
  
  // Validar que version.id exista para logging
  const versionId = version.id || 'unknown'
  
  if (!version.content) {
    logger.warn({ versionId }, 'Versión con contenido null/undefined, usando string vacío')
    return ''
  }
  
  if (!isCompressed) {
    return version.content
  }
  
  try {
    return await decompressVersionContent(version.content, true, 'versions/route')
  } catch (error) {
    logger.error(
      { error, versionId, isCompressed },
      'Error al descomprimir contenido de versión, usando contenido original o string vacío'
    )
    return version.content || ''
  }
}

/**
 * Determina si la versión está comprimida después del procesamiento
 */
function determineFinalCompressionStatus(
  wasCompressed: boolean,
  originalContent: string | null,
  processedContent: string
): boolean {
  // Si no estaba comprimida, no puede estar comprimida después
  if (!wasCompressed) {
    return false
  }
  
  // Si el contenido procesado es igual al original, la descompresión falló o no era necesario
  return processedContent !== originalContent
}

/**
 * Procesa una versión individual: descomprime contenido y formatea metadatos
 * Maneja errores de descompresión y valores null/undefined de forma segura
 */
async function processSingleVersion(v: StudyNoteVersion): Promise<VersionWithMetadata> {
  const isCompressed = v.isCompressed ?? false
  const content = await getVersionContent(v, isCompressed)

  return {
    ...mapVersionMetadata(v),
    content,
    isCompressed: determineFinalCompressionStatus(isCompressed, v.content, content),
  }
}

/**
 * Descomprime y formatea versiones para la respuesta
 * OPTIMIZACIÓN: Soporta lazy loading y procesamiento por lotes para grandes volúmenes
 */
export async function processVersions(
  versions: StudyNoteVersion[],
  options?: { includeContent?: boolean; batchSize?: number }
): Promise<VersionWithMetadata[]> {
  // Validar que versions sea un array válido
  if (!Array.isArray(versions) || isEmptyArray(versions)) {
    logger.warn(
      { versionsCount: versions?.length },
      'processVersions recibió array vacío o inválido'
    )
    return []
  }

  // CORRECCIÓN: Validar que options sea un objeto válido antes de usar optional chaining y nullish coalescing
  const safeOptions = options && typeof options === 'object' && !Array.isArray(options) ? options : {}
  const includeContent = safeOptions.includeContent !== undefined && typeof safeOptions.includeContent === 'boolean'
    ? safeOptions.includeContent
    : true
  const batchSize = safeOptions.batchSize !== undefined && Number.isFinite(safeOptions.batchSize) && safeOptions.batchSize > 0
    ? safeOptions.batchSize
    : BATCH_SIZE
  
  // OPTIMIZACIÓN: Si no se necesita el contenido, retornar sin descomprimir
  if (!includeContent) {
    return mapVersionsWithoutContent(versions)
  }

  // OPTIMIZACIÓN: Para grandes volúmenes, procesar por lotes para evitar sobrecarga de memoria
  if (versions.length > batchSize * 2) {
    return await processVersionsInBatches(versions, batchSize)
  }

  // OPTIMIZACIÓN: Para volúmenes pequeños, procesar en paralelo usando Promise.allSettled
  // Esto es más eficiente que hacerlo secuencialmente y no falla si una versión falla
  return await processVersionsInParallel(versions)
}

/**
 * Construye la versión actual para incluir en la respuesta
 * CORRECCIÓN: Valida que note y studentId sean válidos antes de acceder a propiedades
 */
export function buildCurrentVersion(note: NoteBasic, studentId: string): VersionWithMetadata {
  // Validar que note no sea null/undefined
  if (!note || typeof note !== 'object') {
    logger.warn(
      { note, studentId },
      'buildCurrentVersion recibió note inválido, usando valores por defecto'
    )
    return {
      id: 'unknown',
      title: '',
      content: '',
      name: null,
      color: null,
      isImportant: false,
      isCompressed: false,
      tags: null,
      createdAt: new Date(),
      createdBy: studentId || 'unknown',
    }
  }
  
  // Validar que studentId sea un string válido
  const safeStudentId = typeof studentId === 'string' && studentId.length > 0
    ? studentId
    : 'unknown'
  
  // Validar que createdAt sea una fecha válida
  // CORRECCIÓN: Validar que new Date() retorne una fecha válida
  let safeCreatedAt: Date
  if (note.createdAt instanceof Date && !Number.isNaN(note.createdAt.getTime())) {
    safeCreatedAt = note.createdAt
  } else {
    const fallbackDate = new Date()
    // Validar que fallbackDate sea una fecha válida
    if (fallbackDate instanceof Date && !Number.isNaN(fallbackDate.getTime())) {
      safeCreatedAt = fallbackDate
    } else {
      logger.warn(
        { note, createdAt: note.createdAt },
        'buildCurrentVersion: new Date() retornó fecha inválida, usando fecha por defecto'
      )
      safeCreatedAt = new Date(0) // Usar epoch como último recurso
    }
  }
  
  return {
    id: note.id || 'unknown',
    title: note.title || '',
    content: note.content || '',
    tags: note.tags,
    name: null,
    color: null,
    isImportant: false,
    isCompressed: false,
    createdAt: safeCreatedAt,
    createdBy: safeStudentId,
  }
}

/**
 * Construye la respuesta completa de versiones
 */
export function buildVersionsResponse(
  allVersions: VersionWithMetadata[],
  note: NoteBasic,
  statistics: VersionStatistics,
  pagination: PaginationInfo
): VersionsResponse {
  return {
    versions: allVersions,
    currentVersionId: note.id,
    total: statistics.totalVersions + 1,
    statistics: {
      totalVersions: statistics.totalVersions + 1,
      averageDaysBetweenVersions: statistics.averageDaysBetweenVersions,
      daysSinceLastUpdate: statistics.daysSinceLastUpdate,
      lastUpdated: statistics.lastUpdated,
      importantVersions: statistics.importantVersions,
      namedVersions: statistics.namedVersions,
      totalRestores: statistics.totalRestores,
    },
    pagination: {
      ...pagination,
      total: statistics.totalVersions + 1,
    },
  }
}

