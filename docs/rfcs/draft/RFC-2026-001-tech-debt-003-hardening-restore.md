# RFC-2026-001 — TECH_DEBT_003 Hardening Restore + Migration History Alignment

## Contexto
En Neon (branch main) existían migraciones aplicadas/registradas para TECH_DEBT_003 que no estaban presentes en el repo local, lo que provocaba drift y bloqueo de `prisma migrate dev`.

## Problema
- Prisma detectaba migraciones aplicadas en DB pero ausentes en el directorio local.
- Existía una migración con rollback y duplicación de nombre en `_prisma_migrations`.
- El endpoint restore necesitaba hardening: restore debe mover el puntero `currentVersion` (no crear versión nueva) y registrar historial.

## Decisión
1) Alinear el repo con Neon recreando:
- `20260124045000_tech_debt_003_hardening_restore` como NO-OP (por estar rolled back en DB).
- `20260124050000_tech_debt_003_hardening_restore` con el SQL real (función `validate_current_version_exists` + trigger deferrable).

2) Hardening del endpoint:
- Restore actualiza solo `currentVersion`.
- Registra `VersionRestoreHistory` con NOOP/APPLIED.
- Requiere usuario autenticado (401 si no hay user).

## Impacto
- Se elimina drift; `npx prisma migrate status` queda "Database schema is up to date!".
- No hay reset ni pérdida de datos.
- Mejora trazabilidad/seguridad del flujo restore.

## Rollback
- Revertir PR revierte código y migraciones locales.
- En DB no se realiza reset; cualquier ajuste posterior debe respetar `_prisma_migrations` existente.
