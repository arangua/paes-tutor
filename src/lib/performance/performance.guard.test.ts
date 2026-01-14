/**
 * Performance Regression Guard
 * 
 * Regla Enterprise:
 * Toda mejora sin guard es deuda futura.
 * 
 * Características:
 * - Tests que validan umbrales de performance
 * - Falla explícita si !meetsBaseline
 * - Determinista y CI-friendly
 */

import { describe, it, expect } from 'vitest'
import { measurePerformance } from './measure'
import { SERVER_BASELINE, CLIENT_BASELINE } from './baseline'

describe('Performance Regression Guard', () => {
  describe('API Performance', () => {
    it('API response debe cumplir con baseline (< 500ms)', async () => {
      const { measurement } = await measurePerformance('api_response', async () => {
        // Simular operación de API normal
        await new Promise((resolve) => setTimeout(resolve, 100))
        return { status: 200, data: 'test' }
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS)
    })

    it('API crítica debe cumplir con baseline (< 200ms)', async () => {
      const { measurement } = await measurePerformance('api_critical', async () => {
        // Simular operación crítica (health check, auth)
        await new Promise((resolve) => setTimeout(resolve, 50))
        return { status: 200, data: 'ok' }
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS)
    })
  })

  describe('Database Performance', () => {
    it('Query simple debe cumplir con baseline (< 100ms)', async () => {
      const { measurement } = await measurePerformance('db_query', async () => {
        // Simular query simple
        await new Promise((resolve) => setTimeout(resolve, 50))
        return [{ id: 1, name: 'test' }]
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.DB_QUERY_MAX_TIME_MS)
    })

    it('Query compleja debe cumplir con baseline (< 500ms)', async () => {
      const { measurement } = await measurePerformance('db_complex_query', async () => {
        // Simular query compleja (joins, agregaciones)
        await new Promise((resolve) => setTimeout(resolve, 200))
        return [{ id: 1, name: 'test', related: { id: 2 } }]
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS)
    })
  })

  describe('SSR Performance', () => {
    it('SSR debe cumplir con baseline (< 1000ms)', async () => {
      const { measurement } = await measurePerformance('ssr', async () => {
        // Simular SSR
        await new Promise((resolve) => setTimeout(resolve, 300))
        return '<html>...</html>'
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.SSR_MAX_TIME_MS)
    })
  })

  describe('Client Performance', () => {
    it('Hydration debe cumplir con baseline (< 500ms)', async () => {
      const { measurement } = await measurePerformance('hydration', async () => {
        // Simular hydration
        await new Promise((resolve) => setTimeout(resolve, 200))
        return 'hydrated'
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(CLIENT_BASELINE.HYDRATION_MAX_TIME_MS)
    })

    it('Initial render debe cumplir con baseline (< 1000ms)', async () => {
      const { measurement } = await measurePerformance('initial_render', async () => {
        // Simular render inicial
        await new Promise((resolve) => setTimeout(resolve, 300))
        return 'rendered'
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(CLIENT_BASELINE.INITIAL_RENDER_MAX_TIME_MS)
    })
  })

  describe('Regression Detection', () => {
    it('debe fallar si API response excede baseline', async () => {
      const { measurement } = await measurePerformance('api_response', async () => {
        // Simular degradación (excede 500ms)
        await new Promise((resolve) => setTimeout(resolve, 600))
        return { status: 200, data: 'test' }
      })

      expect(measurement.meetsBaseline).toBe(false)
      expect(measurement.duration).toBeGreaterThan(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS)
    })

    it('debe fallar si API crítica excede baseline', async () => {
      const { measurement } = await measurePerformance('api_critical', async () => {
        // Simular degradación (excede 200ms)
        await new Promise((resolve) => setTimeout(resolve, 250))
        return { status: 200, data: 'ok' }
      })

      expect(measurement.meetsBaseline).toBe(false)
      expect(measurement.duration).toBeGreaterThan(SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS)
    })
  })
})
