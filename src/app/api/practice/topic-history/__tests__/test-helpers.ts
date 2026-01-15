/**
 * Test Helpers Enterprise para API de Practice/Topic-History
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { Topic, Subject, PracticeSession, Attempt, AttemptAnswer, Question } from '@prisma/client'

export interface TopicWithSubject extends Topic {
  subject?: Subject | null
}

export type PracticeSessionWithSelect = Pick<PracticeSession, 'id' | 'porcentaje' | 'correctas' | 'totalPreguntas' | 'startedAt' | 'finishedAt' | 'duracionSegundos'>

export interface AttemptWithAnswers extends Pick<Attempt, 'id' | 'porcentaje' | 'startedAt' | 'finishedAt'> {
  answers: Array<Pick<AttemptAnswer, 'esCorrecta'>>
}

export function createTopicWithSubject(options: {
  id?: string
  nombre?: string
  ejeTematico?: string
  subjectId?: string
} = {}): TopicWithSubject {
  return {
    id: options.id ?? TEST_IDS.TOPIC,
    nombre: options.nombre ?? 'Test Topic',
    ejeTematico: options.ejeTematico ?? 'Test Eje',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    subject: {
      id: options.subjectId ?? TEST_IDS.SUBJECT,
      nombre: 'Test Subject',
      codigo: 'TEST',
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Subject,
    createdAt: new Date(),
    updatedAt: new Date(),
  } as TopicWithSubject
}

export function createPracticeSessionForHistory(options: {
  id?: string
  porcentaje?: number
  correctas?: number
  totalPreguntas?: number
  startedAt?: Date
  finishedAt?: Date
  duracionSegundos?: number
} = {}): PracticeSessionWithSelect {
  const now = new Date()
  return {
    id: options.id ?? 'csession123456789012345',
    porcentaje: options.porcentaje ?? 80,
    correctas: options.correctas ?? 8,
    totalPreguntas: options.totalPreguntas ?? 10,
    startedAt: options.startedAt ?? now,
    finishedAt: options.finishedAt ?? now,
    duracionSegundos: options.duracionSegundos ?? 600,
  }
}

export function createAttemptForHistory(options: {
  id?: string
  porcentaje?: number
  startedAt?: Date
  finishedAt?: Date
  correctAnswers?: number
  totalAnswers?: number
} = {}): AttemptWithAnswers {
  const now = new Date()
  const correctAnswers = options.correctAnswers ?? 5
  const totalAnswers = options.totalAnswers ?? 10
  return {
    id: options.id ?? 'cattempt123456789012345',
    porcentaje: options.porcentaje ?? 50,
    startedAt: options.startedAt ?? now,
    finishedAt: options.finishedAt ?? now,
    answers: [
      ...Array.from({ length: correctAnswers }, () => ({ esCorrecta: true })),
      ...Array.from({ length: totalAnswers - correctAnswers }, () => ({ esCorrecta: false })),
    ],
  }
}

export function createQuestion(options: { id?: string } = {}): Question {
  return {
    id: options.id ?? TEST_IDS.QUESTION,
    enunciado: 'Test Question',
    explicacion: 'Test explanation',
    dificultad: 3,
    fuente: 'Test source',
    tipo: 'objetiva',
    subjectId: TEST_IDS.SUBJECT,
    topicId: TEST_IDS.TOPIC,
    createdAt: new Date(),
  } as Question
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupTopicMock(topic: TopicWithSubject | null): void {
  vi.mocked(prisma.topic.findUnique).mockResolvedValue(topic as any)
}

export function setupPracticeSessionsMock(sessions: PracticeSessionWithSelect[] = []): void {
  vi.mocked(prisma.practiceSession.findMany).mockResolvedValue(sessions as any)
}

export function setupQuestionsMock(questions: Question[] = []): void {
  vi.mocked(prisma.question.findMany).mockResolvedValue(questions as any)
}

export function setupAttemptsMock(attempts: AttemptWithAnswers[] = []): void {
  vi.mocked(prisma.attempt.findMany).mockResolvedValue(attempts as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

