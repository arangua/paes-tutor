// @vitest-environment node
/**
 * Tests Enterprise para API de Challenges/[id]
 */

// ✅ IMPORTANTE: Importar el mock ANTES del route
import '@/app/api/challenges/__tests__/auth-mock'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, PATCH } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { determineChallengeWinner } from '@/lib/challenge-helpers'
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
} from './__tests__/test-helpers'

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
  determineChallengeWinner: vi.fn(),
}))

describe('GET /api/challenges/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId()
    const response = await GET(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si el desafío no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupChallengeMock(null)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId()
    const response = await GET(request, { params })
    await assertErrorResponse(response, 404, 'Desafío no encontrado')
  })

  it('debe retornar 403 si el usuario no es parte del desafío', async () => {
    const user = createUserWithStudent({ studentId: 'cotherstudent123456789012' })
    setupAuthenticatedUserWithStudent(user)
    const challenge = createChallengeWithRelations({
      challengerId: TEST_IDS.STUDENT,
      challengedId: TEST_IDS.STUDENT_2,
    })
    setupChallengeMock(challenge)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId()
    const response = await GET(request, { params })
    await assertErrorResponse(response, 403, 'No tienes permiso')
  })

  it('debe retornar el desafío si el usuario es el desafiador', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    setupAuthenticatedUserWithStudent(user)
    const challenge = createChallengeWithRelations({
      challengerId: TEST_IDS.STUDENT,
      challengedId: TEST_IDS.STUDENT_2,
    })
    setupChallengeMock(challenge)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId()
    const response = await GET(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.challenge).toBeDefined()
  })

  it('debe retornar el desafío si el usuario es el desafiado', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
    setupAuthenticatedUserWithStudent(user)
    const challenge = createChallengeWithRelations({
      challengerId: TEST_IDS.STUDENT,
      challengedId: TEST_IDS.STUDENT_2,
    })
    setupChallengeMock(challenge)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId()
    const response = await GET(request, { params })
    const data = await assertSuccessResponse(response)
    expect(data.challenge).toBeDefined()
  })
})

