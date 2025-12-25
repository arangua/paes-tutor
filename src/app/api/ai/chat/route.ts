import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import {
  sendAIMessage,
  generateExplanation,
  generateStudyRecommendations,
  type AIMessage,
  type AIService,
} from '@/lib/ai-service'
import { z } from 'zod'
import { validateBody } from '@/lib/api-helpers'
import { logger } from '@/lib/logger'

export const runtime = 'nodejs'

const chatSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string(),
    })
  ),
  service: z.enum(['openai', 'anthropic', 'gemini']).optional(),
  model: z.string().optional(),
})

const explanationSchema = z.object({
  question: z.string(),
  correctAnswer: z.string(),
  studentAnswer: z.string().optional(),
  topic: z.string().optional(),
  service: z.enum(['openai', 'anthropic', 'gemini']).optional(),
})

const recommendationsSchema = z.object({
  weaknesses: z.array(
    z.object({
      topic: z.string(),
      percentage: z.number(),
    })
  ),
  strengths: z.array(
    z.object({
      topic: z.string(),
      percentage: z.number(),
    })
  ),
  service: z.enum(['openai', 'anthropic', 'gemini']).optional(),
})

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const body = await request.json()
      const { type, ...data } = body

      if (type === 'chat') {
        const validation = await validateBody(
          new NextRequest(request.url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: request.headers,
          }),
          chatSchema
        )

        if (!validation.success) {
          return validation.error
        }

        const { messages, service, model } = validation.data

        const response = await sendAIMessage(
          messages as AIMessage[],
          service ? { service: service as AIService, apiKey: '', model } : undefined,
          studentId
        )

        return NextResponse.json(response)
      }

      if (type === 'explanation') {
        const validation = await validateBody(
          new NextRequest(request.url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: request.headers,
          }),
          explanationSchema
        )

        if (!validation.success) {
          return validation.error
        }

        const { question, correctAnswer, studentAnswer, topic, service } = validation.data

        const explanation = await generateExplanation(
          question,
          correctAnswer,
          studentAnswer,
          topic,
          service ? { service: service as AIService, apiKey: '' } : undefined,
          studentId
        )

        return NextResponse.json({ explanation })
      }

      if (type === 'recommendations') {
        const validation = await validateBody(
          new NextRequest(request.url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: request.headers,
          }),
          recommendationsSchema
        )

        if (!validation.success) {
          return validation.error
        }

        const { weaknesses, strengths, service } = validation.data

        const recommendations = await generateStudyRecommendations(
          weaknesses,
          strengths,
          service ? { service: service as AIService, apiKey: '' } : undefined,
          studentId
        )

        return NextResponse.json({ recommendations })
      }

      return NextResponse.json(
        { error: 'Tipo de solicitud no válido. Use: chat, explanation, o recommendations' },
        { status: 400 }
      )
    } catch (error) {
      let requestType = 'unknown'
      try {
        const body = await request.json().catch((error) => {
          // Log error de parsing JSON
          logger.warn(
            {
              error: error instanceof Error ? error.message : String(error),
              path: request.nextUrl.pathname,
            },
            'Error al parsear JSON de body en API de IA'
          )
          return {}
        })
        requestType = body.type || 'unknown'
      } catch {
        // Ignorar error al leer body
      }

      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          stack: error instanceof Error ? error.stack : undefined,
          studentId,
          type: requestType,
        },
        'Error en API de IA'
      )
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : 'Error al procesar solicitud de IA',
          details:
            process.env.NODE_ENV === 'development'
              ? error instanceof Error
                ? error.stack
                : String(error)
              : undefined,
        },
        { status: 500 }
      )
    }
  })
}
