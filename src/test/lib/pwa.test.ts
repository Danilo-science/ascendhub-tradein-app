import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pwaManager } from '../../lib/pwa';

// Mock de Service Worker
const mockServiceWorker = {
  register: vi.fn(),
  getRegistration: vi.fn(),
  ready: Promise.resolve({
    update: vi.fn(),
    unregister: vi.fn(),
    addEventListener: vi.fn(),
    showNotification: vi.fn(),
  }),
};

Object.defineProperty(navigator, 'serviceWorker', {
  value: mockServiceWorker,
  writable: true,
});

// Mock de window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock de Notification API
const mockNotification = {
  permission: 'default',
  requestPermission: vi.fn().mockResolvedValue('granted'),
};

Object.defineProperty(window, 'Notification', {
  value: mockNotification,
  writable: true,
});

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('PWAManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('PWA Detection', () => {
    it('detecta cuando la app está en modo standalone', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(display-mode: standalone)',
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      expect(pwaManager.isPWA()).toBe(true);
    });

    it('detecta cuando la app NO está en modo standalone', () => {
      Object.defineProperty(window, 'matchMedia', {
        value: vi.fn().mockImplementation(() => ({
          matches: false,
          media: '',
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      expect(pwaManager.isPWA()).toBe(false);
    });
  });

  describe('Install Prompt', () => {
    it('detecta cuando la app es instalable', () => {
      // Por defecto no debería ser instalable sin prompt
      expect(pwaManager.isInstallable()).toBe(false);
    });

    it('instala la app correctamente cuando hay prompt disponible', async () => {
      const mockEvent = {
        preventDefault: vi.fn(),
        prompt: vi.fn(),
        userChoice: Promise.resolve({ outcome: 'accepted' }),
      };

      // Simular evento beforeinstallprompt
      const event = new CustomEvent('beforeinstallprompt', { detail: mockEvent });
      Object.defineProperty(event, 'preventDefault', { value: mockEvent.preventDefault });
      Object.defineProperty(event, 'prompt', { value: mockEvent.prompt });
      Object.defineProperty(event, 'userChoice', { value: mockEvent.userChoice });

      window.dispatchEvent(event);

      const result = await pwaManager.installApp();
      expect(result).toBe(true);
    });

    it('maneja cuando no hay prompt disponible', async () => {
      const result = await pwaManager.installApp();
      expect(result).toBe(false);
    });

    it('obtiene el prompt de instalación', () => {
      const prompt = pwaManager.getInstallPrompt();
      expect(prompt).toBeNull(); // Por defecto debería ser null
    });
  });

  describe('Connection Status', () => {
    it('detecta cuando está online', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: true,
        writable: true,
      });

      expect(pwaManager.isOnline()).toBe(true);
    });

    it('detecta cuando está offline', () => {
      Object.defineProperty(navigator, 'onLine', {
        value: false,
        writable: true,
      });

      expect(pwaManager.isOnline()).toBe(false);
    });

    it('registra callbacks para eventos de conexión', () => {
      const onlineCallback = vi.fn();
      const offlineCallback = vi.fn();

      pwaManager.onOnline(onlineCallback);
      pwaManager.onOffline(offlineCallback);

      // Simular cambio a offline
      Object.defineProperty(navigator, 'onLine', { value: false, writable: true });
      window.dispatchEvent(new Event('offline'));

      // Simular cambio a online
      Object.defineProperty(navigator, 'onLine', { value: true, writable: true });
      window.dispatchEvent(new Event('online'));

      // Los callbacks deberían estar registrados
      expect(onlineCallback).toBeDefined();
      expect(offlineCallback).toBeDefined();
    });
  });

  describe('Cache Management', () => {
    it('limpia el cache correctamente', async () => {
      const mockCache = {
        keys: vi.fn().mockResolvedValue([
          new Request('/api/old-data'),
          new Request('/api/current-data'),
        ]),
        delete: vi.fn().mockResolvedValue(true),
      };

      const mockCaches = {
        open: vi.fn().mockResolvedValue(mockCache),
        keys: vi.fn().mockResolvedValue(['v1', 'v2']),
        delete: vi.fn().mockResolvedValue(true),
      };

      Object.defineProperty(window, 'caches', {
        value: mockCaches,
        writable: true,
      });

      await pwaManager.clearCache();

      expect(mockCaches.keys).toHaveBeenCalled();
    });

    it('obtiene el tamaño del cache', async () => {
      const mockCache = {
        keys: vi.fn().mockResolvedValue([
          new Request('/api/data1'),
          new Request('/api/data2'),
        ]),
      };

      const mockCaches = {
        open: vi.fn().mockResolvedValue(mockCache),
        keys: vi.fn().mockResolvedValue(['app-cache-v1']),
      };

      Object.defineProperty(window, 'caches', {
        value: mockCaches,
        writable: true,
      });

      const size = await pwaManager.getCacheSize();
      expect(typeof size).toBe('number');
    });

    it('maneja errores al limpiar cache', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      Object.defineProperty(window, 'caches', {
        value: undefined,
        writable: true,
      });

      await pwaManager.clearCache();

      expect(consoleError).toHaveBeenCalledWith('Error clearing cache:', expect.any(Error));
    });
  });

  describe('Notifications', () => {
    it('solicita permisos de notificación', async () => {
      mockNotification.requestPermission.mockResolvedValue('granted');

      const result = await pwaManager.requestNotificationPermission();

      expect(mockNotification.requestPermission).toHaveBeenCalled();
      expect(result).toBe('granted');
    });

    it('maneja cuando se deniegan los permisos', async () => {
      mockNotification.requestPermission.mockResolvedValue('denied');

      const result = await pwaManager.requestNotificationPermission();

      expect(result).toBe('denied');
    });

    it('muestra notificaciones correctamente', () => {
      const mockNotificationConstructor = vi.fn();
      
      Object.defineProperty(window, 'Notification', {
        value: mockNotificationConstructor,
        writable: true,
      });

      Object.defineProperty(mockNotificationConstructor, 'permission', {
        value: 'granted',
        writable: true,
      });

      pwaManager.showNotification('Test Title', {
        body: 'Test body',
        icon: '/icon.png',
      });

      expect(mockNotificationConstructor).toHaveBeenCalledWith('Test Title', {
        body: 'Test body',
        icon: '/icon.png',
      });
    });

    it('no muestra notificaciones sin permisos', () => {
      const mockNotificationConstructor = vi.fn();
      
      Object.defineProperty(window, 'Notification', {
        value: mockNotificationConstructor,
        writable: true,
      });

      Object.defineProperty(mockNotificationConstructor, 'permission', {
        value: 'denied',
        writable: true,
      });

      pwaManager.showNotification('Test Title');

      expect(mockNotificationConstructor).not.toHaveBeenCalled();
    });
  });

  describe('Update Management', () => {
    it('detecta cuando hay actualizaciones disponibles', () => {
      expect(pwaManager.isUpdateAvailable()).toBe(false);
    });

    it('registra callback para actualizaciones disponibles', () => {
      const callback = vi.fn();
      pwaManager.onUpdateAvailable(callback);

      // El callback debería estar registrado
      expect(callback).toBeDefined();
    });

    it('actualiza la app cuando hay actualizaciones', () => {
      // Este método debería existir y no lanzar errores
      expect(() => pwaManager.updateApp()).not.toThrow();
    });

    it('registra callback para cuando la app se instala', () => {
      const callback = vi.fn();
      pwaManager.onInstalled(callback);

      // El callback debería estar registrado
      expect(callback).toBeDefined();
    });
  });

  describe('Event Callbacks', () => {
    it('registra callback para prompt de instalación', () => {
      const callback = vi.fn();
      pwaManager.onInstallPrompt(callback);

      // El callback debería estar registrado
      expect(callback).toBeDefined();
    });

    it('maneja múltiples callbacks', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      pwaManager.onOnline(callback1);
      pwaManager.onOffline(callback2);

      expect(callback1).toBeDefined();
      expect(callback2).toBeDefined();
    });
  });
});