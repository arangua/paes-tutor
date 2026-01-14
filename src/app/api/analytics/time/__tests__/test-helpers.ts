/**
 * Test Helpers Enterprise para API de Analytics Time
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de analytics time,
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import type {
  AttemptAnswer,
  PracticeAnswer,
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
  PRACTICE_SESSION: 'c333333333333333333333333',
  QUESTION_1: 'c444444444444444444444444',
  QUESTION_2: 'c555555555555555555555555',
  TOPIC_1: 'c666666666666666666666666',
  TOPIC_2: 'c777777777777777777777777',
  SUBJECT_1: 'c888888888888888888888888',
  SUBJECT_2: 'c999999999999999999999999',
  ANSWER_1: 'caaaaaaaaaaaaaaaaaaaaaaaa',
} as const

/**
 * Valores por defecto para objetos de prueba
 */
export const DEFAULT_TEST_VALUES = {
  EMAIL: 'test@example.com',
  STUDENT_NAME: 'Test Student',
  QUESTION_ENUNCIADO: 'Pregunta de prueba',
  TOPIC_NAME: 'Álgebra',
  SUBJECT_NAME: 'Matemáticas',
  SUBJECT_CODE: 'M1',
  DIFICULTAD: 3,
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
  /** Tiempo en segundos */
  tiempoSegundos?: number | null
  /** Si es correcta */
  esCorrecta?: boolean | null
  /** Question completa (opcional) */
  question?: QuestionWithRelations
}

/**
 * Opciones para crear un PracticeAnswer en tests
 */
export interface PracticeAnswerOptions {
  /** ID de la respuesta */
  id?: string
  /** ID de la sesión de práctica */
  practiceSessionId?: string
  /** ID de la pregunta */
  questionId?: string
  /** Tiempo en segundos */
  tiempoSegundos?: number | null
  /** Si es correcta */
  esCorrecta?: boolean | null
  /** Question completa (opcional) */
  question?: QuestionWithRelations
}

/**
 * Question con Topic y Subject incluidos
 */
export interface QuestionWithRelations extends Question {
  subject: Subject
  topic: TopicWithBasicInfo | null
}

/**
 * Topic con información básica
 */
export type TopicWithBasicInfo = Pick<Topic, 'id' | 'nombre'>

/**
 * Attempt con información básica para filtros
 */
export interface AttemptWithBasicInfo {
  id: string
  studentId: string
  estado?: string
  finishedAt?: Date | null
}

/**
 * AttemptAnswer con Question incluida
 */
export interface AttemptAnswerWithRelations extends AttemptAnswer {
  question: QuestionWithRelations
  attempt?: AttemptWithBasicInfo
}

/**
 * PracticeSession con información básica para filtros
 */
export interface PracticeSessionWithBasicInfo {
  id: string
  studentId: string
  startedAt?: Date | null
}

/**
 * PracticeAnswer con Question incluida
 */
export interface PracticeAnswerWithRelations extends PracticeAnswer {
  question: QuestionWithRelations
  practiceSession?: PracticeSessionWithBasicInfo
}

/**
 * Opciones para crear un NextRequest en tests
 */
export interface CreateRequestOptions {
  /** URL base (default: 'http://localhost/api/analytics/time') */
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
} = {}): TopicWithBasicInfo {
  return {
    id: options.id ?? TEST_IDS.TOPIC_1,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
  }
}

/**
 * Factory para crear un Question con relaciones para tests
 */
export function createQuestionWithRelations(options: {
  id?: string
  enunciado?: string
  dificultad?: number
  topicId?: string | null
  topicName?: string
  subjectId?: string
  subjectName?: string
  subjectCode?: string
} = {}): QuestionWithRelations {
  return {
    id: options.id ?? TEST_IDS.QUESTION_1,
    enunciado: options.enunciado ?? DEFAULT_TEST_VALUES.QUESTION_ENUNCIADO,
    explicacion: null,
    dificultad: options.dificultad ?? DEFAULT_TEST_VALUES.DIFICULTAD,
    topicId: options.topicId ?? TEST_IDS.TOPIC_1,
    subject: createSubject({
      id: options.subjectId ?? TEST_IDS.SUBJECT_1,
      nombre: options.subjectName ?? DEFAULT_TEST_VALUES.SUBJECT_NAME,
      codigo: options.subjectCode ?? DEFAULT_TEST_VALUES.SUBJECT_CODE,
    }),
    topic: options.topicId
      ? createTopicWithBasicInfo({
          id: options.topicId,
          nombre: options.topicName ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
        })
      : null,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    esCorrecta: options.esCorrecta ?? true,
    omitida: false,
    tiempoSegundos: options.tiempoSegundos !== undefined ? options.tiempoSegundos : 120, // 2 minutos por defecto, pero respeta null explícito
    explicacionIA: null,
    question: options.question ?? createQuestionWithRelations(),
    attempt: {
      id: options.attemptId ?? TEST_IDS.ATTEMPT,
      studentId: TEST_IDS.STUDENT,
      estado: 'completado',
      finishedAt: new Date(),
    },
  }
}

