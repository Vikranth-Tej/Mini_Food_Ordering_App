import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Plus, Clock, Star } from 'lucide-react-native';
import { MenuItem } from '@/types';
import { useCart } from '@/contexts/CartContext';

interface MenuItemCardProps {
  item: MenuItem;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 40; // Account for padding

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item }) => {
  const { addItem } = useCart();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = () => {
    if (item.available) {
      addItem(item);
    }
  };

  const formatPreparationTime = (time?: number) => {
    if (!time) return '';
    return `${time} min`;
  };

  return (
    <View style={[styles.card, !item.available && styles.unavailableCard]}>
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }} 
          style={styles.image}
          onLoadStart={() => setImageLoading(true)}
          onLoadEnd={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
        {imageLoading && (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Loading...</Text>
          </View>
        )}
        {imageError && (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>Image unavailable</Text>
          </View>
        )}
        
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        
        {/* Availability Overlay */}
        {!item.available && (
          <View style={styles.unavailableOverlay}>
            <Text style={styles.unavailableText}>Currently Unavailable</Text>
          </View>
        )}
      </View>
      
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <View style={styles.metaInfo}>
              {item.preparationTime && (
                <View style={styles.timeContainer}>
                  <Clock size={12} color="#666" strokeWidth={2} />
                  <Text style={styles.timeText}>{formatPreparationTime(item.preparationTime)}</Text>
                </View>
              )}
              <View style={styles.ratingContainer}>
                <Star size={12} color="#FFD700" strokeWidth={2} fill="#FFD700" />
                <Text style={styles.ratingText}>4.8</Text>
              </View>
            </View>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>{item.description}</Text>
        
        {/* Nutritional Info */}
        {item.nutritionalInfo && (
          <View style={styles.nutritionContainer}>
            <Text style={styles.nutritionText}>
              {item.nutritionalInfo.calories} cal • {item.nutritionalInfo.protein}g protein
            </Text>
          </View>
        )}
        
        <View style={styles.footer}>
          <View style={styles.ingredientsContainer}>
            {item.ingredients && item.ingredients.length > 0 && (
              <Text style={styles.ingredients} numberOfLines={1}>
                {item.ingredients.slice(0, 3).join(', ')}
                {item.ingredients.length > 3 && '...'}
              </Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[
              styles.addButton, 
              !item.available && styles.disabledButton
            ]} 
            onPress={handleAddToCart}
            disabled={!item.available}
            activeOpacity={0.8}
          >
            <Plus size={20} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
    width: cardWidth,
  },
  unavailableCard: {
    opacity: 0.7,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#666',
    fontSize: 14,
  },
  categoryBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(255, 107, 53, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  unavailableOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unavailableText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    lineHeight: 24,
    marginBottom: 4,
  },
  metaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FF6B35',
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  nutritionContainer: {
    marginBottom: 12,
  },
  nutritionText: {
    fontSize: 12,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ingredientsContainer: {
    flex: 1,
    marginRight: 12,
  },
  ingredients: {
    fontSize: 12,
    color: '#999',
    fontStyle: 'italic',
  },
  addButton: {
    backgroundColor: '#FF6B35',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
});