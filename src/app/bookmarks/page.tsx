export const dynamic = 'force-dynamic'
'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Star, BookOpen, Filter, Trash2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { captureError } from '@/lib/monitoring'
import { BookmarkButton } from '@/components/bookmarks/bookmark-button'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'

interface Bookmark {
  id: string
  questionId: string
  notes: string | null
  createdAt: string
  question: {
    id: string
    enunciado: string
    explicacion: string
    dificultad: number
    fuente: string
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
}

export default function BookmarksPage() {
  const router = useRouter()
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterTopic, setFilterTopic] = useState<string>('all')
  const [subjects, setSubjects] = useState<Array<{ id: string; nombre: string; codigo: string }>>(
    []
  )

  // Memoizar filtrado de bookmarks para evitar recálculos innecesarios
  const filteredBookmarks = useMemo(() => {
    let filtered = [...bookmarks]

    if (filterSubject !== 'all') {
      filtered = filtered.filter(b => b.question.subject.codigo === filterSubject)
    }

    if (filterTopic !== 'all' && filterTopic) {
      filtered = filtered.filter(b => b.question.topic?.nombre === filterTopic)
    }

    return filtered
  }, [bookmarks, filterSubject, filterTopic])

  useEffect(() => {
    async function loadBookmarks() {
      try {
        setLoading(true)
        const res = await fetch('/api/bookmarks')
        if (!res.ok) throw new Error('Error al cargar favoritos')
        const data = await res.json()
        setBookmarks(data.bookmarks || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        toast.error('Error al cargar favoritos')
      } finally {
        setLoading(false)
      }
    }

    async function loadSubjects() {
      try {
        const res = await fetch('/api/subjects')
        if (res.ok) {
          const data = await res.json()
          setSubjects(data.subjects || [])
        }
      } catch (err) {
        captureError(err instanceof Error ? err : new Error(String(err)), {
          type: 'bookmarks_load_error',
          action: 'load_subjects',
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        })
      }
    }

    loadBookmarks()
    loadSubjects()
  }, [])

  const handleRemoveBookmark = async (bookmarkId: string, questionId: string) => {
    try {
      const res = await fetch(`/api/bookmarks?questionId=${questionId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
        setFilteredBookmarks(prev => prev.filter(b => b.id !== bookmarkId))
        toast.success('Eliminado de favoritos')
      } else {
        throw new Error('Error al eliminar favorito')
      }
    } catch {
      toast.error('Error al eliminar favorito')
    }
  }

  const getTopicsForSubject = () => {
    if (filterSubject === 'all') return []
    const subjectBookmarks = bookmarks.filter(b => b.question.subject.codigo === filterSubject)
    const topics = new Set(subjectBookmarks.map(b => b.question.topic?.nombre).filter(Boolean))
    return Array.from(topics) as string[]
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-6 w-28" />
                    </div>
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-20 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
            Mis Favoritos
          </h1>
          <p className="text-muted-foreground mt-2">
            {bookmarks.length === 0
              ? 'No tienes preguntas marcadas como favoritas'
              : `${bookmarks.length} pregunta${bookmarks.length !== 1 ? 's' : ''} marcada${bookmarks.length !== 1 ? 's' : ''} como favorita${bookmarks.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <HelpIcon content="Las preguntas marcadas como favoritas aparecerán aquí para que puedas revisarlas fácilmente más tarde." />
      </div>

      {bookmarks.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Asignatura</label>
                <Select value={filterSubject} onValueChange={setFilterSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las asignaturas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las asignaturas</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.codigo}>
                        {subject.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tema</label>
                <Select value={filterTopic} onValueChange={setFilterTopic}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos los temas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los temas</SelectItem>
                    {getTopicsForSubject().map(topic => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredBookmarks.length === 0 && bookmarks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              No hay favoritos que coincidan con los filtros seleccionados
            </p>
          </CardContent>
        </Card>
      )}

      {filteredBookmarks.length === 0 && bookmarks.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-lg font-semibold mb-2">No tienes favoritos aún</p>
            <p className="text-muted-foreground mb-4">
              Marca preguntas como favoritas mientras estudias para revisarlas después
            </p>
            <Button onClick={() => router.push('/exams')}>
              <BookOpen className="h-4 w-4 mr-2" />
              Ir a Exámenes
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredBookmarks.map(bookmark => {
          return (
            <Card key={bookmark.id} className="hover:border-primary transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{bookmark.question.subject.nombre}</Badge>
                      {bookmark.question.topic && (
                        <Badge variant="secondary">{bookmark.question.topic.nombre}</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        Dificultad: {bookmark.question.dificultad}/5
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">{bookmark.question.enunciado}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookmarkButton questionId={bookmark.question.id} />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBookmark(bookmark.id, bookmark.question.id)}
                      title="Eliminar de favoritos"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">Opciones:</p>
                  <div className="space-y-1">
                    {bookmark.question.options.map(option => (
                      <div
                        key={option.id}
                        className={`
                          p-2 rounded text-sm
                          ${
                            option.esCorrecta
                              ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800'
                              : 'bg-muted'
                          }
                        `}
                      >
                        <span className="font-semibold">{option.letra}.</span> {option.texto}
                        {option.esCorrecta && (
                          <Badge variant="default" className="ml-2 bg-green-600">
                            Correcta
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold mb-2">Explicación:</p>
                  <p className="text-sm text-muted-foreground">{bookmark.question.explicacion}</p>
                </div>
                {bookmark.notes && (
                  <div>
                    <p className="text-sm font-semibold mb-2">Mis notas:</p>
                    <p className="text-sm text-muted-foreground italic">{bookmark.notes}</p>
                  </div>
                )}
                <div className="text-xs text-muted-foreground">
                  Fuente: {bookmark.question.fuente} • Agregado:{' '}
                  {new Date(bookmark.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