/**
 * Factory para crear un PracticeAnswer con relaciones para tests
 */
export function createPracticeAnswerWithRelations(
  options: PracticeAnswerOptions = {}
): PracticeAnswerWithRelations {
  return {
    id: options.id ?? TEST_IDS.ANSWER_1,
    practiceSessionId: options.practiceSessionId ?? TEST_IDS.PRACTICE_SESSION,
    questionId: options.questionId ?? TEST_IDS.QUESTION_1,
    optionSelectedId: null,
    esCorrecta: options.esCorrecta ?? true,
    omitida: false,
    tiempoSegundos: options.tiempoSegundos !== undefined ? options.tiempoSegundos : 120, // 2 minutos por defecto, pero respeta null explícito
    question: options.question ?? createQuestionWithRelations(),
    practiceSession: {
      id: options.practiceSessionId ?? TEST_IDS.PRACTICE_SESSION,
      studentId: TEST_IDS.STUDENT,
      startedAt: new Date(),
    },
  }
}

/**
 * Crea múltiples respuestas de intentos con diferentes tiempos
 */
export function createMultipleAttemptAnswers(
  count: number,
  baseOptions: Omit<AttemptAnswerOptions, 'tiempoSegundos'> = {}
): AttemptAnswerWithRelations[] {
  return Array.from({ length: count }, (_, i) => {
    const tiempoSegundos = 100 + i * 20 // Tiempos diferentes: 100, 120, 140, etc.

    return createAttemptAnswerWithRelations({
      ...baseOptions,
      id: `${TEST_IDS.ANSWER_1.slice(0, 23)}${i}`,
      tiempoSegundos,
      esCorrecta: i % 2 === 0, // Alternar correctas/incorrectas
    })
  })
}

/**
 * Crea múltiples respuestas de práctica con diferentes tiempos
 */
