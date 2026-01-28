# RFC-2026-002 — Remediación de hallazgos de Code Review con prevención de regresiones

**Estado:** Draft
**Autor:** Code Review Team
**Fecha:** 2026-01-27

---

## 1. Contexto y problema

Se realizó un code review exhaustivo del codebase PAES-Tutor que identificó **28 hallazgos confirmados**, distribuidos así:

| Severidad | Cantidad | Categoría principal |
|-----------|----------|---------------------|
| Crítico   | 5        | Seguridad (SSRF, auth bypass), Runtime crash |
| Alto      | 6        | Bugs funcionales, encriptación, UX rota |
| Medio     | 9        | Race conditions, anti-patterns, inconsistencias |
| Bajo      | 8        | Validación, performance, calidad de código |

Los hallazgos críticos incluyen:
- **Escalación de privilegios**: Ruta admin sin verificación de rol
- **SSRF**: fetch() a URLs no validadas
- **ReferenceError en runtime**: Variables no definidas en scope
- **Detección de seguridad unreliable**: Regex /g con .test() alterna resultados
- **Catch blocks rotos**: Variables de try inaccesibles en catch

El sistema está en **estado congelado Enterprise**. Cualquier remediación debe garantizar cero regresiones.

---

## 2. Objetivo

Remediar los 28 hallazgos confirmados con:
- **Cero regresiones** en funcionalidad existente
- **Test-first**: cada fix tiene test antes de la implementación
- **Commits atómicos**: cada fix en su propio commit para rollback granular
- **Validación continua**: full test suite + typecheck + lint después de cada fase
- **Trazabilidad total**: cada hallazgo mapeado a commit, test y evidencia

---

## 3. No-objetivos

Este RFC **no** busca:
- Refactoring general del codebase
- Cambios de arquitectura
- Mejoras de performance no relacionadas con los hallazgos
- Actualización de dependencias
- Cambios en la UI/UX más allá de lo necesario para corregir bugs

---

## 4. Alcance

### Archivos afectados por fase

**Fase 1 — Críticos:**
- `src/app/api/admin/import-exams/route.ts`
- `src/lib/webhooks.ts`
- `src/lib/cache.ts`
- `src/lib/security-logger.ts`
- `src/app/api/user/ai-keys/route.ts`

**Fase 2 — Altos:**
- `src/lib/webhooks.ts`
- `src/lib/encryption.ts`
- `src/hooks/useExams.ts`
- `src/app/api/challenges/route.ts`
- `src/app/api/shared-exams/route.ts`
- `src/app/api/user/ai-keys/route.ts`

**Fase 3 — Medios:**
- `src/hooks/useExams.ts`
- `src/components/GlobalErrorHandler.tsx`
- `src/app/api/practice/sessions/route.ts`
- `src/lib/cache.ts`
- `src/hooks/useAutoSave.ts`
- `src/lib/logger.ts`
- `src/hooks/useKeyboardShortcuts.ts`
- `src/app/api/user/password/route.ts`

**Fase 4 — Bajos:**
- `next.config.ts`
- `src/app/api/user/ai-keys/route.ts`
- `src/lib/spaced-repetition.ts`
- `src/app/api/shared-exams/route.ts`
- `src/app/api/admin/import-exams/route.ts`
- `src/lib/security-logger.ts`
- `src/lib/check-admin.ts`
- `src/lib/get-session.ts`

---

## 5. Propuesta

### Estrategia de remediación en 5 fases

#### Fase 0 — Fundación (prevención de regresiones)
Antes de tocar cualquier código:
1. Capturar baseline: ejecutar full test suite y registrar resultado
2. Ejecutar typecheck y lint completos
3. Crear snapshot de la cobertura actual
4. Establecer punto de rollback (tag git)

#### Fase 1 — Críticos (5 hallazgos)
Orden de implementación por dependencias:

| # | Hallazgo | Fix | Test |
|---|----------|-----|------|
| 1 | Sin verificación admin en import-exams | Agregar `isAdmin()` check | Test: usuario no-admin recibe 403 |
| 2 | SSRF en import-exams y webhooks | Validar URLs contra redes internas | Test: URLs internas rechazadas |
| 3 | ReferenceError en cache.ts | Referenciar `cacheInstance` correctamente | Test: cleanup no crashea |
| 4 | Regex /g en security-logger | Remover flag /g de los patrones | Test: detección consistente en llamadas consecutivas |
| 5 | ReferenceError en ai-keys catch | Declarar `user` antes del try o usar variable outer | Test: error en getCurrentUser retorna 500 limpio |

