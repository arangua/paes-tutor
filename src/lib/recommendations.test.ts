/**
 * Tests Enterprise para Sistema de Recomendaciones Inteligentes
 * 
 * Cobertura completa del algoritmo de recomendaciones personalizadas
 */

import { describe, it, expect } from 'vitest'
import {
  analyzeTopicRecommendations,
  analyzeExamRecommendations,
  generateStudyPlan,
  generateRecommendations,
  type PerformanceMetric,
  type TopicRecommendation,
  type Exam,
} from './recommendations'

describe('analyzeTopicRecommendations', () => {
  it('debe identificar temas débiles con alta prioridad (<30%)', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Álgebra',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 25,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].priority).toBe('high')
    expect(resultado[0].currentPercentage).toBe(25)
    expect(resultado[0].reason).toContain('Rendimiento muy bajo')
  })

  it('debe identificar temas débiles con prioridad media (30-50%)', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Geometría',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 40,
        totalPreguntas: 5,
        correctas: 2,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].priority).toBe('medium')
    expect(resultado[0].currentPercentage).toBe(40)
    expect(resultado[0].reason).toContain('Rendimiento bajo')
  })

  it('debe identificar temas medios (50-70%)', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Trigonometría',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 60,
        totalPreguntas: 5,
        correctas: 3,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].priority).toBe('medium')
    expect(resultado[0].currentPercentage).toBe(60)
    expect(resultado[0].reason).toContain('Rendimiento medio')
  })

  it('debe ignorar temas con pocas preguntas (<3)', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Álgebra',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 20, // Muy bajo, pero solo 2 preguntas
        totalPreguntas: 2,
        correctas: 0,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(0)
  })

  it('debe ignorar temas fuertes (>=70%)', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Álgebra',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 80,
        totalPreguntas: 5,
        correctas: 4,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(0)
  })

  it('debe ordenar por prioridad y luego por porcentaje', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Tema Medio',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 60,
        totalPreguntas: 5,
        correctas: 3,
        nivel: null,
      },
      {
        topicId: 't2',
        topicName: 'Tema Débil Alto',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 20,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
      {
        topicId: 't3',
        topicName: 'Tema Débil Medio',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 40,
        totalPreguntas: 5,
        correctas: 2,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(3)
    // Primero debe estar el tema con alta prioridad (20%)
    expect(resultado[0].priority).toBe('high')
    expect(resultado[0].currentPercentage).toBe(20)
    // Luego el tema débil con prioridad media (40%)
    expect(resultado[1].priority).toBe('medium')
    expect(resultado[1].currentPercentage).toBe(40)
    // Finalmente el tema medio (60%)
    expect(resultado[2].priority).toBe('medium')
    expect(resultado[2].currentPercentage).toBe(60)
  })

  it('debe manejar métricas vacías', () => {
    const resultado = analyzeTopicRecommendations([])
    expect(resultado).toHaveLength(0)
  })

  it('debe incluir acciones sugeridas para temas débiles', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Álgebra',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 25,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado[0].suggestedActions).toHaveLength(4)
    expect(resultado[0].suggestedActions).toContain('Revisa los conceptos fundamentales')
    expect(resultado[0].suggestedActions).toContain('Practica con ejercicios específicos')
  })

  it('debe incluir acciones sugeridas para temas medios', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Geometría',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 60,
        totalPreguntas: 5,
        correctas: 3,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado[0].suggestedActions).toHaveLength(3)
    expect(resultado[0].suggestedActions).toContain('Practica ejercicios adicionales')
    expect(resultado[0].suggestedActions).toContain('Revisa los errores comunes')
  })

  it('debe manejar el límite exacto de 30%', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Álgebra',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 30,
        totalPreguntas: 5,
        correctas: 1.5,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].priority).toBe('medium') // 30% es medium, no high
  })

  it('debe manejar el límite exacto de 50%', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Geometría',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 50,
        totalPreguntas: 5,
        correctas: 2.5,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].priority).toBe('medium')
  })

  it('debe manejar el límite exacto de 70%', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Trigonometría',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 70,
        totalPreguntas: 5,
        correctas: 3.5,
        nivel: null,
      },
    ]

    const resultado = analyzeTopicRecommendations(metrics)

    // 70% es fuerte, no debe incluirse
    expect(resultado).toHaveLength(0)
  })
})

