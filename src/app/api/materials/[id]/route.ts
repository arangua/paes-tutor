import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentStudentId } from '@/lib/get-session'
import { handleApiError } from '@/lib/api-helpers'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logApiRequest } from '@/lib/logger'
import { getCached, cacheKeys, invalidateCachePattern } from '@/lib/cache'

// Especificar Node.js runtime
export const runtime = 'nodejs'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return withRateLimit(request, async () => {
    try {
      const { id } = await params
      logApiRequest('GET', `/api/materials/${id}`)

      const studentId = await getCurrentStudentId()
      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Validar formato del ID
      if (!id || !/^c[a-z0-9]{24}$/.test(id)) {
        return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
      }

      // Usar caché
      const material = await getCached(
        cacheKeys.material(id),
        async () => {
          return await prisma.studyMaterial.findUnique({
            where: { id },
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
                  descripcion: true,
                },
              },
            },
          })
        },
        10 * 60 * 1000 // Cache por 10 minutos
      )

      if (!material) {
        return NextResponse.json({ error: 'Material no encontrado' }, { status: 404 })
      }

      return NextResponse.json(material)
    } catch (error) {
      return handleApiError(error, 'Error al obtener material', {
        path: `/api/materials/[id]`,
      })
    }
  })
}
