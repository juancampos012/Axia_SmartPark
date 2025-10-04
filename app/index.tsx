import React from 'react';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Button from '../components/atoms/Button';

// Importar el logo
const AxiaSmartParkLogo = require('../assets/axia-sp1.png');

export default function WelcomeScreen() {
  const router = useRouter();

  const handleLoginPress = () => router.push('/(auth)/login');
  const handleRegisterPress = () => router.push('/(auth)/register');

  return (
    <SafeAreaView className="flex-1 bg-axia-black">
      <View className="flex-1 px-6 py-8">
        {/* Centro: Logo + tagline */}
        <View className="flex-1 items-center justify-center">
          {/* Círculo sutil detrás del logo */}
          <View className="w-80 h-80 items-center justify-center mb-8 pb-2">
            <Image
              source={AxiaSmartParkLogo}
              className="w-80 h-80"
              resizeMode="contain"
            />
          </View>
          
          <Text className="text-white text-5xl font-secondary mb-3 text-center">
            Bienvenido a
          </Text>
          <Text className="text-white text-3xl font-secondary mb-4">
            AXIA SmartPark
          </Text>
          <Text className="text-white/70 text-lg text-center px-8 mb-2 font-primary">
            Tu espacio, tu tiempo, tu ciudad.
          </Text>
          <Text className="text-white/50 text-base text-center px-6 font-primary">
            Encuentra y reserva estacionamiento de forma inteligente
          </Text>
        </View>

        {/* CTAs con mejor spacing */}
        <View className="gap-4 pb-8">
          <Button 
            title="Iniciar sesión" 
            onPress={handleLoginPress} 
            variant="primary" 
            size="large" 
            className="w-full" 
          />
          <Button 
            title="Crear cuenta" 
            onPress={handleRegisterPress} 
            variant="outline" 
            size="large" 
            className="w-full" 
          />
        </View>
      </View>
    </SafeAreaView>
  );
}