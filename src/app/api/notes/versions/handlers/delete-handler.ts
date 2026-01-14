import { NextRequest, NextResponse } from 'next/server'
import { logger } from '@/lib/logger'
import { getOrCreateRequestId } from '../request-context'
import { addTracingHeaders } from '../response-helpers'
import { deleteVersionResponseSchema } from '../response-schemas'
import { auditSensitiveOperation } from '../audit'
import { trackVersionMetric } from '../metrics-tracker'
import { calculateEnhancedMetrics, sendPerformanceAlertsToMonitoring } from '../performance-monitor'
import {
  deleteVersionSchema,
  deleteVersionsBulkSchema,
} from '../validators'
import {
  executeBulkDeleteOperation,
  executeSingleDeleteOperation,
} from '../queries'
import {
  validateNoteForDeletion,
  parseRequestBody,
  withAuthContext,
  validateWithSchema,
  handleHandlerError,
  validateResponseData,
  createStandardResponse,
  createBadRequestError,
  calculateDuration,
} from '../helpers'
import { ERROR_MESSAGES } from '../error-messages'
import { RESPONSE_CONFIG } from '../config'
import type { Result, AuthContext, NoteForDeletion } from '../types'
import type { RequestContext } from '../request-context'
import { z } from 'zod'

/**
 * Verifica si un valor es un string
 */
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Verifica si un valor es un array de strings no vacío
 * CORRECCIÓN: Valida que todos los elementos sean strings, no solo el primero
 */
function isStringArray(value: unknown): value is string[] {
  if (!Array.isArray(value) || value.length === 0) {
    return false
  }
  
  // CORRECCIÓN: Validar que value sea un array válido antes de usar every()
  try {
    const allStrings = value.every(item => {
      // Validar que isString() retorne un booleano válido
      const isStr = isString(item)
      return typeof isStr === 'boolean' ? isStr : false
    })
    
    // Validar que every() retorne un booleano válido
    return typeof allStrings === 'boolean' ? allStrings : false
  } catch (error) {
    logger.warn(
      { error, value },
      'isStringArray: Error al ejecutar every(), retornando false'
    )
    return false
  }
}

/**
 * Type guard mejorado para verificar si los datos validados son de tipo bulk delete
 * Valida que versionIds existe, es un array y tiene al menos un elemento
 */
export function isBulkDeleteData(
  data: z.infer<typeof deleteVersionsBulkSchema> | z.infer<typeof deleteVersionSchema>
): data is z.infer<typeof deleteVersionsBulkSchema> {
  return (
    'versionIds' in data &&
    isStringArray(data.versionIds)
  )
}

/**
 * Type guard mejorado para verificar si los datos validados son de tipo single delete
 * Valida que versionId existe, es string y versionIds no existe
 */
function isSingleDeleteData(
  data: z.infer<typeof deleteVersionsBulkSchema> | z.infer<typeof deleteVersionSchema>
): data is z.infer<typeof deleteVersionSchema> {
  return (
    'versionId' in data &&
    isString(data.versionId) &&
    !('versionIds' in data)
  )
}

/**
 * Helper para parsear y validar request de eliminación
 * Soporta eliminación individual (query params o body) y eliminación en lote (body)
 * 
 * @param request - NextRequest con query params o body JSON
 * @returns Result con datos validados o error
 */
