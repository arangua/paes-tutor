import { BasePage } from './BasePage'

/**
 * Page Object para la página de Notas
 */
export class NotesPage extends BasePage {
  private readonly title = () => this.page.getByText(/Notas|Notes/i).first()
  private readonly noteCards = () => this.page.locator('[data-note-id]')
  private readonly searchInput = () => this.page.getByPlaceholder(/Buscar|Search/i).first()

  async goto(): Promise<void> {
    await this.page.goto('/notes', { waitUntil: 'domcontentloaded' })
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.waitForVisible(this.title(), { timeout: 10000 })
      return true
    } catch {
      return false
    }
  }

  /**
   * Hacer clic en una nota específica
   */
  async clickNote(index: number = 0): Promise<void> {
    const noteCard = this.noteCards().nth(index)
    await this.safeClick(noteCard)
  }

  /**
   * Abrir diálogo de versiones de una nota
   */
  async openVersionsDialog(noteIndex: number = 0): Promise<void> {
    await this.clickNote(noteIndex)
    
    const versionsButton = this.page.getByRole('button', { name: /versiones|Versions/i })
    await this.safeClick(versionsButton)
    
    // Esperar a que el diálogo se abra
    await this.page.waitForTimeout(500)
  }

  /**
   * Buscar notas
   */
  async searchNotes(query: string): Promise<void> {
    if (await this.searchInput().isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeFill(this.searchInput(), query)
      await this.page.waitForTimeout(500) // Esperar debounce
    }
  }

  /**
   * Verificar que hay notas disponibles
   */
  async hasNotes(): Promise<boolean> {
    const count = await this.noteCards().count()
    return count > 0
  }
}

