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
import { setTimeout as sleep } from 'node:timers/promises'
import { measurePerformance } from './measure'
import { SERVER_BASELINE, CLIENT_BASELINE } from './baseline'

type PerfCase = Readonly<{
  name: string
  metric: string
  run: () => Promise<unknown>
  shouldMeetBaseline: boolean
  durationMsBaseline: number
}>

async function okApiResponse() {
  await sleep(100)
  return { status: 200, data: 'test' }
}

async function okCriticalApi() {
  await sleep(50)
  return { status: 200, data: 'ok' }
}

async function okSimpleQuery() {
  await sleep(50)
  return [{ id: 1, name: 'test' }]
}

async function okComplexQuery() {
  await sleep(200)
  return [{ id: 1, name: 'test', related: { id: 2 } }]
}

async function okSsr() {
  await sleep(300)
  return '<html>...</html>'
}

async function okHydration() {
  await sleep(200)
  return 'hydrated'
}

async function okInitialRender() {
  await sleep(300)
  return 'rendered'
}

async function slowApiResponse() {
  await sleep(600)
  return { status: 200, data: 'test' }
}

async function slowCriticalApi() {
  await sleep(250)
  return { status: 200, data: 'ok' }
}

const PERFORMANCE_CASES: readonly PerfCase[] = [
  {
    name: 'API response debe cumplir con baseline (< 500ms)',
    metric: 'api_response',
    run: okApiResponse,
    shouldMeetBaseline: true,
    durationMsBaseline: SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS,
  },
  {
    name: 'API crítica debe cumplir con baseline (< 200ms)',
    metric: 'api_critical',
    run: okCriticalApi,
    shouldMeetBaseline: true,
    durationMsBaseline: SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS,
  },
  {
    name: 'Query simple debe cumplir con baseline (< 100ms)',
    metric: 'db_query',
    run: okSimpleQuery,
    shouldMeetBaseline: true,
    durationMsBaseline: SERVER_BASELINE.DB_QUERY_MAX_TIME_MS,
  },
  {
    name: 'Query compleja debe cumplir con baseline (< 500ms)',
    metric: 'db_complex_query',
    run: okComplexQuery,
    shouldMeetBaseline: true,
    durationMsBaseline: SERVER_BASELINE.DB_COMPLEX_QUERY_MAX_TIME_MS,
  },
  {
    name: 'SSR debe cumplir con baseline (< 1000ms)',
    metric: 'ssr',
    run: okSsr,
    shouldMeetBaseline: true,
    durationMsBaseline: SERVER_BASELINE.SSR_MAX_TIME_MS,
  },
  {
    name: 'Hydration debe cumplir con baseline (< 500ms)',
    metric: 'hydration',
    run: okHydration,
    shouldMeetBaseline: true,
    durationMsBaseline: CLIENT_BASELINE.HYDRATION_MAX_TIME_MS,
  },
  {
    name: 'Initial render debe cumplir con baseline (< 1000ms)',
    metric: 'initial_render',
    run: okInitialRender,
    shouldMeetBaseline: true,
    durationMsBaseline: CLIENT_BASELINE.INITIAL_RENDER_MAX_TIME_MS,
  },
  {
    name: 'debe fallar si API response excede baseline',
    metric: 'api_response',
    run: slowApiResponse,
    shouldMeetBaseline: false,
    durationMsBaseline: SERVER_BASELINE.API_MAX_RESPONSE_TIME_MS,
  },
  {
    name: 'debe fallar si API crítica excede baseline',
    metric: 'api_critical',
    run: slowCriticalApi,
    shouldMeetBaseline: false,
    durationMsBaseline: SERVER_BASELINE.API_CRITICAL_MAX_RESPONSE_TIME_MS,
  },
] as const

async function runPerformanceCase(c: PerfCase): Promise<void> {
  const { measurement } = await measurePerformance(c.metric, c.run)
  expect(measurement.meetsBaseline).toBe(c.shouldMeetBaseline)
  if (c.shouldMeetBaseline) {
    expect(measurement.duration).toBeLessThan(c.durationMsBaseline)
  } else {
    expect(measurement.duration).toBeGreaterThan(c.durationMsBaseline)
  }
}

describe('Performance Regression Guard', () => {
  for (const c of PERFORMANCE_CASES) {
    it(c.name, async () => {
      await runPerformanceCase(c)
    })
  }
})
