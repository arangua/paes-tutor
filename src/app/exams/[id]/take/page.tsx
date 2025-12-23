'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Clock, CheckCircle2, XCircle, Loader2, ArrowLeft, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { captureError } from '@/lib/monitoring'

interface Exam {
  id: string
  titulo: string
  descripcion: string | null
  tipo: string
  tiempoLimiteMin: number | null
  totalPreguntas: number
  subject: {
    nombre: string
    codigo: string
  }
  questions: Array<{
    orden: number
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
  }>
}

interface Attempt {
  id: string
  estado: string
  startedAt: string
  examId: string
}

interface Answer {
  questionId: string
  optionSelectedId?: string
  omitida?: boolean
}

export default function TakeExamPage() {
  const params = useParams()
  const router = useRouter()
  const examId = params.id as string

  const [exam, setExam] = useState<Exam | null>(null)
  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map())
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved')
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showUnansweredDialog, setShowUnansweredDialog] = useState(false)
  const [unansweredCount, setUnansweredCount] = useState(0)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cargar examen y crear/obtener intento
  useEffect(() => {
    // VALIDACIÓN: Verificar que examId sea válido (formato cuid)
    if (!examId || !/^c[a-z0-9]{24}$/.test(examId)) {
      setError('ID de examen inválido')
      setIsLoading(false)
      return
    }

    async function loadExam() {
      try {
        setIsLoading(true)
        setError(null)

        // Cargar examen específico
        const examRes = await fetch(`/api/exams/${examId}`)
        if (!examRes.ok) {
          throw new Error('Error al cargar el examen')
        }
        const examData = await examRes.json()

        if (!examData) {
          throw new Error('Examen no encontrado')
        }

        // Ordenar preguntas por orden
        interface ExamQuestion {
          orden: number
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
        }

        interface AttemptAnswer {
          questionId: string
          optionSelectedId: string | null
          omitida: boolean
        }

        const sortedExam = {
          ...examData,
          questions: examData.questions.sort(
            (a: ExamQuestion, b: ExamQuestion) => a.orden - b.orden
          ),
        }
        setExam(sortedExam)

        // Crear o obtener intento
        const attemptRes = await fetch('/api/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ examId }),
        })

        if (!attemptRes.ok) {
          if (attemptRes.status === 401) {
            throw new Error(
              'Tu sesión ha expirado. Por favor, inicia sesión nuevamente para comenzar el examen.'
            )
          } else if (attemptRes.status === 404) {
            throw new Error(
              'El examen no se encontró. Verifica que el examen exista y que tengas acceso a él.'
            )
          } else if (attemptRes.status >= 500) {
            throw new Error('Error del servidor. Por favor, intenta nuevamente en unos momentos.')
          } else {
            throw new Error(
              'No se pudo iniciar el examen. Por favor, intenta nuevamente o contacta al administrador.'
            )
          }
        }

        const attemptData = await attemptRes.json()
        setAttempt(attemptData)

        // Cargar respuestas existentes si hay
        if (attemptData.answers && attemptData.answers.length > 0) {
          const existingAnswers = new Map<string, Answer>()
          attemptData.answers.forEach((ans: AttemptAnswer) => {
            existingAnswers.set(ans.questionId, {
              questionId: ans.questionId,
              optionSelectedId: ans.optionSelectedId || undefined,
              omitida: ans.omitida,
            })
          })
          setAnswers(existingAnswers)
        }

        // Calcular tiempo restante si hay límite
        if (examData.tiempoLimiteMin) {
          const startedAt = new Date(attemptData.startedAt)
          const limitMs = examData.tiempoLimiteMin * 60 * 1000
          const elapsed = Date.now() - startedAt.getTime()
          const remaining = Math.max(0, limitMs - elapsed)
          setTimeRemaining(Math.floor(remaining / 1000))
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Error desconocido al cargar el examen'
        setError(errorMessage)
        toast.error('Error al cargar el examen', {
          description: errorMessage,
          duration: 5000,
        })
      } finally {
        setIsLoading(false)
      }
    }

    if (examId) {
      loadExam()
    }
  }, [examId])

  const saveAnswers = useCallback(async () => {
    if (!attempt || !exam) return

    // VALIDACIÓN FRONTEND: Verificar que no haya más respuestas que preguntas
    if (answers.size > exam.totalPreguntas) {
      setError(`No puedes tener más de ${exam.totalPreguntas} respuestas`)
      setAutoSaveStatus('error')
      return
    }

    // VALIDACIÓN FRONTEND: Verificar que no haya respuestas duplicadas
    const questionIds = new Set<string>()
    const duplicates: string[] = []

    for (const answer of answers.values()) {
      if (questionIds.has(answer.questionId)) {
        duplicates.push(answer.questionId)
      }
      questionIds.add(answer.questionId)
    }

    if (duplicates.length > 0) {
      setError('Hay respuestas duplicadas. Por favor, revisa tus respuestas.')
      setAutoSaveStatus('error')
      return
    }

    try {
      setAutoSaveStatus('saving')
      const answersArray = Array.from(answers.values())

      const res = await fetch(`/api/attempts/${attempt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Error al guardar respuestas'
        const errorDetails = errorData.details ? `: ${errorData.details}` : ''
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      setAutoSaveStatus('saved')
      // Limpiar error si se guardó correctamente
      if (error) setError(null)
    } catch (err) {
      setAutoSaveStatus('error')
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar respuestas'

      // Mostrar toast solo si el error es crítico (no para errores temporales de red)
      if (
        err instanceof Error &&
        !errorMessage.includes('red') &&
        !errorMessage.includes('conexión')
      ) {
        toast.error('Error al guardar respuestas', {
          description: errorMessage,
          duration: 4000,
        })
      }

      // Log error usando servicio de monitoreo
      captureError(err instanceof Error ? err : new Error(String(err)), {
        type: 'exam_save_error',
        attemptId: attempt?.id,
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
    }
  }, [attempt, exam, answers, error])

  // Función para confirmar y finalizar examen
  const confirmSubmit = useCallback(async () => {
    if (!attempt || !exam || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    setShowUnansweredDialog(false)

    try {
      const answersArray = Array.from(answers.values())

      // VALIDACIÓN FRONTEND: Verificar límites antes de enviar
      if (answersArray.length > exam.totalPreguntas) {
        setError(
          `Error: Tienes ${answersArray.length} respuestas, pero el examen solo tiene ${exam.totalPreguntas} preguntas`
        )
        setIsSubmitting(false)
        return
      }

      // Guardar respuestas finales
      await fetch(`/api/attempts/${attempt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answersArray }),
      })

      // Finalizar intento
      const res = await fetch(`/api/attempts/${attempt.id}/submit`, {
        method: 'POST',
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        const errorMessage = errorData.error || 'Error al finalizar examen'
        const errorDetails = errorData.details ? `: ${errorData.details}` : ''
        throw new Error(`${errorMessage}${errorDetails}`)
      }

      // Redirigir a resultados
      router.push(`/exams/${examId}/results?attemptId=${attempt.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al finalizar examen'
      setError(errorMessage)
      setIsSubmitting(false)
      toast.error('Error al finalizar examen', {
        description: errorMessage,
        duration: 6000,
        action: {
          label: 'Reintentar',
          onClick: () => handleSubmit(),
        },
      })
    }
  }, [attempt, exam, answers, examId, router, isSubmitting])

  const handleSubmit = useCallback(async () => {
    if (!attempt || !exam || isSubmitting) return

    // VALIDACIÓN FRONTEND: Verificar que todas las preguntas tengan respuesta o estén omitidas
    const answersArray = Array.from(answers.values())
    const answeredQuestions = new Set(answersArray.map(a => a.questionId))
    const totalQuestions = exam.questions.length

    if (answeredQuestions.size < totalQuestions) {
      const unanswered = totalQuestions - answeredQuestions.size
      setUnansweredCount(unanswered)
      setShowUnansweredDialog(true)
      return
    }

    // Si todas las preguntas están respondidas, proceder directamente
    await confirmSubmit()
  }, [attempt, exam, answers, isSubmitting, confirmSubmit])

  // Timer countdown - optimizado para evitar re-renders innecesarios
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) {
      // Si el tiempo se agotó, auto-submit (solo si el intento aún está en progreso)
      if (timeRemaining === 0 && attempt && attempt.estado === 'en_progreso' && !isSubmitting) {
        handleSubmit()
      }
      return
    }

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          return 0 // Marcar como agotado, el efecto se ejecutará de nuevo
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
    // handleSubmit está memoizado con useCallback, es estable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, attempt, isSubmitting])

  // Auto-guardar respuestas con prevención de race condition
  useEffect(() => {
    if (!attempt || answers.size === 0) return

    // Cancelar timeout anterior si existe
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current)
    }

    saveTimeoutRef.current = setTimeout(async () => {
      await saveAnswers()
      saveTimeoutRef.current = null
    }, 2000) // Guardar después de 2 segundos de inactividad

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current)
        saveTimeoutRef.current = null
      }
    }
  }, [answers, attempt, saveAnswers])

  // Prevenir navegación accidental durante el examen
  useEffect(() => {
    if (!attempt || attempt.estado !== 'en_progreso') return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Guardar respuestas antes de salir
      if (answers.size > 0) {
        saveAnswers().catch(err => {
          captureError(err instanceof Error ? err : new Error(String(err)), {
            type: 'exam_save_error',
            action: 'before_unload',
            path: typeof window !== 'undefined' ? window.location.pathname : undefined,
          })
        })
      }

      // Mostrar advertencia del navegador
      e.preventDefault()
      e.returnValue =
        '¿Estás seguro de que quieres salir? Tu progreso se guardará automáticamente, pero perderás el tiempo restante del examen.'
      return e.returnValue
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [attempt, answers, saveAnswers])

  const handleAnswerSelect = (questionId: string, optionId: string) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev)
      newAnswers.set(questionId, {
        questionId,
        optionSelectedId: optionId,
        omitida: false,
      })
      return newAnswers
    })
  }

  const handleOmit = (questionId: string) => {
    setAnswers(prev => {
      const newAnswers = new Map(prev)
      newAnswers.set(questionId, {
        questionId,
        omitida: true,
      })
      return newAnswers
    })
  }

  const handleCancel = () => {
    setShowCancelDialog(true)
  }

  const confirmCancel = async () => {
    // Guardar progreso antes de salir
    if (attempt && answers.size > 0) {
      try {
        const res = await fetch(`/api/attempts/${attempt.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: Array.from(answers.values()) }),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          const errorMessage = errorData.error || 'Error desconocido'
          const errorDetails = errorData.details ? `: ${errorData.details}` : ''

          // Mostrar error mejorado
          setError(`No se pudo guardar el progreso${errorDetails}`)

          // Aún así redirigir, pero el usuario sabe que hubo un problema
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
        setError(`Error al guardar el progreso: ${errorMessage}`)
        // Esperar un momento para que el usuario vea el error
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    }
    router.push('/dashboard')
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgress = () => {
    if (!exam) return 0
    return (answers.size / exam.totalPreguntas) * 100
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando examen...</p>
        </div>
      </div>
    )
  }

  if (error || !exam || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudo cargar el examen'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = exam.questions[currentQuestion]
  const currentAnswer = answers.get(currentQ.question.id)

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Botón de volver */}
      <div className="mb-4">
        <Button variant="ghost" onClick={handleCancel} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Cancelar Examen
        </Button>
      </div>

      {/* Dialog de confirmación de cancelación */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Cancelar examen?</DialogTitle>
            <DialogDescription>
              Tu progreso se guardará automáticamente. Podrás continuar más tarde desde el
              dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
              Continuar Examen
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Sí, Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog de confirmación de preguntas sin responder */}
      <Dialog open={showUnansweredDialog} onOpenChange={setShowUnansweredDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Finalizar con preguntas sin responder?</DialogTitle>
            <DialogDescription>
              {unansweredCount === 1
                ? 'Tienes 1 pregunta sin responder. ¿Deseas finalizar el examen de todas formas?'
                : `Tienes ${unansweredCount} preguntas sin responder. ¿Deseas finalizar el examen de todas formas?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUnansweredDialog(false)}>
              Volver al Examen
            </Button>
            <Button
              onClick={() => {
                setShowUnansweredDialog(false)
                confirmSubmit()
              }}
            >
              Sí, Finalizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header con timer y progreso */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>{exam.titulo}</CardTitle>
                <HelpIcon
                  content="Durante el examen, tu progreso se guarda automáticamente cada 2 segundos. Puedes navegar entre preguntas usando los botones o el mapa de preguntas. Presiona 'Omitir pregunta' si no estás seguro de la respuesta."
                  side="right"
                />
              </div>
              <CardDescription className="mt-1">
                {exam.subject.nombre} • {exam.totalPreguntas} preguntas
              </CardDescription>
            </div>
            {timeRemaining !== null && (
              <Badge
                variant={timeRemaining < 300 ? 'destructive' : 'default'}
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                {formatTime(timeRemaining)}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progreso</span>
              <span>
                {answers.size} / {exam.totalPreguntas} respondidas
              </span>
            </div>
            <Progress value={getProgress()} />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Pregunta {currentQuestion + 1} de {exam.totalPreguntas}
              </span>
              <span className="flex items-center gap-2">
                {autoSaveStatus === 'saving' && (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Guardando...
                  </>
                )}
                {autoSaveStatus === 'saved' && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                    Guardado
                  </>
                )}
                {autoSaveStatus === 'error' && (
                  <>
                    <XCircle className="h-3 w-3 text-destructive" />
                    Error al guardar
                  </>
                )}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pregunta actual */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Pregunta {currentQuestion + 1}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-base leading-relaxed">{currentQ.question.enunciado}</p>

          <div className="space-y-2">
            {currentQ.question.options.map(option => {
              const isSelected = currentAnswer?.optionSelectedId === option.id
              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(currentQ.question.id, option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'border-primary bg-primary' : 'border-muted-foreground'
                      }`}
                    >
                      {isSelected && <div className="w-3 h-3 rounded-full bg-primary-foreground" />}
                    </div>
                    <span className="font-medium mr-2">{option.letra}.</span>
                    <span>{option.texto}</span>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => handleOmit(currentQ.question.id)}
              className="flex-1"
            >
              Omitir pregunta
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Anterior
        </Button>

        <div className="flex gap-2">
          {exam.questions.map((_, idx) => {
            const hasAnswer = answers.has(exam.questions[idx].question.id)
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded text-sm ${
                  idx === currentQuestion
                    ? 'bg-primary text-primary-foreground'
                    : hasAnswer
                      ? 'bg-green-500 text-white'
                      : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {idx + 1}
              </button>
            )
          })}
        </div>

        <Button
          variant="outline"
          onClick={() =>
            setCurrentQuestion(Math.min(exam.questions.length - 1, currentQuestion + 1))
          }
          disabled={currentQuestion === exam.questions.length - 1}
        >
          Siguiente
        </Button>
      </div>

      {/* Botón finalizar */}
      <div className="mt-6 flex justify-center">
        <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="min-w-[200px]">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Finalizando...
            </>
          ) : (
            'Finalizar Examen'
          )}
        </Button>
      </div>
    </div>
  )
}
