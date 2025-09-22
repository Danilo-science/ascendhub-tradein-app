import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import Navigation from '@/components/Navigation';
import { Footer } from '@/components/organisms/Footer';
import { ProductGrid } from '@/components/ProductGrid';
import { getFeaturedProducts } from '@/lib/products';
import { Apple, Smartphone, ArrowRight, Zap, Shield, Truck, Star, Sparkles } from 'lucide-react';

const Index = () => {
  const featuredProducts = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navigation />
      
      {/* Hero Section with Glassmorphism */}
      <section className="relative pt-16 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent"
            >
              Renovate tu tecnología con{' '}
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent">
                AscendHub
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 text-gray-300 max-w-3xl mx-auto px-4"
            >
              Comprá productos premium, entregá tu equipo viejo como parte de pago 
              y ascendé a la última tecnología sin esfuerzo.
            </motion.p>
            
            {/* Características de evaluación y seguridad */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-3 mb-8 relative"
            >
              {/* Fondo radiante */}
              <div className="absolute inset-0 bg-gradient-radial from-blue-500/5 via-purple-500/3 to-transparent blur-xl -z-10 scale-150"></div>
              
              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 backdrop-blur-md border border-yellow-400/20 rounded-2xl shadow-lg hover:shadow-yellow-400/20 transition-all duration-300 hover:scale-105">
                <div className="p-1.5 bg-yellow-400/20 rounded-full group-hover:bg-yellow-400/30 transition-colors duration-300">
                  <Zap className="w-5 h-5 text-yellow-300 group-hover:text-yellow-200 transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                  Evaluación instantánea
                </span>
              </div>
              <div className="group flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-500/10 to-emerald-500/10 backdrop-blur-md border border-green-400/20 rounded-2xl shadow-lg hover:shadow-green-400/20 transition-all duration-300 hover:scale-105">
                <div className="p-1.5 bg-green-400/20 rounded-full group-hover:bg-green-400/30 transition-colors duration-300">
                  <Shield className="w-5 h-5 text-green-300 group-hover:text-green-200 transition-colors duration-300" />
                </div>
                <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors duration-300">
                  100% seguro
                </span>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25">
                  <Link to="/trade-in">
                    <Sparkles className="mr-2 h-5 w-5" />
                    Evaluar mi Trade-In
                  </Link>
                </Button>
              </motion.div>
              

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Dual Sections - Apple World & Premium Electronics */}
      <section id="secciones" className="relative py-12 sm:py-16 lg:py-20">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-800/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Explorá nuestras secciones
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto px-4">
              Dos mundos únicos de tecnología premium diseñados para diferentes experiencias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Apple World Section */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 overflow-hidden">
                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg"
                  >
                    <Apple className="h-8 w-8 sm:h-10 sm:w-10 text-gray-700" />
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Mundo Apple</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed px-2">
                    Descubrí la experiencia Apple completa. iPhone, iPad, Mac, Apple Watch y más. 
                    Diseño minimalista, calidad premium y el ecosistema que ya conocés y amás.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {['iPhone', 'iPad', 'Mac', 'Apple Watch'].map((item, index) => (
                      <motion.span 
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white border-0">
                      <Link to="/apple">
                        Explorar Apple <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Premium Electronics Section */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div className="relative bg-gradient-to-br from-purple-600/20 via-blue-600/20 to-teal-500/20 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 overflow-hidden">
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div className="relative text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="bg-gradient-to-br from-purple-500/30 to-blue-500/30 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-purple-500/25"
                  >
                    <Smartphone className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                  </motion.div>
                  
                  <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">Electrónicos Premium</h3>
                  <p className="text-gray-300 mb-6 leading-relaxed px-2">
                    Descubrí la última tecnología en smartphones, tablets, laptops y accesorios. 
                    Innovación, rendimiento y diseño de las mejores marcas del mundo.
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-6">
                    {['Samsung', 'Google', 'Laptops', 'Accesorios'].map((item, index) => (
                      <motion.span 
                        key={item}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="px-3 py-1 bg-white/20 text-white rounded-full text-sm backdrop-blur-sm"
                      >
                        {item}
                      </motion.span>
                    ))}
                  </div>
                  
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button asChild className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg shadow-purple-500/25">
                      <Link to="/electronics">
                        Explorar Electrónicos <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="relative py-12 sm:py-16 lg:py-20">
        {/* Background with animated gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(168,85,247,0.1),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
              <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                Productos Destacados
              </h2>
              <Star className="h-6 w-6 text-yellow-400 fill-current" />
            </div>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Los productos más populares y mejor valorados por nuestros clientes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Glassmorphic container */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
              <ProductGrid 
                products={featuredProducts}
                section="default"
                showFilters={false}
                itemsPerPage={8}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 sm:py-16 lg:py-20">
        {/* Background with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/50 to-slate-900/50" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              ¿Por qué elegir AscendHub?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Experiencia premium en cada compra con beneficios únicos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: Zap,
                title: "Trade-In Inteligente",
                description: "Evaluamos tu equipo actual y te damos el mejor precio como parte de pago",
                delay: 0.2
              },
              {
                icon: Shield,
                title: "Garantía Premium",
                description: "Todos nuestros productos incluyen garantía extendida y soporte técnico especializado",
                delay: 0.4
              },
              {
                icon: Truck,
                title: "Envío Express",
                description: "Recibí tu nuevo equipo en 24-48hs con envío gratuito en CABA y GBA",
                delay: 0.6
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 sm:p-8 border border-white/20 hover:border-white/30 transition-all duration-300 text-center overflow-hidden">
                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  <div className="relative">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg shadow-blue-500/25"
                    >
                      <feature.icon className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 sm:py-20 lg:py-24 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(59,130,246,0.2),transparent_50%)]" />
        
        {/* Floating particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [-20, 20],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Sparkles className="h-8 w-8 text-yellow-400" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
                ¿Listo para renovar tu tecnología?
              </h2>
              <Sparkles className="h-8 w-8 text-yellow-400" />
            </div>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Descubrí la experiencia AscendHub: productos premium, precios justos y el mejor servicio. 
              Tu próximo upgrade te está esperando.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-2xl shadow-purple-500/25 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/products">
                    Explorar Productos <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/50 px-8 py-4 text-lg font-semibold"
                >
                  <Link to="/trade-in">
                    Evaluar Trade-In <Smartphone className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
