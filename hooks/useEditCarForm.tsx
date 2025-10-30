import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { updateVehicle, VehicleTypeUpper, EngineType, fetchMyVehicles } from '../libs/vehicles';
import { CarSchema, CarFormData } from '../schemas/carSchema';
import { useEffect } from 'react';

interface UseEditCarFormProps {
  carId: string;
  onSuccess?: () => void;
}

export const useEditCarForm = ({ carId, onSuccess }: UseEditCarFormProps) => {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    trigger,
  } = useForm<CarFormData>({
    resolver: zodResolver(CarSchema),
    defaultValues: {
      brand: '',
      model: '',
      color: '',
      plate: '',
      type: 'CAR' as 'CAR' | 'MOTORCYCLE',
      engineType: 'GASOLINE' as 'GASOLINE' | 'ELECTRIC' | 'HYBRID',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const vehicles = await fetchMyVehicles();
        const found = (vehicles || []).find((v: any) => v.id === carId);
        if (found) {
          setValue('brand', found.carBrand || '');
          setValue('model', found.model || '');
          setValue('color', found.color || '');
          setValue('plate', found.licensePlate || '');
          setValue('type', found.type || 'CAR');
          setValue('engineType', found.engineType || 'GASOLINE');
        }
      } catch (err) {
        console.error('Error loading vehicle for edit:', err);
      }
    };

    load();
  }, [carId, setValue]);

  const type = watch('type');
  const engineType = watch('engineType');
  const plate = watch('plate');

  const handleSave = async (data: CarFormData) => {
    try {
      const payload = {
        type: data.type,
        licensePlate: data.plate.toUpperCase().replace(/\s+/g, ''),
        model: data.model.trim(),
        carBrand: data.brand.trim(),
        color: data.color.trim(),
        engineType: data.engineType,
      } as const;

      await updateVehicle(carId, payload);

      Alert.alert('Vehículo actualizado', 'Los cambios se guardaron correctamente.', [
        {
          text: 'OK',
          onPress: () => {
            onSuccess?.();
            router.back();
          }
        }
      ]);
    } catch (err: any) {
      const message = err?.message || 'No se pudo actualizar el vehículo.';
      Alert.alert('Error', message);
    }
  };

  const setType = (value: VehicleTypeUpper) => {
    setValue('type', value);
    if (plate) trigger('plate');
  };

  const setEngineType = (value: EngineType) => {
    setValue('engineType', value);
  };

  const handleCancel = () => {
    router.back();
  };

  const getPlatePlaceholder = () => {
    if (type === 'CAR') return 'Placa (Ej: KYX816)';
    if (type === 'MOTORCYCLE') return 'Placa (Ej: LVO67H)';
    return 'Placa';
  };

  return {
    control,
    errors,
    isSubmitting,
    type,
    engineType,
    handleSubmit: handleSubmit(handleSave),
    setType,
    setEngineType,
    handleCancel,
    getPlatePlaceholder,
  };
};

export default useEditCarForm;
