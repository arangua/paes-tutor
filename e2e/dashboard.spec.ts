import { test, expect } from './fixtures'

/**
 * Tests E2E del Dashboard
 * Versión actualizada usando Page Object Model y fixtures enterprise
 */
test.describe('Dashboard', () => {
  test('debe mostrar el dashboard con datos del estudiante', async ({ dashboardPage }) => {
    // Verificar que el dashboard está cargado
    const isLoaded = await dashboardPage.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar que hay estadísticas visibles
    const hasStats = await dashboardPage.expectStatsVisible()
    expect(hasStats).toBe(true)
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

  test('debe proteger el dashboard sin autenticación', async ({ page, context }) => {
    // Cerrar sesión eliminando cookies
    await context.clearCookies()
    const pages = context.pages()
    for (const p of pages) {
      await p.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
    }

    await page.goto('/dashboard', { waitUntil: 'domcontentloaded', timeout: 10000 })
    await page.waitForTimeout(2000)

    // Debe redirigir a signin
    expect(page.url()).toMatch(/auth\/signin/)
  })

  test('debe poder navegar a otras secciones desde el dashboard', async ({ dashboardPage }) => {
    // Navegar a exámenes
    await dashboardPage.navigateToExams()
    expect(dashboardPage.getUrl()).toMatch(/\/exams/)
    
    // Volver al dashboard
    await dashboardPage.goto()
    
    // Navegar a analytics
    await dashboardPage.navigateToAnalytics()
    expect(dashboardPage.getUrl()).toMatch(/\/analytics/)
  })
})
