import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text } from 'react-native';
import { useRouter } from 'expo-router';

// Components
import SearchHeader from '../../../components/molecules/parking/SearchHeader';
import MapSection from '../../../components/molecules/parking/MapSection';
import ParkingsFilterSection from '../../../components/organisms/parking/ParkingsFilterSection';
import ParkingsList from '../../../components/organisms/parking/ParkingsList';

// Types
import { Parking } from '../../../components/molecules/parking/ParkingCard';
import { Filter } from '../../../components/molecules/parking/FilterList';
import Button from '../../../components/atoms/Button';

const FloatingActionButton = ({ title, onPress }: { title: string; onPress: () => void }) => (
  <View className="absolute bottom-6 left-6 right-6 items-center z-10">
    <Text
      className="px-8 py-3 rounded-full border-2 border-axia-purple text-axia-purple font-primaryBold text-base text-center"
      onPress={onPress}
      style={{
        backgroundColor: 'transparent'
      }}
    >
      {title}
    </Text>
  </View>
);

const ParkingsScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const parkingData: Parking[] = [
    {
      id: '1',
      name: 'Estacionamiento La Seriedad',
      hourlyCarRate: 2500,
      hourlyMotorcycleRate: 1800,
      distance: 0.5,
      rating: 4.8,
      availableSpots: 25,
      totalSpots: 50,
      image: 'https://via.placeholder.com/100x80',
      address: 'Calle 123 #45-67, Centro',
      features: ['Cubierto', 'Seguridad 24h', 'Cámaras'],
      isFavorite: true
    },
    {
      id: '2',
      name: 'Estacionamiento La 50',
      hourlyCarRate: 2200,
      hourlyMotorcycleRate: 1500,
      distance: 0.7,
      rating: 4.5,
      availableSpots: 12,
      totalSpots: 40,
      image: 'https://via.placeholder.com/100x80',
      address: 'Carrera 50 #32-18, Zona Rosa',
      features: ['Cubierto', 'Vigilancia', 'Acceso fácil'],
      isFavorite: false
    },
    {
      id: '3',
      name: 'Star Parking',
      hourlyCarRate: 3000,
      hourlyMotorcycleRate: 2000,
      distance: 1.1,
      rating: 4.2,
      availableSpots: 8,
      totalSpots: 60,
      image: 'https://via.placeholder.com/100x80',
      address: 'Avenida Principal #15-30, Norte',
      features: ['Aire libre', 'Seguridad', 'Económico'],
      isFavorite: false
    }
  ];

  const filters: Filter[] = [
    { id: 'all', label: 'Todos', icon: 'grid-outline' },
    { id: 'nearby', label: 'Cercanos', icon: 'location-outline' },
    { id: 'price', label: 'Precio', icon: 'cash-outline' },
    { id: 'rating', label: 'Por calificación', icon: 'star-outline' },
    { id: 'available', label: 'Disponibles', icon: 'checkmark-circle-outline' }
  ];

  const handleParkingPress = (parkingId: string) => {
    router.push(`/parkings/${parkingId}`);
  };

  const handleFavoritePress = (parkingId: string) => {
    // Lógica para agregar/quitar de favoritos
    console.log('Toggle favorite for parking:', parkingId);
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleViewMore = () => {
    // Lógica para ver más parqueaderos
    console.log('Ver más parqueaderos');
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <ScrollView className="flex-1" contentInset={{ top: 15, bottom: 0 }} showsVerticalScrollIndicator={false}>
        {/* Espacio extra arriba */}
        <View className="mt-10">
          <SearchHeader
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </View>

        {/* Mapa */}
        <MapSection
          parkingCount={parkingData.length}
          className="mx-4 mb-6"
        />

        {/* Filtros Scroll horizontal */}
        <ParkingsFilterSection
          filters={filters}
          selectedFilter={selectedFilter}
          onFilterSelect={handleFilterSelect}
        />

        {/* Título lista */}
        <View className="px-4 mb-4 mt-2">
          <Text className="text-white font-primaryBold text-lg mb-1">
            Parqueaderos disponibles
          </Text>
          <View className="flex-row items-center">
            <View className="w-2 h-2 bg-axia-green rounded-full mr-2" />
            <Text className="text-axia-gray font-primary text-sm">
              Ordenados por distancia
            </Text>
          </View>
        </View>

        {/* Lista de parqueaderos */}
        <ParkingsList
          parkings={parkingData}
          onParkingPress={handleParkingPress}
          onFavoritePress={handleFavoritePress}
        />

      {/* Botón flotante */}
      <Button
        variant="primary"
        size='medium'
        className='mb-4 w-full'
        title="Ver más parqueaderos"
        onPress={handleViewMore}
      />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParkingsScreen;
