import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, Modal, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCarDetailScreen } from '../../../../../hooks';
import { useDeleteVehicle } from '../../../../../hooks/udeDeleteCar';

export default function CarDetails() {
  const router = useRouter();
  const {
    car,
    loading,
    handleGoBack,
    handleBackToVehicles,
  } = useCarDetailScreen();

  const { isDeleting, confirmDelete } = useDeleteVehicle({
    onSuccess: handleBackToVehicles,
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeletePress = () => {
    if (!car) return;
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (!car) return;
    setShowDeleteModal(false);
    confirmDelete(car as any);
  };

  const handleEdit = () => {
    if (!car) return;
    router.push(`/profile/cars/edit/${car.id}`);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <View className="items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-white text-lg font-primary mt-4">
            Cargando información del vehículo...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!car) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black items-center justify-center">
        <View className="items-center">
          <Ionicons name="car-sport" size={48} color="#6B7280" />
          <Text className="text-white text-lg font-primary mt-4 text-center">
            No se encontró información del vehículo
          </Text>
          <Pressable 
            onPress={handleGoBack}
            className="bg-axia-green px-6 py-3 rounded-xl mt-6"
          >
            <Text className="text-axia-black font-primaryBold">Volver</Text>
          </Pressable>
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
              onPress={handleGoBack}
              className="w-10 h-10 rounded-full bg-axia-darkGray items-center justify-center mr-4 active:scale-95"
            >
              <Ionicons name="chevron-back" size={20} color="#FFFFFF" />
            </Pressable>
            
            <Text className="text-white text-2xl font-primaryBold flex-1">
              Detalle del Vehículo
            </Text>
            
            {/* Botón de editar */}
            <Pressable 
              onPress={handleEdit}
              disabled={isDeleting}
              className="w-10 h-10 rounded-full items-center justify-center mr-2 active:scale-95 disabled:opacity-50 bg-axia-green/20 border border-axia-green/30"
            >
              <Ionicons 
                name="create-outline" 
                size={16} 
                color="#10B981" 
              />
            </Pressable>
            
            {/* Botón de eliminar */}
            <Pressable 
              onPress={handleDeletePress}
              disabled={isDeleting}
              className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/30 items-center justify-center active:scale-95 disabled:opacity-50"
            >
              <Ionicons name="trash-outline" size={16} color="#EF4444" />
            </Pressable>
          </View>

          {/* Icono o Imagen del vehículo */}
          <View className="items-center mb-8">
            {car.image ? (
              <View className="w-32 h-32 rounded-full overflow-hidden border-2 border-axia-green/30 bg-white/90">
                <Image 
                  source={{ uri: car.image }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View className="w-32 h-32 rounded-full items-center justify-center border border-axia-green/30 bg-axia-green/10">
                <Ionicons name="car-sport" size={60} color="#10B981" />
              </View>
            )}
          </View>

          {/* Información principal */}
          <View className="bg-axia-darkGray rounded-2xl p-6 mb-6">
            <Text className="text-white text-2xl font-primaryBold mb-2 text-center">
              {car.carBrand} {car.model}
            </Text>
            <Text className="text-axia-gray text-base font-primary text-center mb-6">
              {car.color}
            </Text>

            {/* Detalles en grid */}
            <View className="space-y-4">
              <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
                <View className="flex-row items-center">
                  <Ionicons name="pricetag-outline" size={20} color="#6B7280" />
                  <Text className="text-axia-gray font-primary ml-3">Placa</Text>
                </View>
                <Text className="text-white font-primaryBold">{car.licensePlate}</Text>
              </View>

              <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
                <View className="flex-row items-center">
                  <MaterialCommunityIcons name="engine-outline" size={24} color="#6B7280" />
                  <Text className="text-axia-gray font-primary ml-3">Tipo de motor</Text>
                </View>
                <Text className="text-white font-primaryBold">{car.engineType}</Text>
              </View>

              <View className="flex-row justify-between items-center py-3 border-b border-axia-gray/20">
                <View className="flex-row items-center">
                  <Ionicons name="color-palette-outline" size={20} color="#6B7280" />
                  <Text className="text-axia-gray font-primary ml-3">Color</Text>
                </View>
                <Text className="text-white font-primaryBold">{car.color || 'No especificado'}</Text>
              </View>
            </View>
          </View>

          {/* Acciones */}
          <View className="space-y-4">
            <Pressable 
              onPress={handleBackToVehicles}
              disabled={isDeleting} 
              className="bg-axia-green py-4 rounded-xl items-center mb-6 active:scale-95 disabled:opacity-50"
            >
              <Text className="text-axia-black font-primaryBold text-lg">
                {isDeleting ? 'Eliminando...' : 'Volver a Mis Vehículos'}
              </Text>
            </Pressable>
            
            <Pressable 
              onPress={handleEdit}
              disabled={isDeleting}
              className="bg-axia-darkGray py-4 rounded-xl items-center border border-axia-gray/30 active:scale-95 disabled:opacity-50"
            >
              <Text className="text-white font-primaryBold text-lg">
                Editar Información
              </Text>
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

      {/* Modal de confirmación */}
      <Modal visible={showDeleteModal} transparent animationType="fade">
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-axia-darkGray rounded-2xl p-6 w-full max-w-sm border border-red-500/20">
            <View className="items-center mb-6">
              <View className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 items-center justify-center mb-4">
                <Ionicons name="trash-outline" size={28} color="#EF4444" />
              </View>
              <Text className="text-white text-xl font-primaryBold text-center mb-2">
                Eliminar Vehículo
              </Text>
              <Text className="text-axia-gray text-center text-sm">
                ¿Estás seguro de eliminar tu {car.carBrand} {car.model} ({car.licensePlate})?
              </Text>
            </View>
            
            <View className="flex-row space-x-3">
              <Pressable 
                onPress={() => setShowDeleteModal(false)}
                className="flex-1 bg-axia-gray/30 py-3 rounded-xl active:opacity-70"
              >
                <Text className="text-white font-primaryBold text-center">Cancelar</Text>
              </Pressable>
              <Pressable 
                onPress={handleConfirmDelete}
                className="flex-1 bg-red-500 py-3 rounded-xl active:opacity-70"
              >
                <Text className="text-white font-primaryBold text-center">
                  {isDeleting ? 'Eliminando...' : 'Eliminar'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}