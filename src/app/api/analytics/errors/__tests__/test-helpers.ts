/**
 * Test Helpers Enterprise para API de Analytics Errors
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de analytics errors,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type {
  AttemptAnswer,
  Attempt,
  Question,
  Topic,
  Subject,
  Student,
  User,
} from '@prisma/client'

// ============================================
// CONSTANTES DE TEST
// ============================================

/**
 * CUIDs válidos para los tests
 */
export const TEST_IDS = {
  STUDENT: 'c111111111111111111111111',
  ATTEMPT: 'c222222222222222222222222',
  QUESTION_1: 'c333333333333333333333333',
  QUESTION_2: 'c444444444444444444444444',
  TOPIC_1: 'c555555555555555555555555',
  TOPIC_2: 'c666666666666666666666666',
  SUBJECT_1: 'c777777777777777777777777',
  SUBJECT_2: 'c888888888888888888888888',
  ANSWER_1: 'c999999999999999999999999',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL: 'test@example.com',
  STUDENT_NAME: 'Test Student',
  QUESTION_ENUNCIADO: 'Pregunta de prueba',
  TOPIC_NAME: 'Álgebra',
  EJE_TEMATICO: 'Números',
  SUBJECT_NAME: 'Matemáticas',
  SUBJECT_CODE: 'M1',
} as const

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear un AttemptAnswer en tests
 */
export interface AttemptAnswerOptions {
  /** ID de la respuesta */
  id?: string
  /** ID del intento */
  attemptId?: string
  /** ID de la pregunta */
  questionId?: string
  /** Si es correcta */
  esCorrecta?: boolean | null
  /** Si está omitida */
  omitida?: boolean
  /** Attempt completo (opcional) */
  attempt?: AttemptWithBasicInfo
  /** Question completa (opcional) */
  question?: QuestionWithRelations
}

/**
 * Attempt con información básica
 */
export type AttemptWithBasicInfo = Pick<Attempt, 'id' | 'startedAt' | 'studentId'>

/**
 * Question con Topic y Subject incluidos
 */
export interface QuestionWithRelations extends Question {
  topic: TopicWithBasicInfo | null
  subject: Subject
}

/**
 * Topic con información básica
 */
export type TopicWithBasicInfo = Pick<Topic, 'id' | 'nombre' | 'ejeTematico' | 'subjectId'>

/**
 * AttemptAnswer con relaciones completas
 */
