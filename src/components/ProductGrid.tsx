import React, { useState, useMemo, useEffect, memo, useCallback } from 'react';
import { Search, Filter, Grid, List, ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { motion } from 'motion/react';
import { EnhancedProduct, ProductFilters, ProductSortOption } from '@/types';
import { ProductCard } from './ProductCard';
import { ProductGridSkeleton } from './ui/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { filterProducts, sortProducts, sortOptions } from '@/lib/products';

interface ProductGridProps {
  products: EnhancedProduct[];
  section?: 'apple' | 'electronics' | 'default';
  title?: string;
  showFilters?: boolean;
  itemsPerPage?: number;
  defaultView?: 'grid' | 'list';
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products = [],
  section = 'default',
  title,
  showFilters = true,
  itemsPerPage = 12,
  defaultView = 'grid',
  loading = false
}) => {
  // Validación temprana para evitar errores
  if (!products || !Array.isArray(products)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay productos disponibles</p>
      </div>
    );
  }

  // Estados para filtros y vista
  const [filters, setFilters] = useState<ProductFilters>({});
  const [sortBy, setSortBy] = useState<string>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);

  // Calcular rango de precios de los productos
  const priceExtent = useMemo(() => {
    const prices = products.map(p => p.price);
    return [Math.min(...prices), Math.max(...prices)];
  }, [products]);

  // Obtener categorías y marcas únicas
  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category_id))];
    return cats.filter(Boolean);
  }, [products]);

  const brands = useMemo(() => {
    const brandSet = [...new Set(products.map(p => p.brand))];
    return brandSet.filter(Boolean);
  }, [products]);

  // Aplicar filtros y ordenamiento
  const filteredAndSortedProducts = useMemo(() => {
    const activeFilters: ProductFilters = {
      ...filters,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    };
    
    const filtered = filterProducts(products, activeFilters);
    return sortProducts(filtered, sortBy);
  }, [products, filters, sortBy, priceRange]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  // Resetear página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, priceRange]);

  // Inicializar rango de precios
  useEffect(() => {
    setPriceRange([priceExtent[0], priceExtent[1]]);
  }, [priceExtent]);

  const handleFilterChange = useCallback((key: keyof ProductFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setPriceRange([priceExtent[0], priceExtent[1]]);
  }, [priceExtent]);

  const getSectionStyles = useCallback(() => {
    switch (section) {
      case 'apple':
        return {
          primary: 'text-gray-800',
          accent: 'bg-gray-800 hover:bg-gray-700',
          border: 'border-gray-200',
          bg: 'bg-gray-50'
        };
      case 'electronics':
        return {
          primary: 'text-blue-600',
          accent: 'bg-blue-600 hover:bg-blue-700',
          border: 'border-blue-200',
          bg: 'bg-blue-50'
        };
      default:
        return {
          primary: 'text-purple-600',
          accent: 'bg-purple-600 hover:bg-purple-700',
          border: 'border-purple-200',
          bg: 'bg-purple-50'
        };
    }
  }, [section]);

  const styles = getSectionStyles();

  const renderFilters = () => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-fit bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </span>
            {Object.keys(filters).length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-red-500 hover:text-red-700 hover:bg-red-50/50"
              >
                <X className="w-4 h-4 mr-1" />
                Limpiar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Búsqueda */}
          <div>
            <label className="text-sm font-medium mb-2 block">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar productos..."
                value={filters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10 bg-white/20 backdrop-blur-sm border-white/30"
              />
            </div>
          </div>

          {/* Categorías */}
          {categories.length > 1 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Categoría</label>
              <Select
                value={filters.category || ''}
                onValueChange={(value) => handleFilterChange('category', value || undefined)}
              >
                <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30">
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las categorías</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Marcas */}
          {brands.length > 1 && (
            <div>
              <label className="text-sm font-medium mb-2 block">Marca</label>
              <Select
                value={filters.brand || ''}
                onValueChange={(value) => handleFilterChange('brand', value || undefined)}
              >
                <SelectTrigger className="bg-white/20 backdrop-blur-sm border-white/30">
                  <SelectValue placeholder="Todas las marcas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas las marcas</SelectItem>
                  {brands.map(brand => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Rango de precios */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Precio: ${priceRange[0]} - ${priceRange[1]}
            </label>
            <Slider
              value={priceRange}
              onValueChange={(value) => setPriceRange(value as [number, number])}
              min={priceExtent[0]}
              max={priceExtent[1]}
              step={50}
              className="w-full"
            />
          </div>

          {/* Filtros adicionales */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="inStock"
                checked={filters.inStock || false}
                onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
              />
              <label htmlFor="inStock" className="text-sm">Solo en stock</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featured"
                checked={filters.featured || false}
                onCheckedChange={(checked) => handleFilterChange('featured', checked)}
              />
              <label htmlFor="featured" className="text-sm">Solo destacados</label>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <motion.div 
        className="flex items-center justify-center gap-2 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
          className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20"
        >
          Anterior
        </Button>
        
        {startPage > 1 && (
          <>
            <Button
              variant={currentPage === 1 ? 'default' : 'outline'}
              onClick={() => setCurrentPage(1)}
              className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20"
            >
              1
            </Button>
            {startPage > 2 && <span className="px-2 text-gray-400">...</span>}
          </>
        )}

        {pages.map(page => (
          <Button
            key={page}
            variant={currentPage === page ? 'default' : 'outline'}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page 
              ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
              : "bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20"
            }
          >
            {page}
          </Button>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && <span className="px-2 text-gray-400">...</span>}
            <Button
              variant={currentPage === totalPages ? 'default' : 'outline'}
              onClick={() => setCurrentPage(totalPages)}
              className={currentPage === totalPages 
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg" 
                : "bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20"
              }
            >
              {totalPages}
            </Button>
          </>
        )}

        <Button
          variant="outline"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
          className="bg-white/10 backdrop-blur-sm border-white/30 hover:bg-white/20"
        >
          Siguiente
        </Button>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && (
            <h2 className={`text-2xl font-bold ${styles.primary} mb-2`}>
              {title}
            </h2>
          )}
          <p className="text-gray-600">
            {filteredAndSortedProducts.length} productos encontrados
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Ordenamiento */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Vista */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Filtros móviles */}
          {showFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
          )}
        </div>
      </div>

      {/* Filtros activos */}
      {Object.keys(filters).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.search && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Búsqueda: "{filters.search}"
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange('search', undefined)}
              />
            </Badge>
          )}
          {filters.category && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Categoría: {filters.category}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange('category', undefined)}
              />
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Marca: {filters.brand}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => handleFilterChange('brand', undefined)}
              />
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-6">
        {/* Filtros laterales */}
        {showFilters && (
          <div className="hidden lg:block w-64 xl:w-80 flex-shrink-0">
            {renderFilters()}
          </div>
        )}

        {/* Filtros móviles */}
        {showFilters && showMobileFilters && (
          <div className="lg:hidden fixed inset-0 z-50 bg-black/50">
            <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-4 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Filtros</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              {renderFilters()}
            </div>
          </div>
        )}

        {/* Grid de productos */}
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {loading ? (
            <ProductGridSkeleton count={itemsPerPage} />
          ) : paginatedProducts.length === 0 ? (
            <motion.div 
              className="text-center py-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpiar filtros
              </Button>
            </motion.div>
          ) : (
            <>
              <motion.div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6'
                    : 'space-y-4'
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {paginatedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: index * 0.1,
                      ease: "easeOut"
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <ProductCard
                      product={product}
                      section={section}
                      variant={viewMode}
                    />
                  </motion.div>
                ))}
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                {renderPagination()}
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};