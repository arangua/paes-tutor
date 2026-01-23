/**
 * Test Helpers Enterprise para API de Recommendations
 */

import { vi } from 'vitest'
import { prisma } from '@/lib/prisma'
import { getCached } from '@/lib/cache'
import { getCurrentStudentId } from '@/lib/get-session'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { PerformanceMetric, Exam } from '@prisma/client'

export interface PerformanceMetricWithSelect extends Pick<PerformanceMetric, 'topicId' | 'porcentaje' | 'totalPreguntas' | 'correctas' | 'nivel'> {
  topic?: {
    nombre: string
    subject?: {
      nombre: string
      codigo: string
    }
  } | null
}

export interface ExamWithSelect extends Pick<Exam, 'id' | 'titulo' | 'subjectId'> {
  subject?: {
    nombre: string
    codigo: string
  } | null
  questions?: Array<{
    question?: {
      topicId?: string | null
    } | null
  }>
}

export function createPerformanceMetricForRecommendations(options: {
  topicId?: string
  porcentaje?: number
  totalPreguntas?: number
  correctas?: number
  nivel?: string
} = {}): PerformanceMetricWithSelect {
  return {
    topicId: options.topicId ?? TEST_IDS.TOPIC,
    porcentaje: options.porcentaje ?? 70,
    totalPreguntas: options.totalPreguntas ?? 10,
    correctas: options.correctas ?? 7,
    nivel: options.nivel ?? 'intermedio',
    topic: {
      nombre: 'Test Topic',
      subject: {
        nombre: 'Test Subject',
        codigo: 'TEST',
      },
    },
  }
}

export function createExamForRecommendations(options: {
  id?: string
  titulo?: string
  subjectId?: string
} = {}): ExamWithSelect {
  return {
    id: options.id ?? TEST_IDS.EXAM,
    titulo: options.titulo ?? 'Test Exam',
    subjectId: options.subjectId ?? TEST_IDS.SUBJECT,
    subject: {
      nombre: 'Test Subject',
      codigo: 'TEST',
    },
    questions: [
      {
        question: {
          topicId: TEST_IDS.TOPIC,
        },
      },
    ],
  }
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupPerformanceMetricsMock(metrics: PerformanceMetricWithSelect[] = []): void {
  vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(metrics as any)
}

export function setupExamsMock(exams: ExamWithSelect[] = []): void {
  vi.mocked(prisma.exam.findMany).mockResolvedValue(exams as any)
}

export function setupCacheSuccess(recommendations: any = null): void {
  vi.mocked(getCached).mockImplementation(async (key: string, fetcher: () => Promise<any>) => {
    if (recommendations !== null) {
      return recommendations
    }
    return await fetcher()
  })
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

