'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  X,
  ArrowRight,
  BookOpen,
  BarChart3,
  FileText,
  Bot,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { safeRound } from '@/app/api/notes/versions/validation-utils'

interface WelcomeTourProps {
  onComplete: () => void
  onSkip: () => void
}

const TOUR_STEPS = [
  {
    id: 'search',
    title: 'Búsqueda Global',
    description:
      'Presiona Cmd/Ctrl+K o haz clic en "Buscar..." para encontrar rápidamente exámenes, materiales y temas.',
    icon: Search,
    color: 'text-blue-600',
  },
  {
    id: 'exams',
    title: 'Realizar Exámenes',
    description:
      'Ve a "Exámenes" para practicar con exámenes reales. Tu progreso se guarda automáticamente.',
    icon: BookOpen,
    color: 'text-green-600',
  },
  {
    id: 'dashboard',
    title: 'Ver tu Progreso',
    description:
      'El Dashboard muestra tus estadísticas, fortalezas, debilidades y recomendaciones personalizadas.',
    icon: BarChart3,
    color: 'text-purple-600',
  },
  {
    id: 'materials',
    title: 'Materiales de Estudio',
    description:
      'Encuentra recursos educativos organizados por asignatura y tema para reforzar tus conocimientos.',
    icon: FileText,
    color: 'text-orange-600',
  },
  {
    id: 'ai-tutor',
    title: 'Tutor de IA',
    description:
      'Haz preguntas sobre cualquier tema de PAES y recibe explicaciones personalizadas con IA.',
    icon: Bot,
    color: 'text-indigo-600',
  },
]

function getStepIndicatorColorClass(params: {
  isCompleted: boolean
  isCurrent: boolean
  stepColor: string
}) {
  if (params.isCompleted) {
    return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
  }
  if (params.isCurrent) {
    return `bg-primary/10 ${params.stepColor}`
  }
  return 'bg-muted text-muted-foreground'
}

export function WelcomeTour({ onComplete, onSkip }: Readonly<WelcomeTourProps>) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const currentStepData = TOUR_STEPS.at(currentStep) ?? TOUR_STEPS[0]
  const Icon = currentStepData.icon
  const isLastStep = currentStep === TOUR_STEPS.length - 1

  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]))

    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleSkip = () => {
    onSkip()
  }

  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card className="w-full max-w-2xl relative">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 rounded-lg bg-muted ${currentStepData.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Bienvenido a PAES Tutor</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    Paso {currentStep + 1} de {TOUR_STEPS.length}
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-base mt-2">
                {currentStepData.description}
              </CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSkip} className="flex-shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progreso del tour</span>
              <span>{safeRound(progress, 0)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-center gap-2">
            {TOUR_STEPS.map((step, idx) => {
              const StepIcon = step.icon
              const isCompleted = completedSteps.has(step.id) || idx < currentStep
              const isCurrent = idx === currentStep
              const stepIndicatorColorClass = getStepIndicatorColorClass({
                isCompleted,
                isCurrent,
                stepColor: step.color,
              })

              return (
                <div
                  key={step.id}
                  className={`flex items-center gap-2 ${
                    isCurrent ? 'scale-110' : ''
                  } transition-transform`}
                >
                  <div
                    className={`p-2 rounded-lg ${stepIndicatorColorClass}`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <StepIcon className="h-4 w-4" />
                    )}
                  </div>
                  {idx < TOUR_STEPS.length - 1 && (
                    <div className={`h-0.5 w-8 ${isCompleted ? 'bg-green-500' : 'bg-muted'}`} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="ghost" onClick={handleSkip}>
              Omitir tour
            </Button>
            <Button onClick={handleNext} className="gap-2">
              {isLastStep ? 'Comenzar' : 'Siguiente'}
              {!isLastStep && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
