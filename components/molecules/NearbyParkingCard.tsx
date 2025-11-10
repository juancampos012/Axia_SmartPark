import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Parking } from '../../interfaces/parking';

interface NearbyParkingCardProps {
  parking: Parking & { distance?: number };
  onPress: () => void;
}

const NearbyParkingCard: React.FC<NearbyParkingCardProps> = ({ parking, onPress }) => {
  // Calcular porcentaje de disponibilidad (no ocupación)
  const availabilityPercent = parking.totalCapacity > 0
    ? Math.round((parking.availableSpots / parking.totalCapacity) * 100)
    : 0;

  const getAvailabilityColor = () => {
    if (availabilityPercent >= 50) return '#006B54'; // Verde AXIA - Muchos espacios disponibles
    if (availabilityPercent >= 20) return '#F59E0B'; // Amarillo - Pocos espacios
    return '#EF4444'; // Rojo - Muy pocos o ninguno
  };

  return (
    <Pressable
      onPress={onPress}
      className="bg-axia-darkGray rounded-xl p-4 mr-3 w-64 active:scale-95"
    >
      {/* Header */}
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-white text-base font-primaryBold mb-1" numberOfLines={1}>
            {parking.name}
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="location-outline" size={12} color="#6B7280" />
            <Text className="text-axia-gray text-xs font-primary ml-1" numberOfLines={1}>
              {parking.distance ? `${parking.distance.toFixed(1)} km` : parking.address}
            </Text>
          </View>
        </View>
        <View 
          className="px-2 py-1 rounded-lg"
          style={{ backgroundColor: getAvailabilityColor() + '20' }}
        >
          <Text 
            className="text-xs font-primaryBold"
            style={{ color: getAvailabilityColor() }}
          >
            {availabilityPercent}%
          </Text>
        </View>
      </View>

      {/* Info */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="car-outline" size={14} color="#9CA3AF" />
          <Text className="text-white text-sm font-primary ml-1">
            {parking.availableSpots}/{parking.totalCapacity}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Ionicons name="cash-outline" size={14} color="#9CA3AF" />
          <Text className="text-axia-green text-sm font-primaryBold ml-1">
            ${parking.hourlyCarRate}/h
          </Text>
        </View>
      </View>
    </Pressable>
  );
};

export default NearbyParkingCard;
