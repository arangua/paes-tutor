'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  BookOpen,
  FileText,
  BarChart3,
  Target,
  TrendingUp,
  Award,
  RotateCcw,
  Users,
  Share2,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface QuickAction {
  title: string
  description: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'outline' | 'secondary'
}

const defaultActions: QuickAction[] = [
  {
    title: 'Ver Exámenes',
    description: 'Explora todos los exámenes disponibles',
    href: '/exams',
    icon: BookOpen,
    variant: 'default',
  },
  {
    title: 'Realizar Examen',
    description: 'Comienza un nuevo examen de práctica',
    href: '/exams',
    icon: FileText,
    variant: 'outline',
  },
  {
    title: 'Ver Estadísticas',
    description: 'Analiza tu rendimiento detallado',
    href: '/dashboard',
    icon: BarChart3,
    variant: 'outline',
  },
  {
    title: 'Analytics Avanzado',
    description: 'Estadísticas y predicciones avanzadas',
    href: '/analytics',
    icon: TrendingUp,
    variant: 'outline',
  },
  {
    title: 'Repaso Rápido',
    description: 'Repasa preguntas falladas (5-10 preguntas)',
    href: '/review/quick',
    icon: RotateCcw,
    variant: 'default',
  },
  {
    title: 'Comparación Directa',
    description: 'Compara tu progreso con el otro estudiante',
    href: '/comparison',
    icon: Users,
    variant: 'default',
  },
  {
    title: 'Exámenes Compartidos',
    description: 'Ver exámenes compartidos contigo',
    href: '/shared-exams',
    icon: Share2,
    variant: 'outline',
  },
  {
    title: 'Materiales Compartidos',
    description: 'Ver materiales compartidos contigo',
    href: '/shared-materials',
    icon: FileText,
    variant: 'outline',
  },
  {
    title: 'Desafíos',
    description: 'Desafía al otro estudiante y compite',
    href: '/challenges',
    icon: Trophy,
    variant: 'default',
  },
]

interface QuickActionsProps {
  actions?: QuickAction[]
  title?: string
  description?: string
}

export function QuickActions({
  actions = defaultActions,
  title = 'Accesos Rápidos',
  description = 'Acciones comunes para continuar tu preparación',
}: QuickActionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon
            return (
              <Button
                key={`${action.title}-${index}`}
                variant={action.variant || 'outline'}
                asChild
                className="h-auto flex-col items-start justify-start p-4 gap-2"
              >
                <Link href={action.href}>
                  <Icon className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-semibold">{action.title}</div>
                    <div className="text-xs text-muted-foreground">{action.description}</div>
                  </div>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
