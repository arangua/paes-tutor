import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateBody, handleApiError } from '@/lib/api-helpers'
import { updateAttemptSchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { invalidateCachePattern } from '@/lib/cache'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      logApiRequest('GET', `/api/attempts/${id}`)

      // Validar formato del ID (cuid)
      if (!id || !/^c[a-z0-9]{24}$/.test(id)) {
        return NextResponse.json({ error: 'ID de intento inválido' }, { status: 400 })
      }

      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Obtener intento con todas las relaciones
      const attempt = await prisma.attempt.findUnique({
        where: { id },
        include: {
          exam: {
            include: {
              subject: true,
              questions: {
                include: {
                  question: {
                    include: {
                      options: true,
                    },
                  },
                },
                orderBy: {
                  orden: 'asc',
                },
              },
            },
          },
          answers: {
            include: {
              question: {
                include: {
                  options: true,
                  topic: true,
                },
              },
              optionSelected: true,
            },
          },
        },
      })

      if (!attempt) {
        return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
      }

      if (attempt.studentId !== studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      return NextResponse.json(attempt)
    } catch (error) {
      return handleApiError(error, 'Error al obtener intento', {
        path: `/api/attempts/${await params.then(p => p.id)}`,
      })
    }
  })
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      logApiRequest('PUT', `/api/attempts/${id}`)

      // Validar formato del ID (cuid)
      if (!id || !/^c[a-z0-9]{24}$/.test(id)) {
        return NextResponse.json({ error: 'ID de intento inválido' }, { status: 400 })
      }

      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar body
      const validation = await validateBody(request, updateAttemptSchema)
      if (!validation.success) {
        return validation.error
      }

      const { answers, estado } = validation.data

      // Verificar que el intento existe y pertenece al estudiante
      const attempt = await prisma.attempt.findUnique({
        where: { id },
        include: {
          exam: {
            include: {
              questions: {
                include: {
                  question: {
                    include: {
                      options: true,
                    },
                  },
                },
              },
            },
          },
        },
      })

      if (!attempt) {
        return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
      }

      if (attempt.studentId !== studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      if (attempt.estado === 'completado') {
        return NextResponse.json({ error: 'El intento ya está completado' }, { status: 400 })
      }

      // Actualizar respuestas si se proporcionan
      if (answers && answers.length > 0) {
        // VALIDACIÓN 1: Verificar que no haya respuestas duplicadas para la misma pregunta
        const questionIds = new Set<string>()
        const duplicates: string[] = []

        for (const answer of answers) {
          if (questionIds.has(answer.questionId)) {
            duplicates.push(answer.questionId)
          }
          questionIds.add(answer.questionId)
        }

        if (duplicates.length > 0) {
          return NextResponse.json(
            {
              error: 'Respuestas duplicadas detectadas',
              details: `Las siguientes preguntas tienen múltiples respuestas: ${[...new Set(duplicates)].join(', ')}`,
            },
            { status: 400 }
          )
        }

        // VALIDACIÓN 2: Verificar que el número de respuestas no exceda el total de preguntas
        if (answers.length > attempt.totalPreguntas) {
          return NextResponse.json(
            {
              error: 'Número de respuestas excede el total de preguntas',
              details: `Se enviaron ${answers.length} respuestas, pero el examen tiene ${attempt.totalPreguntas} preguntas`,
            },
            { status: 400 }
          )
        }

        // VALIDACIÓN 3: Verificar que todas las preguntas pertenezcan al examen
        const validQuestionIds = new Set(attempt.exam.questions.map(eq => eq.questionId))
        const invalidQuestionIds: string[] = []

        for (const answer of answers) {
          if (!validQuestionIds.has(answer.questionId)) {
            invalidQuestionIds.push(answer.questionId)
          }
        }

        if (invalidQuestionIds.length > 0) {
          return NextResponse.json(
            {
              error: 'Preguntas inválidas detectadas',
              details: `Las siguientes preguntas no pertenecen a este examen: ${invalidQuestionIds.join(', ')}`,
            },
            { status: 400 }
          )
        }

        // VALIDACIÓN 4: Verificar que las opciones pertenezcan a sus preguntas
        const invalidOptions: Array<{ questionId: string; optionId: string }> = []

        for (const answer of answers) {
          if (answer.optionSelectedId) {
            const examQuestion = attempt.exam.questions.find(
              eq => eq.questionId === answer.questionId
            )

            if (examQuestion) {
              const optionExists = examQuestion.question.options.some(
                opt => opt.id === answer.optionSelectedId
              )

              if (!optionExists) {
                invalidOptions.push({
                  questionId: answer.questionId,
                  optionId: answer.optionSelectedId,
                })
              }
            }
          }
        }

        if (invalidOptions.length > 0) {
          return NextResponse.json(
            {
              error: 'Opciones inválidas detectadas',
              details: `Las siguientes opciones no pertenecen a sus preguntas: ${invalidOptions.map(io => `Pregunta ${io.questionId} -> Opción ${io.optionId}`).join(', ')}`,
            },
            { status: 400 }
          )
        }

        // Eliminar respuestas existentes para este intento
        await prisma.attemptAnswer.deleteMany({
          where: { attemptId: id },
        })

        // Crear nuevas respuestas (ya validadas)
        const answersToCreate = answers.map(answer => {
          const examQuestion = attempt.exam.questions.find(
            eq => eq.questionId === answer.questionId
          )!

          const question = examQuestion.question
          const optionSelected = answer.optionSelectedId
            ? question.options.find(opt => opt.id === answer.optionSelectedId)
            : null

          const esCorrecta = optionSelected ? optionSelected.esCorrecta : false

          return {
            attemptId: id,
            questionId: answer.questionId,
            optionSelectedId: answer.optionSelectedId || null,
            esCorrecta: answer.omitida ? false : esCorrecta,
            omitida: answer.omitida || false,
          }
        })

        await prisma.attemptAnswer.createMany({
          data: answersToCreate,
        })
      }

      // Actualizar estado si se proporciona
      const updateData: {
        estado?: 'en_progreso' | 'completado' | 'cancelado'
        finishedAt?: Date
        duracionSegundos?: number
        correctas?: number
        incorrectas?: number
        omitidas?: number
        porcentaje?: number
      } = {}

      if (estado) {
        // VALIDACIÓN: Verificar que la transición de estado sea válida
        const validTransitions: Record<string, string[]> = {
          en_progreso: ['completado', 'cancelado'],
          completado: [], // No se puede cambiar de completado
          cancelado: [], // No se puede cambiar de cancelado
        }

        const allowedStates = validTransitions[attempt.estado] || []
        if (!allowedStates.includes(estado)) {
          return NextResponse.json(
            {
              error: 'Transición de estado inválida',
              details: `No se puede cambiar de '${attempt.estado}' a '${estado}'. Transiciones permitidas: ${allowedStates.length > 0 ? allowedStates.join(', ') : 'ninguna'}`,
            },
            { status: 400 }
          )
        }

        updateData.estado = estado
        if (estado === 'completado') {
          updateData.finishedAt = new Date()
          // Calcular duración si startedAt existe
          if (attempt.startedAt) {
            const duracionSegundos = Math.floor(
              (new Date().getTime() - attempt.startedAt.getTime()) / 1000
            )
            // Validar que la duración sea razonable (no negativa y no exceda 24 horas)
            if (duracionSegundos < 0) {
              // Log warning pero continuar (podría ser un problema de sincronización de tiempo)
              logger.warn(
                {
                  type: 'attempt_validation',
                  attemptId: id,
                  duracionSegundos,
                  path: '/api/attempts/[id]',
                },
                `Duración negativa detectada para intento ${id}: ${duracionSegundos} segundos`
              )
            }
            const MAX_DURATION = 24 * 60 * 60 // 24 horas en segundos
            if (duracionSegundos > MAX_DURATION) {
              return NextResponse.json(
                {
                  error: 'Duración inválida',
                  details: `La duración del examen (${Math.floor(duracionSegundos / 60)} minutos) excede el límite máximo de 24 horas`,
                },
                { status: 400 }
              )
            }
            updateData.duracionSegundos = duracionSegundos
          }
        }
      }

      // Recalcular estadísticas si hay respuestas
      if (answers && answers.length > 0) {
        const attemptWithAnswers = await prisma.attempt.findUnique({
          where: { id },
          include: {
            answers: true,
          },
        })

        if (attemptWithAnswers) {
          const correctas = attemptWithAnswers.answers.filter(a => a.esCorrecta === true).length
          const incorrectas = attemptWithAnswers.answers.filter(
            a => a.esCorrecta === false && !a.omitida
          ).length
          const omitidas = attemptWithAnswers.answers.filter(a => a.omitida === true).length
          const total = attemptWithAnswers.totalPreguntas || 0
          const porcentaje = total > 0 ? (correctas / total) * 100 : 0

          updateData.correctas = correctas
          updateData.incorrectas = incorrectas
          updateData.omitidas = omitidas
          updateData.porcentaje = porcentaje
        }
      }

      // Actualizar el intento
      const updatedAttempt = await prisma.attempt.update({
        where: { id },
        data: updateData,
        include: {
          exam: {
            include: {
              subject: true,
            },
          },
          answers: {
            include: {
              question: {
                include: {
                  options: true,
                },
              },
              optionSelected: true,
            },
          },
        },
      })

      // Invalidar caché de intentos del estudiante para reflejar cambios
      await invalidateCachePattern(`student:${studentId}:attempts:*`)

      return NextResponse.json(updatedAttempt)
    } catch (error) {
      return handleApiError(error, 'Error al actualizar intento', {
        path: `/api/attempts/${await params.then(p => p.id)}`,
      })
    }
  })
}
