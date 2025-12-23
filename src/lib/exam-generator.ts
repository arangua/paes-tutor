/**
 * Generador de Exámenes con IA
 *
 * Genera exámenes automáticamente basados en temarios y la malla curricular chilena
 */

import { getAIConfig, sendAIMessage, type AIMessage } from './ai-service'
import { prisma } from './prisma'
import { logger } from './logger'

export interface ExamGenerationParams {
  subjectId: string
  topicIds?: string[] // Si no se especifica, usa todos los temas del subject
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
 */
async function getTopicContext(subjectId: string, topicIds?: string[]) {
  const where: any = { subjectId }
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
    take: 10, // Limitar a 10 materiales más relevantes
  })

  return {
    topics,
    materials,
    subject: topics[0]?.subject,
  }
}

/**
 * Genera un examen usando IA basado en temarios
 */
export async function generateExamWithAI(params: ExamGenerationParams): Promise<GeneratedExam> {
  const {
    subjectId,
    topicIds,
    numQuestions,
    difficulty = 'mixta',
    tipo = 'objetiva',
    userId,
    includeAnswerKey = true,
  } = params

  // Obtener contexto del temario
  const context = await getTopicContext(subjectId, topicIds)

  if (!context.subject || context.topics.length === 0) {
    throw new Error('No se encontraron temas para la asignatura seleccionada')
  }

  // Obtener configuración de IA
  const aiConfig = await getAIConfig(userId)
  if (!aiConfig) {
    throw new Error(
      'No hay configuración de IA disponible. Por favor, configura tus API keys en tu perfil.'
    )
  }

  // Construir prompt para la IA
  const topicsText = context.topics
    .map(t => `- ${t.nombre} (Eje: ${t.ejeTematico})${t.descripcion ? `: ${t.descripcion}` : ''}`)
    .join('\n')

  const materialsText = context.materials
    .map(
      m =>
        `- ${m.titulo}${m.topic?.ejeTematico ? ` (Eje: ${m.topic.ejeTematico})` : ''}: ${m.contenido.substring(0, 200)}...`
    )
    .join('\n')

  const systemPrompt = `Eres un experto en educación chilena especializado en la Prueba de Acceso a la Educación Superior (PAES) y la malla curricular establecida por el Ministerio de Educación de Chile (MINEDUC).

Tu tarea es generar exámenes de alta calidad que:
1. Estén alineados con la malla curricular vigente de Chile
2. Sigan el formato y estilo de la PAES
3. Cubran los temas y ejes temáticos especificados
4. Tengan preguntas claras, precisas y pedagógicamente válidas
5. Incluyan explicaciones educativas para cada respuesta

IMPORTANTE: Las preguntas deben ser apropiadas para estudiantes de 4° medio y estar alineadas con los Objetivos de Aprendizaje (OA) del MINEDUC.`

  const userPrompt = `Genera un examen de ${numQuestions} preguntas para la asignatura "${context.subject.nombre}" (${context.subject.codigo}).

TEMAS Y EJES TEMÁTICOS A CUBRIR:
${topicsText}

${context.materials.length > 0 ? `\nMATERIALES DE ESTUDIO DE REFERENCIA:\n${materialsText}` : ''}

REQUISITOS:
- Tipo de examen: ${tipo === 'objetiva' ? 'Preguntas de opción múltiple (4 opciones A, B, C, D)' : tipo === 'desarrollo' ? 'Preguntas de desarrollo (sin opciones múltiples)' : 'Mixto (objetivas y desarrollo)'}
- Dificultad: ${difficulty === 'baja' ? 'Baja (nivel básico)' : difficulty === 'media' ? 'Media (nivel intermedio)' : difficulty === 'alta' ? 'Alta (nivel avanzado)' : 'Mixta (distribución equilibrada)'}
- Cada pregunta debe tener:
  * Un enunciado claro y conciso
  ${tipo === 'objetiva' || tipo === 'mixta' ? '* 4 opciones (A, B, C, D) si es objetiva\n  * Una opción correcta claramente identificada' : '* NO debe incluir opciones múltiples (es pregunta de desarrollo)'}
  * Una explicación educativa de por qué la respuesta es correcta
  * Nivel de dificultad (1-5)
  * Asociación a un tema específico del temario

FORMATO DE RESPUESTA (JSON):
{
  "titulo": "Título del examen",
  "descripcion": "Descripción breve del examen",
  "questions": [
    ${
      tipo === 'objetiva' || tipo === 'mixta'
        ? `{
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
        : tipo === 'desarrollo'
          ? `{
      "enunciado": "Texto de la pregunta de desarrollo",
      "opciones": [],
      "explicacion": "Explicación de la respuesta esperada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`
          : `{
      "enunciado": "Texto de la pregunta",
      "opciones": [opciones solo si es objetiva, vacío [] si es desarrollo],
      "explicacion": "Explicación detallada",
      "dificultad": 3,
      "ejeTematico": "Nombre del eje temático"
    }`
    }
  ]
}

