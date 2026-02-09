/**
 * Generador de Exámenes con IA
 *
 * Genera exámenes automáticamente basados en temarios y la malla curricular chilena
 */

import { getAIConfig, sendAIMessage, type AIMessage } from './ai-service'
import { prisma } from './prisma'
import { logger } from './logger'
import type { Prisma } from '@prisma/client'
import { LIMIT_CONSTANTS, EXAM_CONSTANTS } from './constants'

function setRecordValue(target: Record<number, string>, key: number, value: string) {
  Object.defineProperty(target, key, { value, enumerable: true, configurable: true, writable: true })
}

export interface ExamGenerationParams {
  subjectId: string
  topicIds?: string[] // Si no se especifica, usa la lista completa de temas del subject
  numQuestions: number // Número de preguntas a generar
  difficulty?: 'baja' | 'media' | 'alta' | 'mixta'
  tipo?: 'objetiva' | 'desarrollo' | 'mixta'
  userId?: string
  includeAnswerKey?: boolean // Si true, genera también el clavijero
}

export interface GeneratedQuestion {
  enunciado: string
  opciones: Array<{
    letra: string
    texto: string
    esCorrecta: boolean
  }>
  explicacion: string
  dificultad: number // 1-5
  topicId?: string
  ejeTematico?: string
}

export interface GeneratedExam {
  titulo: string
  descripcion: string
  questions: GeneratedQuestion[]
  answerKey?: {
    [questionIndex: number]: string // Índice de pregunta -> letra correcta
  }
}

/**
 * Obtiene información del temario para el contexto de generación
 * 
 * @param subjectId - ID de la asignatura
 * @param topicIds - IDs opcionales de temas específicos. Si no se proporciona, obtiene la lista completa de temas de la asignatura
 * @returns Contexto con información de la asignatura, temas y materiales de estudio
 * @throws Error si la asignatura no existe o no tiene temas
 */
async function getTopicContext(subjectId: string, topicIds?: string[]) {
  const where: Prisma.TopicWhereInput = { subjectId }
  // Solo filtrar por topicIds si está definido y no está vacío
  if (topicIds && Array.isArray(topicIds) && topicIds.length > 0) {
    where.id = { in: topicIds }
  }

  const topics = await prisma.topic.findMany({
    where,
    include: {
      subject: {
        select: {
          nombre: true,
          codigo: true,
          tipo: true,
        },
      },
    },
    orderBy: [{ ejeTematico: 'asc' }, { nombre: 'asc' }],
  })

  // Obtener materiales de estudio relacionados
  const materials = await prisma.studyMaterial.findMany({
    where: {
      subjectId,
      ...(topicIds && Array.isArray(topicIds) && topicIds.length > 0
        ? { topicId: { in: topicIds } }
        : {}),
    },
    select: {
      titulo: true,
      contenido: true,
      topic: {
        select: {
          ejeTematico: true,
        },
      },
    },
    take: LIMIT_CONSTANTS.MAX_MATERIALS_CONTEXT, // Limitar materiales más relevantes
  })

  return {
    topics,
    materials,
    subject: topics[0]?.subject,
  }
}

/**
 * Construye el prompt para la generación de examen
 */
