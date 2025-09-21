import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Apple from "./pages/Apple";
import Electronics from "./pages/Electronics";
import Cart from "./pages/Cart";
import TradeIn from "./pages/TradeIn";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

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
              <Route path="/" element={<Index />} />
              <Route path="/apple" element={<Apple />} />
              <Route path="/electronics" element={<Electronics />} />
              <Route path="/producto/:slug" element={<div className="pt-16 p-8 text-center"><h1 className="text-2xl font-bold">Producto - En construcción</h1></div>} />
              <Route path="/product/:id" element={<div className="pt-16 p-8 text-center"><h1 className="text-2xl font-bold">Producto - En construcción</h1></div>} />
              <Route path="/carrito" element={<Cart />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<div className="pt-16 p-8 text-center"><h1 className="text-2xl font-bold">Checkout - En construcción</h1></div>} />
              <Route path="/trade-in" element={<TradeIn />} />
              <Route path="/parte-de-pago" element={<TradeIn />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/auth" element={<Auth />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
