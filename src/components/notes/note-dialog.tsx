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
import { useUndoRedo } from '@/hooks/useUndoRedo'
import { UndoRedoToolbar } from '@/components/ui/undo-redo-toolbar'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { captureError } from '@/lib/monitoring'

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
  const [titleError, setTitleError] = useState<string | null>(null)
  const [contentError, setContentError] = useState<string | null>(null)

  // Sistema de undo/redo para el contenido
  const {
    state: noteState,
    setState: setNoteState,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoRedo({ title: defaultTitle, content: defaultContent, tags: '' }, 20)

  // Sincronizar estado con undo/redo
  useEffect(() => {
    setTitle(noteState.title)
    setContent(noteState.content)
    setTags(noteState.tags)
  }, [noteState])

  // Atajos de teclado para undo/redo
  useKeyboardShortcuts([
    {
      key: 'z',
      ctrl: true,
      description: 'Deshacer',
      action: undo,
    },
    {
      key: 'z',
      ctrl: true,
      shift: true,
      description: 'Rehacer',
      action: redo,
    },
  ])

  useEffect(() => {
    if (open) {
      setTitle(defaultTitle)
      setContent(defaultContent)
      setTags('')
      setNoteState({ title: defaultTitle, content: defaultContent, tags: '' })
      setTitleError(null)
      setContentError(null)
    }
  }, [open, defaultTitle, defaultContent, setNoteState])

  // Validación en tiempo real
  const handleTitleChange = (value: string) => {
    setTitle(value)
    setNoteState(prev => ({ ...prev, title: value }))

    // Validar en tiempo real
    if (value.trim().length === 0) {
      setTitleError('El título es requerido')
    } else if (value.trim().length < 3) {
      setTitleError('El título debe tener al menos 3 caracteres')
    } else if (value.length > 100) {
      setTitleError('El título no puede exceder 100 caracteres')
    } else {
      setTitleError(null)
    }
  }

  const handleContentChange = (value: string) => {
    setContent(value)
    setNoteState(prev => ({ ...prev, content: value }))

    // Validar en tiempo real
    if (value.trim().length === 0) {
      setContentError('El contenido es requerido')
    } else if (value.trim().length < 10) {
      setContentError('El contenido debe tener al menos 10 caracteres')
    } else if (value.length > 5000) {
      setContentError('El contenido no puede exceder 5000 caracteres')
    } else {
      setContentError(null)
    }
  }

  const handleSubmit = async () => {
    // Validación final
    if (!title.trim()) {
      setTitleError('El título es requerido')
      return
    }
    if (!content.trim()) {
      setContentError('El contenido es requerido')
      return
    }
    if (titleError || contentError) {
      toast.error('Por favor corrige los errores antes de guardar')
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
          const { safeJsonParse } = await import('@/lib/api-helpers')
          const errorData = await safeJsonParse<{ error?: string }>(res, {
            path: typeof window !== 'undefined' ? window.location.pathname : '/notes',
            operation: 'actualizar nota',
          })
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
          const { safeJsonParse } = await import('@/lib/api-helpers')
          const errorData = await safeJsonParse<{ error?: string }>(res, {
            path: typeof window !== 'undefined' ? window.location.pathname : '/notes',
            operation: 'crear nota',
          })
          throw new Error(errorData.error || 'Error al crear nota')
        }

        toast.success('Nota creada correctamente')
      }

      onOpenChange(false)
      if (onSuccess) onSuccess()
    } catch (error) {
      const errorInfo = extractErrorInfo(error)
      const errorCode = noteId ? ERROR_CODES.DATA_UPDATE_FAILED : ERROR_CODES.DATA_CREATE_FAILED
      const structuredError = getErrorMessage(errorCode, {
        item: 'la nota',
        reason: errorInfo.message,
      })

      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'note_error',
        action: noteId ? 'update' : 'create',
        noteId,
      })

      toast.error(structuredError.title, {
        description: `${structuredError.description} ${structuredError.solution}`,
        duration: 6000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>{noteId ? 'Editar Nota' : 'Nueva Nota'}</DialogTitle>
              <DialogDescription>
                {noteId
                  ? 'Modifica tu nota de estudio'
                  : 'Crea una nota personal para recordar conceptos importantes'}
              </DialogDescription>
            </div>
            <UndoRedoToolbar onUndo={undo} onRedo={redo} canUndo={canUndo} canRedo={canRedo} />
          </div>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              placeholder="Ej: Fórmula importante de matemáticas"
              className={titleError ? 'border-destructive' : ''}
            />
            {titleError && <p className="text-sm text-destructive">{titleError}</p>}
            {title && !titleError && (
              <p className="text-xs text-muted-foreground">{title.length}/100 caracteres</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Contenido</Label>
            <Textarea
              id="content"
              value={content}
              onChange={e => handleContentChange(e.target.value)}
              placeholder="Escribe tus apuntes aquí..."
              rows={8}
              className={contentError ? 'border-destructive' : ''}
            />
            {contentError && <p className="text-sm text-destructive">{contentError}</p>}
            {content && !contentError && (
              <p className="text-xs text-muted-foreground">{content.length}/5000 caracteres</p>
            )}
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
