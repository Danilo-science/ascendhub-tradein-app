export interface Product {
  id: string;
  title: string;
  slug: string;
  description?: string;
  short_description?: string;
  price: number;
  original_price?: number;
  category_id?: string;
  brand?: string;
  model?: string;
  specs?: Record<string, string | number | boolean>;
  images: string[];
  status: 'active' | 'inactive' | 'out_of_stock';
  condition: 'new' | 'used' | 'refurbished';
  stock_quantity: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface TradeInRequest {
  id: string;
  user_id?: string;
  brand: string;
  model: string;
  year?: number;
  ram?: string;
  storage?: string;
  condition_notes?: string;
  defects: string[];
  images: string[];
  estimated_value?: number;
  final_value?: number;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  contact_email: string;
  contact_phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  total_amount: number;
  tradein_discount: number;
  final_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  payment_id?: string;
  payment_status?: string;
  shipping_address?: {
    street: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  items: CartItem[];
  tradein_request_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  role: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product_id: string;
  product: Product;
  quantity: number;
}

export interface TradeInFormData {
  brand: string;
  model: string;
  year?: number;
  ram?: string;
  storage?: string;
  condition_notes?: string;
  defects: string[];
  contact_email: string;
  contact_phone?: string;
  images?: File[];
}

// NextAuth Types
export interface ExtendedUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  supabaseId?: string;
}

export interface ExtendedSession {
  user: ExtendedUser;
  expires: string;
}

// Cloudinary Types
export interface CloudinaryImage {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface ImageUploadResult {
  success: boolean;
  images?: CloudinaryImage[];
  error?: string;
}

// MercadoPago Types
export interface PaymentPreference {
  id: string;
  init_point: string;
  sandbox_init_point: string;
  collector_id: number;
  client_id: string;
  items: PaymentItem[];
  payer: PaymentPayer;
  back_urls: PaymentBackUrls;
  auto_return: string;
  payment_methods: PaymentMethods;
  notification_url: string;
  statement_descriptor: string;
  external_reference: string;
  expires: boolean;
  expiration_date_from?: string;
  expiration_date_to?: string;
}

export interface PaymentItem {
  id: string;
  title: string;
  description?: string;
  picture_url?: string;
  category_id?: string;
  quantity: number;
  currency_id: string;
  unit_price: number;
}

export interface PaymentPayer {
  name?: string;
  surname?: string;
  email: string;
  phone?: {
    area_code?: string;
    number?: string;
  };
  identification?: {
    type?: string;
    number?: string;
  };
  address?: {
    street_name?: string;
    street_number?: string;
    zip_code?: string;
  };
}

export interface PaymentBackUrls {
  success?: string;
  failure?: string;
  pending?: string;
}

export interface PaymentMethods {
  excluded_payment_methods?: Array<{ id: string }>;
  excluded_payment_types?: Array<{ id: string }>;
  installments?: number;
}

export interface PaymentInfo {
  id: string;
  status: string;
  status_detail: string;
  transaction_amount: number;
  currency_id: string;
  payer: PaymentPayer;
  payment_method_id: string;
  payment_type_id: string;
  external_reference?: string;
  date_created: string;
  date_approved?: string;
}

// Webhook Types
export interface WebhookNotification {
  id: string;
  live_mode: boolean;
  type: 'payment' | 'plan' | 'subscription' | 'invoice';
  date_created: string;
  application_id: string;
  user_id: string;
  version: string;
  api_version: string;
  action: string;
  data: {
    id: string;
  };
}

// Enhanced Cart Types
export interface EnhancedCartItem extends CartItem {
  selected?: boolean;
  notes?: string;
  trade_in_value?: number;
}

export interface CartState {
  items: EnhancedCartItem[];
  total: number;
  trade_in_discount: number;
  final_total: number;
  shipping_cost: number;
  tax: number;
}

// Trade-In Enhancement Types
export interface TradeInValuation {
  id: string;
  request_id: string;
  base_value: number;
  condition_adjustment: number;
  market_adjustment: number;
  final_value: number;
  valuation_notes: string;
  expires_at: string;
  created_at: string;
}

export interface TradeInDevice {
  brand: string;
  model: string;
  year?: number;
  category: 'smartphone' | 'tablet' | 'laptop' | 'smartwatch' | 'auriculares' | 'consola';
  base_values: Record<string, number>; // condition -> value mapping
}

// Tipos adicionales para el sistema de productos y catálogo
export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: 'new' | 'used' | 'refurbished';
  inStock?: boolean;
  featured?: boolean;
  search?: string;
}

export interface ProductSortOption {
  value: string;
  label: string;
  field: keyof Product;
  direction: 'asc' | 'desc';
}

export interface ProductGridProps {
  products?: Product[];
  filters?: ProductFilters;
  sortBy?: string;
  viewMode?: 'grid' | 'list';
  itemsPerPage?: number;
  section?: 'apple' | 'electronics' | 'default';
}

export interface ProductCardProps {
  product: Product;
  section?: 'apple' | 'electronics' | 'default';
  onAddToCart?: (product: Product) => void;
  showQuickView?: boolean;
}

export interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ProductRating {
  average: number;
  count: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface EnhancedProduct extends Product {
  rating?: ProductRating;
  discount_percentage?: number;
  is_new_arrival?: boolean;
  is_bestseller?: boolean;
  tags?: string[];
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  price_adjustment: number;
  stock_quantity: number;
  image_url?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}