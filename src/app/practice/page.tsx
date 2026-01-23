'use client'

import { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  PlayCircle,
  TrendingUp,
  Target,
  BarChart3,
  Clock,
  Award,
  AlertCircle,
  Search,
  Filter,
  ArrowRight,
  History,
  Lightbulb,
  TrendingDown,
  Minus,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { SubjectIcon } from '@/lib/subject-icons'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Subject {
  id: string
  nombre: string
  codigo: string
  tipo: string
}

interface Topic {
  id: string
  nombre: string
  ejeTematico: string
  descripcion: string | null
  subjectId: string
}

interface TopicStat {
  topicId: string
  topicName: string
  subjectName: string
  subjectCode: string
  ejeTematico: string
  porcentaje: number
  totalPreguntas: number
  correctas: number
  nivel: string | null
  tendencia: string | null
  sessionCount: number
}

interface PracticeStats {
  metrics: TopicStat[]
  recentSessions: Array<{
    id: string
    topicId: string
    topicName: string
    subjectName: string
    porcentaje: number
    totalPreguntas: number
    correctas: number
    startedAt: string
    finishedAt: string | null
  }>
  summary: {
    totalSessions: number
    avgScore: number
    topicsPracticed: number
    totalQuestions: number
  }
}

export default function PracticePage() {
  const router = useRouter()
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [stats, setStats] = useState<PracticeStats | null>(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [performanceFilter, setPerformanceFilter] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [loadingTopics, setLoadingTopics] = useState(false)
  const [loadingStats, setLoadingStats] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Cargar asignaturas
  useEffect(() => {
    async function loadSubjects() {
      try {
        setLoading(true)
        const res = await fetch('/api/subjects')
        if (!res.ok) throw new Error('Error al cargar asignaturas')
        const data = await res.json()
        setSubjects(data.subjects || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
        toast.error('Error al cargar asignaturas')
      } finally {
        setLoading(false)
      }
    }
    loadSubjects()
  }, [])

  // Cargar temas cuando se selecciona una asignatura
  useEffect(() => {
    async function loadTopics() {
      if (!selectedSubjectId) {
        setTopics([])
        return
      }

      try {
        setLoadingTopics(true)
        const res = await fetch(`/api/topics?subjectId=${selectedSubjectId}`)
        if (!res.ok) throw new Error('Error al cargar temas')
        const data = await res.json()
        setTopics(data.topics || [])
      } catch {
        toast.error('Error al cargar temas')
        setTopics([])
      } finally {
        setLoadingTopics(false)
      }
    }
    loadTopics()
  }, [selectedSubjectId])

  // Cargar estadísticas
  useEffect(() => {
    async function loadStats() {
      try {
        setLoadingStats(true)
        const params = new URLSearchParams()
        if (selectedSubjectId) {
          params.append('subjectId', selectedSubjectId)
        }

        const res = await fetch(`/api/practice/stats?${params.toString()}`)
        if (!res.ok) {
          // Si falla, no es crítico, solo no mostramos estadísticas
          return
        }
        const data = await res.json()
        setStats(data)
      } catch {
        // Error silencioso para estadísticas
      } finally {
        setLoadingStats(false)
      }
    }
    loadStats()
  }, [selectedSubjectId])

  // Filtrar temas con estadísticas
  const filteredTopics = useMemo(() => {
    let filtered = topics

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        topic =>
          topic.nombre.toLowerCase().includes(query) ||
          topic.ejeTematico.toLowerCase().includes(query) ||
          (topic.descripcion && topic.descripcion.toLowerCase().includes(query))
      )
    }

    // Filtrar por rendimiento si hay estadísticas
    if (stats && performanceFilter !== 'all') {
      filtered = filtered.filter(topic => {
        const topicStat = stats.metrics.find(m => m.topicId === topic.id)
        if (!topicStat) return performanceFilter === 'no-data'

        switch (performanceFilter) {
          case 'weak':
            return topicStat.porcentaje < 50
          case 'medium':
            return topicStat.porcentaje >= 50 && topicStat.porcentaje < 70
          case 'strong':
            return topicStat.porcentaje >= 70
          default:
            return true
        }
      })
    }

    // Ordenar: temas con bajo rendimiento primero
    if (stats) {
      filtered = filtered.sort((a, b) => {
        const statA = stats.metrics.find(m => m.topicId === a.id)
        const statB = stats.metrics.find(m => m.topicId === b.id)

        if (!statA && !statB) return 0
        if (!statA) return 1 // Sin datos al final
        if (!statB) return -1

        return statA.porcentaje - statB.porcentaje // Menor rendimiento primero
      })
    }

    return filtered
  }, [topics, searchQuery, performanceFilter, stats])

  // Obtener estadística de un tema
  const getTopicStat = (topicId: string): TopicStat | undefined => {
    return stats?.metrics.find(m => m.topicId === topicId)
  }

  // Obtener color según rendimiento
  const getPerformanceColor = (porcentaje: number) => {
    if (porcentaje >= 70) return 'text-green-600'
    if (porcentaje >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  // Obtener badge según rendimiento
  const getPerformanceBadge = (porcentaje: number) => {
    if (porcentaje >= 70) return { variant: 'default' as const, label: 'Fuerte' }
    if (porcentaje >= 50) return { variant: 'secondary' as const, label: 'Medio' }
    return { variant: 'destructive' as const, label: 'Débil' }
  }

  // Obtener icono de tendencia
  const getTendencyIcon = (tendencia: string | null) => {
    switch (tendencia) {
      case 'mejorando':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'empeorando':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const handleStartPractice = (
    topicId: string,
    mode: 'easy' | 'medium' | 'hard' | 'mixed' = 'mixed'
  ) => {
    router.push(`/practice/${topicId}?mode=${mode}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-9 w-64" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-destructive">{error}</p>
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
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Modo de Práctica' },
          ]}
        />
      </div>

      {/* Header */}
      <div className="mb-6 flex items-start justify-between flex-wrap gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <PlayCircle className="h-8 w-8" />
              Modo de Estudio por Temas
            </h1>
            <HelpIcon
              content="Practica temas específicos sin presión de tiempo. Recibe feedback inmediato y mejora tus áreas débiles. Las estadísticas te ayudan a identificar qué temas necesitan más atención."
              side="right"
            />
          </div>
          <p className="text-muted-foreground">
            Enfócate en temas específicos, recibe feedback inmediato y mejora tu rendimiento
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/recommendations">
              <Lightbulb className="h-4 w-4 mr-2" />
              Ver Recomendaciones
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas Resumidas */}
      {stats && stats.summary.totalSessions > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Sesiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.summary.totalSessions}</div>
              <p className="text-xs text-muted-foreground mt-1">Sesiones de práctica completadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Promedio General</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${getPerformanceColor(stats.summary.avgScore)}`}>
                {stats.summary.avgScore.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">Rendimiento promedio</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Temas Practicados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.summary.topicsPracticed}</div>
              <p className="text-xs text-muted-foreground mt-1">Temas con práctica registrada</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Preguntas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.summary.totalQuestions}</div>
              <p className="text-xs text-muted-foreground mt-1">Preguntas respondidas</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs: Selección de Temas y Historial */}
      <Tabs defaultValue="topics" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="topics">
            <Target className="h-4 w-4 mr-2" />
            Seleccionar Tema
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            Historial ({stats?.recentSessions.length || 0})
          </TabsTrigger>
        </TabsList>

        {/* Tab: Selección de Temas */}
        <TabsContent value="topics" className="space-y-6 mt-6">
          {/* Filtros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros y Búsqueda
              </CardTitle>
              <CardDescription>Encuentra el tema que necesitas practicar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Búsqueda */}
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Buscar temas..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Filtro por Asignatura */}
                <Select value={selectedSubjectId} onValueChange={setSelectedSubjectId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las asignaturas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las asignaturas</SelectItem>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filtro por Rendimiento */}
              {stats && stats.metrics.length > 0 && (
                <div>
                  <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
                    <SelectTrigger className="w-full md:w-[300px]">
                      <SelectValue placeholder="Todos los niveles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      <SelectItem value="weak">Rendimiento Débil (&lt;50%)</SelectItem>
                      <SelectItem value="medium">Rendimiento Medio (50-70%)</SelectItem>
                      <SelectItem value="strong">Rendimiento Fuerte (≥70%)</SelectItem>
                      <SelectItem value="no-data">Sin datos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lista de Temas */}
          {loadingTopics ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !selectedSubjectId ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  Selecciona una asignatura para ver los temas disponibles
                </p>
              </CardContent>
            </Card>
          ) : filteredTopics.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">
                  {searchQuery || performanceFilter !== 'all'
                    ? 'No se encontraron temas con los filtros seleccionados'
                    : 'No hay temas disponibles para esta asignatura'}
                </p>
                {(searchQuery || performanceFilter !== 'all') && (
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('')
                      setPerformanceFilter('all')
                    }}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTopics.map(topic => {
                const topicStat = getTopicStat(topic.id)
                const performanceBadge = topicStat
                  ? getPerformanceBadge(topicStat.porcentaje)
                  : null

                return (
                  <Card
                    key={topic.id}
                    className={`hover:border-primary transition-all ${
                      topicStat && topicStat.porcentaje < 50
                        ? 'border-red-200 bg-red-50/50 dark:bg-red-950/10'
                        : ''
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {topicStat && <SubjectIcon codigo={topicStat.subjectCode} size={18} />}
                            <CardTitle className="text-lg">{topic.nombre}</CardTitle>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {topic.ejeTematico}
                          </Badge>
                        </div>
                        {performanceBadge && (
                          <Badge variant={performanceBadge.variant} className="text-xs">
                            {performanceBadge.label}
                          </Badge>
                        )}
                      </div>
                      {topic.descripcion && (
                        <CardDescription className="text-sm mt-2 line-clamp-2">
                          {topic.descripcion}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {/* Estadísticas del tema */}
                      {topicStat ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Rendimiento:</span>
                            <span
                              className={`font-semibold ${getPerformanceColor(topicStat.porcentaje)}`}
                            >
                              {topicStat.porcentaje.toFixed(1)}%
                            </span>
                          </div>
                          <Progress value={topicStat.porcentaje} className="h-2" />
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>
                              {topicStat.correctas} / {topicStat.totalPreguntas} correctas
                            </span>
                            <div className="flex items-center gap-1">
                              {getTendencyIcon(topicStat.tendencia)}
                              {topicStat.sessionCount > 0 && (
                                <span className="ml-1">{topicStat.sessionCount} sesiones</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground text-center py-2">
                          Sin datos de práctica
                        </div>
                      )}

                      {/* Botones de acción */}
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleStartPractice(topic.id)}
                          className="flex-1"
                          size="sm"
                          variant={topicStat && topicStat.porcentaje < 50 ? 'default' : 'outline'}
                        >
                          <PlayCircle className="h-4 w-4 mr-2" />
                          Practicar
                          {topicStat && topicStat.porcentaje < 50 && (
                            <Badge variant="secondary" className="ml-2">
                              Prioridad
                            </Badge>
                          )}
                        </Button>
                        {topicStat && topicStat.sessionCount > 0 && (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/practice/${topic.id}/history`}>
                              <BarChart3 className="h-4 w-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* Tab: Historial */}
        <TabsContent value="history" className="space-y-4 mt-6">
          {loadingStats ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : !stats || stats.recentSessions.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <History className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground mb-2">
                  No hay sesiones de práctica registradas
                </p>
                <p className="text-sm text-muted-foreground">
                  Comienza a practicar temas para ver tu historial aquí
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {stats.recentSessions.map(session => {
                const performanceBadge = getPerformanceBadge(session.porcentaje)
                return (
                  <Card key={session.id} className="hover:border-primary transition-colors">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{session.topicName}</h3>
                            <Badge variant="outline" className="text-xs">
                              {session.subjectName}
                            </Badge>
                            <Badge variant={performanceBadge.variant} className="text-xs">
                              {performanceBadge.label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>
                              {session.correctas} / {session.totalPreguntas} correctas
                            </span>
                            <span
                              className={`font-semibold ${getPerformanceColor(session.porcentaje)}`}
                            >
                              {session.porcentaje.toFixed(1)}%
                            </span>
                            {session.finishedAt && (
                              <span>
                                {new Date(session.finishedAt).toLocaleDateString('es-CL', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            )}
                          </div>
                          <Progress value={session.porcentaje} className="h-2" />
                        </div>
                        <Button variant="outline" size="sm" asChild className="ml-4">
                          <Link
                            href={`/practice/${session.topicId}/results?sessionId=${session.id}`}
                          >
                            Ver Detalles
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Temas Recomendados */}
      {stats && stats.metrics.filter(m => m.porcentaje < 50).length > 0 && (
        <Card className="mt-6 border-orange-200 bg-orange-50/50 dark:bg-orange-950/20 dark:border-orange-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-orange-600" />
              Temas Recomendados para Practicar
            </CardTitle>
            <CardDescription>
              Estos temas tienen bajo rendimiento y necesitan más atención
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.metrics
                .filter(m => m.porcentaje < 50)
                .sort((a, b) => a.porcentaje - b.porcentaje)
                .slice(0, 6)
                .map(metric => (
                  <Card
                    key={metric.topicId}
                    className="hover:border-primary transition-colors cursor-pointer"
                    onClick={() => {
                      // Buscar el tema en la lista de temas
                      const topic = topics.find(t => t.id === metric.topicId)
                      if (topic) {
                        setSelectedSubjectId(topic.subjectId)
                        setTimeout(() => {
                          handleStartPractice(metric.topicId)
                        }, 100)
                      }
                    }}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <SubjectIcon codigo={metric.subjectCode} size={16} />
                            <CardTitle className="text-sm">{metric.topicName}</CardTitle>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            {metric.porcentaje.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={metric.porcentaje} className="h-2 mb-2" />
                      <p className="text-xs text-muted-foreground">
                        {metric.correctas} / {metric.totalPreguntas} correctas
                      </p>
                      <Button size="sm" className="w-full mt-2" variant="outline">
                        Practicar Ahora
                        <ArrowRight className="h-3 w-3 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" asChild>
                <Link href="/recommendations">
                  Ver Todas las Recomendaciones
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información y Beneficios */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Beneficios del Modo de Práctica
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Sin Presión de Tiempo</h3>
                <p className="text-sm text-muted-foreground">
                  Practica a tu propio ritmo, sin timer. Tómate el tiempo que necesites para
                  entender cada concepto.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Feedback Inmediato</h3>
                <p className="text-sm text-muted-foreground">
                  Recibe explicaciones al instante después de cada respuesta. Aprende de tus errores
                  en tiempo real.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-1">Enfoque Dirigido</h3>
                <p className="text-sm text-muted-foreground">
                  Practica solo los temas que necesitas reforzar. Las estadísticas te muestran dónde
                  enfocar tus esfuerzos.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
