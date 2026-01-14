/**
 * Test Helpers Enterprise para API de Practice/Sessions
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import {
  TEST_IDS,
  createUserWithStudent,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/app/api/bookmarks/__tests__/test-helpers'
import type { PracticeSession, Topic, Question, QuestionOption, PerformanceMetric } from '@prisma/client'

export function createPracticeSession(options: {
  id?: string
  studentId?: string
  topicId?: string
  totalPreguntas?: number
  correctas?: number
  incorrectas?: number
  omitidas?: number
  porcentaje?: number
  duracionSegundos?: number
  finishedAt?: Date
} = {}): PracticeSession & {
  topic?: { nombre: string; ejeTematico: string } | null
} {
  return {
    id: options.id ?? 'cpracticesession123456789',
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    totalPreguntas: options.totalPreguntas ?? 10,
    correctas: options.correctas ?? 8,
    incorrectas: options.incorrectas ?? 2,
    omitidas: options.omitidas ?? 0,
    porcentaje: options.porcentaje ?? 80,
    duracionSegundos: options.duracionSegundos ?? 600,
    finishedAt: options.finishedAt ?? new Date(),
    createdAt: new Date(),
    topic: {
      nombre: 'Test Topic',
      ejeTematico: 'Test Eje',
    },
  } as PracticeSession & {
    topic?: { nombre: string; ejeTematico: string } | null
  }
}

export function createQuestionWithCorrectOption(options: {
  id?: string
  questionId?: string
  optionId?: string
} = {}): Question & {
  options: QuestionOption[]
} {
  const questionId = options.id ?? TEST_IDS.QUESTION
  const optionId = options.optionId ?? TEST_IDS.OPTION
  return {
    id: questionId,
    enunciado: 'Test Question',
    explicacion: 'Test explanation',
    dificultad: 1,
    fuente: 'Test source',
    tipo: 'objetiva',
    subjectId: TEST_IDS.SUBJECT,
    topicId: TEST_IDS.TOPIC,
    createdAt: new Date(),
    options: [
      {
        id: optionId,
        questionId,
        letra: 'A',
        texto: 'Correct Option',
        esCorrecta: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as QuestionOption,
      {
        id: TEST_IDS.OPTION_2,
        questionId,
        letra: 'B',
        texto: 'Incorrect Option',
        esCorrecta: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as QuestionOption,
    ],
  } as Question & {
    options: QuestionOption[]
  }
}

export function setupAuthenticatedUserWithStudent(
  user: ReturnType<typeof createUserWithStudent> | null = createUserWithStudent()
): void {
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(user)
}

export function setupUnauthenticatedUser(): void {
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(null)
}

export function setupUserWithoutStudent(): void {
  const user = {
    id: 'cuser1234567890123456789',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    student: null,
  }
  vi.mocked(getAuthenticatedUserWithStudent).mockResolvedValue(user as any)
}

export function setupTopicMock(topic: Topic | null): void {
  vi.mocked(prisma.topic.findUnique).mockResolvedValue(topic as any)
}

export function setupQuestionsMock(questions: Array<Question & { options?: QuestionOption[] }>): void {
  vi.mocked(prisma.question.findMany).mockResolvedValue(questions as any)
}

export function setupPracticeSessionCreateMock(session: PracticeSession & { topic?: any }): void {
  vi.mocked(prisma.practiceSession.create).mockResolvedValue(session as any)
}

export function setupPerformanceMetricMock(metric: PerformanceMetric | null): void {
  vi.mocked(prisma.performanceMetric.findUnique).mockResolvedValue(metric as any)
}

export function setupPerformanceMetricUpdateMock(metric: PerformanceMetric): void {
  vi.mocked(prisma.performanceMetric.update).mockResolvedValue(metric as any)
}

export function setupPerformanceMetricCreateMock(metric: PerformanceMetric): void {
  vi.mocked(prisma.performanceMetric.create).mockResolvedValue(metric as any)
}

export { TEST_IDS, createUserWithStudent, createTestRequest, assertSuccessResponse, assertErrorResponse }

