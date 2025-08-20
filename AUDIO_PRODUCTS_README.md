# 🎵 Sistema de Productos de Audio - HatsuSound Frontend

## 📋 Descripción General

Este sistema implementa una interfaz moderna y elegante para mostrar productos de audio, con un diseño que incluye discos de vinilo giratorios y una experiencia de usuario premium. La arquitectura está preparada para integrarse con tu backend cuando esté listo.

## 🏗️ Estructura del Proyecto

```
src/
├── components/audio-products/
│   ├── AudioProductCard.tsx          # Tarjeta individual de producto
│   ├── AudioProductCard.css          # Estilos de la tarjeta
│   ├── AudioProductsList.tsx         # Lista de productos
│   ├── AudioProductsList.css         # Estilos de la lista
│   └── index.ts                      # Exportaciones
├── hooks/
│   └── useAudioProducts.ts           # Hook personalizado para productos
├── pages/
│   ├── AudioProductsPage.tsx         # Página principal de productos
│   └── AudioProductsPage.css         # Estilos de la página
├── services/
│   ├── audio-products.service.ts     # Servicio real para el backend
│   └── mock-audio-products.service.ts # Servicio mock para desarrollo
├── types/
│   └── audio-product.model.ts        # Tipos TypeScript
└── config/
    └── api.ts                        # Configuración de API
```

## 🚀 Características Principales

### ✨ Diseño Moderno
- **Gradientes elegantes** con tema oscuro
- **Efectos de hover** con animaciones suaves
- **Responsive design** para todos los dispositivos
- **Glassmorphism** y efectos de profundidad

### 🎵 Disco Giratorio
- **Animación 3D** del disco de vinilo
- **Giro automático** al pasar el mouse
- **Efectos de sombra** realistas
- **Centro dorado** con información del producto

### 📱 Funcionalidades
- **Lista de productos** con paginación
- **Carga infinita** (load more)
- **Estados de carga** y manejo de errores
- **Estadísticas en tiempo real** (reproducciones, descargas)
- **Filtros y búsqueda** (preparado para implementar)

## 🔧 Configuración

### Variables de Entorno
Agrega estas variables a tu archivo `.env`:

```env
# URL del backend (cuando esté listo)
REACT_APP_API_URL=http://localhost:3000

# Otras configuraciones
REACT_APP_ENVIRONMENT=development
```

### Cambiar de Mock a Backend Real
Cuando tu backend esté listo, modifica el hook `useAudioProducts.ts`:

```typescript
// Cambiar esta línea:
import mockAudioProductsService from '../services/mock-audio-products.service';

// Por esta:
import audioProductsService from '../services/audio-products.service';

// Y cambiar la llamada:
const response = await mockAudioProductsService.getProducts(currentFilters);
// Por:
const response = await audioProductsService.getProducts(currentFilters);
```

## 🎨 Componentes Principales

### AudioProductCard
- **Disco giratorio** con información del producto
- **Información completa** del producto
- **Botones de acción** (reproducir, descargar)
- **Badges** para género, duración, contenido explícito
- **Estadísticas** de reproducciones y descargas

### AudioProductsList
- **Grid responsive** de productos
- **Header con estadísticas** del total
- **Paginación automática** con botón "cargar más"
- **Estados de carga** y manejo de errores
- **Botón de actualización** para refrescar datos

### AudioProductsPage
- **Hero section** con título y estadísticas
- **Sección de productos** principal
- **Sección de características** de la plataforma
- **Discos flotantes** animados en el hero

## 🔌 API Integration

### Endpoints Preparados
El sistema está configurado para estos endpoints:

```typescript
AUDIO_PRODUCTS: {
  LIST: '/api/audio-products',           // Listar productos
  SEARCH: '/api/audio-products/search',  // Búsqueda
  BY_ID: '/api/audio-products/:id',      // Producto por ID
  PLAY: '/api/audio-products/:id/play',  // Incrementar reproducciones
  DOWNLOAD: '/api/audio-products/:id/download' // Incrementar descargas
}
```

### Autenticación
- **JWT Token** en header Authorization
- **Manejo automático** de tokens expirados
- **Headers** configurados automáticamente

