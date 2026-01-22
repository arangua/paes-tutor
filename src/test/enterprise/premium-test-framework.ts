/**
 * Enterprise Premium Test Framework
 * 
 * Sistema de testing de nivel enterprise con arquitectura avanzada,
 * patrones de diseño sofisticados y herramientas profesionales.
 * 
 * @module premium-test-framework
 * @version 2.0.0
 * @enterprise
 */

import { NextRequest } from 'next/server'
import { expect, type Mock } from 'vitest'
import { z } from 'zod'
type HeadersInit = Headers | Record<string, string> | [string, string][]

// ============================================
// TIPOS Y INTERFACES ENTERPRISE
// ============================================

/**
 * Configuración de un test request enterprise
 */
export interface EnterpriseRequestConfig {
  baseUrl?: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
  queryParams?: Record<string, string | number | boolean | null | undefined>
  body?: unknown
  headers?: HeadersInit
  formData?: FormData
  textBody?: string
  contentType?: string
  // ✅ Enterprise Premium: Opciones avanzadas
  timeout?: number
  retries?: number
  cache?: 'no-cache' | 'default' | 'force-cache'
  credentials?: 'include' | 'omit' | 'same-origin'
  redirect?: 'follow' | 'error' | 'manual'
}

/**
 * Configuración de validación enterprise
 */
export interface EnterpriseValidationConfig {
  expectedStatus?: number
  statusRange?: [number, number]
  schema?: z.ZodSchema
  requiredFields?: string[]
  // ✅ Enterprise Premium: Validaciones avanzadas
  responseTime?: {
    max?: number
    min?: number
  }
  headers?: Record<string, string | RegExp | ((value: string) => boolean)>
  contentType?: string | RegExp
  size?: {
    max?: number
    min?: number
  }
}

/**
 * Configuración de mock enterprise
 */
export interface EnterpriseMockConfig {
  prisma?: Partial<Record<string, Mock>>
  services?: Record<string, Mock>
  cache?: {
    get?: unknown
    set?: unknown
    delete?: unknown
  }
  auth?: {
    user?: unknown
    student?: unknown
    session?: unknown
  }
  // ✅ Enterprise Premium: Mocks avanzados
  timing?: {
    delay?: number
    timeout?: boolean
  }
  errors?: {
    simulate?: boolean
    errorType?: 'network' | 'timeout' | 'server' | 'validation'
  }
}

/**
 * Resultado de un test enterprise
 */
export interface EnterpriseTestResult<T = unknown> {
  success: boolean
  data?: T
  error?: {
    message: string
    code?: number
    details?: unknown
  }
  metrics?: {
    responseTime: number
    requestSize: number
    responseSize: number
  }
}

// ============================================
// FACTORY PATTERN: Request Builder
// ============================================

/**
 * Builder enterprise para crear requests de test
 * 
 * Implementa el patrón Builder para construcción fluida de requests
 */
export class EnterpriseRequestBuilder {
  private config: EnterpriseRequestConfig = {}

  /**
   * Establece la URL base
   */
  url(baseUrl: string): this {
    this.config.baseUrl = baseUrl
    return this
  }

  /**
   * Establece el método HTTP
   */
  method(method: EnterpriseRequestConfig['method']): this {
    this.config.method = method
    return this
  }

  /**
   * Agrega query parameters
   */
  query(params: EnterpriseRequestConfig['queryParams']): this {
    this.config.queryParams = { ...this.config.queryParams, ...params }
    return this
  }

  /**
   * Establece el body JSON
   */
  body(data: unknown): this {
    this.config.body = data
    return this
  }

  /**
   * Establece headers
   */
  headers(headers: HeadersInit): this {
    this.config.headers = headers
    return this
  }

  /**
   * Agrega un header específico
   */
  header(name: string, value: string): this {
    if (!this.config.headers) {
      this.config.headers = new Headers()
    }
    const headers = this.config.headers instanceof Headers
      ? this.config.headers
      : new Headers(this.config.headers)
    headers.set(name, value)
    this.config.headers = headers
    return this
  }

  /**
   * Establece FormData
   */
  formData(data: FormData): this {
    this.config.formData = data
    return this
  }

  /**
   * Establece timeout
   */
  timeout(ms: number): this {
    this.config.timeout = ms
    return this
  }

  /**
   * Establece política de caché
   */
  cache(policy: EnterpriseRequestConfig['cache']): this {
    this.config.cache = policy
    return this
  }

  /**
   * Construye el NextRequest final
   */
  build(): NextRequest {
    return this.createRequest(this.config)
  }

