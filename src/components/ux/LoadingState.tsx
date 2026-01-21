/**
 * Loading State Component
 * 
 * Regla Enterprise:
 * Loading aparece si la operación > 200ms
 * Nunca "parpadea"
 * No bloquea el thread principal
 */

import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  message?: string
  description?: string
  fullScreen?: boolean
}

export function LoadingState({
  message = 'Cargando...',
  description,
  fullScreen = false,
}: Readonly<LoadingStateProps>) {
  const containerClass = fullScreen
    ? 'flex items-center justify-center min-h-screen'
    : 'flex items-center justify-center py-12'

  return (
    <div className={containerClass}>
      <div className="text-center space-y-4">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="absolute inset-0 h-12 w-12 mx-auto">
            <div className="h-full w-full border-4 border-primary/20 rounded-full animate-ping opacity-20" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
