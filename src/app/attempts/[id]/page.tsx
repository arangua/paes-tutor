'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QuestionReview } from '@/components/question-review'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  CheckCircle2,
  XCircle,
  Circle,
  Clock,
  TrendingUp,
  TrendingDown,
  BookOpen,
  Loader2,
  AlertCircle,
  BarChart3,
  Target,
  Lightbulb,
  ArrowLeft,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'

interface Topic {
  id: string
  nombre: string
  ejeTematico: string
}

interface Question {
  id: string
  enunciado: string
  explicacion: string
  options: Array<{
    id: string
    letra: string
    texto: string
    esCorrecta: boolean
  }>
  topic: Topic | null
}

interface AttemptAnswer {
  id: string
  questionId: string
  optionSelectedId: string | null
  esCorrecta: boolean | null
  omitida: boolean
  question: Question
  optionSelected: {
    id: string
    letra: string
    texto: string
  } | null
}

interface Attempt {
  id: string
  estado: string
  porcentaje: number
  correctas: number
  incorrectas: number
  omitidas: number
  totalPreguntas: number
  puntajePaes: number | null
  puntajeEstimado: boolean
  duracionSegundos: number | null
  startedAt: string
  finishedAt: string | null
  exam: {
    id: string
    titulo: string
    subject: {
      nombre: string
      codigo: string
    }
  }
  answers: AttemptAnswer[]
}

interface PreviousAttempt {
  id: string
  porcentaje: number
  correctas: number
  totalPreguntas: number
  startedAt: string
  exam: {
    titulo: string
  }
}

