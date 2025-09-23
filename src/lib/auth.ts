import { supabase } from '@/integrations/supabase/client';
import { logger } from './logger';

export interface AuthResult {
  user: AuthUser | null;
  session?: any;
  error: Error | null;
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
}

export interface SignUpData {
  email: string;
  password: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const auth = {
  async signUp({ email, password, name, fullName, firstName, lastName }: SignUpData): Promise<AuthResult> {
    try {
      logger.info('Iniciando registro de usuario');
      
      const displayName = name || fullName || `${firstName || ''} ${lastName || ''}`.trim() || firstName;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName,
          },
        },
      });

      if (error) {
        return { user: null, session: null, error: new AuthError(error.message, error.message) };
      }
      
      if (!data.user) {
        return { user: null, session: null, error: new AuthError('No se pudo crear el usuario') };
      }

      logger.success('Usuario registrado exitosamente');
      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url,
      };
      
      return { user, session: data.session, error: null };
    } catch (error) {
      logger.authError('Error en registro', error);
      return { user: null, session: null, error: error as Error };
    }
  },

  async signIn({ email, password }: SignInData): Promise<AuthResult> {
    try {
      logger.info('Iniciando sesión');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, session: null, error: new AuthError(error.message, error.message) };
      }
      
      if (!data.user) {
        return { user: null, session: null, error: new AuthError('No se pudo iniciar sesión') };
      }

      logger.success('Sesión iniciada exitosamente');
      const user = {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url,
      };
      
      return { user, session: data.session, error: null };
    } catch (error) {
      logger.authError('Error en inicio de sesión', error);
      return { user: null, session: null, error: error as Error };
    }
  },

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { user: null, session: null, error: new AuthError(error.message, error.message) };
      }
      
      // For OAuth, we need to wait for the redirect
      return { user: null, session: null, error: null };
    } catch (error) {
      logger.authError('Error en inicio de sesión con Google', error);
      return { user: null, session: null, error: error as Error };
    }
  },

  async signOut(): Promise<{ error: Error | null }> {
    try {
      logger.info('Cerrando sesión');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: new AuthError(error.message, error.message) };
      }
      
      logger.success('Sesión cerrada exitosamente');
      return { error: null };
    } catch (error) {
      logger.authError('Error cerrando sesión', error);
      return { error: error as Error };
    }
  },

  async getSession(): Promise<AuthUser | null> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw new AuthError(error.message, error.message);
      if (!session?.user) return null;

      return {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.user_metadata?.name,
        avatar_url: session.user.user_metadata?.avatar_url,
      };
    } catch (error) {
      logger.authError('Error obteniendo sesión', error);
      return null;
    }
  },

  async getUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw new AuthError(error.message, error.message);
      if (!user) return null;

      return {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
      };
    } catch (error) {
      logger.authError('Error obteniendo usuario', error);
      return null;
    }
  },

  async getCurrentSession(): Promise<{ session: any; error: Error | null }> {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { session: null, error: new AuthError(error.message, error.message) };
      }

      return { session, error: null };
    } catch (error) {
      logger.authError('Error obteniendo sesión', error);
      return { session: null, error: error as Error };
    }
  },

  async getCurrentUser(): Promise<{ user: AuthUser | null; error: Error | null }> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return { user: null, error: new AuthError(error.message, error.message) };
      }
      
      if (!user) {
        return { user: null, error: null };
      }

      const authUser = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name,
        avatar_url: user.user_metadata?.avatar_url,
      };

      return { user: authUser, error: null };
    } catch (error) {
      logger.authError('Error obteniendo usuario', error);
      return { user: null, error: error as Error };
    }
  },

  async resetPassword(email: string): Promise<void> {
    try {
      logger.info('Enviando email de recuperación');
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      
      if (error) throw new AuthError(error.message, error.message);
      
      logger.success('Email de recuperación enviado');
    } catch (error) {
      logger.authError('Error enviando email de recuperación', error);
      throw error;
    }
  },

  async updatePassword(password: string): Promise<void> {
    try {
      logger.info('Actualizando contraseña');
      
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw new AuthError(error.message, error.message);
      
      logger.success('Contraseña actualizada exitosamente');
    } catch (error) {
      logger.authError('Error actualizando contraseña', error);
      throw error;
    }
  },

  async updateProfile(updates: { name?: string; avatar_url?: string }): Promise<AuthUser> {
    try {
      logger.info('Actualizando perfil');
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });
      
      if (error) throw new AuthError(error.message, error.message);
      if (!data?.user) throw new AuthError('No se pudo actualizar el perfil');

      logger.success('Perfil actualizado exitosamente');
      return {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name,
        avatar_url: data.user.user_metadata?.avatar_url,
      };
    } catch (error) {
      logger.authError('Error actualizando perfil', error);
      throw error;
    }
  },
};

// Export aliases for backward compatibility
export const authService = auth;
export const signIn = auth.signIn;
export const signUp = auth.signUp;

// Error message helper function
export const getAuthErrorMessage = (error: unknown): string => {
  let message = '';
  
  if (error instanceof AuthError) {
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = (error as any).message || '';
  }

  // Handle specific error messages
  if (message.includes('Invalid login credentials') || message.includes('invalid_credentials')) {
    return 'Credenciales de inicio de sesión inválidas';
  }
  
  if (message.includes('User already registered') || message.includes('already_registered')) {
    return 'El usuario ya está registrado';
  }
  
  if (message.includes('Email not confirmed') || message.includes('email_not_confirmed')) {
    return 'Por favor confirma tu email antes de iniciar sesión';
  }
  
  if (message.includes('Password should be at least 6 characters') || message.includes('weak_password')) {
    return 'La contraseña debe tener al menos 6 caracteres';
  }
  
  if (message.includes('Invalid email') || message.includes('invalid_email')) {
    return 'El formato del email no es válido';
  }
  
  if (message.includes('Signups not allowed for this instance') || message.includes('signup_disabled')) {
    return 'El registro de nuevos usuarios está deshabilitado';
  }

  // Return generic message for unknown errors or when message is empty/undefined
  return 'Ha ocurrido un error inesperado. Por favor intenta de nuevo.';
};