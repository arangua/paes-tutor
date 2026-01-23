// @vitest-environment node
/**
 * Tests Enterprise para POST /api/admin/generate-exam
 * 
 * Usa shared enterprise test helpers para mantener tests limpios y mantenibles.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { POST } from './route'
import { getCurrentUser } from '@/lib/get-session'
import { isAdmin } from '@/lib/check-admin'
import { prisma } from '@/lib/prisma'
import { generateExamWithAI } from '@/lib/exam-generator'
import {
  createTestRequest,
  assertErrorResponse,
  clearAllMocks,
} from '@/test/enterprise/shared-test-helpers'

vi.mock('@/lib/get-session', async () => {
  const actual = await vi.importActual<typeof import('@/lib/get-session')>('@/lib/get-session')
  return {
    ...actual,
    getSession: vi.fn(),
    getCurrentUser: vi.fn(),
    getCurrentStudentId: vi.fn(),
    getAuthenticatedUserWithStudent: vi.fn(),
  }
})

vi.mock('@/lib/check-admin', () => ({
  isAdmin: vi.fn(),
}))

vi.mock('@/lib/exam-generator', () => ({
  generateExamWithAI: vi.fn(),
}))

vi.mock('@/lib/prisma', () => ({
  prisma: {
    subject: {
      findUnique: vi.fn(),
    },
    topic: {
      count: vi.fn(),
      findFirst: vi.fn(),
    },
    exam: {
      create: vi.fn(),
    },
    question: {
      create: vi.fn(),
    },
    examQuestion: {
      create: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}))

vi.mock('@/lib/rate-limit-middleware', () => ({
  withRateLimit: vi.fn((req, handler) => handler()),
}))

vi.mock('@/lib/api-helpers', () => ({
  validateBody: vi.fn(),
}))

vi.mock('@/lib/logger', () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

// Fixtures inline
const validPayload = {
  subjectId: 'subject-123',
  numQuestions: 10,
  difficulty: 'media' as const,
  tipo: 'objetiva' as const,
  includeAnswerKey: true,
}

const mockSubject = {
  id: 'subject-123',
  codigo: 'LECTORA',
  nombre: 'Competencia Lectora',
  tipo: 'PAES',
}

const mockGeneratedExam = {
  titulo: 'Examen de Prueba',
  descripcion: 'Descripción del examen',
  questions: [
    {
      enunciado: '¿Cuál es la capital de Chile?',
      dificultad: 'media',
      explicacion: 'Santiago es la capital',
      opciones: [
        { letra: 'A', texto: 'Santiago', esCorrecta: true },
        { letra: 'B', texto: 'Valparaíso', esCorrecta: false },
        { letra: 'C', texto: 'Concepción', esCorrecta: false },
      ],
      topicId: 'topic-123',
    },
    {
      enunciado: '¿Cuál es el océano que baña las costas de Chile?',
      dificultad: 'baja',
      explicacion: 'El Pacífico',
      opciones: [
        { letra: 'A', texto: 'Atlántico', esCorrecta: false },
        { letra: 'B', texto: 'Pacífico', esCorrecta: true },
        { letra: 'C', texto: 'Índico', esCorrecta: false },
      ],
      topicId: 'topic-123',
    },
  ],
  answerKey: {
    '1': 'A',
    '2': 'B',
  },
}

describe('POST /api/admin/generate-exam', () => {
  beforeEach(() => {
    clearAllMocks()
  })

  describe('Autenticación y autorización', () => {
    it('debe rechazar sin sesión (401)', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue(null)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      await assertErrorResponse(response, 401, 'No autorizado')
    })

    it('debe rechazar sin rol admin (403)', async () => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'user@test.com',
      } as any)
      vi.mocked(isAdmin).mockResolvedValue(false)

      const { validateBody } = await import('@/lib/api-helpers')
      vi.mocked(validateBody).mockResolvedValue({
        success: true,
        data: validPayload,
      } as any)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(403)
      expect(data.error).toContain('permisos de administrador')
    })
  })

  describe('Validación de payload', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
      vi.mocked(isAdmin).mockResolvedValue(true)
    })

    it('debe rechazar payload inválido - campos faltantes (400)', async () => {
      const { validateBody } = await import('@/lib/api-helpers')
      const { NextResponse } = await import('next/server')
      vi.mocked(validateBody).mockResolvedValue({
        success: false,
        error: NextResponse.json(
          {
            error: 'Datos inválidos',
            details: [{ path: ['subjectId'], message: 'La asignatura es requerida' }],
          },
          { status: 400 }
        ),
      } as any)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: {
          // Falta subjectId
          numQuestions: 10,
        },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
      expect(data.details).toBeDefined()
    })

    it('debe rechazar payload inválido - numQuestions fuera de rango (400)', async () => {
      const { validateBody } = await import('@/lib/api-helpers')
      const { NextResponse } = await import('next/server')
      vi.mocked(validateBody).mockResolvedValue({
        success: false,
        error: NextResponse.json(
          {
            error: 'Datos inválidos',
            details: [
              {
                path: ['numQuestions'],
                message: 'El número de preguntas debe estar entre 5 y 80',
              },
            ],
          },
          { status: 400 }
        ),
      } as any)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: {
          subjectId: 'subject-123',
          numQuestions: 100, // Fuera de rango
        },
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toBeDefined()
    })
  })

  describe('Validación de recursos', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
      vi.mocked(isAdmin).mockResolvedValue(true)
    })

    it('debe rechazar si la asignatura no existe (404)', async () => {
      const { validateBody } = await import('@/lib/api-helpers')
      vi.mocked(validateBody).mockResolvedValue({
        success: true,
        data: validPayload,
      } as any)

      vi.mocked(prisma.subject.findUnique).mockResolvedValue(null)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toBe('Asignatura no encontrada')
    })

    it('debe rechazar si no hay temas disponibles (404)', async () => {
      const { validateBody } = await import('@/lib/api-helpers')
      vi.mocked(validateBody).mockResolvedValue({
        success: true,
        data: validPayload,
      } as any)

      vi.mocked(prisma.subject.findUnique).mockResolvedValue(mockSubject as any)
      vi.mocked(prisma.topic.count).mockResolvedValue(0)

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.error).toContain('No se encontraron temas')
    })
  })

  describe('Generación exitosa', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
      vi.mocked(isAdmin).mockResolvedValue(true)
    })

    it('debe generar examen válido y retornar success con shape correcta (200)', async () => {
      const { validateBody } = await import('@/lib/api-helpers')
      vi.mocked(validateBody).mockResolvedValue({
        success: true,
        data: validPayload,
      } as any)

      vi.mocked(prisma.subject.findUnique).mockResolvedValue(mockSubject as any)
      vi.mocked(prisma.topic.count).mockResolvedValue(5) // Hay temas disponibles
      vi.mocked(generateExamWithAI).mockResolvedValue(mockGeneratedExam as any)

      // Mock de transaction
      const mockExam = {
        id: 'exam-123',
        subjectId: validPayload.subjectId,
        titulo: mockGeneratedExam.titulo,
        totalPreguntas: mockGeneratedExam.questions.length,
        tipo: 'objetiva',
        tiempoLimiteMin: 15,
        fuente: 'Generado con IA',
      }

      const mockQuestions = mockGeneratedExam.questions.map((q, i) => ({
        id: `question-${i + 1}`,
        subjectId: validPayload.subjectId,
        topicId: q.topicId,
        enunciado: q.enunciado,
        dificultad: q.dificultad,
        explicacion: q.explicacion,
        tipo: 'objetiva',
      }))

      vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
        const tx = {
          exam: {
            create: vi.fn().mockResolvedValue(mockExam),
          },
          question: {
            create: vi.fn().mockImplementation(async (args: any) => {
              const questionIndex = mockQuestions.findIndex(
                q => q.enunciado === args.data.enunciado
              )
              return mockQuestions[questionIndex] || mockQuestions[0]
            }),
          },
          topic: {
            findFirst: vi.fn().mockResolvedValue({
              id: 'topic-123',
              subjectId: validPayload.subjectId,
            }),
          },
          examQuestion: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return callback(tx)
      })

      const request = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.message).toBeDefined()
      expect(data.exam).toBeDefined()
      expect(data.exam.id).toBe(mockExam.id)
      expect(data.exam.titulo).toBe(mockExam.titulo)
      expect(data.exam.totalPreguntas).toBe(mockExam.totalPreguntas)
      expect(data.exam.subjectId).toBe(mockExam.subjectId)
      expect(data.answerKey).toBeDefined()
      expect(data.questionsGenerated).toBe(mockGeneratedExam.questions.length)

      // Contract anchors (evita respuestas "accidentales")
      expect(typeof data.message).toBe('string')
      expect(typeof data.answerKey).toBe('object')
      expect(data.answerKey).not.toBeNull()
      expect(Array.isArray(data.answerKey)).toBe(false) // answerKey es Record<number, string>, no array
      const answerKeyKeys = Object.keys(data.answerKey)
      expect(answerKeyKeys.length).toBeGreaterThan(0)
      const firstAnswerKeyValue = data.answerKey[answerKeyKeys[0] as any]
      expect(typeof firstAnswerKeyValue).toBe('string') // El valor debe ser string (letra de opción)
      expect(prisma.$transaction).toHaveBeenCalledTimes(1)
    })
  })

  describe('Determinismo', () => {
    beforeEach(() => {
      vi.mocked(getCurrentUser).mockResolvedValue({
        id: 'user-123',
        email: 'admin@test.com',
      } as any)
      vi.mocked(isAdmin).mockResolvedValue(true)
    })

    it('debe generar examen de forma determinista - misma entrada dos veces retorna resultados consistentes', async () => {
      const { validateBody } = await import('@/lib/api-helpers')
      vi.mocked(validateBody).mockResolvedValue({
        success: true,
        data: validPayload,
      } as any)

      vi.mocked(prisma.subject.findUnique).mockResolvedValue(mockSubject as any)
      vi.mocked(prisma.topic.count).mockResolvedValue(5)
      vi.mocked(generateExamWithAI).mockResolvedValue(mockGeneratedExam as any)

      const mockExam1 = {
        id: 'exam-123',
        subjectId: validPayload.subjectId,
        titulo: mockGeneratedExam.titulo,
        totalPreguntas: mockGeneratedExam.questions.length,
        tipo: 'objetiva',
        tiempoLimiteMin: 15,
        fuente: 'Generado con IA',
      }

      const mockExam2 = {
        id: 'exam-456',
        subjectId: validPayload.subjectId,
        titulo: mockGeneratedExam.titulo,
        totalPreguntas: mockGeneratedExam.questions.length,
        tipo: 'objetiva',
        tiempoLimiteMin: 15,
        fuente: 'Generado con IA',
      }

      const mockQuestions = mockGeneratedExam.questions.map((q, i) => ({
        id: `question-${i + 1}`,
        subjectId: validPayload.subjectId,
        topicId: q.topicId,
        enunciado: q.enunciado,
        dificultad: q.dificultad,
        explicacion: q.explicacion,
        tipo: 'objetiva',
      }))

      // Primera ejecución
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
        const tx = {
          exam: {
            create: vi.fn().mockResolvedValue(mockExam1),
          },
          question: {
            create: vi.fn().mockImplementation(async (args: any) => {
              const questionIndex = mockQuestions.findIndex(
                q => q.enunciado === args.data.enunciado
              )
              return mockQuestions[questionIndex] || mockQuestions[0]
            }),
          },
          topic: {
            findFirst: vi.fn().mockResolvedValue({
              id: 'topic-123',
              subjectId: validPayload.subjectId,
            }),
          },
          examQuestion: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return callback(tx)
      })

      const request1 = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response1 = await POST(request1)
      const data1 = await response1.json()

      expect(response1.status).toBe(200)
      expect(data1.success).toBe(true)
      expect(data1.exam.id).toBe(mockExam1.id)
      expect(data1.questionsGenerated).toBe(mockGeneratedExam.questions.length)

      // Segunda ejecución - crea nuevo examen (no duplica, crea uno nuevo)
      vi.mocked(prisma.$transaction).mockImplementationOnce(async (callback: any) => {
        const tx = {
          exam: {
            create: vi.fn().mockResolvedValue(mockExam2), // Nuevo ID
          },
          question: {
            create: vi.fn().mockImplementation(async (args: any) => {
              const questionIndex = mockQuestions.findIndex(
                q => q.enunciado === args.data.enunciado
              )
              return mockQuestions[questionIndex] || mockQuestions[0]
            }),
          },
          topic: {
            findFirst: vi.fn().mockResolvedValue({
              id: 'topic-123',
              subjectId: validPayload.subjectId,
            }),
          },
          examQuestion: {
            create: vi.fn().mockResolvedValue({}),
          },
        }
        return callback(tx)
      })

      const request2 = createTestRequest({
        url: 'http://localhost:3000/api/admin/generate-exam',
        method: 'POST',
        body: validPayload,
        headers: { 'content-type': 'application/json' },
      })

      const response2 = await POST(request2)
      const data2 = await response2.json()

      expect(response2.status).toBe(200)
      expect(data2.success).toBe(true)
      expect(data2.exam.id).toBe(mockExam2.id) // ID diferente (nuevo examen)
      expect(data2.questionsGenerated).toBe(mockGeneratedExam.questions.length) // Mismo conteo
    })
  })
})
