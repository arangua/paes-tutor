# Guía de Testing

## Comandos Disponibles

### Ejecutar Tests

```bash
# Modo watch (se ejecuta automáticamente al cambiar archivos)
npm test

# Ejecutar tests una vez
npm run test:run

# Ejecutar tests con UI interactiva
npm run test:ui
```

### Cobertura de Código

```bash
# Generar reporte de cobertura
npm run test:coverage

# Cobertura con UI interactiva
npm run test:coverage:ui
```

## Reportes de Cobertura

Después de ejecutar `npm run test:coverage`, se generan los siguientes reportes:

- **HTML**: `coverage/index.html` - Abre en el navegador para ver reporte visual
- **JSON**: `coverage/coverage-final.json` - Para integración con CI/CD
- **LCOV**: `coverage/lcov.info` - Para herramientas como Codecov
- **Texto**: Se muestra en la consola

## Umbrales de Cobertura

### Umbrales Globales

- **Líneas**: 55%
- **Funciones**: 40%
- **Ramas**: 50%
- **Statements**: 55%

### Umbrales por Categoría

#### API Routes (`src/app/api/**/*.ts`)

- **Líneas**: 75%
- **Funciones**: 75%
- **Ramas**: 70%
- **Statements**: 75%

#### Dashboard (`src/app/dashboard/**/*.tsx`)

- **Líneas**: 80%
- **Funciones**: 80%
- **Ramas**: 70%
- **Statements**: 80%

## Estado Actual de Cobertura

### Cobertura por Módulo

- ✅ **API Routes**: Excelente cobertura (75-100%)
  - `/api/student`: 100%
  - `/api/exams`: 100%
  - `/api/metrics`: 88.88%
  - `/api/attempts`: 75%

- ✅ **Dashboard**: Excelente cobertura (92.3%)

- ⚠️ **Componentes UI**: Baja cobertura (26.66%)
  - Muchos componentes no están siendo usados aún
  - Se cubrirán cuando se implementen nuevas funcionalidades

- ⚠️ **Layout/Pages**: Sin cobertura
  - `layout.tsx` y `page.tsx` son componentes simples
  - Se pueden agregar tests cuando sea necesario

## Mejorar la Cobertura

### Prioridades

1. **Alta Prioridad**: Código crítico (API routes, Dashboard)
2. **Media Prioridad**: Componentes UI que se usan activamente
3. **Baja Prioridad**: Componentes UI no utilizados, utilidades simples

### Cómo Agregar Tests

1. Crear archivo `*.test.ts` o `*.test.tsx` junto al archivo a testear
2. Importar las funciones/componentes a testear
3. Usar `describe` y `it` para organizar los tests
4. Ejecutar `npm test` para verificar

### Ejemplo

```typescript
import { describe, it, expect } from 'vitest'
import { GET } from './route'

describe('GET /api/example', () => {
  it('debe retornar datos correctamente', async () => {
    const response = await GET()
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toBeDefined()
  })
})
```

## Ver Reporte HTML

1. Ejecutar `npm run test:coverage`
2. Abrir `coverage/index.html` en el navegador
3. Navegar por los archivos para ver líneas cubiertas/no cubiertas

## Integración Continua

Los umbrales de cobertura están configurados para fallar si no se cumplen. Esto es útil para:

- Prevenir merge de código sin tests
- Mantener calidad del código
- Identificar áreas que necesitan más tests

## Notas

- Los componentes UI de shadcn/ui no necesitan tests exhaustivos (son componentes de terceros)
- El archivo `prisma.ts` no necesita tests (es configuración)
- Los archivos de configuración están excluidos de la cobertura
