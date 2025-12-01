import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile } from '../libs/user';
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
  const { isAdminOrOperator, signOut } = useAuth();

  // Estados
  const [userProfile, setUserProfile] = useState<{ name: string } | null>(null);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const menuItems: MenuItem[] = useMemo(() => {
    const baseItems = [
      { id: '1', icon: 'person-outline', title: 'Información personal', route: '/profile/personal-info' },
      { id: '2', icon: 'star-outline', title: 'Mis Reseñas', route: '/profile/reviews' },
      { id: '3', icon: 'lock-closed-outline', title: 'Seguridad', route: '/profile/security' },
      { id: '4', icon: 'card-outline', title: 'Tarjeta de débito', route: '/profile/payment-methods' },
      { id: '5', icon: 'receipt-outline', title: 'Historial de Pagos', route: '/profile/payments-history' },
    ];

    if (isAdminOrOperator) {
      baseItems.splice(2, 0, {
        id: 'admin-users',
        icon: 'people-outline',
        title: 'Gestión de Usuarios',
        route: '/profile/users',
      });
    }

    return baseItems;
  }, [isAdminOrOperator]);

  // 📦 Cargar datos del perfil y vehículos
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

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  const handleRefreshProfile = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Error al refrescar el perfil:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

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

  const handleLogout = useCallback(async () => {
    try {
      Alert.alert(
        'Cerrar sesión',
        '¿Estás seguro de que deseas salir?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Cerrar sesión',
            style: 'destructive',
            onPress: async () => {
              try {
                await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                await signOut();
                router.replace('/(auth)/login');
              } catch (err) {
                console.error('Error al cerrar sesión:', err);
                Alert.alert('Error', 'No se pudo cerrar sesión.');
              }
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error al ejecutar logout:', error);
    }
  }, [router, signOut]);

  // Valores derivados
  const hasVehicles = userCars.length > 0;
  const displayName = userProfile?.name || 'Usuario';

  return {
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

    // Nueva función para refrescar datos
    refreshProfileData: handleRefreshProfile,
    handleLogout, 
  };
};
