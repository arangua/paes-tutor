import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { logger } from '@/lib/logger'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

const _topicsQuerySchema = z.object({
  subjectId: z.string().optional(),
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const { searchParams } = new URL(request.url)
      const subjectId = searchParams.get('subjectId')

      const where: Prisma.TopicWhereInput = {}
      if (subjectId) {
        where.subjectId = subjectId
      }

      const topics = await prisma.topic.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          ejeTematico: true,
          descripcion: true,
          subjectId: true,
        },
        orderBy: [{ ejeTematico: 'asc' }, { nombre: 'asc' }],
      })

      return NextResponse.json({
        topics,
      })
    } catch (error) {
      logger.error(
        {
          type: 'api_error',
          path: '/api/topics',
          error: error instanceof Error ? error.message : String(error),
        },
        'Error al obtener temas'
      )
      return NextResponse.json({ error: 'Error al obtener temas' }, { status: 500 })
    }
  })
}
