import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart, User, Search, Home, Apple, Zap, Users, Mail, RefreshCw } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/hooks/useAuthContext';
import { useIsMobile } from '@/components/ui/use-mobile';

interface NavigationProps {
  className?: string;
}

const Navigation: React.FC<NavigationProps> = ({ className = '' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  const navigationItems = [
    { name: 'Inicio', path: '/', icon: Home },
    { name: 'Apple', path: '/apple', icon: Apple },
    { name: 'Electro', path: '/sell', icon: Zap },
    { name: 'Trade-In', path: '/trade-in', icon: RefreshCw },
  ];

  // Función para manejar la búsqueda
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false); // Cerrar menú móvil si está abierto
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 ${className}`}>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative"
      >
        {/* Main Navigation Header */}
        <header 
          className="relative bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl border-b border-white/20
                     before:absolute before:inset-0 before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none
                     after:absolute after:inset-0 after:bg-gradient-to-r after:from-blue-500/5 after:via-transparent after:to-purple-500/5 after:pointer-events-none"
          role="banner"
        >
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16">
              {/* Logo with hover/tap effects */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Link 
                  to="/" 
                  className="flex items-center space-x-2 text-white font-bold text-base sm:text-lg lg:text-xl"
                  aria-label="AscendHub - Ir al inicio"
                >
                  <div 
                    className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg"
                    aria-hidden="true"
                  >
                    <span className="text-white font-bold text-xs sm:text-sm">A</span>
                  </div>
                  <span className="hidden xs:block sm:inline">AscendHub</span>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              {!isMobile && (
                <nav 
                  className="hidden md:flex lg:flex items-center space-x-1"
                  role="navigation"
                  aria-label="Navegación principal"
                >
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.path}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                            location.pathname === item.path
                              ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30'
                              : 'text-gray-300 hover:text-white hover:bg-white/10'
                          }`}
                        >
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                          >
                            <IconComponent className="h-4 w-4" />
                          </motion.div>
                          <span className="hidden sm:inline">{item.name}</span>
                        </Link>
                        <motion.div
                          className="h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: location.pathname === item.path ? '100%' : 0 }}
                          transition={{ duration: 0.2 }}
                        />
                      </motion.div>
                    );
                  })}
                </nav>
              )}

              {/* Right side actions */}
              <section 
                className="flex items-center space-x-2 sm:space-x-3"
                aria-label="Acciones de usuario"
              >
                 {/* Search Input - Desktop */}
                 <motion.div
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="hidden sm:block"
                 >
                   <form onSubmit={handleSearch} className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                     <input
                       type="text"
                       placeholder="Buscar productos..."
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="pl-10 pr-4 w-64 h-9 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-500 transition-all duration-200 outline-none"
                     />
                   </form>
                 </motion.div>

                 {/* Cart Button */}
                 <motion.div
                   whileHover={{ scale: 1.05 }}
                   whileTap={{ scale: 0.95 }}
                   className="relative"
                 >
                   {user ? (
                     <Link to="/cart">
                       <Button
                         variant="ghost"
                         size="sm"
                         className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                         aria-label={`Carrito de compras - ${totalItems} ${totalItems === 1 ? 'artículo' : 'artículos'}`}
                       >
                         <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                         {totalItems > 0 && (
                           <motion.span
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg"
                             aria-hidden="true"
                           >
                             <span className="text-xs">{totalItems}</span>
                           </motion.span>
                         )}
                       </Button>
                     </Link>
                   ) : (
                     <Link to="/auth">
                       <Button
                         variant="ghost"
                         size="sm"
                         className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                         aria-label="Iniciar sesión para acceder al carrito"
                       >
                         <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                         {totalItems > 0 && (
                           <motion.span
                             initial={{ scale: 0 }}
                             animate={{ scale: 1 }}
                             className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-lg"
                             aria-hidden="true"
                           >
                             <span className="text-xs">{totalItems}</span>
                           </motion.span>
                         )}
                       </Button>
                     </Link>
                   )}
                 </motion.div>

                 {/* User Menu / Auth Button */}
                 {user ? (
                   <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="hidden sm:block"
                   >
                     <Button
                       variant="ghost"
                       size="sm"
                       className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                       aria-label={`Perfil de usuario - ${user.email || 'Usuario'}`}
                     >
                       <User className="w-4 h-4 sm:w-5 sm:h-5" />
                     </Button>
                   </motion.div>
                 ) : (
                   <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="hidden sm:block"
                   >
                     <Link to="/auth">
                       <Button
                         variant="ghost"
                         size="sm"
                         className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                         aria-label="Iniciar sesión"
                       >
                         <User className="w-4 h-4 sm:w-5 sm:h-5 mr-1" />
                         <span className="text-sm">Iniciar Sesión</span>
                       </Button>
                     </Link>
                   </motion.div>
                 )}

                 {/* Mobile Menu Toggle */}
                 {isMobile && (
                   <motion.div
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                   >
                     <Button
                       variant="ghost"
                       size="sm"
                       onClick={() => setIsMenuOpen(!isMenuOpen)}
                       className="md:hidden text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                       aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
                       aria-expanded={isMenuOpen}
                       aria-controls="mobile-menu"
                     >
                       {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                     </Button>
                   </motion.div>
                 )}
              </section>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && isMobile && (
          <motion.aside
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: 1, 
              height: 'auto' 
            }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden"
            role="navigation"
            aria-label="Menú móvil"
          >
            <div className="bg-black/20 backdrop-blur-xl border-t border-white/10">
               <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4 space-y-1 sm:space-y-2">
                 {navigationItems.map((item) => {
                   const IconComponent = item.icon;
                   return (
                     <motion.div
                       key={item.path}
                       whileHover={{ scale: 1.02 }}
                       whileTap={{ scale: 0.98 }}
                     >
                       <Link
                         to={item.path}
                         onClick={() => setIsMenuOpen(false)}
                         className={`flex items-center space-x-3 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all duration-200 ${
                           location.pathname === item.path
                             ? 'text-white bg-gradient-to-r from-blue-500/30 to-purple-500/30'
                             : 'text-gray-300 hover:text-white hover:bg-white/10'
                         }`}
                       >
                         <motion.div
                           whileHover={{ rotate: 360 }}
                           transition={{ duration: 0.5 }}
                         >
                           <IconComponent className="h-5 w-5" />
                         </motion.div>
                         <span>{item.name}</span>
                       </Link>
                     </motion.div>
                   );
                 })}
                 
                 {/* Mobile-only actions */}
                 <div className="pt-2 sm:pt-3 border-t border-white/10 mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                   <div className="flex items-center justify-between px-3 sm:px-4">
                     <span className="text-gray-400 text-sm">Acciones</span>
                   </div>
                   
                   <div className="flex flex-col space-y-3 px-3 sm:px-4">
                     
                     {/* Search Input - Mobile */}
                     <form onSubmit={handleSearch} className="relative">
                       <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                       <input
                         type="text"
                         placeholder="Buscar productos..."
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="pl-10 pr-4 w-full h-10 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:bg-white/20 focus:border-blue-500 transition-all duration-200 outline-none"
                       />
                     </form>
                     
                     {user ? (
                       <Button
                         variant="ghost"
                         size="sm"
                         className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                         aria-label={`Perfil de usuario - ${user.email || 'Usuario'}`}
                       >
                         <User className="w-5 h-5" />
                         <span className="ml-2 text-sm">Perfil</span>
                       </Button>
                     ) : (
                       <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                         <Button
                           variant="ghost"
                           size="sm"
                           className="text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                           aria-label="Iniciar sesión"
                         >
                           <User className="w-5 h-5" />
                           <span className="ml-2 text-sm">Iniciar Sesión</span>
                         </Button>
                       </Link>
                     )}
                   </div>
                 </div>
               </div>
             </div>
          </motion.aside>
        )}
      </motion.nav>
    </div>
  );
};

Navigation.displayName = 'Navigation';

export default Navigation;