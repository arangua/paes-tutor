'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FileText, Plus, Search, Edit, Trash2, BookOpen, Tag, History } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { NoteDialog } from '@/components/notes/note-dialog'
import { NoteVersions } from '@/components/notes/note-versions'
import { ShareNoteButton } from '@/components/notes/share-note-button'
import { HelpIcon } from '@/components/help/help-icon'

interface StudyNote {
  id: string
  title: string
  content: string
  tags: string | null
  createdAt: string
  updatedAt: string
  question?: {
    id: string
    enunciado: string
    subject: {
      nombre: string
      codigo: string
    }
    topic: {
      nombre: string
    } | null
  } | null
  topic?: {
    id: string
    nombre: string
    subject: {
      nombre: string
      codigo: string
    }
  } | null
}

export default function NotesPage() {
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [filteredNotes, setFilteredNotes] = useState<StudyNote[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'all' | 'questions' | 'topics'>('all')
  const [editingNote, setEditingNote] = useState<StudyNote | null>(null)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [versionsNoteId, setVersionsNoteId] = useState<string | null>(null)

  useEffect(() => {
    loadNotes()
  }, [])

  const filterNotes = useCallback(() => {
    let filtered = [...notes]

    // Filtrar por tipo
    if (activeTab === 'questions') {
      filtered = filtered.filter(n => n.question !== null)
    } else if (activeTab === 'topics') {
      filtered = filtered.filter(n => n.topic !== null)
    }

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query) ||
          n.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }

    setFilteredNotes(filtered)
  }, [notes, searchQuery, activeTab])

  useEffect(() => {
    filterNotes()
  }, [notes, searchQuery, activeTab, filterNotes])

  async function loadNotes() {
    try {
      setLoading(true)
      const res = await fetch('/api/notes')
      if (!res.ok) throw new Error('Error al cargar notas')
      const data = await res.json()
      setNotes(data.notes || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar notas')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (noteId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta nota?')) return

    try {
      const res = await fetch(`/api/notes?noteId=${noteId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error al eliminar nota')

      toast.success('Nota eliminada')
      loadNotes()
    } catch {
      toast.error('Error al eliminar nota')
    }
  }

  const getTags = (tagsString: string | null) => {
    if (!tagsString) return []
    return tagsString
      .split(',')
      .map(t => t.trim())
      .filter(Boolean)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="space-y-2">
          <Skeleton className="h-10 w-64" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Skeleton className="h-6 w-3/4" />
                  <div className="flex gap-1">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-16 w-full" />
                <div className="flex gap-1">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-3 w-24" />
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
            <FileText className="h-8 w-8" />
            Mis Notas
          </h1>
          <p className="text-muted-foreground mt-2">Organiza tus apuntes y conceptos importantes</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Nota
          </Button>
          <HelpIcon content="Crea notas personales sobre preguntas o temas para recordar conceptos importantes. Puedes buscar y filtrar tus notas fácilmente." />
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar en notas..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs
        value={activeTab}
        onValueChange={v => setActiveTab(v as 'all' | 'questions' | 'topics')}
      >
        <TabsList>
          <TabsTrigger value="all">Todas ({notes.length})</TabsTrigger>
          <TabsTrigger value="questions">
            Sobre Preguntas ({notes.filter(n => n.question).length})
          </TabsTrigger>
          <TabsTrigger value="topics">
            Sobre Temas ({notes.filter(n => n.topic).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredNotes.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-lg font-semibold mb-2">
                  {searchQuery ? 'No se encontraron notas' : 'No tienes notas aún'}
                </p>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Crea tu primera nota para comenzar a organizar tus apuntes'}
                </p>
                {!searchQuery && (
                  <Button onClick={() => setCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Nota
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNotes.map(note => {
                const tags = getTags(note.tags)
                return (
                  <Card key={note.id} className="hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg line-clamp-2 flex-1">{note.title}</CardTitle>
                        <div className="flex items-center gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setVersionsNoteId(note.id)}
                            title="Ver versiones"
                          >
                            <History className="h-3 w-3" />
                          </Button>
                          <ShareNoteButton noteId={note.id} noteTitle={note.title} />
                          <Button variant="ghost" size="sm" onClick={() => setEditingNote(note)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(note.id)}>
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      {(note.question || note.topic) && (
                        <CardDescription>
                          {note.question ? (
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              <span>{note.question.subject.nombre}</span>
                              {note.question.topic && <span>• {note.question.topic.nombre}</span>}
                            </div>
                          ) : note.topic ? (
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-3 w-3" />
                              <span>
                                {note.topic.subject.nombre} • {note.topic.nombre}
                              </span>
                            </div>
                          ) : null}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-4">{note.content}</p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {tags.map((tag, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              <Tag className="h-2 w-2 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Actualizada: {new Date(note.updatedAt).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Dialog */}
      <NoteDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={loadNotes}
      />

      {/* Edit Dialog */}
      {editingNote && (
        <NoteDialog
          open={!!editingNote}
          onOpenChange={open => !open && setEditingNote(null)}
          noteId={editingNote.id}
          questionId={editingNote.question?.id}
          topicId={editingNote.topic?.id}
          defaultTitle={editingNote.title}
          defaultContent={editingNote.content}
          onSuccess={() => {
            setEditingNote(null)
            loadNotes()
          }}
        />
      )}

      {/* Versions Dialog */}
      {versionsNoteId && (
        <NoteVersions
          noteId={versionsNoteId}
          open={!!versionsNoteId}
          onOpenChange={open => !open && setVersionsNoteId(null)}
          onRestore={() => {
            setVersionsNoteId(null)
            loadNotes()
          }}
        />
      )}
    </div>
  )
}
