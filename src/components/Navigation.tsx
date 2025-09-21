import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Apple, Zap, Home, Smartphone, RefreshCw, User, Search } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CartSidebar } from '@/components/CartSidebar';

interface NavigationProps {
  className?: string;
}

type NavigationTheme = 'apple' | 'electronics' | 'default';

const Navigation: React.FC<NavigationProps> = memo(({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();

  // Memoizar el tema basado en la ruta actual
  const theme = useMemo<NavigationTheme>(() => {
    const path = location.pathname;
    if (path.startsWith('/apple')) return 'apple';
    if (path.startsWith('/electronica')) return 'electronics';
    return 'default';
  }, [location.pathname]);

  // Configuración de temas memoizada
  const themeConfig = useMemo(() => ({
    apple: {
      bg: 'bg-white/95 backdrop-blur-md border-gray-200/20',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      hover: 'hover:text-gray-900 hover:bg-gray-100/50',
      button: 'bg-gray-900 hover:bg-gray-800 text-white',
      logo: 'text-gray-900',
      accent: 'text-gray-900'
    },
    electronics: {
      bg: 'bg-gradient-to-r from-purple-900/95 to-blue-900/95 backdrop-blur-md border-purple-500/20',
      text: 'text-white',
      textSecondary: 'text-purple-300',
      hover: 'hover:text-white hover:bg-purple-700/50',
      button: 'bg-purple-600 hover:bg-purple-700 text-white',
      logo: 'text-white',
      accent: 'text-purple-300'
    },
    default: {
      bg: 'bg-white/95 backdrop-blur-md border-gray-200/20',
      text: 'text-gray-900',
      textSecondary: 'text-gray-600',
      hover: 'hover:text-blue-600 hover:bg-blue-50/50',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      logo: 'text-blue-600',
      accent: 'text-blue-600'
    }
  }), []);

  const currentTheme = themeConfig[theme];

  // Memoizar items de navegación
  const navigationItems = useMemo(() => [
    { 
      name: 'Inicio', 
      href: '/', 
      icon: null 
    },
    { 
      name: 'Apple', 
      href: '/apple', 
      icon: <Apple className="w-4 h-4" /> 
    },
    { 
      name: 'Electrónicos', 
      href: '/electronica', 
      icon: <Zap className="w-4 h-4" /> 
    },
    { 
      name: 'Trade-In', 
      href: '/parte-de-pago', 
      icon: null 
    },
    { 
      name: 'Test Cart', 
      href: '/test-cart', 
      icon: <ShoppingCart className="w-4 h-4" /> 
    },
    { 
       name: 'Dashboard', 
       href: '/dashboard', 
       icon: <User className="w-4 h-4" /> 
     }
  ], []);

  // Memoizar total de items
  const totalItems = useMemo(() => 
    state.items.reduce((sum, item) => sum + item.quantity, 0), 
    [state.items]
  );

  // Función para manejar la búsqueda con useCallback
  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navegar a una página de resultados de búsqueda con el query como parámetro
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
      setIsMenuOpen(false);
    }
  }, [searchQuery, navigate]);

  // Función para alternar la búsqueda
  const toggleSearch = useCallback(() => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus en el input cuando se abre
      setTimeout(() => {
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  }, [isSearchOpen]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.bg} border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-2 ${currentTheme.logo} font-bold text-lg sm:text-xl transition-colors`}
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs sm:text-sm">AH</span>
            </div>
            <span className="hidden xs:inline sm:inline">AscendHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-2 xl:px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentTheme.text} ${currentTheme.hover} ${
                  location.pathname === item.href ? currentTheme.accent : ''
                }`}
              >
                {item.icon}
                <span className="hidden xl:inline">{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <div className="relative">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${currentTheme.textSecondary}`} />
                  <Input
                    id="global-search-input"
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 w-48 lg:w-64 ${currentTheme.bg} ${currentTheme.text} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    onBlur={() => {
                      // Cerrar búsqueda si está vacía y pierde el foco
                      if (!searchQuery.trim()) {
                        setTimeout(() => setIsSearchOpen(false), 150);
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`ml-2 ${currentTheme.text} ${currentTheme.hover}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className={`${currentTheme.text} ${currentTheme.hover}`}
                onClick={toggleSearch}
              >
                <Search className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Button - Mobile */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${currentTheme.text} ${currentTheme.hover}`}
              onClick={toggleSearch}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`relative ${currentTheme.text} ${currentTheme.hover}`}
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className={`absolute -top-2 -right-2 ${currentTheme.button} text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
                  {totalItems}
                </span>
              )}
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`lg:hidden ${currentTheme.text} ${currentTheme.hover}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-200/20">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-all duration-200 ${currentTheme.text} ${currentTheme.hover} ${
                    location.pathname === item.href ? currentTheme.accent : ''
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden border-t border-gray-200/20">
            <div className="px-4 py-3">
              <form onSubmit={handleSearch} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${currentTheme.textSecondary}`} />
                  <Input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-10 pr-4 py-2 w-full ${currentTheme.bg} ${currentTheme.text} border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                    autoFocus
                  />
                </div>
                <Button
                  type="submit"
                  size="sm"
                  className={currentTheme.button}
                  disabled={!searchQuery.trim()}
                >
                  <Search className="w-4 h-4 sm:hidden" />
                  <span className="hidden sm:inline">Buscar</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className={`${currentTheme.text} ${currentTheme.hover}`}
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchQuery('');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;