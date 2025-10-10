import React from 'react';
import { View, Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'car' | 'motorcycle' | 'disabled';
  floor: number;
}

interface Props {
  spot: ParkingSpot;
  isSelected: boolean;
  onPress: (spot: ParkingSpot) => void;
  size?: 'small' | 'medium' | 'large';
}

const ParkingSpot: React.FC<Props> = ({ 
  spot, 
  isSelected, 
  onPress, 
  size = 'medium' 
}) => {
  const isAvailable = spot.status === 'available';
  
  const sizeMap = {
    small: 48,
    medium: 64,
    large: 80
  };

  const iconSizeMap = {
    small: 16,
    medium: 20,
    large: 24
  };

  const getStatusColor = () => {
    switch (spot.status) {
      case 'available': return '#10B981';
      case 'occupied': return '#EF4444';
      case 'reserved': return '#F59E0B';
      case 'maintenance': return '#6B7280';
      default: return '#374151';
    }
  };

  const getTypeIcon = () => {
    switch (spot.type) {
      case 'car': return 'car-sport';
      case 'motorcycle': return 'bicycle';
      case 'disabled': return 'wheelchair';
      default: return 'car-sport';
    }
  };

  return (
    <Pressable
      onPress={() => isAvailable && onPress(spot)}
      disabled={!isAvailable}
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={`rounded-lg items-center justify-center border-2 ${
        isSelected 
          ? 'border-axia-green bg-axia-green/20' 
          : 'border-axia-gray/30'
      } ${isAvailable ? 'active:scale-95' : 'opacity-60'}`}
    >
      <Ionicons
        name={getTypeIcon() as any}
        size={iconSizeMap[size]}
        color={isSelected ? '#10B981' : isAvailable ? getStatusColor() : '#6B7280'}
      />
      <Text className={`text-xs font-primaryBold mt-1 ${
        isSelected ? 'text-axia-green' : 
        isAvailable ? 'text-white' : 'text-axia-gray'
      }`}>
        {spot.number}
      </Text>
      
      {!isAvailable && (
        <View 
          className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-axia-darkGray"
          style={{ backgroundColor: getStatusColor() }}
        />
      )}
    </Pressable>
  );
};

export default ParkingSpot;