/**
 * Enterprise Test Analytics
 * 
 * Sistema de analytics y métricas avanzadas para tests con
 * tracking de performance, cobertura, y calidad.
 * 
 * @module test-analytics
 * @version 3.0.0
 * @enterprise
 */

// ============================================
// TIPOS Y INTERFACES
// ============================================

export interface TestMetrics {
  testName: string
  duration: number
  status: 'passed' | 'failed' | 'skipped'
  assertions: number
  mocksUsed: number
  apiCalls: number
  databaseQueries: number
  memoryUsage?: number
  timestamp: Date
}

export interface TestSuiteMetrics {
  suiteName: string
  totalTests: number
  passed: number
  failed: number
  skipped: number
  totalDuration: number
  averageDuration: number
  slowestTest?: TestMetrics
  fastestTest?: TestMetrics
  coverage?: {
    lines: number
    functions: number
    branches: number
    statements: number
  }
}

export interface AnalyticsConfig {
  trackPerformance?: boolean
  trackMemory?: boolean
  trackCoverage?: boolean
  trackApiCalls?: boolean
  trackDatabaseQueries?: boolean
  outputFormat?: 'json' | 'html' | 'console'
  outputPath?: string
}

// ============================================
// ANALYTICS COLLECTOR
// ============================================

/**
 * Colector de analytics enterprise
 */
export class EnterpriseTestAnalytics {
  private metrics: TestMetrics[] = []
  private suiteMetrics: Map<string, TestSuiteMetrics> = new Map()
  private config: AnalyticsConfig = {
    trackPerformance: true,
    trackMemory: false,
    trackCoverage: false,
    trackApiCalls: true,
    trackDatabaseQueries: true,
    outputFormat: 'console',
  }

  constructor(config?: AnalyticsConfig) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Registra métricas de un test
   */
  recordTest(metrics: TestMetrics): void {
    this.metrics.push(metrics)
  }

  /**
   * Registra métricas de un suite
   */
  recordSuite(metrics: TestSuiteMetrics): void {
    this.suiteMetrics.set(metrics.suiteName, metrics)
  }

  /**
   * Obtiene todas las métricas
   */
  getMetrics(): TestMetrics[] {
    return [...this.metrics]
  }

  /**
   * Obtiene métricas de un suite
   */
  getSuiteMetrics(suiteName: string): TestSuiteMetrics | undefined {
    return this.suiteMetrics.get(suiteName)
  }

  /**
   * Obtiene estadísticas agregadas
   */
  getStatistics(): {
    totalTests: number
    passed: number
    failed: number
    skipped: number
    totalDuration: number
    averageDuration: number
    passRate: number
    slowestTests: TestMetrics[]
    fastestTests: TestMetrics[]
  } {
    const totalTests = this.metrics.length
    const passed = this.metrics.filter(m => m.status === 'passed').length
    const failed = this.metrics.filter(m => m.status === 'failed').length
    const skipped = this.metrics.filter(m => m.status === 'skipped').length
    const totalDuration = this.metrics.reduce((sum, m) => sum + m.duration, 0)
    const averageDuration = totalTests > 0 ? totalDuration / totalTests : 0
    const passRate = totalTests > 0 ? (passed / totalTests) * 100 : 0

    const sortedByDuration = [...this.metrics].sort((a, b) => b.duration - a.duration)
    const slowestTests = sortedByDuration.slice(0, 10)
    const fastestTests = sortedByDuration.slice(-10).reverse()

    return {
      totalTests,
      passed,
      failed,
      skipped,
      totalDuration,
      averageDuration,
      passRate,
      slowestTests,
      fastestTests,
    }
  }

  /**
   * Genera reporte
   */
  generateReport(): string {
    const stats = this.getStatistics()
    const format = this.config.outputFormat || 'console'

    if (format === 'json') {
      return JSON.stringify({
        statistics: stats,
        metrics: this.metrics,
        suites: Array.from(this.suiteMetrics.values()),
      }, null, 2)
    }

    if (format === 'html') {
      return this.generateHtmlReport(stats)
    }

    return this.generateConsoleReport(stats)
  }

