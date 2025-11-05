import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DistanceProps {
  distance: number;
  unit?: 'km' | 'm';
}

const Distance: React.FC<DistanceProps> = ({
  distance,
  unit = 'km'
}) => {
  // Formatear la distancia para evitar números muy largos
  const formatDistance = () => {
    if (!distance || distance === 0) {
      return '0 km';
    }
    
    if (unit === 'km') {
      // Si es menor a 1 km, mostrar en metros
      if (distance < 1) {
        return `${(distance * 1000).toFixed(0)} m`;
      }
      // Si es mayor a 1 km, mostrar con 1 decimal
      return `${distance.toFixed(1)} km`;
    }
    
    return `${(distance * 1000).toFixed(0)} m`;
  };

  return (
    <View className="flex-row items-center">
      <Ionicons name="location-outline" size={14} color="#8C8C8C" />
      <Text className="text-axia-gray font-primary text-xs ml-1">
        {formatDistance()}
      </Text>
    </View>
  );
};

export default Distance;