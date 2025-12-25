'use client'

import { useState, useEffect } from 'react'
import { InteractiveTutorial, TutorialStep } from './interactive-tutorial'
import { Button } from '@/components/ui/button'
import { Sparkles } from 'lucide-react'

const DASHBOARD_TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'welcome',
    title: '¡Bienvenido al Dashboard!',
    description:
      'Este es tu centro de control. Aquí verás tu progreso, estadísticas y recomendaciones personalizadas.',
  },
  {
    id: 'stats',
    title: 'Tarjetas de Estadísticas',
    description:
      'Estas tarjetas muestran tu progreso general: total de intentos, promedio, asignaturas y mejor puntaje.',
    target: '[data-tutorial="stats-cards"]',
    position: 'bottom',
  },
  {
    id: 'quick-actions',
    title: 'Accesos Rápidos',
    description:
      'Usa estos botones para acceder rápidamente a las funciones más importantes. También puedes usar atajos de teclado (presiona ? para verlos).',
    target: '[data-tutorial="quick-actions"]',
    position: 'bottom',
  },
  {
    id: 'charts',
    title: 'Gráficos de Rendimiento',
    description:
      'Los gráficos te ayudan a visualizar tu progreso. Puedes colapsar esta sección si prefieres ver menos información.',
    target: '[data-tutorial="charts"]',
    position: 'top',
  },
  {
    id: 'recommendations',
    title: 'Recomendaciones',
    description:
      'Basado en tu rendimiento, el sistema te sugiere temas y acciones para mejorar. Revisa estas recomendaciones regularmente.',
    target: '[data-tutorial="recommendations"]',
    position: 'top',
  },
  {
    id: 'complete',
    title: '¡Listo para comenzar!',
    description:
      'Ya conoces lo básico. Explora las diferentes secciones y usa los atajos de teclado (?) para navegar más rápido.',
  },
]

export function DashboardTutorial() {
  const [isOpen, setIsOpen] = useState(false)
  const [hasSeenTutorial, setHasSeenTutorial] = useState(false)

  // Verificar si ya se completó el tutorial
  useEffect(() => {
    if (typeof window === 'undefined') return

    try {
      const saved = localStorage.getItem('dashboard-tutorial-completed')
      if (saved) {
        const data = JSON.parse(saved)
        if (data.completed || data.skipped) {
          setHasSeenTutorial(true)
        }
      }
    } catch {
      // Ignorar errores
    }
  }, [])

  // No mostrar nada si ya se vio el tutorial
  if (hasSeenTutorial && !isOpen) {
    return null
  }

  return (
    <>
      {!hasSeenTutorial && !isOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="shadow-lg"
            size="sm"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Iniciar Tutorial
          </Button>
        </div>
      )}
      <InteractiveTutorial
        steps={DASHBOARD_TUTORIAL_STEPS}
        storageKey="dashboard-tutorial-completed"
        open={isOpen}
        disableSpotlight={true} // Efecto telescopio desactivado por defecto (cambiar a false para activarlo)
        onComplete={() => {
          setIsOpen(false)
          setHasSeenTutorial(true)
        }}
        onSkip={() => {
          setIsOpen(false)
          setHasSeenTutorial(true)
        }}
      />
    </>
  )
}
