# RFCs — Request for Comments

Este repositorio usa RFCs para cambios relevantes (arquitectura, contratos, APIs, DB, seguridad, observabilidad y baseline).

## Estructura
- draft/     RFCs en propuesta
- accepted/  RFCs aprobados (habilitan implementación)
- rejected/  RFCs descartados (registro histórico)

## Regla base
Si un cambio toca rutas sensibles (API/DB/contratos/env/lockfiles), debe existir un RFC en `accepted/` referenciado por el PR y por los commits relevantes.

Ver: `0001-rfc-process.md`
