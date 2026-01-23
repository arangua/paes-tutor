import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { logger } from '@/lib/logger'
import type {
  VersionFilters,
  VersionWithRank,
  PostgresWhereConditions,
  StudyNoteVersion,
} from '@/lib/types/versions'
import { LIMIT_CONSTANTS } from '@/lib/constants'
import { ensureArray, ensureNonEmptyString, safeStringOperation, safeToISOString, isValidDate } from './validation-utils'

// Constantes locales para versiones
const VERSION_CONSTANTS = {
  SQLITE_SEARCH_BUFFER: LIMIT_CONSTANTS.VERSION_SQLITE_SEARCH_BUFFER,
  MEMORY_FILTER_BUFFER: LIMIT_CONSTANTS.VERSION_MEMORY_FILTER_BUFFER,
} as const

/**
 * Construye filtros de fecha de manera reutilizable
 */
/**
 * Construye filtros de fecha para consultas
 * CORRECCIÓN: Valida que cursor sea una fecha válida antes de crear Date
 */
function buildDateFilters(cursor?: string, dateFrom?: Date, dateTo?: Date): {
  lt?: Date
  gte?: Date
  lte?: Date
} {
  const dateFilters: { lt?: Date; gte?: Date; lte?: Date } = {}
  
  if (cursor) {
    // CORRECCIÓN: Validar que cursor sea una fecha válida antes de crear Date
    const cursorDate = new Date(cursor)
    if (isValidDate(cursorDate)) {
      dateFilters.lt = cursorDate
    } else {
      logger.warn(
        { cursor },
        'buildDateFilters recibió cursor inválido, ignorando filtro de fecha'
      )
    }
  }
  
  // Validar que dateFrom sea una fecha válida
  if (dateFrom && isValidDate(dateFrom)) {
    dateFilters.gte = dateFrom
  } else if (dateFrom) {
    logger.warn(
      { dateFrom },
      'buildDateFilters recibió dateFrom inválido, ignorando filtro de fecha'
    )
  }
  
  // Validar que dateTo sea una fecha válida
  if (dateTo && isValidDate(dateTo)) {
    dateFilters.lte = dateTo
  } else if (dateTo) {
    logger.warn(
      { dateTo },
      'buildDateFilters recibió dateTo inválido, ignorando filtro de fecha'
    )
  }
  
  return dateFilters
}

/**
 * Aplica filtros comunes (fecha e importancia) a una cláusula WHERE
 */
function applyCommonFilters<T extends { createdAt?: Prisma.DateTimeFilter; isImportant?: boolean }>(
  whereClause: T,
  filters?: {
    cursor?: string
    dateFrom?: Date
    dateTo?: Date
    isImportant?: boolean
  }
): void {
  const dateFilters = buildDateFilters(filters?.cursor, filters?.dateFrom, filters?.dateTo)
  
  if (isNotEmptyObject(dateFilters)) {
    whereClause.createdAt = dateFilters as Prisma.DateTimeFilter
  }
  
  if (filters?.isImportant !== undefined) {
    // Usar type assertion específica ya que Prisma puede no tener el tipo actualizado
    // pero el campo existe en el schema
    ;(whereClause as T & { isImportant: boolean }).isImportant = filters.isImportant
  }
}

/**
 * Construye la cláusula WHERE para la consulta de versiones con filtros
 */
export function buildVersionsWhereClause(
  noteId: string,
  filters?: VersionFilters
): Prisma.StudyNoteVersionWhereInput {
  const whereClause: Prisma.StudyNoteVersionWhereInput = { noteId }
  
  // Aplicar filtros comunes (fecha e importancia)
  applyCommonFilters(whereClause, filters)
  
  return whereClause
}

/**
 * Agrega una condición WHERE con parámetro
 * CORRECCIÓN: Valida que condition no sea null/undefined antes de usar replace
 */
