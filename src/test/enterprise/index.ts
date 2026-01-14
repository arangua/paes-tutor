/**
 * Enterprise Test Framework - Entry Point
 * 
 * Exporta todas las utilidades enterprise de testing
 * 
 * @module enterprise-testing
 * @version 3.0.0
 * @enterprise
 */

// Framework principal
export {
  EnterpriseRequestBuilder,
  EnterpriseResponseValidator,
  EnterpriseRequestFactory,
  request,
  validator,
  createEnterpriseTestRequest,
  assertEnterpriseResponse,
  assertEnterpriseError,
  type EnterpriseRequestConfig,
  type EnterpriseValidationConfig,
  type EnterpriseTestResult,
} from './premium-test-framework'

// Generadores de datos
export {
  EnterpriseDataGenerator,
  CUIDGenerator,
  UserGenerator,
  StudentGenerator,
  StudyNoteGenerator,
  StudyNoteVersionGenerator,
  createTestUser,
  createTestStudent,
  createTestNote,
  createTestVersion,
  TestDataSchemas,
  validateTestData,
} from './test-data-generators'

// Factory de mocks
export {
  EnterpriseMockBuilder,
  PrismaMockFactory,
  mock,
  createMock,
  createAsyncMock,
  createErrorMock,
  type MockConfig,
  type MockTimingConfig,
  type MockErrorConfig,
} from './mock-factory'

// Test Orchestrator
export {
  EnterpriseTestOrchestrator,
  getOrchestrator,
  resetOrchestrator,
  setupTestOrchestrator,
  type TestContext,
  type OrchestratorConfig,
} from './test-orchestrator'

// Test Analytics
export {
  EnterpriseTestAnalytics,
  getAnalytics,
  resetAnalytics,
  type TestMetrics,
  type TestSuiteMetrics,
  type AnalyticsConfig,
} from './test-analytics'

// Security Helpers
export {
  SecurityPayloads,
  containsSQLInjection,
  containsXSS,
  containsPathTraversal,
  containsCommandInjection,
  validateSecurity,
  secureStringSchema,
  secureEmailSchema,
  testSecurityEndpoint,
  validateSecurityHeaders,
  type SecurityTestConfig,
  type SecurityTestResult,
} from './security-helpers'

// Performance Helpers
export {
  benchmark,
  loadTest,
  profileMemory,
  compareMemory,
  assertPerformance,
  assertThroughput,
  type PerformanceBenchmark,
  type LoadTestConfig,
  type LoadTestResult,
} from './performance-helpers'