async function parseAndValidateDeleteRequest(
  request: NextRequest
): Promise<Result<{
  noteId: string
  isBulk: boolean
  versionCount: number
  validationData: z.infer<typeof deleteVersionsBulkSchema> | z.infer<typeof deleteVersionSchema>
  parseDuration: number
  validationDuration: number
}>> {
  const { searchParams } = new URL(request.url)
  const parseStartTime = Date.now()
  const bodyResult = await parseRequestBody<Record<string, unknown>>(request, 'DELETE', true)
  
  if (!bodyResult.success) {
    return bodyResult
  }
  const parseDuration = calculateDuration(parseStartTime)

  const body = bodyResult.data
  
  const validationStartTime = Date.now()
  // Primero intentar validar como bulk si hay versionIds
  let validation
  if (isStringArray(body.versionIds)) {
    validation = validateWithSchema(deleteVersionsBulkSchema, body)
  } else {
    // Si no es bulk, combinar query params con body para single delete
    const combinedData = { ...Object.fromEntries(searchParams.entries()), ...body }
    validation = validateWithSchema(deleteVersionSchema, combinedData)
  }

  if (!validation.success) {
    return validation
  }
  const validationDuration = calculateDuration(validationStartTime)

  // Determinar isBulk después de validación exitosa
  const isBulk = isBulkDeleteData(validation.data)
  
  // Extraer noteId y versionCount de forma type-safe usando type guard
  const noteId = validation.data.noteId
  const versionCount = isBulk
    ? validation.data.versionIds.length
    : 1

  return {
    success: true,
    data: {
      noteId,
      isBulk,
      versionCount,
      validationData: validation.data,
      parseDuration,
      validationDuration,
    },
  }
}

/**
 * Helper para ejecutar eliminación en lote
 * Ejecuta la operación y retorna datos para validación antes de construir respuesta
 * 
 * @param note - Nota para eliminación
 * @param validationData - Datos validados con deleteVersionsBulkSchema
 * @returns Result con datos de respuesta o error
 */
async function executeBulkDelete(
  note: NoteForDeletion,
  validationData: z.infer<typeof deleteVersionsBulkSchema>
): Promise<Result<{ message: string; deletedCount: number }>> {
  return await executeBulkDeleteOperation(note.id, validationData.versionIds, note)
}

/**
 * Helper para ejecutar eliminación individual
 * Ejecuta la operación y retorna datos para validación antes de construir respuesta
 * 
 * @param note - Nota para eliminación
 * @param validationData - Datos validados con deleteVersionSchema
 * @returns Result con datos de respuesta o error
 */
async function executeSingleDelete(
  note: NoteForDeletion,
  validationData: z.infer<typeof deleteVersionSchema>
): Promise<Result<{ message: string }>> {
  return await executeSingleDeleteOperation(note.id, validationData.versionId, note)
}

/**
 * Construye mensaje de eliminación según si es bulk o individual
 */
function buildDeleteMessage(isBulk: boolean): string {
  return isBulk 
    ? 'Versiones eliminadas exitosamente'
    : 'Versión eliminada exitosamente'
}

/**
 * Helper para logging y auditoría de operaciones de eliminación
 * Centraliza el logging y auditoría para mantener consistencia
 * 
 * @param params - Parámetros de la operación de eliminación
 */
function logDeleteOperation(params: {
  requestId: string
  noteId: string
  isBulk: boolean
  versionCount: number
  enrichedContext: RequestContext
  startTime: number
  authMetrics: AuthContext['metrics']
  parseDuration: number
  validationDuration: number
  noteDuration: number
  deleteDuration: number
}): void {
  const {
    requestId,
    noteId,
    isBulk,
    versionCount,
    enrichedContext,
    startTime,
    authMetrics,
    parseDuration,
    validationDuration,
    noteDuration,
    deleteDuration,
  } = params
  
  const operationType = isBulk ? 'version.bulk_deleted' : 'version.deleted'
  const logMessage = buildDeleteMessage(isBulk)

  // Trackear métrica de uso (consistente con otros métodos)
  trackVersionMetric(operationType, {
    noteId,
    ...(isBulk ? { deletedCount: versionCount } : {}),
  })

  auditSensitiveOperation(operationType, enrichedContext, {
    severity: 'info',
    metadata: { noteId, isBulk, versionCount },
  })

  // Calcular y loguear métricas de performance mejoradas
  const performanceMetrics = calculateEnhancedMetrics(startTime, {
    ...authMetrics,
    parseDuration,
    validationDuration,
    noteDuration,
    deleteDuration,
  }, 'DELETE')

  // Enviar alertas críticas a sistemas de monitoreo
  if (performanceMetrics.severity === 'critical') {
    sendPerformanceAlertsToMonitoring(performanceMetrics.alerts, {
      requestId,
      noteId,
      isBulk,
      versionCount,
      operation: 'DELETE',
    })
  }

  logger.info(
    {
      requestId,
      noteId,
      isBulk,
      versionCount,
      metrics: performanceMetrics,
    },
    logMessage
  )
}

