# 🔍 Diagnóstico del Problema de jsdom

## 📊 Situación Actual

### ✅ Tests que Funcionan

- `src/app/api/exams/route.test.ts` - **4/4 tests pasando** ✅
- Tests de APIs (no requieren jsdom)

### ❌ Tests que Fallan

- `src/app/dashboard/page.test.tsx` - Error: `document is not defined`
- `src/components/ErrorBoundary.test.tsx` - Error: `document is not defined`
- Todos los tests de componentes React que usan `render()` de `@testing-library/react`

## 🔴 Error Principal

```
ReferenceError: document is not defined
 ❯ Proxy.render node_modules/@testing-library/react/dist/pure.js:256:5
```

## 🔍 Causa Probable

**jsdom no se está inicializando correctamente** antes de que los tests intenten usar `document` o `window`.

## ✅ Soluciones Intentadas

### 1. Anotación `@vitest-environment jsdom`

- ✅ Agregada en `src/app/dashboard/page.test.tsx`
- ✅ Agregada en `src/components/ErrorBoundary.test.tsx`
- ❌ **No resolvió el problema**

### 2. Configuración en `vitest.config.ts`

- ✅ `environment: 'jsdom'` está configurado
- ✅ `setupFiles: ['./src/test/setup.ts']` está configurado
- ❌ **No es suficiente**

### 3. Setup de `localStorage` y `window`

- ✅ Agregado mock de `localStorage` en `src/test/setup.ts`
- ✅ Agregado mock de `window.location` en `src/test/setup.ts`
- ❌ **No resuelve el problema de `document`**

### 4. Mocks de Componentes UI

- ✅ Agregados mocks globales en `src/test/setup.ts`
- ✅ Agregados mocks específicos en tests individuales
- ⚠️ **Resuelve errores de importación, pero no el problema de jsdom**

### 5. Verificación de Versiones

- ✅ `jsdom: ^27.3.0` instalado
- ✅ `vitest: ^4.0.16` instalado
- ⚠️ **Versiones correctas, pero problema persiste**

## 🎯 Posibles Causas Raíz

### 1. Problema de Inicialización de jsdom en Vitest

**Síntoma:** jsdom no se inicializa antes de que los tests se ejecuten.

**Posible causa:**

- Vitest podría estar ejecutando los tests antes de que jsdom esté listo
- Podría haber un problema con el orden de ejecución de `setupFiles`

### 2. Problema Específico de Windows/PowerShell

**Síntoma:** Los comandos se cuelgan o fallan.

**Posible causa:**

- Problema con rutas de Windows (espacios en "OneDrive/Escritorio/PROY. PAES")
- Problema con cómo PowerShell ejecuta los comandos
- Problema con la codificación de caracteres

### 3. Problema con la Configuración de Vite/Vitest

**Síntoma:** Los alias `@/` no se resuelven correctamente.

**Posible causa:**

- La configuración de `resolve.alias` en `vitest.config.ts` podría no estar funcionando correctamente
- Podría haber un conflicto con la configuración de Next.js

## 🔧 Soluciones a Probar

### Solución 1: Verificar Instalación de jsdom

```bash
npm install --save-dev jsdom@latest
```

### Solución 2: Actualizar Vitest

```bash
npm install --save-dev vitest@latest
```

### Solución 3: Agregar Inicialización Explícita de jsdom

En `src/test/setup.ts`, agregar al inicio:

```typescript
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost:3000',
  pretendToBeVisual: true,
})

global.window = dom.window as any
global.document = dom.window.document
global.navigator = dom.window.navigator as any
```

### Solución 4: Usar `happy-dom` en lugar de jsdom

```bash
npm install --save-dev happy-dom
```

Y cambiar en `vitest.config.ts`:

```typescript
test: {
  environment: 'happy-dom', // en lugar de 'jsdom'
}
```

### Solución 5: Ejecutar Tests en Modo Aislado

```bash
npx vitest run --isolate --reporter=verbose
```

### Solución 6: Verificar Configuración de TypeScript

Asegurar que `tsconfig.json` tenga:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

## 📝 Próximos Pasos Recomendados

1. **Probar happy-dom** (Solución 4) - Es más ligero y a veces funciona mejor en Windows
2. **Verificar si el problema es específico de Windows** - Probar en Linux/Mac si es posible
3. **Simplificar el test** - Crear un test mínimo para aislar el problema
4. **Revisar issues de Vitest** - Buscar problemas similares en GitHub

## 🎯 Estado Actual

- ✅ **Tests de API funcionan correctamente**
- ❌ **Tests de componentes React fallan por problema de jsdom**
- ⚠️ **Comandos de terminal se cuelgan al ejecutar tests de componentes**

## 💡 Recomendación Inmediata

**Probar happy-dom** como alternativa a jsdom. Es más rápido, más ligero, y a menudo funciona mejor en entornos Windows.

---

**Fecha:** 2025-01-28  
**Estado:** 🔴 **Problema sin resolver - Requiere más investigación**
