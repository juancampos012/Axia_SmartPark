import React, { useState } from "react";
import { SafeAreaView, ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import Input from "../../../../components/atoms/Input";

export default function AddCarScreen() {
  const router = useRouter();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plate, setPlate] = useState("");

  const handleSave = () => {
    console.log({ brand, model, year, plate });
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="items-center mb-8">
          <Text className="text-white text-3xl font-bold">
            Añadir Vehículo
          </Text>
          <Text className="text-white/60 text-base mt-2 text-center">
            Registra tu carro para poder reservar tu parqueadero fácilmente.
          </Text>
        </View>

        {/* Inputs */}
        <Input
          placeholder="Marca (Ej: Toyota)"
          value={brand}
          onChangeText={setBrand}
          autoCapitalize="words"
        />
        <Input
          placeholder="Modelo (Ej: Corolla)"
          value={model}
          onChangeText={setModel}
          autoCapitalize="words"
        />
        <Input
          placeholder="Año (Ej: 2022)"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
        />
        <Input
          placeholder="Placa (Ej: ABC123)"
          value={plate}
          onChangeText={setPlate}
          autoCapitalize="characters"
        />

        {/* Botón Guardar */}
        <Pressable
          onPress={handleSave}
          className="mt-10 w-full rounded-2xl bg-axia-green shadow-elevated"
          android_ripple={{ color: "#004d3b" }}
        >
          <View className="h-14 rounded-2xl items-center justify-center">
            <Text className="text-white text-lg font-semibold tracking-wide">
              Guardar Vehículo
            </Text>
          </View>
        </Pressable>

        {/* Cancelar */}
        <Pressable onPress={() => router.push('/(tabs)/profile')} className="mt-4">
          <Text className="text-axia-gray text-center text-base">
            Cancelar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
