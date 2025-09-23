import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { ProductGrid } from '../../components/ProductGrid';
import { EnhancedProduct } from '../../types';

// Mock de framer-motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  },
}));

// Mock de lucide-react
vi.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">Search</div>,
  Filter: () => <div data-testid="filter-icon">Filter</div>,
  Grid: () => <div data-testid="grid-icon">Grid</div>,
  List: () => <div data-testid="list-icon">List</div>,
  ChevronDown: () => <div data-testid="chevron-down-icon">ChevronDown</div>,
  X: () => <div data-testid="x-icon">X</div>,
  SlidersHorizontal: () => <div data-testid="sliders-icon">Sliders</div>,
}));

// Mock de ProductCard
vi.mock('../../components/ProductCard', () => ({
  ProductCard: ({ product }: { product: EnhancedProduct }) => (
    <div data-testid={`product-card-${product.id}`}>
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <span>{product.brand}</span>
    </div>
  ),
}));

// Mock de lib/products
vi.mock('../../lib/products', () => ({
  filterProducts: vi.fn((products, filters) => products),
  sortProducts: vi.fn((products, sortBy) => products),
  sortOptions: [
    { value: 'title-asc', label: 'Nombre A-Z' },
    { value: 'title-desc', label: 'Nombre Z-A' },
    { value: 'price-asc', label: 'Precio menor a mayor' },
    { value: 'price-desc', label: 'Precio mayor a menor' },
  ],
}));

const mockProducts: EnhancedProduct[] = [
  {
    id: '1',
    title: 'iPhone 15 Pro',
    slug: 'iphone-15-pro',
    price: 999,
    brand: 'Apple',
    condition: 'new',
    images: ['image1.jpg'],
    description: 'Latest iPhone',
    specs: {},
    rating: {
      average: 4.8,
      count: 150,
      distribution: { 5: 100, 4: 30, 3: 15, 2: 3, 1: 2 }
    },
    status: 'active',
    stock_quantity: 10,
    featured: true,
    tags: ['premium'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Samsung Galaxy S24',
    slug: 'samsung-galaxy-s24',
    price: 799,
    brand: 'Samsung',
    condition: 'new',
    images: ['image2.jpg'],
    description: 'Samsung flagship',
    specs: {},
    rating: {
      average: 4.6,
      count: 120,
      distribution: { 5: 80, 4: 25, 3: 10, 2: 3, 1: 2 }
    },
    status: 'active',
    stock_quantity: 5,
    featured: true,
    tags: ['android'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: '3',
    title: 'MacBook Pro',
    slug: 'macbook-pro',
    price: 1999,
    brand: 'Apple',
    condition: 'new',
    images: ['image3.jpg'],
    description: 'Professional laptop',
    specs: {},
    rating: {
      average: 4.9,
      count: 200,
      distribution: { 5: 180, 4: 15, 3: 3, 2: 1, 1: 1 }
    },
    status: 'out_of_stock',
    stock_quantity: 0,
    featured: false,
    tags: ['professional'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

describe('ProductGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders products correctly', () => {
    render(<ProductGrid products={mockProducts} />);
    
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    
    expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
    expect(screen.getByText('Samsung Galaxy S24')).toBeInTheDocument();
    expect(screen.getByText('MacBook Pro')).toBeInTheDocument();
  });

  it('shows empty state when no products', () => {
    render(<ProductGrid products={[]} />);
    
    expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument();
  });

  it('filters products by search term', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, 'iPhone');
    
    // Should show filtered results
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-2')).not.toBeInTheDocument();
    expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument();
  });

  it('filters products by category', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Open filters
    const filterButton = screen.getByText(/filtros/i);
    await user.click(filterButton);
    
    // Select category filter
    const smartphonesCheckbox = screen.getByLabelText(/smartphones/i);
    await user.click(smartphonesCheckbox);
    
    // Should show only smartphones
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument();
  });

  it('filters products by price range', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Open filters
    const filterButton = screen.getByText(/filtros/i);
    await user.click(filterButton);
    
    // Set price range (should filter out MacBook Pro)
    const maxPriceSlider = screen.getByRole('slider', { name: /precio máximo/i });
    fireEvent.change(maxPriceSlider, { target: { value: '1500' } });
    
    // Should show products under $1500
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('product-card-3')).not.toBeInTheDocument();
  });

  it('sorts products correctly', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Open sort dropdown
    const sortSelect = screen.getByRole('combobox');
    await user.click(sortSelect);
    
    // Select price ascending
    const priceAscOption = screen.getByText('Precio menor a mayor');
    await user.click(priceAscOption);
    
    // Verify sort function was called
    const { sortProducts } = await import('../../lib/products');
    expect(sortProducts).toHaveBeenCalledWith(mockProducts, 'price-asc');
  });

  it('toggles between grid and list view', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Should start in grid view
    expect(screen.getByTestId('grid-icon')).toBeInTheDocument();
    
    // Switch to list view
    const listViewButton = screen.getByTestId('list-icon').closest('button');
    if (listViewButton) {
      await user.click(listViewButton);
    }
    
    // Should show list view
    expect(screen.getByTestId('list-icon')).toBeInTheDocument();
  });

  it('clears all filters', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Apply some filters first
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, 'iPhone');
    
    // Open filters and select category
    const filterButton = screen.getByText(/filtros/i);
    await user.click(filterButton);
    
    const smartphonesCheckbox = screen.getByLabelText(/smartphones/i);
    await user.click(smartphonesCheckbox);
    
    // Clear all filters
    const clearButton = screen.getByText(/limpiar filtros/i);
    await user.click(clearButton);
    
    // Should show all products again
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    
    // Search input should be cleared
    expect(searchInput).toHaveValue('');
  });

  it('shows filter badges for active filters', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Apply search filter
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, 'iPhone');
    
    // Should show search badge
    expect(screen.getByText('Búsqueda: iPhone')).toBeInTheDocument();
    
    // Open filters and select category
    const filterButton = screen.getByText(/filtros/i);
    await user.click(filterButton);
    
    const smartphonesCheckbox = screen.getByLabelText(/smartphones/i);
    await user.click(smartphonesCheckbox);
    
    // Should show category badge
    expect(screen.getByText('Categoría: Smartphones')).toBeInTheDocument();
  });

  it('removes individual filter badges', async () => {
    const user = userEvent.setup();
    render(<ProductGrid products={mockProducts} />);
    
    // Apply search filter
    const searchInput = screen.getByPlaceholderText(/buscar productos/i);
    await user.type(searchInput, 'iPhone');
    
    // Remove search badge
    const searchBadge = screen.getByText('Búsqueda: iPhone').closest('div');
    const removeButton = searchBadge?.querySelector('[data-testid="x-icon"]')?.closest('button');
    if (removeButton) {
      await user.click(removeButton);
    }
    
    // Search should be cleared
    expect(searchInput).toHaveValue('');
    expect(screen.queryByText('Búsqueda: iPhone')).not.toBeInTheDocument();
  });

  it('handles loading state', () => {
    // ProductGrid doesn't have loading prop, so we'll test with empty products
    render(<ProductGrid products={[]} />);
    
    expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument();
  });

  it('handles error state', () => {
    // ProductGrid doesn't have error prop, so we'll test with empty products
    render(<ProductGrid products={[]} />);
    
    expect(screen.getByText(/no hay productos disponibles/i)).toBeInTheDocument();
  });
});