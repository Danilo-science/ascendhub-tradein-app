import React, { Suspense, useEffect, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { CartProvider } from '@/contexts/CartContext';
import { PWAUpdateNotification } from '@/components/PWAUpdateNotification';
import { PWAInstallBanner } from '@/components/PWAInstallBanner';
import { TaskGuardian } from '@/lib/guardians/TaskGuardian';
import { logger } from '@/lib/logger';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy loading de componentes con preload hints
const Index = lazy(() => 
  import("./pages/Index").then(module => ({ default: module.default }))
);
const Apple = lazy(() => 
  import("./pages/Apple").then(module => ({ default: module.default }))
);
const TradeIn = lazy(() => 
  import("./pages/TradeIn").then(module => ({ default: module.default }))
);
const Cart = lazy(() => 
  import("./pages/Cart").then(module => ({ default: module.default }))
);
const Profile = lazy(() => 
  import("./pages/Profile").then(module => ({ default: module.default }))
);
const Auth = lazy(() => 
  import("./pages/Auth").then(module => ({ default: module.default }))
);
const NotFound = lazy(() => 
  import("./pages/NotFound").then(module => ({ default: module.default }))
);

// Preload crítico de componentes
const preloadCriticalComponents = () => {
  // Preload componentes que probablemente se usarán
  setTimeout(() => {
    import("./pages/Apple");
    import("./pages/TradeIn");
  }, 2000);
};

// Componente de loading optimizado
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
    <p className="text-muted-foreground">Cargando...</p>
  </div>
);



function App() {
  // Initialize TaskGuardian for development monitoring
  useEffect(() => {
    const guardian = new TaskGuardian();
    guardian.initializeAscendHubTasks().then((taskIds) => {
      logger.info('TaskGuardian initialized with tasks:', taskIds);
    }).catch((error) => {
      logger.error('Failed to initialize TaskGuardian:', error);
    });
    
    // Precargar componentes críticos después de la carga inicial
    preloadCriticalComponents();
    
    logger.info('Aplicación inicializada con lazy loading optimizado');
  }, []);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Index />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/apple" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Apple />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/trade-in" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <TradeIn />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/cart" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Cart />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Profile />
                    </Suspense>
                  } 
                />
                <Route 
                  path="/auth" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <Auth />
                    </Suspense>
                  } 
                />
                <Route 
                  path="*" 
                  element={
                    <Suspense fallback={<LoadingSpinner />}>
                      <NotFound />
                    </Suspense>
                  } 
                />
              </Routes>
              
              {/* PWA Components */}
              <PWAUpdateNotification />
              <PWAInstallBanner />
              
              {/* Toast notifications */}
              <Toaster />
            </div>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
