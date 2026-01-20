'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  TrendingUp,
  Clock,
  BarChart3,
  Award,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BookmarkButton } from '@/components/bookmarks/bookmark-button'
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button'
import { CreateNoteButton } from '@/components/notes/create-note-button'
import { StepByStepExplanationButton } from '@/components/explanations/step-by-step-explanation-button'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { SubjectIcon } from '@/lib/subject-icons'
import { safeRound } from '@/app/api/notes/versions/validation-utils'
import { validateIdParam } from '@/lib/validation-helpers'
import Link from 'next/link'

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

type PracticeMode = 'easy' | 'medium' | 'hard' | 'mixed'

type QuestionOption = Question['options'][number]

function getOptionButtonVariantClassName(args: {
  isSelected: boolean
  showCorrect: boolean
  showIncorrect: boolean
}): string {
  if (!args.isSelected) return 'border-border hover:border-primary/50'
  if (args.showCorrect) return 'border-green-500 bg-green-50 dark:bg-green-950/20'
  if (args.showIncorrect) return 'border-red-500 bg-red-50 dark:bg-red-950/20'
  return 'border-primary bg-primary/5'
}

function getOptionLetterBubbleClassName(args: {
  isSelected: boolean
  showCorrect: boolean
  showIncorrect: boolean
}): string {
  if (!args.isSelected) return 'bg-muted text-muted-foreground'
  if (args.showCorrect) return 'bg-green-500 text-white'
  if (args.showIncorrect) return 'bg-red-500 text-white'
  return 'bg-primary text-primary-foreground'
}

function getCorrectExplanationContainerClassName(): string {
  return 'border-green-500 bg-green-50 dark:bg-green-950/20'
}

function getIncorrectExplanationContainerClassName(): string {
  return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
}

function getCorrectFeedbackTitle(): string {
  return '¡Correcto! 🎉'
}

function getIncorrectFeedbackTitle(): string {
  return 'Incorrecto'
}

function getSelectedOptionText(
  selectedOptionId: string | undefined,
  options: QuestionOption[]
): string | undefined {
  if (!selectedOptionId) return undefined
  return options.find(opt => opt.id === selectedOptionId)?.texto
}