### Filtros Soportados
```typescript
interface AudioProductFilters {
  query?: string;           // Búsqueda general
  artist?: string;          // Filtro por artista
  genre?: string;           // Filtro por género
  minPrice?: number;        // Precio mínimo
  maxPrice?: number;        // Precio máximo
  isActive?: boolean;       // Estado activo
  page?: number;            // Número de página
  limit?: number;           // Elementos por página
  sortBy?: string;          // Campo para ordenar
  sortOrder?: 'asc' | 'desc'; // Orden
}
```

## 🎯 Uso Básico

### 1. Importar la Página
```typescript
import { AudioProductsPage } from './pages/AudioProductsPage';

// En tu router o App.tsx
<Route path="/products" element={<AudioProductsPage />} />
```

### 2. Usar el Hook
```typescript
import { useAudioProducts } from './hooks/useAudioProducts';

const MyComponent = () => {
  const { products, loading, error, refetch } = useAudioProducts({
    genre: 'rock',
    sortBy: 'price',
    sortOrder: 'asc'
  });

  // Usar los datos...
};
```

### 3. Componente Individual
```typescript
import { AudioProductCard } from './components/audio-products';

const MyProduct = () => (
  <AudioProductCard
    product={productData}
    onPlay={(product) => console.log('Reproduciendo:', product.title)}
    onDownload={(product) => console.log('Descargando:', product.title)}
  />
);
```

## 🎨 Personalización

### Colores de Géneros
Modifica `AudioProductCard.tsx` para cambiar los colores:

```typescript
const getGenreColor = (genre: string): string => {
  const genreColors: Record<string, string> = {
    rock: 'bg-red-500',        // Cambia estos colores
    pop: 'bg-pink-500',
    jazz: 'bg-purple-500',
    // ... más géneros
  };
  return genreColors[genre] || 'bg-gray-500';
};
```

### Estilos del Disco
Modifica `AudioProductCard.css` para cambiar la apariencia:

```css
.vinyl-disc {
  width: 120px;           /* Tamaño del disco */
  height: 120px;
  /* Más propiedades... */
}

.vinyl-disc.spinning {
  animation: spin 2s linear infinite; /* Velocidad de giro */
}
```

## 📱 Responsive Design

El sistema incluye breakpoints para:
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px
- **Mobile**: 480px - 767px
- **Small Mobile**: < 480px

## 🚀 Próximos Pasos

### Filtros y Búsqueda
- [ ] Implementar barra de búsqueda
- [ ] Filtros por precio
- [ ] Filtros por género
- [ ] Ordenamiento personalizable

### Funcionalidades Avanzadas
- [ ] Reproductor de audio integrado
- [ ] Lista de favoritos
- [ ] Historial de reproducciones
- [ ] Recomendaciones personalizadas

### Integración Backend
- [ ] Conectar con tu API real
- [ ] Implementar autenticación JWT
- [ ] Manejo de errores del servidor
- [ ] Rate limiting y optimizaciones

## 🐛 Solución de Problemas

### El disco no gira
- Verifica que el CSS esté cargado correctamente
- Asegúrate de que `isHovered` esté funcionando
- Revisa la consola del navegador por errores

### Los productos no se cargan
- Verifica que el servicio mock esté funcionando
- Revisa la consola por errores de red
- Asegúrate de que los tipos TypeScript coincidan

### Estilos no se aplican
- Verifica que los archivos CSS estén importados
- Revisa que Tailwind CSS esté configurado
- Asegúrate de que las clases CSS estén correctas

## 📚 Recursos Adicionales

- **Tailwind CSS**: Para estilos y responsive design
- **TypeScript**: Para tipado seguro
- **React Hooks**: Para manejo de estado
- **CSS Grid**: Para layouts responsivos
- **CSS Animations**: Para efectos visuales

## 🤝 Contribución

Para contribuir al proyecto:
1. Sigue las convenciones de código existentes
2. Mantén la consistencia en el diseño
3. Agrega tests para nuevas funcionalidades
4. Documenta cambios importantes

---

**¡Disfruta creando música con HatsuSound! 🎵✨**