describe('analyzeExamRecommendations', () => {
  const weakTopics: TopicRecommendation[] = [
    {
      topicId: 't1',
      topicName: 'Álgebra',
      subjectName: 'Matemática',
      subjectCode: 'MAT',
      currentPercentage: 25,
      priority: 'high',
      reason: 'Rendimiento muy bajo',
      suggestedActions: [],
    },
    {
      topicId: 't2',
      topicName: 'Geometría',
      subjectName: 'Matemática',
      subjectCode: 'MAT',
      currentPercentage: 40,
      priority: 'medium',
      reason: 'Rendimiento bajo',
      suggestedActions: [],
    },
  ]

  it('debe recomendar exámenes que incluyen temas débiles', () => {
    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: 't1',
            },
          },
          {
            question: {
              topicId: 't2',
            },
          },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(weakTopics, availableExams)

    expect(resultado).toHaveLength(1)
    expect(resultado[0].examId).toBe('e1')
    expect(resultado[0].focusTopics).toContain('Álgebra')
    expect(resultado[0].focusTopics).toContain('Geometría')
  })

  it('debe asignar prioridad alta si hay temas de alta prioridad', () => {
    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: 't1', // Alta prioridad
            },
          },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(weakTopics, availableExams)

    expect(resultado[0].priority).toBe('high')
  })

  it('debe asignar prioridad media si solo hay temas de prioridad media', () => {
    const mediumTopics: TopicRecommendation[] = [
      {
        topicId: 't2',
        topicName: 'Geometría',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 40,
        priority: 'medium',
        reason: 'Rendimiento bajo',
        suggestedActions: [],
      },
    ]

    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: 't2',
            },
          },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(mediumTopics, availableExams)

    expect(resultado[0].priority).toBe('medium')
  })

  it('debe filtrar exámenes por asignatura', () => {
    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: 't1',
            },
          },
        ],
      },
      {
        id: 'e2',
        titulo: 'Examen de Lenguaje',
        subjectId: 's2',
        subject: {
          nombre: 'Lenguaje',
          codigo: 'LEN',
        },
        questions: [
          {
            question: {
              topicId: 't3',
            },
          },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(weakTopics, availableExams)

    // Solo debe recomendar el examen de Matemática
    expect(resultado).toHaveLength(1)
    expect(resultado[0].examId).toBe('e1')
    expect(resultado[0].subjectCode).toBe('MAT')
  })

  it('debe manejar exámenes sin temas relevantes', () => {
    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: 't999', // Tema que no está en weakTopics
            },
          },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(weakTopics, availableExams)

    expect(resultado).toHaveLength(0)
  })

  it('debe manejar exámenes vacíos', () => {
    const resultado = analyzeExamRecommendations(weakTopics, [])
    expect(resultado).toHaveLength(0)
  })

  it('debe manejar temas débiles vacíos', () => {
    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [],
      },
    ]

    const resultado = analyzeExamRecommendations([], availableExams)
    expect(resultado).toHaveLength(0)
  })

  it('debe limitar los nombres de temas en la razón a 3', () => {
    const manyTopics: TopicRecommendation[] = [
      {
        topicId: 't1',
        topicName: 'Tema 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 25,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't2',
        topicName: 'Tema 2',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 30,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't3',
        topicName: 'Tema 3',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 35,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't4',
        topicName: 'Tema 4',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 40,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
    ]

    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          { question: { topicId: 't1' } },
          { question: { topicId: 't2' } },
          { question: { topicId: 't3' } },
          { question: { topicId: 't4' } },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(manyTopics, availableExams)

    expect(resultado[0].reason).toContain('4 tema(s)')
    // Debe incluir solo los primeros 3 nombres
    expect(resultado[0].reason.split(',').length).toBeLessThanOrEqual(4) // 3 temas + "que necesitas reforzar"
  })

  it('debe manejar preguntas con topicId null', () => {
    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: null,
            },
          },
          {
            question: {
              topicId: 't1',
            },
          },
        ],
      },
    ]

    const resultado = analyzeExamRecommendations(weakTopics, availableExams)

    // Debe ignorar preguntas con topicId null
    expect(resultado).toHaveLength(1)
    expect(resultado[0].focusTopics).toContain('Álgebra')
  })

  it('debe ordenar por prioridad', () => {
    const topics: TopicRecommendation[] = [
      {
        topicId: 't1',
        topicName: 'Tema Alta',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 25,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't2',
        topicName: 'Tema Media',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 40,
        priority: 'medium',
        reason: 'Rendimiento bajo',
        suggestedActions: [],
      },
    ]

    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen Media',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [{ question: { topicId: 't2' } }],
      },
      {
        id: 'e2',
        titulo: 'Examen Alta',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [{ question: { topicId: 't1' } }],
      },
    ]

    const resultado = analyzeExamRecommendations(topics, availableExams)

    expect(resultado).toHaveLength(2)
    // El examen con prioridad alta debe estar primero
    expect(resultado[0].priority).toBe('high')
    expect(resultado[1].priority).toBe('medium')
  })
})

