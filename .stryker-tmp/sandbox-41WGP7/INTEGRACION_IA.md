# Integración de Servicios de IA

## ✅ Implementado

El sistema ahora soporta integración con servicios de IA (ChatGPT, Claude, Gemini) directamente desde PAES Tutor.

## 🔧 Configuración

### ✅ Opción 1: Por Usuario (Recomendado) - IMPLEMENTADO

Cada usuario puede configurar sus propias API keys en su perfil:

1. Ve a **Perfil** (`/profile`)
2. Busca la sección **"Configuración de Servicios de IA"**
3. Ingresa tus API keys de tus cuentas existentes
4. Selecciona tu servicio preferido
5. Guarda la configuración

**Ventajas:**

- ✅ Usa tus planes existentes (ChatGPT Plus, Claude Pro, Gemini)
- ✅ Sin costo adicional
- ✅ Cada usuario tiene sus propias keys
- ✅ Keys encriptadas y seguras

### Opción 2: Variables de Entorno (Global)

También puedes configurar keys globales en `.env` (se usan si el usuario no tiene keys):

```env
# Claude (Anthropic) - Ya tienes el SDK instalado
ANTHROPIC_API_KEY=tu_clave_de_anthropic_aqui

# ChatGPT (OpenAI) - Requiere: npm install openai
OPENAI_API_KEY=tu_clave_de_openai_aqui

# Gemini (Google) - Requiere: npm install @google/generative-ai
GEMINI_API_KEY=tu_clave_de_gemini_aqui
```

## 📦 Instalación de SDKs Adicionales

### Para ChatGPT (OpenAI):

```bash
npm install openai
```

### Para Gemini (Google):

```bash
npm install @google/generative-ai
```

## 🚀 Uso

### 1. Página de Tutor IA

Accede a `/ai-tutor` desde el menú de navegación para:

- Hacer preguntas sobre temas de PAES
- Recibir explicaciones personalizadas
- Obtener recomendaciones de estudio

### 2. API Endpoints

#### Chat General

```typescript
POST /api/ai/chat
{
  "type": "chat",
  "messages": [
    { "role": "user", "content": "Explícame las ecuaciones cuadráticas" }
  ],
  "service": "anthropic" // opcional
}
```

#### Explicaciones de Respuestas

```typescript
POST /api/ai/chat
{
  "type": "explanation",
  "question": "¿Cuál es la derivada de x²?",
  "correctAnswer": "2x",
  "studentAnswer": "x", // opcional
  "topic": "Cálculo diferencial" // opcional
}
```

#### Recomendaciones de Estudio

```typescript
POST /api/ai/chat
{
  "type": "recommendations",
  "weaknesses": [
    { "topic": "Álgebra", "percentage": 45 }
  ],
  "strengths": [
    { "topic": "Geometría", "percentage": 85 }
  ]
}
```

## 🔒 Seguridad

- Las API keys se almacenan en variables de entorno (nunca en el frontend)
- Las solicitudes pasan por rate limiting
- Requiere autenticación de usuario

## 📝 Funcionalidades

### Actualmente Implementado:

- ✅ Integración con Claude (Anthropic)
- ✅ Sistema unificado para múltiples servicios
- ✅ Página de chat interactivo
- ✅ Generación de explicaciones
- ✅ Generación de recomendaciones

### Pendiente (fácil de agregar):

- ⏳ Integración completa con OpenAI (requiere instalar SDK)
- ⏳ Integración completa con Gemini (requiere instalar SDK)
- ⏳ Almacenamiento de API keys por usuario en BD
- ⏳ Historial de conversaciones
- ⏳ Integración en página de resultados de exámenes

## 💡 Casos de Uso

1. **Explicaciones de Respuestas**: Cuando un estudiante responde incorrectamente, el sistema puede generar una explicación detallada usando IA.

2. **Tutor Personalizado**: Los estudiantes pueden hacer preguntas sobre cualquier tema y recibir respuestas contextualizadas.

3. **Recomendaciones Inteligentes**: El sistema puede generar recomendaciones de estudio más detalladas usando IA.

## 🔄 Próximos Pasos

1. Instalar SDKs adicionales si quieres usar ChatGPT o Gemini
2. Agregar las API keys al `.env`
3. Probar la funcionalidad en `/ai-tutor`
4. (Opcional) Extender para almacenar keys por usuario
