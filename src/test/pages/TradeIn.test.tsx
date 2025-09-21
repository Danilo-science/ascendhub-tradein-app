import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TradeIn from '../../pages/TradeIn';
import { CartProvider } from '../../contexts/CartContext';

// Mock de react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock de Supabase
vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      select: vi.fn().mockResolvedValue({ data: [], error: null }),
    }),
  },
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      <CartProvider>
        {component}
      </CartProvider>
    </BrowserRouter>
  );
};

describe('TradeIn Page', () => {
  it('should render trade-in form', () => {
    renderWithProviders(<TradeIn />);
    
    expect(screen.getByText(/Intercambia tu dispositivo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Categoría/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Modelo/i)).toBeInTheDocument();
  });

  it('should update form fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradeIn />);
    
    const categorySelect = screen.getByLabelText(/Categoría/i);
    const brandSelect = screen.getByLabelText(/Marca/i);
    
    await user.selectOptions(categorySelect, 'smartphone');
    await user.selectOptions(brandSelect, 'Apple');
    
    expect(categorySelect).toHaveValue('smartphone');
    expect(brandSelect).toHaveValue('Apple');
  });

  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradeIn />);
    
    const submitButton = screen.getByRole('button', { name: /Obtener cotización/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Por favor completa todos los campos/i)).toBeInTheDocument();
    });
  });

  it('should calculate estimated value based on device condition', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradeIn />);
    
    // Fill form
    await user.selectOptions(screen.getByLabelText(/Categoría/i), 'smartphone');
    await user.selectOptions(screen.getByLabelText(/Marca/i), 'Apple');
    await user.selectOptions(screen.getByLabelText(/Modelo/i), 'iPhone 14');
    await user.selectOptions(screen.getByLabelText(/Estado general/i), 'excelente');
    
    const submitButton = screen.getByRole('button', { name: /Obtener cotización/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Valor estimado/i)).toBeInTheDocument();
    });
  });

  it('should handle image upload', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradeIn />);
    
    const fileInput = screen.getByLabelText(/Subir fotos/i) as HTMLInputElement;
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    
    await user.upload(fileInput, file);
    
    expect(fileInput.files?.[0]).toBe(file);
    expect(fileInput.files).toHaveLength(1);
  });

  it('should show success message after form submission', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TradeIn />);
    
    // Fill complete form
    await user.selectOptions(screen.getByLabelText(/Categoría/i), 'smartphone');
    await user.selectOptions(screen.getByLabelText(/Marca/i), 'Apple');
    await user.selectOptions(screen.getByLabelText(/Modelo/i), 'iPhone 14');
    await user.selectOptions(screen.getByLabelText(/Estado general/i), 'excelente');
    
    const submitButton = screen.getByRole('button', { name: /Obtener cotización/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Cotización enviada exitosamente/i)).toBeInTheDocument();
    });
  });
});