# INCIDENT RUNBOOK — PAES-Tutor (Enterprise)

## Objetivo
Establecer un procedimiento claro y repetible para responder a incidentes
relacionados con CI/CD, seguridad, dependencias y baselines, minimizando
tiempo de respuesta y errores bajo presión.

---

## 1. Incidente: CI falla en PR o main

### Síntomas
- `ci:check` o `ci:release` en rojo
- Falla en algún guard (deps-snapshot, repo-clean, contracts, etc.)

### Acciones inmediatas
1. Identificar el guard exacto que falló (nombre del step).
2. Leer el mensaje completo (los guards ya entregan diagnóstico explícito).
3. Clasificar:
   - Error de código
   - Drift de dependencias
   - Mutación del repo
   - Configuración CI

### Resolución típica
- **Deps snapshot:** ejecutar `npm run guard:deps-snapshot:write`, revisar diff y commitear.
- **Repo clean:** identificar script/test que modifica archivos; corregir.
- **Contracts/UX:** ajustar implementación o tests.

### Cierre
- Re-ejecutar `npm run ci:check`
- Confirmar verde antes de merge.

---

## 2. Incidente: Hallazgo CRITICAL/HIGH (CodeQL o Trivy)

### Síntomas
- Check de seguridad en rojo
- Alerta en GitHub Security

### Acciones inmediatas
1. Abrir el run del workflow de seguridad.
2. Identificar:
   - Herramienta (CodeQL / Trivy)
   - Severidad
   - Archivo o dependencia afectada

### Flujo de decisión
- **Mitigable de inmediato:** aplicar fix/bump y validar.
- **No mitigable hoy:** evaluar excepción controlada.

### Resolución
- Dependencias:
  - Bump patch/minor
  - Si cambia lockfile: `guard:deps-snapshot:write`
- Código:
  - Aplicar fix recomendado
  - Agregar test si corresponde

### Excepción (solo si aplica)
- Registrar en `DECISION_LOG.md`
- Incluir:
  - ID del hallazgo
  - Justificación
  - Mitigación compensatoria
  - Fecha de revisión

---

## 3. Incidente: Dependabot abre MAJOR update

### Síntomas
- PR con `update-type: semver-major`
- Gate `deps-major-label-gate` en rojo

### Acciones
1. Revisar changelog/breaking changes.
2. Evaluar impacto funcional y técnico.
3. Decidir:
   - Postergar
   - Implementar ahora

### Requisitos para merge
- Label `deps-major-approved`
- Label `release:major`
- (Si corresponde) Decision Log

---

## 4. Incidente: Ruptura de baseline (lockfile / snapshot)

### Síntomas
- `guard:lockfile-policy` o `guard:deps-snapshot` falla

### Acciones
1. Confirmar si el cambio fue intencional.
2. Si fue intencional:
   - Regenerar baseline
   - Commit conjunto (código + baseline)
3. Si NO fue intencional:
   - Revertir cambio
   - Identificar origen

---

## 5. Incidente: Mutación silenciosa del repo (repo-clean)

### Síntomas
- `guard:repo-clean` falla en CI
- Warning local por archivos modificados

### Acciones
1. Revisar `git status --porcelain`
2. Identificar proceso que escribe archivos:
   - tests
   - scripts
   - formatters
3. Corregir para que no escriba en CI

---

## 6. Rollback

### Cuándo aplicar
- Incidente en main
- Riesgo funcional o de seguridad alto

### Procedimiento
1. Revertir commit problemático.
2. Confirmar CI verde.
3. Documentar incidente (Decision Log si aplica).

---

## 7. Comunicación mínima (cuando aplique)
- Incidente de seguridad: registrar decisión y mitigación.
- Incidente mayor: dejar constancia en Decision Log.
- No se requiere comunicación externa salvo impacto público.

---

## 8. Evidencia
- GitHub Actions runs
- GitHub Security alerts
- Decision Log
- Audit Dossier

---

## 9. Principio rector
> Ningún incidente se resuelve "a mano".
> Todo queda documentado, reproducible y verificable.
