import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Input from "../../../../../components/atoms/Input";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAddCarForm } from "../../../../../hooks/useAddCarForm";

export default function AddCarScreen() {
  const {
    brand,
    model,
    plate,
    color,
    type,
    engineType,
    isSubmitting,
    setBrand,
    setModel,
    setPlate,
    setColor,
    setType,
    setEngineType,
    handleSave,
    handleGoBack,
    handleCancel,
  } = useAddCarForm();

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 py-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="mb-12">
          <View className="relative mb-4">
            <Pressable 
              onPress={handleGoBack} 
              className="absolute left-0 top-0 z-10 p-2 -ml-2"
            >
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>
            
            <View className="items-center">
              <Text className="text-white text-3xl font-bold text-center">
                Añadir Vehículo
              </Text>
            </View>
          </View>
          
          {/* Descripción */}
          <Text className="text-white/60 text-base text-center px-4">
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
        
        {/* Tipo de vehículo */}
        <View className="mb-4">
          <Text className="text-white/80 text-sm font-primary mb-2 ml-1">
            Tipo de vehículo
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setType('CAR')}
              className={`flex-1 rounded-xl border ${type === 'CAR' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-4 py-3 flex-row items-center justify-center`}
            >
              <Ionicons 
                name="car-sport" 
                size={20} 
                color={type === 'CAR' ? '#FFFFFF' : '#9CA3AF'} 
                style={{ marginRight: 8 }}
              />
              <Text className={`${type === 'CAR' ? 'text-white' : 'text-white/60'} font-primaryBold`}>
                Carro
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setType('MOTORCYCLE')}
              className={`flex-1 rounded-xl border ${type === 'MOTORCYCLE' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-4 py-3 flex-row items-center justify-center`}
            >
              <Ionicons 
                name="bicycle" 
                size={20} 
                color={type === 'MOTORCYCLE' ? '#FFFFFF' : '#9CA3AF'} 
                style={{ marginRight: 8 }}
              />
              <Text className={`${type === 'MOTORCYCLE' ? 'text-white' : 'text-white/60'} font-primaryBold`}>
                Moto
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Tipo de motor */}
        <View className="mb-4">
          <Text className="text-white/80 text-sm font-primary mb-2 ml-1">
            Tipo de motor
          </Text>
          <View className="flex-row gap-3">
            <Pressable
              onPress={() => setEngineType('GASOLINE')}
              className={`flex-1 rounded-xl border ${engineType === 'GASOLINE' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-3 py-3`}
            >
              <View className="items-center">
                <FontAwesome5 className="text-2xl mb-1" name="gas-pump" size={24} color="white" />
                <Text className={`text-xs ${engineType === 'GASOLINE' ? 'text-white' : 'text-white/60'} font-primary`}>
                  Gasolina
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setEngineType('ELECTRIC')}
              className={`flex-1 rounded-xl border ${engineType === 'ELECTRIC' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-3 py-3`}
            >
              <View className="items-center">
                <MaterialIcons className="text-2xl mb-1" name="electric-car" size={24} color="white" />
                <Text className={`text-xs ${engineType === 'ELECTRIC' ? 'text-white' : 'text-white/60'} font-primary`}>
                  Eléctrico
                </Text>
              </View>
            </Pressable>
            <Pressable
              onPress={() => setEngineType('HYBRID')}
              className={`flex-1 rounded-xl border ${engineType === 'HYBRID' ? 'bg-axia-green border-axia-green' : 'border-white/20 bg-white/5'} px-3 py-3`}
            >
              <View className="items-center">
                <FontAwesome5 className="text-2xl mb-1" name="plug" size={24} color="white" />
                <Text className={`text-xs ${engineType === 'HYBRID' ? 'text-white' : 'text-white/60'} font-primary`}>
                  Híbrido
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Color */}
        <Input
          placeholder="Color (Ej: Blanco)"
          value={color}
          onChangeText={setColor}
          autoCapitalize="words"
        />
        <Input
          placeholder="Placa (Ej: ABC123)"
          value={plate}
          onChangeText={setPlate}
          autoCapitalize="characters"
        />

        {/* Botón Guardar */}
        <Pressable
          disabled={isSubmitting}
          onPress={handleSave}
          className="mt-10 w-full rounded-2xl bg-axia-green shadow-elevated"
          android_ripple={{ color: "#004d3b" }}
        >
          <View className="h-14 rounded-2xl items-center justify-center">
            <Text className="text-white text-lg font-semibold tracking-wide">
              {isSubmitting ? 'Guardando...' : 'Guardar Vehículo'}
            </Text>
          </View>
        </Pressable>

        {/* Cancelar */}
        <Pressable onPress={handleCancel} className="mt-4">
          <Text className="text-axia-gray text-center text-base">
            Cancelar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
