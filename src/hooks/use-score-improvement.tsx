'use client'

import { useEffect, useRef, useState, startTransition } from 'react'
import { ScoreImprovementAnimation } from '@/components/animations/score-improvement-animation'

interface UseScoreImprovementProps {
  currentScore: number
  label?: string
  threshold?: number // Solo mostrar animación si la mejora es mayor a este umbral
  onImprovement?: (difference: number) => void
}

export function useScoreImprovement({
  currentScore,
  label = 'Puntaje',
  threshold = 0.1, // 0.1% mínimo para mostrar animación
  onImprovement,
}: UseScoreImprovementProps) {
  // Inicializar con el score actual para evitar setState en el primer render
  const [previousScore, setPreviousScore] = useState<number | null>(currentScore)
  const [showAnimation, setShowAnimation] = useState(false)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // No necesitamos setState aquí porque ya inicializamos con currentScore
      return
    }

    if (previousScore !== null) {
      const difference = Math.abs(currentScore - previousScore)
      if (difference >= threshold) {
        // Usar startTransition para diferir la actualización del estado
        startTransition(() => {
          setShowAnimation(true)
          onImprovement?.(currentScore - previousScore)

          // Ocultar animación después de completarse
          setTimeout(() => {
            setShowAnimation(false)
          }, 2500)
        })
      }
    }

    // Usar startTransition para diferir la actualización del estado
    startTransition(() => {
      setPreviousScore(currentScore)
    })
  }, [currentScore, previousScore, threshold, onImprovement])

  const ScoreAnimation = () => {
    if (!showAnimation || previousScore === null) {
      return null
    }

    return (
      <ScoreImprovementAnimation
        previousScore={previousScore}
        currentScore={currentScore}
        label={label}
        onComplete={() => setShowAnimation(false)}
      />
    )
  }

  return {
    ScoreAnimation,
    previousScore,
    currentScore,
    difference: previousScore !== null ? currentScore - previousScore : 0,
  }
}
