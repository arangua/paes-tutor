'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  TrendingUp,
  Award,
  Clock,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { cn } from '@/lib/utils'
import { safeRound } from '@/app/api/notes/versions/validation-utils'

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: number
  reviewCount: number
  nextReview: string
  lastReview: string
  question?: {
    subject: {
      nombre: string
      codigo: string
    }
    topic: {
      nombre: string
    } | null
  } | null
}

interface StudySession {
  flashcards: Flashcard[]
  currentIndex: number
  reviewed: number
  correct: number
  incorrect: number
  startTime: number
}

export default function StudyFlashcardsPage() {
  const router = useRouter()
  const [session, setSession] = useState<StudySession | null>(null)
  const [currentFlashcard, setCurrentFlashcard] = useState<Flashcard | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showStats, setShowStats] = useState(false)

  useEffect(() => {
    loadFlashcards()
  }, [])

  async function loadFlashcards() {
    try {
      setLoading(true)
      const res = await fetch('/api/flashcards?dueOnly=true&limit=50')
      if (!res.ok) throw new Error('Error al cargar flashcards')
      const data = await res.json()

      if (!data.flashcards || data.flashcards.length === 0) {
        setError('No hay flashcards pendientes de repaso')
        return
      }

      const flashcards = data.flashcards
      const newSession: StudySession = {
        flashcards,
        currentIndex: 0,
        reviewed: 0,
        correct: 0,
        incorrect: 0,
        startTime: Date.now(),
      }

      setSession(newSession)
      setCurrentFlashcard(flashcards[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar flashcards')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = useCallback(
    async (isCorrect: boolean, difficulty: 'easy' | 'medium' | 'hard' = 'medium') => {
      if (!session || !currentFlashcard || isSubmitting) return

      setIsSubmitting(true)
      try {
        const res = await fetch('/api/flashcards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            flashcardId: currentFlashcard.id,
            isCorrect,
            difficulty,
          }),
        })

        if (!res.ok) {
          throw new Error('Error al guardar repaso')
        }

        // Actualizar sesión
        const newSession = {
          ...session,
          reviewed: session.reviewed + 1,
          correct: isCorrect ? session.correct + 1 : session.correct,
          incorrect: !isCorrect ? session.incorrect + 1 : session.incorrect,
        }

        // Avanzar a la siguiente flashcard
        const nextIndex = session.currentIndex + 1

        if (nextIndex >= session.flashcards.length) {
          // Sesión completada
          setShowStats(true)
          setSession(newSession)
          toast.success('¡Sesión completada!', {
            description: `Repasaste ${newSession.reviewed} flashcards`,
          })
        } else {
          setSession({
            ...newSession,
            currentIndex: nextIndex,
          })
          setCurrentFlashcard(session.flashcards[nextIndex])
          setIsFlipped(false)
        }
      } catch {
        toast.error('Error al guardar repaso')
      } finally {
        setIsSubmitting(false)
      }
    },
    [session, currentFlashcard, isSubmitting]
  )

  const getProgress = () => {
    if (!session) return 0
    return (session.reviewed / session.flashcards.length) * 100
  }

  const getAccuracy = () => {
    if (!session || session.reviewed === 0) return 0
    return safeRound((session.correct / session.reviewed) * 100, 0)
  }

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000)
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando flashcards...
            </p>
            <p className="text-sm text-muted-foreground">Preparando tu sesión de estudio</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !session || !currentFlashcard) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Flashcards', href: '/flashcards' },
            { label: 'Estudiar' },
          ]}
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              No hay flashcards pendientes
            </CardTitle>
            <CardDescription>{error || 'No hay flashcards para estudiar'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error ||
                'No tienes flashcards pendientes de repaso. Crea nuevas flashcards o espera hasta que sea momento de repasar las existentes.'}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => router.push('/flashcards')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Flashcards
              </Button>
              <Button onClick={loadFlashcards}>Reintentar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showStats) {
    const elapsedTime = Date.now() - session.startTime
    const accuracy = getAccuracy()

    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Flashcards', href: '/flashcards' },
            { label: 'Resultados' },
          ]}
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-600" />
              Sesión Completada
            </CardTitle>
            <CardDescription>
              ¡Excelente trabajo! Has completado tu sesión de estudio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Flashcards Repasadas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{session.reviewed}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    de {session.flashcards.length} total
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Precisión</CardDescription>
                </CardHeader>
                <CardContent>
                  <div
                    className={`text-3xl font-bold ${accuracy >= 70 ? 'text-green-600' : accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}
                  >
                    {accuracy}%
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {session.correct} correctas / {session.incorrect} incorrectas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardDescription>Tiempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{formatTime(elapsedTime)}</div>
                  <p className="text-xs text-muted-foreground mt-1">Tiempo total de estudio</p>
                </CardContent>
              </Card>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => router.push('/flashcards')} className="flex-1">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver a Flashcards
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowStats(false)
                  loadFlashcards()
                }}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Estudiar Más
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Flashcards', href: '/flashcards' },
            { label: 'Estudiar' },
          ]}
        />
      </div>

      {/* Header con progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.push('/flashcards')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              {getAccuracy()}% precisión
            </Badge>
            <Badge variant="outline">
              {session.currentIndex + 1} / {session.flashcards.length}
            </Badge>
          </div>
        </div>
        <Progress value={getProgress()} className="h-2" />
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <span>{session.reviewed} repasadas</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTime(Date.now() - session.startTime)}
          </span>
        </div>
      </div>

      {/* Flashcard */}
      <Card
        className={cn(
          'min-h-[400px] cursor-pointer transition-all hover:shadow-lg',
          isFlipped && 'bg-primary/5 border-primary/20'
        )}
        onClick={() => !isSubmitting && setIsFlipped(!isFlipped)}
      >
        <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4 w-full">
            {!isFlipped ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Eye className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Anverso - Haz clic para voltear
                  </span>
                </div>
                {currentFlashcard.question && (
                  <Badge variant="outline" className="mb-4">
                    {currentFlashcard.question.subject.nombre}
                    {currentFlashcard.question.topic &&
                      ` • ${currentFlashcard.question.topic.nombre}`}
                  </Badge>
                )}
                <p className="text-2xl font-semibold leading-relaxed">{currentFlashcard.front}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Reverso - Haz clic para voltear
                  </span>
                </div>
                <p className="text-xl leading-relaxed text-muted-foreground">
                  {currentFlashcard.back}
                </p>
                <div className="mt-4 text-xs text-muted-foreground">
                  Repasos anteriores: {currentFlashcard.reviewCount}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Botones de acción */}
      {isFlipped && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-center mb-4">¿Qué tan bien recordaste esto?</p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="destructive"
              onClick={() => handleReview(false, 'hard')}
              disabled={isSubmitting}
              className="flex flex-col h-auto py-6"
            >
              <XCircle className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold">Difícil</span>
              <span className="text-xs opacity-75">No recordé</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReview(true, 'medium')}
              disabled={isSubmitting}
              className="flex flex-col h-auto py-6"
            >
              <RotateCcw className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold">Bien</span>
              <span className="text-xs opacity-75">Con esfuerzo</span>
            </Button>
            <Button
              variant="default"
              onClick={() => handleReview(true, 'easy')}
              disabled={isSubmitting}
              className="flex flex-col h-auto py-6"
            >
              <CheckCircle2 className="h-6 w-6 mb-2" />
              <span className="text-sm font-semibold">Fácil</span>
              <span className="text-xs opacity-75">Perfecto</span>
            </Button>
          </div>
        </div>
      )}

      {!isFlipped && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setIsFlipped(true)} className="w-full" size="lg">
            Mostrar Respuesta
            <EyeOff className="h-4 w-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
