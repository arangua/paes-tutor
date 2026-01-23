import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const { searchParams } = new URL(request.url)
      const questionIds = searchParams.get('questionIds')

      if (!questionIds) {
        return NextResponse.json({ error: 'IDs de preguntas requeridos' }, { status: 400 })
      }

      const ids = questionIds.split(',').filter(Boolean)

      const bookmarks = await prisma.bookmark.findMany({
        where: {
          studentId: dbUser.student.id,
          questionId: { in: ids },
        },
        select: {
          questionId: true,
        },
      })

      const bookmarkedIds = new Set(bookmarks.map(b => b.questionId))

      return NextResponse.json({
        bookmarked: ids.map(id => ({
          questionId: id,
          isBookmarked: bookmarkedIds.has(id),
        })),
      })
    } catch (error) {
      logger.error(
        {
          type: 'bookmarks_check_error',
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
        },
        'Error al verificar favoritos'
      )
      return NextResponse.json({ error: 'Error al verificar favoritos' }, { status: 500 })
    }
  })
}
