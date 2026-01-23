import { BasePage } from './BasePage'

/**
 * Page Object para la página de Analytics
 */
export class AnalyticsPage extends BasePage {
  private readonly title = () => this.page.getByText(/Analytics|Análisis|Estadísticas/i).first()
  private readonly charts = () => this.page.locator('canvas, svg')
  private readonly tables = () => this.page.getByRole('table')
  private readonly performanceSection = () => this.page.getByText(/Rendimiento|Performance/i)
  private readonly progressSection = () => this.page.getByText(/Progreso|Progress/i)

  async goto(): Promise<void> {
    await this.page.goto('/analytics', { waitUntil: 'domcontentloaded' })
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    try {
      const hasContent = await Promise.race([
        this.title().isVisible({ timeout: 5000 }),
        this.performanceSection().isVisible({ timeout: 5000 }),
        this.progressSection().isVisible({ timeout: 5000 }),
      ]).catch(() => false)
      return hasContent
    } catch {
      return false
    }
  }

  /**
   * Verificar que hay visualizaciones (gráficos o tablas)
   */
  async expectVisualizationsVisible(): Promise<boolean> {
    const hasCharts = await this.charts().first().isVisible({ timeout: 5000 }).catch(() => false)
    const hasTables = await this.tables().first().isVisible({ timeout: 5000 }).catch(() => false)
    const hasText = await Promise.race([
      this.page.getByText(/Gráfico|Chart|Visualización/i).isVisible({ timeout: 5000 }),
    ]).catch(() => false)
    
    return hasCharts || hasTables || hasText
  }
}

