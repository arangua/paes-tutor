# 🔑 Guía de Configuración de API Keys para PAES Tutor

Esta guía te ayudará a configurar las API keys necesarias para usar el Tutor de IA y la generación automática de exámenes.

## 📋 Índice

1. [Opciones de Configuración](#opciones-de-configuración)
2. [Opción 1: Configuración Global (.env)](#opción-1-configuración-global-env)
3. [Opción 2: Configuración por Usuario (Recomendado)](#opción-2-configuración-por-usuario-recomendado)
4. [Cómo Obtener tus API Keys](#cómo-obtener-tus-api-keys)
5. [Verificación](#verificación)
6. [Solución de Problemas](#solución-de-problemas)

---

## 🎯 Opciones de Configuración

Tienes **dos opciones** para configurar las API keys:

1. **Configuración Global (.env)** - Para todos los usuarios del sistema
2. **Configuración por Usuario** - Cada usuario configura sus propias keys (Recomendado)

> 💡 **Recomendación**: Usa la configuración por usuario para que cada persona pueda usar sus propias cuentas (ChatGPT Plus, Claude Pro, Gemini) sin costo adicional.

---

## 📝 Opción 1: Configuración Global (.env)

Esta opción configura las API keys para todo el sistema.

### Paso 1: Localizar el archivo .env

1. Abre el explorador de archivos
2. Navega a la carpeta del proyecto:
   ```
   C:\Users\arang\OneDrive\Escritorio\PROY. PAES\paes-tutor\paes-tutor
   ```
3. Busca el archivo `.env` o `.env.local`
   - Si no existe, créalo con un editor de texto

### Paso 2: Agregar las API Keys

Abre el archivo `.env` (o `.env.local`) y agrega una o más de estas líneas:

```env
# Claude (Anthropic) - Recomendado
ANTHROPIC_API_KEY=sk-ant-api03-tu_clave_aqui

# ChatGPT (OpenAI)
OPENAI_API_KEY=sk-tu_clave_aqui

# Gemini (Google)
GEMINI_API_KEY=AIzaSy-tu_clave_aqui
```

**Ejemplo completo:**

```env
# API Keys para Servicios de IA
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Paso 3: Guardar y Reiniciar

1. **Guarda** el archivo `.env`
2. **Reinicia** el servidor de desarrollo:
   - Detén el servidor (Ctrl + C en la terminal)
   - Inicia nuevamente: `npm run dev`

### ✅ Ventajas de esta opción:

- ✅ Configuración única para todo el sistema
- ✅ No requiere configuración por usuario
- ✅ Útil para entornos de desarrollo o producción

### ⚠️ Desventajas:

- ❌ Todos los usuarios comparten las mismas keys
- ❌ Puede generar costos compartidos
- ❌ Menos flexible

---

## 👤 Opción 2: Configuración por Usuario (Recomendado)

Esta opción permite que cada usuario configure sus propias API keys usando sus cuentas existentes.

### Paso 1: Iniciar Sesión

1. Abre la aplicación PAES Tutor en tu navegador
2. Inicia sesión con tu cuenta

### Paso 2: Acceder al Perfil

1. Haz clic en tu **nombre de usuario** o **avatar** (esquina superior derecha)
2. Selecciona **"Perfil"** o ve directamente a: `/profile`

### Paso 3: Configurar API Keys

1. Desplázate hasta la sección **"Configuración de Servicios de IA"**
2. Verás tres campos:
   - **OpenAI API Key (ChatGPT)**
   - **Anthropic API Key (Claude)**
   - **Gemini API Key (Google)**

3. Para cada servicio que quieras usar:
   - Haz clic en el campo correspondiente
   - Ingresa tu API key
   - (Opcional) Haz clic en el ícono de ojo 👁️ para ver/ocultar la key

4. **Selecciona tu Servicio Preferido** (opcional):
   - Elige el servicio que quieres usar por defecto
   - Si no seleccionas ninguno, se usará el primero disponible

5. Haz clic en **"Guardar Configuración"**

### ✅ Ventajas de esta opción:

- ✅ Cada usuario usa sus propias cuentas
- ✅ Sin costo adicional (usa tus planes existentes)
- ✅ Más seguro (keys encriptadas)
- ✅ Flexible (puedes cambiar entre servicios)

---

## 🔑 Cómo Obtener tus API Keys

### 1. Claude (Anthropic) - Recomendado

1. Ve a: https://console.anthropic.com/settings/keys
2. Inicia sesión con tu cuenta de Anthropic
3. Haz clic en **"Create Key"** o usa una existente
4. **Copia la key** (formato: `sk-ant-api03-...`)
5. ⚠️ **Importante**: Guárdala de forma segura, no podrás verla de nuevo

**Características:**

- ✅ Excelente para generación de contenido educativo
- ✅ Respuestas detalladas y pedagógicas
- ✅ Buen rendimiento en español

### 2. ChatGPT (OpenAI)

1. Ve a: https://platform.openai.com/api-keys
2. Inicia sesión con tu cuenta de OpenAI
3. Haz clic en **"Create new secret key"**
4. **Copia la key** (formato: `sk-proj-...` o `sk-...`)
5. ⚠️ **Importante**: Guárdala de forma segura, no podrás verla de nuevo

**Características:**

- ✅ Muy popular y ampliamente usado
- ✅ Buen rendimiento general
- ✅ Soporte para múltiples modelos

### 3. Gemini (Google)

1. Ve a: https://makersuite.google.com/app/apikey
2. Inicia sesión con tu cuenta de Google
3. Haz clic en **"Create API Key"**
4. **Copia la key** (formato: `AIzaSy...`)
5. ⚠️ **Importante**: Guárdala de forma segura

**Características:**

- ✅ Gratis hasta cierto límite
- ✅ Buen rendimiento
- ✅ Integración con servicios de Google

---

## ✅ Verificación

### Verificar Configuración Global (.env)

1. Abre la terminal en la carpeta del proyecto
2. Verifica que el archivo `.env` existe:
   ```bash
   # En Windows PowerShell
   Test-Path .env
   ```
3. Verifica que las variables estén configuradas (sin mostrar los valores):
   ```bash
   # En Windows PowerShell
   Get-Content .env | Select-String "API_KEY"
   ```

### Verificar Configuración por Usuario

1. Ve a tu **Perfil** (`/profile`)
2. En la sección **"Configuración de Servicios de IA"**
3. Verifica que aparezca **"Configurada"** junto a los servicios que configuraste
4. Prueba el Tutor de IA:
   - Ve a `/ai-tutor`
   - Envía un mensaje de prueba
   - Si funciona, la configuración es correcta ✅

---

## 🔧 Solución de Problemas

### Error: "No hay configuración de IA disponible"

**Causas posibles:**

1. No has configurado ninguna API key
2. Las keys están incorrectas
3. El servidor no se reinició después de cambiar `.env`

**Soluciones:**

1. ✅ Verifica que hayas guardado las keys correctamente
2. ✅ Si usas `.env`, reinicia el servidor (`npm run dev`)
3. ✅ Si usas configuración por usuario, verifica en `/profile`
4. ✅ Verifica que las keys no tengan espacios extra
5. ✅ Asegúrate de que las keys sean válidas (no expiradas)

### Error: "API Key inválida"

**Soluciones:**

1. ✅ Verifica que copiaste la key completa (sin espacios)
2. ✅ Asegúrate de que la key no haya expirado
3. ✅ Verifica que estás usando la key correcta del servicio correcto
4. ✅ Intenta crear una nueva key desde el panel del proveedor

### Error: "Servicio no disponible"

**Soluciones:**

1. ✅ Verifica tu conexión a internet
2. ✅ Verifica que el servicio (Claude/ChatGPT/Gemini) esté funcionando
3. ✅ Revisa si hay límites de uso en tu cuenta
4. ✅ Intenta con otro servicio de IA

### Las keys no se guardan en el perfil

**Soluciones:**

1. ✅ Verifica que estás autenticado (iniciado sesión)
2. ✅ Refresca la página después de guardar
3. ✅ Verifica la consola del navegador para errores
4. ✅ Intenta cerrar sesión y volver a iniciar sesión

---

## 📚 Recursos Adicionales

### Documentación de los Servicios

- **Claude (Anthropic)**: https://docs.anthropic.com/
- **ChatGPT (OpenAI)**: https://platform.openai.com/docs
- **Gemini (Google)**: https://ai.google.dev/docs

### Límites y Costos

- **Claude**: Consulta en https://www.anthropic.com/pricing
- **ChatGPT**: Consulta en https://openai.com/pricing
- **Gemini**: Consulta en https://ai.google.dev/pricing

---

## 💡 Consejos

1. **Usa tus cuentas existentes**: Si tienes ChatGPT Plus, Claude Pro o Gemini, puedes usar sus API keys sin costo adicional
2. **Configuración por usuario es mejor**: Permite que cada persona use sus propias cuentas
3. **Mantén las keys seguras**: Nunca compartas tus API keys públicamente
4. **Prueba primero con una key**: Configura un servicio primero para verificar que funciona
5. **Monitorea el uso**: Revisa periódicamente el uso de tus API keys para evitar costos inesperados

---

## 🆘 ¿Necesitas Ayuda?

Si tienes problemas con la configuración:

1. Revisa esta guía completa
2. Verifica los pasos uno por uno
3. Revisa la sección de "Solución de Problemas"
4. Verifica que el servidor esté funcionando correctamente

---

**¡Listo!** Una vez configuradas las API keys, podrás usar:

- ✅ Tutor de IA (`/ai-tutor`)
- ✅ Generación automática de exámenes (`/admin/generate-exam`)
- ✅ Análisis y recomendaciones personalizadas
