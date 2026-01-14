import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { prisma } from '@/lib/prisma'
import { generateExamWithAI } from '@/lib/exam-generator'
import { z } from 'zod'
import { validateBody } from '@/lib/api-helpers'
import { logger } from '@/lib/logger'
import { isAdmin } from '@/lib/check-admin'

export const runtime = 'nodejs'

const generateExamSchema = z.object({
  subjectId: z.string().min(1, 'La asignatura es requerida'),
  topicIds: z.array(z.string()).optional(),
  numQuestions: z.number().min(5).max(80, 'El número de preguntas debe estar entre 5 y 80'),
  difficulty: z.enum(['baja', 'media', 'alta', 'mixta']).optional().default('mixta'),
  tipo: z.enum(['objetiva', 'desarrollo', 'mixta']).optional().default('objetiva'),
  includeAnswerKey: z.boolean().optional().default(true),
  titulo: z.string().optional(),
  descripcion: z.string().optional(),
  tiempoLimiteMin: z.number().optional(),
  fuente: z.string().optional(),
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    let user: Awaited<ReturnType<typeof getCurrentUser>> = null
    try {
      user = await getCurrentUser()

      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Verificar que el usuario sea admin
      const userIsAdmin = await isAdmin()
      if (!userIsAdmin) {
        logger.warn(
          {
            userId: user.id,
            email: user.email,
          },
          'Intento de generar examen sin permisos de admin'
        )
        return NextResponse.json(
          {
            error:
              'No tienes permisos para generar exámenes. Se requieren permisos de administrador.',
          },
          { status: 403 }
        )
      }

      const validation = await validateBody(request, generateExamSchema)
      if (!validation.success) {
        return validation.error
      }

      const {
        subjectId,
        topicIds,
        numQuestions,
        difficulty,
        tipo,
        includeAnswerKey,
        titulo,
        descripcion,
        tiempoLimiteMin,
        fuente,
      } = validation.data

      // Verificar que la asignatura existe
      const subject = await prisma.subject.findUnique({
        where: { id: subjectId },
      })

      if (!subject) {
        return NextResponse.json({ error: 'Asignatura no encontrada' }, { status: 404 })
      }

      // Verificar que hay temas disponibles
      const topicsCount = await prisma.topic.count({
        where: {
          subjectId,
          ...(topicIds && Array.isArray(topicIds) && topicIds.length > 0
            ? { id: { in: topicIds } }
            : {}),
        },
      })

      if (topicsCount === 0) {
        return NextResponse.json(
          { error: 'No se encontraron temas para la asignatura seleccionada' },
          { status: 404 }
        )
      }

      // Generar examen con IA
      const generatedExam = await generateExamWithAI({
        subjectId,
        topicIds,
        numQuestions,
        difficulty,
        tipo,
        userId: user.id,
        includeAnswerKey,
      })

      // Guardar examen en la base de datos
      const exam = await prisma.$transaction(async tx => {
        // Crear examen
        const newExam = await tx.exam.create({
          data: {
            subjectId,
            titulo: titulo || generatedExam.titulo,
            descripcion: descripcion || generatedExam.descripcion,
            tipo: tipo === 'objetiva' ? 'objetiva' : tipo === 'desarrollo' ? 'desarrollo' : 'mixta',
            tiempoLimiteMin: tiempoLimiteMin || (() => {
              if (Number.isFinite(numQuestions) && numQuestions > 0) {
                const multiplied = numQuestions * 1.5
                if (Number.isFinite(multiplied)) {
                  const ceiled = Math.ceil(multiplied)
                  return Number.isFinite(ceiled) && ceiled > 0 ? ceiled : 60
                }
              }
              return 60
            })(), // 1.5 min por pregunta por defecto
            // CORRECCIÓN: Validar que generatedExam.questions sea un array válido antes de acceder a length
            totalPreguntas: (() => {
              if (!generatedExam || typeof generatedExam !== 'object' || !generatedExam.questions) {
                logger.warn({ generatedExam }, 'admin/generate-exam: generatedExam.questions no existe, usando 0')
                return 0
              }
              if (!Array.isArray(generatedExam.questions)) {
                logger.warn({ generatedExam }, 'admin/generate-exam: generatedExam.questions no es un array válido, usando 0')
                return 0
              }
              const safeLength = Number.isFinite(generatedExam.questions.length) && generatedExam.questions.length >= 0
                ? generatedExam.questions.length
                : 0
              return safeLength
            })(),
            fuente: fuente || 'Generado con IA',
          },
        })

        // Crear preguntas y opciones
        // CORRECCIÓN: Validar que generatedExam.questions sea un array válido antes de iterar
        if (!generatedExam || typeof generatedExam !== 'object' || !generatedExam.questions) {
          throw new Error('generatedExam.questions no existe o es inválido')
        }
        if (!Array.isArray(generatedExam.questions)) {
          throw new Error('generatedExam.questions no es un array válido')
        }
        
        const safeQuestionsLength = Number.isFinite(generatedExam.questions.length) && generatedExam.questions.length >= 0
          ? generatedExam.questions.length
          : 0
        
        const createdQuestions = []
        for (let i = 0; i < safeQuestionsLength; i++) {
          // CORRECCIÓN: Validar que el índice sea válido antes de acceder al array
          const safeI = Number.isFinite(i) && i >= 0 && i < safeQuestionsLength ? i : 0
          const q = generatedExam.questions[safeI]
          if (!q || typeof q !== 'object') {
            logger.warn({ i: safeI, q, generatedExam }, 'admin/generate-exam: pregunta inválida en índice, omitiendo')
            continue
          }

          // Buscar o crear tema si no está asociado
          let topicId = q.topicId
          if (!topicId && q.ejeTematico) {
            // Buscar tema por eje temático
            const matchingTopic = await tx.topic.findFirst({
              where: {
                subjectId,
                ejeTematico: { contains: q.ejeTematico,  },
              },
            })
            if (matchingTopic) {
              topicId = matchingTopic.id
            } else {
              // Si no se encuentra, usar el primer tema disponible
              const firstTopic = await tx.topic.findFirst({
                where: { subjectId },
              })
              if (firstTopic) {
                topicId = firstTopic.id
              }
            }
          }

          // Determinar el tipo de pregunta individual
          // Si el examen es mixta, cada pregunta puede ser objetiva o desarrollo
          const questionType = q.opciones && q.opciones.length > 0 ? 'objetiva' : 'desarrollo'
          const finalQuestionType =
            tipo === 'mixta' ? questionType : tipo === 'objetiva' ? 'objetiva' : 'desarrollo'

          const question = await tx.question.create({
            data: {
              subjectId,
              topicId: topicId || null,
              enunciado: q.enunciado,
              dificultad: q.dificultad,
              explicacion: q.explicacion,
              fuente: fuente || 'Generado con IA',
              tipo: finalQuestionType,
              // Solo crear opciones si la pregunta es objetiva y tiene opciones
              ...(finalQuestionType === 'objetiva' && Array.isArray(q.opciones) && q.opciones.length > 0
                ? {
                    options: {
                      create: q.opciones
                        .filter(opt => opt && typeof opt === 'object' && opt.letra && opt.texto !== undefined)
                        .map(opt => ({
                          letra: typeof opt.letra === 'string' ? opt.letra : String(opt.letra || ''),
                          texto: typeof opt.texto === 'string' ? opt.texto : String(opt.texto || ''),
                          esCorrecta: typeof opt.esCorrecta === 'boolean' ? opt.esCorrecta : false,
                        })),
                    },
                  }
                : {}),
            },
          })

          createdQuestions.push(question)

          // Asociar pregunta al examen
          await tx.examQuestion.create({
            data: {
              examId: newExam.id,
              questionId: question.id,
              orden: i + 1,
            },
          })
        }

        return { exam: newExam, questions: createdQuestions }
      })

      // CORRECCIÓN: Validar que generatedExam.questions sea un array válido antes de acceder a length
      const safeQuestionsLength = (() => {
        if (!generatedExam || typeof generatedExam !== 'object' || !generatedExam.questions) {
          return 0
        }
        if (!Array.isArray(generatedExam.questions)) {
          return 0
        }
        return Number.isFinite(generatedExam.questions.length) && generatedExam.questions.length >= 0
          ? generatedExam.questions.length
          : 0
      })()
      
      logger.info(
        {
          examId: exam.exam.id,
          subjectId: exam.exam.subjectId,
          totalPreguntas: safeQuestionsLength,
          tipo,
          difficulty,
          userId: user.id,
        },
        `Examen generado exitosamente con ${safeQuestionsLength} preguntas`
      )

      return NextResponse.json({
        success: true,
        message: `Examen generado exitosamente con ${safeQuestionsLength} preguntas`,
        exam: {
          id: exam.exam.id,
          titulo: exam.exam.titulo,
          totalPreguntas: exam.exam.totalPreguntas,
          subjectId: exam.exam.subjectId,
        },
        answerKey: generatedExam.answerKey,
        questionsGenerated: safeQuestionsLength,
      })
    } catch (error) {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          userId: user?.id,
          subjectId: undefined,
        },
        'Error al generar examen'
      )

      if (error instanceof Error) {
        // Errores específicos de IA
        if (error.message.includes('No hay configuración de IA')) {
          return NextResponse.json(
            {
              error:
                'No hay configuración de IA disponible. Por favor, configura tus API keys en tu perfil.',
            },
            { status: 400 }
          )
        }

        if (error.message.includes('formato válido')) {
          return NextResponse.json(
            {
              error:
                'La IA no generó un formato válido. Intenta nuevamente o ajusta los parámetros.',
            },
            { status: 500 }
          )
        }
      }

      return NextResponse.json(
        { error: 'Error al generar examen. Intenta nuevamente.' },
        { status: 500 }
      )
    }
  })
}
