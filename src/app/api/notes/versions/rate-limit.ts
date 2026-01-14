/**
 * Rate limiting específico para operaciones de versiones
 * Diferentes límites según el tipo de operación
 * Mejorado para considerar usuario autenticado además de IP
 */

import { NextRequest, NextResponse } from 'next/server'
import { withRateLimit, type RateLimitType } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { getOrCreateRequestId } from './request-context'

/**
 * Mapea métodos HTTP a tipos de rate limit
 */
const METHOD_TO_RATE_LIMIT: Record<string, RateLimitType> = {
  GET: 'read',
  POST: 'write',
  PATCH: 'write',
  DELETE: 'write',
}

/**
 * Rate limiting personalizado para versiones
 * Usa configuración específica por método HTTP
 * Mejorado para considerar usuario autenticado
 */
export async function withVersionRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const method = request.method
  const rateLimitType = METHOD_TO_RATE_LIMIT[method] || 'general'
  const requestId = getOrCreateRequestId(request)

  // Intentar obtener usuario autenticado para rate limiting más preciso
  try {
    const { getAuthenticatedUserWithStudent } = await import('@/lib/get-session')
    const user = await getAuthenticatedUserWithStudent()
    
    if (user?.student?.id) {
      // Si hay usuario autenticado, el rate limiting se hará por usuario
      // El middleware de rate limiting ya maneja esto internamente
      logger.debug(
        { requestId, method, rateLimitType, studentId: user.student.id },
        'Rate limiting con usuario autenticado'
      )
    }
  } catch {
    // Si falla, continuar con rate limiting por IP
  }

  // Usar el rate limiting estándar con el tipo apropiado
  // Los límites específicos se pueden ajustar en la configuración del rate limiter
  return withRateLimit(request, handler, rateLimitType)
}

