import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface SearchFormProps {
  onSearch: (searchData: SearchData) => void;
  loading?: boolean;
  containerClassName?: string;
}

interface SearchData {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
}

const SearchForm: React.FC<SearchFormProps> = ({
  onSearch,
  loading = false,
  containerClassName = "",
}) => {
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSearch = () => {
    const searchData: SearchData = {
      location,
      date,
      startTime,
      endTime,
    };
    onSearch(searchData);
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <View className={`bg-white rounded-xl p-4 m-4 shadow-sm ${containerClassName}`}>
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Buscar Parqueadero
      </Text>
      
      <Input
        label="Ubicación"
        placeholder="¿Dónde necesitas parquear?"
        value={location}
        onChangeText={setLocation}
        containerClassName="mb-3"
      />

      <View className="flex-row space-x-3 mb-3">
        <View className="flex-1">
          <Input
            label="Fecha"
            placeholder={getCurrentDate()}
            value={date}
            onChangeText={setDate}
            containerClassName="mb-0"
          />
        </View>
      </View>

      <View className="flex-row space-x-3 mb-4">
        <View className="flex-1">
          <Input
            label="Hora Inicio"
            placeholder="08:00"
            value={startTime}
            onChangeText={setStartTime}
            containerClassName="mb-0"
          />
        </View>
        
        <View className="flex-1">
          <Input
            label="Hora Fin"
            placeholder="18:00"
            value={endTime}
            onChangeText={setEndTime}
            containerClassName="mb-0"
          />
        </View>
      </View>

      <Button
        title="Buscar Parqueaderos"
        onPress={handleSearch}
        loading={loading}
        variant="primary"
        size="lg"
        containerClassName="mt-2"
      />

      <TouchableOpacity
        className="mt-3 py-2 items-center"
        onPress={() => {
          // Funcionalidad para usar ubicación actual
        }}
      >
        <Text className="text-blue-500 font-medium">
          📍 Usar mi ubicación actual
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchForm;
