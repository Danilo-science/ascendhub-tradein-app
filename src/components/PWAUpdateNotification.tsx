import React, { useState, useEffect } from 'react';
import { RefreshCw, X, Download } from 'lucide-react';
import { usePWA, PWAUpdateAvailable } from '../lib/pwa';

interface PWAUpdateNotificationProps {
  className?: string;
}

export const PWAUpdateNotification: React.FC<PWAUpdateNotificationProps> = ({ className = '' }) => {
  const [showNotification, setShowNotification] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState<PWAUpdateAvailable | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const pwa = usePWA();

  useEffect(() => {
    // Escuchar actualizaciones disponibles
    pwa.onUpdateAvailable((update) => {
      setUpdateAvailable(update);
      setShowNotification(true);
    });
  }, [pwa]);

  const handleUpdate = async () => {
    if (!updateAvailable) return;

    setIsUpdating(true);
    try {
      updateAvailable.skipWaiting();
      // La página se recargará automáticamente
    } catch (error) {
      console.error('Error actualizando PWA:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowNotification(false);
  };

  if (!showNotification || !updateAvailable) {
    return null;
  }

  return (
    <div className={`fixed top-4 left-4 right-4 z-50 ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mx-auto max-w-md">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                Actualización disponible
              </h3>
              <p className="text-xs text-gray-600">
                Nueva versión de AscendHub
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Hay una nueva versión disponible con mejoras y correcciones. 
          ¿Quieres actualizar ahora?
        </p>

        <div className="flex space-x-2">
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 bg-blue-600 text-white font-medium py-2 px-4 rounded-md text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Actualizando...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Actualizar</span>
              </>
            )}
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Después
          </button>
        </div>

        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Versión actual instalada</span>
            <span className="font-mono">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotification;