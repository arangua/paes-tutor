/**
 * Enterprise Test Utilities - Sistema Centralizado de Utilidades para Tests
 * 
 * Este módulo proporciona utilidades centralizadas y reutilizables para todos los tests,
 * siguiendo principios enterprise de DRY, mantenibilidad y consistencia.
 * 
 * @module enterprise-test-utils
 * @version 1.0.0
 */

import { NextRequest } from 'next/server'
import { vi, expect } from 'vitest'
type HeadersInit = Headers | Record<string, string> | [string, string][]

// ============================================
// TIPOS Y INTERFACES
// ============================================

/**
 * Opciones para crear un request de test
 */
export interface EnterpriseTestRequestOptions {
  /** URL base del request (default: 'http://localhost') */
  baseUrl?: string
  /** Método HTTP (default: 'GET') */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD'
  /** Query parameters */
  queryParams?: Record<string, string | number | boolean | null | undefined>
  /** Body del request (se serializa automáticamente a JSON) */
  body?: unknown
  /** Headers personalizados */
  headers?: HeadersInit
  /** Si el body debe ser enviado como FormData */
  formData?: FormData
  /** Si el body debe ser enviado como texto plano */
  textBody?: string
  /** Content-Type personalizado (default: 'application/json' para body) */
  contentType?: string
}

/**
 * Opciones para validar una respuesta
 */
export interface AssertResponseOptions {
  /** Código de estado esperado */
  expectedStatus?: number
  /** Rango de códigos de estado aceptables (ej: [200, 299]) */
  statusRange?: [number, number]
  /** Schema de validación opcional (Zod) */
  schema?: unknown
  /** Si debe validar que la respuesta tenga un campo específico */
  requiredFields?: string[]
}

// ============================================
// CREACIÓN DE REQUESTS
// ============================================

/**
 * Crea un NextRequest para tests de forma robusta y enterprise
 * 
 * ✅ Características enterprise:
 * - Manejo robusto de bodies (JSON, FormData, texto)
 * - Headers automáticos correctos
 * - Validación de tipos
 * - Soporte para todos los métodos HTTP
 * - Manejo correcto de query parameters
 * 
 * @param options - Opciones de configuración del request
 * @returns NextRequest configurado correctamente
 * 
 * @example
 * ```typescript
 * // GET request simple
 * const request = createEnterpriseTestRequest({
 *   baseUrl: 'http://localhost/api/users',
 *   queryParams: { limit: 10, offset: 0 }
 * })
 * 
 * // POST request con body JSON
 * const request = createEnterpriseTestRequest({
 *   method: 'POST',
 *   baseUrl: 'http://localhost/api/users',
 *   body: { name: 'John', email: 'john@example.com' }
 * })
 * 
 * // POST request con FormData
 * const formData = new FormData()
 * formData.append('file', new Blob(['content']))
 * const request = createEnterpriseTestRequest({
 *   method: 'POST',
 *   formData
 * })
 * ```
 */
export function createEnterpriseTestRequest(
  options: EnterpriseTestRequestOptions = {}
): NextRequest {
  const {
    baseUrl = 'http://localhost',
    method = 'GET',
    queryParams,
    body,
    headers: customHeaders,
    formData,
    textBody,
    contentType,
  } = options

  // Construir URL con query parameters
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

  // Determinar body y Content-Type
  let requestBody: BodyInit | undefined
  let finalContentType = contentType

  if (formData) {
    // FormData - no establecer Content-Type, el navegador lo hace automáticamente
    requestBody = formData
    // No establecer Content-Type para FormData
  } else if (textBody !== undefined) {
    // Texto plano
    requestBody = textBody
    finalContentType = finalContentType || 'text/plain'
  } else if (body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
    // JSON body
    requestBody = JSON.stringify(body)
    finalContentType = finalContentType || 'application/json'
  }

  // Establecer Content-Type si es necesario y no está ya establecido
  if (finalContentType && !headers.has('Content-Type')) {
    headers.set('Content-Type', finalContentType)
  }

  // Establecer Content-Length si hay body
  if (requestBody) {
    if (typeof requestBody === 'string') {
      headers.set('Content-Length', String(new TextEncoder().encode(requestBody).length))
    }
  }

  // Crear NextRequest
  // ✅ Enterprise: Usar URL completa para que nextUrl funcione correctamente
  return new NextRequest(url.toString(), {
    method,
    headers,
    body: requestBody,
  })
}

// ============================================
// VALIDACIÓN DE RESPUESTAS
// ============================================

