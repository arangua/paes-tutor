'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
// ScrollArea no existe, usaremos un div con overflow
import {
  Clock,
  FileText,
  BookOpen,
  Trophy,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  PlayCircle,
} from 'lucide-react'
import Link from 'next/link'
import { HelpIcon } from '@/components/help/help-icon'
import { cn, calculateDaysSince } from '@/lib/utils'

interface PendingAttempt {
  id: string
  exam: {
    id?: string
    titulo: string
    subject: {
      codigo: string
      nombre: string
    }
  }
  startedAt: string
  totalPreguntas: number
  correctas: number
}

interface PendingReminder {
  id: string
  type: 'exam' | 'flashcard' | 'challenge' | 'note' | 'review'
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  actionUrl: string
  metadata?: {
    subject?: string
    count?: number
    dueDate?: string
  }
}

interface PendingRemindersProps {
  pendingAttempts?: PendingAttempt[]
  pendingFlashcards?: number
  pendingChallenges?: number
  pendingReviews?: number
}

const PRIORITY_ORDER: Record<PendingReminder['priority'], number> = { high: 0, medium: 1, low: 2 }

function getReminderIcon(type: PendingReminder['type']) {
  switch (type) {
    case 'exam':
      return PlayCircle
    case 'flashcard':
      return BookOpen
    case 'challenge':
      return Trophy
    case 'review':
      return FileText
    default:
      return AlertCircle
  }
}

function getPriorityColor(priority: PendingReminder['priority']) {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800'
    case 'low':
      return 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300'
  }
}

function getPriorityLabel(priority: PendingReminder['priority']) {
  switch (priority) {
    case 'high':
      return 'Alta'
    case 'medium':
      return 'Media'
    case 'low':
      return 'Baja'
    default:
      return 'Normal'
  }
}

function getExamReminders(pendingAttempts: PendingAttempt[], currentTime: number): PendingReminder[] {
  const reminders: PendingReminder[] = []

  pendingAttempts.forEach(attempt => {
    const daysSinceStart = calculateDaysSince(attempt.startedAt, currentTime)
    let priority: PendingReminder['priority'] = 'low'
    if (daysSinceStart >= 3) priority = 'high'
    else if (daysSinceStart >= 1) priority = 'medium'

    reminders.push({
      id: `attempt-${attempt.id}`,
      type: 'exam',
      title: attempt.exam.titulo,
      description: `Examen en progreso desde hace ${daysSinceStart} ${daysSinceStart === 1 ? 'día' : 'días'}`,
      priority,
      actionUrl: attempt.exam.id
        ? `/exams/${attempt.exam.id}/take?attemptId=${attempt.id}`
        : `/exams?attemptId=${attempt.id}`,
      metadata: {
        subject: attempt.exam.subject.nombre,
        count: attempt.correctas,
      },
    })
  })

  return reminders
}

function getFlashcardsReminder(pendingFlashcards: number): PendingReminder | null {
  if (pendingFlashcards <= 0) return null

  let priority: PendingReminder['priority'] = 'low'
  if (pendingFlashcards >= 10) priority = 'high'
  else if (pendingFlashcards >= 5) priority = 'medium'

  return {
    id: 'flashcards-pending',
    type: 'flashcard',
    title: 'Flashcards pendientes',
    description: `${pendingFlashcards} ${pendingFlashcards === 1 ? 'flashcard' : 'flashcards'} ${pendingFlashcards === 1 ? 'está' : 'están'} lista${pendingFlashcards === 1 ? '' : 's'} para repasar`,
    priority,
    actionUrl: '/flashcards',
    metadata: {
      count: pendingFlashcards,
    },
  }
}

function getChallengesReminder(pendingChallenges: number): PendingReminder | null {
  if (pendingChallenges <= 0) return null

  return {
    id: 'challenges-pending',
    type: 'challenge',
    title: 'Desafíos pendientes',
    description: `Tienes ${pendingChallenges} ${pendingChallenges === 1 ? 'desafío' : 'desafíos'} ${pendingChallenges === 1 ? 'pendiente' : 'pendientes'}`,
    priority: 'medium',
    actionUrl: '/challenges',
    metadata: {
      count: pendingChallenges,
    },
  }
}

