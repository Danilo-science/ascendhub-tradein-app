import React from 'react';
import { X, Plus, Minus, ShoppingBag, Trash2, ArrowRight, Gift } from 'lucide-react';
import { useCart, useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, onClose }) => {
  const { state } = useCart();
  const { removeItem, updateQuantity, clearCart } = useCartActions();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    // Navegar al checkout
    window.location.href = '/cart';
    onClose();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscountTotal = () => {
    return state.discounts.reduce((total, discount) => {
      if (discount.type === 'percentage') {
        return total + (state.subtotal * discount.value / 100);
      }
      return total + discount.value;
    }, 0);
  };

  const discountTotal = calculateDiscountTotal();
  const finalTotal = Math.max(0, state.subtotal - discountTotal - state.tradeInCredit + state.shipping.cost);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-sm sm:max-w-md bg-white shadow-xl z-50 transform transition-transform duration-300 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            <h2 className="text-lg font-semibold">
              Carrito ({state.items.length})
            </h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {state.items.length === 0 ? (
            // Carrito vacío
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tu carrito está vacío
              </h3>
              <p className="text-gray-600 mb-6">
                Agrega algunos productos para comenzar tu compra
              </p>
              <Button onClick={onClose} className="w-full">
                Continuar comprando
              </Button>
            </div>
          ) : (
            <>
              {/* Items del carrito */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {state.items.map((item) => (
                    <div key={item.product.id} className="flex gap-2 sm:gap-3 p-2 sm:p-3 border rounded-lg">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-xs sm:text-sm text-gray-900 truncate">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-600 mb-1 sm:mb-2">
                          {item.product.brand} • {item.product.model}
                        </p>
                        
                        {/* Especificaciones seleccionadas */}
                        {item.selectedSpecs && Object.keys(item.selectedSpecs).length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-1 sm:mb-2">
                            {Object.entries(item.selectedSpecs).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-xs">
                                {value}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-5 h-5 sm:w-6 sm:h-6 p-0"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                            >
                              <Minus className="w-2 h-2 sm:w-3 sm:h-3" />
                            </Button>
                            <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-5 h-5 sm:w-6 sm:h-6 p-0"
                              onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                            >
                              <Plus className="w-2 h-2 sm:w-3 sm:h-3" />
                            </Button>
                          </div>
                          
                          <div className="text-left sm:text-right">
                            <p className="text-xs sm:text-sm font-semibold">
                              {formatPrice(item.product.price * item.quantity)}
                            </p>
                            {item.product.originalPrice && (
                              <p className="text-xs text-gray-500 line-through">
                                {formatPrice(item.product.originalPrice * item.quantity)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-6 h-6 sm:w-8 sm:h-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                        onClick={() => removeItem(item.product.id)}
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Trade-in device */}
              {state.tradeInDevice && (
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">
                      Dispositivo de intercambio
                    </span>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium">
                      {state.tradeInDevice.marca} {state.tradeInDevice.modelo}
                    </p>
                    <p className="text-sm text-green-600">
                      Crédito: {formatPrice(state.tradeInDevice.estimatedValue)}
                    </p>
                  </div>
                </div>
              )}

              {/* Resumen de totales */}
              <div className="p-4 border-t bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatPrice(state.subtotal)}</span>
                  </div>

                  {/* Descuentos */}
                  {state.discounts.length > 0 && (
                    <>
                      {state.discounts.map((discount) => (
                        <div key={discount.id} className="flex justify-between text-sm text-green-600">
                          <span>{discount.description}</span>
                          <span>
                            -{discount.type === 'percentage' 
                              ? `${discount.value}%` 
                              : formatPrice(discount.value)
                            }
                          </span>
                        </div>
                      ))}
                    </>
                  )}

                  {/* Crédito trade-in */}
                  {state.tradeInCredit > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Crédito trade-in</span>
                      <span>-{formatPrice(state.tradeInCredit)}</span>
                    </div>
                  )}

                  {/* Envío */}
                  <div className="flex justify-between text-sm">
                    <span>
                      Envío
                      {state.shipping.method && ` (${state.shipping.method})`}
                    </span>
                    <span>
                      {state.shipping.cost === 0 ? 'Gratis' : formatPrice(state.shipping.cost)}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>

                  {state.shipping.estimatedDays && (
                    <p className="text-xs text-gray-600 text-center">
                      Entrega estimada: {state.shipping.estimatedDays} días hábiles
                    </p>
                  )}
                </div>

                {/* Botones de acción */}
                <div className="space-y-2 mt-4">
                  <Button
                    onClick={handleCheckout}
                    className="w-full"
                    size="lg"
                  >
                    Proceder al checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={onClose}
                      className="flex-1"
                    >
                      Continuar comprando
                    </Button>
                    <Button
                      variant="outline"
                      onClick={clearCart}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};