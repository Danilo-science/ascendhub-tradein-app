import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { Product } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem(product);
    toast({
      title: "Producto agregado",
      description: `${product.title} se agregó al carrito`,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden transition-transform duration-200 hover:scale-105 hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden bg-muted">
          {product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              Sin imagen
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground truncate">
              {product.title}
            </h3>
            {product.brand && (
              <p className="text-sm text-muted-foreground">{product.brand}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            {product.condition !== 'new' && (
              <Badge variant="secondary" className="text-xs">
                {product.condition === 'used' ? 'Usado' : 'Reacondicionado'}
              </Badge>
            )}
            {product.featured && (
              <Badge className="text-xs">Destacado</Badge>
            )}
          </div>
        </div>

        {product.short_description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div>
            {product.original_price && product.original_price > product.price && (
              <p className="text-sm text-muted-foreground line-through">
                {formatPrice(product.original_price)}
              </p>
            )}
            <p className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </p>
          </div>
          
          {product.stock_quantity > 0 ? (
            <Badge variant="outline" className="text-green-600 border-green-600">
              En stock
            </Badge>
          ) : (
            <Badge variant="destructive">Sin stock</Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button 
          variant="outline" 
          asChild 
          className="flex-1"
        >
          <Link 
            to={`/productos/${product.slug}`}
            aria-label={`Ver detalles de ${product.title}`}
          >
            Ver detalles
          </Link>
        </Button>
        
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock_quantity === 0}
          className="flex-1"
        >
          Agregar al carrito
        </Button>
      </CardFooter>
    </Card>
  );
}