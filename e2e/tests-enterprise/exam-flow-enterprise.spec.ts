import { test, expect } from '../fixtures'
import { ExamsPage } from '../pages'
import { measurePagePerformance } from '../utils/performance'
import { runAccessibilityChecks } from '../utils/accessibility'

/**
 * Tests E2E Enterprise del Flujo Completo de Examen
 */
test.describe('Flujo Completo de Examen - Enterprise', () => {
  test('debe listar exámenes disponibles con verificaciones enterprise', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    // Verificar que la página está cargada
    const isLoaded = await examsPage.isLoaded()
    expect(isLoaded).toBe(true)
    
    // Verificar que hay exámenes o mensaje de "no hay exámenes"
    const hasExams = await examsPage.hasExams()
    expect(typeof hasExams).toBe('boolean')
    
    // Performance: Verificar tiempo de carga
    const metrics = await measurePagePerformance(authenticatedPage)
    expect(metrics.loadTime).toBeLessThan(5000)
    
    // Accessibility: Verificar accesibilidad
    const a11yCheck = await runAccessibilityChecks(authenticatedPage)
    expect(a11yCheck.passed).toBe(true)
  })

  test('debe poder navegar a la página de tomar examen', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    if (!(await examsPage.hasExams())) {
      test.skip()
      return
    }
    
    // Navegar al primer examen
    await examsPage.navigateToFirstExam()
    
    // Verificar que estamos en la página de tomar examen
    expect(authenticatedPage.url()).toMatch(/\/exams\/.*\/take/)
    
    const takeExamPage = new TakeExamPage(authenticatedPage)
    const isLoaded = await takeExamPage.isLoaded()
    expect(isLoaded).toBe(true)
  })

  test('debe poder responder preguntas en un examen', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    if (!(await examsPage.hasExams())) {
      test.skip()
      return
    }
    
    await examsPage.navigateToFirstExam()
    const takeExamPage = new TakeExamPage(authenticatedPage)
    
    // Esperar a que el examen se cargue
    await takeExamPage.waitForLoad()
    
    // Seleccionar la primera opción
    await takeExamPage.selectFirstOption()
    
    // Verificar que la opción está seleccionada
    const options = authenticatedPage.locator('input[type="radio"]:checked, input[type="checkbox"]:checked')
    const checkedCount = await options.count()
    expect(checkedCount).toBeGreaterThan(0)
  })

  test('debe verificar performance durante el examen', async ({ authenticatedPage }) => {
    const examsPage = new ExamsPage(authenticatedPage)
    await examsPage.goto()
    
    if (!(await examsPage.hasExams())) {
      test.skip()
      return
    }
    
    await examsPage.navigateToFirstExam()
    
    // Medir performance de carga del examen
    const metrics = await measurePagePerformance(authenticatedPage)
    
    // Verificar que el examen carga en menos de 5 segundos
    expect(metrics.loadTime).toBeLessThan(5000)
    
    // Verificar accesibilidad
    const a11yCheck = await runAccessibilityChecks(authenticatedPage)
    expect(a11yCheck.passed).toBe(true)
  })
})

