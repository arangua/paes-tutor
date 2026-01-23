/**
 * Utilidades de autenticación para E2E Enterprise
 * Funciones helper que pueden ser útiles en tests específicos
 * 
 * NOTA: Para autenticación en tests, se recomienda usar los fixtures:
 * import { test } from '../fixtures'
 * test('mi test', async ({ authenticatedPage }) => { ... })
 */

import { Page, BrowserContext } from '@playwright/test'
import { LoginPage } from '../pages'

/**
 * Verificar que el usuario está autenticado
 * Útil para tests que necesitan verificar estado de autenticación
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Verificar que hay una cookie de sesión (aunque sea HttpOnly)
    const cookies = await page.context().cookies()
    const hasSessionCookie = cookies.some(
      cookie => 
        cookie.name.includes('next-auth.session-token') ||
        cookie.name.includes('__Secure-next-auth.session-token')
    )
    
    // También verificar que podemos acceder al dashboard
    const response = await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    return hasSessionCookie && response?.status() === 200 && !page.url().includes('/auth/signin')
  } catch {
    return false
  }
}

/**
 * Cerrar sesión
 * Útil para tests que necesitan probar comportamiento sin autenticación
 */
export async function logout(page: Page): Promise<void> {
  // Buscar el botón de logout (puede estar en el header)
  const logoutButton = page.getByRole('button', { name: /Cerrar Sesión|Logout|Salir/i })
  
  if (await logoutButton.isVisible({ timeout: 5000 }).catch(() => false)) {
    await logoutButton.click()
    await page.waitForURL(/\/auth\/signin/, { timeout: 10000 })
  } else {
    // Si no hay botón visible, limpiar cookies manualmente
    await page.context().clearCookies()
  }
}

/**
 * Esperar a que una página se cargue completamente
 * Útil para tests que necesitan esperar carga completa
 */
export async function waitForPageLoad(page: Page, url?: string): Promise<void> {
  if (url) {
    await page.waitForURL(url, { timeout: 30000 })
  }
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
  await page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
    // Ignorar si networkidle no se alcanza (puede haber requests continuos)
  })
}

/**
 * Limpiar completamente el estado de autenticación
 * Útil para tests que necesitan empezar desde cero
 */
export async function clearAuthState(context: BrowserContext): Promise<void> {
  await context.clearCookies()
  const pages = context.pages()
  for (const page of pages) {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  }
}

/**
 * Login usando Page Object Model (alternativa al fixture)
 * Útil cuando necesitas más control sobre el proceso de login
 * 
 * @deprecated Usar fixtures enterprise en su lugar: `test('...', async ({ authenticatedPage }) => { ... })`
 */
export async function loginAsTestUser(
  page: Page,
  email: string = 'matias@paestutor.com',
  password: string = 'password123'
): Promise<void> {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  
  const isLoaded = await loginPage.isLoaded()
  if (!isLoaded) {
    throw new Error('Login page no se cargó correctamente')
  }
  
  await loginPage.login(email, password)
  
  // Esperar a que la redirección al dashboard se complete
  await page.waitForURL(/\/dashboard/, { timeout: 30000 })
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
  await page.waitForTimeout(2000)
  
  if (!page.url().includes('/dashboard')) {
    throw new Error(`Login falló. URL actual: ${page.url()}`)
  }
}
