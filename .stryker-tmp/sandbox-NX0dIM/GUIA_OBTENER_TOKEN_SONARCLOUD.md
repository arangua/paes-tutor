# 🔑 Guía: Obtener Token de SonarCloud

## 📋 Pasos para Obtener el Token

### Paso 1: Crear Cuenta en SonarCloud

1. **Ir a SonarCloud**
   - Abre tu navegador y ve a: https://sonarcloud.io/

2. **Iniciar Sesión**
   - Click en el botón **"Log in"** (arriba a la derecha)
   - Selecciona **"Log in with GitHub"**
   - Autoriza SonarCloud para acceder a tu cuenta de GitHub

### Paso 2: Agregar tu Proyecto

1. **Crear Organización (si es necesario)**
   - Si es tu primera vez, SonarCloud te pedirá crear una organización
   - Puedes usar tu nombre de usuario de GitHub o crear una organización

2. **Agregar Proyecto**
   - Click en **"Add new project"** o **"+"** (arriba)
   - Selecciona **"From GitHub"**
   - Busca y selecciona tu repositorio: `arangua/paes-tutor`
   - Click en **"Set Up"** o **"Configure"**

3. **Configuración del Proyecto**
   - SonarCloud detectará automáticamente tu `sonar-project.properties`
   - Si todo está bien, verás la configuración del proyecto
   - Click en **"Continue"** o **"Save"**

### Paso 3: Obtener el Token

1. **Ir a Configuración de Seguridad**
   - Click en tu **avatar/perfil** (arriba a la derecha)
   - Selecciona **"My Account"** o **"Account"**
   - En el menú lateral, click en **"Security"**

2. **Generar Token**
   - En la sección **"Generate Tokens"**
   - En el campo **"Name"**, escribe: `paes-tutor-token` (o el nombre que prefieras)
   - En **"Type"**, selecciona: **"Global Analysis Token"** (para análisis de cualquier proyecto)
     - O **"Project Analysis Token"** si solo quieres para este proyecto específico
   - Click en **"Generate"**

3. **Copiar el Token**
   - ⚠️ **IMPORTANTE:** El token se mostrará **SOLO UNA VEZ**
   - **Copia el token inmediatamente** y guárdalo en un lugar seguro
   - Si lo pierdes, tendrás que generar uno nuevo

### Paso 4: Configurar el Token Localmente

Una vez que tengas el token, configúralo en tu proyecto:

#### Opción A: Variable de Entorno del Sistema (Recomendado)

**Windows PowerShell:**
```powershell
# Configurar para la sesión actual
$env:SONAR_TOKEN="tu_token_aqui"
$env:SONAR_HOST_URL="https://sonarcloud.io"

# Para hacerlo permanente (requiere reiniciar PowerShell)
[System.Environment]::SetEnvironmentVariable('SONAR_TOKEN', 'tu_token_aqui', 'User')
[System.Environment]::SetEnvironmentVariable('SONAR_HOST_URL', 'https://sonarcloud.io', 'User')
```

**Windows CMD:**
```cmd
setx SONAR_TOKEN "tu_token_aqui"
setx SONAR_HOST_URL "https://sonarcloud.io"
```

#### Opción B: Archivo .env.local (Alternativa)

Crear archivo `.env.local` en la raíz del proyecto:

```env
SONAR_TOKEN=tu_token_aqui
SONAR_HOST_URL=https://sonarcloud.io
```

**Nota:** Asegúrate de que `.env.local` esté en `.gitignore` para no subir el token al repositorio.

### Paso 5: Verificar la Configuración

```powershell
# Verificar que las variables estén configuradas
Write-Host "SONAR_TOKEN: $([bool]$env:SONAR_TOKEN)"
Write-Host "SONAR_HOST_URL: $env:SONAR_HOST_URL"
```

---

## 🚀 Ejecutar Análisis de SonarQube

Una vez configurado el token:

```powershell
cd "C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor"

# 1. Generar cobertura de tests primero
npm run test:coverage

# 2. Ejecutar análisis de SonarQube
$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
npx sonar-scanner "-Dsonar.host.url=https://sonarcloud.io" "-Dsonar.login=$env:SONAR_TOKEN"
```

---

## 🔒 Seguridad del Token

### ⚠️ IMPORTANTE - No Compartir el Token

- ❌ **NO** subas el token a GitHub
- ❌ **NO** lo compartas públicamente
- ❌ **NO** lo incluyas en commits
- ✅ **SÍ** guárdalo de forma segura
- ✅ **SÍ** úsalo solo en tu máquina local
- ✅ **SÍ** agrégalo a `.gitignore` si lo guardas en un archivo

### Si Pierdes el Token

1. Ve a SonarCloud → My Account → Security
2. En la sección "Tokens", verás tus tokens activos
3. Puedes **revocar** el token viejo (si lo recuerdas)
4. Genera un **nuevo token**

---

## 📝 Resumen Rápido

1. ✅ Ir a https://sonarcloud.io/
2. ✅ Iniciar sesión con GitHub
3. ✅ Agregar proyecto `arangua/paes-tutor`
4. ✅ My Account → Security → Generate Token
5. ✅ Copiar token (solo se muestra una vez)
6. ✅ Configurar como variable de entorno
7. ✅ Ejecutar análisis

---

## ❓ Problemas Comunes

### "Token inválido"
- Verifica que copiaste el token completo
- Asegúrate de que no haya espacios al inicio o final
- Genera un nuevo token si es necesario

### "No se puede conectar a SonarCloud"
- Verifica tu conexión a internet
- Asegúrate de que `SONAR_HOST_URL` esté configurado como `https://sonarcloud.io`

### "Proyecto no encontrado"
- Verifica que agregaste el proyecto en SonarCloud
- Asegúrate de que el `sonar.projectKey` en `sonar-project.properties` coincida con el de SonarCloud

---

**¿Necesitas ayuda con algún paso específico?**

