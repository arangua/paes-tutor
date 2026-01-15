/**
 * Test Helpers Enterprise para API de Attempts/[id]
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de attempts/[id],
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { invalidateCachePattern } from '@/lib/cache'
import { validateBody } from '@/lib/api-helpers'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
  assertResponseHasFields,
  TestScenarioBuilder,
  ErrorScenarioBuilder,
  type CreateRequestOptions,
} from '@/app/api/attempts/__tests__/test-helpers'
import type {
  Attempt,
  AttemptAnswer,
  Exam,
  ExamQuestion,
  Question,
  QuestionOption,
  Subject,
  Topic,
} from '@prisma/client'

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear un Attempt con todas sus relaciones
 */
export interface AttemptWithRelationsOptions {
  id?: string
  studentId?: string
  estado?: 'en_progreso' | 'completado' | 'cancelado'
  examId?: string
  exam?: {
    id?: string
    titulo?: string
    subject?: {
      id?: string
      nombre?: string
      codigo?: string
    }
    questions?: Array<{
      questionId?: string
      orden?: number
      question?: {
        id?: string
        enunciado?: string
        options?: Array<{
          id?: string
          texto?: string
          esCorrecta?: boolean
        }>
      }
    }>
  }
  answers?: Array<{
    id?: string
    questionId?: string
    optionSelectedId?: string | null
    esCorrecta?: boolean | null
    omitida?: boolean
    question?: {
      id?: string
      options?: Array<{
        id?: string
        texto?: string
        esCorrecta?: boolean
      }>
      topic?: {
        id?: string
        nombre?: string
      } | null
    }
    optionSelected?: {
      id?: string
      texto?: string
      esCorrecta?: boolean
    } | null
  }>
  totalPreguntas?: number
  correctas?: number
  incorrectas?: number
  omitidas?: number
  porcentaje?: number
  startedAt?: Date
  finishedAt?: Date | null
  duracionSegundos?: number | null
}

/**
 * Opciones para crear un ExamQuestion con Question
 */
export interface ExamQuestionOptions {
  questionId?: string
  orden?: number
  question?: {
    id?: string
    enunciado?: string
    options?: Array<{
      id?: string
      texto?: string
      esCorrecta?: boolean
    }>
  }
}

/**
 * Opciones para crear un AttemptAnswer con Question
 */
export interface AttemptAnswerOptions {
  id?: string
  questionId?: string
  optionSelectedId?: string | null
  esCorrecta?: boolean | null
  omitida?: boolean
  question?: {
    id?: string
    options?: Array<{
      id?: string
      texto?: string
      esCorrecta?: boolean
    }>
    topic?: {
      id?: string
      nombre?: string
    } | null
  }
  optionSelected?: {
    id?: string
    texto?: string
    esCorrecta?: boolean
  } | null
}

// ============================================
// FACTORIES
// ============================================

/**
 * Factory para crear un Subject completo
 */
