# 🚀 Sistema de Manejo de Errores HatsuSound Frontend

## 🎯 **Descripción General**

Hemos implementado un **sistema completo de manejo de errores** que proporciona respuestas estructuradas en lugar de HTML genérico. Todos los errores ahora tienen códigos HTTP consistentes y mensajes claros para el usuario.

## 📁 **Estructura de Archivos**

```
src/
├── types/
│   └── error-response.model.ts      # Interfaz de respuesta de error
├── services/
│   ├── error-handler.service.ts     # Servicio principal de manejo de errores
│   └── auth.service.ts              # Ejemplo de servicio con manejo de errores
├── contexts/
│   └── ErrorContext.tsx             # Contexto global para estado de errores
├── hooks/
│   └── useApiError.ts               # Hook personalizado para manejo de errores API
├── components/
│   ├── ErrorNotification.tsx        # Componente de notificación de errores
│   └── LoginForm.tsx                # Ejemplo de uso del sistema
└── styles/
    └── ErrorNotification.css        # Estilos para las notificaciones
```

## 🛠️ **Cómo Usar el Sistema**

### **1. Configuración Básica**

El sistema ya está configurado en `App.tsx` con el `ErrorProvider` y el componente `ErrorNotification`.

### **2. Uso en Componentes**

```typescript
import { useApiError } from '../hooks/useApiError';
import { AuthService } from '../services/auth.service';

const MyComponent = () => {
  const { createApiCall } = useApiError();

  const handleLogin = async () => {
    try {
      const loginCall = createApiCall(
        () => AuthService.login(email, password),
        (data) => {
          // Manejar éxito
          console.log('Login exitoso:', data);
        },
        (error) => {
          // Manejar error (opcional)
          console.log('Error específico:', error);
        }
      );

      await loginCall();
    } catch (error) {
      // El error ya fue manejado automáticamente
      console.log('Error capturado:', error);
    }
  };

  return (
    // Tu JSX aquí
  );
};
```

### **3. Uso Directo del Contexto**

```typescript
import { useError } from '../contexts/ErrorContext';

const MyComponent = () => {
  const { setError, clearError } = useError();

  const handleCustomError = () => {
    setError({
      statusCode: 400,
      message: 'Datos inválidos',
      error: 'Bad Request',
      timestamp: new Date().toISOString(),
      path: '/custom-endpoint',
      method: 'POST'
    });
  };

  return (
    <div>
      <button onClick={handleCustomError}>Mostrar Error</button>
      <button onClick={clearError}>Limpiar Error</button>
    </div>
  );
};
```

## 🎨 **Tipos de Errores y Estilos**

### **Códigos de Error Soportados:**

- **400** - Error de Validación (Amarillo)
- **401** - No Autorizado (Rojo) - **Mensaje específico del backend**
- **403** - Acceso Denegado (Rojo)
- **404** - No Encontrado (Gris)
- **409** - Conflicto (Amarillo)
- **429** - Demasiadas Solicitudes (Azul)
- **500** - Error del Servidor (Rojo)

### **Sistema de Mensajes Inteligente:**

El sistema ahora **prioriza los mensajes específicos del backend** sobre los mensajes genéricos:

- ✅ **Si el backend envía un mensaje específico** (ej: "Credenciales inválidas") → Se muestra ese mensaje
- ✅ **Si el backend no envía mensaje específico** → Se muestra un mensaje por defecto amigable
- ✅ **Mensajes personalizados por contexto** (ej: "Error de Login" para `/auth/login`)
- ✅ **Errores de conexión específicos** → "Error de conexión con el servidor. Verifica tu conexión a internet."

### **Características de las Notificaciones:**

- ✅ **Posicionamiento fijo** en la esquina superior derecha
- ✅ **Animaciones suaves** de entrada y salida
- ✅ **Auto-cierre** después de 8 segundos
- ✅ **Responsive** para dispositivos móviles
- ✅ **Botón de cierre** manual
- ✅ **Información de reintento** para rate limiting

## 🔄 **Sistema de Reintentos Automáticos**

El sistema maneja automáticamente:

