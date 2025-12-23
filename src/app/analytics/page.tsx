'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { TrendChart } from '@/components/analytics/trend-chart'
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Target,
  AlertCircle,
  Loader2,
  BarChart3,
  Award,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Printer,
  AlertTriangle,
  Clock,
} from 'lucide-react'
import { ExportButton } from '@/components/export/export-button'
import {
  exportAnalyticsToPDF,
  exportAnalyticsToExcel,
  type AnalyticsData,
} from '@/lib/export-utils'
import { toast } from 'sonner'
import Link from 'next/link'

interface TrendData {
  date: string
  percentage: number
  examTitle: string
  subjectName: string
}

interface StrengthWeakness {
  topic: string
  subject: string
  percentage: number
  totalQuestions: number
  category: 'strength' | 'weakness' | 'average'
}

interface PAESPrediction {
  predictedScore: number
  confidence: 'high' | 'medium' | 'low'
  factors: string[]
  estimatedRange: {
    min: number
    max: number
  }
}

interface ComparisonData {
  studentAverage: number
  overallAverage: number
  percentile: number
  comparison: 'above' | 'below' | 'equal'
}

interface SubjectBreakdown {
  subject: string
  average: number
  trend: 'improving' | 'declining' | 'stable'
  attempts: number
}

interface AdvancedAnalytics {
  trends: TrendData[]
  strengths: StrengthWeakness[]
  weaknesses: StrengthWeakness[]
  paesPrediction: PAESPrediction | null
  comparison: ComparisonData | null
  subjectBreakdown: SubjectBreakdown[]
}

