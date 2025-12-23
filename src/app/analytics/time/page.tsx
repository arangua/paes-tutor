'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Clock, TrendingUp, BookOpen, Target, BarChart3, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'

interface SubjectStat {
  subjectId: string
  subjectName: string
  subjectCode: string
  totalTime: number
  count: number
  averageTime: number
  averageCorrectTime: number
  averageIncorrectTime: number
  correctCount: number
  incorrectCount: number
}

interface TopicStat {
  topicId: string
  topicName: string
  ejeTematico: string
  subjectName: string
  subjectCode: string
  totalTime: number
  count: number
  averageTime: number
  averageCorrectTime: number
  averageIncorrectTime: number
  correctCount: number
  incorrectCount: number
}

interface DifficultyStat {
  difficulty: number
  totalTime: number
  count: number
  averageTime: number
  averageCorrectTime: number
  averageIncorrectTime: number
  correctCount: number
  incorrectCount: number
}

interface TypeStat {
  exam: {
    totalTime: number
    count: number
    averageTime: number
  }
  practice: {
    totalTime: number
    count: number
    averageTime: number
  }
}

export default function TimeStatsPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [overall, setOverall] = useState<{
    totalTime: number
    totalCount: number
    averageTime: number
  } | null>(null)
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [topicStats, setTopicStats] = useState<TopicStat[]>([])
  const [difficultyStats, setDifficultyStats] = useState<DifficultyStat[]>([])
  const [typeStats, setTypeStats] = useState<TypeStat | null>(null)

  useEffect(() => {
    loadTimeStats()
  }, [])

  async function loadTimeStats() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/analytics/time')
      if (!res.ok) throw new Error('Error al cargar estadísticas de tiempo')
      const data = await res.json()

      setOverall(data.overall)
      setSubjectStats(data.bySubject || [])
      setTopicStats(data.byTopic || [])
      setDifficultyStats(data.byDifficulty || [])
      setTypeStats(data.byType || null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar estadísticas de tiempo')
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(0)}s`
    }
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}m ${secs}s`
  }

  const formatTimeShort = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds.toFixed(1)}s`
    }
    return `${(seconds / 60).toFixed(1)}m`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
            <div className="absolute inset-0 h-12 w-12 mx-auto">
              <div className="h-full w-full border-4 border-blue-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando estadísticas...
            </p>
            <p className="text-sm text-muted-foreground">Analizando tus tiempos de respuesta</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="relative inline-block">
                <Clock className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{error}</h3>
                <p className="text-muted-foreground">
                  No hay datos de tiempo disponibles. Completa algunos exámenes o prácticas para ver
                  estadísticas.
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/exams"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Explorar exámenes disponibles
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/analytics" label="Volver a Analytics" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Clock className="h-8 w-8" />
            Estadísticas de Tiempo
          </h1>
          <p className="text-muted-foreground mt-2">
            Analiza cuánto tiempo dedicas a cada tipo de pregunta
          </p>
        </div>
        <HelpIcon content="Estas estadísticas muestran el tiempo promedio que dedicas a responder preguntas, desglosado por asignatura, tema, dificultad y tipo de sesión (examen vs práctica)." />
      </div>

      {/* Overall Stats */}
      {overall && overall.totalCount > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Clock className="h-4 w-4" />
                Tiempo Promedio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-blue-900 dark:text-blue-100">
                {formatTime(overall.averageTime)}
              </div>
              <p className="text-xs text-muted-foreground">Por pregunta</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-green-700 dark:text-green-400">
                <Target className="h-4 w-4" />
                Total de Preguntas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-green-900 dark:text-green-100">
                {overall.totalCount}
              </div>
              <p className="text-xs text-muted-foreground">Con tiempo registrado</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-950/30 dark:to-purple-900/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2 text-purple-700 dark:text-purple-400">
                <TrendingUp className="h-4 w-4" />
                Tiempo Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2 text-purple-900 dark:text-purple-100">
                {formatTime(overall.totalTime)}
              </div>
              <p className="text-xs text-muted-foreground">Acumulado</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Type Comparison */}
      {typeStats && (
        <Card>
          <CardHeader>
            <CardTitle>Comparación: Examen vs Práctica</CardTitle>
            <CardDescription>
              Tiempo promedio en exámenes versus sesiones de práctica
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Exámenes</span>
                  <Badge variant="outline">{typeStats.exam.count} preguntas</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatTime(typeStats.exam.averageTime)}
                </div>
                <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
              </div>
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Práctica</span>
                  <Badge variant="outline">{typeStats.practice.count} preguntas</Badge>
                </div>
                <div className="text-2xl font-bold mb-1">
                  {formatTime(typeStats.practice.averageTime)}
                </div>
                <p className="text-sm text-muted-foreground">Tiempo promedio por pregunta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="subject" className="space-y-4">
        <TabsList>
          <TabsTrigger value="subject">Por Asignatura</TabsTrigger>
          <TabsTrigger value="topic">Por Tema</TabsTrigger>
          <TabsTrigger value="difficulty">Por Dificultad</TabsTrigger>
        </TabsList>

        <TabsContent value="subject" className="space-y-4">
          {subjectStats.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-3">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">
                    No hay datos disponibles por asignatura
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Completa más exámenes para ver estadísticas detalladas
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {subjectStats.map((stat, index) => (
                <Card
                  key={stat.subjectId}
                  className="hover:shadow-md transition-all duration-300 border-l-4 border-l-blue-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stat.subjectName}</CardTitle>
                        <CardDescription>{stat.subjectCode}</CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="topic" className="space-y-4">
          {topicStats.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-3">
                  <Target className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">
                    No hay datos disponibles por tema
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Completa más exámenes para ver estadísticas detalladas
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {topicStats.slice(0, 10).map((stat, index) => (
                <Card
                  key={stat.topicId}
                  className="hover:shadow-md transition-all duration-300 border-l-4 border-l-green-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{stat.topicName}</CardTitle>
                        <CardDescription>
                          {stat.subjectName} • {stat.ejeTematico}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="difficulty" className="space-y-4">
          {difficultyStats.length === 0 ? (
            <Card className="border-2 border-dashed">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="space-y-3">
                  <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground/40" />
                  <p className="text-muted-foreground font-medium">
                    No hay datos disponibles por dificultad
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    Completa más exámenes para ver estadísticas detalladas
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {difficultyStats.map((stat, index) => (
                <Card
                  key={stat.difficulty}
                  className="hover:shadow-md transition-all duration-300 border-l-4 border-l-purple-500"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">Dificultad {stat.difficulty}/5</CardTitle>
                        <CardDescription>Nivel de dificultad de las preguntas</CardDescription>
                      </div>
                      <Badge variant="outline">{stat.count} preguntas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Tiempo Promedio</p>
                        <p className="text-xl font-bold">{formatTime(stat.averageTime)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Correctas</p>
                        <p className="text-xl font-bold text-green-600">
                          {formatTime(stat.averageCorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.correctCount} preguntas
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Incorrectas</p>
                        <p className="text-xl font-bold text-red-600">
                          {formatTime(stat.averageIncorrectTime)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.incorrectCount} preguntas
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
