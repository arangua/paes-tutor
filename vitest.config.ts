import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'node:path'
import os from 'os'
import * as dotenv from 'dotenv'

// Cargar .env.test para tests (sin afectar producción)
dotenv.config({ path: '.env.test' })

// Normaliza separadores Windows -> POSIX para comparar estable
function normalizeId(id: string) {
  return id.replace(/\\/g, '/')
}

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

// Plugin para excluir tests de DB del mock de Prisma
function prismaMockExclusionPlugin() {
  return {
    name: 'prisma-mock-exclusion',
    enforce: 'pre' as const,
    resolveId(source: string, importer?: string) {
      // Excluir tests de base de datos del mock de @prisma/client
      // Devolver la ruta real del módulo en node_modules
      if (source === '@prisma/client' && importer?.includes('study-note-versioning.test.ts')) {
        // Devolver la ruta real del módulo para que Vite lo resuelva sin alias
        return path.resolve(process.cwd(), 'node_modules/@prisma/client/index.js')
      }
      return null
    },
  }
}

// Plugin para interceptar next/server antes de que next-auth lo importe
function nextServerMockPlugin() {
  return {
    name: 'next-server-mock',
    enforce: 'pre' as const,

    resolveId(source: string, _importer?: string) {
      // Normalizar también URLs file://
      let s = normalizeId(source)
      if (s.startsWith('file:///')) {
        s = s.replace('file:///', '')
      } else if (s.startsWith('file://')) {
        s = s.replace('file://', '')
      }

      // 1) Imports directos
      if (s === 'next/server' || s === 'next/server.js' || s === 'next/server.mjs') {
        return { id: '\0virtual:next-server', external: false }
      }

      // 2) Resoluciones absolutas a node_modules/next/server...
      // Ej: C:/.../node_modules/next/server.js  o  .../node_modules/next/server
      // También captura cuando next-auth importa desde node_modules/next/server
      if (s.includes('node_modules/next/server') || (s.includes('/next/server') && !s.includes('.stryker-tmp'))) {
        return { id: '\0virtual:next-server', external: false }
      }

      // 3) Algunos resolvers entregan .../next/server (sin .js) pero sin node_modules en el string
      // Captura conservadora: (*/next/server(.js|.mjs)?) solo si parece path absoluto
      if ((s.startsWith('/') || /^[a-zA-Z]:\//.test(s)) && /\/next\/server(\.(js|mjs))?$/.test(s)) {
        return { id: '\0virtual:next-server', external: false }
      }

      return null
    },
    
    load(id: string) {
      if (id === '\0virtual:next-server') {
        return `export class NextRequest {}
export class NextResponse {
  static json(body, init) {
    return new Response(JSON.stringify(body), {
      status: init?.status ?? 200,
      headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
    })
  }
  static redirect(url, init) {
    return new Response(null, {
      status: init?.status ?? 307,
      headers: { location: String(url) },
    })
  }
}`
      }
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    prismaMockExclusionPlugin(), // PRIMERO: Excluir tests de DB del mock de Prisma
    nextServerMockPlugin(), // SEGUNDO: Debe estar antes de otros plugins que puedan importar next/server
    react(),
    tsconfigPaths(),
    excludeStrykerPlugin(),
  ],
  test: {
    deps: {
      optimizer: {
        client: { enabled: false },
        ssr: { enabled: false },
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts', './src/test/setup.ts'],
    // Force exit in CI to prevent hanging after coverage collection
    globalTeardown: process.env.CI
      ? ['./vitest.global-teardown.ts', './test/why-is-node-running.teardown.ts']
      : ['./test/why-is-node-running.teardown.ts'],
    // ✅ Enterprise: Asegurar que el mock de next/server se ejecute antes de cualquier import
    sequence: {
      hooks: 'stack',
    },
    css: true,
    testTimeout: 10000, // 10 segundos para tests que cargan datos
    hookTimeout: 10000, // 10 segundos para hooks
    // ✅ Para estos tests, usa entorno Node (Request/Response reales)
    environmentMatchGlobs: [
      ['**/src/app/api/notes/versions/**/*.test.ts', 'node'],
      ['**/src/lib/study-notes/**/*.test.ts', 'node'],
    ],
    // Optimizaciones para reducir carga en Cursor
    pool: 'forks', // Usar procesos separados en lugar de threads
    // poolOptions no está disponible en esta versión de Vitest
    // Reducir salida para evitar sobrecargar Cursor
    reporter: process.env.CI ? 'verbose' : 'default',
    outputFile: undefined, // No escribir archivos de salida en desarrollo
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
      provider: process.env.CI ? 'istanbul' : 'v8',
      reporter: ['lcov', 'text'],
      reportsDirectory: 'coverage',
      clean: true,
      exclude: [
        '**/*.d.ts',
        '**/*.test.*',
        '**/__tests__/**',
        '**/node_modules/**',
        '**/*.config.*',
        '**/mockData',
        '**/*.spec.*',

        // App shell general (no crítico ahora)
        'src/app/**/layout.tsx',

        // Páginas NO críticas (evita tocar dashboard)
        'src/app/help/**',
        'src/app/shared-*/**',
        'src/app/schedule/**',
        'src/app/review/**',
        'src/app/careers/**',
        'src/app/statistics/**',
        'src/app/**/study-example-page/**',

        // App API (muy grande; lo endurecemos después)
        'src/app/api/**',

        // Dashboard (lo endurecemos después)
        'src/app/dashboard/**',

        // UI kit (endurecer después)
        'src/components/ui/**',

        // Hooks no críticos por ahora (mucho 0% y bajo ROI inmediato)
        'src/hooks/**',

        // Barrels / tipos puros
        'src/**/index.ts',
        'src/**/types/**',

        // Excludes existentes del proyecto
        'node_modules/',
        'src/test/',
        '.next/',
        'coverage/',
        'dist/',
        'build/',
        'prisma/',
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        // Umbrales globales — incrementados conservadoramente desde 15%
        // NOTA: Si algún test falla por cobertura, revisar qué archivo nuevo
        // no tiene tests y añadirlos, o excluir temporalmente ese archivo.
        lines: 25,
        functions: 25,
        branches: 15,
        statements: 25,
        // Umbrales por directorio para código crítico (más estrictos)
        'src/lib/auth.ts': {
          lines: 60,
          functions: 60,
          branches: 50,
          statements: 60,
        },
        'src/lib/security.ts': {
          lines: 60,
          functions: 60,
          branches: 50,
          statements: 60,
        },
        'src/lib/encryption.ts': {
          lines: 70,
          functions: 70,
          branches: 60,
          statements: 70,
        },
        'src/lib/rate-limit.ts': {
          lines: 50,
          functions: 50,
          branches: 40,
          statements: 50,
        },
      },
    },
  },
  resolve: {
    alias: [
      // ✅ Alias de next-auth - deben estar ANTES de otros alias para evitar que entre a node_modules/next-auth
      {
        find: /^next-auth$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/next-auth.ts'),
      },
      {
        find: /^next-auth\/jwt$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/next-auth-jwt.ts'),
      },
      {
        find: /^next-auth\/react$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/next-auth-react.ts'),
      },
      {
        find: /^next-auth\/providers\/credentials$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/next-auth-providers-credentials.ts'),
      },
      {
        find: /^next\/server$/,
        replacement: path.resolve(process.cwd(), 'src/test/mocks/next-server.ts'),
      },
      // @prisma/client alias - COMENTADO para permitir tests de DB con cliente real
      // Descomentar para otros tests que necesiten el mock
      // {
      //   find: /^@prisma\/client$/,
      //   replacement: path.resolve(process.cwd(), 'src/test/mocks/prisma-client.ts'),
      // },
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
    exclude: ['openai', '@google/generative-ai', 'next/server'],
  },
  ssr: {
    noExternal: ['@anthropic-ai/sdk', 'next/server'],
  },
})
