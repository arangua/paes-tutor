/**
 * Librería de Análisis Avanzado
 *
 * Funciones para análisis profundo del rendimiento del estudiante,
 * incluyendo tendencias, predicciones y comparaciones.
 */

export interface TrendData {
  date: string
  percentage: number
  examTitle: string
  subjectName: string
}

export interface StrengthWeakness {
  topic: string
  subject: string
  percentage: number
  totalQuestions: number
  category: 'strength' | 'weakness' | 'average'
}

export interface PAESPrediction {
  predictedScore: number
  confidence: 'high' | 'medium' | 'low'
  factors: string[]
  estimatedRange: {
    min: number
    max: number
  }
}

export interface ComparisonData {
  studentAverage: number
  overallAverage: number
  percentile: number
  comparison: 'above' | 'below' | 'equal'
}

export interface AdvancedAnalytics {
  trends: TrendData[]
  strengths: StrengthWeakness[]
  weaknesses: StrengthWeakness[]
  paesPrediction: PAESPrediction | null
  comparison: ComparisonData | null
  subjectBreakdown: Array<{
    subject: string
    average: number
    trend: 'improving' | 'declining' | 'stable'
    attempts: number
  }>
}

interface Attempt {
  id: string
  porcentaje: number
  createdAt: string
  exam: {
    titulo: string
    subject: {
      nombre: string
      codigo: string
    }
  }
}

interface Metric {
  topicId: string
  topicName: string
  subjectName: string
  porcentaje: number
  totalPreguntas: number
  correctas: number
}

/**
 * Analiza tendencias a largo plazo
 */
export function analyzeTrends(attempts: Attempt[]): TrendData[] {
  // Ordenar por fecha
  const sortedAttempts = [...attempts]
    .filter(a => a.porcentaje !== null && a.porcentaje !== undefined)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return sortedAttempts.map(attempt => ({
    date: new Date(attempt.createdAt).toISOString().split('T')[0],
    percentage: attempt.porcentaje,
    examTitle: attempt.exam.titulo,
    subjectName: attempt.exam.subject.nombre,
  }))
}

/**
 * Identifica fortalezas y debilidades
 */
export function analyzeStrengthsWeaknesses(metrics: Metric[]): {
  strengths: StrengthWeakness[]
  weaknesses: StrengthWeakness[]
} {
  const strengths: StrengthWeakness[] = []
  const weaknesses: StrengthWeakness[] = []

  metrics.forEach(metric => {
    if (metric.totalPreguntas < 3) return // Ignorar temas con pocas preguntas

    const item: StrengthWeakness = {
      topic: metric.topicName,
      subject: metric.subjectName,
      percentage: metric.porcentaje,
      totalQuestions: metric.totalPreguntas,
      category:
        metric.porcentaje >= 70 ? 'strength' : metric.porcentaje < 50 ? 'weakness' : 'average',
    }

    if (item.category === 'strength') {
      strengths.push(item)
    } else if (item.category === 'weakness') {
      weaknesses.push(item)
    }
  })

  // Ordenar: fortalezas por porcentaje descendente, debilidades por porcentaje ascendente
  strengths.sort((a, b) => b.percentage - a.percentage)
  weaknesses.sort((a, b) => a.percentage - b.percentage)

  return { strengths, weaknesses }
}

/**
 * Predice puntaje PAES basado en rendimiento histórico
 */
export function predictPAESScore(attempts: Attempt[]): PAESPrediction | null {
  if (attempts.length < 3) {
    return null // Necesita al menos 3 intentos para predecir
  }

  // Filtrar intentos completados con puntaje PAES
  const validAttempts = attempts.filter(
    a => a.porcentaje !== null && a.porcentaje !== undefined && a.porcentaje > 0
  )

  if (validAttempts.length < 3) {
    return null
  }

  // Calcular promedio de los últimos intentos (últimos 5 o todos si son menos)
  const recentAttempts = validAttempts.slice(-5)
  const averagePercentage =
    recentAttempts.reduce((sum, a) => sum + a.porcentaje, 0) / recentAttempts.length

  // Calcular tendencia (mejora o declive)
  const firstHalf = recentAttempts.slice(0, Math.floor(recentAttempts.length / 2))
  const secondHalf = recentAttempts.slice(Math.floor(recentAttempts.length / 2))

  // Validación defensiva: asegurar que ambas mitades tengan al menos un elemento
  let trend = 0
  if (firstHalf.length > 0 && secondHalf.length > 0) {
    const firstAvg = firstHalf.reduce((sum, a) => sum + a.porcentaje, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, a) => sum + a.porcentaje, 0) / secondHalf.length
    trend = secondAvg - firstAvg
  }

  // Estimar puntaje PAES (rango típico: 150-850)
  // Asumiendo que 100% = 850 puntos y 0% = 150 puntos
  const baseScore = 150
  const maxScore = 850
  const scoreRange = maxScore - baseScore

  const predictedScore = baseScore + (averagePercentage / 100) * scoreRange

  // Ajustar según tendencia
  const trendAdjustment = (trend / 100) * scoreRange * 0.3 // Factor de ajuste conservador
  const adjustedScore = predictedScore + trendAdjustment

  // Calcular rango de confianza
  const variance =
    recentAttempts.reduce((sum, a) => {
      const diff = a.porcentaje - averagePercentage
      return sum + diff * diff
    }, 0) / recentAttempts.length

  const stdDev = Math.sqrt(variance)
  const margin = (stdDev / 100) * scoreRange

  // Determinar confianza
  let confidence: 'high' | 'medium' | 'low'
  if (stdDev < 5) {
    confidence = 'high'
  } else if (stdDev < 15) {
    confidence = 'medium'
  } else {
    confidence = 'low'
  }

  // Factores que influyen
  const factors: string[] = []
  if (trend > 5) {
    factors.push('Tendencia de mejora')
  } else if (trend < -5) {
    factors.push('Tendencia de declive')
  }
  if (recentAttempts.length >= 5) {
    factors.push('Múltiples intentos recientes')
  }
  if (stdDev < 10) {
    factors.push('Rendimiento consistente')
  } else {
    factors.push('Rendimiento variable')
  }

  return {
    predictedScore: Math.round(Math.max(150, Math.min(850, adjustedScore))),
    confidence,
    factors,
    estimatedRange: {
      min: Math.round(Math.max(150, adjustedScore - margin)),
      max: Math.round(Math.min(850, adjustedScore + margin)),
    },
  }
}

