'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ScoreImprovementAnimationProps {
  previousScore: number
  currentScore: number
  label?: string
  onComplete?: () => void
  duration?: number
}

export function ScoreImprovementAnimation({
  previousScore,
  currentScore,
  label = 'Puntaje',
  onComplete,
  duration = 2000,
}: ScoreImprovementAnimationProps) {
  const [displayedScore, setDisplayedScore] = useState(previousScore)
  const [isAnimating, setIsAnimating] = useState(true)

  const difference = currentScore - previousScore
  const isImprovement = difference > 0
  const isStable = difference === 0

  useEffect(() => {
    const startTime = Date.now()
    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Easing function for smooth animation
      const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
      const easedProgress = easeOutCubic(progress)

      const newScore = previousScore + difference * easedProgress
      setDisplayedScore(newScore)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
        onComplete?.()
      }
    }

    requestAnimationFrame(animate)
  }, [previousScore, currentScore, difference, duration, onComplete])

  if (isStable) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Minus className="h-4 w-4" />
        <span className="text-sm">
          {label}: {currentScore.toFixed(1)}%
        </span>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-center gap-2',
        'transform transition-all duration-300',
        isAnimating && 'scale-110'
      )}
    >
      {isImprovement ? (
        <TrendingUp
          className={cn(
            'h-5 w-5 text-green-600 dark:text-green-400',
            isAnimating && 'animate-bounce'
          )}
        />
      ) : (
        <TrendingDown
          className={cn('h-5 w-5 text-red-600 dark:text-red-400', isAnimating && 'animate-bounce')}
        />
      )}
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'text-lg font-bold transition-colors',
            isImprovement ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          {displayedScore.toFixed(1)}%
        </span>
        {isAnimating && (
          <span
            className={cn(
              'text-xs font-semibold',
              isImprovement
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400',
              'animate-fade-in'
            )}
          >
            {isImprovement ? '+' : ''}
            {difference.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}
