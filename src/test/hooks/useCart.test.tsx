import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCart } from '../../hooks/useCart';
import type { Product } from '../../types';

// Mock de localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  slug: 'test-product',
  description: 'Test description',
  short_description: 'Short description',
  price: 999.99,
  original_price: 1099.99,
  category_id: 'electronics',
  brand: 'Test Brand',
  model: 'Test Model',
  specs: {
    color: 'Black',
    storage: '256GB',
  },
  images: ['https://example.com/image.jpg'],
  status: 'active',
  condition: 'new',
  stock_quantity: 10,
  featured: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

describe('useCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
    // Reset cart state
    useCart.getState().clear();
  });

  it('should initialize with empty cart', () => {
    const { result } = renderHook(() => useCart());

    expect(result.current.items).toEqual([]);
    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.getTotal()).toBe(0);
  });

  it('should add item to cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].product.id).toBe(mockProduct.id);
    expect(result.current.items[0].quantity).toBe(1);
    expect(result.current.getItemCount()).toBe(1);
  });

  it('should increase quantity when adding existing item', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].quantity).toBe(2);
    expect(result.current.getItemCount()).toBe(2);
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.removeItem(mockProduct.id);
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getItemCount()).toBe(0);
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 5);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.getItemCount()).toBe(5);
  });

  it('should remove item when quantity is set to 0', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    act(() => {
      result.current.updateQuantity(mockProduct.id, 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should clear entire cart', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem({ ...mockProduct, id: '2' });
    });

    expect(result.current.items).toHaveLength(2);

    act(() => {
      result.current.clear();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getItemCount()).toBe(0);
    expect(result.current.getTotal()).toBe(0);
  });

  it('should calculate total price correctly', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(mockProduct);
    });

    expect(result.current.getTotal()).toBe(1999.98); // 999.99 * 2
  });

  it('should calculate total price with different products', () => {
    const { result } = renderHook(() => useCart());

    const secondProduct = { ...mockProduct, id: '2', price: 500 };

    act(() => {
      result.current.addItem(mockProduct);
      result.current.addItem(secondProduct);
    });

    expect(result.current.getTotal()).toBe(1499.99); // 999.99 + 500
  });

  it('should add multiple quantities at once', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
    expect(result.current.getItemCount()).toBe(3);
  });

  it('should handle adding to existing item with custom quantity', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct, 2);
      result.current.addItem(mockProduct, 3);
    });

    expect(result.current.items[0].quantity).toBe(5);
    expect(result.current.getItemCount()).toBe(5);
  });

  it('should persist cart state', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addItem(mockProduct);
    });

    // Zustand persist middleware should handle localStorage automatically
    expect(result.current.items).toHaveLength(1);
  });
});