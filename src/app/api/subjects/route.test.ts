// @vitest-environment node
/**
 * Tests Enterprise para API de Subjects
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { logger } from '@/lib/logger'
import {
  createSubject,
  setupSubjectsMock,
  createTestRequest,
  assertSuccessResponse,
} from './__tests__/test-helpers'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subject: { findMany: vi.fn() },
  },
}))

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((request: NextRequest, handler: () => Promise<any>) => handler()),
}))

describe('GET /api/subjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar todas las asignaturas', async () => {
    const subjects = [
      createSubject({ id: 'c1', nombre: 'Matemáticas' }),
      createSubject({ id: 'c2', nombre: 'Lenguaje' }),
    ]
    setupSubjectsMock(subjects)
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.subjects).toHaveLength(2)
    expect(data.subjects[0].nombre).toBe('Matemáticas')
  })

  it('debe ordenar asignaturas por nombre ascendente', async () => {
    const subjects = [
      createSubject({ nombre: 'Z' }),
      createSubject({ nombre: 'A' }),
      createSubject({ nombre: 'M' }),
    ]
    setupSubjectsMock(subjects)
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(prisma.subject.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: { nombre: 'asc' },
      })
    )
  })

  it('debe retornar array vacío si no hay asignaturas', async () => {
    setupSubjectsMock([])
    const request = createTestRequest()
    const response = await GET(request)
    const data = await assertSuccessResponse(response)
    expect(data.subjects).toEqual([])
  })

  it('debe incluir solo campos seleccionados', async () => {
    const subjects = [createSubject()]
    setupSubjectsMock(subjects)
    const request = createTestRequest()
    await GET(request)
    expect(vi.mocked(prisma.subject.findMany)).toHaveBeenCalledWith(
      expect.objectContaining({
        select: {
          id: true,
          nombre: true,
          codigo: true,
          tipo: true,
        },
      })
    )
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.subject.findMany).mockRejectedValue(new Error('Database error'))
    const request = createTestRequest()
    const response = await GET(request)
    expect(response.status).toBe(500)
    expect(vi.mocked(logger.error)).toHaveBeenCalled()
  })
})

