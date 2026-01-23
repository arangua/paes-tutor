import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { z } from 'zod'
import { validateBody } from '@/lib/api-helpers'

export const runtime = 'nodejs'

const configSchema = z.object({
  preferredService: z.enum(['openai', 'anthropic', 'gemini']).optional(),
  // Nota: Las API keys se almacenarían encriptadas en la base de datos
  // Por ahora, usamos variables de entorno por seguridad
})

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const user = await getCurrentUser()

      if (!user) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      // Verificar qué servicios están disponibles
      const availableServices = []

      // Verificar configuración del usuario primero
      const { prisma } = await import('@/lib/prisma')
      const { decrypt } = await import('@/lib/encryption')

      const userConfig = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          openaiApiKey: true,
          anthropicApiKey: true,
          geminiApiKey: true,
          preferredAIService: true,
        },
      })

      // Verificar keys del usuario primero (tienen prioridad)
      const userServices: string[] = []

      if (userConfig?.anthropicApiKey) {
        try {
          const decrypted = decrypt(userConfig.anthropicApiKey)
          if (decrypted && decrypted.trim().length > 0) {
            availableServices.push({
              service: 'anthropic' as const,
              name: 'Claude (Anthropic)',
              configured: true,
              source: 'user',
            })
            userServices.push('anthropic')
          }
        } catch {
          // Si falla la desencriptación, ignorar (key corrupta o inválida)
        }
      }

      if (userConfig?.openaiApiKey) {
        try {
          const decrypted = decrypt(userConfig.openaiApiKey)
          if (decrypted && decrypted.trim().length > 0) {
            availableServices.push({
              service: 'openai' as const,
              name: 'ChatGPT (OpenAI)',
              configured: true,
              source: 'user',
            })
            userServices.push('openai')
          }
        } catch {
          // Si falla la desencriptación, ignorar
        }
      }

      if (userConfig?.geminiApiKey) {
        try {
          const decrypted = decrypt(userConfig.geminiApiKey)
          if (decrypted && decrypted.trim().length > 0) {
            availableServices.push({
              service: 'gemini' as const,
              name: 'Gemini (Google)',
              configured: true,
              source: 'user',
            })
            userServices.push('gemini')
          }
        } catch {
          // Si falla la desencriptación, ignorar
        }
      }

      // Verificar variables de entorno (solo si no hay keys del usuario para ese servicio)
      // Esto permite usar env como fallback si la key del usuario falla
      if (!userServices.includes('anthropic') && process.env.ANTHROPIC_API_KEY) {
        availableServices.push({
          service: 'anthropic' as const,
          name: 'Claude (Anthropic)',
          configured: true,
          source: 'env',
        })
      }

      if (!userServices.includes('openai') && process.env.OPENAI_API_KEY) {
        availableServices.push({
          service: 'openai' as const,
          name: 'ChatGPT (OpenAI)',
          configured: true,
          source: 'env',
        })
      }

      if (!userServices.includes('gemini') && process.env.GEMINI_API_KEY) {
        availableServices.push({
          service: 'gemini' as const,
          name: 'Gemini (Google)',
          configured: true,
          source: 'env',
        })
      }

      return NextResponse.json({
        availableServices,
        defaultService: availableServices[0]?.service || null,
        message:
          availableServices.length === 0
            ? 'No hay servicios de IA configurados. Configura al menos una API key en las variables de entorno (.env)'
            : `${availableServices.length} servicio(s) disponible(s)`,
      })
    } catch {
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

      const validation = await validateBody(request, configSchema)
      if (!validation.success) {
        return validation.error
      }

      const { preferredService } = validation.data

      // Guardar preferencia del usuario en la base de datos
      if (preferredService) {
        const { prisma } = await import('@/lib/prisma')
        await prisma.user.update({
          where: { id: user.id },
          data: { preferredAIService: preferredService },
        })
      }

      return NextResponse.json({
        message: 'Configuración actualizada',
        preferredService,
      })
    } catch {
      return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
    }
  })
}
