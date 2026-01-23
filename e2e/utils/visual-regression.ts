import { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Utilidades para visual regression testing
 */

export interface VisualComparisonOptions {
  threshold?: number
  maxDiffPixels?: number
  maxDiffPixelRatio?: number
  fullPage?: boolean
}

/**
 * Comparar screenshot actual con baseline
 */
export async function compareScreenshot(
  page: Page,
  name: string,
  options: VisualComparisonOptions = {}
): Promise<void> {
  const {
    threshold = 0.2,
    maxDiffPixels,
    maxDiffPixelRatio = 0.01,
    fullPage = true,
  } = options

  await expect(page).toHaveScreenshot(name, {
    threshold,
    maxDiffPixels,
    maxDiffPixelRatio,
    fullPage,
  })
}

/**
 * Tomar screenshot de un elemento específico
 */
export async function screenshotElement(
  page: Page,
  selector: string,
  name: string,
  options: VisualComparisonOptions = {}
): Promise<void> {
  const element = page.locator(selector).first()
  await expect(element).toHaveScreenshot(name, {
    threshold: options.threshold || 0.2,
    maxDiffPixels: options.maxDiffPixels,
    maxDiffPixelRatio: options.maxDiffPixelRatio || 0.01,
  })
}

/**
 * Verificar que no hay cambios visuales en la página completa
 */
export async function expectNoVisualChanges(
  page: Page,
  name: string,
  options: VisualComparisonOptions = {}
): Promise<void> {
  await compareScreenshot(page, name, options)
}

/**
 * Verificar que no hay cambios visuales en un componente específico
 */
export async function expectNoVisualChangesInComponent(
  page: Page,
  selector: string,
  name: string,
  options: VisualComparisonOptions = {}
): Promise<void> {
  await screenshotElement(page, selector, name, options)
}

