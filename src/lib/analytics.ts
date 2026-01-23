/**
 * Librería de Análisis Avanzado
 *
 * Funciones para análisis profundo del rendimiento del estudiante,
 * incluyendo tendencias, predicciones y comparaciones.
 */

import { safeRound, safeToISODate, safeAverage, ensureFiniteNumber, ensureInteger, safeDivide } from '@/app/api/notes/versions/validation-utils'

export type TrendDirection = 'improving' | 'declining' | 'stable'
export type StrengthWeaknessCategory = 'strength' | 'weakness' | 'average'
export type PredictionConfidence = 'high' | 'medium' | 'low'
export type ComparisonResult = 'above' | 'below' | 'equal'

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
  category: StrengthWeaknessCategory
}

export interface PAESPrediction {
  predictedScore: number
  confidence: PredictionConfidence
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
  comparison: ComparisonResult
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
    trend: TrendDirection
    attempts: number
  }>
}

interface Attempt {
  id: string
  porcentaje: number | null
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
    .filter(a => a.porcentaje != null)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

  return sortedAttempts.map(attempt => ({
    date: safeToISODate(attempt.createdAt) || 'unknown',
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

    let category: StrengthWeaknessCategory = 'average'
    if (metric.porcentaje >= 70) category = 'strength'
    else if (metric.porcentaje < 50) category = 'weakness'

    const item: StrengthWeakness = {
      topic: metric.topicName,
      subject: metric.subjectName,
      percentage: metric.porcentaje,
      totalQuestions: metric.totalPreguntas,
      category,
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
    a => a.porcentaje != null && a.porcentaje > 0
  )

  if (validAttempts.length < 3) {
    return null
  }

  // Calcular promedio de los últimos intentos (últimos 5 o todos si son menos)
  const recentAttempts = validAttempts.slice(-5)
  const averagePercentage = safeAverage(recentAttempts.map(a => a.porcentaje), 0)

  // ✅ Enterprise: Calcular tendencia (mejora o declive) usando funciones seguras
  const safeLength = ensureFiniteNumber(recentAttempts.length, 0)
  const halfIndex = ensureInteger(safeLength / 2, 0)
  const firstHalf = recentAttempts.slice(0, halfIndex)
  const secondHalf = recentAttempts.slice(halfIndex)

  // Validación defensiva: asegurar que ambas mitades tengan al menos un elemento
  let trend = 0
  if (firstHalf.length > 0 && secondHalf.length > 0) {
    const firstAvg = safeAverage(firstHalf.map(a => a.porcentaje), 0)
    const secondAvg = safeAverage(secondHalf.map(a => a.porcentaje), 0)
    trend = secondAvg - firstAvg
  }

  // Estimar puntaje PAES (rango típico: 150-850)
  // Asumiendo que 100% = 850 puntos y 0% = 150 puntos
  const baseScore = 150
  const maxScore = 850
  const scoreRange = maxScore - baseScore

  // ✅ Enterprise: Calcular puntaje predicho usando funciones seguras
  const safeAveragePercentage = ensureFiniteNumber(averagePercentage, 0)
  const predictedScore = baseScore + safeDivide(safeAveragePercentage, 100, 0) * scoreRange

  // ✅ Enterprise: Ajustar según tendencia usando funciones seguras
  const safeTrend = ensureFiniteNumber(trend, 0)
  const trendAdjustment = safeDivide(safeTrend, 100, 0) * scoreRange * 0.3 // Factor de ajuste conservador
  const adjustedScore = ensureFiniteNumber(predictedScore + trendAdjustment, predictedScore)

  // ✅ Enterprise: Calcular rango de confianza usando funciones seguras
  const variance =
    recentAttempts.reduce((sum, a) => {
      const safePorcentaje = ensureFiniteNumber(a.porcentaje, 0)
      const diff = safePorcentaje - safeAveragePercentage
      const diffSquared = diff * diff
      return ensureFiniteNumber(sum + diffSquared, sum)
    }, 0)
  const safeVariance = safeDivide(variance, recentAttempts.length, 0)
  const stdDev = Math.sqrt(ensureFiniteNumber(safeVariance, 0))
  const safeStdDev = ensureFiniteNumber(stdDev, 0)
  const margin = safeDivide(safeStdDev, 100, 0) * scoreRange

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
    predictedScore: safeRound(Math.max(150, Math.min(850, adjustedScore)), 0),
    confidence,
    factors,
    estimatedRange: {
      min: safeRound(Math.max(150, adjustedScore - margin), 0),
      max: safeRound(Math.min(850, adjustedScore + margin), 0),
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
  let comparison: ComparisonResult = 'equal'
  if (difference > 5) comparison = 'above'
  else if (difference < -5) comparison = 'below'

  // Calcular percentil aproximado (simulado)
  // En producción, esto se calcularía con datos reales
  let percentile = 15
  if (studentAverage >= 80) percentile = 90
  else if (studentAverage >= 70) percentile = 75
  else if (studentAverage >= 60) percentile = 50
  else if (studentAverage >= 50) percentile = 30

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
  trend: TrendDirection
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
    trend: TrendDirection
    attempts: number
  }> = []

  bySubject.forEach((subjectAttempts, _subjectCode) => {
    if (subjectAttempts.length < 2) return // Necesita al menos 2 intentos

    const sorted = [...subjectAttempts].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    )

    const average = safeAverage(sorted.map(a => a.porcentaje), 0)

    // ✅ Enterprise: Calcular tendencia usando funciones seguras
    const safeLength = ensureFiniteNumber(sorted.length, 0)
    const halfIndex = ensureInteger(safeLength / 2, 0)
    const firstHalf = sorted.slice(0, halfIndex)
    const secondHalf = sorted.slice(halfIndex)

    // Validación defensiva: asegurar que ambas mitades tengan al menos un elemento
    let trend: TrendDirection = 'stable'
    if (firstHalf.length > 0 && secondHalf.length > 0) {
      const firstAvg = safeAverage(firstHalf.map(a => a.porcentaje), 0)
      const secondAvg = safeAverage(secondHalf.map(a => a.porcentaje), 0)

      const trendDiff = secondAvg - firstAvg
      if (trendDiff > 3) trend = 'improving'
      else if (trendDiff < -3) trend = 'declining'
    }

    breakdown.push({
      subject: sorted[0].exam.subject.nombre,
      average: safeRound(average, 1),
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

  const studentAverage = safeAverage(attempts.map(a => a.porcentaje), 0)

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
