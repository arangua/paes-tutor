import { Page, Locator, expect } from '@playwright/test'

/**
 * Clase base para todos los Page Objects
 * Implementa funcionalidades comunes y patrones reutilizables
 */
export abstract class BasePage {
  protected page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Navegar a la página
   */
  abstract goto(...args: unknown[]): Promise<void>

  /**
   * Esperar a que la página se cargue completamente
   */
  async waitForLoad(options?: { timeout?: number }): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout: options?.timeout || 20000 })
    await this.page.waitForLoadState('networkidle', { timeout: 10000 }).catch(() => {
      // Ignorar si networkidle no se alcanza (puede haber requests continuos)
    })
  }

  /**
   * Verificar que estamos en la página correcta
   */
  abstract isLoaded(): Promise<boolean>

  /**
   * Obtener el título de la página
   */
  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  /**
   * Obtener la URL actual
   */
  getUrl(): string {
    return this.page.url()
  }

  /**
   * Hacer screenshot de la página
   */
  async screenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer> {
    return await this.page.screenshot(options)
  }

  /**
   * Esperar a que un elemento sea visible
   */
  protected async waitForVisible(
    locator: Locator,
    options?: { timeout?: number; message?: string }
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 })
  }

  /**
   * Esperar a que un elemento sea clickeable
   */
  protected async waitForClickable(
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: options?.timeout || 10000 })
    await expect(locator).toBeEnabled({ timeout: options?.timeout || 10000 })
  }

  /**
   * Hacer clic seguro (con espera y verificación)
   */
  protected async safeClick(locator: Locator, options?: { timeout?: number }): Promise<void> {
    await this.waitForClickable(locator, options)
    await locator.click()
  }

  /**
   * Llenar campo de forma segura
   */
  protected async safeFill(locator: Locator, value: string, options?: { timeout?: number }): Promise<void> {
    await this.waitForVisible(locator, options)
    await locator.fill(value)
  }

  /**
   * Verificar que un elemento contiene texto
   */
  protected async expectText(locator: Locator, text: string | RegExp): Promise<void> {
    await expect(locator).toContainText(text, { timeout: 10000 })
  }

  /**
   * Verificar que un elemento es visible
   */
  protected async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: 10000 })
  }

  /**
   * Navegar usando el header
   */
  async navigateTo(linkText: string | RegExp): Promise<void> {
    const link = this.page.getByRole('link', { name: linkText }).first()
    await this.safeClick(link)
    await this.waitForLoad()
  }

  /**
   * Verificar que hay un error visible
   */
  async hasError(message?: string | RegExp): Promise<boolean> {
    if (message) {
      return await this.page.getByText(message).isVisible({ timeout: 5000 }).catch(() => false)
    }
    return await this.page.locator('[role="alert"], .error, [class*="error"]').first().isVisible({ timeout: 5000 }).catch(() => false)
  }

  /**
   * Verificar que hay un mensaje de éxito
   */
  async hasSuccess(message?: string | RegExp): Promise<boolean> {
    if (message) {
      return await this.page.getByText(message).isVisible({ timeout: 5000 }).catch(() => false)
    }
    return await this.page.locator('[role="status"], .success, [class*="success"]').first().isVisible({ timeout: 5000 }).catch(() => false)
  }
}

