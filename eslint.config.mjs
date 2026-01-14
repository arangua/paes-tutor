import js from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import globals from "globals";
// Nota: Las reglas personalizadas están en eslint-rules/custom-validation-rules.js
// Requieren plugin ESLint personalizado para activarse (ver documentación)

// ✅ Enterprise: Detectar si estamos en modo crítico (usado por lint:critical)
// En modo crítico, solo se aplican reglas que bloquean issues realmente críticos
// Reglas que requieren refactorización masiva se desactivan para no bloquear CI
const isCriticalMode = process.env.ESLINT_CRITICAL_MODE === 'true';

// ✅ Enterprise: Reglas críticas que SIEMPRE bloquean (incluso en modo crítico)
const criticalRules = {
  // Variables no definidas - crítico para evitar runtime errors
  "no-undef": "error",
  // Código inalcanzable - crítico para detectar bugs
  "no-unreachable": "error",
  // Variables no usadas - crítico para mantener código limpio
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_",
    },
  ],
  // Console.log en producción - crítico para evitar leaks
  "no-console": [
    "error",
    {
      allow: ["warn", "error"],
    },
  ],
  // Debugger en producción - crítico
  "no-debugger": "error",
  // React hooks - crítico para evitar bugs
  ...reactHooks.configs.recommended.rules,
  // ✅ Enterprise: no-require-imports desactivado en modo crítico
  // Requiere refactorización masiva y puede ser necesario en algunos casos
  "@typescript-eslint/no-require-imports": isCriticalMode ? "off" : "error",
};

// ✅ Enterprise: Reglas de seguridad accionables (solo en modo crítico)
// Estas reglas detectan vulnerabilidades reales sin falsos positivos masivos
const criticalSecurityRules = isCriticalMode ? {
  // Detectar eval() - crítico de seguridad
  "no-eval": "error",
  // Detectar Function() constructor - crítico de seguridad
  "no-implied-eval": "error",
  // Detectar new Function() - crítico de seguridad
  "no-new-func": "error",
} : {};

// ✅ Enterprise: Reglas de SonarJS que NO bloquean en modo crítico
// Estas requieren refactorización masiva y se documentan en full audit
const sonarjsRulesForMode = isCriticalMode ? {
  // Desactivar complejidad cognitiva - requiere refactorización masiva
  "sonarjs/cognitive-complexity": "off",
  // Desactivar funciones anidadas - requiere refactorización masiva
  "sonarjs/no-nested-functions": "off",
  // Desactivar condicionales anidadas - requiere refactorización masiva
  "sonarjs/no-nested-conditional": "off",
  // Desactivar ramas duplicadas - puede tener falsos positivos
  "sonarjs/no-all-duplicated-branches": "off",
  // Desactivar expresiones idénticas - puede tener falsos positivos
  "sonarjs/no-identical-expressions": "off",
  // Desactivar dead store - puede tener falsos positivos
  "sonarjs/no-dead-store": "off",
  // Mantener reglas críticas de SonarJS
  "sonarjs/no-unused-vars": "error",
  "sonarjs/unused-import": "error",
} : sonarjs.configs.recommended.rules;

