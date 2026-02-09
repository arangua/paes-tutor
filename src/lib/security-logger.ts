/**
 * Logger especializado para eventos de seguridad
 */

import { logger } from './logger'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'

export interface SecurityEvent {
  type:
    | 'auth_failure'
    | 'auth_success'
    | 'rate_limit'
    | 'invalid_input'
    | 'unauthorized_access'
    | 'suspicious_activity'
  userId?: string
  ip?: string
  path?: string
  details?: Record<string, unknown>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Registra un evento de seguridad
 */
export function logSecurityEvent(event: SecurityEvent) {
  const logData = {
    security: true,
    type: event.type,
    userId: event.userId,
    ip: event.ip,
    path: event.path,
    severity: event.severity,
    timestamp: safeToISOString(new Date()),
    ...event.details,
  }

  // Usar nivel de log apropiado según severidad
  switch (event.severity) {
    case 'critical':
      logger.error(logData, `[SECURITY CRITICAL] ${event.type}`)
      break
    case 'high':
      logger.warn(logData, `[SECURITY HIGH] ${event.type}`)
      break
    case 'medium':
      logger.warn(logData, `[SECURITY MEDIUM] ${event.type}`)
      break
    case 'low':
      logger.info(logData, `[SECURITY LOW] ${event.type}`)
      break
  }
}

/**
 * Helper para obtener IP del request
 */
export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded ? forwarded.split(',')[0]?.trim() || 'unknown' : (realIp || 'unknown')
  return ip
}

// Constante para caracteres de control (RFC 20): 0x00-0x1F y 0x7F (DEL)
// Necesario para detectar caracteres de control maliciosos en seguridad
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS_RE = /[\x00-\x1F\x7F]/g

/**
 * Helper para detectar actividad sospechosa
 */
export function detectSuspiciousActivity(
  _ip: string,
  path: string,
  details: Record<string, unknown>
): boolean {
  // Detectar patrones sospechosos
  const suspiciousPatterns = [
    // Intentos de inyección SQL
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b)/gi,
    // Intentos de path traversal
    /\.\.\//g,
    // Intentos de XSS - detectar event handlers (onclick, onerror, etc.)
    /<script|javascript:|on\w+\s*[=:]|onclick|onerror|onload/gi,
    // Caracteres de control (intencional para seguridad)
    CONTROL_CHARS_RE,
  ]

  const pathLower = path.toLowerCase()
  const detailsStr = JSON.stringify(details).toLowerCase()

  return suspiciousPatterns.some(pattern => pattern.test(pathLower) || pattern.test(detailsStr))
}
