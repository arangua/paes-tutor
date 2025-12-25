import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'

export const runtime = 'nodejs'

const shareMaterialSchema = z.object({
  materialId: z.string().min(1),
  message: z.string().optional(),
})

/**
 * GET: Obtener materiales compartidos con el usuario actual
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
        // Materiales compartidos CON el usuario actual
        const sharedMaterials = await prisma.sharedMaterial.findMany({
          where: {
            sharedWithId: dbUser.student.id,
          },
          include: {
            material: {
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
                    ejeTematico: true,
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

        return NextResponse.json({ sharedMaterials })
      } else {
        // Materiales compartidos POR el usuario actual
        const sharedMaterials = await prisma.sharedMaterial.findMany({
          where: {
            sharedById: dbUser.student.id,
          },
          include: {
            material: {
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
                    ejeTematico: true,
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

        return NextResponse.json({ sharedMaterials })
      }
    } catch (error) {
      logger.error(
        {
          type: 'shared_materials_get_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al obtener materiales compartidos'
      )
      return NextResponse.json(
        { error: 'Error al obtener materiales compartidos' },
        { status: 500 }
      )
    }
  })
}

/**
 * POST: Compartir un material con el otro estudiante
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const validation = shareMaterialSchema.safeParse(body)
      if (!validation.success) {
        return NextResponse.json(
          { error: 'Datos inválidos', details: validation.error.errors },
          { status: 400 }
        )
      }

      const { materialId, message } = validation.data

      // Verificar que el material existe
      const material = await prisma.studyMaterial.findUnique({
        where: { id: materialId },
      })

      if (!material) {
        return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 })
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

      // Verificar si ya está compartido
      const existing = await prisma.sharedMaterial.findUnique({
        where: {
          materialId_sharedById_sharedWithId: {
            materialId,
            sharedById: dbUser.student.id,
            sharedWithId: otherStudent.id,
          },
        },
      })

      if (existing) {
        return NextResponse.json(
          { error: 'Este material ya fue compartido con el otro estudiante' },
          { status: 409 }
        )
      }

      // Compartir el material
      const sharedMaterial = await prisma.sharedMaterial.create({
        data: {
          materialId,
          sharedById: dbUser.student.id,
          sharedWithId: otherStudent.id,
          message: message || null,
        },
        include: {
          material: {
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
                  ejeTematico: true,
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
          sharedMaterial,
          message: 'Material compartido exitosamente',
        },
        { status: 201 }
      )
    } catch (error) {
      logger.error(
        {
          type: 'shared_materials_post_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al compartir material'
      )
      return NextResponse.json({ error: 'Error al compartir material' }, { status: 500 })
    }
  })
}
