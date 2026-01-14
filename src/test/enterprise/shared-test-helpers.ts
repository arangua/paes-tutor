/**
 * Shared Enterprise Test Helpers
 * Helpers reutilizables para todos los tests unitarios
 * 
 * Estos helpers proporcionan funcionalidades enterprise que pueden ser usadas
 * en cualquier test, no solo en módulos específicos.
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId, getAuthenticatedUserWithStudent } from '@/lib/get-session'

// ============================================
// TEST IDS ESTÁNDAR
// ============================================

export const SHARED_TEST_IDS = {
  USER: 'c111111111111111111111111',
  STUDENT: 'c222222222222222222222222',
  EXAM: 'c333333333333333333333333',
  ATTEMPT: 'c444444444444444444444444',
  QUESTION: 'c555555555555555555555555',
  TOPIC: 'c666666666666666666666666',
  SUBJECT: 'c777777777777777777777777',
} as const

// ============================================
// FACTORY FUNCTIONS
// ============================================

/**
 * Crear un usuario de prueba estándar
 */
export function createTestUser(options: {
  id?: string
  email?: string
  name?: string
  studentId?: string | null
} = {}) {
  return {
    id: options.id || SHARED_TEST_IDS.USER,
    email: options.email || 'test@example.com',
    name: options.name || 'Test User',
    emailVerified: null,
    image: null,
    studentId: options.studentId || SHARED_TEST_IDS.STUDENT,
  }
}

/**
 * Crear un estudiante de prueba estándar
 */
