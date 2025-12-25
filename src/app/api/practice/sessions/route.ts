import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'

export const runtime = 'nodejs'

const createSessionSchema = z.object({
  topicId: z.string().min(1),
  answers: z.array(
    z.object({
      questionId: z.string(),
      optionSelectedId: z.string().optional(),
      omitida: z.boolean().optional(),
      tiempoSegundos: z.number().optional(),
    })
  ),
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const body = await request.json()
      const validation = createSessionSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { topicId, answers } = validation.data

      // Verificar que el tema existe
      const topic = await prisma.topic.findUnique({
        where: { id: topicId },
      })

      if (!topic) {
        return NextResponse.json({ error: 'Tema no encontrado' }, { status: 404 })
      }

      // Calcular estadísticas
      let correctas = 0
      let incorrectas = 0
      let omitidas = 0
      const totalPreguntas = answers.length

      // Obtener todas las preguntas y sus respuestas correctas
      const questionIds = answers.map(a => a.questionId)
      const questions = await prisma.question.findMany({
        where: { id: { in: questionIds } },
        include: {
          options: {
            where: { esCorrecta: true },
          },
        },
      })

      const correctAnswersMap = new Map(questions.map(q => [q.id, q.options[0]?.id]))

      // Procesar respuestas
      const practiceAnswers = answers.map(answer => {
        const correctOptionId = correctAnswersMap.get(answer.questionId)
        const isCorrect = answer.optionSelectedId === correctOptionId && !answer.omitida
        const isOmitted = answer.omitida || !answer.optionSelectedId

        if (isOmitted) {
          omitidas++
        } else if (isCorrect) {
          correctas++
        } else {
          incorrectas++
        }

        return {
          questionId: answer.questionId,
          optionSelectedId: answer.optionSelectedId || null,
          esCorrecta: isCorrect,
          omitida: isOmitted,
          tiempoSegundos: answer.tiempoSegundos || null,
        }
      })

      const porcentaje = totalPreguntas > 0 ? (correctas / totalPreguntas) * 100 : 0

      // Calcular duración total
      const duracionSegundos = answers.reduce((sum, a) => sum + (a.tiempoSegundos || 0), 0)

      // Crear sesión de práctica
      const practiceSession = await prisma.practiceSession.create({
        data: {
          studentId: dbUser.student.id,
          topicId,
          totalPreguntas,
          correctas,
          incorrectas,
          omitidas,
          porcentaje,
          duracionSegundos,
          finishedAt: new Date(),
          answers: {
            create: practiceAnswers,
          },
        },
        include: {
          topic: {
            select: {
              nombre: true,
              ejeTematico: true,
            },
          },
        },
      })

      // Actualizar métricas de rendimiento
      await updatePerformanceMetrics(dbUser.student.id, topicId, correctas, totalPreguntas)

      return NextResponse.json({
        session: practiceSession,
      })
    } catch (error) {
      logger.error(
        {
          type: 'practice_session_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al crear sesión de práctica'
      )
      return NextResponse.json({ error: 'Error al guardar sesión de práctica' }, { status: 500 })
    }
  })
}

async function updatePerformanceMetrics(
  studentId: string,
  topicId: string,
  correctas: number,
  totalPreguntas: number
) {
  try {
    const existingMetric = await prisma.performanceMetric.findUnique({
      where: {
        studentId_topicId: {
          studentId,
          topicId,
        },
      },
    })

    const newCorrectas = (existingMetric?.correctas || 0) + correctas
    const newTotal = (existingMetric?.totalPreguntas || 0) + totalPreguntas
    const newPorcentaje = (newCorrectas / newTotal) * 100

    if (existingMetric) {
      await prisma.performanceMetric.update({
        where: { id: existingMetric.id },
        data: {
          totalPreguntas: newTotal,
          correctas: newCorrectas,
          porcentaje: newPorcentaje,
          nivel: getNivel(newPorcentaje),
          tendencia: calculateTendency(existingMetric.porcentaje, newPorcentaje),
        },
      })
    } else {
      await prisma.performanceMetric.create({
        data: {
          studentId,
          topicId,
          totalPreguntas: newTotal,
          correctas: newCorrectas,
          porcentaje: newPorcentaje,
          nivel: getNivel(newPorcentaje),
        },
      })
    }
  } catch (error) {
    logger.error(
      {
        type: 'update_metrics_error',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error al actualizar métricas'
    )
    // No fallar la creación de la sesión si falla la actualización de métricas
  }
}

function getNivel(porcentaje: number): string {
  if (porcentaje >= 80) return 'avanzado'
  if (porcentaje >= 60) return 'intermedio'
  return 'básico'
}

function calculateTendency(oldPorcentaje: number, newPorcentaje: number): string {
  const diff = newPorcentaje - oldPorcentaje
  if (diff > 5) return 'mejorando'
  if (diff < -5) return 'empeorando'
  return 'estable'
}
