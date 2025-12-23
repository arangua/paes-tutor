'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  HelpCircle,
  BookOpen,
  Search,
  BarChart3,
  FileText,
  Bot,
  Target,
  TrendingUp,
  ArrowRight,
} from 'lucide-react'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { QuickGuide } from '@/components/help/quick-guide'
import Link from 'next/link'

const HELP_SECTIONS = [
  {
    id: 'getting-started',
    title: 'Comenzar',
    icon: Target,
    description: 'Aprende los conceptos básicos para usar PAES Tutor',
    topics: [
      {
        question: '¿Cómo creo mi cuenta?',
        answer:
          'Haz clic en "Iniciar Sesión" en el header. Si no tienes cuenta, puedes registrarte con tu email y contraseña.',
      },
      {
        question: '¿Qué puedo hacer en PAES Tutor?',
        answer:
          'Puedes realizar exámenes de práctica, revisar tu progreso, acceder a materiales de estudio, usar el Tutor de IA y exportar tus resultados.',
      },
      {
        question: '¿Cómo empiezo a practicar?',
        answer:
          'Ve a la sección "Exámenes", selecciona un examen y haz clic en "Comenzar Examen". Tu progreso se guarda automáticamente.',
      },
    ],
  },
  {
    id: 'exams',
    title: 'Exámenes',
    icon: BookOpen,
    description: 'Todo sobre realizar y revisar exámenes',
    topics: [
      {
        question: '¿Puedo hacer el mismo examen varias veces?',
        answer:
          'Sí, puedes realizar el mismo examen múltiples veces. Cada intento se guarda por separado para que puedas ver tu progreso y mejoras.',
      },
      {
        question: '¿Qué pasa si cierro el navegador durante un examen?',
        answer:
          'Tu progreso se guarda automáticamente cada 2 segundos. Si cierras el navegador, verás una advertencia y podrás continuar desde donde quedaste al volver.',
      },
      {
        question: '¿Cómo se calcula mi puntaje?',
        answer:
          'El sistema calcula tu porcentaje de aciertos y estima tu puntaje PAES basado en las tablas oficiales de conversión del DEMRE.',
      },
      {
        question: '¿Puedo omitir preguntas?',
        answer:
          'Sí, puedes omitir preguntas durante el examen. Las preguntas omitidas se marcan y puedes volver a ellas más tarde.',
      },
    ],
  },
  {
    id: 'dashboard',
    title: 'Dashboard y Analytics',
    icon: BarChart3,
    description: 'Entiende tus estadísticas y progreso',
    topics: [
      {
        question: '¿Qué información muestra el Dashboard?',
        answer:
          'El Dashboard muestra tus estadísticas generales, rendimiento por asignatura, intentos recientes, fortalezas, debilidades y recomendaciones personalizadas.',
      },
      {
        question: '¿Cómo identifico mis fortalezas y debilidades?',
        answer:
          'Ve a la sección "Análisis de Rendimiento" en el Dashboard. Ahí verás un desglose detallado por tema y asignatura.',
      },
      {
        question: '¿Puedo exportar mis estadísticas?',
        answer:
          'Sí, puedes exportar tu Dashboard completo a Excel usando el botón de exportación en la parte superior.',
      },
    ],
  },
  {
    id: 'search',
    title: 'Búsqueda',
    icon: Search,
    description: 'Aprende a usar la búsqueda global',
    topics: [
      {
        question: '¿Cómo uso la búsqueda global?',
        answer:
          'Presiona Cmd/Ctrl+K desde cualquier página o haz clic en "Buscar..." en el header. Puedes buscar exámenes, materiales, temas e intentos anteriores.',
      },
      {
        question: '¿Qué puedo buscar?',
        answer:
          'Puedes buscar por título, asignatura, tema, año, o cualquier palabra clave relacionada con el contenido que buscas.',
      },
      {
        question: '¿Cómo funcionan las sugerencias?',
        answer:
          'Mientras escribes, el sistema muestra sugerencias basadas en asignaturas, temas y títulos de exámenes disponibles.',
      },
    ],
  },
  {
    id: 'materials',
    title: 'Materiales de Estudio',
    icon: FileText,
    description: 'Usa los recursos educativos disponibles',
    topics: [
      {
        question: '¿Qué materiales están disponibles?',
        answer:
          'Los materiales incluyen recursos educativos organizados por asignatura y tema, alineados con la malla curricular chilena del MINEDUC.',
      },
      {
        question: '¿Cómo encuentro materiales para un tema específico?',
        answer:
          'Ve a "Materiales" y usa los filtros por asignatura y tema. También puedes usar la búsqueda global (Cmd/Ctrl+K) para encontrar materiales específicos.',
      },
    ],
  },
  {
    id: 'ai-tutor',
    title: 'Tutor de IA',
    icon: Bot,
    description: 'Usa la inteligencia artificial para aprender',
    topics: [
      {
        question: '¿Cómo configuro el Tutor de IA?',
        answer:
          'Ve a tu Perfil y configura tus API keys de ChatGPT, Claude o Gemini. Puedes usar tus propias cuentas o las compartidas.',
      },
      {
        question: '¿Qué puedo preguntar al Tutor de IA?',
        answer:
          'Puedes hacer cualquier pregunta sobre temas de PAES. El tutor te dará explicaciones personalizadas y te ayudará a entender conceptos difíciles.',
      },
      {
        question: '¿Es necesario configurar una API key?',
        answer:
          'Sí, necesitas al menos una API key configurada para usar el Tutor de IA. Puedes usar tus propias cuentas de ChatGPT, Claude o Gemini.',
      },
    ],
  },
]

