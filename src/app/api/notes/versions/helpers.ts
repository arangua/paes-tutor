import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { logger } from '@/lib/logger'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { validateNoteAccess } from './queries'
import type { StudyNoteVersion } from '@/lib/types/versions'
import type { Result, AuthContext, PerformanceMetrics } from './types'
import type { RequestContext } from './request-context'
import { createRequestContext, enrichContextWithAuth, getOrCreateRequestId } from './request-context'
import { ERROR_MESSAGES } from './error-messages'
import { z } from 'zod'
import { handleEndpointError } from './error-handlers'
import { auditSensitiveOperation } from './audit'
import { addTracingHeaders, addCorsHeaders, createOptimizedResponse } from './response-helpers'
import { validateResponse } from './response-schemas'
import { RESPONSE_VALIDATION, BACKGROUND_OPERATION_CONFIG } from './config'
import { calculateEnhancedMetrics, createPerformanceMetrics as createPerformanceMetricsFromMonitor, sendPerformanceAlertsToMonitoring, PerformanceAlertLevel, type PerformanceAlert } from './performance-monitor'
import { ensureFiniteNumber, ensureNonEmptyString, ensureArray, ensureObject } from './validation-utils'

/**
 * Convierte bytes a megabytes
 * 
 * DECISIÓN DE DISEÑO: Usa ensureFiniteNumber del sistema de validación centralizado
 * para mantener consistencia y reducir duplicación de código.
 */
function bytesToMB(bytes: number): number {
  const safeBytes = ensureFiniteNumber(bytes, 0)
  if (safeBytes < 0) {
    return 0
  }
  const mb = safeBytes / (1024 * 1024)
  return ensureFiniteNumber(mb, 0)
}

/**
 * Verifica si un objeto está vacío
 * 
 * DECISIÓN DE DISEÑO: Usa ensureObject del sistema de validación centralizado
 * y luego verifica las keys de forma segura.
 */
function isEmptyObject(obj: Record<string, unknown> | null | undefined): boolean {
  const safeObj = ensureObject(obj, {})
  try {
    const keys = Object.keys(safeObj)
    const safeKeys = ensureArray(keys, [])
    return safeKeys.length === 0
  } catch (error) {
    logger.warn(
      { error, obj },
      'Error al verificar si objeto está vacío, asumiendo que está vacío'
    )
    return true
  }
}

/**
 * Verifica si un body de request está vacío
 * CORRECCIÓN: Valida que body sea válido antes de procesar
 */
