# 🚀 Sistema de Checkout con Wompi - HatsuSound

## 📋 Descripción General

Este sistema de checkout implementa un flujo completo de pagos con Wompi para la plataforma HatsuSound, cumpliendo con todos los requisitos de la prueba técnica FullStack Development.

## ✨ Características Principales

### 🔐 **Autenticación y Seguridad**
- Sistema de JWT con renovación automática de tokens
- Validación de roles (admin para creación de tokens de pago)
- Manejo seguro de datos sensibles
- CORS configurado para desarrollo y producción

### 💳 **Flujos de Pago**
1. **Pago Directo**: Procesamiento inmediato con token de método de pago
2. **Pago Intent**: Redirección a Wompi para completar el pago
3. **Validación en Tiempo Real**: Detección automática de tipo de tarjeta (VISA, Mastercard, AMEX)

### 📱 **Experiencia de Usuario**
- **5 Pasos del Checkout**: Productos → Información → Resumen → Procesando → Completado
- **Diseño Responsive**: Optimizado para móviles (iPhone SE 2020+)
- **Validaciones Visuales**: Feedback inmediato en formularios
- **Animaciones**: Transiciones suaves entre pasos

### 🛠️ **Arquitectura Técnica**
- **Frontend**: React + TypeScript + CSS Modules
- **Estado**: Context API + Hooks personalizados
- **Validaciones**: Algoritmo de Luhn para tarjetas
- **Manejo de Errores**: Sistema robusto con mensajes claros

## 🏗️ Estructura del Proyecto

```
src/
├── components/
│   └── checkout/
│       ├── CheckoutModal.tsx          # Modal principal del checkout
│       ├── CheckoutModal.css          # Estilos del modal
│       ├── CheckoutTestComponent.tsx  # Componente de pruebas
│       └── index.ts                   # Exportaciones
├── services/
│   └── checkout.service.ts            # Servicio de checkout
├── hooks/
│   └── useCheckout.ts                 # Hook personalizado
├── types/
│   └── checkout.model.ts              # Tipos TypeScript
└── contexts/
    ├── AuthContext.tsx                # Contexto de autenticación
    └── CartContext.tsx                # Contexto del carrito
```

## 🚀 Instalación y Configuración

### 1. **Dependencias**
```bash
npm install
```

### 2. **Variables de Entorno**
Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# URL del backend API
REACT_APP_API_URL=http://localhost:3001

# Entorno de Wompi
REACT_APP_WOMPI_ENVIRONMENT=test

# URL del frontend
REACT_APP_FRONTEND_URL=http://localhost:3000

# Configuración de moneda
REACT_APP_DEFAULT_CURRENCY=COP

# Fees en centavos
REACT_APP_BASE_FEE=1000
REACT_APP_DELIVERY_FEE=500
```

### 3. **Configuración del Backend**
Asegúrate de que tu backend esté ejecutándose en `http://localhost:3001` y tenga configurado CORS para `http://localhost:3000`.

## 🧪 Uso y Pruebas

### **Componente de Prueba**
```tsx
import { CheckoutTestComponent } from './components/checkout/CheckoutTestComponent';

// En tu componente principal
<CheckoutTestComponent />
```

### **Integración en Carrito**
```tsx
import { CheckoutModal } from './components/checkout';

// En tu componente de carrito
const [showCheckout, setShowCheckout] = useState(false);

<CheckoutModal 
  isOpen={showCheckout} 
  onClose={() => setShowCheckout(false)} 
/>
```

### **Hook Personalizado**
```tsx
import { useCheckout } from './hooks/useCheckout';

const {
  isLoading,
  error,
  currentStep,
  formData,
  paymentType,
  checkoutSummary,
  updateFormData,
  processCheckout
} = useCheckout();
```

## 💳 Flujos de Pago

### **Flujo A: Pago Directo**
1. Usuario selecciona "Pago Directo"
2. Completa datos de tarjeta
3. Se crea token de método de pago (solo admin)
4. Se procesa pago inmediatamente
5. Usuario recibe confirmación instantánea

### **Flujo B: Pago Intent (Recomendado)**
1. Usuario selecciona "Pago en Wompi"
2. Completa datos básicos
3. Se crea checkout de intención
4. Usuario es redirigido a Wompi
5. Completa pago en Wompi
6. Wompi redirige de vuelta con resultado

## 🔧 API Endpoints

### **Autenticación**
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Login y obtención de JWT
- `POST /api/auth/refresh` - Renovación de token