export function createSubject(options: {
  id?: string
  nombre?: string
  codigo?: string
} = {}): Subject {
  return {
    id: options.id ?? TEST_IDS.SUBJECT,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.SUBJECT_NAME,
    codigo: options.codigo ?? DEFAULT_TEST_VALUES.SUBJECT_CODE,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Subject
}

/**
 * Factory para crear un Topic completo
 */
export function createTopic(options: {
  id?: string
  nombre?: string
} = {}): Topic {
  return {
    id: options.id ?? TEST_IDS.TOPIC,
    nombre: options.nombre ?? DEFAULT_TEST_VALUES.TOPIC_NAME,
    subjectId: TEST_IDS.SUBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as Topic
}

/**
 * Factory para crear un QuestionOption
 */
export function createQuestionOption(options: {
  id?: string
  questionId?: string
  texto?: string
  esCorrecta?: boolean
  letra?: string
} = {}): QuestionOption {
  return {
    id: options.id ?? TEST_IDS.OPTION,
    questionId: options.questionId ?? TEST_IDS.QUESTION,
    texto: options.texto ?? DEFAULT_TEST_VALUES.OPTION_TEXT,
    esCorrecta: options.esCorrecta ?? false,
    letra: options.letra ?? 'A',
    createdAt: new Date(),
    updatedAt: new Date(),
  } as QuestionOption
}

/**
 * Factory para crear un Question con Options
 */
export function createQuestionWithOptions(options: {
  id?: string
  enunciado?: string
  topicId?: string
  options?: Array<{
    id?: string
    texto?: string
    esCorrecta?: boolean
  }>
} = {}): Question & { options: QuestionOption[] } {
  const questionId = options.id ?? TEST_IDS.QUESTION
  const defaultOptions = [
    createQuestionOption({ id: TEST_IDS.OPTION, questionId, texto: 'Opción A', esCorrecta: true }),
    createQuestionOption({ id: TEST_IDS.OPTION_2, questionId, texto: 'Opción B', esCorrecta: false }),
  ]

  return {
    id: questionId,
    enunciado: options.enunciado ?? DEFAULT_TEST_VALUES.QUESTION_TEXT,
    explicacion: 'Test explanation',
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    createdAt: new Date(),
    updatedAt: new Date(),
    options: options.options
      ? options.options.map((opt, idx) =>
          createQuestionOption({
            id: opt.id ?? (idx === 0 ? TEST_IDS.OPTION : TEST_IDS.OPTION_2),
            questionId,
            texto: opt.texto ?? `Opción ${String.fromCharCode(65 + idx)}`,
            esCorrecta: opt.esCorrecta ?? idx === 0,
          })
        )
      : defaultOptions,
  } as Question & { options: QuestionOption[] }
}

/**
 * Factory para crear un ExamQuestion con Question
 */
export function createExamQuestion(options: ExamQuestionOptions = {}): ExamQuestion & {
  question: Question & { options: QuestionOption[] }
} {
  const questionId = options.questionId ?? TEST_IDS.QUESTION
  const question = options.question
    ? createQuestionWithOptions({
        id: questionId,
        enunciado: options.question.enunciado,
        options: options.question.options,
      })
    : createQuestionWithOptions({ id: questionId })

  return {
    examId: TEST_IDS.EXAM,
    questionId,
    orden: options.orden ?? 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    question,
  } as ExamQuestion & { question: Question & { options: QuestionOption[] } }
}

/**
 * Factory para crear un Exam con Subject y Questions
 */
export function createExamWithRelations(options: {
  id?: string
  titulo?: string
  subject?: {
    id?: string
    nombre?: string
    codigo?: string
  }
  questions?: Array<ExamQuestionOptions>
} = {}): Exam & {
  subject: Subject
  questions: Array<ExamQuestion & { question: Question & { options: QuestionOption[] } }>
} {
  const examId = options.id ?? TEST_IDS.EXAM
  const defaultQuestions = [
    createExamQuestion({ questionId: TEST_IDS.QUESTION, orden: 1 }),
    createExamQuestion({ questionId: TEST_IDS.QUESTION_2, orden: 2 }),
  ]

  return {
    id: examId,
    titulo: options.titulo ?? DEFAULT_TEST_VALUES.EXAM_TITLE,
    descripcion: DEFAULT_TEST_VALUES.EXAM_DESCRIPTION,
    tipo: 'objetiva',
    tiempoLimiteMin: null,
    totalPreguntas: options.questions?.length ?? defaultQuestions.length,
    subjectId: options.subject?.id ?? TEST_IDS.SUBJECT,
    createdAt: new Date(),
    updatedAt: new Date(),
    subject: createSubject(options.subject),
    questions: options.questions
      ? options.questions.map((q, idx) => createExamQuestion({ ...q, orden: q.orden ?? idx + 1 }))
      : defaultQuestions,
  } as Exam & {
    subject: Subject
    questions: Array<ExamQuestion & { question: Question & { options: QuestionOption[] } }>
  }
}

/**
 * Factory para crear un AttemptAnswer con Question y OptionSelected
 */
export function createAttemptAnswer(options: AttemptAnswerOptions = {}): AttemptAnswer & {
  question: Question & {
    options: QuestionOption[]
    topic: Topic | null
  }
  optionSelected: QuestionOption | null
} {
  const questionId = options.questionId ?? TEST_IDS.QUESTION
  const question = options.question
    ? createQuestionWithOptions({
        id: questionId,
        enunciado: options.question.enunciado,
        options: options.question.options,
      })
    : createQuestionWithOptions({ id: questionId })

  const optionSelected = options.optionSelectedId
    ? question.options.find(opt => opt.id === options.optionSelectedId) ?? null
    : options.optionSelected ?? null

  return {
    id: options.id ?? TEST_IDS.ATTEMPT,
    attemptId: TEST_IDS.ATTEMPT,
    questionId,
    optionSelectedId: options.optionSelectedId ?? null,
    esCorrecta: options.esCorrecta ?? (optionSelected?.esCorrecta ?? false),
    omitida: options.omitida ?? false,
    createdAt: new Date(),
    updatedAt: new Date(),
    question: {
      ...question,
      topic: options.question?.topic ? createTopic(options.question.topic) : null,
    },
    optionSelected,
  } as AttemptAnswer & {
    question: Question & {
      options: QuestionOption[]
      topic: Topic | null
    }
    optionSelected: QuestionOption | null
  }
}

/**
 * Factory para crear un Attempt completo con todas sus relaciones
 */
export function createAttemptWithRelations(
  options: AttemptWithRelationsOptions = {}
): Attempt & {
  exam: Exam & {
    subject: Subject
    questions: Array<ExamQuestion & { question: Question & { options: QuestionOption[] } }>
  }
  answers: Array<
    AttemptAnswer & {
      question: Question & {
        options: QuestionOption[]
        topic: Topic | null
      }
      optionSelected: QuestionOption | null
    }
  >
} {
  const attemptId = options.id ?? TEST_IDS.ATTEMPT
  const studentId = options.studentId ?? TEST_IDS.STUDENT
  const examId = options.examId ?? TEST_IDS.EXAM
  const now = new Date()

  const exam = options.exam
    ? createExamWithRelations({
        id: examId,
        titulo: options.exam.titulo,
        subject: options.exam.subject,
        questions: options.exam.questions,
      })
    : createExamWithRelations({ id: examId })

  const defaultAnswers: Array<
    AttemptAnswer & {
      question: Question & {
        options: QuestionOption[]
        topic: Topic | null
      }
      optionSelected: QuestionOption | null
    }
  > = []

  // Si hay respuestas proporcionadas, crearlas
  if (options.answers && options.answers.length > 0) {
    for (const answerOpt of options.answers) {
      const examQuestion = exam.questions.find(q => q.questionId === answerOpt.questionId)
      if (examQuestion) {
        defaultAnswers.push(
          createAttemptAnswer({
            id: answerOpt.id,
            questionId: answerOpt.questionId,
            optionSelectedId: answerOpt.optionSelectedId,
            esCorrecta: answerOpt.esCorrecta,
            omitida: answerOpt.omitida,
            question: answerOpt.question,
            optionSelected: answerOpt.optionSelected,
          })
        )
      }
    }
  }

  return {
    id: attemptId,
    studentId,
    examId,
    estado: options.estado ?? 'en_progreso',
    totalPreguntas: options.totalPreguntas ?? exam.questions.length,
    correctas: options.correctas ?? 0,
    incorrectas: options.incorrectas ?? 0,
    omitidas: options.omitidas ?? 0,
    porcentaje: options.porcentaje ?? 0,
    puntajePaes: null,
    puntajeEstimado: false,
    startedAt: options.startedAt ?? now,
    finishedAt: options.finishedAt ?? null,
    duracionSegundos: options.duracionSegundos ?? null,
    createdAt: now,
    updatedAt: now,
    exam,
    answers: defaultAnswers,
  } as Attempt & {
    exam: Exam & {
      subject: Subject
      questions: Array<ExamQuestion & { question: Question & { options: QuestionOption[] } }>
    }
    answers: Array<
      AttemptAnswer & {
        question: Question & {
          options: QuestionOption[]
          topic: Topic | null
        }
        optionSelected: QuestionOption | null
      }
    >
  }
}

// ============================================
// SETUP FUNCTIONS
// ============================================

/**
 * Configura un usuario autenticado
 */
export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

/**
 * Configura un usuario no autenticado
 */
export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

/**
 * Configura el mock de Prisma para findUnique de Attempt
 */
export function setupAttemptMock(
  attempt: (Attempt & {
    exam?: Exam & {
      subject?: Subject
      questions?: Array<ExamQuestion & { question?: Question & { options?: QuestionOption[] } }>
    }
    answers?: Array<
      AttemptAnswer & {
        question?: Question & {
          options?: QuestionOption[]
          topic?: Topic | null
        }
        optionSelected?: QuestionOption | null
      }
    >
  }) | null
): void {
  vi.mocked(prisma.attempt.findUnique).mockResolvedValue(attempt as any)
}

/**
 * Configura el mock de Prisma para update de Attempt
 */
export function setupAttemptUpdateMock(
  attempt: Attempt & {
    exam?: Exam & {
      subject?: Subject
    }
    answers?: Array<
      AttemptAnswer & {
        question?: Question & {
          options?: QuestionOption[]
        }
        optionSelected?: QuestionOption | null
      }
    >
  }
): void {
  vi.mocked(prisma.attempt.update).mockResolvedValue(attempt as any)
}

/**
 * Configura el mock de Prisma para findUnique de Attempt con answers (para recálculo de estadísticas)
 */
export function setupAttemptWithAnswersMock(
  attempt: Attempt & {
    answers?: AttemptAnswer[]
  } | null
): void {
  vi.mocked(prisma.attempt.findUnique).mockResolvedValue(attempt as any)
}

/**
 * Configura el mock de Prisma para deleteMany de AttemptAnswer
 */
export function setupDeleteAnswersMock(): void {
  vi.mocked(prisma.attemptAnswer.deleteMany).mockResolvedValue({ count: 0 } as any)
}

/**
 * Configura el mock de Prisma para createMany de AttemptAnswer
 */
export function setupCreateAnswersMock(): void {
  vi.mocked(prisma.attemptAnswer.createMany).mockResolvedValue({ count: 0 } as any)
}

/**
 * Configura el mock de invalidateCachePattern
 */
export function setupCacheInvalidationMock(): void {
  vi.mocked(invalidateCachePattern).mockResolvedValue(undefined)
}

/**
 * Configura el mock de validateBody para éxito
 */
export function setupValidateBodySuccess(data: { estado?: string; answers?: any[] }): void {
  vi.mocked(validateBody).mockResolvedValue({
    success: true,
    data,
  } as any)
}

/**
 * Configura el mock de validateBody para error
 */
export function setupValidateBodyError(error: NextResponse): void {
  vi.mocked(validateBody).mockResolvedValue({
    success: false,
    error,
  } as any)
}

/**
 * Configura el mock de circuit breaker para éxito
 * ✅ Enterprise: Usa import estático en lugar de require dinámico para mejor soporte en tests
 */
export function setupCircuitBreakerSuccess(): void {
  vi.mocked(circuitBreakers.database.execute).mockImplementation(
    async (operation: () => Promise<any>) => {
      return await operation()
    }
  )
}

/**
 * Configura el mock de circuit breaker para fallback
 * ✅ Enterprise: Usa import estático en lugar de require dinámico para mejor soporte en tests
 */
export function setupCircuitBreakerFallback(fallbackValue: any = null): void {
  vi.mocked(circuitBreakers.database.execute).mockImplementation(
    async (operation: () => Promise<any>, fallback?: () => Promise<any>) => {
      if (fallback) {
        return await fallback()
      }
      return fallbackValue
    }
  )
}

/**
 * Configura el mock de circuit breaker para error
 * ✅ Enterprise: Usa import estático en lugar de require dinámico para mejor soporte en tests
 */
export function setupCircuitBreakerError(error: Error): void {
  vi.mocked(circuitBreakers.database.execute).mockRejectedValue(error)
}

/**
 * Crea un NextRequest para tests con body
 */
export function createTestRequestWithBody(
  body: any,
  options: Omit<CreateRequestOptions, 'body'> & { attemptId?: string } = {}
): NextRequest {
  return createTestRequest({
    ...options,
    method: options.method ?? 'PUT',
    body,
    attemptId: options.attemptId,
    baseUrl: options.baseUrl ?? 'http://localhost/api/attempts',
  })
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Valida que una respuesta de Attempt tenga la estructura correcta
 */
export async function assertAttemptResponse(response: Response): Promise<any> {
  const data = await assertSuccessResponse(response)
  expect(data).toHaveProperty('id')
  expect(data).toHaveProperty('studentId')
  expect(data).toHaveProperty('estado')
  expect(data).toHaveProperty('exam')
  expect(data).toHaveProperty('answers')
  expect(Array.isArray(data.answers)).toBe(true)
  expect(data.exam).toHaveProperty('subject')
  expect(data.exam).toHaveProperty('questions')
  expect(Array.isArray(data.exam.questions)).toBe(true)
  return data
}

/**
 * Valida que una respuesta de error tenga el formato correcto
 */
export async function assertAttemptErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedError: string | ((error: string) => boolean)
): Promise<any> {
  expect(response.status).toBe(expectedStatus)
  const data = await response.json()
  const errorMessage = data.error || data.message || ''
  
  if (typeof expectedError === 'string') {
    expect(errorMessage).toContain(expectedError)
  } else {
    expect(expectedError(errorMessage)).toBe(true)
  }
  
  return data
}

// Re-exportar helpers comunes
export {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertResponseHasFields,
  TestScenarioBuilder,
  ErrorScenarioBuilder,
}