export function createMultiplePracticeAnswers(
  count: number,
  baseOptions: Omit<PracticeAnswerOptions, 'tiempoSegundos'> = {}
): PracticeAnswerWithRelations[] {
  return Array.from({ length: count }, (_, i) => {
    const tiempoSegundos = 100 + i * 20

    return createPracticeAnswerWithRelations({
      ...baseOptions,
      id: `${TEST_IDS.ANSWER_1.slice(0, 23)}${i}`,
      tiempoSegundos,
      esCorrecta: i % 2 === 0,
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
 * Configura mocks de Prisma para respuestas de intentos
 */
export function setupAttemptAnswersMocks(
  answers: AttemptAnswerWithRelations[] = []
): void {
  vi.mocked(prisma.attemptAnswer.findMany).mockImplementation((args: any) => {
    // Si hay un filtro where, aplicar el filtro a las respuestas
    if (args?.where) {
      const where = args.where
      let filtered = [...answers]
      
      // Filtrar por tiempoSegundos: { not: null } si está presente
      if (where.tiempoSegundos && typeof where.tiempoSegundos === 'object' && 'not' in where.tiempoSegundos) {
        if (where.tiempoSegundos.not === null || where.tiempoSegundos.not === undefined) {
          // Excluir respuestas con tiempoSegundos null o undefined
          filtered = filtered.filter((a: any) => 
            a.tiempoSegundos !== null && a.tiempoSegundos !== undefined && Number.isFinite(a.tiempoSegundos)
          )
        }
      }
      
      // Filtrar por attempt.studentId si está presente
      if (where.attempt?.studentId) {
        filtered = filtered.filter((a: any) => 
          a.attempt?.studentId === where.attempt.studentId
        )
      }
      
      // Filtrar por attempt.estado si está presente
      if (where.attempt?.estado) {
        filtered = filtered.filter((a: any) => 
          a.attempt?.estado === where.attempt.estado
        )
      }
      
      // Filtrar por attempt.finishedAt si está presente (para filtros de período)
      if (where.attempt?.finishedAt?.gte) {
        const minDate = new Date(where.attempt.finishedAt.gte)
        filtered = filtered.filter((a: any) => {
          if (!a.attempt?.finishedAt) return false
          const finishedAt = new Date(a.attempt.finishedAt)
          return finishedAt >= minDate
        })
      }
      
      // Filtrar por question.subjectId si está presente
      if (where.question?.subjectId) {
        filtered = filtered.filter((a: any) => 
          a.question?.subject?.id === where.question.subjectId
        )
      }
      
      return Promise.resolve(filtered as any)
    }
    
    // Si no hay filtro, retornar todas las respuestas
    return Promise.resolve(answers as any)
  })
}

/**
 * Configura mocks de Prisma para respuestas de práctica
 */
export function setupPracticeAnswersMocks(
  answers: PracticeAnswerWithRelations[] = []
): void {
  vi.mocked(prisma.practiceAnswer.findMany).mockImplementation((args: any) => {
    // Si hay un filtro where, aplicar el filtro a las respuestas
    if (args?.where) {
      const where = args.where
      let filtered = [...answers]
      
      // Filtrar por tiempoSegundos: { not: null } si está presente
      if (where.tiempoSegundos && typeof where.tiempoSegundos === 'object' && 'not' in where.tiempoSegundos) {
        if (where.tiempoSegundos.not === null) {
          // Excluir respuestas con tiempoSegundos null o undefined
          filtered = filtered.filter((a: any) => 
            a.tiempoSegundos !== null && a.tiempoSegundos !== undefined
          )
        }
      }
      
      // Filtrar por practiceSession.studentId si está presente
      if (where.practiceSession?.studentId) {
        filtered = filtered.filter((a: any) => 
          a.practiceSession?.studentId === where.practiceSession.studentId
        )
      }
      
      // Filtrar por practiceSession.startedAt si está presente (para filtros de período)
      if (where.practiceSession?.startedAt?.gte) {
        const minDate = new Date(where.practiceSession.startedAt.gte)
        filtered = filtered.filter((a: any) => {
          if (!a.practiceSession?.startedAt) return false
          const startedAt = new Date(a.practiceSession.startedAt)
          return startedAt >= minDate
        })
      }
      
      // Filtrar por question.subjectId si está presente
      if (where.question?.subjectId) {
        filtered = filtered.filter((a: any) => 
          a.question?.subject?.id === where.question.subjectId
        )
      }
      
      return Promise.resolve(filtered as any)
    }
    
    // Si no hay filtro, retornar todas las respuestas
    return Promise.resolve(answers as any)
  })
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
  const baseUrl = options.baseUrl ?? 'http://localhost/api/analytics/time'
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
 * Valida estructura de respuesta de analytics de tiempo
 */
export function assertTimeAnalyticsResponse(data: unknown): void {
  expect(data).toHaveProperty('summary')
  expect(data).toHaveProperty('byGroup')
  expect(data).toHaveProperty('recommendations')
  expect(data).toHaveProperty('period')
  expect(data).toHaveProperty('groupBy')
  expect(data).toHaveProperty('generatedAt')
  
  const d = data as {
    summary: unknown
    byGroup: unknown[]
    recommendations: string[]
    period: string
    groupBy: string
    generatedAt: string
  }
  
  // Validar summary
  expect(d.summary).toBeDefined()
  expect(d.summary).toHaveProperty('totalQuestions')
  expect(d.summary).toHaveProperty('averageTime')
  expect(d.summary).toHaveProperty('idealTime')
  expect(d.summary).toHaveProperty('efficiency')
  
  // Validar arrays
  expect(Array.isArray(d.byGroup)).toBe(true)
  expect(Array.isArray(d.recommendations)).toBe(true)
  
  // Validar period y groupBy
  expect(typeof d.period).toBe('string')
  expect(typeof d.groupBy).toBe('string')
}

