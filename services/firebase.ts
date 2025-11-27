import { 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  where,
  Timestamp,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '@/config/firebase';
import { MenuItem, Order, Category, CartItem } from '@/types';

// Enhanced mock data with more realistic food items
const ENHANCED_MOCK_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    description: 'Classic Italian pizza with fresh tomatoes, mozzarella di bufala, fresh basil, and extra virgin olive oil on a wood-fired crust',
    price: 16.99,
    image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizza',
    available: true,
    preparationTime: 15,
    ingredients: ['Tomato sauce', 'Mozzarella', 'Fresh basil', 'Olive oil'],
    nutritionalInfo: { calories: 280, protein: 12, carbs: 36, fat: 10 }
  },
  {
    id: '2',
    name: 'Truffle Mushroom Pizza',
    description: 'Gourmet pizza with wild mushrooms, truffle oil, caramelized onions, and aged parmesan on a crispy thin crust',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pizza',
    available: true,
    preparationTime: 18,
    ingredients: ['Wild mushrooms', 'Truffle oil', 'Caramelized onions', 'Parmesan'],
    nutritionalInfo: { calories: 320, protein: 14, carbs: 38, fat: 14 }
  },
  {
    id: '3',
    name: 'Gourmet Chicken Burger',
    description: 'Premium grilled chicken breast with avocado, bacon, aged cheddar, lettuce, tomato, and chipotle mayo on a brioche bun',
    price: 18.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Burgers',
    available: true,
    preparationTime: 12,
    ingredients: ['Chicken breast', 'Avocado', 'Bacon', 'Cheddar', 'Chipotle mayo'],
    nutritionalInfo: { calories: 580, protein: 35, carbs: 42, fat: 28 }
  },
  {
    id: '4',
    name: 'Wagyu Beef Burger',
    description: 'Premium wagyu beef patty with caramelized onions, swiss cheese, arugula, and truffle aioli on a artisan bun',
    price: 28.99,
    image: 'https://images.pexels.com/photos/1556909/pexels-photo-1556909.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Burgers',
    available: true,
    preparationTime: 15,
    ingredients: ['Wagyu beef', 'Swiss cheese', 'Arugula', 'Truffle aioli'],
    nutritionalInfo: { calories: 650, protein: 42, carbs: 38, fat: 35 }
  },
  {
    id: '5',
    name: 'Mediterranean Caesar Salad',
    description: 'Fresh romaine hearts with house-made caesar dressing, aged parmesan, herb croutons, and grilled chicken',
    price: 14.99,
    image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Salads',
    available: true,
    preparationTime: 8,
    ingredients: ['Romaine lettuce', 'Parmesan', 'Croutons', 'Caesar dressing'],
    nutritionalInfo: { calories: 280, protein: 25, carbs: 18, fat: 15 }
  },
  {
    id: '6',
    name: 'Quinoa Power Bowl',
    description: 'Superfood bowl with quinoa, roasted vegetables, avocado, chickpeas, feta cheese, and tahini dressing',
    price: 16.99,
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Salads',
    available: true,
    preparationTime: 10,
    ingredients: ['Quinoa', 'Roasted vegetables', 'Avocado', 'Chickpeas', 'Feta'],
    nutritionalInfo: { calories: 420, protein: 18, carbs: 52, fat: 18 }
  },
  {
    id: '7',
    name: 'Truffle Carbonara',
    description: 'Handmade fettuccine with pancetta, egg yolk, aged pecorino romano, black pepper, and truffle oil',
    price: 22.99,
    image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pasta',
    available: true,
    preparationTime: 14,
    ingredients: ['Fettuccine', 'Pancetta', 'Pecorino romano', 'Truffle oil'],
    nutritionalInfo: { calories: 520, protein: 22, carbs: 58, fat: 24 }
  },
  {
    id: '8',
    name: 'Seafood Linguine',
    description: 'Fresh linguine with prawns, scallops, mussels, cherry tomatoes, white wine, and fresh herbs',
    price: 26.99,
    image: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Pasta',
    available: true,
    preparationTime: 16,
    ingredients: ['Linguine', 'Prawns', 'Scallops', 'Mussels', 'White wine'],
    nutritionalInfo: { calories: 480, protein: 32, carbs: 54, fat: 16 }
  },
  {
    id: '9',
    name: 'Pan-Seared Salmon',
    description: 'Atlantic salmon with lemon herb butter, roasted asparagus, and garlic mashed potatoes',
    price: 24.99,
    image: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Seafood',
    available: true,
    preparationTime: 18,
    ingredients: ['Atlantic salmon', 'Lemon herb butter', 'Asparagus', 'Potatoes'],
    nutritionalInfo: { calories: 450, protein: 38, carbs: 28, fat: 22 }
  },
  {
    id: '10',
    name: 'Grilled Sea Bass',
    description: 'Mediterranean sea bass with olive tapenade, roasted vegetables, and saffron rice',
    price: 28.99,
    image: 'https://images.pexels.com/photos/725991/pexels-photo-725991.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Seafood',
    available: true,
    preparationTime: 20,
    ingredients: ['Sea bass', 'Olive tapenade', 'Roasted vegetables', 'Saffron rice'],
    nutritionalInfo: { calories: 380, protein: 35, carbs: 32, fat: 14 }
  },
  {
    id: '11',
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with molten center, vanilla ice cream, and fresh berries',
    price: 9.99,
    image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Desserts',
    available: true,
    preparationTime: 12,
    ingredients: ['Dark chocolate', 'Vanilla ice cream', 'Fresh berries'],
    nutritionalInfo: { calories: 420, protein: 6, carbs: 52, fat: 22 }
  },
  {
    id: '12',
    name: 'Tiramisu',
    description: 'Classic Italian dessert with mascarpone, espresso-soaked ladyfingers, and cocoa powder',
    price: 8.99,
    image: 'https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=800',
    category: 'Desserts',
    available: true,
    preparationTime: 5,
    ingredients: ['Mascarpone', 'Ladyfingers', 'Espresso', 'Cocoa powder'],
    nutritionalInfo: { calories: 320, protein: 8, carbs: 28, fat: 20 }
  }
];

