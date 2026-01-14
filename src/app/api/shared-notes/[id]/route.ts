import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * PATCH: Marcar nota compartida como vista
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Verificar que la nota compartida pertenece al usuario actual
      const sharedNote = await prisma.sharedNote.findUnique({
        where: { id },
      })

      if (!sharedNote) {
        return NextResponse.json({ error: 'Nota compartida no encontrada' }, { status: 404 })
      }

      if (sharedNote.sharedWithId !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para marcar esta nota como vista' },
          { status: 403 }
        )
      }

      // Marcar como vista
      const updated = await prisma.sharedNote.update({
        where: { id },
        data: {
          viewed: true,
          viewedAt: new Date(),
        },
      })

      return NextResponse.json({ sharedNote: updated })
    } catch (error) {
      logger.error(
        {
          type: 'shared_notes_patch_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al marcar nota compartida como vista'
      )
      return NextResponse.json(
        { error: 'Error al marcar nota compartida como vista' },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE: Eliminar nota compartida
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email || !dbUser.student) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Verificar que la nota compartida pertenece al usuario actual
      const sharedNote = await prisma.sharedNote.findUnique({
        where: { id },
      })

      if (!sharedNote) {
        return NextResponse.json({ error: 'Nota compartida no encontrada' }, { status: 404 })
      }

      // Solo el que compartió puede eliminar
      if (sharedNote.sharedById !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para eliminar esta nota compartida' },
          { status: 403 }
        )
      }

      // Eliminar
      await prisma.sharedNote.delete({
        where: { id },
      })

      return NextResponse.json({ message: 'Nota compartida eliminada' })
    } catch (error) {
      logger.error(
        {
          type: 'shared_notes_delete_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al eliminar nota compartida'
      )
      return NextResponse.json(
        { error: 'Error al eliminar nota compartida' },
        { status: 500 }
      )
    }
  })
}

