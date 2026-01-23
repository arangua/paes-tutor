import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { createNotification } from '@/lib/notifications'
import { z } from 'zod'

export const runtime = 'nodejs'

const shareNoteSchema = z.object({
  noteId: z.string().min(1),
  message: z.string().optional(),
})

const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
})

/**
 * GET: Obtener notas compartidas con el usuario actual
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
        // Notas compartidas CON el usuario actual
        const whereClause = {
          sharedWithId: dbUser.student.id,
        }

        const [sharedNotes, total] = await Promise.all([
          prisma.sharedNote.findMany({
            where: whereClause,
            select: {
              id: true,
              noteId: true,
              message: true,
              viewed: true,
              viewedAt: true,
              createdAt: true,
              note: {
                select: {
                  id: true,
                  title: true,
                  content: true,
                  tags: true,
                  createdAt: true,
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
                  topic: {
                    select: {
                      id: true,
                      nombre: true,
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
          prisma.sharedNote.count({
            where: whereClause,
          }),
        ])

        return NextResponse.json({
          sharedNotes,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total,
          },
        })
      } else {
        // Notas compartidas POR el usuario actual
        const whereClause = {
          sharedById: dbUser.student.id,
        }

        const [sharedNotes, total] = await Promise.all([
          prisma.sharedNote.findMany({
            where: whereClause,
            select: {
              id: true,
              noteId: true,
              message: true,
              viewed: true,
              viewedAt: true,
              createdAt: true,
              note: {
                select: {
                  id: true,
                  title: true,
                  content: true,
                  tags: true,
                  createdAt: true,
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
                  topic: {
                    select: {
                      id: true,
                      nombre: true,
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
          prisma.sharedNote.count({
            where: whereClause,
          }),
        ])

        return NextResponse.json({
          sharedNotes,
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
          type: 'shared_notes_get_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener notas compartidas'
      )
      return NextResponse.json({ error: 'Error al obtener notas compartidas' }, { status: 500 })
    }
  })
}

/**
 * POST: Compartir una nota con el otro estudiante
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = shareNoteSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { noteId, message } = validation.data

      // Verificar que la nota existe
      const note = await prisma.studyNote.findUnique({
        where: { id: noteId },
      })

      if (!note) {
        return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
      }

      // Verificar que la nota pertenece al usuario actual
      if (note.studentId !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para compartir esta nota' },
          { status: 403 }
        )
      }

      // Obtener todos los estudiantes para encontrar el otro
      const allStudents = await prisma.student.findMany({
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      })

      // CORRECCIÓN: Validar que allStudents sea un array válido antes de acceder a length
      if (!Array.isArray(allStudents)) {
        logger.warn({ allStudents }, 'shared-notes: allStudents no es un array válido')
        return NextResponse.json(
          { error: 'Error al obtener estudiantes' },
          { status: 500 }
        )
      }
      
      const safeAllStudentsLength = Number.isFinite(allStudents.length) ? allStudents.length : 0
      if (safeAllStudentsLength < 2) {
        return NextResponse.json(
          { error: 'Se necesitan al menos 2 estudiantes para compartir' },
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
          logger.warn({ dbUser }, 'shared-notes: dbUser.student.id no es válido')
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
          logger.warn({ error, allStudents }, 'shared-notes: Error al ejecutar find() en allStudents')
          return null
        }
      })()
      if (!otherStudent) {
        return NextResponse.json(
          { error: 'No se encontró el otro estudiante para compartir' },
          { status: 404 }
        )
      }

      // Verificar si ya está compartida
      const existing = await prisma.sharedNote.findUnique({
        where: {
          noteId_sharedById_sharedWithId: {
            noteId,
            sharedById: dbUser.student.id,
            sharedWithId: otherStudent.id,
          },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Esta nota ya fue compartida con el otro estudiante' },
          { status: 409 }
        )
      }

      // Compartir la nota
      const sharedNote = await prisma.sharedNote.create({
        data: {
          noteId,
          sharedById: dbUser.student.id,
          sharedWithId: otherStudent.id,
          message: message || null,
        },
        include: {
          note: {
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
              topic: {
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
          title: 'Nueva nota compartida',
          message: message
            ? `${dbUser.student?.nombre || 'Un estudiante'} te compartió una nota: "${message}"`
            : `${dbUser.student?.nombre || 'Un estudiante'} te compartió una nota: "${note.title || 'Sin título'}"`,
          relatedId: sharedNote.id,
          relatedType: 'note',
          actionUrl: '/shared-notes',
          priority: 'normal',
        })
      } catch (notifError) {
        // No fallar si la notificación no se puede crear
        logger.error(
          {
            type: 'shared_note_notification_error',
            error: notifError instanceof Error ? notifError.message : String(notifError),
          },
          'Error al crear notificación de nota compartida'
        )
      }

      return NextResponse.json(
        {
          sharedNote,
          message: 'Nota compartida exitosamente',
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error(
        {
          type: 'shared_notes_post_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al compartir nota'
      )
      return NextResponse.json({ error: 'Error al compartir nota' }, { status: 500 })
    }
  })
}

