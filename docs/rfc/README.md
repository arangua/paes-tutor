# RFC Framework — PAES-Tutor

## Propósito
Este repositorio se encuentra en **estado congelado (Enterprise)**.
Todo cambio relevante posterior a la congelación debe estar:
- Justificado
- Analizado
- Documentado
- Trazable

El mecanismo oficial para ello es el **RFC (Request for Comments)**.

El RFC **no reemplaza al CI**:  
👉 el **CI sigue siendo la autoridad técnica final**.  
👉 el **RFC es la autoridad humana y documental**.

---

## ¿Qué es un RFC?
Un RFC es un documento que describe:
- Un problema real
- Una propuesta de cambio
- Sus riesgos
- Sus mitigaciones
- Su validación mediante CI

No es código.  
Es la **decisión formal previa al código**.

---

## Estados de un RFC
- **Draft**: idea en análisis, sin aprobación.
- **Accepted**: decisión tomada, puede implementarse.
- **Implemented**: código mergeado, CI verde.
- **Closed**: documentado, enlazado y finalizado.

---

## ¿Cuándo es obligatorio un RFC?
Un RFC es obligatorio cuando un cambio afecta:
- Contracts, invariants o guards
- Error model o error handling
- Baseline de performance o UX
- Variables de entorno, startup o health checks
- Orden o reglas del CI
- Superficie pública de APIs
- Seguridad, observabilidad o arquitectura

Si hay duda → **se requiere RFC**.

---

## ¿Cuándo NO es obligatorio?
- Cambios cosméticos de UI
- Fixes internos sin impacto en contracts ni comportamiento
- Ajustes de texto, estilos o comentarios

---

## Regla fundamental
> **No RFC, no cambio relevante.**

Las excepciones deben documentarse explícitamente.

---

## Ubicación
Todos los RFC viven en:


docs/rfc/YYYY/RFC-YYYY-NNN_slug.md


Ejemplo:


docs/rfc/2026/RFC-2026-001_rfc-framework.md