describe('generateStudyPlan', () => {
  it('debe generar plan de estudio con temas de alta prioridad', () => {
    const topicRecommendations: TopicRecommendation[] = [
      {
        topicId: 't1',
        topicName: 'Tema Alta 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 25,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't2',
        topicName: 'Tema Alta 2',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 20,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
    ]

    const examRecommendations: ExamRecommendation[] = [
      {
        examId: 'e1',
        examTitle: 'Examen Alta',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        reason: 'Incluye temas débiles',
        priority: 'high',
        focusTopics: ['Tema Alta 1'],
      },
    ]

    const resultado = generateStudyPlan(topicRecommendations, examRecommendations)

    // Debe generar semana 1 (alta prioridad) y semana 3 (consolidación)
    expect(resultado.weeklyGoals.length).toBeGreaterThanOrEqual(1)
    expect(resultado.weeklyGoals[0].week).toBe(1)
    expect(resultado.weeklyGoals[0].topics).toContain('Tema Alta 1')
    expect(resultado.weeklyGoals[0].topics).toContain('Tema Alta 2')
    expect(resultado.focusAreas).toContain('Matemática')
  })

  it('debe generar plan de estudio con temas de media prioridad', () => {
    const topicRecommendations: TopicRecommendation[] = [
      {
        topicId: 't1',
        topicName: 'Tema Media 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 60,
        priority: 'medium',
        reason: 'Rendimiento medio',
        suggestedActions: [],
      },
    ]

    const examRecommendations: ExamRecommendation[] = []

    const resultado = generateStudyPlan(topicRecommendations, examRecommendations)

    // Si no hay temas de alta prioridad pero hay de media, debe generar semana 2
    expect(resultado.weeklyGoals.length).toBeGreaterThan(0)
  })

  it('debe generar múltiples semanas si hay suficientes temas', () => {
    const topicRecommendations: TopicRecommendation[] = [
      // 5 temas de alta prioridad
      {
        topicId: 't1',
        topicName: 'Tema Alta 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 25,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't2',
        topicName: 'Tema Alta 2',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 20,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't3',
        topicName: 'Tema Alta 3',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 15,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't4',
        topicName: 'Tema Alta 4',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 10,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't5',
        topicName: 'Tema Alta 5',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 5,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      // 3 temas de media prioridad
      {
        topicId: 't6',
        topicName: 'Tema Media 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 60,
        priority: 'medium',
        reason: 'Rendimiento medio',
        suggestedActions: [],
      },
      {
        topicId: 't7',
        topicName: 'Tema Media 2',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 55,
        priority: 'medium',
        reason: 'Rendimiento medio',
        suggestedActions: [],
      },
      {
        topicId: 't8',
        topicName: 'Tema Media 3',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 50,
        priority: 'medium',
        reason: 'Rendimiento medio',
        suggestedActions: [],
      },
    ]

    const examRecommendations: ExamRecommendation[] = []

    const resultado = generateStudyPlan(topicRecommendations, examRecommendations)

    // Debe generar al menos 2 semanas (semana 1 con alta prioridad, semana 2 con alta y media)
    expect(resultado.weeklyGoals.length).toBeGreaterThanOrEqual(2)
  })

  it('debe calcular fecha de finalización estimada', () => {
    const topicRecommendations: TopicRecommendation[] = [
      {
        topicId: 't1',
        topicName: 'Tema Alta 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 25,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
    ]

    const examRecommendations: ExamRecommendation[] = []

    const resultado = generateStudyPlan(topicRecommendations, examRecommendations)

    expect(resultado.estimatedCompletion).toBeDefined()
    expect(resultado.estimatedCompletion).toMatch(/\d{1,2} de \w+ de \d{4}/)
  })

  it('debe incluir áreas de enfoque únicas', () => {
    const topicRecommendations: TopicRecommendation[] = [
      {
        topicId: 't1',
        topicName: 'Tema 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 25,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't2',
        topicName: 'Tema 2',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        currentPercentage: 30,
        priority: 'high',
        reason: 'Rendimiento muy bajo',
        suggestedActions: [],
      },
      {
        topicId: 't3',
        topicName: 'Tema 3',
        subjectName: 'Lenguaje',
        subjectCode: 'LEN',
        currentPercentage: 40,
        priority: 'medium',
        reason: 'Rendimiento bajo',
        suggestedActions: [],
      },
    ]

    const examRecommendations: ExamRecommendation[] = []

    const resultado = generateStudyPlan(topicRecommendations, examRecommendations)

    expect(resultado.focusAreas).toContain('Matemática')
    expect(resultado.focusAreas).toContain('Lenguaje')
    expect(resultado.focusAreas.length).toBe(2) // Sin duplicados
  })

  it('debe manejar recomendaciones vacías', () => {
    const resultado = generateStudyPlan([], [])

    expect(resultado.weeklyGoals).toHaveLength(0)
    expect(resultado.focusAreas).toHaveLength(0)
    expect(resultado.estimatedCompletion).toBeDefined()
  })

  it('debe limitar temas por semana según el plan', () => {
    const topicRecommendations: TopicRecommendation[] = Array.from({ length: 10 }, (_, i) => ({
      topicId: `t${i}`,
      topicName: `Tema Alta ${i}`,
      subjectName: 'Matemática',
      subjectCode: 'MAT',
      currentPercentage: 25,
      priority: 'high' as const,
      reason: 'Rendimiento muy bajo',
      suggestedActions: [],
    }))

    const examRecommendations: ExamRecommendation[] = []

    const resultado = generateStudyPlan(topicRecommendations, examRecommendations)

    // Semana 1 debe tener máximo 3 temas
    expect(resultado.weeklyGoals[0].topics.length).toBeLessThanOrEqual(3)
  })
})

describe('generateRecommendations', () => {
  it('debe generar recomendaciones completas', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Álgebra',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 25,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
    ]

    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen de Matemática',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          {
            question: {
              topicId: 't1',
            },
          },
        ],
      },
    ]

    const resultado = generateRecommendations(metrics, availableExams)

    expect(resultado.topics).toHaveLength(1)
    expect(resultado.exams).toHaveLength(1)
    expect(resultado.studyPlan).not.toBeNull()
    expect(resultado.summary.totalRecommendations).toBe(2)
    expect(resultado.summary.highPriority).toBeGreaterThan(0)
    expect(resultado.summary.estimatedStudyTime).toBeDefined()
  })

  it('debe calcular tiempo estimado de estudio correctamente', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Tema Alta',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 25,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
      {
        topicId: 't2',
        topicName: 'Tema Media',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 60,
        totalPreguntas: 5,
        correctas: 3,
        nivel: null,
      },
    ]

    const availableExams: Exam[] = []

    const resultado = generateRecommendations(metrics, availableExams)

    // 1 tema alta (1.5h) + 1 tema media (0.75h) = 2.25h = 3 horas (redondeado)
    expect(resultado.summary.estimatedStudyTime).toContain('horas')
    expect(parseInt(resultado.summary.estimatedStudyTime)).toBeGreaterThanOrEqual(2)
  })

  it('debe mostrar minutos si el tiempo es menor a 1 hora', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Tema Media',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 60,
        totalPreguntas: 5,
        correctas: 3,
        nivel: null,
      },
    ]

    const availableExams: Exam[] = []

    const resultado = generateRecommendations(metrics, availableExams)

    // 1 tema media (0.75h) = 45 minutos
    expect(resultado.summary.estimatedStudyTime).toContain('minutos')
  })

  it('debe retornar studyPlan null si no hay recomendaciones de temas', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Tema Fuerte',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 80,
        totalPreguntas: 5,
        correctas: 4,
        nivel: null,
      },
    ]

    const availableExams: Exam[] = []

    const resultado = generateRecommendations(metrics, availableExams)

    expect(resultado.topics).toHaveLength(0)
    expect(resultado.studyPlan).toBeNull()
  })

  it('debe contar correctamente las recomendaciones de alta prioridad', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Tema Alta 1',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 25,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
      {
        topicId: 't2',
        topicName: 'Tema Alta 2',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 20,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
    ]

    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen Alta',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [{ question: { topicId: 't1' } }],
      },
    ]

    const resultado = generateRecommendations(metrics, availableExams)

    // 2 temas alta + 1 examen alta = 3 alta prioridad
    expect(resultado.summary.highPriority).toBe(3)
  })

  it('debe manejar métricas vacías', () => {
    const resultado = generateRecommendations([], [])

    expect(resultado.topics).toHaveLength(0)
    expect(resultado.exams).toHaveLength(0)
    expect(resultado.studyPlan).toBeNull()
    expect(resultado.summary.totalRecommendations).toBe(0)
    expect(resultado.summary.highPriority).toBe(0)
  })

  it('debe filtrar solo temas débiles para recomendaciones de exámenes', () => {
    const metrics: PerformanceMetric[] = [
      {
        topicId: 't1',
        topicName: 'Tema Alta',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 25,
        totalPreguntas: 5,
        correctas: 1,
        nivel: null,
      },
      {
        topicId: 't2',
        topicName: 'Tema Media',
        subjectName: 'Matemática',
        subjectCode: 'MAT',
        porcentaje: 60,
        totalPreguntas: 5,
        correctas: 3,
        nivel: null,
      },
    ]

    const availableExams: Exam[] = [
      {
        id: 'e1',
        titulo: 'Examen',
        subjectId: 's1',
        subject: {
          nombre: 'Matemática',
          codigo: 'MAT',
        },
        questions: [
          { question: { topicId: 't1' } },
          { question: { topicId: 't2' } },
        ],
      },
    ]

    const resultado = generateRecommendations(metrics, availableExams)

    // Solo debe incluir t1 (alta) y t2 (media) en weakTopics
    // Ambos deben estar en el examen recomendado
    expect(resultado.exams.length).toBeGreaterThan(0)
    if (resultado.exams.length > 0) {
      expect(resultado.exams[0].focusTopics.length).toBeGreaterThan(0)
    }
  })
})

