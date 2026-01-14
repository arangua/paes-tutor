/**
 * Tests unitarios para el sistema de monitoreo de performance
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  calculateEnhancedMetrics,
  PerformanceAlertLevel,
  sendPerformanceAlertsToMonitoring,
} from './performance-monitor'
import { PERFORMANCE_THRESHOLDS } from './config'
import { logger } from '@/lib/logger'

// Mock de logger
vi.mock('@/lib/logger', () => ({
  logger: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn(),
    debug: vi.fn(),
  },
}))

describe('performance-monitor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Establecer NODE_ENV a test
    process.env.NODE_ENV = 'test'
  })

  describe('calculateEnhancedMetrics', () => {
    it('debe calcular métricas básicas correctamente', () => {
      const startTime = Date.now() - 100
      const metrics = {
        authDuration: 50,
        queryDuration: 200,
      }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.totalDuration).toBeGreaterThanOrEqual(100)
      expect(result.authDuration).toBe(50)
      expect(result.queryDuration).toBe(200)
      expect(result.hasAlerts).toBe(false)
      expect(result.severity).toBeNull()
    })

    it('debe generar alerta WARNING cuando se excede el umbral de advertencia', () => {
      const startTime = Date.now() - (PERFORMANCE_THRESHOLDS.WARNING + 100)
      const metrics = {
        authDuration: 50,
        queryDuration: 200,
      }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.hasAlerts).toBe(true)
      expect(result.severity).toBe(PerformanceAlertLevel.WARNING)
      expect(result.alerts.length).toBeGreaterThan(0)
      expect(result.alerts[0].level).toBe(PerformanceAlertLevel.WARNING)
    })

    it('debe generar alerta CRITICAL cuando se excede el umbral crítico', () => {
      const startTime = Date.now() - (PERFORMANCE_THRESHOLDS.CRITICAL + 100)
      const metrics = {
        authDuration: 50,
        queryDuration: 200,
      }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.hasAlerts).toBe(true)
      expect(result.severity).toBe(PerformanceAlertLevel.CRITICAL)
      expect(result.alerts.some(a => a.level === PerformanceAlertLevel.CRITICAL)).toBe(true)
    })

    it('debe generar alerta para authDuration cuando excede el umbral', () => {
      const startTime = Date.now() - 100
      const metrics = {
        authDuration: PERFORMANCE_THRESHOLDS.AUTH_WARNING + 100,
        queryDuration: 200,
      }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.hasAlerts).toBe(true)
      const authAlert = result.alerts.find(a => a.metric === 'authDuration')
      expect(authAlert).toBeDefined()
      expect(authAlert?.level).toBe(PerformanceAlertLevel.WARNING)
    })

    it('debe generar alerta para queryDuration cuando excede el umbral', () => {
      const startTime = Date.now() - 100
      const metrics = {
        authDuration: 50,
        queryDuration: PERFORMANCE_THRESHOLDS.QUERY_WARNING + 100,
      }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.hasAlerts).toBe(true)
      const queryAlert = result.alerts.find(a => a.metric === 'queryDuration')
      expect(queryAlert).toBeDefined()
      expect(queryAlert?.level).toBe(PerformanceAlertLevel.WARNING)
    })

    it('debe generar alerta para métricas personalizadas que exceden 1000ms', () => {
      const startTime = Date.now() - 100
      const metrics = {
        authDuration: 50,
        queryDuration: 200,
        customMetric: 1500, // Excede 1000ms
      }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.hasAlerts).toBe(true)
      const customAlert = result.alerts.find(a => a.metric === 'customMetric')
      expect(customAlert).toBeDefined()
      expect(customAlert?.level).toBe(PerformanceAlertLevel.WARNING)
    })

    it('debe incluir contexto en las alertas', () => {
      const startTime = Date.now() - (PERFORMANCE_THRESHOLDS.WARNING + 100)
      const metrics = { authDuration: 50 }

      const result = calculateEnhancedMetrics(startTime, metrics, 'POST')

      expect(result.alerts[0].context).toBe('POST')
    })

    it('debe incluir timestamp en las alertas', () => {
      const startTime = Date.now() - (PERFORMANCE_THRESHOLDS.WARNING + 100)
      const metrics = { authDuration: 50 }

      const result = calculateEnhancedMetrics(startTime, metrics, 'GET')

      expect(result.alerts[0].timestamp).toBeInstanceOf(Date)
    })
  })

  describe('sendPerformanceAlertsToMonitoring', () => { // guard:allow-secret
    it('debe loguear alertas críticas en producción', () => {
      process.env.NODE_ENV = 'production'
      const alerts = [
        {
          level: PerformanceAlertLevel.CRITICAL,
          message: 'Test critical alert',
          metric: 'totalDuration',
          value: 6000,
          threshold: 5000,
          timestamp: new Date(),
        },
      ]

      sendPerformanceAlertsToMonitoring(alerts, { requestId: 'test-123' })

      expect(logger.error).toHaveBeenCalled()
    })

    it('no debe enviar alertas en desarrollo', () => {
      process.env.NODE_ENV = 'development'
      const alerts = [
        {
          level: PerformanceAlertLevel.CRITICAL,
          message: 'Test critical alert',
          metric: 'totalDuration',
          value: 6000,
          threshold: 5000,
          timestamp: new Date(),
        },
      ]

      sendPerformanceAlertsToMonitoring(alerts, { requestId: 'test-123' })

      // En desarrollo no debería llamar a logger.error para alertas críticas
      // (a menos que se configure específicamente)
      expect(logger.error).not.toHaveBeenCalled()
    })

    it('debe incluir metadata en las alertas', () => {
      process.env.NODE_ENV = 'production'
      const alerts = [
        {
          level: PerformanceAlertLevel.CRITICAL,
          message: 'Test critical alert',
          metric: 'totalDuration',
          value: 6000,
          threshold: 5000,
          timestamp: new Date(),
        },
      ]
      const metadata = { requestId: 'test-123', noteId: 'c123' }

      sendPerformanceAlertsToMonitoring(alerts, metadata)

      expect(logger.error).toHaveBeenCalledWith(
        expect.objectContaining({
          requestId: 'test-123',
          noteId: 'c123',
        }),
        expect.any(String)
      )
    })
  })
})

