# 🔍 Revisión de Código - Funcionalidad de Importación

**Fecha:** 2025-01-27  
**Revisión:** Rigurosa

---

## ✅ Aspectos Positivos

1. **Seguridad:**
   - ✅ Autenticación requerida en todas las rutas
   - ✅ Rate limiting implementado
   - ✅ Validación con Zod
   - ✅ Sanitización de inputs (a través de `validateBody`)

2. **Manejo de Errores:**
   - ✅ Try-catch en funciones críticas
   - ✅ Mensajes de error descriptivos
   - ✅ Manejo de errores separado por sección

3. **Código:**
   - ✅ TypeScript bien tipado
   - ✅ Separación de responsabilidades
   - ✅ Funciones auxiliares bien organizadas

---

## ⚠️ Problemas Encontrados

### 🔴 CRÍTICOS

#### 1. **Archivos PDF No Se Eliminan Después de Importar**

**Ubicación:** `src/app/api/admin/import-exams/route.ts`

**Problema:**

- Los PDFs se descargan a `data/pdfs/` pero nunca se eliminan
- Esto puede llenar el disco con el tiempo
- No hay limpieza automática

**Impacto:** Alto - Puede causar problemas de almacenamiento

**Solución:**

```typescript
// Después de importar exitosamente, eliminar el PDF
await fs.unlink(pdfPath).catch(() => {})
```

---

#### 2. **Falta Validación de URL en Frontend**

**Ubicación:** `src/app/admin/import-exams/page.tsx`

**Problema:**

- No se valida que la URL sea válida antes de enviarla
- El usuario puede ingresar URLs malformadas

**Impacto:** Medio - Puede causar errores innecesarios

**Solución:**

```typescript
// Validar URL antes de enviar
const isValidUrl = (url: string) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}
```

---

#### 3. **Validación Débil de URL de DEMRE**

**Ubicación:** `src/app/api/admin/fetch-demre-pdfs/route.ts`

**Problema:**

- Solo verifica que contenga 'demre.cl'
- No valida formato completo de URL
- Permite URLs como "http://malicious.com?demre.cl"

**Impacto:** Medio - Posible SSRF (Server-Side Request Forgery)

**Solución:**

```typescript
// Validar URL completa
try {
  const urlObj = new URL(url)
  if (urlObj.hostname !== 'demre.cl' && !urlObj.hostname.endsWith('.demre.cl')) {
    throw new Error('URL inválida')
  }
} catch {
  return NextResponse.json({ error: 'URL inválida' }, { status: 400 })
}
```

---

### 🟡 IMPORTANTES

#### 4. **No Hay Validación de Año Numérico**

**Ubicación:** `src/app/admin/import-exams/page.tsx`

**Problema:**

- El año se acepta como string sin validar que sea numérico
- Puede aceptar valores como "abc" o "2026abc"

**Impacto:** Bajo - Puede causar errores en el backend

**Solución:**

```typescript
// Validar que el año sea numérico
const year = parseInt(exam.year)
if (isNaN(year) || year < 2000 || year > 2100) {
  errors.push(`Examen ${index + 1}: Año inválido`)
}
```

---

#### 5. **Falta Limpieza de PDFs en Caso de Error**

**Ubicación:** `src/app/api/admin/import-exams/route.ts`

**Problema:**

- Si falla la importación, el PDF queda en disco
- No hay cleanup en el catch

**Impacto:** Medio - Acumulación de archivos

**Solución:**

```typescript
try {
  await importExam(examData)
} catch (error) {
  // Limpiar PDF si existe
  if (pdfPath) {
    await fs.unlink(pdfPath).catch(() => {})
  }
  throw error
}
```

---

#### 6. **No Hay Transacciones en la Importación**

**Ubicación:** `src/app/api/admin/import-exams/route.ts`

**Problema:**

- Si falla a mitad de crear preguntas, puede dejar datos inconsistentes
- No hay rollback automático

**Impacto:** Medio - Puede dejar datos parciales

**Solución:**

```typescript
// Usar transacción de Prisma
await prisma.$transaction(async tx => {
  // Crear preguntas y examen dentro de la transacción
})
```

---

### 🟢 MEJORAS

#### 7. **Validación de Asignatura en Frontend**

**Ubicación:** `src/app/admin/import-exams/page.tsx`

**Problema:**

- No valida que la asignatura seleccionada esté en la lista válida
- Aunque el Select lo previene, sería mejor validar explícitamente

**Impacto:** Bajo - Ya está controlado por el Select

---

#### 8. **Mensaje de Error Más Específico para PDFs No Encontrados**

**Ubicación:** `src/app/api/admin/import-exams/route.ts`

**Problema:**

- El mensaje "No se encontraron preguntas" es genérico
- Podría ser más específico sobre qué buscar

**Impacto:** Bajo - UX

---

#### 9. **Límite de Tamaño de PDF**

**Ubicación:** `src/app/api/admin/import-exams/route.ts`

**Problema:**

- No hay límite de tamaño para PDFs descargados
- PDFs muy grandes pueden causar problemas de memoria

**Impacto:** Bajo - Pero importante para producción

**Solución:**

```typescript
// Agregar límite de tamaño (ej: 50MB)
const MAX_PDF_SIZE = 50 * 1024 * 1024
```

---

## 📋 Resumen de Problemas

| #   | Problema                   | Severidad     | Prioridad |
| --- | -------------------------- | ------------- | --------- |
| 1   | PDFs no se eliminan        | 🔴 Crítico    | Alta      |
| 2   | Validación URL frontend    | 🟡 Importante | Media     |
| 3   | Validación URL DEMRE débil | 🟡 Importante | Media     |
| 4   | Validación año numérico    | 🟡 Importante | Media     |
| 5   | Limpieza PDFs en error     | 🟡 Importante | Media     |
| 6   | Falta transacciones        | 🟡 Importante | Media     |
| 7   | Validación asignatura      | 🟢 Mejora     | Baja      |
| 8   | Mensajes error específicos | 🟢 Mejora     | Baja      |
| 9   | Límite tamaño PDF          | 🟢 Mejora     | Baja      |

---

## 🎯 Plan de Acción

### Prioridad Alta:

1. ✅ Eliminar PDFs después de importar
2. ✅ Validar URL de DEMRE correctamente
3. ✅ Limpiar PDFs en caso de error

### Prioridad Media:

4. ✅ Validar URL en frontend
5. ✅ Validar año numérico
6. ✅ Agregar transacciones (opcional, puede ser complejo)

### Prioridad Baja:

7. Mejorar mensajes de error
8. Agregar límite de tamaño PDF

---

**Última actualización:** 2025-01-27
