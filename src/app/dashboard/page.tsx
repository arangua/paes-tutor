'use client'

import { useEffect, useState, lazy, Suspense, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  Loader2,
  HelpCircle,
  PlayCircle,
} from 'lucide-react'
import { exportDashboardToExcel } from '@/lib/export-utils'
import { toast } from 'sonner'
import { StatsCard } from '@/components/dashboard/stats-card'
import { ProgressChart } from '@/components/dashboard/progress-chart'
import { QuickActions } from '@/components/dashboard/quick-actions'
import { Achievements } from '@/components/dashboard/achievements'
import { RecommendationsSection } from '@/components/recommendations/recommendations-section'
import { JointProgress } from '@/components/dashboard/joint-progress'
import { WelcomeTour } from '@/components/help/welcome-tour'
import { QuickGuide } from '@/components/help/quick-guide'
import { HelpIcon } from '@/components/help/help-icon'
import { ExportButton } from '@/components/export/export-button'
import { safeMathMax, safeRound } from '@/app/api/notes/versions/validation-utils'
import { CollapsibleSection } from '@/components/ui/collapsible-section'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { ErrorMessageComponent } from '@/components/ui/error-message'
import { SubjectIcon } from '@/lib/subject-icons'
import { trackError } from '@/lib/monitoring'
import { getRecordValue } from '@/lib/safe-record'
import { DashboardTutorial } from '@/components/tutorial/dashboard-tutorial'
import { ActionHistory } from '@/components/dashboard/action-history'
import { PendingReminders } from '@/components/dashboard/pending-reminders'
import { ErrorHistory } from '@/components/dashboard/error-history'

// Lazy load recharts para reducir el bundle inicial
const SubjectPerformanceChart = lazy(() =>
  import('@/components/charts/PerformanceCharts').then(mod => ({
    default: mod.SubjectPerformanceChart,
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

function getDashboardPath(): string {
  if (typeof globalThis !== 'undefined' && globalThis.window) {
    return globalThis.window.location.pathname
  }
  return '/dashboard'
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function getErrorFromPayload(payload: unknown): string | null {
  if (!isRecord(payload)) return null
  const error = payload.error
  return typeof error === 'string' && error.trim().length > 0 ? error : null
}

function getErrorFromFirstArrayItem(payload: unknown): string | null {
  if (!Array.isArray(payload) || payload.length === 0) return null
  const first = payload[0]
  if (!isRecord(first)) return null
  const error = first.error
  return typeof error === 'string' && error.trim().length > 0 ? error : null
}

async function safeJsonError(res: Response, operation: string): Promise<string | null> {
  const { safeJsonParse } = await import('@/lib/api-helpers')
  const data = await safeJsonParse<{ error?: string }>(res, {
    path: getDashboardPath(),
    operation,
  })
  return typeof data.error === 'string' && data.error.trim().length > 0 ? data.error : null
}

async function parseStudentOrThrow(studentRes: Response): Promise<Student> {
  if (!studentRes.ok) {
    const parsedError = await safeJsonError(studentRes, 'obtener datos del estudiante')
    throw new Error(
      parsedError || `Error ${studentRes.status}: Error al obtener datos del estudiante`
    )
  }

  const studentData = (await studentRes.json()) as unknown
  const payloadError = getErrorFromPayload(studentData)
  if (payloadError) throw new Error(payloadError)
  return studentData as Student
}

async function parseMetricsOrDefault(metricsRes: Response): Promise<Metric[]> {
  if (metricsRes.ok) {
    const metricsData = (await metricsRes.json()) as unknown
    const payloadError = getErrorFromPayload(metricsData) ?? getErrorFromFirstArrayItem(metricsData)
    if (payloadError) throw new Error(payloadError)
    return Array.isArray(metricsData) ? (metricsData as Metric[]) : []
  }

  if (metricsRes.status === 404) {
    const parsedError = await safeJsonError(metricsRes, 'obtener métricas')
    if (parsedError?.includes('Estudiante no encontrado')) {
      throw new Error(parsedError)
    }
    return []
  }

  const parsedError = await safeJsonError(metricsRes, 'obtener métricas')
  if (metricsRes.status === 401 || metricsRes.status >= 500) {
    throw new Error(parsedError || `Error ${metricsRes.status}: Error al obtener métricas`)
  }
  return []
}

async function trySetPendingCountFromArrayKey(
  res: unknown,
  arrayKey: string,
  setter: (value: number) => void
): Promise<void> {
  try {
    if (!isRecord(res) || res.ok !== true) return
    const jsonFn = res.json
    if (typeof jsonFn !== 'function') return
    const data = (await jsonFn.call(res)) as unknown
    if (!isRecord(data)) return
    const value = getRecordValue(data, arrayKey)
    if (Array.isArray(value)) {
      setter(value.length)
    }
  } catch {
    // Ignorar errores de endpoints opcionales
  }
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
  const [pendingFlashcards, setPendingFlashcards] = useState(0)
  const [pendingChallenges, setPendingChallenges] = useState(0)
  const [pendingReviews, setPendingReviews] = useState(0)

  // Calcular estadísticas generales (memoizadas para evitar recálculos)
  // Nota: Estos cálculos se hacen antes de los early returns para cumplir con las reglas de React Hooks
  const { totalAttempts, avgScore, completedAttempts, pendingAttempts } = useMemo(() => {
    if (!student) {
      return { totalAttempts: 0, avgScore: 0, completedAttempts: 0, pendingAttempts: [] }
    }
    const total = student.attempts.length
    const avg = total > 0 ? student.attempts.reduce((sum, a) => sum + a.porcentaje, 0) / total : 0
    const completed = student.attempts.filter(a => a.estado === 'completado').length
    const pending = student.attempts
      .filter(a => a.estado === 'en_progreso')
      .map(a => ({
        id: a.id,
        exam: {
          id: a.exam.id || '',
          titulo: a.exam.titulo,
          subject: {
            codigo: a.exam.subject.codigo,
            nombre: a.exam.subject.nombre,
          },
        },
        startedAt: a.startedAt || a.createdAt,
        totalPreguntas: a.totalPreguntas,
        correctas: a.correctas,
      }))
    return {
      totalAttempts: total,
      avgScore: avg,
      completedAttempts: completed,
      pendingAttempts: pending,
    }
  }, [student])

  // Preparar datos para gráficos (memoizadas)
  const subjectPerformance = useMemo(
    () =>
      metrics.map(m => ({
        name: m.codigo,
        porcentaje: safeRound(m.porcentaje, 0),
      })),
    [metrics]
  )

  const handleExportExcel = useCallback(async () => {
    if (!student) return

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
      const errorInfo = extractErrorInfo(error)
      const structuredError = getErrorMessage(ERROR_CODES.DATA_EXPORT_FAILED, {
        reason: errorInfo.message,
        context: { action: 'export_dashboard' },
      })

      toast.error(structuredError.title, {
        id: 'export-dashboard',
        description: `${structuredError.description} ${structuredError.solution}`,
      })

      // Log del error para debugging
      trackError(error instanceof Error ? error : new Error(String(error)), {
        type: 'export_error',
        action: 'export_dashboard',
        context: { studentId: student.id },
      })
    }
  }, [student, totalAttempts, completedAttempts, avgScore, metrics])

  const handleTourComplete = useCallback(() => {
    if (typeof globalThis !== 'undefined' && globalThis.window) {
      globalThis.window.localStorage.setItem('paes-tutor-tour-seen', 'true')
    }
    setShowTour(false)
    setHasSeenTour(true)
  }, [])

  const handleTourSkip = useCallback(() => {
    if (typeof globalThis !== 'undefined' && globalThis.window) {
      globalThis.window.localStorage.setItem('paes-tutor-tour-seen', 'true')
    }
    setShowTour(false)
    setHasSeenTour(true)
  }, [])

  useEffect(() => {
    // Verificar si el usuario ya vio el tour (solo en cliente)
    if (typeof globalThis !== 'undefined' && globalThis.window) {
      const seen = globalThis.window.localStorage.getItem('paes-tutor-tour-seen')
      setHasSeenTour(!!seen)

      // Mostrar tour si es primera vez
      const isFirstVisit = globalThis.window.localStorage.getItem(
        'paes-tutor-dashboard-first-visit' // guard:allow-secret
      )
      if (!seen && !isFirstVisit) {
        setShowTour(true)
        globalThis.window.localStorage.setItem('paes-tutor-dashboard-first-visit', 'true') // guard:allow-secret
      }
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const [studentRes, metricsRes, flashcardsRes, challengesRes, reviewsRes] =
          await Promise.all([
            fetch('/api/student', { credentials: 'include' }),
            fetch('/api/metrics', { credentials: 'include' }),
            fetch('/api/flashcards?dueOnly=true', { credentials: 'include' }).catch(() => ({ ok: false })),
            fetch('/api/challenges?status=pending', { credentials: 'include' }).catch(() => ({ ok: false })),
            fetch('/api/review/quick?limit=1', { credentials: 'include' }).catch(() => ({ ok: false })),
          ])

        // Manejar errores de autenticación
        if (studentRes.status === 401 || metricsRes.status === 401) {
          // Redirigir a login si no está autenticado
          router.push('/auth/signin?callbackUrl=/dashboard')
          return
        }

        const [studentData, metricsData] = await Promise.all([
          parseStudentOrThrow(studentRes),
          parseMetricsOrDefault(metricsRes),
        ])

        setStudent(studentData)
        setMetrics(metricsData)

        // Procesar datos de recordatorios (sin bloquear si fallan)
        await Promise.all([
          trySetPendingCountFromArrayKey(flashcardsRes, 'flashcards', setPendingFlashcards),
          trySetPendingCountFromArrayKey(challengesRes, 'challenges', setPendingChallenges),
          trySetPendingCountFromArrayKey(reviewsRes, 'questions', setPendingReviews),
        ])
      } catch (error) {
        // Manejar errores con sistema estructurado
        const errorInfo = extractErrorInfo(error)
        const errorMessage = getErrorMessage(ERROR_CODES.SYSTEM_LOAD_FAILED, {
          message: errorInfo.message,
          context: 'dashboard',
        })
        setError(JSON.stringify(errorMessage))
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    // router de Next.js es estable y no cambia entre renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
            <div className="absolute inset-0 h-12 w-12 mx-auto">
              <div className="h-full w-full border-4 border-gray-200 dark:border-gray-800 rounded-full animate-ping opacity-20"></div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Cargando dashboard...
            </p>
            <p className="text-sm text-muted-foreground">Obteniendo tus estadísticas y progreso</p>
          </div>
        </div>
      </div>
    )
  }

  // Procesar error para mostrar mensaje estructurado
  let processedError = null
  if (error) {
    try {
      processedError = JSON.parse(error)
    } catch {
      extractErrorInfo(error)
      processedError = getErrorMessage(ERROR_CODES.SYSTEM_LOAD_FAILED, {
        message: error,
      })
    }
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          {processedError && (
            <ErrorMessageComponent
              error={processedError}
              onAction={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }}
            />
          )}
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

  return (
    <>
      {showTour && <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} />}
      <DashboardTutorial />
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
                <ExportButton onExportExcel={handleExportExcel} variant="outline" size="sm" />
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
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            data-tutorial="stats-cards"
          >
            <StatsCard
              title="Total Intentos"
              description={`${completedAttempts} completados`}
              value={totalAttempts}
              icon={<BookOpen className="h-4 w-4" />}
            />
            <StatsCard
              title="Promedio General"
              description="Rendimiento promedio"
              value={safeRound(avgScore, 0)}
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
                  ? safeRound(safeMathMax(student.attempts.map(a => a.porcentaje), 0), 0)
                  : 0
              }
              percentage={
                student.attempts.length > 0
                  ? safeMathMax(student.attempts.map(a => a.porcentaje), 0)
                  : 0
              }
              icon={<Award className="h-4 w-4" />}
              badge={
                student.attempts.length > 0 &&
                safeMathMax(student.attempts.map(a => a.porcentaje), 0) >= 90
                  ? { text: 'Excelente', variant: 'default' }
                  : undefined
              }
            />
          </div>

          {/* Quick Actions */}
          <div data-tutorial="quick-actions">
            <QuickActions />
          </div>

          {/* Pending Reminders */}
          <PendingReminders
            pendingAttempts={pendingAttempts}
            pendingFlashcards={pendingFlashcards}
            pendingChallenges={pendingChallenges}
            pendingReviews={pendingReviews}
          />

          {/* Error History */}
          <ErrorHistory />

          {/* Action History and Joint Progress - Side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ActionHistory />
            <JointProgress />
          </div>

          {/* Achievements */}
          <Achievements attempts={student.attempts} avgScore={avgScore} />

          {/* Recommendations */}
          <div data-tutorial="recommendations">
            <RecommendationsSection />
          </div>

          {/* Charts Row - Colapsable */}
          <CollapsibleSection
            title="Gráficos de Rendimiento"
            description="Visualiza tu progreso con gráficos interactivos"
            defaultOpen={false}
            storageKey="dashboard-charts-collapsed"
            className="[&>div]:data-tutorial-charts"
          >
            <div data-tutorial="charts">
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
            </div>
          </CollapsibleSection>

          {/* Subject Details - Colapsable */}
          <CollapsibleSection
            title="Detalles por Asignatura"
            description="Revisa tu rendimiento detallado por materia"
            defaultOpen={false}
            storageKey="dashboard-subjects-collapsed"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {metrics.map(metric => {
                // Determinar variante del badge basado en el porcentaje
                let badgeVariant: 'default' | 'secondary' | 'destructive'
                if (metric.porcentaje >= 70) {
                  badgeVariant = 'default'
                } else if (metric.porcentaje >= 50) {
                  badgeVariant = 'secondary'
                } else {
                  badgeVariant = 'destructive'
                }

                return (
                  <Card key={metric.codigo}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SubjectIcon codigo={metric.codigo} size={20} />
                          <CardTitle className="text-lg">{metric.nombre}</CardTitle>
                        </div>
                        <Badge variant={badgeVariant}>{safeRound(metric.porcentaje, 0)}%</Badge>
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
                          {metric.temas.map(tema => (
                            <Badge
                              key={`${tema.nombre}-${tema.porcentaje}`}
                              variant="outline"
                              className="text-xs"
                            >
                              {tema.nombre}: {safeRound(tema.porcentaje, 0)}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CollapsibleSection>

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
                        <div className="text-2xl font-bold">{safeRound(attempt.porcentaje, 0)}%</div>
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
