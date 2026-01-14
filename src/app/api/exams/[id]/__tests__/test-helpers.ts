/**
 * Test Helpers Enterprise para API de Exams/[id]
 * 
 * Este módulo proporciona utilidades y factories para tests de la API de exams/[id],
 * siguiendo estándares enterprise para mantener tests limpios, mantenibles y reutilizables.
 * 
 * @module test-helpers
 */

import { vi, expect } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { getCached } from '@/lib/cache'
import {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/app/api/attempts/__tests__/test-helpers'
import type {
  Exam,
  ExamQuestion,
  Question,
  QuestionOption,
  Subject,
} from '@prisma/client'

// ============================================
// TIPOS
// ============================================

/**
 * Opciones para crear un Exam con todas sus relaciones
 */
export interface ExamWithRelationsOptions {
  id?: string
  subjectId?: string
  titulo?: string
  descripcion?: string | null
  tipo?: string
  tiempoLimiteMin?: number | null
  totalPreguntas?: number
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
        letra?: string
      }>
    }
  }>
}

// ============================================
// FACTORIES
// ============================================

/**
 * Factory para crear un Subject
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
  options?: Array<{
    id?: string
    texto?: string
    esCorrecta?: boolean
    letra?: string
  }>
} = {}): Question & { options: QuestionOption[] } {
  const questionId = options.id ?? TEST_IDS.QUESTION
  const defaultOptions = [
    createQuestionOption({ id: TEST_IDS.OPTION, questionId, texto: 'Opción A', esCorrecta: true, letra: 'A' }),
    createQuestionOption({ id: TEST_IDS.OPTION_2, questionId, texto: 'Opción B', esCorrecta: false, letra: 'B' }),
  ]

  return {
    id: questionId,
    enunciado: options.enunciado ?? DEFAULT_TEST_VALUES.QUESTION_TEXT,
    explicacion: 'Test explanation',
    dificultad: 1,
    fuente: 'Test source',
    tipo: 'objetiva',
    subjectId: TEST_IDS.SUBJECT,
    topicId: null,
    createdAt: new Date(),
    options: options.options
      ? options.options.map((opt, idx) =>
          createQuestionOption({
            id: opt.id ?? (idx === 0 ? TEST_IDS.OPTION : TEST_IDS.OPTION_2),
            questionId,
            texto: opt.texto ?? `Opción ${String.fromCharCode(65 + idx)}`,
            esCorrecta: opt.esCorrecta ?? idx === 0,
            letra: opt.letra ?? String.fromCharCode(65 + idx),
          })
        )
      : defaultOptions,
  } as Question & { options: QuestionOption[] }
}

/**
 * Factory para crear un ExamQuestion con Question
 */
export function createExamQuestion(options: {
  questionId?: string
  orden?: number
  question?: {
    id?: string
    enunciado?: string
    options?: Array<{
      id?: string
      texto?: string
      esCorrecta?: boolean
      letra?: string
    }>
  }
} = {}): ExamQuestion & {
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
    id: 'exam-question-id',
    examId: TEST_IDS.EXAM,
    questionId,
    orden: options.orden ?? 1,
    question,
  } as ExamQuestion & {
    question: Question & { options: QuestionOption[] }
  }
}

/**
 * Factory para crear un Exam con Subject y Questions
 */
export function createExamWithRelations(
  options: ExamWithRelationsOptions = {}
): Exam & {
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
    descripcion: options.descripcion !== undefined ? options.descripcion : DEFAULT_TEST_VALUES.EXAM_DESCRIPTION,
    tipo: options.tipo ?? 'objetiva',
    tiempoLimiteMin: options.tiempoLimiteMin !== undefined ? options.tiempoLimiteMin : null,
    totalPreguntas: options.totalPreguntas ?? defaultQuestions.length,
    fuente: null,
    esSimulacionOficial: false,
    fuenteSimulacion: null,
    fechaSimulacion: null,
    procesoAdmision: null,
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    createdAt: new Date(),
    subject: options.subject
      ? createSubject(options.subject)
      : createSubject(),
    questions: options.questions
      ? options.questions.map((q, idx) => createExamQuestion({ ...q, orden: q.orden ?? idx + 1 }))
      : defaultQuestions,
  } as Exam & {
    subject: Subject
    questions: Array<ExamQuestion & { question: Question & { options: QuestionOption[] } }>
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
 * Configura el mock de Prisma para findUnique de Exam
 */
export function setupExamMock(
  exam: (Exam & {
    subject?: Subject
    questions?: Array<ExamQuestion & { question?: Question & { options?: QuestionOption[] } }>
  }) | null
): void {
  vi.mocked(prisma.exam.findUnique).mockResolvedValue(exam as any)
}

/**
 * Configura el mock de caché para éxito
 */
export function setupCacheSuccess(exam: Exam | null = null): void {
  vi.mocked(getCached).mockImplementation(async (key: string, fetcher: () => Promise<any>) => {
    if (exam !== null) {
      return exam
    }
    return await fetcher()
  })
}

/**
 * Configura el mock de caché para error
 */
export function setupCacheError(error: Error): void {
  vi.mocked(getCached).mockRejectedValue(error)
}

// ============================================
// REQUEST UTILITIES
// ============================================

/**
 * Crea un NextRequest para tests con examId
 */
export function createTestRequestWithExamId(
  examId: string = TEST_IDS.EXAM,
  options: { baseUrl?: string } = {}
): NextRequest {
  const baseUrl = options.baseUrl ?? 'http://localhost/api/exams'
  const url = `${baseUrl}/${examId}`
  return new NextRequest(url, {
    method: 'GET',
  })
}

// ============================================
// ASSERTION HELPERS
// ============================================

/**
 * Valida que una respuesta de Exam tenga la estructura correcta
 */
export async function assertExamResponse(response: Response): Promise<any> {
  const data = await assertSuccessResponse(response)
  expect(data).toHaveProperty('id')
  expect(data).toHaveProperty('titulo')
  expect(data).toHaveProperty('subject')
  expect(data).toHaveProperty('questions')
  expect(Array.isArray(data.questions)).toBe(true)
  return data
}

/**
 * Valida que una respuesta de error tenga el formato correcto
 */
export async function assertExamErrorResponse(
  response: Response,
  expectedStatus: number,
  expectedError: string | ((error: string) => boolean)
): Promise<void> {
  await assertErrorResponse(response, expectedStatus, expectedError)
}

// Re-exportar helpers comunes
export {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
}

