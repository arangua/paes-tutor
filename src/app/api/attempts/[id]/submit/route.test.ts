// @vitest-environment node
/**
 * Tests Enterprise para API de Attempts/[id]/Submit
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { invalidateCachePattern } from '@/lib/cache'
import {
  TEST_IDS,
  createAttemptForSubmit,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupAttemptMock,
  setupScoreTableMock,
  setupTransactionMock,
  setupPerformanceMetricsMock,
  setupChallengesMock,
  createTestRequestWithAttemptId,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    attempt: { findUnique: vi.fn(), update: vi.fn() },
    scoreTable: { findFirst: vi.fn() },
    performanceMetric: { findMany: vi.fn(), upsert: vi.fn() },
    challenge: { findMany: vi.fn(), update: vi.fn() },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/app/api/notes/versions/circuit-breaker', () => ({
  circuitBreakers: {
    database: {
      execute: vi.fn(async (operation: () => Promise<any>, fallback?: () => Promise<any>) => {
        try {
          return await operation()
        } catch (error) {
          if (fallback) {
            return await fallback()
          }
          throw error
        }
      }),
    },
  },
}))

vi.mock('@/lib/challenge-helpers', () => ({
  determineChallengeWinner: vi.fn(),
}))

vi.mock('@/lib/challenge-constants', () => ({
  CHALLENGE_STATUS: {
    ACCEPTED: 'accepted',
    COMPLETED: 'completed',
  },
  TRANSACTION_TIMEOUT_LONG: 30000,
}))

vi.mock('@/lib/cache', () => ({
  invalidateCachePattern: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
  logApiRequest: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

vi.mock('@/lib/api-helpers', () => ({
  handleApiError: vi.fn((error: Error, message: string) => {
    const { NextResponse } = require('next/server')
    return NextResponse.json({ error: message }, { status: 500 })
  }),
}))

describe('POST /api/attempts/[id]/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 400 si el ID no es CUID válido', async () => {
    setupAuthenticatedSession()
    const params = Promise.resolve({ id: 'invalid-id' })
    const request = createTestRequestWithAttemptId('invalid-id')
    const response = await POST(request, { params })
    await assertErrorResponse(response, 400, 'ID de intento inválido')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si el intento no existe', async () => {
    setupAuthenticatedSession()
    setupAttemptMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    await assertErrorResponse(response, 404, 'Intento no encontrado')
  })

  it('debe retornar 403 si el intento no pertenece al estudiante', async () => {
    setupAuthenticatedSession(TEST_IDS.STUDENT_2)
    const attempt = createAttemptForSubmit({ studentId: TEST_IDS.STUDENT })
    setupAttemptMock(attempt)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    await assertErrorResponse(response, 403, 'No autorizado')
  })

  it('debe retornar 400 si el intento ya está completado', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptForSubmit({ estado: 'completado' })
    setupAttemptMock(attempt)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    await assertErrorResponse(response, 400, 'ya está completado')
  })

  it('debe completar el intento correctamente', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptForSubmit({ correctas: 8, incorrectas: 1, omitidas: 1 })
    setupAttemptMock(attempt)
    setupScoreTableMock(null)
    const updatedAttempt = {
      ...attempt,
      estado: 'completado',
      porcentaje: 80,
      correctas: 8,
      incorrectas: 1,
      omitidas: 1,
      finishedAt: new Date(),
      duracionSegundos: 600,
    }
    setupTransactionMock(async (tx: any) => {
      tx.attempt.update = vi.fn().mockResolvedValue(updatedAttempt)
      tx.performanceMetric.findMany = vi.fn().mockResolvedValue([])
      tx.performanceMetric.upsert = vi.fn().mockResolvedValue({})
      return updatedAttempt
    })
    setupPerformanceMetricsMock([])
    setupChallengesMock([])
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.estado).toBe('completado')
    expect(data.porcentaje).toBe(80)
  })

  it('debe calcular puntaje PAES si existe ScoreTable', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptForSubmit({ correctas: 8 })
    setupAttemptMock(attempt)
    const scoreTable = {
      id: 'cscore123456789012345',
      subjectCodigo: 'MATE',
      proceso: '2025',
      tipoAplicacion: 'regular',
      forma: 'A',
      correctas: 8,
      puntajePaes: 750,
    }
    setupScoreTableMock(scoreTable as any)
    const updatedAttempt = {
      ...attempt,
      estado: 'completado',
      puntajePaes: 750,
      puntajeEstimado: false,
    }
    setupTransactionMock(async (tx: any) => {
      tx.attempt.update = vi.fn().mockResolvedValue(updatedAttempt)
      tx.performanceMetric.findMany = vi.fn().mockResolvedValue([])
      tx.performanceMetric.upsert = vi.fn().mockResolvedValue({})
      return updatedAttempt
    })
    setupPerformanceMetricsMock([])
    setupChallengesMock([])
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.puntajePaes).toBe(750)
    expect(data.puntajeEstimado).toBe(false)
  })

  it('debe actualizar métricas de rendimiento por tema', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptForSubmit({ correctas: 8 })
    setupAttemptMock(attempt)
    setupScoreTableMock(null)
    const existingMetric = {
      id: 'cmetric123456789012345',
      studentId: TEST_IDS.STUDENT,
      topicId: TEST_IDS.TOPIC,
      totalPreguntas: 10,
      correctas: 7,
      porcentaje: 70,
    }
    setupPerformanceMetricsMock([existingMetric as any])
    const updatedAttempt = {
      ...attempt,
      estado: 'completado',
    }
    setupTransactionMock(async (tx: any) => {
      tx.attempt.update = vi.fn().mockResolvedValue(updatedAttempt)
      tx.performanceMetric.findMany = vi.fn().mockResolvedValue([existingMetric])
      tx.performanceMetric.upsert = vi.fn().mockResolvedValue({
        ...existingMetric,
        totalPreguntas: 18,
        correctas: 15,
      })
      return updatedAttempt
    })
    setupChallengesMock([])
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    await POST(request, { params })
    expect(vi.mocked(prisma.performanceMetric.upsert)).toHaveBeenCalled()
  })

  it('debe invalidar caché después de completar', async () => {
    setupAuthenticatedSession()
    const attempt = createAttemptForSubmit()
    setupAttemptMock(attempt)
    setupScoreTableMock(null)
    const updatedAttempt = { ...attempt, estado: 'completado' }
    setupTransactionMock(async (tx: any) => {
      tx.attempt.update = vi.fn().mockResolvedValue(updatedAttempt)
      tx.performanceMetric.findMany = vi.fn().mockResolvedValue([])
      tx.performanceMetric.upsert = vi.fn().mockResolvedValue({})
      return updatedAttempt
    })
    setupPerformanceMetricsMock([])
    setupChallengesMock([])
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    await POST(request, { params })
    expect(vi.mocked(invalidateCachePattern)).toHaveBeenCalledWith(`student:${TEST_IDS.STUDENT}:attempts:*`)
    expect(vi.mocked(invalidateCachePattern)).toHaveBeenCalledWith(`student:${TEST_IDS.STUDENT}:metrics:*`)
  })

  it('debe validar duración máxima (24 horas)', async () => {
    setupAuthenticatedSession()
    const past = new Date()
    past.setHours(past.getHours() - 25) // 25 horas atrás
    const attempt = createAttemptForSubmit({ startedAt: past })
    setupAttemptMock(attempt)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithAttemptId()
    const response = await POST(request, { params })
    await assertErrorResponse(response, 400, 'Duración inválida')
  })
})
