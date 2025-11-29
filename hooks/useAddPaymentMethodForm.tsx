import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { CreatePaymentMethodSchema, CreatePaymentMethodFormData } from '../schemas/paymentMethodSchema';
import { createPaymentMethod } from '../libs/paymentMethods';
import { CreatePaymentMethodDTO, SavedPaymentMethod } from '../interfaces/paymentMethod';

interface UseAddPaymentMethodFormProps {
  onSuccess?: () => void;
}

export const useAddPaymentMethodForm = ({ onSuccess }: UseAddPaymentMethodFormProps = {}) => {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset,
  } = useForm<CreatePaymentMethodFormData>({
    resolver: zodResolver(CreatePaymentMethodSchema),
    defaultValues: {
      type: 'CREDIT_CARD',
      cardNumber: '',
      cardholderName: '',
      expiryMonth: new Date().getMonth() + 1,
      expiryYear: new Date().getFullYear(),
      cvv: '',
      billingAddress: undefined,
      nickname: undefined,
      setAsDefault: undefined,
    },
    mode: 'onChange',
  });

  const cardType = watch('type');
  const cardNumber = watch('cardNumber');
  const expiryMonth = watch('expiryMonth');
  const expiryYear = watch('expiryYear');

  // Función para formatear el número de tarjeta con espacios
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s+/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Función para detectar la marca de la tarjeta
  const detectCardBrand = (number: string): 'VISA' | 'MASTERCARD' | 'AMEX' | 'DINERS' | 'DISCOVER' | 'OTHER' => {
    const cleaned = number.replace(/\s+/g, '');
    
    if (/^4/.test(cleaned)) return 'VISA';
    if (/^5[1-5]/.test(cleaned)) return 'MASTERCARD';
    if (/^3[47]/.test(cleaned)) return 'AMEX';
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'DINERS';
    if (/^6(?:011|5)/.test(cleaned)) return 'DISCOVER';
    
    return 'OTHER';
  };

  const handleSave = async (data: CreatePaymentMethodFormData) => {
    try {
      setIsProcessing(true);

      // Preparar payload para el backend
      const payload: CreatePaymentMethodDTO = {
        type: data.type as SavedPaymentMethod,
        cardNumber: data.cardNumber.replace(/\s+/g, ''), // Remover espacios
        cardholderName: data.cardholderName.trim(),
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        cvv: data.cvv,
        billingAddress: data.billingAddress?.trim() || undefined,
        nickname: data.nickname?.trim() || undefined,
        setAsDefault: data.setAsDefault || false,
      };

      console.log('💳 Creando método de pago...');

      // Enviar al backend
      const result = await createPaymentMethod(payload);

      console.log('✅ Método de pago creado:', result);

      Alert.alert(
        'Éxito',
        'Tarjeta agregada correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              reset();
              onSuccess?.();
              router.back();
            },
          },
        ]
      );
    } catch (error: any) {
      console.error('❌ Error al crear método de pago:', error);
      
      let errorMessage = 'No se pudo agregar la tarjeta. Intenta nuevamente.';
      
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
    Alert.alert(
      'Cancelar',
      '¿Estás seguro de que deseas cancelar? Los datos no se guardarán.',
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
  };

  // Función para validar en tiempo real si la tarjeta está expirada
  const isCardExpired = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (expiryYear < currentYear) return true;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return true;

    return false;
  };

  return {
    control,
    errors,
    isSubmitting: isSubmitting || isProcessing,
    onSubmit: handleSubmit(handleSave),
    handleCancel,
    watch,
    setValue,
    // Helpers
    cardType,
    cardNumber,
    expiryMonth,
    expiryYear,
    formatCardNumber,
    detectCardBrand,
    isCardExpired,
  };
};
