import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { PaymentMethodResponse, cardBrandToComponentType } from '../../interfaces/paymentMethod';

export interface SavedCardData {
  id: string;
  lastFourDigits: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'unknown';
  variant?: 'default' | 'dark' | 'pink';
  isDefault?: boolean;
}

/**
 * Helper para convertir PaymentMethodResponse a SavedCardData
 */
export const paymentMethodToSavedCard = (method: PaymentMethodResponse): SavedCardData => {
  return {
    id: method.id,
    lastFourDigits: method.lastFourDigits,
    cardholderName: method.cardholderName,
    expiryMonth: method.expiryMonth.toString().padStart(2, '0'),
    expiryYear: method.expiryYear.toString().slice(-2),
    cardType: cardBrandToComponentType(method.cardBrand),
    variant: method.isDefault ? 'default' : 'dark',
    isDefault: method.isDefault
  };
};

interface SavedCardProps {
  card: SavedCardData;
  isSelected: boolean;
  onPress: () => void;
}

const SavedCard: React.FC<SavedCardProps> = ({ card, isSelected, onPress }) => {
  const gradientColors = {
    default: ['#8B5CF6', '#4C1D95'],
    dark: ['#1F2937', '#111827'],
    pink: ['#EC4899', '#BE185D']
  };

  const variant = card.variant || 'default';

  return (
    <Pressable onPress={onPress} className="mb-4">
      <LinearGradient
        colors={gradientColors[variant] as [string, string]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="rounded-2xl p-4 shadow-lg"
        style={{ elevation: 4 }}
      >
        <View className="flex-row justify-between items-center">
          {/* Información de la tarjeta */}
          <View className="flex-row items-center flex-1">
            {/* Chip pequeño */}
            <View className="w-8 h-6 bg-yellow-400/80 rounded mr-4" />
            
            <View className="flex-1">
              {/* Logo del tipo de tarjeta */}
              <View className="mb-1">
                {card.cardType === 'visa' && (
                  <FontAwesome name="cc-visa" size={32} color="#FFFFFF" />
                )}
                {card.cardType === 'mastercard' && (
                  <FontAwesome name="cc-mastercard" size={32} color="#FFFFFF" />
                )}
                {card.cardType === 'amex' && (
                  <FontAwesome name="cc-amex" size={32} color="#FFFFFF" />
                )}
                {card.cardType === 'discover' && (
                  <FontAwesome name="cc-discover" size={32} color="#FFFFFF" />
                )}
                {card.cardType === 'diners' && (
                  <FontAwesome name="cc-diners-club" size={32} color="#FFFFFF" />
                )}
              </View>
              
              {/* Últimos 4 dígitos */}
              <Text className="text-white text-base font-mono">
                •••• •••• •••• {card.lastFourDigits}
              </Text>
              
              {/* Nombre y fecha */}
              <View className="flex-row mt-2">
                <Text className="text-white/80 text-sm font-primary uppercase mr-4">
                  {card.cardholderName}
                </Text>
                <Text className="text-white/80 text-sm font-primary">
                  {card.expiryMonth} / {card.expiryYear}
                </Text>
              </View>
            </View>
          </View>

          {/* Radio button */}
          <View className={`w-6 h-6 rounded-full border-2 ${isSelected ? 'border-axia-green bg-axia-green' : 'border-white'} items-center justify-center`}>
            {isSelected && (
              <Ionicons name="checkmark" size={16} color="white" />
            )}
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

export default SavedCard;
