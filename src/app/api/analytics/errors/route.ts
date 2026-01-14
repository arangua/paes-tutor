import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { safeRound } from '@/app/api/notes/versions/validation-utils'

export const runtime = 'nodejs'

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

      // Obtener todas las respuestas incorrectas del estudiante
      const incorrectAnswers = await prisma.attemptAnswer.findMany({
        where: {
          attempt: {
            studentId: dbUser.student.id,
          },
          esCorrecta: false,
          omitida: false,
        },
        include: {
          attempt: {
            select: {
              id: true,
              startedAt: true,
            },
          },
          question: {
            include: {
              topic: {
                select: {
                  id: true,
                  nombre: true,
                  ejeTematico: true,
                  subjectId: true,
                },
              },
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

      // Agrupar errores por tema
      const errorsByTopic = new Map<
        string,
        {
          topicId: string
          topicName: string
          ejeTematico: string
          subjectId: string
          subjectName: string
          subjectCode: string
          errorCount: number
          questions: Array<{
            questionId: string
            enunciado: string
            vecesFallada: number
          }>
        }
      >()

      // Agrupar errores por pregunta
      const errorsByQuestion = new Map<
        string,
        {
          questionId: string
          enunciado: string
          topicId: string | null
          topicName: string | null
          subjectName: string
          errorCount: number
        }
      >()

      incorrectAnswers.forEach(answer => {
        const question = answer.question
        const topic = question.topic
        const subject = question.subject

        // Agrupar por tema
        if (topic && subject) {
          const key = topic.id
          if (!errorsByTopic.has(key)) {
            errorsByTopic.set(key, {
              topicId: topic.id,
              topicName: topic.nombre,
              ejeTematico: topic.ejeTematico,
              subjectId: subject.id,
              subjectName: subject.nombre,
              subjectCode: subject.codigo,
              errorCount: 0,
              questions: [],
            })
          }
          const topicData = errorsByTopic.get(key)
          if (topicData) {
            topicData.errorCount++
          }

          // Agregar pregunta al tema si no existe
          const existingQuestion = topicData.questions.find(q => q.questionId === question.id)
          if (existingQuestion) {
            existingQuestion.vecesFallada++
          } else {
            topicData.questions.push({
              questionId: question.id,
              enunciado: question.enunciado,
              vecesFallada: 1,
            })
          }
        }

        // Agrupar por pregunta
        const questionKey = question.id
        if (!errorsByQuestion.has(questionKey)) {
          errorsByQuestion.set(questionKey, {
            questionId: question.id,
            enunciado: question.enunciado,
            topicId: topic?.id || null,
            topicName: topic?.nombre || null,
            subjectName: subject?.nombre || '',
            errorCount: 0,
          })
        }
        const questionData = errorsByQuestion.get(questionKey)
        if (questionData) {
          questionData.errorCount++
        }
      })

      // Convertir a arrays y ordenar
      // CORRECCIÓN: Validar que errorsByTopic.values() retorne un iterable válido y que topic.questions sea un array válido antes de ordenar
      const topicsArray = (() => {
        try {
          const values = Array.from(errorsByTopic.values())
          if (!Array.isArray(values)) {
            return []
          }
          return values
            .map(topic => {
              if (!topic || typeof topic !== 'object') {
                return null
              }
              const safeQuestions = Array.isArray(topic.questions) ? topic.questions : []
              const sortedQuestions = (() => {
                try {
                  // CORRECCIÓN: Validar que safeQuestions sea un array válido antes de usar sort()
                  if (!Array.isArray(safeQuestions)) {
                    logger.warn({ topic, safeQuestions }, 'analytics/errors: safeQuestions no es un array válido antes de sort(), usando array vacío')
                    return []
                  }
                  const sorted = safeQuestions.sort((a, b) => {
                    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
                      return 0
                    }
                    const safeAVeces = Number.isFinite(a.vecesFallada) && a.vecesFallada >= 0 ? a.vecesFallada : 0
                    const safeBVeces = Number.isFinite(b.vecesFallada) && b.vecesFallada >= 0 ? b.vecesFallada : 0
                    const diff = safeBVeces - safeAVeces
                    return Number.isFinite(diff) ? diff : 0
                  })
                  // CORRECCIÓN: Validar que sort() retorne un array válido
                  if (!Array.isArray(sorted)) {
                    logger.warn({ safeQuestions, sorted }, 'analytics/errors: sort() retornó resultado inválido, usando safeQuestions original')
                    return safeQuestions
                  }
                  return sorted
                } catch (error) {
                  logger.warn({ error, safeQuestions }, 'analytics/errors: Error al ejecutar sort() en safeQuestions, usando array original')
                  return safeQuestions
                }
              })()
              return {
                ...topic,
                questions: sortedQuestions,
              }
            })
            .filter(topic => topic !== null)
            .sort((a, b) => {
              if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
                return 0
              }
              const safeAErrorCount = Number.isFinite(a.errorCount) && a.errorCount >= 0 ? a.errorCount : 0
              const safeBErrorCount = Number.isFinite(b.errorCount) && b.errorCount >= 0 ? b.errorCount : 0
              const diff = safeBErrorCount - safeAErrorCount
              return Number.isFinite(diff) ? diff : 0
            })
        } catch (error) {
          logger.warn({ error, errorsByTopic }, 'analytics/errors: Error al convertir errorsByTopic a array, retornando array vacío')
          return []
        }
      })()

      // CORRECCIÓN: Validar que errorsByQuestion.values() retorne un iterable válido y que errorCount sean números finitos antes de ordenar
      const questionsArray = (() => {
        try {
          const values = Array.from(errorsByQuestion.values())
          if (!Array.isArray(values)) {
            return []
          }
          return values.sort((a, b) => {
            if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
              return 0
            }
            const safeAErrorCount = Number.isFinite(a.errorCount) && a.errorCount >= 0 ? a.errorCount : 0
            const safeBErrorCount = Number.isFinite(b.errorCount) && b.errorCount >= 0 ? b.errorCount : 0
            const diff = safeBErrorCount - safeAErrorCount
            return Number.isFinite(diff) ? diff : 0
          })
        } catch (error) {
          logger.warn({ error, errorsByQuestion }, 'analytics/errors: Error al convertir errorsByQuestion a array, retornando array vacío')
          return []
        }
      })()

      // Obtener top 10 errores más comunes
      const topErrors = questionsArray.slice(0, 10)

      // Calcular estadísticas por asignatura
      const errorsBySubject = new Map<
        string,
        {
          subjectId: string
          subjectName: string
          subjectCode: string
          errorCount: number
          topicCount: number
        }
      >()

      topicsArray.forEach(topic => {
        const key = topic.subjectId
        if (!errorsBySubject.has(key)) {
          errorsBySubject.set(key, {
            subjectId: topic.subjectId,
            subjectName: topic.subjectName,
            subjectCode: topic.subjectCode,
            errorCount: 0,
            topicCount: 0,
          })
        }
        const subjectData = errorsBySubject.get(key)
        if (subjectData) {
          const safeErrorCount = Number.isFinite(topic.errorCount) && topic.errorCount >= 0 ? topic.errorCount : 0
          subjectData.errorCount += safeErrorCount
          subjectData.topicCount++
        }
      })

      // CORRECCIÓN: Validar que errorsBySubject.values() retorne un iterable válido y que errorCount sean números finitos antes de ordenar
      const subjectsArray = (() => {
        try {
          const values = Array.from(errorsBySubject.values())
          if (!Array.isArray(values)) {
            return []
          }
          return values.sort((a, b) => {
            if (!a || !b || typeof a !== 'object' || typeof b !== 'object') {
              return 0
            }
            const safeAErrorCount = Number.isFinite(a.errorCount) && a.errorCount >= 0 ? a.errorCount : 0
            const safeBErrorCount = Number.isFinite(b.errorCount) && b.errorCount >= 0 ? b.errorCount : 0
            const diff = safeBErrorCount - safeAErrorCount
            return Number.isFinite(diff) ? diff : 0
          })
        } catch (error) {
          logger.warn({ error, errorsBySubject }, 'analytics/errors: Error al convertir errorsBySubject a array, retornando array vacío')
          return []
        }
      })()

      // Calcular tendencia (comparar últimos 30 días con anteriores)
      // CORRECCIÓN: Validar que new Date() y setDate() retornen valores válidos
      let thirtyDaysAgo: Date
      try {
        const tempDate = new Date()
        if (tempDate instanceof Date && !Number.isNaN(tempDate.getTime())) {
          const currentDate = tempDate.getDate()
          if (Number.isFinite(currentDate)) {
            const newDate = currentDate - 30
            if (Number.isFinite(newDate)) {
              tempDate.setDate(newDate)
              if (tempDate instanceof Date && !Number.isNaN(tempDate.getTime())) {
                thirtyDaysAgo = tempDate
              } else {
                logger.warn({ tempDate }, 'analytics/errors: setDate() resultó en fecha inválida, usando fecha actual menos 30 días')
                thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              }
            } else {
              thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            }
          } else {
            thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
          }
        } else {
          thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      } catch (error) {
        logger.warn({ error }, 'analytics/errors: Error al calcular thirtyDaysAgo, usando fecha actual menos 30 días')
        thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }

      // CORRECCIÓN: Validar que incorrectAnswers sea un array válido y que a.attempt y startedAt sean válidos antes de filtrar
      const safeIncorrectAnswers = Array.isArray(incorrectAnswers) ? incorrectAnswers : []
      const recentErrors = safeIncorrectAnswers.filter(a => {
        if (!a || typeof a !== 'object' || !a.attempt || typeof a.attempt !== 'object') {
          return false
        }
        const startedAt = a.attempt.startedAt
        if (!startedAt) return false
        try {
          const startedDate = startedAt instanceof Date ? startedAt : new Date(startedAt)
          if (!(startedDate instanceof Date) || Number.isNaN(startedDate.getTime())) {
            return false
          }
          if (!(thirtyDaysAgo instanceof Date) || Number.isNaN(thirtyDaysAgo.getTime())) {
            return false
          }
          const startedTime = startedDate.getTime()
          const thresholdTime = thirtyDaysAgo.getTime()
          if (!Number.isFinite(startedTime) || !Number.isFinite(thresholdTime)) {
            return false
          }
          return startedTime >= thresholdTime
        } catch {
          return false
        }
      }).length

      const olderErrors = safeIncorrectAnswers.filter(a => {
        if (!a || typeof a !== 'object' || !a.attempt || typeof a.attempt !== 'object') {
          return false
        }
        const startedAt = a.attempt.startedAt
        if (!startedAt) return false
        try {
          const startedDate = startedAt instanceof Date ? startedAt : new Date(startedAt)
          if (!(startedDate instanceof Date) || Number.isNaN(startedDate.getTime())) {
            return false
          }
          if (!(thirtyDaysAgo instanceof Date) || Number.isNaN(thirtyDaysAgo.getTime())) {
            return false
          }
          const startedTime = startedDate.getTime()
          const thresholdTime = thirtyDaysAgo.getTime()
          if (!Number.isFinite(startedTime) || !Number.isFinite(thresholdTime)) {
            return false
          }
          return startedTime < thresholdTime
        } catch {
          return false
        }
      }).length

      const totalAttempts = await prisma.attempt.count({
        where: {
          studentId: dbUser.student.id,
          estado: 'completado',
        },
      })

      const recentAttempts = await prisma.attempt.count({
        where: {
          studentId: dbUser.student.id,
          estado: 'completado',
          startedAt: {
            gte: thirtyDaysAgo,
          },
        },
      })

      const recentErrorRate =
        recentAttempts > 0
          ? (recentErrors / (recentAttempts * 20)) * 100 // Asumiendo ~20 preguntas por examen
          : 0

      const olderErrorRate =
        totalAttempts - recentAttempts > 0
          ? (olderErrors / ((totalAttempts - recentAttempts) * 20)) * 100
          : 0

      const trend =
        recentErrorRate < olderErrorRate
          ? 'mejorando'
          : recentErrorRate > olderErrorRate
            ? 'empeorando'
            : 'estable'

      return NextResponse.json({
        summary: {
          totalErrors: incorrectAnswers.length,
          uniqueQuestions: questionsArray.length,
          topicsAffected: topicsArray.length,
          trend,
          recentErrorRate: safeRound(recentErrorRate, 1),
          olderErrorRate: safeRound(olderErrorRate, 1),
        },
        topErrors,
        errorsByTopic: topicsArray,
        errorsBySubject: subjectsArray,
      })
    } catch (error) {
      logger.error(
        {
          type: 'analytics_errors_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener análisis de errores'
      )
      return NextResponse.json({ error: 'Error al obtener análisis de errores' }, { status: 500 })
    }
  })
}
