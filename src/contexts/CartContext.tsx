import React, { createContext, useContext, useReducer, ReactNode, useEffect, useRef } from 'react';

export interface Product {
  id: string;
  name: string;
  brand: string;
  model: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'apple' | 'electronica';
  specifications: Record<string, string>;
  inStock: boolean;
}

export interface TradeInDevice {
  id: string;
  categoria: string;
  marca: string;
  modelo: string;
  estadoGeneral: string;
  estimatedValue: number;
  status: 'pending' | 'approved' | 'rejected';
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSpecs?: Record<string, string>;
  addedAt?: Date;
  lastModified?: Date;
  notes?: string;
  // Nuevas propiedades para funcionalidad avanzada
  priority?: 'low' | 'medium' | 'high';
  savedForLater?: boolean;
}

// Nueva interfaz para wishlist
export interface WishlistItem {
  product: Product;
  addedAt: Date;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Nueva interfaz para comparación
export interface ComparisonItem {
  product: Product;
  addedAt: Date;
}

// Nueva interfaz para historial
export interface PurchaseHistoryItem {
  id: string;
  items: CartItem[];
  total: number;
  purchaseDate: Date;
  status: 'completed' | 'pending' | 'cancelled';
  paymentMethod?: string;
  shippingAddress?: string;
}

// Nueva interfaz para notificaciones
export interface CartNotification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  autoHide?: boolean;
  duration?: number;
}

export interface CartState {
  items: CartItem[];
  tradeInDevice: TradeInDevice | null;
  subtotal: number;
  tradeInCredit: number;
  total: number;
  isOpen: boolean;
  lastSaved?: Date;
  sessionId?: string;
  currency: string;
  discounts: Array<{
    id: string;
    type: 'percentage' | 'fixed';
    value: number;
    description: string;
    code?: string;
    expiresAt?: Date;
    minPurchase?: number;
  }>;
  shipping: {
    method?: string;
    cost: number;
    estimatedDays?: number;
    address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
  };
  // Nuevas propiedades para funcionalidad avanzada
  wishlist: WishlistItem[];
  comparison: ComparisonItem[];
  purchaseHistory: PurchaseHistoryItem[];
  notifications: CartNotification[];
  preferences: {
    autoSave: boolean;
    notifications: boolean;
    currency: string;
    language: string;
    theme: 'light' | 'dark' | 'auto';
  };
  analytics: {
    totalItemsAdded: number;
    totalItemsRemoved: number;
    averageCartValue: number;
    lastActivity: Date;
    sessionDuration: number;
  };
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; selectedSpecs?: Record<string, string> } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_TRADE_IN'; payload: { tradeInDevice: TradeInDevice } }
  | { type: 'REMOVE_TRADE_IN' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: { cartData: CartState } }
  | { type: 'SAVE_CART' }
  | { type: 'ADD_DISCOUNT'; payload: { discount: CartState['discounts'][0] } }
  | { type: 'REMOVE_DISCOUNT'; payload: { discountId: string } }
  | { type: 'SET_SHIPPING'; payload: { shipping: CartState['shipping'] } }
  // Nuevas acciones para funcionalidad avanzada
  | { type: 'ADD_TO_WISHLIST'; payload: { product: Product; notes?: string; priority?: 'low' | 'medium' | 'high' } }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: { productId: string } }
  | { type: 'MOVE_TO_CART'; payload: { productId: string; quantity?: number } }
  | { type: 'MOVE_TO_WISHLIST'; payload: { productId: string } }
  | { type: 'ADD_TO_COMPARISON'; payload: { product: Product } }
  | { type: 'REMOVE_FROM_COMPARISON'; payload: { productId: string } }
  | { type: 'CLEAR_COMPARISON' }
  | { type: 'ADD_NOTIFICATION'; payload: { notification: Omit<CartNotification, 'id' | 'timestamp'> } }
  | { type: 'REMOVE_NOTIFICATION'; payload: { notificationId: string } }
  | { type: 'CLEAR_NOTIFICATIONS' }
  | { type: 'UPDATE_PREFERENCES'; payload: { preferences: Partial<CartState['preferences']> } }
  | { type: 'ADD_TO_HISTORY'; payload: { purchase: Omit<PurchaseHistoryItem, 'id'> } }
  | { type: 'UPDATE_ANALYTICS'; payload: { analytics: Partial<CartState['analytics']> } }
  | { type: 'SAVE_FOR_LATER'; payload: { productId: string } }
  | { type: 'MOVE_FROM_SAVED'; payload: { productId: string } };

