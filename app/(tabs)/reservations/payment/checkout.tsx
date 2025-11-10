import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Button from '../../../../components/atoms/Button';

const CheckoutSuccess = () => {
  const params = useLocalSearchParams();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada del check
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Animación de fade in del contenido
    Animated.timing(opacityAnim, {
      toValue: 1,
      duration: 500,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleContinue = () => {
    // Limpiar toda la pila de navegación y navegar al tab de parkings
    router.dismissAll();
    router.replace('/(tabs)/parkings/');
  };

  const handleViewReservation = () => {
    // Limpiar la pila y navegar a reservaciones
    router.dismissAll();
    router.replace('/(tabs)/reservations');
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'bottom']}>
      <View className="flex-1 justify-center items-center px-6">
        {/* Círculo con check animado */}
        <Animated.View
          style={{
            transform: [{ scale: scaleAnim }],
          }}
          className="mb-8"
        >
          <LinearGradient
            colors={['#006B54', '#005945']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="w-32 h-32 rounded-full items-center justify-center shadow-2xl"
            style={{ elevation: 12 }}
          >
            <Ionicons name="checkmark" size={64} color="white" />
          </LinearGradient>
        </Animated.View>

        {/* Contenido animado */}
        <Animated.View
          style={{ opacity: opacityAnim }}
          className="items-center"
        >
          <Text className="text-white text-3xl font-primaryBold mb-3 text-center">
            ¡Pago Exitoso!
          </Text>
          
          <Text className="text-axia-gray text-base font-primary text-center mb-8 px-8">
            Tu orden está confirmada. Recibirás un correo de confirmación con los detalles de tu reserva.
          </Text>

          {/* Detalles decorativos */}
          <View className="w-full bg-axia-darkGray rounded-2xl p-6 mb-8">
            <View className="flex-row items-center mb-4">
              <View className="bg-axia-green/20 w-12 h-12 rounded-full items-center justify-center mr-4">
                <Ionicons name="receipt-outline" size={24} color="#006B54" />
              </View>
              <View className="flex-1">
                <Text className="text-axia-gray text-sm font-primary">Número de Orden</Text>
                <Text className="text-white text-lg font-primaryBold">
                  #{Math.floor(Math.random() * 1000000)}
                </Text>
              </View>
            </View>

            <View className="h-px bg-axia-gray/20 my-4" />

            <View className="flex-row items-center">
              <View className="bg-axia-green/20 w-12 h-12 rounded-full items-center justify-center mr-4">
                <Ionicons name="time-outline" size={24} color="#006B54" />
              </View>
              <View className="flex-1">
                <Text className="text-axia-gray text-sm font-primary">Tiempo estimado</Text>
                <Text className="text-white text-lg font-primaryBold">
                  Inmediato
                </Text>
              </View>
            </View>
          </View>

          {/* Confetti decorativo */}
          <View className="absolute top-0 left-0 right-0" style={{ pointerEvents: 'none' }}>
            {[...Array(8)].map((_, i) => (
              <View
                key={i}
                className="absolute w-2 h-2 rounded-full bg-axia-green"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: -20 + Math.random() * 40,
                  opacity: 0.3 + Math.random() * 0.7,
                }}
              />
            ))}
          </View>
        </Animated.View>
      </View>

      {/* Botones */}
      <View className="px-6 pb-6">
        <Button
          title="Ver Mi Reserva"
          onPress={handleViewReservation}
          size="large"
          className="mb-4 shadow-lg shadow-axia-green/25"
        />
        <Pressable
          onPress={handleContinue}
          className="py-4 active:opacity-70"
        >
          <Text className="text-axia-gray text-center text-base font-primary">
            Continuar Explorando
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default CheckoutSuccess;
