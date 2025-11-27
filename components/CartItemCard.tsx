import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Minus, Plus, Trash2, MessageSquare } from 'lucide-react-native';
import { CartItem } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface CartItemCardProps {
  item: CartItem;
}

export const CartItemCard: React.FC<CartItemCardProps> = ({ item }) => {
  const { updateQuantity, removeItem, updateSpecialInstructions } = useCart();
  const [showInstructions, setShowInstructions] = useState(false);
  const [instructions, setInstructions] = useState(item.specialInstructions || '');

  const handleIncrease = () => {
    updateQuantity(item.id, item.quantity + 1);
  };

  const handleDecrease = () => {
    if (item.quantity > 1) {
      updateQuantity(item.id, item.quantity - 1);
    } else {
      handleRemove();
    }
  };

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.name} from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive', 
          onPress: () => removeItem(item.id) 
        }
      ]
    );
  };

  const handleInstructionsSubmit = () => {
    updateSpecialInstructions(item.id, instructions);
    setShowInstructions(false);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)} each</Text>
          </View>
          
          <TouchableOpacity onPress={handleRemove} style={styles.removeButton}>
            <Trash2 size={18} color="#FF3B30" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Special Instructions */}
        <View style={styles.instructionsSection}>
          <TouchableOpacity 
            style={styles.instructionsToggle}
            onPress={() => setShowInstructions(!showInstructions)}
          >
            <MessageSquare size={14} color="#4ECDC4" strokeWidth={2} />
            <Text style={styles.instructionsToggleText}>
              {item.specialInstructions ? 'Edit instructions' : 'Add special instructions'}
            </Text>
          </TouchableOpacity>
          
          {item.specialInstructions && !showInstructions && (
            <Text style={styles.currentInstructions}>{item.specialInstructions}</Text>
          )}
          
          {showInstructions && (
            <View style={styles.instructionsInput}>
              <TextInput
                style={styles.textInput}
                value={instructions}
                onChangeText={setInstructions}
                placeholder="e.g., No onions, extra sauce..."
                multiline
                maxLength={100}
              />
              <View style={styles.instructionsButtons}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => {
                    setInstructions(item.specialInstructions || '');
                    setShowInstructions(false);
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.saveButton}
                  onPress={handleInstructionsSubmit}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.footer}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity 
              style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]} 
              onPress={handleDecrease}
            >
              <Minus size={16} color={item.quantity <= 1 ? "#ccc" : "#666"} strokeWidth={2} />
            </TouchableOpacity>
            
            <View style={styles.quantityDisplay}>
              <Text style={styles.quantity}>{item.quantity}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.quantityButton} 
              onPress={handleIncrease}
            >
              <Plus size={16} color="#666" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.total}>${itemTotal.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  image: {
    width: 90,
    height: 90,
    resizeMode: 'cover',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  price: {
    fontSize: 13,
    color: '#666',
  },
  removeButton: {
    padding: 4,
  },
  instructionsSection: {
    marginBottom: 12,
  },
  instructionsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  instructionsToggleText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '500',
  },
  currentInstructions: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 4,
    paddingLeft: 20,
  },
  instructionsInput: {
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 8,
    fontSize: 14,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  instructionsButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  saveButtonText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  quantity: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  totalContainer: {
    alignItems: 'flex-end',
  },
  total: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FF6B35',
  },
});