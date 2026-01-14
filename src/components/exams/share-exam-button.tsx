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

interface ShareExamButtonProps {
  examId: string
  examTitle: string
  onShared?: () => void
}

export function ShareExamButton({ examId, examTitle, onShared }: ShareExamButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [shared, setShared] = useState(false)

  const handleShare = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/shared-exams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId,
          message: message.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al compartir examen')
      }

      setShared(true)
      toast.success('Examen compartido exitosamente')
      setOpen(false)
      setMessage('')
      onShared?.()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al compartir examen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Compartir
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Compartir Examen</DialogTitle>
          <DialogDescription>
            Comparte &quot;{examTitle}&quot; con el otro estudiante. Podrá verlo en su lista de exámenes
            compartidos.
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
