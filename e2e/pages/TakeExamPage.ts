import { BasePage } from './BasePage'

/**
 * Page Object para la página de tomar examen
 */
export class TakeExamPage extends BasePage {
  private readonly questionText = () => this.page.getByText(/Pregunta|Enunciado/i).first()
  private readonly options = () => this.page.locator('input[type="radio"], input[type="checkbox"]')
  private readonly submitButton = () => this.page.getByRole('button', { name: /Finalizar|Enviar|Submit/i })
  private readonly cancelButton = () => this.page.getByRole('button', { name: /Cancelar|Salir/i })
  private readonly timer = () => this.page.locator('[class*="timer"], [class*="time"]')
  private readonly progressBar = () => this.page.locator('[class*="progress"], [role="progressbar"]')
  private readonly questionNumber = () => this.page.locator('[class*="question-number"], [class*="current"]')

  async goto(examId?: string): Promise<void> {
    if (examId) {
      await this.page.goto(`/exams/${examId}/take`, { waitUntil: 'domcontentloaded' })
    } else {
      await this.page.goto('/exams', { waitUntil: 'domcontentloaded' })
    }
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    try {
      // Esperar a que el examen se cargue (puede tardar)
      await this.page.waitForTimeout(2000)
      const hasContent = await Promise.race([
        this.questionText().isVisible({ timeout: 5000 }),
        this.options().first().isVisible({ timeout: 5000 }),
        this.page.getByText(/Cargando|Loading/i).isHidden({ timeout: 10000 }),
      ]).catch(() => false)
      return hasContent
    } catch {
      return false
    }
  }

  /**
   * Seleccionar una opción de respuesta
   */
  async selectOption(index: number = 0): Promise<void> {
    const option = this.options().nth(index)
    if (await option.isVisible({ timeout: 5000 }).catch(() => false)) {
      await option.check()
      await this.page.waitForTimeout(500) // Esperar auto-save
    }
  }

  /**
   * Seleccionar la primera opción disponible
   */
  async selectFirstOption(): Promise<void> {
    await this.selectOption(0)
  }

  /**
   * Ir a la siguiente pregunta
   */
  async nextQuestion(): Promise<void> {
    const nextButton = this.page.getByRole('button', { name: /Siguiente|Next/i })
    if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(nextButton)
      await this.page.waitForTimeout(1000)
    }
  }

  /**
   * Ir a la pregunta anterior
   */
  async previousQuestion(): Promise<void> {
    const prevButton = this.page.getByRole('button', { name: /Anterior|Previous|Atrás/i })
    if (await prevButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(prevButton)
      await this.page.waitForTimeout(1000)
    }
  }

  /**
   * Finalizar el examen
   */
  async submitExam(): Promise<void> {
    if (await this.submitButton().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.submitButton())
      // Esperar confirmación si hay diálogo
      const confirmButton = this.page.getByRole('button', { name: /Confirmar|Sí|Yes/i })
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.safeClick(confirmButton)
      }
      await this.waitForLoad()
    }
  }

  /**
   * Cancelar el examen
   */
  async cancelExam(): Promise<void> {
    if (await this.cancelButton().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.cancelButton())
      // Confirmar cancelación si hay diálogo
      const confirmButton = this.page.getByRole('button', { name: /Confirmar|Sí|Yes/i })
      if (await confirmButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.safeClick(confirmButton)
      }
      await this.waitForLoad()
    }
  }

  /**
   * Obtener el número de pregunta actual
   */
  async getCurrentQuestionNumber(): Promise<number | null> {
    if (await this.questionNumber().isVisible({ timeout: 2000 }).catch(() => false)) {
      const text = await this.questionNumber().textContent()
      const match = text?.match(/(\d+)/)
      return match && match[1] ? parseInt(match[1], 10) : null
    }
    return null
  }

  /**
   * Verificar que hay un timer visible
   */
  async hasTimer(): Promise<boolean> {
    return await this.timer().isVisible({ timeout: 2000 }).catch(() => false)
  }

  /**
   * Verificar que hay una barra de progreso
   */
  async hasProgressBar(): Promise<boolean> {
    return await this.progressBar().isVisible({ timeout: 2000 }).catch(() => false)
  }
}

