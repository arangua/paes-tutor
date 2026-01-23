import { Page } from '@playwright/test'

/**
 * Utilidades para medir performance en tests E2E
 */

export interface PerformanceMetrics {
  loadTime: number
  domContentLoaded: number
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  timeToInteractive?: number
  totalBlockingTime?: number
  cumulativeLayoutShift?: number
}

/**
 * Medir métricas de performance de una página
 */
export async function measurePagePerformance(page: Page): Promise<PerformanceMetrics> {
  const navigationStart = Date.now()
  
  // Esperar a que la página cargue
  await page.waitForLoadState('domcontentloaded')
  const domContentLoaded = Date.now() - navigationStart
  
  await page.waitForLoadState('load')
  const loadTime = Date.now() - navigationStart
  
  // Obtener métricas de Web Vitals si están disponibles
  const metrics: PerformanceMetrics = {
    loadTime,
    domContentLoaded,
  }
  
  try {
    // Intentar obtener métricas de performance desde el navegador
    const performanceMetrics = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      const paintMetrics = performance.getEntriesByType('paint')
      
      return {
        domContentLoaded: perfData?.domContentLoadedEventEnd - perfData?.domContentLoadedEventStart,
        loadTime: perfData?.loadEventEnd - perfData?.loadEventStart,
        firstContentfulPaint: paintMetrics.find((entry: any) => entry.name === 'first-contentful-paint')?.startTime,
      }
    })
    
    if (performanceMetrics) {
      metrics.firstContentfulPaint = performanceMetrics.firstContentfulPaint
    }
  } catch (error) {
    // Si no se pueden obtener métricas, continuar sin ellas
    console.warn('No se pudieron obtener métricas de performance:', error)
  }
  
  return metrics
}

/**
 * Verificar que el tiempo de carga está dentro de los límites aceptables
 */
export function assertPerformanceThresholds(
  metrics: PerformanceMetrics,
  thresholds: {
    maxLoadTime?: number
    maxDomContentLoaded?: number
    maxFirstContentfulPaint?: number
  }
): { passed: boolean; failures: string[] } {
  const failures: string[] = []
  
  if (thresholds.maxLoadTime && metrics.loadTime > thresholds.maxLoadTime) {
    failures.push(`Load time ${metrics.loadTime}ms excede el límite de ${thresholds.maxLoadTime}ms`)
  }
  
  if (thresholds.maxDomContentLoaded && metrics.domContentLoaded > thresholds.maxDomContentLoaded) {
    failures.push(`DOMContentLoaded ${metrics.domContentLoaded}ms excede el límite de ${thresholds.maxDomContentLoaded}ms`)
  }
  
  if (thresholds.maxFirstContentfulPaint && metrics.firstContentfulPaint && metrics.firstContentfulPaint > thresholds.maxFirstContentfulPaint) {
    failures.push(`First Contentful Paint ${metrics.firstContentfulPaint}ms excede el límite de ${thresholds.maxFirstContentfulPaint}ms`)
  }
  
  return {
    passed: failures.length === 0,
    failures,
  }
}

/**
 * Medir el tiempo de una acción específica
 */
export async function measureActionTime<T>(
  action: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = Date.now()
  const result = await action()
  const duration = Date.now() - start
  
  return { result, duration }
}

