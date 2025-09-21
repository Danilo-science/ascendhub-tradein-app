// Utilidades para PWA y Service Worker
export interface PWAInstallPrompt {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export interface PWAUpdateAvailable {
  waiting: ServiceWorker | null;
  skipWaiting(): void;
}

class PWAManager {
  private deferredPrompt: PWAInstallPrompt | null = null;
  private updateAvailable: PWAUpdateAvailable | null = null;
  private callbacks: {
    onInstallPrompt?: (prompt: PWAInstallPrompt) => void;
    onUpdateAvailable?: (update: PWAUpdateAvailable) => void;
    onInstalled?: () => void;
    onOffline?: () => void;
    onOnline?: () => void;
  } = {};

  constructor() {
    this.init();
  }

  private init() {
    // Registrar Service Worker
    this.registerServiceWorker();
    
    // Escuchar eventos PWA
    this.setupEventListeners();
    
    // Verificar estado de conexión
    this.setupConnectionListeners();
  }

  private async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none'
        });

        console.log('[PWA] Service Worker registrado:', registration.scope);

        // Verificar actualizaciones
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            this.handleServiceWorkerUpdate(newWorker, registration);
          }
        });

        // Verificar si hay un SW esperando
        if (registration.waiting) {
          this.showUpdateAvailable(registration.waiting);
        }

        // Verificar actualizaciones periódicamente
        setInterval(() => {
          registration.update();
        }, 60000); // Cada minuto

      } catch (error) {
        console.error('[PWA] Error registrando Service Worker:', error);
      }
    }
  }

  private handleServiceWorkerUpdate(newWorker: ServiceWorker, registration: ServiceWorkerRegistration) {
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // Nueva versión disponible
        this.showUpdateAvailable(newWorker);
      }
    });
  }

  private showUpdateAvailable(worker: ServiceWorker) {
    this.updateAvailable = {
      waiting: worker,
      skipWaiting: () => {
        worker.postMessage({ type: 'SKIP_WAITING' });
        window.location.reload();
      }
    };

    if (this.callbacks.onUpdateAvailable) {
      this.callbacks.onUpdateAvailable(this.updateAvailable);
    }
  }

  private setupEventListeners() {
    // Evento de instalación PWA
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as any;
      
      if (this.callbacks.onInstallPrompt) {
        this.callbacks.onInstallPrompt(this.deferredPrompt);
      }
    });

    // PWA instalada
    window.addEventListener('appinstalled', () => {
      console.log('[PWA] Aplicación instalada');
      this.deferredPrompt = null;
      
      if (this.callbacks.onInstalled) {
        this.callbacks.onInstalled();
      }
    });

    // Service Worker controlando
    navigator.serviceWorker?.addEventListener('controllerchange', () => {
      console.log('[PWA] Service Worker actualizado');
      window.location.reload();
    });
  }

  private setupConnectionListeners() {
    window.addEventListener('online', () => {
      console.log('[PWA] Conexión restaurada');
      if (this.callbacks.onOnline) {
        this.callbacks.onOnline();
      }
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Sin conexión');
      if (this.callbacks.onOffline) {
        this.callbacks.onOffline();
      }
    });
  }

  // Métodos públicos
  public async installApp(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const choiceResult = await this.deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('[PWA] Usuario aceptó la instalación');
        return true;
      } else {
        console.log('[PWA] Usuario rechazó la instalación');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Error en instalación:', error);
      return false;
    } finally {
      this.deferredPrompt = null;
    }
  }

  public updateApp(): void {
    if (this.updateAvailable) {
      this.updateAvailable.skipWaiting();
    }
  }

  public isInstallable(): boolean {
    return this.deferredPrompt !== null;
  }

  public isUpdateAvailable(): boolean {
    return this.updateAvailable !== null;
  }

  public isOnline(): boolean {
    return navigator.onLine;
  }

  public isPWA(): boolean {
    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true;
  }

  public getInstallPrompt(): PWAInstallPrompt | null {
    return this.deferredPrompt;
  }

  public onInstallPrompt(callback: (prompt: PWAInstallPrompt) => void): void {
    this.callbacks.onInstallPrompt = callback;
  }

  public onUpdateAvailable(callback: (update: PWAUpdateAvailable) => void): void {
    this.callbacks.onUpdateAvailable = callback;
  }

  public onInstalled(callback: () => void): void {
    this.callbacks.onInstalled = callback;
  }

  public onOffline(callback: () => void): void {
    this.callbacks.onOffline = callback;
  }

  public onOnline(callback: () => void): void {
    this.callbacks.onOnline = callback;
  }

  // Utilidades de cache
  public async clearCache(): Promise<void> {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('[PWA] Cache limpiado');
    }
  }

  public async getCacheSize(): Promise<number> {
    if ('caches' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return estimate.usage || 0;
    }
    return 0;
  }

  // Notificaciones
  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      return await Notification.requestPermission();
    }
    return 'denied';
  }

  public showNotification(title: string, options?: NotificationOptions): void {
    if ('serviceWorker' in navigator && Notification.permission === 'granted') {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(title, {
          icon: '/icon-192x192.png',
          badge: '/icon-192x192.png',
          ...options
        });
      });
    }
  }
}

// Instancia singleton
export const pwaManager = new PWAManager();

// Hook para React
export function usePWA() {
  return {
    installApp: () => pwaManager.installApp(),
    updateApp: () => pwaManager.updateApp(),
    isInstallable: () => pwaManager.isInstallable(),
    isUpdateAvailable: () => pwaManager.isUpdateAvailable(),
    isOnline: () => pwaManager.isOnline(),
    isPWA: () => pwaManager.isPWA(),
    clearCache: () => pwaManager.clearCache(),
    getCacheSize: () => pwaManager.getCacheSize(),
    requestNotificationPermission: () => pwaManager.requestNotificationPermission(),
    showNotification: (title: string, options?: NotificationOptions) => 
      pwaManager.showNotification(title, options),
    onInstallPrompt: (callback: (prompt: PWAInstallPrompt) => void) => 
      pwaManager.onInstallPrompt(callback),
    onUpdateAvailable: (callback: (update: PWAUpdateAvailable) => void) => 
      pwaManager.onUpdateAvailable(callback),
    onInstalled: (callback: () => void) => pwaManager.onInstalled(callback),
    onOffline: (callback: () => void) => pwaManager.onOffline(callback),
    onOnline: (callback: () => void) => pwaManager.onOnline(callback)
  };
}

export default pwaManager;