#### Fase 2 — Altos (6 hallazgos)

| # | Hallazgo | Fix | Test |
|---|----------|-----|------|
| 6 | timingSafeEqual lanza en longitudes distintas | Comparar longitudes antes, retornar false si difieren | Test: firma de largo incorrecto retorna false |
| 7 | Encryption key cambia por reinicio | Usar key estática determinista en dev | Test: encrypt/decrypt sobrevive reload simulado |
| 8 | Salt PBKDF2 hardcodeado | **Diferido a RFC-2026-003** — requiere migración de datos encriptados existentes; documentar limitación en código | N/A en esta fase |
| 9 | refetch() es no-op | Agregar trigger state en dependencias del useEffect | Test: refetch dispara re-fetch |
| 10 | Selección de oponente arbitraria | Selección aleatoria con seed o parámetro | Test: selección no siempre retorna el mismo |
| 11 | maskApiKey sobre ciphertext | Llamar maskApiKey antes de encrypt | Test: últimos 4 chars son de la key original |

#### Fase 3 — Medios (9 hallazgos)

| # | Hallazgo | Fix | Test |
|---|----------|-----|------|
| 12 | Race condition en useExams | Agregar AbortController | Test: cleanup aborta fetch pendiente |
| 13 | Monkey-patching console | Reemplazar con filtro en error boundary sin patchear globals | Test: console.warn no es sobreescrito |
| 14 | Race condition updatePerformanceMetrics | Envolver en transacción Prisma | Test: updates concurrentes no pierden datos |
| 15 | Redis TTL inconsistente | Aplicar defaultTTL cuando no se pasa TTL | Test: Redis set sin TTL tiene expiración |
| 16 | useAutoSave cleanup en cada cambio | Usar ref para data en cleanup, reducir dependencias | Test: onSave no se llama en cada cambio de data |
| 17 | Logger info/debug usan console.warn | Usar console.log para info, console.debug para debug | Test: info() usa console.log |
| 18 | useKeyboardShortcuts no re-registra | Incluir shortcuts en dependencias del useEffect | Test: shortcuts añadidos después del mount funcionan |
| 19 | Password incorrecto retorna 400 | Cambiar a 401 con mensaje genérico | Test: password incorrecto retorna 401 |
| 20 | invalidateCache ignora patrón | Implementar filtrado por patrón o documentar limitación | Test: invalidar patrón solo limpia keys matching |

#### Fase 4 — Bajos (8 hallazgos)

| # | Hallazgo | Fix | Test |
|---|----------|-----|------|
| 21 | ignoreBuildErrors: true | Remover flag, corregir errores de tipo | Build pasa sin ignoreBuildErrors |
| 22 | Sin validación formato API keys | Agregar regex de formato por provider | Test: key con formato inválido es rechazada |
| 23 | Sin bounds en spaced-repetition | Validar quality ∈ [0,5] | Test: quality fuera de rango lanza error |
| 24 | Sin paginación en shared-exams | Agregar take/skip con defaults | Test: respuesta respeta límite |
| 25 | N+1 query en import-exams | Pre-cargar topics antes del loop | Test: solo 1 query de topics |
| 26 | getClientIp confía en headers | Documentar limitación, agregar log de advertencia | Test: header spoofado genera warning |
| 27 | Auth patterns inconsistentes | Crear middleware auth unificado | Test: todas las rutas admin usan mismo patrón |
| 28 | Errores silenciados sin logging | Agregar logger.error en catch blocks | Test: error de DB genera log |

---

## 6. Compatibilidad

### Contracts
- No se modifican contracts existentes
- Los cambios son internos a la implementación de cada módulo

### Invariants
- Se preservan todas las invariants del sistema congelado
- Se agregan nuevas invariants de seguridad (admin check, URL validation)

### Backward compatibility
- Todas las APIs mantienen la misma firma
- Los cambios en HTTP status codes (400→401) se consideran correcciones, no breaking changes
- La encriptación (issue 7) cambia el fallback de dev a valor estático — no afecta producción
- Issue 8 (salt dinámico) **diferido formalmente a RFC-2026-003** por requerir migración de datos

### Migraciones necesarias
- **Issue 7**: Si hay datos encriptados con `dev-temp-key-<timestamp>`, ya están irrecuperables (bug original); el fix previene que esto siga ocurriendo
- **Issue 8**: No se implementa en este RFC — requiere versionado del ciphertext + migración. Ver RFC-2026-003
- **Issue 21**: Posibles errores de TypeScript que actualmente se ignoran

