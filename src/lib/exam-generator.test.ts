import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import type { ExamGenerationParams } from './exam-generator'

// Mock de prisma ANTES de importar exam-generator
vi.mock('./prisma', () => ({
  prisma: {
    topic: {
      findMany: vi.fn(),
    },
    studyMaterial: {
      findMany: vi.fn(),
    },
  },
}))

// Mock de ai-service ANTES de importar exam-generator
vi.mock('./ai-service', () => ({
  getAIConfig: vi.fn(),
  sendAIMessage: vi.fn(),
}))

// Mock de módulos dinámicos que pueden no estar instalados
vi.mock('openai', () => ({
  default: vi.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: vi.fn(),
      },
    },
  })),
}))

vi.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: vi.fn().mockImplementation(() => ({
    getGenerativeModel: vi.fn().mockReturnValue({
      generateContent: vi.fn().mockResolvedValue({
        response: {
          text: vi.fn().mockReturnValue('Mocked response'),
        },
      }),
    }),
  })),
}))

// Importar después de los mocks
import { generateExamWithAI } from './exam-generator'
import { prisma } from './prisma'
import * as aiService from './ai-service'

describe('exam-generator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('generateExamWithAI', () => {
    const mockSubject = {
      id: 'subject-1',
      nombre: 'Matemática',
      codigo: 'MAT',
      tipo: 'obligatoria',
    }

    const mockTopics = [
      {
        id: 'topic-1',
        nombre: 'Álgebra',
        ejeTematico: 'Expresiones algebraicas',
        descripcion: 'Operaciones con expresiones algebraicas',
        subject: mockSubject,
      },
      {
        id: 'topic-2',
        nombre: 'Geometría',
        ejeTematico: 'Figuras geométricas',
        descripcion: null,
        subject: mockSubject,
      },
    ]

    const mockMaterials = [
      {
        titulo: 'Guía de Álgebra',
        contenido: 'Contenido sobre álgebra...',
        topic: {
          ejeTematico: 'Expresiones algebraicas',
        },
      },
    ]

    const mockAIResponse = {
      content: JSON.stringify({
        titulo: 'Examen de Matemática',
        descripcion: 'Examen generado con IA',
        questions: [
          {
            enunciado: '¿Cuál es el resultado de 2 + 2?',
            opciones: [
              { letra: 'A', texto: '3', esCorrecta: false },
              { letra: 'B', texto: '4', esCorrecta: true },
              { letra: 'C', texto: '5', esCorrecta: false },
              { letra: 'D', texto: '6', esCorrecta: false },
            ],
            explicacion: '2 + 2 = 4',
            dificultad: 1,
            ejeTematico: 'Expresiones algebraicas',
          },
          {
            enunciado: '¿Cuál es el área de un cuadrado de lado 5?',
            opciones: [
              { letra: 'A', texto: '20', esCorrecta: false },
              { letra: 'B', texto: '25', esCorrecta: true },
              { letra: 'C', texto: '30', esCorrecta: false },
              { letra: 'D', texto: '35', esCorrecta: false },
            ],
            explicacion: 'Área = lado² = 5² = 25',
            dificultad: 2,
            ejeTematico: 'Figuras geométricas',
          },
        ],
      }),
      service: 'anthropic' as const,
      model: 'claude-3-5-sonnet-20241022',
      tokensUsed: 1000,
    }

    const baseParams: ExamGenerationParams = {
      subjectId: 'subject-1',
      numQuestions: 2,
      difficulty: 'media',
      tipo: 'objetiva',
      userId: 'user-1',
      includeAnswerKey: true,
    }

    it('debe generar un examen exitosamente con parámetros válidos', async () => {
      // Setup mocks
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
        model: 'claude-3-5-sonnet-20241022',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(mockAIResponse)

      // Ejecutar
      const result = await generateExamWithAI(baseParams)

      // Verificar
      expect(result).toBeDefined()
      expect(result.titulo).toBe('Examen de Matemática')
      expect(result.questions).toHaveLength(2)
      expect(result.questions[0].enunciado).toBe('¿Cuál es el resultado de 2 + 2?')
      expect(result.questions[0].opciones).toHaveLength(4)
      expect(result.questions[0].opciones.find(o => o.esCorrecta)?.letra).toBe('B')
      expect(result.answerKey).toBeDefined()
      expect(result.answerKey![0]).toBe('B')
      expect(result.answerKey![1]).toBe('B')
    })

    it('debe lanzar error si no hay temas para la asignatura', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue([])
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue([])

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'No se encontraron temas para la asignatura seleccionada'
      )
    })

    it('debe lanzar error si no hay configuración de IA', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue(null)

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'No hay configuración de IA disponible'
      )
    })

    it('debe filtrar temas por topicIds cuando se proporcionan', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue([mockTopics[0]] as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(mockAIResponse)

      const params = {
        ...baseParams,
        topicIds: ['topic-1'],
      }

      await generateExamWithAI(params)

      expect(prisma.topic.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            id: { in: ['topic-1'] },
          }),
        })
      )
    })

    it('debe manejar respuestas de IA con formato inválido', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue({
        ...mockAIResponse,
        content: 'Respuesta sin JSON válido',
      })

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'La IA no generó un formato válido'
      )
    })

    it('debe corregir opciones sin respuesta correcta', async () => {
      const responseSinCorrecta = {
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen Test',
          descripcion: 'Test',
          questions: [
            {
              enunciado: 'Pregunta test',
              opciones: [
                { letra: 'A', texto: 'Opción A', esCorrecta: false },
                { letra: 'B', texto: 'Opción B', esCorrecta: false },
                { letra: 'C', texto: 'Opción C', esCorrecta: false },
                { letra: 'D', texto: 'Opción D', esCorrecta: false },
              ],
              explicacion: 'Test',
              dificultad: 1,
              ejeTematico: 'Test',
            },
          ],
        }),
      }

      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(responseSinCorrecta)

      const result = await generateExamWithAI(baseParams)

      // Debe haber marcado la primera opción como correcta
      expect(result.questions[0].opciones[0].esCorrecta).toBe(true)
      expect(result.questions[0].opciones.filter(o => o.esCorrecta)).toHaveLength(1)
    })

    it('debe manejar preguntas de desarrollo (sin opciones)', async () => {
      const responseDesarrollo = {
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen de Desarrollo',
          descripcion: 'Test',
          questions: [
            {
              enunciado: 'Explica el teorema de Pitágoras',
              opciones: [],
              explicacion: 'El teorema establece que...',
              dificultad: 3,
              ejeTematico: 'Geometría',
            },
          ],
        }),
      }

      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(responseDesarrollo)

      const params = {
        ...baseParams,
        tipo: 'desarrollo' as const,
      }

      const result = await generateExamWithAI(params)

      expect(result.questions[0].opciones).toHaveLength(0)
      // No debe haber answerKey para preguntas de desarrollo
      expect(result.answerKey).toBeUndefined()
    })

    it('debe asociar temas automáticamente cuando no están especificados', async () => {
      const responseSinTopic = {
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen Test',
          descripcion: 'Test',
          questions: [
            {
              enunciado: 'Pregunta test',
              opciones: [
                { letra: 'A', texto: 'A', esCorrecta: false },
                { letra: 'B', texto: 'B', esCorrecta: true },
                { letra: 'C', texto: 'C', esCorrecta: false },
                { letra: 'D', texto: 'D', esCorrecta: false },
              ],
              explicacion: 'Test',
              dificultad: 1,
              ejeTematico: 'Expresiones algebraicas', // Coincide con topic-1
            },
          ],
        }),
      }

      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(responseSinTopic)

      const result = await generateExamWithAI(baseParams)

      expect(result.questions[0].topicId).toBe('topic-1')
      expect(result.questions[0].ejeTematico).toBe('Expresiones algebraicas')
    })

    it('debe generar clavijero solo para preguntas objetivas', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(mockAIResponse)

      const params = {
        ...baseParams,
        includeAnswerKey: true,
        tipo: 'objetiva' as const,
      }

      const result = await generateExamWithAI(params)

      expect(result.answerKey).toBeDefined()
      expect(Object.keys(result.answerKey!)).toHaveLength(2)
    })

    it('debe manejar exámenes mixtos correctamente', async () => {
      const responseMixto = {
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen Mixto',
          descripcion: 'Test',
          questions: [
            {
              enunciado: 'Pregunta objetiva',
              opciones: [
                { letra: 'A', texto: 'A', esCorrecta: false },
                { letra: 'B', texto: 'B', esCorrecta: true },
                { letra: 'C', texto: 'C', esCorrecta: false },
                { letra: 'D', texto: 'D', esCorrecta: false },
              ],
              explicacion: 'Test',
              dificultad: 1,
              ejeTematico: 'Test',
            },
            {
              enunciado: 'Pregunta de desarrollo',
              opciones: [],
              explicacion: 'Test',
              dificultad: 2,
              ejeTematico: 'Test',
            },
          ],
        }),
      }

      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(responseMixto)

      const params = {
        ...baseParams,
        tipo: 'mixta' as const,
      }

      const result = await generateExamWithAI(params)

      expect(result.questions[0].opciones.length).toBeGreaterThan(0) // Objetiva
      expect(result.questions[1].opciones.length).toBe(0) // Desarrollo
      // Clavijero solo para la pregunta objetiva
      expect(result.answerKey).toBeDefined()
      expect(result.answerKey![0]).toBeDefined()
      expect(result.answerKey![1]).toBeUndefined()
    })

    // Tests para funciones refactorizadas (validadas indirectamente)
    it('debe validar que existe la asignatura (validateTopicContext)', async () => {
      // Simular que no se encuentra la asignatura
      vi.mocked(prisma.topic.findMany).mockResolvedValue([])
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue([])

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'No se encontraron temas para la asignatura'
      )
    })

    it('debe validar que hay temas disponibles (validateTopicContext)', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue([])
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue([])

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'No se encontraron temas para la asignatura'
      )
    })

    it('debe validar que existe configuración de IA (validateAndGetAIConfig)', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue(null)

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'No hay configuración de IA disponible'
      )
    })

    it('debe validar estructura del examen (validateExamStructure)', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })

      // Simular respuesta sin preguntas
      vi.mocked(aiService.sendAIMessage).mockResolvedValue({
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen sin preguntas',
          descripcion: 'Test',
          questions: [],
        }),
      })

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'El examen generado no contiene preguntas'
      )
    })

    it('debe validar que el examen tiene array de preguntas (validateExamStructure)', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })

      // Simular respuesta sin array de preguntas
      vi.mocked(aiService.sendAIMessage).mockResolvedValue({
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen inválido',
          descripcion: 'Test',
          // Sin questions
        }),
      })

      await expect(generateExamWithAI(baseParams)).rejects.toThrow(
        'El examen generado no tiene preguntas válidas'
      )
    })

    it('debe procesar examen correctamente (processGeneratedExam)', async () => {
      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(mockAIResponse)

      const result = await generateExamWithAI(baseParams)

      // Verificar que el examen fue procesado correctamente
      expect(result.titulo).toBe('Examen de Matemática')
      expect(result.questions).toHaveLength(2)
      expect(result.answerKey).toBeDefined()
      expect(result.questions[0].opciones).toHaveLength(4)
      expect(result.questions[0].opciones.find(o => o.esCorrecta)).toBeDefined()
    })

    it('debe asociar temas automáticamente en processGeneratedExam', async () => {
      const responseSinTopic = {
        ...mockAIResponse,
        content: JSON.stringify({
          titulo: 'Examen Test',
          descripcion: 'Test',
          questions: [
            {
              enunciado: 'Pregunta test',
              opciones: [
                { letra: 'A', texto: 'A', esCorrecta: false },
                { letra: 'B', texto: 'B', esCorrecta: true },
                { letra: 'C', texto: 'C', esCorrecta: false },
                { letra: 'D', texto: 'D', esCorrecta: false },
              ],
              explicacion: 'Test',
              dificultad: 1,
              ejeTematico: 'Expresiones algebraicas', // Coincide con topic-1
            },
          ],
        }),
      }

      vi.mocked(prisma.topic.findMany).mockResolvedValue(mockTopics as any)
      vi.mocked(prisma.studyMaterial.findMany).mockResolvedValue(mockMaterials as any)
      vi.mocked(aiService.getAIConfig).mockResolvedValue({
        service: 'anthropic',
        apiKey: 'test-key',
      })
      vi.mocked(aiService.sendAIMessage).mockResolvedValue(responseSinTopic)

      const result = await generateExamWithAI(baseParams)

      expect(result.questions[0].topicId).toBe('topic-1')
      expect(result.questions[0].ejeTematico).toBe('Expresiones algebraicas')
    })
  })
})
