import { supabase } from '@/integrations/supabase/client';
import { AuthError, User, Session } from '@supabase/supabase-js';

// Tipos para autenticación
export interface AuthResponse {
  user: User | null;
  session: Session | null;
  error: AuthError | null;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

// Funciones de autenticación con email/password
export const authService = {
  // Registro con email y contraseña
  async signUp({ email, password, firstName, lastName, fullName }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName || `${firstName || ''} ${lastName || ''}`.trim(),
            avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
          },
        },
      });

      return { user: data.user, session: data.session, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, session: null, error: error as AuthError };
    }
  },

  // Inicio de sesión con email y contraseña
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { user: data.user, session: data.session, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, session: null, error: error as AuthError };
    }
  },

  // Inicio de sesión con Google OAuth
  async signInWithGoogle(): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      return { user: null, session: null, error };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { user: null, session: null, error: error as AuthError };
    }
  },

  // Cerrar sesión
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: error as AuthError };
    }
  },

  // Obtener sesión actual
  async getCurrentSession(): Promise<{ session: Session | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getSession();
      return { session: data.session, error };
    } catch (error) {
      console.error('Get session error:', error);
      return { session: null, error: error as AuthError };
    }
  },

  // Obtener usuario actual
  async getCurrentUser(): Promise<{ user: User | null; error: AuthError | null }> {
    try {
      const { data, error } = await supabase.auth.getUser();
      return { user: data.user, error };
    } catch (error) {
      console.error('Get user error:', error);
      return { user: null, error: error as AuthError };
    }
  },

  // Resetear contraseña
  async resetPassword(email: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      return { error };
    } catch (error) {
      console.error('Reset password error:', error);
      return { error: error as AuthError };
    }
  },

  // Actualizar contraseña
  async updatePassword(password: string): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser({ password });
      return { error };
    } catch (error) {
      console.error('Update password error:', error);
      return { error: error as AuthError };
    }
  },

  // Actualizar perfil de usuario
  async updateProfile(updates: { 
    email?: string; 
    data?: { 
      first_name?: string; 
      last_name?: string; 
      full_name?: string; 
      avatar_url?: string;
      phone?: string;
      dateOfBirth?: string;
      address?: string;
    } 
  }): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.updateUser(updates);
      return { error };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error: error as AuthError };
    }
  },
};

// Utilidades para manejo de errores de autenticación
export const getAuthErrorMessage = (error: AuthError | null): string => {
  if (!error) return '';

  switch (error.message) {
    case 'Invalid login credentials':
      return 'Credenciales de inicio de sesión inválidas';
    case 'User already registered':
      return 'El usuario ya está registrado';
    case 'Email not confirmed':
      return 'Email no confirmado. Revisa tu bandeja de entrada';
    case 'Password should be at least 6 characters':
      return 'La contraseña debe tener al menos 6 caracteres';
    case 'Invalid email':
      return 'Email inválido';
    case 'Signup requires a valid password':
      return 'El registro requiere una contraseña válida';
    default:
      return error.message || 'Ha ocurrido un error inesperado';
  }
};

// Hook personalizado para autenticación
export const useSupabaseAuth = () => {
  return {
    ...authService,
    getErrorMessage: getAuthErrorMessage,
  };
};