import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { trackVersionMetric } from '../metrics-tracker'
import { getOrCreateRequestId } from '../request-context'
import { 
  createOptimizedResponse, 
  addTracingHeaders, 
  addCorsHeaders 
} from '../response-helpers'
import { versionsResponseSchema } from '../response-schemas'
import { auditSensitiveOperation } from '../audit'
import { circuitBreakers } from '../circuit-breaker'
import { shouldUseStreaming, createStreamingResponse } from '../streaming'
import { calculateEnhancedMetrics, sendPerformanceAlertsToMonitoring, PerformanceAlertLevel } from '../performance-monitor'
import {
  getCachedVersions,
  setCachedVersions,
} from '../cache'
import { safeRound, safeToISOString } from '../validation-utils'
import {
  validateQueryParams,
} from '../validators'
import {
  getNoteForStudent,
  calculateQueryLimit,
  calculateVersionStatistics,
} from '../queries'
import { fetchVersions } from '../filters'
import { processVersions, buildCurrentVersion, buildVersionsResponse } from '../processors'
import {
  withAuthContext,
  validateResponseData,
  handleHandlerError,
} from '../helpers'
import { 
  STREAMING_CONFIG, 
  CALCULATION_CONFIG,
  RESPONSE_CONFIG,
} from '../config'
import type { VersionFilters, VersionWithMetadata, StudyNoteVersion } from '@/lib/types/versions'
import { calculateDataSize, estimateVersionsSize, calculateDuration } from '../helpers'

/**
 * Obtiene la fecha de creación de la última versión si existe
 */
/**
 * Obtiene la fecha de la última versión
 * CORRECCIÓN: Valida que versions no sea null/undefined antes de acceder a length
 */
function getLastVersionDate(versions: Array<{ createdAt: Date }>): Date | null {
  if (!Array.isArray(versions) || versions.length === 0) {
    return null
  }
  return versions[0].createdAt
}

/**
 * Determina si hay filtros activos en la consulta
 * CORRECCIÓN: Valida que filters no sea null/undefined antes de acceder a propiedades
 */
function hasActiveFilters(filters: {
  search?: string
  isImportant?: boolean
  hasName?: boolean
  dateFrom?: Date
  dateTo?: Date
}): boolean {
  if (!filters || typeof filters !== 'object') {
    return false
  }
  return !!(
    filters.search ||
    filters.isImportant !== undefined ||
    filters.hasName !== undefined ||
    filters.dateFrom ||
    filters.dateTo
  )
}

/**
 * Redondea un número a un número específico de decimales
 * CORRECCIÓN: Valida que value y decimals sean números finitos antes de usar Math.pow
 */
/**
 * @deprecated Usar safeRound de validation-utils en su lugar
 */
function roundToDecimals(value: number, decimals: number): number {
  return safeRound(value, decimals)
}

/**
 * Calcula los días desde la última actualización con validación completa
 */
/**
 * Calcula días desde última actualización
 * CORRECCIÓN: Valida que daysPrecision sea un número válido y positivo antes de usar Math.log10
 */
function calculateDaysSinceLastUpdate(
  lastUpdated: Date,
  msPerDay: number,
  daysPrecision: number
): number {
  if (!(lastUpdated instanceof Date) || Number.isNaN(lastUpdated.getTime())) {
    return 0
  }
  
  if (msPerDay <= 0 || !Number.isFinite(msPerDay)) {
    return 0
  }
  
  const diff = (Date.now() - lastUpdated.getTime()) / msPerDay
  if (!Number.isFinite(diff)) {
    return 0
  }
  
  // CORRECCIÓN: Validar que daysPrecision sea un número válido y positivo antes de usar Math.log10
  if (!Number.isFinite(daysPrecision) || daysPrecision <= 0) {
    logger.warn(
      { daysPrecision, diff },
      'calculateDaysSinceLastUpdate: daysPrecision inválido, retornando diff sin redondear'
    )
    return Number.isFinite(diff) ? diff : 0
  }
  
  // CORRECCIÓN: Validar que Math.log10() retorne un número finito antes de usar
  let decimals: number
  try {
    decimals = Math.log10(daysPrecision)
    // Validar que el resultado sea un número finito
    if (!Number.isFinite(decimals)) {
      logger.warn(
        { daysPrecision, decimals },
        'calculateDaysSinceLastUpdate: Math.log10() retornó valor no finito, usando diff sin redondear'
      )
      return Number.isFinite(diff) ? diff : 0
    }
  } catch (error) {
    logger.warn(
      { error, daysPrecision },
      'calculateDaysSinceLastUpdate: Error al calcular Math.log10(), usando diff sin redondear'
    )
    return Number.isFinite(diff) ? diff : 0
  }
  
  const rounded = Number.isFinite(decimals) ? roundToDecimals(diff, decimals) : diff
  return Number.isFinite(rounded) ? rounded : 0
}

