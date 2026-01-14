import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, validateBody, handleApiError } from '@/lib/api-helpers'
import { attemptQuerySchema, createAttemptSchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest, logger } from '@/lib/logger'
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache'
import {
  LIMIT_CONSTANTS,
  TIME_CONSTANTS,
  HTTP_STATUS,
} from '@/lib/constants'
import { circuitBreakers } from '@/app/api/notes/versions/circuit-breaker'

// Constantes de validación y caché
const MAX_OFFSET = LIMIT_CONSTANTS.MAX_OFFSET
const ATTEMPTS_CACHE_TTL_MS = TIME_CONSTANTS.ATTEMPTS_CACHE_TTL_MS
const NEW_ATTEMPT_THRESHOLD_MS = TIME_CONSTANTS.NEW_ATTEMPT_THRESHOLD_MS
const HTTP_CREATED = HTTP_STATUS.CREATED
const HTTP_OK = HTTP_STATUS.OK

// Especificar Node.js runtime
export const runtime = 'nodejs'

/**
 * Tipos TypeScript para respuestas de la API
 */
interface AttemptsResponse {
  attempts: Array<{
    id: string
    estado: string
    porcentaje: number | null
    correctas: number
    totalPreguntas: number
    puntajePaes: number | null
    createdAt: Date
    exam: {
      id: string
      titulo: string
      subject: {
        id: string
        nombre: string
        codigo: string
      }
    }
  }>
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

interface CreateAttemptParams {
  examId: string
  proceso?: string | null
  tipoAplicacion?: string | null
  forma?: string | null
}

/**
 * GET /api/attempts
 * 
 * Obtiene la lista de intentos de examen del estudiante autenticado.
 * 
 * @param request - Request de Next.js con query parameters opcionales
 * @returns Lista paginada de intentos con información del examen
 * 
 * @example
 * ```typescript
 * // Obtener primeros 10 intentos
 * GET /api/attempts?limit=10&offset=0
 * 
 * // Obtener siguientes 10 intentos
 * GET /api/attempts?limit=10&offset=10
 * ```
 * 
 * @throws {401} Si el usuario no está autenticado
 * @throws {404} Si el estudiante no existe
 * @throws {400} Si los parámetros de query son inválidos
 * 
 * @remarks
 * - Usa caché para optimizar queries frecuentes
 * - Valida límites de offset para prevenir queries costosas
 * - Retorna datos optimizados usando `select` en lugar de `include`
 */
export async function GET(request: NextRequest): Promise<NextResponse<AttemptsResponse | { error: string }>> {
  return withRateLimit(request, async () => {
    const startTime = Date.now()
    try {
      logApiRequest('GET', '/api/attempts')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        logger.warn({ path: '/api/attempts' }, 'Intento de acceso no autorizado a intentos')
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const student = await prisma.student.findUnique({
        where: { id: studentId },
      })

      if (!student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      // Validar query parameters
      const validation = validateQuery(request, attemptQuerySchema)
      if (!validation.success) {
        return validation.error
      }

      const { limit, offset } = validation.data

      // Validar límites razonables para prevenir queries costosas
      if (offset > MAX_OFFSET) {
        return NextResponse.json(
          {
            error: 'Offset demasiado grande',
            details: `El offset máximo permitido es ${MAX_OFFSET}. Use paginación más pequeña.`,
          },
          { status: 400 }
        )
      }

      // ✅ Enterprise: Usar caché con circuit breaker para prevenir cascading failures
      const cacheKey = cacheKeys.studentAttempts(studentId, limit, offset)
      const attempts = await circuitBreakers.cache.execute(
        async () => {
          return await getCached(
            cacheKey,
            async () => {
              // ✅ Enterprise: Usar circuit breaker para operaciones de base de datos
              return await circuitBreakers.database.execute(
                async () => {
                  // Optimizar query usando select en lugar de include
                  return await prisma.attempt.findMany({
                    where: { studentId },
                    select: {
                      id: true,
                      estado: true,
                      porcentaje: true,
                      correctas: true,
                      totalPreguntas: true,
                      puntajePaes: true,
                      createdAt: true,
                      exam: {
                        select: {
                          id: true,
                          titulo: true,
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
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: offset,
                  })
                },
                async () => {
                  // Fallback: retornar array vacío si falla la base de datos
                  logger.warn(
                    { studentId, limit, offset },
                    'Circuit breaker activado para findMany, retornando array vacío'
                  )
                  return []
                }
              )
            },
            ATTEMPTS_CACHE_TTL_MS
          )
        },
        async () => {
          // Fallback: obtener directamente de DB si falla el caché
          return await circuitBreakers.database.execute(
            async () => {
              return await prisma.attempt.findMany({
                where: { studentId },
                select: {
                  id: true,
                  estado: true,
                  porcentaje: true,
                  correctas: true,
                  totalPreguntas: true,
                  puntajePaes: true,
                  createdAt: true,
                  exam: {
                    select: {
                      id: true,
                      titulo: true,
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
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip: offset,
              })
            },
            async () => []
          )
        }
      )

      // ✅ Enterprise: Obtener total con circuit breaker
      const total = await circuitBreakers.database.execute(
        async () => {
          return await getCached(
            `${cacheKey}:total`,
            async () => {
              return await prisma.attempt.count({
                where: { studentId },
              })
            },
            ATTEMPTS_CACHE_TTL_MS
          )
        },
        async () => {
          // Fallback: retornar 0 si falla
          logger.warn({ studentId }, 'Circuit breaker activado para count, retornando 0')
          return 0
        }
      )

      const duration = Date.now() - startTime
      logger.info(
        {
          studentId,
          limit,
          offset,
          total,
          duration,
          operation: 'getAttempts',
        },
        'Intentos obtenidos exitosamente'
      )

      return NextResponse.json({
        attempts,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
      })
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          duration,
          path: '/api/attempts',
        },
        'Error al obtener intentos'
      )
      return handleApiError(error, 'Error al obtener intentos', {
        path: '/api/attempts',
      })
    }
  })
}

/**
 * POST /api/attempts
 * 
 * Crea un nuevo intento de examen o retorna un intento existente en progreso.
 * 
 * @param request - Request de Next.js con body conteniendo examId y opcionalmente proceso, tipoAplicacion, forma
 * @returns Intento creado o existente con examen completo y preguntas ordenadas
 * 
 * @example
 * ```typescript
 * POST /api/attempts
 * Body: {
 *   examId: 'c123456789012345678901234',
 *   proceso: '2024',
 *   tipoAplicacion: 'regular',
 *   forma: 'A'
 * }
 * ```
 * 
 * @throws {401} Si el usuario no está autenticado
 * @throws {404} Si el estudiante o examen no existen
 * @throws {400} Si los datos del body son inválidos
 * 
 * @remarks
 * - Usa transacciones atómicas para prevenir race conditions
 * - Reutiliza intentos en progreso existentes (evita duplicados)
 * - Invalida caché después de crear nuevo intento
 * - Retorna HTTP 201 para nuevo intento, HTTP 200 para existente
 * - Usa isolation level 'Serializable' para máxima consistencia
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    const startTime = Date.now()
    try {
      logApiRequest('POST', '/api/attempts')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        logger.warn({ path: '/api/attempts' }, 'Intento de crear intento sin autenticación')
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar body
      const validation = await validateBody(request, createAttemptSchema)
      if (!validation.success) {
        return validation.error
      }

      const { examId, proceso, tipoAplicacion, forma }: CreateAttemptParams = validation.data

      // ✅ Enterprise: Verificar estudiante con circuit breaker
      const student = await circuitBreakers.database.execute(
        async () => {
          return await prisma.student.findUnique({
            where: { id: studentId },
          })
        },
        async () => {
          logger.warn({ studentId }, 'Circuit breaker activado para findStudent, retornando null')
          return null
        }
      )

      if (!student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      // ✅ Enterprise: Verificar examen con circuit breaker
      const exam = await circuitBreakers.database.execute(
        async () => {
          return await prisma.exam.findUnique({
            where: { id: examId },
            include: {
              questions: {
                include: {
                  question: true,
                },
              },
            },
          })
        },
        async () => {
          logger.warn({ examId }, 'Circuit breaker activado para findExam, retornando null')
          return null
        }
      )

      if (!exam) {
        return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
      }

      // ✅ Enterprise: Usar transacción con circuit breaker para prevenir race conditions
      // Si dos requests llegan simultáneamente, solo uno creará el intento
      const attempt = await circuitBreakers.database.execute(
        async () => {
          return await prisma.$transaction(
            async tx => {
          // Verificar si ya existe un intento en progreso (dentro de la transacción)
          const existingAttempt = await tx.attempt.findFirst({
            where: {
              studentId,
              examId,
              estado: 'en_progreso',
            },
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
            },
          })

          if (existingAttempt) {
            // Retornar el intento existente
            return existingAttempt
          }

          // Crear nuevo intento (atómico dentro de la transacción)
          return await tx.attempt.create({
            data: {
              studentId,
              examId,
              proceso: proceso || null,
              tipoAplicacion: tipoAplicacion || null,
              forma: forma || null,
              estado: 'en_progreso',
              totalPreguntas: exam.totalPreguntas,
              startedAt: new Date(),
            },
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
            },
          })
        },
            {
              isolationLevel: 'Serializable', // Máximo nivel de aislamiento para prevenir race conditions
            }
          )
        },
        async () => {
          // Fallback: retornar null si falla la transacción
          logger.error(
            { studentId, examId },
            'Circuit breaker activado para transaction, no se pudo crear intento'
          )
          throw new Error('Error al crear intento: servicio temporalmente no disponible')
        }
      )

      // Invalidar caché de intentos del estudiante para que aparezca el nuevo intento
      await invalidateCachePattern(`student:${studentId}:attempts:*`)

      // Retornar el intento (existente o nuevo)
      const isNewAttempt =
        attempt.startedAt &&
        Math.abs(new Date().getTime() - new Date(attempt.startedAt).getTime()) <
          NEW_ATTEMPT_THRESHOLD_MS

      const statusCode = isNewAttempt ? HTTP_CREATED : HTTP_OK
      const duration = Date.now() - startTime

      logger.info(
        {
          attemptId: attempt.id,
          examId,
          studentId,
          isNewAttempt,
          duration,
          operation: 'createAttempt',
        },
        isNewAttempt ? 'Nuevo intento creado exitosamente' : 'Intento existente retornado'
      )

      return NextResponse.json(attempt, { status: statusCode })
    } catch (error) {
      const duration = Date.now() - startTime
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          duration,
          path: '/api/attempts',
        },
        'Error al crear intento'
      )
      return handleApiError(error, 'Error al crear intento', {
        path: '/api/attempts',
      })
    }
  })
}