export default function HelpPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-6">
        <Breadcrumbs className="mb-4" />
        <div className="flex items-center gap-3 mb-2">
          <HelpCircle className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Centro de Ayuda</h1>
        </div>
        <p className="text-muted-foreground">
          Encuentra respuestas a tus preguntas y aprende a usar todas las funcionalidades de PAES
          Tutor
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Guía Rápida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Preguntas frecuentes y consejos prácticos
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#quick-guide">
                Ver Guía
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              Primeros Pasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Aprende a usar PAES Tutor paso a paso
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                Ir al Inicio
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Consejos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Mejora tu rendimiento con estos tips
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link href="#tips">
                Ver Consejos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Help Sections */}
      <div className="space-y-6 mb-8">
        {HELP_SECTIONS.map(section => {
          const Icon = section.icon
          return (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <CardTitle>{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {section.topics.map((topic, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">{topic.question}</h4>
                      <p className="text-sm text-muted-foreground">{topic.answer}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Guide */}
      <div id="quick-guide" className="mb-8">
        <QuickGuide />
      </div>

      {/* Tips Section */}
      <Card id="tips" className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Consejos para Mejorar tu Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold mb-1">Practica Regularmente</h4>
                <p className="text-sm text-muted-foreground">
                  Realiza exámenes de práctica con frecuencia. La consistencia es clave para
                  mejorar.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold mb-1">Revisa tus Errores</h4>
                <p className="text-sm text-muted-foreground">
                  Después de cada examen, revisa las preguntas incorrectas y lee las explicaciones
                  detalladas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div>
                <h4 className="font-semibold mb-1">Usa los Materiales de Estudio</h4>
                <p className="text-sm text-muted-foreground">
                  Refuerza tus temas débiles con los materiales de estudio organizados por
                  asignatura y tema.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
              <div>
                <h4 className="font-semibold mb-1">Aprovecha el Tutor de IA</h4>
                <p className="text-sm text-muted-foreground">
                  Haz preguntas específicas sobre temas que no entiendes. El tutor te dará
                  explicaciones personalizadas.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                5
              </div>
              <div>
                <h4 className="font-semibold mb-1">Monitorea tu Progreso</h4>
                <p className="text-sm text-muted-foreground">
                  Revisa regularmente tu Dashboard para identificar patrones, fortalezas y áreas de
                  mejora.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
