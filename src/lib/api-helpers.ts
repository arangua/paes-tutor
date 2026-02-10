import { NextRequest, NextResponse } from 'next/server'
import { ZodError, type ZodType } from 'zod'
import { logger, logApiError } from './logger'
import { sanitizeString, containsDangerousPatterns, sanitizeObject } from './security'
import { logSecurityEvent, getClientIp, detectSuspiciousActivity } from './security-logger'

function setRecordValue(target: Record<string, unknown>, key: string, value: unknown) {
  Object.defineProperty(target, key, { value, enumerable: true, configurable: true, writable: true })
}

/**
 * Valida los parámetros de la query string usando un schema de Zod
 * 
 * Realiza sanitización automática, detección de patrones peligrosos,
 * y validación de tipos antes de retornar los datos validados.
 * 
 * @template T - Tipo inferido del schema de Zod
 * @param request - Request de Next.js con los query parameters
 * @param schema - Schema de Zod para validar los parámetros
 * @returns Objeto con `success: true` y `data` validado, o `success: false` con `error` NextResponse
 * 
 * @example
 * ```typescript
 * const validation = validateQuery(request, examQuerySchema)
 * if (!validation.success) {
 *   return validation.error
 * }
 * const { subjectId, limit } = validation.data
 * ```
 */
export function validateQuery<T>(
  request: NextRequest,
  schema: ZodType<T>
): { success: true; data: T } | { success: false; error: NextResponse } {
  try {
    const searchParams = request.nextUrl.searchParams
    const params = Object.fromEntries(searchParams.entries())

    // Sanitizar valores de string en params
    const sanitizedParams: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === 'string') {
        setRecordValue(sanitizedParams, key, sanitizeString(value))

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
        setRecordValue(sanitizedParams, key, value)
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
 * Valida el body de la request usando un schema de Zod
 * 
 * Realiza sanitización automática, detección de actividad sospechosa,
 * y validación de tipos antes de retornar los datos validados.
 * 
 * @template T - Tipo inferido del schema de Zod
 * @param request - Request de Next.js con el body JSON
 * @param schema - Schema de Zod para validar el body
 * @returns Promise con objeto `success: true` y `data` validado, o `success: false` con `error` NextResponse
 * @throws No lanza errores, siempre retorna un objeto de resultado
 * 
 * @example
 * ```typescript
 * const validation = await validateBody(request, createAttemptSchema)
 * if (!validation.success) {
 *   return validation.error
 * }
 * const { examId, answers } = validation.data
 * ```
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodType<T>
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    let body
    try {
      body = await request.json()
    } catch {
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
 * 
 * Útil para manejar errores de parsing JSON en respuestas de API.
 * Funciona tanto en cliente como en servidor. Si el parsing falla,
 * retorna un objeto vacío en lugar de lanzar un error.
 * 
 * @template T - Tipo esperado del JSON parseado (por defecto Record<string, unknown>)
 * @param response - Response de fetch con el body JSON
 * @param context - Contexto opcional para logging (path, operation)
 * @param context.path - Ruta de la API donde ocurre el parsing
 * @param context.operation - Descripción de la operación que se está realizando
 * @returns Promise con el objeto parseado, o objeto vacío si falla el parsing
 * 
 * @example
 * ```typescript
 * const errorData = await safeJsonParse<{ error?: string }>(res, {
 *   path: '/api/user',
 *   operation: 'actualizar usuario',
 * })
 * if (errorData.error) {
 *   toast.error(errorData.error)
 * }
 * ```
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
 * Valida una respuesta de API usando un schema de Zod
 * 
 * Útil para validar respuestas del servidor en el cliente antes de usar los datos.
 * Esto proporciona type safety en runtime, no solo en compile-time.
 * 
 * @template T - Tipo inferido del schema de Zod
 * @param response - Response de fetch con el body JSON
 * @param schema - Schema de Zod para validar la respuesta
 * @param context - Contexto opcional para logging
 * @returns Promise con objeto `success: true` y `data` validado, o `success: false` con `error`
 * 
 * @example
 * ```typescript
 * const validation = await validateResponse(res, examResponseSchema, {
 *   path: '/api/exams',
 *   operation: 'cargar exámenes'
 * })
 * if (!validation.success) {
 *   toast.error('Error de validación', { description: validation.error })
 *   return
 * }
 * const { exams, pagination } = validation.data
 * ```
 */
 
export async function validateResponse<T>(
  response: Response,
  schema: ZodType<T>,
  context?: { path?: string; operation?: string }
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const json = await safeJsonParse<unknown>(response, context)
    const data = schema.parse(json)
    return { success: true, data }
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = `Error de validación: ${error.issues.map(i => i.message).join(', ')}`
      const pathSuffix = context?.path ? ` en ${context.path}` : ''
      const operationSuffix = context?.operation ? ` (${context.operation})` : ''
      
      // Log estructurado usando logger en lugar de console.warn
      const logData = {
        type: 'response_validation_error',
        path: context?.path,
        operation: context?.operation,
        issues: error.issues.map(issue => ({
          path: issue.path.join('.'),
          message: issue.message,
          code: issue.code,
        })),
        issueCount: error.issues.length,
        status: response.status,
        statusText: response.statusText,
      }
      
      // Usar logger estructurado si está disponible (servidor), sino console.warn mejorado (cliente)
      try {
        if (typeof window === 'undefined') {
          // En servidor, usar logger estructurado
          logger.warn(logData, `Error de validación de respuesta${pathSuffix}${operationSuffix}`)
        } else {
          // En cliente, usar console.warn solo en desarrollo y con formato mejorado
          // Solo mostrar si hay issues reales (no warnings vacíos)
          if (process.env.NODE_ENV === 'development' && error.issues.length > 0) {
            // Construir mensaje más legible
            const issuesSummary = error.issues
              .map((issue, idx) => `${idx + 1}. ${issue.path.join('.')}: ${issue.message}`)
              .join('\n')
            
            const header = `⚠️ Error de validación de respuesta${pathSuffix}${operationSuffix}\n`
            console.warn(header + `Mensaje: ${errorMessage}\n` + `Issues (${error.issues.length}):\n${issuesSummary}`)
          }
        }
      } catch {
        // Si el logging falla, usar console como fallback solo en desarrollo
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error de validación de respuesta:', errorMessage)
        }
      }
      
      return { success: false, error: errorMessage }
    }
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido al validar respuesta'
    
    // Log de errores no-ZodError también
    if (process.env.NODE_ENV === 'development') {
      const logData = {
        type: 'response_validation_unknown_error', // guard:allow-secret
        path: context?.path,
        operation: context?.operation,
        error: errorMessage,
        status: response.status,
        statusText: response.statusText,
      }
      
      try {
        if (typeof window === 'undefined') {
          const pathSuffix = context?.path ? ` en ${context.path}` : ''
          logger.warn(logData, `Error desconocido al validar respuesta${pathSuffix}`)
        } else {
          console.warn('Error desconocido al validar respuesta:', logData)
        }
      } catch {
        // Silenciar errores de logging
      }
    }
    
    return { success: false, error: errorMessage }
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
