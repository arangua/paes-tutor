import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

/**
 * PATCH: Marcar flashcard compartida como vista
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

      // Verificar que la flashcard compartida pertenece al usuario actual
      const sharedFlashcard = await prisma.sharedFlashcard.findUnique({
        where: { id },
      })

      if (!sharedFlashcard) {
        return NextResponse.json({ error: 'Flashcard compartida no encontrada' }, { status: 404 })
      }

      if (sharedFlashcard.sharedWithId !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para marcar esta flashcard como vista' },
          { status: 403 }
        )
      }

      // Marcar como vista
      const updated = await prisma.sharedFlashcard.update({
        where: { id },
        data: {
          viewed: true,
          viewedAt: new Date(),
        },
      })

      return NextResponse.json({ sharedFlashcard: updated })
    } catch (error) {
      logger.error(
        {
          type: 'shared_flashcards_patch_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al marcar flashcard compartida como vista'
      )
      return NextResponse.json(
        { error: 'Error al marcar flashcard compartida como vista' },
        { status: 500 }
      )
    }
  })
}

/**
 * DELETE: Eliminar flashcard compartida
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

      // Verificar que la flashcard compartida pertenece al usuario actual
      const sharedFlashcard = await prisma.sharedFlashcard.findUnique({
        where: { id },
      })

      if (!sharedFlashcard) {
        return NextResponse.json({ error: 'Flashcard compartida no encontrada' }, { status: 404 })
      }

      // Solo el que compartió puede eliminar
      if (sharedFlashcard.sharedById !== dbUser.student.id) {
        return NextResponse.json(
          { error: 'No tienes permiso para eliminar esta flashcard compartida' },
          { status: 403 }
        )
      }

      // Eliminar
      await prisma.sharedFlashcard.delete({
        where: { id },
      })

      return NextResponse.json({ message: 'Flashcard compartida eliminada' })
    } catch (error) {
      logger.error(
        {
          type: 'shared_flashcards_delete_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al eliminar flashcard compartida'
      )
      return NextResponse.json(
        { error: 'Error al eliminar flashcard compartida' },
        { status: 500 }
      )
    }
  })
}

