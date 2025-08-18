# Ejemplos de Manejo de Errores Amigables

## 🚫 **Error de Conexión (Backend no disponible)**
**Antes:** "Failed to fetch" o "NetworkError"
**Ahora:** 
- **Título:** Error de conexión
- **Mensaje:** "No se pudo conectar con el servidor. Verifica tu conexión a internet."
- **Sugerencia:** "Intenta de nuevo en unos momentos o verifica tu conexión."
- **Reintentable:** ✅ Sí

## 📄 **Error de Parsing JSON (HTML del servidor)**
**Antes:** "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
**Ahora:**
- **Título:** Error de formato del servidor
- **Mensaje:** "El servidor está devolviendo datos en formato incorrecto. Esto suele indicar que el backend no está funcionando correctamente."
- **Sugerencia:** "El servidor puede estar caído o devolviendo páginas de error HTML. Intenta de nuevo más tarde."
- **Reintentable:** ✅ Sí

## 🚫 **Error "Bad Request Exception" (Backend técnico)**
**Antes:** "Bad Request Exception: Validation failed for argument [0] in public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request)"
**Ahora:**
- **Título:** Datos incorrectos
- **Mensaje:** "Los datos enviados no son válidos o están incompletos."
- **Sugerencia:** "Verifica que todos los campos estén completos y con el formato correcto."
- **Reintentable:** ❌ No

## ⚙️ **Error de Configuración del Servidor**
**Antes:** "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"
**Ahora:**
- **Título:** Error de configuración del servidor
- **Mensaje:** "El servidor está devolviendo páginas HTML en lugar de datos JSON. Esto indica un problema de configuración."
- **Sugerencia:** "El backend puede estar configurado incorrectamente o devolviendo páginas de error. Contacta al administrador."
- **Reintentable:** ✅ Sí

## 🔐 **Credenciales Incorrectas**
**Antes:** "Invalid credentials" o "401 Unauthorized"
**Ahora:**
- **Título:** Error de autenticación
- **Mensaje:** "Tu sesión ha expirado o las credenciales son incorrectas."
- **Sugerencia:** "Verifica tu email/username y contraseña, o inicia sesión nuevamente."
- **Reintentable:** ❌ No

## 📧 **Email Duplicado**
**Antes:** "Email already exists" o "409 Conflict"
**Ahora:**
- **Título:** Email duplicado
- **Mensaje:** "Ya existe una cuenta con ese email."
- **Sugerencia:** "Usa un email diferente o inicia sesión con tu cuenta existente."
- **Reintentable:** ❌ No

## 🚦 **Demasiadas Solicitudes**
**Antes:** "429 Too Many Requests" o "Rate limit exceeded"
**Ahora:**
- **Título:** Demasiadas solicitudes
- **Mensaje:** "Has realizado demasiadas solicitudes. Espera un momento antes de intentar de nuevo."
- **Sugerencia:** "Espera unos minutos antes de intentar nuevamente."
- **Reintentable:** ✅ Sí

## ⚠️ **Error del Servidor**
**Antes:** "Internal Server Error" o "500 Internal Server Error"
**Ahora:**
- **Título:** Error del servidor
- **Mensaje:** "El servidor está experimentando problemas técnicos."
- **Sugerencia:** "Intenta de nuevo en unos minutos. Si el problema persiste, contacta soporte."
- **Reintentable:** ✅ Sí

## ✅ **Beneficios del Nuevo Sistema:**

1. **Mensajes en Español:** Todos los errores están en el idioma del usuario
2. **Contexto Útil:** Cada error incluye una sugerencia específica
3. **Indicador de Reintento:** El usuario sabe si puede intentar de nuevo
4. **Sin Jerga Técnica:** Los mensajes son comprensibles para cualquier usuario
5. **Acciones Claras:** Cada error sugiere qué hacer a continuación
6. **Diseño Visual:** Errores con iconos y colores apropiados
7. **Botón de Reintento:** Para errores reintentables, con un botón claro
8. **Limpieza Automática:** Los mensajes técnicos del backend se traducen automáticamente

## 🔧 **Limpieza Automática de Mensajes Técnicos:**

### **Ejemplos de Transformación:**
- **"Bad Request Exception"** → **"Los datos enviados no son válidos o están incompletos."**
- **"Internal Server Error"** → **"El servidor está experimentando problemas técnicos."**
- **"Validation failed for argument [0]"** → **"Ocurrió un error inesperado. Intenta de nuevo."**
- **"Authentication Error: Invalid token"** → **"Tu sesión ha expirado o las credenciales son incorrectas."**

## 🎨 **Tipos Visuales de Error:**

- **🔴 Error (Rojo):** Errores críticos que requieren acción del usuario
- **🔵 Info (Azul):** Errores informativos con sugerencias
- **🟡 Warning (Amarillo):** Advertencias que requieren atención

## 📱 **Responsive Design:**
- Los errores se adaptan a dispositivos móviles
- Botones y texto optimizados para pantallas pequeñas
- Espaciado y layout responsivos
