## Resumen
Describe brevemente el cambio y el objetivo del PR.

## Tipo de cambio
- [ ] Dependencias (Dependabot / manual)
- [ ] Hotfix
- [ ] Refactor
- [ ] Docs
- [ ] Otro: _______

---

## Checklist obligatorio (Dependency Update)

### 1) Consistencia y reproducibilidad
- [ ] Node fijado (24.11.1) y `npm ci` utilizado en CI
- [ ] `package.json` y `package-lock.json` están consistentes (lockfile-policy pasa)

### 2) Baselines / Drift
- [ ] Si cambió `package-lock.json`: ejecuté `npm run guard:deps-snapshot:write`
- [ ] `docs/ci/DEPS_SNAPSHOT.json` actualizado (incluye `meta.packageLockSha256`) y commiteado
- [ ] `npm run guard:deps-snapshot` pasa

### 3) Gates obligatorios
- [ ] `npm run ci:check` ✅
- [ ] `npm run ci:release` ✅
- [ ] (CI) `guard:repo-clean` no detecta mutaciones del repo

### 4) Major updates (solo si aplica)
- [ ] Si es major: label `deps-major-approved` aplicado
- [ ] Si es major: entrada en `docs/decisions/DECISION_LOG.md` (cuando corresponda)
- [ ] Verifiqué impactos (breaking changes) y plan de rollback

### 5) Evidencia
- [ ] Link al run de **release-gate** (incluye attestation de build provenance)

---

## Notas / Riesgos
- Riesgos conocidos:
- Mitigaciones:
- Plan de rollback:
