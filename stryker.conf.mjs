import path from 'path';

/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
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
  coverageAnalysis: 'all', // Cambiado de 'perTest' a 'all' para evitar problemas con Vitest
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
  // Usar una ruta absoluta sin espacios para máxima robustez en Windows
  // Esta es la solución más robusta según documentación de Stryker
  tempDirName: process.platform === 'win32' 
    ? 'C:/StrykerTemp'  // Ruta fija sin espacios en Windows
    : '.stryker-tmp',    // Ruta relativa en otros sistemas
  // Configuración para manejar rutas con espacios en Windows
  cleanTempDir: true,
}

