import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

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
        if (topic) {
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
          const topicData = errorsByTopic.get(key)!
          topicData.errorCount++

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
            subjectName: subject.nombre,
            errorCount: 0,
          })
        }
        const questionData = errorsByQuestion.get(questionKey)!
        questionData.errorCount++
      })

      // Convertir a arrays y ordenar
      const topicsArray = Array.from(errorsByTopic.values())
        .map(topic => ({
          ...topic,
          questions: topic.questions.sort((a, b) => b.vecesFallada - a.vecesFallada),
        }))
        .sort((a, b) => b.errorCount - a.errorCount)

      const questionsArray = Array.from(errorsByQuestion.values()).sort(
        (a, b) => b.errorCount - a.errorCount
      )

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
        const subjectData = errorsBySubject.get(key)!
        subjectData.errorCount += topic.errorCount
        subjectData.topicCount++
      })

      const subjectsArray = Array.from(errorsBySubject.values()).sort(
        (a, b) => b.errorCount - a.errorCount
      )

      // Calcular tendencia (comparar últimos 30 días con anteriores)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const recentErrors = incorrectAnswers.filter(a => a.attempt.startedAt >= thirtyDaysAgo).length

      const olderErrors = incorrectAnswers.filter(a => a.attempt.startedAt < thirtyDaysAgo).length

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
          recentErrorRate: Math.round(recentErrorRate * 10) / 10,
          olderErrorRate: Math.round(olderErrorRate * 10) / 10,
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