function addWhereCondition(
  conditions: string[],
  params: unknown[],
  paramIndex: number,
  condition: string,
  value: unknown
): number {
  // Validar que condition sea un string válido
  if (!condition || typeof condition !== 'string') {
    logger.warn(
      { condition, paramIndex },
      'addWhereCondition recibió condition inválido, ignorando condición'
    )
    return paramIndex
  }
  
      // CORRECCIÓN: Validar que condition sea un string válido antes de usar replace()
      if (typeof condition === 'string' && condition.length > 0) {
        try {
          const replaced = condition.replace('$INDEX', `$${paramIndex}`)
          // Validar que replaced sea un string válido
          if (typeof replaced === 'string' && replaced.length > 0) {
            // CORRECCIÓN: Validar que conditions sea un array válido antes de usar push()
            if (Array.isArray(conditions)) {
              try {
                conditions.push(replaced)
              } catch (error) {
                logger.warn(
                  { error, conditions, replaced },
                  'addWhereCondition: Error al ejecutar push() en conditions, omitiendo condición'
                )
              }
            } else {
              logger.warn(
                { conditions, replaced },
                'addWhereCondition: conditions no es un array válido, omitiendo condición'
              )
            }
          } else {
            logger.warn(
              { condition, paramIndex, replaced },
              'addWhereCondition: replace retornó string inválido, usando condición original'
            )
            // CORRECCIÓN: Validar que conditions sea un array válido antes de usar push()
            if (Array.isArray(conditions)) {
              try {
                conditions.push(condition)
              } catch (error) {
                logger.warn(
                  { error, conditions, condition },
                  'addWhereCondition: Error al ejecutar push() en conditions con condición original, omitiendo'
                )
              }
            }
          }
        } catch (error) {
          logger.warn(
            { error, condition, paramIndex },
            'Error al aplicar replace en condition, usando condición original'
          )
          // CORRECCIÓN: Validar que conditions sea un array válido antes de usar push()
          if (Array.isArray(conditions)) {
            try {
              conditions.push(condition)
            } catch (error) {
              logger.warn(
                { error, conditions, condition },
                'addWhereCondition: Error al ejecutar push() en conditions después de error, omitiendo'
              )
            }
          }
        }
      } else {
        logger.warn(
          { condition, paramIndex },
          'addWhereCondition: condition no es un string válido, omitiendo'
        )
      }
  // CORRECCIÓN: Validar que params sea un array válido antes de usar push()
  if (Array.isArray(params)) {
    try {
      params.push(value)
    } catch (error) {
      logger.warn(
        { error, params, value },
        'addWhereCondition: Error al ejecutar push() en params, omitiendo valor'
      )
    }
  } else {
    logger.warn(
      { params, value },
      'addWhereCondition: params no es un array válido, omitiendo valor'
    )
  }
  return paramIndex + 1
}

/**
 * Construye condiciones WHERE para búsqueda PostgreSQL
 */
export function buildPostgresWhereConditions(
  noteId: string,
  additionalFilters?: {
    cursor?: string
    isImportant?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): PostgresWhereConditions {
  const whereConditions: string[] = [`v."noteId" = $1`]
  const params: unknown[] = [noteId]
  let paramIndex = 2
  
  if (additionalFilters?.cursor) {
    // CORRECCIÓN: Validar que cursor sea una fecha válida antes de crear Date
    const cursorDate = new Date(additionalFilters.cursor)
    if (!Number.isNaN(cursorDate.getTime())) {
      paramIndex = addWhereCondition(
        whereConditions,
        params,
        paramIndex,
        `v."createdAt" < $INDEX`,
        cursorDate
      )
    } else {
      logger.warn(
        { cursor: additionalFilters.cursor },
        'buildPostgresWhereConditions recibió cursor inválido, ignorando filtro de fecha'
      )
    }
  }
  if (additionalFilters?.isImportant !== undefined) {
    paramIndex = addWhereCondition(
      whereConditions,
      params,
      paramIndex,
      `v."isImportant" = $INDEX`,
      additionalFilters.isImportant
    )
  }
  if (additionalFilters?.dateFrom) {
    paramIndex = addWhereCondition(
      whereConditions,
      params,
      paramIndex,
      `v."createdAt" >= $INDEX`,
      additionalFilters.dateFrom
    )
  }
  if (additionalFilters?.dateTo) {
    paramIndex = addWhereCondition(
      whereConditions,
      params,
      paramIndex,
      `v."createdAt" <= $INDEX`,
      additionalFilters.dateTo
    )
  }
  
  return { whereConditions, params, paramIndex }
}

/**
 * Normaliza término de búsqueda para comparaciones case-insensitive
 * CORRECCIÓN: Valida que searchTerm no sea null/undefined antes de procesar
 */
function normalizeSearchTerm(searchTerm: string): string {
  if (!searchTerm || typeof searchTerm !== 'string') {
    logger.warn(
      { searchTerm },
      'normalizeSearchTerm recibió valor inválido, usando string vacío'
    )
    return ''
  }
  
  try {
    const lowercased = searchTerm.toLowerCase()
    // CORRECCIÓN: Validar que toLowerCase() retorne un string válido
    if (typeof lowercased === 'string') {
      return lowercased
    } else {
      logger.warn(
        { searchTerm, lowercased },
        'normalizeSearchTerm: toLowerCase() retornó valor inválido, retornando string vacío'
      )
      return ''
    }
  } catch (error) {
    logger.warn(
      { error, searchTerm },
      'normalizeSearchTerm: Error al ejecutar toLowerCase(), retornando string vacío'
    )
    return ''
  }
}

/**
 * Verifica si un objeto está vacío
 * CORRECCIÓN: Valida que obj sea un objeto válido antes de usar Object.keys
 */
function isEmptyObject(obj: Record<string, unknown> | null | undefined): boolean {
  if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
    return true
  }
  try {
    // CORRECCIÓN: Validar que Object.keys() retorne un array válido antes de acceder a length
    const keys = Object.keys(obj)
    if (!Array.isArray(keys)) {
      logger.warn(
        { obj, keys },
        'isEmptyObject: Object.keys() retornó resultado inválido, asumiendo que está vacío'
      )
      return true
    }
    // Validar que length sea un número válido
    const safeLength = Number.isFinite(keys.length) ? keys.length : 0
    return safeLength === 0
  } catch (error) {
    logger.warn(
      { error, obj },
      'Error al verificar si objeto está vacío, asumiendo que está vacío'
    )
    return true
  }
}