export function createTestStudent(options: {
  id?: string
  nombre?: string
  userId?: string
} = {}) {
  return {
    id: options.id || SHARED_TEST_IDS.STUDENT,
    nombre: options.nombre || 'Test Student',
    userId: options.userId || SHARED_TEST_IDS.USER,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Crear un usuario autenticado con estudiante
 */
export function createAuthenticatedUserWithStudent(options: {
  userId?: string
  studentId?: string
  email?: string
} = {}) {
  return {
    id: options.userId || SHARED_TEST_IDS.USER,
    email: options.email || 'test@example.com',
    student: createTestStudent({
      id: options.studentId || SHARED_TEST_IDS.STUDENT,
      userId: options.userId || SHARED_TEST_IDS.USER,
    }),
  }
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configurar autenticación estándar para tests
 */
export async function setupStandardAuth(options: {
  studentId?: string
  userId?: string
  hasStudent?: boolean
} = {}) {
  const studentId = options.studentId || SHARED_TEST_IDS.STUDENT
  const userId = options.userId || SHARED_TEST_IDS.USER

  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)

  if (options.hasStudent !== false) {
    vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(
      createAuthenticatedUserWithStudent({ userId, studentId }) as any
    )
  } else {
    vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue({
      id: userId,
      email: 'test@example.com',
      student: null,
    } as any)
  }
}

/**
 * Configurar usuario no autenticado
 */
export function setupUnauthenticated() {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(null)
}

/**
 * Limpiar todos los mocks
 */
export function clearAllMocks() {
  vi.clearAllMocks()
}

// ============================================
// REQUEST HELPERS
// ============================================

/**
 * Crear un NextRequest de prueba estándar
 */
export function createTestRequest(options: {
  url?: string
  method?: string
  body?: any
  queryParams?: Record<string, string>
  headers?: Record<string, string>
} = {}): NextRequest {
  const url = options.url || 'http://localhost:3000/api/test'
  const urlObj = new URL(url)
  
  // Agregar query params
  if (options.queryParams) {
    Object.entries(options.queryParams).forEach(([key, value]) => {
      urlObj.searchParams.set(key, value)
    })
  }

  const request = new NextRequest(urlObj.toString(), {
    method: options.method || 'GET',
    body: options.body ? JSON.stringify(options.body) : undefined,
    headers: options.headers || {},
  })

  return request
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Verificar respuesta exitosa estándar
 */
export async function assertSuccessResponse(
  response: Response,
  expectedStatus: number = 200,
  options?: {
    hasData?: boolean
    requiredFields?: string[]
  }
) {
  expect(response.status).toBe(expectedStatus)
  
  if (options?.hasData !== false) {
    const data = await response.json()
    expect(data).toBeDefined()
    
    if (options?.requiredFields) {
      options.requiredFields.forEach(field => {
        expect(data).toHaveProperty(field)
      })
    }
  }
}

/**
 * Verificar respuesta de error estándar
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedError?: string | RegExp
) {
  expect(response.status).toBe(expectedStatus)
  
  if (expectedError) {
    const data = await response.json()
    if (typeof expectedError === 'string') {
      expect(data.error || data.message).toContain(expectedError)
    } else {
      expect(data.error || data.message).toMatch(expectedError)
    }
  }
}

/**
 * Verificar respuesta de array
 */
export async function assertArrayResponse(
  response: Response,
  options?: {
    minLength?: number
    itemValidator?: (item: any) => void
  }
) {
  expect(response.status).toBe(200)
  const data = await response.json()
  
  expect(Array.isArray(data)).toBe(true)
  
  if (options?.minLength !== undefined) {
    expect(data.length).toBeGreaterThanOrEqual(options.minLength)
  }
  
  if (options?.itemValidator && data.length > 0) {
    options.itemValidator(data[0])
  }
}

// ============================================
// PERFORMANCE HELPERS
// ============================================

/**
 * Medir tiempo de ejecución de una operación
 */
export async function measureExecutionTime<T>(
  operation: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now()
  const result = await operation()
  const duration = Date.now() - start
  
  return { result, duration }
}

/**
 * Verificar que una operación se ejecuta dentro de un tiempo límite
 */
export async function assertExecutionTime<T>(
  operation: () => Promise<T>,
  maxTime: number
): Promise<T> {
  const { result, duration } = await measureExecutionTime(operation)
  expect(duration).toBeLessThan(maxTime)
  return result
}

// ============================================
// MOCK HELPERS
// ============================================

/**
 * Configurar mock de Prisma estándar
 */
export function setupPrismaMock() {
  // Los mocks de Prisma se configuran en cada test específico
  // Esta función puede ser extendida para mocks comunes
}

/**
 * Configurar mock de caché estándar
 */
export function setupCacheMock(returnValue?: any) {
  const { getCached } = require('@/lib/cache')
  if (returnValue !== undefined) {
    vi.mocked(getCached).mockResolvedValue(returnValue)
  } else {
    vi.mocked(getCached).mockImplementation((_key: string, fetcher: () => Promise<any>) => fetcher())
  }
}

/**
 * Configurar mock de rate limiting (sin límite)
 */
export function setupNoRateLimit() {
  const { withRateLimit } = require('@/lib/rate-limit-middleware')
  vi.mocked(withRateLimit).mockImplementation(
    (_req: NextRequest, handler: () => Promise<Response>) => handler()
  )
}

// ============================================
// TEST SCENARIO BUILDER (Simplificado)
// ============================================

/**
 * Builder simplificado para escenarios de test comunes
 */
export class SimpleTestScenarioBuilder {
  private auth?: { studentId?: string; userId?: string; hasStudent?: boolean }
  private cache?: any
  private prismaMocks: Array<{ model: string; method: string; value: any }> = []

  withAuth(options: { studentId?: string; userId?: string; hasStudent?: boolean }) {
    this.auth = options
    return this
  }

  withCache(data: any) {
    this.cache = data
    return this
  }

  withPrismaMock(model: string, method: string, value: any) {
    this.prismaMocks.push({ model, method, value })
    return this
  }

  async setup() {
    if (this.auth) {
      await setupStandardAuth(this.auth)
    } else {
      await setupStandardAuth()
    }

    if (this.cache !== undefined) {
      setupCacheMock(this.cache)
    }

    // Aplicar mocks de Prisma
    for (const mock of this.prismaMocks) {
      const model = (prisma as any)[mock.model]
      if (model && model[mock.method]) {
        vi.mocked(model[mock.method]).mockResolvedValue(mock.value)
      }
    }
  }

  createRequest(options?: Parameters<typeof createTestRequest>[0]): NextRequest {
    return createTestRequest(options)
  }

  build() {
    return {
      setup: () => this.setup(),
      createRequest: (options?: Parameters<typeof createTestRequest>[0]) => this.createRequest(options),
    }
  }
}

