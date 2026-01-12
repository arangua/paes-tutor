# AUDIT DOSSIER — PAES-Tutor

## 1. Identificación
- Proyecto: PAES-Tutor
- Repositorio: paes-tutor (GitHub)
- Stack: Next.js App Router · TypeScript · Vitest · npm 11 · Node 24.11.1
- Fecha: 2026
- Estado: Enterprise-ready (enforcement diferido por plan GitHub)

---

## 2. Resumen Ejecutivo
PAES-Tutor implementa un sistema CI/CD y de gobernanza de nivel Enterprise, con controles
de reproducibilidad, supply-chain, seguridad y auditoría completos.

El único control no aplicado automáticamente es el **bloqueo duro de merges**, debido a
limitaciones del plan GitHub en repositorios privados. Toda la política está definida y
lista para activarse.

---

## 3. CI/CD y Reproducibilidad

### Controles implementados
- Node fijado (.nvmrc + engines)
- npm ci obligatorio
- Lockfile v3
- Snapshot de dependencias transitivas (`name@version`)
- Fingerprint SHA-256 del package-lock.json
- Repo clean (CI determinista)

### Resultado
Builds deterministas y auditables.

---

## 4. Supply-Chain Security

### Dependencias
- Dependabot configurado (schedule semanal)
- Grouping por riesgo
- Major updates con doble aprobación:
  - deps-major-approved
  - release:major

### Provenance
- Build Attestation (OIDC)
- Evidencia documentada y verificable

---

## 5. Seguridad

### Herramientas activas
- CodeQL (security + extended)
- Trivy (HIGH / CRITICAL)
- Resultados centralizados en GitHub Security

### Política
- CRITICAL / HIGH bloquean el flujo normal
- Excepciones solo con Decision Log
- Playbook operativo documentado

---

## 6. Gobernanza

### Documentos clave
- BASELINE_INMUTABLE.md (single source of truth)
- DECISION_LOG.md
- Dependency Update Playbook
- Security Findings Playbook

### Automatización
- CODEOWNERS
- PR Template obligatorio
- Auto-labeler por paths
- Release Notes automáticas (Release Drafter)
- Disciplina SemVer forzada

---

## 7. Enforcement (Estado actual)

| Control | Estado |
|------|------|
| CI workflows | Activos |
| Security scans | Activos |
| Required checks | Definidos |
| Bloqueo de merge | Pendiente (plan GitHub) |
| CODEOWNERS enforce | Pendiente (plan GitHub) |

---

## 8. Activación inmediata (cuando aplique)
Al migrar a GitHub Pro/Team:
1. Settings → Branches → Edit rule (main)
2. Activar Require status checks
3. Seleccionar:
   - release-gate
   - deps-major-label-gate
   - Analyze (CodeQL)
   - Security Posture Check
4. Guardar

Tiempo estimado: < 5 minutos.

---

## 9. Evidencia verificable
- GitHub Actions runs
- GitHub Security (Code scanning / SARIF)
- Attestation UI
- Decision Log

---

## 10. Conclusión
PAES-Tutor cumple estándares Enterprise de:
- reproducibilidad,
- seguridad,
- supply-chain,
- gobernanza.

No existen brechas técnicas estructurales.  
El enforcement automático está diferido exclusivamente por decisión de plan.
