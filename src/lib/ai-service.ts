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
 * Estructura de explicación paso a paso
 */
export interface StepByStepExplanation {
  steps: Array<{
    number: number
    title: string
    description: string
    formula?: string // Fórmula matemática en LaTeX (opcional)
    explanation: string
  }>
  summary: string
  tips?: string[] // Tips adicionales
  relatedConcepts?: string[] // Conceptos relacionados
}

/**
 * Genera explicaciones paso a paso usando IA
 * Especialmente útil para matemáticas y problemas complejos
 */
export async function generateStepByStepExplanation(
  question: string,
  correctAnswer: string,
  studentAnswer?: string,
  topic?: string,
  subject?: string,
  config?: AIConfig,
  userId?: string
): Promise<StepByStepExplanation> {
  const systemPrompt = `Eres un tutor experto en preparación para la PAES, especializado en explicaciones paso a paso.
Tu objetivo es ayudar a los estudiantes a entender cómo resolver problemas de forma clara y pedagógica.

IMPORTANTE:
- Divide la explicación en pasos numerados claros
- Para matemáticas, incluye fórmulas en formato LaTeX (entre $ para inline, $$ para display)
- Sé específico y muestra el proceso de razonamiento
- Incluye un resumen final
- Si es relevante, menciona conceptos relacionados o tips útiles

Formato de respuesta (JSON):
{
  "steps": [
    {
      "number": 1,
      "title": "Título del paso",
      "description": "Descripción breve",
      "formula": "fórmula en LaTeX (opcional)",
      "explanation": "Explicación detallada del paso"
    }
  ],
  "summary": "Resumen final",
  "tips": ["tip 1", "tip 2"],
  "relatedConcepts": ["concepto 1", "concepto 2"]
}`

  const isMath =
    subject?.toLowerCase().includes('matemática') ||
    subject?.toLowerCase().includes('matematicas') ||
    topic?.toLowerCase().includes('álgebra') ||
    topic?.toLowerCase().includes('geometría') ||
    topic?.toLowerCase().includes('cálculo') ||
    question.match(/[0-9]+\s*[+\-×÷=<>≤≥]/) // Detecta operaciones matemáticas

  const userPrompt = `Pregunta: ${question}

Respuesta correcta: ${correctAnswer}
${studentAnswer ? `Respuesta del estudiante: ${studentAnswer}` : ''}
${topic ? `Tema: ${topic}` : ''}
${subject ? `Asignatura: ${subject}` : ''}

${
  isMath
    ? `Esta es una pregunta de matemáticas. Proporciona una explicación paso a paso detallada con fórmulas en LaTeX cuando sea necesario.`
    : `Proporciona una explicación paso a paso clara y estructurada.`
}

${
  studentAnswer
    ? `Explica paso a paso por qué la respuesta correcta es ${correctAnswer} y dónde está el error en la respuesta del estudiante (${studentAnswer}).`
    : `Explica paso a paso cómo llegar a la respuesta correcta ${correctAnswer}.`
}

Responde SOLO con un JSON válido, sin texto adicional antes o después.`

  try {
    const response = await sendAIMessage(
      [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      config,
      userId
    )

    // Intentar parsear la respuesta como JSON
    let parsed: StepByStepExplanation
    try {
      // Limpiar la respuesta (puede tener markdown code blocks)
      let cleaned = response.content.trim()
      if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
      } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/```\n?/g, '')
      }

      parsed = JSON.parse(cleaned)
    } catch (parseError) {
      // Si falla el parseo, crear una estructura básica desde el texto
      logger.warn(
        { error: parseError, content: response.content },
        'Error parsing step-by-step explanation, creating fallback'
      )

      const lines = response.content.split('\n').filter(l => l.trim())
      const steps = lines
        .map((line) => {
          // Intentar detectar pasos numerados
          const stepMatch = line.match(/^(\d+)[.)]\s*(.+)/)
          if (stepMatch) {
            return {
              number: parseInt(stepMatch[1]),
              title: `Paso ${stepMatch[1]}`,
              description: stepMatch[2].substring(0, 100),
              explanation: stepMatch[2],
            }
          }
          return null
        })
        .filter((s): s is NonNullable<typeof s> => s !== null)
        .slice(0, 5) // Máximo 5 pasos

      parsed = {
        steps:
          steps.length > 0
            ? steps
            : [
                {
                  number: 1,
                  title: 'Explicación',
                  description: 'Análisis del problema',
                  explanation: response.content,
                },
              ],
        summary: 'Revisa cada paso cuidadosamente para entender el proceso completo.',
      }
    }

    // Validar y normalizar la estructura
    if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
      throw new Error('Invalid step structure')
    }

    // Asegurar que los pasos tengan números secuenciales
    parsed.steps = parsed.steps.map((step, index) => ({
      ...step,
      number: step.number || index + 1,
      title: step.title || `Paso ${index + 1}`,
      description: step.description || step.explanation.substring(0, 100),
      explanation: step.explanation || step.description || '',
    }))

    return parsed
  } catch (error) {
    logger.error(
      {
        type: 'step_by_step_explanation_error',
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      'Error al generar explicación paso a paso'
    )

    // Retornar una explicación básica como fallback
    return {
      steps: [
        {
          number: 1,
          title: 'Análisis',
          description: 'Análisis del problema',
          explanation: `La respuesta correcta es ${correctAnswer}. ${studentAnswer ? `Tu respuesta fue ${studentAnswer}, que es incorrecta. ` : ''}${question}`,
        },
      ],
      summary: 'Revisa la pregunta y la explicación proporcionada para entender mejor el concepto.',
    }
  }
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
