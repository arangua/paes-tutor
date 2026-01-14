'use client'

import { useEffect, useState, useMemo, useCallback } from 'react'
import { safeToISOString, safeToISODate } from '@/app/api/notes/versions/validation-utils'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  PlayCircle,
  RotateCcw,
  FileStack,
  FileText,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'
import { captureError } from '@/lib/monitoring'

interface StudySchedule {
  id: string
  title: string
  description: string | null
  scheduledAt: string
  durationMinutes: number
  type: 'exam' | 'practice' | 'review' | 'flashcards' | 'custom'
  completed: boolean
  completedAt: string | null
  topic?: {
    id: string
    nombre: string
    subject: {
      nombre: string
    }
  } | null
  exam?: {
    id: string
    titulo: string
    subject: {
      nombre: string
    }
  } | null
}

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<StudySchedule[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<StudySchedule | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Form state
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formScheduledAt, setFormScheduledAt] = useState('')
  const [formDuration, setFormDuration] = useState(60)
  const [formType, setFormType] = useState<
    'exam' | 'practice' | 'review' | 'flashcards' | 'custom'
  >('custom')
  const [formTopicId, setFormTopicId] = useState<string>('')
  const [formExamId, setFormExamId] = useState<string>('')
  const [topics, setTopics] = useState<Array<{ id: string; nombre: string }>>([])
  const [exams, setExams] = useState<Array<{ id: string; titulo: string }>>([])

  const loadSchedules = useCallback(async () => {
    try {
      setLoading(true)
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
      const endOfMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        0,
        23,
        59,
        59
      )

      const res = await fetch(
        `/api/schedule?startDate=${safeToISOString(startOfMonth)}&endDate=${safeToISOString(endOfMonth)}`
      )
      if (!res.ok) throw new Error('Error al cargar calendario')
      const data = await res.json()
      setSchedules(data.schedules || [])
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido')
      toast.error('Error al cargar calendario')
    } finally {
      setLoading(false)
    }
  }, [currentMonth])

  useEffect(() => {
    loadSchedules()
    loadTopics()
    loadExams()
  }, [currentMonth, loadSchedules])

  // loadTopics y loadExams son funciones estables que no dependen de props/state
  useEffect(() => {
    loadSchedules()
    loadTopics()
    loadExams()
  }, [currentMonth, loadSchedules])

  async function loadTopics() {
    try {
      const res = await fetch('/api/topics')
      if (res.ok) {
        const data = await res.json()
        setTopics(data.topics || [])
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'schedule_load_error',
        action: 'load_topics',
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
    }
  }

  async function loadExams() {
    try {
      const res = await fetch('/api/exams')
      if (res.ok) {
        const data = await res.json()
        setExams(data.exams || [])
      }
    } catch (error) {
      captureError(error instanceof Error ? error : new Error(String(error)), {
        type: 'schedule_load_error',
        action: 'load_exams',
        path: typeof window !== 'undefined' ? window.location.pathname : undefined,
      })
    }
  }

  const handleOpenDialog = (schedule?: StudySchedule) => {
    if (schedule) {
      setEditingSchedule(schedule)
      setFormTitle(schedule.title)
      setFormDescription(schedule.description || '')
      setFormScheduledAt(safeToISOString(new Date(schedule.scheduledAt))?.slice(0, 16) || '')
      setFormDuration(schedule.durationMinutes)
      setFormType(schedule.type)
      setFormTopicId(schedule.topic?.id || '')
      setFormExamId(schedule.exam?.id || '')
    } else {
      setEditingSchedule(null)
      setFormTitle('')
      setFormDescription('')
      setFormScheduledAt('')
      setFormDuration(60)
      setFormType('custom')
      setFormTopicId('')
      setFormExamId('')
    }
    setDialogOpen(true)
  }

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formScheduledAt) {
      toast.error('Por favor completa título y fecha')
      return
    }

    try {
      const url = editingSchedule
        ? `/api/schedule?scheduleId=${editingSchedule.id}`
        : '/api/schedule'

      const method = editingSchedule ? 'PUT' : 'POST'
      const body = editingSchedule
        ? {
            title: formTitle.trim(),
            description: formDescription.trim() || undefined,
            scheduledAt: formScheduledAt,
            durationMinutes: formDuration,
            completed: editingSchedule.completed,
          }
        : {
            title: formTitle.trim(),
            description: formDescription.trim() || undefined,
            scheduledAt: formScheduledAt,
            durationMinutes: formDuration,
            type: formType,
            topicId: formTopicId || undefined,
            examId: formExamId || undefined,
          }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const { safeJsonParse } = await import('@/lib/api-helpers')
        const errorData = await safeJsonParse<{ error?: string }>(res, {
          path: typeof window !== 'undefined' ? window.location.pathname : '/schedule',
          operation: 'guardar sesión',
        })
        throw new Error(errorData.error || 'Error al guardar sesión')
      }

      toast.success(editingSchedule ? 'Sesión actualizada' : 'Sesión creada')
      setDialogOpen(false)
      loadSchedules()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      toast.error('Error', {
        description: errorMessage,
      })
    }
  }

  const handleDelete = async (scheduleId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta sesión?')) return

    try {
      const res = await fetch(`/api/schedule?scheduleId=${scheduleId}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Error al eliminar sesión')

      toast.success('Sesión eliminada')
      loadSchedules()
    } catch {
      toast.error('Error al eliminar sesión')
    }
  }

  const handleToggleComplete = async (schedule: StudySchedule) => {
    try {
      const res = await fetch(`/api/schedule?scheduleId=${schedule.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          completed: !schedule.completed,
        }),
      })

      if (!res.ok) throw new Error('Error al actualizar sesión')

      toast.success(schedule.completed ? 'Sesión marcada como pendiente' : 'Sesión completada')
      loadSchedules()
    } catch {
      toast.error('Error al actualizar sesión')
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return <FileText className="h-4 w-4" />
      case 'practice':
        return <PlayCircle className="h-4 w-4" />
      case 'review':
        return <RotateCcw className="h-4 w-4" />
      case 'flashcards':
        return <FileStack className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'exam':
        return 'Examen'
      case 'practice':
        return 'Práctica'
      case 'review':
        return 'Repaso'
      case 'flashcards':
        return 'Flashcards'
      default:
        return 'Personalizado'
    }
  }

  // Memoizar agrupación de schedules por fecha para evitar recálculos innecesarios
  const schedulesByDate = useMemo(() => {
    const grouped = new Map<string, StudySchedule[]>()
    schedules.forEach(schedule => {
      const date = safeToISODate(new Date(schedule.scheduledAt)) || ''
      if (!grouped.has(date)) {
        grouped.set(date, [])
      }
      grouped.get(date)!.push(schedule)
    })
    return grouped
  }, [schedules])

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Card>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <div className="flex gap-1">
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                          <Skeleton className="h-8 w-8 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const monthName = currentMonth.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/dashboard" label="Volver al Dashboard" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Calendario de Estudio
          </h1>
          <p className="text-muted-foreground mt-2">
            Planifica tus sesiones de estudio y mantén un hábito constante
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Sesión
          </Button>
          <HelpIcon content="Planifica tus sesiones de estudio para mantener un hábito constante. Puedes programar exámenes, prácticas, repasos y más." />
        </div>
      </div>

      {/* Month Navigation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={() => navigateMonth('prev')}>
              ← Anterior
            </Button>
            <CardTitle className="capitalize">{monthName}</CardTitle>
            <Button variant="outline" onClick={() => navigateMonth('next')}>
              Siguiente →
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No hay sesiones programadas para este mes
            </div>
          ) : (
            <div className="space-y-4">
              {Array.from(schedulesByDate.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([date, daySchedules]) => (
                  <div key={date} className="border rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">
                        {new Date(date).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {daySchedules.length} sesión{daySchedules.length !== 1 ? 'es' : ''}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {daySchedules.map(schedule => (
                        <Card key={schedule.id} className={schedule.completed ? 'opacity-60' : ''}>
                          <CardContent className="pt-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {getTypeIcon(schedule.type)}
                                  <CardTitle className="text-base">{schedule.title}</CardTitle>
                                  <Badge variant="outline">{getTypeLabel(schedule.type)}</Badge>
                                  {schedule.completed && (
                                    <Badge variant="default" className="bg-green-600">
                                      <CheckCircle2 className="h-3 w-3 mr-1" />
                                      Completada
                                    </Badge>
                                  )}
                                </div>
                                {schedule.description && (
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {schedule.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(schedule.scheduledAt).toLocaleTimeString('es-ES', {
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </div>
                                  <span>{schedule.durationMinutes} min</span>
                                  {schedule.topic && (
                                    <span>
                                      {schedule.topic.subject.nombre} • {schedule.topic.nombre}
                                    </span>
                                  )}
                                  {schedule.exam && (
                                    <span>
                                      {schedule.exam.subject.nombre} • {schedule.exam.titulo}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleToggleComplete(schedule)}
                                  title={
                                    schedule.completed
                                      ? 'Marcar como pendiente'
                                      : 'Marcar como completada'
                                  }
                                >
                                  <CheckCircle2
                                    className={`h-4 w-4 ${schedule.completed ? 'text-green-600' : ''}`}
                                  />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenDialog(schedule)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDelete(schedule.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSchedule ? 'Editar Sesión' : 'Nueva Sesión de Estudio'}
            </DialogTitle>
            <DialogDescription>
              {editingSchedule
                ? 'Modifica los detalles de tu sesión de estudio'
                : 'Planifica una nueva sesión de estudio'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={e => setFormTitle(e.target.value)}
                placeholder="Ej: Repaso de Matemáticas"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={e => setFormDescription(e.target.value)}
                placeholder="Notas adicionales sobre esta sesión..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduledAt">Fecha y Hora *</Label>
                <Input
                  id="scheduledAt"
                  type="datetime-local"
                  value={formScheduledAt}
                  onChange={e => setFormScheduledAt(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duración (minutos)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="480"
                  value={formDuration}
                  onChange={e => setFormDuration(parseInt(e.target.value) || 60)}
                />
              </div>
            </div>
            {!editingSchedule && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="type">Tipo de Sesión</Label>
                  <Select
                    value={formType}
                    onValueChange={v =>
                      setFormType(v as 'exam' | 'practice' | 'review' | 'flashcards' | 'custom')
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="custom">Personalizado</SelectItem>
                      <SelectItem value="exam">Examen</SelectItem>
                      <SelectItem value="practice">Práctica</SelectItem>
                      <SelectItem value="review">Repaso</SelectItem>
                      <SelectItem value="flashcards">Flashcards</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {(formType === 'practice' || formType === 'review') && (
                  <div className="space-y-2">
                    <Label htmlFor="topicId">Tema (opcional)</Label>
                    <Select value={formTopicId} onValueChange={setFormTopicId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tema" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {topics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {formType === 'exam' && (
                  <div className="space-y-2">
                    <Label htmlFor="examId">Examen (opcional)</Label>
                    <Select value={formExamId} onValueChange={setFormExamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un examen" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Ninguno</SelectItem>
                        {exams.map(exam => (
                          <SelectItem key={exam.id} value={exam.id}>
                            {exam.titulo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>{editingSchedule ? 'Actualizar' : 'Crear'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
