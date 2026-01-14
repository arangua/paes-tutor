import { test, expect } from './fixtures'

/**
 * Tests E2E de Navegación
 * Versión actualizada usando Page Object Model y fixtures enterprise
 */
test.describe('Navegación', () => {
  test('debe poder navegar desde dashboard a exámenes', async ({ dashboardPage }) => {
    await dashboardPage.navigateToExams()
    expect(dashboardPage.getUrl()).toMatch(/\/exams/)
  })

  test('debe poder navegar a la página de analytics', async ({ dashboardPage }) => {
    await dashboardPage.navigateToAnalytics()
    expect(dashboardPage.getUrl()).toMatch(/\/analytics/)
  })

  test('debe poder navegar a la página de perfil', async ({ dashboardPage }) => {
    await dashboardPage.navigateToProfile()
    expect(dashboardPage.getUrl()).toMatch(/\/profile/)
  })

  test('debe poder navegar a la página de materiales', async ({ dashboardPage }) => {
    await dashboardPage.navigateToMaterials()
    expect(dashboardPage.getUrl()).toMatch(/\/materials/)
  })

  test('debe mantener la sesión al navegar entre páginas', async ({ authenticatedPage }) => {
    // Navegar a varias páginas
    const pages = ['/dashboard', '/exams', '/analytics', '/profile']
    
    for (const pagePath of pages) {
      await authenticatedPage.goto(pagePath, { waitUntil: 'domcontentloaded' })
      await authenticatedPage.waitForLoadState('domcontentloaded')
      
      // Verificar que no fuimos redirigidos a login
      expect(authenticatedPage.url()).not.toMatch(/auth\/signin/)
      expect(authenticatedPage.url()).toMatch(pagePath)
    }
  })
})