function buildPromptForExamGeneration(
  context: Awaited<ReturnType<typeof getTopicContext>>,
  params: ExamGenerationParams
): AIMessage[] {
  const { numQuestions, difficulty = 'mixta', tipo = 'objetiva' } = params
  const { subject, topics, materials } = context

  if (!subject) {
    throw new Error('Subject no encontrado en el contexto')
  }

  const topicsText = topics
    .map(t => {
      const descriptionSuffix = t.descripcion ? `: ${t.descripcion}` : ''
      return `- ${t.nombre} (Eje: ${t.ejeTematico})${descriptionSuffix}`
    })
    .join('\n')

  const materialsText = materials
    .map(
      m => {
        const ejeSuffix = m.topic?.ejeTematico ? ` (Eje: ${m.topic.ejeTematico})` : ''
        return `- ${m.titulo}${ejeSuffix}: ${m.contenido.substring(0, EXAM_CONSTANTS.MATERIAL_PREVIEW_LENGTH)}...`
      }
    )
    .join('\n')

  const materialsSection =
    materials.length > 0 ? `\nMATERIALES DE ESTUDIO DE REFERENCIA:\n${materialsText}` : ''

  let examTypeText = 'Mixto (objetivas y desarrollo)'
  if (tipo === 'objetiva') {
    examTypeText = 'Preguntas de opción múltiple (4 opciones A, B, C, D)'
  } else if (tipo === 'desarrollo') {
    examTypeText = 'Preguntas de desarrollo (sin opciones múltiples)'
  }

  let difficultyText = 'Mixta (distribución equilibrada)'
  if (difficulty === 'baja') difficultyText = 'Baja (nivel básico)'
  else if (difficulty === 'media') difficultyText = 'Media (nivel intermedio)'
  else if (difficulty === 'alta') difficultyText = 'Alta (nivel avanzado)'

  const optionsRequirement =
    tipo === 'objetiva' || tipo === 'mixta'
      ? '* 4 opciones (A, B, C, D) si es objetiva\n  * Una opción correcta claramente identificada'
      : '* NO debe incluir opciones múltiples (es pregunta de desarrollo)'

  const questionExampleObjetiva = `{
      "enunciado": "Texto de la pregunta",
      "opciones": [
        {"letra": "A", "texto": "Opción A", "esCorrecta": false},
        {"letra": "B", "texto": "Opción B", "esCorrecta": true},
        {"letra": "C", "texto": "Opción C", "esCorrecta": false},
        {"letra": "D", "texto": "Opción D", "esCorrecta": false}
      ],
      "explicacion": "Explicación detallada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`

  const questionExampleDesarrollo = `{
      "enunciado": "Texto de la pregunta de desarrollo",
      "opciones": [],
      "explicacion": "Explicación de la respuesta esperada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`

  const questionExampleMixta = `{
      "enunciado": "Texto de la pregunta",
      "opciones": [opciones solo si es objetiva, vacío [] si es desarrollo],
      "explicacion": "Explicación detallada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`

  let questionExample = questionExampleMixta
  if (tipo === 'objetiva') questionExample = questionExampleObjetiva
  else if (tipo === 'desarrollo') questionExample = questionExampleDesarrollo

  let tipoSpecificRules =
    '- Las preguntas objetivas deben tener 4 opciones (A, B, C, D)\n- Las preguntas de desarrollo NO deben tener opciones\n- Solo una opción debe ser correcta por pregunta objetiva'
  if (tipo === 'objetiva') {
    tipoSpecificRules =
      '- Cada pregunta debe tener exactamente 4 opciones (A, B, C, D)\n- Solo una opción debe ser correcta por pregunta'
  } else if (tipo === 'desarrollo') {
    tipoSpecificRules =
      '- Las preguntas de desarrollo NO deben tener opciones múltiples\n- Deben requerir respuestas escritas o desarrolladas'
  }

  const systemPrompt = `Eres un experto en educación chilena especializado en la Prueba de Acceso a la Educación Superior (PAES) y la malla curricular establecida por el Ministerio de Educación de Chile (MINEDUC).

Tu tarea es generar exámenes de alta calidad que:
1. Estén alineados con la malla curricular vigente de Chile
2. Sigan el formato y estilo de la PAES
3. Cubran los temas y ejes temáticos especificados
4. Tengan preguntas claras, precisas y pedagógicamente válidas
5. Incluyan explicaciones educativas para cada respuesta

IMPORTANTE: Las preguntas deben ser apropiadas para estudiantes de 4° medio y estar alineadas con los Objetivos de Aprendizaje (OA) del MINEDUC.`

  const userPrompt = `Genera un examen de ${numQuestions} preguntas para la asignatura "${subject.nombre}" (${subject.codigo}).

TEMAS Y EJES TEMÁTICOS A CUBRIR:
${topicsText}

${materialsSection}

REQUISITOS:
- Tipo de examen: ${examTypeText}
- Dificultad: ${difficultyText}
- Cada pregunta debe tener:
  * Un enunciado claro y conciso
  ${optionsRequirement}
  * Una explicación educativa de por qué la respuesta es correcta
  * Nivel de dificultad (1-5)
  * Asociación a un tema específico del temario

FORMATO DE RESPUESTA (JSON):
{
  "titulo": "Título del examen",
  "descripcion": "Descripción breve del examen",
  "questions": [
    ${questionExample}
  ]
}

IMPORTANTE:
- Las preguntas deben estar alineadas con la malla curricular chilena
- Deben ser apropiadas para estudiantes de 4° medio
- Debe haber exactamente ${numQuestions} preguntas
${tipoSpecificRules}
- Las explicaciones deben ser educativas y claras`

  return [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]
}