const initialState: CartState = {
  items: [],
  tradeInDevice: null,
  subtotal: 0,
  tradeInCredit: 0,
  total: 0,
  isOpen: false,
  currency: 'ARS',
  discounts: [],
  shipping: {
    cost: 0,
  },
  // Nuevos estados iniciales
  wishlist: [],
  comparison: [],
  purchaseHistory: [],
  notifications: [],
  preferences: {
    autoSave: true,
    notifications: true,
    currency: 'ARS',
    language: 'es',
    theme: 'light',
  },
  analytics: {
    totalItemsAdded: 0,
    totalItemsRemoved: 0,
    averageCartValue: 0,
    lastActivity: new Date(),
    sessionDuration: 0,
  },
};

function calculateTotals(items: CartItem[], tradeInCredit: number, discounts: CartState['discounts'] = [], shipping: CartState['shipping'] = { cost: 0 }) {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  // Calcular descuentos
  let totalDiscount = 0;
  discounts.forEach(discount => {
    if (discount.minPurchase && subtotal < discount.minPurchase) return;
    
    if (discount.type === 'percentage') {
      totalDiscount += subtotal * (discount.value / 100);
    } else {
      totalDiscount += discount.value;
    }
  });

  const discountedSubtotal = Math.max(0, subtotal - totalDiscount);
  const total = Math.max(0, discountedSubtotal + shipping.cost - tradeInCredit);
  
  return { subtotal, total, totalDiscount };
}

