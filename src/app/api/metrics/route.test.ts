import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GET } from './route'
import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

vi.mock('@/lib/prisma', () => ({
  prisma: {
    student: {
      findUnique: vi.fn(),
    },
    performanceMetric: {
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

vi.mock('@/lib/api-helpers', async () => {
  const actual = await vi.importActual('@/lib/api-helpers')
  return {
    ...actual,
    validateQuery: vi.fn((req: NextRequest, schema: any) => ({
      success: true,
      data: {},
    })),
    handleApiError: vi.fn((error: Error, message: string) => {
      return new Response(JSON.stringify({ error: message }), { status: 500 })
    }),
  }
})

describe('GET /api/metrics', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe retornar métricas agrupadas por asignatura', async () => {
    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')

    const mockStudent = { id: 'student-1', nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 10,
        correctas: 7,
        porcentaje: 70,
        nivel: 'medio',
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '2',
        totalPreguntas: 8,
        correctas: 6,
        porcentaje: 75,
        nivel: 'alto',
        topic: {
          id: '2',
          nombre: 'Números',
          subject: {
            codigo: 'M1',
            nombre: 'Matemática M1',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data.length).toBeGreaterThan(0)

    // Verificar que las métricas están agrupadas por asignatura
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.totalPreguntas).toBe(10)
    expect(lectora.correctas).toBe(7)
  })

  it('debe retornar 404 si no hay estudiante', async () => {
    vi.mocked(prisma.student.findUnique).mockResolvedValue(null)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toBe('Estudiante no encontrado')
  })

  it('debe calcular correctamente el porcentaje por asignatura', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 10,
        correctas: 8,
        porcentaje: 80,
        nivel: 'alto',
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora.porcentaje).toBe(80) // 8/10 * 100
  })

  it('debe manejar errores correctamente', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockRejectedValue(new Error('Database error'))

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Error al obtener métricas')
  })

  it('debe agrupar múltiples métricas de la misma asignatura', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 5,
        correctas: 4,
        porcentaje: 80,
        nivel: 'alto',
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '2',
        totalPreguntas: 5,
        correctas: 3,
        porcentaje: 60,
        nivel: 'medio',
        topic: {
          id: '2',
          nombre: 'Comprensión inferencial',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.totalPreguntas).toBe(10) // 5 + 5
    expect(lectora.correctas).toBe(7) // 4 + 3
    expect(lectora.porcentaje).toBe(70) // 7/10 * 100
    expect(lectora.temas).toHaveLength(2)
  })

  it('debe manejar el caso cuando totalPreguntas es 0', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 0,
        correctas: 0,
        porcentaje: 0,
        nivel: null,
        topic: {
          id: '1',
          nombre: 'Comprensión literal',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.porcentaje).toBe(0) // Cuando totalPreguntas es 0
  })

  it('debe manejar métricas vacías', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }
    const mockMetrics: any[] = []

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(Array.isArray(data)).toBe(true)
    expect(data).toHaveLength(0)
  })

  it('debe manejar el caso cuando ya existe subjectCode en el acumulador', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 5,
        correctas: 4,
        porcentaje: 80,
        nivel: 'alto',
        topic: {
          id: '1',
          nombre: 'Tema 1',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '2',
        totalPreguntas: 3,
        correctas: 2,
        porcentaje: 66.67,
        nivel: 'medio',
        topic: {
          id: '2',
          nombre: 'Tema 2',
          subject: {
            codigo: 'LECTORA', // Misma asignatura
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '3',
        totalPreguntas: 2,
        correctas: 1,
        porcentaje: 50,
        nivel: 'bajo',
        topic: {
          id: '3',
          nombre: 'Tema 3',
          subject: {
            codigo: 'LECTORA', // Misma asignatura (tercera iteración)
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.totalPreguntas).toBe(10) // 5 + 3 + 2
    expect(lectora.correctas).toBe(7) // 4 + 2 + 1
    expect(lectora.porcentaje).toBe(70) // 7/10 * 100
    expect(lectora.temas).toHaveLength(3) // Debe tener 3 temas
  })

  it('debe manejar el caso cuando totalPreguntas es 0 después de agrupar', async () => {
    const mockStudent = { id: '1', nombre: 'Matías' }
    const mockMetrics = [
      {
        id: '1',
        totalPreguntas: 0,
        correctas: 0,
        porcentaje: 0,
        nivel: null,
        topic: {
          id: '1',
          nombre: 'Tema 1',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
      {
        id: '2',
        totalPreguntas: 0,
        correctas: 0,
        porcentaje: 0,
        nivel: null,
        topic: {
          id: '2',
          nombre: 'Tema 2',
          subject: {
            codigo: 'LECTORA',
            nombre: 'Competencia Lectora',
          },
        },
      },
    ]

    vi.mocked(prisma.student.findUnique).mockResolvedValue(mockStudent as any)
    vi.mocked(prisma.performanceMetric.findMany).mockResolvedValue(mockMetrics as any)

    const { getCurrentStudentId } = await import('@/lib/get-session')
    vi.mocked(getCurrentStudentId).mockResolvedValue('student-1')
    const request = new NextRequest('http://localhost:3000/api/metrics')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    const lectora = data.find((m: any) => m.codigo === 'LECTORA')
    expect(lectora).toBeDefined()
    expect(lectora.totalPreguntas).toBe(0)
    expect(lectora.correctas).toBe(0)
    expect(lectora.porcentaje).toBe(0) // Debe usar el branch de totalPreguntas === 0
  })
})
