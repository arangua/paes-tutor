# Dependency Update Playbook (Enterprise)

## Principio
Toda actualización de dependencias debe ser:
1) Intencional
2) Reproducible
3) Auditada (Decision Log cuando corresponda)
4) Verificada por CI (ci:check + ci:release)

## Flujo estándar (manual o bot)
### 1. Preparación
- Confirmar Node y npm fijados:
  - Node: 24.11.1 (.nvmrc / engines)
  - npm: vía npm ci (lockfile v3)

### 2. Ejecutar actualización
- Actualizar dependencias (según estrategia definida).
- SIEMPRE generar lockfile consistente:
  - `npm install` (local) o mecanismo del bot
  - luego verificar que `package-lock.json` cambió (si correspondía)

### 3. Regenerar baselines (solo si corresponde)
Si cambió `package-lock.json`, entonces:
- `npm run guard:deps-snapshot:write`
- Validar que `docs/ci/DEPS_SNAPSHOT.json` refleja el lockfile (incluye SHA-256)
- Commit de baseline junto a la actualización

### 4. Validaciones obligatorias
- `npm run ci:check`
- `npm run ci:release`

### 5. Política de aprobación
- Patch/minor: permitido con revisión estándar
- Major: requiere Decision Log + revisión reforzada
- Cualquier cambio en baselines: debe estar justificado (link a PR y/o Decision Log)

## Reglas de seguridad
- Prohibido mergear PRs que:
  - cambien package.json sin package-lock.json
  - pasen sin regenerar DEPS_SNAPSHOT cuando cambió el lockfile
  - generen cambios en el repo durante ci:check (repo-clean)
  - violen warning budget / baselines UX

## Evidencia
La fuente de verdad de verificación es:
- Runs de GitHub Actions (release-gate)
- Attestation de build provenance (PASO 9.4)
- Docs: BASELINE_INMUTABLE.md + DECISION_LOG.md
