/**
 * Sistema de Recomendaciones Inteligentes
 *
 * Analiza el rendimiento del estudiante y genera recomendaciones personalizadas
 * basadas en debilidades, fortalezas y patrones de rendimiento.
 */

export interface TopicRecommendation {
  topicId: string
  topicName: string
  subjectName: string
  subjectCode: string
  currentPercentage: number
  priority: 'high' | 'medium' | 'low'
  reason: string
  suggestedActions: string[]
}

export interface ExamRecommendation {
  examId: string
  examTitle: string
  subjectName: string
  subjectCode: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  focusTopics: string[]
}

export interface StudyPlan {
  weeklyGoals: Array<{
    week: number
    topics: string[]
    exams: string[]
    description: string
  }>
  estimatedCompletion: string
  focusAreas: string[]
}

export interface Recommendations {
  topics: TopicRecommendation[]
  exams: ExamRecommendation[]
  studyPlan: StudyPlan | null
  summary: {
    totalRecommendations: number
    highPriority: number
    estimatedStudyTime: string
  }
}

export interface PerformanceMetric {
  topicId: string
  topicName: string
  subjectName: string
  subjectCode: string
  porcentaje: number
  totalPreguntas: number
  correctas: number
  nivel: string | null
}

interface Exam {
  id: string
  titulo: string
  subjectId: string
  subject: {
    nombre: string
    codigo: string
  }
  questions: Array<{
    question: {
      topicId: string | null
    }
  }>
}

/**
 * Analiza métricas y genera recomendaciones de temas
 */
export function analyzeTopicRecommendations(metrics: PerformanceMetric[]): TopicRecommendation[] {
  const recommendations: TopicRecommendation[] = []

  // Clasificar temas por rendimiento
  const weakTopics = metrics.filter(m => m.porcentaje < 50 && m.totalPreguntas >= 3)
  const mediumTopics = metrics.filter(
    m => m.porcentaje >= 50 && m.porcentaje < 70 && m.totalPreguntas >= 3
  )
  const strongTopics = metrics.filter(m => m.porcentaje >= 70)

  // Temas débiles (alta prioridad)
  weakTopics.forEach(topic => {
    const priority: 'high' | 'medium' | 'low' = topic.porcentaje < 30 ? 'high' : 'medium'

    recommendations.push({
      topicId: topic.topicId,
      topicName: topic.topicName,
      subjectName: topic.subjectName,
      subjectCode: topic.subjectCode,
      currentPercentage: topic.porcentaje,
      priority,
      reason:
        topic.porcentaje < 30
          ? `Rendimiento muy bajo (${topic.porcentaje.toFixed(1)}%). Necesitas reforzar este tema urgentemente.`
          : `Rendimiento bajo (${topic.porcentaje.toFixed(1)}%). Deberías estudiar más este tema.`,
      suggestedActions: [
        'Revisa los conceptos fundamentales',
        'Practica con ejercicios específicos',
        'Estudia materiales de apoyo',
        'Realiza un examen enfocado en este tema',
      ],
    })
  })

  // Temas medios (prioridad media)
  mediumTopics.forEach(topic => {
    recommendations.push({
      topicId: topic.topicId,
      topicName: topic.topicName,
      subjectName: topic.subjectName,
      subjectCode: topic.subjectCode,
      currentPercentage: topic.porcentaje,
      priority: 'medium',
      reason: `Rendimiento medio (${topic.porcentaje.toFixed(1)}%). Con un poco más de práctica podrías mejorar significativamente.`,
      suggestedActions: [
        'Practica ejercicios adicionales',
        'Revisa los errores comunes',
        'Realiza un examen de práctica',
      ],
    })
  })

  // Ordenar por prioridad y porcentaje
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    }
    return a.currentPercentage - b.currentPercentage
  })
}

/**
 * Analiza exámenes disponibles y recomienda basado en debilidades
 */
