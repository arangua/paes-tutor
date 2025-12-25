/**
 * Servicio Unificado de IA
 *
 * Permite usar ChatGPT (OpenAI), Claude (Anthropic) o Gemini (Google)
 * con API keys configuradas por usuario o globalmente
 */

import Anthropic from '@anthropic-ai/sdk'
import { logger } from './logger'
// Nota: OpenAI y Gemini SDK se pueden agregar después si es necesario
// import OpenAI from 'openai'
// import { GoogleGenerativeAI } from '@google/generative-ai'

export type AIService = 'openai' | 'anthropic' | 'gemini'

export interface AIConfig {
  service: AIService
  apiKey: string
  model?: string
}

export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIResponse {
  content: string
  service: AIService
  model: string
  tokensUsed?: number
}

/**
 * Obtiene la configuración de IA desde base de datos del usuario o variables de entorno
 */
export async function getAIConfig(
  userId?: string,
  preferredService?: AIService
): Promise<AIConfig | null> {
  // Prioridad:
  // 1. Configuración del usuario (si userId está disponible)
  // 2. Variables de entorno globales
  // 3. Servicio preferido si está disponible

  const services: AIService[] = ['anthropic', 'openai', 'gemini']

  // Si hay userId, buscar configuración del usuario
  let userConfig: {
    openaiApiKey?: string | null
    anthropicApiKey?: string | null
    geminiApiKey?: string | null
    preferredAIService?: string | null
  } | null = null

  if (userId) {
    try {
      const { prisma } = await import('@/lib/prisma')
      const { decrypt } = await import('@/lib/encryption')

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          openaiApiKey: true,
          anthropicApiKey: true,
          geminiApiKey: true,
          preferredAIService: true,
        },
      })

      if (user) {
        // Desencriptar cada API key de forma segura
        let openaiApiKey: string | null = null
        let anthropicApiKey: string | null = null
        let geminiApiKey: string | null = null

        if (user.openaiApiKey) {
          try {
            openaiApiKey = decrypt(user.openaiApiKey)
          } catch (error) {
            logger.warn(
              {
                error: error instanceof Error ? error.message : String(error),
                userId,
                keyType: 'openai',
              },
              'No se pudo desencriptar OpenAI API key del usuario'
            )
          }
        }

        if (user.anthropicApiKey) {
          try {
            anthropicApiKey = decrypt(user.anthropicApiKey)
          } catch (error) {
            logger.warn(
              {
                error: error instanceof Error ? error.message : String(error),
                userId,
                keyType: 'anthropic',
              },
              'No se pudo desencriptar Anthropic API key del usuario'
            )
          }
        }

        if (user.geminiApiKey) {
          try {
            geminiApiKey = decrypt(user.geminiApiKey)
          } catch (error) {
            logger.warn(
              {
                error: error instanceof Error ? error.message : String(error),
                userId,
                keyType: 'gemini',
              },
              'No se pudo desencriptar Gemini API key del usuario'
            )
          }
        }

        userConfig = {
          openaiApiKey,
          anthropicApiKey,
          geminiApiKey,
          preferredAIService: user.preferredAIService,
        }
      }
    } catch (error) {
      // Si falla, continuar con variables de entorno
      logger.error(
        {
          error: error instanceof Error ? error.message : String(error),
          userId,
        },
        'Error al obtener configuración de usuario'
      )
    }
  }

  // Determinar orden de servicios
  const userPreferredService = userConfig?.preferredAIService as AIService | undefined
  const finalPreferredService = preferredService || userPreferredService
  const serviceOrder = finalPreferredService
    ? [finalPreferredService, ...services.filter(s => s !== finalPreferredService)]
    : services

  // Intentar cada servicio en orden
  for (const service of serviceOrder) {
    let apiKey: string | undefined

    // Primero intentar con configuración del usuario
    if (userConfig) {
      switch (service) {
        case 'anthropic':
          apiKey = userConfig.anthropicApiKey || undefined
          break
        case 'openai':
          apiKey = userConfig.openaiApiKey || undefined
          break
        case 'gemini':
          apiKey = userConfig.geminiApiKey || undefined
          break
      }
    }

    // Si no hay configuración de usuario, usar variables de entorno
    if (!apiKey) {
      switch (service) {
        case 'anthropic':
          apiKey = process.env.ANTHROPIC_API_KEY
          break
        case 'openai':
          apiKey = process.env.OPENAI_API_KEY
          break
        case 'gemini':
          apiKey = process.env.GEMINI_API_KEY
          break
      }
    }

    if (apiKey) {
      return {
        service,
        apiKey,
        model: getDefaultModel(service),
      }
    }
  }

  return null
}

function getDefaultModel(service: AIService): string {
  switch (service) {
    case 'anthropic':
      return 'claude-3-5-sonnet-20241022'
    case 'openai':
      return 'gpt-4o'
    case 'gemini':
      return 'gemini-pro'
    default:
      return 'claude-3-5-sonnet-20241022'
  }
}

/**
 * Envía un mensaje a un servicio de IA
 */
