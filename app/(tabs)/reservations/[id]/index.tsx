import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SpotNavigatorModal from '../../../../components/molecules/parking/SpotNavigatorModal';
import ParkingMapModal from '../../../../components/molecules/parking/ParkingMapModal';
import { useReservationPolling } from '../../../../hooks/useReservationPolling';
import { ReservationStatus } from '../../../../interfaces/reservation';

interface Reservation {
  id: string;
  parkingName: string;
  address: string;
  time: string;
  date: string;
  status: 'active' | 'completed' | 'cancelled';
  spot?: string;
  floorNumber?: number;
  spotType?: 'STANDARD' | 'ELECTRIC' | 'HANDICAPPED';
  parkingLat?: number;
  parkingLng?: number;
}

const ReservationDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ data?: string; id?: string }>();
  const [showNavigator, setShowNavigator] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // Obtener el ID de la reservación
  const reservationId = params.id || (params.data ? JSON.parse(params.data).id : '');

  // Usar el hook de polling para obtener datos en tiempo real
  const { 
    reservation: liveReservation, 
    loading, 
    isPolling,
    refresh 
  } = useReservationPolling({
    reservationId,
    enabled: !!reservationId,
    interval: 15000, // 15 segundos
    onStatusChange: (newStatus, oldStatus) => {
      // Notificar al usuario cuando cambie el estado
      if (oldStatus === ReservationStatus.PENDING && newStatus === ReservationStatus.CONFIRMED) {
        Alert.alert(
          '✅ Reserva Confirmada',
          'Tu reserva ha sido confirmada por el operador. Ya puedes dirigirte al estacionamiento.',
          [{ text: 'Entendido', style: 'default' }]
        );
      } else if (oldStatus === ReservationStatus.PENDING && newStatus === ReservationStatus.CANCELED) {
        Alert.alert(
          '❌ Reserva Cancelada',
          'Tu reserva ha sido cancelada. Por favor, contacta a soporte si necesitas más información.',
          [{ text: 'Entendido', style: 'default' }]
        );
      }
    }
  });

  // Datos de reservación de fallback (de los params)
  const fallbackReservation: Reservation = params.data ? JSON.parse(params.data) : {
    id: reservationId,
    parkingName: '',
    address: '',
    time: '',
    date: '',
    status: 'active',
  };

  // Transformar datos de la API al formato local
  const formatTime = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const transformReservation = (): Reservation => {
    if (!liveReservation) return fallbackReservation;

    const startTime = new Date(liveReservation.startTime);
    const endTime = new Date(liveReservation.endTime);
    
    const timeStr = `${formatTime(startTime)} - ${formatTime(endTime)}`;
    const dateStr = `${(startTime.getMonth() + 1).toString().padStart(2, '0')}/${startTime.getDate().toString().padStart(2, '0')}/${startTime.getFullYear()}`;
    
    let status: 'active' | 'completed' | 'cancelled' = 'active';
    if (liveReservation.status === ReservationStatus.COMPLETED) status = 'completed';
    else if (liveReservation.status === ReservationStatus.CANCELED) status = 'cancelled';
    else if (liveReservation.status === ReservationStatus.CONFIRMED || liveReservation.status === ReservationStatus.PENDING) status = 'active';
    
    return {
      id: liveReservation.id,
      parkingName: liveReservation.parkingSpot?.parking?.name || fallbackReservation.parkingName,
      address: liveReservation.parkingSpot?.parking?.address || fallbackReservation.address,
      time: timeStr,
      date: dateStr,
      status,
      spot: liveReservation.parkingSpot?.spotNumber ? `Puesto ${liveReservation.parkingSpot.spotNumber}` : fallbackReservation.spot,
      floorNumber: liveReservation.parkingSpot?.floor?.floorNumber || fallbackReservation.floorNumber,
      spotType: (liveReservation.parkingSpot?.type as any) || fallbackReservation.spotType,
      parkingLat: liveReservation.parkingSpot?.parking?.latitude || fallbackReservation.parkingLat,
      parkingLng: liveReservation.parkingSpot?.parking?.longitude || fallbackReservation.parkingLng,
    };
  };

  const reservation = transformReservation();

  const displayAddress = reservation.address || 'Dirección no disponible';
  const displayTime = reservation.time || 'Hora no especificada';
  const displayDate = reservation.date || 'Fecha no especificada';
  const displayParkingName = reservation.parkingName || 'Estacionamiento no disponible';

  // Determinar si la reserva está pendiente de confirmación
  const isPending = liveReservation?.status === ReservationStatus.PENDING;
  const isConfirmed = liveReservation?.status === ReservationStatus.CONFIRMED;

  const getStatusText = (status: string) => {
    // Si tenemos datos en vivo, usar el estado real
    if (liveReservation) {
      if (liveReservation.status === ReservationStatus.PENDING) return 'Pendiente de confirmación';
      if (liveReservation.status === ReservationStatus.CONFIRMED) return 'Confirmada';
      if (liveReservation.status === ReservationStatus.CANCELED) return 'Cancelada';
      if (liveReservation.status === ReservationStatus.COMPLETED) return 'Finalizada';
      if (liveReservation.status === ReservationStatus.EXPIRED) return 'Expirada';
    }
    
    // Fallback al estado local
    return status === 'active' ? 'Activa' : status === 'completed' ? 'Finalizada' : 'Cancelada';
  };

  const getStatusColor = (status: string) => {
    if (liveReservation) {
      if (liveReservation.status === ReservationStatus.PENDING) return '#F59E0B'; // Amarillo/naranja
      if (liveReservation.status === ReservationStatus.CONFIRMED) return '#10B981'; // Verde
      if (liveReservation.status === ReservationStatus.CANCELED) return '#EF4444'; // Rojo
      if (liveReservation.status === ReservationStatus.COMPLETED) return '#6B7280'; // Gris
      if (liveReservation.status === ReservationStatus.EXPIRED) return '#8B5CF6'; // Púrpura
    }
    
    return status === 'active' ? '#10B981' : status === 'completed' ? '#6B7280' : '#EF4444';
  };

  const getStatusIcon = (status: string) => {
    if (liveReservation) {
      if (liveReservation.status === ReservationStatus.PENDING) return 'hourglass-outline';
      if (liveReservation.status === ReservationStatus.CONFIRMED) return 'checkmark-circle';
      if (liveReservation.status === ReservationStatus.CANCELED) return 'close-circle';
      if (liveReservation.status === ReservationStatus.COMPLETED) return 'checkmark-done-circle';
      if (liveReservation.status === ReservationStatus.EXPIRED) return 'time-outline';
    }
    
    switch (status) {
      case 'active': return 'time';
      case 'completed': return 'checkmark-circle';
      case 'cancelled': return 'close-circle';
      default: return 'help-circle';
    }
  };

  const getStatusMessage = () => {
    if (liveReservation) {
      if (liveReservation.status === ReservationStatus.PENDING) {
        return 'Tu reserva está pendiente de confirmación por el operador. Te notificaremos cuando sea confirmada.';
      }
      if (liveReservation.status === ReservationStatus.CONFIRMED) {
        return 'Tu reserva ha sido confirmada. Puedes dirigirte al estacionamiento.';
      }
      if (liveReservation.status === ReservationStatus.CANCELED) {
        return 'Esta reserva ha sido cancelada.';
      }
      if (liveReservation.status === ReservationStatus.COMPLETED) {
        return 'Esta reserva ha sido completada exitosamente.';
      }
      if (liveReservation.status === ReservationStatus.EXPIRED) {
        return 'Esta reserva ha expirado.';
      }
    }
    
    if (reservation.status === 'active') {
      return 'Tu reserva está activa. Puedes dirigirte al estacionamiento.';
    } else if (reservation.status === 'completed') {
      return 'Esta reserva ha sido completada.';
    } else {
      return 'Esta reserva ha sido cancelada.';
    }
  };

  // Mostrar loading inicial
  if (loading && !liveReservation) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-white font-primary mt-4">Cargando detalles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1 px-6 pt-8" showsVerticalScrollIndicator={false}>
        {/* Header con indicador de polling */}
        <View className="mb-8">
          <View className="flex-row items-center justify-between">
            <Text className="text-white text-3xl font-primaryBold mb-2">Detalle de la Reserva</Text>
            {isPolling && (
              <View className="flex-row items-center bg-axia-green/20 px-3 py-1 rounded-full">
                <View className="w-2 h-2 rounded-full bg-axia-green mr-2 animate-pulse" />
                <Text className="text-axia-green text-xs font-primaryBold">Actualizando</Text>
              </View>
            )}
          </View>
          {isPending && (
            <Text className="text-amber-500 text-sm font-primary mt-2">
              ⏳ Esperando confirmación del operador
            </Text>
          )}
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
              <Ionicons 
                name="information-circle-outline" 
                size={20} 
                color={getStatusColor(reservation.status)} 
              />
              <Text className="text-white font-primary ml-2 flex-1">
                {getStatusMessage()}
              </Text>
            </View>
          </View>

          {/* Botones de Navegación - Solo si está confirmada */}
          {isConfirmed && reservation.spot && (
            <View className="space-y-3 mb-4">
              <Pressable
                onPress={() => setShowNavigator(true)}
                className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="navigate" size={20} color="#000000" />
                  <Text className="text-axia-black font-primaryBold text-lg ml-2">
                    Navegar a mi puesto
                  </Text>
                </View>
              </Pressable>

              {reservation.parkingLat && reservation.parkingLng && (
                <Pressable
                  onPress={() => setShowMap(true)}
                  className="bg-axia-darkGray py-4 rounded-xl items-center active:scale-95 border border-axia-green/30"
                >
                  <View className="flex-row items-center justify-center">
                    <Ionicons name="map-outline" size={20} color="#10B981" />
                    <Text className="text-axia-green font-primaryBold text-lg ml-2">
                      Ver en mapa
                    </Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* Botón de refrescar manual si está pendiente */}
          {isPending && (
            <Pressable
              onPress={refresh}
              className="bg-amber-500/20 py-4 rounded-xl items-center active:scale-95 mb-4 border border-amber-500/30"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="refresh" size={20} color="#F59E0B" />
                <Text className="text-amber-500 font-primaryBold text-lg ml-2">
                  Verificar estado ahora
                </Text>
              </View>
            </Pressable>
          )}

          {/* Back Button */}
          <Pressable
            className="bg-axia-gray/20 py-4 rounded-xl items-center active:scale-95"
            onPress={() => router.back()}
          >
            <Text className="text-white text-lg font-primaryBold">Volver</Text>
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

      {/* Modales de Navegación - Solo si está confirmada */}
      {isConfirmed && reservation.spot && (
        <SpotNavigatorModal
          visible={showNavigator}
          onClose={() => setShowNavigator(false)}
          floorNumber={reservation.floorNumber || 1}
          spotNumber={reservation.spot}
          spotType={reservation.spotType || 'STANDARD'}
          parkingName={reservation.parkingName}
        />
      )}

      {isConfirmed && reservation.parkingLat && reservation.parkingLng && (
        <ParkingMapModal
          visible={showMap}
          onClose={() => setShowMap(false)}
          latitude={reservation.parkingLat}
          longitude={reservation.parkingLng}
          parkingName={reservation.parkingName}
          address={reservation.address}
        />
      )}
    </SafeAreaView>
  );
};

export default ReservationDetail;