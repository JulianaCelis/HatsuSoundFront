# 🚀 Configuración de HatsuSound Frontend

## 📋 Variables de Entorno Disponibles

### **Configuración de la API**
```bash
# URL base de la API del backend
REACT_APP_API_URL=http://localhost:3000
```

### **Configuración de Debug**
```bash
# Mostrar componentes de debug (por defecto: false)
REACT_APP_SHOW_DEBUG=false

# Nivel de logging (por defecto: info)
REACT_APP_LOG_LEVEL=info
```

### **Configuración del Puerto**
```bash
# Puerto de la aplicación (por defecto: 3000)
PORT=3000

# Host de la aplicación (por defecto: localhost)
HOST=localhost
```

### **Configuración de la Aplicación**
```bash
# URL base de la aplicación frontend
REACT_APP_BASE_URL=http://localhost:3000
```

## 🔧 Cómo Configurar

### **1. Crear archivo .env.local**
```bash
# En la raíz del proyecto
touch .env.local
```

### **2. Agregar configuración**
```bash
# Ejemplo para desarrollo
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SHOW_DEBUG=true
PORT=3000

# Ejemplo para producción
REACT_APP_API_URL=https://api.hatsusound.com
REACT_APP_SHOW_DEBUG=false
PORT=80
```

### **3. Reiniciar la aplicación**
```bash
npm start
```

## 🎯 Configuración por Entorno

### **Desarrollo (Development)**
```bash
NODE_ENV=development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SHOW_DEBUG=true
PORT=3000
```

### **Producción (Production)**
```bash
NODE_ENV=production
REACT_APP_API_URL=https://api.hatsusound.com
REACT_APP_SHOW_DEBUG=false
PORT=80
```

### **Staging**
```bash
NODE_ENV=staging
REACT_APP_API_URL=https://staging-api.hatsusound.com
REACT_APP_SHOW_DEBUG=false
PORT=3000
```

## 🔍 Panel de Control Secreto

### **Activación**
- Hacer clic **5 veces** en el botón del corazón (❤️) en el header
- Se muestra un contador visual: "X/5"

### **Funcionalidades**
1. **🌐 Probar Conexión Backend** - Prueba `/api/health`
2. **🔐 Probar Endpoint Auth** - Prueba `/api/auth/login`
3. **🌍 Info del Entorno** - Muestra variables de entorno y info del navegador
4. **🔄 Reiniciar Contador** - Recarga la página

### **Configuración del Umbral**
```typescript
// En src/config/app.ts
FEATURES: {
  HEART_CLICK_THRESHOLD: 5, // Cambiar este número
}
```

## 📁 Estructura de Configuración

```
src/
├── config/
│   ├── app.ts          # Configuración general de la app
│   └── api.ts          # Configuración de la API
├── components/
│   └── layout/
│       └── Header.tsx  # Usa APP_CONFIG
└── App.tsx             # Usa isDebugEnabled()
```

## 🚨 Solución de Problemas

### **Puerto ya en uso**
```bash
# Cambiar puerto
PORT=3001 npm start

# O en .env.local
PORT=3001
```

### **API no responde**
```bash
# Verificar URL de la API
REACT_APP_API_URL=http://localhost:3000

# Verificar que el backend esté corriendo
curl http://localhost:3000/api/health
```

### **Debug no se muestra**
```bash
# Habilitar debug
REACT_APP_SHOW_DEBUG=true

# Verificar en consola del navegador
console.log(process.env.REACT_APP_SHOW_DEBUG)
```

## 📚 Referencias

- [React Environment Variables](https://create-react-app.dev/docs/adding-custom-environment-variables/)
- [Create React App Configuration](https://create-react-app.dev/docs/advanced-configuration/)
- [Environment Variables Best Practices](https://12factor.net/config)

## 🤝 Contribución

Para agregar nuevas configuraciones:

1. **Agregar en `src/config/app.ts`**
2. **Documentar en este README**
3. **Probar en diferentes entornos**
4. **Actualizar tipos TypeScript si es necesario**
