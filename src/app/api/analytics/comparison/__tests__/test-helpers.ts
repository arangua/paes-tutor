/**
 * Test Helpers Enterprise para API de Analytics Comparison
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de analytics comparison,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { PerformanceMetric, Topic, Subject, Student, User } from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests
 */
export const TEST_IDS = {
  STUDENT: 'c111111111111111111111111',
  STUDENT_2: 'c222222222222222222222222',
  STUDENT_3: 'c333333333333333333333333',
  SUBJECT_1: 'c444444444444444444444444',
  SUBJECT_2: 'c555555555555555555555555',
  TOPIC_1: 'c666666666666666666666666',
  TOPIC_2: 'c777777777777777777777777',
  METRIC_1: 'c888888888888888888888888',
  METRIC_2: 'c999999999999999999999999',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL: 'test@example.com',
  STUDENT_NAME: 'Test Student',
  SUBJECT_NAME: 'Matemáticas',
  SUBJECT_CODE: 'M1',
  TOPIC_NAME: 'Álgebra',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear una métrica de performance en tests
 */
export interface PerformanceMetricOptions {
  /** ID de la métrica (default: TEST_IDS.METRIC_1) */
  id?: string
  /** ID del estudiante (default: TEST_IDS.STUDENT) */
  studentId?: string
  /** ID del tema (default: TEST_IDS.TOPIC_1) */
  topicId?: string
  /** Total de preguntas (default: 10) */
  totalPreguntas?: number
  /** Preguntas correctas (default: 7) */
  correctas?: number
  /** Porcentaje (default: calculado automáticamente) */
  porcentaje?: number
  /** Fecha de actualización */
  updatedAt?: Date
  /** Topic completo (opcional) */
  topic?: TopicWithSubject
}

/**
 * Topic con Subject incluido
 */
export interface TopicWithSubject extends Topic {
  subject: Subject
}

/**
 * PerformanceMetric con Topic y Subject incluidos
 */
export interface PerformanceMetricWithRelations extends PerformanceMetric {
  topic: TopicWithSubject
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/analytics/comparison') */
  baseUrl?: string
  /** Query parameters */
  queryParams?: Record<string, string | number | boolean | null>
  /** Método HTTP (default: 'GET') */
  method?: string
  /** Headers adicionales */
  headers?: HeadersInit
}

// ============================================
// FACTORIES
// ============================================

/**
 * Factory para crear un Subject para tests
 */
export function createSubject(options: {
  id?: string
  nombre?: string
  codigo?: string
} = {}): Subject {
  return {
    id: options.id ?? TEST_IDS.SUBJECT_1,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.SUBJECT_NAME,
    codigo: options.codigo ?? DEFAULT_TEST_VALUES.SUBJECT_CODE,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Factory para crear un Topic con Subject para tests
 */
export function createTopicWithSubject(options: {
  topicId?: string
  topicName?: string
  subjectId?: string
  subjectName?: string
  subjectCode?: string
} = {}): TopicWithSubject {
  return {
    id: options.topicId ?? TEST_IDS.TOPIC_1,
    nombre: options.topicName ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT_1,
    subject: createSubject({
      id: options.subjectId ?? TEST_IDS.SUBJECT_1,
      nombre: options.subjectName ?? DEFAULT_TEST_VALUES.SUBJECT_NAME,
      codigo: options.subjectCode ?? DEFAULT_TEST_VALUES.SUBJECT_CODE,
    }),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

/**
 * Factory para crear una métrica de performance para tests
 */
export function createPerformanceMetric(
  options: PerformanceMetricOptions = {}
): PerformanceMetricWithRelations {
  const totalPreguntas = options.totalPreguntas ?? 10
  const correctas = options.correctas ?? 7
  const porcentaje = options.porcentaje ?? (totalPreguntas > 0 ? (correctas / totalPreguntas) * 100 : 0)

  return {
    id: options.id ?? TEST_IDS.METRIC_1,
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    topicId: options.topicId ?? TEST_IDS.TOPIC_1,
    totalPreguntas,
    correctas,
    porcentaje,
    nivel: null,
    tendencia: null,
    updatedAt: options.updatedAt ?? new Date(),
    topic: options.topic ?? createTopicWithSubject(),
  }
}

/**
 * Crea múltiples métricas de performance
 */
export function createMultipleMetrics(
  count: number,
  baseOptions: PerformanceMetricOptions = {}
): PerformanceMetricWithRelations[] {
  return Array.from({ length: count }, (_, i) => {
    const totalPreguntas = 10 + i * 5
    const correctas = Math.floor(totalPreguntas * 0.7) + i

    return createPerformanceMetric({
      ...baseOptions,
      id: `${TEST_IDS.METRIC_1.slice(0, 23)}${i}`,
      totalPreguntas,
      correctas,
      updatedAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Días diferentes
    })
  })
}

/**
 * Crea métricas para múltiples estudiantes
 */
export function createMetricsForMultipleStudents(
  studentIds: string[],
  metricsPerStudent: number = 2,
  baseOptions: Omit<PerformanceMetricOptions, 'studentId'> = {}
): PerformanceMetricWithRelations[] {
  const metrics: PerformanceMetricWithRelations[] = []

  studentIds.forEach((studentId, studentIndex) => {
    for (let i = 0; i < metricsPerStudent; i++) {
      const totalPreguntas = 10 + studentIndex * 5 + i * 3
      const correctas = Math.floor(totalPreguntas * (0.5 + studentIndex * 0.1)) // Diferentes porcentajes por estudiante

      metrics.push(
        createPerformanceMetric({
          ...baseOptions,
          studentId,
          id: `${TEST_IDS.METRIC_1.slice(0, 20)}${studentIndex}${i}`,
          totalPreguntas,
          correctas,
        })
      )
    }
  })

  return metrics
}

/**
 * Factory para crear un User con Student para tests
 */
export function createUserWithStudent(options: {
  email?: string
  studentId?: string
  studentName?: string
} = {}): User & { student: Student | null } {
  return {
    id: 'user-1',
    email: options.email ?? DEFAULT_TEST_VALUES.EMAIL,
    emailVerified: null,
    image: null,
    name: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: options.studentId ?? TEST_IDS.STUDENT,
      nombre: options.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME,
      userId: 'user-1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura mocks de Prisma para métricas de performance
 */
export function setupPerformanceMetricsMocks(
  metrics: PerformanceMetricWithRelations[] = []
): void {
  vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(metrics as any)
}

/**
 * Configura un usuario autenticado con estudiante para tests
 */
export function setupAuthenticatedUserWithStudent(
  user: User & { student: Student | null } | null = createUserWithStudent()
): void {
  vi.doMock('@/lib/get-session', () => ({
    getAuthenticatedUserWithStudent: vi.fn().mockResolvedValue(user),
  }))
}

/**
 * Configura un usuario no autenticado para tests
 */
export function setupUnauthenticatedUser(): void {
  vi.doMock('@/lib/get-session', () => ({
    getAuthenticatedUserWithStudent: vi.fn().mockResolvedValue(null),
  }))
}

// ============================================
// REQUEST UTILITIES
// ============================================

/**
 * Crea un NextRequest para tests
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/analytics/comparison'
  const method = options.method ?? 'GET'
  
  let url = baseUrl
  
  // ✅ Enterprise: Agregar query parameters de forma robusta
  if (options.queryParams) {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(options.queryParams)) {
      if (value !== null && value !== undefined) {
        params.append(key, String(value))
      }
    }
    const queryString = params.toString()
    if (queryString) {
      const urlObj = new URL(url)
      urlObj.search = queryString
      url = urlObj.toString()
    }
  }
  
  const headers = new Headers(options.headers)
  
  return new NextRequest(url, {
    method,
    headers,
  })
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Valida que una respuesta sea exitosa y retorna los datos
 */
export async function assertSuccessResponse<T = unknown>(response: Response): Promise<T> {
  expect(response.status).toBeGreaterThanOrEqual(200)
  expect(response.status).toBeLessThan(300)
  return (await response.json()) as T
}

/**
 * Valida que una respuesta sea un error con el código y mensaje esperados
 */
export async function assertErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedMessage?: string | ((message: string) => boolean)
): Promise<void> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  expect(data).toHaveProperty('error')
  
  if (expectedMessage) {
    if (typeof expectedMessage === 'function') {
      expect(expectedMessage(data.error)).toBe(true)
    } else {
      expect(data.error).toContain(expectedMessage)
    }
  }
}

/**
 * Valida que una respuesta tenga los campos requeridos
 */
export function assertResponseHasFields(data: unknown, fields: string[]): void {
  for (const field of fields) {
    expect(data).toHaveProperty(field)
  }
}

/**
 * Valida estructura de respuesta de comparación
 */
export function assertComparisonResponse(data: unknown): void {
  assertResponseHasFields(data, ['overall', 'bySubject', 'period', 'generatedAt'])
  
  const d = data as {
    overall: unknown
    bySubject: unknown[]
    period: string
    generatedAt: string
  }
  
  // Validar overall
  expect(d.overall).toBeDefined()
  assertResponseHasFields(d.overall, ['percentage', 'percentile', 'position', 'totalStudents', 'statistics'])
  
  // Validar bySubject
  expect(Array.isArray(d.bySubject)).toBe(true)
  
  // Validar period
  expect(typeof d.period).toBe('string')
  
  // Validar generatedAt
  expect(typeof d.generatedAt).toBe('string')
}

