import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense, memo } from "react";
import PWAInstallBanner from "./components/PWAInstallBanner";
import PWAUpdateNotification from "./components/PWAUpdateNotification";

// Lazy loading de componentes con preload hints
const Index = lazy(() => 
  import("./pages/Index").then(module => ({ default: module.default }))
);
const Apple = lazy(() => 
  import("./pages/Apple").then(module => ({ default: module.default }))
);
const Electronics = lazy(() => 
  import("./pages/Electronics").then(module => ({ default: module.default }))
);
const Cart = lazy(() => 
  import("./pages/Cart").then(module => ({ default: module.default }))
);
const TestCart = lazy(() => 
  import("./pages/TestCart").then(module => ({ default: module.default }))
);
const Dashboard = lazy(() => 
  import("./pages/Dashboard").then(module => ({ default: module.default }))
);
const TradeIn = lazy(() => 
  import("./pages/TradeIn").then(module => ({ default: module.default }))
);
const Admin = lazy(() => 
  import("./pages/Admin").then(module => ({ default: module.default }))
);
const Auth = lazy(() => 
  import("./pages/Auth").then(module => ({ default: module.default }))
);
const SearchResults = lazy(() => 
  import("./pages/SearchResults").then(module => ({ default: module.default }))
);
const NotFound = lazy(() => 
  import("./pages/NotFound").then(module => ({ default: module.default }))
);

// Componente de loading optimizado
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-600 mx-auto mb-4"></div>
      <p className="text-purple-600 font-medium">Cargando...</p>
    </div>
  </div>
));

LoadingSpinner.displayName = 'LoadingSpinner';

// QueryClient optimizado para producción
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
      retry: (failureCount, error) => {
        // No reintentar en errores 4xx
        if (error instanceof Error && error.message.includes('4')) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

// Componente de ruta optimizado
const OptimizedRoute = memo(({ 
  element, 
  fallback = <LoadingSpinner /> 
}: { 
  element: React.ReactElement; 
  fallback?: React.ReactElement;
}) => (
  <Suspense fallback={fallback}>
    {element}
  </Suspense>
));

OptimizedRoute.displayName = 'OptimizedRoute';

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Routes>
              <Route path="/" element={<OptimizedRoute element={<Index />} />} />
              <Route path="/apple" element={<OptimizedRoute element={<Apple />} />} />
              <Route path="/electronics" element={<OptimizedRoute element={<Electronics />} />} />
              <Route path="/electronica" element={<OptimizedRoute element={<Electronics />} />} />
              <Route path="/buscar" element={<OptimizedRoute element={<SearchResults />} />} />
              <Route path="/producto/:slug" element={
                <div className="pt-16 p-8 text-center">
                  <h1 className="text-2xl font-bold">Producto - En construcción</h1>
                </div>
              } />
              <Route path="/product/:id" element={
                <div className="pt-16 p-8 text-center">
                  <h1 className="text-2xl font-bold">Producto - En construcción</h1>
                </div>
              } />
              <Route path="/carrito" element={<OptimizedRoute element={<Cart />} />} />
              <Route path="/cart" element={<OptimizedRoute element={<Cart />} />} />
              <Route path="/test-cart" element={<OptimizedRoute element={<TestCart />} />} />
              <Route path="/checkout" element={
                <div className="pt-16 p-8 text-center">
                  <h1 className="text-2xl font-bold">Checkout - En construcción</h1>
                </div>
              } />
              <Route path="/dashboard" element={<OptimizedRoute element={<Dashboard />} />} />
              <Route path="/trade-in" element={<OptimizedRoute element={<TradeIn />} />} />
              <Route path="/parte-de-pago" element={<OptimizedRoute element={<TradeIn />} />} />
              <Route path="/admin" element={<OptimizedRoute element={<Admin />} />} />
              <Route path="/auth" element={<OptimizedRoute element={<Auth />} />} />
              <Route path="*" element={<OptimizedRoute element={<NotFound />} />} />
            </Routes>
            
            {/* PWA Components */}
            <PWAInstallBanner />
            <PWAUpdateNotification />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
