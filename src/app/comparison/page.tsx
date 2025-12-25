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
  Trophy,
  Award,
  Target,
  Users,
  BarChart3,
} from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'
import Link from 'next/link'

interface ComparisonData {
  current: {
    student: {
      id: string
      nombre: string
      email: string | null
    }
    stats: {
      totalAttempts: number
      averagePercentage: number
      bestPercentage: number
      worstPercentage: number
      averagePaesScore: number | null
      bestPaesScore: number | null
      totalCorrect: number
      totalQuestions: number
      recentTrend: 'improving' | 'declining' | 'stable'
    }
    subjectStats: Array<{
      subjectCode: string
      subjectName: string
      totalAttempts: number
      averagePercentage: number
      bestPercentage: number
      averagePaesScore: number | null
    }>
  }
  other: {
    student: {
      id: string
      nombre: string
      email: string | null
    }
    stats: {
      totalAttempts: number
      averagePercentage: number
      bestPercentage: number
      worstPercentage: number
      averagePaesScore: number | null
      bestPaesScore: number | null
      totalCorrect: number
      totalQuestions: number
      recentTrend: 'improving' | 'declining' | 'stable'
    }
    subjectStats: Array<{
      subjectCode: string
      subjectName: string
      totalAttempts: number
      averagePercentage: number
      bestPercentage: number
      averagePaesScore: number | null
    }>
  }
  commonExams: Array<{
    examId: string
    examTitle: string
    subject: {
      codigo: string
      nombre: string
    }
    current: {
      porcentaje: number
      puntajePaes: number | null
      correctas: number
      totalPreguntas: number
      createdAt: string
    }
    other: {
      porcentaje: number
      puntajePaes: number | null
      correctas: number
      totalPreguntas: number
      createdAt: string
    }
    winner: 'current' | 'other' | 'tie'
  }>
  summary: {
    currentWins: number
    otherWins: number
    ties: number
    averageDifference: number
  }
}

