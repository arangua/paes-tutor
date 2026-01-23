// @ts-nocheck
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // Probar happy-dom como alternativa a jsdom (mejor soporte en Windows)
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    testTimeout: 10000, // 10 segundos para tests que cargan datos
    hookTimeout: 10000, // 10 segundos para hooks
    exclude: ['node_modules', 'dist', '.next', 'e2e', '**/*.e2e.*', '**/e2e/**'],
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
    ],
  },
  optimizeDeps: {
    exclude: ['openai', '@google/generative-ai'],
  },
  ssr: {
    noExternal: ['@anthropic-ai/sdk'],
  },
})
