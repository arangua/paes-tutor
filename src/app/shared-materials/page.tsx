'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, Share2, Eye, EyeOff, BookOpen, User, MessageSquare, FileText } from 'lucide-react'
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

interface SharedMaterial {
  id: string
  materialId: string
  message: string | null
  viewed: boolean
  viewedAt: string | null
  createdAt: string
  material: {
    id: string
    titulo: string
    contenido: string
    tipo: string
    fuente: string | null
    subject: {
      id: string
      nombre: string
      codigo: string
    }
    topic: {
      id: string
      nombre: string
      ejeTematico: string
    } | null
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

export default function SharedMaterialsPage() {
  const [receivedMaterials, setReceivedMaterials] = useState<SharedMaterial[]>([])
  const [sentMaterials, setSentMaterials] = useState<SharedMaterial[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received')

  useEffect(() => {
    loadSharedMaterials()
  }, [])

  async function loadSharedMaterials() {
    try {
      setLoading(true)

      const [receivedRes, sentRes] = await Promise.all([
        fetch('/api/shared-materials?type=received'),
        fetch('/api/shared-materials?type=sent'),
      ])

      if (!receivedRes.ok || !sentRes.ok) {
        throw new Error('Error al cargar materiales compartidos')
      }

      const receivedData = await receivedRes.json()
      const sentData = await sentRes.json()

      setReceivedMaterials(receivedData.sharedMaterials || [])
      setSentMaterials(sentData.sharedMaterials || [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error al cargar materiales compartidos')
    } finally {
      setLoading(false)
    }
  }

  async function markAsViewed(sharedMaterialId: string) {
    try {
      const res = await fetch(`/api/shared-materials/${sharedMaterialId}`, {
        method: 'PATCH',
      })

      if (!res.ok) {
        throw new Error('Error al marcar como visto')
      }

      // Actualizar estado local
      setReceivedMaterials(prev =>
        prev.map(material =>
          material.id === sharedMaterialId
            ? { ...material, viewed: true, viewedAt: new Date().toISOString() }
            : material
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
          <h1 className="text-3xl font-bold">Materiales Compartidos</h1>
          <p className="text-muted-foreground mt-2">
            Materiales de estudio que has compartido o que te han compartido
          </p>
        </div>
        <BackButton />
      </div>

      <Tabs value={activeTab} onValueChange={v => setActiveTab(v as 'received' | 'sent')}>
        <TabsList>
          <TabsTrigger value="received">
            Recibidos ({receivedMaterials.length})
            {receivedMaterials.filter(m => !m.viewed).length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {receivedMaterials.filter(m => !m.viewed).length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="sent">Enviados ({sentMaterials.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {receivedMaterials.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  No has recibido ningún material compartido aún.
                </p>
              </CardContent>
            </Card>
          ) : (
            receivedMaterials.map(sharedMaterial => (
              <Card
                key={sharedMaterial.id}
                className={!sharedMaterial.viewed ? 'border-primary' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {sharedMaterial.material.titulo}
                        {!sharedMaterial.viewed && (
                          <Badge variant="default" className="ml-2">
                            Nuevo
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        Compartido por {sharedMaterial.sharedBy?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedMaterial.createdAt)}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedMaterial.material.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedMaterial.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedMaterial.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedMaterial.material.subject.nombre}</span>
                    </div>
                    {sharedMaterial.material.topic && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="font-medium">{sharedMaterial.material.topic.nombre}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedMaterial.material.tipo}</Badge>
                    </div>
                    {sharedMaterial.material.fuente && (
                      <div className="text-xs text-muted-foreground">
                        Fuente: {sharedMaterial.material.fuente}
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm line-clamp-3">{sharedMaterial.material.contenido}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/materials/${sharedMaterial.material.id}`}>
                        <BookOpen className="h-4 w-4 mr-2" />
                        Ver Material
                      </Link>
                    </Button>
                    {!sharedMaterial.viewed && (
                      <Button variant="outline" onClick={() => markAsViewed(sharedMaterial.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Marcar como visto
                      </Button>
                    )}
                    {sharedMaterial.viewed && (
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
          {sentMaterials.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <Share2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No has compartido ningún material aún.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Usa el botón "Compartir" en cualquier material para compartirlo.
                </p>
              </CardContent>
            </Card>
          ) : (
            sentMaterials.map(sharedMaterial => (
              <Card key={sharedMaterial.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{sharedMaterial.material.titulo}</CardTitle>
                      <CardDescription className="mt-2">
                        Compartido con {sharedMaterial.sharedWith?.nombre || 'otro estudiante'}
                        {' • '}
                        {formatDate(sharedMaterial.createdAt)}
                        {sharedMaterial.viewed && (
                          <>
                            {' • '}
                            <span className="text-green-600">Visto</span>
                          </>
                        )}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{sharedMaterial.material.subject.codigo}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedMaterial.message && (
                    <div className="p-3 bg-muted rounded-lg">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 mt-0.5 text-muted-foreground" />
                        <p className="text-sm">{sharedMaterial.message}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Asignatura:</span>
                      <span className="font-medium">{sharedMaterial.material.subject.nombre}</span>
                    </div>
                    {sharedMaterial.material.topic && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Tema:</span>
                        <span className="font-medium">{sharedMaterial.material.topic.nombre}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Tipo:</span>
                      <Badge variant="secondary">{sharedMaterial.material.tipo}</Badge>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-sm line-clamp-3">{sharedMaterial.material.contenido}</p>
                  </div>

                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/materials/${sharedMaterial.material.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Ver Material
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
