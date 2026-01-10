# RFC-2026-001 — RFC Framework para gobernanza post-congelación

**Estado:** Accepted  
**Autor:** Equipo PAES-Tutor  
**Fecha:** 2026-01-10  

---

## 1. Contexto y problema
El proyecto PAES-Tutor alcanzó un estado de **congelación Enterprise** con:
- Baselines definidos
- Guards activos
- CI como autoridad técnica final

Sin un mecanismo formal de decisión, los cambios futuros corren el riesgo de:
- Introducir regresiones graduales
- Erosionar contracts y guards
- Fragmentar decisiones en PRs sin trazabilidad

---

## 2. Objetivo
Establecer un **RFC Framework** como mecanismo oficial para:
- Analizar cambios relevantes antes de codificar
- Documentar decisiones arquitectónicas
- Proteger el estado congelado del sistema
- Mantener trazabilidad histórica de decisiones

---

## 3. No-objetivos
Este RFC **no** busca:
- Reemplazar el CI como autoridad final
- Introducir burocracia innecesaria
- Obligar RFCs para cambios cosméticos
- Definir tooling automático de enforcement

---

## 4. Alcance
El framework aplica a cambios que afecten:
- Contracts, invariants o guards
- Error handling y modelo de errores
- Baselines de performance y UX
- Variables de entorno, startup y health checks
- Orden y reglas del CI
- Arquitectura y superficie pública de APIs

---

## 5. Propuesta
Adoptar un **RFC Framework documental** que:
- Viva en `docs/rfc/`
- Use una plantilla única (`TEMPLATE.md`)
- Defina estados claros (Draft → Accepted → Implemented → Closed)
- Establezca la regla: **"No RFC, no cambio relevante"**

---

## 6. Compatibilidad
El framework:
- No rompe backward compatibility
- No modifica contracts existentes
- No altera el CI ni su orden
- Es compatible con el estado congelado actual

---

## 7. Riesgos
- Riesgo de fricción percibida en cambios futuros
- Riesgo de no adopción disciplinada del framework

---

## 8. Mitigaciones
- Mantener el RFC como documento liviano
- Aplicar solo a cambios relevantes
- Usar criterio conservador: si hay duda, se crea RFC

---

## 9. Plan de implementación
1. Crear estructura `docs/rfc/`
2. Crear README del framework
3. Crear plantilla oficial
4. Documentar el RFC inicial (este documento)

---

## 10. Plan de validación
- Existencia de `docs/rfc/README.md`
- Existencia de `docs/rfc/TEMPLATE.md`
- RFC inicial documentado y marcado como Accepted
- No impacto en CI ni código

---

## 11. Rollback
Si el framework no resulta efectivo:
- Puede dejar de usarse sin impacto técnico
- No requiere revertir código
- No afecta producción ni baselines

---

## 12. Decisión
**Resultado:** Accepted  
**Responsable de la decisión:** Maintainers del proyecto  
**Justificación:**  
El RFC Framework es necesario para sostener el nivel Enterprise extremo del proyecto sin degradar el estado congelado.

---

## 13. Evidencias
- `docs/rfc/README.md`
- `docs/rfc/TEMPLATE.md`
- Estado congelado documentado del proyecto