- **Errores de servidor (5xx)**: Reintento después de 5 segundos
- **Rate limiting (429)**: Reintento después del tiempo especificado en `retryAfter`
- **Logs de reintento** en consola para debugging

## 📝 **Ejemplos de Respuestas de Error**

### **Error de Login (401) - Mensaje Específico:**
```json
{
  "statusCode": 401,
  "message": "Credenciales inválidas",
  "error": "Unauthorized",
  "timestamp": "2025-08-17T20:22:11.227Z",
  "path": "/auth/login",
  "method": "POST"
}
```
**Resultado:** Se muestra "Credenciales inválidas" (mensaje del backend)

### **Error 401 Genérico - Sin Mensaje Específico:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized",
  "timestamp": "2025-08-17T20:22:11.227Z",
  "path": "/auth/profile",
  "method": "GET"
}
```
**Resultado:** Se muestra "Credenciales inválidas. Verifica tu correo y contraseña." (mensaje por defecto)

### **Error de Validación (400):**
```json
{
  "statusCode": 400,
  "message": "email must be an email; password must be longer than or equal to 6 characters",
  "error": "Bad Request",
  "timestamp": "2025-08-17T18:30:00.000Z",
  "path": "/auth/register",
  "method": "POST"
}
```

### **Rate Limiting (429):**
```json
{
  "statusCode": 429,
  "message": "Has excedido el límite de 100 requests por 15 minutos",
  "error": "Too Many Requests",
  "timestamp": "2025-08-17T18:30:00.000Z",
  "path": "/auth/login",
  "method": "POST",
  "details": {
    "limit": 100,
    "windowMs": 900000,
    "retryAfter": 300
  }
}
```

## 🚀 **Ventajas del Sistema**

1. **✅ Respuestas estructuradas** en lugar de HTML
2. **✅ Códigos HTTP consistentes** para cada tipo de error
3. **✅ Mensajes claros** para el usuario final
4. **✅ Manejo automático de rate limiting** con reintentos
5. **✅ Notificaciones visuales** atractivas
6. **✅ Logs detallados** para debugging
7. **✅ Manejo centralizado** de errores
8. **✅ Reintentos automáticos** inteligentes
9. **✅ Responsive design** para móviles
10. **✅ Auto-cierre** de notificaciones

## 🔧 **Personalización**

### **Modificar Tiempos de Auto-cierre:**
```typescript
// En ErrorContext.tsx, línea 35
setTimeout(() => {
  clearError();
}, 8000); // Cambiar a 10000 para 10 segundos
```

### **Agregar Nuevos Tipos de Error:**
```typescript
// En ErrorHandlerService.ts, método getErrorMessage
case 422:
  return 'Entidad no procesable: ' + error.message;
```

### **Modificar Estilos:**
```css
/* En ErrorNotification.css */
.error-422 { 
  background: #e8f5e8; 
  border-left: 4px solid #28a745; 
  color: #155724;
}
```

## 🧪 **Testing**

Para probar el sistema, puedes:

1. **Usar el componente ErrorTestComponent** para probar diferentes tipos de errores
2. **Simular errores de red** desconectando internet
3. **Usar el componente LoginForm** con credenciales inválidas
4. **Llamar directamente al contexto** con errores personalizados
5. **Verificar logs** en la consola del navegador

### **Componente de Pruebas:**

```typescript
import ErrorTestComponent from './components/ErrorTestComponent';

// En tu componente principal
<ErrorTestComponent />
```

Este componente te permite probar:
- ✅ **Error de Login específico** (muestra "Credenciales inválidas")
- ✅ **Error 401 genérico** (muestra mensaje por defecto)
- ✅ **Error de validación** (400)
- ✅ **Rate limiting** (429)

## 📚 **Dependencias**

El sistema utiliza solo dependencias nativas de React:
- ✅ React Hooks (useState, useContext, useCallback)
- ✅ TypeScript para tipado
- ✅ CSS para estilos
- ✅ No requiere librerías externas

¡El sistema está listo para usar y proporcionará una experiencia de usuario profesional y amigable! 🎉
