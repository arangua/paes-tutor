import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateRequestId } from '../request-context'
import { addTracingHeaders } from '../response-helpers'
import { updateVersionResponseSchema } from '../response-schemas'
import { auditSensitiveOperation } from '../audit'
import {
  updateVersionMetadataSchema,
} from '../validators'
import {
  prepareUpdateData,
  updateVersionInDatabase,
} from '../queries'
import {
  validateNoteAndVersionForUpdate,
  parseRequestBody,
  withAuthContext,
  validateWithSchema,
  postOperationCleanup,
  handleHandlerError,
  createStandardResponse,
  logOperationMetrics,
  runWebhookInBackground,
  calculateDuration,
} from '../helpers'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../error-messages'
import { RESPONSE_CONFIG } from '../config'
import { triggerVersionUpdateWebhooks } from '../webhooks'

/**
 * Construye objeto de metadatos de actualización para logging y auditoría
 * CORRECCIÓN: Valida que los parámetros no sean null/undefined antes de usar !!
 */
function buildUpdateMetadata(name?: string | null, color?: string | null, isImportant?: boolean): {
  name: boolean
  color: boolean
  isImportant: boolean
} {
  // Validar que name sea un string no vacío
  const hasName = name !== null && name !== undefined && typeof name === 'string' && name.trim().length > 0
  
  // Validar que color sea un string no vacío
  const hasColor = color !== null && color !== undefined && typeof color === 'string' && color.trim().length > 0
  
  // Validar que isImportant sea un booleano definido
  const hasIsImportant = isImportant !== undefined && typeof isImportant === 'boolean'
  
  return {
    name: hasName,
    color: hasColor,
    isImportant: hasIsImportant,
  }
}

/**
 * PATCH: Actualizar metadata de una versión (nombre, color, importancia)
 * 
 * Permite actualizar los metadatos de una versión histórica sin modificar su contenido.
 * Los campos opcionales permiten actualizar solo los valores deseados.
 * 
 * @param request - NextRequest con body JSON
 * @returns NextResponse con versión actualizada
 */
export async function handlePatchRequest(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    // Autenticación, contexto enriquecido y request ID
    const authContextResult = await withAuthContext(request, startTime)
    if (!authContextResult.success) {
      const requestId = getOrCreateRequestId(request)
      return addTracingHeaders(authContextResult.error, requestId, calculateDuration(startTime))
    }

    const { user: dbUser, metrics: authMetrics, enrichedContext, requestId } = authContextResult.data

    // Parsear body JSON
    const parseStartTime = Date.now()
    const bodyResult = await parseRequestBody(request, 'PATCH')
    if (!bodyResult.success) {
      return bodyResult.error
    }
    const parseDuration = calculateDuration(parseStartTime)

    // Validar con schema
    const validationStartTime = Date.now()
    const validation = validateWithSchema(updateVersionMetadataSchema, bodyResult.data)
    if (!validation.success) {
      return validation.error
    }

    const { noteId, versionId, name, color, isImportant } = validation.data
    const validationDuration = calculateDuration(validationStartTime)

    // Construir metadatos de actualización una sola vez
    const updates = buildUpdateMetadata(name, color, isImportant)

    // Validar y obtener nota y versión
    const noteValidationStartTime = Date.now()
    const validationResult = await validateNoteAndVersionForUpdate(
      noteId,
      versionId,
      dbUser.student.id
    )

    if (!validationResult.success) {
      return validationResult.error
    }

    const { note } = validationResult
    const noteValidationDuration = calculateDuration(noteValidationStartTime)

    // Preparar datos de actualización
    const updateData = prepareUpdateData({ name, color, isImportant })

    // Actualizar en base de datos (con validación defensiva de autorización)
    const updateStartTime = Date.now()
    const updatedVersion = await updateVersionInDatabase(versionId, note.id, updateData, dbUser.student.id)
    const updateDuration = calculateDuration(updateStartTime)

    if (!updatedVersion) {
      return NextResponse.json({ error: ERROR_MESSAGES.NO_CHANGES_MADE }, { status: 404 })
    }

    // Estandarizar orden: operación → invalidar caché → trackear métricas → logging
    // Usar helper para mantener consistencia
    postOperationCleanup(noteId, 'version.metadata_updated', {
      versionId,
      updates,
    })

    // Disparar webhooks en background usando helper estándar
    runWebhookInBackground(
      () => triggerVersionUpdateWebhooks(note, updatedVersion, { name, color, isImportant }),
      { noteId, versionId, operation: 'triggerVersionUpdateWebhooks', requestId }
    )

    // Auditar operación sensible
    auditSensitiveOperation('version.metadata_updated', enrichedContext, {
      severity: 'info',
      metadata: { noteId, versionId, updates },
    })

    // Usar helper centralizado para logging y métricas
    logOperationMetrics({
      requestId,
      operationType: 'version.metadata_updated',
      startTime,
      authMetrics,
      additionalMetrics: {
        parseDuration,
        validationDuration,
        noteValidationDuration,
        updateDuration,
      },
      metadata: { 
        noteId, 
        versionId,
        updates,
      },
      enrichedContext,
    })

    const responseData = {
      message: SUCCESS_MESSAGES.VERSION_UPDATED,
      version: updatedVersion,
    }

    // Usar helper estándar para crear respuesta
    return createStandardResponse(responseData, {
      schema: updateVersionResponseSchema,
      requestId,
      operationType: 'PATCH',
      startTime,
      compress: RESPONSE_CONFIG.WRITE_RESPONSE.compress,
      maxAge: RESPONSE_CONFIG.WRITE_RESPONSE.maxAge,
      metadata: { noteId, versionId },
    })
  } catch (error) {
    return handleHandlerError(error, request, 'version.metadata_updated', startTime)
  }
}

