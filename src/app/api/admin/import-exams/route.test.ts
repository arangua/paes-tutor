import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { NextRequest } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import fs from 'fs/promises'
import pdf from 'pdf-parse'

// Mock dependencies
vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subject: {
      findUnique: vi.fn(),
    },
    question: {
      create: vi.fn(),
    },
    exam: {
      create: vi.fn(),
    },
    $transaction: vi.fn(callback =>
      callback({
        subject: {
          findUnique: vi.fn(),
        },
        question: {
          create: vi.fn(),
        },
        exam: {
          create: vi.fn(),
        },
        topic: {
          findMany: vi.fn(),
        },
      })
    ),
  },
}))

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    readFile: vi.fn(),
    unlink: vi.fn(),
  },
}))

vi.mock('fs', () => ({
  default: {
    createWriteStream: vi.fn(() => ({
      on: vi.fn(),
      close: vi.fn(),
      pipe: vi.fn(),
    })),
    unlink: vi.fn(),
  },
}))

vi.mock('pdf-parse', () => ({
  default: vi.fn(),
}))

vi.mock('https', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('http', () => ({
  default: {
    get: vi.fn(),
  },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req, handler) => handler()),
}))

vi.mock('@/lib/api-helpers', () => ({
  validateBody: vi.fn(async (req, schema) => {
    const body = await req.json()
    try {
      const data = schema.parse(body)
      return { success: true, data }
    } catch {
      return {
        success: false,
        error: {
          json: vi.fn(() => ({ error: 'Datos inválidos' })),
          status: 400,
        },
      }
    }
  }),
}))

describe('POST /api/admin/import-exams', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe requerir autenticación', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/admin/import-exams', {
      method: 'POST',
      body: JSON.stringify({
        exams: [
          {
            pdfUrl: 'https://demre.cl/test.pdf',
            subjectName: 'Competencia Lectora',
            examTitle: 'Test Exam',
            examType: 'oficial',
            year: '2026',
          },
        ],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No autorizado')
  })

  it('debe validar el body con Zod', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/import-exams', {
      method: 'POST',
      body: JSON.stringify({
        exams: [
          {
            pdfUrl: 'invalid-url', // URL inválida
            subjectName: '',
            examTitle: '',
            examType: 'oficial',
            year: '2026',
          },
        ],
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  it('debe validar que la asignatura exista', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/import-exams', {
      method: 'POST',
      body: JSON.stringify({
        exams: [
          {
            pdfUrl: 'https://demre.cl/test.pdf',
            subjectName: 'Asignatura Inexistente',
            examTitle: 'Test Exam',
            examType: 'oficial',
            year: '2026',
          },
        ],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results[0].success).toBe(false)
    expect(data.results[0].message).toContain('Asignatura no encontrada')
  })

  it('debe procesar múltiples exámenes', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/import-exams', {
      method: 'POST',
      body: JSON.stringify({
        exams: [
          {
            pdfUrl: 'https://demre.cl/test1.pdf',
            subjectName: 'Competencia Lectora',
            examTitle: 'Test Exam 1',
            examType: 'oficial',
            year: '2026',
          },
          {
            pdfUrl: 'https://demre.cl/test2.pdf',
            subjectName: 'Matemática M1',
            examTitle: 'Test Exam 2',
            examType: 'oficial',
            year: '2026',
          },
        ],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.total).toBe(2)
    expect(Array.isArray(data.results)).toBe(true)
  })

  it('debe retornar resultados individuales para cada examen', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/import-exams', {
      method: 'POST',
      body: JSON.stringify({
        exams: [
          {
            pdfUrl: 'https://demre.cl/test.pdf',
            subjectName: 'Competencia Lectora',
            examTitle: 'Test Exam',
            examType: 'oficial',
            year: '2026',
          },
        ],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.results).toBeDefined()
    expect(Array.isArray(data.results)).toBe(true)
    expect(data.results[0]).toHaveProperty('success')
    expect(data.results[0]).toHaveProperty('examTitle')
    expect(data.results[0]).toHaveProperty('message')
  })

  it('debe contar exámenes exitosos y fallidos', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue({ id: 'user1', email: 'test@test.com' })

    const request = new NextRequest('http://localhost:3000/api/admin/import-exams', {
      method: 'POST',
      body: JSON.stringify({
        exams: [
          {
            pdfUrl: 'https://demre.cl/test.pdf',
            subjectName: 'Competencia Lectora',
            examTitle: 'Test Exam',
            examType: 'oficial',
            year: '2026',
          },
        ],
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.total).toBeDefined()
    expect(data.successful).toBeDefined()
    expect(typeof data.successful).toBe('number')
  })
})
