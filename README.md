# HatsuSound Frontend

Un frontend profesional construido con React, Redux y TypeScript, diseñado con un enfoque mobile-first y siguiendo las mejores prácticas de desarrollo.

## 🚀 Características

- **React 18** con TypeScript para desarrollo robusto
- **Redux Toolkit** siguiendo la arquitectura Flux
- **Diseño Responsive** enfocado en mobile-first
- **Styled Components** para CSS-in-JS moderno
- **Arquitectura Profesional** con estructura de carpetas escalable
- **Persistencia de Estado** con redux-persist
- **Componentes Reutilizables** con TypeScript tipado

## 📱 Diseño Mobile-First

- Optimizado para iPhone SE (2020) 1334 x 750 pixels
- Breakpoints responsive: mobile (320px), tablet (768px), desktop (1024px)
- Navegación móvil con menú hamburguesa
- Touch targets optimizados para dispositivos móviles

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes de UI básicos
│   └── layout/         # Componentes de layout
├── pages/              # Páginas de la aplicación
├── store/              # Configuración de Redux
│   └── slices/         # Slices de Redux
├── hooks/              # Hooks personalizados
├── types/              # Definiciones de TypeScript
├── styles/             # Estilos globales y tema
└── utils/              # Utilidades y helpers
```

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, TypeScript
- **Estado**: Redux Toolkit, Redux Persist
- **Estilos**: Styled Components
- **Build**: Create React App
- **Linting**: ESLint + Prettier
- **Arquitectura**: Flux (Redux)

## 📦 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd HatsuSoundFront
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Ejecutar en desarrollo**
   ```bash
   npm start
   ```

4. **Construir para producción**
   ```bash
   npm run build
   ```

## 🔧 Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm run lint` - Verifica el código con ESLint
- `npm run lint:fix` - Corrige automáticamente problemas de linting
- `npm run format` - Formatea el código con Prettier

## 🎨 Sistema de Diseño

### Colores
- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Violet)
- **Accent**: #f59e0b (Amber)
- **Background**: #0f0f23 (Dark Blue)
- **Surface**: #1a1a2e (Darker Blue)

### Espaciado
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)

### Breakpoints
- **Mobile**: 320px
- **Tablet**: 768px
- **Desktop**: 1024px

## 📱 Componentes Principales

### UI Components
- `Button` - Botón con variantes y tamaños
- `Card` - Tarjeta con elevación y padding configurable

### Layout Components
- `Header` - Navegación responsive con menú móvil
- `HeroSection` - Sección principal de la landing page

## 🔄 Estado de la Aplicación

### Redux Store
- **User Slice**: Autenticación y perfil de usuario
- **Payment Slice**: Transacciones de pago seguras
- **Player Slice**: Estado del reproductor de música

### Persistencia
- Datos de usuario y transacciones se persisten en localStorage
- Estado del reproductor se resetea en cada sesión

## 🚀 Próximos Pasos

- [ ] Implementar autenticación completa
- [ ] Agregar más secciones a la landing page
- [ ] Implementar reproductor de música funcional
- [ ] Agregar sistema de pagos real
- [ ] Implementar tests unitarios y de integración
- [ ] Agregar PWA capabilities

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o soporte, por favor abre un issue en el repositorio.

