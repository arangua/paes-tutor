/**
 * Test Helpers Enterprise para API de Practice/Stats
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import {
  TEST_IDS,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/app/api/attempts/__tests__/test-helpers'
import type { PerformanceMetric, PracticeSession, Topic, Subject } from '@prisma/client'

export interface PerformanceMetricWithRelations extends PerformanceMetric {
  topic?: Topic & {
    subject?: Subject
  } | null
}

export interface PracticeSessionWithRelations extends PracticeSession {
  topic?: Topic & {
    subject?: Subject
  } | null
}

export function createPerformanceMetric(options: {
  id?: string
  studentId?: string
  topicId?: string
  porcentaje?: number
  totalPreguntas?: number
  correctas?: number
  nivel?: string
  tendencia?: string
} = {}): PerformanceMetricWithRelations {
  return {
    id: options.id ?? 'cmetric123456789012345',
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    porcentaje: options.porcentaje ?? 80,
    totalPreguntas: options.totalPreguntas ?? 10,
    correctas: options.correctas ?? 8,
    nivel: options.nivel ?? 'intermedio',
    tendencia: options.tendencia ?? 'estable',
    createdAt: new Date(),
    updatedAt: new Date(),
    topic: {
      id: options.topicId ?? TEST_IDS.TOPIC,
      nombre: 'Test Topic',
      ejeTematico: 'Test Eje',
      subjectId: TEST_IDS.SUBJECT,
      subject: {
        id: TEST_IDS.SUBJECT,
        nombre: 'Test Subject',
        codigo: 'TEST',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Subject,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Topic & { subject: Subject },
  } as PerformanceMetricWithRelations
}

export function createPracticeSession(options: {
  id?: string
  studentId?: string
  topicId?: string
  porcentaje?: number
  totalPreguntas?: number
  correctas?: number
  startedAt?: Date
  finishedAt?: Date
} = {}): PracticeSessionWithRelations {
  const now = new Date()
  return {
    id: options.id ?? 'csession123456789012345',
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    porcentaje: options.porcentaje ?? 80,
    totalPreguntas: options.totalPreguntas ?? 10,
    correctas: options.correctas ?? 8,
    incorrectas: 2,
    omitidas: 0,
    duracionSegundos: 600,
    startedAt: options.startedAt ?? now,
    finishedAt: options.finishedAt ?? now,
    createdAt: now,
    topic: {
      id: options.topicId ?? TEST_IDS.TOPIC,
      nombre: 'Test Topic',
      ejeTematico: 'Test Eje',
      subjectId: TEST_IDS.SUBJECT,
      subject: {
        id: TEST_IDS.SUBJECT,
        nombre: 'Test Subject',
        codigo: 'TEST',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Subject,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Topic & { subject: Subject },
  } as PracticeSessionWithRelations
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupPerformanceMetricsMock(metrics: PerformanceMetricWithRelations[] = []): void {
  vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(metrics as any)
}

export function setupPracticeSessionsMock(sessions: PracticeSessionWithRelations[] = []): void {
  vi.mocked(prisma.practiceSession.findMany).mockResolvedValue(sessions as any)
}

export function setupPracticeSessionsCountMock(count: number = 0): void {
  vi.mocked(prisma.practiceSession.count).mockResolvedValue(count)
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

