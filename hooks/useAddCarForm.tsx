import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { createVehicle, VehicleTypeUpper, EngineType } from '../libs/vehicles';

export const useAddCarForm = () => {
  const router = useRouter();

  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [plate, setPlate] = useState('');
  const [color, setColor] = useState('');
  const [type, setType] = useState<VehicleTypeUpper>('CAR');
  const [engineType, setEngineType] = useState<EngineType | undefined>('GASOLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = () => {
    if (!brand.trim() || !model.trim() || !plate.trim() || !color.trim()) {
      Alert.alert('Campos requeridos', 'Marca, modelo, color y placa son obligatorios.');
      return false;
    }
    // Normalize and validate Colombian plate format: ABC123 or ABC 123
    const normalizedPlate = plate.toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z]{3}[0-9]{3}$/.test(normalizedPlate)) {
      Alert.alert('Placa inválida', 'Formato válido: ABC123 (3 letras y 3 números).');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    
    try {
      setIsSubmitting(true);
      const payload = {
        type,
        licensePlate: plate.toUpperCase(),
        model: model.trim(),
        carBrand: brand.trim(),
        color: color.trim(),
        engineType,
      } as const;
      
      await createVehicle(payload);
      
      Alert.alert('Vehículo creado', 'Tu vehículo se guardó correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      const message = err?.message || 'No se pudo crear el vehículo.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleCancel = () => {
    router.push('/(tabs)/profile');
  };

  return {
    // Form state
    brand,
    model,
    plate,
    color,
    type,
    engineType,
    isSubmitting,
    
    // Setters
    setBrand,
    setModel,
    setPlate,
    setColor,
    setType,
    setEngineType,
    
    // Handlers
    handleSave,
    handleGoBack,
    handleCancel,
  };
};
