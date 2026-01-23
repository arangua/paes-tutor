import { NextRequest, NextResponse } from 'next/server'
import { getOrCreateRequestId } from '../request-context'
import { addTracingHeaders } from '../response-helpers'
import { restoreVersionResponseSchema } from '../response-schemas'
import { auditSensitiveOperation } from '../audit'
import { handleIdempotency } from '../idempotency'
import {
  restoreVersionSchema,
} from '../validators'
import {
  executeRestoreTransaction,
} from '../queries'
import {
  validateNoteAndVersionForRestore,
  createRestoreNotifications,
  parseRequestBody,
  withAuthContext,
  validateWithSchema,
  postOperationCleanup,
  handleHandlerError,
  createStandardResponse,
  runWebhookInBackground,
  runInBackgroundWithErrorHandling,
  logOperationMetrics,
  createInternalServerError,
  calculateDuration,
} from '../helpers'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../error-messages'
import { RESPONSE_CONFIG, BACKGROUND_OPERATION_CONFIG } from '../config'
import type { AuthContext } from '../types'
import type { RequestContext } from '../request-context'
import { triggerVersionRestoredWebhook } from '../webhooks'

/**
 * POST: Restaurar una versión de nota
 * 
 * Restaura el contenido de una versión histórica, reemplazando el contenido actual de la nota.
 * Antes de restaurar, crea automáticamente una nueva versión con el contenido actual como backup.
 * 
 * @param request - NextRequest con body JSON
 * @returns NextResponse con nota restaurada
 */
export async function handlePostRequest(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  
  try {
    // Autenticación, contexto enriquecido y request ID (consistente con otros métodos)
    const authContextResult = await withAuthContext(request, startTime)
    if (!authContextResult.success) {
      const requestId = getOrCreateRequestId(request)
      return addTracingHeaders(authContextResult.error, requestId, calculateDuration(startTime))
    }

    const { user: dbUser, metrics: authMetrics, enrichedContext, requestId } = authContextResult.data

    // Manejar idempotency (después de autenticación)
    return handleIdempotency(request, dbUser.student.id, async () => {
      return executePostRequest(request, dbUser, enrichedContext, startTime, requestId, authMetrics)
    })
  } catch (error) {
    return handleHandlerError(error, request, 'version.restored', startTime)
  }
}

async function executePostRequest(
  request: NextRequest, 
  dbUser: AuthContext['user'], 
  enrichedContext: RequestContext, 
  startTime: number, 
  requestId: string, 
  authMetrics: AuthContext['metrics']
): Promise<NextResponse> {
  // Parsear body JSON
  const parseStartTime = Date.now()
  const bodyResult = await parseRequestBody(request, 'POST')
  if (!bodyResult.success) {
    return bodyResult.error
  }
  const parseDuration = calculateDuration(parseStartTime)

  // Validar con schema
  const validationStartTime = Date.now()
  const validation = validateWithSchema(restoreVersionSchema, bodyResult.data)
  if (!validation.success) {
    return validation.error
  }

  const { noteId, versionId } = validation.data
  const validationDuration = calculateDuration(validationStartTime)

  // NOTA: La validación del límite se hace dentro de la transacción para prevenir race conditions
  // Se eliminó la validación previa redundante que no garantizaba atomicidad

  // Validar y obtener nota y versión para restauración
  // Nota: validateNoteAndVersionForRestore ya valida que la nota pertenece al estudiante
  const versionValidationStartTime = Date.now()
  const validationResult = await validateNoteAndVersionForRestore(
    noteId,
    versionId,
    dbUser.student.id
  )
  if (!validationResult.success) {
    return validationResult.error
  }

  const { noteFull, version } = validationResult.data
  const versionValidationDuration = calculateDuration(versionValidationStartTime)

  // Ejecutar transacción de restauración
  // NOTA: La validación del límite se hace dentro de la transacción para prevenir race conditions
  const restoreStartTime = Date.now()
  let restoredNote
  try {
    restoredNote = await executeRestoreTransaction(
      noteId,
      noteFull,
      version,
      dbUser.student.id
    )
  } catch (error) {
    // Manejar error de límite de versiones lanzado desde dentro de la transacción
    if (error instanceof Error && error.message.includes('límite máximo')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    // Para otros errores, relanzar para que se manejen en el catch del handler principal
    throw error
  }
  const restoreDuration = calculateDuration(restoreStartTime)

  if (!restoredNote) {
    return createInternalServerError(
      ERROR_MESSAGES.RESTORE_ERROR,
      requestId,
      calculateDuration(startTime)
    )
  }

  // Estandarizar orden: operación → invalidar caché → trackear métricas → logging
  // Usar helper para mantener consistencia
  postOperationCleanup(noteId, 'version.restored', {
    versionId,
    studentId: dbUser.student.id,
  })

  // Disparar webhooks en background usando helper estándar
  runWebhookInBackground(
    () => triggerVersionRestoredWebhook({ id: noteFull.id, title: noteFull.title }, version),
    { noteId, versionId, operation: 'triggerVersionRestoredWebhook', requestId }
  )

  // Crear notificaciones automáticas en background (no bloqueante) con retry y mejor manejo de errores
  runInBackgroundWithErrorHandling(
    () => createRestoreNotifications(dbUser.student.id, { id: noteFull.id, title: noteFull.title }),
    { noteId, studentId: dbUser.student.id, operation: 'createRestoreNotifications', requestId },
    {
      maxRetries: BACKGROUND_OPERATION_CONFIG.MAX_RETRIES,
      baseDelay: BACKGROUND_OPERATION_CONFIG.BASE_DELAY_MS,
      backoffMultiplier: BACKGROUND_OPERATION_CONFIG.BACKOFF_MULTIPLIER,
      maxDelay: BACKGROUND_OPERATION_CONFIG.MAX_DELAY_MS,
    }
  )

  // Auditar operación sensible
  auditSensitiveOperation('version.restored', enrichedContext, {
    severity: 'info',
    metadata: { noteId, versionId },
  })

  // Usar helper centralizado para logging y métricas
  logOperationMetrics({
    requestId,
    operationType: 'version.restored',
    startTime,
    authMetrics,
    additionalMetrics: {
      parseDuration,
      validationDuration,
      versionValidationDuration,
      restoreDuration,
    },
    metadata: { noteId, versionId },
    enrichedContext,
  })

  const responseData = {
    message: SUCCESS_MESSAGES.VERSION_RESTORED,
    note: restoredNote,
  }

  // Usar helper estándar para crear respuesta
  return createStandardResponse(responseData, {
    schema: restoreVersionResponseSchema,
    requestId,
    operationType: 'POST',
    startTime,
    compress: RESPONSE_CONFIG.WRITE_RESPONSE.compress,
    maxAge: RESPONSE_CONFIG.WRITE_RESPONSE.maxAge,
    metadata: { noteId, versionId },
  })
}

