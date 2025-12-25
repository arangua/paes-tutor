'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Loader2,
  Trophy,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
  Target,
  AlertCircle,
  ArrowRight,
} from 'lucide-react'
import { toast } from 'sonner'
import { BackButton } from '@/components/navigation/back-button'
import Link from 'next/link'
import { CreateChallengeButton } from '@/components/challenges/create-challenge-button'

// Función simple para formatear fechas relativas
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'hace unos momentos'
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins !== 1 ? 's' : ''}`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours !== 1 ? 's' : ''}`
  if (diffDays < 7) return `hace ${diffDays} día${diffDays !== 1 ? 's' : ''}`
  return date.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })
}

interface Challenge {
  id: string
  examId: string | null
  status: string
  message: string | null
  deadline: string | null
  createdAt: string
  acceptedAt: string | null
  completedAt: string | null
  exam: {
    id: string
    titulo: string
    subject: {
      id: string
      nombre: string
      codigo: string
    }
  } | null
  challenger: {
    id: string
    nombre: string
  }
  challenged: {
    id: string
    nombre: string
  }
  challengerAttempt: {
    id: string
    porcentaje: number
    puntajePaes: number | null
    correctas: number
    totalPreguntas: number
    createdAt: string
  } | null
  challengedAttempt: {
    id: string
    porcentaje: number
    puntajePaes: number | null
    correctas: number
    totalPreguntas: number
    createdAt: string
  } | null
  winner: {
    id: string
    nombre: string
  } | null
}

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'sent' | 'received'>('active')
  const [currentStudentId, setCurrentStudentId] = useState<string | null>(null)

  useEffect(() => {
    loadCurrentStudent()
    loadChallenges()
  }, [activeTab])

  async function loadCurrentStudent() {
    try {
      const res = await fetch('/api/student')
      if (res.ok) {
        const data = await res.json()
        setCurrentStudentId(data.id)
      }
    } catch (error) {
      // Error ya manejado por el sistema de monitoreo
    }
  }

  async function loadChallenges() {
    try {
      setLoading(true)
      const res = await fetch(`/api/challenges?type=${activeTab}`)
      if (!res.ok) throw new Error('Error al cargar desafíos')
      const data = await res.json()
      setChallenges(data.challenges || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar desafíos')
    } finally {
      setLoading(false)
    }
  }

  async function handleAccept(challengeId: string) {
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'accepted' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al aceptar desafío')
      }

      toast.success('Desafío aceptado. ¡Buena suerte!', {
        description: 'El desafío está activo. Realiza el examen cuando estés listo.',
      })
      loadChallenges()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al aceptar desafío')
    }
  }

  async function handleDecline(challengeId: string) {
    try {
      const res = await fetch(`/api/challenges/${challengeId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'declined' }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Error al rechazar desafío')
      }

      toast.info('Desafío rechazado')
      loadChallenges()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al rechazar desafío')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline">Pendiente</Badge>
      case 'accepted':
        return <Badge className="bg-blue-600">Aceptado</Badge>
      case 'completed':
        return <Badge className="bg-green-600">Completado</Badge>
      case 'declined':
        return <Badge variant="destructive">Rechazado</Badge>
      case 'cancelled':
        return <Badge variant="secondary">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const formatDate = formatRelativeTime

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Desafíos</h1>
          <p className="text-muted-foreground mt-2">
            Desafía al otro estudiante y compite en exámenes
          </p>
        </div>
        <div className="flex gap-2">
          <CreateChallengeButton onChallengeCreated={loadChallenges} />
          <BackButton />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as typeof activeTab)}>
        <TabsList>
          <TabsTrigger value="active">Activos</TabsTrigger>
          <TabsTrigger value="sent">Enviados</TabsTrigger>
          <TabsTrigger value="received">Recibidos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {challenges.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  {activeTab === 'active'
                    ? 'No hay desafíos activos. Crea uno nuevo para comenzar.'
                    : activeTab === 'sent'
                      ? 'No has enviado ningún desafío aún.'
                      : activeTab === 'received'
                        ? 'No has recibido ningún desafío aún.'
                        : 'No hay desafíos.'}
                </p>
                {activeTab === 'active' && (
                  <div className="mt-4">
                    <CreateChallengeButton onChallengeCreated={loadChallenges} />
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            challenges.map(challenge => {
              const isChallenger = currentStudentId === challenge.challenger.id
              const isChallenged = currentStudentId === challenge.challenged.id
              const canAccept = challenge.status === 'pending' && isChallenged
              const canComplete =
                challenge.status === 'accepted' &&
                challenge.exam &&
                (!challenge.challengerAttempt || !challenge.challengedAttempt)

              // Verificar si el desafío está próximo a expirar (menos de 2 días)
              const challengeDate = new Date(challenge.createdAt)
              const daysSinceCreation = Math.floor(
                (Date.now() - challengeDate.getTime()) / (1000 * 60 * 60 * 24)
              )
              const isExpiringSoon = challenge.status === 'pending' && daysSinceCreation >= 5 // 5 días o más

              return (
                <Card
                  key={challenge.id}
                  className={
                    challenge.status === 'pending'
                      ? isExpiringSoon
                        ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20'
                        : 'border-primary'
                      : ''
                  }
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          <Trophy className="h-5 w-5" />
                          {challenge.exam ? challenge.exam.titulo : 'Desafío General'}
                          {challenge.status === 'pending' && (
                            <Badge variant="default" className="ml-2">
                              Nuevo
                            </Badge>
                          )}
                          {isExpiringSoon && (
                            <Badge
                              variant="outline"
                              className="ml-2 border-yellow-500 text-yellow-700 dark:text-yellow-400"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              Expira pronto
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-2">
                          {challenge.challenger.nombre} desafió a {challenge.challenged.nombre}
                          {' • '}
                          {formatDate(challenge.createdAt)}
                        </CardDescription>
                      </div>
                      {getStatusBadge(challenge.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isExpiringSoon && challenge.status === 'pending' && (
                      <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                          <div className="text-sm">
                            <p className="font-medium text-yellow-800 dark:text-yellow-200">
                              Este desafío expirará pronto
                            </p>
                            <p className="text-yellow-700 dark:text-yellow-300">
                              {isChallenged
                                ? 'Acepta o rechaza el desafío antes de que expire.'
                                : 'El desafío será cancelado automáticamente si no es aceptado pronto.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {challenge.message && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm">{challenge.message}</p>
                      </div>
                    )}

                    {challenge.exam && (
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Examen:</span>
                          <span className="font-medium">{challenge.exam.titulo}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground">Asignatura:</span>
                          <Badge variant="outline">{challenge.exam.subject.codigo}</Badge>
                        </div>
                      </div>
                    )}

                    {/* Resultados si está completado */}
                    {challenge.status === 'completed' &&
                      challenge.challengerAttempt &&
                      challenge.challengedAttempt && (
                        <div className="p-4 bg-muted rounded-lg space-y-3">
                          <h4 className="font-semibold">Resultados</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm font-medium mb-2">
                                {challenge.challenger.nombre}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Resultado:</span>
                                  <span className="font-bold">
                                    {challenge.challengerAttempt.porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                                {challenge.challengerAttempt.puntajePaes && (
                                  <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengerAttempt.puntajePaes} pts
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm font-medium mb-2">
                                {challenge.challenged.nombre}
                              </div>
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span>Resultado:</span>
                                  <span className="font-bold">
                                    {challenge.challengedAttempt.porcentaje.toFixed(1)}%
                                  </span>
                                </div>
                                {challenge.challengedAttempt.puntajePaes && (
                                  <div className="flex justify-between">
                                    <span>PAES:</span>
                                    <span className="font-bold">
                                      {challenge.challengedAttempt.puntajePaes} pts
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {challenge.winner && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-green-600 font-semibold">
                                <Trophy className="h-4 w-4" />
                                Ganador: {challenge.winner.nombre}
                              </div>
                            </div>
                          )}
                          {!challenge.winner && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                                <Target className="h-4 w-4" />
                                Empate
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                    {/* Acciones según el estado */}
                    <div className="flex gap-2">
                      {canAccept && (
                        <>
                          <Button onClick={() => handleAccept(challenge.id)} className="flex-1">
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Aceptar Desafío
                          </Button>
                          <Button variant="outline" onClick={() => handleDecline(challenge.id)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      {challenge.status === 'accepted' && challenge.exam && (
                        <Button asChild className="flex-1">
                          <Link href={`/exams/${challenge.exam.id}/take`}>
                            Realizar Examen
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      )}
                      {challenge.status === 'completed' && challenge.challengerAttempt && (
                        <Button variant="outline" asChild className="flex-1">
                          <Link href={`/attempts/${challenge.challengerAttempt.id}`}>
                            Ver Resultados
                          </Link>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