IMPORTANTE:
- Las preguntas deben estar alineadas con la malla curricular chilena
- Deben ser apropiadas para estudiantes de 4° medio
- Debe haber exactamente ${numQuestions} preguntas
${tipo === 'objetiva' ? '- Cada pregunta debe tener exactamente 4 opciones (A, B, C, D)\n- Solo una opción debe ser correcta por pregunta' : tipo === 'desarrollo' ? '- Las preguntas de desarrollo NO deben tener opciones múltiples\n- Deben requerir respuestas escritas o desarrolladas' : '- Las preguntas objetivas deben tener 4 opciones (A, B, C, D)\n- Las preguntas de desarrollo NO deben tener opciones\n- Solo una opción debe ser correcta por pregunta objetiva'}
- Las explicaciones deben ser educativas y claras`

  const messages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]

  try {
    // Generar examen con IA
    const response = await sendAIMessage(messages, aiConfig, userId)

    // Parsear respuesta JSON
    let examData: GeneratedExam
    try {
      // Intentar extraer JSON de la respuesta
      const jsonMatch = response.content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        examData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No se encontró JSON en la respuesta')
      }
    } catch (parseError) {
      logger.error(
        {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          responseLength: response.content.length,
          responsePreview: response.content.substring(0, 500),
          service: response.service,
          model: response.model,
        },
        'Error al parsear respuesta de IA'
      )
      throw new Error('La IA no generó un formato válido. Intenta nuevamente.')
    }

    // Validar estructura
    if (!examData.questions || !Array.isArray(examData.questions)) {
      throw new Error('El examen generado no tiene preguntas válidas')
    }

    // Validar número de preguntas
    if (examData.questions.length !== numQuestions) {
      logger.warn(
        {
          expected: numQuestions,
          actual: examData.questions.length,
          subjectId,
          tipo,
        },
        `Se generaron ${examData.questions.length} preguntas en lugar de ${numQuestions}`
      )
    }

    // Validar y corregir opciones (solo para preguntas objetivas)
    examData.questions = examData.questions.map((q, index) => {
      // Para tipo mixta, algunas preguntas pueden ser de desarrollo (sin opciones)
      // Para tipo objetiva, todas deben tener opciones
      // Para tipo desarrollo, ninguna debe tener opciones

      if (tipo === 'objetiva') {
        // Todas las preguntas objetivas deben tener 4 opciones
        if (!q.opciones || q.opciones.length !== 4) {
          throw new Error(
            `La pregunta ${index + 1} no tiene 4 opciones (tipo objetiva requiere opciones)`
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
        const letters = ['A', 'B', 'C', 'D']
        q.opciones = q.opciones.map((opt, i) => ({
          ...opt,
          letra: letters[i],
        }))
      } else if (tipo === 'mixta') {
        // Para tipo mixta, validar si tiene opciones (es objetiva) o no (es desarrollo)
        if (q.opciones && q.opciones.length > 0) {
          // Es pregunta objetiva, debe tener 4 opciones
          if (q.opciones.length !== 4) {
            // Si no tiene 4, intentar corregir o eliminar opciones
            if (q.opciones.length < 4) {
              // No tiene suficientes opciones, convertir a desarrollo
              q.opciones = []
            } else {
              // Tiene más de 4, tomar las primeras 4
              q.opciones = q.opciones.slice(0, 4)
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
          const letters = ['A', 'B', 'C', 'D']
          q.opciones = q.opciones.map((opt, i) => ({
            ...opt,
            letra: letters[i],
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
        // Buscar tema por nombre o eje temático
        const matchingTopic = context.topics.find(
          t =>
            t.nombre.toLowerCase().includes(q.ejeTematico?.toLowerCase() || '') ||
            q.ejeTematico?.toLowerCase().includes(t.nombre.toLowerCase())
        )
        if (matchingTopic) {
          q.topicId = matchingTopic.id
          q.ejeTematico = matchingTopic.ejeTematico
        } else {
          // Asignar tema aleatorio si no hay coincidencia
          const randomTopic = context.topics[Math.floor(Math.random() * context.topics.length)]
          q.topicId = randomTopic.id
          q.ejeTematico = randomTopic.ejeTematico
        }
      }

      return q
    })

    // Generar clavijero si se solicita (solo para preguntas objetivas)
    if (includeAnswerKey) {
      examData.answerKey = {}
      examData.questions.forEach((q, index) => {
        // Solo agregar al clavijero si tiene opciones (preguntas objetivas)
        if (q.opciones && q.opciones.length > 0) {
          const correctOption = q.opciones.find(o => o.esCorrecta)
          if (correctOption) {
            examData.answerKey![index] = correctOption.letra
          }
        }
        // Las preguntas de desarrollo no se incluyen en el clavijero
      })
    }

    return examData
  } catch (error) {
    logger.error(
      {
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        subjectId,
        numQuestions,
        tipo,
        difficulty,
        userId,
      },
      'Error al generar examen con IA'
    )
    throw error instanceof Error ? error : new Error('Error desconocido al generar examen')
  }
}
