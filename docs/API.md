# 📚 Documentación de API - PAES Tutor

## Introducción

Esta documentación describe la API REST de PAES Tutor. La API está diseñada siguiendo las mejores prácticas de REST y proporciona endpoints para todas las funcionalidades de la plataforma.

## Documentación OpenAPI

La especificación completa de la API está disponible en formato OpenAPI 3.1.0:

- **Archivo**: [`openapi.yaml`](./openapi.yaml)
- **Formato**: YAML
- **Versión**: 1.0.0

### Visualizar la Documentación

Puedes visualizar la documentación OpenAPI usando herramientas como:

1. **Swagger UI**: 
   ```bash
   npx swagger-ui-serve docs/openapi.yaml
   ```

2. **Redoc**:
   ```bash
   npx redoc-cli serve docs/openapi.yaml
   ```

3. **Swagger Editor Online**: 
   - Visita https://editor.swagger.io/
   - Pega el contenido de `openapi.yaml`

## Autenticación

La API utiliza NextAuth.js para autenticación basada en cookies HTTP-only. Los endpoints protegidos requieren una sesión válida.

### Cómo Autenticarse

1. Inicia sesión a través de `/auth/signin`
2. Las cookies de sesión se establecen automáticamente
3. Las solicitudes subsecuentes incluyen las cookies automáticamente

## Rate Limiting

Todos los endpoints están protegidos con rate limiting usando Upstash Redis:

- **Endpoints públicos**: 100 requests/minuto
- **Endpoints autenticados**: 200 requests/minuto
- **Endpoints de escritura**: 50 requests/minuto

Cuando se excede el límite, se retorna un `429 Too Many Requests`.

## Validación

### Request Validation

Todas las solicitudes son validadas usando schemas de Zod:

- **Query parameters**: Validados con `validateQuery()`
- **Request body**: Validados con `validateBody()`
- **Sanitización**: Automática de strings peligrosos

### Response Validation

Las respuestas del servidor también son validadas en el cliente usando schemas de Zod para garantizar type safety en runtime.

## Endpoints Principales

### Exámenes

- `GET /api/exams` - Lista de exámenes (paginada)
- `GET /api/exams/{id}` - Detalles de un examen

### Estudiantes

- `GET /api/student` - Información del estudiante autenticado

### Métricas

- `GET /api/metrics` - Métricas de rendimiento

### Búsqueda

- `GET /api/search` - Búsqueda global

### Recomendaciones

- `GET /api/recommendations` - Recomendaciones personalizadas

### Materiales

- `GET /api/materials` - Lista de materiales de estudio
- `GET /api/materials/{id}` - Detalles de un material

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `400 Bad Request` - Solicitud inválida
- `401 Unauthorized` - No autenticado
- `404 Not Found` - Recurso no encontrado
- `429 Too Many Requests` - Rate limit excedido
- `500 Internal Server Error` - Error del servidor

## Formato de Respuesta de Error

Todos los errores siguen este formato:

```json
{
  "error": "Mensaje de error descriptivo",
  "code": "ERROR_CODE",
  "details": {
    "campo": "información adicional"
  }
}
```

## Ejemplos de Uso

### Obtener Lista de Exámenes

```bash
curl -X GET "http://localhost:3000/api/exams?limit=10&offset=0" \
  -H "Cookie: next-auth.session-token=..."
```

### Búsqueda Global

```bash
curl -X GET "http://localhost:3000/api/search?q=matemáticas&limit=10" \
  -H "Cookie: next-auth.session-token=..."
```

## Versionado

La API actualmente está en la versión 1.0.0. El versionado se manejará mediante:

- Headers de versión (futuro)
- Rutas versionadas (futuro)

## Soporte

Para más información o soporte, consulta:
- Documentación completa: [`openapi.yaml`](./openapi.yaml)
- Código fuente: `src/app/api/`

