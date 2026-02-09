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

type UserAISettingsRow = {
  openaiApiKey: string | null
  anthropicApiKey: string | null
  geminiApiKey: string | null
  preferredAIService: string | null
}

type DecryptFn = (value: string) => string

function safeDecryptApiKey(params: {
  encrypted: string
  decrypt: DecryptFn
  userId: string
  keyType: 'openai' | 'anthropic' | 'gemini'
}): string | null {
  const { encrypted, decrypt, userId, keyType } = params
  try {
    return decrypt(encrypted)
  } catch (error) {
    logger.warn(
      {
        error: error instanceof Error ? error.message : String(error),
        userId,
        keyType,
      },
      `No se pudo desencriptar ${keyType} API key del usuario`
    )
    return null
  }
}

function buildUserConfigFromDbUser(params: {
  user: UserAISettingsRow
  decrypt: DecryptFn
  userId: string
}): {
  openaiApiKey?: string | null
  anthropicApiKey?: string | null
  geminiApiKey?: string | null
  preferredAIService?: string | null
} {
  const { user, decrypt, userId } = params
  return {
    openaiApiKey: user.openaiApiKey
      ? safeDecryptApiKey({ encrypted: user.openaiApiKey, decrypt, userId, keyType: 'openai' })
      : null,
    anthropicApiKey: user.anthropicApiKey
      ? safeDecryptApiKey({
          encrypted: user.anthropicApiKey,
          decrypt,
          userId,
          keyType: 'anthropic',
        })
      : null,
    geminiApiKey: user.geminiApiKey
      ? safeDecryptApiKey({ encrypted: user.geminiApiKey, decrypt, userId, keyType: 'gemini' })
      : null,
    preferredAIService: user.preferredAIService,
  }
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
        userConfig = buildUserConfigFromDbUser({
          user: user as UserAISettingsRow,
          decrypt,
          userId,
        })
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
  const userApiKeys: Partial<Record<AIService, string | undefined>> = userConfig
    ? {
        anthropic: userConfig.anthropicApiKey || undefined,
        openai: userConfig.openaiApiKey || undefined,
        gemini: userConfig.geminiApiKey || undefined,
      }
    : {}

  const envApiKeys: Partial<Record<AIService, string | undefined>> = {
    anthropic: process.env.ANTHROPIC_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    gemini: process.env.GEMINI_API_KEY,
  }

  for (const service of serviceOrder) {
    // Primero intentar con configuración del usuario, luego variables de entorno
     
    const apiKey = userApiKeys[service] || envApiKeys[service]
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

const STEP_LINE_REGEX = /^(\d+)[.)]\s*(.+)/
const MATH_OPERATORS = ['+', '-', '×', '÷', '=', '<', '>', '≤', '≥'] as const

function isLikelyMathQuestion(params: {
  question: string
  topic?: string
  subject?: string
}): boolean {
  const { question, topic, subject } = params
  const subjectLower = subject?.toLowerCase() || ''
  const topicLower = topic?.toLowerCase() || ''

  const hasMathKeyword =
    subjectLower.includes('matemática') ||
    subjectLower.includes('matematicas') ||
    topicLower.includes('álgebra') ||
    topicLower.includes('geometría') ||
    topicLower.includes('cálculo')

  const hasDigit = /\d/.test(question)
  const hasOperator = MATH_OPERATORS.some(op => question.includes(op))

  return hasMathKeyword || (hasDigit && hasOperator)
}

function stripMarkdownCodeFences(text: string): string {
  let cleaned = text.trim()
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?$/g, '')
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/```\n?/g, '')
  }
  return cleaned
}

function buildFallbackStepsFromText(text: string, maxSteps: number): StepByStepExplanation['steps'] {
  const lines = text.split('\n').filter(l => l.trim())
  const steps = lines
    .map((line) => {
      const stepMatch = STEP_LINE_REGEX.exec(line)
      if (!stepMatch) return null
      return {
        number: parseInt(stepMatch[1]),
        title: `Paso ${stepMatch[1]}`,
        description: stepMatch[2].substring(0, 100),
        explanation: stepMatch[2],
      }
    })
    .filter((s): s is NonNullable<typeof s> => s !== null)
    .slice(0, maxSteps)

  if (steps.length > 0) return steps

  return [
    {
      number: 1,
      title: 'Explicación',
      description: 'Análisis del problema',
      explanation: text,
    },
  ]
}

function normalizeStepByStepExplanation(parsed: StepByStepExplanation): StepByStepExplanation {
  if (!parsed.steps || !Array.isArray(parsed.steps) || parsed.steps.length === 0) {
    throw new Error('Invalid step structure')
  }

  return {
    ...parsed,
    steps: parsed.steps.map((step, index) => ({
      ...step,
      number: step.number || index + 1,
      title: step.title || `Paso ${index + 1}`,
      description: step.description || step.explanation.substring(0, 100),
      explanation: step.explanation || step.description || '',
    })),
  }
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

  const isMath = isLikelyMathQuestion({ question, topic, subject })

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
    try {
      const cleaned = stripMarkdownCodeFences(response.content)
      const parsed = JSON.parse(cleaned) as StepByStepExplanation
      return normalizeStepByStepExplanation(parsed)
    } catch (parseError) {
      // Si falla el parseo, crear una estructura básica desde el texto
      logger.warn(
        { error: parseError, content: response.content },
        'Error parsing step-by-step explanation, creating fallback'
      )

      const fallback = {
        steps:
          buildFallbackStepsFromText(response.content, 5),
        summary: 'Revisa cada paso cuidadosamente para entender el proceso completo.',
      }
      return normalizeStepByStepExplanation(fallback)
    }
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
    const studentFeedback = studentAnswer
      ? `Tu respuesta fue ${studentAnswer}, que es incorrecta. `
      : ''
    const fallbackExplanation = `La respuesta correcta es ${correctAnswer}. ${studentFeedback}${question}`
    return {
      steps: [
        {
          number: 1,
          title: 'Análisis',
          description: 'Análisis del problema',
          explanation: fallbackExplanation,
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
