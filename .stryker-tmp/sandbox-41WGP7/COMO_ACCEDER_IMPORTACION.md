# 📍 Cómo Acceder a la Funcionalidad de Importación

## 🚀 Pasos para Acceder

### Paso 1: Iniciar el Servidor

Si el servidor no está corriendo, ejecuta:

```bash
npm run dev
```

Espera a que veas el mensaje:

```
✓ Ready in X seconds
○ Local: http://localhost:3000
```

---

### Paso 2: Abrir el Navegador

Abre tu navegador y ve a:

```
http://localhost:3000
```

---

### Paso 3: Iniciar Sesión

1. **Haz clic en "Iniciar Sesión"** (botón en la esquina superior derecha)

2. **Ingresa tus credenciales:**
   - **Email:** `matias@paestutor.com`
   - **Password:** `password123`

3. **Haz clic en "Iniciar Sesión"**

---

### Paso 4: Acceder a la Página de Importación

Tienes **DOS opciones** para acceder:

#### **Opción A: Desde el Menú (Recomendado)**

1. **Haz clic en tu nombre** en la esquina superior derecha del header
   - Verás un menú desplegable

2. **Selecciona "Importar Exámenes"**
   - Es la opción con el ícono de documento (📄)

3. **¡Listo!** Serás redirigido a la página de importación

#### **Opción B: URL Directa**

Simplemente ve a:

```
http://localhost:3000/admin/import-exams
```

_(Si no estás autenticado, te redirigirá automáticamente al login)_

---

## 🎯 ¿Qué Verás?

Una vez en la página de importación, verás:

1. **🔍 Sección de Búsqueda Automática**
   - Campo para URL de DEMRE (ya viene prellenada)
   - Botón "Buscar PDFs"
   - Lista de PDFs encontrados (después de buscar)

2. **📝 Instrucciones Manuales**
   - Guía paso a paso para importación manual

3. **📋 Formulario de Importación**
   - Campos para URL, asignatura, año, tipo y título
   - Botón "Agregar Otro Examen"
   - Botón "Importar Exámenes"

---

## 🖼️ Ubicación Visual del Enlace

El enlace "Importar Exámenes" está en:

```
┌─────────────────────────────────────────┐
│  PAES Tutor    [Inicio] [Exámenes] ... │
│                    👤 Tu Nombre ▼      │ ← Haz clic aquí
│                                         │
│  ┌─────────────────────────────────┐  │
│  │ 👤 Tu Nombre                    │  │
│  │ ──────────────────────────────── │  │
│  │ 📄 Mi Perfil                     │  │
│  │ 📄 Importar Exámenes  ← AQUÍ    │  │
│  │ 🚪 Cerrar Sesión                 │  │
│  └─────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## ✅ Checklist Rápido

- [ ] Servidor corriendo (`npm run dev`)
- [ ] Navegador abierto en `http://localhost:3000`
- [ ] Sesión iniciada (email: `matias@paestutor.com`)
- [ ] Clic en tu nombre (menú dropdown)
- [ ] Seleccionar "Importar Exámenes"

---

## 🆘 Si No Ves el Enlace

Si no ves "Importar Exámenes" en el menú:

1. **Verifica que estés autenticado:**
   - Debe aparecer tu nombre en el header
   - Si ves "Iniciar Sesión", primero inicia sesión

2. **Usa la URL directa:**

   ```
   http://localhost:3000/admin/import-exams
   ```

3. **Verifica que el servidor esté corriendo:**
   - Revisa la terminal donde ejecutaste `npm run dev`
   - Debe mostrar "Ready"

---

## 🎉 ¡Listo para Probar!

Una vez en la página, puedes:

1. **Probar la búsqueda automática:**
   - Haz clic en "Buscar PDFs"
   - Espera a que aparezcan los PDFs
   - Haz clic en uno para usarlo

2. **O importar manualmente:**
   - Pega una URL de PDF
   - Completa los campos
   - Haz clic en "Importar Exámenes"

---

**¿Necesitas ayuda?** Revisa la documentación en `FUNCIONALIDAD_BUSQUEDA_AUTOMATICA.md`
