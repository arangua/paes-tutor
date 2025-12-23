'use client'

import { useEffect, useState, lazy, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  TrendingUp,
  Target,
  Award,
  AlertCircle,
  Home,
  FileText,
  Loader2,
  HelpCircle,
  PlayCircle,
} from 'lucide-react'
import { ExportButton } from '@/components/export/export-button'
import { exportDashboardToExcel } from '@/lib/export-utils'
import { toast } from 'sonner'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Achievements } from '@/components/dashboard/achievements'
import { RecommendationsSection } from '@/components/recommendations/recommendations-section'
import { WelcomeTour } from '@/components/help/welcome-tour'
import { QuickGuide } from '@/components/help/quick-guide'
import { HelpIcon } from '@/components/help/help-icon'

// Lazy load recharts para reducir el bundle inicial
const SubjectPerformanceChart = lazy(() =>
  import('@/components/charts/PerformanceCharts').then(mod => ({
    default: mod.SubjectPerformanceChart,
  }))
)
const RecentAttemptsChart = lazy(() =>
  import('@/components/charts/PerformanceCharts').then(mod => ({
    default: mod.RecentAttemptsChart,
  }))
)

interface Student {
  id: string
  nombre: string
  attempts: Attempt[]
  metrics: Metric[]
}

interface Attempt {
  id: string
  estado: string
  porcentaje: number
  correctas: number
  totalPreguntas: number
  puntajePaes: number | null
  createdAt: string
  startedAt?: string | null
  exam: {
    titulo: string
    subject: {
      nombre: string
      codigo: string
    }
  }
}

