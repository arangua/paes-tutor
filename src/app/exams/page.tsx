'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { BookOpen, Search, Filter, Home, FileText, Loader2, AlertCircle } from 'lucide-react'
import { ExportButton } from '@/components/export/export-button'
import { exportExamsListToExcel } from '@/lib/export-utils'
import { toast } from 'sonner'
import { useProgressTracker } from '@/hooks/useProgressTracker'
import { ProgressDialog } from '@/components/ui/progress-dialog'
import { useExams } from '@/hooks/useExams'
import { useDebounce } from '@/hooks/useDebounce'
import { ExamCard } from '@/components/ExamCard'
import { Pagination } from '@/components/ui/pagination'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'

export default function ExamsPage() {
  const router = useRouter()
  const exportProgress = useProgressTracker()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState<string>('all')
  const [selectedTipo, setSelectedTipo] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 20

  // Usar custom hooks para lógica compleja
  const { exams, pagination, isLoading, error, filterExams, subjects, tipos } = useExams({
    subjectId: selectedSubject,
    tipo: selectedTipo,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
  })

  // Debounce de búsqueda
  const debouncedSearchQuery = useDebounce(searchQuery, 300)

  // Filtrar exámenes por búsqueda (solo en la página actual)
  const filteredExams = filterExams(debouncedSearchQuery)

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedSubject, selectedTipo, searchQuery])

  const handleStartExam = useCallback(
    (examId: string) => {
      // Validar formato del ID antes de navegar
      if (!examId || !/^c[a-z0-9]{24}$/.test(examId)) {
        toast.error('ID de examen inválido', {
          description: 'El ID del examen no es válido. Por favor, selecciona otro examen.',
        })
        return
      }
      router.push(`/exams/${examId}/take`)
    },
    [router]
  )

  const handleExportExcel = useCallback(async () => {
    if (filteredExams.length === 0) {
      toast.error('No hay exámenes para exportar', {
        description:
          'No hay exámenes en la lista actual. Ajusta los filtros o espera a que se agreguen más exámenes.',
      })
      return
    }

    try {
      exportProgress.start(3, `Exportando ${filteredExams.length} examen(es)...`)
      const examsData = filteredExams.map(exam => ({
        id: exam.id,
        titulo: exam.titulo,
        descripcion: exam.descripcion,
        tipo: exam.tipo,
        totalPreguntas: exam.totalPreguntas,
        tiempoLimiteMin: exam.tiempoLimiteMin,
        subject: {
          nombre: exam.subject.nombre,
          codigo: exam.subject.codigo,
        },
        createdAt: exam.createdAt,
      }))

      await exportExamsListToExcel(examsData, (progress, current, total, message) => {
        exportProgress.updateProgress(current, total, message)
      })
      exportProgress.complete()
      toast.success('Exportación exitosa', {
        description: `Se exportaron ${filteredExams.length} examen(es) correctamente.`,
      })
    } catch (error) {
      exportProgress.fail(error instanceof Error ? error : new Error('Error desconocido'))
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'No se pudo exportar la lista de exámenes. Por favor, intenta nuevamente.'

      toast.error('Error al exportar', {
        description: errorMessage,
      })

      // Log del error para debugging
      if (typeof window !== 'undefined' && (window as any).captureError) {
        ;(window as any).captureError(error instanceof Error ? error : new Error(String(error)), {
          type: 'export_error',
          action: 'export_exams_list',
          context: { examCount: filteredExams.length },
        })
      }
    }
  }, [filteredExams])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando exámenes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    )
  }

  return (
    <>
      <ProgressDialog
        open={exportProgress.isActive}
        title="Exportando lista de exámenes"
        description="Por favor espera mientras se genera el archivo..."
        progress={exportProgress.progress}
        current={exportProgress.current}
        total={exportProgress.total}
        message={exportProgress.message}
        estimatedTimeRemaining={exportProgress.estimatedTimeRemaining}
      />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex-1">
              <div className="mb-4">
                <BackButton href="/dashboard" label="Volver al Dashboard" />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Exámenes Disponibles
                </h1>
                <HelpIcon
                  content="Aquí puedes ver todos los exámenes disponibles. Usa los filtros para encontrar exámenes por asignatura o tipo. Tu progreso se guarda automáticamente durante cada examen."
                  side="right"
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Selecciona un examen para comenzar a practicar
              </p>
            </div>
            <div className="flex gap-2">
              {filteredExams.length > 0 && (
                <ExportButton onExportExcel={handleExportExcel} variant="outline" />
              )}
              <Button variant="outline" asChild>
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Inicio
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <FileText className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros y Búsqueda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros y Búsqueda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar exámenes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                  role="search"
                  aria-label="Buscar exámenes por título, descripción o asignatura"
                />
              </div>

              {/* Filtro por Asignatura */}
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las asignaturas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las asignaturas</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.nombre} ({subject.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro por Tipo */}
              <Select value={selectedTipo} onValueChange={setSelectedTipo}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {tipos.map(tipo => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Resultados del filtro */}
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {pagination ? (
                <>
                  Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, pagination.total)} -{' '}
                  {Math.min(currentPage * itemsPerPage, pagination.total)} de {pagination.total}{' '}
                  exámenes
                </>
              ) : (
                <>
                  Mostrando {filteredExams.length}{' '}
                  {filteredExams.length === 1 ? 'examen' : 'exámenes'}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Listado de Exámenes */}
        {filteredExams.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No se encontraron exámenes
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery || selectedSubject !== 'all' || selectedTipo !== 'all'
                  ? 'Intenta ajustar los filtros de búsqueda'
                  : 'No hay exámenes disponibles en este momento'}
              </p>
              {(searchQuery || selectedSubject !== 'all' || selectedTipo !== 'all') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedSubject('all')
                    setSelectedTipo('all')
                  }}
                >
                  Limpiar filtros
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} onStartExam={handleStartExam} />
              ))}
            </div>

            {/* Paginación */}
            {pagination && pagination.total > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(pagination.total / itemsPerPage)}
                  onPageChange={page => {
                    setCurrentPage(page)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                />
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </>
  )
}
