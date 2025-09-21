import { useCart, useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Heart, 
  ShoppingCart, 
  Truck, 
  Shield, 
  CreditCard, 
  MapPin, 
  Clock,
  Gift,
  Tag,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Cart() {
  const { state } = useCart();
  const { 
    updateQuantity, 
    removeItem, 
    removeTradeIn, 
    clearCart,
    addDiscount,
    removeDiscount,
    setShipping,
    saveForLater,
    moveFromSaved,
    moveToWishlist,
    removeNotification,
    updatePreferences
  } = useCartActions();

  // Estados para el checkout
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart');
  const [couponCode, setCouponCode] = useState('');
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Argentina'
  });
  const [paymentInfo, setPaymentInfo] = useState({
    method: 'credit_card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [orderNotes, setOrderNotes] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showSavedItems, setShowSavedItems] = useState(false);

  // Calcular totales usando el estado del carrito
  const subtotal = state.subtotal;
  const tradeInValue = state.tradeInCredit;
  const shippingCost = state.shipping.cost;
  const discountAmount = state.discounts.reduce((sum, discount) => {
    if (discount.type === 'percentage') {
      return sum + (subtotal * discount.value / 100);
    }
    return sum + discount.value;
  }, 0);
  const total = state.total;

  // Filtrar items del carrito
  const activeItems = state.items.filter(item => !item.savedForLater);
  const savedItems = state.items.filter(item => item.savedForLater);

  // Aplicar cupón de descuento
  const applyCoupon = () => {
    if (!couponCode.trim()) return;

    // Simular validación de cupón
    const validCoupons = {
      'WELCOME10': { type: 'percentage' as const, value: 10, description: 'Descuento de bienvenida 10%' },
      'SAVE50': { type: 'fixed' as const, value: 50000, description: 'Descuento fijo $50.000' },
      'APPLE15': { type: 'percentage' as const, value: 15, description: 'Descuento Apple 15%' }
    };

    const coupon = validCoupons[couponCode.toUpperCase() as keyof typeof validCoupons];
    if (coupon) {
      addDiscount({
        id: `coupon-${Date.now()}`,
        code: couponCode.toUpperCase(),
        ...coupon
      });
      setCouponCode('');
    }
  };

  // Actualizar método de envío
  const updateShippingMethod = (method: string, cost: number, estimatedDays?: number) => {
    setShipping({
      method,
      cost,
      estimatedDays,
      address: state.shipping.address
    });
  };

  // Proceder al siguiente paso
  const proceedToNextStep = () => {
    switch (step) {
      case 'cart':
        setStep('shipping');
        break;
      case 'shipping':
        if (validateShippingInfo()) {
          setStep('payment');
        }
        break;
      case 'payment':
        if (validatePaymentInfo()) {
          setStep('review');
        }
        break;
      case 'review':
        // Procesar pedido
        processOrder();
        break;
    }
  };

  const validateShippingInfo = () => {
    return shippingInfo.firstName && shippingInfo.lastName && 
           shippingInfo.email && shippingInfo.address && 
           shippingInfo.city && shippingInfo.zipCode;
  };

  const validatePaymentInfo = () => {
    if (paymentInfo.method === 'credit_card') {
      return paymentInfo.cardNumber && paymentInfo.expiryDate && 
             paymentInfo.cvv && paymentInfo.cardName;
    }
    return true;
  };

  const processOrder = () => {
    // Aquí se procesaría el pedido
    console.log('Procesando pedido...', {
      items: activeItems,
      shipping: shippingInfo,
      payment: paymentInfo,
      total,
      notes: orderNotes
    });
  };

  if (activeItems.length === 0 && !state.tradeInDevice && savedItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Tu Carrito</h1>
            <div className="bg-white rounded-lg shadow-sm p-12">
              <div className="text-gray-500 mb-6">
                <ShoppingCart className="mx-auto h-24 w-24 text-gray-300" />
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header con navegación de pasos */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" asChild className="mr-4">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continuar Comprando
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              {step === 'cart' && 'Tu Carrito'}
              {step === 'shipping' && 'Información de Envío'}
              {step === 'payment' && 'Método de Pago'}
              {step === 'review' && 'Revisar Pedido'}
            </h1>
          </div>
          
          {activeItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {['cart', 'shipping', 'payment', 'review'].map((s, index) => (
                  <div
                    key={s}
                    className={`w-3 h-3 rounded-full ${
                      s === step ? 'bg-blue-600' : 
                      ['cart', 'shipping', 'payment', 'review'].indexOf(step) > index ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notificaciones */}
        {state.notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {state.notifications.map((notification) => (
              <Alert key={notification.id} className={`
                ${notification.type === 'success' ? 'border-green-200 bg-green-50' : ''}
                ${notification.type === 'error' ? 'border-red-200 bg-red-50' : ''}
                ${notification.type === 'warning' ? 'border-yellow-200 bg-yellow-50' : ''}
                ${notification.type === 'info' ? 'border-blue-200 bg-blue-50' : ''}
              `}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-600" />}
                    {notification.type === 'error' && <AlertCircle className="h-4 w-4 text-red-600" />}
                    {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-600" />}
                    {notification.type === 'info' && <AlertCircle className="h-4 w-4 text-blue-600" />}
                    <AlertDescription className="ml-2">{notification.message}</AlertDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeNotification(notification.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </Alert>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Vista del Carrito */}
            {step === 'cart' && (
              <>
                {/* Productos Activos */}
                {activeItems.length > 0 && (
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                      <CardTitle>Productos ({activeItems.length})</CardTitle>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={clearCart}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Vaciar Carrito
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {activeItems.map((item) => (
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
                            {item.addedAt && (
                              <p className="text-xs text-gray-500">
                                Agregado: {new Date(item.addedAt).toLocaleDateString()}
                              </p>
                            )}
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
                          <div className="flex flex-col space-y-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => saveForLater(item.product.id)}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveToWishlist(item.product.id)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <Heart className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.product.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}

                {/* Productos Guardados para Más Tarde */}
                {savedItems.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle 
                        className="flex items-center cursor-pointer"
                        onClick={() => setShowSavedItems(!showSavedItems)}
                      >
                        Guardados para más tarde ({savedItems.length})
                        <Badge variant="secondary" className="ml-2">Guardados</Badge>
                      </CardTitle>
                    </CardHeader>
                    {showSavedItems && (
                      <CardContent className="space-y-4">
                        {savedItems.map((item) => (
                          <div key={item.product.id} className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50">
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
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => moveFromSaved(item.product.id)}
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Mover al Carrito
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.product.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                )}

                {/* Trade-In Device */}
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
              </>
            )}

            {/* Vista de Información de Envío */}
            {step === 'shipping' && (
              <Card>
                <CardHeader>
                  <CardTitle>Información de Envío</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input
                        id="firstName"
                        value={shippingInfo.firstName}
                        onChange={(e) => setShippingInfo({...shippingInfo, firstName: e.target.value})}
                        placeholder="Tu nombre"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input
                        id="lastName"
                        value={shippingInfo.lastName}
                        onChange={(e) => setShippingInfo({...shippingInfo, lastName: e.target.value})}
                        placeholder="Tu apellido"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) => setShippingInfo({...shippingInfo, email: e.target.value})}
                        placeholder="tu@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        value={shippingInfo.phone}
                        onChange={(e) => setShippingInfo({...shippingInfo, phone: e.target.value})}
                        placeholder="+54 11 1234-5678"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Dirección</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({...shippingInfo, address: e.target.value})}
                      placeholder="Calle y número"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        value={shippingInfo.city}
                        onChange={(e) => setShippingInfo({...shippingInfo, city: e.target.value})}
                        placeholder="Buenos Aires"
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">Provincia</Label>
                      <Input
                        id="state"
                        value={shippingInfo.state}
                        onChange={(e) => setShippingInfo({...shippingInfo, state: e.target.value})}
                        placeholder="CABA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                        placeholder="1234"
                      />
                    </div>
                  </div>

                  {/* Opciones de Envío */}
                  <div className="mt-6">
                    <Label>Método de Envío</Label>
                    <div className="space-y-3 mt-2">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer ${state.shipping.method === 'standard' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onClick={() => updateShippingMethod('standard', 0, 5)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Truck className="h-5 w-5 mr-3 text-gray-600" />
                            <div>
                              <p className="font-medium">Envío Estándar</p>
                              <p className="text-sm text-gray-600">5-7 días hábiles</p>
                            </div>
                          </div>
                          <span className="font-bold text-green-600">Gratis</span>
                        </div>
                      </div>
                      
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer ${state.shipping.method === 'express' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                        onClick={() => updateShippingMethod('express', 15000, 2)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Clock className="h-5 w-5 mr-3 text-gray-600" />
                            <div>
                              <p className="font-medium">Envío Express</p>
                              <p className="text-sm text-gray-600">1-2 días hábiles</p>
                            </div>
                          </div>
                          <span className="font-bold">$15.000</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Vista de Método de Pago */}
            {step === 'payment' && (
              <Card>
                <CardHeader>
                  <CardTitle>Método de Pago</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${paymentInfo.method === 'credit_card' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentInfo({...paymentInfo, method: 'credit_card'})}
                    >
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-3 text-gray-600" />
                        <span className="font-medium">Tarjeta de Crédito/Débito</span>
                      </div>
                    </div>
                    
                    <div 
                      className={`p-4 border rounded-lg cursor-pointer ${paymentInfo.method === 'mercadopago' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                      onClick={() => setPaymentInfo({...paymentInfo, method: 'mercadopago'})}
                    >
                      <div className="flex items-center">
                        <div className="w-5 h-5 mr-3 bg-blue-500 rounded"></div>
                        <span className="font-medium">MercadoPago</span>
                      </div>
                    </div>
                  </div>

                  {paymentInfo.method === 'credit_card' && (
                    <div className="space-y-4 mt-6">
                      <div>
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input
                          id="cardName"
                          value={paymentInfo.cardName}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardName: e.target.value})}
                          placeholder="Juan Pérez"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          value={paymentInfo.cardNumber}
                          onChange={(e) => setPaymentInfo({...paymentInfo, cardNumber: e.target.value})}
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiryDate">Fecha de Vencimiento</Label>
                          <Input
                            id="expiryDate"
                            value={paymentInfo.expiryDate}
                            onChange={(e) => setPaymentInfo({...paymentInfo, expiryDate: e.target.value})}
                            placeholder="MM/AA"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            value={paymentInfo.cvv}
                            onChange={(e) => setPaymentInfo({...paymentInfo, cvv: e.target.value})}
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Vista de Revisión */}
            {step === 'review' && (
              <Card>
                <CardHeader>
                  <CardTitle>Revisar tu Pedido</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Resumen de productos */}
                  <div>
                    <h3 className="font-semibold mb-3">Productos</h3>
                    {activeItems.map((item) => (
                      <div key={item.product.id} className="flex items-center justify-between py-2">
                        <div className="flex items-center space-x-3">
                          <img src={item.product.image} alt={item.product.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                          </div>
                        </div>
                        <span className="font-medium">${(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Información de envío */}
                  <div>
                    <h3 className="font-semibold mb-3">Información de Envío</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
                      <p>{shippingInfo.email}</p>
                      <p>{shippingInfo.phone}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Método de pago */}
                  <div>
                    <h3 className="font-semibold mb-3">Método de Pago</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium">
                        {paymentInfo.method === 'credit_card' ? 'Tarjeta de Crédito' : 'MercadoPago'}
                      </p>
                      {paymentInfo.method === 'credit_card' && paymentInfo.cardNumber && (
                        <p>**** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
                      )}
                    </div>
                  </div>

                  {/* Notas del pedido */}
                  <div>
                    <Label htmlFor="orderNotes">Notas del Pedido (Opcional)</Label>
                    <Textarea
                      id="orderNotes"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="Instrucciones especiales para la entrega..."
                      className="mt-2"
                    />
                  </div>

                  {/* Términos y condiciones */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeToTerms}
                      onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm">
                      Acepto los <Link to="/terminos" className="text-blue-600 hover:underline">términos y condiciones</Link> y la <Link to="/privacidad" className="text-blue-600 hover:underline">política de privacidad</Link>
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Resumen del Pedido - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({activeItems.length} productos)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                
                {/* Descuentos aplicados */}
                {state.discounts.map((discount) => (
                  <div key={discount.id} className="flex justify-between text-green-600">
                    <div className="flex items-center">
                      <span className="text-sm">{discount.description}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDiscount(discount.id)}
                        className="ml-2 h-4 w-4 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <span>-${discount.type === 'percentage' ? (subtotal * discount.value / 100).toLocaleString() : discount.value.toLocaleString()}</span>
                  </div>
                ))}
                
                {tradeInValue > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Crédito Trade-In</span>
                    <span>-${tradeInValue.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Envío ({state.shipping.method || 'Estándar'})</span>
                  <span>{shippingCost === 0 ? 'Gratis' : `$${shippingCost.toLocaleString()}`}</span>
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

                {/* Cupón de descuento */}
                {step === 'cart' && (
                  <div className="space-y-3 pt-4 border-t">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button onClick={applyCoupon} variant="outline">
                        <Tag className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="space-y-3 pt-4">
                  {step === 'cart' && activeItems.length > 0 && (
                    <Button onClick={proceedToNextStep} className="w-full">
                      Proceder al Checkout
                    </Button>
                  )}
                  
                  {step === 'shipping' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={proceedToNextStep} 
                        className="w-full"
                        disabled={!validateShippingInfo()}
                      >
                        Continuar al Pago
                      </Button>
                      <Button 
                        onClick={() => setStep('cart')} 
                        variant="outline" 
                        className="w-full"
                      >
                        Volver al Carrito
                      </Button>
                    </div>
                  )}
                  
                  {step === 'payment' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={proceedToNextStep} 
                        className="w-full"
                        disabled={!validatePaymentInfo()}
                      >
                        Revisar Pedido
                      </Button>
                      <Button 
                        onClick={() => setStep('shipping')} 
                        variant="outline" 
                        className="w-full"
                      >
                        Volver al Envío
                      </Button>
                    </div>
                  )}
                  
                  {step === 'review' && (
                    <div className="space-y-2">
                      <Button 
                        onClick={proceedToNextStep} 
                        className="w-full"
                        disabled={!agreeToTerms}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Confirmar Pedido
                      </Button>
                      <Button 
                        onClick={() => setStep('payment')} 
                        variant="outline" 
                        className="w-full"
                      >
                        Volver al Pago
                      </Button>
                    </div>
                  )}
                  
                  {step === 'cart' && (
                    <Button asChild variant="outline" className="w-full">
                      <Link to="/parte-de-pago">
                        <Gift className="h-4 w-4 mr-2" />
                        Agregar Trade-In
                      </Link>
                    </Button>
                  )}
                </div>

                {/* Información adicional */}
                <div className="text-xs text-gray-500 pt-4 space-y-1">
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-2" />
                    <span>Envío gratis en todos los pedidos</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-3 w-3 mr-2" />
                    <span>Garantía de 30 días</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-2" />
                    <span>Soporte técnico incluido</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}