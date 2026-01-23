'use client'

import { useEffect, useState, useCallback } from 'react'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Share2, Eye, Clock, MessageSquare, Trash2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { BackButton } from '@/components/navigation/back-button'
import { Pagination } from '@/components/ui/pagination'
import Link from 'next/link'
// Función simple para formatear fechas relativas
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'hace unos momentos'
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  if (diffDays < 7) return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })
}

interface SharedFlashcard {
  id: string
  flashcardId: string
  message: string | null
  viewed: boolean
  viewedAt: string | null
  createdAt: string
  flashcard: {
    id: string
    front: string
    back: string
    difficulty: number
    reviewCount: number
    nextReview: string
    question?: {
      id: string
      enunciado: string
      subject: {
        id: string
        nombre: string
        codigo: string
      }
      topic: {
        id: string
        nombre: string
      } | null
    } | null
  }
  sharedBy?: {
    id: string
    nombre: string
    user: {
      email: string | null
    }
  }
  sharedWith?: {
    id: string
    nombre: string
    user: {
      email: string | null
    }
  }
}

export default function SharedFlashcardsPage() {
  const [receivedFlashcards, setReceivedFlashcards] = useState<SharedFlashcard[]>([])
  const [sentFlashcards, setSentFlashcards] = useState<SharedFlashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')
  const [receivedPage, setReceivedPage] = useState(1)
  const [sentPage, setSentPage] = useState(1)
  const [receivedPagination, setReceivedPagination] = useState<{
    total: number
    limit: number
    offset: number
    hasMore: boolean
  } | null>(null)
  const [sentPagination, setSentPagination] = useState<{
    total: number
    limit: number
    offset: number
    hasMore: boolean
  } | null>(null)
  const itemsPerPage = 20

  const loadSharedFlashcards = useCallback(async () => {
    try {
      setLoading(true)

      const receivedOffset = (receivedPage - 1) * itemsPerPage
      const sentOffset = (sentPage - 1) * itemsPerPage

      const [receivedRes, sentRes] = await Promise.all([
        fetch(
          `/api/shared-flashcards?type=received&limit=${itemsPerPage}&offset=${receivedOffset}`
        ),
        fetch(`/api/shared-flashcards?type=sent&limit=${itemsPerPage}&offset=${sentOffset}`),
      ])

      if (!receivedRes.ok || !sentRes.ok) {
        throw new Error('Error al cargar flashcards compartidas')
      }

      const receivedData = await receivedRes.json()
      const sentData = await sentRes.json()

      setReceivedFlashcards(receivedData.sharedFlashcards || [])
      setSentFlashcards(sentData.sharedFlashcards || [])
      setReceivedPagination(receivedData.pagination || null)
      setSentPagination(sentData.pagination || null)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al cargar flashcards compartidas'
      )
    } finally {
      setLoading(false)
    }
  }, [receivedPage, sentPage, itemsPerPage])

  useEffect(() => {
    loadSharedFlashcards()
  }, [activeTab, receivedPage, sentPage, loadSharedFlashcards])

  async function markAsViewed(sharedFlashcardId: string) {
    try {
      const res = await fetch(`/api/shared-flashcards/${sharedFlashcardId}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Error al marcar como vista')
      }

      // Actualizar estado local
      setReceivedFlashcards(prev =>
        prev.map(flashcard =>
          flashcard.id === sharedFlashcardId
            ? { ...flashcard, viewed: true, viewedAt: safeToISOString(new Date()) }
            : flashcard
        )
      )

      toast.success('Marcada como vista')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al marcar como vista')
    }
  }

  async function deleteShared(sharedFlashcardId: string) {
    try {
      const res = await fetch(`/api/shared-flashcards/${sharedFlashcardId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Error al eliminar')
      }

      // Actualizar estado local
      setSentFlashcards(prev => prev.filter(f => f.id !== sharedFlashcardId))
      toast.success('Flashcard compartida eliminada')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al eliminar')
    }
  }

  const formatDate = formatRelativeTime

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Flashcards Compartidas</h1>
          <p className="text-muted-foreground mt-2">
            Flashcards que has compartido o que te han compartido
          </p>
        </div>
        <BackButton />
      </div>

      <Tabs
        value={activeTab}
        onValueChange={v => {
          setActiveTab(v as 'received' | 'sent')
          // Resetear páginas al cambiar de tab
          setReceivedPage(1)
          setSentPage(1)
        }}
      >
        <TabsList>
          <TabsTrigger value="received">
            Recibidas ({receivedPagination?.total || receivedFlashcards.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Enviadas ({sentPagination?.total || sentFlashcards.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedFlashcards.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No has recibido ninguna flashcard compartida aún.
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedFlashcards.map(sharedFlashcard => (
              <Card
                key={sharedFlashcard.id}
                className={!sharedFlashcard.viewed ? 'border-primary' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Flashcard
                        {!sharedFlashcard.viewed && (
                          <Badge variant="default" className="ml-2">
                            Nueva
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartida por {sharedFlashcard.sharedBy?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedFlashcard.createdAt)}
                      </CardDescription>
                    </div>
                    {sharedFlashcard.flashcard.question?.subject && (
                      <Badge variant="outline">
                        {sharedFlashcard.flashcard.question.subject.codigo}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedFlashcard.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{sharedFlashcard.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg border">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Anverso</div>
                      <p className="text-sm">{sharedFlashcard.flashcard.front}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Reverso</div>
                      <p className="text-sm">{sharedFlashcard.flashcard.back}</p>
                    </div>
                  </div>

                  {sharedFlashcard.flashcard.question && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                        Pregunta relacionada:
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {sharedFlashcard.flashcard.question.enunciado.substring(0, 150)}
                        {sharedFlashcard.flashcard.question.enunciado.length > 150 ? '...' : ''}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>
                          {sharedFlashcard.flashcard.reviewCount} repaso
                          {sharedFlashcard.flashcard.reviewCount !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!sharedFlashcard.viewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsViewed(sharedFlashcard.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Marcar como vista
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/flashcards">Ver todas las flashcards</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Paginación para recibidas */}
          {receivedPagination && receivedPagination.total > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={receivedPage}
                totalPages={Math.ceil(receivedPagination.total / itemsPerPage)}
                onPageChange={page => {
                  setReceivedPage(page)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentFlashcards.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No has compartido ninguna flashcard aún.
                </p>
              </CardContent>
            </Card>
          ) : (
            sentFlashcards.map(sharedFlashcard => (
              <Card key={sharedFlashcard.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Flashcard
                        {sharedFlashcard.viewed && (
                          <Badge variant="secondary" className="ml-2">
                            <Eye className="h-3 w-3 mr-1" />
                            Vista
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartida con {sharedFlashcard.sharedWith?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedFlashcard.createdAt)}
                      </CardDescription>
                    </div>
                    {sharedFlashcard.flashcard.question?.subject && (
                      <Badge variant="outline">
                        {sharedFlashcard.flashcard.question.subject.codigo}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedFlashcard.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{sharedFlashcard.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="p-4 bg-muted rounded-lg border">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Anverso</div>
                      <p className="text-sm">{sharedFlashcard.flashcard.front}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg border">
                      <div className="text-xs font-medium text-muted-foreground mb-1">Reverso</div>
                      <p className="text-sm">{sharedFlashcard.flashcard.back}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteShared(sharedFlashcard.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Eliminar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {/* Paginación para enviadas */}
          {sentPagination && sentPagination.total > itemsPerPage && (
            <div className="mt-6">
              <Pagination
                currentPage={sentPage}
                totalPages={Math.ceil(sentPagination.total / itemsPerPage)}
                onPageChange={page => {
                  setSentPage(page)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

