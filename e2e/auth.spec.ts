import { test, expect } from './fixtures'
import { TEST_CREDENTIALS } from './factories/test-data'

/**
 * Tests E2E de Autenticación
 * Versión actualizada usando Page Object Model y fixtures enterprise
 */
test.describe('Autenticación', () => {
  test('debe mostrar la página de inicio de sesión', async ({ loginPage }) => {
    await loginPage.goto()
    
    // Verificar que la página está cargada
    const isLoaded = await loginPage.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar elementos del formulario
    await loginPage.expectFormVisible()
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

  test('debe redirigir al dashboard después de iniciar sesión', async ({ authenticatedPage }) => {
    // El fixture authenticatedPage ya tiene la sesión iniciada
    expect(authenticatedPage.url()).toContain('/dashboard')
    
    // Verificar que el dashboard está cargado
    const dashboardContent = authenticatedPage.getByText(/Hola|Bienvenido|Dashboard/i)
    await expect(dashboardContent).toBeVisible({ timeout: 20000 })
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

  test('debe mantener la sesión después de recargar la página', async ({ authenticatedPage }) => {
    // Recargar la página
    await authenticatedPage.reload({ waitUntil: 'domcontentloaded' })
    
    // Verificar que seguimos autenticados
    expect(authenticatedPage.url()).toContain('/dashboard')
    
    const dashboardContent = authenticatedPage.getByText(/Hola|Bienvenido|Dashboard/i)
    await expect(dashboardContent).toBeVisible({ timeout: 20000 })
  })
})
