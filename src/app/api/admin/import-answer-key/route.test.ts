// @vitest-environment node
// Mock de next/server ANTES de cualquier import
import { vi } from 'vitest'

// Mock de pdf-parse - ahora funciona con import estático
vi.mock('pdf-parse', () => {
  class PDFParse {
    constructor(private _config: { data: Buffer }) {}
    async load() {
      return Promise.resolve()
    }
    async getText() {
      return Promise.resolve({
        text: 'RESPUESTAS:\n1-A\n2-B\n3-C\n4-D\n5-A',
      })
    }
  }
  // Exportar tanto como default como named export para máxima compatibilidad
  const mockModule = {
    default: PDFParse,
    PDFParse,
  }
  // Asegurar que PDFParse esté disponible como propiedad
  Object.defineProperty(mockModule, 'PDFParse', {
    value: PDFParse,
    enumerable: true,
    configurable: false,
    writable: false,
  })
  return mockModule
})

// Mock completo de next/server para evitar problemas con next-auth
// No intentamos importActual porque el módulo no existe en el entorno de pruebas
vi.mock('next/server', () => {
  return {
    NextRequest: class NextRequest {
      url: string
      nextUrl: { searchParams: URLSearchParams }
      headers: Headers
      body: any
      method: string
      constructor(url: string, init?: any) {
        this.url = url
        const urlObj = new URL(url)
        this.nextUrl = { searchParams: urlObj.searchParams }
        this.headers = new Headers()
        this.body = init?.body
        this.method = init?.method || 'GET'
      }
      async json() {
        // Si el body es FormData, no intentar parsear como JSON
        if (this.body instanceof FormData) {
          throw new Error('Cannot parse FormData as JSON')
        }
        if (typeof this.body === 'string') {
          try {
            return JSON.parse(this.body)
          } catch {
            return {}
          }
        }
        return this.body || {}
      }
      async formData() {
        return this.body as FormData
      }
    },
    NextResponse: {
      json: (body: any, init?: { status?: number }) => {
        const status = init?.status || 200
        let jsonBody: string
        try {
          jsonBody = JSON.stringify(body)
        } catch {
          // Si hay error al serializar, usar un objeto de error
          jsonBody = JSON.stringify({ error: 'Error al serializar respuesta' })
        }
        const response = new Response(jsonBody, {
          status,
          headers: { 'Content-Type': 'application/json' },
        })
        // Asegurar que la propiedad status esté disponible
        Object.defineProperty(response, 'status', {
          value: status,
          writable: false,
          enumerable: true,
          configurable: true,
        })
        // Sobrescribir el método json() para que devuelva el body directamente
        response.json = async () => {
          try {
            return body
          } catch {
            return {}
          }
        }
        return response
      },
    },
  }
})

import { describe, it, expect, beforeEach } from 'vitest'
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
      findMany: vi.fn(),
      findUnique: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
    },
    questionOption: {
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback({
      questionOption: {
        update: vi.fn(),
      },
    })),
  },
}))

vi.mock('@/lib/get-session', () => ({
  getCurrentUser: vi.fn(),
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: async (_req: any, handler: () => Promise<Response>) => {
    return await handler()
  },
}))

vi.mock('fs/promises', () => ({
  default: {
    mkdir: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    unlink: vi.fn(),
  },
}))

// Mock del logger que funciona con importaciones dinámicas
vi.mock('@/lib/logger', async () => {
  const mockLogger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }
  return {
    logger: mockLogger,
    default: { logger: mockLogger },
  }
})

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
    // Crear un buffer que comience con '%PDF' y tenga al menos 100 bytes
    const pdfContent = '%PDF-1.4\n' + 'x'.repeat(200)
    const pdfBuffer = Buffer.from(pdfContent)
    const pdfFile = new File([pdfBuffer], 'answer-key.pdf', {
      type: 'application/pdf',
    })
    
    // Mockear arrayBuffer() para que funcione en tests
    ;(pdfFile as any).arrayBuffer = async () => {
      return pdfBuffer.buffer.slice(
        pdfBuffer.byteOffset,
        pdfBuffer.byteOffset + pdfBuffer.byteLength
      )
    }

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
    expect(data.error).toContain('No autorizado')
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
    expect(data.error).toContain('Debe proporcionar un archivo PDF')
  })

  it('debe encontrar el examen y actualizar las respuestas correctas', async () => {
    const mockSubject = { id: 'subject-1', codigo: 'M1', nombre: 'Matemática M1' }
    const mockExam = {
      id: 'exam-1',
      titulo: 'PAES 2024 - Matemática M1',
      questions: [
        {
          orden: 1,
          question: {
            id: 'q1',
            numero: 1,
            options: [
              { id: 'opt1', letra: 'A', esCorrecta: false },
              { id: 'opt2', letra: 'B', esCorrecta: false },
            ],
          },
        },
        {
          orden: 2,
          question: {
            id: 'q2',
            numero: 2,
            options: [
              { id: 'opt3', letra: 'A', esCorrecta: false },
              { id: 'opt4', letra: 'B', esCorrecta: false },
            ],
          },
        },
      ],
    }

    const mockUpdate = vi.fn().mockResolvedValue({})
    
    vi.mocked(prisma.subject.findUnique).mockResolvedValue(mockSubject as any)
    vi.mocked(prisma.exam.findMany).mockResolvedValue([mockExam] as any)
    vi.mocked(prisma.$transaction).mockImplementation(async (callback) => {
      const tx = {
        questionOption: {
          update: mockUpdate,
        },
      } as any
      return await callback(tx)
    })
    vi.mocked(fs.mkdir).mockResolvedValue(undefined)
    // El buffer debe comenzar con '%PDF' para pasar la validación
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('%PDF-1.4\n' + 'x'.repeat(200)))
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)
    vi.mocked(fs.unlink).mockResolvedValue(undefined)

    const request = createFormDataRequest({
      subjectName: 'Matemática M1',
      year: '2024',
    })

    const response = await POST(request)
    const data = await response.json()

    if (response.status !== 200) {
      console.error('Error response:', data)
    }

    expect(response.status).toBe(200)
    expect(data.message).toContain('Clavijero importado exitosamente')
    // Verificar que se llamó update dentro de la transacción
    expect(mockUpdate).toHaveBeenCalled()
  })

  it('debe retornar error si no se encuentra el examen', async () => {
    vi.mocked(prisma.subject.findUnique).mockResolvedValue({
      id: 'subject-1',
      codigo: 'M1',
    } as any)
    vi.mocked(prisma.exam.findMany).mockResolvedValue([])
    vi.mocked(fs.mkdir).mockResolvedValue(undefined)
    vi.mocked(fs.writeFile).mockResolvedValue(undefined)
    vi.mocked(fs.readFile).mockResolvedValue(Buffer.from('%PDF-1.4\n' + 'x'.repeat(200)))
    vi.mocked(fs.unlink).mockResolvedValue(undefined)

    const request = createFormDataRequest()

    const response = await POST(request)
    const data = await response.json()

    // Ahora retorna 404 (Not Found) en lugar de 500, que es más semánticamente correcto
    expect(response.status).toBe(404)
    expect(data.error).toContain('No se encontró ningún examen')
  })
})
