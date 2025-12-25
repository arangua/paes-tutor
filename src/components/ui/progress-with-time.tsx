'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressWithTimeProps {
  value: number
  current: number
  total: number
  estimatedTimeRemaining?: number // en segundos
  label?: string
  className?: string
}

export function ProgressWithTime({
  value,
  current,
  total,
  estimatedTimeRemaining,
  label,
  className,
}: ProgressWithTimeProps) {
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {label || 'Progreso'} {current} de {total}
        </span>
        <span className="font-medium">{Math.round(value)}%</span>
      </div>
      <Progress value={value} className="h-2" />
      {estimatedTimeRemaining !== undefined && estimatedTimeRemaining > 0 && (
        <div className="text-xs text-muted-foreground text-right">
          Tiempo estimado: {formatTime(estimatedTimeRemaining)} restantes
        </div>
      )}
    </div>
  )
}
