'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  Check,
  RotateCcw,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BookmarkButton } from '@/components/bookmarks/bookmark-button'
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button'
import { CreateNoteButton } from '@/components/notes/create-note-button'
import { StepByStepExplanationButton } from '@/components/explanations/step-by-step-explanation-button'
import { safeRound } from '@/app/api/notes/versions/validation-utils'

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
    nombre: string
    ejeTematico: string
  } | null
}

export default function QuickReviewPage() {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFinished, setIsFinished] = useState(false)
  const questionStartTimeRef = useRef<number>(Date.now())

  useEffect(() => {
    loadQuestions()
  }, [])

  async function loadQuestions() {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch('/api/review/quick?limit=10')
      if (!res.ok) {
        throw new Error('Error al cargar preguntas')
      }
      const data = await res.json()

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No tienes preguntas falladas para repasar. ¡Excelente trabajo!')
      }

      setQuestions(data.questions)
      questionStartTimeRef.current = Date.now()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar preguntas')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOptionSelect = (optionId: string) => {
    if (showExplanation) return

    const currentQ = questions[currentQuestion]
    const selectedOptionData = currentQ.options.find(opt => opt.id === optionId)
    const correct = selectedOptionData?.esCorrecta || false

    setSelectedOption(optionId)
    setIsCorrect(correct)
    setShowExplanation(true)
    setScore(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))

    if (correct) {
      toast.success('¡Correcto!', { duration: 2000 })
    } else {
      toast.error('Incorrecto', { duration: 2000 })
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setSelectedOption(null)
      setShowExplanation(false)
      setIsCorrect(false)
      questionStartTimeRef.current = Date.now()
    } else {
      setIsFinished(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setShowExplanation(false)
    setIsCorrect(false)
    setScore({ correct: 0, total: 0 })
    setIsFinished(false)
    questionStartTimeRef.current = Date.now()
    // Aleatorizar orden de preguntas
    setQuestions(prev => [...prev].sort(() => Math.random() - 0.5))
  }

  const getProgress = () => {
    if (questions.length === 0) return 0
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getScorePercentage = () => {
    if (score.total === 0) return 0
    return safeRound((score.correct / score.total) * 100, 0)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando preguntas para repaso rápido...</p>
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
              {error ? 'Error' : 'Sin preguntas'}
            </CardTitle>
            <CardDescription>{error || 'No hay preguntas falladas para repasar'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => router.push('/dashboard')} className="w-full">
              Volver al Dashboard
            </Button>
            {!error && (
              <Button variant="outline" onClick={() => router.push('/practice')} className="w-full">
                Ir a Práctica
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isFinished) {
    return (
      <div className="container mx-auto p-6 max-w-2xl">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Repaso Completado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{getScorePercentage()}%</div>
              <p className="text-muted-foreground">
                {score.correct} de {score.total} preguntas correctas
              </p>
            </div>
            <Progress value={getScorePercentage()} className="h-3" />
            <div className="flex items-center justify-center gap-4 pt-4">
              <Button onClick={handleRestart} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Repetir
              </Button>
              <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <RotateCcw className="h-6 w-6" />
                Repaso Rápido
              </h1>
              <HelpIcon
                content="Este repaso rápido muestra preguntas que has fallado anteriormente. Es ideal para reforzar conceptos difíciles. Recibirás feedback inmediato después de cada respuesta."
                side="right"
              />
            </div>
            <p className="text-muted-foreground text-sm mt-1">
              Preguntas que has fallado anteriormente
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {currentQuestion + 1} / {questions.length}
            </Badge>
            {score.total > 0 && (
              <Badge variant={getScorePercentage() >= 70 ? 'default' : 'destructive'}>
                {getScorePercentage()}%
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
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline">{currentQ.subject.nombre}</Badge>
                {currentQ.topic && <Badge variant="secondary">{currentQ.topic.nombre}</Badge>}
                <Badge variant="outline" className="text-xs">
                  Dificultad: {currentQ.dificultad}/5
                </Badge>
              </div>
              <CardTitle className="text-xl mb-2">{currentQ.enunciado}</CardTitle>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <BookmarkButton questionId={currentQ.id} size="sm" />
              <CreateFlashcardButton
                questionId={currentQ.id}
                defaultFront={currentQ.enunciado}
                defaultBack={currentQ.explicacion}
                size="sm"
              />
              <CreateNoteButton
                questionId={currentQ.id}
                defaultTitle={`Nota: ${currentQ.enunciado.substring(0, 50)}...`}
                defaultContent={currentQ.explicacion}
                size="sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            {currentQ.options.map(option => {
              const isSelected = selectedOption === option.id
              const showCorrect = showExplanation && option.esCorrecta
              const showIncorrect = showExplanation && isSelected && !option.esCorrecta

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
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
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold">{isCorrect ? '¡Correcto!' : 'Incorrecto'}</p>
                    <StepByStepExplanationButton
                      question={currentQ.enunciado}
                      correctAnswer={
                        currentQ.options.find(opt => opt.esCorrecta)?.texto || 'Respuesta correcta'
                      }
                      studentAnswer={
                        selectedOption
                          ? currentQ.options.find(opt => opt.id === selectedOption)?.texto
                          : undefined
                      }
                      topic={currentQ.topic?.nombre}
                      subject={currentQ.subject.nombre}
                      variant="outline"
                      size="sm"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">{currentQ.explicacion}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-end">
        <Button onClick={handleNext} disabled={!showExplanation} size="lg">
          {currentQuestion < questions.length - 1 ? (
            <>
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Finalizar
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
