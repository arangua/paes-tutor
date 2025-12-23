'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, BookOpen, RotateCcw, Trash2, Plus, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { CreateFlashcardButton } from '@/components/flashcards/create-flashcard-button'
import { HelpIcon } from '@/components/help/help-icon'
import { Skeleton } from '@/components/ui/skeleton'

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
    }
    topic: {
      nombre: string
    } | null
  } | null
}

export default function FlashcardsPage() {
  const router = useRouter()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'due'>('all')

  useEffect(() => {
    loadFlashcards()
  }, [activeTab])

  async function loadFlashcards() {
    try {
      setLoading(true)
      const res = await fetch(`/api/flashcards?dueOnly=${activeTab === 'due'}`)
      if (!res.ok) throw new Error('Error al cargar flashcards')
      const data = await res.json()
      setFlashcards(data.flashcards || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar flashcards')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (flashcardId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta flashcard?')) return

    try {
      const res = await fetch(`/api/flashcards?flashcardId=${flashcardId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error al eliminar flashcard')

      toast.success('Flashcard eliminada')
      loadFlashcards()
    } catch (err) {
      toast.error('Error al eliminar flashcard')
    }
  }

  // Memoizar conteo de flashcards vencidas
  const dueCount = useMemo(() => {
    const now = new Date()
    return flashcards.filter(f => new Date(f.nextReview) <= now).length
  }, [flashcards])

  // Memoizar función para verificar si una flashcard está vencida
  const isDue = useMemo(() => {
    const now = new Date()
    return (nextReview: string) => new Date(nextReview) <= now
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4" />
                  </div>
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Flashcards
          </h1>
          <p className="text-muted-foreground mt-2">
            Estudia con tarjetas de memoria usando repaso espaciado
          </p>
        </div>
        <div className="flex items-center gap-2">
          <CreateFlashcardButton />
          <HelpIcon content="Las flashcards usan el algoritmo SM-2 para optimizar tu aprendizaje. Repasa las tarjetas pendientes regularmente para mejorar la retención." />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'all' | 'due')}>
        <TabsList>
          <TabsTrigger value="all">Todas ({flashcards.length})</TabsTrigger>
          <TabsTrigger value="due">Pendientes ({dueCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {flashcards.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">No tienes flashcards aún</p>
                <p className="text-muted-foreground mb-4">
                  Crea tu primera flashcard para comenzar a estudiar
                </p>
                <CreateFlashcardButton variant="default" />
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.map(flashcard => (
                <Card
                  key={flashcard.id}
                  className={`
                    hover:border-primary transition-colors cursor-pointer
                    ${isDue(flashcard.nextReview) ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20' : ''}
                  `}
                  onClick={() => router.push(`/flashcards/${flashcard.id}/study`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base line-clamp-2">{flashcard.front}</CardTitle>
                      {isDue(flashcard.nextReview) && (
                        <Badge variant="destructive" className="ml-2">
                          Pendiente
                        </Badge>
                      )}
                    </div>
                    {flashcard.question && (
                      <CardDescription className="text-xs">
                        {flashcard.question.subject.nombre}
                        {flashcard.question.topic && ` • ${flashcard.question.topic.nombre}`}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Repasos: {flashcard.reviewCount}</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(flashcard.nextReview).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={e => {
                            e.stopPropagation()
                            router.push(`/flashcards/${flashcard.id}/study`)
                          }}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Estudiar
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={e => {
                            e.stopPropagation()
                            handleDelete(flashcard.id)
                          }}
                        >
                          <Trash2 className="h-3 w-3 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
