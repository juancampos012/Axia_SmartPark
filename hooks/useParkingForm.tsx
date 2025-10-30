import { useState, useCallback, useEffect, useRef } from 'react';
import { Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { updateParking, updateParkingRates, fetchParkingByIdAdmin } from '../libs/admin';
import { AdminParkingInfo, UpdateParkingDTO } from '../interfaces/Admin';
import { updateParkingFormSchema } from '../Schemas/parkingFormSchema';
import { ZodError } from 'zod';

export const useParkingForm = (onSuccess?: () => void, onError?: () => void) => {
  const { parkingId } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [parking, setParking] = useState<AdminParkingInfo | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string | null>>({});

  // Form fields
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [schedule, setSchedule] = useState('');
  const [hourlyCarRate, setHourlyCarRate] = useState('');
  const [hourlyMotorcycleRate, setHourlyMotorcycleRate] = useState('');
  const [dailyRate, setDailyRate] = useState('');
  const [monthlyRate, setMonthlyRate] = useState('');
  const [status, setStatus] = useState<'OPEN' | 'CLOSED' | 'FULL' | 'MAINTENANCE'>('OPEN');

  // Cargar datos del parqueadero
  useEffect(() => {
    if (parkingId) {
      loadParking();
    }
  }, [parkingId]);

  const loadParking = async () => {
    if (!parkingId) return;

    try {
      setLoading(true);
      const parkingData = await fetchParkingByIdAdmin(parkingId);
      setParking(parkingData);

      // Rellenar formulario
      setName(parkingData.name);
      setAddress(parkingData.address);
      setDescription(parkingData.description || '');
      setSchedule(parkingData.schedule);
      setHourlyCarRate(parkingData.hourlyCarRate.toString());
      setHourlyMotorcycleRate(parkingData.hourlyMotorcycleRate.toString());
      setDailyRate(parkingData.dailyRate?.toString() || '');
      setMonthlyRate(parkingData.monthlyRate?.toString() || '');
      setStatus(parkingData.status);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al cargar parqueadero');
      if (onError) onError();
    } finally {
      setLoading(false);
    }
  };

  // Validar formulario
  const validateForm = (): boolean => {
    try {
      // Use Zod schema to validate (coercions for numeric fields are handled)
      updateParkingFormSchema.parse({
        name: name.trim() || undefined,
        address: address.trim() || undefined,
        description: description.trim() || undefined,
        schedule: schedule.trim() || undefined,
        totalCapacity: undefined,
        actualCapacity: undefined,
        floors: undefined,
        hourlyCarRate: hourlyCarRate !== '' ? hourlyCarRate : undefined,
        hourlyMotorcycleRate: hourlyMotorcycleRate !== '' ? hourlyMotorcycleRate : undefined,
        dailyRate: dailyRate !== '' ? dailyRate : undefined,
        monthlyRate: monthlyRate !== '' ? monthlyRate : undefined,
        latitude: undefined,
        longitude: undefined,
        status,
      });
      setFormErrors({});
      return true;
    } catch (err) {
      if (err instanceof ZodError) {
        const errs: Record<string, string> = {};
        err.errors.forEach((e) => {
          const key = (e.path && e.path[0]) ? String(e.path[0]) : 'form';
          if (!errs[key]) errs[key] = e.message;
        });
        setFormErrors(errs);
        const first = err.errors[0];
        Alert.alert('Error de validación', first.message);
      } else {
        Alert.alert('Error', 'Error al validar el formulario');
      }
      return false;
    }
  };

  // Guardar cambios
  const handleSave = useCallback(async () => {
    if (!parkingId || !validateForm()) return;

    try {
      setSaving(true);

      // Actualizar información general
      const updateData: UpdateParkingDTO = {
        name: name.trim(),
        address: address.trim(),
        description: description.trim() || undefined,
        schedule: schedule.trim(),
        status,
      };

      await updateParking(parkingId, updateData);

      // Actualizar tarifas
      const ratesData = {
        hourlyCarRate: parseFloat(hourlyCarRate),
        hourlyMotorcycleRate: parseFloat(hourlyMotorcycleRate),
        dailyRate: dailyRate ? parseFloat(dailyRate) : undefined,
        monthlyRate: monthlyRate ? parseFloat(monthlyRate) : undefined,
      };

      await updateParkingRates(parkingId, ratesData);

      Alert.alert(
        'Éxito', 
        'Parqueadero actualizado correctamente.\n\nDesliza hacia abajo para actualizar la información.'
      );
      
      // Llamar callback de éxito después de mostrar el alert
      if (onSuccess) {
        setTimeout(() => onSuccess(), 100);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al guardar cambios');
    } finally {
      setSaving(false);
    }
  }, [
    parkingId,
    name,
    address,
    description,
    schedule,
    hourlyCarRate,
    hourlyMotorcycleRate,
    dailyRate,
    monthlyRate,
    status,
    onSuccess,
  ]);

  return {
    loading,
    saving,
    parking,
    formErrors,
    // Form fields
    name,
    setName,
    address,
    setAddress,
    description,
    setDescription,
    schedule,
    setSchedule,
    hourlyCarRate,
    setHourlyCarRate,
    hourlyMotorcycleRate,
    setHourlyMotorcycleRate,
    dailyRate,
    setDailyRate,
    monthlyRate,
    setMonthlyRate,
    status,
    setStatus,
    // Actions
    handleSave,
  };
};
