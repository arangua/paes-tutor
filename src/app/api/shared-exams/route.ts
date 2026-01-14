import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const shareExamSchema = z.object({
  examId: z.string().min(1),
  message: z.string().optional(),
})

/**
 * GET: Obtener exámenes compartidos con el usuario actual
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

      if (type === 'received') {
        // Exámenes compartidos CON el usuario actual
        const sharedExams = await prisma.sharedExam.findMany({
          where: {
            sharedWithId: dbUser.student.id,
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
        })

        return NextResponse.json({ sharedExams })
      } else {
        // Exámenes compartidos POR el usuario actual
        const sharedExams = await prisma.sharedExam.findMany({
          where: {
            sharedById: dbUser.student.id,
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
        })

        return NextResponse.json({ sharedExams })
      }
    } catch (error) {
      logger.error(
        {
          type: 'shared_exams_get_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener exámenes compartidos'
      )
      return NextResponse.json({ error: 'Error al obtener exámenes compartidos' }, { status: 500 })
    }
  })
}

/**
 * POST: Compartir un examen con el otro estudiante
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = shareExamSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { examId, message } = validation.data

      // Verificar que el examen existe
      const exam = await prisma.exam.findUnique({
        where: { id: examId },
      })

      if (!exam) {
        return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
      }

      // Obtener todos los estudiantes para encontrar el otro
      const allStudents = await prisma.student.findMany({
        select: { id: true },
        orderBy: { createdAt: 'asc' },
      })

      // CORRECCIÓN: Validar que allStudents sea un array válido antes de acceder a length
      if (!Array.isArray(allStudents)) {
        logger.warn({ allStudents }, 'shared-exams: allStudents no es un array válido')
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
          logger.warn({ dbUser }, 'shared-exams: dbUser.student.id no es válido')
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
          logger.warn({ error, allStudents }, 'shared-exams: Error al ejecutar find() en allStudents')
          return null
        }
      })()
      if (!otherStudent) {
        return NextResponse.json(
          { error: 'No se encontró el otro estudiante para compartir' },
          { status: 404 }
        )
      }

      // Verificar si ya está compartido
      const existing = await prisma.sharedExam.findUnique({
        where: {
          examId_sharedById_sharedWithId: {
            examId,
            sharedById: dbUser.student.id,
            sharedWithId: otherStudent.id,
          },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Este examen ya fue compartido con el otro estudiante' },
          { status: 409 }
        )
      }

      // Compartir el examen
      const sharedExam = await prisma.sharedExam.create({
        data: {
          examId,
          sharedById: dbUser.student.id,
          sharedWithId: otherStudent.id,
          message: message || null,
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
          sharedWith: {
            select: {
              id: true,
              nombre: true,
            },
          },
        },
      })

      return NextResponse.json(
        {
          sharedExam,
          message: 'Examen compartido exitosamente',
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error(
        {
          type: 'shared_exams_post_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al compartir examen'
      )
      return NextResponse.json({ error: 'Error al compartir examen' }, { status: 500 })
    }
  })
}
