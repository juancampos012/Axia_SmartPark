import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { router } from 'expo-router';
import { getUserPaymentMethods } from '../libs/paymentMethods';
import { createReservationWithPayment, CreateReservationWithPaymentDTO } from '../libs/payments';
import { SavedCardData, paymentMethodToSavedCard } from '../components/molecules/SavedCard';
import { PaymentSummaryData } from '../components/molecules/PaymentSummary';

interface UsePaymentMethodProps {
  reservationDataRaw: any;
  onFocusReload?: boolean;
}

export const usePaymentMethod = ({ reservationDataRaw }: UsePaymentMethodProps) => {
  // Estados
  const [savedCards, setSavedCards] = useState<SavedCardData[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Parsear datos de la reserva para el resumen
  const reservationSummary: PaymentSummaryData = {
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

  // Cargar métodos de pago del backend
  const loadPaymentMethods = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const methods = await getUserPaymentMethods();
      
      // Convertir a SavedCardData[] y filtrar activas
      const cards = methods
        .filter(method => method.isActive)
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

  // Cargar al montar
  useEffect(() => {
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  // Validar datos de reserva
  const validateReservationData = useCallback((): boolean => {
    if (!reservationDataRaw) {
      Alert.alert('Error', 'Faltan datos de la reservación');
      return false;
    }

    if (!reservationDataRaw.parkingSpotId || !reservationDataRaw.vehicleId || 
        !reservationDataRaw.startTime || !reservationDataRaw.endTime || 
        !reservationDataRaw.totalAmount) {
      Alert.alert('Error', 'Faltan datos requeridos para crear la reservación');
      console.error('Datos faltantes:', { reservationDataRaw });
      return false;
    }

    return true;
  }, [reservationDataRaw]);

  // Procesar pago y crear reserva
  const handleProceedToPay = useCallback(async () => {
    if (!selectedCardId) {
      Alert.alert('Error', 'Por favor selecciona un método de pago');
      return;
    }

    if (!validateReservationData()) return;

    try {
      setProcessing(true);

      // Preparar datos para el backend
      const paymentData: CreateReservationWithPaymentDTO = {
        parkingSpotId: reservationDataRaw.parkingSpotId,
        vehicleId: reservationDataRaw.vehicleId,
        startTime: reservationDataRaw.startTime, // ISO string
        endTime: reservationDataRaw.endTime, // ISO string
        amount: reservationDataRaw.totalAmount,
        paymentMethod: 'CREDIT_CARD',
        paymentMethodId: selectedCardId,
        guestName: reservationDataRaw.guestName,
        guestContact: reservationDataRaw.guestContact
      };

      console.log('Enviando datos de reservación con pago:', paymentData);

      // Crear reservación y pago en una transacción
      const result = await createReservationWithPayment(paymentData);

      console.log('Reservación y pago creados:', result);

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
      console.error('Error al procesar el pago:', err);
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
  }, [selectedCardId, validateReservationData, reservationDataRaw]);

  // Navegar a agregar tarjeta
  const handleAddNewCard = useCallback((reservationDataParam?: string) => {
    router.push({
      pathname: '/(tabs)/reservations/payment/add-card',
      params: { 
        reservationData: reservationDataParam,
        returnTo: 'method'
      }
    });
  }, []);

  // Seleccionar tarjeta
  const handleSelectCard = useCallback((cardId: string) => {
    if (!processing) {
      setSelectedCardId(cardId);
    }
  }, [processing]);

  // Volver atrás
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return {
    // Estados
    savedCards,
    selectedCardId,
    loading,
    processing,
    error,
    reservationSummary,
    
    // Funciones
    loadPaymentMethods,
    handleProceedToPay,
    handleAddNewCard,
    handleSelectCard,
    handleGoBack,
  };
};
