// hooks/useDeleteVehicle.ts
import { useState } from 'react';
import { Alert } from 'react-native';
import { deleteVehicle } from '../libs/vehicles';
import { Vehicle } from '../interfaces/vehicle';

interface UseDeleteVehicleProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onActiveReservations?: (vehicle: Vehicle) => void;
}

export const useDeleteVehicle = ({ 
  onSuccess, 
  onError,
  onActiveReservations 
}: UseDeleteVehicleProps = {}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (vehicle: Vehicle) => {
    try {
      setIsDeleting(true);
      
      await deleteVehicle(vehicle.id);
      
      if (onSuccess) {
        onSuccess();
      } else {
        Alert.alert(
          'Vehículo eliminado',
          `El vehículo ${vehicle.licensePlate} ha sido eliminado correctamente.`,
          [{ text: 'OK' }]
        );
      }
      
    } catch (error: any) {
      const message = error?.message || 'No se pudo eliminar el vehículo.';
      
      // Manejar caso específico de reservas activas
      if (message.includes('reservas activas') && onActiveReservations) {
        onActiveReservations(vehicle);
        return;
      }
      
      if (onError) {
        onError(message);
      } else {
        Alert.alert('Error', message);
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const confirmDelete = (vehicle: Vehicle) => {
    handleDelete(vehicle)
  };

  return {
    isDeleting,
    confirmDelete,
    handleDelete,
  };
};