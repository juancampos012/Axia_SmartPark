import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RatingProps {
  rating: number;
  showNumber?: boolean;
  size?: 'sm' | 'md';
}

const Rating: React.FC<RatingProps> = ({
  rating,
  showNumber = true,
  size = 'sm'
}) => {
  const iconSize = size === 'md' ? 16 : 14;
  const textSize = size === 'md' ? 'text-base' : 'text-sm';

  return (
    <View className="flex-row items-center">
      <Ionicons name="star" size={iconSize} color="#f59e0b" />
      {showNumber && (
        <Text className={`text-axia-gray font-primary ${textSize} ml-1`}>
          {rating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

export default Rating;