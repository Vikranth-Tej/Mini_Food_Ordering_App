import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { ChefHat, ShoppingCart, ClipboardList } from 'lucide-react-native';
import { useCart } from '@/contexts/CartContext';

function TabBarIcon({ icon: Icon, color, size }: { icon: any; color: string; size: number }) {
  return <Icon color={color} size={size} strokeWidth={2} />;
}

function CartTabIcon({ color, size }: { color: string; size: number }) {
  const { getCartItemsCount } = useCart();
  const itemCount = getCartItemsCount();

  return (
    <>
      <ShoppingCart color={color} size={size} strokeWidth={2} />
      {itemCount > 0 && (
        <Text style={{
          position: 'absolute',
          top: -2,
          right: -6,
          backgroundColor: '#FF3B30',
          color: '#fff',
          fontSize: 10,
          fontWeight: '600',
          paddingHorizontal: 4,
          paddingVertical: 1,
          borderRadius: 8,
          minWidth: 16,
          textAlign: 'center',
        }}>
          {itemCount > 99 ? '99+' : itemCount}
        </Text>
      )}
    </>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Menu',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={ChefHat} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="cart"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color, size }) => (
            <CartTabIcon color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon icon={ClipboardList} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}