# Configuración de API Keys por Usuario

## ✅ Implementado

Ahora cada usuario puede configurar sus propias API keys de ChatGPT, Claude o Gemini en su perfil, usando sus cuentas existentes sin costo adicional.

## 🔧 Cómo Configurar

### Paso 1: Obtener tus API Keys

Puedes usar las API keys de tus cuentas existentes (ChatGPT Plus, Claude Pro, Gemini):

1. **Claude (Anthropic)**:
   - Ve a: https://console.anthropic.com/settings/keys
   - Crea una nueva API key o usa una existente
   - Copia la key (formato: `sk-ant-...`)

2. **ChatGPT (OpenAI)**:
   - Ve a: https://platform.openai.com/api-keys
   - Crea una nueva API key o usa una existente
   - Copia la key (formato: `sk-...`)

3. **Gemini (Google)**:
   - Ve a: https://makersuite.google.com/app/apikey
   - Crea una nueva API key o usa una existente
   - Copia la key (formato: `AIza...`)

### Paso 2: Configurar en PAES Tutor

1. Ve a tu **Perfil** (`/profile`)
2. Busca la sección **"Configuración de Servicios de IA"**
3. Ingresa tus API keys en los campos correspondientes
4. Selecciona tu servicio preferido (opcional)
5. Haz clic en **"Guardar Configuración"**

## 🔒 Seguridad

- Las API keys se almacenan **encriptadas** en la base de datos
- Solo tú puedes ver tus propias keys
- Las keys nunca se muestran completas (solo últimos 4 caracteres)
- Puedes eliminar tus keys en cualquier momento

## 🎯 Prioridad de Uso

El sistema usa las API keys en este orden:

1. **API keys del usuario** (si están configuradas)
2. **Variables de entorno** (si no hay keys del usuario)
3. **Servicio preferido** (si está configurado)

## 📝 Migración de Base de Datos

Después de actualizar el schema, ejecuta:

```bash
npx prisma migrate dev --name add_ai_api_keys
npx prisma generate
```

## 💡 Ventajas

- ✅ Cada usuario usa sus propias cuentas
- ✅ No hay costo adicional (usa tus planes existentes)
- ✅ Configuración individual por usuario
- ✅ Puedes cambiar entre servicios fácilmente
- ✅ Las keys están encriptadas y seguras

## 🔄 Próximos Pasos

1. Ejecutar la migración de Prisma
2. Configurar tus API keys en tu perfil
3. ¡Listo! Ya puedes usar el Tutor de IA con tus cuentas
