'use client'

import { useEffect, useState } from 'react'
import { safeToISOString } from '@/app/api/notes/versions/validation-utils'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Share2, Eye, EyeOff, BookOpen, Clock, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { BackButton } from '@/components/navigation/back-button'
import Link from 'next/link'
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

interface SharedExam {
  id: string
  examId: string
  message: string | null
  viewed: boolean
  viewedAt: string | null
  createdAt: string
  exam: {
    id: string
    titulo: string
    descripcion: string | null
    tipo: string
    tiempoLimiteMin: number | null
    totalPreguntas: number
    subject: {
      id: string
      nombre: string
      codigo: string
    }
  }
  sharedBy?: {
    id: string
    nombre: string
    user: {
      email: string | null
    }
  }
  sharedWith?: {
    id: string
    nombre: string
    user: {
      email: string | null
    }
  }
}

export default function SharedExamsPage() {
  const [receivedExams, setReceivedExams] = useState<SharedExam[]>([])
  const [sentExams, setSentExams] = useState<SharedExam[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')

  useEffect(() => {
    loadSharedExams()
  }, [])

  async function loadSharedExams() {
    try {
      setLoading(true)

      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/shared-exams?type=received'),
        fetch('/api/shared-exams?type=sent'),
      ])

      if (!receivedRes.ok || !sentRes.ok) {
        throw new Error('Error al cargar exámenes compartidos')
      }

      const receivedData = await receivedRes.json()
      const sentData = await sentRes.json()

      setReceivedExams(receivedData.sharedExams || [])
      setSentExams(sentData.sharedExams || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar exámenes compartidos')
    } finally {
      setLoading(false)
    }
  }

  async function markAsViewed(sharedExamId: string) {
    try {
      const res = await fetch(`/api/shared-exams/${sharedExamId}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Error al marcar como visto')
      }

      // Actualizar estado local
      setReceivedExams(prev =>
        prev.map(exam =>
          exam.id === sharedExamId
            ? { ...exam, viewed: true, viewedAt: safeToISOString(new Date()) }
            : exam
        )
      )

      toast.success('Marcado como visto')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al marcar como visto')
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
          <h1 className="text-3xl font-bold">Exámenes Compartidos</h1>
          <p className="text-muted-foreground mt-2">
            Exámenes que has compartido o que te han compartido
          </p>
        </div>
        <BackButton />
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'received' | 'sent')}>
        <TabsList>
          <TabsTrigger value="received">
            Recibidos ({receivedExams.length})
            {receivedExams.filter(e => !e.viewed).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {receivedExams.filter(e => !e.viewed).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Enviados ({sentExams.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedExams.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No has recibido ningún examen compartido aún.
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedExams.map(sharedExam => (
              <Card key={sharedExam.id} className={!sharedExam.viewed ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {sharedExam.exam.titulo}
                        {!sharedExam.viewed && (
                          <Badge variant="default" className="ml-2">
                            Nuevo
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartido por {sharedExam.sharedBy?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedExam.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedExam.exam.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedExam.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedExam.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedExam.exam.subject.nombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedExam.exam.tipo}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preguntas:</span>
                      <span className="font-medium">{sharedExam.exam.totalPreguntas}</span>
                    </div>
                    {sharedExam.exam.tiempoLimiteMin && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Tiempo límite: {sharedExam.exam.tiempoLimiteMin} minutos
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/exams/${sharedExam.exam.id}/take`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Realizar Examen
                      </Link>
                    </Button>
                    {!sharedExam.viewed && (
                      <Button variant="outline" onClick={() => markAsViewed(sharedExam.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como visto
                      </Button>
                    )}
                    {sharedExam.viewed && (
                      <Button variant="outline" disabled>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Visto
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sentExams.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No has compartido ningún examen aún.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Usa el botón &quot;Compartir&quot; en cualquier examen para compartirlo.
                </p>
              </CardContent>
            </Card>
          ) : (
            sentExams.map(sharedExam => (
              <Card key={sharedExam.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{sharedExam.exam.titulo}</CardTitle>
                      <CardDescription className="mt-2">
                        Compartido con {sharedExam.sharedWith?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedExam.createdAt)}
                        {sharedExam.viewed && (
                          <>
                            {' • '}
                            <span className="text-green-600">Visto</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedExam.exam.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedExam.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedExam.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedExam.exam.subject.nombre}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedExam.exam.tipo}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preguntas:</span>
                      <span className="font-medium">{sharedExam.exam.totalPreguntas}</span>
                    </div>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/exams/${sharedExam.exam.id}/take`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ver Examen
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
