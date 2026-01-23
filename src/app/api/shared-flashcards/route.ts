import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { z } from 'zod'

export const runtime = 'nodejs'

const shareFlashcardSchema = z.object({
  flashcardId: z.string().min(1),
  message: z.string().optional(),
})

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

/**
 * GET: Obtener flashcards compartidas con el usuario actual
 */
export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const type = searchParams.get('type') || 'received' // 'received' | 'sent'

      // Validar parámetros de paginación
      const paginationParams = paginationSchema.safeParse({
        limit: searchParams.get('limit'),
        offset: searchParams.get('offset'),
      })

      if (!paginationParams.success) {
        return NextResponse.json(
          { error: 'Parámetros de paginación inválidos', details: paginationParams.error.errors },
          { status: 400 }
        )
      }

      const { limit, offset } = paginationParams.data

      if (type === 'received') {
        // Flashcards compartidas CON el usuario actual
        const whereClause = {
          sharedWithId: dbUser.student.id,
        }

        const [sharedFlashcards, total] = await Promise.all([
          prisma.sharedFlashcard.findMany({
            where: whereClause,
            select: {
              id: true,
              flashcardId: true,
              message: true,
              viewed: true,
              viewedAt: true,
              createdAt: true,
              flashcard: {
                select: {
                  id: true,
                  front: true,
                  back: true,
                  difficulty: true,
                  reviewCount: true,
                  nextReview: true,
                  question: {
                    select: {
                      id: true,
                      enunciado: true,
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
                        },
                      },
                    },
                  },
                },
              },
              sharedBy: {
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
            orderBy: {
              createdAt: 'desc',
            },
            skip: offset,
            take: limit,
          }),
          prisma.sharedFlashcard.count({
            where: whereClause,
          }),
        ])

        return NextResponse.json({
          sharedFlashcards,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
        })
      } else {
        // Flashcards compartidas POR el usuario actual
        const whereClause = {
          sharedById: dbUser.student.id,
        }

        const [sharedFlashcards, total] = await Promise.all([
          prisma.sharedFlashcard.findMany({
            where: whereClause,
            select: {
              id: true,
              flashcardId: true,
              message: true,
              viewed: true,
              viewedAt: true,
              createdAt: true,
              flashcard: {
                select: {
                  id: true,
                  front: true,
                  back: true,
                  difficulty: true,
                  reviewCount: true,
                  nextReview: true,
                  question: {
                    select: {
                      id: true,
                      enunciado: true,
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
                        },
                      },
                    },
                  },
                },
              },
              sharedWith: {
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
            orderBy: {
              createdAt: 'desc',
            },
            skip: offset,
            take: limit,
          }),
          prisma.sharedFlashcard.count({
            where: whereClause,
          }),
        ])

        return NextResponse.json({
          sharedFlashcards,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
        })
      }
    } catch (error) {
      logger.error(
        {
          type: 'shared_flashcards_get_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener flashcards compartidas'
      )
      return NextResponse.json({ error: 'Error al obtener flashcards compartidas' }, { status: 500 })
    }
  })
}

/**
 * POST: Compartir una flashcard con el otro estudiante
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = shareFlashcardSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { flashcardId, message } = validation.data

      // Verificar que la flashcard existe
      const flashcard = await prisma.flashcard.findUnique({
        where: { id: flashcardId },
      })

      if (!flashcard) {
        return NextResponse.json({ error: 'Flashcard no encontrada' }, { status: 404 })
      }

      // Verificar que la flashcard pertenece al usuario actual
      if (flashcard.studentId !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para compartir esta flashcard' },
          { status: 403 }
        )
      }

      // Obtener todos los estudiantes para encontrar el otro
      const allStudents = await prisma.student.findMany({
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      })

      if (allStudents.length < 2) {
        return NextResponse.json(
          { error: 'Se necesitan al menos 2 estudiantes para compartir' },
          { status: 400 }
        )
      }

      // Encontrar el otro estudiante (el que no es el actual)
      const otherStudent = allStudents.find(s => s.id !== dbUser.student.id)
      if (!otherStudent) {
        return NextResponse.json(
          { error: 'No se encontró el otro estudiante para compartir' },
          { status: 404 }
        )
      }

      // Verificar si ya está compartida
      const existing = await prisma.sharedFlashcard.findUnique({
        where: {
          flashcardId_sharedById_sharedWithId: {
            flashcardId,
            sharedById: dbUser.student.id,
            sharedWithId: otherStudent.id,
          },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Esta flashcard ya fue compartida con el otro estudiante' },
          { status: 409 }
        )
      }

      // Compartir la flashcard
      const sharedFlashcard = await prisma.sharedFlashcard.create({
        data: {
          flashcardId,
          sharedById: dbUser.student.id,
          sharedWithId: otherStudent.id,
          message: message || null,
        },
        include: {
          flashcard: {
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
                    },
                  },
                },
              },
            },
          },
          sharedWith: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      })

      // Crear notificación para el estudiante que recibe
      try {
        await createNotification({
          studentId: otherStudent.id,
          type: 'shared',
          title: 'Nueva flashcard compartida',
          message: message
            ? `${dbUser.student?.nombre || 'Un estudiante'} te compartió una flashcard: "${message}"`
            : `${dbUser.student?.nombre || 'Un estudiante'} te compartió una flashcard`,
          relatedId: sharedFlashcard.id,
          relatedType: 'flashcard',
          actionUrl: '/shared-flashcards',
          priority: 'normal',
        })
      } catch (notifError) {
        // No fallar si la notificación no se puede crear
        logger.error(
          {
            type: 'shared_flashcard_notification_error', // guard:allow-secret
            error: notifError instanceof Error ? notifError.message : String(notifError),
          },
          'Error al crear notificación de flashcard compartida'
        )
      }

      return NextResponse.json(
        {
          sharedFlashcard,
          message: 'Flashcard compartida exitosamente',
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error(
        {
          type: 'shared_flashcards_post_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al compartir flashcard'
      )
      return NextResponse.json({ error: 'Error al compartir flashcard' }, { status: 500 })
    }
  })
}

