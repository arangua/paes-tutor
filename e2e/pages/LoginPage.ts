import { BasePage } from './BasePage'

/**
 * Page Object para la página de inicio de sesión
 * Encapsula todos los elementos y acciones relacionadas con el login
 */
export class LoginPage extends BasePage {
  // Selectores
  private readonly emailInput = () => this.page.getByLabel(/Email/i)
  private readonly passwordInput = () => this.page.getByLabel(/Contraseña/i)
  private readonly loginButton = () => this.page.getByRole('button', { name: /Iniciar Sesión/i })
  private readonly title = () => this.page.getByText(/Iniciar Sesión/i).first()
  private readonly errorMessage = () => this.page.locator('[class*="error"], [role="alert"]').first()

  async goto(): Promise<void> {
    await this.page.goto('/auth/signin', { waitUntil: 'domcontentloaded' })
    await this.waitForLoad()
  }

  async isLoaded(): Promise<boolean> {
    try {
      // Esperar a que la página cargue primero
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 })
      
      // Verificar elementos con timeouts más generosos
      const titleVisible = await this.title().isVisible({ timeout: 10000 }).catch(() => false)
      const emailVisible = await this.emailInput().isVisible({ timeout: 10000 }).catch(() => false)
      const passwordVisible = await this.passwordInput().isVisible({ timeout: 10000 }).catch(() => false)
      const buttonVisible = await this.loginButton().isVisible({ timeout: 10000 }).catch(() => false)
      
      // Al menos el título y un campo deben estar visibles
      return titleVisible && (emailVisible || passwordVisible || buttonVisible)
    } catch {
      return false
    }
  }

  /**
   * Llenar el campo de email
   */
  async fillEmail(email: string): Promise<void> {
    await this.safeFill(this.emailInput(), email)
  }

  /**
   * Llenar el campo de contraseña
   */
  async fillPassword(password: string): Promise<void> {
    await this.safeFill(this.passwordInput(), password)
  }

  /**
   * Hacer clic en el botón de iniciar sesión
   */
  async clickLogin(): Promise<void> {
    await this.safeClick(this.loginButton())
  }

  /**
   * Iniciar sesión completo (email + password + click)
   */
  async login(email: string, password: string): Promise<void> {
    await this.fillEmail(email)
    await this.fillPassword(password)
    await this.clickLogin()
  }

  /**
   * Verificar que hay un error de credenciales
   */
  async expectCredentialsError(): Promise<void> {
    await this.expectText(this.errorMessage(), /Credenciales inválidas|Error|invalid/i)
  }

  /**
   * Verificar que hay un error de validación
   */
  async expectValidationError(): Promise<void> {
    await this.expectText(this.errorMessage(), /completa todos los campos|email válido/i)
  }

  /**
   * Verificar que el formulario está visible
   */
  async expectFormVisible(): Promise<void> {
    await this.expectVisible(this.title())
    await this.expectVisible(this.emailInput())
    await this.expectVisible(this.passwordInput())
    await this.expectVisible(this.loginButton())
  }
}

