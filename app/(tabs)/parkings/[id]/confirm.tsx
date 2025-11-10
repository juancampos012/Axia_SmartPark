// ./(tabs)/parkings/[id]/confirm.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import SpotNavigatorModal from '../../../../components/molecules/parking/SpotNavigatorModal';
import ParkingMapModal from '../../../../components/molecules/parking/ParkingMapModal';

export default function ConfirmScreen() {
  const params = useLocalSearchParams<{ 
    parkingId: string;
    parkingName: string;
    parkingAddress: string;
    parkingLat?: string;
    parkingLng?: string;
    spotNumber: string;
    spotType: string;
    floorNumber: string;
    date: string;
    startTime: string;
    endTime: string;
    totalPrice: string;
  }>();
  
  const router = useRouter();
  const [showNavigator, setShowNavigator] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleNavigateToSpot = () => {
    setShowNavigator(true);
  };

  const handleViewMap = () => {
    setShowMap(true);
  };

  const handleGoHome = () => {
    router.push('/(tabs)/home');
  };

  const spotType = (params.spotType || 'STANDARD') as 'STANDARD' | 'ELECTRIC' | 'HANDICAPPED';

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-8">
          {/* Success Icon */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-axia-green items-center justify-center mb-4">
              <Ionicons name="checkmark" size={64} color="#FFFFFF" />
            </View>
            <Text className="text-white text-3xl font-primaryBold text-center mb-2">
              ¡Reserva Confirmada!
            </Text>
            <Text className="text-axia-gray text-base text-center">
              Tu espacio ha sido reservado exitosamente
            </Text>
          </View>

          {/* Parking Info Card */}
          <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
            <Text className="text-white text-xl font-primaryBold mb-4">
              Información del Parqueadero
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-axia-green/20 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="business" size={16} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-axia-gray text-xs font-primary mb-1">Parqueadero</Text>
                  <Text className="text-white font-primaryBold">{params.parkingName}</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-axia-green/20 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="location" size={16} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-axia-gray text-xs font-primary mb-1">Dirección</Text>
                  <Text className="text-white font-primary">{params.parkingAddress}</Text>
                </View>
              </View>

              <View className="flex-row items-start">
                <View className="w-8 h-8 bg-axia-green/20 rounded-lg items-center justify-center mr-3">
                  <Ionicons name="calendar" size={16} color="#10B981" />
                </View>
                <View className="flex-1">
                  <Text className="text-axia-gray text-xs font-primary mb-1">Fecha y Hora</Text>
                  <Text className="text-white font-primary">
                    {params.date} • {params.startTime} - {params.endTime}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Spot Info Card */}
          <View className="bg-gradient-to-br from-axia-darkGray to-axia-gray/10 rounded-2xl p-6 mb-6 border-2 border-axia-green">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-primaryBold">
                Tu Puesto Reservado
              </Text>
              <View className="bg-axia-green/20 px-3 py-1 rounded-full">
                <Text className="text-axia-green text-xs font-primaryBold">CONFIRMADO</Text>
              </View>
            </View>

            <View className="flex-row items-center justify-between bg-axia-black/30 rounded-xl p-4">
              <View className="items-center flex-1">
                <Text className="text-axia-gray text-sm font-primary mb-1">Puesto</Text>
                <Text className="text-white text-3xl font-primaryBold">{params.spotNumber}</Text>
              </View>
              
              <View className="w-px h-12 bg-axia-gray/30" />
              
              <View className="items-center flex-1">
                <Text className="text-axia-gray text-sm font-primary mb-1">Piso</Text>
                <Text className="text-white text-3xl font-primaryBold">{params.floorNumber}</Text>
              </View>
              
              <View className="w-px h-12 bg-axia-gray/30" />
              
              <View className="items-center flex-1">
                <Text className="text-axia-gray text-sm font-primary mb-1">Tipo</Text>
                <Ionicons 
                  name={spotType === 'ELECTRIC' ? 'flash' : spotType === 'HANDICAPPED' ? 'accessibility' : 'car'} 
                  size={24} 
                  color="#10B981" 
                />
              </View>
            </View>
          </View>

          {/* Payment Info */}
          <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
            <Text className="text-white text-xl font-primaryBold mb-4">
              Resumen de Pago
            </Text>
            
            <View className="flex-row justify-between items-center py-3 border-t border-axia-gray/20">
              <Text className="text-white text-lg font-primaryBold">Total Pagado</Text>
              <Text className="text-axia-green text-2xl font-primaryBold">
                COP {params.totalPrice ? parseInt(params.totalPrice).toLocaleString() : '0'}
              </Text>
            </View>
          </View>

          {/* Navigation Buttons */}
          <View className="space-y-4 mb-8">
            <Pressable
              onPress={handleNavigateToSpot}
              className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="navigate" size={24} color="#000000" />
                <Text className="text-axia-black font-primaryBold text-lg ml-2">
                  Navegar a mi puesto
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleViewMap}
              className="bg-axia-darkGray py-4 rounded-xl items-center active:scale-95"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="map-outline" size={24} color="#10B981" />
                <Text className="text-axia-green font-primaryBold text-lg ml-2">
                  Ver ubicación en mapa
                </Text>
              </View>
            </Pressable>

            <Pressable
              onPress={handleGoHome}
              className="bg-axia-gray/20 py-4 rounded-xl items-center active:scale-95"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="home-outline" size={24} color="#FFFFFF" />
                <Text className="text-white font-primaryBold text-lg ml-2">
                  Ir al inicio
                </Text>
              </View>
            </Pressable>
          </View>

          {/* Help Card */}
          <View className="bg-axia-darkGray/50 rounded-2xl p-4 mb-8">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#10B981" />
              <Text className="text-white font-primaryBold ml-2">
                Información importante
              </Text>
            </View>
            <Text className="text-axia-gray text-sm font-primary leading-5">
              • Llega 10 minutos antes de tu hora de inicio{'\n'}
              • Presenta este código en la entrada del parqueadero{'\n'}
              • Si tienes problemas, contacta al personal del parqueadero{'\n'}
              • Puedes cancelar hasta 2 horas antes sin cargo
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <SpotNavigatorModal
        visible={showNavigator}
        onClose={() => setShowNavigator(false)}
        floorNumber={parseInt(params.floorNumber || '1')}
        spotNumber={params.spotNumber || 'A1'}
        spotType={spotType}
        parkingName={params.parkingName || 'Parqueadero'}
      />

      {params.parkingLat && params.parkingLng && (
        <ParkingMapModal
          visible={showMap}
          onClose={() => setShowMap(false)}
          latitude={parseFloat(params.parkingLat)}
          longitude={parseFloat(params.parkingLng)}
          parkingName={params.parkingName || 'Parqueadero'}
          address={params.parkingAddress || ''}
        />
      )}
    </SafeAreaView>
  );
}
