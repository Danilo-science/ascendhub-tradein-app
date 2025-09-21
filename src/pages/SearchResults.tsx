import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ArrowLeft, Package } from 'lucide-react';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { allProducts, searchProducts, filterProducts } from '@/lib/products';
import { EnhancedProduct, ProductFilters } from '@/types';

const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<ProductFilters>({});
  const [isLoading, setIsLoading] = useState(true);

  // Obtener query de la URL
  const urlQuery = searchParams.get('q') || '';

  // Inicializar búsqueda desde URL
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery);
      setFilters({ search: urlQuery });
    }
    setIsLoading(false);
  }, [urlQuery]);

  // Productos filtrados
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return allProducts;
    return searchProducts(allProducts, searchQuery);
  }, [searchQuery]);

  // Manejar nueva búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
      setFilters({ search: searchQuery.trim() });
    }
  };

  // Limpiar búsqueda
  const clearSearch = () => {
    setSearchQuery('');
    setFilters({});
    setSearchParams({});
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="pt-20 flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando resultados...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-white border-b pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link to="/" className="hover:text-blue-600 transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span className="text-gray-900">Resultados de búsqueda</span>
          </div>

          {/* Search Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {urlQuery ? `Resultados para "${urlQuery}"` : 'Buscar productos'}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
              </p>
            </div>

            {/* Search Form */}
            <div className="lg:w-96">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button type="submit" disabled={!searchQuery.trim()}>
                  Buscar
                </Button>
              </form>
            </div>
          </div>

          {/* Active Filters */}
          {urlQuery && (
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Filtros activos:</span>
              <Badge variant="secondary" className="flex items-center gap-1">
                Búsqueda: "{urlQuery}"
                <button
                  onClick={clearSearch}
                  className="ml-1 hover:text-red-600 transition-colors"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-6">
                <Package className="w-20 h-20 mx-auto" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                No pudimos encontrar productos que coincidan con tu búsqueda "{urlQuery}". 
                Intenta con otros términos o explora nuestras categorías.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={clearSearch} variant="outline">
                  Limpiar búsqueda
                </Button>
                <Button asChild>
                  <Link to="/">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio
                  </Link>
                </Button>
              </div>
              
              {/* Suggestions */}
              <div className="mt-12 text-left max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Sugerencias:</h4>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium mb-2">Productos populares:</p>
                    <ul className="space-y-1">
                      <li><Link to="/apple" className="hover:text-blue-600">iPhone</Link></li>
                      <li><Link to="/apple" className="hover:text-blue-600">MacBook</Link></li>
                      <li><Link to="/electronica" className="hover:text-blue-600">Samsung Galaxy</Link></li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-medium mb-2">Categorías:</p>
                    <ul className="space-y-1">
                      <li><Link to="/apple" className="hover:text-blue-600">Productos Apple</Link></li>
                      <li><Link to="/electronica" className="hover:text-blue-600">Electrónicos</Link></li>
                      <li><Link to="/parte-de-pago" className="hover:text-blue-600">Trade-In</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <ProductGrid 
              products={filteredProducts}
              section="default"
              showFilters={true}
              itemsPerPage={16}
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SearchResultsPage;