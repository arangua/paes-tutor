'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, RotateCcw, ArrowLeft, CheckCircle2, XCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: number
  reviewCount: number
  nextReview: string
  question?: {
    subject: {
      nombre: string
    }
  } | null
}

export default function StudyFlashcardPage() {
  const params = useParams()
  const router = useRouter()
  const flashcardId = params.id as string

  const [flashcard, setFlashcard] = useState<Flashcard | null>(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    loadFlashcard()
  }, [flashcardId])

  async function loadFlashcard() {
    try {
      setLoading(true)
      const res = await fetch('/api/flashcards')
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al cargar flashcard')
      }
      const data = await res.json()
      const found = data.flashcards?.find((f: Flashcard) => f.id === flashcardId)
      if (!found) {
        throw new Error('Flashcard no encontrada')
      }
      setFlashcard(found)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      setError(errorMessage)
      toast.error('Error al cargar flashcard', {
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleReview = async (
    isCorrect: boolean,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium'
  ) => {
    if (!flashcard || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          flashcardId: flashcard.id,
          isCorrect,
          difficulty,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al guardar repaso')
      }

      toast.success(isCorrect ? '¡Correcto! Continuemos' : 'No te preocupes, seguimos practicando')

      // Volver a la lista o cargar siguiente
      router.push('/flashcards')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
      toast.error('Error al guardar repaso', {
        description: errorMessage,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error || !flashcard) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <p className="text-destructive mb-4">{error || 'Flashcard no encontrada'}</p>
            <Button onClick={() => router.push('/flashcards')}>Volver a Flashcards</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.push('/flashcards')} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
        {flashcard.question && (
          <Badge variant="outline" className="mb-2">
            {flashcard.question.subject.nombre}
          </Badge>
        )}
      </div>

      <Card
        className={`
          min-h-[400px] cursor-pointer transition-all
          ${isFlipped ? 'bg-primary/5' : ''}
        `}
        onClick={() => setIsFlipped(!isFlipped)}
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
                <p className="text-2xl font-semibold leading-relaxed">{flashcard.front}</p>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2 mb-4">
                  <EyeOff className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Reverso - Haz clic para voltear
                  </span>
                </div>
                <p className="text-xl leading-relaxed text-muted-foreground">{flashcard.back}</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {isFlipped && (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-medium text-center mb-4">¿Qué tan bien recordaste esto?</p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="destructive"
              onClick={() => handleReview(false, 'hard')}
              disabled={isSubmitting}
              className="flex flex-col h-auto py-4"
            >
              <XCircle className="h-5 w-5 mb-1" />
              <span className="text-xs">Difícil</span>
            </Button>
            <Button
              variant="secondary"
              onClick={() => handleReview(true, 'medium')}
              disabled={isSubmitting}
              className="flex flex-col h-auto py-4"
            >
              <RotateCcw className="h-5 w-5 mb-1" />
              <span className="text-xs">Bien</span>
            </Button>
            <Button
              variant="default"
              onClick={() => handleReview(true, 'easy')}
              disabled={isSubmitting}
              className="flex flex-col h-auto py-4"
            >
              <CheckCircle2 className="h-5 w-5 mb-1" />
              <span className="text-xs">Fácil</span>
            </Button>
          </div>
        </div>
      )}

      {!isFlipped && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setIsFlipped(true)} className="w-full">
            Mostrar Respuesta
          </Button>
        </div>
      )}
    </div>
  )
}
