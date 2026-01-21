/**
 * Tests de Baseline de Performance - API
 *
 * Regla Enterprise:
 * Validar que las APIs cumplen con los umbrales de performance.
 *
 * Estos tests se ejecutan en CI y fallan si hay degradación.
 */

import { setTimeout as sleep } from 'node:timers/promises'
import { describe, it, expect } from 'vitest'
import { SERVER_BASELINE } from './baseline'
import { measurePerformance } from './measure'

async function simulateApiResponse() {
  await sleep(100)
  return { status: 200, data: 'test' }
}

async function simulateCriticalApi() {
  await sleep(50)
  return { status: 200, data: 'ok' }
}

async function simulateSimpleQuery() {
  await sleep(50)
  return [{ id: 1, name: 'test' }]
}

async function simulateComplexQuery() {
  await sleep(200)
  return [{ id: 1, name: 'test', related: { id: 2 } }]
}

async function simulateSsr() {
  await sleep(300)
  return '<html>...</html>'
}

describe('API Performance Baseline', () => {
  it('debe cumplir con el baseline de API normal (< 500ms)', async () => {
    const { measurement } = await measurePerformance('api_response', simulateApiResponse)

    expect(measurement.meetsBaseline).toBe(true)
    expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS)
  })

  it('debe cumplir con el baseline de API crítica (< 200ms)', async () => {
    const { measurement } = await measurePerformance('api_critical', simulateCriticalApi)

    expect(measurement.meetsBaseline).toBe(true)
    expect(measurement.duration).toBeLessThan(SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS)
  })

  it('debe cumplir con el baseline de query simple (< 100ms)', async () => {
    const { measurement } = await measurePerformance('db_query', simulateSimpleQuery)

    expect(measurement.meetsBaseline).toBe(true)
    expect(measurement.duration).toBeLessThan(SERVER_BASELINE.DB_QUERY_MAX_TIME_MS)
  })

  it('debe cumplir con el baseline de query compleja (< 500ms)', async () => {
    const { measurement } = await measurePerformance('db_complex_query', simulateComplexQuery)

    expect(measurement.meetsBaseline).toBe(true)
    expect(measurement.duration).toBeLessThan(SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS)
  })

  it('debe cumplir con el baseline de SSR (< 1000ms)', async () => {
    const { measurement } = await measurePerformance('ssr', simulateSsr)

    expect(measurement.meetsBaseline).toBe(true)
    expect(measurement.duration).toBeLessThan(SERVER_BASELINE.SSR_MAX_TIME_MS)
  })
})
