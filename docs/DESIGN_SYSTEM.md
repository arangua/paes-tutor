# 🎨 Sistema de Diseño - PAES Tutor

**Versión:** 1.0.0  
**Última actualización:** 2025-01-28  
**Basado en:** Nielsen Heuristics, shadcn/ui, Radix UI

---

## 📋 Tabla de Contenidos

1. [Principios de Diseño](#principios-de-diseño)
2. [Tokens de Diseño](#tokens-de-diseño)
3. [Componentes UI](#componentes-ui)
4. [Patrones de Uso](#patrones-de-uso)
5. [Guía de Consistencia](#guía-de-consistencia)
6. [Accesibilidad](#accesibilidad)

---

## 🎯 Principios de Diseño

### Basado en Nielsen Heuristics

1. **Visibilidad del Estado del Sistema** (#1)
   - Feedback inmediato en todas las acciones
   - Indicadores de progreso granulares
   - Estados de conexión visibles

2. **Correspondencia con el Mundo Real** (#2)
   - Lenguaje natural y familiar
   - Iconografía contextual
   - Metáforas reconocibles

3. **Control y Libertad del Usuario** (#3)
   - Undo/Redo global
   - Salidas claras
   - Historial de acciones

4. **Consistencia y Estándares** (#4)
   - Componentes reutilizables
   - Patrones consistentes
   - Nomenclatura uniforme

5. **Prevención de Errores** (#5)
   - Validación en tiempo real
   - Confirmaciones para acciones destructivas
   - Mensajes de error claros

6. **Reconocimiento en lugar de Recuerdo** (#6)
   - Sugerencias visibles
   - Autocompletado inteligente
   - Historial de búsquedas

7. **Flexibilidad y Eficiencia** (#7)
   - Atajos de teclado
   - Modo experto
   - Acciones rápidas

8. **Diseño Estético y Minimalista** (#8)
   - Interfaz limpia
   - Información relevante
   - Sin elementos innecesarios

9. **Ayuda a los Usuarios a Reconocer, Diagnosticar y Recuperarse de Errores** (#9)
   - Mensajes de error estructurados
   - Soluciones sugeridas
   - Historial de errores

10. **Ayuda y Documentación** (#10)
    - Tooltips informativos
    - Tutoriales interactivos
    - Documentación accesible

---

## 🎨 Tokens de Diseño

### Colores

El sistema usa variables CSS con formato OKLCH para mejor consistencia de color.

#### Colores Principales

```css
/* Primario */
--primary: oklch(0.208 0.042 265.755)
--primary-foreground: oklch(0.984 0.003 247.858)

/* Secundario */
--secondary: oklch(0.968 0.007 247.896)
--secondary-foreground: oklch(0.208 0.042 265.755)

/* Destructivo */
--destructive: oklch(0.577 0.245 27.325)

/* Acento */
--accent: oklch(0.968 0.007 247.896)
--accent-foreground: oklch(0.208 0.042 265.755)
```

#### Colores Semánticos

- **Éxito**: Verde (`text-green-600`, `bg-green-100`)
- **Advertencia**: Amarillo (`text-yellow-600`, `bg-yellow-100`)
- **Error**: Rojo (`text-red-600`, `bg-red-100`)
- **Información**: Azul (`text-blue-600`, `bg-blue-100`)

### Tipografía

```css
/* Fuentes */
--font-sans: var(--font-geist-sans)  /* Fuente principal */
--font-mono: var(--font-geist-mono)  /* Código y monospace */

/* Tamaños */
text-xs: 0.75rem    /* 12px */
text-sm: 0.875rem   /* 14px */
text-base: 1rem     /* 16px */
text-lg: 1.125rem   /* 18px */
text-xl: 1.25rem    /* 20px */
text-2xl: 1.5rem    /* 24px */
```

### Espaciado

Sistema de espaciado basado en múltiplos de 4px:

- `0`: 0px
- `1`: 4px
- `2`: 8px
- `3`: 12px
- `4`: 16px
- `6`: 24px
- `8`: 32px
- `12`: 48px
- `16`: 64px

### Bordes y Radios

```css
--radius: 0.625rem  /* 10px - Radio base */
--radius-sm: calc(var(--radius) - 4px)  /* 6px */
--radius-md: calc(var(--radius) - 2px)  /* 8px */
--radius-lg: var(--radius)              /* 10px */
--radius-xl: calc(var(--radius) + 4px) /* 14px */
```

### Sombras

- `shadow-xs`: Sombra sutil para inputs y elementos pequeños
- `shadow-sm`: Sombra estándar para cards
- `shadow-md`: Sombra para modales y dropdowns
- `shadow-lg`: Sombra para elementos elevados

---

## 🧩 Componentes UI

### Componentes Base

#### Button

**Variantes:**
- `default`: Botón principal (azul)
- `destructive`: Acciones destructivas (rojo)
- `outline`: Botón con borde
- `secondary`: Botón secundario (gris)
- `ghost`: Botón sin fondo
- `link`: Estilo de enlace

**Tamaños:**
- `sm`: 32px de altura
- `default`: 36px de altura
- `lg`: 40px de altura
- `icon`: 36px × 36px
- `icon-sm`: 32px × 32px
- `icon-lg`: 40px × 40px

**Uso:**
```tsx
<Button variant="default" size="default">
  Guardar
</Button>
```

#### Input

**Características:**
- Validación visual (borde verde/rojo)
- Iconos de estado (✓/✗)
- Placeholder descriptivo
- Auto-completado

**Uso:**
```tsx
<Input
  type="text"
  placeholder="Tu nombre"
  aria-invalid={hasError}
/>
```

#### Card

**Estructura:**
- `Card`: Contenedor principal
- `CardHeader`: Encabezado con título y descripción
- `CardTitle`: Título de la card
- `CardDescription`: Descripción opcional
- `CardContent`: Contenido principal

**Uso:**
```tsx
<Card>
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido
  </CardContent>
</Card>
```

#### Badge

**Variantes:**
- `default`: Badge estándar
- `secondary`: Badge secundario
- `destructive`: Badge de error
- `outline`: Badge con borde

**Uso:**
```tsx
<Badge variant="default">Nuevo</Badge>
```

### Componentes Avanzados

#### ErrorMessageComponent

Muestra errores estructurados con:
- Título descriptivo
- Descripción del problema
- Solución sugerida
- Acción opcional

**Uso:**
```tsx
<ErrorMessageComponent
  error={errorMessage}
  onAction={handleRetry}
/>
```

#### OperationStatus

Indicador de estado de operaciones:
- `loading`: Cargando
- `saving`: Guardando
- `completed`: Completado
- `error`: Error
- `syncing`: Sincronizando
- `processing`: Procesando

**Uso:**
```tsx
<OperationStatus
  status="saving"
  message="Guardando cambios..."
/>
```

#### SmartAutocomplete

Autocompletado inteligente con:
- Sugerencias del servidor
- Historial local
- Ranking por relevancia
- Navegación con teclado

**Uso:**
```tsx
<SmartAutocomplete
  value={query}
  onChange={setQuery}
  fetchSuggestions={fetchSuggestions}
/>
```

---

## 📐 Patrones de Uso

### Formularios

1. **Validación en Tiempo Real**
   ```tsx
   // Validar mientras el usuario escribe
   useEffect(() => {
     if (value && touched) {
       validate(value)
     }
   }, [value, touched])
   ```

2. **Feedback Visual**
   ```tsx
   <Input
     className={cn(
       error && 'border-destructive',
       !error && touched && 'border-green-500'
     )}
   />
   ```

3. **Mensajes de Error Estructurados**
   ```tsx
   const error = getErrorMessage(ERROR_CODES.VALIDATION_REQUIRED)
   <ErrorMessageComponent error={error} />
   ```

### Navegación

1. **Breadcrumbs**: Siempre mostrar ruta actual
2. **Back Button**: Botón de retroceso visible
3. **Active State**: Indicar página actual claramente

### Feedback de Usuario

1. **Toasts**: Para acciones rápidas (éxito/error)
2. **Dialogs**: Para confirmaciones importantes
3. **Progress Indicators**: Para operaciones largas
4. **Status Badges**: Para estados persistentes

### Gestión de Errores

1. **Captura**: Usar `captureError` para todos los errores
2. **Estructura**: Usar `getErrorMessage` para mensajes consistentes
3. **Historial**: Agregar a historial de errores del usuario
4. **Solución**: Siempre incluir solución sugerida

---

## ✅ Guía de Consistencia

### Nomenclatura

- **Componentes**: PascalCase (`UserForm`, `ErrorHistory`)
- **Hooks**: camelCase con prefijo `use` (`useErrorHistory`)
- **Utilidades**: camelCase (`getErrorMessage`, `extractErrorInfo`)
- **Constantes**: UPPER_SNAKE_CASE (`ERROR_CODES`)

### Estructura de Archivos

```
src/
  components/
    ui/              # Componentes base reutilizables
    dashboard/       # Componentes específicos del dashboard
    profile/         # Componentes específicos del perfil
  hooks/             # Custom hooks
  lib/               # Utilidades y helpers
  app/               # Páginas y rutas
```

### Convenciones de Código

1. **TypeScript**: Tipos explícitos, interfaces claras
2. **React**: Componentes funcionales con hooks
3. **Estilos**: Tailwind CSS con `cn()` helper
4. **Accesibilidad**: ARIA labels, roles semánticos

### Patrones de Componentes

1. **Props Interface**: Siempre definir interface de props
2. **Default Props**: Usar valores por defecto sensatos
3. **Error Handling**: Try-catch en operaciones async
4. **Loading States**: Siempre mostrar estado de carga
5. **Empty States**: Mensajes claros cuando no hay datos

---

## ♿ Accesibilidad

### Principios WCAG 2.1

1. **Perceptible**
   - Contraste mínimo 4.5:1 para texto
   - Texto alternativo para imágenes
   - Subtítulos para contenido multimedia

2. **Operable**
   - Navegación con teclado
   - Tiempo suficiente para acciones
   - Sin contenido que cause convulsiones

3. **Comprensible**
   - Lenguaje claro y simple
   - Navegación consistente
   - Ayuda para errores

4. **Robusto**
   - Código semántico HTML
   - Compatible con tecnologías asistivas
   - ARIA labels donde sea necesario

### Implementación

```tsx
// Ejemplo: Input accesible
<Input
  id="email"
  type="email"
  aria-label="Correo electrónico"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby={hasError ? "email-error" : undefined}
/>
{hasError && (
  <p id="email-error" role="alert">
    {errorMessage}
  </p>
)}
```

---

## 📚 Recursos

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Nielsen Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)

---

## 🔄 Changelog

### v1.0.0 (2025-01-28)
- Documentación inicial del sistema de diseño
- Auditoría de componentes UI
- Guía de consistencia
- Patrones de uso documentados

---

**Mantenido por:** Equipo de Desarrollo PAES Tutor  
**Última revisión:** 2025-01-28

