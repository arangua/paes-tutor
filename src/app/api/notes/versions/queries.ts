import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { logger } from '@/lib/logger'
import { LIMIT_CONSTANTS } from '@/lib/constants'
import { TRANSACTION_TIMEOUTS, CALCULATION_CONFIG } from './config'
import { trackVersionMetric } from './metrics-tracker'
import {
  validateBulkVersionsForDeletion,
  validateSingleVersionForDeletion,
  runInBackground,
  invalidateVersionCacheSafely,
  calculateDuration,
} from './helpers'
import { triggerDeleteWebhooks } from './webhooks'
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from './error-messages'
import { safeRound, isValidDate, safeDivide, ensureFiniteNumber } from './validation-utils'
import type { Result } from './types'
import type {
  VersionStatistics,
  StudyNoteVersion,
  VersionUpdateParams,
} from '@/lib/types/versions'

/**
 * Maneja errores específicos de Prisma de forma consistente
 */
function handlePrismaNotFoundError(
  error: unknown,
  context: { versionId?: string; noteId?: string; operation: string }
): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2025') {
      // Record not found
      logger.warn(
        { error, ...context },
        `${context.operation}: registro no encontrado`
      )
      return true
    }
  }
  return false
}

/**
 * Crea respuesta de error para versión no encontrada
 */
function createVersionNotFoundError(): NextResponse {
  return NextResponse.json(
    { error: ERROR_MESSAGES.VERSION_NOT_FOUND },
    { status: 404 }
  )
}

/**
 * Crea respuesta de error interno de forma consistente
 */
async function createInternalErrorResponse(): Promise<NextResponse> {
  const { ERROR_MESSAGES } = await import('./error-messages')
  return NextResponse.json(
    { error: ERROR_MESSAGES.INTERNAL_ERROR },
    { status: 500 }
  )
}

/**
 * Valida que el número de registros eliminados coincida con el esperado
 */
/**
 * Valida que el número de versiones eliminadas coincida con el esperado
 * CORRECCIÓN: Lanza error si hay discrepancia para prevenir problemas de integridad de datos
 */
function validateDeleteCount(
  deleted: number,
  expected: number,
  context: { noteId: string; batch?: string[]; batchIndex?: number }
): void {
  if (deleted !== expected) {
    const errorMessage = expected === 1 
      ? 'No se eliminaron todas las versiones esperadas durante la limpieza'
      : 'No se eliminaron todas las versiones esperadas en batch'
    
    logger.error(
      { expected, deleted, ...context },
      errorMessage
    )
    
    // CORRECCIÓN: Lanzar error para que la transacción falle y se detecte el problema
    throw new Error(`${errorMessage}. Esperadas: ${expected}, Eliminadas: ${deleted}`)
  }
}

/**
 * Asegura que un valor sea un número válido, retornando 0 si no lo es
 * CORRECCIÓN: Valida también que el número sea finito (no NaN ni Infinity)
 */
function ensureNumber(value: unknown): number {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  return 0
}

/**
 * Genera un string aleatorio de longitud específica
 * 
 * DECISIÓN DE DISEÑO: Usa ensurePositiveNumber y safeStringOperation del sistema
 * de validación centralizado para mantener consistencia.
 */
function generateRandomString(length: number): string {
  const safeLength = ensurePositiveNumber(length, 8)
  
  let random = ''
  while (random.length < safeLength) {
    try {
      const randomValue = Math.random()
      const safeRandomValue = ensureFiniteNumber(randomValue, 0)
      
      const randomString = safeRandomValue.toString(36)
      const safeRandomString = ensureNonEmptyString(randomString, '0')
      
      if (safeRandomString.length >= 2) {
        random += safeStringOperation(
          safeRandomString,
          s => s.substring(2),
          safeRandomString
        )
      } else {
        random += safeRandomString
      }
    } catch {
      random += '0'
    }
  }
  
  const safeRandom = ensureNonEmptyString(random, 'fallback')
  const finalLength = Math.min(safeLength, safeRandom.length)
  return safeStringOperation(
    safeRandom,
    s => s.substring(0, finalLength),
    'fallback'
  )
}

/**
 * Crea estadísticas por defecto para versiones
 */
function createDefaultVersionStatistics(): VersionStatistics {
  return {
    totalVersions: 0,
    averageDaysBetweenVersions: null,
    importantVersions: 0,
    namedVersions: 0,
    totalRestores: 0,
    daysSinceLastUpdate: 0,
    lastUpdated: '',
  }
}

/**
 * Verifica si un array está vacío
 */
/**
 * Verifica si un array está vacío
 * CORRECCIÓN: Valida que array sea un array válido antes de acceder a length
 */
function isEmptyArray<T>(array: T[] | null | undefined): boolean {
  // Validar que array sea un array válido
  if (!Array.isArray(array)) {
    return true
  }
  // Validar que length sea un número válido
  return !Number.isFinite(array.length) || array.length === 0
}

/**
 * Verifica si un array tiene múltiples elementos
 */
/**
 * Verifica si un array tiene múltiples elementos
 * CORRECCIÓN: Valida que array sea un array válido antes de acceder a length
 */
function hasMultipleItems<T>(array: T[] | null | undefined): boolean {
  // Validar que array sea un array válido
  if (!Array.isArray(array)) {
    return false
  }
  // Validar que length sea un número válido
  return Number.isFinite(array.length) && array.length > 1
}

/**
 * Verifica si un objeto está vacío
 */
