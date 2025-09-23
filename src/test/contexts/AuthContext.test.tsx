import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../hooks/useAuth';
import { authService } from '../../lib/auth';

// Mock del servicio de autenticación
vi.mock('../../lib/auth', () => ({
  authService: {
    signIn: vi.fn(),
    signUp: vi.fn(),
    signOut: vi.fn(),
    getCurrentSession: vi.fn(),
  },
}));

// Mock de Supabase
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      getSession: vi.fn(),
    },
  },
}));

// Componente de prueba para usar el hook useAuth
const TestComponent = () => {
  const { user, session, signIn, signUp, signOut, loading } = useAuth();
  
  return (
    <div>
      <div data-testid="loading">{loading ? 'Loading' : 'Not Loading'}</div>
      <div data-testid="user">{user ? user.email : 'No User'}</div>
      <div data-testid="session">{session ? 'Has Session' : 'No Session'}</div>
      <button onClick={() => signIn('test@example.com', 'password')}>
        Sign In
      </button>
      <button onClick={() => signUp('test@example.com', 'password', 'Test User')}>
        Sign Up
      </button>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock del estado inicial de Supabase
    const { supabase } = require('../../integrations/supabase/client');
    supabase.auth.getSession.mockResolvedValue({ data: { session: null } });
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      callback('SIGNED_OUT', null);
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });
  });

  it('provides initial auth state', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('user')).toHaveTextContent('No User');
    expect(screen.getByTestId('session')).toHaveTextContent('No Session');
    expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
  });

  it('handles successful sign in', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    (authService.signIn as any).mockResolvedValue({
      user: mockUser,
      session: { user: mockUser, access_token: 'token' },
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    await user.click(signInButton);

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
    });
  });

  it('handles sign in error', async () => {
    const user = userEvent.setup();
    const mockError = { message: 'Invalid credentials' };

    (authService.signIn as any).mockResolvedValue({
      user: null,
      session: null,
      error: mockError
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    await user.click(signInButton);

    await waitFor(() => {
      expect(authService.signIn).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password' 
      });
    });
  });

  it('handles successful sign up', async () => {
    const user = userEvent.setup();
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    (authService.signUp as any).mockResolvedValue({
      user: mockUser,
      session: null,
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(authService.signUp).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password', 
        firstName: undefined,
        lastName: undefined
      });
    });
  });

  it('handles sign up error', async () => {
    const user = userEvent.setup();
    const mockError = { message: 'Email already exists' };

    (authService.signUp as any).mockResolvedValue({
      user: null,
      session: null,
      error: mockError
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText('Sign Up');
    await user.click(signUpButton);

    await waitFor(() => {
      expect(authService.signUp).toHaveBeenCalledWith({ 
        email: 'test@example.com', 
        password: 'password', 
        firstName: undefined,
        lastName: undefined
      });
    });
  });

  it('handles sign out', async () => {
    const user = userEvent.setup();

    (authService.signOut as any).mockResolvedValue({
      error: null
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signOutButton = screen.getByText('Sign Out');
    await user.click(signOutButton);

    await waitFor(() => {
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  it('handles sign out error', async () => {
    const user = userEvent.setup();
    const mockError = { message: 'Sign out failed' };

    (authService.signOut as any).mockResolvedValue({
      error: mockError
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signOutButton = screen.getByText('Sign Out');
    await user.click(signOutButton);

    await waitFor(() => {
      expect(authService.signOut).toHaveBeenCalled();
    });
  });

  it('updates auth state when user changes', async () => {
    let authStateCallback: (event: string, session: any) => void;
    
    const { supabase } = require('../../integrations/supabase/client');
    supabase.auth.onAuthStateChange.mockImplementation((callback) => {
      authStateCallback = callback;
      return { data: { subscription: { unsubscribe: vi.fn() } } };
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Inicialmente no hay usuario
    expect(screen.getByTestId('user')).toHaveTextContent('No User');

    // Simular cambio de estado de autenticación
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      user_metadata: { name: 'Test User' }
    };

    const mockSession = {
      user: mockUser,
      access_token: 'token'
    };

    await waitFor(() => {
      authStateCallback!('SIGNED_IN', mockSession);
    });

    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com');
    });
  });

  it('shows loading state during authentication', async () => {
    const user = userEvent.setup();
    
    // Mock que tarda en resolver
    (authService.signIn as any).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 100))
    );

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText('Sign In');
    await user.click(signInButton);

    // Debería mostrar loading inmediatamente
    expect(screen.getByTestId('loading')).toHaveTextContent('Loading');

    // Esperar a que termine la operación
    await waitFor(() => {
      expect(screen.getByTestId('loading')).toHaveTextContent('Not Loading');
    }, { timeout: 200 });
  });

  it('cleans up auth state listener on unmount', () => {
    const mockCleanup = vi.fn();
    const { supabase } = require('../../integrations/supabase/client');
    supabase.auth.onAuthStateChange.mockReturnValue({ 
      data: { subscription: { unsubscribe: mockCleanup } } 
    });

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    unmount();

    expect(mockCleanup).toHaveBeenCalled();
  });
});