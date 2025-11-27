import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView,
  Alert 
} from 'react-native';
import { Clock, CheckCircle, Package, Truck } from 'lucide-react-native';

interface MockOrder {
  id: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  items: string[];
  total: number;
  date: string;
}

const MOCK_ORDERS: MockOrder[] = [
  {
    id: 'ORD001',
    status: 'preparing',
    items: ['Margherita Pizza', 'Caesar Salad'],
    total: 21.98,
    date: '2024-01-15 14:30',
  },
  {
    id: 'ORD002',
    status: 'delivered',
    items: ['Chicken Burger', 'Fish & Chips'],
    total: 23.98,
    date: '2024-01-14 18:45',
  },
  {
    id: 'ORD003',
    status: 'confirmed',
    items: ['Pasta Carbonara', 'Chocolate Cake'],
    total: 18.98,
    date: '2024-01-14 12:15',
  },
];

export default function OrdersScreen() {
  const [orders] = useState<MockOrder[]>(MOCK_ORDERS);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color="#FF6B35" strokeWidth={2} />;
      case 'confirmed':
        return <CheckCircle size={20} color="#4ECDC4" strokeWidth={2} />;
      case 'preparing':
        return <Package size={20} color="#FF6B35" strokeWidth={2} />;
      case 'ready':
        return <Truck size={20} color="#4ECDC4" strokeWidth={2} />;
      case 'delivered':
        return <CheckCircle size={20} color="#4CAF50" strokeWidth={2} />;
      default:
        return <Clock size={20} color="#666" strokeWidth={2} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'preparing':
        return 'Being Prepared';
      case 'ready':
        return 'Ready for Pickup';
      case 'delivered':
        return 'Delivered';
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#FF6B35';
      case 'confirmed':
        return '#4ECDC4';
      case 'preparing':
        return '#FF6B35';
      case 'ready':
        return '#4ECDC4';
      case 'delivered':
        return '#4CAF50';
      default:
        return '#666';
    }
  };

  const handleTrackOrder = (orderId: string) => {
    Alert.alert(
      'Order Tracking',
      `Order ${orderId} is being tracked. You'll receive updates via notifications.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Orders</Text>
        <Text style={styles.subtitle}>Track your order status</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {orders.map((order) => (
          <View key={order.id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.statusContainer}>
                {getStatusIcon(order.status)}
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {getStatusText(order.status)}
                </Text>
              </View>
            </View>

            <View style={styles.itemsContainer}>
              <Text style={styles.itemsLabel}>Items:</Text>
              {order.items.map((item, index) => (
                <Text key={index} style={styles.itemText}>• {item}</Text>
              ))}
            </View>

            <View style={styles.orderFooter}>
              <Text style={styles.totalText}>Total: ${order.total.toFixed(2)}</Text>
              {order.status !== 'delivered' && (
                <TouchableOpacity 
                  style={styles.trackButton}
                  onPress={() => handleTrackOrder(order.id)}
                >
                  <Text style={styles.trackButtonText}>Track Order</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}

        {orders.length === 0 && (
          <View style={styles.emptyContainer}>
            <Package size={64} color="#ccc" strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>
              Your order history will appear here
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  orderInfo: {
    flex: 1,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  itemsContainer: {
    marginBottom: 12,
  },
  itemsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FF6B35',
  },
  trackButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  trackButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});