import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useReservationsScreen } from '../../../hooks/useReservationsScreen';

const Reservations = () => {
  const {
    currentReservation,
    reservationHistory,
    hasActiveReservation,
    totalHistoryCount,
    getStatusText,
    getStatusColor,
    getStatusIcon,
    handleReservationPress,
    handleNewReservation,
  } = useReservationsScreen();

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pt-8">
          
          {/* Header */}
          <View className="mb-8">
            <Text className="text-white text-3xl font-primaryBold mb-2">
              Mis Reservas
            </Text>
          </View>

          {/* Reserva Actual */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-primaryBold">
                Reserva Actual
              </Text>
              {currentReservation && (
                <View 
                  className="flex-row items-center px-3 py-1 rounded-full"
                  style={{ backgroundColor: getStatusColor(currentReservation.status) + '20' }}
                >
                  <Ionicons 
                    name={getStatusIcon(currentReservation.status)} 
                    size={14} 
                    color={getStatusColor(currentReservation.status)} 
                  />
                  <Text 
                    className="text-sm font-primaryBold ml-1"
                    style={{ color: getStatusColor(currentReservation.status) }}
                  >
                    {currentReservation.status === 'pending' ? 'Pendiente' : 'En curso'}
                  </Text>
                </View>
              )}
            </View>

            {currentReservation ? (
              <Pressable
                onPress={() => handleReservationPress(currentReservation)}
                className="bg-axia-darkGray rounded-2xl p-6 shadow-lg shadow-black/50 active:scale-95 transition-all"
              >
                {/* Header con icono */}
                <View className="flex-row items-start mb-4">
                  <View 
                    className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: getStatusColor(currentReservation.status) + '20' }}
                  >
                    <Ionicons 
                      name="car-sport" 
                      size={24} 
                      color={getStatusColor(currentReservation.status)} 
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-white text-xl font-primaryBold mb-1">
                      {currentReservation.parkingName}
                    </Text>
                    <Text className="text-axia-gray text-sm font-primary">
                      {currentReservation.address}
                    </Text>
                  </View>
                </View>

                {/* Mensaje de pendiente si aplica */}
                {currentReservation.status === 'pending' && (
                  <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 mb-4">
                    <View className="flex-row items-center">
                      <Ionicons name="hourglass-outline" size={16} color="#F59E0B" />
                      <Text className="text-amber-500 text-sm font-primary ml-2 flex-1">
                        Esperando confirmación del operador
                      </Text>
                    </View>
                  </View>
                )}

                {/* Información de tiempo */}
                <View className="flex-row items-center mb-4">
                  <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                  <Text className="text-white text-base font-primary ml-2 mr-4">
                    {currentReservation.time}
                  </Text>
                  <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                  <Text className="text-axia-gray text-base font-primary ml-2">
                    {currentReservation.date}
                  </Text>
                </View>

                {/* Detalles de la reserva */}
                <View className="bg-axia-black/50 rounded-xl p-4 mb-4">
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center">
                      <Ionicons name="pricetag-outline" size={16} color="#10B981" />
                      <Text className="text-white font-primary ml-2">Espacio</Text>
                    </View>
                    <Text className="text-axia-gray font-primary">
                      {currentReservation.spot}
                    </Text>
                  </View>
                  
                  <View className="flex-row justify-between items-center">
                    <View className="flex-row items-center">
                      <Ionicons 
                        name={getStatusIcon(currentReservation.status)} 
                        size={16} 
                        color={getStatusColor(currentReservation.status)} 
                      />
                      <Text className="text-white font-primary ml-2">Estado</Text>
                    </View>
                    <View className="flex-row items-center">
                      <View 
                        className="w-2 h-2 rounded-full mr-2"
                        style={{ backgroundColor: getStatusColor(currentReservation.status) }}
                      />
                      <Text 
                        className="font-primary"
                        style={{ color: getStatusColor(currentReservation.status) }}
                      >
                        {getStatusText(currentReservation.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botón de acción */}
                <View className="flex-row items-center justify-between">
                  <Text className="text-axia-gray text-sm font-primary">
                    Toca para ver detalles
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </View>
              </Pressable>
            ) : (
              <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
                <View className="bg-axia-black/50 w-20 h-20 rounded-full items-center justify-center mb-4">
                  <Ionicons name="calendar-outline" size={32} color="#6B7280" />
                </View>
                <Text className="text-axia-gray text-lg font-primaryBold text-center mb-2">
                  No tienes reservas activas
                </Text>
                <Text className="text-axia-gray text-sm font-primary text-center mb-6">
                  Encuentra y reserva tu próximo estacionamiento
                </Text>
                <Pressable
                  onPress={handleNewReservation}
                  className="bg-axia-green px-8 py-4 rounded-xl flex-row items-center shadow-lg shadow-axia-green/25 active:scale-95"
                >
                  <Ionicons name="add" size={20} color="#000000" />
                  <Text className="text-axia-black font-primaryBold ml-2">
                    Hacer una Reserva
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Historial de Reservas */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-primaryBold">
                Historial de Reservas
              </Text>
              <Text className="text-axia-gray text-sm font-primary">
                {totalHistoryCount} reservas
              </Text>
            </View>

            {reservationHistory.map((reservation, index) => (
              <Pressable
                key={reservation.id}
                onPress={() => handleReservationPress(reservation)}
                className="bg-axia-darkGray rounded-2xl p-5 mb-3 shadow-lg shadow-black/30 active:scale-95 transition-all"
              >
                <View className="flex-row items-start">
                  {/* Icono del estado */}
                  <View 
                    className="w-10 h-10 rounded-xl items-center justify-center mr-4"
                    style={{ backgroundColor: getStatusColor(reservation.status) + '20' }}
                  >
                    <Ionicons 
                      name={getStatusIcon(reservation.status)} 
                      size={20} 
                      color={getStatusColor(reservation.status)} 
                    />
                  </View>

                  {/* Información principal */}
                  <View className="flex-1">
                    <View className="flex-row justify-between items-start mb-2">
                      <Text className="text-white text-lg font-primaryBold flex-1 mr-2">
                        {reservation.parkingName}
                      </Text>
                      <View 
                        className="px-3 py-1 rounded-full"
                        style={{ backgroundColor: getStatusColor(reservation.status) + '20' }}
                      >
                        <Text 
                          className="text-xs font-primaryBold"
                          style={{ color: getStatusColor(reservation.status) }}
                        >
                          {getStatusText(reservation.status)}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-axia-gray text-sm font-primary mb-2">
                      {reservation.address}
                    </Text>

                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text className="text-axia-gray text-sm font-primary ml-1">
                          {reservation.time}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                        <Text className="text-axia-gray text-sm font-primary ml-1">
                          {reservation.date}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Línea divisoria sutil */}
                {index < reservationHistory.length - 1 && (
                  <View className="border-b border-axia-border/20 mt-3" />
                )}
              </Pressable>
            ))}
          </View>

          {/* Footer de ayuda */}
          <View className="bg-axia-darkGray rounded-2xl p-6 mb-8">
            <View className="flex-row items-center mb-3">
              <Ionicons name="help-buoy-outline" size={24} color="#6B7280" />
              <Text className="text-white text-lg font-primaryBold ml-3">
                ¿Necesitas ayuda?
              </Text>
            </View>
            <Text className="text-axia-gray text-sm font-primary leading-5 mb-4">
              Si tienes problemas con tus reservas, nuestro equipo de soporte está disponible 24/7.
            </Text>
            <Pressable className="flex-row items-center">
              <Text className="text-axia-green text-sm font-primaryBold mr-2">
                Contactar soporte
              </Text>
              <Ionicons name="arrow-forward" size={16} color="#10B981" />
            </Pressable>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reservations;