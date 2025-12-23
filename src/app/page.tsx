'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BookOpen,
  TrendingUp,
  Target,
  Award,
  Search,
  BarChart3,
  FileText,
  Bot,
  ArrowRight,
  HelpCircle,
  PlayCircle,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { WelcomeTour } from '@/components/help/welcome-tour'

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Simulacros',
    description: 'Practica con exámenes reales de años anteriores',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    href: '/exams',
  },
  {
    icon: TrendingUp,
    title: 'Seguimiento',
    description: 'Analiza tu progreso con métricas detalladas',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    href: '/dashboard',
  },
  {
    icon: Target,
    title: 'Preparación',
    description: 'Materiales de estudio y recomendaciones personalizadas',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    href: '/materials',
  },
  {
    icon: Search,
    title: 'Búsqueda Inteligente',
    description: 'Encuentra rápidamente cualquier contenido (Cmd/Ctrl+K)',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    href: null, // Se activa con Cmd/Ctrl+K, no necesita link
  },
  {
    icon: Bot,
    title: 'Tutor de IA',
    description: 'Explicaciones personalizadas con inteligencia artificial',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    href: '/ai-tutor',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Identifica fortalezas, debilidades y áreas de mejora',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50 dark:bg-pink-900/20',
    href: '/analytics',
  },
]

const QUICK_STEPS = [
  {
    step: 1,
    title: 'Inicia Sesión',
    description: 'Crea tu cuenta o inicia sesión para comenzar',
  },
  {
    step: 2,
    title: 'Realiza un Examen',
    description: "Ve a 'Exámenes' y selecciona uno para practicar",
  },
  {
    step: 3,
    title: 'Revisa tus Resultados',
    description: 'Analiza tu rendimiento en el Dashboard',
  },
  {
    step: 4,
    title: 'Mejora Continuamente',
    description: 'Usa materiales de estudio y el Tutor de IA',
  },
]

export default function Home() {
  const [showTour, setShowTour] = useState(false)
  const [hasSeenTour, setHasSeenTour] = useState(false)

  useEffect(() => {
    // Verificar si el usuario ya vio el tour
    const seen = localStorage.getItem('paes-tutor-tour-seen')
    setHasSeenTour(!!seen)
  }, [])

  const handleStartTour = () => {
    setShowTour(true)
  }

  const handleTourComplete = () => {
    localStorage.setItem('paes-tutor-tour-seen', 'true')
    setShowTour(false)
    setHasSeenTour(true)
  }

  const handleTourSkip = () => {
    localStorage.setItem('paes-tutor-tour-seen', 'true')
    setShowTour(false)
    setHasSeenTour(true)
  }

  return (
    <>
      {showTour && <WelcomeTour onComplete={handleTourComplete} onSkip={handleTourSkip} />}
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <main className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-16 px-8">
          <div className="text-center space-y-8 w-full">
            {/* Hero Section */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  PAES Tutor
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Tu plataforma de preparación para la Prueba de Acceso a la Educación Superior
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link href="/dashboard">
                    <Award className="mr-2 h-5 w-5" />
                    Ir al Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
                  <Link href="/exams">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Ver Exámenes
                  </Link>
                </Button>
                {!hasSeenTour && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8 py-6"
                    onClick={handleStartTour}
                  >
                    <PlayCircle className="mr-2 h-5 w-5" />
                    Tour Guiado
                  </Button>
                )}
              </div>
            </div>

            {/* Quick Start Guide */}
            <Card className="mt-12 text-left">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle>Guía de Inicio Rápido</CardTitle>
                </div>
                <CardDescription>Sigue estos pasos para comenzar a usar PAES Tutor</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {QUICK_STEPS.map(item => (
                    <div
                      key={item.step}
                      className="flex items-start gap-3 p-4 rounded-lg bg-muted/50"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Características Principales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {FEATURES.map((feature, idx) => {
                  const Icon = feature.icon
                  const CardWrapper = feature.href ? Link : 'div'
                  const cardProps = feature.href
                    ? { href: feature.href, className: 'block' }
                    : { className: 'block' }

                  return (
                    <CardWrapper key={idx} {...cardProps}>
                      <Card
                        className={`hover:shadow-lg transition-all h-full hover:border-primary/50 ${feature.href ? 'cursor-pointer group' : ''}`}
                      >
                        <CardHeader>
                          <div
                            className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-2`}
                          >
                            <Icon className={`h-6 w-6 ${feature.color}`} />
                          </div>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                            {feature.href && (
                              <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                        </CardContent>
                      </Card>
                    </CardWrapper>
                  )
                })}
              </div>
            </div>

            {/* Help Section */}
            <Card className="mt-12">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  <CardTitle>¿Necesitas Ayuda?</CardTitle>
                </div>
                <CardDescription>
                  Encuentra respuestas a tus preguntas y aprende a usar todas las funcionalidades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/help">
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Centro de Ayuda
                    </Link>
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={handleStartTour}>
                    <PlayCircle className="mr-2 h-4 w-4" />
                    Ver Tour Guiado
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-2">💡 Consejo Pro</h3>
                    <p className="text-sm text-muted-foreground">
                      Presiona{' '}
                      <kbd className="px-2 py-1 bg-background border rounded text-xs">
                        Cmd/Ctrl + K
                      </kbd>{' '}
                      desde cualquier página para buscar rápidamente exámenes, materiales y temas.
                      Tu progreso se guarda automáticamente, así que puedes continuar donde lo
                      dejaste.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  )
}