// Función para generar ID único
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  const now = new Date();
  
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, quantity = 1, selectedSpecs } = action.payload;
      const existingItemIndex = state.items.findIndex(item => 
        item.product.id === product.id && 
        JSON.stringify(item.selectedSpecs) === JSON.stringify(selectedSpecs)
      );

      let newItems: CartItem[];
      if (existingItemIndex >= 0) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity, lastModified: now }
            : item
        );
      } else {
        newItems = [...state.items, { 
          product, 
          quantity, 
          selectedSpecs,
          addedAt: now,
          lastModified: now,
          priority: 'medium',
          savedForLater: false
        }];
      }

      const { subtotal, total } = calculateTotals(newItems, state.tradeInCredit, state.discounts, state.shipping);
      
      return {
        ...state,
        items: newItems,
        subtotal,
        total,
        analytics: {
          ...state.analytics,
          totalItemsAdded: state.analytics.totalItemsAdded + quantity,
          lastActivity: now,
        }
      };
    }

    case 'REMOVE_ITEM': {
      const removedItem = state.items.find(item => item.product.id === action.payload.productId);
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      const { subtotal, total } = calculateTotals(newItems, state.tradeInCredit, state.discounts, state.shipping);
      
      return {
        ...state,
        items: newItems,
        subtotal,
        total,
        analytics: {
          ...state.analytics,
          totalItemsRemoved: state.analytics.totalItemsRemoved + (removedItem?.quantity || 0),
          lastActivity: now,
        }
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity, lastModified: now }
          : item
      );

      const { subtotal, total } = calculateTotals(newItems, state.tradeInCredit, state.discounts, state.shipping);
      return {
        ...state,
        items: newItems,
        subtotal,
        total,
        analytics: {
          ...state.analytics,
          lastActivity: now,
        }
      };
    }

    case 'SET_TRADE_IN': {
      const tradeInCredit = action.payload.tradeInDevice.estimatedValue;
      const { subtotal, total } = calculateTotals(state.items, tradeInCredit, state.discounts, state.shipping);
      return {
        ...state,
        tradeInDevice: action.payload.tradeInDevice,
        tradeInCredit,
        total,
      };
    }

    case 'REMOVE_TRADE_IN': {
      const { subtotal, total } = calculateTotals(state.items, 0, state.discounts, state.shipping);
      return {
        ...state,
        tradeInDevice: null,
        tradeInCredit: 0,
        total,
      };
    }

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    case 'CLEAR_CART': {
      return {
        ...state,
        items: [],
        subtotal: 0,
        total: state.shipping.cost - state.tradeInCredit,
        analytics: {
          ...state.analytics,
          lastActivity: now,
        }
      };
    }

    case 'ADD_DISCOUNT': {
      const newDiscounts = [...state.discounts, action.payload.discount];
      const { subtotal, total } = calculateTotals(state.items, state.tradeInCredit, newDiscounts, state.shipping);
      return {
        ...state,
        discounts: newDiscounts,
        subtotal,
        total,
      };
    }

    case 'REMOVE_DISCOUNT': {
      const newDiscounts = state.discounts.filter(d => d.id !== action.payload.discountId);
      const { subtotal, total } = calculateTotals(state.items, state.tradeInCredit, newDiscounts, state.shipping);
      return {
        ...state,
        discounts: newDiscounts,
        subtotal,
        total,
      };
    }

    case 'SET_SHIPPING': {
      const { subtotal, total } = calculateTotals(state.items, state.tradeInCredit, state.discounts, action.payload.shipping);
      return {
        ...state,
        shipping: action.payload.shipping,
        total,
      };
    }

    // Nuevos casos para funcionalidad avanzada
    case 'ADD_TO_WISHLIST': {
      const { product, notes, priority = 'medium' } = action.payload;
      const existingIndex = state.wishlist.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        return state; // Ya está en wishlist
      }

      const newWishlistItem: WishlistItem = {
        product,
        addedAt: now,
        notes,
        priority,
      };

      return {
        ...state,
        wishlist: [...state.wishlist, newWishlistItem],
      };
    }

    case 'REMOVE_FROM_WISHLIST': {
      return {
        ...state,
        wishlist: state.wishlist.filter(item => item.product.id !== action.payload.productId),
      };
    }

    case 'MOVE_TO_CART': {
      const { productId, quantity = 1 } = action.payload;
      const wishlistItem = state.wishlist.find(item => item.product.id === productId);
      
      if (!wishlistItem) return state;

      const newState = cartReducer(state, {
        type: 'ADD_ITEM',
        payload: { product: wishlistItem.product, quantity }
      });

      return cartReducer(newState, {
        type: 'REMOVE_FROM_WISHLIST',
        payload: { productId }
      });
    }

    case 'MOVE_TO_WISHLIST': {
      const cartItem = state.items.find(item => item.product.id === action.payload.productId);
      
      if (!cartItem) return state;

      const newState = cartReducer(state, {
        type: 'ADD_TO_WISHLIST',
        payload: { product: cartItem.product, notes: cartItem.notes }
      });

      return cartReducer(newState, {
        type: 'REMOVE_ITEM',
        payload: { productId: action.payload.productId }
      });
    }

    case 'ADD_TO_COMPARISON': {
      const { product } = action.payload;
      const existingIndex = state.comparison.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0 || state.comparison.length >= 4) {
        return state; // Ya está en comparación o límite alcanzado
      }

      const newComparisonItem: ComparisonItem = {
        product,
        addedAt: now,
      };

      return {
        ...state,
        comparison: [...state.comparison, newComparisonItem],
      };
    }

    case 'REMOVE_FROM_COMPARISON': {
      return {
        ...state,
        comparison: state.comparison.filter(item => item.product.id !== action.payload.productId),
      };
    }

    case 'CLEAR_COMPARISON': {
      return {
        ...state,
        comparison: [],
      };
    }

    case 'ADD_NOTIFICATION': {
      const notification: CartNotification = {
        id: generateId(),
        timestamp: now,
        ...action.payload.notification,
      };

      return {
        ...state,
        notifications: [...state.notifications, notification],
      };
    }

    case 'REMOVE_NOTIFICATION': {
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload.notificationId),
      };
    }

    case 'CLEAR_NOTIFICATIONS': {
      return {
        ...state,
        notifications: [],
      };
    }

    case 'UPDATE_PREFERENCES': {
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload.preferences,
        },
      };
    }

    case 'ADD_TO_HISTORY': {
      const purchase: PurchaseHistoryItem = {
        id: generateId(),
        ...action.payload.purchase,
      };

      return {
        ...state,
        purchaseHistory: [purchase, ...state.purchaseHistory],
      };
    }

    case 'UPDATE_ANALYTICS': {
      return {
        ...state,
        analytics: {
          ...state.analytics,
          ...action.payload.analytics,
          lastActivity: now,
        },
      };
    }

    case 'SAVE_FOR_LATER': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, savedForLater: true, lastModified: now }
          : item
      );

      return {
        ...state,
        items: newItems,
      };
    }

    case 'MOVE_FROM_SAVED': {
      const newItems = state.items.map(item =>
        item.product.id === action.payload.productId
          ? { ...item, savedForLater: false, lastModified: now }
          : item
      );

      return {
        ...state,
        items: newItems,
      };
    }

    case 'LOAD_CART': {
      const loadedData = action.payload.cartData;
      
      // Merge loaded data with initial state to ensure all properties exist
      return {
        ...initialState,
        ...loadedData,
        preferences: {
          ...initialState.preferences,
          ...(loadedData.preferences || {}),
        },
        analytics: {
          ...initialState.analytics,
          ...(loadedData.analytics || {}),
        },
        lastSaved: now,
      };
    }

    case 'SAVE_CART': {
      return {
        ...state,
        lastSaved: now,
      };
    }

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // Auto-save functionality
  useEffect(() => {
    if (state.preferences.autoSave) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem('ascendhub-cart', JSON.stringify(state));
        dispatch({ type: 'SAVE_CART' });
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.items, state.wishlist, state.comparison, state.preferences.autoSave]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ascendhub-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: { cartData } });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Auto-hide notifications
  useEffect(() => {
    state.notifications.forEach(notification => {
      if (notification.autoHide !== false) {
        const duration = notification.duration || 5000;
        setTimeout(() => {
          dispatch({ type: 'REMOVE_NOTIFICATION', payload: { notificationId: notification.id } });
        }, duration);
      }
    });
  }, [state.notifications]);

  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper hooks for common cart operations
