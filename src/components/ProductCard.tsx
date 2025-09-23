import React, { memo } from 'react';
import { Star, ShoppingCart, Heart, Eye, Badge, Zap, GitCompare, Plus, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { EnhancedProduct, Product } from '@/types';
import { useCartActions } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { ImageWithFallback } from '@/components/figma/ImageWithFallback';

interface ProductCardProps {
  product: EnhancedProduct;
  section?: 'apple' | 'electronics' | 'default';
  variant?: 'grid' | 'list';
  showQuickActions?: boolean;
}

export const ProductCard = memo<ProductCardProps>(({
  product,
  section = 'default',
  variant = 'grid',
  showQuickActions = true
}) => {
  const { 
    addToCart, 
    removeFromCart, 
    isInCart, 
    getCartItemQuantity,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    addToComparison,
    removeFromComparison,
    isInComparison,
    showNotification
  } = useCartActions();
  
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Convertir EnhancedProduct a Product para compatibilidad con el contexto
  const convertToProduct = (product: EnhancedProduct): Product => ({
    id: product.id,
    title: product.title,
    slug: product.slug,
    description: product.description,
    short_description: product.short_description,
    price: product.price,
    original_price: product.original_price,
    category_id: product.category_id,
    brand: product.brand,
    model: product.model,
    specs: product.specs,
    images: product.images || [],
    status: product.status || 'active',
    condition: product.condition || 'new',
    stock_quantity: product.stock_quantity || 0,
    featured: product.featured || false,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: product.updated_at || new Date().toISOString(),
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    showNotification({
      type: 'success',
      message: `${product.title} agregado al carrito`,
      autoHide: true,
      duration: 3000
    });
  };

  const handleRemoveFromCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(product.id);
    showNotification({
      type: 'info',
      message: `${product.title} removido del carrito`,
      autoHide: true,
      duration: 3000
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productForCart = convertToProduct(product);
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showNotification({
        type: 'info',
        message: `${product.title} removido de favoritos`,
        autoHide: true,
        duration: 3000
      });
    } else {
      addToWishlist(productForCart);
      showNotification({
        type: 'success',
        message: `${product.title} agregado a favoritos`,
        autoHide: true,
        duration: 3000
      });
    }
  };

  const handleComparisonToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productForCart = convertToProduct(product);
    
    if (isInComparison(product.id)) {
      removeFromComparison(product.id);
      showNotification({
        type: 'info',
        message: `${product.title} removido de comparación`,
        autoHide: true,
        duration: 3000
      });
    } else {
      addToComparison(productForCart);
      showNotification({
        type: 'success',
        message: `${product.title} agregado a comparación`,
        autoHide: true,
        duration: 3000
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implementar modal de vista rápida
    showNotification({
      type: 'info',
      message: 'Vista rápida próximamente disponible',
      autoHide: true,
      duration: 2000
    });
  };

  const getSectionStyles = () => {
    switch (section) {
      case 'apple':
        return {
          card: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-gray-500/20',
          badge: 'bg-gradient-to-r from-gray-800 to-black text-white shadow-lg',
          button: 'bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white shadow-lg hover:shadow-xl transition-all duration-300',
          accent: 'text-gray-800'
        };
      case 'electronics':
        return {
          card: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-blue-400/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-blue-500/20',
          badge: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg',
          button: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg hover:shadow-xl transition-all duration-300',
          accent: 'text-blue-600'
        };
      default:
        return {
          card: 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:border-purple-400/30 transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-purple-500/20',
          badge: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg',
          button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg hover:shadow-xl transition-all duration-300',
          accent: 'text-purple-600'
        };
    }
  };

  const styles = getSectionStyles();
  const inCart = isInCart(product.id);
  const cartQuantity = getCartItemQuantity(product.id);
  const inWishlist = isInWishlist(product.id);
  const inComparison = isInComparison(product.id);

  const renderRating = () => {
    if (!product.rating) return null;
    
    return (
      <div className="flex items-center gap-1 mb-2">
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-4 h-4 ${
                star <= Math.round(product.rating!.average)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-600">
          {product.rating.average} ({product.rating.count})
        </span>
      </div>
    );
  };

  const renderBadges = () => (
    <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
      {product.discount_percentage && (
        <UIBadge className="bg-red-500 text-white text-xs px-2 py-1">
          -{product.discount_percentage}%
        </UIBadge>
      )}
      {product.is_new_arrival && (
        <UIBadge className="bg-green-500 text-white text-xs px-2 py-1">
          Nuevo
        </UIBadge>
      )}
      {product.is_bestseller && (
        <UIBadge className={`${styles.badge} text-xs px-2 py-1`}>
          <Zap className="w-3 h-3 mr-1" />
          Bestseller
        </UIBadge>
      )}
      {product.featured && (
        <UIBadge className="bg-yellow-500 text-white text-xs px-2 py-1">
          Destacado
        </UIBadge>
      )}
    </div>
  );

  const renderQuickActions = () => {
    if (!showQuickActions) return null;

    return (
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
          onClick={handleWishlistToggle}
          title={inWishlist ? "Remover de favoritos" : "Agregar a favoritos"}
        >
          <Heart
            className={`w-4 h-4 ${
              inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
          onClick={handleComparisonToggle}
          title={inComparison ? "Remover de comparación" : "Agregar a comparación"}
        >
          <GitCompare
            className={`w-4 h-4 ${
              inComparison ? 'fill-blue-500 text-blue-500' : 'text-gray-600'
            }`}
          />
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="w-8 h-8 p-0 bg-white/90 hover:bg-white"
          onClick={handleQuickView}
          title="Vista rápida"
        >
          <Eye className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    );
  };

  const renderSpecs = () => {
    if (!product.specs || variant === 'grid') return null;

    const specEntries = Object.entries(product.specs).slice(0, 3);
    
    return (
      <div className="mb-3">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Especificaciones:</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          {specEntries.map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="capitalize">{key.replace('_', ' ')}:</span>
              <span className="font-medium">{value}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderCartControls = () => {
    if (!inCart) {
      return (
        <Button
          onClick={handleAddToCart}
          className={`w-full ${styles.button}`}
          disabled={product.stock_quantity <= 0}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Agregar al carrito
        </Button>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleRemoveFromCart}
          className="flex-shrink-0"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <span className="flex-1 text-center text-sm font-medium">
          En carrito: {cartQuantity}
        </span>
        <Button
          size="sm"
          onClick={handleAddToCart}
          className={`flex-shrink-0 ${styles.button}`}
          disabled={product.stock_quantity <= cartQuantity}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    );
  };

  if (variant === 'list') {
    return (
      <Card className={`${styles.card} group cursor-pointer overflow-hidden`}>
        <div className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-48 h-48 sm:h-32 flex-shrink-0">
            <ImageWithFallback
              src={product.images[0]}
              alt={product.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onError={() => setImageLoaded(true)}
              sizes="(max-width: 640px) 100vw, 192px"
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}
            {renderBadges()}
          </div>
          
          <CardContent className="flex-1 p-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.short_description}
                </p>
                {renderRating()}
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <div className="flex flex-col sm:items-end gap-1 mb-1">
                  <span className="text-xl sm:text-2xl font-bold text-gray-900">
                    ${product.price}
                  </span>
                  {product.original_price && (
                    <span className="text-sm sm:text-lg text-gray-500 line-through">
                      ${product.original_price}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Stock: {product.stock_quantity}
                </p>
              </div>
            </div>
            
            {renderSpecs()}
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Marca:</span>
                  <span className="text-sm font-medium">{product.brand}</span>
                </div>
                
                {/* Quick actions for list view */}
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleWishlistToggle}
                    className="p-1"
                    title={inWishlist ? "Remover de favoritos" : "Agregar a favoritos"}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'
                      }`}
                    />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleComparisonToggle}
                    className="p-1"
                    title={inComparison ? "Remover de comparación" : "Agregar a comparación"}
                  >
                    <GitCompare
                      className={`w-4 h-4 ${
                        inComparison ? 'fill-blue-500 text-blue-500' : 'text-gray-400'
                      }`}
                    />
                  </Button>
                </div>
              </div>
              
              <div className="w-full sm:w-48">
                {renderCartControls()}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className={`${styles.card} group cursor-pointer overflow-hidden relative`}>
        <div className="relative aspect-square overflow-hidden">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 via-pink-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <ImageWithFallback
            src={product.images[0]}
            alt={product.title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={() => setImageLoaded(true)}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          {renderBadges()}
          {renderQuickActions()}
        </div>

        <CardContent className="p-4 relative">
          {/* Subtle glow behind content */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="mb-2 relative z-10">
            <motion.h3 
              className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {product.title}
            </motion.h3>
            <p className="text-sm text-gray-600 line-clamp-2">
              {product.short_description}
            </p>
          </div>

          {renderRating()}

          <div className="flex items-center justify-between mb-3 relative z-10">
            <div>
              <motion.span 
                className="text-xl font-bold text-gray-900"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                ${product.price}
              </motion.span>
              {product.original_price && (
                <span className="text-sm text-gray-500 line-through ml-2">
                  ${product.original_price}
                </span>
              )}
            </div>
            <span className="text-sm text-gray-600">
              Stock: {product.stock_quantity}
            </span>
          </div>

          {product.specs && (
            <div className="mb-3 relative z-10">
              <div className="flex flex-wrap gap-1">
                {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
                  <motion.span
                    key={key}
                    className="text-xs bg-white/20 backdrop-blur-sm text-gray-700 px-2 py-1 rounded border border-white/30"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    {value}
                  </motion.span>
                ))}
              </div>
            </div>
          )}

          {/* Status indicators */}
          <div className="flex items-center justify-between mb-3 text-xs relative z-10">
            <div className="flex items-center gap-2">
              {inWishlist && (
                <motion.span 
                  className="flex items-center gap-1 text-red-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Heart className="w-3 h-3 fill-current" />
                  Favorito
                </motion.span>
              )}
              {inComparison && (
                <motion.span 
                  className="flex items-center gap-1 text-blue-500"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <GitCompare className="w-3 h-3 fill-current" />
                  En comparación
                </motion.span>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-0 relative z-10">
          {renderCartControls()}
        </CardFooter>
      </Card>
    </motion.div>
  );
});