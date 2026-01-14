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
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  BarChart3,
  Info,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'
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
} from 'recharts'

interface ComparisonData {
  overall: {
    percentage: number
    percentile: number
    position: number
    totalStudents: number
    statistics: {
      min: number
      max: number
      mean: number
      median: number
      p25: number
      p75: number
      p90: number
      p95: number
    }
  }
  bySubject: Array<{
    subjectId: string
    subjectName: string
    subjectCode: string
    studentPercentage: number
    studentTotalQuestions: number
    studentCorrectAnswers: number
    percentile: number
    position: number
    totalStudents: number
    statistics: {
      min: number
      max: number
      mean: number
      median: number
      p25: number
      p75: number
      p90: number
      p95: number
    }
  }>
  period: string
  generatedAt: string
}

export default function ComparisonPage() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState<
    'all' | '30d' | '60d' | '90d' | '180d' | '365d'
  >('all')
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('all')

  useEffect(() => {
    loadComparison()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPeriod, selectedSubjectId])

  async function loadComparison() {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (selectedPeriod !== 'all') {
        params.append('period', selectedPeriod)
      }
      if (selectedSubjectId !== 'all') {
        params.append('subjectId', selectedSubjectId)
      }

      const res = await fetch(`/api/analytics/comparison?${params.toString()}`)
      if (!res.ok) {
        throw new Error('Error al cargar comparación')
      }
      const comparisonData = await res.json()
      setData(comparisonData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar comparación')
    } finally {
      setLoading(false)
    }
  }

  const getPercentileColor = (percentile: number) => {
    if (percentile >= 75) return 'text-green-600 dark:text-green-400'
    if (percentile >= 50) return 'text-blue-600 dark:text-blue-400'
    if (percentile >= 25) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-orange-600 dark:text-orange-400'
  }

  const getPercentileBadge = (percentile: number) => {
    if (percentile >= 90) return { label: 'Excelente', variant: 'default' as const }
    if (percentile >= 75) return { label: 'Muy Bueno', variant: 'default' as const }
    if (percentile >= 50) return { label: 'Bueno', variant: 'secondary' as const }
    if (percentile >= 25) return { label: 'Regular', variant: 'secondary' as const }
    return { label: 'Mejorable', variant: 'outline' as const }
  }

  const chartData = useMemo(() => {
    if (!data) return []

    return data.bySubject.map(subject => ({
      name: subject.subjectCode,
      fullName: subject.subjectName,
      tuPorcentaje: subject.studentPercentage,
      promedio: subject.statistics.mean,
      mediana: subject.statistics.median,
      p25: subject.statistics.p25,
      p75: subject.statistics.p75,
      p90: subject.statistics.p90,
    }))
  }, [data])

  const percentileChartData = useMemo(() => {
    if (!data) return []

    return data.bySubject.map(subject => ({
      name: subject.subjectCode,
      fullName: subject.subjectName,
      percentil: subject.percentile,
      posicion: subject.position,
      total: subject.totalStudents,
    }))
  }, [data])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Cargando comparación...</p>
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
                <BarChart3 className="h-20 w-20 mx-auto text-muted-foreground/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Info className="h-10 w-10 text-orange-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-destructive">
                  {error || 'No se pudo cargar la comparación'}
                </h3>
                <p className="text-muted-foreground">
                  Intenta nuevamente o completa algunos exámenes para generar datos de comparación.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overallBadge = getPercentileBadge(data.overall.percentile)

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <BackButton />
          <h1 className="text-3xl font-bold mt-4">Comparación Anónima</h1>
          <p className="text-muted-foreground mt-2">
            Compara tu rendimiento con otros estudiantes de forma anónima
          </p>
        </div>
        <HelpIcon
          content="Esta sección muestra tu rendimiento comparado con otros estudiantes de forma completamente anónima. Los datos se agregan y no se muestran nombres ni información personal. El percentil indica qué porcentaje de estudiantes tienen un rendimiento menor al tuyo."
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
              <label className="text-sm font-medium mb-2 block">Asignatura</label>
              <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las asignaturas</SelectItem>
                  {data.bySubject.map(subject => (
                    <SelectItem key={subject.subjectId} value={subject.subjectId}>
                      {subject.subjectName}
                    </SelectItem>
                  ))}
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
              <Award className="h-5 w-5" />
              Percentil General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className={`text-4xl font-bold ${getPercentileColor(data.overall.percentile)}`}>
                {data.overall.percentile.toFixed(1)}
                <span className="text-2xl text-muted-foreground">º</span>
              </div>
              <Badge variant={overallBadge.variant}>{overallBadge.label}</Badge>
              <p className="text-sm text-muted-foreground">
                Estás por encima del {data.overall.percentile.toFixed(1)}% de los estudiantes
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Tu Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">{data.overall.percentage.toFixed(1)}%</div>
              <Progress value={data.overall.percentage} className="mt-2" />
              <p className="text-sm text-muted-foreground">
                Promedio general de todas las asignaturas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Posición
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-2">
              <div className="text-4xl font-bold">
                #{data.overall.position}
                <span className="text-2xl text-muted-foreground">
                  {' '}
                  / {data.overall.totalStudents}
                </span>
              </div>
              <Badge variant="outline" className="mt-2">
                {data.overall.totalStudents} estudiantes en total
              </Badge>
              <p className="text-sm text-muted-foreground">Tu posición en el ranking general</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estadísticas de Distribución */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Rendimiento</CardTitle>
          <CardDescription>
            Comparación de tu rendimiento con las estadísticas generales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Mínimo</p>
              <p className="text-2xl font-bold">{data.overall.statistics.min.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Promedio</p>
              <p className="text-2xl font-bold">{data.overall.statistics.mean.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Mediana</p>
              <p className="text-2xl font-bold">{data.overall.statistics.median.toFixed(1)}%</p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Máximo</p>
              <p className="text-2xl font-bold">{data.overall.statistics.max.toFixed(1)}%</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Percentil 25 (P25)</span>
              <span className="font-medium">{data.overall.statistics.p25.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Percentil 75 (P75)</span>
              <span className="font-medium">{data.overall.statistics.p75.toFixed(1)}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Percentil 90 (P90)</span>
              <span className="font-medium">{data.overall.statistics.p90.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Comparación por Asignatura */}
      {chartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparación por Asignatura</CardTitle>
            <CardDescription>Tu rendimiento vs promedio y mediana por asignatura</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Asignatura', position: 'insideBottom', offset: -5 }}
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
                  formatter={(value: number | undefined, name?: string) => {
                    const labels: Record<string, string> = {
                      tuPorcentaje: 'Tu Porcentaje',
                      promedio: 'Promedio',
                      mediana: 'Mediana',
                      p25: 'Percentil 25',
                      p75: 'Percentil 75',
                      p90: 'Percentil 90',
                    }
                    return [`${value?.toFixed(1) ?? 0}%`, labels[name || ''] || name || '']
                  }}
                  labelFormatter={label => {
                    const subject = chartData.find(s => s.name === label)
                    return subject ? subject.fullName : label
                  }}
                />
                <Legend />
                <Bar dataKey="tuPorcentaje" fill="hsl(var(--primary))" name="Tu Porcentaje" />
                <Bar dataKey="promedio" fill="hsl(var(--muted-foreground))" name="Promedio" />
                <Bar dataKey="mediana" fill="hsl(var(--accent))" name="Mediana" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de Percentiles por Asignatura */}
      {percentileChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Percentiles por Asignatura</CardTitle>
            <CardDescription>
              Tu posición percentil en cada asignatura (mayor = mejor)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={percentileChartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="name"
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Asignatura', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                  domain={[0, 100]}
                  className="text-xs"
                  tick={{ fill: 'currentColor' }}
                  label={{ value: 'Percentil', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--background))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                  formatter={(value: number | undefined, name?: string) => {
                    if (name === 'percentil') {
                      return [`${value?.toFixed(1) ?? 0}º percentil`, 'Percentil']
                    }
                    if (name === 'posicion') {
                      return [`#${value}`, 'Posición']
                    }
                    if (name === 'total') {
                      return [`${value} estudiantes`, 'Total']
                    }
                    return [value, name || '']
                  }}
                  labelFormatter={label => {
                    const subject = percentileChartData.find(s => s.name === label)
                    return subject ? subject.fullName : label
                  }}
                />
                <Legend />
                <Bar dataKey="percentil" name="Percentil">
                  {percentileChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        (() => {
                          if (entry.percentil >= 75) return 'hsl(142, 71%, 45%)'
                          if (entry.percentil >= 50) return 'hsl(217, 91%, 60%)'
                          if (entry.percentil >= 25) return 'hsl(38, 92%, 50%)'
                          return 'hsl(0, 84%, 60%)'
                        })()
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Tabla Detallada por Asignatura */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle por Asignatura</CardTitle>
          <CardDescription>
            Información detallada de tu rendimiento en cada asignatura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Asignatura</th>
                  <th className="text-center p-2">Tu %</th>
                  <th className="text-center p-2">Percentil</th>
                  <th className="text-center p-2">Posición</th>
                  <th className="text-center p-2">Promedio</th>
                  <th className="text-center p-2">Preguntas</th>
                </tr>
              </thead>
              <tbody>
                {data.bySubject.map(subject => {
                  const badge = getPercentileBadge(subject.percentile)
                  const isAboveAverage = subject.studentPercentage > subject.statistics.mean
                  return (
                    <tr key={subject.subjectId} className="border-b hover:bg-muted/50">
                      <td className="p-2">
                        <div>
                          <div className="font-medium">{subject.subjectName}</div>
                          <div className="text-sm text-muted-foreground">{subject.subjectCode}</div>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <div className="font-bold">{subject.studentPercentage.toFixed(1)}%</div>
                        {isAboveAverage ? (
                          <TrendingUp className="h-4 w-4 mx-auto text-green-600 dark:text-green-400 mt-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mx-auto text-red-600 dark:text-red-400 mt-1" />
                        )}
                      </td>
                      <td className="text-center p-2">
                        <Badge variant={badge.variant} className="text-xs">
                          {subject.percentile.toFixed(1)}º
                        </Badge>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm">
                          #{subject.position}
                          <span className="text-muted-foreground"> / {subject.totalStudents}</span>
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm text-muted-foreground">
                          {subject.statistics.mean.toFixed(1)}%
                        </div>
                      </td>
                      <td className="text-center p-2">
                        <div className="text-sm text-muted-foreground">
                          {subject.studentTotalQuestions}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Nota de Privacidad */}
      <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Privacidad y Anonimato
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Todos los datos mostrados son completamente anónimos. No se muestran nombres, emails
                ni ninguna información personal. Los rankings y comparaciones se basan únicamente en
                datos agregados de rendimiento académico.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
