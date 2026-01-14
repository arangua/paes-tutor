import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { safeRound, safeToISODate, safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

const comparisonQuerySchema = z.object({
  subjectId: z.string().optional(),
  period: z.enum(['all', '30d', '60d', '90d', '180d', '365d']).optional().default('all'),
})

/**
 * Calcula el percentil de un valor en un array de valores ordenados
 */
function calculatePercentile(values: number[], value: number): number {
  if (!Array.isArray(values) || values.length === 0) {
    return 50
  }

  // Validar que value sea un número finito
  if (!Number.isFinite(value)) {
    return 50
  }

  // Filtrar valores no finitos antes de ordenar
  const validValues = values.filter(v => Number.isFinite(v) && typeof v === 'number')
  if (validValues.length === 0) {
    return 50
  }

  const sorted = [...validValues].sort((a, b) => {
    const safeA = Number.isFinite(a) ? a : 0
    const safeB = Number.isFinite(b) ? b : 0
    return safeA - safeB
  })

  const index = sorted.findIndex(v => Number.isFinite(v) && v >= value)

  if (index === -1) return 100 // El valor es mayor que todos
  if (index === 0) return 0 // El valor es menor que todos

  // ✅ Enterprise: Calcular percentil basado en la posición usando funciones seguras
  const safeIndex = ensureFiniteNumber(index >= 0 ? index : 0, 0)
  const safeLength = ensureFiniteNumber(sorted.length > 0 ? sorted.length : 1, 1)
  const percentile = safeRound(safeDivide(safeIndex, safeLength, 0.5) * 100, 1)
  return ensureFiniteNumber(percentile, 50)
}

/**
 * Calcula estadísticas descriptivas de un array de valores
 */
function calculateStatistics(values: number[]) {
  if (values.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      p25: 0,
      p75: 0,
      p90: 0,
      p95: 0,
    }
  }

  // Validar que values sea un array válido antes de ordenar
  if (!Array.isArray(values)) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      p25: 0,
      p75: 0,
      p90: 0,
      p95: 0,
    }
  }

  // Filtrar valores no finitos antes de ordenar
  const validValues = values.filter(v => Number.isFinite(v) && typeof v === 'number')
  if (validValues.length === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      p25: 0,
      p75: 0,
      p90: 0,
      p95: 0,
    }
  }

  const sorted = [...validValues].sort((a, b) => {
    const safeA = Number.isFinite(a) ? a : 0
    const safeB = Number.isFinite(b) ? b : 0
    return safeA - safeB
  })
  const n = sorted.length

  if (n === 0) {
    return {
      min: 0,
      max: 0,
      mean: 0,
      median: 0,
      p25: 0,
      p75: 0,
      p90: 0,
      p95: 0,
    }
  }

  // ✅ Enterprise: Calcular percentil usando funciones seguras
  const getPercentile = (p: number) => {
    if (!Number.isFinite(p) || p < 0 || p > 100) {
      return 0
    }
    // Usar safeDivide para evitar división por cero
    const pDecimal = safeDivide(p, 100, 0)
    const index = Math.ceil(pDecimal * n) - 1
    const safeIndex = Math.max(0, Math.min(index, n - 1))
    const value = sorted[safeIndex]
    return Number.isFinite(value) ? value : 0
  }

  // ✅ Enterprise: Calcular suma y promedio usando funciones seguras
  const sum = sorted.reduce((a, b) => {
    const safeA = Number.isFinite(a) ? a : 0
    const safeB = Number.isFinite(b) ? b : 0
    const result = safeA + safeB
    return Number.isFinite(result) ? result : 0
  }, 0)
  const mean = n > 0 && Number.isFinite(sum) ? safeDivide(sum, n, 0) : 0

  // Validar que el array tenga elementos antes de acceder a índices
  const minValue = Array.isArray(sorted) && sorted.length > 0 && Number.isFinite(sorted[0]) ? sorted[0] : 0
  const safeN = Number.isFinite(n) && n > 0 ? n : 0
  const lastIndex = safeN > 0 ? safeN - 1 : 0
  const maxValue = Array.isArray(sorted) && sorted.length > lastIndex && Number.isFinite(sorted[lastIndex]) ? sorted[lastIndex] : 0

  return {
    min: Number.isFinite(minValue) ? minValue : 0,
    max: Number.isFinite(maxValue) ? maxValue : 0,
    mean: Number.isFinite(mean) ? safeRound(mean, 1) : 0,
    median: getPercentile(50),
    p25: getPercentile(25),
    p75: getPercentile(75),
    p90: getPercentile(90),
    p95: getPercentile(95),
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const searchParams = request.nextUrl.searchParams
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const validation = comparisonQuerySchema.safeParse(queryParams)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { subjectId, period } = validation.data

      // Calcular fecha de inicio según el período
      let startDate: Date | undefined
      if (period !== 'all') {
        // CORRECCIÓN: Validar que period sea un string válido antes de usar replace()
        const safePeriod = typeof period === 'string' ? period : ''
        if (!safePeriod || safePeriod.length === 0) {
          return NextResponse.json(
            { error: 'Período inválido' },
            { status: 400 }
          )
        }
        let daysStr = ''
        try {
          daysStr = safePeriod.replace('d', '')
          if (typeof daysStr !== 'string') {
            daysStr = safePeriod // Fallback
          }
        } catch {
          daysStr = safePeriod // Fallback
        }
        const days = parseInt(daysStr, 10)
        if (isNaN(days) || days < 1 || !Number.isFinite(days)) {
          return NextResponse.json(
            { error: 'Período inválido' },
            { status: 400 }
          )
        }
        startDate = new Date()
        // CORRECCIÓN: Validar que startDate sea una fecha válida antes de usar setDate()
        if (startDate instanceof Date && !Number.isNaN(startDate.getTime())) {
          const currentDate = startDate.getDate()
          if (Number.isFinite(currentDate) && Number.isFinite(days)) {
            const newDate = currentDate - days
            if (Number.isFinite(newDate)) {
              startDate.setDate(newDate)
              // Validar que setDate() haya funcionado correctamente
              if (Number.isNaN(startDate.getTime())) {
                logger.warn({ period, days, newDate }, 'analytics/comparison: setDate() resultó en fecha inválida, usando fecha actual')
                startDate = new Date()
              }
            } else {
              logger.warn({ period, days, newDate }, 'analytics/comparison: newDate calculado es inválido, usando fecha actual')
              startDate = new Date()
            }
          } else {
            logger.warn({ period, days, currentDate }, 'analytics/comparison: currentDate o days inválidos, usando fecha actual')
            startDate = new Date()
          }
        } else {
          logger.warn({ period, startDate }, 'analytics/comparison: new Date() retornó fecha inválida, usando fecha actual')
          startDate = new Date()
        }
      }

      // Construir filtro de fecha para métricas
      const dateFilter = startDate
        ? {
            updatedAt: {
              gte: startDate,
            },
          }
        : {}

      // Obtener métricas del estudiante actual
      const studentMetrics = await prisma.performanceMetric.findMany({
        where: {
          studentId: dbUser.student.id,
          ...(subjectId && {
            topic: {
              subjectId,
            },
          }),
          ...dateFilter,
        },
        include: {
          topic: {
            include: {
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
      })

      // Agrupar métricas del estudiante por asignatura
      const studentMetricsBySubject = new Map<
        string,
        {
          subjectId: string
          subjectName: string
          subjectCode: string
          totalPreguntas: number
          correctas: number
          porcentaje: number
        }
      >()

      studentMetrics
        .filter(metric => metric.topic && metric.topic.subject)
        .forEach(metric => {
          const subjectId = metric.topic?.subject?.id || ''
          if (!subjectId) return
          
          const existing = studentMetricsBySubject.get(subjectId)

          if (existing) {
            existing.totalPreguntas += metric.totalPreguntas
            existing.correctas += metric.correctas
          } else {
            studentMetricsBySubject.set(subjectId, {
              subjectId,
              subjectName: metric.topic?.subject?.nombre || '',
              subjectCode: metric.topic?.subject?.codigo || '',
              totalPreguntas: metric.totalPreguntas,
              correctas: metric.correctas,
              porcentaje: 0,
            })
          }
        })

      // Calcular porcentajes por asignatura para el estudiante
      studentMetricsBySubject.forEach((value) => {
        value.porcentaje =
          value.totalPreguntas > 0 ? (value.correctas / value.totalPreguntas) * 100 : 0
      })

      // Obtener todas las métricas de todos los estudiantes (anónimamente)
      // Solo incluir estudiantes que tienen al menos una métrica en el período
      const allMetrics = await prisma.performanceMetric.findMany({
        where: {
          ...(subjectId && {
            topic: {
              subjectId,
            },
          }),
          ...dateFilter,
          // Solo incluir métricas con al menos 10 preguntas para tener datos significativos
          totalPreguntas: {
            gte: 10,
          },
        },
        include: {
          topic: {
            include: {
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
            },
          },
        },
      })

      // Agrupar métricas de todos los estudiantes por asignatura
      const allMetricsBySubject = new Map<
        string,
        Map<
          string,
          {
            totalPreguntas: number
            correctas: number
            porcentaje: number
          }
        >
      >()

      allMetrics
        .filter(metric => metric.topic && metric.topic.subject)
        .forEach(metric => {
          const subjectId = metric.topic?.subject?.id || ''
          if (!subjectId) return

          if (!allMetricsBySubject.has(subjectId)) {
            allMetricsBySubject.set(subjectId, new Map())
          }

          const subjectMap = allMetricsBySubject.get(subjectId)
          if (!subjectMap) {
            return // Saltar si no hay datos para esta asignatura
          }
          const studentId = metric.studentId

          if (!subjectMap.has(studentId)) {
            subjectMap.set(studentId, {
              totalPreguntas: 0,
              correctas: 0,
              porcentaje: 0,
            })
          }

          const studentData = subjectMap.get(studentId)
          if (!studentData) {
            return // Saltar si no hay datos para este estudiante
          }
          const safeTotal = Number.isFinite(metric.totalPreguntas) && metric.totalPreguntas >= 0 ? metric.totalPreguntas : 0
          const safeCorrect = Number.isFinite(metric.correctas) && metric.correctas >= 0 ? metric.correctas : 0
          studentData.totalPreguntas += safeTotal
          studentData.correctas += safeCorrect
        })

      // Calcular porcentajes y estadísticas por asignatura
      const comparisonResults: Array<{
        subjectId: string
        subjectName: string
        subjectCode: string
        studentPercentage: number
        studentTotalQuestions: number
        studentCorrectAnswers: number
        percentile: number
        position: number
        totalStudents: number
        statistics: {
          min: number
          max: number
          mean: number
          median: number
          p25: number
          p75: number
          p90: number
          p95: number
        }
      }> = []

      studentMetricsBySubject.forEach((studentData, subjectId) => {
        const allStudentsData = allMetricsBySubject.get(subjectId)

        if (!allStudentsData || allStudentsData.size === 0) {
          return
        }

        // ✅ Enterprise: Calcular porcentajes para todos los estudiantes usando funciones seguras
        const allPercentages: number[] = []
        allStudentsData.forEach(studentData => {
          const safeCorrectas = ensureFiniteNumber(studentData.correctas, 0)
          const safeTotal = ensureFiniteNumber(studentData.totalPreguntas, 0)
          const percentage = safeRound(safeDivide(safeCorrectas, safeTotal, 0) * 100, 2)
          studentData.porcentaje = percentage
          allPercentages.push(percentage)
        })

        // Calcular estadísticas
        const statistics = calculateStatistics(allPercentages)

        // Calcular percentil del estudiante
        const percentile = calculatePercentile(allPercentages, studentData.porcentaje)

        // Calcular posición en el ranking (1 = mejor, n = peor)
        const sortedPercentages = Array.isArray(allPercentages)
          ? [...allPercentages]
              .filter(p => Number.isFinite(p))
              .sort((a, b) => {
                const safeA = Number.isFinite(a) ? a : 0
                const safeB = Number.isFinite(b) ? b : 0
                return safeB - safeA
              })
          : []
        const safeStudentPorcentaje = Number.isFinite(studentData?.porcentaje) && studentData.porcentaje >= 0 && studentData.porcentaje <= 100
          ? studentData.porcentaje
          : 0
        const findIndexResult = sortedPercentages.findIndex(p => {
          const safeP = Number.isFinite(p) ? p : 0
          return safeP <= safeStudentPorcentaje
        })
        const position = findIndexResult >= 0 && Number.isFinite(findIndexResult)
          ? findIndexResult + 1
          : sortedPercentages.length > 0
            ? sortedPercentages.length + 1 // Si no se encuentra, está al final
            : 1 // Si no hay datos, posición 1 por defecto

        // Obtener información de la asignatura
        const subjectInfo = studentMetrics.find(m => m.topic?.subject?.id === subjectId)?.topic
          ?.subject

        if (subjectInfo) {
          const safeStudentPercentage = safeRound(studentData.porcentaje, 1)
          
          comparisonResults.push({
            subjectId,
            subjectName: subjectInfo.nombre,
            subjectCode: subjectInfo.codigo,
            studentPercentage: safeStudentPercentage,
            studentTotalQuestions: studentData.totalPreguntas,
            studentCorrectAnswers: studentData.correctas,
            percentile,
            position,
            totalStudents: allStudentsData.size,
            statistics,
          })
        }
      })

      // Ordenar por porcentaje del estudiante (descendente)
      // CORRECCIÓN: Validar que comparisonResults sea un array válido y que studentPercentage sean números finitos antes de restar
      if (Array.isArray(comparisonResults)) {
        try {
          comparisonResults.sort((a, b) => {
            if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
              return 0
            }
            const safeAPercentage = Number.isFinite(a.studentPercentage) ? a.studentPercentage : 0
            const safeBPercentage = Number.isFinite(b.studentPercentage) ? b.studentPercentage : 0
            const diff = safeBPercentage - safeAPercentage
            return Number.isFinite(diff) ? diff : 0
          })
        } catch (error) {
          logger.warn({ error, comparisonResults }, 'analytics/comparison: Error al ordenar comparisonResults, usando orden original')
        }
      }

      // Calcular estadísticas generales (todas las asignaturas combinadas)
      const allStudentPercentages = Array.from(studentMetricsBySubject.values())
        .filter(s => s && Number.isFinite(s.porcentaje))
        .map(s => {
          const safePorcentaje = Number.isFinite(s.porcentaje) && s.porcentaje >= 0 && s.porcentaje <= 100
            ? s.porcentaje
            : 0
          return safePorcentaje
        })
      const overallPercentage =
        allStudentPercentages.length > 0
          ? (() => {
              const sum = allStudentPercentages.reduce((a, b) => {
                const safeA = Number.isFinite(a) ? a : 0
                const safeB = Number.isFinite(b) ? b : 0
                const result = safeA + safeB
                return Number.isFinite(result) ? result : 0
              }, 0)
              return Number.isFinite(sum) && allStudentPercentages.length > 0
                ? sum / allStudentPercentages.length
                : 0
            })()
          : 0

      // Obtener todos los porcentajes de todos los estudiantes (promedio por estudiante)
      const allOverallPercentages: number[] = []
      const studentOverallMap = new Map<string, { total: number; correct: number }>()

      allMetrics.forEach(metric => {
        const studentId = metric.studentId
        if (!studentOverallMap.has(studentId)) {
          studentOverallMap.set(studentId, { total: 0, correct: 0 })
        }
        const data = studentOverallMap.get(studentId)
        if (data) {
          const safeTotal = Number.isFinite(metric.totalPreguntas) && metric.totalPreguntas >= 0 ? metric.totalPreguntas : 0
          const safeCorrect = Number.isFinite(metric.correctas) && metric.correctas >= 0 ? metric.correctas : 0
          data.total += safeTotal
          data.correct += safeCorrect
        }
      })

      studentOverallMap.forEach(data => {
        if (data && Number.isFinite(data.total) && Number.isFinite(data.correct)) {
          const safeTotal = data.total > 0 ? data.total : 0
          const safeCorrect = data.correct >= 0 ? data.correct : 0
          const percentage = safeTotal > 0 ? (safeCorrect / safeTotal) * 100 : 0
          if (Number.isFinite(percentage) && percentage >= 0 && percentage <= 100) {
            allOverallPercentages.push(percentage)
          }
        }
      })

      const overallStatistics = calculateStatistics(allOverallPercentages)
      const overallPercentile = calculatePercentile(allOverallPercentages, overallPercentage)

      const sortedOverall = Array.isArray(allOverallPercentages)
        ? [...allOverallPercentages]
            .filter(p => Number.isFinite(p))
            .sort((a, b) => {
              const safeA = Number.isFinite(a) ? a : 0
              const safeB = Number.isFinite(b) ? b : 0
              return safeB - safeA
            })
        : []
      
      // CORRECCIÓN: Validar que overallPercentage sea un número finito antes de multiplicar y usar Math.round()
      // Primero validar que overallPercentage sea finito y esté en rango válido
      const safeOverallPercentageForPosition = Number.isFinite(overallPercentage) && overallPercentage >= 0 && overallPercentage <= 100
        ? overallPercentage
        : 0
      const findIndexResult = sortedOverall.findIndex(p => {
        const safeP = Number.isFinite(p) ? p : 0
        return safeP <= safeOverallPercentageForPosition
      })
      const overallPosition = findIndexResult >= 0 && Number.isFinite(findIndexResult)
        ? findIndexResult + 1
        : sortedOverall.length > 0
          ? sortedOverall.length + 1 // Si no se encuentra, está al final
          : 1 // Si no hay datos, posición 1 por defecto

      // CORRECCIÓN: Validar que overallPercentage sea un número finito antes de multiplicar y usar Math.round()
      // Usar safeRound para redondear a 1 decimal de forma segura
      const safeOverallPercentage = safeRound(overallPercentage, 1)
      const safeGeneratedAt = safeToISODate(new Date())
      
      return NextResponse.json({
        overall: {
          percentage: safeOverallPercentage,
          percentile: overallPercentile,
          position: overallPosition,
          totalStudents: studentOverallMap.size,
          statistics: overallStatistics,
        },
        bySubject: comparisonResults,
        period,
        generatedAt: safeGeneratedAt,
      })
    } catch (error) {
      logger.error(
        {
          type: 'analytics_comparison_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener comparación anónima'
      )
      return NextResponse.json({ error: 'Error al obtener comparación anónima' }, { status: 500 })
    }
  })
}
