# Guía PWA - AscendHub Trade-in Flow

## 🌟 Introducción

Esta guía detalla la implementación de Progressive Web App (PWA) en AscendHub Trade-in Flow, proporcionando una experiencia similar a una aplicación nativa con capacidades offline.

## 📱 Características PWA Implementadas

### ✅ Funcionalidades Disponibles

1. **Instalación como App Nativa**
   - Banner de instalación automático
   - Icono en el escritorio/pantalla de inicio
   - Experiencia de app independiente

2. **Funcionamiento Offline**
   - Cache de recursos estáticos
   - Página offline personalizada
   - Sincronización en background

3. **Notificaciones de Actualización**
   - Detección automática de nuevas versiones
   - Prompt para actualizar la aplicación
   - Actualización sin interrumpir la experiencia

4. **Detección de Conectividad**
   - Indicador de estado de conexión
   - Manejo inteligente de recursos
   - Fallback a cache cuando sea necesario

## 🛠️ Arquitectura Técnica

### Archivos Principales

```
public/
├── manifest.json          # Configuración PWA
├── sw.js                 # Service Worker
└── offline.html          # Página offline

src/
├── components/
│   ├── PWAInstallBanner.tsx      # Banner de instalación
│   └── PWAUpdateNotification.tsx # Notificaciones de actualización
└── lib/
    └── pwa.ts            # Utilidades y manager PWA
```

### Service Worker (sw.js)

**Estrategias de cache implementadas:**

1. **Cache First** - Recursos estáticos
   - HTML, CSS, JS, imágenes
   - Iconos y manifest
   - Fuentes web

2. **Network First** - API calls
   - Datos dinámicos
   - Respuestas de servidor
   - Fallback a cache si offline

3. **Stale While Revalidate** - Recursos semi-estáticos
   - Imágenes de productos
   - Assets actualizables

### Manifest.json

```json
{
  "name": "AscendHub Trade-in Flow",
  "short_name": "AscendHub",
  "description": "Plataforma de trade-in para dispositivos electrónicos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait-primary",
  "categories": ["shopping", "business"],
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ]
}
```

## 🎯 Componentes PWA

### PWAInstallBanner

**Funcionalidad:**
- Detecta si la app es instalable
- Muestra banner promocional
- Maneja el proceso de instalación
- Se oculta automáticamente después de instalar

**Uso:**
```tsx
import { PWAInstallBanner } from '@/components/PWAInstallBanner';

function App() {
  return (
    <div>
      <PWAInstallBanner />
      {/* Resto de la aplicación */}
    </div>
  );
}
```

### PWAUpdateNotification

**Funcionalidad:**
- Detecta nuevas versiones disponibles
- Muestra notificación de actualización
- Permite actualizar sin recargar
- Maneja el ciclo de vida del Service Worker

**Estados:**
- `idle` - Sin actualizaciones
- `available` - Actualización disponible
- `installing` - Instalando actualización
- `ready` - Listo para activar

### PWA Manager (pwa.ts)

**API Principal:**
```typescript
// Instancia singleton
import { pwaManager } from '@/lib/pwa';

// Métodos disponibles
pwaManager.isInstallable()          // Verifica si es instalable
pwaManager.promptInstall()          // Muestra prompt de instalación
pwaManager.isOnline()              // Estado de conexión
pwaManager.clearCache()            // Limpia cache
pwaManager.checkForUpdates()       // Busca actualizaciones
pwaManager.showNotification()      // Muestra notificación
```

## 📋 Guía de Instalación para Usuarios

### En Dispositivos Móviles

**Android (Chrome):**
1. Visita la aplicación en Chrome
2. Aparecerá un banner "Agregar a pantalla de inicio"
3. Toca "Agregar" para instalar
4. La app aparecerá en tu pantalla de inicio

**iOS (Safari):**
1. Visita la aplicación en Safari
2. Toca el botón "Compartir" (cuadrado con flecha)
3. Selecciona "Agregar a pantalla de inicio"
4. Confirma la instalación

### En Desktop

**Chrome/Edge:**
1. Visita la aplicación
2. Busca el ícono de instalación en la barra de direcciones
3. Haz clic en "Instalar AscendHub"
4. La app se abrirá en una ventana independiente

## 🔧 Configuración y Personalización

### Modificar Manifest

Para personalizar la configuración PWA, edita `public/manifest.json`:

