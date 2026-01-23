'use client'

import { useEffect, useState, useCallback } from 'react'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Share2, Eye, Clock, MessageSquare, Trash2, FileText } from 'lucide-react'
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

interface SharedNote {
  id: string
  noteId: string
  message: string | null
  viewed: boolean
  viewedAt: string | null
  createdAt: string
  note: {
    id: string
    title: string
    content: string
    tags: string | null
    createdAt: string
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
    topic?: {
      id: string
      nombre: string
      subject: {
        id: string
        nombre: string
        codigo: string
      }
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

export default function SharedNotesPage() {
  const [receivedNotes, setReceivedNotes] = useState<SharedNote[]>([])
  const [sentNotes, setSentNotes] = useState<SharedNote[]>([])
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

  const loadSharedNotes = useCallback(async () => {
    try {
      setLoading(true)

      const receivedOffset = (receivedPage - 1) * itemsPerPage
      const sentOffset = (sentPage - 1) * itemsPerPage

      const [receivedRes, sentRes] = await Promise.all([
        fetch(`/api/shared-notes?type=received&limit=${itemsPerPage}&offset=${receivedOffset}`),
        fetch(`/api/shared-notes?type=sent&limit=${itemsPerPage}&offset=${sentOffset}`),
      ])

      if (!receivedRes.ok || !sentRes.ok) {
        throw new Error('Error al cargar notas compartidas')
      }

      const receivedData = await receivedRes.json()
      const sentData = await sentRes.json()

      setReceivedNotes(receivedData.sharedNotes || [])
      setSentNotes(sentData.sharedNotes || [])
      setReceivedPagination(receivedData.pagination || null)
      setSentPagination(sentData.pagination || null)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar notas compartidas')
    } finally {
      setLoading(false)
    }
  }, [receivedPage, sentPage, itemsPerPage])

  useEffect(() => {
    loadSharedNotes()
  }, [activeTab, receivedPage, sentPage, loadSharedNotes])

  async function markAsViewed(sharedNoteId: string) {
    try {
      const res = await fetch(`/api/shared-notes/${sharedNoteId}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Error al marcar como vista')
      }

      // Actualizar estado local
      setReceivedNotes(prev =>
        prev.map(note =>
          note.id === sharedNoteId
            ? { ...note, viewed: true, viewedAt: safeToISOString(new Date()) }
            : note
        )
      )

      toast.success('Marcada como vista')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al marcar como vista')
    }
  }

  async function deleteShared(sharedNoteId: string) {
    try {
      const res = await fetch(`/api/shared-notes/${sharedNoteId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Error al eliminar')
      }

      // Actualizar estado local
      setSentNotes(prev => prev.filter(n => n.id !== sharedNoteId))
      toast.success('Nota compartida eliminada')
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
          <h1 className="text-3xl font-bold">Notas Compartidas</h1>
          <p className="text-muted-foreground mt-2">
            Notas que has compartido o que te han compartido
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
            Recibidas ({receivedPagination?.total || receivedNotes.length})
          </TabsTrigger>
          <TabsTrigger value="sent">
            Enviadas ({sentPagination?.total || sentNotes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedNotes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No has recibido ninguna nota compartida aún.</p>
              </CardContent>
            </Card>
          ) : (
            receivedNotes.map(sharedNote => (
              <Card
                key={sharedNote.id}
                className={!sharedNote.viewed ? 'border-primary' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {sharedNote.note.title}
                        {!sharedNote.viewed && (
                          <Badge variant="default" className="ml-2">
                            Nueva
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartida por {sharedNote.sharedBy?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedNote.createdAt)}
                      </CardDescription>
                    </div>
                    {(sharedNote.note.question?.subject || sharedNote.note.topic?.subject) && (
                      <Badge variant="outline">
                        {sharedNote.note.question?.subject?.codigo ||
                          sharedNote.note.topic?.subject?.codigo}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedNote.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{sharedNote.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg border">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Contenido</div>
                    <p className="text-sm whitespace-pre-wrap">{sharedNote.note.content}</p>
                  </div>

                  {sharedNote.note.tags && (
                    <div className="flex flex-wrap gap-2">
                      {sharedNote.note.tags.split(',').map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {(sharedNote.note.question || sharedNote.note.topic) && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-1">
                        {sharedNote.note.question ? 'Pregunta relacionada:' : 'Tema relacionado:'}
                      </p>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {sharedNote.note.question
                          ? sharedNote.note.question.enunciado.substring(0, 150) +
                            (sharedNote.note.question.enunciado.length > 150 ? '...' : '')
                          : sharedNote.note.topic?.nombre}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Creada {formatDate(sharedNote.note.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!sharedNote.viewed && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsViewed(sharedNote.id)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Marcar como vista
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/notes">Ver todas las notas</Link>
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
          {sentNotes.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No has compartido ninguna nota aún.</p>
              </CardContent>
            </Card>
          ) : (
            sentNotes.map(sharedNote => (
              <Card key={sharedNote.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {sharedNote.note.title}
                        {sharedNote.viewed && (
                          <Badge variant="secondary" className="ml-2">
                            <Eye className="h-3 w-3 mr-1" />
                            Vista
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartida con {sharedNote.sharedWith?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedNote.createdAt)}
                      </CardDescription>
                    </div>
                    {(sharedNote.note.question?.subject || sharedNote.note.topic?.subject) && (
                      <Badge variant="outline">
                        {sharedNote.note.question?.subject?.codigo ||
                          sharedNote.note.topic?.subject?.codigo}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedNote.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-muted-foreground">{sharedNote.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="p-4 bg-muted rounded-lg border">
                    <div className="text-xs font-medium text-muted-foreground mb-2">Contenido</div>
                    <p className="text-sm whitespace-pre-wrap">{sharedNote.note.content}</p>
                  </div>

                  {sharedNote.note.tags && (
                    <div className="flex flex-wrap gap-2">
                      {sharedNote.note.tags.split(',').map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-end pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteShared(sharedNote.id)}
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

