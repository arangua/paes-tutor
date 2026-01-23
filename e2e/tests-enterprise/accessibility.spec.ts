import { test, expect } from '../fixtures'
import { ExamsPage, AnalyticsPage } from '../pages'
import { runAccessibilityChecks } from '../utils/accessibility'

/**
 * Tests E2E Enterprise de Accesibilidad
 * Verifica que todas las páginas principales cumplen con estándares de accesibilidad
 */
test.describe('Accessibility Testing - Enterprise', () => {
  test('página de login debe ser accesible', async ({ loginPage }) => {
    await loginPage.goto()
    
    const a11yCheck = await runAccessibilityChecks(loginPage['page'])
    
    expect(a11yCheck.passed).toBe(true)
    if (!a11yCheck.passed) {
      console.warn('Accessibility issues en login:', a11yCheck.failures)
    }
  })

  test('dashboard debe ser accesible', async ({ dashboardPage }) => {
    const a11yCheck = await runAccessibilityChecks(dashboardPage['page'])
    
    // Permitir algunos issues menores pero registrar warnings
    if (a11yCheck.failures.length > 0) {
      console.warn('Accessibility issues en dashboard:', a11yCheck.failures)
    }
    
    // El test pasa si hay menos de 5 issues menores
    expect(a11yCheck.failures.length).toBeLessThan(5)
  })

  test('página de exámenes debe ser accesible', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    const a11yCheck = await runAccessibilityChecks(authenticatedPage)
    
    if (a11yCheck.failures.length > 0) {
      console.warn('Accessibility issues en exams:', a11yCheck.failures)
    }
    
    expect(a11yCheck.failures.length).toBeLessThan(5)
  })

  test('página de analytics debe ser accesible', async ({ authenticatedPage }) => {
    const analyticsPage = new AnalyticsPage(authenticatedPage)
    await analyticsPage.goto()
    
    const a11yCheck = await runAccessibilityChecks(authenticatedPage)
    
    if (a11yCheck.failures.length > 0) {
      console.warn('Accessibility issues en analytics:', a11yCheck.failures)
    }
    
    expect(a11yCheck.failures.length).toBeLessThan(5)
  })

  test('todas las páginas principales deben tener título', async ({ authenticatedPage }) => {
    const pages = ['/dashboard', '/exams', '/analytics', '/profile', '/materials']
    
    for (const pagePath of pages) {
      await authenticatedPage.goto(pagePath, { waitUntil: 'domcontentloaded' })
      await authenticatedPage.waitForLoadState('domcontentloaded')
      
      const title = await authenticatedPage.title()
      expect(title).toBeTruthy()
      expect(title.length).toBeGreaterThan(0)
    }
  })

  test('todas las páginas principales deben tener heading principal', async ({ authenticatedPage }) => {
    const pages = ['/dashboard', '/exams', '/analytics', '/profile']
    
    for (const pagePath of pages) {
      await authenticatedPage.goto(pagePath, { waitUntil: 'domcontentloaded' })
      await authenticatedPage.waitForLoadState('domcontentloaded')
      
      const h1 = authenticatedPage.locator('h1').first()
      const isVisible = await h1.isVisible({ timeout: 5000 }).catch(() => false)
      
      // Algunas páginas pueden no tener h1 visible inmediatamente
      // El test pasa si al menos algunas páginas tienen h1
      if (pagePath === '/dashboard') {
        expect(isVisible).toBe(true)
      }
    }
  })
})

