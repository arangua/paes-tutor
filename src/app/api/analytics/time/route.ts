import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { safeToISODate, safeRound, safeDivide } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

const timeQuerySchema = z.object({
  subjectId: z.string().optional(),
  period: z
    .enum(['all', '30d', '60d', '90d', '180d', '365d'])
    .default('all'),
  groupBy: z
    .enum(['difficulty', 'subject', 'topic', 'correctness'])
    .default('difficulty'),
})

/**
 * Calcula el tiempo ideal por pregunta según el tipo de examen PAES
 * Basado en: 2.5 horas (150 minutos) para 65 preguntas = ~2.3 minutos por pregunta
 */
const IDEAL_TIME_PER_QUESTION_SECONDS = 138 // ~2.3 minutos

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

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters (el schema aplicará los defaults)
      const validation = timeQuerySchema.safeParse(queryParams)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      // Asegurar que los defaults se apliquen si no están presentes
      const { subjectId, period = 'all', groupBy = 'difficulty' } = validation.data

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
                logger.warn({ period, days, newDate }, 'analytics/time: setDate() resultó en fecha inválida, usando fecha actual')
                startDate = new Date()
              }
            } else {
              logger.warn({ period, days, newDate }, 'analytics/time: newDate calculado es inválido, usando fecha actual')
              startDate = new Date()
            }
          } else {
            logger.warn({ period, days, currentDate }, 'analytics/time: currentDate o days inválidos, usando fecha actual')
            startDate = new Date()
          }
        } else {
          logger.warn({ period, startDate }, 'analytics/time: new Date() retornó fecha inválida, usando fecha actual')
          startDate = new Date()
        }
      }

      // Obtener respuestas de intentos con tiempo
      const attemptAnswers = await prisma.attemptAnswer.findMany({
        where: {
          attempt: {
            studentId: dbUser.student.id,
            estado: 'completado',
            ...(startDate && {
              finishedAt: {
                gte: startDate,
              },
            }),
          },
          tiempoSegundos: {
            not: null,
          },
          ...(subjectId && {
            question: {
              subjectId,
            },
          }),
        },
        include: {
          question: {
            include: {
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
              topic: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
      })

      // Obtener respuestas de práctica con tiempo
      const practiceAnswers = await prisma.practiceAnswer.findMany({
        where: {
          practiceSession: {
            studentId: dbUser.student.id,
            ...(startDate && {
              startedAt: {
                gte: startDate,
              },
            }),
          },
          tiempoSegundos: {
            not: null,
          },
          ...(subjectId && {
            question: {
              subjectId,
            },
          }),
        },
        include: {
          question: {
            include: {
              subject: {
                select: {
                  id: true,
                  nombre: true,
                  codigo: true,
                },
              },
              topic: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
      })

      // Combinar todas las respuestas
      const allAnswers = [
        ...attemptAnswers.map(a => ({
          tiempoSegundos: a.tiempoSegundos!,
          esCorrecta: a.esCorrecta ?? false,
          question: a.question,
        })),
        ...practiceAnswers.map(a => ({
          tiempoSegundos: a.tiempoSegundos!,
          esCorrecta: a.esCorrecta ?? false,
          question: a.question,
        })),
      ]

      if (allAnswers.length === 0) {
        return NextResponse.json({
          summary: {
            totalQuestions: 0,
            averageTime: 0,
            idealTime: IDEAL_TIME_PER_QUESTION_SECONDS,
            efficiency: 0,
          },
          byGroup: [],
          recommendations: [],
          period: period ?? 'all',
          groupBy: groupBy ?? 'difficulty',
          generatedAt: safeToISODate(new Date()),
        })
      }

      // Agrupar según el criterio seleccionado
      const groupedData = new Map<
        string,
        {
          key: string
          label: string
          times: number[]
          correctTimes: number[]
          incorrectTimes: number[]
          totalQuestions: number
          correctQuestions: number
          incorrectQuestions: number
        }
      >()

      allAnswers.forEach(answer => {
        let groupKey = ''
        let groupLabel = ''

        switch (groupBy) {
          case 'difficulty':
            groupKey = `difficulty_${answer.question.dificultad}`
            groupLabel = `Dificultad ${answer.question.dificultad}`
            break
          case 'subject':
            groupKey = `subject_${answer.question.subject?.id || 'unknown'}`
            groupLabel = answer.question.subject?.nombre || 'Sin asignatura'
            break
          case 'topic':
            if (answer.question.topic) {
              groupKey = `topic_${answer.question.topic.id}`
              groupLabel = answer.question.topic.nombre || 'Sin nombre'
            } else {
              groupKey = 'topic_null'
              groupLabel = 'Sin tema'
            }
            break
          case 'correctness':
            groupKey = answer.esCorrecta ? 'correct' : 'incorrect'
            groupLabel = answer.esCorrecta ? 'Correctas' : 'Incorrectas'
            break
        }

        if (!groupedData.has(groupKey)) {
          groupedData.set(groupKey, {
            key: groupKey,
            label: groupLabel,
            times: [],
            correctTimes: [],
            incorrectTimes: [],
            totalQuestions: 0,
            correctQuestions: 0,
            incorrectQuestions: 0,
          })
        }

        const group = groupedData.get(groupKey)
        if (!group) {
          return // Saltar si no hay grupo para esta clave
        }
        // CORRECCIÓN: Validar que answer.tiempoSegundos sea un número finito antes de push()
        const safeTiempoSegundos = answer && typeof answer === 'object' && Number.isFinite(answer.tiempoSegundos) && answer.tiempoSegundos >= 0
          ? answer.tiempoSegundos
          : 0
        if (Array.isArray(group.times)) {
          group.times.push(safeTiempoSegundos)
        }
        // CORRECCIÓN: Validar que totalQuestions sea un número finito antes de incrementar
        const safeTotalQuestions = Number.isFinite(group.totalQuestions) && group.totalQuestions >= 0 ? group.totalQuestions : 0
        group.totalQuestions = safeTotalQuestions + 1

        if (answer.esCorrecta) {
          if (Array.isArray(group.correctTimes)) {
            group.correctTimes.push(safeTiempoSegundos)
          }
          // CORRECCIÓN: Validar que correctQuestions sea un número finito antes de incrementar
          const safeCorrectQuestions = Number.isFinite(group.correctQuestions) && group.correctQuestions >= 0 ? group.correctQuestions : 0
          group.correctQuestions = safeCorrectQuestions + 1
        } else {
          if (Array.isArray(group.incorrectTimes)) {
            group.incorrectTimes.push(safeTiempoSegundos)
          }
          // CORRECCIÓN: Validar que incorrectQuestions sea un número finito antes de incrementar
          const safeIncorrectQuestions = Number.isFinite(group.incorrectQuestions) && group.incorrectQuestions >= 0 ? group.incorrectQuestions : 0
          group.incorrectQuestions = safeIncorrectQuestions + 1
        }
      })

      // Calcular estadísticas por grupo
      const calculateStats = (times: number[]) => {
        if (!Array.isArray(times) || times.length === 0) {
          return {
            average: 0,
            median: 0,
            min: 0,
            max: 0,
            p25: 0,
            p75: 0,
            p90: 0,
          }
        }

        // Filtrar valores no finitos antes de ordenar
        const validTimes = times.filter(t => Number.isFinite(t) && typeof t === 'number' && t >= 0)
        if (validTimes.length === 0) {
          return {
            average: 0,
            median: 0,
            min: 0,
            max: 0,
            p25: 0,
            p75: 0,
            p90: 0,
          }
        }

        const sorted = [...validTimes].sort((a, b) => {
          const safeA = Number.isFinite(a) ? a : 0
          const safeB = Number.isFinite(b) ? b : 0
          return safeA - safeB
        })
        const n = sorted.length

        if (n === 0) {
          return {
            average: 0,
            median: 0,
            min: 0,
            max: 0,
            p25: 0,
            p75: 0,
            p90: 0,
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
        const average = n > 0 && Number.isFinite(sum) ? safeDivide(sum, n, 0) : 0

        // Validar que el array tenga elementos antes de acceder a índices
        const minValue = Array.isArray(sorted) && sorted.length > 0 && Number.isFinite(sorted[0]) ? sorted[0] : 0
        const safeN = Number.isFinite(n) && n > 0 ? n : 0
        const lastIndex = safeN > 0 ? safeN - 1 : 0
        const maxValue = Array.isArray(sorted) && sorted.length > lastIndex && Number.isFinite(sorted[lastIndex]) ? sorted[lastIndex] : 0

        const safeAverage = safeRound(average, 1)

        return {
          average: safeAverage,
          median: getPercentile(50),
          min: Number.isFinite(minValue) ? minValue : 0,
          max: Number.isFinite(maxValue) ? maxValue : 0,
          p25: getPercentile(25),
          p75: getPercentile(75),
          p90: getPercentile(90),
        }
      }

      const byGroup = Array.from(groupedData.values())
        .map(group => {
          const allStats = calculateStats(group.times)
          const correctStats = calculateStats(group.correctTimes)
          const incorrectStats = calculateStats(group.incorrectTimes)

          // ✅ Enterprise: Calcular eficiencia usando funciones seguras
          const efficiency =
            allStats.average > 0
              ? Math.min(100, safeDivide(IDEAL_TIME_PER_QUESTION_SECONDS, allStats.average, 0) * 100)
              : 0

          const deviationFromIdeal = allStats.average - IDEAL_TIME_PER_QUESTION_SECONDS
          // ✅ Enterprise: Calcular desviación porcentual usando funciones seguras
          const deviationPercent =
            IDEAL_TIME_PER_QUESTION_SECONDS > 0
              ? safeDivide(deviationFromIdeal, IDEAL_TIME_PER_QUESTION_SECONDS, 0) * 100
              : 0

          return {
            key: group.key,
            label: group.label,
            totalQuestions: group.totalQuestions,
            correctQuestions: group.correctQuestions,
            incorrectQuestions: group.incorrectQuestions,
            accuracy:
              group.totalQuestions > 0 ? (group.correctQuestions / group.totalQuestions) * 100 : 0,
            timeStats: {
              all: allStats,
              correct: correctStats,
              incorrect: incorrectStats,
            },
            efficiency: safeRound(efficiency, 1),
            deviationFromIdeal: safeRound(deviationFromIdeal, 1),
            deviationPercent: safeRound(deviationPercent, 1),
            isOptimal: Math.abs(deviationPercent) <= 20, // Dentro del 20% del tiempo ideal
            isTooSlow: deviationPercent > 20,
            isTooFast: deviationPercent < -20,
          }
        })
        .sort((a, b) => {
          // CORRECCIÓN: Validar que a y b sean objetos válidos y que timeStats.all.average sean números finitos antes de restar
          if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
            return 0
          }
          const safeAAvg = a.timeStats?.all?.average && Number.isFinite(a.timeStats.all.average) ? a.timeStats.all.average : 0
          const safeBAvg = b.timeStats?.all?.average && Number.isFinite(b.timeStats.all.average) ? b.timeStats.all.average : 0
          const diff = safeBAvg - safeAAvg
          return Number.isFinite(diff) ? diff : 0
        }) // Ordenar por tiempo promedio (más lento primero)

      // Calcular estadísticas generales
      // CORRECCIÓN: Validar que allAnswers sea un array válido antes de mapear
      const allTimes = (() => {
        if (!Array.isArray(allAnswers)) {
          logger.warn({ allAnswers }, 'analytics/time: allAnswers no es un array válido, retornando array vacío')
          return []
        }
        try {
          return allAnswers
            .filter(a => a && typeof a === 'object' && Number.isFinite(a.tiempoSegundos) && a.tiempoSegundos >= 0)
            .map(a => a.tiempoSegundos)
        } catch (error) {
          logger.warn({ error, allAnswers }, 'analytics/time: Error al mapear allAnswers, retornando array vacío')
          return []
        }
      })()
      const allStats = calculateStats(allTimes)
      // ✅ Enterprise: Calcular eficiencia general usando funciones seguras
      const overallEfficiency =
        allStats.average > 0
          ? Math.min(100, safeDivide(IDEAL_TIME_PER_QUESTION_SECONDS, allStats.average, 0) * 100)
          : 0

      // Generar recomendaciones
      const recommendations: string[] = []

      // CORRECCIÓN: Validar que allStats.average y la multiplicación sean números finitos antes de comparar
      const safeAverage = Number.isFinite(allStats.average) ? allStats.average : 0
      const safeIdealTime = Number.isFinite(IDEAL_TIME_PER_QUESTION_SECONDS) ? IDEAL_TIME_PER_QUESTION_SECONDS : 60
      const safeThreshold1_2 = safeIdealTime * 1.2
      const safeThreshold0_8 = safeIdealTime * 0.8
      if (Number.isFinite(safeThreshold1_2) && safeAverage > safeThreshold1_2) {
        recommendations.push(
          'Estás tomando más tiempo del ideal. Considera practicar más para mejorar tu velocidad.'
        )
      } else if (Number.isFinite(safeThreshold0_8) && safeAverage < safeThreshold0_8) {
        recommendations.push(
          'Estás respondiendo muy rápido. Asegúrate de leer cuidadosamente las preguntas antes de responder.'
        )
      }

      // CORRECCIÓN: Validar que byGroup sea un array válido antes de filtrar
      const slowGroups = (() => {
        if (!Array.isArray(byGroup)) {
          return []
        }
        try {
          return byGroup.filter(g => g && typeof g === 'object' && g.isTooSlow === true)
        } catch {
          return []
        }
      })()
      if (slowGroups.length > 0) {
        const safeLabel = slowGroups[0]?.label && typeof slowGroups[0].label === 'string' ? slowGroups[0].label : 'algunos temas'
        recommendations.push(
          `Las preguntas de "${safeLabel}" te están tomando más tiempo. Considera repasar este tema.`
        )
      }

      // CORRECCIÓN: Validar que byGroup sea un array válido y que g.accuracy sea un número finito antes de filtrar
      const fastGroups = (() => {
        if (!Array.isArray(byGroup)) {
          return []
        }
        try {
          return byGroup.filter(g => {
            if (!g || typeof g !== 'object') {
              return false
            }
            const safeAccuracy = Number.isFinite(g.accuracy) ? g.accuracy : 0
            return g.isTooFast === true && safeAccuracy < 70
          })
        } catch {
          return []
        }
      })()
      if (fastGroups.length > 0) {
        const safeLabel = fastGroups[0]?.label && typeof fastGroups[0].label === 'string' ? fastGroups[0].label : 'algunos temas'
        recommendations.push(
          `Estás respondiendo muy rápido en "${safeLabel}" pero con baja precisión. Tómate más tiempo para pensar.`
        )
      }

      // CORRECCIÓN: Validar que byGroup sea un array válido y que los resultados de find() existan antes de acceder a propiedades
      const correctVsIncorrect = (() => {
        if (!Array.isArray(byGroup)) {
          return null
        }
        try {
          return byGroup.find(g => g && typeof g === 'object' && g.key === 'correct') || null
        } catch {
          return null
        }
      })()
      const incorrectGroup = (() => {
        if (!Array.isArray(byGroup)) {
          return null
        }
        try {
          return byGroup.find(g => g && typeof g === 'object' && g.key === 'incorrect') || null
        } catch {
          return null
        }
      })()
      if (
        correctVsIncorrect &&
        incorrectGroup &&
        correctVsIncorrect.timeStats?.all?.average &&
        incorrectGroup.timeStats?.all?.average
      ) {
        const safeCorrectAvg = Number.isFinite(correctVsIncorrect.timeStats.all.average) ? correctVsIncorrect.timeStats.all.average : 0
        const safeIncorrectAvg = Number.isFinite(incorrectGroup.timeStats.all.average) ? incorrectGroup.timeStats.all.average : 0
        const safeMultiplier = safeCorrectAvg * 1.5
        if (Number.isFinite(safeMultiplier) && safeIncorrectAvg > safeMultiplier) {
          recommendations.push(
            'Las preguntas incorrectas te están tomando mucho más tiempo. Esto puede indicar que necesitas más práctica en esos temas.'
          )
        }
      }

      return NextResponse.json({
        summary: {
          totalQuestions: allAnswers.length,
          averageTime: allStats.average,
          medianTime: allStats.median,
          idealTime: IDEAL_TIME_PER_QUESTION_SECONDS,
          efficiency: safeRound(overallEfficiency, 1),
          deviationFromIdeal: safeRound(allStats.average - (Number.isFinite(IDEAL_TIME_PER_QUESTION_SECONDS) ? IDEAL_TIME_PER_QUESTION_SECONDS : 60), 1),
          deviationPercent: safeRound(((allStats.average - (Number.isFinite(IDEAL_TIME_PER_QUESTION_SECONDS) && IDEAL_TIME_PER_QUESTION_SECONDS > 0 ? IDEAL_TIME_PER_QUESTION_SECONDS : 60)) / (Number.isFinite(IDEAL_TIME_PER_QUESTION_SECONDS) && IDEAL_TIME_PER_QUESTION_SECONDS > 0 ? IDEAL_TIME_PER_QUESTION_SECONDS : 60)) * 100, 1),
          minTime: allStats.min,
          maxTime: allStats.max,
          p25: allStats.p25,
          p75: allStats.p75,
          p90: allStats.p90,
        },
        byGroup,
        recommendations,
        period: period ?? 'all',
        groupBy: groupBy ?? 'difficulty',
        generatedAt: safeToISODate(new Date()),
      })
    } catch (error) {
      logger.error(
        {
          type: 'analytics_time_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener estadísticas de tiempo'
      )
      return NextResponse.json(
        { error: 'Error al obtener estadísticas de tiempo' },
        { status: 500 }
      )
    }
  })
}
