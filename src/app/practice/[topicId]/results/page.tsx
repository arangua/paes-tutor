'use client'

import { useEffect, useState, startTransition } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle, AlertCircle, Loader2, RotateCcw, Home } from 'lucide-react'
import { captureError } from '@/lib/monitoring'

interface PracticeSession {
  id: string
  topicId: string
  totalPreguntas: number
  correctas: number
  incorrectas: number
  omitidas: number
  porcentaje: number
  duracionSegundos: number | null
  startedAt: string
  finishedAt: string | null
  topic: {
    nombre: string
    ejeTematico: string
  }
}

export default function PracticeResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const topicId = params.topicId as string
  const sessionId = searchParams.get('sessionId')

  const [session, setSession] = useState<PracticeSession | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // La sesión se obtiene del estado de navegación o localStorage
    // En el futuro, podríamos crear un endpoint GET /api/practice/sessions/[id]
    // Por ahora, usamos datos del estado de navegación
    const sessionData = sessionStorage.getItem(`practice-session-${sessionId}`)
    if (sessionData) {
      try {
        // Usar startTransition para evitar renders en cascada
        const parsedSession = JSON.parse(sessionData)
        startTransition(() => {
          setSession(parsedSession)
        })
      } catch (err) {
        captureError(err instanceof Error ? err : new Error(String(err)), {
          type: 'practice_session_parse_error',
          sessionId,
          path: typeof window !== 'undefined' ? window.location.pathname : undefined,
        })
      }
    }
    // Usar startTransition para evitar renders en cascada
    startTransition(() => {
      setLoading(false)
    })
  }, [sessionId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getScoreColor = (porcentaje: number) => {
    if (porcentaje >= 80) return 'text-green-600'
    if (porcentaje >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBadge = (porcentaje: number) => {
    if (porcentaje >= 80) return 'default'
    if (porcentaje >= 60) return 'secondary'
    return 'destructive'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/practice')}>Volver a Práctica</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Sesión no encontrada
            </CardTitle>
            <CardDescription>
              No se pudo cargar la información de la sesión de práctica.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/practice')}>Volver a Práctica</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const displaySession = session

  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resultados de Práctica</h1>
          <p className="text-muted-foreground mt-2">{displaySession.topic.nombre}</p>
        </div>
        <Badge variant={getScoreBadge(displaySession.porcentaje)} className="text-lg px-4 py-2">
          {displaySession.porcentaje.toFixed(1)}%
        </Badge>
      </div>

      {/* Score Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Puntuación</span>
            <span className={`text-3xl font-bold ${getScoreColor(displaySession.porcentaje)}`}>
              {displaySession.porcentaje.toFixed(1)}%
            </span>
          </div>
          <Progress value={displaySession.porcentaje} className="h-3" />

          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-2xl font-bold text-green-600">
                  {displaySession.correctas}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Correctas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <span className="text-2xl font-bold text-red-600">
                  {displaySession.incorrectas}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Incorrectas</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950/20">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-600">
                  {displaySession.omitidas}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Omitidas</p>
            </div>
          </div>

          {displaySession.duracionSegundos && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tiempo total</span>
                <span className="font-semibold">{formatTime(displaySession.duracionSegundos)}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones</CardTitle>
        </CardHeader>
        <CardContent>
          {displaySession.porcentaje >= 80 ? (
            <div className="space-y-2">
              <p className="text-green-600 font-semibold">¡Excelente trabajo!</p>
              <p className="text-sm text-muted-foreground">
                Has demostrado un buen dominio de este tema. Considera practicar otros temas o
                aumentar la dificultad.
              </p>
            </div>
          ) : displaySession.porcentaje >= 60 ? (
            <div className="space-y-2">
              <p className="text-yellow-600 font-semibold">Buen progreso</p>
              <p className="text-sm text-muted-foreground">
                Estás en el camino correcto. Revisa las preguntas incorrectas y considera practicar
                más este tema.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-red-600 font-semibold">Necesitas más práctica</p>
              <p className="text-sm text-muted-foreground">
                Este tema requiere más atención. Revisa los materiales de estudio y vuelve a
                practicar.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={() => router.push('/practice')}>
          <Home className="h-4 w-4 mr-2" />
          Volver a Práctica
        </Button>
        <Button onClick={() => router.push(`/practice/${topicId}`)}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Practicar Nuevamente
        </Button>
      </div>
    </div>
  )
}
