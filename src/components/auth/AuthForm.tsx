import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Mail, Lock, User, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleAuthButton } from './GoogleAuthButton';
import { 
  signInSchema, 
  signUpSchema, 
  validateFieldRealTime,
  validateWithZod,
  type SignInFormData,
  type SignUpFormData 
} from '@/lib/validations';
import { authService, getAuthErrorMessage } from '@/lib/auth';
import { logger } from '@/lib/logger';
import { toast } from '@/hooks/use-toast';
import { getFieldErrorMessage } from '@/utils/validation';

interface AuthFormProps {
  mode: 'signin' | 'signup';
  onSuccess?: () => void;
  onModeChange?: (mode: 'signin' | 'signup') => void;
}

interface FormData {
  email: string;
  password: string;
  name: string;
  confirmPassword: string;
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
    name: '',
    confirmPassword: '',
  });
  const [validationErrors, setValidationErrors] = useState<{field: string, message: string}[]>([]);
  const [fieldValidation, setFieldValidation] = useState<{[key: string]: {isValid: boolean, message?: string}}>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Validación en tiempo real
    if (value.trim()) {
      const schema = mode === 'signin' ? signInSchema : signUpSchema;
      const fieldValidationResult = validateFieldRealTime(schema, name, value, formData);
      
      setFieldValidation(prev => ({
        ...prev,
        [name]: fieldValidationResult
      }));
    } else {
      setFieldValidation(prev => ({
        ...prev,
        [name]: { isValid: false, message: 'Este campo es requerido' }
      }));
    }
    
    // Limpiar errores de validación cuando el usuario empiece a escribir
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (!value.trim()) {
      setFieldValidation(prev => ({
        ...prev,
        [name]: { isValid: false, message: 'Este campo es requerido' }
      }));
    }
  };

  const getFieldValidationClass = (fieldName: string) => {
    const validation = fieldValidation[fieldName];
    if (!validation) return '';
    
    return validation.isValid 
      ? 'border-green-400/50 focus:border-green-400/70 focus:ring-green-400/30' 
      : 'border-red-400/50 focus:border-red-400/70 focus:ring-red-400/30';
  };

  const getFieldIcon = (fieldName: string) => {
    const validation = fieldValidation[fieldName];
    if (!validation || !formData[fieldName as keyof FormData].trim()) return null;
    
    return validation.isValid ? (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-400" aria-hidden="true">
        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
    ) : (
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-400" aria-hidden="true">
        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario con Zod
    const schema = mode === 'signin' ? signInSchema : signUpSchema;
    const validation = validateWithZod(schema, formData);
    
    if (!validation.success) {
      setValidationErrors(validation.errors);
      validation.errors.forEach(error => {
        toast({
          title: "Error de validación",
          description: error.message,
          variant: "destructive",
        });
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setValidationErrors([]);
    
    try {
      if (mode === 'signin') {
        const result = await authService.signIn({ 
          email: validation.data.email, 
          password: validation.data.password 
        });
        
        if (result.error) {
          throw new Error(getAuthErrorMessage(result.error));
        }
        
        toast({
          title: "¡Bienvenido!",
          description: "Has iniciado sesión correctamente.",
        });
      } else {
        const result = await authService.signUp({
           email: validation.data.email,
           password: validation.data.password,
           fullName: (validation.data as any).name
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
          {mode === 'signup' ? 'Crear cuenta' : 'Iniciar sesión'}
        </CardTitle>
        <CardDescription className="text-center text-white/95 font-medium">
          {mode === 'signup'
            ? 'Crea tu cuenta para comenzar a usar AscendHub'
            : 'Ingresa a tu cuenta de AscendHub'
          }
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Mostrar errores de validación */}
        {validationErrors.length > 0 && (
          <div className="mb-4 p-3 bg-red-50/80 border border-red-200/50 rounded-lg backdrop-blur-sm" role="alert" aria-live="polite">
            <div className="flex items-center gap-2 text-red-700 text-sm font-medium mb-1">
              <AlertCircle className="w-4 h-4" aria-hidden="true" />
              <span>Por favor corrige los siguientes errores:</span>
            </div>
            <ul className="text-red-600 text-sm space-y-1 ml-6">
              {validationErrors.map((error, index) => (
                <li key={index}>{getFieldErrorMessage(error.field, error.message)}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <User className="w-4 h-4" aria-hidden="true" />
                Nombre completo
                <span className="text-red-400" aria-label="Campo requerido">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`h-12 sm:h-14 text-base sm:text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 transition-all duration-300 pr-10 ${getFieldValidationClass('name')}`}
                  placeholder="Ingresa tu nombre completo"
                  required
                  aria-describedby={fieldValidation.name?.message ? "name-error" : undefined}
                  aria-invalid={fieldValidation.name ? !fieldValidation.name.isValid : undefined}
                />
                {getFieldIcon('name')}
              </div>
              {fieldValidation.name?.message && !fieldValidation.name.isValid && (
                <p id="name-error" className="text-red-400 text-sm mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {fieldValidation.name.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Mail className="w-4 h-4" aria-hidden="true" />
              Correo electrónico
              <span className="text-red-400" aria-label="Campo requerido">*</span>
            </Label>
            <div className="relative">
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`h-12 sm:h-14 text-base sm:text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 transition-all duration-300 pr-10 ${getFieldValidationClass('email')}`}
                placeholder="tu@email.com"
                required
                aria-describedby={fieldValidation.email?.message ? "email-error" : undefined}
                aria-invalid={fieldValidation.email ? !fieldValidation.email.isValid : undefined}
              />
              {getFieldIcon('email')}
            </div>
            {fieldValidation.email?.message && !fieldValidation.email.isValid && (
              <p id="email-error" className="text-red-400 text-sm mt-1 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {fieldValidation.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <Lock className="w-4 h-4" aria-hidden="true" />
              Contraseña
              <span className="text-red-400" aria-label="Campo requerido">*</span>
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className={`h-12 sm:h-14 text-base sm:text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 transition-all duration-300 pr-20 ${getFieldValidationClass('password')}`}
                placeholder="••••••••"
                required
                aria-describedby={fieldValidation.password?.message ? "password-error" : "password-help"}
                aria-invalid={fieldValidation.password ? !fieldValidation.password.isValid : undefined}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {mode === 'signup' && !fieldValidation.password?.message && (
              <p id="password-help" className="text-gray-400 text-xs mt-1">
                Mínimo 8 caracteres, incluye mayúscula, minúscula y número
              </p>
            )}
            {fieldValidation.password?.message && !fieldValidation.password.isValid && (
              <p id="password-error" className="text-red-400 text-sm mt-1 flex items-center gap-1" role="alert">
                <AlertCircle className="w-3 h-3" aria-hidden="true" />
                {fieldValidation.password.message}
              </p>
            )}
          </div>

          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-200 flex items-center gap-2">
                <Lock className="w-4 h-4" aria-hidden="true" />
                Confirmar contraseña
                <span className="text-red-400" aria-label="Campo requerido">*</span>
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className={`h-12 sm:h-14 text-base sm:text-lg bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/15 transition-all duration-300 pr-20 ${getFieldValidationClass('confirmPassword')}`}
                  placeholder="••••••••"
                  required
                  aria-describedby={fieldValidation.confirmPassword?.message ? "confirm-password-error" : undefined}
                  aria-invalid={fieldValidation.confirmPassword ? !fieldValidation.confirmPassword.isValid : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400/50"
                  aria-label={showConfirmPassword ? "Ocultar confirmación de contraseña" : "Mostrar confirmación de contraseña"}
                  tabIndex={0}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {fieldValidation.confirmPassword?.message && !fieldValidation.confirmPassword.isValid && (
                <p id="confirm-password-error" className="text-red-400 text-sm mt-1 flex items-center gap-1" role="alert">
                  <AlertCircle className="w-3 h-3" aria-hidden="true" />
                  {fieldValidation.confirmPassword.message}
                </p>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full h-12 sm:h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:ring-2 focus:ring-purple-400/50 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="flex items-center justify-center gap-2">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{mode === 'signin' ? 'INICIAR SESIÓN' : 'CREAR CUENTA'}</span>
              )}
            </span>
          </Button>
        </form>

        {/* Social Authentication Section */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <span className="w-full border-t border-white/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 px-3 text-white/80 font-medium">
              O continúa con
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <GoogleAuthButton
            mode={mode}
            isLoading={isLoading}
            onSuccess={onSuccess}
          />
          
          <Button
            variant="outline"
            size="lg"
            disabled={isLoading}
            className="w-full h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] rounded-xl text-sm font-medium focus:ring-2 focus:ring-white/30 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            onClick={() => toast({ title: "Próximamente", description: "Autenticación con GitHub estará disponible pronto" })}
            aria-label="Continuar con GitHub"
          >
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continuar con GitHub
          </Button>
        </div>

        {/* Navigation and Actions Section */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          {/* Mode Switch */}
          <div className="text-center">
            <span className="text-white/95 font-medium text-sm sm:text-base">
              {mode === 'signin' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
            </span>{' '}
            <button
              type="button"
              onClick={() => onModeChange?.(mode === 'signin' ? 'signup' : 'signin')}
              className="text-blue-300 hover:text-blue-100 font-semibold hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1"
              disabled={isLoading}
            >
              {mode === 'signin' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>

          {/* Forgot Password (solo para login) */}
          {mode === 'signin' && (
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-white/80 hover:text-blue-300 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded px-1 font-medium"
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
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthForm;