'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Target,
  BookOpen,
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { getErrorMessage, extractErrorInfo, ERROR_CODES } from '@/lib/error-messages'
import { trackError } from '@/lib/monitoring'

type ProgressTrend = 'improving' | 'declining' | 'stable'

interface JointProgressData {
  current: {
    student: {
      id: string
      nombre: string
      email: string | null
    }
    progress: {
      totalAttempts: number
      averagePercentage: number
      bestPercentage: number
      averagePaesScore: number | null
      bestPaesScore: number | null
      recentAttempts: Array<{
        id: string
        porcentaje: number
        puntajePaes: number | null
        correctas: number
        totalPreguntas: number
        createdAt: string
        exam: {
          id: string
          titulo: string
          subject: {
            id: string
            nombre: string
            codigo: string
          }
        }
      }>
      topTopics: Array<{
        topicId: string
        porcentaje: number
        totalPreguntas: number
        correctas: number
        topic: {
          nombre: string
          subject: {
            nombre: string
            codigo: string
          }
        }
      }>
      trend: ProgressTrend
    }
  }
  other: {
    student: {
      id: string
      nombre: string
      email: string | null
    }
    progress: {
      totalAttempts: number
      averagePercentage: number
      bestPercentage: number
      averagePaesScore: number | null
      bestPaesScore: number | null
      recentAttempts: Array<{
        id: string
        porcentaje: number
        puntajePaes: number | null
        correctas: number
        totalPreguntas: number
        createdAt: string
        exam: {
          id: string
          titulo: string
          subject: {
            id: string
            nombre: string
            codigo: string
          }
        }
      }>
      topTopics: Array<{
        topicId: string
        porcentaje: number
        totalPreguntas: number
        correctas: number
        topic: {
          nombre: string
          subject: {
            nombre: string
            codigo: string
          }
        }
      }>
      trend: ProgressTrend
    }
  }
}

function shouldHideJointProgress(res: Response, errorData: { message?: string } | null): boolean {
  return res.status === 429 || res.status === 401 || Boolean(errorData?.message)
}

function reportJointProgressLoadFailure(params: {
  kind: 'server_error' | 'validation_error'
  status?: number
  error: unknown
  endpoint: string
}) {
  const { kind, status, error, endpoint } = params
  const errorInfo = extractErrorInfo(error instanceof Error ? error : new Error(String(error)))

  const code = ERROR_CODES.SYSTEM_LOAD_FAILED

  const errorMessage = getErrorMessage(code, {
    message: errorInfo.message,
    context: { endpoint: 'joint-progress', status },
  })

  trackError(new Error(`[${errorInfo.code}] ${errorMessage.description}`), {
    type: kind === 'validation_error' ? 'joint_progress_validation_error' : 'joint_progress_load_error',
    status,
    endpoint,
  })

  toast.error(errorMessage.title, { description: errorMessage.description })
}

async function handleJointProgressHttpError(res: Response): Promise<void> {
  // Casos esperados: ocultar componente sin reportar
  if (shouldHideJointProgress(res, null)) return

  const { safeJsonParse } = await import('@/lib/api-helpers')
  const errorData = await safeJsonParse<{ error?: string; message?: string }>(res, {
    path: typeof window !== 'undefined' ? window.location.pathname : '/dashboard',
    operation: 'cargar progreso conjunto',
  })

  if (shouldHideJointProgress(res, errorData)) return

  // Solo para errores reales del servidor (500, 503, etc.)
  if (res.status >= 500) {
    reportJointProgressLoadFailure({
      kind: 'server_error',
      status: res.status,
      error: errorData.error || 'Error al cargar progreso conjunto',
      endpoint: '/api/analytics/joint-progress',
    })
  }
}

async function handleJointProgressSuccess(res: Response): Promise<JointProgressData | null> {
  // Validar respuesta con Zod para type safety en runtime
  const { validateResponse } = await import('@/lib/api-helpers')
  const { jointProgressResponseSchema } = await import('@/lib/validations')

  const validation = await validateResponse(res, jointProgressResponseSchema, {
    path: typeof window !== 'undefined' ? window.location.pathname : '/dashboard',
    operation: 'cargar progreso conjunto',
  })

  if (!validation.success) {
    reportJointProgressLoadFailure({
      kind: 'validation_error',
      status: res.status,
      error: validation.error,
      endpoint: '/api/analytics/joint-progress',
    })
    return null
  }

  const response = validation.data

  if (response.message) {
    // No hay suficientes estudiantes, no mostrar el componente
    // Esto es un caso esperado, no un error
    return null
  }

  return response
}

async function fetchJointProgressData(): Promise<JointProgressData | null> {
  const res = await fetch('/api/analytics/joint-progress')
  if (!res.ok) {
    await handleJointProgressHttpError(res)
    return null
  }
  return await handleJointProgressSuccess(res)
}

