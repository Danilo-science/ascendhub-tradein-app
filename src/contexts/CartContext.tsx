import React, { createContext, useContext, useReducer, ReactNode } from 'react';

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
}

export interface CartState {
  items: CartItem[];
  tradeInDevice: TradeInDevice | null;
  subtotal: number;
  tradeInCredit: number;
  total: number;
  isOpen: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; quantity?: number; selectedSpecs?: Record<string, string> } }
  | { type: 'REMOVE_ITEM'; payload: { productId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: string; quantity: number } }
  | { type: 'SET_TRADE_IN'; payload: { tradeInDevice: TradeInDevice } }
  | { type: 'REMOVE_TRADE_IN' }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' };

const initialState: CartState = {
  items: [],
  tradeInDevice: null,
  subtotal: 0,
  tradeInCredit: 0,
  total: 0,
  isOpen: false,
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
        newItems = [...state.items, { product, quantity, selectedSpecs }];
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
  const [state, dispatch] = useReducer(cartReducer, initialState);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Helper hooks for common cart operations
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

  return {
    addItem,
    removeItem,
    updateQuantity,
    setTradeIn,
    removeTradeIn,
    toggleCart,
    clearCart,
  };
}