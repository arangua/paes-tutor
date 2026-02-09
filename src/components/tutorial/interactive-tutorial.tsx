'use client'

 

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  X,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Target,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  TIME_CONSTANTS,
  UI_CONSTANTS,
  CSS_TRANSFORM_CONSTANTS,
} from '@/lib/constants'
import { safeRound, safeToISOString } from '@/app/api/notes/versions/validation-utils'

export interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string // Selector CSS del elemento a destacar
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center'
  action?: () => void // Acción a ejecutar (ej: abrir un diálogo)
  highlight?: boolean // Si debe destacar el elemento
}

interface InteractiveTutorialProps {
  steps: TutorialStep[]
  onComplete: () => void
  onSkip: () => void
  storageKey?: string // Para guardar progreso
  open?: boolean // Si el tutorial está abierto/activo
  autoStart?: boolean // Si debe iniciarse automáticamente
  disableSpotlight?: boolean // Desactivar el efecto "telescopio"
}

/**
 * Tutorial interactivo con highlights y guía paso a paso
 * Basado en estándares de Linear, Notion, Figma
 */
export function InteractiveTutorial({
  steps,
  onComplete,
  onSkip,
  storageKey = 'tutorial-progress',
  open: controlledOpen,
  autoStart = false,
  disableSpotlight = false,
}: Readonly<InteractiveTutorialProps>) {
  const [internalOpen, setInternalOpen] = useState(autoStart)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())
  const [highlightedElement, setHighlightedElement] = useState<HTMLElement | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState<ReturnType<typeof getTooltipPosition>>({
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'fixed',
  })
  const overlayRef = useRef<HTMLDivElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const actionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const positionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const resizeObserverRef = useRef<ResizeObserver | null>(null)

  // Determinar si el tutorial está abierto
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen

  // Cargar progreso guardado y verificar si ya se completó
  useEffect(() => {
    if (typeof window === 'undefined' || !storageKey) return

    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const data = JSON.parse(saved)
        // Si ya está completado o saltado, no iniciar automáticamente
        if (data.completed || data.skipped) {
          queueMicrotask(() => {
            setInternalOpen(prev => prev === false ? prev : false)
          })
          return
        }
        if (data.completedSteps) {
          queueMicrotask(() => {
            setCompletedSteps(prev => {
              const next = new Set(data.completedSteps)
              return prev.size === next.size && [...prev].every(v => next.has(v)) && [...next].every(v => prev.has(v)) ? prev : next
            })
          })
        }
        if (data.currentStep !== undefined) {
          queueMicrotask(() => {
            setCurrentStep(prev => prev === data.currentStep ? prev : data.currentStep)
          })
        }
      }
      // Si autoStart está activo y no hay datos guardados, iniciar
      if (autoStart && !saved) {
        queueMicrotask(() => {
          setInternalOpen(prev => prev === true ? prev : true)
        })
      }
    } catch {
      // Ignorar errores
    }
  }, [storageKey, autoStart])

  // Guardar progreso
  useEffect(() => {
    if (typeof window === 'undefined' || !storageKey) return

    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          currentStep,
          completedSteps: Array.from(completedSteps),
        })
      )
    } catch {
      // Ignorar errores
    }
  }, [currentStep, completedSteps, storageKey])

   
  const currentStepData = steps[currentStep] // index controlled by step bounds
  const isLastStep = currentStep === steps.length - 1
  const progress = ((currentStep + 1) / steps.length) * 100

  // Función para calcular posición (extraída para reutilizar)
  const calculateTooltipPosition = useCallback((): ReturnType<typeof getTooltipPosition> => {
    if (!highlightedElement || !currentStepData) {
      return { 
        top: '50%', 
        left: '50%', 
        transform: 'translate(-50%, -50%)', 
        position: 'fixed' as const 
      }
    }

    const rect = highlightedElement.getBoundingClientRect()
    const preferredPosition = currentStepData.position || 'bottom'
    
    // Usar dimensiones reales si están disponibles, sino estimadas
    const tooltipWidth =
      tooltipRef.current?.offsetWidth || UI_CONSTANTS.TOOLTIP.DEFAULT_WIDTH
    const tooltipHeight =
      tooltipRef.current?.offsetHeight || UI_CONSTANTS.TOOLTIP.DEFAULT_HEIGHT
    const padding = UI_CONSTANTS.TOOLTIP.PADDING
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top = 0
    let left = 0
    let transformX = CSS_TRANSFORM_CONSTANTS.CENTER
    let transformY = CSS_TRANSFORM_CONSTANTS.BOTTOM

    switch (preferredPosition) {
      case 'top':
        top = rect.top - tooltipHeight - padding
        left = rect.left + rect.width / 2
        transformY = CSS_TRANSFORM_CONSTANTS.TOP
        break
      case 'bottom':
        top = rect.bottom + padding
        left = rect.left + rect.width / 2
        transformY = CSS_TRANSFORM_CONSTANTS.BOTTOM
        break
      case 'left':
        top = rect.top + rect.height / 2
        left = rect.left - tooltipWidth - padding
        transformX = CSS_TRANSFORM_CONSTANTS.LEFT
        transformY = CSS_TRANSFORM_CONSTANTS.CENTER
        break
      case 'right':
        top = rect.top + rect.height / 2
        left = rect.right + padding
        transformX = CSS_TRANSFORM_CONSTANTS.RIGHT
        transformY = CSS_TRANSFORM_CONSTANTS.CENTER
        break
      default:
        top = rect.top + rect.height / 2
        left = rect.left + rect.width / 2
        transformX = CSS_TRANSFORM_CONSTANTS.CENTER
        transformY = CSS_TRANSFORM_CONSTANTS.CENTER
    }

    // Función auxiliar para calcular la posición real del tooltip considerando el transform
    const getActualBounds = (
      top: number,
      left: number,
      transformX: string,
      transformY: string
    ) => {
      let actualTop = top
      let actualLeft = left
      let actualRight = left
      let actualBottom = top

      // Calcular posición real considerando transform
      if (transformY === CSS_TRANSFORM_CONSTANTS.TOP) {
        // Tooltip arriba: top es la parte inferior del tooltip
        actualTop = top - tooltipHeight
        actualBottom = top
      } else if (transformY === CSS_TRANSFORM_CONSTANTS.CENTER) {
        // Tooltip centrado verticalmente
        actualTop = top - tooltipHeight / 2
        actualBottom = top + tooltipHeight / 2
      } else {
        // Tooltip abajo: top es la parte superior del tooltip
        actualTop = top
        actualBottom = top + tooltipHeight
      }

      if (transformX === CSS_TRANSFORM_CONSTANTS.LEFT) {
        // Tooltip a la izquierda: left es la parte derecha del tooltip
        actualLeft = left - tooltipWidth
        actualRight = left
      } else if (transformX === CSS_TRANSFORM_CONSTANTS.CENTER) {
        // Tooltip centrado horizontalmente
        actualLeft = left - tooltipWidth / 2
        actualRight = left + tooltipWidth / 2
      } else {
        // Tooltip a la derecha: left es la parte izquierda del tooltip
        actualLeft = left
        actualRight = left + tooltipWidth
      }

      return { actualTop, actualBottom, actualLeft, actualRight }
    }

    // Validar y ajustar posición vertical
    let attempts = 0
    const maxAttempts = UI_CONSTANTS.TOOLTIP.MAX_POSITION_ATTEMPTS
    while (attempts < maxAttempts) {
      const bounds = getActualBounds(top, left, transformX, transformY)
      
      // Verificar si se sale por arriba
      if (bounds.actualTop < padding) {
        if (transformY === CSS_TRANSFORM_CONSTANTS.TOP) {
          // Cambiar a bottom
          top = rect.bottom + padding
          transformY = CSS_TRANSFORM_CONSTANTS.BOTTOM
        } else if (transformY === CSS_TRANSFORM_CONSTANTS.CENTER) {
          // Mover hacia abajo
          top = padding + tooltipHeight / 2
          transformY = CSS_TRANSFORM_CONSTANTS.CENTER
        } else {
          // Ya está en bottom, centrar si es necesario
          top = Math.max(padding, Math.min(viewportHeight - tooltipHeight - padding, (viewportHeight - tooltipHeight) / 2))
          transformY = CSS_TRANSFORM_CONSTANTS.CENTER
        }
        attempts++
        continue
      }

      // Verificar si se sale por abajo
      if (bounds.actualBottom > viewportHeight - padding) {
        if (transformY === CSS_TRANSFORM_CONSTANTS.BOTTOM) {
          // Cambiar a top
          const topPos = rect.top - tooltipHeight - padding
          if (topPos >= padding) {
            top = topPos
            transformY = CSS_TRANSFORM_CONSTANTS.TOP
          } else {
            // Centrar si no cabe arriba
            top = Math.max(padding + tooltipHeight / 2, (viewportHeight - tooltipHeight) / 2)
            transformY = CSS_TRANSFORM_CONSTANTS.CENTER
          }
        } else if (transformY === CSS_TRANSFORM_CONSTANTS.CENTER) {
          // Mover hacia arriba
          top = viewportHeight - padding - tooltipHeight / 2
          transformY = CSS_TRANSFORM_CONSTANTS.CENTER
        } else {
          // Ya está en top, centrar si es necesario
          top = Math.max(padding + tooltipHeight / 2, (viewportHeight - tooltipHeight) / 2)
          transformY = CSS_TRANSFORM_CONSTANTS.CENTER
        }
        attempts++
        continue
      }

      // Si llegamos aquí, está bien verticalmente
      break
    }

    // Validar y ajustar posición horizontal
    const bounds = getActualBounds(top, left, transformX, transformY)
    
    if (bounds.actualLeft < padding) {
      if (transformX === CSS_TRANSFORM_CONSTANTS.LEFT) {
        left = padding + tooltipWidth
        transformX = CSS_TRANSFORM_CONSTANTS.RIGHT
      } else if (transformX === CSS_TRANSFORM_CONSTANTS.CENTER) {
        left = padding + tooltipWidth / 2
        transformX = CSS_TRANSFORM_CONSTANTS.CENTER
      } else {
        left = padding
        transformX = CSS_TRANSFORM_CONSTANTS.RIGHT
      }
    } else if (bounds.actualRight > viewportWidth - padding) {
      if (transformX === CSS_TRANSFORM_CONSTANTS.RIGHT) {
        left = viewportWidth - padding - tooltipWidth
        transformX = CSS_TRANSFORM_CONSTANTS.LEFT
      } else if (transformX === CSS_TRANSFORM_CONSTANTS.CENTER) {
        left = viewportWidth - padding - tooltipWidth / 2
        transformX = CSS_TRANSFORM_CONSTANTS.CENTER
      } else {
        left = viewportWidth - padding
        transformX = CSS_TRANSFORM_CONSTANTS.LEFT
      }
    }

    // Validación final: asegurar que siempre esté dentro del viewport
    const finalBounds = getActualBounds(top, left, transformX, transformY)
    
    // Ajustar verticalmente si aún se sale
    if (finalBounds.actualTop < padding) {
      if (transformY === CSS_TRANSFORM_CONSTANTS.TOP) {
        top = padding + tooltipHeight
      } else if (transformY === CSS_TRANSFORM_CONSTANTS.CENTER) {
        top = padding + tooltipHeight / 2
      } else {
        top = padding
      }
    } else if (finalBounds.actualBottom > viewportHeight - padding) {
      if (transformY === CSS_TRANSFORM_CONSTANTS.TOP) {
        top = viewportHeight - padding
      } else if (transformY === CSS_TRANSFORM_CONSTANTS.CENTER) {
        top = viewportHeight - padding - tooltipHeight / 2
      } else {
        top = viewportHeight - padding - tooltipHeight
      }
    }

    // Ajustar horizontalmente si aún se sale
    const finalBounds2 = getActualBounds(top, left, transformX, transformY)
    if (finalBounds2.actualLeft < padding) {
      if (transformX === CSS_TRANSFORM_CONSTANTS.LEFT) {
        left = padding + tooltipWidth
      } else if (transformX === CSS_TRANSFORM_CONSTANTS.CENTER) {
        left = padding + tooltipWidth / 2
      } else {
        left = padding
      }
    } else if (finalBounds2.actualRight > viewportWidth - padding) {
      if (transformX === CSS_TRANSFORM_CONSTANTS.LEFT) {
        left = viewportWidth - padding
      } else if (transformX === CSS_TRANSFORM_CONSTANTS.CENTER) {
        left = viewportWidth - padding - tooltipWidth / 2
      } else {
        left = viewportWidth - padding - tooltipWidth
      }
    }

    return {
      top: `${top}px`,
      left: `${left}px`,
      transform: `translate(${transformX}, ${transformY})`,
      position: 'fixed' as const,
    }
  }, [highlightedElement, currentStepData])

  // Encontrar y destacar elemento objetivo
  useEffect(() => {
    if (!currentStepData?.target) {
      queueMicrotask(() => {
        setHighlightedElement(prev => prev === null ? prev : null)
        setTooltipPosition(prev => {
          const next = {
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'fixed' as const,
          }
          return prev.top === next.top && prev.left === next.left && prev.transform === next.transform && prev.position === next.position ? prev : next
        })
      })
      return
    }

    const element = document.querySelector(currentStepData.target) as HTMLElement
    if (element) {
      queueMicrotask(() => {
        setHighlightedElement(prev => prev === element ? prev : element)
      })
      // Ejecutar acción si existe
      if (currentStepData.action) {
        // Limpiar timeout anterior si existe
        if (actionTimeoutRef.current) {
          clearTimeout(actionTimeoutRef.current)
        }
        actionTimeoutRef.current = setTimeout(() => {
          currentStepData.action?.()
        }, TIME_CONSTANTS.ANIMATION_DELAY_MS)
      }

      // Scroll suave al elemento
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      
      // Calcular posición inicial
      // Limpiar timeout anterior si existe
      if (positionTimeoutRef.current) {
        clearTimeout(positionTimeoutRef.current)
      }
      positionTimeoutRef.current = setTimeout(() => {
        setTooltipPosition(calculateTooltipPosition())
      }, TIME_CONSTANTS.FOCUS_TRANSITION_MS)
    } else {
      queueMicrotask(() => {
        setHighlightedElement(prev => prev === null ? prev : null)
      })
    }

    // Cleanup: limpiar timeouts al cambiar de paso
    return () => {
      if (actionTimeoutRef.current) {
        clearTimeout(actionTimeoutRef.current)
        actionTimeoutRef.current = null
      }
      if (positionTimeoutRef.current) {
        clearTimeout(positionTimeoutRef.current)
        positionTimeoutRef.current = null
      }
    }
  }, [currentStep, currentStepData, calculateTooltipPosition])

  // Actualizar posición cuando cambian las dimensiones del tooltip
  useEffect(() => {
    if (!isOpen || !highlightedElement) return

    const updatePosition = () => {
      setTooltipPosition(calculateTooltipPosition())
    }

    // Actualizar después de que el tooltip se renderice
    const timeout = setTimeout(updatePosition, TIME_CONSTANTS.TOOLTIP_POSITION_UPDATE_DELAY_MS)
    
    // Actualizar en resize y scroll
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    // Usar ResizeObserver para detectar cambios en el tamaño del tooltip
    // Guardar en ref para garantizar cleanup correcto
    if (tooltipRef.current) {
      // Desconectar observer anterior si existe
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }

      const resizeObserver = new ResizeObserver(() => {
        updatePosition()
      })
      resizeObserverRef.current = resizeObserver
      resizeObserver.observe(tooltipRef.current)
    }

    return () => {
      clearTimeout(timeout)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
      // Desconectar observer usando ref para garantizar cleanup
      if (resizeObserverRef.current) {
        resizeObserverRef.current.disconnect()
        resizeObserverRef.current = null
      }
    }
  }, [isOpen, highlightedElement, calculateTooltipPosition])


  const handleNext = () => {
    setCompletedSteps(prev => new Set([...prev, currentStepData.id]))

    if (isLastStep) {
      // Marcar tutorial como completado
      if (storageKey && typeof window !== 'undefined') {
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              completed: true,
              completedAt: safeToISOString(new Date()),
            })
          )
        } catch {
          // Ignorar errores
        }
      }
      onComplete()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSkip = useCallback(() => {
    if (storageKey && typeof window !== 'undefined') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({
            skipped: true,
            skippedAt: safeToISOString(new Date()),
          })
        )
      } catch {
        // Ignorar errores
      }
    }
    onSkip()
  }, [storageKey, onSkip])

  // Atajo de teclado para cerrar (Esc)
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleSkip()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, handleSkip])

  // No renderizar si no está abierto
  if (!isOpen) {
    return null
  }

  let overlayBackground = 'rgba(0, 0, 0, 0.3)'
  if (disableSpotlight) {
    overlayBackground = 'transparent'
  } else if (highlightedElement) {
    const rect = highlightedElement.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const maxDimension = Math.max(rect.width, rect.height)
    const innerRadius = maxDimension / 2 + 10
    const outerRadius = maxDimension / 2 + 20

    overlayBackground = `radial-gradient(circle at ${centerX}px ${centerY}px, transparent 0px, transparent ${innerRadius}px, rgba(0, 0, 0, 0.3) ${outerRadius}px)`
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] pointer-events-none"
      style={{
        // Overlay más sutil con agujero para el elemento destacado (solo si spotlight está activo)
        background: overlayBackground,
        backdropFilter: disableSpotlight ? 'none' : 'blur(1px)',
      }}
    >
      {/* Highlight del elemento (solo si spotlight no está desactivado) */}
      {highlightedElement && !disableSpotlight && (
        <div
          className="absolute pointer-events-none"
          style={{
            top: `${highlightedElement.getBoundingClientRect().top}px`,
            left: `${highlightedElement.getBoundingClientRect().left}px`,
            width: `${highlightedElement.getBoundingClientRect().width}px`,
            height: `${highlightedElement.getBoundingClientRect().height}px`,
            boxShadow: `0 0 0 ${UI_CONSTANTS.TOOLTIP.HIGHLIGHT_BORDER_WIDTH}px rgba(59, 130, 246, 0.4), 0 0 ${UI_CONSTANTS.TOOLTIP.HIGHLIGHT_BLUR}px rgba(59, 130, 246, 0.2)`,
            borderRadius: '8px',
            zIndex: 10000,
            animation: `pulse ${UI_CONSTANTS.TOOLTIP.PULSE_ANIMATION_DURATION} cubic-bezier(0.4, 0, 0.6, 1) infinite`,
          }}
        />
      )}

      {/* Tooltip del tutorial */}
      <div
        ref={tooltipRef}
        className="pointer-events-auto"
        style={tooltipPosition}
      >
        <Card className="w-full max-w-md shadow-2xl border-2 border-primary bg-background">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
                </div>
                <CardDescription className="text-sm">{currentStepData.description}</CardDescription>
                {!currentStepData.target && (
                  <div className="mt-2 p-2 rounded-md bg-muted/50 text-xs text-muted-foreground">
                    💡 <strong>Tip:</strong> El efecto &quot;telescopio&quot; resalta elementos importantes. 
                    Puedes cerrar este tutorial en cualquier momento con la X o &quot;Omitir&quot;.
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSkip}
                className="h-8 w-8 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                title="Cerrar tutorial (Esc)"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Paso {currentStep + 1} de {steps.length}</span>
                <span>{safeRound(progress, 0)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {steps.map((step, idx) => {
                const isCompleted = completedSteps.has(step.id) || idx < currentStep
                const isCurrent = idx === currentStep
                let indicatorVariantClass = 'bg-muted'
                if (isCompleted) {
                  indicatorVariantClass = 'bg-green-500'
                } else if (isCurrent) {
                  indicatorVariantClass = 'bg-primary w-8'
                }

                return (
                  <div
                    key={step.id}
                    className={cn(
                      'h-2 w-2 rounded-full transition-all',
                      indicatorVariantClass
                    )}
                  />
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-2">
                {currentStep > 0 && (
                  <Button variant="outline" size="sm" onClick={handlePrevious}>
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSkip}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Cerrar (Esc)
                </Button>
              </div>
              <Button onClick={handleNext} size="sm" className="gap-2">
                {isLastStep ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Completar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>

            {/* Hint */}
            {currentStepData.target && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Target className="h-3 w-3" />
                <span>Mira el elemento destacado en azul arriba</span>
              </div>
            )}
            {!currentStepData.target && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2 border-t">
                <Sparkles className="h-3 w-3" />
                <span>Presiona &quot;Siguiente&quot; para continuar o &quot;Cerrar&quot; para salir</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  )
}