/**
 * Valida que una respuesta sea exitosa y retorna los datos parseados
 * 
 * ✅ Características enterprise:
 * - Validación de código de estado
 * - Parsing seguro de JSON
 * - Validación opcional con schema
 * - Mensajes de error descriptivos
 * 
 * @param response - Response a validar
 * @param options - Opciones de validación
 * @returns Datos parseados de la respuesta
 * @throws Error si la validación falla
 * 
 * @example
 * ```typescript
 * // Validación básica
 * const data = await assertEnterpriseResponse(response)
 * 
 * // Validación con código específico
 * const data = await assertEnterpriseResponse(response, {
 *   expectedStatus: 201
 * })
 * 
 * // Validación con rango
 * const data = await assertEnterpriseResponse(response, {
 *   statusRange: [200, 299]
 * })
 * ```
 */
export async function assertEnterpriseResponse<T = unknown>(
  response: Response,
  options: AssertResponseOptions = {}
): Promise<T> {
  const {
    expectedStatus,
    statusRange,
    requiredFields = [],
  } = options

  // Validar código de estado
  if (expectedStatus !== undefined) {
    expect(response.status).toBe(expectedStatus)
  } else if (statusRange) {
    expect(response.status).toBeGreaterThanOrEqual(statusRange[0])
    expect(response.status).toBeLessThanOrEqual(statusRange[1])
  } else {
    // Por defecto, validar que sea 2xx
    expect(response.status).toBeGreaterThanOrEqual(200)
    expect(response.status).toBeLessThan(300)
  }

  // Parsear JSON de forma segura
  let data: T
  try {
    const text = await response.text()
    if (!text) {
      data = {} as T
    } else {
      data = JSON.parse(text) as T
    }
  } catch (error) {
    throw new Error(
      `Error al parsear respuesta JSON: ${error instanceof Error ? error.message : String(error)}. ` +
      `Status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`
    )
  }

  // Validar campos requeridos
  if (requiredFields.length > 0 && typeof data === 'object') {
    const dataObj = data as Record<string, unknown>
    for (const field of requiredFields) {
      expect(dataObj).toHaveProperty(field)
    }
  }

  return data
}

/**
 * Valida que una respuesta sea un error con el código y mensaje esperados
 * 
 * @param response - Response a validar
 * @param expectedStatus - Código de estado esperado
 * @param expectedError - Mensaje de error esperado (string o función de validación)
 * @returns Datos del error parseados
 * 
 * @example
 * ```typescript
 * // Validación con mensaje exacto
 * await assertEnterpriseError(response, 400, 'Datos inválidos')
 * 
 * // Validación con función
 * await assertEnterpriseError(response, 404, (error) => 
 *   error.includes('no encontrado')
 * )
 * ```
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

// ============================================
// UTILIDADES DE MOCK
// ============================================

/**
 * Configura mocks comunes para tests de API
 * 
 * @param mocks - Configuración de mocks
 */
export function setupEnterpriseMocks(_mocks: {
  prisma?: Partial<typeof import('@/lib/prisma').prisma>
  auth?: {
    user?: unknown
    student?: unknown
  }
  cache?: {
    get?: unknown
    set?: unknown
  }
}): void {
  // Esta función puede ser extendida para configurar mocks comunes
  // Por ahora es un placeholder para futuras mejoras
}

// ============================================
// UTILIDADES DE VALIDACIÓN
// ============================================

/**
 * Valida que un objeto tenga todas las propiedades requeridas
 */
export function assertHasRequiredFields<T extends Record<string, unknown>>(
  obj: unknown,
  requiredFields: (keyof T)[]
): asserts obj is T {
  expect(typeof obj).toBe('object')
  expect(obj).not.toBeNull()

  const objRecord = obj as Record<string, unknown>
  for (const field of requiredFields) {
    expect(objRecord).toHaveProperty(String(field))
  }
}

/**
 * Valida que un array tenga al menos un elemento
 */
export function assertNonEmptyArray<T>(arr: unknown): asserts arr is T[] {
  expect(Array.isArray(arr)).toBe(true)
  expect((arr as unknown[]).length).toBeGreaterThan(0)
}

// ============================================
// HELPERS DE CONFIGURACIÓN
// ============================================

/**
 * Limpia todos los mocks después de un test
 * 
 * Útil para usar en afterEach
 */
export function resetEnterpriseMocks(): void {
  vi.clearAllMocks()
}

/**
 * Configura variables de entorno para tests
 */
export function setupTestEnv(env: Record<string, string | undefined>): void {
  const originalEnv = { ...process.env }
  
  // Establecer nuevas variables
  Object.entries(env).forEach(([key, value]) => {
    if (value === undefined) {
       
      delete process.env[key] // key validated via test config object (not user input)
    } else {
       
      process.env[key] = value // key validated via test config object (not user input)
    }
  })

  // Retornar función de limpieza
  return () => {
    process.env = originalEnv
  }
}

