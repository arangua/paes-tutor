'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { safeRound } from '@/app/api/notes/versions/validation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  Calendar,
  AlertCircle,
  Clock,
  BookOpen,
  PlayCircle,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { SubjectIcon } from '@/lib/subject-icons'
import { validateIdParam } from '@/lib/validation-helpers'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import Link from 'next/link'

interface TopicInfo {
  id: string
  nombre: string
  ejeTematico: string
  subject: {
    id: string
    nombre: string
    codigo: string
  }
}

interface Score {
  id: string
  type: 'practice' | 'exam'
  porcentaje: number
  correctas: number
  totalPreguntas: number
  fecha: string
  finishedAt: string | null
  duracionSegundos?: number | null
}

interface TopicHistory {
  topic: TopicInfo
  scores: Score[]
  summary: {
    totalSessions: number
    totalAttempts: number
    totalActivities: number
    avgScore: number
    bestScore: number
    worstScore: number
    trend: 'improving' | 'declining' | 'stable'
  }
  period: {
    days: number
    startDate: string
    endDate: string
  }
}

export default function TopicHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const topicId = params.topicId as string
  const [days, setDays] = useState(parseInt(searchParams.get('days') || '30', 10))

  const [history, setHistory] = useState<TopicHistory | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!validateIdParam(topicId)) {
      setError('ID de tema inválido')
      setIsLoading(false)
      return
    }

    async function loadHistory() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(`/api/practice/topic-history?topicId=${topicId}&days=${days}`)
        if (!res.ok) {
          throw new Error('Error al cargar historial')
        }
        const data = await res.json()
        setHistory(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadHistory()
  }, [topicId, days])

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-5 w-5 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-gray-600" />
    }
  }

  const getTrendLabel = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return 'Mejorando'
      case 'declining':
        return 'En declive'
      default:
        return 'Estable'
    }
  }

  // Preparar datos para el gráfico
  const chartData = history?.scores.map((score, index) => ({
    fecha: new Date(score.fecha).toLocaleDateString('es-CL', {
      month: 'short',
      day: 'numeric',
    }),
    porcentaje: safeRound(score.porcentaje, 1),
    tipo: score.type === 'practice' ? 'Práctica' : 'Examen',
    index,
  }))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando historial...
            </p>
            <p className="text-sm text-muted-foreground">Analizando tu progreso en este tema</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !history) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Práctica', href: '/practice' },
            { label: 'Historial' },
          ]}
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudo cargar el historial'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => router.push('/practice')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Práctica
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Práctica', href: '/practice' },
            { label: history.topic.nombre },
            { label: 'Historial' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            {history.topic.subject && (
              <SubjectIcon codigo={history.topic.subject.codigo} size={24} />
            )}
            <h1 className="text-3xl font-bold">Historial de Progreso</h1>
          </div>
          <p className="text-muted-foreground">
            {history.topic.nombre} • {history.topic.subject.nombre}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{history.topic.ejeTematico}</p>
        </div>
        <div className="flex gap-2">
          <Select
            value={days.toString()}
            onValueChange={val => {
              const newDays = parseInt(val, 10)
              setDays(newDays)
              router.replace(`/practice/${topicId}/history?days=${newDays}`, { scroll: false })
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="60">Últimos 60 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
              <SelectItem value="180">Últimos 6 meses</SelectItem>
              <SelectItem value="365">Último año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" asChild>
            <Link href={`/practice/${topicId}`}>
              <PlayCircle className="h-4 w-4 mr-2" />
              Practicar
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Promedio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{history.summary.avgScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Rendimiento promedio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Mejor Puntaje</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {history.summary.bestScore.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Mejor rendimiento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tendencia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {getTrendIcon(history.summary.trend)}
              <div className="text-2xl font-bold">{getTrendLabel(history.summary.trend)}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">En los últimos {days} días</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Actividades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{history.summary.totalActivities}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {history.summary.totalSessions} prácticas • {history.summary.totalAttempts} exámenes
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Progreso */}
      {history.scores.length > 0 ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Evolución del Rendimiento
            </CardTitle>
            <CardDescription>
              Progreso en {history.topic.nombre} durante los últimos {days} días
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="fecha"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval="preserveStartEnd"
                />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  labelFormatter={label => `Fecha: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="porcentaje"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Rendimiento (%)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : (
        <Card className="mb-6">
          <CardContent className="py-12 text-center">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              No hay datos de progreso para este tema en el período seleccionado
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Comienza a practicar este tema para ver tu progreso aquí
            </p>
            <Button asChild className="mt-4">
              <Link href={`/practice/${topicId}`}>
                <PlayCircle className="h-4 w-4 mr-2" />
                Comenzar a Practicar
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Lista de Actividades */}
      {history.scores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Actividades Recientes
            </CardTitle>
            <CardDescription>
              Historial detallado de prácticas y exámenes en este tema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {history.scores
                .slice()
                .reverse()
                .map(score => {
                  const performanceBadge =
                    score.porcentaje >= 70
                      ? { variant: 'default' as const, label: 'Excelente' }
                      : score.porcentaje >= 50
                        ? { variant: 'secondary' as const, label: 'Bueno' }
                        : { variant: 'destructive' as const, label: 'Necesita Mejora' }

                  return (
                    <div
                      key={score.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex-shrink-0">
                          {score.type === 'practice' ? (
                            <PlayCircle className="h-5 w-5 text-blue-600" />
                          ) : (
                            <BookOpen className="h-5 w-5 text-purple-600" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">
                              {score.type === 'practice' ? 'Sesión de Práctica' : 'Examen'}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {new Date(score.fecha).toLocaleDateString('es-CL', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>
                              {score.correctas} / {score.totalPreguntas} correctas
                            </span>
                            {score.duracionSegundos && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {Math.floor(score.duracionSegundos / 60)}m{' '}
                                {score.duracionSegundos % 60}s
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              score.porcentaje >= 70
                                ? 'text-green-600'
                                : score.porcentaje >= 50
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                            }`}
                          >
                            {score.porcentaje.toFixed(1)}%
                          </div>
                          <Badge variant={performanceBadge.variant} className="text-xs mt-1">
                            {performanceBadge.label}
                          </Badge>
                        </div>
                        {score.type === 'practice' && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/practice/${topicId}/results?sessionId=${score.id}`}>
                              Ver Detalles
                            </Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
