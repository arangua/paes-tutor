import { test, expect } from '../fixtures'
import { ExamsPage, AnalyticsPage } from '../pages'
import { measurePagePerformance, assertPerformanceThresholds } from '../utils/performance'

/**
 * Tests E2E Enterprise de Performance
 * Verifica que todas las páginas principales cumplen con los umbrales de performance
 */
test.describe('Performance Testing - Enterprise', () => {
  // Umbrales de performance enterprise
  const PERFORMANCE_THRESHOLDS = {
    maxLoadTime: 5000, // 5 segundos
    maxDomContentLoaded: 3000, // 3 segundos
    maxFirstContentfulPaint: 2000, // 2 segundos
  }

  test('dashboard debe cargar dentro de los umbrales de performance', async ({ dashboardPage }) => {
    const metrics = await measurePagePerformance(dashboardPage['page'])
    
    const check = assertPerformanceThresholds(metrics, PERFORMANCE_THRESHOLDS)
    
    expect(check.passed).toBe(true)
    if (!check.passed) {
      console.error('Performance failures:', check.failures)
    }
  })

  test('página de exámenes debe cargar dentro de los umbrales', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    const metrics = await measurePagePerformance(authenticatedPage)
    const check = assertPerformanceThresholds(metrics, PERFORMANCE_THRESHOLDS)
    
    expect(check.passed).toBe(true)
  })

  test('página de analytics debe cargar dentro de los umbrales', async ({ authenticatedPage }) => {
    const analyticsPage = new AnalyticsPage(authenticatedPage)
    await analyticsPage.goto()
    
    const metrics = await measurePagePerformance(authenticatedPage)
    const check = assertPerformanceThresholds(metrics, PERFORMANCE_THRESHOLDS)
    
    expect(check.passed).toBe(true)
  })

  test('debe medir performance de navegación entre páginas', async ({ authenticatedPage }) => {
    const pages = ['/dashboard', '/exams', '/analytics']
    const results: Array<{ page: string; metrics: any }> = []
    
    for (const pagePath of pages) {
      await authenticatedPage.goto(pagePath, { waitUntil: 'domcontentloaded' })
      await authenticatedPage.waitForLoadState('domcontentloaded')
      
      const metrics = await measurePagePerformance(authenticatedPage)
      results.push({ page: pagePath, metrics })
      
      // Verificar umbrales
      const check = assertPerformanceThresholds(metrics, PERFORMANCE_THRESHOLDS)
      expect(check.passed).toBe(true)
    }
    
    // Log de resultados para análisis
    console.log('Performance metrics:', JSON.stringify(results, null, 2))
  })
})