export default function AnalyticsPage() {
  const router = useRouter()
  const [analytics, setAnalytics] = useState<AdvancedAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch('/api/analytics')

        if (res.status === 401) {
          router.push('/auth/signin?callbackUrl=/analytics')
          return
        }

        if (!res.ok) {
          throw new Error('Error al cargar estadísticas')
        }

        const data = await res.json()
        setAnalytics(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando estadísticas...</p>
        </div>
      </div>
    )
  }

  if (error || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudieron cargar las estadísticas'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/dashboard')}>Volver al Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  const prepareExportData = (): AnalyticsData | null => {
    if (!analytics) return null

    return {
      studentAverage: analytics.comparison?.studentAverage || 0,
      overallAverage: analytics.comparison?.overallAverage || 0,
      percentile: analytics.comparison?.percentile || 0,
      paesPrediction: analytics.paesPrediction
        ? {
            predictedScore: analytics.paesPrediction.predictedScore,
            confidence: analytics.paesPrediction.confidence,
            estimatedRange: analytics.paesPrediction.estimatedRange,
          }
        : {
            predictedScore: 0,
            confidence: 'low',
            estimatedRange: { min: 0, max: 0 },
          },
      trends: analytics.trends.map(t => ({
        date: t.date,
        percentage: t.percentage,
        examTitle: t.examTitle,
      })),
      strengths: analytics.strengths.map(s => ({
        topic: s.topic,
        percentage: s.percentage,
      })),
      weaknesses: analytics.weaknesses.map(w => ({
        topic: w.topic,
        percentage: w.percentage,
      })),
      subjectBreakdown: analytics.subjectBreakdown.map(s => ({
        subject: s.subject,
        average: s.average,
        attempts: s.attempts,
        trend: s.trend,
      })),
    }
  }

  const handleExportPDF = async () => {
    const data = prepareExportData()
    if (!data) {
      toast.error('No hay datos disponibles', {
        description:
          'No se encontraron estadísticas para exportar. Completa más exámenes para generar datos.',
      })
      return
    }
    try {
      toast.loading('Exportando estadísticas a PDF...', { id: 'export-analytics-pdf' })
      await exportAnalyticsToPDF(data)
      toast.success('Exportación exitosa', {
        id: 'export-analytics-pdf',
        description: 'El archivo PDF con tus estadísticas se ha descargado correctamente.',
      })
    } catch (error) {
      toast.error('Error al exportar', {
        id: 'export-analytics-pdf',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar el archivo PDF. Por favor, intenta nuevamente.',
      })
    }
  }

  const handleExportExcel = async () => {
    const data = prepareExportData()
    if (!data) {
      toast.error('No hay datos disponibles', {
        description:
          'No se encontraron estadísticas para exportar. Completa más exámenes para generar datos.',
      })
      return
    }
    try {
      toast.loading('Exportando estadísticas a Excel...', { id: 'export-analytics-excel' })
      await exportAnalyticsToExcel(data)
      toast.success('Exportación exitosa', {
        id: 'export-analytics-excel',
        description: 'El archivo Excel con tus estadísticas se ha descargado correctamente.',
      })
    } catch (error) {
      toast.error('Error al exportar', {
        id: 'export-analytics-excel',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar el archivo Excel. Por favor, intenta nuevamente.',
      })
    }
  }

  const getTrendIcon = (trend: 'improving' | 'declining' | 'stable') => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default:
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
  }

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          .print-break {
            page-break-after: always;
          }
          .print-avoid-break {
            page-break-inside: avoid;
          }
        }
      `}</style>
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="mb-6 no-print">
          <Breadcrumbs
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Dashboard', href: '/dashboard' },
              { label: 'Estadísticas Avanzadas' },
            ]}
          />
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 no-print">
          <Card className="border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-6 w-6 text-orange-600" />
                  <div>
                    <h3 className="font-semibold">Análisis de Errores</h3>
                    <p className="text-sm text-muted-foreground">
                      Identifica patrones y temas problemáticos
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics/errors">
                    Ver
                    <AlertTriangle className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <div>
                    <h3 className="font-semibold">Comparación Anónima</h3>
                    <p className="text-sm text-muted-foreground">
                      Compara tu rendimiento con otros estudiantes
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics/comparison">
                    Ver
                    <BarChart3 className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-950/20 dark:border-purple-900">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-6 w-6 text-purple-600" />
                  <div>
                    <h3 className="font-semibold">Estadísticas de Tiempo</h3>
                    <p className="text-sm text-muted-foreground">
                      Tiempo promedio por tipo de pregunta
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/analytics/time">
                    Ver
                    <Clock className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 no-print">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
            <h1 className="text-3xl font-bold">Estadísticas Avanzadas</h1>
            <p className="text-muted-foreground">
              Análisis profundo de tu rendimiento y predicciones
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="no-print">
              <Printer className="h-4 w-4 mr-2" />
              Imprimir
            </Button>
            <ExportButton
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              variant="outline"
            />
          </div>
        </div>

        {/* Comparación con Promedio */}
        {analytics.comparison && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Comparación con Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Tu Promedio</p>
                  <p className="text-3xl font-bold">
                    {analytics.comparison.studentAverage.toFixed(1)}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Promedio General</p>
                  <p className="text-3xl font-bold text-muted-foreground">
                    {analytics.comparison.overallAverage}%
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Percentil</p>
                  <p className="text-3xl font-bold">
                    {analytics.comparison.percentile}
                    <span className="text-lg text-muted-foreground">º</span>
                  </p>
                  <Badge
                    variant={
                      analytics.comparison.comparison === 'above'
                        ? 'default'
                        : analytics.comparison.comparison === 'below'
                          ? 'destructive'
                          : 'secondary'
                    }
                    className="mt-2"
                  >
                    {analytics.comparison.comparison === 'above'
                      ? 'Por encima del promedio'
                      : analytics.comparison.comparison === 'below'
                        ? 'Por debajo del promedio'
                        : 'En el promedio'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gráfico de Tendencias */}
        <div className="mb-6">
          <TrendChart data={analytics.trends} />
        </div>

        {/* Predicción PAES */}
        {analytics.paesPrediction && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Predicción de Puntaje PAES
              </CardTitle>
              <CardDescription>Estimación basada en tu rendimiento histórico</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center p-6 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Puntaje Predicho</p>
                  <p className="text-5xl font-bold mb-2">
                    {analytics.paesPrediction.predictedScore}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Rango estimado: {analytics.paesPrediction.estimatedRange.min} -{' '}
                    {analytics.paesPrediction.estimatedRange.max} puntos
                  </p>
                  <Badge
                    className={`mt-3 ${getConfidenceColor(analytics.paesPrediction.confidence)}`}
                  >
                    Confianza:{' '}
                    {analytics.paesPrediction.confidence === 'high'
                      ? 'Alta'
                      : analytics.paesPrediction.confidence === 'medium'
                        ? 'Media'
                        : 'Baja'}
                  </Badge>
                </div>

                {analytics.paesPrediction.factors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Factores Considerados:</p>
                    <ul className="space-y-1">
                      {analytics.paesPrediction.factors.map((factor, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Fortalezas y Debilidades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Fortalezas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Fortalezas
              </CardTitle>
              <CardDescription>Temas donde tienes mejor rendimiento (≥70%)</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.strengths.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aún no hay fortalezas identificadas
                </p>
              ) : (
                <div className="space-y-3">
                  {analytics.strengths.slice(0, 5).map((strength, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{strength.topic}</p>
                          <p className="text-xs text-muted-foreground">{strength.subject}</p>
                        </div>
                        <Badge variant="default" className="bg-green-600">
                          {strength.percentage.toFixed(1)}%
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {strength.totalQuestions} preguntas respondidas
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Debilidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Debilidades
              </CardTitle>
              <CardDescription>Temas que necesitas reforzar (&lt;50%)</CardDescription>
            </CardHeader>
            <CardContent>
              {analytics.weaknesses.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  ¡Excelente! No hay debilidades identificadas
                </p>
              ) : (
                <div className="space-y-3">
                  {analytics.weaknesses.slice(0, 5).map((weakness, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                    >
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{weakness.topic}</p>
                          <p className="text-xs text-muted-foreground">{weakness.subject}</p>
                        </div>
                        <Badge variant="destructive">{weakness.percentage.toFixed(1)}%</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {weakness.totalQuestions} preguntas respondidas
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Desglose por Asignatura */}
        {analytics.subjectBreakdown.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Desglose por Asignatura
              </CardTitle>
              <CardDescription>Rendimiento y tendencias por materia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.subjectBreakdown.map((subject, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{subject.subject}</h3>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{subject.average}%</p>
                        <p className="text-xs text-muted-foreground">
                          {subject.attempts} intento{subject.attempts !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        subject.trend === 'improving'
                          ? 'default'
                          : subject.trend === 'declining'
                            ? 'destructive'
                            : 'secondary'
                      }
                      className="text-xs"
                    >
                      {subject.trend === 'improving'
                        ? 'Mejorando'
                        : subject.trend === 'declining'
                          ? 'En declive'
                          : 'Estable'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mensaje si no hay datos suficientes */}
        {analytics.trends.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-4">
                Necesitas completar más exámenes para ver estadísticas avanzadas
              </p>
              <Button asChild>
                <Link href="/exams">Realizar Exámenes</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
