import React from 'react';
import { Image, Text, View, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '../components/atoms/Button';
import { Ionicons } from '@expo/vector-icons';

// Importar el logo
const AxiaSmartParkLogo = require('../assets/axia-sp1.png');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => router.push('/(auth)/login');
  const handleRegisterPress = () => router.push('/(auth)/register');

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      <View className="flex-1 px-6 py-8">
        
        {/* Logo section - Parte superior */}
        <View className="items-center justify-center mt-4 mb-8">
          <Image
            source={AxiaSmartParkLogo}
            className="w-40 h-40"
            resizeMode="contain"
          />
        </View>

        {/* Texto de bienvenida */}
        <View className="items-center mb-8">
          <Text className="text-white text-4xl font-secondaryBold mb-4 text-center leading-tight">
            Bienvenido a
          </Text>
          <Text className="text-axia-green text-4xl font-secondaryBold mb-6 text-center">
            AXIA SmartPark
          </Text>
          
          <View className="items-center">
            <View className="flex-row items-center mb-4 bg-axia-green/10 px-5 py-3 rounded-full">
              <Ionicons name="sparkles" size={20} color="#10B981" />
              <Text className="text-white/90 text-lg font-primaryBold ml-2">
                Tu espacio, tu tiempo, tu ciudad.
              </Text>
            </View>
            <Text className="text-white/70 text-base text-center font-primary leading-6 px-4">
              Descubre la forma más inteligente de encontrar y reservar estacionamiento
            </Text>
          </View>
        </View>

        {/* Features section */}
        <View className="flex-row justify-between mb-8 px-4">
          <View className="items-center flex-1 mx-2">
            <View className="w-14 h-14 bg-axia-green/20 rounded-2xl items-center justify-center mb-2">
              <Ionicons name="flash" size={24} color="#10B981" />
            </View>
            <Text className="text-white font-primaryBold text-sm mb-1 text-center">Rápido</Text>
            <Text className="text-white/50 text-xs text-center font-primary">En segundos</Text>
          </View>
          
          <View className="items-center flex-1 mx-2">
            <View className="w-14 h-14 bg-axia-green/20 rounded-2xl items-center justify-center mb-2">
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
            </View>
            <Text className="text-white font-primaryBold text-sm mb-1 text-center">Seguro</Text>
            <Text className="text-white/50 text-xs text-center font-primary">Protegido</Text>
          </View>
          
          <View className="items-center flex-1 mx-2">
            <View className="w-14 h-14 bg-axia-green/20 rounded-2xl items-center justify-center mb-2">
              <Ionicons name="time" size={24} color="#10B981" />
            </View>
            <Text className="text-white font-primaryBold text-sm mb-1 text-center">24/7</Text>
            <Text className="text-white/50 text-xs text-center font-primary">Siempre activo</Text>
          </View>
        </View>

        {/* Botones de acción - Parte inferior */}
        <View className="flex-1 justify-end gap-4 pb-4">
          <Button 
            title={
              <View className="flex-row items-center justify-center">
                <Ionicons name="log-in" size={20} color="#ffffff" />
                <Text className="text-white font-primaryBold ml-2">
                  Iniciar sesión
                </Text>
              </View>
            }
            onPress={handleLoginPress} 
            variant="primary" 
            size="large" 
            className="w-full rounded-xl" 
          />
          
          <Button 
            title={
              <View className="flex-row items-center justify-center">
                <Ionicons name="person-add" size={20} color="#10B981" />
                <Text className="text-axia-green font-primaryBold  ml-2">
                  Crear cuenta
                </Text>
              </View>
            }
            onPress={handleRegisterPress} 
            variant="outline" 
            size="large" 
            className="w-full border-2 border-axia-green rounded-xl bg-axia-green/5" 
          />
        </View>

      </View>
    </SafeAreaView>
  );
}