'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2, Plus } from 'lucide-react'
import { toast } from 'sonner'

interface CreateFlashcardButtonProps {
  questionId?: string
  defaultFront?: string
  defaultBack?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function CreateFlashcardButton({
  questionId,
  defaultFront = '',
  defaultBack = '',
  variant = 'ghost',
  size = 'sm',
}: CreateFlashcardButtonProps) {
  const [open, setOpen] = useState(false)
  const [front, setFront] = useState(defaultFront)
  const [back, setBack] = useState(defaultBack)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = async () => {
    if (!front.trim() || !back.trim()) {
      toast.error('Por favor completa ambos campos')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId: questionId || undefined,
          front: front.trim(),
          back: back.trim(),
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al crear flashcard')
      }

      toast.success('Flashcard creada correctamente')
      setOpen(false)
      setFront('')
      setBack('')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error('Error al crear flashcard', {
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        title="Crear flashcard"
        aria-label="Crear flashcard"
      >
        <Plus className="h-4 w-4 mr-2" />
        Crear Flashcard
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Flashcard</DialogTitle>
            <DialogDescription>
              Crea una tarjeta de estudio para memorizar conceptos
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="front">Anverso (Pregunta/Concepto)</Label>
              <Textarea
                id="front"
                value={front}
                onChange={e => setFront(e.target.value)}
                placeholder="Escribe la pregunta o concepto aquí..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="back">Reverso (Respuesta/Explicación)</Label>
              <Textarea
                id="back"
                value={back}
                onChange={e => setBack(e.target.value)}
                placeholder="Escribe la respuesta o explicación aquí..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creando...
                </>
              ) : (
                'Crear'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
