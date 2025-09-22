// Mock data para tests
export const mockProduct = {
  id: '1',
  title: 'iPhone 15 Pro',
  slug: 'iphone-15-pro',
  description: 'Test product description',
  short_description: 'iPhone 15 Pro test',
  price: 999,
  original_price: 1099,
  category_id: 'smartphones',
  brand: 'Apple',
  model: 'iPhone 15 Pro',
  specs: {
    storage: '128GB',
    color: 'Natural Titanium',
    condition: 'Nuevo'
  },
  images: ['/test-image.jpg'],
  status: 'active' as const,
  condition: 'new' as const,
  stock_quantity: 10,
  featured: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  rating: {
    average: 4.8,
    count: 150,
    distribution: { 5: 100, 4: 30, 3: 15, 2: 3, 1: 2 }
  },
  discount_percentage: Math.round(((1099 - 999) / 1099) * 100),
  is_new_arrival: true,
  is_bestseller: true,
  tags: ['premium', 'flagship']
}

export const mockCartItem = {
  product_id: '1',
  product: mockProduct,
  quantity: 1
}

export const mockTradeInDevice = {
  id: '1',
  brand: 'Apple',
  model: 'iPhone 14',
  storage: '128GB',
  condition: 'Bueno',
  estimatedValue: 500,
  images: ['/test-image1.jpg', '/test-image2.jpg']
}