export default function AttemptDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const attemptId = params.id as string

  const [attempt, setAttempt] = useState<Attempt | null>(null)
  const [previousAttempts, setPreviousAttempts] = useState<PreviousAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'topics'>('overview')

  useEffect(() => {
    async function loadData() {
      if (!attemptId || !/^c[a-z0-9]{24}$/.test(attemptId)) {
        setError('ID de intento inválido')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        // Cargar intento actual
        const attemptRes = await fetch(`/api/attempts/${attemptId}`)
        if (!attemptRes.ok) {
          throw new Error('Error al cargar el intento')
        }
        const attemptData = await attemptRes.json()
        setAttempt(attemptData)

        // Cargar intentos anteriores del mismo examen
        const attemptsRes = await fetch(`/api/attempts?limit=10`)
        if (attemptsRes.ok) {
          const attemptsData = await attemptsRes.json()
          const previous = attemptsData
            .filter(
              (a: Attempt) =>
                a.id !== attemptId && a.exam.id === attemptData.exam.id && a.estado === 'completado'
            )
            .slice(0, 5)
            .map((a: Attempt) => ({
              id: a.id,
              porcentaje: a.porcentaje,
              correctas: a.correctas,
              totalPreguntas: a.totalPreguntas,
              startedAt: a.startedAt,
              exam: a.exam,
            }))
          setPreviousAttempts(previous)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [attemptId])

  // Calcular estadísticas por tema
  const topicStats = () => {
    if (!attempt) return []

    const topicMap = new Map<string, { correct: number; total: number; nombre: string }>()

    attempt.answers.forEach(answer => {
      const topic = answer.question.topic
      if (!topic) return

      const key = topic.id
      if (!topicMap.has(key)) {
        topicMap.set(key, { correct: 0, total: 0, nombre: topic.nombre })
      }

      const stats = topicMap.get(key)!
      stats.total++
      if (answer.esCorrecta === true) {
        stats.correct++
      }
    })

    return Array.from(topicMap.entries())
      .map(([id, stats]) => ({
        id,
        nombre: stats.nombre,
        correctas: stats.correct,
        total: stats.total,
        porcentaje: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
      }))
      .sort((a, b) => b.porcentaje - a.porcentaje)
  }

  // Generar recomendaciones
  const generateRecommendations = () => {
    if (!attempt) return []

    const recommendations: string[] = []
    const stats = topicStats()
    const weakTopics = stats.filter(t => t.porcentaje < 50)

    if (weakTopics.length > 0) {
      recommendations.push(
        `Enfócate en estudiar: ${weakTopics
          .slice(0, 3)
          .map(t => t.nombre)
          .join(', ')}`
      )
    }

    if (attempt.omitidas > attempt.totalPreguntas * 0.2) {
      recommendations.push(
        `Tienes ${attempt.omitidas} preguntas omitidas. Intenta responder todas las preguntas, incluso si no estás seguro.`
      )
    }

    if (attempt.porcentaje < 50) {
      recommendations.push(
        'Tu puntaje está por debajo del 50%. Considera revisar los temas fundamentales antes de intentar otro examen.'
      )
    } else if (attempt.porcentaje >= 70) {
      recommendations.push('¡Excelente trabajo! Continúa practicando para mantener este nivel.')
    }

    const incorrectCount = attempt.incorrectas
    if (incorrectCount > 0) {
      recommendations.push(
        `Revisa las ${incorrectCount} preguntas incorrectas y estudia sus explicaciones.`
      )
    }

    return recommendations
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getScoreColor = (porcentaje: number) => {
    if (porcentaje >= 70) return 'text-green-600'
    if (porcentaje >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando detalles del intento...</p>
        </div>
      </div>
    )
  }

  if (error || !attempt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudo cargar el intento'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const stats = topicStats()
  const recommendations = generateRecommendations()
  const pieData = [
    { name: 'Correctas', value: attempt.correctas, color: '#22c55e' },
    { name: 'Incorrectas', value: attempt.incorrectas, color: '#ef4444' },
    { name: 'Omitidas', value: attempt.omitidas, color: '#eab308' },
  ]

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Detalles del Intento' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <h1 className="text-3xl font-bold">{attempt.exam.titulo}</h1>
          <p className="text-muted-foreground">{attempt.exam.subject.nombre}</p>
        </div>
        <Badge variant={attempt.estado === 'completado' ? 'default' : 'secondary'}>
          {attempt.estado}
        </Badge>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 border-b">
        <Button
          variant={activeTab === 'overview' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('overview')}
        >
          <BarChart3 className="h-4 w-4 mr-2" />
          Resumen
        </Button>
        <Button
          variant={activeTab === 'questions' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('questions')}
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Preguntas ({attempt.totalPreguntas})
        </Button>
        <Button
          variant={activeTab === 'topics' ? 'default' : 'ghost'}
          onClick={() => setActiveTab('topics')}
        >
          <Target className="h-4 w-4 mr-2" />
          Temas
        </Button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Puntaje</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${getScoreColor(attempt.porcentaje)}`}>
                  {attempt.porcentaje.toFixed(1)}%
                </div>
                {attempt.puntajePaes && (
                  <p className="text-sm text-muted-foreground mt-1">
                    PAES: {attempt.puntajePaes}
                    {attempt.puntajeEstimado && ' (estimado)'}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Correctas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {attempt.correctas} / {attempt.totalPreguntas}
                </div>
                <Progress
                  value={(attempt.correctas / attempt.totalPreguntas) * 100}
                  className="mt-2"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Duración</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold flex items-center gap-2">
                  <Clock className="h-6 w-6" />
                  {formatDuration(attempt.duracionSegundos)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Fecha</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-medium">
                  {new Date(attempt.finishedAt || attempt.startedAt).toLocaleDateString('es-CL', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de distribución */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Respuestas</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Comparación con intentos anteriores */}
            {previousAttempts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Comparación con Intentos Anteriores</CardTitle>
                  <CardDescription>Mismo examen</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      data={[
                        ...previousAttempts.map(a => ({
                          name: new Date(a.startedAt).toLocaleDateString('es-CL', {
                            month: 'short',
                            day: 'numeric',
                          }),
                          porcentaje: a.porcentaje,
                          tipo: 'Anterior',
                        })),
                        {
                          name: 'Este intento',
                          porcentaje: attempt.porcentaje,
                          tipo: 'Actual',
                        },
                      ].reverse()}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip
                        formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`}
                      />
                      <Bar dataKey="porcentaje" fill="#3b82f6">
                        {previousAttempts.map((_, index) => (
                          <Cell key={`cell-${index}`} fill="#94a3b8" />
                        ))}
                        <Cell fill="#3b82f6" />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  {previousAttempts.length > 0 && (
                    <div className="mt-4 flex items-center gap-2">
                      {attempt.porcentaje > previousAttempts[0].porcentaje ? (
                        <>
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-600">
                            Mejoraste{' '}
                            {(attempt.porcentaje - previousAttempts[0].porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </>
                      ) : attempt.porcentaje < previousAttempts[0].porcentaje ? (
                        <>
                          <TrendingDown className="h-4 w-4 text-red-600" />
                          <span className="text-sm text-red-600">
                            Disminuiste{' '}
                            {(previousAttempts[0].porcentaje - attempt.porcentaje).toFixed(1)}%
                            respecto a tu último intento
                          </span>
                        </>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          Mismo rendimiento que tu último intento
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Recomendaciones */}
          {recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendaciones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Questions Tab */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          {attempt.answers.map((answer, index) => (
            <QuestionReview key={answer.id} answer={answer} index={index} showTopic={true} />
          ))}
        </div>
      )}

      {/* Topics Tab */}
      {activeTab === 'topics' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Tema</CardTitle>
              <CardDescription>Análisis de tu desempeño en cada tema del examen</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.length > 0 ? (
                <div className="space-y-4">
                  {stats.map(topic => (
                    <div key={topic.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{topic.nombre}</p>
                          <p className="text-sm text-muted-foreground">
                            {topic.correctas} de {topic.total} correctas
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${getScoreColor(topic.porcentaje)}`}>
                            {topic.porcentaje.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Progress value={topic.porcentaje} className="h-2" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  No hay información de temas disponible para este examen.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de temas */}
          {stats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Gráfico de Rendimiento por Tema</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={stats} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="nombre" type="category" width={150} />
                    <Tooltip
                      formatter={(value: number | undefined) => `${(value ?? 0).toFixed(1)}%`}
                    />
                    <Bar dataKey="porcentaje" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
