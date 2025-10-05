import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const fetchCarById = async (id: string) => {
  return {
    id,
    brand: 'Toyota',
    model: 'Swift',
    year: 2022,
    plate: 'ABC 123',
    color: 'Rojo',
    mileage: 15000,
  };
};

interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color?: string;
  mileage?: number;
}

export default function CarDetails() {
  const router = useRouter();
  const params = useLocalSearchParams<{ carId: string }>();
  const [car, setCar] = useState<Car | null>(null);

  useEffect(() => {
    const loadCar = async () => {
      if (params.carId) {
        const data = await fetchCarById(params.carId);
        setCar(data);
      }
    };
    loadCar();
  }, [params.carId]);

  if (!car) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <View className="items-center">
          <Ionicons name="car-sport" size={48} color="#6B7280" />
          <Text className="text-white text-lg font-primary mt-4">Cargando información del vehículo...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 py-8">
          
          {/* Header */}
          <View className="flex-row items-center mb-8">
            <Pressable 
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-axia-darkGray items-center justify-center mr-4 active:scale-95"
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </Pressable>
            <Text className="text-white text-2xl font-primaryBold">Detalle del Vehículo</Text>
          </View>

          {/* Icono del vehículo */}
          <View className="items-center mb-8">
            <View className="w-32 h-32 rounded-full items-center justify-center border border-axia-green/30">
              <Ionicons name="car-sport" size={60} color="#10B981" />
            </View>
          </View>

          {/* Información principal */}
          <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
            <Text className="text-white text-2xl font-primaryBold mb-2 text-center">
              {car.brand} {car.model}
            </Text>
            <Text className="text-axia-gray text-base font-primary text-center mb-6">
              {car.year} • {car.color}
            </Text>

            {/* Detalles en grid */}
            <View className="space-y-4">
              <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
                <View className="flex-row items-center">
                  <Ionicons name="pricetag-outline" size={20} color="#6B7280" />
                  <Text className="text-axia-gray font-primary ml-3">Placa</Text>
                </View>
                <Text className="text-white font-primaryBold">{car.plate}</Text>
              </View>

              <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                  <Text className="text-axia-gray font-primary ml-3">Año</Text>
                </View>
                <Text className="text-white font-primaryBold">{car.year}</Text>
              </View>

              <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
                <View className="flex-row items-center">
                  <Ionicons name="color-palette-outline" size={20} color="#6B7280" />
                  <Text className="text-axia-gray font-primary ml-3">Color</Text>
                </View>
                <Text className="text-white font-primaryBold">{car.color}</Text>
              </View>

              {car.mileage !== undefined && (
                <View className="flex-row justify-between items-center py-3">
                  <View className="flex-row items-center">
                    <Ionicons name="speedometer-outline" size={20} color="#6B7280" />
                    <Text className="text-axia-gray font-primary ml-3">Kilometraje</Text>
                  </View>
                  <Text className="text-white font-primaryBold">{car.mileage.toLocaleString()} km</Text>
                </View>
              )}
            </View>
          </View>

          {/* Acciones */}
          <View className="space-y-4">
            <Pressable 
              onPress={() => router.back()} 
              className="bg-axia-green py-4 rounded-xl items-center mb-6 active:scale-95"
            >
              <Text className="text-axia-black font-primaryBold text-lg">Volver a Mis Vehículos</Text>
            </Pressable>
            
            <Pressable 
              onPress={() => console.log('Editar vehículo')}
              className="bg-axia-darkGray py-4 rounded-xl items-center border border-axia-gray/30 active:scale-95"
            >
              <Text className="text-white font-primaryBold text-lg">Editar Información</Text>
            </Pressable>
          </View>

          {/* Información adicional */}
          <View className="mt-8 p-4 bg-axia-darkGray/50 rounded-xl">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle-outline" size={20} color="#6B7280" />
              <Text className="text-axia-gray font-primaryBold ml-2">Información del vehículo</Text>
            </View>
            <Text className="text-axia-gray text-sm font-primary">
              Este vehículo está registrado en tu cuenta y disponible para realizar reservas en cualquier parqueadero.
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}