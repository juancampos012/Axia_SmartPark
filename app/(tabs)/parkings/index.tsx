import React, { useState, useMemo, useEffect } from 'react';
import { ScrollView, View, Text, Pressable, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Components
import MapSection from '../../../components/molecules/parking/MapSection';
import ParkingsFilterSection from '../../../components/organisms/parking/ParkingsFilterSection';
import ParkingsList from '../../../components/organisms/parking/ParkingsList';

// Services
import { fetchAllParkings } from '../../../libs/parking';
import { Parking } from '../../../interfaces/parking';
import { Filter } from '../../../components/molecules/parking/FilterList';

const ParkingsScreen = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [parkingData, setParkingData] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del backend
  const loadParkings = async () => {
    try {
      setLoading(true);
      setError(null);
      const parkings = await fetchAllParkings();
      
      // Los datos ya vienen transformados del servicio
      setParkingData(parkings);
      
      console.log('Total parkings loaded:', parkings.length);
      parkings.forEach(p => {
        console.log(`Parking ${p.name}:`, {
          capacity: p.totalCapacity,
          available: p.availableSpots,
          rate: p.hourlyCarRate,
          status: p.status,
          floors: p.floors,
          rating: p.rating
        });
      });
      
    } catch (err) {
      console.error('Error loading parkings:', err);
      setError(err instanceof Error ? err.message : 'Error loading parkings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParkings();
  }, []);

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

    // Aplicar filtros basados en datos reales del backend
    switch (selectedFilter) {
      case 'nearby':
        result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'price':
        result.sort((a, b) => a.hourlyCarRate - b.hourlyCarRate);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'available':
        // Filtrar solo los que tienen spots disponibles
        result = result.filter(parking => parking.availableSpots > 0);
        result.sort((a, b) => b.availableSpots - a.availableSpots);
        break;
      default:
        // 'all' - orden por defecto (distancia)
        result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
    }

    // Actualizar estado de favoritos con datos reales del backend
    return result.map(parking => ({
      ...parking,
      isFavorite: favorites.has(parking.id),
      // Asegurar que todos los campos requeridos estén presentes
      totalSpots: parking.totalCapacity, // Usar totalCapacity del backend
      availableSpots: parking.availableSpots,
      hourlyCarRate: parking.hourlyCarRate,
      hourlyMotorcycleRate: parking.hourlyMotorcycleRate,
      rating: parking.rating,
      ratingCount: parking.ratingCount,
      distance: parking.distance,
      features: parking.features,
      status: parking.status,
      schedule: parking.schedule,
      // Campos que ya vienen del backend
      id: parking.id,
      name: parking.name,
      address: parking.address,
      description: parking.description,
      image: parking.image,
      latitude: parking.latitude,
      longitude: parking.longitude,
      floors: parking.floors,
      actualCapacity: parking.actualCapacity,
      dailyRate: parking.dailyRate,
      monthlyRate: parking.monthlyRate,
      parkingFloors: parking.parkingFloors,
      parkingSpots: parking.parkingSpots
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
        return 'Ordenados por proximidad';
    }
  };

  const handleParkingPress = (parkingId: string) => {
    const parking = filteredAndSortedParkings.find(p => p.id === parkingId);
    if (parking) {
      router.push({
        pathname: `/parkings/${parking.id}`,
        params: { 
          parkingData: JSON.stringify(parking) 
        },
      });
    }
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleViewMore = () => {
    console.log('Ver más parqueaderos');
    // Aquí podrías cargar más datos si implementas paginación
  };

  const handleRetry = () => {
    loadParkings();
  };

  // Calcular estadísticas basadas en datos reales
  const statistics = useMemo(() => {
    const totalParkings = parkingData.length;
    const available24h = parkingData.filter(p => 
      p.schedule?.toLowerCase().includes('24') || 
      p.schedule?.toLowerCase().includes('todo el día')
    ).length;
    const openParkings = parkingData.filter(p => p.status === 'OPEN').length;
    const totalAvailableSpots = parkingData.reduce((sum, p) => sum + p.availableSpots, 0);

    return {
      totalParkings,
      available24h,
      openParkings,
      totalAvailableSpots
    };
  }, [parkingData]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-white text-lg font-primary mt-4">
          Cargando parqueaderos...
        </Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <View className="items-center px-6">
          <Ionicons name="warning-outline" size={48} color="#EF4444" />
          <Text className="text-white text-lg font-primaryBold mt-4 text-center">
            Error al cargar parqueaderos
          </Text>
          <Text className="text-axia-gray text-sm font-primary mt-2 text-center">
            {error}
          </Text>
          <Pressable
            onPress={handleRetry}
            className="bg-axia-green px-6 py-3 rounded-xl mt-6"
          >
            <Text className="text-axia-black font-primaryBold">Reintentar</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

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
              <Text className="text-axia-gray text-sm font-primary">
                {statistics.totalParkings} parqueaderos disponibles en tu zona
              </Text>
            </View>
          </View>

          {/* Statistics Section */}
          <View className="px-6 mb-6">
            <View className="flex-row justify-between bg-axia-darkGray rounded-2xl p-4 shadow-lg shadow-black/50">
              <View className="items-center flex-1">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="car-sport" size={16} color="#10B981" />
                  <Text className="text-white font-primaryBold text-lg ml-2">
                    {statistics.totalAvailableSpots}
                  </Text>
                </View>
                <Text className="text-axia-gray text-xs font-primary text-center">
                  Espacios libres
                </Text>
              </View>
              
              <View className="w-px bg-axia-border/30" />
              
              <View className="items-center flex-1">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="time" size={16} color="#F59E0B" />
                  <Text className="text-white font-primaryBold text-lg ml-2">
                    {statistics.available24h}
                  </Text>
                </View>
                <Text className="text-axia-gray text-xs font-primary text-center">
                  24/7
                </Text>
              </View>
              
              <View className="w-px bg-axia-border/30" />
              
              <View className="items-center flex-1">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                  <Text className="text-white font-primaryBold text-lg ml-2">
                    {statistics.openParkings}
                  </Text>
                </View>
                <Text className="text-axia-gray text-xs font-primary text-center">
                  Abiertos
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

          {/* Filters Section */}
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

          {/* Parkings List Section */}
          <View className="mb-8">
            <View className="px-6 mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-white text-xl font-primaryBold">
                  Parqueaderos Disponibles
                </Text>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-axia-green rounded-full mr-2" />
                  <Text className="text-axia-gray font-primary text-sm">
                    {getOrderText()}
                  </Text>
                </View>
              </View>
              <Text className="text-axia-gray text-sm font-primary">
                {filteredAndSortedParkings.length} parqueaderos encontrados
              </Text>
            </View>

            <ParkingsList
              parkings={filteredAndSortedParkings}
              onParkingPress={handleParkingPress} 
              onFavoritePress={handleFavoritePress}
            />
          </View>

          {/* Explore More Button */}
          <View className="px-6 mb-8">
            <Pressable
              onPress={handleViewMore}
              className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="search" size={20} color="#fff" />
                <Text className="text-white font-primaryBold text-lg ml-2">
                  Explorar más parqueaderos
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Empty State */}
          {filteredAndSortedParkings.length === 0 && (
            <View className="px-6 mb-8">
              <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
                <Ionicons name="search-outline" size={48} color="#6B7280" />
                <Text className="text-white text-lg font-primaryBold mt-4 mb-2 text-center">
                  No se encontraron parqueaderos
                </Text>
                <Text className="text-axia-gray text-sm font-primary text-center">
                  Intenta ajustar los filtros o buscar en otra zona
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