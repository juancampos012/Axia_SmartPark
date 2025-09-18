import React from 'react';
import { View, Text, Alert, Pressable } from 'react-native';
import { router } from 'expo-router';
import { logout } from '../../../libs/auth';

const Settings = () => {
  const handleLogout = async () => {
    try {
      await logout();
      router.replace('/');
    } catch (error: any) {
      Alert.alert("Error", error.message || "Ocurrió un error al cerrar sesión");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-purple-100">
      <Text className="text-2xl font-bold text-black mb-6">Ajustes</Text>

      <Pressable
        onPress={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-lg"
      >
        <Text className="text-white text-lg font-semibold text-center">
          Cerrar sesión
        </Text>
      </Pressable>
    </View>
  );
};

export default Settings;
