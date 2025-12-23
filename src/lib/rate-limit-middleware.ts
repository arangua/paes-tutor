import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimit } from './rate-limit'
import { logger } from './logger'

export type RateLimitType = 'general' | 'auth' | 'read' | 'write' | 'sensitive'

export async function withRateLimit(
  request: NextRequest,
  handler: () => Promise<NextResponse>,
  type: RateLimitType = 'general'
) {
  // Obtener identificador (IP o userId)
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown'

  // Intentar obtener userId de la sesión si está disponible
  const identifier = ip

  try {
    let result
    switch (type) {
      case 'auth':
        result = await apiRateLimit.auth(identifier)
        break
      case 'read':
        result = await apiRateLimit.read(identifier)
        break
      case 'write':
        result = await apiRateLimit.write(identifier)
        break
      case 'sensitive':
        result = await apiRateLimit.sensitive(identifier)
        break
      default:
        result = await apiRateLimit.general(identifier)
    }

    if (!result.success) {
      logger.warn(
        {
          type: 'rate_limit_exceeded',
          identifier,
          path: request.nextUrl.pathname,
          limit: result.limit,
        },
        'Rate limit exceeded'
      )

      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Por favor, intenta más tarde.',
          retryAfter: Math.ceil((result.reset - Date.now()) / 1000),
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((result.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(result.limit),
            'X-RateLimit-Remaining': String(result.remaining),
            'X-RateLimit-Reset': String(result.reset),
          },
        }
      )
    }

    // Ejecutar el handler
    const response = await handler()

    // Agregar headers de rate limit
    response.headers.set('X-RateLimit-Limit', String(result.limit))
    response.headers.set('X-RateLimit-Remaining', String(result.remaining))
    response.headers.set('X-RateLimit-Reset', String(result.reset))

    return response
  } catch (error) {
    logger.error(
      {
        type: 'rate_limit_error',
        error: error instanceof Error ? error.message : String(error),
      },
      'Rate limit error'
    )

    // En caso de error, permitir la request pero loguear
    return handler()
  }
}
