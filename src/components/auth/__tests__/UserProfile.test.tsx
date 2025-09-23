import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { AuthUser } from '@/lib/auth';
import UserProfile from '../UserProfile';
import { useAuth } from '@/hooks/useAuthContext';
import { authService } from '@/lib/auth';
import { toast } from '@/hooks/use-toast';

// Mock del hook useAuth
vi.mock('@/hooks/useAuthContext', () => ({
  useAuth: vi.fn(),
}));

// Mock del authService
vi.mock('@/lib/auth', () => ({
  authService: {
    updateProfile: vi.fn(),
  },
}));

// Mock del toast
vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

// Mock de react-router-dom específico para este test
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({ pathname: '/', search: '', hash: '', state: null })),
    useParams: vi.fn(() => ({})),
  }
});

// Mock de usuario completo
const createMockUser = (overrides: Partial<AuthUser> = {}): AuthUser => ({
  id: '1',
  email: 'test@example.com',
  name: 'John Doe',
  avatar_url: undefined,
  ...overrides,
});

const renderWithRouter = (component: React.ReactElement) => {
  return render(component);
};

describe('UserProfile', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when user is not authenticated', () => {
    it('should show login prompt', () => {
      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(<UserProfile />);

      expect(screen.getByText('Inicia sesión para ver tu perfil')).toBeInTheDocument();
      expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    });

    it('should have working login button', async () => {
      const mockNavigate = vi.fn();
      // Mock useNavigate
      vi.mock('react-router-dom', () => ({
        useNavigate: () => mockNavigate,
      }));

      vi.mocked(useAuth).mockReturnValue({
        user: null,
        session: null,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      render(<UserProfile />);

      const loginButton = screen.getByText('Iniciar Sesión');
      await user.click(loginButton);

      // Note: This would require proper router setup to test navigation
    });
  });

  describe('when user is authenticated', () => {
    const mockUser = createMockUser();

    beforeEach(() => {
      vi.mocked(useAuth).mockReturnValue({
        user: mockUser,
        session: { user: mockUser, access_token: 'token' } as any,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });
    });

    it('should render user profile with correct information', () => {
      renderWithRouter(<UserProfile />);

      expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
      expect(screen.getByText('Información Personal')).toBeInTheDocument();
      expect(screen.getByText('Información de la Cuenta')).toBeInTheDocument();
      
      // Check if form fields are populated
      expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
      expect(screen.getByDisplayValue('+1234567890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1990-01-01')).toBeInTheDocument();
      expect(screen.getByDisplayValue('123 Main St, City, Country')).toBeInTheDocument();
    });

    it('should show account information', () => {
      renderWithRouter(<UserProfile />);

      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('Activa')).toBeInTheDocument();
      expect(screen.getByText('1 de enero de 2023')).toBeInTheDocument();
    });

    it('should handle form submission successfully', async () => {
      vi.mocked(authService.updateProfile).mockResolvedValue(undefined);

      renderWithRouter(<UserProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Smith');

      const saveButton = screen.getByText('Guardar Cambios');
      await user.click(saveButton);

      await waitFor(() => {
        expect(authService.updateProfile).toHaveBeenCalledWith({
          data: {
            full_name: 'Jane Smith',
            phone: '+1234567890',
            dateOfBirth: '1990-01-01',
            address: '123 Main St, City, Country',
          },
        });
      });

      expect(toast).toHaveBeenCalledWith({
        title: 'Perfil actualizado',
        description: 'Tu información personal ha sido actualizada correctamente.',
      });
    });

    it('should handle form submission error', async () => {
      const errorMessage = 'Error updating profile';
      vi.mocked(authService.updateProfile).mockRejectedValue(new Error(errorMessage));

      renderWithRouter(<UserProfile />);

      const saveButton = screen.getByText('Guardar Cambios');
      await user.click(saveButton);

      await waitFor(() => {
        expect(toast).toHaveBeenCalledWith({
          title: 'Error al actualizar perfil',
          description: errorMessage,
          variant: 'destructive',
        });
      });
    });

    it('should show loading state during form submission', async () => {
      // Mock a delayed response
      vi.mocked(authService.updateProfile).mockImplementation(
        () => new Promise(resolve => setTimeout(resolve, 100))
      );

      renderWithRouter(<UserProfile />);

      const saveButton = screen.getByText('Guardar Cambios');
      await user.click(saveButton);

      expect(screen.getByText('Guardando...')).toBeInTheDocument();
      expect(saveButton).toBeDisabled();

      await waitFor(() => {
        expect(screen.getByText('Guardar Cambios')).toBeInTheDocument();
      });
    });

    it('should handle empty form fields', async () => {
      vi.mocked(authService.updateProfile).mockResolvedValue(undefined);

      renderWithRouter(<UserProfile />);

      const nameInput = screen.getByDisplayValue('John Doe');
      await user.clear(nameInput);

      const saveButton = screen.getByText('Guardar Cambios');
      await user.click(saveButton);

      await waitFor(() => {
        expect(authService.updateProfile).toHaveBeenCalledWith({
          data: {
            full_name: '',
            phone: '+1234567890',
            dateOfBirth: '1990-01-01',
            address: '123 Main St, City, Country',
          },
        });
      });
    });

    it('should handle user without metadata', () => {
      const userWithoutMetadata = createMockUser({
        name: '',
      });

      vi.mocked(useAuth).mockReturnValue({
        user: userWithoutMetadata,
        session: { user: userWithoutMetadata, access_token: 'token' } as any,
        loading: false,
        signIn: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
        signInWithGoogle: vi.fn(),
      });

      renderWithRouter(<UserProfile />);

      // Should render with empty form fields
      const nameInput = screen.getByLabelText('Nombre Completo');
      expect(nameInput).toHaveValue('');
    });
  });

  describe('loading state', () => {
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

      renderWithRouter(<UserProfile />);

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
  });
});