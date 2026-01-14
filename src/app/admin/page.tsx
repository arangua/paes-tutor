'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import {
  Upload,
  Key,
  BookOpen,
  Trash2,
  Sparkles,
} from 'lucide-react'

const adminSections = [
  {
    title: 'Importación',
    description: 'Importar contenido al sistema',
    items: [
      {
        title: 'Importar Exámenes',
        description: 'Importa exámenes desde PDF o URL de DEMRE',
        href: '/admin/import-exams',
        icon: Upload,
        color: 'text-blue-600',
      },
      {
        title: 'Importar Clavijeros',
        description: 'Importa respuestas correctas desde PDF',
        href: '/admin/import-answer-key',
        icon: Key,
        color: 'text-green-600',
      },
      {
        title: 'Importar Temarios',
        description: 'Importa temarios completos desde PDF, CSV o JSON',
        href: '/admin/import-topics',
        icon: BookOpen,
        color: 'text-purple-600',
      },
      {
        title: 'Generar Examen con IA',
        description: 'Genera exámenes automáticamente basados en temarios',
        href: '/admin/generate-exam',
        icon: Sparkles,
        color: 'text-indigo-600',
      },
    ],
  },
  {
    title: 'Mantenimiento',
    description: 'Gestionar y limpiar datos del sistema',
    items: [
      {
        title: 'Limpiar Datos Ficticios',
        description: 'Elimina datos de prueba, simulacros y contenido ficticio',
        href: '/admin/cleanup-test-data',
        icon: Trash2,
        color: 'text-red-600',
      },
    ],
  },
]

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <Breadcrumbs className="mb-4" />
        <h1 className="text-3xl font-bold">Panel de Administración</h1>
        <p className="text-muted-foreground mt-2">
          Gestiona el contenido y configuración del sistema PAES Tutor
        </p>
      </div>

      <div className="space-y-8">
        {adminSections.map(section => (
          <div key={section.title}>
            <div className="mb-4">
              <h2 className="text-2xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground text-sm">{section.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map(item => {
                const Icon = item.icon
                return (
                  <Card key={item.href} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-muted ${item.color}`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button asChild className="w-full" variant="outline">
                        <Link href={item.href}>Acceder</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        ))}

        {/* Información adicional */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Flujo de Importación</div>
                <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                  <li>Importar Exámenes</li>
                  <li>Importar Clavijeros</li>
                  <li>Importar Temarios (opcional)</li>
                </ol>
              </div>
              <div>
                <div className="font-semibold mb-1">Mantenimiento</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Limpiar datos de prueba periódicamente</li>
                  <li>Verificar integridad de datos</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Recomendaciones</div>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Hacer respaldos antes de limpiar datos</li>
                  <li>Verificar exámenes después de importar</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
