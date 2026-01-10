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

### 2026-01-10 — Creación del Decision Log
**Decisión:** Adoptar un Decision Log mínimo post-congelación.  
**Contexto:** Necesidad de registrar criterios sin crear RFCs innecesarios.  
**Impacto:** Mejora trazabilidad y coherencia sin fricción.  
**Referencia:** RFC-2026-001