export interface AttemptAnswerWithRelations extends AttemptAnswer {
  attempt: AttemptWithBasicInfo
  question: QuestionWithRelations
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/analytics/errors') */
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
 * Factory para crear un Topic con información básica para tests
 */
export function createTopicWithBasicInfo(options: {
  id?: string
  nombre?: string
  ejeTematico?: string
  subjectId?: string
} = {}): TopicWithBasicInfo {
  return {
    id: options.id ?? TEST_IDS.TOPIC_1,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
    ejeTematico: options.ejeTematico ?? DEFAULT_TEST_VALUES.EJE_TEMATICO,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT_1,
  }
}

/**
 * Factory para crear un Question con relaciones para tests
 */
export function createQuestionWithRelations(options: {
  id?: string
  enunciado?: string
  topicId?: string | null
  topicName?: string
  subjectId?: string
  subjectName?: string
  subjectCode?: string
} = {}): QuestionWithRelations {
  const topicId = options.topicId ?? TEST_IDS.TOPIC_1
  return {
    id: options.id ?? TEST_IDS.QUESTION_1,
    enunciado: options.enunciado ?? DEFAULT_TEST_VALUES.QUESTION_ENUNCIADO,
    explicacion: null,
    topicId: topicId,
    topic: topicId
      ? createTopicWithBasicInfo({
          id: topicId,
          nombre: options.topicName,
          subjectId: options.subjectId ?? TEST_IDS.SUBJECT_1,
        })
      : null,
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
 * Factory para crear un Attempt con información básica para tests
 */
export function createAttemptWithBasicInfo(options: {
  id?: string
  startedAt?: Date
  studentId?: string
} = {}): AttemptWithBasicInfo {
  return {
    id: options.id ?? TEST_IDS.ATTEMPT,
    startedAt: options.startedAt ?? new Date(),
    studentId: options.studentId ?? TEST_IDS.STUDENT,
  }
}

/**
 * Factory para crear un AttemptAnswer con relaciones para tests
 */
export function createAttemptAnswerWithRelations(
  options: AttemptAnswerOptions = {}
): AttemptAnswerWithRelations {
  return {
    id: options.id ?? TEST_IDS.ANSWER_1,
    attemptId: options.attemptId ?? TEST_IDS.ATTEMPT,
    questionId: options.questionId ?? TEST_IDS.QUESTION_1,
    optionSelectedId: null,
    esCorrecta: options.esCorrecta ?? false,
    omitida: options.omitida ?? false,
    tiempoSegundos: null,
    explicacionIA: null,
    attempt: options.attempt ?? createAttemptWithBasicInfo(),
    question: options.question ?? createQuestionWithRelations(),
  }
}

/**
 * Crea múltiples respuestas incorrectas para tests
 */
export function createMultipleIncorrectAnswers(
  count: number,
  baseOptions: Omit<AttemptAnswerOptions, 'esCorrecta' | 'omitida'> = {}
): AttemptAnswerWithRelations[] {
  return Array.from({ length: count }, (_, i) => {
    const ahora = new Date()
    const fecha = new Date(ahora.getTime() - i * 24 * 60 * 60 * 1000) // Días diferentes
    const questionIndex = i % 2
    const topicId = questionIndex === 0 ? TEST_IDS.TOPIC_1 : TEST_IDS.TOPIC_2

    return createAttemptAnswerWithRelations({
      ...baseOptions,
      id: `${TEST_IDS.ANSWER_1.slice(0, 23)}${i}`,
      esCorrecta: false,
      omitida: false,
      attempt: createAttemptWithBasicInfo({
        startedAt: fecha,
      }),
      question: createQuestionWithRelations({
        id: `${TEST_IDS.QUESTION_1.slice(0, 23)}${questionIndex}`, // Alternar entre 2 preguntas
        topicId: topicId,
      }),
    })
  })
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
 * Configura mocks de Prisma para respuestas incorrectas
 */
export function setupAttemptAnswersMocks(
  answers: AttemptAnswerWithRelations[] = []
): void {
  vi.mocked(prisma.attemptAnswer.findMany).mockImplementation((args: any) => {
    // Si hay un filtro where, aplicar el filtro a las respuestas
    if (args?.where) {
      const where = args.where
      let filtered = [...answers]
      
      // Filtrar por esCorrecta si está presente
      if (where.esCorrecta !== undefined && where.esCorrecta !== null) {
        filtered = filtered.filter((a: any) => a.esCorrecta === where.esCorrecta)
      }
      
      // Filtrar por omitida si está presente
      if (where.omitida !== undefined && where.omitida !== null) {
        filtered = filtered.filter((a: any) => a.omitida === where.omitida)
      }
      
      // Filtrar por attempt.studentId si está presente (aunque en tests siempre debería coincidir)
      if (where.attempt?.studentId) {
        filtered = filtered.filter((a: any) => 
          a.attempt?.studentId === where.attempt.studentId
        )
      }
      
      return Promise.resolve(filtered as any)
    }
    
    // Si no hay filtro, retornar todas las respuestas
    return Promise.resolve(answers as any)
  })
}

/**
 * Configura mocks de Prisma para conteo de intentos
 */
export function setupAttemptCountMocks(
  totalAttempts: number = 0,
  recentAttempts: number = 0
): void {
  vi.mocked(prisma.attempt.count)
    .mockResolvedValueOnce(totalAttempts)
    .mockResolvedValueOnce(recentAttempts)
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
  const baseUrl = options.baseUrl ?? 'http://localhost/api/analytics/errors'
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
 * Valida estructura de respuesta de análisis de errores
 */
export function assertErrorsResponse(data: unknown): void {
  expect(data).toHaveProperty('summary')
  expect(data).toHaveProperty('topErrors')
  expect(data).toHaveProperty('errorsByTopic')
  expect(data).toHaveProperty('errorsBySubject')
  
  const d = data as {
    summary: unknown
    topErrors: unknown[]
    errorsByTopic: unknown[]
    errorsBySubject: unknown[]
  }
  
  // Validar summary
  expect(d.summary).toBeDefined()
  expect(d.summary).toHaveProperty('totalErrors')
  expect(d.summary).toHaveProperty('uniqueQuestions')
  expect(d.summary).toHaveProperty('topicsAffected')
  expect(d.summary).toHaveProperty('trend')
  expect(d.summary).toHaveProperty('recentErrorRate')
  expect(d.summary).toHaveProperty('olderErrorRate')
  
  // Validar arrays
  expect(Array.isArray(d.topErrors)).toBe(true)
  expect(Array.isArray(d.errorsByTopic)).toBe(true)
  expect(Array.isArray(d.errorsBySubject)).toBe(true)
}

