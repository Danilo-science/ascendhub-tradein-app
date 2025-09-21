import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, Apple, Zap } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  className?: string;
}

type NavigationTheme = 'apple' | 'electronics' | 'default';

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<NavigationTheme>('default');
  const location = useLocation();
  const { state } = useCart();

  // Determinar el tema basado en la ruta actual
  useEffect(() => {
    const path = location.pathname;
    if (path.startsWith('/apple')) {
      setTheme('apple');
    } else if (path.startsWith('/electronica')) {
      setTheme('electronics');
    } else {
      setTheme('default');
    }
  }, [location.pathname]);

  // Configuración de temas
  const themeConfig = {
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
      textSecondary: 'text-purple-100',
      hover: 'hover:text-white hover:bg-white/10',
      button: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white',
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
  };

  const currentTheme = themeConfig[theme];

  const navigationItems = [
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
    }
  ];

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${currentTheme.bg} border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className={`flex items-center space-x-2 ${currentTheme.logo} font-bold text-xl transition-colors`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AH</span>
            </div>
            <span>AscendHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${currentTheme.text} ${currentTheme.hover} ${
                  location.pathname === item.href ? currentTheme.accent : ''
                }`}
              >
                {item.icon}
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            {/* Cart Button */}
            <Link to="/carrito">
              <Button
                variant="ghost"
                size="sm"
                className={`relative ${currentTheme.text} ${currentTheme.hover}`}
              >
                <ShoppingCart className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className={`absolute -top-2 -right-2 ${currentTheme.button} text-xs rounded-full w-5 h-5 flex items-center justify-center`}>
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className={`md:hidden ${currentTheme.text} ${currentTheme.hover}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
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
      </div>
    </nav>
  );
};

export default Navigation;