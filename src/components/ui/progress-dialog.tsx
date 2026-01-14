'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, Loader2, XCircle, Clock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProgressStep } from '@/hooks/useProgressTracker'

interface ProgressDialogProps {
  open: boolean
  title: string
  description?: string
  progress: number
  current: number
  total: number
  message: string
  steps?: ProgressStep[]
  estimatedTimeRemaining?: number | null
  onCancel?: () => void
}

// ✅ Enterprise: Usar función segura centralizada para formateo de tiempo
import { formatDuration } from '@/lib/utils'

// Alias para mantener compatibilidad
function formatTime(seconds: number): string {
  return formatDuration(seconds)
}

export function ProgressDialog({
  open,
  title,
  description,
  progress,
  current,
  total,
  message,
  steps = [],
  estimatedTimeRemaining,
  onCancel,
}: ProgressDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" hideCloseButton>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-4">
          {/* Barra de progreso principal */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-medium">{message}</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {current} de {total} {total === 1 ? 'elemento' : 'elementos'}
              </span>
              {estimatedTimeRemaining !== null && estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tiempo estimado: {formatTime(estimatedTimeRemaining)}
                </span>
              )}
            </div>
          </div>

          {/* Pasos detallados */}
          {steps.length > 0 && (
            <div className="space-y-2 max-h-48 overflow-y-auto border rounded-md p-3 bg-muted/30">
              <div className="text-xs font-semibold text-muted-foreground mb-2">Progreso detallado:</div>
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    'flex items-center gap-2 text-sm',
                    step.status === 'completed' && 'text-green-600 dark:text-green-400',
                    step.status === 'error' && 'text-destructive',
                    step.status === 'processing' && 'text-primary font-medium',
                    step.status === 'pending' && 'text-muted-foreground'
                  )}
                >
                  {step.status === 'completed' && <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
                  {step.status === 'processing' && <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin" />}
                  {step.status === 'error' && <XCircle className="h-4 w-4 flex-shrink-0" />}
                  {step.status === 'pending' && (
                    <div className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-muted-foreground" />
                  )}
                  <span className="flex-1 truncate">{step.label}</span>
                  {step.error && (
                    <span className="text-xs text-destructive ml-2 truncate max-w-[200px]">{step.error}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {onCancel && (
          <div className="flex justify-end pt-2 border-t">
            <button
              onClick={onCancel}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cancelar operación"
            >
              Cancelar
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

