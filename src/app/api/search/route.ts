import { NextRequest, NextResponse } from 'next/server'
import { getCurrentStudentId } from '@/lib/get-session'
import { withRateLimit } from '@/lib/rate-limit-middleware'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { logger } from '@/lib/logger'

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
    title: 10,
    content: 2,
    subject: 5,
    topic: 8,
    ...weights,
  }

  const lowerText = text.toLowerCase()
  let relevance = 0

  // Búsqueda exacta (mayor peso)
  if (lowerText.includes(query.toLowerCase())) {
    relevance += 20
  }

  // Búsqueda por palabras
  queryWords.forEach(word => {
    if (lowerText.includes(word)) {
      // Peso según posición
      const index = lowerText.indexOf(word)
      const positionWeight = index < 50 ? 5 : index < 200 ? 3 : 1
      relevance += positionWeight
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
      { title: 10, content: 2, subject: 5 }
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
    description: material.contenido.substring(0, 200),
    subject: material.subject.nombre,
    subjectCode: material.subject.codigo,
    topic: material.topic?.nombre,
    ejeTematico: material.topic?.ejeTematico,
    tipo: material.tipo,
    relevance: calculateRelevance(
      `${material.titulo} ${material.contenido} ${material.subject.nombre} ${material.topic?.nombre || ''} ${material.topic?.ejeTematico || ''}`,
      query,
      queryWords,
      { title: 10, content: 2, subject: 5, topic: 8 }
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
      { title: 10, content: 2, subject: 5, topic: 8 }
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
      { title: 10, content: 2, subject: 5 }
    ),
    url:
      attempt.estado === 'completado'
        ? `/exams/${attempt.examId}/results?attemptId=${attempt.id}`
        : `/exams/${attempt.examId}/take`,
  }))
}

/**
 * Obtiene sugerencias de búsqueda basadas en el query
 */
async function getSuggestions(query: string, studentId: string) {
  if (query.length < 2) return []

  const suggestions: string[] = []
  const queryLower = query.toLowerCase()

  // Sugerencias de asignaturas
  const subjects = await prisma.subject.findMany({
    where: {
      nombre: { contains: query },
    },
    take: 3,
  })
  subjects.forEach(subject => {
    if (!suggestions.includes(subject.nombre)) {
      suggestions.push(subject.nombre)
    }
  })

  // Sugerencias de temas
  const topics = await prisma.topic.findMany({
    where: {
      OR: [{ nombre: { contains: query } }, { ejeTematico: { contains: query } }],
    },
    take: 3,
  })
  topics.forEach(topic => {
    if (!suggestions.includes(topic.nombre)) {
      suggestions.push(topic.nombre)
    }
    if (!suggestions.includes(topic.ejeTematico)) {
      suggestions.push(topic.ejeTematico)
    }
  })

  // Sugerencias de títulos de exámenes
  const examTitles = await prisma.exam.findMany({
    where: {
      titulo: { contains: query },
    },
    select: { titulo: true },
    take: 3,
  })
  examTitles.forEach(exam => {
    if (!suggestions.includes(exam.titulo)) {
      suggestions.push(exam.titulo)
    }
  })

  return suggestions.slice(0, 8) // Máximo 8 sugerencias
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

      const types =
        typesParam && typesParam.length > 0
          ? (typesParam.filter(t =>
              ['exams', 'materials', 'topics', 'attempts'].includes(t)
            ) as Array<'exams' | 'materials' | 'topics' | 'attempts'>)
          : ['exams', 'materials', 'topics', 'attempts']
      const queryWords = query
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 0)

      // Buscar en paralelo (usar limit * 2 para tener más resultados para ordenar por relevancia)
      const [exams, materials, topics, attempts] = await Promise.all([
        types.includes('exams')
          ? searchExams(query, queryWords, studentId, limit * 2, 0)
          : Promise.resolve([]),
        types.includes('materials')
          ? searchMaterials(query, queryWords, studentId, limit * 2, 0)
          : Promise.resolve([]),
        types.includes('topics')
          ? searchTopics(query, queryWords, limit * 2, 0)
          : Promise.resolve([]),
        types.includes('attempts')
          ? searchAttempts(query, queryWords, studentId, limit * 2, 0)
          : Promise.resolve([]),
      ])

      // Combinar y ordenar por relevancia
      const allResults = [...exams, ...materials, ...topics, ...attempts]
        .sort((a, b) => b.relevance - a.relevance)
        .slice(offset, offset + limit)

      // Obtener sugerencias
      const suggestions = await getSuggestions(query, studentId)

      return NextResponse.json({
        results: allResults,
        suggestions,
        total: allResults.length,
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
