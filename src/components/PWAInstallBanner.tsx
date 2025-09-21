import React, { useState, useEffect } from 'react';
import { X, Download, Smartphone, Zap, Wifi } from 'lucide-react';
import { usePWA, PWAInstallPrompt } from '../lib/pwa';

interface PWAInstallBannerProps {
  className?: string;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ className = '' }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<PWAInstallPrompt | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);
  const pwa = usePWA();

  useEffect(() => {
    // Verificar si ya está instalado o si es PWA
    if (pwa.isPWA()) {
      return;
    }

    // Verificar si ya se mostró el banner
    const bannerDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (bannerDismissed) {
      return;
    }

    // Escuchar evento de instalación
    pwa.onInstallPrompt((prompt) => {
      setInstallPrompt(prompt);
      setShowBanner(true);
    });

    // Ocultar banner cuando se instale
    pwa.onInstalled(() => {
      setShowBanner(false);
      localStorage.setItem('pwa-banner-dismissed', 'true');
    });
  }, [pwa]);

  const handleInstall = async () => {
    if (!installPrompt) return;

    setIsInstalling(true);
    try {
      const installed = await pwa.installApp();
      if (installed) {
        setShowBanner(false);
        localStorage.setItem('pwa-banner-dismissed', 'true');
      }
    } catch (error) {
      console.error('Error instalando PWA:', error);
    } finally {
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  if (!showBanner || !installPrompt) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg p-4 mx-auto max-w-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 flex-shrink-0" />
            <h3 className="font-semibold text-sm">Instalar AscendHub</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-white/90 mb-4">
          Instala nuestra app para una experiencia más rápida y acceso offline.
        </p>

        <div className="flex items-center space-x-4 mb-4 text-xs">
          <div className="flex items-center space-x-1">
            <Zap className="w-3 h-3" />
            <span>Más rápida</span>
          </div>
          <div className="flex items-center space-x-1">
            <Wifi className="w-3 h-3" />
            <span>Funciona offline</span>
          </div>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className="flex-1 bg-white text-blue-600 font-medium py-2 px-4 rounded-md text-sm hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isInstalling ? (
              <>
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <span>Instalando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Instalar</span>
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-white/80 hover:text-white transition-colors"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;