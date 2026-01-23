# Decision Log — PAES-Tutor

## Propósito
Este documento registra **decisiones técnicas u operativas menores**
que no requieren un RFC completo, pero que:
- Fijan criterio
- Evitan ambigüedad futura
- Aseguran coherencia post-congelación

No reemplaza al RFC Framework.
Lo complementa.

---

## ¿Qué va aquí?
Decisiones que:
- No cambian contracts ni guards
- No alteran baselines de UX/performance
- No modifican CI ni arquitectura
- Definen convenciones, criterios o límites operativos

Ejemplos:
- Convenciones de nombres
- Decisiones de estilo técnico
- Límites explícitos ("esto no se hará")
- Criterios de aceptación/rechazo de PRs menores

---

## ¿Qué NO va aquí?
- Cambios relevantes → **RFC obligatorio**
- Implementaciones complejas
- Decisiones con riesgo sistémico

Si hay duda → RFC.

---

## Formato de entrada
Cada decisión debe incluir:

- **Fecha**
- **Decisión**
- **Contexto breve**
- **Impacto**
- **Referencia** (PR, commit, issue o RFC si aplica)

---

## Registro de decisiones

### 2025-01-28 — Build Provenance Attestation (Release Gate)
**Decisión:** Activar attestation nativa de build provenance mediante GitHub Actions OIDC en el workflow `release-gate.yml`. La evidencia oficial de que la attestation existe es el run del workflow + la UI de Attestations/Provenance en GitHub.  
**Contexto:** Necesidad de supply-chain security de nivel superior. La attestation genera una prueba verificable (firmada OIDC) asociada al commit/run que atesta los artefactos de build (`.next/**`).  
**Impacto:**
- Attestation automática en cada ejecución de `release-gate` (push/PR a main)
- Evidencia verificable en 30 segundos para auditoría/incidentes
- Política de Branch Protection: merge a `main` bloqueado si falla attestation
- Documentación en `docs/BASELINE_INMUTABLE.md` como Single Source of Truth
- Verificación manual: run del workflow → step "Attest build provenance" → UI de Attestations  
**Referencia:** PASO 9.4.1-9.4.3 — CI Provenance / Build Attestation

### 2025-01-28 — Security Hardening (CodeQL + Security Posture)
**Decisión:** Implementar análisis de seguridad estático mediante CodeQL (TypeScript) y escaneo de vulnerabilidades con Trivy. Los resultados se integran con GitHub Advanced Security para visibilidad centralizada.  
**Contexto:** Completar supply-chain security junto con Dependabot (dependencias) y Build Provenance Attestation (artefactos). CodeQL detecta vulnerabilidades en el código, Trivy escanea dependencias y archivos del sistema.  
**Impacto:**
- Análisis automático en cada push/PR a `main` y semanalmente (domingos)
- Detección de vulnerabilidades críticas/altas en código TypeScript
- Escaneo de vulnerabilidades en dependencias y sistema de archivos
- Resultados centralizados en GitHub Security → Code scanning
- Política: vulnerabilidades críticas/altas deben ser mitigadas o documentadas antes del merge
- Documentación en `docs/BASELINE_INMUTABLE.md` como Single Source of Truth  
**Referencia:** PASO 10.0 — Security Hardening (CodeQL + posture)

### 2026-01-10 — Creación del Decision Log
**Decisión:** Adoptar un Decision Log mínimo post-congelación.  
**Contexto:** Necesidad de registrar criterios sin crear RFCs innecesarios.  
**Impacto:** Mejora trazabilidad y coherencia sin fricción.  
**Referencia:** RFC-2026-001

### 2025-01-28 — Raw body cache via Symbol.for("test.rawBody") en createTestRequest
**Decisión:** Usar `Symbol.for("test.rawBody")` para cachear el body del request en tests de API routes, en lugar de depender de `_bodyText` o leer el body múltiples veces.  
**Contexto:** Tests de API routes fallaban con "El cuerpo de la solicitud no puede estar vacío" debido a que el body se perdía al leerlo múltiples veces o al clonar el Request. El problema ocurría porque `request.json()` consume el stream y no está disponible en segundo acceso.  
**Impacto:** 
- Tests de API routes ahora pueden leer el body correctamente sin perder datos
- Solución estable que no depende de implementaciones internas de Request
- Compatible con Node/undici y happy-dom
- Aplicado en `createTestRequest` de `test-helpers.ts` y mocks de `parseRequestBody`  
**Referencia:** Corrección de tests fallidos en `src/app/api/notes/versions/**` y `src/app/api/challenges/**`

