import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const subjects = await prisma.subject.findMany({
        select: {
          id: true,
          nombre: true,
          codigo: true,
          tipo: true,
        },
        orderBy: {
          nombre: 'asc',
        },
      })

      return NextResponse.json({
        subjects,
      })
    } catch (error) {
      logger.error(
        {
          type: 'api_error',
          path: '/api/subjects',
          error: error instanceof Error ? error.message : String(error),
        },
        'Error al obtener asignaturas'
      )
      return NextResponse.json({ error: 'Error al obtener asignaturas' }, { status: 500 })
    }
  })
}
