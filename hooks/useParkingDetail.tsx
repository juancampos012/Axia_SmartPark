import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchParkingById } from '../libs/parking';
import { Parking } from '../interfaces/parking';
import { useUserLocation } from './useUserLocation';

interface UseParkingDetailProps {
  parkingId?: string;
  parkingData?: string;
}

export const useParkingDetail = ({ parkingId, parkingData }: UseParkingDetailProps) => {
  const router = useRouter();
  
  // Hook de ubicación del usuario
  const { calculateDistance, hasPermission, requestPermission } = useUserLocation();
  
  // Estados
  const [isFavorite, setIsFavorite] = useState(false);
  const [parking, setParking] = useState<Parking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos del estacionamiento
  useEffect(() => {
    const loadParkingData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Primero intentar con datos de parámetros
        if (parkingData) {
          const parkingFromParams = JSON.parse(parkingData);
          
          // Calcular distancia si tenemos ubicación del usuario
          const distance = calculateDistance(parkingFromParams.latitude, parkingFromParams.longitude);
          
          setParking({
            ...parkingFromParams,
            distance: distance || parkingFromParams.distance || 0,
          });
          setLoading(false);
          return;
        }

        // Si no hay datos en parámetros, cargar del backend
        if (parkingId) {
          const parkingFromBackend = await fetchParkingById(parkingId);
          
          // Calcular distancia si tenemos ubicación del usuario
          const distance = calculateDistance(parkingFromBackend.latitude, parkingFromBackend.longitude);
          
          setParking({
            ...parkingFromBackend,
            distance: distance || parkingFromBackend.distance || 0,
          });
        } else {
          throw new Error('No parking ID provided');
        }
      } catch (err) {
        console.error('Error loading parking:', err);
        setError(err instanceof Error ? err.message : 'Error loading parking');
      } finally {
        setLoading(false);
      }
    };

    loadParkingData();
  }, [parkingId, parkingData, calculateDistance]);

  // Generar características basadas en datos reales
  const features = useMemo(() => {
    if (!parking) return ['Estacionamiento seguro'];
    
    const featuresList: string[] = [...parking.features];
    
    if (parking.status === 'OPEN') featuresList.push('Abierto ahora');
    if (parking.schedule?.includes('24')) featuresList.push('24/7');
    if (parking.totalCapacity >= 50) featuresList.push('Amplia capacidad');
    if (parking.floors > 1) featuresList.push('Múltiples pisos');
    
    return featuresList.length > 0 ? featuresList : ['Estacionamiento seguro'];
  }, [parking]);

  // Datos calculados
  const displayRating = useMemo(() => 
    parking && parking.rating > 0 ? parking.rating : 4.0, 
    [parking]
  );

  const reviewCount = useMemo(() => 
    parking && parking.ratingCount > 0 ? parking.ratingCount : Math.floor((parking?.rating || 4.0) * 25),
    [parking]
  );

  const isAvailable = useMemo(() => 
    parking ? parking.availableSpots > 0 && parking.status === 'OPEN' : false,
    [parking]
  );

  // Handlers
  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleReservePress = useCallback(() => {
    if (!parking) return;
    
    router.push({
      pathname: `/parkings/${parking.id}/reserve`,
      params: { parkingData: JSON.stringify(parking) }
    });
  }, [parking, router]);

  const handleFavoritePress = useCallback(() => {
    setIsFavorite(prev => !prev);
    Alert.alert(
      !isFavorite ? 'Agregado a favoritos' : 'Removido de favoritos',
      !isFavorite 
        ? 'El estacionamiento ha sido agregado a tus favoritos'
        : 'El estacionamiento ha sido removido de tus favoritos'
    );
  }, [isFavorite]);

  const handleViewOnMap = useCallback(() => {
    if (!parking) return;
    console.log('Ver en mapa:', {
      latitude: parking.latitude,
      longitude: parking.longitude,
      name: parking.name
    });
    // Aquí puedes implementar la navegación al mapa o abrir una app externa
  }, [parking]);

  const handleShare = useCallback(() => {
    if (!parking) return;
    console.log('Compartir estacionamiento:', parking.name);
    // Aquí puedes implementar el share nativo de React Native
  }, [parking]);

  return {
    // Estados
    parking,
    loading,
    error,
    isFavorite,
    
    // Estados de ubicación
    hasLocationPermission: hasPermission,
    requestLocationPermission: requestPermission,
    
    // Datos calculados
    features,
    displayRating,
    reviewCount,
    isAvailable,
    
    // Handlers
    handleGoBack,
    handleReservePress,
    handleFavoritePress,
    handleViewOnMap,
    handleShare,
  };
};
