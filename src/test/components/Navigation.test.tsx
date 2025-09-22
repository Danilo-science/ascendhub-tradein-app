import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Navigation from '../../components/Navigation';
import { BrowserRouter } from 'react-router-dom';

// Mock de react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' }),
  };
});

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  ShoppingCart: () => <div data-testid="shopping-cart-icon">ShoppingCart</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
  Search: () => <div data-testid="search-icon">Search</div>,
  User: () => <div data-testid="user-icon">User</div>,
}));

// Mock de next-themes
const mockSetTheme = vi.fn();
const mockTheme = 'light';
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockTheme,
    setTheme: mockSetTheme,
    resolvedTheme: mockTheme,
  }),
}));

// Mock de framer-motion
interface MotionProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

vi.mock('framer-motion', () => ({
  motion: {
    nav: ({ children, ...props }: MotionProps) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: MotionProps) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: MotionProps) => <span {...props}>{children}</span>,
  },
}));

// Mock de motion/react
vi.mock('motion/react', () => ({
  motion: {
    nav: ({ children, ...props }: MotionProps) => <nav {...props}>{children}</nav>,
    div: ({ children, ...props }: MotionProps) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: MotionProps) => <button {...props}>{children}</button>,
    span: ({ children, ...props }: MotionProps) => <span {...props}>{children}</span>,
  },
}));

// Mock de useIsMobile
vi.mock('../../hooks/use-mobile', () => ({
  useIsMobile: () => false,
}));

// Mock de CartContext
const mockCartValue = {
  state: {
    items: [],
    total: 0,
  },
  addItem: vi.fn(),
  removeItem: vi.fn(),
  updateQuantity: vi.fn(),
  clearCart: vi.fn(),
};

vi.mock('../../contexts/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useCart: () => mockCartValue,
}));

// Mock de AuthProvider
const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
};

const mockAuthValue = {
  user: mockUser,
  login: vi.fn(),
  logout: vi.fn(),
  loading: false,
};

vi.mock('../../components/auth/AuthProvider', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  useAuth: () => mockAuthValue,
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <BrowserRouter>
      <div className="light">
        {children}
      </div>
    </BrowserRouter>
  );
};

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza correctamente', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    expect(screen.getByText('AscendHub')).toBeInTheDocument();
    expect(screen.getByTestId('search-icon')).toBeInTheDocument();
    expect(screen.getByTestId('shopping-cart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });
});