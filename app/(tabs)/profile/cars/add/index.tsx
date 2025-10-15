import React, { useState } from "react";
import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import Input from "../../../../../components/atoms/Input";
import { createVehicle, VehicleTypeUpper, EngineType } from "../../../../../libs/vehicles";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function AddCarScreen() {
  const router = useRouter();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("");
  const [type, setType] = useState<VehicleTypeUpper>('CAR');
  const [engineType, setEngineType] = useState<EngineType | undefined>('GASOLINE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateInputs = () => {
    if (!brand.trim() || !model.trim() || !plate.trim() || !color.trim()) {
      Alert.alert('Campos requeridos', 'Marca, modelo, color y placa son obligatorios.');
      return false;
    }
    // Normalize and validate Colombian plate format: ABC123 or ABC 123
    const normalizedPlate = plate.toUpperCase().replace(/\s+/g, '');
    if (!/^[A-Z]{3}[0-9]{3}$/.test(normalizedPlate)) {
      Alert.alert('Placa inválida', 'Formato válido: ABC123 (3 letras y 3 números).');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateInputs()) return;
    try {
      setIsSubmitting(true);
      const payload = {
        type,
        licensePlate: plate.toUpperCase(),
        model: model.trim(),
        carBrand: brand.trim(),
        color: color.trim(),
        engineType, // Incluir engineType
      } as const;
      await createVehicle(payload);
      Alert.alert('Vehículo creado', 'Tu vehículo se guardó correctamente.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      const message = err?.message || 'No se pudo crear el vehículo.';
      Alert.alert('Error', message);
    } finally {
      setIsSubmitting(false);
    }
  };
    
  const handleGoBack = () => {
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
        <Pressable onPress={() => router.push('/(tabs)/profile')} className="mt-4">
          <Text className="text-axia-gray text-center text-base">
            Cancelar
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
