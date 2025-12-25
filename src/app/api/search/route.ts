import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import {
  LIMIT_CONSTANTS,
  SEARCH_CONSTANTS,
  SEARCH_WEIGHT_PRESETS,
  SEARCH_TYPES,
  type SearchType,
} from '@/lib/constants'

export const runtime = 'nodejs'

const searchQuerySchema = z.object({
  q: z.string().min(1).max(200),
  types: z
    .string()
    .optional()
    .transform(val => (val ? val.split(',') : undefined)),
  limit: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 10))
    .pipe(z.number().int().min(1).max(100)),
  offset: z
    .string()
    .optional()
    .transform(val => (val ? parseInt(val, 10) : 0))
    .pipe(z.number().int().min(0)),
})

/**
 * Calcula la relevancia de un resultado de búsqueda
 */
function calculateRelevance(
  text: string,
  query: string,
  queryWords: string[],
  weights: { title?: number; content?: number; subject?: number; topic?: number } = {}
): number {
  const defaultWeights = {
    title: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TITLE,
    content: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.CONTENT,
    subject: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.SUBJECT,
    topic: SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.TOPIC,
    ...weights,
  }

  const lowerText = text.toLowerCase()
  let relevance = 0

  // Búsqueda exacta (mayor peso)
  if (lowerText.includes(query.toLowerCase())) {
    relevance += SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.EXACT_MATCH
  }

  // Búsqueda por palabras
  queryWords.forEach(word => {
    if (lowerText.includes(word)) {
      // Peso según posición
      const index = lowerText.indexOf(word)
      // Validar que la palabra fue encontrada (indexOf retorna -1 si no encuentra)
      if (index !== -1) {
        const positionWeight =
          index < SEARCH_CONSTANTS.POSITION_THRESHOLDS.NEAR_START
            ? SEARCH_CONSTANTS.POSITION_WEIGHTS.NEAR_START
            : index < SEARCH_CONSTANTS.POSITION_THRESHOLDS.MIDDLE
              ? SEARCH_CONSTANTS.POSITION_WEIGHTS.MIDDLE
              : SEARCH_CONSTANTS.POSITION_WEIGHTS.FAR
        relevance += positionWeight
      }
    }
  })

  return relevance
}

/**
 * Busca exámenes
 */
