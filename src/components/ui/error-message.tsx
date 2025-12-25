'use client'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { AlertCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ErrorMessage } from '@/lib/error-messages'

interface ErrorMessageProps {
  error: ErrorMessage
  className?: string
  onAction?: () => void
  onDismiss?: () => void
}

const severityIcons = {
  low: Info,
  medium: AlertCircle,
  high: AlertTriangle,
  critical: XCircle,
}

const severityColors = {
  low: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-200',
  medium:
    'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-800 dark:text-yellow-200',
  high: 'border-orange-500 bg-orange-50 dark:bg-orange-950/20 text-orange-800 dark:text-orange-200',
  critical: 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-800 dark:text-red-200',
}

export function ErrorMessageComponent({
  error,
  className,
  onAction,
  onDismiss,
}: ErrorMessageProps) {
  const Icon = severityIcons[error.severity]
  const colorClass = severityColors[error.severity]

  return (
    <Alert className={cn(colorClass, className)}>
      <Icon className="h-4 w-4" />
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <AlertTitle className="flex items-center gap-2">
              {error.title}
              <span className="text-xs font-mono opacity-70">[{error.code}]</span>
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-2">
              <p>{error.description}</p>
              <div className="bg-background/50 rounded-md p-3 mt-2">
                <p className="text-sm font-medium mb-1">💡 Solución:</p>
                <p className="text-sm">{error.solution}</p>
              </div>
            </AlertDescription>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={onDismiss}
              aria-label="Cerrar"
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </div>
        {error.action && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onAction || error.action.onClick}
              className="bg-background"
            >
              {error.action.label}
            </Button>
          </div>
        )}
      </div>
    </Alert>
  )
}
