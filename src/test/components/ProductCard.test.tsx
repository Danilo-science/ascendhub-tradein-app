import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '../utils'
import { ProductCard } from '@/components/ProductCard'
import { mockProduct } from '../utils'

// Mock del hook useCartActions
vi.mock('@/contexts/CartContext', () => ({
  useCartActions: () => ({
    addToCart: vi.fn(),
    addToWishlist: vi.fn(),
    addToComparison: vi.fn(),
    isInWishlist: vi.fn(() => false),
    isInComparison: vi.fn(() => false),
    isInCart: vi.fn(() => false),
    getCartItemQuantity: vi.fn(() => 0),
    removeFromCart: vi.fn(),
    removeFromWishlist: vi.fn(),
    removeFromComparison: vi.fn(),
    showNotification: vi.fn(),
  })
}))

describe('ProductCard', () => {
  it('renderiza correctamente la información del producto', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText(mockProduct.title)).toBeInTheDocument()
    expect(screen.getByText(`$${mockProduct.price}`)).toBeInTheDocument()
    expect(screen.getByText(`$${mockProduct.original_price}`)).toBeInTheDocument()
    expect(screen.getByText(`${mockProduct.rating?.average}`)).toBeInTheDocument()
    expect(screen.getByText(`(${mockProduct.rating?.count})`)).toBeInTheDocument()
  })

  it('muestra el badge de descuento cuando hay precio original', () => {
    render(<ProductCard product={mockProduct} />)
    
    const discount = mockProduct.discount_percentage
    expect(screen.getByText(`-${discount}%`)).toBeInTheDocument()
  })

  it('muestra "Agotado" cuando el producto no está en stock', () => {
    const outOfStockProduct = { ...mockProduct, status: 'out_of_stock' as const }
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('Agotado')).toBeInTheDocument()
  })

  it('permite agregar al carrito cuando está en stock', () => {
    const mockAddToCart = vi.fn()
    vi.mocked(require('@/hooks/useCart').useCart).mockReturnValue({
      addToCart: mockAddToCart,
      addToWishlist: vi.fn(),
      addToComparison: vi.fn(),
      isInWishlist: vi.fn(() => false),
      isInComparison: vi.fn(() => false),
    })

    render(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /agregar al carrito/i })
    fireEvent.click(addToCartButton)
    
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct)
  })

  it('permite agregar a wishlist', () => {
    const mockAddToWishlist = vi.fn()
    vi.mocked(require('@/hooks/useCart').useCart).mockReturnValue({
      addToCart: vi.fn(),
      addToWishlist: mockAddToWishlist,
      addToComparison: vi.fn(),
      isInWishlist: vi.fn(() => false),
      isInComparison: vi.fn(() => false),
    })

    render(<ProductCard product={mockProduct} />)
    
    const wishlistButton = screen.getByRole('button', { name: /agregar a favoritos/i })
    fireEvent.click(wishlistButton)
    
    expect(mockAddToWishlist).toHaveBeenCalledWith(mockProduct)
  })

  it('muestra el estado correcto cuando está en wishlist', () => {
    vi.mocked(require('@/hooks/useCart').useCart).mockReturnValue({
      addToCart: vi.fn(),
      addToWishlist: vi.fn(),
      addToComparison: vi.fn(),
      isInWishlist: vi.fn(() => true),
      isInComparison: vi.fn(() => false),
    })

    render(<ProductCard product={mockProduct} />)
    
    const wishlistButton = screen.getByRole('button', { name: /quitar de favoritos/i })
    expect(wishlistButton).toBeInTheDocument()
  })
})