import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePaymentHistory } from '../../../../hooks';
import { PaymentWithRelations, PaymentStatus } from '../../../../interfaces/payment';
import CreditCard from '../../../../components/atoms/CreditCard';

const PaymentDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ paymentId: string }>();
  
  const { loadPaymentById, formatAmount, getStatusText, getMethodText } = usePaymentHistory();
  
  const [payment, setPayment] = useState<PaymentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayment();
  }, [params.paymentId]);

  const loadPayment = async () => {
    if (!params.paymentId) return;
    
    setLoading(true);
    const data = await loadPaymentById(params.paymentId);
    setPayment(data);
    setLoading(false);
  };

  const handleGoBack = () => {
    router.back();
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-ES', options);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black">
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={handleGoBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-pbold">Detalle del Pago</Text>
          <View className="w-10" />
        </View>
        
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#A3E636" />
          <Text className="text-axia-gray-light text-sm font-pregular mt-4">
            Cargando detalles...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!payment) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black">
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={handleGoBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-pbold">Detalle del Pago</Text>
          <View className="w-10" />
        </View>
        
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
          <Text className="text-white text-lg font-pbold mt-4">
            Pago no encontrado
          </Text>
          <Text className="text-axia-gray-light text-sm font-pregular mt-2 text-center">
            No se pudo cargar la información del pago
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const isSuccessful = payment.status === PaymentStatus.SUCCESSFUL;
  const isPending = payment.status === PaymentStatus.PENDING;
  const isFailed = payment.status === PaymentStatus.FAILED;

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 mb-4">
        <TouchableOpacity onPress={handleGoBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-pbold">Detalle del Pago</Text>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Estado y Monto Principal */}
        <View className="px-6 mb-6">
          <View className="bg-axia-dark-gray rounded-3xl p-6 items-center">
            <View className="mb-4">
              <Ionicons
                name={isSuccessful ? 'checkmark-circle' : isPending ? 'time' : 'close-circle'}
                size={64}
                color={isSuccessful ? '#10B981' : isPending ? '#F59E0B' : '#EF4444'}
              />
            </View>
            
            <Text
              className="text-lg font-pbold mb-2"
              style={{ color: isSuccessful ? '#10B981' : isPending ? '#F59E0B' : '#EF4444' }}
            >
              {getStatusText(payment.status)}
            </Text>
            
            <Text className="text-white text-4xl font-pbold">
              {formatAmount(payment.amount)}
            </Text>
            
            <Text className="text-axia-gray-light text-sm font-pregular mt-2">
              {formatDate(payment.createdAt)}
            </Text>
          </View>
        </View>

        {/* Método de Pago */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-pbold mb-3">Método de Pago</Text>
          
          {payment.paymentMethodDetail ? (
            <View className="mb-4">
              <CreditCard
                lastFourDigits={payment.paymentMethodDetail.lastFourDigits}
                cardholderName={payment.paymentMethodDetail.cardholderName}
                expiryDate={payment.paymentMethodDetail.expirationDate}
                cardType={payment.paymentMethodDetail.cardType as 'VISA' | 'MASTERCARD' | 'AMEX' | 'DISCOVER' | 'DINERS'}
                variant="default"
              />
            </View>
          ) : (
            <View className="bg-axia-dark-gray rounded-2xl p-4 flex-row items-center">
              <Ionicons
                name={payment.paymentMethod === 'CREDIT_CARD' ? 'card' : payment.paymentMethod === 'DEBIT_CARD' ? 'card-outline' : 'cash'}
                size={24}
                color="#A3E636"
              />
              <Text className="text-white text-base font-pmedium ml-3">
                {getMethodText(payment.paymentMethod)}
              </Text>
            </View>
          )}
        </View>

        {/* Información de la Reserva */}
        {payment.reservation && (
          <View className="px-6 mb-6">
            <Text className="text-white text-lg font-pbold mb-3">Información de la Reserva</Text>
            
            <View className="bg-axia-dark-gray rounded-2xl p-4">
              {/* Parqueadero */}
              {payment.reservation.parkingSpot?.parking && (
                <View className="mb-4 pb-4 border-b border-axia-gray-dark">
                  <Text className="text-axia-gray-light text-xs font-pregular mb-2">
                    PARQUEADERO
                  </Text>
                  <View className="flex-row items-start">
                    <Ionicons name="location" size={20} color="#A3E636" />
                    <View className="ml-3 flex-1">
                      <Text className="text-white text-base font-pmedium">
                        {payment.reservation.parkingSpot.parking.name}
                      </Text>
                      <Text className="text-axia-gray-light text-sm font-pregular mt-1">
                        {payment.reservation.parkingSpot.parking.address}
                      </Text>
                      {payment.reservation.parkingSpot.spotNumber && (
                        <Text className="text-axia-lime text-sm font-pmedium mt-2">
                          Puesto: {payment.reservation.parkingSpot.spotNumber}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              )}

              {/* Vehículo */}
              {payment.reservation.vehicle && (
                <View className="mb-4 pb-4 border-b border-axia-gray-dark">
                  <Text className="text-axia-gray-light text-xs font-pregular mb-2">
                    VEHÍCULO
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons name="car-sport" size={20} color="#A3E636" />
                    <View className="ml-3">
                      <Text className="text-white text-base font-pmedium">
                        {payment.reservation.vehicle.carBrand} {payment.reservation.vehicle.model}
                      </Text>
                      <Text className="text-axia-gray-light text-sm font-pregular mt-1">
                        Placa: {payment.reservation.vehicle.licensePlate}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Horario */}
              <View>
                <Text className="text-axia-gray-light text-xs font-pregular mb-2">
                  HORARIO
                </Text>
                <View className="flex-row items-center mb-2">
                  <Ionicons name="enter-outline" size={18} color="#10B981" />
                  <Text className="text-axia-gray-light text-sm font-pregular ml-2">
                    Entrada:
                  </Text>
                  <Text className="text-white text-sm font-pmedium ml-2">
                    {formatDate(payment.reservation.startTime)}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="exit-outline" size={18} color="#EF4444" />
                  <Text className="text-axia-gray-light text-sm font-pregular ml-2">
                    Salida:
                  </Text>
                  <Text className="text-white text-sm font-pmedium ml-2">
                    {formatDate(payment.reservation.endTime)}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Detalles de Transacción */}
        <View className="px-6 mb-6">
          <Text className="text-white text-lg font-pbold mb-3">Detalles de Transacción</Text>
          
          <View className="bg-axia-dark-gray rounded-2xl p-4">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-axia-gray-light text-sm font-pregular">ID de Pago</Text>
              <Text className="text-white text-sm font-pmedium">
                {payment.id.substring(0, 8)}...
              </Text>
            </View>

            {payment.transactionId && (
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-axia-gray-light text-sm font-pregular">ID de Transacción</Text>
                <Text className="text-white text-sm font-pmedium">
                  {payment.transactionId}
                </Text>
              </View>
            )}

            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-axia-gray-light text-sm font-pregular">Método</Text>
              <Text className="text-white text-sm font-pmedium">
                {getMethodText(payment.paymentMethod)}
              </Text>
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-axia-gray-light text-sm font-pregular">Fecha de Pago</Text>
              <Text className="text-white text-sm font-pmedium">
                {formatDate(payment.createdAt)}
              </Text>
            </View>

            {payment.failureReason && (
              <View className="mt-3 pt-3 border-t border-axia-gray-dark">
                <Text className="text-red-500 text-xs font-pregular mb-1">RAZÓN DEL FALLO</Text>
                <Text className="text-white text-sm font-pregular">
                  {payment.failureReason}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Botones de acción (opcional) */}
        {isSuccessful && (
          <View className="px-6 mb-8">
            <TouchableOpacity
              className="bg-axia-dark-gray rounded-xl p-4 flex-row items-center justify-center"
              activeOpacity={0.7}
              onPress={() => {
                // Aquí podrías implementar funcionalidad para descargar recibo
                console.log('Descargar recibo');
              }}
            >
              <Ionicons name="download-outline" size={20} color="#A3E636" />
              <Text className="text-axia-lime text-base font-pmedium ml-2">
                Descargar Recibo
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentDetail;
