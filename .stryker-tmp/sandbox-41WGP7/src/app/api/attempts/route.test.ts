// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
    },
    attempt: {
      findMany: vi.fn(),
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
    studentAttempts: (studentId: string, limit: number, offset: number) =>
      `student:${studentId}:attempts:${limit}:${offset}`,
  },
}))

vi.mock('@/lib/api-helpers', async () => {
  const actual = await vi.importActual('@/lib/api-helpers')
  return {
    ...actual,
    validateQuery: vi.fn((req: NextRequest, schema: any) => ({
      success: true,
      data: { limit: 10, offset: 0 },
    })),
    handleApiError: vi.fn((error: Error, message: string) => {
      return new Response(JSON.stringify({ error: message }), { status: 500 })
    }),
  }
})

describe('GET /api/attempts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar los intentos del estudiante', async () => {
    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')

    const mockStudent = { id: 'student-1', nombre: 'Matías' }
    const mockAttempts = [
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
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    const { getCached } = await import('@/lib/cache')
    vi.mocked(getCached).mockImplementation(async (key, fetcher) => {
      return await fetcher()
    })
    vi.mocked(prisma.attempt.findMany).mockResolvedValue(mockAttempts as any)

    const request = new NextRequest('http://localhost:3000/api/attempts')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(1)
    expect(data[0].estado).toBe('completado')
  })

  it('debe retornar 401 si no está autenticado', async () => {
    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/attempts')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/attempts')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Estudiante no encontrado')
  })

  it('debe manejar errores correctamente', async () => {
    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')

    const mockStudent = { id: 'student-1', nombre: 'Matías' }
    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)

    const { getCached } = await import('@/lib/cache')
    vi.mocked(getCached).mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/attempts')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error al obtener intentos')
  })
})
