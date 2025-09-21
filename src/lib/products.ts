import { Product, EnhancedProduct, ProductFilters, ProductSortOption } from '@/types';

// Base de datos de productos Apple
export const appleProducts: EnhancedProduct[] = [
  {
    id: 'iphone-15-pro-max',
    title: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'El iPhone más avanzado con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR de 6.7 pulgadas.',
    short_description: 'iPhone 15 Pro Max con chip A17 Pro y cámara profesional',
    price: 1199,
    original_price: 1299,
    category_id: 'smartphones',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    specs: {
      screen_size: '6.7"',
      storage: '256GB',
      ram: '8GB',
      camera: '48MP',
      battery: '4441mAh',
      os: 'iOS 17'
    },
    images: [
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=500',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 15,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.8,
      count: 324,
      distribution: { 5: 280, 4: 32, 3: 8, 2: 3, 1: 1 }
    },
    discount_percentage: 8,
    is_new_arrival: true,
    is_bestseller: true,
    tags: ['flagship', 'pro', 'camera']
  },
  {
    id: 'macbook-pro-14',
    title: 'MacBook Pro 14"',
    slug: 'macbook-pro-14',
    description: 'MacBook Pro de 14 pulgadas con chip M3 Pro, pantalla Liquid Retina XDR y hasta 18 horas de batería.',
    short_description: 'MacBook Pro 14" con chip M3 Pro y pantalla XDR',
    price: 1999,
    original_price: 2199,
    category_id: 'laptops',
    brand: 'Apple',
    model: 'MacBook Pro 14"',
    specs: {
      screen_size: '14.2"',
      processor: 'M3 Pro',
      ram: '18GB',
      storage: '512GB SSD',
      graphics: 'GPU integrada de 14 núcleos',
      battery: 'Hasta 18 horas'
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 8,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.9,
      count: 156,
      distribution: { 5: 142, 4: 12, 3: 2, 2: 0, 1: 0 }
    },
    discount_percentage: 9,
    is_bestseller: true,
    tags: ['professional', 'creative', 'performance']
  },
  {
    id: 'ipad-pro-12-9',
    title: 'iPad Pro 12.9"',
    slug: 'ipad-pro-12-9',
    description: 'iPad Pro con chip M2, pantalla Liquid Retina XDR de 12.9 pulgadas y compatibilidad con Apple Pencil.',
    short_description: 'iPad Pro 12.9" con chip M2 y pantalla XDR',
    price: 1099,
    category_id: 'tablets',
    brand: 'Apple',
    model: 'iPad Pro 12.9"',
    specs: {
      screen_size: '12.9"',
      processor: 'M2',
      ram: '8GB',
      storage: '128GB',
      camera: '12MP',
      connectivity: 'Wi-Fi 6E'
    },
    images: [
      'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
      'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 12,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.7,
      count: 89,
      distribution: { 5: 68, 4: 18, 3: 3, 2: 0, 1: 0 }
    },
    tags: ['creative', 'productivity', 'portable']
  },
  {
    id: 'airpods-pro-2',
    title: 'AirPods Pro (2ª generación)',
    slug: 'airpods-pro-2',
    description: 'AirPods Pro con cancelación activa de ruido, audio espacial personalizado y estuche MagSafe.',
    short_description: 'AirPods Pro con cancelación de ruido y audio espacial',
    price: 249,
    category_id: 'auriculares',
    brand: 'Apple',
    model: 'AirPods Pro 2',
    specs: {
      battery: 'Hasta 6 horas',
      case_battery: 'Hasta 30 horas',
      connectivity: 'Bluetooth 5.3',
      features: 'Cancelación activa de ruido',
      water_resistance: 'IPX4'
    },
    images: [
      'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=500',
      'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 25,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.6,
      count: 412,
      distribution: { 5: 298, 4: 89, 3: 20, 2: 4, 1: 1 }
    },
    is_bestseller: true,
    tags: ['wireless', 'noise-cancelling', 'premium']
  }
];

