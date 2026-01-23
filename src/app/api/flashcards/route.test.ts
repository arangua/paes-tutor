// @vitest-environment node
/**
 * Tests Enterprise para API de Flashcards
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST, PUT, DELETE } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateSM2, responseToQuality } from '@/lib/spaced-repetition'
import {
  TEST_IDS,
  createUserWithStudent,
  createFlashcard,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  setupFlashcardsMock,
  setupFlashcardCountMock,
  setupFlashcardMock,
  setupFlashcardCreateMock,
  setupFlashcardUpdateMock,
  setupFlashcardDeleteMock,
  setupQuestionMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    flashcard: { findMany: vi.fn(), findFirst: vi.fn(), create: vi.fn(), update: vi.fn(), delete: vi.fn(), count: vi.fn() },
    question: { findUnique: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/get-session')>('@/lib/get-session')
  return {
    ...actual,
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getCurrentStudentId: vi.fn(),
    getAuthenticatedUserWithStudent: vi.fn(),
  }
})

vi.mock('@/lib/logger', async () => {
  const actual = await vi.importActual<typeof import('@/lib/logger')>('@/lib/logger')
  return {
    ...actual,
    logger: {
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
      debug: vi.fn(),
    },
    logApiRequest: vi.fn(),
  }
})

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<any>) => handler()),
}))

vi.mock('@/lib/spaced-repetition', () => ({
  calculateSM2: vi.fn(),
  responseToQuality: vi.fn(),
}))

describe('GET /api/flashcards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar todos los flashcards', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const flashcards = [createFlashcard({ id: 'c1' }), createFlashcard({ id: 'c2' })]
    setupFlashcardsMock(flashcards)
    setupFlashcardCountMock(2)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.flashcards).toHaveLength(2)
    expect(data.stats.total).toBe(2)
  })

  it('debe filtrar por dueOnly=true', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const now = new Date()
    const past = new Date(now.getTime() - 1000)
    const flashcards = [createFlashcard({ id: 'c1', nextReview: past })]
    setupFlashcardsMock(flashcards)
    setupFlashcardCountMock(1)
    const request = createTestRequest({ queryParams: { dueOnly: 'true' } })
    await GET(request)
    expect(vi.mocked(prisma.flashcard.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          nextReview: expect.objectContaining({ lte: expect.any(Date) }),
        }),
      })
    )
  })

  it('debe filtrar por flashcardId', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const flashcards = [createFlashcard({ id: TEST_IDS.FLASHCARD })]
    setupFlashcardsMock(flashcards)
    setupFlashcardCountMock(1)
    const request = createTestRequest({ queryParams: { flashcardId: TEST_IDS.FLASHCARD } })
    await GET(request)
    expect(vi.mocked(prisma.flashcard.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ 
          studentId: TEST_IDS.STUDENT,
          id: TEST_IDS.FLASHCARD 
        }),
      })
    )
  })

  it('debe limitar resultados con limit', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupFlashcardsMock([])
    setupFlashcardCountMock(0)
    const request = createTestRequest({ queryParams: { limit: '10' } })
    await GET(request)
    expect(vi.mocked(prisma.flashcard.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({ take: 10 })
    )
  })
})

describe('POST /api/flashcards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({ method: 'POST', body: { front: 'Front', back: 'Back' } })
    const response = await POST(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({ method: 'POST', body: {} })
    const response = await POST(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe crear flashcard sin questionId', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const flashcard = createFlashcard({ front: 'Front', back: 'Back' })
    setupFlashcardCreateMock(flashcard)
    const request = createTestRequest({ method: 'POST', body: { front: 'Front', back: 'Back' } })
    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)
    expect(data.flashcard.front).toBe('Front')
  })

  it('debe crear flashcard con questionId válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupQuestionMock({ id: TEST_IDS.QUESTION } as any)
    const flashcard = createFlashcard({ questionId: TEST_IDS.QUESTION })
    setupFlashcardCreateMock(flashcard)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION, front: 'Front', back: 'Back' },
    })
    const response = await POST(request)
    const data = await assertSuccessResponse(response, 201)
    expect(data.flashcard.questionId).toBe(TEST_IDS.QUESTION)
  })

  it('debe retornar 404 si questionId no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupQuestionMock(null)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION, front: 'Front', back: 'Back' },
    })
    const response = await POST(request)
    await assertErrorResponse(response, 404, 'Pregunta no encontrada')
  })
})

describe('PUT /api/flashcards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({
      method: 'PUT',
      body: { flashcardId: TEST_IDS.FLASHCARD, isCorrect: true },
    })
    const response = await PUT(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({ method: 'PUT', body: {} })
    const response = await PUT(request)
    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe retornar 404 si el flashcard no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupFlashcardMock(null)
    const request = createTestRequest({
      method: 'PUT',
      body: { flashcardId: TEST_IDS.FLASHCARD, isCorrect: true },
    })
    const response = await PUT(request)
    await assertErrorResponse(response, 404, 'Flashcard no encontrada')
  })

  it('debe actualizar flashcard con algoritmo SM-2', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const flashcard = createFlashcard({ id: TEST_IDS.FLASHCARD })
    setupFlashcardMock(flashcard)
    vi.mocked(responseToQuality).mockReturnValue(4)
    vi.mocked(calculateSM2).mockReturnValue({
      easeFactor: 2.6,
      interval: 2,
      reviewCount: 1,
      nextReview: new Date(),
    })
    const updated = createFlashcard({ ...flashcard, easeFactor: 2.6, interval: 2, reviewCount: 1 })
    setupFlashcardUpdateMock(updated)
    const request = createTestRequest({
      method: 'PUT',
      body: { flashcardId: TEST_IDS.FLASHCARD, isCorrect: true, difficulty: 'easy' },
    })
    const response = await PUT(request)
    const data = await assertSuccessResponse(response)
    expect(data.flashcard.easeFactor).toBe(2.6)
    expect(vi.mocked(calculateSM2)).toHaveBeenCalled()
  })
})

describe('DELETE /api/flashcards', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({ queryParams: { flashcardId: TEST_IDS.ATTEMPT } })
    const response = await DELETE(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si flashcardId no está presente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({ queryParams: {} })
    const response = await DELETE(request)
    await assertErrorResponse(response, 400, 'ID de flashcard requerido')
  })

  it('debe retornar 404 si el flashcard no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupFlashcardMock(null)
    const request = createTestRequest({ queryParams: { flashcardId: TEST_IDS.FLASHCARD } })
    const response = await DELETE(request)
    await assertErrorResponse(response, 404, 'Flashcard no encontrada')
  })

  it('debe eliminar flashcard correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const flashcard = createFlashcard({ id: TEST_IDS.FLASHCARD })
    setupFlashcardMock(flashcard)
    setupFlashcardDeleteMock()
    const request = createTestRequest({ queryParams: { flashcardId: TEST_IDS.FLASHCARD } })
    const response = await DELETE(request)
    const data = await assertSuccessResponse(response)
    expect(data.message).toBe('Flashcard eliminada correctamente')
    expect(vi.mocked(prisma.flashcard.delete)).toHaveBeenCalledWith({
      where: { id: TEST_IDS.FLASHCARD },
    })
  })
})

