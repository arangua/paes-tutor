'use client'

import { useEffect, useState } from 'react'
import { formatDuration as formatDurationSafe } from '@/lib/utils'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle2,
  XCircle,
  Circle,
  Clock,
  TrendingUp,
  BookOpen,
  Loader2,
  AlertCircle,
  BarChart3,
  Printer,
} from 'lucide-react'
import { CreateChallengeButton } from '@/components/challenges/create-challenge-button'
import { ExportButton } from '@/components/export/export-button'
import {
  exportExamResultsToPDF,
  exportExamResultsToExcel,
  exportExamResultsToWord,
  type ExamResultData,
} from '@/lib/export-utils'
import { toast } from 'sonner'
import { useProgressTracker } from '@/hooks/useProgressTracker'
import { ProgressDialog } from '@/components/ui/progress-dialog'

// ✅ Enterprise: Lazy loading de componentes pesados que no son críticos para el render inicial
// Los componentes de exportación y desafíos solo se cargan cuando el usuario interactúa con ellos

interface Attempt {
  id: string
  estado: string
  porcentaje: number
  correctas: number
  incorrectas: number
  omitidas: number
  totalPreguntas: number
  puntajePaes: number | null
  puntajeEstimado: boolean
  duracionSegundos: number | null
  startedAt: string
  finishedAt: string | null
  exam: {
    id: string
    titulo: string
    subject: {
      nombre: string
      codigo: string
    }
  }
  answers: Array<{
    id: string
    questionId: string
    optionSelectedId: string | null
    esCorrecta: boolean | null
    omitida: boolean
    question: {
      id: string
      enunciado: string
      explicacion: string
      options: Array<{
        id: string
        letra: string
        texto: string
        esCorrecta: boolean
      }>
    }
    optionSelected: {
      id: string
      letra: string
      texto: string
    } | null
  }>
}

/**
 * Página de resultados inmediatos después de completar un examen
 * 
 * @component
 * @description
 * Muestra los resultados de un examen completado con las siguientes funcionalidades:
 * - Resumen de puntaje y estadísticas (correctas, incorrectas, omitidas)
 * - Puntaje PAES (si aplica) con indicador de estimación
 * - Revisión completa de todas las preguntas con explicaciones
 * - Indicadores visuales (correcta/incorrecta/omitida)
 * - Opciones de exportación (PDF, Excel, Word)
 * - Botón para crear desafío basado en el examen
 * - Navegación a análisis detallado
 * 
 * @example
 * ```tsx
 * // Navegación desde página de examen
 * router.push(`/exams/${examId}/results?attemptId=${attemptId}`)
 * ```
 * 
 * @remarks
 * - Requiere attemptId como query parameter
 * - Valida que el intento esté completado
 * - Soporta exportación de resultados en múltiples formatos
 * - Integra con sistema de desafíos
 * - Muestra progreso de exportación cuando se exporta
 * 
 * @see {@link exportExamResultsToPDF} Para exportación a PDF
 * @see {@link exportExamResultsToExcel} Para exportación a Excel
 * @see {@link exportExamResultsToWord} Para exportación a Word
 * @see {@link CreateChallengeButton} Para crear desafíos
 */
