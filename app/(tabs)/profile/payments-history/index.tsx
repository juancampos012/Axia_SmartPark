import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePaymentHistory } from '../../../../hooks';
import { PaymentWithRelations, PaymentStatus } from '../../../../interfaces/payment';
import CreditCard from '../../../../components/atoms/CreditCard';

const PaymentsHistory = () => {
  const router = useRouter();
  
  const {
    payments,
    loading,
    refreshing,
    stats,
    hasMore,
    formatAmount,
    getStatusText,
    getStatusColor,
    getMethodText,
    handleRefresh,
    loadMore,
  } = usePaymentHistory();

  const COLORS = {
    success: '#268D65', // tailwind 'success'
    warning: '#f59e0b', // tailwind 'warning'
    error: '#dc2626',   // tailwind 'error'
    grayLight: '#9CA3AF',
    green: '#006B54',
    grayDark: '#374151'
  };

  const handleGoBack = () => {
    router.back();
  };

  const handlePaymentPress = (payment: PaymentWithRelations) => {
    router.push({
      pathname: `/profile/payments-history/${payment.id}`,
    });
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${displayMinutes} ${ampm}`;
  };

  const renderPaymentCard = ({ item: payment }: { item: PaymentWithRelations }) => {
    const isSuccessful = payment.status === PaymentStatus.SUCCESSFUL;
    const isPending = payment.status === PaymentStatus.PENDING;
    const isFailed = payment.status === PaymentStatus.FAILED;

    

    return (
      <TouchableOpacity
        onPress={() => handlePaymentPress(payment)}
        className="bg-axia-darkGray rounded-2xl p-4 mb-4"
        activeOpacity={0.7}
      >
        {/* Header con estado y monto */}
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1">
            <Text className="text-white text-lg font-pbold">
              {formatAmount(payment.amount)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons
                name={isSuccessful ? 'checkmark-circle' : isPending ? 'time' : 'close-circle'}
                size={16}
                color={isSuccessful ? COLORS.success : isPending ? COLORS.warning : COLORS.error}
              />
              <Text
                className="text-sm font-pmedium ml-1"
                style={{ color: isSuccessful ? COLORS.success : isPending ? COLORS.warning : COLORS.error }}
              >
                {getStatusText(payment.status)}
              </Text>
            </View>
          </View>
          
          <View className="items-end">
            <Text className="text-axia-gray-light text-xs font-pregular">
              {formatDate(payment.createdAt)}
            </Text>
            <Text className="text-axia-gray-light text-xs font-pregular">
              {formatTime(payment.createdAt)}
            </Text>
          </View>
        </View>

        {/* Información de la reserva */}
        {payment.reservation && (
          <View className="border-t border-axia-gray-dark pt-3 mb-3">
            <View className="flex-row items-center mb-2">
              <Ionicons name="location" size={16} color={COLORS.grayLight} />
              <Text className="text-white text-sm font-pmedium ml-2" numberOfLines={1}>
                {payment.reservation.parkingSpot?.parking?.name || 'Parqueadero'}
              </Text>
            </View>
            
            {payment.reservation.vehicle && (
              <View className="flex-row items-center">
                <Ionicons name="car" size={16} color={COLORS.grayLight} />
                <Text className="text-axia-gray-light text-sm font-pregular ml-2">
                  {payment.reservation.vehicle.carBrand} {payment.reservation.vehicle.model} · {payment.reservation.vehicle.licensePlate}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Método de pago */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons
              name={payment.paymentMethod === 'CREDIT_CARD' ? 'card' : payment.paymentMethod === 'DEBIT_CARD' ? 'card-outline' : 'cash'}
              size={16}
              color={COLORS.grayLight}
            />
            <Text className="text-axia-gray-light text-sm font-pregular ml-2">
              {getMethodText(payment.paymentMethod)}
            </Text>
            {payment.paymentMethodDetail && (
              <Text className="text-axia-gray-light text-xs font-pregular ml-2">
                •••• {payment.paymentMethodDetail.lastFourDigits}
              </Text>
            )}
          </View>
          
          <Ionicons name="chevron-forward" size={20} color={COLORS.grayLight} />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black">
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={handleGoBack} className="p-2">
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className="text-white text-xl font-pbold">Historial de Pagos</Text>
          <View className="w-10" />
        </View>
        
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.lime} />
          <Text className="text-axia-gray-light text-sm font-pregular mt-4">
            Cargando pagos...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4">
        <TouchableOpacity onPress={handleGoBack} className="p-2">
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-xl font-pbold">Historial de Pagos</Text>
        <View className="w-10" />
      </View>

      {/* Estadísticas resumen */}
      {stats && (
        <View className="px-6 pb-4">
          <View className="bg-axia-darkGray rounded-2xl p-4">
            <View className="flex-row justify-between mb-3">
              <View className="flex-1">
                <Text className="text-axia-gray-light text-xs font-pregular mb-1">
                  Total Gastado
                </Text>
                <Text className="text-white text-2xl font-pbold">
                  {formatAmount(stats.totalSpent)}
                </Text>
              </View>
              
              <View className="flex-1 items-end">
                <Text className="text-axia-gray-light text-xs font-pregular mb-1">
                  Pagos Totales
                </Text>
                <Text className="text-white text-2xl font-pbold">
                  {stats.totalPayments}
                </Text>
              </View>
            </View>
            
            <View className="flex-row justify-between pt-3 border-t border-axia-gray-dark">
              <View>
                <Text className="text-axia-green text-sm font-pmedium">
                  {stats.successfulPayments} Exitosos
                </Text>
              </View>
              {stats.failedPayments > 0 && (
                <View>
                  <Text className="text-error text-sm font-pmedium">
                    {stats.failedPayments} Fallidos
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Lista de pagos */}
      <FlatList
        data={payments}
        renderItem={renderPaymentCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.green}
              colors={[COLORS.green]}
            />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          hasMore ? (
            <View className="py-4">
              <ActivityIndicator size="small" color={COLORS.green} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center justify-center py-12">
            <Ionicons name="receipt-outline" size={64} color="#4B5563" />
            <Text className="text-axia-gray-light text-base font-pmedium mt-4">
              No tienes pagos registrados
            </Text>
            <Text className="text-axia-gray-light text-sm font-pregular mt-2 text-center px-8">
              Tus pagos aparecerán aquí cuando realices una reserva
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default PaymentsHistory;
