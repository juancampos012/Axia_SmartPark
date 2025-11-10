import { useState, useEffect } from 'react';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';
import { fetchMyVehicles } from '../libs/vehicles';

interface Car {
  id: string;
  carBrand: string;
  model: string;
  licensePlate: string;
  color?: string;
  year?: number;
  engineType?: string;
}

export const useCarDetailScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const params = useLocalSearchParams<{ carId: string }>();
  
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCarData = async () => {
      try {
        const vehicles = await fetchMyVehicles();
        const foundCar: Car | undefined = vehicles.find(
          (vehicle: Car) => vehicle.id === params.carId
        );
        setCar(foundCar || null);
      } catch (error) {
        console.error('Error loading car details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCarData();
  }, [params.carId]);

  // Configurar el header de la navegación
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleGoBack = () => {
    router.back();
  };

  const handleEdit = () => {
    if (!car) return;
    // Navegar a la pantalla de edición
    router.push(`/(tabs)/profile/cars/edit/${car.id}` as any);
  };

  const handleBackToVehicles = () => {
    router.back();
  };

  return {
    car,
    loading,
    handleGoBack,
    handleEdit,
    handleBackToVehicles,
  };
};
