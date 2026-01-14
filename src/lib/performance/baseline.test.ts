/**
 * Tests del Performance Baseline
 * 
 * Regla Enterprise:
 * Validar que los umbrales están correctamente definidos y son accesibles.
 */

import { describe, it, expect } from 'vitest'
import {
  SERVER_BASELINE,
  CLIENT_BASELINE,
  UX_BASELINE,
  getBaselineThreshold,
  meetsBaseline,
  type PerformanceMetric,
} from './baseline'

describe('Performance Baseline', () => {
  describe('SERVER_BASELINE', () => {
    it('debe tener umbrales definidos', () => {
      expect(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS).toBeGreaterThan(0)
      expect(SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS).toBeGreaterThan(0)
      expect(SERVER_BASELINE.DB_QUERY_MAX_TIME_MS).toBeGreaterThan(0)
      expect(SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS).toBeGreaterThan(0)
      expect(SERVER_BASELINE.SSR_MAX_TIME_MS).toBeGreaterThan(0)
    })

    it('debe tener umbrales razonables', () => {
      // API crítica debe ser más rápida que API normal
      expect(SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS).toBeLessThan(
        SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS
      )

      // Query simple debe ser más rápida que query compleja
      expect(SERVER_BASELINE.DB_QUERY_MAX_TIME_MS).toBeLessThan(
        SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS
      )
    })
  })

  describe('CLIENT_BASELINE', () => {
    it('debe tener umbrales definidos', () => {
      expect(CLIENT_BASELINE.FCP_MAX_TIME_MS).toBeGreaterThan(0)
      expect(CLIENT_BASELINE.TTI_MAX_TIME_MS).toBeGreaterThan(0)
      expect(CLIENT_BASELINE.HYDRATION_MAX_TIME_MS).toBeGreaterThan(0)
      expect(CLIENT_BASELINE.INITIAL_RENDER_MAX_TIME_MS).toBeGreaterThan(0)
    })

    it('debe tener umbrales razonables', () => {
      // FCP debe ser más rápido que TTI
      expect(CLIENT_BASELINE.FCP_MAX_TIME_MS).toBeLessThan(CLIENT_BASELINE.TTI_MAX_TIME_MS)

      // Hydration debe ser más rápida que render inicial
      expect(CLIENT_BASELINE.HYDRATION_MAX_TIME_MS).toBeLessThan(
        CLIENT_BASELINE.INITIAL_RENDER_MAX_TIME_MS
      )
    })
  })

  describe('UX_BASELINE', () => {
    it('debe tener umbrales definidos', () => {
      expect(UX_BASELINE.LOADING_THRESHOLD_MS).toBeGreaterThan(0)
      expect(UX_BASELINE.FEEDBACK_DELAY_MS).toBeGreaterThan(0)
      expect(UX_BASELINE.TRANSITION_MAX_TIME_MS).toBeGreaterThan(0)
    })
  })

  describe('getBaselineThreshold', () => {
    it('debe retornar umbral correcto para cada métrica', () => {
      expect(getBaselineThreshold('api_response')).toBe(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS)
      expect(getBaselineThreshold('api_critical')).toBe(
        SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS
      )
      expect(getBaselineThreshold('db_query')).toBe(SERVER_BASELINE.DB_QUERY_MAX_TIME_MS)
      expect(getBaselineThreshold('fcp')).toBe(CLIENT_BASELINE.FCP_MAX_TIME_MS)
      expect(getBaselineThreshold('loading')).toBe(UX_BASELINE.LOADING_THRESHOLD_MS)
    })

    it('debe retornar Infinity para métricas desconocidas', () => {
      // TypeScript debería prevenir esto, pero por seguridad:
      const unknownMetric = 'unknown' as PerformanceMetric
      expect(getBaselineThreshold(unknownMetric)).toBe(Infinity)
    })
  })

  describe('meetsBaseline', () => {
    it('debe retornar true cuando el tiempo está dentro del umbral', () => {
      expect(meetsBaseline('api_response', 400)).toBe(true)
      expect(meetsBaseline('api_response', 500)).toBe(true) // Límite exacto
      expect(meetsBaseline('api_critical', 150)).toBe(true)
    })

    it('debe retornar false cuando el tiempo excede el umbral', () => {
      expect(meetsBaseline('api_response', 501)).toBe(false)
      expect(meetsBaseline('api_critical', 201)).toBe(false)
      expect(meetsBaseline('db_query', 101)).toBe(false)
    })
  })
})
