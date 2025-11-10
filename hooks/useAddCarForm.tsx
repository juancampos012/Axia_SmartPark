import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createVehicle, VehicleTypeUpper, EngineType } from '../libs/vehicles';
import { CarSchema, CarFormData } from '../schemas/carSchema';

interface UseAddCarFormProps {
  onSuccess?: () => void;
}

export const useAddCarForm = ({ onSuccess }: UseAddCarFormProps = {}) => {
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
      
      await createVehicle(payload);
      
      Alert.alert('Vehículo creado', 'Tu vehículo se guardó correctamente.', [
        { 
          text: 'OK', 
          onPress: () => {
            onSuccess?.();
            router.back();
          }
        }
      ]);
    } catch (err: any) {
      const message = err?.message || 'No se pudo crear el vehículo.';
      Alert.alert('Error', message);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.push('/(tabs)/profile');
  };

  const setType = (value: VehicleTypeUpper) => {
    setValue('type', value);
    // Trigger validation for plate when type changes
    if (plate) {
      trigger('plate');
    }
  };

  const setEngineType = (value: EngineType) => {
    setValue('engineType', value);
  };

  const getPlatePlaceholder = () => {
    if (type === "CAR") return "Placa (Ej: KYX816)";
    if (type === "MOTORCYCLE") return "Placa (Ej: LVO67H)";
    return "Placa";
  };

  return {
    // React Hook Form
    control,
    errors,
    isSubmitting,
    
    // Form values
    type,
    engineType,
    
    // Handlers
    handleSubmit: handleSubmit(handleSave),
    handleGoBack,
    handleCancel,
    
    // Setters
    setType,
    setEngineType,
    
    // Utilities
    getPlatePlaceholder,
  };
};