import React from 'react';
import { View, Text } from 'react-native';

interface BadgeProps {
  text: string;
  variant?: 'purple' | 'green' | 'blue' | 'gray';
  size?: 'sm' | 'md';
}

const Badge: React.FC<BadgeProps> = ({
  text,
  variant = 'purple',
  size = 'sm'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'green':
        return 'bg-axia-green/20 text-axia-green';
      case 'blue':
        return 'bg-axia-blue/20 text-axia-blue';
      case 'gray':
        return 'bg-axia-gray/20 text-axia-gray';
      default:
        return 'bg-axia-purple/20 text-axia-purple';
    }
  };

  const getSizeStyles = () => {
    return size === 'md' ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs';
  };

  return (
    <View className={`rounded-full ${getVariantStyles()} ${getSizeStyles()}`}>
      <Text className={`font-primary ${getVariantStyles().split(' ')[1]}`}>
        {text}
      </Text>
    </View>
  );
};

export default Badge;