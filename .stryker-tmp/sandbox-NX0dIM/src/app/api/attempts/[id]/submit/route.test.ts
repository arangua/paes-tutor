// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    attempt: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    scoreTable: {
      findFirst: vi.fn(),
    },
    performanceMetric: {
      findMany: vi.fn(),
      upsert: vi.fn(),
    },
    $transaction: vi.fn(callback =>
      callback({
        attempt: { update: vi.fn() },
        performanceMetric: { findMany: vi.fn(), upsert: vi.fn() },
      })
    ),
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentStudentId: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req: NextRequest, handler: () => Promise<Response>) => handler()),
}))

vi.mock('@/lib/logger', () => ({
  logApiRequest: vi.fn(),
}))

vi.mock('@/lib/cache', () => ({
  invalidateCachePattern: vi.fn(),
}))

vi.mock('@/lib/api-helpers', () => ({
  handleApiError: vi.fn((error: Error) => {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }),
}))

describe('POST /api/attempts/[id]/submit', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-123')
  })

  it('debe validar formato de ID', async () => {
    const request = new NextRequest('http://localhost:3000/api/attempts/invalid-id/submit', {
      method: 'POST',
    })

    const response = await POST(request, {
      params: Promise.resolve({ id: 'invalid-id' }),
    })

    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('ID de intento inválido')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost:3000/api/attempts/c123456789012345678901234/submit',
      {
        method: 'POST',
      }
    )

    const response = await POST(request, {
      params: Promise.resolve({ id: 'c123456789012345678901234' }),
    })

    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe validar estado cancelado', async () => {
    const mockAttempt = {
      id: 'c123456789012345678901234',
      studentId: 'student-123',
      estado: 'cancelado',
      exam: {
        subject: { codigo: 'MATH' },
      },
      answers: [],
    }

    vi.mocked(prisma.attempt.findUnique).mockResolvedValue(mockAttempt as any)

    const request = new NextRequest(
      'http://localhost:3000/api/attempts/c123456789012345678901234/submit',
      {
        method: 'POST',
      }
    )

    const response = await POST(request, {
      params: Promise.resolve({ id: 'c123456789012345678901234' }),
    })

    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('No se puede completar un intento cancelado')
  })

  it('debe finalizar intento correctamente', async () => {
    const mockAttempt = {
      id: 'c123456789012345678901234',
      studentId: 'student-123',
      estado: 'en_progreso',
      startedAt: new Date(Date.now() - 60000), // Hace 1 minuto
      totalPreguntas: 10,
      exam: {
        subject: { codigo: 'MATH' },
      },
      answers: [
        { esCorrecta: true, question: { topicId: 'topic-1' } },
        { esCorrecta: false, question: { topicId: 'topic-1' } },
        { esCorrecta: true, question: { topicId: 'topic-2' } },
      ],
    }

    const mockUpdatedAttempt = {
      ...mockAttempt,
      estado: 'completado',
      correctas: 2,
      incorrectas: 1,
      omitidas: 0,
      porcentaje: 20,
    }

    vi.mocked(prisma.attempt.findUnique).mockResolvedValue(mockAttempt as any)
    vi.mocked(prisma.$transaction).mockResolvedValue(mockUpdatedAttempt as any)
    vi.mocked(prisma.scoreTable.findFirst).mockResolvedValue(null)

    const request = new NextRequest(
      'http://localhost:3000/api/attempts/c123456789012345678901234/submit',
      {
        method: 'POST',
      }
    )

    const response = await POST(request, {
      params: Promise.resolve({ id: 'c123456789012345678901234' }),
    })

    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.estado).toBe('completado')
  })
})
