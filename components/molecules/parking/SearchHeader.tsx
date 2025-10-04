import React from 'react';
import { View, Text } from 'react-native';
import Input from '../../atoms/Input';

interface SearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  placeholder?: string;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  placeholder = "Buscar parqueadero cerca de ti"
}) => {
  return (
    <View className="px-4 pt-8 pb-2">
      <Input
        placeholder={placeholder}
        value={searchQuery}
        onChangeText={onSearchChange}
      />
    </View>
  );
};

export default SearchHeader;