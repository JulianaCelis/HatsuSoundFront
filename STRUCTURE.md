# HatsuSound Frontend - Estructura del Proyecto

## 📁 Estructura de Carpetas

```
src/
├── components/                 # Componentes React organizados por funcionalidad
│   ├── auth/                  # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.css
│   │   └── index.ts
│   ├── products/              # Componentes relacionados con productos
│   │   ├── ProductCard.tsx
│   │   ├── ProductCard.css
│   │   ├── ProductList.tsx
│   │   ├── ProductList.css
│   │   ├── ProductFilters.tsx
│   │   ├── ProductFilters.css
│   │   ├── ProductSearch.tsx
│   │   ├── ProductSearch.css
│   │   └── index.ts
│   ├── layout/                # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Header.css
│   │   └── index.ts
│   ├── ui/                    # Componentes UI reutilizables
│   │   ├── common/            # Componentes UI básicos
│   │   │   ├── Pagination.tsx
│   │   │   ├── Pagination.css
│   │   │   ├── ErrorNotification.tsx
│   │   │   ├── DebugErrorComponent.tsx
│   │   │   ├── ErrorTestComponent.tsx
│   │   │   └── index.ts
│   │   ├── AuthModal.tsx
│   │   ├── AuthModal.css
│   │   ├── Button.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── ErrorDisplay.css
│   │   ├── SecretModal.tsx
│   │   ├── SecretModal.css
│   │   ├── Toast.tsx
│   │   ├── Toast.css
│   │   └── index.ts
│   ├── sections/              # Secciones de página
│   │   ├── HeroSection.tsx
│   │   └── index.ts
│   └── index.ts               # Índice principal de componentes
├── pages/                     # Páginas completas
│   ├── ProductsPage.tsx
│   ├── LandingPage.tsx
│   └── index.ts
├── hooks/                     # Custom hooks
│   ├── useApi.ts
│   ├── useApiError.ts
│   └── index.ts
├── services/                  # Servicios de API
│   ├── auth.service.ts
│   ├── error-handler.service.ts
│   ├── mock-auth.service.ts
│   ├── audio-product.service.ts
│   ├── mock-audio-product.service.ts
│   └── index.ts
├── types/                     # Tipos TypeScript
│   ├── error-response.model.ts
│   ├── audio-product.model.ts
│   └── index.ts
├── utils/                     # Utilidades
│   ├── errorHandler.ts
│   ├── errorExamples.md
│   └── index.ts
├── contexts/                  # Contextos de React
│   ├── AuthContext.tsx
│   ├── ErrorContext.tsx
│   └── index.ts
├── styles/                    # Estilos globales
│   ├── ErrorNotification.css
│   └── theme.ts
├── config/                    # Configuración
│   ├── api.ts
│   ├── app.ts
│   ├── environment.ts
│   └── index.ts
├── data/                      # Datos mock
│   ├── mock-products.ts
│   └── index.ts
├── store/                     # Estado global (Redux/Zustand)
│   └── slices/
├── App.tsx                    # Componente principal
├── index.tsx                  # Punto de entrada
├── index.css                  # Estilos globales
├── App.css                    # Estilos del App
└── index.ts                   # Índice principal de la aplicación
```

## 🎯 Principios de Organización

### 1. **Separación por Funcionalidad**
- `auth/`: Todo lo relacionado con autenticación
- `products/`: Todo lo relacionado con productos de audio
- `layout/`: Componentes de estructura de página
- `ui/`: Componentes reutilizables de interfaz

### 2. **Archivos de Índice**
- Cada carpeta tiene su `index.ts` para facilitar importaciones
- Importaciones limpias: `import { ProductCard } from '@/components/products'`

### 3. **Importaciones Relativas**
- Uso de rutas relativas para mantener la modularidad
- Fácil de mover carpetas sin romper importaciones

### 4. **CSS Colocado**
- Cada componente tiene su CSS en la misma carpeta
- Mantiene la cohesión del código

## 📦 Beneficios de esta Estructura

1. **Mantenibilidad**: Fácil encontrar y modificar componentes
2. **Escalabilidad**: Estructura preparada para crecer
3. **Reutilización**: Componentes UI claramente separados
4. **Testing**: Fácil escribir tests para componentes específicos
5. **Colaboración**: Múltiples desarrolladores pueden trabajar en diferentes módulos

## 🔄 Cómo Usar

### Importar Componentes
```typescript
// Importación individual
import { ProductCard } from '@/components/products/ProductCard';

// Importación desde el índice
import { ProductCard } from '@/components/products';

// Importación desde el índice principal
import { ProductCard } from '@/components';
```

### Agregar Nuevos Componentes
1. Crear el componente en la carpeta apropiada
2. Agregar la exportación al `index.ts` de la carpeta
3. Si es necesario, agregar al `index.ts` principal

### Mover Componentes
1. Mover archivos a la nueva ubicación
2. Actualizar rutas de importación
3. Actualizar archivos de índice

## 🚀 Próximos Pasos

- [ ] Crear archivos de índice para todas las carpetas
- [ ] Actualizar todas las importaciones
- [ ] Agregar alias de importación en tsconfig.json
- [ ] Crear documentación de componentes
- [ ] Implementar testing por módulos
