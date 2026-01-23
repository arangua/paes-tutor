'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { StepByStepExplanation } from './step-by-step-explanation'
import type { StepByStepExplanationData } from './step-by-step-explanation'

interface StepByStepExplanationButtonProps {
  question: string
  correctAnswer: string
  studentAnswer?: string
  topic?: string
  subject?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export function StepByStepExplanationButton({
  question,
  correctAnswer,
  studentAnswer,
  topic,
  subject,
  variant = 'outline',
  size = 'sm',
}: Readonly<StepByStepExplanationButtonProps>) {
  const [open, setOpen] = useState(false)
  const [explanation, setExplanation] = useState<StepByStepExplanationData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleOpen = async () => {
    if (explanation) {
      setOpen(true)
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'step-by-step-explanation',
          question,
          correctAnswer,
          studentAnswer,
          topic,
          subject,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || 'Error al generar explicación')
      }

      const data = await res.json()
      setExplanation(data.explanation)
      setOpen(true)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Error al generar explicación paso a paso'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button variant={variant} size={size} onClick={handleOpen} disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generando...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Explicación Paso a Paso
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Explicación Paso a Paso</DialogTitle>
            <DialogDescription>
              Explicación detallada generada con IA para ayudarte a entender el problema
            </DialogDescription>
          </DialogHeader>
          {explanation && (
            <StepByStepExplanation
              explanation={explanation}
              question={question}
              correctAnswer={correctAnswer}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
