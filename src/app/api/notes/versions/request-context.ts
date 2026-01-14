/**
 * Request Context para versiones
 * Proporciona un contexto compartido para toda la request
 */

import { NextRequest } from 'next/server'
import { randomBytes } from 'node:crypto'

/**
 * Contexto de request compartido
 */
export interface RequestContext {
  /** ID único de la request para trazabilidad */
  requestId: string
  /** Timestamp de inicio de la request */
  startTime: number
  /** IP del cliente */
  clientIp: string
  /** User agent */
  userAgent: string | null
  /** Método HTTP */
  method: string
  /** Path de la request */
  path: string
  /** Query parameters */
  queryParams: Record<string, string>
  /** Student ID si está autenticado */
  studentId?: string
  /** User ID si está autenticado */
  userId?: string
}

/**
 * Genera un Request ID único
 * CORRECCIÓN: Valida que Date.now() y randomBytes retornen valores válidos
 */
function generateRequestId(): string {
  const timestamp = Date.now()
  // Validar que timestamp sea un número finito
  const safeTimestamp = Number.isFinite(timestamp) ? timestamp : Date.now()
  
  try {
    const random = randomBytes(8)
    // Validar que random sea un Buffer válido
    if (Buffer.isBuffer(random)) {
      const hexString = random.toString('hex')
      // Validar que hexString sea un string válido
      if (typeof hexString === 'string' && hexString.length > 0) {
        return `req_${safeTimestamp}_${hexString}`
      }
    }
  } catch {
    // Si falla randomBytes, usar timestamp + número aleatorio
    const fallbackRandom = Math.floor(Math.random() * 1000000)
    return `req_${safeTimestamp}_${fallbackRandom}`
  }
  
  // Fallback final
  return `req_${safeTimestamp}_fallback`
}

/**
 * Extrae la IP del cliente de la request
 * CORRECCIÓN: Valida que request no sea null/undefined y que forwarded sea un string válido antes de usar split()
 */
function extractClientIp(request: NextRequest): string {
  // Validar que request no sea null/undefined
  if (!request || typeof request !== 'object') {
    return 'unknown'
  }
  
  try {
    const forwarded = request.headers.get('x-forwarded-for')
    // CORRECCIÓN: Validar que forwarded sea un string válido antes de usar split()
    if (forwarded && typeof forwarded === 'string' && forwarded.trim().length > 0) {
      const parts = forwarded.split(',')
      // Validar que parts sea un array válido y tenga al menos un elemento
      if (Array.isArray(parts) && parts.length > 0) {
        const firstPart = parts[0]
        if (typeof firstPart === 'string') {
          const trimmed = firstPart.trim()
          if (trimmed.length > 0) {
            return trimmed
          }
        }
      }
    }
    
    const realIp = request.headers.get('x-real-ip')
    // Validar que realIp sea un string válido
    if (realIp && typeof realIp === 'string' && realIp.trim().length > 0) {
      return realIp.trim()
    }
  } catch {
    // Si falla al acceder a headers, retornar 'unknown'
    return 'unknown'
  }
  
  return 'unknown'
}

/**
 * Crea un contexto de request desde una NextRequest
 * CORRECCIÓN: Valida que request no sea null/undefined y que Date.now() retorne un valor válido
 */
export function createRequestContext(request: NextRequest): RequestContext {
  // Validar que request no sea null/undefined
  if (!request || typeof request !== 'object') {
    // Retornar contexto por defecto si request es inválido
    return {
      requestId: generateRequestId(),
      startTime: Date.now(),
      clientIp: 'unknown',
      userAgent: null,
      method: 'UNKNOWN',
      path: 'unknown',
      queryParams: {},
    }
  }
  
  try {
    const url = new URL(request.url)
    const startTime = Date.now()
    // Validar que startTime sea un número finito
    const safeStartTime = Number.isFinite(startTime) ? startTime : Date.now()
    
    const requestIdHeader = request.headers.get('x-request-id')
    const requestId = requestIdHeader && typeof requestIdHeader === 'string' && requestIdHeader.trim().length > 0
      ? requestIdHeader.trim()
      : generateRequestId()
    
    return {
      requestId,
      startTime: safeStartTime,
      clientIp: extractClientIp(request),
      userAgent: request.headers.get('user-agent'),
      method: request.method || 'UNKNOWN',
      path: url.pathname || 'unknown',
      queryParams: Object.fromEntries(url.searchParams.entries()),
    }
  } catch {
    // Si falla al crear contexto, retornar contexto por defecto
    return {
      requestId: generateRequestId(),
      startTime: Date.now(),
      clientIp: 'unknown',
      userAgent: null,
      method: 'UNKNOWN',
      path: 'unknown',
      queryParams: {},
    }
  }
}

/**
 * Enriquece el contexto con información de autenticación
 */
export function enrichContextWithAuth(
  context: RequestContext,
  studentId?: string,
  userId?: string
): RequestContext {
  return {
    ...context,
    studentId,
    userId,
  }
}

/**
 * Obtiene el contexto de request del header o genera uno nuevo
 */
export function getOrCreateRequestId(request: NextRequest): string {
  return request.headers.get('x-request-id') || generateRequestId()
}