// eslint-disable-next-line react-refresh/only-export-components
export function useCartActions() {
  const { dispatch } = useCart();

  const addItem = (product: Product, quantity = 1, selectedSpecs?: Record<string, string>) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, quantity, selectedSpecs } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'success', 
          message: `${product.name} agregado al carrito`,
          autoHide: true,
          duration: 3000
        } 
      } 
    });
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'info', 
          message: 'Producto eliminado del carrito',
          autoHide: true,
          duration: 3000
        } 
      } 
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const setTradeIn = (tradeInDevice: TradeInDevice) => {
    dispatch({ type: 'SET_TRADE_IN', payload: { tradeInDevice } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'success', 
          message: `Crédito de $${tradeInDevice.estimatedValue} aplicado`,
          autoHide: true,
          duration: 4000
        } 
      } 
    });
  };

  const removeTradeIn = () => {
    dispatch({ type: 'REMOVE_TRADE_IN' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'info', 
          message: 'Carrito vaciado',
          autoHide: true,
          duration: 3000
        } 
      } 
    });
  };

  const addDiscount = (discount: CartState['discounts'][0]) => {
    dispatch({ type: 'ADD_DISCOUNT', payload: { discount } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'success', 
          message: `Descuento "${discount.description}" aplicado`,
          autoHide: true,
          duration: 4000
        } 
      } 
    });
  };

  const removeDiscount = (discountId: string) => {
    dispatch({ type: 'REMOVE_DISCOUNT', payload: { discountId } });
  };

  const setShipping = (shipping: CartState['shipping']) => {
    dispatch({ type: 'SET_SHIPPING', payload: { shipping } });
  };

  const saveCart = () => {
    dispatch({ type: 'SAVE_CART' });
  };

  const loadCart = (cartData: CartState) => {
    dispatch({ type: 'LOAD_CART', payload: { cartData } });
  };

  // Nuevas funciones para funcionalidad avanzada
  const addToWishlist = (product: Product, notes?: string, priority?: 'low' | 'medium' | 'high') => {
    dispatch({ type: 'ADD_TO_WISHLIST', payload: { product, notes, priority } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'success', 
          message: `${product.name} agregado a favoritos`,
          autoHide: true,
          duration: 3000
        } 
      } 
    });
  };

  const removeFromWishlist = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: { productId } });
  };

  const moveToCart = (productId: string, quantity = 1) => {
    dispatch({ type: 'MOVE_TO_CART', payload: { productId, quantity } });
  };

  const moveToWishlist = (productId: string) => {
    dispatch({ type: 'MOVE_TO_WISHLIST', payload: { productId } });
  };

  const addToComparison = (product: Product) => {
    dispatch({ type: 'ADD_TO_COMPARISON', payload: { product } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'info', 
          message: `${product.name} agregado a comparación`,
          autoHide: true,
          duration: 3000
        } 
      } 
    });
  };

  const removeFromComparison = (productId: string) => {
    dispatch({ type: 'REMOVE_FROM_COMPARISON', payload: { productId } });
  };

  const clearComparison = () => {
    dispatch({ type: 'CLEAR_COMPARISON' });
  };

  const addNotification = (notification: Omit<CartNotification, 'id' | 'timestamp'>) => {
    dispatch({ type: 'ADD_NOTIFICATION', payload: { notification } });
  };

  const removeNotification = (notificationId: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: { notificationId } });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_NOTIFICATIONS' });
  };

  const updatePreferences = (preferences: Partial<CartState['preferences']>) => {
    dispatch({ type: 'UPDATE_PREFERENCES', payload: { preferences } });
  };

  const addToHistory = (purchase: Omit<PurchaseHistoryItem, 'id'>) => {
    dispatch({ type: 'ADD_TO_HISTORY', payload: { purchase } });
  };

  const saveForLater = (productId: string) => {
    dispatch({ type: 'SAVE_FOR_LATER', payload: { productId } });
    dispatch({ 
      type: 'ADD_NOTIFICATION', 
      payload: { 
        notification: { 
          type: 'info', 
          message: 'Producto guardado para más tarde',
          autoHide: true,
          duration: 3000
        } 
      } 
    });
  };

  const moveFromSaved = (productId: string) => {
    dispatch({ type: 'MOVE_FROM_SAVED', payload: { productId } });
  };

  // Helper functions for ProductCard compatibility
  const isInCart = (productId: string): boolean => {
    const { state } = useCart();
    return state.items.some(item => item.product.id === productId);
  };

  const getCartItemQuantity = (productId: string): number => {
    const { state } = useCart();
    const item = state.items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const isInWishlist = (productId: string): boolean => {
    const { state } = useCart();
    return state.wishlist.some(item => item.product.id === productId);
  };

  const isInComparison = (productId: string): boolean => {
    const { state } = useCart();
    return state.comparison.some(item => item.product.id === productId);
  };

  // Convert EnhancedProduct to Product for cart compatibility
  const addToCart = (product: any, quantity = 1) => {
    const cartProduct: Product = {
      id: product.id,
      name: product.title,
      brand: product.brand || '',
      model: product.model || '',
      price: product.price,
      originalPrice: product.original_price,
      image: product.images?.[0] || '',
      category: product.brand?.toLowerCase() === 'apple' ? 'apple' : 'electronica',
      specifications: product.specs || {},
      inStock: product.stock_quantity > 0
    };
    addItem(cartProduct, quantity);
  };

  return {
    // Funciones básicas del carrito
    addItem,
    removeItem,
    updateQuantity,
    setTradeIn,
    removeTradeIn,
    toggleCart,
    clearCart,
    addDiscount,
    removeDiscount,
    setShipping,
    saveCart,
    loadCart,
    
    // Funciones de wishlist
    addToWishlist,
    removeFromWishlist,
    moveToCart,
    moveToWishlist,
    
    // Funciones de comparación
    addToComparison,
    removeFromComparison,
    clearComparison,
    
    // Funciones de notificaciones
    addNotification,
    removeNotification,
    clearNotifications,
    
    // Funciones de preferencias e historial
    updatePreferences,
    addToHistory,
    saveForLater,
    moveFromSaved,
    
    // Helper functions for ProductCard
    isInCart,
    getCartItemQuantity,
    isInWishlist,
    isInComparison,
    addToCart,
    
    // Aliases para compatibilidad con ProductCard
    removeFromCart: removeItem,
    showNotification: addNotification,
  };
}