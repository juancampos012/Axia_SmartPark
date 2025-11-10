import { useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Alert } from 'react-native';

interface UserLocation {
  latitude: number;
  longitude: number;
}

interface UseUserLocationReturn {
  userLocation: UserLocation | null;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  calculateDistance: (targetLat: number, targetLng: number) => number | null;
  refreshLocation: () => Promise<void>;
}

export const useUserLocation = (): UseUserLocationReturn => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para calcular distancia usando fórmula de Haversine
  const calculateDistance = useCallback((targetLat: number, targetLng: number): number | null => {
    if (!userLocation) return null;

    const R = 6371; // Radio de la Tierra en km
    const dLat = toRad(targetLat - userLocation.latitude);
    const dLon = toRad(targetLng - userLocation.longitude);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(userLocation.latitude)) *
        Math.cos(toRad(targetLat)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
  }, [userLocation]);

  const toRad = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  // Solicitar permiso de ubicación
  const requestPermission = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setHasPermission(false);
        setError('Permiso de ubicación denegado');
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a tu ubicación para mostrarte los parqueaderos más cercanos y calcular distancias.',
          [{ text: 'OK' }]
        );
        return false;
      }

      setHasPermission(true);
      
      // Obtener ubicación actual
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      return true;
    } catch (err) {
      console.error('Error requesting location permission:', err);
      setError(err instanceof Error ? err.message : 'Error al obtener ubicación');
      setHasPermission(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refrescar ubicación
  const refreshLocation = useCallback(async (): Promise<void> => {
    if (!hasPermission) {
      await requestPermission();
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (err) {
      console.error('Error refreshing location:', err);
      setError(err instanceof Error ? err.message : 'Error al actualizar ubicación');
    } finally {
      setIsLoading(false);
    }
  }, [hasPermission, requestPermission]);

  // Solicitar permiso al montar el componente
  useEffect(() => {
    requestPermission();
  }, []);

  return {
    userLocation,
    hasPermission,
    isLoading,
    error,
    requestPermission,
    calculateDistance,
    refreshLocation,
  };
};
