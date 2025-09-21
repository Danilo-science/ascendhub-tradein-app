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
  specs?: Record<string, any>;
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
  shipping_address?: Record<string, any>;
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