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
  const displayDistance = unit === 'km' 
    ? `${distance} km` 
    : `${(distance * 1000).toFixed(0)} m`;

  return (
    <View className="flex-row items-center">
      <Ionicons name="location-outline" size={14} color="#8C8C8C" />
      <Text className="text-axia-gray font-primary text-sm ml-1">
        {displayDistance}
      </Text>
    </View>
  );
};

export default Distance;