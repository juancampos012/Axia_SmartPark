import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Reservation {
  id: string;
  parkingName: string;
  address: string;
  time: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  spot?: string;
}

const ReservationDetail = () => {
  const router = useRouter();
  const { data } = useLocalSearchParams<{ data: string }>();

  const reservation: Reservation = data ? JSON.parse(data) : {
    id: '',
    parkingName: '',
    address: '',
    time: '',
    date: '',
    status: '',
  };

  const displayAddress = reservation.address || 'Dirección no disponible';
  const displayTime = reservation.time || 'Hora no especificada';
  const displayDate = reservation.date || 'Fecha no especificada';
  const displayParkingName = reservation.parkingName || 'Estacionamiento no disponible';

  const getStatusText = (status: string) =>
    status === 'active' ? 'Activa' : status === 'completed' ? 'Finalizada' : 'Cancelada';

  const getStatusColor = (status: string) =>
    status === 'active' ? '#10B981' : status === 'completed' ? '#6B7280' : '#EF4444';

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return 'time';
      case 'completed': return 'checkmark-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        <View className="mb-8">
          <Text className="text-white text-3xl font-primaryBold mb-2">Detalle de la Reserva</Text>
        </View>

        <View className="bg-axia-darkGray rounded-2xl p-6 mb-8 shadow-lg shadow-black/50">
          <View className="mb-6">
            <View className="flex-row items-start mb-3">
              <Ionicons name="location-outline" size={24} color="#10B981" />
              <View className="ml-3 flex-1">
                <Text className="text-white text-xl font-primaryBold mb-1">{displayParkingName}</Text>
                <Text className="text-axia-gray text-sm font-primary leading-5">{displayAddress}</Text>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mb-6">
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#9CA3AF" />
              <Text className="text-white text-base font-primary ml-2">{displayTime}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={20} color="#9CA3AF" />
              <Text className="text-axia-gray text-base font-primary ml-2">{displayDate}</Text>
            </View>
          </View>

          <View className="border-t border-axia-border/30 mb-6" />

          <View className="mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">Detalles de la Reserva</Text>
            
            <View className="space-y-4">
              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-axia-green/20 items-center justify-center mr-3">
                    <Ionicons name="car-sport-outline" size={16} color="#10B981" />
                  </View>
                  <Text className="text-white font-primary">Tipo de vehículo</Text>
                </View>
                <Text className="text-axia-gray font-primary">Carro</Text>
              </View>

              <View className="flex-row items-center justify-between mb-2">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-axia-green/20 items-center justify-center mr-3">
                    <Ionicons name="pricetag-outline" size={16} color="#10B981" />
                  </View>
                  <Text className="text-white font-primary">Espacio</Text>
                </View>
                <Text className="text-axia-gray font-primary">
                  {reservation.spot || 'No asignado'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 rounded-full bg-axia-green/20 items-center justify-center mr-3">
                    <Ionicons name={getStatusIcon(reservation.status)} size={16} color="#10B981" />
                  </View>
                  <Text className="text-white font-primary">Estado</Text>
                </View>
                <View className="flex-row items-center">
                  <View 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: getStatusColor(reservation.status) }}
                  />
                  <Text className="text-axia-gray font-primary">{getStatusText(reservation.status)}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Status Badge */}
          <View className="bg-axia-black/50 rounded-lg p-4 mb-6 border-l-4" 
                style={{ borderLeftColor: getStatusColor(reservation.status) }}>
            <View className="flex-row items-center">
              <Ionicons name="information-circle-outline" size={20} color={getStatusColor(reservation.status)} />
              <Text className="text-white font-primary ml-2 flex-1">
                {reservation.status === 'active' 
                  ? 'Tu reserva está activa. Puedes dirigirte al estacionamiento.'
                  : reservation.status === 'completed'
                  ? 'Esta reserva ha sido completada.'
                  : 'Esta reserva ha sido cancelada.'}
              </Text>
            </View>
          </View>

          {/* Back Button */}
          <Pressable
            className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95 transition-all"
            onPress={() => router.back()}
          >
            <Text className="text-axia-black text-lg font-primaryBold">Volver</Text>
          </Pressable>
        </View>

        {/* Help Section */}
        <View className="bg-axia-darkGray rounded-2xl p-6 mb-8">
          <View className="flex-row items-center mb-3">
            <Ionicons name="help-circle-outline" size={24} color="#6B7280" />
            <Text className="text-white text-lg font-primaryBold ml-2">¿Necesitas ayuda?</Text>
          </View>
          <Text className="text-axia-gray text-sm font-primary leading-5">
            Si tienes problemas con tu reserva, contacta a nuestro soporte técnico.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReservationDetail;