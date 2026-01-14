// @vitest-environment node
/**
 * Tests Enterprise para API de Challenges/[id]/complete
 */

// ✅ IMPORTANTE: Importar el mock ANTES del route
import '@/app/api/challenges/__tests__/auth-mock'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { validateChallengeAttempt, determineChallengeWinner } from '@/lib/challenge-helpers'
import { CHALLENGE_STATUS } from '@/lib/challenge-constants'
import {
  TEST_IDS,
  createUserWithStudent,
  createChallengeWithRelations,
  createAttempt,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  setupChallengeMock,
  setupChallengeUpdateMock,
  setupAttemptMock,
  createTestRequestWithChallengeId,
  assertSuccessResponse,
  assertErrorResponse,
} from '../__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    challenge: { findUnique: vi.fn(), update: vi.fn() },
    attempt: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<any>) => handler()),
}))

vi.mock('@/lib/challenge-helpers', () => ({
  getChallengeInclude: vi.fn(() => ({})),
  validateChallengeAttempt: vi.fn(),
  determineChallengeWinner: vi.fn(),
}))

describe('POST /api/challenges/[id]/complete', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId(undefined, { method: 'POST', body: {} })
    const response = await POST(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    // ✅ Enterprise: Mockear desafío para evitar 404
    const challenge = createChallengeWithRelations({
      status: CHALLENGE_STATUS.ACCEPTED,
    })
    setupChallengeMock(challenge)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    // ✅ Enterprise: El schema requiere que al menos uno de los campos esté presente y sea string válido
    // Usar un body que realmente falle la validación (ambos campos ausentes o inválidos)
    const request = createTestRequestWithChallengeId(undefined, {
      method: 'POST',
      body: { challengerAttemptId: 123, challengedAttemptId: null }, // Tipos inválidos
    })
    const response = await POST(request, { params })
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe retornar 404 si el desafío no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupChallengeMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId(undefined, {
      method: 'POST',
      body: { challengerAttemptId: TEST_IDS.ATTEMPT },
    })
    const response = await POST(request, { params })
    await assertErrorResponse(response, 404, 'Desafío no encontrado')
  })

  it('debe retornar 400 si el desafío no está aceptado', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    setupAuthenticatedUserWithStudent(user)
    const challenge = createChallengeWithRelations({
      challengerId: TEST_IDS.STUDENT,
      challengedId: TEST_IDS.STUDENT_2,
      status: CHALLENGE_STATUS.PENDING,
    })
    setupChallengeMock(challenge)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId(undefined, {
      method: 'POST',
      body: { challengerAttemptId: TEST_IDS.ATTEMPT },
    })
    const response = await POST(request, { params })
    await assertErrorResponse(response, 400, 'debe estar aceptado')
  })

  describe('Registrar intento del desafiador', () => {
    it('debe retornar 403 si no es el desafiador', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.ACCEPTED,
      })
      setupChallengeMock(challenge)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'POST',
        body: { challengerAttemptId: TEST_IDS.ATTEMPT },
      })
      const response = await POST(request, { params })
      await assertErrorResponse(response, 403, 'Solo el desafiador')
    })

    it('debe registrar el intento del desafiador correctamente', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.ACCEPTED,
        examId: TEST_IDS.EXAM,
      })
      setupChallengeMock(challenge)
      const attempt = createAttempt({
        id: TEST_IDS.ATTEMPT,
        studentId: TEST_IDS.STUDENT,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
      })
      setupAttemptMock(attempt)
      vi.mocked(validateChallengeAttempt).mockReturnValue({ isValid: true })
      setupChallengeMock({ ...challenge, challengerAttemptId: null, challengedAttemptId: null })
      const updated = createChallengeWithRelations({
        ...challenge,
        challengerAttemptId: TEST_IDS.ATTEMPT,
      })
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'POST',
        body: { challengerAttemptId: TEST_IDS.ATTEMPT },
      })
      const response = await POST(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.challengerAttemptId).toBe(TEST_IDS.ATTEMPT)
    })
  })

  describe('Registrar intento del desafiado', () => {
    it('debe retornar 403 si no es el desafiado', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.ACCEPTED,
      })
      setupChallengeMock(challenge)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'POST',
        body: { challengedAttemptId: TEST_IDS.ATTEMPT },
      })
      const response = await POST(request, { params })
      await assertErrorResponse(response, 403, 'Solo el desafiado')
    })

    it('debe registrar el intento del desafiado correctamente', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.ACCEPTED,
        examId: TEST_IDS.EXAM,
      })
      setupChallengeMock(challenge)
      const attempt = createAttempt({
        id: 'cattempt222222222222222222',
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
      })
      setupAttemptMock(attempt)
      vi.mocked(validateChallengeAttempt).mockReturnValue({ isValid: true })
      setupChallengeMock({ ...challenge, challengerAttemptId: null, challengedAttemptId: null })
      const updated = createChallengeWithRelations({
        ...challenge,
        challengedAttemptId: attempt.id,
      })
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'POST',
        body: { challengedAttemptId: attempt.id },
      })
      const response = await POST(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.challengedAttemptId).toBe(attempt.id)
    })
  })

  describe('Completar desafío cuando ambos han terminado', () => {
    it('debe determinar el ganador y completar el desafío', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.ACCEPTED,
        examId: TEST_IDS.EXAM,
        challengerAttemptId: TEST_IDS.ATTEMPT,
      })
      setupChallengeMock(challenge)
      const challengedAttempt = createAttempt({
        id: 'cattempt222222222222222222',
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
        porcentaje: 85,
      })
      setupAttemptMock(challengedAttempt)
      vi.mocked(validateChallengeAttempt).mockReturnValue({ isValid: true })
      const challengerAttempt = createAttempt({
        id: TEST_IDS.ATTEMPT,
        studentId: TEST_IDS.STUDENT,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
        porcentaje: 80,
      })
      setupChallengeMock({
        ...challenge,
        challengerAttempt,
        challengedAttempt: null,
      })
      setupAttemptMock(challengerAttempt)
      vi.mocked(determineChallengeWinner).mockReturnValue(TEST_IDS.STUDENT_2)
      const updated = createChallengeWithRelations({
        ...challenge,
        status: CHALLENGE_STATUS.COMPLETED,
        challengedAttemptId: challengedAttempt.id,
        winnerId: TEST_IDS.STUDENT_2,
        completedAt: new Date(),
      })
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'POST',
        body: { challengedAttemptId: challengedAttempt.id },
      })
      const response = await POST(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.status).toBe(CHALLENGE_STATUS.COMPLETED)
      expect(data.challenge.winnerId).toBe(TEST_IDS.STUDENT_2)
    })
  })

  it('debe retornar 400 si el intento no es válido', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    setupAuthenticatedUserWithStudent(user)
    const challenge = createChallengeWithRelations({
      challengerId: TEST_IDS.STUDENT,
      challengedId: TEST_IDS.STUDENT_2,
      status: CHALLENGE_STATUS.ACCEPTED,
    })
    setupChallengeMock(challenge)
    setupAttemptMock(null)
    vi.mocked(validateChallengeAttempt).mockReturnValue({
      isValid: false,
      errorMessage: 'Intento no encontrado',
    })
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId(undefined, {
      method: 'POST',
      body: { challengerAttemptId: TEST_IDS.ATTEMPT },
    })
    const response = await POST(request, { params })
    await assertErrorResponse(response, 400, 'Intento no encontrado')
  })
})

