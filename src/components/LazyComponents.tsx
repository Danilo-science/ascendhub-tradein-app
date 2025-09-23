import React, { lazy, Suspense, ComponentType } from 'react';
import { Loader2 } from 'lucide-react';
import { logger } from '@/lib/logger';

// ============================================================================
// COMPONENTE DE LOADING PERSONALIZABLE
// ============================================================================

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingSpinner = ({ 
  message = 'Cargando...', 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]} text-primary mb-2`} />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};

// ============================================================================
// WRAPPER PARA LAZY LOADING CON ERROR BOUNDARY
// ============================================================================

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<LoadingSpinnerProps>;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  loadingMessage?: string;
  componentName?: string;
}

const DefaultErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="flex flex-col items-center justify-center p-8 text-center">
    <div className="text-red-500 mb-4">
      <svg className="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    </div>
    <h3 className="text-lg font-semibold mb-2">Error al cargar el componente</h3>
    <p className="text-sm text-muted-foreground mb-4">
      {error.message || 'Ha ocurrido un error inesperado'}
    </p>
    <button 
      onClick={retry}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
    >
      Reintentar
    </button>
  </div>
);

class LazyErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    fallback: React.ComponentType<{ error: Error; retry: () => void }>;
    componentName?: string;
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error('Error en lazy loading', error, `lazy-${this.props.componentName || 'unknown'}`);
    console.error('Lazy loading error:', error, errorInfo);
  }

  retry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;
      return <FallbackComponent error={this.state.error} retry={this.retry} />;
    }

    return this.props.children;
  }
}

export const LazyWrapper = ({ 
  children, 
  fallback: FallbackComponent = LoadingSpinner,
  errorFallback: ErrorFallbackComponent = DefaultErrorFallback,
  loadingMessage = 'Cargando componente...',
  componentName
}: LazyWrapperProps) => (
  <LazyErrorBoundary fallback={ErrorFallbackComponent} componentName={componentName}>
    <Suspense fallback={<FallbackComponent message={loadingMessage} />}>
      {children}
    </Suspense>
  </LazyErrorBoundary>
);

// ============================================================================
// PÁGINAS LAZY LOADED
// ============================================================================

export const LazyIndex = lazy(() => 
  import('@/pages/Index').then(module => {
    logger.debug('Página Index cargada');
    return module;
  }).catch(error => {
    logger.error('Error cargando página Index', error, 'lazy-index');
    throw error;
  })
);

export const LazyApple = lazy(() => 
  import('@/pages/Apple').then(module => {
    logger.debug('Página Apple cargada');
    return module;
  }).catch(error => {
    logger.error('Error cargando página Apple', error, 'lazy-apple');
    throw error;
  })
);

export const LazyTradeIn = lazy(() => 
  import('@/pages/TradeIn').then(module => {
    logger.debug('Página TradeIn cargada');
    return module;
  }).catch(error => {
    logger.error('Error cargando página TradeIn', error, 'lazy-tradein');
    throw error;
  })
);

export const LazyCart = lazy(() => 
  import('@/pages/Cart').then(module => {
    logger.debug('Página Cart cargada');
    return module;
  }).catch(error => {
    logger.error('Error cargando página Cart', error, 'lazy-cart');
    throw error;
  })
);

export const LazyProfile = lazy(() => 
  import('@/pages/Profile').then(module => {
    logger.debug('Página Profile cargada');
    return module;
  }).catch(error => {
    logger.error('Error cargando página Profile', error, 'lazy-profile');
    throw error;
  })
);

export const LazyNotFound = lazy(() => 
  import('@/pages/NotFound').then(module => {
    logger.debug('Página NotFound cargada');
    return module;
  }).catch(error => {
    logger.error('Error cargando página NotFound', error, 'lazy-notfound');
    throw error;
  })
);

// ============================================================================
// COMPONENTES LAZY LOADED
// ============================================================================

export const LazyAuthForm = lazy(() => 
  import('@/components/auth/AuthForm').then(module => {
    logger.debug('Componente AuthForm cargado');
    return module;
  }).catch(error => {
    logger.error('Error cargando AuthForm', error, 'lazy-authform');
    throw error;
  })
);

export const LazyGoogleAuthButton = lazy(() => 
  import('@/components/auth/GoogleAuthButton').then(module => {
    logger.debug('Componente GoogleAuthButton cargado');
    return module;
  }).catch(error => {
    logger.error('Error cargando GoogleAuthButton', error, 'lazy-googleauth');
    throw error;
  })
);

export const LazyProductCard = lazy(() => 
  import('@/components/ProductCard').then(module => {
    logger.debug('Componente ProductCard cargado');
    return { default: module.ProductCard };
  }).catch(error => {
    logger.error('Error cargando ProductCard', error, 'lazy-productcard');
    throw error;
  })
);

export const LazyCartSidebar = lazy(() => 
  import('@/components/organisms/CartSidebar').then(module => {
    logger.debug('Componente CartSidebar cargado');
    return { default: module.CartSidebar };
  }).catch(error => {
    logger.error('Error cargando CartSidebar', error, 'lazy-cartsidebar');
    throw error;
  })
);

export const LazyImageWithFallback = lazy(() => 
  import('@/components/figma/ImageWithFallback').then(module => {
    logger.debug('Componente ImageWithFallback cargado');
    return { default: module.ImageWithFallback };
  }).catch(error => {
    logger.error('Error cargando ImageWithFallback', error, 'lazy-imagefallback');
    throw error;
  })
);

// ============================================================================
// ORGANISMOS LAZY LOADED
// ============================================================================

export const LazyFooter = lazy(() => 
  import('@/components/organisms/Footer').then(module => {
    logger.debug('Componente Footer cargado');
    return { default: module.Footer };
  }).catch(error => {
    logger.error('Error cargando Footer', error, 'lazy-footer');
    throw error;
  })
);

export const LazyNavigation = lazy(() => 
  import('@/components/Navigation').then(module => {
    logger.debug('Componente Navigation cargado');
    return module;
  }).catch(error => {
    logger.error('Error cargando Navigation', error, 'lazy-navigation');
    throw error;
  })
);

// ============================================================================
// UTILIDADES PARA PRELOADING
// ============================================================================

export const preloadComponent = (importFn: () => Promise<any>, componentName: string) => {
  return importFn().then(() => {
    logger.debug(`Componente ${componentName} precargado`);
  }).catch(error => {
    logger.error(`Error precargando ${componentName}`, error, `preload-${componentName}`);
  });
};

// Precargar componentes críticos
export const preloadCriticalComponents = () => {
  // Precargar componentes que probablemente se usarán pronto
  setTimeout(() => {
    preloadComponent(() => import('@/components/auth/AuthForm'), 'AuthForm');
    preloadComponent(() => import('@/components/ProductCard'), 'ProductCard');
  }, 2000);
};

// ============================================================================
// HOOK PARA LAZY LOADING CONDICIONAL
// ============================================================================

export const useLazyLoad = (condition: boolean, importFn: () => Promise<any>) => {
  const [Component, setComponent] = React.useState<ComponentType | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (condition && !Component && !loading) {
      setLoading(true);
      setError(null);
      
      importFn()
        .then((module) => {
          setComponent(() => module.default || module);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
          logger.error('Error en lazy loading condicional', err, 'conditional-lazy');
        });
    }
  }, [condition, Component, loading, importFn]);

  return { Component, loading, error };
};