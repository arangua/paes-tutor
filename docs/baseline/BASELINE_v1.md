# BASELINE v1 — Producción OK

Fecha y hora (Chile continental): 2026-01-26 07:32 (UTC-03)
Repositorio: arangua/paes-tutor
Baseline tag (propuesto): baseline/v1.0.0-prod
Commit SHA (baseline): 42ae5468305fb8283b13565850230ecd5e99ef26

## Estado al baseline
- Fase 0 a Fase 5: COMPLETADAS
- Deploy en producción (Vercel): OK
- /api/health: normalizado, observable y con contratos Zod
- Restore + Versioning: corregidos, con baseline v1 y contratos
- Tests clave: pasando
- Último commit en producción visible en health: OK

## Evidencia /api/health (snapshot)
TODO: pegar aquí una respuesta REAL de /api/health (prod) en JSON, o un extracto representativo.

## Reglas de inmutabilidad (desde este baseline)
Desde este punto, cambios en estas rutas requieren RFC aceptado:
- prisma/schema.prisma
- src/app/api/**
- src/lib/env/**
- package.json / package-lock.json
- contratos Zod (schemas) asociados a APIs y health

## Notas
- Este archivo es el manifiesto humano del baseline.
- El baseline técnico queda fijado con un tag anotado en Git.
