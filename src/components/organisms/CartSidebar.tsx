import { useCart, useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, X, Smartphone, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CartSidebar() {
  const { state } = useCart();
  const { updateQuantity, removeItem, removeTradeIn, toggleCart } = useCartActions();

  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Sheet open={state.isOpen} onOpenChange={toggleCart}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="h-4 w-4" />
          {itemCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Tu Carrito ({itemCount} {itemCount === 1 ? 'producto' : 'productos'})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto py-4">
            {state.items.length === 0 && !state.tradeInDevice ? (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
                <Button asChild onClick={toggleCart}>
                  <Link to="/">Explorar Productos</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Trade-In Device */}
                {state.tradeInDevice && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="bg-green-100 rounded-lg p-2">
                          <Smartphone className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-green-900">
                            Trade-In: {state.tradeInDevice.marca} {state.tradeInDevice.modelo}
                          </h4>
                          <p className="text-sm text-green-700">
                            Estado: {state.tradeInDevice.estadoGeneral}
                          </p>
                          <p className="text-sm font-medium text-green-800 mt-1">
                            Crédito estimado: {formatPrice(state.tradeInDevice.estimatedValue)}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeTradeIn}
                        className="text-green-600 hover:text-green-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Cart Items */}
                {state.items.map((item) => (
                  <div key={`${item.product.id}-${JSON.stringify(item.selectedSpecs)}`} className="flex gap-3 p-3 border rounded-lg">
                    <img
                      src={item.product.images[0] || '/placeholder.svg'}
                      alt={item.product.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.product.title}</h4>
                      <p className="text-xs text-gray-500">{item.product.brand} {item.product.model}</p>
                      
                      {/* Selected Specifications */}
                      {item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {Object.entries(item.selectedSpecs).map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {value}
                            </Badge>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                          {item.product.original_price && (
                            <p className="text-xs text-gray-500 line-through">
                              {formatPrice(item.product.original_price * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.product.id)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {(state.items.length > 0 || state.tradeInDevice) && (
            <div className="border-t pt-4 space-y-3">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>{formatPrice(state.subtotal)}</span>
                </div>
                
                {state.tradeInCredit > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Crédito Trade-In</span>
                    <span>-{formatPrice(state.tradeInCredit)}</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>{formatPrice(state.total)}</span>
                </div>

                {state.total === 0 && state.tradeInCredit > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <p className="text-sm text-green-800 text-center">
                      🎉 ¡Tu Trade-In cubre el costo total!
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Button asChild className="w-full" disabled={state.items.length === 0}>
                  <Link to="/checkout" onClick={toggleCart}>
                    Proceder al Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                
                {!state.tradeInDevice && (
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/parte-de-pago" onClick={toggleCart}>
                      Agregar Trade-In
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}