export function JointProgress() {
  const [data, setData] = useState<JointProgressData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadJointProgress()
  }, [])

  async function loadJointProgress() {
    try {
      setLoading(true)
      const nextData = await fetchJointProgressData()
      setData(nextData)
    } catch (error) {
      // Manejar errores de red u otros errores inesperados
      // Solo registrar si es un error real de red, no errores de parsing JSON
      const isNetworkError = error instanceof TypeError && error.message.includes('fetch')
      const isRealError = error instanceof Error && !error.message.includes('JSON')

      if (isNetworkError || isRealError) {
        const errorInfo = extractErrorInfo(error)
        const errorMessage = getErrorMessage(ERROR_CODES.NETWORK_SERVER_ERROR, {
          message: errorInfo.message,
          context: { endpoint: 'joint-progress' },
        })

        // Solo registrar errores de red reales, no errores de parsing
        trackError(error instanceof Error ? error : new Error(String(error)), {
          type: 'joint_progress_load_error',
          endpoint: '/api/analytics/joint-progress',
          errorType: 'network_error',
        })

        toast.error(errorMessage.title, {
          description: errorMessage.description,
        })
      }

      // En cualquier caso, ocultar el componente
      setData(null)
    } finally {
      setLoading(false)
    }
  }

  const getTrendIcon = (trend: ProgressTrend) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      default:
        return <Minus className="h-4 w-4 text-gray-600" />
    }
  }

  const getPercentageBadgeVariant = (percentage: number) => {
    if (percentage >= 70) return 'default'
    if (percentage >= 50) return 'secondary'
    return 'destructive'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Progreso Conjunto
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!data) {
    return null // No mostrar si no hay suficientes estudiantes
  }

  const { current, other } = data

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Progreso Conjunto
            </CardTitle>
            <CardDescription>Compara tu progreso con {other.student.nombre}</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/comparison">Ver Comparación Completa</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Estadísticas Generales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Usuario Actual */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{current.student.nombre}</h3>
              {getTrendIcon(current.progress.trend)}
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Promedio</span>
                  <span className="font-bold">
                    {current.progress.averagePercentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={current.progress.averagePercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mejor:</span>
                  <span className="ml-2 font-bold">
                    {current.progress.bestPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Intentos:</span>
                  <span className="ml-2 font-bold">{current.progress.totalAttempts}</span>
                </div>
                {current.progress.averagePaesScore && (
                  <div>
                    <span className="text-muted-foreground">PAES Prom:</span>
                    <span className="ml-2 font-bold">
                      {current.progress.averagePaesScore.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Otro Usuario */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{other.student.nombre}</h3>
              {getTrendIcon(other.progress.trend)}
            </div>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Promedio</span>
                  <span className="font-bold">{other.progress.averagePercentage.toFixed(1)}%</span>
                </div>
                <Progress value={other.progress.averagePercentage} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Mejor:</span>
                  <span className="ml-2 font-bold">
                    {other.progress.bestPercentage.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">Intentos:</span>
                  <span className="ml-2 font-bold">{other.progress.totalAttempts}</span>
                </div>
                {other.progress.averagePaesScore && (
                  <div>
                    <span className="text-muted-foreground">PAES Prom:</span>
                    <span className="ml-2 font-bold">
                      {other.progress.averagePaesScore.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Últimos Exámenes */}
        <div className="space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Últimos Exámenes Realizados
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Exámenes del usuario actual */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                {current.student.nombre}
              </div>
              {current.progress.recentAttempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no has realizado exámenes</p>
              ) : (
                current.progress.recentAttempts.slice(0, 3).map(attempt => (
                  <div
                    key={attempt.id}
                    className="p-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <Link
                        href={`/exams/${attempt.exam.id}/results`}
                        className="font-medium hover:underline line-clamp-1 flex-1"
                      >
                        {attempt.exam.titulo}
                      </Link>
                      <Badge
                        variant={getPercentageBadgeVariant(attempt.porcentaje)}
                        className="ml-2"
                      >
                        {attempt.porcentaje.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{attempt.exam.subject.codigo}</span>
                      <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Exámenes del otro usuario */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-muted-foreground mb-2">
                {other.student.nombre}
              </div>
              {other.progress.recentAttempts.length === 0 ? (
                <p className="text-sm text-muted-foreground">Aún no ha realizado exámenes</p>
              ) : (
                other.progress.recentAttempts.slice(0, 3).map(attempt => (
                  <div
                    key={attempt.id}
                    className="p-2 border rounded-lg text-sm hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium line-clamp-1 flex-1">{attempt.exam.titulo}</span>
                      <Badge
                        variant={getPercentageBadgeVariant(attempt.porcentaje)}
                        className="ml-2"
                      >
                        {attempt.porcentaje.toFixed(0)}%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{attempt.exam.subject.codigo}</span>
                      <span>{formatDate(attempt.createdAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Top Temas */}
        {(current.progress.topTopics.length > 0 || other.progress.topTopics.length > 0) && (
          <div className="space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <Target className="h-4 w-4" />
              Mejores Temas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Temas del usuario actual */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {current.student.nombre}
                </div>
                {current.progress.topTopics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aún no hay métricas</p>
                ) : (
                  current.progress.topTopics.map(metric => (
                    <div key={metric.topicId} className="p-2 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium line-clamp-1">{metric.topic.nombre}</span>
                        <Badge variant="default">{metric.porcentaje.toFixed(0)}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.topic.subject.codigo} • {metric.correctas}/{metric.totalPreguntas}{' '}
                        correctas
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Temas del otro usuario */}
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground mb-2">
                  {other.student.nombre}
                </div>
                {other.progress.topTopics.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Aún no hay métricas</p>
                ) : (
                  other.progress.topTopics.map(metric => (
                    <div key={metric.topicId} className="p-2 border rounded-lg text-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium line-clamp-1">{metric.topic.nombre}</span>
                        <Badge variant="default">{metric.porcentaje.toFixed(0)}%</Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {metric.topic.subject.codigo} • {metric.correctas}/{metric.totalPreguntas}{' '}
                        correctas
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
