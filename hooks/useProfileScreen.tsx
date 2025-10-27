import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { fetchUserProfile, refreshProfileData } from '../libs/user';
import { fetchMyVehicles } from '../libs/vehicles';

interface Car {
  id: string;
  carBrand: string;
  model: string;
  licensePlate: string;
  color?: string;
  year?: number;
}

interface MenuItem {
  id: string;
  icon: string;
  title: string;
  route?: string;
}

export const useProfileScreen = () => {
  const router = useRouter();

  // Estados
  const [userProfile, setUserProfile] = useState<{ name: string } | null>(null);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Menú items
  const menuItems: MenuItem[] = [
    { id: '1', icon: 'person-outline', title: 'Información personal', route: '/profile/personal-info' },
    { id: '2', icon: 'lock-closed-outline', title: 'Seguridad', route: '/profile/security' },
    { id: '3', icon: 'card-outline', title: 'Tarjeta de débito', route: '/profile/payment-methods' },
    { id: '4', icon: 'receipt-outline', title: 'Historial de Pagos', route: '/profile/payments-history' },
  ];

  // Cargar perfil y vehículos
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profile, vehicles] = await Promise.all([
        fetchUserProfile(),
        fetchMyVehicles(),
      ]);
      setUserProfile(profile);
      setUserCars(vehicles);
    } catch (err: any) {
      console.error('Error loading profile or vehicles:', err);
      setError(err.message || 'Error al cargar la información');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 🔄 Función para refrescar el perfil manualmente (pull-to-refresh)
  const handleRefreshProfile = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshProfileData();
      await loadData();
    } catch (error) {
      console.error("Error al refrescar el perfil:", error);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  // Handlers de navegación
  const handleMenuItemPress = useCallback((route: string) => {
    router.push(route as any);
  }, [router]);

  const handleCarPress = useCallback((carId: string) => {
    router.push(`/profile/cars/detail/${carId}` as any);
  }, [router]);

  const handleViewAllCars = useCallback(() => {
    router.push('/(tabs)/profile/cars');
  }, [router]);

  const handleAddCar = useCallback(() => {
    router.push('/(tabs)/profile/cars/add');
  }, [router]);

  // Valores derivados
  const hasVehicles = userCars.length > 0;
  const displayName = userProfile?.name || 'Usuario';

  return {
    // Estados
    userProfile,
    userCars,
    loading,
    refreshing,
    error,
    menuItems,

    // Valores derivados
    hasVehicles,
    displayName,

    // Handlers
    handleMenuItemPress,
    handleCarPress,
    handleViewAllCars,
    handleAddCar,

    // 🔄 Nueva función para refrescar datos
    refreshProfileData: handleRefreshProfile,
  };
};
