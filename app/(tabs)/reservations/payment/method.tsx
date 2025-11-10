import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import SavedCard from '../../../../components/molecules/SavedCard';
import PaymentSummary from '../../../../components/molecules/PaymentSummary';
import Button from '../../../../components/atoms/Button';
import { usePaymentMethod } from '../../../../hooks/usePaymentMethod';

const PaymentMethod = () => {
  const params = useLocalSearchParams();
  
  // Parse de los datos de la reserva
  const reservationDataRaw = params.reservationData ? JSON.parse(params.reservationData as string) : null;
  
  const {
    reservationSummary,
    savedCards,
    selectedCardId,
    loading,
    processing,
    error,
    handleSelectCard,
    handleGoBack,
    handleAddNewCard,
    handleProceedToPay,
    loadPaymentMethods,
  } = usePaymentMethod({
    reservationDataRaw
  });

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top']}>
      {/* Loading overlay */}
      {processing && (
        <View className="absolute inset-0 bg-black/70 z-50 justify-center items-center">
          <View className="bg-axia-darkGray rounded-2xl p-6 items-center">
            <ActivityIndicator size="large" color="#006B54" />
            <Text className="text-white font-primaryBold mt-4">Procesando pago...</Text>
            <Text className="text-axia-gray font-primary mt-2 text-center">
              Por favor espera un momento
            </Text>
          </View>
        </View>
      )}

      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-axia-gray/20">
        <Pressable 
          onPress={handleGoBack}
          className="mr-4 active:opacity-70"
          disabled={processing}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text className="text-white text-xl font-primaryBold flex-1">
          Método de Pago
        </Text>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="px-6 py-6">
          {/* Resumen de la reserva */}
          <PaymentSummary data={reservationSummary} />

          {/* Tarjetas guardadas */}
          <View className="mb-6">
            <Text className="text-white text-lg font-primaryBold mb-4">
              Tarjetas Guardadas
            </Text>

            {loading ? (
              <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
                <ActivityIndicator size="large" color="#006B54" />
                <Text className="text-axia-gray text-base font-primary mt-4">
                  Cargando métodos de pago...
                </Text>
              </View>
            ) : error ? (
              <View className="bg-red-900/20 rounded-2xl p-6 items-center border border-red-500/30">
                <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                <Text className="text-red-400 text-base font-primary mt-4 text-center">
                  {error}
                </Text>
                <Pressable
                  onPress={loadPaymentMethods}
                  className="mt-4 bg-red-500/20 px-6 py-2 rounded-lg active:opacity-70"
                >
                  <Text className="text-red-400 font-primaryBold">Reintentar</Text>
                </Pressable>
              </View>
            ) : savedCards.length > 0 ? (
              savedCards.map((card) => (
                <SavedCard
                  key={card.id}
                  card={card}
                  isSelected={selectedCardId === card.id}
                  onPress={() => !processing && handleSelectCard(card.id)}
                />
              ))
            ) : (
              <View className="bg-axia-darkGray rounded-2xl p-6 items-center">
                <Ionicons name="card-outline" size={48} color="#6B7280" />
                <Text className="text-axia-gray text-base font-primary mt-4 text-center">
                  No tienes tarjetas guardadas
                </Text>
              </View>
            )}

            {/* Botón para agregar nueva tarjeta */}
            <Pressable
              onPress={() => handleAddNewCard(params.reservationData as string)}
              disabled={processing}
              className="flex-row items-center justify-center bg-axia-darkGray/50 rounded-2xl p-4 mt-4 active:opacity-70 border-2 border-dashed border-axia-green/30"
            >
              <Ionicons name="add-circle-outline" size={24} color="#006B54" />
              <Text className="text-axia-green text-base font-primaryBold ml-2">
                Agregar Nueva Tarjeta
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Botón fijo en la parte inferior */}
      <View className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-axia-black border-t border-axia-gray/20">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-axia-gray text-base font-primary">Total a Pagar</Text>
          <Text className="text-axia-green text-2xl font-primaryBold">
            ${reservationSummary.totalAmount.toFixed(2)}
          </Text>
        </View>
        <Button
          title={processing ? "Procesando..." : "Proceder al Pago"}
          onPress={handleProceedToPay}
          variant="primary"
          size="large"
          disabled={!selectedCardId || processing}
          className="shadow-lg shadow-axia-green/25"
        />
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethod;