### **Checkout**
- `POST /checkout` - Crear checkout (con o sin token)
- `GET /checkout/status/:id` - Estado de transacción local
- `GET /checkout/wompi/status/:id` - Estado directo de Wompi

### **Tokens de Pago (Solo Admin)**
- `POST /checkout/wompi/create-token` - Crear token de método de pago

## 📱 Responsive Design

### **Breakpoints**
- **Mobile First**: iPhone SE 2020 (375px) y superior
- **Tablet**: 768px y superior
- **Desktop**: 1024px y superior

### **Características Móviles**
- Navegación por pasos optimizada
- Formularios adaptados a pantallas táctiles
- Botones de tamaño adecuado (44px mínimo)
- Scroll horizontal en pasos del checkout

## 🎨 Temas y Estilos

### **Paleta de Colores**
- **Primario**: `#e94560` (Rosa vibrante)
- **Secundario**: `#f39c12` (Naranja)
- **Éxito**: `#4caf50` (Verde)
- **Error**: `#f44336` (Rojo)
- **Fondo**: `#1a1a2e` (Azul oscuro)

### **Gradientes**
- Header: Rosa a Naranja
- Botones: Rosa a Naranja
- Botón de checkout: Verde a Verde oscuro

### **Animaciones**
- Transiciones suaves (0.3s ease)
- Hover effects con transform
- Spinner de carga
- Animación de éxito con checkmark

## 🧪 Testing

### **Validaciones de Tarjeta**
- Algoritmo de Luhn implementado
- Detección automática de tipo de tarjeta
- Validación de CVC según tipo
- Validación de fecha de expiración

### **Cálculos de Precio**
- Conversión de centavos a moneda
- Cálculo automático de fees
- Resumen detallado de costos

### **Manejo de Errores**
- Validación de formularios
- Manejo de errores de API
- Mensajes de error claros y útiles

## 🔒 Seguridad

### **Datos Sensibles**
- No se almacenan datos de tarjeta en el frontend
- Tokens JWT con expiración
- Renovación automática de tokens
- Validación de roles para operaciones sensibles

### **Validaciones**
- Sanitización de inputs
- Validación de tipos de datos
- Verificación de permisos
- Manejo seguro de errores

## 🚀 Despliegue

### **Variables de Producción**
```bash
REACT_APP_API_URL=https://tu-api.com
REACT_APP_WOMPI_ENVIRONMENT=production
REACT_APP_FRONTEND_URL=https://tu-app.com
```

### **Build de Producción**
```bash
npm run build
```

### **Consideraciones de Despliegue**
- Configurar CORS en el backend
- Usar HTTPS en producción
- Configurar variables de entorno del servidor
- Implementar monitoreo de errores

## 📚 Recursos Adicionales

### **Documentación Wompi**
- [Inicio Rápido](https://docs.wompi.co/docs/colombia/inicio-rapido/)
- [Ambientes y Llaves](https://docs.wompi.co/docs/colombia/ambientes-y-llaves/)
- [Pago con Tarjetas](https://soporte.wompi.co/hc/es-419/articles/360057781394--C%C3%B3mo-pagar-con-tarjetas-a-trav%C3%A9s-de-Wompi-)

### **Credenciales de Prueba**
- **Usuario**: procesoseleccionbackend@yopmail.com
- **Contraseña**: JobProcessWompi987*
- **API Keys**: Incluidas en la documentación de Wompi

## 🐛 Solución de Problemas

### **Error de CORS**
- Verificar configuración CORS en el backend
- Asegurar que `REACT_APP_API_URL` sea correcta

### **Error de Autenticación**
- Verificar que el usuario esté logueado
- Comprobar validez del JWT
- Verificar renovación automática de tokens

### **Error de Validación**
- Comprobar formato de datos de tarjeta
- Verificar fecha de expiración
- Validar CVC según tipo de tarjeta

## 🤝 Contribución

### **Estándares de Código**
- TypeScript estricto
- ESLint + Prettier
- Componentes funcionales con hooks
- CSS Modules para estilos

### **Commits**
- Usar convención de commits semánticos
- Incluir descripción detallada de cambios
- Referenciar issues relacionados

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación:

- **Issues**: Crear un issue en el repositorio
- **Documentación**: Revisar este README y la documentación de Wompi
- **Comunidad**: Unirse a la comunidad de desarrolladores

---

**¡Happy Coding! 🎵✨**
