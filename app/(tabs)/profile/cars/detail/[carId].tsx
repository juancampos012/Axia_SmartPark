import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Simula la función para traer un carro por id
const fetchCarById = async (id: string) => {
  // Aquí podrías hacer fetch a tu backend
  // Por ahora devolvemos un ejemplo
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
        <Text className="text-white">Cargando información del carro...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <ScrollView className="flex-1 px-6 py-8">
        {/* Header con botón de regresar */}
        <View className="flex-row items-center mb-8">
          <Pressable onPress={() => router.back()} className="mr-4">
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </Pressable>
          <Text className="text-white text-2xl font-semibold">Detalle del Carro</Text>
        </View>

        {/* Información del carro */}
        <View className="bg-axia-darkGray rounded-xl p-6">
          <View className="items-center mb-6">
            <Ionicons name="car-sport" size={64} color="#FFFFFF" />
          </View>
          <Text className="text-white text-xl font-semibold mb-2">
            {car.brand} {car.model}
          </Text>
          <Text className="text-axia-gray text-base mb-1">Modelo: {car.year}</Text>
          <Text className="text-axia-gray text-base mb-1">Placa: {car.plate}</Text>
          {car.color && <Text className="text-axia-gray text-base mb-1">Color: {car.color}</Text>}
          {car.mileage !== undefined && <Text className="text-axia-gray text-base mb-1">Kilometraje: {car.mileage} km</Text>}
        </View>

        {/* Opciones */}
        <View className="mt-8">
          <Pressable onPress={() => router.back()} className="bg-axia-green px-6 py-3 rounded-lg items-center">
            <Text className="text-axia-black font-semibold">Volver a Mis Carros</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
