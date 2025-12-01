import React from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useProfileScreen } from '../../../../hooks/useProfileScreen';

const PersonalProfile = () => {
  const {
    userProfile,
    userCars,
    loading,
    refreshing,
    menuItems,
    displayName,
    handleMenuItemPress,
    handleCarPress,
    handleViewAllCars,
    handleAddCar,
    handleLogout,
    refreshProfileData,
  } = useProfileScreen();

  const handleLogoutPress = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleLogout();
  };

  return (
    <>
      <SafeAreaView className="flex-1 bg-axia-black" edges={['top', 'left', 'right']}>
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refreshProfileData}
              tintColor="#10B981"
              colors={['#10B981']}
            />
          }
        >
          <View className="flex-1 px-6 pt-8">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="relative mb-4">
                <View className="w-32 h-32 rounded-full border-4 border-axia-green/30 items-center justify-center shadow-2xl bg-axia-darkGray">
                  <Ionicons name="person" size={60} color="#10B981" />
                </View>
              </View>

              <Text className="text-white text-3xl font-primaryBold mb-2">
                {displayName}
              </Text>
              <View className="flex-row items-center bg-axia-green/10 px-4 py-2 rounded-full">
                <Ionicons name="shield-checkmark" size={16} color="#10B981" />
                <Text className="text-axia-green text-sm font-primaryBold ml-2">
                  Cuenta verificada
                </Text>
              </View>
            </View>

          {/* Menú */}
          <View className="mb-8">
            <Text className="text-white text-xl font-primaryBold mb-4">Configuración</Text>
            <View className="bg-axia-darkGray rounded-2xl overflow-hidden shadow-lg shadow-black/30">
              {menuItems.map((item, index) => (
                <Pressable
                  key={item.id}
                  onPress={() => handleMenuItemPress(item.route || '')}
                  className={`flex-row items-center justify-between py-5 px-6 active:bg-axia-gray/20 ${
                    index < menuItems.length - 1 ? 'border-b border-axia-gray/20' : ''
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-axia-green/20 rounded-xl items-center justify-center mr-4">
                      <Ionicons name={item.icon as any} size={20} color="#006B54" />
                    </View>
                    <Text className="text-white text-lg font-primary flex-1">
                      {item.title}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#6B7280" />
                </Pressable>
              ))}
            </View>
          </View>

          {/* Mis Vehículos */}
          <View className="mb-8">
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text className="text-white text-xl font-primaryBold">Mis Vehículos</Text>
                <Text className="text-axia-gray text-sm font-primary">
                  Gestiona tus vehículos registrados
                </Text>
              </View>
              <Pressable
                onPress={handleViewAllCars}
                className="bg-axia-green/20 px-4 py-2 rounded-full active:scale-95"
              >
                <Text className="text-axia-green text-sm font-primaryBold">
                  Ver todos
                </Text>
              </Pressable>
            </View>

            {loading ? (
              <ActivityIndicator size="large" color="#006B54" />
            ) : userCars.length > 0 ? (
              <View className="space-y-4">
                {userCars.map((car) => (
                  <Pressable
                    key={car.id}
                    onPress={() => handleCarPress(car.id)}
                    className="bg-axia-darkGray rounded-2xl p-5 shadow-lg shadow-black/30 active:scale-95 mb-4"
                  >
                    <View className="flex-row items-center">
                      <View className="w-16 h-16 rounded-xl bg-axia-green/20 items-center justify-center mr-4">
                        <Ionicons name="car-sport" size={28} color="#006B54" />
                      </View>

                      <View className="flex-1">
                        <Text className="text-white text-lg font-primaryBold mb-1">
                          {car.carBrand} {car.model}
                        </Text>
                        <View className="flex-row space-x-4">
                          <View className="flex-row items-center">
                            <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
                            <Text className="text-axia-gray text-sm font-primary ml-1">
                              {car.licensePlate}
                            </Text>
                          </View>
                          {car.color && (
                            <View className="flex-row items-center">
                              <Ionicons name="color-palette-outline" size={14} color="#6B7280" />
                              <Text className="text-axia-gray text-sm font-primary ml-1">
                                {car.color}
                              </Text>
                            </View>
                          )}
                        </View>
                      </View>

                      <View className="w-2 h-2 bg-axia-green rounded-full" />
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : (
              <View className="bg-axia-darkGray rounded-2xl p-8 items-center">
                <View className="w-20 h-20 bg-axia-green/10 rounded-full items-center justify-center mb-4">
                  <Ionicons name="car-outline" size={32} color="#006B54" />
                </View>
                <Text className="text-white text-lg font-primaryBold text-center mb-2">
                  Aún no tienes vehículos
                </Text>
                <Text className="text-axia-gray text-sm font-primary text-center mb-6">
                  Agrega tu primer vehículo para empezar
                </Text>
                <Pressable
                  onPress={handleAddCar}
                  className="bg-axia-green px-8 py-4 rounded-xl flex-row items-center shadow-lg shadow-axia-green/25 active:scale-95"
                >
                  <Ionicons name="add" size={20} color="#000000" />
                  <Text className="text-axia-black font-primaryBold ml-2">
                    Agregar Vehículo
                  </Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Sección Legal */}
          <View className="mb-6">
            <Text className="text-white text-xl font-primaryBold mb-4">Legal</Text>
            <View className="bg-axia-darkGray rounded-2xl overflow-hidden shadow-lg shadow-black/30">
              <Pressable
                onPress={async () => {
                  await Haptics.selectionAsync();
                  handleMenuItemPress('/(tabs)/settings/terms-conditions');
                }}
                className="flex-row items-center justify-between py-5 px-6 active:bg-axia-gray/20 border-b border-axia-gray/20"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-axia-blue/20 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="document-text-outline" size={20} color="#093774" />
                  </View>
                  <Text className="text-white text-lg font-primary flex-1">
                    Términos y Condiciones
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </Pressable>
              
              <Pressable
                onPress={async () => {
                  await Haptics.selectionAsync();
                  handleMenuItemPress('/(tabs)/settings/privacy-policy');
                }}
                className="flex-row items-center justify-between py-5 px-6 active:bg-axia-gray/20"
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-10 h-10 bg-axia-purple/20 rounded-xl items-center justify-center mr-4">
                    <Ionicons name="shield-checkmark-outline" size={20} color="#780BB7" />
                  </View>
                  <Text className="text-white text-lg font-primary flex-1">
                    Política de Privacidad
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6B7280" />
              </Pressable>
            </View>
          </View>

          {/* 🔚 Botón Cerrar sesión */}
          <View className="mb-12">
            <Pressable
              onPress={handleLogoutPress}
              className="bg-red-600/90 flex-row items-center justify-center py-4 rounded-xl shadow-lg active:scale-95"
            >
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text className="text-white font-primaryBold text-lg ml-2">
                Cerrar sesión
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </>
  );
};

export default PersonalProfile;
