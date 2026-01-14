'use client'

import { useEffect, useRef, useState } from 'react'
import { AchievementAnimation } from '@/components/animations/achievement-animation'

interface Achievement {
  id: string
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  unlocked: boolean
}

interface UseAchievementDetectorProps {
  achievements: Achievement[]
  onAchievementUnlocked?: (achievement: Achievement) => void
}

export function useAchievementDetector({
  achievements,
  onAchievementUnlocked,
}: UseAchievementDetectorProps) {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([])
  const previousUnlockedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    const currentUnlocked = new Set(achievements.filter(a => a.unlocked).map(a => a.id))
    const previousUnlocked = previousUnlockedRef.current

    // Detectar logros recién desbloqueados
    const newlyUnlocked = achievements.filter(
      achievement => achievement.unlocked && !previousUnlocked.has(achievement.id)
    )

    if (newlyUnlocked.length > 0) {
      setUnlockedAchievements(prev => [...prev, ...newlyUnlocked])
      newlyUnlocked.forEach(achievement => {
        onAchievementUnlocked?.(achievement)
      })
    }

    previousUnlockedRef.current = currentUnlocked
  }, [achievements, onAchievementUnlocked])

  const handleCloseAchievement = (achievementId: string) => {
    setUnlockedAchievements(prev => prev.filter(a => a.id !== achievementId))
  }

  const AchievementNotifications = () => {
    if (unlockedAchievements.length === 0) return null

    return (
      <>
        {unlockedAchievements.map(achievement => (
          <AchievementAnimation
            key={achievement.id}
            achievement={achievement}
            onClose={() => handleCloseAchievement(achievement.id)}
            autoClose={true}
            duration={5000}
          />
        ))}
      </>
    )
  }

  return {
    AchievementNotifications,
    unlockedCount: unlockedAchievements.length,
  }
}
