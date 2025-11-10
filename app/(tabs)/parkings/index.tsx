import React from 'react';
import { ScrollView, View, Text, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useParkingManagement } from '../../../hooks/useParkingManagement';
import { useAuth } from '../../../context/AuthContext';
import { useParkingsScreen } from '../../../hooks/useParkingsScreen';
import MapSection from '../../../components/molecules/parking/MapSection';
import ParkingsFilterSection from '../../../components/organisms/parking/ParkingsFilterSection';
import ParkingsList from '../../../components/organisms/parking/ParkingsList';

const statusConfig = {
  OPEN: { label: 'Abierto', color: 'bg-green-500', icon: 'checkmark-circle' },
  CLOSED: { label: 'Cerrado', color: 'bg-red-500', icon: 'close-circle' },
  FULL: { label: 'Lleno', color: 'bg-orange-500', icon: 'warning' },
  MAINTENANCE: { label: 'Mantenimiento', color: 'bg-yellow-500', icon: 'construct' },
};

export default function ParkingsRoute() {
  const { isAdminOrOperator } = useAuth();

  const { parking, loading, handleChangeStatus } = useParkingManagement();

  const {
    selectedFilter,
    parkingData,
    loading: userLoading,
    error,
    statistics,
    handleFavoritePress,
    handleParkingPress,
    handleFilterSelect,
    handleViewMore,
    handleRetry,
    getOrderText,
  } = useParkingsScreen();

  const handlePressWithHaptics = async (action: () => void) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    action();
  };

  // ---- Vista pública ----
  if (!isAdminOrOperator) {
    const filters = [
      { id: 'all', label: 'Todos', icon: 'grid-outline' },
      { id: 'nearby', label: 'Cercanos', icon: 'location-outline' },
      { id: 'price', label: 'Precio', icon: 'cash-outline' },
      { id: 'rating', label: 'Por calificación', icon: 'star-outline' },
      { id: 'available', label: 'Disponibles', icon: 'checkmark-circle-outline' }
    ];

    if (userLoading) {
      return (
        <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-white text-lg font-primary mt-4">Cargando parqueaderos...</Text>
        </SafeAreaView>
      );
    }

    if (error) {
      return (
        <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
          <View className="items-center px-6">
            <Ionicons name="warning-outline" size={48} color="#EF4444" />
            <Text className="text-white text-lg font-primaryBold mt-4 text-center">Error al cargar parqueaderos</Text>
            <Text className="text-axia-gray text-sm font-primary mt-2 text-center">{error}</Text>
            <Pressable
              onPress={() => handlePressWithHaptics(handleRetry)}
              className="bg-axia-green px-6 py-3 rounded-xl mt-6"
            >
              <Text className="text-axia-black font-primaryBold">Reintentar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={["top", "left", "right"]}>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-6 pt-8 pb-4">
              <View className="mb-3">
                <Text className="text-white text-3xl font-primaryBold mb-2">Encuentra tu Parqueadero</Text>
                <Text className="text-axia-gray text-sm font-primary">
                  {statistics.totalParkings} parqueaderos disponibles en tu zona
                </Text>
              </View>
            </View>

            <View className="px-6 mb-6">
              <View className="flex-row justify-between bg-axia-darkGray rounded-2xl p-4 shadow-lg shadow-black/50">
                <View className="items-center flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="car-sport" size={16} color="#10B981" />
                    <Text className="text-white font-primaryBold text-lg ml-2">{statistics.totalAvailableSpots}</Text>
                  </View>
                  <Text className="text-axia-gray text-xs font-primary text-center">Espacios libres</Text>
                </View>
                <View className="w-px bg-axia-border/30" />
                <View className="items-center flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="time" size={16} color="#F59E0B" />
                    <Text className="text-white font-primaryBold text-lg ml-2">{statistics.available24h}</Text>
                  </View>
                  <Text className="text-axia-gray text-xs font-primary text-center">24/7</Text>
                </View>
                <View className="w-px bg-axia-border/30" />
                <View className="items-center flex-1">
                  <View className="flex-row items-center mb-1">
                    <Ionicons name="shield-checkmark" size={16} color="#3B82F6" />
                    <Text className="text-white font-primaryBold text-lg ml-2">{statistics.openParkings}</Text>
                  </View>
                  <Text className="text-axia-gray text-xs font-primary text-center">Abiertos</Text>
                </View>
              </View>
            </View>

            <View className="mb-6">
              <View className="px-6 mb-3 flex-row items-center justify-between">
                <Text className="text-white text-xl font-primaryBold">Ubicación en Mapa</Text>
                <View className="flex-row items-center bg-axia-green/20 px-3 py-1 rounded-full">
                  <Ionicons name="navigate" size={14} color="#10B981" />
                  <Text className="text-axia-green text-sm font-primaryBold ml-1">En tiempo real</Text>
                </View>
              </View>
              <MapSection parkingCount={parkingData.length} className="mx-4" />
            </View>

            <View className="mb-6">
              <View className="px-6 mb-5">
                <Text className="text-white text-xl font-primaryBold mb-2">Filtrar por</Text>
              </View>
              <ParkingsFilterSection
                filters={filters}
                selectedFilter={selectedFilter}
                onFilterSelect={(filter) => handlePressWithHaptics(() => handleFilterSelect(filter))}
              />
            </View>

            <View className="mb-8">
              <View className="px-6 mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-white text-xl font-primaryBold">Parqueaderos Disponibles</Text>
                  <View className="flex-row items-center">
                    <View className="w-2 h-2 bg-axia-green rounded-full mr-2" />
                    <Text className="text-axia-gray font-primary text-sm">{getOrderText()}</Text>
                  </View>
                </View>
                <Text className="text-axia-gray text-sm font-primary">{parkingData.length} parqueaderos encontrados</Text>
              </View>

              <ParkingsList
                parkings={parkingData}
                onParkingPress={(p) => handlePressWithHaptics(() => handleParkingPress(p))}
                onFavoritePress={(p) => handlePressWithHaptics(() => handleFavoritePress(p))}
              />
            </View>

            <View className="px-6 mb-8">
              <Pressable
                onPress={() => handlePressWithHaptics(handleViewMore)}
                className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95"
              >
                <View className="flex-row items-center justify-center">
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text className="text-white font-primaryBold text-lg ml-2">Explorar más parqueaderos</Text>
                </View>
              </Pressable>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ---- Vista Admin / Operador ----
  if (loading && !parking) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <ActivityIndicator size="large" color="#10B981" />
        <Text className="text-axia-gray text-sm font-primary mt-4">
          Cargando información...
        </Text>
      </SafeAreaView>
    );
  }

  if (!parking) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center px-6">
        <Ionicons name="business-outline" size={64} color="#6B7280" />
        <Text className="text-white text-lg font-primaryBold mt-4 text-center">
          No tienes parqueadero asignado
        </Text>
        <Text className="text-axia-gray text-sm font-primary mt-2 text-center">
          Contacta al administrador para asignarte un parqueadero
        </Text>
      </SafeAreaView>
    );
  }

  const currentStatus = statusConfig[parking.status];
  const occupancy = ((parking.totalCapacity - parking.actualCapacity) / parking.totalCapacity) * 100;

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-8 pb-4">
            <Text className="text-white text-3xl font-primaryBold mb-2">Encuentra tu Parqueadero</Text>
          </View>

          <View className="bg-axia-darkGray rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Cambio Rápido de Estado
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.entries(statusConfig).map(([status, config]) => (
                <Pressable
                  key={status}
                  onPress={() => handlePressWithHaptics(() => handleChangeStatus(status as any))}
                  disabled={parking.status === status}
                  className={`flex-1 min-w-[45%] p-3 rounded-xl flex-row items-center justify-center ${
                    parking.status === status
                      ? 'bg-axia-green/20 border-2 border-axia-green'
                      : 'bg-axia-gray/20 border-2 border-transparent'
                  } ${parking.status === status ? '' : 'active:scale-95'}`}
                >
                  <Ionicons
                    name={config.icon as any}
                    size={18}
                    color={parking.status === status ? '#10B981' : '#6B7280'}
                  />
                  <Text
                    className={`font-primaryBold ml-2 ${
                      parking.status === status ? 'text-axia-green' : 'text-axia-gray'
                    }`}
                  >
                    {config.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}