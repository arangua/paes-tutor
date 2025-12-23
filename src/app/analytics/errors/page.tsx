'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Target,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'

interface ErrorAnalysis {
  summary: {
    totalErrors: number
    uniqueQuestions: number
    topicsAffected: number
    trend: 'mejorando' | 'empeorando' | 'estable'
    recentErrorRate: number
    olderErrorRate: number
  }
  topErrors: Array<{
    questionId: string
    enunciado: string
    topicName: string | null
    subjectName: string
    errorCount: number
  }>
  errorsByTopic: Array<{
    topicId: string
    topicName: string
    ejeTematico: string
    subjectName: string
    subjectCode: string
    errorCount: number
  }>
  errorsBySubject: Array<{
    subjectId: string
    subjectName: string
    subjectCode: string
    errorCount: number
    topicCount: number
  }>
}

export default function ErrorAnalysisPage() {
  const [data, setData] = useState<ErrorAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadErrorAnalysis()
  }, [])

  async function loadErrorAnalysis() {
    try {
      setLoading(true)
      const res = await fetch('/api/analytics/errors')
      if (!res.ok) throw new Error('Error al cargar análisis de errores')
      const analysisData = await res.json()
      setData(analysisData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar análisis de errores')
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'mejorando':
        return <TrendingDown className="h-5 w-5 text-green-600" />
      case 'empeorando':
        return <TrendingUp className="h-5 w-5 text-red-600" />
      default:
        return <Minus className="h-5 w-5 text-yellow-600" />
    }
  }

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'mejorando':
        return 'text-green-600'
      case 'empeorando':
        return 'text-red-600'
      default:
        return 'text-yellow-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-orange-50/50 via-white to-red-50/50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-orange-600 mx-auto" />
            <div className="absolute inset-0 h-12 w-12 mx-auto">
              <div className="h-full w-full border-4 border-orange-200 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Analizando errores...
            </p>
            <p className="text-sm text-muted-foreground">
              Identificando patrones y áreas de mejora
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-4 max-w-md mx-auto">
              <div className="relative inline-block">
                <AlertTriangle className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertTriangle className="h-10 w-10 text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-destructive">
                  {error || 'No se pudo cargar el análisis'}
                </h3>
                <p className="text-muted-foreground">
                  Intenta nuevamente o completa algunos exámenes para generar datos de análisis.
                </p>
              </div>
              <div className="pt-4">
                <a
                  href="/exams"
                  className="inline-flex items-center gap-2 text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
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

  const maxErrorCount = Math.max(
    ...data.errorsByTopic.map(t => t.errorCount),
    ...data.errorsBySubject.map(s => s.errorCount),
    1
  )

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/analytics" label="Volver a Analytics" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-8 w-8 text-orange-600" />
            Análisis de Errores
          </h1>
          <p className="text-muted-foreground mt-2">
            Identifica patrones y temas problemáticos en tu rendimiento
          </p>
        </div>
        <HelpIcon content="Este análisis te ayuda a identificar tus áreas débiles. Revisa los temas y preguntas donde más fallas para enfocar tu estudio." />
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Total de Errores
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-900 dark:text-red-100">
              {data.summary.totalErrors}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.uniqueQuestions} preguntas únicas
            </p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-950/30 dark:to-orange-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-400 flex items-center gap-2">
              <Target className="h-4 w-4" />
              Temas Afectados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-orange-900 dark:text-orange-100">
              {data.summary.topicsAffected}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-yellow-50 to-yellow-100/50 dark:from-yellow-950/30 dark:to-yellow-900/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-400 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Tasa de Error Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-900 dark:text-yellow-100">
              {data.summary.recentErrorRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Últimos 30 días</p>
          </CardContent>
        </Card>

        <Card
          className={`border-2 hover:shadow-lg transition-all duration-300 bg-gradient-to-br ${
            data.summary.trend === 'mejorando'
              ? 'from-green-50 to-green-100/50 dark:from-green-950/30 dark:to-green-900/20'
              : data.summary.trend === 'empeorando'
                ? 'from-red-50 to-red-100/50 dark:from-red-950/30 dark:to-red-900/20'
                : 'from-blue-50 to-blue-100/50 dark:from-blue-950/30 dark:to-blue-900/20'
          }`}
        >
          <CardHeader className="pb-3">
            <CardTitle
              className={`text-sm font-medium flex items-center gap-2 ${
                data.summary.trend === 'mejorando'
                  ? 'text-green-700 dark:text-green-400'
                  : data.summary.trend === 'empeorando'
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-blue-700 dark:text-blue-400'
              }`}
            >
              Tendencia
              {getTrendIcon(data.summary.trend)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-4xl font-bold capitalize ${
                data.summary.trend === 'mejorando'
                  ? 'text-green-900 dark:text-green-100'
                  : data.summary.trend === 'empeorando'
                    ? 'text-red-900 dark:text-red-100'
                    : 'text-blue-900 dark:text-blue-100'
              }`}
            >
              {data.summary.trend}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.summary.recentErrorRate < data.summary.olderErrorRate
                ? 'Mejor que antes'
                : data.summary.recentErrorRate > data.summary.olderErrorRate
                  ? 'Peor que antes'
                  : 'Sin cambios'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="top-errors" className="space-y-4">
        <TabsList>
          <TabsTrigger value="top-errors">Top 10 Errores</TabsTrigger>
          <TabsTrigger value="by-topic">Por Tema</TabsTrigger>
          <TabsTrigger value="by-subject">Por Asignatura</TabsTrigger>
        </TabsList>

        <TabsContent value="top-errors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Top 10 Preguntas Más Falladas
              </CardTitle>
              <CardDescription>Estas son las preguntas que has fallado más veces</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topErrors.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                      <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-lg font-semibold text-green-700 dark:text-green-400">
                      ¡Excelente!
                    </p>
                    <p className="text-muted-foreground">
                      No tienes errores registrados. Sigue así.
                    </p>
                  </div>
                ) : (
                  data.topErrors.map((error, index) => (
                    <div
                      key={error.questionId}
                      className="flex items-start gap-4 p-4 border rounded-lg hover:shadow-md transition-all duration-300 border-l-4 border-l-red-500"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/30 dark:to-red-800/30 flex items-center justify-center shadow-sm">
                        <span className="font-bold text-red-700 dark:text-red-400">
                          {index + 1}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{error.subjectName}</Badge>
                          {error.topicName && <Badge variant="secondary">{error.topicName}</Badge>}
                          <Badge variant="destructive" className="ml-auto">
                            {error.errorCount} vez{error.errorCount !== 1 ? 'es' : ''}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed">{error.enunciado}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-topic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Errores por Tema
              </CardTitle>
              <CardDescription>Distribución de errores agrupados por tema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.errorsByTopic.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30">
                      <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      No hay errores por tema para mostrar
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Completa más exámenes para ver estadísticas detalladas
                    </p>
                  </div>
                ) : (
                  data.errorsByTopic.map(topic => (
                    <div key={topic.topicId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{topic.topicName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {topic.subjectName} • {topic.ejeTematico}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {topic.errorCount} error{topic.errorCount !== 1 ? 'es' : ''}
                        </Badge>
                      </div>
                      <Progress value={(topic.errorCount / maxErrorCount) * 100} className="h-2" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="by-subject" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Errores por Asignatura
              </CardTitle>
              <CardDescription>Distribución de errores agrupados por asignatura</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.errorsBySubject.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <Target className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-lg font-semibold text-muted-foreground">
                      No hay errores por asignatura para mostrar
                    </p>
                    <p className="text-sm text-muted-foreground/70">
                      Completa más exámenes para ver estadísticas detalladas
                    </p>
                  </div>
                ) : (
                  data.errorsBySubject.map(subject => (
                    <div key={subject.subjectId} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{subject.subjectName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subject.topicCount} tema{subject.topicCount !== 1 ? 's' : ''} afectado
                            {subject.topicCount !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <Badge variant="destructive">
                          {subject.errorCount} error{subject.errorCount !== 1 ? 'es' : ''}
                        </Badge>
                      </div>
                      <Progress
                        value={(subject.errorCount / maxErrorCount) * 100}
                        className="h-2"
                      />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
