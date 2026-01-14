import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const autoCreateSchema = z.object({
  fromFailedQuestions: z.boolean().optional().default(true),
  topicId: z.string().optional(),
  subjectId: z.string().optional(),
  limit: z.number().int().min(1).max(50).optional().default(10),
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = autoCreateSchema.safeParse(body)

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { fromFailedQuestions, topicId, subjectId, limit } = validation.data

      if (!fromFailedQuestions) {
        return NextResponse.json(
          { error: 'Solo se soporta creación desde preguntas falladas' },
          { status: 400 }
        )
      }

      // Obtener preguntas falladas del estudiante

      // Construir filtro para obtener preguntas falladas
      const failedAnswers = await prisma.attemptAnswer.findMany({
        where: {
          attempt: {
            studentId,
            estado: 'completado',
          },
          esCorrecta: false,
          question: {
            ...(topicId && { topicId }),
            ...(subjectId && { subjectId }),
          },
        },
        include: {
          question: {
            include: {
              subject: true,
              topic: true,
              options: {
                where: { esCorrecta: true },
                take: 1,
              },
            },
          },
        },
        take: limit * 2, // Obtener más para filtrar duplicados
        orderBy: {
          attempt: {
            finishedAt: 'desc',
          },
        },
      })

      // Agrupar por pregunta para evitar duplicados
      const questionMap = new Map<string, (typeof failedAnswers)[0]>()
      failedAnswers.forEach(answer => {
        if (!questionMap.has(answer.questionId)) {
          questionMap.set(answer.questionId, answer)
        }
      })

      const uniqueQuestions = Array.from(questionMap.values()).slice(0, limit)

      // Verificar qué preguntas ya tienen flashcards
      const existingFlashcards = await prisma.flashcard.findMany({
        where: {
          studentId,
          questionId: {
            in: uniqueQuestions.map(q => q.questionId),
          },
        },
        select: {
          questionId: true,
        },
      })

      const existingQuestionIds = new Set(
        existingFlashcards.map(f => f.questionId).filter((id): id is string => !!id)
      )

      // Filtrar preguntas que no tienen flashcard
      const questionsToCreate = uniqueQuestions.filter(q => !existingQuestionIds.has(q.questionId))

      if (questionsToCreate.length === 0) {
        return NextResponse.json({
          message: 'No hay preguntas falladas nuevas para crear flashcards',
          created: 0,
          skipped: uniqueQuestions.length,
        })
      }

      // Crear flashcards
      // CORRECCIÓN: Validar que questionsToCreate sea un array válido antes de usar Promise.all
      if (!Array.isArray(questionsToCreate)) {
        logger.warn({ questionsToCreate }, 'flashcards/auto-create: questionsToCreate no es un array válido, retornando array vacío')
        return NextResponse.json({
          message: 'No hay preguntas válidas para crear flashcards',
          created: 0,
          skipped: uniqueQuestions.length,
        })
      }
      
      const flashcardsResults = await Promise.all(
        questionsToCreate.map(async answer => {
          // CORRECCIÓN: Validar que answer y answer.question existan antes de acceder a propiedades
          if (!answer || typeof answer !== 'object' || !answer.question || typeof answer.question !== 'object') {
            logger.warn({ answer }, 'flashcards/auto-create: answer o question inválido, omitiendo')
            return null
          }
          const question = answer.question
          const correctOption = question.options && Array.isArray(question.options) && question.options.length > 0 ? question.options[0] : null

          // CORRECCIÓN: Validar que question.enunciado sea un string válido
          const safeEnunciado = typeof question.enunciado === 'string' && question.enunciado.length > 0
            ? question.enunciado
            : 'Pregunta sin enunciado'
          const front = safeEnunciado

          // CORRECCIÓN: Validar que correctOption?.texto y question.explicacion sean strings válidos
          const safeCorrectText = correctOption && typeof correctOption === 'object' && typeof correctOption.texto === 'string' && correctOption.texto.length > 0
            ? correctOption.texto
            : 'Respuesta correcta'
          const safeExplicacion = typeof question.explicacion === 'string' && question.explicacion.length > 0
            ? question.explicacion
            : ''
          const back = `${safeCorrectText}${safeExplicacion ? `\n\n${safeExplicacion}` : ''}`

          // CORRECCIÓN: Validar que question.id sea un string válido antes de crear flashcard
          const safeQuestionId = typeof question.id === 'string' && question.id.length > 0 ? question.id : null
          if (!safeQuestionId) {
            logger.warn({ question }, 'flashcards/auto-create: question.id inválido, omitiendo')
            return null
          }
          
          return prisma.flashcard.create({
            data: {
              studentId,
              questionId: safeQuestionId,
              front,
              back,
              difficulty: 2.5,
              easeFactor: 2.5,
              interval: 1,
              lastReview: new Date(),
              nextReview: new Date(), // Disponible inmediatamente
            },
            include: {
              question: {
                include: {
                  subject: {
                    select: {
                      nombre: true,
                      codigo: true,
                    },
                  },
                  topic: {
                    select: {
                      nombre: true,
                    },
                  },
                },
              },
            },
          })
        })
      )
      
      // CORRECCIÓN: Filtrar resultados nulos y validar que flashcards sea un array válido
      const flashcards = (() => {
        if (!Array.isArray(flashcardsResults)) {
          logger.warn({ flashcardsResults }, 'flashcards/auto-create: Promise.all retornó resultado inválido, retornando array vacío')
          return []
        }
        return flashcardsResults.filter(f => f !== null && f !== undefined)
      })()

      // CORRECCIÓN: Validar que flashcards sea un array válido antes de mapear
      const safeFlashcardsLength = Array.isArray(flashcards) && Number.isFinite(flashcards.length) && flashcards.length >= 0
        ? flashcards.length
        : 0
      const safeUniqueQuestionsLength = Array.isArray(uniqueQuestions) && Number.isFinite(uniqueQuestions.length) && uniqueQuestions.length >= 0
        ? uniqueQuestions.length
        : 0
      const safeQuestionsToCreateLength = Array.isArray(questionsToCreate) && Number.isFinite(questionsToCreate.length) && questionsToCreate.length >= 0
        ? questionsToCreate.length
        : 0
      const safeSkipped = safeUniqueQuestionsLength - safeQuestionsToCreateLength
      const finalSkipped = Number.isFinite(safeSkipped) && safeSkipped >= 0 ? safeSkipped : 0

      // Crear notificación de logro
      try {
        await fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'achievement',
            title: `${safeFlashcardsLength} flashcards creadas automáticamente`,
            message: `Se crearon ${safeFlashcardsLength} flashcards desde tus preguntas falladas. ¡Ahora puedes repasarlas para mejorar!`,
            relatedType: 'topic',
            actionUrl: '/flashcards',
            priority: 'normal',
          }),
        })
      } catch (notifError) {
        // No fallar si la notificación falla
        logger.error(
          {
            type: 'notification_error',
            error: notifError instanceof Error ? notifError.message : String(notifError),
          },
          'Error al crear notificación de flashcards'
        )
      }

      // CORRECCIÓN: Validar que flashcards sea un array válido antes de mapear
      const mappedFlashcards = (() => {
        if (!Array.isArray(flashcards)) {
          logger.warn({ flashcards }, 'flashcards/auto-create: flashcards no es un array válido antes de map(), retornando array vacío')
          return []
        }
        try {
          const mapped = flashcards
            .filter(f => f && typeof f === 'object' && f.id && f.front && f.questionId)
            .map(f => ({
              id: typeof f.id === 'string' ? f.id : '',
              front: typeof f.front === 'string' ? f.front : '',
              questionId: typeof f.questionId === 'string' ? f.questionId : '',
            }))
          return Array.isArray(mapped) ? mapped : []
        } catch (error) {
          logger.warn({ error, flashcards }, 'flashcards/auto-create: Error al ejecutar map() en flashcards, retornando array vacío')
          return []
        }
      })()
      
      return NextResponse.json({
        message: `Se crearon ${safeFlashcardsLength} flashcards exitosamente`,
        created: safeFlashcardsLength,
        skipped: finalSkipped,
        flashcards: mappedFlashcards,
      })
    } catch (error) {
      logger.error(
        {
          type: 'flashcards_auto_create_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al crear flashcards automáticamente'
      )
      return NextResponse.json(
        { error: 'Error al crear flashcards automáticamente' },
        { status: 500 }
      )
    }
  })
}
