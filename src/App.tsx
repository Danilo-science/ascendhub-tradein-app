import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import { lazy, Suspense } from "react";

// Lazy loading de componentes
const Index = lazy(() => import("./pages/Index"));
const Apple = lazy(() => import("./pages/Apple"));
const Electronics = lazy(() => import("./pages/Electronics"));
const Cart = lazy(() => import("./pages/Cart"));
const TestCart = lazy(() => import("./pages/TestCart"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const TradeIn = lazy(() => import("./pages/TradeIn"));
const Admin = lazy(() => import("./pages/Admin"));
const Auth = lazy(() => import("./pages/Auth"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Componente de loading
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
  </div>
);

const queryClient = new QueryClient();

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
              <Route path="/" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Index />
                </Suspense>
              } />
              <Route path="/apple" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Apple />
                </Suspense>
              } />
              <Route path="/electronics" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Electronics />
                </Suspense>
              } />
              <Route path="/electronica" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Electronics />
                </Suspense>
              } />
              <Route path="/buscar" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <SearchResults />
                </Suspense>
              } />
              <Route path="/producto/:slug" element={<div className="pt-16 p-8 text-center"><h1 className="text-2xl font-bold">Producto - En construcción</h1></div>} />
              <Route path="/product/:id" element={<div className="pt-16 p-8 text-center"><h1 className="text-2xl font-bold">Producto - En construcción</h1></div>} />
              <Route path="/carrito" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Cart />
                </Suspense>
              } />
              <Route path="/cart" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Cart />
                </Suspense>
              } />
              <Route path="/test-cart" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TestCart />
                </Suspense>
              } />
              <Route path="/checkout" element={<div className="pt-16 p-8 text-center"><h1 className="text-2xl font-bold">Checkout - En construcción</h1></div>} />
              <Route path="/dashboard" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Dashboard />
                </Suspense>
              } />
              <Route path="/trade-in" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TradeIn />
                </Suspense>
              } />
              <Route path="/parte-de-pago" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <TradeIn />
                </Suspense>
              } />
              <Route path="/admin" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Admin />
                </Suspense>
              } />
              <Route path="/auth" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Auth />
                </Suspense>
              } />
              <Route path="*" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