/**
 * Construye objeto de métricas de compresión para tracking
 * CORRECCIÓN: Valida que todos los parámetros sean números finitos antes de usar roundToDecimals
 */
function buildCompressionMetrics(
  compressedSize: number,
  decompressedSize: number,
  processedDataSize: number,
  compressionRatio: number,
  averageVersionSize: number
): Record<string, number> {
  // Validar que todos los parámetros sean números finitos
  const safeCompressedSize = Number.isFinite(compressedSize) ? compressedSize : 0
  const safeDecompressedSize = Number.isFinite(decompressedSize) ? decompressedSize : 0
  const safeProcessedDataSize = Number.isFinite(processedDataSize) ? processedDataSize : 0
  const safeCompressionRatio = Number.isFinite(compressionRatio) ? compressionRatio : 0
  const safeAverageVersionSize = Number.isFinite(averageVersionSize) ? averageVersionSize : 0
  
  return {
    processedDataSizeBytes: safeProcessedDataSize,
    averageVersionSizeBytes: safeAverageVersionSize,
    compressedSizeBytes: safeCompressedSize,
    decompressedSizeBytes: safeDecompressedSize,
    compressionRatio: roundToDecimals(safeCompressionRatio, 2),
  }
}

/**
 * Crea estadísticas por defecto basadas en versiones obtenidas
 * CORRECCIÓN: Valida que versionCount sea un número válido antes de usarlo
 */
function createDefaultStatistics(versionCount: number): Awaited<ReturnType<typeof calculateVersionStatistics>> {
  const safeVersionCount = Number.isFinite(versionCount) && versionCount >= 0 ? versionCount : 0
  return {
    totalVersions: safeVersionCount,
    averageDaysBetweenVersions: null,
    importantVersions: 0,
    namedVersions: 0,
    totalRestores: 0,
    daysSinceLastUpdate: 0,
    lastUpdated: '',
  }
}

/**
 * Intenta recuperar versiones y estadísticas de forma parcial si Promise.all falla
 * Si falla calculateVersionStatistics, usa estadísticas por defecto basadas en las versiones obtenidas
 * Si falla fetchVersions, lanza el error (no hay fallback posible)
 */
async function fetchVersionsWithFallbackStatistics(
  noteId: string,
  queryLimit: number,
  queryOffset: number,
  filters: VersionFilters,
  _requestId: string
): Promise<{
  statistics: Awaited<ReturnType<typeof calculateVersionStatistics>>
  versionsResult: Awaited<ReturnType<typeof fetchVersions>>
}> {
  try {
    // CORRECCIÓN: Validar que Promise.all() retorne un array válido con 2 elementos
    let results: [Awaited<ReturnType<typeof calculateVersionStatistics>>, Awaited<ReturnType<typeof fetchVersions>>]
    try {
      results = await Promise.all([
        calculateVersionStatistics(noteId),
        fetchVersions(noteId, queryLimit, queryOffset, filters),
      ])
      
      // Validar que results sea un array válido con 2 elementos
      if (!Array.isArray(results) || results.length !== 2) {
        logger.error(
          { noteId, results },
          'fetchVersionsWithFallbackStatistics: Promise.all() retornó resultado inválido'
        )
        throw new Error('Promise.all() retornó resultado inválido')
      }
    } catch (error) {
      logger.error(
        { error, noteId },
        'fetchVersionsWithFallbackStatistics: Error en Promise.all(), intentando recuperación parcial'
      )
      throw error // Re-lanzar para que se maneje en el catch externo
    }
    
    const [statistics, versionsResult] = results
    return { statistics, versionsResult }
  } catch (error) {
    logger.warn(
      { error, noteId },
      'Error en Promise.all, intentando recuperación parcial'
    )
    
    // Intentar obtener al menos las versiones
    const versionsResult = await fetchVersions(noteId, queryLimit, queryOffset, filters)
    
    // CORRECCIÓN: Validar que versionsResult.versions sea un array válido antes de acceder a length
    const versionCount = Array.isArray(versionsResult?.versions) ? versionsResult.versions.length : 0
    
    // Usar estadísticas por defecto basadas en las versiones obtenidas
    const statistics = createDefaultStatistics(versionCount)
    
    return { statistics, versionsResult }
  }
}