function getReviewsReminder(pendingReviews: number): PendingReminder | null {
  if (pendingReviews <= 0) return null

  let priority: PendingReminder['priority'] = 'low'
  if (pendingReviews >= 20) priority = 'high'
  else if (pendingReviews >= 10) priority = 'medium'

  return {
    id: 'reviews-pending',
    type: 'review',
    title: 'Repasos pendientes',
    description: `${pendingReviews} ${pendingReviews === 1 ? 'pregunta' : 'preguntas'} ${pendingReviews === 1 ? 'requiere' : 'requieren'} repaso`,
    priority,
    actionUrl: '/review/quick',
    metadata: {
      count: pendingReviews,
    },
  }
}

function compactReminders(reminders: Array<PendingReminder | null>): PendingReminder[] {
  return reminders.filter((r): r is PendingReminder => Boolean(r))
}

function buildPendingReminders(params: {
  pendingAttempts: PendingAttempt[]
  pendingFlashcards: number
  pendingChallenges: number
  pendingReviews: number
  currentTime: number
}): PendingReminder[] {
  return [
    ...getExamReminders(params.pendingAttempts, params.currentTime),
    ...compactReminders([
      getFlashcardsReminder(params.pendingFlashcards),
      getChallengesReminder(params.pendingChallenges),
      getReviewsReminder(params.pendingReviews),
    ]),
  ]
}

/**
 * Componente para mostrar recordatorios visuales de tareas pendientes
 * Basado en Nielsen Heuristic #1: Visibility of system status
 */
export function PendingReminders({
  pendingAttempts = [],
  pendingFlashcards = 0,
  pendingChallenges = 0,
  pendingReviews = 0,
}: Readonly<PendingRemindersProps>) {
  // Calcular fecha actual de forma pura usando useState
  const [currentTime] = useState(() => Date.now())

  const reminders = buildPendingReminders({
    pendingAttempts,
    pendingFlashcards,
    pendingChallenges,
    pendingReviews,
    currentTime,
  })

  if (reminders.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <CardTitle>Recordatorios</CardTitle>
            </div>
            <HelpIcon
              content={
                <>
                  <strong>Recordatorios</strong>
                  <br />
                  <span className="text-muted-foreground text-xs">
                    Aquí verás tus tareas pendientes: exámenes sin terminar, flashcards para
                    repasar, desafíos y más. Como una lista de tareas, pero para tu estudio.
                  </span>
                </>
              }
            />
          </div>
          <CardDescription>No tienes tareas pendientes en este momento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-4 opacity-50" />
            <p className="text-sm text-muted-foreground">
              ¡Excelente! Estás al día con todas tus tareas.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Ordenar por prioridad
  const sortedReminders = [...reminders].sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Recordatorios</CardTitle>
            <Badge variant="outline" className="ml-2">
              {reminders.length}
            </Badge>
          </div>
          <HelpIcon
            content={
              <>
                <strong>Recordatorios</strong>
                <br />
                <span className="text-muted-foreground text-xs">
                  Tus tareas pendientes aparecen aquí. Como una lista de tareas, pero para tu
                  estudio. Las tareas de alta prioridad aparecen primero.
                </span>
              </>
            }
          />
        </div>
        <CardDescription>
          {reminders.length} {reminders.length === 1 ? 'tarea pendiente' : 'tareas pendientes'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto pr-2">
          <div className="space-y-3">
            {sortedReminders.map(reminder => {
              const Icon = getReminderIcon(reminder.type)
              return (
                <div
                  key={reminder.id}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-lg border transition-colors',
                    'hover:bg-muted/50',
                    getPriorityColor(reminder.priority)
                  )}
                >
                  <div className="p-2 rounded-md bg-background/50 flex-shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-medium leading-tight">{reminder.title}</p>
                      <Badge
                        variant="outline"
                        className={cn('text-xs flex-shrink-0', getPriorityColor(reminder.priority))}
                      >
                        {getPriorityLabel(reminder.priority)}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{reminder.description}</p>
                    {reminder.metadata?.subject && (
                      <p className="text-xs text-muted-foreground mb-2">
                        Materia: {reminder.metadata.subject}
                      </p>
                    )}
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="w-full mt-2"
                    >
                      <Link href={reminder.actionUrl}>
                        {reminder.type === 'exam' && 'Continuar examen'}
                        {reminder.type === 'flashcard' && 'Repasar flashcards'}
                        {reminder.type === 'challenge' && 'Ver desafíos'}
                        {reminder.type === 'review' && 'Iniciar repaso'}
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