async function searchExams(
  query: string,
  queryWords: string[],
  studentId: string,
  limit: number,
  offset: number
) {
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const queryLower = query.toLowerCase()
  const exams = await prisma.exam.findMany({
    where: {
      OR: [
        { titulo: { contains: query } },
        { descripcion: { contains: query } },
        { subject: { nombre: { contains: query } } },
      ],
    },
    include: {
      subject: {
        select: {
          id: true,
          nombre: true,
          codigo: true,
        },
      },
      _count: {
        select: {
          questions: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return exams.map(exam => ({
    type: 'exam' as const,
    id: exam.id,
    title: exam.titulo,
    description: exam.descripcion,
    subject: exam.subject.nombre,
    subjectCode: exam.subject.codigo,
    tipo: exam.tipo,
    totalPreguntas: exam._count.questions,
    relevance: calculateRelevance(
      `${exam.titulo} ${exam.descripcion || ''} ${exam.subject.nombre}`,
      query,
      queryWords,
      SEARCH_WEIGHT_PRESETS.EXAM
    ),
    url: `/exams/${exam.id}/take`,
  }))
}

/**
 * Busca materiales
 */
async function searchMaterials(
  query: string,
  queryWords: string[],
  studentId: string,
  limit: number,
  offset: number
) {
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const materials = await prisma.studyMaterial.findMany({
    where: {
      OR: [
        { titulo: { contains: query } },
        { contenido: { contains: query } },
        { subject: { nombre: { contains: query } } },
        { topic: { nombre: { contains: query } } },
        { topic: { ejeTematico: { contains: query } } },
      ],
    },
    include: {
      subject: {
        select: {
          id: true,
          nombre: true,
          codigo: true,
        },
      },
      topic: {
        select: {
          id: true,
          nombre: true,
          ejeTematico: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return materials.map(material => ({
    type: 'material' as const,
    id: material.id,
    title: material.titulo,
    description: material.contenido.substring(0, LIMIT_CONSTANTS.MAX_SEARCH_DESCRIPTION_LENGTH),
    subject: material.subject.nombre,
    subjectCode: material.subject.codigo,
    topic: material.topic?.nombre,
    ejeTematico: material.topic?.ejeTematico,
    tipo: material.tipo,
    relevance: calculateRelevance(
      `${material.titulo} ${material.contenido} ${material.subject.nombre} ${material.topic?.nombre || ''} ${material.topic?.ejeTematico || ''}`,
      query,
      queryWords,
      SEARCH_WEIGHT_PRESETS.MATERIAL
    ),
    url: `/materials/${material.id}`,
  }))
}

/**
 * Busca temas
 */
async function searchTopics(query: string, queryWords: string[], limit: number, offset: number) {
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        { nombre: { contains: query } },
        { descripcion: { contains: query } },
        { ejeTematico: { contains: query } },
        { subject: { nombre: { contains: query } } },
      ],
    },
    include: {
      subject: {
        select: {
          id: true,
          nombre: true,
          codigo: true,
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      nombre: 'asc',
    },
  })

  return topics.map(topic => ({
    type: 'topic' as const,
    id: topic.id,
    title: topic.nombre,
    description: topic.descripcion,
    ejeTematico: topic.ejeTematico,
    subject: topic.subject.nombre,
    subjectCode: topic.subject.codigo,
    relevance: calculateRelevance(
      `${topic.nombre} ${topic.descripcion || ''} ${topic.ejeTematico} ${topic.subject.nombre}`,
      query,
      queryWords,
      SEARCH_WEIGHT_PRESETS.TOPIC
    ),
    url: `/materials?topicId=${topic.id}`,
  }))
}

/**
 * Busca intentos del estudiante
 */
async function searchAttempts(
  query: string,
  queryWords: string[],
  studentId: string,
  limit: number,
  offset: number
) {
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const attempts = await prisma.attempt.findMany({
    where: {
      studentId,
      OR: [
        { exam: { titulo: { contains: query } } },
        { exam: { descripcion: { contains: query } } },
        { exam: { subject: { nombre: { contains: query } } } },
      ],
    },
    include: {
      exam: {
        include: {
          subject: {
            select: {
              id: true,
              nombre: true,
              codigo: true,
            },
          },
        },
      },
    },
    take: limit,
    skip: offset,
    orderBy: {
      startedAt: 'desc',
    },
  })

  return attempts.map(attempt => ({
    type: 'attempt' as const,
    id: attempt.id,
    title: `Intento: ${attempt.exam.titulo}`,
    description: `Estado: ${attempt.estado} | Puntaje: ${attempt.puntaje || 'N/A'}`,
    subject: attempt.exam.subject.nombre,
    subjectCode: attempt.exam.subject.codigo,
    estado: attempt.estado,
    puntaje: attempt.puntaje,
    porcentaje: attempt.porcentaje,
    relevance: calculateRelevance(
      `${attempt.exam.titulo} ${attempt.exam.descripcion || ''} ${attempt.exam.subject.nombre}`,
      query,
      queryWords,
      SEARCH_WEIGHT_PRESETS.EXAM
    ),
    url:
      attempt.estado === 'completado'
        ? `/exams/${attempt.examId}/results?attemptId=${attempt.id}`
        : `/exams/${attempt.examId}/take`,
  }))
}

/**
 * Interfaz para metadata de sugerencias de búsqueda
 */
interface SuggestionMetadata {
  codigo?: string
  ejeTematico?: string
  examId?: string
  materialId?: string
  topicId?: string
}

/**
 * Interfaz para sugerencias de búsqueda
 */
interface SearchSuggestion {
  text: string
  type: string
  relevance: number
  metadata?: SuggestionMetadata
}

/**
 * Obtiene sugerencias de búsqueda basadas en el query
 * Mejorado con ranking por relevancia y contexto del usuario
 */
async function getSuggestions(query: string, studentId: string) {
  if (query.length < 2) return []

  const suggestions: SearchSuggestion[] = []
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0)

  // Sugerencias de asignaturas (mayor relevancia si coincide al inicio)
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const subjects = await prisma.subject.findMany({
    where: {
      OR: [
        { nombre: { contains: query } },
        { codigo: { contains: query } },
      ],
    },
    take: SEARCH_CONSTANTS.SUGGESTION_LIMITS.SUBJECTS_TAKE,
  })
  subjects.forEach(subject => {
    const nombreLower = subject.nombre.toLowerCase()
    const codigoLower = subject.codigo.toLowerCase()
    let relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_DEFAULT

    // Mayor relevancia si coincide al inicio
    if (nombreLower.startsWith(queryLower) || codigoLower.startsWith(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_STARTS_WITH
    } else if (nombreLower.includes(queryLower) || codigoLower.includes(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_INCLUDES
    }

    // Verificar si no existe ya
    if (!suggestions.some(s => s.text === subject.nombre)) {
      suggestions.push({
        text: subject.nombre,
        type: 'subject',
        relevance,
        metadata: { codigo: subject.codigo },
      })
    }
  })

  // Sugerencias de temas (con ranking por relevancia)
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const topics = await prisma.topic.findMany({
    where: {
      OR: [
        { nombre: { contains: query } },
        { ejeTematico: { contains: query } },
      ],
    },
    take: SEARCH_CONSTANTS.SUGGESTION_LIMITS.TOPICS_TAKE,
  })
  topics.forEach(topic => {
    const nombreLower = topic.nombre.toLowerCase()
    const ejeLower = topic.ejeTematico.toLowerCase()
    let relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_DEFAULT

    if (nombreLower.startsWith(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_STARTS_WITH
    } else if (nombreLower.includes(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_INCLUDES
    } else if (ejeLower.includes(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_EJE_INCLUDES
    }

    if (!suggestions.some(s => s.text === topic.nombre)) {
      suggestions.push({
        text: topic.nombre,
        type: 'topic',
        relevance,
        metadata: { ejeTematico: topic.ejeTematico },
      })
    }
  })

  // Sugerencias de títulos de exámenes (con contexto del estudiante)
  // SQLite no soporta mode: 'insensitive', usar contains sin mode
  const examTitles = await prisma.exam.findMany({
    where: {
      titulo: { contains: query },
    },
    select: { titulo: true, id: true },
    take: SEARCH_CONSTANTS.SUGGESTION_LIMITS.EXAMS_TAKE,
  })

  // Obtener intentos del estudiante para priorizar exámenes que ha visto
  const studentAttempts = studentId
    ? await prisma.attempt.findMany({
        where: { studentId },
        select: { examId: true },
        distinct: ['examId'],
      })
    : []

  const attemptedExamIds = new Set(studentAttempts.map(a => a.examId))

  examTitles.forEach(exam => {
    const tituloLower = exam.titulo.toLowerCase()
    let relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_DEFAULT

    if (tituloLower.startsWith(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_STARTS_WITH
    } else if (tituloLower.includes(queryLower)) {
      relevance = SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_INCLUDES
    }

    // Priorizar exámenes que el estudiante ya ha intentado
    if (attemptedExamIds.has(exam.id)) {
      relevance += SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_ATTEMPTED_BONUS
    }

    if (!suggestions.some(s => s.text === exam.titulo)) {
      suggestions.push({
        text: exam.titulo,
        type: 'exam',
        relevance,
      })
    }
  })

  // Ordenar por relevancia y retornar top N sugerencias
  return suggestions
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, SEARCH_CONSTANTS.SUGGESTION_LIMITS.MAX_SUGGESTIONS)
    .map(s => s.text)
}

export async function GET(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const studentId = await getCurrentStudentId()

      if (!studentId) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
      }

      const { searchParams } = new URL(request.url)
      const queryParams = Object.fromEntries(searchParams.entries())

      // Validar query parameters
      const searchQuerySchema = z.object({
        q: z.string().min(1).max(200),
        types: z
          .string()
          .optional()
          .transform((val): string[] | undefined => {
            if (!val) return undefined
            const split = val.split(',')
            // Validar que todos los valores sean strings válidos
            return split.filter(t => typeof t === 'string' && t.trim().length > 0)
          })
          .pipe(z.array(z.string()).optional()),
        limit: z
          .string()
          .optional()
          .transform((val): number => {
            if (!val) return 10
            const parsed = parseInt(val, 10)
            // Validar que el parseo fue exitoso
            if (isNaN(parsed)) return 10
            return parsed
          })
          .pipe(z.number().int().min(1).max(100)),
        offset: z
          .string()
          .optional()
          .transform((val): number => {
            if (!val) return 0
            const parsed = parseInt(val, 10)
            // Validar que el parseo fue exitoso
            if (isNaN(parsed)) return 0
            return parsed
          })
          .pipe(z.number().int().min(0)),
      })

      const queryValidation = searchQuerySchema.safeParse(queryParams)
      if (!queryValidation.success) {
        return NextResponse.json(
          { error: 'Parámetros de consulta inválidos', details: queryValidation.error.errors },
          { status: 400 }
        )
      }

      const { q: query, types: typesParam, limit, offset } = queryValidation.data

      if (!query || query.trim().length < 1) {
        return NextResponse.json({
          results: [],
          suggestions: [],
          total: 0,
        })
      }

      const types: SearchType[] =
        typesParam && typesParam.length > 0
          ? (typesParam.filter(t => SEARCH_TYPES.includes(t as SearchType)) as SearchType[])
          : ([...SEARCH_TYPES] as SearchType[])
      const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 0)

      // Buscar en paralelo (usar limit * 2 para tener más resultados para ordenar por relevancia)
      // Limitar a MAX_SEARCH_RESULTS para prevenir problemas de performance
      const searchLimit = Math.min(limit * 2, LIMIT_CONSTANTS.MAX_SEARCH_RESULTS)
      const [exams, materials, topics, attempts] = await Promise.all([
        types.includes('exams')
          ? searchExams(query, queryWords, studentId, searchLimit, 0)
          : Promise.resolve([]),
        types.includes('materials')
          ? searchMaterials(query, queryWords, studentId, searchLimit, 0)
          : Promise.resolve([]),
        types.includes('topics')
          ? searchTopics(query, queryWords, searchLimit, 0)
          : Promise.resolve([]),
        types.includes('attempts')
          ? searchAttempts(query, queryWords, studentId, searchLimit, 0)
          : Promise.resolve([]),
      ])

      // Combinar y ordenar por relevancia
      const allResultsUnsliced = [...exams, ...materials, ...topics, ...attempts].sort(
        (a, b) => b.relevance - a.relevance
      )

      // Calcular total antes del slice para paginación correcta
      const totalResults = allResultsUnsliced.length
      const allResults = allResultsUnsliced.slice(offset, offset + limit)

      // Obtener sugerencias
      const suggestions = await getSuggestions(query, studentId)

      return NextResponse.json({
        results: allResults,
        suggestions,
        total: totalResults,
        query,
      })
    } catch (error) {
      logger.error(
        {
          type: 'search_error',
          error: error instanceof Error ? error.message : String(error),
        },
        'Error en búsqueda'
      )
      return NextResponse.json({ error: 'Error al realizar la búsqueda' }, { status: 500 })
    }
  })
}