/**
 * Suma los elementos de un array numérico
 * CORRECCIÓN: Valida que numbers no sea null/undefined antes de usar reduce
 */
function sumArray(numbers: number[]): number {
  if (!Array.isArray(numbers)) {
    logger.warn(
      { numbers },
      'sumArray recibió numbers inválido, retornando 0'
    )
    return 0
  }
  return numbers.reduce((a, b) => {
    const safeA = Number.isFinite(a) ? a : 0
    const safeB = Number.isFinite(b) ? b : 0
    const sum = safeA + safeB
    return Number.isFinite(sum) ? sum : 0
  }, 0)
}

/**
 * Calcula el tamaño comprimido total de versiones
 * CORRECCIÓN: Valida que versions no sea null/undefined antes de usar map
 */
function calculateCompressedSize(versions: StudyNoteVersion[]): number {
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions },
      'calculateCompressedSize recibió versions inválido, retornando 0'
    )
    return 0
  }
  const contentLengths = versions.map(v => v.content?.length || 0)
  return sumArray(contentLengths)
}

/**
 * Calcula el ratio de compresión de forma segura
 * CORRECCIÓN: Valida que los parámetros sean números finitos antes de operar
 */
function calculateCompressionRatio(compressedSize: number, decompressedSize: number): number {
  // Validar que ambos parámetros sean números finitos
  if (!Number.isFinite(compressedSize) || !Number.isFinite(decompressedSize)) {
    logger.warn(
      { compressedSize, decompressedSize },
      'calculateCompressionRatio: parámetros inválidos, retornando 0'
    )
    return 0
  }
  
  // CORRECCIÓN: Validar que la división sea válida antes de calcular
  if (compressedSize > 0 && decompressedSize > 0) {
    const ratio = compressedSize / decompressedSize
    // Validar que el resultado de la división sea un número finito
    if (Number.isFinite(ratio) && ratio >= 0) {
      return ratio
    } else {
      logger.warn(
        { compressedSize, decompressedSize, ratio },
        'calculateCompressionRatio: división resultó en valor no finito o negativo, retornando 0'
      )
      return 0
    }
  }
  return 0
}

/**
 * Calcula el tamaño promedio de versiones de forma segura
 * CORRECCIÓN: Valida que los parámetros sean números finitos antes de operar
 */
function calculateAverageVersionSize(processedDataSize: number, versionCount: number): number {
  // Validar que ambos parámetros sean números finitos
  if (!Number.isFinite(processedDataSize) || !Number.isFinite(versionCount)) {
    logger.warn(
      { processedDataSize, versionCount },
      'calculateAverageVersionSize: parámetros inválidos, retornando 0'
    )
    return 0
  }
  
  return versionCount > 0 
    ? safeRound(processedDataSize / versionCount, 0) 
    : 0
}

/**
 * Calcula métricas de tamaño y compresión para versiones
 */
function calculateVersionSizeMetrics(
  versions: StudyNoteVersion[],
  decompressedVersions: VersionWithMetadata[],
  allVersions: VersionWithMetadata[],
  _noteId: string
): {
  compressedSize: number
  decompressedSize: number
  processedDataSize: number
  compressionRatio: number
  averageVersionSize: number
} {
  const compressedSize = calculateCompressedSize(versions)
  
  const decompressedSize = calculateDataSize(
    decompressedVersions,
    () => estimateVersionsSize(decompressedVersions),
    'decompressedVersions'
  )
  
  const processedDataSize = calculateDataSize(
    allVersions,
    () => estimateVersionsSize(allVersions),
    'allVersions'
  )
  
  const compressionRatio = calculateCompressionRatio(compressedSize, decompressedSize)
  const averageVersionSize = calculateAverageVersionSize(processedDataSize, allVersions.length)
  
  return {
    compressedSize,
    decompressedSize,
    processedDataSize,
    compressionRatio,
    averageVersionSize,
  }
}