export function analyzeExamRecommendations(
  weakTopics: TopicRecommendation[],
  availableExams: Exam[]
): ExamRecommendation[] {
  const recommendations: ExamRecommendation[] = []

  // Agrupar temas débiles por asignatura
  const weakTopicsBySubject = new Map<string, TopicRecommendation[]>()
  weakTopics.forEach(topic => {
    if (!weakTopicsBySubject.has(topic.subjectCode)) {
      weakTopicsBySubject.set(topic.subjectCode, [])
    }
    weakTopicsBySubject.get(topic.subjectCode)!.push(topic)
  })

  // Para cada asignatura con temas débiles, buscar exámenes relevantes
  weakTopicsBySubject.forEach((topics, subjectCode) => {
    const relevantExams = availableExams.filter(exam => exam.subject.codigo === subjectCode)

    relevantExams.forEach(exam => {
      // Contar cuántos temas débiles están en este examen
      const examTopicIds = new Set(
        exam.questions.map(q => q.question.topicId).filter((id): id is string => id !== null)
      )

      const matchingTopics = topics.filter(t => examTopicIds.has(t.topicId))

      if (matchingTopics.length > 0) {
        const priority: 'high' | 'medium' | 'low' = matchingTopics.some(t => t.priority === 'high')
          ? 'high'
          : 'medium'

        recommendations.push({
          examId: exam.id,
          examTitle: exam.titulo,
          subjectName: exam.subject.nombre,
          subjectCode: exam.subject.codigo,
          reason: `Este examen incluye ${matchingTopics.length} tema(s) que necesitas reforzar: ${matchingTopics
            .slice(0, 3)
            .map(t => t.topicName)
            .join(', ')}`,
          priority,
          focusTopics: matchingTopics.map(t => t.topicName),
        })
      }
    })
  })

  // Ordenar por prioridad
  return recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}

/**
 * Genera un plan de estudio personalizado
 */
export function generateStudyPlan(
  topicRecommendations: TopicRecommendation[],
  examRecommendations: ExamRecommendation[]
): StudyPlan {
  const highPriorityTopics = topicRecommendations.filter(t => t.priority === 'high')
  const mediumPriorityTopics = topicRecommendations.filter(t => t.priority === 'medium')

  const weeks: StudyPlan['weeklyGoals'] = []

  // Semana 1-2: Enfocarse en temas de alta prioridad
  if (highPriorityTopics.length > 0) {
    weeks.push({
      week: 1,
      topics: highPriorityTopics.slice(0, 3).map(t => t.topicName),
      exams: examRecommendations
        .filter(e => e.priority === 'high')
        .slice(0, 2)
        .map(e => e.examTitle),
      description:
        'Enfócate en los temas más críticos. Dedica tiempo extra a estudiar estos conceptos fundamentales.',
    })
  }

  // Semana 3-4: Continuar con alta prioridad y empezar con media
  if (highPriorityTopics.length > 3 || mediumPriorityTopics.length > 0) {
    weeks.push({
      week: 2,
      topics: [
        ...highPriorityTopics.slice(3, 5).map(t => t.topicName),
        ...mediumPriorityTopics.slice(0, 2).map(t => t.topicName),
      ],
      exams: examRecommendations
        .filter(e => e.priority === 'medium')
        .slice(0, 2)
        .map(e => e.examTitle),
      description: 'Continúa reforzando temas débiles y comienza a trabajar en áreas de mejora.',
    })
  }

  // Semana 5-6: Consolidación
  if (weeks.length > 0) {
    weeks.push({
      week: 3,
      topics: mediumPriorityTopics.slice(2, 5).map(t => t.topicName),
      exams: examRecommendations.slice(0, 3).map(e => e.examTitle),
      description:
        'Consolida tu aprendizaje realizando exámenes completos y revisando todos los temas estudiados.',
    })
  }

  const estimatedWeeks = Math.max(weeks.length, 2)
  const estimatedCompletion = new Date()
  estimatedCompletion.setDate(estimatedCompletion.getDate() + estimatedWeeks * 7)

  return {
    weeklyGoals: weeks,
    estimatedCompletion: estimatedCompletion.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    focusAreas: Array.from(new Set(topicRecommendations.map(t => t.subjectName))),
  }
}

/**
 * Genera recomendaciones completas
 */
export function generateRecommendations(
  metrics: PerformanceMetric[],
  availableExams: Exam[]
): Recommendations {
  const topicRecommendations = analyzeTopicRecommendations(metrics)
  const weakTopics = topicRecommendations.filter(
    t => t.priority === 'high' || t.priority === 'medium'
  )
  const examRecommendations = analyzeExamRecommendations(weakTopics, availableExams)
  const studyPlan =
    topicRecommendations.length > 0
      ? generateStudyPlan(topicRecommendations, examRecommendations)
      : null

  const highPriorityCount =
    topicRecommendations.filter(t => t.priority === 'high').length +
    examRecommendations.filter(e => e.priority === 'high').length

  // Estimar tiempo de estudio (1-2 horas por tema de alta prioridad, 30min-1h por tema medio)
  const estimatedHours =
    topicRecommendations.filter(t => t.priority === 'high').length * 1.5 +
    topicRecommendations.filter(t => t.priority === 'medium').length * 0.75

  return {
    topics: topicRecommendations,
    exams: examRecommendations,
    studyPlan,
    summary: {
      totalRecommendations: topicRecommendations.length + examRecommendations.length,
      highPriority: highPriorityCount,
      estimatedStudyTime:
        estimatedHours >= 1
          ? `${Math.ceil(estimatedHours)} horas`
          : `${Math.ceil(estimatedHours * 60)} minutos`,
    },
  }
}
