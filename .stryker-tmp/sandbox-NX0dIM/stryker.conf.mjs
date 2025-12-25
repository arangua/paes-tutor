/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
// @ts-nocheck

export default {
  packageManager: 'npm',
  reporters: ['html', 'clear-text', 'progress'],
  testRunner: 'vitest',
  testRunnerNodeOptions: {
    execArgv: [],
  },
  // checkers: ['typescript'], // Deshabilitado temporalmente para permitir ejecución con errores de TS
  // tsconfigFile: 'tsconfig.json',
  mutate: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/*.spec.{ts,tsx}',
    '!src/test/**',
    '!src/**/*.d.ts',
    '!src/**/*.config.*',
    '!src/**/mockData/**',
  ],
  coverageAnalysis: 'perTest',
  timeoutMS: 60000,
  dryRunTimeoutMS: 60000,
  concurrency: 1, // Reducir para máxima profundidad
  // Máxima profundidad lógica: no excluir ningún tipo de mutación
  mutator: {
    excludedMutations: [], // Habilitar TODOS los tipos de mutación
  },
  // Configuración para máxima profundidad
  logLevel: 'info',
  // Configuración de Vitest
  vitest: {
    configFile: 'vitest.config.ts',
  },
  // Thresholds para asegurar calidad
  thresholds: {
    high: 80,
    low: 70,
    break: 70,
  },
  // Configuración de plugins
  plugins: [
    '@stryker-mutator/vitest-runner',
    // '@stryker-mutator/typescript-checker', // Deshabilitado temporalmente
  ],
  // Configuración adicional para explorar todas las variaciones
  disableTypeChecks: true, // Deshabilitado para máxima profundidad lógica
  ignorePatterns: [
    'node_modules',
    '.next',
    'dist',
    'coverage',
    'playwright-report',
    'test-results',
    '**/AppData/**',
    '**/ElevatedDiagnostics/**',
  ],
  // Limitar el scope de búsqueda al directorio del proyecto
  tempDirName: '.stryker-tmp',
}

