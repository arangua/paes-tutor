import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { cancelExpiredChallenges } from '@/lib/challenge-timeout'
import { TRANSACTION_TIMEOUT_SHORT, CHALLENGE_STATUS } from '@/lib/challenge-constants'
import { getChallengeInclude } from '@/lib/challenge-helpers'
import { z } from 'zod'

export const runtime = 'nodejs'

const createChallengeSchema = z.object({
  examId: z.cuid({ error: 'examId debe ser un CUID válido' }).optional(),
  message: z.string().max(500).optional(), // Limitar longitud del mensaje
  deadline: z.string().datetime({ message: 'Invalid datetime' }).optional(), // ISO date string validado
})

/**
 * GET: Obtener desafíos del usuario actual
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const type = searchParams.get('type') || 'all' // 'all' | 'sent' | 'received' | 'active'
      const status = searchParams.get('status') // Filtrar por estado específico

      const where: {
        OR?: Array<{ challengerId: string } | { challengedId: string }>
        challengerId?: string
        challengedId?: string
        status?: string | { in: string[] }
      } = {}

      if (type === 'sent') {
        where.challengerId = dbUser.student.id
        if (status) {
          where.status = status
        }
      } else if (type === 'received') {
        where.challengedId = dbUser.student.id
        if (status) {
          where.status = status
        }
      } else if (type === 'active') {
        where.OR = [{ challengerId: dbUser.student.id }, { challengedId: dbUser.student.id }]
        // Para 'active', siempre filtrar por pending o accepted, a menos que se especifique otro status
        if (status) {
          where.status = status
        } else {
          where.status = { in: [CHALLENGE_STATUS.PENDING, CHALLENGE_STATUS.ACCEPTED] }
        }
      } else {
        // all
        where.OR = [{ challengerId: dbUser.student.id }, { challengedId: dbUser.student.id }]
        if (status) {
          where.status = status
        }
      }

      const challenges = await prisma.challenge.findMany({
        where,
        include: {
          ...getChallengeInclude(),
          challenger: {
            select: {
              id: true,
              nombre: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
          challenged: {
            select: {
              id: true,
              nombre: true,
              user: {
                select: {
                  email: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return NextResponse.json({ challenges })
    } catch (error) {
      logger.error(
        {
          type: 'challenges_get_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener desafíos'
      )
      return NextResponse.json({ error: 'Error al obtener desafíos' }, { status: 500 })
    }
  })
}

/**
 * POST: Crear un nuevo desafío
 */
export async function POST(request: NextRequest) {
  // Usar rate limit más estricto para crear desafíos (5 por hora)
  return withRateLimit(
    request,
    async () => {
      try {
        const dbUser = await getAuthenticatedUserWithStudent()
        if (!dbUser?.email || !dbUser.student) {
          return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const validation = createChallengeSchema.safeParse(body)
        if (!validation.success) {
          return NextResponse.json(
            { error: 'Datos inválidos', details: validation.error.errors },
            { status: 400 }
          )
        }

        const { examId, message, deadline } = validation.data

        // Si hay examId, verificar que el examen existe
        if (examId) {
          const exam = await prisma.exam.findUnique({
            where: { id: examId },
          })

          if (!exam) {
            return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
          }
        }

        // Obtener todos los estudiantes para encontrar el otro
        const allStudents = await prisma.student.findMany({
          select: { id: true },
          orderBy: { createdAt: 'asc' },
        })

        // CORRECCIÓN: Validar que allStudents sea un array válido antes de acceder a length
        if (!Array.isArray(allStudents)) {
          logger.warn({ allStudents }, 'challenges: allStudents no es un array válido')
          return NextResponse.json(
            { error: 'Error al obtener estudiantes' },
            { status: 500 }
          )
        }
        
        const safeAllStudentsLength = Number.isFinite(allStudents.length) ? allStudents.length : 0
        if (safeAllStudentsLength < 2) {
          return NextResponse.json(
            { error: 'Se necesitan al menos 2 estudiantes para crear un desafío' },
            { status: 400 }
          )
        }

        // Encontrar el otro estudiante (el que no es el actual)
        // CORRECCIÓN: Validar que allStudents sea un array válido y que s.id y dbUser.student.id existan antes de comparar
        const otherStudent = (() => {
          if (!Array.isArray(allStudents)) {
            return null
          }
          const safeCurrentStudentId = dbUser?.student?.id && typeof dbUser.student.id === 'string' ? dbUser.student.id : null
          if (!safeCurrentStudentId) {
            logger.warn({ dbUser }, 'challenges: dbUser.student.id no es válido')
            return null
          }
          try {
            return allStudents.find(s => {
              if (!s || typeof s !== 'object') {
                return false
              }
              const safeSId = s.id && typeof s.id === 'string' ? s.id : null
              return safeSId !== null && safeSId !== safeCurrentStudentId
            }) || null
          } catch (error) {
            logger.warn({ error, allStudents }, 'challenges: Error al ejecutar find() en allStudents')
            return null
          }
        })()
        if (!otherStudent) {
          return NextResponse.json(
            { error: 'No se encontró el otro estudiante para desafiar' },
            { status: 404 }
          )
        }

        // Crear el desafío usando transacción para prevenir race conditions
        // Si dos usuarios intentan crear desafíos simultáneamente, solo uno tendrá éxito
        const challenge = await prisma.$transaction(
          async tx => {
            // Verificar si ya existe un desafío activo para el mismo examen (dentro de la transacción)
            if (examId) {
              const existingChallenge = await tx.challenge.findFirst({
                where: {
                  examId,
                  challengerId: dbUser.student.id,
                  challengedId: otherStudent.id,
                  status: { in: [CHALLENGE_STATUS.PENDING, CHALLENGE_STATUS.ACCEPTED] },
                },
              })

              if (existingChallenge) {
                throw new Error('Ya existe un desafío activo para este examen')
              }
            }

            // Crear el desafío
            return await tx.challenge.create({
              data: {
                examId: examId || null,
                challengerId: dbUser.student.id,
                challengedId: otherStudent.id,
                message: message || null,
                deadline: deadline ? new Date(deadline) : null,
                status: CHALLENGE_STATUS.PENDING,
              },
              include: {
                exam: {
                  include: {
                    subject: {
                      select: {
                        id: true,
                        nombre: true,
                        codigo: true,
                      },
                    },
                  },
                },
                challenger: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
                challenged: {
                  select: {
                    id: true,
                    nombre: true,
                  },
                },
              },
            })
          },
          {
            timeout: TRANSACTION_TIMEOUT_SHORT,
          }
        )

        // Limpiar desafíos expirados en background (no bloquear la respuesta)
        cancelExpiredChallenges().catch(error => {
          logger.error(
            {
              type: 'challenge_cleanup_background_error', // guard:allow-secret
              error: error instanceof Error ? error.message : String(error),
            },
            'Error en limpieza de fondo de desafíos expirados'
          )
        })

        return NextResponse.json(
          {
            challenge,
            message: 'Desafío creado exitosamente',
          },
          { status: 201 }
        )
      } catch (error) {
        // Si es un error de desafío existente, retornar 409
        if (
          error instanceof Error &&
          error.message === 'Ya existe un desafío activo para este examen'
        ) {
          return NextResponse.json(
            { error: 'Ya existe un desafío activo para este examen' },
            { status: 409 }
          )
        }

        logger.error(
          {
            type: 'challenges_post_error',
            error: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined,
          },
          'Error al crear desafío'
        )
        return NextResponse.json({ error: 'Error al crear desafío' }, { status: 500 })
      }
    },
    'challenge' // Tipo de rate limit estricto para desafíos
  )
}
