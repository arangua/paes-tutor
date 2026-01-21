'use client'

import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { safeRound } from '@/app/api/notes/versions/validation-utils'
import { formatDuration } from '@/lib/utils'

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
}: Readonly<ProgressWithTimeProps>) {
  // ✅ Enterprise: Usar función centralizada para formateo de tiempo
  const formatTime = formatDuration

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {label || 'Progreso'} {current} de {total}
        </span>
        <span className="font-medium">{safeRound(value, 0)}%</span>
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
