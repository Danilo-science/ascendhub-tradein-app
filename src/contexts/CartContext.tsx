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
  // Nuevas propiedades para funcionalidad mejorada
  addedAt?: Date;
  lastModified?: Date;
  notes?: string;
}

export interface CartState {
  items: CartItem[];
  tradeInDevice: TradeInDevice | null;
  subtotal: number;
  tradeInCredit: number;
  total: number;
  isOpen: boolean;
  // Nuevas propiedades para funcionalidad mejorada
  lastSaved?: Date;
  sessionId?: string;
  currency: string;
  discounts: Array<{
    id: string;
    type: 'percentage' | 'fixed';
    value: number;
    description: string;
  }>;
  shipping: {
    method?: string;
    cost: number;
    estimatedDays?: number;
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
  | { type: 'SET_SHIPPING'; payload: { shipping: CartState['shipping'] } };

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
};

function calculateTotals(items: CartItem[], tradeInCredit: number) {
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = Math.max(0, subtotal - tradeInCredit);
  return { subtotal, total };
}

function cartReducer(state: CartState, action: CartAction): CartState {
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
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        const now = new Date();
        newItems = [...state.items, { 
          product, 
          quantity, 
          selectedSpecs,
          addedAt: now,
          lastModified: now
        }];
      }

      const { subtotal, total } = calculateTotals(newItems, state.tradeInCredit);
      return {
        ...state,
        items: newItems,
        subtotal,
        total,
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.product.id !== action.payload.productId);
      const { subtotal, total } = calculateTotals(newItems, state.tradeInCredit);
      return {
        ...state,
        items: newItems,
        subtotal,
        total,
      };
    }

    case 'UPDATE_QUANTITY': {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM', payload: { productId } });
      }

      const newItems = state.items.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      );

      const { subtotal, total } = calculateTotals(newItems, state.tradeInCredit);
      return {
        ...state,
        items: newItems,
        subtotal,
        total,
      };
    }

    case 'SET_TRADE_IN': {
      const tradeInCredit = action.payload.tradeInDevice.estimatedValue;
      const { subtotal, total } = calculateTotals(state.items, tradeInCredit);
      return {
        ...state,
        tradeInDevice: action.payload.tradeInDevice,
        tradeInCredit,
        total,
      };
    }

    case 'REMOVE_TRADE_IN': {
      const { subtotal, total } = calculateTotals(state.items, 0);
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

    case 'CLEAR_CART':
      return {
        ...initialState,
        sessionId: state.sessionId, // Mantener el sessionId
      };

    case 'LOAD_CART':
      return {
        ...action.payload.cartData,
        isOpen: state.isOpen, // Mantener el estado del drawer
      };

    case 'SAVE_CART':
      return {
        ...state,
        lastSaved: new Date(),
      };

    case 'ADD_DISCOUNT':
      return {
        ...state,
        discounts: [...state.discounts, action.payload.discount],
      };

    case 'REMOVE_DISCOUNT':
      return {
        ...state,
        discounts: state.discounts.filter(d => d.id !== action.payload.discountId),
      };

    case 'SET_SHIPPING':
      return {
        ...state,
        shipping: action.payload.shipping,
      };

    default:
      return state;
  }
}

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    ...initialState,
    sessionId: crypto.randomUUID(),
  });
  const isInitialMount = useRef(true);

  // Cargar desde localStorage al montar
  useEffect(() => {
    const savedCart = localStorage.getItem('ascendhub-cart');
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart);
        // Convertir fechas de string a Date
        if (cartData.items) {
          cartData.items = cartData.items.map((item: CartItem & { addedAt?: string; lastModified?: string }) => ({
            ...item,
            addedAt: item.addedAt ? new Date(item.addedAt) : undefined,
            lastModified: item.lastModified ? new Date(item.lastModified) : undefined,
          }));
        }
        if (cartData.lastSaved) {
          cartData.lastSaved = new Date(cartData.lastSaved);
        }
        dispatch({ type: 'LOAD_CART', payload: { cartData } });
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
    isInitialMount.current = false;
  }, []);

  // Guardar en localStorage cuando el carrito cambie (excepto en el primer render)
  useEffect(() => {
    if (isInitialMount.current) return;
    
    const cartToSave = {
      ...state,
      isOpen: false, // No guardar el estado del drawer
    };
    localStorage.setItem('ascendhub-cart', JSON.stringify(cartToSave));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.items, state.tradeInDevice, state.discounts, state.shipping, state.subtotal, state.tradeInCredit, state.total]);

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
  };

  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });
  };

  const setTradeIn = (tradeInDevice: TradeInDevice) => {
    dispatch({ type: 'SET_TRADE_IN', payload: { tradeInDevice } });
  };

  const removeTradeIn = () => {
    dispatch({ type: 'REMOVE_TRADE_IN' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const addDiscount = (discount: CartState['discounts'][0]) => {
    dispatch({ type: 'ADD_DISCOUNT', payload: { discount } });
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

  return {
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
  };
}