/**
 * Verifica si un objeto no está vacío
 */
function isNotEmptyObject(obj: Record<string, unknown> | null | undefined): boolean {
  return !isEmptyObject(obj)
}

// isValidDate ahora se importa de validation-utils

/**
 * Obtiene el cursor de fecha válido de una versión
 */
function getValidDateCursor(version: { createdAt?: Date | null } | null | undefined): string | undefined {
  if (!version?.createdAt || !isValidDate(version.createdAt)) {
    return undefined
  }
  return safeToISOString(version.createdAt) || undefined
}

/**
 * Limita un array a un tamaño máximo
 * CORRECCIÓN: Valida que array y limit sean válidos antes de usar
 */
function limitArray<T>(array: T[], limit: number): T[] {
  // Validar que array sea un array válido
  if (!Array.isArray(array)) {
    logger.warn(
      { limit, array },
      'limitArray recibió array inválido, retornando array vacío'
    )
    return []
  }
  
  // Validar que limit sea un número finito y positivo
  if (!Number.isFinite(limit) || limit < 0) {
    logger.warn(
      { limit, arrayLength: array.length },
      'limitArray recibió limit inválido, retornando array completo'
    )
    return array
  }
  // CORRECCIÓN: Validar que limit sea un número válido antes de usar slice()
  const safeLimit = Number.isFinite(limit) && limit >= 0 ? Math.min(limit, array.length) : array.length
  try {
    const sliced = array.slice(0, safeLimit)
    // Validar que slice() retorne un array válido
    if (Array.isArray(sliced)) {
      return sliced
    } else {
      logger.warn(
        { limit, safeLimit, arrayLength: array.length, sliced },
        'limitArray: slice() retornó resultado inválido, retornando array completo'
      )
      return array
    }
  } catch (error) {
    logger.warn(
      { error, limit, safeLimit, arrayLength: array.length },
      'limitArray: Error al ejecutar slice(), retornando array completo'
    )
    return array
  }
}

/**
 * Obtiene el último elemento de un array de forma segura
 * 
 * DECISIÓN DE DISEÑO: Usa ensureArray del sistema de validación centralizado
 * para mantener consistencia y reducir duplicación.
 */
function getLastElement<T>(array: T[]): T | null {
  const safeArray = ensureArray(array, [])
  if (safeArray.length === 0) {
    return null
  }
  
  try {
    const lastElement = safeArray.at(-1)
    return lastElement !== undefined ? lastElement : null
  } catch (error) {
    logger.warn(
      { error, array: safeArray },
      'getLastElement: Error al ejecutar at(-1), retornando null'
    )
    return null
  }
}

/**
 * Verifica si un campo de texto contiene el término de búsqueda normalizado
 * CORRECCIÓN: Valida que field y searchLower sean strings válidos antes de usar toLowerCase e includes
 */
/**
 * Verifica si un campo de texto contiene el término de búsqueda normalizado
 * 
 * DECISIÓN DE DISEÑO: Usa safeStringOperation del sistema de validación centralizado
 * para ejecutar operaciones de string de forma segura.
 */
function fieldContainsSearch(field: string | null | undefined, searchLower: string): boolean {
  const safeField = ensureNonEmptyString(field, '')
  const safeSearchLower = ensureNonEmptyString(searchLower, '')
  
  if (safeField.length === 0 || safeSearchLower.length === 0) {
    return false
  }
  
  return safeStringOperation(
    safeField,
    (s) => {
      const lowercased = s.toLowerCase()
      return ensureNonEmptyString(lowercased, '').includes(safeSearchLower)
    },
    false
  )
}

/**
 * Verifica si un string no está vacío después de trim
 * 
 * DECISIÓN DE DISEÑO: Usa ensureNonEmptyString del sistema de validación centralizado
 * para mantener consistencia en toda la aplicación.
 */
function isNonEmptyString(value: string | null | undefined): boolean {
  const safeString = ensureNonEmptyString(value, '', true)
  return safeString.length > 0
}

/**
 * Verifica si una versión tiene un nombre no vacío
 */
function hasNonEmptyName(versionName: string | null | undefined): boolean {
  return isNonEmptyString(versionName)
}

/**
 * Construye vector de búsqueda full-text para PostgreSQL
 */
function buildSearchVector(): string {
  return `to_tsvector('spanish', coalesce(v.title, '') || ' ' || coalesce(v.content, '') || ' ' || coalesce(v.name, '') || ' ' || coalesce(v.tags, ''))`
}

/**
 * Realiza búsqueda full-text en PostgreSQL
 * 
 * IMPORTANTE: Esta función asume que la autorización del usuario para acceder a la nota
 * ya fue validada previamente. No realiza validación de autorización internamente.
 * 
 * @param noteId - ID de la nota (debe pertenecer al estudiante autenticado, validado previamente)
 * @param searchTerm - Término de búsqueda
 * @param queryLimit - Límite de resultados
 * @param queryOffset - Offset para paginación
 * @param additionalFilters - Filtros adicionales opcionales
 * @returns Array de versiones con ranking o null si hay error
 */
export async function performPostgresFullTextSearch(
  noteId: string,
  searchTerm: string,
  queryLimit: number,
  queryOffset: number,
  additionalFilters?: {
    cursor?: string
    isImportant?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): Promise<VersionWithRank[] | null> {
  try {
    // CORRECCIÓN: Validar que searchTerm no esté vacío antes de construir la query
    // plainto_tsquery puede fallar o retornar resultados inesperados con strings vacíos
    if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim().length === 0) {
      logger.warn(
        { noteId, searchTerm },
        'performPostgresFullTextSearch recibió searchTerm vacío o inválido'
      )
      return null
    }
    
    const { whereConditions, params, paramIndex } = buildPostgresWhereConditions(noteId, additionalFilters)
    
    // CORRECCIÓN: Validar que whereConditions sea un array válido antes de usar join
    if (!Array.isArray(whereConditions)) {
      logger.warn(
        { noteId, whereConditions },
        'buildPostgresWhereConditions retornó whereConditions inválido, usando array vacío'
      )
      return null
    }
    
    // CORRECCIÓN: Validar que whereConditions sea un array válido antes de usar join()
    const safeWhereConditions = Array.isArray(whereConditions) ? whereConditions : []
    const whereClause: string = (() => {
      try {
        const joined = safeWhereConditions.length > 0 ? safeWhereConditions.join(' AND ') : '1=1'
        // CORRECCIÓN: Validar que join() retorne un string válido
        if (typeof joined === 'string' && joined.length > 0) {
          return joined
        } else {
          logger.warn(
            { whereConditions, safeWhereConditions, joined },
            'performPostgresFullTextSearch: join() resultó en string inválido, usando 1=1'
          )
          return '1=1'
        }
      } catch (error) {
        logger.warn(
          { error, whereConditions, safeWhereConditions },
          'performPostgresFullTextSearch: Error al ejecutar join(), usando 1=1'
        )
        return '1=1'
      }
    })()
    const searchVector = buildSearchVector()
    
    // CORRECCIÓN: searchTerm se usa dos veces en la query (ts_rank y @@),
    // pero PostgreSQL permite reutilizar el mismo parámetro, así que solo
    // lo agregamos una vez al array. Los índices deben ser consistentes.
    const searchParamIndex = paramIndex
    const limitParamIndex = paramIndex + 1
    const offsetParamIndex = paramIndex + 2
    
    const query = `
      SELECT 
        v.*,
        ts_rank(
          ${searchVector},
          plainto_tsquery('spanish', $${searchParamIndex})
        ) as rank
      FROM "StudyNoteVersion" v
      WHERE ${whereClause}
        AND (
          ${searchVector}
          @@ plainto_tsquery('spanish', $${searchParamIndex})
        )
      ORDER BY rank DESC, v."createdAt" DESC
      LIMIT $${limitParamIndex}
      OFFSET $${offsetParamIndex}
    `
    
    // Agregar parámetros en orden: searchTerm (reutilizado en dos lugares de la query),
    // queryLimit y queryOffset
    // CORRECCIÓN: Validar que params sea un array válido antes de usar push()
    // No podemos reasignar params porque viene de desestructuración, así que creamos una nueva variable
    let finalParams: unknown[]
    if (Array.isArray(params)) {
      try {
        finalParams = [...params, searchTerm, queryLimit, queryOffset]
      } catch (error) {
        logger.warn(
          { error, params, searchTerm, queryLimit, queryOffset },
          'performPostgresFullTextSearch: Error al crear array de params, usando array vacío'
        )
        finalParams = []
      }
    } else {
      logger.warn(
        { params, searchTerm, queryLimit, queryOffset },
        'performPostgresFullTextSearch: params no es un array válido, usando array vacío'
      )
      finalParams = []
    }
    
    // NOTA: Usamos $queryRawUnsafe porque la query se construye dinámicamente
    // con filtros opcionales. Todos los valores de usuario se pasan como parámetros
    // para prevenir inyección SQL.
    // CORRECCIÓN: Validar que finalParams sea un array válido antes de usar spread operator
    let versions: VersionWithRank[]
    try {
      if (Array.isArray(finalParams) && finalParams.length > 0) {
        // Validar que todos los elementos de finalParams sean válidos antes de usar spread
        const validParams = finalParams.filter(p => p !== null && p !== undefined)
        if (Array.isArray(validParams) && validParams.length > 0) {
          versions = await prisma.$queryRawUnsafe<VersionWithRank[]>(query, ...validParams)
        } else {
          logger.warn(
            { noteId, searchTerm, finalParams, validParams },
            'performPostgresFullTextSearch: finalParams no tiene elementos válidos después de filtrar, usando array vacío'
          )
          versions = []
        }
      } else {
        logger.warn(
          { noteId, searchTerm, finalParams },
          'performPostgresFullTextSearch: finalParams no es un array válido o está vacío, usando array vacío'
        )
        versions = []
      }
    } catch (error) {
      logger.error(
        { error, noteId, searchTerm, finalParams, query },
        'performPostgresFullTextSearch: Error al ejecutar $queryRawUnsafe con spread operator, retornando null'
      )
      return null
    }
    
    // CORRECCIÓN: Validar que versions sea un array válido antes de usar map
    if (!Array.isArray(versions)) {
      logger.warn(
        { noteId, searchTerm, versions },
        'performPostgresFullTextSearch recibió resultado inválido de $queryRawUnsafe, retornando null'
      )
      return null
    }
    
    // CORRECCIÓN: Validar que rank sea un número finito antes de usarlo
    return versions.map(v => {
      // CORRECCIÓN: Validar que v.rank exista antes de convertir a Number
      if (v.rank == null) {
        logger.warn(
          { versionId: v.id, rank: v.rank },
          'performPostgresFullTextSearch: v.rank es null/undefined, usando 0'
        )
        return { ...v, rank: 0 }
      }
      
      // CORRECCIÓN: Validar que v.rank exista y sea válido antes de usar Number()
      let rankValue: number
      try {
        // Validar que v.rank no sea null/undefined antes de convertir
        if (v.rank == null) {
          rankValue = NaN // Forzar NaN para que pase la validación siguiente
        } else {
          rankValue = Number(v.rank)
        }
        // Validar que Number() retorne un número finito
        if (!Number.isFinite(rankValue) || rankValue < 0) {
          logger.warn(
            { versionId: v.id, originalRank: v.rank, rankValue },
            'performPostgresFullTextSearch: Number() retornó valor inválido, usando 0'
          )
          rankValue = 0
        }
      } catch (error) {
        logger.warn(
          { error, versionId: v.id, rank: v.rank },
          'performPostgresFullTextSearch: Error al ejecutar Number() en rank, usando 0'
        )
        rankValue = 0
      }
      
      // Validar que rankValue sea un número finito
      const safeRank = Number.isFinite(rankValue) && rankValue >= 0 ? rankValue : 0
      
      if (rankValue !== safeRank) {
        logger.warn(
          { versionId: v.id, originalRank: v.rank, rankValue, safeRank },
          'performPostgresFullTextSearch: rankValue inválido, usando 0'
        )
      }
      return {
        ...v,
        rank: safeRank,
      }
    })
  } catch (error) {
    logger.error({ error }, 'Error en búsqueda full-text de PostgreSQL, usando fallback')
    return null
  }
}

