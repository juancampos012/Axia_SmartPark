import React, { useState } from 'react';
import { ScrollView, View, Text } from 'react-native';
import SearchForm from '../../../src/components/forms/SearchForm';
import ParkingCard from '../../../src/components/parking/ParkingCard';
import Loading from '../../../src/components/ui/Loading';

interface SearchData {
  location: string;
  date: string;
  startTime: string;
  endTime: string;
}

const Search = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Datos de ejemplo para los parqueaderos
  const mockParkings = [
    {
      id: '1',
      name: 'Centro Comercial Andino',
      address: 'Cra. 11 #82-71, Bogotá',
      distance: '0.5 km',
      availableSpaces: 45,
      totalSpaces: 100,
      pricePerHour: '$3.500',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Torre Empresarial',
      address: 'Cra. 7 #71-52, Bogotá',
      distance: '1.2 km',
      availableSpaces: 8,
      totalSpaces: 50,
      pricePerHour: '$2.800',
      rating: 4.5,
    },
    {
      id: '3',
      name: 'Plaza de la 93',
      address: 'Cra. 13 #93-40, Bogotá',
      distance: '2.1 km',
      availableSpaces: 2,
      totalSpaces: 75,
      pricePerHour: '$4.000',
      rating: 4.7,
    },
  ];

  const handleSearch = async (searchData: SearchData) => {
    setLoading(true);
    setHasSearched(true);
    
    // Simular búsqueda
    setTimeout(() => {
      setSearchResults(mockParkings);
      setLoading(false);
    }, 2000);
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="pt-4">
        <SearchForm 
          onSearch={handleSearch}
          loading={loading}
        />

        {loading && (
          <Loading 
            visible={true}
            overlay={false}
            text="Buscando parqueaderos cercanos..."
            containerClassName="py-8"
          />
        )}

        {hasSearched && !loading && (
          <View className="px-4 pb-4">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              {searchResults.length > 0 
                ? `${searchResults.length} parqueaderos encontrados`
                : 'No se encontraron parqueaderos'
              }
            </Text>

            {searchResults.map((parking) => (
              <ParkingCard
                key={parking.id}
                {...parking}
                containerClassName="mx-0 mb-4"
              />
            ))}
          </View>
        )}

        {!hasSearched && (
          <View className="px-8 py-16 items-center">
            <Text className="text-6xl mb-4">🚗</Text>
            <Text className="text-lg font-semibold text-gray-800 text-center mb-2">
              Encuentra tu parqueadero ideal
            </Text>
            <Text className="text-gray-600 text-center">
              Ingresa tu ubicación y horario para ver opciones disponibles
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Search;