import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import {
  getUserPaymentMethods,
  deletePaymentMethod,
  setDefaultPaymentMethod,
} from '../../../../libs/paymentMethods';
import { PaymentMethodResponse, CardBrand } from '../../../../interfaces/paymentMethod';

const PaymentMethodsScreen = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const loadPaymentMethods = useCallback(async () => {
    try {
      const methods = await getUserPaymentMethods();
      // Ordenar: predeterminado primero, luego por fecha
      const sorted = methods.sort((a, b) => {
        if (a.isDefault && !b.isDefault) return -1;
        if (!a.isDefault && b.isDefault) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setPaymentMethods(sorted);
    } catch (error: any) {
      console.error('Error loading payment methods:', error);
      Alert.alert('Error', error.message || 'No se pudieron cargar los métodos de pago');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPaymentMethods();
    }, [loadPaymentMethods])
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadPaymentMethods();
  }, [loadPaymentMethods]);

  const handleSetDefault = useCallback(async (id: string) => {
    try {
      setSettingDefaultId(id);
      await setDefaultPaymentMethod(id);
      await loadPaymentMethods();
      Alert.alert('Éxito', 'Método de pago predeterminado actualizado');
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo establecer como predeterminado');
    } finally {
      setSettingDefaultId(null);
    }
  }, [loadPaymentMethods]);

  const handleDelete = useCallback((method: PaymentMethodResponse) => {
    Alert.alert(
      'Eliminar método de pago',
      `¿Estás seguro de que deseas eliminar la tarjeta terminada en ${method.lastFourDigits}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeletingId(method.id);
              await deletePaymentMethod(method.id);
              await loadPaymentMethods();
              Alert.alert('Éxito', 'Método de pago eliminado correctamente');
            } catch (error: any) {
              Alert.alert('Error', error.message || 'No se pudo eliminar el método de pago');
            } finally {
              setDeletingId(null);
            }
          },
        },
      ]
    );
  }, [loadPaymentMethods]);

  const getCardIcon = (brand: CardBrand): 'card' | 'card-outline' => {
    switch (brand) {
      case CardBrand.VISA:
        return 'card';
      case CardBrand.MASTERCARD:
        return 'card-outline';
      case CardBrand.AMEX:
        return 'card';
      case CardBrand.DISCOVER:
        return 'card-outline';
      case CardBrand.DINERS:
        return 'card';
      default:
        return 'card-outline';
    }
  };

  const getCardColor = (brand: CardBrand): string => {
    switch (brand) {
      case CardBrand.VISA:
        return '#1A1F71';
      case CardBrand.MASTERCARD:
        return '#EB001B';
      case CardBrand.AMEX:
        return '#006FCF';
      case CardBrand.DISCOVER:
        return '#FF6000';
      case CardBrand.DINERS:
        return '#0079BE';
      default:
        return '#6B7280';
    }
  };

  const renderPaymentMethod = ({ item }: { item: PaymentMethodResponse }) => {
    const isDeleting = deletingId === item.id;
    const isSettingDefault = settingDefaultId === item.id;
    const cardColor = getCardColor(item.cardBrand);
    const isExpiringSoon = () => {
      const now = new Date();
      const expiry = new Date(item.expiryYear, item.expiryMonth - 1);
      const diffMonths = (expiry.getFullYear() - now.getFullYear()) * 12 + expiry.getMonth() - now.getMonth();
      return diffMonths <= 3 && diffMonths >= 0;
    };

    return (
      <View className="bg-axia-darkGray rounded-2xl p-5 mb-4 mx-6">
        {/* Card Header */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center flex-1">
            <View
              className="w-12 h-12 rounded-xl items-center justify-center mr-3"
              style={{ backgroundColor: cardColor + '20' }}
            >
              <Ionicons name={getCardIcon(item.cardBrand)} size={24} color={cardColor} />
            </View>
            <View className="flex-1">
              <Text className="text-white font-primaryBold text-base mb-1">
                {item.cardBrand} •••• {item.lastFourDigits}
              </Text>
              <Text className="text-axia-gray font-primary text-sm">
                {item.cardholderName}
              </Text>
            </View>
          </View>
          {item.isDefault && (
            <View className="bg-axia-green/20 px-3 py-1 rounded-full">
              <Text className="text-axia-green text-xs font-primaryBold">
                Predeterminada
              </Text>
            </View>
          )}
        </View>

        {/* Card Details */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1">
            <Text className="text-axia-gray text-xs font-primary mb-1">Vence</Text>
            <Text className="text-white font-primaryBold">
              {String(item.expiryMonth).padStart(2, '0')}/{item.expiryYear}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-axia-gray text-xs font-primary mb-1">Tipo</Text>
            <Text className="text-white font-primaryBold">
              {item.type === 'CREDIT_CARD' ? 'Crédito' : 'Débito'}
            </Text>
          </View>
        </View>

        {/* Expiring Soon Warning */}
        {isExpiringSoon() && (
          <View className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 mb-4">
            <View className="flex-row items-center">
              <Ionicons name="warning" size={16} color="#F59E0B" />
              <Text className="text-amber-500 text-xs font-primary ml-2">
                Esta tarjeta vence pronto. Actualiza tu información de pago.
              </Text>
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="flex-row gap-2">
          {!item.isDefault && (
            <Pressable
              onPress={() => handleSetDefault(item.id)}
              disabled={isSettingDefault || isDeleting}
              className="flex-1 bg-axia-green/20 py-3 rounded-xl items-center active:scale-95"
            >
              {isSettingDefault ? (
                <ActivityIndicator size="small" color="#006B54" />
              ) : (
                <View className="flex-row items-center">
                  <Ionicons name="checkmark-circle" size={16} color="#006B54" />
                  <Text className="text-axia-green font-primaryBold text-sm ml-1">
                    Por defecto
                  </Text>
                </View>
              )}
            </Pressable>
          )}
          <Pressable
            onPress={() => handleDelete(item)}
            disabled={isDeleting || isSettingDefault}
            className="bg-red-500/20 py-3 px-6 rounded-xl items-center active:scale-95"
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#EF4444" />
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="trash" size={16} color="#EF4444" />
                <Text className="text-red-500 font-primaryBold text-sm ml-1">
                  Eliminar
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View className="flex-1 items-center justify-center px-6 py-12">
      <View className="w-20 h-20 rounded-full bg-axia-darkGray items-center justify-center mb-4">
        <Ionicons name="card-outline" size={40} color="#6B7280" />
      </View>
      <Text className="text-white text-xl font-primaryBold mb-2 text-center">
        No tienes métodos de pago
      </Text>
      <Text className="text-axia-gray text-sm font-primary text-center mb-6">
        Agrega una tarjeta para realizar pagos más rápido
      </Text>
      <Pressable
        onPress={() => router.push('/(tabs)/reservations/payment/add-card')}
        className="bg-axia-green px-6 py-3 rounded-xl active:scale-95"
      >
        <Text className="text-axia-black font-primaryBold">
          Agregar Método de Pago
        </Text>
      </Pressable>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#006B54" />
          <Text className="text-white font-primary mt-4">Cargando métodos de pago...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      {/* Header */}
      <View className="px-6 py-4 flex-row items-center justify-between border-b border-axia-darkGray">
        <View className="flex-row items-center flex-1">
          <Pressable
            onPress={() => router.back()}
            className="mr-4 active:scale-95"
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white text-2xl font-primaryBold">
              Métodos de Pago
            </Text>
            <Text className="text-axia-gray text-sm font-primary">
              {paymentMethods.length} {paymentMethods.length === 1 ? 'tarjeta' : 'tarjetas'}
            </Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.push('/(tabs)/reservations/payment/add-card')}
          className="bg-axia-green w-10 h-10 rounded-full items-center justify-center active:scale-95"
        >
          <Ionicons name="add" size={24} color="#0F1115" />
        </Pressable>
      </View>

      {/* List */}
      <FlatList
        data={paymentMethods}
        renderItem={renderPaymentMethod}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#006B54" />
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default PaymentMethodsScreen;
