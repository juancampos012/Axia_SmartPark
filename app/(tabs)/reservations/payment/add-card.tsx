import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import CreditCard from '../../../../components/atoms/CreditCard';
import Input from '../../../../components/atoms/Input';
import Button from '../../../../components/atoms/Button';
import Checkbox from '../../../../components/atoms/Checkbox';
import { createPaymentMethod } from '../../../../libs/paymentMethods';
import { SavedPaymentMethod, detectCardBrand } from '../../../../interfaces/paymentMethod';

// Esquema de validación con Zod
const cardSchema = z.object({
  cardNumber: z.string()
    .min(1, 'El número de tarjeta es obligatorio')
    .transform((val) => val.replace(/\s/g, ''))
    .refine((val) => {
      // Visa: ^4[0-9]{12}(?:[0-9]{3})?$
      const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
      // Mastercard: ^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$
      const mastercardRegex = /^(5[1-5][0-9]{14}|2(2[2-9][0-9]{12}|[3-6][0-9]{13}|7[01][0-9]{12}|720[0-9]{12}))$/;
      // Amex: ^3[47][0-9]{13}$
      const amexRegex = /^3[47][0-9]{13}$/;
      // Discover: ^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$
      const discoverRegex = /^6(?:011|5[0-9]{2}|4[4-9][0-9])[0-9]{12}$/;
      // Diners: ^3(?:0[0-5]|[68][0-9])[0-9]{11}$
      const dinersRegex = /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/;
      
      return visaRegex.test(val) || mastercardRegex.test(val) || amexRegex.test(val) || 
             discoverRegex.test(val) || dinersRegex.test(val);
    }, 'Número de tarjeta inválido'),
  cardholderName: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .regex(/^[a-zA-Z\s]+$/, 'Solo se permiten letras y espacios'),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato inválido (MM/AA)')
    .refine((val) => {
      const [month, year] = val.split('/').map(Number);
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear() % 100;
      const currentMonth = currentDate.getMonth() + 1;
      
      if (year < currentYear) return false;
      if (year === currentYear && month < currentMonth) return false;
      return true;
    }, 'La tarjeta ha expirado'),
  cvv: z.string()
    .regex(/^\d{3,4}$/, 'CVV debe tener 3 o 4 dígitos'),
  saveCard: z.boolean()
});

type CardFormData = z.infer<typeof cardSchema>;

const AddNewCard = () => {
  const params = useLocalSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { control, handleSubmit, watch, formState: { errors } } = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      cardNumber: '',
      cardholderName: '',
      expiryDate: '',
      cvv: '',
      saveCard: true
    }
  });

  // Watch para actualizar la tarjeta en tiempo real
  const watchedCardNumber = watch('cardNumber');
  const watchedCardholderName = watch('cardholderName');
  const watchedExpiryDate = watch('expiryDate');

  // Detectar tipo de tarjeta basándose en el número con las mismas regex de validación
  const detectCardType = (number: string): 'visa' | 'mastercard' | 'amex' | 'discover' | 'diners' | 'unknown' => {
    const cleaned = number.replace(/\s/g, '');
    
    // Visa: Comienza por 4
    if (/^4/.test(cleaned)) return 'visa';
    
    // Mastercard: Comienza por 51-55 o 2221-2720
    if (/^(5[1-5]|2(2[2-9]|[3-6][0-9]|7[01]|720))/.test(cleaned)) return 'mastercard';
    
    // Amex: Comienza por 34 o 37
    if (/^3[47]/.test(cleaned)) return 'amex';
    
    // Discover: Comienza por 6011, 65, o 644-649
    if (/^6(?:011|5|4[4-9])/.test(cleaned)) return 'discover';
    
    // Diners: Comienza por 300-305, 36 o 38
    if (/^3(?:0[0-5]|[68])/.test(cleaned)) return 'diners';
    
    return 'unknown';
  };

  // Formatear número de tarjeta mientras se escribe
  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  // Formatear fecha de expiración
  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const onSubmit = async (data: CardFormData) => {
    try {
      setIsSubmitting(true);
      
      // Parsear fecha de expiración
      const [month, year] = data.expiryDate.split('/').map(Number);
      const fullYear = 2000 + year; // Convertir 28 -> 2028
      
      // Detectar el tipo de tarjeta
      const cardType = detectCardType(data.cardNumber);
      
      // Preparar los datos para el backend
      const paymentMethodData = {
        type: SavedPaymentMethod.CREDIT_CARD, // Por ahora asumimos tarjeta de crédito
        cardNumber: data.cardNumber.replace(/\s/g, ''), // Remover espacios
        cardholderName: data.cardholderName,
        expiryMonth: month,
        expiryYear: fullYear,
        cvv: data.cvv,
        setAsDefault: data.saveCard 
      };
      
      // Crear el método de pago en el backend
      await createPaymentMethod(paymentMethodData);
      
      Alert.alert(
        'Éxito',
        'Tarjeta agregada correctamente',
        [
          {
            text: 'OK',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error: any) {
      console.error('Error al agregar tarjeta:', error);
      Alert.alert(
        'Error',
        error.message || 'No se pudo agregar la tarjeta. Intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top']}>
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 border-b border-axia-gray/20">
          <Pressable 
            onPress={handleGoBack}
            className="mr-4 active:opacity-70"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Text className="text-white text-xl font-primaryBold flex-1">
            Agregar Nueva Tarjeta
          </Text>
        </View>

        <ScrollView 
          className="flex-1"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="px-6 py-6">
            {/* Vista previa de la tarjeta */}
            <View className="mb-8">
              <CreditCard
                cardNumber={watchedCardNumber}
                cardholderName={watchedCardholderName}
                expiryDate={watchedExpiryDate}
                cardType={detectCardType(watchedCardNumber)}
                variant="default"
              />
            </View>

            {/* Formulario */}
            <View className="space-y-4">
              {/* Número de tarjeta */}
              <View>
                <Text className="text-axia-gray text-sm font-primary mb-2">
                  Número de tarjeta
                </Text>
                <Controller
                  control={control}
                  name="cardNumber"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="•••• •••• •••• 1458"
                      value={value}
                      onChangeText={(text) => {
                        // Limitar a 19 caracteres (16 dígitos + 3 espacios)
                        if (text.length <= 19) {
                          const formatted = formatCardNumber(text.replace(/\D/g, ''));
                          onChange(formatted);
                        }
                      }}
                      keyboardType="numeric"
                      error={errors.cardNumber?.message}
                      leftIcon={<Ionicons name="card-outline" size={20} color="#6B7280" />}
                    />
                  )}
                />
              </View>

              {/* Nombre del titular */}
              <View>
                <Text className="text-axia-gray text-sm font-primary mb-2">
                  Nombre del titular
                </Text>
                <Controller
                  control={control}
                  name="cardholderName"
                  render={({ field: { onChange, value } }) => (
                    <Input
                      placeholder="JUAN PÉREZ"
                      value={value}
                      onChangeText={(text) => onChange(text.toUpperCase())}
                      autoCapitalize="characters"
                      error={errors.cardholderName?.message}
                      leftIcon={<Ionicons name="person-outline" size={20} color="#6B7280" />}
                    />
                  )}
                />
              </View>

              {/* Fecha de expiración y CVV */}
              <View className="flex-row space-x-4">
                {/* Fecha de expiración */}
                <View className="flex-1">
                  <Text className="text-axia-gray text-sm font-primary mb-2">
                    Fecha de vencimiento
                  </Text>
                  <Controller
                    control={control}
                    name="expiryDate"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="04 / 28"
                        value={value}
                        onChangeText={(text) => {
                          // Limitar a 5 caracteres (MM/YY)
                          if (text.length <= 5) {
                            const formatted = formatExpiryDate(text);
                            onChange(formatted);
                          }
                        }}
                        keyboardType="numeric"
                        error={errors.expiryDate?.message}
                        leftIcon={<Ionicons name="calendar-outline" size={20} color="#6B7280" />}
                      />
                    )}
                  />
                </View>

                {/* CVV */}
                <View className="flex-1">
                  <Text className="text-axia-gray text-sm font-primary mb-2">
                    CVV / CCV
                  </Text>
                  <Controller
                    control={control}
                    name="cvv"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="915"
                        value={value}
                        onChangeText={(text) => {
                          // Limitar a 4 dígitos (CVV)
                          if (text.length <= 4 && /^\d*$/.test(text)) {
                            onChange(text);
                          }
                        }}
                        keyboardType="numeric"
                        secureTextEntry
                        error={errors.cvv?.message}
                        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#6B7280" />}
                      />
                    )}
                  />
                </View>
              </View>

              {/* Guardar información de la tarjeta */}
              <View className="mt-4">
                <Controller
                    control={control}
                    name="saveCard"
                    render={({ field: { onChange, value } }) => (
                        <Checkbox
                        label="Guardar información de la tarjeta"
                        value={value}
                        onValueChange={onChange}
                        color="green"
                        pressLabel={true}
                        />
                    )}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Botón fijo en la parte inferior */}
        <View className="px-6 py-4 bg-axia-black border-t border-axia-gray/20">
          <Button
            title={isSubmitting ? "Agregando..." : "Agregar Tarjeta"}
            onPress={handleSubmit(onSubmit)}
            size="large"
            className="shadow-lg shadow-axia-green/25"
            disabled={isSubmitting}
          />
          {isSubmitting && (
            <View className="absolute inset-0 items-center justify-center">
              <ActivityIndicator size="small" color="#10B981" />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddNewCard;
