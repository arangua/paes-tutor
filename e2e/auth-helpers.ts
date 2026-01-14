import { Page } from '@playwright/test'

/**
 * @deprecated Este archivo está deprecated. Usar fixtures enterprise en su lugar.
 * 
 * Para autenticación en tests, usar:
 * ```typescript
 * import { test } from './fixtures'
 * test('mi test', async ({ authenticatedPage }) => { ... })
 * ```
 * 
 * Para funciones helper, usar:
 * ```typescript
 * import { isAuthenticated, logout } from './utils/auth-helpers'
 * ```
 * 
 * Ver LEGACY_FILES.md para más información sobre migración.
 * 
 * Helper mejorado para autenticación en tests E2E
 * 
 * Ahora que el inicio de sesión funciona correctamente con cookies HttpOnly,
 * este helper usa el método del formulario que funciona correctamente.
 * 
 * @param page - Página de Playwright
 * @param email - Email del usuario (default: matias@paestutor.com)
 * @param password - Contraseña (default: password123)
 * @returns Promise que se resuelve cuando el login es exitoso
 */
export async function loginAsTestUser(
  page: Page,
  email: string = 'matias@paestutor.com',
  password: string = 'password123'
): Promise<void> {
  // Navegar a la página de login
  await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' })
  
  // Esperar a que el formulario se cargue completamente
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(1000) // Dar tiempo para Suspense
  
  // Buscar y llenar el campo de email
  const emailField = page.getByLabel(/Email/i)
  await emailField.waitFor({ state: 'visible', timeout: 10000 })
  await emailField.fill(email)
  
  // Buscar y llenar el campo de contraseña
  const passwordField = page.getByLabel(/Contraseña/i)
  await passwordField.waitFor({ state: 'visible', timeout: 10000 })
  await passwordField.fill(password)
  
  // Buscar y hacer clic en el botón de login
  const loginButton = page.getByRole('button', { name: /Iniciar Sesión/i })
  await loginButton.waitFor({ state: 'visible', timeout: 10000 })
  
  // Esperar la navegación al dashboard
  const navigationPromise = page.waitForURL(/\/dashboard/, { timeout: 30000 })
  await loginButton.click()
  
  // Esperar a que la navegación se complete
  await navigationPromise
  
  // Verificar que estamos en el dashboard
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
  await page.waitForTimeout(2000) // Dar tiempo para que se cargue el contenido
  
  // Verificar que la URL es correcta
  if (!page.url().includes('/dashboard')) {
    throw new Error(`Login falló. URL actual: ${page.url()}`)
  }
}

/**
 * Helper para verificar que el usuario está autenticado
 * 
 * @param page - Página de Playwright
 * @returns Promise<boolean> - true si está autenticado
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  try {
    // Verificar que hay una cookie de sesión (aunque sea HttpOnly)
    const cookies = await page.context().cookies()
    cookies.some(
      cookie => 
        cookie.name.includes('next-auth.session-token') ||
        cookie.name.includes('__Secure-next-auth.session-token')
    )
    
    // También verificar que podemos acceder al dashboard
    const response = await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    return response?.status() === 200 && !page.url().includes('/auth/signin')
  } catch {
    return false
  }
}

/**
 * Helper para cerrar sesión
 * 
 * @param page - Página de Playwright
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
 * Helper para esperar a que una página se cargue completamente
 * 
 * @param page - Página de Playwright
 * @param url - URL a esperar (opcional)
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
