import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CartProvider, useCart, useCartActions } from '../../contexts/CartContext';
import { mockProduct } from '../utils';

// Componente de prueba para acceder al contexto
function TestComponent() {
  const { state } = useCart();
  const { addItem, updateQuantity, removeItem } = useCartActions();

  return (
    <div>
      <div data-testid="item-count">{state.items.length}</div>
      <div data-testid="total">{state.total}</div>
      <div data-testid="wishlist-count">{state.wishlist.length}</div>
      <div data-testid="comparison-count">{state.comparison.length}</div>
      
      <button onClick={() => addItem(mockProduct, 1)}>
        Add to Cart
      </button>
      <button onClick={() => updateQuantity(mockProduct.id, 2)}>
        Update Quantity
      </button>
      <button onClick={() => removeItem(mockProduct.id)}>
        Remove from Cart
      </button>
    </div>
  );
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
)

describe('CartContext', () => {
  beforeEach(() => {
    // Reset any localStorage or sessionStorage if needed
    localStorage.clear();
  });

  it('should render with initial state', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0');
    expect(screen.getByTestId('wishlist-count')).toHaveTextContent('0');
    expect(screen.getByTestId('comparison-count')).toHaveTextContent('0');
  });

  it('should add item to cart', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    await act(async () => {
      await user.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent(mockProduct.price.toString());
  });

  it('should update item quantity', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // First add an item
    await act(async () => {
      await user.click(screen.getByText('Add to Cart'));
    });

    // Then update quantity
    await act(async () => {
      await user.click(screen.getByText('Update Quantity'));
    });

    expect(screen.getByTestId('item-count')).toHaveTextContent('1');
    expect(screen.getByTestId('total')).toHaveTextContent((mockProduct.price * 2).toString());
  });

  it('should remove item from cart', async () => {
    const user = userEvent.setup();
    
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    // First add an item
    await act(async () => {
      await user.click(screen.getByText('Add to Cart'));
    });

    expect(screen.getByTestId('item-count')).toHaveTextContent('1');

    // Then remove it
    await act(async () => {
      await user.click(screen.getByText('Remove from Cart'));
    });

    expect(screen.getByTestId('item-count')).toHaveTextContent('0');
    expect(screen.getByTestId('total')).toHaveTextContent('0');
  });
})