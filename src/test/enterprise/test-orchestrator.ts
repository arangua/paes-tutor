/**
 * Enterprise Test Orchestrator
 * 
 * Sistema de orquestación avanzado para tests con gestión de estado,
 * lifecycle management, y coordinación entre tests.
 * 
 * @module test-orchestrator
 * @version 3.0.0
 * @enterprise
 */

import { vi, beforeEach, afterEach } from 'vitest'
import type { PrismaClient } from '@prisma/client'

// ============================================
// TIPOS Y CONFIGURACIONES
// ============================================

export interface TestContext {
  prisma?: Partial<PrismaClient>
  mocks?: Map<string, unknown>
  fixtures?: Map<string, unknown>
  cleanup?: Array<() => void | Promise<void>>
  metadata?: Record<string, unknown>
}

export interface OrchestratorConfig {
  autoCleanup?: boolean
  parallel?: boolean
  timeout?: number
  retries?: number
  setupHooks?: Array<() => void | Promise<void>>
  teardownHooks?: Array<() => void | Promise<void>>
}

// ============================================
// TEST ORCHESTRATOR
// ============================================

/**
 * Orquestador enterprise para gestionar el ciclo de vida de tests
 */
export class EnterpriseTestOrchestrator {
  private context: TestContext = {
    mocks: new Map(),
    fixtures: new Map(),
    cleanup: [],
    metadata: {},
  }

  private config: OrchestratorConfig = {
    autoCleanup: true,
    parallel: false,
    timeout: 10000,
    retries: 0,
  }

  constructor(config?: OrchestratorConfig) {
    if (config) {
      this.config = { ...this.config, ...config }
    }
  }

  /**
   * Registra un mock en el contexto
   */
  registerMock<T>(key: string, mock: T): T {
    this.context.mocks?.set(key, mock)
    return mock
  }

  /**
   * Obtiene un mock del contexto
   */
  getMock<T>(key: string): T | undefined {
    return this.context.mocks?.get(key) as T | undefined
  }

  /**
   * Registra un fixture en el contexto
   */
  registerFixture<T>(key: string, fixture: T): T {
    this.context.fixtures?.set(key, fixture)
    return fixture
  }

  /**
   * Obtiene un fixture del contexto
   */
  getFixture<T>(key: string): T | undefined {
    return this.context.fixtures?.get(key) as T | undefined
  }

  /**
   * Registra una función de limpieza
   */
  registerCleanup(cleanup: () => void | Promise<void>): void {
    this.context.cleanup?.push(cleanup)
  }

  /**
   * Ejecuta todas las funciones de limpieza
   */
  async cleanup(): Promise<void> {
    if (!this.context.cleanup) return

    // Ejecutar en orden inverso (LIFO)
    for (let i = this.context.cleanup.length - 1; i >= 0; i--) {
      try {
        // eslint-disable-next-line security/detect-object-injection
        const cleanupFn = this.context.cleanup[i] // index controlled by loop bounds
        if (cleanupFn) {
          await cleanupFn()
        }
      } catch (error) {
        console.error(`Error en cleanup ${i}:`, error)
      }
    }

    this.context.cleanup = []
  }

  /**
   * Ejecuta hooks de setup
   */
  async setup(): Promise<void> {
    if (this.config.setupHooks) {
      for (const hook of this.config.setupHooks) {
        await hook()
      }
    }
  }

  /**
   * Ejecuta hooks de teardown
   */
  async teardown(): Promise<void> {
    if (this.config.teardownHooks) {
      for (const hook of this.config.teardownHooks) {
        await hook()
      }
    }

    if (this.config.autoCleanup) {
      await this.cleanup()
    }
  }

  /**
   * Resetea el contexto completo
   */
  reset(): void {
    this.context = {
      mocks: new Map(),
      fixtures: new Map(),
      cleanup: [],
      metadata: {},
    }
    vi.clearAllMocks()
  }

  /**
   * Obtiene el contexto completo
   */
  getContext(): TestContext {
    return this.context
  }

  /**
   * Establece metadata
   */
  setMetadata(key: string, value: unknown): void {
    if (!this.context.metadata) {
      this.context.metadata = {}
    }
    // eslint-disable-next-line security/detect-object-injection
    this.context.metadata[key] = value // key validated via internal metadata API
  }

  /**
   * Obtiene metadata
   */
  getMetadata<T>(key: string): T | undefined {
    // eslint-disable-next-line security/detect-object-injection
    return this.context.metadata?.[key] as T | undefined // key validated via internal metadata API
  }
}

// ============================================
// GLOBAL ORCHESTRATOR INSTANCE
// ============================================

let globalOrchestrator: EnterpriseTestOrchestrator | null = null

/**
 * Obtiene o crea el orquestador global
 */
export function getOrchestrator(config?: OrchestratorConfig): EnterpriseTestOrchestrator {
  if (!globalOrchestrator) {
    globalOrchestrator = new EnterpriseTestOrchestrator(config)
  }
  return globalOrchestrator
}

/**
 * Resetea el orquestador global
 */
export function resetOrchestrator(): void {
  if (globalOrchestrator) {
    globalOrchestrator.reset()
    globalOrchestrator = null
  }
}

// ============================================
// VITEST HOOKS INTEGRATION
// ============================================

/**
 * Setup hook para vitest
 */
export function setupTestOrchestrator(config?: OrchestratorConfig): void {
  const orchestrator = getOrchestrator(config)

  beforeEach(async () => {
    await orchestrator.setup()
  })

  afterEach(async () => {
    await orchestrator.teardown()
  })
}