export default function ExamResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const examId = params.id as string
  const attemptId = searchParams.get('attemptId')

  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const exportProgress = useProgressTracker()

  useEffect(() => {
    async function loadResults() {
      if (!attemptId) {
        setError('ID de intento no proporcionado')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)

        // Obtener intento con respuestas
        const res = await fetch(`/api/attempts/${attemptId}`)

        if (!res.ok) {
          let errorMessage = 'Error al cargar resultados'
          if (res.status === 404) {
            errorMessage =
              'Resultados no encontrados. El intento puede haber sido eliminado o el ID es incorrecto.'
          } else if (res.status === 401) {
            errorMessage = 'No tienes permiso para ver estos resultados. Por favor, inicia sesión.'
          } else if (res.status >= 500) {
            errorMessage = 'Error del servidor. Por favor, intenta nuevamente más tarde.'
          }
          throw new Error(errorMessage)
        }

        const data = await res.json()
        setAttempt(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(errorMessage)
        toast.error('Error al cargar resultados', {
          description: errorMessage,
          duration: 5000,
          action: {
            label: 'Reintentar',
            onClick: () => window.location.reload(),
          },
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadResults()
  }, [attemptId])

  // ✅ Enterprise: Usar función segura centralizada para formateo de tiempo
  const formatDurationLocal = formatDurationSafe

  const getScoreColor = (porcentaje: number) => {
    if (porcentaje >= 70) return 'text-green-600'
    if (porcentaje >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  // getScoreBadgeVariant no se usa actualmente
  // const _getScoreBadgeVariant = (porcentaje: number): 'default' | 'secondary' | 'destructive' => {
  //   if (porcentaje >= 70) return 'default'
  //   if (porcentaje >= 50) return 'secondary'
  //   return 'destructive'
  // }

  const handlePrint = () => {
    window.print()
  }

  const prepareExportData = (): ExamResultData | null => {
    if (!attempt) return null

    return {
      examTitle: attempt.exam.titulo,
      subjectName: attempt.exam.subject.nombre,
      percentage: attempt.porcentaje,
      correctas: attempt.correctas,
      incorrectas: attempt.incorrectas,
      omitidas: attempt.omitidas,
      totalPreguntas: attempt.totalPreguntas,
      puntajePaes: attempt.puntajePaes,
      duracionSegundos: attempt.duracionSegundos,
      startedAt: attempt.startedAt,
      finishedAt: attempt.finishedAt,
      answers: attempt.answers.map((answer, idx) => ({
        questionNumber: idx + 1,
        enunciado: answer.question.enunciado,
        selectedOption: answer.optionSelected?.letra,
        correctOption: answer.question.options.find(o => o.esCorrecta)?.letra || '',
        isCorrect: answer.esCorrecta === true,
        isOmitted: answer.omitida,
        explicacion: answer.question.explicacion || undefined,
        options: answer.question.options.map(opt => ({
          letra: opt.letra,
          texto: opt.texto,
          esCorrecta: opt.esCorrecta,
        })),
      })),
    }
  }

  const handleExportPDF = async () => {
    const data = prepareExportData()
    if (!data) {
      toast.error('No hay datos disponibles', {
        description: 'No se encontraron datos del examen para exportar.',
      })
      return
    }
    try {
      exportProgress.start(3 + data.answers.length, 'Iniciando exportación a PDF...')
      await exportExamResultsToPDF(data, (progress, current, total, message) => {
        exportProgress.updateProgress(current, total, message)
      })
      exportProgress.complete()
      toast.success('Exportación exitosa', {
        description: 'El archivo PDF se ha descargado correctamente.',
      })
    } catch (error) {
      exportProgress.fail(error instanceof Error ? error : new Error('Error desconocido'))
      toast.error('Error al exportar', {
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar el archivo PDF. Por favor, intenta nuevamente.',
      })
    }
  }

  const handleExportExcel = async () => {
    const data = prepareExportData()
    if (!data) {
      toast.error('No hay datos disponibles', {
        description: 'No se encontraron datos del examen para exportar.',
      })
      return
    }
    try {
      exportProgress.start(4, 'Iniciando exportación a Excel...')
      await exportExamResultsToExcel(data, (progress, current, total, message) => {
        exportProgress.updateProgress(current, total, message)
      })
      exportProgress.complete()
      toast.success('Exportación exitosa', {
        description: 'El archivo Excel se ha descargado correctamente.',
      })
    } catch (error) {
      exportProgress.fail(error instanceof Error ? error : new Error('Error desconocido'))
      toast.error('Error al exportar', {
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar el archivo Excel. Por favor, intenta nuevamente.',
      })
    }
  }

  const handleExportWord = async () => {
    const data = prepareExportData()
    if (!data) {
      toast.error('No hay datos disponibles', {
        description: 'No se encontraron datos del examen para exportar.',
      })
      return
    }
    try {
      exportProgress.start(3 + data.answers.length, 'Iniciando exportación a Word...')
      await exportExamResultsToWord(data, (progress, current, total, message) => {
        exportProgress.updateProgress(current, total, message)
      })
      exportProgress.complete()
      toast.success('Exportación exitosa', {
        description: 'El archivo Word se ha descargado correctamente.',
      })
    } catch (error) {
      exportProgress.fail(error instanceof Error ? error : new Error('Error desconocido'))
      toast.error('Error al exportar', {
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar el archivo Word. Por favor, intenta nuevamente.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudieron cargar los resultados'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ProgressDialog
        open={exportProgress.isActive}
        title="Exportando resultados"
        description="Por favor espera mientras se genera el archivo..."
        progress={exportProgress.progress}
        current={exportProgress.current}
        total={exportProgress.total}
        message={exportProgress.message}
        estimatedTimeRemaining={exportProgress.estimatedTimeRemaining}
      />
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `}} />
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        {/* Header con resumen */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{attempt.exam.titulo}</CardTitle>
            <CardDescription>{attempt.exam.subject.nombre}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(attempt.porcentaje)}`}>
                  {attempt.porcentaje.toFixed(1)}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Puntaje</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {attempt.correctas} / {attempt.totalPreguntas}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Correctas</p>
              </div>
              {attempt.puntajePaes && (
                <div className="text-center">
                  <div className="text-4xl font-bold flex items-center justify-center gap-2">
                    {attempt.puntajePaes}
                    {attempt.puntajeEstimado && (
                      <Badge variant="secondary" className="text-xs">
                        ~
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Puntaje PAES</p>
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{attempt.correctas}</div>
                <p className="text-xs text-muted-foreground">Correctas</p>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{attempt.incorrectas}</div>
                <p className="text-xs text-muted-foreground">Incorrectas</p>
              </div>
              <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{attempt.omitidas}</div>
                <p className="text-xs text-muted-foreground">Omitidas</p>
              </div>
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 flex items-center justify-center gap-1">
                  <Clock className="h-5 w-5" />
                  {formatDurationLocal(attempt.duracionSegundos)}
                </div>
                <p className="text-xs text-muted-foreground">Duración</p>
              </div>
            </div>

            <div className="mt-6">
              <Progress value={attempt.porcentaje} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Preguntas y respuestas */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Revisión de Respuestas</CardTitle>
            <CardDescription>Revisa tus respuestas y las explicaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {attempt.answers.map((answer, idx) => {
              const isCorrect = answer.esCorrecta === true
              const isOmitted = answer.omitida

              return (
                <div
                  key={answer.id}
                  className={`p-4 rounded-lg border-2 ${
                    isCorrect
                      ? 'border-green-500 bg-green-50 dark:bg-green-950'
                      : isOmitted
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
                        : 'border-red-500 bg-red-50 dark:bg-red-950'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="flex-shrink-0">
                      {isCorrect ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      ) : isOmitted ? (
                        <Circle className="h-6 w-6 text-yellow-600" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Pregunta {idx + 1}</Badge>
                        {isCorrect && <Badge variant="default">Correcta</Badge>}
                        {isOmitted && <Badge variant="secondary">Omitida</Badge>}
                        {!isCorrect && !isOmitted && (
                          <Badge variant="destructive">Incorrecta</Badge>
                        )}
                      </div>
                      <p className="font-medium mb-3">{answer.question.enunciado}</p>
                    </div>
                  </div>

                  <div className="space-y-2 ml-9">
                    {answer.question.options.map(option => {
                      const isSelected = answer.optionSelectedId === option.id
                      const isCorrectOption = option.esCorrecta

                      return (
                        <div
                          key={option.id}
                          className={`p-3 rounded border ${
                            isCorrectOption
                              ? 'border-green-500 bg-green-100 dark:bg-green-900'
                              : isSelected
                                ? 'border-red-500 bg-red-100 dark:bg-red-900'
                                : 'border-border'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.letra}.</span>
                            <span>{option.texto}</span>
                            {isCorrectOption && (
                              <Badge variant="default" className="ml-auto">
                                Correcta
                              </Badge>
                            )}
                            {isSelected && !isCorrectOption && (
                              <Badge variant="destructive" className="ml-auto">
                                Tu respuesta
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {answer.question.explicacion && (
                    <div className="mt-4 p-3 bg-muted rounded-lg ml-9">
                      <p className="text-sm font-medium mb-1">Explicación:</p>
                      <p className="text-sm">{answer.question.explicacion}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Acciones */}
        <div className="flex gap-4 justify-center flex-wrap no-print">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir Resultados
          </Button>
          <ExportButton
            onExportPDF={handleExportPDF}
            onExportExcel={handleExportExcel}
            onExportWord={handleExportWord}
            variant="outline"
          />
          <Button variant="outline" onClick={() => router.push('/dashboard')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          {attemptId && (
            <Button variant="outline" onClick={() => router.push(`/attempts/${attemptId}`)}>
              <BarChart3 className="h-4 w-4 mr-2" />
              Ver Análisis Detallado
            </Button>
          )}
          <CreateChallengeButton examId={examId} examTitle={attempt.exam.titulo} />
          <Button onClick={() => router.push(`/exams/${examId}/take`)}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Intentar Nuevamente
          </Button>
        </div>
      </div>
    </>
  )
}
