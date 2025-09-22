import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles } from 'lucide-react';
import AuthForm from '@/components/auth/AuthForm';
import { useAuth } from '@/hooks/useAuthContext';
import { toast } from '@/hooks/use-toast';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (!loading && user) {
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  // Obtener modo inicial de la URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlMode = searchParams.get('mode');
    if (urlMode === 'signup' || urlMode === 'signin') {
      setMode(urlMode);
    }
  }, [location]);

  const handleAuthSuccess = () => {
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const toggleMode = () => {
    const newMode = mode === 'signin' ? 'signup' : 'signin';
    setMode(newMode);
    
    // Actualizar URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('mode', newMode);
    window.history.replaceState({}, '', newUrl.toString());
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="relative">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-purple-600 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-8">
        {/* Header con botón de regreso */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Button>
          
          <div className="flex items-center gap-2 text-purple-600">
            <Sparkles className="h-5 w-5" />
            <span className="font-semibold text-sm">AscendHub V2</span>
          </div>
        </div>

        {/* Card principal con diseño mejorado */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-3 text-center pb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {mode === 'signin' ? '¡Bienvenido de vuelta!' : '¡Únete a nosotros!'}
            </CardTitle>
            
            <CardDescription className="text-gray-600 text-lg max-w-sm mx-auto">
              {mode === 'signin' 
                ? 'Accede a tu cuenta y continúa tu experiencia' 
                : 'Crea tu cuenta y descubre todo lo que tenemos para ti'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <AuthForm 
              mode={mode} 
              onSuccess={handleAuthSuccess}
            />
            
            {/* Separador y toggle */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  {mode === 'signin' ? '¿Aún no tienes cuenta?' : '¿Ya tienes una cuenta?'}
                </p>
                
                <Button
                  variant="outline"
                  onClick={toggleMode}
                  className="w-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
                >
                  {mode === 'signin' ? 'Crear nueva cuenta' : 'Iniciar sesión'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer con información adicional */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <span>Seguro y confiable</span>
            <span>•</span>
            <span>Soporte 24/7</span>
            <span>•</span>
            <span>Fácil de usar</span>
          </div>
          
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Al continuar, aceptas nuestros términos de servicio y política de privacidad. 
            Tu información está protegida con encriptación de nivel empresarial.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;