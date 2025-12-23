import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { NextRequest } from 'next/server'

// Mock de Prisma y autenticación
vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
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

vi.mock('@/lib/cache', () => {
  const mockGetCached = vi.fn((key: string, fetcher: () => Promise<any>) => fetcher())
  return {
    getCached: mockGetCached,
    cacheKeys: {
      student: (id: string) => `student:${id}`,
    },
    __mockGetCached: mockGetCached, // Exportar para uso en tests
  }
})

describe('GET /api/student', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
  })

  it('debe retornar el estudiante con intentos y métricas', async () => {
    const mockStudent = {
      id: 'student-1',
      nombre: 'Matías',
      attempts: [
        {
          id: '1',
          estado: 'completado',
          porcentaje: 70,
          correctas: 7,
          totalPreguntas: 10,
          createdAt: new Date(),
          exam: {
            titulo: 'Simulacro PAES',
            subject: {
              nombre: 'Competencia Lectora',
              codigo: 'LECTORA',
            },
          },
        },
      ],
      metrics: [],
    }

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)

    const request = new NextRequest('http://localhost:3000/api/student')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.nombre).toBe('Matías')
    expect(data.attempts).toHaveLength(1)
  })

  it('debe retornar 401 si no está autenticado', async () => {
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/student')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/student')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Estudiante no encontrado')
  })

  it('debe manejar errores correctamente', async () => {
    // Mock getCached para que lance el error
    const { getCached } = await import('@/lib/cache')
    vi.mocked(getCached).mockRejectedValueOnce(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/student')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Database error')
  })
})
