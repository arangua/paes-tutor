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

function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0

  if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
    const buf = new Uint32Array(1)
    crypto.getRandomValues(buf)
    return buf[0] % maxExclusive
  }

  // Si no hay Web Crypto disponible, evitar pseudo-azar.
  // Preferimos determinismo antes que usar un RNG inseguro.
  return 0
}

type QuestionOption = Question['options'][number]

type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect'

function getOptionState(args: {
  isSelected: boolean
  showExplanation: boolean
  isCorrectOption: boolean
}): OptionState {
  if (!args.isSelected) return 'idle'
  if (!args.showExplanation) return 'selected'
  return args.isCorrectOption ? 'correct' : 'incorrect'
}

function getOptionButtonVariantClassName(state: OptionState): string {
  switch (state) {
    case 'correct':
      return 'border-green-500 bg-green-50 dark:bg-green-950/20'
    case 'incorrect':
      return 'border-red-500 bg-red-50 dark:bg-red-950/20'
    case 'selected':
      return 'border-primary bg-primary/5'
    case 'idle':
    default:
      return 'border-border hover:border-primary/50'
  }
}

function getOptionLetterBubbleClassName(state: OptionState): string {
  switch (state) {
    case 'correct':
      return 'bg-green-500 text-white'
    case 'incorrect':
      return 'bg-red-500 text-white'
    case 'selected':
      return 'bg-primary text-primary-foreground'
    case 'idle':
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function getOptionLetterContent(state: OptionState, letter: string): JSX.Element | string {
  if (state === 'correct') return <CheckCircle2 className="h-5 w-5" />
  if (state === 'incorrect') return <XCircle className="h-5 w-5" />
  return letter
}

function getSelectedOptionText(
  selectedOptionId: string | null,
  options: QuestionOption[]
): string | undefined {
  if (!selectedOptionId) return undefined
  return options.find(opt => opt.id === selectedOptionId)?.texto
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1)
    const right = arr.at(i)
    const left = arr.at(j)
    if (right !== undefined && left !== undefined) {
      arr.splice(i, 1, left)
      arr.splice(j, 1, right)
    }
  }
  return arr
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

    const currentQ = questions.at(currentQuestion)
    if (!currentQ) return
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
    setQuestions(prev => shuffleInPlace([...prev]))
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

  const currentQ = questions.at(currentQuestion)
  if (!currentQ) {
    return null
  }

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
              const optionState = getOptionState({
                isSelected,
                showExplanation,
                isCorrectOption: option.esCorrecta,
              })
              const optionButtonVariantClassName = getOptionButtonVariantClassName(optionState)
              const optionLetterBubbleClassName = getOptionLetterBubbleClassName(optionState)
              const optionLetterContent = getOptionLetterContent(optionState, option.letra)
              const showCorrect = optionState === 'correct'

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  disabled={showExplanation}
                  className={`
                    w-full p-4 text-left rounded-lg border-2 transition-all
                    ${
                      optionButtonVariantClassName
                    }
                    ${showExplanation ? 'cursor-default' : 'cursor-pointer hover:bg-accent'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold
                      ${
                        optionLetterBubbleClassName
                      }
                    `}
                    >
                      {optionLetterContent}
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
                      studentAnswer={getSelectedOptionText(selectedOption, currentQ.options)}
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
