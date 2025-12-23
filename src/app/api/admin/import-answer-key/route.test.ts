import { describe, it, expect, beforeEach, vi } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from './route'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import fs from 'fs/promises'

// Mock de dependencias
vi.mock('@/lib/prisma', () => ({
  prisma: {
    subject: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    exam: {
      findFirst: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
    },
    questionOption: {
      update: vi.fn(),
    },
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: (handler: any) => handler,
}))

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    readFile: vi.fn(),
    unlink: vi.fn(),
  },
}))

vi.mock('pdf-parse', () => ({
  PDFParse: class {
    constructor(private data: Buffer) {}
    async load() {}
    async getText() {
      return {
        text: 'RESPUESTAS:\n1-A\n2-B\n3-C\n4-D\n5-A',
      }
    }
  },
}))

describe('POST /api/admin/import-answer-key', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(getCurrentUser).mockResolvedValue({
      id: 'user-123',
      email: 'admin@test.com',
      nombre: 'Admin User',
    } as any)
  })

  const createFormDataRequest = (overrides: any = {}) => {
    const formData = new FormData()
    const pdfBuffer = Buffer.from('fake pdf content')
    const pdfFile = new File([pdfBuffer], 'answer-key.pdf', {
      type: 'application/pdf',
    })

    formData.append('pdfFile', pdfFile)
    formData.append('subjectName', overrides.subjectName || 'Matemática M1')
    formData.append('year', overrides.year || '2024')

    return new NextRequest('http://localhost:3000/api/admin/import-answer-key', {
      method: 'POST',
      body: formData,
    })
  }

  it('debe retornar error si el usuario no está autenticado', async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null)

    const request = createFormDataRequest()

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toContain('No autenticado')
  })

  it('debe retornar error si falta el archivo PDF', async () => {
    const formData = new FormData()
    formData.append('subjectName', 'Matemática M1')
    formData.append('year', '2024')

    const request = new NextRequest('http://localhost:3000/api/admin/import-answer-key', {
      method: 'POST',
      body: formData,
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toContain('Archivo PDF requerido')
  })

  it('debe encontrar el examen y actualizar las respuestas correctas', async () => {
    const mockSubject = { id: 'subject-1', codigo: 'M1', nombre: 'Matemática M1' }
    const mockExam = { id: 'exam-1', titulo: 'PAES 2024 - Matemática M1' }
    const mockQuestions = [
      {
        id: 'q1',
        numero: 1,
        options: [
          { id: 'opt1', letra: 'A' },
          { id: 'opt2', letra: 'B' },
        ],
      },
      {
        id: 'q2',
        numero: 2,
        options: [
          { id: 'opt3', letra: 'A' },
          { id: 'opt4', letra: 'B' },
        ],
      },
    ]

    vi.mocked(prisma.subject.findUnique).mockResolvedValue(mockSubject as any)
    vi.mocked(prisma.exam.findFirst).mockResolvedValue(mockExam as any)
    vi.mocked(prisma.question.findMany).mockResolvedValue(mockQuestions as any)
    vi.mocked(prisma.questionOption.update).mockResolvedValue({} as any)
    vi.mocked(fs.mkdir).mockResolvedValue(undefined)
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('fake pdf'))
    vi.mocked(fs.unlink).mockResolvedValue(undefined)

    const request = createFormDataRequest({
      subjectName: 'Matemática M1',
      year: '2024',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toContain('Clavijero importado exitosamente')
    expect(prisma.questionOption.update).toHaveBeenCalled()
  })

  it('debe retornar error si no se encuentra el examen', async () => {
    vi.mocked(prisma.subject.findUnique).mockResolvedValue({
      id: 'subject-1',
      codigo: 'M1',
    } as any)
    vi.mocked(prisma.exam.findFirst).mockResolvedValue(null)
    vi.mocked(fs.mkdir).mockResolvedValue(undefined)
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('fake pdf'))
    vi.mocked(fs.unlink).mockResolvedValue(undefined)

    const request = createFormDataRequest()

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.error).toContain('No se encontró el examen')
  })
})
