import { Page } from '@playwright/test'
import { PerformanceMetrics } from './performance'

/**
 * Utilidades para reporting avanzado
 */

export interface TestReport {
  testName: string
  duration: number
  status: 'passed' | 'failed' | 'skipped'
  performance?: PerformanceMetrics
  screenshots?: string[]
  errors?: string[]
  metadata?: Record<string, any>
}

/**
 * Generar reporte de test
 */
export function generateTestReport(
  testName: string,
  duration: number,
  status: 'passed' | 'failed' | 'skipped',
  options?: {
    performance?: PerformanceMetrics
    screenshots?: string[]
    errors?: string[]
    metadata?: Record<string, any>
  }
): TestReport {
  return {
    testName,
    duration,
    status,
    performance: options?.performance,
    screenshots: options?.screenshots,
    errors: options?.errors,
    metadata: options?.metadata,
  }
}

/**
 * Guardar métricas de performance en el reporte
 */
export async function attachPerformanceMetrics(
  page: Page,
  testName: string
): Promise<PerformanceMetrics | undefined> {
  try {
    // testName se usa para logging en caso de error
    const metrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paintMetrics = performance.getEntriesByType('paint')
      
      return {
        loadTime: perfData?.loadEventEnd - perfData?.loadEventStart,
        domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
        firstContentfulPaint: paintMetrics.find((entry: any) => entry.name === 'first-contentful-paint')?.startTime,
      }
    })
    
    return metrics as PerformanceMetrics
  } catch (error) {
    console.warn(`No se pudieron obtener métricas de performance para ${testName}:`, error)
    return undefined
  }
}

/**
 * Tomar screenshot y guardarlo
 */
export async function takeScreenshotForReport(
  page: Page,
  name: string
): Promise<string> {
  const path = `test-results/screenshots/${name}-${Date.now()}.png`
  await page.screenshot({ path, fullPage: true })
  return path
}

