// @vitest-environment node
/**
 * Tests del Endpoint de Liveness
 */

import { describe, it, expect, vi } from 'vitest'
import { GET } from './route'
import { checkLiveness } from '@/lib/health/liveness'

vi.mock('@/lib/health/liveness')

describe('GET /api/health/liveness', () => {
  it('retorna 200 con status ok cuando el proceso responde', async () => {
    vi.mocked(checkLiveness).mockResolvedValue({
      status: 'ok',
      timestamp: '2025-01-28T12:00:00.000Z',
    })

    const response = await GET()
    const json = await response.json()

    expect(response.status).toBe(200)
    expect(json.status).toBe('ok')
    expect(json.timestamp).toBeDefined()
  })

  it('siempre retorna 200 incluso si hay error interno', async () => {
    vi.mocked(checkLiveness).mockRejectedValue(new Error('Unexpected error'))

    const response = await GET()
    const json = await response.json()

    // Regla: liveness siempre retorna 200 si el proceso puede responder
    expect(response.status).toBe(200)
    expect(json.status).toBe('ok')
  })

  it('incluye headers de no-cache', async () => {
    vi.mocked(checkLiveness).mockResolvedValue({
      status: 'ok',
      timestamp: '2025-01-28T12:00:00.000Z',
    })

    const response = await GET()

    expect(response.headers.get('Cache-Control')).toBe('no-cache, no-store, must-revalidate')
  })
})
