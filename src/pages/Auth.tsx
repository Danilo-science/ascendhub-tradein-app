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

  // Handle mouse movement for interactive effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !loading) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Set active tab based on URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const mode = searchParams.get('mode');
    if (mode === 'signup') {
      setActiveTab('signup');
    }
  }, [location]);

  const handleAuthSuccess = () => {
    navigate('/dashboard');
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'signin' | 'signup');
    const newUrl = value === 'signup' ? '/auth?mode=signup' : '/auth';
    window.history.replaceState({}, '', newUrl);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden">
        {/* Animated background for loading */}
        <div className="absolute inset-0">
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-purple-500/20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ top: '20%', left: '10%', filter: 'blur(40px)' }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-blue-500/20"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            style={{ bottom: '20%', right: '10%', filter: 'blur(40px)' }}
          />
        </div>
        
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full mx-auto mb-4"
          />
          <p className="text-white/70">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 overflow-hidden"
    >
      {/* Enhanced animated background */}
      <div className="absolute inset-0">
        {/* Gradient orbs with improved responsiveness */}
        <motion.div
          className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] lg:w-[600px] lg:h-[600px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0.1) 40%, transparent 70%)',
            filter: 'blur(40px) sm:blur(50px) lg:blur(60px)',
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
          initial={{ top: '10%', left: '5%' }}
        />
        
        <motion.div
          className="absolute w-[250px] h-[250px] sm:w-[350px] sm:h-[350px] lg:w-[500px] lg:h-[500px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)',
            filter: 'blur(40px) sm:blur(50px) lg:blur(60px)',
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
          initial={{ top: '50%', right: '5%' }}
        />

        <motion.div
          className="absolute w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(236, 72, 153, 0.1) 40%, transparent 70%)',
            filter: 'blur(30px) sm:blur(40px) lg:blur(50px)',
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
          initial={{ bottom: '20%', left: '30%' }}
        />

        {/* Enhanced geometric patterns */}
        <div className="absolute inset-0 opacity-10 sm:opacity-15 lg:opacity-20">
          <div className="absolute top-16 sm:top-20 left-16 sm:left-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute top-32 sm:top-40 right-24 sm:right-32 w-1 h-1 bg-blue-400 rounded-full animate-pulse" />
          <div className="absolute bottom-24 sm:bottom-32 left-12 sm:left-16 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-pink-400 rounded-full animate-bounce" />
          <div className="absolute bottom-16 sm:bottom-20 right-16 sm:right-20 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl mx-auto space-y-6 sm:space-y-8">
        {/* Back button */}
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

        {/* Enhanced main auth card with improved responsive glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative z-10 w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-md mx-auto"
        >
          <div className="backdrop-blur-xl sm:backdrop-blur-2xl bg-white/10 sm:bg-white/15 border border-white/20 sm:border-white/30 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl sm:shadow-2xl shadow-black/20 sm:shadow-black/30 relative overflow-hidden"
               style={{ 
                 boxShadow: 'rgba(0, 0, 0, 0.3) 0px 15px 30px -8px, rgba(0, 0, 0, 0.4) 0px 25px 50px -12px'
               }}>
            
            {/* Enhanced shimmer effect */}
            <motion.div 
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 sm:via-white/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                repeatDelay: 5,
                ease: "easeInOut" 
              }}
            />

            {/* Enhanced header section */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-center mb-6 sm:mb-8 relative z-10"
            >
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl sm:rounded-2xl relative" tabIndex={0} role="img" aria-label="Icono de bienvenida">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-white" aria-hidden="true" />
                  </motion.div>
                  
                  {/* Enhanced decorative dots - responsive */}
                  <motion.div 
                    className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full"
                    animate={{ scale: [0.8, 1.2, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    aria-hidden="true"
                  />
                  <motion.div 
                    className="absolute -bottom-0.5 sm:-bottom-1 -left-0.5 sm:-left-1 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full"
                    animate={{ scale: [0.2, 1, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                    aria-hidden="true"
                  />
                </div>
              </div>
              
              <motion.h1 
                className="text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent mb-2 sm:mb-3 font-bold"
                animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: '200% 200%' }}
              >
                Bienvenido de vuelta
              </motion.h1>
              
              <p className="text-white/90 sm:text-white/95 text-sm sm:text-base lg:text-lg px-2 sm:px-0 font-medium">
                Ingresa tus credenciales para continuar
              </p>
            </motion.div>

            {/* Enhanced form section with motion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="relative z-10"
            >
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8 bg-white/5 sm:bg-white/10 backdrop-blur-sm border border-white/10 sm:border-white/20 rounded-xl sm:rounded-2xl p-1 sm:p-1.5" role="tablist" aria-label="Opciones de autenticación">
                  <TabsTrigger 
                    value="signin" 
                    className="text-white/90 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:shadow-lg rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base py-3 sm:py-4 font-medium"
                    role="tab"
                    aria-selected={activeTab === 'signin'}
                  >
                    Iniciar sesión
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signup" 
                    className="text-white/90 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:shadow-lg rounded-lg sm:rounded-xl transition-all duration-300 text-sm sm:text-base py-3 sm:py-4 font-medium"
                    role="tab"
                    aria-selected={activeTab === 'signup'}
                  >
                    Registrarse
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4 sm:space-y-6" role="tabpanel" aria-labelledby="signin-tab">
                  <AuthForm 
                    mode="signin" 
                    onSuccess={handleAuthSuccess}
                    onModeChange={handleTabChange}
                  />
                </TabsContent>

                <TabsContent value="signup" className="space-y-4 sm:space-y-6" role="tabpanel" aria-labelledby="signup-tab">
                  <AuthForm 
                    mode="signup" 
                    onSuccess={handleAuthSuccess}
                    onModeChange={handleTabChange}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;