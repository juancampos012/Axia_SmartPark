import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { fetchAllParkings } from '../libs/parking';
import { Parking } from '../interfaces/parking';
import { useUserLocation } from './useUserLocation';

export type FilterType = 'all' | 'nearby' | 'price' | 'rating' | 'available';

interface UseParkingsScreenProps {
  initialFilter?: FilterType;
}

export const useParkingsScreen = ({ initialFilter = 'all' }: UseParkingsScreenProps = {}) => {
  const router = useRouter();
  
  // Hook de ubicación del usuario
  const { userLocation, calculateDistance, hasPermission, requestPermission } = useUserLocation();
  
  // Estados
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(initialFilter);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [parkingData, setParkingData] = useState<Parking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del backend
  const loadParkings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parkings = await fetchAllParkings();
      
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
  }, []);

  // Cargar al montar
  useEffect(() => {
    loadParkings();
  }, [loadParkings]);

  // Manejar favoritos
  const handleFavoritePress = useCallback((parkingId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(parkingId)) {
        newFavorites.delete(parkingId);
      } else {
        newFavorites.add(parkingId);
      }
      return newFavorites;
    });
  }, []);

  // Filtrar y ordenar parqueaderos
  const filteredAndSortedParkings = useMemo(() => {
    let result = [...parkingData];

    // Calcular distancia para cada parqueadero si tenemos ubicación del usuario
    if (userLocation) {
      result = result.map(parking => {
        const distance = calculateDistance(parking.latitude, parking.longitude);
        return {
          ...parking,
          distance: distance || parking.distance || 0, // Usar distancia calculada o la del backend
        };
      });
    }

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
        result = result.filter(parking => parking.availableSpots > 0);
        result.sort((a, b) => b.availableSpots - a.availableSpots);
        break;
      default:
        result.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
    }

    return result.map(parking => ({
      ...parking,
      isFavorite: favorites.has(parking.id),
      totalSpots: parking.totalCapacity,
    }));
  }, [parkingData, selectedFilter, favorites, userLocation, calculateDistance]);

  // Calcular estadísticas
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

  // Obtener texto del orden actual
  const getOrderText = useCallback(() => {
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
  }, [selectedFilter]);

  // Navegar a detalle
  const handleParkingPress = useCallback((parkingId: string) => {
    const parking = filteredAndSortedParkings.find(p => p.id === parkingId);
    if (parking) {
      router.push({
        pathname: `/parkings/${parking.id}`,
        params: { 
          parkingData: JSON.stringify(parking) 
        },
      });
    }
  }, [filteredAndSortedParkings, router]);

  // Cambiar filtro
  const handleFilterSelect = useCallback((filterId: string) => {
    setSelectedFilter(filterId as FilterType);
  }, []);

  // Ver más (para paginación futura)
  const handleViewMore = useCallback(() => {
    console.log('Ver más parqueaderos');
    // Aquí podrías cargar más datos si implementas paginación
  }, []);

  // Reintentar carga
  const handleRetry = useCallback(() => {
    loadParkings();
  }, [loadParkings]);

  return {
    // Estados
    selectedFilter,
    favorites,
    parkingData: filteredAndSortedParkings,
    loading,
    error,
    statistics,
    
    // Estados de ubicación
    userLocation,
    hasLocationPermission: hasPermission,
    requestLocationPermission: requestPermission,
    
    // Funciones
    handleFavoritePress,
    handleParkingPress,
    handleFilterSelect,
    handleViewMore,
    handleRetry,
    getOrderText,
  };
};
