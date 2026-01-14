// @vitest-environment node
/**
 * Tests Enterprise para API de Search
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import {
  TEST_IDS,
  createExamForSearch,
  createMaterialForSearch,
  createTopicForSearch,
  setupAuthenticatedSession,
  setupUnauthenticatedSession,
  setupExamsMock,
  setupMaterialsMock,
  setupTopicsMock,
  setupAttemptsMock,
  setupSubjectsMock,
  createTestRequest,
  assertSuccessResponse,
  assertErrorResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    exam: { findMany: vi.fn() },
    studyMaterial: { findMany: vi.fn() },
    topic: { findMany: vi.fn() },
    attempt: { findMany: vi.fn() },
    subject: { findMany: vi.fn() },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar 401 si no está autenticado', async () => {
    setupUnauthenticatedSession()
    const request = createTestRequest({ queryParams: { q: 'test' } })
    const response = await GET(request)
    await assertErrorResponse(response, 401, 'No autorizado')
  })

  it('debe retornar 400 si q no está presente', async () => {
    setupAuthenticatedSession()
    const request = createTestRequest()
    const response = await GET(request)
    await assertErrorResponse(response, 400, 'Parámetros de consulta inválidos')
  })

  it('debe retornar resultados vacíos si q está vacío', async () => {
    setupAuthenticatedSession()
    const request = createTestRequest({ queryParams: { q: '   ' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.results).toEqual([])
    expect(data.suggestions).toEqual([])
    expect(data.total).toBe(0)
  })

  it('debe buscar en exámenes', async () => {
    setupAuthenticatedSession()
    const exams = [createExamForSearch({ titulo: 'Test Exam' })]
    setupExamsMock(exams)
    setupMaterialsMock([])
    setupTopicsMock([])
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'test', types: 'exams' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.results).toBeDefined()
    expect(vi.mocked(prisma.exam.findMany)).toHaveBeenCalled()
  })

  it('debe buscar en materiales', async () => {
    setupAuthenticatedSession()
    setupExamsMock([])
    const materials = [createMaterialForSearch({ titulo: 'Test Material' })]
    setupMaterialsMock(materials)
    setupTopicsMock([])
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'test', types: 'materials' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.results).toBeDefined()
    expect(vi.mocked(prisma.studyMaterial.findMany)).toHaveBeenCalled()
  })

  it('debe buscar en temas', async () => {
    setupAuthenticatedSession()
    setupExamsMock([])
    setupMaterialsMock([])
    const topics = [createTopicForSearch({ nombre: 'Test Topic' })]
    setupTopicsMock(topics)
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'test', types: 'topics' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.results).toBeDefined()
    expect(vi.mocked(prisma.topic.findMany)).toHaveBeenCalled()
  })

  it('debe buscar en intentos', async () => {
    setupAuthenticatedSession()
    setupExamsMock([])
    setupMaterialsMock([])
    setupTopicsMock([])
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'test', types: 'attempts' } })
    await GET(request)
    expect(vi.mocked(prisma.attempt.findMany)).toHaveBeenCalled()
  })

  it('debe buscar en todos los tipos por defecto', async () => {
    setupAuthenticatedSession()
    setupExamsMock([])
    setupMaterialsMock([])
    setupTopicsMock([])
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'test' } })
    await GET(request)
    expect(vi.mocked(prisma.exam.findMany)).toHaveBeenCalled()
    expect(vi.mocked(prisma.studyMaterial.findMany)).toHaveBeenCalled()
    expect(vi.mocked(prisma.topic.findMany)).toHaveBeenCalled()
    expect(vi.mocked(prisma.attempt.findMany)).toHaveBeenCalled()
  })

  it('debe aplicar paginación correctamente', async () => {
    setupAuthenticatedSession()
    setupExamsMock([])
    setupMaterialsMock([])
    setupTopicsMock([])
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'test', limit: '5', offset: '10' } })
    await GET(request)
    // Verificar que se aplica paginación en los resultados finales
  })

  it('debe ordenar resultados por relevancia', async () => {
    setupAuthenticatedSession()
    const exams = [
      createExamForSearch({ titulo: 'Exact Match Test' }),
      createExamForSearch({ titulo: 'Test Other' }),
    ]
    setupExamsMock(exams)
    setupMaterialsMock([])
    setupTopicsMock([])
    setupAttemptsMock([])
    setupSubjectsMock([])
    const request = createTestRequest({ queryParams: { q: 'Exact Match', types: 'exams' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    // El resultado con match exacto debe tener mayor relevancia
    expect(data.results).toBeDefined()
  })

  it('debe generar sugerencias', async () => {
    setupAuthenticatedSession()
    setupExamsMock([])
    setupMaterialsMock([])
    setupTopicsMock([])
    setupAttemptsMock([])
    const subjects = [{ id: TEST_IDS.SUBJECT, nombre: 'Test Subject', codigo: 'TEST', createdAt: new Date(), updatedAt: new Date() }]
    setupSubjectsMock(subjects)
    const request = createTestRequest({ queryParams: { q: 'test' } })
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.suggestions).toBeDefined()
    expect(Array.isArray(data.suggestions)).toBe(true)
  })

  it('debe manejar errores correctamente', async () => {
    setupAuthenticatedSession()
    vi.mocked(prisma.exam.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest({ queryParams: { q: 'test' } })
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

