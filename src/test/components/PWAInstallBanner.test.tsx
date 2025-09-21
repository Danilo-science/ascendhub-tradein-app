import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PWAInstallBanner from '../../components/PWAInstallBanner';

// Mock del hook usePWA
const mockUsePWA = {
  isPWA: vi.fn(() => false),
  installApp: vi.fn(),
  onInstallPrompt: vi.fn(),
  onInstalled: vi.fn(),
};

vi.mock('../../lib/pwa', () => ({
  usePWA: () => mockUsePWA,
}));

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

describe('PWAInstallBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('no se muestra si ya es PWA', () => {
    mockUsePWA.isPWA.mockReturnValue(true);
    
    render(<PWAInstallBanner />);
    
    expect(screen.queryByText('Instalar AscendHub')).not.toBeInTheDocument();
  });

  it('no se muestra si el banner fue descartado', () => {
    localStorageMock.getItem.mockReturnValue('true');
    
    render(<PWAInstallBanner />);
    
    expect(screen.queryByText('Instalar AscendHub')).not.toBeInTheDocument();
  });

  it('se muestra cuando hay prompt de instalación disponible', async () => {
    const mockPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    // Simular que se recibe el prompt
    mockUsePWA.onInstallPrompt.mockImplementation((callback) => {
      callback(mockPrompt);
    });

    render(<PWAInstallBanner />);

    await waitFor(() => {
      expect(screen.getByText('Instalar AscendHub')).toBeInTheDocument();
    });

    expect(screen.getByText('Instala nuestra app para una experiencia más rápida y acceso offline.')).toBeInTheDocument();
    expect(screen.getByText('Más rápida')).toBeInTheDocument();
    expect(screen.getByText('Funciona offline')).toBeInTheDocument();
  });

  it('maneja la instalación exitosa', async () => {
    const mockPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    mockUsePWA.installApp.mockResolvedValue(true);
    mockUsePWA.onInstallPrompt.mockImplementation((callback) => {
      callback(mockPrompt);
    });

    render(<PWAInstallBanner />);

    await waitFor(() => {
      expect(screen.getByText('Instalar AscendHub')).toBeInTheDocument();
    });

    const installButton = screen.getByRole('button', { name: /instalar/i });
    fireEvent.click(installButton);

    await waitFor(() => {
      expect(mockUsePWA.installApp).toHaveBeenCalled();
    });
  });

  it('maneja el descarte del banner', async () => {
    const mockPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'dismissed' }),
    };

    mockUsePWA.onInstallPrompt.mockImplementation((callback) => {
      callback(mockPrompt);
    });

    render(<PWAInstallBanner />);

    await waitFor(() => {
      expect(screen.getByText('Instalar AscendHub')).toBeInTheDocument();
    });

    const dismissButton = screen.getByRole('button', { name: /cerrar/i });
    fireEvent.click(dismissButton);

    expect(localStorageMock.setItem).toHaveBeenCalledWith('pwa-banner-dismissed', 'true');
  });

  it('oculta el banner cuando la app se instala', async () => {
    const mockPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    mockUsePWA.onInstallPrompt.mockImplementation((callback) => {
      callback(mockPrompt);
    });

    mockUsePWA.onInstalled.mockImplementation((callback) => {
      callback();
    });

    render(<PWAInstallBanner />);

    await waitFor(() => {
      expect(screen.getByText('Instalar AscendHub')).toBeInTheDocument();
    });

    // Simular instalación
    mockUsePWA.onInstalled.mock.calls[0][0]();

    expect(localStorageMock.setItem).toHaveBeenCalledWith('pwa-banner-dismissed', 'true');
  });

  it('muestra estado de carga durante instalación', async () => {
    const mockPrompt = {
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'accepted' }),
    };

    // Simular instalación lenta
    mockUsePWA.installApp.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve(true), 100))
    );

    mockUsePWA.onInstallPrompt.mockImplementation((callback) => {
      callback(mockPrompt);
    });

    render(<PWAInstallBanner />);

    await waitFor(() => {
      expect(screen.getByText('Instalar AscendHub')).toBeInTheDocument();
    });

    const installButton = screen.getByRole('button', { name: /instalar/i });
    fireEvent.click(installButton);

    // Verificar estado de carga
    expect(screen.getByText('Instalando...')).toBeInTheDocument();
    expect(installButton).toBeDisabled();

    await waitFor(() => {
      expect(mockUsePWA.installApp).toHaveBeenCalled();
    });
  });
});