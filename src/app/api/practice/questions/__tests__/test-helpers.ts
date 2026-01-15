/**
 * Test Helpers Enterprise para API de Practice/Questions
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import type { Question, QuestionOption, Topic } from '@prisma/client'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'

vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

export function createQuestionWithOptions(options: {
  id?: string
  topicId?: string
  dificultad?: number
} = {}): Question & {
  options: QuestionOption[]
  subject: { nombre: string; codigo: string }
  topic: { nombre: string; ejeTematico: string }
} {
  const questionId = options.id ?? TEST_IDS.QUESTION
  return {
    id: questionId,
    enunciado: 'Test Question',
    explicacion: 'Test explanation',
    dificultad: options.dificultad ?? 3,
    fuente: 'Test source',
    tipo: 'objetiva',
    subjectId: TEST_IDS.SUBJECT,
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    createdAt: new Date(),
    options: [
      {
        id: TEST_IDS.OPTION,
        questionId,
        letra: 'A',
        texto: 'Option A',
        esCorrecta: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as QuestionOption,
      {
        id: TEST_IDS.OPTION_2,
        questionId,
        letra: 'B',
        texto: 'Option B',
        esCorrecta: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as QuestionOption,
    ],
    subject: {
      nombre: 'Test Subject',
      codigo: 'TEST',
    } as any,
    topic: {
      nombre: 'Test Topic',
      ejeTematico: 'Test Eje',
    } as any,
  } as Question & {
    options: QuestionOption[]
    subject: { nombre: string; codigo: string }
    topic: { nombre: string; ejeTematico: string }
  }
}

export function setupAuthenticatedUser(user: { email: string } | null = { email: 'test@example.com' }): void {
  vi.mocked(getCurrentUser).mockResolvedValue(user as any)
}

export function setupUnauthenticatedUser(): void {
  vi.mocked(getCurrentUser).mockResolvedValue(null)
}

export function setupTopicMock(topic: Topic | null): void {
  vi.mocked(prisma.topic.findUnique).mockResolvedValue(topic as any)
}

export function setupQuestionsMock(questions: Array<Question & { options?: QuestionOption[]; subject?: any; topic?: any }>): void {
  vi.mocked(prisma.question.findMany).mockResolvedValue(questions as any)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

