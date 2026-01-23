import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { prisma } from '@/lib/prisma'
import { encrypt, maskApiKey } from '@/lib/encryption'
import { z } from 'zod'
import { validateBody } from '@/lib/api-helpers'
import { logger } from '@/lib/logger'
import type { Prisma } from '@prisma/client'

export const runtime = 'nodejs'

const updateAIKeysSchema = z.object({
  openaiApiKey: z.string().optional().nullable(),
  anthropicApiKey: z.string().optional().nullable(),
  geminiApiKey: z.string().optional().nullable(),
  preferredAIService: z.enum(['openai', 'anthropic', 'gemini']).optional().nullable(),
  // Si se envía una cadena vacía, se elimina la key
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()

      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const fullUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          openaiApiKey: true,
          anthropicApiKey: true,
          geminiApiKey: true,
          preferredAIService: true,
        },
      })

      if (!fullUser) {
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
      }

      // Retornar keys enmascaradas (solo últimos 4 caracteres)
      return NextResponse.json({
        openaiApiKey: maskApiKey(fullUser.openaiApiKey),
        anthropicApiKey: maskApiKey(fullUser.anthropicApiKey),
        geminiApiKey: maskApiKey(fullUser.geminiApiKey),
        preferredAIService: fullUser.preferredAIService,
        hasOpenAI: !!fullUser.openaiApiKey,
        hasAnthropic: !!fullUser.anthropicApiKey,
        hasGemini: !!fullUser.geminiApiKey,
      })
    } catch (error) {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          userId: user?.id,
        },
        'Error al obtener API keys'
      )
      return NextResponse.json({ error: 'Error al obtener configuración de IA' }, { status: 500 })
    }
  })
}

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()

      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const validation = await validateBody(request, updateAIKeysSchema)
      if (!validation.success) {
        return validation.error
      }

      const { openaiApiKey, anthropicApiKey, geminiApiKey, preferredAIService } = validation.data

      // Preparar datos de actualización
      const updateData: Prisma.UserUpdateInput = {}

      // Solo actualizar si se proporciona un valor
      if (openaiApiKey !== undefined) {
        updateData.openaiApiKey =
          openaiApiKey && openaiApiKey.trim() ? encrypt(openaiApiKey.trim()) : null
      }

      if (anthropicApiKey !== undefined) {
        updateData.anthropicApiKey =
          anthropicApiKey && anthropicApiKey.trim() ? encrypt(anthropicApiKey.trim()) : null
      }

      if (geminiApiKey !== undefined) {
        updateData.geminiApiKey =
          geminiApiKey && geminiApiKey.trim() ? encrypt(geminiApiKey.trim()) : null
      }

      if (preferredAIService !== undefined) {
        updateData.preferredAIService = preferredAIService
      }

      // Actualizar usuario
      await prisma.user.update({
        where: { id: user.id },
        data: updateData,
      })

      logger.info(
        {
          userId: user.id,
          hasOpenAI: !!updateData.openaiApiKey,
          hasAnthropic: !!updateData.anthropicApiKey,
          hasGemini: !!updateData.geminiApiKey,
          preferredService: updateData.preferredAIService,
        },
        'API keys actualizadas correctamente'
      )

      return NextResponse.json({
        message: 'API keys actualizadas correctamente',
        // Retornar keys enmascaradas
        openaiApiKey:
          updateData.openaiApiKey !== undefined ? maskApiKey(updateData.openaiApiKey) : undefined,
        anthropicApiKey:
          updateData.anthropicApiKey !== undefined
            ? maskApiKey(updateData.anthropicApiKey)
            : undefined,
        geminiApiKey:
          updateData.geminiApiKey !== undefined ? maskApiKey(updateData.geminiApiKey) : undefined,
        preferredAIService: updateData.preferredAIService,
      })
    } catch (error) {
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          userId: user?.id,
        },
        'Error al actualizar API keys'
      )
      return NextResponse.json(
        { error: 'Error al actualizar configuración de IA' },
        { status: 500 }
      )
    }
  })
}
