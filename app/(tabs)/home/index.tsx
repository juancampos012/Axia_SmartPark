import React from 'react';
import { View, Text, Pressable, ScrollView, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHomeDashboard } from '../../../hooks/useHomeDashboard';
import { useAuth } from '../../../context/AuthContext';
import StatCard from '../../../components/atoms/StatCard';
import NearbyParkingCard from '../../../components/molecules/NearbyParkingCard';

const Home = () => {
  const { user } = useAuth();
  const {
    stats,
    nearbyParkings,
    activeReservation,
    loading,
    refreshing,
    hasLocationPermission,
    handleRefresh,
    handleSearchPress,
    handleParkingPress,
    handleReservationPress,
    handleNewReservation,
    handleVehiclesPress,
    handlePaymentMethodsPress,
    handleReviewsPress,
    handleRequestLocation,
    getGreeting,
  } = useHomeDashboard();

  // Loading inicial
  if (loading && !stats) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006B54" />
          <Text className="text-white font-primary mt-4">Cargando dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#006B54" />
        }
      >
        {/* Header con saludo */}
        <View className="px-6 pt-6 pb-4">
          <View className="flex-row items-center mb-1">
            <Text className="text-3xl font-primaryBold text-white mr-2">
              {getGreeting()}, {user?.name?.split(' ')[0] || 'Usuario'} 👋
            </Text>
          </View>
          <Text className="text-axia-gray font-primary">
            Encuentra tu parqueadero ideal
          </Text>
        </View>

        {/* Buscador rápido */}
        <View className="px-6 mb-6">
          <Pressable
            onPress={handleSearchPress}
            className="bg-axia-darkGray rounded-xl p-4 flex-row items-center active:scale-95"
          >
            <Ionicons name="search-outline" size={20} color="#6B7280" />
            <Text className="text-axia-gray font-primary ml-3 flex-1">
              Buscar parqueadero cerca de ti...
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        </View>

        {/* Reserva Activa */}
        {activeReservation ? (
          <View className="px-6 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="location" size={20} color="#006B54" />
              <Text className="text-white text-xl font-primaryBold ml-2">
                Tu Reserva Actual
              </Text>
            </View>
            <Pressable
              onPress={handleReservationPress}
              className="bg-axia-darkGray rounded-xl p-5 active:scale-95"
            >
              <View className="flex-row items-start mb-3">
                <View 
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                  style={{ backgroundColor: '#006B54' + '20' }}
                >
                  <Ionicons name="car-sport" size={24} color="#006B54" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-primaryBold mb-1">
                    {activeReservation.parkingSpot?.parking?.name || 'Parqueadero'}
                  </Text>
                  <View className="flex-row items-center">
                    <Ionicons 
                      name={activeReservation.status === 'PENDING' ? 'time' : 'checkmark-circle'} 
                      size={14} 
                      color={activeReservation.status === 'PENDING' ? '#F59E0B' : '#006B54'} 
                    />
                    <Text className="text-axia-gray text-sm font-primary ml-1">
                      {activeReservation.status === 'PENDING' ? 'Pendiente de confirmación' : 'Confirmada'}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-axia-gray text-sm font-primary">
                  Toca para ver detalles
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </Pressable>
          </View>
        ) : (
          <View className="px-6 mb-6">
            <View className="bg-axia-darkGray rounded-xl p-6 items-center">
              <View className="w-16 h-16 rounded-full bg-axia-black/50 items-center justify-center mb-3">
                <Ionicons name="calendar-outline" size={32} color="#6B7280" />
              </View>
              <Text className="text-white text-base font-primaryBold mb-2">
                No tienes reservas activas
              </Text>
              <Text className="text-axia-gray text-sm font-primary text-center mb-4">
                Encuentra y reserva tu próximo estacionamiento
              </Text>
              <Pressable
                onPress={handleNewReservation}
                className="bg-axia-green px-6 py-3 rounded-xl active:scale-95"
              >
                <Text className="text-axia-black font-primaryBold">
                  Buscar Parqueadero
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* Estadísticas */}
        {stats && (
          <View className="px-6 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="bar-chart" size={20} color="#3B82F6" />
              <Text className="text-white text-xl font-primaryBold ml-2">
                Tu Actividad
              </Text>
            </View>
            <View className="flex-row gap-3 mb-3">
              <StatCard
                icon="flash"
                value={stats.reservations.active}
                label="Activas"
                color="#006B54"
              />
              <StatCard
                icon="calendar"
                value={stats.reservations.total}
                label="Total"
                color="#3B82F6"
              />
              <StatCard
                icon="time"
                value={`${Math.round(stats.usage.totalHoursParked)}h`}
                label="Horas"
                color="#8B5CF6"
              />
            </View>
            <View className="flex-row gap-3">
              <StatCard
                icon="cash"
                value={`$${Math.round(stats.payments.totalSpent)}`}
                label="Gastado"
                color="#F59E0B"
              />
              <StatCard
                icon="car"
                value={stats.vehicles.count}
                label="Vehículos"
                color="#EF4444"
              />
              <StatCard
                icon="checkmark-circle"
                value={stats.reservations.completed}
                label="Completadas"
                color="#6B7280"
              />
            </View>
          </View>
        )}

        {/* Parqueaderos Cercanos */}
        {nearbyParkings.length > 0 ? (
          <View className="mb-6">
            <View className="px-6 mb-3 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="navigate" size={20} color="#006B54" />
                <Text className="text-white text-xl font-primaryBold ml-2">
                  Cerca de Ti
                </Text>
              </View>
              <Pressable onPress={handleSearchPress}>
                <Text className="text-axia-green text-sm font-primaryBold">
                  Ver todos
                </Text>
              </Pressable>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {nearbyParkings.map((parking) => (
                <NearbyParkingCard
                  key={parking.id}
                  parking={parking}
                  onPress={() => handleParkingPress(parking.id)}
                />
              ))}
            </ScrollView>
          </View>
        ) : !hasLocationPermission ? (
          <View className="px-6 mb-6">
            <View className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
              <View className="flex-row items-start">
                <Ionicons name="location-outline" size={24} color="#F59E0B" />
                <View className="flex-1 ml-3">
                  <Text className="text-amber-500 font-primaryBold mb-1">
                    Activa tu ubicación
                  </Text>
                  <Text className="text-amber-500/80 text-sm font-primary mb-3">
                    Para mostrarte parqueaderos cercanos necesitamos acceso a tu ubicación
                  </Text>
                  <Pressable
                    onPress={handleRequestLocation}
                    className="bg-amber-500 px-4 py-2 rounded-lg self-start active:scale-95"
                  >
                    <Text className="text-white font-primaryBold text-sm">
                      Activar Ubicación
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        ) : null}

        {/* Accesos Rápidos */}
        <View className="px-6 mb-8">
          <View className="flex-row items-center mb-3">
            <Ionicons name="flash" size={20} color="#F59E0B" />
            <Text className="text-white text-xl font-primaryBold ml-2">
              Accesos Rápidos
            </Text>
          </View>
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleVehiclesPress}
              className="bg-axia-darkGray rounded-xl p-4 flex-1 items-center active:scale-95"
            >
              <View className="w-12 h-12 rounded-full bg-axia-green/20 items-center justify-center mb-2">
                <Ionicons name="car-sport" size={24} color="#006B54" />
              </View>
              <Text className="text-white text-sm font-primaryBold text-center">
                Mis Autos
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handlePaymentMethodsPress}
              className="bg-axia-darkGray rounded-xl p-4 flex-1 items-center active:scale-95"
            >
              <View className="w-12 h-12 rounded-full bg-blue-500/20 items-center justify-center mb-2">
                <Ionicons name="card" size={24} color="#3B82F6" />
              </View>
              <Text className="text-white text-sm font-primaryBold text-center">
                Métodos de Pago
              </Text>
            </Pressable>
            
            <Pressable
              onPress={handleReviewsPress}
              className="bg-axia-darkGray rounded-xl p-4 flex-1 items-center active:scale-95"
            >
              <View className="w-12 h-12 rounded-full bg-amber-500/20 items-center justify-center mb-2">
                <Ionicons name="star" size={24} color="#F59E0B" />
              </View>
              <Text className="text-white text-sm font-primaryBold text-center">
                Mis Reviews
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Tip del día */}
        <View className="px-6 mb-8">
          <View className="bg-gradient-to-r from-axia-green/10 to-blue-500/10 border border-axia-green/30 rounded-xl p-4">
            <View className="flex-row items-start">
              <View className="w-10 h-10 rounded-full bg-axia-green/20 items-center justify-center mr-3">
                <Ionicons name="bulb" size={20} color="#006B54" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Ionicons name="bulb-outline" size={16} color="#006B54" />
                  <Text className="text-axia-green font-primaryBold ml-1">
                    Tip del Día
                  </Text>
                </View>
                <Text className="text-white/80 text-sm font-primary">
                  Reserva con 2 horas de anticipación y ahorra tiempo buscando parqueadero
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;