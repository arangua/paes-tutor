import { BasePage } from './BasePage'

/**
 * Page Object para el Dashboard
 * Encapsula todos los elementos y acciones del dashboard
 */
export class DashboardPage extends BasePage {
  // Selectores principales
  private readonly greeting = () => this.page.getByText(/Hola|Bienvenido|Dashboard/i).first()
  private readonly totalAttempts = () => this.page.getByText(/Total Intentos/i)
  private readonly averageScore = () => this.page.getByText(/Promedio General/i)
  private readonly subjectsSection = () => this.page.getByText(/Asignaturas/i)
  private readonly bestScore = () => this.page.getByText(/Mejor Puntaje/i)
  
  // Secciones
  private readonly chartsSection = () => this.page.getByText(/Gráficos|Rendimiento|Progreso/i).first()
  private readonly recentAttempts = () => this.page.getByText(/Últimos Intentos|Intentos Recientes/i)
  
  // Navegación
  private readonly examsLink = () => this.page.getByRole('link', { name: /Exámenes|Simulacros/i })
  private readonly analyticsLink = () => this.page.getByRole('link', { name: /Analytics|Estadísticas|Análisis/i })
  private readonly profileLink = () => this.page.getByRole('link', { name: /Perfil|Profile|Mi Perfil/i })
  private readonly materialsLink = () => this.page.getByRole('link', { name: /Materiales|Recursos/i })

  async goto(): Promise<void> {
    await this.page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    try {
      await this.waitForVisible(this.greeting(), { timeout: 15000 })
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
      this.totalAttempts(),
      this.averageScore(),
      this.subjectsSection(),
      this.bestScore(),
    ]

    const visibleStats = await Promise.all(
      stats.map(stat => stat.isVisible({ timeout: 5000 }).catch(() => false))
    )

    return visibleStats.some(Boolean)
  }

  /**
   * Expandir sección de gráficos si está colapsada
   */
  async expandCharts(): Promise<void> {
    const chartsButton = this.chartsSection().locator('..').getByRole('button').first()
    if (await chartsButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.safeClick(chartsButton)
      await this.page.waitForTimeout(1000)
    }
  }

  /**
   * Verificar que hay gráficos visibles
   */
  async expectChartsVisible(): Promise<boolean> {
    await this.expandCharts()
    
    const hasCharts = await Promise.race([
      this.page.getByText(/Rendimiento por Asignatura/i).isVisible({ timeout: 5000 }),
      this.page.getByText(/Progreso Temporal/i).isVisible({ timeout: 5000 }),
      this.page.locator('canvas, svg').first().isVisible({ timeout: 5000 }),
    ]).catch(() => false)

    return hasCharts
  }

  /**
   * Verificar que hay sección de últimos intentos
   */
  async expectRecentAttemptsVisible(): Promise<boolean> {
    return await Promise.race([
      this.recentAttempts().isVisible({ timeout: 5000 }),
      this.page.getByRole('link', { name: /Ver|Intentos/i }).first().isVisible({ timeout: 5000 }),
    ]).catch(() => false)
  }

  /**
   * Navegar a exámenes
   */
  async navigateToExams(): Promise<void> {
    if (await this.examsLink().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.examsLink())
    } else {
      await this.page.goto('/exams', { waitUntil: 'domcontentloaded' })
    }
    await this.waitForLoad()
  }

  /**
   * Navegar a analytics
   */
  async navigateToAnalytics(): Promise<void> {
    if (await this.analyticsLink().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.analyticsLink())
    } else {
      await this.page.goto('/analytics', { waitUntil: 'domcontentloaded' })
    }
    await this.waitForLoad()
  }

  /**
   * Navegar a perfil
   */
  async navigateToProfile(): Promise<void> {
    if (await this.profileLink().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.profileLink())
    } else {
      await this.page.goto('/profile', { waitUntil: 'domcontentloaded' })
    }
    await this.waitForLoad()
  }

  /**
   * Navegar a materiales
   */
  async navigateToMaterials(): Promise<void> {
    if (await this.materialsLink().isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.safeClick(this.materialsLink())
    } else {
      await this.page.goto('/materials', { waitUntil: 'domcontentloaded' })
    }
    await this.waitForLoad()
  }
}

