import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  User, 
  ShoppingBag, 
  Heart, 
  GitCompare, 
  Settings, 
  Bell, 
  CreditCard, 
  MapPin, 
  Star,
  Calendar,
  TrendingUp,
  Package,
  Eye,
  Trash2,
  ShoppingCart,
  Filter,
  Search
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { useCart, useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Dashboard = () => {
  const { state } = useCart();
  const { 
    removeFromWishlist, 
    removeFromComparison, 
    addToCart, 
    addNotification 
  } = useCartActions();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Datos de ejemplo para el usuario
  const userData = {
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    memberSince: '2023-01-15',
    totalOrders: state.purchaseHistory.length,
    totalSpent: state.purchaseHistory.reduce((sum, order) => sum + order.total, 0),
    favoriteCategory: 'Apple'
  };

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    addNotification({
      type: 'info',
      message: 'Producto removido de favoritos',
      autoHide: true,
      duration: 3000
    });
  };

  const handleRemoveFromComparison = (productId: string) => {
    removeFromComparison(productId);
    addNotification({
      type: 'info',
      message: 'Producto removido de comparación',
      autoHide: true,
      duration: 3000
    });
  };

  const handleAddToCartFromWishlist = (product: any) => {
    // Convertir el producto de wishlist al formato necesario
    const productForCart = {
      id: product.id,
      title: product.name,
      price: product.price,
      original_price: product.originalPrice,
      images: [product.image],
      brand: product.brand,
      model: product.model,
      specs: product.specifications,
      stock_quantity: product.inStock ? 10 : 0,
      category_id: product.category,
      description: `${product.brand} ${product.model}`,
      short_description: `${product.brand} ${product.model}`,
      slug: product.id,
      status: 'active',
      condition: 'new',
      featured: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    addToCart(productForCart);
    addNotification({
      type: 'success',
      message: `${product.name} agregado al carrito`,
      autoHide: true,
      duration: 3000
    });
  };

  const filteredPurchaseHistory = state.purchaseHistory.filter(order => {
    const matchesSearch = order.items.some(item => 
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header del Dashboard */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">¡Hola, {userData.name}!</h1>
                  <p className="text-gray-600">Miembro desde {formatDate(userData.memberSince)}</p>
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Configuración
              </Button>
            </div>
          </div>

          {/* Estadísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de Órdenes</p>
                    <p className="text-2xl font-bold text-gray-900">{userData.totalOrders}</p>
                  </div>
                  <ShoppingBag className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Gastado</p>
                    <p className="text-2xl font-bold text-gray-900">${userData.totalSpent.toLocaleString()}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Favoritos</p>
                    <p className="text-2xl font-bold text-gray-900">{state.wishlist.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Comparaciones</p>
                    <p className="text-2xl font-bold text-gray-900">{state.comparison.length}</p>
                  </div>
                  <GitCompare className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenido Principal con Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="w-4 h-4" />
                Mis Órdenes
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Favoritos
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <GitCompare className="w-4 h-4" />
                Comparación
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Tab de Órdenes */}
            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Historial de Órdenes
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                          placeholder="Buscar productos..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="completed">Completado</SelectItem>
                          <SelectItem value="pending">Pendiente</SelectItem>
                          <SelectItem value="cancelled">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {filteredPurchaseHistory.length === 0 ? (
                    <div className="text-center py-12">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay órdenes</h3>
                      <p className="text-gray-600 mb-4">Aún no has realizado ninguna compra.</p>
                      <Button asChild>
                        <Link to="/">Comenzar a comprar</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredPurchaseHistory.map((order) => (
                        <div key={order.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold">Orden #{order.id.slice(-8)}</h3>
                              <Badge className={getStatusColor(order.status)}>
                                {order.status === 'completed' ? 'Completado' : 
                                 order.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">${order.total}</p>
                              <p className="text-sm text-gray-600">{formatDate(order.purchaseDate)}</p>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {order.items.map((item) => (
                              <div key={item.product.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                                <img 
                                  src={item.product.image} 
                                  alt={item.product.name}
                                  className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{item.product.name}</p>
                                  <p className="text-xs text-gray-600">Cantidad: {item.quantity}</p>
                                  <p className="text-xs font-medium">${item.product.price}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Wishlist */}
            <TabsContent value="wishlist" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Lista de Favoritos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.wishlist.length === 0 ? (
                    <div className="text-center py-12">
                      <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes favoritos</h3>
                      <p className="text-gray-600 mb-4">Agrega productos a tu lista de favoritos para verlos aquí.</p>
                      <Button asChild>
                        <Link to="/">Explorar productos</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {state.wishlist.map((item) => (
                        <Card key={item.product.id} className="overflow-hidden">
                          <div className="relative">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name}
                              className="w-full h-48 object-cover"
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/90"
                              onClick={() => handleRemoveFromWishlist(item.product.id)}
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold mb-2 line-clamp-2">{item.product.name}</h3>
                            <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-lg font-bold">${item.product.price}</span>
                              {item.product.originalPrice && (
                                <span className="text-sm text-gray-500 line-through">
                                  ${item.product.originalPrice}
                                </span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleAddToCartFromWishlist(item.product)}
                                disabled={!item.product.inStock}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {item.product.inStock ? 'Agregar al carrito' : 'Sin stock'}
                              </Button>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Comparación */}
            <TabsContent value="comparison" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitCompare className="w-5 h-5" />
                    Lista de Comparación
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {state.comparison.length === 0 ? (
                    <div className="text-center py-12">
                      <GitCompare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay productos para comparar</h3>
                      <p className="text-gray-600 mb-4">Agrega productos a tu lista de comparación para verlos aquí.</p>
                      <Button asChild>
                        <Link to="/">Explorar productos</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                          {state.comparison.length} producto{state.comparison.length !== 1 ? 's' : ''} en comparación
                        </p>
                        <Button variant="outline" size="sm">
                          Ver comparación detallada
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {state.comparison.map((item) => (
                          <Card key={item.product.id} className="overflow-hidden">
                            <div className="relative">
                              <img 
                                src={item.product.image} 
                                alt={item.product.name}
                                className="w-full h-48 object-cover"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/90"
                                onClick={() => handleRemoveFromComparison(item.product.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold mb-2 line-clamp-2">{item.product.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold">${item.product.price}</span>
                                {item.product.originalPrice && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${item.product.originalPrice}
                                  </span>
                                )}
                              </div>
                              
                              {/* Especificaciones clave */}
                              <div className="space-y-1 mb-3">
                                {Object.entries(item.product.specifications).slice(0, 3).map(([key, value]) => (
                                  <div key={key} className="flex justify-between text-xs">
                                    <span className="text-gray-600 capitalize">{key.replace('_', ' ')}:</span>
                                    <span className="font-medium">{value}</span>
                                  </div>
                                ))}
                              </div>
                              
                              <Button 
                                size="sm" 
                                className="w-full"
                                onClick={() => handleAddToCartFromWishlist(item.product)}
                                disabled={!item.product.inStock}
                              >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {item.product.inStock ? 'Agregar al carrito' : 'Sin stock'}
                              </Button>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tab de Analytics */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Resumen de Actividad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Productos en carrito</span>
                      <span className="font-semibold">{state.items.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Productos en favoritos</span>
                      <span className="font-semibold">{state.wishlist.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Productos en comparación</span>
                      <span className="font-semibold">{state.comparison.length}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Órdenes completadas</span>
                      <span className="font-semibold">
                        {state.purchaseHistory.filter(order => order.status === 'completed').length}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="w-5 h-5" />
                      Preferencias
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Categoría favorita</span>
                      <Badge variant="outline">{userData.favoriteCategory}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Moneda preferida</span>
                      <span className="font-semibold">{state.preferences.currency}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Idioma</span>
                      <span className="font-semibold">{state.preferences.language}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Notificaciones</span>
                      <Badge variant={state.preferences.notifications ? "default" : "secondary"}>
                        {state.preferences.notifications ? "Activadas" : "Desactivadas"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Actividad Reciente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Actividad reciente simulada ya que no existe en el estado */}
                    {[
                      { action: 'Producto agregado al carrito', timestamp: new Date() },
                      { action: 'Producto agregado a favoritos', timestamp: new Date(Date.now() - 3600000) },
                      { action: 'Comparación realizada', timestamp: new Date(Date.now() - 7200000) },
                      { action: 'Carrito guardado', timestamp: new Date(Date.now() - 10800000) },
                      { action: 'Preferencias actualizadas', timestamp: new Date(Date.now() - 14400000) }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-gray-600">{formatDate(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;