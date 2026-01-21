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

interface ShareNoteButtonProps {
  noteId: string
  noteTitle: string
  onShared?: () => void
}

export function ShareNoteButton({ noteId, noteTitle, onShared }: Readonly<ShareNoteButtonProps>) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)

  let buttonContent = (
    <>
      <Share2 className="h-4 w-4 mr-2" />
      Compartir
    </>
  )
  if (loading) {
    buttonContent = (
      <>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Compartiendo...
      </>
    )
  } else if (shared) {
    buttonContent = (
      <>
        <Check className="h-4 w-4 mr-2" />
        Compartido
      </>
    )
  }

  const handleShare = async () => {
    // Validación en frontend
    if (!noteId || noteId.trim() === '') {
      toast.error('ID de nota inválido')
      return
    }

    if (message && message.length > 500) {
      toast.error('El mensaje no puede exceder 500 caracteres')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/shared-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId,
          message: message.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al compartir nota')
      }

      setShared(true)
      toast.success('Nota compartida exitosamente')
      setOpen(false)
      setMessage('')
      onShared?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al compartir nota')
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
          <DialogTitle>Compartir Nota</DialogTitle>
          <DialogDescription>
            Comparte &quot;{noteTitle}&quot; con el otro estudiante. Podrá verla en su lista de notas
            compartidas.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
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
            {buttonContent}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