  /**
   * Crea el request con la configuración actual
   */
  private createRequest(config: EnterpriseRequestConfig): NextRequest {
    const {
      baseUrl = 'http://localhost',
      method = 'GET',
      queryParams,
      body,
      headers: customHeaders,
      formData,
      textBody,
      contentType,
      cache,
    } = config

    // Construir URL
    const url = new URL(baseUrl)
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          url.searchParams.set(key, String(value))
        }
      })
    }

    // Configurar headers
    const headers = new Headers(customHeaders)

    // Determinar body
    let requestBody: BodyInit | undefined
    let finalContentType = contentType

    if (formData) {
      requestBody = formData
    } else if (textBody !== undefined) {
      requestBody = textBody
      finalContentType = finalContentType || 'text/plain'
    } else if (body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
      requestBody = JSON.stringify(body)
      finalContentType = finalContentType || 'application/json'
    }

    // Establecer Content-Type
    if (finalContentType && !headers.has('Content-Type')) {
      headers.set('Content-Type', finalContentType)
    }

    // Establecer Cache-Control
    if (cache) {
      headers.set('Cache-Control', cache === 'no-cache' ? 'no-cache' : cache)
    }

    // Establecer Content-Length
    if (requestBody && typeof requestBody === 'string') {
      headers.set('Content-Length', String(new TextEncoder().encode(requestBody).length))
    }

    return new NextRequest(url.toString(), {
      method,
      headers,
      body: requestBody,
    })
  }

  /**
   * Resetea el builder para reutilización
   */
  reset(): this {
    this.config = {}
    return this
  }
}

// ============================================
// VALIDATOR PATTERN: Response Validator
// ============================================

/**
 * Validador enterprise para respuestas
 * 
 * Implementa el patrón Strategy para validaciones flexibles
 */
export class EnterpriseResponseValidator {
  private config: EnterpriseValidationConfig = {}

  /**
   * Establece el código de estado esperado
   */
  status(code: number): this {
    this.config.expectedStatus = code
    return this
  }

  /**
   * Establece un rango de códigos de estado
   */
  statusRange(min: number, max: number): this {
    this.config.statusRange = [min, max]
    return this
  }

  /**
   * Establece un schema de validación Zod
   */
  schema(schema: z.ZodSchema): this {
    this.config.schema = schema
    return this
  }

  /**
   * Establece campos requeridos
   */
  requires(fields: string[]): this {
    this.config.requiredFields = fields
    return this
  }

  /**
   * Establece tiempo máximo de respuesta
   */
  maxResponseTime(ms: number): this {
    if (!this.config.responseTime) {
      this.config.responseTime = {}
    }
    this.config.responseTime.max = ms
    return this
  }

  /**
   * Establece tiempo mínimo de respuesta
   */
  minResponseTime(ms: number): this {
    if (!this.config.responseTime) {
      this.config.responseTime = {}
    }
    this.config.responseTime.min = ms
    return this
  }

  /**
   * Establece validación de headers
   */
  headers(headers: EnterpriseValidationConfig['headers']): this {
    this.config.headers = headers
    return this
  }

  /**
   * Establece validación de Content-Type
   */
  contentType(type: string | RegExp): this {
    this.config.contentType = type
    return this
  }

  /**
   * Valida la respuesta
   */
  async validate<T = unknown>(response: Response): Promise<EnterpriseTestResult<T>> {
    const startTime = Date.now()
    const config = this.config

    try {
      // Validar código de estado
      if (config.expectedStatus !== undefined) {
        expect(response.status).toBe(config.expectedStatus)
      } else if (config.statusRange) {
        expect(response.status).toBeGreaterThanOrEqual(config.statusRange[0])
        expect(response.status).toBeLessThanOrEqual(config.statusRange[1])
      } else {
        expect(response.status).toBeGreaterThanOrEqual(200)
        expect(response.status).toBeLessThan(300)
      }

      // Validar Content-Type
      if (config.contentType) {
        const actualContentType = response.headers.get('content-type') || ''
        if (config.contentType instanceof RegExp) {
          expect(actualContentType).toMatch(config.contentType)
        } else {
          expect(actualContentType).toContain(config.contentType)
        }
      }

      // Validar headers
      if (config.headers) {
        for (const [name, validator] of Object.entries(config.headers)) {
          const value = response.headers.get(name)
          expect(value).toBeDefined()
          
          if (typeof validator === 'string') {
            expect(value).toBe(validator)
          } else if (validator instanceof RegExp) {
            expect(value).toMatch(validator)
          } else if (typeof validator === 'function') {
            expect(validator(value || '')).toBe(true)
          }
        }
      }

      // Parsear respuesta
      const text = await response.text()
      const responseTime = Date.now() - startTime

      // Validar tiempo de respuesta
      if (config.responseTime?.max) {
        expect(responseTime).toBeLessThanOrEqual(config.responseTime.max)
      }
      if (config.responseTime?.min) {
        expect(responseTime).toBeGreaterThanOrEqual(config.responseTime.min)
      }

      // Validar tamaño
      if (config.size?.max) {
        expect(text.length).toBeLessThanOrEqual(config.size.max)
      }
      if (config.size?.min) {
        expect(text.length).toBeGreaterThanOrEqual(config.size.min)
      }

      let data: T
      if (!text) {
        data = {} as T
      } else {
        data = JSON.parse(text) as T
      }

      // Validar schema
      if (config.schema) {
        const result = config.schema.safeParse(data)
        if (!result.success) {
          throw new Error(`Schema validation failed: ${result.error.message}`)
        }
        data = result.data as T
      }

      // Validar campos requeridos
      if (config.requiredFields && typeof data === 'object') {
        const dataObj = data as Record<string, unknown>
        for (const field of config.requiredFields) {
          expect(dataObj).toHaveProperty(field)
        }
      }

      return {
        success: true,
        data,
        metrics: {
          responseTime,
          requestSize: 0, // Se puede calcular si es necesario
          responseSize: text.length,
        },
      }
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : String(error),
          details: error,
        },
      }
    }
  }

  /**
   * Resetea el validador
   */
  reset(): this {
    this.config = {}
    return this
  }
}

