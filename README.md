# 🎵 Hatsu Sound Frontend

Frontend moderno y profesional para Hatsu Sound, construido con React, TypeScript y Tailwind CSS.

## 🚀 Características

- ⚡ **React 18** con TypeScript
- 🎨 **Tailwind CSS** para estilos modernos
- 🔐 **Sistema de autenticación** completo
- 📱 **Diseño responsive** y accesible
- 🧪 **Testing** integrado
- 🔧 **Configuración profesional** de API
- 🚀 **Proxy automático** para desarrollo

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Backend corriendo en puerto 3012

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone <tu-repo>
cd HatsuSoundFront
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env

# Editar .env con tus valores
nano .env
```

4. **Iniciar el servidor de desarrollo**
```bash
npm start
```

## ⚙️ Configuración

### Variables de Entorno

El proyecto usa un sistema de configuración inteligente:

- **Desarrollo**: Usa proxy automático configurado en `package.json`
- **Producción**: Usa `REACT_APP_API_URL` del archivo `.env`

### Proxy de Desarrollo

El `package.json` incluye:
```json
{
  "proxy": "http://localhost:3012"
}
```

Esto significa que:
- `/api/*` se redirige automáticamente a `localhost:3012`
- No necesitas configurar URLs absolutas en desarrollo
- Funciona perfectamente con tu backend local

### Configuración de API

El archivo `src/config/api.ts` maneja:
- ✅ URLs automáticas por entorno
- ✅ Timeouts configurables
- ✅ Reintentos automáticos
- ✅ Validación de respuestas JSON
- ✅ Manejo de errores consistente

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm start          # Inicia servidor de desarrollo
npm run build      # Construye para producción
npm test           # Ejecuta tests
npm run eject      # Expone configuración de webpack
```

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI base
│   ├── layout/         # Componentes de layout
│   └── sections/       # Secciones de página
├── config/              # Configuración de la aplicación
│   ├── api.ts          # Configuración de API
│   └── app.ts          # Configuración general
├── contexts/            # Contextos de React
├── hooks/               # Hooks personalizados
├── services/            # Servicios de API
├── types/               # Tipos de TypeScript
└── utils/               # Utilidades
```

## 🌐 Configuración de API

### Desarrollo
```typescript
// Las URLs relativas se resuelven automáticamente
const healthUrl = getHealthCheckUrl(); // → /api/health
const authUrl = getAuthUrl('login');   // → /api/auth/login
```

### Producción
```typescript
// Las URLs se construyen con la base URL configurada
const healthUrl = getHealthCheckUrl(); // → https://api.hatsusound.com/api/health
```

## 🔍 Debugging

El proyecto incluye un **Panel de Control Secreto** con herramientas de debugging:

1. **Abre el modal secreto** (haz clic en el corazón del header)
2. **Prueba la conexión** con el backend
3. **Verifica endpoints** de autenticación
4. **Revisa información** del entorno
5. **Prueba conectividad** básica

## 🚀 Despliegue

### Build de Producción
```bash
npm run build
```

### Variables de Entorno en Producción
```bash
REACT_APP_API_URL=https://api.hatsusound.com
REACT_APP_SHOW_DEBUG=false
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Si tienes problemas:

1. **Verifica la consola** del navegador
2. **Revisa los logs** del servidor
3. **Usa el panel secreto** para debugging
4. **Verifica la configuración** del proxy
5. **Asegúrate** de que el backend esté corriendo

## 🎯 Próximos Pasos

- [ ] Implementar tests unitarios
- [ ] Agregar CI/CD pipeline
- [ ] Optimizar bundle size
- [ ] Implementar PWA
- [ ] Agregar internacionalización

