/**
 * Sistema de auditoría mejorado
 * Registra operaciones sensibles con información detallada
 */

import { logger } from '@/lib/logger'
import type { RequestContext } from './request-context'
import { safeToISOString } from './validation-utils'

/**
 * Tipos de eventos de auditoría
 */
export type AuditEventType =
  | 'version.restored'
  | 'version.deleted'
  | 'version.bulk_deleted'
  | 'version.metadata_updated'
  | 'version.queried'
  | 'version.limit_reached'
  | 'version.access_denied'
  | 'version.unauthorized_access_attempt' // guard:allow-secret

/**
 * Niveles de severidad de auditoría
 */
export type AuditSeverity = 'info' | 'warning' | 'error' | 'critical'

/**
 * Datos de auditoría
 */
export interface AuditData {
  eventType: AuditEventType
  severity: AuditSeverity
  context: RequestContext
  metadata?: Record<string, unknown>
  outcome: 'success' | 'failure' | 'partial'
  error?: Error
}

/**
 * Registra un evento de auditoría
 * CORRECCIÓN: Valida que context no sea null/undefined antes de acceder a propiedades
 */
export function auditLog(data: AuditData): void {
  // Validar que data no sea null/undefined
  if (!data || typeof data !== 'object') {
    return
  }
  
  const {
    eventType,
    severity,
    context,
    metadata = {},
    outcome,
    error,
  } = data

  // CORRECCIÓN: Validar que context no sea null/undefined antes de acceder a propiedades
  if (!context || typeof context !== 'object') {
    // Si context es inválido, usar valores por defecto
    const auditEntry = {
      timestamp: safeToISOString(new Date()),
      eventType: eventType || 'unknown',
      severity: severity || 'info',
      requestId: 'unknown',
      studentId: undefined,
      userId: undefined,
      clientIp: 'unknown',
      method: 'UNKNOWN',
      path: 'unknown',
      outcome: outcome || 'failure',
      ...metadata,
      ...(error && {
        error: {
          message: error?.message || 'Unknown error',
          name: error?.name || 'Error',
          stack: error?.stack,
        },
      }),
    }
    
    logger.warn(auditEntry, `[AUDIT] ${eventType || 'unknown'} - Context inválido`)
    return
  }

  const auditEntry = {
    timestamp: safeToISOString(new Date()),
    eventType,
    severity,
    requestId: context.requestId || 'unknown',
    studentId: context.studentId,
    userId: context.userId,
    clientIp: context.clientIp || 'unknown',
    method: context.method || 'UNKNOWN',
    path: context.path || 'unknown',
    outcome,
    ...metadata,
    ...(error && {
      error: {
        message: error.message || 'Unknown error',
        name: error.name || 'Error',
        stack: error.stack,
      },
    }),
  }

  // Log según severidad
  switch (severity) {
    case 'critical':
    case 'error':
      logger.error(auditEntry, `[AUDIT] ${eventType}`)
      break
    case 'warning':
      logger.warn(auditEntry, `[AUDIT] ${eventType}`)
      break
    default:
      logger.info(auditEntry, `[AUDIT] ${eventType}`)
  }
}

/**
 * Helper para auditar operaciones sensibles
 */
export function auditSensitiveOperation(
  eventType: AuditEventType,
  context: RequestContext,
  options?: {
    severity?: AuditSeverity
    metadata?: Record<string, unknown>
    outcome?: 'success' | 'failure' | 'partial'
    error?: Error
  }
): void {
  auditLog({
    eventType,
    severity: options?.severity || 'info',
    context,
    metadata: options?.metadata,
    outcome: options?.outcome || 'success',
    error: options?.error,
  })
}

/**
 * Audita intentos de acceso no autorizado
 */
export function auditUnauthorizedAccess(
  context: RequestContext,
  reason: string,
  metadata?: Record<string, unknown>
): void {
  auditLog({
      eventType: 'version.unauthorized_access_attempt', // guard:allow-secret
    severity: 'warning',
    context,
    metadata: {
      reason,
      ...metadata,
    },
    outcome: 'failure',
  })
}

