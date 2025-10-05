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

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'car' | 'motorcycle' | 'disabled';
  floor: number;
}

interface Floor {
  id: string;
  number: number;
  name: string;
  totalSpots: number;
  availableSpots: number;
  spots: ParkingSpot[];
}

interface ExtendedParking extends Parking {
  floors: Floor[];
  operatingHours: string;
  security: boolean;
  covered: boolean;
  open24h: boolean;
  description: string;
}

const ParkingsScreen = () => {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1']));

  const parkingData: ExtendedParking[] = [
    {
      id: '1',
      name: 'Estacionamiento La Seriedad',
      hourlyCarRate: 2500,
      hourlyMotorcycleRate: 1800,
      distance: 0.5,
      rating: 4.8,
      availableSpots: 25,
      totalSpots: 50,
      image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
      address: 'Calle 123 #45-67, Centro',
      features: ['Cubierto', 'Seguridad 24h', 'Cámaras', 'Ascensor'],
      isFavorite: false,
      floors: [
        {
          id: '1-1',
          number: 1,
          name: 'Piso 1 - Principal',
          totalSpots: 10,
          availableSpots: 6,
          spots: [
            { id: '1-1', number: 'A1', status: 'available', type: 'car', floor: 1 },
            { id: '1-2', number: 'A2', status: 'occupied', type: 'car', floor: 1 },
            { id: '1-3', number: 'A3', status: 'available', type: 'car', floor: 1 },
            { id: '1-4', number: 'A4', status: 'reserved', type: 'car', floor: 1 },
            { id: '1-5', number: 'A5', status: 'available', type: 'motorcycle', floor: 1 },
            { id: '1-6', number: 'A6', status: 'maintenance', type: 'car', floor: 1 },
            { id: '1-7', number: 'A7', status: 'available', type: 'car', floor: 1 },
            { id: '1-8', number: 'A8', status: 'occupied', type: 'car', floor: 1 },
            { id: '1-9', number: 'A9', status: 'available', type: 'disabled', floor: 1 },
            { id: '1-10', number: 'A10', status: 'available', type: 'car', floor: 1 },
          ]
        },
        {
          id: '1-2',
          number: 2,
          name: 'Piso 2 - Cubierto',
          totalSpots: 5,
          availableSpots: 4,
          spots: [
            { id: '2-1', number: 'B1', status: 'available', type: 'car', floor: 2 },
            { id: '2-2', number: 'B2', status: 'available', type: 'car', floor: 2 },
            { id: '2-3', number: 'B3', status: 'occupied', type: 'car', floor: 2 },
            { id: '2-4', number: 'B4', status: 'available', type: 'motorcycle', floor: 2 },
            { id: '2-5', number: 'B5', status: 'available', type: 'car', floor: 2 },
          ]
        },
        {
          id: '1-3',
          number: 3,
          name: 'Piso 3 - Premium',
          totalSpots: 3,
          availableSpots: 2,
          spots: [
            { id: '3-1', number: 'C1', status: 'available', type: 'car', floor: 3 },
            { id: '3-2', number: 'C2', status: 'occupied', type: 'car', floor: 3 },
            { id: '3-3', number: 'C3', status: 'available', type: 'car', floor: 3 },
          ]
        }
      ],
      operatingHours: '24/7',
      security: true,
      covered: true,
      open24h: true,
      description: 'Estacionamiento moderno con 3 pisos de parqueo, seguridad las 24 horas y sistema de cámaras de vigilancia.'
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
      image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
      address: 'Carrera 50 #32-18, Zona Rosa',
      features: ['Cubierto', 'Vigilancia', 'Acceso fácil', 'Iluminación LED'],
      isFavorite: false,
      floors: [
        {
          id: '2-1',
          number: 1,
          name: 'Piso Único',
          totalSpots: 40,
          availableSpots: 12,
          spots: [
            { id: '2-1-1', number: 'P1', status: 'available', type: 'car', floor: 1 },
            { id: '2-1-2', number: 'P2', status: 'occupied', type: 'car', floor: 1 },
            { id: '2-1-3', number: 'P3', status: 'available', type: 'motorcycle', floor: 1 },
            { id: '2-1-4', number: 'P4', status: 'available', type: 'car', floor: 1 },
            { id: '2-1-5', number: 'P5', status: 'reserved', type: 'car', floor: 1 },
          ]
        }
      ],
      operatingHours: '6:00 AM - 10:00 PM',
      security: true,
      covered: true,
      open24h: false,
      description: 'Estacionamiento de un solo piso con fácil acceso y vigilancia permanente.'
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
      image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
      address: 'Avenida Principal #15-30, Norte',
      features: ['Aire libre', 'Seguridad', 'Económico', 'Amplio'],
      isFavorite: false,
      floors: [
        {
          id: '3-1',
          number: 1,
          name: 'Nivel Exterior',
          totalSpots: 40,
          availableSpots: 5,
          spots: [
            { id: '3-1-1', number: 'E1', status: 'available', type: 'car', floor: 1 },
            { id: '3-1-2', number: 'E2', status: 'occupied', type: 'car', floor: 1 },
            { id: '3-1-3', number: 'E3', status: 'available', type: 'motorcycle', floor: 1 },
          ]
        },
        {
          id: '3-2',
          number: 2,
          name: 'Nivel Interior',
          totalSpots: 20,
          availableSpots: 3,
          spots: [
            { id: '3-2-1', number: 'I1', status: 'available', type: 'car', floor: 2 },
            { id: '3-2-2', number: 'I2', status: 'occupied', type: 'car', floor: 2 },
            { id: '3-2-3', number: 'I3', status: 'available', type: 'car', floor: 2 },
          ]
        }
      ],
      operatingHours: '5:00 AM - 11:00 PM',
      security: true,
      covered: false,
      open24h: false,
      description: 'Estacionamiento al aire libre con dos niveles, ideal para estadías cortas.'
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
      image: 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
      address: 'Av. Luxury #100-25, Norte',
      features: ['Cubierto', 'Valet', 'Lavado incluido', 'Climatizado'],
      isFavorite: false,
      floors: [
        {
          id: '4-1',
          number: 1,
          name: 'Planta Baja - VIP',
          totalSpots: 10,
          availableSpots: 2,
          spots: [
            { id: '4-1-1', number: 'V1', status: 'available', type: 'car', floor: 1 },
            { id: '4-1-2', number: 'V2', status: 'reserved', type: 'car', floor: 1 },
            { id: '4-1-3', number: 'V3', status: 'available', type: 'car', floor: 1 },
          ]
        },
        {
          id: '4-2',
          number: 2,
          name: 'Sótano - Ejecutivo',
          totalSpots: 10,
          availableSpots: 3,
          spots: [
            { id: '4-2-1', number: 'S1', status: 'occupied', type: 'car', floor: 2 },
            { id: '4-2-2', number: 'S2', status: 'available', type: 'car', floor: 2 },
            { id: '4-2-3', number: 'S3', status: 'available', type: 'car', floor: 2 },
          ]
        }
      ],
      operatingHours: '24/7',
      security: true,
      covered: true,
      open24h: true,
      description: 'Estacionamiento premium con servicio de valet parking y lavado incluido.'
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
    const parking = filteredAndSortedParkings.find(p => p.id === parkingId);
    if (parking) {
      router.push({
        pathname: `/parkings/${parking.id}`,
        params: { data: JSON.stringify(parking) },
      });
    }
  };

  const handleFilterSelect = (filterId: string) => {
    setSelectedFilter(filterId);
  };

  const handleViewMore = () => {
    console.log('Ver más parqueaderos');
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
                  {parkingData.filter(p => p.open24h).length}
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
                  {parkingData.filter(p => p.security).length}
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
              <Ionicons name="search" size={20} color="#fff" />
              <Text className="text-white font-primaryBold text-lg ml-2">
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