import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
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
  const { isAdminOrOperator } = useAuth();

  // Estados
  const [userProfile, setUserProfile] = useState<{ name: string; avatar?: string } | null>(null);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Menú items - dinámico según el rol
  const menuItems: MenuItem[] = useMemo(() => {
    const baseItems = [
      {
        id: '1',
        icon: 'person-outline',
        title: 'Información personal',
        route: '/profile/personal-info',
      },
      {
        id: '2',
        icon: 'star-outline',
        title: 'Mis Reseñas',
        route: '/profile/reviews',
      },
      {
        id: '3',
        icon: 'lock-closed-outline',
        title: 'Seguridad',
        route: '/profile/security',
      },
      {
        id: '4',
        icon: 'card-outline',
        title: 'Tarjeta de débito',
        route: '/profile/payment-methods',
      },
      {
        id: '5',
        icon: 'receipt-outline',
        title: 'Historial de Pagos',
        route: '/profile/payments-history',
      },
    ];

    // Agregar opción de gestión de usuarios para Admin/Operator
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

  // Refrescar datos cada vez que la pantalla gana foco (por ejemplo, al volver desde detalle/eliminar)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadData();
    }, [loadData])
  );

  // Función para refrescar el perfil manualmente (pull-to-refresh)
  const handleRefreshProfile = useCallback(async () => {
    setRefreshing(true);
    try {
      // Llamamos directamente a loadData para refrescar información.
      // Antes se intentaba llamar a `refreshProfileData` (no definida en este scope),
      // lo cual provocaba un ReferenceError.
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

  const handleOpenAvatarSelector = useCallback(() => {
    setShowAvatarSelector(true);
  }, []);

  const handleCloseAvatarSelector = useCallback(() => {
    setShowAvatarSelector(false);
  }, []);

  const handleAvatarSelect = useCallback((newImageUrl: string) => {
    // Actualizar el avatar en el estado local INMEDIATAMENTE
    setUserProfile(prev => prev ? { ...prev, avatar: newImageUrl } : { name: 'Usuario', avatar: newImageUrl });
    setShowAvatarSelector(false);
    
    // Recargar el perfil después de un pequeño delay para confirmar desde el servidor
    setTimeout(() => {
      loadData();
    }, 500);
  }, [loadData]);

  // Valores derivados
  const hasVehicles = userCars.length > 0;
  const displayName = userProfile?.name || 'Usuario';
  const userAvatar = userProfile?.avatar;

  return {
    // Estados
    userProfile,
    userCars,
    loading,
    refreshing,
    error,
    menuItems,
    showAvatarSelector,

    // Valores derivados
    hasVehicles,
    displayName,
    userAvatar,

    // Handlers
    handleMenuItemPress,
    handleCarPress,
    handleViewAllCars,
    handleAddCar,
    handleOpenAvatarSelector,
    handleCloseAvatarSelector,
    handleAvatarSelect,

    // Nueva función para refrescar datos
    refreshProfileData: handleRefreshProfile,
  };
};
