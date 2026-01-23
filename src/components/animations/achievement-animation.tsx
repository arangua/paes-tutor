'use client'

import { useEffect, useState } from 'react'
import { Award, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface AchievementAnimationProps {
  achievement: {
    id: string
    title: string
    description: string
    icon?: React.ComponentType<{ className?: string }>
  }
  onClose?: () => void
  autoClose?: boolean
  duration?: number
}

function getCryptoRandom01() {
  const bytes = new Uint32Array(1)
  crypto.getRandomValues(bytes)
  return bytes[0] / 2 ** 32
}

function getConfettiColorClass(index: number) {
  switch (index % 4) {
    case 0:
      return 'bg-yellow-300'
    case 1:
      return 'bg-orange-300'
    case 2:
      return 'bg-red-300'
    default:
      return 'bg-pink-300'
  }
}

export function AchievementAnimation({
  achievement,
  onClose,
  autoClose = true,
  duration = 5000,
}: Readonly<AchievementAnimationProps>) {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(true)
  const Icon = achievement.icon || Award
  // Generar valores aleatorios una vez usando useState para evitar impureza en render
  const [confettiPositions] = useState(() => 
    Array.from({ length: 20 }, () => ({
      left: getCryptoRandom01() * 100,
      top: getCryptoRandom01() * 100,
      animationDuration: 1 + getCryptoRandom01() * 2,
      animationDelay: getCryptoRandom01() * 0.5,
    }))
  )

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(() => {
          setIsVisible(false)
          onClose?.()
        }, 300) // Tiempo para la animación de salida
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, onClose])

  if (!isVisible) return null

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 max-w-md',
        'transform transition-all duration-300 ease-out',
        isAnimating ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      )}
    >
      <div
        className={cn(
          'relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500',
          'dark:from-yellow-600 dark:via-yellow-700 dark:to-orange-700',
          'rounded-lg shadow-2xl p-6 border-2 border-yellow-300 dark:border-yellow-600',
          'animate-pulse-subtle'
        )}
        style={{
          animation: 'pulse-subtle 2s ease-in-out infinite',
        }}
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
          {confettiPositions.map((pos, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-2 h-2 rounded-full',
                getConfettiColorClass(i)
              )}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
                animation: `confetti-fall ${pos.animationDuration}s ease-out forwards`,
                animationDelay: `${pos.animationDelay}s`,
                opacity: 0,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex items-start gap-4">
          {/* Icon with animation */}
          <div
            className={cn('relative flex-shrink-0', 'animate-bounce-in')}
            style={{
              animation: 'bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            }}
          >
            <div className="p-3 bg-white/20 dark:bg-black/20 rounded-full backdrop-blur-sm">
              <Icon className="h-8 w-8 text-white" />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-white/30 rounded-full blur-xl animate-pulse" />
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">
                  ¡Logro Desbloqueado!
                </h3>
                <p className="text-white/90 font-semibold text-sm mb-1 drop-shadow">
                  {achievement.title}
                </p>
                <p className="text-white/80 text-xs drop-shadow">{achievement.description}</p>
              </div>
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-white hover:bg-white/20"
                  onClick={() => {
                    setIsAnimating(false)
                    setTimeout(() => {
                      setIsVisible(false)
                      onClose()
                    }, 300)
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="relative mt-4 h-1 bg-white/20 rounded-full overflow-hidden">
          {autoClose && (
            <div
              className="absolute inset-y-0 left-0 bg-white/50 rounded-full"
              style={{
                animation: `progress-bar ${duration}ms linear forwards`,
              }}
            />
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse-subtle {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7);
          }
          50% {
            box-shadow: 0 0 0 10px rgba(251, 191, 36, 0);
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes progress-bar {
          0% {
            width: 100%;
          }
          100% {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}
