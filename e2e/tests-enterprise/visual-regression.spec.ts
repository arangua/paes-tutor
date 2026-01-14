import { test, expect } from '../fixtures'
import { expectNoVisualChanges } from '../utils/visual-regression'

/**
 * Tests E2E Enterprise de Visual Regression
 * 
 * NOTA: Estos tests requieren que se generen baselines primero ejecutando:
 * npx playwright test --update-snapshots
 */
test.describe('Visual Regression - Enterprise', () => {
  // Estos tests están comentados por defecto porque requieren baselines
  // Descomentar y ejecutar con --update-snapshots para generar baselines
  
  test.skip('página de login no debe tener cambios visuales', async ({ loginPage }) => {
    await loginPage.goto()
    await loginPage.waitForLoad()
    
    // Comparar con baseline (requiere ejecutar con --update-snapshots primero)
    await expectNoVisualChanges(loginPage['page'], 'login-page', {
      threshold: 0.2,
      fullPage: true,
    })
  })

  test.skip('dashboard no debe tener cambios visuales', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad()
    
    // Comparar con baseline
    await expectNoVisualChanges(dashboardPage['page'], 'dashboard-page', {
      threshold: 0.2,
      fullPage: true,
    })
  })

  test.skip('componentes principales no deben tener cambios visuales', async ({ dashboardPage }) => {
    await dashboardPage.waitForLoad()
    
    // Verificar componentes específicos
    const statsSection = dashboardPage['page'].locator('[class*="stats"], [class*="statistics"]').first()
    if (await statsSection.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(statsSection).toHaveScreenshot('dashboard-stats-section', {
        threshold: 0.2,
      })
    }
  })
})

