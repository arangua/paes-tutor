// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

vi.mock('next/server', async () => {
  const actual = await vi.importActual('next/server')
  return {
    ...actual,
    NextRequest: class {
      url: string
      constructor(url: string) {
        this.url = url
      }
    },
    NextResponse: {
      json: (body: any, init?: { status?: number }) => {
        return new Response(JSON.stringify(body), {
          status: init?.status || 200,
          headers: { 'Content-Type': 'application/json' },
        })
      },
    },
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    exam: {
      findMany: vi.fn(),
      count: vi.fn(),
    },
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
  logApiError: vi.fn(),
}))

vi.mock('@/lib/cache', () => ({
  getCached: vi.fn((key: string, fetcher: () => Promise<any>) => fetcher()),
  cacheKeys: {
    exams: (subjectId?: string, tipo?: string, limit?: number, offset?: number) =>
      `exams:${subjectId || 'all'}:${tipo || 'all'}:${limit || 'all'}:${offset || 'all'}`,
  },
}))

vi.mock('@/lib/api-helpers', () => ({
  validateQuery: vi.fn((req: NextRequest, schema: any) => ({
    success: true,
    data: {
      subjectId: undefined,
      tipo: undefined,
      limit: 20,
      offset: 0,
    },
  })),
  handleApiError: vi.fn((error: Error, message: string) => {
    return new Response(JSON.stringify({ error: error.message || message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }),
}))

vi.mock('@/lib/validations', () => ({
  examQuerySchema: {},
}))

describe('GET /api/exams', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock autenticación por defecto
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-123')
  })

  it('debe retornar error 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/exams')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe retornar la lista de exámenes', async () => {
    const mockExams = [
      {
        id: '1',
        titulo: 'Simulacro PAES - Competencia Lectora',
        descripcion: 'Examen de práctica',
        tipo: 'simulacro',
        totalPreguntas: 65,
        subject: {
          id: '1',
          nombre: 'Competencia Lectora',
          codigo: 'LECTORA',
        },
        questions: [{ id: '1' }],
      },
    ]

    vi.mocked(prisma.exam.findMany).mockResolvedValue(mockExams as any)
    vi.mocked(prisma.exam.count).mockResolvedValue(1)

    const request = new NextRequest('http://localhost:3000/api/exams')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('exams')
    expect(data).toHaveProperty('pagination')
    expect(Array.isArray(data.exams)).toBe(true)
    expect(data.exams).toHaveLength(1)
    expect(data.exams[0].titulo).toBe('Simulacro PAES - Competencia Lectora')
    expect(data.pagination.total).toBe(1)
  })

  it('debe retornar array vacío si no hay exámenes', async () => {
    vi.mocked(prisma.exam.findMany).mockResolvedValue([])
    vi.mocked(prisma.exam.count).mockResolvedValue(0)

    const request = new NextRequest('http://localhost:3000/api/exams')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('exams')
    expect(Array.isArray(data.exams)).toBe(true)
    expect(data.exams).toHaveLength(0)
    expect(data.pagination.total).toBe(0)
  })

  it('debe manejar errores correctamente', async () => {
    vi.mocked(prisma.exam.findMany).mockRejectedValueOnce(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/exams')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Database error')
  })
})
