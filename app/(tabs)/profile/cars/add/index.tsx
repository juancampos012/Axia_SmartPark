import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AddCarForm from "../../../../../components/organisms/forms/AddCarForm";
import { KeyboardAvoidingView, Platform } from "react-native";

export default function AddCarScreen() {
  const handleSuccess = () => {
    // Puedes agregar lógica adicional aquí si es necesario
    console.log("Vehículo creado exitosamente");
  };

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          className="px-6 py-8"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="mb-12">
            <View className="relative mb-4">
              <Pressable 
                onPress={() => {/* navigation handled in form */}} 
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
            
            <Text className="text-white/60 text-base text-center px-4">
              Registra tu carro para poder reservar tu parqueadero fácilmente.
            </Text>
          </View>

          {/* Formulario */}
          <AddCarForm onSuccess={handleSuccess} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}