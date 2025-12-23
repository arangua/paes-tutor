import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

// Tipos para procesamiento de respuestas
type AnswerWithTime = {
  tiempoSegundos: number | null
  esCorrecta: boolean | null
  question: {
    subject: { id: string; nombre: string; codigo: string }
    topic: { id: string; nombre: string; ejeTematico: string } | null
    dificultad: number
  }
}

type TimeStats = {
  totalTime: number
  count: number
  correctTime: number
  correctCount: number
  incorrectTime: number
  incorrectCount: number
}

// Helper para procesar respuestas y actualizar estadísticas
function processAnswerTime(
  answer: AnswerWithTime,
  timeBySubject: Map<
    string,
    TimeStats & { subjectId: string; subjectName: string; subjectCode: string }
  >,
  timeByTopic: Map<
    string,
    TimeStats & {
      topicId: string
      topicName: string
      ejeTematico: string
      subjectName: string
      subjectCode: string
    }
  >,
  timeByDifficulty: Map<number, TimeStats & { difficulty: number }>
) {
  if (!answer.tiempoSegundos) return

  const subject = answer.question.subject
  const topic = answer.question.topic
  const difficulty = answer.question.dificultad

  // Procesar por asignatura
  const subjectKey = subject.id
  if (!timeBySubject.has(subjectKey)) {
    timeBySubject.set(subjectKey, {
      subjectId: subject.id,
      subjectName: subject.nombre,
      subjectCode: subject.codigo,
      totalTime: 0,
      count: 0,
      correctTime: 0,
      correctCount: 0,
      incorrectTime: 0,
      incorrectCount: 0,
    })
  }
  const subjectData = timeBySubject.get(subjectKey)!
  subjectData.totalTime += answer.tiempoSegundos
  subjectData.count++
  if (answer.esCorrecta === true) {
    subjectData.correctTime += answer.tiempoSegundos
    subjectData.correctCount++
  } else if (answer.esCorrecta === false) {
    subjectData.incorrectTime += answer.tiempoSegundos
    subjectData.incorrectCount++
  }

  // Procesar por tema
  if (topic) {
    const topicKey = topic.id
    if (!timeByTopic.has(topicKey)) {
      timeByTopic.set(topicKey, {
        topicId: topic.id,
        topicName: topic.nombre,
        ejeTematico: topic.ejeTematico,
        subjectName: subject.nombre,
        subjectCode: subject.codigo,
        totalTime: 0,
        count: 0,
        correctTime: 0,
        correctCount: 0,
        incorrectTime: 0,
        incorrectCount: 0,
      })
    }
    const topicData = timeByTopic.get(topicKey)!
    topicData.totalTime += answer.tiempoSegundos
    topicData.count++
    if (answer.esCorrecta === true) {
      topicData.correctTime += answer.tiempoSegundos
      topicData.correctCount++
    } else if (answer.esCorrecta === false) {
      topicData.incorrectTime += answer.tiempoSegundos
      topicData.incorrectCount++
    }
  }

  // Procesar por dificultad
  const difficultyKey = difficulty
  if (!timeByDifficulty.has(difficultyKey)) {
    timeByDifficulty.set(difficultyKey, {
      difficulty,
      totalTime: 0,
      count: 0,
      correctTime: 0,
      correctCount: 0,
      incorrectTime: 0,
      incorrectCount: 0,
    })
  }
  const difficultyData = timeByDifficulty.get(difficultyKey)!
  difficultyData.totalTime += answer.tiempoSegundos
  difficultyData.count++
  if (answer.esCorrecta === true) {
    difficultyData.correctTime += answer.tiempoSegundos
    difficultyData.correctCount++
  } else if (answer.esCorrecta === false) {
    difficultyData.incorrectTime += answer.tiempoSegundos
    difficultyData.incorrectCount++
  }
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()
      if (!user?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: { student: true },
      })

      if (!dbUser?.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      // Obtener respuestas de exámenes con tiempo
      const examAnswers = await prisma.attemptAnswer.findMany({
        where: {
          attempt: {
            studentId: dbUser.student.id,
            estado: 'completado',
          },
          tiempoSegundos: {
            not: null,
          },
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
                  ejeTematico: true,
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
          },
          tiempoSegundos: {
            not: null,
          },
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
                  ejeTematico: true,
                },
              },
            },
          },
        },
      })

      // Calcular estadísticas por asignatura
      const timeBySubject = new Map<
        string,
        {
          subjectId: string
          subjectName: string
          subjectCode: string
          totalTime: number
          count: number
          correctTime: number
          correctCount: number
          incorrectTime: number
          incorrectCount: number
        }
      >()

      // Calcular estadísticas por tema
      const timeByTopic = new Map<
        string,
        {
          topicId: string
          topicName: string
          ejeTematico: string
          subjectName: string
          subjectCode: string
          totalTime: number
          count: number
          correctTime: number
          correctCount: number
          incorrectTime: number
          incorrectCount: number
        }
      >()

      // Calcular estadísticas por dificultad
      const timeByDifficulty = new Map<
        number,
        {
          difficulty: number
          totalTime: number
          count: number
          correctTime: number
          correctCount: number
          incorrectTime: number
          incorrectCount: number
        }
      >()

      // Procesar todas las respuestas usando la función helper
      const allAnswers = [...examAnswers, ...practiceAnswers]
      allAnswers.forEach(answer => {
        processAnswerTime(answer as AnswerWithTime, timeBySubject, timeByTopic, timeByDifficulty)
      })

      // Calcular estadísticas por tipo (examen vs práctica)
      let examTotalTime = 0
      let examCount = 0
      let practiceTotalTime = 0
      let practiceCount = 0

      examAnswers.forEach(answer => {
        if (answer.tiempoSegundos) {
          examTotalTime += answer.tiempoSegundos
          examCount++
        }
      })

      practiceAnswers.forEach(answer => {
        if (answer.tiempoSegundos) {
          practiceTotalTime += answer.tiempoSegundos
          practiceCount++
        }
      })

      // Convertir a arrays y calcular promedios
      const subjectStats = Array.from(timeBySubject.values())
        .map(data => ({
          ...data,
          averageTime: data.count > 0 ? data.totalTime / data.count : 0,
          averageCorrectTime: data.correctCount > 0 ? data.correctTime / data.correctCount : 0,
          averageIncorrectTime:
            data.incorrectCount > 0 ? data.incorrectTime / data.incorrectCount : 0,
        }))
        .sort((a, b) => b.averageTime - a.averageTime)

      const topicStats = Array.from(timeByTopic.values())
        .map(data => ({
          ...data,
          averageTime: data.count > 0 ? data.totalTime / data.count : 0,
          averageCorrectTime: data.correctCount > 0 ? data.correctTime / data.correctCount : 0,
          averageIncorrectTime:
            data.incorrectCount > 0 ? data.incorrectTime / data.incorrectCount : 0,
        }))
        .sort((a, b) => b.averageTime - a.averageTime)

      const difficultyStats = Array.from(timeByDifficulty.values())
        .sort((a, b) => a.difficulty - b.difficulty)
        .map(data => ({
          ...data,
          averageTime: data.count > 0 ? data.totalTime / data.count : 0,
          averageCorrectTime: data.correctCount > 0 ? data.correctTime / data.correctCount : 0,
          averageIncorrectTime:
            data.incorrectCount > 0 ? data.incorrectTime / data.incorrectCount : 0,
        }))

      const typeStats = {
        exam: {
          totalTime: examTotalTime,
          count: examCount,
          averageTime: examCount > 0 ? examTotalTime / examCount : 0,
        },
        practice: {
          totalTime: practiceTotalTime,
          count: practiceCount,
          averageTime: practiceCount > 0 ? practiceTotalTime / practiceCount : 0,
        },
      }

      // Calcular estadísticas generales
      const allAnswersWithTime = [
        ...examAnswers.filter(a => a.tiempoSegundos !== null),
        ...practiceAnswers.filter(a => a.tiempoSegundos !== null),
      ]
      const totalTime = allAnswersWithTime.reduce((sum, a) => {
        const time = a.tiempoSegundos
        return sum + (time !== null ? time : 0)
      }, 0)
      const totalCount = allAnswersWithTime.length
      const overallAverage = totalCount > 0 ? totalTime / totalCount : 0

      return NextResponse.json({
        overall: {
          totalTime,
          totalCount,
          averageTime: overallAverage,
        },
        bySubject: subjectStats,
        byTopic: topicStats,
        byDifficulty: difficultyStats,
        byType: typeStats,
      })
    } catch (error) {
      logger.error({ error, context: 'analytics/time' }, 'Error al calcular estadísticas de tiempo')
      return NextResponse.json(
        { error: 'Error al calcular estadísticas de tiempo' },
        { status: 500 }
      )
    }
  })
}
