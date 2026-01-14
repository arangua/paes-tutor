'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  BookOpen,
  Target,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface TopicRecommendation {
  topicId: string
  topicName: string
  subjectName: string
  subjectCode: string
  currentPercentage: number
  priority: 'high' | 'medium' | 'low'
  reason: string
  suggestedActions: string[]
}

interface ExamRecommendation {
  examId: string
  examTitle: string
  subjectName: string
  subjectCode: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  focusTopics: string[]
}

interface RecommendationCardProps {
  type: 'topic' | 'exam'
  recommendation: TopicRecommendation | ExamRecommendation
  className?: string
}

export function RecommendationCard({ type, recommendation, className }: RecommendationCardProps) {
  const isTopic = type === 'topic'
  const topicRec = isTopic ? (recommendation as TopicRecommendation) : null
  const examRec = !isTopic ? (recommendation as ExamRecommendation) : null

  const priorityColors = {
    high: 'border-red-500 bg-red-50 dark:bg-red-950/20',
    medium: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20',
    low: 'border-blue-500 bg-blue-50 dark:bg-blue-950/20',
  }

  const priorityBadgeVariants = {
    high: 'destructive' as const,
    medium: 'secondary' as const,
    low: 'default' as const,
  }

  const priorityLabels = {
    high: 'Alta Prioridad',
    medium: 'Prioridad Media',
    low: 'Baja Prioridad',
  }

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        priorityColors[recommendation.priority],
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isTopic ? (
                <Target className="h-5 w-5 text-primary" />
              ) : (
                <BookOpen className="h-5 w-5 text-primary" />
              )}
              <CardTitle className="text-lg">
                {isTopic ? topicRec!.topicName : examRec!.examTitle}
              </CardTitle>
            </div>
            <CardDescription>
              {isTopic ? topicRec!.subjectName : examRec!.subjectName}
            </CardDescription>
          </div>
          <Badge variant={priorityBadgeVariants[recommendation.priority]}>
            {priorityLabels[recommendation.priority]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Razón de la recomendación */}
        <div className="flex items-start gap-2 p-3 bg-background/50 rounded-lg">
          <Lightbulb className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <p className="text-sm">{recommendation.reason}</p>
        </div>

        {/* Información específica */}
        {isTopic && topicRec && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rendimiento actual:</span>
              <span
                className={cn(
                  'font-semibold',
                  topicRec.currentPercentage < 30
                    ? 'text-red-600'
                    : topicRec.currentPercentage < 50
                      ? 'text-yellow-600'
                      : 'text-green-600'
                )}
              >
                {topicRec.currentPercentage.toFixed(1)}%
              </span>
            </div>

            {/* Acciones sugeridas */}
            {topicRec.suggestedActions.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground">Acciones sugeridas:</p>
                <ul className="space-y-1">
                  {topicRec.suggestedActions.slice(0, 3).map((action, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {!isTopic && examRec && (
          <div className="space-y-2">
            {examRec.focusTopics.length > 0 && (
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-2">
                  Temas a reforzar en este examen:
                </p>
                <div className="flex flex-wrap gap-2">
                  {examRec.focusTopics.slice(0, 3).map((topic, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Acción */}
        <Button variant="default" className="w-full" asChild>
          <Link
            href={
              isTopic ? `/exams?subject=${topicRec!.subjectCode}` : `/exams/${examRec!.examId}/take`
            }
          >
            {isTopic ? 'Ver Exámenes' : 'Realizar Examen'}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
