import React from 'react';
import { View, Text, Pressable, FlatList, ActivityIndicator, ListRenderItem } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../context/AuthContext';
import { useReservationsScreen } from '../../../hooks/useReservationsScreen';
import { useParkingReservations } from '../../../hooks/useParkingReservations';
import { ReservationWithRelations } from '../../../interfaces/reservation';

// Helper para obtener texto del estado
const getStatusText = (status: string) => {
  switch (status) {
    case 'PENDING': return 'Pendiente';
    case 'CONFIRMED': return 'Confirmada';
    case 'COMPLETED': return 'Finalizada';
    case 'CANCELED': return 'Cancelada';
    default: return status;
  }
};

// Helper para obtener color del estado
const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return '#F59E0B';
    case 'CONFIRMED': return '#10B981';
    case 'COMPLETED': return '#6B7280';
    case 'CANCELED': return '#EF4444';
    default: return '#6B7280';
  }
};

// Helper para obtener icono del estado
const getStatusIcon = (status: string) => {
  switch (status) {
    case 'PENDING': return 'hourglass-outline';
    case 'CONFIRMED': return 'checkmark-circle';
    case 'COMPLETED': return 'checkmark-done-circle';
    case 'CANCELED': return 'close-circle';
    default: return 'help-circle';
  }
};