/**
 * Parsea la respuesta de la IA y extrae el JSON del examen
 */
function parseAIResponse(response: {
  content: string
  service: string
  model: string
}): GeneratedExam {
  try {
    // Intentar extraer JSON de la respuesta
    const start = response.content.indexOf('{')
    const end = response.content.lastIndexOf('}')
    if (start < 0 || end < 0 || end <= start) throw new Error('No se encontró JSON en la respuesta')
    const jsonText = response.content.slice(start, end + 1)
    return JSON.parse(jsonText)
  } catch (parseError) {
    logger.error(
      {
        error: parseError instanceof Error ? parseError.message : String(parseError),
        responseLength: response.content.length,
        responsePreview: response.content.substring(0, EXAM_CONSTANTS.AI_RESPONSE_PREVIEW_LENGTH),
        service: response.service,
        model: response.model,
      },
      'Error al parsear respuesta de IA'
    )
    throw new Error('La IA no generó un formato válido. Intenta nuevamente.')
  }
}

/**
 * Valida y corrige las preguntas del examen generado
 */
function validateAndFixQuestions(
  questions: GeneratedQuestion[],
  tipo: ExamGenerationParams['tipo'],
  numQuestions: number,
  context: Awaited<ReturnType<typeof getTopicContext>>
): GeneratedQuestion[] {
  // Validar número de preguntas
  if (questions.length !== numQuestions) {
    logger.warn(
      {
        expected: numQuestions,
        actual: questions.length,
        tipo,
      },
      `Se generaron ${questions.length} preguntas en lugar de ${numQuestions}`
    )
  }

   
  return questions.map((q, index) => {
    // Para tipo mixta, algunas preguntas pueden ser de desarrollo (sin opciones)
    // Para tipo objetiva, todas deben tener opciones
    // Para tipo desarrollo, ninguna debe tener opciones

    if (tipo === 'objetiva') {
      // Todas las preguntas objetivas deben tener 4 opciones
      if (!q.opciones || q.opciones.length !== EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT) {
        throw new Error(
          `La pregunta ${index + 1} no tiene ${EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT} opciones (tipo objetiva requiere opciones)`
        )
      }

      // Asegurar que hay exactamente una opción correcta
      const correctCount = q.opciones.filter(o => o.esCorrecta).length
      if (correctCount !== 1) {
        // Si no hay ninguna correcta o hay más de una, marcar la primera como correcta
        q.opciones.forEach((opt, i) => {
          opt.esCorrecta = i === 0
        })
      }

      // Asegurar que las letras sean A, B, C, D
      q.opciones = q.opciones.map((opt, i) => ({
        ...opt,
        letra: EXAM_CONSTANTS.OPTION_LETTERS.at(i) ?? 'A',
      }))
    } else if (tipo === 'mixta') {
      // Para tipo mixta, validar si tiene opciones (es objetiva) o no (es desarrollo)
      if (q.opciones && q.opciones.length > 0) {
        // Es pregunta objetiva, debe tener 4 opciones
        if (q.opciones.length !== EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT) {
          // Si no tiene 4, intentar corregir o eliminar opciones
          if (q.opciones.length < EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT) {
            // No tiene suficientes opciones, convertir a desarrollo
            q.opciones = []
          } else {
            // Tiene más de 4, tomar las primeras 4
            q.opciones = q.opciones.slice(0, EXAM_CONSTANTS.REQUIRED_OPTIONS_COUNT)
          }
        }

        // Asegurar que hay exactamente una opción correcta
        const correctCount = q.opciones.filter(o => o.esCorrecta).length
        if (correctCount !== 1 && q.opciones.length > 0) {
          q.opciones.forEach((opt, i) => {
            opt.esCorrecta = i === 0
          })
        }

        // Asegurar que las letras sean A, B, C, D
        q.opciones = q.opciones.map((opt, i) => ({
          ...opt,
          letra: EXAM_CONSTANTS.OPTION_LETTERS.at(i) ?? 'A',
        }))
      } else {
        // Es pregunta de desarrollo, no requiere opciones
        q.opciones = []
      }
    } else {
      // Para preguntas de desarrollo, no se requieren opciones
      q.opciones = []
    }

    // Asociar con tema si no está asociado
    if (!q.topicId && context.topics.length > 0) {
      // Buscar tema por nombre o eje temático con múltiples estrategias de coincidencia
      const ejeTematicoLower = q.ejeTematico?.toLowerCase() || ''
      
      // Estrategia 1: Coincidencia exacta de eje temático (más precisa)
      let matchingTopic = context.topics.find(
        t => t.ejeTematico?.toLowerCase() === ejeTematicoLower
      )
      
      // Estrategia 2: Coincidencia parcial de eje temático
      if (!matchingTopic) {
        matchingTopic = context.topics.find(
          t =>
            t.ejeTematico?.toLowerCase().includes(ejeTematicoLower) ||
            ejeTematicoLower.includes(t.ejeTematico?.toLowerCase() || '')
        )
      }
      
      // Estrategia 3: Coincidencia por nombre del tema
      if (!matchingTopic) {
        matchingTopic = context.topics.find(
          t =>
            t.nombre.toLowerCase().includes(ejeTematicoLower) ||
            ejeTematicoLower.includes(t.nombre.toLowerCase())
        )
      }
      
      if (matchingTopic) {
        q.topicId = matchingTopic.id
        q.ejeTematico = matchingTopic.ejeTematico
      } else {
        // Asignar el primer tema disponible si no hay coincidencia (más determinístico que aleatorio)
        const firstTopic = context.topics[0]
        q.topicId = firstTopic.id
        q.ejeTematico = firstTopic.ejeTematico
      }
    }

    return q
  })
}

