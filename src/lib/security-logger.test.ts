import { describe, it, expect, vi, beforeEach } from 'vitest'
import { logSecurityEvent, getClientIp, detectSuspiciousActivity } from './security-logger'
import { logger } from './logger'

vi.mock('./logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
  },
}))

describe('security-logger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('logSecurityEvent', () => {
    it('debe loguear eventos críticos con nivel error', () => {
      logSecurityEvent({
        type: 'unauthorized_access',
        severity: 'critical',
        ip: '127.0.0.1',
        path: '/api/test',
      })

      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          security: true,
          type: 'unauthorized_access',
          severity: 'critical',
        }),
        '[SECURITY CRITICAL] unauthorized_access'
      )
    })

    it('debe loguear eventos de alta prioridad con nivel warn', () => {
      logSecurityEvent({
        type: 'suspicious_activity',
        severity: 'high',
        ip: '127.0.0.1',
      })

      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          security: true,
          type: 'suspicious_activity',
          severity: 'high',
        }),
        '[SECURITY HIGH] suspicious_activity'
      )
    })

    it('debe loguear eventos de prioridad media con nivel warn', () => {
      logSecurityEvent({
        type: 'invalid_input',
        severity: 'medium',
        ip: '127.0.0.1',
      })

      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          security: true,
          type: 'invalid_input',
          severity: 'medium',
        }),
        '[SECURITY MEDIUM] invalid_input'
      )
    })

    it('debe loguear eventos de baja prioridad con nivel info', () => {
      logSecurityEvent({
        type: 'auth_success',
        severity: 'low',
        userId: 'user123',
      })

      expect(logger.info).toHaveBeenCalledWith(
        expect.objectContaining({
          security: true,
          type: 'auth_success',
          severity: 'low',
        }),
        '[SECURITY LOW] auth_success'
      )
    })

    it('debe incluir detalles adicionales en el log', () => {
      logSecurityEvent({
        type: 'rate_limit',
        severity: 'medium',
        ip: '127.0.0.1',
        path: '/api/test',
        details: { limit: 10, remaining: 0 },
      })

      expect(logger.warn).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 10,
          remaining: 0,
        }),
        expect.any(String)
      )
    })
  })

  describe('getClientIp', () => {
    it('debe extraer IP de x-forwarded-for', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1',
        },
      })

      expect(getClientIp(request)).toBe('192.168.1.1')
    })

    it('debe usar x-real-ip si x-forwarded-for no está presente', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-real-ip': '192.168.1.1',
        },
      })

      expect(getClientIp(request)).toBe('192.168.1.1')
    })

    it('debe retornar unknown si no hay headers de IP', () => {
      const request = new Request('http://example.com')

      expect(getClientIp(request)).toBe('unknown')
    })

    it('debe manejar múltiples IPs en x-forwarded-for', () => {
      const request = new Request('http://example.com', {
        headers: {
          'x-forwarded-for': '192.168.1.1, 10.0.0.1, 172.16.0.1',
        },
      })

      expect(getClientIp(request)).toBe('192.168.1.1')
    })
  })

  describe('detectSuspiciousActivity', () => {
    it('debe detectar intentos de inyección SQL', () => {
      expect(detectSuspiciousActivity('127.0.0.1', '/api/test?q=SELECT * FROM users', {})).toBe(
        true
      )
      expect(
        detectSuspiciousActivity('127.0.0.1', '/api/test', { query: 'DROP TABLE users' })
      ).toBe(true)
    })

    it('debe detectar path traversal', () => {
      expect(detectSuspiciousActivity('127.0.0.1', '/api/../../etc/passwd', {})).toBe(true)
      expect(
        detectSuspiciousActivity('127.0.0.1', '/api/test', { path: '../../../etc/passwd' })
      ).toBe(true)
    })

    it('debe detectar intentos de XSS', () => {
      expect(detectSuspiciousActivity('127.0.0.1', '/api/test?q=<script>', {})).toBe(true)
      expect(
        detectSuspiciousActivity('127.0.0.1', '/api/test', { content: 'javascript:alert(1)' })
      ).toBe(true)
    })

    it('debe detectar event handlers', () => {
      expect(detectSuspiciousActivity('127.0.0.1', '/api/test', { onclick: 'alert(1)' })).toBe(true)
    })

    it('debe retornar false para actividad normal', () => {
      expect(detectSuspiciousActivity('127.0.0.1', '/api/test', { query: 'hello' })).toBe(false)
      expect(detectSuspiciousActivity('127.0.0.1', '/api/users', { name: 'John' })).toBe(false)
    })
  })
})
