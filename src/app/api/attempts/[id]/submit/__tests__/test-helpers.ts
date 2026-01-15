/**
 * Test Helpers Enterprise para API de Attempts/[id]/Submit
 */

import { vi } from 'vitest'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'
import {
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '@/test/enterprise/shared-test-helpers'
import { TEST_IDS } from '@/app/api/attempts/__tests__/test-helpers'
import type { Attempt, PerformanceMetric, Challenge, ScoreTable } from '@prisma/client'

export interface AttemptForSubmit extends Pick<Attempt, 'id' | 'studentId' | 'estado' | 'startedAt' | 'totalPreguntas' | 'proceso' | 'tipoAplicacion' | 'forma'> {
  exam?: {
    id: string
    subject?: {
      id: string
      codigo: string
      nombre: string
    } | null
  } | null
  answers?: Array<{
    id: string
    esCorrecta: boolean | null
    omitida: boolean
    question?: {
      id: string
      topicId: string | null
    } | null
  }>
}

export function createAttemptForSubmit(options: {
  id?: string
  studentId?: string
  estado?: string
  startedAt?: Date
  totalPreguntas?: number
  correctas?: number
  incorrectas?: number
  omitidas?: number
} = {}): AttemptForSubmit {
  const now = new Date()
  return {
    id: options.id ?? TEST_IDS.ATTEMPT,
    studentId: options.studentId ?? TEST_IDS.STUDENT,
    estado: options.estado ?? 'en_progreso',
    startedAt: options.startedAt ?? now,
    totalPreguntas: options.totalPreguntas ?? 10,
    proceso: '2025',
    tipoAplicacion: 'regular',
    forma: 'A',
    exam: {
      id: TEST_IDS.EXAM,
      subject: {
        id: TEST_IDS.SUBJECT,
        codigo: 'MATE',
        nombre: 'Matemáticas',
      },
    },
    answers: [
      ...Array.from({ length: options.correctas ?? 8 }, (_, i) => ({
        id: `canswer${i}`,
        esCorrecta: true,
        omitida: false,
        question: { id: `cquestion${i}`, topicId: TEST_IDS.TOPIC },
      })),
      ...Array.from({ length: options.incorrectas ?? 1 }, (_, i) => ({
        id: `canswer${8 + i}`,
        esCorrecta: false,
        omitida: false,
        question: { id: `cquestion${8 + i}`, topicId: TEST_IDS.TOPIC },
      })),
      ...Array.from({ length: options.omitidas ?? 1 }, (_, i) => ({
        id: `canswer${9 + i}`,
        esCorrecta: null,
        omitida: true,
        question: { id: `cquestion${9 + i}`, topicId: TEST_IDS.TOPIC },
      })),
    ],
  }
}

export function setupAuthenticatedSession(studentId: string = TEST_IDS.STUDENT): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(studentId)
}

export function setupUnauthenticatedSession(): void {
  vi.mocked(getCurrentStudentId).mockResolvedValue(null)
}

export function setupAttemptMock(attempt: AttemptForSubmit | null): void {
  vi.mocked(circuitBreakers.database.execute).mockImplementation(async (operation: () => Promise<any>, fallback?: () => Promise<any>) => {
    try {
      return await operation()
    } catch (error) {
      if (fallback) {
        return await fallback()
      }
      throw error
    }
  })
  vi.mocked(prisma.attempt.findUnique).mockResolvedValue(attempt as any)
}

export function setupScoreTableMock(scoreTable: ScoreTable | null): void {
  vi.mocked(prisma.scoreTable.findFirst).mockResolvedValue(scoreTable as any)
}

export function setupTransactionMock(callback: (tx: any) => Promise<any>): void {
  let callCount = 0
  vi.mocked(prisma.$transaction).mockImplementation(async (txCallback: any, _options?: any) => {
    callCount++
    // Primera transacción: actualización del attempt y métricas (envuelta en circuitBreakers)
    if (callCount === 1) {
      const mockTx = {
        attempt: {
          update: vi.fn(),
        },
        performanceMetric: {
          findMany: vi.fn().mockResolvedValue([]),
          upsert: vi.fn(),
        },
      }
      // Configurar los mocks usando el callback
      await callback(mockTx)
      // Envolver tx.performanceMetric.upsert para que también llame a prisma.performanceMetric.upsert
      // Esto permite que los tests verifiquen que se llamó a prisma.performanceMetric.upsert
      const originalUpsert = mockTx.performanceMetric.upsert
      mockTx.performanceMetric.upsert = vi.fn().mockImplementation(async (args: any) => {
        // Siempre llamar al mock de prisma.performanceMetric.upsert para que los tests puedan verificarlo
        await vi.mocked(prisma.performanceMetric.upsert)(args)
        // Llamar a la implementación original (puede ser mockResolvedValue o mockImplementation)
        if (originalUpsert && vi.isMockFunction(originalUpsert)) {
          return await originalUpsert(args)
        }
        // Si no hay implementación original, retornar undefined
        return undefined
      })
      // Ejecutar el callback de la transacción con los mocks configurados
      return await txCallback(mockTx)
    }
    // Segunda transacción: desafíos (no envuelta en circuitBreakers)
    const mockTx = {
      challenge: {
        findMany: vi.mocked(prisma.challenge.findMany),
        update: vi.mocked(prisma.challenge.update),
      },
      attempt: {
        findUnique: vi.mocked(prisma.attempt.findUnique),
      },
    }
    return await txCallback(mockTx)
  })
}

export function setupPerformanceMetricsMock(metrics: PerformanceMetric[] = []): void {
  vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(metrics as any)
}

export function setupPerformanceMetricUpsertMock(metric: PerformanceMetric): void {
  vi.mocked(prisma.performanceMetric.upsert).mockResolvedValue(metric as any)
}

export function setupChallengesMock(challenges: Challenge[] = []): void {
  vi.mocked(prisma.challenge.findMany).mockResolvedValue(challenges as any)
}

export function setupChallengeUpdateMock(challenge: Challenge): void {
  vi.mocked(prisma.challenge.update).mockResolvedValue(challenge as any)
}

export function createTestRequestWithAttemptId(
  attemptId: string = TEST_IDS.ATTEMPT,
  options: { method?: string; body?: any } = {}
): NextRequest {
  return createTestRequest({
    method: options.method ?? 'POST',
    body: options.body,
    baseUrl: `http://localhost/api/attempts/${attemptId}/submit`,
  })
}

export { TEST_IDS, createTestRequest, assertSuccessResponse, assertErrorResponse }

