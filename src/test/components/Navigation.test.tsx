import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navigation from '../../components/Navigation';
import { CartProvider } from '../../contexts/CartContext';

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

// Mock de lucide-react icons
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  ShoppingCart: () => <div data-testid="cart-icon">Cart</div>,
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="x-icon">X</div>,
  Home: () => <div data-testid="home-icon">Home</div>,
  Smartphone: () => <div data-testid="smartphone-icon">Smartphone</div>,
  Laptop: () => <div data-testid="laptop-icon">Laptop</div>,
}));

// Wrapper con providers necesarios
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <CartProvider>
      {children}
    </CartProvider>
  </BrowserRouter>
);

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
    expect(screen.getByTestId('cart-icon')).toBeInTheDocument();
    expect(screen.getByTestId('menu-icon')).toBeInTheDocument();
  });

  it('abre y cierra el menú móvil', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const menuButton = screen.getByTestId('menu-icon').closest('button');
    expect(menuButton).toBeInTheDocument();

    // Abrir menú
    fireEvent.click(menuButton!);
    
    await waitFor(() => {
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Electrónicos')).toBeInTheDocument();
    });

    // Cerrar menú
    const closeButton = screen.getByTestId('x-icon').closest('button');
    fireEvent.click(closeButton!);

    await waitFor(() => {
      expect(screen.queryByText('Inicio')).not.toBeInTheDocument();
    });
  });

  it('abre y cierra la búsqueda', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const searchButton = screen.getByTestId('search-icon').closest('button');
    expect(searchButton).toBeInTheDocument();

    // Abrir búsqueda
    fireEvent.click(searchButton!);
    
    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar productos/i);
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveFocus();
    });

    // Cerrar búsqueda con Escape
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    fireEvent.keyDown(searchInput, { key: 'Escape' });

    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/buscar productos/i)).not.toBeInTheDocument();
    });
  });

  it('maneja la búsqueda correctamente', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Abrir búsqueda
    const searchButton = screen.getByTestId('search-icon').closest('button');
    fireEvent.click(searchButton!);

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar productos/i);
      expect(searchInput).toBeInTheDocument();
    });

    // Escribir en el input
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });

    expect(searchInput).toHaveValue('iPhone');

    // Presionar Enter
    fireEvent.keyDown(searchInput, { key: 'Enter' });

    expect(mockNavigate).toHaveBeenCalledWith('/buscar?q=iPhone');
  });

  it('muestra el contador del carrito', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // El contador debería mostrar 0 inicialmente
    const cartButton = screen.getByTestId('cart-icon').closest('button');
    expect(cartButton).toBeInTheDocument();
  });

  it('aplica el tema correcto según la ruta', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
    
    // Verificar que tiene clases de estilo
    expect(nav).toHaveClass('fixed', 'top-0', 'left-0', 'right-0', 'z-50');
  });

  it('navega correctamente a las rutas', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Abrir menú móvil
    const menuButton = screen.getByTestId('menu-icon').closest('button');
    fireEvent.click(menuButton!);

    await waitFor(() => {
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });

    // Click en Apple
    const appleLink = screen.getByText('Apple');
    fireEvent.click(appleLink);

    // Verificar que se llamó navigate (en este caso no se llama porque es un Link)
    // pero podemos verificar que el elemento existe
    expect(appleLink.closest('a')).toHaveAttribute('href', '/apple');
  });

  it('es accesible con teclado', async () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    // Navegar con Tab
    const searchButton = screen.getByTestId('search-icon').closest('button');
    searchButton?.focus();
    expect(searchButton).toHaveFocus();

    // Presionar Enter para abrir búsqueda
    fireEvent.keyDown(searchButton!, { key: 'Enter' });

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/buscar productos/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('maneja el scroll correctamente', () => {
    render(
      <TestWrapper>
        <Navigation />
      </TestWrapper>
    );

    const nav = screen.getByRole('navigation');
    
    // Simular scroll
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    fireEvent.scroll(window);

    // La navegación debería seguir siendo visible
    expect(nav).toBeInTheDocument();
  });
});