### 2025-01-28 — Auth Mock First enforced via guard:auth-mock-first (scoped a challenges)
**Decisión:** En tests de API routes que requieren autenticación, el mock de auth DEBE importarse ANTES del route handler. Esto se verifica automáticamente mediante `guard:auth-mock-first`.  
**Contexto:** Tests de challenges fallaban con 401 "No autorizado" porque el mock de autenticación no se aplicaba correctamente. El problema era que `vi.mock()` se ejecutaba después de que el route ya había sido importado, quedando "cableado" al módulo real.  
**Impacto:**
- Mock centralizado en `src/app/api/challenges/__tests__/auth-mock.ts`
- Guard automático previene regresiones de orden de imports
- Patrón aplicable a otros endpoints cuando aparezcan casos similares
- Integrado en `ci:check` para validación automática  
**Referencia:** Corrección de 35 tests fallidos en `src/app/api/challenges/**`

### 2025-01-28 — Node environment guard enforced via guard:route-tests-node-env (scope: src/app/api/**/route.test.ts)
**Decisión:** Todos los tests de API routes (`route.test.ts`) DEBEN tener la directiva `// @vitest-environment node` en la primera línea del archivo. Esto se verifica automáticamente mediante `guard:route-tests-node-env`.  
**Contexto:** Tests de API routes pueden ejecutarse en el entorno equivocado (jsdom/happy-dom por defecto) causando fallos con Request/Response reales de Node. La directiva garantiza que Vitest use el entorno Node correcto (undici) para estos tests.  
**Impacto:**
- Previene ejecución de tests de routes en environment equivocado
- Guard automático valida 58 archivos `route.test.ts` en `src/app/api/**`
- Integrado en `ci:check` después de `guard:auth-mock-first`
- Solución estable que no depende de configuración global de Vitest  
**Referencia:** Hardening PASO 6.1 - Prevención de regresiones en tests de API routes

### 2025-01-28 — No hardcoded secrets guard enforced via guard:no-hardcoded-secrets (scope: src/**/*.{ts,tsx,js,jsx,mjs,cjs})
**Decisión:** El código fuente NO DEBE contener secrets hardcodeados (API keys, tokens, passwords, etc.). Esto se verifica automáticamente mediante `guard:no-hardcoded-secrets` que escanea patrones sospechosos.  
**Contexto:** Hardening de seguridad enterprise mínimo para prevenir fugas accidentales de credenciales antes de que lleguen a PR/CI. El guard detecta patrones como private keys, bearer tokens, JWT, AWS keys, GitHub tokens, y strings largos que parecen tokens.  
**Impacto:**
- Previene commits de secrets hardcodeados en código fuente
- Guard automático escanea 453 archivos en `src/**`
- Integrado en `ci:check` después de `guard:route-tests-node-env`
- Permite falsos positivos con `// guard:allow-secret` para casos inevitables (tests, MIME types, nombres de tipos, etc.)
- Sube el baseline de seguridad con costo casi cero (solo escaneo, sin tocar lógica productiva)  
**Referencia:** Hardening PASO 6.2 - Guard de secrets hardcodeados (Enterprise mínimo)

### 2025-01-28 — CI clean output guard enforced via guard:ci-clean-output (Enterprise Suprema)
**Decisión:** El output de CI DEBE estar limpio de warnings críticos y no puede aumentar el "warning budget" vs baseline. Esto se verifica automáticamente mediante `guard:ci-clean-output` que ejecuta `npm run test:run` y audita stdout/stderr.  
**Contexto:** Enterprise Suprema Extrema = "CI Clean Output + Warning Budget". El guard detecta warnings críticos (UnhandledPromiseRejection, ExperimentalWarning, DeprecationWarning, react-act, vitest-leak) que fallan inmediatamente, y warnings de "budget" (console.error, console.warn) que no pueden aumentar vs baseline.  
**Impacto:**
- Previene introducción de warnings críticos en CI
- Mantiene warning budget controlado (no permite que aumente)
- Baseline en `docs/ci/WARNING_BASELINE.json` permite warnings legacy tolerados temporalmente
- Integrado en `ci:check` después de `guard:no-hardcoded-secrets`
- Ejecuta `npm run test:run` internamente para capturar warnings reales
- Política: warnings críticos = fallo inmediato; warnings budget = no pueden aumentar  
**Referencia:** Hardening PASO 6.3 - CI Clean Output + Warning Budget (Enterprise Suprema)

### 2025-01-28 — Lockfile policy guard enforced via guard:lockfile-policy
**Decisión:** El `package-lock.json` DEBE estar presente, usar `lockfileVersion: 3`, y ser determinístico/consistente. Si `package.json` cambia, `package-lock.json` también debe cambiar. Esto se verifica automáticamente mediante `guard:lockfile-policy`.  
**Contexto:** Reproducibilidad total del pipeline requiere lockfile consistente. El guard verifica que el lockfile no se modifique al regenerarlo (determinístico), que use lockfileVersion 3 (npm moderno), y que cambios en package.json vengan acompañados de cambios en package-lock.json.  
**Impacto:**
- Previene lockfiles inconsistentes o desactualizados
- Garantiza lockfileVersion 3 (npm moderno)
- Detecta cuando package.json cambia sin actualizar package-lock.json
- Normaliza line endings (CRLF vs LF) para evitar falsos positivos en Windows
- Integrado en `ci:check` después de `guard:prisma`
- Política: lockfile debe ser determinístico y siempre commiteado  
**Referencia:** PASO 9.1 - Guard Lockfile Policy (Reproducibilidad Total)

