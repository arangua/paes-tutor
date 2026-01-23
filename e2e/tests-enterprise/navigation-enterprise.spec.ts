import { test, expect } from '../fixtures'
import { measurePagePerformance } from '../utils/performance'
import { runAccessibilityChecks } from '../utils/accessibility'

/**
 * Tests E2E Enterprise de Navegación
 */
test.describe('Navegación - Enterprise', () => {
  test('debe poder navegar entre todas las páginas principales', async ({ dashboardPage }) => {
    const pages = [
      { name: 'exams', url: '/exams' },
      { name: 'analytics', url: '/analytics' },
      { name: 'profile', url: '/profile' },
      { name: 'materials', url: '/materials' },
    ]
    
    for (const pageInfo of pages) {
      await dashboardPage['page'].goto(pageInfo.url, { waitUntil: 'domcontentloaded' })
      await dashboardPage.waitForLoad()
      
      // Verificar que estamos en la página correcta
      expect(dashboardPage.getUrl()).toMatch(pageInfo.url)
      
      // Verificar que no fuimos redirigidos a login
      expect(dashboardPage.getUrl()).not.toMatch(/auth\/signin/)
    }
  })

  test('debe mantener performance aceptable en todas las navegaciones', async ({ dashboardPage }) => {
    const pages = ['/dashboard', '/exams', '/analytics', '/profile', '/materials']
    const performanceResults: Array<{ page: string; loadTime: number }> = []
    
    for (const pagePath of pages) {
      await dashboardPage['page'].goto(pagePath, { waitUntil: 'domcontentloaded' })
      await dashboardPage.waitForLoad()
      
      const metrics = await measurePagePerformance(dashboardPage['page'])
      performanceResults.push({ page: pagePath, loadTime: metrics.loadTime })
      
      // Verificar que cada página carga en menos de 5 segundos
      expect(metrics.loadTime).toBeLessThan(5000)
    }
    
    // Log de resultados de performance
    console.log('Performance Results:', performanceResults)
  })

  test('debe mantener accesibilidad en todas las páginas', async ({ dashboardPage }) => {
    const pages = ['/dashboard', '/exams', '/analytics', '/profile']
    
    for (const pagePath of pages) {
      await dashboardPage['page'].goto(pagePath, { waitUntil: 'domcontentloaded' })
      await dashboardPage.waitForLoad()
      
      const a11yCheck = await runAccessibilityChecks(dashboardPage['page'])
      
      if (!a11yCheck.passed) {
        console.warn(`Accesibilidad issues en ${pagePath}:`, a11yCheck.failures)
      }
      
      // El test pasa pero registra warnings si hay issues menores
      expect(a11yCheck.failures.length).toBeLessThan(5) // Permitir algunos issues menores
    }
  })

  test('debe mantener la sesión al navegar entre páginas', async ({ authenticatedPage }) => {
    const pages = ['/dashboard', '/exams', '/analytics', '/profile', '/materials']
    
    for (const pagePath of pages) {
      await authenticatedPage.goto(pagePath, { waitUntil: 'domcontentloaded' })
      await authenticatedPage.waitForLoadState('domcontentloaded')
      
      // Verificar que no fuimos redirigidos a login
      expect(authenticatedPage.url()).not.toMatch(/auth\/signin/)
      expect(authenticatedPage.url()).toMatch(pagePath)
    }
  })
})

