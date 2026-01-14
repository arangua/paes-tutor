import { BasePage } from './BasePage'

/**
 * Page Object para la página de listado de exámenes
 */
export class ExamsPage extends BasePage {
  private readonly title = () => this.page.getByText(/Exámenes|Simulacros/i).first()
  private readonly searchInput = () => this.page.getByPlaceholder(/Buscar|Search/i).first()
  private readonly startButtons = () => this.page.getByRole('button', { name: /Iniciar|Comenzar|Realizar/i })
  private readonly examCards = () => this.page.locator('[class*="card"], [class*="exam"]')
  private readonly noExamsMessage = () => this.page.getByText(/No hay exámenes|Sin exámenes/i)

  async goto(): Promise<void> {
    await this.page.goto('/exams', { waitUntil: 'domcontentloaded' })
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
   * Verificar que hay exámenes disponibles
   */
  async hasExams(): Promise<boolean> {
    const hasExams = await this.startButtons().first().isVisible({ timeout: 5000 }).catch(() => false)
    const hasNoExams = await this.noExamsMessage().isVisible({ timeout: 5000 }).catch(() => false)
    return hasExams && !hasNoExams
  }

  /**
   * Buscar examen por texto
   */
  async searchExam(query: string): Promise<void> {
    if (await this.searchInput().isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeFill(this.searchInput(), query)
      await this.page.waitForTimeout(500) // Esperar debounce
    }
  }

  /**
   * Hacer clic en el primer examen disponible
   */
  async clickFirstExam(): Promise<void> {
    const startButton = this.startButtons().first()
    await this.safeClick(startButton)
    await this.waitForLoad()
  }

  /**
   * Obtener el ID del primer examen (desde el href o data attribute)
   */
  async getFirstExamId(): Promise<string | null> {
    const examCard = this.examCards().first()
    const examLink = examCard.getByRole('link').first()
    
    if (await examLink.isVisible({ timeout: 2000 }).catch(() => false)) {
      const href = await examLink.getAttribute('href')
      if (href) {
        const match = href.match(/\/exams\/([^\/]+)/)
        return match && match[1] ? match[1] : null
      }
    }
    
    return null
  }

  /**
   * Navegar al primer examen disponible
   */
  async navigateToFirstExam(): Promise<string | null> {
    const examId = await this.getFirstExamId()
    if (examId) {
      await this.page.goto(`/exams/${examId}/take`, { waitUntil: 'domcontentloaded' })
      await this.waitForLoad()
    } else {
      await this.clickFirstExam()
    }
    return examId
  }
}

