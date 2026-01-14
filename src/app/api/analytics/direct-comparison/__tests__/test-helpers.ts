/**
 * Test Helpers Enterprise para API de Analytics Direct Comparison
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de direct comparison,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type { Student, User, Attempt, Exam, Subject } from '@prisma/client'

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
  ATTEMPT_1: 'c777777777777777777777777',
  ATTEMPT_2: 'c888888888888888888888888',
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
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/analytics/direct-comparison') */
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
    estado: options.estado ?? 'completado',
    porcentaje,
    puntajePaes: options.puntajePaes ?? null,
    correctas,
    incorrectas: totalPreguntas - correctas,
    omitidas: 0,
    totalPreguntas,
    puntajeEstimado: false,
    startedAt: new Date(),
    finishedAt: new Date(),
    duracionSegundos: null,
    createdAt: options.createdAt ?? new Date(),
    updatedAt: new Date(),
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
      createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Días diferentes
    })
  })
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
  const baseUrl = options.baseUrl ?? 'http://localhost/api/analytics/direct-comparison'
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
 * Valida estructura de respuesta de comparación directa
 */
export function assertDirectComparisonResponse(data: unknown): void {
  expect(data).toHaveProperty('current')
  expect(data).toHaveProperty('other')
  expect(data).toHaveProperty('commonExams')
  expect(data).toHaveProperty('summary')
  
  const d = data as {
    current: unknown
    other: unknown
    commonExams: unknown[]
    summary: unknown
  }
  
  // Validar current
  expect(d.current).toBeDefined()
  expect(d.current).toHaveProperty('student')
  expect(d.current).toHaveProperty('stats')
  expect(d.current).toHaveProperty('subjectStats')
  
  // Validar other
  expect(d.other).toBeDefined()
  expect(d.other).toHaveProperty('student')
  expect(d.other).toHaveProperty('stats')
  expect(d.other).toHaveProperty('subjectStats')
  
  // Validar commonExams
  expect(Array.isArray(d.commonExams)).toBe(true)
  
  // Validar summary
  expect(d.summary).toBeDefined()
  expect(d.summary).toHaveProperty('currentWins')
  expect(d.summary).toHaveProperty('otherWins')
  expect(d.summary).toHaveProperty('ties')
  expect(d.summary).toHaveProperty('averageDifference')
}