/**
 * Compara con promedio general (simulado)
 */
export function compareWithAverage(studentAverage: number): ComparisonData {
  // En una implementación real, esto vendría de la base de datos
  // Por ahora, simulamos un promedio general de 60%
  const overallAverage = 60

  const difference = studentAverage - overallAverage
  const comparison: 'above' | 'below' | 'equal' =
    difference > 5 ? 'above' : difference < -5 ? 'below' : 'equal'

  // Calcular percentil aproximado (simulado)
  // En producción, esto se calcularía con datos reales
  let percentile = 50
  if (studentAverage >= 80) percentile = 90
  else if (studentAverage >= 70) percentile = 75
  else if (studentAverage >= 60) percentile = 50
  else if (studentAverage >= 50) percentile = 30
  else percentile = 15

  return {
    studentAverage,
    overallAverage,
    percentile,
    comparison,
  }
}

/**
 * Analiza rendimiento por asignatura
 */
export function analyzeSubjectBreakdown(attempts: Attempt[]): Array<{
  subject: string
  average: number
  trend: 'improving' | 'declining' | 'stable'
  attempts: number
}> {
  // Agrupar por asignatura
  const bySubject = new Map<string, Attempt[]>()

  attempts.forEach(attempt => {
    const subjectCode = attempt.exam.subject.codigo
    if (!bySubject.has(subjectCode)) {
      bySubject.set(subjectCode, [])
    }
    bySubject.get(subjectCode)!.push(attempt)
  })

  const breakdown: Array<{
    subject: string
    average: number
    trend: 'improving' | 'declining' | 'stable'
    attempts: number
  }> = []

  bySubject.forEach((subjectAttempts, subjectCode) => {
    if (subjectAttempts.length < 2) return // Necesita al menos 2 intentos

    const sorted = subjectAttempts.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    const average = sorted.reduce((sum, a) => sum + a.porcentaje, 0) / sorted.length

    // Calcular tendencia
    const firstHalf = sorted.slice(0, Math.floor(sorted.length / 2))
    const secondHalf = sorted.slice(Math.floor(sorted.length / 2))

    // Validación defensiva: asegurar que ambas mitades tengan al menos un elemento
    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = firstHalf.reduce((sum, a) => sum + a.porcentaje, 0) / firstHalf.length
      const secondAvg = secondHalf.reduce((sum, a) => sum + a.porcentaje, 0) / secondHalf.length

      const trendDiff = secondAvg - firstAvg
      trend = trendDiff > 3 ? 'improving' : trendDiff < -3 ? 'declining' : 'stable'
    }

    breakdown.push({
      subject: sorted[0].exam.subject.nombre,
      average: Math.round(average * 10) / 10,
      trend,
      attempts: sorted.length,
    })
  })

  return breakdown.sort((a, b) => b.average - a.average)
}

/**
 * Genera análisis avanzado completo
 */
export function generateAdvancedAnalytics(
  attempts: Attempt[],
  metrics: Metric[]
): AdvancedAnalytics {
  const trends = analyzeTrends(attempts)
  const { strengths, weaknesses } = analyzeStrengthsWeaknesses(metrics)
  const paesPrediction = predictPAESScore(attempts)

  const studentAverage =
    attempts.length > 0 ? attempts.reduce((sum, a) => sum + a.porcentaje, 0) / attempts.length : 0

  const comparison = attempts.length > 0 ? compareWithAverage(studentAverage) : null
  const subjectBreakdown = analyzeSubjectBreakdown(attempts)

  return {
    trends,
    strengths,
    weaknesses,
    paesPrediction,
    comparison,
    subjectBreakdown,
  }
}
