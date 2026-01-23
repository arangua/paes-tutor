'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ChevronRight,
  ChevronDown,
  Lightbulb,
  BookOpen,
  Loader2,
  Sparkles,
  CheckCircle2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

export interface StepByStepExplanationData {
  steps: Array<{
    number: number
    title: string
    description: string
    formula?: string
    explanation: string
  }>
  summary: string
  tips?: string[]
  relatedConcepts?: string[]
}

interface StepByStepExplanationProps {
  explanation: StepByStepExplanationData
  question?: string
  correctAnswer?: string
  isLoading?: boolean
  className?: string
}

export function StepByStepExplanation({
  explanation,
  question,
  correctAnswer,
  isLoading = false,
  className,
}: Readonly<StepByStepExplanationProps>) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1])) // Expandir primer paso por defecto
  const [showTips, setShowTips] = useState(false)
  const [showConcepts, setShowConcepts] = useState(false)

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev)
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber)
      } else {
        newSet.add(stepNumber)
      }
      return newSet
    })
  }

  const renderFormula = (formula: string) => {
    // Por ahora renderizamos LaTeX como texto formateado
    // En el futuro se puede integrar MathJax o KaTeX
    return (
      <div className="bg-muted p-3 rounded-lg font-mono text-sm my-2 border border-border">
        <code className="text-foreground">{formula}</code>
      </div>
    )
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span className="text-muted-foreground">Generando explicación paso a paso...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('border-2 border-primary/20', className)}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Explicación Paso a Paso</CardTitle>
        </div>
        {question && (
          <CardDescription className="mt-2">
            <strong>Pregunta:</strong> {question}
          </CardDescription>
        )}
        {correctAnswer && (
          <CardDescription>
            <strong>Respuesta correcta:</strong> {correctAnswer}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pasos */}
        <div className="space-y-3">
          {explanation.steps.map((step, _index) => {
            const isExpanded = expandedSteps.has(step.number)
            return (
              <Collapsible
                key={step.number}
                open={isExpanded}
                onOpenChange={() => toggleStep(step.number)}
              >
                <div
                  className={cn(
                    'border rounded-lg transition-all',
                    isExpanded
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-border bg-muted/30 hover:bg-muted/50'
                  )}
                >
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                      <div className="flex items-start gap-3 flex-1 text-left">
                        <div
                          className={cn(
                            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                            isExpanded
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {step.number}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1">{step.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-2">
                            {step.description}
                          </div>
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="h-5 w-5 ml-2 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 ml-2 flex-shrink-0" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-4 pb-4 space-y-3">
                      {step.formula && renderFormula(step.formula)}
                      <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {step.explanation}
                      </div>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            )
          })}
        </div>

        {/* Resumen */}
        <div className="mt-6 p-4 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-semibold text-sm mb-1">Resumen</div>
              <p className="text-sm text-foreground">{explanation.summary}</p>
            </div>
          </div>
        </div>

        {/* Tips */}
        {explanation.tips && explanation.tips.length > 0 && (
          <Collapsible open={showTips} onOpenChange={setShowTips}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  <span>Tips y Consejos ({explanation.tips.length})</span>
                </div>
                {showTips ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                {explanation.tips.map((tip, index) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Conceptos Relacionados */}
        {explanation.relatedConcepts && explanation.relatedConcepts.length > 0 && (
          <Collapsible open={showConcepts} onOpenChange={setShowConcepts}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Conceptos Relacionados ({explanation.relatedConcepts.length})</span>
                </div>
                {showConcepts ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 flex flex-wrap gap-2">
                {explanation.relatedConcepts.map((concept, index) => (
                  <Badge key={index} variant="secondary">
                    {concept}
                  </Badge>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  )
}
