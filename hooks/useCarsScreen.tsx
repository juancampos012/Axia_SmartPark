import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchMyVehicles } from '../libs/vehicles';

interface Vehicle {
  id: string;
  type: 'CAR' | 'MOTORCYCLE';
  licensePlate: string;
  model: string;
  carBrand: string;
  color?: string;
  engineType?: 'GASOLINE' | 'ELECTRIC' | 'HYBRID';
  year?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const useCarsScreen = () => {
  const router = useRouter();
  
  // Estados
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar vehículos
  const loadVehicles = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchMyVehicles();
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      setError(err.message || 'Error al cargar los vehículos');
      Alert.alert('Error', err.message || 'No se pudieron cargar los vehículos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Cargar vehículos al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadVehicles();
    }, [loadVehicles])
  );

  // Handlers
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadVehicles();
  }, [loadVehicles]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleAddVehicle = useCallback(() => {
    router.push('/(tabs)/profile/cars/add');
  }, [router]);

  const handleVehiclePress = useCallback((vehicle: Vehicle) => {
    router.push({
      pathname: `/(tabs)/profile/cars/detail/${vehicle.id}` as any,
      params: { vehicleData: JSON.stringify(vehicle) }
    });
  }, [router]);

  // Funciones helper
  const getVehicleIcon = useCallback((type: string) => {
    return type === 'MOTORCYCLE' ? 'bicycle' : 'car-sport';
  }, []);

  const getEngineTypeIcon = useCallback((engineType?: string): { icon: string; color: string } | null => {
    if (!engineType) return null;
    
    const iconMap: { [key: string]: { icon: string; color: string } } = {
      'GASOLINE': { icon: 'water', color: '#F59E0B' },
      'ELECTRIC': { icon: 'flash', color: '#10B981' },
      'HYBRID': { icon: 'leaf', color: '#06B6D4' }
    };
    
    return iconMap[engineType] || null;
  }, []);

  const getEngineTypeLabel = useCallback((engineType?: string) => {
    if (!engineType) return null;
    const labels: { [key: string]: string } = {
      'GASOLINE': 'Gasolina',
      'ELECTRIC': 'Eléctrico',
      'HYBRID': 'Híbrido'
    };
    return labels[engineType] || engineType;
  }, []);

  const getVehicleTypeLabel = useCallback((type: string) => {
    return type === 'MOTORCYCLE' ? 'Moto' : 'Carro';
  }, []);

  // Valores computados
  const hasVehicles = vehicles.length > 0;
  const vehicleCount = vehicles.length;
  const vehicleCountText = vehicleCount === 0 
    ? 'Aún no tienes vehículos registrados. Añade uno para comenzar.' 
    : `Tienes ${vehicleCount} vehículo${vehicleCount !== 1 ? 's' : ''} registrado${vehicleCount !== 1 ? 's' : ''}.`;

  return {
    // Estados
    vehicles,
    loading,
    refreshing,
    error,
    
    // Valores computados
    hasVehicles,
    vehicleCount,
    vehicleCountText,
    
    // Handlers
    handleRefresh,
    handleGoBack,
    handleAddVehicle,
    handleVehiclePress,
    
    // Funciones helper
    getVehicleIcon,
    getEngineTypeIcon,
    getEngineTypeLabel,
    getVehicleTypeLabel,
  };
};
