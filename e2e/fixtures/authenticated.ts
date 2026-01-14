import { test as base, Page } from '@playwright/test'
import { LoginPage, DashboardPage } from '../pages'

/**
 * Fixture de autenticación
 * Proporciona una página ya autenticada para los tests
 */
type AuthenticatedFixtures = {
  authenticatedPage: Page
  loginPage: LoginPage
  dashboardPage: DashboardPage
}

export const test = base.extend<AuthenticatedFixtures>({
  /**
   * Página autenticada - lista para usar en tests
   */
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    
    // Intentar ir a la página de login con reintentos
    let retries = 3
    let isLoaded = false
    while (retries > 0 && !isLoaded) {
      try {
        await loginPage.goto()
        isLoaded = await loginPage.isLoaded()
        if (!isLoaded) {
          await page.waitForTimeout(2000) // Esperar un poco antes de reintentar
          retries--
        }
      } catch (err) {
        console.error("Error al cargar página de login", err)
        retries--
        if (retries > 0) {
          await page.waitForTimeout(2000)
        } else {
          throw err
        }
      }
    }
    
    if (!isLoaded) {
      throw new Error('Login page no se cargó correctamente después de varios intentos')
    }
    
    // Iniciar sesión con credenciales de prueba
    const testEmail = 'matias@paestutor.com'
    const testPassword = 'password123'
    
    await loginPage.login(testEmail, testPassword)
    
    // Esperar a que se procese el login (puede mostrar error o redirigir)
    await page.waitForTimeout(2000)
    
    // Verificar si hay un error de credenciales
    const errorVisible = await page.getByText(/Credenciales inválidas|Error|invalid/i).isVisible({ timeout: 3000 }).catch(() => false)
    if (errorVisible) {
      // Capturar screenshot para debugging
      await page.screenshot({ path: 'test-results/login-error.png', fullPage: true })
      throw new Error(`Login falló: Credenciales inválidas. Email: ${testEmail}. Verifica que el seed se ejecutó correctamente (npx prisma db seed)`)
    }
    
    // Esperar a que la redirección al dashboard se complete
    // Usar múltiples estrategias para verificar la navegación
    try {
      // Estrategia 1: Esperar cambio de URL
      await page.waitForURL(/\/dashboard/, { timeout: 30000, waitUntil: 'domcontentloaded' })
    } catch {
      // Estrategia 2: Esperar que la URL cambie manualmente (fallback si estrategia 1 falla)
      let urlChanged = false
      for (let i = 0; i < 30; i++) {
        await page.waitForTimeout(1000)
        const currentUrl = page.url()
        if (currentUrl.includes('/dashboard')) {
          urlChanged = true
          break
        }
        // Verificar si hay error visible
        const hasError = await page.getByText(/Error|Credenciales/i).isVisible({ timeout: 500 }).catch(() => false)
        if (hasError) {
          await page.screenshot({ path: 'test-results/login-error.png', fullPage: true })
          throw new Error(`Login falló: Se detectó un error en la página. URL: ${currentUrl}. Verifica las credenciales en la base de datos.`)
        }
      }
      if (!urlChanged) {
        const finalUrl = page.url()
        await page.screenshot({ path: 'test-results/login-timeout.png', fullPage: true })
        throw new Error(`Login falló: No se redirigió al dashboard después de 30 segundos. URL final: ${finalUrl}. Verifica que el usuario existe en la base de datos.`)
      }
    }
    
    // Esperar a que el contenido se cargue
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {
      // Continuar aunque domcontentloaded no se complete
    })
    await page.waitForTimeout(3000) // Dar tiempo para que se cargue el contenido
    
    // Verificar que estamos autenticados
    const finalUrl = page.url()
    if (!finalUrl.includes('/dashboard')) {
      throw new Error(`Login falló. URL final: ${finalUrl}`)
    }
    
    await use(page)
  },

  /**
   * LoginPage ya inicializada
   */
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page)
    await use(loginPage)
  },

  /**
   * DashboardPage ya inicializada y autenticada
   */
  dashboardPage: async ({ authenticatedPage }, use) => {
    const dashboardPage = new DashboardPage(authenticatedPage)
    await dashboardPage.goto()
    
    // Verificar que el dashboard está cargado
    const isLoaded = await dashboardPage.isLoaded()
    if (!isLoaded) {
      throw new Error('Dashboard no se cargó correctamente')
    }
    
    await use(dashboardPage)
  },
})

export { expect } from '@playwright/test'

