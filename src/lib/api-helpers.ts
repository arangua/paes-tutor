import { NextRequest, NextResponse } from 'next/server'
import { ZodError, ZodSchema } from 'zod'
import { logger, logApiError } from './logger'
import { sanitizeString, containsDangerousPatterns, sanitizeObject } from './security'
import { logSecurityEvent, getClientIp, detectSuspiciousActivity } from './security-logger'

/**
 * Valida los parámetros de la query string
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): { success: true; data: T } | { success: false; error: NextResponse } {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())

    // Sanitizar valores de string en params
    const sanitizedParams: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        sanitizedParams[key] = sanitizeString(value)

        // Detectar patrones peligrosos
        if (containsDangerousPatterns(value)) {
          const ip = getClientIp(request)
          logSecurityEvent({
            type: 'suspicious_activity',
            ip,
            path: request.nextUrl.pathname,
            details: { key, value: value.substring(0, 100) },
            severity: 'high',
          })

          return {
            success: false,
            error: NextResponse.json({ error: 'Parámetros inválidos detectados' }, { status: 400 }),
          }
        }
      } else {
        sanitizedParams[key] = value
      }
    }

    const data = schema.parse(sanitizedParams)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Parámetros inválidos',
            details: error.issues,
          },
          { status: 400 }
        ),
      }
    }
    return {
      success: false,
      error: NextResponse.json({ error: 'Error de validación' }, { status: 400 }),
    }
  }
}

/**
 * Valida el body de la request
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      const ip = getClientIp(request)
      logSecurityEvent({
        type: 'invalid_input',
        ip,
        path: request.nextUrl.pathname,
        details: { error: 'JSON inválido' },
        severity: 'medium',
      })

      return {
        success: false,
        error: NextResponse.json({ error: 'Body inválido o no es JSON válido' }, { status: 400 }),
      }
    }

    // Sanitizar body si contiene strings
    if (typeof body === 'object' && body !== null) {
      const sanitizedBody = sanitizeObject(body as Record<string, unknown>)

      // Detectar actividad sospechosa
      const ip = getClientIp(request)
      if (detectSuspiciousActivity(ip, request.nextUrl.pathname, sanitizedBody)) {
        logSecurityEvent({
          type: 'suspicious_activity',
          ip,
          path: request.nextUrl.pathname,
          details: { body: JSON.stringify(sanitizedBody).substring(0, 200) },
          severity: 'high',
        })
      }

      body = sanitizedBody
    }

    const data = schema.parse(body)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Datos inválidos',
            details: error.issues,
          },
          { status: 400 }
        ),
      }
    }
    return {
      success: false,
      error: NextResponse.json({ error: 'Error de validación' }, { status: 400 }),
    }
  }
}

/**
 * Parsea JSON de forma segura con logging estructurado
 * Útil para manejar errores de parsing JSON en respuestas de API
 * Funciona tanto en cliente como en servidor
 * 
 * @example
 * const errorData = await safeJsonParse<{ error?: string }>(res, {
 *   path: '/api/user',
 *   operation: 'actualizar usuario',
 * })
 */
export async function safeJsonParse<T = Record<string, unknown>>(
  response: Response,
  context?: { path?: string; operation?: string }
): Promise<T> {
  try {
    return await response.json()
  } catch (error) {
    // Usar logger estructurado si está disponible (servidor), sino console.warn (cliente)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const logData = {
      type: 'json_parse_error',
      path: context?.path,
      operation: context?.operation,
      error: errorMessage,
      status: response.status,
      statusText: response.statusText,
    }

    // Intentar usar logger estructurado (solo en servidor)
    try {
      if (typeof window === 'undefined') {
        logger.warn(logData, 'Error al parsear JSON de respuesta')
      } else {
        // En cliente, usar console.warn solo en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error al parsear JSON de respuesta:', logData)
        }
      }
    } catch {
      // Si logger falla, usar console como fallback
      if (process.env.NODE_ENV === 'development') {
        console.warn('Error al parsear JSON de respuesta:', errorMessage, context)
      }
    }

    return {} as T
  }
}

/**
 * Maneja errores de forma consistente
 */
export function handleApiError(
  error: unknown,
  defaultMessage: string = 'Error interno del servidor',
  context?: Record<string, unknown>
) {
  if (error instanceof Error) {
    logApiError(error, context)
    return NextResponse.json({ error: error.message || defaultMessage }, { status: 500 })
  }

  logApiError(new Error(String(error)), context)
  return NextResponse.json({ error: defaultMessage }, { status: 500 })
}
