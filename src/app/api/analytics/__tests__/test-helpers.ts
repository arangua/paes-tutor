/**
 * Test Helpers Enterprise para API de Analytics
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de analytics,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Attempt, Exam, Subject, PerformanceMetric } from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests
 */
export const TEST_IDS = {
  STUDENT: 'c111111111111111111111111',
  EXAM_1: 'c222222222222222222222222',
  EXAM_2: 'c333333333333333333333333',
  SUBJECT_1: 'c444444444444444444444444',
  SUBJECT_2: 'c555555555555555555555555',
  TOPIC_1: 'c666666666666666666666666',
  TOPIC_2: 'c777777777777777777777777',
  ATTEMPT_1: 'c888888888888888888888888',
  METRIC_1: 'c999999999999999999999999',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EXAM_TITLE: 'Examen de Prueba',
  SUBJECT_NAME: 'Matemáticas',
  SUBJECT_CODE: 'M1',
  TOPIC_NAME: 'Álgebra',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear un Attempt en tests
 */
export interface AttemptOptions {
  /** ID del intento */
  id?: string
  /** ID del estudiante */
  studentId?: string
  /** ID del examen */
  examId?: string
  /** Estado del intento */
  estado?: 'en_progreso' | 'completado' | 'cancelado'
  /** Porcentaje */
  porcentaje?: number
  /** Fecha de creación */
  createdAt?: Date
  /** Exam completo (opcional) */
  exam?: ExamWithSubject
}

/**
 * Exam con Subject incluido
 */
export interface ExamWithSubject extends Exam {
  subject: Subject
}

/**
 * Attempt con Exam y Subject incluidos (formato select)
 */
export interface AttemptWithSelect extends Pick<Attempt, 'id' | 'porcentaje' | 'createdAt'> {
  exam: {
    titulo: string
    subject: {
      nombre: string
      codigo: string
    }
  }
}

/**
 * PerformanceMetric con Topic y Subject incluidos (formato select)
 */
export interface PerformanceMetricWithSelect extends Pick<PerformanceMetric, 'topicId' | 'porcentaje' | 'totalPreguntas' | 'correctas'> {
  topic: {
    nombre: string
    subject: {
      nombre: string
    }
  }
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/analytics') */
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
 * Factory para crear un Exam con Subject para tests
 */
export function createExamWithSubject(options: {
  examId?: string
  examTitle?: string
  subjectId?: string
  subjectName?: string
  subjectCode?: string
} = {}): ExamWithSubject {
  return {
    id: options.examId ?? TEST_IDS.EXAM_1,
    titulo: options.examTitle ?? DEFAULT_TEST_VALUES.EXAM_TITLE,
    descripcion: null,
    tipo: 'paes',
    tiempoLimiteMin: null,
    totalPreguntas: 20,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT_1,
    esSimulacionOficial: false,
    procesoAdmision: null,
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
 * Factory para crear un Attempt con formato select para tests
 */
export function createAttemptWithSelect(
  options: AttemptOptions = {}
): AttemptWithSelect {
  const porcentaje = options.porcentaje ?? 75
  const exam = options.exam ?? createExamWithSubject()

  return {
    id: options.id ?? TEST_IDS.ATTEMPT_1,
    porcentaje,
    createdAt: options.createdAt ?? new Date(),
    exam: {
      titulo: exam.titulo,
      subject: {
        nombre: exam.subject.nombre,
        codigo: exam.subject.codigo,
      },
    },
  }
}

/**
 * Crea múltiples intentos para tests
 */
export function createMultipleAttempts(
  count: number,
  baseOptions: AttemptOptions = {}
): AttemptWithSelect[] {
  return Array.from({ length: count }, (_, i) => {
    const porcentaje = 60 + i * 5 // 60, 65, 70, 75, etc.

    return createAttemptWithSelect({
      ...baseOptions,
      id: `${TEST_IDS.ATTEMPT_1.slice(0, 23)}${i}`,
      porcentaje,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Días diferentes
    })
  })
}

/**
 * Factory para crear un PerformanceMetric con formato select para tests
 */
export function createPerformanceMetricWithSelect(options: {
  topicId?: string
  topicName?: string
  subjectName?: string
  porcentaje?: number
  totalPreguntas?: number
  correctas?: number
} = {}): PerformanceMetricWithSelect {
  return {
    topicId: options.topicId ?? TEST_IDS.TOPIC_1,
    porcentaje: options.porcentaje ?? 75,
    totalPreguntas: options.totalPreguntas ?? 20,
    correctas: options.correctas ?? 15,
    topic: {
      nombre: options.topicName ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
      subject: {
        nombre: options.subjectName ?? DEFAULT_TEST_VALUES.SUBJECT_NAME,
      },
    },
  }
}

/**
 * Crea múltiples métricas para tests
 */
export function createMultipleMetrics(
  count: number,
  baseOptions: Omit<Parameters<typeof createPerformanceMetricWithSelect>[0], 'topicId'> = {}
): PerformanceMetricWithSelect[] {
  return Array.from({ length: count }, (_, i) => {
    const porcentaje = 50 + i * 10 // 50, 60, 70, 80, etc.

    return createPerformanceMetricWithSelect({
      ...baseOptions,
      topicId: `${TEST_IDS.TOPIC_1.slice(0, 23)}${i}`,
      porcentaje,
    })
  })
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura mocks de Prisma para intentos
 */
export function setupAttemptsMocks(
  attempts: AttemptWithSelect[] = []
): void {
  vi.mocked(prisma.attempt.findMany).mockResolvedValue(attempts as any)
}

/**
 * Configura mocks de Prisma para métricas de performance
 */
export function setupPerformanceMetricsMocks(
  metrics: PerformanceMetricWithSelect[] = []
): void {
  vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(metrics as any)
}

/**
 * Configura un estudiante autenticado para tests
 */
export function setupAuthenticatedStudent(
  studentId: string = TEST_IDS.STUDENT
): void {
  vi.doMock('@/lib/get-session', () => ({
    getCurrentStudentId: vi.fn().mockResolvedValue(studentId),
  }))
}

/**
 * Configura un usuario no autenticado para tests
 */
export function setupUnauthenticatedStudent(): void {
  vi.doMock('@/lib/get-session', () => ({
    getCurrentStudentId: vi.fn().mockResolvedValue(null),
  }))
}

/**
 * Configura caché para tests
 */
export function setupCacheMocks(
  cachedValue: unknown = null,
  shouldCache: boolean = false
): void {
  vi.doMock('@/lib/cache', () => ({
    getCached: vi.fn(async (key: string, fetcher: () => Promise<unknown>) => {
      if (shouldCache && cachedValue !== null) {
        return cachedValue
      }
      return await fetcher()
    }),
    cacheKeys: {
      studentAnalytics: (studentId: string) => `student:${studentId}:analytics`,
    },
  }))
}

// ============================================
// REQUEST UTILITIES
// ============================================

/**
 * Crea un NextRequest para tests
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/analytics'
  const method = options.method ?? 'GET'
  
  let url = baseUrl
  
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
 * Valida estructura de respuesta de analytics avanzado
 */
export function assertAdvancedAnalyticsResponse(data: unknown): void {
  expect(data).toHaveProperty('trends')
  expect(data).toHaveProperty('strengths')
  expect(data).toHaveProperty('weaknesses')
  expect(data).toHaveProperty('paesPrediction')
  expect(data).toHaveProperty('comparison')
  expect(data).toHaveProperty('subjectBreakdown')
  
  const d = data as {
    trends: unknown[]
    strengths: unknown[]
    weaknesses: unknown[]
    paesPrediction: unknown | null
    comparison: unknown | null
    subjectBreakdown: unknown[]
  }
  
  // Validar arrays
  expect(Array.isArray(d.trends)).toBe(true)
  expect(Array.isArray(d.strengths)).toBe(true)
  expect(Array.isArray(d.weaknesses)).toBe(true)
  expect(Array.isArray(d.subjectBreakdown)).toBe(true)
}

