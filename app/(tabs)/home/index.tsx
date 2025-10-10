import { View, Text, Alert } from 'react-native'
import React from 'react'
import { router } from 'expo-router'  
import { Pressable } from 'react-native'
import { useAuth } from '../../../context/AuthContext'

const home = () => {
    const { user, signOut } = useAuth();
  
    const handleLogout = async () => {
              try {
                await signOut();
                router.navigate('/(auth)');
              } catch (error: any) {
                Alert.alert("Error", error.message || "Ocurrió un error al cerrar sesión");
              }
    };
  return (
    <View className="flex-1 items-center justify-center bg-axia-black">
      <Text className="text-2xl font-secondary text-axia-green">Inicio</Text>
                <Pressable
                  onPress={handleLogout}
                  className="bg-axia-green px-8 py-4 rounded-xl flex-row items-center shadow-lg shadow-axia-green/25 active:scale-95"
                >
                  <Text className="text-axia-black font-primaryBold ml-2">
                    Borrar token
                  </Text>
                </Pressable>
    </View>
  )
}

export default home