const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Pizza', description: 'Wood-fired artisan pizzas', image: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', sortOrder: 1 },
  { id: '2', name: 'Burgers', description: 'Gourmet burgers & sandwiches', image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400', sortOrder: 2 },
  { id: '3', name: 'Salads', description: 'Fresh & healthy options', image: 'https://images.pexels.com/photos/1059905/pexels-photo-1059905.jpeg?auto=compress&cs=tinysrgb&w=400', sortOrder: 3 },
  { id: '4', name: 'Pasta', description: 'Handmade pasta dishes', image: 'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400', sortOrder: 4 },
  { id: '5', name: 'Seafood', description: 'Fresh catch of the day', image: 'https://images.pexels.com/photos/1833336/pexels-photo-1833336.jpeg?auto=compress&cs=tinysrgb&w=400', sortOrder: 5 },
  { id: '6', name: 'Desserts', description: 'Sweet endings', image: 'https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=400', sortOrder: 6 }
];

// Menu Items Service
export const getMenuItems = async (): Promise<MenuItem[]> => {
  try {
    // Simulate network delay for realistic loading experience
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // In production, uncomment this to fetch from Firestore:
    /*
    const menuCollection = collection(db, 'menuItems');
    const q = query(menuCollection, where('available', '==', true), orderBy('category'), orderBy('name'));
    const menuSnapshot = await getDocs(q);
    return menuSnapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as MenuItem[];
    */
    
    return ENHANCED_MOCK_MENU_ITEMS;
  } catch (error) {
    console.error('Error fetching menu items:', error);
    throw new Error('Unable to load menu items. Please check your connection and try again.');
  }
};

export const getMenuItemsByCategory = async (categoryId: string): Promise<MenuItem[]> => {
  try {
    const allItems = await getMenuItems();
    return allItems.filter(item => item.category.toLowerCase() === categoryId.toLowerCase());
  } catch (error) {
    console.error('Error fetching menu items by category:', error);
    throw new Error('Unable to load menu items for this category.');
  }
};

