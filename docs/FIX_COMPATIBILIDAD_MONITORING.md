# 🔧 Fix de Compatibilidad - Monitoring

**Fecha:** 2025-01-27  
**Problema:** El código existente usa `captureError` pero el nuevo módulo solo exportaba `trackError`

---

## ✅ Solución Implementada

Se agregó `captureError` como alias de `trackError` en `src/lib/monitoring.ts` para mantener **compatibilidad hacia atrás** con el código existente.

### Cambio Realizado

```typescript
/**
 * Helper para trackear errores
 */
export function trackError(error: Error, context?: Record<string, any>, severity?: ErrorData['severity']): void {
  errorTracker.track({ error, context, severity })
}

/**
 * Alias de trackError para compatibilidad con código existente
 * @deprecated Usar trackError en su lugar. Este alias se mantiene por compatibilidad hacia atrás.
 */
export function captureError(error: Error, context?: Record<string, any>, severity?: ErrorData['severity']): void {
  trackError(error, context, severity)
}
```

---

## 📋 Archivos que Usan `captureError`

El siguiente código existente usa `captureError` y ahora funciona correctamente:

- `src/components/ErrorBoundary.tsx`
- `src/components/ErrorBoundaryWrapper.tsx`
- `src/hooks/useGlobalUndoRedo.ts`
- `src/hooks/useExams.ts`
- `src/app/exams/page.tsx`
- `src/components/export/export-button.tsx`
- `src/components/dashboard/joint-progress.tsx`
- Y otros 15+ archivos

---

## ✅ Estado

- ✅ `captureError` exportado correctamente
- ✅ Compatibilidad hacia atrás mantenida
- ✅ Sin errores de TypeScript relacionados
- ✅ Código existente funciona sin cambios

---

## 📝 Nota

Aunque `captureError` está marcado como `@deprecated`, se mantiene para no romper el código existente. En el futuro, se puede migrar gradualmente a `trackError`.

---

*Fix aplicado: 2025-01-27*

