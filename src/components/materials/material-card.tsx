'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, FileText, ExternalLink, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ShareMaterialButton } from './share-material-button'

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
  } | null
}

interface MaterialCardProps {
  material: Material
  isCompleted?: boolean
  className?: string
}

const tipoIcons: Record<string, typeof BookOpen> = {
  articulo: FileText,
  video: ExternalLink,
  guia: BookOpen,
  resumen: FileText,
  ejercicios: FileText,
}

const tipoColors: Record<string, string> = {
  articulo: 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800',
  video: 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800',
  guia: 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800',
  resumen: 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800',
  ejercicios: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800',
}

export function MaterialCard({ material, isCompleted = false, className }: MaterialCardProps) {
  const Icon = tipoIcons[material.tipo] || BookOpen
  const tipoColor =
    tipoColors[material.tipo] ||
    'bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-800'

  // Truncar contenido para preview
  const preview =
    material.contenido.length > 150
      ? material.contenido.substring(0, 150) + '...'
      : material.contenido

  return (
    <Card
      className={cn(
        'transition-all hover:shadow-md',
        tipoColor,
        isCompleted && 'opacity-75',
        className
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">{material.titulo}</CardTitle>
              {isCompleted && <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />}
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
      <CardContent className="space-y-4">
        {/* Preview del contenido */}
        <p className="text-sm text-muted-foreground line-clamp-3">{preview}</p>

        {/* Información adicional */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(material.createdAt).toLocaleDateString('es-CL', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          </div>
          {material.fuente && (
            <span className="truncate max-w-[150px]" title={material.fuente}>
              {material.fuente}
            </span>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-2">
          <Button variant="default" className="flex-1" asChild>
            <Link href={`/materials/${material.id}`}>
              Ver Material
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <ShareMaterialButton materialId={material.id} materialTitle={material.titulo} />
        </div>
      </CardContent>
    </Card>
  )
}