function isEmptyObject(obj: Record<string, unknown> | null | undefined): boolean {
  // CORRECCIÓN: Validar que obj sea un objeto válido antes de usar Object.keys()
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

// isValidDate ahora se importa de validation-utils

/**
 * Calcula la diferencia en días entre dos fechas
 * CORRECCIÓN: Valida que MS_PER_DAY sea un número válido y no cero antes de dividir
 */
function calculateDaysDifference(date1: Date, date2: Date): number | null {
  if (!isValidDate(date1) || !isValidDate(date2)) {
    return null
  }
  
  // Validar que MS_PER_DAY sea un número válido y no cero
  const msPerDay = CALCULATION_CONFIG.MS_PER_DAY
  if (!Number.isFinite(msPerDay) || msPerDay <= 0) {
    logger.warn(
      { msPerDay, date1, date2 },
      'calculateDaysDifference: MS_PER_DAY inválido, no se puede calcular diferencia'
    )
    return null
  }
  
  // ✅ Enterprise: Usar safeDivide para evitar división por cero
  const diffMs = date1.getTime() - date2.getTime()
  if (!Number.isFinite(diffMs)) {
    return null
  }
  
  const diff = safeDivide(diffMs, msPerDay, 0)
  
  if (!Number.isFinite(diff) || diff < 0) {
    return null
  }
  
  return diff
}

/**
 * Limita un número entre un mínimo y máximo
 */
/**
 * Limita un número entre min y max
 * CORRECCIÓN: Valida que todos los parámetros sean números finitos antes de calcular
 */
function clampNumber(value: number, min: number, max: number): number {
  // Validar que todos los parámetros sean números finitos
  if (!Number.isFinite(value) || !Number.isFinite(min) || !Number.isFinite(max)) {
    logger.warn(
      { value, min, max },
      'clampNumber recibió parámetros inválidos, retornando valor por defecto'
    )
    return Number.isFinite(value) ? value : 0
  }
  
  // CORRECCIÓN: Validar que min <= max antes de usar Math.min/Math.max
  if (min > max) {
    logger.warn(
      { value, min, max },
      'clampNumber recibió min > max, intercambiando valores'
    )
    const temp = min
    min = max
    max = temp
  }
  
  const clampedMin = Math.max(min, value)
  // CORRECCIÓN: Validar que Math.max() retorne un número finito
  if (!Number.isFinite(clampedMin)) {
    logger.warn(
      { value, min, max, clampedMin },
      'clampNumber: Math.max() retornó valor no finito, retornando value'
    )
    return Number.isFinite(value) ? value : 0
  }
  
  const clamped = Math.min(clampedMin, max)
  // CORRECCIÓN: Validar que Math.min() retorne un número finito
  return Number.isFinite(clamped) ? clamped : (Number.isFinite(value) ? value : 0)
}

/**
 * Normaliza un offset asegurándose de que esté dentro de los límites válidos
 * CORRECCIÓN: Valida que maxOffset sea un número finito antes de comparar
 */
function normalizeOffset(offset: number | undefined, maxOffset: number): number {
  // Validar que maxOffset sea un número finito
  if (!Number.isFinite(maxOffset) || maxOffset < 0) {
    logger.warn(
      { offset, maxOffset },
      'normalizeOffset recibió maxOffset inválido, usando valor por defecto de 0'
    )
    maxOffset = 0
  }
  
  const normalized = offset || 0
  // Validar que normalized sea un número finito
  if (!Number.isFinite(normalized)) {
    return 0
  }
  
  if (normalized < 0) {
    return 0
  }
  if (normalized > maxOffset) {
    return maxOffset
  }
  return normalized
}

/**
 * Redondea un número a un número específico de decimales
 * @deprecated Usar safeRound de validation-utils en su lugar
 */
function roundToDecimals(value: number, decimals: number): number {
  return safeRound(value, decimals)
}

/**
 * Suma los elementos de un array numérico
 * CORRECCIÓN: Valida que todos los elementos sean números finitos antes de sumar
 */
function sumArray(numbers: number[]): number {
  // CORRECCIÓN: Validar que numbers sea un array válido antes de usar reduce()
  if (!Array.isArray(numbers)) {
    logger.warn(
      { numbers },
      'sumArray recibió numbers inválido (no es array), retornando 0'
    )
    return 0
  }
  
  try {
    return numbers.reduce((a, b) => {
      // Validar que ambos valores sean números finitos
      const safeA = Number.isFinite(a) ? a : 0
      const safeB = Number.isFinite(b) ? b : 0
      const sum = safeA + safeB
      // Validar que el resultado sea finito
      return Number.isFinite(sum) ? sum : 0
    }, 0)
  } catch (error) {
    logger.warn(
      { error, numbers },
      'sumArray: Error al ejecutar reduce(), retornando 0'
    )
    return 0
  }
}

/**
 * Extrae IDs válidos de un array de objetos con id
 * CORRECCIÓN: Valida que items no sea null/undefined antes de usar map
 */
function extractValidIds<T extends { id?: string | null }>(items: T[]): string[] {
  // CORRECCIÓN: Validar que items sea un array válido antes de usar map() y filter()
  if (!Array.isArray(items)) {
    logger.warn(
      { items },
      'extractValidIds recibió items inválido, retornando array vacío'
    )
    return []
  }
  
  try {
    const mapped = items.map((item) => {
      // Validar que item sea un objeto válido con id
      if (item && typeof item === 'object' && 'id' in item) {
        return item.id
      }
      return null
    })
    
    // Validar que mapped sea un array válido antes de usar filter()
    if (!Array.isArray(mapped)) {
      logger.warn(
        { items, mapped },
        'extractValidIds: map() retornó resultado inválido, retornando array vacío'
      )
      return []
    }
    
    return mapped.filter((id): id is string => {
      // Validar que id sea un string válido
      return typeof id === 'string' && id.length > 0
    })
  } catch (error) {
    logger.warn(
      { error, items },
      'extractValidIds: Error al ejecutar map() o filter(), retornando array vacío'
    )
    return []
  }
}

/**
 * Valida y obtiene la nota del estudiante (función genérica reutilizable)
 */
export async function validateNoteAccess<T extends Prisma.StudyNoteSelect>(
  noteId: string,
  studentId: string,
  select?: T
): Promise<
  | { success: false; error: NextResponse }
  | { success: true; note: Prisma.StudyNoteGetPayload<{ select: T }> }
> {
  try {
    const note = await prisma.studyNote.findFirst({
      where: {
        id: noteId,
        studentId,
      },
      ...(select ? { select } : {}),
    })
    
    if (!note) {
      const { ERROR_MESSAGES } = await import('./error-messages')
      return {
        success: false,
        error: NextResponse.json({ error: ERROR_MESSAGES.NOTE_NOT_FOUND }, { status: 404 }),
      }
    }
    
    return { success: true, note: note as Prisma.StudyNoteGetPayload<{ select: T }> }
  } catch (error) {
    logger.error(
      { error, noteId, studentId },
      'Error al validar acceso a nota'
    )
    return {
      success: false,
      error: await createInternalErrorResponse(),
    }
  }
}

/**
 * Valida y obtiene la nota del estudiante
 * Usa Result<T> para consistencia con el resto del código
 */
export async function getNoteForStudent(noteId: string, studentId: string): Promise<
  Result<Prisma.StudyNoteGetPayload<Record<string, never>>>
> {
  return validateNoteAccess(noteId, studentId)
}

/**
 * Calcula el límite de versiones a retornar
 * CORRECCIÓN: Valida que MAX_SEARCH_RESULTS sea un número válido antes de dividir
 */
export function calculateQueryLimit(limit?: number, offset?: number): { queryLimit: number; queryOffset: number } {
  // Validar que MAX_SEARCH_RESULTS sea un número válido antes de dividir
  const maxSearchResults = LIMIT_CONSTANTS.MAX_SEARCH_RESULTS
  if (!Number.isFinite(maxSearchResults) || maxSearchResults <= 0) {
    logger.warn(
      { maxSearchResults },
      'calculateQueryLimit: MAX_SEARCH_RESULTS inválido, usando valor por defecto'
    )
    const queryLimit = limit ? clampNumber(limit, 1, 50) : LIMIT_CONSTANTS.VERSION_DEFAULT_LIMIT
    const queryOffset = normalizeOffset(offset, 1000) // Valor por defecto seguro
    return { queryLimit, queryOffset }
  }
  
  const maxLimit = maxSearchResults / 2 // Máximo de resultados permitidos
  const minLimit = 1
  const maxOffset = LIMIT_CONSTANTS.MAX_OFFSET // Límite razonable para offset
  
  // Validar y normalizar limit
  const queryLimit = limit
    ? clampNumber(limit, minLimit, maxLimit)
    : LIMIT_CONSTANTS.VERSION_DEFAULT_LIMIT
  
  // Validar y normalizar offset
  const queryOffset = normalizeOffset(offset, maxOffset)
  
  return { queryLimit, queryOffset }
}

/**
 * Calcula el promedio de días entre versiones recientes
 * CORRECCIÓN: Valida que recentVersions sea un array válido antes de iterar
 */
function calculateAverageDaysBetweenVersions(
  recentVersions: Array<{ createdAt: Date }>
): number | null {
  // Validar que recentVersions sea un array válido
  if (!Array.isArray(recentVersions)) {
    logger.warn(
      { recentVersions },
      'calculateAverageDaysBetweenVersions recibió recentVersions inválido, retornando null'
    )
    return null
  }
  
  if (!hasMultipleItems(recentVersions)) {
    return null
  }

  const daysBetween: number[] = []
  for (let i = 0; i < recentVersions.length - 1; i++) {
    const v1 = recentVersions[i]
    const v2 = recentVersions[i + 1]
    
    // Validar que las versiones y fechas existan y calcular diferencia
    if (v1 && v2 && v1.createdAt && v2.createdAt) {
      const diff = calculateDaysDifference(v1.createdAt, v2.createdAt)
      if (diff !== null) {
        daysBetween.push(diff)
      }
    }
  }
  
  if (isEmptyArray(daysBetween)) {
    return null
  }
  
  // CORRECCIÓN: Validar explícitamente que daysBetween.length > 0 antes de dividir
  // Aunque isEmptyArray ya valida esto, es más robusto validar explícitamente
  if (daysBetween.length === 0) {
    return null
  }
  
  const sum = sumArray(daysBetween)
  if (!Number.isFinite(sum)) {
    return null
  }
  
  // CORRECCIÓN: Validar que daysBetween.length sea un número válido y mayor que 0 antes de dividir
  const safeLength = Number.isFinite(daysBetween.length) && daysBetween.length > 0
    ? daysBetween.length
    : 1
  
  // ✅ Enterprise: Usar safeDivide para evitar división por cero
  const average = safeDivide(sum, safeLength, 0)
  // CORRECCIÓN: Validar que average sea un número finito antes de usar roundToDecimals
  if (!Number.isFinite(average)) {
    logger.warn(
      { sum, safeLength, average },
      'calculateAverageDaysBetweenVersions: average no es finito, retornando null'
    )
    return null
  }
  
  return roundToDecimals(average, 1)
}

/**
 * Calcula estadísticas de versiones (optimizado con queries en paralelo)
 * Usa Prisma cuando es posible para mejor portabilidad y type safety
 */
export async function calculateVersionStatistics(noteId: string): Promise<VersionStatistics> {
  try {
    // Ejecutar todas las queries en paralelo para mejor rendimiento
    // OPTIMIZACIÓN: Usar Prisma count en lugar de $queryRaw cuando sea posible
    // CORRECCIÓN: Validar que Promise.all retorne un array válido con resultados válidos
    let results: [number, Array<{ createdAt: Date }>, number, number, number]
    try {
      results = await Promise.all([
        // Contar total de versiones
        prisma.studyNoteVersion.count({
          where: { noteId },
        }),
        // Obtener versiones recientes para calcular promedio de días
        prisma.studyNoteVersion.findMany({
          where: { noteId },
          orderBy: { createdAt: 'desc' },
          select: { createdAt: true },
          take: 10,
        }),
        // Contar versiones importantes - OPTIMIZADO: usar Prisma count
        prisma.studyNoteVersion.count({
          where: {
            noteId,
            isImportant: true,
          },
        }),
        // Contar versiones con nombre - OPTIMIZADO: usar Prisma count
        prisma.studyNoteVersion.count({
          where: {
            noteId,
            AND: [
              { name: { not: null } },
              { name: { not: '' } },
            ],
          },
        }),
        // Contar restauraciones
        prisma.versionRestoreHistory.count({
          where: { noteId },
        }),
      ])
      
      // Validar que results sea un array válido con 5 elementos
      if (!Array.isArray(results) || results.length !== 5) {
        throw new Error('Promise.all retornó resultado inválido')
      }
    } catch (error) {
      logger.error(
        { error, noteId },
        'Error en Promise.all de calculateVersionStatistics, usando valores por defecto'
      )
      return createDefaultVersionStatistics()
    }

    const [totalVersions, recentVersions, importantCount, namedCount, totalRestores] = results

    // CORRECCIÓN: Validar que recentVersions sea un array válido
    const safeRecentVersions = Array.isArray(recentVersions) ? recentVersions : []

    // Validar que los resultados sean números válidos
    const safeTotalVersions = ensureNumber(totalVersions)
    const safeImportantCount = ensureNumber(importantCount)
    const safeNamedCount = ensureNumber(namedCount)
    const safeTotalRestores = ensureNumber(totalRestores)

    // Calcular promedio de días entre versiones
    const averageDaysBetweenVersions = calculateAverageDaysBetweenVersions(safeRecentVersions)

    return {
      totalVersions: safeTotalVersions,
      averageDaysBetweenVersions,
      importantVersions: safeImportantCount,
      namedVersions: safeNamedCount,
      totalRestores: safeTotalRestores,
      daysSinceLastUpdate: 0,
      lastUpdated: '',
    }
  } catch (error) {
    // Si falla el cálculo de estadísticas, retornar valores por defecto
    logger.error(
      { error, noteId },
      'Error al calcular estadísticas de versiones, usando valores por defecto'
    )
    return createDefaultVersionStatistics()
  }
}

/**
 * Genera un ID único para el historial de restauración
 * Usa timestamp + string aleatorio + contador para garantizar unicidad en alta concurrencia
 * CORRECCIÓN: Valida que Date.now() y Math.random() retornen valores válidos
 */
function generateRestoreHistoryId(): string {
  const timestamp = Date.now()
  
  // Validar que timestamp sea un número finito
  const safeTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now()
  
  // Generar string aleatorio de exactamente 7 caracteres
  const random = generateRandomString(7)
  
  // Validar que random no esté vacío
  const safeRandom = random && random.length > 0 ? random : 'fallback'
  
  // Contador adicional para mayor unicidad en alta concurrencia
  // Validar que Math.random() retorne un valor válido
  const randomValue = Math.random()
  const counter = Number.isFinite(randomValue) ? Math.floor(randomValue * 1000000) : Math.floor(Math.random() * 1000000)
  
  // Validar que counter sea un número finito
  const safeCounter = Number.isFinite(counter) && counter >= 0 ? counter : 0
  
  return `hist_${safeTimestamp}_${safeRandom}_${safeCounter}`
}

/**
 * Verifica si una nota tiene título y contenido válidos (no vacíos)
 * CORRECCIÓN: Valida que note no sea null/undefined antes de acceder a propiedades
 */
function hasValidNoteContent(note: { title?: string | null; content?: string | null }): boolean {
  if (!note || typeof note !== 'object') {
    return false
  }
  // CORRECCIÓN: Validar que note.title y note.content sean strings válidos antes de usar trim()
  const safeTitle = note.title && typeof note.title === 'string' ? note.title.trim() : ''
  const safeContent = note.content && typeof note.content === 'string' ? note.content.trim() : ''
  
  // Validar que los resultados de trim() sean strings válidos
  const hasValidTitle = typeof safeTitle === 'string' && safeTitle.length > 0
  const hasValidContent = typeof safeContent === 'string' && safeContent.length > 0
  
  return hasValidTitle && hasValidContent
}

/**
 * Crea una versión de backup con el contenido actual antes de restaurar
 */
async function createBackupVersion(
  tx: Prisma.TransactionClient,
  noteFull: { id: string; title: string; content: string; tags: string | null },
  studentId: string
): Promise<void> {
  if (hasValidNoteContent(noteFull)) {
    const backupVersion = await tx.studyNoteVersion.create({
      data: {
        noteId: noteFull.id,
        title: noteFull.title,
        content: noteFull.content,
        tags: noteFull.tags,
        createdBy: studentId,
      },
    })
    
    // CORRECCIÓN: Validar que backupVersion sea un objeto válido antes de usar optional chaining
    if (!backupVersion || typeof backupVersion !== 'object' || !backupVersion.id || typeof backupVersion.id !== 'string' || backupVersion.id.length === 0) {
      logger.error(
        { backupVersion },
        'executeRestoreTransaction: backupVersion inválido o sin id'
      )
      throw new Error('Error al crear versión de backup')
    }
  }
}

/**
 * Valida el límite de versiones dentro de una transacción (previene race conditions)
 * Retorna true si se puede proceder, false si se alcanzó el límite y todas son importantes
 */
async function validateVersionLimitInTransaction(
  tx: Prisma.TransactionClient,
  noteId: string
): Promise<{ canProceed: boolean; error?: Error }> {
  // CORRECCIÓN: Validar que MAX_NOTE_VERSIONS sea un número válido antes de usar Math.max
  const maxNoteVersions = LIMIT_CONSTANTS.MAX_NOTE_VERSIONS
  const maxVersions = Number.isFinite(maxNoteVersions) && maxNoteVersions > 0
    ? Math.max(1, maxNoteVersions)
    : 1
  const currentVersionCount = await tx.studyNoteVersion.count({
    where: { noteId },
  })
  
  // CORRECCIÓN: Validar que currentVersionCount sea un número finito y no negativo antes de comparar
  const safeCurrentVersionCount = Number.isFinite(currentVersionCount) && currentVersionCount >= 0
    ? currentVersionCount
    : 0
  
  // Si ya está en el límite, verificar si hay versiones no importantes que se puedan eliminar
  if (safeCurrentVersionCount >= maxVersions) {
    const nonImportantVersions = await tx.studyNoteVersion.findMany({
      where: {
        noteId,
        isImportant: false,
      } as Prisma.StudyNoteVersionWhereInput,
      orderBy: { createdAt: 'asc' },
      select: { id: true },
      take: 1,
    })
    
    if (nonImportantVersions.length === 0) {
      // Todas las versiones son importantes, no se puede crear más
      return {
        canProceed: false,
        error: new Error(ERROR_MESSAGES.VERSION_LIMIT_REACHED(maxVersions)),
      }
    }
    // Si hay versiones no importantes, se eliminará la más antigua automáticamente en cleanupOldVersions
  }
  
  return { canProceed: true }
}

/**
 * Limpia versiones antiguas manteniendo solo las últimas MAX_NOTE_VERSIONS
 * CORRECCIÓN: Después de crear el backup, puede haber MAX_NOTE_VERSIONS + 1 versiones.
 * Esta función elimina las versiones más antiguas hasta dejar exactamente MAX_NOTE_VERSIONS.
 */
async function cleanupOldVersions(
  tx: Prisma.TransactionClient,
  noteId: string
): Promise<void> {
  // CORRECCIÓN: Validar que MAX_NOTE_VERSIONS sea un número válido antes de usar Math.max
  const maxNoteVersions = LIMIT_CONSTANTS.MAX_NOTE_VERSIONS
  const maxVersions = Number.isFinite(maxNoteVersions) && maxNoteVersions > 0
    ? Math.max(1, maxNoteVersions)
    : 1
  
  // Contar todas las versiones actuales (incluyendo el backup recién creado)
  const totalVersions = await tx.studyNoteVersion.count({
    where: { noteId },
  })
  
  // CORRECCIÓN: Validar que totalVersions sea un número válido y no negativo
  if (!Number.isFinite(totalVersions) || totalVersions < 0) {
    logger.error(
      { totalVersions, noteId },
      'Error: totalVersions no es un número válido en cleanupOldVersions'
    )
    throw new Error(`Error al contar versiones: valor inválido (${totalVersions})`)
  }
  
  // Si hay más versiones de las permitidas, eliminar las más antiguas
  if (totalVersions > maxVersions) {
    const versionsToKeep = maxVersions
    // CORRECCIÓN: Validar que versionsToDelete sea un número finito y positivo antes de usar
    const versionsToDelete = totalVersions - versionsToKeep
    if (!Number.isFinite(versionsToDelete) || versionsToDelete <= 0) {
      logger.error(
        { totalVersions, maxVersions, versionsToKeep, versionsToDelete },
        'Error: versionsToDelete no es un número válido o no es positivo en cleanupOldVersions'
      )
      throw new Error(`Error al calcular versiones a eliminar: valor inválido (${versionsToDelete})`)
    }
    
    // Obtener las versiones más antiguas que exceden el límite
    const oldVersions = await tx.studyNoteVersion.findMany({
      where: { noteId },
      orderBy: { createdAt: 'asc' }, // Ordenar por más antiguas primero
      take: versionsToDelete, // Tomar solo las que exceden el límite
      select: { id: true },
    })
    
    if (!isEmptyArray(oldVersions)) {
      // CORRECCIÓN: Validar que extractValidIds retorne IDs válidos antes de eliminar
      const validIds = extractValidIds(oldVersions)
      if (isEmptyArray(validIds)) {
        logger.error(
          { noteId, oldVersionsCount: oldVersions.length },
          'Error: No se encontraron IDs válidos en las versiones a eliminar'
        )
        throw new Error('No se encontraron IDs válidos en las versiones a eliminar')
      }
      
      const deleteResult = await tx.studyNoteVersion.deleteMany({
        where: {
          id: { in: validIds },
        },
      })
      
      validateDeleteCount(deleteResult.count, validIds.length, { noteId })
    }
  }
}

/**
 * Configuración de include para obtener nota con relaciones completas
 */
function getNoteIncludeConfig() {
  return {
    question: {
      include: {
        subject: {
          select: {
            nombre: true,
          },
        },
      },
    },
    topic: {
      include: {
        subject: {
          select: {
            nombre: true,
          },
        },
      },
    },
  }
}

/**
 * Ejecuta la transacción de restauración
 * Incluye logging y manejo de errores mejorado
 */
export async function executeRestoreTransaction(
  noteId: string,
  noteFull: { id: string; title: string; content: string; tags: string | null },
  version: StudyNoteVersion,
  studentId: string
): Promise<Awaited<ReturnType<typeof prisma.studyNote.findUnique>> | null> {
  const startTime = Date.now()
  try {
    const result = await prisma.$transaction(async (tx) => {
    // CORRECCIÓN: Validar límite DENTRO de la transacción para prevenir race conditions
    // Esto asegura que la validación y la creación del backup sean atómicas
    const limitValidation = await validateVersionLimitInTransaction(tx, noteFull.id)
    if (!limitValidation.canProceed) {
      throw limitValidation.error || new Error('Límite de versiones alcanzado')
    }
    
    // Crear una nueva versión con el contenido actual (backup) antes de restaurar
    await createBackupVersion(tx, noteFull, studentId)

    // Guardar historial de restauración (usando $executeRaw para evitar problemas de tipos)
    // SQLite no tiene cuid() nativo, usamos un UUID simple con mejor garantía de unicidad
    const historyId = generateRestoreHistoryId()
    
    try {
      await tx.$executeRaw`
        INSERT INTO VersionRestoreHistory (id, noteId, restoredVersionId, restoredBy, restoredAt)
        VALUES (${historyId}, ${noteFull.id}, ${version.id}, ${studentId}, ${new Date()})
      `
    } catch (historyError) {
      // Si falla el historial, loguear pero continuar (no crítico)
      logger.warn(
        { error: historyError, noteId, versionId: version.id },
        'Error al guardar historial de restauración, continuando'
      )
    }

    // Restaurar el contenido de la versión seleccionada
    // Validar que los campos requeridos no sean null antes de actualizar
    if (!version.title || !version.content) {
      throw new Error('No se puede restaurar una versión con título o contenido null')
    }

    // CORRECCIÓN: Validar studentId dentro de la transacción para garantizar autorización atómica
    // Esto previene race conditions donde la nota podría cambiar de propietario entre validación y actualización
    const updatedNote = await tx.studyNote.update({
      where: { 
        id: noteId,
        studentId: studentId, // Validación defensiva dentro de la transacción
      },
      data: {
        title: version.title,
        content: version.content,
        tags: version.tags ?? null, // Permitir null en tags
      },
    })
    
    // Validar que la actualización fue exitosa
    if (!updatedNote || updatedNote.id !== noteId) {
      throw new Error('Error al actualizar la nota durante la restauración')
    }

    // Limpiar versiones antiguas (mantener solo las últimas MAX_NOTE_VERSIONS)
    await cleanupOldVersions(tx, noteFull.id)

    // Obtener la nota actualizada con relaciones para retornar
    // CORRECCIÓN: Validar studentId para consistencia y seguridad defensiva
    // Usamos findFirst porque studentId no es parte de una clave única
    const finalNote = await tx.studyNote.findFirst({
      where: { 
        id: noteId,
        studentId: studentId, // Validación defensiva para consistencia
      },
      include: getNoteIncludeConfig(),
    })
    
    // Validar que la nota se obtuvo correctamente
    if (!finalNote) {
      throw new Error('Error al obtener la nota actualizada después de la restauración')
    }
    
    return finalNote
    }, {
      timeout: TRANSACTION_TIMEOUTS.RESTORE,
    })

    const duration = calculateDuration(startTime)
    logger.info(
      {
        noteId,
        versionId: version.id,
        studentId,
        duration,
      },
      'Transacción de restauración completada exitosamente'
    )

    return result
  } catch (error) {
    const duration = calculateDuration(startTime)
    logger.error(
      {
        error,
        noteId,
        versionId: version.id,
        studentId,
        duration,
        context: 'executeRestoreTransaction',
      },
      'Error en transacción de restauración'
    )
    throw error
  }
}

/**
 * Prepara los datos de actualización desde los parámetros
 */
export function prepareUpdateData(params: VersionUpdateParams): VersionUpdateParams {
  const updateData: {
    name?: string | null
    color?: string | null
    isImportant?: boolean
  } = {}

  if (params.name !== undefined) {
    // CORRECCIÓN: Validar explícitamente que name no sea una cadena vacía después de trim
    // Si es undefined o null, mantener null; si es string vacío después de trim, también null
    // CORRECCIÓN: Validar que params.name sea un string válido antes de usar trim()
    if (params.name !== undefined && params.name !== null && typeof params.name === 'string') {
      try {
        const trimmedName = params.name.trim()
        // Validar que trim() retorne un string válido
        if (typeof trimmedName === 'string' && trimmedName.length > 0) {
          updateData.name = trimmedName
        } else {
          updateData.name = null
        }
      } catch (error) {
        logger.warn(
          { error, name: params.name },
          'prepareUpdateData: Error al ejecutar trim() en name, usando null'
        )
        updateData.name = null
      }
    } else {
      updateData.name = null
    }
  }
  if (params.color !== undefined) {
    updateData.color = params.color
  }
  if (params.isImportant !== undefined) {
    updateData.isImportant = params.isImportant
  }

  return updateData
}

/**
 * Actualiza la versión en la base de datos
 * Optimizado: combina todas las actualizaciones en una sola query y retorna la versión actualizada
 * 
 * IMPORTANTE: Esta función asume que la autorización del usuario para acceder a la nota
 * ya fue validada previamente. Si se proporciona studentId, se realiza una validación defensiva adicional.
 * 
 * @param versionId - ID de la versión a actualizar
 * @param noteId - ID de la nota (debe pertenecer al estudiante autenticado, validado previamente)
 * @param updateData - Datos a actualizar
 * @param studentId - ID del estudiante (opcional, para validación defensiva adicional)
 * @returns Versión actualizada o null si no se encontró o no hay cambios
 */
export async function updateVersionInDatabase(
  versionId: string,
  noteId: string,
  updateData: VersionUpdateParams,
  studentId?: string
): Promise<StudyNoteVersion | null> {
  // Si no hay cambios, retornar null
  if (isEmptyObject(updateData)) {
    return null
  }

  try {
    // VALIDACIÓN DEFENSIVA: Si se proporciona studentId, validar que la nota pertenece al estudiante
    if (studentId) {
      const note = await prisma.studyNote.findFirst({
        where: {
          id: noteId,
          studentId,
        },
        select: { id: true },
      })
      
      if (!note) {
        logger.warn(
          { versionId, noteId, studentId },
          'Intento de actualizar versión de nota que no pertenece al estudiante'
        )
        return null
      }
    }
    
    // Usar Prisma para actualización segura (protege contra inyección SQL)
    // Retornar la versión actualizada directamente para evitar consulta adicional
    const updatedVersion = await prisma.studyNoteVersion.update({
      where: {
        id: versionId,
        noteId: noteId,
      },
      data: updateData as Prisma.StudyNoteVersionUpdateInput,
    })
    return updatedVersion as StudyNoteVersion
  } catch (error) {
    // Manejar errores específicos de Prisma
    if (handlePrismaNotFoundError(error, { versionId, noteId, operation: 'updateVersionInDatabase' })) {
      return null
    }
    
    // Para otros errores, loguear y relanzar
    logger.error(
      { error, versionId, noteId, updateData },
      'Error inesperado al actualizar versión en base de datos'
    )
    throw error
  }
}

/**
 * Elimina versiones en lote
 * OPTIMIZADO: Procesa en lotes para mejor performance con grandes volúmenes
 */
/**
 * Ejecuta la eliminación en lote y retorna los datos de respuesta
 * Separado de la construcción de NextResponse para permitir validación
 */
export async function executeBulkDeleteOperation(
  noteId: string,
  versionIds: string[],
  note: { id: string; title: string }
): Promise<Result<{ message: string; deletedCount: number }>> {
  // Validar versiones
  const validationResult = await validateBulkVersionsForDeletion(versionIds, note.id)
  if (!validationResult.success) {
    return validationResult
  }

  const { versions } = validationResult

  // OPTIMIZACIÓN: Para grandes volúmenes, procesar en lotes
  const BATCH_SIZE = 20
  let totalDeleted = 0
  
  try {
    // CORRECCIÓN: Validar que versionIds sea un array válido antes de acceder a length
    if (!Array.isArray(versionIds)) {
      logger.error(
        { versionIds, noteId },
        'executeBulkDeleteOperation recibió versionIds inválido'
      )
      throw new Error('versionIds debe ser un array válido')
    }
    
    // CORRECCIÓN: Validar que BATCH_SIZE sea un número válido antes de comparar
    const safeBatchSize = Number.isFinite(BATCH_SIZE) && BATCH_SIZE > 0 ? BATCH_SIZE : 50
    
    if (versionIds.length > safeBatchSize) {
      // Procesar en lotes para evitar timeouts y mejorar performance
      // CORRECCIÓN: Validar que safeBatchSize sea un número finito y positivo antes de usar en for loop
      const safeIncrement = Number.isFinite(safeBatchSize) && safeBatchSize > 0 ? safeBatchSize : 100
      // CORRECCIÓN: Validar que versionIds.length sea un número finito antes de usar en for loop
      const safeVersionIdsLength = Array.isArray(versionIds) && Number.isFinite(versionIds.length) && versionIds.length >= 0
        ? versionIds.length
        : 0
      for (let i = 0; i < safeVersionIdsLength; i += safeIncrement) {
        // CORRECCIÓN: Validar que i y safeBatchSize sean números válidos antes de usar slice()
        const safeI = Number.isFinite(i) && i >= 0 ? i : 0
        const safeEnd = Number.isFinite(safeI + safeBatchSize) ? safeI + safeBatchSize : versionIds.length
        // CORRECCIÓN: Validar que versionIds sea un array válido antes de usar slice()
        if (!Array.isArray(versionIds)) {
          logger.warn(
            { versionIds, safeI, safeEnd },
            'executeBulkDeleteOperation: versionIds no es un array válido antes de slice(), saltando batch'
          )
          continue
        }
        
        // CORRECCIÓN: Validar que los índices sean válidos antes de usar slice()
        const safeStart = Number.isFinite(safeI) && safeI >= 0 ? safeI : 0
        const safeEndIndex = Number.isFinite(safeEnd) && safeEnd >= safeStart ? safeEnd : versionIds.length
        
        let batch: string[]
        try {
          batch = versionIds.slice(safeStart, safeEndIndex)
          // Validar que slice() retorne un array válido
          if (!Array.isArray(batch)) {
            logger.warn(
              { versionIds, safeStart, safeEndIndex, batch },
              'executeBulkDeleteOperation: slice() retornó resultado inválido, saltando batch'
            )
            continue
          }
        } catch (error) {
          logger.warn(
            { error, versionIds, safeStart, safeEndIndex },
            'executeBulkDeleteOperation: Error al ejecutar slice(), saltando batch'
          )
          continue
        }
        try {
          const deleteResult = await prisma.studyNoteVersion.deleteMany({
            where: {
              id: { in: batch },
              noteId: note.id,
            },
          })
          // CORRECCIÓN: Validar que deleteResult.count y totalDeleted sean números válidos antes de sumar
          const safeDeleteCount = Number.isFinite(deleteResult.count) && deleteResult.count >= 0
            ? deleteResult.count
            : 0
          const safeTotalDeleted = Number.isFinite(totalDeleted) && totalDeleted >= 0
            ? totalDeleted
            : 0
          
          totalDeleted = safeTotalDeleted + safeDeleteCount
          
          // Validar que batch.length sea un número válido antes de usar
          const safeBatchLength = Array.isArray(batch) && Number.isFinite(batch.length)
            ? batch.length
            : 0
          
          // Validar que se eliminaron las versiones esperadas
          validateDeleteCount(safeDeleteCount, safeBatchLength, { noteId, batch, batchIndex: i })
        } catch (batchError) {
          logger.error(
            { error: batchError, noteId, batch, batchIndex: i },
            'Error al eliminar batch de versiones, continuando con siguiente batch'
          )
          // Continuar con el siguiente batch en lugar de fallar completamente
        }
      }
    } else {
      // Para lotes pequeños, eliminar de una vez
      const deleteResult = await prisma.studyNoteVersion.deleteMany({
        where: {
          id: { in: versionIds },
          noteId: note.id,
        },
      })
      // CORRECCIÓN: Validar que deleteResult.count y versionIds.length sean números válidos
      const safeDeleteCount = Number.isFinite(deleteResult.count) && deleteResult.count >= 0
        ? deleteResult.count
        : 0
      const safeVersionIdsLength = Array.isArray(versionIds) && Number.isFinite(versionIds.length)
        ? versionIds.length
        : 0
      
      totalDeleted = safeDeleteCount
      
      // Validar que se eliminaron las versiones esperadas
      validateDeleteCount(safeDeleteCount, safeVersionIdsLength, { noteId })
    }

    // CORRECCIÓN: Validar que totalDeleted sea un número válido antes de comparar
    const safeTotalDeleted = Number.isFinite(totalDeleted) && totalDeleted >= 0 ? totalDeleted : 0
    
    // Si no se eliminó ninguna versión, retornar error
    if (safeTotalDeleted === 0) {
      logger.error(
        { noteId, versionIds },
        'No se eliminó ninguna versión en operación bulk'
      )
      return {
        success: false,
        error: NextResponse.json(
          { error: ERROR_MESSAGES.DELETE_ERROR },
          { status: 500 }
        ),
      }
    }

    // Disparar webhooks en background (no bloqueante)
    // CORRECCIÓN: Validar que versions sea un array válido antes de acceder a length
    const safeVersionsCount = Array.isArray(versions) && Number.isFinite(versions.length) && versions.length >= 0
      ? versions.length
      : 0
    runInBackground(
      () => triggerDeleteWebhooks(note, versions),
      { noteId, versionIds, operation: 'triggerDeleteWebhooks', count: safeVersionsCount }
    )

    // Invalidar caché de versiones en background (no bloqueante)
    invalidateVersionCacheSafely(noteId)

    // Trackear métrica de uso
    trackVersionMetric('version.bulk_deleted', {
      noteId,
      deletedCount: safeTotalDeleted,
    })

    return {
      success: true,
      data: {
        message: SUCCESS_MESSAGES.VERSIONS_DELETED(safeTotalDeleted),
        deletedCount: safeTotalDeleted,
      },
    }
  } catch (error) {
    logger.error(
      { error, noteId, versionIds },
      'Error inesperado al eliminar versiones en lote'
    )
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.DELETE_ERROR },
        { status: 500 }
      ),
    }
  }
}

/**
 * @deprecated Usar executeBulkDeleteOperation en su lugar para permitir validación
 * Mantenido para compatibilidad
 */
export async function deleteVersionsBulk(
  noteId: string,
  versionIds: string[],
  note: { id: string; title: string }
): Promise<NextResponse> {
  const result = await executeBulkDeleteOperation(noteId, versionIds, note)
  if (!result.success) {
    return result.error
  }
  return NextResponse.json(result.data)
}

/**
 * Ejecuta la eliminación individual y retorna los datos de respuesta
 * Separado de la construcción de NextResponse para permitir validación
 */
export async function executeSingleDeleteOperation(
  noteId: string,
  versionId: string,
  note: { id: string; title: string }
): Promise<Result<{ message: string }>> {
  // Validar versión
  const validationResult = await validateSingleVersionForDeletion(versionId, note.id)
  if (!validationResult.success) {
    return validationResult
  }

  const { version } = validationResult

  try {
    // Eliminar versión
    await prisma.studyNoteVersion.delete({
      where: { id: versionId },
    })

    // Disparar webhook en background (no bloqueante)
    runInBackground(
      () => triggerDeleteWebhooks(note, [version]),
      { noteId, versionId, operation: 'triggerDeleteWebhooks' }
    )

    // Invalidar caché de versiones en background (no bloqueante)
    invalidateVersionCacheSafely(noteId)

    // Trackear métrica de uso
    trackVersionMetric('version.deleted', {
      noteId,
      versionId,
    })

    return {
      success: true,
      data: {
        message: SUCCESS_MESSAGES.VERSION_DELETED,
      },
    }
  } catch (error) {
    // Manejar errores específicos de Prisma
    if (handlePrismaNotFoundError(error, { versionId, noteId, operation: 'executeSingleDeleteOperation' })) {
      return {
        success: false,
        error: createVersionNotFoundError(),
      }
    }
    
    // Para otros errores, loguear y retornar error
    logger.error(
      { error, versionId, noteId },
      'Error inesperado al eliminar versión'
    )
    return {
      success: false,
      error: NextResponse.json(
        { error: ERROR_MESSAGES.DELETE_ERROR },
        { status: 500 }
      ),
    }
  }
}

/**
 * @deprecated Usar executeSingleDeleteOperation en su lugar para permitir validación
 * Mantenido para compatibilidad
 */
export async function deleteSingleVersion(
  noteId: string,
  versionId: string,
  note: { id: string; title: string }
): Promise<NextResponse> {
  const result = await executeSingleDeleteOperation(noteId, versionId, note)
  if (!result.success) {
    return result.error
  }
  return NextResponse.json(result.data)
}

