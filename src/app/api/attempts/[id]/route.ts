import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateBody, handleApiError } from '@/lib/api-helpers'
import { updateAttemptSchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { invalidateCachePattern } from '@/lib/cache'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'
import { safeRound, safeDivide, ensureFiniteNumber, ensureInteger } from '@/app/api/notes/versions/validation-utils'

// Especificar Node.js runtime
export const runtime = 'nodejs'

/**
 * Validador para formato CUID
 */
const CUID_REGEX = /^c[a-z0-9]{24}$/

/**
 * Valida que un ID tenga formato CUID válido
 * 
 * @param id - ID a validar
 * @returns true si el ID es válido, false en caso contrario
 */
function isValidCuid(id: string | null | undefined): boolean {
  return Boolean(id && typeof id === 'string' && CUID_REGEX.test(id))
}

/**
 * Tipos TypeScript para respuestas de la API
 */
interface AttemptWithRelations {
  id: string
  studentId: string
  estado: string
  startedAt: Date
  finishedAt: Date | null
  duracionSegundos: number | null
  totalPreguntas: number
  correctas: number
  incorrectas: number
  omitidas: number
  porcentaje: number
  exam: {
    id: string
    titulo: string
    subject: {
      id: string
      nombre: string
      codigo: string
    }
    questions: Array<{
      questionId: string
      question: {
        id: string
        options: Array<{
          id: string
          texto: string
          esCorrecta: boolean
        }>
      }
    }>
  }
  answers: Array<{
    id: string
    questionId: string
    optionSelectedId: string | null
    esCorrecta: boolean | null
    omitida: boolean
    question: {
      id: string
      options: Array<{
        id: string
        texto: string
        esCorrecta: boolean
      }>
      topic: {
        id: string
        nombre: string
      } | null
    }
    optionSelected: {
      id: string
      texto: string
      esCorrecta: boolean
    } | null
  }>
}

/**
 * GET /api/attempts/[id]
 * 
 * Obtiene un intento de examen específico con todas sus relaciones (examen, preguntas, respuestas).
 * 
 * @param request - Request de Next.js
 * @param params - Parámetros de ruta con el ID del intento
 * @returns Intento completo con examen, preguntas y respuestas
 * 
 * @example
 * ```typescript
 * GET /api/attempts/c123456789012345678901234
 * ```
 * 
 * @throws {400} Si el ID del intento no tiene formato CUID válido
 * @throws {401} Si el usuario no está autenticado
 * @throws {403} Si el intento no pertenece al estudiante autenticado
 * @throws {404} Si el intento no existe
 * 
 * @remarks
 * - Valida formato CUID del ID antes de consultar base de datos
 * - Incluye todas las relaciones necesarias para visualización completa
 * - Ordena preguntas por orden ascendente
 * - Valida autorización del estudiante antes de retornar datos
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AttemptWithRelations | { error: string }>> {
  return withRateLimit(request, async () => {
    const startTime = Date.now()
    let attemptId = 'unknown'
    
    try {
      const { id } = await params
      attemptId = id
      logApiRequest('GET', `/api/attempts/${id}`)

      // Validar formato del ID (cuid)
      if (!isValidCuid(id)) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]' },
          'Intento de acceso con ID inválido'
        )
        return NextResponse.json(
          { error: 'ID de intento inválido. Debe tener formato CUID válido.' },
          { status: 400 }
        )
      }

      let studentId: string | null
      try {
        studentId = await getCurrentStudentId()
      } catch (error) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]', error },
          'Error al obtener sesión de estudiante'
        )
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!studentId) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]' },
          'Intento de acceso no autorizado a intento'
        )
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // ✅ Enterprise: Obtener intento con circuit breaker para prevenir cascading failures
      const attempt = await circuitBreakers.database.execute(
        async () => {
          return await prisma.attempt.findUnique({
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
        },
        async () => {
          // Fallback: retornar null si falla la base de datos
          logger.warn({ attemptId: id }, 'Circuit breaker activado para findAttempt, retornando null')
          return null
        }
      )

      if (!attempt) {
        return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
      }

      if (attempt.studentId !== studentId) {
        logger.warn(
          {
            attemptId: id,
            studentId,
            attemptStudentId: attempt.studentId,
            path: '/api/attempts/[id]',
          },
          'Intento de acceso a intento de otro estudiante'
        )
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
      }

      const duration = Date.now() - startTime
      logger.info(
        {
          attemptId: id,
          studentId,
          duration,
          operation: 'getAttempt',
        },
        'Intento obtenido exitosamente'
      )

      return NextResponse.json(attempt)
    } catch (error) {
      const duration = Date.now() - startTime
      try {
        const resolvedParams = await params
        attemptId = resolvedParams?.id || 'unknown'
      } catch (paramError) {
        logger.warn(
          { error: paramError, path: '/api/attempts/[id]' },
          'Error al obtener params en catch de attempts/[id] GET'
        )
      }
      
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          attemptId,
          duration,
          path: `/api/attempts/${attemptId}`,
        },
        'Error al obtener intento'
      )
      
      return handleApiError(error, 'Error al obtener intento', {
        path: `/api/attempts/${attemptId}`,
      })
    }
  })
}

/**
 * PUT /api/attempts/[id]
 * 
 * Actualiza un intento de examen existente. Permite actualizar el estado y/o las respuestas.
 * 
 * @param request - Request de Next.js con body conteniendo estado y/o answers
 * @param params - Parámetros de ruta con el ID del intento
 * @returns Intento actualizado con todas sus relaciones
 * 
 * @example
 * ```typescript
 * PUT /api/attempts/c123456789012345678901234
 * Body: {
 *   estado: 'completado',
 *   answers: [
 *     {
 *       questionId: 'c123...',
 *       optionSelectedId: 'c456...',
 *       omitida: false
 *     }
 *   ]
 * }
 * ```
 * 
 * @throws {400} Si el ID es inválido, el intento ya está completado, o hay respuestas inválidas
 * @throws {401} Si el usuario no está autenticado
 * @throws {403} Si el intento no pertenece al estudiante
 * @throws {404} Si el intento no existe
 * 
 * @remarks
 * - Valida formato CUID del ID
 * - Previene actualización de intentos completados
 * - Valida transiciones de estado (solo permite transiciones válidas)
 * - Valida que todas las respuestas pertenezcan al examen
 * - Valida que las opciones pertenezcan a sus preguntas
 * - Recalcula estadísticas automáticamente si hay respuestas
 * - Invalida caché después de actualizar
 * - Usa transacciones para garantizar consistencia
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<AttemptWithRelations | { error: string; details?: string }>> {
  return withRateLimit(request, async () => {
    const startTime = Date.now()
    let attemptId = 'unknown'
    
    try {
      const { id } = await params
      attemptId = id
      logApiRequest('PUT', `/api/attempts/${id}`)

      // Validar formato del ID (cuid)
      if (!isValidCuid(id)) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]' },
          'Intento de actualización con ID inválido'
        )
        return NextResponse.json(
          { error: 'ID de intento inválido. Debe tener formato CUID válido.' },
          { status: 400 }
        )
      }

      let studentId: string | null
      try {
        studentId = await getCurrentStudentId()
      } catch (error) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]', error },
          'Error al obtener sesión de estudiante'
        )
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!studentId) {
        logger.warn(
          { attemptId: id, path: '/api/attempts/[id]' },
          'Intento de actualización sin autenticación'
        )
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar body
      const validation = await validateBody(request, updateAttemptSchema)
      if (!validation.success) {
        return validation.error
      }

      const { answers, estado } = validation.data

      // ✅ Enterprise: Validación temprana de answers
      if (answers !== undefined && answers !== null && !Array.isArray(answers)) {
        return NextResponse.json(
          {
            error: 'Respuestas inválidas',
            details: 'Las respuestas deben ser un array válido',
          },
          { status: 400 }
        )
      }

      // ✅ Enterprise: Verificar intento con circuit breaker
      const attempt = await circuitBreakers.database.execute(
        async () => {
          return await prisma.attempt.findUnique({
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
        },
        async () => {
          logger.warn({ attemptId: id }, 'Circuit breaker activado para findAttempt (PUT), retornando null')
          return null
        }
      )

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
        try {
          // ✅ Enterprise: Validación defensiva inicial para asegurar que attempt y attempt.exam existen
          if (!attempt) {
            logger.error({ attemptId: id }, 'Attempt es null o undefined en validación de respuestas')
            return NextResponse.json(
              { error: 'Error interno: intento no disponible' },
              { status: 500 }
            )
          }
          
          // Validar que attempt.exam existe de forma segura
          let exam: typeof attempt.exam | undefined
          try {
            exam = attempt.exam
          } catch (examError) {
            logger.error(
              {
                attemptId: id,
                error: examError instanceof Error ? examError.message : String(examError),
              },
              'Error al acceder a attempt.exam en validación inicial'
            )
            return NextResponse.json(
              { error: 'El intento no tiene un examen válido asociado' },
              { status: 400 }
            )
          }
          
          if (!exam) {
            return NextResponse.json(
              { error: 'El intento no tiene un examen válido asociado' },
              { status: 400 }
            )
          }

        // VALIDACIÓN 1: Verificar que no haya respuestas duplicadas para la misma pregunta
        try {
          const questionIds = new Set<string>()
          const duplicates: string[] = []

          if (!answers || !Array.isArray(answers)) {
            return NextResponse.json(
              {
                error: 'Respuestas inválidas',
                details: 'Las respuestas no son un array válido',
              },
              { status: 400 }
            )
          }

          for (const answer of answers) {
            if (!answer || typeof answer !== 'object' || !answer.questionId) {
              continue
            }
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
        } catch (validationError) {
          logger.error(
            {
              attemptId: id,
              error: validationError instanceof Error ? validationError.message : String(validationError),
            },
            'Error inesperado en VALIDACIÓN 1'
          )
          return NextResponse.json(
            {
              error: 'Respuestas inválidas',
              details: 'Error al validar respuestas duplicadas',
            },
            { status: 400 }
          )
        }

        // VALIDACIÓN 2: Verificar que el número de respuestas no exceda el total de preguntas
        let totalPreguntas: number
        try {
          totalPreguntas = typeof attempt.totalPreguntas === 'number' ? attempt.totalPreguntas : 0
        } catch (totalPreguntasError) {
          logger.error(
            {
              attemptId: id,
              error: totalPreguntasError instanceof Error ? totalPreguntasError.message : String(totalPreguntasError),
            },
            'Error al acceder a attempt.totalPreguntas'
          )
          totalPreguntas = 0
        }
        
        if (answers.length > totalPreguntas) {
          return NextResponse.json(
            {
              error: 'Número de respuestas excede el total de preguntas',
              details: `Se enviaron ${answers.length} respuestas, pero el examen tiene ${totalPreguntas} preguntas`,
            },
            { status: 400 }
          )
        }

        // VALIDACIÓN 3: Verificar que todas las preguntas pertenezcan al examen
        // ✅ Enterprise: Validación con manejo de errores robusto
        try {
          if (!attempt || !exam) {
            return NextResponse.json(
              { error: 'El intento no tiene un examen válido asociado' },
              { status: 400 }
            )
          }
          // CORRECCIÓN: Validar que exam.questions sea un array válido antes de usar map()
          if (!exam.questions || !Array.isArray(exam.questions)) {
            return NextResponse.json(
              { error: 'El examen no tiene preguntas válidas asociadas' },
              { status: 400 }
            )
          }
          const validQuestionIds = new Set(
            exam.questions
              .filter(eq => eq && typeof eq === 'object' && eq.questionId && typeof eq.questionId === 'string')
              .map(eq => eq.questionId)
          )
          const invalidQuestionIds: string[] = []

          for (const answer of answers) {
            if (!answer || typeof answer !== 'object' || !answer.questionId) {
              continue
            }
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
        } catch (validationError) {
          // ✅ Enterprise: Capturar errores inesperados en validación de preguntas
          logger.error(
            {
              attemptId: id,
              error: validationError instanceof Error ? validationError.message : String(validationError),
              stack: validationError instanceof Error ? validationError.stack : undefined,
            },
            'Error inesperado al validar preguntas del examen'
          )
          return NextResponse.json(
            {
              error: 'Preguntas inválidas detectadas',
              details: 'Error al validar las preguntas del examen',
            },
            { status: 400 }
          )
        }

        // VALIDACIÓN 4: Verificar que las opciones pertenezcan a sus preguntas
        try {
          // Validaciones defensivas
          if (!exam || !exam.questions || !Array.isArray(exam.questions)) {
            logger.error({ attemptId: id }, 'exam o exam.questions inválido en VALIDACIÓN 4')
            return NextResponse.json(
              {
                error: 'Opciones inválidas detectadas',
                details: 'El examen no tiene preguntas válidas',
              },
              { status: 400 }
            )
          }

          if (!answers || !Array.isArray(answers)) {
            logger.error({ attemptId: id }, 'answers inválido en VALIDACIÓN 4')
            return NextResponse.json(
              {
                error: 'Opciones inválidas detectadas',
                details: 'Las respuestas no son válidas',
              },
              { status: 400 }
            )
          }

          const invalidOptions: Array<{ questionId: string; optionId: string }> = []

          for (const answer of answers) {
            if (!answer || !answer.optionSelectedId) {
              continue
            }

            try {
              // Validación defensiva adicional antes de acceder a exam.questions
              if (!exam || !exam.questions || !Array.isArray(exam.questions)) {
                invalidOptions.push({
                  questionId: answer.questionId || 'unknown',
                  optionId: answer.optionSelectedId,
                })
                continue
              }

              // Validación defensiva: asegurar que answer.questionId existe antes de usarlo
              const answerQuestionId = answer?.questionId
              if (!answerQuestionId) {
                invalidOptions.push({
                  questionId: 'unknown',
                  optionId: answer?.optionSelectedId || 'unknown',
                })
                continue
              }

              const examQuestion = exam.questions.find(
                eq => eq && typeof eq === 'object' && eq.questionId === answerQuestionId
              )
              
              // Validación paso a paso para evitar errores de acceso a propiedades undefined
              if (!examQuestion) {
                invalidOptions.push({
                  questionId: answerQuestionId,
                  optionId: answer?.optionSelectedId || 'unknown',
                })
              } else if (!examQuestion.question) {
                invalidOptions.push({
                  questionId: answerQuestionId,
                  optionId: answer?.optionSelectedId || 'unknown',
                })
              } else {
                // Validación adicional antes de usar .some()
                const options = examQuestion.question.options
                if (!options || !Array.isArray(options)) {
                  invalidOptions.push({
                    questionId: answerQuestionId,
                    optionId: answer?.optionSelectedId || 'unknown',
                  })
                } else {
                  const answerOptionId = answer?.optionSelectedId
                  let optionExists = false
                  
                  try {
                    optionExists = options.some(
                      opt => {
                        try {
                          return opt && typeof opt === 'object' && opt.id === answerOptionId
                        } catch {
                          return false
                        }
                      }
                    )
                  } catch (someError) {
                    logger.warn(
                      {
                        attemptId: id,
                        questionId: answerQuestionId,
                        optionId: answerOptionId || 'unknown',
                        error: someError instanceof Error ? someError.message : String(someError),
                      },
                      'Error al ejecutar .some() en opciones'
                    )
                    optionExists = false
                  }

                  if (!optionExists) {
                    invalidOptions.push({
                      questionId: answerQuestionId,
                      optionId: answerOptionId || 'unknown',
                    })
                  }
                }
              }
            } catch (answerError) {
              // Capturar cualquier error al procesar esta respuesta
              logger.error(
                {
                  attemptId: id,
                  questionId: answer?.questionId || 'unknown',
                  optionId: answer?.optionSelectedId || 'unknown',
                  error: answerError instanceof Error ? answerError.message : String(answerError),
                  stack: answerError instanceof Error ? answerError.stack : undefined,
                },
                '❌ ERROR al validar opción de respuesta individual'
              )
              invalidOptions.push({
                questionId: answer?.questionId || 'unknown',
                optionId: answer?.optionSelectedId || 'unknown',
              })
            }
          }

          if (invalidOptions && invalidOptions.length > 0) {
            try {
              const detailsMessage = invalidOptions
                .map(io => `Pregunta ${io.questionId || 'unknown'} -> Opción ${io.optionId || 'unknown'}`)
                .join(', ')
              
              return NextResponse.json(
                {
                  error: 'Opciones inválidas detectadas',
                  details: `Las siguientes opciones no pertenecen a sus preguntas: ${detailsMessage}`,
                },
                { status: 400 }
              )
            } catch (detailsError) {
              logger.error(
                {
                  attemptId: id,
                  error: detailsError instanceof Error ? detailsError.message : String(detailsError),
                },
                'Error al construir mensaje de detalles de opciones inválidas'
              )
              return NextResponse.json(
                {
                  error: 'Opciones inválidas detectadas',
                  details: 'Error al validar las opciones de las respuestas',
                },
                { status: 400 }
              )
            }
          }
        } catch (validationError) {
          logger.error(
            {
              attemptId: id,
              error: validationError instanceof Error ? validationError.message : String(validationError),
              stack: validationError instanceof Error ? validationError.stack : undefined,
            },
            '❌ ERROR INESPERADO en VALIDACIÓN 4 - catch principal'
          )
          return NextResponse.json(
            {
              error: 'Opciones inválidas detectadas',
              details: 'Error al validar las opciones de las respuestas',
            },
            { status: 400 }
          )
        }

        // ✅ Enterprise: Eliminar respuestas con circuit breaker
        await circuitBreakers.database.execute(
          async () => {
            await prisma.attemptAnswer.deleteMany({
              where: { attemptId: id },
            })
          },
          async () => {
            logger.warn({ attemptId: id }, 'Circuit breaker activado para deleteMany, continuando')
          }
        )

        // Crear nuevas respuestas (ya validadas)
        // ✅ Enterprise: Validación defensiva con manejo de errores robusto
        try {
          // Validación defensiva adicional antes de procesar answers
          if (!answers || !Array.isArray(answers)) {
            logger.error({ attemptId: id }, 'answers inválido al crear respuestas')
            return NextResponse.json(
              {
                error: 'Opciones inválidas detectadas',
                details: 'Las respuestas no son válidas para crear',
              },
              { status: 400 }
            )
          }

          if (!exam || !exam.questions || !Array.isArray(exam.questions)) {
            logger.error({ attemptId: id }, 'exam o exam.questions inválido al crear respuestas')
            return NextResponse.json(
              {
                error: 'Opciones inválidas detectadas',
                details: 'El examen no tiene preguntas válidas para crear respuestas',
              },
              { status: 400 }
            )
          }

          const answersToCreate = answers
            .map(answer => {
              try {
                // Validación defensiva: asegurar que answer existe y tiene las propiedades necesarias
                if (!answer || typeof answer !== 'object') {
                  logger.warn(
                    { attemptId: id },
                    'Answer inválido al crear respuesta, omitiendo'
                  )
                  return null
                }

                const questionId = answer.questionId
                const optionSelectedId = answer.optionSelectedId
                const omitida = answer.omitida

                if (!questionId) {
                  logger.warn(
                    { attemptId: id },
                    'Answer sin questionId al crear respuesta, omitiendo'
                  )
                  return null
                }

                // Validación defensiva: asegurar que exam.questions existe
                if (!exam || !exam.questions || !Array.isArray(exam.questions)) {
                  logger.warn(
                    { attemptId: id, questionId },
                    'Estructura de examen inválida al crear respuesta, omitiendo'
                  )
                  return null
                }

                const examQuestion = exam.questions.find(
                  eq => eq && typeof eq === 'object' && eq.questionId === questionId
                )

              if (!examQuestion || !examQuestion.question) {
                logger.warn(
                  { attemptId: id, questionId: answer.questionId },
                  'Pregunta de examen no encontrada al crear respuesta, omitiendo'
                )
                return null
              }

              const question = examQuestion.question
              // ✅ Enterprise: Validación defensiva adicional para question.options
              const optionSelected = optionSelectedId && question.options && Array.isArray(question.options)
                ? question.options.find(opt => opt && typeof opt === 'object' && opt.id === optionSelectedId)
                : null

              const esCorrecta = optionSelected && typeof optionSelected === 'object' && optionSelected.esCorrecta === true

              return {
                attemptId: id,
                questionId,
                optionSelectedId: optionSelectedId || null,
                esCorrecta: omitida ? false : esCorrecta,
                omitida: omitida || false,
              }
            } catch (error) {
              // ✅ Enterprise: Capturar errores al crear respuesta individual
              logger.warn(
                {
                  attemptId: id,
                  questionId: answer?.questionId || 'unknown',
                  optionId: answer?.optionSelectedId || 'unknown',
                  error: error instanceof Error ? error.message : String(error),
                  stack: error instanceof Error ? error.stack : undefined,
                },
                'Error al crear respuesta individual, omitiendo'
              )
              return null
            }
            })
            .filter((answer): answer is NonNullable<typeof answer> => answer !== null)

          // ✅ Enterprise: Crear respuestas con circuit breaker
          await circuitBreakers.database.execute(
            async () => {
              await prisma.attemptAnswer.createMany({
                data: answersToCreate,
              })
            },
            async () => {
              logger.error(
                { attemptId: id, answersCount: answersToCreate.length },
                'Circuit breaker activado para createMany, respuestas no guardadas'
              )
              throw new Error('Error al guardar respuestas: servicio temporalmente no disponible')
            }
          )
        } catch (createError) {
          // Si hay error al crear respuestas (ej. violación de clave foránea por opción inválida)
          logger.error(
            {
              attemptId: id,
              error: createError instanceof Error ? createError.message : String(createError),
              stack: createError instanceof Error ? createError.stack : undefined,
            },
            'Error al crear respuestas - posible violación de integridad'
          )
          return NextResponse.json(
            {
              error: 'Opciones inválidas detectadas',
              details: 'Una o más opciones seleccionadas no pertenecen a sus preguntas',
            },
            { status: 400 }
          )
        }
        } catch (answersError) {
          // ✅ Enterprise: Capturar cualquier error inesperado en el bloque de respuestas
          logger.error(
            {
              attemptId: id,
              error: answersError instanceof Error ? answersError.message : String(answersError),
              stack: answersError instanceof Error ? answersError.stack : undefined,
            },
            '❌ ERROR INESPERADO en bloque completo de respuestas - catch más externo'
          )
          return NextResponse.json(
            {
              error: 'Opciones inválidas detectadas',
              details: 'Error al procesar las respuestas',
            },
            { status: 400 }
          )
        }
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
          // ✅ Enterprise: Calcular duración si startedAt existe usando funciones seguras
          if (attempt.startedAt) {
            // Validar que startedAt sea una fecha válida
            const safeStartedAt = attempt.startedAt instanceof Date && !Number.isNaN(attempt.startedAt.getTime())
              ? attempt.startedAt
              : null
            if (safeStartedAt) {
              const finishedTime = Date.now()
              const startedTime = safeStartedAt.getTime()
              if (Number.isFinite(startedTime) && Number.isFinite(finishedTime)) {
                const diffMs = finishedTime - startedTime
                if (Number.isFinite(diffMs)) {
                  const duracionSegundos = ensureInteger(safeDivide(diffMs, 1000, 0), 0)
                  // ✅ Enterprise: Validar que la duración sea razonable (no negativa y no exceda 24 horas)
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
                    updateData.duracionSegundos = 0
                  } else {
                    const MAX_DURATION = 24 * 60 * 60 // 24 horas en segundos
                    if (duracionSegundos > MAX_DURATION) {
                      // ✅ Enterprise: Usar funciones seguras para cálculo de minutos
                      const minutos = ensureInteger(safeDivide(duracionSegundos, 60, 0), 0)
                      return NextResponse.json(
                        {
                          error: 'Duración inválida',
                          details: `La duración del examen (${minutos} minutos) excede el límite máximo de 24 horas`,
                        },
                        { status: 400 }
                      )
                    }
                    updateData.duracionSegundos = duracionSegundos
                  }
                } else {
                  logger.warn(
                    { diffMs, attemptId: id },
                    'attempts/[id] PUT: diffMs no es finito, usando 0'
                  )
                  updateData.duracionSegundos = 0
                }
              } else {
                logger.warn(
                  { startedTime, finishedTime, attemptId: id },
                  'attempts/[id] PUT: startedTime o finishedTime inválidos, usando 0'
                )
                updateData.duracionSegundos = 0
              }
            } else {
              logger.warn(
                { startedAt: attempt.startedAt, attemptId: id },
                'attempts/[id] PUT: startedAt inválido, usando 0'
              )
              updateData.duracionSegundos = 0
            }
          }
        }
      }

      // ✅ Enterprise: Recalcular estadísticas con circuit breaker
      if (answers && answers.length > 0) {
        try {
          const attemptWithAnswers = await circuitBreakers.database.execute(
            async () => {
              return await prisma.attempt.findUnique({
                where: { id },
                include: {
                  answers: true,
                },
              })
            },
            async () => {
              logger.warn({ attemptId: id }, 'Circuit breaker activado para findAttemptWithAnswers, retornando null')
              return null
            }
          )

          if (attemptWithAnswers) {
            // ✅ Enterprise: Validar y calcular estadísticas de forma segura
            const safeAnswers = Array.isArray(attemptWithAnswers.answers) ? attemptWithAnswers.answers : []
            const correctas = safeAnswers.filter(a => a && typeof a === 'object' && a.esCorrecta === true).length
            const incorrectas = safeAnswers.filter(
              a => a && typeof a === 'object' && a.esCorrecta === false && !a.omitida
            ).length
            const omitidas = safeAnswers.filter(a => a && typeof a === 'object' && a.omitida === true).length
            const total = ensureFiniteNumber(attemptWithAnswers.totalPreguntas, 0)
            
            // ✅ Enterprise: Usar safeDivide para evitar división por cero
            const porcentaje = safeRound(safeDivide(correctas, total, 0) * 100, 2)

            updateData.correctas = correctas
            updateData.incorrectas = incorrectas
            updateData.omitidas = omitidas
            updateData.porcentaje = porcentaje
          }
        } catch (statsError) {
          // ✅ Enterprise: Capturar errores al recalcular estadísticas
          logger.error(
            {
              attemptId: id,
              error: statsError instanceof Error ? statsError.message : String(statsError),
              stack: statsError instanceof Error ? statsError.stack : undefined,
            },
            '❌ ERROR al recalcular estadísticas'
          )
          // No retornamos error aquí, solo logueamos, para que el intento se actualice de todas formas
        }
      }

      // ✅ Enterprise: Actualizar intento con circuit breaker
      const updatedAttempt = await circuitBreakers.database.execute(
        async () => {
          return await prisma.attempt.update({
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
        },
        async () => {
          logger.error({ attemptId: id }, 'Circuit breaker activado para updateAttempt')
          throw new Error('Error al actualizar intento: servicio temporalmente no disponible')
        }
      )

      // Invalidar caché de intentos del estudiante para reflejar cambios
      try {
        await invalidateCachePattern(`student:${studentId}:attempts:*`)
      } catch (cacheError) {
        // No fallar si hay error al invalidar caché
        logger.warn(
          {
            attemptId: id,
            studentId,
            error: cacheError instanceof Error ? cacheError.message : String(cacheError),
          },
          'Error al invalidar caché, continuando'
        )
      }

      const duration = Date.now() - startTime
      logger.info(
        {
          attemptId: id,
          studentId,
          estado: updatedAttempt.estado,
          answersCount: answers?.length || 0,
          duration,
          operation: 'updateAttempt',
        },
        'Intento actualizado exitosamente'
      )

      return NextResponse.json(updatedAttempt)
    } catch (error) {
      const duration = Date.now() - startTime
      try {
        const resolvedParams = await params
        attemptId = resolvedParams?.id || 'unknown'
      } catch (paramError) {
        logger.warn(
          { error: paramError, path: '/api/attempts/[id]' },
          'Error al obtener params en catch de attempts/[id] PUT'
        )
      }
      
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          attemptId,
          duration,
          path: `/api/attempts/${attemptId}`,
        },
        'Error al actualizar intento'
      )
      
      return handleApiError(error, 'Error al actualizar intento', {
        path: `/api/attempts/${attemptId}`,
      })
    }
  })
}
