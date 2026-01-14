import { Page } from '@playwright/test'
import { BasePage } from './BasePage'

/**
 * Page Object para el diálogo de versiones de notas
 */
export class VersionsDialog extends BasePage {
  private readonly dialog = () => this.page.getByText(/historial de versiones|Versions History/i).locator('..')
  private readonly versionCards = () => this.page.locator('[data-version-id]')
  private readonly searchInput = () => this.page.getByPlaceholder(/buscar versiones|Search versions/i)
  private readonly closeButton = () => this.page.getByRole('button', { name: /Cerrar|Close|X/i }).last()

  constructor(page: Page) {
    super(page)
  }

  async goto(): Promise<void> {
    // El diálogo se abre desde NotesPage, no se navega directamente
    throw new Error('VersionsDialog debe abrirse desde NotesPage.openVersionsDialog()')
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.waitForVisible(this.dialog(), { timeout: 5000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Esperar a que se carguen las versiones
   */
  async waitForVersions(): Promise<void> {
    await this.versionCards().first().waitFor({ state: 'visible', timeout: 10000 })
  }

  /**
   * Restaurar una versión específica
   */
  async restoreVersion(index: number = 1): Promise<void> {
    await this.waitForVersions()
    
    const versionCard = this.versionCards().nth(index)
    const restoreButton = versionCard.getByRole('button', { name: /restaurar|Restore/i })
    await this.safeClick(restoreButton)
    
    // Confirmar restauración
    const confirmButton = this.page.getByRole('button', { name: /confirmar|Confirm|Restaurar/i })
    if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(confirmButton)
    }
  }

  /**
   * Comparar dos versiones
   */
  async compareVersions(index1: number = 0, index2: number = 1): Promise<void> {
    await this.waitForVersions()
    
    const version1 = this.versionCards().nth(index1)
    const version2 = this.versionCards().nth(index2)
    
    const compareButton1 = version1.getByRole('button', { name: /comparar|Compare/i })
    const compareButton2 = version2.getByRole('button', { name: /comparar|Compare/i })
    
    await this.safeClick(compareButton1)
    await this.safeClick(compareButton2)
    
    // Hacer clic en el botón de comparar múltiples
    const compareMultipleButton = this.page.getByRole('button', { name: /comparar.*2|Compare.*2/i })
    if (await compareMultipleButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(compareMultipleButton)
    }
  }

  /**
   * Exportar una versión
   */
  async exportVersion(index: number = 0, format: 'txt' | 'pdf' | 'md' = 'txt'): Promise<void> {
    await this.waitForVersions()
    
    const versionCard = this.versionCards().nth(index)
    const exportButton = versionCard.getByRole('button', { name: /exportar|Export|descargar|Download/i })
    
    // Configurar listener para descarga
    const downloadPromise = this.page.waitForEvent('download', { timeout: 10000 })
    
    await this.safeClick(exportButton)
    
    // Seleccionar formato
    const formatButton = this.page.getByRole('button', { name: new RegExp(format, 'i') }).first()
    if (await formatButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(formatButton)
    }
    
    // Esperar descarga
    await downloadPromise
  }

  /**
   * Buscar versiones
   */
  async searchVersions(query: string): Promise<void> {
    if (await this.searchInput().isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeFill(this.searchInput(), query)
      await this.page.waitForTimeout(500) // Esperar debounce
    }
  }

  /**
   * Seleccionar múltiples versiones
   */
  async selectVersions(...indices: number[]): Promise<void> {
    await this.waitForVersions()
    
    for (const index of indices) {
      const versionCard = this.versionCards().nth(index)
      const checkbox = versionCard.getByRole('button', { name: /seleccionar|Select/i })
      await this.safeClick(checkbox)
    }
  }

  /**
   * Fusionar versiones seleccionadas
   */
  async mergeVersions(title: string): Promise<void> {
    const mergeButton = this.page.getByRole('button', { name: /fusionar|Merge/i })
    if (await mergeButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(mergeButton)
      
      // Completar formulario de fusión
      const titleInput = this.page.getByPlaceholder(/título.*fusionada|title.*merged/i)
      if (await titleInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.safeFill(titleInput, title)
      }
      
      const mergeConfirmButton = this.page.getByRole('button', { name: /fusionar|Merge/i }).last()
      await this.safeClick(mergeConfirmButton)
    }
  }

  /**
   * Cerrar el diálogo
   */
  async close(): Promise<void> {
    if (await this.closeButton().isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(this.closeButton())
    } else {
      // Presionar Escape como alternativa
      await this.page.keyboard.press('Escape')
    }
  }
}