/**
 * Construye cláusula WHERE para búsqueda SQLite
 */
/**
 * Construye cláusula WHERE para SQLite
 * CORRECCIÓN: Valida que searchTerm no esté vacío antes de usar en contains
 */
export function buildSqliteWhereClause(
  noteId: string,
  searchTerm: string,
  additionalFilters?: {
    cursor?: string
    isImportant?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): Prisma.StudyNoteVersionWhereInput {
  // CORRECCIÓN: Validar que searchTerm no esté vacío antes de usar en contains
  const safeSearchTerm = searchTerm && typeof searchTerm === 'string' && searchTerm.trim().length > 0
    ? searchTerm.trim()
    : ''
  
  // SQLite no soporta mode: 'insensitive' directamente, así que usamos contains sin mode
  // La búsqueda case-insensitive se hará en memoria después
  const baseWhere: Prisma.StudyNoteVersionWhereInput = {
    noteId,
    ...(safeSearchTerm ? {
      OR: [
        { title: { contains: safeSearchTerm } },
        { content: { contains: safeSearchTerm } },
        // name y tags se filtrarán en memoria ya que pueden ser null y SQLite no soporta mode
      ],
    } : {}),
  }
  
  // Aplicar filtros comunes (fecha e importancia)
  applyCommonFilters(baseWhere, additionalFilters)
  
  return baseWhere
}

/**
 * Calcula relevancia de versión para ordenamiento
 * CORRECCIÓN: Valida que version no sea null/undefined antes de acceder a propiedades
 */
export function calculateVersionRelevance(
  version: StudyNoteVersion | { title: string; name?: string | null; tags?: string | null },
  searchLower: string
): number {
  // Validar que version no sea null/undefined
  if (!version || typeof version !== 'object') {
    logger.warn(
      { version, searchLower },
      'calculateVersionRelevance recibió version inválido, retornando relevancia máxima'
    )
    return 4
  }
  
  // Validar que title no sea null/undefined antes de usar toLowerCase
  if (fieldContainsSearch(version.title, searchLower)) return 1
  // Verificar si version tiene name (puede ser StudyNoteVersion o objeto con name opcional)
  const versionWithName = 'name' in version ? version : (version as StudyNoteVersion)
  if (fieldContainsSearch(versionWithName.name, searchLower)) return 2
  if (fieldContainsSearch(versionWithName.tags, searchLower)) return 3
  return 4
}

/**
 * Ordena versiones por relevancia
 * CORRECCIÓN: Valida que versions sea un array válido antes de usar toSorted
 */
export function sortVersionsByRelevance(
  versions: StudyNoteVersion[],
  searchLower: string,
  limit: number
): StudyNoteVersion[] {
  // Validar que versions sea un array válido
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions, searchLower, limit },
      'sortVersionsByRelevance recibió versions inválido, retornando array vacío'
    )
    return []
  }
  
  // Validar que limit sea un número válido
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : versions.length
  
  // CORRECCIÓN: Validar que searchLower sea un string válido antes de usar
  const safeSearchLower = typeof searchLower === 'string' && searchLower.length > 0
    ? searchLower
    : ''
  
  // CORRECCIÓN: Validar que versions sea un array válido antes de usar toSorted()
  let sorted: StudyNoteVersion[]
  try {
    sorted = versions.toSorted((a: StudyNoteVersion, b: StudyNoteVersion) => {
      // CORRECCIÓN: Validar que a y b sean objetos válidos antes de calcular relevancia
      if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
        return 0
      }
      
      const aRelevance = calculateVersionRelevance(a, safeSearchLower)
      const bRelevance = calculateVersionRelevance(b, safeSearchLower)
      // CORRECCIÓN: Validar que las relevancias sean números finitos antes de restar
      const safeARelevance = Number.isFinite(aRelevance) ? aRelevance : 4
      const safeBRelevance = Number.isFinite(bRelevance) ? bRelevance : 4
      const diff = safeARelevance - safeBRelevance
      return Number.isFinite(diff) ? diff : 0
    })
    
    // Validar que toSorted() retorne un array válido
    if (!Array.isArray(sorted)) {
      logger.warn(
        { versions, sorted },
        'sortVersionsByRelevance: toSorted() retornó resultado inválido, usando versions original'
      )
      sorted = versions
    }
  } catch (error) {
    logger.warn(
      { error, versions },
      'sortVersionsByRelevance: Error al ejecutar toSorted(), usando versions original'
    )
    sorted = versions
  }
  
  // CORRECCIÓN: Validar que sorted sea un array válido antes de usar limitArray
  if (!Array.isArray(sorted)) {
    logger.warn(
      { versions, searchLower, limit, sorted },
      'sortVersionsByRelevance: toSorted() retornó resultado inválido, retornando array vacío'
    )
    return []
  }
  
  return limitArray(sorted, safeLimit)
}

