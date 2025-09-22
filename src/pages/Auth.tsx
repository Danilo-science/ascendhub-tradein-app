import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Star, Zap, Shield, Lock } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from '@/hooks/use-toast';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Efecto de seguimiento del mouse para parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Componente de partículas flotantes
  const FloatingParticles = () => {
    const particles = [
      { icon: Sparkles, delay: 0, duration: 6 },
      { icon: Star, delay: 1, duration: 8 },
      { icon: Zap, delay: 2, duration: 7 },
      { icon: Shield, delay: 3, duration: 9 },
      { icon: Lock, delay: 4, duration: 5 },
    ];

    return (
      <>
        {particles.map((particle, index) => {
          const Icon = particle.icon;
          return (
            <div
              key={index}
              className="absolute animate-float opacity-20"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${10 + (index * 20)}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: `${particle.duration}s`,
              }}
            >
              <Icon className="w-6 h-6 text-white/30" />
            </div>
          );
        })}
      </>
    );
  };

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Obtener tab inicial de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'signup' || mode === 'signin') {
      setActiveTab(mode);
    }
  }, [location]);

  const handleAuthSuccess = () => {
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
    // Actualizar URL sin recargar la página
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mode', value);
    window.history.replaceState({}, '', newUrl.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        {/* Elementos animados de fondo mejorados */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-500/30 rounded-full blur-3xl animate-pulse delay-500"></div>
          <div className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          
          {/* Partículas flotantes en loading */}
          <div className="absolute top-20 left-20 animate-bounce delay-300">
            <Sparkles className="w-8 h-8 text-white/40" />
          </div>
          <div className="absolute bottom-32 right-32 animate-bounce delay-700">
            <Star className="w-6 h-6 text-white/40" />
          </div>
          <div className="absolute top-40 right-20 animate-bounce delay-1000">
            <Zap className="w-7 h-7 text-white/40" />
          </div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white/50 backdrop-blur-sm mx-auto mb-4"></div>
          <p className="text-white/70 text-lg font-medium">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden"
    >
      {/* Enhanced responsive background effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient orbs with responsive sizes and improved animations */}
        <motion.div
          className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)',
            filter: 'blur(40px)',
            top: '10%',
            left: '5%',
          }}
          animate={{
            x: [0, 50, 0],
            y: [0, -25, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] rounded-full animate-pulse-glow"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
            filter: 'blur(40px)',
            top: '50%',
            right: '5%',
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, 50, 0],
            scale: [1, 0.9, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
        
        <motion.div
          className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full animate-float"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
            filter: 'blur(30px)',
            bottom: '20%',
            left: '30%',
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, -40, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4,
          }}
        />

        {/* Enhanced geometric patterns with responsive design */}
        <div className="absolute inset-0 opacity-10 sm:opacity-15 lg:opacity-20">
          <motion.div 
            className="absolute top-16 sm:top-20 left-16 sm:left-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping"
            animate={{ scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div 
            className="absolute top-32 sm:top-40 right-24 sm:right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          />
          <motion.div 
            className="absolute bottom-24 sm:bottom-32 left-12 sm:left-16 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-400 rounded-full animate-bounce"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
          <motion.div 
            className="absolute bottom-16 sm:bottom-20 right-16 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-ping"
            animate={{ scale: [0.5, 1.5, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: 2 }}
          />
        </div>

        {/* Interactive grid pattern with enhanced responsiveness */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] sm:opacity-[0.05]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Interactive orbs that respond to mouse movement */}
        <motion.div
          className="absolute w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-60 sm:opacity-80"
          style={{
            left: `${20 + mousePosition.x * 0.02}%`,
            top: `${30 + mousePosition.y * 0.02}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full opacity-50 sm:opacity-70"
          style={{
            right: `${15 + mousePosition.x * 0.015}%`,
            bottom: `${25 + mousePosition.y * 0.015}%`,
          }}
          animate={{
            scale: [0.8, 1.3, 0.8],
            rotate: [360, 0, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Orbes interactivos - Ocultos en móvil, visibles desde tablet */}
        <div className="hidden md:block">
          <div 
            className="absolute top-1/4 right-1/4 w-2 h-2 md:w-3 md:h-3 lg:w-4 lg:h-4 bg-white/40 rounded-full animate-ping"
            style={{ transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` }}
          ></div>
          <div 
            className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 md:w-2 md:h-2 lg:w-3 lg:h-3 bg-purple-400/50 rounded-full animate-ping delay-700"
            style={{ transform: `translate(${mousePosition.x * -0.03}px, ${mousePosition.y * -0.03}px)` }}
          ></div>
          <div 
            className="absolute top-2/3 left-1/4 w-1 h-1 md:w-1.5 md:h-1.5 lg:w-2 lg:h-2 bg-blue-400/60 rounded-full animate-ping delay-1000"
            style={{ transform: `translate(${mousePosition.x * 0.04}px, ${mousePosition.y * 0.04}px)` }}
          ></div>
        </div>

        {/* Partículas flotantes - Simplificadas en móvil */}
        <FloatingParticles />

        {/* Patrones geométricos animados con responsividad */}
        <svg className="absolute inset-0 w-full h-full opacity-5 sm:opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-white/20"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="20%" cy="30%" r="2" fill="currentColor" className="text-purple-400/30 animate-pulse" />
          <circle cx="80%" cy="70%" r="1.5" fill="currentColor" className="text-blue-400/30 animate-pulse delay-500" />
          <circle cx="60%" cy="20%" r="1" fill="currentColor" className="text-indigo-400/30 animate-pulse delay-1000" />
        </svg>
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Botón de regreso */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-start"
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 px-3 py-2 text-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al inicio
          </Button>
        </motion.div>

        {/* Tarjeta principal con glassmorphism mejorado */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto"
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          {/* Efectos decorativos de la tarjeta */}
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl blur-sm opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-20 blur-md animate-pulse"></div>
          
          <Card className="relative bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl overflow-hidden group hover:shadow-purple-500/10 transition-all duration-500 hover:scale-[1.02] hover:border-white/30 focus-within:ring-2 focus-within:ring-purple-500/50 focus-within:ring-offset-2 focus-within:ring-offset-transparent">
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>
            
            <CardHeader className="text-center space-y-3 sm:space-y-4 lg:space-y-6 pb-4 sm:pb-6 lg:pb-8 pt-6 sm:pt-8 lg:pt-10 px-4 sm:px-6 lg:px-8 xl:px-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-2 sm:space-y-3 lg:space-y-4"
              >
                <CardTitle className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent leading-tight animate-gradient-x">
                  {activeTab === 'signin' ? 'Bienvenido de vuelta' : 'Únete a nosotros'}
                </CardTitle>
                <CardDescription className="text-white/70 sm:text-white/80 text-sm sm:text-base lg:text-lg px-2 sm:px-0">
                  {activeTab === 'signin' ? 'Ingresa tus credenciales para continuar' : 'Únete a nuestra plataforma'}
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent className="px-4 sm:px-6 lg:px-8 xl:px-10 pb-6 sm:pb-8 lg:pb-10 space-y-4 sm:space-y-6 lg:space-y-8">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-500 shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 hover:border-white/40 relative group">
                  <div className="absolute inset-x-2 inset-y-1 bg-gradient-to-r from-purple-500/8 via-blue-500/8 to-purple-500/8 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl backdrop-blur-sm"></div>
                  <TabsTrigger 
                    value="signin" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-purple-500/30 text-purple-200 hover:text-white transition-all duration-300 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-purple-400/60 relative group px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="relative z-20 flex items-center gap-2 sm:gap-3">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold">Iniciar sesión</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-purple-400/15 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-xl"></div>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:via-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-blue-500/30 text-purple-200 hover:text-white transition-all duration-300 hover:bg-white/15 focus-visible:ring-2 focus-visible:ring-blue-400/60 relative group px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-medium hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <span className="relative z-20 flex items-center gap-2 sm:gap-3">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-12 transition-transform duration-300" />
                      <span className="font-semibold">Registrarse</span>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-blue-400/15 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-all duration-500 rounded-xl"></div>
                    <div className="absolute inset-0 bg-white/5 opacity-0 group-active:opacity-100 transition-opacity duration-150 rounded-xl"></div>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="signin" className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <AuthForm 
                    mode="signin" 
                    onSuccess={handleAuthSuccess}
                  />
                  
                  {/* Botones sociales mejorados */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                  </div>
                </TabsContent>
                
                <TabsContent value="signup" className="space-y-3 sm:space-y-4 lg:space-y-6">
                  <AuthForm 
                    mode="signup" 
                    onSuccess={handleAuthSuccess}
                  />
                  
                  {/* Botones sociales para registro */}
                  <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                    {/* Separador mejorado */}
                    <div className="relative my-6 sm:my-8 lg:my-10">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-white/20" />
                      </div>
                      <div className="relative flex justify-center text-xs sm:text-sm lg:text-base xl:text-lg">
                        <span className="bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-2 rounded-full text-white/80 font-medium border border-white/10">
                          o regístrate con
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3 sm:gap-4 lg:gap-6">
                      <Button
                        variant="outline"
                        className="h-11 sm:h-12 lg:h-14 xl:h-16 bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-smooth hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-purple-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-xl sm:rounded-2xl lg:rounded-2xl backdrop-blur-sm group text-sm sm:text-base lg:text-lg xl:text-xl"
                      >
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 mr-2 group-hover:scale-110 transition-transform duration-200" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="lg:text-lg xl:text-xl">Continuar con Google</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;