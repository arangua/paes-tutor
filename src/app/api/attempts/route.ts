import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { validateQuery, validateBody, handleApiError } from '@/lib/api-helpers'
import { attemptQuerySchema, createAttemptSchema } from '@/lib/validations'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache'
import {
  LIMIT_CONSTANTS,
  TIME_CONSTANTS,
  HTTP_STATUS,
} from '@/lib/constants'

// Constantes de validación y caché
const MAX_OFFSET = LIMIT_CONSTANTS.MAX_OFFSET
const ATTEMPTS_CACHE_TTL_MS = TIME_CONSTANTS.ATTEMPTS_CACHE_TTL_MS
const NEW_ATTEMPT_THRESHOLD_MS = TIME_CONSTANTS.NEW_ATTEMPT_THRESHOLD_MS
const HTTP_CREATED = HTTP_STATUS.CREATED
const HTTP_OK = HTTP_STATUS.OK

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('GET', '/api/attempts')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
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

      // Usar caché para queries frecuentes
      const cacheKey = cacheKeys.studentAttempts(studentId, limit, offset)
      const attempts = await getCached(
        cacheKey,
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
        ATTEMPTS_CACHE_TTL_MS
      )

      // Obtener total para paginación
      const total = await getCached(
        `${cacheKey}:total`,
        async () => {
          return await prisma.attempt.count({
            where: { studentId },
          })
        },
        ATTEMPTS_CACHE_TTL_MS
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
      return handleApiError(error, 'Error al obtener intentos', {
        path: '/api/attempts',
      })
    }
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('POST', '/api/attempts')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar body
      const validation = await validateBody(request, createAttemptSchema)
      if (!validation.success) {
        return validation.error
      }

      const { examId, proceso, tipoAplicacion, forma } = validation.data

      // Verificar que el estudiante existe
      const student = await prisma.student.findUnique({
        where: { id: studentId },
      })

      if (!student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      // Verificar que el examen existe y obtener información
      const exam = await prisma.exam.findUnique({
        where: { id: examId },
        include: {
          questions: {
            include: {
              question: true,
            },
          },
        },
      })

      if (!exam) {
        return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
      }

      // Usar transacción para prevenir race condition en creación de intentos
      // Si dos requests llegan simultáneamente, solo uno creará el intento
      const attempt = await prisma.$transaction(
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

      // Invalidar caché de intentos del estudiante para que aparezca el nuevo intento
      await invalidateCachePattern(`student:${studentId}:attempts:*`)

      // Retornar el intento (existente o nuevo)
      const statusCode =
        attempt.startedAt &&
        Math.abs(new Date().getTime() - new Date(attempt.startedAt).getTime()) <
          NEW_ATTEMPT_THRESHOLD_MS
          ? HTTP_CREATED // Nuevo intento (creado hace menos de 1 segundo)
          : HTTP_OK // Intento existente

      return NextResponse.json(attempt, { status: statusCode })
    } catch (error) {
      return handleApiError(error, 'Error al crear intento', {
        path: '/api/attempts',
      })
    }
  })
}
