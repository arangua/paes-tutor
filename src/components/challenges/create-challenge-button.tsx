'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Trophy, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { captureError } from '@/lib/monitoring'
import { TIME_CONSTANTS } from '@/lib/constants'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CreateChallengeButtonProps {
  examId?: string
  examTitle?: string
  onChallengeCreated?: () => void
}

export function CreateChallengeButton({
  examId,
  examTitle,
  onChallengeCreated,
}: CreateChallengeButtonProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedExamId, setSelectedExamId] = useState<string>(examId || '')
  const [exams, setExams] = useState<Array<{ id: string; titulo: string }>>([])
  const [loadingExams, setLoadingExams] = useState(false)
  const [loading, setLoading] = useState(false)
  const [created, setCreated] = useState(false)
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
    }
  }, [])

  // Cargar exámenes cuando se abre el diálogo
  const loadExams = async () => {
    if (exams.length > 0) return // Ya están cargados

    try {
      setLoadingExams(true)
      const res = await fetch('/api/exams?limit=50')
      if (!res.ok) throw new Error('Error al cargar exámenes')
      const data = await res.json()
      setExams(data.exams || [])
    } catch (error) {
      toast.error('Error al cargar exámenes')
    } finally {
      setLoadingExams(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen && !examId) {
      loadExams()
    }
  }

  const handleCreate = async () => {
    if (!selectedExamId && !examId) {
      toast.error('Debes seleccionar un examen')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examId: selectedExamId || examId,
          message: message.trim() || undefined,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al crear desafío')
      }

      setCreated(true)
      toast.success('Desafío creado exitosamente', {
        description:
          'El otro estudiante recibirá una notificación y podrá aceptar o rechazar el desafío.',
      })
      // Limpiar timeout anterior si existe
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current)
      }
      closeTimeoutRef.current = setTimeout(() => {
        setOpen(false)
        setMessage('')
        setCreated(false)
        onChallengeCreated?.()
      }, TIME_CONSTANTS.ONE_SECOND_MS)
    } catch (error) {
      const errorInfo = extractErrorInfo(error)
      const structuredError = getErrorMessage(ERROR_CODES.DATA_CREATE_FAILED, {
        item: 'el desafío',
        reason: errorInfo.message,
      })

      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'challenge_error',
        action: 'create',
        examId: selectedExamId || examId,
      })

      toast.error(structuredError.title, {
        description: `${structuredError.description} ${structuredError.solution}`,
        duration: 6000,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Trophy className="h-4 w-4" />
          Desafiar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Crear Desafío</DialogTitle>
          <DialogDescription>
            Desafía al otro estudiante a realizar {examTitle ? `"${examTitle}"` : 'un examen'}.
            Ambos realizarán el mismo examen y se compararán los resultados.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {!examId && (
            <div>
              <Label htmlFor="exam">Examen *</Label>
              {loadingExams ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <Select value={selectedExamId} onValueChange={setSelectedExamId}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Selecciona un examen" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map(exam => (
                      <SelectItem key={exam.id} value={exam.id}>
                        {exam.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
          <div>
            <Label htmlFor="message">Mensaje (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Agrega un mensaje motivador..."
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
          <Button
            onClick={handleCreate}
            disabled={loading || created || (!selectedExamId && !examId)}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creando...
              </>
            ) : created ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Creado
              </>
            ) : (
              <>
                <Trophy className="h-4 w-4 mr-2" />
                Crear Desafío
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
