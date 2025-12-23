'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  description?: string
  value: number
  maxValue?: number
  percentage?: number
  comparison?: {
    value: number
    label: string
  }
  badge?: {
    text: string
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  icon?: React.ReactNode
  className?: string
}

export function StatsCard({
  title,
  description,
  value,
  maxValue,
  percentage,
  comparison,
  badge,
  icon,
  className,
}: StatsCardProps) {
  const showProgress = percentage !== undefined
  const showComparison = comparison !== undefined
  const diff = showComparison ? value - comparison.value : 0
  const isPositive = diff > 0
  const isNegative = diff < 0
  const isNeutral = diff === 0

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold">
              {maxValue !== undefined ? `${value} / ${maxValue}` : value}
            </div>
            {percentage !== undefined && (
              <span className="text-lg text-muted-foreground">({percentage.toFixed(1)}%)</span>
            )}
            {badge && (
              <Badge variant={badge.variant || 'default'} className="ml-auto">
                {badge.text}
              </Badge>
            )}
          </div>

          {description && <p className="text-sm text-muted-foreground">{description}</p>}

          {showProgress && <Progress value={percentage} className="h-2" />}

          {showComparison && (
            <div
              className={cn(
                'flex items-center gap-1 text-sm pt-1',
                isPositive && 'text-green-600',
                isNegative && 'text-red-600',
                isNeutral && 'text-muted-foreground'
              )}
            >
              {isPositive && <TrendingUp className="h-4 w-4" />}
              {isNegative && <TrendingDown className="h-4 w-4" />}
              {isNeutral && <Minus className="h-4 w-4" />}
              <span>
                {isPositive && '+'}
                {diff.toFixed(1)}% vs {comparison.label}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