export default [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      ".stryker-tmp/**",
      "stryker.conf.mjs",
      ".migration-backups/**",
      "migration-report*.json",
      "playwright-report/**",
      "test-results/**",
      "coverage/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Configuración para archivos TypeScript (con type-checking)
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.es2022,
        // Variables globales adicionales de Node.js
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
        // Variables globales del navegador
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
        File: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin,
      security,
      sonarjs,
      // Nota: Plugin personalizado requiere setup adicional
      // "custom-validation": customRules,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...criticalRules,
      ...criticalSecurityRules,
      ...sonarjsRulesForMode,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // ✅ Enterprise: no-explicit-any solo en modo full audit
      // En modo crítico, esto se desactiva para evitar bloquear CI por deuda técnica
      // Ver docs/LINT_ENTERPRISE_POLICY.md para plan de reducción
      "@typescript-eslint/no-explicit-any": isCriticalMode ? "off" : "error",
      "no-undef": "off", // TypeScript maneja esto a través de typescript-eslint
      // Desactivar reglas que requieren type-checking estricto (pueden causar errores de parsing)
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      // Optimizaciones de performance (desactivadas porque requieren type-checking)
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "off",
      // ✅ Enterprise: Reglas de seguridad adicionales (solo en full audit)
      // Estas pueden tener falsos positivos y se documentan en full audit
      ...(isCriticalMode ? {} : {
        ...security.configs.recommended.rules,
      }),
      // Reglas personalizadas para validaciones
      // Nota: Requieren plugin ESLint personalizado (ver eslint-rules/custom-validation-rules.js)
      // "custom-validation/no-unsafe-math-round": "error",
      // "custom-validation/no-unsafe-array-length-division": "error",
      // "custom-validation/no-unsafe-spread-math": "error",
      // "custom-validation/no-unsafe-toisostring": "warn",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Configuración para archivos JavaScript puros (sin type-checking)
  {
    files: ["**/*.{js,jsx,mjs}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // NO usar project para archivos JS puros
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
        ...globals.es2022,
        // Variables globales adicionales de Node.js
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
        // Variables globales del navegador
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
        File: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "@typescript-eslint": tseslint.plugin,
      security,
      sonarjs,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...criticalRules,
      ...criticalSecurityRules,
      ...sonarjsRulesForMode,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      // ✅ Enterprise: no-explicit-any solo en modo full audit
      "@typescript-eslint/no-explicit-any": isCriticalMode ? "off" : "error",
      "no-undef": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },
  // Configuración específica para archivos de configuración TypeScript (Node.js)
  {
    files: ["*.config.ts", "*.config.*.ts", "vitest.config.ts", "sentry.client.config.ts", "sentry.server.config.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: false,
        project: ["./tsconfig.tools.json"],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
      },
    },
  },
  // Configuración específica para archivos de configuración JavaScript (Node.js)
  {
    files: ["*.config.{js,mjs}", "*.config.*.{js,mjs}", "stryker.conf.mjs", ".strykerrc.mjs"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        // NO usar project para archivos .js/.mjs
      },
      globals: {
        ...globals.node,
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
      },
    },
  },
  // ✅ Enterprise: Configuración para scripts y tooling Node.js
  // Permite console, require, comandos OS y reduce sensibilidad de SonarJS en tooling
  {
    files: ["scripts/**/*.{ts,tsx,js,mjs,cjs}", "next.config.ts", "proxy.ts", "sentry*.ts", "*.config.{ts,js,mjs}"],
    rules: {
      // Console permitido en scripts y tooling (esperado en scripts de Node)
      "no-console": "off",
      // Require permitido en scripts (común en scripts Node.js)
      "@typescript-eslint/no-require-imports": "off",
      // Comandos OS permitidos en scripts (scripts ejecutan comandos del sistema)
      "sonarjs/os-command": "off",
      "sonarjs/no-os-command-from-path": "off",
      // Complejidad y regex: scripts de tooling pueden ser complejos
      "sonarjs/cognitive-complexity": "off",
      "sonarjs/slow-regex": "off",
      // TODO tags: warning en lugar de error (scripts pueden tener TODOs)
      "sonarjs/todo-tag": "warn",
      // Mantener errores reales (unused vars, ignored exceptions siguen siendo errores)
    },
  },
  // Configuración para archivos de test
  {
    files: ["**/*.test.{js,jsx,ts,tsx}", "**/*.spec.{js,jsx,ts,tsx}", "src/test/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
        URL: "readonly",
        fetch: "readonly",
        AbortSignal: "readonly",
        File: "readonly",
        document: "readonly",
        window: "readonly",
      },
    },
  },
  // Configuración específica para tests E2E con Playwright
  {
    files: ["e2e/**/*.{ts,tsx}", "playwright.config.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: false,
        project: ["./tsconfig.e2e.json"],
        tsconfigRootDir: process.cwd(),
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        process: "readonly",
        Buffer: "readonly",
        require: "readonly",
        URL: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      // ✅ Enterprise: Desactivar reglas de SonarJS que son ruido en tests E2E
      // Estas reglas detectan "hardcoded passwords" y "pseudo-random" en datos de test,
      // lo cual es esperado y correcto en el contexto de tests E2E
      "sonarjs/no-hardcoded-passwords": "off",
      "sonarjs/pseudo-random": "off",
      // Desactivar complejidad cognitiva en tests (tests pueden ser complejos por naturaleza)
      "sonarjs/cognitive-complexity": "off",
      // Desactivar reglas de React hooks en E2E (no usamos React hooks aquí)
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      // ✅ Enterprise: Reglas adicionales para e2e (testing sandbox)
      // Console permitido en tests (debugging, logging de resultados)
      "no-console": "off",
      // Ignored exceptions permitidas en tests (pueden ser intencionales para validar errores)
      "sonarjs/no-ignored-exceptions": "off",
      // Expresiones idénticas permitidas en tests (pueden ser necesarias para validaciones)
      "sonarjs/no-identical-expressions": "off",
      // Regex lentos permitidos en tests (pueden ser necesarios para validar patrones)
      "sonarjs/slow-regex": "off",
      // Any permitido en tests (flexibilidad para mocks y datos de test)
      "@typescript-eslint/no-explicit-any": "off",
      // Prefer-regexp-exec no aplica en tests (pueden usar .match() directamente)
      "sonarjs/prefer-regexp-exec": "off",
      // Useless escape permitido en tests (puede ser necesario para validar patrones)
      "no-useless-escape": "off",
      // Unused vars permitidas en tests (pueden ser parámetros de callbacks no usados)
      "@typescript-eslint/no-unused-vars": "off",
      // Non-literal regex permitido en tests (puede ser necesario para validar patrones dinámicos)
      "security/detect-non-literal-regexp": "off",
    },
  },
  // ✅ Enterprise: Configuración para scripts y tooling Node.js
  // Scripts y archivos de configuración pueden usar console, require, comandos OS, etc.
  {
    files: ["scripts/**/*.{ts,tsx,js,mjs,cjs}", "next.config.ts", "proxy.ts", "sentry*.ts", "*.config.{ts,js,mjs}"],
    rules: {
      // Permitir console en scripts y tooling (es esperado para logging/debugging)
      "no-console": "off",
      // Permitir require() en scripts Node.js (común en tooling)
      "@typescript-eslint/no-require-imports": "off",
      // Permitir comandos OS en scripts (scripts ejecutan comandos del sistema)
      "sonarjs/os-command": "off",
      "sonarjs/no-os-command-from-path": "off",
      // Desactivar complejidad cognitiva en scripts (scripts pueden ser complejos)
      "sonarjs/cognitive-complexity": "off",
      // Desactivar regex lentos en scripts (tooling puede usar regex complejos)
      "sonarjs/slow-regex": "off",
      // Desactivar prefer-regexp-exec en scripts (scripts pueden usar .match() directamente)
      "sonarjs/prefer-regexp-exec": "off",
      // Desactivar regex complexity en scripts (tooling puede tener regex complejos)
      "sonarjs/regex-complexity": "off",
      // Desactivar concise-regex en scripts (legibilidad puede ser más importante)
      "sonarjs/concise-regex": "off",
      // Desactivar hardcoded passwords en scripts (scripts de tooling pueden tener credenciales de test)
      "sonarjs/no-hardcoded-passwords": "off",
      // Desactivar no-gratuitous-expressions en scripts (puede ser necesario para debugging)
      "sonarjs/no-gratuitous-expressions": "off",
      // Desactivar duplicates-in-character-class en scripts (puede ser intencional)
      "sonarjs/duplicates-in-character-class": "off",
      // Desactivar block-scoped-var en scripts (legacy code puede usar var)
      "sonarjs/block-scoped-var": "off",
      // Permitir no-var en scripts (pero mantenerlo como warning, no error)
      "no-var": "warn",
      // Permitir no-useless-escape en scripts (puede ser necesario para compatibilidad)
      "no-useless-escape": "warn",
      // TODO tags como warning (no error) en scripts
      "sonarjs/todo-tag": "warn",
      // Mantener errores reales activos
      // "@typescript-eslint/no-unused-vars": "error", // Se mantiene del bloque principal
      // "sonarjs/no-ignored-exceptions": "error", // Se mantiene del bloque principal
    },
  },
  // ✅ Enterprise: Override específico para prisma/seed.ts (script CLI standalone)
  // Seed scripts son tooling de desarrollo que se ejecutan manualmente o en CI
  // No se importan en runtime, por lo que console.log, Math.random y complejidad son aceptables
  {
    files: ["prisma/seed.ts"],
    rules: {
      "no-console": "off",
      "sonarjs/pseudo-random": "off",
      "sonarjs/cognitive-complexity": "off",
      "security/detect-object-injection": "off",
    },
  },
];