/**
 * DELETE: Eliminar versión(es) de una nota
 * 
 * Permite eliminar una versión individual o múltiples versiones en lote.
 * Soporta eliminación individual mediante query params o body, y eliminación en lote mediante body.
 * 
 * @param request - NextRequest con query params o body JSON
 * @returns NextResponse con confirmación de eliminación
 */
export async function handleDeleteRequest(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    // Autenticación, contexto enriquecido y request ID
    const authContextResult = await withAuthContext(request, startTime)
    if (!authContextResult.success) {
      const requestId = getOrCreateRequestId(request)
      return addTracingHeaders(authContextResult.error, requestId, calculateDuration(startTime))
    }

    const { user: dbUser, metrics: authMetrics, enrichedContext, requestId } = authContextResult.data

    // Parsear y validar request
    const parseValidationResult = await parseAndValidateDeleteRequest(request)
    if (!parseValidationResult.success) {
      return parseValidationResult.error
    }

    const {
      noteId,
      isBulk,
      versionCount,
      validationData,
      parseDuration,
      validationDuration,
    } = parseValidationResult.data

    // Validar que la nota pertenece al estudiante
    const noteStartTime = Date.now()
    const noteResult = await validateNoteForDeletion(noteId, dbUser.student.id)
    if (!noteResult.success) {
      return noteResult.error
    }

    const { note } = noteResult
    const noteDuration = calculateDuration(noteStartTime)

    // Ejecutar eliminación con type-safe guard (mejorado: sin cast innecesario)
    const deleteStartTime = Date.now()
    let deleteResult: Result<{ message: string; deletedCount?: number }>
    
    if (isBulk && isBulkDeleteData(validationData)) {
      deleteResult = await executeBulkDelete(note, validationData)
    } else if (isSingleDeleteData(validationData)) {
      // Type guard: confirma que es deleteVersionSchema (tiene versionId pero no versionIds)
      deleteResult = await executeSingleDelete(note, validationData)
    } else {
      // Esto no debería pasar si la validación es correcta, pero es una verificación de seguridad
      logger.error(
        { noteId, validationData, isBulk },
        'Error de tipo: validationData no tiene versionId ni versionIds'
      )
      return createBadRequestError(
        ERROR_MESSAGES.INVALID_DATA,
        requestId,
        calculateDuration(startTime)
      )
    }
    const deleteDuration = calculateDuration(deleteStartTime)
    
    // Verificar si la eliminación fue exitosa
    if (!deleteResult.success) {
      return deleteResult.error
    }

    const responseData = deleteResult.data

    // Nota: La invalidación de caché se realiza en executeBulkDeleteOperation/executeSingleDeleteOperation
    // para mantener consistencia y evitar race conditions. Se hace en background (no bloqueante).

    // Validar respuesta contra schema (antes de enviar)
    const responseValidationResult = validateResponseData(
      deleteVersionResponseSchema,
      responseData,
      requestId,
      'DELETE',
      { noteId, isBulk, versionCount }
    )
    if (!responseValidationResult.success) {
      // Si la validación falla, retornar error
      return responseValidationResult.error
    }

    // Logging y auditoría
    logDeleteOperation({
      requestId,
      noteId,
      isBulk,
      versionCount,
      enrichedContext,
      startTime,
      authMetrics,
      parseDuration,
      validationDuration,
      noteDuration,
      deleteDuration,
    })

    // Usar helper estándar para crear respuesta
    return createStandardResponse(responseData, {
      schema: deleteVersionResponseSchema,
      requestId,
      operationType: 'DELETE',
      startTime,
      compress: false, // Las respuestas DELETE son pequeñas
      maxAge: RESPONSE_CONFIG.WRITE_RESPONSE.maxAge,
      metadata: { noteId, isBulk, versionCount },
    })
  } catch (error) {
    return handleHandlerError(error, request, 'version.deleted', startTime)
  }
}

