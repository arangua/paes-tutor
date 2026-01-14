import { BasePage } from './BasePage'

/**
 * Page Object para la página de resultados de examen
 */
export class ResultsPage extends BasePage {
  private readonly title = () => this.page.getByText(/Resultados|Resultado|Análisis/i).first()
  private readonly score = () => this.page.getByText(/Puntaje|Score|Puntos/i)
  private readonly correctAnswers = () => this.page.getByText(/Correctas|Correct/i)
  private readonly incorrectAnswers = () => this.page.getByText(/Incorrectas|Incorrect|Errores/i)
  private readonly charts = () => this.page.locator('canvas, svg')
  private readonly questionsList = () => this.page.locator('[class*="question"], [class*="result"]')
  private readonly backButton = () => this.page.getByRole('link', { name: /Volver|Back|Dashboard/i })

  async goto(attemptId?: string): Promise<void> {
    if (attemptId) {
      await this.page.goto(`/attempts/${attemptId}`, { waitUntil: 'domcontentloaded' })
    } else {
      await this.page.goto('/attempts', { waitUntil: 'domcontentloaded' })
    }
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
   * Verificar que se muestran las estadísticas principales
   */
  async expectStatsVisible(): Promise<boolean> {
    const stats = [
      this.score(),
      this.correctAnswers(),
      this.incorrectAnswers(),
    ]

    const visibleStats = await Promise.all(
      stats.map(stat => stat.isVisible({ timeout: 5000 }).catch(() => false))
    )

    return visibleStats.some(Boolean)
  }

  /**
   * Verificar que hay gráficos visibles
   */
  async expectChartsVisible(): Promise<boolean> {
    return await this.charts().first().isVisible({ timeout: 5000 }).catch(() => false)
  }

  /**
   * Verificar que hay lista de preguntas
   */
  async expectQuestionsListVisible(): Promise<boolean> {
    return await this.questionsList().first().isVisible({ timeout: 5000 }).catch(() => false)
  }

  /**
   * Volver al dashboard
   */
  async goBack(): Promise<void> {
    if (await this.backButton().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.backButton())
    } else {
      await this.page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    }
    await this.waitForLoad()
  }
}

