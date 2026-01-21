'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Target,
  TrendingUp,
} from 'lucide-react'

interface QuickGuideProps {
  className?: string
}

const GUIDE_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Comenzar',
    icon: Target,
    items: [
      {
        question: '¿Cómo empiezo?',
        answer:
          '1. Ve a "Exámenes" y selecciona un examen para practicar. 2. Revisa tu progreso en el Dashboard. 3. Usa los Materiales de Estudio para reforzar temas débiles.',
      },
      {
        question: '¿Puedo hacer el mismo examen varias veces?',
        answer:
          'Sí, puedes realizar el mismo examen múltiples veces. Cada intento se guarda por separado para que puedas ver tu progreso.',
      },
      {
        question: '¿Cómo funciona el sistema de puntuación?',
        answer:
          'El sistema calcula tu porcentaje de aciertos y estima tu puntaje PAES basado en las tablas oficiales de conversión del DEMRE.',
      },
    ],
  },
  {
    id: 'features',
    title: 'Funcionalidades',
    icon: Lightbulb,
    items: [
      {
        question: '¿Cómo uso la búsqueda global?',
        answer:
          'Presiona Cmd/Ctrl+K o haz clic en "Buscar..." en el header. Puedes buscar exámenes, materiales, temas e intentos anteriores.',
      },
      {
        question: '¿Qué es el Tutor de IA?',
        answer:
          'El Tutor de IA te permite hacer preguntas sobre cualquier tema de PAES y recibir explicaciones personalizadas. Necesitas configurar una API key en tu perfil.',
      },
      {
        question: '¿Cómo veo mis fortalezas y debilidades?',
        answer:
          'Ve al Dashboard y revisa la sección de "Análisis de Rendimiento". Ahí verás tus fortalezas, debilidades y recomendaciones personalizadas.',
      },
    ],
  },
  {
    id: 'tips',
    title: 'Consejos',
    icon: TrendingUp,
    items: [
      {
        question: '¿Cómo mejorar mi rendimiento?',
        answer:
          '1. Practica regularmente con exámenes. 2. Revisa tus errores y lee las explicaciones. 3. Usa los Materiales de Estudio para temas débiles. 4. Revisa tus estadísticas para identificar patrones.',
      },
      {
        question: '¿Puedo exportar mis resultados?',
        answer:
          'Sí, puedes exportar tus resultados, estadísticas y listas de exámenes a PDF, Word o Excel usando los botones de exportación.',
      },
      {
        question: '¿El sistema guarda mi progreso automáticamente?',
        answer:
          'Sí, durante un examen tu progreso se guarda automáticamente cada 2 segundos. Si cierras la pestaña, podrás continuar desde donde quedaste.',
      },
    ],
  },
]

export function QuickGuide({ className }: Readonly<QuickGuideProps>) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['getting-started']))

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId)
      } else {
        newSet.add(sectionId)
      }
      return newSet
    })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <CardTitle>Guía Rápida</CardTitle>
        </div>
        <CardDescription>Preguntas frecuentes y consejos para usar PAES Tutor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {GUIDE_SECTIONS.map(section => {
          const Icon = section.icon
          const isOpen = openSections.has(section.id)

          return (
            <Collapsible
              key={section.id}
              open={isOpen}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-accent transition-colors">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="font-semibold">{section.title}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3 mt-2 pl-8">
                {section.items.map((item, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-muted/50 space-y-1">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-sm">{item.question}</span>
                    </div>
                    <p className="text-sm text-muted-foreground pl-0">{item.answer}</p>
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )
        })}
      </CardContent>
    </Card>
  )
}
