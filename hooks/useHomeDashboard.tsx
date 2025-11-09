import { useState, useEffect, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { Alert } from 'react-native';
import { fetchDashboardStats, DashboardStats } from '../libs/dashboard';
import { fetchAllParkings } from '../libs/parking';
import { Parking } from '../interfaces/parking';
import { useUserLocation } from './useUserLocation';
import { useReservationsHistory } from './useReservationsHistory';
import { ReservationStatus } from '../interfaces/reservation';
import React from 'react';

// Tipo extendido con distancia
interface ParkingWithDistance extends Parking {
  distance: number;
}

export const useHomeDashboard = () => {
  const router = useRouter();
  const { userLocation, hasPermission, requestPermission, calculateDistance } = useUserLocation();
  
  // Estados
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [nearbyParkings, setNearbyParkings] = useState<ParkingWithDistance[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Obtener reservaciones con el hook existente
  const { reservations } = useReservationsHistory();

  // Encontrar reserva activa (PENDING o CONFIRMED)
  const activeReservation = reservations?.find(
    r => r.status === ReservationStatus.PENDING || r.status === ReservationStatus.CONFIRMED
  ) || null;

  /**
   * Cargar estadísticas del dashboard
   */
  const loadDashboardStats = useCallback(async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      setError(null);

      const data = await fetchDashboardStats();
      setStats(data);
    } catch (err: any) {
      console.error('Error loading dashboard stats:', err);
      setError(err.message || 'Error al cargar estadísticas');
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  }, []);

  /**
   * Cargar parqueaderos cercanos (solo si hay ubicación)
   */
  const loadNearbyParkings = useCallback(async () => {
    if (!userLocation) {
      setNearbyParkings([]);
      return;
    }

    try {
      const allParkings = await fetchAllParkings();
      
      // Calcular distancias y ordenar por cercanía
      const parkingsWithDistance: ParkingWithDistance[] = allParkings
        .map(parking => {
          const distance = calculateDistance(parking.latitude, parking.longitude);
          return {
            ...parking,
            distance: distance || 0 // Si es null, usar 0
          };
        })
        .filter(p => p.distance !== null) // Filtrar los que no tienen distancia
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 5); // Solo los 5 más cercanos

      setNearbyParkings(parkingsWithDistance);
    } catch (err: any) {
      console.error('Error loading nearby parkings:', err);
    }
  }, [userLocation, calculateDistance]);

  /**
   * Refrescar todos los datos
   */
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      loadDashboardStats(true),
      loadNearbyParkings()
    ]);
    setRefreshing(false);
  }, [loadDashboardStats, loadNearbyParkings]);

  /**
   * Cargar datos inicial
   */
  useEffect(() => {
    loadDashboardStats();
  }, [loadDashboardStats]);

  /**
   * Recargar datos cuando la pantalla obtiene foco
   */
  useFocusEffect(
    React.useCallback(() => {
      console.log('Home dashboard focused - reloading stats and parkings');
      loadDashboardStats(true);
      loadNearbyParkings();
    }, [loadDashboardStats, loadNearbyParkings])
  );

  /**
   * Cargar parqueaderos cercanos cuando tengamos ubicación
   */
  useEffect(() => {
    if (userLocation) {
      loadNearbyParkings();
    }
  }, [userLocation, loadNearbyParkings]);

  /**
   * Navegación
   */
  const handleSearchPress = useCallback(() => {
    router.push('/(tabs)/parkings/');
  }, [router]);

  const handleParkingPress = useCallback((parkingId: string) => {
    router.push(`/(tabs)/parkings/${parkingId}`);
  }, [router]);

  const handleReservationPress = useCallback(() => {
    if (activeReservation) {
      router.push(`/(tabs)/reservations/${activeReservation.id}`);
    }
  }, [router, activeReservation]);

  const handleNewReservation = useCallback(() => {
    router.push('/(tabs)/parkings/');
  }, [router]);

  const handleVehiclesPress = useCallback(() => {
    router.replace('/(tabs)/profile/cars');
  }, [router]);

  const handlePaymentMethodsPress = useCallback(() => {
    router.replace('/(tabs)/profile/payment-methods');
  }, [router]);

  const handleReviewsPress = useCallback(() => {
    router.replace('/(tabs)/profile/reviews');
  }, [router]);

  const handleRequestLocation = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  /**
   * Obtener saludo según la hora del día
   */
  const getGreeting = useCallback(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 19) return 'Buenas tardes';
    return 'Buenas noches';
  }, []);

  return {
    // Datos
    stats,
    nearbyParkings,
    activeReservation,
    loading,
    refreshing,
    error,
    
    // Ubicación
    userLocation,
    hasLocationPermission: hasPermission, // Renamed from hasPermission
    
    // Funciones
    handleRefresh,
    handleSearchPress,
    handleParkingPress,
    handleReservationPress,
    handleNewReservation,
    handleVehiclesPress,
    handlePaymentMethodsPress,
    handleReviewsPress,
    handleRequestLocation,
    getGreeting,
  };
};
