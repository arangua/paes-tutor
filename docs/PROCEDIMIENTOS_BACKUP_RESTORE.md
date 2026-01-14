# 💾 Procedimientos de Backup y Restore - Enterprise

**Fecha:** 2025-01-28  
**Versión:** 1.0.0 Enterprise

---

## 📋 **Resumen**

Este documento describe los procedimientos enterprise para backup y restore de la aplicación PAES Tutor, incluyendo base de datos, archivos y configuración.

---

## 🎯 **Componentes a Respaldar**

### **1. Base de Datos** 🔴 **CRÍTICO**

**Ubicación:** Definida por `DATABASE_URL`

**Tipo:** SQLite (desarrollo) o PostgreSQL (producción)

**Frecuencia de Backup:**
- **Producción:** Diario (automático recomendado)
- **Desarrollo:** Antes de cambios importantes

### **2. Variables de Entorno** 🔴 **CRÍTICO**

**Archivos:**
- `.env.production` (NO en repositorio)
- Configuración en plataforma de despliegue

**Frecuencia:** Cada vez que se modifiquen

### **3. Archivos Generados** 🟡 **IMPORTANTE**

**Ubicaciones:**
- `data/pdfs/` - PDFs descargados
- `data/temp/` - Archivos temporales

**Frecuencia:** Semanal (si contienen datos importantes)

---

## 💾 **PROCEDIMIENTOS DE BACKUP**

### **1. Backup de Base de Datos SQLite**

#### **Método Manual:**

```bash
# Backup simple
cp paes.db paes.db.backup.$(date +%Y%m%d_%H%M%S)

# Backup con compresión
sqlite3 paes.db ".backup 'paes.db.backup.$(date +%Y%m%d_%H%M%S).db'"
gzip paes.db.backup.*.db
```

#### **Script Automatizado:**

```bash
#!/bin/bash
# scripts/backup-database.sh

BACKUP_DIR="./backups"
DB_FILE="./paes.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/paes.db.backup.$TIMESTAMP.db"

mkdir -p "$BACKUP_DIR"

# Crear backup
sqlite3 "$DB_FILE" ".backup '$BACKUP_FILE'"

# Comprimir
gzip "$BACKUP_FILE"

echo "✅ Backup creado: $BACKUP_FILE.gz"
```

#### **Frecuencia Recomendada:**
- **Producción:** Diario (cron job)
- **Desarrollo:** Antes de cambios importantes

---

### **2. Backup de Base de Datos PostgreSQL**

#### **Método Manual:**

```bash
# Backup completo
pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql

# Backup comprimido
pg_dump $DATABASE_URL | gzip > backup_$(date +%Y%m%d_%H%M%S).sql.gz
```

#### **Script Automatizado:**

```bash
#!/bin/bash
# scripts/backup-postgres.sh

BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/postgres.backup.$TIMESTAMP.sql.gz"

mkdir -p "$BACKUP_DIR"

# Backup comprimido
pg_dump $DATABASE_URL | gzip > "$BACKUP_FILE"

echo "✅ Backup creado: $BACKUP_FILE"
```

---

### **3. Backup de Variables de Entorno**

#### **Método Manual:**

```bash
# Exportar variables (NO incluir secrets en logs)
env | grep -E "^(DATABASE_URL|NEXTAUTH_|ENCRYPTION_|UPSTASH_)" > env.backup.txt

# O usar gestor de secrets de la plataforma
# Vercel: vercel env pull .env.production
```

#### **Recomendación:**
- ✅ Usar gestores de secrets de la plataforma
- ✅ Documentar ubicación de cada variable
- ✅ Mantener backup encriptado

---

### **4. Backup de Archivos Generados**

```bash
# Backup de PDFs y archivos temporales
tar -czf data_backup_$(date +%Y%m%d_%H%M%S).tar.gz data/pdfs/ data/temp/
```

---

## 🔄 **PROCEDIMIENTOS DE RESTORE**

### **1. Restore de Base de Datos SQLite**

#### **Desde Backup Simple:**

```bash
# Detener aplicación
# Copiar backup
cp paes.db.backup.YYYYMMDD_HHMMSS paes.db

# Verificar integridad
sqlite3 paes.db "PRAGMA integrity_check;"
```

#### **Desde Backup Comprimido:**

```bash
# Descomprimir
gunzip paes.db.backup.YYYYMMDD_HHMMSS.db.gz

# Restaurar
sqlite3 paes.db < paes.db.backup.YYYYMMDD_HHMMSS.db

# O usar .restore
sqlite3 paes.db ".restore 'paes.db.backup.YYYYMMDD_HHMMSS.db'"
```

---

### **2. Restore de Base de Datos PostgreSQL**

```bash
# Restore desde backup
gunzip < backup_YYYYMMDD_HHMMSS.sql.gz | psql $DATABASE_URL

# O desde archivo sin comprimir
psql $DATABASE_URL < backup_YYYYMMDD_HHMMSS.sql
```

---

### **3. Restore de Variables de Entorno**

```bash
# Cargar desde archivo
source env.backup.txt

# O configurar en plataforma
# Vercel: vercel env add VARIABLE_NAME
```

---

## 🚨 **PROCEDIMIENTOS DE RECUPERACIÓN ANTE DESASTRES**

### **Escenario 1: Pérdida Completa de Base de Datos**

**Pasos:**