/**
 * Genera el clavijero (answer key) para las preguntas objetivas
 */
function generateAnswerKey(questions: GeneratedQuestion[]): Record<number, string> {
  const answerKey: Record<number, string> = {}
  questions.forEach((q, index) => {
    // Solo agregar al clavijero si tiene opciones (preguntas objetivas)
    if (q.opciones && q.opciones.length > 0) {
      const correctOption = q.opciones.find(o => o.esCorrecta)
      if (correctOption) {
        setRecordValue(answerKey, index, correctOption.letra)
      }
    }
    // Las preguntas de desarrollo no se incluyen en el clavijero
  })
  return answerKey
}

/**
 * Valida que el contexto del temario sea válido para generar el examen
 */
function validateTopicContext(
  context: Awaited<ReturnType<typeof getTopicContext>>,
  subjectId: string
): void {
  if (!context.subject) {
    throw new Error(`No se encontró la asignatura con ID: ${subjectId}`)
  }

  if (context.topics.length === 0) {
    throw new Error(
      `No se encontraron temas para la asignatura "${context.subject.nombre}". Por favor, importa un temario primero.`
    )
  }
}

/**
 * Valida y obtiene la configuración de IA del usuario
 */
async function validateAndGetAIConfig(userId?: string) {
  const aiConfig = await getAIConfig(userId)
  if (!aiConfig) {
    throw new Error(
      'No hay configuración de IA disponible. Por favor, configura tus API keys en tu perfil.'
    )
  }
  return aiConfig
}

