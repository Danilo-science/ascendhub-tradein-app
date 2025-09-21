import { useCart, useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Cart() {
  const { state } = useCart();
  const { updateQuantity, removeItem, removeTradeIn } = useCartActions();

  const subtotal = state.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const tradeInValue = state.tradeInDevice ? state.tradeInDevice.estimatedValue : 0;
  const total = subtotal - tradeInValue;

  if (state.items.length === 0 && !state.tradeInDevice) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-gray-500 mb-6">
                <svg className="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-8">Explora nuestros productos y encuentra algo increíble</p>
              <div className="space-y-4">
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/apple">Explorar Apple</Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/electronica">Explorar Electrónica</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" asChild className="mr-4">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Continuar Comprando
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Tu Carrito</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Products */}
            {state.items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Productos ({state.items.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-600">{item.product.category}</p>
                        <p className="text-lg font-bold text-brand-blue">${item.product.price.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, Math.max(0, item.quantity - 1))}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Trade-In Devices */}
            {state.tradeInDevice && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    Trade-In Device (1)
                    <Badge variant="secondary" className="ml-2">Crédito</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg bg-green-50">
                    <div className="w-16 h-16 bg-green-100 rounded-md flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{state.tradeInDevice.marca} {state.tradeInDevice.modelo}</h3>
                      <p className="text-sm text-gray-600">Condición: {state.tradeInDevice.estadoGeneral}</p>
                      <p className="text-lg font-bold text-green-600">-${state.tradeInDevice.estimatedValue.toLocaleString()}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTradeIn()}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                
                {tradeInValue > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Crédito Trade-In</span>
                    <span>-${tradeInValue.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Envío</span>
                  <span>Gratis</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${Math.max(0, total).toLocaleString()}</span>
                </div>

                {total < 0 && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      ¡Tu trade-in cubre el costo completo! Recibirás un crédito de ${Math.abs(total).toLocaleString()}.
                    </p>
                  </div>
                )}

                <div className="space-y-3 pt-4">
                  <Button asChild className="w-full">
                    <Link to="/checkout">Proceder al Checkout</Link>
                  </Button>
                  
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/parte-de-pago">Agregar Trade-In</Link>
                  </Button>
                </div>

                <div className="text-xs text-gray-500 pt-4">
                  <p>• Envío gratis en todos los pedidos</p>
                  <p>• Garantía de 30 días</p>
                  <p>• Soporte técnico incluido</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}