/**
 * Test Helpers Enterprise para API de Analytics Joint Progress
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de joint progress,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Student, User, Attempt, Exam, Subject, PerformanceMetric, Topic } from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests
 */
export const TEST_IDS = {
  STUDENT_1: 'c111111111111111111111111',
  STUDENT_2: 'c222222222222222222222222',
  EXAM_1: 'c333333333333333333333333',
  EXAM_2: 'c444444444444444444444444',
  SUBJECT_1: 'c555555555555555555555555',
  SUBJECT_2: 'c666666666666666666666666',
  TOPIC_1: 'c777777777777777777777777',
  TOPIC_2: 'c888888888888888888888888',
  ATTEMPT_1: 'c999999999999999999999999',
  METRIC_1: 'caaaaaaaaaaaaaaaaaaaaaaaa',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL_1: 'student1@example.com',
  EMAIL_2: 'student2@example.com',
  STUDENT_NAME_1: 'Estudiante 1',
  STUDENT_NAME_2: 'Estudiante 2',
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
  /** Puntaje PAES */
  puntajePaes?: number | null
  /** Preguntas correctas */
  correctas?: number
  /** Total de preguntas */
  totalPreguntas?: number
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
 * Attempt con Exam y Subject incluidos
 */
export interface AttemptWithExam extends Attempt {
  exam: ExamWithSubject
}

/**
 * PerformanceMetric con Topic y Subject incluidos
 */
export interface PerformanceMetricWithRelations extends PerformanceMetric {
  topic: TopicWithSubject
}

/**
 * Topic con Subject incluido
 */
export interface TopicWithSubject extends Topic {
  subject: Subject
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/analytics/joint-progress') */
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
    ejeTematico: null,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT_1,
    codigoTemarioOficial: null,
    habilidadesTemario: null,
    vigenciaDesde: null,
    vigenciaHasta: null,
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
 * Factory para crear un Attempt con Exam para tests
 */
export function createAttemptWithExam(
  options: AttemptOptions = {}
): AttemptWithExam {
  const totalPreguntas = options.totalPreguntas ?? 20
  const correctas = options.correctas ?? 15
  const porcentaje = options.porcentaje ?? (totalPreguntas > 0 ? (correctas / totalPreguntas) * 100 : 0)

  return {
    id: options.id ?? TEST_IDS.ATTEMPT_1,
    studentId: options.studentId ?? TEST_IDS.STUDENT_1,
    examId: options.examId ?? TEST_IDS.EXAM_1,
    proceso: null,
    tipoAplicacion: null,
    forma: null,
    estado: options.estado ?? 'completado',
    porcentaje,
    puntajePaes: options.puntajePaes ?? null,
    correctas,
    incorrectas: totalPreguntas - correctas,
    omitidas: 0,
    puntajeEstimado: false,
    analisisIA: null,
    fortalezas: null,
    debilidades: null,
    recomendaciones: null,
    startedAt: new Date(),
    finishedAt: new Date(),
    duracionSegundos: null,
    createdAt: options.createdAt ?? new Date(),
    exam: options.exam ?? createExamWithSubject(),
  }
}

/**
 * Crea múltiples intentos para un estudiante
 */
export function createMultipleAttempts(
  studentId: string,
  count: number,
  baseOptions: Omit<AttemptOptions, 'studentId'> = {}
): AttemptWithExam[] {
  return Array.from({ length: count }, (_, i) => {
    const totalPreguntas = 20 + i * 5
    const correctas = Math.floor(totalPreguntas * (0.6 + i * 0.05))

    return createAttemptWithExam({
      ...baseOptions,
      studentId,
      id: `${TEST_IDS.ATTEMPT_1.slice(0, 23)}${i}`,
      totalPreguntas,
      correctas,
      porcentaje: (correctas / totalPreguntas) * 100,
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Días diferentes
    })
  })
}

/**
 * Factory para crear un PerformanceMetric con relaciones para tests
 */
export function createPerformanceMetricWithRelations(options: {
  studentId?: string
  topicId?: string
  porcentaje?: number
  totalPreguntas?: number
  correctas?: number
} = {}): PerformanceMetricWithRelations {
  return {
    id: TEST_IDS.METRIC_1,
    studentId: options.studentId ?? TEST_IDS.STUDENT_1,
    topicId: options.topicId ?? TEST_IDS.TOPIC_1,
    porcentaje: options.porcentaje ?? 75,
    totalPreguntas: options.totalPreguntas ?? 20,
    correctas: options.correctas ?? 15,
    nivel: null,
    tendencia: null,
    updatedAt: new Date(),
    topic: createTopicWithSubject({
      topicId: options.topicId ?? TEST_IDS.TOPIC_1,
    }),
  }
}

/**
 * Factory para crear un Student con User para tests
 */
export function createStudentWithUser(options: {
  studentId?: string
  studentName?: string
  email?: string
} = {}): Student & { user: User | null } {
  return {
    id: options.studentId ?? TEST_IDS.STUDENT_1,
    nombre: options.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME_1,
    userId: 'user-1',
    createdAt: new Date(),
    updatedAt: new Date(),
    user: {
      id: 'user-1',
      email: options.email ?? DEFAULT_TEST_VALUES.EMAIL_1,
      emailVerified: null,
      image: null,
      name: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  }
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
    email: options.email ?? DEFAULT_TEST_VALUES.EMAIL_1,
    emailVerified: null,
    image: null,
    name: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    student: {
      id: options.studentId ?? TEST_IDS.STUDENT_1,
      nombre: options.studentName ?? DEFAULT_TEST_VALUES.STUDENT_NAME_1,
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
 * Configura mocks de Prisma para estudiantes
 */
export function setupStudentsMocks(
  students: Array<Student & { user: User | null }> = []
): void {
  vi.mocked(prisma.student.findMany).mockResolvedValue(students as any)
}

/**
 * Configura mocks de Prisma para intentos
 */
export function setupAttemptsMocks(
  currentAttempts: AttemptWithExam[] = [],
  otherAttempts: AttemptWithExam[] = []
): void {
  vi.mocked(prisma.attempt.findMany)
    .mockResolvedValueOnce(currentAttempts as any)
    .mockResolvedValueOnce(otherAttempts as any)
}

/**
 * Configura mocks de Prisma para métricas de performance
 */
export function setupPerformanceMetricsMocks(
  currentMetrics: PerformanceMetricWithRelations[] = [],
  otherMetrics: PerformanceMetricWithRelations[] = []
): void {
  vi.mocked(prisma.performanceMetric.findMany)
    .mockResolvedValueOnce(currentMetrics as any)
    .mockResolvedValueOnce(otherMetrics as any)
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

// ============================================
// REQUEST UTILITIES
// ============================================

/**
 * Crea un NextRequest para tests
 */
export function createTestRequest(options: CreateRequestOptions = {}): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/analytics/joint-progress'
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
 * Valida estructura de respuesta de progreso conjunto
 */
export function assertJointProgressResponse(data: unknown): void {
  expect(data).toHaveProperty('current')
  expect(data).toHaveProperty('other')
  
  const d = data as {
    current: unknown
    other: unknown
  }
  
  // Validar current
  expect(d.current).toBeDefined()
  expect(d.current).toHaveProperty('student')
  expect(d.current).toHaveProperty('progress')
  
  // Validar other
  expect(d.other).toBeDefined()
  expect(d.other).toHaveProperty('student')
  expect(d.other).toHaveProperty('progress')
  
  // Validar estructura de progress
  const currentProgress = (d.current as { progress: unknown }).progress as {
    totalAttempts: number
    averagePercentage: number
    bestPercentage: number
    averagePaesScore: number | null
    bestPaesScore: number | null
    recentAttempts: unknown[]
    topTopics: unknown[]
    trend: string
  }
  
  expect(typeof currentProgress.totalAttempts).toBe('number')
  expect(typeof currentProgress.averagePercentage).toBe('number')
  expect(typeof currentProgress.bestPercentage).toBe('number')
  expect(['improving', 'declining', 'stable']).toContain(currentProgress.trend)
  expect(Array.isArray(currentProgress.recentAttempts)).toBe(true)
  expect(Array.isArray(currentProgress.topTopics)).toBe(true)
}

