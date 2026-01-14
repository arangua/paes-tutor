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

/**
 * Componente para mostrar recordatorios visuales de tareas pendientes
 * Basado en Nielsen Heuristic #1: Visibility of system status
 */
export function PendingReminders({
  pendingAttempts = [],
  pendingFlashcards = 0,
  pendingChallenges = 0,
  pendingReviews = 0,
}: PendingRemindersProps) {
  // Calcular fecha actual de forma pura usando useState
  const [currentTime] = useState(() => Date.now())

  const reminders: PendingReminder[] = []

  // ✅ Enterprise: Agregar exámenes en progreso usando funciones seguras
  pendingAttempts.forEach(attempt => {
    const daysSinceStart = calculateDaysSince(attempt.startedAt, currentTime)
    reminders.push({
      id: `attempt-${attempt.id}`,
      type: 'exam',
      title: attempt.exam.titulo,
      description: `Examen en progreso desde hace ${daysSinceStart} ${daysSinceStart === 1 ? 'día' : 'días'}`,
      priority: daysSinceStart >= 3 ? 'high' : daysSinceStart >= 1 ? 'medium' : 'low',
      actionUrl: attempt.exam.id
        ? `/exams/${attempt.exam.id}/take?attemptId=${attempt.id}`
        : `/exams?attemptId=${attempt.id}`,
      metadata: {
        subject: attempt.exam.subject.nombre,
        count: attempt.correctas,
      },
    })
  })

  // Agregar flashcards pendientes
  if (pendingFlashcards > 0) {
    reminders.push({
      id: 'flashcards-pending',
      type: 'flashcard',
      title: 'Flashcards pendientes',
      description: `${pendingFlashcards} ${pendingFlashcards === 1 ? 'flashcard' : 'flashcards'} ${pendingFlashcards === 1 ? 'está' : 'están'} lista${pendingFlashcards === 1 ? '' : 's'} para repasar`,
      priority: pendingFlashcards >= 10 ? 'high' : pendingFlashcards >= 5 ? 'medium' : 'low',
      actionUrl: '/flashcards',
      metadata: {
        count: pendingFlashcards,
      },
    })
  }

  // Agregar desafíos pendientes
  if (pendingChallenges > 0) {
    reminders.push({
      id: 'challenges-pending',
      type: 'challenge',
      title: 'Desafíos pendientes',
      description: `Tienes ${pendingChallenges} ${pendingChallenges === 1 ? 'desafío' : 'desafíos'} ${pendingChallenges === 1 ? 'pendiente' : 'pendientes'}`,
      priority: 'medium',
      actionUrl: '/challenges',
      metadata: {
        count: pendingChallenges,
      },
    })
  }

  // Agregar repasos pendientes
  if (pendingReviews > 0) {
    reminders.push({
      id: 'reviews-pending',
      type: 'review',
      title: 'Repasos pendientes',
      description: `${pendingReviews} ${pendingReviews === 1 ? 'pregunta' : 'preguntas'} ${pendingReviews === 1 ? 'requiere' : 'requieren'} repaso`,
      priority: pendingReviews >= 20 ? 'high' : pendingReviews >= 10 ? 'medium' : 'low',
      actionUrl: '/review/quick',
      metadata: {
        count: pendingReviews,
      },
    })
  }

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
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  const sortedReminders = [...reminders].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  )

  const getReminderIcon = (type: string) => {
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

  const getPriorityColor = (priority: string) => {
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

  const getPriorityLabel = (priority: string) => {
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

