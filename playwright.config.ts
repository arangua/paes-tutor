import { defineConfig, devices } from '@playwright/test'

/**
 * Configuración Enterprise de Playwright para tests E2E
 * 
 * Características Enterprise:
 * - Page Object Model (POM) support
 * - Fixtures personalizados
 * - Visual regression testing
 * - Performance testing
 * - Accessibility testing
 * - Reporting avanzado (HTML, JSON, JUnit)
 * - Ejecución paralela optimizada
 * - Retries automáticos en CI
 * - Screenshots, videos y traces automáticos
 * - Soporte para múltiples navegadores
 * - WebServer automático
 */
export default defineConfig({
  testDir: './e2e',
  
  // Ejecución en paralelo en desarrollo, secuencial en CI
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter: Múltiples reportes para enterprise
  reporter: process.env.CI
    ? [
        ['html', { outputFolder: 'playwright-report' }],
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
      ]
    : [
        ['html', { outputFolder: 'playwright-report', open: 'never' }],
        ['list'],
      ],
  
  // Timeouts
  timeout: 60 * 1000, // 60 segundos por test (aumentado para tests de autenticación)
  expect: {
    timeout: 15 * 1000, // 15 segundos para expectaciones
    // Configuración para visual regression
    toHaveScreenshot: {
      threshold: 0.2, // 20% de diferencia permitida
      maxDiffPixels: 100,
    },
    toMatchSnapshot: {
      threshold: 0.2,
    },
  },
  
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry', // Traces solo en retries
    screenshot: 'only-on-failure', // Screenshots solo en fallos
    video: 'retain-on-failure', // Videos solo en fallos
    // Headless en CI, headed en desarrollo
    headless: process.env.CI ? true : false,
    // Timeouts de navegación
    navigationTimeout: 60 * 1000,
    actionTimeout: 15 * 1000,
  },
  
  // Proyectos: múltiples navegadores
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Mobile testing (opcional, descomentar si se necesita)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
  ],
  
  // WebServer: iniciar Next.js automáticamente
  webServer: {
    command: 'npm run dev',
    url: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    reuseExistingServer: !process.env.CI, // Reusar servidor en desarrollo
    timeout: 120 * 1000, // 2 minutos para iniciar
    stdout: 'ignore',
    stderr: 'pipe',
    // Esperar a que el servidor responda correctamente
    env: {
      NODE_ENV: 'test',
    },
  },
})
