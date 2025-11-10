import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useParkingDetail } from '../../../../hooks/useParkingDetail';
import { ParkingReviewsSection } from '../../../../components/molecules/ParkingReviewsSection';
import ParkingMapModal from '../../../../components/molecules/parking/ParkingMapModal';

const ParkingDetail = () => {
  const params = useLocalSearchParams<{ id: string; parkingData?: string }>();
  const [showMapModal, setShowMapModal] = useState(false);
  
  const {
    parking,
    loading,
    error,
    isFavorite,
    features,
    displayRating,
    reviewCount,
    isAvailable,
    handleGoBack,
    handleReservePress,
    handleFavoritePress,
    handleViewOnMap,
    handleShare,
  } = useParkingDetail({
    parkingId: params.id,
    parkingData: params.parkingData
  });

  const onGoBack = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleGoBack();
  };

  const onFavoritePress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleFavoritePress();
  };

  const onReservePress = async () => {
    if (!isAvailable) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    handleReservePress();
  };

  const onViewOnMap = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    handleViewOnMap();
  };

  const onShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleShare();
  const handleMapPress = () => {
    setShowMapModal(true);
  };

  // Estados de carga y error
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-white text-lg font-primary mt-4">
          Cargando información del estacionamiento...
        </Text>
      </SafeAreaView>
    );
  }

  if (error || !parking) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <View className="items-center px-6">
          <Ionicons name="warning-outline" size={48} color="#6B7280" />
          <Text className="text-white text-lg font-primaryBold mt-4 text-center">
            {error || 'No se pudo cargar la información del estacionamiento'}
          </Text>
          <Pressable
            onPress={onGoBack}
            className="bg-axia-green px-6 py-3 rounded-xl mt-6"
          >
            <Text className="text-axia-black font-primaryBold">Volver</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        
        {/* Imagen */}
        <View className="relative">
          <Image source={{ uri: parking.image }} className="w-full h-64" resizeMode="cover" />
          
          {/* Overlay */}
          <View className="absolute top-0 left-0 right-0 p-6 flex-row justify-between">
            <Pressable onPress={onGoBack} className="w-10 h-10 rounded-full bg-black/50 items-center justify-center active:scale-95">
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            
            <Pressable onPress={onFavoritePress} className="w-10 h-10 rounded-full bg-black/50 items-center justify-center active:scale-95">
              <Ionicons 
                name={isFavorite ? "heart" : "heart-outline"} 
                size={24} 
                color={isFavorite ? "#EF4444" : "#FFFFFF"} 
              />
            </Pressable>
          </View>

          {/* Estado */}
          <View className="absolute bottom-4 right-4">
            <View className={`px-3 py-1 rounded-full ${
              parking.status === 'OPEN' ? 'bg-axia-green/20' : 
              parking.status === 'CLOSED' ? 'bg-red-500/20' : 'bg-yellow-500/20'
            }`}>
              <Text className={`text-sm font-primaryBold ${
                parking.status === 'OPEN' ? 'text-axia-green' : 
                parking.status === 'CLOSED' ? 'text-red-500' : 'text-yellow-500'
              }`}>
                {parking.status === 'OPEN' ? 'Abierto' : 
                 parking.status === 'CLOSED' ? 'Cerrado' : 'En mantenimiento'}
              </Text>
            </View>
          </View>
        </View>

        {/* Info */}
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
                  {displayRating.toFixed(1)}
                </Text>
                <Text className="text-axia-gray text-sm font-primary ml-1">
                  ({reviewCount} reviews)
                </Text>
              </View>
              
              <View className="flex-row items-center">
                <Ionicons name="navigate" size={16} color="#10B981" />
                <Text className="text-axia-green text-sm font-primaryBold ml-1">
                  {parking.distance?.toFixed(1)} km
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
                parking.availableSpots > 10 ? 'bg-axia-green/20' : 
                parking.availableSpots > 0 ? 'bg-yellow-500/20' : 'bg-red-500/20'
              }`}>
                <View className={`w-2 h-2 rounded-full mr-2 ${
                  parking.availableSpots > 10 ? 'bg-axia-green' : 
                  parking.availableSpots > 0 ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <Text className={`text-sm font-primaryBold ${
                  parking.availableSpots > 10 ? 'text-axia-green' : 
                  parking.availableSpots > 0 ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {parking.availableSpots > 10 ? 'Disponible' : 
                   parking.availableSpots > 0 ? 'Pocos espacios' : 'Completo'}
                </Text>
              </View>
            </View>
            
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-axia-gray font-primary">
                Espacios disponibles
              </Text>
              <Text className="text-white font-primaryBold">
                {parking.availableSpots} / {parking.totalCapacity}
              </Text>
            </View>

            {/* Información de pisos */}
            {parking.floors > 0 && (
              <View className="mt-3 pt-3 border-t border-axia-gray/20">
                <Text className="text-axia-gray text-sm font-primary mb-2">
                  Distribución:
                </Text>
                <View className="flex-row justify-between items-center py-1">
                  <Text className="text-axia-gray text-xs font-primary">Total de pisos</Text>
                  <Text className="text-white text-xs font-primaryBold">
                    {parking.floors} pisos
                  </Text>
                </View>
                <View className="flex-row justify-between items-center py-1">
                  <Text className="text-axia-gray text-xs font-primary">Capacidad total</Text>
                  <Text className="text-white text-xs font-primaryBold">
                    {parking.totalCapacity} espacios
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Precios */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Tarifas
            </Text>
            
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="car-sport" size={20} color="#10B981" />
                  <Text className="text-white font-primary ml-3">Vehículo por hora</Text>
                </View>
                <Text className="text-axia-green font-primaryBold text-lg">
                  COP {parking.hourlyCarRate.toLocaleString()}
                </Text>
              </View>
              
              <View className="flex-row justify-between items-center">
                <View className="flex-row items-center">
                  <Ionicons name="bicycle" size={20} color="#10B981" />
                  <Text className="text-white font-primary ml-3">Motocicleta por hora</Text>
                </View>
                <Text className="text-axia-green font-primaryBold text-lg">
                  COP {parking.hourlyMotorcycleRate.toLocaleString()}
                </Text>
              </View>

              {parking.dailyRate > 0 && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="calendar" size={20} color="#10B981" />
                    <Text className="text-white font-primary ml-3">Tarifa diaria</Text>
                  </View>
                  <Text className="text-axia-green font-primaryBold text-lg">
                    COP {parking.dailyRate.toLocaleString()}
                  </Text>
                </View>
              )}

              {parking.monthlyRate > 0 && (
                <View className="flex-row justify-between items-center">
                  <View className="flex-row items-center">
                    <Ionicons name="business" size={20} color="#10B981" />
                    <Text className="text-white font-primary ml-3">Tarifa mensual</Text>
                  </View>
                  <Text className="text-axia-green font-primaryBold text-lg">
                    COP {parking.monthlyRate.toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Características */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Características
            </Text>
            
            <View className="flex-row flex-wrap">
              {features.map((feature, index) => (
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
            <View className="flex-row items-start">
              <Ionicons name="time-outline" size={20} color="#10B981" />
              <Text className="text-white font-primary ml-3 flex-1">
                {parking.schedule}
              </Text>
            </View>
          </View>

          {/* Descripción */}
          <View className="bg-axia-darkGray rounded-2xl p-5 mb-6">
            <Text className="text-white text-lg font-primaryBold mb-3">
              Descripción
            </Text>
            <Text className="text-axia-gray font-primary leading-6">
              {parking.description}
            </Text>
          </View>

          {/* Reviews */}
          <ParkingReviewsSection parkingId={parking.id} parkingName={parking.name} />

          {/* Botones */}
          <View className="space-y-4 pb-8 mt-6">
            <Pressable
              onPress={onReservePress}
              disabled={!isAvailable}
              className={`py-4 rounded-xl items-center shadow-lg active:scale-95 ${
                !isAvailable ? 'bg-axia-gray/50' : 'bg-axia-green shadow-axia-green/25'
              }`}
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="calendar" size={20} color={!isAvailable ? "#6B7280" : "#000"} />
                <Text className={`font-primaryBold text-lg ml-2 ${
                  !isAvailable ? 'text-axia-gray' : 'text-axia-black'
                }`}>
                  {!isAvailable
                    ? (parking.availableSpots === 0
                      ? 'Sin espacios disponibles'
                      : 'Estacionamiento cerrado')
                    : 'Reservar ahora'}
                </Text>
              </View>
            </Pressable>
            
            <View className="flex-row space-x-4">
              <Pressable
                onPress={handleMapPress}
                className="flex-1 bg-axia-darkGray py-4 rounded-xl items-center active:scale-95 mt-4 mr-4"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="map-outline" size={20} color="#10B981" />
                  <Text className="text-axia-green font-primaryBold text-lg ml-2">
                    Ver en mapa
                  </Text>
                </View>
              </Pressable>
              
              <Pressable
                onPress={onShare}
                className="flex-1 bg-axia-darkGray py-4 rounded-xl items-center active:scale-95 mt-4 ml-4"
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

      {/* Modal de mapa */}
      {parking && (
        <ParkingMapModal
          visible={showMapModal}
          onClose={() => setShowMapModal(false)}
          latitude={parking.latitude}
          longitude={parking.longitude}
          parkingName={parking.name}
          address={parking.address}
        />
      )}
    </SafeAreaView>
  );
};

export default ParkingDetail;