function isEmptyBody(body: unknown): boolean {
  // Validar que body no sea null/undefined
  if (body == null) {
    return true
  }
  
  // Validar que body sea un objeto válido antes de usar isEmptyObject
  if (typeof body === 'object' && !Array.isArray(body)) {
    return isEmptyObject(body as Record<string, unknown>)
  }
  
  // Si es un string, verificar si está vacío después de trim
  if (typeof body === 'string') {
    return body.trim().length === 0
  }
  
  // Para otros tipos, considerar no vacío
  return false
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
 * Crea respuesta de error de validación con detalles
 */
function createValidationErrorResponse(details: unknown): NextResponse {
  return NextResponse.json(
    { 
      error: ERROR_MESSAGES.INVALID_DATA, 
      details 
    },
    { status: 400 }
  )
}

/**
 * Crea un Result con error de forma consistente
 */
function createErrorResult(errorResponse: NextResponse): Result<never> {
  return {
    success: false,
    error: errorResponse,
  }
}

/**
 * Crea un Result exitoso de forma consistente
 */
function createSuccessResult<T>(data: T): Result<T> {
  return {
    success: true,
    data,
  }
}

/**
 * Crea respuesta de error con mensaje y status code
 */
function createErrorResponse(message: string, status: number = 400): NextResponse {
  return NextResponse.json({ error: message }, { status })
}

/**
 * Verifica si el entorno es producción
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production'
}

/**
 * Extrae el último segmento de un operationType (ej: 'version.restored' -> 'restored')
 * CORRECCIÓN: Valida que operationType no sea null/undefined antes de procesar
 */
function extractOperationContext(operationType: string): string {
  if (!operationType || typeof operationType !== 'string') {
    logger.warn(
      { operationType },
      'extractOperationContext recibió valor inválido, usando UNKNOWN'
    )
    return 'UNKNOWN'
  }
  
  try {
    // CORRECCIÓN: Validar que split() retorne un array válido antes de usar pop()
    const parts = operationType.split('.')
    if (Array.isArray(parts) && parts.length > 0) {
      // CORRECCIÓN: Validar que parts sea un array válido antes de usar pop()
      try {
        const lastPart = parts.pop()
        // Validar que lastPart no sea undefined (pop() puede retornar undefined si el array está vacío)
        if (lastPart === undefined) {
          logger.warn(
            { operationType, parts },
            'extractOperationContext: pop() retornó undefined, usando UNKNOWN'
          )
          return 'UNKNOWN'
        }
        // Validar que lastPart sea un string válido
        if (typeof lastPart === 'string' && lastPart.length > 0) {
          try {
            const upperCased = lastPart.toUpperCase()
            // Validar que toUpperCase() retorne un string válido
            return typeof upperCased === 'string' && upperCased.length > 0 ? upperCased : 'UNKNOWN'
          } catch (error) {
            logger.warn(
              { error, lastPart },
              'extractOperationContext: Error al ejecutar toUpperCase(), usando UNKNOWN'
            )
            return 'UNKNOWN'
          }
        }
      } catch (error) {
        logger.warn(
          { error, operationType, parts },
          'extractOperationContext: Error al ejecutar pop(), usando UNKNOWN'
        )
        return 'UNKNOWN'
      }
    }
  } catch (error) {
    logger.warn(
      { error, operationType },
      'Error al procesar operationType en extractOperationContext'
    )
  }
  
  return 'UNKNOWN'
}

/**
 * Obtiene título con fallback a 'Sin título'
 */
function getTitleWithFallback(title: string | null | undefined): string {
  return title || 'Sin título'
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
function createInternalErrorResponse(): NextResponse {
  return NextResponse.json(
    { error: ERROR_MESSAGES.INTERNAL_ERROR },
    { status: 500 }
  )
}

/**
 * Valida y obtiene el usuario autenticado con estudiante
 */
export async function validateAuthenticatedUserWithStudent(): Promise<
  | { success: false; error: NextResponse }
  | { success: true; user: Awaited<ReturnType<typeof getAuthenticatedUserWithStudent>> & { student: NonNullable<Awaited<ReturnType<typeof getAuthenticatedUserWithStudent>>['student']> } }
> {
  const dbUser = await getAuthenticatedUserWithStudent()
  if (!dbUser?.email) {
    return createErrorResult(
      createErrorResponse(ERROR_MESSAGES.UNAUTHORIZED, 401)
    )
  }

  if (!dbUser.student) {
    return createErrorResult(
      createErrorResponse(ERROR_MESSAGES.STUDENT_NOT_FOUND, 404)
    )
  }

  return createSuccessResult(dbUser as typeof dbUser & { student: NonNullable<typeof dbUser.student> })
}

/**
 * Helper que combina autenticación y medición de métricas
 * Reduce duplicación en handlers
 * 
 * @param startTime - Tiempo de inicio para calcular duración total
 * @returns Resultado con contexto de autenticación y métricas, o error
 */
export async function withAuthAndMetrics(_startTime: number): Promise<Result<AuthContext>> {
  const authStartTime = Date.now()
  const authResult = await validateAuthenticatedUserWithStudent()
  
  if (!authResult.success) {
    return authResult
  }

  const authDuration = calculateDuration(authStartTime)

  return {
    success: true,
    data: {
      user: authResult.user,
      metrics: {
        authDuration,
      },
    },
  }
}

/**
 * Helper que combina autenticación, contexto enriquecido y request ID
 * Reduce duplicación en handlers - patrón común usado en GET, PATCH, DELETE
 * 
 * @param request - NextRequest de la cual extraer contexto
 * @param startTime - Tiempo de inicio para calcular duración total
 * @returns Resultado con usuario, métricas, contexto enriquecido y request ID, o error
 * 
 * @example
 * ```typescript
 * const authContextResult = await withAuthContext(request, startTime)
 * if (!authContextResult.success) {
 *   return addTracingHeaders(authContextResult.error, requestId, Date.now() - startTime)
 * }
 * const { user, metrics, enrichedContext, requestId } = authContextResult.data
 * ```
 */
export async function withAuthContext(
  request: NextRequest,
  startTime: number
): Promise<
  | { success: false; error: NextResponse }
  | {
      success: true
      data: {
        user: AuthContext['user']
        metrics: AuthContext['metrics']
        enrichedContext: RequestContext
        requestId: string
      }
    }
> {
  // CORRECCIÓN: Validar que startTime sea un número finito antes de usar
  const safeStartTime = Number.isFinite(startTime) ? startTime : Date.now()
  
  const requestId = getOrCreateRequestId(request)
  const context = createRequestContext(request)

  const authResult = await withAuthAndMetrics(safeStartTime)
  if (!authResult.success) {
    return {
      success: false,
      error: authResult.error,
    }
  }

  const { user, metrics } = authResult.data
  // CORRECCIÓN: Validar que user.student.id y user.id sean strings válidos
  const studentId = user?.student?.id && typeof user.student.id === 'string'
    ? user.student.id
    : 'unknown'
  const userId = user?.id && typeof user.id === 'string'
    ? user.id
    : 'unknown'
  
  const enrichedContext = enrichContextWithAuth(context, studentId, userId)

  return {
    success: true,
    data: {
      user,
      metrics,
      enrichedContext,
      requestId,
    },
  }
}

/**
 * Valida el límite de versiones antes de restaurar
 */
export async function validateVersionLimitBeforeRestore(
  noteId: string
): Promise<Result<true>> {
  try {
    const { LIMIT_CONSTANTS } = await import('@/lib/constants')
    const currentVersionCount = await prisma.studyNoteVersion.count({
      where: { noteId },
    })
    
    // CORRECCIÓN: Validar que currentVersionCount y MAX_NOTE_VERSIONS sean números válidos antes de comparar
    const safeCurrentVersionCount = Number.isFinite(currentVersionCount) && currentVersionCount >= 0
      ? currentVersionCount
      : 0
    
    const maxNoteVersions = LIMIT_CONSTANTS.MAX_NOTE_VERSIONS
    const safeMaxNoteVersions = Number.isFinite(maxNoteVersions) && maxNoteVersions > 0
      ? maxNoteVersions
      : 100 // Valor por defecto seguro
    
    if (safeCurrentVersionCount >= safeMaxNoteVersions) {
      // Si ya está en el límite, verificar si hay versiones no importantes que se puedan eliminar
      const nonImportantVersions = await prisma.studyNoteVersion.findMany({
        where: {
          noteId,
          // Filtrar versiones no importantes - el campo isImportant existe en el schema
          isImportant: false,
        } as Prisma.StudyNoteVersionWhereInput,
        orderBy: { createdAt: 'asc' },
        select: { id: true },
        take: 1, // Solo necesitamos una para eliminar
      })
      
      if (nonImportantVersions.length === 0) {
        // Todas las versiones son importantes, no se puede crear más
        return {
          success: false,
          error: NextResponse.json(
            { 
              error: ERROR_MESSAGES.VERSION_LIMIT_REACHED(safeMaxNoteVersions),
            },
            { status: 400 }
          ),
        }
      }
      // Si hay versiones no importantes, se eliminará la más antigua automáticamente
    }
    
    return createSuccessResult(true)
  } catch (error) {
    logger.error(
      { error, noteId },
      'Error al validar límite de versiones antes de restaurar'
    )
    return {
      success: false,
      error: createInternalErrorResponse(),
    }
  }
}

/**
 * Valida que la versión no sea la versión actual
 */
async function validateNotCurrentVersion(
  versionId: string,
  noteId: string,
  noteFull: { id: string; title: string }
): Promise<Result<true>> {
  if (isCurrentVersion(versionId, noteId)) {
    return createErrorResult(
      NextResponse.json({
        message: ERROR_MESSAGES.CANNOT_RESTORE_CURRENT_VERSION,
        note: noteFull,
      })
    )
  }
  return createSuccessResult(true)
}

/**
 * Valida que la versión no esté vacía
 */
function validateVersionNotEmpty(version: StudyNoteVersion): Result<true> {
  if (!isNonEmptyString(version.title) || !isNonEmptyString(version.content)) {
    return createErrorResult(
      createErrorResponse(ERROR_MESSAGES.CANNOT_RESTORE_EMPTY_VERSION, 400)
    )
  }
  return createSuccessResult(true)
}

/**
 * Valida que no se esté restaurando la misma versión dos veces seguidas
 */
async function validateNoDuplicateRestore(
  noteId: string,
  versionId: string
): Promise<Result<true>> {
  const lastRestore = await prisma.versionRestoreHistory.findFirst({
    where: { noteId },
    orderBy: { restoredAt: 'desc' },
    select: { restoredVersionId: true },
  })

  if (lastRestore && lastRestore.restoredVersionId === versionId) {
    const { RESTORE_VALIDATION } = await import('./config')
    const recentRestore = await prisma.versionRestoreHistory.findFirst({
      where: {
        noteId,
        restoredVersionId: versionId,
        restoredAt: {
          // CORRECCIÓN: Validar que Date.now() y DUPLICATE_RESTORE_WINDOW_MS sean números válidos antes de restar
          gte: (() => {
            const currentTime = Date.now()
            const safeCurrentTime = Number.isFinite(currentTime) ? currentTime : Date.now()
            const windowMs = RESTORE_VALIDATION.DUPLICATE_RESTORE_WINDOW_MS
            const safeWindowMs = Number.isFinite(windowMs) && windowMs >= 0 ? windowMs : 0
            const calculatedTime = safeCurrentTime - safeWindowMs
            // Validar que calculatedTime sea un número finito antes de crear Date
            return Number.isFinite(calculatedTime) ? new Date(calculatedTime) : new Date(0)
          })(),
        },
      },
    })

    if (recentRestore) {
      logger.warn(
        { noteId, versionId },
        'Intento de restaurar la misma versión dos veces seguidas'
      )
      return createErrorResult(
        createErrorResponse(ERROR_MESSAGES.DUPLICATE_RESTORE, 400)
      )
    }
  }
  return { success: true, data: true }
}

/**
 * Valida y obtiene la nota y versión para restauración
 */
export async function validateNoteAndVersionForRestore(
  noteId: string,
  versionId: string,
  studentId: string
): Promise<
  Result<{ noteFull: { id: string; title: string; content: string; tags: string | null; studentId: string; updatedAt: Date }; version: StudyNoteVersion }>
> {
  try {
    // Obtener la nota completa para restaurar - VALIDACIÓN DE SEGURIDAD: verificar que pertenece al estudiante
    const noteFull = await prisma.studyNote.findFirst({
      where: { 
        id: noteId,
        studentId: studentId, // Validar propiedad del recurso
      },
      select: {
        id: true,
        title: true,
        content: true,
        tags: true,
        studentId: true,
        updatedAt: true,
      },
    })

    if (!noteFull) {
      return { 
        success: false,
        error: NextResponse.json({ error: ERROR_MESSAGES.NOTE_NOT_FOUND }, { status: 404 }) 
      }
    }

    // Validar que no se esté restaurando la versión actual
    const currentVersionValidation = await validateNotCurrentVersion(versionId, noteId, noteFull)
    if (!currentVersionValidation.success) {
      return currentVersionValidation
    }

    // Verificar que la versión existe y pertenece a la nota
    const version = await prisma.studyNoteVersion.findFirst({
      where: {
        id: versionId,
        noteId: noteFull.id,
      },
    })

    if (!version) {
      return { 
        success: false,
        error: createVersionNotFoundError()
      }
    }

    // Validar que la versión no esté vacía
    const emptyValidation = validateVersionNotEmpty(version)
    if (!emptyValidation.success) {
      return emptyValidation
    }

    // Validar que no se esté restaurando la misma versión dos veces seguidas
    const duplicateValidation = await validateNoDuplicateRestore(noteFull.id, versionId)
    if (!duplicateValidation.success) {
      return duplicateValidation
    }

    // VALIDACIÓN DE SEGURIDAD: Validar tamaño del contenido antes de restaurar
    const { validateContentSize } = await import('./validators')
    const contentSizeValidation = validateContentSize(version.content)
    if (!contentSizeValidation.success) {
      return contentSizeValidation
    }

    return { success: true, data: { noteFull, version } }
  } catch {
    logger.error(
      { error, noteId, versionId, studentId },
      'Error al validar nota y versión para restauración'
    )
    return {
      success: false,
      error: createInternalErrorResponse(),
    }
  }
}

/**
 * Valida y obtiene la nota y versión para actualización
 */
export async function validateNoteAndVersionForUpdate(
  noteId: string,
  versionId: string,
  studentId: string
): Promise<
  | { success: true; note: { id: string; title: string }; version: StudyNoteVersion }
  | { success: false; error: NextResponse }
> {
  try {
    // Verificar que la nota pertenece al estudiante
    const noteResult = await validateNoteAccess(noteId, studentId, {
      id: true,
      title: true,
    })

    if (!noteResult.success) {
      return noteResult
    }

    const note = noteResult.note

    // Si es la versión actual, no se puede actualizar (no está en la tabla de versiones)
    if (isCurrentVersion(versionId, noteId)) {
      return {
        success: false,
        error: NextResponse.json(
          { error: ERROR_MESSAGES.CANNOT_UPDATE_CURRENT_VERSION },
          { status: 400 }
        ),
      }
    }

    // Verificar que la versión existe y pertenece a la nota
    const version = await prisma.studyNoteVersion.findFirst({
      where: {
        id: versionId,
        noteId: note.id,
      },
    })

    if (!version) {
      return {
        success: false,
        error: createVersionNotFoundError(),
      }
    }

    return { success: true, note, version }
  } catch (error) {
    logger.error(
      { error, noteId, versionId, studentId },
      'Error al validar nota y versión para actualización'
    )
    return {
      success: false,
      error: createInternalErrorResponse(),
    }
  }
}

/**
 * Valida y obtiene la nota para eliminación
 */
export async function validateNoteForDeletion(
  noteId: string,
  studentId: string
): Promise<{ success: true; note: { id: string; title: string } } | { success: false; error: NextResponse }> {
  const result = await validateNoteAccess(noteId, studentId, {
    id: true,
    title: true,
  })

  if (!result.success) {
    return result
  }

  return { success: true, note: result.note }
}

/**
 * Valida y obtiene versiones para eliminación en lote
 */
export async function validateBulkVersionsForDeletion(
  versionIds: string[],
  noteId: string
): Promise<
  | { success: true; versions: StudyNoteVersion[] }
  | { success: false; error: NextResponse }
> {
  try {
    const versions = await prisma.studyNoteVersion.findMany({
      where: {
        id: { in: versionIds },
        noteId,
      },
    })

    // CORRECCIÓN: Validar que versions.length y versionIds.length sean números válidos antes de comparar
    const safeVersionsLength = Array.isArray(versions) && Number.isFinite(versions.length)
      ? versions.length
      : 0
    const safeVersionIdsLength = Array.isArray(versionIds) && Number.isFinite(versionIds.length)
      ? versionIds.length
      : 0
    
    if (safeVersionsLength !== safeVersionIdsLength) {
      return {
        success: false,
        error: NextResponse.json(
          { error: ERROR_MESSAGES.SOME_VERSIONS_NOT_FOUND },
          { status: 404 }
        ),
      }
    }

    return { success: true, versions }
  } catch (error) {
    logger.error(
      { error, versionIds, noteId },
      'Error al validar versiones para eliminación en lote'
    )
    return {
      success: false,
      error: createInternalErrorResponse(),
    }
  }
}

/**
 * Valida y obtiene versión para eliminación individual
 */
export async function validateSingleVersionForDeletion(
  versionId: string,
  noteId: string
): Promise<
  | { success: true; version: StudyNoteVersion }
  | { success: false; error: NextResponse }
> {
  try {
    const version = await prisma.studyNoteVersion.findFirst({
      where: {
        id: versionId,
        noteId,
      },
    })

    if (!version) {
      return {
        success: false,
        error: createVersionNotFoundError(),
      }
    }

    return { success: true, version }
  } catch (error) {
    logger.error(
      { error, versionId, noteId },
      'Error al validar versión para eliminación individual'
    )
    return {
      success: false,
      error: createInternalErrorResponse(),
    }
  }
}

/**
 * Crea notificaciones después de restaurar versión
 */
export async function createRestoreNotifications(
  studentId: string,
  note: { id: string; title: string }
): Promise<void> {
  try {
    // Validar entradas antes de proceder
    if (!studentId || !note?.id) {
      logger.warn(
        { studentId, noteId: note?.id },
        'Notificaciones omitidas: datos inválidos'
      )
      return
    }
    
    const { createNotification, createVersionLimitNotifications } = await import('@/lib/notifications')
    
    // Usar valor por defecto si el título es null/undefined
    const noteTitle = getTitleWithFallback(note.title)
    
    // Notificación de restauración
    await createNotification({
      studentId,
      type: 'system',
      title: 'Versión restaurada',
      message: `Has restaurado una versión de la nota "${noteTitle}"`,
      relatedId: note.id,
      relatedType: 'material',
      actionUrl: `/notes`,
    })
    
    // Verificar límites de versiones
    await createVersionLimitNotifications(studentId)
  } catch (notifError) {
    // No fallar si las notificaciones fallan
    logger.error(
      { error: notifError, studentId, noteId: note?.id },
      'Error al crear notificaciones'
    )
  }
}

/**
 * Parsea el body JSON de una request de forma segura
 * Con validación de tamaño de payload para prevenir ataques DoS
 * 
 * @param request - NextRequest de la cual parsear el body
 * @param context - Contexto para logging (ej: 'POST', 'PATCH', 'DELETE')
 * @param allowEmpty - Si es true, permite body vacío (útil para DELETE con query params)
 * @returns Resultado con el body parseado o error
 */
export async function parseRequestBody<T = Record<string, unknown>>(
  request: NextRequest,
  context: string,
  allowEmpty: boolean = false
): Promise<
  | { success: true; data: T }
  | { success: false; error: NextResponse }
> {
  // Validar Content-Type si está presente
  const contentType = request.headers.get('content-type')
  // CORRECCIÓN: Validar que contentType sea un string válido antes de usar includes()
  if (contentType && typeof contentType === 'string' && contentType.length > 0) {
    try {
      if (!contentType.includes('application/json')) {
        logger.warn(
          { contentType, context: `notes/versions/${context}` },
          'Content-Type inválido para parsear JSON'
        )
        return {
          success: false,
          error: NextResponse.json(
            { error: ERROR_MESSAGES.INVALID_CONTENT_TYPE },
            { status: 400 }
          ),
        }
      }
    } catch (error) {
      logger.warn(
        { error, contentType, context: `notes/versions/${context}` },
        'Error al validar Content-Type, continuando'
      )
      // Continuar si falla la validación de Content-Type
    }
  }

  // Validar tamaño del payload antes de parsear (prevenir DoS)
  const contentLength = request.headers.get('content-length')
  if (contentLength && typeof contentLength === 'string' && contentLength.trim().length > 0) {
    try {
      const { SIZE_LIMITS } = await import('./config')
      // CORRECCIÓN: Validar que contentLength sea un string válido antes de usar parseInt()
      const safeContentLength = typeof contentLength === 'string' && contentLength.trim().length > 0
        ? contentLength.trim()
        : '0'
      
      const sizeBytes = Number.parseInt(safeContentLength, 10)
      // CORRECCIÓN: Validar que sizeBytes sea un número válido, positivo y finito
      // parseInt() puede retornar NaN si el string no es un número válido
      if (Number.isNaN(sizeBytes) || !Number.isFinite(sizeBytes) || sizeBytes < 0) {
        logger.warn(
          { contentLength, sizeBytes, context: `notes/versions/${context}` },
          'Content-Length inválido (negativo, NaN o infinito)'
        )
        return createErrorResult(
          createErrorResponse('Content-Length inválido', 400)
        )
      }
      if (sizeBytes > SIZE_LIMITS.MAX_PAYLOAD_SIZE) {
        const maxMB = bytesToMB(SIZE_LIMITS.MAX_PAYLOAD_SIZE)
        logger.warn(
          { sizeBytes, maxSize: SIZE_LIMITS.MAX_PAYLOAD_SIZE, context: `notes/versions/${context}` },
          'Payload demasiado grande rechazado'
        )
        return createErrorResult(
          createErrorResponse(ERROR_MESSAGES.PAYLOAD_TOO_LARGE(maxMB), 413)
        )
      }
    } catch (importError) {
      logger.warn(
        { error: importError, context: `notes/versions/${context}` },
        'Error al cargar config para validar tamaño, continuando sin validación'
      )
      // Continuar sin validación de tamaño si falla el import
    }
  }

  try {
    // En tests, NextRequest puede no tener el body disponible correctamente
    // Intentar obtener el body de diferentes formas
    let body: unknown
    
    // PRIMERO: Si _bodyText está disponible (para tests), usarlo directamente
    // Esto evita problemas con Request real de Node donde request.text() puede no funcionar
    // IMPORTANTE: Verificar _bodyText ANTES de intentar leer el body del Request
    // porque una vez que se lee el body del Request, ya no está disponible
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Fallback para test environments (happy-dom) donde _bodyText es inyectado
    const directBody = (request as Record<string, unknown>)._bodyText as string | undefined
    if (directBody !== undefined && directBody !== null && typeof directBody === 'string' && directBody.length > 0) {
      try {
        body = JSON.parse(directBody)
      } catch {
        body = directBody
      }
    } else {
      // Si _bodyText no está disponible, intentar request.text() (funciona con Request real de Node/undici)
      try {
        const bodyText = await request.text()
        if (bodyText && bodyText.length > 0) {
          try {
            body = JSON.parse(bodyText)
          } catch {
            body = bodyText
          }
        } else {
          // Si text() retorna vacío, intentar json()
          try {
            body = await request.json()
          } catch (jsonError) {
            // Si ambos fallan, usar fallback para tests (happy-dom)
            const reqRecord = request as Record<string, unknown>
            const requestBody = reqRecord._bodyText || reqRecord.body
            if (requestBody) {
              if (typeof requestBody === 'string') {
                try {
                  body = JSON.parse(requestBody)
                } catch {
                  body = requestBody
                }
              } else {
                body = requestBody
              }
            } else {
              throw jsonError
            }
          }
        }
      } catch {
        // Si request.text() falla, intentar request.json()
        try {
          body = await request.json()
        } catch (jsonError) {
          // Si ambos fallan, usar fallback para tests (happy-dom)
          const reqRecord = request as Record<string, unknown>
          const requestBody = reqRecord._bodyText || reqRecord.body
          if (requestBody) {
            if (typeof requestBody === 'string') {
              try {
                body = JSON.parse(requestBody)
              } catch {
                body = requestBody
              }
            } else {
              body = requestBody
            }
          } else {
            throw jsonError
          }
        }
      }
    }
    
    // Si allowEmpty es false y el body está vacío, retornar error
    if (!allowEmpty && isEmptyBody(body)) {
      return createErrorResult(
        createErrorResponse(ERROR_MESSAGES.EMPTY_REQUEST_BODY, 400)
      )
    }

    return createSuccessResult(body as T)
  } catch (error) {
    // Si allowEmpty es true y falla el parsing, asumir body vacío
    if (allowEmpty) {
      logger.debug(
        { error, context: `notes/versions/${context}` },
        'Body vacío o inválido, usando valores por defecto'
      )
      return createSuccessResult({} as T)
    }

    logger.warn(
      { error, context: `notes/versions/${context}` },
      'Error al parsear JSON del body'
    )
    return createErrorResult(
      createErrorResponse(ERROR_MESSAGES.INVALID_JSON, 400)
    )
  }
}

/**
 * Crea un objeto de métricas de performance para logging
 * Incluye alertas automáticas si se exceden los umbrales
 * 
 * @deprecated Usar calculateEnhancedMetrics de performance-monitor.ts para mejor funcionalidad
 * Mantenido para compatibilidad hacia atrás
 */
export function createPerformanceMetrics(
  startTime: number, 
  metrics: Record<string, number>,
  context?: string
): PerformanceMetrics & { alerts?: string[] } {
  try {
    // Usar la importación estática en lugar de require() para que funcione correctamente con mocks en tests
    return createPerformanceMetricsFromMonitor(startTime, metrics, context)
  } catch (error) {
    logger.error(
      { error, startTime, context },
      'Error al crear métricas de performance, usando fallback'
    )
    // Retornar métricas básicas como fallback
    return {
      duration: calculateDuration(startTime),
      alerts: [],
    }
  }
}

/**
 * Valida si un versionId corresponde a la versión actual (noteId)
 * Útil para evitar operaciones en la versión actual que no está en la tabla de versiones
 */
export function isCurrentVersion(versionId: string, noteId: string): boolean {
  return versionId === noteId
}

/**
 * Invalida el caché de versiones de forma segura en background
 * No bloquea la respuesta y registra errores sin fallar
 */
export function invalidateVersionCacheSafely(noteId: string): void {
  runInBackground(() => {
    try {
      const { invalidateVersionCache } = require('./cache')
      return invalidateVersionCache(noteId)
    } catch (error) {
      logger.error(
        { error, noteId },
        'Error al cargar módulo de caché, omitiendo invalidación'
      )
      return Promise.resolve()
    }
  }, { noteId, operation: 'invalidateVersionCache' })
}

/**
 * Loguea el resultado exitoso de una operación en background
 */
function logBackgroundSuccess(
  context: Record<string, unknown> | undefined,
  attempt: number
): void {
  if (attempt === 0) {
    logger.debug(
      { ...context, attempt: attempt + 1 },
      `Operación en background exitosa: ${context?.operation || 'unknown'}`
    )
  } else {
    logger.info(
      { ...context, attempt: attempt + 1, retried: true },
      `Operación en background exitosa después de ${attempt} reintentos: ${context?.operation || 'unknown'}`
    )
  }
}

/**
 * Calcula delay con backoff exponencial con validación completa
 */
function calculateExponentialBackoffDelay(
  attempt: number,
  baseDelay: number,
  backoffMultiplier: number,
  maxDelay: number
): number {
  try {
    const exponent = attempt - 1
    
    // Validar que los valores sean números válidos
    if (!Number.isFinite(baseDelay) || !Number.isFinite(backoffMultiplier) || 
        !Number.isFinite(exponent) || baseDelay <= 0 || backoffMultiplier <= 0 || exponent < 0) {
      return baseDelay
    }
    
    // CORRECCIÓN: Validar que Math.pow() retorne un número finito antes de multiplicar
    let powResult: number
    try {
      powResult = Math.pow(backoffMultiplier, exponent)
      // Validar que powResult sea un número finito y positivo
      if (!Number.isFinite(powResult) || powResult <= 0) {
        logger.warn(
          { backoffMultiplier, exponent, powResult },
          'calculateBackoffDelay: Math.pow() retornó valor inválido, usando baseDelay'
        )
        return baseDelay
      }
    } catch (error) {
      logger.warn(
        { error, backoffMultiplier, exponent },
        'calculateBackoffDelay: Error al calcular Math.pow(), usando baseDelay'
      )
      return baseDelay
    }
    
    const calculatedDelay = baseDelay * powResult
    
    // Validar que el resultado sea un número válido
    if (!Number.isFinite(calculatedDelay) || calculatedDelay <= 0) {
      return baseDelay
    }
    
    const delay = Math.min(calculatedDelay, maxDelay)
    // CORRECCIÓN: Validar que Math.min() retorne un número finito
    
    // Validar que el resultado final sea válido
    return Number.isFinite(delay) && delay > 0 ? delay : baseDelay
  } catch (error) {
    logger.warn(
      { error, baseDelay, backoffMultiplier, attempt, maxDelay },
      'Error al calcular delay con backoff exponencial, usando baseDelay'
    )
    return baseDelay
  }
}

/**
 * Ejecuta una operación en background con retry y mejor logging
 * No bloquea la respuesta y registra errores sin fallar
 * 
 * @template T - Tipo de retorno de la operación (no se usa pero ayuda con tipado)
 * @param operation - Función async que ejecutar en background
 * @param context - Contexto para logging (opcional)
 * @param retryConfig - Configuración de reintentos (opcional)
 * 
 * @example
 * ```typescript
 * runInBackground(
 *   () => triggerWebhook(data),
 *   { noteId, operation: 'webhook' },
 *   { maxRetries: 3, baseDelay: 1000 }
 * )
 * ```
 */
export function runInBackground<T = unknown>(
  operation: () => Promise<T>,
  context?: Record<string, unknown>,
  retryConfig?: {
    maxRetries?: number
    baseDelay?: number
    backoffMultiplier?: number
    maxDelay?: number
  }
): void {
  // CORRECCIÓN: Validar que operation sea una función antes de ejecutar
  if (typeof operation !== 'function') {
    logger.error(
      { operation, context },
      'runInBackground recibió operation inválido, omitiendo ejecución'
    )
    return
  }
  
  const {
    maxRetries = 3,
    baseDelay = 1000,
    backoffMultiplier = 2,
    maxDelay = 10000,
  } = retryConfig || {}
  
  let lastError: unknown
  let attempt = 0
  
  const executeWithRetry = async (): Promise<T> => {
    // CORRECCIÓN: Validar que maxRetries sea un número válido para evitar bucles infinitos
    const safeMaxRetries = Number.isFinite(maxRetries) && maxRetries >= 0 ? maxRetries : 0
    const MAX_ATTEMPTS_LIMIT = 100 // Límite de seguridad para evitar bucles infinitos
    
    // CORRECCIÓN: Validar que attempt sea un número válido antes de usar en while
    let safeAttempt = Number.isFinite(attempt) && attempt >= 0 ? attempt : 0
    
    while (safeAttempt <= safeMaxRetries && safeAttempt < MAX_ATTEMPTS_LIMIT) {
      try {
        const result = await operation()
        
        // Loguear éxito (diferente nivel según si fue retry o no)
        logBackgroundSuccess(context, safeAttempt)
        
        return result
      } catch (error) {
        lastError = error
        // CORRECCIÓN: Validar que safeAttempt sea un número válido antes de incrementar
        safeAttempt = Number.isFinite(safeAttempt) ? safeAttempt + 1 : MAX_ATTEMPTS_LIMIT
        attempt = safeAttempt
        
        // CORRECCIÓN: Validar que safeAttempt sea un número válido antes de comparar
        if (!Number.isFinite(safeAttempt) || safeAttempt > safeMaxRetries || safeAttempt >= MAX_ATTEMPTS_LIMIT) {
          // Ya se agotaron los reintentos o se alcanzó el límite de seguridad
          break
        }
        
        // Calcular delay con backoff exponencial
        // CORRECCIÓN: Validar que safeAttempt sea un número válido antes de usar en calculateExponentialBackoffDelay
        const safeAttemptForDelay = Number.isFinite(safeAttempt) && safeAttempt >= 0 ? safeAttempt : 0
        const delay = calculateExponentialBackoffDelay(
          safeAttemptForDelay,
          baseDelay,
          backoffMultiplier,
          maxDelay
        )
        
        logger.warn(
          {
            ...context,
            attempt: safeAttempt,
            maxRetries,
            delay,
            error: extractErrorDetails(error),
          },
          `Error en operación en background (intento ${safeAttempt}/${maxRetries}), reintentando en ${delay}ms: ${context?.operation || 'unknown'}`
        )
        
        // Esperar antes de reintentar
        // CORRECCIÓN: Validar que delay sea un número finito y no negativo antes de usar setTimeout
        const safeDelay = Number.isFinite(delay) && delay >= 0 ? delay : 0
        const MAX_DELAY_MS = 60000 // 1 minuto máximo para evitar delays excesivos
        const clampedDelay = Math.min(safeDelay, MAX_DELAY_MS)
        try {
          await new Promise(resolve => setTimeout(resolve, clampedDelay))
        } catch (timeoutError) {
          logger.warn(
            { error: timeoutError, delay, safeDelay, clampedDelay },
            'runInBackground: Error al ejecutar setTimeout, continuando sin delay'
          )
          // Continuar sin delay si falla setTimeout
        }
      }
    }
    
    // Si llegamos aquí, todos los intentos fallaron
    // CORRECCIÓN: Validar que lastError no sea undefined antes de lanzar
    if (lastError === undefined) {
      logger.error(
        { attempt: safeAttempt, maxRetries, context },
        'runInBackground: Todos los intentos fallaron pero lastError es undefined'
      )
      throw new Error('Operation failed after all retries but no error was captured')
    }
    throw lastError
  }
  
  // Ejecutar en background sin bloquear
  executeWithRetry().catch((error: unknown) => {
    const errorDetails = extractErrorDetails(error)
    
    // CORRECCIÓN: Validar que attempt sea un número válido antes de usar en logging
    const safeAttemptForLogging = Number.isFinite(attempt) && attempt >= 0 ? attempt : 0
    
    logger.error(
      { 
        ...errorDetails, 
        ...context,
        attempt: safeAttemptForLogging,
        maxRetries,
        context: 'runInBackground',
        failedAfterRetries: true,
      },
      `Error en operación en background después de ${safeAttemptForLogging} intentos: ${context?.operation || 'unknown'}`
    )
    
    // Trackear métrica de fallo si está disponible
    try {
      // CORRECCIÓN: Validar que require() retorne un módulo válido
      const metricsTracker = require('./metrics-tracker')
      if (!metricsTracker || typeof metricsTracker.trackVersionMetric !== 'function') {
        throw new Error('metrics-tracker module is invalid or missing trackVersionMetric')
      }
      const { trackVersionMetric } = metricsTracker
      trackVersionMetric('version.background_operation_failed', { // guard:allow-secret
        ...context,
        attempt: safeAttemptForLogging,
        maxRetries,
      })
    } catch (metricError) {
      // Ignorar si no está disponible, pero loguear el error
      logger.warn(
        { error: metricError, ...context },
        'Error al cargar metrics-tracker para tracking de fallo'
      )
    }
  })
}

/**
 * Helper para ejecutar operaciones en background con mejor manejo de errores
 * Wrapper alrededor de runInBackground que agrega logging de errores específico
 * 
 * @param operation - Función async que ejecutar
 * @param context - Contexto para logging (debe incluir requestId)
 * @param retryConfig - Configuración de reintentos
 */
export function runInBackgroundWithErrorHandling<T = unknown>(
  operation: () => Promise<T>,
  context: Record<string, unknown> & { operation: string; requestId?: string },
  retryConfig?: {
    maxRetries?: number
    baseDelay?: number
    backoffMultiplier?: number
    maxDelay?: number
  }
): void {
  // CORRECCIÓN: Validar que operation sea una función antes de pasar a runInBackground
  if (typeof operation !== 'function') {
    logger.error(
      { operation, context },
      'runInBackgroundWithErrorHandling recibió operation inválido, omitiendo ejecución'
    )
    return
  }
  
  // CORRECCIÓN: Validar que context sea un objeto válido con operation
  if (!context || typeof context !== 'object' || Array.isArray(context) || typeof context.operation !== 'string' || context.operation.length === 0) {
    logger.error(
      { context },
      'runInBackgroundWithErrorHandling recibió context inválido o sin operation, omitiendo ejecución'
    )
    return
  }
  
  runInBackground(
    async () => {
      try {
        return await operation()
      } catch (error) {
        logger.error(
          { 
            error, 
            ...context,
            operation: context.operation,
          },
          `Error en operación en background: ${context.operation}`
        )
        throw error // Re-lanzar para que runInBackground maneje el retry
      }
    },
    context,
    retryConfig
  )
}

/**
 * Helper para estandarizar el flujo post-operación: invalidar caché → trackear métricas
 * Mantiene consistencia en el orden de operaciones después de modificar datos
 * 
 * @param noteId - ID de la nota afectada
 * @param operationType - Tipo de operación para tracking (ej: 'version.restored')
 * @param metricData - Datos adicionales para el tracking de métricas
 */
export function postOperationCleanup(
  noteId: string,
  operationType: string,
  metricData?: Record<string, unknown>
): void {
  // Orden estandarizado: invalidar caché → trackear métricas
  invalidateVersionCacheSafely(noteId)
  
  try {
    // CORRECCIÓN: Validar que require() retorne un módulo válido
    const metricsTracker = require('./metrics-tracker')
    if (!metricsTracker || typeof metricsTracker.trackVersionMetric !== 'function') {
      throw new Error('metrics-tracker module is invalid or missing trackVersionMetric')
    }
    const { trackVersionMetric } = metricsTracker
    trackVersionMetric(operationType, {
      noteId,
      ...metricData,
    })
  } catch (error) {
    logger.error(
      { error, noteId, operationType },
      'Error al cargar metrics-tracker, omitiendo tracking'
    )
  }
}

/**
 * Valida datos con un schema de Zod y retorna resultado estandarizado
 * 
 * @param schema - Schema de Zod para validar
 * @param data - Datos a validar
 * @returns Result con datos validados o error
 */
export function validateWithSchema<T extends z.ZodType>(
  schema: T,
  data: unknown
): Result<z.infer<T>> {
  const validation = schema.safeParse(data)

  if (!validation.success) {
    return {
      success: false,
      error: createValidationErrorResponse(validation.error.issues),
    }
  }

  return createSuccessResult(validation.data)
}

/**
 * Crea alerta de validación de respuesta para monitoreo
 */
function createResponseValidationAlert(
  operationType: string,
  errorCount: number
): PerformanceAlert {
  const { PerformanceAlertLevel } = require('./performance-monitor')
  return {
    level: PerformanceAlertLevel.CRITICAL,
    message: `Respuesta ${operationType} no válida según schema - esto indica un bug en la construcción de la respuesta`,
    metric: 'response_validation',
    value: errorCount,
    threshold: 0,
    context: operationType,
    timestamp: new Date(),
  }
}

/**
 * Helper para validar respuestas contra schemas de forma consistente
 * Centraliza la lógica de validación y logging de respuestas inválidas
 * 
 * @param schema - Schema de Zod para validar
 * @param data - Datos a validar
 * @param requestId - ID de la petición para logging
 * @param operationType - Tipo de operación para logging (ej: 'POST', 'PATCH')
 * @param metadata - Metadatos adicionales para alertas (opcional)
 * @returns Result con true si la validación es exitosa, o error con detalles si falla
 * 
 * @example
 * ```typescript
 * const validationResult = validateResponseData(
 *   restoreVersionResponseSchema,
 *   responseData,
 *   requestId,
 *   'POST',
 *   { noteId, versionId }
 * )
 * 
 * if (!validationResult.success) {
 *   // Manejar error de validación
 *   logger.error(validationResult.error, 'Error de validación de respuesta')
 * }
 * ```
 */
export function validateResponseData<T extends z.ZodType>(
  schema: T,
  data: unknown,
  requestId: string,
  operationType: string,
  metadata?: Record<string, unknown>
): Result<true> {
  const validation = validateResponse(schema, data)
  if (!validation.valid) {
    const errorDetails = buildValidationErrorDetails(
      requestId,
      validation.errors.issues,
      operationType,
      metadata
    )
    
    // En producción, registrar como error crítico y enviar alerta
    if (isProduction()) {
      logger.error(
        errorDetails,
        `Respuesta ${operationType} no válida según schema - PROBLEMA CRÍTICO EN PRODUCCIÓN`
      )
      
      // Enviar alerta a sistema de monitoreo (similar a alertas de performance)
      // Esto indica un problema en la construcción de la respuesta que debe investigarse
      try {
        const { sendPerformanceAlertsToMonitoring } = require('./performance-monitor')
        
        sendPerformanceAlertsToMonitoring(
          [createResponseValidationAlert(operationType, validation.errors.issues.length)],
          {
            requestId,
            operationType,
            errorCount: validation.errors.issues.length,
            ...metadata,
          }
        )
      } catch (monitoringError) {
        // Si falla el envío de alertas, no fallar la validación
        logger.warn(
          { error: monitoringError, requestId },
          'Error al enviar alerta de validación de respuesta a monitoreo'
        )
      }
    } else {
      // En desarrollo, usar warning
      logger.warn(
        errorDetails,
        `Respuesta ${operationType} no válida según schema`
      )
      
      // En desarrollo, opcionalmente lanzar error si está habilitado
      if (RESPONSE_VALIDATION.STRICT_IN_DEVELOPMENT) {
        // CORRECCIÓN: Validar que validation.errors.issues sea válido antes de usar JSON.stringify()
        let issuesString: string
        try {
          if (validation.errors && validation.errors.issues && Array.isArray(validation.errors.issues)) {
            issuesString = JSON.stringify(validation.errors.issues)
            // Validar que JSON.stringify() retorne un string válido
            if (typeof issuesString !== 'string' || issuesString.length === 0) {
              issuesString = 'Error de validación desconocido'
            }
          } else {
            issuesString = 'Error de validación desconocido'
          }
        } catch (error) {
          logger.warn(
            { error, validation },
            'validateResponseData: Error al serializar issues, usando mensaje genérico'
          )
          issuesString = 'Error de validación desconocido'
        }
        throw new Error(`Respuesta no válida según schema: ${issuesString}`)
      }
    }
    
    return createErrorResult(
      createErrorResponse('Error de validación de respuesta', 500)
    )
  }
  
  return {
    success: true,
    data: true,
  }
}

/**
 * Calcula la duración en milisegundos desde un tiempo de inicio
 */
/**
 * Calcula la duración entre startTime y el momento actual
 * CORRECCIÓN: Valida que startTime sea un número finito antes de calcular
 */
export function calculateDuration(startTime: number): number {
  if (!Number.isFinite(startTime)) {
    logger.warn(
      { startTime },
      'calculateDuration recibió startTime inválido, retornando 0'
    )
    return 0
  }
  const duration = Date.now() - startTime
  // Validar que la duración sea un número válido (no debería ser negativa en casos normales)
  return Number.isFinite(duration) ? Math.max(0, duration) : 0
}

/**
 * Extrae detalles de un error de forma segura para logging
 */
export function extractErrorDetails(error: unknown): {
  message?: string
  stack?: string
  name?: string
  error?: string
} {
  if (error instanceof Error) {
    return {
      message: error.message,
      stack: error.stack,
      name: error.name,
    }
  }
  return { error: String(error) }
}

/**
 * Construye detalles de error de validación para logging
 */
function buildValidationErrorDetails(
  requestId: string,
  errors: z.ZodIssue[],
  operationType: string,
  metadata?: Record<string, unknown>
): Record<string, unknown> {
  return {
    requestId,
    errors,
    environment: process.env.NODE_ENV,
    operationType,
    ...metadata,
  }
}

/**
 * Helper para manejar errores de forma consistente en handlers
 * Centraliza el patrón de auditoría y logging de errores
 * 
 * @param error - Error capturado
 * @param request - NextRequest para obtener contexto
 * @param operationType - Tipo de operación para auditoría (ej: 'version.queried')
 * @param startTime - Tiempo de inicio para calcular duración
 * @param context - Contexto adicional para logging
 * @returns NextResponse con error manejado
 */
export function handleHandlerError(
  error: unknown,
  request: NextRequest,
  operationType: string,
  startTime: number,
  context?: Record<string, unknown>
): NextResponse {
  const requestId = getOrCreateRequestId(request)
  const requestContext = createRequestContext(request)
  
  // Auditar error antes de retornar
  auditSensitiveOperation(operationType, requestContext, {
    severity: 'error',
    outcome: 'failure',
    error: error instanceof Error ? error : new Error(String(error)),
    ...context,
  })
  
  const response = handleEndpointError(error, extractOperationContext(operationType))
  return addTracingHeaders(response, requestId, calculateDuration(startTime))
}

/**
 * Contexto completo para handlers
 * Contiene toda la información necesaria para procesar una petición
 */
export interface HandlerContext {
  user: AuthContext['user']
  metrics: AuthContext['metrics']
  enrichedContext: RequestContext
  requestId: string
  startTime: number
}

/**
 * Calcula el tamaño en bytes de un objeto, con fallback a estimación si falla JSON.stringify
 * Útil para calcular tamaños de datos que pueden tener referencias circulares
 */
export function calculateDataSize(
  data: unknown,
  fallbackEstimator: (data: unknown) => number,
  context: string
): number {
  try {
    // CORRECCIÓN: Validar que JSON.stringify() retorne un string válido antes de acceder a .length
    const jsonString = JSON.stringify(data)
    if (typeof jsonString !== 'string') {
      logger.warn(
        { data, context },
        'calculateDataSize: JSON.stringify() no retornó un string válido, usando fallbackEstimator'
      )
      // CORRECCIÓN: Validar que fallbackEstimator sea una función antes de llamarla
      if (typeof fallbackEstimator === 'function') {
        try {
          const fallbackResult = fallbackEstimator(data)
          // Validar que el resultado del fallback sea un número finito
          return Number.isFinite(fallbackResult) && fallbackResult >= 0 ? fallbackResult : 0
        } catch (fallbackError) {
          logger.warn(
            { error: fallbackError, context },
            'calculateDataSize: Error al ejecutar fallbackEstimator, usando 0'
          )
          return 0
        }
      } else {
        logger.warn(
          { fallbackEstimator, context },
          'calculateDataSize: fallbackEstimator no es una función, usando 0'
        )
        return 0
      }
    }
    // CORRECCIÓN: Validar que jsonString.length sea un número finito
    const safeLength = Number.isFinite(jsonString.length) && jsonString.length >= 0 ? jsonString.length : 0
    return safeLength
  } catch (error) {
    logger.warn(
      { error, context },
      'Error al calcular tamaño (posible referencia circular), usando estimación'
    )
    // CORRECCIÓN: Validar que fallbackEstimator sea una función antes de llamarla
    if (typeof fallbackEstimator === 'function') {
      try {
        const fallbackResult = fallbackEstimator(data)
        // Validar que el resultado del fallback sea un número finito
        return Number.isFinite(fallbackResult) && fallbackResult >= 0 ? fallbackResult : 0
      } catch (fallbackError) {
        logger.warn(
          { error: fallbackError, context },
          'calculateDataSize: Error al ejecutar fallbackEstimator en catch, usando 0'
        )
        return 0
      }
    } else {
      logger.warn(
        { fallbackEstimator, context },
        'calculateDataSize: fallbackEstimator no es una función en catch, usando 0'
      )
      return 0
    }
  }
}

/**
 * Estima el tamaño de versiones basándose en contenido
 * Usa longitud de strings + overhead estimado de 100 bytes por versión
 * CORRECCIÓN: Valida que versions no sea null/undefined antes de usar reduce
 */
export function estimateVersionsSize(versions: Array<{ content?: string | null; title?: string | null }>): number {
  // CORRECCIÓN: Validar que versions sea un array válido antes de usar reduce()
  if (!Array.isArray(versions)) {
    logger.warn(
      { versions },
      'estimateVersionsSize recibió versions inválido, retornando 0'
    )
    return 0
  }
  
  try {
    return versions.reduce((acc, v) => {
      // Validar que acc sea un número finito
      const safeAcc = Number.isFinite(acc) ? acc : 0
    
      // Validar que v sea un objeto válido antes de acceder a propiedades
      if (!v || typeof v !== 'object') {
        return safeAcc
      }
      
      // Validar que los length sean números finitos
      const contentLength = (typeof v?.content === 'string' && Number.isFinite(v.content.length)) ? v.content.length : 0
      const titleLength = (typeof v?.title === 'string' && Number.isFinite(v.title.length)) ? v.title.length : 0
      
      // Validar que contentLength y titleLength sean números finitos
      const safeContentLength = Number.isFinite(contentLength) && contentLength >= 0 ? contentLength : 0
      const safeTitleLength = Number.isFinite(titleLength) && titleLength >= 0 ? titleLength : 0
      
      const sum = safeAcc + safeContentLength + safeTitleLength + 100 // 100 bytes overhead
      
      // Validar que el resultado sea finito
      return Number.isFinite(sum) && sum >= 0 ? sum : safeAcc
    }, 0)
  } catch (error) {
    logger.warn(
      { error, versions },
      'estimateVersionsSize: Error al ejecutar reduce(), retornando 0'
    )
    return 0
  }
}

/**
 * Centraliza el cálculo de métricas, logging y alertas de performance
 * Reduce duplicación en todos los handlers
 * 
 * @param params - Parámetros para logging de métricas
 * @returns void (efecto secundario: logging y alertas)
 * 
 * @example
 * ```typescript
 * logOperationMetrics({
 *   requestId,
 *   operationType: 'version.restored',
 *   startTime,
 *   authMetrics,
 *   additionalMetrics: { restoreDuration, validationDuration },
 *   metadata: { noteId, versionId },
 *   enrichedContext,
 * })
 * ```
 */
export function logOperationMetrics(params: {
  requestId: string
  operationType: string
  startTime: number
  authMetrics: AuthContext['metrics']
  additionalMetrics?: Record<string, number>
  metadata?: Record<string, unknown>
  enrichedContext: RequestContext
}): void {
  const { requestId, operationType, startTime, authMetrics, additionalMetrics, metadata } = params
  
  const performanceMetrics = calculateEnhancedMetrics(startTime, {
    ...authMetrics,
    ...additionalMetrics,
  }, extractOperationContext(operationType))

  // Enviar alertas críticas a sistemas de monitoreo
  if (performanceMetrics.severity === PerformanceAlertLevel.CRITICAL) {
    sendPerformanceAlertsToMonitoring(performanceMetrics.alerts, {
      requestId,
      operation: operationType,
      ...metadata,
    })
  }

  logger.info(
    {
      requestId,
      metrics: performanceMetrics,
      ...metadata,
    },
    `Operación ${operationType} completada`
  )
}

/**
 * Crea una respuesta estándar con validación, optimización y headers
 * Centraliza el patrón común de construcción de respuestas
 * 
 * @param data - Datos de la respuesta
 * @param options - Opciones para la respuesta
 * @returns NextResponse optimizada con headers de tracing y CORS
 * 
 * @example
 * ```typescript
 * const response = createStandardResponse(
 *   { message: 'Éxito', note: restoredNote },
 *   {
 *     schema: restoreVersionResponseSchema,
 *     requestId,
 *     operationType: 'POST',
 *     startTime,
 *     compress: true,
 *     maxAge: 0,
 *     metadata: { noteId, versionId },
 *   }
 * )
 * ```
 */
export function createStandardResponse<T>(
  data: T,
  options: {
    schema?: z.ZodType<T>
    requestId: string
    operationType: string
    startTime: number
    compress?: boolean
    maxAge?: number
    metadata?: Record<string, unknown>
  }
): NextResponse {
  const { schema, requestId, operationType, startTime, compress, maxAge, metadata } = options

  // CORRECCIÓN: Validar que startTime sea un número finito antes de usar calculateDuration()
  const safeStartTime = Number.isFinite(startTime) ? startTime : Date.now()
  
  if (startTime !== safeStartTime) {
    // No loguear warning para evitar spam, pero usar valor seguro
  }

  // Validar respuesta si hay schema
  if (schema) {
    const validationResult = validateResponseData(
      schema,
      data,
      requestId,
      operationType,
      metadata
    )
    if (!validationResult.success) {
      return validationResult.error
    }
  }

  // Construir respuesta optimizada
  const response = createOptimizedResponse(data, {
    compress: compress ?? false,
    maxAge: maxAge ?? 0,
  })

  // Agregar headers de tracing y CORS
  return addTracingHeaders(
    addCorsHeaders(response),
    requestId,
    calculateDuration(safeStartTime)
  )
}

/**
 * Helper para ejecutar webhooks en background con configuración estándar
 * Reduce duplicación del patrón de runInBackgroundWithErrorHandling para webhooks
 * 
 * @param webhookFn - Función que ejecuta el webhook
 * @param context - Contexto para logging y manejo de errores
 * 
 * @example
 * ```typescript
 * runWebhookInBackground(
 *   () => triggerVersionRestoredWebhook(note, version),
 *   { noteId, versionId, operation: 'triggerVersionRestoredWebhook', requestId }
 * )
 * ```
 */
export function runWebhookInBackground(
  webhookFn: () => Promise<void>,
  context: { noteId: string; versionId?: string; operation: string; requestId: string }
): void {
  runInBackgroundWithErrorHandling(
    webhookFn,
    context,
    {
      maxRetries: BACKGROUND_OPERATION_CONFIG.MAX_RETRIES,
      baseDelay: BACKGROUND_OPERATION_CONFIG.BASE_DELAY_MS,
      backoffMultiplier: BACKGROUND_OPERATION_CONFIG.BACKOFF_MULTIPLIER,
      maxDelay: BACKGROUND_OPERATION_CONFIG.MAX_DELAY_MS,
    }
  )
}

/**
 * Crea una respuesta de error 404 estándar
 * 
 * @param resource - Nombre del recurso no encontrado
 * @param requestId - ID de la petición
 * @param duration - Duración de la operación
 * @returns NextResponse con error 404
 */
export function createNotFoundError(
  resource: string,
  requestId: string,
  duration: number
): NextResponse {
  require('./error-messages')
  
  return addTracingHeaders(
    addCorsHeaders(
      NextResponse.json(
        { error: `${resource} no encontrado` },
        { status: 404 }
      )
    ),
    requestId,
    duration
  )
}

/**
 * Crea una respuesta de error 400 estándar
 * 
 * @param message - Mensaje de error
 * @param requestId - ID de la petición
 * @param duration - Duración de la operación
 * @param details - Detalles adicionales del error (opcional)
 * @returns NextResponse con error 400
 */
export function createBadRequestError(
  message: string,
  requestId: string,
  duration: number,
  details?: unknown
): NextResponse {
  return addTracingHeaders(
    addCorsHeaders(
      NextResponse.json(
        {
          error: message,
          ...(details && { details }),
        },
        { status: 400 }
      )
    ),
    requestId,
    duration
  )
}

/**
 * Crea una respuesta de error 500 estándar
 * 
 * @param message - Mensaje de error
 * @param requestId - ID de la petición
 * @param duration - Duración de la operación
 * @returns NextResponse con error 500
 */
export function createInternalServerError(
  message: string,
  requestId: string,
  duration: number
): NextResponse {
  return addTracingHeaders(
    addCorsHeaders(
      NextResponse.json(
        { error: message },
        { status: 500 }
      )
    ),
    requestId,
    duration
  )
}

