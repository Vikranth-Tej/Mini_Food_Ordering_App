import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { X, User, Phone, MapPin, CreditCard, Clock } from 'lucide-react-native';
import { CartItem } from '@/types';
import { createOrder } from '@/services/firebase';

interface OrderConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  tax: number;
  deliveryFee: number;
  grandTotal: number;
  onOrderSuccess: (orderId: string) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  visible,
  onClose,
  items,
  total,
  tax,
  deliveryFee,
  grandTotal,
  onOrderSuccess
}) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'digital'>('card');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = async () => {
    // Validation
    if (!customerInfo.name.trim()) {
      Alert.alert('Missing Information', 'Please enter your name.');
      return;
    }
    
    if (!customerInfo.phone.trim()) {
      Alert.alert('Missing Information', 'Please enter your phone number.');
      return;
    }
    
    if (!customerInfo.address.trim()) {
      Alert.alert('Missing Information', 'Please enter your delivery address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        items,
        total: grandTotal,
        status: 'pending' as const,
        customerInfo: {
          name: customerInfo.name.trim(),
          phone: customerInfo.phone.trim(),
          email: customerInfo.email.trim(),
          address: customerInfo.address.trim()
        },
        paymentMethod,
        orderNotes: orderNotes.trim()
      };

      const orderId = await createOrder(orderData);
      onOrderSuccess(orderId);
      onClose();
      
      // Reset form
      setCustomerInfo({ name: '', phone: '', email: '', address: '' });
      setOrderNotes('');
      setPaymentMethod('card');
      
    } catch (error) {
      Alert.alert(
        'Order Failed', 
        error instanceof Error ? error.message : 'Failed to place order. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedDeliveryTime = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes from now

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Confirm Your Order</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#333" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Summary</Text>
            {items.map((item) => (
              <View key={item.id} style={styles.orderItem}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDetails}>
                  {item.quantity}x ${item.price.toFixed(2)} = ${(item.quantity * item.price).toFixed(2)}
                </Text>
                {item.specialInstructions && (
                  <Text style={styles.specialInstructions}>Note: {item.specialInstructions}</Text>
                )}
              </View>
            ))}
            
            <View style={styles.totalsContainer}>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Tax</Text>
                <Text style={styles.totalValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Delivery Fee</Text>
                <Text style={styles.totalValue}>${deliveryFee.toFixed(2)}</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotalRow]}>
                <Text style={styles.grandTotalLabel}>Total</Text>
                <Text style={styles.grandTotalValue}>${grandTotal.toFixed(2)}</Text>
              </View>
            </View>
          </View>

          {/* Customer Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Delivery Information</Text>
            
            <View style={styles.inputContainer}>
              <User size={20} color="#666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Full Name *"
                value={customerInfo.name}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, name: text }))}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Phone size={20} color="#666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Phone Number *"
                value={customerInfo.phone}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, phone: text }))}
                keyboardType="phone-pad"
              />
            </View>
            
            <View style={styles.inputContainer}>
              <MapPin size={20} color="#666" strokeWidth={2} />
              <TextInput
                style={styles.input}
                placeholder="Delivery Address *"
                value={customerInfo.address}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, address: text }))}
                multiline
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email (Optional)</Text>
              <TextInput
                style={[styles.input, styles.emailInput]}
                placeholder="your@email.com"
                value={customerInfo.email}
                onChangeText={(text) => setCustomerInfo(prev => ({ ...prev, email: text }))}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Payment Method */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.paymentOptions}>
              {[
                { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                { id: 'cash', label: 'Cash on Delivery', icon: null },
                { id: 'digital', label: 'Digital Wallet', icon: null }
              ].map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.paymentOption,
                    paymentMethod === option.id && styles.selectedPaymentOption
                  ]}
                  onPress={() => setPaymentMethod(option.id as any)}
                >
                  {option.icon && <option.icon size={20} color="#666" strokeWidth={2} />}
                  <Text style={[
                    styles.paymentOptionText,
                    paymentMethod === option.id && styles.selectedPaymentOptionText
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Order Notes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="Any special instructions for your order..."
              value={orderNotes}
              onChangeText={setOrderNotes}
              multiline
              maxLength={200}
            />
          </View>

          {/* Estimated Delivery Time */}
          <View style={styles.section}>
            <View style={styles.deliveryTimeContainer}>
              <Clock size={20} color="#4ECDC4" strokeWidth={2} />
              <Text style={styles.deliveryTimeText}>
                Estimated delivery: {estimatedDeliveryTime.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.submitButton, isSubmitting && styles.submittingButton]}
            onPress={handleSubmitOrder}
            disabled={isSubmitting}
          >
            <Text style={styles.submitButtonText}>
              {isSubmitting ? 'Placing Order...' : `Place Order • $${grandTotal.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  orderItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 14,
    color: '#666',
  },
  specialInstructions: {
    fontSize: 12,
    color: '#4ECDC4',
    fontStyle: 'italic',
    marginTop: 2,
  },
  totalsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: '#666',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emailInput: {
    marginTop: 4,
  },
  paymentOptions: {
    gap: 8,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    gap: 12,
  },
  selectedPaymentOption: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
  },
  paymentOptionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  selectedPaymentOptionText: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  deliveryTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FFFE',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  deliveryTimeText: {
    fontSize: 16,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  submitButton: {
    backgroundColor: '#FF6B35',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submittingButton: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});