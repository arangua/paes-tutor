# Baseline Inmutable — PAES-Tutor

## Estado del proyecto
El proyecto PAES-Tutor se encuentra en **estado congelado (Enterprise)**.

Esto implica que existen elementos que **no deben cambiarse**
salvo mediante **RFC explícito, aprobado y documentado**.

---

## Elementos inmutables

### 1. Orden del CI
El orden actual del CI es **inmutable**:

1. `guard:prisma`
2. `guard:lockfile-policy`
3. `guard:deps-snapshot`
4. `guard:no-global-patches`
5. `guard:auth-mock-first`
6. `guard:route-tests-node-env`
7. `guard:no-hardcoded-secrets`
8. `guard:ci-clean-output`
9. `guard:contracts`
10. `guard:prod-ready`
11. `guard:ux`
12. `contracts:test`
13. `lint:critical`
14. `test:run`
15. `guard:repo-clean` ⬅️ Al final, verifica que no se modificaron archivos críticos
4. `guard:auth-mock-first`
5. `guard:route-tests-node-env`
6. `guard:no-hardcoded-secrets`
7. `guard:ci-clean-output`
8. `guard:contracts`
9. `guard:prod-ready`
10. `guard:ux`
11. `contracts:test`
12. `lint:critical`
13. `test:run`

Cualquier modificación requiere RFC.

---

### 2. Guards existentes
Todos los guards activos son parte del baseline:
- `guard:prisma` - Verifica configuración de Prisma engine
- `guard:lockfile-policy` - Verifica lockfileVersion=3 y consistencia del package-lock.json
- `guard:deps-snapshot` - Detecta drift de dependencias resueltas (transitivas incluidas)
- `guard:repo-clean` - Verifica que checks no modifiquen archivos críticos (CI determinismo)
- `guard:no-global-patches` - Previene parches globales
- `guard:auth-mock-first` - Verifica orden de imports de mocks en tests
- `guard:route-tests-node-env` - Verifica directiva @vitest-environment node en route tests
- `guard:no-hardcoded-secrets` - Previene secrets hardcodeados
- `guard:ci-clean-output` - Verifica output limpio de CI (warning budget)
- `guard:contracts` - Previene regresiones contractuales
- `guard:prod-ready` - Valida componentes de producción
- `guard:ux` - Detecta anti-patterns de UX

No pueden:
- relajarse
- eliminarse
- cambiar su semántica

Sin RFC.

---

### 3. Modelo de errores
El modelo:
- ContractError
- DomainError
- SystemError

Y su handler asociado:
- No puede cambiarse implícitamente
- No puede mezclarse con errores genéricos

---

### 4. Contracts e invariants
Los contracts y sus invariants:
- Definen el comportamiento observable
- Son autoridad sobre el runtime

No se modifican sin RFC.

---

### 5. Baseline UX y performance
Los umbrales definidos:
- UX
- Performance

Son referencia oficial.
Cualquier cambio requiere RFC y evidencia.

---

### 6. Filosofía de runtime safety
Se mantiene:
- Fail-fast en desarrollo
- Protección estricta en producción
- Health checks como contrato

---

### 7. Baselines Enforced by CI

Tabla de referencia rápida: baselines operativos que se verifican automáticamente en CI.

| Área | Baseline / Regla | Enforced por | Estado |
|------|------------------|--------------|--------|
| API route tests environment | `// @vitest-environment node` en todo `route.test.ts` | `guard:route-tests-node-env` | ✅ |
| Auth determinístico en challenges | `auth-mock` importado antes del route | `guard:auth-mock-first` | ✅ |
| Request body estable en tests | `Symbol.for("test.rawBody")` cache | Tests + Decision Log | ✅ |
| Secrets hardcodeados | Bloqueo por patrones (allow con comentario) | `guard:no-hardcoded-secrets` | ✅ |
| CI clean output | Críticos = 0, budget no aumenta | `guard:ci-clean-output` + baseline JSON | ✅ |
| Lockfile policy | lockfileVersion=3, determinístico, consistente | `guard:lockfile-policy` | ✅ |
| Dependency drift | Snapshot de dependencias resueltas estable | `guard:deps-snapshot` + `docs/ci/DEPS_SNAPSHOT.json` | ✅ |
| Release Gate | Build compilable, tipos OK, lint completo | `ci:release` → `workflow release-gate.yml` | ✅ |

**Objetivo:** Que cualquier dev nuevo entienda el "contrato" en 60 segundos.

**Notas:**
- Todos los baselines están documentados en `docs/decisions/DECISION_LOG.md`
- Baseline de warnings en `docs/ci/WARNING_BASELINE.json`
- Para allowlist: usar `// guard:allow-secret` (solo casos legítimos)

**Cuadro de decisión (Gates):**

| Nivel | Qué corre | Dónde | Cuándo |
|-------|-----------|-------|--------|
| PR Gate | `npm run ci:check` | PR | siempre |
| Release Gate | `npm run ci:release` | main / manual | antes de liberar |
| E2E / Performance | jobs separados | nightly o manual | cuando corresponda |

---

## Build Provenance Attestation (Release Gate)

**Estado:** Activo (GitHub Actions OIDC)
**Workflow:** release-gate.yml
**Step:** actions/attest-build-provenance@v1
**Subject:** .next/**

### Verificación rápida (manual)
1. Abrir el run del workflow **release-gate** asociado al commit.
2. Confirmar que el step **Attest build provenance** está ✅.
3. Revisar la sección de Attestations/Provenance del run/commit (GitHub UI) para confirmar existencia.

### Política (Branch Protection)
El merge a `main` requiere que el status check **release-gate** esté en verde.
Si falla cualquier paso (incluida la attestation), el PR queda bloqueado.

---

## Security Hardening (CodeQL + Security Posture)

**Estado:** Activo (GitHub Advanced Security)
**Workflows:** codeql-analysis.yml, security.yml
**Análisis:** CodeQL (TypeScript) + Trivy (vulnerabilidades)

### Verificación rápida (manual)
1. Abrir el run del workflow **CodeQL Analysis** asociado al commit.
2. Revisar resultados en **Security** → **Code scanning** (GitHub UI).
3. Verificar que no hay vulnerabilidades críticas o altas sin mitigación.

### Política
- CodeQL ejecuta análisis semanal (domingos) y en cada push/PR a `main`.
- Trivy escanea vulnerabilidades en dependencias y código.
- Vulnerabilidades críticas/altas deben ser mitigadas o documentadas antes del merge.

---

## Regla final
> **Si no estás seguro de si algo puede cambiarse → no puede.**

La única vía es un RFC aceptado.

---

## Relación con otros documentos
- RFC Framework → decisiones mayores
- Decision Log → decisiones menores
- Dependency Update Playbook → flujo de actualización de dependencias
- Este documento → perímetro de protección
