import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      logApiRequest('GET', `/api/exams/${id}`)

      // Validar autenticación
      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar formato del ID (cuid)
      if (!id || !/^c[a-z0-9]{24}$/.test(id)) {
        return NextResponse.json({ error: 'ID de examen inválido' }, { status: 400 })
      }

      // Usar caché para examen individual (exámenes no cambian frecuentemente)
      const exam = await getCached(
        cacheKeys.exam(id),
        async () => {
          return await prisma.exam.findUnique({
            where: { id },
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
          })
        },
        10 * 60 * 1000 // Cache por 10 minutos
      )

      if (!exam) {
        return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
      }

      return NextResponse.json(exam)
    } catch (error) {
      return handleApiError(error, 'Error al obtener examen', {
        path: `/api/exams/${await params.then(p => p.id)}`,
      })
    }
  })
}
