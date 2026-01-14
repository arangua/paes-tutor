// @vitest-environment node
/**
 * Tests Enterprise para API de Bookmarks/check
 * 
 * Este módulo contiene tests unitarios y de robustez para la API de bookmarks/check,
 * siguiendo estándares enterprise para garantizar máxima calidad y cobertura.
 * 
 * @module route.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import {
  TEST_IDS,
  createUserWithStudent,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  setupUserWithoutStudent,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from '../__tests__/test-helpers'

// ============================================
// MOCKS
// ============================================

vi.mock('@/lib/prisma', () => ({
  prisma: {
    bookmark: {
      findMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getAuthenticatedUserWithStudent: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => {
    return handler()
  }),
}))

// ============================================
// TESTS GET /api/bookmarks/check
// ============================================

describe('GET /api/bookmarks/check', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    setupUserWithoutStudent()
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe retornar 400 si questionIds no está presente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest()

    const response = await GET(request)

    await assertErrorResponse(response, 400, 'IDs de preguntas requeridos')
  })

  it('debe retornar 400 si questionIds está vacío', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      queryParams: { questionIds: '' },
    })

    const response = await GET(request)

    await assertErrorResponse(response, 400, 'IDs de preguntas requeridos')
  })

  it('debe verificar un solo questionId como bookmarked', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([
      { questionId: TEST_IDS.QUESTION },
    ] as any)
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked).toHaveLength(1)
    expect(data.bookmarked[0].questionId).toBe(TEST_IDS.QUESTION)
    expect(data.bookmarked[0].isBookmarked).toBe(true)
  })

  it('debe verificar un solo questionId como no bookmarked', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([])
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked).toHaveLength(1)
    expect(data.bookmarked[0].questionId).toBe(TEST_IDS.QUESTION)
    expect(data.bookmarked[0].isBookmarked).toBe(false)
  })

  it('debe verificar múltiples questionIds separados por comas', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([
      { questionId: TEST_IDS.QUESTION },
      // TEST_IDS.QUESTION_2 no está bookmarked
    ] as any)
    const request = createTestRequest({
      queryParams: {
        questionIds: `${TEST_IDS.QUESTION},${TEST_IDS.QUESTION_2}`,
      },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked).toHaveLength(2)
    expect(data.bookmarked[0].questionId).toBe(TEST_IDS.QUESTION)
    expect(data.bookmarked[0].isBookmarked).toBe(true)
    expect(data.bookmarked[1].questionId).toBe(TEST_IDS.QUESTION_2)
    expect(data.bookmarked[1].isBookmarked).toBe(false)
  })

  it('debe filtrar IDs vacíos del string separado por comas', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([
      { questionId: TEST_IDS.QUESTION },
    ] as any)
    const request = createTestRequest({
      queryParams: {
        questionIds: `${TEST_IDS.QUESTION},,${TEST_IDS.QUESTION_2}`,
      },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked).toHaveLength(2)
    expect(data.bookmarked[0].questionId).toBe(TEST_IDS.QUESTION)
    expect(data.bookmarked[1].questionId).toBe(TEST_IDS.QUESTION_2)
  })

  it('debe usar el studentId del usuario autenticado', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([])
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    await GET(request)

    expect(vi.mocked(prisma.bookmark.findMany)).toHaveBeenCalledWith({
      where: {
        studentId: TEST_IDS.STUDENT,
        questionId: { in: [TEST_IDS.QUESTION] },
      },
      select: {
        questionId: true,
      },
    })
  })

  it('debe manejar muchos questionIds correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const questionIds = Array.from({ length: 10 }, (_, i) => `c${i.toString().padStart(23, '0')}`)
    const bookmarkedIds = questionIds.slice(0, 5)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue(
      bookmarkedIds.map(id => ({ questionId: id })) as any
    )
    const request = createTestRequest({
      queryParams: { questionIds: questionIds.join(',') },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked).toHaveLength(10)
    for (let i = 0; i < 5; i++) {
      expect(data.bookmarked[i].isBookmarked).toBe(true)
    }
    for (let i = 5; i < 10; i++) {
      expect(data.bookmarked[i].isBookmarked).toBe(false)
    }
  })

  it('debe retornar array vacío si no hay bookmarks para ningún ID', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([])
    const request = createTestRequest({
      queryParams: {
        questionIds: `${TEST_IDS.QUESTION},${TEST_IDS.QUESTION_2}`,
      },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked).toHaveLength(2)
    expect(data.bookmarked[0].isBookmarked).toBe(false)
    expect(data.bookmarked[1].isBookmarked).toBe(false)
  })

  it('debe manejar errores de base de datos correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error al verificar favoritos')
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('debe manejar errores no-Error correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockRejectedValue('String error')
    const request = createTestRequest({
      queryParams: { questionIds: TEST_IDS.QUESTION },
    })

    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error al verificar favoritos')
  })

  it('debe preservar el orden de los questionIds en la respuesta', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    // Solo el segundo está bookmarked
    vi.mocked(prisma.bookmark.findMany).mockResolvedValue([
      { questionId: TEST_IDS.QUESTION_2 },
    ] as any)
    const request = createTestRequest({
      queryParams: {
        questionIds: `${TEST_IDS.QUESTION},${TEST_IDS.QUESTION_2},${TEST_IDS.QUESTION_3}`,
      },
    })

    const response = await GET(request)
    const data = await assertSuccessResponse(response)

    expect(data.bookmarked[0].questionId).toBe(TEST_IDS.QUESTION)
    expect(data.bookmarked[1].questionId).toBe(TEST_IDS.QUESTION_2)
    expect(data.bookmarked[2].questionId).toBe(TEST_IDS.QUESTION_3)
  })
})

