import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'expo-router';
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
  const [userProfile, setUserProfile] = useState<{ name: string } | null>(null);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Cargar datos del perfil y vehículos
  useEffect(() => {
    const loadData = async () => {
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
    };

    loadData();
  }, []);

  // Handlers
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

  // Valores computados
  const hasVehicles = userCars.length > 0;
  const displayName = userProfile?.name || 'Usuario';

  return {
    // Estados
    userProfile,
    userCars,
    loading,
    error,
    menuItems,
    
    // Valores computados
    hasVehicles,
    displayName,
    
    // Handlers
    handleMenuItemPress,
    handleCarPress,
    handleViewAllCars,
    handleAddCar,
  };
};
