'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  BookOpen,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Clock,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react'
import { ShareMaterialButton } from '@/components/materials/share-material-button'

interface Material {
  id: string
  titulo: string
  contenido: string
  fuente: string | null
  tipo: string
  createdAt: string
  subject: {
    id: string
    nombre: string
    codigo: string
  }
  topic: {
    id: string
    nombre: string
    ejeTematico: string
    descripcion: string | null
  } | null
}

export default function MaterialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [material, setMaterial] = useState<Material | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    async function loadMaterial() {
      try {
        setIsLoading(true)
        setError(null)

        const id = params.id as string

        // Validar formato del ID
        if (!id || !/^c[a-z0-9]{24}$/.test(id)) {
          setError('ID de material inválido')
          setIsLoading(false)
          return
        }

        const res = await fetch(`/api/materials/${id}`)

        if (res.status === 401) {
          router.push('/auth/signin?callbackUrl=/materials')
          return
        }

        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Material no encontrado')
          }
          throw new Error('Error al cargar material')
        }

        const data = await res.json()
        setMaterial(data)

        // Verificar si está marcado como completado (localStorage por ahora)
        const completed = localStorage.getItem(`material_completed_${id}`)
        setIsCompleted(completed === 'true')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    if (params.id) {
      loadMaterial()
    }
  }, [params.id, router])

  const handleMarkComplete = () => {
    if (!material) return

    const newStatus = !isCompleted
    setIsCompleted(newStatus)
    localStorage.setItem(`material_completed_${material.id}`, String(newStatus))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Cargando material...</p>
        </div>
      </div>
    )
  }

  if (error || !material) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error
            </CardTitle>
            <CardDescription>{error || 'No se pudo cargar el material'}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/materials')}>Volver a Materiales</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      {/* Breadcrumbs */}
      <div className="mb-6">
        <Breadcrumbs
          items={[
            { label: 'Inicio', href: '/' },
            { label: 'Materiales de Estudio', href: '/materials' },
            { label: material.titulo },
          ]}
        />
      </div>

      {/* Botón Volver */}
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver
        </Button>
      </div>

      {/* Contenido del Material */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{material.titulo}</CardTitle>
                {isCompleted && <CheckCircle2 className="h-6 w-6 text-green-600" />}
              </div>
              <CardDescription>
                {material.subject.nombre}
                {material.topic && ` • ${material.topic.nombre}`}
              </CardDescription>
            </div>
            <Badge variant="outline" className="capitalize">
              {material.tipo}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información adicional */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(material.createdAt).toLocaleDateString('es-CL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            {material.fuente && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{material.fuente}</span>
              </div>
            )}
          </div>

          {/* Información del tema */}
          {material.topic && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Tema: {material.topic.nombre}</p>
              <p className="text-sm text-muted-foreground">
                Eje Temático: {material.topic.ejeTematico}
              </p>
              {material.topic.descripcion && (
                <p className="text-sm text-muted-foreground mt-2">{material.topic.descripcion}</p>
              )}
            </div>
          )}

          {/* Contenido */}
          <div className="prose dark:prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">{material.contenido}</div>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 pt-4 border-t">
            <Button
              variant={isCompleted ? 'outline' : 'default'}
              onClick={handleMarkComplete}
              className="flex-1"
            >
              {isCompleted ? (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Completado
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Marcar como Completado
                </>
              )}
            </Button>
            <ShareMaterialButton materialId={material.id} materialTitle={material.titulo} />
            <Button variant="outline" asChild>
              <Link href="/materials">Ver Más Materiales</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