1. **Detener aplicación**
   ```bash
   # En producción, desactivar despliegue o escalar a 0
   ```

2. **Identificar último backup válido**
   ```bash
   ls -lt backups/ | head -5
   ```

3. **Restaurar backup**
   ```bash
   # SQLite
   sqlite3 paes.db ".restore 'backups/paes.db.backup.LATEST.db'"
   
   # PostgreSQL
   gunzip < backups/postgres.backup.LATEST.sql.gz | psql $DATABASE_URL
   ```

4. **Verificar integridad**
   ```bash
   # SQLite
   sqlite3 paes.db "PRAGMA integrity_check;"
   
   # PostgreSQL
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM User;"
   ```

5. **Reiniciar aplicación**
   ```bash
   npm run start
   ```

6. **Verificar funcionalidad**
   - Health check: `curl https://your-domain.com/api/health`
   - Login de prueba
   - Verificar datos críticos

---

### **Escenario 2: Corrupción de Datos**

**Pasos:**

1. **Identificar alcance del problema**
   ```bash
   # Verificar integridad
   sqlite3 paes.db "PRAGMA integrity_check;"
   ```

2. **Restaurar desde backup más reciente**
   - Seguir pasos de Escenario 1

3. **Si no hay backup reciente:**
   - Intentar reparar: `sqlite3 paes.db ".recover" | sqlite3 paes_recovered.db`
   - Exportar datos críticos manualmente
   - Restaurar desde backup más antiguo y re-importar datos

---

### **Escenario 3: Pérdida de Variables de Entorno**

**Pasos:**

1. **Identificar variables faltantes**
   - Revisar logs de errores
   - Consultar `.env.production.example`

2. **Restaurar desde backup**
   - Si existe backup de variables
   - O desde gestor de secrets de plataforma

3. **Regenerar si es necesario**
   - Secrets pueden regenerarse (requiere re-autenticación de usuarios)
   - API keys deben obtenerse desde proveedores

---

## 🔐 **SEGURIDAD DE BACKUPS**

### **Mejores Prácticas:**

1. ✅ **Encriptar backups que contengan datos sensibles**
   ```bash
   # Encriptar backup
   gpg --symmetric --cipher-algo AES256 backup.sql.gz
   ```

2. ✅ **Almacenar backups en ubicación segura**
   - No en el mismo servidor
   - Usar almacenamiento en la nube (S3, Google Cloud Storage)
   - Con acceso restringido

3. ✅ **Rotar backups antiguos**
   - Mantener últimos 30 días
   - Mantener 1 backup mensual por 12 meses
   - Eliminar backups antiguos automáticamente

4. ✅ **Verificar backups periódicamente**
   - Restaurar en entorno de prueba mensualmente
   - Verificar integridad de backups

---

## 📅 **CRONOGRAMA DE BACKUPS RECOMENDADO**

### **Producción:**

- **Diario:** Base de datos (automático)
- **Semanal:** Archivos generados
- **Mensual:** Backup completo verificado

### **Desarrollo:**

- **Antes de cambios importantes:** Base de datos
- **Antes de migraciones:** Base de datos completa

---

## 🛠️ **SCRIPTS AUTOMATIZADOS**

### **Script de Backup Diario (SQLite)**

```bash
#!/bin/bash
# scripts/backup-daily.sh

BACKUP_DIR="./backups"
DB_FILE="./paes.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/paes.db.backup.$TIMESTAMP.db"

mkdir -p "$BACKUP_DIR"

# Crear backup
sqlite3 "$DB_FILE" ".backup '$BACKUP_FILE'"

# Comprimir
gzip "$BACKUP_FILE"

# Eliminar backups antiguos (mantener últimos 30 días)
find "$BACKUP_DIR" -name "*.db.gz" -mtime +30 -delete

echo "✅ Backup diario completado: $BACKUP_FILE.gz"
```

### **Cron Job (Linux/Mac):**

```bash
# Ejecutar diariamente a las 2 AM
0 2 * * * /path/to/scripts/backup-daily.sh
```

---

## ✅ **CHECKLIST DE BACKUP**

### **Pre-Backup:**
- [ ] Verificar que la aplicación está funcionando
- [ ] Verificar espacio en disco disponible
- [ ] Verificar permisos de escritura

### **Durante Backup:**
- [ ] Backup de base de datos creado
- [ ] Backup comprimido (si aplica)
- [ ] Verificar integridad del backup

### **Post-Backup:**
- [ ] Backup almacenado en ubicación segura
- [ ] Backup verificado (restore de prueba)
- [ ] Documentar fecha y ubicación del backup
- [ ] Eliminar backups antiguos (si aplica)

---

## 📊 **MÉTRICAS Y MONITOREO**

### **Métricas a Monitorear:**

- ✅ Frecuencia de backups exitosos
- ✅ Tamaño de backups
- ✅ Tiempo de restore
- ✅ Integridad de backups

### **Alertas Recomendadas:**

- ⚠️ Backup fallido
- ⚠️ Backup no creado en 24 horas
- ⚠️ Tamaño de backup anormal
- ⚠️ Restore fallido

---

## 🎯 **CONCLUSIÓN**

Este documento proporciona procedimientos enterprise completos para backup y restore. Sigue estos procedimientos para garantizar recuperación ante desastres y mantener continuidad del negocio.

**Última actualización:** 2025-01-28  
**Versión:** 1.0.0 Enterprise