// Helper para formatear fecha
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Helper para formatear hora
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${ampm}`;
};

const Reservations = () => {
  const router = useRouter();
  const { isAdminOrOperator, parkingId } = useAuth();

  // Hooks
  const userReservations = useReservationsScreen();
  const parkingReservations = useParkingReservations();

  // Usar el hook apropiado según el rol
  const isAdmin = isAdminOrOperator;
  const {
    reservations: allReservations,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    handleRefresh,
    loadMore,
    totalCount
  } = isAdmin ? {
    reservations: parkingReservations.reservations,
    loading: parkingReservations.loading,
    refreshing: parkingReservations.refreshing,
    loadingMore: parkingReservations.loadingMore,
    hasMore: parkingReservations.hasMore,
    handleRefresh: parkingReservations.handleRefresh,
    loadMore: parkingReservations.loadMore,
    totalCount: parkingReservations.totalCount
  } : {
    reservations: userReservations.reservationHistory,
    loading: userReservations.loading,
    refreshing: userReservations.refreshing,
    loadingMore: false,
    hasMore: false,
    handleRefresh: userReservations.handleRefresh,
    loadMore: () => {},
    totalCount: userReservations.totalHistoryCount
  };

  // Funciones con Haptics
  const handlePressWithHaptics = (callback: () => void) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    callback();
  };

  const handleReservationPress = (reservation: any) => {
    router.push({
      pathname: `/reservations/${reservation.id}`,
      params: { data: JSON.stringify(reservation) },
    });
  };

  // Renderizar cada reserva
  const renderReservation: ListRenderItem<ReservationWithRelations | any> = ({ item: reservation }) => {
    // Determinar el nombre del parqueadero
    const parkingName = reservation.parkingName || reservation.parkingSpot?.parking?.name || 'Parqueadero';
    const address = reservation.address || reservation.parkingSpot?.parking?.address || 'Sin dirección';
    const spotNumber = reservation.spot || (reservation.parkingSpot?.spotNumber ? `Puesto ${reservation.parkingSpot.spotNumber}` : 'N/A');
    
    // Determinar tiempo y fecha
    let time = reservation.time;
    let date = reservation.date;
    
    if (!time && reservation.startTime && reservation.endTime) {
      time = `${formatTime(reservation.startTime)} - ${formatTime(reservation.endTime)}`;
    }
    
    if (!date && reservation.startTime) {
      date = formatDate(reservation.startTime);
    }

    // Usuario (solo para admin)
    const userName = isAdmin && reservation.user
      ? `${reservation.user.name} ${reservation.user.lastName || ''}`
      : null;
    
    const status = reservation.realStatus || reservation.status;

    return (
      <Pressable
        onPress={() => handlePressWithHaptics(() => handleReservationPress(reservation))}
        className="bg-axia-darkGray rounded-2xl p-5 mb-3 shadow-lg shadow-black/30 active:scale-95"
      >
        <View className="flex-row items-start">
          <View 
            className="w-10 h-10 rounded-xl items-center justify-center mr-4"
            style={{ backgroundColor: getStatusColor(status) + '20' }}
          >
            <Ionicons 
              name={getStatusIcon(status)} 
              size={20} 
              color={getStatusColor(status)} 
            />
          </View>

          <View className="flex-1">
            <View className="flex-row justify-between items-start mb-2">
              <Text className="text-white text-lg font-primaryBold flex-1 mr-2">
                {parkingName}
              </Text>
              <View 
                className="px-3 py-1 rounded-full"
                style={{ backgroundColor: getStatusColor(status) + '20' }}
              >
                <Text 
                  className="text-xs font-primaryBold"
                  style={{ color: getStatusColor(status) }}
                >
                  {getStatusText(status)}
                </Text>
              </View>
            </View>

            <Text className="text-axia-gray text-sm font-primary mb-2">
              {address}
            </Text>

            {/* Usuario (solo para admin) */}
            {userName && (
              <View className="flex-row items-center mb-2">
                <Ionicons name="person-outline" size={14} color="#6B7280" />
                <Text className="text-axia-gray text-sm font-primary ml-1">
                  {userName}
                </Text>
              </View>
            )}

            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center flex-1 mr-2">
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text className="text-axia-gray text-sm font-primary ml-1" numberOfLines={1}>
                  {time || 'N/A'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                <Text className="text-axia-gray text-sm font-primary ml-1">
                  {date || 'N/A'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6B7280" />
              <Text className="text-axia-gray text-sm font-primary ml-1">
                {spotNumber}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  // Header de la lista
  const ListHeaderComponent = () => (
    <View className="pt-8 pb-4">
      <Text className="text-white text-3xl font-primaryBold mb-2">
        {isAdmin ? 'Reservas del Parqueadero' : 'Mis Reservas'}
      </Text>
      <Text className="text-axia-gray text-sm font-primary mb-6">
        {totalCount} {totalCount === 1 ? 'reserva' : 'reservas'} {isAdmin ? 'totales' : ''}
      </Text>
    </View>
  );

  // Footer con loading indicator
  const ListFooterComponent = () => {
    if (!loadingMore) return null;
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#10B981" />
      </View>
    );
  };

  // Empty state
  const ListEmptyComponent = () => {
    if (loading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-axia-gray text-base font-primary mt-4">
            Cargando reservas...
          </Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center py-20">
        <View className="bg-axia-darkGray w-20 h-20 rounded-full items-center justify-center mb-4">
          <Ionicons name="calendar-outline" size={40} color="#6B7280" />
        </View>
        <Text className="text-white text-xl font-primaryBold text-center mb-2">
          {isAdmin ? 'No hay reservas' : 'No tienes reservas'}
        </Text>
        <Text className="text-axia-gray text-sm font-primary text-center mb-6 px-8">
          {isAdmin
            ? 'Aún no hay reservas para este parqueadero'
            : 'Encuentra y reserva tu próximo estacionamiento'
          }
        </Text>
        {!isAdmin && (
          <Pressable
            onPress={() => handlePressWithHaptics(() => router.push('/(tabs)/home'))}
            className="bg-axia-green px-8 py-4 rounded-xl flex-row items-center shadow-lg shadow-axia-green/25 active:scale-95"
          >
            <Ionicons name="add" size={20} color="#000000" />
            <Text className="text-axia-black font-primaryBold ml-2">
              Hacer una Reserva
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <FlatList
        data={allReservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 32, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
};

export default Reservations;
