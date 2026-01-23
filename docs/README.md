# PAES-Tutor — Documentación (Índice)

Este directorio concentra la documentación operativa, análisis y registros históricos del proyecto.
Regla general: evitar documentación suelta en la raíz del repositorio.

---

## 1) Runbooks (operación / incidentes)

**Carpeta:** `docs/runbooks/`

Contiene guías de acción rápida para incidentes recurrentes.

- `ACCION_INMEDIATA_DESCONEXIONES.md`
- `ACCION_INMEDIATA_DESCONEXIONES_REPETIDAS.md`
- `ACCION_INMEDIATA_ERRORES_500.md`

---

## 2) Analysis (análisis técnicos)

**Carpeta:** `docs/analysis/`

### 2.1 SonarQube
**Ruta:** `docs/analysis/sonarqube/`  
Análisis y reportes relacionados con calidad estática y hallazgos SonarQube.

### 2.2 Performance / Lighthouse
**Ruta:** `docs/analysis/perf/`  
Auditorías de rendimiento, Lighthouse y performance web.

### 2.3 UX
**Ruta:** `docs/analysis/ux/`  
Evaluaciones UX y ajustes asociados.

### 2.4 Tests / Regresiones
**Ruta:** `docs/analysis/tests/`  
Documentación sobre suites, estrategia de tests y análisis de regresiones.

### 2.5 Seguridad
**Ruta:** `docs/analysis/security/`  
Análisis de seguridad y correcciones.

### 2.6 General
**Ruta:** `docs/analysis/general/`  
Análisis generales (código completo, exigencia, revisiones estructurales, etc.).

---

## 3) History (histórico del proyecto)

**Carpeta:** `docs/history/`

### 3.1 Documentos "final"
**Ruta:** `docs/history/final/`  
Versiones finales, resúmenes por fases/pasos y cierres de trabajo. Se conserva para trazabilidad.

---

## 4) Archive (respaldo / material fuera de flujo activo)

**Carpeta:** `docs/archive/`

### 4.1 Backups de código
**Ruta:** `docs/archive/code-backups/`  
Respaldo mínimo de archivos puntuales (no sustituye Git). Solo para evidencia histórica.

---

## 5) Reglas de orden (importante)

- Documentación nueva debe vivir en `docs/` (no en la raíz).
- Los reportes generados automáticamente (ej. `playwright-report/`, `.tmp/`) no se versionan.
- El hook `pre-commit` bloquea archivos `.md` nuevos en la raíz (excepto `README.md`).

---
