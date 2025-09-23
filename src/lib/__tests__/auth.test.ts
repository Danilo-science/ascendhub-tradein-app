import { vi, describe, it, expect, beforeEach } from 'vitest';
import { authService, getAuthErrorMessage } from '../auth';
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError, AuthResponse, AuthTokenResponse, OAuthResponse, UserResponse } from '@supabase/supabase-js';

// Mock types for Supabase responses
type MockAuthResponse = AuthResponse;
type MockOAuthResponse = OAuthResponse;
type MockUserResponse = UserResponse;
type MockUpdateResponse = UserResponse;

const createMockUser = (id: string, email: string): User => ({
  id,
  email,
  aud: 'authenticated',
  role: 'authenticated',
  email_confirmed_at: new Date().toISOString(),
  phone: '',
  confirmed_at: new Date().toISOString(),
  last_sign_in_at: new Date().toISOString(),
  app_metadata: {},
  user_metadata: {},
  identities: [],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

// Helper function to create mock Session
const createMockSession = (user: User): Session => ({
  user,
  access_token: 'token',
  refresh_token: 'refresh_token',
  expires_in: 3600,
  token_type: 'bearer',
  expires_at: Math.floor(Date.now() / 1000) + 3600
});

// Helper function to create mock AuthError
const createMockAuthError = (message: string): AuthError => {
  const error = new AuthError(message);
  error.status = 400;
  return error;
};

// Mock de Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      updateUser: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user successfully', async () => {
      const mockUser = createMockUser('1', 'test@example.com');
      const mockSession = createMockSession(mockUser);
      const mockResponse = { data: { user: mockUser, session: mockSession }, error: null };
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse as MockAuthResponse);

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'password123'
      });

      expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result).toEqual({ 
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.user_metadata?.name,
          avatar_url: mockUser.user_metadata?.avatar_url,
        }, 
        session: mockSession, 
        error: null 
      });
    });

    it('should handle sign in error', async () => {
      const mockError = createMockAuthError('Invalid credentials');
      const mockResponse = { data: { user: null, session: null }, error: mockError };
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue(mockResponse as MockAuthResponse);

      const result = await authService.signIn({
        email: 'test@example.com',
        password: 'wrongpassword'
      });

      expect(result).toEqual({ 
        user: null, 
        session: null, 
        error: expect.objectContaining({
          message: 'Invalid credentials',
          code: 'Invalid credentials'
        })
      });
    });
  });

  describe('signUp', () => {
    it('should sign up user successfully', async () => {
      const mockUser = createMockUser('1', 'test@example.com');
      const mockResponse = { data: { user: mockUser, session: null }, error: null };
      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse as MockAuthResponse);

      const result = await authService.signUp({
        email: 'test@example.com',
        password: 'password123',
        name: 'John Doe'
      });

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        options: {
          data: {
            name: 'John Doe',
          },
        },
      });
      expect(result).toEqual({ 
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.user_metadata?.name,
          avatar_url: mockUser.user_metadata?.avatar_url,
        }, 
        session: null, 
        error: null 
      });
    });

    it('should handle sign up error', async () => {
      const mockError = createMockAuthError('Email already registered');
      const mockResponse = { data: { user: null, session: null }, error: mockError };
      vi.mocked(supabase.auth.signUp).mockResolvedValue(mockResponse as MockAuthResponse);

      const result = await authService.signUp({
        email: 'existing@example.com',
        password: 'password123',
        fullName: 'John Doe'
      });

      expect(result).toEqual({ 
        user: null, 
        session: null, 
        error: expect.objectContaining({
          message: 'Email already registered',
          code: 'Email already registered'
        })
      });
    });
  });

  describe('signInWithGoogle', () => {
    it('should initiate Google OAuth sign in', async () => {
      const mockResponse = { data: { provider: 'google', url: 'https://oauth.url' }, error: null };
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue(mockResponse as MockOAuthResponse);

      const result = await authService.signInWithGoogle();

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      expect(result).toEqual({ user: null, session: null, error: null });
    });

    it('should handle Google sign in error', async () => {
      const mockError = createMockAuthError('OAuth error');
      const mockResponse = { data: { provider: null, url: null }, error: mockError };
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue(mockResponse as MockOAuthResponse);

      const result = await authService.signInWithGoogle();

      expect(result).toEqual({ 
        user: null, 
        session: null, 
        error: expect.objectContaining({
          message: 'OAuth error',
          code: 'OAuth error'
        })
      });
    });
  });

  describe('signOut', () => {
    it('should sign out successfully', async () => {
      const mockResponse = { error: null };
      vi.mocked(supabase.auth.signOut).mockResolvedValue(mockResponse);

      const result = await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should handle sign out error', async () => {
      const mockError = createMockAuthError('Sign out failed');
      const mockResponse = { error: mockError };
      vi.mocked(supabase.auth.signOut).mockResolvedValue(mockResponse);

      const result = await authService.signOut();

      expect(result).toEqual({ 
        error: expect.objectContaining({
          message: 'Sign out failed',
          code: 'Sign out failed'
        })
      });
    });
  });

  describe('getCurrentSession', () => {
    it('should get current session successfully', async () => {
      const mockUser = createMockUser('1', 'test@example.com');
      const mockSession = createMockSession(mockUser);
      const mockResponse = {
        data: {
          session: mockSession,
        },
        error: null,
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentSession();

      expect(supabase.auth.getSession).toHaveBeenCalled();
      expect(result).toEqual({ session: mockSession, error: null });
    });

    it('should handle session error', async () => {
      const mockError = createMockAuthError('Session error');
      const mockResponse = {
        data: { session: null },
        error: mockError,
      };

      vi.mocked(supabase.auth.getSession).mockResolvedValue(mockResponse);

      const result = await authService.getCurrentSession();

      expect(result).toEqual({ 
        session: null, 
        error: expect.objectContaining({
          message: 'Session error',
          code: 'Session error'
        })
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = createMockUser('1', 'test@example.com');
      const mockResponse = { data: { user: mockUser }, error: null };
      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse as MockUserResponse);

      const result = await authService.getCurrentUser();

      expect(supabase.auth.getUser).toHaveBeenCalled();
      expect(result).toEqual({ 
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.user_metadata?.name,
          avatar_url: mockUser.user_metadata?.avatar_url,
        }, 
        error: null 
      });
    });

    it('should handle get user error', async () => {
      const mockError = createMockAuthError('User not found');
      const mockResponse = { data: { user: null }, error: mockError };
      vi.mocked(supabase.auth.getUser).mockResolvedValue(mockResponse as MockUserResponse);

      const result = await authService.getCurrentUser();

      expect(result).toEqual({ 
        user: null, 
        error: expect.objectContaining({
          message: 'User not found',
          code: 'User not found'
        })
      });
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      const mockUser = createMockUser('1', 'test@example.com');
      const mockResponse = { data: { user: mockUser }, error: null };
      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockResponse as MockUpdateResponse);

      const result = await authService.updateProfile({ name: 'New Name' });

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        data: { name: 'New Name' },
      });
      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.user_metadata?.name,
        avatar_url: mockUser.user_metadata?.avatar_url,
      });
    });

    it('should handle update profile error', async () => {
      const mockError = createMockAuthError('Update failed');
      const mockResponse = { data: null, error: mockError };
      vi.mocked(supabase.auth.updateUser).mockResolvedValue(mockResponse as MockUpdateResponse);

      await expect(authService.updateProfile({ name: 'New Name' })).rejects.toThrow('Update failed');

      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        data: { name: 'New Name' },
      });
    });
  });
});

