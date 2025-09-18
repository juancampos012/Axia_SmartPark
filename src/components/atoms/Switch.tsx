import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SwitchProps {
  value: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  disabled = false,
  label,
  className = ''
}) => {
  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <View className={`flex-row items-center justify-between ${className}`}>
      {label && (
        <Text className="text-white text-base font-medium flex-1 mr-4">
          {label}
        </Text>
      )}
      
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        className={`
          w-12 h-6 rounded-full p-1 flex-row items-center
          ${value ? 'bg-axia-green' : 'bg-gray-600'}
          ${disabled ? 'opacity-50' : ''}
        `}
      >
        <View
          className={`
            w-4 h-4 rounded-full bg-white transition-all duration-200
            ${value ? 'ml-auto' : 'ml-0'}
          `}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Switch;