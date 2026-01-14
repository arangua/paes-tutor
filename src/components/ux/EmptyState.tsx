/**
 * Empty State Component
 * 
 * Regla Enterprise:
 * Datos válidos pero vacíos
 * Mensaje neutro (no error)
 * Acción opcional (crear / refrescar)
 */

import { Inbox } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

export function EmptyState({
  title = 'No hay datos',
  description = 'No se encontraron elementos para mostrar.',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center space-y-4 max-w-md">
        <div className="flex justify-center">
          <Inbox className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  )
}
