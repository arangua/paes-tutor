'use client'

import { useState, useEffect, useCallback } from 'react'
import { safeToISODate } from '@/app/api/notes/versions/validation-utils'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { RecommendationCard } from '@/components/recommendations/recommendation-card'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { HelpIcon } from '@/components/help/help-icon'
import { ExportButton } from '@/components/export/export-button'
import {
  Loader2,
  Target,
  BookOpen,
  Calendar,
  AlertCircle,
  TrendingUp,
  ArrowLeft,
  FileText,
  BarChart3,
  RefreshCw,
  Lightbulb,
  Clock,
  Award,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

interface TopicRecommendation {
  topicId: string
  topicName: string
  subjectName: string
  subjectCode: string
  currentPercentage: number
  priority: 'high' | 'medium' | 'low'
  reason: string
  suggestedActions: string[]
}

interface ExamRecommendation {
  examId: string
  examTitle: string
  subjectName: string
  subjectCode: string
  reason: string
  priority: 'high' | 'medium' | 'low'
  focusTopics: string[]
}

interface StudyPlan {
  weeklyGoals: Array<{
    week: number
    topics: string[]
    exams: string[]
    description: string
  }>
  estimatedCompletion: string
  focusAreas: string[]
}

interface Recommendations {
  topics: TopicRecommendation[]
  exams: ExamRecommendation[]
  studyPlan: StudyPlan | null
  summary: {
    totalRecommendations: number
    highPriority: number
    estimatedStudyTime: string
  }
}

export default function RecommendationsPage() {
  const router = useRouter()
  const [recommendations, setRecommendations] = useState<Recommendations | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const res = await fetch('/api/recommendations')

      if (res.status === 401) {
        router.push('/auth/signin?callbackUrl=/recommendations')
        return
      }

      if (!res.ok) {
        // Manejar error 429 (Too Many Requests)
        if (res.status === 429) {
          const retryAfter = res.headers.get('Retry-After')
          const message = retryAfter
            ? `Demasiadas solicitudes. Intenta nuevamente en ${retryAfter} segundos.`
            : 'Demasiadas solicitudes. Por favor, espera un momento antes de intentar nuevamente.'
          throw new Error(message)
        }
        throw new Error('Error al cargar recomendaciones')
      }

      const data = await res.json()
      setRecommendations(data)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar recomendaciones', {
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    } finally {
      setIsLoading(false)
    }
  }, [router])

  useEffect(() => {
    loadRecommendations()
  }, [router, loadRecommendations])

  const handleRefresh = () => {
    loadRecommendations()
    toast.info('Actualizando recomendaciones...')
  }

  const handleExportExcel = async () => {
    if (!recommendations) {
      toast.error('No hay datos para exportar')
      return
    }

    try {
      toast.loading('Exportando recomendaciones a Excel...', { id: 'export-recommendations' })

      // Importar ExcelJS dinámicamente
      const ExcelJS = (await import('exceljs')).default
      const { saveAs } = await import('file-saver')

      // Crear workbook
      const workbook = new ExcelJS.Workbook()

      // Hoja 1: Resumen
      const summarySheet = workbook.addWorksheet('Resumen')
      summarySheet.addRow(['Resumen de Recomendaciones'])
      summarySheet.addRow(['Total de Recomendaciones', recommendations.summary.totalRecommendations])
      summarySheet.addRow(['Alta Prioridad', recommendations.summary.highPriority])
      summarySheet.addRow(['Tiempo Estimado', recommendations.summary.estimatedStudyTime])
      summarySheet.addRow([])
      summarySheet.addRow(['Temas Recomendados', recommendations.topics.length])
      summarySheet.addRow(['Exámenes Recomendados', recommendations.exams.length])

      // Hoja 2: Temas
      if (recommendations.topics.length > 0) {
        const topicsSheet = workbook.addWorksheet('Temas')
        topicsSheet.addRow(['Tema', 'Asignatura', 'Rendimiento (%)', 'Prioridad', 'Razón', 'Acciones Sugeridas'])
        recommendations.topics.forEach(t => {
          topicsSheet.addRow([
            t.topicName,
            t.subjectName,
            t.currentPercentage.toFixed(1),
            t.priority,
            t.reason,
            t.suggestedActions.join('; '),
          ])
        })
      }

      // Hoja 3: Exámenes
      if (recommendations.exams.length > 0) {
        const examsSheet = workbook.addWorksheet('Exámenes')
        examsSheet.addRow(['Examen', 'Asignatura', 'Prioridad', 'Razón', 'Temas a Reforzar'])
        recommendations.exams.forEach(e => {
          examsSheet.addRow([
            e.examTitle,
            e.subjectName,
            e.priority,
            e.reason,
            e.focusTopics.join('; '),
          ])
        })
      }

      // Hoja 4: Plan de Estudio
      if (recommendations.studyPlan) {
        const planSheet = workbook.addWorksheet('Plan de Estudio')
        planSheet.addRow(['Plan de Estudio Personalizado'])
        planSheet.addRow(['Áreas de Enfoque', recommendations.studyPlan.focusAreas.join('; ')])
        planSheet.addRow(['Fecha Estimada de Finalización', recommendations.studyPlan.estimatedCompletion])
        planSheet.addRow([])
        planSheet.addRow(['Semana', 'Descripción', 'Temas', 'Exámenes'])
        recommendations.studyPlan.weeklyGoals.forEach(g => {
          planSheet.addRow([
            g.week,
            g.description,
            g.topics.join('; '),
            g.exams.join('; '),
          ])
        })
      }

      // Generar archivo
      const excelBuffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // guard:allow-secret
      })
      saveAs(blob, `recomendaciones-paes-${safeToISODate(new Date())}.xlsx`)

      toast.success('Exportación exitosa', {
        id: 'export-recommendations',
        description: 'Las recomendaciones se han exportado correctamente a Excel.',
      })
    } catch (error) {
      toast.error('Error al exportar', {
        id: 'export-recommendations',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar las recomendaciones. Por favor, intenta nuevamente.',
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando recomendaciones...
            </p>
            <p className="text-sm text-muted-foreground">
              Analizando tu rendimiento para generar recomendaciones personalizadas
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !recommendations) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>
              {error || 'No se pudieron cargar las recomendaciones'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {error ||
                'No hay suficientes datos para generar recomendaciones. Realiza algunos exámenes para comenzar a recibir recomendaciones personalizadas.'}
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
              <Button onClick={() => router.push('/dashboard')} variant="outline">
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push('/exams')} variant="default">
                <BookOpen className="h-4 w-4 mr-2" />
                Realizar Examen
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (recommendations.topics.length === 0 && recommendations.exams.length === 0) {
    return (
      <div className="container mx-auto py-6 px-4 max-w-7xl">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Recomendaciones' },
          ]}
        />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recomendaciones Personalizadas
            </CardTitle>
            <CardDescription>
              Realiza algunos exámenes para recibir recomendaciones personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">Aún no hay recomendaciones</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Necesitas completar al menos un examen para que podamos analizar tu rendimiento y
                generar recomendaciones personalizadas basadas en tus fortalezas y debilidades.
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link href="/exams">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Comenzar a Practicar
                  </Link>
                </Button>
                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const highPriorityTopics = recommendations.topics.filter(t => t.priority === 'high')
  const mediumPriorityTopics = recommendations.topics.filter(t => t.priority === 'medium')
  const lowPriorityTopics = recommendations.topics.filter(t => t.priority === 'low')
  const highPriorityExams = recommendations.exams.filter(e => e.priority === 'high')
  const mediumPriorityExams = recommendations.exams.filter(e => e.priority === 'medium')
  const lowPriorityExams = recommendations.exams.filter(e => e.priority === 'low')

  return (
    <div className="container mx-auto py-6 px-4 max-w-7xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Recomendaciones' },
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
            <h1 className="text-3xl font-bold">Recomendaciones Personalizadas</h1>
            <HelpIcon
              content="Las recomendaciones se generan automáticamente basándose en tu rendimiento en los exámenes. Se actualizan cada vez que completas un nuevo examen. Las recomendaciones de alta prioridad requieren atención inmediata."
              side="right"
            />
          </div>
          <p className="text-muted-foreground">
            Sugerencias personalizadas basadas en tu rendimiento para mejorar tu preparación PAES
          </p>
          {lastUpdated && (
            <p className="text-xs text-muted-foreground mt-2">
              Última actualización: {lastUpdated.toLocaleString('es-CL')}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
          <ExportButton onExportExcel={handleExportExcel} variant="outline" />
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <FileText className="h-4 w-4 mr-2" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>

      {/* Estadísticas Resumidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Recomendaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{recommendations.summary.totalRecommendations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {recommendations.topics.length} temas • {recommendations.exams.length} exámenes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alta Prioridad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {recommendations.summary.highPriority}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Requieren atención inmediata</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tiempo Estimado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              <Clock className="h-5 w-5" />
              {recommendations.summary.estimatedStudyTime}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Para completar recomendaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Plan de Estudio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {recommendations.studyPlan ? recommendations.studyPlan.weeklyGoals.length : 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {recommendations.studyPlan ? 'Semanas planificadas' : 'No disponible'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contenido Principal con Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recomendaciones Detalladas
              </CardTitle>
              <CardDescription>
                {recommendations.summary.totalRecommendations} recomendaciones •{' '}
                {recommendations.summary.highPriority} de alta prioridad
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="topics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="topics">
                <Target className="h-4 w-4 mr-2" />
                Temas ({recommendations.topics.length})
              </TabsTrigger>
              <TabsTrigger value="exams">
                <BookOpen className="h-4 w-4 mr-2" />
                Exámenes ({recommendations.exams.length})
              </TabsTrigger>
              <TabsTrigger value="plan">
                <Calendar className="h-4 w-4 mr-2" />
                Plan de Estudio
              </TabsTrigger>
            </TabsList>

            {/* Tab de Temas */}
            <TabsContent value="topics" className="space-y-6 mt-6">
              {highPriorityTopics.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-600">Alta Prioridad</h3>
                    <Badge variant="destructive">{highPriorityTopics.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highPriorityTopics.map(topic => (
                      <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />
                    ))}
                  </div>
                </div>
              )}

              {mediumPriorityTopics.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-600">Prioridad Media</h3>
                    <Badge variant="secondary">{mediumPriorityTopics.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediumPriorityTopics.map(topic => (
                      <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />
                    ))}
                  </div>
                </div>
              )}

              {lowPriorityTopics.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Target className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">Baja Prioridad</h3>
                    <Badge variant="default">{lowPriorityTopics.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowPriorityTopics.map(topic => (
                      <RecommendationCard key={topic.topicId} type="topic" recommendation={topic} />
                    ))}
                  </div>
                </div>
              )}

              {recommendations.topics.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay recomendaciones de temas en este momento</p>
                  <p className="text-sm mt-2">
                    Completa más exámenes para recibir recomendaciones de temas
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tab de Exámenes */}
            <TabsContent value="exams" className="space-y-6 mt-6">
              {highPriorityExams.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-600">Alta Prioridad</h3>
                    <Badge variant="destructive">{highPriorityExams.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {highPriorityExams.map(exam => (
                      <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />
                    ))}
                  </div>
                </div>
              )}

              {mediumPriorityExams.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-5 w-5 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-yellow-600">Prioridad Media</h3>
                    <Badge variant="secondary">{mediumPriorityExams.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediumPriorityExams.map(exam => (
                      <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />
                    ))}
                  </div>
                </div>
              )}

              {lowPriorityExams.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">Baja Prioridad</h3>
                    <Badge variant="default">{lowPriorityExams.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowPriorityExams.map(exam => (
                      <RecommendationCard key={exam.examId} type="exam" recommendation={exam} />
                    ))}
                  </div>
                </div>
              )}

              {recommendations.exams.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No hay recomendaciones de exámenes en este momento</p>
                  <p className="text-sm mt-2">
                    Completa más exámenes para recibir recomendaciones personalizadas
                  </p>
                </div>
              )}
            </TabsContent>

            {/* Tab de Plan de Estudio */}
            <TabsContent value="plan" className="mt-6">
              {recommendations.studyPlan ? (
                <div className="space-y-6">
                  {/* Resumen del Plan */}
                  <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Resumen del Plan de Estudio
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Áreas de Enfoque</p>
                          <div className="flex flex-wrap gap-2">
                            {recommendations.studyPlan.focusAreas.map((area, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {area}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Fecha Estimada de Finalización</p>
                          <p className="text-lg font-semibold">
                            {recommendations.studyPlan.estimatedCompletion}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Semanas del Plan */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Plan Semanal</h3>
                    {recommendations.studyPlan.weeklyGoals.map(goal => (
                      <Card key={goal.week}>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">Semana {goal.week}</CardTitle>
                            <Badge variant="outline">Semana {goal.week}</Badge>
                          </div>
                          <CardDescription>{goal.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {goal.topics.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <Target className="h-4 w-4" />
                                Temas a Estudiar:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {goal.topics.map((topic, idx) => (
                                  <Badge key={idx} variant="secondary" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {goal.exams.length > 0 && (
                            <div>
                              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Exámenes Recomendados:
                              </p>
                              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {goal.exams.map((exam, idx) => (
                                  <li key={idx}>{exam}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No hay plan de estudio disponible</p>
                  <p className="text-sm">
                    Realiza más exámenes para generar un plan de estudio personalizado basado en tu
                    rendimiento
                  </p>
                  <Button asChild className="mt-4">
                    <Link href="/exams">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Comenzar a Practicar
                    </Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Acciones Rápidas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button variant="outline" asChild className="h-auto py-4">
          <Link href="/exams">
            <BookOpen className="h-5 w-5 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Ver Todos los Exámenes</div>
              <div className="text-xs text-muted-foreground">
                Explora todos los exámenes disponibles
              </div>
            </div>
          </Link>
        </Button>
        <Button variant="outline" asChild className="h-auto py-4">
          <Link href="/analytics">
            <BarChart3 className="h-5 w-5 mr-2" />
            <div className="text-left">
              <div className="font-semibold">Ver Analytics</div>
              <div className="text-xs text-muted-foreground">
                Análisis detallado de tu rendimiento
              </div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  )
}

