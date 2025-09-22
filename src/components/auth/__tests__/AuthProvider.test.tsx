import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { AuthProvider } from '../AuthProvider';
import { useAuth } from '@/hooks/useAuthContext';
import { authService } from '@/lib/auth';
import { User, Session, AuthError } from '@supabase/supabase-js';

// Helper function to create mock User
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

// Mock del authService
vi.mock('@/lib/auth', () => ({
  authService: {
    getCurrentSession: vi.fn(),
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    signInWithGoogle: vi.fn(),
  },
}));

// Mock de Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

// Componente de prueba para usar el hook useAuth
const TestComponent = () => {
  const { user, session, loading, signIn, signUp, signOut, signInWithGoogle } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'loading' : 'not-loading'}</div>
      <div data-testid="user">{user ? user.email : 'no-user'}</div>
      <div data-testid="session">{session ? 'has-session' : 'no-session'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password', 'Test User')}>
        Sign Up
      </button>
      <button onClick={signOut}>Sign Out</button>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should load user session on mount', async () => {
    const mockUser = createMockUser('1', 'test@example.com');
    const mockSession = createMockSession(mockUser);

    vi.mocked(authService.getCurrentSession).mockResolvedValue({
      session: mockSession,
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Inicialmente debe estar cargando
    expect(screen.getByTestId('loading')).toHaveTextContent('loading');

    // Esperar a que termine la carga
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    expect(screen.getByTestId('session')).toHaveTextContent('has-session');
  });

  it('should handle sign in', async () => {
    const mockUser = createMockUser('1', 'test@example.com');
    const mockSession = createMockSession(mockUser);

    vi.mocked(authService.getCurrentSession).mockResolvedValue({
      session: null,
      error: null,
    });

    vi.mocked(authService.signIn).mockResolvedValue({
      user: mockUser,
      session: mockSession,
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    const signInButton = screen.getByText('Sign In');
    
    await act(async () => {
      signInButton.click();
    });

    expect(authService.signIn).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    });
  });

  it('should handle sign up', async () => {
    const mockUser = createMockUser('1', 'test@example.com');
    const mockSession = createMockSession(mockUser);

    vi.mocked(authService.getCurrentSession).mockResolvedValue({
      session: null,
      error: null,
    });

    vi.mocked(authService.signUp).mockResolvedValue({
      user: mockUser,
      session: mockSession,
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    const signUpButton = screen.getByText('Sign Up');
    
    await act(async () => {
      signUpButton.click();
    });

    expect(authService.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      fullName: 'Test User',
    });
  });

  it('should handle sign out', async () => {
    const mockUser = createMockUser('1', 'test@example.com');
    const mockSession = createMockSession(mockUser);

    vi.mocked(authService.getCurrentSession).mockResolvedValue({
      session: mockSession,
      error: null,
    });

    vi.mocked(authService.signOut).mockResolvedValue({
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    const signOutButton = screen.getByText('Sign Out');
    
    await act(async () => {
      signOutButton.click();
    });

    expect(authService.signOut).toHaveBeenCalled();
  });

  it('should handle Google sign in', async () => {
    vi.mocked(authService.getCurrentSession).mockResolvedValue({
      session: null,
      error: null,
    });

    vi.mocked(authService.signInWithGoogle).mockResolvedValue({
      user: null,
      session: null,
      error: null,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    const googleSignInButton = screen.getByText('Sign In with Google');
    
    await act(async () => {
      googleSignInButton.click();
    });

    expect(authService.signInWithGoogle).toHaveBeenCalled();
  });

  it('should handle authentication errors', async () => {
    const mockError = createMockAuthError('Authentication failed');

    vi.mocked(authService.getCurrentSession).mockResolvedValue({
      session: null,
      error: mockError,
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('not-loading');
    });

    expect(screen.getByTestId('user')).toHaveTextContent('no-user');
    expect(screen.getByTestId('session')).toHaveTextContent('no-session');
  });
});