/**
 * Valida la estructura básica del examen generado
 */
function validateExamStructure(examData: GeneratedExam): void {
  if (!examData.questions || !Array.isArray(examData.questions)) {
    throw new Error('El examen generado no tiene preguntas válidas')
  }

  if (examData.questions.length === 0) {
    throw new Error('El examen generado no contiene preguntas')
  }
}

/**
 * Procesa el examen generado: valida, corrige y genera clavijero si es necesario
 */
function processGeneratedExam(
  examData: GeneratedExam,
  params: ExamGenerationParams,
  context: Awaited<ReturnType<typeof getTopicContext>>
): GeneratedExam {
  // Validar estructura básica
  validateExamStructure(examData)

  // Validar y corregir preguntas
  examData.questions = validateAndFixQuestions(
    examData.questions,
    params.tipo,
    params.numQuestions,
    context
  )

  // Generar clavijero si se solicita
  if (params.includeAnswerKey) {
    examData.answerKey = generateAnswerKey(examData.questions)
  }

  return examData
}

/**
 * Genera un examen usando IA basado en temarios
 *
 * Esta función orquesta el proceso completo de generación:
 * 1. Obtiene y valida el contexto del temario
 * 2. Obtiene y valida la configuración de IA
 * 3. Construye el prompt y genera el examen con IA
 * 4. Parsea, valida y procesa el examen generado
 * 
 * @param params - Parámetros de generación del examen
 * @param params.subjectId - ID de la asignatura
 * @param params.topicIds - IDs opcionales de temas específicos
 * @param params.numQuestions - Número de preguntas a generar
 * @param params.difficulty - Nivel de dificultad ('baja', 'media', 'alta', 'mixta')
 * @param params.tipo - Tipo de examen ('objetiva', 'desarrollo', 'mixta')
 * @param params.userId - ID del usuario que solicita la generación
 * @param params.includeAnswerKey - Si true, genera también el clavijero con respuestas correctas
 * @returns Examen generado con preguntas validadas y procesadas
 * @throws Error si falla la validación del contexto, la configuración de IA, o la generación del examen
 * 
 * @example
 * ```typescript
 * const exam = await generateExamWithAI({
 *   subjectId: 'c123...',
 *   numQuestions: 20,
 *   difficulty: 'media',
 *   tipo: 'objetiva',
 *   userId: 'c456...',
 *   includeAnswerKey: true
 * })
 * ```
 */
export async function generateExamWithAI(params: ExamGenerationParams): Promise<GeneratedExam> {
  const { subjectId, topicIds, userId } = params

  try {
    // 1. Obtener y validar contexto del temario
    const context = await getTopicContext(subjectId, topicIds)
    validateTopicContext(context, subjectId)

    // 2. Obtener y validar configuración de IA
    const aiConfig = await validateAndGetAIConfig(userId)

    // 3. Construir prompt y generar examen con IA
    const messages = buildPromptForExamGeneration(context, params)
    const response = await sendAIMessage(messages, aiConfig, userId)

    // 4. Parsear respuesta JSON
    const examData = parseAIResponse(response)

    // 5. Procesar examen (validar, corregir, generar clavijero)
    return processGeneratedExam(examData, params, context)
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        subjectId,
        numQuestions: params.numQuestions,
        tipo: params.tipo,
        difficulty: params.difficulty,
        userId,
      },
      'Error al generar examen con IA'
    )
    throw error instanceof Error ? error : new Error('Error desconocido al generar examen')
  }
}