export default function DirectComparisonPage() {
  const [data, setData] = useState<ComparisonData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComparison()
  }, [])

  async function loadComparison() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/analytics/direct-comparison')
      if (!res.ok) throw new Error('Error al cargar comparación')
      const response = await res.json()

      if (response.message) {
        setError(response.message)
        return
      }

      setData(response)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar comparación')
    } finally {
      setLoading(false)
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-6">
        <BackButton />
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Comparación Directa</CardTitle>
            <CardDescription>Compara tu progreso con el otro estudiante</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              {error || 'No hay datos disponibles para comparar'}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { current, other, commonExams, summary } = data

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Comparación Directa</h1>
          <p className="text-muted-foreground mt-2">
            Compara tu progreso con {other.student.nombre}
          </p>
        </div>
        <BackButton />
      </div>

      {/* Resumen General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Resumen General
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{current.student.nombre}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Ganó {summary.currentWins} exámenes
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">Empates</div>
              <div className="text-sm text-muted-foreground mt-1">{summary.ties} exámenes</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">{other.student.nombre}</div>
              <div className="text-sm text-muted-foreground mt-1">
                Ganó {summary.otherWins} exámenes
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Diferencia promedio:</span>
              <span
                className={`font-bold ${summary.averageDifference > 0 ? 'text-green-600' : summary.averageDifference < 0 ? 'text-red-600' : 'text-gray-600'}`}
              >
                {summary.averageDifference > 0 ? '+' : ''}
                {summary.averageDifference.toFixed(1)}%
              </span>
            </div>
            {summary.averageDifference > 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {current.student.nombre} tiene un promedio {summary.averageDifference.toFixed(1)}%
                mayor
              </p>
            )}
            {summary.averageDifference < 0 && (
              <p className="text-sm text-muted-foreground mt-1">
                {other.student.nombre} tiene un promedio{' '}
                {Math.abs(summary.averageDifference).toFixed(1)}% mayor
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usuario Actual */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {current.student.nombre}
            </CardTitle>
            <CardDescription>Tus estadísticas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Promedio General</span>
                <span className="font-bold">{current.stats.averagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={current.stats.averagePercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Mejor Resultado</div>
                <div className="text-lg font-bold">{current.stats.bestPercentage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Intentos</div>
                <div className="text-lg font-bold">{current.stats.totalAttempts}</div>
              </div>
              {current.stats.averagePaesScore && (
                <div>
                  <div className="text-sm text-muted-foreground">Promedio PAES</div>
                  <div className="text-lg font-bold">
                    {current.stats.averagePaesScore.toFixed(0)} pts
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Tendencia</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(current.stats.recentTrend)}
                  <span className="text-sm">
                    {current.stats.recentTrend === 'improving'
                      ? 'Mejorando'
                      : current.stats.recentTrend === 'declining'
                        ? 'Bajando'
                        : 'Estable'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Otro Usuario */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {other.student.nombre}
            </CardTitle>
            <CardDescription>Estadísticas de {other.student.nombre}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Promedio General</span>
                <span className="font-bold">{other.stats.averagePercentage.toFixed(1)}%</span>
              </div>
              <Progress value={other.stats.averagePercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Mejor Resultado</div>
                <div className="text-lg font-bold">{other.stats.bestPercentage.toFixed(1)}%</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Total Intentos</div>
                <div className="text-lg font-bold">{other.stats.totalAttempts}</div>
              </div>
              {other.stats.averagePaesScore && (
                <div>
                  <div className="text-sm text-muted-foreground">Promedio PAES</div>
                  <div className="text-lg font-bold">
                    {other.stats.averagePaesScore.toFixed(0)} pts
                  </div>
                </div>
              )}
              <div>
                <div className="text-sm text-muted-foreground">Tendencia</div>
                <div className="flex items-center gap-1">
                  {getTrendIcon(other.stats.recentTrend)}
                  <span className="text-sm">
                    {other.stats.recentTrend === 'improving'
                      ? 'Mejorando'
                      : other.stats.recentTrend === 'declining'
                        ? 'Bajando'
                        : 'Estable'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparación por Asignatura */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Comparación por Asignatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(() => {
              const allSubjects = new Set([
                ...current.subjectStats.map(s => s.subjectCode),
                ...other.subjectStats.map(s => s.subjectCode),
              ])

              return Array.from(allSubjects).map(subjectCode => {
                const currentSubject = current.subjectStats.find(s => s.subjectCode === subjectCode)
                const otherSubject = other.subjectStats.find(s => s.subjectCode === subjectCode)

                if (!currentSubject && !otherSubject) return null

                const currentAvg = currentSubject?.averagePercentage || 0
                const otherAvg = otherSubject?.averagePercentage || 0
                const winner =
                  currentAvg > otherAvg
                    ? current.student.nombre
                    : currentAvg < otherAvg
                      ? other.student.nombre
                      : 'Empate'

                return (
                  <div key={subjectCode} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-semibold">
                        {currentSubject?.subjectName || otherSubject?.subjectName}
                      </h3>
                      <Badge
                        variant={
                          currentAvg > otherAvg
                            ? 'default'
                            : currentAvg < otherAvg
                              ? 'secondary'
                              : 'outline'
                        }
                      >
                        {winner}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {current.student.nombre}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={currentAvg} className="flex-1 h-2" />
                          <span className="text-sm font-bold w-16 text-right">
                            {currentAvg.toFixed(1)}%
                          </span>
                        </div>
                        {currentSubject && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {currentSubject.totalAttempts} intento
                            {currentSubject.totalAttempts !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">
                          {other.student.nombre}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={otherAvg} className="flex-1 h-2" />
                          <span className="text-sm font-bold w-16 text-right">
                            {otherAvg.toFixed(1)}%
                          </span>
                        </div>
                        {otherSubject && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {otherSubject.totalAttempts} intento
                            {otherSubject.totalAttempts !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </CardContent>
      </Card>

      {/* Exámenes Comunes */}
      {commonExams.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Exámenes Comunes
            </CardTitle>
            <CardDescription>
              Exámenes que ambos han realizado ({commonExams.length} total)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {commonExams.map(exam => (
                <div key={exam.examId} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{exam.examTitle}</h3>
                      <p className="text-sm text-muted-foreground">{exam.subject.nombre}</p>
                    </div>
                    {exam.winner === 'current' && (
                      <Badge className="bg-green-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {current.student.nombre} ganó
                      </Badge>
                    )}
                    {exam.winner === 'other' && (
                      <Badge className="bg-blue-600">
                        <Trophy className="h-3 w-3 mr-1" />
                        {other.student.nombre} ganó
                      </Badge>
                    )}
                    {exam.winner === 'tie' && <Badge variant="outline">Empate</Badge>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium mb-2">{current.student.nombre}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resultado:</span>
                          <span className="font-bold">{exam.current.porcentaje.toFixed(1)}%</span>
                        </div>
                        {exam.current.puntajePaes && (
                          <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.current.puntajePaes} pts</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Fecha:</span>
                          <span>{formatDate(exam.current.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">{other.student.nombre}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Resultado:</span>
                          <span className="font-bold">{exam.other.porcentaje.toFixed(1)}%</span>
                        </div>
                        {exam.other.puntajePaes && (
                          <div className="flex justify-between text-sm">
                            <span>PAES:</span>
                            <span className="font-bold">{exam.other.puntajePaes} pts</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Fecha:</span>
                          <span>{formatDate(exam.other.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <Link
                      href={`/exams/${exam.examId}/take`}
                      className="text-sm text-primary hover:underline"
                    >
                      Ver examen →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {commonExams.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              Aún no hay exámenes comunes. Realiza exámenes para comparar resultados.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
