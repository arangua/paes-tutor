# RFC-0001 — Proceso RFC

Estado: ACCEPTED  
Fecha (Chile): 2026-01-26  
Owner: Repo Maintainers

## 1) Cuándo se requiere RFC
Se requiere RFC si el cambio afecta cualquiera de estas áreas:
- `prisma/schema.prisma` (DB / modelos)
- `src/app/api/**` (APIs)
- `src/lib/env/**` (validación/env schema/secret handling)
- `package.json` o `package-lock.json` (supply chain)
- Contratos Zod usados por APIs o `/api/health`
- Cambios de arquitectura, seguridad, observabilidad o CI gates

## 2) Flujo
1. Crear RFC en `docs/rfcs/draft/RFC-XXXX-titulo.md`
2. Abrir PR **solo de RFC**
3. Review y discusión
4. Mover a `docs/rfcs/accepted/` si se aprueba (o `rejected/`)
5. Implementación en PR separado que:
   - Referencia el RFC en la descripción (ej: "Implements RFC-0007")
   - Incluye link al RFC
   - Mantiene compatibilidad o define plan de migración

## 3) Regla de referencia
Todo PR que toque rutas sensibles debe referenciar un RFC aceptado, salvo hotfix crítico justificado.

## 4) Convenciones
- Nombre archivo: `RFC-XXXX-titulo-corto.md`
- Un RFC = una decisión principal
- Cambios posteriores: RFC nuevo o "RFC amendment" explícito
