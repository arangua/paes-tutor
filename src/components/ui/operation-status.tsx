'use client'

import { Loader2, CheckCircle2, XCircle, Clock, RefreshCw, Cloud, CloudOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export type OperationStatus = 'idle' | 'processing' | 'saving' | 'saved' | 'syncing' | 'synced' | 'error' | 'offline'

interface OperationStatusProps {
  status: OperationStatus
  message?: string
  detail?: string
  className?: string
  showIcon?: boolean
  variant?: 'default' | 'compact' | 'minimal'
}

const statusConfig: Record<
  OperationStatus,
  {
    icon: typeof Loader2
    label: string
    color: string
    bgColor: string
  }
> = {
  idle: {
    icon: Clock,
    label: 'Listo',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
  },
  processing: {
    icon: Loader2,
    label: 'Procesando',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  saving: {
    icon: Loader2,
    label: 'Guardando',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
  },
  saved: {
    icon: CheckCircle2,
    label: 'Guardado',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  syncing: {
    icon: RefreshCw,
    label: 'Sincronizando',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
  },
  synced: {
    icon: Cloud,
    label: 'Sincronizado',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950',
  },
  error: {
    icon: XCircle,
    label: 'Error',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
  },
  offline: {
    icon: CloudOff,
    label: 'Sin conexión',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
  },
}

export function OperationStatus({
  status,
  message,
  detail,
  className,
  showIcon = true,
  variant = 'default',
}: OperationStatusProps) {
  // eslint-disable-next-line security/detect-object-injection
  const config = statusConfig[status] // key validated via OperationStatusProps union
  const Icon = config.icon
  const isAnimated = status === 'processing' || status === 'saving' || status === 'syncing'

  if (variant === 'minimal') {
    return (
      <span
        className={cn('flex items-center gap-1.5 text-xs', config.color, className)}
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        {showIcon && (
          <Icon className={cn('h-3 w-3', isAnimated && 'animate-spin')} aria-hidden="true" />
        )}
        <span>{message || config.label}</span>
      </span>
    )
  }

  if (variant === 'compact') {
    return (
      <Badge
        variant="outline"
        className={cn(
          'flex items-center gap-1.5 text-xs',
          config.bgColor,
          config.color,
          className
        )}
      >
        {showIcon && (
          <Icon className={cn('h-3 w-3', isAnimated && 'animate-spin')} />
        )}
        <span>{message || config.label}</span>
        {detail && <span className="text-muted-foreground">• {detail}</span>}
      </Badge>
    )
  }

  return (
    <div
      className={cn('flex items-center gap-2', className)}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {showIcon && (
        <Icon
          className={cn('h-4 w-4', config.color, isAnimated && 'animate-spin')}
          aria-hidden="true"
        />
      )}
      <div className="flex flex-col">
        <span className={cn('text-sm font-medium', config.color)}>
          {message || config.label}
        </span>
        {detail && (
          <span className="text-xs text-muted-foreground">{detail}</span>
        )}
      </div>
    </div>
  )
}

/**
 * Hook para manejar estados de operaciones con mensajes específicos
 */
export function useOperationStatus() {
  const getStatusMessage = (
    operation: string,
    current?: number,
    total?: number,
    itemName?: string
  ): string => {
    if (current !== undefined && total !== undefined) {
      return `${operation} ${itemName || 'elemento'} ${current} de ${total}...`
    }
    return `${operation}...`
  }

  return { getStatusMessage }
}

