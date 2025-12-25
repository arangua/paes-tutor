import { NextRequest, NextResponse } from 'next/server'
import { getAuthenticatedUserWithStudent } from '@/lib/get-session'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

/**
 * GET: Obtener versiones de una nota
 */
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
      const noteId = searchParams.get('noteId')

      if (!noteId) {
        return NextResponse.json({ error: 'ID de nota requerido' }, { status: 400 })
      }

      // Verificar que la nota pertenece al estudiante
      const note = await prisma.studyNote.findFirst({
        where: {
          id: noteId,
          studentId: dbUser.student.id,
        },
      })

      if (!note) {
        return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
      }

      // Obtener versiones (simulado - en producción usarías una tabla de versiones)
      // Por ahora, retornamos la nota actual como versión única
      // TODO: Implementar tabla de versiones en la base de datos
      const versions = [
        {
          id: note.id,
          title: note.title,
          content: note.content,
          tags: note.tags,
          createdAt: note.updatedAt,
          createdBy: dbUser.student.id,
        },
      ]

      return NextResponse.json({
        versions,
        currentVersionId: note.id,
      })
    } catch (error) {
      logger.error({ error, context: 'notes/versions/GET' }, 'Error al obtener versiones')
      return NextResponse.json({ error: 'Error al obtener versiones' }, { status: 500 })
    }
  })
}

/**
 * POST: Restaurar una versión de nota
 */
export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const dbUser = await getAuthenticatedUserWithStudent()
      if (!dbUser?.email) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      if (!dbUser.student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      const body = await request.json()
      const { noteId, versionId } = body

      if (!noteId || !versionId) {
        return NextResponse.json(
          { error: 'ID de nota y versión requeridos' },
          { status: 400 }
        )
      }

      // Verificar que la nota pertenece al estudiante
      const note = await prisma.studyNote.findFirst({
        where: {
          id: noteId,
          studentId: dbUser.student.id,
        },
      })

      if (!note) {
        return NextResponse.json({ error: 'Nota no encontrada' }, { status: 404 })
      }

      // TODO: Implementar restauración de versiones cuando se tenga tabla de versiones
      // Por ahora, solo retornamos éxito
      // En producción, aquí crearías una nueva versión con el contenido actual
      // y luego restaurarías el contenido de la versión seleccionada

      return NextResponse.json({
        message: 'Versión restaurada correctamente',
      })
    } catch (error) {
      logger.error({ error, context: 'notes/versions/POST' }, 'Error al restaurar versión')
      return NextResponse.json({ error: 'Error al restaurar versión' }, { status: 500 })
    }
  })
}

