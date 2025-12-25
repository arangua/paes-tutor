'use client'

import { useEffect, useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, TrendingUp, Users, Award, Target, BarChart3, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { HelpIcon } from '@/components/help/help-icon'
import { BackButton } from '@/components/navigation/back-button'

interface UserStats {
  totalAttempts: number
  averagePercentage: number
  bestPercentage: number
  averagePaesScore: number | null
  percentile: number
  bestPercentile: number
  rank: number
  totalStudents: number
  rankPercentage: number
}

interface OverallStats {
  totalAttempts: number
  averagePercentage: number
  medianPercentage: number
  minPercentage: number
  maxPercentage: number
  averagePaesScore: number | null
  medianPaesScore: number | null
}

interface SubjectStat {
  subjectCode: string
  subjectName: string
  totalAttempts: number
  userAttempts: number
  userAverage: number
  overallAverage: number
  userPercentile: number
  userRank: number
  totalStudents: number
}

export default function ComparisonPage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [overallStats, setOverallStats] = useState<OverallStats | null>(null)
  const [subjectStats, setSubjectStats] = useState<SubjectStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadComparison()
  }, [])

  async function loadComparison() {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('/api/analytics/comparison')
      if (!res.ok) throw new Error('Error al cargar comparación')
      const data = await res.json()

      if (data.message) {
        setError(data.message)
        return
      }

      setUserStats(data.userStats)
      setOverallStats(data.overallStats)
      setSubjectStats(data.subjectStats || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      toast.error('Error al cargar comparación')
    } finally {
      setLoading(false)
    }
  }

  // Memoizar funciones de utilidad para evitar recrearlas en cada render
  const getPercentileColor = useCallback((percentile: number) => {
    if (percentile >= 90) return 'text-green-600'
    if (percentile >= 75) return 'text-blue-600'
    if (percentile >= 50) return 'text-yellow-600'
    if (percentile >= 25) return 'text-orange-600'
    return 'text-red-600'
  }, [])

  const getPercentileLabel = useCallback((percentile: number) => {
    if (percentile >= 90) return 'Excelente'
    if (percentile >= 75) return 'Muy Bueno'
    if (percentile >= 50) return 'Bueno'
    if (percentile >= 25) return 'Regular'
    return 'Necesita Mejora'
  }, [])

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
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-lg font-semibold mb-2">{error}</p>
              <p className="text-muted-foreground">
                {error.includes('No tienes')
                  ? 'Completa algunos exámenes para ver tu comparación'
                  : 'Completa algunos exámenes para generar datos de comparación'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="mb-4">
            <BackButton href="/analytics" label="Volver a Analytics" />
          </div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8" />
            Comparación Anónima
          </h1>
          <p className="text-muted-foreground mt-2">
            Compara tu rendimiento con otros estudiantes de forma anónima
          </p>
        </div>
        <HelpIcon content="Esta comparación es completamente anónima. No se muestran nombres ni información personal. Solo estadísticas agregadas para ayudarte a entender tu posición relativa." />
      </div>

      {/* User Stats */}
      {userStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Target className="h-4 w-4" />
                Percentil General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                <span className={getPercentileColor(userStats.percentile)}>
                  {userStats.percentile}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {getPercentileLabel(userStats.percentile)}
              </p>
              <Progress value={userStats.percentile} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Award className="h-4 w-4" />
                Posición en Ranking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">#{userStats.rank}</div>
              <p className="text-xs text-muted-foreground">
                de {userStats.totalStudents} estudiantes
              </p>
              <Progress value={userStats.rankPercentage} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Promedio General
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {userStats.averagePercentage.toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                Mejor: {userStats.bestPercentage.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Intentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{userStats.totalAttempts}</div>
              <p className="text-xs text-muted-foreground">Exámenes completados</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overall Stats */}
      {overallStats && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas Generales del Sistema</CardTitle>
            <CardDescription>
              Datos agregados de todos los estudiantes (completamente anónimos)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Intentos</p>
                <p className="text-2xl font-bold">{overallStats.totalAttempts}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Promedio General</p>
                <p className="text-2xl font-bold">{overallStats.averagePercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Mediana</p>
                <p className="text-2xl font-bold">{overallStats.medianPercentage.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Rango</p>
                <p className="text-lg font-semibold">
                  {overallStats.minPercentage.toFixed(1)}% - {overallStats.maxPercentage.toFixed(1)}
                  %
                </p>
              </div>
            </div>
            {overallStats.averagePaesScore && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-2">Puntaje PAES Promedio</p>
                <p className="text-2xl font-bold">
                  {overallStats.averagePaesScore.toFixed(0)} puntos
                </p>
                {overallStats.medianPaesScore && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Mediana: {overallStats.medianPaesScore.toFixed(0)} puntos
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Subject Stats */}
      {subjectStats.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Comparación por Asignatura</CardTitle>
            <CardDescription>
              Tu rendimiento comparado con otros estudiantes por asignatura
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectStats.map(subject => (
                <div key={subject.subjectCode} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{subject.subjectName}</h3>
                      <p className="text-sm text-muted-foreground">{subject.subjectCode}</p>
                    </div>
                    <Badge variant="outline">
                      {subject.userAttempts} intento{subject.userAttempts !== 1 ? 's' : ''}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tu Promedio</p>
                      <p className="text-xl font-bold">{subject.userAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Promedio General</p>
                      <p className="text-xl font-bold">{subject.overallAverage.toFixed(1)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Percentil</p>
                      <p
                        className={`text-xl font-bold ${getPercentileColor(subject.userPercentile)}`}
                      >
                        {subject.userPercentile}%
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Posición #{subject.userRank} de {subject.totalStudents}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                      <span>Tu rendimiento</span>
                      <span>{subject.userPercentile}%</span>
                    </div>
                    <Progress value={subject.userPercentile} className="h-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