export async function sendAIMessage(
  messages: AIMessage[],
  config?: AIConfig,
  userId?: string
): Promise<AIResponse> {
  const aiConfig = config || (await getAIConfig(userId))

  if (!aiConfig) {
    throw new Error(
      'No hay configuración de IA disponible. ' +
        'Configura al menos una API key en las variables de entorno o en tu perfil.'
    )
  }

  switch (aiConfig.service) {
    case 'anthropic':
      return await sendToClaude(messages, aiConfig)
    case 'openai':
      return await sendToOpenAI(messages, aiConfig)
    case 'gemini':
      return await sendToGemini(messages, aiConfig)
    default:
      throw new Error(`Servicio de IA no soportado: ${aiConfig.service}`)
  }
}

async function sendToClaude(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
  const anthropic = new Anthropic({
    apiKey: config.apiKey,
  })

  // Convertir mensajes al formato de Claude
  const systemMessage = messages.find(m => m.role === 'system')
  const conversationMessages = messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'user' ? 'user' : 'assistant',
      content: m.content,
    })) as Array<{ role: 'user' | 'assistant'; content: string }>

  const response = await anthropic.messages.create({
    model: config.model || 'claude-3-5-sonnet-20241022',
    max_tokens: 4096,
    system: systemMessage?.content,
    messages: conversationMessages,
  })

  const content = response.content[0]
  if (content.type !== 'text') {
    throw new Error('Respuesta de Claude no es texto')
  }

  return {
    content: content.text,
    service: 'anthropic',
    model: response.model,
    tokensUsed:
      response.usage?.input_tokens && response.usage?.output_tokens
        ? response.usage.input_tokens + response.usage.output_tokens
        : undefined,
  }
}

async function sendToOpenAI(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
  // Necesitarías instalar: npm install openai
  // Por ahora, lanzamos error si no está disponible
  try {
    // Intentar importar dinámicamente
    const { default: OpenAI } = await import('openai')

    const openai = new OpenAI({
      apiKey: config.apiKey,
    })

    const response = await openai.chat.completions.create({
      model: config.model || 'gpt-4o',
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      max_tokens: 4096,
    })

    return {
      content: response.choices[0].message.content || '',
      service: 'openai',
      model: response.model,
      tokensUsed: response.usage?.total_tokens,
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      throw new Error('OpenAI SDK no está instalado. ' + 'Instala con: npm install openai')
    }
    throw error
  }
}

async function sendToGemini(messages: AIMessage[], config: AIConfig): Promise<AIResponse> {
  // Necesitarías instalar: npm install @google/generative-ai
  try {
    // Intentar importar dinámicamente
    const { GoogleGenerativeAI } = await import('@google/generative-ai')

    const genAI = new GoogleGenerativeAI(config.apiKey)
    const model = genAI.getGenerativeModel({ model: config.model || 'gemini-pro' })

    const prompt = messages.map(m => `${m.role}: ${m.content}`).join('\n')
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return {
      content: text,
      service: 'gemini',
      model: config.model || 'gemini-pro',
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes('Cannot find module')) {
      throw new Error(
        'Gemini SDK no está instalado. ' + 'Instala con: npm install @google/generative-ai'
      )
    }
    throw error
  }
}

/**
 * Genera explicaciones de respuestas usando IA
 */
export async function generateExplanation(
  question: string,
  correctAnswer: string,
  studentAnswer?: string,
  topic?: string,
  config?: AIConfig,
  userId?: string
): Promise<string> {
  const systemPrompt = `Eres un tutor experto en preparación para la PAES. 
Tu objetivo es ayudar a los estudiantes a entender por qué una respuesta es correcta o incorrecta.
Sé claro, conciso y pedagógico.`

  const userPrompt = `Pregunta: ${question}

Respuesta correcta: ${correctAnswer}
${studentAnswer ? `Respuesta del estudiante: ${studentAnswer}` : ''}
${topic ? `Tema: ${topic}` : ''}

${
  studentAnswer
    ? `Explica por qué la respuesta correcta es ${correctAnswer} y por qué la respuesta del estudiante (${studentAnswer}) es incorrecta.`
    : `Explica por qué la respuesta correcta es ${correctAnswer}.`
}`

  const response = await sendAIMessage(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    config,
    userId
  )

  return response.content
}

/**
 * Genera recomendaciones de estudio usando IA
 */
export async function generateStudyRecommendations(
  weaknesses: Array<{ topic: string; percentage: number }>,
  strengths: Array<{ topic: string; percentage: number }>,
  config?: AIConfig,
  userId?: string
): Promise<string> {
  const systemPrompt = `Eres un tutor experto en preparación para la PAES.
Genera recomendaciones de estudio personalizadas basadas en las fortalezas y debilidades del estudiante.`

  const userPrompt = `Fortalezas del estudiante (temas con buen rendimiento):
${strengths.map(s => `- ${s.topic}: ${s.percentage}%`).join('\n')}

Debilidades del estudiante (temas que necesitan refuerzo):
${weaknesses.map(w => `- ${w.topic}: ${w.percentage}%`).join('\n')}

Genera recomendaciones específicas y accionables para mejorar en los temas débiles.`

  const response = await sendAIMessage(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    config,
    userId
  )

  return response.content
}
