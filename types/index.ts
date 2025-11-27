export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  available: boolean;
  preparationTime?: number; // in minutes
  ingredients?: string[];
  nutritionalInfo?: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface CartItem extends MenuItem {
  quantity: number;
  specialInstructions?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDeliveryTime?: Date;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
  };
  paymentMethod?: 'cash' | 'card' | 'digital';
  orderNotes?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  sortOrder: number;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  deliveryFee: number;
  minimumOrder: number;
}