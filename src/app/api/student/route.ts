import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys } from '@/lib/cache'

// Especificar Node.js runtime (necesario para Prisma y otras dependencias)
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      logApiRequest('GET', '/api/student')
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Usar caché para queries frecuentes
      const student = await getCached(
        cacheKeys.student(studentId),
        async () => {
          return await prisma.student.findUnique({
            where: { id: studentId },
            select: {
              id: true,
              nombre: true,
              createdAt: true,
              attempts: {
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                  id: true,
                  estado: true,
                  porcentaje: true,
                  correctas: true,
                  totalPreguntas: true,
                  puntajePaes: true,
                  createdAt: true,
                  exam: {
                    select: {
                      id: true,
                      titulo: true,
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
              metrics: {
                select: {
                  id: true,
                  porcentaje: true,
                  totalPreguntas: true,
                  correctas: true,
                  nivel: true,
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
            },
          })
        },
        2 * 60 * 1000 // Cache por 2 minutos
      )

      if (!student) {
        return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 })
      }

      return NextResponse.json(student)
    } catch (error) {
      return handleApiError(error, 'Error al obtener datos del estudiante', {
        path: '/api/student',
      })
    }
  })
}