/**
 * Realiza búsqueda full-text en SQLite
 */
export async function performSqliteFullTextSearch(
  noteId: string,
  searchTerm: string,
  queryLimit: number,
  queryOffset: number,
  additionalFilters?: {
    cursor?: string
    isImportant?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): Promise<StudyNoteVersion[] | null> {
  try {
    // CORRECCIÓN: Validar que queryLimit y queryOffset sean números válidos antes de usar
    const safeQueryLimit = Number.isFinite(queryLimit) && queryLimit > 0 ? queryLimit : 10
    const safeQueryOffset = Number.isFinite(queryOffset) && queryOffset >= 0 ? queryOffset : 0
    
    if (queryLimit !== safeQueryLimit || queryOffset !== safeQueryOffset) {
      logger.warn(
        { noteId, queryLimit, queryOffset, safeQueryLimit, safeQueryOffset },
        'performSqliteFullTextSearch recibió parámetros inválidos, usando valores por defecto'
      )
    }
    
    const searchLower = normalizeSearchTerm(searchTerm)
    const baseWhere = buildSqliteWhereClause(noteId, searchTerm, additionalFilters)
    
    const versions = await prisma.studyNoteVersion.findMany({
      where: baseWhere,
      orderBy: { createdAt: 'desc' },
      take: safeQueryLimit + VERSION_CONSTANTS.SQLITE_SEARCH_BUFFER,
      skip: safeQueryOffset,
    })
    
    // CORRECCIÓN: Validar que versions sea un array válido antes de procesar
    if (!Array.isArray(versions)) {
      logger.warn(
        { noteId, searchTerm, versions },
        'performSqliteFullTextSearch recibió resultado inválido de findMany, retornando null'
      )
      return null
    }
    
    return sortVersionsByRelevance(versions, searchLower, safeQueryLimit)
  } catch (error) {
    logger.error({ error }, 'Error en búsqueda optimizada de SQLite, usando fallback')
    return null
  }
}

/**
 * Realiza búsqueda full-text optimizada según el tipo de base de datos
 * Para PostgreSQL usa tsvector/tsquery, para SQLite usa LIKE optimizado con ordenamiento por relevancia
 */
export async function performFullTextSearch(
  noteId: string,
  searchTerm: string,
  queryLimit: number,
  queryOffset: number,
  additionalFilters?: {
    cursor?: string
    isImportant?: boolean
    hasName?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): Promise<StudyNoteVersion[] | null> {
  // CORRECCIÓN: Validar que process.env.DATABASE_URL sea un string válido antes de usar includes()
  const databaseUrl = process.env.DATABASE_URL
  const isPostgres = databaseUrl && typeof databaseUrl === 'string' && databaseUrl.length > 0
    ? databaseUrl.includes('postgres')
    : false
  
  if (isPostgres) {
    return await performPostgresFullTextSearch(noteId, searchTerm, queryLimit, queryOffset, additionalFilters)
  } else {
    return await performSqliteFullTextSearch(noteId, searchTerm, queryLimit, queryOffset, additionalFilters)
  }
}

/**
 * Filtra versiones por término de búsqueda
 */
/**
 * Filtra versiones por término de búsqueda
 * CORRECCIÓN: Valida que versions sea un array válido antes de usar filter
 */
export function filterVersionsBySearch(versions: StudyNoteVersion[], searchTerm: string): StudyNoteVersion[] {
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions, searchTerm },
      'filterVersionsBySearch recibió versions inválido, retornando array vacío'
    )
    return []
  }
  
  const searchLower = normalizeSearchTerm(searchTerm)
  // CORRECCIÓN: Validar que versions sea un array válido antes de usar filter()
  try {
    const filtered = versions.filter(v => {
      // Validar que v sea un objeto válido antes de acceder a propiedades
      if (!v || typeof v !== 'object') {
        return false
      }
      return (
        fieldContainsSearch(v.title, searchLower) ||
        fieldContainsSearch(v.content, searchLower) ||
        fieldContainsSearch(v.name, searchLower) ||
        fieldContainsSearch(v.tags, searchLower)
      )
    })
    
    // Validar que filtered sea un array válido
    if (!Array.isArray(filtered)) {
      logger.warn(
        { versions, searchTerm, filtered },
        'filterVersionsBySearch: filter() retornó resultado inválido, retornando array vacío'
      )
      return []
    }
    
    return filtered
  } catch (error) {
    logger.warn(
      { error, versions, searchTerm },
      'filterVersionsBySearch: Error al ejecutar filter(), retornando array vacío'
    )
    return []
  }
}

