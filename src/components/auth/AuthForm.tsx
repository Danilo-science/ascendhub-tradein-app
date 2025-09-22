import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Mail, Lock, User, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { authService, getAuthErrorMessage } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';
import { validateAuthForm, sanitizeString, ValidationResult } from '@/lib/security';
import GoogleAuthButton from './GoogleAuthButton';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

interface FormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  confirmPassword: string;
  name: string;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  mode,
  onSuccess,
  onModeChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
    name: '',
  });
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = sanitizeString(e.target.value);
    setFormData(prev => ({
      ...prev,
      [e.target.name]: sanitizedValue,
      // Actualizar name cuando se cambien firstName o lastName
      name: e.target.name === 'firstName' || e.target.name === 'lastName' 
        ? `${e.target.name === 'firstName' ? sanitizedValue : prev.firstName} ${e.target.name === 'lastName' ? sanitizedValue : prev.lastName}`.trim()
        : prev.name
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const validateForm = (): boolean => {
    const validation = validateAuthForm({
      email: formData.email,
      password: formData.password,
      name: mode === 'signup' ? formData.name : undefined
    });
    setValidationErrors(validation.errors);
    return validation.isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
     const validation: ValidationResult = validateAuthForm({
       email: formData.email,
       password: formData.password,
       name: mode === 'signup' ? formData.name : undefined
     });
    
    if (!validation.isValid) {
      validation.errors.forEach(error => {
        toast({
          title: "Error de validación",
          description: error,
          variant: "destructive",
        });
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    
    try {
      if (mode === 'signin') {
        const result = await authService.signIn({ 
          email: formData.email, 
          password: formData.password 
        });
        
        if (result.error) {
          throw new Error(getAuthErrorMessage(result.error));
        }
        
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
      } else {
        // Verificar que las contraseñas coincidan
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Las contraseñas no coinciden",
            variant: "destructive",
          });
          return;
        }

        const result = await authService.signUp({
           email: formData.email,
           password: formData.password,
           fullName: formData.name
         });
        
        if (result.error) {
          throw new Error(getAuthErrorMessage(result.error));
        }
        
        toast({
          title: "¡Cuenta creada!",
          description: "Revisa tu email para confirmar tu cuenta.",
        });
      }
      
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isSignUp = mode === 'signup';

  return (
    <Card className="w-full max-w-md mx-auto bg-white/10 backdrop-blur-md border-white/20 shadow-2xl shadow-black/20">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center text-white">
          {isSignUp ? 'Crear cuenta' : 'Iniciar sesión'}
        </CardTitle>
        <CardDescription className="text-center text-gray-200">
          {isSignUp 
            ? 'Crea tu cuenta para comenzar a usar AscendHub'
            : 'Ingresa a tu cuenta de AscendHub'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Google Auth Button */}
        <GoogleAuthButton 
          mode={mode} 
          disabled={isLoading}
        />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full bg-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 px-2 text-gray-200">
              O continúa con email
            </span>
          </div>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div 
            className="bg-red-500/10 backdrop-blur-sm border border-red-400/30 rounded-md p-3"
            role="alert"
            aria-live="polite"
            aria-labelledby="validation-errors-title"
          >
            <div className="flex items-center gap-2 text-red-300">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span id="validation-errors-title" className="text-sm font-medium">Errores de validación:</span>
            </div>
            <ul className="mt-2 text-sm text-red-200 space-y-1" role="list">
              {validationErrors.map((error, index) => (
                <li key={index} className="flex items-center gap-1" role="listitem">
                  <span className="w-1 h-1 bg-red-300 rounded-full" aria-hidden="true" />
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Nombre y Apellido (solo para registro) */}
          {isSignUp && (
            <fieldset className="grid grid-cols-2 gap-4">
              <legend className="sr-only">Información personal</legend>
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-200">
                  Nombre <span className="text-red-400" aria-label="requerido">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Tu nombre"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    disabled={isLoading}
                    required
                    aria-describedby={validationErrors.length > 0 ? "validation-errors-title" : undefined}
                    aria-invalid={validationErrors.length > 0}
                    autoComplete="given-name"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-200">
                  Apellido <span className="text-red-400" aria-label="requerido">*</span>
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Tu apellido"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                    disabled={isLoading}
                    required
                    aria-describedby={validationErrors.length > 0 ? "validation-errors-title" : undefined}
                    aria-invalid={validationErrors.length > 0}
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </fieldset>
          )}

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-200">
              Email <span className="text-red-400" aria-label="requerido">*</span>
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                disabled={isLoading}
                required
                aria-describedby={validationErrors.length > 0 ? "validation-errors-title" : undefined}
                aria-invalid={validationErrors.length > 0}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Contraseña */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-200">
              Contraseña <span className="text-red-400" aria-label="requerido">*</span>
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10 pr-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                disabled={isLoading}
                required
                aria-describedby={validationErrors.length > 0 ? "validation-errors-title" : undefined}
                aria-invalid={validationErrors.length > 0}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                disabled={isLoading}
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Confirmar Contraseña (solo para registro) */}
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-200">
                Confirmar contraseña <span className="text-red-400" aria-label="requerido">*</span>
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-gray-400 focus:border-blue-400/50 focus:ring-blue-400/20 focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent"
                  disabled={isLoading}
                  required
                  aria-describedby={validationErrors.length > 0 ? "validation-errors-title" : undefined}
                  aria-invalid={validationErrors.length > 0}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent" 
            disabled={isLoading}
            aria-describedby={isLoading ? "loading-status" : undefined}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                <span id="loading-status">
                  {isSignUp ? 'Creando cuenta...' : 'Iniciando sesión...'}
                </span>
              </>
            ) : (
              isSignUp ? 'Crear cuenta' : 'Iniciar sesión'
            )}
          </Button>
        </form>

        {/* Mode Switch */}
        <div className="text-center text-sm">
          <span className="text-gray-200">
            {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          </span>{' '}
          <button
            type="button"
            onClick={() => onModeChange?.(isSignUp ? 'signin' : 'signup')}
            className="text-blue-300 hover:text-blue-100 font-medium hover:underline transition-colors duration-200"
            disabled={isLoading}
          >
            {isSignUp ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </div>

        {/* Forgot Password (solo para login) */}
        {!isSignUp && (
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-300 hover:text-blue-300 hover:underline transition-colors duration-200"
              disabled={isLoading}
              onClick={() => {
                // TODO: Implementar modal de reset password
                toast({
                  title: 'Próximamente',
                  description: 'La función de recuperar contraseña estará disponible pronto',
                });
              }}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthForm;