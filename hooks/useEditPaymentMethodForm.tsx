import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { UpdatePaymentMethodSchema, UpdatePaymentMethodFormData } from '../schemas/paymentMethodSchema';
import { getPaymentMethodById } from '../libs/paymentMethods';
import { UpdatePaymentMethodDTO, PaymentMethodResponse } from '../interfaces/paymentMethod';
import { http } from '../libs/http-client';

interface UseEditPaymentMethodFormProps {
  paymentMethodId: string;
  onSuccess?: () => void;
}

export const useEditPaymentMethodForm = ({ 
  paymentMethodId, 
  onSuccess 
}: UseEditPaymentMethodFormProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodResponse | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<UpdatePaymentMethodFormData>({
    resolver: zodResolver(UpdatePaymentMethodSchema),
    defaultValues: {
      cardholderName: '',
      expiryMonth: new Date().getMonth() + 1,
      expiryYear: new Date().getFullYear(),
      billingAddress: undefined,
      nickname: undefined,
      isActive: true,
    },
    mode: 'onChange',
  });

  const expiryMonth = watch('expiryMonth');
  const expiryYear = watch('expiryYear');
  const isActive = watch('isActive');

  // Cargar datos del método de pago
  useEffect(() => {
    loadPaymentMethod();
  }, [paymentMethodId]);

  const loadPaymentMethod = async () => {
    try {
      setLoading(true);
      const method = await getPaymentMethodById(paymentMethodId);
      setPaymentMethod(method);

      // Llenar el formulario con los datos actuales
      setValue('cardholderName', method.cardholderName);
      setValue('expiryMonth', method.expiryMonth);
      setValue('expiryYear', method.expiryYear);
      setValue('billingAddress', method.billingAddress ?? undefined);
      setValue('nickname', method.nickname ?? undefined);
      setValue('isActive', method.isActive);
    } catch (error) {
      console.error('Error al cargar método de pago:', error);
      Alert.alert('Error', 'No se pudo cargar el método de pago');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (data: UpdatePaymentMethodFormData) => {
    if (!isDirty) {
      Alert.alert('Sin cambios', 'No hay cambios para guardar');
      return;
    }

    try {
      setIsProcessing(true);

      // Preparar payload - solo enviar campos modificados
      const payload: UpdatePaymentMethodDTO = {};

      if (data.cardholderName !== paymentMethod?.cardholderName) {
        payload.cardholderName = data.cardholderName?.trim();
      }
      if (data.expiryMonth !== paymentMethod?.expiryMonth) {
        payload.expiryMonth = data.expiryMonth;
      }
      if (data.expiryYear !== paymentMethod?.expiryYear) {
        payload.expiryYear = data.expiryYear;
      }
      if (data.billingAddress !== (paymentMethod?.billingAddress ?? undefined)) {
        payload.billingAddress = data.billingAddress?.trim() || undefined;
      }
      if (data.nickname !== (paymentMethod?.nickname ?? undefined)) {
        payload.nickname = data.nickname?.trim() || undefined;
      }
      if (data.isActive !== paymentMethod?.isActive) {
        payload.isActive = data.isActive;
      }

      console.log('💳 Actualizando método de pago:', payload);

      // Enviar al backend
      const result = await http.put(`/payment-methods/${paymentMethodId}`, payload);

      if (!result.success) {
        throw new Error(result.message || 'Error al actualizar');
      }

      console.log('✅ Método de pago actualizado:', result.data);

      Alert.alert(
        'Éxito',
        'Tarjeta actualizada correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              onSuccess?.();
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Error al actualizar método de pago:', error);
      
      let errorMessage = 'No se pudo actualizar la tarjeta. Intenta nuevamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      Alert.alert(
        'Cancelar cambios',
        '¿Estás seguro de que deseas cancelar? Los cambios no se guardarán.',
        [
          { text: 'No', style: 'cancel' },
          {
            text: 'Sí, cancelar',
            style: 'destructive',
            onPress: () => {
              reset();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Eliminar tarjeta',
      '¿Estás seguro de que deseas eliminar esta tarjeta? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsProcessing(true);
              await http.delete(`/payment-methods/${paymentMethodId}`);
              
              Alert.alert('Éxito', 'Tarjeta eliminada correctamente');
              onSuccess?.();
              router.back();
            } catch (error: any) {
              console.error('Error al eliminar método de pago:', error);
              Alert.alert(
                'Error',
                error.response?.data?.message || 'No se pudo eliminar la tarjeta'
              );
            } finally {
              setIsProcessing(false);
            }
          },
        },
      ]
    );
  };

  // Función para validar en tiempo real si la tarjeta está expirada
  const isCardExpired = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear === undefined || expiryMonth === undefined) return false;

    if (expiryYear < currentYear) return true;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return true;

    return false;
  };

  return {
    control,
    errors,
    isSubmitting: isSubmitting || isProcessing,
    isDirty,
    loading,
    paymentMethod,
    handleSubmit: handleSubmit(handleUpdate),
    handleCancel,
    handleDelete,
    watch,
    setValue,
    // Helpers
    expiryMonth,
    expiryYear,
    isActive,
    isCardExpired,
  };
};