describe('getAuthErrorMessage', () => {
  it('should return specific error message for invalid credentials', () => {
    const error = createMockAuthError('Invalid login credentials');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('Credenciales de inicio de sesión inválidas');
  });

  it('should return specific error message for user already registered', () => {
    const error = createMockAuthError('User already registered');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('El usuario ya está registrado');
  });

  it('should return specific error message for email not confirmed', () => {
    const error = createMockAuthError('Email not confirmed');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('Por favor confirma tu email antes de iniciar sesión');
  });

  it('should return specific error message for weak password', () => {
    const error = createMockAuthError('Password should be at least 6 characters');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('La contraseña debe tener al menos 6 caracteres');
  });

  it('should return specific error message for invalid email', () => {
    const error = createMockAuthError('Invalid email');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('El formato del email no es válido');
  });

  it('should return specific error message for signup disabled', () => {
    const error = createMockAuthError('Signups not allowed for this instance');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('El registro de nuevos usuarios está deshabilitado');
  });

  it('should return generic error message for unknown errors', () => {
    const error = createMockAuthError('Unknown error');
    const result = getAuthErrorMessage(error);
    expect(result).toBe('Ha ocurrido un error inesperado. Por favor intenta de nuevo.');
  });

  it('should handle error without message', () => {
    const error = { message: undefined } as AuthError;
    const result = getAuthErrorMessage(error);
    expect(result).toBe('Ha ocurrido un error inesperado. Por favor intenta de nuevo.');
  });
});