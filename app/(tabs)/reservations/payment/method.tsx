import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SavedCard, { SavedCardData, paymentMethodToSavedCard } from '../../../../components/molecules/SavedCard';
import PaymentSummary, { PaymentSummaryData } from '../../../../components/molecules/PaymentSummary';
import Button from '../../../../components/atoms/Button';
import { getUserPaymentMethods } from '../../../../libs/paymentMethods';
import { createReservationWithPayment, CreateReservationWithPaymentDTO } from '../../../../libs/payments';
import { PaymentMethodResponse } from '../../../../interfaces/paymentMethod';

const PaymentMethod = () => {
  const params = useLocalSearchParams();
  
  // Parse de los datos de la reserva
  // Estos deben incluir: parkingSpotId, vehicleId, startTime, endTime, amount, parkingName, address, etc.
  const reservationDataRaw = params.reservationData ? JSON.parse(params.reservationData as string) : null;
  
  const reservationData: PaymentSummaryData = {
    parkingName: reservationDataRaw?.parkingName || 'Parqueadero Central',
    address: reservationDataRaw?.address || 'Cra 23 #54-72',
    spotNumber: reservationDataRaw?.spotNumber || '23',
    date: reservationDataRaw?.date || '17/08/2025',
    startTime: reservationDataRaw?.startTimeFormatted || '3:00 PM',
    endTime: reservationDataRaw?.endTimeFormatted || '5:00 PM',
    duration: reservationDataRaw?.duration || '2 horas',
    hourlyRate: reservationDataRaw?.hourlyRate || 3.50,
    totalAmount: reservationDataRaw?.totalAmount || 7.00
  };

  const [savedCards, setSavedCards] = useState<SavedCardData[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar métodos de pago del backend
  const loadPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const methods = await getUserPaymentMethods();
      
      // Convertir PaymentMethodResponse[] a SavedCardData[]
      const cards = methods
        .filter(method => method.isActive) // Solo tarjetas activas
        .map(paymentMethodToSavedCard);
      
      setSavedCards(cards);
      
      // Seleccionar la tarjeta por defecto automáticamente
      const defaultCard = cards.find(card => card.isDefault);
      if (defaultCard) {
        setSelectedCardId(defaultCard.id);
      } else if (cards.length > 0) {
        setSelectedCardId(cards[0].id);
      }
    } catch (err: any) {
      console.error('Error al cargar métodos de pago:', err);
      setError(err.message || 'Error al cargar los métodos de pago');
      Alert.alert('Error', err.message || 'No se pudieron cargar los métodos de pago');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar al montar el componente
  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  // Recargar cuando la pantalla recibe el foco (incluye cuando regresas de add-card)
  useFocusEffect(
    useCallback(() => {
      loadPaymentMethods();
    }, [loadPaymentMethods])
  );

  const handleGoBack = () => {
    router.back();
  };

  const handleAddNewCard = () => {
    router.push({
      pathname: '/(tabs)/reservations/payment/add-card',
      params: { 
        reservationData: params.reservationData,
        returnTo: 'method' // Para saber que debe recargar al volver
      }
    });
  };

  const handleProceedToPay = async () => {
    if (!selectedCardId) {
      Alert.alert('Error', 'Por favor selecciona un método de pago');
      return;
    }

    if (!reservationDataRaw) {
      Alert.alert('Error', 'Faltan datos de la reservación');
      return;
    }

    // Validar que tenemos todos los datos necesarios
    if (!reservationDataRaw.parkingSpotId || !reservationDataRaw.vehicleId || 
        !reservationDataRaw.startTime || !reservationDataRaw.endTime || 
        !reservationDataRaw.totalAmount) {
      Alert.alert('Error', 'Faltan datos requeridos para crear la reservación');
      console.error('Datos faltantes:', { reservationDataRaw });
      return;
    }

    try {
      setProcessing(true);

      // Preparar datos para el backend
      const paymentData: CreateReservationWithPaymentDTO = {
        parkingSpotId: reservationDataRaw.parkingSpotId,
        vehicleId: reservationDataRaw.vehicleId,
        startTime: reservationDataRaw.startTime, // ISO string
        endTime: reservationDataRaw.endTime, // ISO string
        amount: reservationDataRaw.totalAmount,
        paymentMethod: 'CREDIT_CARD', // Puedes detectar esto desde el tipo de tarjeta
        paymentMethodId: selectedCardId,
        guestName: reservationDataRaw.guestName,
        guestContact: reservationDataRaw.guestContact
      };

      console.log('📤 Enviando datos de reservación con pago:', paymentData);

      // Crear reservación y pago en una transacción
      const result = await createReservationWithPayment(paymentData);

      console.log('✅ Reservación y pago creados:', result);

      // Navegar a la pantalla de éxito
      router.replace({
        pathname: '/(tabs)/reservations/payment/checkout',
        params: {
          reservationId: result.reservation.id,
          paymentId: result.payment.id,
          success: 'true'
        }
      });

    } catch (err: any) {
      console.error('❌ Error al procesar el pago:', err);
      Alert.alert(
        'Error al procesar el pago',
        err.message || 'No se pudo procesar tu reservación. Intenta nuevamente.',
        [
          { text: 'Reintentar', onPress: handleProceedToPay },
          { text: 'Cancelar', style: 'cancel' }
        ]
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top']}>
      {/* Loading overlay */}
      {processing && (
        <View className="absolute inset-0 bg-black/70 z-50 justify-center items-center">
          <View className="bg-axia-darkGray rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#10B981" />
            <Text className="text-white font-primaryBold mt-4">Procesando pago...</Text>
            <Text className="text-axia-gray font-primary mt-2 text-center">
              Por favor espera un momento
            </Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-axia-gray/20">
        <Pressable 
          onPress={handleGoBack}
          className="mr-4 active:opacity-70"
          disabled={processing}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text className="text-white text-xl font-primaryBold flex-1">
          Método de Pago
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6 py-6">
          {/* Resumen de la reserva */}
          <PaymentSummary data={reservationData} />

          {/* Tarjetas guardadas */}
          <View className="mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Tarjetas Guardadas
            </Text>

            {loading ? (
              <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
                <ActivityIndicator size="large" color="#10B981" />
                <Text className="text-axia-gray text-base font-primary mt-4">
                  Cargando métodos de pago...
                </Text>
              </View>
            ) : error ? (
              <View className="bg-red-900/20 rounded-2xl p-6 items-center border border-red-500/30">
                <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text className="text-red-400 text-base font-primary mt-4 text-center">
                  {error}
                </Text>
                <Pressable
                  onPress={loadPaymentMethods}
                  className="mt-4 bg-red-500/20 px-6 py-2 rounded-lg active:opacity-70"
                >
                  <Text className="text-red-400 font-primaryBold">Reintentar</Text>
                </Pressable>
              </View>
            ) : savedCards.length > 0 ? (
              savedCards.map((card) => (
                <SavedCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onPress={() => !processing && setSelectedCardId(card.id)}
                />
              ))
            ) : (
              <View className="bg-axia-darkGray rounded-2xl p-6 items-center">
                <Ionicons name="card-outline" size={48} color="#6B7280" />
                <Text className="text-axia-gray text-base font-primary mt-4 text-center">
                  No tienes tarjetas guardadas
                </Text>
              </View>
            )}

            {/* Botón para agregar nueva tarjeta */}
            <Pressable
              onPress={handleAddNewCard}
              disabled={processing}
              className="flex-row items-center justify-center bg-axia-darkGray/50 rounded-2xl p-4 mt-4 active:opacity-70 border-2 border-dashed border-axia-green/30"
            >
              <Ionicons name="add-circle-outline" size={24} color="#10B981" />
              <Text className="text-axia-green text-base font-primaryBold ml-2">
                Agregar Nueva Tarjeta
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo en la parte inferior */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-axia-black border-t border-axia-gray/20">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-axia-gray text-base font-primary">Total a Pagar</Text>
          <Text className="text-axia-green text-2xl font-primaryBold">
            ${reservationData.totalAmount.toFixed(2)}
          </Text>
        </View>
        <Button
          title={processing ? "Procesando..." : "Proceder al Pago"}
          onPress={handleProceedToPay}
          variant="primary"
          size="large"
          disabled={!selectedCardId || processing}
          className="shadow-lg shadow-axia-green/25"
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethod;
