'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

interface ShareFlashcardButtonProps {
  flashcardId: string
  flashcardFront: string
  onShared?: () => void
}

export function ShareFlashcardButton({
  flashcardId,
  flashcardFront,
  onShared,
}: ShareFlashcardButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    // Validación en frontend
    if (!flashcardId || flashcardId.trim() === '') {
      toast.error('ID de flashcard inválido')
      return
    }

    if (message && message.length > 500) {
      toast.error('El mensaje no puede exceder 500 caracteres')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/shared-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId,
          message: message.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al compartir flashcard')
      }

      setShared(true)
      toast.success('Flashcard compartida exitosamente')
      setOpen(false)
      setMessage('')
      onShared?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al compartir flashcard')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Share2 className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir Flashcard</DialogTitle>
          <DialogDescription>
            Comparte esta flashcard con el otro estudiante. Podrá verla en su lista de flashcards
            compartidas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Anverso:</p>
            <p className="text-sm text-muted-foreground">{flashcardFront}</p>
          </div>
          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Agrega un mensaje personalizado..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              rows={3}
              className="mt-2"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleShare} disabled={loading || shared}>
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Compartiendo...
              </>
            ) : shared ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Compartido
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Compartir
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

