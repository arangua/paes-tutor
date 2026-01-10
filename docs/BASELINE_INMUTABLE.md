# Baseline Inmutable — PAES-Tutor

## Estado del proyecto
El proyecto PAES-Tutor se encuentra en **estado congelado (Enterprise)**.

Esto implica que existen elementos que **no deben cambiarse**
salvo mediante **RFC explícito, aprobado y documentado**.

---

## Elementos inmutables

### 1. Orden del CI
El orden actual del CI es **inmutable**:

1. Lint
2. Type check
3. guard:no-global-patches
4. guard:contracts
5. guard:prod-ready
6. guard:ux
7. contracts:test
8. Unit tests
9. Coverage

Cualquier modificación requiere RFC.

---

### 2. Guards existentes
Todos los guards activos son parte del baseline:
- contracts
- prod-ready
- ux
- no-global-patches

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

## Regla final
> **Si no estás seguro de si algo puede cambiarse → no puede.**

La única vía es un RFC aceptado.

---

## Relación con otros documentos
- RFC Framework → decisiones mayores
- Decision Log → decisiones menores
- Este documento → perímetro de protección
