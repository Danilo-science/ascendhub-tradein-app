import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import AuthForm from '../../components/auth/AuthForm';

// Mock de authService
const mockSignIn = vi.fn();
const mockSignUp = vi.fn();
const mockSignInWithGoogle = vi.fn();

vi.mock('../../lib/auth', () => ({
  authService: {
    signIn: mockSignIn,
    signUp: mockSignUp,
    signInWithGoogle: mockSignInWithGoogle,
  },
  getAuthErrorMessage: vi.fn((error) => error.message || 'Error de autenticación'),
}));

// Mock de toast
const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  toast: mockToast,
}));

// Mock de validation
vi.mock('../../lib/validation', () => ({
  signInSchema: {
    parse: vi.fn((data) => data),
  },
  signUpSchema: {
    parse: vi.fn((data) => data),
  },
  validateWithZod: vi.fn((schema, data) => ({ success: true, data })),
}));

// Mock de GoogleAuthButton
vi.mock('../../components/auth/GoogleAuthButton', () => ({
  default: ({ onSuccess, onError }: { onSuccess: () => void; onError: (error: Error) => void }) => (
    <button 
      data-testid="google-auth-button"
      onClick={() => onSuccess()}
    >
      Continuar con Google
    </button>
  ),
}));

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Lock: () => <div data-testid="lock-icon">Lock</div>,
  User: () => <div data-testid="user-icon">User</div>,
  Loader2: () => <div data-testid="loader-icon">Loader</div>,
  AlertCircle: () => <div data-testid="alert-icon">Alert</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  EyeOff: () => <div data-testid="eye-off-icon">EyeOff</div>,
}));

describe('AuthForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders sign in form', () => {
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('renders sign up form', () => {
    render(<AuthForm mode="signup" onSuccess={mockOnSuccess} />);
    
    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /crear cuenta/i })).toBeInTheDocument();
  });

  it('handles successful sign in', async () => {
    const user = userEvent.setup();
    mockSignIn.mockResolvedValueOnce({ user: { id: '1', email: 'test@example.com' } });
    
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith('test@example.com', 'password123');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Bienvenido',
        description: 'Has iniciado sesión correctamente',
      });
    });
  });

  it('handles sign in error', async () => {
    const user = userEvent.setup();
    const error = new Error('Credenciales inválidas');
    mockSignIn.mockRejectedValueOnce(error);
    
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'wrongpassword');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Error al iniciar sesión',
        description: 'Credenciales inválidas',
        variant: 'destructive',
      });
    });
  });

  it('handles successful sign up', async () => {
    const user = userEvent.setup();
    mockSignUp.mockResolvedValueOnce({ user: { id: '1', email: 'test@example.com' } });
    
    render(<AuthForm mode="signup" onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/nombre completo/i), 'Test User');
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /crear cuenta/i }));
    
    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User');
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Cuenta creada',
        description: 'Tu cuenta ha sido creada exitosamente',
      });
    });
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
    expect(screen.getByText(/la contraseña es requerida/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    const passwordInput = screen.getByLabelText(/contraseña/i);
    const toggleButton = screen.getByTestId('password-toggle');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('shows loading state during authentication', async () => {
    const user = userEvent.setup();
    mockSignIn.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.type(screen.getByLabelText(/contraseña/i), 'password123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));
    
    expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciando sesión/i })).toBeDisabled();
  });

  it('handles Google authentication', async () => {
    const user = userEvent.setup();
    render(<AuthForm mode="signin" onSuccess={mockOnSuccess} />);
    
    await user.click(screen.getByTestId('google-auth-button'));
    
    expect(mockOnSuccess).toHaveBeenCalled();
  });
});