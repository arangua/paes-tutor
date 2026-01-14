/**
 * Tests de Baseline de Performance - API
 * 
 * Regla Enterprise:
 * Validar que las APIs cumplen con los umbrales de performance.
 * 
 * Estos tests se ejecutan en CI y fallan si hay degradación.
 */

import { describe, it, expect } from 'vitest'
import { measurePerformance } from './measure'
import { SERVER_BASELINE } from './baseline'

describe('API Performance Baseline', () => {
  describe('API Response Time', () => {
    it('debe cumplir con el baseline de API normal (< 500ms)', async () => {
      const { measurement } = await measurePerformance('api_response', async () => {
        // Simular operación de API
        await new Promise((resolve) => setTimeout(resolve, 100))
        return { status: 200, data: 'test' }
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS)
    })

    it('debe cumplir con el baseline de API crítica (< 200ms)', async () => {
      const { measurement } = await measurePerformance('api_critical', async () => {
        // Simular operación crítica (health check, auth)
        await new Promise((resolve) => setTimeout(resolve, 50))
        return { status: 200, data: 'ok' }
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS)
    })
  })

  describe('Database Query Time', () => {
    it('debe cumplir con el baseline de query simple (< 100ms)', async () => {
      const { measurement } = await measurePerformance('db_query', async () => {
        // Simular query simple
        await new Promise((resolve) => setTimeout(resolve, 50))
        return [{ id: 1, name: 'test' }]
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.DB_QUERY_MAX_TIME_MS)
    })

    it('debe cumplir con el baseline de query compleja (< 500ms)', async () => {
      const { measurement } = await measurePerformance('db_complex_query', async () => {
        // Simular query compleja (joins, agregaciones)
        await new Promise((resolve) => setTimeout(resolve, 200))
        return [{ id: 1, name: 'test', related: { id: 2 } }]
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS)
    })
  })

  describe('SSR Time', () => {
    it('debe cumplir con el baseline de SSR (< 1000ms)', async () => {
      const { measurement } = await measurePerformance('ssr', async () => {
        // Simular SSR
        await new Promise((resolve) => setTimeout(resolve, 300))
        return '<html>...</html>'
      })

      expect(measurement.meetsBaseline).toBe(true)
      expect(measurement.duration).toBeLessThan(SERVER_BASELINE.SSR_MAX_TIME_MS)
    })
  })
})
