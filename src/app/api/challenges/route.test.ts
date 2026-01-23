// @vitest-environment node
/**
 * Tests Enterprise para API de Challenges
 */

// ✅ IMPORTANTE: Importar el mock ANTES del route
import '@/app/api/challenges/__tests__/auth-mock'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CHALLENGE_STATUS } from '@/lib/challenge-constants'
import {
  TEST_IDS,
  createUserWithStudent,
  createChallenge,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  setupChallengesMock,
  setupExamMock,
  setupStudentsMock,
  setupChallengeCreateMock,
  setupChallengeCreateConflictMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    challenge: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn() },
    exam: { findUnique: vi.fn() },
    student: { findMany: vi.fn() },
    $transaction: vi.fn(),
  },
}))

// Mock global está en src/test/setup.ts - solo sobrescribir valores específicos con vi.mocked()
// Nota: este test usa setupAuthenticatedUserWithStudent de auth-mock.ts

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((_req: NextRequest, handler: () => Promise<any>, _type?: string) => handler()),
}))

vi.mock('@/lib/challenge-timeout', () => ({
  cancelExpiredChallenges: vi.fn().mockResolvedValue(undefined),
}))

describe('GET /api/challenges', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar todos los desafíos por defecto', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const challenges = [createChallenge({ id: 'c1' }), createChallenge({ id: 'c2' })]
    setupChallengesMock(challenges)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.challenges).toHaveLength(2)
  })

  it('debe filtrar por type=sent', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupChallengesMock([])
    const request = createTestRequest({ queryParams: { type: 'sent' } })
    await GET(request)
    expect(vi.mocked(prisma.challenge.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ challengerId: user.student!.id }),
      })
    )
  })

  it('debe filtrar por type=received', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupChallengesMock([])
    const request = createTestRequest({ queryParams: { type: 'received' } })
    await GET(request)
    expect(vi.mocked(prisma.challenge.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ challengedId: user.student!.id }),
      })
    )
  })

  it('debe filtrar por type=active', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupChallengesMock([])
    const request = createTestRequest({ queryParams: { type: 'active' } })
    await GET(request)
    expect(vi.mocked(prisma.challenge.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          status: { in: [CHALLENGE_STATUS.PENDING, CHALLENGE_STATUS.ACCEPTED] },
        }),
      })
    )
  })

  it('debe filtrar por status específico', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupChallengesMock([])
    const request = createTestRequest({ queryParams: { status: CHALLENGE_STATUS.COMPLETED } })
    await GET(request)
    expect(vi.mocked(prisma.challenge.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ status: CHALLENGE_STATUS.COMPLETED }),
      })
    )
  })

  it('debe manejar errores correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.challenge.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest()
    const response = await GET(request)
    expect(response.status).toBe(500)
  })
})

describe('POST /api/challenges', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({ method: 'POST', body: { examId: 'invalid' } })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe retornar 404 si el examen no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupExamMock(null)
    setupStudentsMock([
      { id: TEST_IDS.STUDENT } as any,
      { id: TEST_IDS.STUDENT_2 } as any,
    ])
    const request = createTestRequest({
      method: 'POST',
      body: { examId: TEST_IDS.EXAM },
    })
    const response = await POST(request)
    await assertErrorResponse(response, 404, 'Examen no encontrado')
  })

  it('debe retornar 400 si hay menos de 2 estudiantes', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupStudentsMock([{ id: TEST_IDS.STUDENT } as any])
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'al menos 2 estudiantes')
  })

  it('debe crear un desafío correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupExamMock({ id: TEST_IDS.EXAM } as any)
    setupStudentsMock([
      { id: TEST_IDS.STUDENT } as any,
      { id: TEST_IDS.STUDENT_2 } as any,
    ])
    const challenge = createChallenge({ examId: TEST_IDS.EXAM })
    setupChallengeCreateMock(challenge)
    const request = createTestRequest({
      method: 'POST',
      body: { examId: TEST_IDS.EXAM },
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)
    expect(data.challenge).toBeDefined()
    expect(response.status).toBe(201)
  })

  it('debe retornar 409 si ya existe un desafío activo', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupExamMock({ id: TEST_IDS.EXAM } as any)
    setupStudentsMock([
      { id: TEST_IDS.STUDENT } as any,
      { id: TEST_IDS.STUDENT_2 } as any,
    ])
    setupChallengeCreateConflictMock()
    const request = createTestRequest({
      method: 'POST',
      body: { examId: TEST_IDS.EXAM },
    })
    const response = await POST(request)
    await assertErrorResponse(response, 409, 'Ya existe un desafío activo')
  })

  it('debe manejar errores correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.student.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    expect(response.status).toBe(500)
  })
})

