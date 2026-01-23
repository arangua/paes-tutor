# 🔧 Configuración Completa de SonarQube - PAES Tutor

## ✅ Estado Actual

### Configuración Lista
- ✅ `sonar-project.properties` - Configurado
- ✅ Scripts en `package.json` - Agregados
- ✅ Documentación - Creada

### Pendiente
- ⚠️ **Java no está instalado o no está en PATH**
- ⚠️ **SonarScanner necesita Java para ejecutarse**

---

## 🚀 Opciones para Ejecutar SonarQube

### Opción 1: SonarCloud (Recomendado - Más Fácil) ⭐

**Ventajas:**
- ✅ No requiere instalar Java
- ✅ No requiere servidor local
- ✅ Gratis para proyectos open source
- ✅ Integración con GitHub/GitLab
- ✅ Análisis automático en cada push

**Pasos:**

1. **Crear cuenta en SonarCloud**
   - Ir a https://sonarcloud.io/
   - Iniciar sesión con GitHub/GitLab

2. **Agregar proyecto**
   - Conectar tu repositorio
   - SonarCloud detectará automáticamente la configuración

3. **Obtener token**
   - Settings → Security → Generate Token
   - Copiar el token

4. **Configurar variables de entorno**
   ```env
   SONAR_TOKEN=tu_token_de_sonarcloud
   SONAR_HOST_URL=https://sonarcloud.io
   ```

5. **Ejecutar análisis**
   ```bash
   npm run test:coverage
   npm run sonar
   ```

---

### Opción 2: SonarQube Server Local

**Requisitos:**
- Java 11+ instalado
- SonarQube Server ejecutándose
- Base de datos (PostgreSQL recomendado)

**Pasos:**

1. **Instalar Java**
   ```powershell
   # Con Chocolatey
   choco install openjdk11
   
   # O descargar desde:
   # https://adoptium.net/
   ```

2. **Configurar JAVA_HOME**
   ```powershell
   # Agregar a variables de entorno del sistema:
   JAVA_HOME=C:\Program Files\Java\jdk-11
   PATH=%JAVA_HOME%\bin;%PATH%
   ```

3. **Descargar SonarQube Server**
   - https://www.sonarqube.org/downloads/
   - Extraer y ejecutar `StartSonar.bat`

4. **Acceder al servidor**
   - http://localhost:9000
   - Usuario: admin / Contraseña: admin (cambiar en primer inicio)

5. **Crear proyecto y obtener token**

6. **Configurar variables de entorno**
   ```env
   SONAR_TOKEN=tu_token_del_servidor_local
   SONAR_HOST_URL=http://localhost:9000
   ```

7. **Ejecutar análisis**
   ```bash
   npm run test:coverage
   npm run sonar:local
   ```

---

### Opción 3: Usar SonarScanner CLI (Sin Java)

**Alternativa más ligera:**

1. **Instalar SonarScanner CLI**
   ```bash
   npm install --save-dev @sonarsource/sonar-scanner-cli
   ```

2. **Actualizar scripts en package.json**
   ```json
   {
     "scripts": {
       "sonar": "sonar-scanner-cli",
       "sonar:local": "sonar-scanner-cli -Dsonar.host.url=http://localhost:9000"
     }
   }
   ```

---

## 📊 Preparar Cobertura de Tests

**IMPORTANTE:** SonarQube necesita el reporte de cobertura antes de ejecutar:

```bash
# Generar reporte de cobertura
npm run test:coverage

# Esto crea: coverage/lcov.info
# SonarQube usará este archivo para mostrar cobertura
```

---

## 🎯 Recomendación

**Para empezar rápido:** Usar **SonarCloud** (Opción 1)
- No requiere instalaciones locales
- Configuración más simple
- Ideal para proyectos personales o pequeños equipos

**Para uso profesional:** Usar **SonarQube Server Local** (Opción 2)
- Más control sobre la configuración
- No depende de servicios externos
- Requiere más setup inicial

---

## 📝 Checklist de Configuración

### Para SonarCloud:
- [ ] Crear cuenta en SonarCloud
- [ ] Conectar repositorio
- [ ] Obtener token
- [ ] Agregar token a variables de entorno
- [ ] Generar cobertura: `npm run test:coverage`
- [ ] Ejecutar análisis: `npm run sonar`

### Para Servidor Local:
- [ ] Instalar Java 11+
- [ ] Configurar JAVA_HOME
- [ ] Descargar SonarQube Server
- [ ] Iniciar servidor
- [ ] Crear proyecto en servidor
- [ ] Obtener token
- [ ] Agregar token a variables de entorno
- [ ] Generar cobertura: `npm run test:coverage`
- [ ] Ejecutar análisis: `npm run sonar:local`

---

## 🔍 Verificar Configuración

```bash
# Verificar Java (si usas servidor local)
java -version

# Verificar SonarScanner
npx sonar-scanner --version

# Generar cobertura
npm run test:coverage

# Verificar que existe coverage/lcov.info
ls coverage/lcov.info
```

---

## 🚨 Solución de Problemas

### Error: JAVA_HOME not found
**Solución:** Instalar Java y configurar JAVA_HOME en variables de entorno

### Error: No coverage report found
**Solución:** Ejecutar `npm run test:coverage` primero

### Error: Authentication failed
**Solución:** Verificar que SONAR_TOKEN esté configurado correctamente

### Error: Project key already exists
**Solución:** Cambiar `sonar.projectKey` en `sonar-project.properties`

---

**Fecha:** 2025-01-28  
**Estado:** ⚠️ **Configuración lista, falta instalar Java o usar SonarCloud**

