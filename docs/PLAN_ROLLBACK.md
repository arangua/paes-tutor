# 🔄 PLAN DE ROLLBACK - PAES TUTOR

**Fecha de creación:** 2025-01-28  
**Versión:** 1.0.0  
**Estado:** ✅ Listo para uso

---

## 📋 ÍNDICE

1. [Información General](#información-general)
2. [Criterios de Rollback](#criterios-de-rollback)
3. [Procedimientos de Rollback](#procedimientos-de-rollback)
4. [Rollback por Plataforma](#rollback-por-plataforma)
5. [Rollback de Base de Datos](#rollback-de-base-de-datos)
6. [Rollback de Variables de Entorno](#rollback-de-variables-de-entorno)
7. [Verificación Post-Rollback](#verificación-post-rollback)
8. [Tiempos Estimados](#tiempos-estimados)
9. [Checklist de Rollback](#checklist-de-rollback)

---

## 📊 INFORMACIÓN GENERAL

### Plataformas de Despliegue

- **Vercel** (Recomendado) - Despliegue automático desde Git
- **Docker** - Contenedores (alternativa)
- **Base de Datos:** PostgreSQL/SQLite (Prisma)
- **Caché:** Upstash Redis
- **CI/CD:** GitHub Actions

### Versiones y Tags

**IMPORTANTE:** Antes de cada despliegue a producción, crear un tag de Git:

```bash
# Crear tag antes de desplegar
git tag -a v1.0.0-production-YYYYMMDD-HHMMSS -m "Release producción YYYY-MM-DD"
git push origin v1.0.0-production-YYYYMMDD-HHMMSS
```

Esto permite rollback rápido a una versión conocida estable.

---

## 🚨 CRITERIOS DE ROLLBACK

### Rollback Inmediato (Crítico)

Ejecutar rollback inmediato si:

- ❌ **Errores críticos en producción** que afectan >10% de usuarios
- ❌ **Pérdida de datos** o corrupción de datos
- ❌ **Vulnerabilidades de seguridad** críticas descubiertas
- ❌ **Caída completa del servicio** (>5 minutos)
- ❌ **Errores de autenticación** que impiden acceso
- ❌ **Base de datos inaccesible** o migraciones fallidas
- ❌ **Build falla** en producción

### Rollback Planificado (Urgente)

Ejecutar rollback planificado si:

- ⚠️ **Degradación de performance** >50% en tiempos de respuesta
- ⚠️ **Tasa de error** >5% en endpoints críticos
- ⚠️ **Problemas de UI** que afectan funcionalidad principal
- ⚠️ **Problemas de caché** que causan inconsistencias
- ⚠️ **Alertas críticas** de monitoreo no resueltas en 30 minutos

### No Requiere Rollback

No ejecutar rollback si:

- ✅ Problemas menores de UI (estilos, textos)
- ✅ Errores aislados <1% de requests
- ✅ Degradación de performance <10%
- ✅ Problemas no críticos con solución rápida disponible

---

## 🔄 PROCEDIMIENTOS DE ROLLBACK

### Fase 1: Evaluación (5 minutos)

1. **Confirmar el problema:**
   - [ ] Verificar logs de producción
   - [ ] Confirmar que el problema es real y no aislado
   - [ ] Revisar métricas de monitoreo
   - [ ] Identificar la causa raíz si es posible

2. **Decidir rollback:**
   - [ ] Evaluar si cumple criterios de rollback
   - [ ] Notificar al equipo
   - [ ] Documentar el problema

3. **Preparar rollback:**
   - [ ] Identificar versión estable anterior (tag o commit)
   - [ ] Verificar que la versión anterior está disponible
   - [ ] Preparar comandos de rollback

### Fase 2: Ejecución (10-30 minutos según plataforma)

Seguir procedimientos específicos por plataforma (ver secciones siguientes).

### Fase 3: Verificación (10 minutos)

1. **Verificar funcionalidad:**
   - [ ] Health check responde correctamente
   - [ ] Endpoints principales funcionan
   - [ ] Autenticación funciona
   - [ ] Base de datos accesible
   - [ ] Caché funcionando

2. **Verificar métricas:**
   - [ ] Tasa de error <1%
   - [ ] Tiempos de respuesta normales
   - [ ] Sin alertas críticas

3. **Comunicación:**
   - [ ] Notificar al equipo que rollback completado
   - [ ] Documentar el incidente
   - [ ] Planificar análisis post-mortem

---

## 🚀 ROLLBACK POR PLATAFORMA

### Vercel (Recomendado)

#### Opción 1: Rollback a Deployment Anterior (Más Rápido - 2-5 minutos)

1. **Acceder a Vercel Dashboard:**
   - Ir a https://vercel.com/dashboard
   - Seleccionar proyecto `paes-tutor`
   - Ir a pestaña "Deployments"

2. **Identificar deployment estable:**
   - Buscar el último deployment que funcionaba correctamente
   - Verificar que tiene el check verde ✅
   - Anotar el hash del commit

3. **Promover a producción:**
   - Click en los tres puntos (...) del deployment estable
   - Seleccionar "Promote to Production"
   - Confirmar el cambio

4. **Verificar:**
   - Esperar 1-2 minutos para propagación
   - Verificar que el deployment está activo
   - Probar la aplicación

**Tiempo estimado:** 2-5 minutos

#### Opción 2: Rollback vía Git (Más Control - 10-15 minutos)

1. **Identificar versión estable:**
   ```bash
   # Ver tags disponibles
   git tag -l "v*production*"
   
   # Ver commits recientes
   git log --oneline -10
   ```

2. **Crear branch de rollback:**
   ```bash
   # Desde el tag o commit estable
   git checkout -b rollback/YYYYMMDD-HHMMSS v1.0.0-production-YYYYMMDD-HHMMSS
   # O desde commit específico
   git checkout -b rollback/YYYYMMDD-HHMMSS <commit-hash>
   ```

3. **Push y despliegue:**
   ```bash
   git push origin rollback/YYYYMMDD-HHMMSS
   ```

4. **En Vercel:**
   - Vercel detectará el nuevo branch
   - Desplegará automáticamente
   - Promover a producción si es necesario

**Tiempo estimado:** 10-15 minutos

#### Opción 3: Revertir Commit (Si el problema está en main)

```bash
# Revertir el último commit problemático
git revert HEAD

# O revertir commit específico
git revert <commit-hash>

# Push
git push origin main
```

Vercel desplegará automáticamente el revert.

**Tiempo estimado:** 5-10 minutos

### Docker

Si se despliega con Docker:

1. **Identificar imagen estable:**
   ```bash
   # Ver imágenes disponibles
   docker images | grep paes-tutor
   ```

2. **Rollback a imagen anterior:**
   ```bash
   # Detener contenedor actual
   docker stop paes-tutor-production
   
   # Iniciar con imagen anterior
   docker run -d \
     --name paes-tutor-production \
     -p 3000:3000 \
     --env-file .env.production \
     paes-tutor:v1.0.0-stable-YYYYMMDD
   ```

3. **Verificar:**
   ```bash
   docker ps
   docker logs paes-tutor-production
   ```

**Tiempo estimado:** 5-10 minutos

---

## 🗄️ ROLLBACK DE BASE DE DATOS

### IMPORTANTE: Migraciones de Prisma

**⚠️ ADVERTENCIA:** Las migraciones de Prisma pueden ser destructivas. Siempre hacer backup antes de migrar.

#### Si la migración falló o causó problemas:

1. **Verificar estado actual:**
   ```bash
   npx prisma migrate status
   ```

2. **Rollback de migración específica:**
   ```bash
   # Ver historial de migraciones
   ls prisma/migrations/
   
   # Si necesitas revertir, crear migración de rollback
   npx prisma migrate dev --create-only --name rollback_YYYYMMDD
   # Editar la migración para revertir cambios
   # Aplicar migración
   npx prisma migrate deploy
   ```

3. **Restaurar desde backup (si es necesario):**
   ```bash
   # Si tienes backup de base de datos
   # Restaurar backup según tu proveedor de DB
   # PostgreSQL:
   pg_restore -d paes_tutor_prod backup_YYYYMMDD.dump
   
   # SQLite:
   cp backup_YYYYMMDD.db database.db
   ```

#### Si no hay migraciones pero hay datos corruptos:

1. **Restaurar desde backup:**
   - Usar el último backup válido
   - Verificar integridad del backup
   - Restaurar en base de datos de staging primero para verificar

2. **Verificar integridad:**
   ```bash
   npx prisma db pull
   npx prisma generate
   npm run test:run  # Verificar que todo funciona
   ```

**Tiempo estimado:** 15-60 minutos (depende del tamaño de la DB)

---

## 🔐 ROLLBACK DE VARIABLES DE ENTORNO

### Si cambios en variables causaron problemas:

1. **En Vercel:**
   - Ir a Settings > Environment Variables
   - Revertir cambios a valores anteriores
   - Guardar cambios
   - Redeploy (o esperar a que se apliquen automáticamente)

2. **En Docker:**
   ```bash
   # Editar .env.production
   # Revertir cambios
   # Reiniciar contenedor
   docker restart paes-tutor-production
   ```

3. **Verificar:**
   - Verificar que las variables están correctas
   - Probar endpoints que usan esas variables
   - Revisar logs para confirmar

**Tiempo estimado:** 5-10 minutos

---

## ✅ VERIFICACIÓN POST-ROLLBACK

### Checklist de Verificación (10 minutos)

#### 1. Health Check
- [ ] `GET /api/health` responde 200 OK
- [ ] Respuesta incluye estado de servicios (DB, Redis, etc.)

#### 2. Endpoints Críticos
- [ ] `POST /api/auth/signin` - Autenticación funciona
- [ ] `GET /api/exams` - Listar exámenes funciona
- [ ] `POST /api/attempts` - Crear intento funciona
- [ ] `GET /api/dashboard` - Dashboard carga correctamente

#### 3. Base de Datos
- [ ] Conexión a DB exitosa
- [ ] Queries básicas funcionan
- [ ] Sin errores en logs relacionados con DB

#### 4. Caché (Redis)
- [ ] Conexión a Redis exitosa
- [ ] Rate limiting funciona
- [ ] Caché de datos funciona

#### 5. Métricas
- [ ] Tasa de error <1%
- [ ] Tiempos de respuesta <500ms (p95)
- [ ] Sin alertas críticas en monitoreo

#### 6. UI/UX
- [ ] Página principal carga correctamente
- [ ] Login funciona
- [ ] Dashboard se muestra correctamente
- [ ] Sin errores en consola del navegador

### Script de Verificación Rápida

```bash
# Health check
curl https://tu-dominio.com/api/health

# Verificar versión (si está expuesta)
curl https://tu-dominio.com/api/version

# Verificar logs recientes (si tienes acceso)
# Revisar logs de Vercel o Docker
```

---

## ⏱️ TIEMPOS ESTIMADOS

| Escenario | Tiempo Mínimo | Tiempo Máximo |
|-----------|---------------|---------------|
| **Rollback Vercel (Promote)** | 2 min | 5 min |
| **Rollback Vercel (Git)** | 10 min | 15 min |
| **Rollback Docker** | 5 min | 10 min |
| **Rollback DB (sin backup)** | 15 min | 30 min |
| **Rollback DB (con backup)** | 30 min | 60 min |
| **Rollback Variables** | 5 min | 10 min |
| **Verificación Post-Rollback** | 10 min | 15 min |

**Total estimado (rollback simple):** 15-30 minutos  
**Total estimado (rollback con DB):** 45-90 minutos

---

## 📋 CHECKLIST DE ROLLBACK

### Pre-Rollback

- [ ] Problema confirmado y documentado
- [ ] Criterios de rollback cumplidos
- [ ] Equipo notificado
- [ ] Versión estable identificada
- [ ] Backup de base de datos verificado (si aplica)

### Durante Rollback

- [ ] Procedimiento de rollback iniciado
- [ ] Deployment anterior promovido / código revertido
- [ ] Variables de entorno verificadas
- [ ] Base de datos verificada (si aplica)
- [ ] Rollback completado

### Post-Rollback

- [ ] Health check pasa
- [ ] Endpoints críticos funcionan
- [ ] Métricas dentro de rangos normales
- [ ] Sin alertas críticas
- [ ] Equipo notificado de completitud
- [ ] Incidente documentado
- [ ] Post-mortem planificado

---

## 📝 DOCUMENTACIÓN DEL INCIDENTE

Después de cada rollback, documentar:

1. **Fecha y hora del rollback**
2. **Causa raíz del problema**
3. **Versión que causó el problema**
4. **Versión a la que se hizo rollback**
5. **Tiempo total del rollback**
6. **Impacto en usuarios**
7. **Acciones correctivas tomadas**
8. **Lecciones aprendidas**

Template:

```markdown
## Incidente: [Título]

**Fecha:** YYYY-MM-DD HH:MM
**Duración:** X minutos
**Impacto:** [Alto/Medio/Bajo]

### Causa Raíz
[Descripción del problema]

### Acciones Tomadas
- Rollback a versión: vX.X.X
- [Otras acciones]

### Lecciones Aprendidas
- [Punto 1]
- [Punto 2]

### Acciones Preventivas
- [ ] [Acción 1]
- [ ] [Acción 2]
```

---

## 🆘 CONTACTOS DE EMERGENCIA

- **Equipo de Desarrollo:** [Agregar contactos]
- **DevOps:** [Agregar contactos]
- **Product Owner:** [Agregar contactos]

---

## 📚 REFERENCIAS

- [Documentación de Vercel - Rollback](https://vercel.com/docs/deployments/rollback)
- [Documentación de Prisma - Migrations](https://www.prisma.io/docs/concepts/components/prisma-migrate)
- [Git - Revert](https://git-scm.com/docs/git-revert)

---

**Última actualización:** 2025-01-28  
**Versión del documento:** 1.0.0  
**Próxima revisión:** 2025-02-28

