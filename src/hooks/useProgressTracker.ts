'use client'

import { useState, useCallback, useRef } from 'react'
import { safeRound, safeDivide, ensureFiniteNumber } from '@/app/api/notes/versions/validation-utils'

export interface ProgressStep {
  id: string
  label: string
  status: 'pending' | 'processing' | 'completed' | 'error'
  error?: string
}

export interface ProgressTrackerOptions {
  totalSteps?: number
  onProgress?: (progress: number, current: number, total: number, message: string) => void
  onStepChange?: (step: ProgressStep) => void
  onComplete?: () => void
  onError?: (error: Error) => void
}

/**
 * Hook para rastrear progreso granular de operaciones
 * Basado en estándares de Google Drive, Dropbox, VS Code
 */
export function useProgressTracker(options: ProgressTrackerOptions = {}) {
  const [progress, setProgress] = useState(0)
  const [current, setCurrent] = useState(0)
  const [total, setTotal] = useState(options.totalSteps || 0)
  const [message, setMessage] = useState('')
  const [steps, setSteps] = useState<ProgressStep[]>([])
  const [isActive, setIsActive] = useState(false)
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState<number | null>(null)
  
  const startTimeRef = useRef<number | null>(null)
  const lastUpdateTimeRef = useRef<number | null>(null)

  const updateProgress = useCallback(
    (currentValue: number, totalValue: number, stepMessage?: string) => {
      // ✅ Enterprise: Usar safeDivide para evitar división por cero
      const safeCurrent = ensureFiniteNumber(currentValue, 0)
      const safeTotal = ensureFiniteNumber(totalValue, 0)
      const newProgress = safeTotal > 0 ? safeRound(safeDivide(safeCurrent, safeTotal, 0) * 100, 0) : 0
      setCurrent(currentValue)
      setTotal(totalValue)
      setProgress(newProgress)
      
      if (stepMessage) {
        setMessage(stepMessage)
      }

      // Calcular tiempo estimado
      const now = Date.now()
      if (startTimeRef.current === null) {
        startTimeRef.current = now
        lastUpdateTimeRef.current = now
        return
      }

      if (lastUpdateTimeRef.current && currentValue > 0) {
        // ✅ Enterprise: Usar funciones seguras para cálculos de tiempo
        const elapsed = safeDivide(now - startTimeRef.current, 1000, 0) // segundos
        const safeElapsed = ensureFiniteNumber(elapsed, 1) // Evitar división por cero
        const rate = safeDivide(currentValue, safeElapsed, 0) // items por segundo
        const remaining = ensureFiniteNumber(totalValue - currentValue, 0)
        const safeRate = ensureFiniteNumber(rate, 1) // Evitar división por cero
        const estimated = safeDivide(remaining, safeRate, 0) // segundos restantes
        
        const safeEstimated = ensureFiniteNumber(estimated, 0)
        if (safeEstimated > 0 && safeEstimated < 3600) { // Solo mostrar si es menos de 1 hora
          setEstimatedTimeRemaining(safeRound(safeEstimated, 0))
        }
      }

      lastUpdateTimeRef.current = now

      // Llamar callbacks
      if (options.onProgress) {
        options.onProgress(newProgress, currentValue, totalValue, stepMessage || message)
      }
    },
    [message, options]
  )

  const addStep = useCallback(
    (step: Omit<ProgressStep, 'status'>) => {
      const newStep: ProgressStep = {
        ...step,
        status: 'pending',
      }
      setSteps(prev => [...prev, newStep])
      return newStep.id
    },
    []
  )

  const updateStep = useCallback((stepId: string, updates: Partial<ProgressStep>) => {
    setSteps(prev =>
      prev.map(step => (step.id === stepId ? { ...step, ...updates } : step))
    )

    const updatedStep = steps.find(s => s.id === stepId)
    if (updatedStep && options.onStepChange) {
      options.onStepChange({ ...updatedStep, ...updates })
    }
  }, [steps, options])

  const startStep = useCallback((stepId: string) => {
    updateStep(stepId, { status: 'processing' })
  }, [updateStep])

  const completeStep = useCallback((stepId: string) => {
    updateStep(stepId, { status: 'completed' })
  }, [updateStep])

  const errorStep = useCallback((stepId: string, error: string) => {
    updateStep(stepId, { status: 'error', error })
  }, [updateStep])

  const start = useCallback((totalSteps: number, initialMessage = 'Iniciando...') => {
    setIsActive(true)
    setProgress(0)
    setCurrent(0)
    setTotal(totalSteps)
    setMessage(initialMessage)
    setSteps([])
    setEstimatedTimeRemaining(null)
    startTimeRef.current = Date.now()
    lastUpdateTimeRef.current = Date.now()
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
    setProgress(0)
    setCurrent(0)
    setTotal(0)
    setMessage('')
    setSteps([])
    setEstimatedTimeRemaining(null)
    startTimeRef.current = null
    lastUpdateTimeRef.current = null
  }, [])

  const complete = useCallback(() => {
    setIsActive(false)
    setProgress(100)
    setEstimatedTimeRemaining(0)
    if (options.onComplete) {
      options.onComplete()
    }
  }, [options])

  const fail = useCallback((error: Error) => {
    setIsActive(false)
    if (options.onError) {
      options.onError(error)
    }
  }, [options])

  return {
    progress,
    current,
    total,
    message,
    steps,
    isActive,
    estimatedTimeRemaining,
    updateProgress,
    addStep,
    updateStep,
    startStep,
    completeStep,
    errorStep,
    start,
    reset,
    complete,
    fail,
  }
}

