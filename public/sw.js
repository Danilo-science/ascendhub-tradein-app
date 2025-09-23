// Service Worker para PWA y caching optimizado
const CACHE_NAME = 'ascendhub-v1.0.0';
const STATIC_CACHE = 'ascendhub-static-v1.0.0';
const DYNAMIC_CACHE = 'ascendhub-dynamic-v1.0.0';

// Recursos estáticos para cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Iconos PWA
  '/icon-192x192.svg',
  '/icon-512x512.svg',
  '/apple-touch-icon-192.svg',
  '/favicon.ico'
];

// Recursos dinámicos que se cachean bajo demanda
const CACHE_STRATEGIES = {
  // Páginas principales - Cache First
  pages: [
    '/',
    '/apple',
    '/electronica',
    '/carrito',
    '/dashboard',
    '/trade-in'
  ],
  // APIs - Network First con fallback
  apis: [
    '/api/',
    'https://api.supabase.co/',
    'https://api.mercadopago.com/'
  ],
  // Assets estáticos - Cache First
  assets: [
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.svg',
    '.webp',
    '.woff',
    '.woff2'
  ]
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Error caching static assets:', error);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Eliminar caches antiguos
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo manejar requests HTTP/HTTPS
  if (!request.url.startsWith('http')) {
    return;
  }

  // Estrategia de caching basada en el tipo de recurso
  if (request.method === 'GET') {
    event.respondWith(handleGetRequest(request, url));
  }
});

// Manejar requests GET con diferentes estrategias
async function handleGetRequest(request, url) {
  try {
    // 1. Páginas principales - Cache First con Network Fallback
    if (isPageRequest(url.pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }

    // 2. APIs - Network First con Cache Fallback
    if (isApiRequest(url.href)) {
      return await networkFirstStrategy(request, DYNAMIC_CACHE);
    }

    // 3. Assets estáticos - Cache First
    if (isAssetRequest(url.pathname)) {
      return await cacheFirstStrategy(request, STATIC_CACHE);
    }

    // 4. Otros recursos - Network First
    return await networkFirstStrategy(request, DYNAMIC_CACHE);

  } catch (error) {
    console.error('[SW] Error handling request:', error);
    
    // Fallback para páginas
    if (isPageRequest(url.pathname)) {
      const offlineResponse = await caches.match('/offline.html');
      return offlineResponse || new Response('Offline', { status: 503 });
    }
    
    return new Response('Network Error', { status: 503 });
  }
}

// Estrategia Cache First
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Actualizar cache en background si es necesario
    updateCacheInBackground(request, cacheName);
    return cachedResponse;
  }

  // Si no está en cache, buscar en red y cachear
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// Estrategia Network First
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cachear respuesta exitosa
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback a cache si la red falla
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Actualizar cache en background
async function updateCacheInBackground(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
  } catch (error) {
    // Silenciar errores de background updates
    console.log('[SW] Background update failed:', error.message);
  }
}

// Helpers para identificar tipos de requests
function isPageRequest(pathname) {
  return CACHE_STRATEGIES.pages.some(page => 
    pathname === page || pathname.startsWith(page + '/')
  );
}

function isApiRequest(url) {
  return CACHE_STRATEGIES.apis.some(api => url.includes(api));
}

function isAssetRequest(pathname) {
  return CACHE_STRATEGIES.assets.some(ext => pathname.endsWith(ext));
}

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Limpiar caches periódicamente
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupOldCaches());
  }
});

// Función para limpiar caches antiguos
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    !name.includes('v1.0.0') && name.startsWith('ascendhub-')
  );
  
  return Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}

console.log('[SW] Service Worker loaded successfully');