import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import os from 'os'

// Plugin personalizado para excluir archivos de Stryker de forma robusta
const excludeStrykerPlugin = () => ({
  name: 'exclude-stryker',
  resolveId(id: string) {
    // Excluir cualquier importación que venga de .stryker-tmp
    if (id.includes('.stryker-tmp') || id.includes('StrykerTemp')) {
      return { id: '\0virtual:stryker-excluded', external: false }
    }
    return null
  },
  load(id: string) {
    // Si es un archivo excluido, retornar módulo vacío
    if (id === '\0virtual:stryker-excluded') {
      return 'export default {}'
    }
    return null
  },
})

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    excludeStrykerPlugin(),
  ],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts', './src/test/setup.ts'],
    css: true,
    testTimeout: 10000, // 10 segundos para tests que cargan datos
    hookTimeout: 10000, // 10 segundos para hooks
    // ✅ Para estos tests, usa entorno Node (Request/Response reales)
    environmentMatchGlobs: [
      ['**/src/app/api/notes/versions/**/*.test.ts', 'node'],
    ],
    // Optimizaciones para reducir carga en Cursor
    pool: 'forks', // Usar procesos separados en lugar de threads
    // poolOptions no está disponible en esta versión de Vitest
    // Reducir salida para evitar sobrecargar Cursor
    reporter: process.env.CI ? 'verbose' : 'default',
    outputFile: process.env.CI ? undefined : undefined, // No escribir archivos de salida en desarrollo
    // Limitar workers para reducir carga del sistema
    maxWorkers: process.env.CI ? 1 : Math.max(1, Math.floor(os.cpus().length / 2)),
    minWorkers: 1,
    // Solo incluir archivos de test de Vitest en src/ y prisma/ (usamos .test.ts y .test.tsx)
    include: ['src/**/*.test.{ts,tsx}', 'prisma/**/*.test.{ts,tsx}'],
    // Excluir archivos que no deberían ejecutarse con Vitest
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'e2e',
      '**/*.e2e.*',
      '**/e2e/**',
      // Archivos temporales de Stryker - exclusión más agresiva usando múltiples patrones
      '**/.stryker-tmp/**',
      '.stryker-tmp/**',
      '**/StrykerTemp/**',
      'StrykerTemp/**',
      // Archivos de Playwright (usan .spec.ts)
      '**/*.spec.ts',
      '**/*.spec.tsx',
      // Otros proyectos - excluir paths absolutos fuera del proyecto actual
      '**/PROY. SLA/**',
      '**/PROY. PAES/**/c2-*/**',
      'dev/**',
      '**/dev/**',
      // Archivos de migración y backups
      '.migration-backups/**',
      '**/.migration-backups/**',
    ],
    server: {
      deps: {
        // ✅ Enterprise: Incluir módulos que pueden tener problemas de resolución
        inline: [
          'openai',
          '@google/generative-ai',
          // Módulos locales que pueden tener problemas de resolución
          /^@\/lib\/utils\//,
          /^@\/lib\//,
        ],
      },
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
        '**/*.test.*',
        '**/*.spec.*',
        '.next/',
        'coverage/',
        'dist/',
        'build/',
        'prisma/',
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        // Umbrales globales (más realistas para esta etapa)
        lines: 55,
        functions: 40,
        branches: 50,
        statements: 55,
        // Umbrales específicos para código crítico
        'src/app/api/**/*.ts': {
          lines: 75,
          functions: 75,
          branches: 70,
          statements: 75,
        },
        'src/app/dashboard/**/*.tsx': {
          lines: 80,
          functions: 80,
          branches: 70,
          statements: 80,
        },
      },
    },
  },
  resolve: {
    alias: [
      {
        find: '@',
        replacement: path.resolve(process.cwd(), 'src'),
      },
      {
        find: /^openai$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/openai.ts'),
      },
      {
        find: /^@google\/generative-ai$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/google-generative-ai.ts'),
      },
      {
        find: /^pdf-parse$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/pdf-parse.ts'),
      },
    ],
    // ✅ Enterprise: Mejorar resolución de módulos para evitar errores de importación
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    conditions: ['import', 'module', 'browser', 'default'],
  },
  optimizeDeps: {
    exclude: ['openai', '@google/generative-ai'],
  },
  ssr: {
    noExternal: ['@anthropic-ai/sdk'],
  },
})