export const subscribeToMenuItems = (callback: (items: MenuItem[]) => void) => {
  // Simulate real-time updates with mock data
  callback(ENHANCED_MOCK_MENU_ITEMS);
  
  // In production, use this for real-time updates:
  /*
  const menuCollection = collection(db, 'menuItems');
  const q = query(menuCollection, where('available', '==', true), orderBy('category'), orderBy('name'));
  return onSnapshot(q, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ 
      id: doc.id, 
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate()
    })) as MenuItem[];
    callback(items);
  }, (error) => {
    console.error('Error in menu items subscription:', error);
  });
  */
  
  return () => {}; // Return unsubscribe function
};

// Categories Service
export const getCategories = async (): Promise<Category[]> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production:
    /*
    const categoriesCollection = collection(db, 'categories');
    const q = query(categoriesCollection, orderBy('sortOrder'));
    const categoriesSnapshot = await getDocs(q);
    return categoriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Category[];
    */
    
    return MOCK_CATEGORIES;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw new Error('Unable to load categories.');
  }
};

// Orders Service
export const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<string> => {
  try {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Validate order data
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('Order must contain at least one item');
    }
    
    if (!orderData.customerInfo.name || !orderData.customerInfo.phone) {
      throw new Error('Customer name and phone are required');
    }
    
    // In production, save to Firestore:
    /*
    const ordersCollection = collection(db, 'orders');
    const docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: serverTimestamp(),
      status: 'pending'
    });
    
    // Update inventory if needed
    const batch = writeBatch(db);
    orderData.items.forEach(item => {
      const itemRef = doc(db, 'menuItems', item.id);
      // Update stock or popularity metrics
    });
    await batch.commit();
    
    return docRef.id;
    */
    
    // Mock order creation
    const orderId = `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    console.log('Order created:', { id: orderId, ...orderData });
    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create order. Please try again.');
  }
};

export const getOrderById = async (orderId: string): Promise<Order | null> => {
  try {
    // In production:
    /*
    const orderDoc = doc(db, 'orders', orderId);
    const orderSnapshot = await getDoc(orderDoc);
    if (orderSnapshot.exists()) {
      return { 
        id: orderSnapshot.id, 
        ...orderSnapshot.data(),
        createdAt: orderSnapshot.data().createdAt?.toDate()
      } as Order;
    }
    return null;
    */
    
    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 500));
    return null;
  } catch (error) {
    console.error('Error fetching order:', error);
    throw new Error('Unable to fetch order details.');
  }
};

export const subscribeToOrderUpdates = (orderId: string, callback: (order: Order | null) => void) => {
  // In production:
  /*
  const orderDoc = doc(db, 'orders', orderId);
  return onSnapshot(orderDoc, (doc) => {
    if (doc.exists()) {
      const order = { 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      } as Order;
      callback(order);
    } else {
      callback(null);
    }
  });
  */
  
  return () => {}; // Return unsubscribe function
};

// Admin functions (for restaurant management)
export const addMenuItem = async (item: Omit<MenuItem, 'id'>): Promise<string> => {
  try {
    const menuCollection = collection(db, 'menuItems');
    const docRef = await addDoc(menuCollection, {
      ...item,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding menu item:', error);
    throw new Error('Failed to add menu item.');
  }
};

export const updateMenuItem = async (id: string, updates: Partial<MenuItem>): Promise<void> => {
  try {
    const itemDoc = doc(db, 'menuItems', id);
    await updateDoc(itemDoc, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating menu item:', error);
    throw new Error('Failed to update menu item.');
  }
};

export const deleteMenuItem = async (id: string): Promise<void> => {
  try {
    const itemDoc = doc(db, 'menuItems', id);
    await deleteDoc(itemDoc);
  } catch (error) {
    console.error('Error deleting menu item:', error);
    throw new Error('Failed to delete menu item.');
  }
};