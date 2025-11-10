import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';

interface CreditCardProps {
  cardNumber?: string;
  cardholderName?: string;
  expiryDate?: string;
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'unknown' | 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'DINERS';
  variant?: 'default' | 'dark' | 'pink';
  lastFourDigits?: string; // Para compatibilidad con backend
}

const CreditCard: React.FC<CreditCardProps> = ({
  cardNumber = '',
  cardholderName = '',
  expiryDate = '',
  cardType = 'visa',
  variant = 'default',
  lastFourDigits
}) => {
  // Formatear número de tarjeta para mostrar solo los últimos 4 dígitos
  const formatCardNumber = (number: string) => {
    // Si se proporciona lastFourDigits directamente (del backend), usarlo
    if (lastFourDigits) {
      return `•••• •••• •••• ${lastFourDigits}`;
    }
    
    const cleaned = number.replace(/\s/g, '');
    if (cleaned.length === 0) return '•••• •••• •••• ••••';
    if (cleaned.length <= 4) return `•••• •••• •••• ${cleaned}`;
    const lastFour = cleaned.slice(-4);
    return `•••• •••• •••• ${lastFour}`;
  };

  // Formatear fecha de expiración
  const formatExpiryDate = (date: string) => {
    if (!date) return '•• / ••';
    const cleaned = date.replace(/\s/g, '').replace('/', '');
    if (cleaned.length <= 2) return `${cleaned} / ••`;
    return `${cleaned.slice(0, 2)} / ${cleaned.slice(2, 4)}`;
  };
  
  // Normalizar el tipo de tarjeta (convertir a minúsculas)
  const normalizedCardType = cardType.toLowerCase() as 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'unknown';

  // Colores según variante
  const gradientColors = {
    default: ['#8B5CF6', '#4C1D95'] as const, // Púrpura de Axia
    dark: ['#1F2937', '#111827'] as const, // Negro/Gris oscuro
    pink: ['#EC4899', '#BE185D'] as const // Rosa
  };

  return (
    <LinearGradient
      colors={gradientColors[variant]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="w-full h-52 rounded-[28px] p-6 shadow-2xl"
      style={{ elevation: 8, borderRadius: 28 }}
    >
      {/* Header con logo del chip y tipo de tarjeta */}
      <View className="flex-row justify-between items-start mb-15">
        {/* Chip */}
        <View className="w-12 h-10 bg-yellow-400/80 rounded-lg" />
        
        {/* Logo de la tarjeta */}
        <View className="items-center justify-center">
          {normalizedCardType === 'visa' && (
            <FontAwesome name="cc-visa" size={50} color="#FFFFFF" />
          )}
          {normalizedCardType === 'mastercard' && (
            <FontAwesome name="cc-mastercard" size={50} color="#FFFFFF" />
          )}
          {normalizedCardType === 'amex' && (
            <FontAwesome name="cc-amex" size={50} color="#FFFFFF" />
          )}
          {normalizedCardType === 'discover' && (
            <FontAwesome name="cc-discover" size={50} color="#FFFFFF" />
          )}
          {normalizedCardType === 'diners' && (
            <FontAwesome name="cc-diners-club" size={50} color="#FFFFFF" />
          )}
          {normalizedCardType === 'unknown' && (
            <View className="w-12 h-8 bg-white/20 rounded" />
          )}
        </View>
      </View>

      {/* Número de tarjeta */}
      <Text className="text-white text-xl font-mono tracking-wider mb-8">
        {formatCardNumber(cardNumber)}
      </Text>

      {/* Nombre del titular y fecha de expiración */}
      <View className="flex-row justify-between items-end pb-2">
        <View className="flex-1">
          <Text className="text-white/60 text-xs mb-1 font-primary">Cardholder name</Text>
          <Text className="text-white text-base font-primaryBold uppercase">
            {cardholderName || 'YOUR NAME'}
          </Text>
        </View>
        
        <View>
          <Text className="text-white/60 text-xs mb-1 font-primary">Expiry date</Text>
          <Text className="text-white text-base font-primaryBold">
            {formatExpiryDate(expiryDate)}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CreditCard;