/**
 * GET: Obtener versiones de una nota
 * 
 * Obtiene todas las versiones históricas de una nota de estudio, incluyendo la versión actual.
 * Soporta paginación, filtros y búsqueda full-text.
 * 
 * @param request - NextRequest con query parameters
 * @returns NextResponse con versiones y metadatos
 */
export async function handleGetRequest(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    // Autenticación, contexto enriquecido y request ID
    const authContextResult = await withAuthContext(request, startTime)
    if (!authContextResult.success) {
      const requestId = getOrCreateRequestId(request)
      return addTracingHeaders(authContextResult.error, requestId, calculateDuration(startTime))
    }

    const { user: dbUser, metrics: authMetrics, enrichedContext, requestId } = authContextResult.data

    // Validar parámetros de query
    const validationStartTime = Date.now()
    const queryResult = validateQueryParams(request)
    if (!queryResult.success) {
      return queryResult.error
    }
    const { noteId, limit, offset, cursor, search, isImportant, hasName, dateFrom, dateTo } = queryResult.data

    // Construir objeto de filtros
    const filters = {
      cursor,
      search,
      isImportant,
      hasName,
      dateFrom,
      dateTo,
    }

    // Intentar obtener del caché con circuit breaker
    const cacheStartTime = Date.now()
    const cachedData = await circuitBreakers.cache.execute(
      () => getCachedVersions(noteId, cursor, filters),
      () => Promise.resolve(null) // Fallback: no cache
    )
    const cacheDuration = calculateDuration(cacheStartTime)
    
    if (cachedData) {
      const requestETag = request.headers.get('if-none-match')
      const response = createOptimizedResponse(cachedData, {
        requestETag,
        maxAge: RESPONSE_CONFIG.READ_RESPONSE.maxAge,
      })
      
      // Calcular métricas de performance (cache hit es rápido, no debería tener alertas)
      const performanceMetrics = calculateEnhancedMetrics(startTime, { cacheDuration }, 'GET')
      
      logger.info(
        { 
          requestId,
          noteId, 
          cursor, 
          filters,
          cacheHit: true,
          metrics: performanceMetrics,
        },
        'Versiones obtenidas del caché'
      )
      return addTracingHeaders(
        addCorsHeaders(response),
        requestId,
        calculateDuration(startTime)
      )
    }

    // Obtener y validar nota
    const noteStartTime = Date.now()
    const noteResult = await getNoteForStudent(noteId, dbUser.student.id)
    if (!noteResult.success) {
      return noteResult.error
    }
    const { data: note } = noteResult

    // Calcular límites de paginación
    const { queryLimit, queryOffset } = calculateQueryLimit(limit, offset)

    // Obtener estadísticas y versiones en paralelo con manejo de errores individual
    const queryStartTime = Date.now()
    const { statistics, versionsResult } = await fetchVersionsWithFallbackStatistics(
      note.id,
      queryLimit,
      queryOffset,
      filters,
      requestId
    )

    const { versions, hasMore, nextCursor } = versionsResult
    const queryDuration = calculateDuration(queryStartTime)

    // Procesar versiones (descomprimir si es necesario) con métricas
    const decompressionStartTime = Date.now()
    const decompressedVersions = await processVersions(versions)
    const decompressionDuration = calculateDuration(decompressionStartTime)

    // Construir lista completa de versiones
    const currentVersion = buildCurrentVersion(note, dbUser.student.id)
    const allVersions = [currentVersion, ...decompressedVersions]

    // Calcular métricas de tamaño y compresión
    const {
      compressedSize,
      decompressedSize,
      processedDataSize,
      compressionRatio,
      averageVersionSize,
    } = calculateVersionSizeMetrics(versions, decompressedVersions, allVersions, noteId)

    // OPTIMIZACIÓN: Determinar si usar streaming ANTES de construir respuesta completa
    // Esto ahorra memoria al evitar construir responseData si vamos a usar streaming
    const useStreaming = shouldUseStreaming(allVersions.length, STREAMING_CONFIG.THRESHOLD)

    // Construir métricas de compresión una sola vez
    const compressionMetrics = buildCompressionMetrics(
      compressedSize,
      decompressedSize,
      processedDataSize,
      compressionRatio,
      averageVersionSize
    )

    // Trackear métrica de uso con tamaño de datos y métricas de compresión (antes de decidir streaming)
    trackVersionMetric('version.queried', {
      noteId,
      versionCount: allVersions.length,
      hasFilters: hasActiveFilters(filters),
      useStreaming,
      decompressionDurationMs: decompressionDuration,
      ...compressionMetrics,
    })

    // Auditar acceso
    auditSensitiveOperation('version.queried', enrichedContext, {
      metadata: { noteId, versionCount: allVersions.length },
    })

    // Calcular y loguear métricas de performance mejoradas (con tamaño de datos y compresión)
    const performanceMetrics = calculateEnhancedMetrics(startTime, {
      ...authMetrics,
      validationDuration: calculateDuration(validationStartTime),
      noteDuration: calculateDuration(noteStartTime),
      queryDuration,
      cacheDuration,
      decompressionDuration,
      versionCount: allVersions.length,
      ...compressionMetrics,
    }, 'GET')

    // Enviar alertas críticas a sistemas de monitoreo
    if (performanceMetrics.severity === PerformanceAlertLevel.CRITICAL) {
      sendPerformanceAlertsToMonitoring(performanceMetrics.alerts, {
        requestId,
        noteId,
        operation: 'GET',
      })
    }

    logger.info(
      {
        requestId,
        noteId,
        cursor,
        filters,
        cacheHit: false,
        useStreaming,
        metrics: performanceMetrics,
      },
      'Versiones obtenidas de la base de datos'
    )

    // Si vamos a usar streaming, retornar directamente sin construir responseData completo
    // Nota: No validamos la respuesta con schema en streaming porque:
    // 1. El streaming se usa para respuestas muy grandes donde la validación sería costosa
    // 2. Los datos ya fueron validados durante el procesamiento (processVersions, buildCurrentVersion, etc.)
    // 3. La validación completa requeriría construir el objeto completo, perdiendo el beneficio del streaming
    if (useStreaming) {
      // Para respuestas muy grandes, usar streaming directamente con las versiones
      const streamingResponse = createStreamingResponse(allVersions)
      return addTracingHeaders(
        addCorsHeaders(streamingResponse),
        requestId,
        calculateDuration(startTime)
      )
    }

    // Solo construir respuesta completa si NO vamos a usar streaming
    // Calcular última actualización con validación explícita
    const lastUpdated = getLastVersionDate(versions) ?? note.updatedAt

    // Calcular días desde última actualización
    const daysSinceLastUpdate = calculateDaysSinceLastUpdate(
      lastUpdated,
      CALCULATION_CONFIG.MS_PER_DAY,
      CALCULATION_CONFIG.DAYS_PRECISION
    )

    // Construir respuesta
    const responseData = buildVersionsResponse(
      allVersions,
      note,
      {
        ...statistics,
        daysSinceLastUpdate,
        lastUpdated: safeToISOString(lastUpdated),
      },
      {
        hasMore,
        nextCursor,
        limit: queryLimit,
        offset: queryOffset,
        total: statistics.totalVersions + 1,
      }
    )

    // Guardar en caché con circuit breaker (solo para respuestas no-streaming)
    await circuitBreakers.cache.execute(
      () => setCachedVersions(noteId, cursor, responseData, filters),
      () => Promise.resolve() // Fallback: no guardar en cache
    )

    // Validar respuesta contra schema (antes de enviar)
    const responseValidationResult = validateResponseData(
      versionsResponseSchema,
      responseData,
      requestId,
      'GET',
      { noteId }
    )
    if (!responseValidationResult.success) {
      // Si la validación falla, retornar error
      return responseValidationResult.error
    }

    // Crear respuesta optimizada para respuestas normales
    const requestETag = request.headers.get('if-none-match')
    const response = createOptimizedResponse(responseData, {
      requestETag,
      maxAge: RESPONSE_CONFIG.READ_RESPONSE.maxAge,
    })
    
    return addTracingHeaders(
      addCorsHeaders(response),
      requestId,
      calculateDuration(startTime)
    )
  } catch (error) {
    return handleHandlerError(error, request, 'version.queried', startTime)
  }
}