// ============================================
// FACTORY: Request Factory
// ============================================

/**
 * Factory enterprise para crear requests comunes
 */
export class EnterpriseRequestFactory {
  /**
   * Crea un request GET simple
   */
  static get(url: string, queryParams?: Record<string, unknown>): NextRequest {
    return new EnterpriseRequestBuilder()
      .url(url)
      .method('GET')
      .query(queryParams as Record<string, string | number | boolean | null | undefined>)
      .build()
  }

  /**
   * Crea un request POST con body JSON
   */
  static post(url: string, body: unknown, headers?: HeadersInit): NextRequest {
    return new EnterpriseRequestBuilder()
      .url(url)
      .method('POST')
      .body(body)
      .headers(headers || {})
      .build()
  }

  /**
   * Crea un request PUT con body JSON
   */
  static put(url: string, body: unknown, headers?: HeadersInit): NextRequest {
    return new EnterpriseRequestBuilder()
      .url(url)
      .method('PUT')
      .body(body)
      .headers(headers || {})
      .build()
  }

  /**
   * Crea un request PATCH con body JSON
   */
  static patch(url: string, body: unknown, headers?: HeadersInit): NextRequest {
    return new EnterpriseRequestBuilder()
      .url(url)
      .method('PATCH')
      .body(body)
      .headers(headers || {})
      .build()
  }

  /**
   * Crea un request DELETE
   */
  static delete(url: string, headers?: HeadersInit): NextRequest {
    return new EnterpriseRequestBuilder()
      .url(url)
      .method('DELETE')
      .headers(headers || {})
      .build()
  }
}

// ============================================
// UTILIDADES ENTERPRISE
// ============================================

/**
 * Crea un builder de request (fluent API)
 */
export function request(): EnterpriseRequestBuilder {
  return new EnterpriseRequestBuilder()
}

/**
 * Crea un validador de respuesta (fluent API)
 */
export function validator(): EnterpriseResponseValidator {
  return new EnterpriseResponseValidator()
}

/**
 * Valida una respuesta de error enterprise
 */
export async function assertEnterpriseError(
  response: Response,
  expectedStatus: number,
  expectedError?: string | ((error: string) => boolean)
): Promise<{ error: string; [key: string]: unknown }> {
  expect(response.status).toBe(expectedStatus)

  const data = await response.json().catch(() => ({ error: 'Error desconocido' }))
  expect(data).toHaveProperty('error')

  const errorMessage = String(data.error || '')

  if (expectedError) {
    if (typeof expectedError === 'string') {
      expect(errorMessage).toContain(expectedError)
    } else {
      expect(expectedError(errorMessage)).toBe(true)
    }
  }

  return data as { error: string; [key: string]: unknown }
}

/**
 * Helper para crear requests de forma simple (backward compatibility)
 */
export function createEnterpriseTestRequest(
  options: EnterpriseRequestConfig = {}
): NextRequest {
  const builder = new EnterpriseRequestBuilder()
  
  if (options.baseUrl) builder.url(options.baseUrl)
  if (options.method) builder.method(options.method)
  if (options.queryParams) builder.query(options.queryParams)
  if (options.body) builder.body(options.body)
  if (options.headers) builder.headers(options.headers)
  if (options.formData) builder.formData(options.formData)
  if (options.contentType) builder.header('Content-Type', options.contentType)
  if (options.timeout) builder.timeout(options.timeout)
  if (options.cache) builder.cache(options.cache)

  return builder.build()
}

/**
 * Helper para validar respuestas de forma simple (backward compatibility)
 */
export async function assertEnterpriseResponse<T = unknown>(
  response: Response,
  options: EnterpriseValidationConfig = {}
): Promise<T> {
  const validator = new EnterpriseResponseValidator()
  
  if (options.expectedStatus) validator.status(options.expectedStatus)
  if (options.statusRange) validator.statusRange(options.statusRange[0], options.statusRange[1])
  if (options.schema) validator.schema(options.schema)
  if (options.requiredFields) validator.requires(options.requiredFields)
  if (options.responseTime?.max) validator.maxResponseTime(options.responseTime.max)
  if (options.responseTime?.min) validator.minResponseTime(options.responseTime.min)
  if (options.headers) validator.headers(options.headers)
  if (options.contentType) validator.contentType(options.contentType)

  const result = await validator.validate<T>(response)
  
  if (!result.success) {
    throw new Error(result.error?.message || 'Validation failed')
  }

  return result.data as T
}

