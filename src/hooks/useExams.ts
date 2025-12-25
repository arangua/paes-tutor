import { useState, useEffect, useMemo } from 'react'
import { captureError } from '@/lib/monitoring'

interface Exam {
  id: string
  titulo: string
  descripcion: string | null
  tipo: string
  tiempoLimiteMin: number | null
  totalPreguntas: number
  fuente: string | null
  createdAt: string
  subject: {
    id: string
    nombre: string
    codigo: string
  }
  questions: Array<{
    question: {
      id: string
    }
  }>
}

interface UseExamsOptions {
  subjectId?: string
  tipo?: string
  limit?: number
  offset?: number
}

interface PaginationInfo {
  total: number
  limit: number
  offset: number
  hasMore: boolean
}

/**
 * Hook personalizado para cargar y filtrar exámenes
 */
export function useExams(options: UseExamsOptions = {}) {
  const [exams, setExams] = useState<Exam[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar exámenes
  useEffect(() => {
    async function loadExams() {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (options.subjectId && options.subjectId !== 'all') {
          params.append('subjectId', options.subjectId)
        }
        if (options.tipo && options.tipo !== 'all') {
          params.append('tipo', options.tipo)
        }
        if (options.limit) {
          params.append('limit', options.limit.toString())
        }
        if (options.offset) {
          params.append('offset', options.offset.toString())
        }

        const url = `/api/exams${params.toString() ? `?${params.toString()}` : ''}`
        const res = await fetch(url)

        if (!res.ok) {
          const { safeJsonParse } = await import('@/lib/api-helpers')
          const errorData = await safeJsonParse<{ error?: string }>(res, {
            path: typeof window !== 'undefined' ? window.location.pathname : '/exams',
            operation: 'cargar exámenes',
          })
          const statusText =
            res.status === 401
              ? 'No autorizado. Por favor, inicia sesión.'
              : res.status === 404
                ? 'Exámenes no encontrados'
                : errorData.error || `Error ${res.status}: Error al cargar exámenes`
          throw new Error(statusText)
        }

        const data = await res.json()

        // Manejar nueva estructura con paginación o estructura antigua
        let examsData: Exam[]
        let paginationData: PaginationInfo | null = null

        if (data.exams && data.pagination) {
          // Nueva estructura con paginación
          examsData = data.exams
          paginationData = data.pagination
        } else if (Array.isArray(data)) {
          // Estructura antigua (sin paginación) - retrocompatibilidad
          examsData = data
        } else {
          throw new Error('Formato de respuesta inválido del servidor')
        }

        // Validar estructura básica de cada examen
        const validExams = examsData.filter(
          (exam: Exam) =>
            exam?.id && exam?.titulo && exam?.subject?.id && typeof exam.totalPreguntas === 'number'
        )

        if (validExams.length !== examsData.length) {
          // Warning usando servicio de monitoreo
          captureError(
            new Error('Algunos exámenes tienen estructura inválida y fueron filtrados'),
            {
              type: 'exams_validation_warning',
              filteredCount: examsData.length - validExams.length,
              totalCount: examsData.length,
              path: typeof window !== 'undefined' ? window.location.pathname : undefined,
            }
          )
        }

        setExams(validExams)
        setPagination(paginationData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadExams()
  }, [options.subjectId, options.tipo, options.limit, options.offset])

  // Filtrar exámenes por búsqueda
  const filterExams = useMemo(() => {
    return (searchQuery: string): Exam[] => {
      if (!searchQuery.trim()) {
        return exams
      }

      const query = searchQuery.toLowerCase().trim()
      return exams.filter(
        exam =>
          exam.titulo.toLowerCase().includes(query) ||
          exam.descripcion?.toLowerCase().includes(query) ||
          exam.subject.nombre.toLowerCase().includes(query) ||
          exam.subject.codigo.toLowerCase().includes(query)
      )
    }
  }, [exams])

  // Obtener asignaturas únicas
  const subjects = useMemo(() => {
    const uniqueSubjects = new Map<string, { id: string; nombre: string; codigo: string }>()
    exams.forEach(exam => {
      if (!uniqueSubjects.has(exam.subject.id)) {
        uniqueSubjects.set(exam.subject.id, exam.subject)
      }
    })
    return Array.from(uniqueSubjects.values()).sort((a, b) => a.nombre.localeCompare(b.nombre))
  }, [exams])

  // Obtener tipos únicos
  const tipos = useMemo(() => {
    const uniqueTipos = new Set<string>()
    exams.forEach(exam => {
      if (exam.tipo) {
        uniqueTipos.add(exam.tipo)
      }
    })
    return Array.from(uniqueTipos).sort()
  }, [exams])

  return {
    exams,
    pagination,
    isLoading,
    error,
    filterExams,
    subjects,
    tipos,
    refetch: () => {
      // Trigger reload by updating dependencies
      setExams([])
      setIsLoading(true)
    },
  }
}