### 2025-01-28 — Dependency drift snapshot guard enforced via guard:deps-snapshot
**Decisión:** Las dependencias resueltas (transitivas incluidas) NO DEBEN cambiar sin actualizar el baseline. Esto se verifica automáticamente mediante `guard:deps-snapshot` que compara el snapshot actual con `docs/ci/DEPS_SNAPSHOT.json`.  
**Contexto:** Enterprise Suprema Extrema requiere detectar cambios sutiles en dependencias transitivas que el lockfile podría no capturar completamente. El guard genera un snapshot de todas las dependencias resueltas (name@version) y detecta drift (nuevas o removidas).  
**Impacto:**
- Detecta cambios en dependencias transitivas que podrían pasar desapercibidos
- Baseline en `docs/ci/DEPS_SNAPSHOT.json` (1152 packages iniciales)
- Integrado en `ci:check` después de `guard:lockfile-policy`
- Actualización requiere `guard:deps-snapshot:write` + commit + entrada en Decision Log
- Política: si cambia package-lock.json → es esperable que cambie DEPS_SNAPSHOT.json  
**Referencia:** PASO 9.2.1 - Dependency Drift Snapshot (Reproducibilidad Total)

### 2025-01-28 — Lockfile fingerprint en dependency snapshot (PASO 9.2.3)
**Decisión:** El snapshot de dependencias (`DEPS_SNAPSHOT.json`) DEBE incluir el hash SHA-256 del `package-lock.json` en `meta.packageLockSha256` para trazabilidad snapshot ↔ lockfile exacto.  
**Contexto:** Mejora opcional de nivel superior para blindaje extra. El hash permite detectar cambios en el lockfile incluso si las dependencias resueltas no cambian (por ejemplo, cambios en metadata, orden, o line endings normalizados).  
**Impacto:**
- Trazabilidad completa: snapshot ↔ lockfile exacto
- Detecta cambios sutiles en lockfile que no afectan dependencias resueltas
- Hash SHA-256: `78c787e9fbcd82bf19ed317ea9df53c54de4d907c15b728cb560704fe033e177` (baseline inicial)
- Validación automática: guard falla si hash no coincide
- Sin agregar ruido: solo hash del lockfile, no integrity por paquete  
**Referencia:** PASO 9.2.3 - Lockfile Fingerprint (Reproducibilidad Total)

### 2025-01-28 — CI determinism guard enforced via guard:repo-clean (PASO 9.3.1)
**Decisión:** Los checks de CI NO DEBEN modificar archivos críticos del repositorio. Esto se verifica automáticamente mediante `guard:repo-clean` que detecta cambios en archivos críticos después de ejecutar checks.  
**Contexto:** Enterprise Suprema Extrema requiere CI determinista. El guard detecta si scripts/guards están modificando silenciosamente archivos como `package-lock.json`, `package.json`, `DEPS_SNAPSHOT.json`, `WARNING_BASELINE.json`, o `.nvmrc`.  
**Impacto:**
- Previene regeneración silenciosa de archivos durante CI
- Detecta scripts que reescriben JSON/MD sin control
- Detecta formatting no controlado
- Detecta modificaciones accidentales en Windows vs Linux
- En CI: falla estrictamente si hay cambios
- En desarrollo local: muestra warning pero no falla (permite cambios pendientes)
- Integrado en `ci:check` al final (después de todos los checks)
- Política: archivos críticos NO deben modificarse durante ci:check  
**Referencia:** PASO 9.3.1 - CI Determinism Guard (Reproducibilidad Total)

### 2026-01-14 — Refresh deps snapshot baseline (Upstash version label normalization)

- Contexto: `guard:deps-snapshot` detectó drift en dependencias resueltas tras `npm ci`.
- Observación: paquetes Upstash aparecieron con etiqueta de versión normalizada (ej. `@upstash/*@1.35.8`) en lugar de formato previo con prefijo `v` (ej. `@upstash/*@v1.35.8`).
- Decisión: aceptar drift como actualización legítima del snapshot de dependencias resueltas y reescribir baseline.
- Acción: `npm run guard:deps-snapshot:write` → actualiza `docs/ci/DEPS_SNAPSHOT.json`.
- Impacto: baseline CI actualizado; no cambia código de app, solo verificación de consistencia.
