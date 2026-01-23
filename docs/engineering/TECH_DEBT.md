# Registro de Deuda Técnica

**Última actualización:** 2026-01-23  
**Propósito:** Tracking centralizado de deuda técnica trazable y TODOs normalizados

---

## Formato de Entrada

Cada entrada debe seguir este formato:

```markdown
### TECH-DEBT-###: <Título descriptivo>

- **Archivo/Línea:** `ruta/archivo.ts:123`
- **Descripción:** Acción concreta a realizar
- **Riesgo:** Bajo | Medio | Alto
- **Owner:** <rol> (ej: backend-team, frontend-team, devops)
- **Creado:** YYYY-MM-DD
- **Criterio de cierre:** Condición específica que indica que está resuelto
```

---

## Deuda Técnica Registrada

### TECH-DEBT-001: Implementar tabla de versiones en base de datos

- **Archivo/Línea:** `src/app/api/notes/versions/route.ts:136`
- **Descripción:** La funcionalidad de versiones de notas está simulada. Se requiere implementar tabla `NoteVersion` en Prisma schema y guardar versiones automáticamente al editar notas.
- **Riesgo:** Medio
- **Owner:** backend-team
- **Creado:** 2025-01-28
- **Criterio de cierre:** 
  - Tabla `NoteVersion` creada en schema Prisma
  - Migración aplicada
  - Versiones se guardan automáticamente al editar
  - Tests de versiones pasando

### TECH-DEBT-002: Implementar restauración de versiones

- **Archivo/Línea:** `src/app/api/notes/versions/route.ts:252`
- **Descripción:** Restauración de versiones no está implementada. Requiere tabla de versiones (TECH-DEBT-001) para funcionar correctamente.
- **Riesgo:** Medio
- **Owner:** backend-team
- **Creado:** 2025-01-28
- **Criterio de cierre:**
  - Endpoint de restauración implementado
  - Restauración funcional con tabla de versiones
  - Tests de restauración pasando

### TECH-DEBT-003: Mejorar invalidación de caché por patrón en Redis

- **Archivo/Línea:** `src/lib/cache.ts:283`
- **Descripción:** Upstash Redis REST API no soporta SCAN directamente. Invalidación por patrón con wildcard requiere invalidar caché completo. Considerar usar prefijos para versiones y eliminar claves con ese prefijo.
- **Riesgo:** Bajo
- **Owner:** backend-team
- **Creado:** 2026-01-23
- **Criterio de cierre:**
  - Sistema de prefijos implementado para claves de caché
  - Invalidación por patrón funcional sin invalidar todo el caché
  - Documentación actualizada

---

## Notas

- Los TODOs en código deben seguir el formato: `// TODO(TECH-DEBT-###): <descripción> — owner: <rol> — by: YYYY-MM-DD`
- Los FIXMEs deben seguir el formato: `// FIXME(TECH-DEBT-###): <descripción> — owner: <rol> — by: YYYY-MM-DD`
- Este documento se actualiza cuando se agregan nuevos TODOs o se resuelven items existentes.
