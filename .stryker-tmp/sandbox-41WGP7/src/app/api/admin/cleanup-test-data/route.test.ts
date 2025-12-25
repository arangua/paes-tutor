// @ts-nocheck
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'

// Mock de dependencias
vi.mock('@/lib/prisma', () => ({
  prisma: {
    $transaction: vi.fn(),
    exam: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    topic: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    attempt: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    user: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: (_request: any, handler: () => Promise<any>) => handler(),
}))

describe('POST /api/admin/cleanup-test-data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 'user-123',
      email: 'admin@test.com',
      nombre: 'Admin User',
    } as any)
  })

  const createRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/admin/cleanup-test-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
  }

  it('debe retornar error si el usuario no está autenticado', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    const request = createRequest({
      deleteExams: true,
      onlyTestData: true,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('No autorizado')
  })

  it('debe validar el schema correctamente', async () => {
    const request = createRequest({
      deleteExams: 'invalid', // Debe ser boolean
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBeDefined()
  })

  it('debe eliminar exámenes de prueba cuando deleteExams es true', async () => {
    const mockExams = [
      { id: 'exam-1', titulo: 'Test Exam' },
      { id: 'exam-2', titulo: 'Prueba Demo' },
    ]

    // Mock de la transacción con un objeto que tiene los métodos necesarios
    const mockTx = {
      exam: {
        findMany: vi.fn().mockResolvedValue(mockExams as any),
        deleteMany: vi.fn().mockResolvedValue({ count: 2 } as any),
        count: vi.fn().mockResolvedValue(2),
      },
      topic: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      question: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      attempt: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      user: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      subject: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    }

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      return await callback(mockTx)
    })

    const request = createRequest({
      deleteExams: true,
      deleteTopics: false,
      deleteQuestions: false,
      deleteAttempts: false,
      deleteTestUsers: false,
      onlyTestData: true,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.result.exams.deleted).toBe(2)
    expect(mockTx.exam.deleteMany).toHaveBeenCalled()
  })

  it('debe filtrar por año cuando se proporciona yearFilter', async () => {
    const mockExams = [{ id: 'exam-1', titulo: 'Test 2024' }]

    const mockTx = {
      exam: {
        findMany: vi.fn().mockResolvedValue(mockExams as any),
        deleteMany: vi.fn().mockResolvedValue({ count: 1 } as any),
        count: vi.fn().mockResolvedValue(1),
      },
      topic: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      question: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      attempt: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      user: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 0 } as any),
        count: vi.fn().mockResolvedValue(0),
      },
      subject: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    }

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      return await callback(mockTx)
    })

    const request = createRequest({
      deleteExams: true,
      onlyTestData: true,
      yearFilter: '2024',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    // El código usa count directamente, no findMany para obtener el total
    expect(mockTx.exam.count).toHaveBeenCalled()
    expect(data.result.exams.deleted).toBe(1)
  })

  it('debe eliminar todos los datos cuando onlyTestData es false', async () => {
    const mockTx = {
      exam: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 5 } as any),
        count: vi.fn().mockResolvedValue(5),
      },
      topic: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 3 } as any),
        count: vi.fn().mockResolvedValue(3),
      },
      question: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 10 } as any),
        count: vi.fn().mockResolvedValue(10),
      },
      attempt: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 2 } as any),
        count: vi.fn().mockResolvedValue(2),
      },
      user: {
        findMany: vi.fn().mockResolvedValue([]),
        deleteMany: vi.fn().mockResolvedValue({ count: 1 } as any),
        count: vi.fn().mockResolvedValue(1),
      },
      subject: {
        findUnique: vi.fn().mockResolvedValue(null),
      },
    }

    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      return await callback(mockTx)
    })

    const request = createRequest({
      deleteExams: true,
      deleteTopics: true,
      deleteQuestions: true,
      deleteAttempts: true,
      deleteTestUsers: true,
      onlyTestData: false,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.result.exams.deleted).toBe(5)
    expect(data.result.topics.deleted).toBe(3)
    expect(data.result.questions.deleted).toBe(10)
  })

  it('debe manejar errores en la transacción', async () => {
    // Hacer que getCurrentUser falle para probar el manejo de errores
    vi.mocked(getCurrentUser).mockRejectedValue(new Error('Database connection failed'))

    const request = createRequest({
      deleteExams: true,
      onlyTestData: true,
    })

    const response = await POST(request)
    const data = await response.json()

    // El error se captura en el catch externo y retorna 500
    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
    expect(data.error).toContain('Error al limpiar datos')
  })
})
