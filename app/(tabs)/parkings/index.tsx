import React, { useState, useMemo } from 'react';
import { ScrollView, View, Text, Pressable, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Components
import MapSection from '../../../components/molecules/parking/MapSection';
import ParkingsFilterSection from '../../../components/organisms/parking/ParkingsFilterSection';
import ParkingsList from '../../../components/organisms/parking/ParkingsList';

// Types
import { Parking } from '../../../components/molecules/parking/ParkingCard';
import { Filter } from '../../../components/molecules/parking/FilterList';

const ParkingsScreen = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1'])); // Inicial con el primer parking como favorito

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
      image: '',
      address: 'Calle 123 #45-67, Centro',
      features: ['Cubierto', 'Seguridad 24h', 'Cámaras'],
      isFavorite: false
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
      image: '',
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
      image: '',
      address: 'Avenida Principal #15-30, Norte',
      features: ['Aire libre', 'Seguridad', 'Económico'],
      isFavorite: false
    },
    {
      id: '4',
      name: 'Premium Parking',
      hourlyCarRate: 3500,
      hourlyMotorcycleRate: 2200,
      distance: 1.5,
      rating: 4.9,
      availableSpots: 5,
      totalSpots: 20,
      image: '',
      address: 'Av. Luxury #100-25, Norte',
      features: ['Cubierto', 'Valet', 'Lavado incluido'],
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

  // Función para manejar favoritos
  const handleFavoritePress = (parkingId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(parkingId)) {
        newFavorites.delete(parkingId);
      } else {
        newFavorites.add(parkingId);
      }
      return newFavorites;
    });
  };

  // Filtrar y ordenar parqueaderos según búsqueda y filtro seleccionado
  const filteredAndSortedParkings = useMemo(() => {
    let result = [...parkingData];

    // Aplicar filtros
    switch (selectedFilter) {
      case 'nearby':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'price':
        result.sort((a, b) => a.hourlyCarRate - b.hourlyCarRate);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'available':
        result.sort((a, b) => b.availableSpots - a.availableSpots);
        break;
      default:
        // 'all' - orden por defecto (distancia)
        result.sort((a, b) => a.distance - b.distance);
        break;
    }

    // Actualizar estado de favoritos
    return result.map(parking => ({
      ...parking,
      isFavorite: favorites.has(parking.id)
    }));
  }, [parkingData, selectedFilter, favorites]);

  const getOrderText = () => {
    switch (selectedFilter) {
      case 'nearby':
        return 'Ordenados por distancia';
      case 'price':
        return 'Ordenados por precio';
      case 'rating':
        return 'Ordenados por calificación';
      case 'available':
        return 'Ordenados por disponibilidad';
      default:
        return 'Ordenados por defecto';
    }
  };

  const handleParkingPress = (parkingId: string) => {
    router.push(`/parkings/${parkingId}`);
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleViewMore = () => {
    console.log('Ver más parqueaderos');
    // Aquí puedes implementar la lógica para cargar más parqueaderos
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior="padding"
      >
      <ScrollView 
        className="flex-1" 
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View className="px-6 pt-8 pb-4">
          <View className="mb-3">
            <Text className="text-white text-3xl font-primaryBold mb-2">
              Encuentra tu Parqueadero
            </Text>
          </View>
        </View>

        <View className="px-6 mb-6">
          <View className="flex-row justify-between bg-axia-darkGray rounded-2xl p-4 shadow-lg shadow-black/50">
            <View className="items-center flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name="car-sport" size={16} color="#10B981" />
                <Text className="text-white font-primaryBold text-lg ml-2">
                  {filteredAndSortedParkings.length}
                </Text>
              </View>
              <Text className="text-axia-gray text-xs font-primary text-center">
                Disponibles
              </Text>
            </View>
            
            <View className="w-px bg-axia-border/30" />
            
            <View className="items-center flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name="time" size={16} color="#F59E0B" />
                <Text className="text-white font-primaryBold text-lg ml-2">
                  24/7
                </Text>
              </View>
              <Text className="text-axia-gray text-xs font-primary text-center">
                Abiertos
              </Text>
            </View>
            
            <View className="w-px bg-axia-border/30" />
            
            <View className="items-center flex-1">
              <View className="flex-row items-center mb-1">
                <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                <Text className="text-white font-primaryBold text-lg ml-2">
                  {filteredAndSortedParkings.filter(p => p.features.includes('Seguridad') || p.features.includes('Vigilancia')).length}
                </Text>
              </View>
              <Text className="text-axia-gray text-xs font-primary text-center">
                Seguros
              </Text>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View className="mb-6">
          <View className="px-6 mb-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-xl font-primaryBold">
                Ubicación en Mapa
              </Text>
              <View className="flex-row items-center bg-axia-green/20 px-3 py-1 rounded-full">
                <Ionicons name="navigate" size={14} color="#10B981" />
                <Text className="text-axia-green text-sm font-primaryBold ml-1">
                  En tiempo real
                </Text>
              </View>
            </View>
          </View>
          <MapSection
            parkingCount={filteredAndSortedParkings.length}
            className="mx-4"
          />
        </View>

        <View className="mb-6">
          <View className="px-6 mb-5">         
            <Text className="text-white text-xl font-primaryBold mb-2">
              Filtrar por
            </Text>
          </View>   
          <ParkingsFilterSection
            filters={filters}
            selectedFilter={selectedFilter}
            onFilterSelect={handleFilterSelect}
          />
        </View>

        <View className="mb-8">
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-white text-xl font-primaryBold">
                {'Recomendados'}
              </Text>
              <View className="flex-row items-center">
                <View className="w-2 h-2 bg-axia-green rounded-full mr-2" />
                <Text className="text-axia-gray font-primary text-sm">
                  {getOrderText()}
                </Text>
              </View>
            </View>
            <Text className="text-axia-gray text-sm font-primary">
              {filteredAndSortedParkings.length} parqueaderos {'encontrados'}
            </Text>
          </View>

          <ParkingsList
            parkings={filteredAndSortedParkings}
            onParkingPress={handleParkingPress}
            onFavoritePress={handleFavoritePress}
          />
        </View>

        <View className="px-6 mb-8">
          <Pressable
            onPress={handleViewMore}
            className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95 "
          >
            <View className="flex-row items-center justify-center">
              <Ionicons name="search" size={20} color="#000000" />
              <Text className="text-axia-black font-primaryBold text-lg ml-2">
                Explorar más parqueaderos
              </Text>
            </View>
          </Pressable>
        </View>

        {filteredAndSortedParkings.length === 0 && (
          <View className="px-6 mb-8">
            <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
              <Ionicons name="search-outline" size={48} color="#6B7280" />
              <Text className="text-white text-lg font-primaryBold mt-4 mb-2 text-center">
                No se encontraron parqueaderos
              </Text>
              <Text className="text-axia-gray text-sm font-primary text-center">
                Intenta con otros términos de búsqueda o ajusta los filtros
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ParkingsScreen;