  /**
   * Genera reporte en consola
   */
  private generateConsoleReport(stats: ReturnType<typeof this.getStatistics>): string {
    return `
╔═══════════════════════════════════════════════════════════╗
║           Enterprise Test Analytics Report                ║
╠═══════════════════════════════════════════════════════════╣
║ Total Tests:        ${stats.totalTests.toString().padEnd(35)} ║
║ Passed:             ${stats.passed.toString().padEnd(35)} ║
║ Failed:              ${stats.failed.toString().padEnd(35)} ║
║ Skipped:             ${stats.skipped.toString().padEnd(35)} ║
║ Pass Rate:           ${stats.passRate.toFixed(2)}%${' '.repeat(32)} ║
║ Total Duration:      ${stats.totalDuration.toFixed(2)}ms${' '.repeat(30)} ║
║ Average Duration:    ${stats.averageDuration.toFixed(2)}ms${' '.repeat(30)} ║
╠═══════════════════════════════════════════════════════════╣
║ Top 5 Slowest Tests:                                      ║
╠═══════════════════════════════════════════════════════════╣
${stats.slowestTests.slice(0, 5).map((test, i) => 
  `║ ${(i + 1).toString().padEnd(2)}. ${test.testName.substring(0, 45).padEnd(45)} ║`
).join('\n')}
╚═══════════════════════════════════════════════════════════╝
    `.trim()
  }

  /**
   * Genera reporte HTML
   */
  private generateHtmlReport(stats: ReturnType<typeof this.getStatistics>): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <title>Enterprise Test Analytics Report</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
    .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
    .stat-value { font-size: 2em; font-weight: bold; }
    .slowest-tests { margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background-color: #f2f2f2; }
  </style>
</head>
<body>
  <h1>Enterprise Test Analytics Report</h1>
  <div class="stats">
    <div class="stat-card">
      <div class="stat-label">Total Tests</div>
      <div class="stat-value">${stats.totalTests}</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Pass Rate</div>
      <div class="stat-value">${stats.passRate.toFixed(2)}%</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Total Duration</div>
      <div class="stat-value">${stats.totalDuration.toFixed(2)}ms</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Average Duration</div>
      <div class="stat-value">${stats.averageDuration.toFixed(2)}ms</div>
    </div>
  </div>
  <div class="slowest-tests">
    <h2>Slowest Tests</h2>
    <table>
      <thead>
        <tr>
          <th>Test Name</th>
          <th>Duration (ms)</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        ${stats.slowestTests.map(test => `
          <tr>
            <td>${test.testName}</td>
            <td>${test.duration.toFixed(2)}</td>
            <td>${test.status}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  </div>
</body>
</html>
    `.trim()
  }

  /**
   * Exporta métricas a archivo
   */
  async exportMetrics(path: string): Promise<void> {
    const report = this.generateReport()
    const fs = await import('fs/promises')
    await fs.writeFile(path, report, 'utf-8')
  }

  /**
   * Limpia todas las métricas
   */
  clear(): void {
    this.metrics = []
    this.suiteMetrics.clear()
  }
}

// ============================================
// GLOBAL ANALYTICS INSTANCE
// ============================================

let globalAnalytics: EnterpriseTestAnalytics | null = null

/**
 * Obtiene o crea la instancia global de analytics
 */
export function getAnalytics(config?: AnalyticsConfig): EnterpriseTestAnalytics {
  if (!globalAnalytics) {
    globalAnalytics = new EnterpriseTestAnalytics(config)
  }
  return globalAnalytics
}

/**
 * Resetea la instancia global de analytics
 */
export function resetAnalytics(): void {
  if (globalAnalytics) {
    globalAnalytics.clear()
    globalAnalytics = null
  }
}

