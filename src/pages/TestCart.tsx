import { useEffect } from 'react';
import { useCart, useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ShoppingCart, 
  Heart, 
  Bell, 
  Gift, 
  Percent,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFeaturedProducts } from '@/lib/products';

export default function TestCart() {
  const { state } = useCart();
  const { 
    addToCart, 
    addToWishlist, 
    addToComparison,
    addDiscount,
    addNotification,
    clearCart,
    clearComparison,
    clearNotifications,
    removeFromWishlist
  } = useCartActions();

  const featuredProducts = getFeaturedProducts();

  // Función para agregar productos de prueba
  const addTestProducts = () => {
    // Agregar algunos productos al carrito
    featuredProducts.slice(0, 3).forEach(product => {
      addToCart(product, Math.floor(Math.random() * 3) + 1);
    });
  };

  // Función para agregar productos a wishlist
  const addTestWishlist = () => {
    featuredProducts.slice(3, 6).forEach(product => {
      const cartProduct = {
        id: product.id,
        name: product.title,
        brand: product.brand || '',
        model: product.model || '',
        price: product.price,
        originalPrice: product.original_price,
        image: product.images?.[0] || '',
        category: (product.brand?.toLowerCase() === 'apple' ? 'apple' : 'electronica') as 'apple' | 'electronica',
        specifications: Object.fromEntries(
          Object.entries(product.specs || {}).map(([key, value]) => [key, String(value)])
        ),
        inStock: product.stock_quantity > 0
      };
      addToWishlist(cartProduct);
    });
  };

  // Función para agregar productos a comparación
  const addTestComparison = () => {
    featuredProducts.slice(6, 9).forEach(product => {
      const cartProduct = {
        id: product.id,
        name: product.title,
        brand: product.brand || '',
        model: product.model || '',
        price: product.price,
        originalPrice: product.original_price,
        image: product.images?.[0] || '',
        category: (product.brand?.toLowerCase() === 'apple' ? 'apple' : 'electronica') as 'apple' | 'electronica',
        specifications: Object.fromEntries(
          Object.entries(product.specs || {}).map(([key, value]) => [key, String(value)])
        ),
        inStock: product.stock_quantity > 0
      };
      addToComparison(cartProduct);
    });
  };

  // Función para agregar descuentos de prueba
  const addTestDiscounts = () => {
    addDiscount({
      id: 'test-percentage',
      code: 'TEST10',
      type: 'percentage',
      value: 10,
      description: 'Descuento de prueba 10%'
    });
    
    addDiscount({
      id: 'test-fixed',
      code: 'SAVE20K',
      type: 'fixed',
      value: 20000,
      description: 'Descuento fijo $20.000'
    });
  };

  // Función para agregar notificaciones de prueba
  const addTestNotifications = () => {
    addNotification({
      type: 'success',
      message: '¡Producto agregado al carrito exitosamente!',
      autoHide: true,
      duration: 3000
    });

    addNotification({
      type: 'info',
      message: 'Tienes productos en tu wishlist esperando',
      autoHide: true,
      duration: 4000
    });

    addNotification({
      type: 'warning',
      message: 'Stock limitado para algunos productos',
      autoHide: true,
      duration: 5000
    });

    addNotification({
      type: 'error',
      message: 'Error al procesar el pago, intenta nuevamente',
      autoHide: false
    });
  };

  // Función para limpiar wishlist
  const clearWishlist = () => {
    state.wishlist.forEach(item => {
      removeFromWishlist(item.product.id);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Prueba de Funcionalidades del Carrito
          </h1>
          <p className="text-gray-600">
            Esta página permite probar todas las funcionalidades avanzadas del sistema de carrito.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Panel de Controles de Prueba */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Controles de Prueba
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={addTestProducts} className="w-full">
                    Agregar Productos
                  </Button>
                  <Button onClick={addTestWishlist} variant="outline" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Agregar Wishlist
                  </Button>
                  <Button onClick={addTestComparison} variant="outline" className="w-full">
                    Agregar Comparación
                  </Button>
                  <Button onClick={addTestDiscounts} variant="outline" className="w-full">
                    <Percent className="h-4 w-4 mr-2" />
                    Agregar Descuentos
                  </Button>
                  <Button onClick={addTestNotifications} variant="outline" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Agregar Notificaciones
                  </Button>
                  <Button asChild className="w-full">
                    <Link to="/cart">
                      Ver Carrito Completo
                    </Link>
                  </Button>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3">
                  <Button onClick={clearCart} variant="destructive" size="sm">
                    Limpiar Carrito
                  </Button>
                  <Button onClick={clearWishlist} variant="destructive" size="sm">
                    Limpiar Wishlist
                  </Button>
                  <Button onClick={clearComparison} variant="destructive" size="sm">
                    Limpiar Comparación
                  </Button>
                  <Button onClick={clearNotifications} variant="destructive" size="sm">
                    Limpiar Notificaciones
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estado Actual del Sistema */}
            <Card>
              <CardHeader>
                <CardTitle>Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Productos en Carrito:</span>
                  <Badge variant="secondary">{state.items.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Wishlist:</span>
                  <Badge variant="secondary">{state.wishlist.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Comparación:</span>
                  <Badge variant="secondary">{state.comparison.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Descuentos Activos:</span>
                  <Badge variant="secondary">{state.discounts.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Notificaciones:</span>
                  <Badge variant="secondary">{state.notifications.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total:</span>
                  <Badge variant="default">${state.total.toLocaleString()}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel de Información Detallada */}
          <div className="space-y-6">
            {/* Carrito */}
            {state.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Carrito ({state.items.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {state.items.slice(0, 3).map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.product.name}</p>
                            <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold">${(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    {state.items.length > 3 && (
                      <p className="text-sm text-gray-500 text-center">
                        +{state.items.length - 3} productos más...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Wishlist */}
            {state.wishlist.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    Wishlist ({state.wishlist.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {state.wishlist.slice(0, 3).map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center space-x-2">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-8 h-8 object-cover rounded"
                          />
                          <span className="text-sm font-medium">{item.product.name}</span>
                        </div>
                        <span className="text-sm">${item.product.price.toLocaleString()}</span>
                      </div>
                    ))}
                    {state.wishlist.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{state.wishlist.length - 3} productos más...
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Descuentos */}
            {state.discounts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-green-500" />
                    Descuentos Activos ({state.discounts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {state.discounts.map((discount) => (
                      <div key={discount.id} className="flex items-center justify-between p-2 bg-green-50 border border-green-200 rounded">
                        <div>
                          <p className="text-sm font-medium text-green-800">{discount.code}</p>
                          <p className="text-xs text-green-600">{discount.description}</p>
                        </div>
                        <span className="text-sm font-bold text-green-700">
                          {discount.type === 'percentage' ? `${discount.value}%` : `$${discount.value.toLocaleString()}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notificaciones */}
            {state.notifications.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-blue-500" />
                    Notificaciones ({state.notifications.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {state.notifications.map((notification) => (
                      <div key={notification.id} className={`flex items-start space-x-2 p-2 border rounded ${
                        notification.type === 'success' ? 'bg-green-50 border-green-200' :
                        notification.type === 'error' ? 'bg-red-50 border-red-200' :
                        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="mt-0.5">
                          {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                          {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                          {notification.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                          {notification.type === 'info' && <Info className="h-4 w-4 text-blue-600" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notification.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Navegación */}
        <div className="mt-8 flex justify-center space-x-4">
          <Button asChild variant="outline">
            <Link to="/">Volver al Inicio</Link>
          </Button>
          <Button asChild>
            <Link to="/cart">Ir al Carrito Completo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}