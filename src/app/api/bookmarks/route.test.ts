// @vitest-environment node
/**
 * Tests Enterprise para API de Bookmarks
 * 
 * Este módulo contiene tests unitarios y de robustez para la API de bookmarks,
 * siguiendo estándares enterprise para garantizar máxima calidad y cobertura.
 * 
 * @module route.test
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET, POST, DELETE } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  DEFAULT_TEST_VALUES,
  createBookmarkWithRelations,
  createQuestionWithRelations,
  createUserWithStudent,
  setupAuthenticatedUserWithStudent,
  setupUnauthenticatedUser,
  setupUserWithoutStudent,
  setupBookmarksMock,
  setupBookmarkMock,
  setupQuestionMock,
  setupBookmarkCreateMock,
  setupBookmarkDeleteMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
  assertBookmarkResponse,
  assertBookmarksResponse,
} from './__tests__/test-helpers'

// ============================================
// MOCKS
// ============================================

vi.mock('@/lib/prisma', () => ({
  prisma: {
    bookmark: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
    question: {
      findUnique: vi.fn(),
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
// TESTS GET /api/bookmarks
// ============================================

describe('GET /api/bookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest()

    const response = await GET(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    setupUserWithoutStudent()
    const request = createTestRequest()

    const response = await GET(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe retornar todos los bookmarks del estudiante', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const now = new Date()
    const earlier = new Date(now.getTime() - 1000)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
        createdAt: now, // Más reciente, debe estar primero
      }),
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK_2,
        questionId: TEST_IDS.QUESTION_2,
        createdAt: earlier, // Más antiguo, debe estar segundo
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest()

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    expect(data.bookmarks).toHaveLength(2)
    expect(data.bookmarks[0].id).toBe(TEST_IDS.BOOKMARK) // Más reciente primero
    expect(data.bookmarks[1].id).toBe(TEST_IDS.BOOKMARK_2) // Más antiguo segundo
  })

  it('debe retornar bookmarks ordenados por createdAt descendente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const now = new Date()
    const earlier = new Date(now.getTime() - 1000)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
        createdAt: earlier,
      }),
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK_2,
        questionId: TEST_IDS.QUESTION_2,
        createdAt: now,
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest()

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    // El más reciente debe estar primero
    expect(data.bookmarks[0].id).toBe(TEST_IDS.BOOKMARK_2)
    expect(data.bookmarks[1].id).toBe(TEST_IDS.BOOKMARK)
  })

  it('debe filtrar bookmarks por topicId', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
        question: {
          topicId: TEST_IDS.TOPIC,
        },
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest({
      queryParams: { topicId: TEST_IDS.TOPIC },
    })

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    expect(data.bookmarks).toHaveLength(1)
    expect(vi.mocked(prisma.bookmark.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          question: expect.objectContaining({
            topicId: TEST_IDS.TOPIC,
          }),
        }),
      })
    )
  })

  it('debe filtrar bookmarks por subjectId', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
        question: {
          subjectId: TEST_IDS.SUBJECT,
        },
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest({
      queryParams: { subjectId: TEST_IDS.SUBJECT },
    })

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    expect(data.bookmarks).toHaveLength(1)
    expect(vi.mocked(prisma.bookmark.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          question: expect.objectContaining({
            subjectId: TEST_IDS.SUBJECT,
          }),
        }),
      })
    )
  })

  it('debe filtrar bookmarks por topicId y subjectId simultáneamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
        question: {
          topicId: TEST_IDS.TOPIC,
          subjectId: TEST_IDS.SUBJECT,
        },
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest({
      queryParams: {
        topicId: TEST_IDS.TOPIC,
        subjectId: TEST_IDS.SUBJECT,
      },
    })

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    expect(data.bookmarks).toHaveLength(1)
    expect(vi.mocked(prisma.bookmark.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          question: expect.objectContaining({
            topicId: TEST_IDS.TOPIC,
            subjectId: TEST_IDS.SUBJECT,
          }),
        }),
      })
    )
  })

  it('debe retornar 400 si topicId no tiene formato CUID válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      queryParams: { topicId: 'invalid-cuid' },
    })

    const response = await GET(request)

    const data = await assertErrorResponse(response, 400, 'Parámetros de consulta inválidos')
    expect(data.details).toBeDefined()
  })

  it('debe retornar 400 si subjectId no tiene formato CUID válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      queryParams: { subjectId: 'invalid-cuid' },
    })

    const response = await GET(request)

    await assertErrorResponse(response, 400, 'Parámetros de consulta inválidos')
  })

  it('debe incluir relaciones completas (question, options, subject, topic)', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest()

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    expect(data.bookmarks[0].question).toBeDefined()
    expect(data.bookmarks[0].question.options).toBeDefined()
    expect(Array.isArray(data.bookmarks[0].question.options)).toBe(true)
    expect(data.bookmarks[0].question.subject).toBeDefined()
    expect(data.bookmarks[0].question.topic).toBeDefined()
  })

  it('debe ordenar opciones por letra ascendente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmarks = [
      createBookmarkWithRelations({
        id: TEST_IDS.BOOKMARK,
        questionId: TEST_IDS.QUESTION,
        question: {
          options: [
            { id: TEST_IDS.OPTION, texto: 'Opción B', esCorrecta: false, letra: 'B' },
            { id: TEST_IDS.OPTION_2, texto: 'Opción A', esCorrecta: true, letra: 'A' },
          ],
        },
      }),
    ]
    setupBookmarksMock(bookmarks)
    const request = createTestRequest()

    const response = await GET(request)
    await assertBookmarksResponse(response)

    expect(vi.mocked(prisma.bookmark.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({
          question: expect.objectContaining({
            include: expect.objectContaining({
              options: expect.objectContaining({
                orderBy: { letra: 'asc' },
              }),
            }),
          }),
        }),
      })
    )
  })

  it('debe retornar array vacío si no hay bookmarks', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupBookmarksMock([])
    const request = createTestRequest()

    const response = await GET(request)
    const data = await assertBookmarksResponse(response)

    expect(data.bookmarks).toHaveLength(0)
  })

  it('debe manejar errores de base de datos correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest()

    const response = await GET(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error al obtener favoritos')
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

// ============================================
// TESTS POST /api/bookmarks
// ============================================

describe('POST /api/bookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    setupUserWithoutStudent()
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe retornar 400 si el body no es válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      method: 'POST',
      body: {}, // Sin questionId
    })

    const response = await POST(request)

    const data = await assertErrorResponse(response, 400, 'Datos inválidos')
    expect(data.details).toBeDefined()
  })

  it('debe retornar 400 si questionId está vacío', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: '' },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 400, 'Datos inválidos')
  })

  it('debe retornar 404 si la pregunta no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupQuestionMock(null)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 404, 'Pregunta no encontrada')
  })

  it('debe retornar 409 si el bookmark ya existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const question = createQuestionWithRelations({ id: TEST_IDS.QUESTION })
    setupQuestionMock(question as any)
    const existingBookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      questionId: TEST_IDS.QUESTION,
    })
    setupBookmarkMock(existingBookmark)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)

    await assertErrorResponse(response, 409, 'La pregunta ya está en favoritos')
  })

  it('debe crear un bookmark correctamente sin notas', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const question = createQuestionWithRelations({ id: TEST_IDS.QUESTION })
    setupQuestionMock(question as any)
    setupBookmarkMock(null) // No existe bookmark previo
    const newBookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      questionId: TEST_IDS.QUESTION,
      notes: null,
    })
    setupBookmarkCreateMock(newBookmark)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)
    const data = await assertBookmarkResponse(response)

    expect(data.bookmark.id).toBe(TEST_IDS.BOOKMARK)
    expect(data.bookmark.questionId).toBe(TEST_IDS.QUESTION)
    expect(data.bookmark.notes).toBeNull()
    expect(response.status).toBe(201)
  })

  it('debe crear un bookmark correctamente con notas', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const question = createQuestionWithRelations({ id: TEST_IDS.QUESTION })
    setupQuestionMock(question as any)
    setupBookmarkMock(null)
    const newBookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      questionId: TEST_IDS.QUESTION,
      notes: DEFAULT_TEST_VALUES.NOTES,
    })
    setupBookmarkCreateMock(newBookmark)
    const request = createTestRequest({
      method: 'POST',
      body: {
        questionId: TEST_IDS.QUESTION,
        notes: DEFAULT_TEST_VALUES.NOTES,
      },
    })

    const response = await POST(request)
    const data = await assertBookmarkResponse(response)

    expect(data.bookmark.notes).toBe(DEFAULT_TEST_VALUES.NOTES)
  })

  it('debe incluir relaciones completas al crear bookmark', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const question = createQuestionWithRelations({ id: TEST_IDS.QUESTION })
    setupQuestionMock(question as any)
    setupBookmarkMock(null)
    const newBookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      questionId: TEST_IDS.QUESTION,
    })
    setupBookmarkCreateMock(newBookmark)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)
    const data = await assertBookmarkResponse(response)

    expect(data.bookmark.question).toBeDefined()
    expect(data.bookmark.question.subject).toBeDefined()
    expect(data.bookmark.question.topic).toBeDefined()
  })

  it('debe usar el studentId del usuario autenticado', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    setupAuthenticatedUserWithStudent(user)
    const question = createQuestionWithRelations({ id: TEST_IDS.QUESTION })
    setupQuestionMock(question as any)
    setupBookmarkMock(null)
    const newBookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      studentId: TEST_IDS.STUDENT,
      questionId: TEST_IDS.QUESTION,
    })
    setupBookmarkCreateMock(newBookmark)
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    await POST(request)

    expect(vi.mocked(prisma.bookmark.create)).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          studentId: TEST_IDS.STUDENT,
        }),
      })
    )
  })

  it('debe manejar errores de base de datos correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const question = createQuestionWithRelations({ id: TEST_IDS.QUESTION })
    setupQuestionMock(question as any)
    setupBookmarkMock(null)
    vi.mocked(prisma.bookmark.create).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({
      method: 'POST',
      body: { questionId: TEST_IDS.QUESTION },
    })

    const response = await POST(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error al crear favorito')
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('debe manejar errores al parsear JSON del body', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = new NextRequest('http://localhost/api/bookmarks', {
      method: 'POST',
      body: 'invalid json',
    })

    // Simular error al parsear JSON
    vi.spyOn(request, 'json').mockRejectedValue(new Error('Invalid JSON'))

    const response = await POST(request)

    expect(response.status).toBe(500)
  })
})

// ============================================
// TESTS DELETE /api/bookmarks
// ============================================

describe('DELETE /api/bookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedUser()
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    const response = await DELETE(request)

    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    setupUserWithoutStudent()
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    const response = await DELETE(request)

    await assertErrorResponse(response, 404, 'Estudiante no encontrado')
  })

  it('debe retornar 400 si questionId no tiene formato CUID válido', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: 'invalid-cuid' },
    })

    const response = await DELETE(request)

    const data = await assertErrorResponse(response, 400, 'ID de pregunta inválido')
    expect(data.details).toBeDefined()
  })

  it('debe retornar 400 si questionId está vacío', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: '' },
    })

    const response = await DELETE(request)

    await assertErrorResponse(response, 400, 'ID de pregunta inválido')
  })

  it('debe retornar 404 si el bookmark no existe', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    setupBookmarkMock(null)
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    const response = await DELETE(request)

    await assertErrorResponse(response, 404, 'Favorito no encontrado')
  })

  it('debe eliminar un bookmark correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      questionId: TEST_IDS.QUESTION,
    })
    setupBookmarkMock(bookmark)
    setupBookmarkDeleteMock()
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    const response = await DELETE(request)
    const data = await assertSuccessResponse(response)

    expect(data.message).toBe('Favorito eliminado correctamente')
    expect(vi.mocked(prisma.bookmark.delete)).toHaveBeenCalledWith({
      where: { id: TEST_IDS.BOOKMARK },
    })
  })

  it('debe usar el studentId del usuario autenticado para buscar el bookmark', async () => {
    const user = createUserWithStudent({ studentId: TEST_IDS.STUDENT })
    setupAuthenticatedUserWithStudent(user)
    const bookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      studentId: TEST_IDS.STUDENT,
      questionId: TEST_IDS.QUESTION,
    })
    setupBookmarkMock(bookmark)
    setupBookmarkDeleteMock()
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    await DELETE(request)

    expect(vi.mocked(prisma.bookmark.findUnique)).toHaveBeenCalledWith({
      where: {
        studentId_questionId: {
          studentId: TEST_IDS.STUDENT,
          questionId: TEST_IDS.QUESTION,
        },
      },
    })
  })

  it('debe manejar errores de base de datos correctamente', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    const bookmark = createBookmarkWithRelations({
      id: TEST_IDS.BOOKMARK,
      questionId: TEST_IDS.QUESTION,
    })
    setupBookmarkMock(bookmark)
    vi.mocked(prisma.bookmark.delete).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    const response = await DELETE(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error al eliminar favorito')
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })

  it('debe manejar errores al buscar el bookmark', async () => {
    const user = createUserWithStudent()
    setupAuthenticatedUserWithStudent(user)
    vi.mocked(prisma.bookmark.findUnique).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({
      method: 'DELETE',
      queryParams: { questionId: TEST_IDS.QUESTION },
    })

    const response = await DELETE(request)

    expect(response.status).toBe(500)
    const data = await response.json()
    expect(data.error).toBe('Error al eliminar favorito')
  })
})

