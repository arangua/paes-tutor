import { Page, expect } from '@playwright/test'

/**
 * Utilidades para testing de accesibilidad
 */

/**
 * Verificar que la página tiene un título
 */
export async function expectPageTitle(page: Page): Promise<void> {
  const title = await page.title()
  expect(title).toBeTruthy()
  expect(title.length).toBeGreaterThan(0)
}

/**
 * Verificar que hay un heading principal (h1)
 */
export async function expectMainHeading(page: Page): Promise<void> {
  const h1 = page.locator('h1').first()
  await expect(h1).toBeVisible({ timeout: 10000 })
}

/**
 * Verificar que los elementos interactivos tienen labels accesibles
 */
export async function expectAccessibleLabels(page: Page): Promise<void> {
  // Verificar que los botones tienen texto o aria-label
  const buttons = page.getByRole('button')
  const buttonCount = await buttons.count()
  
  for (let i = 0; i < Math.min(buttonCount, 10); i++) {
    const button = buttons.nth(i)
    if (await button.isVisible({ timeout: 1000 }).catch(() => false)) {
      const hasText = (await button.textContent())?.trim().length ?? 0 > 0
      const hasAriaLabel = (await button.getAttribute('aria-label'))?.length ?? 0 > 0
      const hasAriaLabelledBy = (await button.getAttribute('aria-labelledby'))?.length ?? 0 > 0
      
      expect(hasText || hasAriaLabel || hasAriaLabelledBy).toBe(true)
    }
  }
}

/**
 * Verificar que los inputs tienen labels asociados
 */
export async function expectInputLabels(page: Page): Promise<void> {
  const inputs = page.locator('input[type="text"], input[type="email"], input[type="password"]')
  const inputCount = await inputs.count()
  
  for (let i = 0; i < Math.min(inputCount, 10); i++) {
    const input = inputs.nth(i)
    if (await input.isVisible({ timeout: 1000 }).catch(() => false)) {
      const id = await input.getAttribute('id')
      const hasLabel = id ? await page.locator(`label[for="${id}"]`).isVisible({ timeout: 1000 }).catch(() => false) : false
      const hasAriaLabel = (await input.getAttribute('aria-label'))?.length ?? 0 > 0
      const hasAriaLabelledBy = (await input.getAttribute('aria-labelledby'))?.length ?? 0 > 0
      
      expect(hasLabel || hasAriaLabel || hasAriaLabelledBy).toBe(true)
    }
  }
}

/**
 * Verificar contraste de colores básico (verificación simple)
 */
export async function expectBasicColorContrast(page: Page): Promise<void> {
  // Esta es una verificación básica - para verificación completa usar herramientas especializadas
  const body = page.locator('body')
  const backgroundColor = await body.evaluate((el) => {
    return window.getComputedStyle(el).backgroundColor
  })
  
  // Verificar que hay un color de fondo definido
  expect(backgroundColor).toBeTruthy()
  expect(backgroundColor).not.toBe('transparent')
}

/**
 * Verificar navegación por teclado básica
 */
export async function expectKeyboardNavigation(page: Page): Promise<void> {
  // Verificar que los elementos interactivos son focusables
  const interactiveElements = page.locator('button, a, input, select, textarea, [tabindex]')
  const count = await interactiveElements.count()
  
  if (count > 0) {
    const firstElement = interactiveElements.first()
    await firstElement.focus()
    const isFocused = await firstElement.evaluate((el) => document.activeElement === el)
    expect(isFocused).toBe(true)
  }
}

/**
 * Ejecutar todas las verificaciones de accesibilidad básicas
 */
export async function runAccessibilityChecks(page: Page): Promise<{
  passed: boolean
  failures: string[]
}> {
  const failures: string[] = []
  
  try {
    await expectPageTitle(page)
  } catch (error) {
    failures.push('Falta título de página')
  }
  
  try {
    await expectMainHeading(page)
  } catch (error) {
    failures.push('Falta heading principal (h1)')
  }
  
  try {
    await expectAccessibleLabels(page)
  } catch (error) {
    failures.push('Algunos botones no tienen labels accesibles')
  }
  
  try {
    await expectInputLabels(page)
  } catch (error) {
    failures.push('Algunos inputs no tienen labels asociados')
  }
  
  try {
    await expectKeyboardNavigation(page)
  } catch (error) {
    failures.push('Problemas con navegación por teclado')
  }
  
  return {
    passed: failures.length === 0,
    failures,
  }
}

