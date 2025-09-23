import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthUser } from '@/lib/auth';
import ProtectedRoute from '../ProtectedRoute';
import { useAuth } from '@/hooks/useAuthContext';

// Mock del hook useAuth
vi.mock('@/hooks/useAuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Componente de prueba
const TestComponent = () => <div data-testid="protected-content">Protected Content</div>;

// Mock de usuario completo
const createMockUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  ...overrides,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when requireAuth is true (default)', () => {
    it('should render children when user is authenticated', () => {
      const mockUser = createMockUser();
      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' } as any,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should show loading spinner when auth is loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to auth when user is not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/auth', { replace: true });
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to custom redirect path when provided', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute redirectTo="/login">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    });
  });

  describe('when requireAuth is false', () => {
    it('should render children when user is not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute requireAuth={false}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByTestId('protected-content')).toBeInTheDocument();
    });

    it('should redirect to dashboard when user is authenticated', () => {
      const mockUser = createMockUser();
      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' } as any,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute requireAuth={false}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });

    it('should redirect to custom redirect path when user is authenticated', () => {
      const mockUser = createMockUser();
      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' } as any,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute requireAuth={false} redirectTo="/home">
          <TestComponent />
        </ProtectedRoute>
      );

      expect(mockNavigate).toHaveBeenCalledWith('/home', { replace: true });
    });

    it('should show loading spinner when auth is loading', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute requireAuth={false}>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();
      expect(screen.queryByTestId('protected-content')).not.toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should render loading spinner with correct styling', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: true,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(
        <ProtectedRoute>
          <TestComponent />
        </ProtectedRoute>
      );

      expect(screen.getByText('Verificando autenticación...')).toBeInTheDocument();
    });
  });
});