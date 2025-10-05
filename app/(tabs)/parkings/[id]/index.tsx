import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../../../components/atoms/Button';

interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  type: 'car' | 'motorcycle' | 'disabled';
  floor: number;
}

interface Floor {
  id: string;
  number: number;
  name: string;
  totalSpots: number;
  availableSpots: number;
  spots: ParkingSpot[];
}

interface Parking {
  id: string;
  name: string;
  address: string;
  hourlyCarRate: number;
  hourlyMotorcycleRate: number;
  rating: number;
  totalSpots: number;
  availableSpots: number;
  distance: number;
  image: string;
  features: string[];
  open24h: boolean;
  security: boolean;
  covered: boolean;
  description: string;
  operatingHours: string;
  floors: Floor[];
}

const ParkingDetail = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [isFavorite, setIsFavorite] = useState(false);

  // Obtener los datos del estacionamiento desde los parámetros
  const parkingData = params.data ? JSON.parse(params.data as string) : null;

  if (!parkingData) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <Text className="text-white">No se pudo cargar la información del estacionamiento</Text>
      </SafeAreaView>
    );
  }

  const parking: Parking = {
    id: parkingData.id,
    name: parkingData.name,
    address: parkingData.address,
    hourlyCarRate: parkingData.hourlyCarRate,
    hourlyMotorcycleRate: parkingData.hourlyMotorcycleRate,
    rating: parkingData.rating,
    totalSpots: parkingData.totalSpots,
    availableSpots: parkingData.availableSpots,
    distance: parkingData.distance,
    image: parkingData.image || 'https://dimobaservicios.com/wp-content/uploads/2023/11/que-hace-un-auxiliar-parking.png',
    features: parkingData.features || [],
    open24h: parkingData.open24h || true,
    security: parkingData.security || true,
    covered: parkingData.covered || false,
    description: parkingData.description || 'Estacionamiento seguro y moderno ubicado en una zona estratégica de la ciudad.',
    operatingHours: parkingData.operatingHours || 'Abierto las 24 horas',
    floors: parkingData.floors || [] // Asegurar que floors esté incluido
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleReservePress = () => {
    // Enviar todos los datos del estacionamiento a la pantalla de reserva
    router.push({
      pathname: `/parkings/${parking.id}/reserve`,
      params: { data: JSON.stringify(parking) }
    });
  };

  const handleFavoritePress = () => {
    setIsFavorite(!isFavorite);
    Alert.alert(
      isFavorite ? 'Removido de favoritos' : 'Agregado a favoritos',
      isFavorite 
        ? 'El estacionamiento ha sido removido de tus favoritos'
        : 'El estacionamiento ha sido agregado a tus favoritos'
    );
  };

  const handleViewOnMap = () => {
    console.log('Ver en mapa');
  };

  const handleShare = () => {
    console.log('Compartir estacionamiento');
  };

  // Calcular total de espacios disponibles sumando todos los pisos
  const totalAvailableSpots = parking.floors?.reduce((total, floor) => total + floor.availableSpots, 0) || parking.availableSpots;

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Imagen del estacionamiento */}
        <View className="relative">
          <Image
            source={{ uri: parking.image }}
            className="w-full h-64"
            resizeMode="cover"
          />
          
          {/* Overlay con botones */}
          <View className="absolute top-0 left-0 right-0 p-6 flex-row justify-between">
            <Pressable 
              onPress={handleGoBack}
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center active:scale-95"
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            
            <Pressable 
              onPress={handleFavoritePress}
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center active:scale-95"
            >
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#FFFFFF"} 
              />
            </Pressable>
          </View>
        </View>

        <View className="flex-1 px-6 py-6">
          
          {/* Información principal */}
          <View className="mb-6">
            <Text className="text-white text-3xl font-primaryBold mb-2">
              {parking.name}
            </Text>
            
            <View className="flex-row items-center mb-3">
              <Ionicons name="location-outline" size={16} color="#6B7280" />
              <Text className="text-axia-gray text-base font-primary ml-2 flex-1">
                {parking.address}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="star" size={20} color="#F59E0B" />
                <Text className="text-white font-primaryBold text-lg ml-1">
                  {parking.rating}
                </Text>
                <Text className="text-axia-gray text-sm font-primary ml-1">
                  ({Math.floor(parking.rating * 25)} reviews)
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="navigate" size={16} color="#10B981" />
                <Text className="text-axia-green text-sm font-primaryBold ml-1">
                  {parking.distance} km
                </Text>
              </View>
            </View>
          </View>

          {/* Disponibilidad */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-primaryBold">
                Disponibilidad
              </Text>
              <View className={`flex-row items-center px-3 py-1 rounded-full ${
                totalAvailableSpots > 10 ? 'bg-axia-green/20' : 
                totalAvailableSpots > 0 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  totalAvailableSpots > 10 ? 'bg-axia-green' : 
                  totalAvailableSpots > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <Text className={`text-sm font-primaryBold ${
                  totalAvailableSpots > 10 ? 'text-axia-green' : 
                  totalAvailableSpots > 0 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {totalAvailableSpots > 10 ? 'Disponible' : 
                   totalAvailableSpots > 0 ? 'Pocos espacios' : 'Completo'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-axia-gray font-primary">
                Espacios disponibles
              </Text>
              <Text className="text-white font-primaryBold">
                {totalAvailableSpots} / {parking.totalSpots}
              </Text>
            </View>

            {/* Información de pisos */}
            {parking.floors && parking.floors.length > 0 && (
              <View className="mt-3 pt-3 border-t border-axia-gray/20">
                <Text className="text-axia-gray text-sm font-primary mb-2">
                  Distribución por pisos:
                </Text>
                {parking.floors.map(floor => (
                  <View key={floor.id} className="flex-row justify-between items-center py-1">
                    <Text className="text-axia-gray text-xs font-primary">{floor.name}</Text>
                    <Text className="text-white text-xs font-primaryBold">
                      {floor.availableSpots} disp.
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Precios */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Tarifas por hora
            </Text>
            
            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="car-sport" size={20} color="#10B981" />
                  <Text className="text-white font-primary ml-3">Vehículo</Text>
                </View>
                <Text className="text-axia-green font-primaryBold text-lg">
                  COP {parking.hourlyCarRate.toLocaleString()}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="bicycle" size={20} color="#10B981" />
                  <Text className="text-white font-primary ml-3">Motocicleta</Text>
                </View>
                <Text className="text-axia-green font-primaryBold text-lg">
                  COP {parking.hourlyMotorcycleRate.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>

          {/* Características */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Características
            </Text>
            
            <View className="flex-row flex-wrap">
              {parking.features.map((feature, index) => (
                <View key={index} className="flex-row items-center mr-4 mb-3">
                  <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                  <Text className="text-white font-primary ml-2">
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Horario */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-3">
              Horario de atención
            </Text>
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={20} color="#10B981" />
              <Text className="text-white font-primary ml-3">
                {parking.operatingHours}
              </Text>
            </View>
          </View>

          {/* Descripción */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-8">
            <Text className="text-white text-lg font-primaryBold mb-3">
              Descripción
            </Text>
            <Text className="text-axia-gray font-primary leading-6">
              {parking.description}
            </Text>
          </View>

          {/* Botones de acción */}
          <View className="space-y-4 pb-8">
            <Pressable
              onPress={handleReservePress}
              className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95" 
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="calendar" size={20} color="#000000" />
                <Text className="text-axia-black font-primaryBold text-lg ml-2">
                  Reservar ahora
                </Text>
              </View>
            </Pressable>
            
            <View className="flex-row space-x-4">
              <Pressable
                onPress={handleViewOnMap}
                className="flex-1 bg-axia-darkGray py-4 rounded-xl items-center active:scale-95 mr-4 mt-8"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="map-outline" size={20} color="#10B981" />
                  <Text className="text-axia-green font-primaryBold text-lg ml-2">
                    Ver en mapa
                  </Text>
                </View>
              </Pressable>
              
              <Pressable
                onPress={handleShare}
                className="flex-1 bg-axia-darkGray py-4 rounded-xl items-center active:scale-95 ml-4 mt-8"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="share-social-outline" size={20} color="#10B981" />
                  <Text className="text-axia-green font-primaryBold text-lg ml-2">
                    Compartir
                  </Text>
                </View>
              </Pressable>
            </View>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ParkingDetail;