---

## 7. Riesgos

| Riesgo | Severidad | Probabilidad |
|--------|-----------|-------------|
| Fix de encriptación corrompe keys existentes | Alta | Media |
| Remoción de ignoreBuildErrors bloquea el build | Media | Alta |
| Fix de console monkey-patch rompe error boundary | Media | Baja |
| Fix de auth inconsistente introduce nuevos 401s | Media | Media |
| Fix de race conditions introduce deadlocks | Baja | Baja |

---

## 8. Mitigaciones

### Para cada fase:
1. **Pre-check**: Full test suite + typecheck + lint ANTES del primer cambio
2. **Test-first**: Cada fix tiene test que falla → implementar → test pasa
3. **Post-check**: Full test suite + typecheck + lint DESPUÉS del último cambio
4. **Commit atómico**: Cada fix en commit independiente para rollback granular
5. **Tag de fase**: Git tag al completar cada fase

### Para riesgos específicos:
- **Encriptación (CR-08)**: Diferido formalmente a RFC-2026-003; solo se aplica comentario `@security-debt` de trazabilidad
- **ignoreBuildErrors**: Listar errores de TS primero, evaluar scope antes de remover
- **Console patch**: Verificar que GlobalErrorHandler sigue capturando errores
- **Auth**: Agregar logging detallado en middleware para detectar falsos 401

---

## 9. Plan de implementación

### Fase 0 — Fundación
1. Capturar baseline de tests existentes
2. Crear tag `pre-remediation-baseline`
3. Documentar estado actual de CI

### Fase 1 — Críticos
4. Test + fix #4 (regex /g en security-logger) — sin dependencias
5. Test + fix #3 (ReferenceError en cache.ts) — sin dependencias
6. Test + fix #5 (ReferenceError en ai-keys catch) — sin dependencias
7. Test + fix #1 (admin check en import-exams) — sin dependencias
8. Test + fix #2 (SSRF validation) — sin dependencias
9. Validación post-fase: full suite

### Fase 2 — Altos
10. Test + fix #6 (timingSafeEqual)
11. Test + fix #7 (encryption key dev)
12. ~~Test + fix #8 (PBKDF2 salt)~~ → **Diferido a RFC-2026-003** (requiere migración de datos)
13. Test + fix #9 (useExams refetch)
14. Test + fix #10 (opponent selection)
15. Test + fix #11 (maskApiKey)
16. Validación post-fase: full suite

### Fase 3 — Medios
17-25. Test + fix para cada hallazgo (#12-#20)
26. Validación post-fase: full suite

### Fase 4 — Bajos
27-34. Test + fix para cada hallazgo (#21-#28)
35. Validación post-fase: full suite
36. Validación final: full suite + typecheck + lint + build

---

## 10. Plan de validación

### Por cada fix individual:
- Test unitario que reproduce el bug (red)
- Implementación del fix (green)
- Refactor si necesario (refactor)
- Verificación de no-regresión con test suite completa

### Por cada fase:
- `npm run test:run` — Tests unitarios completos
- `npm run validate:types` — TypeScript sin errores
- `npm run lint:strict` — Lint sin warnings
- `npm run check:critical-issues` — Guards pasan

### Validación final:
- `npm run ci:check` — Suite completa de CI
- Cobertura >= baseline capturado en Fase 0
- Cero nuevos warnings en lint
- Build exitoso

---

## 11. Rollback

### Por fix individual:
```bash
git revert <commit-hash>  # Cada fix es un commit atómico
```

### Por fase completa:
```bash
git revert --no-commit <first-commit>..<last-commit>
git commit -m "rollback: revert fase N de remediación"
```

### Rollback total:
```bash
git reset --hard pre-remediation-baseline
```

Ningún rollback requiere:
- Migración de base de datos (no hay cambios de schema)
- Cambio de variables de entorno
- Coordinación con servicios externos

---

## 12. Decisión

**Resultado:** Pending
**Responsable de la decisión:** Maintainers del proyecto
**Justificación:** Pendiente de aprobación. Transiciona a "Accepted" cuando el PR de docs sea aprobado/mergeado por maintainers.

---

## 13. Evidencias

- Code Review original: documentado en issue/PR de referencia
- Los 28 hallazgos validados contra el código fuente
- RFC creado siguiendo el framework RFC-2026-001
- Commits de implementación se vincularán a este RFC