interface Metric {
  porcentaje: number
  totalPreguntas: number
  correctas: number
  codigo: string
  nombre: string
  temas: Array<{
    nombre: string
    porcentaje: number
    nivel: string | null
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [student, setStudent] = useState<Student | null>(null)
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTour, setShowTour] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya vio el tour (solo en cliente)
    if (typeof window !== 'undefined') {
      const seen = localStorage.getItem('paes-tutor-tour-seen')
      setHasSeenTour(!!seen)

      // Mostrar tour si es primera vez
      const isFirstVisit = localStorage.getItem('paes-tutor-dashboard-first-visit')
      if (!seen && !isFirstVisit) {
        setShowTour(true)
        localStorage.setItem('paes-tutor-dashboard-first-visit', 'true')
      }
    }
  }, [])

  const handleTourComplete = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('paes-tutor-tour-seen', 'true')
    }
    setShowTour(false)
    setHasSeenTour(true)
  }

  const handleTourSkip = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('paes-tutor-tour-seen', 'true')
    }
    setShowTour(false)
    setHasSeenTour(true)
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentRes, metricsRes] = await Promise.all([
          fetch('/api/student'),
          fetch('/api/metrics'),
        ])

        // Manejar errores de autenticación
        if (studentRes.status === 401 || metricsRes.status === 401) {
          // Redirigir a login si no está autenticado
          window.location.href = '/auth/signin?callbackUrl=/dashboard'
          return
        }

        if (!studentRes.ok) {
          const errorData = await studentRes.json().catch(() => ({}))
          throw new Error(
            errorData.error || `Error ${studentRes.status}: Error al obtener datos del estudiante`
          )
        }

        if (!metricsRes.ok) {
          const errorData = await metricsRes.json().catch(() => ({}))
          throw new Error(
            errorData.error || `Error ${metricsRes.status}: Error al obtener métricas`
          )
        }

        const studentData = await studentRes.json()
        const metricsData = await metricsRes.json()

        // Validar que no haya errores en la respuesta
        if (studentData.error) {
          throw new Error(studentData.error)
        }

        if (Array.isArray(metricsData) && metricsData.length > 0 && metricsData[0].error) {
          throw new Error(metricsData[0].error)
        }

        setStudent(studentData)
        setMetrics(Array.isArray(metricsData) ? metricsData : [])
      } catch (error) {
        // Manejar errores y mostrar feedback al usuario
        const errorMessage =
          error instanceof Error ? error.message : 'Error al cargar datos del dashboard'

        setError(errorMessage)

        // Log para debugging (usar logger estructurado si está disponible)
        // El error ya se maneja en el catch y se muestra al usuario
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600">No se encontró información del estudiante</p>
      </div>
    )
  }

  // Calcular estadísticas generales
  const totalAttempts = student.attempts.length
  const avgScore =
    student.attempts.length > 0
      ? student.attempts.reduce((sum, a) => sum + a.porcentaje, 0) / student.attempts.length
      : 0
  const completedAttempts = student.attempts.filter(a => a.estado === 'completado').length

  // Preparar datos para gráficos
  const subjectPerformance = metrics.map(m => ({
    name: m.codigo,
    porcentaje: Math.round(m.porcentaje),
  }))

  const recentAttempts = student.attempts.slice(0, 5).map((a, idx) => ({
    name: `Intento ${idx + 1}`,
    porcentaje: Math.round(a.porcentaje),
  }))

  const handleExportExcel = async () => {
    try {
      const dashboardData = {
        studentName: student.nombre,
        totalAttempts,
        completedAttempts,
        avgScore,
        attempts: student.attempts.map(attempt => ({
          id: attempt.id,
          estado: attempt.estado,
          porcentaje: attempt.porcentaje,
          correctas: attempt.correctas,
          totalPreguntas: attempt.totalPreguntas,
          puntajePaes: attempt.puntajePaes,
          createdAt: attempt.createdAt,
          exam: {
            titulo: attempt.exam.titulo,
            subject: {
              nombre: attempt.exam.subject.nombre,
              codigo: attempt.exam.subject.codigo,
            },
          },
        })),
        metrics: metrics.map(m => ({
          codigo: m.codigo,
          nombre: m.nombre,
          porcentaje: m.porcentaje,
          totalPreguntas: m.totalPreguntas,
          correctas: m.correctas,
        })),
      }

      toast.loading('Exportando dashboard...', { id: 'export-dashboard' })
      await exportDashboardToExcel(dashboardData)
      toast.success('Exportación exitosa', {
        id: 'export-dashboard',
        description: 'Tu dashboard se ha exportado correctamente a Excel.',
      })
    } catch (error) {
      toast.error('Error al exportar', {
        id: 'export-dashboard',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo exportar el dashboard. Por favor, intenta nuevamente.',
      })
    }
  }

  return (
    <>
      {showTour && <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} />}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    ¡Hola, {student.nombre}! 👋
                  </h1>
                  <HelpIcon
                    content="El Dashboard muestra tu progreso general, estadísticas por asignatura, intentos recientes y recomendaciones personalizadas basadas en tu rendimiento."
                    side="right"
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Bienvenido a tu dashboard de preparación PAES
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setShowGuide(!showGuide)}>
                  <HelpCircle className="h-4 w-4 mr-2" />
                  {showGuide ? 'Ocultar' : 'Mostrar'} Guía
                </Button>
                {!hasSeenTour && (
                  <Button variant="outline" size="sm" onClick={() => setShowTour(true)}>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Tour
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          {showGuide && <QuickGuide />}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              title="Total Intentos"
              description={`${completedAttempts} completados`}
              value={totalAttempts}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatsCard
              title="Promedio General"
              description="Rendimiento promedio"
              value={Math.round(avgScore)}
              percentage={avgScore}
              comparison={{
                value: 60, // Promedio general estimado
                label: 'Promedio general',
              }}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="Asignaturas"
              description="Con métricas registradas"
              value={metrics.length}
              icon={<Target className="h-4 w-4" />}
            />
            <StatsCard
              title="Mejor Puntaje"
              description="En tus intentos"
              value={
                student.attempts.length > 0
                  ? Math.round(Math.max(...student.attempts.map(a => a.porcentaje)))
                  : 0
              }
              percentage={
                student.attempts.length > 0
                  ? Math.max(...student.attempts.map(a => a.porcentaje))
                  : 0
              }
              icon={<Award className="h-4 w-4" />}
              badge={
                student.attempts.length > 0 &&
                Math.max(...student.attempts.map(a => a.porcentaje)) >= 90
                  ? { text: 'Excelente', variant: 'default' }
                  : undefined
              }
            />
          </div>

          {/* Quick Actions */}
          <QuickActions />

          {/* Achievements */}
          <Achievements attempts={student.attempts} avgScore={avgScore} />

          {/* Recommendations */}
          <RecommendationsSection />

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance by Subject */}
            <Card>
              <CardHeader>
                <CardTitle>Rendimiento por Asignatura</CardTitle>
                <CardDescription>Porcentaje de aciertos por materia</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-[300px]">
                      <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                  }
                >
                  <SubjectPerformanceChart data={subjectPerformance} />
                </Suspense>
              </CardContent>
            </Card>

            {/* Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Progreso Temporal</CardTitle>
                <CardDescription>Evolución de tu rendimiento en el tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ProgressChart
                  attempts={student.attempts
                    .filter(a => a.estado === 'completado' && a.startedAt)
                    .map(a => ({
                      porcentaje: a.porcentaje,
                      startedAt: a.startedAt!,
                      exam: {
                        titulo: a.exam.titulo,
                        subject: {
                          codigo: a.exam.subject.codigo,
                        },
                      },
                    }))}
                />
              </CardContent>
            </Card>
          </div>

          {/* Subject Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metrics.map(metric => (
              <Card key={metric.codigo}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{metric.nombre}</CardTitle>
                    <Badge
                      variant={
                        metric.porcentaje >= 70
                          ? 'default'
                          : metric.porcentaje >= 50
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {Math.round(metric.porcentaje)}%
                    </Badge>
                  </div>
                  <CardDescription>
                    {metric.correctas} de {metric.totalPreguntas} correctas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Progress value={metric.porcentaje} className="mb-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Temas evaluados:</p>
                    <div className="flex flex-wrap gap-2">
                      {metric.temas.map((tema, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tema.nombre}: {Math.round(tema.porcentaje)}%
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Attempts */}
          <Card>
            <CardHeader>
              <CardTitle>Últimos Intentos</CardTitle>
              <CardDescription>Historial de tus exámenes recientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.attempts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No has realizado intentos aún</p>
                    <Button className="mt-4">Comenzar Examen</Button>
                  </div>
                ) : (
                  student.attempts.map(attempt => (
                    <Link
                      key={attempt.id}
                      href={`/attempts/${attempt.id}`}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{attempt.exam.titulo}</h3>
                          <Badge
                            variant={attempt.estado === 'completado' ? 'default' : 'secondary'}
                          >
                            {attempt.estado}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {attempt.exam.subject.nombre} • {attempt.correctas}/
                          {attempt.totalPreguntas} correctas
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(attempt.createdAt).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{Math.round(attempt.porcentaje)}%</div>
                        {attempt.puntajePaes && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            PAES: {attempt.puntajePaes}
                          </div>
                        )}
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
