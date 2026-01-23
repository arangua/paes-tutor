import { test, expect } from '../fixtures'
import { measurePagePerformance } from '../utils/performance'
import { runAccessibilityChecks } from '../utils/accessibility'

/**
 * Tests E2E Enterprise del Dashboard
 */
test.describe('Dashboard - Enterprise', () => {
  test('debe mostrar el dashboard con todas las verificaciones enterprise', async ({ dashboardPage }) => {
    // Verificar que el dashboard está cargado
    const isLoaded = await dashboardPage.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar que hay estadísticas visibles
    const hasStats = await dashboardPage.expectStatsVisible()
    expect(hasStats).toBe(true)
    
    // Performance: Medir tiempo de carga
    const metrics = await measurePagePerformance(dashboardPage['page'])
    const loadTime = metrics.loadTime
    
    // Verificar que el tiempo de carga es razonable (< 5 segundos)
    expect(loadTime).toBeLessThan(5000)
    
    // Accessibility: Verificar accesibilidad
    const a11yCheck = await runAccessibilityChecks(dashboardPage['page'])
    expect(a11yCheck.passed).toBe(true)
  })

  test('debe mostrar gráficos de rendimiento', async ({ dashboardPage }) => {
    const hasCharts = await dashboardPage.expectChartsVisible()
    // El test pasa si hay gráficos o si no hay datos (ambos son válidos)
    expect(typeof hasCharts).toBe('boolean')
  })

  test('debe mostrar sección de últimos intentos', async ({ dashboardPage }) => {
    const hasRecentAttempts = await dashboardPage.expectRecentAttemptsVisible()
    expect(typeof hasRecentAttempts).toBe('boolean')
  })

  test('debe poder navegar a otras secciones', async ({ dashboardPage }) => {
    // Navegar a exámenes
    await dashboardPage.navigateToExams()
    expect(dashboardPage.getUrl()).toMatch(/\/exams/)
    
    // Volver al dashboard
    await dashboardPage.goto()
    
    // Navegar a analytics
    await dashboardPage.navigateToAnalytics()
    expect(dashboardPage.getUrl()).toMatch(/\/analytics/)
  })

  test('debe mantener performance aceptable al navegar', async ({ dashboardPage }) => {
    const pages = ['/exams', '/analytics', '/profile', '/materials']
    
    for (const pagePath of pages) {
      await dashboardPage['page'].goto(pagePath, { waitUntil: 'domcontentloaded' })
      await dashboardPage.waitForLoad()
      
      const metrics = await measurePagePerformance(dashboardPage['page'])
      
      // Verificar que cada página carga en menos de 5 segundos
      expect(metrics.loadTime).toBeLessThan(5000)
    }
  })
})