describe('PATCH /api/challenges/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId(undefined, { method: 'PATCH', body: {} })
    const response = await PATCH(request, { params })
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
    const request = createTestRequestWithChallengeId(undefined, { method: 'PATCH', body: { status: 'invalid' } })
    const response = await PATCH(request, { params })
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  describe('Aceptar desafío', () => {
    it('debe retornar 403 si no es el desafiado', async () => {
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
        method: 'PATCH',
        body: { status: CHALLENGE_STATUS.ACCEPTED },
      })
      const response = await PATCH(request, { params })
      await assertErrorResponse(response, 403, 'Solo el estudiante desafiado')
    })

    it('debe aceptar el desafío correctamente', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.PENDING,
      })
      setupChallengeMock(challenge)
      const updated = createChallengeWithRelations({
        ...challenge,
        status: CHALLENGE_STATUS.ACCEPTED,
        acceptedAt: new Date(),
      })
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { status: CHALLENGE_STATUS.ACCEPTED },
      })
      const response = await PATCH(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.status).toBe(CHALLENGE_STATUS.ACCEPTED)
    })

    it('debe retornar 400 si el desafío ya fue procesado', async () => {
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
        method: 'PATCH',
        body: { status: CHALLENGE_STATUS.ACCEPTED },
      })
      const response = await PATCH(request, { params })
      await assertErrorResponse(response, 400, 'ya fue procesado')
    })
  })

  describe('Rechazar desafío', () => {
    it('debe rechazar el desafío correctamente', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.PENDING,
      })
      setupChallengeMock(challenge)
      const updated = createChallengeWithRelations({
        ...challenge,
        status: CHALLENGE_STATUS.DECLINED,
      })
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { status: CHALLENGE_STATUS.DECLINED },
      })
      const response = await PATCH(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.status).toBe(CHALLENGE_STATUS.DECLINED)
    })
  })

  describe('Cancelar desafío', () => {
    it('debe retornar 403 si no es el desafiador', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.PENDING,
      })
      setupChallengeMock(challenge)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { status: CHALLENGE_STATUS.CANCELLED },
      })
      const response = await PATCH(request, { params })
      await assertErrorResponse(response, 403, 'Solo quien creó')
    })

    it('debe cancelar el desafío correctamente', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.PENDING,
      })
      setupChallengeMock(challenge)
      const updated = createChallengeWithRelations({
        ...challenge,
        status: CHALLENGE_STATUS.CANCELLED,
      })
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { status: CHALLENGE_STATUS.CANCELLED },
      })
      const response = await PATCH(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.status).toBe(CHALLENGE_STATUS.CANCELLED)
    })
  })

  describe('Completar desafío', () => {
    it('debe retornar 403 si no es el desafiado', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.ACCEPTED,
      })
      setupChallengeMock(challenge)
      // ✅ Enterprise: Mockear attempt para evitar 404, pero no importa el valor porque fallará la validación de permisos primero
      const attempt = createAttempt({
        id: TEST_IDS.ATTEMPT,
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
      })
      setupAttemptMock(attempt)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { challengedAttemptId: TEST_IDS.ATTEMPT },
      })
      const response = await PATCH(request, { params })
      await assertErrorResponse(response, 403, 'Solo el estudiante desafiado')
    })

    it('debe retornar 400 si el desafío no está aceptado', async () => {
      const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT_2 })
      setupAuthenticatedUserWithStudent(user)
      const challenge = createChallengeWithRelations({
        challengerId: TEST_IDS.STUDENT,
        challengedId: TEST_IDS.STUDENT_2,
        status: CHALLENGE_STATUS.PENDING,
      })
      setupChallengeMock(challenge)
      // ✅ Enterprise: Mockear attempt para evitar 404, pero no importa el valor porque fallará la validación de estado primero
      const attempt = createAttempt({
        id: TEST_IDS.ATTEMPT,
        studentId: TEST_IDS.STUDENT_2,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
      })
      setupAttemptMock(attempt)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { challengedAttemptId: TEST_IDS.ATTEMPT },
      })
      const response = await PATCH(request, { params })
      await assertErrorResponse(response, 400, 'debe estar aceptado')
    })

    it('debe completar el desafío correctamente', async () => {
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
      const challengerAttempt = createAttempt({
        id: TEST_IDS.ATTEMPT,
        studentId: TEST_IDS.STUDENT,
        examId: TEST_IDS.EXAM,
        estado: 'completado',
        porcentaje: 80,
      })
      // ✅ Enterprise: Configurar mocks en el orden correcto de llamadas
      // Primera llamada: buscar challengedAttemptId (el intento del desafiado)
      vi.mocked(prisma.attempt.findUnique).mockResolvedValueOnce({
        ...challengedAttempt,
        exam: { id: TEST_IDS.EXAM },
      } as any)
      // Segunda llamada: buscar challengerAttemptId (el intento del desafiador)
      vi.mocked(prisma.attempt.findUnique).mockResolvedValueOnce(challengerAttempt as any)
      vi.mocked(determineChallengeWinner).mockReturnValue(TEST_IDS.STUDENT_2)
      const updated = createChallengeWithRelations({
        ...challenge,
        status: CHALLENGE_STATUS.COMPLETED,
        challengedAttemptId: challengedAttempt.id,
        winnerId: TEST_IDS.STUDENT_2,
        completedAt: new Date(),
      })
      // ✅ Enterprise: Asegurar que el mock retorne el objeto completo con winnerId
      setupChallengeUpdateMock(updated)
      const params = Promise.resolve({ id: TEST_IDS.ATTEMPT })
      const request = createTestRequestWithChallengeId(undefined, {
        method: 'PATCH',
        body: { challengedAttemptId: challengedAttempt.id },
      })
      const response = await PATCH(request, { params })
      const data = await assertSuccessResponse(response)
      expect(data.challenge.status).toBe(CHALLENGE_STATUS.COMPLETED)
      expect(data.challenge.winnerId).toBe(TEST_IDS.STUDENT_2)
    })
  })
})

