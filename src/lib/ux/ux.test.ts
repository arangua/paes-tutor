/**
 * Tests del UX Baseline
 */

import { describe, it, expect } from 'vitest'
import {
  UX_RULES,
  UX_ANTI_PATTERNS,
  shouldShowLoading,
  meetsFeedbackBaseline,
  meetsTransitionBaseline,
} from './ux.baseline'

describe('UX Baseline', () => {
  describe('UX_RULES', () => {
    it('debe tener umbrales definidos', () => {
      expect(UX_RULES.LOADING_THRESHOLD_MS).toBeGreaterThan(0)
      expect(UX_RULES.FEEDBACK_DELAY_MS).toBeGreaterThan(0)
      expect(UX_RULES.TRANSITION_MAX_TIME_MS).toBeGreaterThan(0)
    })

    it('debe tener umbrales razonables', () => {
      // Loading threshold debe ser mayor que feedback delay
      expect(UX_RULES.LOADING_THRESHOLD_MS).toBeGreaterThan(UX_RULES.FEEDBACK_DELAY_MS)

      // Transition debe ser mayor que feedback
      expect(UX_RULES.TRANSITION_MAX_TIME_MS).toBeGreaterThan(UX_RULES.FEEDBACK_DELAY_MS)
    })
  })

  describe('UX_ANTI_PATTERNS', () => {
    it('debe tener anti-patterns definidos', () => {
      expect(UX_ANTI_PATTERNS.IMPLICIT_CONDITIONAL_RENDER).toBeDefined()
      expect(UX_ANTI_PATTERNS.BLANK_SCREEN).toBeDefined()
      expect(UX_ANTI_PATTERNS.INFINITE_SPINNER).toBeDefined()
      expect(UX_ANTI_PATTERNS.GENERIC_ERROR_NO_ACTION).toBeDefined()
      expect(UX_ANTI_PATTERNS.SILENT_CATCH).toBeDefined()
    })
  })

  describe('shouldShowLoading', () => {
    it('debe retornar false si el tiempo es menor al umbral', () => {
      expect(shouldShowLoading(100)).toBe(false)
      expect(shouldShowLoading(200)).toBe(false) // Límite exacto
    })

    it('debe retornar true si el tiempo excede el umbral', () => {
      expect(shouldShowLoading(201)).toBe(true)
      expect(shouldShowLoading(500)).toBe(true)
    })
  })

  describe('meetsFeedbackBaseline', () => {
    it('debe retornar true si el tiempo está dentro del umbral', () => {
      expect(meetsFeedbackBaseline(50)).toBe(true)
      expect(meetsFeedbackBaseline(100)).toBe(true) // Límite exacto
    })

    it('debe retornar false si el tiempo excede el umbral', () => {
      expect(meetsFeedbackBaseline(101)).toBe(false)
    })
  })

  describe('meetsTransitionBaseline', () => {
    it('debe retornar true si el tiempo está dentro del umbral', () => {
      expect(meetsTransitionBaseline(200)).toBe(true)
      expect(meetsTransitionBaseline(300)).toBe(true) // Límite exacto
    })

    it('debe retornar false si el tiempo excede el umbral', () => {
      expect(meetsTransitionBaseline(301)).toBe(false)
    })
  })
})
