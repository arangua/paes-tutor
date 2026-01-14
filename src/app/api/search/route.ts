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

// searchQuerySchema se define localmente en cada función que lo necesita

/**
 * Calcula la relevancia de un resultado de búsqueda
 */
function calculateRelevance(
  text: string,
  query: string,
  queryWords: string[],
  _weights: { title?: number; content?: number; subject?: number; topic?: number } = {}
): number {
  // Validar que text y query sean strings válidos
  const safeText = typeof text === 'string' ? text : ''
  const safeQuery = typeof query === 'string' ? query : ''
  
  if (!safeText || !safeQuery) {
    return 0
  }

  // defaultWeights no se usa directamente, se usa weights que viene como parámetro
  // const _defaultWeights = { ... }

  let lowerText = ''
  try {
    lowerText = safeText.toLowerCase()
    if (typeof lowerText !== 'string') {
      lowerText = safeText // Fallback si toLowerCase() falla
    }
  } catch {
    lowerText = safeText // Fallback si toLowerCase() falla
  }

  let relevance = 0

  // Búsqueda exacta (mayor peso)
  try {
    const lowerQuery = safeQuery.toLowerCase()
    if (typeof lowerQuery === 'string' && lowerText.includes(lowerQuery)) {
      const exactMatchWeight = Number.isFinite(SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.EXACT_MATCH)
        ? SEARCH_CONSTANTS.RELEVANCE_WEIGHTS.EXACT_MATCH
        : 0
      relevance += exactMatchWeight
    }
  } catch {
    // Ignorar errores en búsqueda exacta
  }

  // Búsqueda por palabras
  if (Array.isArray(queryWords)) {
    queryWords.forEach(word => {
      if (typeof word === 'string' && word.length > 0) {
        try {
          const lowerWord = word.toLowerCase()
          if (typeof lowerWord === 'string' && lowerText.includes(lowerWord)) {
            // Peso según posición
            // CORRECCIÓN: Validar que lowerText sea un string válido antes de usar indexOf()
            let index = -1
            try {
              if (typeof lowerText === 'string' && lowerText.length > 0) {
                index = lowerText.indexOf(lowerWord)
                // Validar que indexOf() retorne un número válido
                if (!Number.isFinite(index)) {
                  index = -1
                }
              }
            } catch {
              index = -1
            }
            // Validar que la palabra fue encontrada (indexOf retorna -1 si no encuentra)
            if (index !== -1 && Number.isFinite(index) && index >= 0) {
              const nearStartThreshold = Number.isFinite(SEARCH_CONSTANTS.POSITION_THRESHOLDS.NEAR_START)
                ? SEARCH_CONSTANTS.POSITION_THRESHOLDS.NEAR_START
                : 50
              const middleThreshold = Number.isFinite(SEARCH_CONSTANTS.POSITION_THRESHOLDS.MIDDLE)
                ? SEARCH_CONSTANTS.POSITION_THRESHOLDS.MIDDLE
                : 200
              
              const positionWeight =
                index < nearStartThreshold
                  ? (Number.isFinite(SEARCH_CONSTANTS.POSITION_WEIGHTS.NEAR_START) ? SEARCH_CONSTANTS.POSITION_WEIGHTS.NEAR_START : 1)
                  : index < middleThreshold
                    ? (Number.isFinite(SEARCH_CONSTANTS.POSITION_WEIGHTS.MIDDLE) ? SEARCH_CONSTANTS.POSITION_WEIGHTS.MIDDLE : 1)
                    : (Number.isFinite(SEARCH_CONSTANTS.POSITION_WEIGHTS.FAR) ? SEARCH_CONSTANTS.POSITION_WEIGHTS.FAR : 1)
              
              const safeWeight = Number.isFinite(positionWeight) ? positionWeight : 0
              relevance += safeWeight
            }
          }
        } catch {
          // Ignorar errores en procesamiento de palabras
        }
      }
    })
  }

  return Number.isFinite(relevance) && relevance >= 0 ? relevance : 0
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
  // CORRECCIÓN: Validar que query sea un string válido antes de usar toLowerCase()
  const safeQuery = typeof query === 'string' ? query : ''
  let queryLower = ''
  try {
    queryLower = safeQuery.toLowerCase()
    if (typeof queryLower !== 'string') {
      queryLower = safeQuery // Fallback
    }
  } catch {
    queryLower = safeQuery // Fallback
  }
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
    description: exam.descripcion ?? undefined, // Convertir null a undefined para que sea opcional
    subject: exam.subject?.nombre || '',
    subjectCode: exam.subject?.codigo || '',
    tipo: exam.tipo,
    totalPreguntas: exam._count.questions,
    relevance: calculateRelevance(
      `${exam.titulo} ${exam.descripcion || ''} ${exam.subject?.nombre || ''}`,
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

  return materials
    .filter(material => material && typeof material === 'object')
    .map(material => {
      let description = ''
      try {
        if (material.contenido && typeof material.contenido === 'string') {
          const maxLength = Number.isFinite(LIMIT_CONSTANTS.MAX_SEARCH_DESCRIPTION_LENGTH) && LIMIT_CONSTANTS.MAX_SEARCH_DESCRIPTION_LENGTH > 0
            ? LIMIT_CONSTANTS.MAX_SEARCH_DESCRIPTION_LENGTH
            : 200
          const safeLength = Number.isFinite(maxLength) && maxLength >= 0 ? Math.min(maxLength, material.contenido.length) : material.contenido.length
          description = material.contenido.substring(0, safeLength)
          if (typeof description !== 'string') {
            description = ''
          }
        }
      } catch {
        description = ''
      }

      const searchText = [
        typeof material.titulo === 'string' ? material.titulo : '',
        typeof material.contenido === 'string' ? material.contenido : '',
        typeof material.subject?.nombre === 'string' ? material.subject.nombre : '',
        typeof material.topic?.nombre === 'string' ? material.topic.nombre : '',
        typeof material.topic?.ejeTematico === 'string' ? material.topic.ejeTematico : '',
      ].filter(Boolean).join(' ')

      return {
        type: 'material' as const,
        id: material.id || '',
        title: typeof material.titulo === 'string' ? material.titulo : '',
        description,
        subject: typeof material.subject?.nombre === 'string' ? material.subject.nombre : '',
        subjectCode: typeof material.subject?.codigo === 'string' ? material.subject.codigo : '',
        topic: typeof material.topic?.nombre === 'string' ? material.topic.nombre : undefined,
        ejeTematico: typeof material.topic?.ejeTematico === 'string' ? material.topic.ejeTematico : undefined,
        tipo: material.tipo || '',
        relevance: calculateRelevance(
          searchText,
          query,
          queryWords,
          SEARCH_WEIGHT_PRESETS.MATERIAL
        ),
        url: `/materials/${material.id || ''}`,
      }
    })
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
    description: topic.descripcion ?? undefined, // Convertir null a undefined para que sea opcional
    ejeTematico: topic.ejeTematico,
    subject: topic.subject?.nombre || '',
    subjectCode: topic.subject?.codigo || '',
    relevance: calculateRelevance(
      `${topic.nombre} ${topic.descripcion || ''} ${topic.ejeTematico} ${topic.subject?.nombre || ''}`,
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

  return attempts
    .filter(attempt => attempt.exam)
    .map(attempt => ({
      type: 'attempt' as const,
      id: attempt.id,
      title: `Intento: ${attempt.exam?.titulo || 'Examen desconocido'}`,
      description: `Estado: ${attempt.estado} | Puntaje: ${attempt.puntaje || 'N/A'}`,
      subject: attempt.exam?.subject?.nombre || '',
      subjectCode: attempt.exam?.subject?.codigo || '',
      estado: attempt.estado,
      puntaje: attempt.puntaje,
      porcentaje: attempt.porcentaje,
      relevance: calculateRelevance(
        `${attempt.exam?.titulo || ''} ${attempt.exam?.descripcion || ''} ${attempt.exam?.subject?.nombre || ''}`,
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
  // CORRECCIÓN: Validar que query sea un string válido antes de acceder a length
  const safeQuery = typeof query === 'string' ? query : ''
  if (safeQuery.length < 2) return []

  const suggestions: SearchSuggestion[] = []
  // CORRECCIÓN: Validar que safeQuery sea un string válido antes de usar toLowerCase()
  let queryLower = ''
  try {
    queryLower = safeQuery.toLowerCase()
    if (typeof queryLower !== 'string') {
      queryLower = safeQuery // Fallback
    }
  } catch {
    queryLower = safeQuery // Fallback
  }
  // queryWords no se usa en getSuggestions, solo se usa query directamente

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
  if (Array.isArray(subjects)) {
    subjects.forEach(subject => {
      if (!subject || typeof subject !== 'object') return
      
      let nombreLower = ''
      let codigoLower = ''
      try {
        nombreLower = typeof subject.nombre === 'string' ? subject.nombre.toLowerCase() : ''
        codigoLower = typeof subject.codigo === 'string' ? subject.codigo.toLowerCase() : ''
      } catch {
        // Ignorar errores en toLowerCase
      }

      let relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_DEFAULT)
        ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_DEFAULT
        : 1

      // Mayor relevancia si coincide al inicio
      try {
        if ((typeof nombreLower === 'string' && nombreLower.startsWith(queryLower)) ||
            (typeof codigoLower === 'string' && codigoLower.startsWith(queryLower))) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_STARTS_WITH)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_STARTS_WITH
            : 2
        } else if ((typeof nombreLower === 'string' && nombreLower.includes(queryLower)) ||
                   (typeof codigoLower === 'string' && codigoLower.includes(queryLower))) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_INCLUDES)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.SUBJECT_INCLUDES
            : 1.5
        }
      } catch {
        // Ignorar errores en comparaciones
      }

      // Verificar si no existe ya
      const subjectNombre = typeof subject.nombre === 'string' ? subject.nombre : ''
      if (subjectNombre && !suggestions.some(s => s && s.text === subjectNombre)) {
        suggestions.push({
          text: subjectNombre,
          type: 'subject',
          relevance: Number.isFinite(relevance) ? relevance : 1,
          metadata: { codigo: typeof subject.codigo === 'string' ? subject.codigo : undefined },
        })
      }
    })
  }

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
  if (Array.isArray(topics)) {
    topics.forEach(topic => {
      if (!topic || typeof topic !== 'object') return
      
      let nombreLower = ''
      let ejeLower = ''
      try {
        nombreLower = typeof topic.nombre === 'string' ? topic.nombre.toLowerCase() : ''
        ejeLower = typeof topic.ejeTematico === 'string' ? topic.ejeTematico.toLowerCase() : ''
      } catch {
        // Ignorar errores en toLowerCase
      }

      let relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_DEFAULT)
        ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_DEFAULT
        : 1

      try {
        if (typeof nombreLower === 'string' && nombreLower.startsWith(queryLower)) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_STARTS_WITH)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_STARTS_WITH
            : 2
        } else if (typeof nombreLower === 'string' && nombreLower.includes(queryLower)) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_INCLUDES)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_INCLUDES
            : 1.5
        } else if (typeof ejeLower === 'string' && ejeLower.includes(queryLower)) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_EJE_INCLUDES)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.TOPIC_EJE_INCLUDES
            : 1.2
        }
      } catch {
        // Ignorar errores en comparaciones
      }

      const topicNombre = typeof topic.nombre === 'string' ? topic.nombre : ''
      if (topicNombre && !suggestions.some(s => s && s.text === topicNombre)) {
        suggestions.push({
          text: topicNombre,
          type: 'topic',
          relevance: Number.isFinite(relevance) ? relevance : 1,
          metadata: { ejeTematico: typeof topic.ejeTematico === 'string' ? topic.ejeTematico : undefined },
        })
      }
    })
  }

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

  const attemptedExamIds = new Set(
    Array.isArray(studentAttempts)
      ? studentAttempts
          .filter(a => a && a.examId && typeof a.examId === 'string')
          .map(a => a.examId!)
      : []
  )

  if (Array.isArray(examTitles)) {
    examTitles.forEach(exam => {
      if (!exam || typeof exam !== 'object') return
      
      let tituloLower = ''
      try {
        tituloLower = typeof exam.titulo === 'string' ? exam.titulo.toLowerCase() : ''
      } catch {
        // Ignorar errores en toLowerCase
      }

      let relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_DEFAULT)
        ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_DEFAULT
        : 1

      try {
        if (typeof tituloLower === 'string' && tituloLower.startsWith(queryLower)) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_STARTS_WITH)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_STARTS_WITH
            : 2
        } else if (typeof tituloLower === 'string' && tituloLower.includes(queryLower)) {
          relevance = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_INCLUDES)
            ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_INCLUDES
            : 1.5
        }
      } catch {
        // Ignorar errores en comparaciones
      }

      // Priorizar exámenes que el estudiante ya ha intentado
      if (exam.id && attemptedExamIds.has(exam.id)) {
        const bonus = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_ATTEMPTED_BONUS)
          ? SEARCH_CONSTANTS.SUGGESTION_RELEVANCE.EXAM_ATTEMPTED_BONUS
          : 0.5
        relevance += bonus
      }

      const examTitulo = typeof exam.titulo === 'string' ? exam.titulo : ''
      if (examTitulo && !suggestions.some(s => s && s.text === examTitulo)) {
        suggestions.push({
          text: examTitulo,
          type: 'exam',
          relevance: Number.isFinite(relevance) ? relevance : 1,
        })
      }
    })
  }

  // Ordenar por relevancia y retornar top N sugerencias
  const sortedSuggestions = Array.isArray(suggestions)
    ? suggestions
        .filter(s => s && typeof s === 'object' && Number.isFinite(s.relevance))
        .sort((a, b) => {
          const safeA = Number.isFinite(a.relevance) ? a.relevance : 0
          const safeB = Number.isFinite(b.relevance) ? b.relevance : 0
          const diff = safeB - safeA
          return Number.isFinite(diff) ? diff : 0
        })
    : []
  
  const maxSuggestions = Number.isFinite(SEARCH_CONSTANTS.SUGGESTION_LIMITS.MAX_SUGGESTIONS) && SEARCH_CONSTANTS.SUGGESTION_LIMITS.MAX_SUGGESTIONS > 0
    ? SEARCH_CONSTANTS.SUGGESTION_LIMITS.MAX_SUGGESTIONS
    : 10
  
  const sliced = Array.isArray(sortedSuggestions)
    ? sortedSuggestions.slice(0, maxSuggestions)
    : []
  
  return sliced
    .filter(s => s && typeof s.text === 'string')
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
      let queryWords: string[] = []
      try {
        const lowerQuery = typeof query === 'string' ? query.toLowerCase() : ''
        if (typeof lowerQuery === 'string') {
          const splitResult = lowerQuery.split(/\s+/)
          if (Array.isArray(splitResult)) {
            queryWords = splitResult.filter(w => typeof w === 'string' && w.length > 0)
          }
        }
  } catch {
    // queryWords ya está inicializado como array vacío arriba
  }

      // Buscar en paralelo (usar limit * 2 para tener más resultados para ordenar por relevancia)
      // Limitar a MAX_SEARCH_RESULTS para prevenir problemas de performance
      const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 10
      const maxSearchResults = Number.isFinite(LIMIT_CONSTANTS.MAX_SEARCH_RESULTS) && LIMIT_CONSTANTS.MAX_SEARCH_RESULTS > 0
        ? LIMIT_CONSTANTS.MAX_SEARCH_RESULTS
        : 1000
      const searchLimit = Number.isFinite(safeLimit * 2) && safeLimit * 2 > 0
        ? Math.min(safeLimit * 2, maxSearchResults)
        : maxSearchResults

      const [exams, materials, topics, attempts] = await Promise.all([
        Array.isArray(types) && types.includes('exams')
          ? searchExams(query, queryWords, studentId, searchLimit, 0)
          : Promise.resolve([]),
        Array.isArray(types) && types.includes('materials')
          ? searchMaterials(query, queryWords, studentId, searchLimit, 0)
          : Promise.resolve([]),
        Array.isArray(types) && types.includes('topics')
          ? searchTopics(query, queryWords, searchLimit, 0)
          : Promise.resolve([]),
        Array.isArray(types) && types.includes('attempts')
          ? searchAttempts(query, queryWords, studentId, searchLimit, 0)
          : Promise.resolve([]),
      ])

      // Combinar y ordenar por relevancia
      const allResultsUnsliced = [
        ...(Array.isArray(exams) ? exams : []),
        ...(Array.isArray(materials) ? materials : []),
        ...(Array.isArray(topics) ? topics : []),
        ...(Array.isArray(attempts) ? attempts : []),
      ]
        .filter(result => result && typeof result === 'object' && Number.isFinite(result.relevance))
        .sort((a, b) => {
          const safeA = Number.isFinite(a.relevance) ? a.relevance : 0
          const safeB = Number.isFinite(b.relevance) ? b.relevance : 0
          const diff = safeB - safeA
          return Number.isFinite(diff) ? diff : 0
        })

      // Calcular total antes del slice para paginación correcta
      const totalResults = Array.isArray(allResultsUnsliced) && Number.isFinite(allResultsUnsliced.length)
        ? allResultsUnsliced.length
        : 0
      const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0
      const safeLimitForSlice = Number.isFinite(safeLimit) && safeLimit > 0 ? safeLimit : 10
      const allResults = Array.isArray(allResultsUnsliced)
        ? allResultsUnsliced.slice(safeOffset, safeOffset + safeLimitForSlice)
        : []

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
