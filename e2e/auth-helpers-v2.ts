import { Page, BrowserContext } from '@playwright/test'

/**
 * @deprecated Este archivo está deprecated. Usar fixtures enterprise en su lugar.
 * 
 * Para autenticación en tests, usar:
 * ```typescript
 * import { test } from './fixtures'
 * test('mi test', async ({ authenticatedPage }) => { ... })
 * ```
 * 
 * Ver LEGACY_FILES.md para más información sobre migración.
 * 
 * Helper alternativo para autenticarse en los tests E2E
 * Usa autenticación directa vía API de NextAuth
 * 
 * NOTA: Esta es una solución alternativa mientras se resuelve el issue
 * de NextAuth v5 con Playwright
 */
export async function loginViaAPI(context: BrowserContext, page: Page) {
  // Intentar autenticarse directamente vía la API de NextAuth
  // NextAuth v5 usa /api/auth/callback/credentials para credenciales
  
  try {
    // Primero, hacer una request a la API de NextAuth
    const response = await context.request.post(
      'http://localhost:3000/api/auth/callback/credentials',
      {
        data: {
          email: 'matias@paestutor.com',
          password: 'password123',
          redirect: 'false',
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    )

    // Si la autenticación fue exitosa, las cookies deberían estar en la respuesta
    const setCookieHeaders = response.headers()['set-cookie']
    
    if (setCookieHeaders) {
      // Establecer las cookies en el contexto
      const cookies = Array.isArray(setCookieHeaders) 
        ? setCookieHeaders 
        : [setCookieHeaders]
      
      for (const cookieHeader of cookies) {
        // Parsear la cookie y establecerla en el contexto
        const cookieParts = cookieHeader.split(';')[0].split('=')
        if (cookieParts.length === 2) {
          await context.addCookies([{
            name: cookieParts[0],
            value: cookieParts[1],
            domain: 'localhost',
            path: '/',
          }])
        }
      }
    }

    // Navegar al dashboard después de establecer las cookies
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    await page.waitForLoadState('domcontentloaded', { timeout: 10000 })
    
    // Verificar que estamos autenticados
    if (!page.url().includes('/dashboard')) {
      throw new Error(`Login falló. URL actual: ${page.url()}`)
    }
    
    return true
  } catch (error) {
    // Si falla, intentar el método tradicional como fallback
    console.warn('Autenticación vía API falló, usando método tradicional:', error)
    return false
  }
}

/**
 * Helper tradicional (fallback)
 * Usa el formulario de login como antes
 */
export async function loginViaForm(page: Page) {
  await page.goto('/auth/signin', { waitUntil: 'networkidle' })
  await page.waitForLoadState('domcontentloaded')
  await page.waitForTimeout(1500)
  
  const emailField = page.getByLabel(/Email/i)
  await emailField.waitFor({ state: 'visible', timeout: 10000 })
  await emailField.fill('matias@paestutor.com')
  
  const passwordField = page.getByLabel(/Contraseña/i)
  await passwordField.waitFor({ state: 'visible', timeout: 10000 })
  await passwordField.fill('password123')
  
  const loginButton = page.getByRole('button', { name: /Iniciar Sesión/i })
  await loginButton.waitFor({ state: 'visible', timeout: 10000 })
  
  // Intentar esperar la navegación con timeout más largo
  const navigationPromise = page.waitForURL('/dashboard', { timeout: 60000 })
  await loginButton.click()
  
  // Esperar más tiempo para que NextAuth procese
  await page.waitForTimeout(5000)
  
  try {
    await navigationPromise
  } catch (error) {
    // Si falla, verificar si hay algún error visible en la página
    const errorText = await page.getByText(/error|Error|ERROR/i).first().isVisible().catch(() => false)
    if (errorText) {
      const errorMessage = await page.getByText(/error|Error|ERROR/i).first().textContent()
      throw new Error(`Error de autenticación: ${errorMessage}`)
    }
    throw error
  }
  
  await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
  await page.waitForTimeout(3000)
  
  if (!page.url().includes('/dashboard')) {
    throw new Error(`Login falló. URL actual: ${page.url()}`)
  }
}

