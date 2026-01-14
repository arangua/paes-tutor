import { test, expect } from '../fixtures'
import { TEST_CREDENTIALS } from '../factories/test-data'
import { measurePagePerformance, assertPerformanceThresholds } from '../utils/performance'
import { runAccessibilityChecks } from '../utils/accessibility'

/**
 * Tests E2E Enterprise de Autenticación
 * Usa Page Object Model, fixtures, performance testing y accessibility
 */
test.describe('Autenticación - Enterprise', () => {
  test('debe mostrar la página de inicio de sesión con todas las verificaciones', async ({ loginPage }) => {
    await loginPage.goto()
    
    // Verificar que la página está cargada
    const isLoaded = await loginPage.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar elementos del formulario
    await loginPage.expectFormVisible()
    
    // Performance: Verificar tiempo de carga
    const metrics = await measurePagePerformance(loginPage['page'])
    const performanceCheck = assertPerformanceThresholds(metrics, {
      maxLoadTime: 5000, // 5 segundos máximo
      maxDomContentLoaded: 3000, // 3 segundos máximo
    })
    expect(performanceCheck.passed).toBe(true)
    
    // Accessibility: Verificar accesibilidad
    const a11yCheck = await runAccessibilityChecks(loginPage['page'])
    expect(a11yCheck.passed).toBe(true)
    
    // Visual: Verificar que no hay cambios visuales (solo si hay baseline)
    // await expectNoVisualChanges(loginPage['page'], 'login-page')
  })

  test('debe mostrar error con credenciales inválidas', async ({ loginPage }) => {
    await loginPage.goto()
    
    // Intentar login con credenciales inválidas
    await loginPage.login(
      TEST_CREDENTIALS.invalid.email,
      TEST_CREDENTIALS.invalid.password
    )
    
    // Verificar que aparece el error
    await loginPage.expectCredentialsError()
  })

  test('debe redirigir al dashboard después de iniciar sesión exitosa', async ({ authenticatedPage }) => {
    // El fixture authenticatedPage ya tiene la sesión iniciada
    expect(authenticatedPage.url()).toContain('/dashboard')
    
    // Verificar que el dashboard está cargado
    const dashboardContent = authenticatedPage.getByText(/Hola|Bienvenido|Dashboard/i)
    await expect(dashboardContent).toBeVisible({ timeout: 20000 })
  })

  test('debe proteger el dashboard sin autenticación', async ({ page, context }) => {
    // Limpiar cookies y storage
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

  test('debe mantener la sesión después de recargar la página', async ({ authenticatedPage }) => {
    // Recargar la página
    await authenticatedPage.reload({ waitUntil: 'domcontentloaded' })
    
    // Verificar que seguimos autenticados
    expect(authenticatedPage.url()).toContain('/dashboard')
    
    const dashboardContent = authenticatedPage.getByText(/Hola|Bienvenido|Dashboard/i)
    await expect(dashboardContent).toBeVisible({ timeout: 20000 })
  })
})