/**
 * Filtra versiones por si tienen nombre personalizado
 */
/**
 * Filtra versiones por presencia de nombre
 * CORRECCIÓN: Valida que versions sea un array válido antes de usar filter
 */
export function filterVersionsByName(versions: StudyNoteVersion[], hasName: boolean): StudyNoteVersion[] {
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions, hasName },
      'filterVersionsByName recibió versions inválido, retornando array vacío'
    )
    return []
  }
  
  try {
    const filtered = versions.filter(v => {
      // Validar que v sea un objeto válido antes de acceder a name
      if (!v || typeof v !== 'object') {
        return false
      }
      return hasNonEmptyName(v.name) === hasName
    })
    
    // Validar que filtered sea un array válido
    if (!Array.isArray(filtered)) {
      logger.warn(
        { versions, hasName, filtered },
        'filterVersionsByName: filter() retornó resultado inválido, retornando array vacío'
      )
      return []
    }
    
    return filtered
  } catch (error) {
    logger.warn(
      { error, versions, hasName },
      'filterVersionsByName: Error al ejecutar filter(), retornando array vacío'
    )
    return []
  }
}

/**
 * Aplica filtro hasName a resultados de búsqueda full-text
 */
export function applyHasNameFilter(versions: StudyNoteVersion[], hasName: boolean, limit: number): StudyNoteVersion[] {
  const filtered = filterVersionsByName(versions, hasName)
  return limitArray(filtered, limit)
}

/**
 * Calcula paginación para resultados filtrados
 * CORRECCIÓN: Valida que versions no sea null/undefined antes de acceder a length
 */
export function calculatePagination(
  versions: StudyNoteVersion[],
  limit: number,
  totalFetched: number
): { hasMore: boolean; nextCursor?: string } {
  // Validar que versions sea un array válido
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions, limit, totalFetched },
      'calculatePagination recibió versions inválido, retornando sin paginación'
    )
    return { hasMore: false }
  }
  
  // CORRECCIÓN: Validar que limit y totalFetched sean números válidos antes de comparar
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 0
  const safeTotalFetched = Number.isFinite(totalFetched) && totalFetched >= 0 ? totalFetched : 0
  const safeVersionsLength = Number.isFinite(versions.length) ? versions.length : 0
  
  const hasMore = safeVersionsLength === safeLimit && safeTotalFetched > safeLimit
  const lastVersion = hasMore ? getLastElement(versions) : null
  const nextCursor = getValidDateCursor(lastVersion)
  return { hasMore, nextCursor }
}

/**
 * Obtiene versiones con filtrado en memoria (para SQLite)
 */
