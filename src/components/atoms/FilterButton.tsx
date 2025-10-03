import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FilterButtonProps {
  id: string;
  label: string;
  icon: string;
  isSelected: boolean;
  onPress: (id: string) => void;
}

const FilterButton: React.FC<FilterButtonProps> = ({
  id,
  label,
  icon,
  isSelected,
  onPress
}) => {
  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      className={`flex-row items-center px-4 py-2 rounded-full mr-3 ${
        isSelected 
          ? 'bg-axia-green' 
          : 'bg-axia-darkGray border border-axia-gray/30'
      }`}
    >
      <Ionicons 
        name={icon as any} 
        size={16} 
        color={isSelected ? '#FFFFFF' : '#8C8C8C'} 
      />
      <Text className={`font-primary text-sm ml-2 ${
        isSelected ? 'text-white' : 'text-axia-gray'
      }`}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export default FilterButton;