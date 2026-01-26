# RFC-XXXX — Título corto

Estado: DRAFT | ACCEPTED | REJECTED  
Autor:  
Fecha (Chile): YYYY-MM-DD  
Área: API | DB | Auth | Observabilidad | Infra/CI | UI | Seguridad | Docs  
Impacto: Bajo | Medio | Alto

## 1) Contexto
Qué problema estamos resolviendo y por qué ahora.

## 2) Objetivo
Qué resultado concreto queremos lograr (medible si aplica).

## 3) Alcance
Incluye:
- ...
Excluye:
- ...

## 4) Propuesta
Descripción de la solución propuesta.

### 4.1 Contratos / Compatibilidad (si aplica)
- ¿Cambia Zod schema o shape de respuestas?
- ¿Backwards compatible? Sí/No
- Plan de versioning / deprecación (si aplica)

### 4.2 Datos / Migraciones (si aplica)
- Cambios en Prisma/schema
- Plan de migración
- Plan de rollback

### 4.3 Seguridad (si aplica)
- Amenazas / controles
- Secretos / env vars
- Autorización / autenticación

### 4.4 Observabilidad (si aplica)
- Logs / métricas / trazas
- Health checks afectados
- Alertas (si aplica)

## 5) Alternativas consideradas
- Opción A: pros/contras
- Opción B: pros/contras

## 6) Riesgos y mitigaciones
- Riesgo: ...
  Mitigación: ...

## 7) Plan de implementación
Pasos, PRs esperados, orden recomendado.

## 8) Plan de pruebas
- Unit
- Integration
- E2E (si aplica)
- Contract tests (si aplica)

## 9) Rollout / Rollback
Cómo se despliega y cómo se revierte sin downtime (si aplica).

## 10) Checklist de aceptación
- [ ] CI pasa (lint/test/build)
- [ ] No rompe /api/health
- [ ] Contratos actualizados y validados
- [ ] Documentación actualizada
- [ ] RFC referenciado en PR