export async function fetchVersionsWithMemoryFilter(
  noteId: string,
  queryLimit: number,
  queryOffset: number,
  filters: {
    cursor?: string
    search?: string
    isImportant?: boolean
    hasName?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): Promise<{ versions: StudyNoteVersion[]; hasMore: boolean; nextCursor?: string }> {
  try {
    // Construir filtros de fecha usando función helper
    const dateFilters = buildDateFilters(filters.cursor, filters.dateFrom, filters.dateTo)
    
    // Construir whereClause con tipo específico en lugar de any
    const whereClause: Prisma.StudyNoteVersionWhereInput & { isImportant?: boolean } = { noteId }
    if (isNotEmptyObject(dateFilters)) {
      whereClause.createdAt = dateFilters as Prisma.DateTimeFilter
    }
    if (filters.isImportant !== undefined) {
      whereClause.isImportant = filters.isImportant
    }
    
    const versions = await prisma.studyNoteVersion.findMany({
      where: whereClause as Prisma.StudyNoteVersionWhereInput,
      orderBy: { createdAt: 'desc' },
      take: queryLimit + VERSION_CONSTANTS.MEMORY_FILTER_BUFFER,
      skip: filters.cursor ? 0 : queryOffset,
    })
    
    let filteredVersions = versions
    
    if (filters.search) {
      filteredVersions = filterVersionsBySearch(filteredVersions, filters.search)
    }
    
    if (filters.hasName !== undefined) {
      filteredVersions = filterVersionsByName(filteredVersions, filters.hasName)
    }
    
    filteredVersions = limitArray(filteredVersions, queryLimit)
    
    // CORRECCIÓN: Validar que versions.length sea un número válido antes de usar en calculatePagination
    const safeVersionsLength = Array.isArray(versions) && Number.isFinite(versions.length)
      ? versions.length
      : 0
    
    const { hasMore, nextCursor } = calculatePagination(filteredVersions, queryLimit, safeVersionsLength)
    
    return { versions: filteredVersions, hasMore, nextCursor }
  } catch (error) {
    logger.error(
      { error, noteId, queryLimit, queryOffset, filters },
      'Error al obtener versiones con filtrado en memoria'
    )
    // Retornar resultado vacío en lugar de fallar completamente
    return { versions: [], hasMore: false }
  }
}

/**
 * Obtiene versiones con búsqueda full-text
 */
export async function fetchVersionsWithFullTextSearch(
  noteId: string,
  queryLimit: number,
  queryOffset: number,
  filters: {
    cursor?: string
    search: string
    isImportant?: boolean
    hasName?: boolean
    dateFrom?: Date
    dateTo?: Date
  }
): Promise<{ versions: StudyNoteVersion[]; hasMore: boolean; nextCursor?: string } | null> {
  const fullTextResults = await performFullTextSearch(
    noteId,
    filters.search,
    queryLimit,
    queryOffset,
    {
      cursor: filters.cursor,
      isImportant: filters.isImportant,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
    }
  )
  
  if (fullTextResults === null) {
    return null
  }
  
  const filteredResults = filters.hasName === undefined
    ? fullTextResults
    : applyHasNameFilter(fullTextResults, filters.hasName, queryLimit)
  
  // CORRECCIÓN: Validar que filteredResults.length sea un número válido antes de usar en calculatePagination
  const safeFilteredResultsLength = Array.isArray(filteredResults) && Number.isFinite(filteredResults.length)
    ? filteredResults.length
    : 0
  
  const { hasMore, nextCursor } = calculatePagination(filteredResults, queryLimit, safeFilteredResultsLength)
  
  return { versions: filteredResults, hasMore, nextCursor }
}

/**
 * Obtiene versiones históricas con paginación y filtros
 */
export async function fetchVersions(
  noteId: string,
  queryLimit: number,
  queryOffset: number,
  filters?: VersionFilters
): Promise<{ versions: StudyNoteVersion[]; hasMore: boolean; nextCursor?: string }> {
  try {
    // Si hay búsqueda, intentar usar full-text search optimizado
    if (filters?.search && isNonEmptyString(filters.search)) {
      const fullTextResult = await fetchVersionsWithFullTextSearch(
        noteId,
        queryLimit,
        queryOffset,
        filters as { cursor?: string; search: string; isImportant?: boolean; hasName?: boolean; dateFrom?: Date; dateTo?: Date }
      )
      if (fullTextResult) {
        return fullTextResult
      }
    }
    
    // Para SQLite, hacer filtrado en memoria para búsqueda y hasName
    // CORRECCIÓN: Validar que process.env.DATABASE_URL sea un string válido antes de usar includes()
    const databaseUrl = process.env.DATABASE_URL
    const isPostgres = databaseUrl && typeof databaseUrl === 'string' && databaseUrl.length > 0
      ? databaseUrl.includes('postgres')
      : false
    const needsMemoryFilter = (filters?.search || filters?.hasName !== undefined) && !isPostgres
    
    if (needsMemoryFilter && filters) {
      return await fetchVersionsWithMemoryFilter(noteId, queryLimit, queryOffset, filters)
    }
    
    // Para PostgreSQL o sin búsqueda, usar Prisma normal
    const whereClause = buildVersionsWhereClause(noteId, filters)
    const versions = await prisma.studyNoteVersion.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      take: queryLimit,
      skip: filters?.cursor ? 0 : queryOffset,
    })

    const { hasMore, nextCursor } = calculatePagination(versions, queryLimit, versions.length)
    return { versions, hasMore, nextCursor }
  } catch (error) {
    logger.error(
      { error, noteId, queryLimit, queryOffset, filters },
      'Error al obtener versiones'
    )
    // Retornar resultado vacío en lugar de fallar completamente
    return { versions: [], hasMore: false }
  }
}