```json
{
  "name": "Tu App Name",
  "short_name": "TuApp",
  "theme_color": "#tu-color",
  "background_color": "#tu-background",
  "start_url": "/tu-ruta-inicial"
}
```

### Personalizar Service Worker

Edita `public/sw.js` para modificar estrategias de cache:

```javascript
// Agregar nuevos recursos al cache
const CACHE_RESOURCES = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/tu-recurso-personalizado'
];

// Modificar estrategias de cache
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/api/')) {
    // Network First para APIs
    event.respondWith(networkFirst(event.request));
  } else {
    // Cache First para recursos estáticos
    event.respondWith(cacheFirst(event.request));
  }
});
```

### Configurar Notificaciones

```typescript
// En tu componente
import { pwaManager } from '@/lib/pwa';

const handleNotification = async () => {
  if (pwaManager.isNotificationSupported()) {
    await pwaManager.requestNotificationPermission();
    pwaManager.showNotification('Título', {
      body: 'Mensaje de la notificación',
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png'
    });
  }
};
```

## 🧪 Testing PWA

### Herramientas de Desarrollo

1. **Chrome DevTools**
   - Application tab > Service Workers
   - Application tab > Manifest
   - Network tab (simular offline)

2. **Lighthouse Audit**
   ```bash
   npm run lighthouse
   ```

3. **PWA Builder**
   - Validación online del manifest
   - Generación de iconos
   - Testing de funcionalidades

### Tests Automatizados

```bash
# Ejecutar tests PWA
npm run test src/test/lib/pwa.test.ts

# Coverage específico de PWA
npm run test:coverage -- src/lib/pwa.ts
```

## 📊 Monitoreo y Analytics

### Métricas PWA Importantes

1. **Instalación**
   - Tasa de instalación
   - Retención post-instalación
   - Uso desde app vs browser

2. **Offline Usage**
   - Páginas visitadas offline
   - Recursos servidos desde cache
   - Errores de conectividad

3. **Performance**
   - Tiempo de carga inicial
   - Cache hit ratio
   - Service Worker performance

### Implementar Analytics

```typescript
// Tracking de instalación PWA
window.addEventListener('beforeinstallprompt', (e) => {
  // Analytics: PWA install prompt shown
  gtag('event', 'pwa_install_prompt_shown');
});

window.addEventListener('appinstalled', (e) => {
  // Analytics: PWA installed
  gtag('event', 'pwa_installed');
});
```

## 🚨 Troubleshooting

### Problemas Comunes

**1. PWA no se puede instalar**
- ✅ Verificar que manifest.json sea válido
- ✅ Confirmar que Service Worker esté registrado
- ✅ Asegurar conexión HTTPS
- ✅ Revisar iconos requeridos

**2. Service Worker no actualiza**
- ✅ Verificar versión en sw.js
- ✅ Limpiar cache del navegador
- ✅ Revisar estrategia de actualización
- ✅ Comprobar registro del SW

**3. Funcionalidad offline no funciona**
- ✅ Verificar recursos en cache
- ✅ Revisar estrategias de fetch
- ✅ Comprobar página offline
- ✅ Validar rutas cacheadas

**4. Notificaciones no aparecen**
- ✅ Verificar permisos del navegador
- ✅ Confirmar soporte de notificaciones
- ✅ Revisar Service Worker activo
- ✅ Validar formato de notificación

### Comandos de Debugging

```bash
# Limpiar cache de desarrollo
npm run dev:clean

# Verificar Service Worker
npm run sw:check

# Validar manifest
npm run manifest:validate

# Test offline
npm run test:offline
```

## 🔄 Actualizaciones y Mantenimiento

### Proceso de Actualización

1. **Desarrollo**
   - Modificar código fuente
   - Actualizar versión en package.json
   - Incrementar versión en sw.js

2. **Build**
   - Generar nuevo build
   - Verificar manifest actualizado
   - Confirmar Service Worker nuevo

3. **Deploy**
   - Subir archivos al servidor
   - Service Worker detecta cambios
   - Usuarios reciben notificación

### Versionado

```javascript
// En sw.js
const CACHE_VERSION = 'v1.2.0';
const CACHE_NAME = `ascendhub-cache-${CACHE_VERSION}`;
```

### Migración de Cache

```javascript
// Limpiar caches antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
```

---

**Última actualización:** Septiembre 2024  
**Versión PWA:** 1.0.0  
**Compatibilidad:** Chrome 67+, Firefox 67+, Safari 11.1+, Edge 79+