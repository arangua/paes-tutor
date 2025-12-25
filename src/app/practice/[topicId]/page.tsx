'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BookmarkButton } from '@/components/bookmarks/bookmark-button'
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button'
import { CreateNoteButton } from '@/components/notes/create-note-button'

interface Question {
  id: string
  enunciado: string
  explicacion: string
  dificultad: number
  options: Array<{
    id: string
    letra: string
    texto: string
    esCorrecta: boolean
  }>
  subject: {
    nombre: string
    codigo: string
  }
  topic: {
    id?: string
    nombre: string
    ejeTematico: string
  }
}

interface Answer {
  questionId: string
  optionSelectedId?: string
  omitida?: boolean
  tiempoSegundos?: number
  isCorrect?: boolean
  answeredAt?: number
}

export default function PracticeTopicPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topicId as string

  const [questions, setQuestions] = useState<Question[]>([])
  const [topicName, setTopicName] = useState<string>('')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map())
  const [showExplanation, setShowExplanation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [startTime, setStartTime] = useState<number>(Date.now())
  const questionStartTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    if (!topicId) {
      setError('ID de tema inválido')
      setIsLoading(false)
      return
    }

    async function loadQuestions() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`/api/practice/questions?topicId=${topicId}&limit=20`)
        if (!res.ok) {
          throw new Error('Error al cargar preguntas')
        }
        const data = await res.json()

        if (!data.questions || data.questions.length === 0) {
          throw new Error('No hay preguntas disponibles para este tema')
        }

        setQuestions(data.questions)
        setTopicName(data.topic?.nombre || 'Tema')
        setStartTime(Date.now())
        questionStartTimeRef.current = Date.now()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        toast.error('Error al cargar preguntas')
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestions()
  }, [topicId])

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) return // No permitir cambiar respuesta después de ver explicación

    const currentQ = questions[currentQuestion]
    const selectedOption = currentQ.options.find(opt => opt.id === optionId)
    const isCorrect = selectedOption?.esCorrecta || false
    const tiempoSegundos = Math.floor((Date.now() - questionStartTimeRef.current) / 1000)

    setAnswers(prev => {
      const newAnswers = new Map(prev)
      newAnswers.set(currentQ.id, {
        questionId: currentQ.id,
        optionSelectedId: optionId,
        omitida: false,
        tiempoSegundos,
        isCorrect,
        answeredAt: Date.now(),
      })
      return newAnswers
    })

    // Mostrar feedback inmediato
    setShowExplanation(true)

    if (isCorrect) {
      toast.success('¡Correcto!', { duration: 2000 })
    } else {
      toast.error('Incorrecto', { duration: 2000 })
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setShowExplanation(false)
      questionStartTimeRef.current = Date.now()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
      setShowExplanation(false)
      questionStartTimeRef.current = Date.now()
    }
  }

  const handleFinish = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const answersArray = Array.from(answers.values()).map(answer => ({
        questionId: answer.questionId,
        optionSelectedId: answer.optionSelectedId,
        omitida: answer.omitida || false,
        tiempoSegundos: answer.tiempoSegundos || 0,
      }))

      // Agregar preguntas sin responder como omitidas
      const answeredQuestionIds = new Set(answersArray.map(a => a.questionId))
      questions.forEach(q => {
        if (!answeredQuestionIds.has(q.id)) {
          answersArray.push({
            questionId: q.id,
            omitida: true,
            tiempoSegundos: 0,
          })
        }
      })

      const res = await fetch('/api/practice/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          answers: answersArray,
        }),
      })

      if (!res.ok) {
        const { safeJsonParse } = await import('@/lib/api-helpers')
        const errorData = await safeJsonParse<{ error?: string }>(res, {
          path: typeof window !== 'undefined' ? window.location.pathname : '/practice/[topicId]',
          operation: 'guardar sesión de práctica',
        })
        throw new Error(errorData.error || 'Error al guardar sesión')
      }

      const data = await res.json()

      // Guardar sesión en sessionStorage para la página de resultados
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`practice-session-${data.session.id}`, JSON.stringify(data.session))
      }

      toast.success('Sesión de práctica completada')

      // Redirigir a resultados
      router.push(`/practice/${topicId}/results?sessionId=${data.session.id}`)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error('Error al finalizar práctica', {
        description: errorMessage,
      })
      setIsSubmitting(false)
    }
  }

  const getProgress = () => {
    if (questions.length === 0) return 0
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getScore = () => {
    const correct = Array.from(answers.values()).filter(a => a.isCorrect).length
    const total = answers.size
    return total > 0 ? Math.round((correct / total) * 100) : 0
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando preguntas...</p>
        </div>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudieron cargar las preguntas'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/practice')}>Volver a Selección</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const currentAnswer = answers.get(currentQ.id)
  const isAnswered = !!currentAnswer
  const isCorrect = currentAnswer?.isCorrect || false

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/practice')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="outline">{topicName}</Badge>
            <Badge variant="secondary">
              Pregunta {currentQuestion + 1} de {questions.length}
            </Badge>
            {isAnswered && (
              <Badge variant={isCorrect ? 'default' : 'destructive'}>
                {isCorrect ? 'Correcta' : 'Incorrecta'}
              </Badge>
            )}
          </div>
        </div>
        <Progress value={getProgress()} className="h-2" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Pregunta {currentQuestion + 1}</CardTitle>
              <BookmarkButton questionId={currentQ.id} />
              <CreateFlashcardButton
                questionId={currentQ.id}
                defaultFront={currentQ.enunciado}
                defaultBack={currentQ.explicacion}
                size="sm"
              />
              <CreateNoteButton
                questionId={currentQ.id}
                topicId={topicId}
                defaultTitle={`Nota: ${currentQ.enunciado.substring(0, 50)}...`}
                defaultContent={currentQ.explicacion}
                size="sm"
              />
            </div>
            <HelpIcon content="Selecciona una respuesta para recibir feedback inmediato. Puedes navegar entre preguntas con los botones de abajo." />
          </div>
          <CardDescription>
            {currentQ.subject.nombre} - {currentQ.topic.ejeTematico}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{currentQ.enunciado}</p>

          <div className="space-y-2">
            {currentQ.options.map(option => {
              const isSelected = currentAnswer?.optionSelectedId === option.id
              const showCorrect = showExplanation && option.esCorrecta
              const showIncorrect = showExplanation && isSelected && !option.esCorrecta

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
                  disabled={showExplanation}
                  className={`
                    w-full p-4 text-left rounded-lg border-2 transition-all
                    ${
                      isSelected
                        ? showCorrect
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                          : showIncorrect
                            ? 'border-red-500 bg-red-50 dark:bg-red-950/20'
                            : 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }
                    ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:bg-accent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${
                        isSelected
                          ? showCorrect
                            ? 'bg-green-500 text-white'
                            : showIncorrect
                              ? 'bg-red-500 text-white'
                              : 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                    >
                      {showCorrect ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : showIncorrect ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        option.letra
                      )}
                    </div>
                    <span className="flex-1">{option.texto}</span>
                    {showCorrect && (
                      <Badge variant="default" className="bg-green-600">
                        Correcta
                      </Badge>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div
              className={`
              mt-4 p-4 rounded-lg border-2
              ${
                isCorrect
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                  : 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
              }
            `}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                ) : (
                  <XCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="font-semibold mb-2">{isCorrect ? '¡Correcto!' : 'Incorrecto'}</p>
                  <p className="text-sm text-muted-foreground">{currentQ.explicacion}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Progreso: {answers.size} / {questions.length}
          </span>
          {answers.size > 0 && <Badge variant="secondary">{getScore()}% correctas</Badge>}
        </div>

        {currentQuestion < questions.length - 1 ? (
          <Button onClick={handleNext} disabled={!isAnswered}>
            Siguiente
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleFinish} disabled={!isAnswered || isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finalizando...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Finalizar Práctica
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}