// Base de datos de productos Electronics
export const electronicsProducts: EnhancedProduct[] = [
  {
    id: 'samsung-galaxy-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Smartphone flagship con S Pen integrado, cámara de 200MP y pantalla Dynamic AMOLED 2X de 6.8 pulgadas.',
    short_description: 'Galaxy S24 Ultra con S Pen y cámara de 200MP',
    price: 1199,
    original_price: 1299,
    category_id: 'smartphones',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    specs: {
      screen_size: '6.8"',
      storage: '256GB',
      ram: '12GB',
      camera: '200MP',
      battery: '5000mAh',
      os: 'Android 14'
    },
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=500',
      'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 18,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.7,
      count: 267,
      distribution: { 5: 198, 4: 52, 3: 14, 2: 2, 1: 1 }
    },
    discount_percentage: 8,
    is_new_arrival: true,
    is_bestseller: true,
    tags: ['flagship', 'stylus', 'camera']
  },
  {
    id: 'sony-wh-1000xm5',
    title: 'Sony WH-1000XM5',
    slug: 'sony-wh-1000xm5',
    description: 'Auriculares inalámbricos con la mejor cancelación de ruido del mercado y hasta 30 horas de batería.',
    short_description: 'Auriculares premium con cancelación de ruido líder',
    price: 399,
    original_price: 449,
    category_id: 'auriculares',
    brand: 'Sony',
    model: 'WH-1000XM5',
    specs: {
      battery: 'Hasta 30 horas',
      connectivity: 'Bluetooth 5.2',
      features: 'Cancelación activa de ruido',
      weight: '250g',
      charging: 'Carga rápida USB-C'
    },
    images: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=500',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 22,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.8,
      count: 189,
      distribution: { 5: 156, 4: 28, 3: 4, 2: 1, 1: 0 }
    },
    discount_percentage: 11,
    is_bestseller: true,
    tags: ['wireless', 'noise-cancelling', 'premium']
  },
  {
    id: 'nintendo-switch-oled',
    title: 'Nintendo Switch OLED',
    slug: 'nintendo-switch-oled',
    description: 'Consola híbrida con pantalla OLED de 7 pulgadas, audio mejorado y 64GB de almacenamiento interno.',
    short_description: 'Nintendo Switch con pantalla OLED vibrante',
    price: 349,
    category_id: 'consolas',
    brand: 'Nintendo',
    model: 'Switch OLED',
    specs: {
      screen_size: '7" OLED',
      storage: '64GB',
      battery: 'Hasta 9 horas',
      connectivity: 'Wi-Fi, Bluetooth',
      modes: 'Portátil, Sobremesa, Modo Mesa'
    },
    images: [
      'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 14,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.6,
      count: 145,
      distribution: { 5: 102, 4: 35, 3: 7, 2: 1, 1: 0 }
    },
    tags: ['gaming', 'portable', 'family']
  },
  {
    id: 'dell-xps-13',
    title: 'Dell XPS 13',
    slug: 'dell-xps-13',
    description: 'Ultrabook premium con procesador Intel Core i7, pantalla InfinityEdge y diseño ultradelgado.',
    short_description: 'Ultrabook Dell XPS 13 con pantalla InfinityEdge',
    price: 1299,
    original_price: 1499,
    category_id: 'laptops',
    brand: 'Dell',
    model: 'XPS 13',
    specs: {
      screen_size: '13.4"',
      processor: 'Intel Core i7-1360P',
      ram: '16GB',
      storage: '512GB SSD',
      graphics: 'Intel Iris Xe',
      weight: '1.17kg'
    },
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500'
    ],
    status: 'active',
    condition: 'new',
    stock_quantity: 9,
    featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    rating: {
      average: 4.5,
      count: 78,
      distribution: { 5: 45, 4: 25, 3: 6, 2: 2, 1: 0 }
    },
    discount_percentage: 13,
    tags: ['ultrabook', 'business', 'portable']
  }
];

// Combinar todos los productos
export const allProducts: EnhancedProduct[] = [...appleProducts, ...electronicsProducts];

// Opciones de ordenamiento
export const sortOptions: ProductSortOption[] = [
  { value: 'featured', label: 'Destacados', field: 'featured', direction: 'desc' },
  { value: 'price-asc', label: 'Precio: Menor a Mayor', field: 'price', direction: 'asc' },
  { value: 'price-desc', label: 'Precio: Mayor a Menor', field: 'price', direction: 'desc' },
  { value: 'name-asc', label: 'Nombre: A-Z', field: 'title', direction: 'asc' },
  { value: 'name-desc', label: 'Nombre: Z-A', field: 'title', direction: 'desc' },
  { value: 'newest', label: 'Más Recientes', field: 'created_at', direction: 'desc' }
];

// Funciones de utilidad para filtrado y búsqueda
export const filterProducts = (products: EnhancedProduct[], filters: ProductFilters): EnhancedProduct[] => {
  return products.filter(product => {
    // Filtro por categoría
    if (filters.category && product.category_id !== filters.category) {
      return false;
    }

    // Filtro por marca
    if (filters.brand && product.brand?.toLowerCase() !== filters.brand.toLowerCase()) {
      return false;
    }

    // Filtro por rango de precio
    if (filters.minPrice && product.price < filters.minPrice) {
      return false;
    }
    if (filters.maxPrice && product.price > filters.maxPrice) {
      return false;
    }

    // Filtro por condición
    if (filters.condition && product.condition !== filters.condition) {
      return false;
    }

    // Filtro por stock
    if (filters.inStock && product.stock_quantity <= 0) {
      return false;
    }

    // Filtro por productos destacados
    if (filters.featured && !product.featured) {
      return false;
    }

    // Filtro por búsqueda de texto
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = [
        product.title,
        product.description,
        product.brand,
        product.model,
        ...(product.tags || [])
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }

    return true;
  });
};

export const sortProducts = (products: EnhancedProduct[], sortBy: string): EnhancedProduct[] => {
  const sortOption = sortOptions.find(option => option.value === sortBy);
  if (!sortOption) return products;

  return [...products].sort((a, b) => {
    const aValue = a[sortOption.field];
    const bValue = b[sortOption.field];

    if (sortOption.direction === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

export const searchProducts = (products: EnhancedProduct[], query: string): EnhancedProduct[] => {
  if (!query.trim()) return products;
  
  return filterProducts(products, { search: query });
};

export const getProductsBySection = (section: 'apple' | 'electronics' | 'all'): EnhancedProduct[] => {
  switch (section) {
    case 'apple':
      return appleProducts;
    case 'electronics':
      return electronicsProducts;
    case 'all':
    default:
      return allProducts;
  }
};

export const getProductById = (id: string): EnhancedProduct | undefined => {
  return allProducts.find(product => product.id === id);
};

export const getFeaturedProducts = (limit?: number): EnhancedProduct[] => {
  const featured = allProducts.filter(product => product.featured);
  return limit ? featured.slice(0, limit) : featured;
};

export const getNewArrivals = (limit?: number): EnhancedProduct[] => {
  const newArrivals = allProducts.filter(product => product.is_new_arrival);
  return limit ? newArrivals.slice(0, limit) : newArrivals;
};

export const getBestsellers = (limit?: number): EnhancedProduct[] => {
  const bestsellers = allProducts.filter(product => product.is_bestseller);
  return limit ? bestsellers.slice(0, limit) : bestsellers;
};