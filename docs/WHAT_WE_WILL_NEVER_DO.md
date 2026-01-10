# What We Will Never Do — PAES-Tutor

## Propósito
Este documento declara explícitamente qué **nunca se hará** en PAES-Tutor, incluso si:
- Parece "más rápido"
- Está de moda
- Alguien lo propone con buenas intenciones

Estas decisiones son **inapelables** y cierran discusiones antes de que empiecen.

---

## Arquitectura y diseño

### ❌ Nunca relajar guards
No se relajarán, eliminarán ni modificarán los guards existentes:
- `guard:contracts`
- `guard:prod-ready`
- `guard:ux`
- `guard:no-global-patches`

Sin RFC explícito y aprobado.

---

### ❌ Nunca cambiar el orden del CI
El orden actual del CI es inalterable:
1. Lint
2. Type check
3. guard:no-global-patches
4. guard:contracts
5. guard:prod-ready
6. guard:ux
7. contracts:test
8. Unit tests
9. Coverage

Cualquier reordenamiento requiere RFC.

---

### ❌ Nunca modificar el modelo de errores sin RFC
El modelo de errores (ContractError, DomainError, SystemError) y su handler:
- No se mezclarán con errores genéricos
- No se cambiarán implícitamente
- No se relajarán para "facilitar desarrollo"

---

### ❌ Nunca romper contracts o invariants
Los contracts y sus invariants:
- No se modificarán sin RFC
- No se relajarán para "flexibilidad"
- No se ignorarán en producción

---

### ❌ Nunca sacrificar type safety
No se introducirán:
- `any` sin justificación extrema
- Type assertions peligrosas
- Bypasses de TypeScript

---

## Testing y calidad

### ❌ Nunca reducir cobertura de tests
No se:
- Eliminarán tests existentes
- Reducirá el umbral de coverage
- Aceptarán PRs sin tests para código nuevo

---

### ❌ Nunca eliminar validaciones de CI
No se:
- Saltarán pasos del CI
- Aceptarán PRs con CI rojo
- Relajarán estándares de calidad

---

## Dependencias y herramientas

### ❌ Nunca introducir dependencias que rompan el baseline
No se agregarán dependencias que:
- Rompan el baseline de performance
- Comprometan seguridad
- Aumenten el bundle size significativamente
- Requieran cambios arquitectónicos mayores

Sin RFC.

---

### ❌ Nunca cambiar el stack core sin RFC
El stack actual (Next.js, React, TypeScript, Prisma, etc.):
- No se reemplazará por "alternativas modernas"
- No se migrará a otros frameworks
- No se cambiará por moda tecnológica

---

## Performance y UX

### ❌ Nunca degradar el baseline de performance
No se aceptarán cambios que:
- Empeoren métricas de performance establecidas
- Aumenten el tiempo de carga
- Degraden la experiencia de usuario

Sin evidencia y RFC.

---

### ❌ Nunca romper el baseline de UX
Los umbrales de UX:
- No se relajarán
- No se ignorarán
- No se modificarán sin evidencia

---

## Seguridad y producción

### ❌ Nunca comprometer seguridad por velocidad
No se:
- Eliminarán validaciones de seguridad
- Aceptarán atajos que comprometan datos
- Relajarán controles de autenticación/autorización

---

### ❌ Nunca hacer cambios que rompan producción
No se:
- Mergearán cambios sin validación de CI
- Aceptarán cambios que rompan health checks
- Modificarán variables de entorno críticas sin RFC

---

## Proceso y gobernanza

### ❌ Nunca hacer cambios relevantes sin RFC
No se implementarán cambios que afecten:
- Contracts, invariants o guards
- Error handling
- Baselines de UX/performance
- Variables de entorno, startup o health checks
- Orden o reglas del CI
- Arquitectura o superficie pública de APIs

Sin RFC explícito.

---

### ❌ Nunca ignorar el estado congelado
El proyecto está en estado Enterprise congelado:
- No se ignorará el framework de gobernanza
- No se harán cambios "rápidos" que rompan el baseline
- No se aceptarán excepciones sin documentar

---

## Regla final
> **Si algo no está explícitamente permitido en este documento o en un RFC aceptado, no se hace.**

La única excepción es un RFC explícito, aprobado y documentado.

---

## Relación con otros documentos
- **BASELINE_INMUTABLE.md** → qué no puede cambiarse
- **RFC Framework** → cómo cambiar lo que sí puede cambiarse
- **Este documento** → qué nunca se hará, punto final
