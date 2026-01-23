// @vitest-environment node
/**
 * Tests del Endpoint de Readiness
 */

import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'
import { checkReadiness } from '@/lib/health/readiness'

vi.mock('@/lib/health/readiness')

describe('GET /api/health/readiness', () => {
  it('retorna 200 cuando el servicio está listo', async () => {
    vi.mocked(checkReadiness).mockResolvedValue({
      status: 'ok',
      checks: {
        database: 'ok',
        redis: 'skipped',
      },
      timestamp: '2025-01-28T12:00:00.000Z',
    })

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe('ok')
    expect(json.checks.database).toBe('ok')
  })

  it('retorna 503 cuando el servicio está degradado', async () => {
    vi.mocked(checkReadiness).mockResolvedValue({
      status: 'degraded',
      checks: {
        database: 'down',
        redis: 'skipped',
      },
      timestamp: '2025-01-28T12:00:00.000Z',
    })

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(503)
    expect(json.status).toBe('degraded')
    expect(json.checks.database).toBe('down')
  })

  it('retorna 503 cuando hay error inesperado', async () => {
    vi.mocked(checkReadiness).mockRejectedValue(new Error('Unexpected error'))

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(503)
    expect(json.status).toBe('degraded')
    expect(json.checks.database).toBe('down')
    expect(json.checks.redis).toBe('down')
  })

  it('incluye headers de no-cache', async () => {
    vi.mocked(checkReadiness).mockResolvedValue({
      status: 'ok',
      checks: {
        database: 'ok',
        redis: 'skipped',
      },
      timestamp: '2025-01-28T12:00:00.000Z',
    })

    const response = await GET()

    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
  })
})
