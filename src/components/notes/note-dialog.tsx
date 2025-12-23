'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface NoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  questionId?: string
  topicId?: string
  defaultTitle?: string
  defaultContent?: string
  noteId?: string
  onSuccess?: () => void
}

export function NoteDialog({
  open,
  onOpenChange,
  questionId,
  topicId,
  defaultTitle = '',
  defaultContent = '',
  noteId,
  onSuccess,
}: NoteDialogProps) {
  const [title, setTitle] = useState(defaultTitle)
  const [content, setContent] = useState(defaultContent)
  const [tags, setTags] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle)
      setContent(defaultContent)
      setTags('')
    }
  }, [open, defaultTitle, defaultContent])

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Por favor completa título y contenido')
      return
    }

    setIsLoading(true)
    try {
      if (noteId) {
        // Actualizar nota existente
        const res = await fetch(`/api/notes?noteId=${noteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title.trim(),
            content: content.trim(),
            tags: tags.trim() || undefined,
          }),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Error al actualizar nota')
        }

        toast.success('Nota actualizada correctamente')
      } else {
        // Crear nueva nota
        const res = await fetch('/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: questionId || undefined,
            topicId: topicId || undefined,
            title: title.trim(),
            content: content.trim(),
            tags: tags.trim() || undefined,
          }),
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}))
          throw new Error(errorData.error || 'Error al crear nota')
        }

        toast.success('Nota creada correctamente')
      }

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error('Error', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{noteId ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>
          <DialogDescription>
            {noteId
              ? 'Modifica tu nota de estudio'
              : 'Crea una nota personal para recordar conceptos importantes'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ej: Fórmula importante de matemáticas"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escribe tus apuntes aquí..."
              rows={8}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (separados por comas)</Label>
            <Input
              id="tags"
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Ej: matemáticas, fórmulas, importante"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {noteId ? 'Actualizando...' : 'Creando...'}
              </>
            ) : noteId ? (
              'Actualizar'
            ) : (
              'Crear'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
