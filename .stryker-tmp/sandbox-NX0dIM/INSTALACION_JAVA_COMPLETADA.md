# ✅ Instalación de Java Completada

**Fecha:** 2025-01-28  
**Estado:** ✅ **Java 17 instalado y funcionando**

---

## 📋 Resumen

- ✅ **Java 17.0.17** instalado correctamente
- ✅ **Ubicación:** `C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot`
- ✅ **SonarScanner** verificado y funcionando

---

## 🔧 Configuración Actual

### Estado Temporal (Sesión Actual)
Java está configurado solo para la sesión actual de PowerShell. Para usarlo, ejecuta:

```powershell
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

### Configuración Permanente (Recomendado)

#### Opción 1: Usar el Script (Requiere Administrador)
```powershell
# Ejecutar PowerShell como Administrador
.\configurar-java.ps1
```

Luego **cerrar y volver a abrir** la terminal.

#### Opción 2: Configuración Manual

1. **Abrir Variables de Entorno del Sistema:**
   - Presiona `Win + R`
   - Escribe: `sysdm.cpl`
   - Ve a la pestaña "Opciones avanzadas"
   - Click en "Variables de entorno"

2. **Agregar JAVA_HOME:**
   - En "Variables del sistema", click "Nueva"
   - Nombre: `JAVA_HOME`
   - Valor: `C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot`
   - Click "Aceptar"

3. **Agregar Java al PATH:**
   - Selecciona "Path" en "Variables del sistema"
   - Click "Editar"
   - Click "Nuevo"
   - Agrega: `%JAVA_HOME%\bin`
   - Click "Aceptar" en todas las ventanas

4. **Reiniciar la terminal** para aplicar los cambios

---

## ✅ Verificación

### Verificar Instalación
```powershell
java -version
```

**Salida esperada:**
```
openjdk version "17.0.17" 2025-10-21 LTS
OpenJDK Runtime Environment Microsoft-12574423 (build 17.0.17+10-LTS)
OpenJDK 64-Bit Server VM Microsoft-12574423 (build 17.0.17+10-LTS, mixed mode, sharing)
```

### Verificar JAVA_HOME
```powershell
echo $env:JAVA_HOME
```

**Salida esperada:**
```
C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot
```

### Verificar SonarScanner
```powershell
npx sonar-scanner --version
```

**Salida esperada:**
```
INFO: SonarQube Scanner 3.1.0.1141
INFO: Java 17.0.17 Microsoft (64-bit)
```

---

## 🚀 Próximos Pasos

### 1. Configurar SonarQube (Opcional)

Si quieres usar SonarQube localmente:

1. **Descargar SonarQube Server:**
   - https://www.sonarqube.org/downloads/
   - Extraer y ejecutar `StartSonar.bat`

2. **Acceder al servidor:**
   - http://localhost:9000
   - Usuario: `admin` / Contraseña: `admin` (cambiar en primer inicio)

3. **Crear proyecto y obtener token**

4. **Configurar variables de entorno:**
   ```env
   SONAR_TOKEN=tu_token_del_servidor
   SONAR_HOST_URL=http://localhost:9000
   ```

5. **Ejecutar análisis:**
   ```bash
   npm run test:coverage
   npm run sonar:local
   ```

### 2. Usar SonarCloud (Recomendado - Más Fácil)

**Ventajas:**
- ✅ No requiere servidor local
- ✅ Gratis para proyectos open source
- ✅ Integración con GitHub/GitLab

**Pasos:**
1. Crear cuenta en https://sonarcloud.io/
2. Conectar repositorio
3. Obtener token
4. Configurar variables de entorno
5. Ejecutar análisis

---

## 📝 Notas

- **Java 17** es la versión recomendada para SonarQube
- La instalación se realizó usando **winget** (Windows Package Manager)
- Java está instalado en la ubicación estándar de Microsoft
- SonarScanner ya funciona correctamente con esta instalación

---

## 🔍 Solución de Problemas

### Error: "java no se reconoce"
**Solución:** Configurar JAVA_HOME y PATH (ver arriba)

### Error: "JAVA_HOME not found"
**Solución:** Ejecutar el script `configurar-java.ps1` como Administrador

### Error: SonarScanner no encuentra Java
**Solución:** Verificar que JAVA_HOME esté configurado correctamente

---

**Estado:** ✅ **Listo para usar SonarQube**

