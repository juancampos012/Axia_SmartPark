import React from 'react';
import { ScrollView, View, Text, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useParkingManagement } from '../../../hooks/useParkingManagement';
import { useAuth } from '../../../context/AuthContext';
import { useParkingsScreen } from '../../../hooks/useParkingsScreen';
import MapSection from '../../../components/molecules/parking/MapSection';
import ParkingsFilterSection from '../../../components/organisms/parking/ParkingsFilterSection';
import ParkingsList from '../../../components/organisms/parking/ParkingsList';
import { useParkingsScreen } from '../../../hooks/useParkingsScreen';

const statusConfig = {
  OPEN: { label: 'Abierto', color: 'bg-green-500', icon: 'checkmark-circle' },
  CLOSED: { label: 'Cerrado', color: 'bg-red-500', icon: 'close-circle' },
  FULL: { label: 'Lleno', color: 'bg-orange-500', icon: 'warning' },
  MAINTENANCE: { label: 'Mantenimiento', color: 'bg-yellow-500', icon: 'construct' },
};

export default function ParkingsRoute() {
  const { isAdminOrOperator } = useAuth();

  // Admin/operator view data
  const {
    parking,
    loading,
    refreshing,
    handleRefresh,
    handleChangeStatus,
  } = useParkingManagement();

  // Public/user view data
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

  const router = useRouter();

  // Navegación SOLO controlada por evento, nunca automática en un effect
  const handleEditPress = () => {
    router.push('/(tabs)/parkings/edit');
  };

  // If the current user is NOT admin/operator, render the public Parkings screen
  if (!isAdminOrOperator) {
    // Use the user-facing parkings view (search / list)
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
            <Pressable onPress={handleRetry} className="bg-axia-green px-6 py-3 rounded-xl mt-6">
              <Text className="text-axia-black font-primaryBold">Reintentar</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      );
    }

    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={["top","left","right"]}>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="px-6 pt-8 pb-4">
              <View className="mb-3">
                <Text className="text-white text-3xl font-primaryBold mb-2">Encuentra tu Parqueadero</Text>
                <Text className="text-axia-gray text-sm font-primary">{statistics.totalParkings} parqueaderos disponibles en tu zona</Text>
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
              <View className="px-6 mb-3">
                <View className="flex-row items-center justify-between">
                  <Text className="text-white text-xl font-primaryBold">Ubicación en Mapa</Text>
                  <View className="flex-row items-center bg-axia-green/20 px-3 py-1 rounded-full">
                    <Ionicons name="navigate" size={14} color="#10B981" />
                    <Text className="text-axia-green text-sm font-primaryBold ml-1">En tiempo real</Text>
                  </View>
                </View>
              </View>
              <MapSection parkingCount={parkingData.length} className="mx-4" />
            </View>
            <View className="mb-6">
              <View className="px-6 mb-5">
                <Text className="text-white text-xl font-primaryBold mb-2">Filtrar por</Text>
              </View>
              <ParkingsFilterSection filters={filters} selectedFilter={selectedFilter} onFilterSelect={handleFilterSelect} />
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
              <ParkingsList parkings={parkingData} onParkingPress={handleParkingPress} onFavoritePress={handleFavoritePress} />
            </View>
            <View className="px-6 mb-8">
              <Pressable onPress={handleViewMore} className="bg-axia-green py-4 rounded-xl items-center shadow-lg shadow-axia-green/25 active:scale-95">
                <View className="flex-row items-center justify-center">
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text className="text-white font-primaryBold text-lg ml-2">Explorar más parqueaderos</Text>
                </View>
              </Pressable>
            </View>
            {parkingData.length === 0 && (
              <View className="px-6 mb-8">
                <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
                  <Ionicons name="search-outline" size={48} color="#6B7280" />
                  <Text className="text-white text-lg font-primaryBold mt-4 mb-2 text-center">No se encontraron parqueaderos</Text>
                  <Text className="text-axia-gray text-sm font-primary text-center">Intenta ajustar los filtros o buscar en otra zona</Text>
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  // ---- Admin/Operator view continues below ----

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
      <KeyboardAvoidingView 
        className="flex-1" 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="px-6 pt-8 pb-4">
            <View className="mb-3">
              <Text className="text-white text-3xl font-primaryBold mb-2">
                Encuentra tu Parqueadero
              </Text>
              <Text className="text-axia-gray text-xs font-primary">
                Espacios disponibles
              </Text>
            </View>
            <View className="flex-1 bg-axia-darkGray rounded-xl p-4">
              <Ionicons name="layers-outline" size={24} color="#10B981" />
              <Text className="text-white text-2xl font-primaryBold mt-2">
                {parking.floors}
              </Text>
              <Text className="text-axia-gray text-xs font-primary">
                Pisos
              </Text>
            </View>
          </View>

          {/* Ocupación */}
          <View className="bg-axia-darkGray rounded-xl p-4 mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white font-primaryBold">Ocupación</Text>
              <Text className="text-axia-green font-primaryBold">
                {occupancy.toFixed(0)}%
              </Text>
            </View>
            <View className="bg-axia-gray rounded-full h-2 overflow-hidden">
              <View
                className="bg-axia-green h-full"
                style={{ width: `${occupancy}%` }}
              />
            </View>
            <Text className="text-axia-gray text-xs font-primary mt-2">
              {parking.totalCapacity - parking.actualCapacity} de {parking.totalCapacity} espacios ocupados
            </Text>
          </View>

          {/* Información */}
          <View className="bg-axia-darkGray rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Información General
            </Text>
            <View className="space-y-3">
              <InfoRow icon="location" label="Dirección" value={parking.address} />
              <InfoRow icon="time" label="Horario" value={parking.schedule} />
              {parking.description && (
                <InfoRow icon="information-circle" label="Descripción" value={parking.description} />
              )}
            </View>
          </View>

          {/* Tarifas */}
          <View className="bg-axia-darkGray rounded-2xl p-4 mb-4">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Tarifas
            </Text>
            <View className="space-y-3">
              <TariffRow
                icon="car-sport"
                label="Tarifa por hora - Carro"
                value={`$${parking.hourlyCarRate.toLocaleString()}`}
              />
              <TariffRow
                icon="bicycle"
                label="Tarifa por hora - Moto"
                value={`$${parking.hourlyMotorcycleRate.toLocaleString()}`}
              />
              {parking.dailyRate && (
                <TariffRow
                  icon="calendar"
                  label="Tarifa diaria"
                  value={`$${parking.dailyRate.toLocaleString()}`}
                />
              )}
              {parking.monthlyRate && (
                <TariffRow
                  icon="calendar-outline"
                  label="Tarifa mensual"
                  value={`$${parking.monthlyRate.toLocaleString()}`}
                />
              )}
            </View>
          </View>

          {/* Cambio rápido de estado */}
          <View className="bg-axia-darkGray rounded-2xl p-4">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Cambio Rápido de Estado
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {Object.entries(statusConfig).map(([status, config]) => (
                <Pressable
                  key={status}
                  onPress={() => handleChangeStatus(status as any)}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="flex-row items-start">
    <View className="w-8 h-8 bg-axia-green/20 rounded-lg items-center justify-center mr-3">
      <Ionicons name={icon as any} size={16} color="#10B981" />
    </View>
    <View className="flex-1">
      <Text className="text-axia-gray text-xs font-primary mb-1">{label}</Text>
      <Text className="text-white font-primary">{value}</Text>
    </View>
  </View>
);

const TariffRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View className="flex-row items-center justify-between">
    <View className="flex-row items-center flex-1">
      <View className="w-8 h-8 bg-axia-green/20 rounded-lg items-center justify-center mr-3">
        <Ionicons name={icon as any} size={16} color="#10B981" />
      </View>
      <Text className="text-white font-primary">{label}</Text>
    </View>
    <Text className="text-axia-green font-primaryBold">{value}</Text>
  </View>
);
