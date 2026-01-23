# ✅ Correcciones de Accesibilidad en Formularios

## 🔧 Problemas Corregidos

### 1. Campos de Formulario sin `id` o `name`

**Problema:** Algunos campos de formulario no tenían atributos `id` o `name`, lo que puede prevenir el autocompletado del navegador.

**Solución Aplicada:**

1. **Componente `Input` mejorado** (`src/components/ui/input.tsx`):
   - Ahora garantiza que siempre haya un `id` o `name`
   - Si no se proporciona `id`, usa `name` como `id` o genera uno automático
   - Si no se proporciona `name`, usa `id` como `name` si está disponible
   - Genera un `id` automático usando `React.useId()` si no se proporciona ninguno

2. **Formulario de Sign In** (`src/app/auth/signin/page.tsx`):
   - Agregado `name="email"` al campo de email
   - Agregado `name="password"` al campo de password
   - Agregado `autoComplete="email"` y `autoComplete="current-password"` para mejor autocompletado

### 2. Evento `unload` Deprecado

**Problema:** El warning sobre `unload` viene de una dependencia externa (`platformicons`), no de nuestro código.

**Estado:**
- ✅ Nuestro código usa `beforeunload` (correcto, no deprecado)
- ⚠️ El warning viene de `vendors-node_modules_pnpm_platformicons_8_0_9_react_19_2_3_node_modules_platformicons_svg_HTM-d826f…:19`
- Este es un problema de la dependencia externa, no de nuestro código

**Recomendación:**
- Si el warning persiste, considera actualizar o reemplazar la dependencia `platformicons`
- O contactar al mantenedor de la dependencia para corregir el uso de `unload`

## 📋 Cambios Realizados

### Archivo: `src/components/ui/textarea.tsx`

```typescript
// Antes: No garantizaba id o name
<textarea
  data-slot="textarea"
  {...props}
/>

// Después: Garantiza id o name
const autoId = React.useId()
const finalId = id || (name ? name : autoId)
const finalName = name || (id ? id : undefined)

<textarea
  data-slot="textarea"
  id={finalId}
  name={finalName}
  {...props}
/>
```

### Archivo: `src/components/ui/input.tsx`

```typescript
// Antes: No garantizaba id o name
<input
  type={type}
  {...props}
/>

// Después: Garantiza id o name
const autoId = React.useId()
const finalId = id || (name ? name : autoId)
const finalName = name || (id ? id : undefined)

<input
  type={type}
  id={finalId}
  name={finalName}
  {...props}
/>
```

### Archivo: `src/app/auth/signin/page.tsx`

```typescript
// Antes: Solo tenía id
<input
  id="email"
  type="email"
  ...
/>

// Después: Tiene id y name, más autoComplete
<input
  id="email"
  name="email"
  type="email"
  autoComplete="email"
  ...
/>
```

## ✅ Beneficios

1. **Mejor Autocompletado:** Los navegadores pueden autocompletar formularios correctamente
2. **Mejor Accesibilidad:** Los lectores de pantalla pueden identificar campos correctamente
3. **Mejor UX:** Los usuarios pueden usar gestores de contraseñas sin problemas
4. **Cumplimiento:** Cumple con las mejores prácticas de HTML5 y accesibilidad web

## 🔍 Verificación

Para verificar que los cambios funcionan:

1. Abre el formulario de sign in
2. Abre las herramientas de desarrollo (F12)
3. Inspecciona los campos de formulario
4. Verifica que tengan atributos `id` y `name`
5. Prueba el autocompletado del navegador

## 📝 Notas

- El componente `Input` ahora es más robusto y siempre garantiza accesibilidad
- Los formularios existentes que usan `Input` se beneficiarán automáticamente
- Si un formulario necesita un `id` o `name` específico, puede proporcionarlo como prop

### Archivos de Admin con Campos de Archivo

Se agregaron atributos `name` explícitos a los campos de tipo `file`:

- `src/app/admin/import-exams/page.tsx` - Campo `pdfFile-${index}`
- `src/app/admin/import-topics/page.tsx` - Campos `pdfFile` y `csvFile`
- `src/app/admin/import-answer-key/page.tsx` - Campo `pdfFile`

## ⚠️ Nota sobre el Warning de `unload`

El warning sobre el evento `unload` deprecado **NO viene de nuestro código**, sino de una dependencia externa:

- **Dependencia:** `platformicons` (versión 8.0.9)
- **Archivo:** `vendors-node_modules_pnpm_platformicons_8_0_9_react_19_2_3_node_modules_platformicons_svg_HTM-d826f…:19`
- **Estado:** Este es un problema de la dependencia externa, no de nuestro código

**Nuestro código usa `beforeunload`** (correcto, no deprecado) en:
- `src/app/exams/[id]/take/page.tsx` - Para prevenir navegación accidental durante exámenes

**Recomendaciones:**
1. Actualizar la dependencia `platformicons` a la última versión
2. O contactar al mantenedor de la dependencia para corregir el uso de `unload`
3. O considerar reemplazar la dependencia si no se corrige

---

**Última actualización:** 2026-01-10
