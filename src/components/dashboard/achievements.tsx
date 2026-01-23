'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Award, Target, TrendingUp, Star, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAchievementDetector } from '@/hooks/use-achievement-detector'
import { safeRound } from '@/app/api/notes/versions/validation-utils'

interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  unlocked: boolean
  progress?: {
    current: number
    target: number
  }
  badge?: string
}

interface AchievementsProps {
  attempts: Array<{
    porcentaje: number
    estado: string
    totalPreguntas: number
    correctas: number
  }>
  avgScore: number
}

export function Achievements({ attempts, avgScore }: Readonly<AchievementsProps>) {
  const completedAttempts = attempts.filter(a => a.estado === 'completado').length
  const highScores = attempts.filter(a => a.porcentaje >= 70).length
  const perfectScores = attempts.filter(a => a.porcentaje === 100).length

  const achievements: Achievement[] = [
    {
      id: 'first-attempt',
      title: 'Primer Paso',
      description: 'Completa tu primer examen',
      icon: Target,
      unlocked: completedAttempts >= 1,
      badge: completedAttempts >= 1 ? 'Desbloqueado' : undefined,
    },
    {
      id: 'dedicated',
      title: 'Estudiante Dedicado',
      description: 'Completa 5 exámenes',
      icon: TrendingUp,
      unlocked: completedAttempts >= 5,
      progress: completedAttempts < 5 ? { current: completedAttempts, target: 5 } : undefined,
      badge: completedAttempts >= 5 ? 'Desbloqueado' : undefined,
    },
    {
      id: 'expert',
      title: 'Experto',
      description: 'Completa 10 exámenes',
      icon: Star,
      unlocked: completedAttempts >= 10,
      progress: completedAttempts < 10 ? { current: completedAttempts, target: 10 } : undefined,
      badge: completedAttempts >= 10 ? 'Desbloqueado' : undefined,
    },
    {
      id: 'high-achiever',
      title: 'Alto Rendimiento',
      description: 'Obtén 70% o más en un examen',
      icon: Trophy,
      unlocked: highScores >= 1,
      badge: highScores >= 1 ? 'Desbloqueado' : undefined,
    },
    {
      id: 'perfectionist',
      title: 'Perfeccionista',
      description: 'Obtén 100% en un examen',
      icon: Zap,
      unlocked: perfectScores >= 1,
      badge: perfectScores >= 1 ? 'Desbloqueado' : undefined,
    },
    {
      id: 'consistency',
      title: 'Consistencia',
      description: 'Mantén un promedio de 70% o más',
      icon: Award,
      unlocked: avgScore >= 70 && completedAttempts >= 3,
      badge: avgScore >= 70 && completedAttempts >= 3 ? 'Desbloqueado' : undefined,
    },
  ]

  const unlockedCount = achievements.filter(a => a.unlocked).length
  const totalCount = achievements.length

  // Detectar logros recién desbloqueados
  const { AchievementNotifications } = useAchievementDetector({
    achievements,
    onAchievementUnlocked: _achievement => {
      // La notificación se mostrará automáticamente
      // Logro desbloqueado (notificación se muestra automáticamente)
    },
  })

  return (
    <>
      <AchievementNotifications />
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Logros
              </CardTitle>
              <CardDescription>
                {unlockedCount} de {totalCount} logros desbloqueados
              </CardDescription>
            </div>
            <Badge variant="secondary">{safeRound((unlockedCount / totalCount) * 100, 0)}%</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {achievements.map(achievement => {
              const Icon = achievement.icon
              return (
                <div
                  key={achievement.id}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all',
                    achievement.unlocked
                      ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                      : 'border-muted bg-muted/30 opacity-60'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        'p-2 rounded-lg',
                        achievement.unlocked ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-5 w-5',
                          achievement.unlocked ? 'text-green-600' : 'text-muted-foreground'
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p
                          className={cn(
                            'font-semibold text-sm',
                            achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {achievement.title}
                        </p>
                        {achievement.badge && (
                          <Badge variant="default" className="text-xs">
                            {achievement.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {achievement.description}
                      </p>
                      {achievement.progress && (
                        <div className="text-xs text-muted-foreground">
                          Progreso: {achievement.progress.current} / {achievement.progress.target}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
