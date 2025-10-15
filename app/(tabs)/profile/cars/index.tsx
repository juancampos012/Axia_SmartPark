import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { fetchMyVehicles } from '../../../../libs/vehicles';

interface Vehicle {
  id: string;
  type: 'CAR' | 'MOTORCYCLE';
  licensePlate: string;
  model: string;
  carBrand: string;
  color?: string;
  engineType?: 'GASOLINE' | 'ELECTRIC' | 'HYBRID';
  year?: number;
  createdAt?: string;
  updatedAt?: string;
}

const AllVehiclesScreen = () => {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVehicles = async () => {
    try {
      setError(null);
      const data = await fetchMyVehicles();
      setVehicles(data || []);
    } catch (err: any) {
      console.error('Error loading vehicles:', err);
      setError(err.message || 'Error al cargar los vehículos');
      Alert.alert('Error', err.message || 'No se pudieron cargar los vehículos');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Cargar vehículos al entrar a la pantalla
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadVehicles();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadVehicles();
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleAddVehicle = () => {
    router.push('/(tabs)/profile/cars/add');
  };

  const handleVehiclePress = (vehicle: Vehicle) => {
    router.push({
      pathname: `/(tabs)/profile/cars/detail/${vehicle.id}` as any,
      params: { vehicleData: JSON.stringify(vehicle) }
    });
  };

  const getVehicleIcon = (type: string) => {
    return type === 'MOTORCYCLE' ? 'bicycle' : 'car-sport';
  };

  const getEngineTypeIcon = (engineType?: string): { icon: string; color: string } | null => {
    if (!engineType) return null;
    
    const iconMap: { [key: string]: { icon: string; color: string } } = {
      'GASOLINE': { icon: 'water', color: '#F59E0B' }, // Amber para gasolina
      'ELECTRIC': { icon: 'flash', color: '#10B981' }, // Verde para eléctrico
      'HYBRID': { icon: 'leaf', color: '#06B6D4' } // Cyan para híbrido
    };
    
    return iconMap[engineType] || null;
  };

  const getEngineTypeLabel = (engineType?: string) => {
    if (!engineType) return null;
    const labels: { [key: string]: string } = {
      'GASOLINE': 'Gasolina',
      'ELECTRIC': 'Eléctrico',
      'HYBRID': 'Híbrido'
    };
    return labels[engineType] || engineType;
  };

  const getVehicleTypeLabel = (type: string) => {
    return type === 'MOTORCYCLE' ? 'Moto' : 'Carro';
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView className="flex-1 bg-axia-black">
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#10B981" />
          <Text className="text-white/60 mt-4">Cargando vehículos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-axia-black" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-white/10">
        <Pressable 
          onPress={handleGoBack}
          className="mr-4 active:opacity-70"
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Text className="text-white text-xl font-primaryBold flex-1">
          Mis Vehículos
        </Text>
        <Pressable
          onPress={handleAddVehicle}
          className="bg-axia-green rounded-full p-2 active:opacity-70"
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>

      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#10B981"
            colors={['#10B981']}
          />
        }
      >
        <View className="px-6 py-6">
          {/* Info Header */}
          <View className="mb-6">
            <Text className="text-white text-2xl font-primaryBold mb-2">
              Gestiona tus vehículos
            </Text>
            <Text className="text-white/60 text-base">
              {vehicles.length === 0 
                ? 'Aún no tienes vehículos registrados. Añade uno para comenzar.' 
                : `Tienes ${vehicles.length} vehículo${vehicles.length !== 1 ? 's' : ''} registrado${vehicles.length !== 1 ? 's' : ''}.`
              }
            </Text>
          </View>

          {/* Lista de vehículos */}
          {vehicles.length === 0 ? (
            <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
              <View className="bg-white/5 rounded-full p-6 mb-4">
                <Ionicons name="car-outline" size={48} color="#6B7280" />
              </View>
              <Text className="text-white/80 text-lg font-primaryBold mb-2 text-center">
                Sin vehículos registrados
              </Text>
              <Text className="text-white/50 text-center mb-6">
                Añade tu primer vehículo para poder hacer reservas de parqueadero
              </Text>
              <Pressable
                onPress={handleAddVehicle}
                className="bg-axia-green px-8 py-3 rounded-xl active:opacity-80"
              >
                <Text className="text-white font-primaryBold">
                  Añadir Vehículo
                </Text>
              </Pressable>
            </View>
          ) : (
            <View className="gap-4">
              {vehicles.map((vehicle, index) => (
                <Pressable
                  key={vehicle.id || index}
                  onPress={() => handleVehiclePress(vehicle)}
                  className="bg-axia-darkGray rounded-2xl p-4 active:opacity-80 mb-3"
                >
                  <View className="flex-row items-start">
                    {/* Icono */}
                    <View className="bg-axia-green/20 w-14 h-14 rounded-full items-center justify-center mr-4">
                      <Ionicons 
                        name={getVehicleIcon(vehicle.type)} 
                        size={28} 
                        color="#10B981" 
                      />
                    </View>

                    {/* Info del vehículo */}
                    <View className="flex-1">
                      <View className="flex-row items-center flex-wrap mb-2">
                        <Text className="text-white text-lg font-primaryBold mr-2">
                          {vehicle.carBrand} {vehicle.model}
                        </Text>
                        <View className="bg-white/10 px-2 py-1 rounded">
                          <Text className="text-white/70 text-xs font-primary">
                            {getVehicleTypeLabel(vehicle.type)}
                          </Text>
                        </View>
                      </View>
                      
                      <View className="flex-row items-center mb-1.5">
                        <Ionicons name="card-outline" size={14} color="#6B7280" />
                        <Text className="text-white/60 text-sm font-primary ml-1">
                          {vehicle.licensePlate}
                        </Text>
                      </View>

                      {vehicle.color && (
                        <View className="flex-row items-center mb-1.5">
                          <Ionicons name="color-palette-outline" size={14} color="#6B7280" />
                          <Text className="text-white/60 text-sm font-primary ml-1">
                            {vehicle.color}
                          </Text>
                        </View>
                      )}

                      {vehicle.engineType && getEngineTypeIcon(vehicle.engineType) && (
                        <View className="flex-row items-center">
                          <View className="flex-row items-center bg-white/5 px-2 py-1 rounded-lg">
                            <Ionicons 
                              name={getEngineTypeIcon(vehicle.engineType)!.icon as any} 
                              size={14} 
                              color={getEngineTypeIcon(vehicle.engineType)!.color} 
                            />
                            <Text className="text-white/70 text-xs font-primary ml-1.5">
                              {getEngineTypeLabel(vehicle.engineType)}
                            </Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {/* Flecha */}
                    <View className="justify-center">
                      <Ionicons name="chevron-forward" size={24} color="#6B7280" />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          )}

          {/* Botón flotante para agregar (cuando hay vehículos) */}
          {vehicles.length > 0 && (
            <Pressable
              onPress={handleAddVehicle}
              className="mt-6 bg-axia-green rounded-2xl py-4 items-center active:opacity-80 shadow-lg"
              style={{ elevation: 5 }}
            >
              <View className="flex-row items-center">
                <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                <Text className="text-white text-lg font-primaryBold ml-2">
                  Añadir Otro Vehículo
                </Text>
              </View>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AllVehiclesScreen;
