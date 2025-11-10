import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ParkingSpotComponent from '../../atoms/ParkingSpot';

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'car' | 'motorcycle' | 'disabled';
  floor: number;
}

interface Props {
  spots: ParkingSpot[];
  selectedSpot?: ParkingSpot | null;
  onSpotPress: (spot: ParkingSpot) => void;
  title?: string;
  emptyMessage?: string;
}

const { width } = Dimensions.get('window');
const SPOT_SIZE = width < 375 ? 56 : 64;
const SPOT_GAP = width < 375 ? 8 : 12;

const ParkingSpotGrid: React.FC<Props> = ({ 
  spots, 
  selectedSpot, 
  onSpotPress,
  title,
  emptyMessage = 'No hay espacios disponibles'
}) => {
  if (!spots || spots.length === 0) {
    return (
      <View className="items-center justify-center py-12">
        <Ionicons name="car-outline" size={48} color="#6B7280" />
        <Text className="text-axia-gray mt-4 text-lg font-primary text-center">
          {emptyMessage}
        </Text>
      </View>
    );
  }

  return (
    <View className="w-full">
      {title && (
        <Text className="text-white font-primaryBold mb-4 text-center text-lg">
          {title}
        </Text>
      )}
      
      <View className="flex-row flex-wrap justify-center" style={{ gap: SPOT_GAP }}>
        {spots.map((spot) => (
          <ParkingSpotComponent
            key={spot.id}
            spot={spot}
            isSelected={selectedSpot?.id === spot.id}
            onPress={onSpotPress}
            size="medium"
          />
        ))}
      </View>
    </View>
  );
};

export default ParkingSpotGrid;