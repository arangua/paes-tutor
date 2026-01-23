import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import { safeMathMax, safeMathMin, safeRound, safeToISODate, safeAverage, safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

const historyQuerySchema = z.object({
  topicId: z.string().min(1),
  days: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 30)), // Por defecto últimos 30 días
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const searchParams = request.nextUrl.searchParams
      const topicId = searchParams.get('topicId') || undefined
      const days = searchParams.get('days') || undefined

      // Validar parámetros
      const validation = historyQuerySchema.safeParse({ topicId, days })
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Parámetros inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { topicId: validTopicId, days: validDays } = validation.data

      // Verificar que el tema existe
      const topic = await prisma.topic.findUnique({
        where: { id: validTopicId },
        select: {
          id: true,
          nombre: true,
          ejeTematico: true,
          subject: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
      })

      if (!topic) {
        return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 })
      }

      // Calcular fecha de inicio
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - validDays)

      // Obtener sesiones de práctica del tema
      const practiceSessions = await prisma.practiceSession.findMany({
        where: {
          studentId,
          topicId: validTopicId,
          startedAt: {
            gte: startDate,
          },
        },
        select: {
          id: true,
          porcentaje: true,
          correctas: true,
          totalPreguntas: true,
          startedAt: true,
          finishedAt: true,
          duracionSegundos: true,
        },
        orderBy: { startedAt: 'asc' },
      })

      // Obtener intentos de exámenes que incluyen este tema
      // Primero obtener preguntas de este tema
      const questionIds = await prisma.question.findMany({
        where: { topicId: validTopicId },
        select: { id: true },
      })

      // CORRECCIÓN: Validar que questionIds sea un array válido antes de usar map()
      const safeQuestionIds = Array.isArray(questionIds) ? questionIds : []
      const questionIdSet = new Set(
        safeQuestionIds
          .filter(q => q && typeof q === 'object' && q.id && typeof q.id === 'string')
          .map(q => q.id)
      )

      // Obtener intentos que tienen respuestas de preguntas de este tema
      const attempts = await prisma.attempt.findMany({
        where: {
          studentId,
          estado: 'completado',
          startedAt: {
            gte: startDate,
          },
          answers: {
            some: {
              questionId: {
                in: Array.from(questionIdSet),
              },
            },
          },
        },
        select: {
          id: true,
          porcentaje: true,
          startedAt: true,
          finishedAt: true,
          answers: {
            where: {
              questionId: {
                in: Array.from(questionIdSet),
              },
            },
            select: {
              esCorrecta: true,
            },
          },
        },
        orderBy: { startedAt: 'asc' },
      })

      // Calcular porcentaje por tema en cada intento
      const attemptScores = attempts
        .filter(attempt => attempt && attempt.answers && Array.isArray(attempt.answers))
        .map(attempt => {
          const topicAnswers = Array.isArray(attempt.answers) ? attempt.answers : []
          // ✅ Enterprise: Calcular porcentaje usando funciones seguras
          const correct = topicAnswers.filter(a => a && a.esCorrecta === true).length
          const total = topicAnswers.length
          const safeCorrect = ensureFiniteNumber(correct, 0)
          const safeTotal = ensureFiniteNumber(total, 0)
          const porcentaje = safeTotal > 0
            ? safeRound(safeDivide(safeCorrect, safeTotal, 0) * 100, 2)
            : 0

          const safeStartedAt = attempt.startedAt instanceof Date && !Number.isNaN(attempt.startedAt.getTime())
            ? attempt.startedAt
            : null
          const safeFinishedAt = attempt.finishedAt instanceof Date && !Number.isNaN(attempt.finishedAt.getTime())
            ? attempt.finishedAt
            : null

          return {
            id: attempt.id || '',
            type: 'exam' as const,
            porcentaje: Number.isFinite(porcentaje) && porcentaje >= 0 && porcentaje <= 100 ? porcentaje : 0,
            correctas: Number.isFinite(correct) && correct >= 0 ? correct : 0,
            totalPreguntas: Number.isFinite(total) && total >= 0 ? total : 0,
            fecha: safeToISODate(safeStartedAt),
            finishedAt: safeFinishedAt ? safeToISODate(safeFinishedAt) : null,
          }
        })

      // Formatear sesiones de práctica
      // CORRECCIÓN: Validar que practiceSessions sea un array válido y que session.startedAt sea una fecha válida
      const practiceScores = (Array.isArray(practiceSessions) ? practiceSessions : [])
        .filter(session => session && typeof session === 'object')
        .map(session => ({
          id: session.id,
          type: 'practice' as const,
          porcentaje: session.porcentaje,
          correctas: session.correctas,
          totalPreguntas: session.totalPreguntas,
          fecha: safeToISODate(session.startedAt),
          finishedAt: session.finishedAt ? safeToISODate(session.finishedAt) : null,
          duracionSegundos: session.duracionSegundos,
        }))

      // Combinar y ordenar por fecha
      // CORRECCIÓN: Validar que practiceScores y attemptScores sean arrays válidos antes de usar spread operator
      const safePracticeScores = Array.isArray(practiceScores) ? practiceScores : []
      const safeAttemptScores = Array.isArray(attemptScores) ? attemptScores : []
      const allScores = [...safePracticeScores, ...safeAttemptScores].sort((a, b) => {
        // CORRECCIÓN: Validar que a.fecha y b.fecha sean strings válidos antes de crear Date y usar getTime()
        if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
          return 0
        }
        const aFechaString = typeof a.fecha === 'string' && a.fecha.length > 0 ? a.fecha : ''
        const bFechaString = typeof b.fecha === 'string' && b.fecha.length > 0 ? b.fecha : ''
        if (!aFechaString || !bFechaString) {
          return 0
        }
        try {
          const aDate = new Date(aFechaString)
          const bDate = new Date(bFechaString)
          if (aDate instanceof Date && !Number.isNaN(aDate.getTime()) && bDate instanceof Date && !Number.isNaN(bDate.getTime())) {
            const aTime = aDate.getTime()
            const bTime = bDate.getTime()
            if (Number.isFinite(aTime) && Number.isFinite(bTime)) {
              return aTime - bTime
            }
          }
        } catch (error) {
          logger.warn({ error, aFecha: aFechaString, bFecha: bFechaString }, 'practice/topic-history: Error al crear Date o usar getTime() en sort')
        }
        return 0
      })

      // Calcular estadísticas agregadas
      // CORRECCIÓN: Validar que practiceSessions y attempts sean arrays válidos antes de acceder a length
      const safeTotalSessions = Array.isArray(practiceSessions) && Number.isFinite(practiceSessions.length) && practiceSessions.length >= 0
        ? practiceSessions.length
        : 0
      const safeTotalAttempts = Array.isArray(attempts) && Number.isFinite(attempts.length) && attempts.length >= 0
        ? attempts.length
        : 0
      
      // CORRECCIÓN: Definir safeAllScoresLength antes de usarlo
      const safeAllScoresLength = Array.isArray(allScores) && Number.isFinite(allScores.length) && allScores.length >= 0
        ? allScores.length
        : 0
      
      const avgScore = safeAverage(
        allScores.map(s => s?.porcentaje).filter(p => Number.isFinite(p) && p >= 0 && p <= 100),
        0
      )

      // Calcular tendencia (comparar primera mitad vs segunda mitad)
      let trend: 'improving' | 'declining' | 'stable' = 'stable'
      // CORRECCIÓN: Validar que allScores.length sea finito antes de comparar y usar Math.floor()
      if (safeAllScoresLength >= 4 && Number.isFinite(safeAllScoresLength)) {
        const safeMidpoint = Math.floor(safeAllScoresLength / 2)
        // CORRECCIÓN: Validar que safeMidpoint sea finito y que allScores sea un array válido antes de slice()
        if (Number.isFinite(safeMidpoint) && Array.isArray(allScores)) {
          const firstHalf = allScores.slice(0, safeMidpoint)
          const secondHalf = allScores.slice(safeMidpoint)

          // CORRECCIÓN: Validar que firstHalf y secondHalf sean arrays válidos y que s.porcentaje sea finito antes de reducir y dividir
          const safeFirstHalfLength = Array.isArray(firstHalf) && Number.isFinite(firstHalf.length) && firstHalf.length >= 0
            ? firstHalf.length
            : 0
          const firstAvg = safeFirstHalfLength > 0
            ? (() => {
                const sum = firstHalf.reduce((sum, s) => {
                  const safeSum = Number.isFinite(sum) ? sum : 0
                  const safePorcentaje = s && typeof s === 'object' && Number.isFinite(s.porcentaje) && s.porcentaje >= 0 && s.porcentaje <= 100
                    ? s.porcentaje
                    : 0
                  const result = safeSum + safePorcentaje
                  return Number.isFinite(result) ? result : safeSum
                }, 0)
                return Number.isFinite(sum) && safeFirstHalfLength > 0 ? sum / safeFirstHalfLength : 0
              })()
            : 0

          const safeSecondHalfLength = Array.isArray(secondHalf) && Number.isFinite(secondHalf.length) && secondHalf.length >= 0
            ? secondHalf.length
            : 0
          const secondAvg = safeSecondHalfLength > 0
            ? (() => {
                const sum = secondHalf.reduce((sum, s) => {
                  const safeSum = Number.isFinite(sum) ? sum : 0
                  const safePorcentaje = s && typeof s === 'object' && Number.isFinite(s.porcentaje) && s.porcentaje >= 0 && s.porcentaje <= 100
                    ? s.porcentaje
                    : 0
                  const result = safeSum + safePorcentaje
                  return Number.isFinite(result) ? result : safeSum
                }, 0)
                return Number.isFinite(sum) && safeSecondHalfLength > 0 ? sum / safeSecondHalfLength : 0
              })()
            : 0

          const diff = Number.isFinite(firstAvg) && Number.isFinite(secondAvg) ? secondAvg - firstAvg : 0
          if (Number.isFinite(diff)) {
            if (diff > 5) trend = 'improving'
            else if (diff < -5) trend = 'declining'
          }
        }
      }

      // Calcular mejor y peor rendimiento
      // CORRECCIÓN: Validar que allScores sea un array válido antes de usar map() y Math.max/Math.min
      let bestScore = 0
      let worstScore = 0
      if (Array.isArray(allScores) && allScores.length > 0) {
        try {
          // CORRECCIÓN: Validar que s.porcentaje sea un número finito antes de mapear
          const validPercentages = allScores
            .filter(s => s && typeof s === 'object' && Number.isFinite(s.porcentaje) && s.porcentaje >= 0 && s.porcentaje <= 100)
            .map(s => s.porcentaje)
          
          if (Array.isArray(validPercentages) && validPercentages.length > 0) {
            try {
              const max = safeMathMax(validPercentages)
              bestScore = Number.isFinite(max) && max >= 0 && max <= 100 ? max : 0
            } catch (error) {
              logger.warn({ error, validPercentages }, 'practice/topic-history: Error al ejecutar Math.max() con spread operator, usando reduce como fallback')
              // Fallback: usar reduce si Math.max con spread falla
              const maxReduce = validPercentages.reduce((a, b) => {
                const safeA = Number.isFinite(a) ? a : 0
                const safeB = Number.isFinite(b) ? b : 0
                return safeA > safeB ? safeA : safeB
              }, 0)
              bestScore = Number.isFinite(maxReduce) && maxReduce >= 0 && maxReduce <= 100 ? maxReduce : 0
            }
            
            try {
              const min = safeMathMin(validPercentages)
              worstScore = Number.isFinite(min) && min >= 0 && min <= 100 ? min : 0
            } catch (error) {
              logger.warn({ error, validPercentages }, 'practice/topic-history: Error al ejecutar Math.min() con spread operator, usando reduce como fallback')
              // Fallback: usar reduce si Math.min con spread falla
              const minReduce = validPercentages.reduce((a, b) => {
                const safeA = Number.isFinite(a) ? a : 100
                const safeB = Number.isFinite(b) ? b : 100
                return safeA < safeB ? safeA : safeB
              }, 100)
              worstScore = Number.isFinite(minReduce) && minReduce >= 0 && minReduce <= 100 ? minReduce : 0
            }
          }
        } catch (error) {
          logger.warn({ error, allScores }, 'practice/topic-history: Error al calcular bestScore/worstScore, usando 0')
        }
      }

      // Usar safeRound para redondear a 1 decimal de forma segura
      const safeAvgScore = safeRound(avgScore, 1)
      const safeBestScore = safeRound(bestScore, 1)
      const safeWorstScore = safeRound(worstScore, 1)
      
      // CORRECCIÓN: Validar que allScores sea un array válido antes de acceder a length
      const safeAllScoresLengthForResponse = Array.isArray(allScores) && Number.isFinite(allScores.length) && allScores.length >= 0
        ? allScores.length
        : 0

      return NextResponse.json({
        topic: {
          id: topic.id,
          nombre: topic.nombre,
          ejeTematico: topic.ejeTematico,
          subject: topic.subject ? {
            id: topic.subject.id,
            nombre: topic.subject.nombre,
            codigo: topic.subject.codigo,
          } : null,
        },
        scores: allScores,
        summary: {
          totalSessions: safeTotalSessions,
          totalAttempts: safeTotalAttempts,
          totalActivities: safeAllScoresLengthForResponse,
          avgScore: safeAvgScore,
          bestScore: safeBestScore,
          worstScore: safeWorstScore,
          trend,
        },
        period: {
          days: validDays,
          startDate: safeToISODate(startDate),
          endDate: safeToISODate(new Date()),
        },
      })
    } catch (error) {
      logger.error(
        {
          type: 'practice_topic_history_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener historial de progreso por tema'
      )
      return NextResponse.json(
        { error: 'Error al obtener historial de progreso por tema' },
        { status: 500 }
      )
    }
  })
}
