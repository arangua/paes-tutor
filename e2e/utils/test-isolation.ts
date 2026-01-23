import { Page, BrowserContext } from '@playwright/test'

/**
 * Utilidades para mejorar el aislamiento de tests
 */

/**
 * Limpiar todas las cookies y storage
 */
export async function clearAllData(context: BrowserContext): Promise<void> {
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
 * Limpiar datos de una página específica
 */
export async function clearPageData(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  await page.context().clearCookies()
}

/**
 * Resetear estado de la aplicación
 */
export async function resetAppState(page: Page): Promise<void> {
  await clearPageData(page)
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  await page.waitForLoadState('domcontentloaded')
}

/**
 * Esperar a que todas las requests se completen
 */
export async function waitForAllRequests(page: Page, timeout: number = 10000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout }).catch(() => {
    // Ignorar si networkidle no se alcanza
  })
}

/**
 * Esperar a que no haya errores en la consola
 */
export async function waitForNoConsoleErrors(page: Page, timeout: number = 5000): Promise<void> {
  const errors: string[] = []
  
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      // Filtrar errores de extensiones del navegador
      const text = msg.text()
      const isExtensionError = 
        text.includes('message port closed') ||
        text.includes('Extension context invalidated') ||
        text.includes('asynchronous response')
      
      if (!isExtensionError) {
        errors.push(text)
      }
    }
  })
  
  await page.waitForTimeout(timeout)
  
  if (errors.length > 0) {
    throw new Error(`Errores en consola: ${errors.join(', ')}`)
  }
}

