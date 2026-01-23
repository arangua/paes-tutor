# 🚀 Guía: Ejecutar SonarQube y Corregir Problemas

## 📋 Resumen del Proceso

1. **Configurar SonarCloud** (o servidor local)
2. **Generar cobertura de tests**
3. **Ejecutar análisis de SonarQube**
4. **Obtener resultados**
5. **Corregir problemas identificados**

---

## 🌟 Opción 1: SonarCloud (Recomendado - No requiere Java)

### Paso 1: Crear cuenta y obtener token

1. **Ir a SonarCloud:**
   - Visita: https://sonarcloud.io/
   - Inicia sesión con tu cuenta de GitHub

2. **Agregar proyecto:**
   - Click en "Add new project"
   - Selecciona tu organización
   - Conecta el repositorio `paes-tutor`
   - SonarCloud detectará automáticamente la configuración

3. **Obtener token:**
   - Ve a: My Account → Security → Generate Token
   - Nombre: `paes-tutor-analysis`
   - Copia el token (solo se muestra una vez)

### Paso 2: Configurar variables de entorno

**En PowerShell (sesión actual):**
```powershell
$env:SONAR_TOKEN="tu_token_aqui"
$env:SONAR_HOST_URL="https://sonarcloud.io"
```

**O crear archivo `.env.local` (permanente):**
```env
SONAR_TOKEN=tu_token_aqui
SONAR_HOST_URL=https://sonarcloud.io
```

### Paso 3: Generar cobertura de tests

```powershell
npm run test:coverage
```

Esto crea `coverage/lcov.info` que SonarQube necesita.

### Paso 4: Ejecutar análisis

```powershell
npx sonar-scanner "-Dsonar.host.url=https://sonarcloud.io" "-Dsonar.login=$env:SONAR_TOKEN"
```

O si usas `.env.local`:
```powershell
npm run sonar
```

### Paso 5: Ver resultados

- Ve a: https://sonarcloud.io/
- Selecciona tu proyecto
- Revisa los problemas encontrados

### Paso 6: Compartir resultados conmigo

**Opción A: Compartir URL del proyecto**
- Copia la URL de tu proyecto en SonarCloud
- Yo puedo ver los problemas y corregirlos

**Opción B: Exportar reporte**
- En SonarCloud, ve a Issues
- Exporta como CSV o JSON
- Compárteme el archivo

**Opción C: Ejecutar y compartir salida**
- Ejecuta el análisis y comparte la salida completa
- Yo puedo identificar los problemas desde ahí

---

## 🖥️ Opción 2: Servidor Local (Requiere Java)

### Paso 1: Instalar Java

```powershell
# Con Chocolatey
choco install openjdk11

# O descargar desde:
# https://adoptium.net/
```

### Paso 2: Configurar JAVA_HOME

```powershell
# Verificar instalación
java -version

# Configurar JAVA_HOME (temporal)
$env:JAVA_HOME="C:\Program Files\Java\jdk-11"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
```

### Paso 3: Descargar SonarQube Server

1. Descargar desde: https://www.sonarqube.org/downloads/
2. Extraer en una carpeta (ej: `C:\sonarqube`)
3. Ejecutar: `StartSonar.bat`
4. Acceder a: http://localhost:9000
5. Usuario: `admin` / Contraseña: `admin` (cambiar en primer inicio)

### Paso 4: Crear proyecto y obtener token

1. En SonarQube, crear nuevo proyecto
2. Generar token para el proyecto
3. Configurar variables de entorno:
   ```powershell
   $env:SONAR_TOKEN="tu_token_aqui"
   $env:SONAR_HOST_URL="http://localhost:9000"
   ```

### Paso 5: Ejecutar análisis

```powershell
npm run test:coverage
npm run sonar:local
```

---

## 🔧 Opción 3: Análisis Manual (Ya tienes esto)

Ya tienes un análisis manual completo en:
- `ANALISIS_SONARQUBE_COMPLETO_2025_12_23_ACTUALIZADO.md`

**Puedo corregir los problemas identificados ahí directamente:**
- Función muy larga (`generateExamWithAI`)
- Magic numbers (12 instancias)
- Duplicación de código (3 áreas)
- Manejo de errores en desencriptación
- Uso de `any` en tipos

---

## 🎯 Recomendación Rápida

**Para empezar rápido, puedo corregir los problemas del análisis manual que ya tienes.**

Si quieres usar SonarQube real:
1. **Usa SonarCloud** (Opción 1) - Es más fácil y no requiere Java
2. **O dime qué problemas específicos quieres que corrija** del análisis manual

---

## 📝 Checklist

### Para SonarCloud:
- [ ] Crear cuenta en SonarCloud
- [ ] Conectar repositorio
- [ ] Obtener token
- [ ] Configurar `SONAR_TOKEN` y `SONAR_HOST_URL`
- [ ] Ejecutar `npm run test:coverage`
- [ ] Ejecutar `npx sonar-scanner`
- [ ] Compartir URL o resultados conmigo

### Para Servidor Local:
- [ ] Instalar Java 11+
- [ ] Configurar JAVA_HOME
- [ ] Descargar SonarQube Server
- [ ] Iniciar servidor
- [ ] Crear proyecto
- [ ] Obtener token
- [ ] Configurar variables de entorno
- [ ] Ejecutar análisis

---

## 🚀 ¿Qué prefieres hacer?

1. **Corregir problemas del análisis manual** (más rápido)
2. **Configurar SonarCloud** (análisis en la nube)
3. **Configurar servidor local** (más control)

¡Dime qué opción prefieres y te ayudo paso a paso!