export default function PracticeTopicPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = params.topicId as string
  const mode = (searchParams.get('mode') as PracticeMode) || 'mixed'

  const [questions, setQuestions] = useState<Question[]>([])
  const [topicName, setTopicName] = useState<string>('')
  const [topicInfo, setTopicInfo] = useState<{ subjectName: string; subjectCode: string } | null>(
    null
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Map<string, Answer>>(new Map())
  const [showExplanation, setShowExplanation] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [practiceMode, setPracticeMode] = useState<PracticeMode>(mode)
  const questionStartTimeRef = useRef<number>(Date.now())
  const [stats, setStats] = useState<{
    correct: number
    incorrect: number
    total: number
    streak: number
    bestStreak: number
  }>({
    correct: 0,
    incorrect: 0,
    total: 0,
    streak: 0,
    bestStreak: 0,
  })

  // Cargar preguntas
  useEffect(() => {
    if (!validateIdParam(topicId)) {
      setError('ID de tema inválido')
      setIsLoading(false)
      return
    }

    async function loadQuestions() {
      try {
        setIsLoading(true)
        setError(null)

        const params = new URLSearchParams({
          topicId,
          limit: '20',
        })
        if (practiceMode !== 'mixed') {
          params.append('difficulty', practiceMode)
        }

        const res = await fetch(`/api/practice/questions?${params.toString()}`)
        if (!res.ok) {
          throw new Error('Error al cargar preguntas')
        }
        const data = await res.json()

        if (!data.questions || data.questions.length === 0) {
          throw new Error('No hay preguntas disponibles para este tema')
        }

        setQuestions(data.questions)
        setTopicName(data.topic?.nombre || 'Tema')
        if (data.questions.length > 0) {
          setTopicInfo({
            subjectName: data.questions[0].subject.nombre,
            subjectCode: data.questions[0].subject.codigo,
          })
        }
        setStartTime(Date.now())
        questionStartTimeRef.current = Date.now()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        toast.error('Error al cargar preguntas', {
          description: err instanceof Error ? err.message : 'Error desconocido',
        })
      } finally {
        setIsLoading(false)
      }
    }
    loadQuestions()
  }, [topicId, practiceMode])

  const handleAnswerSelect = (optionId: string) => {
    if (showExplanation) return // No permitir cambiar respuesta después de ver explicación

    const currentQ = questions.at(currentQuestion)
    if (!currentQ) return
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

    // Actualizar estadísticas
    setStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0
      return {
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        total: prev.total + 1,
        streak: newStreak,
        bestStreak: Math.max(prev.bestStreak, newStreak),
      }
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

      toast.success('Sesión de práctica completada', {
        description: `Rendimiento: ${data.session.porcentaje.toFixed(1)}%`,
      })

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

  const handleModeChange = (newMode: PracticeMode) => {
    setPracticeMode(newMode)
    setCurrentQuestion(0)
    setAnswers(new Map())
    setShowExplanation(false)
    setStats({
      correct: 0,
      incorrect: 0,
      total: 0,
      streak: 0,
      bestStreak: 0,
    })
    // Recargar preguntas con el nuevo modo
    router.replace(`/practice/${topicId}?mode=${newMode}`, { scroll: false })
  }

  const getProgress = () => {
    if (questions.length === 0) return 0
    return ((currentQuestion + 1) / questions.length) * 100
  }

  const getScore = () => {
    if (stats.total === 0) return 0
    return safeRound((stats.correct / stats.total) * 100, 0)
  }

  const getDifficultyLabel = (dificultad: number) => {
    if (dificultad <= 2)
      return { label: 'Fácil', color: 'text-green-600', variant: 'default' as const }
    if (dificultad <= 4)
      return { label: 'Medio', color: 'text-yellow-600', variant: 'secondary' as const }
    return { label: 'Difícil', color: 'text-red-600', variant: 'destructive' as const }
  }

  const getModeLabel = (mode: PracticeMode) => {
    switch (mode) {
      case 'easy':
        return { label: 'Fácil', icon: '🟢', description: 'Preguntas de dificultad 1-2' }
      case 'medium':
        return { label: 'Medio', icon: '🟡', description: 'Preguntas de dificultad 3-4' }
      case 'hard':
        return { label: 'Difícil', icon: '🔴', description: 'Preguntas de dificultad 5' }
      default:
        return { label: 'Mixto', icon: '🎯', description: 'Todas las dificultades' }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando preguntas...
            </p>
            <p className="text-sm text-muted-foreground">
              Preparando tu sesión de práctica personalizada
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || questions.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Práctica', href: '/practice' },
            { label: 'Error' },
          ]}
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudieron cargar las preguntas'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error ||
                'No hay preguntas disponibles para este tema. Intenta con otro tema o verifica que haya contenido disponible.'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/practice')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Selección
              </Button>
              <Button onClick={() => window.location.reload()}>Reintentar</Button>
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
  const currentAnswer = answers.get(currentQ.id)
  const isAnswered = !!currentAnswer
  const isCorrect = currentAnswer?.isCorrect || false
  const difficultyInfo = getDifficultyLabel(currentQ.dificultad)
  const modeInfo = getModeLabel(practiceMode)

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Práctica', href: '/practice' },
            { label: topicName },
          ]}
        />
      </div>

      {/* Header con modo de práctica */}
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/practice/${topicId}/history`}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Historial
              </Link>
            </Button>
            <Select value={practiceMode} onValueChange={handleModeChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mixed">
                  <span className="flex items-center gap-2">
                    <span>🎯</span>
                    <span>Mixto</span>
                  </span>
                </SelectItem>
                <SelectItem value="easy">
                  <span className="flex items-center gap-2">
                    <span>🟢</span>
                    <span>Fácil</span>
                  </span>
                </SelectItem>
                <SelectItem value="medium">
                  <span className="flex items-center gap-2">
                    <span>🟡</span>
                    <span>Medio</span>
                  </span>
                </SelectItem>
                <SelectItem value="hard">
                  <span className="flex items-center gap-2">
                    <span>🔴</span>
                    <span>Difícil</span>
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Información del tema y modo */}
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  {topicInfo && <SubjectIcon codigo={topicInfo.subjectCode} size={20} />}
                  <CardTitle className="text-xl">{topicName}</CardTitle>
                  <Badge variant={difficultyInfo.variant} className="text-xs">
                    {difficultyInfo.label}
                  </Badge>
                </div>
                <CardDescription>
                  {topicInfo?.subjectName} • {currentQ.topic.ejeTematico}
                </CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {modeInfo.icon} {modeInfo.label}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
                {isAnswered && (
                  <Badge variant={isCorrect ? 'default' : 'destructive'}>
                    {isCorrect ? 'Correcta' : 'Incorrecta'}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                {stats.total > 0 && (
                  <>
                    <span className="text-muted-foreground">
                      {stats.correct} / {stats.total} correctas
                    </span>
                    <Badge variant="secondary">{getScore()}%</Badge>
                    {stats.streak > 0 && (
                      <Badge variant="default" className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        Racha: {stats.streak}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </div>
            <Progress value={getProgress()} className="h-2" />
          </CardContent>
        </Card>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">Pregunta {currentQuestion + 1}</CardTitle>
              <Badge variant="outline" className="text-xs">
                Dificultad: {difficultyInfo.label}
              </Badge>
              <BookmarkButton questionId={currentQ.id} size="sm" />
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
            <HelpIcon
              content="Selecciona una respuesta para recibir feedback inmediato. Puedes navegar entre preguntas con los botones de abajo. El modo de práctica te permite estudiar sin presión de tiempo."
              side="right"
            />
          </div>
          <CardDescription>
            {currentQ.subject.nombre} • {currentQ.topic.ejeTematico}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">{currentQ.enunciado}</p>

          <div className="space-y-2">
            {currentQ.options.map(option => {
              const isSelected = currentAnswer?.optionSelectedId === option.id
              const showCorrect = showExplanation && option.esCorrecta
              const showIncorrect = showExplanation && isSelected && !option.esCorrecta
              const optionButtonVariantClassName = getOptionButtonVariantClassName({
                isSelected,
                showCorrect,
                showIncorrect,
              })
              const optionLetterBubbleClassName = getOptionLetterBubbleClassName({
                isSelected,
                showCorrect,
                showIncorrect,
              })

              let optionLetterContent: JSX.Element | string = option.letra
              if (showCorrect) {
                optionLetterContent = <CheckCircle2 className="h-5 w-5" />
              } else if (showIncorrect) {
                optionLetterContent = <XCircle className="h-5 w-5" />
              }

              return (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelect(option.id)}
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
                  ? getCorrectExplanationContainerClassName()
                  : getIncorrectExplanationContainerClassName()
              }
            `}
            >
              <div className="flex items-start gap-2">
                {isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-semibold">
                      {isCorrect ? getCorrectFeedbackTitle() : getIncorrectFeedbackTitle()}
                    </p>
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
                  {currentAnswer?.tiempoSegundos && (
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Tiempo: {currentAnswer.tiempoSegundos}s
                    </p>
                  )}
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
          {stats.total > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {getScore()}%
            </Badge>
          )}
          {stats.bestStreak > 0 && (
            <Badge variant="default" className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              Mejor racha: {stats.bestStreak}
            </Badge>
          )}
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
