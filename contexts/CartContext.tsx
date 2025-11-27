import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { CartItem, MenuItem } from '@/types';
import { Platform } from 'react-native';

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  deliveryFee: number;
  tax: number;
  grandTotal: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: MenuItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'UPDATE_SPECIAL_INSTRUCTIONS'; payload: { id: string; instructions: string } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] }
  | { type: 'SET_DELIVERY_FEE'; payload: number };

interface CartContextType {
  state: CartState;
  addItem: (item: MenuItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateSpecialInstructions: (id: string, instructions: string) => void;
  clearCart: () => void;
  getCartItemsCount: () => number;
  getCartTotal: () => number;
  setDeliveryFee: (fee: number) => void;
}

const CartContext = createContext<CartContextType | null>(null);

const TAX_RATE = 0.08; // 8% tax rate
const DEFAULT_DELIVERY_FEE = 3.99;

const calculateTotals = (items: CartItem[], deliveryFee: number = DEFAULT_DELIVERY_FEE) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax + deliveryFee;
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  return {
    total: subtotal,
    tax,
    grandTotal,
    itemCount
  };
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];
  let totals;

  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }
      
      totals = calculateTotals(newItems, state.deliveryFee);
      return { 
        ...state, 
        items: newItems, 
        ...totals
      };
    }
    
    case 'REMOVE_ITEM': {
      newItems = state.items.filter(item => item.id !== action.payload);
      totals = calculateTotals(newItems, state.deliveryFee);
      return { 
        ...state, 
        items: newItems, 
        ...totals
      };
    }
    
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter(item => item.id !== action.payload.id);
      } else {
        newItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      
      totals = calculateTotals(newItems, state.deliveryFee);
      return { 
        ...state, 
        items: newItems, 
        ...totals
      };
    }
    
    case 'UPDATE_SPECIAL_INSTRUCTIONS': {
      newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, specialInstructions: action.payload.instructions }
          : item
      );
      
      return { 
        ...state, 
        items: newItems
      };
    }
    
    case 'CLEAR_CART':
      return { 
        items: [], 
        total: 0, 
        itemCount: 0,
        deliveryFee: DEFAULT_DELIVERY_FEE,
        tax: 0,
        grandTotal: DEFAULT_DELIVERY_FEE
      };
    
    case 'LOAD_CART': {
      totals = calculateTotals(action.payload, state.deliveryFee);
      return { 
        ...state, 
        items: action.payload, 
        ...totals
      };
    }
    
    case 'SET_DELIVERY_FEE': {
      totals = calculateTotals(state.items, action.payload);
      return { 
        ...state, 
        deliveryFee: action.payload,
        ...totals
      };
    }
    
    default:
      return state;
  }
};

// Persistent storage helpers (web-compatible)
const saveCartToStorage = (items: CartItem[]) => {
  try {
    if (Platform.OS === 'web') {
      localStorage.setItem('foodApp_cart', JSON.stringify(items));
    }
    // For mobile, you could use AsyncStorage here
  } catch (error) {
    console.warn('Failed to save cart to storage:', error);
  }
};

const loadCartFromStorage = (): CartItem[] => {
  try {
    if (Platform.OS === 'web') {
      const saved = localStorage.getItem('foodApp_cart');
      return saved ? JSON.parse(saved) : [];
    }
    // For mobile, you could use AsyncStorage here
    return [];
  } catch (error) {
    console.warn('Failed to load cart from storage:', error);
    return [];
  }
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    deliveryFee: DEFAULT_DELIVERY_FEE,
    tax: 0,
    grandTotal: DEFAULT_DELIVERY_FEE
  });

  // Load cart from storage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    if (savedCart.length > 0) {
      dispatch({ type: 'LOAD_CART', payload: savedCart });
    }
  }, []);

  // Save cart to storage whenever it changes
  useEffect(() => {
    saveCartToStorage(state.items);
  }, [state.items]);

  const addItem = (item: MenuItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    
    // Haptic feedback for mobile
    if (Platform.OS !== 'web') {
      // You could add haptic feedback here for mobile
      // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const updateSpecialInstructions = (id: string, instructions: string) => {
    dispatch({ type: 'UPDATE_SPECIAL_INSTRUCTIONS', payload: { id, instructions } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getCartItemsCount = () => {
    return state.itemCount;
  };

  const getCartTotal = () => {
    return state.total;
  };

  const setDeliveryFee = (fee: number) => {
    dispatch({ type: 'SET_DELIVERY_FEE', payload: fee });
  };

  return (
    <CartContext.Provider value={{
      state,
      addItem,
      removeItem,
      updateQuantity,
      updateSpecialInstructions,
      clearCart,
      getCartItemsCount,
      getCartTotal,
      setDeliveryFee
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};