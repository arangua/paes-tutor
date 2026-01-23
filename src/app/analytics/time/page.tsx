'use client'

import { useEffect, useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Loader2,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle2,
  Target,
  Info,
  Zap,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'
import { safeRound } from '@/app/api/notes/versions/validation-utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts'

interface TimeStatsData {
  summary: {
    totalQuestions: number
    averageTime: number
    medianTime: number
    idealTime: number
    efficiency: number
    deviationFromIdeal: number
    deviationPercent: number
    minTime: number
    maxTime: number
    p25: number
    p75: number
    p90: number
  }
  byGroup: Array<{
    key: string
    label: string
    totalQuestions: number
    correctQuestions: number
    incorrectQuestions: number
    accuracy: number
    timeStats: {
      all: {
        average: number
        median: number
        min: number
        max: number
        p25: number
        p75: number
        p90: number
      }
      correct: {
        average: number
        median: number
        min: number
        max: number
        p25: number
        p75: number
        p90: number
      }
      incorrect: {
        average: number
        median: number
        min: number
        max: number
        p25: number
        p75: number
        p90: number
      }
    }
    efficiency: number
    deviationFromIdeal: number
    deviationPercent: number
    isOptimal: boolean
    isTooSlow: boolean
    isTooFast: boolean
  }>
  recommendations: string[]
  period: string
  groupBy: string
  generatedAt: string
}

const formatTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${safeRound(seconds, 0)}s`
  }
  const minutes = Math.floor(seconds / 60)
  const secs = safeRound(seconds % 60, 0)
  return `${minutes}m ${secs}s`
}

export default function TimeStatsPage() {
  const [data, setData] = useState<TimeStatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<
    'all' | '30d' | '60d' | '90d' | '180d' | '365d'
  >('all')
  const [selectedGroupBy, setSelectedGroupBy] = useState<
    'difficulty' | 'subject' | 'topic' | 'correctness'
  >('difficulty')

  useEffect(() => {
    loadTimeStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedGroupBy])

  async function loadTimeStats() {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedPeriod !== 'all') {
        params.append('period', selectedPeriod)
      }
      params.append('groupBy', selectedGroupBy)

      const res = await fetch(`/api/analytics/time?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Error al cargar estadísticas de tiempo')
      }
      const timeData = await res.json()
      setData(timeData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar estadísticas de tiempo')
    } finally {
      setLoading(false)
    }
  }

  const chartData = useMemo(() => {
    if (!data) return []

    return data.byGroup.map(group => ({
      name: group.label,
      promedio: group.timeStats.all.average,
      mediana: group.timeStats.all.median,
      ideal: data.summary.idealTime,
      correctas: group.timeStats.correct.average,
      incorrectas: group.timeStats.incorrect.average,
      eficiencia: group.efficiency,
    }))
  }, [data])

  const efficiencyChartData = useMemo(() => {
    if (!data) return []

    return data.byGroup.map(group => ({
      name: group.label,
      eficiencia: group.efficiency,
      precision: group.accuracy,
    }))
  }, [data])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando estadísticas de tiempo...</p>
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
                <Clock className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <AlertCircle className="h-10 w-10 text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-destructive">
                  {error || 'No se pudo cargar las estadísticas'}
                </h3>
                <p className="text-muted-foreground">
                  Intenta nuevamente o completa algunos exámenes para generar datos de tiempo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOptimal = Math.abs(data.summary.deviationPercent) <= 20
  const isTooSlow = data.summary.deviationPercent > 20
  const isTooFast = data.summary.deviationPercent < -20

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <BackButton />
          <h1 className="text-3xl font-bold mt-4">Estadísticas de Tiempo</h1>
          <p className="text-muted-foreground mt-2">
            Analiza cuánto tiempo tomas en responder cada tipo de pregunta
          </p>
        </div>
        <HelpIcon
          content="Esta sección analiza el tiempo que tomas en responder preguntas. El tiempo ideal es de aproximadamente 2.3 minutos por pregunta (basado en el formato PAES: 2.5 horas para 65 preguntas). Usa esta información para identificar áreas donde puedes mejorar tu velocidad o donde necesitas tomarte más tiempo."
        />
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Período</label>
              <Select
                value={selectedPeriod}
                onValueChange={v => setSelectedPeriod(v as typeof selectedPeriod)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tiempos</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="60d">Últimos 60 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                  <SelectItem value="180d">Últimos 180 días</SelectItem>
                  <SelectItem value="365d">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Agrupar por</label>
              <Select
                value={selectedGroupBy}
                onValueChange={v => setSelectedGroupBy(v as typeof selectedGroupBy)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="difficulty">Dificultad</SelectItem>
                  <SelectItem value="subject">Asignatura</SelectItem>
                  <SelectItem value="topic">Tema</SelectItem>
                  <SelectItem value="correctness">Correctas vs Incorrectas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempo Promedio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{formatTime(data.summary.averageTime)}</div>
              <div className="text-sm text-muted-foreground">
                Ideal: {formatTime(data.summary.idealTime)}
              </div>
              <Progress
                value={Math.min(100, (data.summary.averageTime / data.summary.idealTime) * 100)}
                className="mt-2"
              />
              {isOptimal && (
                <Badge variant="default" className="mt-2">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Óptimo
                </Badge>
              )}
              {isTooSlow && (
                <Badge variant="destructive" className="mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Muy Lento
                </Badge>
              )}
              {isTooFast && (
                <Badge variant="outline" className="mt-2">
                  <TrendingDown className="h-3 w-3 mr-1" />
                  Muy Rápido
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Eficiencia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{data.summary.efficiency.toFixed(1)}%</div>
              <Progress value={data.summary.efficiency} className="mt-2" />
              <p className="text-sm text-muted-foreground">Eficiencia basada en tiempo ideal</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Desviación
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div
                className={`text-4xl font-bold ${
                  (() => {
                    if (isOptimal) return 'text-green-600 dark:text-green-400'
                    if (isTooSlow) return 'text-red-600 dark:text-red-400'
                    return 'text-yellow-600 dark:text-yellow-400'
                  })()
                }`}
              >
                {data.summary.deviationPercent > 0 ? '+' : ''}
                {data.summary.deviationPercent.toFixed(1)}%
              </div>
              <p className="text-sm text-muted-foreground">
                {data.summary.deviationFromIdeal > 0 ? '+' : ''}
                {formatTime(Math.abs(data.summary.deviationFromIdeal))} del ideal
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recomendaciones */}
      {data.recommendations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Recomendaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {data.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Tiempo por Grupo */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Tiempo Promedio por{' '}
              {(() => {
                if (selectedGroupBy === 'difficulty') return 'Dificultad'
                if (selectedGroupBy === 'subject') return 'Asignatura'
                if (selectedGroupBy === 'topic') return 'Tema'
                return 'Resultado'
              })()}
            </CardTitle>
            <CardDescription>Comparación de tiempo promedio vs tiempo ideal</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Tiempo (segundos)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number | undefined, name?: string) => {
                    const labels: Record<string, string> = {
                      promedio: 'Promedio',
                      mediana: 'Mediana',
                      ideal: 'Tiempo Ideal',
                      correctas: 'Correctas',
                      incorrectas: 'Incorrectas',
                    }
                    return [`${formatTime(value ?? 0)}`, labels[name || ''] || name || '']
                  }}
                />
                <Legend />
                <ReferenceLine
                  y={data.summary.idealTime}
                  stroke="hsl(var(--primary))"
                  strokeDasharray="5 5"
                  label={{ value: 'Tiempo Ideal', position: 'top' }}
                />
                <Bar dataKey="promedio" name="Promedio" fill="hsl(var(--primary))">
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        (() => {
                          if (entry.promedio > data.summary.idealTime * 1.2) return 'hsl(0, 84%, 60%)'
                          if (entry.promedio < data.summary.idealTime * 0.8) return 'hsl(38, 92%, 50%)'
                          return 'hsl(142, 71%, 45%)'
                        })()
                      }
                    />
                  ))}
                </Bar>
                <Bar dataKey="mediana" name="Mediana" fill="hsl(var(--muted-foreground))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Eficiencia vs Precisión */}
      {efficiencyChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Eficiencia vs Precisión</CardTitle>
            <CardDescription>
              Relación entre eficiencia de tiempo y precisión de respuestas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={efficiencyChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Porcentaje (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number | undefined) => [`${value?.toFixed(1) ?? 0}%`, '']}
                />
                <Legend />
                <Bar dataKey="eficiencia" name="Eficiencia" fill="hsl(var(--primary))" />
                <Bar dataKey="precision" name="Precisión" fill="hsl(var(--accent))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tabla Detallada */}
      <Card>
        <CardHeader>
          <CardTitle>
            Detalle por{' '}
            {(() => {
              if (selectedGroupBy === 'difficulty') return 'Dificultad'
              if (selectedGroupBy === 'subject') return 'Asignatura'
              if (selectedGroupBy === 'topic') return 'Tema'
              return 'Resultado'
            })()}
          </CardTitle>
          <CardDescription>Estadísticas detalladas de tiempo por grupo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Grupo</th>
                  <th className="text-center p-2">Promedio</th>
                  <th className="text-center p-2">Mediana</th>
                  <th className="text-center p-2">Correctas</th>
                  <th className="text-center p-2">Incorrectas</th>
                  <th className="text-center p-2">Eficiencia</th>
                  <th className="text-center p-2">Precisión</th>
                  <th className="text-center p-2">Preguntas</th>
                </tr>
              </thead>
              <tbody>
                {data.byGroup.map(group => {
                  const isOptimalGroup = group.isOptimal
                  const isTooSlowGroup = group.isTooSlow
                  return (
                    <tr key={group.key} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div className="font-medium">{group.label}</div>
                      </td>
                      <td className="text-center p-2">
                        <div className="font-bold">{formatTime(group.timeStats.all.average)}</div>
                        {isTooSlowGroup && (
                          <TrendingUp className="h-4 w-4 mx-auto text-red-600 dark:text-red-400 mt-1" />
                        )}
                        {isOptimalGroup && (
                          <CheckCircle2 className="h-4 w-4 mx-auto text-green-600 dark:text-green-400 mt-1" />
                        )}
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm text-muted-foreground">
                          {formatTime(group.timeStats.all.median)}
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm">{formatTime(group.timeStats.correct.average)}</div>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm">
                          {formatTime(group.timeStats.incorrect.average)}
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <Badge
                          variant={
                            (() => {
                              if (group.efficiency >= 80) return 'default'
                              if (group.efficiency >= 60) return 'secondary'
                              return 'outline'
                            })()
                          }
                          className="text-xs"
                        >
                          {group.efficiency.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm">{group.accuracy.toFixed(1)}%</div>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm text-muted-foreground">{group.totalQuestions}</div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas de Distribución */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Tiempos</CardTitle>
          <CardDescription>Estadísticas descriptivas de los tiempos de respuesta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Mínimo</p>
              <p className="text-2xl font-bold">{formatTime(data.summary.minTime)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Percentil 25</p>
              <p className="text-2xl font-bold">{formatTime(data.summary.p25)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Mediana</p>
              <p className="text-2xl font-bold">{formatTime(data.summary.medianTime)}</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Máximo</p>
              <p className="text-2xl font-bold">{formatTime(data.summary.maxTime)}</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Percentil 75 (P75)</span>
              <span className="font-medium">{formatTime(data.summary.p75)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Percentil 90 (P90)</span>
              <span className="font-medium">{formatTime(data.summary.p90)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Tiempo Ideal</span>
              <span className="font-medium">{formatTime(data.summary.idealTime)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
